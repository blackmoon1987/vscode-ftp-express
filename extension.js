// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require("vscode");

global.STATUS_TIMEOUT = 3000;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  var syncHelper, currentConfig;
  var ftpConfig = require("./modules/ftp-config");
  var getSyncHelper = function() {
    var oldConfig = currentConfig;
    currentConfig = ftpConfig.getSyncConfig();

    if (!syncHelper) syncHelper = require("./modules/sync-helper")();
    else if (ftpConfig.connectionChanged(oldConfig)) syncHelper.disconnect();

    syncHelper.useConfig(currentConfig);

    return syncHelper;
  };

  var initCommand = vscode.commands.registerCommand(
    "extension.ftpexpressinit",
    require("./modules/init-command")
  );
  var syncCommand = vscode.commands.registerCommand(
    "extension.ftpexpressupload",
    function() {
      require("./modules/sync-command")(true, getSyncHelper);
    }
  );
  var downloadCommand = vscode.commands.registerCommand(
    "extension.ftpexpressdownload",
    function() {
      require("./modules/sync-command")(false, getSyncHelper);
    }
  );
  var commitCommand = vscode.commands.registerCommand(
    "extension.ftpexpresscommit",
    function() {
      require("./modules/commit-command")(getSyncHelper);
    }
  );
  var singleCommand = vscode.commands.registerTextEditorCommand(
    "extension.ftpexpresssingle",
    function(editor) {
      require("./modules/sync-single-command")(editor, getSyncHelper);
    }
  );
  var uploadcurrentCommand = vscode.commands.registerCommand(
    "extension.ftpexpressuploadselected",
    function(fileUrl) {
      require("./modules/uploadcurrent-command")(fileUrl, getSyncHelper);
    }
  );
  var downloadcurrentCommand = vscode.commands.registerCommand(
    "extension.ftpexpressdownloadselected",
    function(fileUrl) {
      require("./modules/downloadcurrent-command")(fileUrl, getSyncHelper);
    }
  );
  var listcurrentCommand = vscode.commands.registerCommand(
    "extension.ftpexpresslistselected",
    function(fileUrl) {
      require("./modules/list-command")(fileUrl, getSyncHelper);
    }
  );
  var onSave = require("./modules/on-save");
  var onGenerate = require("./modules/on-generate");
  var onRename = require("./modules/on-rename");

  var currentConfig = getSyncHelper().getConfig();
  
  // Create file system watchers
  var mainWatcher = vscode.workspace.createFileSystemWatcher("**/*");
  var generatedWatcher;
  
  mainWatcher.onDidRename(function(e) {
    onRename(e.oldUri, e.newUri, getSyncHelper);
  });

  if (currentConfig.generatedFiles.extensionsToInclude.length > 0) {
    generatedWatcher = vscode.workspace.createFileSystemWatcher(
      currentConfig.getGeneratedDir() + "/**"
    );
    generatedWatcher.onDidChange(function(ev) {
      //an attempt to normalize onDidChange with onDidSaveTextDocument.
      ev["uri"] = { fsPath: ev.fsPath };
      onGenerate(ev, getSyncHelper);
    });
    generatedWatcher.onDidCreate(function(ev) {
      ev["uri"] = { fsPath: ev.fsPath };
      onGenerate(ev, getSyncHelper);
    });
    generatedWatcher.onDidDelete(function(ev) {
      ev["uri"] = { fsPath: ev.fsPath };
      onGenerate(ev, getSyncHelper);
    });
  }

  vscode.workspace.onDidSaveTextDocument(function(file) {
    onSave(file, getSyncHelper);
  });

  context.subscriptions.push(initCommand);
  context.subscriptions.push(syncCommand);
  context.subscriptions.push(downloadCommand);
  context.subscriptions.push(commitCommand);
  context.subscriptions.push(singleCommand);
  context.subscriptions.push(uploadcurrentCommand);
  context.subscriptions.push(downloadcurrentCommand);
  context.subscriptions.push(listcurrentCommand);
}

exports.activate = activate;

function deactivate() {
  mainWatcher.dispose();
  if (generatedWatcher) generatedWatcher.dispose();
}
exports.deactivate = deactivate;
