"""
Suíte de Testes Automatizados - 15 Casos de Teste de Cálculo Laboral
Conforme metodologia descrita no Capítulo 3 da proposta de TCC:
"Amostra de Testes Técnicos do Sistema, composta por 15 simulações diferentes de cálculos laborais
(férias, indemnizações e horas extras com diferentes salários e anos de serviço)."
Meta esperada: 100% dos cálculos certos.
"""

import unittest
import sys
import os

# Adiciona o caminho raiz do backend ao sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.calculator import LaborCalculatorMoz


class TestCalculadoraLaboralMoz(unittest.TestCase):

    # -------------------------------------------------------------
    # CASOS 1 a 5: CÁLCULO DE FÉRIAS (Artigo 109)
    # -------------------------------------------------------------
    def test_caso_01_ferias_primeiro_ano_completo(self):
        """Caso 1: Trabalhador com 1 ano de trabalho (12 dias). Salário: 15.000 MZN."""
        res = LaborCalculatorMoz.calcular_ferias(salario_base=15000.0, anos_trabalho=1)
        self.assertEqual(res.detalhes["dias_de_ferias"], 12)
        self.assertEqual(res.salario_diario, 500.0)
        self.assertEqual(res.total_a_receber, 6000.0)

    def test_caso_02_ferias_segundo_ano_em_diante(self):
        """Caso 2: Trabalhador com 3 anos de trabalho (30 dias). Salário: 30.000 MZN."""
        res = LaborCalculatorMoz.calcular_ferias(salario_base=30000.0, anos_trabalho=3)
        self.assertEqual(res.detalhes["dias_de_ferias"], 30)
        self.assertEqual(res.salario_diario, 1000.0)
        self.assertEqual(res.total_a_receber, 30000.0)

    def test_caso_03_ferias_proporcionais_primeiro_ano(self):
        """Caso 3: Trabalhador com 6 meses no 1.º ano (6 dias). Salário: 18.000 MZN."""
        res = LaborCalculatorMoz.calcular_ferias(salario_base=18000.0, anos_trabalho=0, meses_trabalho=6)
        self.assertEqual(res.detalhes["dias_de_ferias"], 6)
        self.assertEqual(res.salario_diario, 600.0)
        self.assertEqual(res.total_a_receber, 3600.0)

    def test_caso_04_ferias_contrato_prazo_certo(self):
        """Caso 4: Contrato a prazo com 8 meses (1 dia/mês = 8 dias). Salário: 12.000 MZN."""
        res = LaborCalculatorMoz.calcular_ferias(salario_base=12000.0, anos_trabalho=0, meses_trabalho=8, tipo_contrato="prazo")
        self.assertEqual(res.detalhes["dias_de_ferias"], 8)
        self.assertEqual(res.salario_diario, 400.0)
        self.assertEqual(res.total_a_receber, 3200.0)

    def test_caso_05_ferias_vencidas_acumuladas(self):
        """Caso 5: Indemnização de 45 dias de férias não gozadas acumuladas. Salário: 24.000 MZN."""
        res = LaborCalculatorMoz.calcular_ferias(salario_base=24000.0, anos_trabalho=2, dias_nao_gozados=45)
        self.assertEqual(res.detalhes["dias_de_ferias"], 45)
        self.assertEqual(res.salario_diario, 800.0)
        self.assertEqual(res.total_a_receber, 36000.0)

    # -------------------------------------------------------------
    # CASOS 6 a 10: HORAS EXTRAORDINÁRIAS (Artigo 100)
    # -------------------------------------------------------------
    def test_caso_06_horas_extras_diurnas(self):
        """Caso 6: 10 horas extras diurnas (+50%). Salário: 20.800 MZN (SH = 100 MZN/h)."""
        res = LaborCalculatorMoz.calcular_horas_extras(salario_base=20800.0, horas_diurnas=10.0)
        self.assertEqual(res.salario_horario, 100.0)
        self.assertEqual(res.detalhes["valor_diurnas"], 1500.0)
        self.assertEqual(res.total_a_receber, 1500.0)

    def test_caso_07_horas_extras_noturnas(self):
        """Caso 7: 8 horas extras noturnas (+100%). Salário: 20.800 MZN (SH = 100 MZN/h)."""
        res = LaborCalculatorMoz.calcular_horas_extras(salario_base=20800.0, horas_noturnas=8.0)
        self.assertEqual(res.salario_horario, 100.0)
        self.assertEqual(res.detalhes["valor_noturnas"], 1600.0)
        self.assertEqual(res.total_a_receber, 1600.0)

    def test_caso_08_horas_extras_feriado_descanso(self):
        """Caso 8: 6 horas em feriado (+100%). Salário: 31.200 MZN (SH = 150 MZN/h)."""
        res = LaborCalculatorMoz.calcular_horas_extras(salario_base=31200.0, horas_descanso_feriado=6.0)
        self.assertEqual(res.salario_horario, 150.0)
        self.assertEqual(res.detalhes["valor_descanso_feriado"], 1800.0)
        self.assertEqual(res.total_a_receber, 1800.0)

    def test_caso_09_horas_extras_mistas(self):
        """Caso 9: Regime misto (5h diurnas + 4h noturnas). Salário: 10.400 MZN (SH = 50 MZN/h)."""
        res = LaborCalculatorMoz.calcular_horas_extras(salario_base=10400.0, horas_diurnas=5.0, horas_noturnas=4.0)
        self.assertEqual(res.salario_horario, 50.0)
        self.assertEqual(res.detalhes["valor_diurnas"], 375.0)    # 5 * 50 * 1.5 = 375
        self.assertEqual(res.detalhes["valor_noturnas"], 400.0)   # 4 * 50 * 2.0 = 400
        self.assertEqual(res.total_a_receber, 775.0)

    def test_caso_10_horas_extras_regime_40h(self):
        """Caso 10: Regime bancário de 40h semanais. 4h diurnas. Salário: 34.666 MZN (SH ~ 200 MZN/h)."""
        res = LaborCalculatorMoz.calcular_horas_extras(salario_base=34666.0, horas_diurnas=4.0, horas_semanais=40)
        self.assertAlmostEqual(res.salario_horario, 200.0, places=0)
        self.assertAlmostEqual(res.total_a_receber, 1200.0, delta=2.0)

    # -------------------------------------------------------------
    # CASOS 11 a 15: INDEMNIZAÇÕES POR RESCISÃO (Artigos 139, 141 e 142)
    # -------------------------------------------------------------
    def test_caso_11_indemnizacao_escalao_a_ate_7_sm(self):
        """
        Caso 11: Escalão A (<= 7 SM).
        Salário Mínimo Setorial: 10.000 MZN.
        Salário Base: 20.000 MZN (2 SM -> Escalão A: 30 dias/ano).
        Tempo: 2 anos. SD = 666.67 MZN.
        Indemnização = 2 anos * 30 dias * 666.67 = 40.000.20 MZN.
        Aviso prévio concedido normalmente.
        """
        res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
            salario_base=20000.0,
            salario_minimo_setor=10000.0,
            anos_servico=2,
            aviso_previo_pago=True
        )
        self.assertEqual(res.detalhes["dias_por_ano_aplicados"], 30)
        self.assertAlmostEqual(res.detalhes["indemnizacao_antiguidade"], 40000.0, delta=2.0)
        self.assertAlmostEqual(res.total_a_receber, 40000.0, delta=2.0)

    def test_caso_12_indemnizacao_escalao_b_8_a_10_sm(self):
        """
        Caso 12: Escalão B (8 a 10 SM).
        Salário Mínimo: 8.000 MZN.
        Salário Base: 72.000 MZN (9 SM -> Escalão B: 15 dias/ano).
        Tempo: 4 anos. SD = 2400 MZN.
        Indemnização = 4 * 15 * 2400 = 144.000 MZN.
        """
        res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
            salario_base=72000.0,
            salario_minimo_setor=8000.0,
            anos_servico=4,
            aviso_previo_pago=True
        )
        self.assertEqual(res.detalhes["dias_por_ano_aplicados"], 15)
        self.assertEqual(res.detalhes["indemnizacao_antiguidade"], 144000.0)
        self.assertEqual(res.total_a_receber, 144000.0)

    def test_caso_13_indemnizacao_escalao_c_11_a_16_sm(self):
        """
        Caso 13: Escalão C (11 a 16 SM).
        Salário Mínimo: 10.000 MZN.
        Salário Base: 120.000 MZN (12 SM -> Escalão C: 10 dias/ano).
        Tempo: 3 anos. SD = 4000 MZN.
        Indemnização = 3 * 10 * 4000 = 120.000 MZN.
        """
        res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
            salario_base=120000.0,
            salario_minimo_setor=10000.0,
            anos_servico=3,
            aviso_previo_pago=True
        )
        self.assertEqual(res.detalhes["dias_por_ano_aplicados"], 10)
        self.assertEqual(res.detalhes["indemnizacao_antiguidade"], 120000.0)
        self.assertEqual(res.total_a_receber, 120000.0)

    def test_caso_14_indemnizacao_escalao_d_acima_16_sm(self):
        """
        Caso 14: Escalão D (> 16 SM).
        Salário Mínimo: 10.000 MZN.
        Salário Base: 200.000 MZN (20 SM -> Escalão D: 3 dias/ano).
        Tempo: 5 anos. SD = 6666.67 MZN.
        Indemnização = 5 * 3 * 6666.67 = 100.000.05 MZN.
        """
        res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
            salario_base=200000.0,
            salario_minimo_setor=10000.0,
            anos_servico=5,
            aviso_previo_pago=True
        )
        self.assertEqual(res.detalhes["dias_por_ano_aplicados"], 3)
        self.assertAlmostEqual(res.detalhes["indemnizacao_antiguidade"], 100000.0, delta=2.0)

    def test_caso_15_rescisao_completa_com_falta_aviso_previo_e_ferias(self):
        """
        Caso 15: Simulação completa de rescisão com:
        - Salário Base: 15.000 MZN.
        - Salário Mínimo: 6.000 MZN (2.5 SM -> Escalão A: 30 dias/ano).
        - Tempo: 1 ano e 6 meses (1.5 anos). SD = 500 MZN.
        - Indemnização Antiguidade: 1.5 * 30 * 500 = 22.500 MZN.
        - Sem aviso prévio concedido (Art. 139): +15.000 MZN (1 mês).
        - 10 dias de férias vencidas: +5.000 MZN.
        - 6 meses de férias proporcionais ano corrente: 15 dias = +7.500 MZN.
        Total = 22.500 + 15.000 + 5.000 + 7.500 = 50.000 MZN.
        """
        res = LaborCalculatorMoz.calcular_indemnizacao_rescisao(
            salario_base=15000.0,
            salario_minimo_setor=6000.0,
            anos_servico=1,
            meses_adicionais=6,
            aviso_previo_pago=False,
            ferias_vencidas_dias=10,
            meses_trabalhados_ano_corrente=6
        )
        self.assertEqual(res.detalhes["dias_por_ano_aplicados"], 30)
        self.assertEqual(res.detalhes["indemnizacao_antiguidade"], 22500.0)
        self.assertEqual(res.detalhes["aviso_previo_indemnizado"], 15000.0)
        self.assertEqual(res.detalhes["ferias_vencidas"], 5000.0)
        self.assertEqual(res.detalhes["ferias_proporcionais"], 7500.0)
        self.assertEqual(res.total_a_receber, 50000.0)


if __name__ == '__main__':
    unittest.main()
