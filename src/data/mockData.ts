import type { 
  Project, 
  TeamMember, 
  ScriptScene, 
  StoryboardFrame, 
  Shot, 
  AudioTake, 
  RenderFile, 
  ChatMessage 
} from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_aura_01',
    title: 'The Clockwork Garden',
    slug: 'the-clockwork-garden',
    synopsis: 'In an isolated highland observatory, a reclusive botanist and her steam-powered automaton companion race against the coming eclipse to awaken a dormant bioluminescent seed that could restore sunlight to a dimming world.',
    fps: 24,
    aspectRatio: '2.39:1 (Anamorphic)',
    resolution: '4K DCI (4096x1716)',
    status: 'Production',
    deadline: 'Nov 24, 2026',
    targetDurationSec: 320,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    accentColor: '#d97706'
  },
  {
    id: 'proj_aura_02',
    title: 'Neon Ronin: Zero',
    slug: 'neon-ronin-zero',
    synopsis: 'In a rain-slicked cybernetic Kyoto, a decommissioned synthetic bodyguard protects an orphaned memory archivist while hunted by rogue syndicate mechs.',
    fps: 24,
    aspectRatio: '16:9 Cinema',
    resolution: '4K UHD (3840x2160)',
    status: 'Post-Production',
    deadline: 'Dec 18, 2026',
    targetDurationSec: 420,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    accentColor: '#0284c7'
  },
  {
    id: 'proj_aura_03',
    title: 'The Lost Constellation',
    slug: 'the-lost-constellation',
    synopsis: 'A lyrical fairytale of a solitary cartographer mapping forgotten star clusters across a frozen celestial sea.',
    fps: 24,
    aspectRatio: '1.85:1 Flat',
    resolution: '4K DCI (4096x2160)',
    status: 'Pre-Production',
    deadline: 'Jan 15, 2027',
    targetDurationSec: 240,
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7c3aed'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'user_sarah',
    name: 'Sarah Vance',
    role: 'Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'sarah@aurastudios.com',
    status: 'online',
    currentTask: 'Reviewing Scene 02 Color Grade'
  },
  {
    id: 'user_kenji',
    name: 'Kenji Takahashi',
    role: 'Lead Animator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'kenji@aurastudios.com',
    status: 'online',
    currentTask: 'Keyframing automaton gear mechanism'
  },
  {
    id: 'user_leo',
    name: 'Leo Moreno',
    role: 'Storyboard Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'leo@aurastudios.com',
    status: 'busy',
    currentTask: 'Scene 03 action beat thumbnails'
  },
  {
    id: 'user_maya',
    name: 'Maya Raman',
    role: 'Sound Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'maya@aurastudios.com',
    status: 'online',
    currentTask: 'Foley layering: Brass windchimes'
  },
  {
    id: 'user_alex',
    name: 'Alex Davies',
    role: 'Compositor',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'alex@aurastudios.com',
    status: 'away',
    currentTask: 'Volumetric mist lighting pass'
  }
];

