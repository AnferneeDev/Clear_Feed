# Clear Feed

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-clear--feed.vercel.app-brightgreen?style=for-the-badge)](https://clear-feed.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_PROFILE)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Magic UI](https://img.shields.io/badge/Magic%20UI-000000?style=for-the-badge&logo=magicui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg?style=for-the-badge)

</div>

---

<div align="center">

### 🚀 [View Live Demo](https://clear-feed.vercel.app)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Core Features](#-core-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

Clear Feed is a productivity-focused application designed to strip away the algorithmic fluff from social media, starting with YouTube.

It allows users to watch content from their favorite channels **without recommendations, autoplay, or comments**, creating a calmer, more intentional viewing experience.

---

## ✨ Core Features

- **Distraction-Free Viewing**: Paste any YouTube channel URL and get a clean, chronological feed of its videos.
- **No Recommendations**: Break the cycle of endless consumption by removing "recommended for you" videos.
- **High-Performance Caching**: Uses Redis (Upstash) for blazing-fast performance and efficient API quota management.
- **Production-Ready**: Includes error tracking with Sentry and a modular architecture for maintainability.

---

## 📸 Demo

Check out the live website: [clear-feed.vercel.app](https://clear-feed.vercel.app)

> 💡 Add a screenshot or GIF of your app in action here for maximum impact.  
> Example:  
> `![App Demo](assets/images/demo.gif)`

---

## 🛠️ Tech Stack

- **Framework**: Next.js (React)
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Animations**: Magic UI
- **Styling**: Tailwind CSS
- **Caching**: Redis (Upstash)
- **Monitoring**: Sentry
- **Code Quality**: ESLint & Prettier

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn
- Git

### Local Setup

````bash
# Clone the repository
git clone https://github.com/AnferneeDev/Clear_Feed.git

# Navigate to the project directory
cd Clear_Feed/web

# Install dependencies
npm install

## 🔑 Environment Variables

Create a `.env.local` file in the `web` directory and add:

```bash
# YouTube API (Google Cloud Console, YouTube Data API v3 enabled)
YOUTUBE_API_KEY="YOUR_YOUTUBE_API_KEY"

# Upstash Redis
UPSTASH_REDIS_REST_URL="YOUR_UPSTASH_URL"
UPSTASH_REDIS_REST_TOKEN="YOUR_UPSTASH_TOKEN"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"

# Optional: Sentry DSN
SENTRY_DSN="YOUR_SENTRY_DSN"


## ▶️ Run Development Server

```bash
npm run dev
Open http://localhost:3000 in your browser.


## 🚢 Deployment

This project is configured for seamless deployment on **Vercel**.

When deploying, remember to add your environment variables in the Vercel project settings.
For more details, see the [Next.js deployment docs](https://nextjs.org/docs/deployment).

---

## 📜 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)**.

You are free to:

- **Share** — copy and redistribute the material in any medium or format.
- **Adapt** — remix, transform, and build upon the material.

Under the following terms:

- **Attribution** — give appropriate credit.
- **NonCommercial** — you may not use the material for commercial purposes.
- **ShareAlike** — distribute contributions under the same license.

> ℹ️ Add a `LICENSE.txt` file with the full license text for compliance.

---

## 📧 Contact

**Anfernee Pichardo**
[LinkedIn](https://linkedin.com/in/YOUR_PROFILE) • your.email@example.com

Project Link: [https://github.com/AnferneeDev/Clear_Feed](https://github.com/AnferneeDev/Clear_Feed)
````
