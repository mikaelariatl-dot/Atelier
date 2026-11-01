import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, CheckCircle2 } from 'lucide-react';
import { OwnerNotificationSettings } from '../../types';

export const OwnerEmailNotifications: React.FC = () => {
  const { notificationSettings, updateNotificationSettings, sendTestNotificationEmail, addToast } = useApp();

  const handleToggle = (key: keyof OwnerNotificationSettings) => {
    updateNotificationSettings({
      [key]: !notificationSettings[key]
    });
  };

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div className="pb-4 border-b border-[#e8e2d9]">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[#96422d]">Automated Concierge Triggers</span>
        <h1 className="font-serif text-3xl text-[#1e1c1a] mt-0.5">Email Notifications & Webhooks</h1>
        <p className="text-xs text-[#736e65] mt-1">
          Configure real-time automated transactional emails sent to buyers and owner during each sourcing milestone.
        </p>
      </div>

      {/* Triggers List */}
      <div className="bg-white border border-[#e8e2d9] divide-y divide-[#f0ece6] shadow-xs">
        
        {/* Trigger 1 */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#1e1c1a]">New Order Placed & Payment Instructions</div>
            <p className="text-[11px] text-[#736e65]">
              Immediately sends the buyer the designated bank account details, QRIS code, and unique 3-digit anti-collision sum.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationSettings.notifyOnNewOrder}
            onChange={() => handleToggle('notifyOnNewOrder')}
            className="w-4 h-4 accent-[#1e1c1a]"
          />
        </div>

        {/* Trigger 2 */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#1e1c1a]">Payment Verified & Tokyo Quota Locked</div>
            <p className="text-[11px] text-[#736e65]">
              Dispatched once Clara approves the transfer receipt or bank mutasi matches. Confirms inclusion in luggage manifest.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationSettings.notifyOnPaymentReceived}
            onChange={() => handleToggle('notifyOnPaymentReceived')}
            className="w-4 h-4 accent-[#1e1c1a]"
          />
        </div>

        {/* Trigger 3 */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#1e1c1a]">Payment Rejection / Discrepancy Notification</div>
            <p className="text-[11px] text-[#736e65]">
              Alerts customer if transfer amount does not match anti-collision digits or receipt was blurry.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationSettings.notifyOnPaymentFailed}
            onChange={() => handleToggle('notifyOnPaymentFailed')}
            className="w-4 h-4 accent-[#1e1c1a]"
          />
        </div>

        {/* Trigger 4 */}
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-medium text-[#1e1c1a]">Low Stock / Luggage Quota Alert</div>
            <p className="text-[11px] text-[#736e65]">
              Sends owner Clara an urgent notification when an item has fewer than 2 slots left in Tokyo manifest.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notificationSettings.notifyOnLowStock}
            onChange={() => handleToggle('notifyOnLowStock')}
            className="w-4 h-4 accent-[#1e1c1a]"
          />
        </div>

      </div>

      {/* Simulator Dispatch Box */}
      <div className="bg-[#f4eee6] border border-[#e8e2d9] p-6 space-y-3 text-xs">
        <h4 className="font-serif text-sm text-[#1e1c1a]">Notification Recipient & Dispatch Simulator</h4>
        <p className="text-[11px] text-[#736e65]">
          Current configured administrator address: <strong className="text-[#1e1c1a]">{notificationSettings.notificationEmail}</strong>
        </p>
        {notificationSettings.lastTestEmailSent && (
          <div className="text-[11px] font-mono text-[#2d6a4f] flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Last test: {notificationSettings.lastTestEmailSent}
          </div>
        )}
        <div className="pt-2">
          <button
            onClick={sendTestNotificationEmail}
            className="px-5 py-2.5 bg-[#1e1c1a] text-white text-xs font-mono uppercase tracking-wider hover:bg-[#333]"
          >
            Dispatch Test Simulation Ping
          </button>
        </div>
      </div>

    </div>
  );
};
