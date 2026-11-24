# FASE 1: LEVANTAMENTO DAS REGRAS E FÓRMULAS DA LEI N.º 13/2023 (MOÇAMBIQUE)

Este documento sistematiza as regras e fórmulas matemáticas previstas na **Lei n.º 13/2023, de 25 de Agosto** (Nova Lei do Trabalho de Moçambique) e nas tabelas oficiais de salários mínimos setoriais aprovadas pelo Governo moçambicano.

---

## 1. Separação Fundamental: Fórmulas Fixas vs. Parâmetros Variáveis

| Tipo de Regra | Descrição | Onde fica armazenado no Sistema |
| :--- | :--- | :--- |
| **Fórmulas Fixas** | Critérios de dias de férias, percentagens de horas extras, divisores de salário diário/horário e regras de escalões de indemnização da Lei n.º 13/2023. | **Código Back-end** (Python/FastAPI) |
| **Parâmetros Variáveis** | Tabela de Salários Mínimos Setoriais (Setores 1 a 8 e subsetores), que sofrem reajustes anuais decretados pelo Conselho de Ministros. | **Base de Dados** (PostgreSQL) gerida pelo Painel Admin |

---

## 2. Bases de Cálculo Matemáticas (Artigo 123 e Disposições Gerais)

* **Salário Mensal Base ($SB$):** Remuneração base em Meticais (MZN).
* **Divisor Mensal Padrão:** Em Moçambique adota-se habitualmente o mês comercial de 30 dias ou a carga horária legal de 48 horas semanais (ou 40 horas semanais em regime administrativo/bancário).
  * **Salário Diário ($SD$):**
    $$SD = \frac{SB}{30}$$
  * **Salário Horário ($SH$):**
    * Regime normal de 48h semanais (208 horas/mês):
      $$SH = \frac{SB}{208} \quad \text{ou} \quad SH = \frac{SD}{8}$$
    * Regime de 40h semanais (173.33 horas/mês):
      $$SH = \frac{SB}{173.33} \quad \text{ou} \quad SH = \frac{SD}{8}$$

---

## 3. Regras de Férias Anuais e Faltas (Artigos 108, 109 e 110)

### 3.1. Duração do Período de Férias (Artigo 109)
* **Contratos por Tempo Indeterminado:**
  * **1.º ano de trabalho efetivo:** **12 dias** de calendário.
  * **A partir do 2.º ano em diante:** **30 dias** de calendário por cada ano de trabalho.
* **Contratos a Prazo Certo:**
  * Duração entre 3 meses e 1 ano: **1 dia de férias por cada mês completo de serviço efetivo**.
  * Duração superior a 1 ano: aplica-se a regra geral (30 dias).

### 3.2. Férias Não Gozadas / Férias Proporcionais na Rescisão
* Quando o contrato termina sem que o trabalhador tenha gozado as férias vencidas ou com meses proporcionais trabalhados:
  $$\text{Valor Férias Proporcionais} = \left(\frac{\text{Dias de Direito Anual}}{12}\right) \times \text{Meses Trabalhados} \times SD$$

---

## 4. Trabalho Suplementar / Horas Extraordinárias (Artigo 100)

As horas extras são prestadas fora do horário normal de trabalho e remuneradas com os seguintes acréscimos legais:

1. **Horas Extras Diurnas (até ao limite legal / dias úteis normais):**
   * Remuneração com acréscimo de **50%**:
     $$\text{Valor Hora Extra Diurna} = SH \times 1.50$$
2. **Horas Extras Noturnas (período entre as 20h e as 6h do dia seguinte):**
   * Remuneração com acréscimo de **100%**:
     $$\text{Valor Hora Extra Noturna} = SH \times 2.00$$
3. **Horas Extras em Dias de Descanso Semanal e Feriados:**
   * Remuneração com acréscimo de **100%**:
     $$\text{Valor Hora Extra Descanso/Feriado} = SH \times 2.00$$

