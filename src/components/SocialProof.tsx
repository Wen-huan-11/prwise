'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/context/LangContext';

const stats = [
  { value: 2847, key: 'stat_reviews', suffix: '' },
  { value: 1203, key: 'stat_bugs', suffix: '+' },
  { value: 15, key: 'stat_languages', suffix: '+' },
  { value: 20, key: 'stat_time', suffix: 's' },
];

export default function SocialProof() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const counters = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        counters.current.forEach((counter, i) => {
          if (!counter) return;
          const target = stats[i].value;
          const start = performance.now();
          const duration = 1500;

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            counter!.textContent = current.toLocaleString() + stats[i].suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              counter!.textContent = target.toLocaleString() + stats[i].suffix;
            }
          }

          requestAnimationFrame(animate);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 border-y border-slate-800/50 bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.key} className="text-center">
              <span
                ref={(el) => { counters.current[i] = el; }}
                className="counter block text-3xl sm:text-4xl font-bold text-slate-100"
              >
                0{stat.suffix}
              </span>
              <span className="block mt-1.5 text-sm text-slate-500">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
