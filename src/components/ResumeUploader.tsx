'use client'

import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

interface ResumeUploaderProps {
  userId: string
}

export default function ResumeUploader({ userId }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setIsUploading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', userId)
        formData.append('name', file.name.replace('.docx', ''))

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload resume')
        }

        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload resume')
      } finally {
        setIsUploading(false)
      }
    }
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-gray-50' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop your resume here...</p>
        ) : (
          <div>
            <p className="mb-2">Drag and drop your resume here, or click to select</p>
            <p className="text-sm text-gray-500">Only .docx files are supported</p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
} 