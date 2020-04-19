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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 		return __webpack_require__(198);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";



var loader = __webpack_require__(457);
var dumper = __webpack_require__(685);


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = __webpack_require__(945);
module.exports.Schema              = __webpack_require__(43);
module.exports.FAILSAFE_SCHEMA     = __webpack_require__(581);
module.exports.JSON_SCHEMA         = __webpack_require__(23);
module.exports.CORE_SCHEMA         = __webpack_require__(611);
module.exports.DEFAULT_SAFE_SCHEMA = __webpack_require__(723);
module.exports.DEFAULT_FULL_SCHEMA = __webpack_require__(910);
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = __webpack_require__(556);

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = __webpack_require__(581);
module.exports.SAFE_SCHEMA    = __webpack_require__(723);
module.exports.DEFAULT_SCHEMA = __webpack_require__(910);

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');


/***/ }),

/***/ 23:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.





var Schema = __webpack_require__(43);


module.exports = new Schema({
  include: [
    __webpack_require__(581)
  ],
  implicit: [
    __webpack_require__(809),
    __webpack_require__(228),
    __webpack_require__(44),
    __webpack_require__(417)
  ]
});


/***/ }),

/***/ 25:
/***/ (function(module) {


module.exports = function deferred () {
   var d = {};
   d.promise = new Promise(function (resolve, reject) {
      d.resolve = resolve;
      d.reject = reject
   });

   return d;
};


/***/ }),

/***/ 39:
/***/ (function(module) {


module.exports = PullSummary;

/**
 * The PullSummary is returned as a response to getting `git().pull()`
 *
 * @constructor
 */
function PullSummary () {
   this.files = [];
   this.insertions = {};
   this.deletions = {};

   this.summary = {
      changes: 0,
      insertions: 0,
      deletions: 0
   };

   this.created = [];
   this.deleted = [];
}

/**
 * Array of files that were created
 * @type {string[]}
 */
PullSummary.prototype.created = null;

/**
 * Array of files that were deleted
 * @type {string[]}
 */
PullSummary.prototype.deleted = null;

/**
 * The array of file paths/names that have been modified in any part of the pulled content
 * @type {string[]}
 */
PullSummary.prototype.files = null;

/**
 * A map of file path to number to show the number of insertions per file.
 * @type {Object}
 */
PullSummary.prototype.insertions = null;

/**
 * A map of file path to number to show the number of deletions per file.
 * @type {Object}
 */
PullSummary.prototype.deletions = null;

/**
 * Overall summary of changes/insertions/deletions and the number associated with each
 * across all content that was pulled.
 * @type {Object}
 */
PullSummary.prototype.summary = null;

PullSummary.FILE_UPDATE_REGEX = /^\s*(.+?)\s+\|\s+\d+\s*(\+*)(-*)/;
PullSummary.SUMMARY_REGEX = /(\d+)\D+((\d+)\D+\(\+\))?(\D+(\d+)\D+\(-\))?/;
PullSummary.ACTION_REGEX = /(create|delete) mode \d+ (.+)/;

PullSummary.parse = function (text) {
   var pullSummary = new PullSummary;
   var lines = text.split('\n');

   while (lines.length) {
      var line = lines.shift().trim();
      if (!line) {
         continue;
      }

      update(pullSummary, line) || summary(pullSummary, line) || action(pullSummary, line);
   }

   return pullSummary;
};

function update (pullSummary, line) {

   var update = PullSummary.FILE_UPDATE_REGEX.exec(line);
   if (!update) {
      return false;
   }

   pullSummary.files.push(update[1]);

   var insertions = update[2].length;
   if (insertions) {
      pullSummary.insertions[update[1]] = insertions;
   }

   var deletions = update[3].length;
   if (deletions) {
      pullSummary.deletions[update[1]] = deletions;
   }

   return true;
}

function summary (pullSummary, line) {
   if (!pullSummary.files.length) {
      return false;
   }

   var update = PullSummary.SUMMARY_REGEX.exec(line);
   if (!update || (update[3] === undefined && update[5] === undefined)) {
      return false;
   }

   pullSummary.summary.changes = +update[1] || 0;
   pullSummary.summary.insertions = +update[3] || 0;
   pullSummary.summary.deletions = +update[5] || 0;

   return true;
}

function action (pullSummary, line) {

   var match = PullSummary.ACTION_REGEX.exec(line);
   if (!match) {
      return false;
   }

   var file = match[2];

   if (pullSummary.files.indexOf(file) < 0) {
      pullSummary.files.push(file);
   }

   var container = (match[1] === 'create') ? pullSummary.created : pullSummary.deleted;
   container.push(file);

   return true;
}


/***/ }),

/***/ 43:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


/*eslint-disable max-len*/

var common        = __webpack_require__(740);
var YAMLException = __webpack_require__(556);
var Type          = __webpack_require__(945);


function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return exclude.indexOf(index) === -1;
  });
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;

  function collectType(type) {
    result[type.kind][type.tag] = result['fallback'][type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  this.include  = definition.include  || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
    case 1:
      schemas = Schema.DEFAULT;
      types = arguments[0];
      break;

    case 2:
      schemas = arguments[0];
      types = arguments[1];
      break;

    default:
      throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) { return type instanceof Type; })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};


module.exports = Schema;


/***/ }),

/***/ 44:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var common = __webpack_require__(740);
var Type   = __webpack_require__(945);

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits && ch !== '_';
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') continue;
      if (!isOctCode(data.charCodeAt(index))) return false;
      hasDigits = true;
    }
    return hasDigits && ch !== '_';
  }

  // base 10 (except 0) or base 60

  // value should not start with `_`;
  if (ch === '_') return false;

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (ch === ':') break;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  // Should have digits and should not end with `_`
  if (!hasDigits || ch === '_') return false;

  // if !base60 - done;
  if (ch !== ':') return true;

  // base60 almost not used, no needs to optimize
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch, base, digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += (d * base);
      base *= 60;
    });

    return sign * value;

  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
    octal:       function (obj) { return obj >= 0 ? '0'  + obj.toString(8) : '-0'  + obj.toString(8).slice(1); },
    decimal:     function (obj) { return obj.toString(10); },
    /* eslint-disable max-len */
    hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});


/***/ }),

/***/ 57:
/***/ (function(module, __unusedexports, __webpack_require__) {


if (typeof Promise === 'undefined') {
   throw new ReferenceError("Promise wrappers must be enabled to use the promise API");
}

function isAsyncCall (fn) {
   return /^[^)]+then\s*\)/.test(fn) || /\._run\(/.test(fn);
}

module.exports = function (baseDir) {

   var Git = __webpack_require__(71);
   var gitFactory = __webpack_require__(964);
   var git;


   var chain = Promise.resolve();

   try {
      git = gitFactory(baseDir);
   }
   catch (e) {
      chain = Promise.reject(e);
   }

   return Object.keys(Git.prototype).reduce(function (promiseApi, fn) {
      if (/^_|then/.test(fn)) {
         return promiseApi;
      }

      if (isAsyncCall(Git.prototype[fn])) {
         promiseApi[fn] = git ? asyncWrapper(fn, git) : function () {
            return chain;
         };
      }

      else {
         promiseApi[fn] = git ? syncWrapper(fn, git, promiseApi) : function () {
            return promiseApi;
         };
      }

      return promiseApi;

   }, {});

   function asyncWrapper (fn, git) {
      return function () {
         var args = [].slice.call(arguments);

         if (typeof args[args.length] === 'function') {
            throw new TypeError(
               "Promise interface requires that handlers are not supplied inline, " +
               "trailing function not allowed in call to " + fn);
         }

         return chain.then(function () {
            return new Promise(function (resolve, reject) {
               args.push(function (err, result) {
                  if (err) {
                     return reject(toError(err));
                  }

                  resolve(result);
               });

               git[fn].apply(git, args);
            });
         });
      };
   }

   function syncWrapper (fn, git, api) {
      return function () {
         git[fn].apply(git, arguments);

         return api;
      };
   }

};

function toError (error) {

   if (error instanceof Error) {
      return error;
   }

   if (typeof error === 'string') {
      return new Error(error);
   }

   return Object.create(new Error(error), {
      git: { value: error },
   });
}


/***/ }),

