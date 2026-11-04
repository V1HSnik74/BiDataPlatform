import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api.uploads import router as uploads_router
from app.api.graphs import router as graphs_router

app = FastAPI(
    title="BI Data Platform API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["System"])
def check_health():
    return {"status": "ok", "message": "is running"}


app.include_router(uploads_router, prefix="/api")
app.include_router(graphs_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