---

## 5. Licenças Parentais (Novas Regras da Lei n.º 13/2023)

* **Licença de Maternidade (Artigo 113):**
  * **90 dias consecutivos** de licença de maternidade remunerada (anteriormente eram 60 dias na lei de 2007).
  * Pode ter início 20 dias antes da data provável do parto.
* **Licença de Paternidade (Artigo 114):**
  * **7 dias de licença**, gozados nos primeiros 30 dias após o nascimento da criança, mediante comunicação prévia (uma das maiores inovações da Lei 13/2023).

---

## 6. Aviso Prévio na Rescisão de Contrato (Artigo 139)

* **Rescisão por iniciativa do Empregador (Contrato por Tempo Indeterminado):**
  * Aviso prévio mínimo de **30 dias**.
  * Se o empregador rescindir sem conceder o aviso prévio, deve pagar a **indemnização compensatória de aviso prévio** correspondente a **1 mês de remuneração** (30 dias de salário).
* **Rescisão por iniciativa do Trabalhador:**
  * O trabalhador deve comunicar por escrito com aviso de 30 dias (ou 15 dias em casos previstos), sob pena de indemnizar o empregador no montante correspondente ao período em falta.

---

## 7. Indemnização por Rescisão de Contrato Sem Justa Causa / Motivos Estruturais (Artigos 141 e 142)

A fórmula de indemnização nos contratos por tempo indeterminado depende do escalão salarial do trabalhador em relação ao **Salário Mínimo do seu Setor de Atividade ($SM$)**:

### Tabela de Escalões da Lei n.º 13/2023:
* **Escalão A: Salário entre 1 e 7 Salários Mínimos ($SB \le 7 \times SM$)**
  * **30 dias de salário por cada ano de serviço** (ou fração proporcional).
  $$\text{Indemnização} = 30 \times SD \times \text{Anos de Serviço}$$
* **Escalão B: Salário entre 8 e 10 Salários Mínimos ($7 \times SM < SB \le 10 \times SM$)**
  * **15 dias de salário por cada ano de serviço** (ou fração proporcional).
  $$\text{Indemnização} = 15 \times SD \times \text{Anos de Serviço}$$
* **Escalão C: Salário entre 11 e 16 Salários Mínimos ($10 \times SM < SB \le 16 \times SM$)**
  * **10 dias de salário por cada ano de serviço** (ou fração proporcional).
  $$\text{Indemnização} = 10 \times SD \times \text{Anos de Serviço}$$
* **Escalão D: Salário superior a 16 Salários Mínimos ($SB > 16 \times SM$)**
  * **3 dias de salário por cada ano de serviço** (ou fração proporcional).
  $$\text{Indemnização} = 3 \times SD \times \text{Anos de Serviço}$$

### Contratos a Prazo Certo (Artigo 140):
* Cessação antecipada injustificada por iniciativa do empregador:
  * Pagamento das remunerações que o trabalhador auferiria até ao termo do contrato acordado.

---

## 8. Tabela de Setores de Atividade de Moçambique (Base de Dados Parametrizável)

O Conselho de Ministros atualiza anualmente os seguintes 8 setores principais:
1. **Setor 1:** Agricultura, Pecuária, Caça e Silvicultura.
2. **Setor 2:** Pesca (Industrial, Semi-industrial, Refrigeração).
3. **Setor 3:** Indústria de Extração Mineira (Grandes empresas, Pedreiras, Salinas).
4. **Setor 4:** Indústria Transformadora.
5. **Setor 5:** Produção e Distribuição de Eletricidade, Gás e Água.
6. **Setor 6:** Construção Civil.
7. **Setor 7:** Atividades dos Serviços Não Financeiros (Comércio, Hotelaria, Turismo, Transportes).
8. **Setor 8:** Atividades dos Serviços Financeiros (Bancos, Seguradoras, Microfinanças).
