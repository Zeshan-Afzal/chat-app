'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { useRouter } from 'next/navigation';
import { chatAPI } from '../../lib/api';
import ChatList from '../../components/ChatList';
import ChatWindow from '../../components/ChatWindow';
import NewChatModal from '../../components/NewChatModal';

export default function Home() {
  const { user, logout, loading } = useAuth();
  const { socket, connected, connectSocket, connectUser } = useSocket();
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchChats();
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.token) {
      connectSocket(user.token);
    }
  }, [user, connectSocket]);

  useEffect(() => {
    if (connected && user?.email) {
      connectUser(user.email);
    }
  }, [connected, user?.email, connectUser]);
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setChats(prevChats => {
          return prevChats.map(chat => {
            if (chat.roomId === message.roomId) {
              return {
                ...chat,
                recentMessage: {
                  sender: message.sender,
                  text: message.text
                },
                updatedAt: message.createdAt,
                unreadCount: chat.unreadCount + 1
              };
            }
            return chat;
          });
        });
      };

      const handleMessagesRead = (data) => {
        setChats(prevChats => {
          return prevChats.map(chat => {
            if (chat.roomId === data.roomId) {
              return {
                ...chat,
                unreadCount: 0
              };
            }
            return chat;
          });
        });
      };

      const handleTypingStart = (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.roomId]: data.user
        }));
      };

      const handleTypingStop = (data) => {
        setTypingUsers(prev => {
          const newTyping = { ...prev };
          delete newTyping[data.roomId];
          return newTyping;
        });
      };

      socket.on('res_message', handleNewMessage);
      socket.on('messages_read', handleMessagesRead);
      socket.on('typing_start', handleTypingStart);
      socket.on('typing_stop', handleTypingStop);

      return () => {
        socket.off('res_message', handleNewMessage);
        socket.off('messages_read', handleMessagesRead);
        socket.off('typing_start', handleTypingStart);
        socket.off('typing_stop', handleTypingStop);
      };
    }
  }, [socket]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setChatsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleChatCreated = (newChat) => {
    setChats(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setShowNewChat(false);
  };

  if (loading || chatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-600">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-brand-surface">
      {/* Left Sidebar - Chat List */}
      <div className={`$${''} ${selectedChat ? 'hidden md:flex' : 'flex'} md:w-1/3 w-full bg-white border-r border-gray-200 flex-col min-w-0`}>
        {/* Header */}
        <div className="bg-brand-primary p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-white font-semibold">{user?.name}</h1>
              <p className="text-white/80 text-sm">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              title="New Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              title="Logout"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-brand-surface">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <ChatList 
            chats={chats} 
            selectedChat={selectedChat} 
            onChatSelect={handleChatSelect}
            currentUser={user}
            typingUsers={typingUsers}
          />
        </div>
      </div>

      {/* Right Side - Chat Window */}
      <div className={`flex-1 flex flex-col min-w-0 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            currentUser={user}
            onChatUpdate={fetchChats}
            onBack={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-brand-primary-light">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-16 h-16 text-brand-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Secure Chat App</h2>
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onChatCreated={handleChatCreated}
          currentUser={user}
        />
      )}
    </div>
  );
}
