import React, { useState, useRef, useEffect } from 'react';
import type { 
  ScriptScene, 
  TeamMember 
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
  RotateCw
} from 'lucide-react';

interface ScriptViewProps {
  scenes: ScriptScene[];
  team: TeamMember[];
  onSaveScenes: (scenes: ScriptScene[]) => void;
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
  scenes,
  onSaveScenes
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string>('Saved');
  const editorRef = useRef<HTMLDivElement>(null);

  const currentScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];

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
      projectId: currentScene?.projectId || 'proj_aura_01',
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

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* 1. Scenes Navigation & Main Toolbar */}
      <div className="h-14 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        {/* Scene Tabs + "+ Add Scene" */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
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
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
            {savedStatus}
          </span>

          <button
            onClick={handleCopyScript}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#e9e3d8] hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {scenes.length > 1 && (
            <button
              onClick={handleDeleteScene}
              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Scene"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Rich Text Formatting Toolbar */}
      <div className="border-b border-[#e9e3d8] bg-[#fcfaf6] px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
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

      {/* 3. Screenplay Page Canvas (Parchment Paper Editor) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center">
        {currentScene ? (
          <div className="w-full max-w-3xl bg-white border border-[#e9e3d8] rounded-2xl shadow-sm p-8 md:p-14 font-mono text-sm leading-relaxed text-stone-800 flex flex-col min-h-[700px]">
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
              className="flex-1 focus:outline-none min-h-[450px] space-y-3 cursor-text font-mono text-sm leading-relaxed text-stone-800"
              style={{
                fontFamily: "'JetBrains Mono', Courier, monospace"
              }}
            />
          </div>
        ) : (
          <div className="text-stone-400 text-xs">No scene selected.</div>
        )}
      </div>
    </div>
  );
};
