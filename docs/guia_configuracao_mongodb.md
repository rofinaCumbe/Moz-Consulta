# GUIA DE CONFIGURAÇÃO DO MONGODB (ATLAS GRATUITO)

Este guia ensina a configurar uma base de dados **MongoDB Atlas 100% gratuita** (Plano M0 permanente) para a plataforma **Moz-Consulta**.

---

## 1. Criar o Cluster Gratuito no MongoDB Atlas

1. Aceda ao site oficial: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crie uma conta gratuita (pode usar o botão **Sign in with Google**).
3. Ao criar a organização/projeto, escolha o plano:
   * **M0 Free (Shared)** — Gratuito para sempre ($0/mês).
   * **Provider / Region:** Escolha **AWS** na região mais próxima (ex: *Frankfurt (eu-central-1)* ou *South Africa (af-south-1)* se disponível).
   * **Cluster Name:** Pode deixar `Cluster0`.
4. Clique no botão **Create Deployment**.

---

## 2. Configurar Utilizador e Segurança de Rede

1. **Criar Utilizador da Base de Dados:**
   * **Username:** `admin_moz` (ou o nome que preferir)
   * **Password:** Crie uma senha segura (guarde-a bem, ex.: `MozConsulta2026!`)
   * Clique em **Create Database User**.
2. **Permitir Acesso de Rede (Network Access):**
   * Selecione **Allow Access from Anywhere** (`0.0.0.0/0`).
   * Clique em **Add Entry** e depois em **Finish and Close**.

---

## 3. Obter a String de Conexão

1. No painel principal do Atlas, clique no botão **Connect**.
2. Selecione a opção **Drivers** (Python).
3. Copie o endereço de conexão fornecido, que terá este formato:
   ```plaintext
   mongodb+srv://admin_moz:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Substitua `<password>` pela senha que definiu no Passo 2.

---

## 4. Ligar ao Projeto Moz-Consulta

1. Abra a pasta `backend/` no seu computador e crie ou edite o ficheiro `.env`:
   ```env
   MONGODB_URI=mongodb+srv://admin_moz:SuaSenhaAqui@cluster0.xxxxx.mongodb.net/moz_consulta?retryWrites=true&w=majority
   MONGODB_DB_NAME=moz_consulta
   ```
2. Salve o ficheiro `.env`.

---

## 5. Povoar a Base de Dados (Seed Automático)

No terminal, execute o script que preparamos para inserir automaticamente os 8 setores e os artigos da Lei n.º 13/2023:

```powershell
cd "C:\Users\Rofina Cumbe\Documents\Moz-Consulta"
python backend/app/scripts/seed_mongodb.py
```

Você verá a confirmação:
```plaintext
🚀 Iniciando seed do MongoDB...
✅ Conectado ao MongoDB com sucesso: moz_consulta
✅ 8 setores inseridos na coleção 'setores'.
✅ 7 artigos inseridos na coleção 'artigos_lei'.
✅ Índices de texto e ID criados com sucesso.
🎉 Base de dados MongoDB configurada com sucesso para o Moz-Consulta!
```

Pronto! Agora todos os dados do sistema estão guardados na nuvem do MongoDB!
