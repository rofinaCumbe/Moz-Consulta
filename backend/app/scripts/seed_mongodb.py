"""
Script de Inicialização (Seed) do MongoDB para o Moz-Consulta.
Povoa as coleções:
1. 'setores': Tabela oficial dos 8 setores e salários mínimos de Moçambique.
2. 'artigos_lei': Artigos da Lei n.º 13/2023 para busca textual e RAG.

Como executar:
python backend/app/scripts/seed_mongodb.py
"""

import sys
import os

# Adiciona o caminho raiz do backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.database import get_database
from app.core.sectors_data import SETORES_MOCAMBIQUE
from app.core.law_articles_data import ARTIGOS_LEI_13_2023


def seed():
    print("🚀 Iniciando seed do MongoDB...")
    db = get_database()

    if db is None:
        print("❌ Não foi possível conectar ao MongoDB. Verifique a variável MONGODB_URI no ficheiro .env")
        return

    # 1. Povoar Setores
    setores_col = db["setores"]
    setores_col.delete_many({}) # Limpa dados antigos para atualizar
    # Insere cópia dos setores sem modificar referências
    setores_para_inserir = [dict(s) for s in SETORES_MOCAMBIQUE]
    setores_col.insert_many(setores_para_inserir)
    print(f"✅ {len(setores_para_inserir)} setores inseridos na coleção 'setores'.")

    # 2. Povoar Artigos da Lei
    artigos_col = db["artigos_lei"]
    artigos_col.delete_many({})
    artigos_para_inserir = [dict(a) for a in ARTIGOS_LEI_13_2023]
    artigos_col.insert_many(artigos_para_inserir)
    print(f"✅ {len(artigos_para_inserir)} artigos inseridos na coleção 'artigos_lei'.")

    # 3. Criação de Índices de busca
    setores_col.create_index("id", unique=True)
    artigos_col.create_index([("titulo", "text"), ("conteudo", "text"), ("palavras_chave", "text")])
    print("✅ Índices de texto e ID criados com sucesso.")

    print("\n🎉 Base de dados MongoDB configurada com sucesso para o Moz-Consulta!")


if __name__ == "__main__":
    seed()
