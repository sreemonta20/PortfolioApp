# 🚀 Sreemonta Bhowmik – Portfolio System

**Angular 18 + .NET 10 Web API + SQL Server / MongoDB + Redis**

A full-stack, SSR-enabled portfolio website with a blog and an integrated admin panel designed to plug into an existing ERP system as a Portfolio Management module.

---

## 📁 Repository Structure

```
portfolio-system/
├── portfolio-app/               ← Angular 18 SSR frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/        portfolio.models.ts
│   │   │   │   ├── services/      portfolio-api.service.ts
│   │   │   │   ├── interceptors/  app-id + auth
│   │   │   │   └── guards/        auth.guard.ts
│   │   │   ├── shared/
│   │   │   │   └── navbar/
│   │   │   ├── features/
│   │   │   │   ├── profile/       CV page
│   │   │   │   ├── projects/      Projects page
│   │   │   │   ├── blog/          Blog list + post detail
│   │   │   │   └── contact/       Contact page
│   │   │   └── admin/
│   │   │       ├── login/         ERP-auth login
│   │   │       ├── layout/        Sidebar layout
│   │   │       ├── dashboard/     Stats + quick actions
│   │   │       ├── cv-manager/    Edit CV/profile
│   │   │       ├── project-manager/  CRUD projects
│   │   │       └── blog-manager/
│   │   │           ├── topic-manager/   CRUD topics
│   │   │           ├── post-list/       Manage posts
│   │   │           ├── post-editor/     Create/edit posts
│   │   │           └── comment-moderator/
│   │   ├── environments/
│   │   ├── styles.scss            Global design system
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── main.server.ts         SSR entry
│   │   └── server.ts              Express SSR server
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
├── Portfolio.API/                ← .NET 10 Web API
│   ├── Controllers/
│   │   ├── Public/  (CvController, BlogController, ProjectController)
│   │   └── Admin/   (AdminCvController, AdminBlogController, AdminProjectController)
│   ├── Middleware/  AppIdMiddleware.cs
│   ├── Extensions/  ServiceExtensions.cs
│   ├── appsettings.json          SQL Server (default) + MongoDB + Redis
│   └── Program.cs
│
├── Portfolio.Application/        ← Business logic + DTOs
├── Portfolio.Domain/             ← Domain entities
├── Portfolio.Infrastructure/     ← EF Core + Mongo + Redis
│
├── portfolio-sqlserver-schema.sql   ← Full SQL Server DB
└── portfolio-mongodb-schema.js      ← Full MongoDB schema
```

---

## ⚡ Quick Start

### 1. Angular Frontend

```bash
cd portfolio-app
npm install
ng serve                    # Dev server → http://localhost:4200
ng build                    # Production SSR build
node dist/portfolio-app/server/server.mjs  # SSR server → :4000
```

### 2. .NET 10 Backend

```bash
cd Portfolio.API
dotnet restore
dotnet ef database update   # Apply SQL Server migrations
dotnet run                  # → http://localhost:5000
```

### 3. Redis (Docker)

```bash
docker run -d -p 6379:6379 redis:alpine
```

---

## 🔑 App ID System

Every portfolio website is identified by a unique **AppId** (e.g. `PF-2026-SB-001`).

| Flow | Mechanism |
|------|-----------|
| Public portfolio website | Sends `X-App-Id: PF-2026-SB-001` HTTP header on every request |
| Admin panel (ERP module) | Uses JWT Bearer token + searches portfolios by AppId |
| Multiple portfolios | Each portfolio has its own AppId; admin can switch between them |

**Angular interceptor** (`app-id.interceptor.ts`) automatically injects the header for all `/api/portfolio/public/` calls.

---

## 🗄️ Database

### SQL Server (Default)

Set `"DatabaseProvider": "SqlServer"` in `appsettings.json`.

Tables: `Portfolio`, `CVProfile`, `SkillCategory`, `Skill`, `Experience`, `ExperienceBullet`, `Education`, `Certification`, `SoftSkill`, `Project`, `BlogTopic`, `BlogPost`, `BlogAttachment`, `Comment`, `Reaction`, `ReactionCount`

### MongoDB (Alternate)

Set `"DatabaseProvider": "MongoDB"` in `appsettings.json`.

Collections: `portfolios`, `cvprofiles` (embedded skills/experience/certs), `projects`, `blogtopics`, `blogposts` (embedded attachments + reactions), `comments`, `reactions`

### appsettings.json

```json
{
  "DatabaseProvider": "SqlServer",
  "ConnectionStrings": {
    "SqlServer": "Server=localhost;Database=PortfolioDB;User Id=sa;Password=YourPass!;TrustServerCertificate=True;",
    "MongoDB":   "mongodb://localhost:27017",
    "Redis":     "localhost:6379,abortConnect=false"
  },
  "MongoDB": { "DatabaseName": "PortfolioDB" },
  "Redis":   { "SlidingExpirationMinutes": 30 }
}
```

