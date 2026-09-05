// maintenance-check.js
// Add this as the FIRST script on every public page (before any other JS).
// It checks the backend for maintenance mode and shows a full-screen overlay
// if the site is under maintenance. Admin pages are automatically excluded.

(async function checkMaintenanceMode() {
    // Skip for admin panel pages
    if (window.location.pathname.includes('/admin')) return;

    const API_BASE = 'https://floristbackend.onrender.com/api';

    try {
        const res = await fetch(`${API_BASE}/status`);
        if (!res.ok) return; // backend unreachable — fail open, don't block users
        const data = await res.json();
        if (data.maintenanceMode) {
            showMaintenanceOverlay(data.maintenanceMessage);
        }
    } catch (e) {
        // Network failure — fail open
        console.warn('[Friends Florist] Maintenance check failed:', e);
    }
})();

function showMaintenanceOverlay(message) {
    document.documentElement.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.id = 'ff-maintenance-overlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:999999',
        'display:flex', 'align-items:center', 'justify-content:center',
        'background:linear-gradient(135deg,#0d1d15 0%,#1e3f2d 50%,#0d1d15 100%)',
        "font-family:'Poppins',sans-serif", 'text-align:center', 'padding:2rem'
    ].join(';');

    overlay.innerHTML = `
        <div style="max-width:560px;width:100%;">
            <div style="font-size:80px;margin-bottom:1.5rem;animation:ff-spin 8s linear infinite;display:inline-block;">🌸</div>

            <h1 style="
                font-family:'Playfair Display','Georgia',serif;
                font-size:clamp(1.8rem,5vw,2.8rem);
                font-weight:700;color:#fff;
                margin:0 0 1rem;line-height:1.2;">
                We'll Be Back Soon
            </h1>

            <div style="
                width:80px;height:3px;
                background:linear-gradient(90deg,#D4AF37,#F5E6C8,#D4AF37);
                border-radius:4px;margin:0 auto 1.5rem;">
            </div>

            <p style="color:#B2C9AD;font-size:1rem;line-height:1.7;margin:0 0 2rem;">
                ${message || "We're performing some scheduled maintenance right now. We'll be back shortly!"}
            </p>

            <div style="
                display:inline-flex;align-items:center;gap:0.5rem;
                background:rgba(245,230,200,0.08);
                border:1px solid rgba(245,230,200,0.25);
                border-radius:999px;padding:0.5rem 1.25rem;
                color:#F5E6C8;font-size:0.8rem;font-weight:600;letter-spacing:0.05em;">
                <span style="
                    width:8px;height:8px;border-radius:50%;background:#D4AF37;
                    display:inline-block;animation:ff-pulse 1.5s ease-in-out infinite;">
                </span>
                MAINTENANCE IN PROGRESS
            </div>

            <p style="margin-top:3rem;color:rgba(178,201,173,0.5);font-size:0.75rem;letter-spacing:0.1em;">
                🌹 FRIENDS FLORIST
            </p>
        </div>

        <style>
            @keyframes ff-spin  { to { transform: rotate(360deg); } }
            @keyframes ff-pulse {
                0%,100% { opacity:1; transform:scale(1); }
                50%      { opacity:0.5; transform:scale(0.85); }
            }
        </style>
    `;

    const attach = () => document.body.appendChild(overlay);
    document.body ? attach() : document.addEventListener('DOMContentLoaded', attach);
}
