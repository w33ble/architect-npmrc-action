module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(676);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 7:
/***/ (function(module, __unusedexports, __webpack_require__) {

let banner = __webpack_require__(314)
let chars = __webpack_require__(438)
let fingerprint = __webpack_require__(448)
let getLambdaName = __webpack_require__(114)
let pathToUnix = __webpack_require__(376)
let toLogicalID = __webpack_require__(561)
let updater = __webpack_require__(464)

module.exports = {
  banner,         // Prints banner and loads basic env vars and AWS creds
  chars,          // Returns platform appropriate characters for CLI UI printing
  fingerprint,    // Generates public/static.json for `@static fingerprint true`
  getLambdaName,  // Get Lambda name from Arc path
  pathToUnix,     // Normalize to `/` seperated paths for Windows-specific calls
  toLogicalID,    // Converts dash casing into Pascal casing for CloudFormation
  updater,        // Standard Arc status updater and progress indicator
}


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 28:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)

module.exports = function populateEvents ({ item, dir, cwd }) {
  if (typeof item === 'string') {
    let name = item
    let src = join(cwd, dir, name)
    return { name, src }
  }
  else if (typeof item === 'object' && !Array.isArray(item)) {
    let name = Object.keys(item)[0]
    let src = item[name].src
      ? join(cwd, item[name].src)
      : join(cwd, dir, name)
    return { name, src }
  }
  throw Error(`Invalid @events or @queues item: ${item}`)
}


/***/ }),

/***/ 45:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { existsSync, readFileSync } = __webpack_require__(747)
let { join } = __webpack_require__(622)

/**
 * Build the project's Architect metadata
 */
module.exports = function getArcConfig (params) {
  let { cwd, inventory } = params
  let arc = { ...inventory._arc }

  // Version
  let installed = join(cwd, 'node_modules', '@architect', 'architect', 'package.json')
  if (existsSync(installed)) {
    let { version } = JSON.parse(readFileSync(installed))
    arc.version = version
  }

  return arc
}


/***/ }),

