from pydantic import BaseModel, Field


class SetorSchema(BaseModel):
    id: int
    setor: str
    salario_minimo: float
    ano_vigencia: int


class SetorUpdate(BaseModel):
    salario_minimo: float = Field(..., gt=0, description="Novo salário mínimo do setor em Meticais")
    ano_vigencia: int = Field(..., ge=2024, description="Ano de vigência do novo decreto")
