
import { User, AdminUserRecord } from '../types';
import CryptoJS from 'crypto-js';

const ADMIN_STORE_KEY = 'secure_auth_admin_users';
const CUSTOM_DB_STORE_KEY = 'secure_auth_custom_db';

export const dbService = {
  // --- Admin Logic ---
  getAdminUsers: (): AdminUserRecord[] => {
    const data = localStorage.getItem(ADMIN_STORE_KEY);
    let users: AdminUserRecord[] = data ? JSON.parse(data) : [];
    
    // Seed with initial admin/admin hash if empty
    if (users.length === 0) {
      const adminHash = CryptoJS.SHA256('admin').toString();
      users = [{ username: 'admin', password_hash: adminHash }];
      localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(users));
    }
    return users;
  },

  createAdminUser: (username: string, password_plain: string): void => {
    const users = dbService.getAdminUsers();
    if (users.find(u => u.username === username)) return;
    
    // Hash immediately so plain text is never stored
    const password_hash = CryptoJS.SHA256(password_plain).toString();
    users.push({ username, password_hash });
    localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(users));
  },

  updateAdminPassword: (username: string, newPasswordHash: string): void => {
    const users = dbService.getAdminUsers();
    const index = users.findIndex(u => u.username === username);
    if (index >= 0) {
      users[index].password_hash = newPasswordHash;
      localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(users));
    }
  },

  // --- Custom DB Logic ---
  getCustomUser: (username: string): User | null => {
    const data = localStorage.getItem(CUSTOM_DB_STORE_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    return users.find(u => u.username === username) || null;
  },

  saveCustomUser: (user: User): void => {
    const data = localStorage.getItem(CUSTOM_DB_STORE_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    const index = users.findIndex(u => u.username === user.username);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(CUSTOM_DB_STORE_KEY, JSON.stringify(users));
  },

  hashPassword: (password: string): string => {
    return CryptoJS.SHA256(password).toString();
  },

  generateSecret: (username: string, passwordHash: string): string => {
    const seed = username + passwordHash + "SECURE_TOTP_SALT_2025";
    const hash = CryptoJS.SHA256(seed).toString();
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 16; i++) {
      const hexPart = hash.substring(i * 2, i * 2 + 2);
      const val = parseInt(hexPart, 16) % 32;
      secret += base32chars.charAt(val);
    }
    return secret;
  },

  /**
   * Generates a unique "Device Fingerprint" based on the current environment.
   */
  getDeviceFingerprint: (): string => {
    const ua = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const rawId = `${ua}-${screen}`;
    // Hash it for a clean Hex ID
    return CryptoJS.SHA256(rawId).toString().substring(0, 12).toUpperCase();
  }
};
