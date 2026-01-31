import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Zap, Database, Code, Play, TestTube, Target,
  AlertTriangle, Presentation, CheckCircle, ArrowRight,
  ChevronDown, ChevronUp, Clock, Cpu, Server, MessageSquare,
  Search, Layers, GitBranch, Box, Terminal, HelpCircle,
  BookOpen, Settings, ExternalLink, Sparkles, Rocket,
  Brain, CircuitBoard, Workflow, BadgeCheck, TrendingUp,
  Timer, Users, Shield, Lightbulb, PlayCircle, ArrowDown,
  Check, X, Info, AlertCircle
} from 'lucide-react';

const navItems = [
  { id: 'philosophy', label: 'Philosophy', icon: Zap, color: '#8b5cf6' },
  { id: 'scope', label: 'POC Scope', icon: Target, color: '#ec4899' },
  { id: 'architecture', label: 'Architecture', icon: Layers, color: '#3b82f6' },
  { id: 'techstack', label: 'Tech Stack', icon: Box, color: '#10b981' },
  { id: 'structure', label: 'Structure', icon: GitBranch, color: '#f59e0b' },
  { id: 'documents', label: 'Sample Docs', icon: FileText, color: '#06b6d4' },
  { id: 'code', label: 'The Code', icon: Code, color: '#ef4444' },
  { id: 'testing', label: 'Testing', icon: TestTube, color: '#8b5cf6' },
  { id: 'demo', label: 'Demo', icon: Presentation, color: '#ec4899' },
  { id: 'exit', label: 'Exit Criteria', icon: CheckCircle, color: '#10b981' },
];

