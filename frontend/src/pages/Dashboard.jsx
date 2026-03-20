import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Unlock, ArrowRight, Zap } from 'lucide-react';

const API_BASE = 'https://techprep-as9o.onrender.com';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await currentUser.getIdToken();
        const headers = { Authorization: `Bearer ${token}` };

        // Ensure user is created in DB and fetch profile
        const profileRes = await fetch(`${API_BASE}/auth/profile`, { headers });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data);
        }

        // Fetch questions
        const qRes = await fetch(`${API_BASE}/questions`, { headers });
        const qData = await qRes.json();
        if (qData.success) {
          setQuestions(qData.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) fetchData();
  }, [currentUser]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading your dashboard...</div>;

  return (
    <div>
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Welcome back!</h3>
          <p>Email: {profile?.email}</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Current Plan:</span>
            <span className={`badge badge-${profile?.plan || 'free'}`}>{profile?.plan || 'Free'}</span>
          </div>
        </div>
        <div>
          <button onClick={() => navigate('/upgrade')} className="btn btn-primary">
            <Zap size={16} /> Upgrade Plan
          </button>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Interview Questions</h2>
      
      <div className="grid-cards">
        {questions.map((q) => (
          <div key={q.id} className="glass-panel interactive" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
              {q.isPremium && <span className="badge badge-premium">Premium</span>}
            </div>
            
            <h4 style={{ marginBottom: '1rem', flexGrow: 1 }}>{q.title}</h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1rem' }}>
              {q.isLocked ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Lock size={14} /> Locked
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem' }}>
                  <Unlock size={14} /> Available
                </span>
              )}
              
              <Link to={`/question/${q.id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>
                View <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
