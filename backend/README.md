# Backend (Express + SQLite)

Run locally:

```powershell
cd backend
npm install
node server.js
```

Server will listen on port 4000. Endpoints:
- POST /api/signup {username,email,password}
- POST /api/signin {email,password}
- GET /api/exams
- GET /api/exams/:id
- POST /api/upload-avatar (Auth Bearer token, multipart 'avatar')

Uploads stored in `backend/uploads` and served at `/backend/uploads/...`.

Quick start (PowerShell):

1. Install deps (one-time):
	cd "C:\Hung\My Project\Menu\backend"
	npm install

2. Start server:
	node server.js

3. Check endpoint:
	curl http://localhost:4000/api/exams

Notes:
- Data is stored in `backend/db/users.json` and `backend/db/exams.json`.
- Uploaded avatars are saved to `backend/uploads`.
- To run in background use a process manager like pm2 or PowerShell's Start-Process.
