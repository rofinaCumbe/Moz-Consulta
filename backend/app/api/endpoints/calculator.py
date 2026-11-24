from fastapi import APIRouter, HTTPException
from app.schemas.calculator import (
    FeriasRequest,
    HorasExtrasRequest,
    RescisaoRequest,
    CalculationResponse
)
from app.services.calculator import LaborCalculatorMoz
from app.core.sectors_data import SETORES_MOCAMBIQUE

router = APIRouter(prefix="/calcular", tags=["Calculadora Laboral"])


@router.post("/ferias", response_model=CalculationResponse)
def calcular_ferias_endpoint(payload: FeriasRequest):
    res = LaborCalculatorMoz.calcular_ferias(
        salario_base=payload.salario_base,
        anos_trabalho=payload.anos_trabalho,
        meses_trabalho=payload.meses_trabalho,
        dias_nao_gozados=payload.dias_nao_gozados,
        tipo_contrato=payload.tipo_contrato
    )
    return CalculationResponse(
        tipo=res.tipo,
        salario_base=res.salario_base,
        salario_diario=res.salario_diario,
        salario_horario=res.salario_horario,
        detalhes=res.detalhes,
        total_a_receber=res.total_a_receber,
        passo_a_passo=res.passo_a_passo,
        artigo_lei=res.artigo_lei
    )


@router.post("/horas-extras", response_model=CalculationResponse)
def calcular_horas_extras_endpoint(payload: HorasExtrasRequest):
    res = LaborCalculatorMoz.calcular_horas_extras(
        salario_base=payload.salario_base,
        horas_diurnas=payload.horas_diurnas,
        horas_noturnas=payload.horas_noturnas,
        horas_descanso_feriado=payload.horas_descanso_feriado,
        horas_semanais=payload.horas_semanais
    )
    return CalculationResponse(
        tipo=res.tipo,
        salario_base=res.salario_base,
        salario_diario=res.salario_diario,
        salario_horario=res.salario_horario,
        detalhes=res.detalhes,
        total_a_receber=res.total_a_receber,
        passo_a_passo=res.passo_a_passo,
        artigo_lei=res.artigo_lei
    )


@router.post("/rescisao", response_model=CalculationResponse)
def calcular_rescisao_endpoint(payload: RescisaoRequest):
    sm_setor = payload.salario_minimo_setor

    if sm_setor is None:
        if payload.setor_id is not None:
            setor_encontrado = next((s for s in SETORES_MOCAMBIQUE if s["id"] == payload.setor_id), None)
            if setor_encontrado:
                sm_setor = setor_encontrado["salario_minimo"]
            else:
                raise HTTPException(status_code=404, detail="Setor de atividade não encontrado.")
        else:
            # Padrão: Setor 7 (Serviços Gerais / Comércio) caso não informado
            sm_setor = 8945.00

    res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
        salario_base=payload.salario_base,
        salario_minimo_setor=sm_setor,
        anos_servico=payload.anos_servico,
        meses_adicionais=payload.meses_adicionais,
        aviso_previo_pago=payload.aviso_previo_pago,
        ferias_vencidas_dias=payload.ferias_vencidas_dias,
        meses_trabalhados_ano_corrente=payload.meses_trabalhados_ano_corrente
    )

    return CalculationResponse(
        tipo=res.tipo,
        salario_base=res.salario_base,
        salario_diario=res.salario_diario,
        salario_horario=res.salario_horario,
        detalhes=res.detalhes,
        total_a_receber=res.total_a_receber,
        passo_a_passo=res.passo_a_passo,
        artigo_lei=res.artigo_lei
    )
