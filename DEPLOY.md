# Deploy to Fly.io (Permanent Free!)

Fly.io offers a **truly permanent free tier** perfect for Socket.io apps with persistent connections.

## Quick Deploy Steps

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
   Or on macOS:
   ```bash
   brew install flyctl
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```
   (Opens browser to sign up/login - completely free, no credit card!)

3. **Deploy Your App**
   ```bash
   fly launch
   ```
   - When prompted, choose a unique app name (or press Enter for auto-generated)
   - Choose a region close to you (e.g., `iad` for US East)
   - Say "no" to PostgreSQL (we don't need it)
   - Say "no" to Redis (we don't need it)

4. **That's it!**
   - Fly.io will build and deploy automatically
   - You'll get a free `.fly.dev` URL
   - Your chat app will be live permanently!

## Free Tier (Permanent!)

- **3 shared-cpu-1x VMs** (256MB RAM each) - Perfect for a chat app!
- **3GB persistent volumes**
- **160GB outbound data transfer per month**
- **Automatic HTTPS**
- **Custom domains supported**
- **No credit card required**
- **Never expires** - truly permanent free tier!

## After Deployment

Your app will be live at: `https://your-app-name.fly.dev`

Share the URL with friends and start chatting! 🎉

## Updating Your App

After making changes:
```bash
git add .
git commit -m "Your changes"
git push
fly deploy
```

## Troubleshooting

If you run into issues:
- Check logs: `fly logs`
- SSH into your app: `fly ssh console`
- View app status: `fly status`
- Scale if needed: `fly scale count 1` (free tier allows 1 machine)

