export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  members: Member[];
  created_at: string;
  updated_at: string;
}

export interface Member {
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface Board {
  id: string;
  project_id: string;
  name: string;
  description: string;
  lists: List[];
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  board_id: string;
  name: string;
  position: number;
  cards: Card[];
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  list_id: string;
  title: string;
  description: string;
  position: number;
  assignee_id?: string;
  due_date?: string;
  labels: Label[];
  comments: Comment[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WebSocketMessage {
  type: string;
  data: unknown;
  board_id: string;
  user_id: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface CreateBoardRequest {
  project_id: string;
  name: string;
  description?: string;
}

export interface CreateListRequest {
  board_id: string;
  name: string;
  position?: number;
}

export interface CreateCardRequest {
  list_id: string;
  title: string;
  description?: string;
  position?: number;
  assignee_id?: string;
  due_date?: string;
  labels?: Label[];
}

export interface MoveCardRequest {
  card_id: string;
  from_list_id: string;
  to_list_id: string;
  new_position: number;
}

export interface ReorderCardRequest {
  card_id: string;
  new_position: number;
}

export interface ReorderListRequest {
  list_id: string;
  new_position: number;
} 