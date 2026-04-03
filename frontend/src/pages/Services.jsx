import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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

export default function Services() {
  const { t } = useTranslation();
  const [services, setServices] = useState(null);

  const fallbackServices = [
    {
      icon: 'brain', title: t('services.items.ai.title'),
      full_description: t('services.items.ai.fullDescription'),
      who_is_it_for: t('services.items.ai.whoIsItFor'),
      whats_included: t('services.items.ai.included', { returnObjects: true }),
    },
    {
      icon: 'zap', title: t('services.items.automation.title'),
      full_description: t('services.items.automation.fullDescription'),
      who_is_it_for: t('services.items.automation.whoIsItFor'),
      whats_included: t('services.items.automation.included', { returnObjects: true }),
    },
    {
      icon: 'globe', title: t('services.items.web.title'),
      full_description: t('services.items.web.fullDescription'),
      who_is_it_for: t('services.items.web.whoIsItFor'),
      whats_included: t('services.items.web.included', { returnObjects: true }),
    },
    {
      icon: 'target', title: t('services.items.brand.title'),
      full_description: t('services.items.brand.fullDescription'),
      who_is_it_for: t('services.items.brand.whoIsItFor'),
      whats_included: t('services.items.brand.included', { returnObjects: true }),
    },
  ];

  useEffect(() => {
    getServices().then(data => { if (data.length) setServices(data); }).catch(() => {});
  }, []);

  const displayServices = services || fallbackServices;

  return (
    <>
      <Helmet>
        <title>{t('services.title')}</title>
        <meta name="description" content={t('services.metaDescription')} />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">{t('services.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">{t('services.heading')}</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            {t('services.heroBody')}
          </p>
        </motion.div>
      </section>

      {/* Services detail */}
      {displayServices.map((service, i) => (
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
                  <span className="font-semibold text-text-mid">{t('services.bestFor')}</span>
                  {service.who_is_it_for}
                </p>
                <Button href="/contact">{t('services.getStarted')}</Button>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">{t('services.whatsIncluded')}</h3>
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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">{t('services.ctaHeading')}</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">{t('services.ctaBody')}</p>
          <Button href="/contact" className="bg-white !text-brand hover:!bg-brand-pale">{t('services.ctaButton')}</Button>
        </motion.div>
      </section>
    </>
  );
}
