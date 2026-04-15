import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Avatar } from '../components/Navigation';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('q') || '');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followingMap, setFollowingMap] = useState({});
  const navigate = useNavigate();
  const { user, triggerAuthGate, updateFollow } = useAuth();
  const inputRef = useRef();
  const suggestionsRef = useRef();

  const debouncedInput = useDebounce(input, 250);

  // Live suggestions while typing
  useEffect(() => {
    if (!debouncedInput.trim()) {
      setSuggestions([]);
      return;
    }
    API.get('/search', { params: { q: debouncedInput.trim() } })
      .then(res => setSuggestions(res.data.users ?? []))
      .catch(() => {});
  }, [debouncedInput]);

  // Full search results (submitted)
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setUsers([]); return; }
    setLoading(true);
    try {
      const res = await API.get('/search', { params: { q } });
      setUsers(res.data.users ?? []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search from URL param on mount
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q) doSearch(q);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    doSearch(input.trim());
  };

  const handleSuggestionClick = (username) => {
    setShowSuggestions(false);
    if (!user) { triggerAuthGate(); return; }
    navigate(`/profile/${username}`);
  };

  const handleFollow = async (username) => {
    if (!user) { triggerAuthGate(); return; }
    try {
      const isFollowing = followingMap[username] ?? users.find(u => u.username === username)?.following;
      const isRequested = followingMap[username + '_req'] ?? users.find(u => u.username === username)?.followRequestSent;
      if (isFollowing || isRequested) {
        await API.delete(`/follow/${username}`);
        setFollowingMap(prev => ({ ...prev, [username]: false, [username + '_req']: false }));
      } else {
        const res = await API.post(`/follow/${username}`);
        const status = res.data?.status === 'requested' ? 'requested' : 'following';
        updateFollow(username, status);
        if (status === 'requested') {
          setFollowingMap(prev => ({ ...prev, [username + '_req']: true }));
        } else {
          setFollowingMap(prev => ({ ...prev, [username]: true }));
        }
      }
    } catch {}
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Search input with live suggestions */}
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative' }}>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="input-base flex-1"
              placeholder="Search people..."
              value={input}
              onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => input.trim() && setShowSuggestions(true)}
              autoFocus
            />
            <button type="submit" className="btn-primary px-5">Search</button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#fff', borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
                zIndex: 200, marginTop: 4, overflow: 'hidden',
              }}
            >
              {suggestions.slice(0, 6).map(u => (
                <div
                  key={u.username}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                  onClick={() => handleSuggestionClick(u.username)}
                >
                  <Avatar username={u.username} avatarUrl={u.avatarUrl} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>@{u.username}</div>
                  </div>
                  {u.privateProfile && (
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>🔒</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Search results */}
      {loading ? (
        <div className="p-8 text-center text-[#9ca3af]">Searching...</div>
      ) : users.length > 0 ? (
        <section>
          <h2 className="text-sm font-medium text-[#1a1a1a] mb-3">People</h2>
          <div className="flex flex-col gap-2">
            {users.map(u => {
              const isFollowing = followingMap[u.username] ?? u.following;
              const isRequestSent = followingMap[u.username + '_req'] ?? u.followRequestSent;
              return (
                <div key={u.username} className="card p-3 flex items-center gap-3">
                  <div
                    className="cursor-pointer"
                    onClick={() => user ? navigate(`/profile/${u.username}`) : triggerAuthGate()}
                  >
                    <Avatar username={u.username} avatarUrl={u.avatarUrl} size={40} />
                  </div>
                  <div
                    className="flex flex-col min-w-0 flex-1 cursor-pointer"
                    onClick={() => user ? navigate(`/profile/${u.username}`) : triggerAuthGate()}
                  >
                    <span className="text-[13px] font-medium text-[#1a1a1a]">
                      {u.name}
                      {u.privateProfile && <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 4 }}>🔒</span>}
                    </span>
                    <span className="text-[12px] text-[#9ca3af]">@{u.username}</span>
                    {u.bio && <span className="text-[12px] text-[#6b7280] mt-0.5 truncate">{u.bio}</span>}
                  </div>
                  {user && (
                    <button
                      className={`btn-outline ${isFollowing ? 'bg-white !text-[#9ca3af] border-[#e5e5e5]' : ''}`}
                      onClick={() => handleFollow(u.username)}
                    >
                      {isFollowing ? 'Following' : isRequestSent ? 'Requested' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : input.trim() && !loading ? (
        <div className="card p-8 text-center text-[#9ca3af]">
          No people found for <span className="font-medium text-[#1a1a1a]">"{input}"</span>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
