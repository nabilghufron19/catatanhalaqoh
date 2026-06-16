export async function onRequest(context) {
  const { request, env } = context;
  const apiKey = env.MISTRAL_API_KEY;

  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      status: apiKey ? 'ok' : 'error',
      mistralKeyConfigured: Boolean(apiKey),
      message: apiKey ? 'MISTRAL_API_KEY sudah terpasang.' : 'Setel MISTRAL_API_KEY di Cloudflare Pages environment variables.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'MISTRAL_API_KEY tidak dikonfigurasi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Permintaan tidak valid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { prompt, history = [], model = 'mistral-small-latest' } = body;
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt diperlukan' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload = {
    model,
    messages: [
      { role: 'system', content: prompt },
      ...history.map(item => ({ role: item.role, content: item.content }))
    ],
    max_tokens: 600,
    temperature: 0.4
  };

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
