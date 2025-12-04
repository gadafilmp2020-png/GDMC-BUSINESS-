import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Save, Upload, User as UserIcon, Award, CheckCircle, Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    rank: user.rank,
    avatar: user.avatar,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData({
      name: user.name,
      rank: user.rank,
      avatar: user.avatar,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                <p className="text-slate-400 text-sm mt-1">Manage your public profile and account preferences</p>
            </div>
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                <SettingsIcon className="w-6 h-6 text-cyan-400" />
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-white/5">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Upload className="text-white w-8 h-8" />
                    </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                    <label className="block text-sm font-medium text-slate-300">Avatar URL</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder-slate-600"
                            placeholder="https://..."
                        />
                         <p className="mt-2 text-xs text-slate-500">Paste an image URL from the web.</p>
                    </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Display Rank</label>
                    <div className="relative">
                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            name="rank"
                            value={formData.rank}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 flex items-center gap-4">
                <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                >
                    <Save size={20} />
                    Save Changes
                </button>
                
                {isSaved && (
                    <div className="flex items-center gap-2 text-emerald-400 transition-all duration-300">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">Changes saved successfully!</span>
                    </div>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;