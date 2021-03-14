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

// can return '' (newbie), 'race', 'race class'
export function getRaceClassDisplay(character) {
  const raceDisplay = getRace(character);
  const { classes } = character;
  // either no race and no class or only race
  if (!classes.length) {
    return raceDisplay;
  }
  const startingClassIndex = classes.findIndex(({ isStartingClass }) => isStartingClass);
  const startingClassDisplay = `${classes[startingClassIndex].definition.name}`;
  // no race and only class
  if (!raceDisplay) {
    return `${startingClassDisplay}`;
  }
  return `${raceDisplay} ${startingClassDisplay}`;
}

// matching examples
// modifiers.background[].componentId === background.definition.id
// modifiers.background[].componentId === customBackground.id
// modifiers.background[].componentId === choices.background[].optionValue
function componentIdInBackground(character, componentId) {
  return (
    character.background.definition?.id === componentId
    || character.background.customBackground.id === componentId
    || character.choices.background.find(({ optionValue }) => (optionValue === componentId))
  );
}

// matching examples
// modifiers.class[].componentId === classes[].classFeatures[].definition.id
// modifiers.class[].componentId === classes[].subclassDefinition.classFeatures[].definition.id
// modifiers.class[].componentId === optionalClassFeatures[].classFeatureId
// modifiers.class[].componentId === choices.class[].optionValue
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
    || character.optionalClassFeatures.find(
      ({ classFeatureId }) => (classFeatureId === componentId),
    )
    || character.choices.class.find(({ optionValue }) => (optionValue === componentId))
  );
}

// matching example
// modifiers.feat[].componentId === feats[].definition.id
// modifiers.feat[].componentId === choices.feat[].optionValue
function componentIdInFeats(character, componentId) {
  return (
    character.feats.find(({ definition: { id } }) => (id === componentId))
    || character.choices.feat.find(({ optionValue }) => (optionValue === componentId))
  );
}

// unsure if we need this
// function componentIdInConditions(character, componentId) {
//   return character.conditions.find({ id } => (id === componentId));
// }

// matching example
// modifiers.race[].componentId === race.racialTraits[].definition.id
// modifiers.race[].componentId === optionalOrigins[].racialTraitId
// modifiers.feat[].componentId === choices.race[].optionValue
function componentIdInRace(character, componentId) {
  return (
    !!character.race.racialTraits?.find(({ definition: { id } }) => (id === componentId))
    || character.optionalOrigins.find(({ racialTraitId }) => (racialTraitId === componentId))
    || character.choices.race.find(({ optionValue }) => (optionValue === componentId))
  );
}

