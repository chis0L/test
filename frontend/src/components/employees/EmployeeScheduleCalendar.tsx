import dayjs from 'dayjs';

type DayStatus = 'WORK' | 'WEEKEND' | 'VACATION' | 'SICK' | 'ABSENT';

const statusColors: Record<DayStatus, string> = {
  WORK: 'bg-green-500',
  WEEKEND: 'bg-gray-500',
  VACATION: 'bg-blue-500',
  SICK: 'bg-yellow-400',
  ABSENT: 'bg-red-500',
};

export default function EmployeeScheduleCalendar({
  year,
  month,
  days,
  onChange,
}: {
  year: number;
  month: number;
  days: { [day: number]: DayStatus };
  onChange: (day: number, status: DayStatus) => void;
}) {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const firstDay = dayjs(`${year}-${month}-01`).day();

  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-white/70 font-bold">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const status = days[day] || 'WORK';
          return (
            <button
              key={day}
              className={`aspect-square rounded flex items-center justify-center font-bold text-white transition ${statusColors[status]} hover:scale-110`}
              onClick={() => {
                // Перебор статусов по клику
                const all: DayStatus[] = ['WORK', 'WEEKEND', 'VACATION', 'SICK', 'ABSENT'];
                const idx = all.indexOf(status);
                onChange(day, all[(idx + 1) % all.length]);
              }}
              aria-label={`День ${day}, статус: ${status}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
} 