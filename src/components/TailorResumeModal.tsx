'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type Resume = {
  id: string
  name: string
  originalFile: string
  createdAt: string
}

type Props = {
  resume: Resume
  isOpen: boolean
  onClose: () => void
}

export default function TailorResumeModal({ resume, isOpen, onClose }: Props) {
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: resume.id,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to tailor resume')
      }

      const data = await response.json()
      
      // Download the tailored resume
      window.location.href = data.tailoredFile

      onClose()
    } catch (error) {
      console.error('Tailoring error:', error)
      alert('Failed to tailor resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" style={{ position: 'relative', zIndex: 10 }} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(107, 114, 128, 0.75)',
            transition: 'opacity 300ms ease-in-out'
          }} />
        </Transition.Child>

        <div style={{ position: 'fixed', inset: 0, zIndex: 10, overflow: 'auto' }}>
          <div style={{
            display: 'flex',
            minHeight: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="card" style={{
                width: '100%',
                maxWidth: '32rem',
                margin: '2rem auto',
                padding: '1.5rem'
              }}>
                <div style={{ position: 'absolute', right: '1rem', top: '1rem' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn"
                  >
                    <span style={{ display: 'none' }}>Close</span>
                    <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                  </button>
                </div>
                
                <div>
                  <Dialog.Title style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--gray-900)',
                    marginBottom: '1rem'
                  }}>
                    Tailor Resume: {resume.name}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label
                        htmlFor="jobDescription"
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'var(--gray-700)',
                          marginBottom: '0.5rem'
                        }}
                      >
                        Paste Job Description
                      </label>
                      <textarea
                        id="jobDescription"
                        name="jobDescription"
                        rows={8}
                        className="input"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        className="btn"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`btn btn-primary ${isLoading ? 'opacity-50' : ''}`}
                        style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                      >
                        {isLoading ? 'Tailoring...' : 'Tailor Resume'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 