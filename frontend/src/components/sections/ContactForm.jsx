import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { submitContact } from '../../lib/api';

const serviceOptions = [
  'AI Strategy & Integration',
  'Business Process Automation',
  'Custom Web Solutions',
  'Brand & Digital Strategy',
  'General Enquiry',
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

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
          Message Sent
        </p>
        <p className="text-sm text-text-mid">
          Thank you for reaching out. We will get back to you within 24 hours.
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
          placeholder="Full Name"
          required
          value={form.name}
          onChange={update}
          className={inputClass}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={update}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={update}
          className={inputClass}
        />
        <input
          type="text"
          name="business"
          placeholder="Business / Organisation"
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
        className={`${inputClass} ${!form.service ? 'text-text-faint' : ''}`}
      >
        <option value="" disabled>
          Select a Service
        </option>
        {serviceOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        placeholder="Tell us about your project or challenge..."
        rows={5}
        required
        value={form.message}
        onChange={update}
        className={inputClass}
      />

      {status === 'error' && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </Button>
    </motion.form>
  );
}
