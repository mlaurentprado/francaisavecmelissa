import React, { useState } from 'react';
import { X, User, Lock, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { studentPortalService } from '../../services/studentPortalService';
import { StudentProfile } from '../../types';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [students] = useState<StudentProfile[]>(() => studentPortalService.getStudents());
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [pin, setPin] = useState<string>('1234');
  const [teacherPassword, setTeacherPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = studentPortalService.loginStudent(selectedStudentId, pin);
    if (result.success) {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(result.message || 'Erro ao entrar.');
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = studentPortalService.loginTeacher(teacherPassword);
    if (result.success) {
      onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(result.message || 'Senha incorreta.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EBE4D8] p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-[#FAF7F2] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-cormorant text-3xl font-bold text-[#0F172A]">
              Espace Élèves
            </span>
            <span className="text-[#C59B27] text-xl">✦</span>
          </div>
          <p className="text-xs text-[#5A6578]">
            Acesse seus resumos semanais, materiais, vídeos e lições pós-aula.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#EBE4D8] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Sou Aluno(a)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('teacher');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              role === 'teacher'
                ? 'bg-[#8B2626] text-white shadow-2xs'
                : 'text-[#5A6578] hover:text-[#0F172A]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Professora Melissa</span>
          </button>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {/* Student Login Form */}
        {role === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Selecione seu Perfil de Aluno :
              </label>
              <div className="space-y-2">
                {students.map((student) => {
                  const isSelected = selectedStudentId === student.id;
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#8B2626] bg-[#FCE7E7]/40 ring-1 ring-[#8B2626]'
                          : 'border-[#EBE4D8] bg-white hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EFE8DC] text-[#63513D] font-bold text-xs flex items-center justify-center border border-[#DDD3C1]">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">{student.name}</p>
                          <p className="text-[11px] text-[#78644E]">Nível {student.level} • {student.totalPoints} pts</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8B2626]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center justify-between">
                <span>Seu PIN (4 dígitos) :</span>
                <span className="text-[10px] text-[#78644E] font-normal">Padrão de teste: 1234</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Ex: 1234"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] focus:ring-2 focus:ring-[#8B2626]/20 outline-none text-sm font-bold tracking-widest text-[#0F172A] bg-[#FAF7F2]/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar no meu Espaço</span>
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
            </button>
          </form>
        )}

        {/* Teacher Login Form */}
        {role === 'teacher' && (
          <form onSubmit={handleTeacherSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5 flex items-center justify-between">
                <span>Senha da Professora Melissa :</span>
                <span className="text-[10px] text-[#78644E] font-normal">Senha de teste: melissa2026</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4C8B8] focus:border-[#8B2626] focus:ring-2 focus:ring-[#8B2626]/20 outline-none text-sm text-[#0F172A] bg-[#FAF7F2]/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#8B2626] hover:bg-[#731E1E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Acessar Painel de Gestão</span>
              <GraduationCap className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
