import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────────────────────── SHARED UI ───────────────────────── */

const statusColor = {
  replied: 'bg-green-100 text-green-800',
  contacted: 'bg-blue-100 text-blue-800',
  identified: 'bg-gray-100 text-gray-700',
};

const platformColor = {
  Blog: 'bg-purple-100 text-purple-800',
  LinkedIn: 'bg-blue-100 text-blue-800',
  Instagram: 'bg-pink-100 text-pink-800',
  X: 'bg-gray-100 text-gray-800',
};

function Badge({ text, colorClass }) {
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>{text}</span>;
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className={`text-3xl font-bold ${accent ? 'text-brand' : 'text-brand-dark'}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

/* ───────────────────────── TAB PANELS ───────────────────────── */

function OverviewTab({ data }) {
  const { stats, alerts, leads, contentCalendar } = data;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Leads Found" value={stats.leadsFound} />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Replied" value={stats.replied} accent />
        <StatCard label="Content Created" value={stats.contentCreated} />
        <StatCard label="Active Projects" value={stats.activeProjects} />
        <StatCard label="Open Alerts" value={stats.alertsOpen} accent />
      </div>

      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Needs Your Attention</h3>
          {alerts.map((a, i) => (
            <div key={i} className={`rounded-lg p-4 border-l-4 ${a.type === 'urgent' ? 'bg-red-50 border-red-500' : 'bg-amber-50 border-amber-500'}`}>
              <p className="text-sm font-medium text-gray-800">{a.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {leads.filter(l => l.status === 'replied').map(l => (
              <div key={l.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-gray-900">{l.name}</span>
                  <Badge text={l.status} colorClass={statusColor[l.status]} />
                </div>
                <p className="text-xs text-gray-500">{l.location} &middot; {l.industry}</p>
                <p className="text-sm text-gray-600 mt-2">{l.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Upcoming Content</h3>
          <div className="space-y-3">
            {contentCalendar.slice(0, 4).map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                <Badge text={c.type} colorClass={platformColor[c.type] || 'bg-gray-100 text-gray-800'} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.day}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesTab({ data }) {
  const { leads, emailDrafts } = data;
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Pipeline Summary</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Identified', count: leads.filter(l => l.status === 'identified').length, color: 'bg-gray-200' },
            { label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length, color: 'bg-blue-200' },
            { label: 'Replied', count: leads.filter(l => l.status === 'replied').length, color: 'bg-green-200' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3">
              <span className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-sm font-medium text-gray-700">{s.count} {s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">All Leads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map(l => (
            <div key={l.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-gray-900">{l.name}</span>
                <Badge text={l.status} colorClass={statusColor[l.status]} />
              </div>
              <p className="text-xs text-gray-500">{l.location} &middot; {l.industry}</p>
              <p className="text-sm text-gray-600 mt-2">{l.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Draft Outreach Emails</h3>
        <div className="space-y-4">
          {emailDrafts.map((e, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 mb-1">To: {e.to}</p>
              <p className="font-semibold text-sm text-gray-900 mb-3">{e.subject}</p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{e.body}</pre>
              <div className="mt-4">
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">Draft — Awaiting Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingTab({ data }) {
  const { contentPosts, contentCalendar } = data;
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Content Calendar</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
              </tr>
            </thead>
            <tbody>
              {contentCalendar.map((c, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.day}</td>
                  <td className="px-4 py-3"><Badge text={c.type} colorClass={platformColor[c.type] || 'bg-gray-100 text-gray-800'} /></td>
                  <td className="px-4 py-3 text-gray-900">{c.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Created Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentPosts.map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Badge text={p.platform} colorClass={platformColor[p.platform] || 'bg-gray-100 text-gray-800'} />
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>{p.status}</span>
              </div>
              <h4 className="font-semibold text-sm text-gray-900 mb-2">{p.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-3">{p.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab({ data }) {
  const { projects } = data;
  return (
    <div className="space-y-8">
      {projects.map((p, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-semibold text-lg text-gray-900">{p.name}</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${p.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Task Breakdown</h4>
            <div className="space-y-2">
              {p.tasks.map((t, j) => (
                <div key={j} className="flex items-start gap-2">
                  <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {t.done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </span>
                  <span className={`text-sm ${t.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {p.kickoffEmail && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Auto-Drafted Kickoff Email</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{p.kickoffEmail}</pre>
                <div className="mt-3">
                  <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">Draft — Awaiting Review</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ManagerTab({ data }) {
  const d = data.managerDigest;
  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Daily Digest</h3>
        <p className="text-sm text-gray-400 mb-6">{d.date}</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-3">NEEDS YOUR ATTENTION</h4>
            <ul className="space-y-2">
              {d.needsAttention.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">LEAD PIPELINE</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-brand-dark">{d.leadPipeline.total}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{d.leadPipeline.contacted}</p>
                <p className="text-xs text-gray-500">Contacted</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{d.leadPipeline.replied}</p>
                <p className="text-xs text-gray-500">Replied</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{d.leadPipeline.draftsReady}</p>
                <p className="text-xs text-gray-500">Drafts Ready</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">CLIENT PROJECTS</h4>
            <div className="space-y-2">
              {d.clientProjects.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                  <span className="text-xs text-gray-500">{p.progress}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">MARKETING &amp; BRAND</h4>
            <p className="text-sm text-gray-600">{d.marketing.postsCreated} pieces of content created across {d.marketing.platforms.join(', ')}.</p>
            <p className="text-sm text-gray-600 mt-1">Next scheduled: {d.marketing.nextScheduled}</p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">AGENT ACTIVITY</h4>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Agent</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Last Run</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold uppercase text-gray-500">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {d.agentActivity.map((a, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2 font-medium text-gray-800">{a.agent}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{a.lastRun}</td>
                      <td className="px-4 py-2 text-gray-600">{a.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── MAIN TEMPLATE ───────────────────────── */

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'projects', label: 'Projects' },
  { key: 'manager', label: 'Manager' },
];

const tabContent = {
  overview: OverviewTab,
  sales: SalesTab,
  marketing: MarketingTab,
  projects: ProjectsTab,
  manager: ManagerTab,
};

/**
 * Reusable demo dashboard template.
 *
 * Usage:
 *   import * as data from '../data/demos/printhub';
 *   <DemoDashboard data={data} />
 *
 * The `data` object must export: client, stats, alerts, leads, emailDrafts,
 * contentPosts, contentCalendar, projects, managerDigest
 */
export default function DemoDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveContent = tabContent[activeTab];
  const { client } = data;

  return (
    <>
      <Helmet>
        <title>{client.name} — AI Agent Dashboard Demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-brand-dark text-white">
          <div className="max-w-6xl mx-auto px-6 py-6 md:py-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-brand-mid text-xs font-medium uppercase tracking-wider mb-1">Demo Dashboard</p>
                <h1 className="font-display text-2xl md:text-3xl font-bold">{client.name}</h1>
                <p className="text-white/60 text-sm mt-1">{client.tagline}</p>
              </div>
              <p className="text-white/40 text-xs">Sample data &middot; {client.dateRange}</p>
            </div>
          </div>
        </header>

        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto -mb-px">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-brand text-brand'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveContent data={data} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center">
            <p className="text-sm text-gray-400">
              This is a demo dashboard showing sample AI agent output for {client.industry.toLowerCase()}.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              <a href="https://evawerodigital.com/products" className="text-brand hover:underline">Learn more about AI Agent Systems</a> &middot; <a href="https://evawerodigital.com/contact" className="text-brand hover:underline">Book a consultation</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
