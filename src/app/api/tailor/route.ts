import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import mammoth from 'mammoth'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()
const openai = new OpenAI()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeId, jobDescription } = await request.json()

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume ID and job description are required' },
        { status: 400 }
      )
    }

    // Get the original resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume || resume.userId !== userId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Download and parse the original resume
    const response = await fetch(resume.originalFile)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const { value: originalText } = await mammoth.extractRawText({ buffer })

    // Generate AI improvements
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer. Your task is to analyze a resume and a job description, then provide specific improvements to make the resume more relevant to the job. Focus on enhancing the professional summary, adding relevant technical skills, and generating job-specific bullet points for work experience.',
        },
        {
          role: 'user',
          content: `Original Resume:\n${originalText}\n\nJob Description:\n${jobDescription}\n\nPlease provide:\n1. An enhanced professional summary\n2. A list of relevant technical skills to add\n3. New bullet points for work experience that align with the job requirements`,
        },
      ],
    })

    const aiResponse = completion.choices[0].message.content
    if (!aiResponse) {
      throw new Error('Failed to generate AI improvements')
    }

    // Parse AI response
    const sections = aiResponse.split('\n\n')
    const enhancedSummary = sections[0].replace('Enhanced Professional Summary:', '').trim()
    const addedSkills = sections[1]
      .replace('Relevant Technical Skills:', '')
      .trim()
      .split('\n')
      .map(skill => skill.replace('- ', '').trim())
    const newBulletPoints = sections[2]
      .replace('New Work Experience Bullet Points:', '')
      .trim()
      .split('\n')
      .map(point => point.replace('- ', '').trim())

    // Create new document with improvements
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(enhancedSummary)],
          }),
          new Paragraph({
            children: [new TextRun('\nTechnical Skills:')],
          }),
          ...addedSkills.map(skill => 
            new Paragraph({
              children: [new TextRun(`• ${skill}`)],
            })
          ),
          new Paragraph({
            children: [new TextRun('\nWork Experience:')],
          }),
          ...newBulletPoints.map(point =>
            new Paragraph({
              children: [new TextRun(`• ${point}`)],
            })
          ),
        ],
      }],
    })

    // Generate DOCX buffer
    const docxBuffer = await Packer.toBuffer(doc)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'tailored_resumes',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(docxBuffer)
    })

    const { secure_url } = uploadResponse as { secure_url: string }

    // Save to database
    const tailoredResume = await prisma.tailoredResume.create({
      data: {
        userId,
        resumeId,
        jobDescription,
        enhancedSummary,
        addedSkills,
        newBulletPoints,
        tailoredFile: secure_url,
      },
    })

    return NextResponse.json(tailoredResume)
  } catch (error) {
    console.error('Tailor error:', error)
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    )
  }
} 