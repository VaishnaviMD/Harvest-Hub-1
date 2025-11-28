# Testing Guide: Database Connection & Sign-In/Sign-Up

## ✅ What Was Fixed

1. **Frontend API Configuration**: Changed `USE_MOCK = false` in `api.js` to connect to real backend
2. **Backend Database Config**: Fixed typo in `application.properties` (driver-class-name)

## 🔍 Step-by-Step Testing

### Step 1: Verify MySQL Database is Running

1. Open MySQL Workbench
2. Connect to your MySQL server (localhost:3306)
3. Verify the database exists:
   ```sql
   SHOW DATABASES;
   ```
   You should see `harvesthub_db` in the list.

4. If the database doesn't exist, create it:
   ```sql
   CREATE DATABASE harvesthub_db;
   ```

5. Or import the schema:
   - In MySQL Workbench, go to Server → Data Import
   - Select `harvesthub-sql/harvesthub_db.sql`
   - Import to `harvesthub_db` database

### Step 2: Start the Backend Server

1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```bash
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-backend"
   ```

3. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

4. **Watch for these success messages:**
   - `Started HarvesthubBackendApplication in X.XXX seconds`
   - Database connection logs (should show Hibernate creating/updating tables)
   - `Tomcat started on port(s): 8080`

5. **If you see database connection errors:**
   - Check MySQL is running
   - Verify username/password in `application.properties` matches your MySQL credentials
   - Ensure database `harvesthub_db` exists

### Step 3: Start the Frontend

1. Open a **NEW** terminal/command prompt
2. Navigate to the frontend directory:
   ```bash
   cd "C:\Users\vaish\OneDrive\Desktop\HARVEST HUB\harvesthub-frontend"
   ```

3. Start the React app:
   ```bash
   npm start
   ```

4. The browser should open automatically to `http://localhost:3000`

### Step 4: Test Sign-Up (Creates New User in Database)

1. Navigate to: `http://localhost:3000/signup`
2. Fill in the form:
   - **Name**: Test User
   - **Email**: test@example.com
   - **Password**: test123
   - **Phone**: (optional)
   - **Location**: (optional)
   - **Type**: Customer or Farmer
3. Click "Sign Up"
4. **Expected Result:**
   - Success: You should be redirected to home page
   - Check MySQL Workbench: Run `SELECT * FROM users;` - you should see the new user!

### Step 5: Test Sign-In (Authenticates Existing User)

1. Navigate to: `http://localhost:3000/signin`
2. Use the credentials from Step 4:
   - **Email**: test@example.com
   - **Password**: test123
3. Click "Sign In"
4. **Expected Result:**
   - Success: You should be redirected to home page
   - Note: Sign-in does NOT create new records - it only authenticates existing users

### Step 6: Verify Data in MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Select `harvesthub_db` database
4. Run this query:
   ```sql
   SELECT * FROM users;
   ```
5. You should see all registered users with:
   - `user_id` (auto-generated)
   - `name`
   - `email`
   - `password` (hashed/encrypted)
   - `type` (Customer/Farmer)
   - `register_date`
   - Other fields

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or Network Error

**Solution:**
- Ensure backend is running on port 8080
- Check browser console (F12) for CORS errors
- Verify `USE_MOCK = false` in `api.js`

### Issue: Database Connection Failed

**Solution:**
- Check MySQL service is running
- Verify credentials in `application.properties`:
  - `spring.datasource.username=root`
  - `spring.datasource.password=vaish@05`
- Test connection in MySQL Workbench first

### Issue: "User already exists" Error

**Solution:**
- This is normal if you try to sign up with an email that's already registered
- Use a different email or sign in instead

### Issue: Backend Won't Start

**Solution:**
- Check Java version (needs Java 17+)
- Run `mvn clean install` first
- Check for port 8080 conflicts

### Issue: Tables Not Created

**Solution:**
- Check `spring.jpa.hibernate.ddl-auto=update` in `application.properties`
- Look at backend console logs for Hibernate SQL statements
- Manually import schema from `harvesthub-sql/harvesthub_db.sql`

## 📊 Expected Database Schema

After successful sign-up, the `users` table should have:
- `user_id` (BIGINT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, encrypted with BCrypt)
- `ph_no` (VARCHAR, nullable)
- `location` (VARCHAR, nullable)
- `type` (VARCHAR - "Customer" or "Farmer")
- `register_date` (DATETIME)
- `latitude` (DOUBLE, nullable)
- `longitude` (DOUBLE, nullable)

## 🔐 Important Notes

1. **Sign-Up** = Creates new user → **STORES DATA IN DATABASE** ✅
2. **Sign-In** = Authenticates existing user → **DOES NOT STORE DATA** (only verifies credentials)

3. Passwords are encrypted using BCrypt before storage
4. JWT tokens are used for authentication after login
5. The backend automatically creates/updates tables on startup (Hibernate DDL)

## ✅ Success Checklist

- [ ] MySQL database `harvesthub_db` exists
- [ ] Backend server starts without errors on port 8080
- [ ] Frontend connects to backend (no mock data)
- [ ] Sign-up creates new user in database
- [ ] Sign-in authenticates existing user
- [ ] Can see user data in MySQL Workbench

## 🚀 Quick Test Commands

**Check if backend is running:**
```bash
curl http://localhost:8080/api/auth/signin
```
(Should return an error about missing body, but confirms server is up)

**Check database connection:**
Look for these in backend console logs:
- `HikariPool-1 - Starting...`
- `HikariPool-1 - Start completed.`
- SQL queries showing table creation/updates


