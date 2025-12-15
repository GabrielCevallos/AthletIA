import React from 'react';
import { Icon } from './Icon';
import { NavItem } from '../../types';

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: '#' },
  { label: 'Users', icon: 'group', isActive: true, href: '#' },
  { label: 'Ejercicios', icon: 'exercise', href: '#' },
  { label: 'Rutinas', icon: 'calendar_month', href: '#' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-[#0d121c] border-r border-surface-border p-4 gap-2 flex-shrink-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-6 text-primary">
        <Icon name="fitness_center" className="text-3xl" />
        <span className="text-xl font-bold tracking-tight text-white">FitManage</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              item.isActive
                ? 'bg-primary/10 text-primary'
                : 'text-[#92a4c9] hover:bg-surface-dark hover:text-white'
            }`}
          >
            <Icon name={item.icon} className="text-[20px]" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#92a4c9] hover:bg-surface-dark hover:text-white transition-colors"
        >
          <Icon name="settings" className="text-[20px]" />
          <span className="font-medium">Settings</span>
        </a>
      </div>
    </aside>
  );
};