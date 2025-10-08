import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import type {
  ConversationWithLastMessage,
  ListConversationsResponse,
  WaMessage,
  ListMessagesResponse,
  CreateConversationRequest,
  CreateMessageRequest,
  LastMessage,
  ApiError
} from '../types/api';

// Hook for managing conversations
export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationWithLastMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchConversations = useCallback(async (page: number = 1, limit: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response: ListConversationsResponse = await apiClient.getConversations({ page, limit });
      setConversations(response.conversations);
      setPagination(response.pagination);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (data: CreateConversationRequest) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.createConversation(data);
      // Refresh conversations list
      await fetchConversations();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    pagination,
    fetchConversations,
    createConversation,
  };
};

// Hook for managing messages in a conversation
export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchMessages = useCallback(async (page: number = 1, limit: number = 50) => {
    if (!conversationId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response: ListMessagesResponse = await apiClient.getMessages(conversationId, { page, limit });
      setMessages(response.messages);
      setPagination(response.pagination);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!conversationId) return;
    
    setLoading(true);
    setError(null);
    try {
      const messageData: CreateMessageRequest = {
        conversationId,
        content,
        direction: 'outbound',
      };
      const newMessage = await apiClient.createMessage(messageData);
      
      // Add the new message to the list
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      await apiClient.markMessagesAsRead(conversationId);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
      setPagination({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
      });
    }
  }, [conversationId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    pagination,
    fetchMessages,
    sendMessage,
    markAsRead,
  };
};

// Hook for managing selected conversation
export const useSelectedConversation = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const selectConversation = useCallback((conversationId: string | null) => {
    setSelectedConversationId(conversationId);
  }, []);

  return {
    selectedConversationId,
    selectConversation,
  };
};

// Hook for fetching last messages for conversations
export const useLastMessages = (conversationIds: string[]) => {
  const [lastMessages, setLastMessages] = useState<Record<string, LastMessage>>({});
  const [loading, setLoading] = useState(false);

  const fetchLastMessages = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    
    setLoading(true);
    try {
      const promises = ids.map(async (id) => {
        try {
          const lastMessage = await apiClient.getLastMessage(id);
          return { id, lastMessage };
        } catch {
          return { id, lastMessage: null };
        }
      });

      const results = await Promise.all(promises);
      const messagesMap: Record<string, LastMessage> = {};
      
      results.forEach(({ id, lastMessage }) => {
        if (lastMessage) {
          messagesMap[id] = lastMessage;
        }
      });

      setLastMessages(messagesMap);
    } catch (error) {
      console.error('Error fetching last messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastMessages(conversationIds);
  }, [conversationIds, fetchLastMessages]);

  return {
    lastMessages,
    loading,
    refetch: () => fetchLastMessages(conversationIds),
  };
};