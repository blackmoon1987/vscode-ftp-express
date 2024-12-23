var path = require("path");
var isIgnored = require("./is-ignored");

// Keep track of pending saves
var pendingSaves = [];
var saveTimeout = null;

module.exports = function(document, getSyncHelper) {
    if(!document) return;
    
    var syncHelper = getSyncHelper();
    var config = syncHelper.getConfig();
    
    if(!config.uploadOnSave) return;
    
    var filePath = document.uri.fsPath;
    if(isIgnored(filePath, config.allow, config.ignore)) return;
    
    // Add to pending saves
    pendingSaves.push({
        path: filePath,
        rootPath: path.dirname(filePath)
    });
    
    // Clear existing timeout
    if(saveTimeout) {
        clearTimeout(saveTimeout);
    }
    
    // Set new timeout to process saves
    saveTimeout = setTimeout(function() {
        if(pendingSaves.length > 0) {
            // If multiple files, use bulk upload
            if(pendingSaves.length > 1) {
                syncHelper.bulkUpload(pendingSaves.slice(), function(err) {
                    if(err) {
                        // Handle errors if needed
                        console.log('Bulk upload errors:', err);
                    }
                });
            } else {
                // Single file, use normal upload
                var file = pendingSaves[0];
                syncHelper.uploadFile(file.path, file.rootPath, function(err) {
                    if(err) {
                        console.log('Upload error:', err);
                    }
                });
            }
            
            // Clear pending saves
            pendingSaves = [];
        }
    }, 1000); // Wait 1 second to batch saves together
}
