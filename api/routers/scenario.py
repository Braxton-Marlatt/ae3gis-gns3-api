"""Routes for building GNS3 scenarios."""

from __future__ import annotations

import asyncio
from pathlib import Path

import requests
from fastapi import APIRouter, Depends, HTTPException, Query

from core.config_store import ConfigStore
from core.gns3_client import GNS3Client
from core.scenario_builder import ScenarioBuilder
from models import APISettings, ScenarioBuildRequest, ScenarioBuildResponse

from ..dependencies import get_settings

router = APIRouter(prefix="/scenario", tags=["scenario"])


def _resolve_base_url(scenario: dict[str, object], override: str | None) -> str:
    if override:
        return override.rstrip("/")
    ip = scenario.get("gns3_server_ip")
    if not isinstance(ip, str) or not ip:
        raise ValueError("Scenario missing 'gns3_server_ip' and no base_url override provided")
    base = ip if ip.startswith("http") else f"http://{ip}:3080"
    return base.rstrip("/")


@router.post("/build", response_model=ScenarioBuildResponse)
async def build_scenario(
    payload: ScenarioBuildRequest,
    settings: APISettings = Depends(get_settings),
) -> ScenarioBuildResponse:
    scenario = dict(payload.scenario)
    base_url = _resolve_base_url(scenario, payload.base_url)

    session = requests.Session()
    session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})
    if payload.username and payload.password:
        session.auth = (payload.username, payload.password)

    client = GNS3Client(base_url=base_url, session=session)
    builder = ScenarioBuilder(client, request_delay=settings.gns3_request_delay)

    try:
        result = await asyncio.to_thread(builder.build, scenario, start_nodes=payload.start_nodes)
    except (LookupError, ValueError, requests.HTTPError) as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        session.close()

    config_path = payload.config_path or settings.config_path
    store = ConfigStore.from_path(config_path)
    store.write(result.config_record)

    return ScenarioBuildResponse(
        project_id=result.project_id,
        project_name=result.project_name,
        nodes_created=[dict(node) for node in result.nodes_created],
        links_created=[dict(link) for link in result.links_created],
        config_path=Path(config_path),
    )

@router.get("/templates")
async def get_templates(gns3_server_ip: str = Query(..., description="IP of the GNS3 server")):
    session = requests.Session()
    session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})

    base_url = f"http://{gns3_server_ip}:3080"

    try:
        # Example if your GNS3Client wraps requests:
        client = GNS3Client(base_url=base_url, session=session)

        templates = list(client.list_templates())
        return templates

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

@router.get("/projects")
async def get_projects(gns3_server_ip: str = Query(..., description="IP of the GNS3 server")):
    session = requests.Session()
    session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})

    base_url = f"http://{gns3_server_ip}:3080"

    try:
        # GNS3 API wrapper client
        connector = GNS3Client(base_url=base_url, session=session)
        projects = connector.list_projects()

        # Return only useful info (id + name), not the entire raw response
        simplified = [
            {"project_id": p["project_id"], "name": p["name"]}
            for p in projects
        ]
        return simplified

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()