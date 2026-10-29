import crypto from 'crypto'

export function generate0TPCode() {
    return crypto.randomInt(100000, 999999).toString();
} 