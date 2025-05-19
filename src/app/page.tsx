import { SignInButton, SignUpButton, auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = auth()
  
  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Tailor Your Resume with AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Automatically customize your resume for each job application while preserving your original design. 
                Let AI enhance your professional summary, add relevant skills, and generate job-specific bullet points.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {userId ? (
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Get Started
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="text-sm font-semibold leading-6 text-gray-900">
                        Sign In <span aria-hidden="true">→</span>
                      </button>
                    </SignInButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Smart Resume Tailoring</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to customize your resume
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Enhanced Professional Summary
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Our AI analyzes your existing summary and the job description to create a tailored professional summary that highlights your most relevant experiences.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Smart Skill Matching
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Automatically identify and add missing technical skills that are relevant to the job posting while maintaining your existing skill set.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                Targeted Experience Bullets
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Generate 2-3 job-specific bullet points that highlight your most relevant experiences and seamlessly integrate them into your existing resume.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
