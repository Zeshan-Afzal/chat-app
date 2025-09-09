'use client';

export default function ChatList({ chats, selectedChat, onChatSelect, currentUser, typingUsers = {} }) {
  const getOtherUser = (chat) => {
    if (chat.otherUser) return chat.otherUser;

    const meId = currentUser?.id || currentUser?._id;
    const users = chat.users || {};
    const candidates = [users.userA, users.userB].filter(Boolean);
    if (candidates.length) {
      const other = candidates.find(u => String(u?._id || u?.id) !== String(meId));
      if (other) return other;
    }

    const sender = chat.recentMessage?.sender;
    if (sender && String(sender?._id || sender?.id) !== String(meId)) {
      return sender;
    }

    return { name: 'Unknown User', email: 'unknown@example.com' };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">No chats yet</p>
          <p className="text-xs text-gray-400 mt-1">Start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {chats.map((chat) => {
        const otherUser = getOtherUser(chat);
        const isSelected = selectedChat?._id === chat._id;
        
        return (
          <div
            key={chat._id}
            onClick={() => onChatSelect(chat)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-whatsapp-light-green' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-whatsapp-green rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold">
                  {otherUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {otherUser.name || 'Unknown User'}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex-1 min-w-0">
                    {typingUsers[chat.roomId] ? (
                      <p className="text-sm text-blue-600 italic">
                        {typingUsers[chat.roomId].name} is typing...
                      </p>
                    ) : (
                      <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {chat.recentMessage?.text || 'No messages yet'}
                      </p>
                    )}
                  </div>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
