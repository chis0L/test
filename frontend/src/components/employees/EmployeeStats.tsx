import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeStats({ stats }: { stats: any }) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Статистика сотрудников</h2>
      <div className="mb-4 text-white/80">
        <div>Всего сотрудников: {stats.total}</div>
        <div>Средний возраст: {stats.avgAge}</div>
        <div>Средняя зарплата: {stats.avgSalary}</div>
      </div>
      <div className="mb-4">
        <h3 className="text-white/70 mb-2">Распределение по статусам</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.byStatus}>
            <XAxis dataKey="status" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="count" fill="#a855f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 