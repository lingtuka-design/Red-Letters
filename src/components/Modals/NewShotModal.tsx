import React, { useState } from 'react';
import { 
  X, 
  Film 
} from 'lucide-react';
import type { 
  Shot, 
  TeamMember, 
  ProductionStage, 
  ShotPriority, 
  ShotComplexity 
} from '../../types';

interface NewShotModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamMember[];
  onAddShot: (shot: Omit<Shot, 'id' | 'updatedAt'>) => void;
  lastShotNumber: number;
}

export const NewShotModal: React.FC<NewShotModalProps> = ({
  isOpen,
  onClose,
  team,
  onAddShot,
  lastShotNumber
}) => {
  if (!isOpen) return null;

  const nextCode = `SC02_SH${(lastShotNumber + 1).toString().padStart(2, '0')}`;
  const [code, setCode] = useState(nextCode);
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<ProductionStage>('Layout');
  const [priority, setPriority] = useState<ShotPriority>('Medium');
  const [complexity, setComplexity] = useState<ShotComplexity>('Normal');
  const [assignedTo, setAssignedTo] = useState(team[1]?.id || '');
  const [startFrame, setStartFrame] = useState(591);
  const [endFrame, setEndFrame] = useState(662);
  const [cameraAngle, setCameraAngle] = useState('Medium 50mm');
  const [notes, setNotes] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const frameCount = endFrame - startFrame + 1;

    onAddShot({
      projectId: 'proj_aura_01',
      sceneId: 'sc_02',
      code: code.trim().toUpperCase(),
      title: title.trim(),
      stage,
      priority,
      assignedTo,
      startFrame: Number(startFrame),
      endFrame: Number(endFrame),
      durationSec: Number((frameCount / 24).toFixed(1)),
      thumbnailUrl,
      notes: notes.trim(),
      complexity,
      cameraAngle,
      revisionCount: 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e9e3d8]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
                Create Production Shot
              </h3>
              <p className="text-xs text-stone-500">Add new shot to the 7-stage production pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Shot Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono uppercase"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Shot Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Steam Pressure Venting"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Initial Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
              >
                <option value="Script">Script</option>
                <option value="Layout">Layout</option>
                <option value="Keyframe">Keyframe</option>
                <option value="In-Between">In-Between</option>
                <option value="Color & FX">Color & FX</option>
                <option value="Composite">Composite</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Complexity</label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
              >
                <option value="Simple">Simple</option>
                <option value="Normal">Normal</option>
                <option value="Complex">Complex</option>
                <option value="Hero">Hero</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Lead Artist</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
              >
                {team.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Start Frame</label>
              <input
                type="number"
                value={startFrame}
                onChange={(e) => setStartFrame(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">End Frame</label>
              <input
                type="number"
                value={endFrame}
                onChange={(e) => setEndFrame(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Camera Staging / Lens</label>
              <input
                type="text"
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                placeholder="e.g. Lateral Tracking 35mm"
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">Thumbnail Preview URL</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 block mb-1">Director Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Keyframe notes, special effects requirements..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#e9e3d8]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-[#e9e3d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              Add to Production Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
