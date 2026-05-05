# ZeroWaste-Chef — Roadmap

**Team:** TechRift  
**Project:** ZeroWaste-Chef  
**Hackathon:** SolveX AI Hackathon 2026

---

## Phases

### Phase 1 — Setup & Auth
**Goal:** Repository ready, team roles assigned, login/register working end-to-end.

| Task | Owner | Issue |
|---|---|---|
| Create GitHub repo, set branch rules (no direct push to main) | Lead Developer | #1 |
| Initialize React frontend (Vite + React Router) | Feature Developer 1 | #2 |
| Initialize FastAPI backend, connect `.env` | Feature Developer 2 | #3 |
| Implement `/auth/register` and `/auth/login` endpoints (JWT) | Feature Developer 2 | #4 |
| Build login and register pages on frontend | Feature Developer 1 | #5 |
| Deploy frontend to Vercel, backend to Railway | Lead Developer | #6 |

**AI Agent — Plan Agent:**  
Before any code is written, prompt the AI tool with the full project description and generate this ROADMAP and the ARCHITECTURE.md. Commit both files to `main` as the project baseline. Sub-tasks for each phase should be broken down by the Plan Agent.

---

### Phase 2 — Fridge Photo Analysis
**Goal:** User can upload a fridge photo and receive a list of detected ingredients.

| Task | Owner | Issue |
|---|---|---|
| Build photo upload UI (drag & drop + preview) | Feature Developer 1 | #7 |
| Implement `/analyze` endpoint — receive image, call Claude Vision API | Feature Developer 2 | #8 |
| Parse Claude response into clean ingredient list | Feature Developer 2 | #9 |
| Display detected ingredient list on frontend | Feature Developer 1 | #10 |

**AI Agent — Skills Agent:**  
The Claude Vision API integration (`services/claude.py`) is a specialized task. Use the AI tool in "expert developer" mode to generate the image encoding, API call, and response parsing logic. Note the AI-assisted sections with a comment at the top of the file:  
`# Skills Agent: Claude Vision API integration — generated with AI assistance`

---

### Phase 3 — Recipe Matching
**Goal:** Detected ingredients are matched against TheMealDB; ranked recipe list is shown with missing ingredients highlighted.

| Task | Owner | Issue |
|---|---|---|
| Implement TheMealDB ingredient query (`services/mealdb.py`) | Feature Developer 2 | #11 |
| Build recipe scoring and ranking logic (by matched ingredient count) | Feature Developer 2 | #12 |
| Identify and return missing ingredients per recipe | Feature Developer 2 | #13 |
| Build recipe card component (name, image, match score, missing list) | Feature Developer 1 | #14 |
| Add low-calorie and quick-recipe filter toggles | Feature Developer 1 | #15 |

---

### Phase 4 — Nutritional Data
**Goal:** Each recipe card shows per-serving macro and micro nutritional values.

| Task | Owner | Issue |
|---|---|---|
| Implement USDA FoodData Central query (`services/usda.py`) | Feature Developer 2 | #16 |
| Aggregate nutrition values across recipe ingredients | Feature Developer 2 | #17 |
| Build nutrition panel component (calories, protein, carbs, fat, vitamins) | Feature Developer 1 | #18 |
| Wire `/nutrition/{meal_id}` to frontend recipe detail page | Feature Developer 1 | #19 |

**AI Agent — Skills Agent:**  
Nutritional aggregation logic (mapping USDA ingredient data to recipe quantities) is a data-heavy sub-task. Use the AI tool as a specialist to generate the matching and calculation functions in `services/usda.py`. Add traceability comment:  
`# Skills Agent: USDA nutrition aggregation — generated with AI assistance`

---

### Phase 5 — Voice Assistant
**Goal:** User can ask Turkish-language cooking questions hands-free; assistant responds audibly.

| Task | Owner | Issue |
|---|---|---|
| Implement Web Speech API listener (language: `tr-TR`) | Feature Developer 1 | #20 |
| Map recognized phrases to cooking step responses | Feature Developer 1 | #21 |
| Implement `SpeechSynthesis` for Turkish audio output | Feature Developer 1 | #22 |
| Wire voice assistant to active recipe's step list | Feature Developer 1 | #23 |

---

### Phase 6 — Final Review & Submission
**Goal:** All features working, code reviewed, AI refactoring pass completed, project submitted.

| Task | Owner | Issue |
|---|---|---|
| Full code review — all PRs merged, no open branches | Lead Developer | #24 |
| AI refactoring pass — run full codebase through AI tool for optimization | Lead Developer | #25 |
| End-to-end test: upload photo → get recipes → open recipe → use voice assistant | All | #26 |
| Write README with setup instructions and demo notes | Lead Developer | #27 |
| Final deployment check (Vercel + Railway both live) | Lead Developer | #28 |

**AI Agent — Final Review:**  
Before submission, prompt the AI tool: `"Review this entire codebase for performance issues, security vulnerabilities, and code quality. Suggest refactoring improvements."` Apply all relevant suggestions and note them in the final PR description.

---

## Branch Naming Convention

```
feature/photo-upload
feature/claude-vision-integration
feature/recipe-matching
feature/usda-nutrition
feature/voice-assistant
fix/jwt-token-expiry
```

All branches merge to `main` via Pull Request. Minimum 1 reviewer approval required.

---

## AI Traceability Summary

| File | Agent | Note |
|---|---|---|
| `ARCHITECTURE.md` | Plan Agent | Project architecture — AI generated |
| `ROADMAP.md` | Plan Agent | Task breakdown — AI generated |
| `services/claude.py` | Skills Agent | Vision API integration |
| `services/usda.py` | Skills Agent | Nutrition aggregation logic |
| All code | Final Review | Refactoring pass before submission |
