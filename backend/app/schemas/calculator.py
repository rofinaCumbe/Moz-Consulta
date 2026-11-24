from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class FeriasRequest(BaseModel):
    salario_base: float = Field(..., gt=0, description="Salário base mensal em Meticais (MZN)")
    anos_trabalho: int = Field(0, ge=0, description="Anos completos de trabalho")
    meses_trabalho: int = Field(0, ge=0, le=11, description="Meses adicionais de trabalho")
    dias_nao_gozados: Optional[int] = Field(None, ge=0, description="Dias de férias vencidas e não gozadas")
    tipo_contrato: str = Field("indeterminado", description="'indeterminado' ou 'prazo'")


class HorasExtrasRequest(BaseModel):
    salario_base: float = Field(..., gt=0, description="Salário base mensal em Meticais (MZN)")
    horas_diurnas: float = Field(0.0, ge=0, description="Horas extras diurnas em dias úteis (+50%)")
    horas_noturnas: float = Field(0.0, ge=0, description="Horas extras noturnas das 20h às 06h (+100%)")
    horas_descanso_feriado: float = Field(0.0, ge=0, description="Horas em dias de folga ou feriados (+100%)")
    horas_semanais: int = Field(48, description="Carga semanal: 48h ou 40h")


class RescisaoRequest(BaseModel):
    salario_base: float = Field(..., gt=0, description="Salário base mensal em Meticais (MZN)")
    setor_id: Optional[int] = Field(None, description="ID do setor de atividade do trabalhador")
    salario_minimo_setor: Optional[float] = Field(None, description="Salário mínimo setorial customizado")
    anos_servico: int = Field(..., ge=0, description="Anos completos de serviço")
    meses_adicionais: int = Field(0, ge=0, le=11, description="Meses adicionais de serviço")
    aviso_previo_pago: bool = Field(True, description="True se o aviso prévio de 30 dias foi cumprido/concedido")
    ferias_vencidas_dias: int = Field(0, ge=0, description="Dias de férias vencidas em atraso")
    meses_trabalhados_ano_corrente: int = Field(0, ge=0, le=12, description="Meses de trabalho no ano civil corrente")


class CalculationResponse(BaseModel):
    tipo: str
    salario_base: float
    salario_diario: float
    salario_horario: float
    detalhes: Dict[str, Any]
    total_a_receber: float
    passo_a_passo: str
    artigo_lei: str
