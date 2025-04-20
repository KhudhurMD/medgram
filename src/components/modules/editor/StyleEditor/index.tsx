import Editor from '@monaco-editor/react'
import monaco from 'monaco-editor'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../store/storeHooks'
// @ts-ignore
import { toCSS, toJSON } from 'cssjson'

function StyleEditor() {
  const dispatch = useAppDispatch()
  const [text, setText] = useState('')

  function handleEditorChange(value: any, _event: any) {
    setText(value)
  }

  useEffect(() => {
    const injectedStyles = document.createElement('style')
    document.head.appendChild(injectedStyles)
    injectedStyles.innerHTML = sanitizeCSS(text) || ''
  }, [text])

  return <Editor height='100vh' language='css' value={initialText} options={monacoOptions} className='w-full' onChange={handleEditorChange} />
}

const initialText = `
/* This is a CSS editor. You can target any class by first writing a dot, then the class name inside parenthesis. For example, to target the class "custom", you would write "(.custom)" inside the editor above and then ".custom" in this editor. */

.custom {
  color: pink
}
`

interface CSSJSON {
  attributes: {}
  children: CSSJSON
}

function sanitizeCSS(css: string): string {
  const cssJSON = toJSON(css)
  // Object.entries(cssJSON.children).forEach(([attr, _style]) => {
  //   attr = '.layoutflow ' + attr
  // })
  const sanitizedCSS = toCSS(cssJSON)
  return sanitizedCSS
}

const monacoOptions: monaco.editor.IEditorOptions = {
  minimap: {
    enabled: false,
  },
  fontSize: 14,
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
  },
  codeLens: false,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  overviewRulerLanes: 1,
  renderLineHighlight: 'all',
  renderValidationDecorations: 'off',
}

export default StyleEditor
