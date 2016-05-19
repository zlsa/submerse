
// # getValue
// Gets a value from an object with the option to have a default
// value. If no default value or key is present, `null` is returned.
// In the future, this should accept dot-notation and possibly array
// index notation, like so:
//
// ```js
// get_value(options, 'foo.bar.baz[3]', 42);
// ```

function getValue(object, key, default_value) {

  if(key in object) {
    return object[key];
  }

  // When `default_value` is not present, return `null` instead of `undefined`.
  if(arguments.length === 2) return null;

  if(default_value instanceof Error) throw default_value;

  return default_value;
}

// # withScope
//
// Effectively calls `func` with `scope`. Mostly to be used inline
// with callbacks, to make things cleaner.

function withScope(scope, func) {
  return function() {
    func.apply(scope, arguments);
  };
}

// # createElement
//
// Adds a list of classes (or a space-separated string) to the
// element.

function addClasses(el, classes) {
  if(typeof classes === 'string') classes = classes.split(/\s+/);

  for(var i=0; i<classes.length; i++)
    el.className += ' ' + classes[i];
}

// # createElement
//
// Creates an element from the given selector.

function createElement(string) {
  var tag = null;
  var id = null;
  var classes = [];
  var class_string = null;

  // Split off the ID
  string = string.split('#');

  // Get the tag name
  tag = string[0];

  // If there's an ID...
  if(string.length === 2) {
    id = string[1];
    class_string = string[1];
  } else {
    class_string = string[0];
  }

  // Separate the class string into its independent class names
  class_string = class_string.split('.');

  if(class_string.length >= 2) {
    classes = class_string.slice(1);

    if(id) {
      id = class_string[0];
    } else {
      tag = class_string[0];
    }

  }

  var el = document.createElement(tag);

  if(id) el.id = id;

  if(classes.length != 0) addClasses(el, classes);

  return el;
}

function findElement(el, selector) {
  if(selector === undefined)
    return document.querySelector(el);
  else
    return el.querySelector(selector);
}

exports.getValue = getValue;
exports.withScope = withScope;

exports.createElement = createElement;
exports.addClasses = addClasses;
exports.findElement = findElement;

