import express from 'express';

const router = express.Router();

// get /api/health
router.get('/', (req, res) => {
  const uptimeInSeconds = process.uptime();
  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24)); // days
    const h = Math.floor(seconds % (3600 * 24) / 3600); // hours
    const m = Math.floor(seconds % 3600 / 60); // minutes
    const s = Math.floor(seconds % 60); // seconds
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  res.status(200).json({
    status: 'ok',
    uptime: formatUptime(uptimeInSeconds),
    timestamp: new Date().toISOString(),
  });
});


export default router;
