import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { getServices } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ICON_MAP = {
  brain: '\u{1F9E0}', zap: '\u26A1', globe: '\u{1F310}', target: '\u{1F3AF}',
  chart: '\u{1F4CA}', gear: '\u2699\uFE0F', money: '\u{1F4B1}', search: '\u{1F50D}',
};

const fallbackServices = [
  {
    icon: 'brain', title: 'AI Strategy & Integration',
    full_description: 'We help you identify where AI can create the most impact in your business, then design and implement solutions that deliver measurable results. From automated workflows to intelligent data analysis, we bring AI from concept to production.',
    who_is_it_for: 'CEOs, operations managers, and business owners looking to leverage AI for competitive advantage.',
    whats_included: ['AI readiness assessment', 'Custom AI solution design', 'Implementation and integration', 'Team training and handover', 'Ongoing optimisation support'],
  },
  {
    icon: 'zap', title: 'Business Process Automation',
    full_description: 'We analyse your existing workflows, identify bottlenecks and manual processes, then design automated solutions that free your team to focus on high-value work.',
    who_is_it_for: 'Businesses with repetitive manual processes, growing teams that need to scale operations efficiently.',
    whats_included: ['Process audit and mapping', 'Automation solution design', 'Tool integration (Zapier, Make, custom)', 'Testing and deployment', 'Documentation and training'],
  },
  {
    icon: 'globe', title: 'Custom Web Solutions',
    full_description: 'From customer-facing platforms to internal tools, we build web applications that are fast, secure, and designed around your users.',
    who_is_it_for: 'Businesses needing custom platforms, SaaS products, dashboards, or client portals.',
    whats_included: ['Requirements analysis', 'UI/UX design', 'Full-stack development', 'Testing and QA', 'Deployment and hosting setup', 'Post-launch support'],
  },
  {
    icon: 'target', title: 'Brand & Digital Strategy',
    full_description: 'We help you define your brand positioning, develop your digital strategy, and create a roadmap for growth.',
    who_is_it_for: 'Startups, SMEs, and professionals looking to establish or strengthen their digital presence.',
    whats_included: ['Brand audit and positioning', 'Digital strategy roadmap', 'Content strategy', 'SEO and analytics setup', 'Social media strategy', 'Performance tracking'],
  },
];

export default function Services() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    getServices().then(data => { if (data.length) setServices(data); }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Services | Evawero Digital Solutions</title>
        <meta name="description" content="From AI strategy to digital transformation, explore how Evawero Digital Solutions can help your business grow." />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">What We Do</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">Our Services</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            Technology should work for your business, not the other way around. Here is how we help.
          </p>
        </motion.div>
      </section>

      {/* Services detail */}
      {services.map((service, i) => (
        <section key={service.title} className={`border-t border-rule ${i % 2 === 1 ? 'bg-surface' : 'bg-white'}`}>
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
            className="max-w-6xl mx-auto px-6 py-20 md:py-28"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="text-3xl mb-4 block">{ICON_MAP[service.icon] || service.icon}</span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-4">{service.title}</h2>
                <p className="text-text-mid leading-relaxed mb-6">{service.full_description}</p>
                <p className="text-sm text-text-muted mb-6">
                  <span className="font-semibold text-text-mid">Best for: </span>
                  {service.who_is_it_for}
                </p>
                <Button href="/contact">Get Started</Button>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">What&apos;s Included</h3>
                <ul className="space-y-3">
                  {(service.whats_included || []).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-mid">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="border-t border-rule bg-brand">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">Book a free assessment and we will help you figure out the best next step for your business.</p>
          <Button href="/contact" className="bg-white !text-brand hover:!bg-brand-pale">Book a Free Assessment</Button>
        </motion.div>
      </section>
    </>
  );
}
