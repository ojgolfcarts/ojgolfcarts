/* ========================================
   MAIN.JS — OJ Golf Cart Rentals
   ======================================== */

// --- Dark Mode Toggle ---
(function () {
  const html = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', theme);

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      updateToggleIcon();
    });
  }

  // Also update any other toggles on the page
  document.querySelectorAll('[data-theme-toggle]').forEach(t => {
    t.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
  });
})();

// --- Sticky Nav Shadow ---
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

// --- Mobile Hamburger ---
const hamburger = document.querySelector('.nav__hamburger');
const drawer = document.querySelector('.nav__drawer');
if (hamburger && drawer) {
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  // Close on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Multi-Step Booking Form ---
const formStepTabs = document.querySelectorAll('.form-step-tab');
const formSections = document.querySelectorAll('.form-section');
const formNextBtns = document.querySelectorAll('[data-form-next]');
const formPrevBtns = document.querySelectorAll('[data-form-prev]');

let currentStep = 0;

function goToStep(step) {
  formStepTabs.forEach((tab, i) => tab.classList.toggle('active', i === step));
  formSections.forEach((sec, i) => sec.classList.toggle('active', i === step));
  currentStep = step;
}

formNextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep < formStepTabs.length - 1) goToStep(currentStep + 1);
  });
});

formPrevBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep > 0) goToStep(currentStep - 1);
  });
});

// Init first step
if (formStepTabs.length) goToStep(0);

// --- Toggle celebration field ---
const celebRadios = document.querySelectorAll('[name="celebrating"]');
const celebField = document.getElementById('celebration-field');
if (celebRadios.length && celebField) {
  celebRadios.forEach(r => {
    r.addEventListener('change', () => {
      celebField.style.display = r.value === 'yes' ? 'flex' : 'none';
    });
  });
}

// --- Toggle decoration field ---
const decoRadios = document.querySelectorAll('[name="decorations"]');
const decoField = document.getElementById('decoration-note');
if (decoRadios.length && decoField) {
  decoRadios.forEach(r => {
    r.addEventListener('change', () => {
      decoField.style.display = r.value === 'yes' ? 'block' : 'none';
    });
  });
}

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   DECORATION VIDEO SHOWCASE — TAB SWITCHING
   ============================================================ */
(function () {
  const tabList = document.querySelector('.deco-tabs');
  if (!tabList) return;

  const tabs = tabList.querySelectorAll('.deco-tab');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Deactivate all tabs
      tabs.forEach(function (t) {
        t.classList.remove('deco-tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      // Hide all panels
      document.querySelectorAll('.deco-panel').forEach(function (panel) {
        panel.hidden = true;
        panel.classList.remove('deco-panel--active');
      });

      // Activate clicked tab
      tab.classList.add('deco-tab--active');
      tab.setAttribute('aria-selected', 'true');

      // Show matching panel
      var panelId = tab.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('deco-panel--active');
      }
    });
  });
})();

/* ============================================================
   BOOKING FORM — WHATSAPP SUBMISSION
   ============================================================ */
