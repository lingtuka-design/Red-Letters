import React, { useState } from 'react';
import type { 
  ScriptScene, 
  TeamMember 
} from '../../types';
import { 
  Plus, 
  Clock, 
  Copy, 
  Check
} from 'lucide-react';

interface ScriptViewProps {
  scenes: ScriptScene[];
  team: TeamMember[];
  onSaveScenes: (scenes: ScriptScene[]) => void;
}

export const ScriptView: React.FC<ScriptViewProps> = ({
  scenes,
  onSaveScenes
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<'action' | 'dialogue'>('dialogue');
  const [newCharacter, setNewCharacter] = useState('ARIA');
  const [newText, setNewText] = useState('');

  const currentScene = scenes.find(s => s.id === selectedSceneId) || scenes[0];

  const handleCopyScript = () => {
    if (!currentScene) return;
    const text = currentScene.elements.map(el => {
      if (el.type === 'slugline') return `\n${el.text}\n`;
      if (el.type === 'character') return `\n          ${el.text}`;
      if (el.type === 'parenthetical') return `       ${el.text}`;
      if (el.type === 'dialogue') return `     ${el.text}`;
      return `\n${el.text}`;
    }).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddElement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !currentScene) return;

    const updatedScenes = scenes.map(scene => {
      if (scene.id === currentScene.id) {
        const newElements = [...scene.elements];
        if (newType === 'dialogue') {
          newElements.push({ type: 'character', text: newCharacter.toUpperCase() });
          newElements.push({ type: 'dialogue', text: newText.trim() });
        } else {
          newElements.push({ type: 'action', text: newText.trim() });
        }
        return { ...scene, elements: newElements };
      }
      return scene;
    });

    onSaveScenes(updatedScenes);
    setNewText('');
    setShowAddModal(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Script Toolbar */}
      <div className="h-14 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setSelectedSceneId(scene.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSceneId === scene.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 border border-transparent'
              }`}
            >
              Scene {scene.sceneNumber.toString().padStart(2, '0')}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 text-stone-500 font-mono text-[11px] px-2.5 py-1 rounded-md bg-stone-100">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Est. ~{currentScene?.estimatedDurationSec}s screen time</span>
          </div>

          <button
            onClick={handleCopyScript}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#e9e3d8] hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? 'Copied' : 'Copy Screenplay'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Beat / Line</span>
          </button>
        </div>
      </div>

      {/* Screenplay Document Canvas */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 flex justify-center">
        {currentScene ? (
          <div className="w-full max-w-3xl bg-white border border-[#e9e3d8] rounded-xl shadow-xs p-8 md:p-14 font-mono text-sm leading-relaxed text-stone-800">
            {/* Page Header / Scene Slugline */}
            <div className="pb-6 mb-8 border-b border-[#e9e3d8]/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-wider uppercase font-sans font-bold text-amber-700 block mb-1">
                  Scene {currentScene.sceneNumber} • Production Draft
                </span>
                <p className="font-sans text-xs text-stone-500 italic">
                  {currentScene.synopsis}
                </p>
              </div>
              <span className="text-xs font-sans text-stone-400">Page 1</span>
            </div>

            {/* Screenplay Content */}
            <div className="space-y-5">
              {currentScene.elements.map((el, idx) => {
                if (el.type === 'slugline') {
                  return (
                    <div key={idx} className="font-bold text-stone-900 tracking-wider text-sm pt-4 uppercase">
                      {el.text}
                    </div>
                  );
                }

                if (el.type === 'action') {
                  return (
                    <div key={idx} className="text-stone-700 font-normal leading-relaxed pl-0 pr-6">
                      {el.text}
                    </div>
                  );
                }

                if (el.type === 'character') {
                  return (
                    <div key={idx} className="font-bold text-center tracking-widest text-stone-900 pt-3 uppercase">
                      {el.text}
                    </div>
                  );
                }

                if (el.type === 'parenthetical') {
                  return (
                    <div key={idx} className="text-center text-xs text-stone-500 italic">
                      {el.text}
                    </div>
                  );
                }

                if (el.type === 'dialogue') {
                  return (
                    <div key={idx} className="max-w-md mx-auto text-center text-stone-800 pb-2">
                      {el.text}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="text-stone-400 text-xs">No scene selected.</div>
        )}
      </div>

      {/* Add Line / Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-md w-full shadow-lg">
            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4">
              Add Screenplay Beat to Scene {currentScene?.sceneNumber}
            </h3>

            <form onSubmit={handleAddElement} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1.5">Beat Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('dialogue')}
                    className={`py-2 text-xs font-medium rounded-lg border text-center ${
                      newType === 'dialogue' ? 'bg-amber-50 border-amber-500 text-amber-900' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Character Dialogue
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('action')}
                    className={`py-2 text-xs font-medium rounded-lg border text-center ${
                      newType === 'action' ? 'bg-amber-50 border-amber-500 text-amber-900' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    Action Description
                  </button>
                </div>
              </div>

              {newType === 'dialogue' && (
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Character Name</label>
                  <input
                    type="text"
                    value={newCharacter}
                    onChange={(e) => setNewCharacter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase font-mono"
                    placeholder="e.g. ARIA or COG"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">
                  {newType === 'dialogue' ? 'Spoken Dialogue Line' : 'Visual Action Description'}
                </label>
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder={newType === 'dialogue' ? 'Enter dialogue...' : 'Describe camera action...'}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                >
                  Insert into Script
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
