// api/receiveVideo/route.js (Serverless function on Vercel)

let videoUrl = null;

// Define allowed origins
const allowedOrigins = [
  'https://stream1tablet.vercel.app/', // Local development for project one
];

export async function OPTIONS(req) {
  const origin = req.headers.get('origin');

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return new Response(null, {
    status: 204,
    headers,
  });
}

export async function POST(req) {
  const origin = req.headers.get('origin');

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  try {
    const { videoSrc } = await req.json();

    if (!videoSrc) {
      return new Response(
        JSON.stringify({ error: 'Video URL is required' }),
        { status: 400, headers }
      );
    }

    const vimeoRegex = /https:\/\/vimeo\.com\/(\d+)/;
    const match = videoSrc.match(vimeoRegex);

    if (match) {
      const videoId = match[1];
      videoUrl = videoId;
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid Vimeo URL' }),
        { status: 400, headers }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Video URL received', videoSrc }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers }
    );
  }
}

export async function GET(req) {
  const origin = req.headers.get('origin');

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  try {
    if (!videoUrl) {
      return new Response(
        JSON.stringify({ error: 'No video URL stored' }),
        { status: 404, headers }
      );
    }

    return new Response(
      JSON.stringify({ videoSrc: videoUrl }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers }
    );
  }
}
