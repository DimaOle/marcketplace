export interface ITokenParamsSelectOption {
  id?: boolean;
  refreshToken?: boolean;
  userId?: boolean;
}

export interface IFindTokensParms {
  id?: string;
  refreshToken?: string;
  userId?: string;
}

export type TokensType = 'id' | 'refreshToken' | 'userAgent' | 'ip' | 'userId';
export type TokenTypeUnique = 'id';

export interface IDeleteTokensOptions {
  param: TokensType;
  value: string[];
}
