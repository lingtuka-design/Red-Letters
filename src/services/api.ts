import type { 
  Project, 
  TeamMember, 
  ScriptScene, 
  StoryboardFrame, 
  Shot, 
  AudioTake, 
  RenderFile, 
  ChatMessage 
} from '../types';
import { 
  INITIAL_PROJECT, 
  INITIAL_TEAM, 
  INITIAL_SCRIPT_SCENES, 
  INITIAL_STORYBOARD_FRAMES, 
  INITIAL_SHOTS, 
  INITIAL_AUDIO_TAKES, 
  INITIAL_RENDERS, 
  INITIAL_CHAT_MESSAGES 
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
  PROJECT: 'aura_project',
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

  // Project Info
  async getProject(): Promise<Project> {
    return getLocal<Project>(STORAGE_KEYS.PROJECT, INITIAL_PROJECT);
  },

  async updateProject(project: Partial<Project>): Promise<Project> {
    const current = await this.getProject();
    const updated = { ...current, ...project };
    setLocal(STORAGE_KEYS.PROJECT, updated);
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
