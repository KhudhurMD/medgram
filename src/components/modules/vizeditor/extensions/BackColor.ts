import { Extension } from '@tiptap/react';

export type ColorOptions = {
  types: string[];
};

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    backColor: {
      /**
       * Set the paragraph background color
       */
      setBackColor: (color: string) => ReturnType;
      /**
       * Unset the paragraph background color
       */
      unsetBackColor: () => ReturnType;
      /**
       * Get the paragraph background color
       */
      getBackColor: () => any;
    };
  }
}

export const BackColor = Extension.create<ColorOptions>({
  name: 'backColor',

  addOptions() {
    return {
      types: ['paragraph'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setBackColor:
        (color) =>
        ({ chain }) => {
          return chain().updateAttributes('paragraph', { backgroundColor: color }).run();
        },
      unsetBackColor:
        () =>
        ({ chain }) => {
          return chain().updateAttributes('paragraph', { backgroundColor: null }).run();
        },
      getBackColor: () => () => {
        return this.editor?.getAttributes('paragraph').backgroundColor as string;
      },
    };
  },
});
