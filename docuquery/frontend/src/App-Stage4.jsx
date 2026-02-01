import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, Server, Database, Activity, AlertTriangle, CheckCircle,
  ChevronRight, ChevronDown, Box, Layers, Settings, Shield,
  Terminal, GitBranch, Cpu, HardDrive, Gauge, BarChart3,
  Container, Network, FileText, Clock, RefreshCw, Zap,
  Target, Eye, Bell, Search, Filter, Play, Pause, ArrowRight,
  Code, TestTube, Workflow, Monitor
} from 'lucide-react';

// Mock data for staging infrastructure
const mockPods = [
  { name: 'docuquery-api-7d8f9c6b5-abc12', status: 'Running', ready: '1/1', restarts: 0, age: '2d', cpu: '45m', memory: '256Mi', node: 'node-1' },
  { name: 'docuquery-api-7d8f9c6b5-def34', status: 'Running', ready: '1/1', restarts: 0, age: '2d', cpu: '52m', memory: '312Mi', node: 'node-2' },
  { name: 'docuquery-api-7d8f9c6b5-ghi56', status: 'Running', ready: '1/1', restarts: 1, age: '1d', cpu: '38m', memory: '289Mi', node: 'node-1' },
  { name: 'qdrant-0', status: 'Running', ready: '1/1', restarts: 0, age: '5d', cpu: '120m', memory: '1.2Gi', node: 'node-2' },
  { name: 'prometheus-server-0', status: 'Running', ready: '1/1', restarts: 0, age: '5d', cpu: '85m', memory: '512Mi', node: 'node-1' },
  { name: 'grafana-6f7d8c9b-xyz89', status: 'Running', ready: '1/1', restarts: 0, age: '5d', cpu: '25m', memory: '128Mi', node: 'node-2' },
  { name: 'loki-0', status: 'Running', ready: '1/1', restarts: 0, age: '5d', cpu: '65m', memory: '384Mi', node: 'node-1' },
  { name: 'promtail-daemonset-abc', status: 'Running', ready: '1/1', restarts: 0, age: '5d', cpu: '15m', memory: '64Mi', node: 'node-1' },
];

const mockServices = [
  { name: 'docuquery-api', type: 'ClusterIP', clusterIP: '10.96.45.123', ports: '8000/TCP', selector: 'app=docuquery-api' },
  { name: 'docuquery-api-external', type: 'LoadBalancer', externalIP: 'staging.docuquery.dev', ports: '443/TCP', selector: 'app=docuquery-api' },
  { name: 'qdrant', type: 'ClusterIP', clusterIP: '10.96.78.45', ports: '6333/TCP,6334/TCP', selector: 'app=qdrant' },
  { name: 'prometheus-server', type: 'ClusterIP', clusterIP: '10.96.12.89', ports: '9090/TCP', selector: 'app=prometheus' },
  { name: 'grafana', type: 'ClusterIP', clusterIP: '10.96.34.67', ports: '3000/TCP', selector: 'app=grafana' },
  { name: 'loki', type: 'ClusterIP', clusterIP: '10.96.56.78', ports: '3100/TCP', selector: 'app=loki' },
];

const mockMetrics = {
  requestRate: 52.3,
  errorRate: 0.4,
  p50Latency: 85,
  p95Latency: 245,
  p99Latency: 420,
  cpuUsage: 42,
  memoryUsage: 58,
  activeConnections: 156,
  totalVectors: 48500,
  queriesPerMin: 312,
};

const mockAlerts = [
  { name: 'HighMemoryUsage', severity: 'warning', status: 'resolved', message: 'Memory usage above 70% on qdrant-0', time: '45m ago' },
  { name: 'PodRestartDetected', severity: 'info', status: 'firing', message: 'Pod docuquery-api-7d8f9c6b5-ghi56 restarted', time: '2h ago' },
];

