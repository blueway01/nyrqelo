const state = { lang: 'en', view: 'dark' };

const storeUrls = {
  ja: 'https://chromewebstore.google.com/detail/inamkdcoefaflmniegmelinbdoelckhn?authuser=0&hl=ja',
  en: 'https://chromewebstore.google.com/detail/inamkdcoefaflmniegmelinbdoelckhn?authuser=0&hl=en'
};

const privacyUrls = {
  ja: 'https://blueway01.github.io/nyrqelo/#privacy',
  en: 'https://blueway01.github.io/nyrqelo/index-en.html#privacy'
};

function refreshPreview() {
  const image = document.querySelector('[data-app-image]');
  image.src = `assets/screenshot-${state.lang}-${state.view}.png`;
  image.alt = state.lang === 'ja'
    ? `NYRQELO日本語版の${state.view === 'light' ? 'ライト' : 'ダーク'}画面`
    : `NYRQELO ${state.view} view in English`;
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-ja][data-en]').forEach((element) => {
    element.textContent = element.dataset[lang];
  });
  document.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('[data-store-link]').href = storeUrls[lang];
  document.querySelector('[data-privacy-link]').href = privacyUrls[lang];
  document.title = lang === 'ja'
    ? 'NYRQELO for Bluesky｜好きな投稿を、そっと保存。'
    : 'NYRQELO for Bluesky | Save posts. Find them later.';
  refreshPreview();
}

function setView(view) {
  state.view = view;
  document.documentElement.dataset.theme = view;
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  refreshPreview();
}

document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));

document.querySelector('[data-contact-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-contact-status]');
  const lang = state.lang;
  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    _subject: 'NYRQELOお問合せ',
    _template: 'table',
    _honey: String(formData.get('_honey') || '')
  };

  button.disabled = true;
  status.className = 'contact-status';
  status.textContent = lang === 'ja' ? '送信しています…' : 'Sending…';

  fetch('https://formsubmit.co/ajax/ikoibito@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (!response.ok) throw new Error('送信要求が失敗しました');
      return response.json();
    })
    .then(() => {
      form.reset();
      status.classList.add('success');
      status.textContent = lang === 'ja'
        ? 'お問い合わせを受け付けました。'
        : 'Your inquiry has been submitted.';
    })
    .catch(() => {
      status.classList.add('error');
      status.textContent = lang === 'ja'
        ? '送信できませんでした。時間をおいて再度お試しください。'
        : 'The inquiry could not be sent. Please try again later.';
    })
    .finally(() => {
      button.disabled = false;
    });
});

setLanguage('en');
setView('dark');