/***/ 71:
/***/ (function(module, __unusedexports, __webpack_require__) {

(function () {

   'use strict';

   var debug = __webpack_require__(784)('simple-git');
   var deferred = __webpack_require__(25);
   var exists = __webpack_require__(265);
   var NOOP = function () {};
   var responses = __webpack_require__(898);

   /**
    * Git handling for node. All public functions can be chained and all `then` handlers are optional.
    *
    * @param {string} baseDir base directory for all processes to run
    *
    * @param {Object} ChildProcess The ChildProcess module
    * @param {Function} Buffer The Buffer implementation to use
    *
    * @constructor
    */
   function Git (baseDir, ChildProcess, Buffer) {
      this._baseDir = baseDir;
      this._runCache = [];

      this.ChildProcess = ChildProcess;
      this.Buffer = Buffer;
   }

   /**
    * @type {string} The command to use to reference the git binary
    */
   Git.prototype._command = 'git';

   /**
    * @type {[key: string]: string} An object of key=value pairs to be passed as environment variables to the
    *                               spawned child process.
    */
   Git.prototype._env = null;

   /**
    * @type {Function} An optional handler to use when a child process is created
    */
   Git.prototype._outputHandler = null;

   /**
    * @type {boolean} Property showing whether logging will be silenced - defaults to true in a production environment
    */
   Git.prototype._silentLogging = /prod/.test(process.env.NODE_ENV);

   /**
    * Sets the path to a custom git binary, should either be `git` when there is an installation of git available on
    * the system path, or a fully qualified path to the executable.
    *
    * @param {string} command
    * @returns {Git}
    */
   Git.prototype.customBinary = function (command) {
      this._command = command;
      return this;
   };

   /**
    * Sets an environment variable for the spawned child process, either supply both a name and value as strings or
    * a single object to entirely replace the current environment variables.
    *
    * @param {string|Object} name
    * @param {string} [value]
    * @returns {Git}
    */
   Git.prototype.env = function (name, value) {
      if (arguments.length === 1 && typeof name === 'object') {
         this._env = name;
      }
      else {
         (this._env = this._env || {})[name] = value;
      }

      return this;
   };

   /**
    * Sets the working directory of the subsequent commands.
    *
    * @param {string} workingDirectory
    * @param {Function} [then]
    * @returns {Git}
    */
   Git.prototype.cwd = function (workingDirectory, then) {
      var git = this;
      var next = Git.trailingFunctionArgument(arguments);

      return this.exec(function () {
         git._baseDir = workingDirectory;
         if (!exists(workingDirectory, exists.FOLDER)) {
            Git.exception(git, 'Git.cwd: cannot change to non-directory "' + workingDirectory + '"', next);
         }
         else {
            next && next(null, workingDirectory);
         }
      });
   };

   /**
    * Sets a handler function to be called whenever a new child process is created, the handler function will be called
    * with the name of the command being run and the stdout & stderr streams used by the ChildProcess.
    *
    * @example
    * require('simple-git')
    *    .outputHandler(function (command, stdout, stderr) {
    *       stdout.pipe(process.stdout);
    *    })
    *    .checkout('https://github.com/user/repo.git');
    *
    * @see https://nodejs.org/api/child_process.html#child_process_class_childprocess
    * @see https://nodejs.org/api/stream.html#stream_class_stream_readable
    * @param {Function} outputHandler
    * @returns {Git}
    */
   Git.prototype.outputHandler = function (outputHandler) {
      this._outputHandler = outputHandler;
      return this;
   };

   /**
    * Initialize a git repo
    *
    * @param {Boolean} [bare=false]
    * @param {Function} [then]
    */
   Git.prototype.init = function (bare, then) {
      var commands = ['init'];
      var next = Git.trailingFunctionArgument(arguments);

      if (bare === true) {
         commands.push('--bare');
      }

      return this._run(commands, function (err) {
         next && next(err);
      });
   };

   /**
    * Check the status of the local repo
    *
    * @param {Function} [then]
    */
   Git.prototype.status = function (then) {
      return this._run(
         ['status', '--porcelain', '-b', '-u'],
         Git._responseHandler(then, 'StatusSummary')
      );
   };

   /**
    * List the stash(s) of the local repo
    *
    * @param {Object|Array} [options]
    * @param {Function} [then]
    */
   Git.prototype.stashList = function (options, then) {
      var handler = Git.trailingFunctionArgument(arguments);
      var opt = (handler === then ? options : null) || {};

      var splitter = opt.splitter || requireResponseHandler('ListLogSummary').SPLITTER;
      var command = ["stash", "list", "--pretty=format:"
         + requireResponseHandler('ListLogSummary').START_BOUNDARY
         + "%H %ai %s%d %aN %ae".replace(/\s+/g, splitter)
         + requireResponseHandler('ListLogSummary').COMMIT_BOUNDARY
      ];

      if (Array.isArray(opt)) {
         command = command.concat(opt);
      }

      return this._run(command,
         Git._responseHandler(handler, 'ListLogSummary', splitter)
      );
   };

   /**
    * Stash the local repo
    *
    * @param {Object|Array} [options]
    * @param {Function} [then]
    */
   Git.prototype.stash = function (options, then) {
      var command = ['stash'];
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));
      command.push.apply(command, Git.trailingArrayArgument(arguments));

      return this._run(command, Git._responseHandler(Git.trailingFunctionArgument(arguments)));
   };

   /**
    * Clone a git repo
    *
    * @param {string} repoPath
    * @param {string} localPath
    * @param {String[]} [options] Optional array of options to pass through to the clone command
    * @param {Function} [then]
    */
   Git.prototype.clone = function (repoPath, localPath, options, then) {
      var next = Git.trailingFunctionArgument(arguments);
      var command = ['clone'].concat(Git.trailingArrayArgument(arguments));

      for (var i = 0, iMax = arguments.length; i < iMax; i++) {
         if (typeof arguments[i] === 'string') {
            command.push(arguments[i]);
         }
      }

      return this._run(command, function (err, data) {
         next && next(err, data);
      });
   };

   /**
    * Mirror a git repo
    *
    * @param {string} repoPath
    * @param {string} localPath
    * @param {Function} [then]
    */
   Git.prototype.mirror = function (repoPath, localPath, then) {
      return this.clone(repoPath, localPath, ['--mirror'], then);
   };

   /**
    * Moves one or more files to a new destination.
    *
    * @see https://git-scm.com/docs/git-mv
    *
    * @param {string|string[]} from
    * @param {string} to
    * @param {Function} [then]
    */
   Git.prototype.mv = function (from, to, then) {
      var handler = Git.trailingFunctionArgument(arguments);

      var command = [].concat(from);
      command.unshift('mv', '-v');
      command.push(to);

      this._run(command, Git._responseHandler(handler, 'MoveSummary'))
   };

   /**
    * Internally uses pull and tags to get the list of tags then checks out the latest tag.
    *
    * @param {Function} [then]
    */
   Git.prototype.checkoutLatestTag = function (then) {
      var git = this;
      return this.pull(function () {
         git.tags(function (err, tags) {
            git.checkout(tags.latest, then);
         });
      });
   };

   /**
    * Adds one or more files to source control
    *
    * @param {string|string[]} files
    * @param {Function} [then]
    */
   Git.prototype.add = function (files, then) {
      return this._run(['add'].concat(files), function (err, data) {
         then && then(err);
      });
   };

   /**
    * Commits changes in the current working directory - when specific file paths are supplied, only changes on those
    * files will be committed.
    *
    * @param {string|string[]} message
    * @param {string|string[]} [files]
    * @param {Object} [options]
    * @param {Function} [then]
    */
   Git.prototype.commit = function (message, files, options, then) {
      var handler = Git.trailingFunctionArgument(arguments);

      var command = ['commit'];

      [].concat(message).forEach(function (message) {
         command.push('-m', message);
      });

      [].push.apply(command, [].concat(typeof files === "string" || Array.isArray(files) ? files : []));

      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      return this._run(
         command,
         Git._responseHandler(handler, 'CommitSummary')
      );
   };

   /**
    * Gets a function to be used for logging.
    *
    * @param {string} level
    * @param {string} [message]
    *
    * @returns {Function}
    * @private
    */
   Git.prototype._getLog = function (level, message) {
      var log = this._silentLogging ? NOOP : console[level].bind(console);
      if (arguments.length > 1) {
         log(message);
      }
      return log;
   };

   /**
    * Pull the updated contents of the current repo
    *
    * @param {string} [remote] When supplied must also include the branch
    * @param {string} [branch] When supplied must also include the remote
    * @param {Object} [options] Optionally include set of options to merge into the command
    * @param {Function} [then]
    */
   Git.prototype.pull = function (remote, branch, options, then) {
      var command = ["pull"];
      var handler = Git.trailingFunctionArgument(arguments);

      if (typeof remote === 'string' && typeof branch === 'string') {
         command.push(remote, branch);
      }

      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      return this._run(command, Git._responseHandler(handler, 'PullSummary'));
   };

   /**
    * Fetch the updated contents of the current repo.
    *
    * @example
    *   .fetch('upstream', 'master') // fetches from master on remote named upstream
    *   .fetch(function () {}) // runs fetch against default remote and branch and calls function
    *
    * @param {string} [remote]
    * @param {string} [branch]
    * @param {Function} [then]
    */
   Git.prototype.fetch = function (remote, branch, then) {
      var command = ["fetch"];
      var next = Git.trailingFunctionArgument(arguments);
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      if (typeof remote === 'string' && typeof branch === 'string') {
         command.push(remote, branch);
      }

      if (Array.isArray(remote)) {
         command = command.concat(remote);
      }

      return this._run(
         command,
         Git._responseHandler(next, 'FetchSummary'),
         {
            concatStdErr: true
         }
      );
   };

   /**
    * Disables/enables the use of the console for printing warnings and errors, by default messages are not shown in
    * a production environment.
    *
    * @param {boolean} silence
    * @returns {Git}
    */
   Git.prototype.silent = function (silence) {
      this._silentLogging = !!silence;
      return this;
   };

   /**
    * List all tags. When using git 2.7.0 or above, include an options object with `"--sort": "property-name"` to
    * sort the tags by that property instead of using the default semantic versioning sort.
    *
    * Note, supplying this option when it is not supported by your Git version will cause the operation to fail.
    *
    * @param {Object} [options]
    * @param {Function} [then]
    */
   Git.prototype.tags = function (options, then) {
      var next = Git.trailingFunctionArgument(arguments);

      var command = ['-l'];
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      var hasCustomSort = command.some(function (option) {
         return /^--sort=/.test(option);
      });

      return this.tag(
         command,
         Git._responseHandler(next, 'TagList', [hasCustomSort])
      );
   };

   /**
    * Rebases the current working copy. Options can be supplied either as an array of string parameters
    * to be sent to the `git rebase` command, or a standard options object.
    *
    * @param {Object|String[]} [options]
    * @param {Function} [then]
    * @returns {Git}
    */
   Git.prototype.rebase = function (options, then) {
      var command = ['rebase'];
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));
      command.push.apply(command, Git.trailingArrayArgument(arguments));


      return this._run(command, Git._responseHandler(Git.trailingFunctionArgument(arguments)));
   };

   /**
    * Reset a repo
    *
    * @param {string|string[]} [mode=soft] Either an array of arguments supported by the 'git reset' command, or the
    *                                        string value 'soft' or 'hard' to set the reset mode.
    * @param {Function} [then]
    */
   Git.prototype.reset = function (mode, then) {
      var command = ['reset'];
      var next = Git.trailingFunctionArgument(arguments);
      if (next === mode || typeof mode === 'string' || !mode) {
         var modeStr = ['mixed', 'soft', 'hard'].includes(mode) ? mode : 'soft';
         command.push('--' + modeStr);
      }
      else if (Array.isArray(mode)) {
         command.push.apply(command, mode);
      }

      return this._run(command, function (err) {
         next && next(err || null);
      });
   };

   /**
    * Revert one or more commits in the local working copy
    *
    * @param {string} commit The commit to revert. Can be any hash, offset (eg: `HEAD~2`) or range (eg: `master~5..master~2`)
    * @param {Object} [options] Optional options object
    * @param {Function} [then]
    */
   Git.prototype.revert = function (commit, options, then) {
      var next = Git.trailingFunctionArgument(arguments);
      var command = ['revert'];

      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      if (typeof commit !== 'string') {
         return this.exec(function () {
            next && next(new TypeError("Commit must be a string"));
         });
      }

      command.push(commit);
      return this._run(command, function (err) {
         next && next(err || null);
      });
   };

   /**
    * Add a lightweight tag to the head of the current branch
    *
    * @param {string} name
    * @param {Function} [then]
    */
   Git.prototype.addTag = function (name, then) {
      if (typeof name !== "string") {
         return this.exec(function () {
            then && then(new TypeError("Git.addTag requires a tag name"));
         });
      }

      var command = [name];
      return then ? this.tag(command, then) : this.tag(command);
   };

   /**
    * Add an annotated tag to the head of the current branch
    *
    * @param {string} tagName
    * @param {string} tagMessage
    * @param {Function} [then]
    */
   Git.prototype.addAnnotatedTag = function (tagName, tagMessage, then) {
      return this.tag(['-a', '-m', tagMessage, tagName], function (err) {
         then && then(err);
      });
   };

   /**
    * Check out a tag or revision, any number of additional arguments can be passed to the `git checkout` command
    * by supplying either a string or array of strings as the `what` parameter.
    *
    * @param {string|string[]} what One or more commands to pass to `git checkout`
    * @param {Function} [then]
    */
   Git.prototype.checkout = function (what, then) {
      var command = ['checkout'];
      command = command.concat(what);

      return this._run(command, function (err, data) {
         then && then(err, !err && this._parseCheckout(data));
      });
   };

   /**
    * Check out a remote branch
    *
    * @param {string} branchName name of branch
    * @param {string} startPoint (e.g origin/development)
    * @param {Function} [then]
    */
   Git.prototype.checkoutBranch = function (branchName, startPoint, then) {
      return this.checkout(['-b', branchName, startPoint], then);
   };

   /**
    * Check out a local branch
    *
    * @param {string} branchName of branch
    * @param {Function} [then]
    */
   Git.prototype.checkoutLocalBranch = function (branchName, then) {
      return this.checkout(['-b', branchName], then);
   };

   /**
    * Delete a local branch
    *
    * @param {string} branchName name of branch
    * @param {Function} [then]
    */
   Git.prototype.deleteLocalBranch = function (branchName, then) {
      return this.branch(['-d', branchName], then);
   };

   /**
    * List all branches
    *
    * @param {Object | string[]} [options]
    * @param {Function} [then]
    */
   Git.prototype.branch = function (options, then) {
      var isDelete, responseHandler;
      var next = Git.trailingFunctionArgument(arguments);
      var command = ['branch'];

      command.push.apply(command, Git.trailingArrayArgument(arguments));
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      if (!arguments.length || next === options) {
         command.push('-a');
      }

      isDelete = ['-d', '-D', '--delete'].reduce(function (isDelete, flag) {
         return isDelete || command.indexOf(flag) > 0;
      }, false);

      if (command.indexOf('-v') < 0) {
         command.splice(1, 0, '-v');
      }

      responseHandler = isDelete
         ? Git._responseHandler(next, 'BranchDeleteSummary', false)
         : Git._responseHandler(next, 'BranchSummary');

      return this._run(command, responseHandler);
   };

   /**
    * Return list of local branches
    *
    * @param {Function} [then]
    */
   Git.prototype.branchLocal = function (then) {
      return this.branch(['-v'], then);
   };

   /**
    * Add config to local git instance
    *
    * @param {string} key configuration key (e.g user.name)
    * @param {string} value for the given key (e.g your name)
    * @param {Function} [then]
    */
   Git.prototype.addConfig = function (key, value, then) {
      return this._run(['config', '--local', key, value], function (err, data) {
         then && then(err, !err && data);
      });
   };

   /**
    * Executes any command against the git binary.
    *
    * @param {string[]|Object} commands
    * @param {Function} [then]
    *
    * @returns {Git}
    */
   Git.prototype.raw = function (commands, then) {
      var command = [];
      if (Array.isArray(commands)) {
         command = commands.slice(0);
      }
      else {
         Git._appendOptions(command, Git.trailingOptionsArgument(arguments));
      }

      var next = Git.trailingFunctionArgument(arguments);

      if (!command.length) {
         return this.exec(function () {
            next && next(new Error('Raw: must supply one or more command to execute'), null);
         });
      }

      return this._run(command, function (err, data) {
         next && next(err, !err && data || null);
      });
   };

   /**
    * Add a submodule
    *
    * @param {string} repo
    * @param {string} path
    * @param {Function} [then]
    */
   Git.prototype.submoduleAdd = function (repo, path, then) {
      return this._run(['submodule', 'add', repo, path], function (err) {
         then && then(err);
      });
   };

   /**
    * Update submodules
    *
    * @param {string[]} [args]
    * @param {Function} [then]
    */
   Git.prototype.submoduleUpdate = function (args, then) {
      if (typeof args === 'string') {
         this._getLog('warn', 'Git#submoduleUpdate: args should be supplied as an array of individual arguments');
      }

      var next = Git.trailingFunctionArgument(arguments);
      var command = (args !== next) ? args : [];

      return this.subModule(['update'].concat(command), function (err, args) {
         next && next(err, args);
      });
   };

   /**
    * Initialize submodules
    *
    * @param {string[]} [args]
    * @param {Function} [then]
    */
   Git.prototype.submoduleInit = function (args, then) {
      if (typeof args === 'string') {
         this._getLog('warn', 'Git#submoduleInit: args should be supplied as an array of individual arguments');
      }

      var next = Git.trailingFunctionArgument(arguments);
      var command = (args !== next) ? args : [];

      return this.subModule(['init'].concat(command), function (err, args) {
         next && next(err, args);
      });
   };

   /**
    * Call any `git submodule` function with arguments passed as an array of strings.
    *
    * @param {string[]} options
    * @param {Function} [then]
    */
   Git.prototype.subModule = function (options, then) {
      if (!Array.isArray(options)) {
         return this.exec(function () {
            then && then(new TypeError("Git.subModule requires an array of arguments"));
         });
      }

      if (options[0] !== 'submodule') {
         options.unshift('submodule');
      }

      return this._run(options, function (err, data) {
         then && then(err || null, err ? null : data);
      });
   };

   /**
    * List remote
    *
    * @param {string[]} [args]
    * @param {Function} [then]
    */
   Git.prototype.listRemote = function (args, then) {
      var next = Git.trailingFunctionArgument(arguments);
      var data = next === args || args === undefined ? [] : args;

      if (typeof data === 'string') {
         this._getLog('warn', 'Git#listRemote: args should be supplied as an array of individual arguments');
      }

      return this._run(['ls-remote'].concat(data), function (err, data) {
         next && next(err, data);
      });
   };

   /**
    * Adds a remote to the list of remotes.
    *
    * @param {string} remoteName Name of the repository - eg "upstream"
    * @param {string} remoteRepo Fully qualified SSH or HTTP(S) path to the remote repo
    * @param {Function} [then]
    * @returns {*}
    */
   Git.prototype.addRemote = function (remoteName, remoteRepo, then) {
      return this._run(['remote', 'add', remoteName, remoteRepo], function (err) {
         then && then(err);
      });
   };

   /**
    * Removes an entry from the list of remotes.
    *
    * @param {string} remoteName Name of the repository - eg "upstream"
    * @param {Function} [then]
    * @returns {*}
    */
   Git.prototype.removeRemote = function (remoteName, then) {
      return this._run(['remote', 'remove', remoteName], function (err) {
         then && then(err);
      });
   };

   /**
    * Gets the currently available remotes, setting the optional verbose argument to true includes additional
    * detail on the remotes themselves.
    *
    * @param {boolean} [verbose=false]
    * @param {Function} [then]
    */
   Git.prototype.getRemotes = function (verbose, then) {
      var next = Git.trailingFunctionArgument(arguments);
      var args = verbose === true ? ['-v'] : [];

      return this.remote(args, function (err, data) {
         next && next(err, !err && function () {
            return data.trim().split('\n').filter(Boolean).reduce(function (remotes, remote) {
               var detail = remote.trim().split(/\s+/);
               var name = detail.shift();

               if (!remotes[name]) {
                  remotes[name] = remotes[remotes.length] = {
                     name: name,
                     refs: {}
                  };
               }

               if (detail.length) {
                  remotes[name].refs[detail.pop().replace(/[^a-z]/g, '')] = detail.pop();
               }

               return remotes;
            }, []).slice(0);
         }());
      });
   };

   /**
    * Call any `git remote` function with arguments passed as an array of strings.
    *
    * @param {string[]} options
    * @param {Function} [then]
    */
   Git.prototype.remote = function (options, then) {
      if (!Array.isArray(options)) {
         return this.exec(function () {
            then && then(new TypeError("Git.remote requires an array of arguments"));
         });
      }

      if (options[0] !== 'remote') {
         options.unshift('remote');
      }

      return this._run(options, function (err, data) {
         then && then(err || null, err ? null : data);
      });
   };

   /**
    * Merges from one branch to another, equivalent to running `git merge ${from} $[to}`, the `options` argument can
    * either be an array of additional parameters to pass to the command or null / omitted to be ignored.
    *
    * @param {string} from
    * @param {string} to
    * @param {string[]} [options]
    * @param {Function} [then]
    */
   Git.prototype.mergeFromTo = function (from, to, options, then) {
      var commands = [
         from,
         to
      ];
      var callback = Git.trailingFunctionArgument(arguments);

      if (Array.isArray(options)) {
         commands = commands.concat(options);
      }

      return this.merge(commands, callback);
   };

   /**
    * Runs a merge, `options` can be either an array of arguments
    * supported by the [`git merge`](https://git-scm.com/docs/git-merge)
    * or an options object.
    *
    * Conflicts during the merge result in an error response,
    * the response type whether it was an error or success will be a MergeSummary instance.
    * When successful, the MergeSummary has all detail from a the PullSummary
    *
    * @param {Object | string[]} [options]
    * @param {Function} [then]
    * @returns {*}
    *
    * @see ./responses/MergeSummary.js
    * @see ./responses/PullSummary.js
    */
   Git.prototype.merge = function (options, then) {
      var self = this;
      var userHandler = Git.trailingFunctionArgument(arguments) || NOOP;
      var mergeHandler = function (err, mergeSummary) {
         if (!err && mergeSummary.failed) {
            return Git.fail(self, mergeSummary, userHandler);
         }

         userHandler(err, mergeSummary);
      };

      var command = [];
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));
      command.push.apply(command, Git.trailingArrayArgument(arguments));

      if (command[0] !== 'merge') {
         command.unshift('merge');
      }

      if (command.length === 1) {
         return this.exec(function () {
            then && then(new TypeError("Git.merge requires at least one option"));
         });
      }

      return this._run(command, Git._responseHandler(mergeHandler, 'MergeSummary'), {
         concatStdErr: true
      });
   };

   /**
    * Call any `git tag` function with arguments passed as an array of strings.
    *
    * @param {string[]} options
    * @param {Function} [then]
    */
   Git.prototype.tag = function (options, then) {
      var command = [];
      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));
      command.push.apply(command, Git.trailingArrayArgument(arguments));

      if (command[0] !== 'tag') {
         command.unshift('tag');
      }

      return this._run(command, Git._responseHandler(Git.trailingFunctionArgument(arguments)));
   };

   /**
    * Updates repository server info
    *
    * @param {Function} [then]
    */
   Git.prototype.updateServerInfo = function (then) {
      return this._run(["update-server-info"], function (err, data) {
         then && then(err, !err && data);
      });
   };

   /**
    * Pushes the current committed changes to a remote, optionally specify the names of the remote and branch to use
    * when pushing. Supply multiple options as an array of strings in the first argument - see examples below.
    *
    * @param {string|string[]} [remote]
    * @param {string} [branch]
    * @param {Function} [then]
    */
   Git.prototype.push = function (remote, branch, then) {
      var command = [];
      var handler = Git.trailingFunctionArgument(arguments);

      if (typeof remote === 'string' && typeof branch === 'string') {
         command.push(remote, branch);
      }

      if (Array.isArray(remote)) {
         command = command.concat(remote);
      }

      Git._appendOptions(command, Git.trailingOptionsArgument(arguments));

      if (command[0] !== 'push') {
         command.unshift('push');
      }

      return this._run(command, function (err, data) {
         handler && handler(err, !err && data);
      });
   };

   /**
    * Pushes the current tag changes to a remote which can be either a URL or named remote. When not specified uses the
    * default configured remote spec.
    *
    * @param {string} [remote]
    * @param {Function} [then]
    */
   Git.prototype.pushTags = function (remote, then) {
      var command = ['push'];
      if (typeof remote === "string") {
         command.push(remote);
      }
      command.push('--tags');

      then = typeof arguments[arguments.length - 1] === "function" ? arguments[arguments.length - 1] : null;

      return this._run(command, function (err, data) {
         then && then(err, !err && data);
      });
   };

   /**
    * Removes the named files from source control.
    *
    * @param {string|string[]} files
    * @param {Function} [then]
    */
   Git.prototype.rm = function (files, then) {
      return this._rm(files, '-f', then);
   };

   /**
    * Removes the named files from source control but keeps them on disk rather than deleting them entirely. To
    * completely remove the files, use `rm`.
    *
    * @param {string|string[]} files
    * @param {Function} [then]
    */
   Git.prototype.rmKeepLocal = function (files, then) {
      return this._rm(files, '--cached', then);
   };

   /**
    * Returns a list of objects in a tree based on commit hash. Passing in an object hash returns the object's content,
    * size, and type.
    *
    * Passing "-p" will instruct cat-file to determine the object type, and display its formatted contents.
    *
    * @param {string[]} [options]
    * @param {Function} [then]
    */
   Git.prototype.catFile = function (options, then) {
      return this._catFile('utf-8', arguments);
   };

   /**
    * Equivalent to `catFile` but will return the native `Buffer` of content from the git command's stdout.
    *
    * @param {string[]} options
    * @param then
    */
   Git.prototype.binaryCatFile = function (options, then) {
      return this._catFile('buffer', arguments);
   };

   Git.prototype._catFile = function (format, args) {
      var handler = Git.trailingFunctionArgument(args);
      var command = ['cat-file'];
      var options = args[0];

      if (typeof options === 'string') {
         throw new TypeError('Git#catFile: options must be supplied as an array of strings');
      }
      else if (Array.isArray(options)) {
         command.push.apply(command, options);
      }

      return this._run(command, function (err, data) {
         handler && handler(err, data);
      }, {
         format: format
      });
   };

   /**
    * Return repository changes.
    *
    * @param {string[]} [options]
    * @param {Function} [then]
    */
   Git.prototype.diff = function (options, then) {
      var command = ['diff'];

      if (typeof options === 'string') {
         command[0] += ' ' + options;
         this._getLog('warn',
            'Git#diff: supplying options as a single string is now deprecated, switch to an array of strings');
      }
      else if (Array.isArray(options)) {
         command.push.apply(command, options);
      }

      if (typeof arguments[arguments.length - 1] === 'function') {
         then = arguments[arguments.length - 1];
      }

      return this._run(command, function (err, data) {
         then && then(err, data);
      });
   };

   Git.prototype.diffSummary = function (options, then) {
      var next = Git.trailingFunctionArgument(arguments);
      var command = ['--stat=4096'];

      if (options && options !== next) {
         command.push.apply(command, [].concat(options));
      }

      return this.diff(command, Git._responseHandler(next, 'DiffSummary'));
   };

   /**
    * Wraps `git rev-parse`. Primarily used to convert friendly commit references (ie branch names) to SHA1 hashes.
    *
    * Options should be an array of string options compatible with the `git rev-parse`
    *
    * @param {string|string[]} [options]
    * @param {Function} [then]
    *
    * @see https://git-scm.com/docs/git-rev-parse
    */
   Git.prototype.revparse = function (options, then) {
      var command = ['rev-parse'];

      if (typeof options === 'string') {
         command = command + ' ' + options;
         this._getLog('warn',
            'Git#revparse: supplying options as a single string is now deprecated, switch to an array of strings');
      }
      else if (Array.isArray(options)) {
         command.push.apply(command, options);
      }

      if (typeof arguments[arguments.length - 1] === 'function') {
         then = arguments[arguments.length - 1];
      }

      return this._run(command, function (err, data) {
         then && then(err, err ? null : String(data).trim());
      });
   };

   /**
    * Show various types of objects, for example the file at a certain commit
    *
    * @param {string[]} [options]
    * @param {Function} [then]
    */
   Git.prototype.show = function (options, then) {
      var args = [].slice.call(arguments, 0);
      var handler = typeof args[args.length - 1] === "function" ? args.pop() : null;
      var command = ['show'];
      if (typeof options === 'string') {
         command = command + ' ' + options;
         this._getLog('warn',
            'Git#show: supplying options as a single string is now deprecated, switch to an array of strings');
      }
      else if (Array.isArray(options)) {
         command.push.apply(command, options);
      }

      return this._run(command, function (err, data) {
         handler && handler(err, !err && data);
      });
   };

   /**
    * @param {string} mode Required parameter "n" or "f"
    * @param {string[]} options
    * @param {Function} [then]
    */
   Git.prototype.clean = function (mode, options, then) {
      var handler = Git.trailingFunctionArgument(arguments);

      if (typeof mode !== 'string' || !/[nf]/.test(mode)) {
         return this.exec(function () {
            handler && handler(new TypeError('Git clean mode parameter ("n" or "f") is required'));
         });
      }

      if (/[^dfinqxX]/.test(mode)) {
         return this.exec(function () {
            handler && handler(new TypeError('Git clean unknown option found in ' + JSON.stringify(mode)));
         });
      }

      var command = ['clean', '-' + mode];
      if (Array.isArray(options)) {
         command = command.concat(options);
      }

      if (command.some(interactiveMode)) {
         return this.exec(function () {
            handler && handler(new TypeError('Git clean interactive mode is not supported'));
         });
      }

      return this._run(command, function (err, data) {
         handler && handler(err, !err && data);
      });

      function interactiveMode (option) {
         if (/^-[^\-]/.test(option)) {
            return option.indexOf('i') > 0;
         }

         return option === '--interactive';
      }
   };

   /**
    * Call a simple function at the next step in the chain.
    * @param {Function} [then]
    */
   Git.prototype.exec = function (then) {
      this._run([], function () {
         typeof then === 'function' && then();
      });
      return this;
   };

   /**
    * Deprecated means of adding a regular function call at the next step in the chain. Use the replacement
    * Git#exec, the Git#then method will be removed in version 2.x
    *
    * @see exec
    * @deprecated
    */
   Git.prototype.then = function (then) {
      this._getLog(
         'error', `
Git#then is deprecated after version 1.72 and will be removed in version 2.x
To use promises switch to importing 'simple-git/promise'.`);

      return this.exec(then);
   };

   /**
    * Show commit logs from `HEAD` to the first commit.
    * If provided between `options.from` and `options.to` tags or branch.
    *
    * Additionally you can provide options.file, which is the path to a file in your repository. Then only this file will be considered.
    *
    * To use a custom splitter in the log format, set `options.splitter` to be the string the log should be split on.
    *
    * Options can also be supplied as a standard options object for adding custom properties supported by the git log command.
    * For any other set of options, supply options as an array of strings to be appended to the git log command.
    *
    * @param {Object|string[]} [options]
    * @param {string} [options.from] The first commit to include
    * @param {string} [options.to] The most recent commit to include
    * @param {string} [options.file] A single file to include in the result
    * @param {boolean} [options.multiLine] Optionally include multi-line commit messages
    *
    * @param {Function} [then]
    */
   Git.prototype.log = function (options, then) {
      var handler = Git.trailingFunctionArgument(arguments);
      var opt = (handler === then ? options : null) || {};

      var splitter = opt.splitter || requireResponseHandler('ListLogSummary').SPLITTER;
      var format = opt.format || {
         hash: '%H',
         date: '%ai',
         message: '%s',
         refs: '%D',
         body: opt.multiLine ? '%B' : '%b',
         author_name: '%aN',
         author_email: '%ae'
      };
      var rangeOperator = (opt.symmetric !== false) ? '...' : '..';

      var fields = Object.keys(format);
      var formatstr = fields.map(function (k) {
         return format[k];
      }).join(splitter);
      var suffix = [];
      var command = ["log", "--pretty=format:"
         + requireResponseHandler('ListLogSummary').START_BOUNDARY
         + formatstr
         + requireResponseHandler('ListLogSummary').COMMIT_BOUNDARY
      ];

      if (Array.isArray(opt)) {
         command = command.concat(opt);
         opt = {};
      }
      else if (typeof arguments[0] === "string" || typeof arguments[1] === "string") {
         this._getLog('warn',
            'Git#log: supplying to or from as strings is now deprecated, switch to an options configuration object');
         opt = {
            from: arguments[0],
            to: arguments[1]
         };
      }

      if (opt.n || opt['max-count']) {
         command.push("--max-count=" + (opt.n || opt['max-count']));
      }

      if (opt.from && opt.to) {
         command.push(opt.from + rangeOperator + opt.to);
      }

      if (opt.file) {
         suffix.push("--follow", options.file);
      }

      'splitter n max-count file from to --pretty format symmetric multiLine'.split(' ').forEach(function (key) {
         delete opt[key];
      });

      Git._appendOptions(command, opt);

      return this._run(
         command.concat(suffix),
         Git._responseHandler(handler, 'ListLogSummary', [splitter, fields])
      );
   };

   /**
    * Clears the queue of pending commands and returns the wrapper instance for chaining.
    *
    * @returns {Git}
    */
   Git.prototype.clearQueue = function () {
      this._runCache.length = 0;
      return this;
   };

   /**
    * Check if a pathname or pathnames are excluded by .gitignore
    *
    * @param {string|string[]} pathnames
    * @param {Function} [then]
    */
   Git.prototype.checkIgnore = function (pathnames, then) {
      var handler = Git.trailingFunctionArgument(arguments);
      var command = ["check-ignore"];

      if (handler !== pathnames) {
         command = command.concat(pathnames);
      }

      return this._run(command, function (err, data) {
         handler && handler(err, !err && this._parseCheckIgnore(data));
      });
   };

   /**
    * Validates that the current repo is a Git repo.
    *
    * @param {Function} [then]
    */
   Git.prototype.checkIsRepo = function (then) {
      function onError (exitCode, stdErr, done, fail) {
         if (exitCode === 128 && /(Not a git repository|Kein Git-Repository)/i.test(stdErr)) {
            return done(false);
         }

         fail(stdErr);
      }

      function handler (err, isRepo) {
         then && then(err, String(isRepo).trim() === 'true');
      }

      return this._run(['rev-parse', '--is-inside-work-tree'], handler, {onError: onError});
   };

   Git.prototype._rm = function (_files, options, then) {
      var files = [].concat(_files);
      var args = ['rm', options];
      args.push.apply(args, files);

      return this._run(args, function (err) {
         then && then(err);
      });
   };

   Git.prototype._parseCheckout = function (checkout) {
      // TODO
   };

   /**
    * Parser for the `check-ignore` command - returns each
    * @param {string} [files]
    * @returns {string[]}
    */
   Git.prototype._parseCheckIgnore = function (files) {
      return files.split(/\n/g).filter(Boolean).map(function (file) {
         return file.trim()
      });
   };

   /**
    * Schedules the supplied command to be run, the command should not include the name of the git binary and should
    * be an array of strings passed as the arguments to the git binary.
    *
    * @param {string[]} command
    * @param {Function} then
    * @param {Object} [opt]
    * @param {boolean} [opt.concatStdErr=false] Optionally concatenate stderr output into the stdout
    * @param {boolean} [opt.format="utf-8"] The format to use when reading the content of stdout
    * @param {Function} [opt.onError] Optional error handler for this command - can be used to allow non-clean exits
    *                                  without killing the remaining stack of commands
    * @param {number} [opt.onError.exitCode]
    * @param {string} [opt.onError.stdErr]
    *
    * @returns {Git}
    */
   Git.prototype._run = function (command, then, opt) {
      if (typeof command === "string") {
         command = command.split(" ");
      }
      this._runCache.push([command, then, opt || {}]);
      this._schedule();

      return this;
   };

   Git.prototype._schedule = function () {
      if (!this._childProcess && this._runCache.length) {
         var git = this;
         var Buffer = git.Buffer;
         var task = git._runCache.shift();

         var command = task[0];
         var then = task[1];
         var options = task[2];

         debug(command);

         var result = deferred();

         var attempted = false;
         var attemptClose = function attemptClose (e) {

            // closing when there is content, terminate immediately
            if (attempted || stdErr.length || stdOut.length) {
               result.resolve(e);
               attempted = true;
            }

            // first attempt at closing but no content yet, wait briefly for the close/exit that may follow
            if (!attempted) {
               attempted = true;
               setTimeout(attemptClose.bind(this, e), 50);
            }

         };

         var stdOut = [];
         var stdErr = [];
         var spawned = git.ChildProcess.spawn(git._command, command.slice(0), {
            cwd: git._baseDir,
            env: git._env,
            windowsHide: true
         });

         spawned.stdout.on('data', function (buffer) {
            stdOut.push(buffer);
         });

         spawned.stderr.on('data', function (buffer) {
            stdErr.push(buffer);
         });

         spawned.on('error', function (err) {
            stdErr.push(Buffer.from(err.stack, 'ascii'));
         });

         spawned.on('close', attemptClose);
         spawned.on('exit', attemptClose);

         result.promise.then(function (exitCode) {
            function done (output) {
               then.call(git, null, output);
            }

            function fail (error) {
               Git.fail(git, error, then);
            }

            delete git._childProcess;

            if (exitCode && stdErr.length && options.onError) {
               options.onError(exitCode, Buffer.concat(stdErr).toString('utf-8'), done, fail);
            }
            else if (exitCode && stdErr.length) {
               fail(Buffer.concat(stdErr).toString('utf-8'));
            }
            else {
               if (options.concatStdErr) {
                  [].push.apply(stdOut, stdErr);
               }

               var stdOutput = Buffer.concat(stdOut);
               if (options.format !== 'buffer') {
                  stdOutput = stdOutput.toString(options.format || 'utf-8');
               }

               done(stdOutput);
            }

            process.nextTick(git._schedule.bind(git));
         });

         git._childProcess = spawned;

         if (git._outputHandler) {
            git._outputHandler(command[0], git._childProcess.stdout, git._childProcess.stderr);
         }
      }
   };

   /**
    * Handles an exception in the processing of a command.
    */
   Git.fail = function (git, error, handler) {
      git._getLog('error', error);
      git._runCache.length = 0;
      if (typeof handler === 'function') {
         handler.call(git, error, null);
      }
   };

   /**
    * Given any number of arguments, returns the last argument if it is a function, otherwise returns null.
    * @returns {Function|null}
    */
   Git.trailingFunctionArgument = function (args) {
      var trailing = args[args.length - 1];
      return (typeof trailing === "function") ? trailing : null;
   };

   /**
    * Given any number of arguments, returns the trailing options argument, ignoring a trailing function argument
    * if there is one. When not found, the return value is null.
    * @returns {Object|null}
    */
   Git.trailingOptionsArgument = function (args) {
      var options = args[(args.length - (Git.trailingFunctionArgument(args) ? 2 : 1))];
      return Object.prototype.toString.call(options) === '[object Object]' ? options : null;
   };

   /**
    * Given any number of arguments, returns the trailing options array argument, ignoring a trailing function argument
    * if there is one. When not found, the return value is an empty array.
    * @returns {Array}
    */
   Git.trailingArrayArgument = function (args) {
      var options = args[(args.length - (Git.trailingFunctionArgument(args) ? 2 : 1))];
      return Object.prototype.toString.call(options) === '[object Array]' ? options : [];
   };

   /**
    * Mutates the supplied command array by merging in properties in the options object. When the
    * value of the item in the options object is a string it will be concatenated to the key as
    * a single `name=value` item, otherwise just the name will be used.
    *
    * @param {string[]} command
    * @param {Object} options
    * @private
    */
   Git._appendOptions = function (command, options) {
      if (options === null) {
         return;
      }

      Object.keys(options).forEach(function (key) {
         var value = options[key];
         if (typeof value === 'string') {
            command.push(key + '=' + value);
         }
         else {
            command.push(key);
         }
      });
   };

   /**
    * Given the type of response and the callback to receive the parsed response,
    * uses the correct parser and calls back the callback.
    *
    * @param {Function} callback
    * @param {string} [type]
    * @param {Object[]} [args]
    *
    * @private
    */
   Git._responseHandler = function (callback, type, args) {
      return function (error, data) {
         if (typeof callback !== 'function') {
            return;
         }

         if (error) {
            return callback(error, null);
         }

         if (!type) {
            return callback(null, data);
         }

         var handler = requireResponseHandler(type);
         var result = handler.parse.apply(handler, [data].concat(args === undefined ? [] : args));

         callback(null, result);
      };

   };

   /**
    * Marks the git instance as having had a fatal exception by clearing the pending queue of tasks and
    * logging to the console.
    *
    * @param git
    * @param error
    * @param callback
    */
   Git.exception = function (git, error, callback) {
      git._runCache.length = 0;
      if (typeof callback === 'function') {
         callback(error instanceof Error ? error : new Error(error));
      }

      git._getLog('error', error);
   };

   module.exports = Git;

   /**
    * Requires and returns a response handler based on its named type
    * @param {string} type
    */
   function requireResponseHandler (type) {
      return responses[type];
   }

}());


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(867);
const util = __webpack_require__(669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(247);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(486)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 82:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 93:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";



var common = __webpack_require__(740);


function Mark(name, buffer, position, line, column) {
  this.name     = name;
  this.buffer   = buffer;
  this.position = position;
  this.line     = line;
  this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) return null;

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
    start -= 1;
    if (this.position - start > (maxLength / 2 - 1)) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
    end += 1;
    if (end - this.position > (maxLength / 2 - 1)) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' +
         common.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
  var snippet, where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};


