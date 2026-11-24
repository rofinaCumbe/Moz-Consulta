import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.api.endpoints.calculator import (
    calcular_ferias_endpoint,
    calcular_horas_extras_endpoint,
    calcular_rescisao_endpoint
)
from app.api.endpoints.sectors import listar_setores, obter_setor, atualizar_salario_minimo
from app.schemas.calculator import FeriasRequest, HorasExtrasRequest, RescisaoRequest
from app.schemas.sectors import SetorUpdate


class TestApiDirect(unittest.TestCase):

    def test_listar_setores(self):
        setores = listar_setores()
        self.assertEqual(len(setores), 8)
        self.assertEqual(setores[0]["id"], 1)

    def test_obter_setor_especifico(self):
        setor = obter_setor(7)
        self.assertEqual(setor["id"], 7)
        self.assertEqual(setor["salario_minimo"], 8945.00)

    def test_calcular_ferias(self):
        req = FeriasRequest(
            salario_base=30000.0,
            anos_trabalho=3,
            meses_trabalho=0,
            tipo_contrato="indeterminado"
        )
        res = calcular_ferias_endpoint(req)
        self.assertEqual(res.total_a_receber, 30000.0)
        self.assertIn("Artigo 109", res.artigo_lei)

    def test_calcular_horas_extras(self):
        req = HorasExtrasRequest(
            salario_base=20800.0,
            horas_diurnas=10.0,
            horas_noturnas=0.0,
            horas_descanso_feriado=0.0
        )
        res = calcular_horas_extras_endpoint(req)
        self.assertEqual(res.total_a_receber, 1500.0)
        self.assertIn("Artigo 100", res.artigo_lei)

    def test_calcular_rescisao(self):
        req = RescisaoRequest(
            salario_base=20000.0,
            setor_id=7,  # Serviços não financeiros (8.945 MZN)
            anos_servico=2,
            aviso_previo_pago=True
        )
        res = calcular_rescisao_endpoint(req)
        self.assertGreater(res.total_a_receber, 0)
        self.assertIn("Artigos 139, 141 e 142", res.artigo_lei)

    def test_atualizar_salario_minimo_admin(self):
        novo = SetorUpdate(salario_minimo=9500.00, ano_vigencia=2025)
        res = atualizar_salario_minimo(7, novo)
        self.assertEqual(res["salario_minimo"], 9500.00)
        self.assertEqual(res["ano_vigencia"], 2025)
        # Restaura valor original
        restaurar = SetorUpdate(salario_minimo=8945.00, ano_vigencia=2024)
        atualizar_salario_minimo(7, restaurar)


if __name__ == '__main__':
    unittest.main()
