import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Resume Tailor - AI-Powered Resume Customization',
  description: 'Automatically tailor your resume to job descriptions while preserving your original design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ minHeight: '100vh', background: 'var(--background)' }} suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: 'var(--primary)',
              colorBackground: 'var(--background)',
              colorText: 'var(--foreground)',
            },
          }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <main>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
