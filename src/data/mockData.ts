import type { 
  Project, 
  TeamMember, 
  UserAccount,
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
    targetDurationSec: 300,
    targetDurationMin: 5,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    accentColor: '#d97706',
    createdBy: 'maltea',
    createdByName: 'Maltea',
    approvals: {
      maltea: true,
      valtea: false,
      biaktea: false
    },
    storyboardContentHtml: `<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; color: #1c1917;">STORYBOARD VISUAL FOLIO &amp; SHOT PACING</h2><p style="font-style: italic; color: #78716c; margin-bottom: 1.5rem;">The Clockwork Garden • 24fps Continuous Animatic &amp; Visual Notes</p><h3 style="font-size: 1.1rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #b45309;">[SEQUENCE 01: HIGHLAND OBSERVATORY DAWN]</h3><p><strong>SHOT 01A — Extreme Wide (Static Establishing Shot)</strong></p><p>Opening crane shot of the solitary bronze observatory perched high atop the jagged cliff face. Wind howls through brass weather vanes. Thick purple-gray mist rolls across the pine valleys below.</p><p><em>Camera:</em> Static 50mm Anamorphic cine lens, slow fog drift.</p><p><em>Audio Cue:</em> Cold mountain wind, distant creak of massive clockwork counterweights.</p><p><strong>SHOT 01B — Wide Shot (Slow Dolly In)</strong></p><p>Interior of the observatory dome. Kaelia brushes frost off the antique brass telescope lens. Gearson the automaton stokes the miniature steam furnace in the background.</p><p><em>Camera:</em> Slow smooth tracking dolly forward through hanging botanical jars.</p><p><em>Dialogue:</em> KAELIA: &quot;Gearson, the glass is frosting over. The eclipse is moving faster than the charts predicted.&quot;</p><p><strong>SHOT 01C — Close Up (Pan Right)</strong></p><p>Focus on Gearson's optical ocular assembly. Inner gears click and whir as his glowing amber lens contracts.</p><p><em>Action:</em> Gearson reaches forward with his insulated leather glove and adjusts the steam valve.</p><h3 style="font-size: 1.1rem; font-weight: bold; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #b45309;">[SEQUENCE 02: THE AWAKENING SEED]</h3><p><strong>SHOT 02A — Medium Shot (Low Angle Dutch Tilt)</strong></p><p>Kaelia uncaps the copper nutrient vial and drips radiant amber nectar into the central glass terrarium bell.</p><p><em>Lighting &amp; FX:</em> Faint turquoise bioluminescence pulses from the dormant root core, casting shifting patterns across the observatory ceiling.</p><p><strong>SHOT 02B — Macro Close-Up (Rack Focus)</strong></p><p>The dark husk of the seed splits with a crystalline snap. Delicate glowing tendrils unfurl in slow motion.</p><p><em>Audio Cue:</em> Soft glass chime harmonic resonance, pneumatic intake hiss.</p>`
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
    targetDurationMin: 7,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    accentColor: '#0284c7',
    createdBy: 'valtea',
    createdByName: 'Valtea',
    approvals: {
      maltea: true,
      valtea: true,
      biaktea: false
    },
    storyboardContentHtml: `<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; color: #1c1917;">STORYBOARD VISUAL FOLIO &amp; PACING</h2><p style="font-style: italic; color: #78716c; margin-bottom: 1.5rem;">Neon Ronin: Zero • Cyberpunk Kyoto Sequence Breakdown</p><h3 style="font-size: 1.1rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #0284c7;">[SEQUENCE 01: RAIN IN THE NEON DISTRICT]</h3><p><strong>SHOT 01A — High Angle Wide (Tracking Crane)</strong></p><p>Heavy neon rainfall pouring over holographic billboard reflections in flooded alleyways. Steam venting from cybernetic noodle stalls.</p><p><em>Camera:</em> High angled crane descending into narrow alley corridor.</p><p><strong>SHOT 01B — Close Up (Low Angle)</strong></p><p>Ren steps out from underneath dripping eaves. The crimson optic strip on his visor flickers to life.</p>`
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
    targetDurationMin: 4,
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    accentColor: '#7c3aed',
    createdBy: 'biaktea',
    createdByName: 'Biaktea',
    approvals: {
      maltea: false,
      valtea: false,
      biaktea: true
    },
    storyboardContentHtml: `<h2 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem; color: #1c1917;">STORYBOARD VISUAL FOLIO &amp; PACING</h2><p style="font-style: italic; color: #78716c; margin-bottom: 1.5rem;">The Lost Constellation • Lyrical Celestial Breakdown</p><h3 style="font-size: 1.1rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #7c3aed;">[SEQUENCE 01: THE FROZEN CELESTIAL SEA]</h3><p><strong>SHOT 01A — Extreme Wide (Panoramic Pan)</strong></p><p>A mirror-smooth sea of solid blue-black ice under a sky ablaze with ancient shimmering aurora borealis.</p><p><em>Camera:</em> Slow sweeping 35mm panoramic pan across the horizon.</p>`
  }
];

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'maltea',
    username: 'maltea',
    password: '12345',
    name: 'Maltea',
    role: 'Director & Showrunner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'maltea@aurastudios.com',
    status: 'online',
    currentTask: 'Screenplay Directing & Final Cut Approval'
  },
  {
    id: 'valtea',
    username: 'valtea',
    password: '12345',
    name: 'Valtea',
    role: 'Lead Animator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'valtea@aurastudios.com',
    status: 'online',
    currentTask: 'Keyframing & Motion Review'
  },
  {
    id: 'biaktea',
    username: 'biaktea',
    password: '12345',
    name: 'Biaktea',
    role: 'Storyboard & Art Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'biaktea@aurastudios.com',
    status: 'online',
    currentTask: 'Script Breakdown & Storyboard Framing'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'maltea',
    username: 'maltea',
    name: 'Maltea',
    role: 'Director & Showrunner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'maltea@aurastudios.com',
    status: 'online',
    currentTask: 'Screenplay Directing & Final Cut Approval'
  },
  {
    id: 'valtea',
    username: 'valtea',
    name: 'Valtea',
    role: 'Lead Animator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'valtea@aurastudios.com',
    status: 'online',
    currentTask: 'Keyframing & Motion Review'
  },
  {
    id: 'biaktea',
    username: 'biaktea',
    name: 'Biaktea',
    role: 'Storyboard & Art Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'biaktea@aurastudios.com',
    status: 'online',
    currentTask: 'Script Breakdown & Storyboard Framing'
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
    ],
    comments: [
      {
        id: 'cm_01',
        sceneId: 'sc_01',
        authorId: 'maltea',
        authorName: 'Maltea',
        authorRole: 'Director & Showrunner',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        comment: 'He scene-ah hian dawn light a lo chhuah dawn vangin amber colour hi a langsar tawk tur a ni.',
        createdAt: 'Today, 10:30 AM'
      },
      {
        id: 'cm_02',
        sceneId: 'sc_01',
        authorId: 'biaktea',
        authorName: 'Biaktea',
        authorRole: 'Storyboard & Art Lead',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        comment: 'Observatory dome inhawng lai framing hi extreme wide-in ka lo draw tawh e, shot 01A nen a inmil thlap.',
        createdAt: 'Today, 11:15 AM'
      },
      {
        id: 'cm_03',
        sceneId: 'sc_01',
        authorId: 'valtea',
        authorName: 'Valtea',
        authorRole: 'Lead Animator',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        comment: 'Gear inher animation timing hi 42 seconds chhung atan a tawk viau, keyframe block ka lo siam dawn nia.',
        createdAt: 'Today, 11:45 AM'
      }
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
    ],
    comments: [
      {
        id: 'cm_04',
        sceneId: 'sc_02',
        authorId: 'maltea',
        authorName: 'Maltea',
        authorRole: 'Director & Showrunner',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        comment: 'Cog automaton chet vel dan hi cute deuh si, mechanical precision nei bawk se ka duh.',
        createdAt: 'Today, 12:00 PM'
      },
      {
        id: 'cm_05',
        sceneId: 'sc_02',
        authorId: 'valtea',
        authorName: 'Valtea',
        authorRole: 'Lead Animator',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        comment: 'A ke 4 kal dan (quadruped walk cycle) hi secondary motion nen ka lo animate ang e.',
        createdAt: 'Today, 12:20 PM'
      }
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
    ],
    comments: [
      {
        id: 'cm_06',
        sceneId: 'sc_03',
        authorId: 'biaktea',
        authorName: 'Biaktea',
        authorRole: 'Storyboard & Art Lead',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        comment: 'Gear jam lai hi high-tension vertigo angle in ka lo draw e.',
        createdAt: 'Today, 01:10 PM'
      }
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
    assignedTo: 'valtea',
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
    assignedTo: 'valtea',
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
    assignedTo: 'maltea',
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
    assignedTo: 'valtea',
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
    assignedTo: 'valtea',
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
    assignedTo: 'biaktea',
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
    assignedTo: 'maltea',
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
        authorId: 'maltea',
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
        authorId: 'maltea',
        timecodeSec: 1.8,
        comment: 'Lens flare on the brass shutter needs 15% less chromatic aberration.',
        isResolved: false,
        createdAt: '1 hour ago'
      },
      {
        id: 'fb_03',
        authorId: 'biaktea',
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
        authorId: 'valtea',
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
    authorId: 'maltea',
    message: 'Chibai le team! Scene 01 lighting look hi a locked tawh e. Valtea, shot 01A mist pass kha a mawi hle mai ✨',
    createdAt: '09:15 AM'
  },
  {
    id: 'msg_02',
    projectId: 'proj_aura_01',
    authorId: 'valtea',
    message: 'Ka lawm e Maltea! DCI 4K anamorphic crop nen a inmil thlap e.',
    createdAt: '09:22 AM'
  },
  {
    id: 'msg_03',
    projectId: 'proj_aura_01',
    authorId: 'valtea',
    message: 'Cog kal lai (SC02_SH01) keyframes v02 ka rawn push e. Anticipation timing kha lo en chhin teh u.',
    shotRefId: 'shot_04',
    createdAt: '10:04 AM'
  },
  {
    id: 'msg_04',
    projectId: 'proj_aura_01',
    authorId: 'biaktea',
    message: 'Scene 02 & 03 storyboard framing ka update zo chiah e, audio track nen pawh a inrem thlap ang.',
    createdAt: '11:40 AM'
  },
  {
    id: 'msg_05',
    projectId: 'proj_aura_01',
    authorId: 'maltea',
    message: 'Screenplay Scene 01 ka lo approve tawh a, Valtea leh Biaktea khan lo approve ve ula project hi approve tlan ang aw.',
    createdAt: '12:15 PM'
  }
];
