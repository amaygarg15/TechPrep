import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = 'https://techprep-as9o.onrender.com';

export default function QuestionDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(`${API_BASE}/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.success) {
          setQuestion(data.data);
        } else {
          // 403 Forbidden scenarios
          setQuestion(data.data); // sometimes it still returns the question metadata without the answer
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch question details.');
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) fetchQuestion();
  }, [id, currentUser]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading question...</div>;

  return (
    <div>
      <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      {question && (
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span className={`badge badge-${question.difficulty}`}>{question.difficulty}</span>
            {question.isPremium && <span className="badge badge-premium">Premium Question</span>}
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'white' }}>{question.title}</h1>

          {error ? (
            <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', textAlign: 'center' }}>
              <Lock size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#f87171', marginBottom: '1rem' }}>Content Locked</h3>
              <p style={{ marginBottom: '2rem' }}>{error}</p>
              
              <div className="blurred-text" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.
              </div>

              <button onClick={() => navigate('/upgrade')} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                View Upgrade Plans
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--panel-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success)' }}>
                <CheckCircle2 size={20} />
                <h3 style={{ margin: 0 }}>Answer Example</h3>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e2e8f0' }}>{question.answer}</p>
            </div>
          )}
        </div>
      )}

      {!question && !error && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <AlertCircle size={48} color="#f59e0b" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Question not found</h3>
        </div>
      )}
    </div>
  );
}
