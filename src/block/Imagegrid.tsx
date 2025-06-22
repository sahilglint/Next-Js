'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ImageGrid.css';

interface ImageData {
  src: string;
  caption: string;
}

const ImageGrid: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [caption, setCaption] = useState('');
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('imageGrid');
    if (stored) setImages(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('imageGrid', JSON.stringify(images));
    localStorage.setItem('layoutConfig', JSON.stringify({ blocks: images }));
  }, [images]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadedUrl = await uploadToContentful(file);
      const newImages = [...images, { src: uploadedUrl, caption }];
      setImages(newImages);
      setCaption('');
      toast.success('Image added successfully!');
    }
  };

  const uploadToContentful = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const deleteImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const openEditModal = (idx: number) => {
    setEditIdx(idx);
    setEditValue(images[idx].caption);
  };

  const handleEditSave = () => {
    const updated = [...images];
    if (editIdx !== null) {
      updated[editIdx].caption = editValue;
      setImages(updated);
    }
    setEditIdx(null);
    setEditValue('');
    toast.success('Content updated successfully!');
  };

  return (
    <div className="image-grid-container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden-input" />

      <div className="form-bar">
        <input
          type="text"
          placeholder="Enter image caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-input"
        />
        <button onClick={handleImageClick} className="upload-btn">
          Upload Image
        </button>
      </div>

      <div className="grid-wrapper">
        {images.map(({ src, caption }, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="grid-item"
          >
            <img src={src || `https://placehold.co/200x150?text=${idx + 1}`} alt={`grid-${idx}`} className="grid-img" />
            <div className="grid-hover">
              <button onClick={() => openEditModal(idx)} className="grid-btn edit">
                Edit
              </button>
              <button onClick={() => deleteImage(idx)} className="grid-btn delete">
                Delete
              </button>
            </div>
            {caption && <div className="grid-caption">{caption}</div>}
          </motion.div>
        ))}
      </div>

      {editIdx !== null && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Edit Caption</h2>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button onClick={() => setEditIdx(null)} className="modal-btn cancel">Cancel</button>
              <button onClick={handleEditSave} className="modal-btn save">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