/***/ 46:
/***/ (function(module) {

module.exports = function validateAWS (aws) {
  let { apigateway } = aws

  if (apigateway) {
    let valid = [ 'http', 'httpv1', 'httpv2', 'rest' ]
    if (!valid.some(v => v === apigateway)) {
      throw ReferenceError(`API type must be 'http[v1|v2]', or 'rest'`)
    }
  }
}


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 56:
/***/ (function(module) {

module.exports = class PragmaNotFound extends ReferenceError {
  constructor ({ value, line, column }) {
    super(`@${value} pragma already defined (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}



/***/ }),

/***/ 58:
/***/ (function(module) {

module.exports = class MapNameNotString extends SyntaxError {
  constructor ({ line, column }) {
    super(`map name is not a string (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 59:
/***/ (function(module) {

module.exports = class PragmaSyntaxError extends SyntaxError {
  constructor ({ token, line, column }) {
    super(`pragma "${token}" has illegal character(s) (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 63:
/***/ (function(module) {

module.exports = class MapKeyNotStrng extends SyntaxError {
  constructor ({ line, column }) {
    super(`map key is not a string (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 64:
/***/ (function(module) {

module.exports = function getHandler (config, src) {
  let { handler, runtime } = config
  let parts = handler.split('.')
  if (parts.length !== 2) throw Error(`Invalid handler: ${handler}. Expected {file}.{function}, example: index.handler`)
  let ext
  if (runtime.startsWith('nodejs')) ext = 'js'
  if (runtime.startsWith('python')) ext = 'py'
  if (runtime.startsWith('ruby'))   ext = 'rb'
  if (runtime.startsWith('deno'))   ext = 'ts'
  // TODO add Go, Java, .NET, etc.
  let handlerFile = `${src}/${parts[0]}${ext ? '.' + ext : ''}`
  let handlerFunction = parts[1]
  return { handlerFile, handlerFunction }
}


/***/ }),

/***/ 71:
/***/ (function(module) {

module.exports = eval("require")("aws-sdk");


/***/ }),

/***/ 80:
/***/ (function(module) {

/**
 * Return the default config for all Architect projects' functions across all the land ✨
 */
module.exports = function createDefaultFunctionConfig () {
  return {
    timeout: 5,
    memory: 1152,
    runtime: 'nodejs12.x', // TODO add runtime validation
    handler: 'index.handler',
    state: 'n/a',
    concurrency: 'unthrottled',
    layers: [],
    policies: [],
    shared: true,
    env: true,
  }
}


/***/ }),

/***/ 82:
/***/ (function(__unusedmodule, exports) {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 90:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

module.exports = function configureEvents ({ arc, inventory }) {
  if (!arc.events || !arc.events.length) return null

  let events = populate.events(arc.events, inventory)

  return events
}


/***/ }),

/***/ 93:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(306)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 100:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { getLambdaName } = __webpack_require__(7)

module.exports = function populatePlugins ({ item: pluginName, cwd, inventory }) {
  if (inventory._project.plugins[pluginName]) {
    const pluginModule = inventory._project.plugins[pluginName]
    if (pluginModule.pluginFunctions) {
      const lambdas = pluginModule.pluginFunctions({ arc: inventory._project.arc, inventory: { inv: inventory } }).map(f => {
        // strip leading `src/` from the path to the plugin function relative to project root
        let pathToCode = f.src.replace(cwd, '').replace(/^\.?\/?\\?/, '').replace(/^src\/?\\?/, '')
        let name = getLambdaName(pathToCode)
        f.name = name
        return f
      })
      if (lambdas.length) {
        return lambdas
      }
    }
    return null
  }
  throw Error(`Invalid @plugins item: ${pluginName}`)
}


/***/ }),

/***/ 102:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 114:
/***/ (function(module) {

/*
 * Lambda names:
 * - Up to 64 characters
 * - Can contain only letters, numbers, hyphens, and underscores
 *
 * Arc 4+ names Lambdas as such:
 * - dashes:      '-' == '_'
 * - dots:        '.' == '_'
 * - underscores: '_' == '_'
 * - slashes:     '/' == '-'
 * - params:      ':' == '000'
 *
 * This is a lossy substitution, optimized for human readability
 * One should not expect to be able to reliably extract Arc names from Lambda names created with this encoding
 * Also, order matters: slashes should be converted last, after there are no more dashes to convert
*/

module.exports = function getLambdaName (fn) {
  return fn === '/'
    ? '-index'
    : fn.replace(/-/g,  '_')
      .replace(/\./g, '_')
      .replace(/_/g,  '_')
      .replace(/\//g, '-')
      .replace(/\\/g, '-')
      .replace(/:/g,  '000')
      .replace(/\*/,  'catchall')
}


/***/ }),

/***/ 117:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(622);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 131:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

module.exports = function configureWS ({ arc, inventory }) {
  if (!arc.ws) return null

  let ws = [ ...arc.ws ]

  // Backfill required routes if not already present
  let defaults = [ 'disconnect', 'default', 'connect' ]
  defaults.forEach(route => {
    let found = arc.ws.find(item => {
      if (item === route) return true
      if (item[route]) return true
    })
    if (!found) ws.unshift(route)
  })

  let websockets = populate.ws(ws, inventory)

  return websockets
}


/***/ }),

/***/ 150:
/***/ (function(module) {

module.exports = function configureIndexes ({ arc }) {
  if (!arc.indexes || !arc.indexes.length) return null

  let isPrimaryKey = val => val.startsWith('*String') || val.startsWith('*Number')
  let isSortKey = val => val.startsWith('**String') || val.startsWith('**Number')
  let isCustomName = key => key.toLowerCase() === 'name'
  function error (item) { throw Error(`Invalid @indexes item: ${item}`) }

  let indexes = arc.indexes.map(index => {
    if (typeof index === 'object' && !Array.isArray(index)) {
      let name = Object.keys(index)[0]
      let partitionKey = null
      let partitionKeyType = null
      let sortKey = null
      let sortKeyType = null
      let indexName = null
      Object.entries(index[name]).forEach(([ key, value ]) => {
        let isStr = typeof value === 'string'
        if (isStr && isSortKey(value)) {
          sortKey = key
          sortKeyType = value.replace('**', '')
        }
        else if (isStr && isPrimaryKey(value)) {
          partitionKey = key
          partitionKeyType = value.replace('*', '')
        }
        else if (isStr && isCustomName(key)) {
          indexName = value
        }
        else error(index)
      })
      return {
        indexName,
        name,
        partitionKey,
        partitionKeyType,
        sortKey,
        sortKeyType,
      }
    }
    error(index)
  })

  return indexes
}


/***/ }),

/***/ 154:
/***/ (function(module, __unusedexports, __webpack_require__) {

let upsert = __webpack_require__(305)
let prefs = __webpack_require__(594)
let is = __webpack_require__(300)
let plugins = __webpack_require__(799)

/**
 * Get the project-level configuration, overlaying arc.aws settings (if present)
 */
module.exports = function getProjectConfig (params) {
  let { arc, raw, filepath, inventory } = params
  let project = {
    ...inventory._project,
    arc,
    raw,
  }

  if (arc.aws) {
    project.defaultFunctionConfig = upsert(project.defaultFunctionConfig, arc.aws)
  }

  if (filepath) {
    project.manifest = filepath
    // TODO add manifestCreated once we determine we can get birthtime reliably
  }

  // require project plugin modules
  project.plugins = plugins(project)

  // parse local and global arc preferences
  let scopes = [ 'global', 'local' ]
  for (let scope of scopes) {
    let p = prefs({ scope, inventory })
    if (p) {
      // Set up the scoped metadata
      project[`${scope}Preferences`] = p.preferences
      project[`${scope}PreferencesFile`] = p.preferencesFile

      // Build out the final preferences
      if (!project.preferences) project.preferences = {}
      Object.keys(p.preferences).forEach(pragma => {
        // Ignore the raw data
        if (pragma === '_arc' || pragma === '_raw') return
        // Allow booleans, etc.
        if (!is.object(p.preferences[pragma])) {
          project.preferences[pragma] = p.preferences[pragma]
          return
        }
        // Traverse and merge individual settings
        if (!project.preferences[pragma]) project.preferences[pragma] = {}
        Object.entries(p.preferences[pragma]).forEach(([ setting, value ]) => {
          project.preferences[pragma][setting] = value
        })
      })
    }
  }

  return project
}


/***/ }),

/***/ 156:
/***/ (function(module) {

/**
 * Ensure @tables children (@streams, @indexes) have parent tables present
 * - If not, configuration is invalid
 */
module.exports = function validateTablesChildren (inventory, callback) {
  let { indexes, streams, tables } = inventory
  let err = []

  function check (table, type) {
    if (!tables.some(t => t.name === table)) {
      err.push(`@${type} item missing corresponding table: ${table}`)
    }
  }
  if (streams) {
    streams.forEach(stream => check(stream.table, 'streams'))
  }
  if (indexes) {
    indexes.forEach(index => check(index.name, 'indexes'))
  }

  if (err.length) callback(Error(err.join('\n')))
  else callback()
}


/***/ }),

/***/ 157:
/***/ (function(module, __unusedexports, __webpack_require__) {

let notempty = __webpack_require__(455)

/**
 * removes comments and empty lines
 *
 * @param {array} tokens
 * @returns {array} tokens
 */
module.exports = function compact (tokens) {

  // grabs a copy removing all comments
  let copy = tokens.slice(0).filter(t => t.type != 'comment')

  // get the indices of all newlines
  let newlines = copy.map((t, i) => t.type === 'newline' ? i : false).filter(Boolean)
  let newlinetokens = copy.map(t => t.type === 'newline' ? t : false).filter(Boolean)
  let newlinemap = []

  // get collection of lines: [[{token}, {token}], [{token, token}]]
  let lines = newlines.reduce(function linebreak (collection, newline, index) {
    let start = index === 0 ? index : newlines[index - 1] + 1
    let line = copy.slice(start, newline)
    let empty = line.filter(notempty).length === 0
    if (!empty) {
      collection.push(line)
      newlinemap.push(newlinetokens[newlines.indexOf(newline)])
    }
    return collection
  }, [])

  // flatten result; ignoring leading spaces and newlines
  let found = false
  let index = 0
  let result = []

  for (let line of lines) {
    for (let t of line) {
      let ignore = t.type == 'space' || t.type == 'newline'
      if (ignore === false && found === false)
        found = true
      if (found)
        result.push(t)
    }
    result.push(newlinemap[index])
    index += 1
  }

  return result
}


/***/ }),

/***/ 158:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let populate = __webpack_require__(631)
let asapSrc = __webpack_require__(708)

module.exports = function configureHTTP ({ arc, inventory }) {
  if (!arc.http) return null

  // Populate normally returns null on an empty Lambda pragma
  // However, @http is special because it gets the Architect Static Asset Proxy (ASAP), so fall back to an empty array
  let http = populate.http(arc.http, inventory) || []

  let findRoot = route => {
    let r = route.name.split(' ')
    let method = r[0]
    let path = r[1]
    let rootParam = path.startsWith('/:') && path.split('/').length === 2
    let isRootMethod = method === 'get' || method === 'any'
    let isRootPath = path === '/' || path === '/*' || rootParam
    return isRootMethod && isRootPath
  }
  let rootHandler = http.some(findRoot) ? 'configured' : 'arcStaticAssetProxy'
  if (arc.proxy) rootHandler = 'proxy'
  if (rootHandler === 'arcStaticAssetProxy') {
    let src = asapSrc()

    // Inject ASAP
    let asap = {
      name: 'get /*',
      config: { ...inventory._arc.defaultFunctionConfig },
      src,
      handlerFile: join(src, 'index.js'),
      handlerFunction: 'handler',
      configFile: null,
      arcStaticAssetProxy: true,
      method: 'get',
      path: '/*'
    }
    asap.config.shared = false
    asap.config.views = false
    inventory._project.asapSrc = src // Handy shortcut to ASAP
    http.unshift(asap)
  }

  // Impure but it's way less complicated to just do this
  inventory._project.rootHandler = rootHandler

  return http
}


/***/ }),

/***/ 161:
/***/ (function(module, __unusedexports, __webpack_require__) {

let restore = __webpack_require__(599)
let isCI = process.env.CI || !process.stdout.isTTY
let out = process.stdout
let printer = {
  // Clears the line so we can overwrite it
  clear: () => {
    if (!isCI)
      out.clearLine()
  },
  // Resets cursor position
  reset: x => {
    if (!isCI)
      out.cursorTo(x ? x : 0)
  },
  // Write to console, add single extra line to buffer while running
  restoreCursor: () => restore(),
  write: t => out.write(t + '\033[1A' + '\n')
}
printer.hideCursor = () => printer.write('\u001B[?25l')

let isWin = process.platform.startsWith('win')
let windows = '| / – \\ | / – \\'.split(' ')
let unix = '⊙ ⦾ ⦿ ⦿ ⦿ ⦾ ⊙ ⊙ ⊙ ⊙'.split(' ')
let frames = isWin
  ? windows
  : unix
let timing = isWin
  ? 125
  : 100
let spinner = { frames, timing }

module.exports = {
  printer,
  spinner
}


/***/ }),

/***/ 185:
/***/ (function(module) {

module.exports = class SpaceError extends SyntaxError {
  constructor ({ line, column }) {
    super(`illegal indent (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 215:
/***/ (function(module) {

module.exports = class UnknownCharacterError extends SyntaxError {
  constructor ({ character, line, column }) {
    super(`unknown character "${character}" (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 219:
/***/ (function(module, __unusedexports, __webpack_require__) {

let asapSrc = __webpack_require__(708)

module.exports = function configureStatic ({ arc, inventory }) {
  // @static is inferred by @http
  if (!arc.static && !arc.http) return null

  let staticPragma = arc.static || []
  let _static = {
    fingerprint: null,
    folder: 'public', // Arc applied default
    ignore: null,
    prefix: null,
    prune: null,
    spa: false, // Arc applied default
    staging: null,
    production: null,
  }

  if (Array.isArray(arc.static)) {
    let disabled = [ false, 'disable', 'disabled' ]
    let isDisabled = disabled.some(s => s === arc.static[0])
    if (isDisabled) return false
  }

  let settings = Object.entries(_static).map(([ setting ]) => setting)
  for (let setting of staticPragma) {
    let validSetting = key => settings.some(s => s === key)
    if (setting.ignore) {
      _static.ignore = setting.ignore
    }
    else if (Array.isArray(setting) &&
             setting.length === 2 &&
             validSetting(setting[0])) {
      let isIgnore = setting[0] === 'ignore'
      _static[setting[0]] = isIgnore ? [ setting[1] ] : setting[1]
    }
  }

  // Handy shortcut to ASAP for bare @static
  if (!arc.http) {
    inventory._project.rootHandler = 'arcStaticAssetProxy'
    inventory._project.asapSrc = asapSrc()
  }

  return _static
}


/***/ }),

/***/ 221:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)

module.exports = function populateWebSockets ({ item, dir, cwd }) {
  if (typeof item === 'string') {
    let name = item
    let route = name // Same as name, just what AWS calls it
    let folder = process.env.DEPRECATED ? `ws-${name}` : name
    let src = join(cwd, dir, folder)
    return { name, route, src }
  }
  else if (typeof item === 'object' && !Array.isArray(item)) {
    let name = Object.keys(item)[0]
    let route = name
    // Add back src switch on presence of item[name].src when WS gets more options
    let src = join(cwd, item[name].src)
    return { name, route, src }
  }
  throw Error(`Invalid @ws item: ${item}`)
}


/***/ }),

/***/ 234:
/***/ (function(module, __unusedexports, __webpack_require__) {

/* eslint-disable global-require */
let visitors = [
  __webpack_require__(359),       // @app
  __webpack_require__(729),       // @aws
  __webpack_require__(846),       // @cdn
  __webpack_require__(90),    // @events
  __webpack_require__(158),      // @http
  __webpack_require__(150),   // @indexes
  __webpack_require__(484),    // @macros
  __webpack_require__(828),     // @proxy
  __webpack_require__(840),   // @plugins - but only if they contain lambdas
  __webpack_require__(525),    // @queues
  __webpack_require__(346), // @scheduled
  __webpack_require__(219),    // @static
  __webpack_require__(565),   // @streams
  __webpack_require__(833),    // @tables
  __webpack_require__(131),        // @ws
]
// Special order-dependent visitors that run in a second pass
let srcDirs = __webpack_require__(498)
let shared = __webpack_require__(653)
let views = __webpack_require__(825)

module.exports = function configureArcPragmas ({ arc, inventory }) {
  if (inventory._project.type !== 'aws') {
    throw ReferenceError('Inventory can only configure pragmas for AWS projects')
  }

  let pragmas = {}
  visitors.forEach(visitor => {
    // Expects pragma visitors to have function name of: `configure${pragma}`
    let name = visitor.name.replace('configure', '').toLowerCase()
    pragmas[name] = visitor({ arc, inventory })
  })

  // Lambda source directory list
  let dirs = srcDirs({ arc, inventory, pragmas })
  pragmas.lambdaSrcDirs = dirs.lambdaSrcDirs
  pragmas.lambdasBySrcDir = dirs.lambdasBySrcDir

  // @shared (which needs all Lambdae pragmas + srcDirs to validate)
  pragmas.shared = shared({ arc, pragmas, inventory })

  // @views (which needs @http to validate)
  pragmas.views = views({ arc, pragmas, inventory })

  return pragmas
}


/***/ }),

/***/ 237:
/***/ (function(module, __unusedexports, __webpack_require__) {

const {
  DASHERIZED,
  SPACE,
  NEWLINE,
  STRING
} = __webpack_require__(811)

const PragmaSyntaxError = __webpack_require__(59)
const CloseQuoteNotFoundError = __webpack_require__(575)

/**
 * helper for slicing out a lexeme token: pragma, comment, boolean, number or a string
 *
 * @param {number} cursor
 * @param {code} source code string
 * @returns {string} token
 */
module.exports = {

  pragma (cursor, code, line, column) {
    let copy = code.slice(cursor, code.length)
    let matches = copy.match(NEWLINE)
    let end = matches && matches.index ? matches.index : code.length
    let token = copy.slice(0, end).trim()
    if (!DASHERIZED.test(token.substring(1))) // ignore the leading @
      throw new PragmaSyntaxError({ token, line, column })
    return token
  },

  comment (cursor, code) {
    let copy = code.slice(cursor, code.length)
    let matches = copy.match(NEWLINE)
    let end = matches && matches.index ? matches.index : code.length
    return copy.slice(0, end)
  },

  bool (cursor, code) {
    let copy = code.slice(cursor, code.length)
    let mSpace = copy.match(SPACE)
    let mNewline = copy.match(NEWLINE)
    let iSpace = mSpace && mSpace.index ? mSpace.index : false
    let iNewline = mNewline && mNewline.index ? mNewline.index : false
    let end = (iSpace || iNewline) ? (iSpace && iSpace < iNewline ? iSpace : iNewline) : code.length
    return copy.slice(0, end).trim()
  },

  number (cursor, code) {
    let copy = code.slice(cursor, code.length)
    let mSpace = copy.match(SPACE)
    let mNewline = copy.match(NEWLINE)
    let iSpace = mSpace && mSpace.index ? mSpace.index : false
    let iNewline = mNewline && mNewline.index ? mNewline.index : false
    let end = (iSpace || iNewline) ? (iSpace && iSpace < iNewline ? iSpace : iNewline) : code.length
    return copy.slice(0, end).trim()
  },

  string (cursor, code, line, column) {
    let pointer = cursor
    let character = code[cursor]
    let token = ''
    if (character === '"') {
      // seek ahead to next instance of " skipping any \" references
      let copy = code.slice(cursor + 1, code.length)
      let count = 0
      let last = (function getNextQuote () {
        // create a copy of the code string
        let inner = copy.substring(count, copy.length)
        let index = inner.indexOf('"')
        // if we didn't find it blow up hard
        let notfound = index === -1
        if (notfound)
          throw new CloseQuoteNotFoundError({ line, column })
        // if is not an excaped value return
        let escapee = inner[index - 1] === '\\'
        if (!escapee)
          return index
        // by default continue searching
        count = index
        getNextQuote()
      })()
      return copy.substring(0, last)
    }
    else {
      while (STRING.test(character)) {
        token += character
        character = code[++pointer]
      }
      return token
    }
  }
}


/***/ }),

/***/ 244:
/***/ (function(module) {

(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c=require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u=require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var parser = require('./lib/parser');
var compiler = require('./lib/compiler');

module.exports = {
  parse: function(input) {
    var nodes = parser.parse(input.toString());
    return compiler.compile(nodes);
  }
};

},{"./lib/compiler":2,"./lib/parser":3}],2:[function(require,module,exports){
"use strict";
function compile(nodes) {
  var assignedPaths = [];
  var valueAssignments = [];
  var currentPath = "";
  var data = Object.create(null);
  var context = data;
  var arrayMode = false;

  return reduce(nodes);

  function reduce(nodes) {
    var node;
    for (var i = 0; i < nodes.length; i++) {
      node = nodes[i];
      switch (node.type) {
      case "Assign":
        assign(node);
        break;
      case "ObjectPath":
        setPath(node);
        break;
      case "ArrayPath":
        addTableArray(node);
        break;
      }
    }

    return data;
  }

  function genError(err, line, col) {
    var ex = new Error(err);
    ex.line = line;
    ex.column = col;
    throw ex;
  }

  function assign(node) {
    var key = node.key;
    var value = node.value;
    var line = node.line;
    var column = node.column;

    var fullPath;
    if (currentPath) {
      fullPath = currentPath + "." + key;
    } else {
      fullPath = key;
    }
    if (typeof context[key] !== "undefined") {
      genError("Cannot redefine existing key '" + fullPath + "'.", line, column);
    }

    context[key] = reduceValueNode(value);

    if (!pathAssigned(fullPath)) {
      assignedPaths.push(fullPath);
      valueAssignments.push(fullPath);
    }
  }


  function pathAssigned(path) {
    return assignedPaths.indexOf(path) !== -1;
  }

  function reduceValueNode(node) {
    if (node.type === "Array") {
      return reduceArrayWithTypeChecking(node.value);
    } else if (node.type === "InlineTable") {
      return reduceInlineTableNode(node.value);
    } else {
      return node.value;
    }
  }

  function reduceInlineTableNode(values) {
    var obj = Object.create(null);
    for (var i = 0; i < values.length; i++) {
      var val = values[i];
      if (val.value.type === "InlineTable") {
        obj[val.key] = reduceInlineTableNode(val.value.value);
      } else if (val.type === "InlineTableValue") {
        obj[val.key] = reduceValueNode(val.value);
      }
    }

    return obj;
  }

  function setPath(node) {
    var path = node.value;
    var quotedPath = path.map(quoteDottedString).join(".");
    var line = node.line;
    var column = node.column;

    if (pathAssigned(quotedPath)) {
      genError("Cannot redefine existing key '" + path + "'.", line, column);
    }
    assignedPaths.push(quotedPath);
    context = deepRef(data, path, Object.create(null), line, column);
    currentPath = path;
  }

  function addTableArray(node) {
    var path = node.value;
    var quotedPath = path.map(quoteDottedString).join(".");
    var line = node.line;
    var column = node.column;

    if (!pathAssigned(quotedPath)) {
      assignedPaths.push(quotedPath);
    }
    assignedPaths = assignedPaths.filter(function(p) {
      return p.indexOf(quotedPath) !== 0;
    });
    assignedPaths.push(quotedPath);
    context = deepRef(data, path, [], line, column);
    currentPath = quotedPath;

    if (context instanceof Array) {
      var newObj = Object.create(null);
      context.push(newObj);
      context = newObj;
    } else {
      genError("Cannot redefine existing key '" + path + "'.", line, column);
    }
  }

  // Given a path 'a.b.c', create (as necessary) `start.a`,
  // `start.a.b`, and `start.a.b.c`, assigning `value` to `start.a.b.c`.
  // If `a` or `b` are arrays and have items in them, the last item in the
  // array is used as the context for the next sub-path.
  function deepRef(start, keys, value, line, column) {
    var traversed = [];
    var traversedPath = "";
    var path = keys.join(".");
    var ctx = start;

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      traversed.push(key);
      traversedPath = traversed.join(".");
      if (typeof ctx[key] === "undefined") {
        if (i === keys.length - 1) {
          ctx[key] = value;
        } else {
          ctx[key] = Object.create(null);
        }
      } else if (i !== keys.length - 1 && valueAssignments.indexOf(traversedPath) > -1) {
        // already a non-object value at key, can't be used as part of a new path
        genError("Cannot redefine existing key '" + traversedPath + "'.", line, column);
      }

      ctx = ctx[key];
      if (ctx instanceof Array && ctx.length && i < keys.length - 1) {
        ctx = ctx[ctx.length - 1];
      }
    }

    return ctx;
  }

  function reduceArrayWithTypeChecking(array) {
    // Ensure that all items in the array are of the same type
    var firstType = null;
    for (var i = 0; i < array.length; i++) {
      var node = array[i];
      if (firstType === null) {
        firstType = node.type;
      } else {
        if (node.type !== firstType) {
          genError("Cannot add value of type " + node.type + " to array of type " +
            firstType + ".", node.line, node.column);
        }
      }
    }

    // Recursively reduce array of nodes into array of the nodes' values
    return array.map(reduceValueNode);
  }

  function quoteDottedString(str) {
    if (str.indexOf(".") > -1) {
      return "\"" + str + "\"";
    } else {
      return str;
    }
  }
}

module.exports = {
  compile: compile
};

},{}],3:[function(require,module,exports){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = [],
        peg$c1 = function() { return nodes },
        peg$c2 = peg$FAILED,
        peg$c3 = "#",
        peg$c4 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c5 = void 0,
        peg$c6 = { type: "any", description: "any character" },
        peg$c7 = "[",
        peg$c8 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c9 = "]",
        peg$c10 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c11 = function(name) { addNode(node('ObjectPath', name, line, column)) },
        peg$c12 = function(name) { addNode(node('ArrayPath', name, line, column)) },
        peg$c13 = function(parts, name) { return parts.concat(name) },
        peg$c14 = function(name) { return [name] },
        peg$c15 = function(name) { return name },
        peg$c16 = ".",
        peg$c17 = { type: "literal", value: ".", description: "\".\"" },
        peg$c18 = "=",
        peg$c19 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c20 = function(key, value) { addNode(node('Assign', value, line, column, key)) },
        peg$c21 = function(chars) { return chars.join('') },
        peg$c22 = function(node) { return node.value },
        peg$c23 = "\"\"\"",
        peg$c24 = { type: "literal", value: "\"\"\"", description: "\"\\\"\\\"\\\"\"" },
        peg$c25 = null,
        peg$c26 = function(chars) { return node('String', chars.join(''), line, column) },
        peg$c27 = "\"",
        peg$c28 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c29 = "'''",
        peg$c30 = { type: "literal", value: "'''", description: "\"'''\"" },
        peg$c31 = "'",
        peg$c32 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c33 = function(char) { return char },
        peg$c34 = function(char) { return char},
        peg$c35 = "\\",
        peg$c36 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c37 = function() { return '' },
        peg$c38 = "e",
        peg$c39 = { type: "literal", value: "e", description: "\"e\"" },
        peg$c40 = "E",
        peg$c41 = { type: "literal", value: "E", description: "\"E\"" },
        peg$c42 = function(left, right) { return node('Float', parseFloat(left + 'e' + right), line, column) },
        peg$c43 = function(text) { return node('Float', parseFloat(text), line, column) },
        peg$c44 = "+",
        peg$c45 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c46 = function(digits) { return digits.join('') },
        peg$c47 = "-",
        peg$c48 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c49 = function(digits) { return '-' + digits.join('') },
        peg$c50 = function(text) { return node('Integer', parseInt(text, 10), line, column) },
        peg$c51 = "true",
        peg$c52 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c53 = function() { return node('Boolean', true, line, column) },
        peg$c54 = "false",
        peg$c55 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c56 = function() { return node('Boolean', false, line, column) },
        peg$c57 = function() { return node('Array', [], line, column) },
        peg$c58 = function(value) { return node('Array', value ? [value] : [], line, column) },
        peg$c59 = function(values) { return node('Array', values, line, column) },
        peg$c60 = function(values, value) { return node('Array', values.concat(value), line, column) },
        peg$c61 = function(value) { return value },
        peg$c62 = ",",
        peg$c63 = { type: "literal", value: ",", description: "\",\"" },
        peg$c64 = "{",
        peg$c65 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c66 = "}",
        peg$c67 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c68 = function(values) { return node('InlineTable', values, line, column) },
        peg$c69 = function(key, value) { return node('InlineTableValue', value, line, column, key) },
        peg$c70 = function(digits) { return "." + digits },
        peg$c71 = function(date) { return  date.join('') },
        peg$c72 = ":",
        peg$c73 = { type: "literal", value: ":", description: "\":\"" },
        peg$c74 = function(time) { return time.join('') },
        peg$c75 = "T",
        peg$c76 = { type: "literal", value: "T", description: "\"T\"" },
        peg$c77 = "Z",
        peg$c78 = { type: "literal", value: "Z", description: "\"Z\"" },
        peg$c79 = function(date, time) { return node('Date', new Date(date + "T" + time + "Z"), line, column) },
        peg$c80 = function(date, time) { return node('Date', new Date(date + "T" + time), line, column) },
        peg$c81 = /^[ \t]/,
        peg$c82 = { type: "class", value: "[ \\t]", description: "[ \\t]" },
        peg$c83 = "\n",
        peg$c84 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c85 = "\r",
        peg$c86 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c87 = /^[0-9a-f]/i,
        peg$c88 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c89 = /^[0-9]/,
        peg$c90 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c91 = "_",
        peg$c92 = { type: "literal", value: "_", description: "\"_\"" },
        peg$c93 = function() { return "" },
        peg$c94 = /^[A-Za-z0-9_\-]/,
        peg$c95 = { type: "class", value: "[A-Za-z0-9_\\-]", description: "[A-Za-z0-9_\\-]" },
        peg$c96 = function(d) { return d.join('') },
        peg$c97 = "\\\"",
        peg$c98 = { type: "literal", value: "\\\"", description: "\"\\\\\\\"\"" },
        peg$c99 = function() { return '"'  },
        peg$c100 = "\\\\",
        peg$c101 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c102 = function() { return '\\' },
        peg$c103 = "\\b",
        peg$c104 = { type: "literal", value: "\\b", description: "\"\\\\b\"" },
        peg$c105 = function() { return '\b' },
        peg$c106 = "\\t",
        peg$c107 = { type: "literal", value: "\\t", description: "\"\\\\t\"" },
        peg$c108 = function() { return '\t' },
        peg$c109 = "\\n",
        peg$c110 = { type: "literal", value: "\\n", description: "\"\\\\n\"" },
        peg$c111 = function() { return '\n' },
        peg$c112 = "\\f",
        peg$c113 = { type: "literal", value: "\\f", description: "\"\\\\f\"" },
        peg$c114 = function() { return '\f' },
        peg$c115 = "\\r",
        peg$c116 = { type: "literal", value: "\\r", description: "\"\\\\r\"" },
        peg$c117 = function() { return '\r' },
        peg$c118 = "\\U",
        peg$c119 = { type: "literal", value: "\\U", description: "\"\\\\U\"" },
        peg$c120 = function(digits) { return convertCodePoint(digits.join('')) },
        peg$c121 = "\\u",
        peg$c122 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$cache = {},
        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 0,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseline();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseline();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c1();
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseline() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 1,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseexpression();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parsecomment();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parsecomment();
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseNL();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseNL();
                }
              } else {
                s5 = peg$c2;
              }
              if (s5 === peg$FAILED) {
                s5 = peg$parseEOF();
              }
              if (s5 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4, s5];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseS();
          }
        } else {
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNL();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNL();
            }
          } else {
            s2 = peg$c2;
          }
          if (s2 === peg$FAILED) {
            s2 = peg$parseEOF();
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseNL();
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseexpression() {
      var s0;

      var key    = peg$currPos * 49 + 2,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsecomment();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepath();
        if (s0 === peg$FAILED) {
          s0 = peg$parsetablearray();
          if (s0 === peg$FAILED) {
            s0 = peg$parseassignment();
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 3,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseNL();
        if (s5 === peg$FAILED) {
          s5 = peg$parseEOF();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c5;
        } else {
          peg$currPos = s4;
          s4 = peg$c2;
        }
        if (s4 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s5 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c2;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseNL();
          if (s5 === peg$FAILED) {
            s5 = peg$parseEOF();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c5;
          } else {
            peg$currPos = s4;
            s4 = peg$c2;
          }
          if (s4 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsepath() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 4,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsetable_key();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c9;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c11(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetablearray() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      var key    = peg$currPos * 49 + 5,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c7;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parsetable_key();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s6 = peg$c9;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c10); }
                }
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c12(s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetable_key() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 6,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsedot_ended_table_key_part();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsedot_ended_table_key_part();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsetable_key_part();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c13(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsetable_key_part();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c14(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetable_key_part() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 7,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c15(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsequoted_key();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c15(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedot_ended_table_key_part() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 8,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c15(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsequoted_key();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s4 = peg$c16;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c17); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseS();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseS();
                }
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c15(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseassignment() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 9,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsekey();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s3 = peg$c18;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c19); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsevalue();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c20(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsequoted_key();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseS();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseS();
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s3 = peg$c18;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseS();
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseS();
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsevalue();
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c20(s1, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsekey() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 10,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseASCII_BASIC();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseASCII_BASIC();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c21(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsequoted_key() {
      var s0, s1;

      var key    = peg$currPos * 49 + 11,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsedouble_quoted_single_line_string();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c22(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsesingle_quoted_single_line_string();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c22(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsevalue() {
      var s0;

      var key    = peg$currPos * 49 + 12,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsestring();
      if (s0 === peg$FAILED) {
        s0 = peg$parsedatetime();
        if (s0 === peg$FAILED) {
          s0 = peg$parsefloat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseinteger();
            if (s0 === peg$FAILED) {
              s0 = peg$parseboolean();
              if (s0 === peg$FAILED) {
                s0 = peg$parsearray();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseinline_table();
                }
              }
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring() {
      var s0;

      var key    = peg$currPos * 49 + 13,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parsedouble_quoted_multiline_string();
      if (s0 === peg$FAILED) {
        s0 = peg$parsedouble_quoted_single_line_string();
        if (s0 === peg$FAILED) {
          s0 = peg$parsesingle_quoted_multiline_string();
          if (s0 === peg$FAILED) {
            s0 = peg$parsesingle_quoted_single_line_string();
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedouble_quoted_multiline_string() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 14,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c23) {
        s1 = peg$c23;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c24); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 === peg$FAILED) {
          s2 = peg$c25;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsemultiline_string_char();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsemultiline_string_char();
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c23) {
              s4 = peg$c23;
              peg$currPos += 3;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c24); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c26(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedouble_quoted_single_line_string() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 15,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c27;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c28); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsestring_char();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsestring_char();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c27;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesingle_quoted_multiline_string() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 16,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c29) {
        s1 = peg$c29;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 === peg$FAILED) {
          s2 = peg$c25;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsemultiline_literal_char();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsemultiline_literal_char();
          }
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 3) === peg$c29) {
              s4 = peg$c29;
              peg$currPos += 3;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c26(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesingle_quoted_single_line_string() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 17,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c31;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseliteral_char();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseliteral_char();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c31;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c26(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsestring_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 18,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseESCAPED();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c27;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }
        peg$silentFails--;
        if (s2 === peg$FAILED) {
          s1 = peg$c5;
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c33(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseliteral_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 19,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 39) {
        s2 = peg$c31;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c5;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c33(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_string_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 20,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseESCAPED();
      if (s0 === peg$FAILED) {
        s0 = peg$parsemultiline_string_delim();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 3) === peg$c23) {
            s2 = peg$c23;
            peg$currPos += 3;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c24); }
          }
          peg$silentFails--;
          if (s2 === peg$FAILED) {
            s1 = peg$c5;
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
          if (s1 !== peg$FAILED) {
            if (input.length > peg$currPos) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c34(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_string_delim() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 21,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 92) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseNL();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseNLS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseNLS();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c37();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsemultiline_literal_char() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 22,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c29) {
        s2 = peg$c29;
        peg$currPos += 3;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      peg$silentFails--;
      if (s2 === peg$FAILED) {
        s1 = peg$c5;
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        if (input.length > peg$currPos) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c6); }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c33(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefloat() {
      var s0, s1, s2, s3;

      var key    = peg$currPos * 49 + 23,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsefloat_text();
      if (s1 === peg$FAILED) {
        s1 = peg$parseinteger_text();
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 101) {
          s2 = peg$c38;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c39); }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 69) {
            s2 = peg$c40;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseinteger_text();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c42(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsefloat_text();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c43(s1);
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsefloat_text() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 24,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c44;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c25;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseDIGITS();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGITS();
            if (s5 !== peg$FAILED) {
              s3 = [s3, s4, s5];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c46(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseDIGITS();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseDIGITS();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c49(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinteger() {
      var s0, s1;

      var key    = peg$currPos * 49 + 25,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parseinteger_text();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c50(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinteger_text() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 26,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c44;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c25;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDIGIT_OR_UNDER();
          }
        } else {
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 46) {
            s4 = peg$c16;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
          peg$silentFails--;
          if (s4 === peg$FAILED) {
            s3 = peg$c5;
          } else {
            peg$currPos = s3;
            s3 = peg$c2;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c46(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c47;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseDIGIT_OR_UNDER();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseDIGIT_OR_UNDER();
            }
          } else {
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$currPos;
            peg$silentFails++;
            if (input.charCodeAt(peg$currPos) === 46) {
              s4 = peg$c16;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c17); }
            }
            peg$silentFails--;
            if (s4 === peg$FAILED) {
              s3 = peg$c5;
            } else {
              peg$currPos = s3;
              s3 = peg$c2;
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c49(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseboolean() {
      var s0, s1;

      var key    = peg$currPos * 49 + 27,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c51) {
        s1 = peg$c51;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c53();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 5) === peg$c54) {
          s1 = peg$c54;
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c55); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c56();
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 28,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c7;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsearray_sep();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsearray_sep();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c9;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c10); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c57();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c7;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsearray_value();
          if (s2 === peg$FAILED) {
            s2 = peg$c25;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c9;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c58(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c7;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parsearray_value_list();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parsearray_value_list();
              }
            } else {
              s2 = peg$c2;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c9;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c59(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
              s1 = peg$c7;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c8); }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              s3 = peg$parsearray_value_list();
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  s3 = peg$parsearray_value_list();
                }
              } else {
                s2 = peg$c2;
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parsearray_value();
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 93) {
                    s4 = peg$c9;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s4 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c60(s2, s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_value() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 29,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsearray_sep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsearray_sep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevalue();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsearray_sep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsearray_sep();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c61(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_value_list() {
      var s0, s1, s2, s3, s4, s5, s6;

      var key    = peg$currPos * 49 + 30,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsearray_sep();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsearray_sep();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevalue();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parsearray_sep();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parsearray_sep();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c62;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parsearray_sep();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parsearray_sep();
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c61(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsearray_sep() {
      var s0;

      var key    = peg$currPos * 49 + 31,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseS();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNL();
        if (s0 === peg$FAILED) {
          s0 = peg$parsecomment();
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinline_table() {
      var s0, s1, s2, s3, s4, s5;

      var key    = peg$currPos * 49 + 32,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c64;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c65); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseS();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseS();
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseinline_table_assignment();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseinline_table_assignment();
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseS();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseS();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 125) {
                s5 = peg$c66;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c67); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c68(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseinline_table_assignment() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 33,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseS();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseS();
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsekey();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseS();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseS();
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s4 = peg$c18;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c19); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseS();
              while (s6 !== peg$FAILED) {
                s5.push(s6);
                s6 = peg$parseS();
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parsevalue();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parseS();
                  while (s8 !== peg$FAILED) {
                    s7.push(s8);
                    s8 = peg$parseS();
                  }
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s8 = peg$c62;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c63); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = [];
                      s10 = peg$parseS();
                      while (s10 !== peg$FAILED) {
                        s9.push(s10);
                        s10 = peg$parseS();
                      }
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c69(s2, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c2;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c2;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseS();
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseS();
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsekey();
          if (s2 !== peg$FAILED) {
            s3 = [];
            s4 = peg$parseS();
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseS();
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s4 = peg$c18;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c19); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                s6 = peg$parseS();
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseS();
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsevalue();
                  if (s6 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c69(s2, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c2;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c2;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c2;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsesecfragment() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 34,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c16;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c17); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDIGITS();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c70(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedate() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

      var key    = peg$currPos * 49 + 35,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseDIGIT_OR_UNDER();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s6 = peg$c47;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c48); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseDIGIT_OR_UNDER();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 45) {
                      s9 = peg$c47;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c48); }
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseDIGIT_OR_UNDER();
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parseDIGIT_OR_UNDER();
                        if (s11 !== peg$FAILED) {
                          s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
                          s1 = s2;
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c71(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetime() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 36,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c72;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseDIGIT_OR_UNDER();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s7 = peg$c72;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseDIGIT_OR_UNDER();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsesecfragment();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c25;
                      }
                      if (s10 !== peg$FAILED) {
                        s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10];
                        s1 = s2;
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c74(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsetime_with_offset() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;

      var key    = peg$currPos * 49 + 37,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDIGIT_OR_UNDER();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 58) {
            s4 = peg$c72;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c73); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDIGIT_OR_UNDER();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseDIGIT_OR_UNDER();
              if (s6 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s7 = peg$c72;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseDIGIT_OR_UNDER();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseDIGIT_OR_UNDER();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsesecfragment();
                      if (s10 === peg$FAILED) {
                        s10 = peg$c25;
                      }
                      if (s10 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 45) {
                          s11 = peg$c47;
                          peg$currPos++;
                        } else {
                          s11 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c48); }
                        }
                        if (s11 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 43) {
                            s11 = peg$c44;
                            peg$currPos++;
                          } else {
                            s11 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c45); }
                          }
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parseDIGIT_OR_UNDER();
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parseDIGIT_OR_UNDER();
                            if (s13 !== peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 58) {
                                s14 = peg$c72;
                                peg$currPos++;
                              } else {
                                s14 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c73); }
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parseDIGIT_OR_UNDER();
                                if (s15 !== peg$FAILED) {
                                  s16 = peg$parseDIGIT_OR_UNDER();
                                  if (s16 !== peg$FAILED) {
                                    s2 = [s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16];
                                    s1 = s2;
                                  } else {
                                    peg$currPos = s1;
                                    s1 = peg$c2;
                                  }
                                } else {
                                  peg$currPos = s1;
                                  s1 = peg$c2;
                                }
                              } else {
                                peg$currPos = s1;
                                s1 = peg$c2;
                              }
                            } else {
                              peg$currPos = s1;
                              s1 = peg$c2;
                            }
                          } else {
                            peg$currPos = s1;
                            s1 = peg$c2;
                          }
                        } else {
                          peg$currPos = s1;
                          s1 = peg$c2;
                        }
                      } else {
                        peg$currPos = s1;
                        s1 = peg$c2;
                      }
                    } else {
                      peg$currPos = s1;
                      s1 = peg$c2;
                    }
                  } else {
                    peg$currPos = s1;
                    s1 = peg$c2;
                  }
                } else {
                  peg$currPos = s1;
                  s1 = peg$c2;
                }
              } else {
                peg$currPos = s1;
                s1 = peg$c2;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$c2;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$c2;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c2;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c74(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parsedatetime() {
      var s0, s1, s2, s3, s4;

      var key    = peg$currPos * 49 + 38,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = peg$parsedate();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 84) {
          s2 = peg$c75;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsetime();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 90) {
              s4 = peg$c77;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c78); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c79(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsedate();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 84) {
            s2 = peg$c75;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c76); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsetime_with_offset();
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c80(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c2;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseS() {
      var s0;

      var key    = peg$currPos * 49 + 39,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c81.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c82); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseNL() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 40,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c83;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c84); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 13) {
          s1 = peg$c85;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c86); }
        }
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 10) {
            s2 = peg$c83;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c84); }
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseNLS() {
      var s0;

      var key    = peg$currPos * 49 + 41,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$parseNL();
      if (s0 === peg$FAILED) {
        s0 = peg$parseS();
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      var key    = peg$currPos * 49 + 42,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c5;
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseHEX() {
      var s0;

      var key    = peg$currPos * 49 + 43,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c87.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c88); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseDIGIT_OR_UNDER() {
      var s0, s1;

      var key    = peg$currPos * 49 + 44,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c89.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 95) {
          s1 = peg$c91;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c92); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c93();
        }
        s0 = s1;
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseASCII_BASIC() {
      var s0;

      var key    = peg$currPos * 49 + 45,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      if (peg$c94.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c95); }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseDIGITS() {
      var s0, s1, s2;

      var key    = peg$currPos * 49 + 46,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseDIGIT_OR_UNDER();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseDIGIT_OR_UNDER();
        }
      } else {
        s1 = peg$c2;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c96(s1);
      }
      s0 = s1;

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseESCAPED() {
      var s0, s1;

      var key    = peg$currPos * 49 + 47,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c97) {
        s1 = peg$c97;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c99();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c100) {
          s1 = peg$c100;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c101); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c102();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c103) {
            s1 = peg$c103;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c104); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c105();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c106) {
              s1 = peg$c106;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c107); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c108();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c109) {
                s1 = peg$c109;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c110); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c111();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c112) {
                  s1 = peg$c112;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c113); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c114();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c115) {
                    s1 = peg$c115;
                    peg$currPos += 2;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c116); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c117();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseESCAPED_UNICODE();
                  }
                }
              }
            }
          }
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }

    function peg$parseESCAPED_UNICODE() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

      var key    = peg$currPos * 49 + 48,
          cached = peg$cache[key];

      if (cached) {
        peg$currPos = cached.nextPos;
        return cached.result;
      }

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c118) {
        s1 = peg$c118;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseHEX();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseHEX();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseHEX();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseHEX();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseHEX();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseHEX();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseHEX();
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parseHEX();
                      if (s10 !== peg$FAILED) {
                        s3 = [s3, s4, s5, s6, s7, s8, s9, s10];
                        s2 = s3;
                      } else {
                        peg$currPos = s2;
                        s2 = peg$c2;
                      }
                    } else {
                      peg$currPos = s2;
                      s2 = peg$c2;
                    }
                  } else {
                    peg$currPos = s2;
                    s2 = peg$c2;
                  }
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$c2;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c120(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c2;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c121) {
          s1 = peg$c121;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c122); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseHEX();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseHEX();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseHEX();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseHEX();
                if (s6 !== peg$FAILED) {
                  s3 = [s3, s4, s5, s6];
                  s2 = s3;
                } else {
                  peg$currPos = s2;
                  s2 = peg$c2;
                }
              } else {
                peg$currPos = s2;
                s2 = peg$c2;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$c2;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c2;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c120(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c2;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c2;
        }
      }

      peg$cache[key] = { nextPos: peg$currPos, result: s0 };

      return s0;
    }


      var nodes = [];

      function genError(err, line, col) {
        var ex = new Error(err);
        ex.line = line;
        ex.column = col;
        throw ex;
      }

      function addNode(node) {
        nodes.push(node);
      }

      function node(type, value, line, column, key) {
        var obj = { type: type, value: value, line: line(), column: column() };
        if (key) obj.key = key;
        return obj;
      }

      function convertCodePoint(str, line, col) {
        var num = parseInt("0x" + str);

        if (
          !isFinite(num) ||
          Math.floor(num) != num ||
          num < 0 ||
          num > 0x10FFFF ||
          (num > 0xD7FF && num < 0xE000)
        ) {
          genError("Invalid Unicode escape code: " + str, line, col);
        } else {
          return fromCodePoint(num);
        }
      }

      function fromCodePoint() {
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = arguments.length;
        if (!length) {
          return '';
        }
        var result = '';
        while (++index < length) {
          var codePoint = Number(arguments[index]);
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint);
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000;
            highSurrogate = (codePoint >> 10) + 0xD800;
            lowSurrogate = (codePoint % 0x400) + 0xDC00;
            codeUnits.push(highSurrogate, lowSurrogate);
          }
          if (index + 1 == length || codeUnits.length > MAX_SIZE) {
            result += String.fromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
          }
        }
        return result;
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();

},{}]},{},[1])(1)
});


