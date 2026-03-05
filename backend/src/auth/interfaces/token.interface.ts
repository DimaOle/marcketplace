export interface accessToken {
  accessToken: string;
}

export interface refreshToken {
  refreshToken: string;
}

export interface refreshTokenWhithSid extends refreshToken {
  sid: string;
}

export interface ILoginOptions {
  id: string;
  email: string;
  role: string;
  userAgent?: string;
  ip?: string;
  sid?: string;
}

export interface ISavedRefreshTokenOption {
  id: string;
  refreshToken: string;
  userAgent: string;
  ip: string;
  userId: string;
}

export interface IUpdatedRefreshTokenOption {
  sid: string;
  refreshToken: string;
  newSid: string;
}

export interface payloadOfSession {
  sid: string;
  userId: string;
}
