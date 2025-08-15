import { APIResponse, CreateProjectRequest, CreateBoardRequest, CreateListRequest, CreateCardRequest, MoveCardRequest, ReorderCardRequest, ReorderListRequest, User, Project, Board, List, Card } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  }

  private setStoredToken(token: string | null): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<APIResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      this.setStoredToken(response.data.token);
    }

    return response;
  }

  async register(email: string, username: string, password: string): Promise<APIResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      this.setStoredToken(response.data.token);
    }

    return response;
  }

  logout(): void {
    this.token = null;
    this.setStoredToken(null);
  }

  // Project methods
  async getProjects(): Promise<APIResponse<Project[]>> {
    return this.request<Project[]>('/api/v1/projects');
  }

  async createProject(data: CreateProjectRequest): Promise<APIResponse<Project>> {
    return this.request<Project>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProject(id: string): Promise<APIResponse<Project>> {
    return this.request<Project>(`/api/v1/projects/${id}`);
  }

  async updateProject(id: string, data: Partial<CreateProjectRequest>): Promise<APIResponse<Project>> {
    return this.request<Project>(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/api/v1/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Board methods
  async getBoards(): Promise<APIResponse<Board[]>> {
    return this.request<Board[]>('/api/v1/boards');
  }

  async createBoard(data: CreateBoardRequest): Promise<APIResponse<Board>> {
    return this.request<Board>('/api/v1/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBoard(id: string): Promise<APIResponse<Board>> {
    return this.request<Board>(`/api/v1/boards/${id}`);
  }

  async updateBoard(id: string, data: Partial<CreateBoardRequest>): Promise<APIResponse<Board>> {
    return this.request<Board>(`/api/v1/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/api/v1/boards/${id}`, {
      method: 'DELETE',
    });
  }

  // List methods
  async createList(data: CreateListRequest): Promise<APIResponse<List>> {
    return this.request<List>('/api/v1/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateList(id: string, data: Partial<CreateListRequest>): Promise<APIResponse<List>> {
    return this.request<List>(`/api/v1/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteList(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/api/v1/lists/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderList(id: string, data: ReorderListRequest): Promise<APIResponse<List>> {
    return this.request<List>(`/api/v1/lists/${id}/reorder`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Card methods
  async createCard(data: CreateCardRequest): Promise<APIResponse<Card>> {
    return this.request<Card>('/api/v1/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCard(id: string, data: Partial<CreateCardRequest>): Promise<APIResponse<Card>> {
    return this.request<Card>(`/api/v1/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string): Promise<APIResponse<void>> {
    return this.request<void>(`/api/v1/cards/${id}`, {
      method: 'DELETE',
    });
  }

  async moveCard(data: MoveCardRequest): Promise<APIResponse<Card>> {
    return this.request<Card>('/api/v1/cards/move', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async reorderCard(id: string, data: ReorderCardRequest): Promise<APIResponse<Card>> {
    return this.request<Card>(`/api/v1/cards/${id}/reorder`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<APIResponse<{ message: string; version: string }>> {
    return this.request<{ message: string; version: string }>('/health');
  }
}

export const apiClient = new ApiClient(); 