const mockLogs = [
  { time: '14:32:15', level: 'INFO', source: 'docuquery-api', message: 'Query processed successfully in 142ms' },
  { time: '14:32:14', level: 'INFO', source: 'docuquery-api', message: 'Health check passed' },
  { time: '14:32:12', level: 'DEBUG', source: 'docuquery-api', message: 'Vector search returned 5 results' },
  { time: '14:32:10', level: 'INFO', source: 'qdrant', message: 'Collection stats updated' },
  { time: '14:32:08', level: 'WARN', source: 'docuquery-api', message: 'Rate limit approaching for client 192.168.1.45' },
  { time: '14:32:05', level: 'INFO', source: 'prometheus', message: 'Scrape completed for docuquery-api' },
  { time: '14:32:02', level: 'INFO', source: 'docuquery-api', message: 'Document embedding generated' },
  { time: '14:31:58', level: 'INFO', source: 'loki', message: 'Log batch received from promtail' },
];

const helmValues = `# values.yaml - Staging Configuration
replicaCount: 3

image:
  repository: docuquery/api
  tag: "1.0.0"
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 100m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilization: 70
  targetMemoryUtilization: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: staging.docuquery.dev
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: docuquery-tls
      hosts:
        - staging.docuquery.dev

config:
  environment: staging
  logLevel: INFO
  qdrant:
    host: qdrant
    port: 6333

metrics:
  enabled: true
  serviceMonitor:
    enabled: true
    interval: 30s`;

const prometheusConfig = `# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - /etc/prometheus/alerts.yml

scrape_configs:
  - job_name: 'docuquery-api'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace]
        regex: docuquery
        action: keep
      - source_labels: [__meta_kubernetes_pod_label_app]
        regex: docuquery-api
        action: keep

  - job_name: 'qdrant'
    static_configs:
      - targets: ['qdrant:6333']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']`;

const alertRules = `# alerts.yml
groups:
  - name: docuquery
    rules:
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) 
          / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95, 
            rate(http_request_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
          
      - alert: PodCrashLooping
        expr: |
          rate(kube_pod_container_status_restarts_total[15m]) > 0
        for: 15m
        labels:
          severity: warning`;

const k8sManifests = [
  { name: 'namespace.yaml', desc: 'Namespace definition' },
  { name: 'deployment.yaml', desc: 'API deployment with 3 replicas' },
  { name: 'service.yaml', desc: 'ClusterIP and LoadBalancer services' },
  { name: 'ingress.yaml', desc: 'NGINX ingress with TLS' },
  { name: 'configmap.yaml', desc: 'Application configuration' },
  { name: 'secrets.yaml', desc: 'API keys and credentials' },
  { name: 'hpa.yaml', desc: 'Horizontal Pod Autoscaler' },
  { name: 'pdb.yaml', desc: 'Pod Disruption Budget' },
  { name: 'rbac.yaml', desc: 'ServiceAccount and roles' },
  { name: 'network-policy.yaml', desc: 'Network segmentation' },
];

