import * as bcrypt from 'bcrypt';

export function hashPassword(rawPass: string) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(rawPass, SALT);
}

export function comparePassword(rawPass: string, hash: string) {
    return bcrypt.compareSync(rawPass, hash);
}



