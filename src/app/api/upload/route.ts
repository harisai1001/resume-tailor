import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import cloudinary from '@/lib/cloudinary'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return NextResponse.json({ error: 'Please upload a DOCX file' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64File = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64File}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'raw',
      folder: 'resume-tailor',
      public_id: `${userId}-${Date.now()}-${file.name}`,
    })

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId,
        name: file.name,
        originalFile: result.secure_url,
      },
    })

    return NextResponse.json(resume)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 