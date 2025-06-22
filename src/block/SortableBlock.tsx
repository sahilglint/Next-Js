'use client';

import React, { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import '../styles/SortableBlock.css';

interface SortableBlockProps {
  id: string;
  children: ReactNode;
}

const SortableBlock: React.FC<SortableBlockProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition ?? undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="sortable-block">
      <div {...attributes} {...listeners} className="sortable-handle">
        Drag
      </div>
      <div className="sortable-content">{children}</div>
    </div>
  );
};

export default SortableBlock;
