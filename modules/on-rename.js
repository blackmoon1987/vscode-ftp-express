var path = require("path");
var upath = require("upath");
var output = require("./output");
var isIgnored = require("./is-ignored");
var vscode = require("vscode");

module.exports = function(oldUri, newUri, getSyncHelper) {
    if(!oldUri || !newUri) {
        output(getCurrentTime() + " > [ftp-sync] Error: Invalid rename parameters");
        return;
    }
    
    var oldPath = oldUri.fsPath;
    var newPath = newUri.fsPath;
    var syncHelper = getSyncHelper();
    var config = syncHelper.getConfig();
    
    if(!config.uploadOnSave) {
        output(getCurrentTime() + " > [ftp-sync] Skipping rename: uploadOnSave is disabled");
        return;
    }
    
    // Check if file is ignored
    if(isIgnored(oldPath, config.allow, config.ignore)) {
        output(getCurrentTime() + " > [ftp-sync] Skipping rename: old path is ignored");
        return;
    }
    if(isIgnored(newPath, config.allow, config.ignore)) {
        output(getCurrentTime() + " > [ftp-sync] Skipping rename: new path is ignored");
        return;
    }
    
    // Get relative paths
    var workspaceRoot = path.resolve(config.localPath);
    var oldRelativePath = path.relative(workspaceRoot, oldPath);
    var newRelativePath = path.relative(workspaceRoot, newPath);
    
    // Convert to remote paths
    var oldRemotePath = upath.join(config.remotePath, oldRelativePath);
    var newRemotePath = upath.join(config.remotePath, newRelativePath);
    
    var status = vscode.window.setStatusBarMessage(
        "FTP Sync: Renaming " + path.basename(oldPath) + " to " + path.basename(newPath)
    );
    
    output(getCurrentTime() + " > [ftp-sync] Renaming " + oldRemotePath + " to " + newRemotePath);
    
    // Ensure parent directory exists for new path
    syncHelper.ensureDirExists(path.dirname(newRemotePath), function(err) {
        if(err) {
            status.dispose();
            output(getCurrentTime() + " > [ftp-sync] Error creating parent directory: " + err);
            vscode.window.showErrorMessage("FTP Sync: Failed to create directory for renamed file");
            return;
        }
        
        // Perform rename on remote server
        syncHelper.renameFile(oldRemotePath, newRemotePath, function(err) {
            status.dispose();
            
            if(err) {
                output(getCurrentTime() + " > [ftp-sync] Error renaming file: " + err);
                vscode.window.showErrorMessage(
                    "FTP Sync: Failed to rename " + path.basename(oldPath)
                );
                return;
            }
            
            output(getCurrentTime() + " > [ftp-sync] Successfully renamed file on remote");
            vscode.window.setStatusBarMessage(
                "FTP Sync: Successfully renamed " + path.basename(oldPath),
                3000
            );
        });
    });
}

function getCurrentTime() {
    var currentdate = new Date();
    return currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
}
