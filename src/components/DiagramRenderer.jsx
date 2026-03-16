import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor:       'rgba(212,168,83,0.08)',
    primaryTextColor:   '#f5e8c8',
    primaryBorderColor: 'rgba(212,168,83,0.28)',
    lineColor:          'rgba(212,168,83,0.35)',
    secondaryColor:     'rgba(180,120,40,0.06)',
    background:         'transparent',
    edgeLabelBackground:'rgba(14,13,11,0.9)',
    fontFamily:         "'IBM Plex Mono', monospace",
    fontSize:           '11px',
  },
  flowchart: { curve: 'basis', padding: 28, nodeSpacing: 42, rankSpacing: 52 },
});

export default function DiagramRenderer({ code }) {
  const ref = useRef(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!code || !ref.current) return;
    setErr('');
    const go = async () => {
      try {
        ref.current.innerHTML = '';
        const { svg } = await mermaid.render(`m${Date.now()}`, code);
        ref.current.innerHTML = svg;
      } catch (e) { setErr(e.message); }
    };
    go();
  }, [code]);

  return (
    <div style={{
      borderRight: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.01)',
      minHeight: '480px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Panel label */}
      <div style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          letterSpacing: '0.2em', color: 'var(--gold-dim)',
        }}>
          DIAGRAM
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['rgba(192,57,43,0.5)','rgba(200,160,0,0.5)','rgba(80,180,60,0.5)'].map((c,i) => (
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:c }} />
          ))}
        </div>
      </div>

      {/* Diagram */}
      <div style={{
        flex: 1,
        padding: '40px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
      }}>
        {err ? (
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '11px',
            color: 'rgba(220,100,100,0.6)',
            border: '1px solid rgba(200,60,60,0.15)',
            borderLeft: '2px solid rgba(192,57,43,0.4)',
            padding: '16px 20px',
            borderRadius: '2px',
            lineHeight: '1.6',
            maxWidth: '360px',
          }}>
            <div style={{ color:'rgba(200,80,80,0.5)', marginBottom:'8px', letterSpacing:'0.1em' }}>
              RENDER ERROR
            </div>
            {err}
          </div>
        ) : (
          <div ref={ref} className="mermaid-wrap" style={{ width:'100%', textAlign:'center' }} />
        )}
      </div>
    </div>
  );
}