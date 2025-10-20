from pydantic import BaseModel

class ServerInfo(BaseModel):
    student_name: str
    ip: str

class ServerCreationResponse(BaseModel):
    server_list: list[ServerInfo]

class StudentInfo(BaseModel):
    student_id: str
    student_number: int


class ServerCreationRequest(BaseModel):
    students: list[StudentInfo]

