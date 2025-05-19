import { SignInButton, SignUpButton, auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = auth()
  
  return (
    <div className="container">
      {/* Hero section */}
      <div style={{ paddingTop: '3.5rem' }}>
        <div style={{ padding: '6rem 0' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '3.75rem',
              fontWeight: 'bold',
              color: 'var(--gray-900)',
              lineHeight: 1.2
            }}>
              Tailor Your Resume with AI
            </h1>
            <p style={{ 
              marginTop: '1.5rem',
              fontSize: '1.125rem',
              lineHeight: '1.75',
              color: 'var(--gray-600)'
            }}>
              Automatically customize your resume for each job application while preserving your original design. 
              Let AI enhance your professional summary, add relevant skills, and generate job-specific bullet points.
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
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
                      Sign In <span aria-hidden="true">→</span>
                    </button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '0.5rem'
          }}>
            Smart Resume Tailoring
          </h2>
          <p style={{ 
            fontSize: '2.25rem',
            fontWeight: 'bold',
            color: 'var(--gray-900)',
            lineHeight: 1.2
          }}>
            Everything you need to customize your resume
          </p>
        </div>

        <div style={{ 
          marginTop: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div className="card">
            <h3 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '1rem'
            }}>
              Enhanced Professional Summary
            </h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Our AI analyzes your existing summary and the job description to create a tailored professional summary that highlights your most relevant experiences.
            </p>
          </div>
          <div className="card">
            <h3 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '1rem'
            }}>
              Smart Skill Matching
            </h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Automatically identify and add missing technical skills that are relevant to the job posting while maintaining your existing skill set.
            </p>
          </div>
          <div className="card">
            <h3 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '1rem'
            }}>
              Targeted Experience Bullets
            </h3>
            <p style={{ color: 'var(--gray-600)' }}>
              Generate 2-3 job-specific bullet points that highlight your most relevant experiences and seamlessly integrate them into your existing resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
