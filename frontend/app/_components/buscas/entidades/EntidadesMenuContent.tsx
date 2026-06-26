import Link from 'next/link';
import { 
  BuildingLibraryIcon, 
  AcademicCapIcon, 
  UserGroupIcon, 
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const entidades = [
  { name: 'Campus', href: '/criar-entidades/campus', icon: BuildingLibraryIcon },
  { name: 'Setor', href: '/criar-entidades/setor', icon: BuildingLibraryIcon },
  { name: 'Serviço', href: '/criar-entidades/servico', icon: BuildingLibraryIcon },
  { name: 'Período', href: '/criar-entidades/periodo', icon: BookOpenIcon },
  { name: 'Curso', href: '/criar-entidades/curso', icon: AcademicCapIcon },
  { name: 'Disciplina', href: '/criar-entidades/disciplina', icon: BookOpenIcon },
  { name: 'Turma', href: '/criar-entidades/turma', icon: UserGroupIcon },
  { name: 'Matrícula', href: '/criar-entidades/matricula', icon: UserGroupIcon },
];

export default function EntidadesMenu() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Título com linha decorativa */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">O que deseja criar?</h1>
        <div className="w-1/3 h-px bg-gray-300 mx-auto"></div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {entidades.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-200"
          >
            <item.icon className="h-16 w-16 text-black mb-6 stroke-[1.5]" />
            <span className="font-bold text-lg text-gray-900">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}