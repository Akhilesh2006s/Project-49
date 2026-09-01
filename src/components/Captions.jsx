export default function Captions({ spaces, capRefs }) {
  return (
    <div className="captions">
      {spaces.map((s, i) => (
        <figure
          key={s.id}
          className="cap"
          ref={(el) => (capRefs.current[i] = el)}
        >
          <div className="cap-meta">
            <span className="cap-num">
              {String(i + 1).padStart(2, '0')} / {String(spaces.length).padStart(2, '0')}
            </span>
            <span className="cap-rule" />
            <span className="cap-floor">{s.floor}</span>
          </div>
          <h2 className="cap-name">{s.name}</h2>
          <figcaption className="cap-line">{s.line}</figcaption>
        </figure>
      ))}
    </div>
  );
}
