# ZeroWaste-Chef — Architecture

**Team:** TechRift  
**Project:** ZeroWaste-Chef  
**Stack:** React.js · Python FastAPI · Claude API · TheMealDB · USDA FoodData Central

---

## Overview

ZeroWaste-Chef is a web application that analyzes a user's fridge photo using AI, matches detected ingredients against a recipe database, and recommends the most suitable meals along with nutritional information. A Turkish-language voice assistant guides users through cooking steps hands-free.

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                  │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Auth Pages │  │  Main App    │  │  Voice    │  │
│  │  Login /    │  │  Upload /    │  │  Assistant│  │
│  │  Register   │  │  Recipes     │  │  (TR)     │  │
│  └─────────────┘  └──────────────┘  └───────────┘  │
│            React.js + Web Speech API                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────┐
│                BACKEND (FastAPI)                    │
│                                                     │
│  /auth        → JWT login & register                │
│  /analyze     → Fridge photo → ingredient list      │
│  /recipes     → Match ingredients → recipe list     │
│  /nutrition   → Fetch macro/micro data per recipe   │
│  /voice       → Cooking step query handler          │
└──────┬──────────────┬──────────────────┬────────────┘
       │              │                  │
┌──────▼──────┐ ┌─────▼──────┐ ┌────────▼────────┐
│ Claude API  │ │ TheMealDB  │ │ USDA FoodData   │
│ Vision      │ │ API        │ │ Central API     │
│ (ingredient │ │ (recipes & │ │ (macro & micro  │
│  detection) │ │ categories)│ │  nutrition)     │
└─────────────┘ └────────────┘ └─────────────────┘
```

---

## Module Breakdown

### 1. Frontend — `client/`

| Module | Responsibility |
|---|---|
| `AuthPage` | User login and registration forms |
| `UploadPage` | Fridge photo upload and preview |
| `RecipeList` | Renders ranked recipe cards |
| `RecipeDetail` | Full recipe view with steps and nutrition |
| `VoiceAssistant` | Listens for Turkish voice queries, reads steps aloud |
| `FilterBar` | Low-calorie and quick-recipe toggle filters |

**Key libraries:** React 18, React Router, Axios, Web Speech API (browser-native)

---

### 2. Backend — `server/`

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Create user account (hashed password, JWT) |
| `/auth/login` | POST | Authenticate, return JWT token |
| `/analyze` | POST | Receive image → call Claude Vision → return ingredient list |
| `/recipes` | GET | Match ingredients with TheMealDB, apply filters |
| `/nutrition/{meal_id}` | GET | Fetch USDA nutrition data for a recipe's ingredients |
| `/voice` | POST | Accept text query, return next cooking step |

**Key libraries:** FastAPI, python-jose (JWT), passlib (password hashing), httpx (API calls), python-dotenv

---

### 3. External APIs

#### Claude API (Vision)
- **Purpose:** Detect ingredients from fridge photo
- **Input:** Base64-encoded image
- **Output:** List of identified ingredients (e.g., `["eggs", "tomato", "cheese"]`)
- **Model:** `claude-sonnet-4-20250514`

#### TheMealDB API
- **Purpose:** Recipe database — no key required, free tier
- **Endpoints used:**
  - `filter.php?i={ingredient}` — filter recipes by ingredient
  - `lookup.php?i={meal_id}` — full recipe detail and steps
- **Matching logic:** Recipes are scored by how many of the user's detected ingredients they require; missing ingredients are surfaced per recipe.

#### USDA FoodData Central API
- **Purpose:** Macro and micro nutritional data
- **Key:** Free, obtained at `fdc.nal.usda.gov`
- **Endpoint:** `GET /foods/search?query={ingredient}&api_key={key}`
- **Data returned:** Calories, protein, carbohydrate, fat, fiber, vitamins, minerals per 100g

---

### 4. Authentication

- Registration stores hashed password (bcrypt via passlib)
- Login returns a signed JWT (HS256, 24h expiry)
- Protected routes require `Authorization: Bearer <token>` header
- Frontend stores token in memory (not localStorage) for security

---

### 5. Voice Assistant

- Uses the browser's built-in **Web Speech API** (no external service)
- Language set to `tr-TR` (Turkish)
- Recognizes queries: `"Sonraki adım ne?"`, `"Ne kadar pişireceğim?"`, `"Malzemeler neler?"`
- Responds via `SpeechSynthesis` API, also in Turkish

---

## Data Flow — Core Feature

```
User uploads fridge photo
        │
        ▼
Backend /analyze
  → Sends image to Claude API (Vision)
  → Receives ingredient list
        │
        ▼
Backend /recipes
  → Queries TheMealDB for each ingredient
  → Scores and ranks matching recipes
  → Identifies missing ingredients per recipe
  → Applies filters (low-calorie / quick)
        │
        ▼
Backend /nutrition
  → For each recipe, queries USDA for each ingredient
  → Aggregates macro + micro values
  → Calculates per-serving totals
        │
        ▼
Frontend renders ranked recipe cards
  with: match score · missing ingredients · nutrition panel
```

---

## Environment Variables

```env
# Backend .env
CLAUDE_API_KEY=
USDA_API_KEY=
JWT_SECRET=
```

TheMealDB requires no key.

---

## Deployment

| Service | Platform | Tier |
|---|---|---|
| Frontend | Vercel | Free |
| Backend | Railway | Free (500h/mo) |

---

## Folder Structure

```
zerowaste-chef/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # AuthPage, UploadPage, RecipeDetail
│   │   ├── components/      # RecipeCard, VoiceAssistant, FilterBar
│   │   └── api/             # Axios wrappers for backend calls
│   └── public/
├── server/                  # FastAPI backend
│   ├── main.py
│   ├── routers/             # auth.py, analyze.py, recipes.py, nutrition.py
│   ├── services/            # claude.py, mealdb.py, usda.py
│   └── models/              # Pydantic schemas
├── ARCHITECTURE.md
└── ROADMAP.md
```
