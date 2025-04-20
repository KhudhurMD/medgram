import { ElementNode, LexicalNode, NodeKey, SerializedElementNode, TextNode } from "lexical";

import { DescriptionNodeBody } from "./DescriptionNodeBody";
import { DescriptionNodeContainer } from "./DescriptionNodeContainer";

export class DescriptionNodeTitle extends ElementNode {
  constructor(key?: string, children?: LexicalNode[]) {
    super(key);
  }

  static getType() {
    return "description-node-title";
  }

  static clone(node: DescriptionNodeTitle) {
    return new DescriptionNodeTitle(node.__key);
  }

  createDOM() {
    const dom = document.createElement("div");
    dom.classList.add("description-node-title");
    return dom;
  }

  updateDOM() {
    return false;
  }

  static importJSON(json: SerializedDescriptionNodeTitle) {
    return new DescriptionNodeTitle();
  }

  exportJSON(): SerializedDescriptionNodeTitle {
    return {
      ...super.exportJSON(),
      type: DescriptionNodeTitle.getType(),
      key: this.__key,
    };
  }

  insertNewAfter() {
    // if parent is not a description node container, do nothing
    const parent = this.getParent();
    if (!parent) {
      return null;
    }
    if (parent && parent.getType() !== DescriptionNodeContainer.getType()) {
      console.error("expected node to have a container parent");
      return null;
    }
    const newTextNode = new TextNode("");
    const newBodyNode = new DescriptionNodeBody().append(newTextNode);
    parent.append(newBodyNode);
    return newBodyNode;
  }

  canIndent() {
    return false;
  }
}

interface SerializedDescriptionNodeTitle extends SerializedElementNode {
  type: string;
  key?: NodeKey;
}

export function $isDescriptionNodeTitle(node: LexicalNode | ElementNode | null): node is DescriptionNodeTitle {
  return node instanceof DescriptionNodeTitle;
}
