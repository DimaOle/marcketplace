import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hashData(value: string, salt: number): Promise<string> {
    const hashValue = await bcrypt.hash(value, salt);
    return hashValue;
  }

  async compareData(data: string, hashData: string): Promise<boolean> {
    const compareValue = await bcrypt.compare(data, hashData);
    return compareValue;
  }
}
