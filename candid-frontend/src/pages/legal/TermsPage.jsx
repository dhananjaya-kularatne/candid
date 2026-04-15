import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
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
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Terms of Service</span>
      </div>

      <div className="card" style={{ padding: '28px 32px', lineHeight: 1.8, color: '#374151', fontSize: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Terms of Service</h1>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 28 }}>Last updated: April 15, 2026</p>

        <p>By accessing or using <strong>Candid</strong>, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree, you may not use the platform.</p>
        <p style={{ marginTop: 8 }}>For questions, contact us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>1. About Candid</h2>
        <p>Candid is a personal blogging and daily-thoughts platform that allows users to write, share, and discover authentic content. You must be at least 13 years old to use Candid.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>2. Your Account</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a> if you suspect any unauthorised access to your account.</p>
        <p style={{ marginTop: 8 }}>You may not create accounts with misleading or impersonating usernames, or use Candid for any illegal purpose.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>3. Content You Post</h2>
        <p>You retain ownership of the content you post on Candid. By posting content, you grant Candid a non-exclusive, royalty-free, worldwide licence to display and distribute that content on the platform.</p>
        <p style={{ marginTop: 8 }}>You are solely responsible for your content. You agree not to post content that:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Is unlawful, harmful, threatening, abusive, or harassing</li>
          <li>Infringes any third-party intellectual property rights</li>
          <li>Contains spam, malware, or deceptive information</li>
          <li>Violates the privacy of others</li>
          <li>Is pornographic or sexually explicit in nature</li>
        </ul>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>4. Content Moderation</h2>
        <p>Candid reserves the right to remove any content or suspend any account that violates these Terms of Service, without prior notice. Decisions made by our moderation team are final.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>5. Privacy</h2>
        <p>Your use of Candid is also governed by our <a href="/privacy" style={{ color: '#7F77DD' }}>Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>6. Intellectual Property</h2>
        <p>The Candid name, logo, and platform design are the intellectual property of Candid. You may not reproduce, distribute, or create derivative works without our express written permission.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>7. Limitation of Liability</h2>
        <p>Candid is provided "as is" without warranties of any kind. To the maximum extent permitted by law, Candid shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>8. Termination</h2>
        <p>You may delete your account at any time. We reserve the right to suspend or terminate your access to Candid at our discretion if you violate these Terms.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>9. Changes to These Terms</h2>
        <p>We may update these Terms from time to time. Continued use of Candid after changes are posted constitutes your acceptance of the updated Terms.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>10. Contact</h2>
        <p>For any questions about these Terms, email us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default TermsPage;
