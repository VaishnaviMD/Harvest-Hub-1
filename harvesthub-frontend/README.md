# Harvest Hub Frontend

React app for a farm-to-door marketplace.

## Running with Spring Boot backend

- Dev proxy is set to `http://localhost:8080` in `package.json`. Start Spring Boot on port 8080.
- Optionally set `REACT_APP_API_BASE_URL` if your backend is hosted elsewhere (e.g., `http://localhost:8080`). When set, it overrides the proxy.

### Expected backend endpoints

- GET `/api/products` → `[ { id, name, price, category, image, description } ]`
- GET `/api/products/{id}` → `{ id, name, price, category, image, description }`
- POST `/api/orders`
  - Body: `{ customerName, address, paymentMethod, items: [ { productId, quantity, price } ] }`
  - 201/200 on success
- POST `/api/auth/signin`
  - Body: `{ email, password }`
- POST `/api/auth/signup`
  - Body: `{ email, password, role }`

### CORS (if not using proxy or using a different origin)

- Enable CORS on the Spring Boot server to allow the React app origin:
  - Example: `@CrossOrigin(origins = "http://localhost:3000")` on controllers, or global CORS config.

### Start

```bash
npm install
npm start
```

### Environment

- Create `.env.local` (optional):

```
REACT_APP_API_BASE_URL=http://localhost:8080
```

