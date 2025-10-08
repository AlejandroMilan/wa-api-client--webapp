import React from 'react';
import { useMessages, useConversations } from '../hooks/useApi';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversationId: string | null;
  onOpenMobileMenu?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, onOpenMobileMenu }) => {
  const { conversations } = useConversations();
  const { messages, loading, sendMessage, markAsRead } = useMessages(conversationId);

  const selectedConversation = conversations.find(c => c._id === conversationId);

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-whatsapp-light">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto w-32 h-32 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h2 className="text-xl font-medium text-gray-600 mb-2">WhatsApp Business Web</h2>
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-whatsapp-light">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        {/* Mobile back button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full mr-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex-shrink-0 w-10 h-10 bg-primary-200 rounded-full flex items-center justify-center mr-3">
          <span className="text-primary-800 font-medium">
            {selectedConversation?.name 
              ? selectedConversation.name[0].toUpperCase() 
              : selectedConversation?.phoneNumber[0] || '?'}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900">
            {selectedConversation?.name || selectedConversation?.phoneNumber || 'Unknown'}
          </h2>
          {selectedConversation?.phoneNumber && selectedConversation?.name && (
            <p className="text-sm text-gray-500">{selectedConversation.phoneNumber}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList 
          messages={messages} 
          loading={loading} 
          onMarkAsRead={markAsRead}
        />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
};