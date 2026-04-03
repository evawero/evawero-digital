import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { getFeaturedProduct } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function ProductSection({ product, label, features, featureLabel, featureColumns, steps, pricing, cta, t }) {
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
              <span className="text-white font-medium text-sm">{expanded ? t('products.showLess') : t('products.learnMore')}</span>
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
                  const parts = feat.split(/\s*[\u2014:]\s*/);
                  const title = parts.length > 1 ? parts[0] : `Module ${i + 1}`;
                  const desc = parts.length > 1 ? parts.slice(1).join(': ') : feat;
                  return (
                    <motion.div key={feat} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}
                      className="border border-rule rounded-md p-6">
                      <h4 className="font-display text-lg font-semibold text-brand-dark mb-2">{title}</h4>
                      <p className="text-sm text-text-mid leading-relaxed">{desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-16">
            <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">{t('products.howItWorks')}</motion.h3>
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
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">{t('products.pricing')}</motion.h3>
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
  const { t } = useTranslation();
  const [product, setProduct] = useState(null);

  const fallbackProduct = {
    name: t('products.ei.name'),
    tagline: t('products.ei.tagline'),
    description: t('products.ei.description'),
    features: t('products.ei.features', { returnObjects: true }),
    badges: t('products.ei.badges', { returnObjects: true }),
    link: 'https://app.evaweroukpevo.com',
  };

  const agentSystem = {
    name: t('products.agents.name'),
    tagline: t('products.agents.tagline'),
    description: t('products.agents.description'),
    features: t('products.agents.features', { returnObjects: true }),
    badges: t('products.agents.badges', { returnObjects: true }),
  };

  const cmsProduct = {
    name: t('products.cms.name'),
    tagline: t('products.cms.tagline'),
    description: t('products.cms.description'),
    features: t('products.cms.features', { returnObjects: true }),
    badges: t('products.cms.badges', { returnObjects: true }),
  };

  const eiSteps = t('products.ei.steps', { returnObjects: true }).map((text, i) => ({ step: `0${i + 1}`, text }));
  const agentSteps = t('products.agents.steps', { returnObjects: true }).map((text, i) => ({ step: `0${i + 1}`, text }));
  const cmsSteps = t('products.cms.steps', { returnObjects: true }).map((text, i) => ({ step: `0${i + 1}`, text }));

  useEffect(() => {
    getFeaturedProduct().then(data => { if (data) setProduct(data); }).catch(() => {});
  }, []);

  const displayProduct = product || fallbackProduct;

  return (
    <>
      <Helmet>
        <title>{t('products.title')}</title>
        <meta name="description" content={t('products.metaDescription')} />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">{t('products.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">{t('products.heading')}</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            {t('products.heroBody')}
          </p>
        </motion.div>
      </section>

      {/* Evas Intelligence */}
      <ProductSection
        t={t}
        product={displayProduct}
        label={t('products.ei.label')}
        features={displayProduct.features}
        featureLabel={t('products.ei.featureLabel')}
        featureColumns={3}
        steps={eiSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="border border-rule rounded-md p-6">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">{t('products.ei.pricingFree')}</h4>
              <p className="text-xl font-bold text-text mb-1">{displayProduct.pricing_free || '\u20AC0'}</p>
              <p className="text-sm text-text-muted">{t('products.ei.pricingFreeDesc')}</p>
            </div>
            <div className="border border-brand rounded-md p-6">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">{t('products.ei.pricingPro')}</h4>
              <p className="text-xl font-bold text-text mb-1">{displayProduct.pricing_pro || '\u20AC10'}</p>
              <p className="text-sm text-text-muted">{t('products.ei.pricingProDesc')}</p>
            </div>
          </motion.div>
        }
        cta={<Button href={displayProduct.link || 'https://app.evaweroukpevo.com'}>{t('products.ei.cta')}</Button>}
      />

      {/* AI Agent Systems */}
      <ProductSection
        t={t}
        product={agentSystem}
        label={t('products.agents.label')}
        features={agentSystem.features}
        featureLabel={t('products.agents.featureLabel')}
        featureColumns={2}
        steps={agentSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="max-w-2xl">
            <div className="border border-brand rounded-md p-8">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">{t('products.agents.pricingHeading')}</h4>
              <p className="text-xl font-bold text-text mb-3">{t('products.agents.pricingSubheading')}</p>
              <p className="text-sm text-text-muted leading-relaxed">{t('products.agents.pricingDesc')}</p>
            </div>
          </motion.div>
        }
        cta={<Button href="/contact">{t('products.agents.cta')}</Button>}
      />

      {/* Evawero CMS */}
      <ProductSection
        t={t}
        product={cmsProduct}
        label={t('products.cms.label')}
        features={cmsProduct.features}
        featureLabel={t('products.cms.featureLabel')}
        featureColumns={2}
        steps={cmsSteps}
        pricing={
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
            className="max-w-2xl">
            <div className="border border-brand rounded-md p-8">
              <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">{t('products.cms.pricingHeading')}</h4>
              <p className="text-xl font-bold text-text mb-3">{t('products.cms.pricingSubheading')}</p>
              <p className="text-sm text-text-muted leading-relaxed">{t('products.cms.pricingDesc')}</p>
            </div>
          </motion.div>
        }
        cta={<Button href="/contact">{t('products.cms.cta')}</Button>}
      />

      {/* More Coming Soon */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">{t('products.moreComingSoon')}</h2>
          <p className="text-text-mid max-w-lg mx-auto">{t('products.moreComingSoonBody')}</p>
        </motion.div>
      </section>
    </>
  );
}
