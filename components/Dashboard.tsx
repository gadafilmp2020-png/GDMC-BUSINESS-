import React from 'react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Users, DollarSign, TrendingUp, Award, ArrowUpRight, Sparkles, BrainCircuit } from 'lucide-react';
import { ANALYTICS_DATA, RECENT_TRANSACTIONS } from '../constants';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // Calculate some derived stats
  const currentMonthEarnings = ANALYTICS_DATA.find(d => d.month === 'Jun')?.actual || 0;
  const nextMonthProjection = ANALYTICS_DATA.find(d => d.month === 'Jul')?.projected || 0;
  const growthRate = ((nextMonthProjection - currentMonthEarnings) / currentMonthEarnings) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={60} className="text-cyan-400" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <DollarSign size={20} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Total Earnings</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">${user.totalSales.toLocaleString()}</div>
          <div className="flex items-center text-emerald-400 text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            +12.5% vs last month
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <BrainCircuit size={60} className="text-purple-400" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Sparkles size={20} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Projected (Jul)</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">${nextMonthProjection.toLocaleString()}</div>
          <div className="flex items-center text-purple-400 text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            AI Forecast: +{growthRate.toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={60} className="text-yellow-400" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
              <Award size={20} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Current Rank</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{user.rank}</div>
          <div className="text-slate-500 text-xs">Next Level: 85% Completed</div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full w-[85%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-5 rounded-2xl relative overflow-hidden group hover:border-pink-500/30 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={60} className="text-pink-400" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Group Volume</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{user.personalVolume.toLocaleString()} PV</div>
          <div className="flex items-center text-emerald-400 text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            Qualifies for Bonus
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Predictive Earnings Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-semibold text-white">Predictive Earnings Intelligence</h3>
                <p className="text-sm text-slate-400">Historical performance vs. AI-generated future projections</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-900/50 px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400">AI Model Active</span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}} 
                  itemStyle={{color: '#fff'}}
                  formatter={(value: number, name: string) => [`$${value}`, name]}
                  labelStyle={{color: '#94a3b8', marginBottom: '0.5rem'}}
                />
                <Legend iconType="circle" verticalAlign="top" height={36} wrapperStyle={{top: -5}} />
                
                {/* Future Projection Area (Bottom Layer) */}
                <Area 
                    type="monotone" 
                    dataKey="projected" 
                    name="AI Projection" 
                    stroke="#a855f7" 
                    fill="url(#colorProjected)" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                />

                {/* Actual Earnings Area (Top Layer) */}
                <Area 
                    type="monotone" 
                    dataKey="actual" 
                    name="Actual Revenue" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorActual)" 
                />
                
                {/* Connection Points */}
                <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="none" 
                    dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Recent Activity */}
        <div className="space-y-6">
            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                
                <h3 className="flex items-center gap-2 text-white font-semibold mb-4 relative z-10">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Growth Insights
                </h3>
                
                <div className="space-y-4 relative z-10">
                    <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                        <p className="text-sm text-slate-300">
                            Based on current recruitment velocity, you are on track to hit <span className="text-white font-medium">Double Diamond</span> by August.
                        </p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></div>
                        <p className="text-sm text-slate-300">
                            Your "Leg 2" volume has increased by 15%, balancing your binary tree perfectly.
                        </p>
                    </div>
                </div>

                <button className="w-full mt-5 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm font-medium transition-colors">
                    View Detailed Report
                </button>
            </div>

            {/* Recent Payouts */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex flex-col flex-1 h-[240px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Recent Payouts</h3>
                    <button className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">View All</button>
                </div>
                
                <div className="space-y-4 flex-1 overflow-auto pr-2 custom-scrollbar">
                    {RECENT_TRANSACTIONS.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            tx.type === 'Matching Bonus' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30' :
                            tx.type === 'Direct Referral Bonus' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' :
                            tx.type === 'Withdrawal' ? 'bg-rose-500/20 text-rose-400 group-hover:bg-rose-500/30' :
                            'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30'
                        }`}>
                            <DollarSign size={14} />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-white">{tx.type}</div>
                            <div className="text-[10px] text-slate-500">{tx.date}</div>
                        </div>
                        </div>
                        <div className="text-right">
                        <div className={`text-sm font-bold ${tx.type === 'Withdrawal' ? 'text-rose-400' : 'text-white'}`}>
                            {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                        </div>
                        <div className={`text-[10px] ${
                            tx.status === 'Completed' ? 'text-emerald-400' : 'text-yellow-400'
                        }`}>
                            {tx.status}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;