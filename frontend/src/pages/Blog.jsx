import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BlogCard from '../components/ui/BlogCard';
import { getBlogPosts } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(data => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog | Evawero Digital Solutions</title>
        <meta name="description" content="Insights on digital strategy, AI, automation, and business growth from Evawero Digital Solutions." />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">Insights</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">Blog</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            Practical thinking on technology, growth, and digital strategy.
          </p>
        </motion.div>
      </section>

      {/* Posts grid or empty state */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          {loading ? (
            <p className="text-sm text-text-muted text-center py-12">Loading...</p>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} title={post.title} excerpt={post.excerpt} date={post.published_date?.slice(0, 10)} category={post.category} slug={post.slug} cover_image={post.cover_image} />
              ))}
            </div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={fadeUp} className="text-center py-12">
              <p className="font-display text-xl text-brand-dark mb-2">Insights coming soon.</p>
              <p className="text-sm text-text-muted">We are preparing articles on digital strategy, AI, and business growth. Check back shortly.</p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
