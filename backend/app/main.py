from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.api.endpoints import calculator, sectors, law
import os

app = FastAPI(
    title="Moz-Consulta API",
    description="API de Consulta à Lei do Trabalho e Cálculo Automatizado de Direitos Laborais em Moçambique (Lei n.º 13/2023)",
    version="1.0.0"
)

# Configuração de CORS permissivo para conexão com Front-end na Vercel e Localhost
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro das rotas da API
app.include_router(calculator.router, prefix="/api/v1")
app.include_router(sectors.router, prefix="/api/v1")
app.include_router(law.router, prefix="/api/v1")

# Caminho da pasta dist do front-end construído
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))

if os.path.exists(frontend_dist):
    # Monta os assets estáticos (CSS, JS, imagens)
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    def serve_spa_fallback(full_path: str):
        # Se for chamada à API, deixa seguir
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return {"error": "Endpoint não encontrado"}
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "sistema": "Moz-Consulta",
            "versao": "1.0.0",
            "legislacao": "Lei n.º 13/2023, de 25 de Agosto (Moçambique)",
            "status": "Online e operacional",
            "documentacao_docs": "/docs"
        }
