import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getSiteSettings } from '../../lib/api';

const ICON_MAP = {
  sync: '\u{1F504}', target: '\u{1F3AF}', brain: '\u{1F9E0}', globe: '\u{1F30D}',
  zap: '\u26A1', search: '\u{1F50D}', handshake: '\u{1F91D}', chart: '\u{1F4CA}',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function WhyEvawero() {
  const { t } = useTranslation();
  const [values, setValues] = useState(null);

  const fallbackValues = [
    { icon: 'sync', title: t('whyEvawero.items.endToEnd.title'), description: t('whyEvawero.items.endToEnd.description') },
    { icon: 'target', title: t('whyEvawero.items.tailored.title'), description: t('whyEvawero.items.tailored.description') },
    { icon: 'brain', title: t('whyEvawero.items.expert.title'), description: t('whyEvawero.items.expert.description') },
    { icon: 'globe', title: t('whyEvawero.items.competitive.title'), description: t('whyEvawero.items.competitive.description') },
  ];

  useEffect(() => {
    getSiteSettings().then(data => {
      const wcu = Array.isArray(data.why_choose_us) ? data.why_choose_us
        : (typeof data.why_choose_us === 'string' ? JSON.parse(data.why_choose_us) : []);
      if (wcu.length) setValues(wcu);
    }).catch(() => {});
  }, []);

  const displayValues = values || fallbackValues;

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
            {t('whyEvawero.eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            {t('whyEvawero.heading')}
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {displayValues.map((v, i) => (
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
