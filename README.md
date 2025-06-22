A dynamic layout editor built with Next js, typeScript, Redux, and Contentful. The app lets users add, edit, and arrange content blocks like Hero sections, Two-Column rows, and Image Grids. Content is persisted using localStorage and stored in Contentful via GraphQL for dynamic rendering at build or runtime.

Reusable Content Blocks:-

HeroBlock: Heading, subtitle, CTA, background image with image fade animation

TwoColumnRow: Left-side text content with right-side image fade

ImageGrid: Upload 1–4 images with captions, live editing, and delete

Drag & Drop Layout (optional/extendable)

State Management with Redux

Layout is stored in Redux with undo/redo (if implemented)

Persisted in localStorage and optionally synced with Contentful

GraphQL + Contentful Integration

Content blocks are fetched and stored using Contentful's GraphQL API

Supports dynamic site generation with getStaticProps or live updates

Editor Mode

Click to edit content inline via modals

Shows toast notifications on successful updates

-> Fully Responsive