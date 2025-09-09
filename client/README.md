# WhatsApp Clone - Frontend

A modern WhatsApp-like chat application built with Next.js, featuring a responsive design and real-time messaging.

## Features

- **Authentication**: Secure login and registration
- **Real-time Messaging**: Socket.IO integration for instant message delivery
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **WhatsApp-like UI**: Clean, modern interface inspired by WhatsApp Web
- **Chat Management**: Start new chats, view chat history, and manage conversations
- **Message Encryption**: Backend handles end-to-end encryption

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** for styling
- **Socket.IO Client** for real-time communication
- **Axios** for API calls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend server running on port 3000

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.local.example .env.local
   ```

4. Update `.env.local` with your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3001`

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── home/              # Main chat interface
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ChatList.js        # Chat list sidebar
│   ├── ChatWindow.js      # Chat messages window
│   ├── NewChatModal.js    # Modal for starting new chats
│   └── SocketManager.js   # Socket connection manager
├── contexts/              # React contexts
│   ├── AuthContext.js     # Authentication context
│   └── SocketContext.js   # Socket.IO context
├── lib/                   # Utility libraries
│   └── api.js            # API client
└── README.md
```

## Usage

1. **Register/Login**: Create an account or sign in with existing credentials
2. **Start Chat**: Click the "+" button to start a new conversation
3. **Select User**: Choose from the list of available users
4. **Send Messages**: Type and send messages in real-time
5. **View History**: Access your chat history and continue conversations

## Features

### Authentication
- Secure user registration and login
- JWT token-based authentication
- Automatic token refresh and logout

### Chat Interface
- WhatsApp-like layout with sidebar and chat window
- Real-time message delivery
- Message timestamps and read status
- Responsive design for all screen sizes

### User Experience
- Clean, intuitive interface
- Smooth animations and transitions
- Loading states and error handling
- Mobile-friendly responsive design

## API Integration

The frontend integrates with the backend API endpoints:

- **Authentication**: `/api/auth/*`
- **Chats**: `/api/chat/*`
- **Messages**: `/api/message/*`

## Socket.IO Integration

Real-time features include:
- Instant message delivery
- Online status indicators
- Room-based messaging
- Automatic reconnection

## Styling

The application uses Tailwind CSS with custom WhatsApp-inspired colors:
- Primary green: `#25D366`
- Dark green: `#128C7E`
- Light green: `#DCF8C6`
- Gray tones for UI elements

## Development

To run in development mode:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
