@echo off
REM Run helper for Windows (CMD) - improved: serve from project root so absolute /css and /asset paths work
cd /d "%~dp0"

where npm >nul 2>&1
if %ERRORLEVEL%==0 (
  echo npm detected. Installing dependencies and starting dev server...
  npm install
  npm run dev
  goto :eof
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Node/npm not found. Serving site via Python HTTP server from project root...
  py -3 -m http.server 8000
  start http://localhost:8000/html/web.html
  goto :eof
)


where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo Node/npm not found. Serving site via Python HTTP server from project root...
  python -m http.server 8000
  start http://localhost:8000/html/web.html
  goto :eof
)

echo Neither npm nor Python found on PATH.
echo Install Node.js (https://nodejs.org) or Python (https://python.org) and try again.
exit /b 1
