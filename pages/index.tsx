import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Head from 'next/head';

interface Message {
  id: string;
  message: string;
  username: string;
  timestamp: string;
}

interface User {
  id: string;
  username: string;
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const newSocket = io({
      path: '/api/socket',
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('message', (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on('userJoined', (data: { username: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'system',
          message: `${data.username} joined the chat`,
          username: 'System',
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    newSocket.on('userLeft', (data: { username: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'system',
          message: `${data.username} left the chat`,
          username: 'System',
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    newSocket.on('userList', (userList: User[]) => {
      setUsers(userList);
    });

    newSocket.on('typing', (data: { username: string; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.username);
        } else {
          newSet.delete(data.username);
        }
        return newSet;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() && socket) {
      setUsername(usernameInput.trim());
      socket.emit('join', usernameInput.trim());
      setUsernameInput('');
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && socket && username) {
      socket.emit('message', {
        message: messageInput.trim(),
        username,
      });
      setMessageInput('');
      handleStopTyping();
    }
  };

  const handleTyping = () => {
    if (socket && username && !isTyping) {
      setIsTyping(true);
      socket.emit('typing', { username, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (socket && username && isTyping) {
      setIsTyping(false);
      socket.emit('typing', { username, isTyping: false });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!username) {
    return (
      <>
        <Head>
          <title>FluxChat - Join Chat</title>
          <meta name="description" content="Free online chat application" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FluxChat
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Join the conversation!
            </p>
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                maxLength={20}
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Join Chat
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>FluxChat - Chat Room</title>
        <meta name="description" content="Free online chat application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-md p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FluxChat
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{username}</span>
                <span className="ml-2 text-green-500">●</span>
              </div>
              <div className="text-sm text-gray-600">
                {users.length} {users.length === 1 ? 'user' : 'users'} online
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 gap-4">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.id}-${idx}`}
                  className={`flex ${
                    msg.username === username ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.username === username
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : msg.username === 'System'
                        ? 'bg-gray-200 text-gray-600 text-center'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.username !== 'System' && msg.username !== username && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {msg.username}
                      </div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.username === username
                          ? 'text-white/70'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {typingUsers.size > 0 && (
                <div className="text-sm text-gray-500 italic">
                  {Array.from(typingUsers).join(', ')}
                  {typingUsers.size === 1 ? ' is' : ' are'} typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Users Sidebar */}
          <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 hidden md:block">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Online Users</h2>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    user.username === username
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span
                    className={`text-sm ${
                      user.username === username ? 'font-semibold' : ''
                    }`}
                  >
                    {user.username}
                    {user.username === username && ' (You)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

