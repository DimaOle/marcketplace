export interface ISaveOption {
  id: string;
  refreshToken: string;
  userAgent: string;
  ip: string;
  userId: string;
}

export interface IUpdateOption {
  sid: string;
  refreshToken: string;
  newSid: string;
}
