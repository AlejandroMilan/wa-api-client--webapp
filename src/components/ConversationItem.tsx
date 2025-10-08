import React from 'react';
import type { ConversationWithLastMessage } from '../types/api';

interface ConversationItemProps {
  conversation: ConversationWithLastMessage;
  isSelected: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
        isSelected ? 'bg-gray-100' : 'bg-white'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mr-3">
        <span className="text-primary-800 font-medium text-lg">
          {conversation.name ? conversation.name[0].toUpperCase() : conversation.phoneNumber[0]}
        </span>
      </div>

      {/* Conversation info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {conversation.name || conversation.phoneNumber}
          </h3>
          {conversation.lastMessage && (
            <span className="text-xs text-gray-200 flex-shrink-0 ml-2">
              {formatTime(conversation.lastMessage.timestamp)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate max-w-48">
            {conversation.lastMessage ? (
              <>
                {conversation.lastMessage.direction === 'outbound' && (
                  <span className="text-gray-400 mr-1">You:</span>
                )}
                {conversation.lastMessage.content}
              </>
            ) : (
              <span className="text-gray-400 italic">No messages yet</span>
            )}
          </p>
          
          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <span className="bg-whatsapp-green text-white text-xs font-medium px-2 py-1 rounded-full ml-2 flex-shrink-0">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};