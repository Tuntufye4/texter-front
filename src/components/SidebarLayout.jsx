import React from 'react';

export default function SidebarLayout({ children }) {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-1/4 bg-gray-50 p-4 border-r overflow-y-auto">
        {children.sidebar}
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children.main}</main>
    </div>
  );
}
