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

function getTotalLevel({ classes }) {
  return classes.reduce((totalLevel, { level }) => (
    totalLevel + level
  ), 0);
}

export function getLevelDisplay({ classes }) {
  if (!classes.length) {
    return 'Level 0';
  }
  return `Level ${getTotalLevel({ classes })}`;
}

export function getRace({ race }) {
  if (!race) {
    return '';
  }
  return race.fullName || race.baseName;
}

function getProficiencyBonus(character) {
  return Math.floor((getTotalLevel(character) - 1) / 4) + 2;
}

export function getProficiencyBonusDisplay(character) {
  return `+${getProficiencyBonus(character)}`;
}

const STRENGTH_ID = 1;
const DEXTERITY_ID = 2;
const CONSTITUTION_ID = 3;
const INTELLIGENCE_ID = 4;
const WISDOM_ID = 5;
const CHARISMA_ID = 6;
const ABILITY_SCORE_DEFAULT_MAX = 20;
const ABILITY_SCORE_DEFAULT_MIN = 0;

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
          ({ id }) => (id === componentId),
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

// unsure if we need this
// function componentIdInConditions(character, componentId) {
//   return character.conditions.find({ id } => (id === componentId));
// }

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
  // don't go below 0 for ability scores
  abilityScore = Math.max(abilityScore, ABILITY_SCORE_DEFAULT_MIN);
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

function calculateModifier(abilityScore) {
  return Math.floor(abilityScore / 2) - 5;
}

function addSignDisplay(modifier) {
  if (modifier < 0) {
    // a negative number already has a -
    return `${modifier}`;
  }
  return `+${modifier}`;
}

function getStrengthModifier(character) {
  return calculateModifier(getStrengthAbilityScore(character));
}

function getDexterityModifier(character) {
  return calculateModifier(getDexterityAbilityScore(character));
}

function getConstitutionModifier(character) {
  return calculateModifier(getConstitutionAbilityScore(character));
}

function getIntelligenceModifier(character) {
  return calculateModifier(getIntelligenceAbilityScore(character));
}

function getWisdomModifier(character) {
  return calculateModifier(getWisdomAbilityScore(character));
}

function getCharismaModifier(character) {
  return calculateModifier(getCharismaAbilityScore(character));
}

export function getStrengthModifierDisplay(character) {
  return addSignDisplay(getStrengthModifier(character));
}

export function getDexterityModifierDisplay(character) {
  return addSignDisplay(getDexterityModifier(character));
}

export function getConstitutionModifierDisplay(character) {
  return addSignDisplay(getConstitutionModifier(character));
}

export function getIntelligenceModifierDisplay(character) {
  return addSignDisplay(getIntelligenceModifier(character));
}

export function getWisdomModifierDisplay(character) {
  return addSignDisplay(getWisdomModifier(character));
}

export function getCharismaModifierDisplay(character) {
  return addSignDisplay(getCharismaModifier(character));
}

const PROFICIENCY = 'proficiency';
const HALF_PROFICIENCY = 'half-proficiency';
const HALF_PROFICIENCY_ROUND_UP = 'half-proficiency-round-up';
const EXPERTISE = 'expertise';

const PROFICIENCIES = [
  HALF_PROFICIENCY,
  HALF_PROFICIENCY_ROUND_UP,
  PROFICIENCY,
  EXPERTISE,
];

function applyProficiencies(modifiers, { subType, type }, skill) {
  if (
    PROFICIENCIES.includes(type) && (subType === skill || subType === 'ability-checks')
  ) {
    const newProficiencies = new Set(modifiers);
    newProficiencies.add(type);
    return newProficiencies;
  }
  return null;
}

