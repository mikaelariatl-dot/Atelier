import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MessageCircle, MapPin, Award } from 'lucide-react';

export const OwnerCustomers: React.FC = () => {
  const { customers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e8e2d9] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Client Relations</span>
          <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Concierge Client Directory</h1>
          <p className="text-xs text-[#736e65] mt-1">
            Verified buyers who have reserved items across Tokyo & Paris drops.
          </p>
        </div>

        <div className="text-xs font-mono text-[#736e65]">
          Total Clients: <strong className="text-[#1e1c1a]">{customers.length}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#e8e2d9] p-4">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, or phone..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-[#d4cbbf] focus:border-[#1e1c1a] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#a8a196] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e2d9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f5f2] border-b border-[#e8e2d9] font-mono uppercase text-[#736e65] text-[10px]">
              <tr>
                <th className="p-3.5">Client Profile</th>
                <th className="p-3.5">Contact & Location</th>
                <th className="p-3.5">VIP Tier</th>
                <th className="p-3.5">Orders Count</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5 text-right">Concierge Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece6]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#f4eee6] border border-[#d4cbbf] flex items-center justify-center font-serif text-xs text-[#1e1c1a]">
                        {c.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[#1e1c1a]">{c.fullName}</div>
                        <div className="text-[10px] text-[#736e65]">Member: {c.registeredAt}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <div className="text-[#1e1c1a]">{c.email}</div>
                    <div className="text-[11px] text-[#736e65] font-mono">{c.phone}</div>
                    {c.addresses[0] && (
                      <div className="text-[10px] text-[#a8a196] flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-0.5" /> {c.addresses[0].city}
                      </div>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center text-[9px] font-mono uppercase px-2 py-0.5 border ${
                        c.tier === 'VIP Concierge'
                          ? 'bg-[#fefae0] text-[#78590c] border-[#f5ee9e]'
                          : c.tier === 'Standard'
                          ? 'bg-[#e9ecef] text-[#212529] border-[#ced4da]'
                          : 'bg-[#f8f9fa] text-[#6c757d] border-[#dee2e6]'
                      }`}
                    >
                      <Award className="w-2.5 h-2.5 mr-1" />
                      {c.tier}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono">
                    {c.totalOrders} trips
                  </td>

                  <td className="p-3.5 font-mono font-semibold text-[#1e1c1a]">
                    Rp {c.totalSpentIdr.toLocaleString('id-ID')}
                  </td>

                  <td className="p-3.5 text-right">
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(c.fullName)},%20this%20is%20Clara%20from%20Atelier%20Jastip.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-[#25d366] text-white text-[10px] font-mono uppercase tracking-wider rounded-xs hover:bg-[#20ba59]"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
