"""
Base de Artigos Estruturados da Lei n.º 13/2023, de 25 de Agosto (Moçambique)
Para armazenamento no MongoDB e consulta semântica do RAG.
"""

ARTIGOS_LEI_13_2023 = [
    {
        "numero_artigo": 100,
        "titulo": "Remuneração do trabalho extraordinário",
        "topico": "horas_extras",
        "conteudo": (
            "1. O trabalho extraordinário prestado em dia normal de trabalho diurno é remunerado "
            "com o acréscimo de 50% do valor da remuneração normal da hora de trabalho.\n"
            "2. O trabalho extraordinário prestado no período nocturno, bem como em dia de descanso "
            "semanal e feriado obrigatório, é remunerado com o acréscimo de 100% do valor da hora normal."
        ),
        "palavras_chave": ["horas extras", "trabalho suplementar", "diurno", "nocturno", "feriado", "descanso semanal", "50%", "100%"]
    },
    {
        "numero_artigo": 109,
        "titulo": "Duração do período de férias",
        "topico": "ferias",
        "conteudo": (
            "1. O trabalhador tem direito a férias remuneradas em cada ano civil:\n"
            "a) 12 dias de calendário, no primeiro ano de trabalho efectivo;\n"
            "b) 30 dias de calendário, a partir do segundo ano de trabalho efectivo.\n"
            "2. O contrato de trabalho com duração determinada superior a três meses e inferior a um ano "
            "confere direito a um dia de férias por cada mês de serviço efectivo."
        ),
        "palavras_chave": ["férias", "12 dias", "30 dias", "primeiro ano", "segundo ano", "contrato a prazo", "dias de férias"]
    },
    {
        "numero_artigo": 113,
        "titulo": "Licença por maternidade",
        "topico": "maternidade",
        "conteudo": (
            "1. A trabalhadora tem direito, além das férias normais, a uma licença por maternidade "
            "de 90 dias consecutivos, que pode ter início 20 dias antes da data provável do parto.\n"
            "2. A licença de 90 dias referida no número anterior é gozada sem perda de remuneração."
        ),
        "palavras_chave": ["maternidade", "licença de maternidade", "90 dias", "parto", "grávida", "mãe"]
    },
    {
        "numero_artigo": 114,
        "titulo": "Licença por paternidade",
        "topico": "paternidade",
        "conteudo": (
            "1. O trabalhador tem direito a uma licença por paternidade de 7 dias, a gozar nos "
            "primeiros 30 dias a contar da data do nascimento do filho.\n"
            "2. Para o gozo da licença, o trabalhador deve informar previamente o empregador "
            "e apresentar a certidão de nascimento ou documento comprovativo emitido pela maternidade."
        ),
        "palavras_chave": ["paternidade", "licença de paternidade", "7 dias", "pai", "nascimento", "filho"]
    },
    {
        "numero_artigo": 139,
        "titulo": "Aviso prévio na rescisão",
        "topico": "aviso_previo",
        "conteudo": (
            "1. A rescisão do contrato de trabalho por tempo indeterminado, por iniciativa de qualquer "
            "das partes, com aviso prévio, deve ser comunicada por escrito à outra parte com antecedência mínima de 30 dias.\n"
            "2. A falta total ou parcial de aviso prévio obriga o empregador a indemnizar o trabalhador no "
            "valor da remuneração correspondente ao período de aviso em falta."
        ),
        "palavras_chave": ["aviso prévio", "30 dias", "rescisão", "comunicação", "falta de aviso", "compensação"]
    },
    {
        "numero_artigo": 141,
        "titulo": "Indemnização por cessação do contrato por iniciativa do empregador",
        "topico": "indemnizacao",
        "conteudo": (
            "1. A rescisão do contrato de trabalho por tempo indeterminado sem justa causa confere ao trabalhador "
            "o direito a uma indemnização calculada em função do seu salário mensal e dos salários mínimos do sector:\n"
            "a) De 1 a 7 salários mínimos: 30 dias de salário por cada ano de serviço ou fracção proporcional;\n"
            "b) De 8 a 10 salários mínimos: 15 dias de salário por cada ano de serviço ou fracção proporcional;\n"
            "c) De 11 a 16 salários mínimos: 10 dias de salário por cada ano de serviço ou fracção proporcional;\n"
            "d) Superior a 16 salários mínimos: 3 dias de salário por cada ano de serviço ou fracção proporcional."
        ),
        "palavras_chave": ["indemnização", "despedimento", "sem justa causa", "escalões", "salário mínimo", "anos de serviço", "30 dias", "15 dias", "10 dias", "3 dias"]
    },
    {
        "numero_artigo": 142,
        "titulo": "Cessação por motivos estruturais, tecnológicos ou de mercado",
        "topico": "indemnizacao",
        "conteudo": (
            "A rescisão de contratos fundada em motivos estruturais, tecnológicos ou de mercado da empresa "
            "obedece ao pagamento da indemnização prevista no artigo 141 da presente Lei."
        ),
        "palavras_chave": ["motivos estruturais", "crise", "mercado", "indemnização", "artigo 141"]
    }
]
