import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_LOW, KEY_MODIFIER_COMMAND, KEY_TAB_COMMAND } from 'lexical'
import posthog from 'posthog-js'
import { useEffect } from 'react'
import { ampli } from '../../../../../../ampli'

export function TrackEventsPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    editor.registerCommand(
      KEY_TAB_COMMAND,
      (payload) => {
        // If shift is pressed, then we want to unindent
        if (payload.shiftKey) {
          // ampli.pressedShiftTab()
          posthog.capture('pressed shift tab')
        } else {
          // ampli.pressedTab()
          posthog.capture('pressed tab')
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])
  return null
}
