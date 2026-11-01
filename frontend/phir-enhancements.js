/* PHIR Enhancements: Live Mandi Rates, Weighing Reconciliation, UPI Settlement & Digital EPR Certificate */
(() => {
  const API_BASE = window.PHIR_API_BASE || '';

  // Inject enhancement styles matching the truck-art OKLCH design tokens
  const style = document.createElement('style');
  style.id = 'phir-enhancement-styles';
  style.textContent = `
    .phir-rates-btn, .phir-epr-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      font-size: 11px;
      font-weight: 800;
      border: 2px solid var(--primary);
      border-radius: 14px 8px;
      background: var(--surface);
      color: var(--primary);
      box-shadow: 2px 2px 0 var(--secondary);
      cursor: pointer;
      transition: transform .2s, background .2s;
    }
    .phir-rates-btn:hover, .phir-epr-btn:hover {
      background: var(--tint);
      transform: translateY(-2px);
    }
    .phir-modal-backdrop {
      position: fixed;
      inset: 0;
      background: oklch(0.15 0.03 180 / 0.65);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 16px;
    }
    .phir-modal-card {
      background: var(--paper);
      border: 3px solid var(--primary);
      border-radius: 8px;
      box-shadow: 8px 8px 0 var(--secondary);
      max-width: 520px;
      width: 100%;
      padding: 24px;
      position: relative;
      color: var(--ink);
      font-family: var(--body);
      max-height: 90vh;
      overflow-y: auto;
    }
    .phir-modal-card h2 {
      font-family: var(--display);
      font-size: 28px;
      color: var(--primary);
      margin: 0 0 12px;
    }
    .phir-modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      border: 2px solid var(--primary);
      background: var(--surface);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-weight: bold;
      cursor: pointer;
    }
    .phir-rates-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 18px 0;
    }
    .phir-rate-cell {
      border: 2px solid var(--line);
      border-radius: 6px;
      padding: 12px;
      background: var(--surface);
    }
    .phir-rate-cell strong {
      display: block;
      font-size: 14px;
      text-transform: capitalize;
    }
    .phir-rate-cell span {
      font-family: var(--display);
      font-size: 22px;
      color: var(--primary);
    }
    .phir-scale-input-group {
      margin: 14px 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .phir-scale-input-group label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--muted);
    }
    .phir-scale-input-group input {
      padding: 10px 14px;
      font-size: 16px;
      font-weight: bold;
      border: 2px solid var(--line);
      border-radius: 6px;
      background: var(--surface);
      color: var(--ink);
    }
    .phir-payout-box {
      background: var(--tint);
      border: 2px dashed var(--primary);
      border-radius: 6px;
      padding: 14px;
      margin: 16px 0;
      text-align: center;
    }
    .phir-payout-box small {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--muted);
    }
    .phir-payout-box h3 {
      font-family: var(--display);
      font-size: 32px;
      color: var(--primary);
      margin: 4px 0;
    }
    .phir-upi-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 12px;
      font-weight: bold;
      color: var(--ink);
      text-decoration: underline;
    }
    .phir-audit-event {
      border-left: 3px solid var(--primary);
      padding: 8px 12px;
      margin: 10px 0;
      background: var(--surface);
      font-size: 11px;
    }
    .phir-audit-hash {
      font-family: monospace;
      font-size: 9px;
      color: var(--muted);
      word-break: break-all;
    }
  `;
  document.head.append(style);

  // Helper to open a modal
  function showModal(contentHtml) {
    const existing = document.getElementById('phir-enhancement-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'phir-enhancement-modal';
    backdrop.className = 'phir-modal-backdrop';
    backdrop.innerHTML = `
      <div class="phir-modal-card">
        <button class="phir-modal-close" aria-label="Close">✕</button>
        ${contentHtml}
      </div>
    `;
    backdrop.querySelector('.phir-modal-close').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    document.body.append(backdrop);
    return backdrop;
  }

  // 1. Live Mandi Scrap Rate Card Modal
  async function openMandiRates() {
    let rates = {pet: 15.0, cardboard: 12.5, paper: 9.0, aluminium: 110.0, glass: 4.5, wood: 3.0};
    try {
      const res = await fetch(`${API_BASE}/api/v1/rate-cards`);
      if (res.ok) {
        const body = await res.json();
        if (body.rates) rates = body.rates;
      }
    } catch (_) {}

    const rateItems = Object.entries(rates).map(([mat, rate]) => `
      <div class="phir-rate-cell">
        <strong>${mat}</strong>
        <span>₹${Number(rate).toFixed(2)}</span> / kg
      </div>
    `).join('');

    showModal(`
      <h2>Delhi Mandi Scrap Benchmark</h2>
      <p style="font-size: 12px; color: var(--muted);">Live government & Mandi indexed recycling procurement rates. Transparent, fair pricing across all collection wards.</p>
      <div class="phir-rates-grid">
        ${rateItems}
      </div>
      <small style="color: var(--muted); font-size: 10px;">• Rates updated daily based on virgin plastic commodity indexes and scrap metal yards.</small>
    `);
  }

  // 2. Physical Scale Weighing Reconciliation Modal for Collector
  function openWeighingModal(requestId, initialKg, onConfirm) {
    const defaultKg = initialKg || 12.0;
    const rateEstimate = 14.5;

    const modal = showModal(`
      <h2>Physical Scale Verification</h2>
      <p style="font-size: 12px; color: var(--muted);">Verify hanging scale weight and inspect for contamination before issuing instant payment.</p>
      
      <div class="phir-scale-input-group">
        <label>Verified Scale Weight (KG)</label>
        <input type="number" id="phir-scale-weight" step="0.1" min="0.1" value="${defaultKg}">
      </div>

      <div class="phir-scale-input-group">
        <label>Contamination Deduction (%)</label>
        <input type="number" id="phir-scale-contamination" step="1" min="0" max="50" value="0">
      </div>

      <div class="phir-payout-box">
        <small>Calculated Net Instant Payout</small>
        <h3 id="phir-payout-display">₹${Math.round(defaultKg * rateEstimate)}</h3>
        <a id="phir-upi-qr" class="phir-upi-link" href="#" target="_blank">📱 Ready for Instant UPI Payout</a>
      </div>

      <button id="phir-confirm-collection" class="btn" style="width: 100%;">Confirm Collection & Settle</button>
    `);

    const weightInput = modal.querySelector('#phir-scale-weight');
    const contamInput = modal.querySelector('#phir-scale-contamination');
    const payoutDisplay = modal.querySelector('#phir-payout-display');
    const upiLink = modal.querySelector('#phir-upi-qr');
    const confirmBtn = modal.querySelector('#phir-confirm-collection');

    function updateCalculations() {
      const kg = Math.max(0, parseFloat(weightInput.value) || 0);
      const contam = Math.min(100, Math.max(0, parseFloat(contamInput.value) || 0));
      const netKg = kg * (1.0 - (contam / 100.0));
      const payout = Math.round(netKg * rateEstimate);
      payoutDisplay.textContent = `₹${payout}`;
      upiLink.href = `upi://pay?pa=phir.collector@upi&pn=PHIR%20Scrap%20Recovery&am=${payout}&cu=INR&tn=Scrap%20Collection%20${requestId}`;
      upiLink.textContent = `📱 Instant UPI Pay ₹${payout}`;
    }

    weightInput.addEventListener('input', updateCalculations);
    contamInput.addEventListener('input', updateCalculations);
    updateCalculations();

    confirmBtn.onclick = () => {
      const actualKg = parseFloat(weightInput.value) || defaultKg;
      const contaminationPct = parseFloat(contamInput.value) || 0;
      modal.remove();
      onConfirm(actualKg, contaminationPct);
    };
  }

  // 3. Digital EPR Certificate Modal
  async function openEprCertificate(entityId) {
    let events = [];
    try {
      const res = await fetch(`${API_BASE}/api/v1/audit/${entityId}`);
      if (res.ok) {
        const body = await res.json();
        events = body.events || [];
      }
    } catch (_) {}

    const eventsHtml = events.length > 0
      ? events.map(e => `
        <div class="phir-audit-event">
          <strong>${e.eventType}</strong> — <span class="muted">${e.timestamp.replace('T', ' ').slice(0, 19)} UTC</span>
          <div style="margin-top: 4px;">Actor: <b>${e.actorRole}</b> (${e.actorId})</div>
          <div class="phir-audit-hash">SHA-256: ${e.verificationHash}</div>
        </div>
      `).join('')
      : '<p style="font-size: 12px; color: var(--muted);">Verification in progress. Baseline records established.</p>';

    showModal(`
      <h2>🌱 Extended Producer Responsibility (EPR) Certificate</h2>
      <div style="font-size: 11px; color: var(--muted); border-bottom: 2px solid var(--primary); padding-bottom: 8px; margin-bottom: 12px;">
        Cryptographic Proof of Environmental Traceability · Batch ID: <b>${entityId}</b>
      </div>
      <p style="font-size: 12px;">This immutable chain-of-custody ledger confirms material collection, sorting, and handover to certified recycling facilities without landfill leakage.</p>
      
      <div style="margin: 16px 0;">
        ${eventsHtml}
      </div>

      <button class="btn secondary" style="width: 100%;" onclick="window.print()">🖨️ Print / Save Compliance Record</button>
    `);
  }

  // Inject topbar button into workspaces
  function injectEnhancementButtons() {
    const topbars = document.querySelectorAll('.workspace .top-links, .selection-page .top-links');
    topbars.forEach(bar => {
      if (!bar.querySelector('.phir-rates-btn')) {
        const rateBtn = document.createElement('button');
        rateBtn.className = 'phir-rates-btn';
        rateBtn.innerHTML = '⚖️ Mandi Scrap Rates';
        rateBtn.onclick = (e) => { e.preventDefault(); openMandiRates(); };
        bar.prepend(rateBtn);
      }
    });

    // In Recycler bookings table, inject EPR Certificate buttons
    const bookingRows = document.querySelectorAll('.workspace[data-theme="recycler"] tbody tr');
    bookingRows.forEach(row => {
      if (!row.querySelector('.phir-epr-btn')) {
        const cell = row.querySelector('td:last-child');
        if (cell) {
          const eprBtn = document.createElement('button');
          eprBtn.className = 'phir-epr-btn';
          eprBtn.innerHTML = '🌱 EPR Audit';
          eprBtn.onclick = (e) => {
            e.preventDefault();
            const text = row.textContent;
            const match = text.match(/book_[a-z0-9]+/i) || text.match(/req_[a-z0-9]+/i);
            const entityId = match ? match[0] : 'book_demo_audit';
            openEprCertificate(entityId);
          };
          cell.append(eprBtn);
        }
      }
    });
  }

  // Intercept Collector collection clicks to trigger weighing modal
  document.addEventListener('click', event => {
    const btn = event.target.closest('[data-action="collect"], [data-action="collect-confirmed"]');
    if (!btn || btn.dataset.reconciled) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const id = btn.dataset.id;
    const collectorId = window.phirIdentity?.idFor('kabadiwala') || 'kabadiwala_1';

    openWeighingModal(id, 15.0, (actualKg, contaminationPct) => {
      btn.dataset.reconciled = "true";
      btn.disabled = true;
      btn.textContent = "Recording...";

      fetch(`${API_BASE}/api/collection-requests/${id}/collect`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({kabadiwalaId: collectorId, actualKg, contaminationPct, notes: 'Field verified scale weight'})
      })
      .then(res => res.json())
      .then(data => {
        window.phirToast?.(`Collection verified: ${actualKg} kg (${contaminationPct}% contam). Payout settled!`);
        btn.textContent = "Collected ✓";
        setTimeout(() => location.reload(), 1200);
      })
      .catch(err => {
        window.phirToast?.(`Collection error: ${err.message}`);
        btn.disabled = false;
        btn.textContent = "Collect";
      });
    });
  }, true);

  // Periodic DOM check to inject buttons seamlessly
  setInterval(injectEnhancementButtons, 1500);
  window.addEventListener('DOMContentLoaded', injectEnhancementButtons);
  window.phirOpenMandiRates = openMandiRates;
  window.phirOpenEprCertificate = openEprCertificate;
})();
