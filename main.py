from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import gns3fy
from pydantic import BaseModel
import json
import os
import time
import requests
import build_scenario

load_dotenv()
GNS3_SERVER_IP = os.getenv("GNS3_SERVER_IP", "127.0.0.1")
GNS3_SERVER_PORT = os.getenv("GNS3_SERVER_PORT", "3080")
SCENARIOS_DIR = os.getenv("SCENARIOS_DIR", "scenarios")

API_URL = f"http://{GNS3_SERVER_IP}:{GNS3_SERVER_PORT}"
gns3_server = gns3fy.Gns3Connector(API_URL)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/templates")
def get_templates():
    return gns3_server.get_templates()

#TODO: Allow user to select project
@app.get("/gns_info")
def get_gns_info():
    # Example: pick a project
    projects = gns3_server.get_projects()
    project = projects[0] 

    
    templates = gns3_server.get_templates()

    return {
        "gns3_server_ip": GNS3_SERVER_IP,
        "project_name": project.get("name"),
        "project_id": project.get("project_id"),
        "templates": {tpl["name"]: tpl["template_id"] for tpl in templates}
    }

class ScenarioRequest(BaseModel):
     scenario_name: str
     nodes: list
     links: list

@app.post("/save_scenario")
def save_scenario(req: ScenarioRequest):
    os.makedirs(SCENARIOS_DIR, exist_ok=True)
    filename = f"{req.scenario_name}.json"
    filepath = os.path.join(SCENARIOS_DIR, filename)
    scenario = get_gns_info()
    scenario["nodes"] = req.nodes
    scenario["links"] = req.links
    with open(filepath, "w") as f:
        json.dump(scenario, f, indent=2)
        

    return {"status": "success", "filename": filename}

@app.get("/scenarios")
def get_scenarios(folder=SCENARIOS_DIR):
    scenarios = []
    for filename in os.listdir(folder):
        if filename.endswith(".json"):
            scenarios.append({
                "filename": filename,
                "name": filename.replace(".json", "")
            })
    return scenarios



class ConfigFile(BaseModel):
    filename: str
    name: str

@app.post("/build_scenario")
def build(req: ConfigFile):
    scenario_File = req.filename
    scenario_path = os.path.join(SCENARIOS_DIR, scenario_File)
    if not os.path.isfile(scenario_path):
        raise SystemExit(f"[ERROR] Scenario file not found: {scenario_File}")
    with open(scenario_path, "r", encoding="utf-8") as f:
        scenario = json.load(f)

    # Session
    s = requests.Session()
    s.headers.update({"Accept": "application/json", "Content-Type": "application/json"})

    # ---------------- Node creation ----------------
    created_nodes = []
    name_to_id = {}
    alias_to_id = {}
    
    nodes_spec = scenario.get("nodes", [])
    if not nodes_spec:
        raise SystemExit("[ERROR] No 'nodes' array in scenario")

    for spec in nodes_spec:
        name = spec["name"]
        x, y = int(spec.get("x", 0)), int(spec.get("y", 0))
        template_id = spec.get("template_id")
        if not template_id:
            raise SystemExit(f"[ERROR] Node '{name}' missing template_id")

        node = build_scenario.add_node_from_template(s, API_URL, scenario["project_id"], template_id, name, x, y)
        created_nodes.append(node)
        name_to_id[name] = node["node_id"]
        for a in build_scenario.alias_variants(name):
            alias_to_id.setdefault(a, node["node_id"])
        print(f"[INFO] Created node '{name}' ({node['node_id']}) at ({x},{y})")
        time.sleep(0.05)

    # ---------------- Link creation ----------------
    created_links = []
    links_spec = scenario.get("links", []) or []
    for i, LK in enumerate(links_spec, start=1):
        a_in, b_in = LK["nodes"][0], LK["nodes"][1]
        a_ref = a_in.get("node_id") or a_in.get("name")
        b_ref = b_in.get("node_id") or b_in.get("name")

        a_id = build_scenario.resolve_endpoint(a_ref, name_to_id, alias_to_id)
        b_id = build_scenario.resolve_endpoint(b_ref, name_to_id, alias_to_id)

        a = {"node_id": a_id,
             "adapter_number": int(a_in.get("adapter_number", 0)),
             "port_number": int(a_in.get("port_number", 0))}
        b = {"node_id": b_id,
             "adapter_number": int(b_in.get("adapter_number", 0)),
             "port_number": int(b_in.get("port_number", 0))}

        link_resp = build_scenario.create_link(s, API_URL, scenario["project_id"], a, b)
        created_links.append(link_resp)
        print(f"[INFO] Created link #{i} -> link_id={link_resp.get('link_id')}")
        time.sleep(0.05)

    # ---------------- Refresh details ----------------
    nodes_detail = [build_scenario.get_node(s, API_URL, scenario["project_id"], n["node_id"]) for n in created_nodes]
    links_detail = build_scenario.gns3_get(s, f"{API_URL}/v2/projects/{scenario['project_id']}/links")

    # ---------------- Build config ----------------
    cfg = build_scenario.make_config_record(scenario.get("project_name"), scenario["project_id"], nodes_detail, links_detail)
    name = req.name
    with open(f"{name}.config.generated.json", "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=4)

    print(f"[INFO] Wrote config file -> config.generated.json")
    return cfg

@app.post("/start")
def startnodes(req: ConfigFile):
    scenario_File = req.filename
    scenario_path = os.path.join(SCENARIOS_DIR, scenario_File)
    if not os.path.isfile(scenario_path):
        raise SystemExit(f"[ERROR] Scenario file not found: {scenario_File}")
    with open(scenario_path, "r", encoding="utf-8") as f:
        scenario = json.load(f)

    config_name = f"{req.name}.config.generated.json"
    if not os.path.isfile(config_name):
        raise SystemExit(f"[ERROR] Scenario file not found: {config_name}")
    with open(config_name, "r", encoding="utf-8") as f:
        config = json.load(f)

    s = requests.Session()
    s.headers.update({"Accept": "application/json", "Content-Type": "application/json"})

    project_id = config["project_id"]

    for n in config["nodes"]:
        build_scenario.start_node(s, API_URL, project_id, n["node_id"] )

