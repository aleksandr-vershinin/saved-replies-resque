const ALLOWED_HOSTS = ["secure.helpscout.net", "helpscout.net"];

function isHelpScoutUrl(urlString) {
  if (!urlString) return false;

  try {
    const url = new URL(urlString);

    return HELPSCOUT_HOSTS.some((host) => {
      return url.hostname === host || url.hostname.endsWith(`.${host}`);
    });
  } catch {
    return false;
  }
}

async function updateSidePanelForTab(tabId, url) {
  const enabled = isHelpScoutUrl(url);

  await chrome.sidePanel.setOptions({
    tabId,
    path: "sidepanel.html",
    enabled,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) return;

  updateSidePanelForTab(tabId, tab.url);
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId);

  if (!tab.url) return;

  updateSidePanelForTab(tabId, tab.url);
});
