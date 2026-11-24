import React, { useState } from 'react'
import Navbar from './components/Navbar'
import CalculadoraRescisao from './components/CalculadoraRescisao'
import CalculadoraFerias from './components/CalculadoraFerias'
import CalculadoraHorasExtras from './components/CalculadoraHorasExtras'
import ChatAssistente from './components/ChatAssistente'
import PainelAdmin from './components/PainelAdmin'

export default function App() {
  const [activeTab, setActiveTab] = useState('rescisao')

  // No deploy da Vercel, caso exista a variável de ambiente VITE_API_URL, ela é usada.
  // Em desenvolvimento local aponta para localhost:8000
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        {/* Banner de Apresentação / Contexto Moçambique */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium mb-1.5">
              <span>🇲🇿</span> República de Moçambique
            </div>
            <h2 className="text-lg md:text-xl font-bold">
              Plataforma de Consulta e Cálculo da Lei n.º 13/2023
            </h2>
            <p className="text-xs text-emerald-100 max-w-2xl mt-0.5">
              Calcule indemnizações, férias e horas extras com exatidão matemática segundo o salário mínimo do seu setor, ou tire dúvidas no chat oficial.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2.5 py-1 rounded-lg">
              100% Gratuito
            </span>
          </div>
        </div>

        {/* Conteúdo Dinâmico das Abas */}
        {activeTab === 'rescisao' && <CalculadoraRescisao apiUrl={apiUrl} />}
        {activeTab === 'ferias' && <CalculadoraFerias apiUrl={apiUrl} />}
        {activeTab === 'horas' && <CalculadoraHorasExtras apiUrl={apiUrl} />}
        {activeTab === 'chat' && <ChatAssistente apiUrl={apiUrl} />}
        {activeTab === 'admin' && <PainelAdmin apiUrl={apiUrl} />}
      </main>

      {/* Rodapé Ético e Metodológico */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              Moz-Consulta — Engenharia em Tecnologia e Sistemas de Informação
            </p>
            <p className="text-slate-500 mt-0.5">
              Apoio aos direitos laborais dos cidadãos moçambicanos | Lei n.º 13/2023, de 25 de Agosto.
            </p>
          </div>
          <div className="text-slate-400 text-[11px] max-w-md bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
            <strong>Aviso Legal & Ético:</strong> Esta plataforma tem caráter informativo e de apoio cívico. Os cálculos são realizados conforme as fórmulas oficiais da Lei n.º 13/2023. Não guardamos dados pessoais nem salários dos utilizadores.
          </div>
        </div>
      </footer>
    </div>
  )
}
