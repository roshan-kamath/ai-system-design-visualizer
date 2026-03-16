export default function ExplanationPanel({ text, title }) {
  const renderMarkdown = (md) =>
    md.split('\n').map((line, i) => {
      if (line.startsWith('## '))
        return (
          <div key={i} style={{ marginTop: i === 0 ? 0 : '32px', marginBottom: '14px' }}>
            <div style={{
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '8px',
            }}>
              {line.slice(3)}
            </div>
            <div style={{ height: '1px', background: 'var(--border)' }} />
          </div>
        );

      if (line.startsWith('### '))
        return (
          <div key={i} style={{
            fontFamily: 'var(--mono)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'var(--gold-dim)',
            marginTop: '20px',
            marginBottom: '8px',
          }}>
            {line.slice(4).toUpperCase()}
          </div>
        );

      if (line.startsWith('- ')) {
        const content = line.slice(2);
        const parts = content.split(/\*\*(.*?)\*\*/g);
        return (
          <div key={i} style={{ display:'flex', gap:'12px', marginBottom:'8px', alignItems:'flex-start' }}>
            <span style={{ color:'var(--gold)', opacity:0.5, flexShrink:0, marginTop:'3px', fontSize:'10px' }}>◆</span>
            <span style={{ fontFamily:'var(--sans)', fontSize:'13px', fontWeight:'300', color:'var(--text2)', lineHeight:'1.7' }}>
              {parts.map((p,j) => j%2===1
                ? <strong key={j} style={{ color:'var(--text)', fontWeight:'500' }}>{p}</strong>
                : p)}
            </span>
          </div>
        );
      }

      if (line.trim() === '') return <div key={i} style={{ height:'10px' }} />;

      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{
          fontFamily: 'var(--sans)',
          fontSize: '13px',
          fontWeight: '300',
          color: 'var(--text2)',
          lineHeight: '1.8',
          marginBottom: '6px',
        }}>
          {parts.map((p,j) => j%2===1
            ? <strong key={j} style={{ color:'var(--text)', fontWeight:'500' }}>{p}</strong>
            : p)}
        </p>
      );
    });

  return (
    <div style={{
      background: 'rgba(255,255,255,0.01)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '480px',
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
          BREAKDOWN
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          color: 'var(--muted)', letterSpacing: '0.1em',
        }}>
          GEMINI 2.5 FLASH
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '36px 32px',
        overflowY: 'auto',
        maxHeight: '560px',
      }}>
        {renderMarkdown(text)}
      </div>
    </div>
  );
}