'use client';

import React, { useEffect, useState } from 'react';
import HeroBlock from '../../../block/HeroBlock';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/Landingpage1.css';

type Block = {
  type: 'hero';
  props: {
    heading: string;
    subtitle: string;
    cta: string;
  };
};

export default function Landingpage1() {
  const [layout, setLayout] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('heroBlockData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLayout([{ type: 'hero', props: parsed }]);
        setLoading(false);
      } catch (err) {
        console.error('Invalid localStorage data:', err);
        fetchContentfulData(); 
      }
    } else {
      fetchContentfulData();
    }
  }, []);

  const fetchContentfulData = async () => {
    const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'xzeeq848ln0v';
    const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN || 'edb_03lsmga3J9GfQ_lKQLrNgdQA7Jfm9KodncA5b7I';

    try {
      const res = await fetch(`https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          query: `
            query {
              landingPageCollection(where: { slug: "page-1" }, limit: 1) {
                items {
                  layoutCollection {
                    items {
                      __typename
                      ... on HeroBlock {
                        heading
                        subtitle
                        cta
                      }
                    }
                  }
                }
              }
            }
          `,
        }),
      });

      const json = await res.json();
      const raw = json?.data?.landingPageCollection?.items?.[0]?.layoutCollection?.items || [];

      const layout: Block[] = raw
        .filter((b: any) => b.__typename === 'HeroBlock')
        .map((b: any) => ({
          type: 'hero',
          props: {
            heading: b.heading || '',
            subtitle: b.subtitle || '',
            cta: b.cta || '',
          },
        }));

      setLayout(layout);

      if (layout.length > 0) {
        localStorage.setItem('heroBlockData', JSON.stringify(layout[0].props));
      }
    } catch (err) {
      console.error('Error fetching Contentful data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : layout.length === 0 ? (
        <p className="loading-text">No HeroBlocks found. Please check Contentful or your fetch logic.</p>
      ) : (
        layout.map((block, i) => {
          if (block.type === 'hero') {
            const key = `${block.props.heading}-${block.props.subtitle}-${block.props.cta}-${i}`;
            return (
              <div key={key} className="hero-wrapper">
                <HeroBlock {...block.props} />
              </div>
            );
          }
          return null;
        })
      )}
      <ToastContainer position="top-center" />
    </div>
  );
}
