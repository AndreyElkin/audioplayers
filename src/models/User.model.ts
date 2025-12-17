export interface User {
  username: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

