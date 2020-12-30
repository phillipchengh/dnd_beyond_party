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
// modifiers.class[].componentId === optionalClassFeatures[].classFeatureId
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
// modifiers.race[].componentId === optionalOrigins[].racialTraitId
function componentIdInRace(character, componentId) {
  return (
    !!character.race.racialTraits?.find(({ definition: { id } }) => (id === componentId))
    || character.optionalOrigins.find(({ racialTraitId }) => (racialTraitId === componentId))
  );
}

// background, class, feat, race (basically not items)
// separated out cause some calcs might want to calculate items specifically
function applyStaticModifiers(character, modifiers, applyModifier, match) {
  let activeModifiers = { ...modifiers };

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
  return applyPassiveBonus(character, 10 + getPerceptionModifier(character), 'passive-perception');
}

export function getPassiveInvestigation(character) {
  return applyPassiveBonus(character, 10 + getInvestigationModifier(character), 'passive-investigation');
}

export function getPassiveInsight(character) {
  return applyPassiveBonus(character, 10 + getInsightModifier(character), 'passive-insight');
}

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

// need these ids, since the friendly type string may not appear for custom items
const LIGHT_ARMOR_ID = 1;
const MEDIUM_ARMOR_ID = 2;
const HEAVY_ARMOR_ID = 3;
const SHIELD_ID = 4;

function applyArmorClassModifiers({
  character,
  modifiers,
  modifier: {
    subType, statId, type, value,
  },
}) {
  const appliedArmorClassModifiers = { ...modifiers };
  // barbarian/monk adds dexterity + another set modifier
  // note barbarian's ability adds any shield bonuses, but monks do not
  // however, dndbeyond adds monk shield bonuses anyways, so we'll just roll with that
  if (subType === 'unarmored-armor-class' && type === 'set' && statId) {
    appliedArmorClassModifiers.unarmoredBonusSets.push(
      getDexterityModifier(character) + getAbilityScoreModifierById(character, statId),
    );
    return appliedArmorClassModifiers;
  }
  // draconic sorcerer adds dexterity + some bonus
  // draconic sorcerer won't have a statId, it will just have some value
  if (subType === 'unarmored-armor-class' && type === 'set' && value) {
    appliedArmorClassModifiers.unarmoredBonusSets.push(
      getDexterityModifier(character) + value,
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
    // medium armor includes dexterity modifier, but max 2
    armorClass = Math.max(
      armorClass, bestMediumArmorAC + Math.min(getDexterityModifier(character), 2),
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
