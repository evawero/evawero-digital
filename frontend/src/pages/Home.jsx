import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Hero from '../components/sections/Hero';
import ServicesSection from '../components/sections/Services';
import ProductsSection from '../components/sections/Products';
import WhyEvawero from '../components/sections/WhyEvawero';
import Button from '../components/ui/Button';
import BlogCard from '../components/ui/BlogCard';
import { getBlogPosts } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogPosts(3).then(data => setPosts(data)).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Evawero Digital Solutions | From Analysis to AI</title>
        <meta name="description" content="Evawero Digital Solutions helps businesses leverage technology to streamline operations, attract customers, and scale sustainably." />
      </Helmet>

      <Hero />
      <ServicesSection />
      <ProductsSection />
      <WhyEvawero />

      {/* CTA Banner */}
      <section className="border-t border-rule bg-brand">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-20 md:py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Not sure where to start?</h2>
          <p className="text-white/80 text-base md:text-lg max-w-lg mx-auto mb-8">
            Book a free Digital Readiness Assessment. We&apos;ll analyse your current setup and show you exactly where AI and automation can create the most impact.
          </p>
          <Button href="/contact" className="bg-white !text-brand hover:!bg-brand-pale">Book a Free Assessment</Button>
        </motion.div>
      </section>

      {/* Latest Insights */}
      <section className="border-t border-rule">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">Latest Insights</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">From the Blog</h2>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <BlogCard key={post.slug} title={post.title} excerpt={post.excerpt} date={post.published_date?.slice(0, 10)} category={post.category} slug={post.slug} />
                ))}
              </div>
              <div className="mt-10">
                <a href="/blog" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">View all posts &rarr;</a>
              </div>
            </>
          ) : (
            <p className="text-sm text-text-muted">Insights coming soon. Check back for articles on digital strategy, AI, and business growth.</p>
          )}
        </motion.div>
      </section>
    </>
  );
}
