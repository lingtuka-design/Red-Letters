import type { 
  Project, 
  TeamMember, 
  UserAccount,
  SceneComment,
  ScriptScene, 
  StoryboardFrame, 
  Shot, 
  AudioTake, 
  RenderFile, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TEAM, 
  USER_ACCOUNTS,
  INITIAL_SCRIPT_SCENES, 
  INITIAL_STORYBOARD_FRAMES, 
  INITIAL_SHOTS, 
  INITIAL_AUDIO_TAKES, 
  INITIAL_RENDERS, 
  INITIAL_CHAT_MESSAGES 
} from '../data/mockData';

// Cache invalidation to flush legacy 5 users
const CURRENT_VERSION = 'v3_3users_clean';
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('aura_version') !== CURRENT_VERSION) {
      localStorage.clear();
      localStorage.setItem('aura_version', CURRENT_VERSION);
    }
  } catch {}
}

// Storage keys
const STORAGE_KEYS = {
  VERSION: 'aura_version',
  CURRENT_USER: 'aura_current_user',
  PROJECTS: 'aura_projects',
  SELECTED_PROJECT_ID: 'aura_selected_project_id',
  TEAM: 'aura_team',
  SCENES: 'aura_scenes',
  STORYBOARDS: 'aura_storyboards',
  SHOTS: 'aura_shots',
  AUDIO: 'aura_audio',
  RENDERS: 'aura_renders',
  CHAT: 'aura_chat',
};

// Local storage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

