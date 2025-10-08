import React, { useEffect, useRef } from 'react';
import type { WaMessage } from '../types/api';
import { MessageBubble } from './MessageBubble';
import type { UserTypingData } from '../services/websocket.service';

interface MessageListProps {
  messages: WaMessage[];
  loading: boolean;
  onMarkAsRead: () => void;
  typingUsers?: UserTypingData[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages, loading, onMarkAsRead, typingUsers = [] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when they become visible
    const timer = setTimeout(() => {
      onMarkAsRead();
    }, 1000);

    return () => clearTimeout(timer);
  }, [messages, onMarkAsRead]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-2"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23000'%3e%3cpath d='m6 16 3-8 3 8c2 0 8 0 8 0l3-8 3 8'/%3e%3c/svg%3e")`,
        backgroundSize: '60px 60px',
        backgroundColor: '#f0f2f5',
        opacity: 0.55
      }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isFirstInGroup = !prevMessage || 
              prevMessage.direction !== message.direction ||
              new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 300000; // 5 minutes

            return (
              <MessageBubble
                key={message._id}
                message={message}
                isFirstInGroup={isFirstInGroup}
              />
            );
          })}
          
          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-sm text-gray-500">
                {typingUsers.length === 1 
                  ? `${typingUsers[0].userName || 'Someone'} is typing...`
                  : `${typingUsers.length} people are typing...`
                }
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};