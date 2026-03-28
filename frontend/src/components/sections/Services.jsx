import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceCard from '../ui/ServiceCard';
import { getServices } from '../../lib/api';

const fallbackServices = [
  { icon: 'brain', title: 'AI Strategy & Integration', short_description: 'Develop and implement AI solutions tailored to your business goals.' },
  { icon: 'zap', title: 'Business Process Automation', short_description: 'Streamline operations with intelligent automation that saves time and reduces errors.' },
  { icon: 'globe', title: 'Custom Web Solutions', short_description: 'Modern, responsive web applications built to solve your specific business problems.' },
  { icon: 'target', title: 'Brand & Digital Strategy', short_description: 'Build a strong digital presence with a clear strategy that drives growth.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServicesSection() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    getServices().then(data => { if (data.length) setServices(data); }).catch(() => {});
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
            What We Do
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            Our Services
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } },
              }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/services" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
            View all services &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