const helmTemplates = [
  { name: 'deployment.yaml', desc: 'Templated deployment' },
  { name: 'service.yaml', desc: 'Templated service' },
  { name: 'ingress.yaml', desc: 'Templated ingress' },
  { name: 'configmap.yaml', desc: 'Templated config' },
  { name: 'secrets.yaml', desc: 'Templated secrets' },
  { name: 'hpa.yaml', desc: 'Templated HPA' },
  { name: 'pdb.yaml', desc: 'Templated PDB' },
  { name: 'servicemonitor.yaml', desc: 'Prometheus ServiceMonitor' },
  { name: '_helpers.tpl', desc: 'Template helpers' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'comparison', label: 'Dev vs Staging', icon: GitBranch },
    { id: 'kubernetes', label: 'Kubernetes', icon: Container },
    { id: 'helm', label: 'Helm', icon: Box },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'logging', label: 'Logging', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      Running: 'bg-green-500/20 text-green-400 border-green-500/30',
      Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      firing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.Running}`}>
        {status}
      </span>
    );
  };

  const MetricCard = ({ icon: Icon, label, value, unit, color = 'blue' }) => (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>
        <Icon size={20} />
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}<span className="metric-unit">{unit}</span></div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );

  const CodeBlock = ({ title, code, language = 'yaml' }) => (
    <div className="code-block">
      <div className="code-header">
        <span className="code-title">{title}</span>
        <span className="code-lang">{language}</span>
      </div>
      <pre className="code-content">{code}</pre>
    </div>
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="stage-badge">
            <Target size={16} />
            Stage 4 of 5
          </div>
          <h1>Staging Environment</h1>
          <p>Kubernetes deployment with Helm, Prometheus, Grafana, and Loki observability stack</p>
        </motion.div>
      </header>

      {/* Navigation */}
      <nav className="nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
        <button className="refresh-btn" onClick={handleRefresh}>
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Cluster Status */}
              <div className="cluster-status">
                <div className="status-header">
                  <h2><Cloud size={20} /> Staging Cluster Status</h2>
                  <span className="status-badge healthy">
                    <CheckCircle size={14} /> All Systems Operational
                  </span>
                </div>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>API Server</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>etcd</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Scheduler</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Controller</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <MetricCard icon={Zap} label="Request Rate" value={mockMetrics.requestRate} unit=" req/s" color="blue" />
                <MetricCard icon={AlertTriangle} label="Error Rate" value={mockMetrics.errorRate} unit="%" color="green" />
                <MetricCard icon={Clock} label="P95 Latency" value={mockMetrics.p95Latency} unit="ms" color="purple" />
                <MetricCard icon={Activity} label="Active Connections" value={mockMetrics.activeConnections} unit="" color="cyan" />
                <MetricCard icon={Cpu} label="CPU Usage" value={mockMetrics.cpuUsage} unit="%" color="orange" />
                <MetricCard icon={HardDrive} label="Memory Usage" value={mockMetrics.memoryUsage} unit="%" color="pink" />
                <MetricCard icon={Database} label="Total Vectors" value={mockMetrics.totalVectors.toLocaleString()} unit="" color="green" />
                <MetricCard icon={BarChart3} label="Queries/min" value={mockMetrics.queriesPerMin} unit="" color="blue" />
              </div>

              {/* Infrastructure Overview */}
              <section className="section">
                <h2 className="section-title">
                  <Layers size={24} />
                  Infrastructure Components
                </h2>
                <div className="infra-diagram">
                  <div className="infra-row">
                    <div className="infra-box ingress">
                      <Network size={20} />
                      <span>Ingress</span>
                      <small>NGINX + TLS</small>
                    </div>
                  </div>
                  <div className="infra-arrow">↓</div>
                  <div className="infra-row">
                    <div className="infra-box service">
                      <Server size={20} />
                      <span>LoadBalancer</span>
                      <small>staging.docuquery.dev</small>
                    </div>
                  </div>
                  <div className="infra-arrow">↓</div>
                  <div className="infra-row pods">
                    <div className="infra-box pod">
                      <Container size={16} />
                      <span>Pod 1</span>
                    </div>
                    <div className="infra-box pod">
                      <Container size={16} />
                      <span>Pod 2</span>
                    </div>
                    <div className="infra-box pod">
                      <Container size={16} />
                      <span>Pod 3</span>
                    </div>
                  </div>
                  <div className="infra-arrow">↓</div>
                  <div className="infra-row services">
                    <div className="infra-box db">
                      <Database size={16} />
                      <span>Qdrant</span>
                    </div>
                    <div className="infra-box monitoring">
                      <Activity size={16} />
                      <span>Prometheus</span>
                    </div>
                    <div className="infra-box monitoring">
                      <BarChart3 size={16} />
                      <span>Grafana</span>
                    </div>
                    <div className="infra-box logging">
                      <FileText size={16} />
                      <span>Loki</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stage 4 Features */}
              <section className="section">
                <h2 className="section-title">
                  <Zap size={24} />
                  Stage 4 Features
                </h2>
                <div className="cards-grid">
                  <div className="card">
                    <div className="card-icon blue"><Container size={24} /></div>
                    <h3>Kubernetes Deployment</h3>
                    <p>Full K8s manifests with Kustomize overlays for staging environment</p>
                  </div>
                  <div className="card">
                    <div className="card-icon purple"><Box size={24} /></div>
                    <h3>Helm Charts</h3>
                    <p>Templated deployment with values.yaml for environment-specific configs</p>
                  </div>
                  <div className="card">
                    <div className="card-icon green"><Activity size={24} /></div>
                    <h3>Prometheus Monitoring</h3>
                    <p>Metrics collection with custom alert rules and ServiceMonitor</p>
                  </div>
                  <div className="card">
                    <div className="card-icon orange"><BarChart3 size={24} /></div>
                    <h3>Grafana Dashboards</h3>
                    <p>Pre-configured dashboards for API metrics and system health</p>
                  </div>
                  <div className="card">
                    <div className="card-icon cyan"><FileText size={24} /></div>
                    <h3>Loki + Promtail</h3>
                    <p>Centralized logging with log aggregation and querying</p>
                  </div>
                  <div className="card">
                    <div className="card-icon pink"><Shield size={24} /></div>
                    <h3>Network Policies</h3>
                    <p>Pod-to-pod communication rules and security boundaries</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Comparison Tab - Dev vs Staging */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Evolution Overview */}
              <div className="comparison-section">
                <h3><GitBranch size={20} /> Stage Evolution: Development → Staging</h3>
                <div className="comparison-grid">
                  <div className="comparison-column dev">
                    <h4><Code size={16} /> Stage 3: Development</h4>
                    <div className="comparison-item">
                      <Terminal size={14} />
                      <span>Local development with <code>make dev</code></span>
                    </div>
                    <div className="comparison-item">
                      <Database size={14} />
                      <span>In-memory Qdrant vector store</span>
                    </div>
                    <div className="comparison-item">
                      <TestTube size={14} />
                      <span>150+ tests (unit, integration, e2e, security)</span>
                    </div>
                    <div className="comparison-item">
                      <Shield size={14} />
                      <span>Pre-commit hooks & quality gates</span>
                    </div>
                    <div className="comparison-item">
                      <Workflow size={14} />
                      <span>GitHub Actions CI/CD pipeline</span>
                    </div>
                    <div className="comparison-item">
                      <Container size={14} />
                      <span>Single Docker container</span>
                    </div>
                    <div className="comparison-item">
                      <FileText size={14} />
                      <span>Console logging only</span>
                    </div>
                    <div className="comparison-item">
                      <Monitor size={14} />
                      <span>Streamlit dev UI</span>
                    </div>
                  </div>
                  <div className="comparison-column staging">
                    <h4><Cloud size={16} /> Stage 4: Staging</h4>
                    <div className="comparison-item">
                      <Container size={14} />
                      <span>Kubernetes deployment with 3 replicas</span>
                    </div>
                    <div className="comparison-item">
                      <Database size={14} />
                      <span>Persistent Qdrant with StatefulSet</span>
                    </div>
                    <div className="comparison-item">
                      <Box size={14} />
                      <span>Helm charts for templated deployment</span>
                    </div>
                    <div className="comparison-item">
                      <Activity size={14} />
                      <span>Prometheus metrics & alerting</span>
                    </div>
                    <div className="comparison-item">
                      <BarChart3 size={14} />
                      <span>Grafana dashboards for visualization</span>
                    </div>
                    <div className="comparison-item">
                      <FileText size={14} />
                      <span>Loki + Promtail centralized logging</span>
                    </div>
                    <div className="comparison-item">
                      <Zap size={14} />
                      <span>HPA auto-scaling (2-5 pods)</span>
                    </div>
                    <div className="comparison-item">
                      <Network size={14} />
                      <span>Ingress with TLS & network policies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Differences */}
              <section className="section">
                <h2 className="section-title">
                  <ArrowRight size={24} />
                  Key Differences
                </h2>
                <div className="cards-grid">
                  <div className="card">
                    <div className="card-icon blue"><Container size={24} /></div>
                    <h3>Container Orchestration</h3>
                    <p><strong>Dev:</strong> Single container, docker-compose<br/>
                    <strong>Staging:</strong> Kubernetes with multiple replicas, HPA, PDB</p>
                  </div>
                  <div className="card">
                    <div className="card-icon green"><Activity size={24} /></div>
                    <h3>Observability</h3>
                    <p><strong>Dev:</strong> Console logs, basic health endpoints<br/>
                    <strong>Staging:</strong> Full Prometheus + Grafana + Loki stack</p>
                  </div>
                  <div className="card">
                    <div className="card-icon purple"><Box size={24} /></div>
                    <h3>Deployment Method</h3>
                    <p><strong>Dev:</strong> Manual docker build/run<br/>
                    <strong>Staging:</strong> Helm charts with environment-specific values</p>
                  </div>
                  <div className="card">
                    <div className="card-icon orange"><Shield size={24} /></div>
                    <h3>Security & Networking</h3>
                    <p><strong>Dev:</strong> Local network only<br/>
                    <strong>Staging:</strong> RBAC, Network Policies, TLS ingress</p>
                  </div>
                  <div className="card">
                    <div className="card-icon cyan"><Database size={24} /></div>
                    <h3>Data Persistence</h3>
                    <p><strong>Dev:</strong> In-memory, data lost on restart<br/>
                    <strong>Staging:</strong> Persistent volumes, StatefulSets</p>
                  </div>
                  <div className="card">
                    <div className="card-icon pink"><Zap size={24} /></div>
                    <h3>Scalability</h3>
                    <p><strong>Dev:</strong> Single instance<br/>
                    <strong>Staging:</strong> Auto-scaling based on CPU/memory metrics</p>
                  </div>
                </div>
              </section>

              {/* What's New in Stage 4 */}
              <section className="section">
                <h2 className="section-title">
                  <Zap size={24} />
                  New in Stage 4
                </h2>
                <div className="manifest-grid">
                  <div className="manifest-item">
                    <Container size={20} />
                    <div>
                      <span className="manifest-name">k8s/base/</span>
                      <span className="manifest-desc">10 Kubernetes manifests</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <Box size={20} />
                    <div>
                      <span className="manifest-name">helm/docuquery/</span>
                      <span className="manifest-desc">Full Helm chart with templates</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <Activity size={20} />
                    <div>
                      <span className="manifest-name">monitoring/prometheus/</span>
                      <span className="manifest-desc">Prometheus config & alerts</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <BarChart3 size={20} />
                    <div>
                      <span className="manifest-name">monitoring/grafana/</span>
                      <span className="manifest-desc">2 pre-built dashboards</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <FileText size={20} />
                    <div>
                      <span className="manifest-name">logging/loki/</span>
                      <span className="manifest-desc">Log aggregation config</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <FileText size={20} />
                    <div>
                      <span className="manifest-name">logging/promtail/</span>
                      <span className="manifest-desc">Log collection agent</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <FileText size={20} />
                    <div>
                      <span className="manifest-name">logging/fluentbit/</span>
                      <span className="manifest-desc">Alternative log forwarder</span>
                    </div>
                  </div>
                  <div className="manifest-item">
                    <Monitor size={20} />
                    <div>
                      <span className="manifest-name">streamlit_infra.py</span>
                      <span className="manifest-desc">Infrastructure dashboard UI</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Commands Comparison */}
              <section className="section">
                <h2 className="section-title">
                  <Terminal size={24} />
                  Commands
                </h2>
                <div className="comparison-grid">
                  <div className="comparison-column dev">
                    <h4><Code size={16} /> Development (Stage 3)</h4>
                    <CodeBlock 
                      title="Local Commands" 
                      code={`# Run locally
