# Client Project Tracker

A full-stack project management application for creating, viewing, editing, filtering, and deleting client projects. The app combines a Django REST API with a Next.js frontend to provide a simple project-tracking dashboard.

---

## GitHub Repository

https://github.com/donnabell-s/koda-assessment.git

---

## Technology Choices

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js with TypeScript | Provides a modern React-based UI, file-based routing, and strong type safety. |
| Styling | Tailwind CSS | Enables fast, responsive UI development with consistent styling and dark mode support. |
| Backend | Django + Django REST Framework | Offers a robust API layer, built-in validation, and an efficient ORM for rapid development. |
| Database | PostgreSQL | Used for reliable relational storage in a production-style local development setup. |
| HTTP Client | Native Fetch API | Keeps the frontend lightweight without adding extra client-side dependencies. |

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+
- Python 3.10+
- PostgreSQL installed and running locally

### 1. Clone the Repository

```bash
git clone https://github.com/donnabell-s/koda-assessment.git
cd koda-assessment
```

### 2. Backend Setup

1. Create a PostgreSQL database:

```bash
createdb project_tracker_db
```

2. Create a `.env` file in the `backend/` directory with the following values:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=project_tracker_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

Generate a real Django secret key and replace the placeholder value:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

3. Create and activate a Python virtual environment, then install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # On macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

4. Apply database migrations:

```bash
python manage.py migrate
```

### 3. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
```

If you want to override the default API URL, create a `.env.local` file in the frontend folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## How to Run the Application

Start both services in separate terminals.

### 1. Start the Backend

```bash
cd backend
.venv\Scripts\activate   # On macOS/Linux: source .venv/bin/activate
python manage.py runserver 8000
```

The API will be available at:

- http://localhost:8000/api/projects/

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Then open:

- http://localhost:3000

---

## Features Implemented

- Create new projects through the frontend form
- View all projects in a dashboard layout
- Edit existing project details
- Delete projects with confirmation
- Filter projects by search term, status, and priority

## Assumptions Made

1. This project is intended for local development and evaluation rather than production deployment.
2. API endpoints are currently unauthenticated for simplicity.
3. PostgreSQL is used as the default database and is configured through environment variables.
4. The frontend is expected to run on http://localhost:3000 while the backend runs on http://localhost:8000.
5. Core project fields include client name, project name, status, priority, and due date; optional fields gracefully fall back in the UI.
