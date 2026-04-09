import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { chatWithCoach } from '../services/agentService';
import { Send, Zap, BarChart2, Target, Leaf, ArrowLeft } from 'lucide-react';

const QUICK_PROMPTS = [
  { label: '📊 Week summary',   text: 'Give me a summary of my emission patterns this week.' },
  { label: '🚇 Metro vs Uber',  text: 'How much CO₂ and money would I save by switching Uber rides to metro?' },
  { label: '⚡ Peak hour tips', text: 'How can I reduce my electricity footprint during peak grid hours in India?' },
  { label: '🎯 Set a goal',     text: 'Help me set a realistic carbon reduction goal for next week.' },
  { label: '🌱 Quick win',      text: 'What is the single highest-impact change I can make this week?' },
];

export const AICoachScreen: React.FC = () => {
  const { chatMessages, addChatMessage, isAgentThinking, setAgentThinking, activities, agentState, profile, setActiveTab } = useStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAgentThinking]);

  const sendMessage = async (text: string) => {
    const msg = text.trim();
    if (!msg || isAgentThinking) return;
    setInput('');
    addChatMessage({ role: 'user', content: msg });
    setAgentThinking(true);
    try {
      const reply = await chatWithCoach(msg, activities, agentState, profile.city);
      addChatMessage({ role: 'agent', content: reply });
    } catch {
      addChatMessage({ role: 'agent', content: "I'm having trouble connecting. Check that your VITE_ANTHROPIC_API_KEY is set in the .env file, or I'll give smart demo responses." });
    } finally {
      setAgentThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--color-bg-base)' }}>

      {/* ─── Header ─── */}
      <div style={{
        padding: '12px var(--space-md)',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(7,11,20,0.96)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-ghost btn-icon"
            style={{ padding: 6, marginRight: 2 }}
            onClick={() => setActiveTab('home')}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(56,189,248,0.15))',
            border: '1px solid rgba(74,222,128,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Leaf size={18} color="#4ade80" />
            <div style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 9, height: 9, borderRadius: '50%',
              background: '#22c55e', border: '2px solid var(--color-bg-base)',
            }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>AI Climate Coach</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.68rem', color: 'var(--color-green-400)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-green-400)' }} />
              Claude · India-specific data
            </div>
          </div>

          <div className="badge badge-green" style={{ flexShrink: 0 }}>
            <Zap size={9} /> Live
          </div>
        </div>
      </div>

      {/* ─── Messages ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Capability chips — only on first load */}
        {chatMessages.length <= 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            {[
              { Icon: BarChart2, label: 'Emission Analysis' },
              { Icon: Target,    label: 'Goal Setting'      },
              { Icon: Zap,       label: 'Nudge Strategy'    },
              { Icon: Leaf,      label: 'India Context'     },
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)',
                fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 500,
              }}>
                <Icon size={9} color="var(--color-green-400)" /> {label}
              </div>
            ))}
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div
              className={`chat-bubble ${msg.role}`}
              style={{ opacity: 0, animation: 'fadeInUp 0.35s ease forwards', animationDelay: `${Math.min(i * 0.04, 0.3)}s` }}
            >
              {msg.content}
            </div>
            <div style={{
              fontSize: '0.62rem', color: 'var(--color-text-muted)',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              paddingInline: 4,
            }}>
              {msg.role === 'agent' ? '🤖 Coach' : 'You'} · {formatTime(msg.ts)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isAgentThinking && (
          <div>
            <div className="chat-bubble agent" style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '12px 16px', width: 'fit-content' }}>
              {[0, 0.18, 0.36].map((d, i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--color-green-400)',
                  animation: `float 0.9s ${d}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ─── Quick Prompts + Input (sticky bottom) ─── */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-base)',
        padding: 'var(--space-sm) var(--space-md) var(--space-md)',
      }}>
        {/* Quick prompt chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          <style>{`.scroll-hide::-webkit-scrollbar { display: none; }`}</style>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.label}
              className="tag"
              style={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.7rem' }}
              onClick={() => sendMessage(p.text)}
              disabled={isAgentThinking}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input row */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about your carbon footprint…"
            disabled={isAgentThinking}
            style={{ flex: 1, fontSize: '0.875rem', padding: '10px 14px' }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-icon"
            disabled={!input.trim() || isAgentThinking}
            style={{
              width: 44, height: 44, flexShrink: 0,
              opacity: !input.trim() || isAgentThinking ? 0.5 : 1,
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
