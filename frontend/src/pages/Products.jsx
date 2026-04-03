import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { getFeaturedProduct } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fallbackProduct = {
  name: 'Evas Intelligence',
  tagline: 'Your briefing. Already done. Every morning.',
  description: 'AI-powered platform that scans your Gmail and news feeds, then delivers a prioritised intelligence briefing with action steps. Built for CEOs, consultants, and investors across Nigeria and Europe.',
  features: ['Inbox Intelligence \u2014 AI analysis of your Gmail', 'Market Intelligence \u2014 curated RSS and news monitoring', 'Content Creation \u2014 AI-assisted content from your signals'],
  link: 'https://app.evaweroukpevo.com',
  pricing_free: '\u20AC0 per month',
  pricing_pro: '\u20AC10 per month',
  badges: ['AI-Powered', 'Nigeria + Europe', 'Free to start'],
};

const eiSteps = [
  { step: '01', text: 'Connect your email securely' },
  { step: '02', text: 'AI scans and extracts key signals' },
  { step: '03', text: 'View your prioritised briefing' },
  { step: '04', text: 'Take action with smart recommendations' },
];

const agentSystem = {
  name: 'AI Agent Systems',
  tagline: 'Your business, running smarter \u2014 even while you sleep.',
  description: 'Custom AI agents that handle your marketing, sales outreach, client delivery, and daily operations autonomously. Each agent is tailored to your brand, market, and workflow \u2014 creating content, finding leads, managing projects, and reporting back to you with what matters.',
  features: [
    'Marketing Agent \u2014 Creates on-brand content for your blog and social channels, tailored to your audience and market',
    'Sales Agent \u2014 Finds qualified prospects, drafts personalised outreach, and manages your lead pipeline',
    'Delivery Agent \u2014 Breaks down client projects into actionable plans, scaffolds deliverables, and drafts communications',
    'Manager Agent \u2014 Monitors all activity, sends you executive digests, and alerts you only when your attention is needed',
  ],
  badges: ['AI-Powered', 'Custom-Built', 'Fully Autonomous'],
};

const agentSteps = [
  { step: '01', text: 'We analyse your business, brand, and workflows' },
  { step: '02', text: 'We build and configure your custom agent team' },
  { step: '03', text: 'Agents run on schedule \u2014 creating, prospecting, reporting' },
  { step: '04', text: 'You review, approve, and stay in control' },
];

const cmsProduct = {
  name: 'Evawero CMS',
  tagline: 'Your content, everywhere. One backend, any frontend.',
  description: 'A lightweight, API-first content management system built for businesses that need flexibility without complexity. Define your own content types \u2014 blog posts, team bios, FAQs, products, case studies, whatever your business needs. Create and manage content through a clean admin panel with a rich text editor. Serve it to any frontend: your website, mobile app, digital signage, or email templates.',
  features: [
    'Custom Content Types \u2014 Define the exact content structure your business needs, not a one-size-fits-all template',
    'Clean Admin Panel \u2014 Your team can use it without training. Rich text editor, draft/publish workflow, media library',
    'API-First \u2014 Connects to any frontend: React, Next.js, Vue, WordPress, Webflow, mobile apps',
    'Multi-Platform \u2014 One content source for your website, app, kiosk, email templates, or any other channel',
    'Optional AI Content Agent \u2014 Pair with our AI Agent System and your content writes itself, on-brand and on-schedule',
  ],
  badges: ['API-First', 'Multi-Platform', 'AI-Ready'],
};

const cmsSteps = [
  { step: '01', text: 'We scope your content needs and define your content types' },
  { step: '02', text: 'We set up your CMS with a tailored admin panel' },
  { step: '03', text: 'Your team creates and manages content through a clean interface' },
  { step: '04', text: 'Your frontend fetches content via API \u2014 any platform, any framework' },
];

