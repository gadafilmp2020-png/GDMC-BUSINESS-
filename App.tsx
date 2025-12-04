import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Network, Wallet, Sparkles, Settings as SettingsIcon, LogOut, Menu, X, Bell, User as UserIcon, Check, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import NetworkTree from './components/NetworkTree';
import AiCoach from './components/AiCoach';
import Settings from './components/Settings';
import WalletComponent from './components/Wallet';
import { NETWORK_DATA, CURRENT_USER, MOCK_NOTIFICATIONS } from './constants';
import { AppView, User, AppNotification } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // User state with local storage persistence
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const handleUpdateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('nexus_user', JSON.stringify(updatedUser));
  };

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Authentication Handler
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Navigation Items
  const navItems = [
    { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: AppView.NETWORK, icon: Network, label: 'Genealogy' },
    { id: AppView.AI_COACH, icon: Sparkles, label: 'AI Coach' },
    { id: AppView.WALLET, icon: Wallet, label: 'E-Wallet' },
    { id: AppView.SETTINGS, icon: SettingsIcon, label: 'Settings' },
  ];

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch(type) {
      case 'success': return <Check className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default: return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 px-6 h-20 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <span className="font-bold text-white">N</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus 2025</span>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.id === AppView.AI_COACH && (
                <span className="ml-auto px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] rounded-full font-bold">NEW</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 px-6 lg:px-8 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center justify-between z-30 relative">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white capitalize">
              {currentView === AppView.NETWORK ? 'Interactive Genealogy' : currentView.replace('_', ' ').toLowerCase()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 transition-colors ${isNotificationOpen ? 'text-white bg-white/5 rounded-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 animate-fade-in">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50 backdrop-blur-sm">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <button 
                        onClick={markAllRead}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          <Bell size={24} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((note) => (
                          <div 
                            key={note.id}
                            onClick={() => markAsRead(note.id)}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${note.read ? 'opacity-60 bg-transparent' : 'bg-slate-800/30'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              note.type === 'success' ? 'bg-emerald-500/10' : 
                              note.type === 'warning' ? 'bg-yellow-500/10' :
                              note.type === 'alert' ? 'bg-rose-500/10' : 'bg-cyan-500/10'
                            }`}>
                              {getNotificationIcon(note.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-medium ${note.read ? 'text-slate-400' : 'text-white'}`}>{note.title}</h4>
                                { !note.read && <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5"></span> }
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{note.message}</p>
                              <p className="text-[10px] text-slate-500 mt-2 font-medium">{note.timestamp}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-slate-800/30 text-center border-t border-white/5">
                      <button className="text-xs text-slate-400 hover:text-white transition-colors">
                        View Notification History
                      </button>
                    </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white">{user.name}</div>
                <div className="text-xs text-cyan-400">{user.rank}</div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          {currentView === AppView.DASHBOARD && <Dashboard user={user} />}
          
          {currentView === AppView.NETWORK && (
            <div className="h-full flex flex-col">
               <div className="mb-4 flex items-center justify-between">
                 <h2 className="text-lg text-slate-400">Team Structure Visualizer</h2>
                 <div className="flex gap-2">
                   <button className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition">Export PDF</button>
                 </div>
               </div>
               <div className="flex-1 min-h-[500px]">
                 <NetworkTree data={NETWORK_DATA} />
               </div>
            </div>
          )}

          {currentView === AppView.AI_COACH && <AiCoach />}

          {currentView === AppView.WALLET && <WalletComponent />}

          {currentView === AppView.SETTINGS && (
            <Settings user={user} onUpdateUser={handleUpdateUser} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;