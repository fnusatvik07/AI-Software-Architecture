import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, Target, Users, Layers, Cpu, BarChart3, 
  AlertTriangle, DollarSign, FileText, ChevronRight,
  Database, Brain, Search, MessageSquare, CheckCircle2,
  XCircle, Clock, Zap, Shield, ArrowRight, Check
} from 'lucide-react'

// Section data
const sections = [
  { id: 'problem', title: 'Problem', icon: Target },
  { id: 'personas', title: 'Personas', icon: Users },
  { id: 'scope', title: 'Scope', icon: Layers },
  { id: 'feasibility', title: 'Feasibility', icon: Cpu },
  { id: 'architecture', title: 'Architecture', icon: Database },
  { id: 'metrics', title: 'Metrics', icon: BarChart3 },
  { id: 'risks', title: 'Risks', icon: AlertTriangle },
  { id: 'cost', title: 'Cost', icon: DollarSign },
  { id: 'onepager', title: 'Summary', icon: FileText },
]

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '100px',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  tableHeader: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748b',
    borderBottom: '2px solid #e2e8f0',
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('problem')

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <HeroSection />
      <Navigation sections={sections} activeSection={activeSection} setActiveSection={setActiveSection} />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <AnimatePresence mode="wait">
          {activeSection === 'problem' && <ProblemSection key="problem" />}
          {activeSection === 'personas' && <PersonasSection key="personas" />}
          {activeSection === 'scope' && <ScopeSection key="scope" />}
          {activeSection === 'feasibility' && <FeasibilitySection key="feasibility" />}
          {activeSection === 'architecture' && <ArchitectureSection key="architecture" />}
          {activeSection === 'metrics' && <MetricsSection key="metrics" />}
          {activeSection === 'risks' && <RisksSection key="risks" />}
          {activeSection === 'cost' && <CostSection key="cost" />}
          {activeSection === 'onepager' && <OnePagerSection key="onepager" />}
        </AnimatePresence>
      </main>
      <ArchitectureDiagram />
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: '5rem 1.5rem 3rem',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          borderRadius: '100px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: '#475569'
        }}>
          <Lightbulb size={16} />
          AI Software Architecture Workshop
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          marginBottom: '1rem',
          lineHeight: 1.2,
          color: '#0f172a'
        }}>
          Stage 1: Ideation & Validation
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: '#475569',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: 1.7
        }}>
          Define the problem, validate feasibility, and make key decisions <strong style={{ color: '#0f172a' }}>before</strong> writing any code.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.5rem',
          background: '#0f172a',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <Clock size={18} />
          <span>1-2 days here saves weeks of wasted effort</span>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Navigation({ sections, activeSection, setActiveSection }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        gap: '0.25rem',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {sections.map((section, index) => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: isActive ? '#0f172a' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: isActive ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: isActive ? '#ffffff' : '#64748b'
              }}>
                {index + 1}
              </span>
              {section.title}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Card({ children, style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ delay, duration: 0.3 }}
      style={{ ...styles.card, ...style }}
    >
      {children}
    </motion.div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: '#f1f5f9',
          color: '#0f172a'
        }}>
          <Icon size={20} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{title}</h2>
      </div>
      {subtitle && <p style={{ color: '#64748b', fontSize: '0.95rem', marginLeft: '52px' }}>{subtitle}</p>}
    </motion.div>
  )
}

