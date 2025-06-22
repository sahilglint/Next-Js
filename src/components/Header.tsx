'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { ActionCreators } from 'redux-undo';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/Toolbar.css';

const Header = () => {
  const dispatch = useAppDispatch();
  const past = useAppSelector((state) => state.layout.past);
  const future = useAppSelector((state) => state.layout.future);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/landing/page-1', label: 'Landing-Page 1' },
    { href: '/landing/page-2', label: 'Landing-Page 2' },
  ];

  return (
    <header className="toolbar">
      <div className="toolbar-logo">
        <Link href="/">
          <Image src="/img/logo.png" alt="Logo" width={60} height={35} />
        </Link>
      </div>

      <nav className="toolbar-nav">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
            <span className="nav-underline" />
          </Link>
        ))}
      </nav>

      <div className="toolbar-controls">
        <button onClick={() => dispatch(ActionCreators.undo())} disabled={past.length === 0}>
          Undo
        </button>
        <button onClick={() => dispatch(ActionCreators.redo())} disabled={future.length === 0}>
          Redo
        </button>
      </div>

      <div className="toolbar-mobile-toggle">
        <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle Menu">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="toolbar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="toolbar-mobile-nav"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
