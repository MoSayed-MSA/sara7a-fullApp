import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library'
import { ApError } from '../../pkg/error/error.js';
import { env } from '../config/env.js';

export async function verifyGoogleAccount(idToken) {
    try {
        const client = new OAuth2Client({ client_ID: env.google.webClientId });
        const ticket = new client.verifyIdToken({
            idToken: idToken,
            audience: env.google.webClientId
        })
        return ticket.getPayload()
    } catch (error) {
        throw new ApError('invalid Google Token', 403)
    }
}

