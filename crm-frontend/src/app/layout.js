import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'CRM Suite - Customer Relationship Management',
  description: 'Modern CRM application for managing leads, customers, tasks and activities',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f43f5e', secondary: '#fff' },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
