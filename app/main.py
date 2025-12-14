from fastapi import FastAPI
from app.router import auth_routes, bottle_routes
from app.infra.sqlalchemy.config.database import engine, Base


app = FastAPI(title="Message in a Bottle API")

app.include_router(auth_routes.router)
app.include_router(bottle_routes.router)


@app.get("/", tags=["Health"])
def root():
    return {"message": "API Online"}
