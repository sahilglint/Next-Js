'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBlock } from '../../redux/layoutSlice';
import { v4 as uuid } from 'uuid';
import { FaChevronLeft, FaChevronRight, FaImage, FaThLarge, FaColumns } from 'react-icons/fa';
import '../../styles/Sidebar.css';

import type {
  BlockType,
  HeroBlockData,
  TwoColumnRowData,
  ImageGridData,
} from '../../redux/layoutSlice';

const COMPONENTS = [
  { type: 'hero', label: 'Hero Block', icon: <FaImage className="icon" /> },
  { type: 'twoColumn', label: 'Two Column Row', icon: <FaColumns className="icon" /> },
  { type: 'imageGrid', label: '2×2 Image Grid', icon: <FaThLarge className="icon" /> },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAdd = (type: BlockType) => {
    let data: HeroBlockData | TwoColumnRowData | ImageGridData;

    switch (type) {
      case 'hero':
        data = {
          heading: 'Hero Heading',
          subtitle: 'Hero Subtitle',
          cta: 'Click Me',
        };
        break;

      case 'twoColumn':
        data = {
          heading: 'Two Column Heading',
          subtitle: 'Two Column Subtitle',
          cta: 'Click Here',
          imageUrl: '',
        };
        break;

      case 'imageGrid':
        data = {
          images: ['', '', '', ''],
        };
        break;

      default:
        return;
    }

    dispatch(addBlock({ id: uuid(), type, data }));
  };

  return (
    <div className={`sidebar ${collapsed || isSmallScreen ? 'collapsed' : ''}`}>
      <div className="sidebar-inner">
        {!isSmallScreen && (
          <div className={`toggle-wrapper ${collapsed ? 'center' : 'right'}`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="toggle-btn"
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>
        )}

        {!collapsed && !isSmallScreen && <h2 className="sidebar-heading">Add Component</h2>}

        <div className="component-list">
          {COMPONENTS.map((c) => (
            <button
              key={c.type}
              onClick={() => handleAdd(c.type as BlockType)}
              className={`component-btn ${collapsed || isSmallScreen ? 'centered' : ''}`}
              title={collapsed || isSmallScreen ? c.label : ''}
            >
              <span className="icon-wrapper">{c.icon}</span>
              {!collapsed && !isSmallScreen && <span className="label">{c.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
