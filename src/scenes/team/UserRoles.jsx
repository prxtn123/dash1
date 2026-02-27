import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NodeLogo from '../../components/NodeLogo';
import './UserRoles.css';

/**
 * UserRoles — team management with role badges and audit log
 */

const MOCK_USERS = [
  { id: 1,  name: 'Thomas Noble',    email: 'thomas@praxisgb.com',  role: 'Admin',    status: 'active',   lastLogin: '2026-01-15 09:12', avatar: 'TN' },
  { id: 2,  name: 'Sarah Mitchell',  email: 'sarah@praxisgb.com',   role: 'Manager',  status: 'active',   lastLogin: '2026-01-15 08:45', avatar: 'SM' },
  { id: 3,  name: 'Jamie Clarke',    email: 'jamie@praxisgb.com',   role: 'Operator', status: 'active',   lastLogin: '2026-01-14 16:30', avatar: 'JC' },
  { id: 4,  name: 'Priya Patel',     email: 'priya@praxisgb.com',   role: 'Viewer',   status: 'active',   lastLogin: '2026-01-13 11:00', avatar: 'PP' },
  { id: 5,  name: 'Luke Harrison',   email: 'luke@praxisgb.com',    role: 'Operator', status: 'inactive', lastLogin: '2025-12-20 14:55', avatar: 'LH' },
  { id: 6,  name: 'Emma Wilson',     email: 'emma@praxisgb.com',    role: 'Viewer',   status: 'active',   lastLogin: '2026-01-15 07:30', avatar: 'EW' },
  { id: 7,  name: 'Dan Forsythe',    email: 'dan@praxisgb.com',     role: 'Manager',  status: 'active',   lastLogin: '2026-01-14 10:20', avatar: 'DF' },
];

const AUDIT_LOG = [
  { id: 1, user: 'Thomas Noble',   action: 'Acknowledged incident #5',    time: '2026-01-15 09:14', type: 'acknowledge' },
  { id: 2, user: 'Sarah Mitchell', action: 'Exported CSV report',          time: '2026-01-15 08:47', type: 'export'      },
  { id: 3, user: 'Jamie Clarke',   action: 'Logged in',                   time: '2026-01-15 08:30', type: 'login'       },
  { id: 4, user: 'Thomas Noble',   action: 'Changed role: Luke → Viewer', time: '2026-01-14 17:02', type: 'role-change' },
  { id: 5, user: 'Dan Forsythe',   action: 'Acknowledged incident #3',    time: '2026-01-14 10:25', type: 'acknowledge' },
  { id: 6, user: 'Priya Patel',    action: 'Viewed safety detail report', time: '2026-01-13 11:05', type: 'view'        },
  { id: 7, user: 'Emma Wilson',    action: 'Logged in',                   time: '2026-01-15 07:30', type: 'login'       },
];

const ROLE_CONFIG = {
  Admin:    { color: '#00d4ff', bg: 'rgba(0,212,255,0.12)',    border: 'rgba(0,212,255,0.3)'    },
  Manager:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)'  },
  Operator: { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.3)'   },
  Viewer:   { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', border: 'rgba(156,163,175,0.3)'  },
};

const AUDIT_ICONS = {
  acknowledge: '✅',
  export:      '📥',
  login:       '🔑',
  'role-change': '🔄',
  view:        '👁',
};

const ROLES = ['Admin', 'Manager', 'Operator', 'Viewer'];

