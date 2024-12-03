const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for API routes
const allowedOrigin = process.env.NODE_ENV === 'production'
  ? 'https://stream1tablet.vercel.app'  // Production URL
  : 'http://localhost:3000';  // Local development URL

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json()); // Middleware to parse JSON bodies

let videoUrl = null;

// API to receive video URL
app.post('/api/receiveVideo', (req, res) => {
  const { videoSrc } = req.body;

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

  res.status(200).json({ message: 'Video URL received', videoSrc });
});

// API to provide the current video URL
app.get('/api/receiveVideo', (req, res) => {
  if (!videoUrl) {
    return res.status(404).json({ error: 'No video URL stored' });
  }

  res.status(200).json({ videoSrc: videoUrl });
});

// Serve a dynamic HTML page for video viewing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dynamic Video</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <iframe id="videoFrame" allow="autoplay; fullscreen" allowfullscreen></iframe>
      <script>
        async function fetchVideo() {
          try {
            const response = await fetch('/api/receiveVideo');
            if (response.ok) {
              const data = await response.json();
              const iframe = document.getElementById('videoFrame');
              const newSrc = \`https://player.vimeo.com/video/\${data.videoSrc}?autoplay=1\`; // Added autoplay=1
              if (iframe.src !== newSrc) {
                iframe.src = newSrc;
              }
            }
          } catch (error) {
            console.error('Error fetching video:', error);
          }
        }

        // Poll the server every 3 seconds for updates
        setInterval(fetchVideo, 3000);

        // Fetch the video on initial load
        fetchVideo();
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
