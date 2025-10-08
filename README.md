# WhatsApp API Client - Frontend

A modern React.js frontend client for the WhatsApp API backend, designed to mimic WhatsApp Web's interface with a blue color theme.

## Features

- 🎨 **WhatsApp Web-like Interface**: Familiar design with a blue color scheme (#263238)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 💬 **Real-time Messaging**: Send and receive messages with status indicators
- 📋 **Conversation Management**: Create new conversations and manage existing ones
- 🔍 **Search Functionality**: Search through conversations (UI ready)
- ⚡ **TypeScript**: Full type safety throughout the application
- 🎯 **Modern Stack**: Built with React 19, Vite, and Tailwind CSS

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with custom blue theme
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **pnpm** - Package manager

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- WhatsApp API Backend running on http://localhost:3000

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the API URL in `.env` if needed:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

### Development

Start the development server:
```bash
pnpm dev
```

The application will be available at http://localhost:5173/

### Build

Build for production:
```bash
pnpm build
```

### Preview

Preview the production build:
```bash
pnpm preview
```

## API Integration

The frontend integrates with the WhatsApp API backend through the following endpoints:

- **Conversations**
  - `GET /wa-conversations` - List conversations with pagination
  - `POST /wa-conversations` - Create new conversation

- **Messages**
  - `GET /wa-messages/conversation/:id` - Get messages for a conversation
  - `POST /wa-messages` - Send a new message
  - `PUT /wa-messages/conversation/:id/read` - Mark messages as read

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx          # Main application layout
│   ├── ConversationList.tsx # Sidebar with conversations
│   ├── ConversationItem.tsx # Individual conversation item
│   ├── ChatWindow.tsx      # Main chat interface
│   ├── MessageList.tsx     # Messages display area
│   ├── MessageBubble.tsx   # Individual message bubble
│   ├── MessageInput.tsx    # Message input with send button
│   └── NewConversationModal.tsx # Modal for creating conversations
├── hooks/              # Custom React hooks
│   └── useApi.ts          # API integration hooks
├── services/           # API services
│   └── api.ts             # Axios client and API methods
├── types/              # TypeScript type definitions
│   └── api.ts             # API-related types
└── index.css           # Global styles with Tailwind imports
```

## Features Overview

### Conversation Management
- View all conversations in a sidebar
- Create new conversations with phone number and optional name
- Search through conversations (UI implemented, backend integration pending)
- Unread message counts with badges

### Messaging Interface  
- WhatsApp-like message bubbles with proper styling
- Message status indicators (sent, delivered, read)
- Timestamp display with smart formatting
- Auto-scrolling to latest messages
- Message input with emoji and attachment buttons (UI ready)

### Responsive Design
- Mobile-first approach
- Slide-out navigation on mobile
- Adaptive layout for different screen sizes
- Touch-friendly interface elements

### Visual Design
- Custom blue color palette (#263238 primary)
- WhatsApp-inspired message bubbles and layout
- Smooth animations and transitions
- Custom scrollbars
- Proper typography and spacing

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:3000)

## React + TypeScript + Vite Configuration

This project was bootstrapped with Vite and includes:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