export const StudioApi = {
  // Check if live Cloudflare API is reachable
  async isCloudflare(): Promise<boolean> {
    try {
      const res = await fetch('/api/shots', { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // All Projects
  async getProjects(): Promise<Project[]> {
    return getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  async addProject(newProject: Omit<Project, 'id'>): Promise<Project> {
    const projects = await this.getProjects();
    const created: Project = {
      ...newProject,
      id: `proj_${Date.now()}`
    };
    const updated = [...projects, created];
    setLocal(STORAGE_KEYS.PROJECTS, updated);
    return created;
  },

  async deleteProject(projectId: string): Promise<Project[]> {
    const projects = await this.getProjects();
    const updated = projects.filter(p => p.id !== projectId);
    setLocal(STORAGE_KEYS.PROJECTS, updated);
    return updated;
  },

  // User Authentication & Session
  getCurrentUser(): UserAccount {
    return getLocal<UserAccount>(STORAGE_KEYS.CURRENT_USER, USER_ACCOUNTS[0]);
  },

  setCurrentUser(user: UserAccount): void {
    setLocal(STORAGE_KEYS.CURRENT_USER, user);
  },

  getUserAccounts(): UserAccount[] {
    return USER_ACCOUNTS;
  },

  login(username: string, password: string): UserAccount | null {
    const found = USER_ACCOUNTS.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
    );
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    return null;
  },

  // Toggle Project Script Approval by Maltea, Valtea, or Biaktea
  async toggleScriptApproval(projectId: string, userId: 'maltea' | 'valtea' | 'biaktea'): Promise<Project[]> {
    const projects = await this.getProjects();
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const approvals = { ...(p.approvals || { maltea: false, valtea: false, biaktea: false }) };
        approvals[userId] = !approvals[userId];
        
        // If all 3 approved, project status becomes 'Approved'
        const allApproved = Boolean(approvals.maltea && approvals.valtea && approvals.biaktea);
        const newStatus: Project['status'] = allApproved ? 'Approved' : (p.status === 'Approved' ? 'Production' : p.status);

        return {
          ...p,
          approvals,
          status: newStatus
        };
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PROJECTS, updated);
    return updated;
  },

  // Team
  async getTeam(): Promise<TeamMember[]> {
    return getLocal<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM);
  },

  // Shots (Connects to /api/shots with fallback)
  async getShots(): Promise<Shot[]> {
    try {
      const res = await fetch('/api/shots');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch {
      // Fallback to local
    }
    return getLocal<Shot[]>(STORAGE_KEYS.SHOTS, INITIAL_SHOTS);
  },

  async updateShotStage(shotId: string, stage: Shot['stage']): Promise<void> {
    const shots = await this.getShots();
    const updated = shots.map(s => s.id === shotId ? { ...s, stage, updatedAt: 'Just now' } : s);
    setLocal(STORAGE_KEYS.SHOTS, updated);

    // Call Cloudflare API in background if online
    try {
      await fetch('/api/shots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shotId, stage })
      });
    } catch {}
  },

  async addShot(newShot: Omit<Shot, 'id' | 'updatedAt'>): Promise<Shot> {
    const shots = await this.getShots();
    const created: Shot = {
      ...newShot,
      id: `shot_${Date.now()}`,
      updatedAt: 'Just now'
    };
    const updated = [created, ...shots];
    setLocal(STORAGE_KEYS.SHOTS, updated);

    try {
      await fetch('/api/shots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch {}

    return created;
  },

  // Script Scenes
  async getScriptScenes(): Promise<ScriptScene[]> {
    return getLocal<ScriptScene[]>(STORAGE_KEYS.SCENES, INITIAL_SCRIPT_SCENES);
  },

  async saveScriptScenes(scenes: ScriptScene[]): Promise<void> {
    setLocal(STORAGE_KEYS.SCENES, scenes);
  },

  async addSceneComment(sceneId: string, commentText: string, user: UserAccount): Promise<ScriptScene[]> {
    const scenes = await this.getScriptScenes();
    const newComment: SceneComment = {
      id: `cm_${Date.now()}`,
      sceneId,
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      comment: commentText.trim(),
      createdAt: 'Just now'
    };

    const updated = scenes.map(s => {
      if (s.id === sceneId) {
        return {
          ...s,
          comments: [...(s.comments || []), newComment]
        };
      }
      return s;
    });

    setLocal(STORAGE_KEYS.SCENES, updated);
    return updated;
  },

  async deleteSceneComment(sceneId: string, commentId: string): Promise<ScriptScene[]> {
    const scenes = await this.getScriptScenes();
    const updated = scenes.map(s => {
      if (s.id === sceneId) {
        return {
          ...s,
          comments: (s.comments || []).filter(c => c.id !== commentId)
        };
      }
      return s;
    });
    setLocal(STORAGE_KEYS.SCENES, updated);
    return updated;
  },

  // Storyboard Frames
  async getStoryboards(): Promise<StoryboardFrame[]> {
    return getLocal<StoryboardFrame[]>(STORAGE_KEYS.STORYBOARDS, INITIAL_STORYBOARD_FRAMES);
  },

  async addStoryboard(frame: Omit<StoryboardFrame, 'id'>): Promise<StoryboardFrame> {
    const frames = await this.getStoryboards();
    const created: StoryboardFrame = {
      ...frame,
      id: `sb_${Date.now()}`
    };
    const updated = [...frames, created];
    setLocal(STORAGE_KEYS.STORYBOARDS, updated);
    return created;
  },

  // Audio takes
  async getAudioTakes(): Promise<AudioTake[]> {
    return getLocal<AudioTake[]>(STORAGE_KEYS.AUDIO, INITIAL_AUDIO_TAKES);
  },

  async selectAudioTake(takeId: string): Promise<void> {
    const takes = await this.getAudioTakes();
    const updated = takes.map(t => ({
      ...t,
      isSelected: t.id === takeId
    }));
    setLocal(STORAGE_KEYS.AUDIO, updated);
  },

  // Renders
  async getRenders(): Promise<RenderFile[]> {
    return getLocal<RenderFile[]>(STORAGE_KEYS.RENDERS, INITIAL_RENDERS);
  },

  async addRenderFeedback(renderId: string, authorId: string, timecodeSec: number, comment: string): Promise<RenderFile[]> {
    const renders = await this.getRenders();
    const updated = renders.map(r => {
      if (r.id === renderId) {
        return {
          ...r,
          feedback: [
            ...r.feedback,
            {
              id: `fb_${Date.now()}`,
              authorId,
              timecodeSec,
              comment,
              isResolved: false,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return r;
    });
    setLocal(STORAGE_KEYS.RENDERS, updated);
    return updated;
  },

  // Team Chat
  async getChat(): Promise<ChatMessage[]> {
    return getLocal<ChatMessage[]>(STORAGE_KEYS.CHAT, INITIAL_CHAT_MESSAGES);
  },

  async sendMessage(authorId: string, message: string, shotRefId?: string): Promise<ChatMessage> {
    const messages = await this.getChat();
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      projectId: 'proj_aura_01',
      authorId,
      message,
      shotRefId,
      createdAt: 'Just now'
    };
    const updated = [...messages, newMsg];
    setLocal(STORAGE_KEYS.CHAT, updated);
    return newMsg;
  },

  // Cloudflare R2 Upload
  async uploadMedia(file: File, category = 'storyboards'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        return json.url;
      }
    } catch {}

    // Fallback: create object URL or base64
    return URL.createObjectURL(file);
  }
};
