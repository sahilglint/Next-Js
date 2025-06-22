'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reorderBlocks, Block } from '../redux/layoutSlice';
import { RootState } from '../redux/types';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import HeroBlock from '../block/HeroBlock';
import TwoColumnRow from '../block/TwoColumnRow';
import ImageGrid from '../block/Imagegrid'; 
import SortableBlock from '../block/SortableBlock';

import '../styles/LayoutCanvas.css';

import type {
  HeroBlockData,
  TwoColumnRowData,
  ImageGridData,
} from '../redux/layoutSlice';

const LayoutCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector((state: RootState) => state.layout.present.blocks);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active?.id || !over?.id || active.id === over.id) return;

    const oldIndex = layout.findIndex((block) => block.id === active.id);
    const newIndex = layout.findIndex((block) => block.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      console.warn('⚠️ Invalid drag indexes:', { oldIndex, newIndex });
      return;
    }

    const newBlocks = arrayMove(layout, oldIndex, newIndex);
    dispatch(reorderBlocks(newBlocks));
  };

  const renderBlock = (block: Block) => {
    const { id, type, data } = block;

    switch (type) {
      case 'hero':
        return (
          <SortableBlock key={id} id={id}>
            <HeroBlock {...(data as HeroBlockData)} />
          </SortableBlock>
        );
      case 'twoColumn':
        return (
          <SortableBlock key={id} id={id}>
            <TwoColumnRow {...(data as TwoColumnRowData)} />
          </SortableBlock>
        );
      case 'imageGrid':
        return (
          <SortableBlock key={id} id={id}>
            <ImageGrid /> 
          </SortableBlock>
        );
      default:
        return null;
    }
  };

  return (
    <div className="layout-canvas">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={layout.map((block) => block.id)}
          strategy={rectSortingStrategy}
        >
          <div className="block-list">
            {layout.map(renderBlock)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LayoutCanvas;