export const INITIAL_SCRIPT_SCENES: ScriptScene[] = [
  {
    id: 'sc_01',
    projectId: 'proj_aura_01',
    sceneNumber: 1,
    slugline: 'EXT. HIGH OBSERVATORY PEAK - DAWN',
    synopsis: 'Dawn crests over mist-covered bronze gears. The observatory dome opens with a deep mechanical groan.',
    estimatedDurationSec: 42,
    elements: [
      { type: 'slugline', text: 'EXT. HIGH OBSERVATORY PEAK - DAWN' },
      { type: 'action', text: 'Thick violet fog clings to a spine of jagged dolomite peaks. Towering above the ridge sits the AETHEL OBSERVATORY—a copper-ribbed geodesic dome etched with patina.' },
      { type: 'action', text: 'A deep metallic CLUNK shudders through the rock. The twin shutters of the roof grind open. Shafts of pale amber sunlight slice through the misty interior.' },
      { type: 'character', text: 'ARIA' },
      { type: 'parenthetical', text: '(whispering to herself, tightening leather bracer)' },
      { type: 'dialogue', text: 'Forty-seven minutes until the alignment. If the solar prisms don\'t engage today, the seedlings freeze.' }
    ]
  },
  {
    id: 'sc_02',
    projectId: 'proj_aura_01',
    sceneNumber: 2,
    slugline: 'INT. GREENHOUSE CHAMBER - CONTINUOUS',
    synopsis: 'Aria approaches the glass stasis cylinder containing the Lumina flora. Cog, the brass automaton, prepares the lenses.',
    estimatedDurationSec: 65,
    elements: [
      { type: 'slugline', text: 'INT. GREENHOUSE CHAMBER - CONTINUOUS' },
      { type: 'action', text: 'Hundreds of suspended brass planter pods hang like chandeliers from the vaulted glass ceiling. In the center, submerged in amber oil inside a crystal bell jar, rests the LUMINA ROOT.' },
      { type: 'action', text: 'COG—a knee-high mechanical companion forged of burnished brass and salvaged clock gears—scuttles forward on four jointed legs, carrying a magnifying prism.' },
      { type: 'character', text: 'COG' },
      { type: 'parenthetical', text: '(series of harmonic chimes and steam hisses)' },
      { type: 'dialogue', text: '♪ Clink-whirrr-chime! ♪' },
      { type: 'character', text: 'ARIA' },
      { type: 'dialogue', text: 'Easy, Cog. Angle the focal ring fifteen degrees west. We can\'t scorch the petals before they drink the light.' }
    ]
  },
  {
    id: 'sc_03',
    projectId: 'proj_aura_01',
    sceneNumber: 3,
    slugline: 'INT. GEAR TOWER VAULT - MOMENTS LATER',
    synopsis: 'A rusted celestial flywheel jams. Cog ventures into the grinding teeth of the clock mechanism.',
    estimatedDurationSec: 88,
    elements: [
      { type: 'slugline', text: 'INT. GEAR TOWER VAULT - MOMENTS LATER' },
      { type: 'action', text: 'The massive pendulum groans to a sudden halt. Tremors shake the catwalk. A flock of clockwork finches erupts from the eaves.' },
      { type: 'character', text: 'ARIA' },
      { type: 'dialogue', text: 'Cog, hold your position! The flywheel torque is at maximum!' }
    ]
  }
];

export const INITIAL_STORYBOARD_FRAMES: StoryboardFrame[] = [
  {
    id: 'sb_01',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    shotNumber: '01A',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Slow Dolly In',
    shotType: 'Extreme Wide',
    durationFrames: 96,
    actionDescription: 'Epic landscape reveal. Sun barely breaking horizon over gear-toothed mountain peaks.',
    audioNotes: 'Low brass drone fading into mechanical wind gusts',
    sequenceOrder: 1
  },
  {
    id: 'sb_02',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    shotNumber: '01B',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Tilt Up',
    shotType: 'Wide',
    durationFrames: 72,
    actionDescription: 'Observatory dome shutters slide open, sending copper dust into sunlight rays.',
    audioNotes: 'Heavy counterweight chains rattling',
    sequenceOrder: 2
  },
  {
    id: 'sb_03',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    shotNumber: '01C',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Static Wide',
    shotType: 'Medium',
    durationFrames: 84,
    dialogue: 'Aria: "Forty-seven minutes until the alignment..."',
    actionDescription: 'Aria inspects her chronometer pocket watch, eyes focused and determined.',
    audioNotes: 'Rapid ticking, breath in cold air',
    sequenceOrder: 3
  },
  {
    id: 'sb_04',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    shotNumber: '02A',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Tracking Shot',
    shotType: 'Medium',
    durationFrames: 110,
    actionDescription: 'Aria walks along suspended glass catwalk. Cog trots faithfully alongside.',
    audioNotes: 'Metallic pitter-patter of Cog\'s brass feet on iron mesh',
    sequenceOrder: 4
  },
  {
    id: 'sb_05',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    shotNumber: '02B',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Slow Dolly In',
    shotType: 'Close Up',
    durationFrames: 68,
    actionDescription: 'Extreme macro on the Lumina seed in oil. Tiny bioluminescent pulses rhythmically glow.',
    audioNotes: 'Warm resonant synthesizer hum like a heartbeat',
    sequenceOrder: 5
  },
  {
    id: 'sb_06',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    shotNumber: '02C',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    cameraMovement: 'Pan Right',
    shotType: 'Close Up',
    durationFrames: 72,
    dialogue: 'Cog: ♪ Clink-whirrr-chime! ♪',
    actionDescription: 'Cog tilts his multi-lens optic eye, adjusting focus ring with mechanical clicks.',
    audioNotes: 'Acoustic clock chimes and tiny optical servo whines',
    sequenceOrder: 6
  }
];

