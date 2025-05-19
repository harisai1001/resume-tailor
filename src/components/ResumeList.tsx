'use client'

import { useState, useEffect } from 'react'
import { DocumentIcon, PencilIcon } from '@heroicons/react/24/outline'
import TailorResumeModal from './TailorResumeModal'

type Resume = {
  id: string
  name: string
  originalFile: string
  createdAt: string
}

export default function ResumeList() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch resumes on component mount
  useEffect(() => {
    fetch('/api/resumes')
      .then(res => res.json())
      .then(data => setResumes(data))
      .catch(err => console.error('Failed to fetch resumes:', err))
  }, [])

  const handleTailor = (resume: Resume) => {
    setSelectedResume(resume)
    setIsModalOpen(true)
  }

  if (resumes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>
        No resumes uploaded yet. Upload your first resume above!
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <div className="flex flex-col gap-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DocumentIcon style={{ width: '1.5rem', height: '1.5rem', color: '#9ca3af' }} />
                  <div>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-900)' }}>{resume.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleTailor(resume)}
                  className="btn btn-primary"
                >
                  <PencilIcon style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                  Tailor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedResume && (
        <TailorResumeModal
          resume={selectedResume}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedResume(null)
          }}
        />
      )}
    </>
  )
} 