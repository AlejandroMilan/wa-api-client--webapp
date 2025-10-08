import { useEffect, useRef, useState } from 'react';
import webSocketService from '../services/websocket.service';
import type { SocketMessage, SocketConversation, UserTypingData } from '../services/websocket.service';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, UserTypingData>>(new Map());
  const currentConversationId = useRef<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = webSocketService.connect();

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
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
    webSocketService.onUserTyping(handleTyping);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      webSocketService.removeAllListeners();
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
    webSocketService.onNewMessage(callback);
  };

  const onMessageStatusUpdate = (callback: (data: { messageId: string; status: string }) => void) => {
    webSocketService.onMessageStatusUpdate(callback);
  };

  const onConversationUpdate = (callback: (conversation: SocketConversation) => void) => {
    webSocketService.onConversationUpdate(callback);
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