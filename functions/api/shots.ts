// Cloudflare Pages Function: /api/shots
export interface Env {
  DB: any;
}

export async function onRequestGet(context: { env: Env; request: Request }) {
  try {
    const { env } = context;
    if (!env?.DB) {
      return new Response(JSON.stringify({ error: "D1 Database binding not found", data: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

    const { results } = await env.DB.prepare(
      `SELECT s.*, tm.name as assignee_name, tm.role as assignee_role, tm.avatar as assignee_avatar 
       FROM shots s 
       LEFT JOIN team_members tm ON s.assigned_to = tm.id 
       ORDER BY s.code ASC`
    ).all();

    return new Response(JSON.stringify({ data: results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  try {
    const { env, request } = context;
    const body = await request.json() as any;

    if (!env?.DB) {
      return new Response(JSON.stringify({ success: true, message: "Mock saved", shot: body }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = body.id || `shot_${Date.now()}`;
    await env.DB.prepare(
      `INSERT INTO shots (id, project_id, scene_id, code, title, stage, priority, assigned_to, start_frame, end_frame, duration_sec, thumbnail_url, notes, complexity) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      body.project_id || 'proj_1',
      body.scene_id || 'sc_1',
      body.code,
      body.title,
      body.stage || 'Layout',
      body.priority || 'Medium',
      body.assigned_to || null,
      body.start_frame || 1,
      body.end_frame || 120,
      body.duration_sec || 5.0,
      body.thumbnail_url || '',
      body.notes || '',
      body.complexity || 'Normal'
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPatch(context: { env: Env; request: Request }) {
  try {
    const { env, request } = context;
    const body = await request.json() as any;

    if (!env?.DB) {
      return new Response(JSON.stringify({ success: true, updated: body }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (body.stage) {
      await env.DB.prepare(`UPDATE shots SET stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
        .bind(body.stage, body.id)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
