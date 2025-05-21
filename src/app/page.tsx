import { SignInButton, SignUpButton, auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = auth()
  
  return (
    <div className="container">
      <div className="py-4">
        <div className="text-center">
          <h1 className="card-title" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            Tailor Your Resume with AI
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--gray-600)', marginBottom: '2rem' }}>
            Automatically customize your resume for each job application while preserving your original design.
            Let AI enhance your professional summary, add relevant skills, and generate job-specific bullet points.
          </p>
          <div className="flex justify-center gap-4">
            {userId ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <button className="btn btn-primary">
                    Get Started
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="btn">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 