'use client';
import { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import { useMutation } from '@apollo/client';
import { DELETE_EMPLOYEE } from '@/graphql/mutations';
import { toast } from 'sonner';
import { User, Edit, Trash2 } from 'lucide-react';

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
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-violet-400/60 hover:ring-4 hover:ring-violet-400/20 border border-violet-400/30 bg-gradient-to-br from-violet-900/60 via-violet-700/40 to-indigo-800/30 backdrop-blur-xl group">
      <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-400 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg border-4 border-white/30 group-hover:border-violet-400 transition-all duration-400">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full border-2 border-white/40 shadow-md" />
        ) : (
          <span className="bg-gradient-to-br from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">{lastName[0]}{firstName[0]}</span>
        )}
      </div>
      <div className="text-xl font-bold text-white text-center mb-1 drop-shadow-lg">
        {lastName} {firstName} {middleName && middleName}
      </div>
      <div className="text-sm text-violet-200 mb-1 font-medium">{position}</div>
      <div className="text-sm text-white/80 mb-1 flex items-center gap-1"><User className="w-4 h-4 text-violet-300" />{phone}</div>
      {email && <div className="text-sm text-white/60 mb-1 flex items-center gap-1"><User className="w-4 h-4 text-violet-300" />{email}</div>}
      <div className="mt-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md border border-white/20 transition-all duration-300 ${
          status === 'ACTIVE'
            ? 'bg-gradient-to-r from-green-400/80 to-green-600/80 text-white'
            : status === 'VACATION'
            ? 'bg-gradient-to-r from-blue-400/80 to-blue-600/80 text-white'
            : status === 'SICK'
            ? 'bg-gradient-to-r from-yellow-300/80 to-yellow-500/80 text-black'
            : status === 'FIRED'
            ? 'bg-gradient-to-r from-red-400/80 to-red-600/80 text-white'
            : 'bg-gray-500/80 text-white'
        }`}>{status}</span>
      </div>
      <div className="flex gap-3 mt-6 w-full justify-center">
        <button className="flex items-center gap-1 px-4 py-2 min-w-[120px] max-w-[140px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 whitespace-nowrap text-sm overflow-hidden text-ellipsis" onClick={() => setEdit(true)}>
          <Edit className="w-4 h-4" /> <span className="truncate">Редактировать</span>
        </button>
        <button className="flex items-center gap-1 px-4 py-2 min-w-[120px] max-w-[140px] rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-300 whitespace-nowrap text-sm overflow-hidden text-ellipsis" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" /> <span className="truncate">Удалить</span>
        </button>
      </div>
    </div>
  );
} 