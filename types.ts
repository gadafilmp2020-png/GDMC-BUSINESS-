export interface User {
  id: string;
  name: string;
  rank: string;
  avatar: string;
  joinDate: string;
  totalSales: number;
  personalVolume: number;
}

export interface TreeNode {
  id: string;
  type: 'user' | 'empty';
  status: 'active' | 'pending';
  name: string;
  rank?: string;
  sales?: string;
  avatar?: string;
  children?: TreeNode[];
  _children?: TreeNode[]; // For hidden/collapsed state
  
  // Registration Data
  email?: string;
  phone?: string;
  gender?: string;
  address?: string;
  joinDate?: string;
}

export interface Transaction {
  id: string;
  type: 'Direct Referral Bonus' | 'Matching Bonus' | 'Leadership Bonus' | 'Level Bonus' | 'Withdrawal' | 'Wallet Transfer';
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  NETWORK = 'NETWORK',
  WALLET = 'WALLET',
  AI_COACH = 'AI_COACH',
  SETTINGS = 'SETTINGS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}