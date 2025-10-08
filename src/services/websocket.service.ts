import { io, Socket } from 'socket.io-client';

export interface SocketMessage {
  _id: string;
  text?: string;
  type: string;
  direction: 'incoming' | 'outgoing';
  timestamp: Date;
  readed: boolean;
  conversation: string;
  phoneNumber?: string;
  template?: Record<string, unknown>;
}

export interface SocketConversation {
  _id: string;
  phoneNumber: string;
  status: string;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: SocketMessage;
}

export interface UserTypingData {
  userId: string;
  isTyping: boolean;
  userName?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private currentConversationId: string | null = null;

  connect(serverUrl: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') {
    if (!this.socket) {
      this.socket = io(serverUrl, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join a conversation room for real-time updates
  joinConversation(conversationId: string) {
    if (this.socket && conversationId) {
      // Leave previous conversation if any
      if (this.currentConversationId) {
        this.leaveConversation(this.currentConversationId);
      }

      this.socket.emit('join-conversation', { conversationId });
      this.currentConversationId = conversationId;
      console.log('Joined conversation:', conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId: string) {
    if (this.socket && conversationId) {
      this.socket.emit('leave-conversation', { conversationId });
      if (this.currentConversationId === conversationId) {
        this.currentConversationId = null;
      }
      console.log('Left conversation:', conversationId);
    }
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, isTyping: boolean, userName?: string) {
    if (this.socket && conversationId) {
      this.socket.emit('typing', {
        conversationId,
        isTyping,
        userName,
      });
    }
  }

  // Listen for new messages
  onNewMessage(callback: (message: SocketMessage) => void) {
    if (this.socket) {
      this.socket.on('new-message', callback);
    }
  }

  // Listen for message status updates
  onMessageStatusUpdate(callback: (data: { messageId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('message-status-update', callback);
    }
  }

  // Listen for conversation updates
  onConversationUpdate(callback: (conversation: SocketConversation) => void) {
    if (this.socket) {
      this.socket.on('conversation-update', callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback: (data: UserTypingData) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.off('new-message');
      this.socket.off('message-status-update');
      this.socket.off('conversation-update');
      this.socket.off('user-typing');
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;