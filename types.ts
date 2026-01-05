
export interface User {
  username: string;
  password_hash: string; 
  totp_secret?: string;   // 16-character secret
  totp_enabled: 'Y' | 'N';
  registered_device_id?: string; // Captured device fingerprint
  password_reset_required: boolean; // True for first-time users
  createdAt: string;
}

// Simulated Admin "Master List"
export interface AdminUserRecord {
  username: string;
  password_hash: string;
}

export type AuthStage = 'LOGIN' | 'QR_SETUP' | 'OTP_CHALLENGE' | 'AUTHENTICATED';
