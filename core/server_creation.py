import ansible_runner
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor


executor = ThreadPoolExecutor()

async def create_golden_clone(student_id: str, student_number: int) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, _run_ansible, student_id, student_number)

def _run_ansible(student_id: str, student_number: int) -> str:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    playbook_path = os.path.join(current_dir, "golden_clone.yaml")

    private_data_dir = os.path.join(current_dir, "runner_data")
    os.makedirs(private_data_dir, exist_ok=True)

    runner = ansible_runner.run(
        private_data_dir=private_data_dir,
        playbook=playbook_path,
        extravars={
            "student_id": student_id,
            "student_number": student_number,
        }
    )

    # After the playbook finishes, read from that fact cache
    ip = runner.get_fact_cache("localhost").get("created_vm_ip", "")
    del runner
    return ip
