import { EditorConfig, LexicalNode, NodeKey, SerializedTextNode, TextNode } from "lexical";
import { EntityMatch } from "@lexical/text";
import { Token } from ".";

export class ClassesToken extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  static importJSON(json: SerializedClassesToken): ClassesToken {
    return new ClassesToken(json.text);
  }

  static getType() {
    return Token.Classes;
  }

  static clone(node: ClassesToken) {
    return new ClassesToken(node.__text, node.__key);
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.classList.add(Token.Classes);
    return dom;
  }

  exportJSON(): SerializedClassesToken {
    return {
      ...super.exportJSON(),
      type: Token.Classes,
    };
  }
}

interface SerializedClassesToken extends SerializedTextNode {
  type: string;
}

export function $createClassesToken(textNode: TextNode) {
  return new ClassesToken(textNode.__text);
}

export function $getClassesMatcher(text: string): EntityMatch | null {
  const classesRegexRule = /(\((\.[A-Za-z-]*)+\))/;
  const matchArr = classesRegexRule.exec(text);
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

export function $isClassesToken(node: LexicalNode | null | undefined): node is ClassesToken {
  return node instanceof ClassesToken;
}