/***/ }),

/***/ 245:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(402).Glob
var util = __webpack_require__(669)
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 247:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const tty = __webpack_require__(867);
const hasFlag = __webpack_require__(364);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 250:
/***/ (function(module, __unusedexports, __webpack_require__) {

var constants = __webpack_require__(619)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
  var chdir = process.chdir
  process.chdir = function (d) {
    cwd = null
    chdir.call(process, d)
  }
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ 259:
/***/ (function(module) {

module.exports = class PragmaNotFound extends ReferenceError {
  constructor ({ line, column }) {
    super(`opening @pragma not found (line: ${1} column: ${1})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 260:
/***/ (function(module, __unusedexports, __webpack_require__) {

const conversions = __webpack_require__(445);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 295:
/***/ (function(module) {

let patterns = {
  looseName: new RegExp(/^[a-z][a-zA-Z0-9-_]+$/),
  strictName: new RegExp(/^[a-z][a-z0-9-]+$/),
}

function regex (value, pattern, pragma) {
  let matching = typeof pattern === 'string' ? patterns[pattern] : pattern
  if (!matching.test(value)) {
    throw Error(`Invalid ${pragma} value: ${value} must match ${pattern}`)
  }
}

function size (value, num, pragma) {
  if (typeof value !== 'string') throw Error(`Value must be a string: ${value}`)
  if (typeof num !== 'number') throw Error(`validate.size requires a number: ${num}`)
  if (value.length > num) throw Error(`Invalid ${pragma} value: ${value} must less than ${num} characters`)
}

module.exports = {
  patterns,
  regex,
  size,
}


/***/ }),

/***/ 300:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { existsSync, lstatSync } = __webpack_require__(747)

module.exports = {
  // Types
  array: item => Array.isArray(item),
  bool: item => typeof item === 'boolean',
  object: item => typeof item === 'object' && !Array.isArray(item),
  string: item => typeof item === 'string',
  // Filesystem
  exists: path => existsSync(path),
  folder: path => lstatSync(path).isDirectory(),
}


/***/ }),

/***/ 302:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(117)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 305:
/***/ (function(module) {

/**
 * Overlay / append properties onto an existing config object
 *
 * @param {object} config - An existing Lambda config object
 * @param {object} newConfig - Arc-parsed Lambda config object to be overlaid or appended to `config`
 * @returns {object}
 */
module.exports = function upsertProps (config, newConfig) {
  let props = JSON.parse(JSON.stringify(config))
  let layers = []
  let policies = []

  for (let setting of newConfig) {
    let name
    let value

    /**
     * Normalize singular vs. plural and array vs. object syntax of settings
     *
     * Examples:
     * ---
     * policies foobar
     * → arc.aws: [[ 'policies', 'foobar' ]]
     * ---
     * policies
     *   foobar
     * → arc.aws: [{ policies: [ 'foobar' ] }]
     */
    if (Array.isArray(setting)) {
      // Normalize singular to AWS equivalents
      if (setting[0] === 'policy') setting[0] = 'policies'
      if (setting[0] === 'layer') setting[0] = 'layers'
      name = setting[0]
      value = setting[1]
    }
    else if (typeof setting === 'object') {
      // Normalize singular to AWS equivalents
      if (setting.policy) {
        setting.policies = setting.policy
        delete setting.policy
      }
      if (setting.layer) {
        setting.layers = setting.layer
        delete setting.layer
      }
      name = Object.keys(setting)[0]
      value = setting[name]
    }
    else continue // Technically invalid and should have been caught by parser

    /**
     * Populate default config with new properties
     */
    if (name === 'layers' && !!(value)) {
      if (Array.isArray(value)) layers = layers.concat(value)
      else layers.push(value)
    }
    else if (name === 'policies' && !!(value)) {
      if (Array.isArray(value)) policies = policies.concat(value)
      else policies.push(value)
    }
    else if (typeof value !== 'undefined') {
      props[name] = value
    }
  }

  // Drop in new (de-duped) layers, but don't unnecessarily overwrite
  if (layers.length) props.layers = [ ...new Set(layers) ]
  if (policies.length) props.policies = [ ...new Set(policies) ]

  return props
}


/***/ }),

/***/ 306:
/***/ (function(module, __unusedexports, __webpack_require__) {

var concatMap = __webpack_require__(896);
var balanced = __webpack_require__(621);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 314:
/***/ (function(module, __unusedexports, __webpack_require__) {

let chalk = __webpack_require__(843)
let chars = __webpack_require__(438)
let initAWS = __webpack_require__(546)

module.exports = function printBanner (params = {}) {
  let {
    inventory,
    disableBanner,
    disableRegion,
    disableProfile,
    needsValidCreds,
    version = '–'
  } = params
  let quiet = process.env.ARC_QUIET || process.env.QUIET

  if (disableBanner) return
  else {
    // Boilerplate
    let log = (label, value) => {
      if (!quiet) {
        console.log(chalk.grey(`${label.padStart(12)} ${chars.buzz}`), chalk.cyan(value))
      }
    }

    // Initialize config
    process.env.ARC_APP_NAME = inventory.inv.app
    initAWS({ inventory, needsValidCreds })

    // App name
    let name = process.env.ARC_APP_NAME || 'Architect project manifest not found'
    log('App', name)

    // Region
    let region = process.env.AWS_REGION || '@aws region / AWS_REGION not configured'
    if (!disableRegion) {
      log('Region', region)
    }

    // Profile
    let profile = process.env.ARC_AWS_CREDS === 'env'
      ? 'Set via environment'
      : process.env.AWS_PROFILE || '@aws profile / AWS_PROFILE not configured'
    if (!disableProfile) {
      log('Profile', profile)
    }

    // Caller version
    // Also: set deprecation status for legacy Arc installs
    log('Version', version)
    if (version.startsWith('Architect 5')) {
      process.env.DEPRECATED = true
    }

    // cwd
    log('cwd', process.cwd())

    // Space
    if (!quiet) {
      console.log()
    }
  }
}


/***/ }),

/***/ 315:
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 318:
/***/ (function(module, __unusedexports, __webpack_require__) {

const notempty = __webpack_require__(455)
const SpaceError = __webpack_require__(185)
const NameError = __webpack_require__(58)
const KeyError = __webpack_require__(63)

/**
 * extracts a map value
 *
 * @param {lines}
 * @param {number} index
 * @returns {object} {end, value}
 */
module.exports = function map (lines) {

  // extract the `name` and create the `end` index
  let copy = lines.slice(0)
  let end = copy[0].length + 1 // length of the current line plus one for the line
  let raw = copy.shift().filter(notempty)[0]
  let name = raw.value

  if (!name || raw.type != 'string')
    throw new NameError(lines[0][0])

  // final state to return for the map token
  let value = {}
  value[name] = {}

  // keep score
  let last = false
  let done = false

  while (!done) {
    // figure out the indentation of the next line
    let line = copy.shift()
    let { onespace, twospace, threespace, fourspace, fivespace } = spaces(line)

    if (onespace || threespace || fivespace)
      throw new SpaceError(line[0])

    if (fourspace && done === false) {

      // four spaces signals a vector value
      if (line.filter(notempty).length > 1)
        throw new KeyError(line[0])
      end += 1 // one for the line
      end += line.length // for all the tokens in the given line
      let right = line.filter(notempty)[0].value
      value[name][last].push(right)
    }
    else if (twospace && done === false) {

      // two spaces signals a key/value
      end += 1 // one for the line
      end += line.length // for all the tokens in the given line
      let right = line.filter(notempty).slice(0)
      let left = right.shift()
      if (left.type != 'string')
        throw new KeyError(left)
      last = left.value // reuse this for vert vector trapping
      value[name][left.value] = right.length === 1 ? right[0].value : right.map(t => t.value)
    }
    else {

      // indentation is over: we out
      done = true
    }
  }
  return { end, value }
}

/** hide this here */
function spaces (line) {
  if (!Array.isArray(line))
    return { onespace: false, twospace: false, threespace: false, fourspace: false, fivespace: false }
  let onespace = line.length > 2 && line[0].type == 'space' && line[1].type != 'space'
  let twospace = line.length > 2 && line[0].type == 'space' && line[1].type == 'space'
  let threespace = line.length >= 4 && line[0].type == 'space' && line[1].type == 'space' && line[2].type == 'space' && line[3].type != 'space'
  let fourspace = line.length >= 5 && line[0].type == 'space' && line[1].type == 'space' && line[2].type == 'space' && line[3].type == 'space'
  let fivespace = line.length >= 5 && line[0].type == 'space' && line[1].type == 'space' && line[2].type == 'space' && line[3].type == 'space' && line[4].type == 'space'
  return { onespace, twospace, threespace, fourspace, fivespace }
}


/***/ }),

/***/ 322:
/***/ (function(module, __unusedexports, __webpack_require__) {

let series = __webpack_require__(712)
let layers = __webpack_require__(597)
let tablesChildren = __webpack_require__(156)
let lambdaPragmas = __webpack_require__(517)

/**
 * Final inventory validation
 */
module.exports = function validate (params, inventory, callback) {
  let { region } = inventory.aws
  let { cwd, validateLayers = true } = params

  // Walk the tree of layer configs, starting with @aws
  let layerValidations = []
  Object.entries(inventory).forEach(([ i ]) => {
    let item = inventory[i]
    if (i === 'aws') {
      let location = inventory._project.manifest &&
                     inventory._project.manifest.replace(cwd, '')
      let layers = item.layers
      layerValidations.push({ layers, region, location })
    }
    else if (lambdaPragmas.some(p => p === i) && item) {
      item.forEach(entry => {
        // Probably unnecessary if no configFile is present but why not, let's be extra safe
        let location = entry.configFile && entry.configFile.replace(cwd, '')
        let layers = entry.config.layers
        layerValidations.push({ layers, region, location })
      })
    }
  })

  let validations = layerValidations.map(params => {
    return function (callback) {
      if (validateLayers) layers(params, callback)
      else callback()
    }
  })

  // Ensure @tables children (@streams, @indexes) have parent tables present
  validations.push(function (callback) {
    tablesChildren(inventory, callback)
  })

  series(validations, callback)
}


/***/ }),

/***/ 332:
/***/ (function(module, __unusedexports, __webpack_require__) {

let fnConfig = __webpack_require__(80)

/**
 * Returns a default stub inventory object
 * - Every possible officially supported value should be present
 */
module.exports = function inventoryDefaults (params = {}) {
  let { cwd, region } = params
  // Allow region env var override
  region = process.env.AWS_REGION || region || 'us-west-2'
  let defaultFunctionConfig = fnConfig()
  return {
    // Meta
    _arc: {
      version: 'Unknown',     // @architect/architect semver (if installed)
      defaultFunctionConfig,  // Architect's default function config
    },
    _project: {
      type: 'aws',
      src: cwd,
      manifest: null,               // Root project manifest filename
      // manifestCreated            // TODO
      preferences: null,            // Realized preferences obj, resolved from global > local
      localPreferences: null,       // Local preferences obj
      localPreferencesFile: null,   // Local preferences file path
      globalPreferences: null,      // Global preferences obj
      globalPreferencesFile: null,  // Global preferences file path
      defaultFunctionConfig,        // Project-level function config
      rootHandler: null,            // null | configured | arcStaticAssetProxy | proxy
      plugins: null,                // `require`d plugin modules as a map of plugin name to module
      arc: [],                      // Raw arc obj
      raw: '',                      // Raw arc string
      env: null,                    // Env vars pulled from SSM (if enabled)
    },
    // App + vendor config
    app: '',
    aws: {
      apigateway: null,
      bucket: null,
      concurrency: null,
      layers: null,
      memory: null,
      policies: null,
      profile: null,
      region,                 // AWS always requires a region, so we provide a default
      runtime: null,
      timeout: null,
    },
    // App pragmas
    cdn: null,
    events: null,
    http: null,
    indexes: null,
    macros: null,
    plugins: null, // these are the lambdas created by plugins, not the plugin modules; modules are up under _project
    proxy: null,
    queues: null,
    scheduled: null,
    shared: null,
    static: null,
    streams: null,
    tables: null,
    views: null,
    ws: null,
    // Collection of all Function paths
    lambdaSrcDirs: null,
    // Lambda lookup by source directory
    lambdasBySrcDir: null,
  }
}


/***/ }),

/***/ 346:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

module.exports = function configureScheduled ({ arc, inventory }) {
  if (!arc.scheduled || !arc.scheduled.length) return null

  let scheduled = populate.scheduled(arc.scheduled, inventory)

  return scheduled
}


/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 358:
/***/ (function(module) {

!function(e){if(true)module.exports=e();else {}}(function(){return function o(a,s,c){function u(t,e){if(!s[t]){if(!a[t]){var n= true&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}var r=s[t]={exports:{}};a[t][0].call(r.exports,function(e){return u(a[t][1][e]||e)},r,r.exports,o,a,s,c)}return s[t].exports}for(var l= true&&require,e=0;e<c.length;e++)u(c[e]);return u}({1:[function(e,t,n){"use strict";var i=e("./js-yaml/loader"),r=e("./js-yaml/dumper");function o(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}t.exports.Type=e("./js-yaml/type"),t.exports.Schema=e("./js-yaml/schema"),t.exports.FAILSAFE_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.JSON_SCHEMA=e("./js-yaml/schema/json"),t.exports.CORE_SCHEMA=e("./js-yaml/schema/core"),t.exports.DEFAULT_SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_FULL_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.load=i.load,t.exports.loadAll=i.loadAll,t.exports.safeLoad=i.safeLoad,t.exports.safeLoadAll=i.safeLoadAll,t.exports.dump=r.dump,t.exports.safeDump=r.safeDump,t.exports.YAMLException=e("./js-yaml/exception"),t.exports.MINIMAL_SCHEMA=e("./js-yaml/schema/failsafe"),t.exports.SAFE_SCHEMA=e("./js-yaml/schema/default_safe"),t.exports.DEFAULT_SCHEMA=e("./js-yaml/schema/default_full"),t.exports.scan=o("scan"),t.exports.parse=o("parse"),t.exports.compose=o("compose"),t.exports.addConstructor=o("addConstructor")},{"./js-yaml/dumper":3,"./js-yaml/exception":4,"./js-yaml/loader":5,"./js-yaml/schema":7,"./js-yaml/schema/core":8,"./js-yaml/schema/default_full":9,"./js-yaml/schema/default_safe":10,"./js-yaml/schema/failsafe":11,"./js-yaml/schema/json":12,"./js-yaml/type":13}],2:[function(e,t,n){"use strict";function i(e){return null==e}t.exports.isNothing=i,t.exports.isObject=function(e){return"object"==typeof e&&null!==e},t.exports.toArray=function(e){return Array.isArray(e)?e:i(e)?[]:[e]},t.exports.repeat=function(e,t){var n,i="";for(n=0;n<t;n+=1)i+=e;return i},t.exports.isNegativeZero=function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},t.exports.extend=function(e,t){var n,i,r,o;if(t)for(n=0,i=(o=Object.keys(t)).length;n<i;n+=1)e[r=o[n]]=t[r];return e}},{}],3:[function(e,t,n){"use strict";var c=e("./common"),d=e("./exception"),i=e("./schema/default_full"),r=e("./schema/default_safe"),p=Object.prototype.toString,u=Object.prototype.hasOwnProperty,o=9,h=10,a=32,f=33,m=34,g=35,y=37,x=38,v=39,A=42,b=44,w=45,C=58,k=62,j=63,S=64,I=91,O=93,E=96,F=123,_=124,N=125,s={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},l=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function M(e){var t,n,i;if(t=e.toString(16).toUpperCase(),e<=255)n="x",i=2;else if(e<=65535)n="u",i=4;else{if(!(e<=4294967295))throw new d("code point within a string may not be greater than 0xFFFFFFFF");n="U",i=8}return"\\"+n+c.repeat("0",i-t.length)+t}function T(e){this.schema=e.schema||i,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=c.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var n,i,r,o,a,s,c;if(null===t)return{};for(n={},r=0,o=(i=Object.keys(t)).length;r<o;r+=1)a=i[r],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&u.call(c.styleAliases,s)&&(s=c.styleAliases[s]),n[a]=s;return n}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function L(e,t){for(var n,i=c.repeat(" ",t),r=0,o=-1,a="",s=e.length;r<s;)r=-1===(o=e.indexOf("\n",r))?(n=e.slice(r),s):(n=e.slice(r,o+1),o+1),n.length&&"\n"!==n&&(a+=i),a+=n;return a}function D(e,t){return"\n"+c.repeat(" ",e.indent*t)}function U(e){return e===a||e===o}function q(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function Y(e){return q(e)&&65279!==e&&e!==b&&e!==I&&e!==O&&e!==F&&e!==N&&e!==C&&e!==g}function R(e){return/^\n* /.test(e)}var B=1,P=2,W=3,K=4,$=5;function H(e,t,n,i,r){var o,a,s=!1,c=!1,u=-1!==i,l=-1,p=function(e){return q(e)&&65279!==e&&!U(e)&&e!==w&&e!==j&&e!==C&&e!==b&&e!==I&&e!==O&&e!==F&&e!==N&&e!==g&&e!==x&&e!==A&&e!==f&&e!==_&&e!==k&&e!==v&&e!==m&&e!==y&&e!==S&&e!==E}(e.charCodeAt(0))&&!U(e.charCodeAt(e.length-1));if(t)for(o=0;o<e.length;o++){if(!q(a=e.charCodeAt(o)))return $;p=p&&Y(a)}else{for(o=0;o<e.length;o++){if((a=e.charCodeAt(o))===h)s=!0,u&&(c=c||i<o-l-1&&" "!==e[l+1],l=o);else if(!q(a))return $;p=p&&Y(a)}c=c||u&&i<o-l-1&&" "!==e[l+1]}return s||c?9<n&&R(e)?$:c?K:W:p&&!r(e)?B:P}function G(i,r,o,a){i.dump=function(){if(0===r.length)return"''";if(!i.noCompatMode&&-1!==l.indexOf(r))return"'"+r+"'";var e=i.indent*Math.max(1,o),t=-1===i.lineWidth?-1:Math.max(Math.min(i.lineWidth,40),i.lineWidth-e),n=a||-1<i.flowLevel&&o>=i.flowLevel;switch(H(r,n,i.indent,t,function(e){return function(e,t){var n,i;for(n=0,i=e.implicitTypes.length;n<i;n+=1)if(e.implicitTypes[n].resolve(t))return!0;return!1}(i,e)})){case B:return r;case P:return"'"+r.replace(/'/g,"''")+"'";case W:return"|"+V(r,i.indent)+Z(L(r,e));case K:return">"+V(r,i.indent)+Z(L(function(t,n){var e,i,r=/(\n+)([^\n]*)/g,o=function(){var e=t.indexOf("\n");return e=-1!==e?e:t.length,r.lastIndex=e,z(t.slice(0,e),n)}(),a="\n"===t[0]||" "===t[0];for(;i=r.exec(t);){var s=i[1],c=i[2];e=" "===c[0],o+=s+(a||e||""===c?"":"\n")+z(c,n),a=e}return o}(r,t),e));case $:return'"'+function(e){for(var t,n,i,r="",o=0;o<e.length;o++)55296<=(t=e.charCodeAt(o))&&t<=56319&&56320<=(n=e.charCodeAt(o+1))&&n<=57343?(r+=M(1024*(t-55296)+n-56320+65536),o++):(i=s[t],r+=!i&&q(t)?e[o]:i||M(t));return r}(r)+'"';default:throw new d("impossible error: invalid scalar style")}}()}function V(e,t){var n=R(e)?String(t):"",i="\n"===e[e.length-1];return n+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function Z(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function z(e,t){if(""===e||" "===e[0])return e;for(var n,i,r=/ [^ ]/g,o=0,a=0,s=0,c="";n=r.exec(e);)t<(s=n.index)-o&&(i=o<a?a:s,c+="\n"+e.slice(o,i),o=i+1),a=s;return c+="\n",e.length-o>t&&o<a?c+=e.slice(o,a)+"\n"+e.slice(a+1):c+=e.slice(o),c.slice(1)}function J(e,t,n){var i,r,o,a,s,c;for(o=0,a=(r=n?e.explicitTypes:e.implicitTypes).length;o<a;o+=1)if(((s=r[o]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(e.tag=n?s.tag:"?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===p.call(s.represent))i=s.represent(t,c);else{if(!u.call(s.represent,c))throw new d("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');i=s.represent[c](t,c)}e.dump=i}return!0}return!1}function Q(e,t,n,i,r,o){e.tag=null,e.dump=n,J(e,n,!1)||J(e,n,!0);var a=p.call(e.dump);i&&(i=e.flowLevel<0||e.flowLevel>t);var s,c,u="[object Object]"===a||"[object Array]"===a;if(u&&(c=-1!==(s=e.duplicates.indexOf(n))),(null!==e.tag&&"?"!==e.tag||c||2!==e.indent&&0<t)&&(r=!1),c&&e.usedDuplicates[s])e.dump="*ref_"+s;else{if(u&&c&&!e.usedDuplicates[s]&&(e.usedDuplicates[s]=!0),"[object Object]"===a)i&&0!==Object.keys(e.dump).length?(function(e,t,n,i){var r,o,a,s,c,u,l="",p=e.tag,f=Object.keys(n);if(!0===e.sortKeys)f.sort();else if("function"==typeof e.sortKeys)f.sort(e.sortKeys);else if(e.sortKeys)throw new d("sortKeys must be a boolean or a function");for(r=0,o=f.length;r<o;r+=1)u="",i&&0===r||(u+=D(e,t)),s=n[a=f[r]],Q(e,t+1,a,!0,!0,!0)&&((c=null!==e.tag&&"?"!==e.tag||e.dump&&1024<e.dump.length)&&(e.dump&&h===e.dump.charCodeAt(0)?u+="?":u+="? "),u+=e.dump,c&&(u+=D(e,t)),Q(e,t+1,s,!0,c)&&(e.dump&&h===e.dump.charCodeAt(0)?u+=":":u+=": ",l+=u+=e.dump));e.tag=p,e.dump=l||"{}"}(e,t,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(function(e,t,n){var i,r,o,a,s,c="",u=e.tag,l=Object.keys(n);for(i=0,r=l.length;i<r;i+=1)s=e.condenseFlow?'"':"",0!==i&&(s+=", "),a=n[o=l[i]],Q(e,t,o,!1,!1)&&(1024<e.dump.length&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Q(e,t,a,!1,!1)&&(c+=s+=e.dump));e.tag=u,e.dump="{"+c+"}"}(e,t,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump));else if("[object Array]"===a){var l=e.noArrayIndent&&0<t?t-1:t;i&&0!==e.dump.length?(function(e,t,n,i){var r,o,a="",s=e.tag;for(r=0,o=n.length;r<o;r+=1)Q(e,t+1,n[r],!0,!0)&&(i&&0===r||(a+=D(e,t)),e.dump&&h===e.dump.charCodeAt(0)?a+="-":a+="- ",a+=e.dump);e.tag=s,e.dump=a||"[]"}(e,l,e.dump,r),c&&(e.dump="&ref_"+s+e.dump)):(function(e,t,n){var i,r,o="",a=e.tag;for(i=0,r=n.length;i<r;i+=1)Q(e,t,n[i],!1,!1)&&(0!==i&&(o+=","+(e.condenseFlow?"":" ")),o+=e.dump);e.tag=a,e.dump="["+o+"]"}(e,l,e.dump),c&&(e.dump="&ref_"+s+" "+e.dump))}else{if("[object String]"!==a){if(e.skipInvalid)return!1;throw new d("unacceptable kind of an object to dump "+a)}"?"!==e.tag&&G(e,e.dump,t,o)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function X(e,t){var n,i,r=[],o=[];for(function e(t,n,i){var r,o,a;if(null!==t&&"object"==typeof t)if(-1!==(o=n.indexOf(t)))-1===i.indexOf(o)&&i.push(o);else if(n.push(t),Array.isArray(t))for(o=0,a=t.length;o<a;o+=1)e(t[o],n,i);else for(r=Object.keys(t),o=0,a=r.length;o<a;o+=1)e(t[r[o]],n,i)}(e,r,o),n=0,i=o.length;n<i;n+=1)t.duplicates.push(r[o[n]]);t.usedDuplicates=new Array(i)}function ee(e,t){var n=new T(t=t||{});return n.noRefs||X(e,n),Q(n,0,e,!0,!0)?n.dump+"\n":""}t.exports.dump=ee,t.exports.safeDump=function(e,t){return ee(e,c.extend({schema:r},t))}},{"./common":2,"./exception":4,"./schema/default_full":9,"./schema/default_safe":10}],4:[function(e,t,n){"use strict";function i(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}((i.prototype=Object.create(Error.prototype)).constructor=i).prototype.toString=function(e){var t=this.name+": ";return t+=this.reason||"(unknown reason)",!e&&this.mark&&(t+=" "+this.mark.toString()),t},t.exports=i},{}],5:[function(e,t,n){"use strict";var g=e("./common"),i=e("./exception"),r=e("./mark"),o=e("./schema/default_safe"),a=e("./schema/default_full"),y=Object.prototype.hasOwnProperty,x=1,v=2,A=3,b=4,w=1,C=2,k=3,c=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,s=/[\x85\u2028\u2029]/,u=/[,\[\]\{\}]/,l=/^(?:!|!!|![a-z\-]+!)$/i,p=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function f(e){return Object.prototype.toString.call(e)}function j(e){return 10===e||13===e}function S(e){return 9===e||32===e}function I(e){return 9===e||32===e||10===e||13===e}function O(e){return 44===e||91===e||93===e||123===e||125===e}function d(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e?"\t":9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}for(var E=new Array(256),F=new Array(256),h=0;h<256;h++)E[h]=d(h)?1:0,F[h]=d(h);function m(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||a,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function _(e,t){return new i(t,new r(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function N(e,t){throw _(e,t)}function M(e,t){e.onWarning&&e.onWarning.call(null,_(e,t))}var T={YAML:function(e,t,n){var i,r,o;null!==e.version&&N(e,"duplication of %YAML directive"),1!==n.length&&N(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]))&&N(e,"ill-formed argument of the YAML directive"),r=parseInt(i[1],10),o=parseInt(i[2],10),1!==r&&N(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&M(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,r;2!==n.length&&N(e,"TAG directive accepts exactly two arguments"),i=n[0],r=n[1],l.test(i)||N(e,"ill-formed tag handle (first argument) of the TAG directive"),y.call(e.tagMap,i)&&N(e,'there is a previously declared suffix for "'+i+'" tag handle'),p.test(r)||N(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[i]=r}};function L(e,t,n,i){var r,o,a,s;if(t<n){if(s=e.input.slice(t,n),i)for(r=0,o=s.length;r<o;r+=1)9===(a=s.charCodeAt(r))||32<=a&&a<=1114111||N(e,"expected valid JSON character");else c.test(s)&&N(e,"the stream contains non-printable characters");e.result+=s}}function D(e,t,n,i){var r,o,a,s;for(g.isObject(n)||N(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(r=Object.keys(n)).length;a<s;a+=1)o=r[a],y.call(t,o)||(t[o]=n[o],i[o]=!0)}function U(e,t,n,i,r,o,a,s){var c,u;if(Array.isArray(r))for(c=0,u=(r=Array.prototype.slice.call(r)).length;c<u;c+=1)Array.isArray(r[c])&&N(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===f(r[c])&&(r[c]="[object Object]");if("object"==typeof r&&"[object Object]"===f(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(o))for(c=0,u=o.length;c<u;c+=1)D(e,t,o[c],n);else D(e,t,o,n);else e.json||y.call(n,r)||!y.call(t,r)||(e.line=a||e.line,e.position=s||e.position,N(e,"duplicated mapping key")),t[r]=o,delete n[r];return t}function q(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):N(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function Y(e,t,n){for(var i=0,r=e.input.charCodeAt(e.position);0!==r;){for(;S(r);)r=e.input.charCodeAt(++e.position);if(t&&35===r)for(;10!==(r=e.input.charCodeAt(++e.position))&&13!==r&&0!==r;);if(!j(r))break;for(q(e),r=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&M(e,"deficient indentation"),i}function R(e){var t,n=e.position;return!(45!==(t=e.input.charCodeAt(n))&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,0!==(t=e.input.charCodeAt(n))&&!I(t)))}function B(e,t){1===t?e.result+=" ":1<t&&(e.result+=g.repeat("\n",t-1))}function P(e,t){var n,i,r=e.tag,o=e.anchor,a=[],s=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&45===i&&I(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,Y(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(n=e.line,$(e,t,A,!1,!0),a.push(e.result),Y(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==i)N(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=r,e.anchor=o,e.kind="sequence",e.result=a,!0)}function W(e){var t,n,i,r,o=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&N(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(o=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,n="!!",r=e.input.charCodeAt(++e.position)):n="!",t=e.position,o){for(;0!==(r=e.input.charCodeAt(++e.position))&&62!==r;);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):N(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!I(r);)33===r&&(a?N(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),l.test(n)||N(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),u.test(i)&&N(e,"tag suffix cannot contain flow indicator characters")}return i&&!p.test(i)&&N(e,"tag name cannot contain such characters: "+i),o?e.tag=i:y.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:N(e,'undeclared tag handle "'+n+'"'),!0}function K(e){var t,n;if(38!==(n=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&N(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!I(n)&&!O(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&N(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function $(e,t,n,i,r){var o,a,s,c,u,l,p,f,d=1,h=!1,m=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=a=s=b===n||A===n,i&&Y(e,!0,-1)&&(h=!0,e.lineIndent>t?d=1:e.lineIndent===t?d=0:e.lineIndent<t&&(d=-1)),1===d)for(;W(e)||K(e);)Y(e,!0,-1)?(h=!0,s=o,e.lineIndent>t?d=1:e.lineIndent===t?d=0:e.lineIndent<t&&(d=-1)):s=!1;if(s&&(s=h||r),1!==d&&b!==n||(p=x===n||v===n?t:t+1,f=e.position-e.lineStart,1===d?s&&(P(e,f)||function(e,t,n){var i,r,o,a,s,c=e.tag,u=e.anchor,l={},p={},f=null,d=null,h=null,m=!1,g=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=l),s=e.input.charCodeAt(e.position);0!==s;){if(i=e.input.charCodeAt(e.position+1),o=e.line,a=e.position,63!==s&&58!==s||!I(i)){if(!$(e,n,v,!1,!0))break;if(e.line===o){for(s=e.input.charCodeAt(e.position);S(s);)s=e.input.charCodeAt(++e.position);if(58===s)I(s=e.input.charCodeAt(++e.position))||N(e,"a whitespace character is expected after the key-value separator within a block mapping"),m&&(U(e,l,p,f,d,null),f=d=h=null),r=m=!(g=!0),f=e.tag,d=e.result;else{if(!g)return e.tag=c,e.anchor=u,!0;N(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!g)return e.tag=c,e.anchor=u,!0;N(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(m&&(U(e,l,p,f,d,null),f=d=h=null),r=m=g=!0):m?r=!(m=!1):N(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=i;if((e.line===o||e.lineIndent>t)&&($(e,t,b,!0,r)&&(m?d=e.result:h=e.result),m||(U(e,l,p,f,d,h,o,a),f=d=h=null),Y(e,!0,-1),s=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==s)N(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return m&&U(e,l,p,f,d,null),g&&(e.tag=c,e.anchor=u,e.kind="mapping",e.result=l),g}(e,f,p))||function(e,t){var n,i,r,o,a,s,c,u,l,p,f=!0,d=e.tag,h=e.anchor,m={};if(91===(p=e.input.charCodeAt(e.position)))s=!(r=93),i=[];else{if(123!==p)return!1;r=125,s=!0,i={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),p=e.input.charCodeAt(++e.position);0!==p;){if(Y(e,!0,t),(p=e.input.charCodeAt(e.position))===r)return e.position++,e.tag=d,e.anchor=h,e.kind=s?"mapping":"sequence",e.result=i,!0;f||N(e,"missed comma between flow collection entries"),l=null,o=a=!1,63===p&&I(e.input.charCodeAt(e.position+1))&&(o=a=!0,e.position++,Y(e,!0,t)),n=e.line,$(e,t,x,!1,!0),u=e.tag,c=e.result,Y(e,!0,t),p=e.input.charCodeAt(e.position),!a&&e.line!==n||58!==p||(o=!0,p=e.input.charCodeAt(++e.position),Y(e,!0,t),$(e,t,x,!1,!0),l=e.result),s?U(e,i,m,u,c,l):o?i.push(U(e,null,m,u,c,l)):i.push(c),Y(e,!0,t),44===(p=e.input.charCodeAt(e.position))?(f=!0,p=e.input.charCodeAt(++e.position)):f=!1}N(e,"unexpected end of the stream within a flow collection")}(e,p)?m=!0:(a&&function(e,t){var n,i,r,o,a,s=w,c=!1,u=!1,l=t,p=0,f=!1;if(124===(o=e.input.charCodeAt(e.position)))i=!1;else{if(62!==o)return!1;i=!0}for(e.kind="scalar",e.result="";0!==o;)if(43===(o=e.input.charCodeAt(++e.position))||45===o)w===s?s=43===o?k:C:N(e,"repeat of a chomping mode identifier");else{if(!(0<=(r=48<=(a=o)&&a<=57?a-48:-1)))break;0==r?N(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):u?N(e,"repeat of an indentation width identifier"):(l=t+r-1,u=!0)}if(S(o)){for(;S(o=e.input.charCodeAt(++e.position)););if(35===o)for(;!j(o=e.input.charCodeAt(++e.position))&&0!==o;);}for(;0!==o;){for(q(e),e.lineIndent=0,o=e.input.charCodeAt(e.position);(!u||e.lineIndent<l)&&32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position);if(!u&&e.lineIndent>l&&(l=e.lineIndent),j(o))p++;else{if(e.lineIndent<l){s===k?e.result+=g.repeat("\n",c?1+p:p):s===w&&c&&(e.result+="\n");break}for(i?S(o)?(f=!0,e.result+=g.repeat("\n",c?1+p:p)):f?(f=!1,e.result+=g.repeat("\n",p+1)):0===p?c&&(e.result+=" "):e.result+=g.repeat("\n",p):e.result+=g.repeat("\n",c?1+p:p),u=c=!0,p=0,n=e.position;!j(o)&&0!==o;)o=e.input.charCodeAt(++e.position);L(e,n,e.position,!1)}}return!0}(e,p)||function(e,t){var n,i,r;if(39!==(n=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(L(e,i,e.position,!0),39!==(n=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,r=e.position}else j(n)?(L(e,i,r,!0),B(e,Y(e,!1,t)),i=r=e.position):e.position===e.lineStart&&R(e)?N(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);N(e,"unexpected end of the stream within a single quoted scalar")}(e,p)||function(e,t){var n,i,r,o,a,s,c,u,l,p;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return L(e,n,e.position,!0),e.position++,!0;if(92===s){if(L(e,n,e.position,!0),j(s=e.input.charCodeAt(++e.position)))Y(e,!1,t);else if(s<256&&E[s])e.result+=F[s],e.position++;else if(0<(a=120===(p=s)?2:117===p?4:85===p?8:0)){for(r=a,o=0;0<r;r--)s=e.input.charCodeAt(++e.position),l=void 0,0<=(a=48<=(u=s)&&u<=57?u-48:97<=(l=32|u)&&l<=102?l-97+10:-1)?o=(o<<4)+a:N(e,"expected hexadecimal character");e.result+=(c=o)<=65535?String.fromCharCode(c):String.fromCharCode(55296+(c-65536>>10),56320+(c-65536&1023)),e.position++}else N(e,"unknown escape sequence");n=i=e.position}else j(s)?(L(e,n,i,!0),B(e,Y(e,!1,t)),n=i=e.position):e.position===e.lineStart&&R(e)?N(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}N(e,"unexpected end of the stream within a double quoted scalar")}(e,p)?m=!0:!function(e){var t,n,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!I(i)&&!O(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&N(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(n)||N(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],Y(e,!0,-1),!0}(e)?function(e,t,n){var i,r,o,a,s,c,u,l,p=e.kind,f=e.result;if(I(l=e.input.charCodeAt(e.position))||O(l)||35===l||38===l||42===l||33===l||124===l||62===l||39===l||34===l||37===l||64===l||96===l)return!1;if((63===l||45===l)&&(I(i=e.input.charCodeAt(e.position+1))||n&&O(i)))return!1;for(e.kind="scalar",e.result="",r=o=e.position,a=!1;0!==l;){if(58===l){if(I(i=e.input.charCodeAt(e.position+1))||n&&O(i))break}else if(35===l){if(I(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&R(e)||n&&O(l))break;if(j(l)){if(s=e.line,c=e.lineStart,u=e.lineIndent,Y(e,!1,-1),e.lineIndent>=t){a=!0,l=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=c,e.lineIndent=u;break}}a&&(L(e,r,o,!1),B(e,e.line-s),r=o=e.position,a=!1),S(l)||(o=e.position+1),l=e.input.charCodeAt(++e.position)}return L(e,r,o,!1),!!e.result||(e.kind=p,e.result=f,!1)}(e,p,x===n)&&(m=!0,null===e.tag&&(e.tag="?")):(m=!0,null===e.tag&&null===e.anchor||N(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===d&&(m=s&&P(e,f))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(c=0,u=e.implicitTypes.length;c<u;c+=1)if((l=e.implicitTypes[c]).resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else y.call(e.typeMap[e.kind||"fallback"],e.tag)?(l=e.typeMap[e.kind||"fallback"][e.tag],null!==e.result&&l.kind!==e.kind&&N(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result)?(e.result=l.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):N(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):N(e,"unknown tag !<"+e.tag+">");return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||m}function H(e){var t,n,i,r,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(r=e.input.charCodeAt(e.position))&&(Y(e,!0,-1),r=e.input.charCodeAt(e.position),!(0<e.lineIndent||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!I(r);)r=e.input.charCodeAt(++e.position);for(i=[],(n=e.input.slice(t,e.position)).length<1&&N(e,"directive name must not be less than one character in length");0!==r;){for(;S(r);)r=e.input.charCodeAt(++e.position);if(35===r){for(;0!==(r=e.input.charCodeAt(++e.position))&&!j(r););break}if(j(r))break;for(t=e.position;0!==r&&!I(r);)r=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==r&&q(e),y.call(T,n)?T[n](e,n,i):M(e,'unknown document directive "'+n+'"')}Y(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,Y(e,!0,-1)):a&&N(e,"directives end mark is expected"),$(e,e.lineIndent-1,b,!1,!0),Y(e,!0,-1),e.checkLineBreaks&&s.test(e.input.slice(o,e.position))&&M(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&R(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,Y(e,!0,-1)):e.position<e.length-1&&N(e,"end of the stream or a document separator is expected")}function G(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new m(e,t);for(n.input+="\0";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)H(n);return n.documents}function V(e,t,n){var i,r,o=G(e,n);if("function"!=typeof t)return o;for(i=0,r=o.length;i<r;i+=1)t(o[i])}function Z(e,t){var n=G(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new i("expected a single document in the stream, but found more")}}t.exports.loadAll=V,t.exports.load=Z,t.exports.safeLoadAll=function(e,t,n){if("function"!=typeof t)return V(e,g.extend({schema:o},n));V(e,t,g.extend({schema:o},n))},t.exports.safeLoad=function(e,t){return Z(e,g.extend({schema:o},t))}},{"./common":2,"./exception":4,"./mark":6,"./schema/default_full":9,"./schema/default_safe":10}],6:[function(e,t,n){"use strict";var s=e("./common");function i(e,t,n,i,r){this.name=e,this.buffer=t,this.position=n,this.line=i,this.column=r}i.prototype.getSnippet=function(e,t){var n,i,r,o,a;if(!this.buffer)return null;for(e=e||4,t=t||75,n="",i=this.position;0<i&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(i-1));)if(i-=1,this.position-i>t/2-1){n=" ... ",i+=5;break}for(r="",o=this.position;o<this.buffer.length&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(o));)if((o+=1)-this.position>t/2-1){r=" ... ",o-=5;break}return a=this.buffer.slice(i,o),s.repeat(" ",e)+n+a+r+"\n"+s.repeat(" ",e+this.position-i+n.length)+"^"},i.prototype.toString=function(e){var t,n="";return this.name&&(n+='in "'+this.name+'" '),n+="at line "+(this.line+1)+", column "+(this.column+1),e||(t=this.getSnippet())&&(n+=":\n"+t),n},t.exports=i},{"./common":2}],7:[function(e,t,n){"use strict";var i=e("./common"),r=e("./exception"),o=e("./type");function a(e,t,i){var r=[];return e.include.forEach(function(e){i=a(e,t,i)}),e[t].forEach(function(n){i.forEach(function(e,t){e.tag===n.tag&&e.kind===n.kind&&r.push(t)}),i.push(n)}),i.filter(function(e,t){return-1===r.indexOf(t)})}function s(e){this.include=e.include||[],this.implicit=e.implicit||[],this.explicit=e.explicit||[],this.implicit.forEach(function(e){if(e.loadKind&&"scalar"!==e.loadKind)throw new r("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=a(this,"implicit",[]),this.compiledExplicit=a(this,"explicit",[]),this.compiledTypeMap=function(){var e,t,n={scalar:{},sequence:{},mapping:{},fallback:{}};function i(e){n[e.kind][e.tag]=n.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return n}(this.compiledImplicit,this.compiledExplicit)}s.DEFAULT=null,s.create=function(){var e,t;switch(arguments.length){case 1:e=s.DEFAULT,t=arguments[0];break;case 2:e=arguments[0],t=arguments[1];break;default:throw new r("Wrong number of arguments for Schema.create function")}if(e=i.toArray(e),t=i.toArray(t),!e.every(function(e){return e instanceof s}))throw new r("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!t.every(function(e){return e instanceof o}))throw new r("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new s({include:e,explicit:t})},t.exports=s},{"./common":2,"./exception":4,"./type":13}],8:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./json")]})},{"../schema":7,"./json":12}],9:[function(e,t,n){"use strict";var i=e("../schema");t.exports=i.DEFAULT=new i({include:[e("./default_safe")],explicit:[e("../type/js/undefined"),e("../type/js/regexp"),e("../type/js/function")]})},{"../schema":7,"../type/js/function":18,"../type/js/regexp":19,"../type/js/undefined":20,"./default_safe":10}],10:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./core")],implicit:[e("../type/timestamp"),e("../type/merge")],explicit:[e("../type/binary"),e("../type/omap"),e("../type/pairs"),e("../type/set")]})},{"../schema":7,"../type/binary":14,"../type/merge":22,"../type/omap":24,"../type/pairs":25,"../type/set":27,"../type/timestamp":29,"./core":8}],11:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({explicit:[e("../type/str"),e("../type/seq"),e("../type/map")]})},{"../schema":7,"../type/map":21,"../type/seq":26,"../type/str":28}],12:[function(e,t,n){"use strict";var i=e("../schema");t.exports=new i({include:[e("./failsafe")],implicit:[e("../type/null"),e("../type/bool"),e("../type/int"),e("../type/float")]})},{"../schema":7,"../type/bool":15,"../type/float":16,"../type/int":17,"../type/null":23,"./failsafe":11}],13:[function(e,t,n){"use strict";var i=e("./exception"),r=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],o=["scalar","sequence","mapping"];t.exports=function(t,e){if(e=e||{},Object.keys(e).forEach(function(e){if(-1===r.indexOf(e))throw new i('Unknown option "'+e+'" is met in definition of "'+t+'" YAML type.')}),this.tag=t,this.kind=e.kind||null,this.resolve=e.resolve||function(){return!0},this.construct=e.construct||function(e){return e},this.instanceOf=e.instanceOf||null,this.predicate=e.predicate||null,this.represent=e.represent||null,this.defaultStyle=e.defaultStyle||null,this.styleAliases=function(e){var n={};return null!==e&&Object.keys(e).forEach(function(t){e[t].forEach(function(e){n[String(e)]=t})}),n}(e.styleAliases||null),-1===o.indexOf(this.kind))throw new i('Unknown kind "'+this.kind+'" is specified for "'+t+'" YAML type.')}},{"./exception":4}],14:[function(e,t,n){"use strict";var c;try{c=e("buffer").Buffer}catch(e){}var i=e("../type"),u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";t.exports=new i("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n,i=0,r=e.length,o=u;for(n=0;n<r;n++)if(!(64<(t=o.indexOf(e.charAt(n))))){if(t<0)return!1;i+=6}return i%8==0},construct:function(e){var t,n,i=e.replace(/[\r\n=]/g,""),r=i.length,o=u,a=0,s=[];for(t=0;t<r;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|o.indexOf(i.charAt(t));return 0==(n=r%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18==n?(s.push(a>>10&255),s.push(a>>2&255)):12==n&&s.push(a>>4&255),c?c.from?c.from(s):new c(s):s},predicate:function(e){return c&&c.isBuffer(e)},represent:function(e){var t,n,i="",r=0,o=e.length,a=u;for(t=0;t<o;t++)t%3==0&&t&&(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]),r=(r<<8)+e[t];return 0==(n=o%3)?(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]):2==n?(i+=a[r>>10&63],i+=a[r>>4&63],i+=a[r<<2&63],i+=a[64]):1==n&&(i+=a[r>>2&63],i+=a[r<<4&63],i+=a[64],i+=a[64]),i}})},{"../type":13}],15:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})},{"../type":13}],16:[function(e,t,n){"use strict";var i=e("../common"),r=e("../type"),o=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var a=/^[-+]?[0-9]+e/;t.exports=new r("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!o.test(e)||"_"===e[e.length-1])},construct:function(e){var t,n,i,r;return n="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,r=[],0<="+-".indexOf(t[0])&&(t=t.slice(1)),".inf"===t?1==n?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:0<=t.indexOf(":")?(t.split(":").forEach(function(e){r.unshift(parseFloat(e,10))}),t=0,i=1,r.forEach(function(e){t+=e*i,i*=60}),n*t):n*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||i.isNegativeZero(e))},represent:function(e,t){var n;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(i.isNegativeZero(e))return"-0.0";return n=e.toString(10),a.test(n)?n.replace("e",".e"):n},defaultStyle:"lowercase"})},{"../common":2,"../type":13}],17:[function(e,t,n){"use strict";var i=e("../common"),r=e("../type");t.exports=new r("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n,i,r,o=e.length,a=0,s=!1;if(!o)return!1;if("-"!==(t=e[a])&&"+"!==t||(t=e[++a]),"0"===t){if(a+1===o)return!0;if("b"===(t=e[++a])){for(a++;a<o;a++)if("_"!==(t=e[a])){if("0"!==t&&"1"!==t)return!1;s=!0}return s&&"_"!==t}if("x"===t){for(a++;a<o;a++)if("_"!==(t=e[a])){if(!(48<=(i=e.charCodeAt(a))&&i<=57||65<=i&&i<=70||97<=i&&i<=102))return!1;s=!0}return s&&"_"!==t}for(;a<o;a++)if("_"!==(t=e[a])){if(!(48<=(n=e.charCodeAt(a))&&n<=55))return!1;s=!0}return s&&"_"!==t}if("_"===t)return!1;for(;a<o;a++)if("_"!==(t=e[a])){if(":"===t)break;if(!(48<=(r=e.charCodeAt(a))&&r<=57))return!1;s=!0}return!(!s||"_"===t)&&(":"!==t||/^(:[0-5]?[0-9])+$/.test(e.slice(a)))},construct:function(e){var t,n,i=e,r=1,o=[];return-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(t=i[0])&&"+"!==t||("-"===t&&(r=-1),t=(i=i.slice(1))[0]),"0"===i?0:"0"===t?"b"===i[1]?r*parseInt(i.slice(2),2):"x"===i[1]?r*parseInt(i,16):r*parseInt(i,8):-1!==i.indexOf(":")?(i.split(":").forEach(function(e){o.unshift(parseInt(e,10))}),i=0,n=1,o.forEach(function(e){i+=e*n,n*=60}),r*i):r*parseInt(i,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!i.isNegativeZero(e)},represent:{binary:function(e){return 0<=e?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return 0<=e?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return 0<=e?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})},{"../common":2,"../type":13}],18:[function(e,t,n){"use strict";var o;try{o=e("esprima")}catch(e){"undefined"!=typeof window&&(o=window.esprima)}var i=e("../../type");t.exports=new i("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:function(e){if(null===e)return!1;try{var t="("+e+")",n=o.parse(t,{range:!0});return"Program"===n.type&&1===n.body.length&&"ExpressionStatement"===n.body[0].type&&("ArrowFunctionExpression"===n.body[0].expression.type||"FunctionExpression"===n.body[0].expression.type)}catch(e){return!1}},construct:function(e){var t,n="("+e+")",i=o.parse(n,{range:!0}),r=[];if("Program"!==i.type||1!==i.body.length||"ExpressionStatement"!==i.body[0].type||"ArrowFunctionExpression"!==i.body[0].expression.type&&"FunctionExpression"!==i.body[0].expression.type)throw new Error("Failed to resolve function");return i.body[0].expression.params.forEach(function(e){r.push(e.name)}),t=i.body[0].expression.body.range,"BlockStatement"===i.body[0].expression.body.type?new Function(r,n.slice(t[0]+1,t[1]-1)):new Function(r,"return "+n.slice(t[0],t[1]))},predicate:function(e){return"[object Function]"===Object.prototype.toString.call(e)},represent:function(e){return e.toString()}})},{"../../type":13}],19:[function(e,t,n){"use strict";var i=e("../../type");t.exports=new i("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:function(e){if(null===e)return!1;if(0===e.length)return!1;var t=e,n=/\/([gim]*)$/.exec(e),i="";if("/"===t[0]){if(n&&(i=n[1]),3<i.length)return!1;if("/"!==t[t.length-i.length-1])return!1}return!0},construct:function(e){var t=e,n=/\/([gim]*)$/.exec(e),i="";return"/"===t[0]&&(n&&(i=n[1]),t=t.slice(1,t.length-i.length-1)),new RegExp(t,i)},predicate:function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},represent:function(e){var t="/"+e.source+"/";return e.global&&(t+="g"),e.multiline&&(t+="m"),e.ignoreCase&&(t+="i"),t}})},{"../../type":13}],20:[function(e,t,n){"use strict";var i=e("../../type");t.exports=new i("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:function(){return!0},construct:function(){},predicate:function(e){return void 0===e},represent:function(){return""}})},{"../../type":13}],21:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})},{"../type":13}],22:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}})},{"../type":13}],23:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})},{"../type":13}],24:[function(e,t,n){"use strict";var i=e("../type"),c=Object.prototype.hasOwnProperty,u=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=[],s=e;for(t=0,n=s.length;t<n;t+=1){if(i=s[t],o=!1,"[object Object]"!==u.call(i))return!1;for(r in i)if(c.call(i,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==a.indexOf(r))return!1;a.push(r)}return!0},construct:function(e){return null!==e?e:[]}})},{"../type":13}],25:[function(e,t,n){"use strict";var i=e("../type"),s=Object.prototype.toString;t.exports=new i("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1){if(i=a[t],"[object Object]"!==s.call(i))return!1;if(1!==(r=Object.keys(i)).length)return!1;o[t]=[r[0],i[r[0]]]}return!0},construct:function(e){if(null===e)return[];var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1)i=a[t],r=Object.keys(i),o[t]=[r[0],i[r[0]]];return o}})},{"../type":13}],26:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})},{"../type":13}],27:[function(e,t,n){"use strict";var i=e("../type"),r=Object.prototype.hasOwnProperty;t.exports=new i("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,n=e;for(t in n)if(r.call(n,t)&&null!==n[t])return!1;return!0},construct:function(e){return null!==e?e:{}}})},{"../type":13}],28:[function(e,t,n){"use strict";var i=e("../type");t.exports=new i("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}})},{"../type":13}],29:[function(e,t,n){"use strict";var i=e("../type"),p=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),f=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");t.exports=new i("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==p.exec(e)||null!==f.exec(e))},construct:function(e){var t,n,i,r,o,a,s,c,u=0,l=null;if(null===(t=p.exec(e))&&(t=f.exec(e)),null===t)throw new Error("Date resolve error");if(n=+t[1],i=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(n,i,r));if(o=+t[4],a=+t[5],s=+t[6],t[7]){for(u=t[7].slice(0,3);u.length<3;)u+="0";u=+u}return t[9]&&(l=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(l=-l)),c=new Date(Date.UTC(n,i,r,o,a,s,u)),l&&c.setTime(c.getTime()-l),c},instanceOf:Date,represent:function(e){return e.toISOString()}})},{"../type":13}],"/":[function(e,t,n){"use strict";var i=e("./lib/js-yaml.js");t.exports=i},{"./lib/js-yaml.js":1}]},{},[])("/")});


/***/ }),

/***/ 359:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { validate, patterns } =  __webpack_require__(689)

module.exports = function configureApp ({ arc }) {
  if (!Array.isArray(arc.app) ||
      arc.app.length !== 1 ||
      typeof arc.app[0] !== 'string') {
    throw Error('@app name not found')
  }

  let appName = arc.app[0]

  // Validation
  validate.regex(appName, patterns.looseName, '@app')
  validate.size(appName, 100, '@app')

  return appName
}


/***/ }),

/***/ 364:
/***/ (function(module) {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 373:
/***/ (function(module, __unusedexports, __webpack_require__) {

let _arc = __webpack_require__(45)
let _project = __webpack_require__(154)
let pragmas = __webpack_require__(234)

module.exports = {
  _arc,
  _project,
  pragmas,
}


/***/ }),

/***/ 376:
/***/ (function(module) {

/**
 * Use Unix seperators on Windows
 * We do this because `path.posix.normalize(process.cwd())` returns `C:\\foo\\bar`, when we want `C:/foo/bar`
 * Normalise to slash file names (`C:/foo/bar`) for regex tests, etc.
 */
module.exports = function pathToUnix (string) {
  return string.replace(/\\/g, '/')
}


/***/ }),

/***/ 402:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(422)
var EE = __webpack_require__(614).EventEmitter
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var globSync = __webpack_require__(245)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(674)
var util = __webpack_require__(669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(49)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 417:
/***/ (function(module) {

module.exports = require("crypto");

/***/ }),

/***/ 422:
/***/ (function(module, __unusedexports, __webpack_require__) {

try {
  var util = __webpack_require__(669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(315);
}


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 438:
/***/ (function(module, __unusedexports, __webpack_require__) {

let chalk = __webpack_require__(843)
let notWin = !process.platform.startsWith('win')

/**
 * Windows cmd.exe supports a partial UCS-2 charset
 */
let buzz = notWin
  ? chalk.grey('⌁')
  : chalk.grey('~')

let start = notWin
  ? chalk.green.dim('⚬')
  : chalk.green.dim('○')

let done = notWin
  ? chalk.green.dim('✓')
  : chalk.green.dim('√')

let warn = notWin
  ? chalk.yellow('⚠️')
  : chalk.yellow('!')

let err = notWin
  ? chalk.red('×')
  : chalk.red('x')

module.exports = {
  buzz,
  start,
  done,
  warn,
  err
}


/***/ }),

/***/ 445:
/***/ (function(module, __unusedexports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(885);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 448:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { exec } = __webpack_require__(129)
let { existsSync } = __webpack_require__(747)
let fs = __webpack_require__(747) // Broken out for testing writeFile calls
let glob = __webpack_require__(402)
let { basename, dirname, extname, join, sep } = __webpack_require__(622)
let series = __webpack_require__(712)
let sha = __webpack_require__(959)
let sort = __webpack_require__(656)
let waterfall = __webpack_require__(946)
let normalizePath = __webpack_require__(376)
let updater = __webpack_require__(464)

/**
 * Static asset fingerprinter
 * - Note: everything uses and assumes *nix-styile file paths, even when running on Windows
 */
module.exports = function fingerprint (params, callback) {
  let { fingerprint = false, ignore = [], inventory, update } = params
  let { inv, get } = inventory

  // Bail early if this project doesn't utilize static assets
  if (!inv.static) return callback()

  // Get the folder
  let staticFolder = get.static('folder') || '' // Should never be falsy but jic
  let folder = normalizePath(join(process.cwd(), staticFolder))

  // Bail early if the folder isn't present
  if (!existsSync(folder)) return callback()

  // Ok, we've cleared the pre-reqs, let's go
  if (!update) update = updater('Assets')

  fingerprint = fingerprint || inv.static.fingerprint
  ignore = ignore.length ? ignore : inv.static.ignore || []

  // Allow apps and frameworks to handle their own fingerprinting
  let externalFingerprint = fingerprint === 'external'

  let files
  let staticManifest = {}
  waterfall([
    /**
     * Early exit if disabled, clean up if necessary
     */
    function bail (callback) {
      if (fingerprint && !externalFingerprint) callback()
      else {
        if (existsSync(join(folder, 'static.json'))) {
          let msg = `Found ${folder + sep}static.json file with fingerprinting ${externalFingerprint ? 'set to external' : 'disabled'}, deleting file`
          update.warn(msg)

          let remove = process.platform.startsWith('win') ? 'del' : 'rm'
          exec(`${remove} static.json`, { cwd: folder }, (err, stdout, stderr) => {
            if (err) callback(err)
            else {
              if (stderr) {
                let msg = `Error removing static.json file, please remove it manually or static asset calls may be broken`
                update.warn(msg)
              }
              callback(Error('cancel'))
            }
          })
        }
        else callback(Error('cancel'))
      }
    },

    /**
     * Scan for files in the public directory
     */
    function globFiles (callback) {
      let staticAssets = folder + '/**/*'
      glob(staticAssets, { dot: true, nodir: true, follow: true }, callback)
    },

    /**
     * Filter based on default and user-specified ignore rules
     */
    function filterFiles (filesFound, callback) {
      // Always ignore these files
      ignore = ignore.concat([
        '.DS_Store',
        'node_modules',
        'readme.md',
        'static.json', // Ignored here, but uploaded later
      ])

      // Find non-ignored files and sort for readability
      files = filesFound.filter(file => !ignore.some(i => file.includes(i)))
      files = sort(files)
      if (!files.length) {
        callback(Error('no_files_found'))
      }
      else callback()
    },

    /**
     * Write (or remove) fingerprinted static asset manifest
     */
    function writeStaticManifest (callback) {
      // Hash those files
      let hashFiles = files.map(file => {
        return (callback) => {
          sha.get(file, function done (err, hash) {
            if (err) callback(err)
            else {
              hash = hash.substr(0, 10)
              let ext = extname(file)
              let base = basename(file)
              let hashed = base.replace(ext, '') + `-${hash}${ext}`
              // Handle any nested dirs
              let dir = dirname(file).replace(folder, '').substr(1)
              dir = `${dir ? dir + '/' : ''}`
              // Final key + value
              let staticKey = `${dir ? dir : ''}${base}`
              let staticValue = `${dir ? dir : ''}${hashed}`
              // Target shape: {'foo/bar.jpg': 'foo/bar-6bf1794b4c.jpg'}
              staticManifest[staticKey] = staticValue
              callback()
            }
          })
        }
      })
      series(hashFiles, function done (err) {
        if (err) callback(err)
        else {
          // Write out folder/static.json
          let file = join(folder, 'static.json')
          let data = JSON.stringify(staticManifest, null, 2)
          fs.writeFile(file, data, callback)
        }
      })
    },
  ],
  function done (err) {
    if (err && err.message === 'no_files_found') {
      let msg = `No static assets found to fingerprint from ${staticFolder}${sep}`
      update.done(msg)
      callback()
    }
    else if (err && err.message === 'cancel') {
      callback()
    }
    else if (err) {
      callback(err, staticManifest)
    }
    else callback(null, staticManifest)
  })
}


/***/ }),

/***/ 454:
/***/ (function(module, __unusedexports, __webpack_require__) {

let read = __webpack_require__(951)
let series = __webpack_require__(712)
let parser = __webpack_require__(989)
let inventoryDefaults = __webpack_require__(332)
let config = __webpack_require__(373)
let getEnv = __webpack_require__(745)
let validate = __webpack_require__(322)
let get = __webpack_require__(753)

/**
 * Architect Inventory
 * - Returns fully enumerated Architect project, including current config for every Lambda
 * - Also returns a handy getter for fetching any config via pragma + Arc item
 *
 * @param {object} params - Contains optional cwd (string) and env (boolean)
 * @returns {object} - Inventory object (including Arc & project defaults and enumerated pragmas) & config getter
 */
module.exports = function architectInventory (params = {}, callback) {

  // Set up promise if there's no callback
  let promise
  if (!callback) {
    promise = new Promise(function (res, rej) {
      callback = function (err, result) {
        err ? rej(err) : res(result)
      }
    })
  }

  let errors
  let inventory
  try {
    // Always ensure we have a working dir
    params.cwd = params.cwd || process.cwd()
    let { cwd, rawArc } = params

    // Stateless inventory run
    if (rawArc) {
      var arc = parser(rawArc)
      var raw = rawArc
      var filepath = false
    }
    // Get the Architect project manifest from the filesystem
    else {
      var { arc, raw, filepath } = read({ type: 'projectManifest', cwd })
    }

    // Start building out the inventory
    inventory = inventoryDefaults(params)

    // Set up project params for config
    let project = { cwd, arc, raw, filepath, inventory }

    // Populate inventory.arc
    inventory._arc = config._arc(project)

    // Establish default function config from project + Arc defaults
    inventory._project = config._project(project)

    // Userland: fill out the pragmas
    inventory = {
      ...inventory,
      ...config.pragmas(project)
    }
  }
  catch (err) {
    errors = err
  }

  series([
    // End here if first-pass pragma validation failed
    function _pragmaValidationFailed (callback) {
      if (errors) callback(errors)
      else callback()
    },

    // Populate environment variables
    function _getEnv (callback) {
      getEnv(params, inventory, function done (err, env) {
        if (err) callback(err)
        else {
          inventory._project.env = env
          callback()
        }
      })
    },

    // Final validation pass
    function _validate (callback) {
      validate(params, inventory, callback)
    }
  ],
  function done (err) {
    if (err) callback(err)
    else {
      callback(null, {
        inv: inventory,
        get: get(inventory)
      })
    }
  })

  return promise
}


/***/ }),

/***/ 455:
/***/ (function(module) {

/**
 * predicate for not-empty token
 *
 * @param {token}
 * @returns {boolean}
 */
module.exports = function notempty (t) {
  return !(t.type == 'comment' || t.type == 'newline' || t.type === 'space')
}


/***/ }),

/***/ 464:
/***/ (function(module, __unusedexports, __webpack_require__) {

let chalk = __webpack_require__(843)
let chars = __webpack_require__(438)
let { printer, spinner } = __webpack_require__(161)

/**
 * Updater
 * - `status` - prints an affirmative status update - `chars.start`
 *   - optional: supporting info on new lines with each additional param
 * - `start`  - start progress indicator - `spinner`||`chars.start`
 *   - aliases: `update`
 * - `done`   - end progress indicator with an update - `chars.done`
 *   - aliases: `stop`
 * - `cancel` - cancel progress indicator without update - !char
 * - `err`    - pretty print an error - `chars.err`
 *   - aliases: `error` and `fail`
 * - `warn`   - cancel progress indicator and print a warning
 *   - aliases: `warn`
 * - `raw`    - just logs a message as-is (respecting quiet)
 *
 * Each method should also return a value to enable capture of progress data
 */
module.exports = function updater (name, params = {}) {
  params.quiet = params.quiet || false
  let quiet = () => process.env.ARC_QUIET || process.env.QUIET || params.quiet
  name = name ? chalk.grey(name) : 'Info'
  let isCI = process.env.CI || process.stdout.isTTY === false
  if (!quiet() && !isCI) {
    printer.hideCursor() // Disable cursor while updating
    printer.restoreCursor() // Restore cursor on exit
  }
  let running = false
  let { frames, timing } = spinner

  function progressIndicator (info) {
    // End-user progress mode
    if (!running && !isCI && !quiet()) {
      let i = 0
      running = setInterval(function () {
        printer.write(`${chalk.cyan(frames[i = ++i % frames.length])} ${info}`)
        printer.reset()
      }, timing)
    }
    // CI mode: updates console with status messages but not animations
    else if (!running && isCI && !quiet()) {
      console.log(`${chars.start} ${info}`)
    }
  }

  // Optionally pass a message and/or post a multi-line supporting status update
  function status (msg, ...more) {
    msg = msg ? chalk.cyan(msg) : ''
    let info = msg ? `${chars.start} ${name} ${msg}`.trim() : ''
    if (running) cancel()
    if (!quiet() && info) console.log(info) // Check for msg so as not to print an empty line
    if (more.length) {
      more.forEach(i => {
        let add = chalk.dim(`  | ${i}`)
        if (!quiet()) console.log(add)
        info += `\n${add}`
      })
    }

    return info
  }

  function start (msg) {
    msg = msg ? chalk.cyan(msg) : ''
    let info = `${name} ${msg}`.trim()
    if (running) cancel()
    progressIndicator(info)
    return `${chars.start} ${info}`
  }

  function done (newName, msg) {
    if (!msg) {
      msg = newName
      newName = ''
    }
    if (newName) newName = chalk.grey(newName)
    if (msg) msg = chalk.cyan(msg)
    cancel() // Maybe clear running status and reset
    let info = `${chars.done} ${newName ? newName : name} ${msg ? msg : ''}`.trim()

    if (!quiet()) console.log(info)
    return info
  }

  function cancel () {
    if (running) {
      clearInterval(running)
      printer.reset()
      printer.clear()
      running = false // Prevent accidental second done print
    }
  }

  function err (error) {
    if (running) cancel()
    let isErr = error instanceof Error
    let name = isErr ? error.name : 'Error'
    let msg = isErr ? error.message : error
    let info = `${chars.err} ${chalk.red(name + ':')} ${msg}`.trim()
    if (isErr) {
      info += '\n' + error.stack.split('\n').slice(1).join('\n')
    }
    console.log(info)
    return info
  }

  function warn (warning) {
    if (running) cancel()
    if (warning instanceof Error) warning = warning.message
    let info = `${chars.warn} ${chalk.yellow('Warning:')} ${warning}`.trim()

    if (!quiet()) console.log(info)
    return info
  }

  function raw (msg) {
    if (!quiet()) console.log(msg)
    return msg
  }

  return {
    start,
    update: start,
    status,
    done,
    stop: done,
    cancel,
    err,
    error: err,
    fail: err,
    warn,
    warning: warn,
    raw,
  }
}

// For whatever reason signal-exit doesn't catch SIGINT, so do this
process.on('SIGINT', () => {
  printer.restoreCursor()
  console.log('')
  process.exit()
})


/***/ }),

/***/ 466:
/***/ (function(module, __unusedexports, __webpack_require__) {

var Stream = __webpack_require__(413).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const file_command_1 = __webpack_require__(102);
const utils_1 = __webpack_require__(82);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 484:
/***/ (function(module) {

module.exports = function configureMacros ({ arc }) {
  if (!arc.macros || !arc.macros.length) return null

  return arc.macros
}


/***/ }),

/***/ 497:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(654)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 498:
/***/ (function(module, __unusedexports, __webpack_require__) {

let lambdaPragmas = __webpack_require__(517)

module.exports = function collectSourceDirs ({ pragmas }) {
  let lambdaSrcDirs = []
  let unsortedBySrcDir = {}
  Object.entries(pragmas).forEach(([ pragma, values ]) => {
    let mayHaveSrcDirs = lambdaPragmas.some(p => p === pragma)
    if (mayHaveSrcDirs && Array.isArray(values)) {
      pragmas[pragma].forEach(item => {
        if (item.arcStaticAssetProxy === true) return // Special exception for ASAP
        else if (typeof item.src === 'string') {
          lambdaSrcDirs.push(item.src)
          // Multiple Lambdae may map to a single dir
          if (unsortedBySrcDir[item.src]) {
            unsortedBySrcDir[item.src] = Array.isArray(unsortedBySrcDir[item.src])
              ? [ ...unsortedBySrcDir[item.src], { ...item, pragma } ]
              : [ unsortedBySrcDir[item.src], { ...item, pragma } ]
          }
          else unsortedBySrcDir[item.src] = { ...item, pragma }
        }
        else throw Error(`Lambda is missing source directory: ${JSON.stringify(item, null, 2)}`)
      })
    }
  })

  // Dedupe multiple Lambdae sharing the same folder
  lambdaSrcDirs = lambdaSrcDirs.length ? [ ...new Set(lambdaSrcDirs) ].sort() : null

  // Sort the object for human readability
  let lambdasBySrcDir = null
  unsortedBySrcDir = Object.keys(unsortedBySrcDir).length ? unsortedBySrcDir : null
  if (unsortedBySrcDir) {
    lambdasBySrcDir = {}
    lambdaSrcDirs.forEach(d => lambdasBySrcDir[d] = unsortedBySrcDir[d])
  }

  return { lambdaSrcDirs, lambdasBySrcDir }
}


/***/ }),

/***/ 517:
/***/ (function(module) {

// Enumerates Architect pragmas that (if present) are expected to contain Lambdae
module.exports = [
  'events',
  'http',
  'plugins',
  'queues',
  'scheduled',
  'streams',
  'ws'
]


/***/ }),

/***/ 521:
/***/ (function(module) {

module.exports = function stringify (obj) {
  if (typeof obj !== 'object') return
  let pragmas = Object.keys(obj)
  let out = ''
  pragmas.forEach(function (pragma, i) {
    let props = obj[pragma]
    out += i === 0
      ? `@${pragma}\n`
      : `\n@${pragma}\n`

    props.forEach(function (prop) {
      if (typeof prop === 'string') {
        out += `${prop}\n`
      }

      if (typeof prop === 'number') {
        out += `${prop}\n`
      }

      if (typeof prop === 'boolean') {
        out += `${prop ? 'true' : 'false'}\n`
      }

      if (typeof prop === 'object') {
        if (Array.isArray(prop)) {
          prop.forEach(p => {
            out += `${p} `
          })
          out += '\n'
        }
        else {
          for (let key in prop) {
            out += `${key}`
            let subs = prop[key]
            for (let property in subs) {
              out += `\n  ${property} ${subs[property]}`
            }
            out += `\n`
          }
        }
      }
    })
  })
  return out
}


/***/ }),

/***/ 525:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

module.exports = function configureQueues ({ arc, inventory }) {
  if (!arc.queues || !arc.queues.length) return null

  let queues = populate.queues(arc.queues, inventory)

  return queues
}


/***/ }),

/***/ 537:
/***/ (function(module) {

// Validates Lambda layer / policy ARNs, prob can't be used for other kinds of ARN
module.exports = function validateARN ({ arn, region }) {
  let invalid = `- Invalid ARN: ${arn}`
  try {
    if (typeof arn !== 'string' || !arn.startsWith('arn:') || arn.split(':').length !== 8) {
      return invalid
    }
    if (region) {
      let parts = arn.split(':')
      let layerRegion = parts[3]
      if (region && region !== layerRegion) {
        let err = `- Lambda layers must be in the same region as app\n` +
                  `  - App region: ${region}\n` +
                  `  - Layer ARN: ${arn}\n` +
                  `  - Layer region: ${layerRegion ? layerRegion : 'unknown'}`
        return err
      }
    }

  }
  // Catch weird issues, like it's just a number or bool
  catch (err) {
    return invalid
  }
}


/***/ }),

/***/ 546:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { existsSync: exists } = __webpack_require__(747)
let homeDir = __webpack_require__(87).homedir()
let { join } = __webpack_require__(622)
let updater = __webpack_require__(464)

/**
 * Initialize AWS configuration, in order of preference:
 * - @aws pragma + ~/.aws/credentials file
 * - Environment variables
 * - Dummy creds (if absolutely necessary)
 */
module.exports = function initAWS ({ inventory, needsValidCreds = true }) {
  // AWS SDK intentionally not added to package deps; assume caller already has it
  // eslint-disable-next-line
  let aws = __webpack_require__(71)
  let credentialsMethod = 'SharedIniFileCredentials'
  let { inv } = inventory
  try {
    let defaultCredsPath = join(homeDir, '.aws', 'credentials')
    let envCredsPath = process.env.AWS_SHARED_CREDENTIALS_FILE
    let credsPath = envCredsPath || defaultCredsPath
    let credsExists = exists(envCredsPath) || exists(defaultCredsPath)
    // Inventory always sets a dfeault region if not specified
    process.env.AWS_REGION = inv.aws.region
    /**
     * Always ensure we end with a final sanity check on loaded credentials
     */
    // Allow local cred file to be overriden by env vars
    let envOverride = process.env.ARC_AWS_CREDS === 'env'
    if (credsExists && !envOverride) {
      let profile = process.env.AWS_PROFILE
      aws.config.credentials = []
      if (inv.aws && inv.aws.profile) {
        process.env.AWS_PROFILE = profile = inv.aws.profile
      }

      let init = new aws.IniLoader()
      let opts = {
        filename: credsPath
      }

      let profileData =  init.loadFrom(opts)
      if (!profile) profile = process.env.AWS_PROFILE = 'default'
      process.env.ARC_AWS_CREDS = 'missing'

      if (profileData[profile]) {
        process.env.ARC_AWS_CREDS = 'profile'

        if (profileData[profile].credential_process) credentialsMethod = 'ProcessCredentials'
        aws.config.credentials = new aws[credentialsMethod]({
          ...opts,
          profile: process.env.AWS_PROFILE
        })
      }
      else {
        delete process.env.AWS_PROFILE
      }
    }
    else {
      let hasEnvVars = process.env.AWS_ACCESS_KEY_ID &&
                       process.env.AWS_SECRET_ACCESS_KEY
      if (hasEnvVars) {
        process.env.ARC_AWS_CREDS = 'env'
        let params = {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
        if (process.env.AWS_SESSION_TOKEN) {
          params.sessionToken = process.env.AWS_SESSION_TOKEN
        }
        aws.config.credentials = new aws.Credentials(params)
      }
    }
    credentialCheck()
    /**
     * Final credential check to ensure we meet the cred needs of Arc various packages
     * - Packages that **need** valid creds should be made aware that none are available (ARC_AWS_CREDS = 'missing')
     * - Others that **do not need** valid creds should work fine when supplied with dummy creds (or none at all, but we'll backfill dummy creds jic)
     */
    function credentialCheck () {
      let creds = aws.config.credentials
      let noCreds = !creds || process.env.ARC_AWS_CREDS == 'missing'
      if (noCreds && needsValidCreds) {
        // Set missing creds flag and let consuming modules handle as necessary
        process.env.ARC_AWS_CREDS = 'missing'
      }
      else if (noCreds && !needsValidCreds) {
        /**
         * Any creds will do! (e.g. Sandbox DynamoDB)
         * - Be sure we backfill Lambda's prepopulated env vars
         * - sessionToken / AWS_SESSION_TOKEN is optional, skip so as not to introduce unintended side-effects
         */
        process.env.ARC_AWS_CREDS = 'dummy'
        process.env.AWS_ACCESS_KEY_ID = 'xxx'
        process.env.AWS_SECRET_ACCESS_KEY = 'xxx'
        aws.config.credentials = new aws.Credentials({
          accessKeyId: 'xxx',
          secretAccessKey: 'xxx'
        })
      }
      // If no creds, always unset profile to prevent misleading claims about profile state
      if (noCreds) {
        delete process.env.AWS_PROFILE
      }
    }
  }
  catch (e) {
    // Don't exit process here; caller should be responsible
    let update = updater('Startup')
    update.err(e)
  }
}


/***/ }),

/***/ 558:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let { existsSync } = __webpack_require__(747)

module.exports = function populateStreams ({ type, item, dir, cwd }) {
  let isObj = typeof item === 'object' && !Array.isArray(item)
  if (type === 'tables' && isObj) {
    let name = Object.keys(item)[0]
    // Check for the legacy dir from before `@tables tablename stream true` generated an @streams item
    let legacySrc = join(cwd, dir, name)
    let streamSrc = join(cwd, 'src', 'streams', name)
    let src = existsSync(legacySrc) ? legacySrc : streamSrc
    let table = name
    return { name, src, table }
  }
  else if (type === 'streams' && typeof item === 'string') {
    let name = item
    let src = join(cwd, dir, name)
    let table = name
    return { name, src, table }
  }
  else if (type === 'streams' && isObj) {
    let name = Object.keys(item)[0]
    let src = item[name].src
      ? join(cwd, item[name].src)
      : join(cwd, dir, name)
    let table = item[name].table
      ? item[name].table
      : name
    return { name, src, table }
  }
  throw Error(`Invalid @${type} item: ${item}`)
}


/***/ }),

/***/ 561:
/***/ (function(module) {

/**
 * convert .arc typical dash-case-stuff into PascalCaseStuff
 */
module.exports = function toLogicalID (str) {
  str = str.replace(/([A-Z])/g, ' $1')
  if (str.length === 1)
    return str.toUpperCase()
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase()
  str = str.charAt(0).toUpperCase() + str.slice(1)
  str = str.replace(/[\W_]+(\w|$)/g, function (_, ch) {
    return ch.toUpperCase()
  })
  if (str === 'Get') return 'GetIndex'
  else return str
}


/***/ }),

/***/ 565:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

/**
 * `@streams` (formerly `@tables`)
 * - Originally `@tables {tablename} stream true` created a lambda at src/tables/{tablename}
 * - This was superseded by `@streams`; `@tables` remains for backwards compat and as a convenience for creating `@streams`
 *   - If a project has an existing `@tables` Lambda, we'll continue using that so long as the directory exists
 */
module.exports = function configureStreams ({ arc, inventory }) {
  if (!arc.streams && !arc.tables) return null

  // Populate @tables
  let tables = arc.tables && arc.tables.filter(t => typeof t === 'object' && t[Object.keys(t)[0]].stream === true)
  if (tables && tables.length) {
    tables = populate.tables(tables, inventory)
  }
  else tables = null

  // Populate @streams
  let streams = populate.streams(arc.streams, inventory)

  if (tables && streams) {
    let uniqueTables = tables.filter(t => !streams.some(s => s.table === t.table))
    let merged = streams.concat(uniqueTables)
    return merged
  }
  else if (streams) return streams
  return tables
}


/***/ }),

/***/ 572:
/***/ (function(module) {

module.exports = class TypeUnknownError extends TypeError {
  constructor ({ line, column }) {
    super(`type unknown (line: ${1} column: ${1})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}



/***/ }),

/***/ 575:
/***/ (function(module) {

module.exports = class CloseQuoteNotFoundError extends ReferenceError {
  constructor ({ line, column }) {
    super(`closing quote not found (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 578:
/***/ (function(module) {

module.exports = class SpaceError extends SyntaxError {
  constructor ({ line, column }) {
    super(`illegal indent (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 588:
/***/ (function(module, __unusedexports, __webpack_require__) {

const notempty = __webpack_require__(455)
const NameError = __webpack_require__(881)

/**
 * extract a vector value
 *
 * @param {array} lines
 * @param {number} index
 * @returns {object} {end, value}
 */
module.exports = function vector (lines) {

  let copy = lines.slice(0)
  let end = copy[0].length + 1 // len of the tokes in the line plus one for the line itself
  let raw = copy.shift().filter(notempty)[0]
  let name = raw.value

  if (!name || raw.type != 'string')
    throw new NameError(lines[0][0])

  let value = {}
  value[name] = []

  let done = false
  while (!done) {
    let line = copy.shift()
    let indented = Array.isArray(line) && line.length > 2 && line[0].type == 'space' && line[1].type == 'space'
    if (indented && done === false) {
      end += 1 // one for the line
      end += line.length // for all the tokens in the given line
      value[name].push(line.filter(notempty)[0].value)
    }
    else {
      done = true
    }
  }

  return { end, value }
}


/***/ }),

/***/ 590:
/***/ (function(module) {

function webpackEmptyContext(req) {
	if (typeof req === 'number' && __webpack_require__.m[req])
  return __webpack_require__(req);
try { return require(req) }
catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e }
var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 590;

/***/ }),

/***/ 592:
/***/ (function(module, __unusedexports, __webpack_require__) {

const conversions = __webpack_require__(445);
const route = __webpack_require__(260);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 594:
/***/ (function(module, __unusedexports, __webpack_require__) {

let read = __webpack_require__(951)
let validate = __webpack_require__(850)
let { homedir } = __webpack_require__(87)

module.exports = function getPrefs ({ scope, inventory }) {
  let cwd = scope === 'global'
    ? homedir()
    : inventory._project.src

  // Populate preferences
  let prefs = read({ type: 'preferences', cwd })
  if (prefs.filepath) {
    let preferences = {}
    // Ok, this gets a bit hairy
    // Arc outputs an object of nested arrays
    // Basically, construct a pared-down intermediate prefs obj for consumers
    Object.entries(prefs.arc).forEach(([ key, val ]) => {
      // TODO add additional preferences checks and normalization
      if (!preferences[key]) preferences[key] = {}
      if (Array.isArray(val)) {
        val.forEach(v => {
          if (Array.isArray(v)) {
            if (v.length === 1)       preferences[key] = v[0]
            else if (v.length === 2)  preferences[key][v[0]] = v[1]
            else if (v.length > 2)    preferences[key][v[0]] = [ ...v.slice(1) ]
          }
          else if (typeof v === 'object' && Object.keys(v).length) {
            Object.keys(v).forEach(k => preferences[key][k] = v[k])
          }
          else if (!Array.isArray(v)) preferences[key] = v
        })
      }
      // Turn env vars with spaces into strings
      if (key === 'env') {
        [ 'testing', 'staging', 'production' ].forEach(e => {
          if (preferences.env[e]) {
            Object.entries(preferences.env[e]).forEach(([ key, val ]) => {
              if (Array.isArray(val)) preferences.env[e][key] = val.join(' ')
            })
          }
        })
      }
      // Turn Sandbox scripts into commands
      if (key === 'sandbox-startup') {
        preferences[key] = val.map(v => {
          if (typeof v === 'string') return v
          if (Array.isArray(v)) return v.join(' ')
        })
      }
    })

    validate(preferences)

    return {
      preferences: {
        ...preferences,
        _arc: prefs.arc,
        _raw: prefs.raw,
      },
      preferencesFile: prefs.filepath
    }
  }

  return null
}


/***/ }),

/***/ 597:
/***/ (function(module, __unusedexports, __webpack_require__) {

let validateARN = __webpack_require__(537)
let { sep } = __webpack_require__(622)

/**
 * Layer validator
 * @param {array} layers - Layers to check
 * @param {string} region - Current configured AWS region
 * @param {string} location - Item containing potentially offending layer config
 */
module.exports = function validate (params, callback) {
  let { layers, region, location } = params
  if (!layers || !layers.length) callback()
  else {
    let err = []
    if (layers.length > 5) {
      let layerList = '\n  - ' + layers.join('\n  - ')
      err.push(`- Lambda can only be configured with up to 5 layers; got:${layerList}`)
    }
    // CloudFormation fails without a helpful error if any layers aren't in the same region as the app because CloudFormation
    for (let arn of layers) {
      let arnError = validateARN({ arn, region })
      if (arnError) err.push(arnError)
    }

    if (err.length) {
      // Location may be missing if running statelessly
      location = location && location.startsWith(sep) ? location.substr(1) : location
      let loc = location ? ' in ' + location : ''
      let msg = `Layer validation error${err.length > 1 ? 's' : ''}${loc}:\n${err.join('\n')}`
      callback(Error(msg))
    }
    else callback()
  }
}


/***/ }),

/***/ 598:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var polyfills = __webpack_require__(250)
var legacy = __webpack_require__(466)
var clone = __webpack_require__(608)

var util = __webpack_require__(669)

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  })
}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!fs[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = global[gracefulQueue] || []
  publishQueue(fs, queue)

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs[gracefulQueue])
      __webpack_require__(357).equal(fs[gracefulQueue].length, 0)
    })
  }
}

if (!global[gracefulQueue]) {
  publishQueue(global, fs[gracefulQueue]);
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$copyFile = fs.copyFile
  if (fs$copyFile)
    fs.copyFile = copyFile
  function copyFile (src, dest, flags, cb) {
    if (typeof flags === 'function') {
      cb = flags
      flags = 0
    }
    return fs$copyFile(src, dest, flags, function (err) {
      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([fs$copyFile, [src, dest, flags, cb]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    })
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
}

function retry () {
  var elem = fs[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ 599:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const onetime = __webpack_require__(723);
const signalExit = __webpack_require__(497);

module.exports = onetime(() => {
	signalExit(() => {
		process.stderr.write('\u001B[?25h');
	}, {alwaysLast: true});
});


/***/ }),

/***/ 600:
/***/ (function(module, __unusedexports, __webpack_require__) {

const path = __webpack_require__(622);
const getInventory = __webpack_require__(454);

module.exports = async function getPaths() {
  const { inv: inventory } = await getInventory({ cwd: path.join(__dirname, '..') });

  // NOTE: no need to worry about inventory.macros, the are not deployed
  return [path.resolve(inventory.shared.src), ...inventory.lambdaSrcDirs];
};


/***/ }),

/***/ 606:
/***/ (function(module) {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};


/***/ }),

/***/ 608:
/***/ (function(module) {

"use strict";


module.exports = clone

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
}

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: getPrototypeOf(obj) }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 619:
/***/ (function(module) {

module.exports = require("constants");

/***/ }),

/***/ 621:
/***/ (function(module) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 631:
/***/ (function(module, __unusedexports, __webpack_require__) {

let read = __webpack_require__(951)
let getHandler = __webpack_require__(64)
let upsert = __webpack_require__(305)

// Pragma-specific Lambda constructors
let getHTTP = __webpack_require__(640)
let getEvents = __webpack_require__(28)
let getPlugins = __webpack_require__(100)
let getScheduled = __webpack_require__(986)
let getWS = __webpack_require__(221)
let getStreams = __webpack_require__(558)

/**
 * Build out the Lambda tree
 */
function populateLambda (type, pragma, inventory) {
  if (!pragma || !pragma.length) return null // Jic

  let createDefaultConfig = () => JSON.parse(JSON.stringify(inventory._project.defaultFunctionConfig))
  let cwd = inventory._project.src

  // Fill er up
  let lambdas = []

  for (let item of pragma) {
    // Get name, source dir, and any pragma-specific properties
    let results = getLambda({ type, item, cwd, inventory })
    // some lambda populators (e.g. plugins) may return empty results
    if (!results) continue
    // some lambda populators (e.g. plugins) may return multiple results
    if (!(Array.isArray(results))) results = [ results ]

    results.forEach(result => {
      let { name, src } = result
      // Set up fresh config
      let config = createDefaultConfig()

      // Knock out any pragma-specific early
      if (type === 'queues') {
        config.fifo = config.fifo === undefined ? true : config.fifo
      }
      if (type === 'http') {
        if (name.startsWith('get ') || name.startsWith('any ')) config.views = true
      }

      // Populate the handler before deferring to function config
      if (item[name] && item[name].handler) config.handler = item[name].handler

      // Now let's check in on the function config
      let { arc: arcConfig, filepath, errors } = read({ type: 'functionConfig', cwd: src })
      if (errors) throw Error(errors)

      // Set function config file path (if one is present)
      let configFile = filepath ? filepath : null

      // Layer any function config over Arc / project defaults
      if (arcConfig && arcConfig.aws) {
        config = upsert(config, arcConfig.aws)
      }
      if (arcConfig && arcConfig.arc) {
        config = upsert(config, arcConfig.arc)
      }

      // Tidy up any irrelevant params
      if (type !== 'http') {
        delete config.apigateway
      }

      // Now we know the final source dir + runtime + handler: assemble handler props
      let { handlerFile, handlerFunction } = getHandler(config, src)

      let lambda = {
        name,
        config,
        src,
        handlerFile,
        handlerFunction,
        configFile,
        ...result, // Any other pragma-specific stuff
      }

      lambdas.push(lambda)
    })
  }

  return lambdas
}

function getLambda (params) {
  let { type } = params
  params.dir = `src/${type}/`

  if (type === 'http')      return getHTTP(params)
  if (type === 'events')    return getEvents(params)
  if (type === 'plugins')   return getPlugins(params)
  if (type === 'queues')    return getEvents(params) // Effectively the same as events
  if (type === 'scheduled') return getScheduled(params)
  if (type === 'streams')   return getStreams(params)
  if (type === 'tables')    return getStreams(params) // Shortcut for creating streams
  if (type === 'ws')        return getWS(params)
}

module.exports = {
  events:     populateLambda.bind({}, 'events'),
  http:       populateLambda.bind({}, 'http'),
  plugins:    populateLambda.bind({}, 'plugins'),
  queues:     populateLambda.bind({}, 'queues'),
  scheduled:  populateLambda.bind({}, 'scheduled'),
  streams:    populateLambda.bind({}, 'streams'),
  tables:     populateLambda.bind({}, 'tables'),
  ws:         populateLambda.bind({}, 'ws'),
}


/***/ }),

/***/ 640:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let { getLambdaName } = __webpack_require__(7)

module.exports = function populateHTTP ({ item, dir, cwd }) {
  let methods = [ 'get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'any' ]
  let validMethod = str => methods.some(m => m === str.toLowerCase())
  let validPath = str => str.match(/^\/[a-zA-Z0-9/\-:._\*]*$/) // TODO add more validation
  if (Array.isArray(item) && item.length === 2) {
    let method = item[0].toLowerCase()
    let path = item[1]
    let valid = validMethod(method) && validPath(path)
    if (valid) {
      let name = `${method} ${path}`
      let lambdaName = `${method}${getLambdaName(path)}`
      let src = join(cwd, dir, lambdaName)
      let route = { name, method, path, src }
      return route
    }
  }
  else if (typeof item === 'object' && !Array.isArray(item)) {
    let path = Object.keys(item)[0]
    let method = item[path].method.toLowerCase()
    let valid = validMethod(method) && validPath(path)
    if (valid) {
      let name = `${method} ${path}`
      let lambdaName = `${method}${getLambdaName(path)}`
      let src = item[path].src
        ? join(cwd, item[path].src)
        : join(cwd, dir, lambdaName)
      let route = { name, method, path, src }
      return route
    }
  }
  throw Error(`Invalid @http item: ${item}`)
}


/***/ }),

/***/ 653:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let validate = __webpack_require__(689)
let is = __webpack_require__(300)
let lambdae = __webpack_require__(517)

module.exports = function configureShared ({ arc, pragmas, inventory }) {
  if (!pragmas.lambdaSrcDirs) return null

  let cwd = inventory._project.src
  let src = join(cwd, 'src', 'shared')
  let shared = {
    src,
    shared: [] // Revert to null later if none are defined
  }
  if (arc.shared && arc.shared.length) {
    let foundSrc = false

    // First pass to get + check views folder (if any)
    for (let share of arc.shared) {
      if (is.array(share)) {
        let key = share[0].toLowerCase()
        if (key === 'src' && is.string(share[1])) {
          shared.src = share[1]
          foundSrc = true
          validate.shared(shared.src, cwd)
        }
      }
    }

    // Proceeding from here resets all views config, so make sure it's only if specific views are specified
    let some = !(arc.shared.length === 1 && foundSrc)
    if (some) {
      // Reset shared settings
      for (let pragma of lambdae) {
        if (!pragmas[pragma]) continue
        for (let { config } of pragmas[pragma]) {
          config.shared = false
        }
      }

      // Set new shared settings
      for (let pragma of arc.shared) {
        if (is.array(pragma)) continue // Bail on src setting
        if (!is.object(pragma)) {
          throw Error(`@shared invalid setting: ${p}`)
        }

        let p = Object.keys(pragma)[0]
        if (!lambdae.includes(p)) {
          throw Error(`${p} is not a valid @shared pragma`)
        }

        let entries = is.object(pragma[p])
          ? Object.entries(pragma[p])
          : pragma[p]
        for (let lambda of entries) {
          let name = p === 'http' ? lambda.join(' ') : lambda
          let fn = pragmas[p].find(n => n.name === name)
          if (!fn) {
            throw Error(`@shared ${name} not found in @${p} Lambdas`)
          }
          // Ignore shared into ASAP
          if (!fn.arcStaticAssetProxy) fn.config.shared = true
        }
      }
    }
  }

  // Exit if default views folder doesn't exist
  if (!is.exists(shared.src)) return null

  // lambda.config.shared was added by function config defaults, or added above
  for (let pragma of lambdae) {
    if (!pragmas[pragma]) continue
    for (let { src, config } of pragmas[pragma]) {
      if (config.shared === true && !shared.shared.includes(src)) {
        shared.shared.push(src)
      }
    }
  }

  return shared
}


/***/ }),

/***/ 654:
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 656:
/***/ (function(module) {

module.exports = pathsort
module.exports.standalone = standalone

function pathsort(paths, sep) {
  sep = sep || '/'

  return paths.map(function(el) {
    return el.split(sep)
  }).sort(sorter).map(function(el) {
    return el.join(sep)
  })
}

function sorter(a, b) {
  var l = Math.max(a.length, b.length)
  for (var i = 0; i < l; i += 1) {
    if (!(i in a)) return -1
    if (!(i in b)) return +1
    if (a[i].toUpperCase() > b[i].toUpperCase()) return +1
    if (a[i].toUpperCase() < b[i].toUpperCase()) return -1
    if (a.length < b.length) return -1
    if (a.length > b.length) return +1
  }
}

function standalone(sep) {
  sep = sep || '/'
  return function pathsort(a, b) {
    return sorter(a.split(sep), b.split(sep))
  }
}


/***/ }),

/***/ 663:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __webpack_require__(592);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ 664:
/***/ (function(module) {

/**
 * Adjusts cardinality of some Architect specific keys to make them nicer to author in JSON, YAML and TOML
 */
module.exports = function parseJSON (text) {
  let json = JSON.parse(text)
  let result = {}

  // Arc pragmas that are already arrays and can pass through as is
  let SKIP = [ 'macros' ]

  // Arc pragmas that are standalone, or that we expect to be objects and needing convertion to arrays
  let CONVERT = [ 'aws', 'cdn', 'macros', 'static' ]

  // Arc pragmas expressed as arrays or objects of items (each of which may be simple and verbose)
  let ARC = [ 'app', 'events', 'http', 'indexes', 'queues', 'scheduled', 'streams', 'ws', 'tables' ]

  Object.entries(json).forEach(([ pragma, values ]) => {
    // Pass through arrays
    if (SKIP.includes(pragma)) {
      if (!isArray(values)) invalidPragma(pragma)
      result[pragma] = values
      return
    }

    // Convert app:name to app:[name]
    if (pragma === 'app' && !isArray(values)) {
      result[pragma] = [ values ]
      return
    }

    // Core Architect pragmas may come as objects or arrays
    if (ARC.includes(pragma)) {
      // Objects of Arc items convert to tuples
      // Before: { get: '/' }
      // After: [ [ 'get', '/' ] ]
      if (isObject(values)) {
        result[pragma] = Object.entries(values).map(([ item, value ]) => {
          if (isString(value)) return [ item, value ]
          if (isObject(value) && !Object.keys(value).length) return item
          if (isObject(value)) return { [item]: value }
        })
        return
      }
      // Objects of Arc items convert to tuples
      // Before: [ { get: '/' } ]
      // After: [ [ 'get', '/' ] ]
      else if (isArray(values)) {
        result[pragma] = values.map(lambda => {
          if (isString(lambda)) return lambda
          else if (isObject(lambda)) {
            let name = Object.keys(lambda)[0]
            // Simple format
            if (isString(lambda[name])) return [ name, lambda[name] ]
            // Verbose format
            else if (isObject(lambda[name])) return lambda
            // Otherwise, it's an invalid Lambda, fall through to error
          }
          // TOML, basically
          else if (isArray(lambda)) return lambda
          invalid(lambda)
        })
        return
      }
      else invalidPragma(pragma)
    }

    // Convert plain objects to tuples (aws, static, etc.)
    // This will add unknown pragmas that are top level objects, too
    if (CONVERT.includes(pragma)) {
      if (isObject(values))     result[pragma] = Object.entries(values).map(i => i)
      else if (isArray(values)) result[pragma] = values
      else invalidPragma(pragma)
    }

    // Accept foreign pragmas
    // Pass through arrays, or convert plain objects to tuples (aws, static, scheduled)
    if (isObject(values) || isArray(values)) {
      result[pragma] = isObject(values) ? Object.entries(values).map(i => i) : values
      return
    }
  })

  return result
}

let { isArray } = Array
let isObject = i => typeof i === 'object' && !isArray(i)
let isString = i => typeof i === 'string'
function invalidPragma (pragma) {
  throw Error(`Invalid pragma: ${JSON.stringify(pragma, null, 2)}`)
}
function invalid (lambda) {
  throw Error(`Invalid Lambda: ${JSON.stringify(lambda, null, 2)}`)
}


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 674:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
var reqs = Object.create(null)
var once = __webpack_require__(49)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 676:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const fs = __webpack_require__(747).promises;
const path = __webpack_require__(622);
const core = __webpack_require__(470);
const getContents = __webpack_require__(805);
const getPaths = __webpack_require__(600);

async function main() {
  const workspace = core.getInput('workspace') != null ? core.getInput('workspace') : '.';
  core.debug(`Using workspace ${workspace}`);

  const filepath = path.resolve(__dirname, `../${workspace}/.npmrc`);
  const content = getContents();
  await fs.writeFile(filepath, content);

  core.info(`Created file at ${filepath}`);
  core.setOutput('filepath', filepath);

  const paths = await getPaths();
  core.info(`Target paths: ${paths.join(', ')}`);

  await Promise.all(
    paths.map(async (p) => {
      const target = `${p}/.npmrc`;
      core.debug(`Copy file: ${filepath} -> ${target}`);
      await fs.copyFile(filepath, target);
    })
  );
}

main().catch((error) => {
  core.setFailed(error.message);
});


/***/ }),

/***/ 681:
/***/ (function(module) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 689:
/***/ (function(module, __unusedexports, __webpack_require__) {

let aws = __webpack_require__(46)
let shared = __webpack_require__(924)
let { patterns, regex, size } = __webpack_require__(295)

module.exports = {
  // Pragmas and project validation
  aws,
  shared, // Also includes views

  // TODO prime refactor candidate as we get deeper into validation:
  // Meta
  patterns,
  validate: {
    regex,
    size
  },
}


/***/ }),

/***/ 708:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let { existsSync } = __webpack_require__(747)

module.exports = function asapSrc () {
  // Inventory running as an arc/arc dependency (most common use case)
  let src = __webpack_require__.ab + "dist"
  // Inventory running in arc/arc as a global install
  let global = __webpack_require__.ab + "dist"
  // Inventory running from a local (symlink) context (usually testing/dev)
  let local = join(__dirname, '..', '..', 'node_modules', '@architect', 'asap', 'dist')
  if (!existsSync(__webpack_require__.ab + "dist") && existsSync(global)) src = __webpack_require__.ab + "dist"
  else if (!existsSync(src) && existsSync(local)) src = local

  return src
}


/***/ }),

/***/ 710:
/***/ (function(module, __unusedexports, __webpack_require__) {

let toml = __webpack_require__(244)
let json = __webpack_require__(664)

module.exports = function parseTOML (text) {
  return json(JSON.stringify(toml.parse(text)))
}


/***/ }),

/***/ 712:
/***/ (function(module) {

/*! run-series. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runSeries

function runSeries (tasks, cb) {
  var current = 0
  var results = []
  var isSync = true

  function done (err) {
    function end () {
      if (cb) cb(err, results)
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (err, result) {
    results.push(result)
    if (++current >= tasks.length || err) done(err)
    else tasks[current](each)
  }

  if (tasks.length > 0) tasks[0](each)
  else done(null)

  isSync = false
}


/***/ }),

/***/ 723:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const mimicFn = __webpack_require__(750);

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = onetime;
// TODO: Remove this for the next major release
module.exports.default = onetime;

module.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};


/***/ }),

/***/ 729:
/***/ (function(module, __unusedexports, __webpack_require__) {

let upsert = __webpack_require__(305)
let validate = __webpack_require__(689)

module.exports = function configureAWS ({ arc, inventory }) {
  if (!arc.aws) return inventory.aws

  let aws = upsert(inventory.aws, arc.aws)

  validate.aws(aws)

  return aws
}


/***/ }),

/***/ 745:
/***/ (function(module, __unusedexports, __webpack_require__) {


/**
 * Read env vars out of SSM
 */
module.exports = function env (params, inventory, callback) {
  if (params.env) {
    // eslint-disable-next-line
    let aws = __webpack_require__(71)
    let name = inventory.app
    let { region } = inventory.aws
    let ssm = new aws.SSM({ region })
    let result = []

    function getSomeEnvVars (name, NextToken, callback) {
      // Base query to ssm
      let query = {
        Path: `/${name}`,
        Recursive: true,
        MaxResults: 10,
        WithDecryption: true
      }

      // Check if we're paginating
      if (NextToken) query.NextToken = NextToken

      // Perform the query
      ssm.getParametersByPath(query, function _query (err, data) {
        if (err) callback(err)
        else {
          // Tidy up the response
          result = result.concat(data.Parameters.map(function (param) {
            let bits = param.Name.split('/')
            return {
              app: name, // jic
              env: bits[2],
              name: bits[3],
              value: param.Value,
            }
          }))
          // Check for more data and, if so, recurse
          if (data.NextToken) {
            getSomeEnvVars(name, data.NextToken, callback)
          }
          else callback(null, result)
        }
      })
    }

    getSomeEnvVars(name, false, function done (err, result) {
      if (err) callback(err)
      else {
        let env = null
        if (result.length) {
          let testing = null
          let staging = null
          let production = null
          result.forEach(r => {
            if (r.env === 'testing') testing = Object.assign({}, testing, { [r.name]: r.value })
            if (r.env === 'staging') staging = Object.assign({}, staging, { [r.name]: r.value })
            if (r.env === 'production') production = Object.assign({}, production, { [r.name]: r.value })
          })
          env = { testing, staging, production }
        }
        callback(null, env)
      }
    })
  }
  else callback()
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 750:
/***/ (function(module) {

"use strict";


const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;


/***/ }),

/***/ 753:
/***/ (function(module, __unusedexports, __webpack_require__) {

let is = __webpack_require__(300)

module.exports = function _get (inventory) {
  function getter (prag, name) {
    let pragma = inventory[prag]

    // Getters
    if (pragma === null) return null
    if (Array.isArray(pragma)) {
      // Handle arrays of named entities or string values
      let finder = i => i && i.name && i.name === name || i === name
      if (multipleResults.includes(prag)) {
        let results = pragma.filter(finder)
        return results.length ? results : undefined
      }
      return pragma.find(finder)
    }
    else if (is.object(pragma)) {
      return pragma[name]
    }
    else if (is.string(pragma) && !name) {
      return pragma
    }
    else if (is.bool(pragma) && !name) {
      return pragma
    }
    return undefined // jic
  }

  let get = {}
  Object.keys(inventory).forEach(pragma => {
    get[pragma] = getter.bind({}, pragma)
  })
  return get
}

// Everything is uniquely named except in certain special-case pragmas
// These refer to other pragmas, and thus may allow multiple same/same-named entities
let multipleResults = [
  'indexes'
]


/***/ }),

/***/ 754:
/***/ (function(module) {

"use strict";


const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ 799:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { join } = __webpack_require__(622)
const { existsSync } = __webpack_require__(747)

module.exports = function getPluginModules (project) {
  const arc = project.arc
  if (!arc.plugins || !arc.plugins.length) return null
  let plugins = {}
  let cwd = project.src
  for (let name of arc.plugins) {
    let pluginPath = null
    let localPath = join(cwd, 'src', 'plugins', `${name}.js`)
    let localPath1 = join(cwd, 'src', 'plugins', name)
    let modulePath = join(cwd, 'node_modules', name)
    let modulePath1 = join(cwd, 'node_modules', `@${name}`)
    if (existsSync(localPath)) pluginPath = localPath
    else if (existsSync(localPath1)) pluginPath = localPath1
    else if (existsSync(modulePath)) pluginPath = modulePath
    else if (existsSync(modulePath1)) pluginPath = modulePath1
    // eslint-disable-next-line
    if (pluginPath) plugins[name] = __webpack_require__(590)(pluginPath)
    else console.warn(`Cannot find plugin ${name}! Are you sure you have installed or created it correctly?`)
  }
  return plugins
}


/***/ }),

/***/ 805:
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);

module.exports = function getContents() {
  const registry = core.getInput('registry');
  const token = core.getInput('token');
  const scope = core.getInput('scope');

  core.debug(`Using scope ${scope}`);
  core.debug(`Using registry ${registry}`);

  if (!registry || registry.length === 0) {
    throw new Error('Registry not provided');
  }

  const authString = token ? `//${registry}/:_authToken=${token}` : '';
  const regString = scope ? `${scope}:registry=${registry}` : `registry=${registry}`;

  return `${authString}
${regString}`.trim();
};


/***/ }),

/***/ 811:
/***/ (function(module) {

// we-like-strings-LikeThisOne_or_2
const DASHERIZED = /^([a-zA-Z0-9_-]+)$/

// Emptyness is not nothingness
const SPACE = / /
const NEWLINE = /(\r\n|\r|\n)/
const TAB = /\t/

/**
 * reserved syntax:
 *
 * - # comments
 * - @ pragmas
 * - \ (we need for c style escaping like \n)
 * - {} braces
 * - [] brackets
 * - <> angle brackets
 *
 * (note: any of those symbols can be quoted)
 */
const PRAGMA = /\@/
const COMMENT = /\#/
const RESERVED = /\{|\}|\[|\]|\<|\>/

/**
 * strings are REALLY loose in .arc formats!
 *
 * this allows to have config with full clean paths like
 * ./../foo/bar/baz.buzz
 *
 * allow:
 *
 * - open paren (
 * - close paren )
 * - slash /
 * - letters
 * - tilde ~
 * - dashes -
 * - underscore _
 * - dot .
 * - comma ,
 * - colon :
 * - dolla $
 * - star * (we use this for **String and *String for succinct Dynamo tables)
 * - question ?
 * - ampersand &
 * - bang !
 * - percent %
 * - equals =
 * - plus +
 * - pipe |
 * - caret ^
 * - backtick `
 * - single quote '
 * - double quote " is greedy, supports newlines and must have a closing "
 */
const STRING = /(\()|(\))|(\/)|(\w)|(\~)|(-)|(\_)|(\.)|(\,)|(\:)|(\$)|(\*)|(\?)|(\&)|(\!)|(\%)|(\=)|(\+)|(\|)|(\^)|(\`)|(\')|(\")/

/**
 * numbers (integer or float; negative modifier supported)
 */
const NUMBER = /(\-)|(\d)/

/**
 * boolean literal constants: true and false
 */
const BOOLEAN = /(t)|(f)/

module.exports = { DASHERIZED, SPACE, NEWLINE, TAB, PRAGMA, COMMENT, RESERVED, STRING, NUMBER, BOOLEAN }


/***/ }),

/***/ 817:
/***/ (function(module, __unusedexports, __webpack_require__) {

let parse = __webpack_require__(989)
let { existsSync: exists, readFileSync } = __webpack_require__(747)
let { join } = __webpack_require__(622)
let read = p => readFileSync(p).toString()

/**
 * Look up a set of files in various formats and parse them, depending on type
 *
 * @param {object} reads - object containing order-specific arrays of filenames to check
 * @param {string} cwd - absolute path to current working directory
 * @returns {object} { arc, raw, filepath }
 */
module.exports = function reader (reads, cwd) {
  let filepath = false
  let raw = null
  let arc = null

  Object.entries(reads).forEach(([ type, value ]) => {
    // Bail if we found something
    if (filepath) return

    // Crawl the specified files; _default assumes a string
    if (Array.isArray(value)) {
      value.forEach(f => {
        // Again, bail if we found something
        if (filepath) return

        try {
          // Bail if file doesn't exist
          let file = join(cwd, f)
          if (!exists(file)) return

          if (type !== 'manifest') {
            filepath = file
            raw = read(file)
            if (raw.trim() === '') throw Error('empty file')
            arc = type === 'arc'
              ? parse(raw)
              : parse[type](raw) // Parser has convenient json, yaml, toml methods!
          }
          else if (f === 'package.json') {
            let pkg = JSON.parse(read(file))
            let foundArc = pkg.arc || pkg.architect
            if (foundArc) {
              filepath = file
              raw = JSON.stringify(foundArc, null, 2)
              arc = parse.json(raw)
            }
          }
        }
        catch (err) {
          throw Error(`Problem reading ${f}: ${err.message}`)
        }
      })
    }

    // Allow for a default backup
    if (type === '_default' && !filepath) {
      raw = value
      arc = parse(raw)
    }
  })

  return { arc, raw, filepath }
}


/***/ }),

/***/ 825:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)
let validate = __webpack_require__(689)
let is = __webpack_require__(300)

module.exports = function configureViews ({ arc, pragmas, inventory }) {
  if (arc.views && !arc.http) throw Error('@views requires @http')
  if (!arc.http) return null

  let cwd = inventory._project.src
  let src = join(cwd, 'src', 'views')
  let views = {
    src,
    views: [] // Revert to null later if none are defined
  }

  if (arc.views && arc.views.length) {
    let foundSrc = false

    // First pass to get + check views folder (if any)
    for (let view of arc.views) {
      let key = view[0].toLowerCase()
      if (key === 'src' && is.string(view[1])) {
        views.src = view[1]
        foundSrc = true
        validate.shared(views.src, cwd)
      }
    }

    // Proceeding from here resets all views config, so make sure it's only if specific views are specified
    let some = !(arc.views.length === 1 && foundSrc)
    if (some) {
      // Reset views settings
      for (let route of pragmas.http) {
        route.config.views = false
      }

      // Set new views settings
      for (let view of arc.views) {
        let method = view[0].toLowerCase()
        let path = view[1]
        if (method === 'src') continue
        let name = `${method} ${path}`
        let route = pragmas.http.find(n => n.name === name)
        if (!route) {
          throw Error(`@views ${name} not found in @http routes`)
        }
        // Ignore views into ASAP
        if (!route.arcStaticAssetProxy) route.config.views = true
      }
    }
  }

  // Exit if default views folder doesn't exist
  if (!is.exists(views.src)) return null

  // lambda.config.views was added by Lambda populator defaults, or added above
  for (let { src, config } of pragmas.http) {
    if (config.views === true && !views.views.includes(src)) {
      views.views.push(src)
    }
  }

  return views
}


/***/ }),

/***/ 828:
/***/ (function(module) {

module.exports = function configureProxy ({ arc }) {
  if (arc.proxy && !arc.http) throw Error('@proxy requires @http')
  if (!arc.proxy || !arc.http) return null

  let proxy = {}
  let envs = [ 'testing', 'staging', 'production' ]
  envs.forEach(env => {
    let setting = arc.proxy.find(s => {
      return (s[0] && s[0] === env) && s[1]
    })
    if (!setting) throw Error(`@proxy ${env} environment not found`)
    proxy[env] = setting[1]
  })
  return proxy
}


/***/ }),

/***/ 833:
/***/ (function(module) {

module.exports = function configureTables ({ arc }) {
  if (!arc.tables || !arc.tables.length) return null

  let tables = arc.tables.map(t => {
    if (typeof t === 'object' && !Array.isArray(t)) {
      let name = Object.keys(t)[0]
      let table = {
        name,
        partitionKey: null,
        partitionKeyType: null,
        sortKey: null,
        sortKeyType: null,
        stream: null,
        ttl: null,
        encrypt: null,
        PointInTimeRecovery: null,
      }
      Object.entries(t[name]).forEach(([ key, value ]) => {
        let isStr = typeof value === 'string'
        let pitr = 'PointInTimeRecovery' // It's just so long
        if (isStr && value.startsWith('**')) {
          table.sortKey = key
          table.sortKeyType = value.replace('**', '')
        }
        else if (isStr && value.startsWith('*')) {
          table.partitionKey = key
          table.partitionKeyType = value.replace('*', '')
        }
        if (key === 'stream')   table.stream = value
        if (value === 'TTL')    table.ttl = key
        if (key === 'encrypt')  table.encrypt = value
        if (key === pitr)       table[pitr] = value
        if (key === 'legacy')   table.legacy = value // Arc v5 to v8+ compat
      })

      return table
    }
    throw Error(`Invalid @tables item: ${t}`)
  })

  return tables
}


/***/ }),

/***/ 834:
/***/ (function(module, __unusedexports, __webpack_require__) {

const compact = __webpack_require__(157)
const type = __webpack_require__(978)
const NotFound = __webpack_require__(259)
const AlreadyDefined  = __webpack_require__(56)

/**
 * parses tokens into JSON friendly structure if possible
 *
 * @param {array} raw tokens
 * @returns {object}
 */
module.exports = function parse (raw, sourcemap = false) {

  let tokens = compact(raw)
  // console.log({tokens})

  // arcfiles must begin with an @pragma
  if (tokens[0].type != 'pragma')
    throw new NotFound

  let arc = {}
  let src = {}
  let pragma = false
  let index = 0

  while (index < tokens.length) {

    let token = tokens[index]

    if (token.type === 'pragma') {

      // pragmas must be unique
      if ({}.hasOwnProperty.call(arc, token.value))
        throw new AlreadyDefined(token)

      // create the pragma
      arc[token.value] = []

      // create a source map
      src[token.value] = []

      // keep a ref to the current pragma
      pragma = token.value
      index += 1
    }

    // ignore newlines and spaces
    let empty = token.type === 'newline' || token.type === 'space'
    if (empty)
      index += 1

    if (token.type === 'number' || token.type === 'boolean' || token.type === 'string') {
      let { end, value } = type({ tokens, index })
      arc[pragma].push(value)
      src[pragma].push({ start: token, end: tokens[index + end] })
      index += end
    }
  }

  return sourcemap ? { arc, src } : arc
}


/***/ }),

/***/ 840:
/***/ (function(module, __unusedexports, __webpack_require__) {

let populate = __webpack_require__(631)

module.exports = function configurePlugins ({ arc, inventory }) {
  if (!arc.plugins || !arc.plugins.length) return null

  let plugins = populate.plugins(arc.plugins, inventory)

  return plugins
}


/***/ }),

/***/ 843:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const ansiStyles = __webpack_require__(663);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(247);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(754);

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __webpack_require__(606);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ }),

/***/ 846:
/***/ (function(module) {

module.exports = function configureCDN ({ arc }) {
  if (arc.cdn && !arc.http) throw Error('@cdn requires @http')
  if (!arc.cdn || !arc.http) return null

  let cdn
  if (arc.cdn === true) cdn = true
  else if (Array.isArray(arc.cdn)) {
    let disabled = [ false, 'disable', 'disabled' ]
    let isDisabled = disabled.some(s => s === arc.cdn[0])
    if (isDisabled) cdn = false
    else cdn = true
  }

  return cdn
}


/***/ }),

/***/ 850:
/***/ (function(module) {

module.exports = function validatePreferences (preferences) {
  // Env checks
  let { env } = preferences
  if (!env) return
  if (env && typeof env !== 'object') envErr(env)

  let envs = [ 'testing', 'staging', 'production' ]
  envs.forEach(e => {
    if (env[e] && typeof env[e] !== 'object') envErr(e)
    if (env[e] && Array.isArray(env[e])) envErr(e)
  })
}

function envErr (e) {
  throw ReferenceError(`Invalid preferences setting: @env ${e}`)
}


/***/ }),

/***/ 856:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(622)
var minimatch = __webpack_require__(93)
var isAbsolute = __webpack_require__(681)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 859:
/***/ (function(module, __unusedexports, __webpack_require__) {

const notempty = __webpack_require__(455)
const SpaceError = __webpack_require__(578)

/**
 * extract an array value from a list of tokens
 *
 * @param {lines} an array of tokens
 * @returns {object} {end, value}
 */
module.exports = function array (lines) {

  let copy = lines.slice(0)
  let end = copy[0].length + 1
  let value = copy[0].filter(notempty).map(t => t.value)

  let nextline = copy.length > 1 && lines[1][0].type == 'space'
  if (nextline)
    throw new SpaceError(lines[1][0])

  return { end, value }
}


/***/ }),

/***/ 867:
/***/ (function(module) {

module.exports = require("tty");

/***/ }),

/***/ 881:
/***/ (function(module) {

module.exports = class VectorNameNotStrng extends SyntaxError {
  constructor ({ line, column }) {
    super(`vector name is not a string (line: ${line} column: ${column})`)
    this.line = line
    this.column = column
    this.name = this.constructor.name
  }
}


/***/ }),

/***/ 885:
/***/ (function(module) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 896:
/***/ (function(module) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 919:
/***/ (function(module, __unusedexports, __webpack_require__) {

let {
  SPACE,
  TAB,
  NEWLINE,
  PRAGMA,
  COMMENT,
  STRING,
  NUMBER,
  BOOLEAN
} = __webpack_require__(811)

let peek = __webpack_require__(237)

let UnknownError = __webpack_require__(215)

/**
 * tokenizes code including spaces and newlines (which are significant) and comments (which are not)
 *
 * @param {string} code
 * @returns {array} tokens [{type, value, line, column}]
 */
module.exports = function lex (code) {

  // state bag for our tokens
  let tokens = []

  // ensure code is terminated by a newline (stripped out later)
  code += '\n'

  // counters
  let cursor = 0
  let line = 1
  let column = 1

  // stream the code one character at a time
  while (cursor < code.length) {

    if (PRAGMA.test(code[cursor])) {
      let token = peek.pragma(cursor, code, line, column)
      tokens.push({
        type: 'pragma',
        value: token.substring(1),
        line,
        column
      })
      cursor += token.length
      column += token.length
      continue
    }

    if (COMMENT.test(code[cursor])) {
      let token = peek.comment(cursor, code)
      tokens.push({
        type: 'comment',
        value: token,
        line,
        column
      })
      cursor += token.length
      column += token.length
      continue
    }

    if (SPACE.test(code[cursor])) {
      tokens.push({
        type: 'space',
        value: ' ',
        line,
        column
      })
      cursor += 1
      column += 1
      continue
    }

    // convert tabs to spaces
    if (TAB.test(code[cursor])) {
      tokens.push({
        type: 'space',
        value: ' ',
        line,
        column
      })
      tokens.push({
        type: 'space',
        value: ' ',
        line,
        column
      })
      cursor += 1
      column += 1
      continue
    }

    if (NEWLINE.test(code[cursor])) {
      tokens.push({
        type: 'newline',
        value: '\n',
        line,
        column
      })
      cursor += 1
      line += 1
      column = 1
      continue
    }

    /* order important! this comes before str */
    if (BOOLEAN.test(code[cursor])) {
      let tmp = peek.bool(cursor, code)
      let isBoolean = tmp === 'true' || tmp === 'false'
      if (isBoolean) {
        tokens.push({
          type: 'boolean',
          value: tmp === 'false' ? false : true, // questionable
          line,
          column
        })
        cursor += tmp.length
        column += tmp.length
        continue
      }
    }

    /* order important! this needs to come before str */
    if (NUMBER.test(code[cursor])) {
      let token = peek.number(cursor, code)
      if (!Number.isNaN(Number(token))) {
        tokens.push({
          type: 'number',
          value: Number(token),
          line,
          column
        })
        cursor += token.length
        column += token.length
        continue
      }
    }

    if (STRING.test(code[cursor])) {
      let token = peek.string(cursor, code, line, column)
      let quote = code[cursor] === '"'
      tokens.push({
        type: 'string',
        value: token,
        line,
        column
      })
      cursor += token.length + (quote ? 2 : 0)
      column += token.length + (quote ? 2 : 0)
      continue
    }

    throw new UnknownError({ character: code[cursor], line, column })
  }

  return tokens
}


/***/ }),

/***/ 924:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join, resolve, sep } = __webpack_require__(622)
let is = __webpack_require__(300)

module.exports = function validateShared (src, cwd) {
  let path = src && resolve(join(cwd, src))

  if (!is.exists(path)) {
    throw Error(`Directory not found: ${src}`)
  }
  if (!is.folder(path)) {
    throw Error(`Must be a directory: ${src}`)
  }
  let valid = path && path.startsWith(cwd) &&
              (cwd.split(sep) < path.split(sep))
  if (!valid) throw Error(`Directory must be a subfolder of this project: ${src}`)
}


/***/ }),

/***/ 946:
/***/ (function(module) {

/*! run-waterfall. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
module.exports = runWaterfall

function runWaterfall (tasks, cb) {
  var current = 0
  var isSync = true

  function done (err, args) {
    function end () {
      args = args ? [].concat(err, args) : [err]
      if (cb) cb.apply(undefined, args)
    }
    if (isSync) process.nextTick(end)
    else end()
  }

  function each (err) {
    var args = Array.prototype.slice.call(arguments, 1)
    if (++current >= tasks.length || err) {
      done(err, args)
    } else {
      tasks[current].apply(undefined, [].concat(args, each))
    }
  }

  if (tasks.length) {
    tasks[0](each)
  } else {
    done(null)
  }

  isSync = false
}


/***/ }),

/***/ 951:
/***/ (function(module, __unusedexports, __webpack_require__) {

let reader = __webpack_require__(817)

// The Architect project manifest
let projectManifest = {
  arc: [ 'app.arc', '.arc' ],
  json: [ 'arc.json' ],
  yaml: [ 'arc.yaml', 'arc.yml' ],
  toml: [ 'arc.toml' ],
  manifest: [ 'package.json' ],
  _default: `@app\napp-default\n@http\n@static`,
}

// Individual Lambda function configurations
let functionConfig = {
  arc: [ 'config.arc', '.arc-config' ],
  json: [ 'arc.json', 'arc-config.json' ],
  yaml: [ 'config.yaml', 'config.yml', 'arc-config.yaml', 'arc-config.yml' ],
  toml: [ 'config.toml', 'arc-config.toml' ],
}

// Local preferences
let preferences = {
  arc: [ 'preferences.arc', 'prefs.arc', '.preferences.arc', '.prefs.arc', ],
  // TODO add json, yaml, toml later if folks want it?
}

let reads = { projectManifest, functionConfig, preferences }

// Heads up: always put _default last!
module.exports = function read ({ type, cwd }) {
  if (reads[type]) return reader(reads[type], cwd)
  else throw Error('Unknown format read')
}


/***/ }),

/***/ 959:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var Transform = __webpack_require__(413).Transform
var crypto = __webpack_require__(417)
var fs = __webpack_require__(598)

exports.check = check
exports.checkSync = checkSync
exports.get = get
exports.getSync = getSync
exports.stream = stream

function check(file, expected, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = undefined
  }
  expected = expected.toLowerCase().trim()
  get(file, options, function (er, actual) {
    if (er) {
      if (er.message) er.message += ' while getting shasum for ' + file
      return cb(er)
    }
    if (actual === expected) return cb(null)
    cb(new Error(
        'shasum check failed for ' + file + '\n'
      + 'Expected: ' + expected + '\n'
      + 'Actual:   ' + actual))
  })
}
function checkSync(file, expected, options) {
  expected = expected.toLowerCase().trim()
  var actual
  try {
    actual = getSync(file, options)
  } catch (er) {
    if (er.message) er.message += ' while getting shasum for ' + file
    throw er
  }
  if (actual !== expected) {
    var ex = new Error(
        'shasum check failed for ' + file + '\n'
      + 'Expected: ' + expected + '\n'
      + 'Actual:   ' + actual)
    throw ex
  }
}


function get(file, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = undefined
  }
  options = options || {}
  var algorithm = options.algorithm || 'sha1'
  var hash = crypto.createHash(algorithm)
  var source = fs.createReadStream(file)
  var errState = null
  source
    .on('error', function (er) {
      if (errState) return
      return cb(errState = er)
    })
    .on('data', function (chunk) {
      if (errState) return
      hash.update(chunk)
    })
    .on('end', function () {
      if (errState) return
      var actual = hash.digest("hex").toLowerCase().trim()
      cb(null, actual)
    })
}

function getSync(file, options) {
  options = options || {}
  var algorithm = options.algorithm || 'sha1'
  var hash = crypto.createHash(algorithm)
  var source = fs.readFileSync(file)
  hash.update(source)
  return hash.digest("hex").toLowerCase().trim()
}

function stream(expected, options) {
  expected = expected.toLowerCase().trim()
  options = options || {}
  var algorithm = options.algorithm || 'sha1'
  var hash = crypto.createHash(algorithm)

  var stream = new Transform()
  stream._transform = function (chunk, encoding, callback) {
    hash.update(chunk)
    stream.push(chunk)
    callback()
  }
  stream._flush = function (cb) {
    var actual = hash.digest("hex").toLowerCase().trim()
    if (actual === expected) return cb(null)
    cb(new Error(
        'shasum check failed for:\n'
      + '  Expected: ' + expected + '\n'
      + '  Actual:   ' + actual))
    this.push(null)
  }
  return stream
}

/***/ }),

/***/ 978:
/***/ (function(module, __unusedexports, __webpack_require__) {

const notempty = __webpack_require__(455)
const array = __webpack_require__(859)
const vector = __webpack_require__(588)
const map = __webpack_require__(318)
const TypeUnknown = __webpack_require__(572)

/**
 * extracts scalar, array, vector and map values
 *
 * @param {object} params
 * @param {array} params.tokens
 * @param {number} params.index
 *
 * @example
 * string-scalar-value
 *
 * array of values
 *
 * named
 *   vector
 *   of
 *   values
 *
 * map
 *   key value
 *   one true
 *   vector 1 2 3
 *
 * map
 *   named
 *     vector
 *     of
 *     values
 */
module.exports = function type ({ tokens, index }) {

  // working copy of the relevant tokens
  let working = tokens.slice(index, tokens.length)

  // get the indices of all newlines
  let newlines = working.map((t, i) => t.type === 'newline' ? i : false).filter(Boolean)

  // get collection of lines: [[{token}, {token}], [{token, token}]]
  let lines = newlines.reduce(function linebreak (collection, newline, index) {
    let start = index === 0 ? index : newlines[index - 1] + 1
    collection.push(working.slice(start, newline))
    return collection
  }, [])

  // extract the first three lines
  let [ first, second, third ] = lines

  // is the second line indented two spaces? (signaling a named vector or map value)
  let indent = Array.isArray(second) && second.length >= 3 && second[0].type === 'space' && second[1].type === 'space'

  // is the third line indented four spaces? (signaling a map with an initial named vector value)
  let vectorindent = Array.isArray(third) && third.length > 4 && third[0].type == 'space' && third[1].type == 'space' && third[2].type == 'space' && third[3].type == 'space'

  // is the second line a scalar (singular) value?
  let singular = second && second.filter(notempty).length === 1 && vectorindent === false

  let scalar = first.filter(notempty).length === 1

  // do we have a scalar string|number|boolean value?
  // do we have a possible array or vector value?
  // do we have a possible map value?
  let is = {
    scalar: scalar && indent === false, // string, number or boolean
    array: scalar === false, // array of scalar values
    vector: scalar && indent === true && singular === true, // vector of scalar values
    map: scalar && indent === true && singular === false // map of keys and values (scalar or vector)
  }

  if (is.scalar)
    return { end: 1, value: tokens[index].value }

  if (is.array)
    return array(lines)

  if (is.vector)
    return vector(lines, index)

  if (is.map)
    return map(lines)

  throw new TypeUnknown(tokens[index])
}


/***/ }),

/***/ 986:
/***/ (function(module, __unusedexports, __webpack_require__) {

let { join } = __webpack_require__(622)

let coerceNumbers = str => !isNaN(Number(str)) ? Number(str) : str

function getRate (expression) {
  // TODO validation
  let bits = expression.split(' ')
  bits = bits.map(coerceNumbers)
  return {
    expression,
    value: bits[0],
    interval: bits[1]
  }
}

function getCron (expression) {
  // TODO validation
  let bits = expression.split(' ')
  bits = bits.map(coerceNumbers)
  return {
    expression,
    minutes: bits[0],
    hours: bits[1],
    dayOfMonth: bits[2],
    month: bits[3],
    dayOfWeek: bits[4],
    year: bits[5],
  }
}

module.exports = function populateScheduled ({ item, dir, cwd }) {
  let rate = null
  let cron = null
  if (Array.isArray(item) && item.length >= 3) {
    let name = item[0]

    // Handle rate + cron
    let sched = item.slice(1).join(' ').split('(')
    let schedType = sched[0]
    let schedValue = sched[1].replace(')', '')
    if (schedType === 'rate') rate = getRate(schedValue)
    if (schedType === 'cron') cron = getCron(schedValue)

    let src = join(cwd, dir, name)
    return { name, src, rate, cron }
  }
  else if (typeof item === 'object' && !Array.isArray(item)) {
    let name = Object.keys(item)[0]

    // Handle rate + cron
    if (item[name].rate) rate = getRate(item[name].rate.join(' '))
    if (item[name].cron) cron = getCron(item[name].cron.join(' '))

    let src = item[name].src
      ? join(cwd, item[name].src)
      : join(cwd, dir, name)
    return { name, src, rate, cron }
  }
  throw Error(`Invalid @scheduled item: ${item}`)
}


/***/ }),

/***/ 989:
/***/ (function(module, __unusedexports, __webpack_require__) {

let lexer = __webpack_require__(919)
let parser = __webpack_require__(834)
let json = __webpack_require__(664)
let yaml = __webpack_require__(992)
let toml = __webpack_require__(710)
let stringify = __webpack_require__(521)

/**
 * @param {string} code
 * @returns {object} parsed arc object
 */
function parse (code) {
  return parser(lexer(code))
}

// Parser methods
parse.lexer = lexer
parse.parser = parser
parse.json = json
parse.yaml = yaml
parse.toml = toml
parse.stringify = stringify

module.exports = parse


/***/ }),

/***/ 992:
/***/ (function(module, __unusedexports, __webpack_require__) {

let yaml = __webpack_require__(358)
let json = __webpack_require__(664)

module.exports = function parseYAML (text) {
  return json(JSON.stringify(yaml.load(text)))
}


/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'loaded', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.l; }
/******/ 			});
/******/ 			Object.defineProperty(module, 'id', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.i; }
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);