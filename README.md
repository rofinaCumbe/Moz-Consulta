# Moz-Consulta 🇲🇿

> **Plataforma Web para Consulta Assistida à Lei do Trabalho e Cálculo Automatizado de Direitos dos Trabalhadores em Moçambique (Lei n.º 13/2023).**

Trabalho de Conclusão de Curso em **Engenharia em Tecnologia e Sistemas de Informação**.

---

## 🎯 Objetivos do Projeto

* Traduzir as regras jurídicas da nova **Lei do Trabalho de Moçambique (Lei n.º 13/2023, de 25 de Agosto)** e as tabelas anuais de salários mínimos em ferramentas digitais acessíveis.
* Oferecer uma **calculadora determinística** de férias, horas extras e rescisão contratual com memória de cálculo passo a passo.
* Disponibilizar um **assistente inteligente (RAG)** que cita os artigos oficiais da lei, eliminando o risco de alucinações.
* Garantir uma **arquitetura parametrizável**, permitindo que o administrador reajuste os salários mínimos anuais sem alterar o código-fonte.
* Operar com **100% de gratuidade**, utilizando Vercel, Render e Supabase/Neon.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React.js, Tailwind CSS, Vite (Hospedagem gratuita na **Vercel**).
* **Back-end:** Python, FastAPI, Uvicorn (Hospedagem gratuita no **Render**).
* **Base de Dados:** PostgreSQL com suporte a `pgvector` (**Supabase / Neon**).
* **Inteligência Artificial:** RAG com embeddings dos artigos oficiais da Lei n.º 13/2023.

---

## 🚀 Como Executar Localmente

### 1. Back-end (FastAPI)
```bash
cd backend
python -m unittest tests/test_calculator.py  # Executa os 15 casos de teste (100% acerto)
uvicorn app.main:app --reload --port 8000
```
Acesse a documentação interativa em: `http://127.0.0.1:8000/docs`

### 2. Front-end (React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação no seu navegador: `http://localhost:5173`

---

## 📚 Documentação das Fases

* [Fase 1: Levantamento de Regras e Fórmulas da Lei 13/2023](docs/fase1_regras_calculo_lei_13_2023.md)
* [Fase 2: Especificação de Requisitos e Diagramas UML](docs/fase2_especificacao_requisitos.md)
* [Guia de Deploy Gratuito (Vercel + Render)](docs/guia_deploy_gratuito_vercel_render.md)
