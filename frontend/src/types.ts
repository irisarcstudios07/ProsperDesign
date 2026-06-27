// ── DB-backed types (MongoDB / Admin panel) ──────────────────────────────

export interface GalleryImage {
  url: string;
  caption?: string;
  description?: string;
}

export interface ChildService {
  title: string;
  coverImage?: string;
  description?: string;
  features?: string[];
  gallery?: GalleryImage[];
}

export interface Service {
  _id: string;
  title: string;
  coverImage?: string;
  children: ChildService[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  thumbnail?: string;
  coverImage?: string;
  video?: string;
  images?: string[];
  galleryImages?: string[];
  location?: string;
  area?: string;
  completion?: string;
  materials?: string;
  year?: string;
  services?: string[];
  featured?: boolean;
  visibility?: boolean;
  createdAt?: string;
}

export interface Client {
  _id: string;
  name: string;
  order: number;
  active: boolean;
  createdAt?: string;
}

