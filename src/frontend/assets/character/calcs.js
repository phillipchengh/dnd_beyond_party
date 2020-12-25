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

export function getLevelDisplay({ classes }) {
  if (!classes.length) {
    return 'Level 0';
  }
  return `Level ${classes.reduce((totalLevel, { level }) => (
    totalLevel + level
  ), 0)}`;
}

export function getRace({ race }) {
  if (!race) {
    return '';
  }
  return race.fullName || race.baseName;
}

const STRENGTH_ID = 1;
const DEXTERITY_ID = 2;
const CONSTITUTION_ID = 3;
const INTELLIGENCE_ID = 4;
const WISDOM_ID = 5;
const CHARISMA_ID = 6;
const ABILITY_SCORE_DEFAULT_MAX = 20;

// applies modifier in the second modifier into current set modifiers matching the ability id
function applyAbilityModifiers(modifiers, {
  entityId, statId, type, value,
}, abilityId) {
  const appliedAbilityModifiers = { ...modifiers };
  // ??? handle restricted bonuses
  if (entityId === abilityId && type === 'bonus') {
    appliedAbilityModifiers.abilityBonus += value;
  } else if (entityId === abilityId && type === 'set') {
    appliedAbilityModifiers.abilitySets.push(value);
  } else if (statId === abilityId && type === 'bonus') {
    appliedAbilityModifiers.maxBonuses.push(value);
  }
  return appliedAbilityModifiers;
}

function getAbilityScore(character, abilityId) {
  const overrideValue = character.overrideStats.find(({ id }) => (id === abilityId))?.value ?? null;
  // if this is set, then nothing else matters
  if (overrideValue !== null) {
    return overrideValue;
  }

  // return value that is worked on
  let abilityScore;
  // the max can be modified as well
  let abilityScoreMax = ABILITY_SCORE_DEFAULT_MAX;

  // base stat value
  const statValue = character.stats.find(({ id }) => (id === abilityId))?.value ?? 10;
  // any misc bonus that's set
  const bonusValue = character.bonusStats.find(({ id }) => (id === abilityId))?.value ?? 0;
  abilityScore = statValue + bonusValue;

  // gather all modifiers under character.modifiers except for items
  // these include background, class, condition, feat, race
  // they are statically set unlike items, so i believe i can assume they are applied
  const staticModifiers = Object.entries(
    character.modifiers,
  ).reduce(
    (allModifiers, [modifierType, typeModifiers]) => (
      modifierType !== 'item' ? allModifiers.concat(typeModifiers) : allModifiers
    ), [],
  ).reduce((currentModifiers, modifier) => (
    applyAbilityModifiers(currentModifiers, modifier, abilityId)
  ), {
    abilityBonus: 0,
    abilitySets: [],
    maxBonuses: [],
  });

  // items have grantedModifiers, but we need to check if they're equipped and attunement rules
  const activeModifiers = character.inventory.reduce((currentModifiers, {
    equipped, isAttuned, definition: {
      grantedModifiers,
    },
  }) => {
    // ??? an item can only apply modifiers if they're equipped
    if (!equipped) {
      return currentModifiers;
    }
    return grantedModifiers.reduce((currentModifiersInner, modifier) => {
      const { requiresAttunement } = modifier;
      if (requiresAttunement && !isAttuned) {
        return currentModifiersInner;
      }
      return applyAbilityModifiers(currentModifiersInner, modifier, abilityId);
    }, currentModifiers);
  }, staticModifiers);

  const {
    abilityBonus,
    abilitySets,
    maxBonuses,
  } = activeModifiers;

  // add all the bonuses we've found
  abilityScore += abilityBonus;
  // the max can be modified, find what is the highest max and use that
  maxBonuses.forEach((maxBonus) => {
    abilityScoreMax = Math.max(abilityScoreMax, ABILITY_SCORE_DEFAULT_MAX + maxBonus);
  });
  // calculated ability score can't go beyond the max
  abilityScore = Math.min(abilityScore, abilityScoreMax);
  // there can be modifiers that directly set the ability score
  // check if any output a better stat than the calculated score
  abilitySets.forEach((abilitySet) => {
    abilityScore = Math.max(abilityScore, abilitySet);
  });
  return abilityScore;
}

export function getStrengthAbilityScore(character) {
  return getAbilityScore(character, STRENGTH_ID);
}

export function getDexterityAbilityScore(character) {
  return getAbilityScore(character, DEXTERITY_ID);
}

export function getConstitutionAbilityScore(character) {
  return getAbilityScore(character, CONSTITUTION_ID);
}

export function getIntelligenceAbilityScore(character) {
  return getAbilityScore(character, INTELLIGENCE_ID);
}

export function getWisdomAbilityScore(character) {
  return getAbilityScore(character, WISDOM_ID);
}

export function getCharismaAbilityScore(character) {
  return getAbilityScore(character, CHARISMA_ID);
}
