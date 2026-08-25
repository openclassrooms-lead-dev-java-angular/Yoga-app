export interface User {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  admin: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
