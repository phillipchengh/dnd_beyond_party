export function getId(document) {
  const hrefParts = document.querySelector('link[rel="canonical"').getAttribute('href').split('/');
  return parseInt(hrefParts[hrefParts.length - 1], 10);
}

export function getName(document) {
  return document.querySelector('.ddbc-character-name').textContent;
}

export function getClassDisplay(document) {
  return document.querySelector('.ddbc-character-summary__classes').textContent;
}

export function getLevelDisplay(document) {
  return document.querySelector('.ddbc-character-progression-summary__level').textContent;
}

export function getProficiencyBonusDisplay(document) {
  return document.querySelector('.ct-proficiency-bonus-box__value').textContent;
}

export function getRace(document) {
  return document.querySelector('.ddbc-character-summary__race').textContent;
}

export function getStrengthAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[0].textContent, 10);
}

export function getDexterityAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[1].textContent, 10);
}

export function getConstitutionAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[2].textContent, 10);
}

export function getIntelligenceAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[3].textContent, 10);
}

export function getWisdomAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[4].textContent, 10);
}

export function getCharismaAbilityScore(document) {
  return parseInt(document.querySelectorAll('.ddbc-ability-summary__secondary')[5].textContent, 10);
}

export function getStrengthModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[0].textContent;
}

export function getDexterityModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[1].textContent;
}

export function getConstitutionModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[2].textContent;
}

export function getIntelligenceModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[3].textContent;
}

export function getWisdomModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[4].textContent;
}

export function getCharismaModifierDisplay(document) {
  return document.querySelectorAll('.ddbc-ability-summary__primary')[5].textContent;
}

export function getInitiativeModifierDisplay(document) {
  return document.querySelector('.ct-initiative-box__value').textContent;
}

export function getAcrobaticsModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[1].textContent;
}

export function getAnimalHandlingModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[2].textContent;
}

export function getArcanaModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[3].textContent;
}

export function getAthleticsModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[4].textContent;
}

export function getDeceptionModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[5].textContent;
}

export function getHistoryModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[6].textContent;
}

export function getInsightModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[7].textContent;
}

export function getIntimidationModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[8].textContent;
}

export function getInvestigationModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[9].textContent;
}

export function getMedicineModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[10].textContent;
}

export function getNatureModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[11].textContent;
}

export function getPerceptionModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[12].textContent;
}

export function getPerformanceModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[13].textContent;
}

export function getPersuasionModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[14].textContent;
}

export function getReligionModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[15].textContent;
}

export function getSleightOfHandModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[16].textContent;
}

export function getStealthModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[17].textContent;
}

export function getSurvivalModifierDisplay(document) {
  return document.querySelectorAll('.ct-skills__col--modifier')[18].textContent;
}

export function getPassivePerception(document) {
  return parseInt(document.querySelectorAll('.ct-senses__callout-value')[0].textContent, 10);
}

export function getPassiveInvestigation(document) {
  return parseInt(document.querySelectorAll('.ct-senses__callout-value')[1].textContent, 10);
}

export function getPassiveInsight(document) {
  return parseInt(document.querySelectorAll('.ct-senses__callout-value')[2].textContent, 10);
}

export function getArmorClass(document) {
  return parseInt(document.querySelector('.ddbc-armor-class-box__value').textContent, 10);
}

export function getSensesDisplay(document) {
  const senses = document.querySelector('.ct-senses__summary').textContent;
  return senses === 'Additional Sense Types' ? '' : senses;
}

export function getSpellSaveDCs(document) {
  // return null if there's no expected spell save dc element
  // it's not there if the character is on the wrong tab or not a spellcaster
  const spellSaveDCElements = document.querySelectorAll(
    '.ct-spells-level-casting__info-group',
  )[2]?.children[0].children;
  return spellSaveDCElements ? Array.from(spellSaveDCElements).reduce((saveDCs, child) => (
    [...saveDCs, [parseInt(child.textContent, 10), child.getAttribute('data-original-title')]]
  ), []) : null;
}

export function getLanguages(document) {
  return document.querySelectorAll('.ct-proficiency-groups__group-items')[3].textContent;
}
