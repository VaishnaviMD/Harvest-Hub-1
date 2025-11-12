# Setup Instructions for Harvest Hub

## Current Status
✅ All files are present in your workspace at:
`C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend\`

## If Files Are Missing or Need to Sync with GitHub

### Option 1: If you have a GitHub repository

1. **Navigate to your project folder:**
   ```powershell
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB"
   ```

2. **Check if it's a git repository:**
   ```powershell
   git status
   ```

3. **If it's a git repo, pull latest changes:**
   ```powershell
   git pull origin main
   ```
   (or `git pull origin master` if your main branch is called master)

4. **If it's NOT a git repo, clone from GitHub:**
   ```powershell
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB"
   git clone <your-github-repo-url> .
   ```

### Option 2: If files are in a different GitHub folder

1. **Find your GitHub folder location**
2. **Copy the files:**
   ```powershell
   # Copy from GitHub folder to current location
   Copy-Item -Path "C:\path\to\github\folder\harvesthub-frontend\*" -Destination "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend\" -Recurse -Force
   ```

### Option 3: Start Fresh (Recommended)

Since all files are already in your workspace, just install dependencies:

1. **Navigate to frontend folder:**
   ```powershell
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the application:**
   ```powershell
   npm start
   ```

## Quick Start (All Files Present)

The frontend files are already in your workspace. Just run:

```powershell
# From the root directory
cd harvesthub-frontend
npm install
npm start
```

The app will work without backend (uses mock services) and will open at `http://localhost:3000`

## Test Credentials (Mock Auth)

- **Email:** `customer@test.com`
- **Password:** `123456`

Or create a new account - it will work with mock authentication.

## Troubleshooting

### If npm install fails:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### If port 3000 is already in use:
The app will automatically try port 3001, 3002, etc.

## File Structure Confirmation

Your frontend should have these folders:
- ✅ `src/` - Source code
- ✅ `public/` - Public assets
- ✅ `package.json` - Dependencies
- ✅ `node_modules/` - Installed packages (after npm install)

All files are present and ready to use!

