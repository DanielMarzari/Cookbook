import type { Canon } from '@/data/canon';

/**
 * The definitional flowchart: what must hold, what you may swap, what it
 * becomes if a condition fails.
 *
 * Three columns, read left to right as one sentence about each condition — you
 * may change this, this must stay true, and here is the dish you have made
 * instead if it doesn't. Laid out in CSS rather than a fixed SVG so it survives
 * a phone: the columns stack, and the "otherwise" stays attached to the
 * condition it belongs to rather than drifting to the bottom of the page.
 */
export default function CanonLine({ canon }: { canon: Canon }) {
  return (
    <div>
      <div className="hidden md:grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.2fr)] gap-x-5 mb-2">
        {['Swap freely', 'Must hold', 'Otherwise it becomes'].map((h, i) => (
          <p
            key={h}
            className={`text-[11px] uppercase tracking-[0.13em] pb-1.5 border-b ${
              i === 1 ? 'text-text border-text' : 'text-text-secondary border-border'
            }`}
          >
            {h}
          </p>
        ))}
      </div>

      <ol className="list-none p-0 m-0">
        {canon.gates.map((gate, i) => (
          <li key={gate.label} className="md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.2fr)] md:gap-x-5 md:items-stretch">
            {/* what varies */}
            <div className="pt-4 md:pt-5 pb-1 md:pb-5">
              {gate.slot ? (
                <div className="border border-dashed border-border p-3 h-full">
                  <p className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary mb-1">
                    {gate.slot.name}
                  </p>
                  <p className="text-[13px] leading-[1.5] text-text">{gate.slot.options.join(' · ')}</p>
                </div>
              ) : (
                <div className="h-full" />
              )}
            </div>

            {/* what must hold */}
            <div className="py-2 md:py-5 relative">
              <div className="border border-text p-3.5 bg-[#fafafa] h-full">
                <p className="text-[10.5px] uppercase tracking-[0.13em] text-text-secondary mb-1">
                  {gate.label}
                </p>
                <p className="text-[15px] leading-[1.4] text-text">{gate.statement}</p>
              </div>
              {/* the chain: each condition holds *and* the next one does */}
              {i < canon.gates.length - 1 && (
                <span
                  aria-hidden
                  className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 text-[10.5px] uppercase tracking-[0.12em] text-text-secondary bg-white px-1.5 z-10"
                >
                  and
                </span>
              )}
            </div>

            {/* where it stops being the dish */}
            <div className="pb-4 md:py-5">
              <div className="border-l-2 border-[#a0522d] pl-3 py-1 h-full flex flex-col justify-center">
                <p className="text-[13.5px] leading-[1.45] text-text">{gate.breaks.becomes}</p>
                <p className="text-[12.5px] leading-[1.45] text-text-secondary mt-0.5">{gate.breaks.why}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* if every gate held, this is what you have */}
      <div className="md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1.2fr)] md:gap-x-5 mt-2">
        <div />
        <div className="bg-text text-white px-4 py-3.5 text-center">
          <p className="text-[19px] tracking-[-0.01em] leading-tight">{canon.terminal}</p>
          <p className="text-[10.5px] uppercase tracking-[0.13em] opacity-75 mt-1">{canon.terminalNote}</p>
        </div>
        <div />
      </div>
    </div>
  );
}
