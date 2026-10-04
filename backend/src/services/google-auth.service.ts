import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  photoUrl?: string;
}

class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.googleAuth.clientId,
      config.googleAuth.clientSecret,
      config.googleAuth.callbackUrl
    );
  }

  getAuthorizationUrl(state: string): string {
  return this.client.generateAuthUrl({
    scope: ['openid', 'email', 'profile'],
    state
  });
}

  async verifyAndExtractProfileFromCode(
    code: string
  ): Promise<GoogleProfile> {
    if (!code || !code.trim()) {
      throw new AppError(
        'Google authentication failed',
        401
      );
    }

    try {
      const { tokens } =
        await this.client.getToken(code);

      if (!tokens.id_token) {
        throw new AppError(
          'Google authentication failed',
          401
        );
      }

      return await this.verifyIdToken(
        tokens.id_token
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Google authentication failed during code exchange',
        401
      );
    }
  }

  async verifyIdToken(
    idToken: string
  ): Promise<GoogleProfile> {
    if (!idToken || !idToken.trim()) {
      throw new AppError(
        'Google authentication failed',
        401
      );
    }

    try {
      const ticket =
        await this.client.verifyIdToken({
          idToken,
          audience: config.googleAuth.clientId
        });

      const payload =
        ticket.getPayload();

      if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        !payload.name ||
        payload.email_verified !== true
      ) {
        throw new AppError(
          'Google authentication failed: Invalid or incomplete profile data',
          401
        );
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        photoUrl: payload.picture
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Google authentication failed: Invalid ID token',
        401
      );
    }
  }
}

export const googleAuthService =
  new GoogleAuthService();