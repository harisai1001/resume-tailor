import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

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
      <body>
        <ClerkProvider>
          <main className="app">
            {children}
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
} 