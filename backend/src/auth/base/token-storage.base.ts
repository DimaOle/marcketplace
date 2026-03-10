import { ISaveOption, IUpdateOption } from '../interfaces';

export abstract class TokenStorage {
  abstract save(data: ISaveOption): Promise<void>;
  abstract update(data: IUpdateOption): Promise<void>;
  abstract findUnique(sid: string): Promise<any>;
  abstract deleteOldSessions(userId: string, limit?: number): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
  abstract deleteAllById(arrId: string[]): Promise<void>;
}
