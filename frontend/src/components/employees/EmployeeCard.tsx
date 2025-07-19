'use client';
import { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import { useMutation } from '@apollo/client';
import { DELETE_EMPLOYEE } from '@/graphql/mutations';
import { toast } from 'sonner';

type EmployeeCardProps = {
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

export default function EmployeeCard(props: EmployeeCardProps & { refetch?: () => void }) {
  const {
    id,
    firstName,
    lastName,
    middleName,
    position,
    phone,
    email,
    status,
    avatar,
  } = props;

  const [edit, setEdit] = useState(false);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE);

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить сотрудника?')) {
      await deleteEmployee({ variables: { id } });
      toast.success('Сотрудник удалён');
      props.refetch?.();
    }
  };

  if (edit) {
    return (
      <EmployeeForm
        initValues={{ id, firstName, lastName, middleName, position, phone, email, status, avatar }}
        onSuccess={() => setEdit(false)}
        onCancel={() => setEdit(false)}
      />
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl flex flex-col items-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="w-16 h-16 mb-3 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          `${lastName[0]}${firstName[0]}`
        )}
      </div>
      <div className="text-lg font-semibold text-white text-center">
        {lastName} {firstName} {middleName && middleName}
      </div>
      <div className="text-sm text-violet-200 mb-1">{position}</div>
      <div className="text-sm text-white/80 mb-1">{phone}</div>
      {email && <div className="text-sm text-white/60 mb-1">{email}</div>}
      <div className="mt-2">
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          status === 'ACTIVE'
            ? 'bg-green-500/80 text-white'
            : status === 'VACATION'
            ? 'bg-blue-500/80 text-white'
            : status === 'SICK'
            ? 'bg-yellow-400/80 text-black'
            : status === 'FIRED'
            ? 'bg-red-500/80 text-white'
            : 'bg-gray-500/80 text-white'
        }`}>{status}</span>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 rounded bg-violet-600 text-white hover:bg-violet-700 transition" onClick={() => setEdit(true)}>Редактировать</button>
        <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition" onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
} 