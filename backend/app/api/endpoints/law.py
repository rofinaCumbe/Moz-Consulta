from fastapi import APIRouter, Query
from typing import List, Optional
from pydantic import BaseModel
from app.core.database import get_collection
from app.core.law_articles_data import ARTIGOS_LEI_13_2023

router = APIRouter(prefix="/lei", tags=["Legislação Laboral (Lei n.º 13/2023)"])


class ArtigoResponse(BaseModel):
    numero_artigo: int
    titulo: str
    topico: str
    conteudo: str
    palavras_chave: List[str]


@router.get("/artigos", response_model=List[ArtigoResponse])
def listar_ou_pesquisar_artigos(termo: Optional[str] = Query(None, description="Termo de pesquisa (ex: férias, paternidade)")):
    """
    Pesquisa artigos da Lei n.º 13/2023 no MongoDB (ou memória).
    """
    col = get_collection("artigos_lei")

    if col is not None and termo:
        try:
            # Busca de texto no MongoDB
            docs = list(col.find(
                {"$text": {"$search": termo}},
                {"_id": 0}
            ))
            if docs:
                return docs
        except Exception:
            pass

    if col is not None and not termo:
        try:
            docs = list(col.find({}, {"_id": 0}))
            if docs:
                return docs
        except Exception:
            pass

    # Fallback local
    if termo:
        t_clean = termo.lower()
        return [
            a for a in ARTIGOS_LEI_13_2023
            if t_clean in a["titulo"].lower()
            or t_clean in a["conteudo"].lower()
            or any(t_clean in kw.lower() for kw in a["palavras_chave"])
        ]

    return ARTIGOS_LEI_13_2023
