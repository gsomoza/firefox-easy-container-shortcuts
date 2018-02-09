function onError(e) {
  console.error(e);
}

function debug(message) {
  console.debug("[Easy Container Shortcuts] " + message);
}

function onContainerCommand(command) {
  const matches = command.match(/^ecs-new-tab-container-(\d)$/);
  if (matches.length == 2) {
    openContainerTab(parseInt(matches[1]) - 1);
  }
}

function getContexts() {
  return browser.contextualIdentities.query({});
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
