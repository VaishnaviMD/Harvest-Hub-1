# 🚀 Quick Start Guide - Harvest Hub

## ✅ Your Files Are Already Here!

All your `harvesthub-frontend` files are located at:
```
C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend\
```

## 📋 To Run the Application:

### Step 1: Open Terminal/PowerShell
Navigate to the frontend folder:
```powershell
cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend"
```

### Step 2: Install Dependencies (if not already done)
```powershell
npm install
```

### Step 3: Start the Application
```powershell
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## 🔐 Test Login Credentials

Since we're using mock authentication (no backend needed):

**Customer Account:**
- Email: `customer@test.com`
- Password: `123456`

**Farmer Account:**
- Email: `farmer@test.com`
- Password: `123456`

Or create a new account - it will work immediately!

## 📁 If You Need to Sync with GitHub:

### If your files are in a different GitHub folder:

1. **Copy files from GitHub folder:**
   ```powershell
   # Replace with your actual GitHub folder path
   $githubPath = "C:\path\to\your\github\folder\harvesthub-frontend"
   $currentPath = "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend"
   
   Copy-Item -Path "$githubPath\*" -Destination $currentPath -Recurse -Force
   ```

2. **Or clone from GitHub:**
   ```powershell
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB"
   git clone <your-github-repo-url> .
   ```

## ✨ Features Available (No Backend Required):

- ✅ Sign In / Sign Up (Mock Authentication)
- ✅ Browse Products (Mock Data)
- ✅ Add to Cart
- ✅ Checkout with Mock Payment
- ✅ Location Picker (Uses Browser Geolocation)
- ✅ Map Visualization (Mock Maps)

## 🛠️ Troubleshooting:

### If npm install fails:
```powershell
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### If port 3000 is busy:
The app will automatically try the next available port (3001, 3002, etc.)

### To stop the server:
Press `Ctrl + C` in the terminal

## 📝 Note:

The app is configured to work **without any backend or external APIs**. All services use mock implementations, so you can test everything immediately!

---

**Your app should now be running!** 🎉

Open your browser and go to `http://localhost:3000`

