function onError(e) {
  console.error(e);
}

function debug(message) {
  console.debug(["[Easy Container Shortcuts] ", message]);
}

function onContainerCommand(command) {
  if (command == "ecs-new-tab-current-container") {
    openTabInCurrentContainer();
    return;
  }

  if (command === "ecs-new-window-current-container") {
    openWindowInCurrentContainer();
    return;
  }

  const newTabMatches = command.match(/^ecs-new-tab-container-(\d)$/);
  if (newTabMatches && newTabMatches.length == 2) {
    openContainerTab(parseInt(newTabMatches[1]) - 1);
    return;
  }

  const currentTabMatches = command.match(/^ecs-current-tab-container-(\d)$/);
  if (currentTabMatches && currentTabMatches.length == 2) {
    openTabInContainer(parseInt(currentTabMatches[1]) - 1);
    return;
  }

  const newWindowMatches = command.match(/^ecs-new-window-container-(\d)$/);
  if (newWindowMatches && newWindowMatches.length === 2) {
    openContainerWindow(parseInt(newWindowMatches[1]) - 1);
    return;
  }
}

function getContexts() {
  return browser.contextualIdentities.query({});
}

async function getContextFor(contextNumber) {
  let contexts;
  try {
    contexts = await getContexts();
  } catch (e) {
    console.error(e);
    return;
  }

  if (contextNumber > contexts.length - 1) {
    return; // no container defined for this shortcut, do nothing
  }

  return contexts[contextNumber];
}

async function openTabInCurrentContainer() {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(function (results) {
      if (!results || results.length < 1) {
        return; // do nothing
      }
      let currentTab = results[0];
      browser.tabs.create({ cookieStoreId: currentTab.cookieStoreId });
    });
}

async function openWindowInCurrentContainer() {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then(function (results) {
      if (!results || results.length < 1) {
        return;
      }
      let currentTab = results[0];
      browser.windows.create({ cookieStoreId: currentTab.cookieStoreId });
    });
}

async function openContainerTab(contextNumber) {
  let context = await getContextFor(contextNumber);
  if (!context) {
    return;
  }

  return browser.tabs.create({
    cookieStoreId: context.cookieStoreId,
  });
}

async function openContainerWindow(contextNumber) {
  let context = await getContextFor(contextNumber);
  if (!context) {
    return;
  }

  return browser.windows.create({
    cookieStoreId: context.cookieStoreId,
  });
}

async function openTabInContainer(contextNumber) {
  let context = contextNumber !== -1 ? await getContextFor(contextNumber) : {};

  if (!context) {
    return;
  }

  browser.tabs
    .query({ currentWindow: true, active: true, status: "complete" })
    .then(async function (results) {
      if (!results || results.length < 1) {
        return; // do nothing
      }

      let currentTab = results[0];

      if (currentTab.url.startsWith("about")) {
        return;
      }

      let newTab = await browser.tabs.create({
        cookieStoreId: context.cookieStoreId,
        index: currentTab.index + 1,
        url: currentTab.url,
        pinned: currentTab.pinned,
      });

      // Open the new tab immediately, without waiting for the current tab to finish loading
      browser.webNavigation.onBeforeNavigate.addListener(
        function onBeforeNavigate(details) {
          if (details.tabId === newTab.id) {
            browser.webNavigation.onBeforeNavigate.removeListener(
              onBeforeNavigate
            );
            browser.tabs.remove(currentTab.id);
          }
        }
      );
    });
}

// [COMMANDS] register commands
browser.commands.onCommand.addListener(onContainerCommand);
