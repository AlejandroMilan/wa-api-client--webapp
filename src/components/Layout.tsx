import React, { useState, useEffect } from "react";
import { ConversationList } from "./ConversationList";
import { ChatWindow } from "./ChatWindow";
import { useSelectedConversation } from "../hooks/useApi";
import { useWebSocket } from "../hooks/useWebSocket";

export const Layout: React.FC = () => {
  const { selectedConversationId, selectConversation } =
    useSelectedConversation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected, joinConversation, leaveConversation } = useWebSocket();

  // Join conversation when selected
  useEffect(() => {
    if (selectedConversationId) {
      joinConversation(selectedConversationId);
    }
    
    return () => {
      if (selectedConversationId) {
        leaveConversation(selectedConversationId);
      }
    };
  }, [selectedConversationId, joinConversation, leaveConversation]);

  const handleSelectConversation = (conversationId: string | null) => {
    selectConversation(conversationId);
    // Close mobile menu when selecting a conversation
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-whatsapp-light w-full">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with conversations */}
      <div
        className={`
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
        fixed md:relative z-40 md:z-0
        w-full max-w-sm md:max-w-none md:w-96 
        h-full border-r border-gray-300 bg-white
        transition-transform duration-300 ease-in-out
        flex-shrink-0
      `}
      >
        <ConversationList
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile header with menu button */}
        {!selectedConversationId && (
          <div className="md:hidden bg-primary-900 text-white p-4 flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-primary-800 rounded-full transition-colors mr-3"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-medium">WhatsApp Business</h1>
            <div className={`ml-auto w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
                 title={isConnected ? 'Connected' : 'Disconnected'} />
          </div>
        )}

        <ChatWindow
          conversationId={selectedConversationId}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
      </div>
    </div>
  );
};
