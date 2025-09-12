# Cursor Clone - AI Code Editor

A modern, AI-powered code editor built with Next.js 15, featuring Gemini and Perplexity AI integration for intelligent coding assistance.

## Features

- 🚀 **Modern Code Editor** - Clean, responsive interface inspired by Cursor
- 🤖 **AI Integration** - Gemini and Perplexity AI assistants
- 📁 **File Explorer** - Intuitive project navigation
- 💻 **Terminal** - Built-in terminal with command history
- 🎨 **Dark/Light Theme** - Seamless theme switching
- 📱 **PWA Ready** - Install as a desktop app
- ⚡ **Real-time AI** - Stream responses from AI providers
- 🔧 **Project Management** - Git integration and settings

## AI Providers

### Gemini
- Google's advanced AI model
- Excellent for code generation and explanations
- Fast response times

### Perplexity
- Real-time information access
- Up-to-date documentation and examples
- Research and fact-checking capabilities

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd cursor-clone
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

5. Run the development server
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Keys Setup

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your `.env.local` file

### Perplexity API Key
1. Visit [Perplexity API](https://www.perplexity.ai/settings/api)
2. Generate an API key
3. Add it to your `.env.local` file

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
pnpm build
pnpm start
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI Integration**: Vercel AI SDK
- **Theming**: next-themes
- **Analytics**: Vercel Analytics

## Project Structure

```
├── app/
│   ├── api/ai/          # AI API routes
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main editor page
│   └── manifest.json    # PWA manifest
├── components/
│   └── ui/              # Reusable UI components
├── lib/
│   ├── ai.ts           # AI integration utilities
│   └── utils.ts        # General utilities
└── public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API key setup

---

Built with ❤️ using Next.js and AI