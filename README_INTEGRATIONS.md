# Google Maps & Payment Gateway Integration Guide

## Setup Instructions

### 1. Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
   - Directions API
4. Create credentials (API Key)
5. Restrict the API key to your domain (recommended for production)
6. Add the API key to your environment variables:

**Backend (`application.properties`):**
```properties
google.maps.api.key=YOUR_GOOGLE_MAPS_API_KEY
```

**Frontend (`.env` file in `harvesthub-frontend`):**
```
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

### 2. Razorpay Payment Gateway Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from Dashboard → Settings → API Keys
3. Add keys to backend configuration:

**Backend (`application.properties`):**
```properties
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

### 3. Install Frontend Dependencies

```bash
cd harvesthub-frontend
npm install @react-google-maps/api react-razorpay
```

### 4. Database Updates

The following new columns have been added to the database:

**Users table:**
- `latitude` (DOUBLE)
- `longitude` (DOUBLE)

**Delivery table:**
- `pickup_latitude` (DOUBLE)
- `pickup_longitude` (DOUBLE)
- `delivery_latitude` (DOUBLE)
- `delivery_longitude` (DOUBLE)
- `estimated_duration_minutes` (INT)

Run your database migration or update the schema manually.

## Features Implemented

### Google Maps Integration

1. **Geolocation Service**
   - Fetches GPS coordinates from addresses using Geocoding API
   - Automatically gets user location on signup/address entry

2. **Route Optimization**
   - Calculates distance and time between pickup and delivery locations
   - Uses Distance Matrix API for accurate estimates
   - Uses Directions API for optimized routes

3. **Map Visualizations**
   - Interactive map for location selection
   - Delivery tracking with route display
   - Marker visualization for pickup and delivery points

### Payment Gateway Integration

1. **Razorpay Integration**
   - Secure payment processing for card payments
   - Payment order creation
   - Payment verification
   - Transaction recording in database

2. **Payment Methods**
   - Credit/Debit Card (via Razorpay)
   - Cash on Delivery (COD)

3. **Payment Flow**
   - Create payment order on checkout
   - Redirect to Razorpay checkout
   - Verify payment signature
   - Update payment status in database

## API Endpoints

### Google Maps
- `GET /api/maps/geocode?address={address}` - Get coordinates from address
- `GET /api/maps/distance?originLat={lat}&originLng={lng}&destLat={lat}&destLng={lng}` - Calculate distance
- `GET /api/maps/route?originLat={lat}&originLng={lng}&destLat={lat}&destLng={lng}` - Get optimized route

### Payment Gateway
- `POST /api/payments/gateway/create-order` - Create Razorpay order
- `POST /api/payments/gateway/verify` - Verify payment
- `POST /api/payments/gateway/capture` - Capture payment

## Usage Examples

### Frontend - Using Location Picker
```jsx
import LocationPicker from "./components/LocationPicker";

<LocationPicker 
  onLocationSelect={(location) => {
    console.log("Selected:", location.lat, location.lng);
  }}
/>
```

### Frontend - Using Map View
```jsx
import MapView from "./components/MapView";

<MapView 
  origin={{ lat: 12.9716, lng: 77.5946 }}
  destination={{ lat: 12.9352, lng: 77.6245 }}
/>
```

## Testing

1. **Google Maps**: Test with real addresses to verify geocoding
2. **Payment Gateway**: Use Razorpay test keys for development
3. **Route Optimization**: Test with different origin/destination pairs

## Production Considerations

1. **API Key Security**: Never commit API keys to version control
2. **Rate Limiting**: Implement rate limiting for API calls
3. **Error Handling**: Add proper error handling for API failures
4. **Caching**: Cache geocoding results to reduce API calls
5. **Payment Security**: Always verify payment signatures on backend

