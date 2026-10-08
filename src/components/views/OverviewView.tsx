import React from 'react';
import type { 
  Project, 
  Shot, 
  TeamMember, 
  ProductionStage 
} from '../../types';
import { 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp
} from 'lucide-react';

interface OverviewViewProps {
  projects: Project[];
  shots: Shot[];
  team: TeamMember[];
  onSelectProject: (projectId: string) => void;
  onOpenTeamChat: () => void;
}

const STAGE_ORDER: ProductionStage[] = [
  'Script',
  'Layout',
  'Keyframe',
  'In-Between',
  'Color & FX',
  'Composite',
  'Approved'
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  projects,
  shots,
  team,
  onSelectProject,
  onOpenTeamChat
}) => {
  const approvedCount = shots.filter(s => s.stage === 'Approved').length;
  const inProgressCount = shots.filter(s => s.stage !== 'Approved' && s.stage !== 'Script').length;
  const totalFrames = shots.reduce((acc, s) => acc + (s.endFrame - s.startFrame + 1), 0);
  const completionPct = shots.length > 0 ? Math.round((approvedCount / shots.length) * 100) : 0;

  // Group shots by stage
  const stageCounts = STAGE_ORDER.map(st => ({
    stage: st,
    count: shots.filter(s => s.stage === st).length
  }));

  const milestones = [
    { name: 'Concept & Screenplay Locking (The Clockwork Garden)', status: 'completed', date: 'Oct 02' },
    { name: 'Storyboard Animatic Reel Pass', status: 'completed', date: 'Oct 06' },
    { name: 'Keyframe Blocking & Layout Pass', status: 'in-progress', date: 'Oct 18' },
    { name: 'Voiceover & Foley Final Mix', status: 'pending', date: 'Nov 04' },
    { name: '4K Color & Lighting Composite', status: 'pending', date: 'Nov 16' },
    { name: 'Master Festival Premiere Delivery', status: 'pending', date: 'Nov 24' }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Studio Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#e9e3d8] bg-gradient-to-br from-[#ffffff] via-[#fcfaf6] to-[#f6efe3] p-5 sm:p-6 md:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Red Letters Studio • Executive Deck</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 tracking-tight mb-3">
            Collaborative Production Slate
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans font-normal mb-6">
            Central dashboard monitoring all 3 active animated short films, 5 indie artists, 24fps cine-timing metrics, and Cloudflare Edge render pipelines.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectProject(projects[0]?.id || '')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
            >
              <span>Open Lead Project: {projects[0]?.title}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenTeamChat}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#e9e3d8] text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Open Team Collab Room</span>
            </button>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-12 w-64 h-64 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      </div>

      {/* Production KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
          <span className="text-xs font-medium text-stone-400 block mb-1">Active Slate</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-serif font-bold text-stone-900">{projects.length}</span>
            <span className="text-xs text-stone-400">Films</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">1 Production, 1 Post, 1 Pre-vis</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
          <span className="text-xs font-medium text-stone-400 block mb-1">Total Pipeline Shots</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-bold text-stone-900">{shots.length}</span>
            <span className="text-xs text-emerald-600 font-medium">{completionPct}% Approved</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">{totalFrames} frames logged</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
          <span className="text-xs font-medium text-stone-400 block mb-1">Active In Production</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-bold text-amber-700">{inProgressCount}</span>
            <span className="text-xs text-stone-400">shots</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Keyframe & Composite passes</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e9e3d8] shadow-xs">
          <span className="text-xs font-medium text-stone-400 block mb-1">Next Premiere</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-medium text-stone-900">Nov 24, 2026</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">47 Days Remaining</p>
        </div>
      </div>

      {/* Film Projects Slate Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Active Film Productions
          </h2>
          <span className="text-xs text-stone-400">Click any film to open its module hub</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="bg-white rounded-2xl border border-[#e9e3d8] overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  <img 
                    src={proj.coverImage} 
                    alt={proj.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {proj.fps} FPS • {proj.aspectRatio}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                      proj.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-amber-500/90 text-stone-900'
                    }`}>
                      {proj.status}
                    </span>
                    {proj.createdByName && (
                      <span className="text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs font-sans">
                        by {proj.createdByName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {proj.synopsis}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="p-2.5 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] flex items-center justify-between text-xs text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
                  <span>Enter Production Hub</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Stage Animation Pipeline Progress Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#e9e3d8] shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">7-Stage Animation Pipeline Status</h2>
          <p className="text-xs text-stone-500">Global shot distribution across stages</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {stageCounts.map(({ stage, count }) => (
            <div 
              key={stage}
              className={`p-3 rounded-xl border text-center transition-all ${
                stage === 'Approved'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : count > 0
                  ? 'bg-[#fcfaf6] border-[#e9e3d8] text-stone-800'
                  : 'bg-stone-50/50 border-stone-200/50 text-stone-400'
              }`}
            >
              <div className="text-[11px] font-medium truncate mb-1">{stage}</div>
              <div className="text-lg font-mono font-bold">
                {count}
              </div>
              <div className="text-[10px] text-stone-400">
                {count === 1 ? '1 shot' : `${count} shots`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Milestones & Team Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#e9e3d8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-stone-500" />
              <h2 className="text-sm font-semibold text-stone-900">Studio Milestones</h2>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Season 2026</span>
          </div>

          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    m.status === 'completed' ? 'bg-emerald-500 ring-4 ring-emerald-100' :
                    m.status === 'in-progress' ? 'bg-amber-500 ring-4 ring-amber-100' :
                    'bg-stone-300'
                  }`} />
                  <div>
                    <p className={`text-xs font-medium ${
                      m.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-800'
                    }`}>
                      {m.name}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-400">{m.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e9e3d8] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-stone-500" />
              <h2 className="text-sm font-semibold text-stone-900">Indie Team Roster (3 Artists)</h2>
            </div>
            <button
              onClick={onOpenTeamChat}
              className="text-xs text-amber-700 hover:text-amber-800 font-medium"
            >
              Open Studio Chat
            </button>
          </div>

          <div className="space-y-3">
            {team.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 bg-[#fcfaf6] hover:bg-[#f6efe3]/50 transition-colors"
              >
                <div className="flex items-center space-x-3 truncate">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200" 
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-stone-800 leading-tight">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-amber-700/80 leading-tight">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-[11px] text-stone-500 font-medium block truncate max-w-[170px]">
                    {member.currentTask}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    member.status === 'online' ? 'text-emerald-600' : 'text-stone-400'
                  }`}>
                    ● {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
