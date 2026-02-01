import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, Server, Database, Activity, AlertTriangle, CheckCircle,
  ChevronRight, ChevronDown, Box, Layers, Settings, Shield,
  Terminal, GitBranch, Cpu, HardDrive, Gauge, BarChart3,
  Container, Network, FileText, Clock, RefreshCw, Zap,
  Target, Eye, Bell, Search, Filter, Play, Pause, ArrowRight,
  Code, TestTube, Workflow, Monitor, Rocket, Lock, Globe,
  TrendingUp, Award, ShieldCheck, GitMerge, Repeat, Users
} from 'lucide-react';

// ===========================================
// Mock Data for Production Environment
// ===========================================

const mockPods = [
  { name: 'docuquery-blue-7d8f9c6b5-prod1', status: 'Running', ready: '1/1', restarts: 0, age: '15d', cpu: '180m', memory: '512Mi', node: 'prod-node-1', color: 'blue' },
  { name: 'docuquery-blue-7d8f9c6b5-prod2', status: 'Running', ready: '1/1', restarts: 0, age: '15d', cpu: '165m', memory: '498Mi', node: 'prod-node-2', color: 'blue' },
  { name: 'docuquery-blue-7d8f9c6b5-prod3', status: 'Running', ready: '1/1', restarts: 0, age: '15d', cpu: '172m', memory: '505Mi', node: 'prod-node-3', color: 'blue' },
  { name: 'docuquery-green-8e9f0d7c6-prod1', status: 'Running', ready: '1/1', restarts: 0, age: '2h', cpu: '45m', memory: '256Mi', node: 'prod-node-1', color: 'green' },
  { name: 'docuquery-green-8e9f0d7c6-prod2', status: 'Running', ready: '1/1', restarts: 0, age: '2h', cpu: '52m', memory: '312Mi', node: 'prod-node-2', color: 'green' },
  { name: 'docuquery-green-8e9f0d7c6-prod3', status: 'Running', ready: '1/1', restarts: 0, age: '2h', cpu: '38m', memory: '289Mi', node: 'prod-node-3', color: 'green' },
  { name: 'qdrant-0', status: 'Running', ready: '1/1', restarts: 0, age: '30d', cpu: '250m', memory: '2.5Gi', node: 'prod-node-db-1' },
  { name: 'qdrant-1', status: 'Running', ready: '1/1', restarts: 0, age: '30d', cpu: '245m', memory: '2.4Gi', node: 'prod-node-db-2' },
  { name: 'qdrant-2', status: 'Running', ready: '1/1', restarts: 0, age: '30d', cpu: '238m', memory: '2.3Gi', node: 'prod-node-db-3' },
];

const mockServices = [
  { name: 'docuquery-active', type: 'ClusterIP', clusterIP: '10.96.45.100', ports: '8000/TCP', selector: 'color=blue', role: 'Active Traffic' },
  { name: 'docuquery-preview', type: 'ClusterIP', clusterIP: '10.96.45.101', ports: '8000/TCP', selector: 'color=green', role: 'Preview/Test' },
  { name: 'docuquery-blue', type: 'ClusterIP', clusterIP: '10.96.45.123', ports: '8000/TCP', selector: 'color=blue', role: 'Blue Deployment' },
  { name: 'docuquery-green', type: 'ClusterIP', clusterIP: '10.96.45.124', ports: '8000/TCP', selector: 'color=green', role: 'Green Deployment' },
  { name: 'docuquery-external', type: 'LoadBalancer', externalIP: 'docuquery.example.com', ports: '443/TCP', selector: 'role=active', role: 'Production Ingress' },
];

const mockMetrics = {
  requestRate: 1247.5,
  errorRate: 0.02,
  p50Latency: 45,
  p95Latency: 125,
  p99Latency: 245,
  cpuUsage: 38,
  memoryUsage: 52,
  activeConnections: 3456,
  totalVectors: 2500000,
  queriesPerMin: 8520,
  availability: 99.99,
  errorBudget: 87.5,
};

