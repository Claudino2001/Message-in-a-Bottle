from fastapi import FastAPI
from app.router import admin_routes, auth_routes, bottle_routes, public_routes
from app.infra.sqlalchemy.config.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Message in a Bottle API")
# --- 2. CONFIGURAÇÃO DO CORS (O Fix do Erro) ---
# Isso permite que o Front-end (localhost:5173) converse com o Back-end
origins = [
    "http://localhost:5173", # Endereço do seu Front-end
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(bottle_routes.router)
app.include_router(admin_routes.router)
app.include_router(public_routes.router)

@app.get("/", tags=["Health"])
def root():
    return {"message": "API Online"}