function getSkillProficiencyModifier(character, skill) {
  let proficiencies = character.modifiers.background.reduce((currentProficiencies, modifier) => {
    const newProficiencies = applyProficiencies(currentProficiencies, modifier, skill);
    if (newProficiencies && componentIdInBackground(character, modifier.componentId)) {
      return newProficiencies;
    }
    return currentProficiencies;
  }, new Set());

  proficiencies = character.modifiers.class.reduce((currentProficiencies, modifier) => {
    const newProficiencies = applyProficiencies(currentProficiencies, modifier, skill);
    if (newProficiencies && componentIdInClasses(character, modifier.componentId)) {
      return newProficiencies;
    }
    return currentProficiencies;
  }, proficiencies);

  proficiencies = character.modifiers.feat.reduce((currentProficiencies, modifier) => {
    const newProficiencies = applyProficiencies(currentProficiencies, modifier, skill);
    if (newProficiencies && componentIdInFeats(character, modifier.componentId)) {
      return newProficiencies;
    }
    return currentProficiencies;
  }, proficiencies);

  proficiencies = character.modifiers.race.reduce((currentProficiencies, modifier) => {
    const newProficiencies = applyProficiencies(currentProficiencies, modifier, skill);
    if (newProficiencies && componentIdInRace(character, modifier.componentId)) {
      return newProficiencies;
    }
    return currentProficiencies;
  }, proficiencies);

  const proficiencyBonus = getProficiencyBonus(character);
  let proficiencyModifier = 0;

  proficiencies.forEach((proficiency) => {
    switch (proficiency) {
      case HALF_PROFICIENCY:
        proficiencyModifier = Math.max(
          proficiencyModifier, Math.floor(proficiencyBonus / 2),
        );
        break;
      case HALF_PROFICIENCY_ROUND_UP:
        proficiencyModifier = Math.max(
          proficiencyModifier, Math.ceil(proficiencyBonus / 2),
        );
        break;
      case PROFICIENCY:
        proficiencyModifier = Math.max(proficiencyModifier, proficiencyBonus);
        break;
      case EXPERTISE: {
        const expertiseBonus = proficiencies.has(
          PROFICIENCY,
        ) ? proficiencyBonus * 2 : proficiencyBonus;
        proficiencyModifier = Math.max(
          proficiencyModifier, expertiseBonus,
        );
        break;
      }
      default:
        throw new Error('Found unknown proficiency!');
    }
  });

  return proficiencyModifier;
}

function getInitiativeModifier(character) {
  return getSkillProficiencyModifier(character, 'initiative') + getDexterityModifier(character);
}

export function getInitiativeModifierDisplay(character) {
  return addSignDisplay(getInitiativeModifier(character));
}

function getAcrobaticsModifier(character) {
  return getSkillProficiencyModifier(character, 'acrobatics') + getDexterityModifier(character);
}

export function getAcrobaticsModifierDisplay(character) {
  return addSignDisplay(getAcrobaticsModifier(character));
}

function getAnimalHandlingModifier(character) {
  return getSkillProficiencyModifier(character, 'animal-handling') + getWisdomModifier(character);
}

export function getAnimalHandlingModifierDisplay(character) {
  return addSignDisplay(getAnimalHandlingModifier(character));
}

function getArcanaModifier(character) {
  return getSkillProficiencyModifier(character, 'arcana') + getIntelligenceModifier(character);
}

export function getArcanaModifierDisplay(character) {
  return addSignDisplay(getArcanaModifier(character));
}

function getAthleticsModifier(character) {
  return getSkillProficiencyModifier(character, 'athletics') + getStrengthModifier(character);
}

export function getAthleticsModifierDisplay(character) {
  return addSignDisplay(getAthleticsModifier(character));
}

function getDeceptionModifier(character) {
  return getSkillProficiencyModifier(character, 'deception') + getCharismaModifier(character);
}

export function getDeceptionModifierDisplay(character) {
  return addSignDisplay(getDeceptionModifier(character));
}

function getHistoryModifier(character) {
  return getSkillProficiencyModifier(character, 'history') + getIntelligenceModifier(character);
}

export function getHistoryModifierDisplay(character) {
  return addSignDisplay(getHistoryModifier(character));
}

function getInsightModifier(character) {
  return getSkillProficiencyModifier(character, 'insight') + getWisdomModifier(character);
}

export function getInsightModifierDisplay(character) {
  return addSignDisplay(getInsightModifier(character));
}

function getIntimidationModifier(character) {
  return getSkillProficiencyModifier(character, 'intimidation') + getCharismaModifier(character);
}

export function getIntimidationModifierDisplay(character) {
  return addSignDisplay(getIntimidationModifier(character));
}

function getInvestigationModifier(character) {
  return getSkillProficiencyModifier(character, 'investigation') + getIntelligenceModifier(character);
}

export function getInvestigationModifierDisplay(character) {
  return addSignDisplay(getInvestigationModifier(character));
}

function getMedicineModifier(character) {
  return getSkillProficiencyModifier(character, 'medicine') + getWisdomModifier(character);
}

export function getMedicineModifierDisplay(character) {
  return addSignDisplay(getMedicineModifier(character));
}

function getNatureModifier(character) {
  return getSkillProficiencyModifier(character, 'nature') + getIntelligenceModifier(character);
}

