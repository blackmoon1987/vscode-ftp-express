# VSCode FTP Express

Fast and reliable FTP/SFTP synchronization extension for Visual Studio Code with advanced features including bulk operations support.

![Demo of extension](https://i.imgur.com/W9h4pwW.gif)

## Features

* Smart FTP/SFTP synchronization with remote directory
* Multiple protocols support (ftp, sftp, scp)
* Multiple host configurations
* Bulk operations optimization
  * Smart batching for multiple file operations
  * Single connection for bulk changes
  * Configurable batch size and timeout
  * Progress tracking for bulk operations
* File rename synchronization
* Automatic upload on save
* Detailed progress indication
* Error handling and retry mechanism

## Usage

There are several commands available in the Command Palette (Ctrl+Shift+P on Windows/Linux):

* `FTP Express: Init` - create default configuration file
* `FTP Express: Upload` - upload all changes to remote
* `FTP Express: Download` - download all changes from remote
* `FTP Express: Sync File` - sync current file with remote
* `FTP Express: Upload Selected` - upload selected file/directory to remote
* `FTP Express: Download Selected` - download selected file/directory from remote
* `FTP Express: List Selected` - list remote directory content
* `FTP Express: Cancel` - cancel current operation

### FTP Express: Init

Initializes a default FTP Express configuration file in the `.vscode` directory. Options can be customised as follows:

- remotePath - This can be set to the path on the remote that you would like to upload to. The default is `./` i.e. the root.
- host - The hostname of the FTP server you want to connect to.
- username - The username of the FTP account you want to use.
- password - The password of the FTP account you want to use.
- port - The port on the FTP server you would like to connect to. The default is `"21"`.
- protocol - The FTP protocol to be used. The default is `"ftp"` but you can also specify `"sftp"`.
- uploadOnSave - Whether files should automatically be uploaded on save. The default is `false`.
- passive - Specifies whether to use FTP passive mode. The default is `false`.
- debug - Specifies whether to display debug information in an ftp-sync Output window. The default is `false`.
- privateKeyPath - Specifies the path to the private key for SFTP. The default is `null`.
- passphrase - Specifies the passphrase to use with the private key for SFTP. The default is `null`.
- agent - Specifies the ssh-agent to use for SFTP. The default is `null`.
- allow - An array of escaped regular expression strings specifying paths which are allowed. If nonempty, unless a path matches any of these regular expressions it will not be included in the sync. Default value is empty, implying everything is allowed.
- ignore - An array of escaped regular expression strings specifying paths to ignore. If a path matches any of these regular expressions then it will not be included in the sync. Default values are `"\\.git"`, `"\\.vscode"` and `".DS_Store"`.
- generatedFiles: - Automatically upload freshly generated files. Also uploads files that are deleted. extensionsToInclude has to be set for this feature to work.
  - extensionsToInclude: [] e.g. [".js", ".css"] - Array of strings specifying what extensions to add for auto-upload. An empty array here means that generatedFiles feature is disabled. Setting it to [""] will cause it to upload files of all extensions.
  - path: "" - This specifies the path to the directory where the files are, [e.g.] "/build", default is "" which is the root workspace directory
- bulk:
  - batchSize: 10 - Number of files to process in each batch
  - batchTimeout: 1000 - Milliseconds to wait before processing batch
  - maxRetries: 3 - Maximum retries for failed operations
  - showProgress: true - Show progress notification

### FTP Express: Upload

Displays a synchronization wizard to configure a sync operation that changes FTP files and folders to match project files.

### FTP Express: Download

Displays a synchronization wizard to configure a sync operation that changes project files and folders to match FTP files.

### FTP Express: Sync File

Sync current file with remote.

### FTP Express: Upload Selected

Upload selected file/directory to remote.

### FTP Express: Download Selected

Download selected file/directory from remote.

### FTP Express: List Selected

List remote directory content.

### FTP Express: Cancel

Cancel current operation.

---

## To be added soon:

- Config validation (add minimal configuration requirement)
- Better connection error handling
- More real life testing
- Bug fixes
- Context menu to sync folders (up/down)

## Future plans

- Integration with git-ftp

### Found any bugs? Got any questions or ideas?

- Rise a ticket [here](https://github.com/lukasz-wronski/vscode-ftp-sync/issues)!
- Contact me at vscode[at]lukaszwronski.pl

Please provide as much information as possible. We are dealing with diffrent ftp servers, file structures, file permissions, operating systems and it might be difficult to reproduce your error and fix it without detailed informations.

I'm looking forward to get any feedback from extension users! Contribution, especially on bug fixing is more than welcome!

Great thanks for suggestions and help with debugging for [Martin](https://github.com/kasik96), [Allan](https://github.com/EthraZa), [Maxime](https://github.com/maximedupre), [suuuunto](https://github.com/suuuunto) and all other folks who reported bugs or made improvement requests.

---

Use at your own risk - I do not guarantee that it will work correctly!

---

## Version history

- 0.4.0
  - [ Config fix ]()
- 0.3.9
  - Added [ Fix for autogenerated files not uploading correctly ](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/270)
- 0.3.8
  - Added [ Updated generatedFiles. Both of its properties are required to be set from now on. uploadOnSave works on every file now ](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/269)
- 0.3.7
  - Added [ Fix for broken uploadOnSave and subdirectories not adding properly ](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/264)
- 0.3.5
  - Added [ Various enhancements (SCP Support, bug fixes, list command)](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/237)
  - Added [ List commands](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/215)
  - Added [ Fix for broken ignore and allow regex](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/210)
  - [ Introduced separate store to store syncOption](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/200)
  - Added [ Prompt for password if no password was given in config](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/199)
  - Added [ Fix for config secureOptions being ignored](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/195)
  - [ Implemented allow config](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/170)
  - Added [ Fix for incorrect path for ignore of remote sync](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/163)
  - Added [ Ability to download a single file using the context menu](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/152)
  - Added [ Rudimentary ssh-agent support](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/134)
- 0.3.3
  - Added [ Support for generated files](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/118)
- 0.3.2
  - Added [FTP over SSL support](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/62)
  - Added [Sync current file to Remote](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/77)
  - Fixed bug #86 (by PR #84)
  - [Improved readme and fixed debug mode](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/67)
  - [Compatibility for vscode 1.5+](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/87)
  - [Improve Error handling around parsing config file](https://github.com/lukasz-wronski/vscode-ftp-sync/pull/102)
- 0.3.1
  - Added [SFTP private key support](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/28)
- 0.3.0
  - Added [SFTP protocol support](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/26)
  - Improvement of sync performance in environments with many nested directories
  - Fix for problems with upload on save on unsynced directories
- 0.2.9
  - Fix for [Running the contributed command:'extension.ftpsyncinit' failed](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/3)
  - Fix for [After some tryes the Review file stopped to work](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/7)
  - Added debug output option to config file
  - Error message for incorrect JSON like in [this issue](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/25)
  - Closing review file after commit (pointed out in [this issue](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/23))
  - Fix for [uploadOnSave will fail for files on new created folders](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/22)
  - Added ES6 support in extension source
- 0.2.8
  - Attempt to fix [uploadOnSave will fail for files on new created folders](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/22)
- 0.2.7
  - Fix for [Sync R2L does not delete folder](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/21)
  - Replace of deprecated method `TextEditor.hide` with command call
- 0.2.6
  - Fix for [Error: EXDEV: cross-device link not permitted on mounted drive](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/6)
- 0.2.5
  - Fix for [Local to remote "Full sync" error](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/20)
- 0.2.4
  - Fix for [Duplicate folder in folder we upload to](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/19)
- 0.2.3
  - Fix for [Cant download](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/14)
- 0.2.2
  - Fix for [Upload on save don't track ignored files](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/15)
  - Added support for [ftp passive mode](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/16)
- 0.2.1 - Fix for [Save on second try](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/12)
- 0.2.0 - Rewritten sync mechanism - Changes based on [this conversation](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/2): - New sync wizard - Reviewing changes before save - Choose to remove orphans or not (safe sync) - Fix for [uncontrolled number of ftp connections](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/4)
- 0.1.4 - Fix for [No handler found for the command: 'extension.ftpsyncdownload'](https://github.com/lukasz-wronski/vscode-ftp-sync/issues/1)
- 0.1.2 - Basic progress indication in sync process - Better error handling in sync command - Github links in package.json
- 0.1.1 - All information messages moved to status bar - Removed "alertOnSync" parameter from config - Addedd progress indication in download process - Fixes in download process
- 0.1.0 - First version containing all basic features

## Support Development

If you find this extension helpful, consider supporting the developer:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/black.moon)

## Contact

For bug reports, feature requests, or general feedback:
- Email: blackmoon@mail.com
- Support Page: [https://buymeacoffee.com/black.moon](https://buymeacoffee.com/black.moon)