const mockSLOs = [
  { name: 'Availability', target: '99.9%', current: '99.99%', status: 'healthy', errorBudgetRemaining: '87.5%' },
  { name: 'Latency P95', target: '<200ms', current: '125ms', status: 'healthy', errorBudgetRemaining: '92.3%' },
  { name: 'Latency P99', target: '<500ms', current: '245ms', status: 'healthy', errorBudgetRemaining: '95.1%' },
  { name: 'Error Rate', target: '<0.1%', current: '0.02%', status: 'healthy', errorBudgetRemaining: '98.0%' },
];

const mockDeployments = [
  { version: 'v1.4.2', color: 'blue', status: 'Active', traffic: '100%', replicas: '3/3', lastDeploy: '15 days ago' },
  { version: 'v1.5.0', color: 'green', status: 'Preview', traffic: '0%', replicas: '3/3', lastDeploy: '2 hours ago' },
];

const mockAlerts = [
  { name: 'SLOLatencyP99Warning', severity: 'warning', status: 'resolved', message: 'P99 latency approaching threshold', time: '3h ago' },
];

const stagingVsProductionComparison = [
  { aspect: 'Replicas', staging: '2-5', production: '3-20', icon: Container },
  { aspect: 'Deployment Strategy', staging: 'Rolling Update', production: 'Blue/Green', icon: GitMerge },
  { aspect: 'SLO Monitoring', staging: 'Basic', production: 'Full SLO/SLI with Error Budgets', icon: Target },
  { aspect: 'Security', staging: 'Standard', production: 'Hardened + Network Policies', icon: ShieldCheck },
  { aspect: 'Auto-scaling', staging: 'CPU-based', production: 'CPU + Memory + Custom Metrics', icon: TrendingUp },
  { aspect: 'Availability Target', staging: '99%', production: '99.9%', icon: Award },
  { aspect: 'Resource Limits', staging: '1 CPU, 1Gi', production: '2 CPU, 2Gi', icon: Cpu },
  { aspect: 'Pod Disruption Budget', staging: 'minAvailable: 1', production: 'minAvailable: 2', icon: Shield },
  { aspect: 'Network Policy', staging: 'Basic ingress', production: 'Strict ingress + egress', icon: Network },
  { aspect: 'Traffic Management', staging: 'Direct', production: 'Blue/Green with Preview', icon: Repeat },
];

const blueGreenDeploymentConfig = `# Blue/Green Deployment Configuration
---
# Blue Deployment (Currently Active)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docuquery-blue
  namespace: docuquery-production
  labels:
    app: docuquery
    color: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: docuquery
      color: blue
  template:
    spec:
      containers:
        - name: docuquery
          image: ghcr.io/docuquery:v1.4.2
          env:
            - name: DEPLOYMENT_COLOR
              value: "blue"

---
# Green Deployment (Preview/Next Version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docuquery-green
  namespace: docuquery-production
  labels:
    app: docuquery
    color: green
spec:
  replicas: 3  # Scale up for testing
  selector:
    matchLabels:
      app: docuquery
      color: green
  template:
    spec:
      containers:
        - name: docuquery
          image: ghcr.io/docuquery:v1.5.0
          env:
            - name: DEPLOYMENT_COLOR
              value: "green"

---
# Active Service (Production Traffic)
apiVersion: v1
kind: Service
metadata:
  name: docuquery-active
spec:
  selector:
    color: blue  # Switch to 'green' during deployment
  ports:
    - port: 80
      targetPort: 8000`;

const productionHelmValues = `# values-production.yaml
environment: production

replicaCount: 3

image:
  repository: ghcr.io/fnusatvik07/docuquery
  tag: production-latest
  pullPolicy: IfNotPresent

resources:
  limits:
    cpu: "2000m"
    memory: "2Gi"
  requests:
    cpu: "500m"
    memory: "1Gi"

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 20
  targetCPUUtilization: 60
  targetMemoryUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
  hosts:
    - host: docuquery.example.com
  tls:
    - secretName: docuquery-production-tls

podDisruptionBudget:
  enabled: true
  minAvailable: 2

affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - topologyKey: kubernetes.io/hostname

topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone`;

