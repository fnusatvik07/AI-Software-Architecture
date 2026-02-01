"""
DocuQuery - Stage 4 Staging Infrastructure Dashboard
Shows mock staging environment metrics and status
"""

import streamlit as st
import time
import random
from datetime import datetime, timedelta
import json

# Page Configuration
st.set_page_config(
    page_title="DocuQuery | Staging Infrastructure",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main .block-container {
        padding-top: 1rem;
        max-width: 1400px;
    }
    
    .infra-header {
        background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
        padding: 1.5rem 2rem;
        border-radius: 1rem;
        color: white;
        margin-bottom: 1.5rem;
    }
    
    .infra-header h1 { margin: 0; font-size: 2rem; }
    .infra-header p { margin: 0.5rem 0 0 0; opacity: 0.9; }
    
    .status-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }
    
    .status-healthy { color: #059669; }
    .status-warning { color: #d97706; }
    .status-error { color: #dc2626; }
    
    .metric-box {
        background: #f8fafc;
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
    }
    
    .metric-value { font-size: 1.75rem; font-weight: 700; color: #0f172a; }
    .metric-label { font-size: 0.8rem; color: #64748b; }
    
    .pod-status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0.25rem;
    }
    
    .pod-running { background: #d1fae5; color: #065f46; }
    .pod-pending { background: #fef3c7; color: #92400e; }
    .pod-failed { background: #fee2e2; color: #991b1b; }
    
    .log-line {
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-left: 3px solid;
        margin-bottom: 0.25rem;
        background: #f8fafc;
    }
    
    .log-info { border-color: #3b82f6; }
    .log-warn { border-color: #f59e0b; }
    .log-error { border-color: #ef4444; }
</style>
""", unsafe_allow_html=True)

# Mock data generators
def get_mock_pods():
    """Generate mock pod status data."""
    pods = [
        {"name": "docuquery-api-7d8f9c6b5-abc12", "status": "Running", "restarts": 0, "age": "2d", "cpu": "45m", "memory": "256Mi"},
        {"name": "docuquery-api-7d8f9c6b5-def34", "status": "Running", "restarts": 0, "age": "2d", "cpu": "52m", "memory": "312Mi"},
        {"name": "docuquery-api-7d8f9c6b5-ghi56", "status": "Running", "restarts": 1, "age": "1d", "cpu": "38m", "memory": "289Mi"},
        {"name": "qdrant-0", "status": "Running", "restarts": 0, "age": "5d", "cpu": "120m", "memory": "1.2Gi"},
        {"name": "prometheus-0", "status": "Running", "restarts": 0, "age": "5d", "cpu": "85m", "memory": "512Mi"},
        {"name": "grafana-6f7d8c9b-xyz89", "status": "Running", "restarts": 0, "age": "5d", "cpu": "25m", "memory": "128Mi"},
        {"name": "loki-0", "status": "Running", "restarts": 0, "age": "5d", "cpu": "65m", "memory": "384Mi"},
    ]
    return pods

def get_mock_services():
    """Generate mock service data."""
    return [
        {"name": "docuquery-api", "type": "ClusterIP", "cluster_ip": "10.96.45.123", "ports": "8000/TCP"},
        {"name": "docuquery-api-external", "type": "LoadBalancer", "external_ip": "staging.docuquery.example.com", "ports": "443/TCP"},
        {"name": "qdrant", "type": "ClusterIP", "cluster_ip": "10.96.78.45", "ports": "6333/TCP,6334/TCP"},
        {"name": "prometheus", "type": "ClusterIP", "cluster_ip": "10.96.12.89", "ports": "9090/TCP"},
        {"name": "grafana", "type": "ClusterIP", "cluster_ip": "10.96.34.67", "ports": "3000/TCP"},
        {"name": "loki", "type": "ClusterIP", "cluster_ip": "10.96.56.78", "ports": "3100/TCP"},
    ]

def get_mock_metrics():
    """Generate mock Prometheus metrics."""
    return {
        "request_rate": round(random.uniform(45, 65), 1),
        "error_rate": round(random.uniform(0.1, 0.8), 2),
        "p95_latency": round(random.uniform(180, 280), 0),
        "p99_latency": round(random.uniform(350, 480), 0),
        "cpu_usage": round(random.uniform(35, 55), 1),
        "memory_usage": round(random.uniform(45, 65), 1),
        "active_connections": random.randint(120, 180),
        "vectors_stored": random.randint(45000, 55000),
    }

def get_mock_alerts():
    """Generate mock alerts."""
    alerts = [
        {"severity": "info", "name": "PodRestartDetected", "message": "Pod docuquery-api-7d8f9c6b5-ghi56 restarted", "time": "2h ago"},
        {"severity": "warning", "name": "HighMemoryUsage", "message": "Memory usage above 70% on qdrant-0", "time": "45m ago", "resolved": True},
    ]
    return alerts

def get_mock_logs():
    """Generate mock application logs."""
    log_templates = [
        ("INFO", "Processed query request", "docuquery-api"),
        ("INFO", "Document indexed successfully", "docuquery-api"),
        ("INFO", "Health check passed", "docuquery-api"),
        ("DEBUG", "Vector search completed in 45ms", "docuquery-api"),
        ("INFO", "Embedding generated for document chunk", "docuquery-api"),
        ("WARN", "Rate limit approaching for client 192.168.1.45", "docuquery-api"),
        ("INFO", "Metrics scraped successfully", "prometheus"),
        ("INFO", "Collection stats updated", "qdrant"),
    ]
    
    logs = []
    for i in range(15):
        template = random.choice(log_templates)
        timestamp = datetime.now() - timedelta(seconds=random.randint(0, 300))
        logs.append({
            "timestamp": timestamp.strftime("%H:%M:%S"),
            "level": template[0],
            "message": template[1],
            "source": template[2]
        })
    return sorted(logs, key=lambda x: x["timestamp"], reverse=True)

# Sidebar
with st.sidebar:
    st.markdown("### 🎯 Staging Infrastructure")
    st.markdown("**Stage 4: Kubernetes & Observability**")
    st.markdown("---")
    
    st.markdown("#### Cluster Info")
    st.markdown("""
    - **Namespace:** `docuquery`
    - **Context:** `staging-cluster`
    - **Region:** `us-west-2`
    """)
    
    st.markdown("---")
    st.markdown("#### Quick Links")
    st.markdown("""
    - [📊 Grafana Dashboard](#)
    - [🔥 Prometheus](#)
    - [📝 Loki Logs](#)
    - [🔍 Qdrant Console](#)
    """)
    
    st.markdown("---")
    if st.button("🔄 Refresh Data", use_container_width=True):
        st.rerun()
    
    st.markdown("---")
    st.markdown("#### Helm Release")
    st.code("""
Chart: docuquery
Version: 0.1.0
App Version: 1.0.0
Status: deployed
Revision: 3
    """, language="yaml")

# Main Header
st.markdown("""
<div class="infra-header">
    <h1>🎯 Staging Infrastructure Dashboard</h1>
    <p>Kubernetes cluster status, metrics, and observability</p>
</div>
""", unsafe_allow_html=True)

# Tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs(["📊 Overview", "🐳 Kubernetes", "📈 Metrics", "🔔 Alerts", "📝 Logs"])

with tab1:
    # Overview metrics
    metrics = get_mock_metrics()
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-value">{metrics['request_rate']}</div>
            <div class="metric-label">Requests/sec</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-value" style="color: {'#059669' if metrics['error_rate'] < 1 else '#dc2626'}">{metrics['error_rate']}%</div>
            <div class="metric-label">Error Rate</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-value">{int(metrics['p95_latency'])}ms</div>
            <div class="metric-label">P95 Latency</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-value">{metrics['active_connections']}</div>
            <div class="metric-label">Active Connections</div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Cluster health
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### 🏥 Cluster Health")
        st.markdown("""
        <div class="status-card">
            <p><span class="status-healthy">●</span> <strong>API Server:</strong> Healthy</p>
            <p><span class="status-healthy">●</span> <strong>etcd:</strong> Healthy</p>
            <p><span class="status-healthy">●</span> <strong>Scheduler:</strong> Healthy</p>
            <p><span class="status-healthy">●</span> <strong>Controller Manager:</strong> Healthy</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 📦 Deployments")
        deployments = [
            {"name": "docuquery-api", "ready": "3/3", "status": "Available"},
            {"name": "grafana", "ready": "1/1", "status": "Available"},
        ]
        for dep in deployments:
            status_color = "status-healthy" if dep["status"] == "Available" else "status-warning"
            st.markdown(f"""
            <div class="status-card">
                <strong>{dep['name']}</strong><br>
                <span class="{status_color}">Ready: {dep['ready']} | {dep['status']}</span>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("#### 🗄️ StatefulSets")
        statefulsets = [
            {"name": "qdrant", "ready": "1/1", "status": "Running"},
            {"name": "prometheus", "ready": "1/1", "status": "Running"},
            {"name": "loki", "ready": "1/1", "status": "Running"},
        ]
        for ss in statefulsets:
            st.markdown(f"""
            <div class="status-card">
                <strong>{ss['name']}</strong><br>
                <span class="status-healthy">Ready: {ss['ready']} | {ss['status']}</span>
            </div>
            """, unsafe_allow_html=True)

with tab2:
    st.markdown("#### Pods")
    pods = get_mock_pods()
    
    # Pod status summary
    col1, col2, col3 = st.columns(3)
    running = sum(1 for p in pods if p["status"] == "Running")
    with col1:
        st.metric("Running", running, delta=None)
    with col2:
        st.metric("Pending", 0, delta=None)
    with col3:
        st.metric("Failed", 0, delta=None)
    
    # Pod table
    pod_data = []
    for pod in pods:
        pod_data.append({
            "Name": pod["name"],
            "Status": pod["status"],
            "Restarts": pod["restarts"],
            "Age": pod["age"],
            "CPU": pod["cpu"],
            "Memory": pod["memory"]
        })
    st.dataframe(pod_data, use_container_width=True, hide_index=True)
    
    st.markdown("---")
    st.markdown("#### Services")
    services = get_mock_services()
    svc_data = []
    for svc in services:
        svc_data.append({
            "Name": svc["name"],
            "Type": svc["type"],
            "Cluster IP / External": svc.get("external_ip") or svc.get("cluster_ip"),
            "Ports": svc["ports"]
        })
    st.dataframe(svc_data, use_container_width=True, hide_index=True)

with tab3:
    st.markdown("#### Prometheus Metrics")
    
    metrics = get_mock_metrics()
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("##### API Performance")
        perf_data = {
            "Metric": ["Request Rate", "Error Rate", "P50 Latency", "P95 Latency", "P99 Latency"],
            "Value": [f"{metrics['request_rate']} req/s", f"{metrics['error_rate']}%", "85ms", f"{int(metrics['p95_latency'])}ms", f"{int(metrics['p99_latency'])}ms"],
            "Status": ["✅", "✅" if metrics['error_rate'] < 1 else "⚠️", "✅", "✅" if metrics['p95_latency'] < 300 else "⚠️", "✅"]
        }
        st.dataframe(perf_data, use_container_width=True, hide_index=True)
    
    with col2:
        st.markdown("##### Resource Usage")
        resource_data = {
            "Metric": ["CPU Usage", "Memory Usage", "Disk Usage", "Network I/O"],
            "Value": [f"{metrics['cpu_usage']}%", f"{metrics['memory_usage']}%", "32%", "125 MB/s"],
            "Status": ["✅", "✅" if metrics['memory_usage'] < 80 else "⚠️", "✅", "✅"]
        }
        st.dataframe(resource_data, use_container_width=True, hide_index=True)
    
    st.markdown("---")
    st.markdown("##### Vector Database Metrics")
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Collections", 1)
    with col2:
        st.metric("Total Vectors", f"{metrics['vectors_stored']:,}")
    with col3:
        st.metric("Index Size", "128 MB")
    with col4:
        st.metric("Avg Query Time", "12ms")

with tab4:
    st.markdown("#### Active Alerts")
    
    alerts = get_mock_alerts()
    active_alerts = [a for a in alerts if not a.get("resolved")]
    resolved_alerts = [a for a in alerts if a.get("resolved")]
    
    if not active_alerts:
        st.success("✅ No active alerts - All systems operational")
    else:
        for alert in active_alerts:
            severity_colors = {"critical": "#dc2626", "warning": "#d97706", "info": "#3b82f6"}
            color = severity_colors.get(alert["severity"], "#64748b")
            st.markdown(f"""
            <div class="status-card" style="border-left: 4px solid {color};">
                <strong>{alert['name']}</strong> <span style="color: {color};">({alert['severity'].upper()})</span><br>
                <span style="color: #64748b;">{alert['message']}</span><br>
                <small style="color: #94a3b8;">Triggered: {alert['time']}</small>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("#### Recently Resolved")
    
    for alert in resolved_alerts:
        st.markdown(f"""
        <div class="status-card" style="opacity: 0.7;">
            <strong>{alert['name']}</strong> <span style="color: #059669;">(RESOLVED)</span><br>
            <span style="color: #64748b;">{alert['message']}</span><br>
            <small style="color: #94a3b8;">Resolved: {alert['time']}</small>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("#### Alert Rules")
    alert_rules = [
        {"name": "HighErrorRate", "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) > 0.05", "severity": "critical"},
        {"name": "HighLatency", "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1", "severity": "warning"},
        {"name": "PodCrashLooping", "expr": "rate(kube_pod_container_status_restarts_total[15m]) > 0", "severity": "warning"},
        {"name": "HighCPUUsage", "expr": "avg(rate(container_cpu_usage_seconds_total[5m])) > 0.8", "severity": "warning"},
        {"name": "HighMemoryUsage", "expr": "avg(container_memory_working_set_bytes / container_memory_limits_bytes) > 0.85", "severity": "warning"},
    ]
    
    rules_data = []
    for rule in alert_rules:
        rules_data.append({
            "Alert": rule["name"],
            "Expression": rule["expr"][:60] + "..." if len(rule["expr"]) > 60 else rule["expr"],
            "Severity": rule["severity"].upper()
        })
    st.dataframe(rules_data, use_container_width=True, hide_index=True)

with tab5:
    st.markdown("#### Application Logs (Loki)")
    
    # Log filters
    col1, col2, col3 = st.columns(3)
    with col1:
        level_filter = st.selectbox("Log Level", ["All", "INFO", "WARN", "ERROR", "DEBUG"])
    with col2:
        source_filter = st.selectbox("Source", ["All", "docuquery-api", "qdrant", "prometheus"])
    with col3:
        time_range = st.selectbox("Time Range", ["Last 5 minutes", "Last 15 minutes", "Last 1 hour"])
    
    st.markdown("---")
    
    logs = get_mock_logs()
    
    # Apply filters
    if level_filter != "All":
        logs = [l for l in logs if l["level"] == level_filter]
    if source_filter != "All":
        logs = [l for l in logs if l["source"] == source_filter]
    
    # Display logs
    for log in logs:
        level_class = {
            "INFO": "log-info",
            "WARN": "log-warn",
            "ERROR": "log-error",
            "DEBUG": "log-info"
        }.get(log["level"], "log-info")
        
        st.markdown(f"""
        <div class="log-line {level_class}">
            <span style="color: #94a3b8;">{log['timestamp']}</span>
            <span style="font-weight: 600;">[{log['level']}]</span>
            <span style="color: #64748b;">[{log['source']}]</span>
            {log['message']}
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    st.markdown("#### Log Query")
    log_query = st.text_area(
        "LogQL Query",
        value='{namespace="docuquery"} |= "error" | json | line_format "{{.message}}"',
        height=80
    )
    if st.button("Execute Query"):
        st.info("Query executed - showing mock results above")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 0.875rem;">
    <p><strong>DocuQuery</strong> | Stage 4: Staging Infrastructure</p>
    <p>Kubernetes • Helm • Prometheus • Grafana • Loki</p>
</div>
""", unsafe_allow_html=True)
