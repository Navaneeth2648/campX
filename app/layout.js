import './globals.css';

export const metadata = {
  title: 'Sign in - CampX',
  description: 'Sign in to CampX portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
