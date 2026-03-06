export interface IJwtRefreshPayload {
  sid: string;
  userId: string;
}

export interface IJwtAccessPayload {
  email: string;
  userId: string;
  role: string;
}
