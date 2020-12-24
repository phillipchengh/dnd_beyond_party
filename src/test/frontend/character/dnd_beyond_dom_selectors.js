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
// dom.window.document.getElementsByClassName('ddbc-armor-class-box__value')[0].textContent
