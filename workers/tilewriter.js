/*
 * Tile writer worker - handles canvas tile updates
 */

const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const TILE_SIZE = 256;
const TILE_FOLDER = workerData?.tileFolder || './tiles';

// Ensure tile folder exists
if (!fs.existsSync(TILE_FOLDER)) {
  fs.mkdirSync(TILE_FOLDER, { recursive: true });
}

// Message handler
parentPort.on('message', async (msg) => {
  try {
    switch (msg.type) {
      case 'init':
        console.log('Tile writer worker initialized');
        parentPort.postMessage({ type: 'ready' });
        break;

      case 'save':
        await saveTile(msg.canvasId, msg.x, msg.y, msg.data);
        parentPort.postMessage({
          type: 'saved',
          canvasId: msg.canvasId,
          x: msg.x,
          y: msg.y
        });
        break;

      case 'load':
        const data = await loadTile(msg.canvasId, msg.x, msg.y);
        parentPort.postMessage({
          type: 'loaded',
          canvasId: msg.canvasId,
          x: msg.x,
          y: msg.y,
          data
        });
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    console.error('Tile writer error:', error);
    parentPort.postMessage({
      type: 'error',
      error: error.message
    });
  }
});

async function saveTile(canvasId, x, y, data) {
  const canvasFolder = path.join(TILE_FOLDER, canvasId.toString());
  if (!fs.existsSync(canvasFolder)) {
    fs.mkdirSync(canvasFolder, { recursive: true });
  }

  const tilePath = path.join(canvasFolder, `${x}_${y}.png`);
  
  // Convert data to PNG using sharp
  if (Buffer.isBuffer(data)) {
    await sharp(data, {
      raw: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        channels: 4
      }
    })
    .png()
    .toFile(tilePath);
  } else {
    // If data is already a file path or other format
    fs.writeFileSync(tilePath, data);
  }
}

async function loadTile(canvasId, x, y) {
  const tilePath = path.join(TILE_FOLDER, canvasId.toString(), `${x}_${y}.png`);
  
  if (!fs.existsSync(tilePath)) {
    // Return empty tile if not found
    return Buffer.alloc(TILE_SIZE * TILE_SIZE * 4);
  }

  return fs.readFileSync(tilePath);
}

// Keep worker alive
setInterval(() => {}, 1000 * 60 * 60);