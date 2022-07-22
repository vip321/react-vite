export function map(obj, iteratee, context = null) {
  const resultArray = [];

  context = context || null;

  forEach(obj, function () {
    // @ts-ignore
    return resultArray.push(iteratee.apply(context, arguments));
  });

  return resultArray;
}

export function pick(obj, paths) {
  // eslint-disable-line no-unused-lets
  let args = arguments;
  let target = args[0];
  let i = 1;
  let length = args.length;

  for (; i < length; i += 1) {
    if (!target) {
      return;
    }

    target = target[args[i]];
  }

  return target; // eslint-disable-line consistent-return
}

export function forEach(obj, iteratee, context = null) {
  if (Array.isArray(obj)) {
    forEachArr(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

export function forEachArr(arr, iteratee, context = null) {
  let index = 0;
  let len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

function forEachOwnProperties(obj, iteratee, context) {
  let key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

export function bsearch(arr, search, fn, compare) {
  let minIndex = 0,
    maxIndex = arr.length - 1,
    currentIndex,
    value,
    comp;

  compare = compare || stringASC;

  while (minIndex <= maxIndex) {
    currentIndex = ((minIndex + maxIndex) / 2) | 0; // Math.floor
    value = fn ? fn(arr[currentIndex]) : arr[currentIndex];
    comp = compare(value, search);

    if (comp < 0) {
      minIndex = currentIndex + 1;
    } else if (comp > 0) {
      maxIndex = currentIndex - 1;
    } else {
      return currentIndex;
    }
  }

  return ~maxIndex;
}

function stringASC(_a, _b) {
  const a = String(_a),
    b = String(_b);

  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }

  return 0;
}

export function extend(target, objects) {
  // eslint-disable-line no-unused-lets
  let hasOwnProp = Object.prototype.hasOwnProperty;
  let source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

export function inArray(searchElement, array, startIndex) {
  let length;
  startIndex = startIndex || 0;
  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }
  length = array.length;
  for (let i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }
  return -1;
}
