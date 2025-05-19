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
    <html lang="en">
      <body className={inter.className} style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <ClerkProvider
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: 'var(--primary)',
              colorBackground: 'var(--background)',
              colorText: 'var(--foreground)',
            },
          }}
        >
          <main>
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
