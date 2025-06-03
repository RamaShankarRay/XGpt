# XGpt - Advanced Multi-User ChatGPT Clone

A full-stack chat application built with React, Firebase, and OpenAI API, featuring real-time messaging, user authentication, and a modern UI.

## Features

- 🔐 Firebase Authentication with Google Sign-in
- 💬 Real-time chat with OpenAI GPT
- 🎨 Modern UI with Tailwind CSS and Shadcn/ui
- 🌙 Dark/Light mode support
- 📱 Fully responsive design
- ⚡ Built with Vite for optimal performance

## Prerequisites

- Node.js 16+ and npm
- Firebase account and project
- OpenAI API key

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/xgpt.git
cd xgpt
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
client/          # Frontend React application
├── src/
│   ├── components/  # UI components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom hooks
│   ├── lib/         # Utility functions
│   └── pages/       # Application pages
server/          # Backend Express server
├── index.ts     # Server entry point
├── routes.ts    # API routes
└── vite.ts      # Vite configuration
```

## Technology Stack

- **Frontend**
  - React with TypeScript
  - Tailwind CSS
  - Shadcn/ui components
  - Firebase Authentication
  - React Query

- **Backend**
  - Express.js
  - OpenAI API
  - Firebase Admin SDK

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT

## Contact

Your Name - [@yourusername](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/xgpt](https://github.com/yourusername/xgpt)
