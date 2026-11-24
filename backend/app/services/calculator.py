"""
Módulo de Cálculo Laboral - Moçambique (Lei n.º 13/2023, de 25 de Agosto)
Responsável por todos os cálculos de direitos do trabalhador com exatidão matemática,
passo a passo detalhado e separação dos parâmetros variáveis (salário mínimo setorial).
"""

from typing import Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class CalculationResult:
    tipo: str
    salario_base: float
    salario_diario: float
    salario_horario: float
    detalhes: Dict[str, Any]
    total_a_receber: float
    passo_a_passo: str
    artigo_lei: str


class LaborCalculatorMoz:
    """
    Calculadora determinística dos direitos previstos na Lei n.º 13/2023 de Moçambique.
    """

    @staticmethod
    def get_salario_diario(salario_base: float) -> float:
        """Calcula o salário diário com base no divisor de 30 dias (Artigo 123)."""
        return round(salario_base / 30.0, 2)

    @staticmethod
    def get_salario_horario(salario_base: float, horas_semanais: int = 48) -> float:
        """
        Calcula o salário horário.
        48 horas semanais = 208 horas/mês (Artigo 96 e padrão da legislação laboral moçambicana).
        40 horas semanais = 173.33 horas/mês.
        """
        divisor_horas = 208.0 if horas_semanais >= 48 else 173.33
        return round(salario_base / divisor_horas, 2)

    @classmethod
    def calcular_ferias(
        cls,
        salario_base: float,
        anos_trabalho: int,
        meses_trabalho: int = 0,
        dias_nao_gozados: Optional[int] = None,
        tipo_contrato: str = "indeterminado"
    ) -> CalculationResult:
        """
        Cálculo de Férias e Férias Não Gozadas (Artigo 109 da Lei n.º 13/2023).
        - 1.º ano: 12 dias de calendário.
        - A partir do 2.º ano: 30 dias de calendário por ano.
        - Contratos a prazo certo (3 meses a 1 ano): 1 dia por mês de serviço efetivo.
        """
        sd = cls.get_salario_diario(salario_base)
        sh = cls.get_salario_horario(salario_base)

        if dias_nao_gozados is not None and dias_nao_gozados > 0:
            dias_calculo = dias_nao_gozados
            explicacao_dias = f"{dias_nao_gozados} dias de férias vencidas e não gozadas"
        else:
            if tipo_contrato.lower() == "prazo":
                dias_calculo = min(meses_trabalho, 12)
                explicacao_dias = f"{dias_calculo} dias (1 dia por cada mês trabalhado num contrato a prazo)"
            elif anos_trabalho < 1:
                # Menos de um ano completo: proporcional ao primeiro ano (12 dias anuais)
                dias_calculo = round((12 / 12) * meses_trabalho)
                explicacao_dias = f"{dias_calculo} dias proporcionais ({meses_trabalho} meses no 1.º ano a 1 dia/mês)"
            elif anos_trabalho == 1:
                dias_calculo = 12
                explicacao_dias = "12 dias de calendário (conclusão do 1.º ano de trabalho)"
            else:
                dias_calculo = 30
                explicacao_dias = f"30 dias de calendário (a partir do 2.º ano de trabalho efetivo, no ano {anos_trabalho})"

        valor_total = round(dias_calculo * sd, 2)

        passo_a_passo = (
            f"1. Salário Diário (SD) = {salario_base:,.2f} MZN ÷ 30 dias = {sd:,.2f} MZN/dia.\n"
            f"2. Direito a Férias (Art. 109): {explicacao_dias}.\n"
            f"3. Valor das Férias = {dias_calculo} dias × {sd:,.2f} MZN = {valor_total:,.2f} MZN."
        )

        return CalculationResult(
            tipo="Cálculo de Férias",
            salario_base=salario_base,
            salario_diario=sd,
            salario_horario=sh,
            detalhes={
                "dias_de_ferias": dias_calculo,
                "anos_trabalho": anos_trabalho,
                "meses_trabalho": meses_trabalho,
                "tipo_contrato": tipo_contrato
            },
            total_a_receber=valor_total,
            passo_a_passo=passo_a_passo,
            artigo_lei="Artigo 109 da Lei n.º 13/2023, de 25 de Agosto"
        )

    @classmethod
    def calcular_horas_extras(
        cls,
        salario_base: float,
        horas_diurnas: float = 0.0,
        horas_noturnas: float = 0.0,
        horas_descanso_feriado: float = 0.0,
        horas_semanais: int = 48
    ) -> CalculationResult:
        """
        Cálculo de Horas Extraordinárias / Trabalho Suplementar (Artigo 100 da Lei n.º 13/2023).
        - Diurnas: acréscimo de 50% (fator 1.5).
        - Noturnas (20h às 06h): acréscimo de 100% (fator 2.0).
        - Descanso semanal e feriados: acréscimo de 100% (fator 2.0).
        """
        sd = cls.get_salario_diario(salario_base)
        sh = cls.get_salario_horario(salario_base, horas_semanais)

        val_diurnas = round(horas_diurnas * sh * 1.50, 2)
        val_noturnas = round(horas_noturnas * sh * 2.00, 2)
        val_feriados = round(horas_descanso_feriado * sh * 2.00, 2)
        total = round(val_diurnas + val_noturnas + val_feriados, 2)

        passo = (
            f"1. Salário Horário (SH) = {salario_base:,.2f} MZN ÷ {'208' if horas_semanais>=48 else '173.33'}h = {sh:,.2f} MZN/hora.\n"
            f"2. Horas Extras Diurnas (+50%): {horas_diurnas}h × ({sh:,.2f} × 1.5) = {val_diurnas:,.2f} MZN.\n"
            f"3. Horas Extras Noturnas (+100%): {horas_noturnas}h × ({sh:,.2f} × 2.0) = {val_noturnas:,.2f} MZN.\n"
            f"4. Horas em Descanso/Feriado (+100%): {horas_descanso_feriado}h × ({sh:,.2f} × 2.0) = {val_feriados:,.2f} MZN.\n"
            f"5. Total de Trabalho Suplementar = {total:,.2f} MZN."
        )

        return CalculationResult(
            tipo="Horas Extraordinárias",
            salario_base=salario_base,
            salario_diario=sd,
            salario_horario=sh,
            detalhes={
                "horas_diurnas": horas_diurnas,
                "horas_noturnas": horas_noturnas,
                "horas_descanso_feriado": horas_descanso_feriado,
                "valor_diurnas": val_diurnas,
                "valor_noturnas": val_noturnas,
                "valor_descanso_feriado": val_feriados
            },
            total_a_receber=total,
            passo_a_passo=passo,
            artigo_lei="Artigo 100 da Lei n.º 13/2023, de 25 de Agosto"
        )

    @classmethod
    def calcular_indemnizacao_rescisao(
        cls,
        salario_base: float,
        salario_minimo_setor: float,
        anos_servico: int,
        meses_adicionais: int = 0,
        aviso_previo_pago: bool = True,
        ferias_vencidas_dias: int = 0,
        meses_trabalhados_ano_corrente: int = 0
    ) -> CalculationResult:
        """
        Cálculo de Indemnização por Rescisão Sem Justa Causa / Motivos Estruturais
        (Artigos 139, 141 e 142 da Lei n.º 13/2023).
        A fórmula de dias por ano depende da relação (múltiplo) entre o Salário Base e o Salário Mínimo do Setor:
          - Até 7 SM: 30 dias por ano.
          - Entre 8 e 10 SM: 15 dias por ano.
          - Entre 11 e 16 SM: 10 dias por ano.
          - Superior a 16 SM: 3 dias por ano.
        """
        sd = cls.get_salario_diario(salario_base)
        sh = cls.get_salario_horario(salario_base)

        multiplo_sm = salario_base / salario_minimo_setor if salario_minimo_setor > 0 else 1.0

        if multiplo_sm <= 7.0:
            dias_por_ano = 30
            escalao = "Escalão A (1 a 7 Salários Mínimos): 30 dias por cada ano de serviço"
        elif multiplo_sm <= 10.0:
            dias_por_ano = 15
            escalao = "Escalão B (8 a 10 Salários Mínimos): 15 dias por cada ano de serviço"
        elif multiplo_sm <= 16.0:
            dias_por_ano = 10
            escalao = "Escalão C (11 a 16 Salários Mínimos): 10 dias por cada ano de serviço"
        else:
            dias_por_ano = 3
            escalao = "Escalão D (Superior a 16 Salários Mínimos): 3 dias por cada ano de serviço"

        tempo_total_anos = anos_servico + (meses_adicionais / 12.0)
        valor_indemnizacao_antiguidade = round(tempo_total_anos * dias_por_ano * sd, 2)

        # Aviso Prévio (Artigo 139): Se não foi dado o aviso prévio de 30 dias, paga 1 mês de salário
        valor_aviso_previo = 0.0 if aviso_previo_pago else round(salario_base, 2)

        # Férias vencidas e não gozadas
        valor_ferias_vencidas = round(ferias_vencidas_dias * sd, 2)

        # Férias proporcionais do ano corrente (Artigo 109)
        dias_prop = round((30.0 / 12.0) * meses_trabalhados_ano_corrente) if anos_servico >= 1 else round((12.0 / 12.0) * meses_trabalhados_ano_corrente)
        valor_ferias_proporcionais = round(dias_prop * sd, 2)

        total_final = round(
            valor_indemnizacao_antiguidade + valor_aviso_previo + valor_ferias_vencidas + valor_ferias_proporcionais,
            2
        )

        passo = (
            f"1. Relação com o Salário Mínimo do Setor ({salario_minimo_setor:,.2f} MZN):\n"
            f"   - Salário Base: {salario_base:,.2f} MZN ÷ {salario_minimo_setor:,.2f} MZN = {multiplo_sm:.2f} salários mínimos.\n"
            f"   - Enquadramento: {escalao}.\n"
            f"2. Tempo de Serviço Computado: {anos_servico} anos e {meses_adicionais} meses ({tempo_total_anos:.2f} anos).\n"
            f"3. Salário Diário (SD) = {salario_base:,.2f} MZN ÷ 30 = {sd:,.2f} MZN/dia.\n"
            f"4. Indemnização por Antiguidade = {tempo_total_anos:.2f} anos × {dias_por_ano} dias × {sd:,.2f} MZN = {valor_indemnizacao_antiguidade:,.2f} MZN.\n"
        )

        if not aviso_previo_pago:
            passo += f"5. Falta de Aviso Prévio (Art. 139): +{valor_aviso_previo:,.2f} MZN (1 mês de salário).\n"

        if ferias_vencidas_dias > 0:
            passo += f"6. Férias Vencidas ({ferias_vencidas_dias} dias): +{valor_ferias_vencidas:,.2f} MZN.\n"

        if meses_trabalhados_ano_corrente > 0:
            passo += f"7. Férias Proporcionais ({dias_prop} dias por {meses_trabalhados_ano_corrente} meses): +{valor_ferias_proporcionais:,.2f} MZN.\n"

        passo += f"\nTOTAL A RECEBER NA RESCISÃO = {total_final:,.2f} MZN."

        return CalculationResult(
            tipo="Indemnização por Rescisão de Contrato",
            salario_base=salario_base,
            salario_diario=sd,
            salario_horario=sh,
            detalhes={
                "salario_minimo_setor": salario_minimo_setor,
                "multiplo_sm": round(multiplo_sm, 2),
                "dias_por_ano_aplicados": dias_por_ano,
                "escalao": escalao,
                "tempo_total_anos": round(tempo_total_anos, 2),
                "indemnizacao_antiguidade": valor_indemnizacao_antiguidade,
                "aviso_previo_indemnizado": valor_aviso_previo,
                "ferias_vencidas": valor_ferias_vencidas,
                "ferias_proporcionais": valor_ferias_proporcionais
            },
            total_a_receber=total_final,
            passo_a_passo=passo,
            artigo_lei="Artigos 139, 141 e 142 da Lei n.º 13/2023, de 25 de Agosto"
        )
