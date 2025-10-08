// Types matching the backend API
export interface WaConversation {
  _id: string;
  phoneNumber: string;
  name?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaMessage {
  _id: string;
  type: string;
  direction: 'INCOMING' | 'OUTGOING';
  conversation: string;
  timestamp: string;
  readed: boolean;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LastMessage {
  _id: string;
  type: string;
  direction: 'OUTGOING' | 'INCOMING';
  conversation: string;
  timestamp: string;
  readed: boolean;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API Request/Response types
export interface CreateConversationRequest {
  phoneNumber: string;
  name?: string;
}

export interface ListConversationsRequest {
  page?: number;
  limit?: number;
}

export interface ConversationWithLastMessage {
  _id: string;
  phoneNumber: string;
  name?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    direction: 'inbound' | 'outbound';
  };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListConversationsResponse {
  conversations: ConversationWithLastMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateMessageRequest {
  conversation: string;
  text: string;
  direction: 'OUTGOING';
  type: 'TEXT';
}

export interface ListMessagesRequest {
  page?: number;
  limit?: number;
}

export interface ListMessagesResponse {
  messages: WaMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InboundMessage {
  phoneNumber: string;
  content: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
}