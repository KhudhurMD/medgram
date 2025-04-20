import { Listbox } from '@headlessui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as Toolbar from '@radix-ui/react-toolbar';
import * as Tooltip from '@radix-ui/react-tooltip';

import {
  $createRangeSelection,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  ElementNode,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  LexicalNode,
  LineBreakNode,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';
import {
  ArrowArcLeft,
  ArrowLeft,
  ArrowRight,
  Bug,
  CaretDown,
  CaretUp,
  CodeSimple,
  GitMerge,
  LineSegment,
  List,
  Rectangle,
  Snowflake,
  TextAa,
  TextAlignLeft,
  TextIndent,
  TextOutdent,
} from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { graphSlice } from '../../../Graph/slice';
import { $isStyledNode, StyledNode } from '../../common/stylednode';
import { $isDefaultNode, DefaultNode } from '../../nodes/defaultnode';
import { textEditorSlice } from '../../slice';
import { $isCompoundNodeBody, CompoundNodeBody } from '../CompoundNodePlugin/CompoundNodeBody';
import { $isCompoundNodeContainer, CompoundNodeContainer } from '../CompoundNodePlugin/CompoundNodeContainer';
import { $isCompoundNodeTitle, CompoundNodeTitle } from '../CompoundNodePlugin/CompoundNodeTitle';
import { CONVERT_NODE_TO_DEFAULT, CONVERT_NODE_TO_COMPOUND, CONVERT_NODE_TO_DESCRIPTION } from './commands';
import { useAppDispatch, useAppSelector } from '../../../../../../store/storeHooks';
import { styleEditorSlice } from '../../../StyleEditor/slice';
import { AppDispatch } from '../../../../../../store/store';
import { ampli } from '../../../../../../ampli';
import { $isDescriptionNodeContainer, DescriptionNodeContainer } from '../DescriptionNodePlugin/DescriptionNodeContainer';
import { $isDescriptionNodeBody, DescriptionNodeBody } from '../DescriptionNodePlugin/DescriptionNodeBody';
import { $isDescriptionNodeTitle, DescriptionNodeTitle } from '../DescriptionNodePlugin/DescriptionNodeTitle';
import { classNames } from '../../../../../../utils/tailwind';
import _ from 'lodash';
import { posthog } from 'posthog-js';
import { FaLine } from 'react-icons/fa';

function indentText(editor: LexicalEditor) {
  editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  // ampli.indentedTextUsingTheToolbar()
  posthog.capture('indent text with toolbar');
}

function outdentText(editor: LexicalEditor) {
  editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  // ampli.outdentedTextUsingTheToolbar()
  posthog.capture('outdent text with toolbar');
}

const availableColors = [
  {
    id: 0,
    name: 'No Color',
    value: 'nocolor',
    color: '#ffffff00',
    unavailable: false,
  },
  { id: 1, name: 'Blue', color: '#e1efff', value: 'blue', unavailable: false },
  {
    id: 2,
    name: 'Green',
    color: '#f2ffef',
    value: 'green',
    unavailable: false,
  },
  { id: 3, name: 'Red', color: '#ff000017', value: 'red', available: false },
  {
    id: 4,
    name: 'Yellow',
    color: '#ffff002b',
    value: 'yellow',
    unavailable: false,
  },
  {
    id: 5,
    name: 'Purple',
    color: '#f2e1ff',
    value: 'purple',
    unavailable: false,
  },
  {
    id: 6,
    name: 'Gray',
    color: '#f2f2f2',
    value: 'gray',
    unavailable: false,
  },
];

const availableNodeTypes = [
  {
    id: 0,
    name: 'Line',
    value: 'default',
    unavailable: false,
    icon: TextAa,
  },
  {
    id: 1,
    name: 'List',
    value: 'compound',
    unavailable: false,
    icon: List,
  },
  {
    id: 2,
    name: 'Paragraph',
    value: 'description',
    unavailable: false,
    icon: TextAlignLeft,
  },
];

function changeColorTo(editor: LexicalEditor, to: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = getNearestStyledNode(node);
      if (parent) {
        const oldStyles = parent.getStyles();
        availableColors.forEach(({ value }) => {
          if (oldStyles.includes(value)) {
            oldStyles.splice(oldStyles.indexOf(value), 1);
          }
        });
        parent.setStyles([...oldStyles, to]);
      }
    }
  });
}

