import type { ScanRecord } from './types';

// Seed history so the dashboard + history page are populated on first load.
export const SEED_HISTORY: ScanRecord[] = [
  {
    id: 'seed-1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    label: 'Bank impersonation',
    type: 'EMAIL',
    score: 94,
    level: 'HIGH',
    preview: 'URGENT: Your bank account will be suspended today. Verify your account immediately...',
  },
  {
    id: 'seed-2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    label: 'Prize scam',
    type: 'MESSAGE',
    score: 88,
    level: 'HIGH',
    preview: 'Congratulations! You have won ₹50,00,000 in our lucky draw. Pay ₹2,999 processing fee...',
  },
  {
    id: 'seed-3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    label: 'Suspicious login',
    type: 'EMAIL',
    score: 72,
    level: 'MEDIUM',
    preview: 'We detected a suspicious login attempt. Verify it was you by clicking this link...',
  },
  {
    id: 'seed-4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    label: 'Marketing message',
    type: 'MESSAGE',
    score: 18,
    level: 'LOW',
    preview: 'Mega sale! Up to 70% off this weekend only. Tap to shop now on our official store.',
  },
  {
    id: 'seed-5',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    label: 'Verified notification',
    type: 'MESSAGE',
    score: 5,
    level: 'SAFE',
    preview: 'Your electricity bill of ₹1,240 is due on 20 August. Pay through the official app.',
  },
  {
    id: 'seed-6',
    date: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    label: 'OTP harvesting',
    type: 'MESSAGE',
    score: 97,
    level: 'CRITICAL',
    preview: 'Your account has been selected for verification. Send the OTP to our support representative...',
  },
  {
    id: 'seed-7',
    date: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    label: 'Fake delivery link',
    type: 'URL',
    score: 81,
    level: 'HIGH',
    preview: 'http://track-parcel-urgent.xyz/verify?ref=IN8842 — your package is on hold. Confirm address.',
  },
  {
    id: 'seed-8',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    label: 'Investment offer',
    type: 'MESSAGE',
    score: 76,
    level: 'HIGH',
    preview: 'Double your money in 7 days. Guaranteed returns. Invest ₹10,000 today, limited seats.',
  },
];

// 7-day threat detection trend (detected count per day, oldest first)
export const SEED_TREND: { day: string; detected: number; scanned: number }[] = [
  { day: 'Mon', detected: 6, scanned: 14 },
  { day: 'Tue', detected: 9, scanned: 18 },
  { day: 'Wed', detected: 4, scanned: 11 },
  { day: 'Thu', detected: 11, scanned: 22 },
  { day: 'Fri', detected: 7, scanned: 16 },
  { day: 'Sat', detected: 13, scanned: 24 },
  { day: 'Sun', detected: 8, scanned: 22 },
];
