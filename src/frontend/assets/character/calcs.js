/**
 * NOTE All exported functions in this file are automatically tested.
 * Add the same named function in dnd_beyond_dom_selectors to verify correctness.
 * Test code and details are in calcs.test.js
 */

export function getId({ id }) {
  return id;
}

export function getName({ name }) {
  return name;
}

export function getClassDisplay({ classes }) {
  // check if at least 1 class
  // could be newbie character for example
  if (!classes.length) {
    return '';
  }
  // starting class is displayed at the front, the rest are alphabetically sorted
  const startingClassIndex = classes.findIndex(({ isStartingClass }) => isStartingClass);
  const startingClassDisplay = `${classes[startingClassIndex].definition.name} ${classes[startingClassIndex].level}`;
  const multiClasses = [...classes];
  multiClasses.splice(startingClassIndex, 1);
  const multiClassDisplays = multiClasses.map(({ definition: { name }, level }) => (
    `${name} ${level}`
  )).sort();
  return [startingClassDisplay, ...multiClassDisplays].join(' / ');
}
