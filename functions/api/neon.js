export async function onRequest(context) {
  const { env } = context;
  const hasNeon = Boolean(env.NEON_DATABASE_URL);

  return new Response(JSON.stringify({
    status: 'ready',
    neonDatabaseUrlConfigured: hasNeon,
    message: hasNeon
      ? 'NEON_DATABASE_URL telah disiapkan. Gunakan env ini untuk koneksi Neon di worker.'
      : 'Setel NEON_DATABASE_URL di Cloudflare Pages environment variables.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
