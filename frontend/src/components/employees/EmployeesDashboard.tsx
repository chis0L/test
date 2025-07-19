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
import { Plus } from 'lucide-react';

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
      <TabsList className="flex gap-2 mb-6 bg-gradient-to-r from-violet-900/80 to-fuchsia-900/60 p-2 rounded-2xl shadow-lg backdrop-blur-xl">
        <TabsTrigger value="employees" className="px-6 py-2 rounded-full text-base font-bold bg-white/10 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300">Сотрудники</TabsTrigger>
        <TabsTrigger value="schedule" className="px-6 py-2 rounded-full text-base font-bold bg-white/10 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300">Расписание</TabsTrigger>
        <TabsTrigger value="stats" className="px-6 py-2 rounded-full text-base font-bold bg-white/10 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-lime-500 data-[state=active]:shadow-lg data-[state=active]:text-white transition-all duration-300">Статистика</TabsTrigger>
      </TabsList>
      <TabsContent value="employees">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex gap-2">
            {statuses.map(s => (
              <button
                key={s.value}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 shadow-sm backdrop-blur-md ${status === s.value ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-violet-700 shadow-lg' : 'bg-white/10 text-white/70 border-white/20 hover:bg-violet-800/30'}`}
                onClick={() => setStatus(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Поиск по ФИО, телефону, должности..."
            className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition-all duration-300 shadow-sm backdrop-blur-md"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-lime-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-300 text-base"
            onClick={() => setShowForm(v => !v)}
          >
            <Plus className="w-5 h-5" /> {showForm ? 'Скрыть форму' : 'Добавить сотрудника'}
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
                <EmployeeCard key={emp.id} {...emp} refetch={refetch} />
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