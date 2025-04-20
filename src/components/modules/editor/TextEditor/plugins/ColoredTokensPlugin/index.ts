import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity";
import {
  $createClassesToken,
  $getClassesMatcher,
  ClassesToken,
} from "./ClassesToken";
import {
  $createEdgelabelToken,
  $getEdgelabelMatcher,
  EdgeLabelToken,
} from "./EdgeLabelToken";
import {
  $createSublabelToken,
  $getSublabelMatcher,
  SubLabelToken,
} from "./SubLabelToken";

export function ColoredTokensPlugin() {
  useLexicalTextEntity(
    $getEdgelabelMatcher,
    EdgeLabelToken,
    $createEdgelabelToken
  );

  useLexicalTextEntity(
    $getSublabelMatcher,
    SubLabelToken,
    $createSublabelToken
  );

  useLexicalTextEntity($getClassesMatcher, ClassesToken, $createClassesToken);

  return null;
}

export enum Token {
  Edgelabel = "edgelabel-token",
  Sublabel = "sublabel-token",
  Classes = "classes-token",
}
