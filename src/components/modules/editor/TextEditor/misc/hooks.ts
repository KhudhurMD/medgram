import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export function useDebouncedLexicalEditorState(
  callback: (editorStateString: string) => void,
  delay: number,
  maxWait?: number
) {
  const [editor] = useLexicalComposerContext()
  const [editorStateString, setEditorStateString] = useState('')
  const debouncedEditorStateString = maxWait
    ? useDebounce(editorStateString, delay)[0]
    : useDebounce(editorStateString, delay, {
        maxWait: maxWait,
        leading: true,
      })[0]
  editor.registerUpdateListener(() => {
    const newEditorStateString = JSON.stringify(
      editor.getEditorState().toJSON()
    )
    setEditorStateString(newEditorStateString)
  })
  useEffect(() => {
    callback(debouncedEditorStateString)
  }, [debouncedEditorStateString])
}

export function useThrottledLexicalEditorState(
  callback: (editorStateString: string) => void,
  delay: number
) {
  return useDebouncedLexicalEditorState(callback, delay, delay)
}
