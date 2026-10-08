import React, { useState } from 'react';
import type { 
  Project, 
  Shot, 
  TeamMember,
  ChatMessage,
  ProjectModule 
} from '../../types';
import { 
  ScrollText, 
  Film, 
  Kanban, 
  Mic2, 
  Video, 
  ArrowRight, 
  Calendar, 
  MessageSquare,
  Send
} from 'lucide-react';

interface ProjectHubViewProps {
  project: Project;
  shots: Shot[];
  team: TeamMember[];
  chatMessages: ChatMessage[];
  onOpenModule: (module: ProjectModule) => void;
  onSendMessage: (authorId: string, message: string, shotRefId?: string) => void;
  onSelectShot?: (shot: Shot) => void;
}

export const ProjectHubView: React.FC<ProjectHubViewProps> = ({
  project,
  shots,
  team,
  chatMessages,
  onOpenModule,
  onSendMessage,
  onSelectShot
}) => {
  const [chatInput, setChatInput] = useState('');
  const [selectedShotRef, setSelectedShotRef] = useState<string>('');

  const currentMember = team[0]; // Sarah Vance (Director)

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    onSendMessage(currentMember.id, chatInput.trim(), selectedShotRef || undefined);
    setChatInput('');
    setSelectedShotRef('');
  };

  // Filter messages for this project (or general project messages)
  const projectMessages = chatMessages.filter(
    m => m.projectId === project.id || m.projectId === 'proj_aura_01'
  );

  // 5 Clean Minimalist Modules (Text & Icon chauh, a chhung content rawn lang lo)
  const modules = [
    {
      id: 'script' as ProjectModule,
      title: 'Screenplay & Script',
      icon: ScrollText,
      badge: 'Screenplay',
      color: 'amber'
    },
    {
      id: 'storyboard' as ProjectModule,
      title: 'Storyboard Studio',
      icon: Film,
      badge: 'Visuals',
      color: 'amber'
    },
    {
      id: 'shots' as ProjectModule,
      title: 'Animation Shots',
      icon: Kanban,
      badge: 'Pipeline',
      color: 'amber'
    },
    {
      id: 'audio' as ProjectModule,
      title: 'Voice & Audio Lab',
      icon: Mic2,
      badge: 'Sound',
      color: 'amber'
    },
    {
      id: 'renders' as ProjectModule,
      title: 'Renders & Review',
      icon: Video,
      badge: 'Master',
      color: 'amber'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Project Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e9e3d8] bg-gradient-to-br from-white via-[#fcfaf6] to-[#f6efe3] p-6 shadow-xs">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
              {project.status}
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.fps} FPS
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.aspectRatio}
            </span>
            <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-white border border-[#e9e3d8]">
              {project.resolution}
            </span>
            <span className="flex items-center text-xs text-stone-600 font-medium ml-2">
              <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
              Target: {project.deadline}
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
            {project.title}
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed font-sans max-w-3xl">
            {project.synopsis}
          </p>
        </div>

        <div className="absolute -right-8 -bottom-10 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      </div>

      {/* Main Grid: Clean Minimalist Cards on Left, Project Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 5 Clean Minimalist Text-Only Cards (cols 1 to 7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="px-1 mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Production Modules
            </h2>
            <p className="text-[11px] text-stone-500">Click a card to enter module canvas</p>
          </div>

          <div className="space-y-2.5">
            {modules.map((m) => {
              const Icon = m.icon;

              return (
                <div
                  key={m.id}
                  onClick={() => onOpenModule(m.id)}
                  className="bg-white rounded-xl border border-[#e9e3d8] p-4 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight">
                        {m.title}
                      </h3>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {m.badge} Module
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-stone-400 group-hover:text-amber-700 transition-colors">
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Project Chat (cols 8 to 12) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e9e3d8] shadow-xs flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#e9e3d8] bg-[#fcfaf6] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-700" />
              <h3 className="font-serif text-sm font-semibold text-stone-900">
                Project Chat
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
              {project.title}
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {projectMessages.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No discussion yet for this film. Send the first note!
              </div>
            ) : (
              projectMessages.map((msg) => {
                const author = team.find(t => t.id === msg.authorId);
                const isCurrentUser = msg.authorId === currentMember.id;
                const referencedShot = msg.shotRefId ? shots.find(s => s.id === msg.shotRefId) : null;

                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start space-x-2.5 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <img 
                      src={author?.avatar} 
                      alt={author?.name} 
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 shrink-0" 
                    />

                    <div className={`max-w-[85%] ${isCurrentUser ? 'text-right' : ''}`}>
                      <div className={`flex items-center space-x-1.5 mb-0.5 ${isCurrentUser ? 'justify-end' : ''}`}>
                        <span className="text-[11px] font-semibold text-stone-800">{author?.name}</span>
                        <span className="text-[9px] text-stone-400 font-mono">{msg.createdAt}</span>
                      </div>

                      <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                        isCurrentUser 
                          ? 'bg-amber-700 text-white shadow-2xs rounded-tr-none' 
                          : 'bg-[#fcfaf6] border border-[#e9e3d8] text-stone-800 shadow-2xs rounded-tl-none'
                      }`}>
                        <p>{msg.message}</p>

                        {referencedShot && (
                          <button
                            onClick={() => onSelectShot && onSelectShot(referencedShot)}
                            className={`mt-1.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded ${
                              isCurrentUser ? 'bg-amber-800 text-amber-100' : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            #{referencedShot.code}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Project Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-[#e9e3d8] bg-[#fcfaf6] space-y-1.5">
            {selectedShotRef && (
              <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span>Tagging #{shots.find(s => s.id === selectedShotRef)?.code}</span>
                <button type="button" onClick={() => setSelectedShotRef('')}>×</button>
              </div>
            )}

            <div className="flex items-center space-x-1.5">
              <select
                value={selectedShotRef}
                onChange={(e) => setSelectedShotRef(e.target.value)}
                className="text-[11px] py-1.5 px-2 rounded-lg border border-[#e9e3d8] bg-white text-stone-600 focus:outline-none max-w-[90px] truncate"
              >
                <option value=""># Shot</option>
                {shots.map(s => (
                  <option key={s.id} value={s.id}>{s.code}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Message project team..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[#e9e3d8] bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />

              <button
                type="submit"
                className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