module.exports = Mark;


/***/ }),

/***/ 94:
/***/ (function(module) {


module.exports = BranchSummary;

function BranchSummary () {
   this.detached = false;
   this.current = '';
   this.all = [];
   this.branches = {};
}

BranchSummary.prototype.push = function (current, detached, name, commit, label) {
   if (current) {
      this.detached = detached;
      this.current = name;
   }
   this.all.push(name);
   this.branches[name] = {
      current: current,
      name: name,
      commit: commit,
      label: label
   };
};

BranchSummary.detachedRegex = /^(\*?\s+)\((?:HEAD )?detached (?:from|at) (\S+)\)\s+([a-z0-9]+)\s(.*)$/;
BranchSummary.branchRegex = /^(\*?\s+)(\S+)\s+([a-z0-9]+)\s(.*)$/;

BranchSummary.parse = function (commit) {
   var branchSummary = new BranchSummary();

   commit.split('\n')
      .forEach(function (line) {
         var detached = true;
         var branch = BranchSummary.detachedRegex.exec(line);
         if (!branch) {
            detached = false;
            branch = BranchSummary.branchRegex.exec(line);
         }

         if (branch) {
            branchSummary.push(
               branch[1].charAt(0) === '*',
               detached,
               branch[2],
               branch[3],
               branch[4]
            );
         }
      });

   return branchSummary;
};


/***/ }),

