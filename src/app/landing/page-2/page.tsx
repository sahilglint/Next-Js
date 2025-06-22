'use client';

import React, { useEffect, useState } from 'react';
import TwoColumnRow from '../../../block/TwoColumnRow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/Landingpage2.css';

type BlockType = {
  type: 'twoColumn';
  props: {
    heading: string;
    subtitle: string;
    cta: string;
  };
};

export default function Landingpage2() {
  const [layout, setLayout] = useState<BlockType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('twoColumnRowData');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLayout([{ type: 'twoColumn', props: parsed }]);
        setLoading(false);
      } catch (e) {
        console.error('Invalid saved layout:', e);
        fetchContentfulData(); 
      }
    } else {
      fetchContentfulData();
    }
  }, []);

  const fetchContentfulData = async () => {
    const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'xzeeq848ln0v';
    const ACCESS_TOKEN =
      process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_TOKEN || 'edb_03lsmga3J9GfQ_lKQLrNgdQA7Jfm9KodncA5b7I';

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
              landingPageCollection(where: { slug: "page-2" }, limit: 1) {
                items {
                  layoutCollection {
                    items {
                      __typename
                      ... on TwoColumnRow {
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

      const layout: BlockType[] = raw
        .filter((b: any) => b.__typename === 'TwoColumnRow')
        .map((b: any) => ({
          type: 'twoColumn',
          props: {
            heading: b.heading || '',
            subtitle: b.subtitle || '',
            cta: b.cta || '',
          },
        }));

      setLayout(layout);

      if (layout.length > 0) {
        localStorage.setItem('twoColumnRowData', JSON.stringify(layout[0].props));
      }
    } catch (err) {
      console.error('Error fetching Contentful data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landingpage2-container">
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        layout.map((block, i) => {
          if (block.type === 'twoColumn') {
            const key = `${block.props.heading}-${block.props.subtitle}-${block.props.cta}-${i}`;
            return (
              <div key={key} className="block-wrapper">
                <TwoColumnRow {...block.props} />
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
