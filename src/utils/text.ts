export function titleCase(input: string) {
  const wordArr = input.split(' ')
  return wordArr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1) + ' '
  })
}
