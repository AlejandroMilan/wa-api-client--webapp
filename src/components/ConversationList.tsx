import React, { useState, useMemo } from "react";
import { useConversations, useLastMessages } from "../hooks/useApi";
import type { ConversationWithLastMessage } from "../types/api";
import { ConversationItem } from "./ConversationItem";
import { NewConversationModal } from "./NewConversationModal";

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string | null) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
}) => {
  const { conversations, loading, error, createConversation } =
    useConversations();
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] =
    useState(false);

  // Get conversation IDs for fetching last messages
  const conversationIds = useMemo(
    () => conversations.map(conv => conv._id),
    [conversations]
  );

  // Fetch last messages for all conversations
  const { lastMessages, refetch: refetchLastMessages } = useLastMessages(conversationIds);

  // Combine conversations with their last messages
  const conversationsWithLastMessages = useMemo(() => {
    return conversations.map(conversation => {
      const lastMessage = lastMessages[conversation._id];
      return {
        ...conversation,
        lastMessage: lastMessage ? {
          content: lastMessage.text,
          timestamp: new Date(lastMessage.timestamp),
          direction: lastMessage.direction === 'OUTGOING' ? 'outbound' as const : 'inbound' as const,
        } : undefined,
      };
    });
  }, [conversations, lastMessages]);

  const handleCreateConversation = async (
    phoneNumber: string,
    name?: string
  ) => {
    try {
      await createConversation({ phoneNumber, name });
      setIsNewConversationModalOpen(false);
      // Refresh last messages after creating new conversation
      refetchLastMessages();
    } catch (err) {
      // Error is handled by the hook
      console.error("Failed to create conversation:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-primary-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">WhatsApp Business</h1>
        <button
          onClick={() => setIsNewConversationModalOpen(true)}
          className="p-2 hover:bg-primary-800 rounded-full transition-colors"
          title="New conversation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversationsWithLastMessages.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-600 text-center">
            <p>Error loading conversations</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : conversationsWithLastMessages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No conversations yet</p>
            <button
              onClick={() => setIsNewConversationModalOpen(true)}
              className="mt-2 text-primary-600 hover:text-primary-700"
            >
              Start a new conversation
            </button>
          </div>
        ) : (
          <div>
            {conversationsWithLastMessages.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New conversation modal */}
      {isNewConversationModalOpen && (
        <NewConversationModal
          onClose={() => setIsNewConversationModalOpen(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </div>
  );
};
