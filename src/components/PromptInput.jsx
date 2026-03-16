import { useState } from 'react';

const EXAMPLES = [
  'Design Twitter',
  'Design Netflix',
  'Design a URL Shortener',
  'Design WhatsApp',
  'Design Uber',
  'Design an E-commerce Platform',
];

export default function PromptInput({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');

  const submit = () => {
    if (prompt.trim() && !isLoading) onGenerate(prompt.trim());
  };

  return (
    <div style={{ width: '100%' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--mono)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        color: 'var(--gold-dim)',
        marginBottom: '12px',
      }}>
        DESCRIBE YOUR SYSTEM
      </label>

      {/* Textarea */}
      <div className="input-wrap" style={{
        border: '1px solid var(--border)',
        borderRadius: '4px',
        background: 'rgba(255,255,255,0.02)',
        transition: 'all 0.25s ease',
        marginBottom: '20px',
      }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
          placeholder={'e.g. "Design a real-time messaging system like Slack"'}
          rows={4}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '18px 20px',
            fontFamily: 'var(--sans)',
            fontSize: '14px',
            fontWeight: '300',
            color: 'var(--text)',
            resize: 'none',
            lineHeight: '1.65',
          }}
        />
        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px 10px 20px',
          borderTop: '1px solid var(--border)',
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '9px',
            color: 'var(--muted)', letterSpacing: '0.1em',
          }}>
            ENTER ↵ to generate
          </span>
          <button
            onClick={submit}
            disabled={isLoading || !prompt.trim()}
            style={{
              background: isLoading || !prompt.trim()
                ? 'rgba(212,168,83,0.08)'
                : 'var(--gold)',
              color: isLoading || !prompt.trim() ? 'var(--gold-dim)' : '#1a1400',
              border: `1px solid ${isLoading || !prompt.trim() ? 'rgba(212,168,83,0.15)' : 'transparent'}`,
              borderRadius: '3px',
              padding: '9px 22px',
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              fontWeight: '500',
              letterSpacing: '0.12em',
              cursor: isLoading || !prompt.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isLoading || !prompt.trim()
                ? 'none'
                : '0 4px 20px rgba(212,168,83,0.25)',
            }}
            onMouseEnter={e => {
              if (!isLoading && prompt.trim()) {
                e.currentTarget.style.background = 'var(--gold2)';
                e.currentTarget.style.boxShadow = '0 4px 28px rgba(212,168,83,0.4)';
              }
            }}
            onMouseLeave={e => {
              if (!isLoading && prompt.trim()) {
                e.currentTarget.style.background = 'var(--gold)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,168,83,0.25)';
              }
            }}
          >
            {isLoading ? 'GENERATING…' : 'GENERATE →'}
          </button>
        </div>
      </div>

      {/* Example pills */}
      <div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          letterSpacing: '0.15em', color: 'var(--muted)',
          marginBottom: '10px',
        }}>
          QUICK START
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
          {EXAMPLES.map(ex => (
            <button
              key={ex}
              onClick={() => { setPrompt(ex); onGenerate(ex); }}
              disabled={isLoading}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '2px',
                padding: '5px 12px',
                fontFamily: 'var(--mono)',
                fontSize: '10px',
                color: 'var(--muted)',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--gold-dim)';
                e.currentTarget.style.color = 'var(--gold)';
                e.currentTarget.style.background = 'rgba(212,168,83,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}