/***/ 100:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});


/***/ }),

/***/ 129:
/***/ (function(module) {


module.exports = DiffSummary;

/**
 * The DiffSummary is returned as a response to getting `git().status()`
 *
 * @constructor
 */
function DiffSummary () {
   this.files = [];
   this.insertions = 0;
   this.deletions = 0;
   this.changed = 0;
}

/**
 * Number of lines added
 * @type {number}
 */
DiffSummary.prototype.insertions = 0;

/**
 * Number of lines deleted
 * @type {number}
 */
DiffSummary.prototype.deletions = 0;

/**
 * Number of files changed
 * @type {number}
 */
DiffSummary.prototype.changed = 0;

DiffSummary.parse = function (text) {
   var line, handler;

   var lines = text.trim().split('\n');
   var status = new DiffSummary();

   var summary = lines.pop();
   if (summary) {
      summary.trim().split(', ').forEach(function (text) {
         var summary = /(\d+)\s([a-z]+)/.exec(text);
         if (!summary) {
            return;
         }

         if (/files?/.test(summary[2])) {
            status.changed = parseInt(summary[1], 10);
         }
         else {
            status[summary[2].replace(/s$/, '') + 's'] = parseInt(summary[1], 10);
         }
      });
   }

   while (line = lines.shift()) {
      textFileChange(line, status.files) || binaryFileChange(line, status.files);
   }

   return status;
};

function textFileChange (line, files) {
   line = line.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);

   if (line) {
      var alterations = (line[3] || '').trim();
      files.push({
         file: line[1].trim(),
         changes: parseInt(line[2], 10),
         insertions: alterations.replace(/-/g, '').length,
         deletions: alterations.replace(/\+/g, '').length,
         binary: false
      });

      return true;
   }
}

function binaryFileChange (line, files) {
   line = line.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
   if (line) {
      files.push({
         file: line[1].trim(),
         before: +line[2],
         after: +line[3],
         binary: true
      });
      return true;
   }
}


/***/ }),

