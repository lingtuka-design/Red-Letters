// Cloudflare Pages Function: /api/upload (Cloudflare R2 Bucket Upload)
export interface Env {
  STORAGE: any; // R2Bucket
}

export async function onRequestPost(context: { env: Env; request: Request }) {
  try {
    const { env, request } = context;

    if (!env?.STORAGE) {
      // In local development or if R2 not bound, return mock CDN URL
      return new Response(JSON.stringify({
        success: true,
        mock: true,
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        message: "R2 binding not configured yet, using local media reference."
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") || "storyboards";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filename = `${category}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const arrayBuffer = await file.arrayBuffer();

    await env.STORAGE.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "application/octet-stream",
      },
    });

    const publicUrl = `/assets/${filename}`;

    return new Response(JSON.stringify({
      success: true,
      filename,
      url: publicUrl,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
