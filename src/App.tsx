import { useState, useEffect } from 'react';
import type { 
  Project, 
  TeamMember, 
  ScriptScene, 
  StoryboardFrame, 
  Shot, 
  AudioTake, 
  RenderFile, 
  ChatMessage, 
  PipelineView, 
  ProductionStage 
} from './types';
import { StudioApi } from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Inspector } from './components/Inspector';

// Pipeline Views
import { OverviewView } from './components/views/OverviewView';
import { ScriptView } from './components/views/ScriptView';
import { StoryboardView } from './components/views/StoryboardView';
import { ShotsView } from './components/views/ShotsView';
import { AudioLabView } from './components/views/AudioLabView';
import { RendersView } from './components/views/RendersView';
import { TeamChatView } from './components/views/TeamChatView';

// Modals
import { NewShotModal } from './components/Modals/NewShotModal';
import { ExportModal } from './components/Modals/ExportModal';

export function App() {
  const [currentView, setCurrentView] = useState<PipelineView>('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [storyboards, setStoryboards] = useState<StoryboardFrame[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [audioTakes, setAudioTakes] = useState<AudioTake[]>([]);
  const [renders, setRenders] = useState<RenderFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Selected context for Right Panel Inspector
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Modals
  const [isNewShotModalOpen, setIsNewShotModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [proj, teamData, sc, sb, sh, aud, rend, chat] = await Promise.all([
        StudioApi.getProject(),
        StudioApi.getTeam(),
        StudioApi.getScriptScenes(),
        StudioApi.getStoryboards(),
        StudioApi.getShots(),
        StudioApi.getAudioTakes(),
        StudioApi.getRenders(),
        StudioApi.getChat()
      ]);

      setProject(proj);
      setTeam(teamData);
      setScenes(sc);
      setStoryboards(sb);
      setShots(sh);
      setAudioTakes(aud);
      setRenders(rend);
      setChatMessages(chat);

      if (sh.length > 0) {
        setSelectedShot(sh[2]); // Default focus on Shot SC01_SH03
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleUpdateStage = async (shotId: string, stage: ProductionStage) => {
    await StudioApi.updateShotStage(shotId, stage);
    const updated = await StudioApi.getShots();
    setShots(updated);
    if (selectedShot?.id === shotId) {
      setSelectedShot(updated.find(s => s.id === shotId) || null);
    }
  };

  const handleAddShot = async (newShotData: Omit<Shot, 'id' | 'updatedAt'>) => {
    const created = await StudioApi.addShot(newShotData);
    const updated = await StudioApi.getShots();
    setShots(updated);
    setSelectedShot(created);
  };

  const handleSaveScenes = async (updatedScenes: ScriptScene[]) => {
    await StudioApi.saveScriptScenes(updatedScenes);
    setScenes(updatedScenes);
  };

  const handleAddStoryboardFrame = async (frame: Omit<StoryboardFrame, 'id'>) => {
    await StudioApi.addStoryboard(frame);
    const updated = await StudioApi.getStoryboards();
    setStoryboards(updated);
  };

  const handleSelectAudioTake = async (takeId: string) => {
    await StudioApi.selectAudioTake(takeId);
    const updated = await StudioApi.getAudioTakes();
    setAudioTakes(updated);
  };

  const handleAddRenderFeedback = async (
    renderId: string, 
    authorId: string, 
    timecodeSec: number, 
    comment: string
  ) => {
    const updated = await StudioApi.addRenderFeedback(renderId, authorId, timecodeSec, comment);
    setRenders(updated);
  };

  const handleSendMessage = async (authorId: string, message: string, shotRefId?: string) => {
    await StudioApi.sendMessage(authorId, message, shotRefId);
    const updated = await StudioApi.getChat();
    setChatMessages(updated);
  };

  const handleSelectShot = (shot: Shot) => {
    setSelectedShot(shot);
    setIsInspectorOpen(true);
  };

  if (!project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <p className="font-serif italic text-stone-600 text-sm">Opening AURA Animation Studio...</p>
        </div>
      </div>
    );
  }

  const approvedCount = shots.filter(s => s.stage === 'Approved').length;
  const inProgressCount = shots.filter(s => s.stage !== 'Approved' && s.stage !== 'Script').length;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fcfaf6] text-stone-900 font-sans">
      {/* Studio Header */}
      <Header
        project={project}
        team={team}
        shots={shots}
        onOpenNewShot={() => setIsNewShotModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        selectedShot={selectedShot}
      />

      {/* 3-Panel Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Navigation & Studio Roster */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          team={team}
          project={project}
          shotCounts={{
            total: shots.length,
            inProgress: inProgressCount,
            approved: approvedCount
          }}
        />

        {/* Center Panel: Active Production Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#fcfaf6]">
          {currentView === 'overview' && (
            <OverviewView
              project={project}
              shots={shots}
              team={team}
              onNavigate={setCurrentView}
              onSelectShot={handleSelectShot}
            />
          )}

          {currentView === 'script' && (
            <ScriptView
              scenes={scenes}
              team={team}
              onSaveScenes={handleSaveScenes}
            />
          )}

          {currentView === 'storyboard' && (
            <StoryboardView
              frames={storyboards}
              fps={project.fps}
              onAddFrame={handleAddStoryboardFrame}
            />
          )}

          {currentView === 'shots' && (
            <ShotsView
              shots={shots}
              team={team}
              fps={project.fps}
              selectedShot={selectedShot}
              onSelectShot={handleSelectShot}
              onUpdateStage={handleUpdateStage}
              onOpenNewShot={() => setIsNewShotModalOpen(true)}
            />
          )}

          {currentView === 'audio' && (
            <AudioLabView
              takes={audioTakes}
              team={team}
              onSelectTake={handleSelectAudioTake}
            />
          )}

          {currentView === 'renders' && (
            <RendersView
              renders={renders}
              team={team}
              onAddFeedback={handleAddRenderFeedback}
            />
          )}

          {currentView === 'chat' && (
            <TeamChatView
              messages={chatMessages}
              team={team}
              shots={shots}
              onSendMessage={handleSendMessage}
              onSelectShot={(shot) => {
                handleSelectShot(shot);
                setCurrentView('shots');
              }}
            />
          )}
        </main>

        {/* Right Panel: Context Inspector */}
        {isInspectorOpen && (
          <Inspector
            selectedShot={selectedShot}
            onClose={() => setIsInspectorOpen(false)}
            team={team}
            onUpdateStage={handleUpdateStage}
            fps={project.fps}
          />
        )}
      </div>

      {/* Floating Inspector Toggle when collapsed */}
      {!isInspectorOpen && (
        <button
          onClick={() => setIsInspectorOpen(true)}
          className="fixed bottom-6 right-6 px-3.5 py-2 rounded-xl bg-white border border-[#e9e3d8] hover:bg-[#f6efe3] shadow-md text-xs font-medium text-stone-700 flex items-center space-x-1.5 transition-all z-30"
        >
          <span>Open Inspector</span>
        </button>
      )}

      {/* New Shot Modal */}
      <NewShotModal
        isOpen={isNewShotModalOpen}
        onClose={() => setIsNewShotModalOpen(false)}
        team={team}
        onAddShot={handleAddShot}
        lastShotNumber={shots.length}
      />

      {/* Export Breakdown Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        shots={shots}
        team={team}
      />
    </div>
  );
}

export default App;
