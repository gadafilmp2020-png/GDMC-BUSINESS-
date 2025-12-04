import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Calendar, Filter, Download, Clock, CheckCircle2, Users, GitMerge, Award, Layers, CreditCard, Info, X, Loader2 } from 'lucide-react';
import { RECENT_TRANSACTIONS } from '../constants';
import { Transaction } from '../types';

const Wallet: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Local state for transactions to allow adding new withdrawals
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);

  // Withdrawal Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Balances
  // Total completed income (excluding withdrawals)
  const totalCompleted = transactions
    .filter(t => t.status === 'Completed' && t.type !== 'Withdrawal')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  // Total withdrawn (Completed)
  const totalWithdrawn = transactions
    .filter(t => t.status === 'Completed' && t.type === 'Withdrawal')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Pending withdrawals (Deduct from available to prevent double requests)
  const totalPendingWithdrawals = transactions
    .filter(t => t.status === 'Pending' && t.type === 'Withdrawal')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const availableBalance = totalCompleted - totalWithdrawn - totalPendingWithdrawals;

  // Pending Income (Incoming funds not yet cleared)
  const totalPendingIncome = transactions
    .filter(t => t.status === 'Pending' && t.type !== 'Withdrawal')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Breakdown Calculations
  const directReferralTotal = transactions
    .filter(t => t.type === 'Direct Referral Bonus' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const matchingBonusTotal = transactions
    .filter(t => t.type === 'Matching Bonus' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const leadershipBonusTotal = transactions
    .filter(t => t.type === 'Leadership Bonus' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const levelBonusTotal = transactions
    .filter(t => t.type === 'Level Bonus' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const otherBonusTotal = transactions
    .filter(t => t.type === 'Wallet Transfer' && t.status === 'Completed')
    .reduce((acc, curr) => acc + curr.amount, 0);


  // Filter Logic
  const filteredTransactions = transactions.filter(tx => {
    if (!startDate && !endDate) return true;
    const txDate = new Date(tx.date);
    const start = startDate ? new Date(startDate) : new Date('2000-01-01');
    const end = endDate ? new Date(endDate) : new Date();
    return txDate >= start && txDate <= end;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleWithdrawRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount <= 0) return;
    if (amount > availableBalance) return; 

    setIsSubmitting(true);
    
    // Simulate Network Request
    setTimeout(() => {
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            type: 'Withdrawal',
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        };
        
        setTransactions(prev => [newTx, ...prev]);
        setIsSubmitting(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-slate-800 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletIcon size={80} className="text-emerald-400" />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-400 text-sm font-medium mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} /> Available Balance
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <button 
                onClick={() => setShowWithdrawModal(true)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
            >
              Request Withdrawal
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={80} className="text-yellow-400" />
          </div>
          <div className="relative z-10">
             <p className="text-yellow-400 text-sm font-medium mb-1 flex items-center gap-2">
              <Clock size={16} /> Pending Clearance
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">${totalPendingIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <p className="text-slate-500 text-sm">Processing usually takes 2-3 business days.</p>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
             <span className="text-slate-400 font-medium">Next Payout</span>
             <span className="text-white font-bold">Jun 15, 2025</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mb-2 overflow-hidden">
             <div className="bg-cyan-500 w-[65%] h-full rounded-full"></div>
          </div>
          <p className="text-xs text-slate-500 text-right">15 days remaining in cycle</p>
        </div>
      </div>

      {/* Plan Details Card */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Info size={20} className="text-blue-400" />
            Active Commission Rates
        </h3>
        <div className="flex flex-wrap gap-6">
            <div className="bg-slate-800/50 px-5 py-4 rounded-xl border border-white/5 flex items-center gap-4 min-w-[200px]">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <Users size={20} />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Direct Referral</p>
                    <p className="text-2xl font-bold text-white">$2.00 <span className="text-xs font-normal text-slate-500">/ user</span></p>
                </div>
            </div>
            <div className="bg-slate-800/50 px-5 py-4 rounded-xl border border-white/5 flex items-center gap-4 min-w-[200px]">
                <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <GitMerge size={20} />
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Matching Bonus</p>
                    <p className="text-2xl font-bold text-white">$4.00 <span className="text-xs font-normal text-slate-500">/ pair</span></p>
                </div>
            </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Commission Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Direct Referral</p>
              <p className="text-lg font-bold text-white">${directReferralTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <GitMerge size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Matching Bonus</p>
              <p className="text-lg font-bold text-white">${matchingBonusTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Leadership Bonus</p>
              <p className="text-lg font-bold text-white">${leadershipBonusTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Level Bonus</p>
              <p className="text-lg font-bold text-white">${levelBonusTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-slate-500/20 text-slate-400 flex items-center justify-center shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Other</p>
              <p className="text-lg font-bold text-white">${otherBonusTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl flex flex-col min-h-[500px]">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Transaction History</h3>
            <p className="text-slate-400 text-sm">Monitor your earnings and payouts</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2">
                <Calendar size={16} className="text-slate-400 mr-2" />
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-32 placeholder-slate-500"
                />
                <span className="text-slate-500 mx-2">-</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-white text-sm focus:outline-none w-32"
                />
             </div>
             <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-white/5">
                <Filter size={20} />
             </button>
             <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors border border-white/5">
                <Download size={20} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/50 sticky top-0 z-10 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          tx.type === 'Matching Bonus' ? 'bg-purple-500/10 text-purple-400' :
                          tx.type === 'Direct Referral Bonus' ? 'bg-blue-500/10 text-blue-400' :
                          tx.type === 'Leadership Bonus' ? 'bg-amber-500/10 text-amber-400' :
                          tx.type === 'Level Bonus' ? 'bg-cyan-500/10 text-cyan-400' :
                          tx.type === 'Withdrawal' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {tx.type === 'Withdrawal' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{tx.type}</p>
                          <p className="text-xs text-slate-500">ID: #{tx.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(tx.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tx.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {tx.status === 'Completed' ? (
                          <CheckCircle2 size={12} className="mr-1.5" />
                        ) : (
                          <Clock size={12} className="mr-1.5" />
                        )}
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${
                        tx.type === 'Withdrawal' ? 'text-rose-400' : 
                        tx.status === 'Completed' ? 'text-white' : 'text-slate-400'
                      }`}>
                        {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Withdrawal Modal */}
       {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-1">Request Withdrawal</h3>
              <p className="text-slate-400 text-sm mb-6">Transfer funds to your linked bank account.</p>
              
              <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-6">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Available to Withdraw</p>
                <p className="text-2xl font-bold text-emerald-400">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>

              <form onSubmit={handleWithdrawRequest}>
                 <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input 
                            type="number" 
                            step="0.01"
                            max={availableBalance}
                            min="1"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder-slate-600"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    {parseFloat(withdrawAmount) > availableBalance && (
                        <p className="text-rose-400 text-xs mt-2 flex items-center gap-1">
                            <Info size={12} /> Insufficient funds
                        </p>
                    )}
                 </div>

                 <button 
                    type="submit"
                    disabled={isSubmitting || !withdrawAmount || parseFloat(withdrawAmount) > availableBalance || parseFloat(withdrawAmount) <= 0}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Confirm Withdrawal'
                    )}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;