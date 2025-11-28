# Sign-In Setup Guide

## ✅ What Was Implemented

### 1. **Login History Tracking**
- Created `LoginHistory` table to track all sign-in attempts
- Records: login date, IP address, user agent, status (SUCCESS/FAILED), failure reason
- Both successful and failed login attempts are logged

### 2. **Test Users Seeder**
- Automatic data seeder creates test users on backend startup
- Test users are created only if they don't already exist
- No need to sign up first - you can sign in immediately!

### 3. **Sign-In Details Stored in Database**
- Every sign-in attempt is now logged to the `login_history` table
- Includes IP address, browser info, timestamp, and success/failure status

## 🚀 Quick Start

### Option 1: Automatic Test Users (Recommended)

1. **Start the backend server:**
   ```bash
   cd harvesthub-backend
   mvn spring-boot:run
   ```

2. **Watch the console** - you'll see:
   ```
   ✓ Test customer created: customer@test.com / password123
   ✓ Test farmer created: farmer@test.com / password123
   ✓ Test admin created: admin@test.com / admin123
   ```

3. **Sign in with these credentials:**
   - **Customer**: `customer@test.com` / `password123`
   - **Farmer**: `farmer@test.com` / `password123`
   - **Admin**: `admin@test.com` / `admin123`

### Option 2: Manual SQL Script

1. **Open MySQL Workbench**
2. **Run the SQL script:**
   ```sql
   -- Open and run: harvesthub-sql/seed_test_users.sql
   ```
3. **Sign in with the test credentials**

## 📊 Viewing Sign-In History

### In MySQL Workbench:

```sql
USE harvesthub_db;

-- View all login history
SELECT 
    lh.login_id,
    lh.email,
    u.name,
    lh.login_date,
    lh.ip_address,
    lh.login_status,
    lh.failure_reason
FROM login_history lh
LEFT JOIN users u ON lh.user_id = u.user_id
ORDER BY lh.login_date DESC;

-- View successful logins only
SELECT * FROM login_history WHERE login_status = 'SUCCESS' ORDER BY login_date DESC;

-- View failed login attempts
SELECT * FROM login_history WHERE login_status = 'FAILED' ORDER BY login_date DESC;

-- View login history for a specific user
SELECT * FROM login_history 
WHERE user_id = (SELECT user_id FROM users WHERE email = 'customer@test.com')
ORDER BY login_date DESC;
```

## 🔍 Database Tables

### `users` Table
Stores all registered users (created via sign-up or seeder)

### `login_history` Table (NEW)
Stores all sign-in attempts with:
- `login_id` - Primary key
- `user_id` - Foreign key to users (nullable for failed logins)
- `email` - Email used for login attempt
- `login_date` - Timestamp of login attempt
- `ip_address` - IP address of the client
- `user_agent` - Browser/client information
- `login_status` - 'SUCCESS' or 'FAILED'
- `failure_reason` - Reason for failure (if failed)

## 🧪 Testing

1. **Test Sign-In with Test User:**
   - Go to: `http://localhost:3000/signin`
   - Email: `customer@test.com`
   - Password: `password123`
   - Click "Sign In"
   - ✅ Should succeed and redirect to home

2. **Test Failed Login:**
   - Try signing in with wrong password
   - Check `login_history` table - should see FAILED entry

3. **Verify Login History:**
   - After signing in, check MySQL:
   ```sql
   SELECT * FROM login_history ORDER BY login_date DESC LIMIT 5;
   ```
   - Should see your login attempt with SUCCESS status

## 📝 Notes

- **Test users are created automatically** when backend starts (if they don't exist)
- **All sign-in attempts are logged** - both successful and failed
- **You can sign in immediately** without signing up first (using test users)
- **Sign-up still works** - creates new users normally
- **Login history persists** - you can track all authentication attempts

## 🔧 Customization

### Add More Test Users

Edit `harvesthub-backend/src/main/java/com/harvesthub/config/DataSeeder.java`:

```java
if (userRepository.findByEmail("your@email.com").isEmpty()) {
    Users newUser = new Users();
    newUser.setEmail("your@email.com");
    newUser.setPassword(passwordEncoder.encode("yourpassword"));
    newUser.setName("Your Name");
    newUser.setType("Customer");
    newUser.setRegisterDate(new Date());
    userRepository.save(newUser);
}
```

### Disable Auto-Seeder

If you don't want test users created automatically, comment out the `@Component` annotation in `DataSeeder.java`.

## ✅ Success Checklist

- [ ] Backend server started successfully
- [ ] Test users created (check console logs)
- [ ] Can sign in with test credentials
- [ ] Login history table exists in database
- [ ] Sign-in attempts appear in `login_history` table
- [ ] Can view login history in MySQL Workbench


