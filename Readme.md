# Ask Rezzy - AI-Powered Document Chat Client

A modern, responsive React Native application that enables users to upload PDF documents and engage in intelligent conversations about their content using AI. Built with Expo, TypeScript, and real-time WebSocket communication.

## 🚀 Overview

Ask Rezzy is a sophisticated document analysis and chat application that leverages the power of AI to help users understand and interact with their PDF documents. Users can upload documents, ask questions about the content, and receive intelligent responses powered by OpenAI's GPT models with Retrieval-Augmented Generation (RAG).

## ✨ Key Features

### 📄 Document Management
- **PDF Upload**: Seamless PDF document upload with drag-and-drop support (web) and file picker (mobile)
- **Document Processing**: Automatic text extraction, chunking, and vector embedding generation
- **Session-Based Storage**: Each user session maintains its own document context

### 💬 Intelligent Chat Interface
- **Real-time Messaging**: WebSocket-powered chat with streaming responses
- **Context-Aware AI**: AI responses based on uploaded document content using RAG
- **Typing Indicators**: Visual feedback during AI response generation
- **Message History**: Persistent chat history within sessions

### 🔍 Document Search
- **Semantic Search**: Find relevant document sections using natural language queries
- **Relevance Scoring**: Results ranked by semantic similarity
- **Highlighted Results**: Clear presentation of search results with relevance percentages

### 🎨 Modern UI/UX
- **Cross-Platform**: Runs on iOS, Android, and Web
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Theme**: Automatic theme detection
- **Accessibility**: Built with accessibility best practices

## 🏗️ Architecture

### Frontend Stack
- **React Native**: Cross-platform mobile development
- **Expo SDK 50+**: Development platform and toolchain
- **TypeScript**: Type-safe development
- **React Query**: Server state management and caching
- **Expo Router**: File-based navigation system
- **WebSocket**: Real-time communication

### Backend Integration
- **RESTful API**: Standard HTTP endpoints for file upload and search
- **WebSocket API**: Real-time chat communication
- **Session Management**: Secure session-based user isolation

## 📁 Project Structure

```
ask-rezzy-client/
├── app/                          # App routes and screens
│   ├── (tabs)/                   # Tab-based navigation
│   │   ├── index.tsx            # Chat screen (main interface)
│   │   ├── results.tsx          # Search results screen
│   │   └── _layout.tsx          # Tab layout configuration
│   ├── _layout.tsx              # Root layout with providers
│   └── +not-found.tsx           # 404 error screen
├── components/                   # Reusable UI components
│   ├── chat/                    # Chat-specific components
│   │   ├── ChatInput.tsx        # Enhanced input with upload
│   │   ├── MessageBubble.tsx    # Individual message display
│   │   └── TypingIndicator.tsx  # Loading animation
│   ├── Themed.tsx               # Theme-aware components
│   └── ...                      # Other utility components
├── lib/                         # Application logic
│   ├── context/                 # React Context providers
│   │   ├── SessionContext.tsx   # Session state management
│   │   └── ChatContext.tsx      # Chat state management
│   └── hooks/                   # Custom React hooks
│       ├── useChatStream.ts     # WebSocket chat logic
│       └── useSearch.ts         # Document search logic
├── config/                      # Configuration files
│   └── api.ts                   # Axios client configuration
├── constants/                   # App constants and themes
├── assets/                      # Static assets (images, fonts)
└── sample-pdf/                  # Sample documents for testing
```

## 🛠️ Technical Implementation

### State Management
- **Session Context**: Manages user session ID and initialization state
- **Chat Context**: Handles WebSocket connection and message state
- **React Query**: Caches API responses and manages server state

### Real-time Communication
```typescript
// WebSocket message types
type MessageType = 'chunk' | 'status' | 'error';

// Streaming response handling
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'chunk': // Append to current message
    case 'status': // Handle completion
    case 'error': // Handle errors
  }
};
```

### File Upload System
- **Multi-platform Support**: Different handling for web (Blob) vs mobile (URI)
- **Progress Feedback**: Visual upload status with success/error states
- **Error Handling**: Comprehensive error messages and retry logic

### Search Implementation
- **Semantic Search**: Vector-based similarity search
- **Result Ranking**: Relevance scoring with percentage display
- **Empty States**: Helpful messaging when no results found

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Backend server running on `http://localhost:3001`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ask-rezzy-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file (optional)
   EXPO_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - **Web**: Press `w` or visit `http://localhost:8081`
   - **iOS**: Press `i` (requires Xcode)
   - **Android**: Press `a` (requires Android Studio)
   - **Mobile**: Scan QR code with Expo Go app

## 📱 Platform-Specific Features

### Web
- **Enter Key**: Send messages with Enter (Shift+Enter for new line)
- **File Drag & Drop**: Drag PDF files directly into upload area
- **Keyboard Shortcuts**: Enhanced keyboard navigation

### Mobile (iOS/Android)
- **Native File Picker**: Access device file system
- **Touch Gestures**: Optimized touch interactions
- **Platform UI**: Native look and feel

## 🔧 Configuration

### API Endpoints
The app expects the following backend endpoints:

- `GET /api/session/init` - Initialize user session
- `POST /api/files/upload` - Upload PDF documents
- `GET /api/search` - Search document content
- `WebSocket /` - Real-time chat communication

### Environment Variables
```bash
EXPO_PUBLIC_API_URL=http://localhost:3001/api  # Backend API URL
```

## 🎯 Key Benefits

### For Users
- **Instant Document Understanding**: Get answers from documents without manual reading
- **Natural Language Queries**: Ask questions in plain English
- **Cross-Platform Access**: Use on any device with consistent experience
- **Real-time Responses**: Immediate feedback with streaming responses

### For Developers
- **Type Safety**: Full TypeScript implementation
- **Modular Architecture**: Clean separation of concerns
- **Reusable Components**: Well-structured component library
- **Modern Patterns**: Latest React and React Native best practices

## 🧪 Testing

### Manual Testing
1. **Upload a PDF**: Use the paperclip button in chat input
2. **Ask Questions**: Type questions about the document content
3. **Search Documents**: Use the Results tab to search content
4. **Test Connectivity**: Monitor connection status in header

### Sample Documents
Use the provided sample PDF in `sample-pdf/` directory for testing.

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the web-build/ directory to your hosting service
```

### Mobile App Store
```bash
# Build for production
expo build:ios
expo build:android
```

## 🔮 Future Enhancements

- **Multi-document Support**: Handle multiple PDFs simultaneously
- **Document Annotations**: Highlight and annotate document sections
- **Export Conversations**: Save chat history as PDF/text
- **Voice Input**: Speech-to-text for hands-free interaction
- **Collaborative Features**: Share documents and conversations
- **Advanced Search**: Filters, date ranges, and advanced queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample implementation

---

**Built with ❤️ using React Native, Expo, and modern web technologies.**
