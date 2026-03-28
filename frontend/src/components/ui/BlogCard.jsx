import { Link } from 'react-router-dom';

export default function BlogCard({ title, excerpt, date, category, slug }) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="block bg-white border border-rule rounded-md p-6 transition-all duration-200 hover:shadow-sm group"
    >
      {category && (
        <span className="text-xs font-medium uppercase tracking-wider text-brand mb-3 block">
          {category}
        </span>
      )}
      <h3 className="font-display text-lg font-semibold text-brand-dark mb-2 group-hover:text-brand transition-colors">
        {title}
      </h3>
      <p className="text-sm text-text-mid leading-relaxed mb-4">{excerpt}</p>
      {date && (
        <time className="text-xs text-text-muted">{date}</time>
      )}
    </Link>
  );
}
