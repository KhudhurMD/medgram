// const cssfilter = require('cssfilter');

export function injectCSS(stylesObject: Object) {
  const options = {
    whiteList: {
      color: true,
      "background-color": true,
      "font-size": true,
      "font-family": true,
      "font-weight": true,
      "font-style": true,
      border: true,
      "border-radius": true,
      "border-color": true,
      height: true,
      width: true,
      margin: true,
      padding: true,
    },
  };
  // const XSSFilter = new cssfilter.FilterCSS(options);
  // console.log(stylesObject);
  let CSS = "";
  CSS = Object.entries(stylesObject)
    .map(([selector, selectorStyles]) => {
      let selectorStylesText = "";
      if (selectorStyles) {
        // if not object then it is a string, convert to object
        if (typeof selectorStyles === "string") {
          selectorStyles = selectorStyles
            .split(";")
            .map((styleLine) => {
              const [styleLineKey, styleLineValue] = styleLine.split(":");
              return {
                [`${styleLineKey}`]: styleLineValue,
              };
            })
            .reduce((acc, styleLine) => {
              return {
                ...acc,
                ...styleLine,
              };
            }, {});
        }
        selectorStylesText = Object.entries(selectorStyles)
          .map(([property, value]) => {
            return `${property}: ${value};`;
          })
          .join("");
      }
      return `${selector} {${selectorStylesText}}`;
    })
    .join("");

  const injectedStyles = document.createElement("style");
  document.head.appendChild(injectedStyles);
  injectedStyles.innerHTML = CSS;
}
