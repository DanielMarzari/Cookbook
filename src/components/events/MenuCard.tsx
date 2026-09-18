import type { EventCourse, EventDish } from '@/lib/events/types';
import { marksFor } from '@/lib/events/types';
import { styleById, stockById } from '@/lib/events/styles';

/**
 * The printed card — one component, every identity.
 *
 * A style is a set of custom properties and a stock is a set of colours, and
 * the two never touch each other, so any of the twelve prints on any of the six
 * without a single hand-written combination.
 *
 * Stocks carry their own ink rather than reading the page's theme tokens. A
 * cream card is paper: it stays cream in dark mode instead of pretending to be
 * a dark card, because what is on screen here is a preview of something that
 * comes out of a printer.
 */
export default function MenuCard({
  courses,
  title,
  dateline,
  styleId,
  stockId,
  showKey = true,
  className = '',
  dimFor,
}: {
  courses: EventCourse[];
  title: string;
  dateline?: string;
  styleId: string;
  stockId: string;
  showKey?: boolean;
  className?: string;
  /** When set, dishes this guest can't eat are struck through. */
  dimFor?: (dish: EventDish) => boolean;
}) {
  const style = styleById(styleId);
  const stock = stockById(stockId);

  const vars = {
    '--face-d': '"Helvetica Neue", Helvetica, Arial, sans-serif',
    '--face-b': '"Helvetica Neue", Helvetica, Arial, sans-serif',
    '--align': 'center',
    '--dish': '15px', '--dish-lh': '1.4',
    '--sub': '11.5px', '--sub-style': 'italic',
    '--cn-size': '9.5px', '--cn-track': '0.2em', '--cn-case': 'uppercase',
    '--hd-size': '20px', '--hd-track': '0.02em', '--hd-case': 'none', '--hd-style': 'normal',
    '--gap': '19px',
    '--or-style': 'italic', '--or-case': 'lowercase', '--or-track': '0.02em',
    '--pad': '38px 30px',
    ...style.vars,
    '--paper': stock.paper,
    '--ink': stock.ink,
    '--faint': stock.faint,
    '--edge': stock.edge,
  } as React.CSSProperties;

  const laid =
    stock.id === 'laid'
      ? { backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,.022) 0 1px, transparent 1px 4px)' }
      : undefined;

  const usedMarks = new Set<string>();
  courses.forEach((c) => c.dishes.forEach((d) => marksFor(d).split(' ').filter(Boolean).forEach((m) => usedMarks.add(m))));

  return (
    <div
      className={`menu-card ${className}`}
      style={{
        ...vars,
        ...laid,
        fontFamily: 'var(--face-b)',
        textAlign: 'var(--align)' as React.CSSProperties['textAlign'],
        color: 'var(--ink)',
        background: 'var(--paper)',
        border: stock.id === 'framed' ? `1px solid ${stock.edge}` : `1px solid ${stock.edge}`,
        boxShadow: stock.id === 'framed' ? `0 0 0 3px ${stock.paper}, 0 0 0 4px ${stock.edge}` : undefined,
        padding: 'var(--pad)',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--face-d)', fontSize: 'var(--hd-size)', letterSpacing: 'var(--hd-track)',
          textTransform: 'var(--hd-case)' as React.CSSProperties['textTransform'],
          fontStyle: 'var(--hd-style)' as React.CSSProperties['fontStyle'], lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      {dateline && (
        <div style={{ fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--faint)', marginTop: 7 }}>
          {dateline}
        </div>
      )}

      <hr
        style={{
          border: 0, borderTop: `1px solid ${stock.ink}`, opacity: 0.4,
          width: style.vars['--align'] === 'left' ? '100%' : 44,
          margin: style.vars['--align'] === 'left' ? '17px 0 22px' : '17px auto 22px',
        }}
      />

      {courses.map((course) => (
        <div key={course.index} style={{ marginBottom: 'var(--gap)' }}>
          {course.name && (
            <span
              style={{
                fontSize: 'var(--cn-size)', letterSpacing: 'var(--cn-track)',
                textTransform: 'var(--cn-case)' as React.CSSProperties['textTransform'],
                color: 'var(--faint)', display: 'block', marginBottom: 6,
              }}
            >
              {course.name}
            </span>
          )}
          {course.dishes.map((dish, i) => (
            <div key={dish.id}>
              {course.isChoice && i > 0 && (
                <div
                  style={{
                    fontSize: '10.5px', fontStyle: 'var(--or-style)' as React.CSSProperties['fontStyle'],
                    textTransform: 'var(--or-case)' as React.CSSProperties['textTransform'],
                    letterSpacing: 'var(--or-track)', color: 'var(--faint)', margin: '6px 0',
                  }}
                >
                  or
                </div>
              )}
              <div
                style={{
                  fontSize: 'var(--dish)', lineHeight: 'var(--dish-lh)',
                  ...(dimFor?.(dish)
                    ? { color: 'var(--faint)', textDecoration: 'line-through', textDecorationColor: stock.edge }
                    : {}),
                }}
              >
                {dish.title}
                {marksFor(dish) && (
                  <span style={{ fontSize: 8, letterSpacing: '0.08em', color: 'var(--faint)', verticalAlign: 'super', marginLeft: 3, fontStyle: 'normal' }}>
                    {marksFor(dish)}
                  </span>
                )}
                {dish.subtitle && (
                  <span
                    style={{
                      fontSize: 'var(--sub)', fontStyle: 'var(--sub-style)' as React.CSSProperties['fontStyle'],
                      color: 'var(--faint)', display: 'block', marginTop: 1,
                    }}
                  >
                    {dish.subtitle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {showKey && usedMarks.size > 0 && (
        <div
          style={{
            marginTop: 22, paddingTop: 11, borderTop: `1px solid ${stock.edge}`,
            fontSize: 8.5, letterSpacing: '0.08em', color: 'var(--faint)', textAlign: 'left', lineHeight: 1.75,
          }}
        >
          {/* Only the marks this card actually uses — a key explaining symbols
              that appear nowhere is noise on a small card. */}
          {[
            ['D', 'DAIRY'], ['G', 'GLUTEN'], ['N', 'TREE NUTS'], ['P', 'PEANUT'],
            ['S', 'SESAME'], ['E', 'EGG'], ['SF', 'SHELLFISH'], ['A', 'ALCOHOL'],
          ]
            .filter(([m]) => usedMarks.has(m))
            .map(([m, label]) => `${m} ${label}`)
            .join(' · ')}
        </div>
      )}
    </div>
  );
}
