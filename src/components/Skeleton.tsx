import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-[#1a1827]/70 border border-[#262338]/50 rounded-xl ${className}`} />
  );
};

export const SkeletonText: React.FC<{ className?: string; lines?: number }> = ({ className = '', lines = 1 }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="animate-pulse bg-[#1c1a2e]/80 rounded-md h-3.5"
          style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => {
  return (
    <div className={`card card-elevated p-5 bg-[#0b0a10]/60 border border-[#1b1926] rounded-2xl animate-pulse ${className}`}>
      {children || (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export const SkeletonChart: React.FC<{ className?: string; height?: string }> = ({ className = '', height = 'h-[250px]' }) => {
  return (
    <div className={`w-full ${height} bg-[#111018]/50 border border-[#1b1926] rounded-2xl p-4 flex flex-col justify-between animate-pulse ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex items-end justify-between gap-2 h-[65%] pt-4">
        {[40, 65, 35, 80, 55, 90, 70, 45, 85, 60].map((h, i) => (
          <div 
            key={i} 
            className="flex-1 bg-[#201d33]/60 rounded-t-sm" 
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-2.5 w-8" />
        ))}
      </div>
    </div>
  );
};

export const SkeletonGauge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 animate-pulse ${className}`}>
      <div className="w-32 h-16 border-[10px] border-[#1f1d30] border-b-0 rounded-t-full relative flex items-end justify-center">
        <div className="w-3 h-3 bg-[#ccff00]/40 rounded-full mb-[-6px]" />
      </div>
      <Skeleton className="h-5 w-24 rounded-full mt-3" />
    </div>
  );
};

