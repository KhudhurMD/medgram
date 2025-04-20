import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey, LexicalNode, NodeKey } from 'lexical'
import { useEffect } from 'react'
import { ClassesToken } from '../ColoredTokensPlugin/ClassesToken'
import { StyledNode } from '../../common/stylednode'
import { $isCompoundNodeTitle } from '../CompoundNodePlugin/CompoundNodeTitle'

export const availableColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'black', 'white', 'gray', 'brown']

export function PushStylesToStyledNodePlugin() {
  const [editor] = useLexicalComposerContext()
  const classesRegexRule = /(\(((\.[A-Za-z-]*)+)\))/
  const ClassesToBeRemovedWhenDestroyed: {
    key: NodeKey
    parent: LexicalNode
    classes: string[]
  }[] = []

  useEffect(() => {
    editor.registerMutationListener(ClassesToken, (nodeMutationsMap) => {
      nodeMutationsMap.forEach((mutation, nodeKey) => {
        editor.update(() => {
          if (mutation.toString() === 'created' || mutation.toString() === 'updated') {
            const node = $getNodeByKey(nodeKey)
            const parent = node?.getParent() && !$isCompoundNodeTitle(node?.getParent()) ? node?.getParent() : node?.getParent()?.getParent()
            if (node && parent && parent instanceof StyledNode) {
              const matchArr = classesRegexRule.exec(node.getTextContent())
              if (matchArr) {
                const userSpecifiedClasses = matchArr[2]!.split('.')
                userSpecifiedClasses.shift()
                const existingClasses = parent.getStyles()
                const userEnteredColor = userSpecifiedClasses.filter((c) => availableColors.includes(c)).length > 0
                const existingColors = existingClasses.filter((c) => availableColors.includes(c))
                // const classes = [...userSpecifiedClasses, ...existingClasses]
                const classes = userSpecifiedClasses.concat(
                  existingClasses.filter((item) => {
                    return userSpecifiedClasses.indexOf(item) < 0 && !(userEnteredColor && existingColors.includes(item))
                  })
                )
                parent.setStyles(classes)
                ClassesToBeRemovedWhenDestroyed.push({
                  key: nodeKey,
                  parent,
                  classes: userSpecifiedClasses,
                })
              }
            }
          } else if (mutation.toString() === 'destroyed') {
            const parent = ClassesToBeRemovedWhenDestroyed.find((item) => item.key === nodeKey)?.parent
            const classes = ClassesToBeRemovedWhenDestroyed.find((item) => item.key === nodeKey)?.classes
            if (parent && classes) {
              const oldStyles = parent.getStyles()
              const oldStylesWithoutRemovedClasses = oldStyles.filter((item: string) => !classes.includes(item))
              parent.setStyles(oldStylesWithoutRemovedClasses)
            }
          }
        })
      })
    })
  }, [editor])
  return null
}
