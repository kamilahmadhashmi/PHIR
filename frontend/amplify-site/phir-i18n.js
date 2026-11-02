/* PHIR Complete Internationalization (i18n) Engine
   Languages: English (en), हिन्दी (hi), ଓଡ଼ିଆ (od)
   Fully reactive, zero-reload switching, localStorage persistence, and deep DOM localization.
*/

(() => {
  const STORAGE_KEY = 'phir_lang';
  const SUPPORTED = ['en', 'hi', 'od'];

  // Injects Google Fonts for Devanagari and Odia typography with zero latency
  const fontLinks = document.createElement('div');
  fontLinks.innerHTML = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Noto+Sans+Oriya:wght@400;600;700;800&display=swap" rel="stylesheet">
  `;
  document.head.appendChild(fontLinks);

  // 1. Comprehensive Translation Dictionaries
  const DICTIONARY = {
    // English (Baseline)
    en: {
      lang_name: 'English',
      lang_code: 'EN',
      lang_native: 'English',

      // Brand & Navigation
      choose_role: 'Choose your role',
      switch_role: 'Switch role',
      enter_story: 'Enter the story',
      choose_part: 'Choose your part',
      footer_network: 'PHIR • Resource Recovery Network',
      footer_waste: 'Waste & Resource Recovery',
      sample_data_note: 'Sample data • offline prototype',

      // Roles
      role_household: 'Household',
      role_collector: 'Collection partner',
      role_recycler: 'Recycler',
      role_hint_household: 'Where it begins',
      role_hint_collector: 'Kabadiwala • Aggregator',
      role_hint_recycler: 'Where it becomes',

      // Materials
      mat_pet: 'PET plastic',
      mat_cardboard: 'Cardboard',
      mat_paper: 'Paper',
      mat_aluminium: 'Aluminium',
      mat_glass: 'Glass',
      mat_wood: 'Wood',
      mat_all: 'All materials',

      // Landing / Chooser
      landing_eyebrow: 'Household   Collection partner   Recycler',
      landing_h1_main: 'Phenkna nahi.',
      landing_h1_tagline: 'Phir se sochna hai.',
      landing_caption: 'A better way to pass recyclable materials from your doorstep into the recovery chain.',

      // Workspace Tabs
      tab_materials_collection: 'Materials & collection',
      tab_contributions: 'Contributions',
      tab_collection_map: 'Collection map',
      tab_inventory: 'Inventory',
      tab_profile_impact: 'Profile & impact',
      tab_my_inventory: 'My inventory',
      tab_company_needs: 'Company needs',
      tab_requests: 'Requests',
      tab_material_marketplace: 'Material marketplace',
      tab_requirements: 'Requirements',
      tab_bookings: 'Bookings',
      tab_company_profile: 'Company profile',

      // Common Actions & Buttons
      btn_add_material: 'Add material',
      btn_add_photo: 'Add from a photo',
      btn_request_collection: 'Request a collection',
      btn_request_another: 'Request another collection',
      btn_accept: 'Accept',
      btn_decline: 'Decline',
      btn_mark_collected: 'Mark collected',
      btn_preview_route: 'Preview selected route',
      btn_new_requirement: 'New requirement',
      btn_publish_requirement: 'Publish requirement',
      btn_reserve_material: 'Reserve material',
      btn_confirm_handover: 'Confirm handover',
      btn_save_changes: 'Save changes',
      btn_save_company: 'Save company profile',
      btn_cancel: 'Cancel',
      btn_confirm: 'Confirm',
      btn_close: 'Close',
      btn_continue: 'Continue',
      btn_play_again: 'Play again',
      btn_restart_demo: 'Restart sample journey',
      btn_export_records: 'Export demo records',
      btn_show_all: 'Show all materials',
      btn_go_household: 'Go to household',
      btn_explore_materials: 'Explore materials',
      btn_choose_photo: 'Choose a photo',
      btn_confirm_material: 'Confirm material',
      btn_create_requirement: 'Create requirement',
      btn_mandi_rates: 'Mandi Scrap Rates',
      btn_epr_audit: 'EPR Audit',
      btn_instant_upi: 'Instant UPI Pay',
      btn_print_pdf: 'Print / Save PDF',

      // Statuses & Badges
      status_available: 'available',
      status_requested: 'requested',
      status_pending: 'pending',
      status_accepted: 'accepted',
      status_collected: 'collected',
      status_reserved: 'reserved',
      status_transferred: 'transferred',
      status_fulfilled: 'fulfilled',
      status_partially_fulfilled: 'partially fulfilled',
      status_recorded: 'Recorded',
      status_sample: 'Sample',
      status_illustrative: 'Illustrative',
      status_active: 'active',
      status_route_stop: 'Route stop',

      // Metric Labels
      metric_available_collection: 'Available for collection',
      metric_est_value: 'Estimated value · sample',
      metric_collected_so_far: 'Collected so far',
      metric_local_partners: 'Sample local partners',
      metric_material_recorded: 'Material recorded',
      metric_collected_by_partner: 'Collected by a partner',
      metric_transferred_to_recycler: 'Transferred to a recycler',
      metric_not_verified: 'Not verified',
      metric_actual_recycling: 'Actual recycling',
      metric_open_opportunities: 'Your open opportunities',
      metric_avail_inventory: 'Available collected inventory',
      metric_reserved_transfer: 'Reserved for transfer',
      metric_transferred_recyclers: 'Transferred to recyclers',
      metric_held_or_transferred: 'Material held or transferred',
      metric_material_transferred: 'Material transferred',
      metric_collections_recorded: 'Collections recorded',
      metric_avail_marketplace: 'Available in sample marketplace',
      metric_open_requirements: 'Open requirements',
      metric_reserved_for_you: 'Reserved for you',
      metric_confirmed_transfers: 'Confirmed transfers',
      metric_active_reservations: 'Active reservations',
      metric_reserved_quantity: 'Reserved quantity',
      metric_sample_material_lots: 'Sample material lots',

      // Household Section
      house_title: 'Your home / Lajpat Nagar, Delhi',
      house_h1: 'A little space.<br>A second beginning.',
      house_copy: 'Keep your recyclables separate. Let the right hands take them forward.',
      house_your_materials: 'Your materials',
      house_recorded_materials: 'recorded materials',
      house_empty_title: 'Room for a new beginning.',
      house_empty_desc: 'Your recyclable materials will appear here.',
      house_your_collection: 'Your collection',
      house_ready_prefix: 'ready for a collection partner.',
      house_waiting_partner: 'Waiting for a collection partner',
      house_accepted_partner: 'Accepted by a collection partner',
      house_collection_recorded: 'Collection recorded',
      house_step_requested: 'Requested',
      house_step_accepted: 'Accepted',
      house_step_collected: 'Collected',
      house_desc_pending: 'Lajpat Nagar · Locality-level request',
      house_desc_accepted: 'Your materials are awaiting handover.',
      house_desc_collected: 'Material is now in the collection partner’s inventory.',
      house_good_hands: 'Good hands, nearby.',
      house_local_partners_desc: 'Collection partners in your locality.',
      house_note_locality: 'Your request is visible at locality level. A collection partner accepts it; this prototype does not book a named partner directly.',
      house_guide_heading: 'Separate a little. Save a possibility.',
      house_guide_1_h3: 'Keep it clean & dry',
      house_guide_1_p: 'Empty bottles and cans. Keep paper and cardboard free from food and moisture.',
      house_guide_2_h3: 'Keep these in the chain',
      house_guide_2_p: 'PET plastic, cardboard, paper, aluminium, glass and wood. Check local acceptance with your collection partner.',
      house_guide_3_h3: 'Keep these separate',
      house_guide_3_p: 'Food waste, sanitary waste and hazardous items should not go into your recyclable bundle.',

      // Contributions Section
      contrib_title: 'Your part in the chain',
      contrib_h1: 'Small actions. Real records.',
      contrib_copy: 'Every contribution is traceable to a collection or transfer — not an assumed environmental saving.',
      contrib_journey: 'Your material journey',
      contrib_demo_record: 'Recorded in this demonstration',
      contrib_meaning: 'What this means',
      contrib_meaning_note: 'Collection keeps a material in the recovery chain. Transfer documents its next custodian. Recycling needs separate downstream evidence.',
      contrib_handover_title: 'A handover, not a finish line.',
      contrib_handover_desc: 'The strongest impact claim today is what we can actually record.',

      // Collector Section
      col_title: 'Collection partner / Delhi',
      col_h1: 'The next good hand<br>could be yours.',
      col_copy: 'Find material ready for collection, one neighbourhood at a time.',
      col_map_heading: 'Delhi, by neighbourhood.',
      col_locality_view: 'Locality-level view',
      col_map_note: 'This is an illustrated locality preview, not road navigation. Density labels are sample fixtures. Household identities and exact locations are never shown.',
      col_empty_h3: 'No open collection requests.',
      col_empty_p: 'Add materials and request collection from the Household page to see the full journey.',
      col_preview_heading: 'Neighbourhood preview',
      col_mixed_bundle: 'Mixed recyclable bundle',
      col_bundle_desc: 'Paper, PET & cardboard · Area-level sample',
      col_quote_waiting: 'Value: awaiting a backend quote',
      col_sample_estimate: 'Sample estimate',
      col_no_live_quote: 'No live quote',
      col_inv_title: 'Collected materials',
      col_inv_h1: 'Ready for the next hand.',
      col_inv_copy: 'Your collected material becomes discoverable to recyclers.',
      col_custody_h2: 'Material in your custody',
      col_th_material: 'Material',
      col_th_quantity: 'Quantity',
      col_th_locality: 'Locality',
      col_th_status: 'Status',
      col_th_action: 'Action',
      col_demand_title: 'Demand / Delhi',
      col_demand_h1: 'Somebody needs<br>what you already hold.',
      col_demand_copy: 'Recycler requirements, linked to material in the collection chain.',
      col_open_reqs: 'Open requirements',
      col_no_open_reqs: 'No open requirements.',
      col_no_open_reqs_p: 'New recycler requirements will appear here.',
      col_profile_title: 'Collection partner / Profile',
      col_profile_h1: 'A familiar face.<br>A vital link.',
      col_profile_copy: 'Kabadiwalas and aggregators power the existing recycling economy.',
      col_partner_heading: 'Collection partner',
      col_sample_profile: 'Sample profile',
      col_role_desc: 'Kabadiwala / Aggregator · Delhi',
      col_materials_accepted: 'Materials accepted',
      col_all_six_mats: 'PET, cardboard, paper, aluminium, glass and wood',
      col_service_localities: 'Service localities',
      col_delhi_areas: 'Lajpat Nagar, Karol Bagh and Saket',
      col_trust_chain: 'Trust is built in the chain.',
      col_trust_note: 'This prototype combines collector and aggregator into one role. In the real economy, they may be different people.',
      col_trust_muted: 'Profile indicators are demonstration records, not certifications. No invented scores or verified recycling claims.',

      // Recycler Section
      rec_title: 'Recycler / Delhi',
      rec_h1: 'The next life<br>starts with the right material.',
      rec_copy: 'Discover materials already collected by local partners.',
      rec_ready_life: 'Material, ready for its next life.',
      rec_collected_inv: 'Collected inventory',
      rec_collected_mat: 'Collected material',
      rec_no_lots_h3: 'No available lots.',
      rec_no_lots_p: 'Matching collected materials will appear here.',
      rec_req_title: 'Your material demand',
      rec_req_h1: 'Give the next life<br>a clear direction.',
      rec_req_copy: 'Tell collection partners which materials your company needs.',
      rec_your_reqs: 'Your requirements',
      rec_req_units: 'material requests',
      rec_still_needed: 'still needed · Delhi',
      rec_fulfilled_ratio: 'fulfilled',
      rec_book_title: 'Reserved → Transferred',
      rec_book_h1: 'A reservation is a promise.<br>A handover is a record.',
      rec_book_copy: 'Bookings reserve material immediately. Confirm only when the material has been handed over.',
      rec_your_bookings: 'Your bookings',
      rec_th_partner: 'Partner',
      rec_th_handover: 'Handover',
      rec_no_bookings_h3: 'No bookings yet.',
      rec_no_bookings_p: 'Reserve a matching lot in the material marketplace.',
      rec_comp_title: 'Recycler / Company',
      rec_comp_h1: 'Put a name<br>to the next beginning.',
      rec_comp_copy: 'Your company details accompany the requirements you publish.',
      rec_field_name: 'Company name',
      rec_field_locality: 'Company locality',
      rec_field_contact: 'Company contact email (optional)',
      rec_note_live: 'Saved to the live demonstration profile for this recycler.',
      rec_demand_meets: 'Demand meets<br>the existing economy.',
      rec_demand_desc: 'Publish material requirements, find collected inventory, reserve a lot and record its handover.',

      // Identity Modal
      identity_title: 'profile',
      identity_prompt_live: 'Enter a name and choose the Delhi area you live in. This creates a lightweight demo profile-no password required.',
      identity_prompt_serve: 'Enter a name and choose the Delhi area you serve. This creates a lightweight demo profile-no password required.',
      identity_label_name: 'Name',
      identity_ph_name: 'Your name',
      identity_label_area: 'Area',
      identity_label_service_area: 'Service area',
      identity_saving: 'Saving profile.',

      // Areas
      area_north: 'North',
      area_north_west: 'North West',
      area_west: 'West',
      area_south_west: 'South West',
      area_central: 'Central',
      area_new_delhi: 'New Delhi',
      area_north_east: 'North East',
      area_shahdara: 'Shahdara',
      area_east: 'East',
      area_south_east: 'South East',
      area_south: 'South',
      area_lajpat: 'Lajpat Nagar',
      area_karol: 'Karol Bagh',
      area_saket: 'Saket',

      // Modals & Dialogs
      modal_add_mat: 'Add a material',
      modal_edit_mat: 'Edit material',
      modal_from_photo: 'From a photo',
      modal_photo_help: 'Choose one dominant material to identify.',
      modal_rec_result: 'Recognition result',
      modal_waiting_photo: 'Waiting for a photo',
      modal_suggestion_here: 'Your material suggestion will appear here.',
      modal_confirm_label: 'I confirm this material identification.',
      modal_field_mat: 'Material',
      modal_field_weight: 'Weight (kg)',
      modal_placeholder_weight: 'e.g. 2.5',
      modal_remove_title: 'Remove this material?',
      modal_remove_copy: 'Only available material can be removed from your household inventory.',
      modal_new_req_title: 'What does your company need?',
      modal_req_mat: 'Material needed',
      modal_req_weight: 'Required weight (kg)',
      modal_req_weight_ph: 'e.g. 100',
      modal_req_min: 'Minimum booking (kg, optional)',
      modal_req_min_ph: 'e.g. 25',
      modal_req_note: 'This requirement is visible to the collection partner in this demonstration.',
      modal_reserve_title: 'Reserve this material',
      modal_match_req: 'Match to your requirement',
      modal_qty_reserve: 'Quantity to reserve (kg)',
      modal_reserve_note: 'The quantity is reserved immediately. Material transfers only after you confirm the handover.',
      modal_need_req_note: 'You need a matching requirement before reserving this material.',
      modal_decline_title: 'Decline this collection?',
      modal_decline_copy: 'The material returns to the household’s available inventory in this demonstration.',
      modal_record_col_title: 'Record this collection?',
      modal_record_col_copy: 'Confirm that the material has been handed to the collection partner. This records collection, not recycling.',
      modal_confirm_handover_title: 'Confirm the material handover?',
      modal_confirm_handover_copy: 'This completes the booking and records a transfer to your company. It does not verify that recycling occurred.',
      modal_restart_title: 'Restart the demonstration?',
      modal_restart_copy: 'This clears the current presentation journey and restores the sample records.',
      sample_records_notice: 'Sample records for the presentation. Added material has no live quote. Collection and transfer are recorded separately; neither verifies recycling.',

      // Enhancement Modals (Mandi, Scale, EPR)
      mandi_modal_title: 'Live Delhi Scrap Mandi Rates',
      mandi_modal_bench: 'Indicative Market Benchmark',
      mandi_table_mat: 'Material Type',
      mandi_table_grade: 'Standard Grade',
      mandi_table_rate: 'Mandi Rate (₹/kg)',
      mandi_grade_pet: 'Clean baled / Sorted',
      mandi_grade_cardboard: 'Old Corrugated (OCC) / Dry',
      mandi_grade_paper: 'Newspaper & Office Paper',
      mandi_grade_aluminium: 'Cans, Sections & Scrap',
      mandi_grade_glass: 'Sorted Cullet & Bottles',
      mandi_grade_wood: 'Crates, Lumber & Pallets',
      mandi_modal_note: 'Rates reflect prevailing wholesale scrap benchmarks in Mayapuri, Seelampur, and Ghazipur trading clusters. Payouts adjust for physical scale moisture and contamination.',
      scale_modal_title: 'Physical Scale Weight Reconciliation',
      scale_modal_sub: 'Verify hanging scale weight and inspect for contamination before issuing instant payment.',
      scale_household_est: 'Household Estimate',
      scale_field_scale: 'Physical Scale Reading (Gross kg)',
      scale_field_contam: 'Field Contamination (%)',
      scale_net_weight: 'Net Billable Weight',
      scale_net_payout: 'Net Payout Due',
      scale_instant_upi: 'Instant UPI Settlement',
      scale_confirm_btn: 'Confirm Scale Reconciliation & Complete',
      epr_modal_title: 'Digital EPR Certificate of Custody',
      epr_sub: 'Cryptographic Extended Producer Responsibility Audit Trail',
      epr_label_id: 'Certificate ID',
      epr_label_time: 'Ledger Timestamp',
      epr_label_actor: 'Responsible Custodian',
      epr_label_entity: 'Transaction Entity ID',
      epr_label_hash: 'SHA-256 Event Proof',
      epr_label_prev: 'Preceding Ledger Hash',
      epr_label_integrity: 'Chain Integrity',
      epr_verified: 'Cryptographically Verified (Tamper-evident)',
      epr_certified: 'Verified and permanently recorded by PHIR Relational Ledger under Indian Plastic Waste & Resource Recovery guidelines (PWM Schedule II audit parity).',

      // Dynamic Error Messages & Live Notifications
      err_only_available_edit: 'only available household material can be edited',
      err_only_available_remove: 'only available household material can be removed',
      err_at_least_one: 'at least one material is required',
      err_belong_household: 'all materials must belong to the household and be available',
      err_only_pending_accept: 'only pending requests can be accepted',
      err_only_pending_reject: 'only pending requests can be rejected',
      err_must_accept_first: 'request must be accepted by this kabadiwala before collection',
      err_min_between_zero: 'minimum_quantity_kg must be between zero and quantity_kg',
      err_active_req_exists: 'an active requirement already exists for this material',
      err_req_not_found: 'requirement not found for recycler',
      err_booking_exceeds: 'requested booking exceeds available or required quantity',
      err_booking_below_min: 'requested booking is below the requirement minimum quantity',
      err_booking_not_found: 'booking not found for recycler',
      err_only_confirmed_complete: 'only confirmed bookings can be completed',
      err_reserved_no_longer_avail: 'reserved material is no longer available',
      err_profile_not_found: 'profile not found',
      err_material_not_found: 'material not found',
      err_collection_req_not_found: 'collection request not found',
      live_saved_records: 'Saved to recovery records',
      live_profile_ready: 'Company profile ready',
      live_inventory_refresh: 'Inventory needs a refresh',
      live_recovery_records: 'Live recovery records',
      // === Indiathon 2026 Startup MVP & Business Layer (en) ===
      nav_pitch_deck: '🎙️ 2-Min Pitch Deck',
      nav_pricing_model: '💼 Pricing & Model',
      nav_mandi_rates: '⚖️ Mandi Scrap Rates',
      btn_epr_audit: '🌱 EPR Audit',
      btn_plan_route: '🗺️ Plan Pickup Route',
      btn_preview_route: 'Preview selected route',
      route_stop_lbl: 'Route stop',
      route_stops_selected: 'Stops Selected',
      route_total_distance: 'total circuit',
      route_estimated_trip: 'estimated trip',
      route_privacy_note: 'Privacy preserved via centroid obfuscation',
      startup_hero_badge: '⚡ INDIATHON 2026 STARTUP MVP · POWERED BY E-CELL IIIT BHUBANESWAR',
      startup_cpcb_badge: 'CPCB SCHEDULE II AUDIT PARITY',
      startup_hero_subtitle: 'Operating System for India\'s ₹1.1L Cr Circular Economy',
      ticker_mat_tracked: 'Recoverable Material Tracked',
      ticker_direct_payouts: 'Direct Payouts to Collectors',
      ticker_cpcb_parity: 'SHA-256 CPCB Audit Parity',
      ticker_co2_diverted: 'Verified CO2e Diverted',
      ticker_verified_pct: '100% Verified',
      biz_model_heading: '💼 Venture Business Model & Unit Economics',
      biz_model_sub: 'How Phir transforms unorganized scrap collection into high-margin enterprise compliance and bankable green supply chains.',
      sim_heading: 'Interactive Volume & Revenue Simulator',
      sim_sub: 'Slide to simulate monthly processing volume',
      sim_feedstock_label: 'Recycled Material GMV',
      sim_collector_gain_label: 'Collector Income Boost (+28%)',
      sim_platform_rev_label: 'Phir Platform Revenue',
      sim_co2_offset_label: 'CO2e Emissions Prevented',
      pricing_tier_household: '🏠 Consumer / Household',
      pricing_free_forever: 'Free Forever',
      pricing_household_desc: 'Direct doorstep recovery with fair pricing.',
      pricing_household_f1: 'Live Mandi price transparency',
      pricing_household_f2: 'Digital scale tare deduction',
      pricing_household_f3: 'Instant UPI doorstep payment',
      pricing_household_f4: 'Zero pickup charges',
      pricing_btn_test_household: 'Test Household Demo',
      pricing_tier_aggregator: '🚛 Phir Aggregator Pro',
      pricing_badge_core_saas: 'CORE SAAS REVENUE',
      pricing_per_month: '/ month',
      pricing_aggregator_desc: 'Mobile OS for micro-dealers & kabadiwalas.',
      pricing_aggregator_f1: 'Multi-stop route planning & fuel optimization',
      pricing_aggregator_f2: 'Direct mill batch aggregation',
      pricing_aggregator_f3: 'Digital weighing scales & UPI payout ledger',
      pricing_aggregator_f4: 'Transparent mandi rate intelligence',
      pricing_btn_start_pro: 'Start 14-Day Free Pilot',
      pricing_tier_enterprise: '🏭 Enterprise Brand Compliance',
      pricing_badge_high_margin: 'HIGH MARGIN ENTERPRISE',
      pricing_enterprise_sub: '/ mo + ₹1.5/kg audit fee',
      pricing_enterprise_desc: 'Turnkey Extended Producer Responsibility (EPR) compliance for FMCG & electronics.',
      pricing_enterprise_f1: 'CPCB Schedule II verifiable audit certificates',
      pricing_enterprise_f2: 'Tamper-proof SHA-256 chain of custody',
      pricing_enterprise_f3: 'Dedicated supply chain account manager',
      pricing_enterprise_f4: 'Recycler batch quality certificates',
      pricing_btn_request_pilot: 'Request Enterprise RFP',
      valprop_heading: 'Why Venture-Backed Scalability Matters',
      valprop_sub: 'Bridging unorganized micro-entrepreneurs with Fortune 500 ESG compliance.',
      valprop_card1_title: '🏛️ Regulatory Tailwinds',
      valprop_card1_desc: 'Strict CPCB plastic packaging waste rules mandate 100% verifiable recycling targets with heavy non-compliance penalties.',
      valprop_card2_title: '🤝 Decentralized Scale',
      valprop_card2_desc: 'Instead of replacing 2.5M informal kabadiwalas, Phir equips them with SaaS tools to increase their earnings by 28%.',
      valprop_card3_title: '🔒 Bankable Audit Trail',
      valprop_card3_desc: 'Every kilogram from doorstep pickup to recycling furnace is cryptographically hashed for institutional accountability.',
      pitch_deck_title: 'Phir — 2-Minute Venture Startup Pitch',
      pitch_btn_prev: '⬅ Previous',
      pitch_btn_next: 'Next Slide ➔',
      pitch_btn_rfp: 'Book 15-Min Enterprise Pilot RFP',
      pitch_kicker_0: 'THE PROBLEM',
      pitch_title_0: 'The ₹1.1 Lakh Cr Informal Recycling Economy is Broken',
      pitch_b0_1: '90% of India\'s dry waste is handled by 2.5M unorganized waste-pickers and micro-dealers.',
      pitch_b0_2: 'Middlemen exploit informal workers with rigged scales and untracked cash deductions.',
      pitch_b0_3: 'FMCG brands face strict CPCB EPR mandates but rely on fraudulent paper certificates.',
      pitch_kicker_1: 'OUR SOLUTION',
      pitch_title_1: 'Phir: Real-Time Operating System for Circular Supply Chains',
      pitch_b1_1: 'Consumer App: On-demand doorstep pickup with live Mandi benchmark transparency.',
      pitch_b1_2: 'Collector OS: Route planning, digital hanging scale reconciliation, and instant UPI payouts.',
      pitch_b1_3: 'Enterprise Registry: Tamper-proof SHA-256 chain-of-custody certificates matching CPCB Schedule II.',
      pitch_kicker_2: 'LIVE MVP & TRACTION',
      pitch_title_2: 'End-to-End Functional Marketplace',
      pitch_b2_1: 'Complete tri-sided workflow fully operational: Household, Collector, and Recycler.',
      pitch_b2_2: 'Direct live integration with Delhi Mandi scrap price indices.',
      pitch_b2_3: 'Zero-reload tri-lingual accessibility in English, Hindi, and Odia.',
      pitch_kicker_3: 'BUSINESS MODEL',
      pitch_title_3: 'Tri-Sided Monetization with High-Margin Enterprise SaaS',
      pitch_b3_1: 'B2C Consumer: Free doorstep pickup with zero commission on household recyclables.',
      pitch_b3_2: 'B2B Collector SaaS: ₹499/mo subscription for route planning and trade ledger.',
      pitch_b3_3: 'Enterprise EPR Compliance: ₹14,999/mo + ₹1.5/kg audit fee for institutional brand traceability.',
      pitch_kicker_4: 'COMPETITIVE MOAT',
      pitch_title_4: 'Why Phir Wins: Regulatory & Network Moat',
      pitch_b4_1: 'Informal Partner Inclusion: Empowering existing kabadiwalas instead of heavy asset fleets.',
      pitch_b4_2: 'Full Chain Traceability: Cryptographic proof from household doorstep to industrial extruder.',
      pitch_b4_3: 'Hyperlocal Density: Cluster-based aggregation minimizing collection transport emissions.',
      pitch_kicker_5: 'INDIATHON VISION',
      pitch_title_5: 'Indiathon 2026 Commitment & Expansion Roadmap',
      pitch_b5_1: 'Targeting initial pilot with 100 verified kabadiwalas in Delhi-NCR and Bhubaneswar.',
      pitch_b5_2: 'Scaling to 5,000 MT/month verified processing capacity across 5 Tier-1 cities.',
      pitch_b5_3: 'Built to launch: Production-grade architecture with zero simulated mockups.',
      pilot_modal_title: 'Request 14-Day Enterprise Sandbox Pilot',
      pilot_modal_sub: 'Join forward-thinking brands meeting 100% CPCB EPR compliance with Phir\'s verified digital supply chain.',
      pilot_lbl_org: 'Organization / Brand Name *',
      pilot_lbl_email: 'Your Work Email *',
      pilot_lbl_volume: 'Estimated Monthly Packaging Waste (MT) *',
      pilot_lbl_category: 'Target Compliance Category *',
      pilot_lbl_city: 'Pilot City / Locality *',
      pilot_opt_cat1: 'Category I: Rigid Plastics (HDPE/PP/PET)',
      pilot_opt_cat2: 'Category II: Flexible Multi-Layer Plastics',
      pilot_opt_cat3: 'Category III: Multi-Layered Packaging',
      pilot_opt_paper: 'Industrial Cardboard & Paper Pulp',
      pilot_opt_ewaste: 'E-Waste / Metal Alloys',
      pilot_btn_submit: 'Request Sandbox Pilot Access',
      pilot_success_msg: 'Sandbox Pilot request received! Our enterprise team will contact your organization within 24 hours.',
    },

    // हिन्दी (Hindi)
    hi: {
      lang_name: 'हिन्दी',
      lang_code: 'HI',
      lang_native: 'हिन्दी',

      // Brand & Navigation
      choose_role: 'अपनी भूमिका चुनें',
      switch_role: 'भूमिका बदलें',
      enter_story: 'कहानी देखें',
      choose_part: 'अपना हिस्सा चुनें',
      footer_network: 'फिर (PHIR) • संसाधन पुनर्प्राप्ति नेटवर्क',
      footer_waste: 'अपशिष्ट एवं संसाधन पुनर्प्राप्ति',
      sample_data_note: 'नमूना डेटा • ऑफ़लाइन प्रोटोटाइप',

      // Roles
      role_household: 'घरेलू (परिवार)',
      role_collector: 'कबाड़ीवाला / संग्रह भागीदार',
      role_recycler: 'पुनर्चक्रणकर्ता (रीसाइक्लर)',
      role_hint_household: 'जहाँ से शुरुआत होती है',
      role_hint_collector: 'कबाड़ीवाला • संग्राहक',
      role_hint_recycler: 'जहाँ नया रूप मिलता है',

      // Materials
      mat_pet: 'पीईटी प्लास्टिक',
      mat_cardboard: 'गत्ता (कार्डबोर्ड)',
      mat_paper: 'रद्दी कागज़',
      mat_aluminium: 'एल्युमिनियम',
      mat_glass: 'काँच',
      mat_wood: 'लकड़ी',
      mat_all: 'सभी सामग्रियां',

      // Landing / Chooser
      landing_eyebrow: 'घरेलू   कबाड़ीवाला   पुनर्चक्रणकर्ता',
      landing_h1_main: 'फेंकना नहीं।',
      landing_h1_tagline: 'फिर से सोचना है।',
      landing_caption: 'रीसायकल योग्य सामग्री को आपके दरवाज़े से पुनर्प्राप्ति शृंखला तक पहुँचाने का बेहतर और पारदर्शी माध्यम।',

      // Workspace Tabs
      tab_materials_collection: 'सामग्रियां और संग्रह',
      tab_contributions: 'योगदान',
      tab_collection_map: 'संग्रह मानचित्र',
      tab_inventory: 'इन्वेंटरी (स्टॉक)',
      tab_profile_impact: 'प्रोफ़ाइल और प्रभाव',
      tab_my_inventory: 'मेरी इन्वेंटरी',
      tab_company_needs: 'कंपनियों की मांग',
      tab_requests: 'अनुरोध',
      tab_material_marketplace: 'सामग्री बाज़ार',
      tab_requirements: 'मांग / आवश्यकताएं',
      tab_bookings: 'बुकिंग',
      tab_company_profile: 'कंपनी प्रोफ़ाइल',

      // Common Actions & Buttons
      btn_add_material: 'सामग्री जोड़ें',
      btn_add_photo: 'फ़ोटो से जोड़ें',
      btn_request_collection: 'संग्रह का अनुरोध करें',
      btn_request_another: 'अन्य संग्रह का अनुरोध करें',
      btn_accept: 'स्वीकार करें',
      btn_decline: 'अस्वीकार करें',
      btn_mark_collected: 'एकत्रित चिह्नित करें',
      btn_preview_route: 'चयनित मार्ग देखें',
      btn_new_requirement: 'नई मांग दर्ज करें',
      btn_publish_requirement: 'मांग प्रकाशित करें',
      btn_reserve_material: 'सामग्री आरक्षित करें',
      btn_confirm_handover: 'हस्तांतरण की पुष्टि करें',
      btn_save_changes: 'बदलाव सहेजें',
      btn_save_company: 'कंपनी प्रोफ़ाइल सहेजें',
      btn_cancel: 'रद्द करें',
      btn_confirm: 'पुष्टि करें',
      btn_close: 'बंद करें',
      btn_continue: 'आगे बढ़ें',
      btn_play_again: 'पुनः खेलें',
      btn_restart_demo: 'नमूना यात्रा रीसेट करें',
      btn_export_records: 'रिकॉर्ड निर्यात करें',
      btn_show_all: 'सभी सामग्रियां दिखाएं',
      btn_go_household: 'घरेलू पृष्ठ पर जाएं',
      btn_explore_materials: 'सामग्रियां देखें',
      btn_choose_photo: 'फ़ोटो चुनें',
      btn_confirm_material: 'सामग्री की पुष्टि करें',
      btn_create_requirement: 'मांग बनाएं',
      btn_mandi_rates: 'मंडी स्क्रैप दरें',
      btn_epr_audit: 'ईपीआर ऑडिट',
      btn_instant_upi: 'तत्काल यूपीआई भुगतान',
      btn_print_pdf: 'प्रिंट / पीडीएफ सहेजें',

      // Statuses & Badges
      status_available: 'उपलब्ध',
      status_requested: 'अनुरोधित',
      status_pending: 'प्रतीक्षारत',
      status_accepted: 'स्वीकृत',
      status_collected: 'एकत्रित',
      status_reserved: 'आरक्षित',
      status_transferred: 'हस्तांतरित',
      status_fulfilled: 'पूर्ण',
      status_partially_fulfilled: 'आंशिक रूप से पूर्ण',
      status_recorded: 'दर्ज',
      status_sample: 'नमूना',
      status_illustrative: 'चित्रात्मक',
      status_active: 'सक्रिय',
      status_route_stop: 'मार्ग ठहराव',

      // Metric Labels
      metric_available_collection: 'संग्रह के लिए उपलब्ध',
      metric_est_value: 'अनुमानित मूल्य · नमूना',
      metric_collected_so_far: 'अब तक एकत्रित',
      metric_local_partners: 'स्थानीय भागीदार',
      metric_material_recorded: 'दर्ज सामग्री',
      metric_collected_by_partner: 'भागीदार द्वारा एकत्रित',
      metric_transferred_to_recycler: 'रीसाइक्लर को सौंपा',
      metric_not_verified: 'सत्यापित नहीं',
      metric_actual_recycling: 'वास्तविक पुनर्चक्रण',
      metric_open_opportunities: 'उपलब्ध अवसर',
      metric_avail_inventory: 'उपलब्ध एकत्रित स्टॉक',
      metric_reserved_transfer: 'हस्तांतरण के लिए आरक्षित',
      metric_transferred_recyclers: 'रीसाइक्लर्स को हस्तांतरित',
      metric_held_or_transferred: 'रखी या सौंपी गई सामग्री',
      metric_material_transferred: 'हस्तांतरित सामग्री',
      metric_collections_recorded: 'दर्ज किए गए संग्रह',
      metric_avail_marketplace: 'बाज़ार में उपलब्ध',
      metric_open_requirements: 'सक्रिय आवश्यकताएं',
      metric_reserved_for_you: 'आपके लिए आरक्षित',
      metric_confirmed_transfers: 'पुष्टीकृत हस्तांतरण',
      metric_active_reservations: 'सक्रिय आरक्षण',
      metric_reserved_quantity: 'आरक्षित मात्रा',
      metric_sample_material_lots: 'नमूना सामग्री लॉट',

      // Household Section
      house_title: 'आपका घर / लाजपत नगर, दिल्ली',
      house_h1: 'थोड़ी सी जगह।<br>एक नई शुरुआत।',
      house_copy: 'रीसायकल होने वाली चीजें अलग रखें। सही हाथों को इन्हें आगे बढ़ाने दें।',
      house_your_materials: 'आपकी सामग्रियां',
      house_recorded_materials: 'दर्ज सामग्रियां',
      house_empty_title: 'एक नई शुरुआत के लिए जगह।',
      house_empty_desc: 'आपकी रीसायकल योग्य सामग्रियां यहाँ दिखाई देंगी।',
      house_your_collection: 'आपका संग्रह',
      house_ready_prefix: 'संग्रह भागीदार के लिए तैयार।',
      house_waiting_partner: 'संग्रह भागीदार की प्रतीक्षा है',
      house_accepted_partner: 'संग्रह भागीदार द्वारा स्वीकार किया गया',
      house_collection_recorded: 'संग्रह दर्ज किया गया',
      house_step_requested: 'अनुरोधित',
      house_step_accepted: 'स्वीकृत',
      house_step_collected: 'एकत्रित',
      house_desc_pending: 'लाजपत नगर · इलाका स्तर का अनुरोध',
      house_desc_accepted: 'सामग्री सौंपे जाने की प्रतीक्षा में है।',
      house_desc_collected: 'सामग्री अब संग्रह भागीदार के स्टॉक में है।',
      house_good_hands: 'भरोसेमंद हाथ, आपके पास।',
      house_local_partners_desc: 'आपके क्षेत्र के संग्रह भागीदार।',
      house_note_locality: 'आपका अनुरोध इलाका स्तर पर दिखाई देता है। कबाड़ीवाला इसे स्वीकार करता है; यह प्रोटोटाइप सीधे किसी नामित व्यक्ति को बुक नहीं करता।',
      house_guide_heading: 'थोड़ा सा अलग रखें। एक संभावना बचाएं।',
      house_guide_1_h3: 'साफ़ और सूखा रखें',
      house_guide_1_p: 'बोतलें और डिब्बे खाली करें। कागज़ और गत्ते को गीलेपन और खाने से दूर रखें।',
      house_guide_2_h3: 'इन्हें शृंखला में बनाए रखें',
      house_guide_2_p: 'पीईटी प्लास्टिक, गत्ता, कागज़, एल्युमिनियम, काँच और लकड़ी। स्थानीय कबाड़ीवाले से स्वीकार्यता की जांच करें।',
      house_guide_3_h3: 'इन्हें अलग रखें',
      house_guide_3_p: 'गीला कचरा, सेनेटरी वेस्ट और खतरनाक चीजें रीसायकल बंडल में न डालें।',

      // Contributions Section
      contrib_title: 'शृंखला में आपका योगदान',
      contrib_h1: 'छोटे कदम। वास्तविक रिकॉर्ड।',
      contrib_copy: 'प्रत्येक योगदान एक संग्रह या हस्तांतरण से प्रमाणित है — कोई मनमाना दावा नहीं।',
      contrib_journey: 'आपकी सामग्री की यात्रा',
      contrib_demo_record: 'इस प्रदर्शन में दर्ज',
      contrib_meaning: 'इसका क्या अर्थ है',
      contrib_meaning_note: 'संग्रह सामग्री को शृंखला में बनाए रखता है। हस्तांतरण अगले संरक्षक का प्रमाण देता है। रीसाइक्लिंग के लिए अलग सबूत चाहिए।',
      contrib_handover_title: 'यह एक सुपुर्दगी है, अंतिम पड़ाव नहीं।',
      contrib_handover_desc: 'आज सबसे मज़बूत दावा वही है जिसे हम वास्तव में दर्ज कर सकते हैं।',

      // Collector Section
      col_title: 'कबाड़ीवाला / संग्रह भागीदार, दिल्ली',
      col_h1: 'अगला भरोसेमंद हाथ<br>आपका हो सकता है।',
      col_copy: 'संग्रह के लिए तैयार सामग्री खोजें, एक-एक मोहल्ला करके।',
      col_map_heading: 'दिल्ली, मोहल्लों के अनुसार।',
      col_locality_view: 'इलाका स्तर का दृश्य',
      col_map_note: 'यह एक चित्रात्मक पूर्वावलोकन है, सड़क नेविगेशन नहीं। घरों के पते पूरी तरह निजी हैं।',
      col_empty_h3: 'कोई खुला संग्रह अनुरोध नहीं है।',
      col_empty_p: 'पूरी यात्रा देखने के लिए घरेलू पृष्ठ से सामग्रियां जोड़ें और अनुरोध करें।',
      col_preview_heading: 'इलाका पूर्वावलोकन',
      col_mixed_bundle: 'मिश्रित रीसायकल योग्य बंडल',
      col_bundle_desc: 'कागज़, पीईटी और गत्ता · इलाका स्तर नमूना',
      col_quote_waiting: 'मूल्य: दर प्रतीक्षारत',
      col_sample_estimate: 'अनुमानित दर',
      col_no_live_quote: 'दर प्रतीक्षारत',
      col_inv_title: 'एकत्रित सामग्रियां',
      col_inv_h1: 'अगले हाथ में जाने के लिए तैयार।',
      col_inv_copy: 'आपकी एकत्रित सामग्री रीसाइक्लर्स को दिखाई देती है।',
      col_custody_h2: 'आपके अधिकार में सामग्री',
      col_th_material: 'सामग्री',
      col_th_quantity: 'मात्रा',
      col_th_locality: 'इलाका',
      col_th_status: 'स्थिति',
      col_th_action: 'कार्रवाई',
      col_demand_title: 'मांग / दिल्ली',
      col_demand_h1: 'किसी को आवश्यकता है<br>जो आपके पास पहले से है।',
      col_demand_copy: 'रीसाइक्लर की आवश्यकताएं, जो संग्रह शृंखला से जुड़ी हैं।',
      col_open_reqs: 'खुली आवश्यकताएं',
      col_no_open_reqs: 'कोई खुली आवश्यकता नहीं है।',
      col_no_open_reqs_p: 'रीसाइक्लर की नई मांग यहाँ दिखाई देगी।',
      col_profile_title: 'कबाड़ीवाला / प्रोफ़ाइल',
      col_profile_h1: 'एक जाना-पहचाना चेहरा।<br>एक अहम कड़ी।',
      col_profile_copy: 'कबाड़ीवाले और संग्राहक हमारे रीसाइक्लिंग तंत्र की रीढ़ हैं।',
      col_partner_heading: 'संग्रह भागीदार',
      col_sample_profile: 'नमूना प्रोफ़ाइल',
      col_role_desc: 'कबाड़ीवाला / संग्राहक · दिल्ली',
      col_materials_accepted: 'स्वीकृत सामग्रियां',
      col_all_six_mats: 'पीईटी, गत्ता, कागज़, एल्युमिनियम, काँच और लकड़ी',
      col_service_localities: 'सेवा क्षेत्र',
      col_delhi_areas: 'लाजपत नगर, करोल बाग और साकेत',
      col_trust_chain: 'विश्वास शृंखला में बनता है।',
      col_trust_note: 'यह प्रोटोटाइप कबाड़ीवाले और संग्राहक को एक साथ दिखाता है। वास्तविक व्यवस्था में वे अलग हो सकते हैं।',
      col_trust_muted: 'प्रोफ़ाइल संकेतक प्रदर्शन रिकॉर्ड हैं, कोई काल्पनिक रेटिंग या सत्यापन दावा नहीं।',

      // Recycler Section
      rec_title: 'पुनर्चक्रणकर्ता / दिल्ली',
      rec_h1: 'नया जीवन<br>सही सामग्री से शुरू होता है।',
      rec_copy: 'स्थानीय कबाड़ीवालों द्वारा एकत्रित सामग्री खोजें।',
      rec_ready_life: 'सामग्री, अपने नए रूप के लिए तैयार।',
      rec_collected_inv: 'एकत्रित स्टॉक',
      rec_collected_mat: 'एकत्रित सामग्री',
      rec_no_lots_h3: 'कोई उपलब्ध लॉट नहीं है।',
      rec_no_lots_p: 'मेल खाने वाली एकत्रित सामग्री यहाँ दिखाई देगी।',
      rec_req_title: 'आपकी सामग्री मांग',
      rec_req_h1: 'नए जीवन को<br>एक स्पष्ट दिशा दें।',
      rec_req_copy: 'संग्रह भागीदारों को बताएं कि आपकी कंपनी को किस सामग्री की आवश्यकता है।',
      rec_your_reqs: 'आपकी आवश्यकताएं',
      rec_req_units: 'सामग्री अनुरोध',
      rec_still_needed: 'अभी आवश्यक है · दिल्ली',
      rec_fulfilled_ratio: 'पूर्ण',
      rec_book_title: 'आरक्षित → हस्तांतरित',
      rec_book_h1: 'आरक्षण एक वादा है।<br>सुपुर्दगी एक पक्का रिकॉर्ड है।',
      rec_book_copy: 'बुकिंग सामग्री को तुरंत आरक्षित करती है। सामग्री प्राप्त होने पर ही पुष्टि करें।',
      rec_your_bookings: 'आपकी बुकिंग',
      rec_th_partner: 'भागीदार',
      rec_th_handover: 'हस्तांतरण',
      rec_no_bookings_h3: 'अभी कोई बुकिंग नहीं है।',
      rec_no_bookings_p: 'सामग्री बाज़ार में उपयुक्त लॉट आरक्षित करें।',
      rec_comp_title: 'पुनर्चक्रणकर्ता / कंपनी',
      rec_comp_h1: 'एक नई शुरुआत को<br>अपना नाम दें।',
      rec_comp_copy: 'आपके द्वारा प्रकाशित मांग के साथ आपकी कंपनी का विवरण जुड़ा रहता है।',
      rec_field_name: 'कंपनी का नाम',
      rec_field_locality: 'कंपनी का क्षेत्र / इलाका',
      rec_field_contact: 'कंपनी संपर्क ईमेल (वैकल्पिक)',
      rec_note_live: 'इस रीसाइक्लर के सीधे प्रदर्शन प्रोफ़ाइल में सहेजा गया।',
      rec_demand_meets: 'मांग का मौजूदा तंत्र से मिलन।',
      rec_demand_desc: 'सामग्री की मांग प्रकाशित करें, एकत्रित स्टॉक खोजें, लॉट आरक्षित करें और हस्तांतरण दर्ज करें।',

      // Identity Modal
      identity_title: 'प्रोफ़ाइल',
      identity_prompt_live: 'अपना नाम दर्ज करें और अपना दिल्ली का इलाका चुनें। यह एक सरल प्रदर्शन प्रोफ़ाइल बनाता है—पासवर्ड की आवश्यकता नहीं है।',
      identity_prompt_serve: 'अपना नाम दर्ज करें और अपना सेवा क्षेत्र चुनें। यह एक सरल प्रदर्शन प्रोफ़ाइल बनाता है—पासवर्ड की आवश्यकता नहीं है।',
      identity_label_name: 'नाम',
      identity_ph_name: 'आपका नाम',
      identity_label_area: 'इलाका',
      identity_label_service_area: 'सेवा क्षेत्र',
      identity_saving: 'प्रोफ़ाइल सहेजी जा रही है...',

      // Areas
      area_north: 'उत्तर दिल्ली',
      area_north_west: 'उत्तर पश्चिम',
      area_west: 'पश्चिम दिल्ली',
      area_south_west: 'दक्षिण पश्चिम',
      area_central: 'मध्य दिल्ली',
      area_new_delhi: 'नई दिल्ली',
      area_north_east: 'उत्तर पूर्व',
      area_shahdara: 'शाहदरा',
      area_east: 'पूर्वी दिल्ली',
      area_south_east: 'दक्षिण पूर्व',
      area_south: 'दक्षिण दिल्ली',
      area_lajpat: 'लाजपत नगर',
      area_karol: 'करोल बाग',
      area_saket: 'साकेत',

      // Modals & Dialogs
      modal_add_mat: 'सामग्री जोड़ें',
      modal_edit_mat: 'सामग्री संपादित करें',
      modal_from_photo: 'फ़ोटो से पहचानें',
      modal_photo_help: 'पहचानने के लिए एक प्रमुख सामग्री चुनें।',
      modal_rec_result: 'पहचान परिणाम',
      modal_waiting_photo: 'फ़ोटो की प्रतीक्षा है',
      modal_suggestion_here: 'सामग्री का सुझाव यहाँ दिखाई देगा।',
      modal_confirm_label: 'मैं इस सामग्री की पहचान की पुष्टि करता हूँ।',
      modal_field_mat: 'सामग्री',
      modal_field_weight: 'वज़न (किग्रा)',
      modal_placeholder_weight: 'जैसे 2.5',
      modal_remove_title: 'क्या यह सामग्री हटाना चाहते हैं?',
      modal_remove_copy: 'केवल उपलब्ध सामग्री ही आपकी घरेलू इन्वेंटरी से हटाई जा सकती है।',
      modal_new_req_title: 'आपकी कंपनी को किस सामग्री की आवश्यकता है?',
      modal_req_mat: 'आवश्यक सामग्री',
      modal_req_weight: 'आवश्यक वज़न (किग्रा)',
      modal_req_weight_ph: 'जैसे 100',
      modal_req_min: 'न्यूनतम बुकिंग (किग्रा, वैकल्पिक)',
      modal_req_min_ph: 'जैसे 25',
      modal_req_note: 'यह मांग इस प्रदर्शन में कबाड़ीवाले को दिखाई देती है।',
      modal_reserve_title: 'यह सामग्री आरक्षित करें',
      modal_match_req: 'अपनी मांग से मिलान करें',
      modal_qty_reserve: 'आरक्षित करने की मात्रा (किग्रा)',
      modal_reserve_note: 'मात्रा तुरंत आरक्षित हो जाती है। सामग्री आपके द्वारा सुपुर्दगी की पुष्टि के बाद ही हस्तांतरित होती है।',
      modal_need_req_note: 'इस सामग्री को आरक्षित करने से पहले आपको एक मेल खाती मांग बनानी होगी।',
      modal_decline_title: 'क्या यह संग्रह अस्वीकार करना चाहते हैं?',
      modal_decline_copy: 'इस प्रदर्शन में सामग्री पुनः घरेलू उपलब्ध इन्वेंटरी में लौट जाएगी।',
      modal_record_col_title: 'क्या यह संग्रह दर्ज करना चाहते हैं?',
      modal_record_col_copy: 'पुष्टि करें कि सामग्री कबाड़ीवाले को सौंप दी गई है। यह संग्रह का रिकॉर्ड है, रीसाइक्लिंग का नहीं।',
      modal_confirm_handover_title: 'सामग्री हस्तांतरण की पुष्टि करें?',
      modal_confirm_handover_copy: 'यह बुकिंग पूरी करता है और आपकी कंपनी को हस्तांतरण दर्ज करता है। यह रीसाइक्लिंग का सत्यापन नहीं है।',
      modal_restart_title: 'क्या प्रदर्शन पुनः आरंभ करना चाहते हैं?',
      modal_restart_copy: 'यह वर्तमान यात्रा को साफ़ करेगा और नमूना रिकॉर्ड पुनर्स्थापित करेगा।',
      sample_records_notice: 'प्रदर्शन के लिए नमूना रिकॉर्ड। जोड़ी गई सामग्री का कोई लाइव कोट नहीं है। संग्रह और हस्तांतरण अलग-अलग दर्ज किए जाते हैं; कोई भी रीसाइक्लिंग को सत्यापित नहीं करता है।',

      // Enhancement Modals (Mandi, Scale, EPR)
      mandi_modal_title: 'लाइव दिल्ली स्क्रैप मंडी दरें',
      mandi_modal_bench: 'संकेतक थोक बाज़ार बेंचमार्क',
      mandi_table_mat: 'सामग्री का प्रकार',
      mandi_table_grade: 'मानक गुणवत्ता',
      mandi_table_rate: 'मंडी दर (₹/किग्रा)',
      mandi_grade_pet: 'साफ़ बंडल / छंटाई किया हुआ',
      mandi_grade_cardboard: 'पुराना कार्टन / सूखा गत्ता (OCC)',
      mandi_grade_paper: 'अख़बार एवं दफ़्तरी कागज़',
      mandi_grade_aluminium: 'डिब्बे, पुर्जे एवं कतरन',
      mandi_grade_glass: 'टूटा काँच व साबुत बोतलें',
      mandi_grade_wood: 'लकड़ी के बक्से व पट्टे',
      mandi_modal_note: 'दरें मायापुरी, सीलमपुर और ग़ाज़ीपुर थोक मंडियों के आधार पर हैं। भौतिक कांटे पर नमी और अशुद्धि के अनुसार मूल्य समायोजित होता है।',
      scale_modal_title: 'कांटा वज़न एवं अशुद्धि मिलान',
      scale_modal_sub: 'भौतिक कांटे पर वज़न मापें एवं तत्काल भुगतान जारी करने से पहले अशुद्धि की जांच करें।',
      scale_household_est: 'घरेलू अनुमान',
      scale_field_scale: 'कांटे का सकल वज़न (किग्रा)',
      scale_field_contam: 'कचरा / अशुद्धि कटौती (%)',
      scale_net_weight: 'शुद्ध देय वज़न',
      scale_net_payout: 'देय कुल राशि',
      scale_instant_upi: 'तत्काल यूपीआई भुगतान',
      scale_confirm_btn: 'कांटा मिलान की पुष्टि करें एवं संग्रह पूरा करें',
      epr_modal_title: 'डिजिटल ईपीआर शृंखला प्रमाण-पत्र',
      epr_sub: 'क्रिप्टोग्राफ़िक विस्तारित उत्पादक उत्तरदायित्व (EPR) ऑडिट शृंखला',
      epr_label_id: 'प्रमाण-पत्र संख्या',
      epr_label_time: 'दर्ज करने का समय',
      epr_label_actor: 'उत्तरदायी संरक्षक',
      epr_label_entity: 'इकाई पहचान पत्र',
      epr_label_hash: 'एसएचए-२५६ इवेंट हैश',
      epr_label_prev: 'पिछला लेज़र हैश',
      epr_label_integrity: 'शृंखला अखंडता',
      epr_verified: 'क्रिप्टोग्राफ़िक रूप से सत्यापित (अपरिवर्तनीय)',
      epr_certified: 'भारतीय प्लास्टिक अपशिष्ट प्रबंधन नियमावली (CPCB PWM Schedule II) के अनुरूप फिर (PHIR) रिलेशनल लेज़र द्वारा सत्यापित एवं स्थायी रूप से दर्ज।',

      // Dynamic Error Messages & Live Notifications
      err_only_available_edit: 'केवल उपलब्ध घरेलू सामग्री ही संपादित की जा सकती है',
      err_only_available_remove: 'केवल उपलब्ध घरेलू सामग्री ही हटाई जा सकती है',
      err_at_least_one: 'कम से कम एक सामग्री आवश्यक है',
      err_belong_household: 'सभी सामग्रियां घरेलू परिवार से संबंधित और उपलब्ध होनी चाहिए',
      err_only_pending_accept: 'केवल लंबित अनुरोध ही स्वीकार किए जा सकते हैं',
      err_only_pending_reject: 'केवल लंबित अनुरोध ही अस्वीकार किए जा सकते हैं',
      err_must_accept_first: 'संग्रह से पहले इस कबाड़ीवाले द्वारा अनुरोध स्वीकार किया जाना आवश्यक है',
      err_min_between_zero: 'न्यूनतम मात्रा शून्य और कुल मात्रा के बीच होनी चाहिए',
      err_active_req_exists: 'इस सामग्री के लिए पहले से ही एक सक्रिय मांग मौजूद है',
      err_req_not_found: 'रीसाइक्लर के लिए मांग नहीं मिली',
      err_booking_exceeds: 'अनुरोधित बुकिंग उपलब्ध या आवश्यक मात्रा से अधिक है',
      err_booking_below_min: 'अनुरोधित बुकिंग न्यूनतम आवश्यक मात्रा से कम है',
      err_booking_not_found: 'रीसाइक्लर के लिए बुकिंग नहीं मिली',
      err_only_confirmed_complete: 'केवल पुष्टीकृत बुकिंग ही पूर्ण की जा सकती है',
      err_reserved_no_longer_avail: 'आरक्षित सामग्री अब उपलब्ध नहीं है',
      err_profile_not_found: 'प्रोफ़ाइल नहीं मिली',
      err_material_not_found: 'सामग्री नहीं मिली',
      err_collection_req_not_found: 'संग्रह अनुरोध नहीं मिला',
      live_saved_records: 'पुनर्प्राप्ति रिकॉर्ड में सहेजा गया',
      live_profile_ready: 'कंपनी प्रोफ़ाइल तैयार है',
      live_inventory_refresh: 'इन्वेंटरी को रीफ्रेश करने की आवश्यकता है',
      live_recovery_records: 'सक्रिय पुनर्प्राप्ति रिकॉर्ड',
      // === Indiathon 2026 Startup MVP & Business Layer (hi) ===
      nav_pitch_deck: '🎙️ 2-मिनट पिच डेक',
      nav_pricing_model: '💼 मूल्य निर्धारण और मॉडल',
      nav_mandi_rates: '⚖️ मंडी स्क्रैप दरें',
      btn_epr_audit: '🌱 ईपीआर ऑडिट',
      btn_plan_route: '🗺️ पिकअप रूट बनाएं',
      btn_preview_route: 'चयनित मार्ग देखें',
      route_stop_lbl: 'रूट स्टॉप',
      route_stops_selected: 'स्टॉप चयनित',
      route_total_distance: 'कुल दूरी',
      route_estimated_trip: 'अनुमानित समय',
      route_privacy_note: 'सेंट्रोइड अस्पष्टता द्वारा गोपनीयता सुरक्षित',
      startup_hero_badge: '⚡ इंडियाथॉन 2026 स्टार्टअप MVP · ई-सेल IIIT भुवनेश्वर द्वारा संचालित',
      startup_cpcb_badge: 'सीपीसीबी अनुसूची II ऑडिट समानता',
      startup_hero_subtitle: 'भारत की ₹1.1 लाख करोड़ चक्रीय अर्थव्यवस्था का ऑपरेटिंग सिस्टम',
      ticker_mat_tracked: 'ट्रैक की गई पुनर्चक्रण योग्य सामग्री',
      ticker_direct_payouts: 'संग्रहकर्ताओं को सीधा भुगतान',
      ticker_cpcb_parity: 'SHA-256 सीपीसीबी ऑडिट समानता',
      ticker_co2_diverted: 'सत्यापित CO2e उत्सर्जन में बचत',
      ticker_verified_pct: '100% सत्यापित',
      biz_model_heading: '💼 वेंचर बिजनेस मॉडल और यूनिट इकोनॉमिक्स',
      biz_model_sub: 'कैसे फिर (Phir) असंगठित कबाड़ संग्रह को उच्च मार्जिन उद्यम अनुपालन और भरोसेमंद हरित आपूर्ति श्रृंखला में बदलता है।',
      sim_heading: 'इंटरैक्टिव वॉल्यूम और राजस्व सिमुलेटर',
      sim_sub: 'मासिक प्रसंस्करण मात्रा का अनुकरण करने के लिए स्लाइड करें',
      sim_feedstock_label: 'पुनर्चक्रित सामग्री जीएमवी (GMV)',
      sim_collector_gain_label: 'कबाड़ीवाला आय वृद्धि (+28%)',
      sim_platform_rev_label: 'फिर (Phir) प्लेटफ़ॉर्म राजस्व',
      sim_co2_offset_label: 'रोकी गई CO2e उत्सर्जन मात्रा',
      pricing_tier_household: '🏠 उपभोक्ता / परिवार',
      pricing_free_forever: 'हमेशा के लिए मुफ़्त',
      pricing_household_desc: 'उचित मूल्य के साथ सीधे घर से स्क्रैप पिकअप।',
      pricing_household_f1: 'लाइव मंडी मूल्य पारदर्शिता',
      pricing_household_f2: 'डिजिटल तराजू शुद्ध वजन कटौती',
      pricing_household_f3: 'घर पर तत्काल यूपीआई (UPI) भुगतान',
      pricing_household_f4: 'शून्य पिकअप शुल्क',
      pricing_btn_test_household: 'घरेलू डेमो आज़माएं',
      pricing_tier_aggregator: '🚛 फिर एग्रीगेटर प्रो',
      pricing_badge_core_saas: 'कोर सास राजस्व',
      pricing_per_month: '/ महीना',
      pricing_aggregator_desc: 'कबाड़ीवालों और छोटे डीलरों के लिए मोबाइल ऑपरेटिंग सिस्टम।',
      pricing_aggregator_f1: 'मल्टी-स्टॉप रूट प्लानिंग और ईंधन बचत',
      pricing_aggregator_f2: 'सीधे रीसाइक्लिंग मिल बैच एकत्रीकरण',
      pricing_aggregator_f3: 'डिजिटल तराजू और यूपीआई भुगतान बहीखाता',
      pricing_aggregator_f4: 'पारदर्शी मंडी भाव की ताज़ा जानकारी',
      pricing_btn_start_pro: '14-दिवसीय निःशुल्क पायलट शुरू करें',
      pricing_tier_enterprise: '🏭 एंटरप्राइज ब्रांड अनुपालन',
      pricing_badge_high_margin: 'उच्च मार्जिन एंटरप्राइज',
      pricing_enterprise_sub: '/ माह + ₹1.5/किलो ऑडिट शुल्क',
      pricing_enterprise_desc: 'एफएमसीजी और इलेक्ट्रॉनिक्स के लिए टर्नकी विस्तारित उत्पादक उत्तरदायित्व (ईपीआर) अनुपालन।',
      pricing_enterprise_f1: 'सीपीसीबी अनुसूची II सत्यापन योग्य ऑडिट प्रमाणपत्र',
      pricing_enterprise_f2: 'छेड़छाड़-मुक्त SHA-256 कस्टडी श्रृंखला',
      pricing_enterprise_f3: 'समर्पित आपूर्ति श्रृंखला खाता प्रबंधक',
      pricing_enterprise_f4: 'रीसाइक्लर बैच गुणवत्ता प्रमाणपत्र',
      pricing_btn_request_pilot: 'एंटरप्राइज प्रस्ताव (RFP) का अनुरोध करें',
      valprop_heading: 'वेंचर-समर्थित स्केलेबिलिटी क्यों मायने रखती है',
      valprop_sub: 'असंगठित सूक्ष्म उद्यमियों को फॉर्च्यून 500 ईएसजी अनुपालन से जोड़ना।',
      valprop_card1_title: '🏛️ नियामक अवसर और समर्थन',
      valprop_card1_desc: 'कड़े सीपीसीबी प्लास्टिक कचरा नियम भारी जुर्माने के साथ 100% सत्यापन योग्य रीसाइक्लिंग अनिवार्य करते हैं।',
      valprop_card2_title: '🤝 विकेंद्रीकृत पैमाना',
      valprop_card2_desc: '25 लाख कबाड़ीवालों को हटाने के बजाय, फिर उन्हें सास टूल्स से सशक्त बनाकर उनकी कमाई 28% बढ़ाता है।',
      valprop_card3_title: '🔒 विश्वसनीय ऑडिट ट्रेल',
      valprop_card3_desc: 'घर से पिकअप से लेकर रीसाइक्लिंग भट्टी तक प्रत्येक किलोग्राम संस्थागत जवाबदेही के लिए क्रिप्टोग्राफ़िक रूप से हैश किया जाता है।',
      pitch_deck_title: 'फिर (Phir) — 2-मिनट वेंचर स्टार्टअप पिच',
      pitch_btn_prev: '⬅ पिछला',
      pitch_btn_next: 'अगली स्लाइड ➔',
      pitch_btn_rfp: '15-मिनट एंटरप्राइज पायलट प्रस्ताव बुक करें',
      pitch_kicker_0: 'गंभीर समस्या',
      pitch_title_0: '₹1.1 लाख करोड़ की असंगठित रीसाइक्लिंग व्यवस्था अव्यवस्थित है',
      pitch_b0_1: 'भारत का 90% सूखा कचरा 25 लाख असंगठित कबाड़ीवालों और कचरा बीनने वालों द्वारा संभाला जाता है।',
      pitch_b0_2: 'बिचौलिए गलत तराजू और मनमानी नकद कटौती करके अनौपचारिक श्रमिकों का शोषण करते हैं।',
      pitch_b0_3: 'एफएमसीजी ब्रांड कड़े सीपीसीबी ईपीआर नियमों का सामना करते हैं लेकिन नकली कागजी प्रमाणपत्रों पर निर्भर हैं।',
      pitch_kicker_1: 'हमारा समाधान',
      pitch_title_1: 'फिर: चक्रीय आपूर्ति श्रृंखला के लिए रीयल-टाइम ऑपरेटिंग सिस्टम',
      pitch_b1_1: 'उपभोक्ता ऐप: लाइव मंडी बेंचमार्क मूल्य पारदर्शिता के साथ घर से स्क्रैप पिकअप।',
      pitch_b1_2: 'कलेक्टर ओएस: रूट प्लानिंग, डिजिटल हैंगिंग स्केल मिलान और तत्काल यूपीआई भुगतान।',
      pitch_b1_3: 'एंटरप्राइज रजिस्ट्री: सीपीसीबी अनुसूची II के अनुरूप छेड़छाड़-मुक्त SHA-256 कस्टडी प्रमाणपत्र।',
      pitch_kicker_2: 'लाइव उत्पाद और कार्यप्रणाली',
      pitch_title_2: 'एंड-टू-एंड पूरी तरह कार्यात्मक मार्केटप्लेस',
      pitch_b2_1: 'तीनों पक्षों की कार्यप्रणाली पूरी तरह चालू: उपभोक्ता, कबाड़ीवाला और रीसाइक्लर।',
      pitch_b2_2: 'दिल्ली मंडी स्क्रैप मूल्य सूचकांकों के साथ सीधा लाइव जुड़ाव।',
      pitch_b2_3: 'अंग्रेजी, हिन्दी और ओड़िया में बिना पेज रीलोड के तत्काल भाषा परिवर्तन।',
      pitch_kicker_3: 'व्यापार और राजस्व मॉडल',
      pitch_title_3: 'उच्च मार्जिन एंटरप्राइज सास के साथ त्रि-पक्षीय मुद्रीकरण',
      pitch_b3_1: 'B2C उपभोक्ता: घरेलू पुनर्चक्रण योग्य वस्तुओं पर शून्य कमीशन के साथ निःशुल्क पिकअप।',
      pitch_b3_2: 'B2B कबाड़ीवाला सास: रूट प्लानिंग और व्यापार बहीखाते के लिए ₹499/माह सदस्यता।',
      pitch_b3_3: 'एंटरप्राइज ईपीआर अनुपालन: ब्रांड ट्रैसेबिलिटी के लिए ₹14,999/माह + ₹1.5/किलो ऑडिट शुल्क।',
      pitch_kicker_4: 'प्रतिस्पर्धी सुरक्षा कवच (MOAT)',
      pitch_title_4: 'फिर क्यों जीतेगा: नियामक और नेटवर्क का मजबूत सुरक्षा कवच',
      pitch_b4_1: 'अनौपचारिक साझेदार समावेशन: भारी वाहनों के बजाय मौजूदा कबाड़ीवालों को सशक्त बनाना।',
      pitch_b4_2: 'पूर्ण श्रृंखला ट्रैसेबिलिटी: घर के दरवाजे से रीसाइक्लिंग कारखाने तक क्रिप्टोग्राफ़िक प्रमाण।',
      pitch_b4_3: 'अति-स्थानीय घनत्व: परिवहन उत्सर्जन को कम करने वाला क्लस्टर-आधारित एकत्रीकरण।',
      pitch_kicker_5: 'इंडियाथॉन विज़न और विकास योजना',
      pitch_title_5: 'इंडियाथॉन 2026 प्रतिबद्धता और विस्तार रोडमैप',
      pitch_b5_1: 'दिल्ली-एनसीआर और भुवनेश्वर में 100 सत्यापित कबाड़ीवालों के साथ प्रारंभिक पायलट का लक्ष्य।',
      pitch_b5_2: '5 प्रमुख शहरों में 5,000 मीट्रिक टन/माह सत्यापित प्रसंस्करण क्षमता तक विस्तार।',
      pitch_b5_3: 'लॉन्च के लिए तैयार: बिना किसी नकली मॉकअप के वास्तविक प्रोडक्शन-ग्रेड आर्किटेक्चर।',
      pilot_modal_title: '14-दिवसीय एंटरप्राइज सैंडबॉक्स पायलट का अनुरोध करें',
      pilot_modal_sub: 'फिर (Phir) की सत्यापित डिजिटल आपूर्ति श्रृंखला के साथ 100% सीपीसीबी ईपीआर अनुपालन पूरा करने वाले अग्रणी ब्रांडों में शामिल हों।',
      pilot_lbl_org: 'संगठन / ब्रांड का नाम *',
      pilot_lbl_email: 'आपका आधिकारिक ईमेल *',
      pilot_lbl_volume: 'अनुमानित मासिक पैकेजिंग कचरा (मीट्रिक टन) *',
      pilot_lbl_category: 'लक्षित अनुपालन श्रेणी *',
      pilot_lbl_city: 'पायलट शहर / इलाका *',
      pilot_opt_cat1: 'श्रेणी I: कठोर प्लास्टिक (HDPE/PP/PET)',
      pilot_opt_cat2: 'श्रेणी II: लचीला मल्टी-लेयर प्लास्टिक',
      pilot_opt_cat3: 'श्रेणी III: बहुस्तरीय पैकेजिंग',
      pilot_opt_paper: 'औद्योगिक कार्डबोर्ड और पेपर पल्प',
      pilot_opt_ewaste: 'ई-कचरा / धातु मिश्र धातु',
      pilot_btn_submit: 'सैंडबॉक्स पायलट एक्सेस का अनुरोध करें',
      pilot_success_msg: 'सैंडबॉक्स पायलट अनुरोध प्राप्त हुआ! हमारी एंटरप्राइज टीम 24 घंटे के भीतर आपके संगठन से संपर्क करेगी।',
    },

    // ଓଡ଼ିଆ (Odia)
    od: {
      lang_name: 'ଓଡ଼ିଆ',
      lang_code: 'OD',
      lang_native: 'ଓଡ଼ିଆ',

      // Brand & Navigation
      choose_role: 'ଆପଣଙ୍କ ଭୂମିକା ବାଛନ୍ତୁ',
      switch_role: 'ଭୂମିକା ବଦଳାନ୍ତୁ',
      enter_story: 'କାହାଣୀ ଦେଖନ୍ତୁ',
      choose_part: 'ଆପଣଙ୍କ ଭାଗ ବାଛନ୍ତୁ',
      footer_network: 'ଫିର୍ (PHIR) • ସମ୍ବଳ ପୁନରୁଦ୍ଧାର ନେଟୱାର୍କ',
      footer_waste: 'ବର୍ଜ୍ୟବସ୍ତୁ ଏବଂ ସମ୍ବଳ ପୁନରୁଦ୍ଧାର',
      sample_data_note: 'ନମୁନା ତଥ୍ୟ • ଅଫଲାଇନ୍ ପ୍ରୋଟୋଟାଇପ୍',

      // Roles
      role_household: 'ଘରୋଇ (ପରିବାର)',
      role_collector: 'ସଂଗ୍ରହକାରୀ (କବାଡ଼ିବାଲା)',
      role_recycler: 'ପୁନଃଚକ୍ରଣକାରୀ (ରିସାଇକ୍ଲର୍)',
      role_hint_household: 'ଯେଉଁଠାରୁ ଆରମ୍ଭ ହୁଏ',
      role_hint_collector: 'କବାଡ଼ିବାଲା • ଏକତ୍ରୀକରଣକାରୀ',
      role_hint_recycler: 'ଯେଉଁଠାରେ ନୂତନ ରୂପ ନିଏ',

      // Materials
      mat_pet: 'ପିଇଟି ପ୍ଲାଷ୍ଟିକ୍',
      mat_cardboard: 'କାର୍ଡବୋର୍ଡ (କାଗଜ ବାକ୍ସ)',
      mat_paper: 'ରଦ୍ଦି କାଗଜ',
      mat_aluminium: 'ଆଲୁମିନିୟମ୍',
      mat_glass: 'କାଚ',
      mat_wood: 'କାଠ',
      mat_all: 'ସମସ୍ତ ସାମଗ୍ରୀ',

      // Landing / Chooser
      landing_eyebrow: 'ଘରୋଇ   ସଂଗ୍ରହକାରୀ   ପୁନଃଚକ୍ରଣକାରୀ',
      landing_h1_main: 'ଫିଙ୍ଗିବା ନାହିଁ।',
      landing_h1_tagline: 'ପୁଣି ଥରେ ଭାବିବା।',
      landing_caption: 'ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ସାମଗ୍ରୀକୁ ଆପଣଙ୍କ ଦ୍ୱାରରୁ ପୁନରୁଦ୍ଧାର ଶୃଙ୍ଖଳାକୁ ପହଞ୍ଚାଇବାର ଉନ୍ନତ ଉପାୟ।',

      // Workspace Tabs
      tab_materials_collection: 'ସାମଗ୍ରୀ ଓ ସଂଗ୍ରହ',
      tab_contributions: 'ଯୋଗଦାନ',
      tab_collection_map: 'ସଂଗ୍ରହ ମାନଚିତ୍ର',
      tab_inventory: 'ଇନଭେଣ୍ଟୋରୀ (ମହଜୁଦ)',
      tab_profile_impact: 'ପ୍ରୋଫାଇଲ୍ ଓ ପ୍ରଭାବ',
      tab_my_inventory: 'ମୋର ଇନଭେଣ୍ଟୋରୀ',
      tab_company_needs: 'କମ୍ପାନୀଗୁଡ଼ିକର ଆବଶ୍ୟକତା',
      tab_requests: 'ଅନୁରୋଧ',
      tab_material_marketplace: 'ସାମଗ୍ରୀ ବଜାର',
      tab_requirements: 'ଆବଶ୍ୟକତା',
      tab_bookings: 'ବୁକିଂ',
      tab_company_profile: 'କମ୍ପାନୀ ପ୍ରୋଫାଇଲ୍',

      // Common Actions & Buttons
      btn_add_material: 'ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ',
      btn_add_photo: 'ଫଟୋରୁ ଯୋଡ଼ନ୍ତୁ',
      btn_request_collection: 'ସଂଗ୍ରହ ଅନୁରୋଧ କରନ୍ତୁ',
      btn_request_another: 'ଅନ୍ୟ ଏକ ସଂଗ୍ରହ ଅନୁରୋଧ କରନ୍ତୁ',
      btn_accept: 'ଗ୍ରହଣ କରନ୍ତୁ',
      btn_decline: 'ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ',
      btn_mark_collected: 'ସଂଗୃହୀତ ଚିହ୍ନିତ କରନ୍ତୁ',
      btn_preview_route: 'ଚୟନିତ ରାସ୍ତା ଦେଖନ୍ତୁ',
      btn_new_requirement: 'ନୂତନ ଆବଶ୍ୟକତା',
      btn_publish_requirement: 'ଆବଶ୍ୟକତା ପ୍ରକାଶ କରନ୍ତୁ',
      btn_reserve_material: 'ସାମଗ୍ରୀ ସଂରକ୍ଷଣ କରନ୍ତୁ',
      btn_confirm_handover: 'ହସ୍ତାନ୍ତର ନିଶ୍ଚିତ କରନ୍ତୁ',
      btn_save_changes: 'ପରିବର୍ତ୍ତନ ସାଇତନ୍ତୁ',
      btn_save_company: 'କମ୍ପାନୀ ପ୍ରୋଫାଇଲ୍ ସାଇତନ୍ତୁ',
      btn_cancel: 'ବାତିଲ କରନ୍ତୁ',
      btn_confirm: 'ନିଶ୍ଚିତ କରନ୍ତୁ',
      btn_close: 'ବନ୍ଦ କରନ୍ତୁ',
      btn_continue: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
      btn_play_again: 'ପୁଣି ଖେଳନ୍ତୁ',
      btn_restart_demo: 'ନମୁନା ଯାତ୍ରା ପୁନରାରମ୍ଭ',
      btn_export_records: 'ରେକର୍ଡ ରପ୍ତାନି କରନ୍ତୁ',
      btn_show_all: 'ସମସ୍ତ ସାମଗ୍ରୀ ଦେଖାନ୍ତୁ',
      btn_go_household: 'ଘରୋଇ ପୃଷ୍ଠାକୁ ଯାଆନ୍ତୁ',
      btn_explore_materials: 'ସାମଗ୍ରୀ ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
      btn_choose_photo: 'ଫଟୋ ବାଛନ୍ତୁ',
      btn_confirm_material: 'ସାମଗ୍ରୀ ନିଶ୍ଚିତ କରନ୍ତୁ',
      btn_create_requirement: 'ଆବଶ୍ୟକତା ତିଆରି କରନ୍ତୁ',
      btn_mandi_rates: 'ମଣ୍ଡି ସ୍କ୍ରାପ୍ ଦର',
      btn_epr_audit: 'ଇପିଆର ଅଡିଟ୍',
      btn_instant_upi: 'ତୁରନ୍ତ ୟୁପିଆଇ ଦେୟ',
      btn_print_pdf: 'ପ୍ରିଣ୍ଟ / ପିଡିଏଫ୍ ସାଇତନ୍ତୁ',

      // Statuses & Badges
      status_available: 'ଉପଲବ୍ଧ',
      status_requested: 'ଅନୁରୋଧିତ',
      status_pending: 'ବକେୟା',
      status_accepted: 'ସ୍ୱୀକୃତ',
      status_collected: 'ସଂଗୃହୀତ',
      status_reserved: 'ସଂରକ୍ଷିତ',
      status_transferred: 'ସ୍ଥାନାନ୍ତରିତ',
      status_fulfilled: 'ପୂର୍ଣ୍ଣ',
      status_partially_fulfilled: 'ଆଂଶିକ ପୂର୍ଣ୍ଣ',
      status_recorded: 'ଲିପିବଦ୍ଧ',
      status_sample: 'ନମୁନା',
      status_illustrative: 'ଦୃଷ୍ଟାନ୍ତମୂଳକ',
      status_active: 'ସକ୍ରିୟ',
      status_route_stop: 'ରାସ୍ତା ରହଣି',

      // Metric Labels
      metric_available_collection: 'ସଂଗ୍ରହ ପାଇଁ ଉପଲବ୍ଧ',
      metric_est_value: 'ଆନୁମାନିକ ମୂଲ୍ୟ · ନମୁନା',
      metric_collected_so_far: 'ଏପର୍ଯ୍ୟନ୍ତ ସଂଗୃହୀତ',
      metric_local_partners: 'ସ୍ଥାନୀୟ ସହଯୋଗୀ',
      metric_material_recorded: 'ପଞ୍ଜୀକୃତ ସାମଗ୍ରୀ',
      metric_collected_by_partner: 'ସହଯୋଗୀଙ୍କ ଦ୍ୱାରା ସଂଗୃହୀତ',
      metric_transferred_to_recycler: 'ରିସାଇକ୍ଲରଙ୍କୁ ହସ୍ତାନ୍ତରିତ',
      metric_not_verified: 'ଯାଞ୍ଚ ହୋଇନାହିଁ',
      metric_actual_recycling: 'ପ୍ରକୃତ ପୁନଃଚକ୍ରଣ',
      metric_open_opportunities: 'ଉପଲବ୍ଧ ସୁଯୋଗ',
      metric_avail_inventory: 'ଉପଲବ୍ଧ ସଂଗୃହୀତ ଷ୍ଟକ୍',
      metric_reserved_transfer: 'ସ୍ଥାନାନ୍ତର ପାଇଁ ସଂରକ୍ଷିତ',
      metric_transferred_recyclers: 'ରିସାଇକ୍ଲରଙ୍କୁ ସ୍ଥାନାନ୍ତରିତ',
      metric_held_or_transferred: 'ରଖାଯାଇଥିବା କିମ୍ବା ହସ୍ତାନ୍ତରିତ ସାମଗ୍ରୀ',
      metric_material_transferred: 'ହସ୍ତାନ୍ତରିତ ସାମଗ୍ରୀ',
      metric_collections_recorded: 'ଲିପିବଦ୍ଧ ସଂଗ୍ରହ',
      metric_avail_marketplace: 'ବଜାରରେ ଉପଲବ୍ଧ',
      metric_open_requirements: 'ଖୋଲା ଆବଶ୍ୟକତା',
      metric_reserved_for_you: 'ଆପଣଙ୍କ ପାଇଁ ସଂରକ୍ଷିତ',
      metric_confirmed_transfers: 'ନିଶ୍ଚିତ ସ୍ଥାନାନ୍ତର',
      metric_active_reservations: 'ସକ୍ରିୟ ସଂରକ୍ଷଣ',
      metric_reserved_quantity: 'ସଂରକ୍ଷିତ ପରିମାଣ',
      metric_sample_material_lots: 'ନମୁନା ସାମଗ୍ରୀ ଲଟ୍',

      // Household Section
      house_title: 'ଆପଣଙ୍କ ଘର / ଲାଜପତ ନଗର, ଦିଲ୍ଲୀ',
      house_h1: 'ଟିକିଏ ଜାଗା।<br>ଏକ ନୂତନ ଆରମ୍ଭ।',
      house_copy: 'ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ସାମଗ୍ରୀ ଅଲଗା ରଖନ୍ତୁ। ଉପଯୁକ୍ତ ହାତକୁ ଏହାକୁ ଆଗକୁ ନେବାକୁ ଦିଅନ୍ତୁ।',
      house_your_materials: 'ଆପଣଙ୍କ ସାମଗ୍ରୀ',
      house_recorded_materials: 'ପଞ୍ଜୀକୃତ ସାମଗ୍ରୀ',
      house_empty_title: 'ଏକ ନୂତନ ଆରମ୍ଭ ପାଇଁ ସ୍ଥାନ।',
      house_empty_desc: 'ଆପଣଙ୍କ ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ସାମଗ୍ରୀ ଏଠାରେ ଦେଖାଯିବ।',
      house_your_collection: 'ଆପଣଙ୍କ ସଂଗ୍ରହ',
      house_ready_prefix: 'ସଂଗ୍ରହକାରୀଙ୍କ ପାଇଁ ପ୍ରସ୍ତୁତ।',
      house_waiting_partner: 'ସଂଗ୍ରହକାରୀଙ୍କ ପାଇଁ ଅପେକ୍ଷା କରାଯାଇଛି',
      house_accepted_partner: 'ସଂଗ୍ରହକାରୀଙ୍କ ଦ୍ୱାରା ଗ୍ରହଣ କରାଯାଇଛି',
      house_collection_recorded: 'ସଂଗ୍ରହ ଲିପିବଦ୍ଧ ହେଲା',
      house_step_requested: 'ଅନୁରୋଧିତ',
      house_step_accepted: 'ସ୍ୱୀକୃତ',
      house_step_collected: 'ସଂଗୃହୀତ',
      house_desc_pending: 'ଲାଜପତ ନଗର · ସ୍ଥାନୀୟ ଅନୁରୋଧ',
      house_desc_accepted: 'ଆପଣଙ୍କ ସାମଗ୍ରୀ ହସ୍ତାନ୍ତର ପାଇଁ ଅପେକ୍ଷା କରିଛି।',
      house_desc_collected: 'ସାମଗ୍ରୀ ବର୍ତ୍ତମାନ ସଂଗ୍ରହକାରୀଙ୍କ ମହଜୁଦରେ ଅଛି।',
      house_good_hands: 'ନିକଟସ୍ଥ ବିଶ୍ୱସ୍ତ ହାତ।',
      house_local_partners_desc: 'ଆପଣଙ୍କ ଅଞ୍ଚଳର ସଂଗ୍ରହକାରୀ।',
      house_note_locality: 'ଆପଣଙ୍କ ଅନୁରୋଧ ଅଞ୍ଚଳ ସ୍ତରରେ ଦେଖାଯାଏ। ସଂଗ୍ରହକାରୀ ଏହାକୁ ଗ୍ରହଣ କରନ୍ତି; ଏହି ପ୍ରୋଟୋଟାଇପ୍ ସିଧାସଳଖ ନାମିତ ସହଯୋଗୀଙ୍କୁ ବୁକ୍ କରେ ନାହିଁ।',
      house_guide_heading: 'ଟିକିଏ ଅଲଗା କରନ୍ତୁ। ଏକ ସମ୍ଭାବନା ବଞ୍ଚାନ୍ତୁ।',
      house_guide_1_h3: 'ପରିଷ୍କାର ଓ ଶୁଖିଲା ରଖନ୍ତୁ',
      house_guide_1_p: 'ବୋତଲ ଓ ଡବ୍ବା ଖାଲି କରନ୍ତୁ। କାଗଜ ଓ କାର୍ଡବୋର୍ଡକୁ ଖାଦ୍ୟ ଏବଂ ଆର୍ଦ୍ରତାରୁ ଦୂରରେ ରଖନ୍ତୁ।',
      house_guide_2_h3: 'ଏଗୁଡ଼ିକୁ ଶୃଙ୍ଖଳାରେ ରଖନ୍ତୁ',
      house_guide_2_p: 'ପିଇଟି ପ୍ଲାଷ୍ଟିକ୍, କାର୍ଡବୋର୍ଡ, କାଗଜ, ଆଲୁମିନିୟମ୍, କାଚ ଓ କାଠ। ସଂଗ୍ରହକାରୀଙ୍କ ସହିତ ଯାଞ୍ଚ କରନ୍ତୁ।',
      house_guide_3_h3: 'ଏଗୁଡ଼ିକୁ ପୃଥକ୍ ରଖନ୍ତୁ',
      house_guide_3_p: 'ଖାଦ୍ୟ ବର୍ଜ୍ୟବସ୍ତୁ, ସ୍ୱଚ୍ଛତା ବର୍ଜ୍ୟବସ୍ତୁ ଏବଂ ବିପଜ୍ଜନକ ସାମଗ୍ରୀ ପୁନଃଚକ୍ରଣ ବଣ୍ଡଲରେ ପକାନ୍ତୁ ନାହିଁ।',

      // Contributions Section
      contrib_title: 'ଶୃଙ୍ଖଳାରେ ଆପଣଙ୍କ ଭାଗିଦାରୀ',
      contrib_h1: 'ଛୋଟ ପଦକ୍ଷେପ। ପ୍ରକୃତ ରେକର୍ଡ।',
      contrib_copy: 'ପ୍ରତ୍ୟେକ ଯୋଗଦାନ ସଂଗ୍ରହ କିମ୍ବା ହସ୍ତାନ୍ତର ଦ୍ୱାରା ପ୍ରମାଣିତ — କଳ୍ପିତ ସଞ୍ଚୟ ନୁହେଁ।',
      contrib_journey: 'ଆପଣଙ୍କ ସାମଗ୍ରୀର ଯାତ୍ରା',
      contrib_demo_record: 'ଏହି ପ୍ରଦର୍ଶନରେ ଲିପିବଦ୍ଧ',
      contrib_meaning: 'ଏହାର ଅର୍ଥ କ’ଣ',
      contrib_meaning_note: 'ସଂଗ୍ରହ ସାମଗ୍ରୀକୁ ଶୃଙ୍ଖଳାରେ ରଖେ। ହସ୍ତାନ୍ତର ପରବର୍ତ୍ତୀ ସଂରକ୍ଷକର ପ୍ରମାଣ ଦିଏ। ପୁନଃଚକ୍ରଣ ପାଇଁ ପୃଥକ୍ ପ୍ରମାଣ ଆବଶ୍ୟକ।',
      contrib_handover_title: 'ଏହା ଏକ ହସ୍ତାନ୍ତର, ଅନ୍ତିମ ଲକ୍ଷ୍ୟ ନୁହେଁ।',
      contrib_handover_desc: 'ଆଜି ସବୁଠାରୁ ଦୃଢ଼ ଦାବି ହେଉଛି ଯାହା ଆମେ ପ୍ରକୃତରେ ଲିପିବଦ୍ଧ କରିପାରିବା।',

      // Collector Section
      col_title: 'ସଂଗ୍ରହକାରୀ, ଦିଲ୍ଲୀ',
      col_h1: 'ପରବର୍ତ୍ତୀ ଉପଯୁକ୍ତ ହାତ<br>ଆପଣଙ୍କର ହୋଇପାରେ।',
      col_copy: 'ସଂଗ୍ରହ ପାଇଁ ପ୍ରସ୍ତୁତ ସାମଗ୍ରୀ ଖୋଜନ୍ତୁ, ଗୋଟିଏ ଗୋଟିଏ ଅଞ୍ଚଳ କରି।',
      col_map_heading: 'ଦିଲ୍ଲୀ, ଅଞ୍ଚଳ ଅନୁସାରେ।',
      col_locality_view: 'ଅଞ୍ଚଳ ସ୍ତରୀୟ ଦୃଶ୍ୟ',
      col_map_note: 'ଏହା ଏକ ଚିତ୍ରାତ୍ମକ ପୂର୍ବାବଲୋକନ, ରାସ୍ତା ନେଭିଗେସନ୍ ନୁହେଁ। ଘରଗୁଡ଼ିକର ଠିକଣା ସମ୍ପୂର୍ଣ୍ଣ ଗୋପନୀୟ।',
      col_empty_h3: 'କୌଣସି ଖୋଲା ସଂଗ୍ରହ ଅନୁରୋଧ ନାହିଁ।',
      col_empty_p: 'ସମ୍ପୂର୍ଣ୍ଣ ଯାତ୍ରା ଦେଖିବାକୁ ଘରୋଇ ପୃଷ୍ଠାରୁ ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ ଏବଂ ଅନୁରୋଧ କରନ୍ତୁ।',
      col_preview_heading: 'ଅଞ୍ଚଳ ପୂର୍ବାବଲୋକନ',
      col_mixed_bundle: 'ମିଶ୍ରିତ ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ବଣ୍ଡଲ',
      col_bundle_desc: 'କାଗଜ, ପିଇଟି ଓ କାର୍ଡବୋର୍ଡ · ଅଞ୍ଚଳ ସ୍ତର ନମୁନା',
      col_quote_waiting: 'ମୂଲ୍ୟ: ଦର ବାକି ଅଛି',
      col_sample_estimate: 'ଆନୁମାନିକ ଦର',
      col_no_live_quote: 'ଦର ବାକି ଅଛି',
      col_inv_title: 'ସଂଗୃହୀତ ସାମଗ୍ରୀ',
      col_inv_h1: 'ପରବର୍ତ୍ତୀ ହାତକୁ ଯିବା ପାଇଁ ପ୍ରସ୍ତୁତ।',
      col_inv_copy: 'ଆପଣଙ୍କ ସଂଗୃହୀତ ସାମଗ୍ରୀ ରିସାଇକ୍ଲରମାନଙ୍କୁ ଦୃଶ୍ୟମାନ ହୁଏ।',
      col_custody_h2: 'ଆପଣଙ୍କ ହେପାଜତରେ ଥିବା ସାମଗ୍ରୀ',
      col_th_material: 'ସାମଗ୍ରୀ',
      col_th_quantity: 'ପରିମାଣ',
      col_th_locality: 'ଅଞ୍ଚଳ',
      col_th_status: 'ସ୍ଥିତି',
      col_th_action: 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
      col_demand_title: 'ଚାହିଦା / ଦିଲ୍ଲୀ',
      col_demand_h1: 'କାହାର ଆବଶ୍ୟକତା ଅଛି<br>ଯାହା ଆପଣଙ୍କ ପାଖରେ ପୂର୍ବରୁ ଅଛି।',
      col_demand_copy: 'ରିସାଇକ୍ଲର୍ ଆବଶ୍ୟକତା, ଯାହା ସଂଗ୍ରହ ଶୃଙ୍ଖଳା ସହିତ ଜଡ଼ିତ।',
      col_open_reqs: 'ଖୋଲା ଆବଶ୍ୟକତା',
      col_no_open_reqs: 'କୌଣସି ଖୋଲା ଆବଶ୍ୟକତା ନାହିଁ।',
      col_no_open_reqs_p: 'ନୂତନ ରିସାଇକ୍ଲର୍ ଆବଶ୍ୟକତା ଏଠାରେ ଦେଖାଯିବ।',
      col_profile_title: 'ସଂଗ୍ରହକାରୀ / ପ୍ରୋଫାଇଲ୍',
      col_profile_h1: 'ଏକ ପରିଚିତ ଚେହେରା।<br>ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସଂଯୋଗ।',
      col_profile_copy: 'କବାଡ଼ିବାଲା ଏବଂ ସଂଗ୍ରହକାରୀମାନେ ପୁନଃଚକ୍ରଣ ବ୍ୟବସ୍ଥାର ମୁଖ୍ୟ ଆଧାର।',
      col_partner_heading: 'ସଂଗ୍ରହ ସହଯୋଗୀ',
      col_sample_profile: 'ନମୁନା ପ୍ରୋଫାଇଲ୍',
      col_role_desc: 'କବାଡ଼ିବାଲା / ଏକତ୍ରୀକରଣକାରୀ · ଦିଲ୍ଲୀ',
      col_materials_accepted: 'ଗ୍ରହଣ କରାଯାଉଥିବା ସାମଗ୍ରୀ',
      col_all_six_mats: 'ପିଇଟି, କାର୍ଡବୋର୍ଡ, କାଗଜ, ଆଲୁମିନିୟମ୍, କାଚ ଓ କାଠ',
      col_service_localities: 'ସେବା ଅଞ୍ଚଳ',
      col_delhi_areas: 'ଲାଜପତ ନଗର, କରୋଲ ବାଗ ଓ ସାକେତ',
      col_trust_chain: 'ବିଶ୍ୱାସ ଶୃଙ୍ଖଳାରେ ଗଢ଼ିଉଠେ।',
      col_trust_note: 'ଏହି ପ୍ରୋଟୋଟାଇପ୍ କବାଡ଼ିବାଲା ଓ ଏକତ୍ରୀକରଣକାରୀଙ୍କୁ ଏକାଠି ଦେଖାଏ। ପ୍ରକୃତରେ ସେମାନେ ଭିନ୍ନ ହୋଇପାରନ୍ତି।',
      col_trust_muted: 'ପ୍ରୋଫାଇଲ୍ ସୂଚକଗୁଡ଼ିକ କେବଳ ପ୍ରଦର୍ଶନ ରେକର୍ଡ, କୌଣସି ପ୍ରମାଣପତ୍ର ନୁହେଁ।',

      // Recycler Section
      rec_title: 'ପୁନଃଚକ୍ରଣକାରୀ / ଦିଲ୍ଲୀ',
      rec_h1: 'ନୂତନ ଜୀବନ<br>ଉପଯୁକ୍ତ ସାମଗ୍ରୀରୁ ଆରମ୍ଭ ହୁଏ।',
      rec_copy: 'ସ୍ଥାନୀୟ ସଂଗ୍ରହକାରୀଙ୍କ ଦ୍ୱାରା ସଂଗୃହୀତ ସାମଗ୍ରୀ ଖୋଜନ୍ତୁ।',
      rec_ready_life: 'ସାମଗ୍ରୀ, ନୂତନ ରୂପ ପାଇଁ ପ୍ରସ୍ତୁତ।',
      rec_collected_inv: 'ସଂଗୃହୀତ ଷ୍ଟକ୍',
      rec_collected_mat: 'ସଂଗୃହୀତ ସାମଗ୍ରୀ',
      rec_no_lots_h3: 'କୌଣସି ଉପଲବ୍ଧ ଲଟ୍ ନାହିଁ।',
      rec_no_lots_p: 'ମେଳ ଖାଉଥିବା ସାମଗ୍ରୀ ଏଠାରେ ଦେଖାଯିବ।',
      rec_req_title: 'ଆପଣଙ୍କ ସାମଗ୍ରୀ ଚାହିଦା',
      rec_req_h1: 'ନୂତନ ଜୀବନକୁ<br>ଏକ ସ୍ପଷ୍ଟ ଦିଗ ଦିଅନ୍ତୁ।',
      rec_req_copy: 'ଆପଣଙ୍କ କମ୍ପାନୀକୁ କେଉଁ ସାମଗ୍ରୀ ଦରକାର ତାହା ସଂଗ୍ରହକାରୀଙ୍କୁ ଜଣାନ୍ତୁ।',
      rec_your_reqs: 'ଆପଣଙ୍କ ଆବଶ୍ୟକତା',
      rec_req_units: 'ସାମଗ୍ରୀ ଅନୁରୋଧ',
      rec_still_needed: 'ଏବେ ମଧ୍ୟ ଆବଶ୍ୟକ · ଦିଲ୍ଲୀ',
      rec_fulfilled_ratio: 'ପୂର୍ଣ୍ଣ',
      rec_book_title: 'ସଂରକ୍ଷିତ → ସ୍ଥାନାନ୍ତରିତ',
      rec_book_h1: 'ସଂରକ୍ଷଣ ଏକ ପ୍ରତିଶ୍ରୁତି।<br>ହସ୍ତାନ୍ତର ଏକ ପକ୍କା ରେକର୍ଡ।',
      rec_book_copy: 'ବୁକିଂ ତୁରନ୍ତ ସାମଗ୍ରୀ ସଂରକ୍ଷଣ କରେ। ସାମଗ୍ରୀ ମିଳିବା ପରେ ହିଁ ନିଶ୍ଚିତ କରନ୍ତୁ।',
      rec_your_bookings: 'ଆପଣଙ୍କ ବୁକିଂ',
      rec_th_partner: 'ସହଯୋଗୀ',
      rec_th_handover: 'ହସ୍ତାନ୍ତର',
      rec_no_bookings_h3: 'କୌଣସି ବୁକିଂ ହୋଇନାହିଁ।',
      rec_no_bookings_p: 'ସାମଗ୍ରୀ ବଜାରରେ ଉପଯୁକ୍ତ ଲଟ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ।',
      rec_comp_title: 'ପୁନଃଚକ୍ରଣକାରୀ / କମ୍ପାନୀ',
      rec_comp_h1: 'ଏକ ନୂତନ ଆରମ୍ଭକୁ<br>ନିଜର ନାମ ଦିଅନ୍ତୁ।',
      rec_comp_copy: 'ଆପଣ ପ୍ରକାଶ କରୁଥିବା ଆବଶ୍ୟକତା ସହିତ ଆପଣଙ୍କ କମ୍ପାନୀ ବିବରଣୀ ରହିବ।',
      rec_field_name: 'କମ୍ପାନୀ ନାମ',
      rec_field_locality: 'କମ୍ପାନୀ ଇଲାକା',
      rec_field_contact: 'କମ୍ପାନୀ ଯୋଗାଯୋଗ ଇମେଲ୍ (ଇଚ୍ଛାଧୀନ)',
      rec_note_live: 'ଏହି ରିସାଇକ୍ଲରର ପ୍ରଦର୍ଶନ ପ୍ରୋଫାଇଲରେ ସାଇତାଗଲା।',
      rec_demand_meets: 'ଚାହିଦା ସହିତ ବିଦ୍ୟମାନ ଅର୍ଥବ୍ୟବସ୍ଥାର ମିଳନ।',
      rec_demand_desc: 'ସାମଗ୍ରୀ ଚାହିଦା ପ୍ରକାଶ କରନ୍ତୁ, ସଂଗୃହୀତ ଷ୍ଟକ୍ ଖୋଜନ୍ତୁ, ଲଟ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ ଏବଂ ହସ୍ତାନ୍ତର ଲିପିବଦ୍ଧ କରନ୍ତୁ।',

      // Identity Modal
      identity_title: 'ପ୍ରୋଫାଇଲ୍',
      identity_prompt_live: 'ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ ଏବଂ ଦିଲ୍ଲୀର ଅଞ୍ଚଳ ବାଛନ୍ତୁ। ଏହା ଏକ ସରଳ ପ୍ରଦର୍ଶନ ପ୍ରୋଫାଇଲ୍ ତିଆରି କରେ—ପାସୱାର୍ଡ ଦରକାର ନାହିଁ।',
      identity_prompt_serve: 'ଆପଣଙ୍କ ନାମ ଲେଖନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ସେବା ଅଞ୍ଚଳ ବାଛନ୍ତୁ। ଏହା ଏକ ସରଳ ପ୍ରଦର୍ଶନ ପ୍ରୋଫାଇଲ୍ ତିଆରି କରେ—ପାସୱାର୍ଡ ଦରକାର ନାହିଁ।',
      identity_label_name: 'ନାମ',
      identity_ph_name: 'ଆପଣଙ୍କ ନାମ',
      identity_label_area: 'ଅଞ୍ଚଳ',
      identity_label_service_area: 'ସେବା ଅଞ୍ଚଳ',
      identity_saving: 'ପ୍ରୋଫାଇଲ୍ ସାଇତା ଯାଉଛି...',

      // Areas
      area_north: 'ଉତ୍ତର ଦିଲ୍ଲୀ',
      area_north_west: 'ଉତ୍ତର ପଶ୍ଚିମ',
      area_west: 'ପଶ୍ଚିମ ଦିଲ୍ଲୀ',
      area_south_west: 'ଦକ୍ଷିଣ ପଶ୍ଚିମ',
      area_central: 'ମଧ୍ୟ ଦିଲ୍ଲୀ',
      area_new_delhi: 'ନୂଆ ଦିଲ୍ଲୀ',
      area_north_east: 'ଉତ୍ତର ପୂର୍ବ',
      area_shahdara: 'ଶାହଦରା',
      area_east: 'ପୂର୍ବ ଦିଲ୍ଲୀ',
      area_south_east: 'ଦକ୍ଷିଣ ପୂର୍ବ',
      area_south: 'ଦକ୍ଷିଣ ଦିଲ୍ଲୀ',
      area_lajpat: 'ଲାଜପତ ନଗର',
      area_karol: 'କରୋଲ ବାଗ',
      area_saket: 'ସାକେତ',

      // Modals & Dialogs
      modal_add_mat: 'ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ',
      modal_edit_mat: 'ସାମଗ୍ରୀ ସଂଶୋଧନ କରନ୍ତୁ',
      modal_from_photo: 'ଫଟୋରୁ ଚିହ୍ନଟ କରନ୍ତୁ',
      modal_photo_help: 'ଚିହ୍ନଟ କରିବାକୁ ଗୋଟିଏ ପ୍ରମୁଖ ସାମଗ୍ରୀ ବାଛନ୍ତୁ।',
      modal_rec_result: 'ଚିହ୍ନଟ ଫଳାଫଳ',
      modal_waiting_photo: 'ଫଟୋ ପାଇଁ ଅପେକ୍ଷା କରାଯାଇଛି',
      modal_suggestion_here: 'ଆପଣଙ୍କ ସାମଗ୍ରୀର ସୂଚନା ଏଠାରେ ଦେଖାଯିବ।',
      modal_confirm_label: 'ମୁଁ ଏହି ସାମଗ୍ରୀ ଚିହ୍ନଟକୁ ନିଶ୍ଚିତ କରୁଛି।',
      modal_field_mat: 'ସାମଗ୍ରୀ',
      modal_field_weight: 'ଓଜନ (କିଗ୍ରା)',
      modal_placeholder_weight: 'ଯଥା ୨.୫',
      modal_remove_title: 'ଆପଣ ଏହି ସାମଗ୍ରୀ ହଟାଇବାକୁ ଚାହାଁନ୍ତି କି?',
      modal_remove_copy: 'କେବଳ ଉପଲବ୍ଧ ସାମଗ୍ରୀ ହିଁ ଆପଣଙ୍କ ତାଲିକାରୁ ହଟାଯାଇପାରିବ।',
      modal_new_req_title: 'ଆପଣଙ୍କ କମ୍ପାନୀକୁ କ’ଣ ଦରକାର?',
      modal_req_mat: 'ଆବଶ୍ୟକ ସାମଗ୍ରୀ',
      modal_req_weight: 'ଆବଶ୍ୟକ ଓଜନ (କିଗ୍ରା)',
      modal_req_weight_ph: 'ଯଥା ୧୦୦',
      modal_req_min: 'ସର୍ବନିମ୍ନ ବୁକିଂ (କିଗ୍ରା, ଇଚ୍ଛାଧୀନ)',
      modal_req_min_ph: 'ଯଥା ୨୫',
      modal_req_note: 'ଏହି ଆବଶ୍ୟକତା ପ୍ରଦର୍ଶନରେ କବାଡ଼ିବାଲାଙ୍କୁ ଦେଖାଯିବ।',
      modal_reserve_title: 'ଏହି ସାମଗ୍ରୀ ସଂରକ୍ଷଣ କରନ୍ତୁ',
      modal_match_req: 'ନିଜର ଆବଶ୍ୟକତା ସହିତ ମେଳ କରନ୍ତୁ',
      modal_qty_reserve: 'ସଂରକ୍ଷଣ ପାଇଁ ପରିମାଣ (କିଗ୍ରା)',
      modal_reserve_note: 'ପରିମାଣ ତୁରନ୍ତ ସଂରକ୍ଷିତ ହୁଏ। ଆପଣ ହସ୍ତାନ୍ତର ନିଶ୍ଚିତ କଲା ପରେ ହିଁ ସାମଗ୍ରୀ ଯାଏ।',
      modal_need_req_note: 'ଏହି ସାମଗ୍ରୀ ସଂରକ୍ଷଣ କରିବା ପୂର୍ବରୁ ଆପଣଙ୍କର ଏକ ମେଳ ଖାଉଥିବା ଆବଶ୍ୟକତା ଥିବା ଦରକାର।',
      modal_decline_title: 'ଏହି ସଂଗ୍ରହ ପ୍ରତ୍ୟାଖ୍ୟାନ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      modal_decline_copy: 'ଏହି ପ୍ରଦର୍ଶନରେ ସାମଗ୍ରୀ ପୁଣି ଘରୋଇ ତାଲିକାକୁ ଫେରିଯିବ।',
      modal_record_col_title: 'ଏହି ସଂଗ୍ରହ ଲିପିବଦ୍ଧ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      modal_record_col_copy: 'ନିଶ୍ଚିତ କରନ୍ତୁ ଯେ ସାମଗ୍ରୀ ସଂଗ୍ରହକାରୀଙ୍କୁ ଦିଆଯାଇଛି। ଏହା କେବଳ ସଂଗ୍ରହର ରେକର୍ଡ, ପୁନଃଚକ୍ରଣର ନୁହେଁ।',
      modal_confirm_handover_title: 'ସାମଗ୍ରୀ ହସ୍ତାନ୍ତର ନିଶ୍ଚିତ କରିବେ କି?',
      modal_confirm_handover_copy: 'ଏହା ବୁକିଂ ସମ୍ପୂର୍ଣ୍ଣ କରେ ଏବଂ ଆପଣଙ୍କ କମ୍ପାନୀକୁ ହସ୍ତାନ୍ତର ଲିପିବଦ୍ଧ କରେ। ଏହା ପୁନଃଚକ୍ରଣର ଯାଞ୍ଚ ନୁହେଁ।',
      modal_restart_title: 'ପ୍ରଦର୍ଶନ ପୁନରାରମ୍ଭ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      modal_restart_copy: 'ଏହା ବର୍ତ୍ତମାନର ଯାତ୍ରାକୁ ସଫା କରିବ ଏବଂ ନମୁନା ରେକର୍ଡ ଫେରାଇ ଆଣିବ।',
      sample_records_notice: 'ପ୍ରଦର୍ଶନ ପାଇଁ ନମୁନା ରେକର୍ଡ। ଯୋଡ଼ାଯାଇଥିବା ସାମଗ୍ରୀର କୌଣସି ଲାଇଭ୍ ଦର ନାହିଁ। ସଂଗ୍ରହ ଏବଂ ହସ୍ତାନ୍ତର ପୃଥକ୍ ଭାବେ ଲିପିବଦ୍ଧ ହୁଏ।',

      // Enhancement Modals (Mandi, Scale, EPR)
      mandi_modal_title: 'ଲାଇଭ୍ ଦିଲ୍ଲୀ ସ୍କ୍ରାପ୍ ମଣ୍ଡି ଦର',
      mandi_modal_bench: 'ସୂଚକ ହୋଲସେଲ୍ ବଜାର ଦର',
      mandi_table_mat: 'ସାମଗ୍ରୀ ପ୍ରକାର',
      mandi_table_grade: 'ମାନକ ଗୁଣବତ୍ତା',
      mandi_table_rate: 'ମଣ୍ଡି ଦର (₹/କିଗ୍ରା)',
      mandi_grade_pet: 'ପରିଷ୍କାର ବଣ୍ଡଲ / ବର୍ଗୀକୃତ',
      mandi_grade_cardboard: 'ପୁରୁଣା କାର୍ଡବୋର୍ଡ (OCC) / ଶୁଖିଲା',
      mandi_grade_paper: 'ଖବରକାଗଜ ଓ ଅଫିସ୍ କାଗଜ',
      mandi_grade_aluminium: 'କ୍ୟାନ୍, ପାର୍ଟସ୍ ଓ ସ୍କ୍ରାପ୍',
      mandi_grade_glass: 'ଭଙ୍ଗା କାଚ ଓ ବୋତଲ',
      mandi_grade_wood: 'କାଠ ବାକ୍ସ ଓ ପଟା',
      mandi_modal_note: 'ଦରଗୁଡ଼ିକ ମାୟାପୁରୀ, ସିଲମପୁର ଓ ଗାଜିପୁର ହୋଲସେଲ୍ ବଜାର ଉପରେ ଆଧାରିତ। କଣ୍ଟା ଓଜନରେ ଆର୍ଦ୍ରତା ଓ ଅପମିଶ୍ରଣ ଅନୁଯାୟୀ ମୂଲ୍ୟ ସଜାଡ଼ି ହୁଏ।',
      scale_modal_title: 'କଣ୍ଟା ଓଜନ ଏବଂ ଅପମିଶ୍ରଣ ମିଳାଣ',
      scale_modal_sub: 'ଭୌତିକ କଣ୍ଟାରେ ଓଜନ ମାପନ୍ତୁ ଏବଂ ତୁରନ୍ତ ପୈଠ କରିବା ପୂର୍ବରୁ ଅପମିଶ୍ରଣ ଯାଞ୍ଚ କରନ୍ତୁ।',
      scale_household_est: 'ଘରୋଇ ଆକଳନ',
      scale_field_scale: 'କଣ୍ଟାର ମୋଟ ଓଜନ (କିଗ୍ରା)',
      scale_field_contam: 'ଅପମିଶ୍ରଣ / କଚରା କଟକଣା (%)',
      scale_net_weight: 'ଶୁଦ୍ଧ ପ୍ରଦେୟ ଓଜନ',
      scale_net_payout: 'ଦେୟ ମୋଟ ରାଶି',
      scale_instant_upi: 'ତୁରନ୍ତ ୟୁପିଆଇ ପୈଠ',
      scale_confirm_btn: 'କଣ୍ଟା ମିଳାଣ ନିଶ୍ଚିତ କରନ୍ତୁ ଓ ସଂଗ୍ରହ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ',
      epr_modal_title: 'ଡିଜିଟାଲ୍ ଇପିଆର ସଂରକ୍ଷଣ ପ୍ରମାଣପତ୍ର',
      epr_sub: 'କ୍ରିପ୍ଟୋଗ୍ରାଫିକ୍ ବିସ୍ତାରିତ ଉତ୍ପାଦକ ଉତ୍ତରଦାୟିତ୍ୱ (EPR) ଅଡିଟ୍ ଶୃଙ୍ଖଳା',
      epr_label_id: 'ପ୍ରମାଣପତ୍ର ସଂଖ୍ୟା',
      epr_label_time: 'ଲିପିବଦ୍ଧ ସମୟ',
      epr_label_actor: 'ଦାୟିତ୍ୱବାନ ସଂରକ୍ଷକ',
      epr_label_entity: 'ସଂସ୍ଥା ପରିଚୟ ପତ୍ର',
      epr_label_hash: 'ଏସଏଚଏ-୨୫୬ ଇଭେଣ୍ଟ ହ୍ୟାସ୍',
      epr_label_prev: 'ପୂର୍ବବର୍ତ୍ତୀ ଲେଜର୍ ହ୍ୟାସ୍',
      epr_label_integrity: 'ଶୃଙ୍ଖଳା ଅଖଣ୍ଡତା',
      epr_verified: 'କ୍ରିପ୍ଟୋଗ୍ରାଫିକାଲି ଯାଞ୍ଚ ହୋଇଛି (ଅପରିବର୍ତ୍ତନୀୟ)',
      epr_certified: 'ଭାରତୀୟ ପ୍ଲାଷ୍ଟିକ୍ ବର୍ଜ୍ୟବସ୍ତୁ ପରିଚାଳନା ନିୟମାବଳୀ (CPCB PWM Schedule II) ଅନୁଯାୟୀ ଫିର୍ (PHIR) ରିଲେସନାଲ୍ ଲେଜର୍ ଦ୍ୱାରା ଯାଞ୍ଚ ଓ ସ୍ଥାୟୀ ଭାବେ ଲିପିବଦ୍ଧ।',

      // Dynamic Error Messages & Live Notifications
      err_only_available_edit: 'କେବଳ ଉପଲବ୍ଧ ଘରୋଇ ସାମଗ୍ରୀ ସଂଶୋଧନ କରାଯାଇପାରିବ',
      err_only_available_remove: 'କେବଳ ଉପଲବ୍ଧ ଘରୋଇ ସାମଗ୍ରୀ ହଟାଯାଇପାରିବ',
      err_at_least_one: 'ଅତି କମରେ ଗୋଟିଏ ସାମଗ୍ରୀ ଆବଶ୍ୟକ',
      err_belong_household: 'ସମସ୍ତ ସାମଗ୍ରୀ ଘରର ଅଧୀନରେ ଏବଂ ଉପଲବ୍ଧ ହେବା ଉଚିତ',
      err_only_pending_accept: 'କେବଳ ବକେୟା ଅନୁରୋଧ ଗ୍ରହଣ କରାଯାଇପାରିବ',
      err_only_pending_reject: 'କେବଳ ବକେୟା ଅନୁରୋଧ ପ୍ରତ୍ୟାଖ୍ୟାନ କରାଯାଇପାରିବ',
      err_must_accept_first: 'ସଂଗ୍ରହ ପୂର୍ବରୁ ଏହି କବାଡ଼ିବାଲାଙ୍କ ଦ୍ୱାରା ଅନୁରୋଧ ଗ୍ରହଣ କରାଯିବା ଆବଶ୍ୟକ',
      err_min_between_zero: 'ସର୍ବନିମ୍ନ ପରିମାଣ ଶୂନ ଏବଂ ମୋଟ ପରିମାଣ ମଧ୍ୟରେ ହେବା ଉଚିତ',
      err_active_req_exists: 'ଏହି ସାମଗ୍ରୀ ପାଇଁ ପୂର୍ବରୁ ଏକ ସକ୍ରିୟ ଆବଶ୍ୟକତା ରହିଛି',
      err_req_not_found: 'ରିସାଇକ୍ଲରଙ୍କ ପାଇଁ ଆବଶ୍ୟକତା ମିଳିଲା ନାହିଁ',
      err_booking_exceeds: 'ଅନୁରୋଧିତ ବୁକିଂ ଉପଲବ୍ଧ କିମ୍ବା ଆବଶ୍ୟକ ପରିମାଣଠାରୁ ଅଧିକ',
      err_booking_below_min: 'ଅନୁରୋଧିତ ବୁକିଂ ସର୍ବନିମ୍ନ ଆବଶ୍ୟକ ପରିମାଣଠାରୁ କମ୍',
      err_booking_not_found: 'ରିସାଇକ୍ଲରଙ୍କ ପାଇଁ ବୁକିଂ ମିଳିଲା ନାହିଁ',
      err_only_confirmed_complete: 'କେବଳ ନିଶ୍ଚିତ ବୁକିଂ ସମ୍ପୂର୍ଣ୍ଣ କରାଯାଇପାରିବ',
      err_reserved_no_longer_avail: 'ସଂରକ୍ଷିତ ସାମଗ୍ରୀ ଆଉ ଉପଲବ୍ଧ ନାହିଁ',
      err_profile_not_found: 'ପ୍ରୋଫାଇଲ୍ ମିଳିଲା ନାହିଁ',
      err_material_not_found: 'ସାମଗ୍ରୀ ମିଳିଲା ନାହିଁ',
      err_collection_req_not_found: 'ସଂଗ୍ରହ ଅନୁରୋଧ ମିଳିଲା ନାହିଁ',
      live_saved_records: 'ପୁନରୁଦ୍ଧାର ରେକର୍ଡରେ ସାଇତାଗଲା',
      live_profile_ready: 'କମ୍ପାନୀ ପ୍ରୋଫାଇଲ୍ ପ୍ରସ୍ତୁତ',
      live_inventory_refresh: 'ଇନଭେଣ୍ଟୋରୀ ରିଫ୍ରେଶ୍ ଆବଶ୍ୟକ',
      live_recovery_records: 'ସକ୍ରିୟ ପୁନରୁଦ୍ଧାର ରେକର୍ଡ',
      // === Indiathon 2026 Startup MVP & Business Layer (od) ===
      nav_pitch_deck: '🎙️ ୨-ମିନିଟ୍ ପିଚ୍ ଡେକ୍',
      nav_pricing_model: '💼 ମୂଲ୍ୟ ନିର୍ଦ୍ଧାରଣ ଓ ମଡେଲ',
      nav_mandi_rates: '⚖️ ମଣ୍ଡି ସ୍କ୍ରାପ୍ ଦର',
      btn_epr_audit: '🌱 ଇପିଆର୍ ଅଡିଟ୍',
      btn_plan_route: '🗺️ ପିକଅପ୍ ରୁଟ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
      btn_preview_route: 'ମନୋନୀତ ରୁଟ୍ ଦେଖନ୍ତୁ',
      route_stop_lbl: 'ରୁଟ୍ ଷ୍ଟପ୍',
      route_stops_selected: 'ଷ୍ଟପ୍ ମନୋନୀତ',
      route_total_distance: 'ମୋଟ ଦୂରତା',
      route_estimated_trip: 'ଆନୁମାନିକ ସମୟ',
      route_privacy_note: 'ସେଣ୍ଟ୍ରଏଡ୍ ଅବଷ୍ଫକେସନ୍ ଦ୍ୱାରା ଗୋପନୀୟତା ସୁରକ୍ଷିତ',
      startup_hero_badge: '⚡ ଇଣ୍ଡିଆଥନ୍ ୨୦୨୬ ଷ୍ଟାର୍ଟଅପ୍ MVP · E-CELL IIIT ଭୁବନେଶ୍ୱର ଦ୍ୱାରା ପରିଚାଳିତ',
      startup_cpcb_badge: 'CPCB ଅନୁସୂଚୀ II ଅଡିଟ୍ ସମାନତା',
      startup_hero_subtitle: 'ଭାରତର ₹୧.୧ ଲକ୍ଷ କୋଟି ଚକ୍ରୀୟ ଅର୍ଥବ୍ୟବସ୍ଥାର ଅପରେଟିଂ ସିଷ୍ଟମ୍',
      ticker_mat_tracked: 'ଟ୍ରାକ୍ ହୋଇଥିବା ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ସାମଗ୍ରୀ',
      ticker_direct_payouts: 'ସଂଗ୍ରହକାରୀଙ୍କୁ ସିଧାସଳଖ ପେମେଣ୍ଟ୍',
      ticker_cpcb_parity: 'SHA-256 CPCB ଅଡିଟ୍ ସମାନତା',
      ticker_co2_diverted: 'ପ୍ରମାଣିତ CO2e ନିର୍ଗମନ ସଞ୍ଚୟ',
      ticker_verified_pct: '୧୦୦% ପ୍ରମାଣିତ',
      biz_model_heading: '💼 ଭେଞ୍ଚର ବିଜନେସ୍ ମଡେଲ୍ ଓ ୟୁନିଟ୍ ଇକୋନୋମିକ୍ସ',
      biz_model_sub: 'କିପରି ଫିର୍ (Phir) ଅସଂଗଠିତ ବର୍ଜ୍ୟ ସଂଗ୍ରହକୁ ଉଚ୍ଚ ମାର୍ଜିନ୍ ଏଣ୍ଟରପ୍ରାଇଜ୍ ଅନୁପାଳନ ଓ ବିଶ୍ୱସନୀୟ ସବୁଜ ଯୋଗାଣ ଶୃଙ୍ଖଳାରେ ପରିଣତ କରେ।',
      sim_heading: 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ପରିମାଣ ଓ ରାଜସ୍ୱ ସିମୁଲେଟର୍',
      sim_sub: 'ମାସିକ ପ୍ରକ୍ରିୟାକରଣ ପରିମାଣ ଅନୁକରଣ କରିବାକୁ ସ୍ଲାଇଡ୍ କରନ୍ତୁ',
      sim_feedstock_label: 'ପୁନଃଚକ୍ରିତ ସାମଗ୍ରୀ ଜିଏମଭି (GMV)',
      sim_collector_gain_label: 'କବାଡିବାଲା ଆୟ ବୃଦ୍ଧି (+୨୮%)',
      sim_platform_rev_label: 'ଫିର୍ (Phir) ପ୍ଲାଟଫର୍ମ ରାଜସ୍ୱ',
      sim_co2_offset_label: 'ରୋକାଯାଇଥିବା CO2e ନିର୍ଗମନ',
      pricing_tier_household: '🏠 ଉପଭୋକ୍ତା / ପରିବାର',
      pricing_free_forever: 'ଚିରଦିନ ମାଗଣା',
      pricing_household_desc: 'ଉଚିତ ମୂଲ୍ୟରେ ଘରୁ ସିଧାସଳଖ ବର୍ଜ୍ୟ ସଂଗ୍ରହ।',
      pricing_household_f1: 'ଲାଇଭ୍ ମଣ୍ଡି ମୂଲ୍ୟ ସ୍ୱଚ୍ଛତା',
      pricing_household_f2: 'ଡିଜିଟାଲ୍ ଓଜନ ଯନ୍ତ୍ର ଟେଆର୍ କଟତି',
      pricing_household_f3: 'ଘରେ ତତକ୍ଷଣାତ୍ UPI ପେମେଣ୍ଟ୍',
      pricing_household_f4: 'ଶୂନ ପିକଅପ୍ ଶୁଳ୍କ',
      pricing_btn_test_household: 'ଘରୋଇ ଡେମୋ ଚେଷ୍ଟା କରନ୍ତୁ',
      pricing_tier_aggregator: '🚛 ଫିର୍ ଏଗ୍ରିଗେଟର୍ ପ୍ରୋ',
      pricing_badge_core_saas: 'ମୁଖ୍ୟ SaaS ରାଜସ୍ୱ',
      pricing_per_month: '/ ମାସ',
      pricing_aggregator_desc: 'କବାଡିବାଲା ଓ ମାଇକ୍ରୋ-ଡିଲରଙ୍କ ପାଇଁ ମୋବାଇଲ୍ OS।',
      pricing_aggregator_f1: 'ମଲ୍ଟି-ଷ୍ଟପ୍ ରୁଟ୍ ଯୋଜନା ଓ ଇନ୍ଧନ ବଞ୍ଚତ',
      pricing_aggregator_f2: 'ସିଧାସଳଖ ମିଲ୍ ବ୍ୟାଚ୍ ଏକତ୍ରୀକରଣ',
      pricing_aggregator_f3: 'ଡିଜିଟାଲ୍ ଓଜନ ଯନ୍ତ୍ର ଓ UPI ପେମେଣ୍ଟ୍ ଲେଜର୍',
      pricing_aggregator_f4: 'ସ୍ୱଚ୍ଛ ମଣ୍ଡି ଦର ସୂଚନା',
      pricing_btn_start_pro: '୧୪-ଦିନର ମାଗଣା ପାଇଲଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      pricing_tier_enterprise: '🏭 ଏଣ୍ଟରପ୍ରାଇଜ୍ ବ୍ରାଣ୍ଡ୍ ଅନୁପାଳନ',
      pricing_badge_high_margin: 'ଉଚ୍ଚ ମାର୍ଜିନ୍ ଏଣ୍ଟରପ୍ରାଇଜ୍',
      pricing_enterprise_sub: '/ ମାସ + ₹୧.୫/କିଗ୍ରା ଅଡିଟ୍ ଫି',
      pricing_enterprise_desc: 'FMCG ଓ ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ EPR ଅନୁପାଳନ ସମାଧାନ।',
      pricing_enterprise_f1: 'CPCB ଅନୁସୂଚୀ II ପ୍ରମାଣଯୋଗ୍ୟ ଅଡିଟ୍ ସାର୍ଟିଫିକେଟ୍',
      pricing_enterprise_f2: 'ସୁରକ୍ଷିତ SHA-256 କ୍ରିପ୍ଟୋଗ୍ରାଫିକ୍ ଚେନ୍ ଅଫ୍ କଷ୍ଟୋଡି',
      pricing_enterprise_f3: 'ନିର୍ଦ୍ଦିଷ୍ଟ ଯୋଗାଣ ଶୃଙ୍ଖଳା ଆକାଉଣ୍ଟ୍ ମ୍ୟାନେଜର୍',
      pricing_enterprise_f4: 'ରିସାଇକ୍ଲର୍ ବ୍ୟାଚ୍ ଗୁଣବତ୍ତା ସାର୍ଟିଫିକେଟ୍',
      pricing_btn_request_pilot: 'ଏଣ୍ଟରପ୍ରାଇଜ୍ ପ୍ରସ୍ତାବ (RFP) ଅନୁରୋଧ କରନ୍ତୁ',
      valprop_heading: 'ଭେଞ୍ଚର-ସମର୍ଥିତ ସ୍କେଲେବିଲିଟି କାହିଁକି ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ',
      valprop_sub: 'ଅସଂଗଠିତ କ୍ଷୁଦ୍ର ଉଦ୍ୟୋଗୀମାନଙ୍କୁ ଫର୍ଚୁନ୍ 500 ESG ଅନୁପାଳନ ସହିତ ଯୋଡିବା।',
      valprop_card1_title: '🏛️ ନିୟାମକ ସୁଯୋଗ ଓ ସମର୍ଥନ',
      valprop_card1_desc: 'କଡ଼ା CPCB ପ୍ଲାଷ୍ଟିକ୍ ବର୍ଜ୍ୟ ନିୟମ ଭାରୀ ଜରିମାନା ସହିତ ୧୦୦% ପ୍ରମାଣିତ ରିସାଇକ୍ଲିଂ ବାଧ୍ୟତାମୂଳକ କରେ।',
      valprop_card2_title: '🤝 ବିକେନ୍ଦ୍ରୀକୃତ ପରିସର',
      valprop_card2_desc: '୨୫ ଲକ୍ଷ କବାଡିବାଲାଙ୍କୁ ହଟାଇବା ପରିବର୍ତ୍ତେ, ଫିର୍ ସେମାନଙ୍କୁ SaaS ଟୁଲ୍ସ ଦେଇ ଆୟ ୨୮% ବୃଦ୍ଧି କରେ।',
      valprop_card3_title: '🔒 ବିଶ୍ୱସନୀୟ ଅଡିଟ୍ ଟ୍ରେଲ୍',
      valprop_card3_desc: 'ଘରୁ ସଂଗ୍ରହଠାରୁ ଆରମ୍ଭ କରି ରିସାଇକ୍ଲିଂ ଭାଟି ପର୍ଯ୍ୟନ୍ତ ପ୍ରତ୍ୟେକ କିଲୋଗ୍ରାମ କ୍ରିପ୍ଟୋଗ୍ରାଫିକ୍ ଭାବେ ସୁରକ୍ଷିତ ରଖାଯାଏ।',
      pitch_deck_title: 'ଫିର୍ (Phir) — ୨-ମିନିଟ୍ ଭେଞ୍ଚର ଷ୍ଟାର୍ଟଅପ୍ ପିଚ୍',
      pitch_btn_prev: '⬅ ପୂର୍ବବର୍ତ୍ତୀ',
      pitch_btn_next: 'ପରବର୍ତ୍ତୀ ସ୍ଲାଇଡ୍ ➔',
      pitch_btn_rfp: '୧୫-ମିନିଟ୍ ଏଣ୍ଟରପ୍ରାଇଜ୍ ପାଇଲଟ୍ RFP ବୁକ୍ କରନ୍ତୁ',
      pitch_kicker_0: 'ଗୁରୁତର ସମସ୍ୟା',
      pitch_title_0: '₹୧.୧ ଲକ୍ଷ କୋଟିର ଅସଂଗଠିତ ରିସାଇକ୍ଲିଂ ବ୍ୟବସ୍ଥା ବିପର୍ଯ୍ୟସ୍ତ',
      pitch_b0_1: 'ଭାରତର ୯୦% ଶୁଖିଲା ବର୍ଜ୍ୟ ୨୫ ଲକ୍ଷ ଅସଂଗଠିତ କବାଡିବାଲା ଓ ବର୍ଜ୍ୟ ସଂଗ୍ରହକାରୀଙ୍କ ଦ୍ୱାରା ନିୟନ୍ତ୍ରିତ ହୁଏ।',
      pitch_b0_2: 'ଦଲାଲମାନେ ତ୍ରୁଟିପୂର୍ଣ୍ଣ ଓଜନ ଓ ଅନ୍ଧାଧୁନ କଟତି କରି ଶ୍ରମିକମାନଙ୍କୁ ଶୋଷଣ କରନ୍ତି।',
      pitch_b0_3: 'FMCG ବ୍ରାଣ୍ଡଗୁଡ଼ିକ କଡ଼ା CPCB EPR ନିୟମ ସମ୍ମୁଖୀନ ହୁଅନ୍ତି କିନ୍ତୁ ଜାଲ୍ କାଗଜୀ ପ୍ରମାଣପତ୍ର ଉପରେ ନିର୍ଭର କରନ୍ତି।',
      pitch_kicker_1: 'ଆମର ସମାଧାନ',
      pitch_title_1: 'ଫିର୍: ଚକ୍ରୀୟ ଯୋଗାଣ ଶୃଙ୍ଖଳା ପାଇଁ ରିଅଲ୍-ଟାଇମ୍ ଅପରେଟିଂ ସିଷ୍ଟମ୍',
      pitch_b1_1: 'ଗ୍ରାହକ ଆପ୍: ଲାଇଭ୍ ମଣ୍ଡି ମୂଲ୍ୟ ସ୍ୱଚ୍ଛତା ସହିତ ଘରୁ ସିଧାସଳଖ ପିକଅପ୍।',
      pitch_b1_2: 'କଲେକ୍ଟର୍ OS: ରୁଟ୍ ଯୋଜନା, ଡିଜିଟାଲ୍ ଓଜନ ମିଳାଣ ଓ ତତକ୍ଷଣାତ୍ UPI ପେମେଣ୍ଟ୍।',
      pitch_b1_3: 'ଏଣ୍ଟରପ୍ରାଇଜ୍ ରେଜିଷ୍ଟ୍ରି: CPCB ଅନୁସୂଚୀ II ଅନୁଯାୟୀ ସୁରକ୍ଷିତ SHA-256 କଷ୍ଟୋଡି ସାର୍ଟିଫିକେଟ୍।',
      pitch_kicker_2: 'ଲାଇଭ୍ ଉତ୍ପାଦ ଓ କାର୍ଯ୍ୟକ୍ଷମତା',
      pitch_title_2: 'ପୂର୍ଣ୍ଣ କାର୍ଯ୍ୟକ୍ଷମ ଏଣ୍ଡ୍-ଟୁ-ଏଣ୍ଡ୍ ମାର୍କେଟପ୍ଲେସ୍',
      pitch_b2_1: 'ତିନି ପକ୍ଷର କାର୍ଯ୍ୟପ୍ରଣାଳୀ ସମ୍ପୂର୍ଣ୍ଣ ସକ୍ରିୟ: ଘରୋଇ, କବାଡିବାଲା ଓ ରିସାଇକ୍ଲର୍।',
      pitch_b2_2: 'ଦିଲ୍ଲୀ ମଣ୍ଡି ସ୍କ୍ରାପ୍ ଦର ସୂଚକାଙ୍କ ସହିତ ସିଧାସଳଖ ଲାଇଭ୍ ସଂଯୋଗ।',
      pitch_b2_3: 'ଇଂରାଜୀ, ହିନ୍ଦୀ ଓ ଓଡ଼ିଆରେ ବିନା ପେଜ୍ ରିଲୋଡ୍ ତତକ୍ଷଣାତ୍ ଭାଷା ପରିବର୍ତ୍ତନ।',
      pitch_kicker_3: 'ବ୍ୟବସାୟ ଓ ରାଜସ୍ୱ ମଡେଲ୍',
      pitch_title_3: 'ଉଚ୍ଚ ମାର୍ଜିନ୍ ଏଣ୍ଟରପ୍ରାଇଜ୍ SaaS ସହିତ ତ୍ରି-ପାକ୍ଷିକ ରାଜସ୍ୱ ମଡେଲ୍',
      pitch_b3_1: 'B2C ଉପଭୋକ୍ତା: ଘରୋଇ ସାମଗ୍ରୀ ଉପରେ ଶୂନ କମିଶନ ସହିତ ମାଗଣା ପିକଅପ୍।',
      pitch_b3_2: 'B2B କବାଡିବାଲା SaaS: ରୁଟ୍ ଯୋଜନା ଓ ବ୍ୟବସାୟ ଲେଜର୍ ପାଇଁ ₹୪୯୯/ମାସ ସବସ୍କ୍ରିପସନ୍।',
      pitch_b3_3: 'ଏଣ୍ଟରପ୍ରାଇଜ୍ EPR ଅନୁପାଳନ: ବ୍ରାଣ୍ଡ୍ ଟ୍ରେସେବିଲିଟି ପାଇଁ ₹୧୪,୯୯୯/ମାସ + ₹୧.୫/କିଗ୍ରା ଅଡିଟ୍ ଫି।',
      pitch_kicker_4: 'ପ୍ରତିଯୋଗିତାମୂଳକ ସୁରକ୍ଷା କବଚ (MOAT)',
      pitch_title_4: 'ଫିର୍ କାହିଁକି ଆଗରେ: ନିୟାମକ ଓ ନେଟୱାର୍କର ଦୃଢ଼ ସୁରକ୍ଷା କବଚ',
      pitch_b4_1: 'ଅସଂଗଠିତ ସହଭାଗୀ ସଶକ୍ତୀକରଣ: ନୂଆ ଗାଡ଼ି କିଣିବା ବଦଳରେ ବର୍ତ୍ତମାନର କବାଡିବାଲାଙ୍କୁ ସଶକ୍ତ କରିବା।',
      pitch_b4_2: 'ସମ୍ପୂର୍ଣ୍ଣ ଶୃଙ୍ଖଳା ଟ୍ରେସେବିଲିଟି: ଘର ଆଗରୁ ଆରମ୍ଭ କରି କାରଖାନା ପର୍ଯ୍ୟନ୍ତ କ୍ରିପ୍ଟୋଗ୍ରାଫିକ୍ ପ୍ରମାଣ।',
      pitch_b4_3: 'ହାଇପରଲୋକାଲ୍ ଡେନସିଟି: ଯାତାୟାତ ନିର୍ଗମନ କମ୍ କରିବା ପାଇଁ କ୍ଲଷ୍ଟର୍-ଆଧାରିତ ଏକତ୍ରୀକରଣ।',
      pitch_kicker_5: 'ଇଣ୍ଡିଆଥନ୍ ଭିଜନ୍ ଓ ବିକାଶ ଯୋଜନା',
      pitch_title_5: 'ଇଣ୍ଡିଆଥନ୍ ୨୦୨୬ ପ୍ରତିବଦ୍ଧତା ଓ ପ୍ରସାର ରୋଡମ୍ୟାପ୍',
      pitch_b5_1: 'ଦିଲ୍ଲୀ-ଏନସିଆର ଏବଂ ଭୁବନେଶ୍ୱରରେ ୧୦୦ ଯାଞ୍ଚ ହୋଇଥିବା କବାଡିବାଲାଙ୍କ ସହିତ ପ୍ରାରମ୍ଭିକ ପାଇଲଟ୍ ଲକ୍ଷ୍ୟ।',
      pitch_b5_2: '୫ଟି ପ୍ରମୁଖ ସହରରେ ୫,୦୦୦ ମେଟ୍ରିକ୍ ଟନ୍/ମାସ ପ୍ରମାଣିତ ପ୍ରକ୍ରିୟାକରଣ କ୍ଷମତା ପର୍ଯ୍ୟନ୍ତ ବିସ୍ତାର।',
      pitch_b5_3: 'ଲଞ୍ଚ ପାଇଁ ପ୍ରସ୍ତୁତ: କୌଣସି ନକଲି ମକଅପ୍ ବିନା ପ୍ରକୃତ ପ୍ରଡକ୍ସନ୍-ଗ୍ରେଡ୍ ଆର୍କିଟେକ୍ଚର୍।',
      pilot_modal_title: '୧୪-ଦିନର ଏଣ୍ଟରପ୍ରାଇଜ୍ ସାଣ୍ଡବକ୍ସ ପାଇଲଟ୍ ଅନୁରୋଧ କରନ୍ତୁ',
      pilot_modal_sub: 'ଫିର୍ (Phir) ର ପ୍ରମାଣିତ ଡିଜିଟାଲ୍ ଯୋଗାଣ ଶୃଙ୍ଖଳା ସହିତ ୧୦୦% CPCB EPR ଅନୁପାଳନ ପୂରଣ କରୁଥିବା ଅଗ୍ରଣୀ ବ୍ରାଣ୍ଡଗୁଡ଼ିକରେ ଯୋଗ ଦିଅନ୍ତୁ।',
      pilot_lbl_org: 'ସଂସ୍ଥା / ବ୍ରାଣ୍ଡର ନାମ *',
      pilot_lbl_email: 'ଆପଣଙ୍କ ଅଫିସିଆଲ୍ ଇମେଲ୍ *',
      pilot_lbl_volume: 'ଆନୁମାନିକ ମାସିକ ପ୍ୟାକେଜିଂ ବର୍ଜ୍ୟ (ମେଟ୍ରିକ୍ ଟନ୍) *',
      pilot_lbl_category: 'ଲକ୍ଷ୍ୟ ଅନୁପାଳନ ବର୍ଗ *',
      pilot_lbl_city: 'ପାଇଲଟ୍ ସହର / ଅଞ୍ଚଳ *',
      pilot_opt_cat1: 'ବର୍ଗ I: କଠିନ ପ୍ଲାଷ୍ଟିକ୍ (HDPE/PP/PET)',
      pilot_opt_cat2: 'ବର୍ଗ II: ନମନୀୟ ମଲ୍ଟି-ଲେୟାର୍ ପ୍ଲାଷ୍ଟିକ୍',
      pilot_opt_cat3: 'ବର୍ଗ III: ବହୁସ୍ତରୀୟ ପ୍ୟାକେଜିଂ',
      pilot_opt_paper: 'ଶିଳ୍ପ କାର୍ଡବୋର୍ଡ ଓ କାଗଜ ପଲ୍ପ',
      pilot_opt_ewaste: 'ଇ-ବର୍ଜ୍ୟ / ଧାତୁ ମିଶ୍ରଣ',
      pilot_btn_submit: 'ସାଣ୍ଡବକ୍ସ ପାଇଲଟ୍ ଆକ୍ସେସ୍ ଅନୁରୋଧ କରନ୍ତୁ',
      pilot_success_msg: 'ସାଣ୍ଡବକ୍ସ ପାଇଲଟ୍ ଅନୁରୋଧ ମିଳିଲା! ଆମର ଏଣ୍ଟରପ୍ରାଇଜ୍ ଟିମ୍ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ ଯୋଗାଯୋଗ କରିବେ।',
    }
  };

  // 2. Active Language State
  let currentLang = 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) {
      currentLang = saved;
    }
  } catch (e) {
    currentLang = 'en';
  }

  function getTranslation(key, fallback = '') {
    const dict = DICTIONARY[currentLang] || DICTIONARY.en;
    if (dict && dict[key] != null) return dict[key];
    if (DICTIONARY.en && DICTIONARY.en[key] != null) return DICTIONARY.en[key];
    return fallback || key;
  }

  // 3. Typography & CSS Injection for Odia & Devanagari Scripts
  const fontStyle = document.createElement('style');
  fontStyle.id = 'phir-i18n-styles';
  fontStyle.textContent = `
    /* Odia and Devanagari Typography Enhancements */
    html[lang="hi"] {
      --body: 'DM Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif;
      --display: 'Yatra One', 'Rozha One', 'Noto Serif Devanagari', Georgia, serif;
    }
    html[lang="od"] {
      --body: 'DM Sans', 'Noto Sans Oriya', 'Kalinga', 'Nirmala UI', sans-serif;
      --display: 'Noto Serif Oriya', 'Kalinga', 'Nirmala UI', Georgia, serif;
    }
    html[lang="hi"] h1, html[lang="hi"] h2, html[lang="hi"] .role-name, html[lang="hi"] .brand,
    html[lang="od"] h1, html[lang="od"] h2, html[lang="od"] .role-name, html[lang="od"] .brand {
      line-height: 1.25;
      letter-spacing: 0.01em;
    }

    /* Language Picker Dropdown Styling (Truck-Art Theme) */
    .phir-lang-picker {
      position: relative;
      display: inline-flex;
      align-items: center;
      margin-left: 6px;
      z-index: 100;
    }
    /* Sticky Topbar to keep navigation and translation always in view */
    .topbar {
      position: sticky !important;
      top: 0 !important;
      z-index: 1000 !important;
      background: var(--bg, #fbf7ee) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
    }

    .phir-lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 34px;
      padding: 4px 12px;
      border: 2px solid var(--primary);
      border-radius: 18px;
      background: var(--surface, #ffffff);
      color: var(--ink);
      font-size: 12px;
      font-weight: 800;
      box-shadow: 2px 2px 0 var(--secondary);
      cursor: pointer;
      transition: transform .2s var(--spring), background .2s, box-shadow .2s;
    }
    .phir-lang-label {
      font-size: 12px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: 0.02em;
    }

    /* Floating Language Switcher for instant access anywhere on page */
    .phir-floating-lang {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 99999 !important;
    }
    .phir-floating-btn {
      height: 42px !important;
      padding: 8px 16px !important;
      font-size: 13px !important;
      border: 2.5px solid var(--primary, #1e3a8a) !important;
      border-radius: 24px !important;
      background: #ffffff !important;
      color: var(--ink, #1f2937) !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
    }
    .phir-floating-dropdown {
      bottom: calc(100% + 8px) !important;
      top: auto !important;
      right: 0 !important;
    }
    .phir-lang-btn:hover {
      background: var(--tint);
      transform: translateY(-2px);
    }
    .phir-lang-globe {
      font-size: 13px;
      line-height: 1;
    }
    .phir-lang-current {
      color: var(--primary);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .phir-lang-arrow {
      font-size: 9px;
      transition: transform .2s ease;
      color: var(--muted);
    }
    .phir-lang-picker.open .phir-lang-arrow {
      transform: rotate(180deg);
    }
    .phir-lang-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 130px;
      background: var(--paper);
      border: 2px solid var(--primary);
      border-radius: 8px;
      box-shadow: 4px 4px 0 var(--secondary);
      padding: 4px;
      display: none;
      flex-direction: column;
      gap: 3px;
      z-index: 9999;
    }
    .phir-lang-picker.open .phir-lang-dropdown {
      display: flex;
    }
    .phir-lang-opt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 7px 10px;
      border: 1px solid transparent;
      border-radius: 4px;
      background: transparent;
      color: var(--ink);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: background .15s, border-color .15s;
    }
    .phir-lang-opt:hover {
      background: var(--tint);
      border-color: var(--primary);
    }
    .phir-lang-opt.active {
      background: var(--primary);
      color: var(--on-primary);
      font-weight: 800;
    }
    .phir-lang-badge {
      font-size: 9px;
      font-weight: 800;
      opacity: 0.8;
      border: 1px solid currentColor;
      padding: 1px 4px;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(fontStyle);

  // 4. Update Global Javascript Data Models for Active Language
  function patchGlobalModels() {
    const t = getTranslation;

    // Patch global names if defined
    if (typeof window.names === 'object' && window.names) {
      window.names.pet = t('mat_pet');
      window.names.cardboard = t('mat_cardboard');
      window.names.paper = t('mat_paper');
      window.names.aluminium = t('mat_aluminium');
      window.names.glass = t('mat_glass');
      window.names.wood = t('mat_wood');
    }

    // Patch global roleNames if defined
    if (typeof window.roleNames === 'object' && window.roleNames) {
      window.roleNames.household = t('role_household');
      window.roleNames.collector = t('role_collector');
      window.roleNames.recycler = t('role_recycler');
    }

    // Patch global tabs if defined
    if (typeof window.tabs === 'object' && window.tabs) {
      window.tabs.household = [t('tab_materials_collection'), t('tab_contributions')];
      window.tabs.collector = [t('tab_collection_map'), t('tab_inventory'), t('tab_profile_impact')];
      window.tabs.recycler = [t('tab_material_marketplace'), t('tab_requirements'), t('tab_bookings'), t('tab_company_profile')];
    }
  }

  // 5. Deep DOM Translation & String Localization Dictionary
  const PHRASE_TO_KEY = [
    // Header & Brand
    ['Choose your role', 'choose_role'],
    ['Switch role', 'switch_role'],
    ['Enter the story', 'enter_story'],
    ['Choose your part', 'choose_part'],
    ['Sample data • offline prototype', 'sample_data_note'],
    ['Sample data · offline prototype', 'sample_data_note'],
    ['PHIR • Resource Recovery Network', 'footer_network'],
    ['PHIR · Resource Recovery Network', 'footer_network'],
    ['Waste & Resource Recovery', 'footer_waste'],

    // Landing / Chooser
    ['Phenkna nahi.', 'landing_h1_main'],
    ['se sochna hai.', 'landing_h1_tagline'],
    ['A better way to pass recyclable materials from your doorstep into the recovery chain.', 'landing_caption'],
    ['Where it begins', 'role_hint_household'],
    ['Kabadiwala • Aggregator', 'role_hint_collector'],
    ['Kabadiwala · Aggregator', 'role_hint_collector'],
    ['Where it becomes', 'role_hint_recycler'],

    // Materials
    ['PET plastic', 'mat_pet'],
    ['Cardboard', 'mat_cardboard'],
    ['Paper', 'mat_paper'],
    ['Aluminium', 'mat_aluminium'],
    ['Glass', 'mat_glass'],
    ['Wood', 'mat_wood'],
    ['All materials', 'mat_all'],

    // Roles
    ['Household', 'role_household'],
    ['Collection partner', 'role_collector'],
    ['Recycler', 'role_recycler'],

    // Buttons
    ['Add material', 'btn_add_material'],
    ['Add from a photo', 'btn_add_photo'],
    ['Request a collection', 'btn_request_collection'],
    ['Request another collection', 'btn_request_another'],
    ['Accept', 'btn_accept'],
    ['Decline', 'btn_decline'],
    ['Mark collected', 'btn_mark_collected'],
    ['Preview selected route', 'btn_preview_route'],
    ['New requirement', 'btn_new_requirement'],
    ['Publish requirement', 'btn_publish_requirement'],
    ['Reserve material', 'btn_reserve_material'],
    ['Confirm handover', 'btn_confirm_handover'],
    ['Save changes', 'btn_save_changes'],
    ['Save company profile', 'btn_save_company'],
    ['Cancel', 'btn_cancel'],
    ['Confirm', 'btn_confirm'],
    ['Continue', 'btn_continue'],
    ['Play again', 'btn_play_again'],
    ['Restart sample journey', 'btn_restart_demo'],
    ['Export demo records', 'btn_export_records'],
    ['Show all materials', 'btn_show_all'],
    ['Go to household', 'btn_go_household'],
    ['Explore materials', 'btn_explore_materials'],
    ['Choose a photo', 'btn_choose_photo'],
    ['Confirm material', 'btn_confirm_material'],
    ['Create requirement', 'btn_create_requirement'],
    ['Mandi Scrap Rates', 'btn_mandi_rates'],
    ['EPR Audit', 'btn_epr_audit'],
    ['Instant UPI Pay', 'btn_instant_upi'],

    // Household
    ['Your home / Lajpat Nagar, Delhi', 'house_title'],
    ['A little space.', 'house_h1'],
    ['A second beginning.', 'house_h1'],
    ['Keep your recyclables separate. Let the right hands take them forward.', 'house_copy'],
    ['Your materials', 'house_your_materials'],
    ['recorded materials', 'house_recorded_materials'],
    ['Room for a new beginning.', 'house_empty_title'],
    ['Your recyclable materials will appear here.', 'house_empty_desc'],
    ['Your collection', 'house_your_collection'],
    ['ready for a collection partner.', 'house_ready_prefix'],
    ['Waiting for a collection partner', 'house_waiting_partner'],
    ['Accepted by a collection partner', 'house_accepted_partner'],
    ['Collection recorded', 'house_collection_recorded'],
    ['Requested', 'house_step_requested'],
    ['Accepted', 'house_step_accepted'],
    ['Collected', 'house_step_collected'],
    ['Lajpat Nagar · Locality-level request', 'house_desc_pending'],
    ['Your materials are awaiting handover.', 'house_desc_accepted'],
    ['Material is now in the collection partner’s inventory.', 'house_desc_collected'],
    ['Good hands, nearby.', 'house_good_hands'],
    ['Collection partners in your locality.', 'house_local_partners_desc'],
    ['Your request is visible at locality level. A collection partner accepts it; this prototype does not book a named partner directly.', 'house_note_locality'],
    ['Separate a little. Save a possibility.', 'house_guide_heading'],
    ['Keep it clean & dry', 'house_guide_1_h3'],
    ['Empty bottles and cans. Keep paper and cardboard free from food and moisture.', 'house_guide_1_p'],
    ['Keep these in the chain', 'house_guide_2_h3'],
    ['PET plastic, cardboard, paper, aluminium, glass and wood. Check local acceptance with your collection partner.', 'house_guide_2_p'],
    ['Keep these separate', 'house_guide_3_h3'],
    ['Food waste, sanitary waste and hazardous items should not go into your recyclable bundle.', 'house_guide_3_p'],

    // Contributions
    ['Your part in the chain', 'contrib_title'],
    ['Small actions. Real records.', 'contrib_h1'],
    ['Every contribution is traceable to a collection or transfer — not an assumed environmental saving.', 'contrib_copy'],
    ['Your material journey', 'contrib_journey'],
    ['Recorded in this demonstration', 'contrib_demo_record'],
    ['What this means', 'contrib_meaning'],
    ['Collection keeps a material in the recovery chain. Transfer documents its next custodian. Recycling needs separate downstream evidence.', 'contrib_meaning_note'],
    ['A handover, not a finish line.', 'contrib_handover_title'],
    ['The strongest impact claim today is what we can actually record.', 'contrib_handover_desc'],

    // Collector
    ['Collection partner / Delhi', 'col_title'],
    ['The next good hand', 'col_h1'],
    ['could be yours.', 'col_h1'],
    ['Find material ready for collection, one neighbourhood at a time.', 'col_copy'],
    ['Delhi, by neighbourhood.', 'col_map_heading'],
    ['Locality-level view', 'col_locality_view'],
    ['This is an illustrated locality preview, not road navigation. Density labels are sample fixtures. Household identities and exact locations are never shown.', 'col_map_note'],
    ['No open collection requests.', 'col_empty_h3'],
    ['Add materials and request collection from the Household page to see the full journey.', 'col_empty_p'],
    ['Neighbourhood preview', 'col_preview_heading'],
    ['Mixed recyclable bundle', 'col_mixed_bundle'],
    ['Paper, PET & cardboard · Area-level sample', 'col_bundle_desc'],
    ['Value: awaiting a backend quote', 'col_quote_waiting'],
    ['Sample estimate', 'col_sample_estimate'],
    ['No live quote', 'col_no_live_quote'],
    ['Collected materials', 'col_inv_title'],
    ['Ready for the next hand.', 'col_inv_h1'],
    ['Your collected material becomes discoverable to recyclers.', 'col_inv_copy'],
    ['Material in your custody', 'col_custody_h2'],
    ['Demand / Delhi', 'col_demand_title'],
    ['Somebody needs', 'col_demand_h1'],
    ['what you already hold.', 'col_demand_h1'],
    ['Recycler requirements, linked to material in the collection chain.', 'col_demand_copy'],
    ['Open requirements', 'col_open_reqs'],
    ['No open requirements.', 'col_no_open_reqs'],
    ['New recycler requirements will appear here.', 'col_no_open_reqs_p'],
    ['Collection partner / Profile', 'col_profile_title'],
    ['A familiar face.', 'col_profile_h1'],
    ['A vital link.', 'col_profile_h1'],
    ['Kabadiwalas and aggregators power the existing recycling economy.', 'col_profile_copy'],
    ['Collection partner', 'col_partner_heading'],
    ['Sample profile', 'col_sample_profile'],
    ['Kabadiwala / Aggregator · Delhi', 'col_role_desc'],
    ['Materials accepted', 'col_materials_accepted'],
    ['PET, cardboard, paper, aluminium, glass and wood', 'col_all_six_mats'],
    ['Service localities', 'col_service_localities'],
    ['Lajpat Nagar, Karol Bagh and Saket', 'col_delhi_areas'],
    ['Trust is built in the chain.', 'col_trust_chain'],
    ['This prototype combines collector and aggregator into one role. In the real economy, they may be different people.', 'col_trust_note'],
    ['Profile indicators are demonstration records, not certifications. No invented scores or verified recycling claims.', 'col_trust_muted'],

    // Recycler
    ['Recycler / Delhi', 'rec_title'],
    ['The next life', 'rec_h1'],
    ['starts with the right material.', 'rec_h1'],
    ['Discover materials already collected by local partners.', 'rec_copy'],
    ['Material, ready for its next life.', 'rec_ready_life'],
    ['Collected inventory', 'rec_collected_inv'],
    ['Collected material', 'rec_collected_mat'],
    ['No available lots.', 'rec_no_lots_h3'],
    ['Matching collected materials will appear here.', 'rec_no_lots_p'],
    ['Your material demand', 'rec_req_title'],
    ['Give the next life', 'rec_req_h1'],
    ['a clear direction.', 'rec_req_h1'],
    ['Tell collection partners which materials your company needs.', 'rec_req_copy'],
    ['Your requirements', 'rec_your_reqs'],
    ['material requests', 'rec_req_units'],
    ['still needed · Delhi', 'rec_still_needed'],
    ['Reserved → Transferred', 'rec_book_title'],
    ['A reservation is a promise.', 'rec_book_h1'],
    ['A handover is a record.', 'rec_book_h1'],
    ['Bookings reserve material immediately. Confirm only when the material has been handed over.', 'rec_book_copy'],
    ['Your bookings', 'rec_your_bookings'],
    ['No bookings yet.', 'rec_no_bookings_h3'],
    ['Reserve a matching lot in the material marketplace.', 'rec_no_bookings_p'],
    ['Recycler / Company', 'rec_comp_title'],
    ['Put a name', 'rec_comp_h1'],
    ['to the next beginning.', 'rec_comp_h1'],
    ['Your company details accompany the requirements you publish.', 'rec_comp_copy'],
    ['Company name', 'rec_field_name'],
    ['Company locality', 'rec_field_locality'],
    ['Company contact email (optional)', 'rec_field_contact'],
    ['Saved to the live demonstration profile for this recycler.', 'rec_note_live'],
    ['Demand meets', 'rec_demand_meets'],
    ['the existing economy.', 'rec_demand_meets'],
    ['Publish material requirements, find collected inventory, reserve a lot and record its handover.', 'rec_demand_desc'],

    // Identity Modal
    ['Enter a name and choose the Delhi area you live in. This creates a lightweight demo profile-no password required.', 'identity_prompt_live'],
    ['Enter a name and choose the Delhi area you serve. This creates a lightweight demo profile-no password required.', 'identity_prompt_serve'],
    ['Service area', 'identity_label_service_area'],
    ['Area', 'identity_label_area'],
    ['Saving profile.', 'identity_saving'],

    // Areas
    ['North West', 'area_north_west'],
    ['South West', 'area_south_west'],
    ['New Delhi', 'area_new_delhi'],
    ['North East', 'area_north_east'],
    ['South East', 'area_south_east'],
    ['Shahdara', 'area_shahdara'],
    ['Central', 'area_central'],
    ['North', 'area_north'],
    ['South', 'area_south'],
    ['East', 'area_east'],
    ['West', 'area_west'],
    ['Lajpat Nagar', 'area_lajpat'],
    ['Karol Bagh', 'area_karol'],
    ['Saket', 'area_saket'],

    // Modals
    ['Add a material', 'modal_add_mat'],
    ['Edit material', 'modal_edit_mat'],
    ['From a photo', 'modal_from_photo'],
    ['Choose one dominant material to identify.', 'modal_photo_help'],
    ['Recognition result', 'modal_rec_result'],
    ['Waiting for a photo', 'modal_waiting_photo'],
    ['Your material suggestion will appear here.', 'modal_suggestion_here'],
    ['I confirm this material identification.', 'modal_confirm_label'],
    ['Remove this material?', 'modal_remove_title'],
    ['Only available material can be removed from your household inventory.', 'modal_remove_copy'],
    ['What does your company need?', 'modal_new_req_title'],
    ['Material needed', 'modal_req_mat'],
    ['Required weight (kg)', 'modal_req_weight'],
    ['Minimum booking (kg, optional)', 'modal_req_min'],
    ['This requirement is visible to the collection partner in this demonstration.', 'modal_req_note'],
    ['Reserve this material', 'modal_reserve_title'],
    ['Match to your requirement', 'modal_match_req'],
    ['Quantity to reserve (kg)', 'modal_qty_reserve'],
    ['The quantity is reserved immediately. Material transfers only after you confirm the handover.', 'modal_reserve_note'],
    ['You need a matching requirement before reserving this material.', 'modal_need_req_note'],
    ['Decline this collection?', 'modal_decline_title'],
    ['The material returns to the household’s available inventory in this demonstration.', 'modal_decline_copy'],
    ['Record this collection?', 'modal_record_col_title'],
    ['Confirm that the material has been handed to the collection partner. This records collection, not recycling.', 'modal_record_col_copy'],
    ['Confirm the material handover?', 'modal_confirm_handover_title'],
    ['This completes the booking and records a transfer to your company. It does not verify that recycling occurred.', 'modal_confirm_handover_copy'],
    ['Restart the demonstration?', 'modal_restart_title'],
    ['This clears the current presentation journey and restores the sample records.', 'modal_restart_copy'],
    ['Sample records for the presentation. Added material has no live quote. Collection and transfer are recorded separately; neither verifies recycling.', 'sample_records_notice'],

    // Metrics
    ['Available for collection', 'metric_available_collection'],
    ['Estimated value · sample', 'metric_est_value'],
    ['Collected so far', 'metric_collected_so_far'],
    ['Sample local partners', 'metric_local_partners'],
    ['Material recorded', 'metric_material_recorded'],
    ['Collected by a partner', 'metric_collected_by_partner'],
    ['Transferred to a recycler', 'metric_transferred_to_recycler'],
    ['Not verified', 'metric_not_verified'],
    ['Actual recycling', 'metric_actual_recycling'],
    ['Your open opportunities', 'metric_open_opportunities'],
    ['Available collected inventory', 'metric_avail_inventory'],
    ['Reserved for transfer', 'metric_reserved_transfer'],
    ['Transferred to recyclers', 'metric_transferred_recyclers'],
    ['Material held or transferred', 'metric_held_or_transferred'],
    ['Material transferred', 'metric_material_transferred'],
    ['Collections recorded', 'metric_collections_recorded'],
    ['Available in sample marketplace', 'metric_avail_marketplace'],
    ['Open requirements', 'metric_open_requirements'],
    ['Reserved for you', 'metric_reserved_for_you'],
    ['Confirmed transfers', 'metric_confirmed_transfers'],
    ['Active reservations', 'metric_active_reservations'],
    ['Reserved quantity', 'metric_reserved_quantity'],
    ['Sample material lots', 'metric_sample_material_lots'],

    // Statuses
    ['available', 'status_available'],
    ['requested', 'status_requested'],
    ['pending', 'status_pending'],
    ['accepted', 'status_accepted'],
    ['collected', 'status_collected'],
    ['reserved', 'status_reserved'],
    ['transferred', 'status_transferred'],
    ['fulfilled', 'status_fulfilled'],
    ['Route stop', 'status_route_stop'],

    // Backend Domain Errors
    ['only available household material can be edited', 'err_only_available_edit'],
    ['only available household material can be removed', 'err_only_available_remove'],
    ['at least one material is required', 'err_at_least_one'],
    ['all materials must belong to the household and be available', 'err_belong_household'],
    ['only pending requests can be accepted', 'err_only_pending_accept'],
    ['only pending requests can be rejected', 'err_only_pending_reject'],
    ['request must be accepted by this kabadiwala before collection', 'err_must_accept_first'],
    ['minimum_quantity_kg must be between zero and quantity_kg', 'err_min_between_zero'],
    ['an active requirement already exists for this material', 'err_active_req_exists'],
    ['requirement not found for recycler', 'err_req_not_found'],
    ['requested booking exceeds available or required quantity', 'err_booking_exceeds'],
    ['requested booking is below the requirement minimum quantity', 'err_booking_below_min'],
    ['booking not found for recycler', 'err_booking_not_found'],
    ['only confirmed bookings can be completed', 'err_only_confirmed_complete'],
    ['reserved material is no longer available', 'err_reserved_no_longer_avail'],
    ['profile not found', 'err_profile_not_found'],
    ['material not found', 'err_material_not_found'],
    ['collection request not found', 'err_collection_req_not_found'],

    // Live Polish Notifications
    ['Saved to recovery records', 'live_saved_records'],
    ['Company profile ready', 'live_profile_ready'],
    ['Inventory needs a refresh', 'live_inventory_refresh'],
    ['Live recovery records', 'live_recovery_records'],

    // Startup MVP & Business Layer phrase mappings
    ['🎙️ 2-Min Pitch Deck', 'nav_pitch_deck'],
    ['💼 Pricing & Model', 'nav_pricing_model'],
    ['⚖️ Mandi Scrap Rates', 'nav_mandi_rates'],
    ['🌱 EPR Audit', 'btn_epr_audit'],
    ['🗺️ Plan Pickup Route', 'btn_plan_route'],
    ['Preview selected route', 'btn_preview_route'],
    ['Route stop', 'route_stop_lbl'],
    ['Stops Selected', 'route_stops_selected'],
    ['total circuit', 'route_total_distance'],
    ['estimated trip', 'route_estimated_trip'],
    ['Privacy preserved via centroid obfuscation', 'route_privacy_note'],
    ['⚡ INDIATHON 2026 STARTUP MVP · POWERED BY E-CELL IIIT BHUBANESWAR', 'startup_hero_badge'],
    ['CPCB SCHEDULE II AUDIT PARITY', 'startup_cpcb_badge'],
    ['Operating System for India\'s ₹1.1L Cr Circular Economy', 'startup_hero_subtitle'],
    ['Recoverable Material Tracked', 'ticker_mat_tracked'],
    ['Direct Payouts to Collectors', 'ticker_direct_payouts'],
    ['SHA-256 CPCB Audit Parity', 'ticker_cpcb_parity'],
    ['Verified CO2e Diverted', 'ticker_co2_diverted'],
    ['100% Verified', 'ticker_verified_pct'],
    ['💼 Venture Business Model & Unit Economics', 'biz_model_heading'],
    ['How Phir transforms unorganized scrap collection into high-margin enterprise compliance and bankable green supply chains.', 'biz_model_sub'],
    ['Interactive Volume & Revenue Simulator', 'sim_heading'],
    ['Slide to simulate monthly processing volume', 'sim_sub'],
    ['Recycled Material GMV', 'sim_feedstock_label'],
    ['Collector Income Boost (+28%)', 'sim_collector_gain_label'],
    ['Phir Platform Revenue', 'sim_platform_rev_label'],
    ['CO2e Emissions Prevented', 'sim_co2_offset_label'],
    ['🏠 Consumer / Household', 'pricing_tier_household'],
    ['Free Forever', 'pricing_free_forever'],
    ['Direct doorstep recovery with fair pricing.', 'pricing_household_desc'],
    ['Live Mandi price transparency', 'pricing_household_f1'],
    ['Digital scale tare deduction', 'pricing_household_f2'],
    ['Instant UPI doorstep payment', 'pricing_household_f3'],
    ['Zero pickup charges', 'pricing_household_f4'],
    ['Test Household Demo', 'pricing_btn_test_household'],
    ['🚛 Phir Aggregator Pro', 'pricing_tier_aggregator'],
    ['CORE SAAS REVENUE', 'pricing_badge_core_saas'],
    ['/ month', 'pricing_per_month'],
    ['Mobile OS for micro-dealers & kabadiwalas.', 'pricing_aggregator_desc'],
    ['Multi-stop route planning & fuel optimization', 'pricing_aggregator_f1'],
    ['Direct mill batch aggregation', 'pricing_aggregator_f2'],
    ['Digital weighing scales & UPI payout ledger', 'pricing_aggregator_f3'],
    ['Transparent mandi rate intelligence', 'pricing_aggregator_f4'],
    ['Start 14-Day Free Pilot', 'pricing_btn_start_pro'],
    ['🏭 Enterprise Brand Compliance', 'pricing_tier_enterprise'],
    ['HIGH MARGIN ENTERPRISE', 'pricing_badge_high_margin'],
    ['/ mo + ₹1.5/kg audit fee', 'pricing_enterprise_sub'],
    ['Turnkey Extended Producer Responsibility (EPR) compliance for FMCG & electronics.', 'pricing_enterprise_desc'],
    ['CPCB Schedule II verifiable audit certificates', 'pricing_enterprise_f1'],
    ['Tamper-proof SHA-256 chain of custody', 'pricing_enterprise_f2'],
    ['Dedicated supply chain account manager', 'pricing_enterprise_f3'],
    ['Recycler batch quality certificates', 'pricing_enterprise_f4'],
    ['Request Enterprise RFP', 'pricing_btn_request_pilot'],
    ['Why Venture-Backed Scalability Matters', 'valprop_heading'],
    ['Bridging unorganized micro-entrepreneurs with Fortune 500 ESG compliance.', 'valprop_sub'],
    ['🏛️ Regulatory Tailwinds', 'valprop_card1_title'],
    ['Strict CPCB plastic packaging waste rules mandate 100% verifiable recycling targets with heavy non-compliance penalties.', 'valprop_card1_desc'],
    ['🤝 Decentralized Scale', 'valprop_card2_title'],
    ['Instead of replacing 2.5M informal kabadiwalas, Phir equips them with SaaS tools to increase their earnings by 28%.', 'valprop_card2_desc'],
    ['🔒 Bankable Audit Trail', 'valprop_card3_title'],
    ['Every kilogram from doorstep pickup to recycling furnace is cryptographically hashed for institutional accountability.', 'valprop_card3_desc'],
    ['Phir — 2-Minute Venture Startup Pitch', 'pitch_deck_title'],
    ['⬅ Previous', 'pitch_btn_prev'],
    ['Next Slide ➔', 'pitch_btn_next'],
    ['Book 15-Min Enterprise Pilot RFP', 'pitch_btn_rfp'],
    ['THE PROBLEM', 'pitch_kicker_0'],
    ['The ₹1.1 Lakh Cr Informal Recycling Economy is Broken', 'pitch_title_0'],
    ['90% of India\'s dry waste is handled by 2.5M unorganized waste-pickers and micro-dealers.', 'pitch_b0_1'],
    ['Middlemen exploit informal workers with rigged scales and untracked cash deductions.', 'pitch_b0_2'],
    ['FMCG brands face strict CPCB EPR mandates but rely on fraudulent paper certificates.', 'pitch_b0_3'],
    ['OUR SOLUTION', 'pitch_kicker_1'],
    ['Phir: Real-Time Operating System for Circular Supply Chains', 'pitch_title_1'],
    ['Consumer App: On-demand doorstep pickup with live Mandi benchmark transparency.', 'pitch_b1_1'],
    ['Collector OS: Route planning, digital hanging scale reconciliation, and instant UPI payouts.', 'pitch_b1_2'],
    ['Enterprise Registry: Tamper-proof SHA-256 chain-of-custody certificates matching CPCB Schedule II.', 'pitch_b1_3'],
    ['LIVE MVP & TRACTION', 'pitch_kicker_2'],
    ['End-to-End Functional Marketplace', 'pitch_title_2'],
    ['Complete tri-sided workflow fully operational: Household, Collector, and Recycler.', 'pitch_b2_1'],
    ['Direct live integration with Delhi Mandi scrap price indices.', 'pitch_b2_2'],
    ['Zero-reload tri-lingual accessibility in English, Hindi, and Odia.', 'pitch_b2_3'],
    ['BUSINESS MODEL', 'pitch_kicker_3'],
    ['Tri-Sided Monetization with High-Margin Enterprise SaaS', 'pitch_title_3'],
    ['B2C Consumer: Free doorstep pickup with zero commission on household recyclables.', 'pitch_b3_1'],
    ['B2B Collector SaaS: ₹499/mo subscription for route planning and trade ledger.', 'pitch_b3_2'],
    ['Enterprise EPR Compliance: ₹14,999/mo + ₹1.5/kg audit fee for institutional brand traceability.', 'pitch_b3_3'],
    ['COMPETITIVE MOAT', 'pitch_kicker_4'],
    ['Why Phir Wins: Regulatory & Network Moat', 'pitch_title_4'],
    ['Informal Partner Inclusion: Empowering existing kabadiwalas instead of heavy asset fleets.', 'pitch_b4_1'],
    ['Full Chain Traceability: Cryptographic proof from household doorstep to industrial extruder.', 'pitch_b4_2'],
    ['Hyperlocal Density: Cluster-based aggregation minimizing collection transport emissions.', 'pitch_b4_3'],
    ['INDIATHON VISION', 'pitch_kicker_5'],
    ['Indiathon 2026 Commitment & Expansion Roadmap', 'pitch_title_5'],
    ['Targeting initial pilot with 100 verified kabadiwalas in Delhi-NCR and Bhubaneswar.', 'pitch_b5_1'],
    ['Scaling to 5,000 MT/month verified processing capacity across 5 Tier-1 cities.', 'pitch_b5_2'],
    ['Built to launch: Production-grade architecture with zero simulated mockups.', 'pitch_b5_3'],
    ['Request 14-Day Enterprise Sandbox Pilot', 'pilot_modal_title'],
    ['Join forward-thinking brands meeting 100% CPCB EPR compliance with Phir\'s verified digital supply chain.', 'pilot_modal_sub'],
    ['Organization / Brand Name *', 'pilot_lbl_org'],
    ['Your Work Email *', 'pilot_lbl_email'],
    ['Estimated Monthly Packaging Waste (MT) *', 'pilot_lbl_volume'],
    ['Target Compliance Category *', 'pilot_lbl_category'],
    ['Pilot City / Locality *', 'pilot_lbl_city'],
    ['Category I: Rigid Plastics (HDPE/PP/PET)', 'pilot_opt_cat1'],
    ['Category II: Flexible Multi-Layer Plastics', 'pilot_opt_cat2'],
    ['Category III: Multi-Layered Packaging', 'pilot_opt_cat3'],
    ['Industrial Cardboard & Paper Pulp', 'pilot_opt_paper'],
    ['E-Waste / Metal Alloys', 'pilot_opt_ewaste'],
    ['Request Sandbox Pilot Access', 'pilot_btn_submit'],
    ['Sandbox Pilot request received! Our enterprise team will contact your organization within 24 hours.', 'pilot_success_msg'],
  ];

  // Translates a single text string by checking direct match, phrase match, or dictionary lookup
  function translateString(str) {
    if (!str || typeof str !== 'string') return str;
    const trimmed = str.trim();
    if (!trimmed) return str;

    // Direct dictionary key check
    if (DICTIONARY[currentLang] && DICTIONARY[currentLang][trimmed]) {
      return str.replace(trimmed, DICTIONARY[currentLang][trimmed]);
    }

    // Phrase table check
    for (const [enPhrase, key] of PHRASE_TO_KEY) {
      if (trimmed === enPhrase) {
        return str.replace(trimmed, getTranslation(key, enPhrase));
      }
    }

    // Check if the string matches any target translation in other languages to enable switching back and forth
    for (const lang of SUPPORTED) {
      if (lang === currentLang) continue;
      const otherDict = DICTIONARY[lang];
      for (const [key, val] of Object.entries(otherDict)) {
        if (typeof val === 'string' && val.trim() === trimmed) {
          return str.replace(trimmed, getTranslation(key, val));
        }
      }
    }

    return str;
  }

  // Recursive DOM text walker that safely translates user-visible text without breaking HTML structure or scripts
  function translateElementTree(node) {
    if (!node || node.nodeType !== 1) return;
    if (['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'SVG'].includes(node.tagName)) return;
    if (node.classList?.contains('phir-lang-picker') || node.classList?.contains('brand-mark')) return;

    // Translate attributes
    for (const attr of ['placeholder', 'title', 'aria-label', 'alt']) {
      const val = node.getAttribute?.(attr);
      if (val && !val.startsWith('http') && !val.startsWith('data:')) {
        const trans = translateString(val);
        if (trans !== val) node.setAttribute(attr, trans);
      }
    }

    // Translate direct text nodes
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        // Text node
        const original = child.nodeValue;
        if (original && original.trim().length > 0) {
          const trans = translateString(original);
          if (trans !== original) child.nodeValue = trans;
        }
      } else if (child.nodeType === 1) {
        translateElementTree(child);
      }
    }
  }

  // 6. Language Switcher UI Injection & Lifecycle Management
  function injectLanguageSelector() {
    const topbars = document.querySelectorAll('.topbar .top-links, .story-nav .top-links');
    topbars.forEach(links => {
      if (links.querySelector('.phir-lang-picker')) return;

      const picker = document.createElement('div');
      picker.className = 'phir-lang-picker';
      picker.id = 'phir-lang-picker';
      picker.innerHTML = `
        <button class="phir-lang-btn" id="phir-lang-btn" data-action="hard-translate" aria-haspopup="true" aria-expanded="false" title="Translate / भाषा बदलें / ଭାଷା ବଦଳାନ୍ତୁ (Hard Translate)">
          <span class="phir-lang-globe">🌐</span>
          <span class="phir-lang-label">${currentLang === 'hi' ? 'भाषा' : currentLang === 'od' ? 'ଭାଷା' : 'Translate'}</span>
          <span class="phir-lang-current">${currentLang.toUpperCase()}</span>
          <span class="phir-lang-arrow">▾</span>
        </button>
        <div class="phir-lang-dropdown" role="menu">
          <button class="phir-lang-opt ${currentLang === 'en' ? 'active' : ''}" data-lang="en" role="menuitem">
            <span>English</span> <span class="phir-lang-badge">EN</span>
          </button>
          <button class="phir-lang-opt ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi" role="menuitem">
            <span>हिन्दी</span> <span class="phir-lang-badge">HI</span>
          </button>
          <button class="phir-lang-opt ${currentLang === 'od' ? 'active' : ''}" data-lang="od" role="menuitem">
            <span>ଓଡ଼ିଆ</span> <span class="phir-lang-badge">OD</span>
          </button>
        </div>
      `;

      const btn = picker.querySelector('.phir-lang-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = picker.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
      });

      picker.querySelectorAll('.phir-lang-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetLang = opt.dataset.lang;
          picker.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          setLanguage(targetLang);
        });
      });

      links.appendChild(picker);
    });

    // Also inject persistent floating language pill so translate is always 1-click reachable anywhere
    if (!document.getElementById('phir-floating-lang-picker') && document.body) {
      const floating = document.createElement('div');
      floating.className = 'phir-lang-picker phir-floating-lang';
      floating.id = 'phir-floating-lang-picker';
      floating.innerHTML = `
        <button class="phir-lang-btn phir-floating-btn" data-action="hard-translate" aria-haspopup="true" aria-expanded="false" title="Translate / भाषा बदलें / ଭାଷା ବଦଳାନ୍ତୁ (Hard Translate)">
          <span class="phir-lang-globe">🌐</span>
          <span class="phir-lang-label">${currentLang === 'hi' ? 'भाषा' : currentLang === 'od' ? 'ଭାଷା' : 'Translate'}</span>
          <span class="phir-lang-current">${currentLang.toUpperCase()}</span>
          <span class="phir-lang-arrow">▾</span>
        </button>
        <div class="phir-lang-dropdown phir-floating-dropdown" role="menu">
          <button class="phir-lang-opt ${currentLang === 'en' ? 'active' : ''}" data-lang="en" role="menuitem">
            <span>English</span> <span class="phir-lang-badge">EN</span>
          </button>
          <button class="phir-lang-opt ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi" role="menuitem">
            <span>हिन्दी</span> <span class="phir-lang-badge">HI</span>
          </button>
          <button class="phir-lang-opt ${currentLang === 'od' ? 'active' : ''}" data-lang="od" role="menuitem">
            <span>ଓଡ଼ିଆ</span> <span class="phir-lang-badge">OD</span>
          </button>
        </div>
      `;

      const fBtn = floating.querySelector('.phir-lang-btn');
      fBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = floating.classList.toggle('open');
        fBtn.setAttribute('aria-expanded', String(isOpen));
      });

      floating.querySelectorAll('.phir-lang-opt').forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetLang = opt.dataset.lang;
          floating.classList.remove('open');
          fBtn.setAttribute('aria-expanded', 'false');
          setLanguage(targetLang);
        });
      });

      document.body.appendChild(floating);
    }
  }

  // Global click handler to close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.phir-lang-picker')) {
      document.querySelectorAll('.phir-lang-picker.open').forEach(p => {
        p.classList.remove('open');
        p.querySelector('.phir-lang-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // 7. Core Language Change Engine
  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    document.documentElement.lang = lang;

    // Update Language Picker Displays
    document.querySelectorAll('.phir-lang-current').forEach(el => {
      el.textContent = lang.toUpperCase();
    });
    document.querySelectorAll('.phir-lang-label').forEach(el => {
      el.textContent = lang === 'hi' ? 'भाषा' : lang === 'od' ? 'ଭାଷା' : 'Translate';
    });
    document.querySelectorAll('.phir-lang-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.lang === lang);
    });

    // Patch javascript data constants
    patchGlobalModels();

    // Re-render app view if the global render function exists
    if (typeof window.render === 'function') {
      try {
        window.render();
      } catch (e) {
        console.warn('phir-i18n: render() caught error:', e);
      }
    }

    // Translate any static or late elements
    translateElementTree(document.body);
    injectLanguageSelector();

    // Re-invoke enhancements if present to re-render modals in the new language
    window.dispatchEvent(new CustomEvent('phir-language-changed', { detail: { lang } }));
  }

  // 8. Intercept Native Toast & Modal to Translate Dynamic User Messages
  function interceptNotificationServices() {
    // Intercept window.toast
    if (typeof window.toast === 'function' && !window.toast._phirIntercepted) {
      const originalToast = window.toast;
      window.toast = function(message) {
        const translated = translateString(message);
        return originalToast(translated);
      };
      window.toast._phirIntercepted = true;
    }

    // Intercept window.openModal if present
    if (typeof window.openModal === 'function' && !window.openModal._phirIntercepted) {
      const originalModal = window.openModal;
      window.openModal = function(title, body) {
        const transTitle = translateString(title);
        originalModal(transTitle, body);
        const modal = document.querySelector('dialog#modal, .modal');
        if (modal) translateElementTree(modal);
      };
      window.openModal._phirIntercepted = true;
    }
  }

  // 9. Mutation Observer to keep language applied across view transitions
  const observer = new MutationObserver(() => {
    injectLanguageSelector();
    if (currentLang !== 'en') {
      translateElementTree(document.body);
    }
  });

  // 10. Initialization
  function init() {
    document.documentElement.lang = currentLang;
    patchGlobalModels();
    interceptNotificationServices();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectLanguageSelector();
        if (currentLang !== 'en') {
          translateElementTree(document.body);
        }
      });
    } else {
      injectLanguageSelector();
      if (currentLang !== 'en') {
        translateElementTree(document.body);
      }
    }

    setInterval(injectLanguageSelector, 1000);
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // Export public interface
  window.PHIR_I18N = {
    setLanguage,
    getLanguage: () => currentLang,
    t: getTranslation,
    translateTree: translateElementTree,
    dictionary: DICTIONARY
  };

  init();
})();
