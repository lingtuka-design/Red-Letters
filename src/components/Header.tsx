import React from 'react';
import { 
  Clapperboard, 
  CloudLightning, 
  Plus, 
  Download, 
  Film,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import type { Project, TeamMember, UserAccount, Shot, MainNavigation, ProjectModule } from '../types';

interface HeaderProps {
  currentNav: MainNavigation;
  activeModule: ProjectModule;
  project: Project;
  team: TeamMember[];
  shots: Shot[];
  currentUser: UserAccount;
  onOpenLogin: () => void;
  onOpenNewShot: () => void;
  onOpenExport: () => void;
  onBackToProjectHub: () => void;
  onToggleMobileSidebar?: () => void;
  selectedShot?: Shot | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentNav,
  activeModule,
  project,
  team,
  shots,
  currentUser,
  onOpenLogin,
  onOpenNewShot,
  onOpenExport,
  onBackToProjectHub,
  onToggleMobileSidebar
}) => {
  const approvedCount = shots.filter(s => s.stage === 'Approved').length;
  const progressPct = shots.length > 0 ? Math.round((approvedCount / shots.length) * 100) : 0;
  const totalFrames = shots.reduce((acc, s) => acc + (s.endFrame - s.startFrame + 1), 0);
  const totalDurationSec = (totalFrames / project.fps).toFixed(1);

  const moduleTitles: Record<ProjectModule, string> = {
    hub: 'Production Modules Hub',
    script: 'Screenplay & Script',
    storyboard: 'Storyboard Studio',
    shots: 'Animation Shots Tracker',
    audio: 'Voice & Audio Lab',
    renders: 'Video Renders & Review'
  };

  return (
    <header className="h-16 border-b border-[#e9e3d8] bg-[#ffffff]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0 z-20">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        {/* Mobile Hamburger menu toggle button */}
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-1.5 -ml-1 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-[#f6efe3] md:hidden transition-colors cursor-pointer shrink-0"
            title="Open studio navigation menu"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        )}

        <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-sm shadow-amber-600/30 shrink-0">
            <Film className="w-4 h-4 sm:w-5 sm:h-5 text-amber-50" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 text-xs text-stone-500 min-w-0">
              <span className="font-serif italic font-semibold text-stone-900 text-xs sm:text-sm whitespace-nowrap">
                Red Letters
              </span>

              {currentNav === 'studio_overview' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 text-[11px] whitespace-nowrap">
                    Overview
                  </span>
                </>
              )}

              {currentNav === 'team_chat' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 text-[11px] whitespace-nowrap">
                    Team Room
                  </span>
                </>
              )}

              {currentNav === 'project' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  <span className="font-medium text-stone-700 truncate max-w-[80px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[200px]">
                    {project.title}
                  </span>

                  {activeModule !== 'hub' && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0 hidden sm:inline" />
                      <span className="hidden sm:inline-block font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 text-[11px] whitespace-nowrap">
                        {moduleTitles[activeModule]}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {currentNav === 'project' && (
              <div className="hidden md:block text-[11px] text-stone-400 font-mono">
                {project.fps} FPS • {project.aspectRatio} • {project.status}
              </div>
            )}
          </div>
        </div>

        {/* Back to Project Hub Button if inside a drilled-down module */}
        {currentNav === 'project' && activeModule !== 'hub' && (
          <button
            onClick={onBackToProjectHub}
            className="inline-flex items-center space-x-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-[#fcfaf6] border border-[#e9e3d8] hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
            title="Back to Module Cards"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Modules</span>
            <span className="sm:hidden text-[11px]">Hub</span>
          </button>
        )}
      </div>

      {/* Center Production Metrics (when project active) */}
      {currentNav === 'project' && (
        <div className="hidden xl:flex items-center space-x-6 px-4 py-1.5 rounded-full bg-[#fcfaf6] border border-[#e9e3d8]">
          <div className="flex items-center space-x-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Shots:</span>
            <span className="font-mono font-semibold text-stone-800">{shots.length}</span>
          </div>
          <div className="h-3 w-px bg-stone-200" />
          <div className="flex items-center space-x-2 text-xs">
            <Clapperboard className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Approved:</span>
            <span className="font-mono font-semibold text-emerald-700">{approvedCount} ({progressPct}%)</span>
          </div>
          <div className="h-3 w-px bg-stone-200" />
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-stone-500 font-medium">Cut:</span>
            <span className="font-mono font-semibold text-stone-800">{totalFrames} f ({totalDurationSec}s)</span>
          </div>
        </div>
      )}

      {/* Right Actions & Team Presence */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Active Logged-in Artist Profile & Switcher */}
        <button
          onClick={onOpenLogin}
          className="flex items-center space-x-2 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#e9e3d8] bg-[#fcfaf6] hover:bg-white hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
          title="Click to switch artist account or log in"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-stone-800 leading-tight group-hover:text-amber-800 transition-colors">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-stone-400 leading-tight">
              {currentUser.username === 'maltea' ? 'Director' : currentUser.username === 'valtea' ? 'Lead Animator' : 'Storyboard'}
            </div>
          </div>
        </button>

        {/* Indie Team Stack (3 Members) */}
        <div className="hidden lg:flex items-center -space-x-2 hover:space-x-1 transition-all duration-200 p-1 rounded-full bg-[#fcfaf6] border border-[#e9e3d8]/80">
          {team.map((m) => (
            <div 
              key={m.id} 
              className="relative group cursor-pointer"
              title={`${m.name} (${m.role}) — ${m.currentTask}`}
            >
              <img 
                src={m.avatar} 
                alt={m.name} 
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white hover:ring-amber-500 transition-all"
              />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-white ${
                m.status === 'online' ? 'bg-emerald-500' :
                m.status === 'busy' ? 'bg-amber-500' : 'bg-stone-300'
              }`} />
            </div>
          ))}
        </div>

        {/* Cloudflare Edge Badge */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/70 text-[11px] text-orange-800 font-medium">
          <CloudLightning className="w-3.5 h-3.5 text-orange-600" />
          <span>Edge D1</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {currentNav === 'project' && (
            <>
              <button
                onClick={onOpenExport}
                className="hidden md:inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white border border-[#e9e3d8] hover:bg-[#f7f2e9] hover:border-stone-300 transition-colors shadow-xs cursor-pointer"
                title="Export Shot Sheet"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export</span>
              </button>

              <button
                onClick={onOpenNewShot}
                className="inline-flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-colors shadow-sm shadow-amber-600/25 cursor-pointer"
                title="Create new shot"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">New Shot</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
