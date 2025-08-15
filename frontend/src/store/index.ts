import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User, Project, Board } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
}

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (board: Board | null) => void;
}

interface UIState {
  sidebarOpen: boolean;
  createProjectDialogOpen: boolean;
  createBoardDialogOpen: boolean;
  createListDialogOpen: boolean;
  createCardDialogOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setCreateProjectDialogOpen: (open: boolean) => void;
  setCreateBoardDialogOpen: (open: boolean) => void;
  setCreateListDialogOpen: (open: boolean) => void;
  setCreateCardDialogOpen: (open: boolean) => void;
}

// Helper function to safely get initial state
const getInitialAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      login: () => {},
      logout: () => {},
    };
  }

  const token = localStorage.getItem('token');
  return {
    user: null,
    token,
    isAuthenticated: !!token,
    login: () => {},
    logout: () => {},
  };
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...getInitialAuthState(),
      login: (user: User, token: string) =>
        set(
          {
            user,
            token,
            isAuthenticated: true,
          },
          false,
          'auth/login'
        ),
      logout: () =>
        set(
          {
            user: null,
            token: null,
            isAuthenticated: false,
          },
          false,
          'auth/logout'
        ),
    }),
    { name: 'auth-store' }
  )
);

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set) => ({
      projects: [],
      currentProject: null,
      setProjects: (projects: Project[]) =>
        set({ projects }, false, 'projects/setProjects'),
      addProject: (project: Project) =>
        set(
          (state) => ({ projects: [...state.projects, project] }),
          false,
          'projects/addProject'
        ),
      updateProject: (id: string, updates: Partial<Project>) =>
        set(
          (state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          }),
          false,
          'projects/updateProject'
        ),
      deleteProject: (id: string) =>
        set(
          (state) => ({
            projects: state.projects.filter((p) => p.id !== id),
          }),
          false,
          'projects/deleteProject'
        ),
      setCurrentProject: (project: Project | null) =>
        set({ currentProject: project }, false, 'projects/setCurrentProject'),
    }),
    { name: 'project-store' }
  )
);

export const useBoardStore = create<BoardState>()(
  devtools(
    (set) => ({
      boards: [],
      currentBoard: null,
      setBoards: (boards: Board[]) =>
        set({ boards }, false, 'boards/setBoards'),
      addBoard: (board: Board) =>
        set(
          (state) => ({ boards: [...state.boards, board] }),
          false,
          'boards/addBoard'
        ),
      updateBoard: (id: string, updates: Partial<Board>) =>
        set(
          (state) => ({
            boards: state.boards.map((b) =>
              b.id === id ? { ...b, ...updates } : b
            ),
          }),
          false,
          'boards/updateBoard'
        ),
      deleteBoard: (id: string) =>
        set(
          (state) => ({
            boards: state.boards.filter((b) => b.id !== id),
          }),
          false,
          'boards/deleteBoard'
        ),
      setCurrentBoard: (board: Board | null) =>
        set({ currentBoard: board }, false, 'boards/setCurrentBoard'),
    }),
    { name: 'board-store' }
  )
);

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      createProjectDialogOpen: false,
      createBoardDialogOpen: false,
      createListDialogOpen: false,
      createCardDialogOpen: false,
      setSidebarOpen: (open: boolean) =>
        set({ sidebarOpen: open }, false, 'ui/setSidebarOpen'),
      setCreateProjectDialogOpen: (open: boolean) =>
        set({ createProjectDialogOpen: open }, false, 'ui/setCreateProjectDialogOpen'),
      setCreateBoardDialogOpen: (open: boolean) =>
        set({ createBoardDialogOpen: open }, false, 'ui/setCreateBoardDialogOpen'),
      setCreateListDialogOpen: (open: boolean) =>
        set({ createListDialogOpen: open }, false, 'ui/setCreateListDialogOpen'),
      setCreateCardDialogOpen: (open: boolean) =>
        set({ createCardDialogOpen: open }, false, 'ui/setCreateCardDialogOpen'),
    }),
    { name: 'ui-store' }
  )
); 