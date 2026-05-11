export interface ProductLine {
  id: string;
  label: string;
}

export const productLines: ProductLine[] = [
  { id: 'cloud-platform', label: 'Cloud Platform' },
  { id: 'on-prem-server', label: 'On-Prem Server' },
  { id: 'api-gateway', label: 'API Gateway' },
  { id: 'data-analytics', label: 'Data Analytics' },
  { id: 'mobile-sdk', label: 'Mobile SDK' },
  { id: 'iot-edge', label: 'IoT Edge' },
  { id: 'identity-manager', label: 'Identity Manager' },
  { id: 'compliance-hub', label: 'Compliance Hub' },
  { id: 'secure-vault', label: 'Secure Vault' },
  { id: 'workflow-engine', label: 'Workflow Engine' },
  { id: 'data-lake', label: 'Data Lake' },
  { id: 'edge-compute', label: 'Edge Compute' },
  { id: 'ml-pipeline', label: 'ML Pipeline' },
  { id: 'event-stream', label: 'Event Stream' },
  { id: 'backup-restore', label: 'Backup & Restore' },
  { id: 'access-control', label: 'Access Control' },
  { id: 'audit-trail', label: 'Audit Trail' },
  { id: 'secret-manager', label: 'Secret Manager' },
  { id: 'container-runtime', label: 'Container Runtime' },
  { id: 'service-mesh', label: 'Service Mesh' },
];
