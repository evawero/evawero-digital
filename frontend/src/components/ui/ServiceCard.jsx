const ICON_MAP = {
  brain: '\u{1F9E0}', zap: '\u26A1', globe: '\u{1F310}', target: '\u{1F3AF}',
  chart: '\u{1F4CA}', gear: '\u2699\uFE0F', money: '\u{1F4B1}', search: '\u{1F50D}',
};

export default function ServiceCard({ title, short_description, shortDescription, icon }) {
  const desc = short_description || shortDescription || '';
  const emoji = ICON_MAP[icon] || icon || '\u2728';

  return (
    <div className="group bg-white border border-rule rounded-md p-6 transition-all duration-200 hover:border-l-brand-border hover:border-l-[3px] hover:shadow-sm">
      <div className="text-2xl mb-4">{emoji}</div>
      <h3 className="font-display text-lg font-semibold text-brand-dark mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-mid leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
