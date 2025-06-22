'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TwoColumnRow.css';

type Props = {
  heading?: string;
  subtitle?: string;
  cta?: string;
};

const TwoColumnRow: React.FC<Props> = ({ heading, subtitle, cta }) => {
  const defaultContent = {
    heading: heading || 'Default Heading',
    subtitle: subtitle || 'This is a sample subtitle for two-column layout.',
    cta: cta || 'Click Me',
  };

  const [content, setContent] = useState(defaultContent);
  const [formData, setFormData] = useState(defaultContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('twoColumnRowData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setContent(parsed);
      setFormData(parsed);
    }

    const firstImage = getRandomImage();
    setImageSrc(firstImage);
    setNextImage(firstImage);

    const preloadImage = () => {
      const next = getRandomImage();
      const img = new Image();
      img.src = next;
      img.onload = () => {
        setNextImage(next);
        setIsFading(true);
        setTimeout(() => {
          setImageSrc(next);
          setIsFading(false);
        }, 1000);
      };
    };

    const interval = setInterval(preloadImage, 5000);
    return () => clearInterval(interval);
  }, [heading, subtitle, cta]);

  const getRandomImage = () =>
    `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 10000)}`;

  const openEdit = () => {
    setFormData(content);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setContent(formData);
    localStorage.setItem('twoColumnRowData', JSON.stringify(formData));
    toast.success('Two Column Row updated!');
    setIsModalOpen(false);
  };

  return (
    <div className="two-column-container">
      <button onClick={openEdit} className="edit-button" title="Edit Two Column Row">
        <FiEdit size={20} />
      </button>

      <div className="two-column-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-section"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={content.heading + content.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="heading">{content.heading}</h3>
              <p className="subtitle">{content.subtitle}</p>
            </motion.div>
          </AnimatePresence>

          <motion.button whileTap={{ scale: 0.95 }} className="cta-button">
            {content.cta}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="image-section"
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Current"
              className={`image ${isFading ? 'fade-out' : 'fade-in'}`}
            />
          )}
          {nextImage && isFading && (
            <img src={nextImage} alt="Next" className="image fade-in" />
          )}
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Two Column Content</h3>
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
              <button onClick={() => setIsModalOpen(false)} className="cancel">
                Cancel
              </button>
              <button onClick={handleSave} className="save">
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

export default TwoColumnRow;
