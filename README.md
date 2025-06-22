# Topic Master - Personalized Learning Quiz Generator

A web application that generates personalized multiple-choice quizzes from lecture notes using OpenAI's GPT-4.1-nano API. Built with Next.js, Firebase, and modern web technologies.

## Features

- Generate personalized quizzes from lecture notes using OpenAI GPT-3.5
- Secure user authentication with Firebase Auth
- Real-time quiz generation and scoring
- Session history tracking
- Responsive design with Tailwind CSS
- Modern UI components with shadcn/ui

## Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: OpenAI GPT-3.5 API
- **UI Components**: shadcn/ui, Radix UI

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Firebase account
- OpenAI API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/topic-master.git
cd topic-master
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add the environment variables in Vercel's project settings
4. Deploy!

## License

MIT 