export const INITIAL_SHOTS: Shot[] = [
  {
    id: 'shot_01',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    code: 'SC01_SH01',
    title: 'Observatory Ridge Sunrise',
    stage: 'Approved',
    priority: 'High',
    assignedTo: 'user_alex',
    startFrame: 1,
    endFrame: 96,
    durationSec: 4.0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    notes: 'Matte painting approved. Volumetric cloud pass completed and graded.',
    complexity: 'Hero',
    cameraAngle: 'Extreme Wide Aerial',
    revisionCount: 3,
    updatedAt: '2 hours ago'
  },
  {
    id: 'shot_02',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    code: 'SC01_SH02',
    title: 'Dome Shutter Awakening',
    stage: 'Composite',
    priority: 'Medium',
    assignedTo: 'user_alex',
    startFrame: 97,
    endFrame: 168,
    durationSec: 3.0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    notes: 'Adding godrays and brass gear friction particle sparks.',
    complexity: 'Complex',
    cameraAngle: 'Low Angle Tilt Up',
    revisionCount: 2,
    updatedAt: '4 hours ago'
  },
  {
    id: 'shot_03',
    projectId: 'proj_aura_01',
    sceneId: 'sc_01',
    code: 'SC01_SH03',
    title: 'Aria Chronometer Check',
    stage: 'Color & FX',
    priority: 'High',
    assignedTo: 'user_kenji',
    startFrame: 169,
    endFrame: 252,
    durationSec: 3.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    notes: 'Hair physics simulated. Watch face reflections need slightly softer blur.',
    complexity: 'Normal',
    cameraAngle: 'Medium Eye Level',
    revisionCount: 4,
    updatedAt: 'Yesterday'
  },
  {
    id: 'shot_04',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    code: 'SC02_SH01',
    title: 'Greenhouse Catwalk Walk',
    stage: 'Keyframe',
    priority: 'Critical',
    assignedTo: 'user_kenji',
    startFrame: 253,
    endFrame: 362,
    durationSec: 4.6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=500&auto=format&fit=crop&q=80',
    notes: 'Cog walking cycle needs more weight anticipation on leg 3.',
    complexity: 'Hero',
    cameraAngle: 'Lateral Tracking 35mm',
    revisionCount: 5,
    updatedAt: '30 mins ago'
  },
  {
    id: 'shot_05',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    code: 'SC02_SH02',
    title: 'Lumina Bioluminescent Pulse',
    stage: 'In-Between',
    priority: 'Medium',
    assignedTo: 'user_kenji',
    startFrame: 363,
    endFrame: 430,
    durationSec: 2.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=80',
    notes: 'Secondary plant veining glow keys set. Spacing in-betweens for smooth 24fps pulse.',
    complexity: 'Normal',
    cameraAngle: 'Macro 85mm',
    revisionCount: 1,
    updatedAt: 'Just now'
  },
  {
    id: 'shot_06',
    projectId: 'proj_aura_01',
    sceneId: 'sc_02',
    code: 'SC02_SH03',
    title: 'Cog Lens Calibration',
    stage: 'Layout',
    priority: 'Medium',
    assignedTo: 'user_leo',
    startFrame: 431,
    endFrame: 502,
    durationSec: 3.0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    notes: 'Blocking out camera lens distortion and Cog iris mechanical aperture.',
    complexity: 'Simple',
    cameraAngle: 'Dutch Close-up',
    revisionCount: 1,
    updatedAt: '2 days ago'
  },
  {
    id: 'shot_07',
    projectId: 'proj_aura_01',
    sceneId: 'sc_03',
    code: 'SC03_SH01',
    title: 'Gear Tower Tremor',
    stage: 'Script',
    priority: 'High',
    assignedTo: 'user_sarah',
    startFrame: 503,
    endFrame: 590,
    durationSec: 3.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    notes: 'Screenplay beat locked. Handing over to storyboard pass.',
    complexity: 'Complex',
    cameraAngle: 'Wide Dutch Cant',
    revisionCount: 0,
    updatedAt: '3 days ago'
  }
];

