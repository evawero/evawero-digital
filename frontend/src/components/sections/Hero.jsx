import { motion } from 'framer-motion';
import Button from '../ui/Button';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Hero() {
  return (
    <section className="bg-brand-pale">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-6 py-24 md:py-32"
      >
        <motion.p
          variants={item}
          className="text-sm font-medium uppercase tracking-wider text-brand mb-4"
        >
          Evawero Digital Solutions
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight max-w-2xl"
        >
          From Analysis to AI
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-4 font-display text-xl md:text-2xl text-brand italic"
        >
          Your Digital Growth Partner
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 text-text-mid text-base md:text-lg leading-relaxed max-w-xl"
        >
          We help businesses leverage technology to streamline operations,
          attract more customers, and scale sustainably &mdash; from intelligent
          automation to full digital transformation.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Book a Free Assessment</Button>
          <Button href="/services" variant="outline">
            Explore Services
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
