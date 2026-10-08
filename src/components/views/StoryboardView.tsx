import React, { useState, useRef, useEffect } from 'react';
import type { Project, UserAccount } from '../../types';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  RotateCcw, 
  RotateCw, 
  Download, 
  Copy, 
  Check, 
  FileText,
  Camera,
  Volume2,
  Clapperboard,
  Sparkles
} from 'lucide-react';

interface StoryboardViewProps {
  project: Project;
  currentUser: UserAccount;
  onSaveStoryboard: (html: string) => void;
}

const DEFAULT_STORYBOARD_TEMPLATE = `
<h2 style="font-size: 1.35rem; font-weight: bold; margin-bottom: 0.5rem; color: #1c1917;">STORYBOARD VISUAL FOLIO &amp; SHOT BREAKDOWN</h2>
<p style="font-style: italic; color: #78716c; margin-bottom: 1.5rem;">Continuous Visual Beats, Framing &amp; Pacing Document</p>
<h3 style="font-size: 1.15rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #b45309;">[SEQUENCE 01: OPENING SEQUENCE]</h3>
<p><strong>[SHOT 01 — Wide Establishing Shot]</strong></p>
<p>Opening visual description of the environment, character placement, and atmospheric lighting...</p>
<p><em>Camera:</em> 24fps Wide Angle Cine Lens, smooth horizontal drift.</p>
<p><em>Audio Cue:</em> Atmospheric background ambiance and subtle musical motif.</p>
`;

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  currentUser,
  onSaveStoryboard
}) => {
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync content when active project changes
  useEffect(() => {
    if (editorRef.current) {
      const initialHtml = project.storyboardContentHtml || DEFAULT_STORYBOARD_TEMPLATE;
      editorRef.current.innerHTML = initialHtml;
      updateCounts();
    }
  }, [project.id]);

  // Count words and characters from editor
  const updateCounts = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  // Execute formatting command
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorInput();
    }
  };

  // Handle typing inside editor
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    setSaveStatus('Editing...');
    updateCounts();

    const htmlContent = editorRef.current.innerHTML;
    onSaveStoryboard(htmlContent);

    setTimeout(() => {
      setSaveStatus('Auto-saved');
    }, 600);
  };

  // Quick insertion helpers for storyboard elements
  const insertStoryboardBlock = (type: 'sequence' | 'shot' | 'camera' | 'audio' | 'action') => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (type === 'sequence') {
      document.execCommand(
        'insertHTML',
        false,
        `<h3 style="font-size: 1.15rem; font-weight: bold; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #b45309; border-bottom: 1px solid #fed7aa; padding-bottom: 0.25rem;">[SEQUENCE: NEW SEQUENCE TITLE]</h3><p>Describe sequence atmosphere and overall narrative objective...</p>`
      );
    } else if (type === 'shot') {
      document.execCommand(
        'insertHTML',
        false,
        `<p style="margin-top: 1.25rem; margin-bottom: 0.25rem;"><strong>[SHOT XX — Medium Shot • 72 frames (3.0s)]</strong></p><p style="margin-bottom: 0.5rem; line-height: 1.6;">Character action and visual motion beat breakdown...</p>`
      );
    } else if (type === 'camera') {
      document.execCommand(
        'insertHTML',
        false,
        `<p style="margin-bottom: 0.35rem; color: #44403c;"><em>Camera:</em> 50mm Anamorphic • Slow Dolly In towards subject at eye level.</p>`
      );
    } else if (type === 'audio') {
      document.execCommand(
        'insertHTML',
        false,
        `<p style="margin-bottom: 0.5rem; color: #57534e;"><em>Audio Cue:</em> Soft pneumatic hiss, ambient wind chime reverberation.</p>`
      );
    } else {
      document.execCommand(
        'insertHTML',
        false,
        `<p style="margin-bottom: 0.75rem; line-height: 1.6;">Visual beat and timing detail...</p>`
      );
    }

    handleEditorInput();
  };

  // Copy full storyboard plain text to clipboard
  const handleCopyStoryboard = () => {
    if (!editorRef.current) return;
    const plainText = editorRef.current.innerText || '';
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Storyboard as formatted .txt file
  const handleDownloadTxt = () => {
    if (!editorRef.current) return;

    // Convert HTML to clean readable plain text
    const temp = document.createElement('div');
    temp.innerHTML = editorRef.current.innerHTML;

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

    const header = [
      '======================================================================',
      'RED LETTERS STUDIO — STORYBOARD PRODUCTION FOLIO',
      `PROJECT: ${project.title.toUpperCase()}`,
      `Created By: ${project.createdByName || project.createdBy}`,
      `FPS: ${project.fps} | Status: ${project.status}`,
      `Last Edited By: ${currentUser.name} (${currentUser.role})`,
      '======================================================================\n\n'
    ].join('\n');

    const fullContent = header + bodyText;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = project.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeTitle}_Storyboard.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#fcfaf6]">
      {/* 1. Top Bar: Title, Counts, Auto-save status, Actions */}
      <div className="min-h-14 border-b border-[#e9e3d8] bg-white px-3 sm:px-6 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <FileText className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="font-serif text-sm font-semibold text-stone-900">
                Storyboard Studio
              </span>
              <span className="text-xs text-stone-400 font-sans ml-2">
                • {project.title} (Continuous Page)
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
            {wordCount} words • {charCount} chars
          </span>
        </div>

        {/* Action Buttons: Status, Copy, Download .txt */}
        <div className="flex items-center space-x-2.5 text-xs">
          <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
            {saveStatus}
          </span>

          <button
            onClick={handleCopyStoryboard}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#e9e3d8] hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            title="Copy entire storyboard text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            title="Download continuous storyboard as .txt file"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* 2. Rich Text Formatting Toolbar & Storyboard Tag Shortcuts */}
      <div className="border-b border-[#e9e3d8] bg-white/80 backdrop-blur-xs px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-1.5 shrink-0">
        {/* Rich Text Format Controls */}
        <div className="flex items-center space-x-1 flex-wrap">
          {/* Paragraph Style Selector */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                executeCommand('formatBlock', e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs bg-[#fcfaf6] border border-[#e9e3d8] rounded-lg px-2 py-1 text-stone-700 mr-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="" disabled>Style...</option>
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (Major)</option>
            <option value="h2">Heading 2 (Sequence)</option>
            <option value="h3">Heading 3 (Shot Beat)</option>
            <option value="blockquote">Quote Block</option>
          </select>

          {/* Bold, Italic, Underline, Strike */}
          <button
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-stone-200 mx-1" />

          {/* Alignments */}
          <button
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-stone-200 mx-1" />

          {/* Lists */}
          <button
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Bulleted List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-stone-200 mx-1" />

          {/* Undo / Redo */}
          <button
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Storyboard Block Quick Inserts */}
        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-[11px] text-stone-400 font-medium mr-1 uppercase tracking-wider hidden md:inline">
            Insert:
          </span>

          <button
            onClick={() => insertStoryboardBlock('sequence')}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 text-[11px] font-medium transition-colors cursor-pointer"
            title="Insert new Sequence heading"
          >
            <Clapperboard className="w-3 h-3 text-amber-700" />
            <span>+ Sequence</span>
          </button>

          <button
            onClick={() => insertStoryboardBlock('shot')}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
            title="Insert Shot block with duration tag"
          >
            <Sparkles className="w-3 h-3 text-stone-600" />
            <span>+ Shot</span>
          </button>

          <button
            onClick={() => insertStoryboardBlock('camera')}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
            title="Insert Camera direction cue"
          >
            <Camera className="w-3 h-3 text-stone-600" />
            <span>+ Camera</span>
          </button>

          <button
            onClick={() => insertStoryboardBlock('audio')}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-medium transition-colors cursor-pointer"
            title="Insert Audio / FX note"
          >
            <Volume2 className="w-3 h-3 text-stone-600" />
            <span>+ Audio Cue</span>
          </button>
        </div>
      </div>

      {/* 3. Editor Viewport (Single Continuous Document Page) */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 md:p-10 flex justify-center bg-[#fcfaf6]">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-[#e9e3d8] p-4 sm:p-10 md:p-16 min-h-[500px] flex flex-col">
          {/* Document Header info */}
          <div className="mb-6 pb-4 border-b border-dashed border-[#e9e3d8] flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-serif italic font-semibold text-stone-700">
                Red Letters Studio • Storyboard Master Folio
              </span>
              <span>•</span>
              <span className="font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                {project.fps} FPS Continuous Reel
              </span>
            </div>
            <div className="font-mono text-[11px]">
              Active Author: <span className="font-semibold text-stone-600">{currentUser.name}</span>
            </div>
          </div>

          {/* Rich Text Continuous Document Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleEditorInput}
            className="flex-1 outline-none text-stone-900 leading-relaxed font-sans text-sm md:text-base prose max-w-none focus:outline-none"
            style={{
              minHeight: '650px',
              lineHeight: 1.7
            }}
          />

          {/* Bottom Folio Footer */}
          <div className="mt-12 pt-4 border-t border-[#e9e3d8] flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>Red Letters Animation Production Pipeline</span>
            <span>Single-Page Continuous Storyboard • {project.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
