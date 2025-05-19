'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

export default function ResumeUploader() {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file || file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      alert('Please upload a DOCX file')
      return
    }

    try {
      setUploading(true)
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      // Refresh the page to show the new resume
      window.location.reload()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className={`card flex flex-col items-center ${isDragActive ? 'border-primary' : ''} ${uploading ? 'opacity-50' : ''}`}
      style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
    >
      <input {...getInputProps()} disabled={uploading} />
      <CloudArrowUpIcon style={{ width: '3rem', height: '3rem', color: '#9ca3af' }} />
      <p className="mt-2 text-gray-900" style={{ fontWeight: 600 }}>
        {isDragActive ? "Drop your resume here..." : "Drag 'n' drop your resume, or click to select"}
      </p>
      <p className="mt-1" style={{ fontSize: '0.875rem', color: '#6b7280' }}>Word document (DOCX) only</p>
      {uploading && (
        <p className="mt-2" style={{ fontSize: '0.875rem', color: '#4f46e5' }}>Uploading...</p>
      )}
    </div>
  )
} 