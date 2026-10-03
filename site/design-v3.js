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
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('[data-contact-status]');
  const lang = state.lang;
  const autoresponse = form.querySelector('[data-autoresponse]');

  autoresponse.value = lang === 'ja'
    ? 'お問い合わせを送信いただき、ありがとうございます。NYRQELO for Blueskyへのお問い合わせを受け付けました。内容を確認のうえ、改めて返信いたします。'
    : 'Thank you for contacting NYRQELO for Bluesky. Your inquiry has been received. We will review your message and reply to you separately.';

  button.disabled = true;
  status.className = 'contact-status';
  status.textContent = lang === 'ja' ? '送信しています…' : 'Sending…';
});

setLanguage('en');
setView('dark');

if (new URLSearchParams(window.location.search).get('sent') === '1') {
  const status = document.querySelector('[data-contact-status]');
  status.classList.add('success');
  status.textContent = state.lang === 'ja'
    ? 'お問い合わせを送信しました。受付確認メールをご確認ください。'
    : 'Your inquiry has been sent. Please check your email for confirmation.';
}