function getCurrentColor(editor: LexicalEditor): string | undefined {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = getNearestStyledNode(node);
      if (parent) {
        const oldStyles = parent.getStyles();
        const color = oldStyles.find((style) => availableColors.find((color) => color.value === style));
        if (color) {
          return color;
        }
      }
    }
  });
}

function getSelection(editor: LexicalEditor): RangeSelection | undefined {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      return selection;
    }
  });
}

function debugToggle(dispatch: AppDispatch): void {
  dispatch(textEditorSlice.actions.debugToggled());
}

function styleEditorToggle(dispatch: AppDispatch): void {
  dispatch(styleEditorSlice.actions.toggle());
}

function getCurrentNodeType(editor: LexicalEditor): 'default' | 'compound' | 'description' | null {
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return null;
    }
    const node = selection.anchor.getNode();
    const parent = getNearestStyledNode(node);
    if (parent) {
      if ($isDefaultNode(parent)) {
        return 'default';
      } else if ($isCompoundNodeContainer(parent) || $isCompoundNodeBody(parent)) {
        return 'compound';
      } else if ($isDescriptionNodeContainer(parent) || $isDescriptionNodeBody(parent)) {
        return 'description';
      }
    }
    return null;
  });
}

function registerToolbarListeners(editor: LexicalEditor) {
  editor.registerCommand(
    CONVERT_NODE_TO_COMPOUND,
    () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const node = selection.anchor.getNode();
        const nearestStyledNode = getNearestNodeTypeParent(node);
        if ($isDefaultNode(nearestStyledNode) || $isDescriptionNodeContainer(nearestStyledNode)) {
          const newCompoundContainer = new CompoundNodeContainer();
          const newCompoundTitle = new CompoundNodeTitle();

          const newCompoundTitleText = new TextNode('Title');
          newCompoundTitle.append(newCompoundTitleText);
          newCompoundContainer.append(newCompoundTitle);
          nearestStyledNode
            .getChildren()
            .filter((child) => child.getTextContent() != 'Title')
            .map((child) => child.getTextContent())
            .join('\n')
            .split('\n')
            .forEach((child) => {
              newCompoundContainer.append(new CompoundNodeBody().append(new TextNode(child)));
            });
          nearestStyledNode.replace(newCompoundContainer);

          const newSelection = $createRangeSelection();
          const textOffset = newCompoundTitleText.getTextContent().length;
          newSelection.setTextNodeRange(newCompoundTitleText, textOffset, newCompoundTitleText, textOffset);
          $setSelection(newSelection);
          return true;
        }
      });
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand(
    CONVERT_NODE_TO_DESCRIPTION,
    () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const node = selection.anchor.getNode();
        const nearestStyledNode = getNearestNodeTypeParent(node);
        if ($isDefaultNode(nearestStyledNode) || $isCompoundNodeContainer(nearestStyledNode)) {
          const newDescriptionContainer = new DescriptionNodeContainer();
          const newDescriptionTitle = new DescriptionNodeTitle();
          const newDescriptionBody = new DescriptionNodeBody();
          const newDescriptionTitleText = new TextNode('Title');
          const newDescriptionBodyText = new TextNode(
            nearestStyledNode
              .getChildren()
              .filter((child) => child.getTextContent() != 'Title')
              .map((child) => child.getTextContent())
              .join('\n')
          );
          newDescriptionTitle.append(newDescriptionTitleText);
          newDescriptionBody.append(newDescriptionBodyText);
          newDescriptionContainer.append(newDescriptionTitle);
          newDescriptionContainer.append(newDescriptionBody);
          nearestStyledNode.replace(newDescriptionContainer);
          const newSelection = $createRangeSelection();
          const textOffset = newDescriptionTitleText.getTextContent().length;
          newSelection.setTextNodeRange(newDescriptionTitleText, textOffset, newDescriptionTitleText, textOffset);
          $setSelection(newSelection);
          return true;
        }
      });
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );

  editor.registerCommand(
    CONVERT_NODE_TO_DEFAULT,
    () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
        const node = selection.anchor.getNode();
        const nearestStyledNode = getNearestNodeTypeParent(node);
        if ($isCompoundNodeContainer(nearestStyledNode) || $isDescriptionNodeContainer(nearestStyledNode)) {
          const newDefaultNode = new DefaultNode();
          nearestStyledNode.getChildren().forEach((child, index) => {
            if ($isCompoundNodeBody(child) || $isDescriptionNodeBody(child)) {
              if (index !== nearestStyledNode.getChildren().length - 1) {
                newDefaultNode.append(new TextNode(child.getTextContent()));
                newDefaultNode.append(new LineBreakNode());
              } else {
                newDefaultNode.append(new TextNode(child.getTextContent()));
              }
            }
            if ($isCompoundNodeTitle(child) || $isDescriptionNodeTitle(child)) {
              if (child.getTextContent() !== 'Title') {
                newDefaultNode.append(new TextNode(child.getTextContent()));
              }
            }
          });
          nearestStyledNode.replace(newDefaultNode);
          const newSelection = $createRangeSelection();
          const lastChild = newDefaultNode.getLastChild();
          if (lastChild && $isTextNode(lastChild)) {
            newSelection.setTextNodeRange(lastChild, 0, lastChild, 0);
          }
        }
      });
      return true;
    },
    COMMAND_PRIORITY_EDITOR
  );
}

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<RangeSelection | undefined>();
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);
  const [selectedNodeType, setSelectedNodeType] = useState(availableNodeTypes[0]);
  const dispatch = useAppDispatch();
  editor.registerUpdateListener(() => {
    const currentSelection = getSelection(editor);
    setSelection(currentSelection);
  });
  registerToolbarListeners(editor);
  const isNotMobile = useMediaQuery('(min-width: 768px)');
  const isMobile = !isNotMobile;
  const freezeStatus = useAppSelector((state) => state.graph.options.layout?.freeze);

  useEffect(() => {
    changeColorTo(editor, selectedColor?.value || 'none');
  }, [selectedColor]);

  useEffect(() => {
    const currentColor = getCurrentColor(editor);
    const currentAvailableColor = availableColors.find((color) => color.value === currentColor);
    if (currentColor && currentAvailableColor) {
      setSelectedColor(currentAvailableColor);
    } else {
      setSelectedColor(availableColors[0]);
    }
  }, [selection]);

  useEffect(() => {
    const currentNodeType = getCurrentNodeType(editor);
    const currentAvailableNodeType = availableNodeTypes.find((nodeType) => {
      return nodeType.value === currentNodeType;
    });
    if (currentNodeType && currentAvailableNodeType) {
      setSelectedNodeType(currentAvailableNodeType);
    } else {
      setSelectedNodeType(availableNodeTypes[0]);
    }
  }, [selection]);

  useEffect(() => {
    if (selectedNodeType && selectedNodeType.value === 'compound' && getCurrentNodeType(editor) !== 'compound') {
      editor.dispatchCommand(CONVERT_NODE_TO_COMPOUND, null);
    } else if (selectedNodeType && selectedNodeType.value === 'default') {
      editor.dispatchCommand(CONVERT_NODE_TO_DEFAULT, null);
    } else if (selectedNodeType && selectedNodeType.value === 'description') {
      editor.dispatchCommand(CONVERT_NODE_TO_DESCRIPTION, null);
      dispatch(graphSlice.actions.layoutingTriggered());
    }
  }, [selectedNodeType]);

  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const toolbarWrapRef = React.useRef<HTMLDivElement>(null);
  const toolbar = toolbarRef.current;
  const toolbarWrap = toolbarWrapRef.current;

  useEffect(() => {
    window.addEventListener('scroll', showToolbar);
    window.addEventListener('blur', showToolbar);
  });

  /* Method that will fix header after a specific scrollable */
  const showToolbar = () => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    if (!toolbarWrap) return;
    const newPosition = toolbarWrap.getBoundingClientRect().top;
    if (newPosition > 0) {
      setMarginTop(0);
    }
    debounceMargin();
  };

  // function to set the margin to show the toolbar if hidden
  const setMargin = function () {
    if (!toolbar) return;
    if (!toolbarWrap) return;
    const newPosition = toolbarWrap.getBoundingClientRect().top;
    if (newPosition < -1) {
      const fixPosition = Math.abs(newPosition); // this is new position we need to fix the toolbar in the display
      setMarginTop(fixPosition);
    }
  };

  function setMarginTop(margin: number) {
    if (!toolbar) return;
    if (!toolbarWrap) return;
    if (margin == 0) {
      toolbar.classList.remove('toolbar-down-transition');
    }
    if (margin > 0) {
      toolbar.classList.add('toolbar-down-transition');
    }
    toolbar.style.marginTop = `${margin}px`;
  }

  // use lodash debounce to stop flicker
  const debounceMargin = _.debounce(setMargin, 100);

  return (
    <div
      className={classNames('right-0 py-2 w-full md:mt-2 top-10 md:top-0 sticky bg-white z-10')}
      ref={toolbarWrapRef}
      onClick={() => editor.focus()}
    >
      <Toolbar.Root
        className={classNames(
          'absolute md:relative mr-2 fill-available text-md mx-3 flex flex-row items-center bg-white rounded-md border border-gray-200'
        )}
        aria-label="Formatting options"
        ref={toolbarRef}
      >
        <Toolbar.ToggleGroup type="multiple" aria-label="Text Indentation" className="flex flex-row items-center text-gray-500">
          <TooltipButton label="→ Indent (Tab)">
            <Toolbar.Button
              aria-label="Indent Text"
              className="text-gray-400 p-2 hover:bg-gray-100 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
              onClick={() => indentText(editor)}
            >
              <ArrowRight size={22} />
            </Toolbar.Button>
          </TooltipButton>
          <TooltipButton label="← Outdent (Shift+Tab)">
            <Toolbar.Button
              aria-label="Outdent Text"
              className="p-2 hover:bg-gray-100 text-gray-400 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
              onClick={() => outdentText(editor)}
            >
              <ArrowLeft size={22} />
            </Toolbar.Button>
          </TooltipButton>
        </Toolbar.ToggleGroup>

        <Listbox value={selectedColor} onChange={setSelectedColor}>
          {({ open }) => (
            <div className="relative z-10 hover:bg-gray-100 border-r border-gray-200">
              <Listbox.Button
                className="flex flex-row items-center justify-center py-2 px-2 whitespace-nowrap p-2"
                onClick={() => {
                  // ampli.openedNodeColorMenu()
                  posthog.capture('opened node color menu');
                }}
              >
                <div className="flex-shrink-0 mr-2 h-4 w-4 rounded-full border border-gray-300" style={{ background: selectedColor?.color }}></div>
                {selectedColor?.name}
                {open ? (
                  <CaretUp size={14} weight="bold" className="ml-2 mr-1 text-gray-400 flex-shrink-0" />
                ) : (
                  <CaretDown size={14} weight="bold" className="ml-2 mr-1 text-gray-400 flex-shrink-0" />
                )}
              </Listbox.Button>
              <Listbox.Options className="absolute left-[50%] top-12 z-20 w-full min-w-[130px] translate-x-[-50%] rounded-md border border-gray-200 bg-white">
                {availableColors.map((color) => (
                  <Listbox.Option
                    key={color.id}
                    value={color}
                    className="flex w-full cursor-pointer flex-row items-center justify-start border-b border-gray-200 py-1 px-3 hover:bg-gray-100"
                  >
                    <div className="mr-2 h-4 w-4 rounded-full border border-gray-300" style={{ background: color?.color }}></div>

                    {color.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>

        <Listbox value={selectedNodeType} onChange={setSelectedNodeType}>
          {({ open }) => (
            <div className="relative hover:bg-gray-100">
              <Listbox.Button
                className="flex w-full flex-row border-r border-r-gray-200 items-center justify-center  py-2 px-2"
                onClick={() => {
                  // ampli.openedNodeTypeMenu()
                  posthog.capture('opened node type menu');
                }}
              >
                {selectedNodeType?.icon && <selectedNodeType.icon size={22} className="mr-2 text-gray-400 h-4 w-4 flex-shrink-0" />}
                {selectedNodeType?.name}
                {open ? (
                  <CaretUp size={14} weight="bold" className="ml-1 mr-1 text-gray-400 flex-shrink-0" />
                ) : (
                  <CaretDown size={14} weight="bold" className="ml-1 mr-1 text-gray-400 flex-shrink-0" />
                )}
              </Listbox.Button>
              <Listbox.Options className="absolute left-[50%] top-12 w-full min-w-[150px] translate-x-[-50%] rounded-md border border-gray-200 bg-white">
                {availableNodeTypes.map((nodeType) => (
                  <Listbox.Option
                    key={nodeType.id}
                    value={nodeType}
                    className="flex w-full cursor-pointer flex-row items-center justify-start border-b border-gray-200 py-2 px-3 hover:bg-gray-100"
                  >
                    <nodeType.icon size={22} className="mr-2 text-gray-400" />
                    {nodeType.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>
        {isNotMobile && (
          <>
            {true != true && (
              <>
                <TooltipButton label="Code editor mode">
                  <Toolbar.Button
                    aria-label="Debug Mode"
                    className="text-gray-400 p-2 hover:bg-gray-100 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
                    onClick={() => styleEditorToggle(dispatch)}
                  >
                    <CodeSimple size={22} />
                  </Toolbar.Button>
                </TooltipButton>
                <TooltipButton label="Debug Mode">
                  <Toolbar.Button
                    aria-label="Debug Mode"
                    className="p-2 hover:bg-gray-100 text-gray-400 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
                    onClick={() => debugToggle(dispatch)}
                  >
                    <Bug size={22} />
                  </Toolbar.Button>
                </TooltipButton>
              </>
            )}
            <TooltipButton label="Layout Graph">
              <Toolbar.Button
                aria-label="Layouting"
                className="p-2 text-gray-400 hover:bg-gray-100 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
                onClick={() => {
                  dispatch(graphSlice.actions.layoutingTriggered());
                  // ampli.clickedLayoutGraphButton()
                  posthog.capture('clicked layout graph button');
                }}
              >
                <GitMerge size={22} />
              </Toolbar.Button>
            </TooltipButton>

            <TooltipButton label="Undo">
              <Toolbar.Button
                aria-label="Undo"
                className="p-2 text-gray-400 hover:bg-gray-100 border-t-0 border-l-0 border-b-0 border-r border-solid border-gray-200"
                onClick={() => {
                  editor.dispatchCommand(UNDO_COMMAND, undefined);
                  posthog.capture('undo button');
                }}
              >
                <ArrowArcLeft size={22} />
              </Toolbar.Button>
            </TooltipButton>
          </>
        )}
      </Toolbar.Root>
    </div>
  );
};

export function getNearestStyledNode(node: LexicalNode | ElementNode | null | undefined): StyledNode | null {
  if (node == undefined || node == null) {
    return null;
  }
  if ($isStyledNode(node)) {
    return node;
  }
  const parent = node.getParent();
  if (node && parent && $isStyledNode(parent)) {
    return parent;
  } else {
    return getNearestStyledNode(parent);
  }
}

function getNearestNodeTypeParent(node: LexicalNode | null | undefined): DefaultNode | CompoundNodeContainer | DescriptionNodeContainer | null {
  const parent = getNearestStyledNode(node);

  if (node == undefined || parent == undefined) {
    return null;
  }

  if ($isCompoundNodeBody(parent)) {
    return getNearestNodeTypeParent(parent.getParent());
  }

  if ($isDescriptionNodeBody(parent)) {
    return getNearestNodeTypeParent(parent.getParent());
  }

  if ($isDefaultNode(parent) || $isCompoundNodeContainer(parent) || $isDescriptionNodeContainer(parent)) {
    return parent;
  }
  return null;
}

interface TooltipButtonProps {
  children: React.ReactNode;
  label: string;
}
const TooltipButton = ({ children, label }: TooltipButtonProps) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={500}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" sideOffset={5}>
            {label}
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default ToolbarPlugin;