const UserRoles = () => {
  const navigate = useNavigate();
  const [users, setUsers]         = useState(MOCK_USERS);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab]             = useState('users');
  const [search, setSearch]       = useState('');
  const [newUser, setNewUser]     = useState({ name: '', email: '', role: 'Viewer' });

  const activeCount   = users.filter(u => u.status === 'active').length;
  const adminCount    = users.filter(u => u.role === 'Admin').length;

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const initials = newUser.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
    setUsers(prev => [...prev, {
      id: Date.now(), ...newUser,
      status: 'active',
      lastLogin: '—',
      avatar: initials,
    }]);
    setNewUser({ name: '', email: '', role: 'Viewer' });
    setShowModal(false);
  };

  return (
    <div className="ur-page">
      <div className="bg-orb bg-orb--cyan"   aria-hidden="true" />
      <div className="bg-orb bg-orb--violet" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="ur-header">
        <div className="ur-header-left">
          <button className="ur-back-btn" onClick={() => navigate('/')}>← Dashboard</button>
          <div>
            <NodeLogo size="sm" />
            <h1 className="ur-title">Team & Roles</h1>
            <p className="ur-subtitle">{activeCount} active users · {adminCount} admin{adminCount !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="ur-add-btn" onClick={() => setShowModal(true)}>
          + Add User
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="ur-tabs">
        <button className={`ur-tab${tab === 'users' ? ' ur-tab--active' : ''}`} onClick={() => setTab('users')}>
          👥 Users
        </button>
        <button className={`ur-tab${tab === 'audit' ? ' ur-tab--active' : ''}`} onClick={() => setTab('audit')}>
          📋 Audit Log
        </button>
      </div>

      {/* ── Users tab ── */}
      {tab === 'users' && (
        <div className="ur-section">
          <div className="ur-search-row">
            <input
              className="ur-search"
              placeholder="Search users, roles…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="ur-role-legend">
              {ROLES.map(r => {
                const cfg = ROLE_CONFIG[r];
                return (
                  <span key={r} className="ur-legend-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                    {r}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="ur-table">
            <div className="ur-table-head">
              <div>User</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div>Last Login</div>
              <div>Actions</div>
            </div>
            {filteredUsers.map(user => {
              const roleStyle = ROLE_CONFIG[user.role];
              return (
                <div key={user.id} className={`ur-table-row${user.status === 'inactive' ? ' ur-row--inactive' : ''}`}>
                  <div className="ur-user-cell">
                    <div className="ur-avatar">{user.avatar}</div>
                    <span className="ur-user-name">{user.name}</span>
                  </div>
                  <div className="ur-email">{user.email}</div>
                  <div>
                    <select
                      className="ur-role-select"
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      style={{ color: roleStyle.color, borderColor: roleStyle.border, background: roleStyle.bg }}
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <span className={`ur-status-badge${user.status === 'active' ? ' ur-status--active' : ' ur-status--inactive'}`}>
                      {user.status === 'active' ? '● Active' : '● Inactive'}
                    </span>
                  </div>
                  <div className="ur-last-login">{user.lastLogin}</div>
                  <div className="ur-actions">
                    <button
                      className={`ur-toggle-btn${user.status === 'active' ? ' ur-toggle--disable' : ' ur-toggle--enable'}`}
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                    >
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Audit log tab ── */}
      {tab === 'audit' && (
        <div className="ur-section">
          <div className="ur-audit-list">
            {AUDIT_LOG.map(entry => (
              <div key={entry.id} className="ur-audit-row">
                <div className="ur-audit-icon">{AUDIT_ICONS[entry.type] || '📝'}</div>
                <div className="ur-audit-body">
                  <div className="ur-audit-action">
                    <strong className="ur-audit-user">{entry.user}</strong> — {entry.action}
                  </div>
                  <div className="ur-audit-time">{entry.time}</div>
                </div>
                <span className={`ur-audit-type ur-audit-type--${entry.type}`}>{entry.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add User modal ── */}
      {showModal && (
        <div className="ur-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ur-modal" onClick={e => e.stopPropagation()}>
            <div className="ur-modal-header">
              <h2 className="ur-modal-title">Add New User</h2>
              <button className="ur-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser} className="ur-modal-form">
              <label className="ur-field-label">Full Name</label>
              <input
                className="ur-field-input"
                placeholder="Jane Smith"
                value={newUser.name}
                onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                required
              />
              <label className="ur-field-label">Email</label>
              <input
                className="ur-field-input"
                type="email"
                placeholder="jane@praxisgb.com"
                value={newUser.email}
                onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                required
              />
              <label className="ur-field-label">Role</label>
              <select
                className="ur-field-input"
                value={newUser.role}
                onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="ur-modal-actions">
                <button type="button" className="ur-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="ur-modal-submit">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoles;