export const INITIAL_AUDIO_TAKES: AudioTake[] = [
  {
    id: 'aud_01',
    projectId: 'proj_aura_01',
    shotId: 'shot_03',
    characterName: 'Aria',
    voiceActor: 'Elena Rostova',
    lineText: 'Forty-seven minutes until the alignment. If the solar prisms don\'t engage today, the seedlings freeze.',
    takeNumber: 3,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73516.mp3',
    durationSec: 4.8,
    waveformData: [12, 24, 45, 68, 85, 92, 70, 55, 30, 42, 65, 80, 95, 76, 40, 22, 10, 5, 2, 0],
    isSelected: true,
    rating: 5,
    notes: 'Perfect urgency in delivery. Keep Take 03 for final mix.'
  },
  {
    id: 'aud_02',
    projectId: 'proj_aura_01',
    shotId: 'shot_03',
    characterName: 'Aria',
    voiceActor: 'Elena Rostova',
    lineText: 'Forty-seven minutes until the alignment. If the solar prisms don\'t engage today, the seedlings freeze.',
    takeNumber: 2,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73516.mp3',
    durationSec: 5.1,
    waveformData: [10, 18, 35, 52, 60, 50, 40, 30, 25, 38, 50, 62, 70, 58, 30, 15, 8, 4, 1, 0],
    isSelected: false,
    rating: 4,
    notes: 'Slightly too paced, but good breath work.'
  },
  {
    id: 'aud_03',
    projectId: 'proj_aura_01',
    shotId: 'shot_06',
    characterName: 'Cog (Automaton)',
    voiceActor: 'Modular Synthesizer & Brass Foley',
    lineText: '♪ Harmonic chime sequence (C# - E - G#) with twin steam valves ♪',
    takeNumber: 1,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    durationSec: 2.4,
    waveformData: [25, 60, 95, 90, 45, 80, 88, 70, 35, 50, 85, 65, 30, 15, 5, 0],
    isSelected: true,
    rating: 5,
    notes: 'Loved the subtle brass ring resonance at the tail!'
  },
  {
    id: 'aud_04',
    projectId: 'proj_aura_01',
    shotId: 'shot_04',
    characterName: 'Aria',
    voiceActor: 'Elena Rostova',
    lineText: 'Easy, Cog. Angle the focal ring fifteen degrees west.',
    takeNumber: 1,
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73516.mp3',
    durationSec: 3.2,
    waveformData: [15, 35, 75, 82, 60, 45, 30, 55, 70, 85, 45, 20, 8, 0],
    isSelected: true,
    rating: 4,
    notes: 'Very natural tone.'
  }
];

