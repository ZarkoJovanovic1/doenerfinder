# Using API_BASE in the frontend

The frontend reads the API base URL from the Vite env variable `VITE_API_BASE_URL`.
- Production (Vercel): set `VITE_API_BASE_URL` to your Render URL, e.g. `https://meine-d-ner-app.onrender.com`
- Local dev: falls back to `http://localhost:5000`

Use it like:
```js
import { API_BASE } from './api';
fetch(`${API_BASE}/api/doener`)
```
