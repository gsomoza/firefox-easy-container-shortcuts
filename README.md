# Easy Container shortcuts
Firefox 57+ extension that provides nine easy keyboard shortcuts to open new tabs on different containers.

## Usage

#### New Tab on Current Container
Use `Ctrl (Cmd on Mac) + Alt + T` to open a new tab in the current window, using the current container.

#### New Tab on Specified Container
By default the extension registers the following shortcuts: `Ctrl + Shift + #`, where `#` stands for numbers between 1 and 9. To open a new tab without a container simply use the default Firefox shortcut for that (`Ctrl + T`).

Note for Mac/OS X users: use `⌥ + ⇧ + #`.

#### Current Tab on Specified Container
Use `Ctrl (Cmd on Mac) + Alt + #` to reopen the current tab in the specified container, where `#` stands for numbers between 1 and 9. This closes the current tab and replaces its position with a new tab at the same URL in the specified container.

When one of those shortcuts is pressed, a new tab will be opened using the container whose number is represented by the shortcut, following the order displayed in Firefox's "containers" menu E.g. `Ctrl + Shift + 1` will open the first container in that list.

For this to work, the `privacy.userContext.enabled` preference (the "Enable Container Tabs" checkbox in the Firefox Preferences UI) must be ENABLED in Firefox. If that preference is DISABLED then the extension will only log an error.

#### Reopen Current Tab in Default Container
To re-open the current tab on the default container use `Ctrl (Cmd on Mac) + Alt + #`. Special thanks to [@zanona](https://github.com/zanona).

#### New Window on Current Container
Use `Alt (Ctrl on Mac) + Shift + T` to open a new window using the current container.

#### New Window on Specified Container
By default the extension registers the following shortcuts: `Alt (Ctrl on Mac) + Shift + #`, where `#` stands for numbers between 1 and 9. To open a new window without a container simply use the default Firefox shortcut for that (`Ctrl + N`).

## Custom Shortcuts
You can map any of the commands in this extension into other key combinations supported by Firefox - watch [this screencast](https://bug1303384.bmoattachments.org/attachment.cgi?id=9051647) to see how.

## License
© 2017-2020, Gabriel Somoza – License: 3-Clause BSD
