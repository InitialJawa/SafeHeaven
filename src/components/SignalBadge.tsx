/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SignalType } from '../types';

interface SignalBadgeProps {
  signal: SignalType;
  id?: string;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ signal, id }) => {
  // Beli -> #00c9a5 (hijau)
  // Akumulasi -> #0891b2 (biru)
  // Tahan -> #f59e0b (kuning)
  // Hindari -> #f97316 (oranye)
  // Jual -> #f23645 (merah)
  
  let bgColor = 'bg-gray-800';
  let textColor = 'text-gray-200';
  
  switch (signal) {
    case 'Beli':
      bgColor = 'bg-[#00f5a0]/15 border-[#00f5a0]/30';
      textColor = 'text-[#00f5a0]';
      break;
    case 'Akumulasi':
      bgColor = 'bg-[#0891b2]/15 border-[#0891b2]/30';
      textColor = 'text-[#0891b2]';
      break;
    case 'Tahan':
      bgColor = 'bg-[#f59e0b]/15 border-[#f59e0b]/30';
      textColor = 'text-[#f59e0b]';
      break;
    case 'Hindari':
      bgColor = 'bg-[#f97316]/15 border-[#f97316]/30';
      textColor = 'text-[#f97316]';
      break;
    case 'Jual':
      bgColor = 'bg-[#ff3366]/15 border-[#ff3366]/30';
      textColor = 'text-[#ff3366]';
      break;
  }

  return (
    <span 
      id={id || `signal-badge-${signal.toLowerCase()}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor} ${textColor}`}
    >
      {signal}
    </span>
  );
};
