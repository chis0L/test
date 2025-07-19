'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from '@/graphql/mutations';
import { uploadToS3 } from '@/lib/s3upload';
import { Plus } from 'lucide-react';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  avatar: '',
  passportPhoto: '',
  passportSeries: '',
  passportNumber: '',
  passportIssued: '',
  passportDate: '',
  address: '',
  position: '',
  department: '',
  hireDate: '',
  salary: '',
  status: 'ACTIVE',
  phone: '',
  email: '',
  telegram: '',
  whatsapp: '',
  emergencyContact: '',
  emergencyPhone: '',
  organizationId: '',
};

type EmployeeFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  initValues?: Partial<typeof initialState>;
};

// Функция для очистки input: заменяет пустые строки на undefined
function cleanInput<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const key in obj) {
    cleaned[key] = obj[key] === '' ? undefined : obj[key];
  }
  return cleaned;
}

export default function EmployeeForm({ onSuccess, onCancel, initValues }: EmployeeFormProps) {
  const [form, setForm] = useState(initValues ? { ...initialState, ...initValues } : initialState);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName) newErrors.firstName = 'Введите имя';
    if (!form.lastName) newErrors.lastName = 'Введите фамилию';
    if (!form.position) newErrors.position = 'Укажите должность';
    if (!form.phone) newErrors.phone = 'Укажите телефон';
    if (!form.hireDate) newErrors.hireDate = 'Укажите дату приёма';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (form.id) {
        const { id, ...input } = form;
        const preparedInput = cleanInput({
          ...input,
          salary: input.salary ? parseFloat(input.salary) : undefined,
          hireDate: form.hireDate ? new Date(form.hireDate).toISOString() : undefined,
        });
        await updateEmployee({ variables: { id: form.id, input: preparedInput } });
        toast.success('Данные сотрудника обновлены!');
      } else {
        const { id, ...input } = form;
        const preparedInput = cleanInput({
          ...input,
          organizationId: input.organizationId || 'demo-org',
          salary: input.salary ? parseFloat(input.salary) : undefined,
          hireDate: form.hireDate ? new Date(form.hireDate).toISOString() : undefined,
        });
        await createEmployee({ variables: { input: preparedInput } });
        toast.success('Сотрудник успешно добавлен!');
        setForm(initialState);
      }
      onSuccess?.();
    } catch (err) {
      toast.error('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarLoading(true);
      try {
        const url = await uploadToS3(e.target.files[0], 'avatars');
        setForm({ ...form, avatar: url });
        toast.success('Аватар успешно загружен!');
      } catch {
        toast.error('Ошибка загрузки аватара');
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-xl mb-6 flex flex-col gap-4 animate-fade-in max-w-xl mx-auto shadow-2xl">
      <div className="flex gap-4 items-center mb-2">
        <label className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white cursor-pointer hover:bg-white/30 transition relative overflow-hidden ring-2 ring-violet-400/30 focus-within:ring-4 focus-within:ring-violet-400/60" aria-label="Загрузить аватар">
          {form.avatar ? (
            <img src={form.avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
          ) : avatarLoading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>+</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </label>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <input name="lastName" value={form.lastName || ''} onChange={handleChange} placeholder="Фамилия*" className={`px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border ${errors.lastName ? 'border-red-500' : 'border-white/20'} focus:border-violet-400 transition`} aria-label="Фамилия" />
            {errors.lastName && <span className="text-red-400 text-xs mt-1">{errors.lastName}</span>}
          </div>
          <div className="flex flex-col">
            <input name="firstName" value={form.firstName || ''} onChange={handleChange} placeholder="Имя*" className={`px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border ${errors.firstName ? 'border-red-500' : 'border-white/20'} focus:border-violet-400 transition`} aria-label="Имя" />
            {errors.firstName && <span className="text-red-400 text-xs mt-1">{errors.firstName}</span>}
          </div>
          <input name="middleName" value={form.middleName || ''} onChange={handleChange} placeholder="Отчество" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Отчество" />
          <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Email" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <input name="position" value={form.position || ''} onChange={handleChange} placeholder="Должность*" className={`px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border ${errors.position ? 'border-red-500' : 'border-white/20'} focus:border-violet-400 transition`} aria-label="Должность" />
          {errors.position && <span className="text-red-400 text-xs mt-1">{errors.position}</span>}
        </div>
        <div className="flex flex-col">
          <input name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Телефон*" className={`px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border ${errors.phone ? 'border-red-500' : 'border-white/20'} focus:border-violet-400 transition`} aria-label="Телефон" />
          {errors.phone && <span className="text-red-400 text-xs mt-1">{errors.phone}</span>}
        </div>
        <div className="flex flex-col">
          <input name="hireDate" value={form.hireDate || ''} onChange={handleChange} type="date" placeholder="Дата приёма*" className={`px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border ${errors.hireDate ? 'border-red-500' : 'border-white/20'} focus:border-violet-400 transition`} aria-label="Дата приёма" />
          {errors.hireDate && <span className="text-red-400 text-xs mt-1">{errors.hireDate}</span>}
        </div>
        <input name="birthDate" value={form.birthDate || ''} onChange={handleChange} type="date" placeholder="Дата рождения" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Дата рождения" />
        <input name="address" value={form.address || ''} onChange={handleChange} placeholder="Адрес" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Адрес" />
        <input name="salary" value={form.salary || ''} onChange={handleChange} placeholder="Оклад" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Оклад" />
        <input name="passportSeries" value={form.passportSeries || ''} onChange={handleChange} placeholder="Серия паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Серия паспорта" />
        <input name="passportNumber" value={form.passportNumber || ''} onChange={handleChange} placeholder="Номер паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Номер паспорта" />
        <input name="passportIssued" value={form.passportIssued || ''} onChange={handleChange} placeholder="Кем выдан паспорт" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Кем выдан паспорт" />
        <input name="passportDate" value={form.passportDate || ''} onChange={handleChange} type="date" placeholder="Дата выдачи паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Дата выдачи паспорта" />
        <input name="telegram" value={form.telegram || ''} onChange={handleChange} placeholder="Telegram" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Telegram" />
        <input name="whatsapp" value={form.whatsapp || ''} onChange={handleChange} placeholder="WhatsApp" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="WhatsApp" />
        <input name="emergencyContact" value={form.emergencyContact || ''} onChange={handleChange} placeholder="Контакт для экстренной связи" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Экстренный контакт" />
        <input name="emergencyPhone" value={form.emergencyPhone || ''} onChange={handleChange} placeholder="Телефон экстренного контакта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Телефон экстренного контакта" />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300">Отмена</button>
        <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-violet-500 hover:ring-4 hover:ring-fuchsia-400/30 active:scale-95 transition-all duration-300 disabled:opacity-50 text-base">
          {loading ? <span className="animate-spin">⏳</span> : <Plus className="w-5 h-5" />} {form.id ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
} 