import { useState, useEffect } from 'react';
import type { 
  Project, 
  TeamMember, 
  UserAccount,
  ScriptScene, 
  StoryboardFrame, 
  Shot, 
  AudioTake, 
  RenderFile, 
  ChatMessage, 
  MainNavigation, 
  ProjectModule, 
  ProductionStage 
} from './types';
import { StudioApi } from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Inspector } from './components/Inspector';

// Views
import { OverviewView } from './components/views/OverviewView';
import { ProjectHubView } from './components/views/ProjectHubView';
import { ScriptView } from './components/views/ScriptView';
import { StoryboardView } from './components/views/StoryboardView';
import { ShotsView } from './components/views/ShotsView';
import { AudioLabView } from './components/views/AudioLabView';
import { RendersView } from './components/views/RendersView';
import { TeamChatView } from './components/views/TeamChatView';

// Modals
import { NewShotModal } from './components/Modals/NewShotModal';
import { ExportModal } from './components/Modals/ExportModal';
import { NewProjectModal } from './components/Modals/NewProjectModal';
import { LoginModal } from './components/Modals/LoginModal';

export function App() {
  const [currentNav, setCurrentNav] = useState<MainNavigation>('project');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activeModule, setActiveModule] = useState<ProjectModule>('hub');

  const [projects, setProjects] = useState<Project[]>([]);
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
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Authenticated Artist Account (Default: maltea)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => StudioApi.getCurrentUser());

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [projList, teamData, sc, sb, sh, aud, rend, chat] = await Promise.all([
        StudioApi.getProjects(),
        StudioApi.getTeam(),
        StudioApi.getScriptScenes(),
        StudioApi.getStoryboards(),
        StudioApi.getShots(),
        StudioApi.getAudioTakes(),
        StudioApi.getRenders(),
        StudioApi.getChat()
      ]);

      setProjects(projList);
      if (projList.length > 0) {
        setSelectedProjectId(projList[0].id);
      }
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

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Handlers
  const handleAddProject = async (newProjData: Omit<Project, 'id'>) => {
    const created = await StudioApi.addProject(newProjData);
    const updated = await StudioApi.getProjects();
    setProjects(updated);
    setSelectedProjectId(created.id);
    setCurrentNav('project');
    setActiveModule('hub');
  };

  const handleDeleteProject = async (projectId: string) => {
    const updated = await StudioApi.deleteProject(projectId);
    setProjects(updated);
    if (selectedProjectId === projectId) {
      if (updated.length > 0) {
        setSelectedProjectId(updated[0].id);
      } else {
        setCurrentNav('studio_overview');
      }
    }
  };

  const handleLogin = (user: UserAccount) => {
    StudioApi.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleToggleScriptApproval = async (projectId: string, userId: 'maltea' | 'valtea' | 'biaktea') => {
    const updated = await StudioApi.toggleScriptApproval(projectId, userId);
    setProjects(updated);
  };

  const handleAddSceneComment = async (sceneId: string, commentText: string) => {
    const updated = await StudioApi.addSceneComment(sceneId, commentText, currentUser);
    setScenes(updated);
  };

  const handleDeleteSceneComment = async (sceneId: string, commentId: string) => {
    const updated = await StudioApi.deleteSceneComment(sceneId, commentId);
    setScenes(updated);
  };

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

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentNav('project');
    setActiveModule('hub');
  };

  if (!activeProject) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#fcfaf6]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-amber-600 border-t-transparent animate-spin mx-auto" />
          <p className="font-serif italic text-stone-600 text-sm">Opening Red Letters Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#fcfaf6] text-stone-900 font-sans">
      {/* Studio Header */}
      <Header
        currentNav={currentNav}
        activeModule={activeModule}
        project={activeProject}
        team={team}
        shots={shots}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenNewShot={() => setIsNewShotModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onBackToProjectHub={() => setActiveModule('hub')}
        selectedShot={selectedShot}
      />

      {/* 3-Panel Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Studio Overview, Team Room & Vertical Projects List */}
        <Sidebar
          currentNav={currentNav}
          selectedProjectId={selectedProjectId}
          projects={projects}
          team={team}
          onSelectStudioOverview={() => setCurrentNav('studio_overview')}
          onSelectTeamChat={() => setCurrentNav('team_chat')}
          onSelectProject={handleSelectProject}
          onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          onDeleteProject={handleDeleteProject}
        />

        {/* Center Panel: Active Workspace Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#fcfaf6]">
          {/* 1. Studio-wide Overview */}
          {currentNav === 'studio_overview' && (
            <OverviewView
              projects={projects}
              shots={shots}
              team={team}
              onSelectProject={handleSelectProject}
              onOpenTeamChat={() => setCurrentNav('team_chat')}
            />
          )}

          {/* 2. Global Team Collab Room */}
          {currentNav === 'team_chat' && (
            <TeamChatView
              messages={chatMessages}
              team={team}
              currentUser={currentUser}
              shots={shots}
              onSendMessage={handleSendMessage}
              onSelectShot={(shot) => {
                handleSelectShot(shot);
                setCurrentNav('project');
                setActiveModule('shots');
              }}
            />
          )}

          {/* 3. Project Production Hub (Interactive Cards & Drilled-down Modules) */}
          {currentNav === 'project' && (
            <>
              {activeModule === 'hub' && (
                <ProjectHubView
                  project={activeProject}
                  shots={shots}
                  team={team}
                  currentUser={currentUser}
                  chatMessages={chatMessages}
                  onOpenModule={(mod) => setActiveModule(mod)}
                  onSendMessage={handleSendMessage}
                  onToggleApproval={handleToggleScriptApproval}
                  onSelectShot={(shot) => {
                    handleSelectShot(shot);
                    setActiveModule('shots');
                  }}
                />
              )}

              {activeModule === 'script' && (
                <ScriptView
                  project={activeProject}
                  scenes={scenes}
                  team={team}
                  currentUser={currentUser}
                  onSaveScenes={handleSaveScenes}
                  onToggleApproval={handleToggleScriptApproval}
                  onAddComment={handleAddSceneComment}
                  onDeleteComment={handleDeleteSceneComment}
                />
              )}

              {activeModule === 'storyboard' && (
                <StoryboardView
                  frames={storyboards}
                  fps={activeProject.fps}
                  onAddFrame={handleAddStoryboardFrame}
                />
              )}

              {activeModule === 'shots' && (
                <ShotsView
                  shots={shots}
                  team={team}
                  fps={activeProject.fps}
                  selectedShot={selectedShot}
                  onSelectShot={handleSelectShot}
                  onUpdateStage={handleUpdateStage}
                  onOpenNewShot={() => setIsNewShotModalOpen(true)}
                />
              )}

              {activeModule === 'audio' && (
                <AudioLabView
                  takes={audioTakes}
                  team={team}
                  onSelectTake={handleSelectAudioTake}
                />
              )}

              {activeModule === 'renders' && (
                <RendersView
                  renders={renders}
                  team={team}
                  onAddFeedback={handleAddRenderFeedback}
                />
              )}
            </>
          )}
        </main>

        {/* Right Panel: Context Inspector */}
        {isInspectorOpen && (
          <Inspector
            selectedShot={selectedShot}
            onClose={() => setIsInspectorOpen(false)}
            team={team}
            onUpdateStage={handleUpdateStage}
            fps={activeProject.fps}
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

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        currentUser={currentUser}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />

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
        project={activeProject}
        shots={shots}
        team={team}
      />

      {/* Artist Login / Account Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
