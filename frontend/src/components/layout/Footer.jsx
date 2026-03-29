import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteSettings } from '../../lib/api';

const linkGroups = [
  {
    heading: 'Company',
    links: [
      { to: '/services', label: 'Services' },
      { to: '/products', label: 'Products' },
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
];

const fallbackSettings = {
  contact_email: 'theherosmind@gmail.com',
  contact_phone: '08082552357',
  social_links: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', twitter: 'https://x.com' },
};

export default function Footer() {
  const [settings, setSettings] = useState(fallbackSettings);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data && data.contact_email) setSettings(data);
    }).catch(() => {});
  }, []);

  const social = settings.social_links || fallbackSettings.social_links;

  return (
    <footer className="border-t border-rule bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-xl font-semibold text-brand-dark">
              Evawero Digital
            </Link>
            <p className="mt-3 text-sm text-text-mid leading-relaxed max-w-sm">
              Your digital growth partner. We help businesses leverage technology
              to streamline operations, attract customers, and scale sustainably.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              {social.linkedin && social.linkedin !== '#' && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand transition-colors text-sm"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
              )}
              {social.instagram && social.instagram !== '#' && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand transition-colors text-sm"
                  aria-label="Instagram"
                >
                  Instagram
                </a>
              )}
              {social.twitter && social.twitter !== '#' && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-brand transition-colors text-sm"
                  aria-label="X"
                >
                  X
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {linkGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                {group.heading}
              </h4>
              <ul className="space-y-3">
                {group.links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-text-mid hover:text-brand transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-text-muted">
            <a href={`tel:${settings.contact_phone || fallbackSettings.contact_phone}`} className="hover:text-brand transition-colors">
              {settings.contact_phone || fallbackSettings.contact_phone}
            </a>
            <span className="hidden sm:inline text-text-faint">|</span>
            <a
              href={`mailto:${settings.contact_email || fallbackSettings.contact_email}`}
              className="hover:text-brand transition-colors"
            >
              {settings.contact_email || fallbackSettings.contact_email}
            </a>
          </div>
          <div className="text-xs text-text-faint">
            <p>&copy; 2026 Evawero Digital Solutions Limited. Registered in Nigeria.</p>
            <p className="mt-1">Operating in Nigeria and Germany</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
