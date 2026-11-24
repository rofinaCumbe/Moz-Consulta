"""
Tabela Oficial de Salários Mínimos por Setor de Atividade em Moçambique.
Parâmetro Variável: Pode ser atualizado anualmente via Painel do Administrador ou BD.
Valores de referência dos decretos do Conselho de Ministros de Moçambique.
"""

from typing import List, Dict, Any

SETORES_MOCAMBIQUE: List[Dict[str, Any]] = [
    {
        "id": 1,
        "setor": "Setor 1: Agricultura, Pecuária, Caça e Silvicultura",
        "salario_minimo": 5814.00,
        "ano_vigencia": 2024
    },
    {
        "id": 2,
        "setor": "Setor 2: Pesca (Industrial e Semi-Industrial)",
        "salario_minimo": 6531.00,
        "ano_vigencia": 2024
    },
    {
        "id": 3,
        "setor": "Setor 3: Indústria de Extração Mineira (Grandes Empresas)",
        "salario_minimo": 13408.00,
        "ano_vigencia": 2024
    },
    {
        "id": 4,
        "setor": "Setor 4: Indústria Transformadora",
        "salario_minimo": 9335.00,
        "ano_vigencia": 2024
    },
    {
        "id": 5,
        "setor": "Setor 5: Produção e Distribuição de Eletricidade, Gás e Água",
        "salario_minimo": 10475.00,
        "ano_vigencia": 2024
    },
    {
        "id": 6,
        "setor": "Setor 6: Construção Civil",
        "salario_minimo": 7800.00,
        "ano_vigencia": 2024
    },
    {
        "id": 7,
        "setor": "Setor 7: Atividades dos Serviços Não Financeiros (Comércio, Hotelaria)",
        "salario_minimo": 8945.00,
        "ano_vigencia": 2024
    },
    {
        "id": 8,
        "setor": "Setor 8: Atividades dos Serviços Financeiros (Bancos e Seguros)",
        "salario_minimo": 17945.00,
        "ano_vigencia": 2024
    }
]
