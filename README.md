Clear Feed
A productivity-focused application designed to strip away the algorithmic fluff from social media, starting with YouTube. Clear Feed allows users to watch content from their favorite channels without the distraction of recommendations, autoplay, or comments, creating a calmer, more intentional viewing experience.

About The Project
This project was born from the idea that social media can be a tool, not a trap. Modern platforms are engineered to maximize user engagement, often at the expense of the user's time and focus.

Clear Feed's purpose is to reclaim that focus. By acting as a clean interface for platforms like YouTube, it removes the unnecessary information (like algorithm-driven recommendations) and provides a direct, uncluttered feed of content you've chosen to watch.

Core Features
Distraction-Free Viewing: Paste any YouTube channel URL and get a clean, chronological feed of its videos.

No Recommendations: The app does not show "recommended for you" videos, breaking the cycle of endless consumption.

High-Performance Caching: Utilizes a persistent Redis cache (via Upstash) to deliver a blazing-fast user experience and efficiently manage YouTube API quotas.

Production-Ready: Built with a professional mindset, incorporating error tracking with Sentry and a modular architecture for maintainability.

Built With
This project leverages a modern, professional tech stack:

Next.js - React Framework for Production

Tailwind CSS - A utility-first CSS framework

Redis (Upstash) - For persistent, high-performance caching

Sentry - For real-time application performance monitoring and error tracking

ESLint & Prettier - For code quality and consistent formatting

Getting Started
This guide provides instructions for setting up the project locally.

Prerequisites
Node.js (v18.x or later recommended)

npm or yarn

Git

Local Setup
Navigate to the project directory:
Open your terminal in the web sub-directory of the project.

Install NPM packages:
If you haven't already, install the project dependencies.

npm install

Set up Environment Variables:
This project requires several API keys to function. Ensure you have a .env.local file in the web directory with the following variables.

# Get from Google Cloud Console. Must have YouTube Data API v3 enabled.

YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

# Get from your Upstash Redis database dashboard.

UPSTASH_REDIS_REST_URL="YOUR_UPSTASH_URL"
UPSTASH_REDIS_REST_TOKEN="YOUR_UPSTASH_TOKEN"

# The Sentry DSN is optional for local development but required for error tracking.

# Get from your Sentry project settings.

SENTRY_DSN="YOUR_SENTRY_DSN"

Run the Development Server:

npm run dev

Open http://localhost:3000 with your browser to see the result.

Deployment
This application is configured for seamless deployment on the Vercel Platform.

When deploying, remember to add the environment variables from your .env.local file to the Vercel project settings.

For more details, see the Next.js deployment documentation.
