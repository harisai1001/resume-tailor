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
      <div className="text-center py-6 text-gray-500">
        No resumes uploaded yet. Upload your first resume above!
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="relative rounded-lg border border-gray-200 p-4 hover:border-gray-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{resume.name}</h3>
                  <p className="text-xs text-gray-500">
                    Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTailor(resume)}
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Tailor resume</span>
              </button>
            </div>
          </div>
        ))}
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