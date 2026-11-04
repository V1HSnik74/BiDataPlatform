from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from app.api.dependencies import get_graph_service, get_current_user
from app.models.models import User
from app.schemas.graph import GraphResponse, GraphBase, GraphDeleteResponse
from app.services.graph_service import GraphService

router = APIRouter(prefix="/graphs", tags=["graphs"])

@router.post("/preview")
def preview_graph(graph: GraphBase, user: User = Depends(get_current_user), service: GraphService = Depends(get_graph_service)):
    return service.preview_graph(graph, user.id)

@router.post("", response_model=GraphResponse, status_code=status.HTTP_201_CREATED)
def create_graph(graph: GraphBase, user: User = Depends(get_current_user), service: GraphService = Depends(get_graph_service)):
    return service.create_graph(graph, user.id)

@router.get("", response_model = List[GraphResponse])
def get_graphs(user: User = Depends(get_current_user), service: GraphService = Depends(get_graph_service)):
    return service.get_user_graphs(user.id)

@router.delete("/{graph_id}", response_model=GraphDeleteResponse)
def delete_graph(graph_id: int, user: User = Depends(get_current_user), service: GraphService = Depends(get_graph_service)):
    service.delete_graph(graph_id, user.id)
    return GraphDeleteResponse(message="График успешно удален", id=graph_id)
