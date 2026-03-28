import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getSiteSettings, getTeamMembers } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fallbackValues = [
  { title: 'Innovation', description: 'We stay ahead of the curve, applying the latest technology and thinking to every engagement.' },
  { title: 'Reliability', description: 'We deliver on time, communicate clearly, and stand behind our work with ongoing support.' },
  { title: 'Tailored Solutions', description: 'No two businesses are the same. Every solution is custom-built for your specific challenges and goals.' },
  { title: 'Long-term Partnership', description: 'We measure our success by yours. Our relationships extend well beyond project delivery.' },
];

export default function About() {
  const [mission, setMission] = useState('Evawero Digital Solutions exists to close the gap between where businesses are and where technology can take them. We combine deep technical expertise with practical business understanding to deliver solutions that create real, measurable impact.');
  const [team, setTeam] = useState([]);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data.mission_statement) setMission(data.mission_statement);
    }).catch(() => {});
    getTeamMembers().then(data => setTeam(data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>About Us | Evawero Digital Solutions</title>
        <meta name="description" content="Learn about Evawero Digital Solutions, our mission, values, and the team behind your digital growth." />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">Who We Are</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">About Evawero Digital</h1>
        </motion.div>
      </section>

      {/* Story */}
      <section className="border-t border-rule">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">Our Story</h2>
            <div className="space-y-4 text-text-mid leading-relaxed">
              <p>Built at the intersection of Nigeria and Europe, Evawero Digital Solutions exists to close the gap between where businesses are and where technology can take them.</p>
              <p>Too many companies are held back by outdated systems, manual processes, and a gap between what technology can do and what they are actually using. We exist to close that gap.</p>
              <p>From our roots in business analysis, we have expanded into web development, AI automation, and full digital transformation &mdash; always guided by data, always tailored to the client.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Our Mission</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">Empowering businesses through intelligent technology</h2>
            <p className="text-text-mid leading-relaxed">{mission}</p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">What We Stand For</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-12">Our Values</h2>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">The Team</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-dark mb-6">Meet the People Behind Evawero</h2>
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
            <p className="text-text-muted text-sm">Team profiles coming soon.</p>
          )}
        </motion.div>
      </section>
    </>
  );
}
