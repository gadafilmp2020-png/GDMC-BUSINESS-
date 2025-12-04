import { TreeNode, Transaction, User, AppNotification } from './types';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'Alex Sterling',
  rank: 'Diamond Executive',
  avatar: 'https://picsum.photos/150/150?random=1',
  joinDate: '2023-11-15',
  totalSales: 145000,
  personalVolume: 5200,
};

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', type: 'Matching Bonus', amount: 1250.00, date: '2025-05-15', status: 'Completed' },
  { id: 'tx-2', type: 'Direct Referral Bonus', amount: 500.00, date: '2025-05-14', status: 'Completed' },
  { id: 'tx-3', type: 'Leadership Bonus', amount: 120.00, date: '2025-05-12', status: 'Pending' },
  { id: 'tx-4', type: 'Matching Bonus', amount: 340.50, date: '2025-05-10', status: 'Completed' },
  { id: 'tx-5', type: 'Level Bonus', amount: 1000.00, date: '2025-05-01', status: 'Completed' },
  { id: 'tx-6', type: 'Direct Referral Bonus', amount: 85.00, date: '2025-04-28', status: 'Pending' },
  { id: 'tx-7', type: 'Withdrawal', amount: 2100.00, date: '2025-04-25', status: 'Completed' },
  { id: 'tx-8', type: 'Direct Referral Bonus', amount: 45.00, date: '2025-04-20', status: 'Completed' },
  { id: 'tx-9', type: 'Leadership Bonus', amount: 150.00, date: '2025-04-15', status: 'Completed' },
  { id: 'tx-10', type: 'Matching Bonus', amount: 980.00, date: '2025-04-10', status: 'Completed' },
];

export const NETWORK_DATA: TreeNode = {
  id: "root-1",
  type: "user",
  status: "active",
  name: "Alex Sterling",
  rank: "Diamond",
  sales: "$145k",
  avatar: "https://picsum.photos/60/60?random=1",
  children: [
    {
      id: "u-2",
      type: "user",
      status: "active",
      name: "Sarah Connors",
      rank: "Gold",
      sales: "$42k",
      avatar: "https://picsum.photos/60/60?random=2",
      children: [
        { 
          id: "u-4",
          type: "user",
          status: "active",
          name: "Mike Ross", 
          rank: "Silver", 
          sales: "$12k", 
          avatar: "https://picsum.photos/60/60?random=3",
          children: []
        },
        { 
          id: "u-5",
          type: "user",
          status: "active",
          name: "Rachel Green", 
          rank: "Silver", 
          sales: "$15k", 
          avatar: "https://picsum.photos/60/60?random=4",
          children: [] 
        }
      ]
    },
    {
      id: "u-3",
      type: "user",
      status: "active",
      name: "John Wick",
      rank: "Platinum",
      sales: "$88k",
      avatar: "https://picsum.photos/60/60?random=5",
      children: [
        {
          id: "u-6",
          type: "user",
          status: "active",
          name: "Neo Anderson",
          rank: "Gold",
          sales: "$35k",
          avatar: "https://picsum.photos/60/60?random=6",
          children: []
        },
        { 
          id: "u-7",
          type: "user",
          status: "active",
          name: "Ellen Ripley", 
          rank: "Gold", 
          sales: "$28k", 
          avatar: "https://picsum.photos/60/60?random=9",
          children: []
        }
      ]
    }
  ]
};

// Combined dataset for historical (actual) and future (projected) earnings
// Null 'actual' values indicate future months
export const ANALYTICS_DATA = [
  { month: 'Jan', actual: 4200, projected: 4100 },
  { month: 'Feb', actual: 3800, projected: 4300 },
  { month: 'Mar', actual: 5500, projected: 5200 },
  { month: 'Apr', actual: 4800, projected: 5600 },
  { month: 'May', actual: 7200, projected: 6800 },
  { month: 'Jun', actual: 8500, projected: 8500 }, // Intersection point
  { month: 'Jul', actual: null, projected: 9800 },
  { month: 'Aug', actual: null, projected: 11200 },
  { month: 'Sep', actual: null, projected: 12500 },
  { month: 'Oct', actual: null, projected: 14000 },
];

export const MOCK_EARNINGS_DATA = ANALYTICS_DATA; // Fallback alias

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { 
    id: 'n1', 
    type: 'success', 
    title: 'Rank Achievement Unlocked!', 
    message: 'Congratulations! You have officially hit Diamond Executive status.', 
    timestamp: '2 mins ago', 
    read: false 
  },
  { 
    id: 'n2', 
    type: 'info', 
    title: 'New Member Joined', 
    message: 'Sarah Jones has been placed in your left binary leg.', 
    timestamp: '1 hour ago', 
    read: false 
  },
  { 
    id: 'n3', 
    type: 'warning', 
    title: 'Commission Alert', 
    message: 'Your monthly commission of $1,250.00 is ready for withdrawal.', 
    timestamp: '4 hours ago', 
    read: false 
  },
  { 
    id: 'n4', 
    type: 'alert', 
    title: 'System Maintenance', 
    message: 'Scheduled maintenance tonight at 02:00 AM UTC. Please save your work.', 
    timestamp: '1 day ago', 
    read: true 
  },
];