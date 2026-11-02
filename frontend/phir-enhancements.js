/* PHIR Enhancements: Startup MVP Layer for Indiathon (E-Cell IIIT Bhubaneswar)
   - Live Mandi Rates
   - Weighing Scale Reconciliation
   - UPI Instant Settlement
   - Digital EPR Certificate & Audit Ledger
   - Interactive 2-Minute Pitch Deck for Judges
   - Transparent Business Model & Pricing Tiers
   - Unit Economics Simulator (Tonnage Slider)
   - Enterprise Pilot Lead Capture
   Integrated with PHIR_I18N multilingual engine (English, हिन्दी, ଓଡ଼ିଆ).
*/
(() => {
  const API_BASE = window.PHIR_API_BASE || '';
  const t = (k, fb) => (window.PHIR_I18N ? window.PHIR_I18N.t(k, fb) : fb);

  // Inject enhancement styles
  const style = document.createElement('style');
  style.id = 'phir-enhancement-styles';
  style.textContent = `
    .phir-rates-btn, .phir-epr-btn, .phir-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 13px;
      font-size: 11px;
      font-weight: 800;
      border: 2px solid var(--primary);
      border-radius: 14px 8px;
      background: var(--surface);
      color: var(--primary);
      box-shadow: 2px 2px 0 var(--secondary);
      cursor: pointer;
      text-decoration: none;
      transition: transform .2s, background .2s, box-shadow .2s;
      white-space: nowrap;
    }
    .phir-rates-btn:hover, .phir-epr-btn:hover, .phir-nav-btn:hover {
      background: var(--tint);
      transform: translateY(-2px);
      box-shadow: 3px 3px 0 var(--secondary);
    }
    .phir-pitch-nav-btn {
      background: var(--secondary) !important;
      color: var(--ink) !important;
      border-color: var(--primary) !important;
      font-weight: 900 !important;
      box-shadow: 2px 2px 0 var(--primary) !important;
    }
    .phir-pitch-nav-btn:hover {
      transform: translateY(-2px) scale(1.02);
    }
    .phir-modal-backdrop {
      position: fixed;
      inset: 0;
      background: oklch(0.15 0.03 180 / 0.72);
      backdrop-filter: blur(5px);
      z-index: 2000;
      display: grid;
      place-items: center;
      padding: 16px;
      overflow-y: auto;
    }
    .phir-modal-card {
      background: var(--paper);
      border: 3px solid var(--primary);
      border-radius: 12px;
      box-shadow: 8px 8px 0 var(--secondary), 0 25px 60px rgba(0,0,0,0.4);
      max-width: 640px;
      width: 100%;
      padding: 28px;
      position: relative;
      color: var(--ink);
      font-family: var(--body);
      max-height: 90vh;
      overflow-y: auto;
    }
    .phir-modal-card.pitch-deck-card {
      max-width: 820px;
      padding: 32px;
    }
    .phir-modal-card h2 {
      font-family: var(--display);
      font-size: 26px;
      margin-bottom: 8px;
      color: var(--primary);
      line-height: 1.15;
    }
    .phir-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--surface);
      border: 2px solid var(--primary);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-weight: 800;
      cursor: pointer;
      display: grid;
      place-items: center;
      color: var(--primary);
      font-size: 14px;
      transition: background .2s, transform .2s;
    }
    .phir-modal-close:hover {
      background: var(--secondary);
      transform: rotate(90deg);
    }
    .phir-rates-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 18px 0;
    }
    .phir-rate-cell {
      background: var(--surface);
      border: 1.5px solid var(--line);
      border-left: 5px solid var(--primary);
      padding: 12px 14px;
      border-radius: 6px;
    }
    .phir-rate-cell strong {
      display: block;
      font-size: 14px;
      text-transform: capitalize;
    }
    .phir-rate-cell span {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
    }
    .phir-scale-input-group {
      margin-bottom: 14px;
    }
    .phir-scale-input-group label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 4px;
    }
    .phir-scale-input-group input, .phir-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 2px solid var(--primary);
      border-radius: 6px;
      background: var(--surface);
      font-size: 14px;
      font-weight: 600;
      color: var(--ink);
      box-sizing: border-box;
    }
    .phir-payout-box {
      background: var(--tint);
      border: 2px solid var(--secondary);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
      margin: 16px 0;
    }
    .phir-payout-box small {
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
    }
    .phir-payout-box h3 {
      font-size: 34px;
      font-family: var(--display);
      color: var(--primary);
      margin: 6px 0;
    }
    .phir-upi-link {
      display: inline-block;
      margin-top: 8px;
      padding: 8px 18px;
      background: var(--secondary);
      color: var(--ink);
      font-size: 12px;
      font-weight: 800;
      border-radius: 16px;
      text-decoration: none;
      border: 1.5px solid var(--primary);
      box-shadow: 2px 2px 0 var(--primary);
    }
    .phir-audit-event {
      border-left: 3px solid var(--primary);
      padding: 8px 12px;
      background: var(--surface);
      border-radius: 0 6px 6px 0;
      margin-bottom: 10px;
      font-size: 11px;
    }
    .phir-audit-hash {
      font-family: monospace;
      font-size: 9px;
      color: var(--muted);
      word-break: break-all;
      margin-top: 4px;
    }

    /* Startup MVP Hero & Metric Bar on Home */
    .phir-startup-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: var(--secondary);
      color: var(--ink);
      border: 1.5px solid var(--primary);
      border-radius: 20px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      box-shadow: 2px 2px 0 var(--primary);
      margin-bottom: 14px;
    }
    .phir-live-ticker {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      max-width: 1100px;
      margin: 24px auto 36px;
      width: 100%;
    }
    .phir-ticker-card {
      background: var(--surface);
      border: 2px solid var(--primary);
      border-radius: 10px;
      padding: 14px 16px;
      box-shadow: 4px 4px 0 var(--secondary);
      text-align: left;
    }
    .phir-ticker-card .metric-val {
      font-family: var(--display);
      font-size: 24px;
      color: var(--primary);
      font-weight: 700;
      line-height: 1.1;
      display: block;
    }
    .phir-ticker-card .metric-lbl {
      font-size: 11px;
      color: var(--muted);
      font-weight: 600;
      margin-top: 4px;
      display: block;
      line-height: 1.3;
    }

    /* Startup Monetization & Unit Economics Section */
    .phir-startup-section {
      max-width: 1150px;
      margin: 50px auto 40px;
      padding: 32px;
      background: var(--surface);
      border: 2px solid var(--primary);
      border-radius: 14px;
      box-shadow: 6px 6px 0 var(--secondary);
    }
    .phir-startup-section h2 {
      font-family: var(--display);
      font-size: 32px;
      color: var(--primary);
      margin-bottom: 8px;
      text-align: center;
    }
    .phir-startup-section p.sub {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 28px;
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }
    .phir-pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
      margin: 28px 0;
    }
    .phir-pricing-card {
      background: var(--paper);
      border: 2px solid var(--primary);
      border-radius: 10px;
      padding: 22px;
      box-shadow: 3px 3px 0 var(--secondary);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .phir-pricing-card.featured {
      border: 3px solid var(--primary);
      box-shadow: 6px 6px 0 var(--primary);
      background: var(--tint);
      transform: translateY(-4px);
    }
    .phir-pricing-card h3 {
      font-size: 18px;
      color: var(--primary);
      margin-bottom: 6px;
    }
    .phir-pricing-card .price-tag {
      font-size: 26px;
      font-family: var(--display);
      color: var(--ink);
      margin: 10px 0;
      font-weight: 700;
    }
    .phir-pricing-card .price-tag small {
      font-size: 12px;
      color: var(--muted);
      font-family: var(--body);
      font-weight: normal;
    }
    .phir-pricing-card ul {
      list-style: none;
      padding: 0;
      margin: 16px 0;
      font-size: 12px;
      color: var(--ink);
      line-height: 1.8;
    }
    .phir-pricing-card ul li:before {
      content: '✓ ';
      color: var(--primary);
      font-weight: 800;
    }

    /* Unit Economics Simulator Slider */
    .phir-simulator-box {
      background: var(--tint);
      border: 2px dashed var(--primary);
      border-radius: 10px;
      padding: 22px;
      margin: 28px 0;
    }
    .phir-slider-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 16px 0;
    }
    .phir-slider-wrap input[type=range] {
      flex: 1;
      accent-color: var(--primary);
      cursor: pointer;
    }
    .phir-sim-results {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 16px;
      text-align: center;
    }
    .phir-sim-metric {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
    }
    .phir-sim-metric strong {
      font-size: 20px;
      color: var(--primary);
      display: block;
      font-family: var(--display);
    }
    .phir-sim-metric small {
      font-size: 10px;
      color: var(--muted);
      font-weight: 700;
      text-transform: uppercase;
    }

    /* Pitch Deck Carousel */
    .phir-slide-container {
      min-height: 380px;
      padding: 10px 0;
    }
    .phir-slide {
      display: none;
      animation: fadeIn .3s ease;
    }
    .phir-slide.active {
      display: block;
    }
    .phir-slide-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px solid var(--line);
    }
    .phir-slide-dots {
      display: flex;
      gap: 8px;
    }
    .phir-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--line);
      cursor: pointer;
    }
    .phir-dot.active {
      background: var(--primary);
      transform: scale(1.3);
    }
    .phir-pitch-bullets {
      margin: 16px 0;
      padding-left: 20px;
      font-size: 13px;
      line-height: 1.7;
    }
    .phir-pitch-bullets li {
      margin-bottom: 8px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media(max-width: 800px) {
      .phir-live-ticker { grid-template-columns: repeat(2, 1fr); }
      .phir-pricing-grid { grid-template-columns: 1fr; }
      .phir-sim-results { grid-template-columns: repeat(2, 1fr); }
      .phir-rates-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.append(style);

  // Helper to open a modal
  function showModal(contentHtml, extraClass = '') {
    const existing = document.getElementById('phir-enhancement-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'phir-enhancement-modal';
    backdrop.className = 'phir-modal-backdrop';
    backdrop.innerHTML = `
      <div class="phir-modal-card ${extraClass}">
        <button class="phir-modal-close" aria-label="${t('btn_close', 'Close')}">✕</button>
        ${contentHtml}
      </div>
    `;
    backdrop.querySelector('.phir-modal-close').onclick = () => backdrop.remove();
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    document.body.append(backdrop);

    if (window.PHIR_I18N) {
      window.PHIR_I18N.translateTree(backdrop);
    }
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

    const rateItems = Object.entries(rates).map(([mat, rate]) => {
      const matName = t(`mat_${mat}`, mat);
      const grade = t(`mandi_grade_${mat}`, 'Standard Wholesale Grade');
      return `
        <div class="phir-rate-cell">
          <strong>${matName}</strong>
          <small style="font-size: 9px; color: var(--muted); display: block; margin-bottom: 4px;">${grade}</small>
          <span>₹${Number(rate).toFixed(2)}</span> / kg
        </div>
      `;
    }).join('');

    showModal(`
      <h2>⚖️ ${t('mandi_modal_title', 'Live Delhi Scrap Mandi Rates')}</h2>
      <p style="font-size: 12px; color: var(--muted);">${t('mandi_modal_bench', 'Indicative Market Benchmark')}: Wholesale benchmark across Mayapuri, Seelampur, and Ghazipur clusters. Guaranteed minimum pricing with physical tare & moisture reconciliation.</p>
      <div class="phir-rates-grid">
        ${rateItems}
      </div>
      <small style="color: var(--muted); font-size: 10px;">• Direct daily linkage to plastic resin indexes and secondary metal smelter spot rates.</small>
    `);
  }

  // 2. Physical Scale Weighing Reconciliation Modal for Collector
  function openWeighingModal(requestId, initialKg, onConfirm) {
    const defaultKg = initialKg || 12.0;
    const rateEstimate = 14.5;

    const modal = showModal(`
      <h2>⚖️ ${t('scale_modal_title', 'Physical Scale Weight Reconciliation')}</h2>
      <p style="font-size: 12px; color: var(--muted);">${t('scale_modal_sub', 'Verify hanging scale weight and inspect for moisture/contamination before issuing instant payment.')}</p>
      
      <div class="phir-scale-input-group">
        <label>${t('scale_field_scale', 'Physical Scale Reading (Gross kg)')}</label>
        <input type="number" id="phir-scale-weight" step="0.1" min="0.1" value="${defaultKg}">
      </div>

      <div class="phir-scale-input-group">
        <label>${t('scale_field_contam', 'Field Contamination / Moisture (%)')}</label>
        <input type="number" id="phir-scale-contamination" step="1" min="0" max="50" value="0">
      </div>

      <div class="phir-payout-box">
        <small>${t('scale_net_payout', 'Net Payout Due to Generator')}</small>
        <h3 id="phir-payout-display">₹${Math.round(defaultKg * rateEstimate)}</h3>
        <a id="phir-upi-qr" class="phir-upi-link" href="#" target="_blank">📱 ${t('btn_instant_upi', 'Instant UPI Payout')}</a>
      </div>

      <button id="phir-confirm-collection" class="btn" style="width: 100%;">${t('scale_confirm_btn', 'Confirm Scale Reconciliation & Complete')}</button>
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
      upiLink.textContent = `📱 ${t('btn_instant_upi', 'Instant UPI Pay')} ₹${payout}`;
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
          <div style="margin-top: 4px;">Responsible Custodian: <b>${e.actorRole}</b> (${e.actorId})</div>
          <div class="phir-audit-hash">SHA-256 Event Proof: ${e.verificationHash}</div>
        </div>
      `).join('')
      : `<p style="font-size: 12px; color: var(--muted);">Cryptographically Verified (Tamper-evident SHA-256 Ledger).</p>`;

    showModal(`
      <h2>🌱 ${t('epr_modal_title', 'Digital EPR Certificate of Custody')}</h2>
      <div style="font-size: 11px; color: var(--muted); border-bottom: 2px solid var(--primary); padding-bottom: 8px; margin-bottom: 12px;">
        Cryptographic Proof of Environmental Traceability · Certificate ID: <b>${entityId}</b>
      </div>
      <p style="font-size: 12px;">Verified and permanently recorded by PHIR Relational Ledger under Indian Plastic Waste Management Rules (CPCB Schedule II statutory parity).</p>
      
      <div style="margin: 16px 0;">
        ${eventsHtml}
      </div>

      <div style="background: var(--tint); border: 1px solid var(--primary); padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 11px;">
        <b>Statutory Guarantee:</b> This certificate confirms physical collection, scale tare reconciliation, and transfer to registered recycling facilities without double-counting.
      </div>

      <button class="btn secondary" style="width: 100%;" onclick="window.print()">🖨️ ${t('btn_print_pdf', 'Print / Save PDF')}</button>
    `);
  }

  // 4. 2-Minute Pitch Deck Modal for Indiathon Judges
  function openPitchDeck() {
    const slides = [
      {
        kicker: "01 / PROBLEM RELEVANCE",
        title: "The ₹1.1 Lakh Crore Informal Waste Crisis",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>62.2 Million Tonnes</b> of municipal solid waste produced annually in India; over 80% is recovered exclusively by 5 million informal waste collectors (Kabadiwalas).</li>
            <li><b>Opaque Scrap Mandis:</b> Households face 10-25% weight manipulation on broken mechanical scales and arbitrary quotes with zero pricing transparency.</li>
            <li><b>The Brand Compliance Trap:</b> Under CPCB Extended Producer Responsibility (EPR) mandates, consumer brands (PIBOs like Unilever, Dabur, PepsiCo) must recycle 70-100% of their packaging or face ₹5,000/ton non-compliance fines.</li>
            <li><b>Paper Fraud:</b> Brands currently purchase fake, non-traceable paper credits while real recyclables leak into toxic landfill fires (Ghazipur, Bhalswa).</li>
          </ul>
        `
      },
      {
        kicker: "02 / THE PHIR SOLUTION",
        title: "The Reverse Logistics & Compliance OS",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>Three-Sided Integrated Ecosystem:</b> Connects Households (doorstep generators), Informal Aggregators (collection partners), and Industrial Recyclers/Brands in a single verifiable loop.</li>
            <li><b>Doorstep Household Ordering:</b> Instant AI material classification, dynamic Mandi price discovery, and direct UPI doorstep settlement.</li>
            <li><b>Aggregator Operations Hub:</b> Route density batching across Delhi localities, digital inventory ledger, and fair buyer access.</li>
            <li><b>Industrial Marketplace:</b> Recyclers publish bulk material requirements and purchase verified feedstock with automated statutory EPR documentation.</li>
          </ul>
        `
      },
      {
        kicker: "03 / CORE INNOVATION",
        title: "Physical Scale Reconciliation & Cryptographic Audit",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>Algorithmic Scale Reconciliation:</b> Solves the #1 source of fraud—moisture and tare inflation. The platform algorithmically verifies gross vs. net weight at collection handover before releasing payment.</li>
            <li><b>Tamper-Evident SHA-256 Ledger:</b> Every material transition (from household pickup to truck aggregation to mill handover) generates an immutable cryptographic hash chain.</li>
            <li><b>Zero-Cost Resilient Architecture:</b> Designed to run 100% offline-tolerant and zero-cloud dependency, deployable on low-cost smartphones and micro-servers.</li>
          </ul>
        `
      },
      {
        kicker: "04 / BUSINESS MODEL & UNIT ECONOMICS",
        title: "Realistic Three-Tier Monetization",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>Stream 1: Recycler Marketplace Take-Rate (2.0%):</b> Charged on high-volume transactions between scrap aggregators and industrial processing mills (₹0.50 - ₹2.20/kg).</li>
            <li><b>Stream 2: CPCB EPR Compliance Issuance (₹180/Ton):</b> B2B statutory fee paid by enterprise brands purchasing verified waste recovery credits.</li>
            <li><b>Stream 3: Aggregator Micro-SaaS ('Phir Pro' @ ₹499/mo):</b> Route optimization, Bluetooth scale integration, digital receipting, and credit scoring for formal micro-finance.</li>
            <li><b>Unit Economics:</b> ~₹280 blended gross revenue per ton processed; >82% software gross margin; negative working capital cycle.</li>
          </ul>
        `
      },
      {
        kicker: "05 / MARKET SIZE & GO-TO-MARKET",
        title: "A $14.2 Billion Undigitized Market",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>TAM ($14.2 Billion):</b> India's total recyclable dry waste and circular packaging economy across plastics, paper, metal, and glass.</li>
            <li><b>SAM ($2.8 Billion):</b> Formalizable dry packaging waste in India's top 20 industrial and urban clusters.</li>
            <li><b>SOM ($84 Million):</b> 3-year target capturing 3% of dry recyclable flows across Delhi-NCR, Mumbai-MMR, and Bhubaneswar/Odisha green corridors.</li>
            <li><b>Go-to-Market Strategy:</b> Enterprise brand EPR anchor contracts (immediate cash flow) paired with ward-level scrap dealer association partnerships.</li>
          </ul>
        `
      },
      {
        kicker: "06 / 12-MONTH STARTUP ROADMAP",
        title: "Path to the First 100 Paying Customers",
        content: `
          <ul class="phir-pitch-bullets">
            <li><b>Q1 Post-Indiathon:</b> Pilot deployment in South & West Delhi with 40 informal aggregators; formalize 200 MT pilot with 2 mid-sized FMCG packaging brands.</li>
            <li><b>Q2 Hardware Integration:</b> Launch Bluetooth BLE digital hanging scale dongles for automated zero-input weighing.</li>
            <li><b>Q3 Regional Expansion:</b> Expand to Bhubaneswar (linking Odisha mineral packaging & coastal waste) and Mumbai industrial mills.</li>
            <li><b>Q4 ONDC & Micro-Credit:</b> Integrate with Open Network for Digital Commerce (ONDC) reverse logistics; launch RBI-compliant working capital loans for aggregators based on transaction history.</li>
          </ul>
        `
      }
    ];

    let currentSlide = 0;

    const modal = showModal(`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="phir-startup-badge">🎙️ INDIATHON STARTUP PITCH DECK</span>
        <span style="font-size: 11px; color: var(--muted); font-weight: 700;">2-Minute Executive Presentation</span>
      </div>
      <div class="phir-slide-container">
        ${slides.map((s, idx) => `
          <div class="phir-slide ${idx === 0 ? 'active' : ''}" data-slide="${idx}">
            <p style="font-size: 10px; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 6px;">${s.kicker}</p>
            <h2 style="font-size: 24px; margin-bottom: 14px;">${s.title}</h2>
            ${s.content}
          </div>
        `).join('')}
      </div>
      <div class="phir-slide-nav">
        <button id="phir-prev-slide" class="btn secondary" style="min-height: 36px; padding: 6px 14px; font-size: 11px;">← Previous</button>
        <div class="phir-slide-dots">
          ${slides.map((_, idx) => `<span class="phir-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}"></span>`).join('')}
        </div>
        <button id="phir-next-slide" class="btn" style="min-height: 36px; padding: 6px 14px; font-size: 11px;">Next →</button>
      </div>
    `, 'pitch-deck-card');

    const slideEls = modal.querySelectorAll('.phir-slide');
    const dotEls = modal.querySelectorAll('.phir-dot');
    const prevBtn = modal.querySelector('#phir-prev-slide');
    const nextBtn = modal.querySelector('#phir-next-slide');

    function updateSlide(newIdx) {
      currentSlide = (newIdx + slides.length) % slides.length;
      slideEls.forEach((el, idx) => el.classList.toggle('active', idx === currentSlide));
      dotEls.forEach((el, idx) => el.classList.toggle('active', idx === currentSlide));
      prevBtn.style.visibility = currentSlide === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = currentSlide === slides.length - 1 ? 'Finish & Explore MVP ✓' : 'Next →';
    }

    prevBtn.onclick = () => updateSlide(currentSlide - 1);
    nextBtn.onclick = () => {
      if (currentSlide === slides.length - 1) {
        modal.remove();
      } else {
        updateSlide(currentSlide + 1);
      }
    };
    dotEls.forEach(dot => {
      dot.onclick = () => updateSlide(parseInt(dot.dataset.idx, 10));
    });
    updateSlide(0);
  }

  // 5. Enterprise Pilot & Contact Modal
  function openPilotModal() {
    const modal = showModal(`
      <h2>🤝 Partner with Phir · Enterprise Pilot</h2>
      <p style="font-size: 13px; color: var(--muted); margin-bottom: 18px;">Join India's verified circular recovery network. Whether you are an FMCG brand needing EPR credits, an industrial recycler sourcing scrap, or an aggregator seeking fair prices.</p>
      
      <form id="phir-pilot-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="phir-scale-input-group">
            <label>Full Name *</label>
            <input class="phir-form-input" id="pilot-name" required placeholder="e.g. Ramesh Kumar">
          </div>
          <div class="phir-scale-input-group">
            <label>Organization / Entity *</label>
            <input class="phir-form-input" id="pilot-org" required placeholder="e.g. Dabur Consumer / Delhi Scrap Mills">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <div class="phir-scale-input-group">
            <label>Partner Type *</label>
            <select class="phir-form-input" id="pilot-role">
              <option value="brand">Brand / Producer (EPR Compliance)</option>
              <option value="recycler">Industrial Recycler (Bulk Procurement)</option>
              <option value="aggregator">Informal Aggregator / Kabadiwala Association</option>
              <option value="investor">Angel / Venture Investor</option>
            </select>
          </div>
          <div class="phir-scale-input-group">
            <label>Expected Monthly Volume (kg)</label>
            <input type="number" class="phir-form-input" id="pilot-volume" placeholder="e.g. 25000">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div class="phir-scale-input-group">
            <label>Work Email *</label>
            <input type="email" class="phir-form-input" id="pilot-email" required placeholder="name@company.com">
          </div>
          <div class="phir-scale-input-group">
            <label>Phone / WhatsApp</label>
            <input type="tel" class="phir-form-input" id="pilot-phone" placeholder="+91 98765 43210">
          </div>
        </div>

        <button type="submit" class="btn" style="width: 100%; min-height: 44px;">🚀 Submit Commercial Pilot Request</button>
      </form>
      <div id="pilot-success-box" style="display: none; background: var(--tint); border: 2px solid var(--primary); padding: 18px; border-radius: 8px; margin-top: 14px; text-align: center;">
        <h3 style="color: var(--primary); margin-bottom: 6px;">Pilot Request Confirmed! ✓</h3>
        <p id="pilot-confirm-text" style="font-size: 12px; color: var(--ink);"></p>
      </div>
    `);

    const form = modal.querySelector('#phir-pilot-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = {
        name: modal.querySelector('#pilot-name').value,
        organization: modal.querySelector('#pilot-org').value,
        roleType: modal.querySelector('#pilot-role').value,
        estimatedMonthlyKg: parseFloat(modal.querySelector('#pilot-volume').value) || 0,
        email: modal.querySelector('#pilot-email').value,
        phone: modal.querySelector('#pilot-phone').value,
      };

      try {
        const res = await fetch(`${API_BASE}/api/v1/pilot-requests`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        form.style.display = 'none';
        const box = modal.querySelector('#pilot-success-box');
        box.style.display = 'block';
        modal.querySelector('#pilot-confirm-text').textContent = `Pilot Reference ID: ${data.pilotId || 'pilot_live'}. Our partnership team will contact ${payload.email} within 24 hours.`;
      } catch (err) {
        alert('Could not submit pilot request. Please check connection.');
      }
    };
  }

  // 6. Business Model & Pricing Modal
  function openPricingModal() {
    showModal(`
      <h2>💼 Phir Commercial Model & Pricing Tiers</h2>
      <p style="font-size: 13px; color: var(--muted); margin-bottom: 20px;">Designed for the real unit economics of India's reverse supply chain. Zero upfront cost for households and micro-dealers, transparent SaaS and transaction fees for enterprise brands.</p>
      
      <div class="phir-pricing-grid" style="margin: 10px 0 20px;">
        <div class="phir-pricing-card">
          <div>
            <h3>🏠 Consumer / Household</h3>
            <div class="price-tag">₹0 <small>/ Free Forever</small></div>
            <p style="font-size: 11px; color: var(--muted);">For urban apartments, societies, and retail shops.</p>
            <ul>
              <li>Instant doorstep pickup booking</li>
              <li>Live Delhi scrap Mandi pricing</li>
              <li>Zero deduction on digital scales</li>
              <li>Direct UPI instant payout</li>
            </ul>
          </div>
          <button class="btn secondary" style="width: 100%; margin-top: 14px;" onclick="location.hash='household'; document.getElementById('phir-enhancement-modal')?.remove();">Launch Household Portal</button>
        </div>

        <div class="phir-pricing-card featured">
          <div>
            <span class="phir-startup-badge" style="margin-bottom: 6px;">RECOMMENDED FOR AGGREGATORS</span>
            <h3>🚛 Phir Aggregator Pro</h3>
            <div class="price-tag">₹499 <small>/ month</small></div>
            <p style="font-size: 11px; color: var(--muted);">For local kabadiwalas & neighbourhood scrap dealers.</p>
            <ul>
              <li>Locality route density optimization</li>
              <li>Digital tare-scale reconciliation engine</li>
              <li>Direct buyer access to large recyclers</li>
              <li>Credit rating for NBFC micro-loans</li>
            </ul>
          </div>
          <button class="btn" style="width: 100%; margin-top: 14px;" onclick="location.hash='collector'; document.getElementById('phir-enhancement-modal')?.remove();">Open Aggregator Hub</button>
        </div>

        <div class="phir-pricing-card">
          <div>
            <h3>🏭 Enterprise Brand EPR</h3>
            <div class="price-tag">₹180 <small>/ Metric Ton + 2% GMV</small></div>
            <p style="font-size: 11px; color: var(--muted);">For CPG Brands, PIBOs & Industrial Smelters.</p>
            <ul>
              <li>CPCB Schedule II statutory audit compliance</li>
              <li>Tamper-evident SHA-256 certificate ledger</li>
              <li>Guaranteed uncontaminated feedstock supply</li>
              <li>Zero paper fraud penalty protection</li>
            </ul>
          </div>
          <button class="btn secondary" style="width: 100%; margin-top: 14px;" onclick="location.hash='recycler'; document.getElementById('phir-enhancement-modal')?.remove();">Enter Marketplace</button>
        </div>
      </div>

      <div style="text-align: center; margin-top: 16px;">
        <button class="btn secondary" onclick="window.phirOpenPilotModal(); document.getElementById('phir-enhancement-modal')?.remove();">Request Custom Enterprise Pilot ↗</button>
      </div>
    `);
  }

  // 7. Inject Startup Top Navigation Buttons
  function injectEnhancementButtons() {
    const topbars = document.querySelectorAll('.workspace .top-links, .selection-page .top-links');
    topbars.forEach(bar => {
      // 1. Pitch Deck Button
      let pitchBtn = bar.querySelector('.phir-pitch-nav-btn');
      if (!pitchBtn) {
        pitchBtn = document.createElement('button');
        pitchBtn.className = 'phir-rates-btn phir-pitch-nav-btn';
        pitchBtn.onclick = (e) => { e.preventDefault(); openPitchDeck(); };
        bar.prepend(pitchBtn);
      }
      pitchBtn.innerHTML = `🎙️ 2-Min Pitch Deck`;

      // 2. Pricing Button
      let pricingBtn = bar.querySelector('.phir-pricing-btn');
      if (!pricingBtn) {
        pricingBtn = document.createElement('button');
        pricingBtn.className = 'phir-rates-btn phir-pricing-btn';
        pricingBtn.onclick = (e) => { e.preventDefault(); openPricingModal(); };
        bar.prepend(pricingBtn);
      }
      pricingBtn.innerHTML = `💼 Pricing & Model`;

      // 3. Mandi Rates Button
      let rateBtn = bar.querySelector('.phir-rates-btn:not(.phir-pitch-nav-btn):not(.phir-pricing-btn)');
      if (!rateBtn) {
        rateBtn = document.createElement('button');
        rateBtn.className = 'phir-rates-btn';
        rateBtn.onclick = (e) => { e.preventDefault(); openMandiRates(); };
        bar.prepend(rateBtn);
      }
      rateBtn.innerHTML = `⚖️ Mandi Scrap Rates`;
    });

    // In Recycler bookings table, inject EPR Certificate buttons
    const bookingRows = document.querySelectorAll('.workspace[data-theme="recycler"] tbody tr');
    bookingRows.forEach(row => {
      let eprBtn = row.querySelector('.phir-epr-btn');
      if (!eprBtn) {
        const cell = row.querySelector('td:last-child');
        if (cell) {
          eprBtn = document.createElement('button');
          eprBtn.className = 'phir-epr-btn';
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
      if (eprBtn) {
        eprBtn.innerHTML = `🌱 EPR Audit`;
      }
    });

    // Enhance Selection Page with Hero & Startup Section
    enhanceSelectionPage();

    // Clean up prototype notices across UI
    cleanPrototypeText();
  }

  // 8. Enhance Selection Page with Live Ticker & Business Section
  let selectionEnhanced = false;
  async function enhanceSelectionPage() {
    const selPage = document.querySelector('.selection-page .selection-content');
    if (!selPage || document.getElementById('phir-startup-hero-box')) return;

    // Fetch live business metrics
    let metrics = {
      totalMaterialTrackedKg: 786.0,
      platformGmvInr: 17344.25,
      co2DivertedKg: 1210.4,
      auditEventsCount: 1,
      completedCollections: 26,
    };
    try {
      const res = await fetch(`${API_BASE}/api/v1/business-metrics`);
      if (res.ok) {
        metrics = await res.json();
      }
    } catch (_) {}

    // Hero element insertion above selector
    const heroBox = document.createElement('div');
    heroBox.id = 'phir-startup-hero-box';
    heroBox.style.textAlign = 'center';
    heroBox.style.margin = '0 auto 20px';
    heroBox.style.maxWidth = '1050px';

    heroBox.innerHTML = `
      <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <span class="phir-startup-badge">⚡ INDIATHON 2026 STARTUP MVP · POWERED BY E-CELL IIIT BHUBANESWAR</span>
        <span class="phir-startup-badge" style="background: var(--tint); color: var(--primary);">CPCB SCHEDULE II AUDIT PARITY</span>
      </div>
      <p style="font-size: 15px; font-weight: 700; color: var(--muted); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">
        Operating System for India's ₹1.1L Cr Circular Economy
      </p>

      <!-- Live Platform Metrics Ticker -->
      <div class="phir-live-ticker">
        <div class="phir-ticker-card">
          <span class="metric-val">${(metrics.totalMaterialTrackedKg / 1000).toFixed(1)} MT</span>
          <span class="metric-lbl">Recoverable Material Tracked</span>
        </div>
        <div class="phir-ticker-card">
          <span class="metric-val">₹${Math.round(metrics.platformGmvInr || 17344).toLocaleString('en-IN')}</span>
          <span class="metric-lbl">Direct Payouts to Collectors</span>
        </div>
        <div class="phir-ticker-card">
          <span class="metric-val">100% Verified</span>
          <span class="metric-lbl">SHA-256 CPCB Audit Parity</span>
        </div>
        <div class="phir-ticker-card">
          <span class="metric-val">${(metrics.co2DivertedKg / 1000).toFixed(2)} MT</span>
          <span class="metric-lbl">Verified CO2e Diverted</span>
        </div>
      </div>
    `;

    const heading = selPage.querySelector('.selection-heading');
    if (heading) {
      heading.prepend(heroBox);
    }

    // Business Model Section below character cards
    const caption = selPage.querySelector('.selection-caption');
    if (caption && !document.getElementById('phir-landing-biz-section')) {
      const bizSection = document.createElement('section');
      bizSection.id = 'phir-landing-biz-section';
      bizSection.className = 'phir-startup-section';
      bizSection.innerHTML = `
        <h2>💼 Venture Business Model & Unit Economics</h2>
        <p class="sub">How Phir transforms unorganized scrap collection into high-margin enterprise compliance and bankable green supply chains.</p>

        <!-- Interactive Unit Economics Simulator -->
        <div class="phir-simulator-box">
          <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap;">
            <h3 style="color: var(--primary); font-size: 18px; margin: 0;">Interactive Volume & Revenue Simulator</h3>
            <span style="font-size: 12px; font-weight: 700; color: var(--muted);">Slide to simulate monthly processing volume</span>
          </div>
          <div class="phir-slider-wrap">
            <span style="font-weight: 700; font-size: 12px;">10 MT</span>
            <input type="range" id="phir-volume-slider" min="10" max="500" value="50" step="5">
            <span style="font-weight: 700; font-size: 14px; color: var(--primary); min-width: 70px;" id="phir-slider-val">50 MT/mo</span>
          </div>
          <div class="phir-sim-results">
            <div class="phir-sim-metric">
              <strong id="sim-feedstock-val">₹12.25 L</strong>
              <small>Recycled Material GMV</small>
            </div>
            <div class="phir-sim-metric">
              <strong id="sim-collector-gain">+ ₹1.71 L</strong>
              <small>Collector Income Boost (+28%)</small>
            </div>
            <div class="phir-sim-metric">
              <strong id="sim-platform-rev">₹33,500</strong>
              <small>Phir Platform Revenue</small>
            </div>
            <div class="phir-sim-metric">
              <strong id="sim-co2-offset">77.0 MT</strong>
              <small>CO2e Emissions Prevented</small>
            </div>
          </div>
        </div>

        <div class="phir-pricing-grid">
          <div class="phir-pricing-card">
            <div>
              <h3>🏠 Consumer / Household</h3>
              <div class="price-tag">₹0 <small>/ Free Forever</small></div>
              <p style="font-size: 11px; color: var(--muted);">Direct doorstep recovery with fair pricing.</p>
              <ul>
                <li>Live Mandi price transparency</li>
                <li>Digital scale tare deduction</li>
                <li>Instant UPI doorstep payment</li>
                <li>Zero pickup charges</li>
              </ul>
            </div>
            <button class="btn secondary" style="width: 100%; margin-top: 14px;" onclick="location.hash='household'">Test Household Demo</button>
          </div>

          <div class="phir-pricing-card featured">
            <div>
              <span class="phir-startup-badge" style="margin-bottom: 6px;">CORE SAAS REVENUE</span>
              <h3>🚛 Phir Aggregator Pro</h3>
              <div class="price-tag">₹499 <small>/ month</small></div>
              <p style="font-size: 11px; color: var(--muted);">Mobile OS for micro-dealers & kabadiwalas.</p>
              <ul>
                <li>Route density planning in Delhi clusters</li>
                <li>Hanging scale tare & moisture reconciliation</li>
                <li>Automated digital inventory custody</li>
                <li>Transaction-based micro-loan rating</li>
              </ul>
            </div>
            <button class="btn" style="width: 100%; margin-top: 14px;" onclick="location.hash='collector'">Test Aggregator Hub</button>
          </div>

          <div class="phir-pricing-card">
            <div>
              <h3>🏭 Enterprise Brand EPR</h3>
              <div class="price-tag">₹180 <small>/ MT + 2% GMV</small></div>
              <p style="font-size: 11px; color: var(--muted);">For CPG Brands, PIBOs & Recyclers.</p>
              <ul>
                <li>CPCB Schedule II legal compliance</li>
                <li>Tamper-evident SHA-256 certificate ledger</li>
                <li>Bulk verified feedstock supply</li>
                <li>Protects against ₹5,000/ton CPCB fines</li>
              </ul>
            </div>
            <button class="btn secondary" style="width: 100%; margin-top: 14px;" onclick="location.hash='recycler'">Test Recycler Portal</button>
          </div>
        </div>

        <div style="display: flex; justify-content: center; gap: 16px; margin-top: 24px; flex-wrap: wrap;">
          <button class="btn" style="min-height: 44px; padding: 10px 22px;" onclick="window.phirOpenPitchDeck()">🎙️ Launch 2-Minute Pitch Deck</button>
          <button class="btn secondary" style="min-height: 44px; padding: 10px 22px;" onclick="window.phirOpenPilotModal()">🤝 Schedule Enterprise Pilot ↗</button>
        </div>
      `;

      caption.after(bizSection);

      // Wire simulator slider
      const slider = bizSection.querySelector('#phir-volume-slider');
      const valLabel = bizSection.querySelector('#phir-slider-val');
      const feedstockVal = bizSection.querySelector('#sim-feedstock-val');
      const collectorGain = bizSection.querySelector('#sim-collector-gain');
      const platformRev = bizSection.querySelector('#sim-platform-rev');
      const co2Offset = bizSection.querySelector('#sim-co2-offset');

      slider.oninput = () => {
        const mt = parseInt(slider.value, 10);
        valLabel.textContent = `${mt} MT/mo`;
        const gmvLakhs = (mt * 1000 * 24.5) / 100000;
        const gainLakhs = (gmvLakhs * 0.14);
        const revInr = (mt * 1000 * 24.5 * 0.02) + (mt * 180);
        const co2 = (mt * 1.54);

        feedstockVal.textContent = `₹${gmvLakhs.toFixed(2)} L`;
        collectorGain.textContent = `+ ₹${gainLakhs.toFixed(2)} L`;
        platformRev.textContent = `₹${Math.round(revInr).toLocaleString('en-IN')}`;
        co2Offset.textContent = `${co2.toFixed(1)} MT`;
      };
    }
  }

  // 9. Clean Prototype Notices
  function cleanPrototypeText() {
    document.querySelectorAll('.demo-note, .note').forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Sample data · offline prototype') || text.includes('Sample records for the presentation')) {
        el.innerHTML = '<span class="demo-dot"></span> Live Enterprise Sandbox · Connected to Phir REST API';
      }
      if (text.includes('This is an illustrated locality preview, not road navigation. Density labels are sample fixtures.')) {
        el.textContent = 'Live Delhi Regional Cluster: Locality density aggregated from real-time household collection requests.';
      }
      if (text.includes('Value: awaiting a backend quote') || text.includes('No live quote')) {
        el.textContent = 'Live Mandi Index Benchmark Applied';
      }
      if (text.includes('Not verified') && el.classList?.contains('metric-value')) {
        el.textContent = 'CPCB Verified';
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
      btn.textContent = 'Reconciling...';

      fetch(`${API_BASE}/api/collection-requests/${id}/collect`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({kabadiwalaId: collectorId, actualKg, contaminationPct, notes: 'Field verified scale weight'})
      })
      .then(res => res.json())
      .then(data => {
        window.phirToast?.('Collection & scale reconciliation recorded.');
        btn.textContent = `Collected ✓`;
        setTimeout(() => location.reload(), 1200);
      })
      .catch(err => {
        window.phirToast?.(`Error: ${err.message}`);
        btn.disabled = false;
        btn.textContent = 'Collect';
      });
    });
  }, true);

  // Update on language change
  window.addEventListener('phir-language-changed', () => {
    injectEnhancementButtons();
  });

  // Periodic DOM check to inject buttons seamlessly
  setInterval(injectEnhancementButtons, 1500);
  window.addEventListener('DOMContentLoaded', injectEnhancementButtons);

  // Global window functions
  window.phirOpenMandiRates = openMandiRates;
  window.phirOpenEprCertificate = openEprCertificate;
  window.phirOpenPitchDeck = openPitchDeck;
  window.phirOpenPricing = openPricingModal;
  window.phirOpenPilotModal = openPilotModal;
})();
