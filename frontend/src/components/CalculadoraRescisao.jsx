import React, { useState, useEffect } from 'react'

const SETORES_FALLBACK = [
  { id: 1, setor: "Setor 1: Agricultura, Pecuária e Silvicultura", salario_minimo: 5814.00 },
  { id: 2, setor: "Setor 2: Pesca (Industrial e Semi-Industrial)", salario_minimo: 6531.00 },
  { id: 3, setor: "Setor 3: Indústria de Extração Mineira", salario_minimo: 13408.00 },
  { id: 4, setor: "Setor 4: Indústria Transformadora", salario_minimo: 9335.00 },
  { id: 5, setor: "Setor 5: Eletricidade, Gás e Água", salario_minimo: 10475.00 },
  { id: 6, setor: "Setor 6: Construção Civil", salario_minimo: 7800.00 },
  { id: 7, setor: "Setor 7: Serviços Não Financeiros (Comércio, Hotelaria)", salario_minimo: 8945.00 },
  { id: 8, setor: "Setor 8: Serviços Financeiros (Bancos e Seguros)", salario_minimo: 17945.00 }
]

export default function CalculadoraRescisao({ apiUrl = "" }) {
  const [setores, setSetores] = useState(SETORES_FALLBACK)
  const [salarioBase, setSalarioBase] = useState(18000)
  const [setorId, setSetorId] = useState(7)
  const [anosServico, setAnosServico] = useState(2)
  const [mesesAdicionais, setMesesAdicionais] = useState(0)
  const [avisoPrevioPago, setAvisoPrevioPago] = useState(true)
  const [feriasVencidasDias, setFeriasVencidasDias] = useState(0)
  const [mesesAnoCorrente, setMesesAnoCorrente] = useState(0)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/setores`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setSetores(data))
      .catch(() => setSetores(SETORES_FALLBACK))
  }, [apiUrl])

  const setorSelecionado = setores.find(s => s.id === Number(setorId)) || setores[0]

  const calcularLocalmente = () => {
    const sb = Number(salarioBase)
    const sm = setorSelecionado.salario_minimo
    const sd = Math.round((sb / 30.0) * 100) / 100
    const multiplo = sb / sm

    let diasPorAno = 30
    let escalao = "Escalão A (até 7 SM): 30 dias de salário por ano"
    if (multiplo > 16.0) {
      diasPorAno = 3
      escalao = "Escalão D (superior a 16 SM): 3 dias por ano"
    } else if (multiplo > 10.0) {
      diasPorAno = 10
      escalao = "Escalão C (11 a 16 SM): 10 dias por ano"
    } else if (multiplo > 7.0) {
      diasPorAno = 15
      escalao = "Escalão B (8 a 10 SM): 15 dias por ano"
    }

    const anosTotais = Number(anosServico) + (Number(mesesAdicionais) / 12.0)
    const valorAntiguidade = Math.round(anosTotais * diasPorAno * sd * 100) / 100
    const valorAviso = avisoPrevioPago ? 0 : sb
    const valorFeriasVencidas = Math.round(Number(feriasVencidasDias) * sd * 100) / 100
    const diasProp = Math.round((30.0 / 12.0) * Number(mesesAnoCorrente))
    const valorFeriasProp = Math.round(diasProp * sd * 100) / 100
    const total = valorAntiguidade + valorAviso + valorFeriasVencidas + valorFeriasProp

    return {
      tipo: "Indemnização por Rescisão de Contrato",
      salario_base: sb,
      salario_diario: sd,
      salario_minimo_setor: sm,
      multiplo_sm: Math.round(multiplo * 100) / 100,
      escalao,
      dias_por_ano: diasPorAno,
      valor_antiguidade: valorAntiguidade,
      valor_aviso: valorAviso,
      valor_ferias_vencidas: valorFeriasVencidas,
      valor_ferias_prop: valorFeriasProp,
      total_a_receber: total,
      artigo_lei: "Artigos 139, 141 e 142 da Lei n.º 13/2023, de 25 de Agosto"
    }
  }

  const handleCalcular = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/v1/calcular/rescisao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salario_base: Number(salarioBase),
          setor_id: Number(setorId),
          anos_servico: Number(anosServico),
          meses_adicionais: Number(mesesAdicionais),
          aviso_previo_pago: Boolean(avisoPrevioPago),
          ferias_vencidas_dias: Number(feriasVencidasDias),
          meses_trabalhados_ano_corrente: Number(mesesAnoCorrente)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResultado({
          ...data,
          valor_antiguidade: data.detalhes?.indemnizacao_antiguidade || 0,
          valor_aviso: data.detalhes?.aviso_previo_indemnizado || 0,
          valor_ferias_vencidas: data.detalhes?.ferias_vencidas || 0,
          valor_ferias_prop: data.detalhes?.ferias_proporcionais || 0,
          escalao: data.detalhes?.escalao || "",
          multiplo_sm: data.detalhes?.multiplo_sm || 0,
          salario_minimo_setor: data.detalhes?.salario_minimo_setor || setorSelecionado.salario_minimo
        })
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
      {/* Formulário */}
      <div className="lg:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="border-b pb-4 mb-5">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> Cálculo de Rescisão / Indemnização
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Baseado nos escalões da nova Lei do Trabalho de Moçambique (Arts. 139, 141 e 142).
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
              Setor de Atividade (Salário Mínimo Setorial)
            </label>
            <select
              value={setorId}
              onChange={(e) => setSetorId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-sm"
            >
              {setores.map(s => (
                <option key={s.id} value={s.id}>
                  {s.setor} — {Number(s.salario_minimo).toLocaleString('pt-MZ')} MZN
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              * O escalão da indemnização depende do múltiplo entre o seu salário e o salário mínimo do seu setor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Anos de Trabalho</label>
              <input
                type="number"
                min="0"
                value={anosServico}
                onChange={(e) => setAnosServico(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Meses Adicionais</label>
              <input
                type="number"
                min="0"
                max="11"
                value={mesesAdicionais}
                onChange={(e) => setMesesAdicionais(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="avisoPrevio"
                checked={avisoPrevioPago}
                onChange={(e) => setAvisoPrevioPago(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <label htmlFor="avisoPrevio" className="text-sm text-slate-700">
                O empregador cumpriu o <strong>aviso prévio de 30 dias</strong>?
              </label>
            </div>
            {!avisoPrevioPago && (
              <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                Artigo 139: O empregador deve pagar 1 mês adicional de salário devido à falta de aviso prévio.
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dias de Férias Vencidas Não Gozadas
                </label>
                <input
                  type="number"
                  min="0"
                  value={feriasVencidasDias}
                  onChange={(e) => setFeriasVencidasDias(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meses Trabalhados no Ano Atual
                </label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={mesesAnoCorrente}
                  onChange={(e) => setMesesAnoCorrente(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200"
          >
            {loading ? "A calcular..." : "Calcular Direitos de Rescisão"}
          </button>
        </form>
      </div>

      {/* Resultado */}
      <div className="lg:col-span-6">
        {resultado ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <div className="border-b pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Resultado Oficial da Simulação
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                {Number(resultado.total_a_receber).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN
              </h3>
              <p className="text-xs text-slate-500 mt-1">{resultado.artigo_lei}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Salário Diário (SD = SB ÷ 30):</span>
                <span className="font-semibold">{Number(resultado.salario_diario).toFixed(2)} MZN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Salário Mínimo do Setor:</span>
                <span className="font-semibold">{Number(resultado.salario_minimo_setor).toLocaleString('pt-MZ')} MZN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600">Múltiplo do Salário Mínimo:</span>
                <span className="font-semibold text-emerald-800">{resultado.multiplo_sm}x SM</span>
              </div>
              <div className="py-2 bg-slate-50 px-3 rounded-lg text-xs text-slate-700">
                <strong>Enquadramento:</strong> {resultado.escalao}
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Indemnização por Antiguidade:</span>
                <span className="font-bold">{Number(resultado.valor_antiguidade).toLocaleString('pt-MZ')} MZN</span>
              </div>
              {resultado.valor_aviso > 0 && (
                <div className="flex justify-between text-amber-900">
                  <span>Compensação de Aviso Prévio:</span>
                  <span className="font-bold">+{Number(resultado.valor_aviso).toLocaleString('pt-MZ')} MZN</span>
                </div>
              )}
              {resultado.valor_ferias_vencidas > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Férias Vencidas Não Gozadas:</span>
                  <span className="font-bold">+{Number(resultado.valor_ferias_vencidas).toLocaleString('pt-MZ')} MZN</span>
                </div>
              )}
              {resultado.valor_ferias_prop > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Férias Proporcionais do Ano:</span>
                  <span className="font-bold">+{Number(resultado.valor_ferias_prop).toLocaleString('pt-MZ')} MZN</span>
                </div>
              )}
            </div>

            {resultado.passo_a_passo && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Passo a Passo da Conta (Memória de Cálculo)
                </h4>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {resultado.passo_a_passo}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2"
            >
              <span>🖨️</span> Imprimir / Guardar Recibo em PDF
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-slate-300 text-center text-slate-500 h-full flex flex-col items-center justify-center">
            <span className="text-4xl mb-3">🇲🇿</span>
            <h3 className="font-bold text-slate-700">Pronto para calcular</h3>
            <p className="text-sm max-w-sm mt-1">
              Preencha os dados do salário e tempo de trabalho ao lado para ver o valor exato da indemnização segundo a Lei n.º 13/2023.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
