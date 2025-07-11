# SimplifyTechBits - Backend

A comprehensive React-based web application built with modern technologies, featuring AI assistance, analytics, automation tools, and collaborative development features.

## 🚀 Features

- **AI Assistant**: Intelligent coding assistance and suggestions powered by Groq
- **Analytics Dashboard**: Comprehensive data visualization and insights
- **Automation Tools**: Streamlined workflow automation
- **Code Editor**: Advanced code editing with syntax highlighting
- **Collaboration**: Real-time collaborative development features
- **Security**: Built-in security features and best practices
- **Optimization**: Performance optimization tools
- **Notifications**: Real-time notification system
- **User Management**: Profile and settings management

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **UI Components**: Radix UI primitives
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Themes**: Next-themes for dark/light mode
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **AI Integration**: Groq API for AI-powered features

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Groq API key (for AI features)

### Environment Setup

1. **Copy the environment example file**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables**
   Edit the `.env` file and add your Groq API key:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

   **To get your Groq API key:**
   - Visit [Groq Console](https://console.groq.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env` file

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your Groq API key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Groq API Configuration
VITE_GROQ_API_KEY=your_groq_api_key_here

# Optional: Additional configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=SimplifyTechBits
```

### Required Environment Variables

- `VITE_GROQ_API_KEY`: Your Groq API key for AI assistant functionality

### Getting Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file

**⚠️ Important**: Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

## 🎯 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 📁 Project Structure
