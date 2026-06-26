export interface ChildService {
  title: string;
  image?: string;
  description?: string;
}

export interface Service {
  _id: string;
  title: string;
  coverImage?: string;
  children: ChildService[];
  createdAt?: string;
  updatedAt?: string;
}
