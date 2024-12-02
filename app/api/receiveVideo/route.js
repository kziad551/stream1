// api/receiveVideo.js (Serverless function on Vercel)

let videoUrl = null;

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',          // Local development
  'https://stream1tablet.vercel.app' // Vercel production
];

export async function OPTIONS(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to specific origins
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
}

export async function POST(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to specific origins
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { videoSrc } = await req.json();

    if (!videoSrc) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    const vimeoRegex = /https:\/\/vimeo\.com\/(\d+)/;
    const match = videoSrc.match(vimeoRegex);

    if (match) {
      const videoId = match[1];
      videoUrl = videoId;
    } else {
      return res.status(400).json({ error: 'Invalid Vimeo URL' });
    }

    return res.status(200).json({ message: 'Video URL received', videoSrc });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function GET(req, res) {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Or restrict to specific origins
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    if (!videoUrl) {
      return res.status(404).json({ error: 'No video URL stored' });
    }

    return res.status(200).json({ videoSrc: videoUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
