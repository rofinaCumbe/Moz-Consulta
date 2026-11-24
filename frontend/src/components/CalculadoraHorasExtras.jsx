import React, { useState } from 'react'

export default function CalculadoraHorasExtras({ apiUrl = "" }) {
  const [salarioBase, setSalarioBase] = useState(20800)
  const [horasDiurnas, setHorasDiurnas] = useState(8)
  const [horasNoturnas, setHorasNoturnas] = useState(0)
  const [horasFeriado, setHorasFeriado] = useState(0)
  const [horasSemanais, setHorasSemanais] = useState(48)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  const calcularLocalmente = () => {
    const sb = Number(salarioBase)
    const divisor = horasSemanais >= 48 ? 208.0 : 173.33
    const sh = Math.round((sb / divisor) * 100) / 100

    const valDiurnas = Math.round(Number(horasDiurnas) * sh * 1.50 * 100) / 100
    const valNoturnas = Math.round(Number(horasNoturnas) * sh * 2.00 * 100) / 100
    const valFeriados = Math.round(Number(horasFeriado) * sh * 2.00 * 100) / 100
    const total = valDiurnas + valNoturnas + valFeriados

    return {
      tipo: "Horas Extraordinárias",
      salario_base: sb,
      salario_horario: sh,
      detalhes: {
        valor_diurnas: valDiurnas,
        valor_noturnas: valNoturnas,
        valor_descanso_feriado: valFeriados
      },
      total_a_receber: total,
      artigo_lei: "Artigo 100 da Lei n.º 13/2023, de 25 de Agosto",
      passo_a_passo: `1. Salário Horário (SH) = ${sb.toLocaleString('pt-MZ')} ÷ ${divisor}h = ${sh.toFixed(2)} MZN/hora.\n2. Diurnas (+50%): ${horasDiurnas}h × (${sh.toFixed(2)} × 1.5) = ${valDiurnas.toFixed(2)} MZN.\n3. Noturnas (+100%): ${horasNoturnas}h × (${sh.toFixed(2)} × 2.0) = ${valNoturnas.toFixed(2)} MZN.\n4. Folga/Feriados (+100%): ${horasFeriado}h × (${sh.toFixed(2)} × 2.0) = ${valFeriados.toFixed(2)} MZN.\nTotal = ${total.toLocaleString('pt-MZ')} MZN.`
    }
  }

  const handleCalcular = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/v1/calcular/horas-extras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salario_base: Number(salarioBase),
          horas_diurnas: Number(horasDiurnas),
          horas_noturnas: Number(horasNoturnas),
          horas_descanso_feriado: Number(horasFeriado),
          horas_semanais: Number(horasSemanais)
        })
      })
      if (response.ok) {
        setResultado(await response.json())
      } else {
        setResultado(calcularLocalmente())
      }
    } catch {
      setResultado(calcularLocalmente())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="border-b pb-4 mb-5">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>⏰</span> Cálculo de Horas Extraordinárias (Artigo 100)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            +50% em dias úteis; +100% no período noturno (20h-06h) e feriados/descanso.
          </p>
        </div>

        <form onSubmit={handleCalcular} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Salário Base Mensal (MZN)
            </label>
            <input
              type="number"
              min="1000"
              step="100"
              value={salarioBase}
              onChange={(e) => setSalarioBase(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Regime Semanal de Trabalho
            </label>
            <select
              value={horasSemanais}
              onChange={(e) => setHorasSemanais(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
            >
              <option value={48}>Regime Geral: 48 horas semanais (Divisor: 208 horas/mês)</option>
              <option value={40}>Regime Especial: 40 horas semanais (Divisor: 173.33 horas/mês)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Horas Diurnas (+50%)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={horasDiurnas}
                onChange={(e) => setHorasDiurnas(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Noturnas (+100%)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={horasNoturnas}
                onChange={(e) => setHorasNoturnas(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Feriados (+100%)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={horasFeriado}
                onChange={(e) => setHorasFeriado(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200"
          >
            {loading ? "A calcular..." : "Calcular Trabalho Suplementar"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-6">
        {resultado ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Trabalho Suplementar Total
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
              {Number(resultado.total_a_receber).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
            </h3>
            <p className="text-xs text-slate-500">{resultado.artigo_lei}</p>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-200">
              <div className="flex justify-between">
                <span>Salário por Hora (SH):</span>
                <span className="font-semibold">{Number(resultado.salario_horario).toFixed(2)} MZN/h</span>
              </div>
              <div className="flex justify-between">
                <span>Total Horas Extras Diurnas (+50%):</span>
                <span className="font-semibold">{Number(resultado.detalhes?.valor_diurnas).toFixed(2)} MZN</span>
              </div>
              <div className="flex justify-between">
                <span>Total Horas Noturnas (+100%):</span>
                <span className="font-semibold">{Number(resultado.detalhes?.valor_noturnas).toFixed(2)} MZN</span>
              </div>
              <div className="flex justify-between">
                <span>Total Folgas / Feriados (+100%):</span>
                <span className="font-semibold">{Number(resultado.detalhes?.valor_descanso_feriado).toFixed(2)} MZN</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                Memória de Cálculo
              </h4>
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {resultado.passo_a_passo}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-slate-300 text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">⏰</span>
            <h3 className="font-bold text-slate-700">Simulação de Horas Extras</h3>
            <p className="text-sm max-w-sm mt-1">
              Saiba exatamente quanto deve receber pelas horas a mais trabalhadas em dias úteis, noites ou feriados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
