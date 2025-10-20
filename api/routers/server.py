from __future__ import annotations

from fastapi import APIRouter
from models import server
from core.server_creation import create_golden_clone
router = APIRouter(prefix="/server", tags=["server"])

@router.post("/create", response_model=server.ServerCreationResponse)
async def create_servers(request: server.ServerCreationRequest):
    servers = []
    for student in request.students:
        ip = await create_golden_clone(student.student_id, student.student_number)
        servers.append(server.ServerInfo(student_name=student.student_id, ip=ip))
        print(f"Created server for student {student.student_id} with IP {ip}")
    print(f"All servers created: {servers}")
    return server.ServerCreationResponse(server_list=servers)
