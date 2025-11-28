# API Key Configuration

The project supports both mock mode (no external APIs) and real integrations with Google Maps and Razorpay. Use environment variables to supply API keys without modifying source files.

## Backend (Spring Boot)

Set these environment variables before starting the backend:

| Variable | Purpose | Default |
|----------|---------|---------|
| `GOOGLE_MAPS_API_KEY` | Google Maps Web Services key | *(blank → mock mode)* |
| `GOOGLE_MAPS_GEOCODING_URL` | Override Geocoding API endpoint | `https://maps.googleapis.com/maps/api/geocode/json` |
| `GOOGLE_MAPS_DISTANCE_URL` | Override Distance Matrix endpoint | `https://maps.googleapis.com/maps/api/distancematrix/json` |
| `GOOGLE_MAPS_DIRECTIONS_URL` | Override Directions endpoint | `https://maps.googleapis.com/maps/api/directions/json` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `mock_key_id` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `mock_key_secret` |
| `RAZORPAY_API_URL` | Razorpay API base URL | `https://api.razorpay.com/v1` |

Example (PowerShell):
```powershell
$env:GOOGLE_MAPS_API_KEY="your-google-key"
$env:RAZORPAY_KEY_ID="rzp_test_xxx"
$env:RAZORPAY_KEY_SECRET="your-secret"
mvn spring-boot:run
```

If `RAZORPAY_KEY_ID` is absent or equals `mock_key_id`, the backend automatically returns mock payment orders so the frontend flow continues without errors.

## Frontend (React)

A template is provided at `harvesthub-frontend/env.example`. Copy it to `.env` and fill in your keys:
```bash
cd harvesthub-frontend
copy env.example .env   # Windows PowerShell
# or: cp env.example .env
```

`.env` fields:
```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_RAZORPAY_KEY_ID=
```

- `REACT_APP_GOOGLE_MAPS_API_KEY`: Expose the key to any future Google Maps components.
- `REACT_APP_RAZORPAY_KEY_ID`: Provide the publishable Razorpay key to the browser (fallback when backend is in mock mode).

Restart `npm start` after updating `.env`.

## Mock Mode vs Real Mode

| Scenario | Backend | Frontend | Behaviour |
|----------|---------|----------|-----------|
| No API keys | Uses mock Google Maps + mock Razorpay | Shows mock payment alerts | Works offline; no external calls |
| Only backend keys | Real server-side calls | Frontend still shows Razorpay modal with backend key | Recommended for production |
| Backend + front keys | Fully integrated | Razorpay modal uses real key | Standard live setup |

## Troubleshooting

- **Backend fails with “Could not resolve placeholder 'google.maps.api.key'”**  
  Ensure the new environment variable syntax is deployed (check `application.properties` is updated) and restart the backend.

- **Razorpay still shows mock flow**  
  Verify `RAZORPAY_KEY_ID` is set and not `mock_key_id`. Restart backend and frontend.

- **Google API calls return `REQUEST_DENIED`**  
  Confirm the key has required API permissions (Geocoding, Distance Matrix, Directions). Update billing if required.

