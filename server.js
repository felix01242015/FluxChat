const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (username) => {
      socket.data.username = username;
      socket.broadcast.emit('userJoined', {
        username,
        id: socket.id,
        timestamp: new Date().toISOString(),
      });
      io.emit('userList', getConnectedUsers(io));
    });

    socket.on('message', (data) => {
      io.emit('message', {
        ...data,
        id: socket.id,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
      const username = socket.data.username;
      if (username) {
        socket.broadcast.emit('userLeft', {
          username,
          id: socket.id,
          timestamp: new Date().toISOString(),
        });
        io.emit('userList', getConnectedUsers(io));
      }
      console.log('Client disconnected:', socket.id);
    });
  });

  function getConnectedUsers(io) {
    const users = [];
    io.sockets.sockets.forEach((socket) => {
      if (socket.data.username) {
        users.push({
          id: socket.id,
          username: socket.data.username,
        });
      }
    });
    return users;
  }

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

