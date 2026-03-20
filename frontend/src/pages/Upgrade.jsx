import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ArrowLeft, Zap } from 'lucide-react';

const API_BASE = 'https://techprep-as9o.onrender.com';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Basic access for starters.',
    features: ['Access basic questions', 'No verified answers', 'Community support'],
    current: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    description: 'Perfect for regular preparation.',
    features: ['Access basic questions', 'Verified answers for basic questions', 'No premium content', 'Email support'],
    current: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$29',
    description: 'The ultimate interview package.',
    features: ['Access ALL questions', 'Verified answers for ALL questions', 'Exclusive premium content', 'Priority 24/7 support'],
    current: false,
    highlight: true,
  }
];

export default function Upgrade() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleUpgrade(planId) {
    if (planId === 'free') return; // Cannot downgrade to free in this mock
    
    try {
      setLoading(true);
      setError('');
      
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_BASE}/select-plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: planId })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(`Successfully upgraded to ${planId.toUpperCase()}! Redirecting...`);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred during upgrade.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <Zap size={48} color="#f59e0b" style={{ margin: '0 auto 1rem auto' }} />
        <h1>Upgrade Your Journey</h1>
        <p style={{ fontSize: '1.2rem' }}>Select the plan that fits your preparation needs.</p>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          {success}
        </div>
      )}

      <div className="grid-cards" style={{ alignItems: 'flex-start' }}>
        {PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className="glass-panel" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              borderColor: plan.highlight ? 'var(--accent-primary)' : 'var(--panel-border)',
              boxShadow: plan.highlight ? '0 0 40px rgba(99, 102, 241, 0.15)' : 'var(--glass-shadow)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {plan.highlight && (
              <div style={{ background: 'var(--accent-primary)', color: 'white', textAlign: 'center', padding: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                Most Popular
              </div>
            )}
            
            <div style={{ marginTop: plan.highlight ? '1.5rem' : '0' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: plan.highlight ? 'var(--accent-primary)' : 'white' }}>{plan.name}</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>{plan.price}</div>
              <p style={{ marginBottom: '2rem', minHeight: '3rem' }}>{plan.description}</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1 }}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Check size={20} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem' }}>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading || plan.id === 'free'} 
              className={`btn ${plan.highlight ? 'btn-primary' : 'btn-outline'}`} 
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? 'Processing...' : (plan.id === 'free' ? 'Current Plan (Default)' : `Upgrade to ${plan.name}`)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
