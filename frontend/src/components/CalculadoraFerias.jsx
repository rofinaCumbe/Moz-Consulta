import React, { useState } from 'react'

export default function CalculadoraFerias({ apiUrl = "" }) {
  const [salarioBase, setSalarioBase] = useState(25000)
  const [anosTrabalho, setAnosTrabalho] = useState(1)
  const [mesesTrabalho, setMesesTrabalho] = useState(0)
  const [tipoContrato, setTipoContrato] = useState("indeterminado")
  const [diasNaoGozados, setDiasNaoGozados] = useState("")
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  const calcularLocalmente = () => {
    const sb = Number(salarioBase)
    const sd = Math.round((sb / 30.0) * 100) / 100
    let dias = 12

    if (diasNaoGozados !== "" && Number(diasNaoGozados) > 0) {
      dias = Number(diasNaoGozados)
    } else if (tipoContrato === "prazo") {
      dias = Math.min(Number(mesesTrabalho), 12)
    } else if (Number(anosTrabalho) === 1) {
      dias = 12
    } else if (Number(anosTrabalho) > 1) {
      dias = 30
    } else {
      dias = Math.round((12 / 12) * Number(mesesTrabalho))
    }

    const total = Math.round(dias * sd * 100) / 100

    return {
      tipo: "Cálculo de Férias",
      salario_base: sb,
      salario_diario: sd,
      detalhes: { dias_de_ferias: dias },
      total_a_receber: total,
      artigo_lei: "Artigo 109 da Lei n.º 13/2023, de 25 de Agosto",
      passo_a_passo: `1. Salário Diário = ${sb.toLocaleString('pt-MZ')} ÷ 30 = ${sd.toFixed(2)} MZN/dia.\n2. Dias de Férias de Direito = ${dias} dias.\n3. Valor a Receber = ${dias} × ${sd.toFixed(2)} = ${total.toLocaleString('pt-MZ')} MZN.`
    }
  }

  const handleCalcular = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/v1/calcular/ferias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salario_base: Number(salarioBase),
          anos_trabalho: Number(anosTrabalho),
          meses_trabalho: Number(mesesTrabalho),
          tipo_contrato: tipoContrato,
          dias_nao_gozados: diasNaoGozados !== "" ? Number(diasNaoGozados) : null
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
            <span>🏖️</span> Cálculo de Férias (Artigo 109)
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            1.º ano = 12 dias; A partir do 2.º ano = 30 dias de calendário.
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
              Tipo de Contrato
            </label>
            <select
              value={tipoContrato}
              onChange={(e) => setTipoContrato(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
            >
              <option value="indeterminado">Contrato por Tempo Indeterminado (Efetivo)</option>
              <option value="prazo">Contrato a Prazo Certo (1 dia de férias por cada mês trabalhado)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Anos na Empresa</label>
              <input
                type="number"
                min="0"
                value={anosTrabalho}
                onChange={(e) => setAnosTrabalho(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Meses no Ano Atual</label>
              <input
                type="number"
                min="0"
                max="11"
                value={mesesTrabalho}
                onChange={(e) => setMesesTrabalho(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Dias de Férias Não Gozadas (Opcional - caso queira liquidar dias específicos)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ex: 15"
              value={diasNaoGozados}
              onChange={(e) => setDiasNaoGozados(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200"
          >
            {loading ? "A calcular..." : "Calcular Valor das Férias"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-6">
        {resultado ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Direito Apurado
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
              {Number(resultado.total_a_receber).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
            </h3>
            <p className="text-xs text-slate-500">{resultado.artigo_lei}</p>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-200">
              <div className="flex justify-between">
                <span>Dias de Férias a que tem direito:</span>
                <span className="font-bold text-emerald-800 text-base">
                  {resultado.detalhes?.dias_de_ferias} dias
                </span>
              </div>
              <div className="flex justify-between">
                <span>Remuneração Diária (SD):</span>
                <span className="font-semibold">{Number(resultado.salario_diario).toFixed(2)} MZN</span>
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

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <span>🖨️</span> Imprimir Recibo de Férias
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-slate-300 text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">🏖️</span>
            <h3 className="font-bold text-slate-700">Simulação de Férias</h3>
            <p className="text-sm max-w-sm mt-1">
              Descubra se tem direito a 12 ou 30 dias de descanso remunerado e qual o valor total em Meticais.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
