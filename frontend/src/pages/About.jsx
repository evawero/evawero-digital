import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getSiteSettings, getTeamMembers } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function About() {
  const { t } = useTranslation();
  const [mission, setMission] = useState(null);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data.mission_statement) setMission(data.mission_statement);
    }).catch(() => {});
    getTeamMembers().then(data => setTeam(data)).catch(() => {});
  }, []);

  const fallbackValues = [
    { title: t('about.values.innovation.title'), description: t('about.values.innovation.description') },
    { title: t('about.values.reliability.title'), description: t('about.values.reliability.description') },
    { title: t('about.values.tailored.title'), description: t('about.values.tailored.description') },
    { title: t('about.values.partnership.title'), description: t('about.values.partnership.description') },
  ];

  return (
    <>
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.metaDescription')} />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">{t('about.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">{t('about.heading')}</h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="border-t border-rule">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">{t('about.story.heading')}</h2>
            <div className="space-y-4 text-text-mid leading-relaxed">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t('about.mission.eyebrow')}</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">{t('about.mission.heading')}</h2>
            <p className="text-text-mid leading-relaxed">{mission || t('about.mission.body')}</p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t('about.values.eyebrow')}</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-12">{t('about.values.heading')}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fallbackValues.map((v, i) => (
              <motion.div key={v.title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}
                className="border border-rule rounded-md p-6">
                <h3 className="font-display text-lg font-semibold text-brand-dark mb-2">{v.title}</h3>
                <p className="text-sm text-text-mid leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t('about.team.eyebrow')}</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">{t('about.team.heading')}</h2>
          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {team.map(member => (
                <div key={member.id} className="bg-white border border-rule rounded-md p-6">
                  {member.photo && <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-4" />}
                  <h3 className="font-display text-lg font-semibold text-brand-dark">{member.name}</h3>
                  {member.role && <p className="text-sm text-brand mb-2">{member.role}</p>}
                  {member.bio && <p className="text-sm text-text-mid leading-relaxed">{member.bio}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm">{t('about.team.empty')}</p>
          )}
        </motion.div>
      </section>
    </>
  );
}
