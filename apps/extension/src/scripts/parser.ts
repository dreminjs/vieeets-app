interface Window {
  __MEET_PARSER_RUNNING?: boolean;
  __MEET_PARSER_STOP?: () => void;
}

(() => {
  if (window.__MEET_PARSER_RUNNING) return;
  window.__MEET_PARSER_RUNNING = true;

  const captureButton = document.querySelector(
    'button[jsname="r8qRAd"]'
  ) as HTMLButtonElement;

  captureButton.click();

  const subtitles: { text: string; author: string }[] = [];

  function parseSubtitles() {
    const region = document.querySelectorAll('div[role="region"]>div');
    if (!region) return;

    region.forEach((el) => {
      const text = el.firstChild?.textContent?.trim() || '';
      const author = el.lastChild?.textContent?.trim() || '';
      subtitles.push({ text, author });
    });
  }

  const observer = new MutationObserver(parseSubtitles);
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('%cGoogle Meet subtitle parser started ✅', 'color: green;');

  function stopParser() {
    if (!window.__MEET_PARSER_RUNNING) return;
    window.__MEET_PARSER_RUNNING = false;

    observer.disconnect();
    console.log('%cGoogle Meet subtitle parser stopped ❌', 'color: red;');
  }

  window.__MEET_PARSER_STOP = stopParser;

  chrome.runtime?.onMessage?.addListener((msg, sender, sendResponse) => {
    if (msg?.action === 'stopParser') {
      stopParser();
      sendResponse({ stopped: true });
      captureButton.click();
    }
  });
})();
