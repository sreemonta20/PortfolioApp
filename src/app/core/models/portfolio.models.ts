// ============================================================
// src/app/core/models/portfolio.models.ts
// All domain models for the Portfolio Angular app
// ============================================================

export interface Portfolio {
  id: string;
  appId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── CV / PROFILE ─────────────────────────────────────────────
export interface CVProfile {
  id: string;
  portfolioId: string;
  firstName: string;
  lastName: string;
  get fullName(): string;
  role: string;
  address: string;
  mobileNumber: string;
  email: string;
  linkedInUrl: string;
  gitHubUrl: string;
  portfolioUrl: string;
  professionalSummary: string;
  photoUrl: string | null;
  availability: string;
  visaStatus: string;
  languages: string;
  skillCategories: SkillCategory[];
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  softSkills: SoftSkill[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: string;
  name: string;
  iconClass: string;
  sortOrder: number;
  skills: Skill[];
}

export interface Skill {
  id: string;
  skillCategoryId: string;
  name: string;
  sortOrder: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  liveUrl: string | null;
  bullets: string[];
  sortOrder: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number;
  sortOrder: number;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  dateRange: string;
  isInProgress: boolean;
  iconClass: string;
  sortOrder: number;
}

export interface SoftSkill {
  id: string;
  name: string;
  iconClass: string;
  sortOrder: number;
}

// ── PROJECT ──────────────────────────────────────────────────
export interface Project {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  liveUrl: string | null;
  repoUrl: string | null;
  iconClass: string;
  tags: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ── BLOG TOPIC ───────────────────────────────────────────────
export interface BlogTopic {
  id: string;
  portfolioId: string;
  name: string;
  slug: string;
  iconClass: string;
  colorHex: string;
  sortOrder: number;
  isActive: boolean;
  postCount?: number;
  createdAt: Date;
}

// ── BLOG POST ────────────────────────────────────────────────
export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbUrl: string | null;
  readTimeMin: number;
  publishedAt: Date;
  topicId: string;
  topicName: string;
  topicSlug: string;
  topicColorHex: string;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
}

export interface BlogPostDetail extends BlogPostSummary {
  body: string;
  isFeatured: boolean;
  attachments: BlogAttachment[];
  reactions: ReactionSummary;
  comments: Comment[];
}

export interface BlogAttachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'excel' | 'word';
  fileUrl: string;
  fileSizeKb: number;
  uploadedAt: Date;
}

// ── COMMENT ──────────────────────────────────────────────────
export interface Comment {
  id: string;
  blogPostId: string;
  parentId: string | null;
  authorName: string;
  authorEmail?: string;
  body: string;
  isApproved: boolean;
  createdAt: Date;
  replies?: Comment[];
}

// ── REACTION ─────────────────────────────────────────────────
export interface ReactionSummary {
  like:      number;
  dislike:   number;
  love:      number;
  celebrate: number;
}

// ── PAGINATION ───────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── ADMIN REQUESTS ───────────────────────────────────────────
export interface CreateBlogTopicRequest {
  name: string;
  slug: string;
  iconClass: string;
  colorHex: string;
  sortOrder: number;
}

export interface CreateBlogPostRequest {
  blogTopicId: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  readTimeMin: number;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface UpdateCVProfileRequest {
  firstName: string;
  lastName: string;
  role: string;
  address: string;
  mobileNumber: string;
  email: string;
  linkedInUrl: string;
  gitHubUrl: string;
  portfolioUrl: string;
  professionalSummary: string;
  availability: string;
  visaStatus: string;
  languages: string;
}

export interface CreateExperienceRequest {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  liveUrl: string | null;
  bullets: string[];
  sortOrder: number;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  liveUrl: string | null;
  repoUrl: string | null;
  iconClass: string;
  tags: string[];
  sortOrder: number;
}

export interface AddCommentRequest {
  authorName: string;
  authorEmail?: string;
  body: string;
  parentId?: string | null;
}

export interface ReactRequest {
  emojiLabel: 'like' | 'dislike' | 'love' | 'celebrate';
}

// ── STATIC CV DATA (fallback / initial state) ─────────────────
export const STATIC_CV: Partial<CVProfile> = {
  firstName: 'Sreemonta',
  lastName: 'Bhowmik',
  role: 'Senior Full-Stack Developer (.NET / ASP.NET Core / Web API / Angular / SQL Server)',
  address: 'Dubai, UAE',
  mobileNumber: '+971 505518307',
  email: 'sreemonta.bhowmik@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/sreemonta-bhowmik-92b89320',
  gitHubUrl: 'https://github.com/sreemonta20',
  portfolioUrl: 'https://sreemonta.netlify.app',
  availability: 'Immediate',
  visaStatus: 'Spouse visa (own visa), UAE',
  languages: 'English, Hindi, Bengali',
  professionalSummary: `Senior Full-Stack Developer with 12+ years of experience building and supporting enterprise solutions across apparel, ISP, biometric, healthcare, insurance, and government-facing platforms, plus apparel/manufacturing ERP systems. Strong in backend-heavy delivery — ASP.NET Core/Web API, clean business logic, secure integrations, and SQL Server performance tuning — paired with modern Angular frontends. Recent work includes Dubai Health charity systems (public Charity Portal + internal workflows), including secure authentication/SSO integrations (UAE Pass/IDAM) and API gateway usage (Ocelot). Currently upskilling in Azure and practical GenAI prompting for certification exams. Actively seeking a full-time role in UAE/GCC.`,
  skillCategories: [
    { id:'1', name:'.NET & Backend', iconClass:'bi-code-slash', sortOrder:1, skills:[
      {id:'1a',skillCategoryId:'1',name:'C#',sortOrder:1},{id:'1b',skillCategoryId:'1',name:'ASP.NET Core',sortOrder:2},
      {id:'1c',skillCategoryId:'1',name:'Web API',sortOrder:3},{id:'1d',skillCategoryId:'1',name:'MVC',sortOrder:4},
      {id:'1e',skillCategoryId:'1',name:'Entity Framework Core',sortOrder:5},{id:'1f',skillCategoryId:'1',name:'LINQ',sortOrder:6},
      {id:'1g',skillCategoryId:'1',name:'Dependency Injection',sortOrder:7},{id:'1h',skillCategoryId:'1',name:'SOLID',sortOrder:8},
      {id:'1i',skillCategoryId:'1',name:'Design Patterns',sortOrder:9}
    ]},
    { id:'2', name:'Frontend', iconClass:'bi-browser-chrome', sortOrder:2, skills:[
      {id:'2a',skillCategoryId:'2',name:'Angular 8–16+',sortOrder:1},{id:'2b',skillCategoryId:'2',name:'TypeScript',sortOrder:2},
      {id:'2c',skillCategoryId:'2',name:'JavaScript',sortOrder:3},{id:'2d',skillCategoryId:'2',name:'HTML',sortOrder:4},
      {id:'2e',skillCategoryId:'2',name:'CSS / SCSS',sortOrder:5},{id:'2f',skillCategoryId:'2',name:'RxJS',sortOrder:6},
      {id:'2g',skillCategoryId:'2',name:'Component-driven UI',sortOrder:7}
    ]},
    { id:'3', name:'Databases', iconClass:'bi-database', sortOrder:3, skills:[
      {id:'3a',skillCategoryId:'3',name:'SQL Server',sortOrder:1},{id:'3b',skillCategoryId:'3',name:'T-SQL',sortOrder:2},
      {id:'3c',skillCategoryId:'3',name:'Stored Procedures',sortOrder:3},{id:'3d',skillCategoryId:'3',name:'Indexing & Tuning',sortOrder:4},
      {id:'3e',skillCategoryId:'3',name:'RDLC/SSRS',sortOrder:5},{id:'3f',skillCategoryId:'3',name:'Crystal Reports',sortOrder:6}
    ]},
    { id:'4', name:'DevOps & Cloud', iconClass:'bi-cloud', sortOrder:4, skills:[
      {id:'4a',skillCategoryId:'4',name:'Docker',sortOrder:1},{id:'4b',skillCategoryId:'4',name:'Azure App Service',sortOrder:2},
      {id:'4c',skillCategoryId:'4',name:'Azure DevOps',sortOrder:3},{id:'4d',skillCategoryId:'4',name:'IIS',sortOrder:4},
      {id:'4e',skillCategoryId:'4',name:'CI/CD',sortOrder:5}
    ]},
    { id:'5', name:'Security & Tools', iconClass:'bi-shield-check', sortOrder:5, skills:[
      {id:'5a',skillCategoryId:'5',name:'OAuth2/OIDC',sortOrder:1},{id:'5b',skillCategoryId:'5',name:'JWT',sortOrder:2},
      {id:'5c',skillCategoryId:'5',name:'SSO',sortOrder:3},{id:'5d',skillCategoryId:'5',name:'UAE Pass/IDAM',sortOrder:4},
      {id:'5e',skillCategoryId:'5',name:'Git',sortOrder:5},{id:'5f',skillCategoryId:'5',name:'Jira',sortOrder:6},
      {id:'5g',skillCategoryId:'5',name:'Postman/Swagger',sortOrder:7}
    ]},
    { id:'6', name:'Architecture', iconClass:'bi-diagram-3', sortOrder:6, skills:[
      {id:'6a',skillCategoryId:'6',name:'Microservices Design',sortOrder:1},{id:'6b',skillCategoryId:'6',name:'REST/SOAP',sortOrder:2},
      {id:'6c',skillCategoryId:'6',name:'API Gateway (Ocelot)',sortOrder:3},{id:'6d',skillCategoryId:'6',name:'Auth/Authorization',sortOrder:4},
      {id:'6e',skillCategoryId:'6',name:'RBAC',sortOrder:5}
    ]}
  ],
  softSkills: [
    {id:'ss1',name:'Team Leadership & Mentorship',iconClass:'bi-people-fill',sortOrder:1},
    {id:'ss2',name:'Analytical Thinking & Problem Solving',iconClass:'bi-lightbulb-fill',sortOrder:2},
    {id:'ss3',name:'Effective Communication & Collaboration',iconClass:'bi-chat-dots-fill',sortOrder:3},
    {id:'ss4',name:'Agile & Scrum Practices',iconClass:'bi-arrow-repeat',sortOrder:4}
  ]
};
