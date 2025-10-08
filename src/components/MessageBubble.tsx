import React from 'react';
import type { WaMessage } from '../types/api';

interface MessageBubbleProps {
  message: WaMessage;
  isFirstInGroup: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isFirstInGroup }) => {
  const isOutbound = message.direction === 'outbound';
  
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        );
      case 'delivered':
        return (
          <div className="flex">
            <svg className="w-4 h-4 text-gray-400 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <svg className="w-4 h-4 text-blue-500 -mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}>
      <div
        className={`message-bubble ${
          isOutbound ? 'message-sent' : 'message-received'
        } ${!isFirstInGroup ? 'mt-0.5' : ''}`}
      >
        <div className="text-sm text-gray-900 break-words whitespace-pre-wrap">
          {message.content}
        </div>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${isOutbound ? 'text-gray-600' : 'text-gray-500'}`}>
          <span className="text-xs">
            {formatTime(message.timestamp)}
          </span>
          {isOutbound && (
            <div className="flex items-center">
              {getStatusIcon()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};