---

## 🎨 UI Design System

| Element | Value |
|---------|-------|
| CSS Framework | Bootstrap 5.3 |
| Icons | Bootstrap Icons 1.11 |
| Fonts | Playfair Display (headings) + DM Sans (body) |
| Primary color | `#00d4aa` (teal) |
| Accent color | `#f5a623` (amber) |
| Background | `#0a0f1e` (deep navy) |
| Buttons | Crystal glassmorphism with shimmer hover effect |
| Cards | Glassmorphism with backdrop blur |

---

## 🧭 Public Routes

| Route | Page |
|-------|------|
| `/profile` | Full CV/resume page |
| `/projects` | Portfolio projects grid |
| `/blog` | Blog list with topic filters |
| `/blog/:slug` | Full blog post with reactions & comments |
| `/contact` | Contact cards |

## 🔐 Admin Routes (Auth Required)

| Route | Page |
|-------|------|
| `/admin/login` | ERP credentials login |
| `/admin/dashboard` | Stats, quick actions, activity |
| `/admin/cv` | Edit CV profile + photo |
| `/admin/projects` | CRUD projects |
| `/admin/blog/topics` | CRUD blog topics with color/icon |
| `/admin/blog/posts` | List & manage posts |
| `/admin/blog/posts/new` | Create new post with editor |
| `/admin/blog/posts/edit/:id` | Edit existing post |
| `/admin/blog/comments` | Moderate comments |

---

## 🔌 API Endpoints

### Public (requires `X-App-Id` header)

```
GET  /api/portfolio/public/cv
GET  /api/portfolio/public/projects
GET  /api/portfolio/public/blog/topics
GET  /api/portfolio/public/blog/posts?topic=&page=&size=
GET  /api/portfolio/public/blog/posts/:slug
POST /api/portfolio/public/blog/posts/:id/react
POST /api/portfolio/public/blog/posts/:id/comments
```

### Admin (requires JWT `Authorization: Bearer <token>`)

```
GET  /api/portfolio/admin/cv/portfolios?search=
GET  /api/portfolio/admin/cv/:appId
PUT  /api/portfolio/admin/cv/:appId
POST /api/portfolio/admin/cv/:appId/photo
POST /api/portfolio/admin/cv/:appId/skills
PUT  /api/portfolio/admin/cv/skills/:id
DEL  /api/portfolio/admin/cv/skills/:id
... (experience, education, certs similarly)

GET  /api/portfolio/admin/blog/:appId/topics
POST /api/portfolio/admin/blog/:appId/topics
PUT  /api/portfolio/admin/blog/topics/:id
DEL  /api/portfolio/admin/blog/topics/:id

GET  /api/portfolio/admin/blog/:appId/posts
POST /api/portfolio/admin/blog/:appId/posts
PUT  /api/portfolio/admin/blog/posts/:id
PUT  /api/portfolio/admin/blog/posts/:id/publish
DEL  /api/portfolio/admin/blog/posts/:id

POST /api/portfolio/admin/blog/posts/:id/attachments
DEL  /api/portfolio/admin/blog/attachments/:id

GET  /api/portfolio/admin/blog/posts/:id/comments?pending=
PUT  /api/portfolio/admin/blog/comments/:id/approve
DEL  /api/portfolio/admin/blog/comments/:id
```

---

## 🏗️ ERP Integration

The admin panel is designed to be dropped into your existing ERP as a **Portfolio Management module**:

1. **Copy** the `src/app/admin/` folder into your ERP Angular project
2. **Add** the admin routes to your ERP router (guarded by your existing role check)
3. **Ensure** users with role `Admin` or `PortfolioManager` can access the module
4. The `AdminApiService` uses JWT Bearer auth — your ERP login token will work seamlessly
5. Admins can search all portfolios by AppId and switch between them

---

## ⚡ Performance Features

| Feature | Implementation |
|---------|----------------|
| SSR + Hydration | `provideClientHydration(withEventReplay())` |
| Transfer State | Avoids double API calls on hydration |
| Lazy Loading | All feature modules loaded on demand |
| Redis Caching | 30-min sliding cache on all public API responses |
| View Transitions | `withViewTransitions()` for smooth page changes |
| HTTP Fetch API | `withFetch()` for faster SSR HTTP calls |

---

## 📦 NuGet Packages Required (.NET 10)

```xml
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer"        Version="10.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools"            Version="10.*" />
<PackageReference Include="MongoDB.Driver"                                 Version="3.*"  />
<PackageReference Include="StackExchange.Redis"                            Version="2.*"  />
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="*" />
<PackageReference Include="Serilog.AspNetCore"                             Version="*"    />
<PackageReference Include="FluentValidation.AspNetCore"                    Version="*"    />
<PackageReference Include="Swashbuckle.AspNetCore"                         Version="*"    />
```

---

*Built for Sreemonta Bhowmik · Dubai, UAE · 2026*
