import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  FileCode 
} from 'lucide-react';
import type { 
  Project, 
  Shot, 
  TeamMember 
} from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  shots: Shot[];
  team: TeamMember[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  shots,
  team
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Markdown Call Sheet & Shot Breakdown
  const generateMarkdown = () => {
    let md = `# Production Shot Sheet: ${project.title}\n`;
    md += `**Status:** ${project.status} | **Target Delivery:** ${project.deadline} | **FPS:** ${project.fps}\n\n`;
    md += `| Shot Code | Title | Stage | Assignee | Frame Range | Duration | Priority |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    shots.forEach(s => {
      const member = team.find(m => m.id === s.assignedTo);
      const frameCount = s.endFrame - s.startFrame + 1;
      md += `| ${s.code} | ${s.title} | ${s.stage} | ${member?.name || 'Unassigned'} | ${s.startFrame}-${s.endFrame} (${frameCount}f) | ${s.durationSec}s | ${s.priority} |\n`;
    });

    return md;
  };

  const generateJson = () => {
    return JSON.stringify({
      project,
      shots,
      team,
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const currentContent = activeTab === 'markdown' ? generateMarkdown() : generateJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${project.slug}-breakdown.${activeTab === 'markdown' ? 'md' : 'json'}`;
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#e9e3d8] p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e9e3d8]">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
              Export Production Breakdown
            </h3>
            <p className="text-xs text-stone-500">Download shot list, timing data, and team assignments</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 ${
                activeTab === 'markdown' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-stone-600 border border-stone-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Markdown Shot Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 ${
                activeTab === 'json' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-stone-600 border border-stone-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Production JSON</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs rounded-lg border border-[#e9e3d8] hover:bg-stone-50 text-stone-700 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center space-x-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Preview Code Box */}
        <div className="flex-1 overflow-y-auto bg-stone-900 text-stone-200 p-4 rounded-xl font-mono text-xs leading-relaxed border border-stone-800">
          <pre>{currentContent}</pre>
        </div>
      </div>
    </div>
  );
};
