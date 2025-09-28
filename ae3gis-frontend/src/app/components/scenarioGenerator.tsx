export function generateScenario(
  gns3_server_ip: string,
  project_name: string,
  project_id: string,
  templates: Template[],
  counts: Record<string, number>
): ScenarioConfig {
  const templatesMap = Object.fromEntries(
    templates.map((t) => [t.name, t.template_id])
  );

  const nodes: any[] = [];
  const links: any[] = [];

  // Keep separate counters per device type
  const deviceCounters: Record<string, number> = {};
  let switchIndex = 1;
  let x = -300;

  const addSwitch = () => {
    const switchName = `OpenvSwitch-${switchIndex}`;
    const switchTemplate = templatesMap["tollan-openvswitch-xp"];
    const node = { name: switchName, template_id: switchTemplate, x: 0, y: -140 * switchIndex };
    nodes.push(node);
    switchIndex++;
    return node;
  };

  const addDevice = (baseName: string, templateId: string, count: number, y: number, switchNode: any) => {
    if (!deviceCounters[baseName]) deviceCounters[baseName] = 1;

    for (let i = 0; i < count; i++) {
      const name = `${baseName}-${deviceCounters[baseName]}`;
      const node = { name, template_id: templateId, x, y };
      nodes.push(node);
      links.push({
        nodes: [
          { node_id: name, adapter_number: 0, port_number: 0 },
          { node_id: switchNode.name, adapter_number: i + 1, port_number: 0 },
        ],
      });
      x += 50;
      deviceCounters[baseName]++; // increment only for this type
    }
  };

  // Create a main switch
  const mainSwitch = addSwitch();

  Object.entries(counts).forEach(([tplName, count]) => {
    if (count > 0) {
      const templateId = templatesMap[tplName];
      if (!templateId) return;

      if (tplName === "tollan-malicious-client" || tplName === "tollan-benign-client") {
        addDevice("Workstation", templateId, count, -250, mainSwitch);
      }
      if (tplName === "tollan-isc-dhcp-server") {
        addDevice("DHCP", templateId, count, 0, mainSwitch);
      }
      if (tplName === "tollan-nginx-server" || tplName === "tollan-apache-server" || tplName === "tollan-ftp-server") {
        const typeName = tplName.split("-")[1]; // e.g., "nginx" or "ftp"
        addDevice(typeName.charAt(0).toUpperCase() + typeName.slice(1), templateId, count, -250, mainSwitch);
      }
    }
  });

  return {
    base_url: `http://${gns3_server_ip}:3080`,
    start_nodes: true,
    scenario: {
      gns3_server_ip,
      project_name,
      project_id,
      templates: templatesMap,
      nodes,
      links,
    },
  };
}