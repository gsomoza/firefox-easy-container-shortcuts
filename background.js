function onError(e) {
  console.error(e);
}

function debug(message) {
  console.debug(["[Easy Container Shortcuts] ", message]);
}

function onContainerCommand(command) {
  if (command == 'ecs-new-tab-current-container') {
    openTabInCurrentContainer();
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
  browser.tabs.query({currentWindow:true, active:true}).then(function(results) {
    if (!results || results.length < 1) {
      return; // do nothing
    }
    let currentTab = results[0];
    browser.tabs.create({cookieStoreId: currentTab.cookieStoreId});
  });
}

async function openContainerTab(contextNumber) {
  let context = await getContextFor(contextNumber);
  if (!context) {
    return;
  }

  return browser.tabs.create({
    cookieStoreId: context.cookieStoreId
  });
}

async function openTabInContainer(contextNumber) {
    let context = contextNumber !== -1 ? await getContextFor(contextNumber) : {};

  if (!context) {
    return;
  }

  browser.tabs.query({currentWindow:true, active:true, status:'complete'}).then(function(results) {
    if (!results || results.length < 1) {
      return; // do nothing
    }

    let currentTab = results[0];

    if (currentTab.url.startsWith('about')) {
      return;
    }

    browser.tabs.create({
      cookieStoreId: context.cookieStoreId,
      index: currentTab.index + 1,
      url: currentTab.url
    });
    browser.tabs.remove(currentTab.id);
  });
}

// [COMMANDS] register commands
browser.commands.onCommand.addListener(onContainerCommand);
