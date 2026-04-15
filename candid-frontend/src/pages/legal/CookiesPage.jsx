import React from 'react';
import { useNavigate } from 'react-router-dom';

const CookiesPage = () => {
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
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Cookie Policy</span>
      </div>

      <div className="card" style={{ padding: '28px 32px', lineHeight: 1.8, color: '#374151', fontSize: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Cookie Policy</h1>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 28 }}>Last updated: April 15, 2026</p>

        <p>This Cookie Policy explains how <strong>Candid</strong> uses cookies and similar technologies when you visit our platform. By using Candid, you agree to the use of cookies as described in this policy.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device by your web browser when you visit a website. They help the site remember information about your visit, such as your login status and preferences, making your next visit easier and the site more useful.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>2. How Candid Uses Cookies</h2>
        <p>Candid uses the following types of cookies:</p>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px', borderLeft: '3px solid #7F77DD' }}>
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>Essential Cookies</div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>These cookies are necessary for Candid to function correctly. They include your authentication token (JWT) which keeps you logged in during your session. Without these cookies, core features like logging in and posting would not work.</p>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px', borderLeft: '3px solid #7F77DD' }}>
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>Preference Cookies</div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>These cookies remember your settings and preferences on Candid, such as your UI preferences, so you don't have to re-configure them on every visit.</p>
          </div>

          <div style={{ background: '#f9fafb', borderRadius: 8, padding: '14px 16px', borderLeft: '3px solid #7F77DD' }}>
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>Performance Cookies</div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>These cookies help us understand how users interact with Candid by collecting anonymous usage data. This helps us improve the platform experience over time.</p>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>3. Local Storage</h2>
        <p>In addition to cookies, Candid uses your browser's local storage to store your authentication token and session preferences. This is essential for keeping you logged in between page refreshes.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>4. Third-Party Cookies</h2>
        <p>Candid uses Cloudinary for image hosting. When you upload images, Cloudinary may set its own cookies in accordance with its own privacy practices. We do not control third-party cookies and encourage you to review Cloudinary's privacy policy for more information.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>5. Managing Cookies</h2>
        <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
        <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>View what cookies are stored and delete them individually</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies from specific sites</li>
          <li>Block all cookies entirely</li>
        </ul>
        <p style={{ marginTop: 12 }}>Please note that disabling essential cookies will prevent you from logging in and using core features of Candid.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>6. Changes to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated date.</p>

        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginTop: 28, marginBottom: 8 }}>7. Contact Us</h2>
        <p>If you have any questions about our use of cookies, please contact us at <a href="mailto:djaya2100@gmail.com" style={{ color: '#7F77DD' }}>djaya2100@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default CookiesPage;
