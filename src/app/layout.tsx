import './globals.css';
import {ReduxProvider} from "../redux/provider";
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Sidebar from './sidebar/Sidebar';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Next.js + Redux',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Header />
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flex: 1 }}>{children}</main>
          </div>

          
        </ReduxProvider>
      </body>
    </html>
  );
}
