import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { submitContact } from '../../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const serviceOptions = [
    { value: 'AI Strategy & Integration', label: t('contact.form.serviceAI') },
    { value: 'Business Process Automation', label: t('contact.form.serviceAutomation') },
    { value: 'Custom Web Solutions', label: t('contact.form.serviceWeb') },
    { value: 'Brand & Digital Strategy', label: t('contact.form.serviceBrand') },
    { value: 'General Enquiry', label: t('contact.form.serviceGeneral') },
  ];

  const update = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await submitContact(form);
      if (res.error) throw new Error(res.error);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', business: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full border border-text-muted/40 rounded-md px-4 py-3 text-sm text-text bg-white placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors';

  if (status === 'success') {
    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="text-center py-16"
      >
        <p className="font-display text-2xl font-semibold text-brand-dark mb-2">
          {t('contact.form.successHeading')}
        </p>
        <p className="text-sm text-text-mid">
          {t('contact.form.successBody')}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={fadeUp}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="text"
          name="name"
          placeholder={t('contact.form.name')}
          required
          value={form.name}
          onChange={update}
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder={t('contact.form.email')}
          required
          value={form.email}
          onChange={update}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder={t('contact.form.phone')}
          value={form.phone}
          onChange={update}
          className={inputClass}
        />
        <input
          type="text"
          name="business"
          placeholder={t('contact.form.company')}
          value={form.business}
          onChange={update}
          className={inputClass}
        />
      </div>

      <select
        name="service"
        value={form.service}
        onChange={update}
        required
        className={`${inputClass} ${!form.service ? 'text-text-muted' : ''}`}
      >
        <option value="" disabled className="text-text-muted">
          {t('contact.form.serviceDefault')}
        </option>
        {serviceOptions.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-brand-dark">
            {opt.label}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        placeholder={t('contact.form.message')}
        rows={5}
        required
        value={form.message}
        onChange={update}
        className={inputClass}
      />

      {status === 'error' && (
        <p className="text-sm text-red-600">
          {t('contact.form.error')}
        </p>
      )}

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
      </Button>
    </motion.form>
  );
}
