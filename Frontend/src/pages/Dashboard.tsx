import Layout from '../components/layout/Layout'

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
          <div className="flex min-w-72 flex-col gap-1">
            <p className="text-gray-900 dark:text-white text-4xl font-black tracking-[-0.033em]">¡Hola!</p>
            <p className="text-gray-500 dark:text-[#92b7c9]">Vamos a ver tu progreso de hoy.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-6">
              <p className="text-gray-900 dark:text-white font-medium">Peso Levantado (lbs)</p>
              <p className="text-gray-900 dark:text-white text-[32px] font-bold">1,200</p>
              <div className="flex gap-1 items-center">
                <p className="text-gray-500 dark:text-[#92b7c9] text-sm">Últimos 7 días</p>
                <p className="text-[#0bda57] text-sm font-medium">+10%</p>
              </div>
              <div className="min-h-[220px] py-4">
                {/* Placeholder chart */}
                <div className="h-48 w-full bg-gradient-to-b from-primary/30 to-transparent rounded-md" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-6">
            {[
              { t: 'Entrenamientos este mes', v: '12', d: '+5%' },
              { t: 'Récord Personal', v: '150 lbs', d: '+2%' },
              { t: 'Calorías Quemadas', v: '3,500', d: '+8%' },
            ].map((s) => (
              <div key={s.t} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1a2831] border border-gray-200 dark:border-[#325567]">
                <p className="text-gray-900 dark:text-white font-medium">{s.t}</p>
                <p className="text-gray-900 dark:text-white text-2xl font-bold">{s.v}</p>
                <p className="text-[#0bda57] font-medium">{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick access */}
        <div>
          <h2 className="text-gray-900 dark:text-white text-[22px] font-bold pb-3 pt-5">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'search', label: 'Explorar Ejercicios', href: '/exercises' },
              { icon: 'query_stats', label: 'Estadísticas Detalladas', href: '#' },
              { icon: 'smart_toy', label: 'Asistente AI', href: '#' },
            ].map((x) => (
              <a key={x.label} href={x.href}
                className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl bg-white dark:bg-[#1a2831] border border-gray-200 dark:border-[#325567] hover:border-primary dark:hover:border-primary transition-colors focus-visible:ring-2 ring-primary">
                <span className="material-symbols-outlined text-primary text-4xl" aria-hidden>{x.icon}</span>
                <p className="text-gray-900 dark:text-white font-semibold">{x.label}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
