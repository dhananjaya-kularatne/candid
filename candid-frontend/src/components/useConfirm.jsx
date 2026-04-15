import React, { useState } from 'react';

const ConfirmModal = ({ message, subMessage, confirmLabel, confirmDanger, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 3000,
    background: 'rgba(0,0,0,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      background: '#fff', borderRadius: 14, padding: '26px 24px 20px',
      width: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{message}</div>
      {subMessage && (
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{subMessage}</div>
      )}
      <button
        onClick={onConfirm}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 8, border: 'none',
          background: confirmDanger ? '#ef4444' : '#7F77DD',
          color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 4,
        }}
      >
        {confirmLabel || 'Confirm'}
      </button>
      <button
        onClick={onCancel}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 8, border: 'none',
          background: '#f3f4f6', color: '#374151',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  </div>
);

const useConfirm = () => {
  const [state, setState] = useState(null);

  const confirm = (options) =>
    new Promise((resolve) => {
      setState({ ...options, resolve });
    });

  const modal = state ? (
    <ConfirmModal
      {...state}
      onConfirm={() => { state.resolve(true); setState(null); }}
      onCancel={() => { state.resolve(false); setState(null); }}
    />
  ) : null;

  return [confirm, modal];
};

export default useConfirm;
