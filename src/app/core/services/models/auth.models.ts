export interface LoginRequest {
  // Nouveau : login (email / phone / username)
  login?: string;

  // Legacy UI/back compat
  email?: string;

  password: string;
  remember?: string | boolean;

  recaptcha_token?: string;
  recaptcha_action?: string;
}



export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface RegisterRequest {
  full_name: string;
  username?: string;
  phone: string;
  email: string;
  password: string;
  recaptcha_token?: string;
  recaptcha_action?: string;
}


export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // secondes
}

 
export interface AuthTokens {
  access_token: string;
  token_type:   string;
}
 

export interface AuthUser {
  id: string;
  email: string;
  avatar_url:string;
  full_name: string;
  username?: string;
  email_verified_at: string | null;
  phone: string;
  language?: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZATION';
  avatarUrl?: string;
  createdAt: string;
  country?: any;
  country_id?: string;
  country_code?: string;  // NEW: ISO2 code for frontend
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
