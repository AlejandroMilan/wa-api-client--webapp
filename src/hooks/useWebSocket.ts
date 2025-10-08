import { useEffect, useRef, useState } from 'react';
import webSocketService from '../services/websocket.service';
import type { SocketMessage, SocketConversation, UserTypingData } from '../services/websocket.service';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, UserTypingData>>(new Map());
  const currentConversationId = useRef<string | null>(null);
  const messageCallbacks = useRef<Set<(message: SocketMessage) => void>>(new Set());
  const conversationCallbacks = useRef<Set<(conversation: SocketConversation) => void>>(new Set());
  const statusCallbacks = useRef<Set<(data: { messageId: string; status: string }) => void>>(new Set());

  useEffect(() => {
    // Connect to WebSocket server
    const socket = webSocketService.connect();

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewMessage = (message: SocketMessage) => {
      console.log('WebSocket: New message received', message);
      messageCallbacks.current.forEach(callback => callback(message));
    };

    const handleConversationUpdate = (conversation: SocketConversation) => {
      console.log('WebSocket: Conversation update received', conversation);
      conversationCallbacks.current.forEach(callback => callback(conversation));
    };

    const handleMessageStatusUpdate = (data: { messageId: string; status: string }) => {
      statusCallbacks.current.forEach(callback => callback(data));
    };

    const handleTyping = (data: UserTypingData) => {
      setTypingUsers((prev) => {
        const newTypingUsers = new Map(prev);
        if (data.isTyping) {
          newTypingUsers.set(data.userId, data);
        } else {
          newTypingUsers.delete(data.userId);
        }
        return newTypingUsers;
      });

      // Auto-remove typing indicator after 3 seconds
      if (data.isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => {
            const newTypingUsers = new Map(prev);
            newTypingUsers.delete(data.userId);
            return newTypingUsers;
          });
        }, 3000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new-message', handleNewMessage);
    socket.on('conversation-update', handleConversationUpdate);
    socket.on('message-status-update', handleMessageStatusUpdate);
    socket.on('user-typing', handleTyping);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new-message', handleNewMessage);
      socket.off('conversation-update', handleConversationUpdate);
      socket.off('message-status-update', handleMessageStatusUpdate);
      socket.off('user-typing', handleTyping);
      webSocketService.disconnect();
    };
  }, []);

  const joinConversation = (conversationId: string) => {
    currentConversationId.current = conversationId;
    webSocketService.joinConversation(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    if (currentConversationId.current === conversationId) {
      currentConversationId.current = null;
    }
    webSocketService.leaveConversation(conversationId);
  };

  const sendTypingIndicator = (conversationId: string, isTyping: boolean, userName?: string) => {
    webSocketService.sendTypingIndicator(conversationId, isTyping, userName);
  };

  const onNewMessage = (callback: (message: SocketMessage) => void) => {
    messageCallbacks.current.add(callback);
    return () => {
      messageCallbacks.current.delete(callback);
    };
  };

  const onMessageStatusUpdate = (callback: (data: { messageId: string; status: string }) => void) => {
    statusCallbacks.current.add(callback);
    return () => {
      statusCallbacks.current.delete(callback);
    };
  };

  const onConversationUpdate = (callback: (conversation: SocketConversation) => void) => {
    conversationCallbacks.current.add(callback);
    return () => {
      conversationCallbacks.current.delete(callback);
    };
  };

  return {
    isConnected,
    typingUsers: Array.from(typingUsers.values()),
    joinConversation,
    leaveConversation,
    sendTypingIndicator,
    onNewMessage,
    onMessageStatusUpdate,
    onConversationUpdate,
  };
};