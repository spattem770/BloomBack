import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// CORS middleware
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Initialize Supabase
const getSupabase = () => {
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  return createClient(url, key);
};

const getSupabaseAdmin = () => {
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  return createClient(url, key);
};

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Create bloom
app.post("/create-bloom", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const bloomData = await c.req.json();
    const { recipientName, senderName, message, photoUrl, senderEmail } = bloomData;

    if (!recipientName || !senderName || !message) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const bloom = {
      id: crypto.randomUUID(),
      userId: user.id,
      recipientName,
      senderName,
      senderEmail,
      message,
      photoUrl: photoUrl || "https://images.unsplash.com/photo-1759888107119-aa9accda6085",
      treeSeed: Math.random(),
      createdAt: new Date().toISOString(),
      treeGrowthStage: 0
    };

    const admin = getSupabaseAdmin();
    await admin.from("kv_store_9b13e4e4").upsert({
      key: `bloom:${user.id}:${bloom.id}`,
      value: bloom
    });

    return c.json({ message: 'Bloom created successfully', bloom });

  } catch (error) {
    return c.json({ error: 'Failed to create bloom' }, 500);
  }
});

// Get user's blooms
app.get("/my-blooms", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'No authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const supabase = getSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("kv_store_9b13e4e4")
      .select("value")
      .like("key", `bloom:${user.id}:%`);

    if (error) {
      return c.json({ error: 'Database error' }, 500);
    }

    const blooms = data?.map(d => d.value) || [];
    return c.json({ blooms });

  } catch (error) {
    return c.json({ error: 'Failed to retrieve blooms' }, 500);
  }
});

// Get specific bloom
app.get("/bloom/:userId/:bloomId", async (c) => {
  try {
    const { userId, bloomId } = c.req.param();
    
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("kv_store_9b13e4e4")
      .select("value")
      .eq("key", `bloom:${userId}:${bloomId}`)
      .single();

    if (error || !data) {
      return c.json({ error: 'Bloom not found' }, 404);
    }

    return c.json({ bloom: data.value });

  } catch (error) {
    return c.json({ error: 'Failed to retrieve bloom' }, 500);
  }
});

Deno.serve(app.fetch);