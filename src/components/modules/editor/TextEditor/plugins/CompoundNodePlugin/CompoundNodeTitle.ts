import { ElementNode, LexicalNode, NodeKey, SerializedElementNode, TextNode } from "lexical";

import { CompoundNodeBody } from "./CompoundNodeBody";
import { CompoundNodeContainer } from "./CompoundNodeContainer";

export class CompoundNodeTitle extends ElementNode {
  constructor(key?: string, children?: LexicalNode[]) {
    super(key);
  }

  static getType() {
    return "compound-node-title";
  }

  static clone(node: CompoundNodeTitle) {
    return new CompoundNodeTitle(node.__key);
  }

  createDOM() {
    const dom = document.createElement("div");
    dom.classList.add("compound-node-title");
    return dom;
  }

  updateDOM() {
    return false;
  }

  static importJSON(json: SerializedCompoundNodeTitle) {
    return new CompoundNodeTitle();
  }

  exportJSON(): SerializedCompoundNodeTitle {
    return {
      ...super.exportJSON(),
      type: CompoundNodeTitle.getType(),
      key: this.__key,
    };
  }

  insertNewAfter() {
    // if parent is not a compound node container, do nothing
    const parent = this.getParent();
    if (!parent) {
      return null;
    }
    if (parent && parent.getType() !== CompoundNodeContainer.getType()) {
      console.error("expected node to have a container parent");
      return null;
    }
    const newTextNode = new TextNode("");
    const newBodyNode = new CompoundNodeBody().append(newTextNode);
    parent.append(newBodyNode);
    return newBodyNode;
  }

  canIndent() {
    return false;
  }
}

interface SerializedCompoundNodeTitle extends SerializedElementNode {
  type: string;
  key?: NodeKey;
}

export function $isCompoundNodeTitle(node: LexicalNode | ElementNode | null): node is CompoundNodeTitle {
  return node instanceof CompoundNodeTitle;
}
