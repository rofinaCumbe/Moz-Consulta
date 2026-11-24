"""
Módulo de Conexão com MongoDB (MongoDB Atlas ou Local)
Suporta conexão em nuvem gratuita via MONGODB_URI com fallback gracioso.
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("MONGODB_DB_NAME", "moz_consulta")

client = None
db = None

def get_database():
    """
    Obtém a conexão com a base de dados MongoDB.
    Retorna o objeto Database ou None se não configurado/offline.
    """
    global client, db

    if db is not None:
        return db

    if not MONGODB_URI:
        return None

    try:
        # Timeout de 15 segundos para conexões remotas seguras com o MongoDB Atlas
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=15000)
        # Testa a conexão
        client.admin.command('ping')
        db = client[DB_NAME]
        print(f"✅ Conectado ao MongoDB com sucesso: {DB_NAME}")
        return db
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        print(f"⚠️ Não foi possível conectar ao MongoDB: {e}. Usando dados locais.")
        return None


def get_collection(collection_name: str):
    """
    Retorna uma coleção específica do MongoDB ou None.
    """
    database = get_database()
    if database is not None:
        return database[collection_name]
    return None
