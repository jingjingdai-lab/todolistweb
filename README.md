# Todo List Web App

This is a full-stack Todo List application developed as part of a technical test.

The goal of this project is to build a simple task management system, similar to tools like Wunderlist or Google Tasks.

---

## Quick Start

```bash
git clone https://github.com/jingjingdai-lab/todolistweb.git
cd todolistweb
docker compose up --build
```

---

## Tech Stack

### Frontend
- Vue 3
- Tailwind CSS

### Backend
- NestJS
- PostgreSQL
- JWT Authentication

### DevOps
- Docker
- Docker Compose

---

## Project Structure

```
todolistweb/
├── frontend/   # Vue 3 app
├── backend/    # NestJS API
├── docker-compose.yml
└── README.md
```

---

## Features

### Authentication
- Register
- Login
- JWT authentication

### Task Lists
- Create list
- Delete list
- Select list

### Tasks
- Create task with title, description, due date
- Toggle status (TODO / DONE)
- Delete task

---

## UI Structure

- Left sidebar: manage lists
- Main content: display tasks
- Right sidebar: task details

---

## Run with Docker (recommended)

Make sure Docker Desktop is installed and running.

From the project root:

```bash
docker compose up --build
```

---

## Access

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

---

## Stop containers

```bash
docker compose down
```

---

## Run without Docker (optional)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Notes

- Docker version is recommended (no local setup required)
- Backend connects to PostgreSQL via Docker service `db`
- Environment variables are defined in `backend/.env`

---

## Future Improvements

- Edit task
- Improve UI/UX
- Better error handling
- Deployment

---

## Author

DAI Jingjing