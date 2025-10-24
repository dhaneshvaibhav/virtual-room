@echo off
echo Starting Virtual Study Room Application...
echo.

echo Starting server...
start cmd /k "cd server && npm start"

echo Starting client...
start cmd /k "cd client && npm run dev"

echo.
echo Application started!
echo Server running on http://localhost:5000
echo Client running on http://localhost:3000
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul