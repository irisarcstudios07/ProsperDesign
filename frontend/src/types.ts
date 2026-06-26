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

export interface Client {
  _id: string;
  name: string;
  order: number;
  active: boolean;
  createdAt?: string;
}