/***/ 198:
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
const core = __importStar(__webpack_require__(470));
const helpers_1 = __webpack_require__(441);
const finder_1 = __webpack_require__(420);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const configFile = core.getInput('config_file', { required: true });
            core.debug('Parsing rules in the yaml manifest.');
            const rules = yield helpers_1.getYamlRules(configFile);
            for (const rule of rules) {
                const match = yield finder_1.ruleMatchesChange(rule);
                if (match) {
                    core.info('Diffing rule detected changes.');
                    core.exportVariable('DIFF_DETECTED', 'true');
                    return;
                }
            }
            core.info('No changes detected.');
            core.exportVariable('DIFF_DETECTED', 'false');
        }
        catch (err) {
            core.setFailed(err.message);
        }
    });
}
run();


/***/ }),

/***/ 228:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ 247:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const hasFlag = __webpack_require__(364);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
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

function supportsColor(stream) {
	if (forceColor === false) {
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

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
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

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 265:
/***/ (function(module, __unusedexports, __webpack_require__) {


var fs = __webpack_require__(747);

function exists (path, isFile, isDirectory) {
   try {
      var matches = false;
      var stat = fs.statSync(path);

      matches = matches || isFile && stat.isFile();
      matches = matches || isDirectory && stat.isDirectory();

      return matches;
   }
   catch (e) {
      if (e.code === 'ENOENT') {
         return false;
      }

      throw e;
   }
}

module.exports = function (path, type) {
   if (!type) {
      return exists(path, true, true);
   }

   return exists(path, type & 1, type & 2);
};

module.exports.FILE = 1;

module.exports.FOLDER = 2;


/***/ }),

/***/ 293:
/***/ (function(module) {

module.exports = require("buffer");

/***/ }),

/***/ 306:
/***/ (function(module) {


module.exports = TagList;

function TagList (tagList, latest) {
   this.latest = latest;
   this.all = tagList
}

TagList.parse = function (data, customSort) {
   var number = function (input) {
      if (typeof input === 'string') {
         return parseInt(input.replace(/^\D+/g, ''), 10) || 0;
      }

      return 0;
   };

   var tags = data
      .trim()
      .split('\n')
      .map(function (item) { return item.trim(); })
      .filter(Boolean);

   if (!customSort) {
      tags.sort(function (tagA, tagB) {
         var partsA = tagA.split('.');
         var partsB = tagB.split('.');

         if (partsA.length === 1 || partsB.length === 1) {
            return tagA - tagB > 0 ? 1 : -1;
         }

         for (var i = 0, l = Math.max(partsA.length, partsB.length); i < l; i++) {
            var a = number(partsA[i]);
            var b = number(partsB[i]);

            var diff = a - b;
            if (diff) {
               return diff > 0 ? 1 : -1;
            }
         }

         return 0;
      });
   }

   var latest = customSort ? tags[0] : tags.filter(function (tag) { return tag.indexOf('.') >= 0; }).pop();

   return new TagList(tags, latest);
};


/***/ }),

/***/ 352:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  // workaround to exclude package from browserify list.
  var _require = require;
  esprima = _require('esprima');
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') esprima = window.esprima;
}

var Type = __webpack_require__(945);

function resolveJavascriptFunction(data) {
  if (data === null) return false;

  try {
    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true });

    if (ast.type                    !== 'Program'             ||
        ast.body.length             !== 1                     ||
        ast.body[0].type            !== 'ExpressionStatement' ||
        (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
          ast.body[0].expression.type !== 'FunctionExpression')) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast    = esprima.parse(source, { range: true }),
      params = [],
      body;

  if (ast.type                    !== 'Program'             ||
      ast.body.length             !== 1                     ||
      ast.body[0].type            !== 'ExpressionStatement' ||
      (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
        ast.body[0].expression.type !== 'FunctionExpression')) {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  if (ast.body[0].expression.body.type === 'BlockStatement') {
    /*eslint-disable no-new-func*/
    return new Function(params, source.slice(body[0] + 1, body[1] - 1));
  }
  // ES6 arrow functions can omit the BlockStatement. In that case, just return
  // the body.
  /*eslint-disable no-new-func*/
  return new Function(params, 'return ' + source.slice(body[0], body[1]));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return Object.prototype.toString.call(object) === '[object Function]';
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});


