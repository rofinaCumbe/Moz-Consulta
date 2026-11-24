from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.sectors import SetorSchema, SetorUpdate
from app.core.sectors_data import SETORES_MOCAMBIQUE
from app.core.database import get_collection

router = APIRouter(prefix="/setores", tags=["Setores e Salários Mínimos"])


@router.get("", response_model=List[SetorSchema])
def listar_setores():
    """
    Retorna a lista oficial de setores e salários mínimos em vigor em Moçambique.
    Busca no MongoDB se disponível; caso contrário, usa os dados parametrizados locais.
    """
    col = get_collection("setores")
    if col is not None:
        try:
            docs = list(col.find({}, {"_id": 0}))
            if docs:
                return docs
        except Exception:
            pass

    return SETORES_MOCAMBIQUE


@router.get("/{setor_id}", response_model=SetorSchema)
def obter_setor(setor_id: int):
    col = get_collection("setores")
    if col is not None:
        try:
            doc = col.find_one({"id": setor_id}, {"_id": 0})
            if doc:
                return doc
        except Exception:
            pass

    setor = next((s for s in SETORES_MOCAMBIQUE if s["id"] == setor_id), None)
    if not setor:
        raise HTTPException(status_code=404, detail="Setor não encontrado.")
    return setor


@router.put("/{setor_id}", response_model=SetorSchema)
def atualizar_salario_minimo(setor_id: int, payload: SetorUpdate):
    """
    Atualiza o salário mínimo de um setor no MongoDB e em memória.
    Demonstra a facilidade de reajuste sem alterar o código de regras da lei.
    """
    col = get_collection("setores")
    if col is not None:
        try:
            col.update_one(
                {"id": setor_id},
                {"$set": {"salario_minimo": payload.salario_minimo, "ano_vigencia": payload.ano_vigencia}}
            )
            doc = col.find_one({"id": setor_id}, {"_id": 0})
            if doc:
                return doc
        except Exception:
            pass

    for s in SETORES_MOCAMBIQUE:
        if s["id"] == setor_id:
            s["salario_minimo"] = payload.salario_minimo
            s["ano_vigencia"] = payload.ano_vigencia
            return s

    raise HTTPException(status_code=404, detail="Setor não encontrado.")
