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
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} disabled={uploading} />
      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm font-semibold text-gray-900">
        {isDragActive ? (
          "Drop your resume here..."
        ) : (
          "Drag 'n' drop your resume, or click to select"
        )}
      </p>
      <p className="mt-1 text-xs text-gray-500">Word document (DOCX) only</p>
      {uploading && (
        <p className="mt-2 text-sm text-indigo-600">Uploading...</p>
      )}
    </div>
  )
} 