/***/ }),

/***/ 364:
/***/ (function(module) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 386:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return typeof object === 'undefined';
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});


/***/ }),

/***/ 414:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";



var yaml = __webpack_require__(9);


module.exports = yaml;


/***/ }),

/***/ 417:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var common = __webpack_require__(740);
var Type   = __webpack_require__(945);

var YAML_FLOAT_PATTERN = new RegExp(
  // 2.5e4, 2.5 and integers
  '^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
  // .2e4, .2
  // special case, seems not from spec
  '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
  // 20:59
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  // .inf
  '|[-+]?\\.(?:inf|Inf|INF)' +
  // .nan
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data) ||
      // Quick hack to not allow integers end with `_`
      // Probably should update regexp & check speed
      data[data.length - 1] === '_') {
    return false;
  }

  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;
  digits = [];

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;

  } else if (value.indexOf(':') >= 0) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;

  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ 420:
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(__webpack_require__(470));
const promise_1 = __importDefault(__webpack_require__(57));
const helpers_1 = __webpack_require__(441);
exports.ROOT_DIR = helpers_1.getRootDir();
exports.git = promise_1.default(exports.ROOT_DIR);
/** Runs the diffing rules against the working tree */
function ruleMatchesChange(rule) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = buildOptions(rule);
        const diff = yield getDiff(options);
        core.debug(`Diffing with options ${options}`);
        if (diff.changed > 0) {
            const diffedFiles = diff.files.map(elem => elem.file);
            core.info(`Changed files: ${diffedFiles}`);
            return true;
        }
        return false;
    });
}
exports.ruleMatchesChange = ruleMatchesChange;
/** Performs diffing based on the rules from the manifest */
function getDiff(extraOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseOptions = ['--no-color', 'origin/master...'];
        const diff = yield exports.git.diffSummary([...baseOptions, ...extraOptions]);
        return diff;
    });
}
exports.getDiff = getDiff;
/** Builds options to pass to diff command */
function buildOptions(rule) {
    const fullPaths = rule['paths'].map(el => `${exports.ROOT_DIR}/${el}`);
    return fullPaths.length ? ['--', ...fullPaths] : [];
}
exports.buildOptions = buildOptions;


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(87);
/**
 * Commands
 *
 * Command Format:
 *   ##[name key=value;key=value]message
 *
 * Examples:
 *   ##[warning]This is the user warning message
 *   ##[set-secret name=mypassword]definitelyNotAPassword!
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
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        // safely append the val - avoid blowing up when attempting to
                        // call .replace() if message is not a string for some reason
                        cmdStr += `${key}=${escape(`${val || ''}`)},`;
                    }
                }
            }
        }
        cmdStr += CMD_STRING;
        // safely append the message - avoid blowing up when attempting to
        // call .replace() if message is not a string for some reason
        const message = `${this.message || ''}`;
        cmdStr += escapeData(message);
        return cmdStr;
    }
}
function escapeData(s) {
    return s.replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}
function escape(s) {
    return s
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/]/g, '%5D')
        .replace(/;/g, '%3B');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 440:
/***/ (function(module) {


module.exports = BranchDeletion;

function BranchDeletion (branch, hash) {
   this.branch = branch;
   this.hash = hash;
   this.success = hash !== null;
}

BranchDeletion.deleteSuccessRegex = /(\S+)\s+\(\S+\s([^\)]+)\)/;
BranchDeletion.deleteErrorRegex = /^error[^']+'([^']+)'/;

BranchDeletion.parse = function (data, asArray) {
   var result;
   var branchDeletions = data.trim().split('\n').map(function (line) {
         if (result = BranchDeletion.deleteSuccessRegex.exec(line)) {
            return new BranchDeletion(result[1], result[2]);
         }
         else if (result = BranchDeletion.deleteErrorRegex.exec(line)) {
            return new BranchDeletion(result[1], null);
         }
      })
      .filter(Boolean);

   return asArray ? branchDeletions : branchDeletions.pop();
};


/***/ }),

/***/ 441:
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(__webpack_require__(747));
const js_yaml_1 = __importDefault(__webpack_require__(414));
/** Works out working dir root directory */
exports.getRootDir = () => {
    const rootDir = process.env['GITHUB_WORKSPACE'] || process.env.PWD;
    if (!rootDir) {
        throw new Error('Either GITHUB_WORKSPACE or PWD must be set');
    }
    return rootDir;
};
/** Extracts git diffing rules from the yaml manifest */
function getYamlRules(rulesPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!rulesPath) {
            rulesPath = `${exports.getRootDir()}/.github/rules.yml`;
        }
        const file = fs_1.default.readFileSync(rulesPath, 'utf8');
        const parsedYaml = js_yaml_1.default.safeLoad(file);
        return parsedYaml['rules'];
    });
}
exports.getYamlRules = getYamlRules;


/***/ }),

/***/ 457:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


/*eslint-disable max-len,no-use-before-define*/

var common              = __webpack_require__(740);
var YAMLException       = __webpack_require__(556);
var Mark                = __webpack_require__(93);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(723);
var DEFAULT_FULL_SCHEMA = __webpack_require__(910);


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function _class(obj) { return Object.prototype.toString.call(obj); }

function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  /* eslint-disable indent */
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(
    ((c - 0x010000) >> 10) + 0xD800,
    ((c - 0x010000) & 0x03FF) + 0xDC00
  );
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;
  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
  var index, quantity;

  // The output is a plain object here, so keys can only be strings.
  // We need to convert keyNode to a string, but doing so can hang the process
  // (deeply nested arrays that explode exponentially using aliases).
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);

    for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, 'nested arrays are not supported inside keys');
      }

      if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
        keyNode[index] = '[object Object]';
      }
    }
  }

  // Avoid code execution in load() via toString property
  // (still use its own toString for arrays, timestamps,
  // and whatever user schema extensions happen to have @@toStringTag)
  if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
    keyNode = '[object Object]';
  }


  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = {},
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _pos,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = {},
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.
    _pos = state.position;

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }

    } else {
      break; // Reading is done. Go to the epilogue.
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag !== null && state.tag !== '!') {
    if (state.tag === '?') {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];

      if (state.result !== null && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options), index, length;

  if (typeof iterator !== 'function') {
    return documents;
  }

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


function safeLoadAll(input, output, options) {
  if (typeof output === 'function') {
    loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
  } else {
    return loadAll(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
  }
}


function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.loadAll     = loadAll;
module.exports.load        = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad    = safeLoad;


/***/ }),

