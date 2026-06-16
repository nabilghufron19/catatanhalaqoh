import { Client } from '@neondatabase/serverless';

function createClient(env) {
  if (!env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL tidak dikonfigurasi');
  }
  return new Client({ connectionString: env.NEON_DATABASE_URL });
}

function mapRow(row) {
  return {
    id: row.id,
    notebook: row.notebook,
    title: row.title,
    body: row.body,
    dateFull: row.date_full,
    dateShort: row.date_short,
    monthGroup: row.month_group,
    tags: row.tags || [],
    savedAt: row.saved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.NEON_DATABASE_URL) {
    return new Response(JSON.stringify({ error: 'NEON_DATABASE_URL tidak dikonfigurasi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const client = createClient(env);
  await client.connect();

  try {
    if (request.method === 'GET') {
      const result = await client.query('SELECT * FROM notes ORDER BY created_at DESC');
      return new Response(JSON.stringify(result.rows.map(mapRow)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (request.method === 'POST') {
      const payload = await request.json();
      const { id, notebook, title, body, dateFull, dateShort, monthGroup, tags, savedAt } = payload;
      if (!id || !notebook) {
        return new Response(JSON.stringify({ error: 'id dan notebook diperlukan' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      await client.query(
        `INSERT INTO notes (id, notebook, title, body, date_full, date_short, month_group, tags, saved_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           notebook = EXCLUDED.notebook,
           title = EXCLUDED.title,
           body = EXCLUDED.body,
           date_full = EXCLUDED.date_full,
           date_short = EXCLUDED.date_short,
           month_group = EXCLUDED.month_group,
           tags = EXCLUDED.tags,
           saved_at = EXCLUDED.saved_at,
           updated_at = NOW()`,
        [id, notebook, title || '', body || '', dateFull || '', dateShort || '', monthGroup || '', tags || [], savedAt || '']
      );

      return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Method Not Allowed', { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await client.end();
  }
}
