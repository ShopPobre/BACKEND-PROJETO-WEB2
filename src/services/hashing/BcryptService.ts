import { IHashingService } from "../../interfaces/hashing/IHashingService";
import * as bcrypt from 'bcrypt';

export class BcryptService extends IHashingService {

    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
    
}