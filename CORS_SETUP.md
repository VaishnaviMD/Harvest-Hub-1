# CORS Configuration Guide

## ✅ CORS is Now Fully Enabled

CORS (Cross-Origin Resource Sharing) has been configured at multiple levels to ensure your frontend can communicate with the backend without any issues.

## 🔧 Configuration Details

### 1. **SecurityConfig (Spring Security Level)**
- Location: `harvesthub-backend/src/main/java/com/harvesthub/config/SecurityConfig.java`
- Handles CORS at the security filter level
- Allows all origins: `*`
- Allows all methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Allows all headers
- Exposes: Authorization, Content-Type, X-Total-Count
- Preflight cache: 1 hour

### 2. **WebConfig (Spring MVC Level)**
- Location: `harvesthub-backend/src/main/java/com/harvesthub/config/WebConfig.java`
- Additional CORS configuration at MVC level
- Provides backup CORS handling
- Same settings as SecurityConfig for consistency

### 3. **Controller Level**
- Some controllers have `@CrossOrigin(origins = "*")` annotations
- These work in conjunction with the global configuration

## 📋 Current CORS Settings

```java
Allowed Origins: * (all origins)
Allowed Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Allowed Headers: * (all headers)
Exposed Headers: Authorization, Content-Type, X-Total-Count
Max Age: 3600 seconds (1 hour)
```

## 🚀 Testing CORS

### Test from Frontend:
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm start`
3. Make API calls from `http://localhost:3000`
4. Check browser console (F12) - should see no CORS errors

### Test with curl:
```bash
# Test preflight request
curl -X OPTIONS http://localhost:8080/api/auth/signin \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should see CORS headers in response:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
# Access-Control-Allow-Headers: *
```

## 🔒 Production Configuration

For production, you should restrict allowed origins:

### Option 1: Update SecurityConfig
```java
// Replace this line:
configuration.setAllowedOrigins(List.of("*"));

// With specific origins:
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));
```

### Option 2: Use Environment Variables
```java
@Value("${cors.allowed.origins:*}")
private String allowedOrigins;

// In corsConfigurationSource():
List<String> origins = Arrays.asList(allowedOrigins.split(","));
configuration.setAllowedOrigins(origins);
```

Then in `application.properties`:
```properties
cors.allowed.origins=http://localhost:3000,https://yourdomain.com
```

## ⚠️ Important Notes

1. **Credentials**: Currently disabled because `allowCredentials(true)` cannot be used with `allowedOrigins("*")`. If you need credentials:
   - Specify exact origins (not "*")
   - Set `configuration.setAllowCredentials(true)`

2. **Preflight Requests**: OPTIONS requests are automatically handled and cached for 1 hour

3. **Multiple Configurations**: CORS is configured at:
   - Spring Security level (SecurityConfig)
   - Spring MVC level (WebConfig)
   - Controller level (some controllers)

4. **Order Matters**: Spring Security CORS takes precedence, but WebConfig provides backup

## 🐛 Troubleshooting

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solution:**
- Ensure backend is running
- Check SecurityConfig CORS configuration
- Verify frontend is making requests to correct backend URL

### Issue: "Preflight request doesn't pass"
**Solution:**
- Ensure OPTIONS method is allowed
- Check that preflight headers are correct
- Verify maxAge is set (currently 3600 seconds)

### Issue: "Credentials not allowed"
**Solution:**
- If using credentials, cannot use "*" for origins
- Specify exact origins and enable `allowCredentials(true)`

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend can make API calls without CORS errors
- [ ] Browser console shows no CORS warnings
- [ ] OPTIONS preflight requests work
- [ ] All HTTP methods (GET, POST, PUT, DELETE) work
- [ ] Authorization header is exposed and accessible

## 📝 Files Modified

1. ✅ `SecurityConfig.java` - Enhanced CORS configuration
2. ✅ `WebConfig.java` - New MVC-level CORS configuration

## 🎯 Result

CORS is now fully enabled and configured to allow:
- ✅ All origins (development)
- ✅ All HTTP methods
- ✅ All headers
- ✅ Preflight request caching
- ✅ Authorization header exposure

Your frontend at `http://localhost:3000` can now communicate with your backend at `http://localhost:8080` without any CORS issues!


