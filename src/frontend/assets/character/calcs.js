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

// for convenient debugging these calcs
// eslint-disable-next-line no-unused-vars
function debug(character, key, value) {
  // eslint-disable-next-line no-console
  console.log(`${getName(character)} | ${key} | ${JSON.stringify(value)}`);
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

// applies modifier in the second argument into current modifiers matching the ability id
// returns null if no modifiers applied, this signals if the modifier actually was applied or not
function applyAbilityModifiers(modifiers, {
  entityId, statId, type, value,
}, abilityId) {
  const appliedAbilityModifiers = { ...modifiers };
  // ??? handle restricted bonuses
  if (entityId === abilityId && type === 'bonus') {
    appliedAbilityModifiers.abilityBonus += value;
    return appliedAbilityModifiers;
  }
  if (entityId === abilityId && type === 'set') {
    appliedAbilityModifiers.abilitySets.push(value);
    return appliedAbilityModifiers;
  }
  if (statId === abilityId && type === 'bonus') {
    appliedAbilityModifiers.maxBonuses.push(value);
    return appliedAbilityModifiers;
  }
  return null;
}

// matching examples
// modifiers.background[].componentId === background.definition.id
// modifiers.background[].componentId === customBackground.id
function componentIdInBackground(character, componentId) {
  return (
    character.background.definition.id === componentId
    || character.background.customBackground.id === componentId
  );
}

// matching examples
// modifiers.class[].componentId === classes[].classFeatures[].definition.id
// modifiers.class[].componentId === classes[].subclassDefinition.classFeatures[].definition.id
function componentIdInClasses(character, componentId) {
  return (
    character.classes.find(
      ({ classFeatures, subclassDefinition }) => (
        classFeatures.find(
          ({ definition: { id } }) => (id === componentId),
        )
        || !!subclassDefinition?.classFeatures.find(
          ({ definition: { id } }) => (id === componentId),
        )
      ),
    )
  );
}

// matching example
// modifiers.feat[].componentId === feats[].definition.id
function componentIdInFeats(character, componentId) {
  return character.feats.find(({ definition: { id } }) => (id === componentId));
}

// matching example
// modifiers.race[].componentId === race.racialTraits[].definition.id
function componentIdInRace(character, componentId) {
  return !!character.race.racialTraits?.find(({ definition: { id } }) => (id === componentId));
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

  // iterate over all modifiers under character.modifiers
  // calculations that use modifiers can be reduced down to these properties
  let activeModifiers = {
    abilityBonus: 0,
    abilitySets: [],
    maxBonuses: [],
  };

  // i assume background, class, feat, race are applied if their componentId is found
  // componentId seems to source the feature/component granting the modifier
  // ??? checking the component tells us to apply the modifier or not
  // i.e. sometimes the component is just a character option, not a modifier in effect
  // https://dndbeyond.com/characters/3 is an example
  // that guy has wisdom-score as an optional modifier, but isn't actually in effect
  // check for componentId last, because they could be an expensive operation

  // componentId matchers
  // modifiers.race[].componentId === race.racialTraits[].definition.id
  // modifiers.class[].componentId === classes[].classFeatures[].definition.id
  // modifiers.class[].componentId === classes[].subclassDefinition.classFeatures[].definition.id
  // modifiers.feat[].componentId === feats[].definition.id

  // ??? do conditions matter for ability score?

  activeModifiers = character.modifiers.background.reduce((currentModifiers, modifier) => {
    const newModifiers = applyAbilityModifiers(currentModifiers, modifier, abilityId);
    if (newModifiers && componentIdInBackground(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.class.reduce((currentModifiers, modifier) => {
    const newModifiers = applyAbilityModifiers(currentModifiers, modifier, abilityId);
    if (newModifiers && componentIdInClasses(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.feat.reduce((currentModifiers, modifier) => {
    const newModifiers = applyAbilityModifiers(currentModifiers, modifier, abilityId);
    if (newModifiers && componentIdInFeats(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.race.reduce((currentModifiers, modifier) => {
    const newModifiers = applyAbilityModifiers(currentModifiers, modifier, abilityId);
    if (newModifiers && componentIdInRace(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  // items have grantedModifiers, but we need to check if they're equipped and attunement rules
  activeModifiers = character.inventory.reduce((currentModifiers, {
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
      const newModifier = applyAbilityModifiers(currentModifiersInner, modifier, abilityId);
      return newModifier ?? currentModifiersInner;
    }, currentModifiers);
  }, activeModifiers);

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
