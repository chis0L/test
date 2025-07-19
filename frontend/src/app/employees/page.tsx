'use client';

import EmployeesDashboard from "@/components/employees/EmployeesDashboard";

export default function EmployeesPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#2e026d] to-[#15162c]">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white/10 border-r border-white/10 flex flex-col p-6 gap-4">
        <h2 className="text-2xl font-bold text-white mb-8">Меню</h2>
        <nav className="flex flex-col gap-2">
          <a href="/employees" className="text-white/80 hover:text-white font-medium transition">Сотрудники</a>
          <a href="#" className="text-white/50 cursor-not-allowed">Отделы</a>
          <a href="#" className="text-white/50 cursor-not-allowed">Организации</a>
        </nav>
        <div className="mt-auto text-xs text-white/40">v1.0</div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <EmployeesDashboard />
      </main>
    </div>
  );
} 