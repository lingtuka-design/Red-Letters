import React from 'react';
import { 
  LayoutDashboard, 
  ScrollText, 
  Film, 
  Kanban, 
  Mic2, 
  Video, 
  MessageSquare, 
  Calendar, 
  Users
} from 'lucide-react';
import type { PipelineView, TeamMember, Project } from '../types';

interface SidebarProps {
  currentView: PipelineView;
  onSelectView: (view: PipelineView) => void;
  team: TeamMember[];
  project: Project;
  unreadCount?: number;
  shotCounts: {
    total: number;
    inProgress: number;
    approved: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  team,
  project,
  unreadCount = 2,
  shotCounts
}) => {
  const navItems = [
    {
      id: 'overview' as PipelineView,
      label: 'Studio Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Milestones & delivery'
    },
    {
      id: 'script' as PipelineView,
      label: 'Screenplay & Script',
      icon: ScrollText,
      badge: '3 Sc',
      desc: 'Scene breakdowns'
    },
    {
      id: 'storyboard' as PipelineView,
      label: 'Storyboard Studio',
      icon: Film,
      badge: '6 Frames',
      desc: 'Visual sequencing'
    },
    {
      id: 'shots' as PipelineView,
      label: 'Animation Shots',
      icon: Kanban,
      badge: `${shotCounts.approved}/${shotCounts.total}`,
      desc: '7-Stage production'
    },
    {
      id: 'audio' as PipelineView,
      label: 'Voice & Audio Lab',
      icon: Mic2,
      badge: '4 Takes',
      desc: 'Takes & waveforms'
    },
    {
      id: 'renders' as PipelineView,
      label: 'Renders & Review',
      icon: Video,
      badge: 'v03',
      desc: 'Timecoded feedback'
    },
    {
      id: 'chat' as PipelineView,
      label: 'Team Collab Room',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount} new` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      desc: '5-creator workspace'
    },
  ];

  const completionPct = Math.round((shotCounts.approved / Math.max(shotCounts.total, 1)) * 100);

  return (
    <aside className="w-64 lg:w-72 border-r border-[#e9e3d8] bg-[#fcfaf6] flex flex-col justify-between shrink-0 h-full select-none">
      {/* Top Nav List */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Project Selector Mini-Card */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-700">Active Film</span>
            <span className="flex items-center text-[11px] text-stone-600">
              <Calendar className="w-3 h-3 mr-1 text-stone-400" />
              {project.deadline}
            </span>
          </div>
          <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight leading-snug">
            {project.title}
          </h2>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-medium text-stone-600 mb-1">
              <span>Production Pipeline</span>
              <span className="font-mono text-amber-800">{completionPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pipeline Navigation Links */}
        <div>
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Pipeline Modules
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-white text-stone-900 border border-[#e9e3d8] shadow-xs'
                      : 'text-stone-600 hover:bg-[#f6efe3]/70 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-amber-100/70 text-amber-800' 
                        : 'bg-stone-100/80 text-stone-500 group-hover:text-stone-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-stone-400 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                      item.badgeColor || (isActive 
                        ? 'bg-amber-50 text-amber-900 border-amber-200' 
                        : 'bg-white/80 text-stone-600 border-stone-200/70')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: Team Live Presence */}
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
