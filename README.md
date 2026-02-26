# Coca-Cola DMS · SFA

Hindustan Coca-Cola Beverages — Distribution Management & Sales Force Automation Dashboard.

---

## 🚀 Deploy to GitHub + Render (Step-by-Step)

### Step 1 — Push to GitHub

```bash
# 1. Initialize git repo
cd coca-cola-dms
git init
git add .
git commit -m "Initial commit: Coca-Cola DMS app"

# 2. Create a new repo on GitHub (github.com → New repository)
#    Name it: coca-cola-dms
#    Keep it public or private — your choice
#    Do NOT initialize with README (you already have files)

# 3. Link and push
git remote add origin https://github.com/YOUR_USERNAME/coca-cola-dms.git
git branch -M main
git push -u origin main
```

---

### Step 2 — Deploy on Render

1. Go to **[render.com](https://render.com)** and sign in (free account works)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select the `coca-cola-dms` repo
4. Fill in the settings:
   - **Name:** `coca-cola-dms`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
5. Under **Environment Variables**, add:
   - Key: `PORT` → Value: `10000`
6. Click **"Create Web Service"**

Render will build and deploy automatically. Your app will be live at:
`https://coca-cola-dms.onrender.com`

---

## 💻 Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 🔑 Login Credentials

| Role        | Email             | Password   |
|-------------|-------------------|------------|
| NSM (Admin) | neha@coke.in      | admin123   |
| RSM         | rajesh@coke.in    | rsm123     |
| SO          | amit@coke.in      | so123      |
| Salesman    | priya@coke.in     | sm123      |
| Distributor | dinesh@coke.in    | dist123    |

---

## 🛠 Tech Stack

- **React 18** + Vite
- **Recharts** — Data visualization
- **Syne + JetBrains Mono** — Typography (Google Fonts)
- **Pure CSS-in-JS** — No external UI library
