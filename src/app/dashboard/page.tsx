import React from 'react'
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
    <div className="container">
      <div className="py-4">
        <h1 className="card-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          My Resumes
        </h1>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="card">
            <h2 className="card-title">Upload New Resume</h2>
            <ResumeUploader userId={userId} />
          </div>

          <div className="card">
            <h2 className="card-title">Your Resumes</h2>
            <ResumeList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  )
} 