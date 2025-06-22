'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/HeroBlock.css';

interface HeroBlockProps {
  heading: string;
  subtitle: string;
  cta: string;
}

const HeroBlock: React.FC<HeroBlockProps> = ({ heading, subtitle, cta }) => {
  const [currentImage, setCurrentImage] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [isFading, setIsFading] = useState(false);

  const [content, setContent] = useState({
    heading,
    subtitle,
    cta,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ heading: '', subtitle: '', cta: '' });

  const getRandomImage = () =>
    `https://picsum.photos/1200/500?random=${Math.floor(Math.random() * 10000)}`;

  useEffect(() => {
    const preloadImage = () => {
      const img = new Image();
      const newUrl = getRandomImage();
      img.src = newUrl;
      img.onload = () => {
        setNextImage(newUrl);
        setIsFading(true);
        setTimeout(() => {
          setCurrentImage(newUrl);
          setIsFading(false);
        }, 1000);
      };
    };

    preloadImage();
    const interval = setInterval(preloadImage, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('heroBlockData');
    if (saved) {
      setContent(JSON.parse(saved));
    } else {
      setContent({ heading, subtitle, cta });
    }
  }, [heading, subtitle, cta]);

  const openEdit = () => {
    setFormData(content);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setContent(formData);
    localStorage.setItem('heroBlockData', JSON.stringify(formData));
    setIsModalOpen(false);
    toast.success('Hero Block updated!');
  };

  return (
    <div className="hero-container">
      {currentImage && (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${currentImage})`, opacity: isFading ? 0 : 1 }}
        />
      )}
      {nextImage && isFading && (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${nextImage})`, opacity: 1 }}
        />
      )}
      <div className="hero-overlay" />

      <button onClick={openEdit} className="edit-button" title="Edit Hero">
        <FiEdit size={20} />
      </button>

      <div className="hero-content">
        <AnimatePresence mode="wait">
          <motion.h2
            key={content.heading}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="hero-heading"
          >
            {content.heading}
          </motion.h2>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={content.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="hero-subtitle"
          >
            {content.subtitle}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.button
            key={content.cta}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hero-cta"
          >
            {content.cta}
          </motion.button>
        </AnimatePresence>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Hero Content</h3>
            <input
              className="modal-input"
              placeholder="Heading"
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            />
            <input
              className="modal-input"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
            <input
              className="modal-input"
              placeholder="CTA Text"
              value={formData.cta}
              onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleSave} className="modal-btn save">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default HeroBlock;