export function getNatureModifierDisplay(character) {
  return addSignDisplay(getNatureModifier(character));
}

function getPerceptionModifier(character) {
  return getSkillProficiencyModifier(character, 'perception') + getWisdomModifier(character);
}

export function getPerceptionModifierDisplay(character) {
  return addSignDisplay(getPerceptionModifier(character));
}

function getPerformanceModifier(character) {
  return getSkillProficiencyModifier(character, 'performance') + getCharismaModifier(character);
}

export function getPerformanceModifierDisplay(character) {
  return addSignDisplay(getPerformanceModifier(character));
}

function getPersuasionModifier(character) {
  return getSkillProficiencyModifier(character, 'persuasion') + getCharismaModifier(character);
}

export function getPersuasionModifierDisplay(character) {
  return addSignDisplay(getPersuasionModifier(character));
}

function getReligionModifier(character) {
  return getSkillProficiencyModifier(character, 'religion') + getIntelligenceModifier(character);
}

export function getReligionModifierDisplay(character) {
  return addSignDisplay(getReligionModifier(character));
}

function getSleightOfHandModifier(character) {
  return getSkillProficiencyModifier(character, 'sleight-of-hand') + getDexterityModifier(character);
}

export function getSleightOfHandModifierDisplay(character) {
  return addSignDisplay(getSleightOfHandModifier(character));
}

function getStealthModifier(character) {
  return getSkillProficiencyModifier(character, 'stealth') + getDexterityModifier(character);
}

export function getStealthModifierDisplay(character) {
  return addSignDisplay(getStealthModifier(character));
}

function getSurvivalModifier(character) {
  return getSkillProficiencyModifier(character, 'survival') + getWisdomModifier(character);
}

export function getSurvivalModifierDisplay(character) {
  return addSignDisplay(getSurvivalModifier(character));
}

// functions very similarly to applyAbilityModifiers, but without maxes
function applyPassiveModifiers(modifiers, { subType, type, value }, skill) {
  const appliedAbilityModifiers = { ...modifiers };
  // ??? handle restricted bonuses
  if (subType === skill && type === 'bonus') {
    appliedAbilityModifiers.passiveBonus += value;
    return appliedAbilityModifiers;
  }
  if (subType === skill && type === 'set') {
    appliedAbilityModifiers.passiveSets.push(value);
    return appliedAbilityModifiers;
  }
  return null;
}

// functions very similarly to ability score, but applies modifiers to the baseScore number
function applyPassiveBonus(character, baseScore, skill) {
  let passiveScore = baseScore;

  let activeModifiers = {
    passiveBonus: 0,
    passiveSets: [],
  };

  activeModifiers = character.modifiers.background.reduce((currentModifiers, modifier) => {
    const newModifiers = applyPassiveModifiers(currentModifiers, modifier, skill);
    if (newModifiers && componentIdInBackground(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.class.reduce((currentModifiers, modifier) => {
    const newModifiers = applyPassiveModifiers(currentModifiers, modifier, skill);
    if (newModifiers && componentIdInClasses(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.feat.reduce((currentModifiers, modifier) => {
    const newModifiers = applyPassiveModifiers(currentModifiers, modifier, skill);
    if (newModifiers && componentIdInFeats(character, modifier.componentId)) {
      return newModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.race.reduce((currentModifiers, modifier) => {
    const newModifiers = applyPassiveModifiers(currentModifiers, modifier, skill);
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
      const newModifier = applyPassiveModifiers(currentModifiersInner, modifier, skill);
      return newModifier ?? currentModifiersInner;
    }, currentModifiers);
  }, activeModifiers);

  const {
    passiveBonus,
    passiveSets,
  } = activeModifiers;

  // add all the bonuses we've found
  passiveScore += passiveBonus;
  // there can be modifiers that directly set the passive score
  // check if any output a better stat than the calculated score
  passiveSets.forEach((passiveSet) => {
    passiveScore = Math.max(passiveScore, passiveSet);
  });

  return passiveScore;
}

// passive scores are 10 + skill modifier + any bonuses
export function getPassivePerception(character) {
  return applyPassiveBonus(character, 10 + getPerceptionModifier(character), 'passive-perception');
}

export function getPassiveInvestigation(character) {
  return applyPassiveBonus(character, 10 + getInvestigationModifier(character), 'passive-investigation');
}

export function getPassiveInsight(character) {
  return applyPassiveBonus(character, 10 + getInsightModifier(character), 'passive-insight');
}
