# Candid — Share your real.

A full-stack personal blogging and daily-thoughts platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Spring Boot 3.2, Spring Security, JWT, Hibernate 6 |
| Database | MySQL 8 |
| Image CDN | Cloudinary |

---

## Local Development

### Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+
- MySQL 8 running locally

### 1. Database
```sql
CREATE DATABASE candid_db;
```

### 2. Backend
Credentials live in `application-local.properties` (gitignored). That file is pre-filled — just run:
```bash
cd candid-backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
API starts at **http://localhost:8080**. Tables are auto-created on first run.

Default admin account seeded on first start:
- Email: `admin@candid.app`
- Password: `Admin@123`

### 3. Frontend
```bash
cd candid-frontend
npm install
npm run dev
```
App starts at **http://localhost:5173**

---

## Deployment

### Recommended stack (both free tiers)
| Service | What runs there |
|---|---|
| [Railway](https://railway.app) | Backend (Spring Boot) + MySQL database |
| [Vercel](https://vercel.com) | Frontend (Vite React) |

---

### Step 1 — Push to GitHub

Make sure your repo has a `.gitignore` (included). Never commit `.env` files.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/candid.git
git push -u origin main
```

---

### Step 2 — Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Select your repo → set **Root Directory** to `candid-backend`
3. Railway detects the `Dockerfile` automatically
4. Add a **MySQL** plugin: click **+ New** → **Database** → **MySQL**
5. Set these environment variables in the Railway backend service:

```
DB_URL          →  (copy from MySQL plugin: use the "Internal" connection string in JDBC format)
                   jdbc:mysql://<host>:<port>/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME     →  (from MySQL plugin variables: MYSQLUSER)
DB_PASSWORD     →  (from MySQL plugin variables: MYSQLPASSWORD)

JWT_SECRET      →  (generate any long random string, e.g. openssl rand -hex 64)

CLOUDINARY_CLOUD_NAME   →  (from cloudinary.com dashboard)
CLOUDINARY_API_KEY      →  (from cloudinary.com dashboard)
CLOUDINARY_API_SECRET   →  (from cloudinary.com dashboard)

MAIL_USERNAME   →  your Gmail address
MAIL_PASSWORD   →  your Gmail App Password (not your real password)
                   Create one at: myaccount.google.com/apppasswords

ADMIN_EMAIL     →  admin@yourdomain.com
ADMIN_PASSWORD  →  (choose a strong password)

CORS_ALLOWED_ORIGINS  →  https://your-vercel-app.vercel.app
                          (fill this in after Step 3 — you can update it)

JPA_DDL_AUTO    →  update
```

6. Deploy. Railway builds the Docker image and starts the server.
7. Copy the **public URL** Railway gives you (e.g. `https://candid-backend-production.up.railway.app`).

---

### Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project → Import Git Repository**
2. Select your repo → set **Root Directory** to `candid-frontend`
3. Vercel auto-detects Vite. Build settings should be:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add this environment variable:

```
VITE_API_URL  →  https://your-railway-backend-url/api
```
(The URL from Step 2, with `/api` appended)

5. Deploy. Vercel builds and publishes the frontend.
6. Copy your Vercel URL (e.g. `https://candid.vercel.app`).

---

### Step 4 — Wire CORS

Go back to Railway → your backend service → Variables → update:

```
CORS_ALLOWED_ORIGINS  →  https://candid.vercel.app
```

Redeploy the backend (Railway does this automatically on variable change).

---

### Step 5 — Custom Domain (optional)

- **Vercel**: Project → Settings → Domains → add your domain
- **Railway**: Service → Settings → Networking → Custom Domain
- Update `CORS_ALLOWED_ORIGINS` to your real domain after adding it

---

## Environment Variable Reference

### Backend
| Variable | Description | Example |
|---|---|---|
| `DB_URL` | MySQL JDBC connection string | `jdbc:mysql://host:3306/db?...` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | — |
| `JWT_SECRET` | JWT signing secret (256+ bit) | random hex string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dgmh0tn1n` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `MAIL_USERNAME` | Gmail address for OTP emails | `you@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password | — |
| `ADMIN_EMAIL` | Seeded admin email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Seeded admin password | — |
| `CORS_ALLOWED_ORIGINS` | Frontend origin (comma-separated) | `https://candid.vercel.app` |
| `JPA_DDL_AUTO` | Hibernate schema mode | `update` (first deploy), `validate` (after) |

### Frontend
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `https://api.yourdomain.com/api` |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Current user |
| POST | /api/auth/forgot-password | Send OTP to email |
| POST | /api/auth/reset-password | Reset password with OTP |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/posts | Create post (multipart/form-data) |
| GET | /api/posts/feed | Personalized hot-score feed |
| GET | /api/posts/discover | Explore (excludes followed users) |
| GET | /api/posts/public | Public feed for guests |
| GET | /api/posts/{id} | Single post |
| DELETE | /api/posts/{id} | Delete post |
| GET | /api/posts/user/{username} | User's posts |
| GET | /api/posts/hashtag/{tag} | Posts by hashtag |
| POST | /api/posts/{id}/like | Like |
| DELETE | /api/posts/{id}/like | Unlike |
| POST | /api/posts/{id}/comments | Comment |
| GET | /api/posts/{id}/comments | Get comments |

### Users & Social
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/users/{username} | Get profile |
| PUT | /api/users/profile | Update bio/avatar |
| GET | /api/users/suggested | Suggested users |
| POST | /api/follow/{username} | Follow (or request if private) |
| DELETE | /api/follow/{username} | Unfollow / cancel request |
| POST | /api/follow/requests/{username}/accept | Accept follow request |
| POST | /api/follow/requests/{username}/decline | Decline follow request |
| GET | /api/follow/{username}/followers | Followers list |
| GET | /api/follow/{username}/following | Following list |

### Notifications & Bookmarks
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/notifications | Get notifications (paginated) |
| GET | /api/notifications/count | Unread count (polled every 30s) |
| PUT | /api/notifications/read-all | Mark all read |
| GET | /api/bookmarks | Saved posts |
| POST | /api/bookmarks/{postId} | Save |
| DELETE | /api/bookmarks/{postId} | Remove |
| GET | /api/search?q= | Search users + posts |
| GET | /api/hashtags/trending | Trending hashtags |

### Admin (`ADMIN` role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | Dashboard stats |
| GET | /api/admin/users | All users (paginated) |
| PUT | /api/admin/users/{id}/ban | Ban user |
| PUT | /api/admin/users/{id}/unban | Unban user |
| DELETE | /api/admin/users/{id} | Delete user |
| GET | /api/admin/posts | All posts (paginated) |
| DELETE | /api/admin/posts/{id} | Delete post |
| GET | /api/admin/hashtags | All hashtags |
| POST | /api/admin/announcements | Send announcement to all users |

---

## Design System
- **Primary**: `#7F77DD`
- **Background**: `#f0f2f5`
- **Font**: Inter (Google Fonts)
- **Layout**: 190px sidebar · flexible feed · 220px right panel
- **Admin panel**: `/admin` (ADMIN role only)
