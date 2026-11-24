import React from 'react'

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'rescisao', label: 'Indemnização / Rescisão', icon: '📋' },
    { id: 'ferias', label: 'Cálculo de Férias', icon: '🏖️' },
    { id: 'horas', label: 'Horas Extras', icon: '⏰' },
    { id: 'chat', label: 'Perguntas à Lei (Chat)', icon: '💬' },
    { id: 'admin', label: 'Painel Admin', icon: '⚙️' }
  ]

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇲🇿</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Moz-Consulta</h1>
            <p className="text-xs text-emerald-200">
              Direitos Laborais & Lei do Trabalho (Lei n.º 13/2023)
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-1 md:gap-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-950 text-amber-300 shadow-inner'
                    : 'text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
