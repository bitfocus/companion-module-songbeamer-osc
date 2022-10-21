## Songbeamer OSC based on OSC Generic

In instaces tab specify the ip and port you want to send. In button actions tab specify the OSC path and value.

**Available commands for OSC Songbeamer**

- Send message without arguments
- Send integer
- Send float
- Send string
- Send message with multiple arguments

**Implemented commands from Songbeamer OSC**
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

**ToDo List for implementatio of commands from Songbeamer OSC**

- Merge conditional presentation_message_text and presentation_message_visible into single action
- Merge presentation_versemarker into navigate_to with conditional option
- OSC Feedback - see https://bitfocusio.slack.com/archives/CFG7HAN5N/p1666280195183589
- Merge presentation_language and presentation_language but sending 2 separate commands
