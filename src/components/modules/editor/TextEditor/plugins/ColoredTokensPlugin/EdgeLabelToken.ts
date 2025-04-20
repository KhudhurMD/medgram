import { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, TextNode } from 'lexical'
import { EntityMatch } from '@lexical/text'
import { Token } from '.'

export class EdgeLabelToken extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key)
  }
  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config)
    dom.classList.add(Token.Edgelabel)
    return dom
  }

  static importJSON(json: SerializedEdgeLabelToken): EdgeLabelToken {
    return new EdgeLabelToken(json.text)
  }
  exportJSON(): SerializedEdgeLabelToken {
    return {
      ...super.exportJSON(),
      type: Token.Edgelabel,
    }
  }
  static getType() {
    return Token.Edgelabel
  }
  static clone(node: EdgeLabelToken) {
    return new EdgeLabelToken(node.__text, node.__key)
  }
}

interface SerializedEdgeLabelToken extends SerializedTextNode {
  type: string
}

export function $createEdgelabelToken(textNode: TextNode) {
  return new EdgeLabelToken(textNode.__text)
}

export function $getEdgelabelMatcher(text: string): EntityMatch | null {
  const edgelabelRegexRule = /^([^:]+::)/
  const matchArr = edgelabelRegexRule.exec(text)
  if (matchArr && matchArr[1]) {
    const start = matchArr.index
    const end = start + matchArr[1].length
    return {
      start: start,
      end: end,
    }
  } else {
    return null
  }
}

export function $isEdgelabelToken(node: LexicalNode | null | undefined): node is EdgeLabelToken {
  return node instanceof EdgeLabelToken
}