const productionAlerts = `# Production Alert Rules (Critical)
groups:
  - name: docuquery-production-critical
    rules:
      - alert: DocuQueryProductionDown
        expr: up{environment="production"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "CRITICAL: Production is DOWN"

      - alert: SLOAvailabilityBreach
        expr: docuquery:slo:availability:ratio < 0.999
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "SLO Availability breach (< 99.9%)"

      - alert: SLOLatencyBreach
        expr: docuquery:slo:latency:p99 > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "SLO P99 Latency breach (> 500ms)"

      - alert: ErrorBudgetExhausted
        expr: docuquery:error_budget:remaining < 0.1
        for: 0m
        labels:
          severity: critical
        annotations:
          summary: "Error budget < 10% remaining"`;

const cicdPipeline = `# Production CI/CD Pipeline
name: Production Deployment

on:
  push:
    branches: [stage5-production]
    tags: ['v*']

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Run full test suite
        run: pytest --cov-fail-under=80

  security-scan:
    needs: build-and-test
    steps:
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master

  build-image:
    needs: security-scan
    steps:
      - name: Build multi-arch image
        run: |
          docker buildx build \\
            --platform linux/amd64,linux/arm64

  deploy-production:
    needs: build-image
    environment: production
    steps:
      - name: Blue/Green deployment
        run: |
          # Deploy to inactive color
          # Run smoke tests
          # Switch traffic
          # Monitor for issues`;

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeDeployment, setActiveDeployment] = useState('blue');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'comparison', label: 'Staging vs Prod', icon: GitBranch },
    { id: 'bluegreen', label: 'Blue/Green', icon: Repeat },
    { id: 'slos', label: 'SLOs', icon: Award },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'cicd', label: 'CI/CD', icon: Workflow },
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
      Running: 'bg-green-100 text-green-700 border-green-300',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Failed: 'bg-red-100 text-red-700 border-red-300',
      Active: 'bg-blue-100 text-blue-700 border-blue-300',
      Preview: 'bg-purple-100 text-purple-700 border-purple-300',
      healthy: 'bg-green-100 text-green-700 border-green-300',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      critical: 'bg-red-100 text-red-700 border-red-300',
      resolved: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[status] || colors.Running}`}>
        {status}
      </span>
    );
  };

  const MetricCard = ({ icon: Icon, label, value, unit, color = 'blue', trend }) => (
    <div className="metric-card">
      <div className={`metric-icon ${color}`}>
        <Icon size={20} />
      </div>
      <div className="metric-content">
        <div className="metric-value">
          {value}<span className="metric-unit">{unit}</span>
          {trend && <span className={`trend ${trend > 0 ? 'up' : 'down'}`}>{trend > 0 ? '↑' : '↓'}</span>}
        </div>
        <div className="metric-label">{label}</div>
      </div>
    </div>
  );

  const SLOCard = ({ name, target, current, status, errorBudgetRemaining }) => (
    <div className={`slo-card ${status}`}>
      <div className="slo-header">
        <span className="slo-name">{name}</span>
        <StatusBadge status={status} />
      </div>
      <div className="slo-metrics">
        <div className="slo-metric">
          <span className="label">Target</span>
          <span className="value">{target}</span>
        </div>
        <div className="slo-metric">
          <span className="label">Current</span>
          <span className="value current">{current}</span>
        </div>
        <div className="slo-metric">
          <span className="label">Error Budget</span>
          <span className="value budget">{errorBudgetRemaining}</span>
        </div>
      </div>
      <div className="slo-bar">
        <div className="slo-bar-fill" style={{ width: errorBudgetRemaining }}></div>
      </div>
    </div>
  );

  const DeploymentCard = ({ version, color, status, traffic, replicas, lastDeploy }) => (
    <div className={`deployment-card ${color} ${status === 'Active' ? 'active' : ''}`}>
      <div className="deployment-header">
        <div className={`color-indicator ${color}`}></div>
        <span className="version">{version}</span>
        <StatusBadge status={status} />
      </div>
      <div className="deployment-details">
        <div className="detail">
          <Users size={14} />
          <span>Traffic: {traffic}</span>
        </div>
        <div className="detail">
          <Container size={14} />
          <span>Replicas: {replicas}</span>
        </div>
        <div className="detail">
          <Clock size={14} />
          <span>Deployed: {lastDeploy}</span>
        </div>
      </div>
      {status === 'Preview' && (
        <button className="switch-btn">
          <Repeat size={14} /> Switch Traffic
        </button>
      )}
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
          <div className="stage-badge production">
            <Rocket size={16} />
            Stage 5 of 5 - Production
          </div>
          <h1>Production Environment</h1>
          <p>Production-ready deployment with Blue/Green strategy, SLO monitoring, and high availability</p>
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
              {/* Production Status */}
              <div className="cluster-status production">
                <div className="status-header">
                  <h2><Globe size={20} /> Production Cluster Status</h2>
                  <span className="status-badge healthy">
                    <CheckCircle size={14} /> All Systems Operational
                  </span>
                </div>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>API (Blue)</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>API (Green)</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Qdrant Cluster</span>
                  </div>
                  <div className="status-item">
                    <span className="status-dot green"></span>
                    <span>Load Balancer</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="metrics-grid">
                <MetricCard icon={Award} label="Availability" value={mockMetrics.availability} unit="%" color="green" />
                <MetricCard icon={Zap} label="Request Rate" value={mockMetrics.requestRate.toLocaleString()} unit=" req/s" color="blue" />
                <MetricCard icon={AlertTriangle} label="Error Rate" value={mockMetrics.errorRate} unit="%" color="green" />
                <MetricCard icon={Clock} label="P99 Latency" value={mockMetrics.p99Latency} unit="ms" color="purple" />
                <MetricCard icon={Target} label="Error Budget" value={mockMetrics.errorBudget} unit="%" color="cyan" />
                <MetricCard icon={Users} label="Active Connections" value={mockMetrics.activeConnections.toLocaleString()} unit="" color="orange" />
                <MetricCard icon={Database} label="Total Vectors" value={(mockMetrics.totalVectors / 1000000).toFixed(1)} unit="M" color="pink" />
                <MetricCard icon={BarChart3} label="Queries/min" value={mockMetrics.queriesPerMin.toLocaleString()} unit="" color="blue" />
              </div>

              {/* Active Deployments */}
              <section className="section">
                <h2 className="section-title">
                  <Repeat size={24} />
                  Active Deployments
                </h2>
                <div className="deployments-grid">
                  {mockDeployments.map(dep => (
                    <DeploymentCard key={dep.color} {...dep} />
                  ))}
                </div>
              </section>

              {/* SLO Summary */}
              <section className="section">
                <h2 className="section-title">
                  <Award size={24} />
                  SLO Summary
                </h2>
                <div className="slo-grid">
                  {mockSLOs.map(slo => (
                    <SLOCard key={slo.name} {...slo} />
                  ))}
                </div>
              </section>

              {/* Pod Status */}
              <section className="section">
                <h2 className="section-title">
                  <Container size={24} />
                  Production Pods
                </h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Status</th>
                        <th>Ready</th>
                        <th>CPU</th>
                        <th>Memory</th>
                        <th>Node</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPods.map(pod => (
                        <tr key={pod.name}>
                          <td className="font-mono text-sm">{pod.name}</td>
                          <td>
                            {pod.color && (
                              <span className={`color-badge ${pod.color}`}>{pod.color}</span>
                            )}
                          </td>
                          <td><StatusBadge status={pod.status} /></td>
                          <td>{pod.ready}</td>
                          <td>{pod.cpu}</td>
                          <td>{pod.memory}</td>
                          <td>{pod.node}</td>
                          <td>{pod.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          )}

          {/* Comparison Tab */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <GitBranch size={24} />
                  Staging vs Production Comparison
                </h2>
                <div className="comparison-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Aspect</th>
                        <th>Staging</th>
                        <th>Production</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stagingVsProductionComparison.map(item => (
                        <tr key={item.aspect}>
                          <td>
                            <div className="aspect-cell">
                              <item.icon size={16} />
                              <span>{item.aspect}</span>
                            </div>
                          </td>
                          <td className="staging-cell">{item.staging}</td>
                          <td className="production-cell">{item.production}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </motion.div>
          )}

          {/* Blue/Green Tab */}
          {activeTab === 'bluegreen' && (
            <motion.div
              key="bluegreen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Repeat size={24} />
                  Blue/Green Deployment Strategy
                </h2>
                
                <div className="bluegreen-diagram">
                  <div className="traffic-flow">
                    <div className="ingress-box">
                      <Globe size={24} />
                      <span>Ingress</span>
                      <span className="small">docuquery.example.com</span>
                    </div>
                    <ArrowRight size={24} className="arrow" />
                    <div className="service-box active">
                      <Network size={24} />
                      <span>Active Service</span>
                      <span className="small">Points to Blue</span>
                    </div>
                    <div className="deployment-boxes">
                      <ArrowRight size={24} className="arrow" />
                      <div className="deployment-box blue active">
                        <Container size={20} />
                        <span>Blue (v1.4.2)</span>
                        <span className="traffic">100% Traffic</span>
                      </div>
                      <div className="deployment-box green">
                        <Container size={20} />
                        <span>Green (v1.5.0)</span>
                        <span className="traffic">Preview Only</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bluegreen-steps">
                  <h3>Deployment Process</h3>
                  <div className="steps-grid">
                    <div className="step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>Deploy to Inactive</h4>
                        <p>Deploy new version to the inactive color (green)</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Run Smoke Tests</h4>
                        <p>Test via preview service before switching traffic</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Switch Traffic</h4>
                        <p>Update active service selector to new color</p>
                      </div>
                    </div>
                    <div className="step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <h4>Monitor & Rollback</h4>
                        <p>Monitor metrics, instant rollback if issues</p>
                      </div>
                    </div>
                  </div>
                </div>

                <CodeBlock title="Blue/Green Configuration" code={blueGreenDeploymentConfig} />
              </section>
            </motion.div>
          )}

          {/* SLOs Tab */}
          {activeTab === 'slos' && (
            <motion.div
              key="slos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Award size={24} />
                  Service Level Objectives
                </h2>
                
                <div className="slo-dashboard">
                  <div className="slo-overview">
                    <div className="slo-stat">
                      <span className="stat-value">99.99%</span>
                      <span className="stat-label">Current Availability</span>
                    </div>
                    <div className="slo-stat">
                      <span className="stat-value">87.5%</span>
                      <span className="stat-label">Error Budget Remaining</span>
                    </div>
                    <div className="slo-stat">
                      <span className="stat-value">125ms</span>
                      <span className="stat-label">P95 Latency</span>
                    </div>
                    <div className="slo-stat">
                      <span className="stat-value">0.02%</span>
                      <span className="stat-label">Error Rate</span>
                    </div>
                  </div>

                  <div className="slo-cards">
                    {mockSLOs.map(slo => (
                      <SLOCard key={slo.name} {...slo} />
                    ))}
                  </div>
                </div>

                <CodeBlock title="Production Helm Values" code={productionHelmValues} />
              </section>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <ShieldCheck size={24} />
                  Production Security
                </h2>
                
                <div className="security-grid">
                  <div className="security-card">
                    <div className="security-icon"><Lock size={24} /></div>
                    <h3>TLS/SSL</h3>
                    <p>End-to-end encryption with Let's Encrypt certificates</p>
                    <StatusBadge status="healthy" />
                  </div>
                  <div className="security-card">
                    <div className="security-icon"><Network size={24} /></div>
                    <h3>Network Policies</h3>
                    <p>Strict ingress/egress rules, default deny</p>
                    <StatusBadge status="healthy" />
                  </div>
                  <div className="security-card">
                    <div className="security-icon"><Shield size={24} /></div>
                    <h3>Pod Security</h3>
                    <p>Non-root, read-only filesystem, dropped capabilities</p>
                    <StatusBadge status="healthy" />
                  </div>
                  <div className="security-card">
                    <div className="security-icon"><Eye size={24} /></div>
                    <h3>Vulnerability Scanning</h3>
                    <p>Trivy + Grype scans on every deployment</p>
                    <StatusBadge status="healthy" />
                  </div>
                  <div className="security-card">
                    <div className="security-icon"><Settings size={24} /></div>
                    <h3>Rate Limiting</h3>
                    <p>100 req/min per client, DDoS protection</p>
                    <StatusBadge status="healthy" />
                  </div>
                  <div className="security-card">
                    <div className="security-icon"><Database size={24} /></div>
                    <h3>Secrets Management</h3>
                    <p>External secrets, encrypted at rest</p>
                    <StatusBadge status="healthy" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* CI/CD Tab */}
          {activeTab === 'cicd' && (
            <motion.div
              key="cicd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <section className="section">
                <h2 className="section-title">
                  <Workflow size={24} />
                  Production CI/CD Pipeline
                </h2>
                
                <div className="pipeline-diagram">
                  <div className="pipeline-stage">
                    <div className="stage-icon"><Code size={20} /></div>
                    <span>Build & Test</span>
                    <span className="stage-detail">80% coverage required</span>
                  </div>
                  <ArrowRight size={20} />
                  <div className="pipeline-stage">
                    <div className="stage-icon"><Shield size={20} /></div>
                    <span>Security Scan</span>
                    <span className="stage-detail">Trivy + Grype</span>
                  </div>
                  <ArrowRight size={20} />
                  <div className="pipeline-stage">
                    <div className="stage-icon"><Container size={20} /></div>
                    <span>Build Image</span>
                    <span className="stage-detail">Multi-arch</span>
                  </div>
                  <ArrowRight size={20} />
                  <div className="pipeline-stage">
                    <div className="stage-icon"><Repeat size={20} /></div>
                    <span>Blue/Green Deploy</span>
                    <span className="stage-detail">Zero downtime</span>
                  </div>
                  <ArrowRight size={20} />
                  <div className="pipeline-stage">
                    <div className="stage-icon"><TestTube size={20} /></div>
                    <span>Smoke Tests</span>
                    <span className="stage-detail">Post-deploy validation</span>
                  </div>
                </div>

                <CodeBlock title="Production CI/CD Workflow" code={cicdPipeline} />
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
              <section className="section">
                <h2 className="section-title">
                  <Bell size={24} />
                  Production Alerts
                </h2>
                
                <div className="alerts-summary">
                  <div className="alert-stat critical">
                    <span className="count">0</span>
                    <span className="label">Critical</span>
                  </div>
                  <div className="alert-stat warning">
                    <span className="count">0</span>
                    <span className="label">Warning</span>
                  </div>
                  <div className="alert-stat resolved">
                    <span className="count">1</span>
                    <span className="label">Resolved</span>
                  </div>
                </div>

                <div className="alerts-list">
                  {mockAlerts.map((alert, idx) => (
                    <div key={idx} className={`alert-item ${alert.severity}`}>
                      <div className="alert-header">
                        <span className="alert-name">{alert.name}</span>
                        <StatusBadge status={alert.status} />
                      </div>
                      <p className="alert-message">{alert.message}</p>
                      <span className="alert-time">{alert.time}</span>
                    </div>
                  ))}
                </div>

                <CodeBlock title="Production Alert Rules" code={productionAlerts} />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>DocuQuery Production • Stage 5 of 5 • High Availability Deployment</p>
      </footer>
    </div>
  );
}

export default App;
