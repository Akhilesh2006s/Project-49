import { useInView } from '../hooks/scroll';

/** Part 29. An illustrative identity system: what one residence carries with it. */
const LAYERS = [
  'Family narrative', 'Site', 'Orientation', 'Sun path', 'Original sketch', 'Design development', 'Material provenance',
  'Craftspeople', 'Construction', 'Environmental study', 'Photography', 'Film', 'Completed architecture',
];

function Layer({ text, i }: { text: string; i: number }) {
  const [ref, seen] = useInView<HTMLLIElement>({ threshold: 0.6 });
  return <li ref={ref} className={seen ? 'is-seen' : ''}><span className="label">{String(i + 1).padStart(2, '0')}</span>{text}</li>;
}

export default function Provenance() {
  return (
    <section id="provenance" className="provenance" aria-labelledby="prov-title">
      <div className="prov-identity">
        <p className="label prov-illustrative">Illustrative identity</p>
        <p className="prov-id">LIGHT <span>/</span> 01</p>
        <p className="label">Jubilee Hills · Hyderabad</p>
        <p className="prov-caption">An example of the identity system. It does not describe a real commission.</p>
      </div>
      <ol className="prov-layers">{LAYERS.map((l, i) => <Layer key={l} text={l} i={i} />)}</ol>
      <div className="prov-close">
        <h2 id="prov-title" className="monument-sm">Not just real estate.<br />Authored architecture.<br /><em>With provenance.</em></h2>
        <p className="prov-disclaimer">
          PROJECT 49 does not promise investment appreciation. Real-estate value remains dependent on land, location, market conditions,
          maintenance, regulation and future demand. Our ambition is to add a further layer of architectural scarcity, authorship,
          documentation and cultural identity.
        </p>
      </div>
    </section>
  );
}
