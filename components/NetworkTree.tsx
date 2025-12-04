import React, { useEffect, useRef, useState } from 'react';
import { 
  select, 
  zoom, 
  zoomIdentity, 
  hierarchy, 
  tree, 
  linkVertical, 
  HierarchyPointLink, 
  HierarchyPointNode 
} from 'd3';
import { TreeNode } from '../types';
import { Maximize, Plus, X, Loader2, CheckCircle, Mail, FileText, User, MapPin, Phone, AlertCircle, Search } from 'lucide-react';

interface NetworkTreeProps {
  data: TreeNode;
}

const NetworkTree: React.FC<NetworkTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Registration Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [regStatus, setRegStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    gender: 'Select Gender',
    address: '',
    email: '',
    password: ''
  });

  // Hydrate tree with empty slots to ensure binary structure
  const hydrateTree = (node: TreeNode): TreeNode => {
    const newNode = { ...node };
    
    // If it's a user, ensure it has 2 children (slots or users)
    if (newNode.type === 'user') {
      if (!newNode.children) newNode.children = [];
      
      // We need exactly 2 children for the binary visualization
      // If a child is missing, fill it with an 'empty' slot
      while (newNode.children.length < 2) {
        newNode.children.push({
          id: `empty-${Math.random().toString(36).substr(2, 9)}`,
          type: 'empty',
          status: 'active',
          name: 'Open Position',
          children: []
        });
      }

      // Recursively hydrate children
      newNode.children = newNode.children.map(hydrateTree);
    }
    
    return newNode;
  };

  // Initialize data
  useEffect(() => {
    if (data && !treeData) {
      setTreeData(hydrateTree(JSON.parse(JSON.stringify(data))));
    }
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !treeData) return;

    const width = wrapperRef.current.clientWidth;
    const height = Math.max(600, wrapperRef.current.clientHeight);
    
    const svg = select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Setup Zoom Group
    let g = svg.select<SVGGElement>(".zoom-layer");
    let zoomBehavior: any;

    if (g.empty()) {
      g = svg.append("g").attr("class", "zoom-layer");
      
      zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoomBehavior)
         .on("dblclick.zoom", null);
      
      // Center initial view
      const initialTransform = zoomIdentity.translate(width / 2, 80).scale(0.85);
      svg.call(zoomBehavior.transform, initialTransform);
    }

    // -- Layout --
    const root = hierarchy<TreeNode>(treeData);
    const treeLayout = tree<TreeNode>().nodeSize([140, 180]); // Wider spacing for binary
    treeLayout(root);

    // -- Drawing --
    
    // Links
    const links = g.selectAll<SVGPathElement, HierarchyPointLink<TreeNode>>(".link")
      .data(root.links(), d => d.target.data.id);

    links.join(
      enter => enter.append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#475569")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("d", linkVertical()
            .x(d => (d as any).x)
            .y(d => (d as any).y) as any
        )
        .attr("opacity", 0)
        .call(enter => enter.transition().duration(400).attr("opacity", 1)),
      update => update.transition().duration(400)
        .attr("d", linkVertical()
            .x(d => (d as any).x)
            .y(d => (d as any).y) as any
        ),
      exit => exit.transition().duration(200).attr("opacity", 0).remove()
    );

    // Nodes
    const nodes = g.selectAll<SVGGElement, HierarchyPointNode<TreeNode>>(".node")
      .data(root.descendants(), d => d.data.id);

    const nodeEnter = nodes.enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${(d as any).x},${(d as any).y})`)
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.data.type === 'empty') {
            setSelectedSlotId(d.data.id);
            setShowModal(true);
            setRegStatus('idle');
            setFormData({ fullname: '', phone: '', gender: 'Select Gender', address: '', email: '', password: '' });
        } else if (d.data.type === 'user' && d.data.status === 'active') {
            // Expand/Collapse logic could go here if needed
        }
      });

    // Node Circle (Background)
    nodeEnter.append("circle")
      .attr("r", 32)
      .attr("fill", d => d.data.type === 'empty' ? 'transparent' : '#0f172a')
      .attr("stroke", d => {
          if (d.data.type === 'empty') return '#475569';
          if (d.data.status === 'pending') return '#fbbf24'; // Amber for pending
          return '#0f172a';
      })
      .attr("stroke-width", d => d.data.type === 'empty' ? 2 : 0)
      .attr("stroke-dasharray", d => d.data.type === 'empty' ? "5,5" : "none");

    // Pending Status Ring
    nodeEnter.filter(d => d.data.status === 'pending')
        .append("circle")
        .attr("r", 36)
        .attr("fill", "none")
        .attr("stroke", "#fbbf24")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.6);

    // Rank Ring (Active Users)
    nodeEnter.filter(d => d.data.type === 'user' && d.data.status === 'active')
        .append("circle")
        .attr("class", "rank-ring")
        .attr("r", 32)
        .attr("fill", "none")
        .attr("stroke", d => {
            if (d.data.rank === 'Diamond') return '#06b6d4';
            if (d.data.rank === 'Gold') return '#eab308';
            if (d.data.rank === 'Platinum') return '#a855f7';
            if (d.data.rank === 'Silver') return '#94a3b8';
            return '#64748b';
        })
        .attr("stroke-width", 2);

    // Avatar / Icon
    const userNodes = nodeEnter.filter(d => d.data.type === 'user');
    
    // Clip path for avatars
    userNodes.append("defs")
      .append("clipPath")
      .attr("id", (d) => `clip-${d.data.id}`)
      .append("circle")
      .attr("r", 28);

    userNodes.append("image")
      .attr("xlink:href", d => d.data.avatar || `https://ui-avatars.com/api/?name=${d.data.name}&background=random`)
      .attr("x", -28)
      .attr("y", -28)
      .attr("width", 56)
      .attr("height", 56)
      .attr("clip-path", (d) => `url(#clip-${d.data.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("opacity", d => d.data.status === 'pending' ? 0.5 : 1);

    // Empty Node Icon (+)
    nodeEnter.filter(d => d.data.type === 'empty')
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text("+")
        .attr("fill", "#94a3b8")
        .attr("font-size", "24px")
        .attr("font-weight", "light");

    // Labels
    nodeEnter.append("text")
      .attr("dy", "4.5em")
      .attr("text-anchor", "middle")
      .text(d => d.data.type === 'empty' ? 'Add Member' : d.data.name)
      .attr("fill", d => d.data.status === 'pending' ? '#fbbf24' : "#f8fafc")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .style("pointer-events", "none")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

    nodeEnter.filter(d => d.data.type === 'user' && d.data.status === 'active')
        .append("text")
        .attr("dy", "6em")
        .attr("text-anchor", "middle")
        .text(d => d.data.rank || 'Member')
        .attr("fill", "#94a3b8")
        .attr("font-size", "10px")
        .style("pointer-events", "none");

    nodeEnter.filter(d => d.data.status === 'pending')
        .append("text")
        .attr("dy", "6em")
        .attr("text-anchor", "middle")
        .text("Waiting Approval")
        .attr("fill", "#fbbf24")
        .attr("font-size", "9px")
        .style("pointer-events", "none");

    // Update Phase
    const nodeUpdate = nodes.merge(nodeEnter as any);
    
    nodeUpdate.transition().duration(400)
      .attr("transform", d => `translate(${(d as any).x},${(d as any).y})`);

    nodes.exit().transition().duration(200).remove();

  }, [treeData]);

  const resetZoom = () => {
      if (!svgRef.current) return;
      const svg = select(svgRef.current);
      const initialTransform = zoomIdentity.translate(wrapperRef.current!.clientWidth / 2, 80).scale(0.85);
      svg.transition().duration(750).call(zoom().on("zoom", (e) => svg.select(".zoom-layer").attr("transform", e.transform)).transform as any, initialTransform);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !svgRef.current || !wrapperRef.current) return;

    const svg = select(svgRef.current);
    const nodes = svg.selectAll<SVGGElement, HierarchyPointNode<TreeNode>>(".node");
    
    let target: HierarchyPointNode<TreeNode> | null = null;
    
    // Find matching node
    nodes.each(function(d) {
        if (d.data.type === 'user') {
            const matchesId = d.data.id.toLowerCase() === searchQuery.toLowerCase();
            const matchesName = d.data.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (matchesId || matchesName) {
                target = d;
            }
        }
    });

    if (target) {
        const { x, y } = target as any;
        const width = wrapperRef.current.clientWidth;
        const height = wrapperRef.current.clientHeight;
        const scale = 1.2;
        
        const transform = zoomIdentity
            .translate(width / 2, height / 2)
            .scale(scale)
            .translate(-x, -y);

        svg.transition().duration(1000)
           .call(
               zoom().on("zoom", (e) => svg.select(".zoom-layer").attr("transform", e.transform)).transform as any, 
               transform
           );
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegStatus('submitting');
    
    // Simulate API calls
    setTimeout(() => {
        // Update the tree data to show the pending node
        if (treeData && selectedSlotId) {
            const updateNode = (node: TreeNode): TreeNode => {
                if (node.id === selectedSlotId) {
                    return {
                        ...node,
                        type: 'user',
                        status: 'pending',
                        name: formData.fullname,
                        email: formData.email,
                        rank: 'Associate',
                        avatar: `https://ui-avatars.com/api/?name=${formData.fullname}&background=random`,
                        children: [], // Hydration will fill these later if we re-hydrate
                    };
                }
                if (node.children) {
                    return { ...node, children: node.children.map(updateNode) };
                }
                return node;
            };
            
            // Re-hydrate to add new empty slots below the new pending user
            setTreeData(hydrateTree(updateNode(treeData)));
        }
        setRegStatus('success');
    }, 2000);
  };

  return (
    <div ref={wrapperRef} className="w-full h-full min-h-[600px] overflow-hidden bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 relative group">
      
      {/* Top Controls: Search and Reset */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
         {/* Search Bar */}
         <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/90 text-white pl-9 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-48 transition-all focus:w-64 shadow-lg backdrop-blur-sm placeholder-slate-500"
                  placeholder="Find member by name or ID..."
                />
            </form>
         </div>

         <button 
          onClick={resetZoom}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/10 shadow-lg transition-colors backdrop-blur-sm"
          title="Reset View"
        >
          <Maximize size={20} />
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 p-3 bg-slate-800/90 rounded-lg text-xs text-slate-300 backdrop-blur-md border border-white/5 shadow-xl pointer-events-none">
        <h3 className="font-semibold text-white mb-2 uppercase tracking-wider">Rank Legend</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span> Diamond</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span> Platinum</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span> Gold</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Silver</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-dashed border-slate-500"></span> Empty Slot</div>
        </div>
      </div>
      
      {/* Registration Modal */}
      {showModal && (
        <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
                >
                    <X size={20} />
                </button>

                {regStatus === 'success' ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full overflow-y-auto">
                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Registration Submitted</h3>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 w-full">
                            <div className="flex items-center gap-2 text-yellow-500 font-semibold mb-1 justify-center">
                                <AlertCircle size={18} />
                                <span>Pending Admin Approval</span>
                            </div>
                            <p className="text-sm text-yellow-200/80">
                                This account is currently inactive. Credentials will be valid only after admin approval.
                            </p>
                        </div>
                        
                        <div className="space-y-4 text-left bg-slate-800/50 p-6 rounded-xl mb-6 w-full border border-white/5">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Workflow Status</h4>
                            <div className="flex items-start gap-4 text-sm text-slate-300">
                                <div className="mt-0.5 p-1.5 bg-cyan-500/10 rounded text-cyan-400">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Confirmation Email Sent</p>
                                    <p className="text-xs text-slate-500">To: Network Administrator</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-sm text-slate-300">
                                <div className="mt-0.5 p-1.5 bg-purple-500/10 rounded text-purple-400">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Data Archived</p>
                                    <p className="text-xs text-slate-500">Securely saved to Google Forms (Drive)</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium border border-white/10"
                        >
                            Return to Network Tree
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-white/5 bg-slate-900 sticky top-0 z-10">
                            <h3 className="text-xl font-bold text-white mb-1">New Member Registration</h3>
                            <p className="text-slate-400 text-xs">Fill in the details to reserve this binary position.</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <form id="regForm" onSubmit={handleRegister} className="space-y-5">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                                        <User size={14} /> Personal Information
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formData.fullname}
                                                onChange={e => setFormData({...formData, fullname: e.target.value})}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-slate-600"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Gender</label>
                                            <select
                                                required
                                                value={formData.gender}
                                                onChange={e => setFormData({...formData, gender: e.target.value})}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                                            >
                                                <option disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-3 text-slate-500" />
                                            <input 
                                                type="tel" 
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-slate-600"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Residential Address</label>
                                        <div className="relative">
                                            <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                                            <textarea 
                                                required
                                                value={formData.address}
                                                onChange={e => setFormData({...formData, address: e.target.value})}
                                                rows={2}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-slate-600 resize-none"
                                                placeholder="Street Address, City, Country"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 my-2"></div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                                        <FileText size={14} /> Account Credentials
                                    </h4>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-slate-600"
                                            placeholder="member@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Set Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-slate-600"
                                            placeholder="••••••••"
                                        />
                                        <p className="mt-2 text-[10px] text-slate-500 leading-tight">
                                            <span className="text-yellow-500 font-medium">Note:</span> Credentials will be active only after admin approval.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-slate-900 sticky bottom-0 z-10">
                            <button 
                                type="submit"
                                form="regForm"
                                disabled={regStatus === 'submitting'}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white rounded-xl transition-all font-semibold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                            >
                                {regStatus === 'submitting' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Submitting Request...
                                    </>
                                ) : (
                                    'Submit for Approval'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      <svg ref={svgRef} className="w-full h-full block cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
};

export default NetworkTree;