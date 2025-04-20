import { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, TextNode } from "lexical";
import { EntityMatch } from "@lexical/text";
import { Token } from ".";

export class SubLabelToken extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }
  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.classList.add(Token.Sublabel);
    return dom;
  }
  static importJSON(json: SerializedSublabelToken): SubLabelToken {
    return new SubLabelToken(json.text);
  }
  exportJSON(): SerializedSublabelToken {
    return {
      ...super.exportJSON(),
      type: Token.Sublabel,
    };
  }
  static getType() {
    return Token.Sublabel;
  }
  static clone(node: SubLabelToken) {
    return new SubLabelToken(node.__text, node.__key);
  }
}
interface SerializedSublabelToken extends SerializedTextNode {
  type: string;
}

export function $createSublabelToken(textNode: TextNode) {
  return new SubLabelToken(textNode.__text);
}

export function $getSublabelMatcher(text: string): EntityMatch | null {
  const sublabelRegexRule = /(__(.*))/;
  const matchArr = sublabelRegexRule.exec(text);
  if (matchArr) {
    const start = matchArr.index;
    const end = start + matchArr[0].length;
    return {
      start: start,
      end: end,
    };
  } else {
    return null;
  }
}

export function $isSublabelToken(node: LexicalNode | null | undefined): node is SubLabelToken {
  return node instanceof SubLabelToken;
}

