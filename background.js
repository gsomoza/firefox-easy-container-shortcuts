var contexts;

function onError(e) {
  console.error(e);
}

function debug(message) {
  console.debug("[Easy Container Shortcuts] " + message);
}

function onContextsQueried(newContexts) {
  contexts = newContexts;
}

function onContainerCommand(command) {
  const matches = command.match(/^ecs-new-tab-container-(\d)$/);
  if (matches.length == 2) {
    openContainerTab(parseInt(matches[1]) - 1);
  }
}

function reloadContexts() {
  return browser.contextualIdentities.query({}).then(onContextsQueried, onError);
}

function openContainerTab(contextNumber) {
  if (contextNumber > contexts.length) {
    return; // no container defined for this shortcut, do nothing
  }

  return browser.tabs.create({
    cookieStoreId: contexts[contextNumber].cookieStoreId
  })
}

// [CONTEXTS] make sure our context information is always up-to-date
browser.contextualIdentities.onCreated.addListener(reloadContexts);
browser.contextualIdentities.onUpdated.addListener(reloadContexts);

// [COMMANDS] register commands
browser.commands.onCommand.addListener(onContainerCommand);

// INIT
reloadContexts();
