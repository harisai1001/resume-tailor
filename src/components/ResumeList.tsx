'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TailorResumeModal from './TailorResumeModal'

interface Resume {
  id: string
  name: string
  createdAt: string
  tailoredResumes: {
    id: string
    jobDescription: string
    createdAt: string
  }[]
}

interface ResumeListProps {
  userId: string
}

export default function ResumeList({ userId }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes')
      if (!response.ok) {
        throw new Error('Failed to fetch resumes')
      }
      const data = await response.json()
      setResumes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resumes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete resume')
      }

      setResumes(resumes.filter(resume => resume.id !== resumeId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume')
    }
  }

  if (isLoading) {
    return <p>Loading resumes...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  if (resumes.length === 0) {
    return <p>No resumes uploaded yet. Upload your first resume above!</p>
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {resumes.map((resume) => (
          <div key={resume.id} className="card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{resume.name}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                {resume.tailoredResumes.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {resume.tailoredResumes.length} tailored version{resume.tailoredResumes.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedResume(resume)}
                  className="btn btn-primary"
                >
                  Tailor Resume
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedResume && (
        <TailorResumeModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
          onSuccess={() => {
            setSelectedResume(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
} 