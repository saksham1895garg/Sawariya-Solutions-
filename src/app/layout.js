import { initDb, query } from '@/lib/db';
import ReduxProvider from '@/components/ReduxProvider';
import './globals.css';

export async function generateMetadata() {
  try {
    await initDb();
    const settings = await query('SELECT meta_title, meta_description, meta_keywords FROM settings WHERE id = 1');
    if (settings.length > 0) {
      return {
        title: settings[0].meta_title || 'Sawariya Solution',
        description: settings[0].meta_description || 'Enterprise Digital Consulting',
        keywords: settings[0].meta_keywords || 'sawariya, consulting',
      };
    }
  } catch (e) {
    console.error('Failed to generate metadata from DB settings:', e);
  }

  return {
    title: 'Sawariya Solution | Enterprise Digital Consulting & Engineering',
    description: 'We engineer high-performance systems, AI automation, and cloud solutions for global enterprises.',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
