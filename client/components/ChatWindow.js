'use client';

import { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../lib/api';
import { useSocket } from '../contexts/SocketContext';

export default function ChatWindow({ chat, currentUser, onChatUpdate, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { socket, connected, joinRoom, leaveRoom, sendMessage: socketSendMessage, markMessagesAsRead, startTyping, stopTyping } = useSocket();

  const getOtherUser = () => {
    if (chat.otherUser) return chat.otherUser;
    const meId = currentUser?.id || currentUser?._id;
    const users = chat.users;
    if (users) {
      const a = users.userA || users.a || users[0];
      const b = users.userB || users.b || users[1];
      const pick = [a, b].find(u => u && String(u._id || u.id) !== String(meId));
      if (pick) return pick;
    }
    return { name: 'Unknown User', email: 'unknown@example.com', _id: chat.targetUserId };
  };

  useEffect(() => {
    if (chat) {
      fetchMessages();
      if (connected) {
        joinRoom(chat.roomId);
        const userId = currentUser?.id || currentUser?._id;
        if (userId) {
          markMessagesAsRead(chat.roomId, userId);
        }
      }
    }

    return () => {
      if (connected && chat) {
        leaveRoom(chat.roomId);
      }
    };
  }, [chat, connected, joinRoom, leaveRoom, markMessagesAsRead, currentUser]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        if (message.roomId !== chat.roomId) return;
        setMessages(prev => [...prev, message]);
        onChatUpdate();
      };

      const handleMessagesRead = (data) => {
        if (data.roomId !== chat.roomId) return;
        onChatUpdate();
      };

      const handleTypingStart = (data) => {
        if (data.roomId !== chat.roomId) return;
        setTypingUser(data.user);
        setIsTyping(true);
      };

      const handleTypingStop = (data) => {
        if (data.roomId !== chat.roomId) return;
        setTypingUser(null);
        setIsTyping(false);
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
  }, [socket, chat?.roomId, onChatUpdate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages(chat.roomId);
      setMessages(response.data.reverse()); // Reverse to show oldest first
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim() && connected) {
      const user = { name: currentUser.name, email: currentUser.email };
      startTyping(chat.roomId, user);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (connected) {
        const user = { name: currentUser.name, email: currentUser.email };
        stopTyping(chat.roomId, user);
      }
    }, 1000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (connected) {
      const user = { name: currentUser.name, email: currentUser.email };
      stopTyping(chat.roomId, user);
    }

    setSending(true);
    try {
      if (connected) {
        const other = getOtherUser();
        socketSendMessage(chat.roomId, newMessage.trim(), other.email, currentUser.email);
      } else {
        const response = await messageAPI.sendMessage(chat.roomId, newMessage.trim());
        setMessages(prev => [...prev, response.data]);
      }
      setNewMessage('');
      onChatUpdate();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isFromCurrentUser = (msg) => {
    const senderId = typeof msg?.sender === 'string' ? msg.sender : msg?.sender?._id;
    const meId = currentUser?.id || currentUser?._id;
    if (!senderId || !meId) return false;
    return String(senderId) === String(meId);
  };

  const isMessageUnread = (msg) => {
    if (isFromCurrentUser(msg)) return false;
    const meId = currentUser?.id || currentUser?._id;
    return msg.status === 'unread' || !msg.readBy?.includes(meId);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="flex-1 flex flex-col bg-whatsapp-light-green min-h-0">
      {/* Chat Header */}
      <div className="bg-whatsapp-gray p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Mobile back button */}
          <button
            className="md:hidden p-2 mr-1 rounded-full hover:bg-gray-200"
            onClick={() => onBack?.()}
            aria-label="Back to chat list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 bg-whatsapp-green rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {otherUser.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
            <p className="text-sm text-gray-600">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">Start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isUnread = isMessageUnread(message);
            return (
              <div
                key={message._id}
                className={`flex ${isFromCurrentUser(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isFromCurrentUser(message)
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-200 text-gray-900'
                  } ${isUnread ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                >
                  <p className={`text-sm ${isUnread ? 'font-bold' : ''}`}>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    isFromCurrentUser(message) ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {isTyping && typingUser && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-600">{typingUser.name} is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message"
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
              value={newMessage}
              onChange={handleTyping}
              disabled={sending}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-whatsapp-green text-white rounded-full hover:bg-whatsapp-green-dark focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
