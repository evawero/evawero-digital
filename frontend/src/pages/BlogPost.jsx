import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getBlogPost } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function BlogPost() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPost(slug)
      .then(data => setPost(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <p className="text-sm text-text-muted">{t('blog.loading')}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <>
        <Helmet><title>{t('blog.notFoundTitle')}</title></Helmet>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">{t('blog.notFoundHeading')}</h1>
            <p className="text-text-mid mb-8">{t('blog.notFoundBody')}</p>
            <Link to="/blog" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">{t('blog.backToBlog')}</Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Evawero Digital Solutions</title>
        <meta name="description" content={post.excerpt || ''} />
      </Helmet>

      <article className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <Link to="/blog" className="text-sm text-text-muted hover:text-brand transition-colors mb-8 inline-block">{t('blog.backToBlog')}</Link>

          {post.category && (
            <p className="text-xs font-medium uppercase tracking-wider text-brand mb-3">{post.category}</p>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            {post.author && <span className="text-sm text-text-mid">{post.author}</span>}
            {post.published_date && <time className="text-sm text-text-muted">{post.published_date.slice(0, 10)}</time>}
          </div>

          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full rounded-md mb-10" loading="lazy" />
          )}

          <div className="prose max-w-none text-text-mid" dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>
      </article>
    </>
  );
}
