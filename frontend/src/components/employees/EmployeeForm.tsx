'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from '@/graphql/mutations';
import { uploadToS3 } from '@/lib/s3upload';

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

export default function EmployeeForm({ onSuccess, onCancel, initValues }: EmployeeFormProps) {
  const [form, setForm] = useState(initValues ? { ...initialState, ...initValues } : initialState);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [createEmployee] = useMutation(CREATE_EMPLOYEE);
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.position || !form.phone || !form.hireDate) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setLoading(true);
    try {
      if (form.id) {
        await updateEmployee({ variables: { id: form.id, input: { ...form, hireDate: new Date(form.hireDate) } } });
        toast.success('Данные сотрудника обновлены!');
      } else {
        await createEmployee({ variables: { input: { ...form, hireDate: new Date(form.hireDate) } } });
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
        <label className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white cursor-pointer hover:bg-white/30 transition relative overflow-hidden" aria-label="Загрузить аватар">
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
          <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Фамилия*" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Фамилия" />
          <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Имя*" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Имя" />
          <input name="middleName" value={form.middleName} onChange={handleChange} placeholder="Отчество" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Отчество" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Email" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input name="position" value={form.position} onChange={handleChange} placeholder="Должность*" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Должность" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон*" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Телефон" />
        <input name="hireDate" value={form.hireDate} onChange={handleChange} type="date" placeholder="Дата приёма*" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Дата приёма" />
        <input name="birthDate" value={form.birthDate} onChange={handleChange} type="date" placeholder="Дата рождения" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Дата рождения" />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Адрес" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Адрес" />
        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Оклад" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Оклад" />
        <input name="passportSeries" value={form.passportSeries} onChange={handleChange} placeholder="Серия паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Серия паспорта" />
        <input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="Номер паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Номер паспорта" />
        <input name="passportIssued" value={form.passportIssued} onChange={handleChange} placeholder="Кем выдан паспорт" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Кем выдан паспорт" />
        <input name="passportDate" value={form.passportDate} onChange={handleChange} type="date" placeholder="Дата выдачи паспорта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Дата выдачи паспорта" />
        <input name="telegram" value={form.telegram} onChange={handleChange} placeholder="Telegram" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Telegram" />
        <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="WhatsApp" />
        <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Контакт для экстренной связи" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Экстренный контакт" />
        <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="Телефон экстренного контакта" className="px-3 py-2 rounded bg-white/10 text-white placeholder-white/50 outline-none border border-white/20 focus:border-violet-400 transition" aria-label="Телефон экстренного контакта" />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition">Отмена</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-50">
          {loading ? 'Сохраняю...' : (form.id ? 'Сохранить' : 'Добавить')}
        </button>
      </div>
    </form>
  );
} 