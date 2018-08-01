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

// 能力检测
let elementStyle = document.createElement('div').style;

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

/**
 *
 * @param {string} style
 * @returns
 */
export function prefix(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
