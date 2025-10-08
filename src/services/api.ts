import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  WaConversation,
  WaMessage,
  CreateConversationRequest,
  ListConversationsRequest,
  ListConversationsResponse,
  CreateMessageRequest,
  ListMessagesRequest,
  ListMessagesResponse,
  InboundMessage,
  ApiError
} from '../types/api';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const apiError: ApiError = {
          success: false,
          message: error.response?.data?.message || error.message || 'An error occurred',
          statusCode: error.response?.status || 500,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Conversations API
  async createConversation(data: CreateConversationRequest): Promise<WaConversation> {
    const response: AxiosResponse<WaConversation> = await this.client.post('/wa-conversations', data);
    return response.data;
  }

  async getConversations(params: ListConversationsRequest = {}): Promise<ListConversationsResponse> {
    const response: AxiosResponse<ListConversationsResponse> = await this.client.get('/wa-conversations', {
      params,
    });
    return response.data;
  }

  // Messages API
  async createMessage(data: CreateMessageRequest): Promise<WaMessage> {
    const response: AxiosResponse<WaMessage> = await this.client.post('/wa-messages', data);
    return response.data;
  }

  async getMessages(conversationId: string, params: ListMessagesRequest = {}): Promise<ListMessagesResponse> {
    const response: AxiosResponse<ListMessagesResponse> = await this.client.get(
      `/wa-messages/conversation/${conversationId}`,
      { params }
    );
    return response.data;
  }

  async markMessagesAsRead(conversationId: string): Promise<void> {
    await this.client.put(`/wa-messages/conversation/${conversationId}/read`);
  }

  // Webhook for inbound messages (if needed for frontend polling or similar)
  async handleInboundMessage(data: InboundMessage): Promise<void> {
    await this.client.post('/wa-messages/inbound', data);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
);