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

  const matches = command.match(/^ecs-new-tab-container-(\d)$/);
  if (matches.length == 2) {
    openContainerTab(parseInt(matches[1]) - 1);
    return;
  }
}

function getContexts() {
  return browser.contextualIdentities.query({});
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

  return browser.tabs.create({
    cookieStoreId: contexts[contextNumber].cookieStoreId
  })
}

// [COMMANDS] register commands
browser.commands.onCommand.addListener(onContainerCommand);
