import { Inter } from "next/font/google";
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#f97316" />
                <link rel="icon" href="/logo.png" />
                <link rel="shortcut icon" href="/logo.png" />
                <link rel="apple-touch-icon" href="/logo.png" />
                <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
                <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased bg-slate-50 min-h-screen flex flex-col overflow-x-hidden`}>
                {children}
            </body>
        </html>
    )
}
