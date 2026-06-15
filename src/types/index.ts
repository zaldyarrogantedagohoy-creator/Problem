export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  title: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  verified: boolean;
  verifiedFields: VerifiedField[];
  followers: number;
  following: number;
  skills: Skill[];
  experiences: Experience[];
  certificates: Certificate[];
  projects: Project[];
  education: Education[];
  socialLinks: SocialLink[];
  joinedDate: string;
}

export interface VerifiedField {
  field: string;
  verifiedAt: string;
  verifier: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  endorsed: number;
  verified: boolean;
}

export interface Experience {
  id: string;
  company: string;
  companyLogo: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  issuedDate: string;
  expiryDate: string | null;
  credentialId: string;
  verified: boolean;
  badgeUrl: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
}

export interface Education {
  id: string;
  institution: string;
  institutionLogo: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  verified: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  images?: string[];
  type: 'update' | 'project' | 'achievement' | 'certificate';
  attachedItem?: Project | Certificate;
  likes: number;
  comments: number;
  reposts: number;
  liked: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'follow' | 'like' | 'endorse' | 'verify' | 'comment';
  avatar: string;
  name: string;
  action: string;
  time: string;
  read: boolean;
  system?: boolean;
}

export type TabType = 'landing' | 'feed' | 'explore' | 'profile' | 'network' | 'notifications';
export type ProfileTab = 'overview' | 'experience' | 'education' | 'projects' | 'certificates' | 'skills';