import { Link } from 'react-router-dom';

export default function ProductCard({ name, tagline, description, badges = [], link }) {
  return (
    <div className="bg-brand-dark rounded-md p-8 md:p-10">
      <h3 className="font-display text-2xl font-semibold text-white mb-1">
        {name}
      </h3>
      <p className="text-brand-mid text-sm font-medium mb-4">{tagline}</p>
      <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-lg">
        {description}
      </p>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {link && (
        <Link
          to={link}
          className="inline-flex items-center text-sm font-medium text-white border border-white/30 px-5 py-2.5 rounded-md hover:bg-white/10 transition-colors duration-200"
        >
          Learn More
        </Link>
      )}
    </div>
  );
}