/***/ 466:
/***/ (function(module) {


module.exports = MoveSummary;

/**
 * The MoveSummary is returned as a response to getting `git().status()`
 *
 * @constructor
 */
function MoveSummary () {
   this.moves = [];
   this.sources = {};
}

MoveSummary.SUMMARY_REGEX = /^Renaming (.+) to (.+)$/;

MoveSummary.parse = function (text) {
   var lines = text.split('\n');
   var summary = new MoveSummary();

   for (var i = 0, iMax = lines.length, line; i < iMax; i++) {
      line = MoveSummary.SUMMARY_REGEX.exec(lines[i].trim());

      if (line) {
         summary.moves.push({
            from: line[1],
            to: line[2]
         });
      }
   }

   return summary;
};


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
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __webpack_require__(87);
const path = __webpack_require__(622);
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
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
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
    command_1.issueCommand('add-path', {}, inputPath);
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
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
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
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
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
 * @param     value    value to store
 */
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

/***/ 486:
/***/ (function(module, __unusedexports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(761);

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return match;
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 533:
/***/ (function(module) {


module.exports = CommitSummary;

function CommitSummary () {
   this.branch = '';
   this.commit = '';
   this.summary = {
      changes: 0,
      insertions: 0,
      deletions: 0
   };
   this.author = null;
}

var COMMIT_BRANCH_MESSAGE_REGEX = /\[([^\s]+) ([^\]]+)/;
var COMMIT_AUTHOR_MESSAGE_REGEX = /\s*Author:\s(.+)/i;

function setBranchFromCommit (commitSummary, commitData) {
   if (commitData) {
      commitSummary.branch = commitData[1];
      commitSummary.commit = commitData[2];
   }
}

function setSummaryFromCommit (commitSummary, commitData) {
   if (commitSummary.branch && commitData) {
      commitSummary.summary.changes = commitData[1] || 0;
      commitSummary.summary.insertions = commitData[2] || 0;
      commitSummary.summary.deletions = commitData[3] || 0;
   }
}

function setAuthorFromCommit (commitSummary, commitData) {
   var parts = commitData[1].split('<');
   var email = parts.pop();

   if (email.indexOf('@') <= 0) {
      return;
   }

   commitSummary.author = {
      email: email.substr(0, email.length - 1),
      name: parts.join('<').trim()
   };
}

CommitSummary.parse = function (commit) {
   var lines = commit.trim().split('\n');
   var commitSummary = new CommitSummary();

   setBranchFromCommit(commitSummary, COMMIT_BRANCH_MESSAGE_REGEX.exec(lines.shift()));

   if (COMMIT_AUTHOR_MESSAGE_REGEX.test(lines[0])) {
      setAuthorFromCommit(commitSummary, COMMIT_AUTHOR_MESSAGE_REGEX.exec(lines.shift()));
   }

   setSummaryFromCommit(commitSummary, /(\d+)[^,]*(?:,\s*(\d+)[^,]*)?(?:,\s*(\d+))?/g.exec(lines.shift()));

   return commitSummary;
};


/***/ }),

/***/ 556:
/***/ (function(module) {

"use strict";
// YAML error class. http://stackoverflow.com/questions/8458984
//


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};


module.exports = YAMLException;


/***/ }),

/***/ 569:
/***/ (function(module, __unusedexports, __webpack_require__) {




var FileStatusSummary = __webpack_require__(932);

module.exports = StatusSummary;

/**
 * The StatusSummary is returned as a response to getting `git().status()`
 *
 * @constructor
 */
function StatusSummary () {
   this.not_added = [];
   this.conflicted = [];
   this.created = [];
   this.deleted = [];
   this.modified = [];
   this.renamed = [];
   this.files = [];
   this.staged = [];
}


/**
 * Number of commits ahead of the tracked branch
 * @type {number}
 */
StatusSummary.prototype.ahead = 0;

/**
 * Number of commits behind the tracked branch
 * @type {number}
 */
StatusSummary.prototype.behind = 0;

/**
 * Name of the current branch
 * @type {null}
 */
StatusSummary.prototype.current = null;

/**
 * Name of the branch being tracked
 * @type {string}
 */
StatusSummary.prototype.tracking = null;

/**
 * All files represented as an array of objects containing the `path` and status in `index` and
 * in the `working_dir`.
 *
 * @type {Array}
 */
StatusSummary.prototype.files = null;

/**
 * Gets whether this StatusSummary represents a clean working branch.
 *
 * @return {boolean}
 */
StatusSummary.prototype.isClean = function () {
   return 0 === Object.keys(this).filter(function (name) {
      return Array.isArray(this[name]) && this[name].length;
   }, this).length;
};

StatusSummary.parsers = {
   '##': function (line, status) {
      var aheadReg = /ahead (\d+)/;
      var behindReg = /behind (\d+)/;
      var currentReg = /^(.+?(?=(?:\.{3}|\s|$)))/;
      var trackingReg = /\.{3}(\S*)/;
      var regexResult;

      regexResult = aheadReg.exec(line);
      status.ahead = regexResult && +regexResult[1] || 0;

      regexResult = behindReg.exec(line);
      status.behind = regexResult && +regexResult[1] || 0;

      regexResult = currentReg.exec(line);
      status.current = regexResult && regexResult[1];

      regexResult = trackingReg.exec(line);
      status.tracking = regexResult && regexResult[1];
   },

   '??': function (line, status) {
      status.not_added.push(line);
   },

   A: function (line, status) {
      status.created.push(line);
   },

   AM: function (line, status) {
      status.created.push(line);
   },

   D: function (line, status) {
      status.deleted.push(line);
   },

   M: function (line, status, indexState) {
      status.modified.push(line);

      if (indexState === 'M') {
         status.staged.push(line);
      }
   },

   R: function (line, status) {
      var detail = /^(.+) -> (.+)$/.exec(line) || [null, line, line];

      status.renamed.push({
         from: detail[1],
         to: detail[2]
      });
   },

   UU: function (line, status) {
      status.conflicted.push(line);
   }
};

StatusSummary.parsers.MM = StatusSummary.parsers.M;

/* Map all unmerged status code combinations to UU to mark as conflicted */
StatusSummary.parsers.AA = StatusSummary.parsers.UU;
StatusSummary.parsers.UD = StatusSummary.parsers.UU;
StatusSummary.parsers.DU = StatusSummary.parsers.UU;
StatusSummary.parsers.DD = StatusSummary.parsers.UU;
StatusSummary.parsers.AU = StatusSummary.parsers.UU;
StatusSummary.parsers.UA = StatusSummary.parsers.UU;

StatusSummary.parse = function (text) {
   var file;
   var lines = text.trim().split('\n');
   var status = new StatusSummary();

   for (var i = 0, l = lines.length; i < l; i++) {
      file = splitLine(lines[i]);

      if (!file) {
         continue;
      }

      if (file.handler) {
         file.handler(file.path, status, file.index, file.workingDir);
      }

      if (file.code !== '##') {
         status.files.push(new FileStatusSummary(file.path, file.index, file.workingDir));
      }
   }

   return status;
};


function splitLine (lineStr) {
   var line = lineStr.trim().match(/(..?)(\s+)(.*)/);
   if (!line || !line[1].trim()) {
      line = lineStr.trim().match(/(..?)\s+(.*)/);
   }

   if (!line) {
      return;
   }

   var code = line[1];
   if (line[2].length > 1) {
      code += ' ';
   }
   if (code.length === 1 && line[2].length === 1) {
      code = ' ' + code;
   }

   return {
      raw: code,
      code: code.trim(),
      index: code.charAt(0),
      workingDir: code.charAt(1),
      handler: StatusSummary.parsers[code.trim()],
      path: line[3]
   };
}


/***/ }),

/***/ 574:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});


/***/ }),

/***/ 581:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346





var Schema = __webpack_require__(43);


module.exports = new Schema({
  explicit: [
    __webpack_require__(574),
    __webpack_require__(921),
    __webpack_require__(988)
  ]
});


/***/ }),

/***/ 611:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.





var Schema = __webpack_require__(43);


module.exports = new Schema({
  include: [
    __webpack_require__(23)
  ]
});


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 629:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

function resolveJavascriptRegExp(data) {
  if (data === null) return false;
  if (data.length === 0) return false;

  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];

    if (modifiers.length > 3) return false;
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
  }

  return true;
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) result += 'g';
  if (object.multiline) result += 'm';
  if (object.ignoreCase) result += 'i';

  return result;
}

function isRegExp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});


/***/ }),

/***/ 633:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});


/***/ }),

/***/ 656:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = MergeSummary;
module.exports.MergeConflict = MergeConflict;

var PullSummary = __webpack_require__(39);

function MergeConflict (reason, file, meta) {
   this.reason = reason;
   this.file = file;
   if (meta) {
      this.meta = meta;
   }
}

MergeConflict.prototype.meta = null;

MergeConflict.prototype.toString = function () {
   return this.file + ':' + this.reason;
};

function MergeSummary () {
   PullSummary.call(this);

   this.conflicts = [];
   this.merges = [];
}

MergeSummary.prototype = Object.create(PullSummary.prototype);

MergeSummary.prototype.result = 'success';

MergeSummary.prototype.toString = function () {
   if (this.conflicts.length) {
      return 'CONFLICTS: ' + this.conflicts.join(', ');
   }
   return 'OK';
};

Object.defineProperty(MergeSummary.prototype, 'failed', {
   get: function () {
      return this.conflicts.length > 0;
   }
});

MergeSummary.parsers = [
   {
      test: /^Auto-merging\s+(.+)$/,
      handle: function (result, mergeSummary) {
         mergeSummary.merges.push(result[1]);
      }
   },
   {
      // Parser for standard merge conflicts
      test: /^CONFLICT\s+\((.+)\): Merge conflict in (.+)$/,
      handle: function (result, mergeSummary) {
         mergeSummary.conflicts.push(new MergeConflict(result[1], result[2]));
      }
   },
   {
      // Parser for modify/delete merge conflicts (modified by us/them, deleted by them/us)
      test: /^CONFLICT\s+\((.+\/delete)\): (.+) deleted in (.+) and/,
      handle: function (result, mergeSummary) {
         mergeSummary.conflicts.push(
            new MergeConflict(result[1], result[2], {deleteRef: result[3]})
         );
      }
   },
   {
      // Catch-all parser for unknown/unparsed conflicts
      test: /^CONFLICT\s+\((.+)\):/,
      handle: function (result, mergeSummary) {
         mergeSummary.conflicts.push(new MergeConflict(result[1], null));
      }
   },
   {
      test: /^Automatic merge failed;\s+(.+)$/,
      handle: function (result, mergeSummary) {
         mergeSummary.reason = mergeSummary.result = result[1];
      }
   }
];

MergeSummary.parse = function (output) {
   let mergeSummary = new MergeSummary();

   output.trim().split('\n').forEach(function (line) {
      for (var i = 0, iMax = MergeSummary.parsers.length; i < iMax; i++) {
         let parser = MergeSummary.parsers[i];

         var result = parser.test.exec(line);
         if (result) {
            parser.handle(result, mergeSummary);
            break;
         }
      }
   });

   let pullSummary = PullSummary.parse(output);
   if (pullSummary.summary.changes) {
      Object.assign(mergeSummary, pullSummary);
   }

   return mergeSummary;
};


