/**
 * The rail is the route, not decoration: each row is a stretch of the house
 * you walk through, derived from consecutive spaces sharing a `movement`.
 */
export default function RouteRail({ movements, spaces, active, onJump }) {
  return (
    <nav className="rail" aria-label="Route through the house">
      {movements.map((m) => {
        const on = active >= m.start && active <= m.end;
        return (
          <button
            key={m.name}
            type="button"
            className={on ? 'rail-row on' : 'rail-row'}
            aria-current={on ? 'true' : undefined}
            onClick={() => onJump(m.start)}
          >
            {m.name}
            <span className="rail-tick" />
          </button>
        );
      })}
      <p className="rail-meter">
        <b>{String(active + 1).padStart(2, '0')}</b> / {String(spaces.length).padStart(2, '0')}
      </p>
    </nav>
  );
}
