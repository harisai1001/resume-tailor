'use client'

import React, { useState } from 'react'

interface Resume {
  id: string
  name: string
}

interface TailorResumeModalProps {
  resume: Resume
  onClose: () => void
  onSuccess: () => void
}

export default function TailorResumeModal({ resume, onClose, onSuccess }: TailorResumeModalProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobDescription.trim()) return

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: resume.id,
          jobDescription: jobDescription.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to tailor resume')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tailor resume')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Tailor Resume: {resume.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jobDescription" className="form-label">
              Paste the job description here
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="form-input min-h-[200px]"
              placeholder="Copy and paste the job description here..."
              required
            />
          </div>

          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing || !jobDescription.trim()}
            >
              {isProcessing ? 'Processing...' : 'Tailor Resume'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 