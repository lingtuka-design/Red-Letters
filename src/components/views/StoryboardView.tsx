import React, { useState } from 'react';
import type { 
  StoryboardFrame 
} from '../../types';
import { 
  Plus, 
  Maximize2, 
  Volume2, 
  Camera, 
  X
} from 'lucide-react';

interface StoryboardViewProps {
  frames: StoryboardFrame[];
  fps: number;
  onAddFrame: (frame: Omit<StoryboardFrame, 'id'>) => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  frames,
  fps,
  onAddFrame
}) => {
  const [activeLightbox, setActiveLightbox] = useState<StoryboardFrame | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Frame state
  const [newShotNumber, setNewShotNumber] = useState('02D');
  const [newShotType, setNewShotType] = useState<StoryboardFrame['shotType']>('Medium');
  const [newCameraMovement, setNewCameraMovement] = useState<StoryboardFrame['cameraMovement']>('Slow Dolly In');
  const [newAction, setNewAction] = useState('');
  const [newAudio, setNewAudio] = useState('');
  const [newDurationFrames, setNewDurationFrames] = useState(72);
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80');

  const handleCreateFrame = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFrame({
      projectId: 'proj_aura_01',
      sceneId: 'sc_02',
      shotNumber: newShotNumber,
      imageUrl: newImageUrl,
      cameraMovement: newCameraMovement,
      shotType: newShotType,
      durationFrames: Number(newDurationFrames),
      actionDescription: newAction,
      audioNotes: newAudio,
      sequenceOrder: frames.length + 1
    });
    setShowAddModal(false);
    setNewAction('');
    setNewAudio('');
  };

  const totalFrames = frames.reduce((acc, f) => acc + f.durationFrames, 0);
  const totalSec = (totalFrames / fps).toFixed(1);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* Storyboard Top Bar */}
      <div className="h-14 border-b border-[#e9e3d8] bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-base font-semibold text-stone-900">
            Storyboard Animatic Frames
          </span>
          <span className="text-xs text-stone-500 font-mono px-2 py-0.5 rounded bg-stone-100">
            {frames.length} Sequenced Frames
          </span>
          <span className="hidden sm:inline-block text-xs text-stone-400 font-mono">
            • {totalFrames} frames ({totalSec}s runtime)
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Storyboard Frame</span>
        </button>
      </div>

      {/* Frame Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {frames.map((frame) => {
            const durationSec = (frame.durationFrames / fps).toFixed(1);

            return (
              <div 
                key={frame.id}
                className="bg-white rounded-2xl border border-[#e9e3d8] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Artwork Container */}
                  <div className="relative aspect-video bg-stone-900 overflow-hidden cursor-pointer" onClick={() => setActiveLightbox(frame)}>
                    <img 
                      src={frame.imageUrl} 
                      alt={`Shot ${frame.shotNumber}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Frame Number Pill */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white font-mono text-xs font-semibold">
                      Shot {frame.shotNumber}
                    </div>

                    {/* Duration */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 font-mono text-xs">
                      {frame.durationFrames}f ({durationSec}s)
                    </div>

                    {/* Expand Button */}
                    <div className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Camera Movement Tag */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-[11px] font-medium text-stone-200">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>{frame.cameraMovement}</span>
                      <span className="text-stone-400">•</span>
                      <span>{frame.shotType}</span>
                    </div>
                  </div>

                  {/* Visual & Narrative Details */}
                  <div className="p-4 space-y-2.5">
                    {frame.dialogue && (
                      <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/50 text-xs font-medium text-amber-900 italic">
                        "{frame.dialogue}"
                      </div>
                    )}

                    <p className="text-xs text-stone-700 leading-relaxed font-sans line-clamp-2">
                      {frame.actionDescription}
                    </p>
                  </div>
                </div>

                {/* Audio notes footer */}
                {frame.audioNotes && (
                  <div className="px-4 py-2.5 bg-[#fcfaf6] border-t border-[#e9e3d8] flex items-center space-x-2 text-[11px] text-stone-500">
                    <Volume2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{frame.audioNotes}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightbox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">
          <div className="bg-[#1c1917] border border-stone-700 text-stone-100 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-900">
                  SHOT {activeLightbox.shotNumber}
                </span>
                <span className="text-sm font-medium text-stone-300">
                  {activeLightbox.cameraMovement} — {activeLightbox.shotType}
                </span>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={activeLightbox.imageUrl} 
                alt={`Shot ${activeLightbox.shotNumber}`} 
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 bg-stone-900 border-t border-stone-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
                <span>Duration: {activeLightbox.durationFrames} frames ({(activeLightbox.durationFrames / fps).toFixed(2)}s)</span>
                <span>Sequence #{activeLightbox.sequenceOrder}</span>
              </div>
              <p className="text-sm text-stone-200">
                {activeLightbox.actionDescription}
              </p>
              {activeLightbox.audioNotes && (
                <p className="text-xs text-amber-300/90 flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio Cue: {activeLightbox.audioNotes}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Storyboard Frame Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-lg w-full shadow-lg">
            <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4">
              Add New Storyboard Frame
            </h3>

            <form onSubmit={handleCreateFrame} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Shot Code</label>
                  <input
                    type="text"
                    value={newShotNumber}
                    onChange={(e) => setNewShotNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
                    placeholder="02D"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Duration (Frames)</label>
                  <input
                    type="number"
                    value={newDurationFrames}
                    onChange={(e) => setNewDurationFrames(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Shot Framing</label>
                  <select
                    value={newShotType}
                    onChange={(e) => setNewShotType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
                  >
                    <option value="Extreme Wide">Extreme Wide</option>
                    <option value="Wide">Wide</option>
                    <option value="Medium">Medium</option>
                    <option value="Close Up">Close Up</option>
                    <option value="Extreme Close Up">Extreme Close Up</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">Camera Movement</label>
                  <select
                    value={newCameraMovement}
                    onChange={(e) => setNewCameraMovement(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
                  >
                    <option value="Static Wide">Static Wide</option>
                    <option value="Slow Dolly In">Slow Dolly In</option>
                    <option value="Tracking Shot">Tracking Shot</option>
                    <option value="Pan Right">Pan Right</option>
                    <option value="Tilt Up">Tilt Up</option>
                    <option value="Dutch Angle">Dutch Angle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">Artwork URL (Cloudflare R2 or Web)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">Visual Action & Camera Staging</label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
                  placeholder="Describe character motion, camera pan, or focal shift..."
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">Audio / Foley Notes</label>
                <input
                  type="text"
                  value={newAudio}
                  onChange={(e) => setNewAudio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
                  placeholder="e.g. Steam hiss, metallic footsteps, brass bells"
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
                  Add Frame to Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
