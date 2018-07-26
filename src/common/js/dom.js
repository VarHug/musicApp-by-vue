export function addClass(el, className) {
  if (!hasClass(el, className)) {
    let newClass = el.className.split(' '); // /\s/
    newClass.push(className);
    el.className = newClass.join(' ');
  }
}

export function hasClass(el, className) {
  let regExp = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return regExp.test(el.className);
}
