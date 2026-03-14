import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BackendStatusProvider } from '@/components/backend-status-provider'
import { cookies } from 'next/headers'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'The Kindle Studio - Hyderabad\'s Most Insta-Worthy Private Theatre',
  description: 'Experience luxury in our boho-themed private theatre or host unforgettable events in our versatile community space. Book your perfect celebration today.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies();
  const hasSeen = cookieStore.get('hasSeenLoadingScreen');

  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} antialiased`}>
        <BackendStatusProvider initialHasSeen={!!hasSeen}>
          {children}
        </BackendStatusProvider>
        <Analytics />
      </body>
    </html>
  )
}
