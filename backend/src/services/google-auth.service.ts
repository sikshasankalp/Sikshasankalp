import { OAuth2Client } from 'google-auth-library';
import { config } from '../config/env';
import { AppError } from '../errors/AppError';

/**
 * Minimal internal representation of a verified Google profile.
 * We strictly only accept and return these fields from Google.
 */
export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  photoUrl?: string;
}

class GoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      config.googleAuth.clientId,
      config.googleAuth.clientSecret,
      config.googleAuth.callbackUrl
    );
  }

  /**
   * Generates the Google OAuth authorization URL for the frontend to redirect to.
   */
  getAuthorizationUrl(): string {
    return this.client.generateAuthUrl({
      access_type: 'offline', // Request a refresh token (though we won't store it in db right now)
      prompt: 'consent',
      scope: ['openid', 'email', 'profile'],
    });
  }

  /**
   * Exchanges an authorization code for Google tokens, then verifies the ID token
   * and extracts the strict minimum profile data required for our system.
   */
  async verifyAndExtractProfileFromCode(code: string): Promise<GoogleProfile> {
    try {
      // 1. Exchange the authorization code for tokens
      const { tokens } = await this.client.getToken(code);
      
      if (!tokens.id_token) {
        throw new AppError('Google authentication failed: Missing ID token', 401);
      }

      // 2. Pass the ID token to our strictly validated parser
      return await this.verifyIdToken(tokens.id_token);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Google authentication failed during code exchange', 401);
    }
  }

  /**
   * Safely verifies a Google ID token and extracts minimal profile data.
   * This can be used if the frontend sends an ID token directly (e.g. Credential Manager API).
   */
  async verifyIdToken(idToken: string): Promise<GoogleProfile> {
    try {
      // 3. Verify the ID token using the official Google client and our configured Client ID (audience)
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: config.googleAuth.clientId,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.sub || !payload.email || !payload.name) {
        throw new AppError('Google authentication failed: Incomplete profile data from Google', 401);
      }

      // 4. Extract only the minimum required profile information
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        photoUrl: payload.picture, // Map 'picture' to our 'photoUrl' convention
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Google authentication failed: Invalid ID token', 401);
    }
  }
}

// Export a singleton instance of the service
export const googleAuthService = new GoogleAuthService();
