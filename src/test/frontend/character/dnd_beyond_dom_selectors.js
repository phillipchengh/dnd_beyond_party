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