// background, class, feat, race (basically not items)
// separated out items cause some calcs might want to calculate them specifically
// applyModifier must accept the object shape used below
// applyModifiers must return a new copy of modifiers or null if it was not actually applied
function applyStaticModifiers(character, modifiers, applyModifier, match) {
  let activeModifiers = { ...modifiers };

  // i assume background, class, feat, race are applied if their componentId is found
  // componentId seems to source the feature/component granting the modifier
  // ??? checking the component tells us to apply the modifier or not
  // i.e. sometimes the component is just a character option, not a modifier in effect
  // https://dndbeyond.com/characters/3 is an example
  // that guy has wisdom-score as an optional modifier, but isn't actually in effect
  // check for componentId last, because they could be an expensive operation

  // ??? do conditions matter for ability score?
  activeModifiers = character.modifiers.background.reduce((currentModifiers, modifier) => {
    const appliedModifiers = applyModifier({
      character,
      match,
      modifiers: currentModifiers,
      modifier,
    });
    if (appliedModifiers && componentIdInBackground(character, modifier.componentId)) {
      return appliedModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.class.reduce((currentModifiers, modifier) => {
    const appliedModifiers = applyModifier({
      character,
      match,
      modifiers: currentModifiers,
      modifier,
    });
    if (appliedModifiers && componentIdInClasses(character, modifier.componentId)) {
      return appliedModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.feat.reduce((currentModifiers, modifier) => {
    const appliedModifiers = applyModifier({
      character,
      match,
      modifiers: currentModifiers,
      modifier,
    });
    if (appliedModifiers && componentIdInFeats(character, modifier.componentId)) {
      return appliedModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  activeModifiers = character.modifiers.race.reduce((currentModifiers, modifier) => {
    const appliedModifiers = applyModifier({
      character,
      match,
      modifiers: currentModifiers,
      modifier,
    });
    if (appliedModifiers && componentIdInRace(character, modifier.componentId)) {
      return appliedModifiers;
    }
    return currentModifiers;
  }, activeModifiers);

  return activeModifiers;
}

// includes item modifiers, since most calcs check them the same way
function applyModifiers(character, modifiers, applyModifier, match) {
  let activeModifiers = applyStaticModifiers(character, modifiers, applyModifier, match);

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
      const appliedModifiers = applyModifier({
        character,
        match,
        modifiers: currentModifiersInner,
        modifier,
      });
      return appliedModifiers ?? currentModifiersInner;
    }, currentModifiers);
  }, activeModifiers);

  return activeModifiers;
}

// stuff like ioun stone of mastery increases proficiency bonus
function applyProficiencyBonusModifier({
  match,
  modifiers,
  modifier: {
    subType, type, value,
  },
}) {
  const appliedAbilityModifiers = { ...modifiers };
  if (subType === match && type === 'bonus') {
    appliedAbilityModifiers.bonus += value;
    return appliedAbilityModifiers;
  }
  return null;
}

function getProficiencyBonus(character) {
  let proficiencyBonus = Math.floor((getTotalLevel(character) - 1) / 4) + 2;

  let activeModifiers = {
    bonus: 0,
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyProficiencyBonusModifier, 'proficiency-bonus');

  const {
    bonus,
  } = activeModifiers;

  proficiencyBonus += bonus;
  return proficiencyBonus;
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

function applyAbilityModifiers({
  match,
  modifiers,
  modifier: {
    entityId, statId, type, value,
  },
}) {
  const appliedAbilityModifiers = { ...modifiers };
  // ??? handle restricted bonuses
  if (entityId === match && type === 'bonus') {
    appliedAbilityModifiers.abilityBonus += value;
    return appliedAbilityModifiers;
  }
  if (entityId === match && type === 'set') {
    appliedAbilityModifiers.abilitySets.push(value);
    return appliedAbilityModifiers;
  }
  if (statId === match && type === 'bonus') {
    appliedAbilityModifiers.maxBonuses.push(value);
    return appliedAbilityModifiers;
  }
  return null;
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

  activeModifiers = applyModifiers(character, activeModifiers, applyAbilityModifiers, abilityId);

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

function getAbilityScoreModifierById(character, abilityId) {
  return calculateModifier(getAbilityScore(character, abilityId));
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

const SKILL_TYPE_ID = 1958004211;
const ACROBATICS_ID = 3;
const ANIMAL_HANDLING_ID = 11;
const ARCANA_ID = 6;
const ATHLETICS_ID = 2;
const DECEPTION_ID = 16;
const HISTORY_ID = 7;
const INSIGHT_ID = 12;
const INVESTIGATION_ID = 8;
const INTIMIDATION_ID = 17;
const MEDICINE_ID = 13;
const NATURE_ID = 9;
const PERCEPTION_ID = 14;
const PERFORMANCE_ID = 18;
const PERSUASION_ID = 19;
const RELIGION_ID = 10;
const SLEIGHT_OF_HAND_ID = 4;
const STEALTH_ID = 5;
const SURVIVAL_ID = 15;

const DEFAULT_SKILL_STAT_ID = {
  [ACROBATICS_ID]: DEXTERITY_ID,
  [ANIMAL_HANDLING_ID]: WISDOM_ID,
  [ARCANA_ID]: INTELLIGENCE_ID,
  [ATHLETICS_ID]: STRENGTH_ID,
  [DECEPTION_ID]: CHARISMA_ID,
  [HISTORY_ID]: INTELLIGENCE_ID,
  [INSIGHT_ID]: WISDOM_ID,
  [INVESTIGATION_ID]: INTELLIGENCE_ID,
  [INTIMIDATION_ID]: CHARISMA_ID,
  [MEDICINE_ID]: WISDOM_ID,
  [NATURE_ID]: INTELLIGENCE_ID,
  [PERCEPTION_ID]: WISDOM_ID,
  [PERFORMANCE_ID]: CHARISMA_ID,
  [PERSUASION_ID]: CHARISMA_ID,
  [RELIGION_ID]: INTELLIGENCE_ID,
  [SLEIGHT_OF_HAND_ID]: DEXTERITY_ID,
  [STEALTH_ID]: DEXTERITY_ID,
  [SURVIVAL_ID]: WISDOM_ID,
};

const CHARACTER_VALUE_SKILL_OVERRIDE = 23;
const CHARACTER_VALUE_SKILL_STAT_OVERRIDE = 27;
const CHARACTER_VALUE_SKILL_MAGIC_BONUS = 25;
const CHARACTER_VALUE_SKILL_MISC_BONUS = 24;
const CHARACTER_VALUE_SKILL_PROFICIENCY_LEVEL = 26;

function getCharacterValueSkillValue(character, matchId, skillId) {
  return character.characterValues.find(({ valueId, typeId }) => (
    matchId === typeId
    && skillId === parseInt(valueId, 10)
  ))?.value ?? null;
}

function getCharacterValueSkillOverride(character, skillId) {
  return getCharacterValueSkillValue(character, CHARACTER_VALUE_SKILL_OVERRIDE, skillId);
}

function getCharacterValueSkillStatOverride(character, skillId) {
  return getCharacterValueSkillValue(character, CHARACTER_VALUE_SKILL_STAT_OVERRIDE, skillId);
}

function getCharacterValueSkillMagicBonus(character, skillId) {
  return getCharacterValueSkillValue(character, CHARACTER_VALUE_SKILL_MAGIC_BONUS, skillId);
}

function getCharacterValueSkillMiscBonus(character, skillId) {
  return getCharacterValueSkillValue(character, CHARACTER_VALUE_SKILL_MISC_BONUS, skillId);
}

// unused
// const NO_PROFICIENCY_ID = 1;
const HALF_PROFICIENCY_ID = 2;
const PROFICIENCY_ID = 3;
const EXPERTISE_ID = 4;

function getCharacterValueSkillProficiencyLevel(character, skillId) {
  return getCharacterValueSkillValue(character, CHARACTER_VALUE_SKILL_PROFICIENCY_LEVEL, skillId);
}

function getSkillAbilityId(character, skillId) {
  let skillAbilityId = getCharacterValueSkillStatOverride(character, skillId);
  if (!skillAbilityId) {
    skillAbilityId = DEFAULT_SKILL_STAT_ID[skillId];
  }
  return skillAbilityId;
}

const ABILITY_NAME = {
  [STRENGTH_ID]: 'strength',
  [DEXTERITY_ID]: 'dexterity',
  [CONSTITUTION_ID]: 'constitution',
  [INTELLIGENCE_ID]: 'intelligence',
  [WISDOM_ID]: 'wisdom',
  [CHARISMA_ID]: 'charisma',
};

function getSkillAbilityName(character, skillId) {
  const abilityId = getSkillAbilityId(character, skillId);
  return ABILITY_NAME[abilityId];
}

function getProficienciesFromId(proficiencyId) {
  const proficiencies = new Set();
  switch (proficiencyId) {
    case HALF_PROFICIENCY_ID:
      proficiencies.add(HALF_PROFICIENCY);
      break;
    case PROFICIENCY_ID:
      proficiencies.add(PROFICIENCY);
      break;
    case EXPERTISE_ID:
      proficiencies.add(PROFICIENCY);
      proficiencies.add(EXPERTISE);
      break;
    default:
  }
  return proficiencies;
}

function applySkillModifier({
  character,
  match,
  modifiers,
  modifier: {
    entityId, entityTypeId, statId, subType, type,
  },
}) {
  const appliedModifiers = { ...modifiers };
  // stuff like charisma-ability-checks
  const skillAbilityChecks = `${getSkillAbilityName(character, match)}-ability-checks`;
  if (
    PROFICIENCIES.includes(type)
    && (
      (entityId === match && entityTypeId === SKILL_TYPE_ID)
      || subType === 'ability-checks'
      || subType === skillAbilityChecks
    )
  ) {
    const newProficiencies = new Set(modifiers.proficiencies);
    newProficiencies.add(type);
    appliedModifiers.proficiencies = newProficiencies;
    return appliedModifiers;
  }
  if (
    (subType === 'ability-checks' || subType === skillAbilityChecks)
    && type === 'bonus'
    && statId
  ) {
    appliedModifiers.bonus += getAbilityScoreModifierById(character, statId);
    return appliedModifiers;
  }
  return null;
}

function getBestProficiencyModifier(character, proficiencies) {
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

function getSkillModifier(character, skillId) {
  const overrideValue = getCharacterValueSkillOverride(character, skillId);
  if (overrideValue !== null) {
    return overrideValue;
  }
  const abilityId = getSkillAbilityId(character, skillId);

  let activeModifiers = {
    bonus: 0,
    proficiencies: new Set(),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applySkillModifier, skillId);

  const { bonus, proficiencies } = activeModifiers;

  let skillModifier = 0;
  const manualProficiencyId = getCharacterValueSkillProficiencyLevel(character, skillId);
  if (manualProficiencyId) {
    skillModifier += getBestProficiencyModifier(
      character, getProficienciesFromId(manualProficiencyId),
    );
  } else {
    skillModifier += getBestProficiencyModifier(
      character, proficiencies,
    );
  }

  skillModifier += bonus;
  skillModifier += getAbilityScoreModifierById(character, abilityId);
  skillModifier += getCharacterValueSkillMagicBonus(character, skillId) ?? 0;
  skillModifier += getCharacterValueSkillMiscBonus(character, skillId) ?? 0;
  return skillModifier;
}

function getAcrobaticsModifier(character) {
  return getSkillModifier(character, ACROBATICS_ID);
}

export function getAcrobaticsModifierDisplay(character) {
  return addSignDisplay(getAcrobaticsModifier(character));
}

function getAnimalHandlingModifier(character) {
  return getSkillModifier(character, ANIMAL_HANDLING_ID);
}

export function getAnimalHandlingModifierDisplay(character) {
  return addSignDisplay(getAnimalHandlingModifier(character));
}

function getArcanaModifier(character) {
  return getSkillModifier(character, ARCANA_ID);
}

export function getArcanaModifierDisplay(character) {
  return addSignDisplay(getArcanaModifier(character));
}

function getAthleticsModifier(character) {
  return getSkillModifier(character, ATHLETICS_ID);
}

export function getAthleticsModifierDisplay(character) {
  return addSignDisplay(getAthleticsModifier(character));
}

function getDeceptionModifier(character) {
  return getSkillModifier(character, DECEPTION_ID);
}

export function getDeceptionModifierDisplay(character) {
  return addSignDisplay(getDeceptionModifier(character));
}

function getHistoryModifier(character) {
  return getSkillModifier(character, HISTORY_ID);
}

export function getHistoryModifierDisplay(character) {
  return addSignDisplay(getHistoryModifier(character));
}

function getInsightModifier(character) {
  return getSkillModifier(character, INSIGHT_ID);
}

export function getInsightModifierDisplay(character) {
  return addSignDisplay(getInsightModifier(character));
}

function getIntimidationModifier(character) {
  return getSkillModifier(character, INTIMIDATION_ID);
}

export function getIntimidationModifierDisplay(character) {
  return addSignDisplay(getIntimidationModifier(character));
}

function getInvestigationModifier(character) {
  return getSkillModifier(character, INVESTIGATION_ID);
}

export function getInvestigationModifierDisplay(character) {
  return addSignDisplay(getInvestigationModifier(character));
}

function getMedicineModifier(character) {
  return getSkillModifier(character, MEDICINE_ID);
}

export function getMedicineModifierDisplay(character) {
  return addSignDisplay(getMedicineModifier(character));
}

function getNatureModifier(character) {
  return getSkillModifier(character, NATURE_ID);
}

export function getNatureModifierDisplay(character) {
  return addSignDisplay(getNatureModifier(character));
}

function getPerceptionModifier(character) {
  return getSkillModifier(character, PERCEPTION_ID);
}

export function getPerceptionModifierDisplay(character) {
  return addSignDisplay(getPerceptionModifier(character));
}

function getPerformanceModifier(character) {
  return getSkillModifier(character, PERFORMANCE_ID);
}

export function getPerformanceModifierDisplay(character) {
  return addSignDisplay(getPerformanceModifier(character));
}

function getPersuasionModifier(character) {
  return getSkillModifier(character, PERSUASION_ID);
}

export function getPersuasionModifierDisplay(character) {
  return addSignDisplay(getPersuasionModifier(character));
}

function getReligionModifier(character) {
  return getSkillModifier(character, RELIGION_ID);
}

export function getReligionModifierDisplay(character) {
  return addSignDisplay(getReligionModifier(character));
}

function getSleightOfHandModifier(character) {
  return getSkillModifier(character, SLEIGHT_OF_HAND_ID);
}

export function getSleightOfHandModifierDisplay(character) {
  return addSignDisplay(getSleightOfHandModifier(character));
}

function getStealthModifier(character) {
  return getSkillModifier(character, STEALTH_ID);
}

export function getStealthModifierDisplay(character) {
  return addSignDisplay(getStealthModifier(character));
}

function getSurvivalModifier(character) {
  return getSkillModifier(character, SURVIVAL_ID);
}

export function getSurvivalModifierDisplay(character) {
  return addSignDisplay(getSurvivalModifier(character));
}

function applyInitiativeModifiers({
  match,
  modifiers,
  modifier: {
    subType, type, value,
  },
}) {
  const appliedModifiers = { ...modifiers };
  if ((subType === match || subType === 'ability-checks') && type === 'bonus') {
    appliedModifiers.bonus += value;
    return appliedModifiers;
  }
  if (subType === match && type === 'set') {
    appliedModifiers.sets.push(value);
    return appliedModifiers;
  }
  if (
    PROFICIENCIES.includes(type)
    && (
      (subType === match)
      || subType === 'ability-checks'
    )
  ) {
    const newProficiencies = new Set(appliedModifiers.proficiencies);
    newProficiencies.add(type);
    appliedModifiers.proficiencies = newProficiencies;
    return appliedModifiers;
  }
  return null;
}

function getInitiativeModifier(character) {
  let activeModifiers = {
    bonus: 0,
    proficiencies: new Set(),
    sets: [],
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyInitiativeModifiers, 'initiative');

  const { bonus, proficiencies, sets } = activeModifiers;

  let initiative = getDexterityModifier(character);
  initiative += bonus;
  initiative += getBestProficiencyModifier(character, proficiencies);
  sets.forEach((set) => (
    Math.max(initiative, set)
  ));

  return initiative;
}

export function getInitiativeModifierDisplay(character) {
  return addSignDisplay(getInitiativeModifier(character));
}

const CHARACTER_VALUE_OVERRIDE_PASSIVE_PERCEPTION = 5;
const CHARACTER_VALUE_OVERRIDE_PASSIVE_INVESTIGATION = 6;
const CHARACTER_VALUE_OVERRIDE_PASSIVE_INSIGHT = 7;

const CHARACTER_VALUE_OVERRIDE_AC_ID = 1;
const CHARACTER_VALUE_OVERRIDE_BASE_ARMOR_DEX_ID = 4;
const CHARACTER_VALUE_ADDITIONAL_MAGIC_BONUS_ID = 2;
const CHARACTER_VALUE_ADDITIONAL_MISC_BONUS_ID = 3;
const CHARACTER_VALUE_DUAL_WIELD_ID = 18;

// gets manually set values under characterValues
function getCharacterValueByTypeId(character, matchId) {
  return character.characterValues.find(({ typeId }) => (
    typeId === matchId
  ))?.value ?? null;
}

// functions very similarly to applyAbilityModifiers, but without maxes
function applyPassiveModifiers({
  match,
  modifiers,
  modifier: { subType, type, value },
}) {
  const appliedAbilityModifiers = { ...modifiers };
  // ??? handle restricted bonuses
  if (subType === match && type === 'bonus') {
    appliedAbilityModifiers.passiveBonus += value;
    return appliedAbilityModifiers;
  }
  if (subType === match && type === 'set') {
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

  activeModifiers = applyModifiers(character, activeModifiers, applyPassiveModifiers, skill);

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
  const overrideValue = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_OVERRIDE_PASSIVE_PERCEPTION,
  );
  if (overrideValue !== null) {
    return overrideValue;
  }
  return applyPassiveBonus(character, 10 + getPerceptionModifier(character), 'passive-perception');
}

export function getPassiveInvestigation(character) {
  const overrideValue = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_OVERRIDE_PASSIVE_INVESTIGATION,
  );
  if (overrideValue !== null) {
    return overrideValue;
  }
  return applyPassiveBonus(character, 10 + getInvestigationModifier(character), 'passive-investigation');
}

export function getPassiveInsight(character) {
  const overrideValue = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_OVERRIDE_PASSIVE_INSIGHT,
  );
  if (overrideValue !== null) {
    return overrideValue;
  }
  return applyPassiveBonus(character, 10 + getInsightModifier(character), 'passive-insight');
}

// need these ids, since the friendly type string may not appear for custom items
const LIGHT_ARMOR_ID = 1;
const MEDIUM_ARMOR_ID = 2;
const HEAVY_ARMOR_ID = 3;
const SHIELD_ID = 4;

// for stuff like tortle natural armor
function applyMaxDexterityModifierByComponent({
  match,
  modifiers,
  modifier: {
    componentId, subType, type, value,
  },
}) {
  const appliedModifiers = { ...modifiers };
  if (componentId === match && subType === 'ac-max-dex-modifier' && type === 'set') {
    appliedModifiers.maxDexModifier = value;
    return appliedModifiers;
  }
  return null;
}

function getMaxDexterityModifierByComponent(character, componentId) {
  let activeModifiers = {
    maxDexModifier: null,
  };

  activeModifiers = applyModifiers(
    character, activeModifiers, applyMaxDexterityModifierByComponent, componentId,
  );

  const { maxDexModifier } = activeModifiers;

  return maxDexModifier;
}

// accounts for dex modifier max, which is a thing apparently
function getDexterityModifierByComponent(character, componentId) {
  const maxDexModifier = getMaxDexterityModifierByComponent(character, componentId);
  if (maxDexModifier !== null) {
    return Math.min(getDexterityModifier(character), maxDexModifier);
  }
  return getDexterityModifier(character);
}

function applyArmorClassModifiers({
  character,
  modifiers,
  modifier: {
    componentId, subType, statId, type, value,
  },
}) {
  const appliedArmorClassModifiers = { ...modifiers };
  // barbarian/monk adds dexterity + another set modifier
  // note barbarian's ability adds any shield bonuses, but monks do not
  // however, dndbeyond adds monk shield bonuses anyways, so we'll just roll with that
  if (subType === 'unarmored-armor-class' && type === 'set' && statId) {
    appliedArmorClassModifiers.unarmoredBonusSets.push(
      getDexterityModifierByComponent(character, componentId)
      + getAbilityScoreModifierById(character, statId),
    );
    return appliedArmorClassModifiers;
  }
  // draconic sorcerer adds dexterity + some bonus
  // draconic sorcerer won't have a statId, it will just have some value
  if (subType === 'unarmored-armor-class' && type === 'set' && value) {
    appliedArmorClassModifiers.unarmoredBonusSets.push(
      getDexterityModifierByComponent(character, componentId) + value,
    );
    return appliedArmorClassModifiers;
  }
  // unsure if this situation happens, but mirror armored-armor-class bonus
  if (subType === 'unarmored-armor-class' && type === 'bonus') {
    appliedArmorClassModifiers.unarmoredBonus += value;
    return appliedArmorClassModifiers;
  }
  // ??? i don't think armored-armor-class sets exist, if it does, integrate it
  // if (subType === 'armored-armor-class' && type === 'set') {
  // this can happen with defense fighting style
  if (subType === 'armored-armor-class' && type === 'bonus') {
    appliedArmorClassModifiers.armoredBonus += value;
    return appliedArmorClassModifiers;
  }
  // for medium armor master feat
  if (subType === 'ac-max-dex-armored-modifier' && type === 'set') {
    appliedArmorClassModifiers.mediumArmorMaxDexterityBonus = Math.max(
      value, appliedArmorClassModifiers.mediumArmorMaxDexterityBonus,
    );
    return appliedArmorClassModifiers;
  }
  // the dual wield feat looks like this
  if (subType === 'dual-wield-armor-class' && type === 'bonus') {
    appliedArmorClassModifiers.dualWieldBonus += value;
    return appliedArmorClassModifiers;
  }
  // any catch all, like magic items
  if (subType === 'armor-class' && type === 'bonus') {
    appliedArmorClassModifiers.bonus += value;
    return appliedArmorClassModifiers;
  }
  return null;
}

function getArmorClassGrantedModifiersBonus({
  // logic checks that we are already equipped here
  isAttuned,
  definition: {
    requiresAttunement, grantedModifiers,
  },
}) {
  return grantedModifiers.reduce((bonus, {
    subType, type, value,
  }) => {
    if (requiresAttunement && !isAttuned) {
      return bonus;
    }
    // hard check 'armor-class' instead of includes like the above
    // ??? i think just reduce 'armor-class' to check how much innate AC the armor provides
    // we want to tie +1's, etc. to this particular armor's armor class
    // +1's don't all sum up if you wear many +1 of the same armor
    // but you can wear many cold/acid/etc. resistances of armor and they all appear on dndbeyond
    if (subType === 'armor-class' && type === 'bonus') {
      return bonus + value;
    }
    return bonus;
  }, 0);
}

function applyArmorClassItem(character, modifiers, item) {
  const { equipped } = item;
  // ??? an item only matters if they're equipped
  if (!equipped) {
    return modifiers;
  }
  const {
    isAttuned,
    definition: {
      armorClass, armorTypeId, grantedModifiers,
    },
  } = item;

  const newModifiers = { ...modifiers };
  const {
    bestLightArmorAC,
    bestMediumArmorAC,
    bestHeavyArmorAC,
    bestShieldAC,
  } = newModifiers;
  // armor and shields have special rules
  // dndbeyond seems to use the best ac calculated from whatever armor combo equipped
  // so, find the selected armor with the best calculated AC by category for calculations later
  // armors could have bonuses (+1s, +2s, etc.) that only contribute if it's the 'selected' armor
  // associate those bonuses with the armor AC itself, not as a global bonus/effect
  switch (armorTypeId) {
    case LIGHT_ARMOR_ID:
      newModifiers.bestLightArmorAC = Math.max(
        bestLightArmorAC, armorClass + getArmorClassGrantedModifiersBonus(item),
      );
      newModifiers.armorEquipped = true;
      return newModifiers;
    case MEDIUM_ARMOR_ID:
      newModifiers.bestMediumArmorAC = Math.max(
        bestMediumArmorAC, armorClass + getArmorClassGrantedModifiersBonus(item),
      );
      newModifiers.armorEquipped = true;
      return newModifiers;
    case HEAVY_ARMOR_ID:
      newModifiers.bestHeavyArmorAC = Math.max(
        bestHeavyArmorAC, armorClass + getArmorClassGrantedModifiersBonus(item),
      );
      newModifiers.armorEquipped = true;
      return newModifiers;
    case SHIELD_ID:
      newModifiers.bestShieldAC = Math.max(
        bestShieldAC, armorClass + getArmorClassGrantedModifiersBonus(item),
      );
      return newModifiers;
    default:
  }
  // not an armor, this could be a magic item, etc. that modify armor class
  return grantedModifiers.reduce((modifiersInner, modifier) => {
    const { requiresAttunement } = modifier;
    if (requiresAttunement && !isAttuned) {
      return modifiersInner;
    }
    const appliedModifiers = applyArmorClassModifiers({
      character,
      modifiers: modifiersInner,
      modifier,
    });
    return appliedModifiers ?? modifiersInner;
  }, newModifiers);
}

function isDualWielding(character) {
  const hasDualWieldItem = character.characterValues.find(({
    typeId, value, valueId,
  }) => (
    typeId === CHARACTER_VALUE_DUAL_WIELD_ID
    && value === true
    && character.inventory.find(({ equipped, id }) => (equipped && id === parseInt(valueId, 10)))
  ));
  // if equipped with a dual wield item, need to find another equipped item that's not dual wield
  return hasDualWieldItem && character.inventory.find(({
    definition: { damage }, equipped, id,
  }) => (
    equipped
    // ??? choose any item that does damage, does that mean it's a weapon?
    // and dndbeyond doesn't seem to account for dual wield weapon restrictions
    && !!damage
    && !character.characterValues.find(({
      typeId, value, valueId,
    }) => (
      typeId === CHARACTER_VALUE_DUAL_WIELD_ID
      && value === true
      && id === parseInt(valueId, 10)
    ))
  ));
}

export function getArmorClass(character) {
  const overrideArmorClass = getCharacterValueByTypeId(character, CHARACTER_VALUE_OVERRIDE_AC_ID);
  // if there's an override that the player has manually set, then just return that
  if (overrideArmorClass) {
    return overrideArmorClass;
  }
  // these bonuses are added everywhere except for master override above
  const additionalMagicBonus = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_ADDITIONAL_MAGIC_BONUS_ID,
  ) ?? 0;
  const additionalMiscBonus = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_ADDITIONAL_MISC_BONUS_ID,
  ) ?? 0;
  // if they've set the base armor, we'll exclude any special base armor rules below
  const overrideBaseArmorClass = getCharacterValueByTypeId(
    character, CHARACTER_VALUE_OVERRIDE_BASE_ARMOR_DEX_ID,
  );

  let activeModifiers = {
    armorEquipped: false,
    bestLightArmorAC: 0,
    bestMediumArmorAC: 0,
    bestHeavyArmorAC: 0,
    bestShieldAC: 0,
    unarmoredBonusSets: [],
    unarmoredBonus: 0,
    armoredBonus: 0,
    mediumArmorMaxDexterityBonus: 2,
    dualWieldBonus: 0,
    bonus: 0,
  };

  // we need to handle armor class items specifically
  activeModifiers = applyStaticModifiers(character, activeModifiers, applyArmorClassModifiers);

  activeModifiers = character.inventory.reduce((currentModifiers, item) => (
    applyArmorClassItem(character, currentModifiers, item)
  ), activeModifiers);

  const {
    armorEquipped,
    bestLightArmorAC,
    bestMediumArmorAC,
    bestHeavyArmorAC,
    bestShieldAC,
    unarmoredBonusSets,
    unarmoredBonus,
    armoredBonus,
    mediumArmorMaxDexterityBonus,
    dualWieldBonus,
    bonus,
  } = activeModifiers;
  let armorClass = 0;

  if (overrideBaseArmorClass) {
    // manually set base armor, skip any special armor calcs
    armorClass = overrideBaseArmorClass;
  } else if (!armorEquipped) {
    // unarmored base AC with no armor or shield
    armorClass = 10 + getDexterityModifier(character);
    // get the best AC calculation if there's unarmored defense
    // note dndbeyond doesn't necessarily use the best defense
    // i.e. it still display tortle natural armor over robe of the archmagi
    // even if robe of the archmagi results in a better AC
    unarmoredBonusSets.forEach((unarmoredBonusSet) => {
      armorClass = Math.max(armorClass, 10 + unarmoredBonusSet);
    });
    // any unarmored bonuses, unsure if there are any
    armorClass += unarmoredBonus;
  } else {
    // light armor includes dexterity modifier
    armorClass = Math.max(
      armorClass, bestLightArmorAC + getDexterityModifier(character),
    );
    // medium armor includes dexterity modifier, but has a cap
    // the cap is usually 2, but medium armor master modifies it
    armorClass = Math.max(
      armorClass, bestMediumArmorAC + Math.min(
        getDexterityModifier(character), mediumArmorMaxDexterityBonus,
      ),
    );
    // heavy armor is just the set value
    armorClass = Math.max(armorClass, bestHeavyArmorAC);
    // stuff like defense fighting style
    armorClass += armoredBonus;
  }
  // dual wield feat
  if (dualWieldBonus && isDualWielding(character)) {
    armorClass += dualWieldBonus;
  }

  // we can add shield armor class to any base armor formula
  // this should not work with monk's unarmored defense, but dndbeyond adds it anyways
  armorClass += bestShieldAC;
  // any global bonuses
  armorClass += bonus;
  armorClass += additionalMagicBonus;
  armorClass += additionalMiscBonus;
  return armorClass;
}

const SENSE_TYPE_ID = 668550506;
const BLINDSIGHT_ID = 1;
const DARKVISION_ID = 2;
const TREMORSENSE_ID = 3;
const TRUESIGHT_ID = 4;
const SENSE_IDS = [BLINDSIGHT_ID, DARKVISION_ID, TREMORSENSE_ID, TRUESIGHT_ID];
const SENSE_NAME = {
  [BLINDSIGHT_ID]: 'Blindsight',
  [DARKVISION_ID]: 'Darkvision',
  [TREMORSENSE_ID]: 'Tremorsense',
  [TRUESIGHT_ID]: 'Truesight',
};

function applySensesModifiers({
  modifiers,
  modifier: {
    entityId, entityTypeId, type, value,
  },
}) {
  const activeModifiers = { ...modifiers };

  // value is the sense in distance
  // goggles of night etc. that grants or adds to vision
  if (SENSE_TYPE_ID === entityTypeId && SENSE_IDS.includes(entityId) && type === 'sense') {
    activeModifiers.senseBonus[entityId] += value;
    return activeModifiers;
  }
  // robe of eyes etc. that only grants vision
  if (SENSE_TYPE_ID === entityTypeId && SENSE_IDS.includes(entityId) && type === 'set-base') {
    const setSense = activeModifiers.senseSets[entityId];
    activeModifiers.senseSets[entityId] = Math.max(setSense, value);
    return activeModifiers;
  }
  return null;
}

function initializeSenses(value) {
  return SENSE_IDS.reduce((senses, senseId) => ({ ...senses, [senseId]: value }), {});
}

function getSenses(character) {
  const senses = initializeSenses(null);
  // a sense with a real value means it was overridden
  character.customSenses.forEach(({ distance, senseId }) => {
    senses[senseId] = distance;
  });

  let activeModifiers = {
    senseBonus: initializeSenses(0),
    senseSets: initializeSenses(0),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applySensesModifiers);

  const {
    senseBonus,
    senseSets,
  } = activeModifiers;

  Object.entries(senses).forEach(([senseId, distance]) => {
    // prefer overridden value
    if (distance === null) {
      senses[senseId] = senseSets[senseId] + senseBonus[senseId];
    }
  });
  return senses;
}

export function getExtraSenses(character) {
  return Object.entries(getSenses(character)).map(([senseId, distance]) => (
    // distance could be null or 0, both mean no sense should be shown
    // display on dndbeyond looks like
    // Blindsight 11 ft., Darkvision 22 ft., Tremorsense 33 ft., Truesight 44 ft.
    distance ? `${SENSE_NAME[senseId]} ${distance} ft.` : null
  )).filter((senseString) => (
    // get rid of senses with no value
    senseString !== null
  ))
    .sort(); // also sort senses
}

// gets sorted spellcasting class definitions
function getSpellCastingClasses({ classes }) {
  return [...classes].filter(({
    level,
    definition: {
      canCastSpells,
      classFeatures,
      spellCastingAbilityId,
    },
  }) => (
    // get all classes with spellcasting
    canCastSpells && spellCastingAbilityId && classFeatures.find(({
      name,
      requiredLevel,
    }) => (
      // dndbeyond seems to care about their class achieving Spellcasting feature as well
      (name === 'Spellcasting' || name === 'Pact Magic') && level >= requiredLevel
    ))
  )).sort((a, b) => {
    // starting class takes precedence, otherwise sort alphabetically
    if (a.isStartingClass) {
      return -1;
    }
    if (b.isStartingClass) {
      return 1;
    }
    return a.definition.name.localeCompare(b.definition.name);
    // just return the class definition, we only need the name and spellCastingAbilityId
  }).map(({ definition }) => (definition));
}

function applySaveDCModifiers({
  modifiers,
  modifier: {
    subType, type, value,
  },
}) {
  const activeModifiers = { ...modifiers };
  // classes the character has
  const classes = Object.keys(activeModifiers.classBonus);

  // global save dc like robe of the magic
  if (subType === 'spell-save-dc' && type === 'bonus') {
    activeModifiers.bonus += value;
    return activeModifiers;
  }

  // class save dc like rod of the pact keeper (warlock)
  classes.forEach((className) => {
    // don't use class as a variable name jesus
    if (subType === `${className.toLowerCase()}-spell-save-dc` && type === 'bonus') {
      activeModifiers.classBonus[className] += value;
    }
  });

  return null;
}

// returns spell save DCs in this form:
// [[SAVE_DC_NUMBER, CLASSES], [SAVE_DC_NUMBER2, CLASSES]]
// classes with same save dc are lumped in the same string, like how dndbeyond does it
// they are sorted based on starting class name followed by alphabetical class name
export function getSpellSaveDCs(character) {
  const classes = getSpellCastingClasses(character);
  // if no spellcasting classes, return null
  if (!classes.length) {
    return null;
  }

  let activeModifiers = classes.reduce((modifiers, { name }) => ({
    ...modifiers,
    classBonus: {
      ...modifiers.classBonus,
      [name]: 0,
    },
  }), {
    bonus: 0,
    classBonus: {},
  });

  activeModifiers = applyModifiers(character, activeModifiers, applySaveDCModifiers);

  const { bonus, classBonus } = activeModifiers;

  const saveDCBase = 8 + getProficiencyBonus(character) + bonus;

  return classes.map(({ name, spellCastingAbilityId }) => ([
    saveDCBase
    + getAbilityScoreModifierById(character, spellCastingAbilityId)
    + classBonus[name],
    name,
  // dndbeyond combines same saveDCs, but still with starting class up front
  ])).reduce((classSaveDCs, [classSaveDC, className]) => {
    const nextClassSaveDCs = [...classSaveDCs];
    // lump classes with same value saveDCs together, but preserve the order
    const matchIndex = nextClassSaveDCs.findIndex(([saveDC]) => (classSaveDC === saveDC));
    if (matchIndex !== -1) {
      nextClassSaveDCs[matchIndex][1].push(className);
    } else {
      nextClassSaveDCs.push([classSaveDC, [className]]);
    }
    return nextClassSaveDCs;
  }, []).map(([classSaveDC, classNames]) => (
    [classSaveDC, classNames.join(', ')]
  ));
}

const LANGUAGE_ID = 906033267;
const CUSTOM_PROFICIENCY_LANGUAGE_ID = 3;
// parsed from select option under custom language proficiencies
const LANGUAGE = {
  1: 'Common',
  2: 'Dwarvish',
  3: 'Elvish',
  4: 'Giant',
  5: 'Gnomish',
  6: 'Goblin',
  7: 'Halfling',
  8: 'Orc',
  9: 'Abyssal',
  10: 'Celestial',
  11: 'Draconic',
  12: 'Deep Speech',
  13: 'Infernal',
  14: 'Primordial',
  15: 'Sylvan',
  16: 'Undercommon',
  18: 'Telepathy',
  19: 'Aquan',
  20: 'Auran',
  21: 'Ignan',
  22: 'Terran',
  23: 'Druidic',
  24: 'Giant Eagle',
  25: 'Giant Elk',
  26: 'Giant Owl',
  27: 'Gnoll',
  28: 'Otyugh',
  29: 'Sahuagin',
  30: 'Sphinx',
  31: 'Winter Wolf',
  32: 'Worg',
  33: 'Blink Dog',
  34: 'Yeti',
  35: 'All',
  36: 'Aarakocra',
  37: 'Slaad',
  38: 'Bullywug',
  39: 'Gith',
  40: 'Grell',
  41: 'Hook Horror',
  42: 'Modron',
  43: 'Thri-kreen',
  44: 'Troglodyte',
  45: 'Umber Hulk',
  46: 'Thieves’ Cant',
  47: 'Grung',
  48: 'Tlincalli',
  49: 'Vegepygmy',
  50: 'Yikaria',
  51: 'Bothii',
  52: 'Ixitxachitl',
  53: 'Thayan',
  54: 'Netherese',
  55: 'Ice Toad',
  56: 'Olman',
  57: 'Quori',
  58: 'Minotaur',
  59: 'Loxodon',
  60: 'Kraul',
  61: 'Vedalken',
  62: 'Daelkyr',
  64: 'Riedran',
  66: 'Zemnian',
  67: 'Marquesian',
  68: 'Naush',
  69: 'Leonin',
};

function applyLanguageModifiers({
  modifiers,
  modifier: {
    entityId, entityTypeId,
  },
}) {
  const activeModifiers = { ...modifiers };
  if (entityTypeId === LANGUAGE_ID && LANGUAGE[entityId]) {
    activeModifiers.languages.add(LANGUAGE[entityId]);
    return activeModifiers;
  }
  return null;
}

export function getLanguages(character) {
  let activeModifiers = {
    languages: new Set(),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyLanguageModifiers);

  const { languages } = activeModifiers;

  const { characterValues, customProficiencies } = character;
  // characterValues, custom added dnd languages
  characterValues.forEach(({ valueId, valueTypeId }) => {
    if (
      parseInt(valueTypeId, 10) === LANGUAGE_ID
      && LANGUAGE[parseInt(valueId, 10)]
    ) {
      languages.add(LANGUAGE[parseInt(valueId, 10)]);
    }
  });

  // customProficiencies, user made their own language
  customProficiencies.forEach(({ name, type }) => {
    if (type === CUSTOM_PROFICIENCY_LANGUAGE_ID) {
      languages.add(name);
    }
  });

  return Array.from(languages).sort();
}

function applyMaxHitPoints({
  modifiers,
  modifier: {
    subType, type, value,
  },
}) {
  const appliedModifiers = { ...modifiers };

  // stuff like tough feat and hill dwarf
  if (subType === 'hit-points-per-level' && type === 'bonus') {
    appliedModifiers.hitPointsPerLevel += value;
    return appliedModifiers;
  }

  return null;
}

export function getMaxHitPoints(character) {
  const {
    baseHitPoints,
    bonusHitPoints,
    overrideHitPoints,
  } = character;

  if (overrideHitPoints !== null) {
    return overrideHitPoints;
  }

  let activeModifiers = {
    hitPointsPerLevel: 0,
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyMaxHitPoints);

  const { hitPointsPerLevel } = activeModifiers;
  // base includes how they got hp: rolled/average/etc.
  let maxHitPoints = baseHitPoints;
  // constitution bonus
  const level = getTotalLevel(character);
  maxHitPoints += getConstitutionModifier(character) * level;
  // modifier bonus
  maxHitPoints += hitPointsPerLevel * level;
  // custom input bonus
  maxHitPoints += bonusHitPoints;
  return maxHitPoints;
}

export function getCurrentHitPoints(character) {
  const { removedHitPoints } = character;
  return getMaxHitPoints(character) - removedHitPoints;
}

export function getTemporaryHitPoints(character) {
  const { temporaryHitPoints } = character;
  return temporaryHitPoints;
}

const CONDITION_ADJUSTMENT_ID = 1;
const DAMAGE_ADJUSTMENT_ID = 2;

const CUSTOM_RESISTANCE = {
  1: 'Bludgeoning',
  2: 'Piercing',
  3: 'Slashing',
  4: 'Lightning',
  5: 'Thunder',
  6: 'Poison',
  7: 'Cold',
  8: 'Radiant',
  9: 'Fire',
  10: 'Necrotic',
  11: 'Acid',
  12: 'Psychic',
  47: 'Force',
  51: 'Ranged Attacks',
  52: 'Damage Dealt By Traps',
  54: 'Bludgeoning from non magical attacks',
  57: 'Damage from Spells',
};

const CUSTOM_VULNERABILITY = {
  33: 'Bludgeoning',
  34: 'Piercing',
  35: 'Slashing',
  36: 'Lightning',
  37: 'Thunder',
  38: 'Poison',
  39: 'Cold',
  40: 'Radiant',
  41: 'Fire',
  42: 'Necrotic',
  43: 'Acid',
  44: 'Psychic',
  49: 'Force',
};

const CUSTOM_DAMAGE_IMMUNITY = {
  17: 'Bludgeoning',
  18: 'Piercing',
  19: 'Slashing',
  20: 'Lightning',
  21: 'Thunder',
  22: 'Poison',
  23: 'Cold',
  24: 'Radiant',
  25: 'Fire',
  26: 'Necrotic',
  27: 'Acid',
  28: 'Psychic',
  48: 'Force',
};

const CUSTOM_CONDITION_IMMUNITY = {
  1: 'Blinded',
  2: 'Charmed',
  3: 'Deafened',
  4: 'Exhaustion',
  5: 'Frightened',
  6: 'Grappled',
  7: 'Incapacitated',
  8: 'Invisible',
  9: 'Paralyzed',
  10: 'Petrified',
  11: 'Poisoned',
  12: 'Prone',
  13: 'Restrained',
  14: 'Stunned',
  15: 'Unconscious',
};

function applyResistanceModifiers({
  modifiers,
  modifier: {
    type, friendlySubtypeName,
  },
}) {
  const appliedModifiers = { ...modifiers };

  if (type === 'resistance') {
    appliedModifiers.resistances.add(friendlySubtypeName);
    return appliedModifiers;
  }

  return null;
}

export function getResistances(character) {
  let activeModifiers = {
    resistances: new Set(),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyResistanceModifiers);

  const { resistances } = activeModifiers;

  const { customDefenseAdjustments } = character;
  customDefenseAdjustments.forEach(({ adjustmentId, type }) => {
    if (type === DAMAGE_ADJUSTMENT_ID && CUSTOM_RESISTANCE[adjustmentId]) {
      resistances.add(CUSTOM_RESISTANCE[adjustmentId]);
    }
  });

  return Array.from(resistances).sort();
}

function applyImmunityModifiers({
  modifiers,
  modifier: {
    type, friendlySubtypeName,
  },
}) {
  const appliedModifiers = { ...modifiers };

  if (type === 'immunity') {
    appliedModifiers.immunities.add(friendlySubtypeName);
    return appliedModifiers;
  }

  return null;
}

function applyVulnerabilityModifiers({
  modifiers,
  modifier: {
    type, friendlySubtypeName,
  },
}) {
  const appliedModifiers = { ...modifiers };

  if (type === 'vulnerability') {
    appliedModifiers.vulnerabilities.add(friendlySubtypeName);
    return appliedModifiers;
  }

  return null;
}

export function getVulnerabilities(character) {
  let activeModifiers = {
    vulnerabilities: new Set(),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyVulnerabilityModifiers);

  const { vulnerabilities } = activeModifiers;

  const { customDefenseAdjustments } = character;
  customDefenseAdjustments.forEach(({ adjustmentId, type }) => {
    if (type === DAMAGE_ADJUSTMENT_ID && CUSTOM_VULNERABILITY[adjustmentId]) {
      vulnerabilities.add(CUSTOM_VULNERABILITY[adjustmentId]);
    }
  });

  return Array.from(vulnerabilities).sort();
}

export function getImmunities(character) {
  let activeModifiers = {
    immunities: new Set(),
  };

  activeModifiers = applyModifiers(character, activeModifiers, applyImmunityModifiers);

  const { immunities } = activeModifiers;

  const { customDefenseAdjustments } = character;
  customDefenseAdjustments.forEach(({ adjustmentId, type }) => {
    if (type === DAMAGE_ADJUSTMENT_ID && CUSTOM_DAMAGE_IMMUNITY[adjustmentId]) {
      immunities.add(CUSTOM_DAMAGE_IMMUNITY[adjustmentId]);
    }
    if (type === CONDITION_ADJUSTMENT_ID && CUSTOM_CONDITION_IMMUNITY[adjustmentId]) {
      immunities.add(CUSTOM_CONDITION_IMMUNITY[adjustmentId]);
    }
  });

  return Array.from(immunities).sort();
}

const CONDITION = {
  1: 'Blinded',
  2: 'Charmed',
  3: 'Deafened',
  4: 'Exhaustion',
  5: 'Frightened',
  6: 'Grappled',
  7: 'Incapacitated',
  8: 'Invisible',
  9: 'Paralyzed',
  10: 'Petrified',
  11: 'Poisoned',
  12: 'Prone',
  13: 'Restrained',
  14: 'Stunned',
  15: 'Unconscious',
};

export function getConditions(character) {
  const { conditions } = character;

  return conditions.reduce((currentConditions, { id, level }) => {
    const condition = CONDITION[id];
    // exhaustion also has a level
    if (condition === 'Exhaustion' && level) {
      return [...currentConditions, `Exhaustion (Level ${level})`];
    }
    if (condition) {
      return [...currentConditions, condition];
    }
    return currentConditions;
  }, []).sort() ?? null;
}
