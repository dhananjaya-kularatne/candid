import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4">
      <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6b7280', lineHeight: 1 }}
        >
          ←
        </button>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Privacy Policy</span>
      </div>

      <div className="card" style={{ padding: '28px 32px', lineHeight: 1.8, color: '#374151', fontSize: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Privacy Policy</h1>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 28 }}>Last updated: April 15, 2026</p>

        <p>Welcome to <strong>Candid</strong>. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.</p>
        <p>If you have any questions, please contact us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>1. Information We Collect</h2>
        <p>We collect information you provide directly when you:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Create an account (name, username, email, password)</li>
          <li>Update your profile (bio, avatar, banner image)</li>
          <li>Create posts, comments, or interact with content</li>
          <li>Follow other users or send follow requests</li>
        </ul>
        <p style={{ marginTop: 12 }}>We also automatically collect certain technical information such as your IP address, browser type, and device information when you access Candid.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Provide, operate, and maintain the Candid platform</li>
          <li>Allow you to create and share posts, follow others, and engage with content</li>
          <li>Send notifications about activity on your account</li>
          <li>Respond to your comments, questions, and support requests</li>
          <li>Detect and prevent fraudulent or abusive activity</li>
          <li>Improve and personalise your experience on Candid</li>
        </ul>
        <p style={{ marginTop: 12 }}>We do <strong>not</strong> sell your personal information to third parties.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>3. Information Sharing</h2>
        <p>Your public profile information (name, username, bio, public posts) is visible to other users on Candid. If you set your account to private, your posts are only visible to your approved followers.</p>
        <p style={{ marginTop: 8 }}>We may share your information with trusted third-party service providers (such as Cloudinary for image hosting) solely to operate the platform. These providers are contractually obligated to protect your data.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>4. Data Retention</h2>
        <p>We retain your account information for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>5. Security</h2>
        <p>We take reasonable technical and organisational measures to protect your information against unauthorised access, loss, or misuse. Passwords are stored using industry-standard bcrypt hashing and are never stored in plain text.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate or incomplete information via your profile settings</li>
          <li>Delete your account and associated data</li>
          <li>Opt out of non-essential communications</li>
        </ul>
        <p style={{ marginTop: 12 }}>To exercise any of these rights, contact us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>7. Children's Privacy</h2>
        <p>Candid is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the date above.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>9. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, please reach out to us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
