import './globals.css';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#0f1012]">{children}</body>
    </html>
  );
}