function App() {
  const [activeSection, setActiveSection] = useState('philosophy');
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeNav = navItems.find(item => item.id === activeSection);

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="bg-decoration">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <motion.div 
              className="logo-icon"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FileText size={22} />
            </motion.div>
            <span className="logo-text">DocuQuery</span>
          </div>
          
          <motion.div 
            className="stage-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Rocket size={16} />
            <span>Stage 2: Proof of Concept</span>
          </motion.div>
        </div>
      </header>

      {/* Stage Hero Section */}
      <div className="stage-hero">
        <div className="stage-hero-content">
          <motion.div 
            className="stage-number"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            02
          </motion.div>
          <motion.h1 
            className="stage-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Proof of Concept
          </motion.h1>
          <motion.p 
            className="stage-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Validate the core hypothesis with minimal viable implementation
          </motion.p>
          <motion.div 
            className="stage-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stage-stat">
              <Timer size={18} />
              <span>1-3 Days</span>
            </div>
            <div className="stage-stat">
              <Code size={18} />
              <span>~100 Lines</span>
            </div>
            <div className="stage-stat">
              <Target size={18} />
              <span>1 Core Feature</span>
            </div>
          </motion.div>
        </div>
        <div className="stage-hero-visual">
          <motion.div 
            className="floating-card card-1"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain size={24} />
            <span>RAG Pipeline</span>
          </motion.div>
          <motion.div 
            className="floating-card card-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Database size={24} />
            <span>Vector DB</span>
          </motion.div>
          <motion.div 
            className="floating-card card-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={24} />
            <span>AI Answers</span>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{ 
                '--nav-color': item.color,
                borderColor: activeSection === item.id ? item.color : 'transparent'
              }}
            >
              <item.icon size={16} style={{ color: activeSection === item.id ? item.color : 'inherit' }} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${((navItems.findIndex(item => item.id === activeSection) + 1) / navItems.length) * 100}%` }}
            style={{ background: activeNav?.color }}
          />
        </div>
        <span className="progress-text">
          Section {navItems.findIndex(item => item.id === activeSection) + 1} of {navItems.length}
        </span>
      </div>

      {/* Main Content */}
      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'philosophy' && <PhilosophySection />}
            {activeSection === 'scope' && <ScopeSection />}
            {activeSection === 'architecture' && <ArchitectureSection />}
            {activeSection === 'techstack' && <TechStackSection />}
            {activeSection === 'structure' && <StructureSection />}
            {activeSection === 'documents' && <DocumentsSection expandedCards={expandedCards} toggleCard={toggleCard} />}
            {activeSection === 'code' && <CodeSection />}
            {activeSection === 'testing' && <TestingSection />}
            {activeSection === 'demo' && <DemoSection />}
            {activeSection === 'exit' && <ExitCriteriaSection />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Arrows */}
      <div className="nav-arrows">
        <motion.button
          className="nav-arrow prev"
          onClick={() => {
            const currentIndex = navItems.findIndex(item => item.id === activeSection);
            if (currentIndex > 0) setActiveSection(navItems[currentIndex - 1].id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={navItems.findIndex(item => item.id === activeSection) === 0}
        >
          ← Previous
        </motion.button>
        <motion.button
          className="nav-arrow next"
          onClick={() => {
            const currentIndex = navItems.findIndex(item => item.id === activeSection);
            if (currentIndex < navItems.length - 1) setActiveSection(navItems[currentIndex + 1].id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={navItems.findIndex(item => item.id === activeSection) === navItems.length - 1}
          style={{ background: activeNav?.color }}
        >
          Next →
        </motion.button>
      </div>
    </div>
  );
}

function PhilosophySection() {
  const [activeTab, setActiveTab] = useState('do');
  
  const doItems = [
    { icon: Zap, text: 'Use the simplest tool that works', color: '#10b981' },
    { icon: Settings, text: 'Hardcode configurations', color: '#3b82f6' },
    { icon: AlertTriangle, text: 'Skip error handling (mostly)', color: '#f59e0b' },
    { icon: Database, text: 'Use in-memory storage', color: '#8b5cf6' },
    { icon: Code, text: 'Copy-paste working code', color: '#ec4899' },
    { icon: Target, text: 'Focus on the happy path', color: '#06b6d4' },
  ];

  const dontItems = [
    { icon: Shield, text: 'Build authentication', color: '#ef4444' },
    { icon: Workflow, text: 'Set up CI/CD', color: '#ef4444' },
    { icon: TestTube, text: 'Write comprehensive tests', color: '#ef4444' },
    { icon: TrendingUp, text: 'Optimize performance', color: '#ef4444' },
    { icon: AlertCircle, text: 'Handle edge cases', color: '#ef4444' },
    { icon: Server, text: 'Design for scale', color: '#ef4444' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
          <Zap size={28} />
        </div>
        <div>
          <h1 className="section-title">POC Philosophy</h1>
          <p className="section-description">
            A POC is about proving the concept works, not building a production system.
          </p>
        </div>
      </div>

      {/* Animated Stats Cards */}
      <div className="stats-grid">
        {[
          { value: '1-3', label: 'Days to Build', icon: Timer, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
          { value: '~100', label: 'Lines of Code', icon: Code, color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
          { value: '1', label: 'Core Feature', icon: Target, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            className="stat-card-fancy"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: `0 20px 40px ${stat.color}30` }}
          >
            <div className="stat-icon-wrap" style={{ background: stat.gradient }}>
              <stat.icon size={24} color="white" />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Toggle Tabs */}
      <div className="mindset-card">
        <h3 className="card-title-fancy">
          <Lightbulb size={20} />
          POC Mindset
        </h3>
        
        <div className="toggle-tabs">
          <button 
            className={`toggle-tab ${activeTab === 'do' ? 'active' : ''}`}
            onClick={() => setActiveTab('do')}
            style={{ '--tab-color': '#10b981' }}
          >
            <Check size={16} />
            DO
          </button>
          <button 
            className={`toggle-tab ${activeTab === 'dont' ? 'active' : ''}`}
            onClick={() => setActiveTab('dont')}
            style={{ '--tab-color': '#ef4444' }}
          >
            <X size={16} />
            DON'T
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mindset-items"
          >
            {(activeTab === 'do' ? doItems : dontItems).map((item, i) => (
              <motion.div
                key={i}
                className="mindset-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <div className="mindset-item-icon" style={{ background: `${item.color}15`, color: item.color }}>
                  <item.icon size={18} />
                </div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quote Card */}
      <motion.div 
        className="quote-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="quote-icon">💡</div>
        <blockquote>
          "The goal is to answer <strong>'Can we build this?'</strong> not 'How do we build it perfectly?'"
        </blockquote>
      </motion.div>
    </section>
  );
}

function ScopeSection() {
  const [scopeProgress, setScopeProgress] = useState(100);
  
  const inScope = [
    { item: 'Load 3-5 sample documents', done: true, icon: FileText },
    { item: 'Chunk documents (fixed size)', done: true, icon: Layers },
    { item: 'Generate embeddings (OpenAI)', done: true, icon: Cpu },
    { item: 'Store in vector DB (Chroma)', done: true, icon: Database },
    { item: 'Retrieve relevant chunks', done: true, icon: Search },
    { item: 'Generate answer with LLM (Claude)', done: true, icon: Brain },
    { item: 'Show sources/citations', done: true, icon: BookOpen },
    { item: 'Simple Streamlit UI', done: true, icon: Sparkles },
  ];

  const outOfScope = [
    'User authentication', 'Multiple file formats (PDF, Word)', 
    'Production deployment', 'Error handling', 'Caching', 
    'Rate limiting', 'User history', 'Admin interface'
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>
          <Target size={28} />
        </div>
        <div>
          <h1 className="section-title">POC Scope</h1>
          <p className="section-description">
            Clearly defined boundaries ensure we stay focused on validating the core hypothesis.
          </p>
        </div>
      </div>

      {/* Hypothesis Card */}
      <motion.div 
        className="hypothesis-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hypothesis-badge">
          <Lightbulb size={16} />
          Core Hypothesis
        </div>
        <p className="hypothesis-text">
          "Given a set of company documents, can an LLM provide accurate answers with proper citations?"
        </p>
        <div className="hypothesis-validate">
          <BadgeCheck size={18} />
          <span>This is what we're here to validate</span>
        </div>
      </motion.div>

      <div className="scope-grid">
        {/* In Scope */}
        <motion.div 
          className="scope-card in-scope"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="scope-header">
            <div className="scope-icon green">
              <Check size={20} />
            </div>
            <h3>In Scope</h3>
            <span className="scope-count">{inScope.length} items</span>
          </div>
          
          <div className="scope-progress-bar">
            <motion.div 
              className="scope-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${scopeProgress}%` }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </div>
          <div className="scope-progress-label">{scopeProgress}% Complete</div>

          <div className="scope-items">
            {inScope.map((item, i) => (
              <motion.div
                key={i}
                className="scope-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className={`scope-checkbox ${item.done ? 'checked' : ''}`}>
                  {item.done && <Check size={12} />}
                </div>
                <item.icon size={16} className="scope-item-icon" />
                <span>{item.item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Out of Scope */}
        <motion.div 
          className="scope-card out-scope"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="scope-header">
            <div className="scope-icon red">
              <X size={20} />
            </div>
            <h3>Out of Scope</h3>
            <span className="scope-count">{outOfScope.length} items</span>
          </div>
          
          <div className="out-scope-items">
            {outOfScope.map((item, i) => (
              <motion.span
                key={i}
                className="out-scope-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.span>
            ))}
          </div>

          <div className="out-scope-note">
            <Info size={16} />
            <span>These will be addressed in Stage 3: Development</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const [activeFlow, setActiveFlow] = useState('ingestion');

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
          <Layers size={28} />
        </div>
        <div>
          <h1 className="section-title">Technical Architecture</h1>
          <p className="section-description">
            The RAG (Retrieval-Augmented Generation) architecture combines semantic search with LLM generation.
          </p>
        </div>
      </div>

      {/* Flow Toggle */}
      <div className="flow-toggle">
        <button 
          className={`flow-toggle-btn ${activeFlow === 'ingestion' ? 'active' : ''}`}
          onClick={() => setActiveFlow('ingestion')}
        >
          <ArrowDown size={16} />
          Document Ingestion
        </button>
        <button 
          className={`flow-toggle-btn ${activeFlow === 'query' ? 'active' : ''}`}
          onClick={() => setActiveFlow('query')}
        >
          <Search size={16} />
          Query Flow
        </button>
      </div>

      {/* Architecture Diagram */}
      <motion.div 
        className="architecture-card"
        layout
      >
        <AnimatePresence mode="wait">
          {activeFlow === 'ingestion' ? (
            <motion.div
              key="ingestion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flow-diagram"
            >
              <div className="flow-label">
                <span className="flow-label-icon">📥</span>
                Document Ingestion (One-time)
              </div>
              <div className="flow-steps">
                {[
                  { icon: FileText, label: 'Documents', sub: '.md files', color: '#3b82f6' },
                  { icon: Layers, label: 'Chunker', sub: '500 chars', color: '#8b5cf6' },
                  { icon: Cpu, label: 'Embeddings', sub: 'OpenAI', color: '#ec4899' },
                  { icon: Database, label: 'Vector DB', sub: 'Chroma', color: '#10b981', highlight: true },
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    className="flow-step-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {i > 0 && <div className="flow-connector"><ArrowRight size={20} /></div>}
                    <div className={`flow-step ${step.highlight ? 'highlight' : ''}`} style={{ '--step-color': step.color }}>
                      <div className="flow-step-icon">
                        <step.icon size={24} />
                      </div>
                      <div className="flow-step-label">{step.label}</div>
                      <div className="flow-step-sub">{step.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="query"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flow-diagram"
            >
              <div className="flow-label">
                <span className="flow-label-icon">🔍</span>
                Query Flow (Per Question)
              </div>
              <div className="flow-steps">
                {[
                  { icon: MessageSquare, label: 'Question', sub: 'User input', color: '#3b82f6' },
                  { icon: Cpu, label: 'Embed', sub: 'Query vector', color: '#8b5cf6' },
                  { icon: Search, label: 'Search', sub: 'Top K=3', color: '#f59e0b', highlight: true },
                  { icon: Brain, label: 'LLM', sub: 'Claude', color: '#ec4899' },
                  { icon: FileText, label: 'Answer', sub: '+ Citations', color: '#10b981' },
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    className="flow-step-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {i > 0 && <div className="flow-connector"><ArrowRight size={20} /></div>}
                    <div className={`flow-step ${step.highlight ? 'highlight' : ''}`} style={{ '--step-color': step.color }}>
                      <div className="flow-step-icon">
                        <step.icon size={24} />
                      </div>
                      <div className="flow-step-label">{step.label}</div>
                      <div className="flow-step-sub">{step.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Data Flow Summary */}
      <div className="code-card">
        <div className="code-card-header">
          <Terminal size={18} />
          <span>Data Flow Summary</span>
        </div>
        <div className="code-content">
          <span className="code-comment"># Ingestion (once)</span><br/>
          <span className="code-text">Documents → Chunks → Embeddings → Vector DB</span><br/><br/>
          <span className="code-comment"># Query (each question)</span><br/>
          <span className="code-text">Question → Embedding → Search → LLM → Answer</span>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const [compareDb, setCompareDb] = useState(false);
  
  const stack = [
    { component: 'Language', choice: 'Python', why: 'Fastest for AI prototyping', prod: 'Same', icon: '🐍', color: '#3b82f6' },
    { component: 'UI', choice: 'Streamlit', why: '10 lines for full UI', prod: 'React', icon: '🖥️', color: '#8b5cf6' },
    { component: 'Vector DB', choice: 'Chroma', why: 'Zero setup, pip install', prod: 'Qdrant', icon: '💾', color: '#10b981' },
    { component: 'Embeddings', choice: 'OpenAI', why: 'API call, no setup', prod: 'Same', icon: '🔢', color: '#ec4899' },
    { component: 'LLM', choice: 'Claude 3.5', why: 'Best at citations', prod: 'Same', icon: '🤖', color: '#f59e0b' },
    { component: 'Chunking', choice: 'LangChain', why: 'Battle-tested', prod: 'Same', icon: '✂️', color: '#06b6d4' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
          <Box size={28} />
        </div>
        <div>
          <h1 className="section-title">Tech Stack</h1>
          <p className="section-description">
            Choices optimized for speed of development, not production readiness.
          </p>
        </div>
      </div>

      {/* Tech Cards */}
      <div className="tech-grid">
        {stack.map((item, i) => (
          <motion.div
            key={i}
            className="tech-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5, boxShadow: `0 15px 30px ${item.color}20` }}
            style={{ '--tech-color': item.color }}
          >
            <div className="tech-emoji">{item.icon}</div>
            <div className="tech-component">{item.component}</div>
            <div className="tech-choice">{item.choice}</div>
            <div className="tech-why">{item.why}</div>
            <div className="tech-prod">
              <span>Production:</span> {item.prod}
            </div>
          </motion.div>
        ))}
      </div>

      {/* DB Comparison Toggle */}
      <motion.div 
        className="comparison-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="comparison-header">
          <h3>
            <Database size={20} />
            Vector DB Comparison
          </h3>
          <button 
            className="compare-toggle"
            onClick={() => setCompareDb(!compareDb)}
          >
            {compareDb ? 'Hide Details' : 'Compare DBs'}
          </button>
        </div>

        <AnimatePresence>
          {compareDb && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="comparison-content"
            >
              <div className="comparison-grid">
                <div className="comparison-item winner">
                  <h4>
                    <Check size={16} />
                    Chroma (POC Choice)
                  </h4>
                  <ul>
                    <li><code>pip install chromadb</code></li>
                    <li>In-memory or file storage</li>
                    <li>~5 lines of code</li>
                    <li>Not production-ready</li>
                  </ul>
                </div>
                <div className="comparison-item">
                  <h4>Qdrant (Production)</h4>
                  <ul>
                    <li>Docker required</li>
                    <li>Server-based storage</li>
                    <li>~15 lines of code</li>
                    <li>Production-ready ✓</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function StructureSection() {
  const [selectedFile, setSelectedFile] = useState(null);

  const files = [
    { name: 'app.py', type: 'file', icon: '🐍', desc: 'Main Streamlit application (~100 lines)' },
    { name: 'documents/', type: 'folder', icon: '📁', desc: 'Sample markdown documents' },
    { name: 'requirements.txt', type: 'file', icon: '📋', desc: 'Python dependencies' },
    { name: '.env', type: 'file', icon: '🔐', desc: 'API keys (gitignored)' },
    { name: 'README.md', type: 'file', icon: '📖', desc: 'How to run instructions' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
          <GitBranch size={28} />
        </div>
        <div>
          <h1 className="section-title">Project Structure</h1>
          <p className="section-description">
            A minimal structure focused on getting the POC running quickly.
          </p>
        </div>
      </div>

      <div className="structure-grid">
        {/* File Explorer */}
        <div className="file-explorer">
          <div className="file-explorer-header">
            <Box size={16} />
            <span>poc/</span>
          </div>
          <div className="file-list">
            {files.map((file, i) => (
              <motion.div
                key={i}
                className={`file-item ${selectedFile === i ? 'selected' : ''}`}
                onClick={() => setSelectedFile(selectedFile === i ? null : i)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 5 }}
              >
                <span className="file-icon">{file.icon}</span>
                <span className="file-name">{file.name}</span>
                <ChevronDown 
                  size={16} 
                  className={`file-arrow ${selectedFile === i ? 'open' : ''}`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* File Details */}
        <div className="file-details">
          <AnimatePresence mode="wait">
            {selectedFile !== null ? (
              <motion.div
                key={selectedFile}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="file-detail-card"
              >
                <div className="file-detail-header">
                  <span className="file-detail-icon">{files[selectedFile].icon}</span>
                  <span className="file-detail-name">{files[selectedFile].name}</span>
                </div>
                <p className="file-detail-desc">{files[selectedFile].desc}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="file-detail-empty"
              >
                <FileText size={40} />
                <p>Click a file to see details</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Requirements */}
          <div className="requirements-card">
            <h4>
              <Terminal size={16} />
              requirements.txt
            </h4>
            <div className="requirements-list">
              {['streamlit==1.31.0', 'langchain==0.1.0', 'langchain-openai==0.0.5', 'langchain-anthropic==0.1.1', 'chromadb==0.4.22', 'python-dotenv==1.0.0'].map((pkg, i) => (
                <span key={i} className="requirement-tag">{pkg}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="quickstart-card">
        <h3>
          <Rocket size={20} />
          Quick Start
        </h3>
        <div className="quickstart-steps">
          {[
            { cmd: 'python -m venv venv && source venv/bin/activate', label: 'Create venv' },
            { cmd: 'pip install -r requirements.txt', label: 'Install deps' },
            { cmd: 'cp .env.example .env', label: 'Setup keys' },
            { cmd: 'streamlit run app.py', label: 'Run app' },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="quickstart-step"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="step-number">{i + 1}</span>
              <code className="step-cmd">{step.cmd}</code>
              <span className="step-label">{step.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentsSection({ expandedCards, toggleCard }) {
  const documents = [
    {
      id: 'policy',
      name: 'company_policy.md',
      title: 'Company Policies',
      icon: '📋',
      color: '#3b82f6',
      highlights: ['Remote: 3 days/week', 'Hotels: $250/night', 'PTO: 20 days/year'],
    },
    {
      id: 'product',
      name: 'product_guide.md',
      title: 'CloudSync Pro',
      icon: '☁️',
      color: '#8b5cf6',
      highlights: ['Starter: $10/user/mo', 'Business: $25/user/mo', 'Enterprise: Custom'],
    },
    {
      id: 'faq',
      name: 'faq.md',
      title: 'FAQ',
      icon: '❓',
      color: '#10b981',
      highlights: ['Password reset', 'AES-256 encryption', '50% nonprofit discount'],
    },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #22d3ee)' }}>
          <FileText size={28} />
        </div>
        <div>
          <h1 className="section-title">Sample Documents</h1>
          <p className="section-description">
            Realistic test documents covering different use cases for validation.
          </p>
        </div>
      </div>

      <div className="docs-grid">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            className="doc-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, boxShadow: `0 20px 40px ${doc.color}25` }}
            style={{ '--doc-color': doc.color }}
          >
            <div className="doc-header">
              <span className="doc-icon">{doc.icon}</span>
              <div>
                <h3 className="doc-title">{doc.title}</h3>
                <span className="doc-filename">{doc.name}</span>
              </div>
            </div>
            <div className="doc-highlights">
              {doc.highlights.map((h, j) => (
                <span key={j} className="doc-highlight">{h}</span>
              ))}
            </div>
            <div className="doc-footer">
              <BookOpen size={14} />
              <span>Sample content ready</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="docs-info">
        <Info size={18} />
        <p>
          These documents test different retrieval scenarios: policy lookups, product comparisons, and Q&A responses.
        </p>
      </div>
    </section>
  );
}

function CodeSection() {
  const [showFullCode, setShowFullCode] = useState(false);

  const codeSnippets = [
    { func: 'load_and_index_documents()', desc: 'Load, chunk, and embed documents', color: '#3b82f6' },
    { func: 'get_llm()', desc: 'Initialize Claude for generation', color: '#8b5cf6' },
    { func: 'answer_question()', desc: 'RAG pipeline: retrieve + generate', color: '#ec4899' },
    { func: '@st.cache_resource', desc: 'Cache expensive operations', color: '#10b981' },
  ];

  const config = [
    { key: 'CHUNK_SIZE', value: '500', unit: 'chars' },
    { key: 'CHUNK_OVERLAP', value: '50', unit: 'chars' },
    { key: 'TOP_K', value: '3', unit: 'chunks' },
    { key: 'temperature', value: '0', unit: 'deterministic' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)' }}>
          <Code size={28} />
        </div>
        <div>
          <h1 className="section-title">The Code</h1>
          <p className="section-description">
            Complete POC implementation in ~100 lines of Python.
          </p>
        </div>
      </div>

      {/* Main Code Card */}
      <motion.div 
        className="code-main-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="code-main-header">
          <div className="code-file-tab">
            <span className="code-file-dot red"></span>
            <span className="code-file-dot yellow"></span>
            <span className="code-file-dot green"></span>
            <span className="code-file-name">app.py</span>
          </div>
          <span className="code-line-count">~100 lines</span>
        </div>
        <div className="code-preview">
          <pre>
            <code>
{`"""
DocuQuery POC - Document Q&A with RAG
Run with: streamlit run app.py
"""

import streamlit as st
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic

@st.cache_resource
def load_and_index_documents():
    # Load, chunk, embed documents
    ...

def answer_question(question, vectorstore, llm):
    # Retrieve chunks & generate answer
    retriever = vectorstore.as_retriever(k=3)
    relevant_docs = retriever.invoke(question)
    ...
    return {"answer": response, "sources": sources}`}
            </code>
          </pre>
        </div>
      </motion.div>

      {/* Functions Grid */}
      <h3 className="subsection-title">Key Functions</h3>
      <div className="functions-grid">
        {codeSnippets.map((snippet, i) => (
          <motion.div
            key={i}
            className="function-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            style={{ '--func-color': snippet.color }}
          >
            <code className="function-name">{snippet.func}</code>
            <p className="function-desc">{snippet.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Config Sliders */}
      <h3 className="subsection-title">Configuration</h3>
      <div className="config-grid">
        {config.map((item, i) => (
          <motion.div
            key={i}
            className="config-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="config-header">
              <span className="config-key">{item.key}</span>
              <span className="config-value">{item.value}</span>
            </div>
            <div className="config-bar">
              <motion.div 
                className="config-fill"
                initial={{ width: 0 }}
                animate={{ width: `${parseInt(item.value) / 5}%` }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            </div>
            <span className="config-unit">{item.unit}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TestingSection() {
  const [selectedTest, setSelectedTest] = useState(null);

  const tests = [
    { q: 'How many days can I work remotely?', source: 'company_policy.md', expected: '3 days per week', status: 'pass' },
    { q: 'What is the refund policy?', source: 'product_guide.md', expected: 'Pro-rated refund 30 days', status: 'pass' },
    { q: 'How do I reset my password?', source: 'faq.md', expected: 'Forgot Password link', status: 'pass' },
    { q: 'What is enterprise pricing?', source: 'product_guide.md', expected: 'Custom pricing', status: 'pass' },
    { q: 'Parental leave policy?', source: 'company_policy.md', expected: '16 weeks paid', status: 'pass' },
    { q: "What is the CEO's name?", source: 'N/A', expected: "I don't have information", status: 'edge' },
  ];

  const metrics = [
    { metric: 'Answer Accuracy', target: '>60%', color: '#10b981' },
    { metric: 'Retrieval Recall', target: '>70%', color: '#3b82f6' },
    { metric: '"I don\'t know" works', target: 'Yes', color: '#8b5cf6' },
    { metric: 'Latency', target: '<15s', color: '#f59e0b' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}>
          <TestTube size={28} />
        </div>
        <div>
          <h1 className="section-title">Testing</h1>
          <p className="section-description">
            Test questions matrix to validate retrieval and answer quality.
          </p>
        </div>
      </div>

      {/* Test Cards */}
      <div className="tests-grid">
        {tests.map((test, i) => (
          <motion.div
            key={i}
            className={`test-card ${test.status}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedTest(selectedTest === i ? null : i)}
          >
            <div className="test-number">#{i + 1}</div>
            <div className="test-question">{test.q}</div>
            <div className="test-meta">
              <span className="test-source">{test.source}</span>
              <span className={`test-status ${test.status}`}>
                {test.status === 'pass' ? <Check size={14} /> : <AlertCircle size={14} />}
              </span>
            </div>
            <AnimatePresence>
              {selectedTest === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="test-expected"
                >
                  <strong>Expected:</strong> {test.expected}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Metrics */}
      <h3 className="subsection-title">Success Criteria</h3>
      <div className="metrics-grid">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            className="metric-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            style={{ '--metric-color': m.color }}
          >
            <div className="metric-label">{m.metric}</div>
            <div className="metric-target">{m.target}</div>
            <div className="metric-bar">
              <motion.div 
                className="metric-fill"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DemoSection() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { time: '30s', title: 'Introduction', icon: '👋', content: 'Introduce DocuQuery and its purpose' },
    { time: '30s', title: 'Show Data', icon: '📊', content: 'Point to loaded documents count' },
    { time: '1m', title: 'Simple Question', icon: '❓', content: 'Ask about remote work policy' },
    { time: '1m', title: 'Cross-Document', icon: '🔄', content: 'Ask about enterprise refund policy' },
    { time: '30s', title: 'Edge Case', icon: '⚠️', content: 'Ask unknown question (CEO name)' },
    { time: '30s', title: 'Value Prop', icon: '💎', content: 'Highlight time savings' },
    { time: '30s', title: 'Next Steps', icon: '🚀', content: 'Outline path to production' },
  ];

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>
          <Presentation size={28} />
        </div>
        <div>
          <h1 className="section-title">Demo Script</h1>
          <p className="section-description">
            5-minute stakeholder demo to showcase POC value.
          </p>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="demo-timeline">
        <div className="timeline-track">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={`timeline-point ${currentStep >= i ? 'active' : ''}`}
              onClick={() => setCurrentStep(i)}
              whileHover={{ scale: 1.2 }}
            >
              <span className="timeline-icon">{step.icon}</span>
            </motion.div>
          ))}
          <motion.div 
            className="timeline-progress"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="timeline-labels">
          {steps.map((step, i) => (
            <span key={i} className={currentStep === i ? 'active' : ''}>{step.time}</span>
          ))}
        </div>
      </div>

      {/* Current Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="demo-step-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="demo-step-header">
            <span className="demo-step-icon">{steps[currentStep].icon}</span>
            <h3>{steps[currentStep].title}</h3>
            <span className="demo-step-time">{steps[currentStep].time}</span>
          </div>
          <p className="demo-step-content">{steps[currentStep].content}</p>
          <div className="demo-step-nav">
            <button 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              ← Previous
            </button>
            <button 
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="primary"
            >
              Next →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sample Questions */}
      <h3 className="subsection-title">Sample Questions</h3>
      <div className="sample-questions">
        {[
          'How many days can I work remotely?',
          'What is the refund policy for enterprise?',
          'How do I reset my password?',
          'What is the annual learning budget?'
        ].map((q, i) => (
          <motion.div
            key={i}
            className="sample-question"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <MessageSquare size={16} />
            <span>{q}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ExitCriteriaSection() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (category, index) => {
    const key = `${category}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    {
      title: 'Technical Validation',
      color: '#3b82f6',
      icon: Settings,
      items: ['RAG flow works e2e', 'Documents chunk correctly', 'Embeddings generate', 'Vector search returns relevant', 'LLM generates coherent answers', 'Citations are correct']
    },
    {
      title: 'Quality Metrics',
      color: '#10b981',
      icon: TrendingUp,
      items: ['Answer accuracy >60%', 'Retrieval recall >70%', '"I don\'t know" works', 'No hallucinations', 'Response <15 seconds']
    },
    {
      title: 'Stakeholder',
      color: '#8b5cf6',
      icon: Users,
      items: ['Demo completed', 'Value understood', 'Go/No-Go decided', 'Feedback documented']
    }
  ];

  const getProgress = (category) => {
    const items = categories.find(c => c.title === category)?.items || [];
    const checked = items.filter((_, i) => checkedItems[`${category}-${i}`]).length;
    return (checked / items.length) * 100;
  };

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-icon" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
          <CheckCircle size={28} />
        </div>
        <div>
          <h1 className="section-title">Exit Criteria</h1>
          <p className="section-description">
            Complete these before moving to Stage 3: Development.
          </p>
        </div>
      </div>

      {/* Checklist Categories */}
      <div className="checklist-grid">
        {categories.map((cat, catIndex) => (
          <motion.div
            key={catIndex}
            className="checklist-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            style={{ '--cat-color': cat.color }}
          >
            <div className="checklist-header">
              <cat.icon size={20} style={{ color: cat.color }} />
              <h3>{cat.title}</h3>
            </div>
            <div className="checklist-progress">
              <div className="checklist-progress-bar">
                <motion.div 
                  className="checklist-progress-fill"
                  animate={{ width: `${getProgress(cat.title)}%` }}
                  style={{ background: cat.color }}
                />
              </div>
              <span>{Math.round(getProgress(cat.title))}%</span>
            </div>
            <div className="checklist-items">
              {cat.items.map((item, i) => (
                <motion.div
                  key={i}
                  className="checklist-item"
                  onClick={() => toggleCheck(cat.title, i)}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`checklist-checkbox ${checkedItems[`${cat.title}-${i}`] ? 'checked' : ''}`}>
                    {checkedItems[`${cat.title}-${i}`] && <Check size={12} />}
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Go/No-Go Matrix */}
      <h3 className="subsection-title">Go/No-Go Decision Matrix</h3>
      <div className="decision-matrix">
        {[
          { signal: 'Answer accuracy', go: '>60%', nogo: '<40%' },
          { signal: 'Retrieval quality', go: '>70%', nogo: '<50%' },
          { signal: 'Stakeholder feedback', go: 'Positive', nogo: 'Major concerns' },
          { signal: 'Technical feasibility', go: 'Confirmed', nogo: 'Blockers found' },
        ].map((row, i) => (
          <motion.div
            key={i}
            className="decision-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="decision-signal">{row.signal}</span>
            <span className="decision-go"><Check size={14} /> {row.go}</span>
            <span className="decision-nogo"><X size={14} /> {row.nogo}</span>
          </motion.div>
        ))}
      </div>

      {/* Next Stage Preview */}
      <motion.div 
        className="next-stage-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="next-stage-header">
          <Rocket size={24} />
          <div>
            <h3>Next: Stage 3 — Development</h3>
            <p>Clean architecture, testing, and Docker deployment</p>
          </div>
        </div>
        <div className="next-stage-changes">
          {[
            { from: 'Chroma', to: 'Qdrant', label: 'Vector DB' },
            { from: '1 file', to: 'Modules', label: 'Code' },
            { from: 'None', to: 'Try/catch', label: 'Error handling' },
            { from: 'Streamlit', to: 'FastAPI + React', label: 'UI' },
          ].map((change, i) => (
            <div key={i} className="stage-change">
              <span className="change-label">{change.label}</span>
              <span className="change-from">{change.from}</span>
              <ArrowRight size={14} />
              <span className="change-to">{change.to}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default App;
