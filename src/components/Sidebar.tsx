import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Film, 
  Plus, 
  Users,
  Trash2
} from 'lucide-react';
import type { MainNavigation, Project, TeamMember } from '../types';

interface SidebarProps {
  currentNav: MainNavigation;
  selectedProjectId: string;
  projects: Project[];
  team: TeamMember[];
  onSelectStudioOverview: () => void;
  onSelectTeamChat: () => void;
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  selectedProjectId,
  projects,
  team,
  onSelectStudioOverview,
  onSelectTeamChat,
  onSelectProject,
  onOpenNewProject,
  onDeleteProject,
  unreadCount = 2
}) => {
  return (
    <aside className="w-64 lg:w-72 border-r border-[#e9e3d8] bg-[#fcfaf6] flex flex-col justify-between shrink-0 h-full select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Top Studio Tools */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Studio Core
          </div>

          {/* 1. Studio Overview */}
          <button
            onClick={onSelectStudioOverview}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
              currentNav === 'studio_overview'
                ? 'bg-white text-stone-900 border border-[#e9e3d8] shadow-xs'
                : 'text-stone-600 hover:bg-[#f6efe3]/70 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-lg transition-colors ${
                currentNav === 'studio_overview'
                  ? 'bg-amber-100/70 text-amber-800'
                  : 'bg-stone-100 text-stone-500 group-hover:text-stone-700'
              }`}>
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold leading-tight">Studio Overview</div>
                <div className="text-[10px] text-stone-400 leading-tight">All films & deliverables</div>
              </div>
            </div>
          </button>

          {/* 2. Team Collab Room */}
          <button
            onClick={onSelectTeamChat}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
              currentNav === 'team_chat'
                ? 'bg-white text-stone-900 border border-[#e9e3d8] shadow-xs'
                : 'text-stone-600 hover:bg-[#f6efe3]/70 hover:text-stone-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-lg transition-colors ${
                currentNav === 'team_chat'
                  ? 'bg-amber-100/70 text-amber-800'
                  : 'bg-stone-100 text-stone-500 group-hover:text-stone-700'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold leading-tight">Team Collab Room</div>
                <div className="text-[10px] text-stone-400 leading-tight">5-artist discussion</div>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {unreadCount} new
              </span>
            )}
          </button>
        </div>

        {/* Middle Section: Projects List (Intlar thla) with Create Project button */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Film Projects ({projects.length})
            </span>
          </div>

          {/* Dedicated "Create Project" Button right above the projects */}
          <button
            onClick={onOpenNewProject}
            className="w-full mb-3 py-2 px-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 hover:bg-amber-100/80 hover:border-amber-400 text-amber-900 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-2xs group cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform stroke-[2.5]" />
            <span>Create Project</span>
          </button>

          {/* Projects vertical list */}
          <div className="space-y-1.5">
            {projects.map((proj) => {
              const isSelected = currentNav === 'project' && selectedProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`w-full text-left p-2.5 rounded-xl transition-all group flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white border border-amber-300 ring-2 ring-amber-100/60 shadow-xs'
                      : 'border border-transparent hover:bg-white/80 hover:border-[#e9e3d8]'
                  }`}
                  onClick={() => onSelectProject(proj.id)}
                >
                  <div className="relative mt-0.5 shrink-0">
                    {proj.coverImage ? (
                      <img 
                        src={proj.coverImage} 
                        alt={proj.title} 
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-stone-200" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
                        <Film className="w-4 h-4" />
                      </div>
                    )}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="truncate flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold leading-tight truncate ${
                        isSelected ? 'text-stone-900' : 'text-stone-700'
                      }`}>
                        {proj.title}
                      </p>

                      {/* Project Delete Button */}
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-all ml-1 shrink-0"
                          title={`Delete ${proj.title}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                        proj.status === 'Production' ? 'bg-amber-50 text-amber-800 border border-amber-200/50' :
                        proj.status === 'Post-Production' ? 'bg-sky-50 text-sky-800 border border-sky-200/50' :
                        'bg-purple-50 text-purple-800 border border-purple-200/50'
                      }`}>
                        {proj.status}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {proj.fps}fps
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Indie Team Live Presence */}
      <div className="p-4 border-t border-[#e9e3d8] bg-white/60">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span>Indie Team (5)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
            3 Active
          </span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {team.map((m) => (
            <div 
              key={m.id}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-100/60 transition-colors text-xs"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <div className="relative shrink-0">
                  <img 
                    src={m.avatar} 
                    alt={m.name} 
                    className="w-6 h-6 rounded-full object-cover" 
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                    m.status === 'online' ? 'bg-emerald-500' :
                    m.status === 'busy' ? 'bg-amber-500' : 'bg-stone-300'
                  }`} />
                </div>
                <div className="truncate">
                  <p className="font-medium text-stone-800 leading-tight truncate">{m.name}</p>
                  <p className="text-[10px] text-stone-400 leading-tight truncate">{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
