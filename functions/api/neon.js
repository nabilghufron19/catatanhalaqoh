import { Client } from '@neondatabase/serverless';

function createClient(env) {
  if (!env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL tidak dikonfigurasi');
  }
  return new Client({ connectionString: env.NEON_DATABASE_URL });
}

export async function onRequest(context) {
  const { env } = context;
  if (!env.NEON_DATABASE_URL) {
    return new Response(JSON.stringify({
      status: 'error',
      neonDatabaseUrlConfigured: false,
      message: 'Setel NEON_DATABASE_URL di Cloudflare Pages environment variables.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const client = createClient(env);
  await client.connect();

  try {
    await client.query('SELECT 1');
    return new Response(JSON.stringify({
      status: 'ok',
      neonDatabaseUrlConfigured: true,
      message: 'Koneksi Neon berhasil.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      status: 'error',
      neonDatabaseUrlConfigured: true,
      message: `Koneksi Neon gagal: ${err.message}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await client.end();
  }
}
