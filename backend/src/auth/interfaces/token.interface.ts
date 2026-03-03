export interface accessToken {
  accessToken: string;
}

export interface refreshToken {
  refreshToken: string;
}

export interface refreshTokenWhithSid extends refreshToken {
  sid: string;
}

export type typeAuthTokensCreate = 'login' | 'register' | 'refresh';

export interface CreateTokensOptions {
  type: typeAuthTokensCreate;
  id: string;
  email: string;
  role: string;
  userAgent?: string;
  ip?: string;
  sid?: string;
}

export interface payloadOfSession {
  sid: string;
  userId: string;
}
