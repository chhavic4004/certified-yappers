# FlavorAI Backend API

Backend API for FlavorAI - Recipe discovery and meal planning platform.

## Deployment to Vercel

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`

### Deploy Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - Project name: `flavourai-backend` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? **N**

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Environment Variables (Optional)

If you need to set custom environment variables:

```bash
vercel env add RECIPE_API_BASE_URL
vercel env add RECIPE_API_KEY
vercel env add FLAVOR_API_BASE_URL
vercel env add FLAVOR_API_KEY
```

Or set them in Vercel dashboard under Project Settings → Environment Variables.

### API Endpoints

Once deployed, your API will be available at: `https://your-project.vercel.app`

**Available routes:**
- `GET /` - Health check
- `POST /api/meals` - Get meal suggestions
- `POST /api/meals/diet` - Get diet-specific meals
- `POST /api/flavor/pairing` - Get flavor pairings
- And more...

### Local Development

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:5051`

### Testing the Deployed API

```bash
curl https://your-project.vercel.app/
```

```bash
curl -X POST https://your-project.vercel.app/api/meals \
  -H "Content-Type: application/json" \
  -d '{"cuisine": "Indian", "diet": "Vegan"}'
```
