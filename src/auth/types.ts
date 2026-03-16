export type Role = "learner" | "teacher";

export interface FirebaseUserLike {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AppUser {
  firebaseUser: FirebaseUserLike;
  role: Role;
  displayName?: string | null;
}

export interface SignupOptions {
  name: string;
  email: string;
  password: string;
  role: Role;
}
