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

export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}
