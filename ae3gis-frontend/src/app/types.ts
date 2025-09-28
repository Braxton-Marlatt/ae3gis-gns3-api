export interface Template {
  template_id: string;
  name: string;

}
export type TemplateCounts = Record<string, number>;


export interface ScenarioConfig {
  base_url: string;
  start_nodes: boolean;
  scenario: {
    gns3_server_ip: string;
    project_name: string;
    project_id: string;
    templates: Record<string, string>; // name → template_id
    nodes: Array<{
      name: string;
      template_id: string;
      x: number;
      y: number;
    }>;
    links: Array<{
      nodes: Array<{
        node_id: string; // name or actual ID depending on backend
        adapter_number: number;
        port_number: number;
      }>;
    }>;
  };
}
