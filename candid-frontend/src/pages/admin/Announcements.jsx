import React, { useState } from 'react';
import API from '../../api/axios';

const Announcements = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setError('');
    setSuccess(false);
    try {
      await API.post('/admin/announcements', { title, message });
      setSuccess(true);
      setTitle('');
      setMessage('');
    } catch (err) {
      setError('Failed to send announcement. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="card p-6">
        <h3 className="text-sm font-medium text-[#1a1a1a] mb-1">Send Platform Announcement</h3>
        <p className="text-[12px] text-[#9ca3af] mb-5">
          This will send a notification to every user on the platform.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Title</label>
            <input
              type="text"
              className="input-base"
              placeholder="e.g. New feature available!"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#1a1a1a] mb-1.5">Message</label>
            <textarea
              className="input-base resize-none"
              rows={5}
              placeholder="Write your announcement here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && (
            <p className="text-[#0F6E56] text-xs font-medium">
              Announcement sent to all users successfully.
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send to All Users'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Announcements;
