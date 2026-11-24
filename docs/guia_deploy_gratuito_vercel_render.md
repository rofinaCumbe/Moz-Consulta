# GUIA DE DEPLOY 100% GRATUITO (VERCEL + RENDER + GITHUB)

Este guia explica como hospedar o **Moz-Consulta** na nuvem a custo zero, utilizando o **Render** para o Back-end (FastAPI) e a **Vercel** para o Front-end (React/Tailwind).

---

## 1. Passo 1: Subir o Código para o GitHub

1. Inicialize o repositório git na raiz do projeto `Moz-Consulta`:
   ```bash
   git init
   git add .
   git commit -m "feat: plataforma Moz-Consulta - Lei 13/2023"
   ```
2. Crie um repositório público ou privado no [GitHub](https://github.com) (ex.: `moz-consulta`).
3. Envie o seu código:
   ```bash
   git remote add origin https://github.com/SEU-USUARIO/moz-consulta.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Passo 2: Hospedar o Back-end Gratuitamente no Render

1. Aceda a [render.com](https://render.com) e crie uma conta gratuita (ou faça login com o seu GitHub).
2. Clique em **New +** e selecione **Web Service**.
3. Escolha o repositório `moz-consulta` do GitHub.
4. Preencha as configurações:
   * **Name:** `moz-consulta-api`
   * **Region:** Frankfurt (ou a mais próxima)
   * **Runtime:** `Python 3`
   * **Build Command:** `pip install -r backend/requirements.txt`
   * **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type:** `Free` ($0/mês)
5. Clique em **Deploy Web Service**.
6. Quando o deploy terminar, o Render fornecerá a sua URL pública gratuita (ex.: `https://moz-consulta-api.onrender.com`).
   * Pode testar acedendo a `https://moz-consulta-api.onrender.com/docs` para ver a documentação interativa Swagger!

---

## 3. Passo 3: Hospedar o Front-end Gratuitamente na Vercel

1. Aceda a [vercel.com](https://vercel.com) e entre com a sua conta GitHub.
2. Clique em **Add New...** $\rightarrow$ **Project**.
3. Selecione o repositório `moz-consulta`.
4. Configure os parâmetros do projeto:
   * **Framework Preset:** `Vite`
   * **Root Directory:** Clique em *Edit* e selecione a pasta **`frontend`**.
   * **Environment Variables:**
     * Nome: `VITE_API_URL`
     * Valor: `https://moz-consulta-api.onrender.com` (a URL gerada pelo Render no Passo 2).
5. Clique em **Deploy**.
6. Em menos de 1 minuto o seu site estará no ar com link público mundial (ex.: `https://moz-consulta.vercel.app`)!

---

## 4. Passo 4: Base de Dados PostgreSQL Gratuita (Opcional / Próxima Fase)

* Para persistência definitiva com `pgvector`, recomendamos o **Supabase** (plano gratuito permanente) ou **Neon.tech** (PostgreSQL Serverless gratuito).
* Basta copiar a string de conexão (`DATABASE_URL`) para as variáveis de ambiente do Render.
