# Deploy Frontend to Firebase Hosting
# This script builds the frontend with the production backend URL and deploys it

Write-Host "Building frontend with production backend URL..." -ForegroundColor Green

# Set environment variable and build
$env:VITE_BACKEND_SERVER_URL = "https://enigmaserver--enigma-d05b9.asia-southeast1.hosted.app"
cd apps/frontend
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    cd ../..
    exit 1
}

Write-Host "Build successful! Deploying to Firebase Hosting..." -ForegroundColor Green
cd ../..

# Deploy to Firebase Hosting
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    exit 1
}

