import { useState } from 'react';

export const App = () => {
  const [isParsing, setIsParsing] = useState(false);

  const handleToggleParsingStatus = () => setIsParsing((prev) => !prev);

  const injectScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      if (tab.url?.includes('https://meet.google.com')) {
        handleToggleParsingStatus();

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['parser.js'],
        });
      } else {
        console.log('❌ Этот скрипт работает только на Google Meet!');
      }
    });
  };

  const stopScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      chrome.tabs.sendMessage(tab.id, { action: 'stopParser' }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn(
            'Не удалось отправить сообщение:',
            chrome.runtime.lastError.message
          );
        } else {
          handleToggleParsingStatus();
          console.log('Parser stopped:', response);
        }
      });
    });
  };

  return (
    <div className="text-center p-5">
      {!isParsing ? (
        <button
          onClick={injectScript}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start parsing
        </button>
      ) : (
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded-lg"
          onClick={stopScript}
        >
          Stop parsing
        </button>
      )}
    </div>
  );
};
