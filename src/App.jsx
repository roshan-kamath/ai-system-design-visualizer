import { useState, useEffect } from 'react';
import PromptInput from './components/PromptInput';
import DiagramRenderer from './components/DiagramRenderer';
import ExplanationPanel from './components/ExplanationPanel';

const TAGLINE_WORDS = ['Twitter', 'Netflix', 'Uber', 'WhatsApp', 'Airbnb', 'Stripe'];

export default function App() {
  const [diagram, setDiagram]         = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [taglineIdx, setTaglineIdx]   = useState(0);
  const [taglineFade, setTaglineFade] = useState(true);

  // Rotate hero tagline word
  useEffect(() => {
    const t = setInterval(() => {
      setTaglineFade(false);
      setTimeout(() => {
        setTaglineIdx(i => (i + 1) % TAGLINE_WORDS.length);
        setTaglineFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  const handleGenerate = async (prompt) => {
    setIsLoading(true);
    setError('');
    setDiagram('');
    setExplanation('');
    setCurrentTitle(prompt);

    const systemInstruction = `You are an expert software architect.
You MUST respond with ONLY a JSON object. No text before or after. No markdown. No backticks.
The JSON must have exactly two keys: "mermaid" and "explanation".
STRICT Mermaid rules:
- Use graph TD only
- Node labels use square brackets ONLY: A[Label Here]
- NEVER use parentheses () or curly braces in node labels
- Replace spaces/special chars in node IDs with underscores
- Max 12 nodes, labels under 4 words
Keep explanation under 300 words with ## headings.
Format: {"mermaid":"graph TD\\n  A[Client] --> B[Load Balancer]","explanation":"## Overview\\n\\nText here."}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: `Design the system: ${prompt}` }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
          })
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API error');
      const raw     = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const match   = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No valid JSON returned');
      const parsed  = JSON.parse(match[0]);
      setDiagram(parsed.mermaid);
      setExplanation(parsed.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px 48px',
        borderBottom: '1px solid var(--border)',
        animation: 'fadeUp 0.5s ease forwards',
      }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{
            fontFamily: 'var(--serif)',
            fontSize: '22px',
            fontWeight: '700',
            fontStyle: 'italic',
            color: 'var(--gold)',
            letterSpacing: '-0.01em',
          }}>
            ArchGen
          </span>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '13px',
            fontWeight: '400',
            color: 'var(--text)',
            letterSpacing: '0.06em',
          }}>
            AI
          </span>
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: '9px',
            color: 'var(--muted)',
            letterSpacing: '0.12em',
            marginLeft: '4px',
            alignSelf: 'center',
          }}>
            v1.0
          </span>
        </div>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            fontFamily: 'var(--mono)', fontSize: '10px', color: 'rgba(180,220,150,0.7)',
            letterSpacing: '0.12em',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#6fcf5a',
              boxShadow: '0 0 8px rgba(111,207,90,0.7)',
              display: 'inline-block',
              animation: 'pulse-gold 2.5s ease infinite',
            }} />
            LIVE
          </div>
          <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
          <a href="https://github.com" target="_blank" rel="noreferrer"
            style={{
              fontFamily: 'var(--mono)', fontSize: '10px',
              color: 'var(--muted)', textDecoration: 'none',
              letterSpacing: '0.1em', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--gold)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        minHeight: '420px',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Left — headline */}
        <div style={{
          padding: '72px 48px 72px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          animation: 'fadeUp 0.6s ease 0.1s both',
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '10px',
            letterSpacing: '0.2em', color: 'var(--gold-dim)',
            marginBottom: '28px',
          }}>
            001 — ARCHGEN AI · SYSTEM DESIGN VISUALIZER
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(40px, 4vw, 62px)',
            fontWeight: '900',
            lineHeight: '1.08',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}>
            <span style={{ color: 'var(--text)' }}>Describe a</span>
            <br />
            <span
              className="shimmer-text"
              style={{ display: 'inline-block', minWidth: '180px',
                transition: 'opacity 0.3s ease',
                opacity: taglineFade ? 1 : 0,
              }}
            >
              {TAGLINE_WORDS[taglineIdx]}
            </span>
            <br />
            <span style={{ color: 'var(--text)', fontStyle: 'italic' }}>architecture.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '14px',
            color: 'var(--text2)',
            lineHeight: '1.75',
            maxWidth: '380px',
            fontWeight: '300',
          }}>
            Powered by Gemini 2.5 Flash. Generate production-quality 
            system diagrams and technical breakdowns from plain English.
          </p>
        </div>

        {/* Right — input */}
        <div style={{
          padding: '72px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.01)',
          animation: 'fadeUp 0.6s ease 0.2s both',
        }}>
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
        </div>
      </section>

      {/* ── LOADING ────────────────────────────────────── */}
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '56px 48px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <div style={{
              position: 'absolute', inset: 0,
              border: '1px solid rgba(212,168,83,0.15)',
              borderTop: '1px solid var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1.1s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 8,
              border: '1px solid rgba(212,168,83,0.08)',
              borderBottom: '1px solid var(--gold-dim)',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite reverse',
            }} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: '18px', color: 'var(--gold)', marginBottom: '4px',
            }}>
              Generating architecture…
            </div>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '10px',
              color: 'var(--muted)', letterSpacing: '0.1em',
            }}>
              {currentTitle.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR ──────────────────────────────────────── */}
      {error && (
        <div style={{
          margin: '32px 48px',
          padding: '16px 24px',
          background: 'rgba(192,57,43,0.06)',
          border: '1px solid rgba(192,57,43,0.2)',
          borderLeft: '3px solid var(--red)',
          borderRadius: '2px',
          fontFamily: 'var(--mono)',
          fontSize: '12px',
          color: '#e07070',
          letterSpacing: '0.02em',
        }}>
          <span style={{ color: 'rgba(200,80,80,0.6)', marginRight: '12px' }}>ERROR</span>
          {error}
        </div>
      )}

      {/* ── RESULTS ────────────────────────────────────── */}
      {diagram && !isLoading && (
        <div style={{ animation: 'fadeUp 0.6s ease forwards' }}>
          {/* Section header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 48px',
            borderBottom: '1px solid var(--border)',
            gap: '20px',
          }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '9px',
              color: 'var(--gold-dim)', letterSpacing: '0.2em',
            }}>
              002
            </span>
            <div style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
            <span style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: '15px', color: 'var(--text2)',
            }}>
              {currentTitle}
            </span>
            <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '9px',
              color: 'var(--muted)', letterSpacing: '0.15em',
            }}>
              ArchGen AI
            </span>
          </div>

          {/* Two-panel output */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
          }}
          className="results-grid"
          >
            <DiagramRenderer code={diagram} />
            <ExplanationPanel text={explanation} title={currentTitle} />
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer style={{
        padding: '24px 48px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: diagram && !isLoading ? 0 : '80px',
      }}>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--muted)', letterSpacing: '0.1em',
        }}>
          Built with Gemini 2.5 Flash + Mermaid.js
        </span>
        <span style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: '13px', color: 'var(--gold-dim)',
        }}>
          ArchGen AI
        </span>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .results-grid { grid-template-columns: 1fr !important; }
          section { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}