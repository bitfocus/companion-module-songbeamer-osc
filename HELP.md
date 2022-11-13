## Songbeamer OSC based on OSC Generic

In instances tab specify the ip and port you want to send. In button actions tab specify the action and applicable value.

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

**Implemented feedbacks from Songbeamer OSC**
presentation_state
- /presentation/state

**ToDo List for implementatio of commands from Songbeamer OSC**

- Initial Feedback and Variable Execution e.g. presentation_state
- Merge conditional presentation_message_text and presentation_message_visible into single action
- Merge presentation_versemarker into navigate_to with conditional option
- OSC Feedback - see https://bitfocusio.slack.com/archives/CFG7HAN5N/p1666280195183589
  - consider which variables should have feedback
- Merge presentation_language and presentation_language but sending 2 separate commands
- discuss missing OSC feedback in Songbeamer dev
