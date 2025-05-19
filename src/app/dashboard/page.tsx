import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import ResumeUploader from '@/components/ResumeUploader'
import ResumeList from '@/components/ResumeList'

export default async function Dashboard() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Resume Dashboard</h1>
          
          <div className="mt-8">
            <ResumeUploader />
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
            <div className="mt-4">
              <ResumeList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 