function ProblemSection() {
  const painPoints = [
    { pain: '"Where\'s the refund policy?"', time: '15-30 mins', freq: 'Daily' },
    { pain: '"What\'s the process for X?"', time: '20-40 mins', freq: 'Daily' },
    { pain: '"Is this covered in our docs?"', time: 'Give up', freq: 'Weekly' },
    { pain: 'Onboarding new employees', time: '5-10 hrs', freq: 'Per hire' },
  ]

  const failedSolutions = [
    { solution: 'Google Drive search', why: 'Keyword-only, doesn\'t understand questions' },
    { solution: 'Confluence/Notion search', why: 'Same problem, scattered across spaces' },
    { solution: 'Ask on Slack', why: 'Depends on who\'s online, interrupts others' },
    { solution: 'Ask manager', why: 'Doesn\'t scale, creates bottleneck' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={Target} title="Problem Discovery" subtitle="Understanding the pain before building the solution" />

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        <Card>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>
            Problem Statement
          </h3>
          <p style={{
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#0f172a',
            padding: '1.25rem',
            background: '#f8fafc',
            borderRadius: '8px',
            borderLeft: '4px solid #0f172a'
          }}>
            "Employees spend too much time searching for information that already exists in company documents."
          </p>
        </Card>

        <Card delay={0.1}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>
            Quantifying the Pain
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {painPoints.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              >
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#475569' }}>{item.pain}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.time}</span>
                  <span style={{ ...styles.badge, background: '#e2e8f0', color: '#475569' }}>{item.freq}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', textAlign: 'center', color: '#ffffff' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>$5,000+</span>
            <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>/employee/year in lost productivity</span>
          </div>
        </Card>

        <Card delay={0.2}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>
            Why Current Solutions Fail
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {failedSolutions.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', background: '#f8fafc', borderRadius: '6px' }}>
                <XCircle size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#0f172a' }}>{item.solution}</strong>
                  <span style={{ color: '#64748b' }}> — {item.why}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.3} style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>
            The Opportunity
          </h3>
          <p style={{ marginBottom: '1rem', color: '#475569' }}>An AI system that:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {[
              { icon: Brain, text: 'Understands natural language questions' },
              { icon: Search, text: 'Searches across all company documents' },
              { icon: CheckCircle2, text: 'Provides accurate answers with citations' },
              { icon: Zap, text: 'Available 24/7, instant responses' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <item.icon size={18} style={{ color: '#0f172a' }} />
                <span style={{ fontSize: '0.9rem', color: '#0f172a' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

function PersonasSection() {
  const personas = [
    {
      name: 'Priya',
      role: 'Sales Representative',
      type: 'Primary',
      goal: 'Get quick answers to close deals faster',
      scenario: 'On a call with a prospect asking about enterprise pricing. Can\'t find the doc and prospect is waiting.',
      needs: ['Answer in <30 seconds', 'Confidence the answer is correct', 'Link to source for verification'],
      frustrations: ['Search returns 50 irrelevant results', 'Has to interrupt colleagues', 'Sometimes gives wrong info'],
    },
    {
      name: 'Rahul',
      role: 'Operations Lead',
      type: 'Secondary',
      goal: 'Keep documentation accessible, reduce repeated questions',
      scenario: 'Answers the same 10 questions every week. Wishes people would just read the docs.',
      needs: ['Easy way to upload/update documents', 'See what questions people ask', 'Identify documentation gaps'],
      frustrations: ['No visibility into searches', 'Docs get outdated', 'Time spent answering instead of working'],
    }
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={Users} title="User Personas" subtitle="Who are we building this for?" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        {personas.map((persona, i) => (
          <Card key={i} delay={i * 0.1}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                  {persona.name[0]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{persona.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{persona.role}</p>
                </div>
              </div>
              <span style={{ ...styles.badge, background: persona.type === 'Primary' ? '#0f172a' : '#f1f5f9', color: persona.type === 'Primary' ? '#ffffff' : '#64748b' }}>
                {persona.type}
              </span>
            </div>
            <div style={{ padding: '0.875rem', background: '#f8fafc', borderRadius: '6px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>GOAL</p>
              <p style={{ fontWeight: 500, color: '#0f172a' }}>{persona.goal}</p>
            </div>
            <div style={{ padding: '0.875rem', background: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid #0f172a', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.25rem' }}>SCENARIO</p>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#475569' }}>"{persona.scenario}"</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>✓ NEEDS</p>
                {persona.needs.map((need, j) => (
                  <p key={j} style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.25rem' }}>• {need}</p>
                ))}
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>✗ FRUSTRATIONS</p>
                {persona.frustrations.map((f, j) => (
                  <p key={j} style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>• {f}</p>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function ScopeSection() {
  const inScope = [
    { feature: 'Upload documents (PDF, TXT, MD)', priority: 'P0', rationale: 'Core functionality' },
    { feature: 'Natural language Q&A', priority: 'P0', rationale: 'Core value proposition' },
    { feature: 'Answers with source citations', priority: 'P0', rationale: 'Trust & verification' },
    { feature: 'View source chunk', priority: 'P0', rationale: '"Show me where it says that"' },
    { feature: 'Session conversation history', priority: 'P1', rationale: 'Follow-up questions' },
    { feature: 'Basic admin: list documents', priority: 'P1', rationale: 'Manageability' },
  ]
  const outScope = [
    { feature: 'Multi-tenant architecture', reason: 'Adds complexity, not needed for v1' },
    { feature: 'SSO/Enterprise auth', reason: 'POC can use simple API keys' },
    { feature: 'Document versioning', reason: 'Nice-to-have, not critical' },
    { feature: 'Slack/Teams integration', reason: 'Add after core works' },
    { feature: 'Analytics dashboard', reason: 'Post-MVP feature' },
    { feature: 'Fine-tuned models', reason: 'Overkill, prompting works fine' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={Layers} title="Scope Definition" subtitle="What's in and what's out for MVP" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CheckCircle2 size={20} style={{ color: '#0f172a' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>In Scope (MVP)</h3>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {inScope.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
                <span style={{ ...styles.badge, background: item.priority === 'P0' ? '#0f172a' : '#e2e8f0', color: item.priority === 'P0' ? '#ffffff' : '#475569' }}>{item.priority}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: '#0f172a' }}>{item.feature}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <XCircle size={20} style={{ color: '#94a3b8' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Out of Scope (MVP)</h3>
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {outScope.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', opacity: 0.7 }}>
                <XCircle size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', color: '#64748b', textDecoration: 'line-through' }}>{item.feature}</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card delay={0.2} style={{ marginTop: '1.25rem', background: '#fffbeb', borderColor: '#fcd34d' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <AlertTriangle size={18} /> Scope Creep Warning Signs
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
          {['"Can we also add..." before MVP is done', '"What if we need to support..." for hypothetical cases', '"Competitor X has..." feature comparison rabbit holes'].map((warning, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '6px', fontSize: '0.875rem', color: '#78350f' }}>{warning}</div>
          ))}
        </div>
        <p style={{ marginTop: '0.75rem', fontWeight: 600, color: '#92400e', fontSize: '0.9rem' }}>
          Rule: If it doesn't directly help answer questions accurately, it's not MVP.
        </p>
      </Card>
    </motion.div>
  )
}

function FeasibilitySection() {
  const components = [
    { component: 'Document parsing', confidence: 'High', tools: 'PyPDF2, Unstructured, docling' },
    { component: 'Text chunking', confidence: 'High', tools: 'LangChain splitters, 500-1000 tokens' },
    { component: 'Embedding generation', confidence: 'High', tools: 'OpenAI, Cohere, or local models' },
    { component: 'Vector storage', confidence: 'High', tools: 'Qdrant, Pinecone, Chroma, pgvector' },
    { component: 'Similarity search', confidence: 'High', tools: 'Vector DB handles this' },
    { component: 'Answer generation', confidence: 'High', tools: 'Claude, GPT-4, etc.' },
    { component: 'Citation extraction', confidence: 'Medium', tools: 'Requires good prompt engineering' },
    { component: 'Streaming responses', confidence: 'High', tools: 'SSE, WebSockets' },
  ]
  const risks = [
    { risk: 'LLM hallucination', mitigation: 'Strict prompting, "I don\'t know" fallback' },
    { risk: 'Poor retrieval quality', mitigation: 'Reranking, hybrid search, better chunking' },
    { risk: 'Slow responses', mitigation: 'Streaming, caching, async processing' },
    { risk: 'High costs', mitigation: 'Token budgets, semantic caching' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={Cpu} title="Technical Feasibility" subtitle="Can we actually build this?" />
      <Card style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Component Validation</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Component</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Status</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Confidence</th>
                <th style={styles.tableHeader}>Tools/Approach</th>
              </tr>
            </thead>
            <tbody>
              {components.map((item, i) => (
                <tr key={i}>
                  <td style={{ ...styles.tableCell, fontWeight: 500 }}>{item.component}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}><Check size={18} style={{ color: '#0f172a' }} /></td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                    <span style={{ ...styles.badge, background: item.confidence === 'High' ? '#f0fdf4' : '#fffbeb', color: item.confidence === 'High' ? '#166534' : '#92400e' }}>{item.confidence}</span>
                  </td>
                  <td style={{ ...styles.tableCell, color: '#64748b', fontSize: '0.9rem' }}>{item.tools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <Check size={20} style={{ color: '#166534', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#166534' }}>Fully feasible with existing tools. No research required.</span>
        </div>
      </Card>
      <Card delay={0.1}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Technical Risks & Mitigations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {risks.map((item, i) => (
            <div key={i} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #0f172a' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>{item.risk}</p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>→ {item.mitigation}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function ArchitectureSection() {
  const decisions = [
    { id: 'ADR-001', title: 'LLM Provider', decision: 'Claude 3.5 Sonnet', rationale: 'Excellent instruction following, great at citations' },
    { id: 'ADR-002', title: 'Vector Database', decision: 'Qdrant', rationale: 'Free local mode, great performance, easy Docker setup' },
    { id: 'ADR-003', title: 'Chunking Strategy', decision: 'Recursive, 500 tokens, 50 overlap', rationale: 'Respects document structure, good quality/simplicity balance' },
    { id: 'ADR-004', title: 'Embedding Model', decision: 'OpenAI text-embedding-3-small', rationale: 'Best cost/quality ratio at $0.02/1M tokens' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={Database} title="Architecture Decisions" subtitle="Key technology choices (ADRs)" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {decisions.map((adr, i) => (
          <Card key={i} delay={i * 0.05}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ ...styles.badge, background: '#f1f5f9', color: '#475569', fontWeight: 600 }}>{adr.id}</span>
            </div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{adr.title}</h3>
            <div style={{ padding: '0.75rem', background: '#0f172a', borderRadius: '6px', marginBottom: '0.75rem', color: '#ffffff' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{adr.decision}</p>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{adr.rationale}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function MetricsSection() {
  const primaryMetrics = [
    { metric: 'Answer Accuracy', poc: '60%', mvp: '75%', prod: '85%' },
    { metric: 'Retrieval Recall@3', poc: '70%', mvp: '80%', prod: '90%' },
    { metric: 'Response Latency (P95)', poc: '<15s', mvp: '<8s', prod: '<5s' },
    { metric: 'Citation Accuracy', poc: '70%', mvp: '85%', prod: '95%' },
  ]
  const secondaryMetrics = [
    { metric: 'User satisfaction', target: '4.0/5.0' },
    { metric: 'Daily active users', target: '50%' },
    { metric: 'Questions/user/day', target: '3-5' },
    { metric: '"I don\'t know" rate', target: '<20%' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={BarChart3} title="Success Metrics" subtitle="How do we know if we succeeded?" />
      <Card style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Primary Metrics</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Metric</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>POC</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>MVP</th>
                <th style={{ ...styles.tableHeader, textAlign: 'center' }}>Production</th>
              </tr>
            </thead>
            <tbody>
              {primaryMetrics.map((item, i) => (
                <tr key={i}>
                  <td style={{ ...styles.tableCell, fontWeight: 500 }}>{item.metric}</td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}><span style={{ ...styles.badge, background: '#f1f5f9', color: '#64748b' }}>{item.poc}</span></td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}><span style={{ ...styles.badge, background: '#e2e8f0', color: '#475569' }}>{item.mvp}</span></td>
                  <td style={{ ...styles.tableCell, textAlign: 'center' }}><span style={{ ...styles.badge, background: '#0f172a', color: '#ffffff' }}>{item.prod}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card delay={0.1}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Secondary Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {secondaryMetrics.map((item, i) => (
            <div key={i} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.metric}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>{item.target}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function RisksSection() {
  const risks = [
    { risk: 'LLM hallucinates facts', likelihood: 'High', impact: 'Critical', mitigation: 'Strict prompting, require citations, "I don\'t know" fallback' },
    { risk: 'Wrong documents retrieved', likelihood: 'Medium', impact: 'High', mitigation: 'Reranking, hybrid search, metadata filtering' },
    { risk: 'Sensitive data exposure', likelihood: 'Medium', impact: 'Critical', mitigation: 'Access controls, no PII in logs, document permissions' },
    { risk: 'API costs exceed budget', likelihood: 'Medium', impact: 'Medium', mitigation: 'Token budgets, caching, usage alerts' },
    { risk: 'Slow response times', likelihood: 'Medium', impact: 'Medium', mitigation: 'Streaming, async processing, caching' },
    { risk: 'Users don\'t trust answers', likelihood: 'Medium', impact: 'High', mitigation: 'Always show sources, confidence indicators' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={AlertTriangle} title="Risk Assessment" subtitle="What could go wrong?" />
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {risks.map((item, i) => (
          <Card key={i} delay={i * 0.05}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '8px' }}>
                <AlertTriangle size={18} style={{ color: '#64748b' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontWeight: 600, color: '#0f172a' }}>{item.risk}</h4>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ ...styles.badge, background: item.likelihood === 'High' ? '#fef2f2' : '#fffbeb', color: item.likelihood === 'High' ? '#991b1b' : '#92400e' }}>{item.likelihood}</span>
                    <span style={{ ...styles.badge, background: item.impact === 'Critical' ? '#fef2f2' : '#fffbeb', color: item.impact === 'Critical' ? '#991b1b' : '#92400e' }}>{item.impact}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <Shield size={16} style={{ color: '#166534' }} />
                  <span style={{ color: '#166534' }}>{item.mitigation}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

function CostSection() {
  const monthly = [
    { stage: 'POC', users: 5, queries: '500', total: '$5' },
    { stage: 'MVP', users: 20, queries: '5,000', total: '$100' },
    { stage: 'Production', users: 200, queries: '50,000', total: '$700' },
    { stage: 'Scale', users: 1000, queries: '250,000', total: '$3,000' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={DollarSign} title="Cost Estimation" subtitle="How much will this cost to run?" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <Card>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Per-Query Cost</h3>
          <div style={{ padding: '1.5rem', background: '#0f172a', borderRadius: '8px', textAlign: 'center', color: '#ffffff' }}>
            <p style={{ opacity: 0.7, marginBottom: '0.25rem', fontSize: '0.85rem' }}>Total per query</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>~$0.01</p>
          </div>
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Query embedding</span><span>$0.000001</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vector search</span><span>~$0</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>LLM input</span><span>$0.0045</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>LLM output</span><span>$0.006</span></div>
          </div>
        </Card>
        <Card delay={0.1}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '1rem' }}>Monthly Projections</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {monthly.map((item, i) => (
              <div key={i} style={{ padding: '0.875rem', background: item.stage === 'Production' ? '#f0fdf4' : '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: item.stage === 'Production' ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ ...styles.badge, background: item.stage === 'Production' ? '#0f172a' : '#e2e8f0', color: item.stage === 'Production' ? '#ffffff' : '#475569' }}>{item.stage}</span>
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>{item.users} users • {item.queries}/mo</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{item.total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

function OnePagerSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SectionHeader icon={FileText} title="Project One-Pager" subtitle="Executive summary for stakeholders" />
      <Card style={{ border: '2px solid #0f172a' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>DocuQuery</h2>
          <p style={{ color: '#64748b' }}>Internal Document Q&A Assistant</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Problem</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>Employees waste <strong style={{ color: '#0f172a' }}>2+ hours/week</strong> searching for information in company documents.</p>
          </div>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Solution</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>AI-powered Q&A with natural language understanding and <strong style={{ color: '#0f172a' }}>source citations</strong>.</p>
          </div>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Tech Stack</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b' }}>LLM:</span><span style={{ color: '#0f172a' }}>Claude 3.5</span>
              <span style={{ color: '#64748b' }}>Vector DB:</span><span style={{ color: '#0f172a' }}>Qdrant</span>
              <span style={{ color: '#64748b' }}>Backend:</span><span style={{ color: '#0f172a' }}>FastAPI</span>
            </div>
          </div>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Metrics</h3>
            <div style={{ display: 'grid', gap: '0.25rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Accuracy</span><span style={{ fontWeight: 600, color: '#0f172a' }}>85%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Latency</span><span style={{ fontWeight: 600, color: '#0f172a' }}>&lt;5s</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Cost/query</span><span style={{ fontWeight: 600, color: '#0f172a' }}>$0.01</span></div>
            </div>
          </div>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Timeline</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ textAlign: 'center' }}><p style={{ color: '#64748b' }}>POC</p><p style={{ fontWeight: 600, color: '#0f172a' }}>1 wk</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ color: '#64748b' }}>MVP</p><p style={{ fontWeight: 600, color: '#0f172a' }}>3-4 wk</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ color: '#64748b' }}>Prod</p><p style={{ fontWeight: 600, color: '#0f172a' }}>6-8 wk</p></div>
            </div>
          </div>
          <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Key Features</h3>
            <ul style={{ color: '#475569', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
              {['Upload documents', 'Natural language Q&A', 'Source citations', 'Conversation memory'].map((f, i) => (
                <li key={i} style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Check size={14} style={{ color: '#0f172a' }} /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      <Card delay={0.1} style={{ marginTop: '1.25rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem' }}>Stage 1 Checklist</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
          {['Clear problem statement', 'User personas defined', 'MVP scope locked', 'Technical feasibility validated', 'Architecture decisions made', 'Success metrics defined', 'Risks identified', 'Costs estimated', 'One-pager ready'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 size={16} style={{ color: '#166534', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#166534' }}>{item}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

function ArchitectureDiagram() {
  return (
    <section style={{ padding: '4rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#0f172a' }}>System Architecture</h2>
          <p style={{ color: '#64748b' }}>High-level overview of the RAG pipeline</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ background: '#ffffff', borderRadius: '12px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: FileText, label: 'Documents', sublabel: 'PDF, TXT, MD' },
              { icon: Layers, label: 'Chunking', sublabel: '500 tokens' },
              { icon: Cpu, label: 'Embedding', sublabel: 'OpenAI' },
              { icon: Database, label: 'Vector DB', sublabel: 'Qdrant' },
              { icon: Search, label: 'Retrieval', sublabel: 'Top-K' },
              { icon: Brain, label: 'LLM', sublabel: 'Claude 3.5' },
              { icon: MessageSquare, label: 'Answer', sublabel: '+ Citations' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '10px', background: '#f8fafc', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <step.icon size={22} style={{ color: '#0f172a' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>{step.label}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>{step.sublabel}</p>
                  </div>
                </div>
                {i < 6 && <ArrowRight size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ padding: '2rem 1.5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>AI Software Architecture Workshop • Stage 1: Ideation</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: '#f8fafc', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Ready to continue?</span>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0f172a', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
            Stage 2: POC <ChevronRight size={16} />
          </a>
        </div>
      </motion.div>
    </footer>
  )
}

export default App