function ProductSection({ product, label, features, featureLabel, featureColumns, steps, pricing, cta }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="border-t border-rule">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
          <div className="bg-brand-dark rounded-md p-8 md:p-12">
            {label && <p className="text-brand-mid text-sm font-medium uppercase tracking-wider mb-2">{label}</p>}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h2>
            <p className="text-brand-border text-lg italic mb-6">{product.tagline}</p>
            <p className="text-white/80 leading-relaxed max-w-2xl">{product.description}</p>
            {product.badges?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.badges.map(b => (
                  <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90">{b}</span>
                ))}
              </div>
            )}
            <button
              onClick={() => setExpanded(e => !e)}
              className="flex items-center gap-3 mt-8 group cursor-pointer"
            >
              <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:bg-white/30"
                style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L10 8L6 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-white font-medium text-sm">{expanded ? 'Show less' : 'Learn more'}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          {features?.length > 0 && (
            <div className="mt-16">
              <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">{featureLabel}</motion.h3>
              <div className={`grid grid-cols-1 ${featureColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {features.map((feat, i) => {
                  const [title, ...rest] = feat.split(' \u2014 ');
                  const desc = rest.join(' \u2014 ') || title;
                  return (
                    <motion.div key={feat} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}
                      className="border border-rule rounded-md p-6">
                      <h4 className="font-display text-lg font-semibold text-brand-dark mb-2">{rest.length ? title : `Module ${i + 1}`}</h4>
                      <p className="text-sm text-text-mid leading-relaxed">{desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-16">
            <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">How It Works</motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.step} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                  <span className="font-display text-3xl font-bold text-brand-border">{s.step}</span>
                  <p className="mt-2 text-sm text-text-mid">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 border-t border-rule pt-16">
            <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">Pricing</motion.h3>
            {pricing}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-8">
              {cta}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Products() {
  const [product, setProduct] = useState(fallbackProduct);

  useEffect(() => {
    getFeaturedProduct().then(data => { if (data) setProduct(data); }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Products | Evawero Digital Solutions</title>
        <meta name="description" content="AI-powered products: Evas Intelligence for business briefings, AI Agent Systems for autonomous operations, and Evawero CMS \u2014 a lightweight headless content management system." />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">Products</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">Our Products</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            Tools we build and ship. Designed to solve real problems for real businesses.
          </p>
        </motion.div>
      </section>

      {/* Evas Intelligence */}
      <ProductSection
        product={product}
        label="Featured Product"
        features={product.features}
        featureLabel="Core Modules"
        featureColumns={3}
        steps={eiSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="border border-rule rounded-md p-6">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Free</h4>
              <p className="text-xl font-bold text-text mb-1">{product.pricing_free || '\u20AC0'}</p>
              <p className="text-sm text-text-muted">Basic inbox scanning and insights. Perfect for getting started.</p>
            </div>
            <div className="border border-brand rounded-md p-6">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Pro</h4>
              <p className="text-xl font-bold text-text mb-1">{product.pricing_pro || '\u20AC10'}</p>
              <p className="text-sm text-text-muted">Full AI insights, action dashboard, and priority support.</p>
            </div>
          </motion.div>
        }
        cta={<Button href={product.link || 'https://app.evaweroukpevo.com'}>Try Evas Intelligence</Button>}
      />

      {/* AI Agent Systems */}
      <ProductSection
        product={agentSystem}
        label="New"
        features={agentSystem.features}
        featureLabel="Your Agent Team"
        featureColumns={2}
        steps={agentSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="max-w-2xl">
            <div className="border border-brand rounded-md p-8">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Custom Quote</h4>
              <p className="text-xl font-bold text-text mb-3">Tailored to your business</p>
              <p className="text-sm text-text-muted leading-relaxed">
                Every agent system is built around your specific brand, market, and workflows.
                Pricing depends on the number of agents, run frequency, integrations, and level of customisation.
                Book a free consultation to discuss your needs.
              </p>
            </div>
          </motion.div>
        }
        cta={<Button href="/contact">Book a Free Consultation</Button>}
      />

      {/* Evawero CMS */}
      <ProductSection
        product={cmsProduct}
        label="New"
        features={cmsProduct.features}
        featureLabel="What You Get"
        featureColumns={2}
        steps={cmsSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="max-w-2xl">
            <div className="border border-brand rounded-md p-8">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Custom Quote</h4>
              <p className="text-xl font-bold text-text mb-3">Tailored to your content needs</p>
              <p className="text-sm text-text-muted leading-relaxed">
                Every business is different. Pricing depends on the number of content types, storage needs, and whether you
                want the AI Content Agent add-on. We will scope a CMS setup tailored to your business.
              </p>
            </div>
          </motion.div>
        }
        cta={<Button href="/contact">Request a Quote</Button>}
      />

      {/* More Coming Soon */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">More Coming Soon</h2>
          <p className="text-text-mid max-w-lg mx-auto">We are always building. Stay tuned for new tools designed to help businesses operate smarter.</p>
        </motion.div>
      </section>
    </>
  );
}
