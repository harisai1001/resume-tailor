import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import { Document, Paragraph, TextRun, Packer } from 'docx'
import mammoth from 'mammoth'
import OpenAI from 'openai'
import cloudinary from '@/lib/cloudinary'

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeId, jobDescription } = await request.json()

    // Get the original resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    })

    if (!resume || resume.userId !== userId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Download the file from Cloudinary
    const response = await fetch(resume.originalFile)
    const docxBuffer = await response.arrayBuffer()
    
    // Extract text from DOCX
    const { value: resumeText } = await mammoth.extractRawText({ buffer: Buffer.from(docxBuffer) })

    // Use OpenAI to analyze and generate improvements
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert resume tailoring assistant. Analyze the resume and job description to:
1. Enhance the professional summary to better match the job
2. Identify relevant technical skills that should be added
3. Generate 2-3 job-specific bullet points that should be added to the most relevant experience section.
Format your response as JSON with the following structure:
{
  "enhancedSummary": "string",
  "addedSkills": ["skill1", "skill2"],
  "newBulletPoints": ["bullet1", "bullet2"]
}`
        },
        {
          role: "user",
          content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
        }
      ]
    })

    const improvements = JSON.parse(completion.choices[0].message.content)

    // Generate the tailored DOCX
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: improvements.enhancedSummary,
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun("")], // Empty line
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Additional Skills",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: improvements.addedSkills.join(", "),
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun("")], // Empty line
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Enhanced Experience",
                  bold: true,
                  size: 24,
                }),
              ],
            }),
            ...improvements.newBulletPoints.map(
              (bullet: string) =>
                new Paragraph({
                  bullet: {
                    level: 0,
                  },
                  children: [new TextRun(bullet)],
                })
            ),
          ],
        },
      ],
    })

    // Convert to buffer
    const buffer = await Packer.toBuffer(doc)
    
    // Upload tailored version to Cloudinary
    const base64File = buffer.toString('base64')
    const dataURI = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64File}`
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'raw',
      folder: 'resume-tailor',
      public_id: `${userId}-${Date.now()}-tailored-${resume.name}`,
    })

    // Create a new tailored resume
    const tailoredResume = await prisma.tailoredResume.create({
      data: {
        userId,
        resumeId,
        jobDescription,
        enhancedSummary: improvements.enhancedSummary,
        addedSkills: improvements.addedSkills,
        newBulletPoints: improvements.newBulletPoints,
        tailoredFile: uploadResult.secure_url
      }
    })

    return NextResponse.json(tailoredResume)
  } catch (error) {
    console.error('Tailoring error:', error)
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    )
  }
} 