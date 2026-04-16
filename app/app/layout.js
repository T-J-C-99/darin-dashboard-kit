import "./globals.css";

export const metadata = {
  title: "Ops Terminal",
  description: "Executive operating dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta httpEquiv="refresh" content="3600" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="bg-zinc-950 text-zinc-200 min-h-screen antialiased">{children}</body>
    </html>
  );
}
