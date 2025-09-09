# Real-Time Chat Application

A modern, real-time chat application built with Next.js, Node.js, Socket.IO, and MongoDB. Features include real-time messaging, typing indicators, unread message counts, and a WhatsApp-like user interface.

## 🚀 Features

### Core Functionality
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Authentication**: Secure login and registration with JWT tokens
- **Chat Management**: Create and manage multiple chat conversations
- **Message Encryption**: End-to-end encryption for message security
- **Read Receipts**: Track message read status and unread counts
- **Typing Indicators**: See when other users are typing
- **Responsive Design**: Mobile-first responsive UI

### User Interface
- **WhatsApp-like Design**: Clean, modern interface inspired by WhatsApp
- **Real-time Updates**: Chat list updates automatically without refresh
- **Unread Message Highlighting**: Bold text for unread messages
- **Typing Indicators**: Visual feedback when users are typing
- **Blue Color Scheme**: Modern blue color palette throughout the app
- **Loading States**: Smooth loading animations and states

### Technical Features
- **Socket.IO Integration**: Real-time bidirectional communication
- **MongoDB Database**: Scalable NoSQL database for data storage
- **JWT Authentication**: Secure token-based authentication
- **Message Encryption**: AES encryption for message security
- **Real-time Notifications**: Instant updates across all connected clients

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Context API**: State management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Socket.IO**: Real-time communication
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Crypto**: Built-in encryption module

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app-2
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` files in both client and server directories:

   **Server `.env`:**
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/chat-app
   JWT_SECRET=your-super-secret-jwt-key
   ```

   **Client `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Ensure MongoDB is running on your system
   - The application will automatically create the necessary collections

5. **Start the application**
   ```bash
   # Start the server (from server directory)
   npm start

   # Start the client (from client directory)
   npm run dev
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3001`
   - Register a new account or login with existing credentials

## 🏗️ Project Structure

```
chat-app-2/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   │   ├── home/          # Main chat interface
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── components/        # React components
│   │   ├── ChatList.js    # Chat list component
│   │   ├── ChatWindow.js  # Chat window component
│   │   └── NewChatModal.js # New chat modal
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js # Authentication context
│   │   └── SocketContext.js # Socket context
│   └── lib/               # Utility libraries
│       └── api.js         # API client
├── server/                # Node.js backend
│   ├── src/
│   │   ├── mrc/           # Model-Controller-Route structure
│   │   │   ├── chats/     # Chat-related logic
│   │   │   ├── message/   # Message-related logic
│   │   │   └── user/      # User-related logic
│   │   ├── sockets/       # Socket.IO handlers
│   │   └── utils/         # Utility functions
│   └── index.js           # Server entry point
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users

### Chats
- `POST /api/chats/start` - Start a new chat
- `GET /api/chats` - Get user's chats

### Messages
- `POST /api/messages/send` - Send a message
- `GET /api/messages/:roomId` - Get messages for a room
- `POST /api/messages/read` - Mark messages as read

## 🔌 Socket Events

### Client to Server
- `connect_user` - Connect user to socket
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message
- `mark_messages_read` - Mark messages as read
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client
- `res_message` - New message received
- `messages_read` - Messages marked as read
- `typing_start` - User started typing
- `typing_stop` - User stopped typing

## 🎨 UI Components

### ChatList
- Displays all user chats
- Shows unread message counts
- Real-time typing indicators
- Bold text for unread messages

### ChatWindow
- Message display area
- Real-time message updates
- Typing indicators with animation
- Message input with typing detection

### Authentication
- Clean login/register forms
- Blue color scheme
- Form validation
- Error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Message Encryption**: AES encryption for all messages
- **Input Validation**: Server-side input validation
- **CORS Protection**: Configured CORS for security
- **Environment Variables**: Sensitive data in environment variables

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the server

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Socket connection failed**
   - Check if server is running
   - Verify socket URL in environment variables

2. **Database connection error**
   - Ensure MongoDB is running
   - Check connection string in environment variables

3. **Authentication issues**
   - Verify JWT secret is set
   - Check token expiration

4. **Messages not appearing**
   - Check socket connection
   - Verify room joining logic

## 📞 Support

For support, email support@example.com or create an issue in the repository.

## 🙏 Acknowledgments

- WhatsApp for UI inspiration
- Socket.IO for real-time communication
- Next.js team for the amazing framework
- MongoDB for the database solution
