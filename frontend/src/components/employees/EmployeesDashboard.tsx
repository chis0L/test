'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '@/graphql/queries';
import EmployeeCard from './EmployeeCard';
import EmployeeForm from './EmployeeForm';
import EmployeeScheduleCalendar from './EmployeeScheduleCalendar';
import EmployeeStats from './EmployeeStats';
import dayjs from 'dayjs';

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  position: string;
  phone: string;
  email?: string;
  status: string;
  avatar?: string;
};

type DayStatus = 'WORK' | 'WEEKEND' | 'VACATION' | 'SICK' | 'ABSENT';

const statuses = [
  { value: 'ALL', label: 'Все' },
  { value: 'ACTIVE', label: 'Активные' },
  { value: 'VACATION', label: 'В отпуске' },
  { value: 'SICK', label: 'Больничный' },
  { value: 'FIRED', label: 'Уволенные' },
];

export default function EmployeesDashboard() {
  const { data, loading, error, refetch } = useQuery<{ employees: Employee[] }>(GET_EMPLOYEES);
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('employees');
  const [showForm, setShowForm] = useState(false);
  // Календарь расписания
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(dayjs().month() + 1);
  const [calendarYear, setCalendarYear] = useState(dayjs().year());
  const [days, setDays] = useState<{ [day: number]: DayStatus }>({});

  // Фильтрация и поиск
  const filtered = (data?.employees ?? [])
    .filter(emp => status === 'ALL' || emp.status === status)
    .filter(emp => {
      const q = search.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q) ||
        (emp.middleName?.toLowerCase().includes(q) ?? false) ||
        emp.position.toLowerCase().includes(q) ||
        emp.phone.includes(q)
      );
    });

  // Пагинация
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Заглушка для статистики
  const stats = {
    total: data?.employees.length ?? 0,
    avgAge: 30,
    avgSalary: 100000,
    byStatus: [
      { status: 'ACTIVE', count: (data?.employees.filter(e => e.status === 'ACTIVE').length ?? 0) },
      { status: 'VACATION', count: (data?.employees.filter(e => e.status === 'VACATION').length ?? 0) },
      { status: 'SICK', count: (data?.employees.filter(e => e.status === 'SICK').length ?? 0) },
      { status: 'FIRED', count: (data?.employees.filter(e => e.status === 'FIRED').length ?? 0) },
    ],
  };

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="flex gap-2 mb-6">
        <TabsTrigger value="employees" className="px-4 py-2 rounded bg-violet-700 text-white data-[state=active]:bg-violet-900 transition">Сотрудники</TabsTrigger>
        <TabsTrigger value="schedule" className="px-4 py-2 rounded bg-violet-700 text-white data-[state=active]:bg-violet-900 transition">Расписание</TabsTrigger>
        <TabsTrigger value="stats" className="px-4 py-2 rounded bg-violet-700 text-white data-[state=active]:bg-violet-900 transition">Статистика</TabsTrigger>
      </TabsList>
      <TabsContent value="employees">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex gap-2">
            {statuses.map(s => (
              <button
                key={s.value}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition ${status === s.value ? 'bg-violet-600 text-white border-violet-700' : 'bg-white/10 text-white/70 border-white/20 hover:bg-violet-800/30'}`}
                onClick={() => setStatus(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Поиск по ФИО, телефону, должности..."
            className="flex-1 px-4 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition font-bold"
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? 'Скрыть форму' : 'Добавить сотрудника'}
          </button>
        </div>
        {showForm && (
          <EmployeeForm
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
        {loading ? (
          <div className="text-white">Загрузка...</div>
        ) : error ? (
          <div className="text-red-400">Ошибка загрузки сотрудников</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              {paginated.map(emp => (
                <EmployeeCard key={emp.id} {...emp} />
              ))}
            </div>
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex gap-2 justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`px-3 py-1 rounded ${p === page ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/60 hover:bg-violet-800/30'}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </TabsContent>
      <TabsContent value="schedule">
        <div className="glass-card p-6 mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">Расписание</h2>
          <div className="mb-4 flex gap-2">
            <select
              className="px-3 py-2 rounded bg-white/10 text-white"
              value={selectedEmployee ?? ''}
              onChange={e => setSelectedEmployee(e.target.value)}
            >
              <option value="">Выберите сотрудника</option>
              {(data?.employees ?? []).map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.lastName} {emp.firstName}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={12}
              value={calendarMonth}
              onChange={e => setCalendarMonth(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-white/10 text-white"
            />
            <input
              type="number"
              min={2000}
              max={2100}
              value={calendarYear}
              onChange={e => setCalendarYear(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded bg-white/10 text-white"
            />
          </div>
          {selectedEmployee && (
            <EmployeeScheduleCalendar
              year={calendarYear}
              month={calendarMonth}
              days={days}
              onChange={(day, status) => setDays(d => ({ ...d, [day]: status }))}
            />
          )}
          {!selectedEmployee && <div className="text-white/60">Выберите сотрудника для просмотра расписания</div>}
        </div>
      </TabsContent>
      <TabsContent value="stats">
        <EmployeeStats stats={stats} />
      </TabsContent>
    </Tabs>
  );
} 