make dev              # FastAPI on :8000
make streamlit        # UI on :8501
make test             # Run 150+ tests
make lint             # Code quality
make docker-up        # Docker compose`}
                    />
                  </div>
                  <div className="comparison-column staging">
                    <h4><Cloud size={16} /> Staging (Stage 4)</h4>
                    <CodeBlock 
                      title="Kubernetes Commands" 
                      code={`# Deploy to Kubernetes
kubectl apply -k k8s/overlays/staging

# Or use Helm
helm install docuquery ./helm/docuquery \\
  --namespace docuquery \\
  --set secrets.openaiApiKey=$KEY

# View infrastructure
make infra-dashboard  # UI on :8502`}
                    />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Kubernetes Tab */}
          {activeTab === 'kubernetes' && (
            <motion.div
              key="kubernetes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Pods */}
              <section className="section">
                <h2 className="section-title">
                  <Container size={24} />
                  Pods ({mockPods.length} running)
                </h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Ready</th>
                        <th>Status</th>
                        <th>Restarts</th>
                        <th>Age</th>
                        <th>CPU</th>
                        <th>Memory</th>
                        <th>Node</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPods.map((pod, i) => (
                        <tr key={i}>
                          <td className="pod-name">{pod.name}</td>
                          <td>{pod.ready}</td>
                          <td><StatusBadge status={pod.status} /></td>
                          <td>{pod.restarts}</td>
                          <td>{pod.age}</td>
                          <td>{pod.cpu}</td>
                          <td>{pod.memory}</td>
                          <td>{pod.node}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Services */}
              <section className="section">
                <h2 className="section-title">
                  <Network size={24} />
                  Services ({mockServices.length})
                </h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Cluster IP / External</th>
                        <th>Ports</th>
                        <th>Selector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockServices.map((svc, i) => (
                        <tr key={i}>
                          <td className="svc-name">{svc.name}</td>
                          <td><span className={`type-badge ${svc.type.toLowerCase()}`}>{svc.type}</span></td>
                          <td>{svc.externalIP || svc.clusterIP}</td>
                          <td>{svc.ports}</td>
                          <td className="selector">{svc.selector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* K8s Manifests */}
              <section className="section">
                <h2 className="section-title">
                  <FileText size={24} />
                  Kubernetes Manifests (k8s/base/)
                </h2>
                <div className="manifest-grid">
                  {k8sManifests.map((manifest, i) => (
                    <div key={i} className="manifest-item">
                      <FileText size={16} />
                      <div>
                        <span className="manifest-name">{manifest.name}</span>
                        <span className="manifest-desc">{manifest.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* Helm Tab */}
          {activeTab === 'helm' && (
            <motion.div
              key="helm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Helm Release Info */}
              <div className="helm-info">
                <div className="helm-card">
                  <h3>Helm Release</h3>
                  <div className="helm-details">
                    <div><span>Chart:</span> docuquery</div>
                    <div><span>Version:</span> 0.1.0</div>
                    <div><span>App Version:</span> 1.0.0</div>
                    <div><span>Status:</span> <StatusBadge status="Running" /></div>
                    <div><span>Revision:</span> 3</div>
                    <div><span>Namespace:</span> docuquery</div>
                  </div>
                </div>
              </div>

              {/* Helm Templates */}
              <section className="section">
                <h2 className="section-title">
                  <Box size={24} />
                  Helm Templates (helm/docuquery/templates/)
                </h2>
                <div className="manifest-grid">
                  {helmTemplates.map((template, i) => (
                    <div key={i} className="manifest-item">
                      <FileText size={16} />
                      <div>
                        <span className="manifest-name">{template.name}</span>
                        <span className="manifest-desc">{template.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Values.yaml */}
              <section className="section">
                <h2 className="section-title">
                  <Settings size={24} />
                  Staging Values
                </h2>
                <CodeBlock title="values.yaml" code={helmValues} />
              </section>
            </motion.div>
          )}

          {/* Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Prometheus Metrics */}
              <section className="section">
                <h2 className="section-title">
                  <Activity size={24} />
                  Prometheus Metrics
                </h2>
                <div className="metrics-grid compact">
                  <div className="metric-detail">
                    <span className="metric-name">http_requests_total</span>
                    <span className="metric-value-sm">1,245,678</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">http_request_duration_seconds_p50</span>
                    <span className="metric-value-sm">0.085s</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">http_request_duration_seconds_p95</span>
                    <span className="metric-value-sm">0.245s</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">http_request_duration_seconds_p99</span>
                    <span className="metric-value-sm">0.420s</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">qdrant_vectors_total</span>
                    <span className="metric-value-sm">48,500</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">llm_requests_total</span>
                    <span className="metric-value-sm">89,234</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">embedding_requests_total</span>
                    <span className="metric-value-sm">156,789</span>
                  </div>
                  <div className="metric-detail">
                    <span className="metric-name">rate_limit_exceeded_total</span>
                    <span className="metric-value-sm">23</span>
                  </div>
                </div>
              </section>

              {/* Prometheus Config */}
              <section className="section">
                <h2 className="section-title">
                  <Settings size={24} />
                  Prometheus Configuration
                </h2>
                <CodeBlock title="prometheus.yml" code={prometheusConfig} />
              </section>

              {/* Grafana Dashboards */}
              <section className="section">
                <h2 className="section-title">
                  <BarChart3 size={24} />
                  Grafana Dashboards
                </h2>
                <div className="dashboard-grid">
                  <div className="dashboard-card">
                    <BarChart3 size={24} />
                    <h4>DocuQuery API Dashboard</h4>
                    <p>Request rate, latency percentiles, error rate, endpoint breakdown</p>
                  </div>
                  <div className="dashboard-card">
                    <Gauge size={24} />
                    <h4>System Dashboard</h4>
                    <p>CPU, memory, disk usage, container metrics, Qdrant stats</p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Logging Tab */}
          {activeTab === 'logging' && (
            <motion.div
              key="logging"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Log Stream */}
              <section className="section">
                <h2 className="section-title">
                  <FileText size={24} />
                  Live Log Stream (Loki)
                </h2>
                <div className="log-filters">
                  <select className="log-filter">
                    <option>All Levels</option>
                    <option>INFO</option>
                    <option>WARN</option>
                    <option>ERROR</option>
                    <option>DEBUG</option>
                  </select>
                  <select className="log-filter">
                    <option>All Sources</option>
                    <option>docuquery-api</option>
                    <option>qdrant</option>
                    <option>prometheus</option>
                    <option>loki</option>
                  </select>
                  <input type="text" placeholder="Search logs..." className="log-search" />
                </div>
                <div className="log-stream">
                  {mockLogs.map((log, i) => (
                    <div key={i} className={`log-entry ${log.level.toLowerCase()}`}>
                      <span className="log-time">{log.time}</span>
                      <span className={`log-level ${log.level.toLowerCase()}`}>{log.level}</span>
                      <span className="log-source">[{log.source}]</span>
                      <span className="log-message">{log.message}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Logging Stack */}
              <section className="section">
                <h2 className="section-title">
                  <Layers size={24} />
                  Logging Stack
                </h2>
                <div className="logging-stack">
                  <div className="stack-item">
                    <div className="stack-icon"><Container size={20} /></div>
                    <div className="stack-info">
                      <h4>Promtail</h4>
                      <p>Log collection agent running as DaemonSet, collects logs from all pods</p>
                    </div>
                  </div>
                  <div className="stack-arrow">→</div>
                  <div className="stack-item">
                    <div className="stack-icon"><Database size={20} /></div>
                    <div className="stack-info">
                      <h4>Loki</h4>
                      <p>Log aggregation and storage with label-based indexing</p>
                    </div>
                  </div>
                  <div className="stack-arrow">→</div>
                  <div className="stack-item">
                    <div className="stack-icon"><BarChart3 size={20} /></div>
                    <div className="stack-info">
                      <h4>Grafana</h4>
                      <p>Visualization and LogQL queries for log exploration</p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Active Alerts */}
              <section className="section">
                <h2 className="section-title">
                  <Bell size={24} />
                  Alerts
                </h2>
                <div className="alerts-list">
                  {mockAlerts.map((alert, i) => (
                    <div key={i} className={`alert-item ${alert.status} ${alert.severity}`}>
                      <div className="alert-header">
                        <span className="alert-name">{alert.name}</span>
                        <StatusBadge status={alert.status} />
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <span className="alert-time">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Alert Rules */}
              <section className="section">
                <h2 className="section-title">
                  <Shield size={24} />
                  Alert Rules Configuration
                </h2>
                <CodeBlock title="alerts.yml" code={alertRules} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          <strong>DocuQuery</strong> | Stage 4: Staging Environment
        </p>
        <div className="tech-stack">
          <span className="tech-badge k8s">Kubernetes</span>
          <span className="tech-badge helm">Helm</span>
          <span className="tech-badge prometheus">Prometheus</span>
          <span className="tech-badge grafana">Grafana</span>
          <span className="tech-badge loki">Loki</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