export const INITIAL_RENDERS: RenderFile[] = [
  {
    id: 'rend_01',
    projectId: 'proj_aura_01',
    shotId: 'shot_01',
    shotCode: 'SC01_SH01',
    version: 'v03_final',
    fileName: 'AURA_SC01_SH01_v03_4K_ACEScg.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
    status: 'Approved',
    renderEngine: 'Blender 4.2 Cycles (OptiX)',
    durationSec: 4.0,
    resolution: '4096x1716 (DCI 4K)',
    fps: 24,
    fileSizeMb: 148.6,
    createdAt: 'Today, 14:20',
    feedback: [
      {
        id: 'fb_01',
        authorId: 'user_sarah',
        timecodeSec: 1.5,
        comment: 'The morning mist density here is breathtaking. Approved for master reel.',
        isResolved: true,
        createdAt: 'Today, 14:45'
      }
    ]
  },
  {
    id: 'rend_02',
    projectId: 'proj_aura_01',
    shotId: 'shot_02',
    shotCode: 'SC01_SH02',
    version: 'v02',
    fileName: 'AURA_SC01_SH02_v02_Composited.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
    status: 'In Review',
    renderEngine: 'Nuke Studio + Unreal Engine 5.4 Pass',
    durationSec: 3.0,
    resolution: '4096x1716 (DCI 4K)',
    fps: 24,
    fileSizeMb: 112.4,
    createdAt: 'Today, 16:10',
    feedback: [
      {
        id: 'fb_02',
        authorId: 'user_sarah',
        timecodeSec: 1.8,
        comment: 'Lens flare on the brass shutter needs 15% less chromatic aberration.',
        isResolved: false,
        createdAt: '1 hour ago'
      },
      {
        id: 'fb_03',
        authorId: 'user_maya',
        timecodeSec: 2.2,
        comment: 'Syncing sound fx bang right when shutter latch catches.',
        isResolved: true,
        createdAt: '45 mins ago'
      }
    ]
  },
  {
    id: 'rend_03',
    projectId: 'proj_aura_01',
    shotId: 'shot_04',
    shotCode: 'SC02_SH01',
    version: 'v01_playblast',
    fileName: 'AURA_SC02_SH01_v01_Playblast.mp4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&auto=format&fit=crop&q=80',
    status: 'In Review',
    renderEngine: 'Maya Viewport 2.0 Playblast',
    durationSec: 4.6,
    resolution: '1920x804 (HD Anamorphic)',
    fps: 24,
    fileSizeMb: 42.1,
    createdAt: 'Yesterday, 18:30',
    feedback: [
      {
        id: 'fb_04',
        authorId: 'user_kenji',
        timecodeSec: 3.2,
        comment: 'Still tweaking Cog\'s hind-leg anticipation weight.',
        isResolved: false,
        createdAt: 'Yesterday, 19:15'
      }
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    projectId: 'proj_aura_01',
    authorId: 'user_sarah',
    message: 'Good morning studio team! Scene 01 lighting look is locked. Alex, that morning mist pass in SH01 is cinema-grade gold ✨',
    createdAt: '09:15 AM'
  },
  {
    id: 'msg_02',
    projectId: 'proj_aura_01',
    authorId: 'user_alex',
    message: 'Thanks Sarah! The volumetric sunbeams calibrated nicely with the DCI 4K anamorphic crop.',
    createdAt: '09:22 AM'
  },
  {
    id: 'msg_03',
    projectId: 'proj_aura_01',
    authorId: 'user_kenji',
    message: 'Pushing v02 keyframes for Cog\'s walking cycle on the catwalk (SC02_SH01). Check the anticipation timing when you get a minute.',
    shotRefId: 'shot_04',
    createdAt: '10:04 AM'
  },
  {
    id: 'msg_04',
    projectId: 'proj_aura_01',
    authorId: 'user_maya',
    message: 'Just uploaded 3 voice takes for Aria\'s monologue and the new clockwork chime motifs. Elena\'s Take 03 is spot on.',
    createdAt: '11:40 AM'
  },
  {
    id: 'msg_05',
    projectId: 'proj_aura_01',
    authorId: 'user_leo',
    message: 'Working on thumbnails for Scene 03 gear tower jam. Adding high-tension vertigo angles looking down into the planetary gear train.',
    createdAt: '12:15 PM'
  }
];
