# Deploying the FlavourAI API

This guide walks you through deploying the backend API so your website runs smoothly in production. The **single backend** powers both **Recipe DB** and **Flavor DB** APIs.

## Quick overview

- **Backend** (Express API in `backend/`) → deploy to **Render**
  - **Recipe DB** — meal search by cuisine, diet, calories, protein (`/api/meals`, `/api/recipe/*`)
  - **Flavor DB** — food pairings & flavor profiles (`/api/flavor/*`)
- **Frontend** (Vite + React) → needs `VITE_BACKEND_URL` pointing to your deployed backend

---

## Step 1: Deploy the API to Render

1. **Push your project to GitHub** (if you haven’t already).

2. **Go to [Render](https://render.com)** and sign in.

3. **New → Blueprint** (or “New +” → “Blueprint”).

4. **Connect your GitHub repo** and choose the `certified-yappers` project.

5. Render will detect `render.yaml`. Confirm the service settings:
   - **Name:** flavourai-api
   - **Root directory:** `backend`
   - **Build:** `npm install`
   - **Start:** `npm start`

6. **(Optional)** In the service → **Environment**, add:
   - `GROQ_API_KEY` — from [console.groq.com/keys](https://console.groq.com/keys) (free) — for AI meal fallback
   - or `OPENAI_API_KEY` — from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - `RECIPE_DB_BASE_URL` — override Recipe DB URL (default: cosylab.iiitd.edu.in:6969)
   - `FLAVOR_DB_BASE_URL` — override FlavorDB URL (default: same as Recipe DB + `/flavordb`)

7. Click **Deploy**. After a few minutes, you’ll get a URL like:
   ```
   https://flavourai-api.onrender.com
   ```

---

## Step 2: Point the frontend to the API

### Local development

- The frontend uses `http://localhost:5051` by default.
- Start the backend: `cd backend && npm start`

### Production / deployed frontend

Add the deployed API URL to your environment:

1. In your project root, create or edit `.env`:
   ```env
   VITE_BACKEND_URL=https://flavourai-api.onrender.com
   ```
   Replace with your actual Render URL.

2. Rebuild the frontend:
   ```bash
   npm run build
   ```
   Deploy the `dist/` folder (Vercel, Netlify, etc.) as usual.

---

## Render notes

- **Free tier:** Services can spin down after inactivity; the first request may take 30–60 seconds.
- **Paid plans:** Keep the service always-on for faster responses.
- **Port:** Render sets `PORT` automatically; the backend already uses `process.env.PORT || 5051`.

---

## Testing the API

Once deployed, check:

```
https://your-api-url.onrender.com/
```

You should see: `FlavourAI backend is running 🚀`

**Endpoints:**
- `GET /` — health check
- `POST /api/meals` — meal suggestions (Recipe DB + optional AI fallback)
- `GET /api/recipe/cuisine/:region` — recipes by cuisine
- `GET /api/recipe/diet/:diet` — recipes by diet
- `GET /api/recipe/calories?min=&max=` — recipes by calorie range
- `GET /api/recipe/protein?min=&max=` — recipes by protein range
- `GET /api/recipe/nutrition/:id` — full nutrition for a recipe
- `GET /api/flavor/foodpairing/ingredient/:ingredient` — flavor pairings
- `GET /api/flavor/molecules/flavor-profile/:profile` — flavor profile
