import React from 'react';
import { Icon } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-background-light dark:bg-background-dark p-6 border-b border-surface-border">
      <div className="flex items-center h-12 justify-between gap-4">
        {/* Title Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 md:hidden mb-2 text-primary">
             <Icon name="fitness_center" />
             <span className="font-bold text-white">FitManage</span>
          </div>
          <h1 className="text-white tracking-tight text-2xl font-bold leading-tight">
            User Management
          </h1>
          <p className="text-[#92a4c9] text-sm mt-1">
            Manage user access and details
          </p>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 pl-4 border-l border-surface-border">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-white font-medium text-sm">Admin User</span>
            <span className="text-[#92a4c9] text-xs">Administrator</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-surface-dark border border-surface-border flex items-center justify-center text-primary overflow-hidden">
            <Icon name="person" />
          </div>
        </div>
      </div>
    </header>
  );
};