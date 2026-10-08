export type ProductionStage = 
  | 'Script' 
  | 'Layout' 
  | 'Keyframe' 
  | 'In-Between' 
  | 'Color & FX' 
  | 'Composite' 
  | 'Approved';

export type ShotPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ShotComplexity = 'Simple' | 'Normal' | 'Complex' | 'Hero';

export interface TeamMember {
  id: string;
  name: string;
  role: 'Director' | 'Storyboard Lead' | 'Lead Animator' | 'Sound Designer' | 'Compositor';
  avatar: string;
  email: string;
  status: 'online' | 'busy' | 'away';
  currentTask: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  fps: number;
  aspectRatio: string;
  resolution: string;
  status: 'Pre-Production' | 'Production' | 'Post-Production' | 'Final Polish';
  deadline: string;
  targetDurationSec: number;
  coverImage?: string;
  accentColor?: string;
}

export interface ScriptScene {
  id: string;
  projectId: string;
  sceneNumber: number;
  slugline: string;
  synopsis: string;
  estimatedDurationSec: number;
  contentHtml?: string;
  elements?: {
    type: 'slugline' | 'action' | 'character' | 'dialogue' | 'parenthetical' | 'transition';
    text: string;
    character?: string;
  }[];
}

export interface StoryboardFrame {
  id: string;
  projectId: string;
  sceneId: string;
  shotNumber: string;
  imageUrl: string;
  cameraMovement: 'Static Wide' | 'Slow Dolly In' | 'Pan Right' | 'Tracking Shot' | 'Dutch Angle' | 'Tilt Up';
  shotType: 'Extreme Wide' | 'Wide' | 'Medium' | 'Close Up' | 'Extreme Close Up';
  durationFrames: number;
  dialogue?: string;
  actionDescription: string;
  audioNotes?: string;
  sequenceOrder: number;
}

export interface Shot {
  id: string;
  projectId: string;
  sceneId: string;
  code: string;
  title: string;
  stage: ProductionStage;
  priority: ShotPriority;
  assignedTo: string;
  startFrame: number;
  endFrame: number;
  durationSec: number;
  thumbnailUrl: string;
  notes: string;
  complexity: ShotComplexity;
  cameraAngle: string;
  revisionCount: number;
  updatedAt: string;
}

export interface AudioTake {
  id: string;
  projectId: string;
  shotId?: string;
  characterName: string;
  voiceActor: string;
  lineText: string;
  takeNumber: number;
  audioUrl: string;
  durationSec: number;
  waveformData: number[];
  isSelected: boolean;
  rating: number;
  notes?: string;
}

export interface RenderFeedback {
  id: string;
  authorId: string;
  timecodeSec: number;
  comment: string;
  isResolved: boolean;
  createdAt: string;
}

export interface RenderFile {
  id: string;
  projectId: string;
  shotId: string;
  shotCode: string;
  version: string;
  fileName: string;
  videoUrl: string;
  posterUrl: string;
  status: 'Rendering' | 'Completed' | 'In Review' | 'Approved';
  renderEngine: string;
  durationSec: number;
  resolution: string;
  fps: number;
  fileSizeMb: number;
  feedback: RenderFeedback[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  authorId: string;
  message: string;
  attachmentUrl?: string;
  shotRefId?: string;
  createdAt: string;
}

export type MainNavigation = 'studio_overview' | 'project' | 'team_chat';
export type ProjectModule = 'hub' | 'script' | 'storyboard' | 'shots' | 'audio' | 'renders';
