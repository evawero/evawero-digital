import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-brand-dark text-white hover:bg-brand',
  outline: 'border border-brand text-brand hover:bg-brand-light',
};

export default function Button({
  variant = 'primary',
  children,
  href,
  className = '',
  ...props
}) {
  const base = `inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${variants[variant]} ${className}`;

  if (href?.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={base} {...props}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link to={href} className={base} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={base} {...props}>
      {children}
    </button>
  );
}
