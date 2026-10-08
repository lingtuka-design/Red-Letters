import React, { useState, useRef, useEffect } from 'react';
import type { 
  ScriptScene, 
  TeamMember,
  Project,
  UserAccount 
} from '../../types';
import { 
  Plus, 
  Copy, 
  Check, 
  Trash2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  List,
  ListOrdered,
  RotateCcw,
  RotateCw,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';

interface ScriptViewProps {
  project: Project;
  scenes: ScriptScene[];
  team: TeamMember[];
  currentUser: UserAccount;
  onSaveScenes: (scenes: ScriptScene[]) => void;
  onToggleApproval: (projectId: string, userId: 'maltea' | 'valtea' | 'biaktea') => void;
  onAddComment: (sceneId: string, comment: string) => void;
  onDeleteComment: (sceneId: string, commentId: string) => void;
}

// Helper to convert structured elements to clean screenplay HTML if contentHtml is missing
function elementsToHtml(elements?: ScriptScene['elements']): string {
  if (!elements || elements.length === 0) {
    return '<p>Start typing your scene screenplay here...</p>';
  }

  return elements.map(el => {
    if (el.type === 'slugline') {
      return `<p style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1.5rem; margin-bottom: 0.5rem;">${el.text}</p>`;
    }
    if (el.type === 'action') {
      return `<p style="margin-bottom: 0.75rem; line-height: 1.6;">${el.text}</p>`;
    }
    if (el.type === 'character') {
      return `<p style="text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1rem; margin-bottom: 0.25rem;">${el.text}</p>`;
    }
    if (el.type === 'parenthetical') {
      return `<p style="text-align: center; font-style: italic; color: #57534e; margin-bottom: 0.25rem;">${el.text}</p>`;
    }
    if (el.type === 'dialogue') {
      return `<p style="max-width: 26rem; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 0.75rem; line-height: 1.5;">${el.text}</p>`;
    }
    return `<p>${el.text}</p>`;
  }).join('');
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  project,
  scenes,
  currentUser,
  onSaveScenes,
  onToggleApproval,
  onAddComment,
  onDeleteComment
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string>('Saved');
  const [commentInput, setCommentInput] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  const currentScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];
  const approvals = project.approvals || { maltea: false, valtea: false, biaktea: false };
  const approvalCount = [approvals.maltea, approvals.valtea, approvals.biaktea].filter(Boolean).length;
  const isFullyApproved = approvalCount === 3;

  // Sync editor content when switching scenes
  useEffect(() => {
    if (editorRef.current && currentScene) {
      const htmlContent = currentScene.contentHtml || elementsToHtml(currentScene.elements);
      editorRef.current.innerHTML = htmlContent;
    }
  }, [currentScene?.id]);

  // Execute rich text formatting commands
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorInput();
    }
  };

  // Screenplay format helpers
  const insertScreenplayBlock = (type: 'slugline' | 'action' | 'character' | 'parenthetical' | 'dialogue') => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (type === 'slugline') {
      document.execCommand('formatBlock', false, 'p');
      document.execCommand('insertHTML', false, '<p style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1.5rem; margin-bottom: 0.5rem;">EXT. LOCATION - DAY</p>');
    } else if (type === 'character') {
      document.execCommand('insertHTML', false, '<p style="text-align: center; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 1rem; margin-bottom: 0.25rem;">CHARACTER NAME</p>');
    } else if (type === 'parenthetical') {
      document.execCommand('insertHTML', false, '<p style="text-align: center; font-style: italic; color: #57534e; margin-bottom: 0.25rem;">(beat)</p>');
    } else if (type === 'dialogue') {
      document.execCommand('insertHTML', false, '<p style="max-width: 26rem; margin-left: auto; margin-right: auto; text-align: center; margin-bottom: 0.75rem; line-height: 1.5;">Dialogue spoken by character...</p>');
    } else {
      document.execCommand('insertHTML', false, '<p style="margin-bottom: 0.75rem; line-height: 1.6;">Action description of the scene...</p>');
    }

    handleEditorInput();
  };

  // Handle content edits
  const handleEditorInput = () => {
    if (!editorRef.current || !currentScene) return;
    setSavedStatus('Editing...');

    const newHtml = editorRef.current.innerHTML;
    const updatedScenes = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          contentHtml: newHtml
        };
      }
      return s;
    });

    onSaveScenes(updatedScenes);
    setTimeout(() => setSavedStatus('Auto-saved'), 600);
  };

  // Handle Slugline / Synopsis text edits
  const handleUpdateHeader = (field: 'slugline' | 'synopsis', val: string) => {
    if (!currentScene) return;
    const updatedScenes = scenes.map(s => {
      if (s.id === currentScene.id) {
        return {
          ...s,
          [field]: val
        };
      }
      return s;
    });
    onSaveScenes(updatedScenes);
  };

  // Add New Scene (creates clean blank page)
  const handleAddScene = () => {
    const nextSceneNum = scenes.length + 1;
    const newScene: ScriptScene = {
      id: `sc_${Date.now()}`,
      projectId: project.id,
      sceneNumber: nextSceneNum,
      slugline: `INT. SCENE ${nextSceneNum.toString().padStart(2, '0')} - CONTINUOUS`,
      synopsis: 'Scene summary and narrative beat breakdown...',
      estimatedDurationSec: 60,
      contentHtml: `<p style="font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1rem; margin-bottom: 0.75rem;">INT. SCENE ${nextSceneNum.toString().padStart(2, '0')} - CONTINUOUS</p><p style="margin-bottom: 0.75rem; line-height: 1.6;">Describe character motion and environment atmosphere here...</p>`
    };

    const updated = [...scenes, newScene];
    onSaveScenes(updated);
    setSelectedSceneId(newScene.id);
  };

  // Delete Current Scene
  const handleDeleteScene = () => {
    if (scenes.length <= 1) {
      alert("At least one scene must remain in the screenplay.");
      return;
    }
    if (window.confirm(`Delete Scene ${currentScene.sceneNumber}?`)) {
      const remaining = scenes.filter(s => s.id !== currentScene.id);
      onSaveScenes(remaining);
      setSelectedSceneId(remaining[0].id);
    }
  };

  // Copy plain text
  const handleCopyScript = () => {
    if (!editorRef.current || !currentScene) return;
    const plainText = `${currentScene.slugline}\n\n${editorRef.current.innerText}`;
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download entire screenplay as clean .txt file
  const handleDownloadTxt = () => {
    const header = [
      '======================================================================',
      'RED LETTERS STUDIO — SCREENPLAY PRODUCTION DRAFT',
      `PROJECT: ${project.title.toUpperCase()}`,
      `Created By: ${project.createdByName || project.createdBy}`,
      `FPS: ${project.fps} | Target Duration: ${project.targetDurationSec}s`,
      `Status: ${project.status}`,
      `Approvals: ${approvalCount}/3 Approved (Maltea: ${approvals.maltea ? 'YES' : 'NO'}, Valtea: ${approvals.valtea ? 'YES' : 'NO'}, Biaktea: ${approvals.biaktea ? 'YES' : 'NO'})`,
      '======================================================================\n'
    ].join('\n');

    const scenesText = scenes.map((sc) => {
      const temp = document.createElement('div');
      temp.innerHTML = sc.contentHtml || elementsToHtml(sc.elements);

      temp.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      temp.querySelectorAll('p, div, h1, h2, h3, h4').forEach(block => {
        block.prepend('\n');
        block.append('\n');
      });
      temp.querySelectorAll('li').forEach(li => {
        li.prepend('\n• ');
      });

      const bodyText = (temp.textContent || temp.innerText || '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      return [
        '----------------------------------------------------------------------',
        `SCENE ${sc.sceneNumber.toString().padStart(2, '0')}: ${sc.slugline}`,
        `Synopsis: ${sc.synopsis || 'None'}`,
        `Estimated Duration: ${sc.estimatedDurationSec}s`,
        '----------------------------------------------------------------------\n',
        bodyText,
        '\n'
      ].join('\n');
    }).join('\n\n');

    const fullContent = header + '\n' + scenesText;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeTitle}_Screenplay.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Post comment on current scene
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !currentScene) return;
    onAddComment(currentScene.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* 1. Scenes Navigation & Main Toolbar */}
      <div className="min-h-14 border-b border-[#e9e3d8] bg-white px-3 sm:px-6 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0">
        {/* Scene Tabs + "+ Add Scene" */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-full">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedSceneId === scene.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              Scene {scene.sceneNumber.toString().padStart(2, '0')}
            </button>
          ))}

          {/* Prominent "+ Add Scene" Button */}
          <button
            onClick={handleAddScene}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
            title="Create new blank screenplay scene"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Scene</span>
          </button>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2.5 text-xs">
          <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
            {savedStatus}
          </span>

          <button
            onClick={handleCopyScript}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#e9e3d8] hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            title="Copy current scene text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            title="Download full screenplay as .txt file"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Download .txt</span>
          </button>

          {scenes.length > 1 && (
            <button
              onClick={handleDeleteScene}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50/60 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title={`Delete Scene ${currentScene.sceneNumber}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Scene</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Artist Script Approval Ribbon */}
      <div className="border-b border-[#e9e3d8] bg-white/70 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-stone-800">
            {isFullyApproved ? (
              <Sparkles className="w-4 h-4 text-emerald-600" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
            <span>Screenplay Approvals ({approvalCount}/3):</span>
          </div>

          <div className="flex items-center space-x-1.5">
            {[
              { id: 'maltea' as const, name: 'Maltea', role: 'Director' },
              { id: 'valtea' as const, name: 'Valtea', role: 'Lead Animator' },
              { id: 'biaktea' as const, name: 'Biaktea', role: 'Storyboard Lead' }
            ].map(artist => {
              const approved = Boolean(approvals[artist.id]);
              const isCurrent = currentUser.id === artist.id;
              return (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => isCurrent && onToggleApproval(project.id, artist.id)}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    approved
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                      : 'bg-stone-50 text-stone-500 border border-stone-200'
                  } ${isCurrent ? 'cursor-pointer hover:ring-2 hover:ring-amber-300' : 'cursor-default'}`}
                  title={isCurrent ? `Click to toggle approval as ${artist.name}` : `${artist.name}: ${approved ? 'Approved' : 'Pending'}`}
                >
                  {approved ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Clock className="w-3 h-3 text-stone-400" />
                  )}
                  <span>{artist.name}</span>
                  <span className="text-[9px] font-mono opacity-80">
                    {approved ? '✓' : 'Pending'}
                  </span>
                </button>
              );
            })}
          </div>

          {isFullyApproved ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ★ PROJECT APPROVED
            </span>
          ) : (
            <span className="text-[10px] text-stone-400 font-sans italic">
              (Pathum approve tlanah Project Approved a ni ang)
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentUser.id === 'maltea' || currentUser.id === 'valtea' || currentUser.id === 'biaktea') {
              onToggleApproval(project.id, currentUser.id);
            }
          }}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
            approvals[currentUser.id as 'maltea' | 'valtea' | 'biaktea']
              ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          {approvals[currentUser.id as 'maltea' | 'valtea' | 'biaktea']
            ? `Undo My Approval (${currentUser.name})`
            : `✓ Approve Script as ${currentUser.name}`}
        </button>
      </div>

      {/* 2. Rich Text Formatting Toolbar */}
      <div className="border-b border-[#e9e3d8] bg-[#fcfaf6] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-1.5 shrink-0">
        {/* Screenplay Element Types */}
        <div className="flex items-center space-x-1 border-r border-[#e9e3d8] pr-3 mr-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1.5">
            Format:
          </span>
          <button
            type="button"
            onClick={() => insertScreenplayBlock('slugline')}
            className="px-2 py-1 text-[11px] font-mono font-semibold rounded hover:bg-stone-200/70 text-stone-700"
            title="Insert Scene Heading (Slugline)"
          >
            Heading
          </button>
          <button
            type="button"
            onClick={() => insertScreenplayBlock('action')}
            className="px-2 py-1 text-[11px] rounded hover:bg-stone-200/70 text-stone-700"
            title="Insert Action Description"
          >
            Action
          </button>
          <button
            type="button"
            onClick={() => insertScreenplayBlock('character')}
            className="px-2 py-1 text-[11px] font-bold uppercase rounded hover:bg-stone-200/70 text-stone-700"
            title="Insert Character Name"
          >
            Character
          </button>
          <button
            type="button"
            onClick={() => insertScreenplayBlock('dialogue')}
            className="px-2 py-1 text-[11px] rounded hover:bg-stone-200/70 text-stone-700"
            title="Insert Spoken Dialogue"
          >
            Dialogue
          </button>
          <button
            type="button"
            onClick={() => insertScreenplayBlock('parenthetical')}
            className="px-2 py-1 text-[11px] italic rounded hover:bg-stone-200/70 text-stone-700"
            title="Insert Parenthetical (beat)"
          >
            (Parenthetical)
          </button>
        </div>

        {/* Standard Rich Text Buttons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-stone-300 mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded hover:bg-stone-200/70 text-stone-700"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Screenplay Page Canvas & Scene Comments */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10">
        {currentScene ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="w-full bg-white border border-[#e9e3d8] rounded-2xl shadow-sm p-4 sm:p-8 md:p-14 font-mono text-xs sm:text-sm leading-relaxed text-stone-800 min-h-[500px] h-auto">
              {/* Page Header (Editable Slugline & Synopsis) */}
              <div className="pb-6 mb-6 border-b border-[#e9e3d8]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-wider uppercase font-sans font-bold text-amber-700">
                    Scene {currentScene.sceneNumber.toString().padStart(2, '0')} • Production Screenplay
                  </span>
                  <span className="text-xs font-sans text-stone-400">
                    Page {currentScene.sceneNumber}
                  </span>
                </div>

                {/* Editable Slugline Title */}
                <input
                  type="text"
                  value={currentScene.slugline}
                  onChange={(e) => handleUpdateHeader('slugline', e.target.value.toUpperCase())}
                  placeholder="EXT. SCENE LOCATION - DAY"
                  className="w-full font-bold text-stone-900 tracking-wider text-base uppercase bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 focus:outline-none transition-colors"
                />

                {/* Editable Synopsis */}
                <input
                  type="text"
                  value={currentScene.synopsis}
                  onChange={(e) => handleUpdateHeader('synopsis', e.target.value)}
                  placeholder="Brief scene synopsis..."
                  className="w-full text-xs font-sans text-stone-500 italic bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Rich Text contentEditable Body */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                suppressContentEditableWarning
                className="focus:outline-none min-h-[400px] h-auto space-y-3 cursor-text font-mono text-sm leading-relaxed text-stone-800 break-words"
                style={{
                  fontFamily: "'JetBrains Mono', Courier, monospace",
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              />
            </div>

            {/* 4. Scene Discussion & Feedback Section (Maltea, Valtea, Biaktea) */}
            <div className="w-full bg-white border border-[#e9e3d8] rounded-2xl shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#e9e3d8]">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-stone-900">
                      Scene {currentScene.sceneNumber} Discussion & Feedback
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Maltea, Valtea leh Biaktea te sawi hona leh rawtna te
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  {(currentScene.comments || []).length} comments
                </span>
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handlePostComment} className="flex items-start space-x-3 bg-[#fcfaf6] p-3.5 rounded-xl border border-[#e9e3d8]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200 shrink-0 mt-0.5"
                />
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder={`Sawi ve rawh le, ${currentUser.name}... (Scene ${currentScene.sceneNumber} chungchangah)`}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#e9e3d8] bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 font-sans"
                    required
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-stone-500">
                      Commenting as <strong className="text-stone-800">{currentUser.name}</strong> ({currentUser.role})
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Scene Comments Feed */}
              <div className="space-y-3 pt-1">
                {(!currentScene.comments || currentScene.comments.length === 0) ? (
                  <div className="text-center py-6 text-stone-400 text-xs italic bg-[#fcfaf6] rounded-xl border border-dashed border-[#e9e3d8]">
                    He scene-ah hian comment a la awm lo. Sawi hmasak ber rawh le!
                  </div>
                ) : (
                  currentScene.comments.map((cm) => {
                    const isOwn = cm.authorId === currentUser.id;
                    return (
                      <div
                        key={cm.id}
                        className="p-3.5 rounded-xl bg-[#fcfaf6] border border-[#e9e3d8] flex items-start justify-between space-x-3 group transition-colors hover:bg-white"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={cm.authorAvatar}
                            alt={cm.authorName}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-200 shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-stone-900">
                                {cm.authorName}
                              </span>
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/50">
                                {cm.authorRole}
                              </span>
                              <span className="text-[10px] font-mono text-stone-400">
                                {cm.createdAt}
                              </span>
                            </div>
                            <p className="text-xs text-stone-700 mt-1 leading-relaxed font-sans">
                              {cm.comment}
                            </p>
                          </div>
                        </div>

                        {isOwn && (
                          <button
                            type="button"
                            onClick={() => onDeleteComment(currentScene.id, cm.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-all shrink-0 cursor-pointer"
                            title="Delete your comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-stone-400 text-xs">No scene selected.</div>
        )}
      </div>
    </div>
  );
};
