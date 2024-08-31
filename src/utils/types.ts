export enum USER_TYPES {
  ADMIN = "ADMIN",
  TEAM_MEMBER = "TEAM_MEMBER",
}
export enum SUBMISSION_STATUS {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerifiedUser: boolean;
}

export interface Product {
  _id: string;
  productName: string;
  price: string;
  image: string;
  productDescription: string;
  department: string;
  id: string;
}

export interface PendingReview {
  _id: string;
  refProduct: Product;
  productName: string;
  price: number;
  image: string;
  productDescription: string;
  department: string;
  teamMember: UserInterface;
  status: string;
  createdAt: string;
}
