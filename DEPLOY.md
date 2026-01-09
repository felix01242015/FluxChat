# Deploy to Railway (Free!)

Railway is perfect for Socket.io apps because it supports persistent connections. Here's how to deploy:

## Quick Deploy Steps

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (free)

2. **Deploy Your App**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your FluxChat repository
   - Railway will automatically detect it's a Node.js app

3. **That's it!**
   - Railway will build and deploy automatically
   - You'll get a free `.railway.app` URL
   - Your chat app will be live!

## Environment Variables

No environment variables needed! The app works out of the box.

## Free Tier Limits

- **$5 free credit per month** (plenty for a chat app!)
- Automatic HTTPS
- Custom domains supported
- No credit card required

## After Deployment

Your app will be live at: `https://your-app-name.railway.app`

Share the URL with friends and start chatting! 🎉

## Troubleshooting

If you run into issues:
- Make sure `package.json` has the correct start script
- Check Railway logs in the dashboard
- Ensure PORT environment variable is set (Railway does this automatically)

