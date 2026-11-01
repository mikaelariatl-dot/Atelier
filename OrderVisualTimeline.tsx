import React from 'react';
import { Check, Clock, PackageCheck, Plane, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderVisualTimelineProps {
  order: Order;
  compact?: boolean;
}

export type VisualTimelineStage = 'Processing' | 'Purchased' | 'In Transit' | 'Delivered';

interface TimelineStepConfig {
  key: VisualTimelineStage;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  estimatedDate?: string;
  detailText: string;
}

export const OrderVisualTimeline: React.FC<OrderVisualTimelineProps> = ({ order, compact = false }) => {
  // Determine the active stage index (0: Processing, 1: Purchased, 2: In Transit, 3: Delivered)
  const getStageIndex = (orderStatus: OrderStatus, paymentStatus: string): number => {
    switch (orderStatus) {
      case 'Pending Payment':
        return 0; // Processing initiated (awaiting payment lock)
      case 'Payment Verification':
      case 'Paid':
        return 0; // Processing (funds verified, batch manifest locked)
      case 'Processing':
        return 1; // Purchased (Clara is procuring at boutique / acquired)
      case 'Shipped':
        return 2; // In Transit (Hand-carried flight / customs clearance)
      case 'Delivered':
      case 'Completed':
        return 3; // Delivered (Safely in customer hands)
      default:
        if (paymentStatus === 'Paid') return 1;
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.orderStatus, order.paymentStatus);

  // Configuration for the 4 core requested stages: 'Processing', 'Purchased', 'In Transit', 'Delivered'
  const steps: TimelineStepConfig[] = [
    {
      key: 'Processing',
      label: 'Processing',
      sublabel: 'Allocation & Quota Lock',
      icon: <Clock className="w-3.5 h-3.5" />,
      detailText:
        order.paymentStatus === 'Paid'
          ? 'Payment confirmed. Sourcing quota locked in Tokyo Autumn/Spring manifest.'
          : order.paymentStatus === 'Verification'
          ? 'Transfer slip under review by Clara. Tokyo slot held.'
          : 'Order placed. Awaiting transfer to finalize Tokyo luggage reservation.',
    },
    {
      key: 'Purchased',
      label: 'Purchased',
      sublabel: 'Boutique Procurement',
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      detailText:
        currentStageIndex >= 1
          ? 'Purchased at official flagship boutique in Ginza / Omotesando. Paper receipt secured.'
          : 'Scheduled for in-store procurement by Clara upon flight arrival.',
    },
    {
      key: 'In Transit',
      label: 'In Transit',
      sublabel: 'Hand-Carried & Customs',
      icon: <Plane className="w-3.5 h-3.5" />,
      detailText:
        currentStageIndex >= 2
          ? 'Hand-carried in flight (ANA NH855). Cleared through Soekarno-Hatta passenger customs.'
          : 'Will be hand-carried in Rimowa luggage & declared via Bea Cukai passenger app.',
    },
    {
      key: 'Delivered',
      label: 'Delivered',
      sublabel: `${order.courier} Dispatch`,
      icon: <Truck className="w-3.5 h-3.5" />,
      detailText:
        currentStageIndex >= 3
          ? `Dispatched via ${order.courier}${order.trackingNumber ? ` (AWB: ${order.trackingNumber})` : ''}. Safely delivered.`
          : `Will be dispatched via ${order.courier} immediately following Jakarta customs clearance.`,
    },
  ];

  if (compact) {
    return (
      <div className="w-full py-2">
        {/* Compact Horizontal Step Indicator */}
        <div className="grid grid-cols-4 gap-2 relative">
          {/* Progress bar background line */}
          <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-[#e8e2d9] -z-0" />
          <div
            className="absolute top-3.5 left-4 h-0.5 bg-[#1e1c1a] transition-all duration-500 -z-0"
            style={{
              width: `${(currentStageIndex / (steps.length - 1)) * 90}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                    isCompleted
                      ? 'bg-[#1e1c1a] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#96422d] text-white ring-4 ring-[#f4eee6] shadow-sm'
                      : 'bg-white border border-[#d4cbbf] text-[#a8a196]'
                  }`}
                  title={`${step.label}: ${step.detailText}`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.icon}
                </div>
                <span
                  className={`text-[10px] font-mono mt-1.5 uppercase tracking-wider ${
                    isCurrent ? 'font-bold text-[#96422d]' : isCompleted ? 'font-medium text-[#1e1c1a]' : 'text-[#a8a196]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf8f5] border border-[#e8e2d9] p-5 sm:p-6 mt-4">
      {/* Header with current status summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#e8e2d9]/70 gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#96422d] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#736e65]">
            Concierge Sourcing Timeline
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#736e65]">Current Milestone:</span>
          <span className="text-xs font-mono uppercase px-2.5 py-0.5 bg-[#1e1c1a] text-white tracking-wider">
            {steps[currentStageIndex]?.label}
          </span>
        </div>
      </div>

      {/* Desktop & Tablet Stepper */}
      <div className="hidden md:grid grid-cols-4 gap-4 relative mb-6">
        {/* Connecting Line Track */}
        <div className="absolute top-4 left-[12%] right-[12%] h-[2px] bg-[#e6dfd5] -z-0" />
        <div
          className="absolute top-4 left-[12%] h-[2px] bg-[#1e1c1a] transition-all duration-700 -z-0"
          style={{
            width: `${(currentStageIndex / (steps.length - 1)) * 76}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = currentStageIndex > idx;
          const isCurrent = currentStageIndex === idx;
          const isUpcoming = currentStageIndex < idx;

          return (
            <div key={step.key} className="flex flex-col items-center text-center relative z-10 px-1 group">
              {/* Milestone Icon Node */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-[#1e1c1a] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#96422d] text-white ring-4 ring-[#f4eee6] ring-offset-1 shadow-sm'
                    : 'bg-white border-2 border-[#d4cbbf] text-[#a8a196]'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
              </div>

              {/* Title & Sublabel */}
              <div className="mt-3">
                <div
                  className={`text-xs font-serif font-medium tracking-tight ${
                    isCurrent ? 'text-[#96422d] font-bold' : isCompleted ? 'text-[#1e1c1a]' : 'text-[#8a847d]'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#736e65] mt-0.5">
                  {step.sublabel}
                </div>
              </div>

              {/* Detail snippet */}
              <p
                className={`text-[11px] leading-relaxed mt-2 line-clamp-3 transition-opacity ${
                  isCurrent ? 'text-[#38342e]' : isCompleted ? 'text-[#625e56]' : 'text-[#a8a196]'
                }`}
              >
                {step.detailText}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-4 relative pl-3">
        {/* Vertical timeline connecting line */}
        <div className="absolute top-3 bottom-3 left-6 w-[2px] bg-[#e6dfd5] -z-0" />
        <div
          className="absolute top-3 left-6 w-[2px] bg-[#1e1c1a] transition-all duration-500 -z-0"
          style={{
            height: `${(currentStageIndex / (steps.length - 1)) * 82}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = currentStageIndex > idx;
          const isCurrent = currentStageIndex === idx;

          return (
            <div key={step.key} className="flex items-start space-x-3.5 relative z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs transition-all ${
                  isCompleted
                    ? 'bg-[#1e1c1a] text-white'
                    : isCurrent
                    ? 'bg-[#96422d] text-white ring-2 ring-[#96422d] ring-offset-2'
                    : 'bg-white border border-[#d4cbbf] text-[#a8a196]'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.icon}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-serif ${
                      isCurrent ? 'text-[#96422d] font-bold' : isCompleted ? 'text-[#1e1c1a] font-medium' : 'text-[#8a847d]'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#736e65]">
                    • {step.sublabel}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 leading-snug ${isCurrent ? 'text-[#38342e]' : 'text-[#736e65]'}`}>
                  {step.detailText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Authenticity & Luggage Footnote */}
      <div className="mt-4 pt-3 border-t border-[#e8e2d9]/60 flex flex-wrap items-center justify-between text-[11px] text-[#736e65] gap-2">
        <span className="flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#2d6a4f]" />
          Direct personal shopper verification by Clara Sutanto
        </span>
        <span className="font-mono text-[10px] text-[#96422d]">
          Original paper boutique slip included upon delivery
        </span>
      </div>
    </div>
  );
};