(function () {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect all field values
    const get = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
    const getRadio = name => {
      const checked = form.querySelector('[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    };

    const deliveryDate   = get('delivery-date');
    const deliveryTime   = get('delivery-time');
    const deliveryLoc    = get('delivery-location');
    const returnDate     = get('return-date');
    const returnTime     = get('return-time');
    const returnLoc      = get('return-location');
    const carts4         = get('carts-4person') || '0';
    const carts6         = get('carts-6person') || '0';
    const hotel          = get('hotel-name');
    const firstName      = get('first-name');
    const lastName       = get('last-name');
    const email          = get('email');
    const phone          = get('phone');
    const addName        = get('additional-contact-name');
    const addPhone       = get('additional-contact-phone');
    const referral       = get('referral');
    const celebrating    = getRadio('celebrating');
    const celebType      = get('celebration-type');
    const decorations    = getRadio('decorations');
    const passengers     = get('num-passengers');
    const groupName      = get('group-name');
    const promoCode      = get('promo-code');
    const notes          = get('additional-notes');

    // Validate required fields
    if (!deliveryDate || !deliveryTime || !deliveryLoc || !returnDate || !firstName || !lastName || !email || !phone) {
      alert('Please fill in all required fields (marked with *) before submitting.');
      return;
    }

    // Build WhatsApp message
    const lines = [
      '🛺 *New Reservation Request — OJ Golf Cart Rentals*',
      '',
      '*📅 Rental Dates*',
      'Delivery: ' + deliveryDate + ' at ' + deliveryTime,
      'Location: ' + deliveryLoc,
      'Return: ' + returnDate + ' at ' + returnTime,
      returnLoc ? 'Return Location: ' + returnLoc : '',
      hotel ? 'Hotel/Airbnb: ' + hotel : '',
      '',
      '*🛺 Cart Selection*',
      '4-Person Carts: ' + carts4,
      '6-Person Carts: ' + carts6,
      passengers ? 'Passengers: ' + passengers : '',
      '',
      '*👤 Contact Info*',
      'Name: ' + firstName + ' ' + lastName,
      'Email: ' + email,
      'Phone: ' + phone,
      addName  ? 'Additional Contact: ' + addName  : '',
      addPhone ? 'Additional Phone: '   + addPhone : '',
      referral ? 'Heard about us: ' + referral : '',
      '',
      '*🎉 Special Requests*',
      'Celebrating: ' + (celebrating === 'yes' ? (celebType || 'Yes') : 'No'),
      'Decorations (+$40): ' + (decorations === 'yes' ? 'YES' : 'No'),
      groupName ? 'Group Name: ' + groupName : '',
      promoCode ? 'Promo Code: ' + promoCode : '',
      notes     ? 'Notes: ' + notes : '',
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(lines);
    const waUrl = 'https://wa.me/5016380895?text=' + encoded;

    // Show success state
    form.innerHTML = `
      <div style="text-align:center;padding:var(--space-12) var(--space-6);">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style="margin:0 auto var(--space-6);display:block;" aria-hidden="true">
          <circle cx="32" cy="32" r="32" fill="#0A7E8C" opacity="0.12"/>
          <path d="M20 33l9 9 15-17" stroke="#0A7E8C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2 style="font-family:'Clash Display',sans-serif;font-size:var(--text-2xl);margin-bottom:var(--space-3);color:var(--color-text-primary);">You're almost booked!</h2>
        <p style="color:var(--color-text-secondary);margin-bottom:var(--space-6);max-width:400px;margin-left:auto;margin-right:auto;">
          Tap the button below to send your reservation details directly to Omar &amp; Jen via WhatsApp. They'll confirm your booking and send deposit instructions within business hours (9am–9pm).
        </p>
        <a href="${waUrl}" target="_blank" rel="noopener"
           style="display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#fff;font-weight:700;font-size:var(--text-lg);padding:16px 32px;border-radius:999px;text-decoration:none;box-shadow:0 4px 20px rgba(37,211,102,0.35);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Send via WhatsApp
        </a>
        <p style="margin-top:var(--space-4);font-size:var(--text-sm);color:var(--color-text-tertiary);">
          Or email us directly at <a href="mailto:reservations@ojgolfcarts.com" style="color:var(--color-primary);">reservations@ojgolfcarts.com</a>
        </p>
      </div>`;

    // Open WhatsApp automatically on mobile
    window.open(waUrl, '_blank');
  });
})();

/* ============================================================
   DELIVERY LOCATION — SHOW HOTEL NAME FIELD
   ============================================================ */
(function () {
  const deliverySelect = document.getElementById('delivery-location');
  const hotelField = document.getElementById('hotel-name-field');
  if (!deliverySelect || !hotelField) return;
  deliverySelect.addEventListener('change', function () {
    hotelField.style.display = this.value === 'My Hotel or Airbnb' ? 'flex' : 'none';
  });
})();