/***/ }),

/***/ 662:
/***/ (function(module) {

"use strict";


function FetchSummary (raw) {
   this.raw = raw;

   this.remote = null;
   this.branches = [];
   this.tags = [];
}

FetchSummary.parsers = [
   [
      /From (.+)$/, function (fetchSummary, matches) {
         fetchSummary.remote = matches[0];
      }
   ],
   [
      /\* \[new branch\]\s+(\S+)\s*\-> (.+)$/, function (fetchSummary, matches) {
         fetchSummary.branches.push({
            name: matches[0],
            tracking: matches[1]
         });
      }
   ],
   [
      /\* \[new tag\]\s+(\S+)\s*\-> (.+)$/, function (fetchSummary, matches) {
         fetchSummary.tags.push({
            name: matches[0],
            tracking: matches[1]
         });
      }
   ]
];

FetchSummary.parse = function (data) {
   var fetchSummary = new FetchSummary(data);

   String(data)
      .trim()
      .split('\n')
      .forEach(function (line) {
         var original = line.trim();
         FetchSummary.parsers.some(function (parser) {
            var parsed = parser[0].exec(original);
            if (parsed) {
               parser[1](fetchSummary, parsed.slice(1));
               return true;
            }
         });
      });

   return fetchSummary;
};

module.exports = FetchSummary;


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 685:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


/*eslint-disable no-use-before-define*/

var common              = __webpack_require__(740);
var YAMLException       = __webpack_require__(556);
var DEFAULT_FULL_SCHEMA = __webpack_require__(910);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(723);

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}

function State(options) {
  this.schema        = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent        = Math.max(1, (options['indent'] || 2));
  this.noArrayIndent = options['noArrayIndent'] || false;
  this.skipInvalid   = options['skipInvalid'] || false;
  this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys      = options['sortKeys'] || false;
  this.lineWidth     = options['lineWidth'] || 80;
  this.noRefs        = options['noRefs'] || false;
  this.noCompatMode  = options['noCompatMode'] || false;
  this.condenseFlow  = options['condenseFlow'] || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== 0xFEFF /* BOM */)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// Simplified test for values allowed after the first character in plain style.
function isPlainSafe(c) {
  // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
  // where nb-char ::= c-printable - b-char - c-byte-order-mark.
  return isPrintable(c) && c !== 0xFEFF
    // - c-flow-indicator
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // - ":" - "#"
    && c !== CHAR_COLON
    && c !== CHAR_SHARP;
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  return isPrintable(c) && c !== 0xFEFF
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

// Determines whether block indentation indicator is required.
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
  var i;
  var char;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(string.charCodeAt(0))
          && !isWhitespace(string.charCodeAt(string.length - 1));

  if (singleLineOnly) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    return plain && !testAmbiguousType(string)
      ? STYLE_PLAIN : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey) {
  state.dump = (function () {
    if (string.length === 0) {
      return "''";
    }
    if (!state.noCompatMode &&
        DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
      return "'" + string + "'";
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char, nextChar;
  var escapeSeq;

  for (var i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    // Check for surrogate pairs (reference Unicode 3.0 section "3.7 Surrogates").
    if (char >= 0xD800 && char <= 0xDBFF/* high surrogate */) {
      nextChar = string.charCodeAt(i + 1);
      if (nextChar >= 0xDC00 && nextChar <= 0xDFFF/* low surrogate */) {
        // Combine the surrogate pair and store it escaped.
        result += encodeHex((char - 0xD800) * 0x400 + nextChar - 0xDC00 + 0x10000);
        // Advance index one extra since we already used that char here.
        i++; continue;
      }
    }
    escapeSeq = ESCAPE_SEQUENCES[char];
    result += !escapeSeq && isPrintable(char)
      ? string[i]
      : escapeSeq || encodeHex(char);
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (index !== 0) _result += ',' + (!state.condenseFlow ? ' ' : '');
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || index !== 0) {
        _result += generateNextLine(state, level);
      }

      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += '-';
      } else {
        _result += '- ';
      }

      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = state.condenseFlow ? '"' : '';

    if (index !== 0) pairBuffer += ', ';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || index !== 0) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      var arrayLevel = (state.noArrayIndent && (level > 0)) ? level - 1 : level;
      if (block && (state.dump.length !== 0)) {
        writeBlockSequence(state, arrayLevel, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, arrayLevel, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      state.dump = '!<' + state.tag + '> ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

  return '';
}

function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.dump     = dump;
module.exports.safeDump = safeDump;


/***/ }),

/***/ 723:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)





var Schema = __webpack_require__(43);


module.exports = new Schema({
  include: [
    __webpack_require__(611)
  ],
  implicit: [
    __webpack_require__(82),
    __webpack_require__(633)
  ],
  explicit: [
    __webpack_require__(913),
    __webpack_require__(842),
    __webpack_require__(947),
    __webpack_require__(100)
  ]
});


/***/ }),

/***/ 740:
/***/ (function(module) {

"use strict";



function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 761:
/***/ (function(module) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 784:
/***/ (function(module, __unusedexports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(794);
} else {
	module.exports = __webpack_require__(81);
}


/***/ }),

/***/ 794:
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(486)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 809:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});


/***/ }),

/***/ 816:
/***/ (function(module, __unusedexports, __webpack_require__) {


module.exports = ListLogSummary;

var DiffSummary = __webpack_require__(129);

/**
 * The ListLogSummary is returned as a response to getting `git().log()` or `git().stashList()`
 *
 * @constructor
 */
function ListLogSummary (all) {
   this.all = all;
   this.latest = all.length && all[0] || null;
   this.total = all.length;
}

/**
 * Detail for each of the log lines
 * @type {ListLogLine[]}
 */
ListLogSummary.prototype.all = null;

/**
 * Most recent entry in the log
 * @type {ListLogLine}
 */
ListLogSummary.prototype.latest = null;

/**
 * Number of items in the log
 * @type {number}
 */
ListLogSummary.prototype.total = 0;

function ListLogLine (line, fields) {
   for (var k = 0; k < fields.length; k++) {
      this[fields[k]] = line[k] || '';
   }
}

/**
 * When the log was generated with a summary, the `diff` property contains as much detail
 * as was provided in the log (whether generated with `--stat` or `--shortstat`.
 * @type {DiffSummary}
 */
ListLogLine.prototype.diff = null;

ListLogSummary.START_BOUNDARY = 'òòòòòò ';

ListLogSummary.COMMIT_BOUNDARY = ' òò';

ListLogSummary.SPLITTER = ' ò ';

ListLogSummary.parse = function (text, splitter, fields) {
   fields = fields || ['hash', 'date', 'message', 'refs', 'author_name', 'author_email'];
   return new ListLogSummary(
      text
         .trim()
         .split(ListLogSummary.START_BOUNDARY)
         .filter(function(item) { return !!item.trim(); })
         .map(function (item) {
            var lineDetail = item.trim().split(ListLogSummary.COMMIT_BOUNDARY);
            var listLogLine = new ListLogLine(lineDetail[0].trim().split(splitter), fields);

            if (lineDetail.length > 1 && !!lineDetail[1].trim()) {
               listLogLine.diff = DiffSummary.parse(lineDetail[1]);
            }

            return listLogLine;
         })
   );
};


/***/ }),

/***/ 842:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});


/***/ }),

/***/ 867:
/***/ (function(module) {

module.exports = require("tty");

/***/ }),

/***/ 898:
/***/ (function(module, __unusedexports, __webpack_require__) {


module.exports = {
   BranchDeleteSummary: __webpack_require__(440),
   BranchSummary: __webpack_require__(94),
   CommitSummary: __webpack_require__(533),
   DiffSummary: __webpack_require__(129),
   FetchSummary: __webpack_require__(662),
   FileStatusSummary: __webpack_require__(932),
   ListLogSummary: __webpack_require__(816),
   MergeSummary: __webpack_require__(656),
   MoveSummary: __webpack_require__(466),
   PullSummary: __webpack_require__(39),
   StatusSummary: __webpack_require__(569),
   TagList: __webpack_require__(306),
};


/***/ }),

/***/ 910:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.





var Schema = __webpack_require__(43);


module.exports = Schema.DEFAULT = new Schema({
  include: [
    __webpack_require__(723)
  ],
  explicit: [
    __webpack_require__(386),
    __webpack_require__(629),
    __webpack_require__(352)
  ]
});


/***/ }),

/***/ 913:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


/*eslint-disable no-bitwise*/

var NodeBuffer;

try {
  // A trick for browserified version, to not include `Buffer` shim
  var _require = require;
  NodeBuffer = _require('buffer').Buffer;
} catch (__) {}

var Type       = __webpack_require__(945);


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) {
    // Support node 6.+ Buffer API when available
    return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
  }

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});


/***/ }),

/***/ 921:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});


/***/ }),

/***/ 932:
/***/ (function(module) {

"use strict";


function FileStatusSummary (path, index, working_dir) {
   this.path = path;
   this.index = index;
   this.working_dir = working_dir;

   if ('R' === index + working_dir) {
      var detail = FileStatusSummary.fromPathRegex.exec(path) || [null, path, path];
      this.from = detail[1];
      this.path = detail[2];
   }
}

FileStatusSummary.fromPathRegex = /^(.+) -> (.+)$/;

FileStatusSummary.prototype = {
   path: '',
   from: ''
};

module.exports = FileStatusSummary;


/***/ }),

/***/ 945:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var YAMLException = __webpack_require__(556);

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag          = tag;
  this.kind         = options['kind']         || null;
  this.resolve      = options['resolve']      || function () { return true; };
  this.construct    = options['construct']    || function (data) { return data; };
  this.instanceOf   = options['instanceOf']   || null;
  this.predicate    = options['predicate']    || null;
  this.represent    = options['represent']    || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;


/***/ }),

/***/ 947:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});


/***/ }),

/***/ 964:
/***/ (function(module, __unusedexports, __webpack_require__) {


var Git = __webpack_require__(71);

module.exports = function (baseDir) {

   var dependencies = __webpack_require__(970);

   if (baseDir && !dependencies.exists(baseDir, dependencies.exists.FOLDER)) {
       throw new Error("Cannot use simple-git on a directory that does not exist.");
    }

    return new Git(baseDir || process.cwd(), dependencies.childProcess(), dependencies.buffer());
};



/***/ }),

/***/ 970:
/***/ (function(module, __unusedexports, __webpack_require__) {

/**
 * Exports the utilities `simple-git` depends upon to allow for mocking during a test
 */
module.exports = {

   buffer: function () { return __webpack_require__(293).Buffer; },

   childProcess: function () { return __webpack_require__(4); },

   exists: __webpack_require__(265)

};


/***/ }),

/***/ 988:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(945);

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});


/***/ })

/******/ });