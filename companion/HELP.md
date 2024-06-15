# Songbeamer OSC

After configuring host and port this module will open it's own OSC instance in order to communicate with SongBeamer.

This module does define actions with names and options that map most of the implemented OSC functionalities. Therefore it eases up the use of OSC as a remote control by mapping specific actions with the respective paths / options.

## Songbeamer Requirements

Please be aware that OSC is a functionality that is not enabled in Songbeamer by default. Check the forum for details!

To check whether OSC is active open Songbeamer Menu - Help - OSC logger (tested with version 6.0.0g)
If it shows "disabled" you need to enable it by running a Songbeamer macro.
Open the macro window (ALT + F8) and execute
`IniSFS.OSC.Enabled := True;`

## Use of variables and feedbacks

All variables are only updated upon changes in Songbeamer or in case any feedback is using them.
This means that the use of variables as simple "display" values might show incorrect initial states.

In case some value has issues a warning referencing the respective github issue will be logged.
More details can be found on the issues page https://github.com/bitfocus/companion-module-songbeamer-osc/issues

Please be aware that quite a lot of functionality is not yet fully implemented in Songbeamer.
This module is NOT provided by the Songbeamer developers but rather a user!

# Technical things ...
* Upcoming devolpment milestones are tracked in https://github.com/bitfocus/companion-module-songbeamer-osc/milestones
* Original Songbeamer OSC documentation is in documents/SongBeamer.docx
* Modified Songbeamer OSC documentation with status comments and references to existing bug tickets is in documents/SongBeamer_OSC.docx

## Use of development branch
In order to run this module or any updates before official releases
Please be aware this is for testing ONLY!
The module itself or Songbeamer might crash any moment!

1. Install companion
2. Download the desired branch from github
3. create a folder to store all development modules
4. unpack the ZIP archive into the folder
5. open a Shell and run 'yarn install' inside the modules folder
5. start companion, and set the developer modules path to the folder created before

## Things that can go wrong 
### Node version
* Make sure you're running node ^18.12 - e.g. by running 'nvm install 18' and using the respective 'nvm use ....' this means node 19 or newer does not work with companion!
* make sure yarn is available e.g. by running 'corepack enable' in a shell

### Windows Execetuion policies
4. in case you're trying yarn commands on Windows 11 'Set-ExecutionPolicy Restricted' needs to be allowed from an admin powershell first '


## Changelog

### Version 2.0.0

- Companion 3.0 compatibility

## Functional Scope

### Actions

presentation_state

- /presentation/state

presentation_page

- /presentation/page

presentation_versemarker

- /presentation/pagecaption

presentation_language_primary

- /presentation/primary_language

presentation_language

- /presentation/language

presentation_message_visible

- /presentation/message/visible

presentation_message_text

- /presentation/message/text

navigate_to

- /presentation/nextpage
- /presentation/prevpage
- /playlist/next
- /playlist/previous

video_state

- /video/state

video_position

- /video/position

livevideo_state

- /livevideo/state

### Feedbacks

presentation_state

- /presentation/state
