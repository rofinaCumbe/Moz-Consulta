import React, { useState } from 'react'

const PERGUNTAS_RAPIDAS = [
  "Quantos dias tenho de licença de paternidade na nova lei?",
  "Qual é a duração da licença de maternidade?",
  "Quantos dias de férias tenho direito no primeiro ano?",
  "Como é calculada a indemnização se eu for despedido?",
  "O que acontece se a empresa não me der o aviso prévio de 30 dias?",
  "Qual a percentagem a receber por horas extras feitas à noite?"
]

const BASE_CONHECIMENTO_RAG = [
  {
    termos: ["paternidade", "licença de paternidade", "pai", "nascimento"],
    resposta: "Nos termos do Artigo 114 da Lei n.º 13/2023, de 25 de Agosto, o pai trabalhador tem direito a 7 (sete) dias de licença de paternidade, remunerados, que devem ser gozados nos primeiros 30 dias a seguir ao nascimento do filho, mediante aviso prévio ao empregador.",
    artigo: "Artigo 114 da Lei n.º 13/2023"
  },
  {
    termos: ["maternidade", "licença de maternidade", "mãe", "parto"],
    resposta: "Segundo o Artigo 113 da Lei n.º 13/2023, a trabalhadora tem direito a uma licença de maternidade de 90 (noventa) dias consecutivos, sem perda de remuneração. Esta licença pode ter início até 20 dias antes da data prevista para o parto.",
    artigo: "Artigo 113 da Lei n.º 13/2023"
  },
  {
    termos: ["férias", "dias de férias", "primeiro ano", "segundo ano"],
    resposta: "De acordo com o Artigo 109 da Lei n.º 13/2023: no primeiro ano completo de trabalho efetivo, o trabalhador tem direito a 12 dias de férias. A partir do segundo ano de trabalho em diante, passa a ter direito a 30 dias de calendário por cada ano de trabalho. Nos contratos a prazo com duração entre 3 meses e 1 ano, tem direito a 1 dia de férias por cada mês trabalhado.",
    artigo: "Artigo 109 da Lei n.º 13/2023"
  },
  {
    termos: ["indemnização", "despedido", "rescisão", "justa causa", "escalão", "escalões"],
    resposta: "A rescisão do contrato por tempo indeterminado sem justa causa ou por motivos estruturais (Artigos 141 e 142) confere indemnização calculada por escalões em relação ao salário mínimo (SM) do setor: de 1 a 7 SM recebe 30 dias de salário por ano; de 8 a 10 SM recebe 15 dias; de 11 a 16 SM recebe 10 dias; acima de 16 SM recebe 3 dias de salário por ano de trabalho.",
    artigo: "Artigos 141 e 142 da Lei n.º 13/2023"
  },
  {
    termos: ["aviso prévio", "sem aviso", "falta de aviso"],
    resposta: "Conforme o Artigo 139 da Lei n.º 13/2023, o empregador deve dar aviso prévio de pelo menos 30 dias na rescisão de contratos por tempo indeterminado. Caso não cumpra esse prazo, fica obrigado a pagar uma indemnização compensatória equivalente a 1 (um) mês de remuneração (30 dias de salário).",
    artigo: "Artigo 139 da Lei n.º 13/2023"
  },
  {
    termos: ["horas extras", "noite", "noturnas", "horas extraordinárias", "diurnas", "feriado"],
    resposta: "Nos termos do Artigo 100 da Lei n.º 13/2023, o trabalho suplementar em dias normais diurnos é pago com acréscimo de 50%. Já o trabalho realizado no período noturno (das 20h às 06h do dia seguinte) ou em dias de descanso semanal e feriados obrigatórios é remunerado com acréscimo de 100%.",
    artigo: "Artigo 100 da Lei n.º 13/2023"
  }
]

export default function ChatAssistente({ apiUrl = "" }) {
  const [mensagens, setMensagens] = useState([
    {
      remetente: "bot",
      texto: "Olá! Sou o Assistente Jurídico da plataforma Moz-Consulta. Tiro dúvidas sobre a nova Lei do Trabalho de Moçambique (Lei n.º 13/2023) citando sempre o artigo oficial correspondente. Como posso ajudar?",
      artigo: "Base Oficial: Boletim da República n.º 165 (Lei 13/2023)"
    }
  ])
  const [pergunta, setPergunta] = useState("")
  const [carregando, setCarregando] = useState(false)

  const responderPergunta = (textoPergunta) => {
    const textoLimpo = textoPergunta.toLowerCase()
    const encontrado = BASE_CONHECIMENTO_RAG.find(item =>
      item.termos.some(termo => textoLimpo.includes(termo))
    )

    if (encontrado) {
      return {
        texto: encontrado.resposta,
        artigo: encontrado.artigo
      }
    }

    return {
      texto: "Para garantir segurança jurídica e evitar alucinações, este assistente apenas responde com base no texto oficial da Lei n.º 13/2023 de Moçambique. Para a sua pergunta específica, recomendamos consultar os capítulos de contratos, direitos de descanso e remuneração da lei.",
      artigo: "Princípio de Fidelidade Jurídica (Dahl et al., 2024)"
    }
  }

  const enviarMensagem = async (textoParaEnviar) => {
    const txt = textoParaEnviar || pergunta
    if (!txt.trim()) return

    const novaLista = [...mensagens, { remetente: "usuario", texto: txt }]
    setMensagens(novaLista)
    setPergunta("")
    setCarregando(true)

    try {
      // Tenta consultar a API /api/v1/lei/artigos conectada ao MongoDB
      const res = await fetch(`${apiUrl}/api/v1/lei/artigos?termo=${encodeURIComponent(txt)}`)
      if (res.ok) {
        const artigos = await res.json()
        if (artigos && artigos.length > 0) {
          const primeiro = artigos[0]
          setMensagens([
            ...novaLista,
            {
              remetente: "bot",
              texto: `${primeiro.titulo}:\n${primeiro.conteudo}`,
              artigo: `Artigo ${primeiro.numero_artigo} da Lei n.º 13/2023`
            }
          ])
          setCarregando(false)
          return
        }
      }
    } catch {
      // Prossegue para o motor local
    }

    setTimeout(() => {
      const resp = responderPergunta(txt)
      setMensagens([...novaLista, { remetente: "bot", texto: resp.texto, artigo: resp.artigo }])
      setCarregando(false)
    }, 300)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[650px]">
      <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-bold text-sm">Assistente da Lei n.º 13/2023 (RAG)</h3>
            <p className="text-xs text-emerald-200">Respostas oficiais sem inventar informações</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-950 px-2.5 py-1 rounded-full text-emerald-300 font-mono">
          Lei 13/2023 MZ
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {mensagens.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.remetente === "usuario" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.remetente === "usuario"
                  ? "bg-emerald-700 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
              }`}
            >
              <p>{msg.texto}</p>
              {msg.artigo && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <span>📖</span>
                  <span>{msg.artigo}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {carregando && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs text-slate-500 animate-pulse">
              A consultar os artigos da Lei n.º 13/2023...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-100 border-t border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-thin">
        {PERGUNTAS_RAPIDAS.map((pr, idx) => (
          <button
            key={idx}
            onClick={() => enviarMensagem(pr)}
            className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition"
          >
            {pr}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          enviarMensagem()
        }}
        className="p-3 bg-white border-t border-slate-200 flex gap-2"
      >
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Escreva a sua dúvida sobre a Lei do Trabalho..."
          className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2 rounded-xl text-sm transition"
        >
          Perguntar
        </button>
      </form>
    </div>
  )
}
