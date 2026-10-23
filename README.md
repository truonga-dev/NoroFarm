# NoroFarm

NoroFarm is a full-stack agriculture platform with a Next.js frontend, a FastAPI backend, and Supabase/PostgreSQL persistence.

## Project structure

```text
NoroFarm/
├── backend/          # FastAPI application, migrations, and tests
├── frontend/         # Next.js application
├── supabase/         # Database migrations and seed data
├── nginx/            # Reverse-proxy configuration
├── docs/             # Product and engineering documentation
├── .github/          # CI workflows
└── docker-compose.yml
```

## Local development

### Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm ci
Copy-Item .env.local.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3000` and the API at `http://localhost:8000`.

## Quality checks

```powershell
cd frontend
npm run build

cd ..\backend
pytest
ruff check app tests
```

Never commit local `.env` files, virtual environments, dependency folders, or build output.

