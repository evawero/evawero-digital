import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ContactForm from '../components/sections/ContactForm';
import { getSiteSettings } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Contact() {
  const [settings, setSettings] = useState({
    contact_phone: '08082552357',
    contact_email: 'theherosmind@gmail.com',
  });

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data && data.contact_email) setSettings(data);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Us | Evawero Digital Solutions</title>
        <meta
          name="description"
          content="Get in touch with Evawero Digital Solutions. Book a free assessment or send us a message."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-24 md:py-32"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">
            Get in Touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">
            Let&rsquo;s Work Together
          </h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            Tell us about your project, challenge, or idea. We will get back to
            you within 24 hours.
          </p>
        </motion.div>
      </section>

      {/* Form + contact info */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact info */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-text-mid mb-1">Phone</p>
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-sm text-brand hover:text-brand-dark transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-mid mb-1">Email</p>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm text-brand hover:text-brand-dark transition-colors break-all"
                  >
                    {settings.contact_email}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-mid mb-1">Locations</p>
                  <p className="text-sm text-text-muted">Nigeria</p>
                  <p className="text-sm text-text-muted">Germany (Bad Mergentheim)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
