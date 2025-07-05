# 🚀 GitAid – AI-Powered PR Code Review Assistant

> An intelligent code review dashboard that integrates with GitHub to fetch repositories, load pull requests, and generate AI-powered code reviews using OpenAI.

---

## 🎯 Project Overview

**GitAid** is a full-stack web app designed to streamline the code review process. It connects to your GitHub account, lists your repositories, allows you to select an open pull request, and then uses OpenAI to analyze the PR code and provide review suggestions, summaries, and feedback.

---

## 🔍 Problem It Solves

Manual code reviews can be time-consuming — especially for maintainers, project leads, or open-source contributors. GitAid brings **AI-powered automation** into the process by providing:
- High-level summaries
- Suggestions for improvements
- Code readability checks

---

## 💡 Key Features

- 🔐 GitHub OAuth Authentication using NextAuth
- 📂 Lists **all** your repositories (with pagination beyond GitHub's default 30-repo limit)
- 🔍 Filter by repository name or language
- 📥 View open pull requests for each repo
- 🧠 Send PR code to OpenAI for smart review
- 📋 Get AI-generated review summary in a user-friendly format

---

## 🧰 Tech Stack

### 🌐 Frontend
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/) (GitHub OAuth)

### ⚙️ Backend
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- [JWT Authentication](https://jwt.io/)
- [OpenAI API](https://platform.openai.com/)

### 📡 APIs
- [GitHub REST API](https://docs.github.com/en/rest) (repos & pull requests)

---

## 🖥️ Demo

🎥 You can also view the full demo on [LinkedIn](www.linkedin.com/in/prince-desai-420910282) (Attached video)

---

## 🚀 Setup Instructions

### 🔐 Prerequisites
- Node.js v18+
- Python 3.10+
- GitHub OAuth App (for client ID and secret)
- OpenAI API key

### ⚙️ Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Create a `.env.local` file inside `frontend/`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
BACKEND_API_URL=http://localhost:8000
```

### 🧠 Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` file inside `backend/`:

```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_ACCESS_TOKEN=your_github_token
ALLOWED_ORIGINS=http://localhost:3000
```
