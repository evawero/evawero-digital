import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSiteSettings } from '../../lib/api';

const ICON_MAP = {
  sync: '\u{1F504}', target: '\u{1F3AF}', brain: '\u{1F9E0}', globe: '\u{1F30D}',
  zap: '\u26A1', search: '\u{1F50D}', handshake: '\u{1F91D}', chart: '\u{1F4CA}',
};

const fallbackValues = [
  { icon: 'sync', title: 'End-to-End Consulting & Implementation', description: 'From strategy to deployment, we handle the full journey \u2014 not just advice.' },
  { icon: 'target', title: 'Solutions Tailored to Your Business', description: 'No cookie-cutter approaches. Every solution is designed around your specific needs and goals.' },
  { icon: 'brain', title: 'Expert Support in AI, Automation & Digital Growth', description: 'Our team brings deep expertise across AI, process automation, and modern web technologies.' },
  { icon: 'globe', title: 'Helping Businesses Stay Competitive', description: 'We help businesses across Nigeria and Europe leverage technology to stay ahead in a digital world.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function WhyEvawero() {
  const [values, setValues] = useState(fallbackValues);

  useEffect(() => {
    getSiteSettings().then(data => {
      const wcu = Array.isArray(data.why_choose_us) ? data.why_choose_us
        : (typeof data.why_choose_us === 'string' ? JSON.parse(data.why_choose_us) : []);
      if (wcu.length) setValues(wcu);
    }).catch(() => {});
  }, []);

  return (
    <section className="border-t border-rule">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Why Choose Us
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            Built Different
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } },
              }}
            >
              <div className="text-2xl mb-3">{ICON_MAP[v.icon] || v.icon || '\u2728'}</div>
              <h3 className="font-display text-base font-semibold text-brand-dark mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-text-mid leading-relaxed">
                {v.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
