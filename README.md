# Resume Tailor - AI-Powered Resume Customization

Resume Tailor is a web application that helps job seekers customize their resumes for specific job applications while preserving the original design and formatting. The AI-powered platform analyzes your resume and the job description to:

1. Enhance your professional summary
2. Add relevant technical skills
3. Generate job-specific bullet points

## Features

- **Upload Resume**: Upload your Word document (DOCX format)
- **Smart Editing**: AI-powered modifications to your resume content
- **AI Analysis**: Powered by GPT-4 for intelligent resume tailoring
- **Secure Authentication**: User authentication via Clerk
- **Easy Download**: Get your tailored resume in DOCX format

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4
- **File Storage**: Cloudinary
- **Styling**: Custom CSS (No Tailwind)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- Clerk account for authentication
- Cloudinary account for file storage

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/resume_tailor_db?schema=public"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/resume-tailor.git
cd resume-tailor
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Sign up or log in to your account
2. Upload your resume in DOCX format
3. Click "Tailor Resume" and paste the job description
4. Review the AI-generated improvements
5. Download your tailored resume in DOCX format

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio to manage database

## License

MIT 