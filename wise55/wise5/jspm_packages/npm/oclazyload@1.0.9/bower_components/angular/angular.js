/* */ 
(function(process) {
  (function(window, document, undefined) {
    'use strict';
    function minErr(module, ErrorConstructor) {
      ErrorConstructor = ErrorConstructor || Error;
      return function() {
        var SKIP_INDEXES = 2;
        var templateArgs = arguments,
            code = templateArgs[0],
            message = '[' + (module ? module + ':' : '') + code + '] ',
            template = templateArgs[1],
            paramPrefix,
            i;
        message += template.replace(/\{\d+\}/g, function(match) {
          var index = +match.slice(1, -1),
              shiftedIndex = index + SKIP_INDEXES;
          if (shiftedIndex < templateArgs.length) {
            return toDebugString(templateArgs[shiftedIndex]);
          }
          return match;
        });
        message += '\nhttp://errors.angularjs.org/1.4.4/' + (module ? module + '/' : '') + code;
        for (i = SKIP_INDEXES, paramPrefix = '?'; i < templateArgs.length; i++, paramPrefix = '&') {
          message += paramPrefix + 'p' + (i - SKIP_INDEXES) + '=' + encodeURIComponent(toDebugString(templateArgs[i]));
        }
        return new ErrorConstructor(message);
      };
    }
    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;
    var VALIDITY_STATE_PROPERTY = 'validity';
    var lowercase = function(string) {
      return isString(string) ? string.toLowerCase() : string;
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var uppercase = function(string) {
      return isString(string) ? string.toUpperCase() : string;
    };
    var manualLowercase = function(s) {
      return isString(s) ? s.replace(/[A-Z]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) | 32);
      }) : s;
    };
    var manualUppercase = function(s) {
      return isString(s) ? s.replace(/[a-z]/g, function(ch) {
        return String.fromCharCode(ch.charCodeAt(0) & ~32);
      }) : s;
    };
    if ('i' !== 'I'.toLowerCase()) {
      lowercase = manualLowercase;
      uppercase = manualUppercase;
    }
    var msie,
        jqLite,
        jQuery,
        slice = [].slice,
        splice = [].splice,
        push = [].push,
        toString = Object.prototype.toString,
        getPrototypeOf = Object.getPrototypeOf,
        ngMinErr = minErr('ng'),
        angular = window.angular || (window.angular = {}),
        angularModule,
        uid = 0;
    msie = document.documentMode;
    function isArrayLike(obj) {
      if (obj == null || isWindow(obj)) {
        return false;
      }
      var length = "length" in Object(obj) && obj.length;
      if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
        return true;
      }
      return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
    function forEach(obj, iterator, context) {
      var key,
          length;
      if (obj) {
        if (isFunction(obj)) {
          for (key in obj) {
            if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else if (isArray(obj) || isArrayLike(obj)) {
          var isPrimitive = typeof obj !== 'object';
          for (key = 0, length = obj.length; key < length; key++) {
            if (isPrimitive || key in obj) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context, obj);
        } else if (isBlankObject(obj)) {
          for (key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        } else if (typeof obj.hasOwnProperty === 'function') {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        } else {
          for (key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              iterator.call(context, obj[key], key, obj);
            }
          }
        }
      }
      return obj;
    }
    function forEachSorted(obj, iterator, context) {
      var keys = Object.keys(obj).sort();
      for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
      }
      return keys;
    }
    function reverseParams(iteratorFn) {
      return function(value, key) {
        iteratorFn(key, value);
      };
    }
    function nextUid() {
      return ++uid;
    }
    function setHashKey(obj, h) {
      if (h) {
        obj.$$hashKey = h;
      } else {
        delete obj.$$hashKey;
      }
    }
    function baseExtend(dst, objs, deep) {
      var h = dst.$$hashKey;
      for (var i = 0,
          ii = objs.length; i < ii; ++i) {
        var obj = objs[i];
        if (!isObject(obj) && !isFunction(obj))
          continue;
        var keys = Object.keys(obj);
        for (var j = 0,
            jj = keys.length; j < jj; j++) {
          var key = keys[j];
          var src = obj[key];
          if (deep && isObject(src)) {
            if (isDate(src)) {
              dst[key] = new Date(src.valueOf());
            } else if (isRegExp(src)) {
              dst[key] = new RegExp(src);
            } else {
              if (!isObject(dst[key]))
                dst[key] = isArray(src) ? [] : {};
              baseExtend(dst[key], [src], true);
            }
          } else {
            dst[key] = src;
          }
        }
      }
      setHashKey(dst, h);
      return dst;
    }
    function extend(dst) {
      return baseExtend(dst, slice.call(arguments, 1), false);
    }
    function merge(dst) {
      return baseExtend(dst, slice.call(arguments, 1), true);
    }
    function toInt(str) {
      return parseInt(str, 10);
    }
    function inherit(parent, extra) {
      return extend(Object.create(parent), extra);
    }
    function noop() {}
    noop.$inject = [];
    function identity($) {
      return $;
    }
    identity.$inject = [];
    function valueFn(value) {
      return function() {
        return value;
      };
    }
    function hasCustomToString(obj) {
      return isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
    }
    function isUndefined(value) {
      return typeof value === 'undefined';
    }
    function isDefined(value) {
      return typeof value !== 'undefined';
    }
    function isObject(value) {
      return value !== null && typeof value === 'object';
    }
    function isBlankObject(value) {
      return value !== null && typeof value === 'object' && !getPrototypeOf(value);
    }
    function isString(value) {
      return typeof value === 'string';
    }
    function isNumber(value) {
      return typeof value === 'number';
    }
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    var isArray = Array.isArray;
    function isFunction(value) {
      return typeof value === 'function';
    }
    function isRegExp(value) {
      return toString.call(value) === '[object RegExp]';
    }
    function isWindow(obj) {
      return obj && obj.window === obj;
    }
    function isScope(obj) {
      return obj && obj.$evalAsync && obj.$watch;
    }
    function isFile(obj) {
      return toString.call(obj) === '[object File]';
    }
    function isFormData(obj) {
      return toString.call(obj) === '[object FormData]';
    }
    function isBlob(obj) {
      return toString.call(obj) === '[object Blob]';
    }
    function isBoolean(value) {
      return typeof value === 'boolean';
    }
    function isPromiseLike(obj) {
      return obj && isFunction(obj.then);
    }
    var TYPED_ARRAY_REGEXP = /^\[object (Uint8(Clamped)?)|(Uint16)|(Uint32)|(Int8)|(Int16)|(Int32)|(Float(32)|(64))Array\]$/;
    function isTypedArray(value) {
      return TYPED_ARRAY_REGEXP.test(toString.call(value));
    }
    var trim = function(value) {
      return isString(value) ? value.trim() : value;
    };
    var escapeForRegexp = function(s) {
      return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
    };
    function isElement(node) {
      return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
    }
    function makeMap(str) {
      var obj = {},
          items = str.split(","),
          i;
      for (i = 0; i < items.length; i++) {
        obj[items[i]] = true;
      }
      return obj;
    }
    function nodeName_(element) {
      return lowercase(element.nodeName || (element[0] && element[0].nodeName));
    }
    function includes(array, obj) {
      return Array.prototype.indexOf.call(array, obj) != -1;
    }
    function arrayRemove(array, value) {
      var index = array.indexOf(value);
      if (index >= 0) {
        array.splice(index, 1);
      }
      return index;
    }
    function copy(source, destination, stackSource, stackDest) {
      if (isWindow(source) || isScope(source)) {
        throw ngMinErr('cpws', "Can't copy! Making copies of Window or Scope instances is not supported.");
      }
      if (isTypedArray(destination)) {
        throw ngMinErr('cpta', "Can't copy! TypedArray destination cannot be mutated.");
      }
      if (!destination) {
        destination = source;
        if (isObject(source)) {
          var index;
          if (stackSource && (index = stackSource.indexOf(source)) !== -1) {
            return stackDest[index];
          }
          if (isArray(source)) {
            return copy(source, [], stackSource, stackDest);
          } else if (isTypedArray(source)) {
            destination = new source.constructor(source);
          } else if (isDate(source)) {
            destination = new Date(source.getTime());
          } else if (isRegExp(source)) {
            destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
            destination.lastIndex = source.lastIndex;
          } else {
            var emptyObject = Object.create(getPrototypeOf(source));
            return copy(source, emptyObject, stackSource, stackDest);
          }
          if (stackDest) {
            stackSource.push(source);
            stackDest.push(destination);
          }
        }
      } else {
        if (source === destination)
          throw ngMinErr('cpi', "Can't copy! Source and destination are identical.");
        stackSource = stackSource || [];
        stackDest = stackDest || [];
        if (isObject(source)) {
          stackSource.push(source);
          stackDest.push(destination);
        }
        var result,
            key;
        if (isArray(source)) {
          destination.length = 0;
          for (var i = 0; i < source.length; i++) {
            destination.push(copy(source[i], null, stackSource, stackDest));
          }
        } else {
          var h = destination.$$hashKey;
          if (isArray(destination)) {
            destination.length = 0;
          } else {
            forEach(destination, function(value, key) {
              delete destination[key];
            });
          }
          if (isBlankObject(source)) {
            for (key in source) {
              destination[key] = copy(source[key], null, stackSource, stackDest);
            }
          } else if (source && typeof source.hasOwnProperty === 'function') {
            for (key in source) {
              if (source.hasOwnProperty(key)) {
                destination[key] = copy(source[key], null, stackSource, stackDest);
              }
            }
          } else {
            for (key in source) {
              if (hasOwnProperty.call(source, key)) {
                destination[key] = copy(source[key], null, stackSource, stackDest);
              }
            }
          }
          setHashKey(destination, h);
        }
      }
      return destination;
    }
    function shallowCopy(src, dst) {
      if (isArray(src)) {
        dst = dst || [];
        for (var i = 0,
            ii = src.length; i < ii; i++) {
          dst[i] = src[i];
        }
      } else if (isObject(src)) {
        dst = dst || {};
        for (var key in src) {
          if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
            dst[key] = src[key];
          }
        }
      }
      return dst || src;
    }
    function equals(o1, o2) {
      if (o1 === o2)
        return true;
      if (o1 === null || o2 === null)
        return false;
      if (o1 !== o1 && o2 !== o2)
        return true;
      var t1 = typeof o1,
          t2 = typeof o2,
          length,
          key,
          keySet;
      if (t1 == t2) {
        if (t1 == 'object') {
          if (isArray(o1)) {
            if (!isArray(o2))
              return false;
            if ((length = o1.length) == o2.length) {
              for (key = 0; key < length; key++) {
                if (!equals(o1[key], o2[key]))
                  return false;
              }
              return true;
            }
          } else if (isDate(o1)) {
            if (!isDate(o2))
              return false;
            return equals(o1.getTime(), o2.getTime());
          } else if (isRegExp(o1)) {
            return isRegExp(o2) ? o1.toString() == o2.toString() : false;
          } else {
            if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2) || isDate(o2) || isRegExp(o2))
              return false;
            keySet = createMap();
            for (key in o1) {
              if (key.charAt(0) === '$' || isFunction(o1[key]))
                continue;
              if (!equals(o1[key], o2[key]))
                return false;
              keySet[key] = true;
            }
            for (key in o2) {
              if (!(key in keySet) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
                return false;
            }
            return true;
          }
        }
      }
      return false;
    }
    var csp = function() {
      if (!isDefined(csp.rules)) {
        var ngCspElement = (document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
        if (ngCspElement) {
          var ngCspAttribute = ngCspElement.getAttribute('ng-csp') || ngCspElement.getAttribute('data-ng-csp');
          csp.rules = {
            noUnsafeEval: !ngCspAttribute || (ngCspAttribute.indexOf('no-unsafe-eval') !== -1),
            noInlineStyle: !ngCspAttribute || (ngCspAttribute.indexOf('no-inline-style') !== -1)
          };
        } else {
          csp.rules = {
            noUnsafeEval: noUnsafeEval(),
            noInlineStyle: false
          };
        }
      }
      return csp.rules;
      function noUnsafeEval() {
        try {
          new Function('');
          return false;
        } catch (e) {
          return true;
        }
      }
    };
    var jq = function() {
      if (isDefined(jq.name_))
        return jq.name_;
      var el;
      var i,
          ii = ngAttrPrefixes.length,
          prefix,
          name;
      for (i = 0; i < ii; ++i) {
        prefix = ngAttrPrefixes[i];
        if (el = document.querySelector('[' + prefix.replace(':', '\\:') + 'jq]')) {
          name = el.getAttribute(prefix + 'jq');
          break;
        }
      }
      return (jq.name_ = name);
    };
    function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
      return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
      var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
      if (isFunction(fn) && !(fn instanceof RegExp)) {
        return curryArgs.length ? function() {
          return arguments.length ? fn.apply(self, concat(curryArgs, arguments, 0)) : fn.apply(self, curryArgs);
        } : function() {
          return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
      } else {
        return fn;
      }
    }
    function toJsonReplacer(key, value) {
      var val = value;
      if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
        val = undefined;
      } else if (isWindow(value)) {
        val = '$WINDOW';
      } else if (value && document === value) {
        val = '$DOCUMENT';
      } else if (isScope(value)) {
        val = '$SCOPE';
      }
      return val;
    }
    function toJson(obj, pretty) {
      if (typeof obj === 'undefined')
        return undefined;
      if (!isNumber(pretty)) {
        pretty = pretty ? 2 : null;
      }
      return JSON.stringify(obj, toJsonReplacer, pretty);
    }
    function fromJson(json) {
      return isString(json) ? JSON.parse(json) : json;
    }
    function timezoneToOffset(timezone, fallback) {
      var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
      return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
    }
    function addDateMinutes(date, minutes) {
      date = new Date(date.getTime());
      date.setMinutes(date.getMinutes() + minutes);
      return date;
    }
    function convertTimezoneToLocal(date, timezone, reverse) {
      reverse = reverse ? -1 : 1;
      var timezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
      return addDateMinutes(date, reverse * (timezoneOffset - date.getTimezoneOffset()));
    }
    function startingTag(element) {
      element = jqLite(element).clone();
      try {
        element.empty();
      } catch (e) {}
      var elemHtml = jqLite('<div>').append(element).html();
      try {
        return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function(match, nodeName) {
          return '<' + lowercase(nodeName);
        });
      } catch (e) {
        return lowercase(elemHtml);
      }
    }
    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {}
    }
    function parseKeyValue(keyValue) {
      var obj = {};
      forEach((keyValue || "").split('&'), function(keyValue) {
        var splitPoint,
            key,
            val;
        if (keyValue) {
          key = keyValue = keyValue.replace(/\+/g, '%20');
          splitPoint = keyValue.indexOf('=');
          if (splitPoint !== -1) {
            key = keyValue.substring(0, splitPoint);
            val = keyValue.substring(splitPoint + 1);
          }
          key = tryDecodeURIComponent(key);
          if (isDefined(key)) {
            val = isDefined(val) ? tryDecodeURIComponent(val) : true;
            if (!hasOwnProperty.call(obj, key)) {
              obj[key] = val;
            } else if (isArray(obj[key])) {
              obj[key].push(val);
            } else {
              obj[key] = [obj[key], val];
            }
          }
        }
      });
      return obj;
    }
    function toKeyValue(obj) {
      var parts = [];
      forEach(obj, function(value, key) {
        if (isArray(value)) {
          forEach(value, function(arrayValue) {
            parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
          });
        } else {
          parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
        }
      });
      return parts.length ? parts.join('&') : '';
    }
    function encodeUriSegment(val) {
      return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }
    var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-'];
    function getNgAttribute(element, ngAttr) {
      var attr,
          i,
          ii = ngAttrPrefixes.length;
      for (i = 0; i < ii; ++i) {
        attr = ngAttrPrefixes[i] + ngAttr;
        if (isString(attr = element.getAttribute(attr))) {
          return attr;
        }
      }
      return null;
    }
    function angularInit(element, bootstrap) {
      var appElement,
          module,
          config = {};
      forEach(ngAttrPrefixes, function(prefix) {
        var name = prefix + 'app';
        if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
          appElement = element;
          module = element.getAttribute(name);
        }
      });
      forEach(ngAttrPrefixes, function(prefix) {
        var name = prefix + 'app';
        var candidate;
        if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
          appElement = candidate;
          module = candidate.getAttribute(name);
        }
      });
      if (appElement) {
        config.strictDi = getNgAttribute(appElement, "strict-di") !== null;
        bootstrap(appElement, module ? [module] : [], config);
      }
    }
    function bootstrap(element, modules, config) {
      if (!isObject(config))
        config = {};
      var defaultConfig = {strictDi: false};
      config = extend(defaultConfig, config);
      var doBootstrap = function() {
        element = jqLite(element);
        if (element.injector()) {
          var tag = (element[0] === document) ? 'document' : startingTag(element);
          throw ngMinErr('btstrpd', "App Already Bootstrapped with this Element '{0}'", tag.replace(/</, '&lt;').replace(/>/, '&gt;'));
        }
        modules = modules || [];
        modules.unshift(['$provide', function($provide) {
          $provide.value('$rootElement', element);
        }]);
        if (config.debugInfoEnabled) {
          modules.push(['$compileProvider', function($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
          }]);
        }
        modules.unshift('ng');
        var injector = createInjector(modules, config.strictDi);
        injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector', function bootstrapApply(scope, element, compile, injector) {
          scope.$apply(function() {
            element.data('$injector', injector);
            compile(element)(scope);
          });
        }]);
        return injector;
      };
      var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
      var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
      if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
        config.debugInfoEnabled = true;
        window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
      }
      if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
        return doBootstrap();
      }
      window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
      angular.resumeBootstrap = function(extraModules) {
        forEach(extraModules, function(module) {
          modules.push(module);
        });
        return doBootstrap();
      };
      if (isFunction(angular.resumeDeferredBootstrap)) {
        angular.resumeDeferredBootstrap();
      }
    }
    function reloadWithDebugInfo() {
      window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
      window.location.reload();
    }
    function getTestability(rootElement) {
      var injector = angular.element(rootElement).injector();
      if (!injector) {
        throw ngMinErr('test', 'no injector found for element argument to getTestability');
      }
      return injector.get('$$testability');
    }
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
      separator = separator || '_';
      return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
      });
    }
    var bindJQueryFired = false;
    var skipDestroyOnNextJQueryCleanData;
    function bindJQuery() {
      var originalCleanData;
      if (bindJQueryFired) {
        return;
      }
      var jqName = jq();
      jQuery = window.jQuery;
      if (isDefined(jqName)) {
        jQuery = jqName === null ? undefined : window[jqName];
      }
      if (jQuery && jQuery.fn.on) {
        jqLite = jQuery;
        extend(jQuery.fn, {
          scope: JQLitePrototype.scope,
          isolateScope: JQLitePrototype.isolateScope,
          controller: JQLitePrototype.controller,
          injector: JQLitePrototype.injector,
          inheritedData: JQLitePrototype.inheritedData
        });
        originalCleanData = jQuery.cleanData;
        jQuery.cleanData = function(elems) {
          var events;
          if (!skipDestroyOnNextJQueryCleanData) {
            for (var i = 0,
                elem; (elem = elems[i]) != null; i++) {
              events = jQuery._data(elem, "events");
              if (events && events.$destroy) {
                jQuery(elem).triggerHandler('$destroy');
              }
            }
          } else {
            skipDestroyOnNextJQueryCleanData = false;
          }
          originalCleanData(elems);
        };
      } else {
        jqLite = JQLite;
      }
      angular.element = jqLite;
      bindJQueryFired = true;
    }
    function assertArg(arg, name, reason) {
      if (!arg) {
        throw ngMinErr('areq', "Argument '{0}' is {1}", (name || '?'), (reason || "required"));
      }
      return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
      if (acceptArrayAnnotation && isArray(arg)) {
        arg = arg[arg.length - 1];
      }
      assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
      return arg;
    }
    function assertNotHasOwnProperty(name, context) {
      if (name === 'hasOwnProperty') {
        throw ngMinErr('badname', "hasOwnProperty is not a valid {0} name", context);
      }
    }
    function getter(obj, path, bindFnToScope) {
      if (!path)
        return obj;
      var keys = path.split('.');
      var key;
      var lastInstance = obj;
      var len = keys.length;
      for (var i = 0; i < len; i++) {
        key = keys[i];
        if (obj) {
          obj = (lastInstance = obj)[key];
        }
      }
      if (!bindFnToScope && isFunction(obj)) {
        return bind(lastInstance, obj);
      }
      return obj;
    }
    function getBlockNodes(nodes) {
      var node = nodes[0];
      var endNode = nodes[nodes.length - 1];
      var blockNodes = [node];
      do {
        node = node.nextSibling;
        if (!node)
          break;
        blockNodes.push(node);
      } while (node !== endNode);
      return jqLite(blockNodes);
    }
    function createMap() {
      return Object.create(null);
    }
    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_ATTRIBUTE = 2;
    var NODE_TYPE_TEXT = 3;
    var NODE_TYPE_COMMENT = 8;
    var NODE_TYPE_DOCUMENT = 9;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
    function setupModuleLoader(window) {
      var $injectorMinErr = minErr('$injector');
      var ngMinErr = minErr('ng');
      function ensure(obj, name, factory) {
        return obj[name] || (obj[name] = factory());
      }
      var angular = ensure(window, 'angular', Object);
      angular.$$minErr = angular.$$minErr || minErr;
      return ensure(angular, 'module', function() {
        var modules = {};
        return function module(name, requires, configFn) {
          var assertNotHasOwnProperty = function(name, context) {
            if (name === 'hasOwnProperty') {
              throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
            }
          };
          assertNotHasOwnProperty(name, 'module');
          if (requires && modules.hasOwnProperty(name)) {
            modules[name] = null;
          }
          return ensure(modules, name, function() {
            if (!requires) {
              throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " + "the module name or forgot to load it. If registering a module ensure that you " + "specify the dependencies as the second argument.", name);
            }
            var invokeQueue = [];
            var configBlocks = [];
            var runBlocks = [];
            var config = invokeLater('$injector', 'invoke', 'push', configBlocks);
            var moduleInstance = {
              _invokeQueue: invokeQueue,
              _configBlocks: configBlocks,
              _runBlocks: runBlocks,
              requires: requires,
              name: name,
              provider: invokeLaterAndSetModuleName('$provide', 'provider'),
              factory: invokeLaterAndSetModuleName('$provide', 'factory'),
              service: invokeLaterAndSetModuleName('$provide', 'service'),
              value: invokeLater('$provide', 'value'),
              constant: invokeLater('$provide', 'constant', 'unshift'),
              decorator: invokeLaterAndSetModuleName('$provide', 'decorator'),
              animation: invokeLaterAndSetModuleName('$animateProvider', 'register'),
              filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),
              controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),
              directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),
              config: config,
              run: function(block) {
                runBlocks.push(block);
                return this;
              }
            };
            if (configFn) {
              config(configFn);
            }
            return moduleInstance;
            function invokeLater(provider, method, insertMethod, queue) {
              if (!queue)
                queue = invokeQueue;
              return function() {
                queue[insertMethod || 'push']([provider, method, arguments]);
                return moduleInstance;
              };
            }
            function invokeLaterAndSetModuleName(provider, method) {
              return function(recipeName, factoryFunction) {
                if (factoryFunction && isFunction(factoryFunction))
                  factoryFunction.$$moduleName = name;
                invokeQueue.push([provider, method, arguments]);
                return moduleInstance;
              };
            }
          });
        };
      });
    }
    function serializeObject(obj) {
      var seen = [];
      return JSON.stringify(obj, function(key, val) {
        val = toJsonReplacer(key, val);
        if (isObject(val)) {
          if (seen.indexOf(val) >= 0)
            return '<<already seen>>';
          seen.push(val);
        }
        return val;
      });
    }
    function toDebugString(obj) {
      if (typeof obj === 'function') {
        return obj.toString().replace(/ \{[\s\S]*$/, '');
      } else if (typeof obj === 'undefined') {
        return 'undefined';
      } else if (typeof obj !== 'string') {
        return serializeObject(obj);
      }
      return obj;
    }
    var version = {
      full: '1.4.4',
      major: 1,
      minor: 4,
      dot: 4,
      codeName: 'pylon-requirement'
    };
    function publishExternalAPI(angular) {
      extend(angular, {
        'bootstrap': bootstrap,
        'copy': copy,
        'extend': extend,
        'merge': merge,
        'equals': equals,
        'element': jqLite,
        'forEach': forEach,
        'injector': createInjector,
        'noop': noop,
        'bind': bind,
        'toJson': toJson,
        'fromJson': fromJson,
        'identity': identity,
        'isUndefined': isUndefined,
        'isDefined': isDefined,
        'isString': isString,
        'isFunction': isFunction,
        'isObject': isObject,
        'isNumber': isNumber,
        'isElement': isElement,
        'isArray': isArray,
        'version': version,
        'isDate': isDate,
        'lowercase': lowercase,
        'uppercase': uppercase,
        'callbacks': {counter: 0},
        'getTestability': getTestability,
        '$$minErr': minErr,
        '$$csp': csp,
        'reloadWithDebugInfo': reloadWithDebugInfo
      });
      angularModule = setupModuleLoader(window);
      angularModule('ng', ['ngLocale'], ['$provide', function ngModule($provide) {
        $provide.provider({$$sanitizeUri: $$SanitizeUriProvider});
        $provide.provider('$compile', $CompileProvider).directive({
          a: htmlAnchorDirective,
          input: inputDirective,
          textarea: inputDirective,
          form: formDirective,
          script: scriptDirective,
          select: selectDirective,
          style: styleDirective,
          option: optionDirective,
          ngBind: ngBindDirective,
          ngBindHtml: ngBindHtmlDirective,
          ngBindTemplate: ngBindTemplateDirective,
          ngClass: ngClassDirective,
          ngClassEven: ngClassEvenDirective,
          ngClassOdd: ngClassOddDirective,
          ngCloak: ngCloakDirective,
          ngController: ngControllerDirective,
          ngForm: ngFormDirective,
          ngHide: ngHideDirective,
          ngIf: ngIfDirective,
          ngInclude: ngIncludeDirective,
          ngInit: ngInitDirective,
          ngNonBindable: ngNonBindableDirective,
          ngPluralize: ngPluralizeDirective,
          ngRepeat: ngRepeatDirective,
          ngShow: ngShowDirective,
          ngStyle: ngStyleDirective,
          ngSwitch: ngSwitchDirective,
          ngSwitchWhen: ngSwitchWhenDirective,
          ngSwitchDefault: ngSwitchDefaultDirective,
          ngOptions: ngOptionsDirective,
          ngTransclude: ngTranscludeDirective,
          ngModel: ngModelDirective,
          ngList: ngListDirective,
          ngChange: ngChangeDirective,
          pattern: patternDirective,
          ngPattern: patternDirective,
          required: requiredDirective,
          ngRequired: requiredDirective,
          minlength: minlengthDirective,
          ngMinlength: minlengthDirective,
          maxlength: maxlengthDirective,
          ngMaxlength: maxlengthDirective,
          ngValue: ngValueDirective,
          ngModelOptions: ngModelOptionsDirective
        }).directive({ngInclude: ngIncludeFillContentDirective}).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
        $provide.provider({
          $anchorScroll: $AnchorScrollProvider,
          $animate: $AnimateProvider,
          $animateCss: $CoreAnimateCssProvider,
          $$animateQueue: $$CoreAnimateQueueProvider,
          $$AnimateRunner: $$CoreAnimateRunnerProvider,
          $browser: $BrowserProvider,
          $cacheFactory: $CacheFactoryProvider,
          $controller: $ControllerProvider,
          $document: $DocumentProvider,
          $exceptionHandler: $ExceptionHandlerProvider,
          $filter: $FilterProvider,
          $$forceReflow: $$ForceReflowProvider,
          $interpolate: $InterpolateProvider,
          $interval: $IntervalProvider,
          $http: $HttpProvider,
          $httpParamSerializer: $HttpParamSerializerProvider,
          $httpParamSerializerJQLike: $HttpParamSerializerJQLikeProvider,
          $httpBackend: $HttpBackendProvider,
          $location: $LocationProvider,
          $log: $LogProvider,
          $parse: $ParseProvider,
          $rootScope: $RootScopeProvider,
          $q: $QProvider,
          $$q: $$QProvider,
          $sce: $SceProvider,
          $sceDelegate: $SceDelegateProvider,
          $sniffer: $SnifferProvider,
          $templateCache: $TemplateCacheProvider,
          $templateRequest: $TemplateRequestProvider,
          $$testability: $$TestabilityProvider,
          $timeout: $TimeoutProvider,
          $window: $WindowProvider,
          $$rAF: $$RAFProvider,
          $$jqLite: $$jqLiteProvider,
          $$HashMap: $$HashMapProvider,
          $$cookieReader: $$CookieReaderProvider
        });
      }]);
    }
    JQLite.expando = 'ng339';
    var jqCache = JQLite.cache = {},
        jqId = 1,
        addEventListenerFn = function(element, type, fn) {
          element.addEventListener(type, fn, false);
        },
        removeEventListenerFn = function(element, type, fn) {
          element.removeEventListener(type, fn, false);
        };
    JQLite._data = function(node) {
      return this.cache[node[this.expando]] || {};
    };
    function jqNextId() {
      return ++jqId;
    }
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    var MOUSE_EVENT_MAP = {
      mouseleave: "mouseout",
      mouseenter: "mouseover"
    };
    var jqLiteMinErr = minErr('jqLite');
    function camelCase(name) {
      return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    }
    var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var HTML_REGEXP = /<|&#?\w+;/;
    var TAG_NAME_REGEXP = /<([\w:]+)/;
    var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
    var wrapMap = {
      'option': [1, '<select multiple="multiple">', '</select>'],
      'thead': [1, '<table>', '</table>'],
      'col': [2, '<table><colgroup>', '</colgroup></table>'],
      'tr': [2, '<table><tbody>', '</tbody></table>'],
      'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
      '_default': [0, "", ""]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function jqLiteIsTextNode(html) {
      return !HTML_REGEXP.test(html);
    }
    function jqLiteAcceptsData(node) {
      var nodeType = node.nodeType;
      return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
    }
    function jqLiteHasData(node) {
      for (var key in jqCache[node.ng339]) {
        return true;
      }
      return false;
    }
    function jqLiteBuildFragment(html, context) {
      var tmp,
          tag,
          wrap,
          fragment = context.createDocumentFragment(),
          nodes = [],
          i;
      if (jqLiteIsTextNode(html)) {
        nodes.push(context.createTextNode(html));
      } else {
        tmp = tmp || fragment.appendChild(context.createElement("div"));
        tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
        wrap = wrapMap[tag] || wrapMap._default;
        tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2];
        i = wrap[0];
        while (i--) {
          tmp = tmp.lastChild;
        }
        nodes = concat(nodes, tmp.childNodes);
        tmp = fragment.firstChild;
        tmp.textContent = "";
      }
      fragment.textContent = "";
      fragment.innerHTML = "";
      forEach(nodes, function(node) {
        fragment.appendChild(node);
      });
      return fragment;
    }
    function jqLiteParseHTML(html, context) {
      context = context || document;
      var parsed;
      if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
        return [context.createElement(parsed[1])];
      }
      if ((parsed = jqLiteBuildFragment(html, context))) {
        return parsed.childNodes;
      }
      return [];
    }
    function JQLite(element) {
      if (element instanceof JQLite) {
        return element;
      }
      var argIsString;
      if (isString(element)) {
        element = trim(element);
        argIsString = true;
      }
      if (!(this instanceof JQLite)) {
        if (argIsString && element.charAt(0) != '<') {
          throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
        }
        return new JQLite(element);
      }
      if (argIsString) {
        jqLiteAddNodes(this, jqLiteParseHTML(element));
      } else {
        jqLiteAddNodes(this, element);
      }
    }
    function jqLiteClone(element) {
      return element.cloneNode(true);
    }
    function jqLiteDealoc(element, onlyDescendants) {
      if (!onlyDescendants)
        jqLiteRemoveData(element);
      if (element.querySelectorAll) {
        var descendants = element.querySelectorAll('*');
        for (var i = 0,
            l = descendants.length; i < l; i++) {
          jqLiteRemoveData(descendants[i]);
        }
      }
    }
    function jqLiteOff(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
      var expandoStore = jqLiteExpandoStore(element);
      var events = expandoStore && expandoStore.events;
      var handle = expandoStore && expandoStore.handle;
      if (!handle)
        return;
      if (!type) {
        for (type in events) {
          if (type !== '$destroy') {
            removeEventListenerFn(element, type, handle);
          }
          delete events[type];
        }
      } else {
        forEach(type.split(' '), function(type) {
          if (isDefined(fn)) {
            var listenerFns = events[type];
            arrayRemove(listenerFns || [], fn);
            if (listenerFns && listenerFns.length > 0) {
              return;
            }
          }
          removeEventListenerFn(element, type, handle);
          delete events[type];
        });
      }
    }
    function jqLiteRemoveData(element, name) {
      var expandoId = element.ng339;
      var expandoStore = expandoId && jqCache[expandoId];
      if (expandoStore) {
        if (name) {
          delete expandoStore.data[name];
          return;
        }
        if (expandoStore.handle) {
          if (expandoStore.events.$destroy) {
            expandoStore.handle({}, '$destroy');
          }
          jqLiteOff(element);
        }
        delete jqCache[expandoId];
        element.ng339 = undefined;
      }
    }
    function jqLiteExpandoStore(element, createIfNecessary) {
      var expandoId = element.ng339,
          expandoStore = expandoId && jqCache[expandoId];
      if (createIfNecessary && !expandoStore) {
        element.ng339 = expandoId = jqNextId();
        expandoStore = jqCache[expandoId] = {
          events: {},
          data: {},
          handle: undefined
        };
      }
      return expandoStore;
    }
    function jqLiteData(element, key, value) {
      if (jqLiteAcceptsData(element)) {
        var isSimpleSetter = isDefined(value);
        var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
        var massGetter = !key;
        var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
        var data = expandoStore && expandoStore.data;
        if (isSimpleSetter) {
          data[key] = value;
        } else {
          if (massGetter) {
            return data;
          } else {
            if (isSimpleGetter) {
              return data && data[key];
            } else {
              extend(data, key);
            }
          }
        }
      }
    }
    function jqLiteHasClass(element, selector) {
      if (!element.getAttribute)
        return false;
      return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1);
    }
    function jqLiteRemoveClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        forEach(cssClasses.split(' '), function(cssClass) {
          element.setAttribute('class', trim((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").replace(" " + trim(cssClass) + " ", " ")));
        });
      }
    }
    function jqLiteAddClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, " ");
        forEach(cssClasses.split(' '), function(cssClass) {
          cssClass = trim(cssClass);
          if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
            existingClasses += cssClass + ' ';
          }
        });
        element.setAttribute('class', trim(existingClasses));
      }
    }
    function jqLiteAddNodes(root, elements) {
      if (elements) {
        if (elements.nodeType) {
          root[root.length++] = elements;
        } else {
          var length = elements.length;
          if (typeof length === 'number' && elements.window !== elements) {
            if (length) {
              for (var i = 0; i < length; i++) {
                root[root.length++] = elements[i];
              }
            }
          } else {
            root[root.length++] = elements;
          }
        }
      }
    }
    function jqLiteController(element, name) {
      return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
    }
    function jqLiteInheritedData(element, name, value) {
      if (element.nodeType == NODE_TYPE_DOCUMENT) {
        element = element.documentElement;
      }
      var names = isArray(name) ? name : [name];
      while (element) {
        for (var i = 0,
            ii = names.length; i < ii; i++) {
          if ((value = jqLite.data(element, names[i])) !== undefined)
            return value;
        }
        element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
      }
    }
    function jqLiteEmpty(element) {
      jqLiteDealoc(element, true);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
    function jqLiteRemove(element, keepData) {
      if (!keepData)
        jqLiteDealoc(element);
      var parent = element.parentNode;
      if (parent)
        parent.removeChild(element);
    }
    function jqLiteDocumentLoaded(action, win) {
      win = win || window;
      if (win.document.readyState === 'complete') {
        win.setTimeout(action);
      } else {
        jqLite(win).on('load', action);
      }
    }
    var JQLitePrototype = JQLite.prototype = {
      ready: function(fn) {
        var fired = false;
        function trigger() {
          if (fired)
            return;
          fired = true;
          fn();
        }
        if (document.readyState === 'complete') {
          setTimeout(trigger);
        } else {
          this.on('DOMContentLoaded', trigger);
          JQLite(window).on('load', trigger);
        }
      },
      toString: function() {
        var value = [];
        forEach(this, function(e) {
          value.push('' + e);
        });
        return '[' + value.join(', ') + ']';
      },
      eq: function(index) {
        return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
      },
      length: 0,
      push: push,
      sort: [].sort,
      splice: [].splice
    };
    var BOOLEAN_ATTR = {};
    forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function(value) {
      BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    forEach('input,select,option,textarea,button,form,details'.split(','), function(value) {
      BOOLEAN_ELEMENTS[value] = true;
    });
    var ALIASED_ATTR = {
      'ngMinlength': 'minlength',
      'ngMaxlength': 'maxlength',
      'ngMin': 'min',
      'ngMax': 'max',
      'ngPattern': 'pattern'
    };
    function getBooleanAttrName(element, name) {
      var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
      return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
    }
    function getAliasedAttrName(element, name) {
      var nodeName = element.nodeName;
      return (nodeName === 'INPUT' || nodeName === 'TEXTAREA') && ALIASED_ATTR[name];
    }
    forEach({
      data: jqLiteData,
      removeData: jqLiteRemoveData,
      hasData: jqLiteHasData
    }, function(fn, name) {
      JQLite[name] = fn;
    });
    forEach({
      data: jqLiteData,
      inheritedData: jqLiteInheritedData,
      scope: function(element) {
        return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
      },
      isolateScope: function(element) {
        return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
      },
      controller: jqLiteController,
      injector: function(element) {
        return jqLiteInheritedData(element, '$injector');
      },
      removeAttr: function(element, name) {
        element.removeAttribute(name);
      },
      hasClass: jqLiteHasClass,
      css: function(element, name, value) {
        name = camelCase(name);
        if (isDefined(value)) {
          element.style[name] = value;
        } else {
          return element.style[name];
        }
      },
      attr: function(element, name, value) {
        var nodeType = element.nodeType;
        if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT) {
          return;
        }
        var lowercasedName = lowercase(name);
        if (BOOLEAN_ATTR[lowercasedName]) {
          if (isDefined(value)) {
            if (!!value) {
              element[name] = true;
              element.setAttribute(name, lowercasedName);
            } else {
              element[name] = false;
              element.removeAttribute(lowercasedName);
            }
          } else {
            return (element[name] || (element.attributes.getNamedItem(name) || noop).specified) ? lowercasedName : undefined;
          }
        } else if (isDefined(value)) {
          element.setAttribute(name, value);
        } else if (element.getAttribute) {
          var ret = element.getAttribute(name, 2);
          return ret === null ? undefined : ret;
        }
      },
      prop: function(element, name, value) {
        if (isDefined(value)) {
          element[name] = value;
        } else {
          return element[name];
        }
      },
      text: (function() {
        getText.$dv = '';
        return getText;
        function getText(element, value) {
          if (isUndefined(value)) {
            var nodeType = element.nodeType;
            return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
          }
          element.textContent = value;
        }
      })(),
      val: function(element, value) {
        if (isUndefined(value)) {
          if (element.multiple && nodeName_(element) === 'select') {
            var result = [];
            forEach(element.options, function(option) {
              if (option.selected) {
                result.push(option.value || option.text);
              }
            });
            return result.length === 0 ? null : result;
          }
          return element.value;
        }
        element.value = value;
      },
      html: function(element, value) {
        if (isUndefined(value)) {
          return element.innerHTML;
        }
        jqLiteDealoc(element, true);
        element.innerHTML = value;
      },
      empty: jqLiteEmpty
    }, function(fn, name) {
      JQLite.prototype[name] = function(arg1, arg2) {
        var i,
            key;
        var nodeCount = this.length;
        if (fn !== jqLiteEmpty && (((fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2) === undefined)) {
          if (isObject(arg1)) {
            for (i = 0; i < nodeCount; i++) {
              if (fn === jqLiteData) {
                fn(this[i], arg1);
              } else {
                for (key in arg1) {
                  fn(this[i], key, arg1[key]);
                }
              }
            }
            return this;
          } else {
            var value = fn.$dv;
            var jj = (value === undefined) ? Math.min(nodeCount, 1) : nodeCount;
            for (var j = 0; j < jj; j++) {
              var nodeValue = fn(this[j], arg1, arg2);
              value = value ? value + nodeValue : nodeValue;
            }
            return value;
          }
        } else {
          for (i = 0; i < nodeCount; i++) {
            fn(this[i], arg1, arg2);
          }
          return this;
        }
      };
    });
    function createEventHandler(element, events) {
      var eventHandler = function(event, type) {
        event.isDefaultPrevented = function() {
          return event.defaultPrevented;
        };
        var eventFns = events[type || event.type];
        var eventFnsLength = eventFns ? eventFns.length : 0;
        if (!eventFnsLength)
          return;
        if (isUndefined(event.immediatePropagationStopped)) {
          var originalStopImmediatePropagation = event.stopImmediatePropagation;
          event.stopImmediatePropagation = function() {
            event.immediatePropagationStopped = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            if (originalStopImmediatePropagation) {
              originalStopImmediatePropagation.call(event);
            }
          };
        }
        event.isImmediatePropagationStopped = function() {
          return event.immediatePropagationStopped === true;
        };
        if ((eventFnsLength > 1)) {
          eventFns = shallowCopy(eventFns);
        }
        for (var i = 0; i < eventFnsLength; i++) {
          if (!event.isImmediatePropagationStopped()) {
            eventFns[i].call(element, event);
          }
        }
      };
      eventHandler.elem = element;
      return eventHandler;
    }
    forEach({
      removeData: jqLiteRemoveData,
      on: function jqLiteOn(element, type, fn, unsupported) {
        if (isDefined(unsupported))
          throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
        if (!jqLiteAcceptsData(element)) {
          return;
        }
        var expandoStore = jqLiteExpandoStore(element, true);
        var events = expandoStore.events;
        var handle = expandoStore.handle;
        if (!handle) {
          handle = expandoStore.handle = createEventHandler(element, events);
        }
        var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
        var i = types.length;
        while (i--) {
          type = types[i];
          var eventFns = events[type];
          if (!eventFns) {
            events[type] = [];
            if (type === 'mouseenter' || type === 'mouseleave') {
              jqLiteOn(element, MOUSE_EVENT_MAP[type], function(event) {
                var target = this,
                    related = event.relatedTarget;
                if (!related || (related !== target && !target.contains(related))) {
                  handle(event, type);
                }
              });
            } else {
              if (type !== '$destroy') {
                addEventListenerFn(element, type, handle);
              }
            }
            eventFns = events[type];
          }
          eventFns.push(fn);
        }
      },
      off: jqLiteOff,
      one: function(element, type, fn) {
        element = jqLite(element);
        element.on(type, function onFn() {
          element.off(type, fn);
          element.off(type, onFn);
        });
        element.on(type, fn);
      },
      replaceWith: function(element, replaceNode) {
        var index,
            parent = element.parentNode;
        jqLiteDealoc(element);
        forEach(new JQLite(replaceNode), function(node) {
          if (index) {
            parent.insertBefore(node, index.nextSibling);
          } else {
            parent.replaceChild(node, element);
          }
          index = node;
        });
      },
      children: function(element) {
        var children = [];
        forEach(element.childNodes, function(element) {
          if (element.nodeType === NODE_TYPE_ELEMENT) {
            children.push(element);
          }
        });
        return children;
      },
      contents: function(element) {
        return element.contentDocument || element.childNodes || [];
      },
      append: function(element, node) {
        var nodeType = element.nodeType;
        if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT)
          return;
        node = new JQLite(node);
        for (var i = 0,
            ii = node.length; i < ii; i++) {
          var child = node[i];
          element.appendChild(child);
        }
      },
      prepend: function(element, node) {
        if (element.nodeType === NODE_TYPE_ELEMENT) {
          var index = element.firstChild;
          forEach(new JQLite(node), function(child) {
            element.insertBefore(child, index);
          });
        }
      },
      wrap: function(element, wrapNode) {
        wrapNode = jqLite(wrapNode).eq(0).clone()[0];
        var parent = element.parentNode;
        if (parent) {
          parent.replaceChild(wrapNode, element);
        }
        wrapNode.appendChild(element);
      },
      remove: jqLiteRemove,
      detach: function(element) {
        jqLiteRemove(element, true);
      },
      after: function(element, newElement) {
        var index = element,
            parent = element.parentNode;
        newElement = new JQLite(newElement);
        for (var i = 0,
            ii = newElement.length; i < ii; i++) {
          var node = newElement[i];
          parent.insertBefore(node, index.nextSibling);
          index = node;
        }
      },
      addClass: jqLiteAddClass,
      removeClass: jqLiteRemoveClass,
      toggleClass: function(element, selector, condition) {
        if (selector) {
          forEach(selector.split(' '), function(className) {
            var classCondition = condition;
            if (isUndefined(classCondition)) {
              classCondition = !jqLiteHasClass(element, className);
            }
            (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
          });
        }
      },
      parent: function(element) {
        var parent = element.parentNode;
        return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
      },
      next: function(element) {
        return element.nextElementSibling;
      },
      find: function(element, selector) {
        if (element.getElementsByTagName) {
          return element.getElementsByTagName(selector);
        } else {
          return [];
        }
      },
      clone: jqLiteClone,
      triggerHandler: function(element, event, extraParameters) {
        var dummyEvent,
            eventFnsCopy,
            handlerArgs;
        var eventName = event.type || event;
        var expandoStore = jqLiteExpandoStore(element);
        var events = expandoStore && expandoStore.events;
        var eventFns = events && events[eventName];
        if (eventFns) {
          dummyEvent = {
            preventDefault: function() {
              this.defaultPrevented = true;
            },
            isDefaultPrevented: function() {
              return this.defaultPrevented === true;
            },
            stopImmediatePropagation: function() {
              this.immediatePropagationStopped = true;
            },
            isImmediatePropagationStopped: function() {
              return this.immediatePropagationStopped === true;
            },
            stopPropagation: noop,
            type: eventName,
            target: element
          };
          if (event.type) {
            dummyEvent = extend(dummyEvent, event);
          }
          eventFnsCopy = shallowCopy(eventFns);
          handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];
          forEach(eventFnsCopy, function(fn) {
            if (!dummyEvent.isImmediatePropagationStopped()) {
              fn.apply(element, handlerArgs);
            }
          });
        }
      }
    }, function(fn, name) {
      JQLite.prototype[name] = function(arg1, arg2, arg3) {
        var value;
        for (var i = 0,
            ii = this.length; i < ii; i++) {
          if (isUndefined(value)) {
            value = fn(this[i], arg1, arg2, arg3);
            if (isDefined(value)) {
              value = jqLite(value);
            }
          } else {
            jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
          }
        }
        return isDefined(value) ? value : this;
      };
      JQLite.prototype.bind = JQLite.prototype.on;
      JQLite.prototype.unbind = JQLite.prototype.off;
    });
    function $$jqLiteProvider() {
      this.$get = function $$jqLite() {
        return extend(JQLite, {
          hasClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteHasClass(node, classes);
          },
          addClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteAddClass(node, classes);
          },
          removeClass: function(node, classes) {
            if (node.attr)
              node = node[0];
            return jqLiteRemoveClass(node, classes);
          }
        });
      };
    }
    function hashKey(obj, nextUidFn) {
      var key = obj && obj.$$hashKey;
      if (key) {
        if (typeof key === 'function') {
          key = obj.$$hashKey();
        }
        return key;
      }
      var objType = typeof obj;
      if (objType == 'function' || (objType == 'object' && obj !== null)) {
        key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
      } else {
        key = objType + ':' + obj;
      }
      return key;
    }
    function HashMap(array, isolatedUid) {
      if (isolatedUid) {
        var uid = 0;
        this.nextUid = function() {
          return ++uid;
        };
      }
      forEach(array, this.put, this);
    }
    HashMap.prototype = {
      put: function(key, value) {
        this[hashKey(key, this.nextUid)] = value;
      },
      get: function(key) {
        return this[hashKey(key, this.nextUid)];
      },
      remove: function(key) {
        var value = this[key = hashKey(key, this.nextUid)];
        delete this[key];
        return value;
      }
    };
    var $$HashMapProvider = [function() {
      this.$get = [function() {
        return HashMap;
      }];
    }];
    var FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var $injectorMinErr = minErr('$injector');
    function anonFn(fn) {
      var fnText = fn.toString().replace(STRIP_COMMENTS, ''),
          args = fnText.match(FN_ARGS);
      if (args) {
        return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
      }
      return 'fn';
    }
    function annotate(fn, strictDi, name) {
      var $inject,
          fnText,
          argDecl,
          last;
      if (typeof fn === 'function') {
        if (!($inject = fn.$inject)) {
          $inject = [];
          if (fn.length) {
            if (strictDi) {
              if (!isString(name) || !name) {
                name = fn.name || anonFn(fn);
              }
              throw $injectorMinErr('strictdi', '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
            }
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
              arg.replace(FN_ARG, function(all, underscore, name) {
                $inject.push(name);
              });
            });
          }
          fn.$inject = $inject;
        }
      } else if (isArray(fn)) {
        last = fn.length - 1;
        assertArgFn(fn[last], 'fn');
        $inject = fn.slice(0, last);
      } else {
        assertArgFn(fn, 'fn', true);
      }
      return $inject;
    }
    function createInjector(modulesToLoad, strictDi) {
      strictDi = (strictDi === true);
      var INSTANTIATING = {},
          providerSuffix = 'Provider',
          path = [],
          loadedModules = new HashMap([], true),
          providerCache = {$provide: {
              provider: supportObject(provider),
              factory: supportObject(factory),
              service: supportObject(service),
              value: supportObject(value),
              constant: supportObject(constant),
              decorator: decorator
            }},
          providerInjector = (providerCache.$injector = createInternalInjector(providerCache, function(serviceName, caller) {
            if (angular.isString(caller)) {
              path.push(caller);
            }
            throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
          })),
          instanceCache = {},
          instanceInjector = (instanceCache.$injector = createInternalInjector(instanceCache, function(serviceName, caller) {
            var provider = providerInjector.get(serviceName + providerSuffix, caller);
            return instanceInjector.invoke(provider.$get, provider, undefined, serviceName);
          }));
      forEach(loadModules(modulesToLoad), function(fn) {
        if (fn)
          instanceInjector.invoke(fn);
      });
      return instanceInjector;
      function supportObject(delegate) {
        return function(key, value) {
          if (isObject(key)) {
            forEach(key, reverseParams(delegate));
          } else {
            return delegate(key, value);
          }
        };
      }
      function provider(name, provider_) {
        assertNotHasOwnProperty(name, 'service');
        if (isFunction(provider_) || isArray(provider_)) {
          provider_ = providerInjector.instantiate(provider_);
        }
        if (!provider_.$get) {
          throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
        }
        return providerCache[name + providerSuffix] = provider_;
      }
      function enforceReturnValue(name, factory) {
        return function enforcedReturnValue() {
          var result = instanceInjector.invoke(factory, this);
          if (isUndefined(result)) {
            throw $injectorMinErr('undef', "Provider '{0}' must return a value from $get factory method.", name);
          }
          return result;
        };
      }
      function factory(name, factoryFn, enforce) {
        return provider(name, {$get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn});
      }
      function service(name, constructor) {
        return factory(name, ['$injector', function($injector) {
          return $injector.instantiate(constructor);
        }]);
      }
      function value(name, val) {
        return factory(name, valueFn(val), false);
      }
      function constant(name, value) {
        assertNotHasOwnProperty(name, 'constant');
        providerCache[name] = value;
        instanceCache[name] = value;
      }
      function decorator(serviceName, decorFn) {
        var origProvider = providerInjector.get(serviceName + providerSuffix),
            orig$get = origProvider.$get;
        origProvider.$get = function() {
          var origInstance = instanceInjector.invoke(orig$get, origProvider);
          return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
        };
      }
      function loadModules(modulesToLoad) {
        assertArg(isUndefined(modulesToLoad) || isArray(modulesToLoad), 'modulesToLoad', 'not an array');
        var runBlocks = [],
            moduleFn;
        forEach(modulesToLoad, function(module) {
          if (loadedModules.get(module))
            return;
          loadedModules.put(module, true);
          function runInvokeQueue(queue) {
            var i,
                ii;
            for (i = 0, ii = queue.length; i < ii; i++) {
              var invokeArgs = queue[i],
                  provider = providerInjector.get(invokeArgs[0]);
              provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }
          }
          try {
            if (isString(module)) {
              moduleFn = angularModule(module);
              runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
              runInvokeQueue(moduleFn._invokeQueue);
              runInvokeQueue(moduleFn._configBlocks);
            } else if (isFunction(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else if (isArray(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else {
              assertArgFn(module, 'module');
            }
          } catch (e) {
            if (isArray(module)) {
              module = module[module.length - 1];
            }
            if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
              e = e.message + '\n' + e.stack;
            }
            throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}", module, e.stack || e.message || e);
          }
        });
        return runBlocks;
      }
      function createInternalInjector(cache, factory) {
        function getService(serviceName, caller) {
          if (cache.hasOwnProperty(serviceName)) {
            if (cache[serviceName] === INSTANTIATING) {
              throw $injectorMinErr('cdep', 'Circular dependency found: {0}', serviceName + ' <- ' + path.join(' <- '));
            }
            return cache[serviceName];
          } else {
            try {
              path.unshift(serviceName);
              cache[serviceName] = INSTANTIATING;
              return cache[serviceName] = factory(serviceName, caller);
            } catch (err) {
              if (cache[serviceName] === INSTANTIATING) {
                delete cache[serviceName];
              }
              throw err;
            } finally {
              path.shift();
            }
          }
        }
        function invoke(fn, self, locals, serviceName) {
          if (typeof locals === 'string') {
            serviceName = locals;
            locals = null;
          }
          var args = [],
              $inject = createInjector.$$annotate(fn, strictDi, serviceName),
              length,
              i,
              key;
          for (i = 0, length = $inject.length; i < length; i++) {
            key = $inject[i];
            if (typeof key !== 'string') {
              throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
            }
            args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key, serviceName));
          }
          if (isArray(fn)) {
            fn = fn[length];
          }
          return fn.apply(self, args);
        }
        function instantiate(Type, locals, serviceName) {
          var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype || null);
          var returnedValue = invoke(Type, instance, locals, serviceName);
          return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
        }
        return {
          invoke: invoke,
          instantiate: instantiate,
          get: getService,
          annotate: createInjector.$$annotate,
          has: function(name) {
            return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
          }
        };
      }
    }
    createInjector.$$annotate = annotate;
    function $AnchorScrollProvider() {
      var autoScrollingEnabled = true;
      this.disableAutoScrolling = function() {
        autoScrollingEnabled = false;
      };
      this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
        var document = $window.document;
        function getFirstAnchor(list) {
          var result = null;
          Array.prototype.some.call(list, function(element) {
            if (nodeName_(element) === 'a') {
              result = element;
              return true;
            }
          });
          return result;
        }
        function getYOffset() {
          var offset = scroll.yOffset;
          if (isFunction(offset)) {
            offset = offset();
          } else if (isElement(offset)) {
            var elem = offset[0];
            var style = $window.getComputedStyle(elem);
            if (style.position !== 'fixed') {
              offset = 0;
            } else {
              offset = elem.getBoundingClientRect().bottom;
            }
          } else if (!isNumber(offset)) {
            offset = 0;
          }
          return offset;
        }
        function scrollTo(elem) {
          if (elem) {
            elem.scrollIntoView();
            var offset = getYOffset();
            if (offset) {
              var elemTop = elem.getBoundingClientRect().top;
              $window.scrollBy(0, elemTop - offset);
            }
          } else {
            $window.scrollTo(0, 0);
          }
        }
        function scroll(hash) {
          hash = isString(hash) ? hash : $location.hash();
          var elm;
          if (!hash)
            scrollTo(null);
          else if ((elm = document.getElementById(hash)))
            scrollTo(elm);
          else if ((elm = getFirstAnchor(document.getElementsByName(hash))))
            scrollTo(elm);
          else if (hash === 'top')
            scrollTo(null);
        }
        if (autoScrollingEnabled) {
          $rootScope.$watch(function autoScrollWatch() {
            return $location.hash();
          }, function autoScrollWatchAction(newVal, oldVal) {
            if (newVal === oldVal && newVal === '')
              return;
            jqLiteDocumentLoaded(function() {
              $rootScope.$evalAsync(scroll);
            });
          });
        }
        return scroll;
      }];
    }
    var $animateMinErr = minErr('$animate');
    var ELEMENT_NODE = 1;
    var NG_ANIMATE_CLASSNAME = 'ng-animate';
    function mergeClasses(a, b) {
      if (!a && !b)
        return '';
      if (!a)
        return b;
      if (!b)
        return a;
      if (isArray(a))
        a = a.join(' ');
      if (isArray(b))
        b = b.join(' ');
      return a + ' ' + b;
    }
    function extractElementNode(element) {
      for (var i = 0; i < element.length; i++) {
        var elm = element[i];
        if (elm.nodeType === ELEMENT_NODE) {
          return elm;
        }
      }
    }
    function splitClasses(classes) {
      if (isString(classes)) {
        classes = classes.split(' ');
      }
      var obj = createMap();
      forEach(classes, function(klass) {
        if (klass.length) {
          obj[klass] = true;
        }
      });
      return obj;
    }
    function prepareAnimateOptions(options) {
      return isObject(options) ? options : {};
    }
    var $$CoreAnimateRunnerProvider = function() {
      this.$get = ['$q', '$$rAF', function($q, $$rAF) {
        function AnimateRunner() {}
        AnimateRunner.all = noop;
        AnimateRunner.chain = noop;
        AnimateRunner.prototype = {
          end: noop,
          cancel: noop,
          resume: noop,
          pause: noop,
          complete: noop,
          then: function(pass, fail) {
            return $q(function(resolve) {
              $$rAF(function() {
                resolve();
              });
            }).then(pass, fail);
          }
        };
        return AnimateRunner;
      }];
    };
    var $$CoreAnimateQueueProvider = function() {
      var postDigestQueue = new HashMap();
      var postDigestElements = [];
      this.$get = ['$$AnimateRunner', '$rootScope', function($$AnimateRunner, $rootScope) {
        return {
          enabled: noop,
          on: noop,
          off: noop,
          pin: noop,
          push: function(element, event, options, domOperation) {
            domOperation && domOperation();
            options = options || {};
            options.from && element.css(options.from);
            options.to && element.css(options.to);
            if (options.addClass || options.removeClass) {
              addRemoveClassesPostDigest(element, options.addClass, options.removeClass);
            }
            return new $$AnimateRunner();
          }
        };
        function addRemoveClassesPostDigest(element, add, remove) {
          var classVal,
              data = postDigestQueue.get(element);
          if (!data) {
            postDigestQueue.put(element, data = {});
            postDigestElements.push(element);
          }
          var updateData = function(classes, value) {
            var changed = false;
            if (classes) {
              classes = isString(classes) ? classes.split(' ') : isArray(classes) ? classes : [];
              forEach(classes, function(className) {
                if (className) {
                  changed = true;
                  data[className] = value;
                }
              });
            }
            return changed;
          };
          var classesAdded = updateData(add, true);
          var classesRemoved = updateData(remove, false);
          if ((!classesAdded && !classesRemoved) || postDigestElements.length > 1)
            return;
          $rootScope.$$postDigest(function() {
            forEach(postDigestElements, function(element) {
              var data = postDigestQueue.get(element);
              if (data) {
                var existing = splitClasses(element.attr('class'));
                var toAdd = '';
                var toRemove = '';
                forEach(data, function(status, className) {
                  var hasClass = !!existing[className];
                  if (status !== hasClass) {
                    if (status) {
                      toAdd += (toAdd.length ? ' ' : '') + className;
                    } else {
                      toRemove += (toRemove.length ? ' ' : '') + className;
                    }
                  }
                });
                forEach(element, function(elm) {
                  toAdd && jqLiteAddClass(elm, toAdd);
                  toRemove && jqLiteRemoveClass(elm, toRemove);
                });
                postDigestQueue.remove(element);
              }
            });
            postDigestElements.length = 0;
          });
        }
      }];
    };
    var $AnimateProvider = ['$provide', function($provide) {
      var provider = this;
      this.$$registeredAnimations = Object.create(null);
      this.register = function(name, factory) {
        if (name && name.charAt(0) !== '.') {
          throw $animateMinErr('notcsel', "Expecting class selector starting with '.' got '{0}'.", name);
        }
        var key = name + '-animation';
        provider.$$registeredAnimations[name.substr(1)] = key;
        $provide.factory(key, factory);
      };
      this.classNameFilter = function(expression) {
        if (arguments.length === 1) {
          this.$$classNameFilter = (expression instanceof RegExp) ? expression : null;
          if (this.$$classNameFilter) {
            var reservedRegex = new RegExp("(\\s+|\\/)" + NG_ANIMATE_CLASSNAME + "(\\s+|\\/)");
            if (reservedRegex.test(this.$$classNameFilter.toString())) {
              throw $animateMinErr('nongcls', '$animateProvider.classNameFilter(regex) prohibits accepting a regex value which matches/contains the "{0}" CSS class.', NG_ANIMATE_CLASSNAME);
            }
          }
        }
        return this.$$classNameFilter;
      };
      this.$get = ['$$animateQueue', function($$animateQueue) {
        function domInsert(element, parentElement, afterElement) {
          if (afterElement) {
            var afterNode = extractElementNode(afterElement);
            if (afterNode && !afterNode.parentNode && !afterNode.previousElementSibling) {
              afterElement = null;
            }
          }
          afterElement ? afterElement.after(element) : parentElement.prepend(element);
        }
        return {
          on: $$animateQueue.on,
          off: $$animateQueue.off,
          pin: $$animateQueue.pin,
          enabled: $$animateQueue.enabled,
          cancel: function(runner) {
            runner.end && runner.end();
          },
          enter: function(element, parent, after, options) {
            parent = parent && jqLite(parent);
            after = after && jqLite(after);
            parent = parent || after.parent();
            domInsert(element, parent, after);
            return $$animateQueue.push(element, 'enter', prepareAnimateOptions(options));
          },
          move: function(element, parent, after, options) {
            parent = parent && jqLite(parent);
            after = after && jqLite(after);
            parent = parent || after.parent();
            domInsert(element, parent, after);
            return $$animateQueue.push(element, 'move', prepareAnimateOptions(options));
          },
          leave: function(element, options) {
            return $$animateQueue.push(element, 'leave', prepareAnimateOptions(options), function() {
              element.remove();
            });
          },
          addClass: function(element, className, options) {
            options = prepareAnimateOptions(options);
            options.addClass = mergeClasses(options.addclass, className);
            return $$animateQueue.push(element, 'addClass', options);
          },
          removeClass: function(element, className, options) {
            options = prepareAnimateOptions(options);
            options.removeClass = mergeClasses(options.removeClass, className);
            return $$animateQueue.push(element, 'removeClass', options);
          },
          setClass: function(element, add, remove, options) {
            options = prepareAnimateOptions(options);
            options.addClass = mergeClasses(options.addClass, add);
            options.removeClass = mergeClasses(options.removeClass, remove);
            return $$animateQueue.push(element, 'setClass', options);
          },
          animate: function(element, from, to, className, options) {
            options = prepareAnimateOptions(options);
            options.from = options.from ? extend(options.from, from) : from;
            options.to = options.to ? extend(options.to, to) : to;
            className = className || 'ng-inline-animate';
            options.tempClasses = mergeClasses(options.tempClasses, className);
            return $$animateQueue.push(element, 'animate', options);
          }
        };
      }];
    }];
    var $CoreAnimateCssProvider = function() {
      this.$get = ['$$rAF', '$q', function($$rAF, $q) {
        var RAFPromise = function() {};
        RAFPromise.prototype = {
          done: function(cancel) {
            this.defer && this.defer[cancel === true ? 'reject' : 'resolve']();
          },
          end: function() {
            this.done();
          },
          cancel: function() {
            this.done(true);
          },
          getPromise: function() {
            if (!this.defer) {
              this.defer = $q.defer();
            }
            return this.defer.promise;
          },
          then: function(f1, f2) {
            return this.getPromise().then(f1, f2);
          },
          'catch': function(f1) {
            return this.getPromise().catch(f1);
          },
          'finally': function(f1) {
            return this.getPromise().finally(f1);
          }
        };
        return function(element, options) {
          if (options.from) {
            element.css(options.from);
            options.from = null;
          }
          var closed,
              runner = new RAFPromise();
          return {
            start: run,
            end: run
          };
          function run() {
            $$rAF(function() {
              close();
              if (!closed) {
                runner.done();
              }
              closed = true;
            });
            return runner;
          }
          function close() {
            if (options.addClass) {
              element.addClass(options.addClass);
              options.addClass = null;
            }
            if (options.removeClass) {
              element.removeClass(options.removeClass);
              options.removeClass = null;
            }
            if (options.to) {
              element.css(options.to);
              options.to = null;
            }
          }
        };
      }];
    };
    function Browser(window, document, $log, $sniffer) {
      var self = this,
          rawDocument = document[0],
          location = window.location,
          history = window.history,
          setTimeout = window.setTimeout,
          clearTimeout = window.clearTimeout,
          pendingDeferIds = {};
      self.isMock = false;
      var outstandingRequestCount = 0;
      var outstandingRequestCallbacks = [];
      self.$$completeOutstandingRequest = completeOutstandingRequest;
      self.$$incOutstandingRequestCount = function() {
        outstandingRequestCount++;
      };
      function completeOutstandingRequest(fn) {
        try {
          fn.apply(null, sliceArgs(arguments, 1));
        } finally {
          outstandingRequestCount--;
          if (outstandingRequestCount === 0) {
            while (outstandingRequestCallbacks.length) {
              try {
                outstandingRequestCallbacks.pop()();
              } catch (e) {
                $log.error(e);
              }
            }
          }
        }
      }
      function getHash(url) {
        var index = url.indexOf('#');
        return index === -1 ? '' : url.substr(index);
      }
      self.notifyWhenNoOutstandingRequests = function(callback) {
        if (outstandingRequestCount === 0) {
          callback();
        } else {
          outstandingRequestCallbacks.push(callback);
        }
      };
      var cachedState,
          lastHistoryState,
          lastBrowserUrl = location.href,
          baseElement = document.find('base'),
          reloadLocation = null;
      cacheState();
      lastHistoryState = cachedState;
      self.url = function(url, replace, state) {
        if (isUndefined(state)) {
          state = null;
        }
        if (location !== window.location)
          location = window.location;
        if (history !== window.history)
          history = window.history;
        if (url) {
          var sameState = lastHistoryState === state;
          if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
            return self;
          }
          var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
          lastBrowserUrl = url;
          lastHistoryState = state;
          if ($sniffer.history && (!sameBase || !sameState)) {
            history[replace ? 'replaceState' : 'pushState'](state, '', url);
            cacheState();
            lastHistoryState = cachedState;
          } else {
            if (!sameBase || reloadLocation) {
              reloadLocation = url;
            }
            if (replace) {
              location.replace(url);
            } else if (!sameBase) {
              location.href = url;
            } else {
              location.hash = getHash(url);
            }
          }
          return self;
        } else {
          return reloadLocation || location.href.replace(/%27/g, "'");
        }
      };
      self.state = function() {
        return cachedState;
      };
      var urlChangeListeners = [],
          urlChangeInit = false;
      function cacheStateAndFireUrlChange() {
        cacheState();
        fireUrlChange();
      }
      function getCurrentState() {
        try {
          return history.state;
        } catch (e) {}
      }
      var lastCachedState = null;
      function cacheState() {
        cachedState = getCurrentState();
        cachedState = isUndefined(cachedState) ? null : cachedState;
        if (equals(cachedState, lastCachedState)) {
          cachedState = lastCachedState;
        }
        lastCachedState = cachedState;
      }
      function fireUrlChange() {
        if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
          return;
        }
        lastBrowserUrl = self.url();
        lastHistoryState = cachedState;
        forEach(urlChangeListeners, function(listener) {
          listener(self.url(), cachedState);
        });
      }
      self.onUrlChange = function(callback) {
        if (!urlChangeInit) {
          if ($sniffer.history)
            jqLite(window).on('popstate', cacheStateAndFireUrlChange);
          jqLite(window).on('hashchange', cacheStateAndFireUrlChange);
          urlChangeInit = true;
        }
        urlChangeListeners.push(callback);
        return callback;
      };
      self.$$applicationDestroyed = function() {
        jqLite(window).off('hashchange popstate', cacheStateAndFireUrlChange);
      };
      self.$$checkUrlChange = fireUrlChange;
      self.baseHref = function() {
        var href = baseElement.attr('href');
        return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
      };
      self.defer = function(fn, delay) {
        var timeoutId;
        outstandingRequestCount++;
        timeoutId = setTimeout(function() {
          delete pendingDeferIds[timeoutId];
          completeOutstandingRequest(fn);
        }, delay || 0);
        pendingDeferIds[timeoutId] = true;
        return timeoutId;
      };
      self.defer.cancel = function(deferId) {
        if (pendingDeferIds[deferId]) {
          delete pendingDeferIds[deferId];
          clearTimeout(deferId);
          completeOutstandingRequest(noop);
          return true;
        }
        return false;
      };
    }
    function $BrowserProvider() {
      this.$get = ['$window', '$log', '$sniffer', '$document', function($window, $log, $sniffer, $document) {
        return new Browser($window, $document, $log, $sniffer);
      }];
    }
    function $CacheFactoryProvider() {
      this.$get = function() {
        var caches = {};
        function cacheFactory(cacheId, options) {
          if (cacheId in caches) {
            throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
          }
          var size = 0,
              stats = extend({}, options, {id: cacheId}),
              data = {},
              capacity = (options && options.capacity) || Number.MAX_VALUE,
              lruHash = {},
              freshEnd = null,
              staleEnd = null;
          return caches[cacheId] = {
            put: function(key, value) {
              if (isUndefined(value))
                return;
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key] || (lruHash[key] = {key: key});
                refresh(lruEntry);
              }
              if (!(key in data))
                size++;
              data[key] = value;
              if (size > capacity) {
                this.remove(staleEnd.key);
              }
              return value;
            },
            get: function(key) {
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry)
                  return;
                refresh(lruEntry);
              }
              return data[key];
            },
            remove: function(key) {
              if (capacity < Number.MAX_VALUE) {
                var lruEntry = lruHash[key];
                if (!lruEntry)
                  return;
                if (lruEntry == freshEnd)
                  freshEnd = lruEntry.p;
                if (lruEntry == staleEnd)
                  staleEnd = lruEntry.n;
                link(lruEntry.n, lruEntry.p);
                delete lruHash[key];
              }
              delete data[key];
              size--;
            },
            removeAll: function() {
              data = {};
              size = 0;
              lruHash = {};
              freshEnd = staleEnd = null;
            },
            destroy: function() {
              data = null;
              stats = null;
              lruHash = null;
              delete caches[cacheId];
            },
            info: function() {
              return extend({}, stats, {size: size});
            }
          };
          function refresh(entry) {
            if (entry != freshEnd) {
              if (!staleEnd) {
                staleEnd = entry;
              } else if (staleEnd == entry) {
                staleEnd = entry.n;
              }
              link(entry.n, entry.p);
              link(entry, freshEnd);
              freshEnd = entry;
              freshEnd.n = null;
            }
          }
          function link(nextEntry, prevEntry) {
            if (nextEntry != prevEntry) {
              if (nextEntry)
                nextEntry.p = prevEntry;
              if (prevEntry)
                prevEntry.n = nextEntry;
            }
          }
        }
        cacheFactory.info = function() {
          var info = {};
          forEach(caches, function(cache, cacheId) {
            info[cacheId] = cache.info();
          });
          return info;
        };
        cacheFactory.get = function(cacheId) {
          return caches[cacheId];
        };
        return cacheFactory;
      };
    }
    function $TemplateCacheProvider() {
      this.$get = ['$cacheFactory', function($cacheFactory) {
        return $cacheFactory('templates');
      }];
    }
    var $compileMinErr = minErr('$compile');
    $CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];
    function $CompileProvider($provide, $$sanitizeUriProvider) {
      var hasDirectives = {},
          Suffix = 'Directive',
          COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
          CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/,
          ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'),
          REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;
      var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
      function parseIsolateBindings(scope, directiveName, isController) {
        var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/;
        var bindings = {};
        forEach(scope, function(definition, scopeName) {
          var match = definition.match(LOCAL_REGEXP);
          if (!match) {
            throw $compileMinErr('iscp', "Invalid {3} for directive '{0}'." + " Definition: {... {1}: '{2}' ...}", directiveName, scopeName, definition, (isController ? "controller bindings definition" : "isolate scope definition"));
          }
          bindings[scopeName] = {
            mode: match[1][0],
            collection: match[2] === '*',
            optional: match[3] === '?',
            attrName: match[4] || scopeName
          };
        });
        return bindings;
      }
      function parseDirectiveBindings(directive, directiveName) {
        var bindings = {
          isolateScope: null,
          bindToController: null
        };
        if (isObject(directive.scope)) {
          if (directive.bindToController === true) {
            bindings.bindToController = parseIsolateBindings(directive.scope, directiveName, true);
            bindings.isolateScope = {};
          } else {
            bindings.isolateScope = parseIsolateBindings(directive.scope, directiveName, false);
          }
        }
        if (isObject(directive.bindToController)) {
          bindings.bindToController = parseIsolateBindings(directive.bindToController, directiveName, true);
        }
        if (isObject(bindings.bindToController)) {
          var controller = directive.controller;
          var controllerAs = directive.controllerAs;
          if (!controller) {
            throw $compileMinErr('noctrl', "Cannot bind to controller without directive '{0}'s controller.", directiveName);
          } else if (!identifierForController(controller, controllerAs)) {
            throw $compileMinErr('noident', "Cannot bind to controller without identifier for directive '{0}'.", directiveName);
          }
        }
        return bindings;
      }
      function assertValidDirectiveName(name) {
        var letter = name.charAt(0);
        if (!letter || letter !== lowercase(letter)) {
          throw $compileMinErr('baddir', "Directive name '{0}' is invalid. The first character must be a lowercase letter", name);
        }
        if (name !== name.trim()) {
          throw $compileMinErr('baddir', "Directive name '{0}' is invalid. The name should not contain leading or trailing whitespaces", name);
        }
      }
      this.directive = function registerDirective(name, directiveFactory) {
        assertNotHasOwnProperty(name, 'directive');
        if (isString(name)) {
          assertValidDirectiveName(name);
          assertArg(directiveFactory, 'directiveFactory');
          if (!hasDirectives.hasOwnProperty(name)) {
            hasDirectives[name] = [];
            $provide.factory(name + Suffix, ['$injector', '$exceptionHandler', function($injector, $exceptionHandler) {
              var directives = [];
              forEach(hasDirectives[name], function(directiveFactory, index) {
                try {
                  var directive = $injector.invoke(directiveFactory);
                  if (isFunction(directive)) {
                    directive = {compile: valueFn(directive)};
                  } else if (!directive.compile && directive.link) {
                    directive.compile = valueFn(directive.link);
                  }
                  directive.priority = directive.priority || 0;
                  directive.index = index;
                  directive.name = directive.name || name;
                  directive.require = directive.require || (directive.controller && directive.name);
                  directive.restrict = directive.restrict || 'EA';
                  var bindings = directive.$$bindings = parseDirectiveBindings(directive, directive.name);
                  if (isObject(bindings.isolateScope)) {
                    directive.$$isolateBindings = bindings.isolateScope;
                  }
                  directive.$$moduleName = directiveFactory.$$moduleName;
                  directives.push(directive);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
              return directives;
            }]);
          }
          hasDirectives[name].push(directiveFactory);
        } else {
          forEach(name, reverseParams(registerDirective));
        }
        return this;
      };
      this.aHrefSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }
      };
      this.imgSrcSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }
      };
      var debugInfoEnabled = true;
      this.debugInfoEnabled = function(enabled) {
        if (isDefined(enabled)) {
          debugInfoEnabled = enabled;
          return this;
        }
        return debugInfoEnabled;
      };
      this.$get = ['$injector', '$interpolate', '$exceptionHandler', '$templateRequest', '$parse', '$controller', '$rootScope', '$document', '$sce', '$animate', '$$sanitizeUri', function($injector, $interpolate, $exceptionHandler, $templateRequest, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
        var Attributes = function(element, attributesToCopy) {
          if (attributesToCopy) {
            var keys = Object.keys(attributesToCopy);
            var i,
                l,
                key;
            for (i = 0, l = keys.length; i < l; i++) {
              key = keys[i];
              this[key] = attributesToCopy[key];
            }
          } else {
            this.$attr = {};
          }
          this.$$element = element;
        };
        Attributes.prototype = {
          $normalize: directiveNormalize,
          $addClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.addClass(this.$$element, classVal);
            }
          },
          $removeClass: function(classVal) {
            if (classVal && classVal.length > 0) {
              $animate.removeClass(this.$$element, classVal);
            }
          },
          $updateClass: function(newClasses, oldClasses) {
            var toAdd = tokenDifference(newClasses, oldClasses);
            if (toAdd && toAdd.length) {
              $animate.addClass(this.$$element, toAdd);
            }
            var toRemove = tokenDifference(oldClasses, newClasses);
            if (toRemove && toRemove.length) {
              $animate.removeClass(this.$$element, toRemove);
            }
          },
          $set: function(key, value, writeAttr, attrName) {
            var node = this.$$element[0],
                booleanKey = getBooleanAttrName(node, key),
                aliasedKey = getAliasedAttrName(node, key),
                observer = key,
                nodeName;
            if (booleanKey) {
              this.$$element.prop(key, value);
              attrName = booleanKey;
            } else if (aliasedKey) {
              this[aliasedKey] = value;
              observer = aliasedKey;
            }
            this[key] = value;
            if (attrName) {
              this.$attr[key] = attrName;
            } else {
              attrName = this.$attr[key];
              if (!attrName) {
                this.$attr[key] = attrName = snake_case(key, '-');
              }
            }
            nodeName = nodeName_(this.$$element);
            if ((nodeName === 'a' && key === 'href') || (nodeName === 'img' && key === 'src')) {
              this[key] = value = $$sanitizeUri(value, key === 'src');
            } else if (nodeName === 'img' && key === 'srcset') {
              var result = "";
              var trimmedSrcset = trim(value);
              var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
              var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
              var rawUris = trimmedSrcset.split(pattern);
              var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
              for (var i = 0; i < nbrUrisWith2parts; i++) {
                var innerIdx = i * 2;
                result += $$sanitizeUri(trim(rawUris[innerIdx]), true);
                result += (" " + trim(rawUris[innerIdx + 1]));
              }
              var lastTuple = trim(rawUris[i * 2]).split(/\s/);
              result += $$sanitizeUri(trim(lastTuple[0]), true);
              if (lastTuple.length === 2) {
                result += (" " + trim(lastTuple[1]));
              }
              this[key] = value = result;
            }
            if (writeAttr !== false) {
              if (value === null || value === undefined) {
                this.$$element.removeAttr(attrName);
              } else {
                this.$$element.attr(attrName, value);
              }
            }
            var $$observers = this.$$observers;
            $$observers && forEach($$observers[observer], function(fn) {
              try {
                fn(value);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
          },
          $observe: function(key, fn) {
            var attrs = this,
                $$observers = (attrs.$$observers || (attrs.$$observers = createMap())),
                listeners = ($$observers[key] || ($$observers[key] = []));
            listeners.push(fn);
            $rootScope.$evalAsync(function() {
              if (!listeners.$$inter && attrs.hasOwnProperty(key) && !isUndefined(attrs[key])) {
                fn(attrs[key]);
              }
            });
            return function() {
              arrayRemove(listeners, fn);
            };
          }
        };
        function safeAddClass($element, className) {
          try {
            $element.addClass(className);
          } catch (e) {}
        }
        var startSymbol = $interpolate.startSymbol(),
            endSymbol = $interpolate.endSymbol(),
            denormalizeTemplate = (startSymbol == '{{' || endSymbol == '}}') ? identity : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
            },
            NG_ATTR_BINDING = /^ngAttr[A-Z]/;
        compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
          var bindings = $element.data('$binding') || [];
          if (isArray(binding)) {
            bindings = bindings.concat(binding);
          } else {
            bindings.push(binding);
          }
          $element.data('$binding', bindings);
        } : noop;
        compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
          safeAddClass($element, 'ng-binding');
        } : noop;
        compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
          var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
          $element.data(dataName, scope);
        } : noop;
        compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
          safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
        } : noop;
        return compile;
        function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
          if (!($compileNodes instanceof jqLite)) {
            $compileNodes = jqLite($compileNodes);
          }
          forEach($compileNodes, function(node, index) {
            if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/)) {
              $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];
            }
          });
          var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
          compile.$$addScopeClass($compileNodes);
          var namespace = null;
          return function publicLinkFn(scope, cloneConnectFn, options) {
            assertArg(scope, 'scope');
            options = options || {};
            var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
                transcludeControllers = options.transcludeControllers,
                futureParentElement = options.futureParentElement;
            if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
              parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
            }
            if (!namespace) {
              namespace = detectNamespaceForChildElements(futureParentElement);
            }
            var $linkNode;
            if (namespace !== 'html') {
              $linkNode = jqLite(wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html()));
            } else if (cloneConnectFn) {
              $linkNode = JQLitePrototype.clone.call($compileNodes);
            } else {
              $linkNode = $compileNodes;
            }
            if (transcludeControllers) {
              for (var controllerName in transcludeControllers) {
                $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
              }
            }
            compile.$$addScopeInfo($linkNode, scope);
            if (cloneConnectFn)
              cloneConnectFn($linkNode, scope);
            if (compositeLinkFn)
              compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
            return $linkNode;
          };
        }
        function detectNamespaceForChildElements(parentElement) {
          var node = parentElement && parentElement[0];
          if (!node) {
            return 'html';
          } else {
            return nodeName_(node) !== 'foreignobject' && node.toString().match(/SVG/) ? 'svg' : 'html';
          }
        }
        function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
          var linkFns = [],
              attrs,
              directives,
              nodeLinkFn,
              childNodes,
              childLinkFn,
              linkFnFound,
              nodeLinkFnFound;
          for (var i = 0; i < nodeList.length; i++) {
            attrs = new Attributes();
            directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
            nodeLinkFn = (directives.length) ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
            if (nodeLinkFn && nodeLinkFn.scope) {
              compile.$$addScopeClass(attrs.$$element);
            }
            childLinkFn = (nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length) ? null : compileNodes(childNodes, nodeLinkFn ? ((nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement) && nodeLinkFn.transclude) : transcludeFn);
            if (nodeLinkFn || childLinkFn) {
              linkFns.push(i, nodeLinkFn, childLinkFn);
              linkFnFound = true;
              nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
            }
            previousCompileContext = null;
          }
          return linkFnFound ? compositeLinkFn : null;
          function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
            var nodeLinkFn,
                childLinkFn,
                node,
                childScope,
                i,
                ii,
                idx,
                childBoundTranscludeFn;
            var stableNodeList;
            if (nodeLinkFnFound) {
              var nodeListLength = nodeList.length;
              stableNodeList = new Array(nodeListLength);
              for (i = 0; i < linkFns.length; i += 3) {
                idx = linkFns[i];
                stableNodeList[idx] = nodeList[idx];
              }
            } else {
              stableNodeList = nodeList;
            }
            for (i = 0, ii = linkFns.length; i < ii; ) {
              node = stableNodeList[linkFns[i++]];
              nodeLinkFn = linkFns[i++];
              childLinkFn = linkFns[i++];
              if (nodeLinkFn) {
                if (nodeLinkFn.scope) {
                  childScope = scope.$new();
                  compile.$$addScopeInfo(jqLite(node), childScope);
                  var destroyBindings = nodeLinkFn.$$destroyBindings;
                  if (destroyBindings) {
                    nodeLinkFn.$$destroyBindings = null;
                    childScope.$on('$destroyed', destroyBindings);
                  }
                } else {
                  childScope = scope;
                }
                if (nodeLinkFn.transcludeOnThisElement) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, nodeLinkFn.transclude, parentBoundTranscludeFn);
                } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
                  childBoundTranscludeFn = parentBoundTranscludeFn;
                } else if (!parentBoundTranscludeFn && transcludeFn) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);
                } else {
                  childBoundTranscludeFn = null;
                }
                nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn, nodeLinkFn);
              } else if (childLinkFn) {
                childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
              }
            }
          }
        }
        function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn) {
          var boundTranscludeFn = function(transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
            if (!transcludedScope) {
              transcludedScope = scope.$new(false, containingScope);
              transcludedScope.$$transcluded = true;
            }
            return transcludeFn(transcludedScope, cloneFn, {
              parentBoundTranscludeFn: previousBoundTranscludeFn,
              transcludeControllers: controllers,
              futureParentElement: futureParentElement
            });
          };
          return boundTranscludeFn;
        }
        function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
          var nodeType = node.nodeType,
              attrsMap = attrs.$attr,
              match,
              className;
          switch (nodeType) {
            case NODE_TYPE_ELEMENT:
              addDirective(directives, directiveNormalize(nodeName_(node)), 'E', maxPriority, ignoreDirective);
              for (var attr,
                  name,
                  nName,
                  ngAttrName,
                  value,
                  isNgAttr,
                  nAttrs = node.attributes,
                  j = 0,
                  jj = nAttrs && nAttrs.length; j < jj; j++) {
                var attrStartName = false;
                var attrEndName = false;
                attr = nAttrs[j];
                name = attr.name;
                value = trim(attr.value);
                ngAttrName = directiveNormalize(name);
                if (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) {
                  name = name.replace(PREFIX_REGEXP, '').substr(8).replace(/_(.)/g, function(match, letter) {
                    return letter.toUpperCase();
                  });
                }
                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                if (directiveIsMultiElement(directiveNName)) {
                  if (ngAttrName === directiveNName + 'Start') {
                    attrStartName = name;
                    attrEndName = name.substr(0, name.length - 5) + 'end';
                    name = name.substr(0, name.length - 6);
                  }
                }
                nName = directiveNormalize(name.toLowerCase());
                attrsMap[nName] = name;
                if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                  attrs[nName] = value;
                  if (getBooleanAttrName(node, nName)) {
                    attrs[nName] = true;
                  }
                }
                addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
              }
              className = node.className;
              if (isObject(className)) {
                className = className.animVal;
              }
              if (isString(className) && className !== '') {
                while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                  nName = directiveNormalize(match[2]);
                  if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[3]);
                  }
                  className = className.substr(match.index + match[0].length);
                }
              }
              break;
            case NODE_TYPE_TEXT:
              if (msie === 11) {
                while (node.parentNode && node.nextSibling && node.nextSibling.nodeType === NODE_TYPE_TEXT) {
                  node.nodeValue = node.nodeValue + node.nextSibling.nodeValue;
                  node.parentNode.removeChild(node.nextSibling);
                }
              }
              addTextInterpolateDirective(directives, node.nodeValue);
              break;
            case NODE_TYPE_COMMENT:
              try {
                match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
                if (match) {
                  nName = directiveNormalize(match[1]);
                  if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[2]);
                  }
                }
              } catch (e) {}
              break;
          }
          directives.sort(byPriority);
          return directives;
        }
        function groupScan(node, attrStart, attrEnd) {
          var nodes = [];
          var depth = 0;
          if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
            do {
              if (!node) {
                throw $compileMinErr('uterdir', "Unterminated attribute, found '{0}' but no matching '{1}' found.", attrStart, attrEnd);
              }
              if (node.nodeType == NODE_TYPE_ELEMENT) {
                if (node.hasAttribute(attrStart))
                  depth++;
                if (node.hasAttribute(attrEnd))
                  depth--;
              }
              nodes.push(node);
              node = node.nextSibling;
            } while (depth > 0);
          } else {
            nodes.push(node);
          }
          return jqLite(nodes);
        }
        function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
          return function(scope, element, attrs, controllers, transcludeFn) {
            element = groupScan(element[0], attrStart, attrEnd);
            return linkFn(scope, element, attrs, controllers, transcludeFn);
          };
        }
        function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
          previousCompileContext = previousCompileContext || {};
          var terminalPriority = -Number.MAX_VALUE,
              newScopeDirective = previousCompileContext.newScopeDirective,
              controllerDirectives = previousCompileContext.controllerDirectives,
              newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
              templateDirective = previousCompileContext.templateDirective,
              nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
              hasTranscludeDirective = false,
              hasTemplate = false,
              hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
              $compileNode = templateAttrs.$$element = jqLite(compileNode),
              directive,
              directiveName,
              $template,
              replaceDirective = originalReplaceDirective,
              childTranscludeFn = transcludeFn,
              linkFn,
              directiveValue;
          for (var i = 0,
              ii = directives.length; i < ii; i++) {
            directive = directives[i];
            var attrStart = directive.$$start;
            var attrEnd = directive.$$end;
            if (attrStart) {
              $compileNode = groupScan(compileNode, attrStart, attrEnd);
            }
            $template = undefined;
            if (terminalPriority > directive.priority) {
              break;
            }
            if (directiveValue = directive.scope) {
              if (!directive.templateUrl) {
                if (isObject(directiveValue)) {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective, directive, $compileNode);
                  newIsolateScopeDirective = directive;
                } else {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                }
              }
              newScopeDirective = newScopeDirective || directive;
            }
            directiveName = directive.name;
            if (!directive.templateUrl && directive.controller) {
              directiveValue = directive.controller;
              controllerDirectives = controllerDirectives || createMap();
              assertNoDuplicate("'" + directiveName + "' controller", controllerDirectives[directiveName], directive, $compileNode);
              controllerDirectives[directiveName] = directive;
            }
            if (directiveValue = directive.transclude) {
              hasTranscludeDirective = true;
              if (!directive.$$tlb) {
                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                nonTlbTranscludeDirective = directive;
              }
              if (directiveValue == 'element') {
                hasElementTranscludeDirective = true;
                terminalPriority = directive.priority;
                $template = $compileNode;
                $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                compileNode = $compileNode[0];
                replaceWith(jqCollection, sliceArgs($template), compileNode);
                childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, {nonTlbTranscludeDirective: nonTlbTranscludeDirective});
              } else {
                $template = jqLite(jqLiteClone(compileNode)).contents();
                $compileNode.empty();
                childTranscludeFn = compile($template, transcludeFn);
              }
            }
            if (directive.template) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              directiveValue = (isFunction(directive.template)) ? directive.template($compileNode, templateAttrs) : directive.template;
              directiveValue = denormalizeTemplate(directiveValue);
              if (directive.replace) {
                replaceDirective = directive;
                if (jqLiteIsTextNode(directiveValue)) {
                  $template = [];
                } else {
                  $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
                }
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                  throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}", directiveName, '');
                }
                replaceWith(jqCollection, $compileNode, compileNode);
                var newTemplateAttrs = {$attr: {}};
                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                if (newIsolateScopeDirective) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                ii = directives.length;
              } else {
                $compileNode.html(directiveValue);
              }
            }
            if (directive.templateUrl) {
              hasTemplate = true;
              assertNoDuplicate('template', templateDirective, directive, $compileNode);
              templateDirective = directive;
              if (directive.replace) {
                replaceDirective = directive;
              }
              nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                controllerDirectives: controllerDirectives,
                newScopeDirective: (newScopeDirective !== directive) && newScopeDirective,
                newIsolateScopeDirective: newIsolateScopeDirective,
                templateDirective: templateDirective,
                nonTlbTranscludeDirective: nonTlbTranscludeDirective
              });
              ii = directives.length;
            } else if (directive.compile) {
              try {
                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                if (isFunction(linkFn)) {
                  addLinkFns(null, linkFn, attrStart, attrEnd);
                } else if (linkFn) {
                  addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                }
              } catch (e) {
                $exceptionHandler(e, startingTag($compileNode));
              }
            }
            if (directive.terminal) {
              nodeLinkFn.terminal = true;
              terminalPriority = Math.max(terminalPriority, directive.priority);
            }
          }
          nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
          nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
          nodeLinkFn.templateOnThisElement = hasTemplate;
          nodeLinkFn.transclude = childTranscludeFn;
          previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
          return nodeLinkFn;
          function addLinkFns(pre, post, attrStart, attrEnd) {
            if (pre) {
              if (attrStart)
                pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
              pre.require = directive.require;
              pre.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                pre = cloneAndAnnotateFn(pre, {isolateScope: true});
              }
              preLinkFns.push(pre);
            }
            if (post) {
              if (attrStart)
                post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
              post.require = directive.require;
              post.directiveName = directiveName;
              if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                post = cloneAndAnnotateFn(post, {isolateScope: true});
              }
              postLinkFns.push(post);
            }
          }
          function getControllers(directiveName, require, $element, elementControllers) {
            var value;
            if (isString(require)) {
              var match = require.match(REQUIRE_PREFIX_REGEXP);
              var name = require.substring(match[0].length);
              var inheritType = match[1] || match[3];
              var optional = match[2] === '?';
              if (inheritType === '^^') {
                $element = $element.parent();
              } else {
                value = elementControllers && elementControllers[name];
                value = value && value.instance;
              }
              if (!value) {
                var dataName = '$' + name + 'Controller';
                value = inheritType ? $element.inheritedData(dataName) : $element.data(dataName);
              }
              if (!value && !optional) {
                throw $compileMinErr('ctreq', "Controller '{0}', required by directive '{1}', can't be found!", name, directiveName);
              }
            } else if (isArray(require)) {
              value = [];
              for (var i = 0,
                  ii = require.length; i < ii; i++) {
                value[i] = getControllers(directiveName, require[i], $element, elementControllers);
              }
            }
            return value || null;
          }
          function setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope) {
            var elementControllers = createMap();
            for (var controllerKey in controllerDirectives) {
              var directive = controllerDirectives[controllerKey];
              var locals = {
                $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                $element: $element,
                $attrs: attrs,
                $transclude: transcludeFn
              };
              var controller = directive.controller;
              if (controller == '@') {
                controller = attrs[directive.name];
              }
              var controllerInstance = $controller(controller, locals, true, directive.controllerAs);
              elementControllers[directive.name] = controllerInstance;
              if (!hasElementTranscludeDirective) {
                $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
              }
            }
            return elementControllers;
          }
          function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn, thisLinkFn) {
            var i,
                ii,
                linkFn,
                controller,
                isolateScope,
                elementControllers,
                transcludeFn,
                $element,
                attrs;
            if (compileNode === linkNode) {
              attrs = templateAttrs;
              $element = templateAttrs.$$element;
            } else {
              $element = jqLite(linkNode);
              attrs = new Attributes($element, templateAttrs);
            }
            if (newIsolateScopeDirective) {
              isolateScope = scope.$new(true);
            }
            if (boundTranscludeFn) {
              transcludeFn = controllersBoundTransclude;
              transcludeFn.$$boundTransclude = boundTranscludeFn;
            }
            if (controllerDirectives) {
              elementControllers = setupControllers($element, attrs, transcludeFn, controllerDirectives, isolateScope, scope);
            }
            if (newIsolateScopeDirective) {
              compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective || templateDirective === newIsolateScopeDirective.$$originalDirective)));
              compile.$$addScopeClass($element, true);
              isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings;
              initializeDirectiveBindings(scope, attrs, isolateScope, isolateScope.$$isolateBindings, newIsolateScopeDirective, isolateScope);
            }
            if (elementControllers) {
              var scopeDirective = newIsolateScopeDirective || newScopeDirective;
              var bindings;
              var controllerForBindings;
              if (scopeDirective && elementControllers[scopeDirective.name]) {
                bindings = scopeDirective.$$bindings.bindToController;
                controller = elementControllers[scopeDirective.name];
                if (controller && controller.identifier && bindings) {
                  controllerForBindings = controller;
                  thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controller.instance, bindings, scopeDirective);
                }
              }
              for (i in elementControllers) {
                controller = elementControllers[i];
                var controllerResult = controller();
                if (controllerResult !== controller.instance) {
                  controller.instance = controllerResult;
                  $element.data('$' + i + 'Controller', controllerResult);
                  if (controller === controllerForBindings) {
                    thisLinkFn.$$destroyBindings();
                    thisLinkFn.$$destroyBindings = initializeDirectiveBindings(scope, attrs, controllerResult, bindings, scopeDirective);
                  }
                }
              }
            }
            for (i = 0, ii = preLinkFns.length; i < ii; i++) {
              linkFn = preLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            var scopeToChild = scope;
            if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
              scopeToChild = isolateScope;
            }
            childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
            for (i = postLinkFns.length - 1; i >= 0; i--) {
              linkFn = postLinkFns[i];
              invokeLinkFn(linkFn, linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers), transcludeFn);
            }
            function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
              var transcludeControllers;
              if (!isScope(scope)) {
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope;
                scope = undefined;
              }
              if (hasElementTranscludeDirective) {
                transcludeControllers = elementControllers;
              }
              if (!futureParentElement) {
                futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
              }
              return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
            }
          }
        }
        function markDirectivesAsIsolate(directives) {
          for (var j = 0,
              jj = directives.length; j < jj; j++) {
            directives[j] = inherit(directives[j], {$$isolateScope: true});
          }
        }
        function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
          if (name === ignoreDirective)
            return null;
          var match = null;
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive,
                directives = $injector.get(name + Suffix),
                i = 0,
                ii = directives.length; i < ii; i++) {
              try {
                directive = directives[i];
                if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                  if (startAttrName) {
                    directive = inherit(directive, {
                      $$start: startAttrName,
                      $$end: endAttrName
                    });
                  }
                  tDirectives.push(directive);
                  match = directive;
                }
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          }
          return match;
        }
        function directiveIsMultiElement(name) {
          if (hasDirectives.hasOwnProperty(name)) {
            for (var directive,
                directives = $injector.get(name + Suffix),
                i = 0,
                ii = directives.length; i < ii; i++) {
              directive = directives[i];
              if (directive.multiElement) {
                return true;
              }
            }
          }
          return false;
        }
        function mergeTemplateAttributes(dst, src) {
          var srcAttr = src.$attr,
              dstAttr = dst.$attr,
              $element = dst.$$element;
          forEach(dst, function(value, key) {
            if (key.charAt(0) != '$') {
              if (src[key] && src[key] !== value) {
                value += (key === 'style' ? ';' : ' ') + src[key];
              }
              dst.$set(key, value, true, srcAttr[key]);
            }
          });
          forEach(src, function(value, key) {
            if (key == 'class') {
              safeAddClass($element, value);
              dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
            } else if (key == 'style') {
              $element.attr('style', $element.attr('style') + ';' + value);
              dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
            } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
              dst[key] = value;
              dstAttr[key] = srcAttr[key];
            }
          });
        }
        function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
          var linkQueue = [],
              afterTemplateNodeLinkFn,
              afterTemplateChildLinkFn,
              beforeTemplateCompileNode = $compileNode[0],
              origAsyncDirective = directives.shift(),
              derivedSyncDirective = inherit(origAsyncDirective, {
                templateUrl: null,
                transclude: null,
                replace: null,
                $$originalDirective: origAsyncDirective
              }),
              templateUrl = (isFunction(origAsyncDirective.templateUrl)) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl,
              templateNamespace = origAsyncDirective.templateNamespace;
          $compileNode.empty();
          $templateRequest(templateUrl).then(function(content) {
            var compileNode,
                tempTemplateAttrs,
                $template,
                childBoundTranscludeFn;
            content = denormalizeTemplate(content);
            if (origAsyncDirective.replace) {
              if (jqLiteIsTextNode(content)) {
                $template = [];
              } else {
                $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
              }
              compileNode = $template[0];
              if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                throw $compileMinErr('tplrt', "Template for directive '{0}' must have exactly one root element. {1}", origAsyncDirective.name, templateUrl);
              }
              tempTemplateAttrs = {$attr: {}};
              replaceWith($rootElement, $compileNode, compileNode);
              var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
              if (isObject(origAsyncDirective.scope)) {
                markDirectivesAsIsolate(templateDirectives);
              }
              directives = templateDirectives.concat(directives);
              mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
            } else {
              compileNode = beforeTemplateCompileNode;
              $compileNode.html(content);
            }
            directives.unshift(derivedSyncDirective);
            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
            forEach($rootElement, function(node, i) {
              if (node == compileNode) {
                $rootElement[i] = $compileNode[0];
              }
            });
            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
            while (linkQueue.length) {
              var scope = linkQueue.shift(),
                  beforeTemplateLinkNode = linkQueue.shift(),
                  linkRootElement = linkQueue.shift(),
                  boundTranscludeFn = linkQueue.shift(),
                  linkNode = $compileNode[0];
              if (scope.$$destroyed)
                continue;
              if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                var oldClasses = beforeTemplateLinkNode.className;
                if (!(previousCompileContext.hasElementTranscludeDirective && origAsyncDirective.replace)) {
                  linkNode = jqLiteClone(compileNode);
                }
                replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                safeAddClass(jqLite(linkNode), oldClasses);
              }
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              } else {
                childBoundTranscludeFn = boundTranscludeFn;
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn);
            }
            linkQueue = null;
          });
          return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
            var childBoundTranscludeFn = boundTranscludeFn;
            if (scope.$$destroyed)
              return;
            if (linkQueue) {
              linkQueue.push(scope, node, rootElement, childBoundTranscludeFn);
            } else {
              if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
              }
              afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn, afterTemplateNodeLinkFn);
            }
          };
        }
        function byPriority(a, b) {
          var diff = b.priority - a.priority;
          if (diff !== 0)
            return diff;
          if (a.name !== b.name)
            return (a.name < b.name) ? -1 : 1;
          return a.index - b.index;
        }
        function assertNoDuplicate(what, previousDirective, directive, element) {
          function wrapModuleNameIfDefined(moduleName) {
            return moduleName ? (' (module: ' + moduleName + ')') : '';
          }
          if (previousDirective) {
            throw $compileMinErr('multidir', 'Multiple directives [{0}{1}, {2}{3}] asking for {4} on: {5}', previousDirective.name, wrapModuleNameIfDefined(previousDirective.$$moduleName), directive.name, wrapModuleNameIfDefined(directive.$$moduleName), what, startingTag(element));
          }
        }
        function addTextInterpolateDirective(directives, text) {
          var interpolateFn = $interpolate(text, true);
          if (interpolateFn) {
            directives.push({
              priority: 0,
              compile: function textInterpolateCompileFn(templateNode) {
                var templateNodeParent = templateNode.parent(),
                    hasCompileParent = !!templateNodeParent.length;
                if (hasCompileParent)
                  compile.$$addBindingClass(templateNodeParent);
                return function textInterpolateLinkFn(scope, node) {
                  var parent = node.parent();
                  if (!hasCompileParent)
                    compile.$$addBindingClass(parent);
                  compile.$$addBindingInfo(parent, interpolateFn.expressions);
                  scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                    node[0].nodeValue = value;
                  });
                };
              }
            });
          }
        }
        function wrapTemplate(type, template) {
          type = lowercase(type || 'html');
          switch (type) {
            case 'svg':
            case 'math':
              var wrapper = document.createElement('div');
              wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
              return wrapper.childNodes[0].childNodes;
            default:
              return template;
          }
        }
        function getTrustedContext(node, attrNormalizedName) {
          if (attrNormalizedName == "srcdoc") {
            return $sce.HTML;
          }
          var tag = nodeName_(node);
          if (attrNormalizedName == "xlinkHref" || (tag == "form" && attrNormalizedName == "action") || (tag != "img" && (attrNormalizedName == "src" || attrNormalizedName == "ngSrc"))) {
            return $sce.RESOURCE_URL;
          }
        }
        function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
          var trustedContext = getTrustedContext(node, name);
          allOrNothing = ALL_OR_NOTHING_ATTRS[name] || allOrNothing;
          var interpolateFn = $interpolate(value, true, trustedContext, allOrNothing);
          if (!interpolateFn)
            return;
          if (name === "multiple" && nodeName_(node) === "select") {
            throw $compileMinErr("selmulti", "Binding to the 'multiple' attribute is not supported. Element: {0}", startingTag(node));
          }
          directives.push({
            priority: 100,
            compile: function() {
              return {pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                  var $$observers = (attr.$$observers || (attr.$$observers = {}));
                  if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                    throw $compileMinErr('nodomevents', "Interpolations for HTML DOM event attributes are disallowed.  Please use the " + "ng- versions (such as ng-click instead of onclick) instead.");
                  }
                  var newValue = attr[name];
                  if (newValue !== value) {
                    interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                    value = newValue;
                  }
                  if (!interpolateFn)
                    return;
                  attr[name] = interpolateFn(scope);
                  ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                  (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                    if (name === 'class' && newValue != oldValue) {
                      attr.$updateClass(newValue, oldValue);
                    } else {
                      attr.$set(name, newValue);
                    }
                  });
                }};
            }
          });
        }
        function replaceWith($rootElement, elementsToRemove, newNode) {
          var firstElementToRemove = elementsToRemove[0],
              removeCount = elementsToRemove.length,
              parent = firstElementToRemove.parentNode,
              i,
              ii;
          if ($rootElement) {
            for (i = 0, ii = $rootElement.length; i < ii; i++) {
              if ($rootElement[i] == firstElementToRemove) {
                $rootElement[i++] = newNode;
                for (var j = i,
                    j2 = j + removeCount - 1,
                    jj = $rootElement.length; j < jj; j++, j2++) {
                  if (j2 < jj) {
                    $rootElement[j] = $rootElement[j2];
                  } else {
                    delete $rootElement[j];
                  }
                }
                $rootElement.length -= removeCount - 1;
                if ($rootElement.context === firstElementToRemove) {
                  $rootElement.context = newNode;
                }
                break;
              }
            }
          }
          if (parent) {
            parent.replaceChild(newNode, firstElementToRemove);
          }
          var fragment = document.createDocumentFragment();
          fragment.appendChild(firstElementToRemove);
          if (jqLite.hasData(firstElementToRemove)) {
            jqLite(newNode).data(jqLite(firstElementToRemove).data());
            if (!jQuery) {
              delete jqLite.cache[firstElementToRemove[jqLite.expando]];
            } else {
              skipDestroyOnNextJQueryCleanData = true;
              jQuery.cleanData([firstElementToRemove]);
            }
          }
          for (var k = 1,
              kk = elementsToRemove.length; k < kk; k++) {
            var element = elementsToRemove[k];
            jqLite(element).remove();
            fragment.appendChild(element);
            delete elementsToRemove[k];
          }
          elementsToRemove[0] = newNode;
          elementsToRemove.length = 1;
        }
        function cloneAndAnnotateFn(fn, annotation) {
          return extend(function() {
            return fn.apply(null, arguments);
          }, fn, annotation);
        }
        function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
          try {
            linkFn(scope, $element, attrs, controllers, transcludeFn);
          } catch (e) {
            $exceptionHandler(e, startingTag($element));
          }
        }
        function initializeDirectiveBindings(scope, attrs, destination, bindings, directive, newScope) {
          var onNewScopeDestroyed;
          forEach(bindings, function(definition, scopeName) {
            var attrName = definition.attrName,
                optional = definition.optional,
                mode = definition.mode,
                lastValue,
                parentGet,
                parentSet,
                compare;
            switch (mode) {
              case '@':
                if (!optional && !hasOwnProperty.call(attrs, attrName)) {
                  destination[scopeName] = attrs[attrName] = void 0;
                }
                attrs.$observe(attrName, function(value) {
                  if (isString(value)) {
                    destination[scopeName] = value;
                  }
                });
                attrs.$$observers[attrName].$$scope = scope;
                if (isString(attrs[attrName])) {
                  destination[scopeName] = $interpolate(attrs[attrName])(scope);
                }
                break;
              case '=':
                if (!hasOwnProperty.call(attrs, attrName)) {
                  if (optional)
                    break;
                  attrs[attrName] = void 0;
                }
                if (optional && !attrs[attrName])
                  break;
                parentGet = $parse(attrs[attrName]);
                if (parentGet.literal) {
                  compare = equals;
                } else {
                  compare = function(a, b) {
                    return a === b || (a !== a && b !== b);
                  };
                }
                parentSet = parentGet.assign || function() {
                  lastValue = destination[scopeName] = parentGet(scope);
                  throw $compileMinErr('nonassign', "Expression '{0}' used with directive '{1}' is non-assignable!", attrs[attrName], directive.name);
                };
                lastValue = destination[scopeName] = parentGet(scope);
                var parentValueWatch = function parentValueWatch(parentValue) {
                  if (!compare(parentValue, destination[scopeName])) {
                    if (!compare(parentValue, lastValue)) {
                      destination[scopeName] = parentValue;
                    } else {
                      parentSet(scope, parentValue = destination[scopeName]);
                    }
                  }
                  return lastValue = parentValue;
                };
                parentValueWatch.$stateful = true;
                var unwatch;
                if (definition.collection) {
                  unwatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
                } else {
                  unwatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
                }
                onNewScopeDestroyed = (onNewScopeDestroyed || []);
                onNewScopeDestroyed.push(unwatch);
                break;
              case '&':
                parentGet = attrs.hasOwnProperty(attrName) ? $parse(attrs[attrName]) : noop;
                if (parentGet === noop && optional)
                  break;
                destination[scopeName] = function(locals) {
                  return parentGet(scope, locals);
                };
                break;
            }
          });
          var destroyBindings = onNewScopeDestroyed ? function destroyBindings() {
            for (var i = 0,
                ii = onNewScopeDestroyed.length; i < ii; ++i) {
              onNewScopeDestroyed[i]();
            }
          } : noop;
          if (newScope && destroyBindings !== noop) {
            newScope.$on('$destroy', destroyBindings);
            return noop;
          }
          return destroyBindings;
        }
      }];
    }
    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
    function directiveNormalize(name) {
      return camelCase(name.replace(PREFIX_REGEXP, ''));
    }
    function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {}
    function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {}
    function tokenDifference(str1, str2) {
      var values = '',
          tokens1 = str1.split(/\s+/),
          tokens2 = str2.split(/\s+/);
      outer: for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];
        for (var j = 0; j < tokens2.length; j++) {
          if (token == tokens2[j])
            continue outer;
        }
        values += (values.length > 0 ? ' ' : '') + token;
      }
      return values;
    }
    function removeComments(jqNodes) {
      jqNodes = jqLite(jqNodes);
      var i = jqNodes.length;
      if (i <= 1) {
        return jqNodes;
      }
      while (i--) {
        var node = jqNodes[i];
        if (node.nodeType === NODE_TYPE_COMMENT) {
          splice.call(jqNodes, i, 1);
        }
      }
      return jqNodes;
    }
    var $controllerMinErr = minErr('$controller');
    var CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
    function identifierForController(controller, ident) {
      if (ident && isString(ident))
        return ident;
      if (isString(controller)) {
        var match = CNTRL_REG.exec(controller);
        if (match)
          return match[3];
      }
    }
    function $ControllerProvider() {
      var controllers = {},
          globals = false;
      this.register = function(name, constructor) {
        assertNotHasOwnProperty(name, 'controller');
        if (isObject(name)) {
          extend(controllers, name);
        } else {
          controllers[name] = constructor;
        }
      };
      this.allowGlobals = function() {
        globals = true;
      };
      this.$get = ['$injector', '$window', function($injector, $window) {
        return function(expression, locals, later, ident) {
          var instance,
              match,
              constructor,
              identifier;
          later = later === true;
          if (ident && isString(ident)) {
            identifier = ident;
          }
          if (isString(expression)) {
            match = expression.match(CNTRL_REG);
            if (!match) {
              throw $controllerMinErr('ctrlfmt', "Badly formed controller string '{0}'. " + "Must match `__name__ as __id__` or `__name__`.", expression);
            }
            constructor = match[1], identifier = identifier || match[3];
            expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || (globals ? getter($window, constructor, true) : undefined);
            assertArgFn(expression, constructor, true);
          }
          if (later) {
            var controllerPrototype = (isArray(expression) ? expression[expression.length - 1] : expression).prototype;
            instance = Object.create(controllerPrototype || null);
            if (identifier) {
              addIdentifier(locals, identifier, instance, constructor || expression.name);
            }
            var instantiate;
            return instantiate = extend(function() {
              var result = $injector.invoke(expression, instance, locals, constructor);
              if (result !== instance && (isObject(result) || isFunction(result))) {
                instance = result;
                if (identifier) {
                  addIdentifier(locals, identifier, instance, constructor || expression.name);
                }
              }
              return instance;
            }, {
              instance: instance,
              identifier: identifier
            });
          }
          instance = $injector.instantiate(expression, locals, constructor);
          if (identifier) {
            addIdentifier(locals, identifier, instance, constructor || expression.name);
          }
          return instance;
        };
        function addIdentifier(locals, identifier, instance, name) {
          if (!(locals && isObject(locals.$scope))) {
            throw minErr('$controller')('noscp', "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.", name, identifier);
          }
          locals.$scope[identifier] = instance;
        }
      }];
    }
    function $DocumentProvider() {
      this.$get = ['$window', function(window) {
        return jqLite(window.document);
      }];
    }
    function $ExceptionHandlerProvider() {
      this.$get = ['$log', function($log) {
        return function(exception, cause) {
          $log.error.apply($log, arguments);
        };
      }];
    }
    var $$ForceReflowProvider = function() {
      this.$get = ['$document', function($document) {
        return function(domNode) {
          if (domNode) {
            if (!domNode.nodeType && domNode instanceof jqLite) {
              domNode = domNode[0];
            }
          } else {
            domNode = $document[0].body;
          }
          return domNode.offsetWidth + 1;
        };
      }];
    };
    var APPLICATION_JSON = 'application/json';
    var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
    var JSON_START = /^\[|^\{(?!\{)/;
    var JSON_ENDS = {
      '[': /]$/,
      '{': /}$/
    };
    var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
    var $httpMinErr = minErr('$http');
    var $httpMinErrLegacyFn = function(method) {
      return function() {
        throw $httpMinErr('legacy', 'The method `{0}` on the promise returned from `$http` has been disabled.', method);
      };
    };
    function serializeValue(v) {
      if (isObject(v)) {
        return isDate(v) ? v.toISOString() : toJson(v);
      }
      return v;
    }
    function $HttpParamSerializerProvider() {
      this.$get = function() {
        return function ngParamSerializer(params) {
          if (!params)
            return '';
          var parts = [];
          forEachSorted(params, function(value, key) {
            if (value === null || isUndefined(value))
              return;
            if (isArray(value)) {
              forEach(value, function(v, k) {
                parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(v)));
              });
            } else {
              parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value)));
            }
          });
          return parts.join('&');
        };
      };
    }
    function $HttpParamSerializerJQLikeProvider() {
      this.$get = function() {
        return function jQueryLikeParamSerializer(params) {
          if (!params)
            return '';
          var parts = [];
          serialize(params, '', true);
          return parts.join('&');
          function serialize(toSerialize, prefix, topLevel) {
            if (toSerialize === null || isUndefined(toSerialize))
              return;
            if (isArray(toSerialize)) {
              forEach(toSerialize, function(value, index) {
                serialize(value, prefix + '[' + (isObject(value) ? index : '') + ']');
              });
            } else if (isObject(toSerialize) && !isDate(toSerialize)) {
              forEachSorted(toSerialize, function(value, key) {
                serialize(value, prefix + (topLevel ? '' : '[') + key + (topLevel ? '' : ']'));
              });
            } else {
              parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
            }
          }
        };
      };
    }
    function defaultHttpResponseTransform(data, headers) {
      if (isString(data)) {
        var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();
        if (tempData) {
          var contentType = headers('Content-Type');
          if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
            data = fromJson(tempData);
          }
        }
      }
      return data;
    }
    function isJsonLike(str) {
      var jsonStart = str.match(JSON_START);
      return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    }
    function parseHeaders(headers) {
      var parsed = createMap(),
          i;
      function fillInParsed(key, val) {
        if (key) {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
      if (isString(headers)) {
        forEach(headers.split('\n'), function(line) {
          i = line.indexOf(':');
          fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
        });
      } else if (isObject(headers)) {
        forEach(headers, function(headerVal, headerKey) {
          fillInParsed(lowercase(headerKey), trim(headerVal));
        });
      }
      return parsed;
    }
    function headersGetter(headers) {
      var headersObj;
      return function(name) {
        if (!headersObj)
          headersObj = parseHeaders(headers);
        if (name) {
          var value = headersObj[lowercase(name)];
          if (value === void 0) {
            value = null;
          }
          return value;
        }
        return headersObj;
      };
    }
    function transformData(data, headers, status, fns) {
      if (isFunction(fns)) {
        return fns(data, headers, status);
      }
      forEach(fns, function(fn) {
        data = fn(data, headers, status);
      });
      return data;
    }
    function isSuccess(status) {
      return 200 <= status && status < 300;
    }
    function $HttpProvider() {
      var defaults = this.defaults = {
        transformResponse: [defaultHttpResponseTransform],
        transformRequest: [function(d) {
          return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
        }],
        headers: {
          common: {'Accept': 'application/json, text/plain, */*'},
          post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
          patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
        },
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        paramSerializer: '$httpParamSerializer'
      };
      var useApplyAsync = false;
      this.useApplyAsync = function(value) {
        if (isDefined(value)) {
          useApplyAsync = !!value;
          return this;
        }
        return useApplyAsync;
      };
      var useLegacyPromise = true;
      this.useLegacyPromiseExtensions = function(value) {
        if (isDefined(value)) {
          useLegacyPromise = !!value;
          return this;
        }
        return useLegacyPromise;
      };
      var interceptorFactories = this.interceptors = [];
      this.$get = ['$httpBackend', '$$cookieReader', '$cacheFactory', '$rootScope', '$q', '$injector', function($httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector) {
        var defaultCache = $cacheFactory('$http');
        defaults.paramSerializer = isString(defaults.paramSerializer) ? $injector.get(defaults.paramSerializer) : defaults.paramSerializer;
        var reversedInterceptors = [];
        forEach(interceptorFactories, function(interceptorFactory) {
          reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
        });
        function $http(requestConfig) {
          if (!angular.isObject(requestConfig)) {
            throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
          }
          var config = extend({
            method: 'get',
            transformRequest: defaults.transformRequest,
            transformResponse: defaults.transformResponse,
            paramSerializer: defaults.paramSerializer
          }, requestConfig);
          config.headers = mergeHeaders(requestConfig);
          config.method = uppercase(config.method);
          config.paramSerializer = isString(config.paramSerializer) ? $injector.get(config.paramSerializer) : config.paramSerializer;
          var serverRequest = function(config) {
            var headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);
            if (isUndefined(reqData)) {
              forEach(headers, function(value, header) {
                if (lowercase(header) === 'content-type') {
                  delete headers[header];
                }
              });
            }
            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
              config.withCredentials = defaults.withCredentials;
            }
            return sendReq(config, reqData).then(transformResponse, transformResponse);
          };
          var chain = [serverRequest, undefined];
          var promise = $q.when(config);
          forEach(reversedInterceptors, function(interceptor) {
            if (interceptor.request || interceptor.requestError) {
              chain.unshift(interceptor.request, interceptor.requestError);
            }
            if (interceptor.response || interceptor.responseError) {
              chain.push(interceptor.response, interceptor.responseError);
            }
          });
          while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();
            promise = promise.then(thenFn, rejectFn);
          }
          if (useLegacyPromise) {
            promise.success = function(fn) {
              assertArgFn(fn, 'fn');
              promise.then(function(response) {
                fn(response.data, response.status, response.headers, config);
              });
              return promise;
            };
            promise.error = function(fn) {
              assertArgFn(fn, 'fn');
              promise.then(null, function(response) {
                fn(response.data, response.status, response.headers, config);
              });
              return promise;
            };
          } else {
            promise.success = $httpMinErrLegacyFn('success');
            promise.error = $httpMinErrLegacyFn('error');
          }
          return promise;
          function transformResponse(response) {
            var resp = extend({}, response);
            if (!response.data) {
              resp.data = response.data;
            } else {
              resp.data = transformData(response.data, response.headers, response.status, config.transformResponse);
            }
            return (isSuccess(response.status)) ? resp : $q.reject(resp);
          }
          function executeHeaderFns(headers, config) {
            var headerContent,
                processedHeaders = {};
            forEach(headers, function(headerFn, header) {
              if (isFunction(headerFn)) {
                headerContent = headerFn(config);
                if (headerContent != null) {
                  processedHeaders[header] = headerContent;
                }
              } else {
                processedHeaders[header] = headerFn;
              }
            });
            return processedHeaders;
          }
          function mergeHeaders(config) {
            var defHeaders = defaults.headers,
                reqHeaders = extend({}, config.headers),
                defHeaderName,
                lowercaseDefHeaderName,
                reqHeaderName;
            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
            defaultHeadersIteration: for (defHeaderName in defHeaders) {
              lowercaseDefHeaderName = lowercase(defHeaderName);
              for (reqHeaderName in reqHeaders) {
                if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                  continue defaultHeadersIteration;
                }
              }
              reqHeaders[defHeaderName] = defHeaders[defHeaderName];
            }
            return executeHeaderFns(reqHeaders, shallowCopy(config));
          }
        }
        $http.pendingRequests = [];
        createShortMethods('get', 'delete', 'head', 'jsonp');
        createShortMethodsWithData('post', 'put', 'patch');
        $http.defaults = defaults;
        return $http;
        function createShortMethods(names) {
          forEach(arguments, function(name) {
            $http[name] = function(url, config) {
              return $http(extend({}, config || {}, {
                method: name,
                url: url
              }));
            };
          });
        }
        function createShortMethodsWithData(name) {
          forEach(arguments, function(name) {
            $http[name] = function(url, data, config) {
              return $http(extend({}, config || {}, {
                method: name,
                url: url,
                data: data
              }));
            };
          });
        }
        function sendReq(config, reqData) {
          var deferred = $q.defer(),
              promise = deferred.promise,
              cache,
              cachedResp,
              reqHeaders = config.headers,
              url = buildUrl(config.url, config.paramSerializer(config.params));
          $http.pendingRequests.push(config);
          promise.then(removePendingReq, removePendingReq);
          if ((config.cache || defaults.cache) && config.cache !== false && (config.method === 'GET' || config.method === 'JSONP')) {
            cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
          }
          if (cache) {
            cachedResp = cache.get(url);
            if (isDefined(cachedResp)) {
              if (isPromiseLike(cachedResp)) {
                cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
              } else {
                if (isArray(cachedResp)) {
                  resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
                } else {
                  resolvePromise(cachedResp, 200, {}, 'OK');
                }
              }
            } else {
              cache.put(url, promise);
            }
          }
          if (isUndefined(cachedResp)) {
            var xsrfValue = urlIsSameOrigin(config.url) ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
            if (xsrfValue) {
              reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
            }
            $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
          }
          return promise;
          function done(status, response, headersString, statusText) {
            if (cache) {
              if (isSuccess(status)) {
                cache.put(url, [status, response, parseHeaders(headersString), statusText]);
              } else {
                cache.remove(url);
              }
            }
            function resolveHttpPromise() {
              resolvePromise(response, status, headersString, statusText);
            }
            if (useApplyAsync) {
              $rootScope.$applyAsync(resolveHttpPromise);
            } else {
              resolveHttpPromise();
              if (!$rootScope.$$phase)
                $rootScope.$apply();
            }
          }
          function resolvePromise(response, status, headers, statusText) {
            status = Math.max(status, 0);
            (isSuccess(status) ? deferred.resolve : deferred.reject)({
              data: response,
              status: status,
              headers: headersGetter(headers),
              config: config,
              statusText: statusText
            });
          }
          function resolvePromiseWithResult(result) {
            resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
          }
          function removePendingReq() {
            var idx = $http.pendingRequests.indexOf(config);
            if (idx !== -1)
              $http.pendingRequests.splice(idx, 1);
          }
        }
        function buildUrl(url, serializedParams) {
          if (serializedParams.length > 0) {
            url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
          }
          return url;
        }
      }];
    }
    function createXhr() {
      return new window.XMLHttpRequest();
    }
    function $HttpBackendProvider() {
      this.$get = ['$browser', '$window', '$document', function($browser, $window, $document) {
        return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
      }];
    }
    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
      return function(method, url, post, callback, headers, timeout, withCredentials, responseType) {
        $browser.$$incOutstandingRequestCount();
        url = url || $browser.url();
        if (lowercase(method) == 'jsonp') {
          var callbackId = '_' + (callbacks.counter++).toString(36);
          callbacks[callbackId] = function(data) {
            callbacks[callbackId].data = data;
            callbacks[callbackId].called = true;
          };
          var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), callbackId, function(status, text) {
            completeRequest(callback, status, callbacks[callbackId].data, "", text);
            callbacks[callbackId] = noop;
          });
        } else {
          var xhr = createXhr();
          xhr.open(method, url, true);
          forEach(headers, function(value, key) {
            if (isDefined(value)) {
              xhr.setRequestHeader(key, value);
            }
          });
          xhr.onload = function requestLoaded() {
            var statusText = xhr.statusText || '';
            var response = ('response' in xhr) ? xhr.response : xhr.responseText;
            var status = xhr.status === 1223 ? 204 : xhr.status;
            if (status === 0) {
              status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
            }
            completeRequest(callback, status, response, xhr.getAllResponseHeaders(), statusText);
          };
          var requestError = function() {
            completeRequest(callback, -1, null, null, '');
          };
          xhr.onerror = requestError;
          xhr.onabort = requestError;
          if (withCredentials) {
            xhr.withCredentials = true;
          }
          if (responseType) {
            try {
              xhr.responseType = responseType;
            } catch (e) {
              if (responseType !== 'json') {
                throw e;
              }
            }
          }
          xhr.send(post);
        }
        if (timeout > 0) {
          var timeoutId = $browserDefer(timeoutRequest, timeout);
        } else if (isPromiseLike(timeout)) {
          timeout.then(timeoutRequest);
        }
        function timeoutRequest() {
          jsonpDone && jsonpDone();
          xhr && xhr.abort();
        }
        function completeRequest(callback, status, response, headersString, statusText) {
          if (timeoutId !== undefined) {
            $browserDefer.cancel(timeoutId);
          }
          jsonpDone = xhr = null;
          callback(status, response, headersString, statusText);
          $browser.$$completeOutstandingRequest(noop);
        }
      };
      function jsonpReq(url, callbackId, done) {
        var script = rawDocument.createElement('script'),
            callback = null;
        script.type = "text/javascript";
        script.src = url;
        script.async = true;
        callback = function(event) {
          removeEventListenerFn(script, "load", callback);
          removeEventListenerFn(script, "error", callback);
          rawDocument.body.removeChild(script);
          script = null;
          var status = -1;
          var text = "unknown";
          if (event) {
            if (event.type === "load" && !callbacks[callbackId].called) {
              event = {type: "error"};
            }
            text = event.type;
            status = event.type === "error" ? 404 : 200;
          }
          if (done) {
            done(status, text);
          }
        };
        addEventListenerFn(script, "load", callback);
        addEventListenerFn(script, "error", callback);
        rawDocument.body.appendChild(script);
        return callback;
      }
    }
    var $interpolateMinErr = angular.$interpolateMinErr = minErr('$interpolate');
    $interpolateMinErr.throwNoconcat = function(text) {
      throw $interpolateMinErr('noconcat', "Error while interpolating: {0}\nStrict Contextual Escaping disallows " + "interpolations that concatenate multiple expressions when a trusted value is " + "required.  See http://docs.angularjs.org/api/ng.$sce", text);
    };
    $interpolateMinErr.interr = function(text, err) {
      return $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text, err.toString());
    };
    function $InterpolateProvider() {
      var startSymbol = '{{';
      var endSymbol = '}}';
      this.startSymbol = function(value) {
        if (value) {
          startSymbol = value;
          return this;
        } else {
          return startSymbol;
        }
      };
      this.endSymbol = function(value) {
        if (value) {
          endSymbol = value;
          return this;
        } else {
          return endSymbol;
        }
      };
      this.$get = ['$parse', '$exceptionHandler', '$sce', function($parse, $exceptionHandler, $sce) {
        var startSymbolLength = startSymbol.length,
            endSymbolLength = endSymbol.length,
            escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
            escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');
        function escape(ch) {
          return '\\\\\\' + ch;
        }
        function unescapeText(text) {
          return text.replace(escapedStartRegexp, startSymbol).replace(escapedEndRegexp, endSymbol);
        }
        function stringify(value) {
          if (value == null) {
            return '';
          }
          switch (typeof value) {
            case 'string':
              break;
            case 'number':
              value = '' + value;
              break;
            default:
              value = toJson(value);
          }
          return value;
        }
        function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
          allOrNothing = !!allOrNothing;
          var startIndex,
              endIndex,
              index = 0,
              expressions = [],
              parseFns = [],
              textLength = text.length,
              exp,
              concat = [],
              expressionPositions = [];
          while (index < textLength) {
            if (((startIndex = text.indexOf(startSymbol, index)) != -1) && ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1)) {
              if (index !== startIndex) {
                concat.push(unescapeText(text.substring(index, startIndex)));
              }
              exp = text.substring(startIndex + startSymbolLength, endIndex);
              expressions.push(exp);
              parseFns.push($parse(exp, parseStringifyInterceptor));
              index = endIndex + endSymbolLength;
              expressionPositions.push(concat.length);
              concat.push('');
            } else {
              if (index !== textLength) {
                concat.push(unescapeText(text.substring(index)));
              }
              break;
            }
          }
          if (trustedContext && concat.length > 1) {
            $interpolateMinErr.throwNoconcat(text);
          }
          if (!mustHaveExpression || expressions.length) {
            var compute = function(values) {
              for (var i = 0,
                  ii = expressions.length; i < ii; i++) {
                if (allOrNothing && isUndefined(values[i]))
                  return;
                concat[expressionPositions[i]] = values[i];
              }
              return concat.join('');
            };
            var getValue = function(value) {
              return trustedContext ? $sce.getTrusted(trustedContext, value) : $sce.valueOf(value);
            };
            return extend(function interpolationFn(context) {
              var i = 0;
              var ii = expressions.length;
              var values = new Array(ii);
              try {
                for (; i < ii; i++) {
                  values[i] = parseFns[i](context);
                }
                return compute(values);
              } catch (err) {
                $exceptionHandler($interpolateMinErr.interr(text, err));
              }
            }, {
              exp: text,
              expressions: expressions,
              $$watchDelegate: function(scope, listener) {
                var lastValue;
                return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
                  var currValue = compute(values);
                  if (isFunction(listener)) {
                    listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
                  }
                  lastValue = currValue;
                });
              }
            });
          }
          function parseStringifyInterceptor(value) {
            try {
              value = getValue(value);
              return allOrNothing && !isDefined(value) ? value : stringify(value);
            } catch (err) {
              $exceptionHandler($interpolateMinErr.interr(text, err));
            }
          }
        }
        $interpolate.startSymbol = function() {
          return startSymbol;
        };
        $interpolate.endSymbol = function() {
          return endSymbol;
        };
        return $interpolate;
      }];
    }
    function $IntervalProvider() {
      this.$get = ['$rootScope', '$window', '$q', '$$q', function($rootScope, $window, $q, $$q) {
        var intervals = {};
        function interval(fn, delay, count, invokeApply) {
          var hasParams = arguments.length > 4,
              args = hasParams ? sliceArgs(arguments, 4) : [],
              setInterval = $window.setInterval,
              clearInterval = $window.clearInterval,
              iteration = 0,
              skipApply = (isDefined(invokeApply) && !invokeApply),
              deferred = (skipApply ? $$q : $q).defer(),
              promise = deferred.promise;
          count = isDefined(count) ? count : 0;
          promise.then(null, null, (!hasParams) ? fn : function() {
            fn.apply(null, args);
          });
          promise.$$intervalId = setInterval(function tick() {
            deferred.notify(iteration++);
            if (count > 0 && iteration >= count) {
              deferred.resolve(iteration);
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          intervals[promise.$$intervalId] = deferred;
          return promise;
        }
        interval.cancel = function(promise) {
          if (promise && promise.$$intervalId in intervals) {
            intervals[promise.$$intervalId].reject('canceled');
            $window.clearInterval(promise.$$intervalId);
            delete intervals[promise.$$intervalId];
            return true;
          }
          return false;
        };
        return interval;
      }];
    }
    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        DEFAULT_PORTS = {
          'http': 80,
          'https': 443,
          'ftp': 21
        };
    var $locationMinErr = minErr('$location');
    function encodePath(path) {
      var segments = path.split('/'),
          i = segments.length;
      while (i--) {
        segments[i] = encodeUriSegment(segments[i]);
      }
      return segments.join('/');
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj) {
      var parsedUrl = urlResolve(absoluteUrl);
      locationObj.$$protocol = parsedUrl.protocol;
      locationObj.$$host = parsedUrl.hostname;
      locationObj.$$port = toInt(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj) {
      var prefixed = (relativeUrl.charAt(0) !== '/');
      if (prefixed) {
        relativeUrl = '/' + relativeUrl;
      }
      var match = urlResolve(relativeUrl);
      locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
      locationObj.$$search = parseKeyValue(match.search);
      locationObj.$$hash = decodeURIComponent(match.hash);
      if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
        locationObj.$$path = '/' + locationObj.$$path;
      }
    }
    function beginsWith(begin, whole) {
      if (whole.indexOf(begin) === 0) {
        return whole.substr(begin.length);
      }
    }
    function stripHash(url) {
      var index = url.indexOf('#');
      return index == -1 ? url : url.substr(0, index);
    }
    function trimEmptyHash(url) {
      return url.replace(/(#.+)|#$/, '$1');
    }
    function stripFile(url) {
      return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
    }
    function serverBase(url) {
      return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
    }
    function LocationHtml5Url(appBase, appBaseNoFile, basePrefix) {
      this.$$html5 = true;
      basePrefix = basePrefix || '';
      parseAbsoluteUrl(appBase, this);
      this.$$parse = function(url) {
        var pathUrl = beginsWith(appBaseNoFile, url);
        if (!isString(pathUrl)) {
          throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
        }
        parseAppUrl(pathUrl, this);
        if (!this.$$path) {
          this.$$path = '/';
        }
        this.$$compose();
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
      };
      this.$$parseLinkUrl = function(url, relHref) {
        if (relHref && relHref[0] === '#') {
          this.hash(relHref.slice(1));
          return true;
        }
        var appUrl,
            prevAppUrl;
        var rewrittenUrl;
        if ((appUrl = beginsWith(appBase, url)) !== undefined) {
          prevAppUrl = appUrl;
          if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
            rewrittenUrl = appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
          } else {
            rewrittenUrl = appBase + prevAppUrl;
          }
        } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
          rewrittenUrl = appBaseNoFile + appUrl;
        } else if (appBaseNoFile == url + '/') {
          rewrittenUrl = appBaseNoFile;
        }
        if (rewrittenUrl) {
          this.$$parse(rewrittenUrl);
        }
        return !!rewrittenUrl;
      };
    }
    function LocationHashbangUrl(appBase, appBaseNoFile, hashPrefix) {
      parseAbsoluteUrl(appBase, this);
      this.$$parse = function(url) {
        var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
        var withoutHashUrl;
        if (!isUndefined(withoutBaseUrl) && withoutBaseUrl.charAt(0) === '#') {
          withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl);
          if (isUndefined(withoutHashUrl)) {
            withoutHashUrl = withoutBaseUrl;
          }
        } else {
          if (this.$$html5) {
            withoutHashUrl = withoutBaseUrl;
          } else {
            withoutHashUrl = '';
            if (isUndefined(withoutBaseUrl)) {
              appBase = url;
              this.replace();
            }
          }
        }
        parseAppUrl(withoutHashUrl, this);
        this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
        this.$$compose();
        function removeWindowsDriveName(path, url, base) {
          var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
          var firstPathSegmentMatch;
          if (url.indexOf(base) === 0) {
            url = url.replace(base, '');
          }
          if (windowsFilePathExp.exec(url)) {
            return path;
          }
          firstPathSegmentMatch = windowsFilePathExp.exec(path);
          return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
        }
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
      };
      this.$$parseLinkUrl = function(url, relHref) {
        if (stripHash(appBase) == stripHash(url)) {
          this.$$parse(url);
          return true;
        }
        return false;
      };
    }
    function LocationHashbangInHtml5Url(appBase, appBaseNoFile, hashPrefix) {
      this.$$html5 = true;
      LocationHashbangUrl.apply(this, arguments);
      this.$$parseLinkUrl = function(url, relHref) {
        if (relHref && relHref[0] === '#') {
          this.hash(relHref.slice(1));
          return true;
        }
        var rewrittenUrl;
        var appUrl;
        if (appBase == stripHash(url)) {
          rewrittenUrl = url;
        } else if ((appUrl = beginsWith(appBaseNoFile, url))) {
          rewrittenUrl = appBase + hashPrefix + appUrl;
        } else if (appBaseNoFile === url + '/') {
          rewrittenUrl = appBaseNoFile;
        }
        if (rewrittenUrl) {
          this.$$parse(rewrittenUrl);
        }
        return !!rewrittenUrl;
      };
      this.$$compose = function() {
        var search = toKeyValue(this.$$search),
            hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBase + hashPrefix + this.$$url;
      };
    }
    var locationPrototype = {
      $$html5: false,
      $$replace: false,
      absUrl: locationGetter('$$absUrl'),
      url: function(url) {
        if (isUndefined(url)) {
          return this.$$url;
        }
        var match = PATH_MATCH.exec(url);
        if (match[1] || url === '')
          this.path(decodeURIComponent(match[1]));
        if (match[2] || match[1] || url === '')
          this.search(match[3] || '');
        this.hash(match[5] || '');
        return this;
      },
      protocol: locationGetter('$$protocol'),
      host: locationGetter('$$host'),
      port: locationGetter('$$port'),
      path: locationGetterSetter('$$path', function(path) {
        path = path !== null ? path.toString() : '';
        return path.charAt(0) == '/' ? path : '/' + path;
      }),
      search: function(search, paramValue) {
        switch (arguments.length) {
          case 0:
            return this.$$search;
          case 1:
            if (isString(search) || isNumber(search)) {
              search = search.toString();
              this.$$search = parseKeyValue(search);
            } else if (isObject(search)) {
              search = copy(search, {});
              forEach(search, function(value, key) {
                if (value == null)
                  delete search[key];
              });
              this.$$search = search;
            } else {
              throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
            }
            break;
          default:
            if (isUndefined(paramValue) || paramValue === null) {
              delete this.$$search[search];
            } else {
              this.$$search[search] = paramValue;
            }
        }
        this.$$compose();
        return this;
      },
      hash: locationGetterSetter('$$hash', function(hash) {
        return hash !== null ? hash.toString() : '';
      }),
      replace: function() {
        this.$$replace = true;
        return this;
      }
    };
    forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function(Location) {
      Location.prototype = Object.create(locationPrototype);
      Location.prototype.state = function(state) {
        if (!arguments.length) {
          return this.$$state;
        }
        if (Location !== LocationHtml5Url || !this.$$html5) {
          throw $locationMinErr('nostate', 'History API state support is available only ' + 'in HTML5 mode and only in browsers supporting HTML5 History API');
        }
        this.$$state = isUndefined(state) ? null : state;
        return this;
      };
    });
    function locationGetter(property) {
      return function() {
        return this[property];
      };
    }
    function locationGetterSetter(property, preprocess) {
      return function(value) {
        if (isUndefined(value)) {
          return this[property];
        }
        this[property] = preprocess(value);
        this.$$compose();
        return this;
      };
    }
    function $LocationProvider() {
      var hashPrefix = '',
          html5Mode = {
            enabled: false,
            requireBase: true,
            rewriteLinks: true
          };
      this.hashPrefix = function(prefix) {
        if (isDefined(prefix)) {
          hashPrefix = prefix;
          return this;
        } else {
          return hashPrefix;
        }
      };
      this.html5Mode = function(mode) {
        if (isBoolean(mode)) {
          html5Mode.enabled = mode;
          return this;
        } else if (isObject(mode)) {
          if (isBoolean(mode.enabled)) {
            html5Mode.enabled = mode.enabled;
          }
          if (isBoolean(mode.requireBase)) {
            html5Mode.requireBase = mode.requireBase;
          }
          if (isBoolean(mode.rewriteLinks)) {
            html5Mode.rewriteLinks = mode.rewriteLinks;
          }
          return this;
        } else {
          return html5Mode;
        }
      };
      this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', '$window', function($rootScope, $browser, $sniffer, $rootElement, $window) {
        var $location,
            LocationMode,
            baseHref = $browser.baseHref(),
            initialUrl = $browser.url(),
            appBase;
        if (html5Mode.enabled) {
          if (!baseHref && html5Mode.requireBase) {
            throw $locationMinErr('nobase', "$location in HTML5 mode requires a <base> tag to be present!");
          }
          appBase = serverBase(initialUrl) + (baseHref || '/');
          LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
        } else {
          appBase = stripHash(initialUrl);
          LocationMode = LocationHashbangUrl;
        }
        var appBaseNoFile = stripFile(appBase);
        $location = new LocationMode(appBase, appBaseNoFile, '#' + hashPrefix);
        $location.$$parseLinkUrl(initialUrl, initialUrl);
        $location.$$state = $browser.state();
        var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;
        function setBrowserUrlWithFallback(url, replace, state) {
          var oldUrl = $location.url();
          var oldState = $location.$$state;
          try {
            $browser.url(url, replace, state);
            $location.$$state = $browser.state();
          } catch (e) {
            $location.url(oldUrl);
            $location.$$state = oldState;
            throw e;
          }
        }
        $rootElement.on('click', function(event) {
          if (!html5Mode.rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which == 2 || event.button == 2)
            return;
          var elm = jqLite(event.target);
          while (nodeName_(elm[0]) !== 'a') {
            if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
              return;
          }
          var absHref = elm.prop('href');
          var relHref = elm.attr('href') || elm.attr('xlink:href');
          if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
            absHref = urlResolve(absHref.animVal).href;
          }
          if (IGNORE_URI_REGEXP.test(absHref))
            return;
          if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
            if ($location.$$parseLinkUrl(absHref, relHref)) {
              event.preventDefault();
              if ($location.absUrl() != $browser.url()) {
                $rootScope.$apply();
                $window.angular['ff-684208-preventDefault'] = true;
              }
            }
          }
        });
        if (trimEmptyHash($location.absUrl()) != trimEmptyHash(initialUrl)) {
          $browser.url($location.absUrl(), true);
        }
        var initializing = true;
        $browser.onUrlChange(function(newUrl, newState) {
          if (isUndefined(beginsWith(appBaseNoFile, newUrl))) {
            $window.location.href = newUrl;
            return;
          }
          $rootScope.$evalAsync(function() {
            var oldUrl = $location.absUrl();
            var oldState = $location.$$state;
            var defaultPrevented;
            $location.$$parse(newUrl);
            $location.$$state = newState;
            defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, newState, oldState).defaultPrevented;
            if ($location.absUrl() !== newUrl)
              return;
            if (defaultPrevented) {
              $location.$$parse(oldUrl);
              $location.$$state = oldState;
              setBrowserUrlWithFallback(oldUrl, false, oldState);
            } else {
              initializing = false;
              afterLocationChange(oldUrl, oldState);
            }
          });
          if (!$rootScope.$$phase)
            $rootScope.$digest();
        });
        $rootScope.$watch(function $locationWatch() {
          var oldUrl = trimEmptyHash($browser.url());
          var newUrl = trimEmptyHash($location.absUrl());
          var oldState = $browser.state();
          var currentReplace = $location.$$replace;
          var urlOrStateChanged = oldUrl !== newUrl || ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);
          if (initializing || urlOrStateChanged) {
            initializing = false;
            $rootScope.$evalAsync(function() {
              var newUrl = $location.absUrl();
              var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl, $location.$$state, oldState).defaultPrevented;
              if ($location.absUrl() !== newUrl)
                return;
              if (defaultPrevented) {
                $location.$$parse(oldUrl);
                $location.$$state = oldState;
              } else {
                if (urlOrStateChanged) {
                  setBrowserUrlWithFallback(newUrl, currentReplace, oldState === $location.$$state ? null : $location.$$state);
                }
                afterLocationChange(oldUrl, oldState);
              }
            });
          }
          $location.$$replace = false;
        });
        return $location;
        function afterLocationChange(oldUrl, oldState) {
          $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl, $location.$$state, oldState);
        }
      }];
    }
    function $LogProvider() {
      var debug = true,
          self = this;
      this.debugEnabled = function(flag) {
        if (isDefined(flag)) {
          debug = flag;
          return this;
        } else {
          return debug;
        }
      };
      this.$get = ['$window', function($window) {
        return {
          log: consoleLog('log'),
          info: consoleLog('info'),
          warn: consoleLog('warn'),
          error: consoleLog('error'),
          debug: (function() {
            var fn = consoleLog('debug');
            return function() {
              if (debug) {
                fn.apply(self, arguments);
              }
            };
          }())
        };
        function formatError(arg) {
          if (arg instanceof Error) {
            if (arg.stack) {
              arg = (arg.message && arg.stack.indexOf(arg.message) === -1) ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
            } else if (arg.sourceURL) {
              arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
          }
          return arg;
        }
        function consoleLog(type) {
          var console = $window.console || {},
              logFn = console[type] || console.log || noop,
              hasApply = false;
          try {
            hasApply = !!logFn.apply;
          } catch (e) {}
          if (hasApply) {
            return function() {
              var args = [];
              forEach(arguments, function(arg) {
                args.push(formatError(arg));
              });
              return logFn.apply(console, args);
            };
          }
          return function(arg1, arg2) {
            logFn(arg1, arg2 == null ? '' : arg2);
          };
        }
      }];
    }
    var $parseMinErr = minErr('$parse');
    function ensureSafeMemberName(name, fullExpression) {
      if (name === "__defineGetter__" || name === "__defineSetter__" || name === "__lookupGetter__" || name === "__lookupSetter__" || name === "__proto__") {
        throw $parseMinErr('isecfld', 'Attempting to access a disallowed field in Angular expressions! ' + 'Expression: {0}', fullExpression);
      }
      return name;
    }
    function ensureSafeObject(obj, fullExpression) {
      if (obj) {
        if (obj.constructor === obj) {
          throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.window === obj) {
          throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
          throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj === Object) {
          throw $parseMinErr('isecobj', 'Referencing Object in Angular expressions is disallowed! Expression: {0}', fullExpression);
        }
      }
      return obj;
    }
    var CALL = Function.prototype.call;
    var APPLY = Function.prototype.apply;
    var BIND = Function.prototype.bind;
    function ensureSafeFunction(obj, fullExpression) {
      if (obj) {
        if (obj.constructor === obj) {
          throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj === CALL || obj === APPLY || obj === BIND) {
          throw $parseMinErr('isecff', 'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}', fullExpression);
        }
      }
    }
    var OPERATORS = createMap();
    forEach('+ - * / % === !== == != < > <= >= && || ! = |'.split(' '), function(operator) {
      OPERATORS[operator] = true;
    });
    var ESCAPE = {
      "n": "\n",
      "f": "\f",
      "r": "\r",
      "t": "\t",
      "v": "\v",
      "'": "'",
      '"': '"'
    };
    var Lexer = function(options) {
      this.options = options;
    };
    Lexer.prototype = {
      constructor: Lexer,
      lex: function(text) {
        this.text = text;
        this.index = 0;
        this.tokens = [];
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          if (ch === '"' || ch === "'") {
            this.readString(ch);
          } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
            this.readNumber();
          } else if (this.isIdent(ch)) {
            this.readIdent();
          } else if (this.is(ch, '(){}[].,;:?')) {
            this.tokens.push({
              index: this.index,
              text: ch
            });
            this.index++;
          } else if (this.isWhitespace(ch)) {
            this.index++;
          } else {
            var ch2 = ch + this.peek();
            var ch3 = ch2 + this.peek(2);
            var op1 = OPERATORS[ch];
            var op2 = OPERATORS[ch2];
            var op3 = OPERATORS[ch3];
            if (op1 || op2 || op3) {
              var token = op3 ? ch3 : (op2 ? ch2 : ch);
              this.tokens.push({
                index: this.index,
                text: token,
                operator: true
              });
              this.index += token.length;
            } else {
              this.throwError('Unexpected next character ', this.index, this.index + 1);
            }
          }
        }
        return this.tokens;
      },
      is: function(ch, chars) {
        return chars.indexOf(ch) !== -1;
      },
      peek: function(i) {
        var num = i || 1;
        return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
      },
      isNumber: function(ch) {
        return ('0' <= ch && ch <= '9') && typeof ch === "string";
      },
      isWhitespace: function(ch) {
        return (ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\v' || ch === '\u00A0');
      },
      isIdent: function(ch) {
        return ('a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$');
      },
      isExpOperator: function(ch) {
        return (ch === '-' || ch === '+' || this.isNumber(ch));
      },
      throwError: function(error, start, end) {
        end = end || this.index;
        var colStr = (isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end);
        throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
      },
      readNumber: function() {
        var number = '';
        var start = this.index;
        while (this.index < this.text.length) {
          var ch = lowercase(this.text.charAt(this.index));
          if (ch == '.' || this.isNumber(ch)) {
            number += ch;
          } else {
            var peekCh = this.peek();
            if (ch == 'e' && this.isExpOperator(peekCh)) {
              number += ch;
            } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
              number += ch;
            } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
              this.throwError('Invalid exponent');
            } else {
              break;
            }
          }
          this.index++;
        }
        this.tokens.push({
          index: start,
          text: number,
          constant: true,
          value: Number(number)
        });
      },
      readIdent: function() {
        var start = this.index;
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          if (!(this.isIdent(ch) || this.isNumber(ch))) {
            break;
          }
          this.index++;
        }
        this.tokens.push({
          index: start,
          text: this.text.slice(start, this.index),
          identifier: true
        });
      },
      readString: function(quote) {
        var start = this.index;
        this.index++;
        var string = '';
        var rawString = quote;
        var escape = false;
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          rawString += ch;
          if (escape) {
            if (ch === 'u') {
              var hex = this.text.substring(this.index + 1, this.index + 5);
              if (!hex.match(/[\da-f]{4}/i)) {
                this.throwError('Invalid unicode escape [\\u' + hex + ']');
              }
              this.index += 4;
              string += String.fromCharCode(parseInt(hex, 16));
            } else {
              var rep = ESCAPE[ch];
              string = string + (rep || ch);
            }
            escape = false;
          } else if (ch === '\\') {
            escape = true;
          } else if (ch === quote) {
            this.index++;
            this.tokens.push({
              index: start,
              text: rawString,
              constant: true,
              value: string
            });
            return;
          } else {
            string += ch;
          }
          this.index++;
        }
        this.throwError('Unterminated quote', start);
      }
    };
    var AST = function(lexer, options) {
      this.lexer = lexer;
      this.options = options;
    };
    AST.Program = 'Program';
    AST.ExpressionStatement = 'ExpressionStatement';
    AST.AssignmentExpression = 'AssignmentExpression';
    AST.ConditionalExpression = 'ConditionalExpression';
    AST.LogicalExpression = 'LogicalExpression';
    AST.BinaryExpression = 'BinaryExpression';
    AST.UnaryExpression = 'UnaryExpression';
    AST.CallExpression = 'CallExpression';
    AST.MemberExpression = 'MemberExpression';
    AST.Identifier = 'Identifier';
    AST.Literal = 'Literal';
    AST.ArrayExpression = 'ArrayExpression';
    AST.Property = 'Property';
    AST.ObjectExpression = 'ObjectExpression';
    AST.ThisExpression = 'ThisExpression';
    AST.NGValueParameter = 'NGValueParameter';
    AST.prototype = {
      ast: function(text) {
        this.text = text;
        this.tokens = this.lexer.lex(text);
        var value = this.program();
        if (this.tokens.length !== 0) {
          this.throwError('is an unexpected token', this.tokens[0]);
        }
        return value;
      },
      program: function() {
        var body = [];
        while (true) {
          if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
            body.push(this.expressionStatement());
          if (!this.expect(';')) {
            return {
              type: AST.Program,
              body: body
            };
          }
        }
      },
      expressionStatement: function() {
        return {
          type: AST.ExpressionStatement,
          expression: this.filterChain()
        };
      },
      filterChain: function() {
        var left = this.expression();
        var token;
        while ((token = this.expect('|'))) {
          left = this.filter(left);
        }
        return left;
      },
      expression: function() {
        return this.assignment();
      },
      assignment: function() {
        var result = this.ternary();
        if (this.expect('=')) {
          result = {
            type: AST.AssignmentExpression,
            left: result,
            right: this.assignment(),
            operator: '='
          };
        }
        return result;
      },
      ternary: function() {
        var test = this.logicalOR();
        var alternate;
        var consequent;
        if (this.expect('?')) {
          alternate = this.expression();
          if (this.consume(':')) {
            consequent = this.expression();
            return {
              type: AST.ConditionalExpression,
              test: test,
              alternate: alternate,
              consequent: consequent
            };
          }
        }
        return test;
      },
      logicalOR: function() {
        var left = this.logicalAND();
        while (this.expect('||')) {
          left = {
            type: AST.LogicalExpression,
            operator: '||',
            left: left,
            right: this.logicalAND()
          };
        }
        return left;
      },
      logicalAND: function() {
        var left = this.equality();
        while (this.expect('&&')) {
          left = {
            type: AST.LogicalExpression,
            operator: '&&',
            left: left,
            right: this.equality()
          };
        }
        return left;
      },
      equality: function() {
        var left = this.relational();
        var token;
        while ((token = this.expect('==', '!=', '===', '!=='))) {
          left = {
            type: AST.BinaryExpression,
            operator: token.text,
            left: left,
            right: this.relational()
          };
        }
        return left;
      },
      relational: function() {
        var left = this.additive();
        var token;
        while ((token = this.expect('<', '>', '<=', '>='))) {
          left = {
            type: AST.BinaryExpression,
            operator: token.text,
            left: left,
            right: this.additive()
          };
        }
        return left;
      },
      additive: function() {
        var left = this.multiplicative();
        var token;
        while ((token = this.expect('+', '-'))) {
          left = {
            type: AST.BinaryExpression,
            operator: token.text,
            left: left,
            right: this.multiplicative()
          };
        }
        return left;
      },
      multiplicative: function() {
        var left = this.unary();
        var token;
        while ((token = this.expect('*', '/', '%'))) {
          left = {
            type: AST.BinaryExpression,
            operator: token.text,
            left: left,
            right: this.unary()
          };
        }
        return left;
      },
      unary: function() {
        var token;
        if ((token = this.expect('+', '-', '!'))) {
          return {
            type: AST.UnaryExpression,
            operator: token.text,
            prefix: true,
            argument: this.unary()
          };
        } else {
          return this.primary();
        }
      },
      primary: function() {
        var primary;
        if (this.expect('(')) {
          primary = this.filterChain();
          this.consume(')');
        } else if (this.expect('[')) {
          primary = this.arrayDeclaration();
        } else if (this.expect('{')) {
          primary = this.object();
        } else if (this.constants.hasOwnProperty(this.peek().text)) {
          primary = copy(this.constants[this.consume().text]);
        } else if (this.peek().identifier) {
          primary = this.identifier();
        } else if (this.peek().constant) {
          primary = this.constant();
        } else {
          this.throwError('not a primary expression', this.peek());
        }
        var next;
        while ((next = this.expect('(', '[', '.'))) {
          if (next.text === '(') {
            primary = {
              type: AST.CallExpression,
              callee: primary,
              arguments: this.parseArguments()
            };
            this.consume(')');
          } else if (next.text === '[') {
            primary = {
              type: AST.MemberExpression,
              object: primary,
              property: this.expression(),
              computed: true
            };
            this.consume(']');
          } else if (next.text === '.') {
            primary = {
              type: AST.MemberExpression,
              object: primary,
              property: this.identifier(),
              computed: false
            };
          } else {
            this.throwError('IMPOSSIBLE');
          }
        }
        return primary;
      },
      filter: function(baseExpression) {
        var args = [baseExpression];
        var result = {
          type: AST.CallExpression,
          callee: this.identifier(),
          arguments: args,
          filter: true
        };
        while (this.expect(':')) {
          args.push(this.expression());
        }
        return result;
      },
      parseArguments: function() {
        var args = [];
        if (this.peekToken().text !== ')') {
          do {
            args.push(this.expression());
          } while (this.expect(','));
        }
        return args;
      },
      identifier: function() {
        var token = this.consume();
        if (!token.identifier) {
          this.throwError('is not a valid identifier', token);
        }
        return {
          type: AST.Identifier,
          name: token.text
        };
      },
      constant: function() {
        return {
          type: AST.Literal,
          value: this.consume().value
        };
      },
      arrayDeclaration: function() {
        var elements = [];
        if (this.peekToken().text !== ']') {
          do {
            if (this.peek(']')) {
              break;
            }
            elements.push(this.expression());
          } while (this.expect(','));
        }
        this.consume(']');
        return {
          type: AST.ArrayExpression,
          elements: elements
        };
      },
      object: function() {
        var properties = [],
            property;
        if (this.peekToken().text !== '}') {
          do {
            if (this.peek('}')) {
              break;
            }
            property = {
              type: AST.Property,
              kind: 'init'
            };
            if (this.peek().constant) {
              property.key = this.constant();
            } else if (this.peek().identifier) {
              property.key = this.identifier();
            } else {
              this.throwError("invalid key", this.peek());
            }
            this.consume(':');
            property.value = this.expression();
            properties.push(property);
          } while (this.expect(','));
        }
        this.consume('}');
        return {
          type: AST.ObjectExpression,
          properties: properties
        };
      },
      throwError: function(msg, token) {
        throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
      },
      consume: function(e1) {
        if (this.tokens.length === 0) {
          throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        }
        var token = this.expect(e1);
        if (!token) {
          this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
        }
        return token;
      },
      peekToken: function() {
        if (this.tokens.length === 0) {
          throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        }
        return this.tokens[0];
      },
      peek: function(e1, e2, e3, e4) {
        return this.peekAhead(0, e1, e2, e3, e4);
      },
      peekAhead: function(i, e1, e2, e3, e4) {
        if (this.tokens.length > i) {
          var token = this.tokens[i];
          var t = token.text;
          if (t === e1 || t === e2 || t === e3 || t === e4 || (!e1 && !e2 && !e3 && !e4)) {
            return token;
          }
        }
        return false;
      },
      expect: function(e1, e2, e3, e4) {
        var token = this.peek(e1, e2, e3, e4);
        if (token) {
          this.tokens.shift();
          return token;
        }
        return false;
      },
      constants: {
        'true': {
          type: AST.Literal,
          value: true
        },
        'false': {
          type: AST.Literal,
          value: false
        },
        'null': {
          type: AST.Literal,
          value: null
        },
        'undefined': {
          type: AST.Literal,
          value: undefined
        },
        'this': {type: AST.ThisExpression}
      }
    };
    function ifDefined(v, d) {
      return typeof v !== 'undefined' ? v : d;
    }
    function plusFn(l, r) {
      if (typeof l === 'undefined')
        return r;
      if (typeof r === 'undefined')
        return l;
      return l + r;
    }
    function isStateless($filter, filterName) {
      var fn = $filter(filterName);
      return !fn.$stateful;
    }
    function findConstantAndWatchExpressions(ast, $filter) {
      var allConstants;
      var argsToWatch;
      switch (ast.type) {
        case AST.Program:
          allConstants = true;
          forEach(ast.body, function(expr) {
            findConstantAndWatchExpressions(expr.expression, $filter);
            allConstants = allConstants && expr.expression.constant;
          });
          ast.constant = allConstants;
          break;
        case AST.Literal:
          ast.constant = true;
          ast.toWatch = [];
          break;
        case AST.UnaryExpression:
          findConstantAndWatchExpressions(ast.argument, $filter);
          ast.constant = ast.argument.constant;
          ast.toWatch = ast.argument.toWatch;
          break;
        case AST.BinaryExpression:
          findConstantAndWatchExpressions(ast.left, $filter);
          findConstantAndWatchExpressions(ast.right, $filter);
          ast.constant = ast.left.constant && ast.right.constant;
          ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
          break;
        case AST.LogicalExpression:
          findConstantAndWatchExpressions(ast.left, $filter);
          findConstantAndWatchExpressions(ast.right, $filter);
          ast.constant = ast.left.constant && ast.right.constant;
          ast.toWatch = ast.constant ? [] : [ast];
          break;
        case AST.ConditionalExpression:
          findConstantAndWatchExpressions(ast.test, $filter);
          findConstantAndWatchExpressions(ast.alternate, $filter);
          findConstantAndWatchExpressions(ast.consequent, $filter);
          ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
          ast.toWatch = ast.constant ? [] : [ast];
          break;
        case AST.Identifier:
          ast.constant = false;
          ast.toWatch = [ast];
          break;
        case AST.MemberExpression:
          findConstantAndWatchExpressions(ast.object, $filter);
          if (ast.computed) {
            findConstantAndWatchExpressions(ast.property, $filter);
          }
          ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
          ast.toWatch = [ast];
          break;
        case AST.CallExpression:
          allConstants = ast.filter ? isStateless($filter, ast.callee.name) : false;
          argsToWatch = [];
          forEach(ast.arguments, function(expr) {
            findConstantAndWatchExpressions(expr, $filter);
            allConstants = allConstants && expr.constant;
            if (!expr.constant) {
              argsToWatch.push.apply(argsToWatch, expr.toWatch);
            }
          });
          ast.constant = allConstants;
          ast.toWatch = ast.filter && isStateless($filter, ast.callee.name) ? argsToWatch : [ast];
          break;
        case AST.AssignmentExpression:
          findConstantAndWatchExpressions(ast.left, $filter);
          findConstantAndWatchExpressions(ast.right, $filter);
          ast.constant = ast.left.constant && ast.right.constant;
          ast.toWatch = [ast];
          break;
        case AST.ArrayExpression:
          allConstants = true;
          argsToWatch = [];
          forEach(ast.elements, function(expr) {
            findConstantAndWatchExpressions(expr, $filter);
            allConstants = allConstants && expr.constant;
            if (!expr.constant) {
              argsToWatch.push.apply(argsToWatch, expr.toWatch);
            }
          });
          ast.constant = allConstants;
          ast.toWatch = argsToWatch;
          break;
        case AST.ObjectExpression:
          allConstants = true;
          argsToWatch = [];
          forEach(ast.properties, function(property) {
            findConstantAndWatchExpressions(property.value, $filter);
            allConstants = allConstants && property.value.constant;
            if (!property.value.constant) {
              argsToWatch.push.apply(argsToWatch, property.value.toWatch);
            }
          });
          ast.constant = allConstants;
          ast.toWatch = argsToWatch;
          break;
        case AST.ThisExpression:
          ast.constant = false;
          ast.toWatch = [];
          break;
      }
    }
    function getInputs(body) {
      if (body.length != 1)
        return;
      var lastExpression = body[0].expression;
      var candidate = lastExpression.toWatch;
      if (candidate.length !== 1)
        return candidate;
      return candidate[0] !== lastExpression ? candidate : undefined;
    }
    function isAssignable(ast) {
      return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
    }
    function assignableAST(ast) {
      if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
        return {
          type: AST.AssignmentExpression,
          left: ast.body[0].expression,
          right: {type: AST.NGValueParameter},
          operator: '='
        };
      }
    }
    function isLiteral(ast) {
      return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
    }
    function isConstant(ast) {
      return ast.constant;
    }
    function ASTCompiler(astBuilder, $filter) {
      this.astBuilder = astBuilder;
      this.$filter = $filter;
    }
    ASTCompiler.prototype = {
      compile: function(expression, expensiveChecks) {
        var self = this;
        var ast = this.astBuilder.ast(expression);
        this.state = {
          nextId: 0,
          filters: {},
          expensiveChecks: expensiveChecks,
          fn: {
            vars: [],
            body: [],
            own: {}
          },
          assign: {
            vars: [],
            body: [],
            own: {}
          },
          inputs: []
        };
        findConstantAndWatchExpressions(ast, self.$filter);
        var extra = '';
        var assignable;
        this.stage = 'assign';
        if ((assignable = assignableAST(ast))) {
          this.state.computing = 'assign';
          var result = this.nextId();
          this.recurse(assignable, result);
          extra = 'fn.assign=' + this.generateFunction('assign', 's,v,l');
        }
        var toWatch = getInputs(ast.body);
        self.stage = 'inputs';
        forEach(toWatch, function(watch, key) {
          var fnKey = 'fn' + key;
          self.state[fnKey] = {
            vars: [],
            body: [],
            own: {}
          };
          self.state.computing = fnKey;
          var intoId = self.nextId();
          self.recurse(watch, intoId);
          self.return_(intoId);
          self.state.inputs.push(fnKey);
          watch.watchId = key;
        });
        this.state.computing = 'fn';
        this.stage = 'main';
        this.recurse(ast);
        var fnString = '"' + this.USE + ' ' + this.STRICT + '";\n' + this.filterPrefix() + 'var fn=' + this.generateFunction('fn', 's,l,a,i') + extra + this.watchFns() + 'return fn;';
        var fn = (new Function('$filter', 'ensureSafeMemberName', 'ensureSafeObject', 'ensureSafeFunction', 'ifDefined', 'plus', 'text', fnString))(this.$filter, ensureSafeMemberName, ensureSafeObject, ensureSafeFunction, ifDefined, plusFn, expression);
        this.state = this.stage = undefined;
        fn.literal = isLiteral(ast);
        fn.constant = isConstant(ast);
        return fn;
      },
      USE: 'use',
      STRICT: 'strict',
      watchFns: function() {
        var result = [];
        var fns = this.state.inputs;
        var self = this;
        forEach(fns, function(name) {
          result.push('var ' + name + '=' + self.generateFunction(name, 's'));
        });
        if (fns.length) {
          result.push('fn.inputs=[' + fns.join(',') + '];');
        }
        return result.join('');
      },
      generateFunction: function(name, params) {
        return 'function(' + params + '){' + this.varsPrefix(name) + this.body(name) + '};';
      },
      filterPrefix: function() {
        var parts = [];
        var self = this;
        forEach(this.state.filters, function(id, filter) {
          parts.push(id + '=$filter(' + self.escape(filter) + ')');
        });
        if (parts.length)
          return 'var ' + parts.join(',') + ';';
        return '';
      },
      varsPrefix: function(section) {
        return this.state[section].vars.length ? 'var ' + this.state[section].vars.join(',') + ';' : '';
      },
      body: function(section) {
        return this.state[section].body.join('');
      },
      recurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
        var left,
            right,
            self = this,
            args,
            expression;
        recursionFn = recursionFn || noop;
        if (!skipWatchIdCheck && isDefined(ast.watchId)) {
          intoId = intoId || this.nextId();
          this.if_('i', this.lazyAssign(intoId, this.computedMember('i', ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
          return;
        }
        switch (ast.type) {
          case AST.Program:
            forEach(ast.body, function(expression, pos) {
              self.recurse(expression.expression, undefined, undefined, function(expr) {
                right = expr;
              });
              if (pos !== ast.body.length - 1) {
                self.current().body.push(right, ';');
              } else {
                self.return_(right);
              }
            });
            break;
          case AST.Literal:
            expression = this.escape(ast.value);
            this.assign(intoId, expression);
            recursionFn(expression);
            break;
          case AST.UnaryExpression:
            this.recurse(ast.argument, undefined, undefined, function(expr) {
              right = expr;
            });
            expression = ast.operator + '(' + this.ifDefined(right, 0) + ')';
            this.assign(intoId, expression);
            recursionFn(expression);
            break;
          case AST.BinaryExpression:
            this.recurse(ast.left, undefined, undefined, function(expr) {
              left = expr;
            });
            this.recurse(ast.right, undefined, undefined, function(expr) {
              right = expr;
            });
            if (ast.operator === '+') {
              expression = this.plus(left, right);
            } else if (ast.operator === '-') {
              expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
            } else {
              expression = '(' + left + ')' + ast.operator + '(' + right + ')';
            }
            this.assign(intoId, expression);
            recursionFn(expression);
            break;
          case AST.LogicalExpression:
            intoId = intoId || this.nextId();
            self.recurse(ast.left, intoId);
            self.if_(ast.operator === '&&' ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
            recursionFn(intoId);
            break;
          case AST.ConditionalExpression:
            intoId = intoId || this.nextId();
            self.recurse(ast.test, intoId);
            self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
            recursionFn(intoId);
            break;
          case AST.Identifier:
            intoId = intoId || this.nextId();
            if (nameId) {
              nameId.context = self.stage === 'inputs' ? 's' : this.assign(this.nextId(), this.getHasOwnProperty('l', ast.name) + '?l:s');
              nameId.computed = false;
              nameId.name = ast.name;
            }
            ensureSafeMemberName(ast.name);
            self.if_(self.stage === 'inputs' || self.not(self.getHasOwnProperty('l', ast.name)), function() {
              self.if_(self.stage === 'inputs' || 's', function() {
                if (create && create !== 1) {
                  self.if_(self.not(self.nonComputedMember('s', ast.name)), self.lazyAssign(self.nonComputedMember('s', ast.name), '{}'));
                }
                self.assign(intoId, self.nonComputedMember('s', ast.name));
              });
            }, intoId && self.lazyAssign(intoId, self.nonComputedMember('l', ast.name)));
            if (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.name)) {
              self.addEnsureSafeObject(intoId);
            }
            recursionFn(intoId);
            break;
          case AST.MemberExpression:
            left = nameId && (nameId.context = this.nextId()) || this.nextId();
            intoId = intoId || this.nextId();
            self.recurse(ast.object, left, undefined, function() {
              self.if_(self.notNull(left), function() {
                if (ast.computed) {
                  right = self.nextId();
                  self.recurse(ast.property, right);
                  self.addEnsureSafeMemberName(right);
                  if (create && create !== 1) {
                    self.if_(self.not(self.computedMember(left, right)), self.lazyAssign(self.computedMember(left, right), '{}'));
                  }
                  expression = self.ensureSafeObject(self.computedMember(left, right));
                  self.assign(intoId, expression);
                  if (nameId) {
                    nameId.computed = true;
                    nameId.name = right;
                  }
                } else {
                  ensureSafeMemberName(ast.property.name);
                  if (create && create !== 1) {
                    self.if_(self.not(self.nonComputedMember(left, ast.property.name)), self.lazyAssign(self.nonComputedMember(left, ast.property.name), '{}'));
                  }
                  expression = self.nonComputedMember(left, ast.property.name);
                  if (self.state.expensiveChecks || isPossiblyDangerousMemberName(ast.property.name)) {
                    expression = self.ensureSafeObject(expression);
                  }
                  self.assign(intoId, expression);
                  if (nameId) {
                    nameId.computed = false;
                    nameId.name = ast.property.name;
                  }
                }
              }, function() {
                self.assign(intoId, 'undefined');
              });
              recursionFn(intoId);
            }, !!create);
            break;
          case AST.CallExpression:
            intoId = intoId || this.nextId();
            if (ast.filter) {
              right = self.filter(ast.callee.name);
              args = [];
              forEach(ast.arguments, function(expr) {
                var argument = self.nextId();
                self.recurse(expr, argument);
                args.push(argument);
              });
              expression = right + '(' + args.join(',') + ')';
              self.assign(intoId, expression);
              recursionFn(intoId);
            } else {
              right = self.nextId();
              left = {};
              args = [];
              self.recurse(ast.callee, right, left, function() {
                self.if_(self.notNull(right), function() {
                  self.addEnsureSafeFunction(right);
                  forEach(ast.arguments, function(expr) {
                    self.recurse(expr, self.nextId(), undefined, function(argument) {
                      args.push(self.ensureSafeObject(argument));
                    });
                  });
                  if (left.name) {
                    if (!self.state.expensiveChecks) {
                      self.addEnsureSafeObject(left.context);
                    }
                    expression = self.member(left.context, left.name, left.computed) + '(' + args.join(',') + ')';
                  } else {
                    expression = right + '(' + args.join(',') + ')';
                  }
                  expression = self.ensureSafeObject(expression);
                  self.assign(intoId, expression);
                }, function() {
                  self.assign(intoId, 'undefined');
                });
                recursionFn(intoId);
              });
            }
            break;
          case AST.AssignmentExpression:
            right = this.nextId();
            left = {};
            if (!isAssignable(ast.left)) {
              throw $parseMinErr('lval', 'Trying to assing a value to a non l-value');
            }
            this.recurse(ast.left, undefined, left, function() {
              self.if_(self.notNull(left.context), function() {
                self.recurse(ast.right, right);
                self.addEnsureSafeObject(self.member(left.context, left.name, left.computed));
                expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
                self.assign(intoId, expression);
                recursionFn(intoId || expression);
              });
            }, 1);
            break;
          case AST.ArrayExpression:
            args = [];
            forEach(ast.elements, function(expr) {
              self.recurse(expr, self.nextId(), undefined, function(argument) {
                args.push(argument);
              });
            });
            expression = '[' + args.join(',') + ']';
            this.assign(intoId, expression);
            recursionFn(expression);
            break;
          case AST.ObjectExpression:
            args = [];
            forEach(ast.properties, function(property) {
              self.recurse(property.value, self.nextId(), undefined, function(expr) {
                args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : ('' + property.key.value)) + ':' + expr);
              });
            });
            expression = '{' + args.join(',') + '}';
            this.assign(intoId, expression);
            recursionFn(expression);
            break;
          case AST.ThisExpression:
            this.assign(intoId, 's');
            recursionFn('s');
            break;
          case AST.NGValueParameter:
            this.assign(intoId, 'v');
            recursionFn('v');
            break;
        }
      },
      getHasOwnProperty: function(element, property) {
        var key = element + '.' + property;
        var own = this.current().own;
        if (!own.hasOwnProperty(key)) {
          own[key] = this.nextId(false, element + '&&(' + this.escape(property) + ' in ' + element + ')');
        }
        return own[key];
      },
      assign: function(id, value) {
        if (!id)
          return;
        this.current().body.push(id, '=', value, ';');
        return id;
      },
      filter: function(filterName) {
        if (!this.state.filters.hasOwnProperty(filterName)) {
          this.state.filters[filterName] = this.nextId(true);
        }
        return this.state.filters[filterName];
      },
      ifDefined: function(id, defaultValue) {
        return 'ifDefined(' + id + ',' + this.escape(defaultValue) + ')';
      },
      plus: function(left, right) {
        return 'plus(' + left + ',' + right + ')';
      },
      return_: function(id) {
        this.current().body.push('return ', id, ';');
      },
      if_: function(test, alternate, consequent) {
        if (test === true) {
          alternate();
        } else {
          var body = this.current().body;
          body.push('if(', test, '){');
          alternate();
          body.push('}');
          if (consequent) {
            body.push('else{');
            consequent();
            body.push('}');
          }
        }
      },
      not: function(expression) {
        return '!(' + expression + ')';
      },
      notNull: function(expression) {
        return expression + '!=null';
      },
      nonComputedMember: function(left, right) {
        return left + '.' + right;
      },
      computedMember: function(left, right) {
        return left + '[' + right + ']';
      },
      member: function(left, right, computed) {
        if (computed)
          return this.computedMember(left, right);
        return this.nonComputedMember(left, right);
      },
      addEnsureSafeObject: function(item) {
        this.current().body.push(this.ensureSafeObject(item), ';');
      },
      addEnsureSafeMemberName: function(item) {
        this.current().body.push(this.ensureSafeMemberName(item), ';');
      },
      addEnsureSafeFunction: function(item) {
        this.current().body.push(this.ensureSafeFunction(item), ';');
      },
      ensureSafeObject: function(item) {
        return 'ensureSafeObject(' + item + ',text)';
      },
      ensureSafeMemberName: function(item) {
        return 'ensureSafeMemberName(' + item + ',text)';
      },
      ensureSafeFunction: function(item) {
        return 'ensureSafeFunction(' + item + ',text)';
      },
      lazyRecurse: function(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
        var self = this;
        return function() {
          self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
        };
      },
      lazyAssign: function(id, value) {
        var self = this;
        return function() {
          self.assign(id, value);
        };
      },
      stringEscapeRegex: /[^ a-zA-Z0-9]/g,
      stringEscapeFn: function(c) {
        return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
      },
      escape: function(value) {
        if (isString(value))
          return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
        if (isNumber(value))
          return value.toString();
        if (value === true)
          return 'true';
        if (value === false)
          return 'false';
        if (value === null)
          return 'null';
        if (typeof value === 'undefined')
          return 'undefined';
        throw $parseMinErr('esc', 'IMPOSSIBLE');
      },
      nextId: function(skip, init) {
        var id = 'v' + (this.state.nextId++);
        if (!skip) {
          this.current().vars.push(id + (init ? '=' + init : ''));
        }
        return id;
      },
      current: function() {
        return this.state[this.state.computing];
      }
    };
    function ASTInterpreter(astBuilder, $filter) {
      this.astBuilder = astBuilder;
      this.$filter = $filter;
    }
    ASTInterpreter.prototype = {
      compile: function(expression, expensiveChecks) {
        var self = this;
        var ast = this.astBuilder.ast(expression);
        this.expression = expression;
        this.expensiveChecks = expensiveChecks;
        findConstantAndWatchExpressions(ast, self.$filter);
        var assignable;
        var assign;
        if ((assignable = assignableAST(ast))) {
          assign = this.recurse(assignable);
        }
        var toWatch = getInputs(ast.body);
        var inputs;
        if (toWatch) {
          inputs = [];
          forEach(toWatch, function(watch, key) {
            var input = self.recurse(watch);
            watch.input = input;
            inputs.push(input);
            watch.watchId = key;
          });
        }
        var expressions = [];
        forEach(ast.body, function(expression) {
          expressions.push(self.recurse(expression.expression));
        });
        var fn = ast.body.length === 0 ? function() {} : ast.body.length === 1 ? expressions[0] : function(scope, locals) {
          var lastValue;
          forEach(expressions, function(exp) {
            lastValue = exp(scope, locals);
          });
          return lastValue;
        };
        if (assign) {
          fn.assign = function(scope, value, locals) {
            return assign(scope, locals, value);
          };
        }
        if (inputs) {
          fn.inputs = inputs;
        }
        fn.literal = isLiteral(ast);
        fn.constant = isConstant(ast);
        return fn;
      },
      recurse: function(ast, context, create) {
        var left,
            right,
            self = this,
            args,
            expression;
        if (ast.input) {
          return this.inputs(ast.input, ast.watchId);
        }
        switch (ast.type) {
          case AST.Literal:
            return this.value(ast.value, context);
          case AST.UnaryExpression:
            right = this.recurse(ast.argument);
            return this['unary' + ast.operator](right, context);
          case AST.BinaryExpression:
            left = this.recurse(ast.left);
            right = this.recurse(ast.right);
            return this['binary' + ast.operator](left, right, context);
          case AST.LogicalExpression:
            left = this.recurse(ast.left);
            right = this.recurse(ast.right);
            return this['binary' + ast.operator](left, right, context);
          case AST.ConditionalExpression:
            return this['ternary?:'](this.recurse(ast.test), this.recurse(ast.alternate), this.recurse(ast.consequent), context);
          case AST.Identifier:
            ensureSafeMemberName(ast.name, self.expression);
            return self.identifier(ast.name, self.expensiveChecks || isPossiblyDangerousMemberName(ast.name), context, create, self.expression);
          case AST.MemberExpression:
            left = this.recurse(ast.object, false, !!create);
            if (!ast.computed) {
              ensureSafeMemberName(ast.property.name, self.expression);
              right = ast.property.name;
            }
            if (ast.computed)
              right = this.recurse(ast.property);
            return ast.computed ? this.computedMember(left, right, context, create, self.expression) : this.nonComputedMember(left, right, self.expensiveChecks, context, create, self.expression);
          case AST.CallExpression:
            args = [];
            forEach(ast.arguments, function(expr) {
              args.push(self.recurse(expr));
            });
            if (ast.filter)
              right = this.$filter(ast.callee.name);
            if (!ast.filter)
              right = this.recurse(ast.callee, true);
            return ast.filter ? function(scope, locals, assign, inputs) {
              var values = [];
              for (var i = 0; i < args.length; ++i) {
                values.push(args[i](scope, locals, assign, inputs));
              }
              var value = right.apply(undefined, values, inputs);
              return context ? {
                context: undefined,
                name: undefined,
                value: value
              } : value;
            } : function(scope, locals, assign, inputs) {
              var rhs = right(scope, locals, assign, inputs);
              var value;
              if (rhs.value != null) {
                ensureSafeObject(rhs.context, self.expression);
                ensureSafeFunction(rhs.value, self.expression);
                var values = [];
                for (var i = 0; i < args.length; ++i) {
                  values.push(ensureSafeObject(args[i](scope, locals, assign, inputs), self.expression));
                }
                value = ensureSafeObject(rhs.value.apply(rhs.context, values), self.expression);
              }
              return context ? {value: value} : value;
            };
          case AST.AssignmentExpression:
            left = this.recurse(ast.left, true, 1);
            right = this.recurse(ast.right);
            return function(scope, locals, assign, inputs) {
              var lhs = left(scope, locals, assign, inputs);
              var rhs = right(scope, locals, assign, inputs);
              ensureSafeObject(lhs.value, self.expression);
              lhs.context[lhs.name] = rhs;
              return context ? {value: rhs} : rhs;
            };
          case AST.ArrayExpression:
            args = [];
            forEach(ast.elements, function(expr) {
              args.push(self.recurse(expr));
            });
            return function(scope, locals, assign, inputs) {
              var value = [];
              for (var i = 0; i < args.length; ++i) {
                value.push(args[i](scope, locals, assign, inputs));
              }
              return context ? {value: value} : value;
            };
          case AST.ObjectExpression:
            args = [];
            forEach(ast.properties, function(property) {
              args.push({
                key: property.key.type === AST.Identifier ? property.key.name : ('' + property.key.value),
                value: self.recurse(property.value)
              });
            });
            return function(scope, locals, assign, inputs) {
              var value = {};
              for (var i = 0; i < args.length; ++i) {
                value[args[i].key] = args[i].value(scope, locals, assign, inputs);
              }
              return context ? {value: value} : value;
            };
          case AST.ThisExpression:
            return function(scope) {
              return context ? {value: scope} : scope;
            };
          case AST.NGValueParameter:
            return function(scope, locals, assign, inputs) {
              return context ? {value: assign} : assign;
            };
        }
      },
      'unary+': function(argument, context) {
        return function(scope, locals, assign, inputs) {
          var arg = argument(scope, locals, assign, inputs);
          if (isDefined(arg)) {
            arg = +arg;
          } else {
            arg = 0;
          }
          return context ? {value: arg} : arg;
        };
      },
      'unary-': function(argument, context) {
        return function(scope, locals, assign, inputs) {
          var arg = argument(scope, locals, assign, inputs);
          if (isDefined(arg)) {
            arg = -arg;
          } else {
            arg = 0;
          }
          return context ? {value: arg} : arg;
        };
      },
      'unary!': function(argument, context) {
        return function(scope, locals, assign, inputs) {
          var arg = !argument(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary+': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var lhs = left(scope, locals, assign, inputs);
          var rhs = right(scope, locals, assign, inputs);
          var arg = plusFn(lhs, rhs);
          return context ? {value: arg} : arg;
        };
      },
      'binary-': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var lhs = left(scope, locals, assign, inputs);
          var rhs = right(scope, locals, assign, inputs);
          var arg = (isDefined(lhs) ? lhs : 0) - (isDefined(rhs) ? rhs : 0);
          return context ? {value: arg} : arg;
        };
      },
      'binary*': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) * right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary/': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) / right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary%': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) % right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary===': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) === right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary!==': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) !== right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary==': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) == right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary!=': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) != right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary<': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) < right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary>': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) > right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary<=': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) <= right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary>=': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) >= right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary&&': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) && right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'binary||': function(left, right, context) {
        return function(scope, locals, assign, inputs) {
          var arg = left(scope, locals, assign, inputs) || right(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      'ternary?:': function(test, alternate, consequent, context) {
        return function(scope, locals, assign, inputs) {
          var arg = test(scope, locals, assign, inputs) ? alternate(scope, locals, assign, inputs) : consequent(scope, locals, assign, inputs);
          return context ? {value: arg} : arg;
        };
      },
      value: function(value, context) {
        return function() {
          return context ? {
            context: undefined,
            name: undefined,
            value: value
          } : value;
        };
      },
      identifier: function(name, expensiveChecks, context, create, expression) {
        return function(scope, locals, assign, inputs) {
          var base = locals && (name in locals) ? locals : scope;
          if (create && create !== 1 && base && !(base[name])) {
            base[name] = {};
          }
          var value = base ? base[name] : undefined;
          if (expensiveChecks) {
            ensureSafeObject(value, expression);
          }
          if (context) {
            return {
              context: base,
              name: name,
              value: value
            };
          } else {
            return value;
          }
        };
      },
      computedMember: function(left, right, context, create, expression) {
        return function(scope, locals, assign, inputs) {
          var lhs = left(scope, locals, assign, inputs);
          var rhs;
          var value;
          if (lhs != null) {
            rhs = right(scope, locals, assign, inputs);
            ensureSafeMemberName(rhs, expression);
            if (create && create !== 1 && lhs && !(lhs[rhs])) {
              lhs[rhs] = {};
            }
            value = lhs[rhs];
            ensureSafeObject(value, expression);
          }
          if (context) {
            return {
              context: lhs,
              name: rhs,
              value: value
            };
          } else {
            return value;
          }
        };
      },
      nonComputedMember: function(left, right, expensiveChecks, context, create, expression) {
        return function(scope, locals, assign, inputs) {
          var lhs = left(scope, locals, assign, inputs);
          if (create && create !== 1 && lhs && !(lhs[right])) {
            lhs[right] = {};
          }
          var value = lhs != null ? lhs[right] : undefined;
          if (expensiveChecks || isPossiblyDangerousMemberName(right)) {
            ensureSafeObject(value, expression);
          }
          if (context) {
            return {
              context: lhs,
              name: right,
              value: value
            };
          } else {
            return value;
          }
        };
      },
      inputs: function(input, watchId) {
        return function(scope, value, locals, inputs) {
          if (inputs)
            return inputs[watchId];
          return input(scope, value, locals);
        };
      }
    };
    var Parser = function(lexer, $filter, options) {
      this.lexer = lexer;
      this.$filter = $filter;
      this.options = options;
      this.ast = new AST(this.lexer);
      this.astCompiler = options.csp ? new ASTInterpreter(this.ast, $filter) : new ASTCompiler(this.ast, $filter);
    };
    Parser.prototype = {
      constructor: Parser,
      parse: function(text) {
        return this.astCompiler.compile(text, this.options.expensiveChecks);
      }
    };
    var getterFnCacheDefault = createMap();
    var getterFnCacheExpensive = createMap();
    function isPossiblyDangerousMemberName(name) {
      return name == 'constructor';
    }
    var objectValueOf = Object.prototype.valueOf;
    function getValueOf(value) {
      return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
    }
    function $ParseProvider() {
      var cacheDefault = createMap();
      var cacheExpensive = createMap();
      this.$get = ['$filter', function($filter) {
        var noUnsafeEval = csp().noUnsafeEval;
        var $parseOptions = {
          csp: noUnsafeEval,
          expensiveChecks: false
        },
            $parseOptionsExpensive = {
              csp: noUnsafeEval,
              expensiveChecks: true
            };
        return function $parse(exp, interceptorFn, expensiveChecks) {
          var parsedExpression,
              oneTime,
              cacheKey;
          switch (typeof exp) {
            case 'string':
              exp = exp.trim();
              cacheKey = exp;
              var cache = (expensiveChecks ? cacheExpensive : cacheDefault);
              parsedExpression = cache[cacheKey];
              if (!parsedExpression) {
                if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
                  oneTime = true;
                  exp = exp.substring(2);
                }
                var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions;
                var lexer = new Lexer(parseOptions);
                var parser = new Parser(lexer, $filter, parseOptions);
                parsedExpression = parser.parse(exp);
                if (parsedExpression.constant) {
                  parsedExpression.$$watchDelegate = constantWatchDelegate;
                } else if (oneTime) {
                  parsedExpression.$$watchDelegate = parsedExpression.literal ? oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
                } else if (parsedExpression.inputs) {
                  parsedExpression.$$watchDelegate = inputsWatchDelegate;
                }
                cache[cacheKey] = parsedExpression;
              }
              return addInterceptor(parsedExpression, interceptorFn);
            case 'function':
              return addInterceptor(exp, interceptorFn);
            default:
              return noop;
          }
        };
        function expressionInputDirtyCheck(newValue, oldValueOfValue) {
          if (newValue == null || oldValueOfValue == null) {
            return newValue === oldValueOfValue;
          }
          if (typeof newValue === 'object') {
            newValue = getValueOf(newValue);
            if (typeof newValue === 'object') {
              return false;
            }
          }
          return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
        }
        function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression, prettyPrintExpression) {
          var inputExpressions = parsedExpression.inputs;
          var lastResult;
          if (inputExpressions.length === 1) {
            var oldInputValueOf = expressionInputDirtyCheck;
            inputExpressions = inputExpressions[0];
            return scope.$watch(function expressionInputWatch(scope) {
              var newInputValue = inputExpressions(scope);
              if (!expressionInputDirtyCheck(newInputValue, oldInputValueOf)) {
                lastResult = parsedExpression(scope, undefined, undefined, [newInputValue]);
                oldInputValueOf = newInputValue && getValueOf(newInputValue);
              }
              return lastResult;
            }, listener, objectEquality, prettyPrintExpression);
          }
          var oldInputValueOfValues = [];
          var oldInputValues = [];
          for (var i = 0,
              ii = inputExpressions.length; i < ii; i++) {
            oldInputValueOfValues[i] = expressionInputDirtyCheck;
            oldInputValues[i] = null;
          }
          return scope.$watch(function expressionInputsWatch(scope) {
            var changed = false;
            for (var i = 0,
                ii = inputExpressions.length; i < ii; i++) {
              var newInputValue = inputExpressions[i](scope);
              if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
                oldInputValues[i] = newInputValue;
                oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
              }
            }
            if (changed) {
              lastResult = parsedExpression(scope, undefined, undefined, oldInputValues);
            }
            return lastResult;
          }, listener, objectEquality, prettyPrintExpression);
        }
        function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch,
              lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            if (isDefined(value)) {
              scope.$$postDigest(function() {
                if (isDefined(lastValue)) {
                  unwatch();
                }
              });
            }
          }, objectEquality);
        }
        function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch,
              lastValue;
          return unwatch = scope.$watch(function oneTimeWatch(scope) {
            return parsedExpression(scope);
          }, function oneTimeListener(value, old, scope) {
            lastValue = value;
            if (isFunction(listener)) {
              listener.call(this, value, old, scope);
            }
            if (isAllDefined(value)) {
              scope.$$postDigest(function() {
                if (isAllDefined(lastValue))
                  unwatch();
              });
            }
          }, objectEquality);
          function isAllDefined(value) {
            var allDefined = true;
            forEach(value, function(val) {
              if (!isDefined(val))
                allDefined = false;
            });
            return allDefined;
          }
        }
        function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
          var unwatch;
          return unwatch = scope.$watch(function constantWatch(scope) {
            return parsedExpression(scope);
          }, function constantListener(value, old, scope) {
            if (isFunction(listener)) {
              listener.apply(this, arguments);
            }
            unwatch();
          }, objectEquality);
        }
        function addInterceptor(parsedExpression, interceptorFn) {
          if (!interceptorFn)
            return parsedExpression;
          var watchDelegate = parsedExpression.$$watchDelegate;
          var regularWatch = watchDelegate !== oneTimeLiteralWatchDelegate && watchDelegate !== oneTimeWatchDelegate;
          var fn = regularWatch ? function regularInterceptedExpression(scope, locals, assign, inputs) {
            var value = parsedExpression(scope, locals, assign, inputs);
            return interceptorFn(value, scope, locals);
          } : function oneTimeInterceptedExpression(scope, locals, assign, inputs) {
            var value = parsedExpression(scope, locals, assign, inputs);
            var result = interceptorFn(value, scope, locals);
            return isDefined(value) ? result : value;
          };
          if (parsedExpression.$$watchDelegate && parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
            fn.$$watchDelegate = parsedExpression.$$watchDelegate;
          } else if (!interceptorFn.$stateful) {
            fn.$$watchDelegate = inputsWatchDelegate;
            fn.inputs = parsedExpression.inputs ? parsedExpression.inputs : [parsedExpression];
          }
          return fn;
        }
      }];
    }
    function $QProvider() {
      this.$get = ['$rootScope', '$exceptionHandler', function($rootScope, $exceptionHandler) {
        return qFactory(function(callback) {
          $rootScope.$evalAsync(callback);
        }, $exceptionHandler);
      }];
    }
    function $$QProvider() {
      this.$get = ['$browser', '$exceptionHandler', function($browser, $exceptionHandler) {
        return qFactory(function(callback) {
          $browser.defer(callback);
        }, $exceptionHandler);
      }];
    }
    function qFactory(nextTick, exceptionHandler) {
      var $qMinErr = minErr('$q', TypeError);
      function callOnce(self, resolveFn, rejectFn) {
        var called = false;
        function wrap(fn) {
          return function(value) {
            if (called)
              return;
            called = true;
            fn.call(self, value);
          };
        }
        return [wrap(resolveFn), wrap(rejectFn)];
      }
      var defer = function() {
        return new Deferred();
      };
      function Promise() {
        this.$$state = {status: 0};
      }
      extend(Promise.prototype, {
        then: function(onFulfilled, onRejected, progressBack) {
          if (isUndefined(onFulfilled) && isUndefined(onRejected) && isUndefined(progressBack)) {
            return this;
          }
          var result = new Deferred();
          this.$$state.pending = this.$$state.pending || [];
          this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
          if (this.$$state.status > 0)
            scheduleProcessQueue(this.$$state);
          return result.promise;
        },
        "catch": function(callback) {
          return this.then(null, callback);
        },
        "finally": function(callback, progressBack) {
          return this.then(function(value) {
            return handleCallback(value, true, callback);
          }, function(error) {
            return handleCallback(error, false, callback);
          }, progressBack);
        }
      });
      function simpleBind(context, fn) {
        return function(value) {
          fn.call(context, value);
        };
      }
      function processQueue(state) {
        var fn,
            deferred,
            pending;
        pending = state.pending;
        state.processScheduled = false;
        state.pending = undefined;
        for (var i = 0,
            ii = pending.length; i < ii; ++i) {
          deferred = pending[i][0];
          fn = pending[i][state.status];
          try {
            if (isFunction(fn)) {
              deferred.resolve(fn(state.value));
            } else if (state.status === 1) {
              deferred.resolve(state.value);
            } else {
              deferred.reject(state.value);
            }
          } catch (e) {
            deferred.reject(e);
            exceptionHandler(e);
          }
        }
      }
      function scheduleProcessQueue(state) {
        if (state.processScheduled || !state.pending)
          return;
        state.processScheduled = true;
        nextTick(function() {
          processQueue(state);
        });
      }
      function Deferred() {
        this.promise = new Promise();
        this.resolve = simpleBind(this, this.resolve);
        this.reject = simpleBind(this, this.reject);
        this.notify = simpleBind(this, this.notify);
      }
      extend(Deferred.prototype, {
        resolve: function(val) {
          if (this.promise.$$state.status)
            return;
          if (val === this.promise) {
            this.$$reject($qMinErr('qcycle', "Expected promise to be resolved with value other than itself '{0}'", val));
          } else {
            this.$$resolve(val);
          }
        },
        $$resolve: function(val) {
          var then,
              fns;
          fns = callOnce(this, this.$$resolve, this.$$reject);
          try {
            if ((isObject(val) || isFunction(val)))
              then = val && val.then;
            if (isFunction(then)) {
              this.promise.$$state.status = -1;
              then.call(val, fns[0], fns[1], this.notify);
            } else {
              this.promise.$$state.value = val;
              this.promise.$$state.status = 1;
              scheduleProcessQueue(this.promise.$$state);
            }
          } catch (e) {
            fns[1](e);
            exceptionHandler(e);
          }
        },
        reject: function(reason) {
          if (this.promise.$$state.status)
            return;
          this.$$reject(reason);
        },
        $$reject: function(reason) {
          this.promise.$$state.value = reason;
          this.promise.$$state.status = 2;
          scheduleProcessQueue(this.promise.$$state);
        },
        notify: function(progress) {
          var callbacks = this.promise.$$state.pending;
          if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
            nextTick(function() {
              var callback,
                  result;
              for (var i = 0,
                  ii = callbacks.length; i < ii; i++) {
                result = callbacks[i][0];
                callback = callbacks[i][3];
                try {
                  result.notify(isFunction(callback) ? callback(progress) : progress);
                } catch (e) {
                  exceptionHandler(e);
                }
              }
            });
          }
        }
      });
      var reject = function(reason) {
        var result = new Deferred();
        result.reject(reason);
        return result.promise;
      };
      var makePromise = function makePromise(value, resolved) {
        var result = new Deferred();
        if (resolved) {
          result.resolve(value);
        } else {
          result.reject(value);
        }
        return result.promise;
      };
      var handleCallback = function handleCallback(value, isResolved, callback) {
        var callbackOutput = null;
        try {
          if (isFunction(callback))
            callbackOutput = callback();
        } catch (e) {
          return makePromise(e, false);
        }
        if (isPromiseLike(callbackOutput)) {
          return callbackOutput.then(function() {
            return makePromise(value, isResolved);
          }, function(error) {
            return makePromise(error, false);
          });
        } else {
          return makePromise(value, isResolved);
        }
      };
      var when = function(value, callback, errback, progressBack) {
        var result = new Deferred();
        result.resolve(value);
        return result.promise.then(callback, errback, progressBack);
      };
      var resolve = when;
      function all(promises) {
        var deferred = new Deferred(),
            counter = 0,
            results = isArray(promises) ? [] : {};
        forEach(promises, function(promise, key) {
          counter++;
          when(promise).then(function(value) {
            if (results.hasOwnProperty(key))
              return;
            results[key] = value;
            if (!(--counter))
              deferred.resolve(results);
          }, function(reason) {
            if (results.hasOwnProperty(key))
              return;
            deferred.reject(reason);
          });
        });
        if (counter === 0) {
          deferred.resolve(results);
        }
        return deferred.promise;
      }
      var $Q = function Q(resolver) {
        if (!isFunction(resolver)) {
          throw $qMinErr('norslvr', "Expected resolverFn, got '{0}'", resolver);
        }
        if (!(this instanceof Q)) {
          return new Q(resolver);
        }
        var deferred = new Deferred();
        function resolveFn(value) {
          deferred.resolve(value);
        }
        function rejectFn(reason) {
          deferred.reject(reason);
        }
        resolver(resolveFn, rejectFn);
        return deferred.promise;
      };
      $Q.defer = defer;
      $Q.reject = reject;
      $Q.when = when;
      $Q.resolve = resolve;
      $Q.all = all;
      return $Q;
    }
    function $$RAFProvider() {
      this.$get = ['$window', '$timeout', function($window, $timeout) {
        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame;
        var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || $window.webkitCancelRequestAnimationFrame;
        var rafSupported = !!requestAnimationFrame;
        var rafFn = rafSupported ? function(fn) {
          var id = requestAnimationFrame(fn);
          return function() {
            cancelAnimationFrame(id);
          };
        } : function(fn) {
          var timer = $timeout(fn, 16.66, false);
          return function() {
            $timeout.cancel(timer);
          };
        };
        queueFn.supported = rafSupported;
        var cancelLastRAF;
        var taskCount = 0;
        var taskQueue = [];
        return queueFn;
        function flush() {
          for (var i = 0; i < taskQueue.length; i++) {
            var task = taskQueue[i];
            if (task) {
              taskQueue[i] = null;
              task();
            }
          }
          taskCount = taskQueue.length = 0;
        }
        function queueFn(asyncFn) {
          var index = taskQueue.length;
          taskCount++;
          taskQueue.push(asyncFn);
          if (index === 0) {
            cancelLastRAF = rafFn(flush);
          }
          return function cancelQueueFn() {
            if (index >= 0) {
              taskQueue[index] = null;
              index = null;
              if (--taskCount === 0 && cancelLastRAF) {
                cancelLastRAF();
                cancelLastRAF = null;
                taskQueue.length = 0;
              }
            }
          };
        }
      }];
    }
    function $RootScopeProvider() {
      var TTL = 10;
      var $rootScopeMinErr = minErr('$rootScope');
      var lastDirtyWatch = null;
      var applyAsyncId = null;
      this.digestTtl = function(value) {
        if (arguments.length) {
          TTL = value;
        }
        return TTL;
      };
      function createChildScopeClass(parent) {
        function ChildScope() {
          this.$$watchers = this.$$nextSibling = this.$$childHead = this.$$childTail = null;
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$watchersCount = 0;
          this.$id = nextUid();
          this.$$ChildScope = null;
        }
        ChildScope.prototype = parent;
        return ChildScope;
      }
      this.$get = ['$injector', '$exceptionHandler', '$parse', '$browser', function($injector, $exceptionHandler, $parse, $browser) {
        function destroyChildScope($event) {
          $event.currentScope.$$destroyed = true;
        }
        function Scope() {
          this.$id = nextUid();
          this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
          this.$root = this;
          this.$$destroyed = false;
          this.$$listeners = {};
          this.$$listenerCount = {};
          this.$$watchersCount = 0;
          this.$$isolateBindings = null;
        }
        Scope.prototype = {
          constructor: Scope,
          $new: function(isolate, parent) {
            var child;
            parent = parent || this;
            if (isolate) {
              child = new Scope();
              child.$root = this.$root;
            } else {
              if (!this.$$ChildScope) {
                this.$$ChildScope = createChildScopeClass(this);
              }
              child = new this.$$ChildScope();
            }
            child.$parent = parent;
            child.$$prevSibling = parent.$$childTail;
            if (parent.$$childHead) {
              parent.$$childTail.$$nextSibling = child;
              parent.$$childTail = child;
            } else {
              parent.$$childHead = parent.$$childTail = child;
            }
            if (isolate || parent != this)
              child.$on('$destroy', destroyChildScope);
            return child;
          },
          $watch: function(watchExp, listener, objectEquality, prettyPrintExpression) {
            var get = $parse(watchExp);
            if (get.$$watchDelegate) {
              return get.$$watchDelegate(this, listener, objectEquality, get, watchExp);
            }
            var scope = this,
                array = scope.$$watchers,
                watcher = {
                  fn: listener,
                  last: initWatchVal,
                  get: get,
                  exp: prettyPrintExpression || watchExp,
                  eq: !!objectEquality
                };
            lastDirtyWatch = null;
            if (!isFunction(listener)) {
              watcher.fn = noop;
            }
            if (!array) {
              array = scope.$$watchers = [];
            }
            array.unshift(watcher);
            incrementWatchersCount(this, 1);
            return function deregisterWatch() {
              if (arrayRemove(array, watcher) >= 0) {
                incrementWatchersCount(scope, -1);
              }
              lastDirtyWatch = null;
            };
          },
          $watchGroup: function(watchExpressions, listener) {
            var oldValues = new Array(watchExpressions.length);
            var newValues = new Array(watchExpressions.length);
            var deregisterFns = [];
            var self = this;
            var changeReactionScheduled = false;
            var firstRun = true;
            if (!watchExpressions.length) {
              var shouldCall = true;
              self.$evalAsync(function() {
                if (shouldCall)
                  listener(newValues, newValues, self);
              });
              return function deregisterWatchGroup() {
                shouldCall = false;
              };
            }
            if (watchExpressions.length === 1) {
              return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
                newValues[0] = value;
                oldValues[0] = oldValue;
                listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
              });
            }
            forEach(watchExpressions, function(expr, i) {
              var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
                newValues[i] = value;
                oldValues[i] = oldValue;
                if (!changeReactionScheduled) {
                  changeReactionScheduled = true;
                  self.$evalAsync(watchGroupAction);
                }
              });
              deregisterFns.push(unwatchFn);
            });
            function watchGroupAction() {
              changeReactionScheduled = false;
              if (firstRun) {
                firstRun = false;
                listener(newValues, newValues, self);
              } else {
                listener(newValues, oldValues, self);
              }
            }
            return function deregisterWatchGroup() {
              while (deregisterFns.length) {
                deregisterFns.shift()();
              }
            };
          },
          $watchCollection: function(obj, listener) {
            $watchCollectionInterceptor.$stateful = true;
            var self = this;
            var newValue;
            var oldValue;
            var veryOldValue;
            var trackVeryOldValue = (listener.length > 1);
            var changeDetected = 0;
            var changeDetector = $parse(obj, $watchCollectionInterceptor);
            var internalArray = [];
            var internalObject = {};
            var initRun = true;
            var oldLength = 0;
            function $watchCollectionInterceptor(_value) {
              newValue = _value;
              var newLength,
                  key,
                  bothNaN,
                  newItem,
                  oldItem;
              if (isUndefined(newValue))
                return;
              if (!isObject(newValue)) {
                if (oldValue !== newValue) {
                  oldValue = newValue;
                  changeDetected++;
                }
              } else if (isArrayLike(newValue)) {
                if (oldValue !== internalArray) {
                  oldValue = internalArray;
                  oldLength = oldValue.length = 0;
                  changeDetected++;
                }
                newLength = newValue.length;
                if (oldLength !== newLength) {
                  changeDetected++;
                  oldValue.length = oldLength = newLength;
                }
                for (var i = 0; i < newLength; i++) {
                  oldItem = oldValue[i];
                  newItem = newValue[i];
                  bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                  if (!bothNaN && (oldItem !== newItem)) {
                    changeDetected++;
                    oldValue[i] = newItem;
                  }
                }
              } else {
                if (oldValue !== internalObject) {
                  oldValue = internalObject = {};
                  oldLength = 0;
                  changeDetected++;
                }
                newLength = 0;
                for (key in newValue) {
                  if (newValue.hasOwnProperty(key)) {
                    newLength++;
                    newItem = newValue[key];
                    oldItem = oldValue[key];
                    if (key in oldValue) {
                      bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                      if (!bothNaN && (oldItem !== newItem)) {
                        changeDetected++;
                        oldValue[key] = newItem;
                      }
                    } else {
                      oldLength++;
                      oldValue[key] = newItem;
                      changeDetected++;
                    }
                  }
                }
                if (oldLength > newLength) {
                  changeDetected++;
                  for (key in oldValue) {
                    if (!newValue.hasOwnProperty(key)) {
                      oldLength--;
                      delete oldValue[key];
                    }
                  }
                }
              }
              return changeDetected;
            }
            function $watchCollectionAction() {
              if (initRun) {
                initRun = false;
                listener(newValue, newValue, self);
              } else {
                listener(newValue, veryOldValue, self);
              }
              if (trackVeryOldValue) {
                if (!isObject(newValue)) {
                  veryOldValue = newValue;
                } else if (isArrayLike(newValue)) {
                  veryOldValue = new Array(newValue.length);
                  for (var i = 0; i < newValue.length; i++) {
                    veryOldValue[i] = newValue[i];
                  }
                } else {
                  veryOldValue = {};
                  for (var key in newValue) {
                    if (hasOwnProperty.call(newValue, key)) {
                      veryOldValue[key] = newValue[key];
                    }
                  }
                }
              }
            }
            return this.$watch(changeDetector, $watchCollectionAction);
          },
          $digest: function() {
            var watch,
                value,
                last,
                watchers,
                length,
                dirty,
                ttl = TTL,
                next,
                current,
                target = this,
                watchLog = [],
                logIdx,
                logMsg,
                asyncTask;
            beginPhase('$digest');
            $browser.$$checkUrlChange();
            if (this === $rootScope && applyAsyncId !== null) {
              $browser.defer.cancel(applyAsyncId);
              flushApplyAsync();
            }
            lastDirtyWatch = null;
            do {
              dirty = false;
              current = target;
              while (asyncQueue.length) {
                try {
                  asyncTask = asyncQueue.shift();
                  asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
                } catch (e) {
                  $exceptionHandler(e);
                }
                lastDirtyWatch = null;
              }
              traverseScopesLoop: do {
                if ((watchers = current.$$watchers)) {
                  length = watchers.length;
                  while (length--) {
                    try {
                      watch = watchers[length];
                      if (watch) {
                        if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : (typeof value === 'number' && typeof last === 'number' && isNaN(value) && isNaN(last)))) {
                          dirty = true;
                          lastDirtyWatch = watch;
                          watch.last = watch.eq ? copy(value, null) : value;
                          watch.fn(value, ((last === initWatchVal) ? value : last), current);
                          if (ttl < 5) {
                            logIdx = 4 - ttl;
                            if (!watchLog[logIdx])
                              watchLog[logIdx] = [];
                            watchLog[logIdx].push({
                              msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                              newVal: value,
                              oldVal: last
                            });
                          }
                        } else if (watch === lastDirtyWatch) {
                          dirty = false;
                          break traverseScopesLoop;
                        }
                      }
                    } catch (e) {
                      $exceptionHandler(e);
                    }
                  }
                }
                if (!(next = ((current.$$watchersCount && current.$$childHead) || (current !== target && current.$$nextSibling)))) {
                  while (current !== target && !(next = current.$$nextSibling)) {
                    current = current.$parent;
                  }
                }
              } while ((current = next));
              if ((dirty || asyncQueue.length) && !(ttl--)) {
                clearPhase();
                throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, watchLog);
              }
            } while (dirty || asyncQueue.length);
            clearPhase();
            while (postDigestQueue.length) {
              try {
                postDigestQueue.shift()();
              } catch (e) {
                $exceptionHandler(e);
              }
            }
          },
          $destroy: function() {
            if (this.$$destroyed)
              return;
            var parent = this.$parent;
            this.$broadcast('$destroy');
            this.$$destroyed = true;
            if (this === $rootScope) {
              $browser.$$applicationDestroyed();
            }
            incrementWatchersCount(this, -this.$$watchersCount);
            for (var eventName in this.$$listenerCount) {
              decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
            }
            if (parent && parent.$$childHead == this)
              parent.$$childHead = this.$$nextSibling;
            if (parent && parent.$$childTail == this)
              parent.$$childTail = this.$$prevSibling;
            if (this.$$prevSibling)
              this.$$prevSibling.$$nextSibling = this.$$nextSibling;
            if (this.$$nextSibling)
              this.$$nextSibling.$$prevSibling = this.$$prevSibling;
            this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
            this.$on = this.$watch = this.$watchGroup = function() {
              return noop;
            };
            this.$$listeners = {};
            this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = this.$root = this.$$watchers = null;
          },
          $eval: function(expr, locals) {
            return $parse(expr)(this, locals);
          },
          $evalAsync: function(expr, locals) {
            if (!$rootScope.$$phase && !asyncQueue.length) {
              $browser.defer(function() {
                if (asyncQueue.length) {
                  $rootScope.$digest();
                }
              });
            }
            asyncQueue.push({
              scope: this,
              expression: expr,
              locals: locals
            });
          },
          $$postDigest: function(fn) {
            postDigestQueue.push(fn);
          },
          $apply: function(expr) {
            try {
              beginPhase('$apply');
              try {
                return this.$eval(expr);
              } finally {
                clearPhase();
              }
            } catch (e) {
              $exceptionHandler(e);
            } finally {
              try {
                $rootScope.$digest();
              } catch (e) {
                $exceptionHandler(e);
                throw e;
              }
            }
          },
          $applyAsync: function(expr) {
            var scope = this;
            expr && applyAsyncQueue.push($applyAsyncExpression);
            scheduleApplyAsync();
            function $applyAsyncExpression() {
              scope.$eval(expr);
            }
          },
          $on: function(name, listener) {
            var namedListeners = this.$$listeners[name];
            if (!namedListeners) {
              this.$$listeners[name] = namedListeners = [];
            }
            namedListeners.push(listener);
            var current = this;
            do {
              if (!current.$$listenerCount[name]) {
                current.$$listenerCount[name] = 0;
              }
              current.$$listenerCount[name]++;
            } while ((current = current.$parent));
            var self = this;
            return function() {
              var indexOfListener = namedListeners.indexOf(listener);
              if (indexOfListener !== -1) {
                namedListeners[indexOfListener] = null;
                decrementListenerCount(self, 1, name);
              }
            };
          },
          $emit: function(name, args) {
            var empty = [],
                namedListeners,
                scope = this,
                stopPropagation = false,
                event = {
                  name: name,
                  targetScope: scope,
                  stopPropagation: function() {
                    stopPropagation = true;
                  },
                  preventDefault: function() {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                },
                listenerArgs = concat([event], arguments, 1),
                i,
                length;
            do {
              namedListeners = scope.$$listeners[name] || empty;
              event.currentScope = scope;
              for (i = 0, length = namedListeners.length; i < length; i++) {
                if (!namedListeners[i]) {
                  namedListeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  namedListeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (stopPropagation) {
                event.currentScope = null;
                return event;
              }
              scope = scope.$parent;
            } while (scope);
            event.currentScope = null;
            return event;
          },
          $broadcast: function(name, args) {
            var target = this,
                current = target,
                next = target,
                event = {
                  name: name,
                  targetScope: target,
                  preventDefault: function() {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                };
            if (!target.$$listenerCount[name])
              return event;
            var listenerArgs = concat([event], arguments, 1),
                listeners,
                i,
                length;
            while ((current = next)) {
              event.currentScope = current;
              listeners = current.$$listeners[name] || [];
              for (i = 0, length = listeners.length; i < length; i++) {
                if (!listeners[i]) {
                  listeners.splice(i, 1);
                  i--;
                  length--;
                  continue;
                }
                try {
                  listeners[i].apply(null, listenerArgs);
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
              if (!(next = ((current.$$listenerCount[name] && current.$$childHead) || (current !== target && current.$$nextSibling)))) {
                while (current !== target && !(next = current.$$nextSibling)) {
                  current = current.$parent;
                }
              }
            }
            event.currentScope = null;
            return event;
          }
        };
        var $rootScope = new Scope();
        var asyncQueue = $rootScope.$$asyncQueue = [];
        var postDigestQueue = $rootScope.$$postDigestQueue = [];
        var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
        return $rootScope;
        function beginPhase(phase) {
          if ($rootScope.$$phase) {
            throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
          }
          $rootScope.$$phase = phase;
        }
        function clearPhase() {
          $rootScope.$$phase = null;
        }
        function incrementWatchersCount(current, count) {
          do {
            current.$$watchersCount += count;
          } while ((current = current.$parent));
        }
        function decrementListenerCount(current, count, name) {
          do {
            current.$$listenerCount[name] -= count;
            if (current.$$listenerCount[name] === 0) {
              delete current.$$listenerCount[name];
            }
          } while ((current = current.$parent));
        }
        function initWatchVal() {}
        function flushApplyAsync() {
          while (applyAsyncQueue.length) {
            try {
              applyAsyncQueue.shift()();
            } catch (e) {
              $exceptionHandler(e);
            }
          }
          applyAsyncId = null;
        }
        function scheduleApplyAsync() {
          if (applyAsyncId === null) {
            applyAsyncId = $browser.defer(function() {
              $rootScope.$apply(flushApplyAsync);
            });
          }
        }
      }];
    }
    function $$SanitizeUriProvider() {
      var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
          imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
      this.aHrefSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          aHrefSanitizationWhitelist = regexp;
          return this;
        }
        return aHrefSanitizationWhitelist;
      };
      this.imgSrcSanitizationWhitelist = function(regexp) {
        if (isDefined(regexp)) {
          imgSrcSanitizationWhitelist = regexp;
          return this;
        }
        return imgSrcSanitizationWhitelist;
      };
      this.$get = function() {
        return function sanitizeUri(uri, isImage) {
          var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
          var normalizedVal;
          normalizedVal = urlResolve(uri).href;
          if (normalizedVal !== '' && !normalizedVal.match(regex)) {
            return 'unsafe:' + normalizedVal;
          }
          return uri;
        };
      };
    }
    var $sceMinErr = minErr('$sce');
    var SCE_CONTEXTS = {
      HTML: 'html',
      CSS: 'css',
      URL: 'url',
      RESOURCE_URL: 'resourceUrl',
      JS: 'js'
    };
    function adjustMatcher(matcher) {
      if (matcher === 'self') {
        return matcher;
      } else if (isString(matcher)) {
        if (matcher.indexOf('***') > -1) {
          throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
        }
        matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
        return new RegExp('^' + matcher + '$');
      } else if (isRegExp(matcher)) {
        return new RegExp('^' + matcher.source + '$');
      } else {
        throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
      }
    }
    function adjustMatchers(matchers) {
      var adjustedMatchers = [];
      if (isDefined(matchers)) {
        forEach(matchers, function(matcher) {
          adjustedMatchers.push(adjustMatcher(matcher));
        });
      }
      return adjustedMatchers;
    }
    function $SceDelegateProvider() {
      this.SCE_CONTEXTS = SCE_CONTEXTS;
      var resourceUrlWhitelist = ['self'],
          resourceUrlBlacklist = [];
      this.resourceUrlWhitelist = function(value) {
        if (arguments.length) {
          resourceUrlWhitelist = adjustMatchers(value);
        }
        return resourceUrlWhitelist;
      };
      this.resourceUrlBlacklist = function(value) {
        if (arguments.length) {
          resourceUrlBlacklist = adjustMatchers(value);
        }
        return resourceUrlBlacklist;
      };
      this.$get = ['$injector', function($injector) {
        var htmlSanitizer = function htmlSanitizer(html) {
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        };
        if ($injector.has('$sanitize')) {
          htmlSanitizer = $injector.get('$sanitize');
        }
        function matchUrl(matcher, parsedUrl) {
          if (matcher === 'self') {
            return urlIsSameOrigin(parsedUrl);
          } else {
            return !!matcher.exec(parsedUrl.href);
          }
        }
        function isResourceUrlAllowedByPolicy(url) {
          var parsedUrl = urlResolve(url.toString());
          var i,
              n,
              allowed = false;
          for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
            if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
              allowed = true;
              break;
            }
          }
          if (allowed) {
            for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
              if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                allowed = false;
                break;
              }
            }
          }
          return allowed;
        }
        function generateHolderType(Base) {
          var holderType = function TrustedValueHolderType(trustedValue) {
            this.$$unwrapTrustedValue = function() {
              return trustedValue;
            };
          };
          if (Base) {
            holderType.prototype = new Base();
          }
          holderType.prototype.valueOf = function sceValueOf() {
            return this.$$unwrapTrustedValue();
          };
          holderType.prototype.toString = function sceToString() {
            return this.$$unwrapTrustedValue().toString();
          };
          return holderType;
        }
        var trustedValueHolderBase = generateHolderType(),
            byType = {};
        byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
        byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
        function trustAs(type, trustedValue) {
          var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
          if (!Constructor) {
            throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
          }
          if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
            return trustedValue;
          }
          if (typeof trustedValue !== 'string') {
            throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
          }
          return new Constructor(trustedValue);
        }
        function valueOf(maybeTrusted) {
          if (maybeTrusted instanceof trustedValueHolderBase) {
            return maybeTrusted.$$unwrapTrustedValue();
          } else {
            return maybeTrusted;
          }
        }
        function getTrusted(type, maybeTrusted) {
          if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
            return maybeTrusted;
          }
          var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
          if (constructor && maybeTrusted instanceof constructor) {
            return maybeTrusted.$$unwrapTrustedValue();
          }
          if (type === SCE_CONTEXTS.RESOURCE_URL) {
            if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
              return maybeTrusted;
            } else {
              throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
            }
          } else if (type === SCE_CONTEXTS.HTML) {
            return htmlSanitizer(maybeTrusted);
          }
          throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
        }
        return {
          trustAs: trustAs,
          getTrusted: getTrusted,
          valueOf: valueOf
        };
      }];
    }
    function $SceProvider() {
      var enabled = true;
      this.enabled = function(value) {
        if (arguments.length) {
          enabled = !!value;
        }
        return enabled;
      };
      this.$get = ['$parse', '$sceDelegate', function($parse, $sceDelegate) {
        if (enabled && msie < 8) {
          throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
        }
        var sce = shallowCopy(SCE_CONTEXTS);
        sce.isEnabled = function() {
          return enabled;
        };
        sce.trustAs = $sceDelegate.trustAs;
        sce.getTrusted = $sceDelegate.getTrusted;
        sce.valueOf = $sceDelegate.valueOf;
        if (!enabled) {
          sce.trustAs = sce.getTrusted = function(type, value) {
            return value;
          };
          sce.valueOf = identity;
        }
        sce.parseAs = function sceParseAs(type, expr) {
          var parsed = $parse(expr);
          if (parsed.literal && parsed.constant) {
            return parsed;
          } else {
            return $parse(expr, function(value) {
              return sce.getTrusted(type, value);
            });
          }
        };
        var parse = sce.parseAs,
            getTrusted = sce.getTrusted,
            trustAs = sce.trustAs;
        forEach(SCE_CONTEXTS, function(enumValue, name) {
          var lName = lowercase(name);
          sce[camelCase("parse_as_" + lName)] = function(expr) {
            return parse(enumValue, expr);
          };
          sce[camelCase("get_trusted_" + lName)] = function(value) {
            return getTrusted(enumValue, value);
          };
          sce[camelCase("trust_as_" + lName)] = function(value) {
            return trustAs(enumValue, value);
          };
        });
        return sce;
      }];
    }
    function $SnifferProvider() {
      this.$get = ['$window', '$document', function($window, $document) {
        var eventSupport = {},
            android = toInt((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
            boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
            document = $document[0] || {},
            vendorPrefix,
            vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/,
            bodyStyle = document.body && document.body.style,
            transitions = false,
            animations = false,
            match;
        if (bodyStyle) {
          for (var prop in bodyStyle) {
            if (match = vendorRegex.exec(prop)) {
              vendorPrefix = match[0];
              vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
              break;
            }
          }
          if (!vendorPrefix) {
            vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
          }
          transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
          animations = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));
          if (android && (!transitions || !animations)) {
            transitions = isString(bodyStyle.webkitTransition);
            animations = isString(bodyStyle.webkitAnimation);
          }
        }
        return {
          history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
          hasEvent: function(event) {
            if (event === 'input' && msie <= 11)
              return false;
            if (isUndefined(eventSupport[event])) {
              var divElm = document.createElement('div');
              eventSupport[event] = 'on' + event in divElm;
            }
            return eventSupport[event];
          },
          csp: csp(),
          vendorPrefix: vendorPrefix,
          transitions: transitions,
          animations: animations,
          android: android
        };
      }];
    }
    var $compileMinErr = minErr('$compile');
    function $TemplateRequestProvider() {
      this.$get = ['$templateCache', '$http', '$q', '$sce', function($templateCache, $http, $q, $sce) {
        function handleRequestFn(tpl, ignoreRequestError) {
          handleRequestFn.totalPendingRequests++;
          if (!isString(tpl) || !$templateCache.get(tpl)) {
            tpl = $sce.getTrustedResourceUrl(tpl);
          }
          var transformResponse = $http.defaults && $http.defaults.transformResponse;
          if (isArray(transformResponse)) {
            transformResponse = transformResponse.filter(function(transformer) {
              return transformer !== defaultHttpResponseTransform;
            });
          } else if (transformResponse === defaultHttpResponseTransform) {
            transformResponse = null;
          }
          var httpOptions = {
            cache: $templateCache,
            transformResponse: transformResponse
          };
          return $http.get(tpl, httpOptions)['finally'](function() {
            handleRequestFn.totalPendingRequests--;
          }).then(function(response) {
            $templateCache.put(tpl, response.data);
            return response.data;
          }, handleError);
          function handleError(resp) {
            if (!ignoreRequestError) {
              throw $compileMinErr('tpload', 'Failed to load template: {0} (HTTP status: {1} {2})', tpl, resp.status, resp.statusText);
            }
            return $q.reject(resp);
          }
        }
        handleRequestFn.totalPendingRequests = 0;
        return handleRequestFn;
      }];
    }
    function $$TestabilityProvider() {
      this.$get = ['$rootScope', '$browser', '$location', function($rootScope, $browser, $location) {
        var testability = {};
        testability.findBindings = function(element, expression, opt_exactMatch) {
          var bindings = element.getElementsByClassName('ng-binding');
          var matches = [];
          forEach(bindings, function(binding) {
            var dataBinding = angular.element(binding).data('$binding');
            if (dataBinding) {
              forEach(dataBinding, function(bindingName) {
                if (opt_exactMatch) {
                  var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
                  if (matcher.test(bindingName)) {
                    matches.push(binding);
                  }
                } else {
                  if (bindingName.indexOf(expression) != -1) {
                    matches.push(binding);
                  }
                }
              });
            }
          });
          return matches;
        };
        testability.findModels = function(element, expression, opt_exactMatch) {
          var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
          for (var p = 0; p < prefixes.length; ++p) {
            var attributeEquals = opt_exactMatch ? '=' : '*=';
            var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
            var elements = element.querySelectorAll(selector);
            if (elements.length) {
              return elements;
            }
          }
        };
        testability.getLocation = function() {
          return $location.url();
        };
        testability.setLocation = function(url) {
          if (url !== $location.url()) {
            $location.url(url);
            $rootScope.$digest();
          }
        };
        testability.whenStable = function(callback) {
          $browser.notifyWhenNoOutstandingRequests(callback);
        };
        return testability;
      }];
    }
    function $TimeoutProvider() {
      this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler', function($rootScope, $browser, $q, $$q, $exceptionHandler) {
        var deferreds = {};
        function timeout(fn, delay, invokeApply) {
          if (!isFunction(fn)) {
            invokeApply = delay;
            delay = fn;
            fn = noop;
          }
          var args = sliceArgs(arguments, 3),
              skipApply = (isDefined(invokeApply) && !invokeApply),
              deferred = (skipApply ? $$q : $q).defer(),
              promise = deferred.promise,
              timeoutId;
          timeoutId = $browser.defer(function() {
            try {
              deferred.resolve(fn.apply(null, args));
            } catch (e) {
              deferred.reject(e);
              $exceptionHandler(e);
            } finally {
              delete deferreds[promise.$$timeoutId];
            }
            if (!skipApply)
              $rootScope.$apply();
          }, delay);
          promise.$$timeoutId = timeoutId;
          deferreds[timeoutId] = deferred;
          return promise;
        }
        timeout.cancel = function(promise) {
          if (promise && promise.$$timeoutId in deferreds) {
            deferreds[promise.$$timeoutId].reject('canceled');
            delete deferreds[promise.$$timeoutId];
            return $browser.defer.cancel(promise.$$timeoutId);
          }
          return false;
        };
        return timeout;
      }];
    }
    var urlParsingNode = document.createElement("a");
    var originUrl = urlResolve(window.location.href);
    function urlResolve(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
      };
    }
    function urlIsSameOrigin(requestUrl) {
      var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
      return (parsed.protocol === originUrl.protocol && parsed.host === originUrl.host);
    }
    function $WindowProvider() {
      this.$get = valueFn(window);
    }
    function $$CookieReader($document) {
      var rawDocument = $document[0] || {};
      var lastCookies = {};
      var lastCookieString = '';
      function safeDecodeURIComponent(str) {
        try {
          return decodeURIComponent(str);
        } catch (e) {
          return str;
        }
      }
      return function() {
        var cookieArray,
            cookie,
            i,
            index,
            name;
        var currentCookieString = rawDocument.cookie || '';
        if (currentCookieString !== lastCookieString) {
          lastCookieString = currentCookieString;
          cookieArray = lastCookieString.split('; ');
          lastCookies = {};
          for (i = 0; i < cookieArray.length; i++) {
            cookie = cookieArray[i];
            index = cookie.indexOf('=');
            if (index > 0) {
              name = safeDecodeURIComponent(cookie.substring(0, index));
              if (lastCookies[name] === undefined) {
                lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
              }
            }
          }
        }
        return lastCookies;
      };
    }
    $$CookieReader.$inject = ['$document'];
    function $$CookieReaderProvider() {
      this.$get = $$CookieReader;
    }
    $FilterProvider.$inject = ['$provide'];
    function $FilterProvider($provide) {
      var suffix = 'Filter';
      function register(name, factory) {
        if (isObject(name)) {
          var filters = {};
          forEach(name, function(filter, key) {
            filters[key] = register(key, filter);
          });
          return filters;
        } else {
          return $provide.factory(name + suffix, factory);
        }
      }
      this.register = register;
      this.$get = ['$injector', function($injector) {
        return function(name) {
          return $injector.get(name + suffix);
        };
      }];
      register('currency', currencyFilter);
      register('date', dateFilter);
      register('filter', filterFilter);
      register('json', jsonFilter);
      register('limitTo', limitToFilter);
      register('lowercase', lowercaseFilter);
      register('number', numberFilter);
      register('orderBy', orderByFilter);
      register('uppercase', uppercaseFilter);
    }
    function filterFilter() {
      return function(array, expression, comparator) {
        if (!isArrayLike(array)) {
          if (array == null) {
            return array;
          } else {
            throw minErr('filter')('notarray', 'Expected array but received: {0}', array);
          }
        }
        var expressionType = getTypeForFilter(expression);
        var predicateFn;
        var matchAgainstAnyProp;
        switch (expressionType) {
          case 'function':
            predicateFn = expression;
            break;
          case 'boolean':
          case 'null':
          case 'number':
          case 'string':
            matchAgainstAnyProp = true;
          case 'object':
            predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
            break;
          default:
            return array;
        }
        return Array.prototype.filter.call(array, predicateFn);
      };
    }
    function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
      var shouldMatchPrimitives = isObject(expression) && ('$' in expression);
      var predicateFn;
      if (comparator === true) {
        comparator = equals;
      } else if (!isFunction(comparator)) {
        comparator = function(actual, expected) {
          if (isUndefined(actual)) {
            return false;
          }
          if ((actual === null) || (expected === null)) {
            return actual === expected;
          }
          if (isObject(expected) || (isObject(actual) && !hasCustomToString(actual))) {
            return false;
          }
          actual = lowercase('' + actual);
          expected = lowercase('' + expected);
          return actual.indexOf(expected) !== -1;
        };
      }
      predicateFn = function(item) {
        if (shouldMatchPrimitives && !isObject(item)) {
          return deepCompare(item, expression.$, comparator, false);
        }
        return deepCompare(item, expression, comparator, matchAgainstAnyProp);
      };
      return predicateFn;
    }
    function deepCompare(actual, expected, comparator, matchAgainstAnyProp, dontMatchWholeObject) {
      var actualType = getTypeForFilter(actual);
      var expectedType = getTypeForFilter(expected);
      if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
        return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
      } else if (isArray(actual)) {
        return actual.some(function(item) {
          return deepCompare(item, expected, comparator, matchAgainstAnyProp);
        });
      }
      switch (actualType) {
        case 'object':
          var key;
          if (matchAgainstAnyProp) {
            for (key in actual) {
              if ((key.charAt(0) !== '$') && deepCompare(actual[key], expected, comparator, true)) {
                return true;
              }
            }
            return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, false);
          } else if (expectedType === 'object') {
            for (key in expected) {
              var expectedVal = expected[key];
              if (isFunction(expectedVal) || isUndefined(expectedVal)) {
                continue;
              }
              var matchAnyProperty = key === '$';
              var actualVal = matchAnyProperty ? actual : actual[key];
              if (!deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, matchAnyProperty)) {
                return false;
              }
            }
            return true;
          } else {
            return comparator(actual, expected);
          }
          break;
        case 'function':
          return false;
        default:
          return comparator(actual, expected);
      }
    }
    function getTypeForFilter(val) {
      return (val === null) ? 'null' : typeof val;
    }
    currencyFilter.$inject = ['$locale'];
    function currencyFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function(amount, currencySymbol, fractionSize) {
        if (isUndefined(currencySymbol)) {
          currencySymbol = formats.CURRENCY_SYM;
        }
        if (isUndefined(fractionSize)) {
          fractionSize = formats.PATTERNS[1].maxFrac;
        }
        return (amount == null) ? amount : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).replace(/\u00A4/g, currencySymbol);
      };
    }
    numberFilter.$inject = ['$locale'];
    function numberFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function(number, fractionSize) {
        return (number == null) ? number : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
      };
    }
    var DECIMAL_SEP = '.';
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
      if (isObject(number))
        return '';
      var isNegative = number < 0;
      number = Math.abs(number);
      var isInfinity = number === Infinity;
      if (!isInfinity && !isFinite(number))
        return '';
      var numStr = number + '',
          formatedText = '',
          hasExponent = false,
          parts = [];
      if (isInfinity)
        formatedText = '\u221e';
      if (!isInfinity && numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] == '-' && match[3] > fractionSize + 1) {
          number = 0;
        } else {
          formatedText = numStr;
          hasExponent = true;
        }
      }
      if (!isInfinity && !hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
        if (isUndefined(fractionSize)) {
          fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }
        number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);
        var fraction = ('' + number).split(DECIMAL_SEP);
        var whole = fraction[0];
        fraction = fraction[1] || '';
        var i,
            pos = 0,
            lgroup = pattern.lgSize,
            group = pattern.gSize;
        if (whole.length >= (lgroup + group)) {
          pos = whole.length - lgroup;
          for (i = 0; i < pos; i++) {
            if ((pos - i) % group === 0 && i !== 0) {
              formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
          }
        }
        for (i = pos; i < whole.length; i++) {
          if ((whole.length - i) % lgroup === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
        while (fraction.length < fractionSize) {
          fraction += '0';
        }
        if (fractionSize && fractionSize !== "0")
          formatedText += decimalSep + fraction.substr(0, fractionSize);
      } else {
        if (fractionSize > 0 && number < 1) {
          formatedText = number.toFixed(fractionSize);
          number = parseFloat(formatedText);
        }
      }
      if (number === 0) {
        isNegative = false;
      }
      parts.push(isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf);
      return parts.join('');
    }
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg = '-';
        num = -num;
      }
      num = '' + num;
      while (num.length < digits)
        num = '0' + num;
      if (trim) {
        num = num.substr(num.length - digits);
      }
      return neg + num;
    }
    function dateGetter(name, size, offset, trim) {
      offset = offset || 0;
      return function(date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset) {
          value += offset;
        }
        if (value === 0 && offset == -12)
          value = 12;
        return padNumber(value, size, trim);
      };
    }
    function dateStrGetter(name, shortForm) {
      return function(date, formats) {
        var value = date['get' + name]();
        var get = uppercase(shortForm ? ('SHORT' + name) : name);
        return formats[get][value];
      };
    }
    function timeZoneGetter(date, formats, offset) {
      var zone = -1 * offset;
      var paddedZone = (zone >= 0) ? "+" : "";
      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
      return paddedZone;
    }
    function getFirstThursdayOfYear(year) {
      var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
      return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
    }
    function getThursdayThisWeek(datetime) {
      return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate() + (4 - datetime.getDay()));
    }
    function weekGetter(size) {
      return function(date) {
        var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
            thisThurs = getThursdayThisWeek(date);
        var diff = +thisThurs - +firstThurs,
            result = 1 + Math.round(diff / 6.048e8);
        return padNumber(result, size);
      };
    }
    function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    function eraGetter(date, formats) {
      return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
    }
    function longEraGetter(date, formats) {
      return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
    }
    var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
      yy: dateGetter('FullYear', 2, 0, true),
      y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
      MMM: dateStrGetter('Month', true),
      MM: dateGetter('Month', 2, 1),
      M: dateGetter('Month', 1, 1),
      dd: dateGetter('Date', 2),
      d: dateGetter('Date', 1),
      HH: dateGetter('Hours', 2),
      H: dateGetter('Hours', 1),
      hh: dateGetter('Hours', 2, -12),
      h: dateGetter('Hours', 1, -12),
      mm: dateGetter('Minutes', 2),
      m: dateGetter('Minutes', 1),
      ss: dateGetter('Seconds', 2),
      s: dateGetter('Seconds', 1),
      sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
      EEE: dateStrGetter('Day', true),
      a: ampmGetter,
      Z: timeZoneGetter,
      ww: weekGetter(2),
      w: weekGetter(1),
      G: eraGetter,
      GG: eraGetter,
      GGG: eraGetter,
      GGGG: longEraGetter
    };
    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
        NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ['$locale'];
    function dateFilter($locale) {
      var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
      function jsonStringToDate(string) {
        var match;
        if (match = string.match(R_ISO8601_STR)) {
          var date = new Date(0),
              tzHour = 0,
              tzMin = 0,
              dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
              timeSetter = match[8] ? date.setUTCHours : date.setHours;
          if (match[9]) {
            tzHour = toInt(match[9] + match[10]);
            tzMin = toInt(match[9] + match[11]);
          }
          dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
          var h = toInt(match[4] || 0) - tzHour;
          var m = toInt(match[5] || 0) - tzMin;
          var s = toInt(match[6] || 0);
          var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
          timeSetter.call(date, h, m, s, ms);
          return date;
        }
        return string;
      }
      return function(date, format, timezone) {
        var text = '',
            parts = [],
            fn,
            match;
        format = format || 'mediumDate';
        format = $locale.DATETIME_FORMATS[format] || format;
        if (isString(date)) {
          date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
        }
        if (isNumber(date)) {
          date = new Date(date);
        }
        if (!isDate(date) || !isFinite(date.getTime())) {
          return date;
        }
        while (format) {
          match = DATE_FORMATS_SPLIT.exec(format);
          if (match) {
            parts = concat(parts, match, 1);
            format = parts.pop();
          } else {
            parts.push(format);
            format = null;
          }
        }
        var dateTimezoneOffset = date.getTimezoneOffset();
        if (timezone) {
          dateTimezoneOffset = timezoneToOffset(timezone, date.getTimezoneOffset());
          date = convertTimezoneToLocal(date, timezone, true);
        }
        forEach(parts, function(value) {
          fn = DATE_FORMATS[value];
          text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset) : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
        });
        return text;
      };
    }
    function jsonFilter() {
      return function(object, spacing) {
        if (isUndefined(spacing)) {
          spacing = 2;
        }
        return toJson(object, spacing);
      };
    }
    var lowercaseFilter = valueFn(lowercase);
    var uppercaseFilter = valueFn(uppercase);
    function limitToFilter() {
      return function(input, limit, begin) {
        if (Math.abs(Number(limit)) === Infinity) {
          limit = Number(limit);
        } else {
          limit = toInt(limit);
        }
        if (isNaN(limit))
          return input;
        if (isNumber(input))
          input = input.toString();
        if (!isArray(input) && !isString(input))
          return input;
        begin = (!begin || isNaN(begin)) ? 0 : toInt(begin);
        begin = (begin < 0 && begin >= -input.length) ? input.length + begin : begin;
        if (limit >= 0) {
          return input.slice(begin, begin + limit);
        } else {
          if (begin === 0) {
            return input.slice(limit, input.length);
          } else {
            return input.slice(Math.max(0, begin + limit), begin);
          }
        }
      };
    }
    orderByFilter.$inject = ['$parse'];
    function orderByFilter($parse) {
      return function(array, sortPredicate, reverseOrder) {
        if (!(isArrayLike(array)))
          return array;
        if (!isArray(sortPredicate)) {
          sortPredicate = [sortPredicate];
        }
        if (sortPredicate.length === 0) {
          sortPredicate = ['+'];
        }
        var predicates = processPredicates(sortPredicate, reverseOrder);
        predicates.push({
          get: function() {
            return {};
          },
          descending: reverseOrder ? -1 : 1
        });
        var compareValues = Array.prototype.map.call(array, getComparisonObject);
        compareValues.sort(doComparison);
        array = compareValues.map(function(item) {
          return item.value;
        });
        return array;
        function getComparisonObject(value, index) {
          return {
            value: value,
            predicateValues: predicates.map(function(predicate) {
              return getPredicateValue(predicate.get(value), index);
            })
          };
        }
        function doComparison(v1, v2) {
          var result = 0;
          for (var index = 0,
              length = predicates.length; index < length; ++index) {
            result = compare(v1.predicateValues[index], v2.predicateValues[index]) * predicates[index].descending;
            if (result)
              break;
          }
          return result;
        }
      };
      function processPredicates(sortPredicate, reverseOrder) {
        reverseOrder = reverseOrder ? -1 : 1;
        return sortPredicate.map(function(predicate) {
          var descending = 1,
              get = identity;
          if (isFunction(predicate)) {
            get = predicate;
          } else if (isString(predicate)) {
            if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
              descending = predicate.charAt(0) == '-' ? -1 : 1;
              predicate = predicate.substring(1);
            }
            if (predicate !== '') {
              get = $parse(predicate);
              if (get.constant) {
                var key = get();
                get = function(value) {
                  return value[key];
                };
              }
            }
          }
          return {
            get: get,
            descending: descending * reverseOrder
          };
        });
      }
      function isPrimitive(value) {
        switch (typeof value) {
          case 'number':
          case 'boolean':
          case 'string':
            return true;
          default:
            return false;
        }
      }
      function objectValue(value, index) {
        if (typeof value.valueOf === 'function') {
          value = value.valueOf();
          if (isPrimitive(value))
            return value;
        }
        if (hasCustomToString(value)) {
          value = value.toString();
          if (isPrimitive(value))
            return value;
        }
        return index;
      }
      function getPredicateValue(value, index) {
        var type = typeof value;
        if (value === null) {
          type = 'string';
          value = 'null';
        } else if (type === 'string') {
          value = value.toLowerCase();
        } else if (type === 'object') {
          value = objectValue(value, index);
        }
        return {
          value: value,
          type: type
        };
      }
      function compare(v1, v2) {
        var result = 0;
        if (v1.type === v2.type) {
          if (v1.value !== v2.value) {
            result = v1.value < v2.value ? -1 : 1;
          }
        } else {
          result = v1.type < v2.type ? -1 : 1;
        }
        return result;
      }
    }
    function ngDirective(directive) {
      if (isFunction(directive)) {
        directive = {link: directive};
      }
      directive.restrict = directive.restrict || 'AC';
      return valueFn(directive);
    }
    var htmlAnchorDirective = valueFn({
      restrict: 'E',
      compile: function(element, attr) {
        if (!attr.href && !attr.xlinkHref) {
          return function(scope, element) {
            if (element[0].nodeName.toLowerCase() !== 'a')
              return;
            var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
            element.on('click', function(event) {
              if (!element.attr(href)) {
                event.preventDefault();
              }
            });
          };
        }
      }
    });
    var ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function(propName, attrName) {
      if (propName == "multiple")
        return;
      function defaultLinkFn(scope, element, attr) {
        scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
          attr.$set(attrName, !!value);
        });
      }
      var normalized = directiveNormalize('ng-' + attrName);
      var linkFn = defaultLinkFn;
      if (propName === 'checked') {
        linkFn = function(scope, element, attr) {
          if (attr.ngModel !== attr[normalized]) {
            defaultLinkFn(scope, element, attr);
          }
        };
      }
      ngAttributeAliasDirectives[normalized] = function() {
        return {
          restrict: 'A',
          priority: 100,
          link: linkFn
        };
      };
    });
    forEach(ALIASED_ATTR, function(htmlAttr, ngAttr) {
      ngAttributeAliasDirectives[ngAttr] = function() {
        return {
          priority: 100,
          link: function(scope, element, attr) {
            if (ngAttr === "ngPattern" && attr.ngPattern.charAt(0) == "/") {
              var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
              if (match) {
                attr.$set("ngPattern", new RegExp(match[1], match[2]));
                return;
              }
            }
            scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
              attr.$set(ngAttr, value);
            });
          }
        };
      };
    });
    forEach(['src', 'srcset', 'href'], function(attrName) {
      var normalized = directiveNormalize('ng-' + attrName);
      ngAttributeAliasDirectives[normalized] = function() {
        return {
          priority: 99,
          link: function(scope, element, attr) {
            var propName = attrName,
                name = attrName;
            if (attrName === 'href' && toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
              name = 'xlinkHref';
              attr.$attr[name] = 'xlink:href';
              propName = null;
            }
            attr.$observe(normalized, function(value) {
              if (!value) {
                if (attrName === 'href') {
                  attr.$set(name, null);
                }
                return;
              }
              attr.$set(name, value);
              if (msie && propName)
                element.prop(propName, attr[name]);
            });
          }
        };
      };
    });
    var nullFormCtrl = {
      $addControl: noop,
      $$renameControl: nullFormRenameControl,
      $removeControl: noop,
      $setValidity: noop,
      $setDirty: noop,
      $setPristine: noop,
      $setSubmitted: noop
    },
        SUBMITTED_CLASS = 'ng-submitted';
    function nullFormRenameControl(control, name) {
      control.$name = name;
    }
    FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
    function FormController(element, attrs, $scope, $animate, $interpolate) {
      var form = this,
          controls = [];
      var parentForm = form.$$parentForm = element.parent().controller('form') || nullFormCtrl;
      form.$error = {};
      form.$$success = {};
      form.$pending = undefined;
      form.$name = $interpolate(attrs.name || attrs.ngForm || '')($scope);
      form.$dirty = false;
      form.$pristine = true;
      form.$valid = true;
      form.$invalid = false;
      form.$submitted = false;
      parentForm.$addControl(form);
      form.$rollbackViewValue = function() {
        forEach(controls, function(control) {
          control.$rollbackViewValue();
        });
      };
      form.$commitViewValue = function() {
        forEach(controls, function(control) {
          control.$commitViewValue();
        });
      };
      form.$addControl = function(control) {
        assertNotHasOwnProperty(control.$name, 'input');
        controls.push(control);
        if (control.$name) {
          form[control.$name] = control;
        }
      };
      form.$$renameControl = function(control, newName) {
        var oldName = control.$name;
        if (form[oldName] === control) {
          delete form[oldName];
        }
        form[newName] = control;
        control.$name = newName;
      };
      form.$removeControl = function(control) {
        if (control.$name && form[control.$name] === control) {
          delete form[control.$name];
        }
        forEach(form.$pending, function(value, name) {
          form.$setValidity(name, null, control);
        });
        forEach(form.$error, function(value, name) {
          form.$setValidity(name, null, control);
        });
        forEach(form.$$success, function(value, name) {
          form.$setValidity(name, null, control);
        });
        arrayRemove(controls, control);
      };
      addSetValidityMethod({
        ctrl: this,
        $element: element,
        set: function(object, property, controller) {
          var list = object[property];
          if (!list) {
            object[property] = [controller];
          } else {
            var index = list.indexOf(controller);
            if (index === -1) {
              list.push(controller);
            }
          }
        },
        unset: function(object, property, controller) {
          var list = object[property];
          if (!list) {
            return;
          }
          arrayRemove(list, controller);
          if (list.length === 0) {
            delete object[property];
          }
        },
        parentForm: parentForm,
        $animate: $animate
      });
      form.$setDirty = function() {
        $animate.removeClass(element, PRISTINE_CLASS);
        $animate.addClass(element, DIRTY_CLASS);
        form.$dirty = true;
        form.$pristine = false;
        parentForm.$setDirty();
      };
      form.$setPristine = function() {
        $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
        form.$dirty = false;
        form.$pristine = true;
        form.$submitted = false;
        forEach(controls, function(control) {
          control.$setPristine();
        });
      };
      form.$setUntouched = function() {
        forEach(controls, function(control) {
          control.$setUntouched();
        });
      };
      form.$setSubmitted = function() {
        $animate.addClass(element, SUBMITTED_CLASS);
        form.$submitted = true;
        parentForm.$setSubmitted();
      };
    }
    var formDirectiveFactory = function(isNgForm) {
      return ['$timeout', '$parse', function($timeout, $parse) {
        var formDirective = {
          name: 'form',
          restrict: isNgForm ? 'EAC' : 'E',
          controller: FormController,
          compile: function ngFormCompile(formElement, attr) {
            formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
            var nameAttr = attr.name ? 'name' : (isNgForm && attr.ngForm ? 'ngForm' : false);
            return {pre: function ngFormPreLink(scope, formElement, attr, controller) {
                if (!('action' in attr)) {
                  var handleFormSubmission = function(event) {
                    scope.$apply(function() {
                      controller.$commitViewValue();
                      controller.$setSubmitted();
                    });
                    event.preventDefault();
                  };
                  addEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                  formElement.on('$destroy', function() {
                    $timeout(function() {
                      removeEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                    }, 0, false);
                  });
                }
                var parentFormCtrl = controller.$$parentForm;
                var setter = nameAttr ? getSetter(controller.$name) : noop;
                if (nameAttr) {
                  setter(scope, controller);
                  attr.$observe(nameAttr, function(newValue) {
                    if (controller.$name === newValue)
                      return;
                    setter(scope, undefined);
                    parentFormCtrl.$$renameControl(controller, newValue);
                    setter = getSetter(controller.$name);
                    setter(scope, controller);
                  });
                }
                formElement.on('$destroy', function() {
                  parentFormCtrl.$removeControl(controller);
                  setter(scope, undefined);
                  extend(controller, nullFormCtrl);
                });
              }};
          }
        };
        return formDirective;
        function getSetter(expression) {
          if (expression === '') {
            return $parse('this[""]').assign;
          }
          return $parse(expression).assign || noop;
        }
      }];
    };
    var formDirective = formDirectiveFactory();
    var ngFormDirective = formDirectiveFactory(true);
    var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;
    var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
    var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
    var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
    var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var inputType = {
      'text': textInputType,
      'date': createDateInputType('date', DATE_REGEXP, createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']), 'yyyy-MM-dd'),
      'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP, createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']), 'yyyy-MM-ddTHH:mm:ss.sss'),
      'time': createDateInputType('time', TIME_REGEXP, createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']), 'HH:mm:ss.sss'),
      'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),
      'month': createDateInputType('month', MONTH_REGEXP, createDateParser(MONTH_REGEXP, ['yyyy', 'MM']), 'yyyy-MM'),
      'number': numberInputType,
      'url': urlInputType,
      'email': emailInputType,
      'radio': radioInputType,
      'checkbox': checkboxInputType,
      'hidden': noop,
      'button': noop,
      'submit': noop,
      'reset': noop,
      'file': noop
    };
    function stringBasedInputType(ctrl) {
      ctrl.$formatters.push(function(value) {
        return ctrl.$isEmpty(value) ? value : value.toString();
      });
    }
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
    }
    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      var type = lowercase(element[0].type);
      if (!$sniffer.android) {
        var composing = false;
        element.on('compositionstart', function(data) {
          composing = true;
        });
        element.on('compositionend', function() {
          composing = false;
          listener();
        });
      }
      var listener = function(ev) {
        if (timeout) {
          $browser.defer.cancel(timeout);
          timeout = null;
        }
        if (composing)
          return;
        var value = element.val(),
            event = ev && ev.type;
        if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
          value = trim(value);
        }
        if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
          ctrl.$setViewValue(value, event);
        }
      };
      if ($sniffer.hasEvent('input')) {
        element.on('input', listener);
      } else {
        var timeout;
        var deferListener = function(ev, input, origValue) {
          if (!timeout) {
            timeout = $browser.defer(function() {
              timeout = null;
              if (!input || input.value !== origValue) {
                listener(ev);
              }
            });
          }
        };
        element.on('keydown', function(event) {
          var key = event.keyCode;
          if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
            return;
          deferListener(event, this, this.value);
        });
        if ($sniffer.hasEvent('paste')) {
          element.on('paste cut', deferListener);
        }
      }
      element.on('change', listener);
      ctrl.$render = function() {
        var value = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
        if (element.val() !== value) {
          element.val(value);
        }
      };
    }
    function weekParser(isoWeek, existingDate) {
      if (isDate(isoWeek)) {
        return isoWeek;
      }
      if (isString(isoWeek)) {
        WEEK_REGEXP.lastIndex = 0;
        var parts = WEEK_REGEXP.exec(isoWeek);
        if (parts) {
          var year = +parts[1],
              week = +parts[2],
              hours = 0,
              minutes = 0,
              seconds = 0,
              milliseconds = 0,
              firstThurs = getFirstThursdayOfYear(year),
              addDays = (week - 1) * 7;
          if (existingDate) {
            hours = existingDate.getHours();
            minutes = existingDate.getMinutes();
            seconds = existingDate.getSeconds();
            milliseconds = existingDate.getMilliseconds();
          }
          return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
        }
      }
      return NaN;
    }
    function createDateParser(regexp, mapping) {
      return function(iso, date) {
        var parts,
            map;
        if (isDate(iso)) {
          return iso;
        }
        if (isString(iso)) {
          if (iso.charAt(0) == '"' && iso.charAt(iso.length - 1) == '"') {
            iso = iso.substring(1, iso.length - 1);
          }
          if (ISO_DATE_REGEXP.test(iso)) {
            return new Date(iso);
          }
          regexp.lastIndex = 0;
          parts = regexp.exec(iso);
          if (parts) {
            parts.shift();
            if (date) {
              map = {
                yyyy: date.getFullYear(),
                MM: date.getMonth() + 1,
                dd: date.getDate(),
                HH: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds(),
                sss: date.getMilliseconds() / 1000
              };
            } else {
              map = {
                yyyy: 1970,
                MM: 1,
                dd: 1,
                HH: 0,
                mm: 0,
                ss: 0,
                sss: 0
              };
            }
            forEach(parts, function(part, index) {
              if (index < mapping.length) {
                map[mapping[index]] = +part;
              }
            });
            return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
          }
        }
        return NaN;
      };
    }
    function createDateInputType(type, regexp, parseDate, format) {
      return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
        badInputChecker(scope, element, attr, ctrl);
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        var timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
        var previousDate;
        ctrl.$$parserName = type;
        ctrl.$parsers.push(function(value) {
          if (ctrl.$isEmpty(value))
            return null;
          if (regexp.test(value)) {
            var parsedDate = parseDate(value, previousDate);
            if (timezone) {
              parsedDate = convertTimezoneToLocal(parsedDate, timezone);
            }
            return parsedDate;
          }
          return undefined;
        });
        ctrl.$formatters.push(function(value) {
          if (value && !isDate(value)) {
            throw ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
          }
          if (isValidDate(value)) {
            previousDate = value;
            if (previousDate && timezone) {
              previousDate = convertTimezoneToLocal(previousDate, timezone, true);
            }
            return $filter('date')(value, format, timezone);
          } else {
            previousDate = null;
            return '';
          }
        });
        if (isDefined(attr.min) || attr.ngMin) {
          var minVal;
          ctrl.$validators.min = function(value) {
            return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
          };
          attr.$observe('min', function(val) {
            minVal = parseObservedDateValue(val);
            ctrl.$validate();
          });
        }
        if (isDefined(attr.max) || attr.ngMax) {
          var maxVal;
          ctrl.$validators.max = function(value) {
            return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
          };
          attr.$observe('max', function(val) {
            maxVal = parseObservedDateValue(val);
            ctrl.$validate();
          });
        }
        function isValidDate(value) {
          return value && !(value.getTime && value.getTime() !== value.getTime());
        }
        function parseObservedDateValue(val) {
          return isDefined(val) ? (isDate(val) ? val : parseDate(val)) : undefined;
        }
      };
    }
    function badInputChecker(scope, element, attr, ctrl) {
      var node = element[0];
      var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
      if (nativeValidation) {
        ctrl.$parsers.push(function(value) {
          var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
          return validity.badInput && !validity.typeMismatch ? undefined : value;
        });
      }
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      badInputChecker(scope, element, attr, ctrl);
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      ctrl.$$parserName = 'number';
      ctrl.$parsers.push(function(value) {
        if (ctrl.$isEmpty(value))
          return null;
        if (NUMBER_REGEXP.test(value))
          return parseFloat(value);
        return undefined;
      });
      ctrl.$formatters.push(function(value) {
        if (!ctrl.$isEmpty(value)) {
          if (!isNumber(value)) {
            throw ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
          }
          value = value.toString();
        }
        return value;
      });
      if (isDefined(attr.min) || attr.ngMin) {
        var minVal;
        ctrl.$validators.min = function(value) {
          return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
        };
        attr.$observe('min', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          minVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ctrl.$validate();
        });
      }
      if (isDefined(attr.max) || attr.ngMax) {
        var maxVal;
        ctrl.$validators.max = function(value) {
          return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
        };
        attr.$observe('max', function(val) {
          if (isDefined(val) && !isNumber(val)) {
            val = parseFloat(val, 10);
          }
          maxVal = isNumber(val) && !isNaN(val) ? val : undefined;
          ctrl.$validate();
        });
      }
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
      ctrl.$$parserName = 'url';
      ctrl.$validators.url = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
      };
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
      stringBasedInputType(ctrl);
      ctrl.$$parserName = 'email';
      ctrl.$validators.email = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
      };
    }
    function radioInputType(scope, element, attr, ctrl) {
      if (isUndefined(attr.name)) {
        element.attr('name', nextUid());
      }
      var listener = function(ev) {
        if (element[0].checked) {
          ctrl.$setViewValue(attr.value, ev && ev.type);
        }
      };
      element.on('click', listener);
      ctrl.$render = function() {
        var value = attr.value;
        element[0].checked = (value == ctrl.$viewValue);
      };
      attr.$observe('value', ctrl.$render);
    }
    function parseConstantExpr($parse, context, name, expression, fallback) {
      var parseFn;
      if (isDefined(expression)) {
        parseFn = $parse(expression);
        if (!parseFn.constant) {
          throw ngModelMinErr('constexpr', 'Expected constant expression for `{0}`, but saw ' + '`{1}`.', name, expression);
        }
        return parseFn(context);
      }
      return fallback;
    }
    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
      var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
      var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);
      var listener = function(ev) {
        ctrl.$setViewValue(element[0].checked, ev && ev.type);
      };
      element.on('click', listener);
      ctrl.$render = function() {
        element[0].checked = ctrl.$viewValue;
      };
      ctrl.$isEmpty = function(value) {
        return value === false;
      };
      ctrl.$formatters.push(function(value) {
        return equals(value, trueValue);
      });
      ctrl.$parsers.push(function(value) {
        return value ? trueValue : falseValue;
      });
    }
    var inputDirective = ['$browser', '$sniffer', '$filter', '$parse', function($browser, $sniffer, $filter, $parse) {
      return {
        restrict: 'E',
        require: ['?ngModel'],
        link: {pre: function(scope, element, attr, ctrls) {
            if (ctrls[0]) {
              (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer, $browser, $filter, $parse);
            }
          }}
      };
    }];
    var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
    var ngValueDirective = function() {
      return {
        restrict: 'A',
        priority: 100,
        compile: function(tpl, tplAttr) {
          if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
            return function ngValueConstantLink(scope, elm, attr) {
              attr.$set('value', scope.$eval(attr.ngValue));
            };
          } else {
            return function ngValueLink(scope, elm, attr) {
              scope.$watch(attr.ngValue, function valueWatchAction(value) {
                attr.$set('value', value);
              });
            };
          }
        }
      };
    };
    var ngBindDirective = ['$compile', function($compile) {
      return {
        restrict: 'AC',
        compile: function ngBindCompile(templateElement) {
          $compile.$$addBindingClass(templateElement);
          return function ngBindLink(scope, element, attr) {
            $compile.$$addBindingInfo(element, attr.ngBind);
            element = element[0];
            scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
              element.textContent = value === undefined ? '' : value;
            });
          };
        }
      };
    }];
    var ngBindTemplateDirective = ['$interpolate', '$compile', function($interpolate, $compile) {
      return {compile: function ngBindTemplateCompile(templateElement) {
          $compile.$$addBindingClass(templateElement);
          return function ngBindTemplateLink(scope, element, attr) {
            var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
            $compile.$$addBindingInfo(element, interpolateFn.expressions);
            element = element[0];
            attr.$observe('ngBindTemplate', function(value) {
              element.textContent = value === undefined ? '' : value;
            });
          };
        }};
    }];
    var ngBindHtmlDirective = ['$sce', '$parse', '$compile', function($sce, $parse, $compile) {
      return {
        restrict: 'A',
        compile: function ngBindHtmlCompile(tElement, tAttrs) {
          var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
          var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function getStringValue(value) {
            return (value || '').toString();
          });
          $compile.$$addBindingClass(tElement);
          return function ngBindHtmlLink(scope, element, attr) {
            $compile.$$addBindingInfo(element, attr.ngBindHtml);
            scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
              element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
            });
          };
        }
      };
    }];
    var ngChangeDirective = valueFn({
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ctrl) {
        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attr.ngChange);
        });
      }
    });
    function classDirective(name, selector) {
      name = 'ngClass' + name;
      return ['$animate', function($animate) {
        return {
          restrict: 'AC',
          link: function(scope, element, attr) {
            var oldVal;
            scope.$watch(attr[name], ngClassWatchAction, true);
            attr.$observe('class', function(value) {
              ngClassWatchAction(scope.$eval(attr[name]));
            });
            if (name !== 'ngClass') {
              scope.$watch('$index', function($index, old$index) {
                var mod = $index & 1;
                if (mod !== (old$index & 1)) {
                  var classes = arrayClasses(scope.$eval(attr[name]));
                  mod === selector ? addClasses(classes) : removeClasses(classes);
                }
              });
            }
            function addClasses(classes) {
              var newClasses = digestClassCounts(classes, 1);
              attr.$addClass(newClasses);
            }
            function removeClasses(classes) {
              var newClasses = digestClassCounts(classes, -1);
              attr.$removeClass(newClasses);
            }
            function digestClassCounts(classes, count) {
              var classCounts = element.data('$classCounts') || createMap();
              var classesToUpdate = [];
              forEach(classes, function(className) {
                if (count > 0 || classCounts[className]) {
                  classCounts[className] = (classCounts[className] || 0) + count;
                  if (classCounts[className] === +(count > 0)) {
                    classesToUpdate.push(className);
                  }
                }
              });
              element.data('$classCounts', classCounts);
              return classesToUpdate.join(' ');
            }
            function updateClasses(oldClasses, newClasses) {
              var toAdd = arrayDifference(newClasses, oldClasses);
              var toRemove = arrayDifference(oldClasses, newClasses);
              toAdd = digestClassCounts(toAdd, 1);
              toRemove = digestClassCounts(toRemove, -1);
              if (toAdd && toAdd.length) {
                $animate.addClass(element, toAdd);
              }
              if (toRemove && toRemove.length) {
                $animate.removeClass(element, toRemove);
              }
            }
            function ngClassWatchAction(newVal) {
              if (selector === true || scope.$index % 2 === selector) {
                var newClasses = arrayClasses(newVal || []);
                if (!oldVal) {
                  addClasses(newClasses);
                } else if (!equals(newVal, oldVal)) {
                  var oldClasses = arrayClasses(oldVal);
                  updateClasses(oldClasses, newClasses);
                }
              }
              oldVal = shallowCopy(newVal);
            }
          }
        };
        function arrayDifference(tokens1, tokens2) {
          var values = [];
          outer: for (var i = 0; i < tokens1.length; i++) {
            var token = tokens1[i];
            for (var j = 0; j < tokens2.length; j++) {
              if (token == tokens2[j])
                continue outer;
            }
            values.push(token);
          }
          return values;
        }
        function arrayClasses(classVal) {
          var classes = [];
          if (isArray(classVal)) {
            forEach(classVal, function(v) {
              classes = classes.concat(arrayClasses(v));
            });
            return classes;
          } else if (isString(classVal)) {
            return classVal.split(' ');
          } else if (isObject(classVal)) {
            forEach(classVal, function(v, k) {
              if (v) {
                classes = classes.concat(k.split(' '));
              }
            });
            return classes;
          }
          return classVal;
        }
      }];
    }
    var ngClassDirective = classDirective('', true);
    var ngClassOddDirective = classDirective('Odd', 0);
    var ngClassEvenDirective = classDirective('Even', 1);
    var ngCloakDirective = ngDirective({compile: function(element, attr) {
        attr.$set('ngCloak', undefined);
        element.removeClass('ng-cloak');
      }});
    var ngControllerDirective = [function() {
      return {
        restrict: 'A',
        scope: true,
        controller: '@',
        priority: 500
      };
    }];
    var ngEventDirectives = {};
    var forceAsyncEvents = {
      'blur': true,
      'focus': true
    };
    forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function(eventName) {
      var directiveName = directiveNormalize('ng-' + eventName);
      ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
        return {
          restrict: 'A',
          compile: function($element, attr) {
            var fn = $parse(attr[directiveName], null, true);
            return function ngEventHandler(scope, element) {
              element.on(eventName, function(event) {
                var callback = function() {
                  fn(scope, {$event: event});
                };
                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            };
          }
        };
      }];
    });
    var ngIfDirective = ['$animate', function($animate) {
      return {
        multiElement: true,
        transclude: 'element',
        priority: 600,
        terminal: true,
        restrict: 'A',
        $$tlb: true,
        link: function($scope, $element, $attr, ctrl, $transclude) {
          var block,
              childScope,
              previousElements;
          $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
            if (value) {
              if (!childScope) {
                $transclude(function(clone, newScope) {
                  childScope = newScope;
                  clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                  block = {clone: clone};
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            } else {
              if (previousElements) {
                previousElements.remove();
                previousElements = null;
              }
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }
              if (block) {
                previousElements = getBlockNodes(block.clone);
                $animate.leave(previousElements).then(function() {
                  previousElements = null;
                });
                block = null;
              }
            }
          });
        }
      };
    }];
    var ngIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate', function($templateRequest, $anchorScroll, $animate) {
      return {
        restrict: 'ECA',
        priority: 400,
        terminal: true,
        transclude: 'element',
        controller: angular.noop,
        compile: function(element, attr) {
          var srcExp = attr.ngInclude || attr.src,
              onloadExp = attr.onload || '',
              autoScrollExp = attr.autoscroll;
          return function(scope, $element, $attr, ctrl, $transclude) {
            var changeCounter = 0,
                currentScope,
                previousElement,
                currentElement;
            var cleanupLastIncludeContent = function() {
              if (previousElement) {
                previousElement.remove();
                previousElement = null;
              }
              if (currentScope) {
                currentScope.$destroy();
                currentScope = null;
              }
              if (currentElement) {
                $animate.leave(currentElement).then(function() {
                  previousElement = null;
                });
                previousElement = currentElement;
                currentElement = null;
              }
            };
            scope.$watch(srcExp, function ngIncludeWatchAction(src) {
              var afterAnimation = function() {
                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              };
              var thisChangeId = ++changeCounter;
              if (src) {
                $templateRequest(src, true).then(function(response) {
                  if (thisChangeId !== changeCounter)
                    return;
                  var newScope = scope.$new();
                  ctrl.template = response;
                  var clone = $transclude(newScope, function(clone) {
                    cleanupLastIncludeContent();
                    $animate.enter(clone, null, $element).then(afterAnimation);
                  });
                  currentScope = newScope;
                  currentElement = clone;
                  currentScope.$emit('$includeContentLoaded', src);
                  scope.$eval(onloadExp);
                }, function() {
                  if (thisChangeId === changeCounter) {
                    cleanupLastIncludeContent();
                    scope.$emit('$includeContentError', src);
                  }
                });
                scope.$emit('$includeContentRequested', src);
              } else {
                cleanupLastIncludeContent();
                ctrl.template = null;
              }
            });
          };
        }
      };
    }];
    var ngIncludeFillContentDirective = ['$compile', function($compile) {
      return {
        restrict: 'ECA',
        priority: -400,
        require: 'ngInclude',
        link: function(scope, $element, $attr, ctrl) {
          if (/SVG/.test($element[0].toString())) {
            $element.empty();
            $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope, function namespaceAdaptedClone(clone) {
              $element.append(clone);
            }, {futureParentElement: $element});
            return;
          }
          $element.html(ctrl.template);
          $compile($element.contents())(scope);
        }
      };
    }];
    var ngInitDirective = ngDirective({
      priority: 450,
      compile: function() {
        return {pre: function(scope, element, attrs) {
            scope.$eval(attrs.ngInit);
          }};
      }
    });
    var ngListDirective = function() {
      return {
        restrict: 'A',
        priority: 100,
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
          var ngList = element.attr(attr.$attr.ngList) || ', ';
          var trimValues = attr.ngTrim !== 'false';
          var separator = trimValues ? trim(ngList) : ngList;
          var parse = function(viewValue) {
            if (isUndefined(viewValue))
              return;
            var list = [];
            if (viewValue) {
              forEach(viewValue.split(separator), function(value) {
                if (value)
                  list.push(trimValues ? trim(value) : value);
              });
            }
            return list;
          };
          ctrl.$parsers.push(parse);
          ctrl.$formatters.push(function(value) {
            if (isArray(value)) {
              return value.join(ngList);
            }
            return undefined;
          });
          ctrl.$isEmpty = function(value) {
            return !value || !value.length;
          };
        }
      };
    };
    var VALID_CLASS = 'ng-valid',
        INVALID_CLASS = 'ng-invalid',
        PRISTINE_CLASS = 'ng-pristine',
        DIRTY_CLASS = 'ng-dirty',
        UNTOUCHED_CLASS = 'ng-untouched',
        TOUCHED_CLASS = 'ng-touched',
        PENDING_CLASS = 'ng-pending';
    var ngModelMinErr = minErr('ngModel');
    var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$rootScope', '$q', '$interpolate', function($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
      this.$viewValue = Number.NaN;
      this.$modelValue = Number.NaN;
      this.$$rawModelValue = undefined;
      this.$validators = {};
      this.$asyncValidators = {};
      this.$parsers = [];
      this.$formatters = [];
      this.$viewChangeListeners = [];
      this.$untouched = true;
      this.$touched = false;
      this.$pristine = true;
      this.$dirty = false;
      this.$valid = true;
      this.$invalid = false;
      this.$error = {};
      this.$$success = {};
      this.$pending = undefined;
      this.$name = $interpolate($attr.name || '', false)($scope);
      var parsedNgModel = $parse($attr.ngModel),
          parsedNgModelAssign = parsedNgModel.assign,
          ngModelGet = parsedNgModel,
          ngModelSet = parsedNgModelAssign,
          pendingDebounce = null,
          parserValid,
          ctrl = this;
      this.$$setOptions = function(options) {
        ctrl.$options = options;
        if (options && options.getterSetter) {
          var invokeModelGetter = $parse($attr.ngModel + '()'),
              invokeModelSetter = $parse($attr.ngModel + '($$$p)');
          ngModelGet = function($scope) {
            var modelValue = parsedNgModel($scope);
            if (isFunction(modelValue)) {
              modelValue = invokeModelGetter($scope);
            }
            return modelValue;
          };
          ngModelSet = function($scope, newValue) {
            if (isFunction(parsedNgModel($scope))) {
              invokeModelSetter($scope, {$$$p: ctrl.$modelValue});
            } else {
              parsedNgModelAssign($scope, ctrl.$modelValue);
            }
          };
        } else if (!parsedNgModel.assign) {
          throw ngModelMinErr('nonassign', "Expression '{0}' is non-assignable. Element: {1}", $attr.ngModel, startingTag($element));
        }
      };
      this.$render = noop;
      this.$isEmpty = function(value) {
        return isUndefined(value) || value === '' || value === null || value !== value;
      };
      var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
          currentValidationRunId = 0;
      addSetValidityMethod({
        ctrl: this,
        $element: $element,
        set: function(object, property) {
          object[property] = true;
        },
        unset: function(object, property) {
          delete object[property];
        },
        parentForm: parentForm,
        $animate: $animate
      });
      this.$setPristine = function() {
        ctrl.$dirty = false;
        ctrl.$pristine = true;
        $animate.removeClass($element, DIRTY_CLASS);
        $animate.addClass($element, PRISTINE_CLASS);
      };
      this.$setDirty = function() {
        ctrl.$dirty = true;
        ctrl.$pristine = false;
        $animate.removeClass($element, PRISTINE_CLASS);
        $animate.addClass($element, DIRTY_CLASS);
        parentForm.$setDirty();
      };
      this.$setUntouched = function() {
        ctrl.$touched = false;
        ctrl.$untouched = true;
        $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
      };
      this.$setTouched = function() {
        ctrl.$touched = true;
        ctrl.$untouched = false;
        $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
      };
      this.$rollbackViewValue = function() {
        $timeout.cancel(pendingDebounce);
        ctrl.$viewValue = ctrl.$$lastCommittedViewValue;
        ctrl.$render();
      };
      this.$validate = function() {
        if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
          return;
        }
        var viewValue = ctrl.$$lastCommittedViewValue;
        var modelValue = ctrl.$$rawModelValue;
        var prevValid = ctrl.$valid;
        var prevModelValue = ctrl.$modelValue;
        var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
        ctrl.$$runValidators(modelValue, viewValue, function(allValid) {
          if (!allowInvalid && prevValid !== allValid) {
            ctrl.$modelValue = allValid ? modelValue : undefined;
            if (ctrl.$modelValue !== prevModelValue) {
              ctrl.$$writeModelToScope();
            }
          }
        });
      };
      this.$$runValidators = function(modelValue, viewValue, doneCallback) {
        currentValidationRunId++;
        var localValidationRunId = currentValidationRunId;
        if (!processParseErrors()) {
          validationDone(false);
          return;
        }
        if (!processSyncValidators()) {
          validationDone(false);
          return;
        }
        processAsyncValidators();
        function processParseErrors() {
          var errorKey = ctrl.$$parserName || 'parse';
          if (parserValid === undefined) {
            setValidity(errorKey, null);
          } else {
            if (!parserValid) {
              forEach(ctrl.$validators, function(v, name) {
                setValidity(name, null);
              });
              forEach(ctrl.$asyncValidators, function(v, name) {
                setValidity(name, null);
              });
            }
            setValidity(errorKey, parserValid);
            return parserValid;
          }
          return true;
        }
        function processSyncValidators() {
          var syncValidatorsValid = true;
          forEach(ctrl.$validators, function(validator, name) {
            var result = validator(modelValue, viewValue);
            syncValidatorsValid = syncValidatorsValid && result;
            setValidity(name, result);
          });
          if (!syncValidatorsValid) {
            forEach(ctrl.$asyncValidators, function(v, name) {
              setValidity(name, null);
            });
            return false;
          }
          return true;
        }
        function processAsyncValidators() {
          var validatorPromises = [];
          var allValid = true;
          forEach(ctrl.$asyncValidators, function(validator, name) {
            var promise = validator(modelValue, viewValue);
            if (!isPromiseLike(promise)) {
              throw ngModelMinErr("$asyncValidators", "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
            }
            setValidity(name, undefined);
            validatorPromises.push(promise.then(function() {
              setValidity(name, true);
            }, function(error) {
              allValid = false;
              setValidity(name, false);
            }));
          });
          if (!validatorPromises.length) {
            validationDone(true);
          } else {
            $q.all(validatorPromises).then(function() {
              validationDone(allValid);
            }, noop);
          }
        }
        function setValidity(name, isValid) {
          if (localValidationRunId === currentValidationRunId) {
            ctrl.$setValidity(name, isValid);
          }
        }
        function validationDone(allValid) {
          if (localValidationRunId === currentValidationRunId) {
            doneCallback(allValid);
          }
        }
      };
      this.$commitViewValue = function() {
        var viewValue = ctrl.$viewValue;
        $timeout.cancel(pendingDebounce);
        if (ctrl.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !ctrl.$$hasNativeValidators)) {
          return;
        }
        ctrl.$$lastCommittedViewValue = viewValue;
        if (ctrl.$pristine) {
          this.$setDirty();
        }
        this.$$parseAndValidate();
      };
      this.$$parseAndValidate = function() {
        var viewValue = ctrl.$$lastCommittedViewValue;
        var modelValue = viewValue;
        parserValid = isUndefined(modelValue) ? undefined : true;
        if (parserValid) {
          for (var i = 0; i < ctrl.$parsers.length; i++) {
            modelValue = ctrl.$parsers[i](modelValue);
            if (isUndefined(modelValue)) {
              parserValid = false;
              break;
            }
          }
        }
        if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
          ctrl.$modelValue = ngModelGet($scope);
        }
        var prevModelValue = ctrl.$modelValue;
        var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
        ctrl.$$rawModelValue = modelValue;
        if (allowInvalid) {
          ctrl.$modelValue = modelValue;
          writeToModelIfNeeded();
        }
        ctrl.$$runValidators(modelValue, ctrl.$$lastCommittedViewValue, function(allValid) {
          if (!allowInvalid) {
            ctrl.$modelValue = allValid ? modelValue : undefined;
            writeToModelIfNeeded();
          }
        });
        function writeToModelIfNeeded() {
          if (ctrl.$modelValue !== prevModelValue) {
            ctrl.$$writeModelToScope();
          }
        }
      };
      this.$$writeModelToScope = function() {
        ngModelSet($scope, ctrl.$modelValue);
        forEach(ctrl.$viewChangeListeners, function(listener) {
          try {
            listener();
          } catch (e) {
            $exceptionHandler(e);
          }
        });
      };
      this.$setViewValue = function(value, trigger) {
        ctrl.$viewValue = value;
        if (!ctrl.$options || ctrl.$options.updateOnDefault) {
          ctrl.$$debounceViewValueCommit(trigger);
        }
      };
      this.$$debounceViewValueCommit = function(trigger) {
        var debounceDelay = 0,
            options = ctrl.$options,
            debounce;
        if (options && isDefined(options.debounce)) {
          debounce = options.debounce;
          if (isNumber(debounce)) {
            debounceDelay = debounce;
          } else if (isNumber(debounce[trigger])) {
            debounceDelay = debounce[trigger];
          } else if (isNumber(debounce['default'])) {
            debounceDelay = debounce['default'];
          }
        }
        $timeout.cancel(pendingDebounce);
        if (debounceDelay) {
          pendingDebounce = $timeout(function() {
            ctrl.$commitViewValue();
          }, debounceDelay);
        } else if ($rootScope.$$phase) {
          ctrl.$commitViewValue();
        } else {
          $scope.$apply(function() {
            ctrl.$commitViewValue();
          });
        }
      };
      $scope.$watch(function ngModelWatch() {
        var modelValue = ngModelGet($scope);
        if (modelValue !== ctrl.$modelValue && (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)) {
          ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
          parserValid = undefined;
          var formatters = ctrl.$formatters,
              idx = formatters.length;
          var viewValue = modelValue;
          while (idx--) {
            viewValue = formatters[idx](viewValue);
          }
          if (ctrl.$viewValue !== viewValue) {
            ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
            ctrl.$render();
            ctrl.$$runValidators(modelValue, viewValue, noop);
          }
        }
        return modelValue;
      });
    }];
    var ngModelDirective = ['$rootScope', function($rootScope) {
      return {
        restrict: 'A',
        require: ['ngModel', '^?form', '^?ngModelOptions'],
        controller: NgModelController,
        priority: 1,
        compile: function ngModelCompile(element) {
          element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);
          return {
            pre: function ngModelPreLink(scope, element, attr, ctrls) {
              var modelCtrl = ctrls[0],
                  formCtrl = ctrls[1] || nullFormCtrl;
              modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);
              formCtrl.$addControl(modelCtrl);
              attr.$observe('name', function(newValue) {
                if (modelCtrl.$name !== newValue) {
                  formCtrl.$$renameControl(modelCtrl, newValue);
                }
              });
              scope.$on('$destroy', function() {
                formCtrl.$removeControl(modelCtrl);
              });
            },
            post: function ngModelPostLink(scope, element, attr, ctrls) {
              var modelCtrl = ctrls[0];
              if (modelCtrl.$options && modelCtrl.$options.updateOn) {
                element.on(modelCtrl.$options.updateOn, function(ev) {
                  modelCtrl.$$debounceViewValueCommit(ev && ev.type);
                });
              }
              element.on('blur', function(ev) {
                if (modelCtrl.$touched)
                  return;
                if ($rootScope.$$phase) {
                  scope.$evalAsync(modelCtrl.$setTouched);
                } else {
                  scope.$apply(modelCtrl.$setTouched);
                }
              });
            }
          };
        }
      };
    }];
    var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
    var ngModelOptionsDirective = function() {
      return {
        restrict: 'A',
        controller: ['$scope', '$attrs', function($scope, $attrs) {
          var that = this;
          this.$options = copy($scope.$eval($attrs.ngModelOptions));
          if (this.$options.updateOn !== undefined) {
            this.$options.updateOnDefault = false;
            this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function() {
              that.$options.updateOnDefault = true;
              return ' ';
            }));
          } else {
            this.$options.updateOnDefault = true;
          }
        }]
      };
    };
    function addSetValidityMethod(context) {
      var ctrl = context.ctrl,
          $element = context.$element,
          classCache = {},
          set = context.set,
          unset = context.unset,
          parentForm = context.parentForm,
          $animate = context.$animate;
      classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS));
      ctrl.$setValidity = setValidity;
      function setValidity(validationErrorKey, state, controller) {
        if (state === undefined) {
          createAndSet('$pending', validationErrorKey, controller);
        } else {
          unsetAndCleanup('$pending', validationErrorKey, controller);
        }
        if (!isBoolean(state)) {
          unset(ctrl.$error, validationErrorKey, controller);
          unset(ctrl.$$success, validationErrorKey, controller);
        } else {
          if (state) {
            unset(ctrl.$error, validationErrorKey, controller);
            set(ctrl.$$success, validationErrorKey, controller);
          } else {
            set(ctrl.$error, validationErrorKey, controller);
            unset(ctrl.$$success, validationErrorKey, controller);
          }
        }
        if (ctrl.$pending) {
          cachedToggleClass(PENDING_CLASS, true);
          ctrl.$valid = ctrl.$invalid = undefined;
          toggleValidationCss('', null);
        } else {
          cachedToggleClass(PENDING_CLASS, false);
          ctrl.$valid = isObjectEmpty(ctrl.$error);
          ctrl.$invalid = !ctrl.$valid;
          toggleValidationCss('', ctrl.$valid);
        }
        var combinedState;
        if (ctrl.$pending && ctrl.$pending[validationErrorKey]) {
          combinedState = undefined;
        } else if (ctrl.$error[validationErrorKey]) {
          combinedState = false;
        } else if (ctrl.$$success[validationErrorKey]) {
          combinedState = true;
        } else {
          combinedState = null;
        }
        toggleValidationCss(validationErrorKey, combinedState);
        parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
      }
      function createAndSet(name, value, controller) {
        if (!ctrl[name]) {
          ctrl[name] = {};
        }
        set(ctrl[name], value, controller);
      }
      function unsetAndCleanup(name, value, controller) {
        if (ctrl[name]) {
          unset(ctrl[name], value, controller);
        }
        if (isObjectEmpty(ctrl[name])) {
          ctrl[name] = undefined;
        }
      }
      function cachedToggleClass(className, switchValue) {
        if (switchValue && !classCache[className]) {
          $animate.addClass($element, className);
          classCache[className] = true;
        } else if (!switchValue && classCache[className]) {
          $animate.removeClass($element, className);
          classCache[className] = false;
        }
      }
      function toggleValidationCss(validationErrorKey, isValid) {
        validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
        cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === true);
        cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === false);
      }
    }
    function isObjectEmpty(obj) {
      if (obj) {
        for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
            return false;
          }
        }
      }
      return true;
    }
    var ngNonBindableDirective = ngDirective({
      terminal: true,
      priority: 1000
    });
    var ngOptionsMinErr = minErr('ngOptions');
    var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
    var ngOptionsDirective = ['$compile', '$parse', function($compile, $parse) {
      function parseOptionsExpression(optionsExp, selectElement, scope) {
        var match = optionsExp.match(NG_OPTIONS_REGEXP);
        if (!(match)) {
          throw ngOptionsMinErr('iexp', "Expected expression in form of " + "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" + " but got '{0}'. Element: {1}", optionsExp, startingTag(selectElement));
        }
        var valueName = match[5] || match[7];
        var keyName = match[6];
        var selectAs = / as /.test(match[0]) && match[1];
        var trackBy = match[9];
        var valueFn = $parse(match[2] ? match[1] : valueName);
        var selectAsFn = selectAs && $parse(selectAs);
        var viewValueFn = selectAsFn || valueFn;
        var trackByFn = trackBy && $parse(trackBy);
        var getTrackByValueFn = trackBy ? function(value, locals) {
          return trackByFn(scope, locals);
        } : function getHashOfValue(value) {
          return hashKey(value);
        };
        var getTrackByValue = function(value, key) {
          return getTrackByValueFn(value, getLocals(value, key));
        };
        var displayFn = $parse(match[2] || match[1]);
        var groupByFn = $parse(match[3] || '');
        var disableWhenFn = $parse(match[4] || '');
        var valuesFn = $parse(match[8]);
        var locals = {};
        var getLocals = keyName ? function(value, key) {
          locals[keyName] = key;
          locals[valueName] = value;
          return locals;
        } : function(value) {
          locals[valueName] = value;
          return locals;
        };
        function Option(selectValue, viewValue, label, group, disabled) {
          this.selectValue = selectValue;
          this.viewValue = viewValue;
          this.label = label;
          this.group = group;
          this.disabled = disabled;
        }
        function getOptionValuesKeys(optionValues) {
          var optionValuesKeys;
          if (!keyName && isArrayLike(optionValues)) {
            optionValuesKeys = optionValues;
          } else {
            optionValuesKeys = [];
            for (var itemKey in optionValues) {
              if (optionValues.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
                optionValuesKeys.push(itemKey);
              }
            }
          }
          return optionValuesKeys;
        }
        return {
          trackBy: trackBy,
          getTrackByValue: getTrackByValue,
          getWatchables: $parse(valuesFn, function(optionValues) {
            var watchedArray = [];
            optionValues = optionValues || [];
            var optionValuesKeys = getOptionValuesKeys(optionValues);
            var optionValuesLength = optionValuesKeys.length;
            for (var index = 0; index < optionValuesLength; index++) {
              var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
              var value = optionValues[key];
              var locals = getLocals(optionValues[key], key);
              var selectValue = getTrackByValueFn(optionValues[key], locals);
              watchedArray.push(selectValue);
              if (match[2] || match[1]) {
                var label = displayFn(scope, locals);
                watchedArray.push(label);
              }
              if (match[4]) {
                var disableWhen = disableWhenFn(scope, locals);
                watchedArray.push(disableWhen);
              }
            }
            return watchedArray;
          }),
          getOptions: function() {
            var optionItems = [];
            var selectValueMap = {};
            var optionValues = valuesFn(scope) || [];
            var optionValuesKeys = getOptionValuesKeys(optionValues);
            var optionValuesLength = optionValuesKeys.length;
            for (var index = 0; index < optionValuesLength; index++) {
              var key = (optionValues === optionValuesKeys) ? index : optionValuesKeys[index];
              var value = optionValues[key];
              var locals = getLocals(value, key);
              var viewValue = viewValueFn(scope, locals);
              var selectValue = getTrackByValueFn(viewValue, locals);
              var label = displayFn(scope, locals);
              var group = groupByFn(scope, locals);
              var disabled = disableWhenFn(scope, locals);
              var optionItem = new Option(selectValue, viewValue, label, group, disabled);
              optionItems.push(optionItem);
              selectValueMap[selectValue] = optionItem;
            }
            return {
              items: optionItems,
              selectValueMap: selectValueMap,
              getOptionFromViewValue: function(value) {
                return selectValueMap[getTrackByValue(value)];
              },
              getViewValueFromOption: function(option) {
                return trackBy ? angular.copy(option.viewValue) : option.viewValue;
              }
            };
          }
        };
      }
      var optionTemplate = document.createElement('option'),
          optGroupTemplate = document.createElement('optgroup');
      return {
        restrict: 'A',
        terminal: true,
        require: ['select', '?ngModel'],
        link: function(scope, selectElement, attr, ctrls) {
          var ngModelCtrl = ctrls[1];
          if (!ngModelCtrl)
            return;
          var selectCtrl = ctrls[0];
          var multiple = attr.multiple;
          var emptyOption;
          for (var i = 0,
              children = selectElement.children(),
              ii = children.length; i < ii; i++) {
            if (children[i].value === '') {
              emptyOption = children.eq(i);
              break;
            }
          }
          var providedEmptyOption = !!emptyOption;
          var unknownOption = jqLite(optionTemplate.cloneNode(false));
          unknownOption.val('?');
          var options;
          var ngOptions = parseOptionsExpression(attr.ngOptions, selectElement, scope);
          var renderEmptyOption = function() {
            if (!providedEmptyOption) {
              selectElement.prepend(emptyOption);
            }
            selectElement.val('');
            emptyOption.prop('selected', true);
            emptyOption.attr('selected', true);
          };
          var removeEmptyOption = function() {
            if (!providedEmptyOption) {
              emptyOption.remove();
            }
          };
          var renderUnknownOption = function() {
            selectElement.prepend(unknownOption);
            selectElement.val('?');
            unknownOption.prop('selected', true);
            unknownOption.attr('selected', true);
          };
          var removeUnknownOption = function() {
            unknownOption.remove();
          };
          if (!multiple) {
            selectCtrl.writeValue = function writeNgOptionsValue(value) {
              var option = options.getOptionFromViewValue(value);
              if (option && !option.disabled) {
                if (selectElement[0].value !== option.selectValue) {
                  removeUnknownOption();
                  removeEmptyOption();
                  selectElement[0].value = option.selectValue;
                  option.element.selected = true;
                  option.element.setAttribute('selected', 'selected');
                }
              } else {
                if (value === null || providedEmptyOption) {
                  removeUnknownOption();
                  renderEmptyOption();
                } else {
                  removeEmptyOption();
                  renderUnknownOption();
                }
              }
            };
            selectCtrl.readValue = function readNgOptionsValue() {
              var selectedOption = options.selectValueMap[selectElement.val()];
              if (selectedOption && !selectedOption.disabled) {
                removeEmptyOption();
                removeUnknownOption();
                return options.getViewValueFromOption(selectedOption);
              }
              return null;
            };
            if (ngOptions.trackBy) {
              scope.$watch(function() {
                return ngOptions.getTrackByValue(ngModelCtrl.$viewValue);
              }, function() {
                ngModelCtrl.$render();
              });
            }
          } else {
            ngModelCtrl.$isEmpty = function(value) {
              return !value || value.length === 0;
            };
            selectCtrl.writeValue = function writeNgOptionsMultiple(value) {
              options.items.forEach(function(option) {
                option.element.selected = false;
              });
              if (value) {
                value.forEach(function(item) {
                  var option = options.getOptionFromViewValue(item);
                  if (option && !option.disabled)
                    option.element.selected = true;
                });
              }
            };
            selectCtrl.readValue = function readNgOptionsMultiple() {
              var selectedValues = selectElement.val() || [],
                  selections = [];
              forEach(selectedValues, function(value) {
                var option = options.selectValueMap[value];
                if (option && !option.disabled)
                  selections.push(options.getViewValueFromOption(option));
              });
              return selections;
            };
            if (ngOptions.trackBy) {
              scope.$watchCollection(function() {
                if (isArray(ngModelCtrl.$viewValue)) {
                  return ngModelCtrl.$viewValue.map(function(value) {
                    return ngOptions.getTrackByValue(value);
                  });
                }
              }, function() {
                ngModelCtrl.$render();
              });
            }
          }
          if (providedEmptyOption) {
            emptyOption.remove();
            $compile(emptyOption)(scope);
            emptyOption.removeClass('ng-scope');
          } else {
            emptyOption = jqLite(optionTemplate.cloneNode(false));
          }
          updateOptions();
          scope.$watchCollection(ngOptions.getWatchables, updateOptions);
          function updateOptionElement(option, element) {
            option.element = element;
            element.disabled = option.disabled;
            if (option.value !== element.value)
              element.value = option.selectValue;
            if (option.label !== element.label) {
              element.label = option.label;
              element.textContent = option.label;
            }
          }
          function addOrReuseElement(parent, current, type, templateElement) {
            var element;
            if (current && lowercase(current.nodeName) === type) {
              element = current;
            } else {
              element = templateElement.cloneNode(false);
              if (!current) {
                parent.appendChild(element);
              } else {
                parent.insertBefore(element, current);
              }
            }
            return element;
          }
          function removeExcessElements(current) {
            var next;
            while (current) {
              next = current.nextSibling;
              jqLiteRemove(current);
              current = next;
            }
          }
          function skipEmptyAndUnknownOptions(current) {
            var emptyOption_ = emptyOption && emptyOption[0];
            var unknownOption_ = unknownOption && unknownOption[0];
            if (emptyOption_ || unknownOption_) {
              while (current && (current === emptyOption_ || current === unknownOption_)) {
                current = current.nextSibling;
              }
            }
            return current;
          }
          function updateOptions() {
            var previousValue = options && selectCtrl.readValue();
            options = ngOptions.getOptions();
            var groupMap = {};
            var currentElement = selectElement[0].firstChild;
            if (providedEmptyOption) {
              selectElement.prepend(emptyOption);
            }
            currentElement = skipEmptyAndUnknownOptions(currentElement);
            options.items.forEach(function updateOption(option) {
              var group;
              var groupElement;
              var optionElement;
              if (option.group) {
                group = groupMap[option.group];
                if (!group) {
                  groupElement = addOrReuseElement(selectElement[0], currentElement, 'optgroup', optGroupTemplate);
                  currentElement = groupElement.nextSibling;
                  groupElement.label = option.group;
                  group = groupMap[option.group] = {
                    groupElement: groupElement,
                    currentOptionElement: groupElement.firstChild
                  };
                }
                optionElement = addOrReuseElement(group.groupElement, group.currentOptionElement, 'option', optionTemplate);
                updateOptionElement(option, optionElement);
                group.currentOptionElement = optionElement.nextSibling;
              } else {
                optionElement = addOrReuseElement(selectElement[0], currentElement, 'option', optionTemplate);
                updateOptionElement(option, optionElement);
                currentElement = optionElement.nextSibling;
              }
            });
            Object.keys(groupMap).forEach(function(key) {
              removeExcessElements(groupMap[key].currentOptionElement);
            });
            removeExcessElements(currentElement);
            ngModelCtrl.$render();
            if (!ngModelCtrl.$isEmpty(previousValue)) {
              var nextValue = selectCtrl.readValue();
              if (ngOptions.trackBy ? !equals(previousValue, nextValue) : previousValue !== nextValue) {
                ngModelCtrl.$setViewValue(nextValue);
                ngModelCtrl.$render();
              }
            }
          }
        }
      };
    }];
    var ngPluralizeDirective = ['$locale', '$interpolate', '$log', function($locale, $interpolate, $log) {
      var BRACE = /{}/g,
          IS_WHEN = /^when(Minus)?(.+)$/;
      return {link: function(scope, element, attr) {
          var numberExp = attr.count,
              whenExp = attr.$attr.when && element.attr(attr.$attr.when),
              offset = attr.offset || 0,
              whens = scope.$eval(whenExp) || {},
              whensExpFns = {},
              startSymbol = $interpolate.startSymbol(),
              endSymbol = $interpolate.endSymbol(),
              braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
              watchRemover = angular.noop,
              lastCount;
          forEach(attr, function(expression, attributeName) {
            var tmpMatch = IS_WHEN.exec(attributeName);
            if (tmpMatch) {
              var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
              whens[whenKey] = element.attr(attr.$attr[attributeName]);
            }
          });
          forEach(whens, function(expression, key) {
            whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
          });
          scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
            var count = parseFloat(newVal);
            var countIsNaN = isNaN(count);
            if (!countIsNaN && !(count in whens)) {
              count = $locale.pluralCat(count - offset);
            }
            if ((count !== lastCount) && !(countIsNaN && isNumber(lastCount) && isNaN(lastCount))) {
              watchRemover();
              var whenExpFn = whensExpFns[count];
              if (isUndefined(whenExpFn)) {
                if (newVal != null) {
                  $log.debug("ngPluralize: no rule defined for '" + count + "' in " + whenExp);
                }
                watchRemover = noop;
                updateElementText();
              } else {
                watchRemover = scope.$watch(whenExpFn, updateElementText);
              }
              lastCount = count;
            }
          });
          function updateElementText(newText) {
            element.text(newText || '');
          }
        }};
    }];
    var ngRepeatDirective = ['$parse', '$animate', function($parse, $animate) {
      var NG_REMOVED = '$$NG_REMOVED';
      var ngRepeatMinErr = minErr('ngRepeat');
      var updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
        scope[valueIdentifier] = value;
        if (keyIdentifier)
          scope[keyIdentifier] = key;
        scope.$index = index;
        scope.$first = (index === 0);
        scope.$last = (index === (arrayLength - 1));
        scope.$middle = !(scope.$first || scope.$last);
        scope.$odd = !(scope.$even = (index & 1) === 0);
      };
      var getBlockStart = function(block) {
        return block.clone[0];
      };
      var getBlockEnd = function(block) {
        return block.clone[block.clone.length - 1];
      };
      return {
        restrict: 'A',
        multiElement: true,
        transclude: 'element',
        priority: 1000,
        terminal: true,
        $$tlb: true,
        compile: function ngRepeatCompile($element, $attr) {
          var expression = $attr.ngRepeat;
          var ngRepeatEndComment = document.createComment(' end ngRepeat: ' + expression + ' ');
          var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          if (!match) {
            throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.", expression);
          }
          var lhs = match[1];
          var rhs = match[2];
          var aliasAs = match[3];
          var trackByExp = match[4];
          match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
          if (!match) {
            throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.", lhs);
          }
          var valueIdentifier = match[3] || match[1];
          var keyIdentifier = match[2];
          if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
            throw ngRepeatMinErr('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.", aliasAs);
          }
          var trackByExpGetter,
              trackByIdExpFn,
              trackByIdArrayFn,
              trackByIdObjFn;
          var hashFnLocals = {$id: hashKey};
          if (trackByExp) {
            trackByExpGetter = $parse(trackByExp);
          } else {
            trackByIdArrayFn = function(key, value) {
              return hashKey(value);
            };
            trackByIdObjFn = function(key) {
              return key;
            };
          }
          return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {
            if (trackByExpGetter) {
              trackByIdExpFn = function(key, value, index) {
                if (keyIdentifier)
                  hashFnLocals[keyIdentifier] = key;
                hashFnLocals[valueIdentifier] = value;
                hashFnLocals.$index = index;
                return trackByExpGetter($scope, hashFnLocals);
              };
            }
            var lastBlockMap = createMap();
            $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
              var index,
                  length,
                  previousNode = $element[0],
                  nextNode,
                  nextBlockMap = createMap(),
                  collectionLength,
                  key,
                  value,
                  trackById,
                  trackByIdFn,
                  collectionKeys,
                  block,
                  nextBlockOrder,
                  elementsToRemove;
              if (aliasAs) {
                $scope[aliasAs] = collection;
              }
              if (isArrayLike(collection)) {
                collectionKeys = collection;
                trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
              } else {
                trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                collectionKeys = [];
                for (var itemKey in collection) {
                  if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) !== '$') {
                    collectionKeys.push(itemKey);
                  }
                }
              }
              collectionLength = collectionKeys.length;
              nextBlockOrder = new Array(collectionLength);
              for (index = 0; index < collectionLength; index++) {
                key = (collection === collectionKeys) ? index : collectionKeys[index];
                value = collection[key];
                trackById = trackByIdFn(key, value, index);
                if (lastBlockMap[trackById]) {
                  block = lastBlockMap[trackById];
                  delete lastBlockMap[trackById];
                  nextBlockMap[trackById] = block;
                  nextBlockOrder[index] = block;
                } else if (nextBlockMap[trackById]) {
                  forEach(nextBlockOrder, function(block) {
                    if (block && block.scope)
                      lastBlockMap[block.id] = block;
                  });
                  throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                } else {
                  nextBlockOrder[index] = {
                    id: trackById,
                    scope: undefined,
                    clone: undefined
                  };
                  nextBlockMap[trackById] = true;
                }
              }
              for (var blockKey in lastBlockMap) {
                block = lastBlockMap[blockKey];
                elementsToRemove = getBlockNodes(block.clone);
                $animate.leave(elementsToRemove);
                if (elementsToRemove[0].parentNode) {
                  for (index = 0, length = elementsToRemove.length; index < length; index++) {
                    elementsToRemove[index][NG_REMOVED] = true;
                  }
                }
                block.scope.$destroy();
              }
              for (index = 0; index < collectionLength; index++) {
                key = (collection === collectionKeys) ? index : collectionKeys[index];
                value = collection[key];
                block = nextBlockOrder[index];
                if (block.scope) {
                  nextNode = previousNode;
                  do {
                    nextNode = nextNode.nextSibling;
                  } while (nextNode && nextNode[NG_REMOVED]);
                  if (getBlockStart(block) != nextNode) {
                    $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode));
                  }
                  previousNode = getBlockEnd(block);
                  updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                } else {
                  $transclude(function ngRepeatTransclude(clone, scope) {
                    block.scope = scope;
                    var endNode = ngRepeatEndComment.cloneNode(false);
                    clone[clone.length++] = endNode;
                    $animate.enter(clone, null, jqLite(previousNode));
                    previousNode = endNode;
                    block.clone = clone;
                    nextBlockMap[block.id] = block;
                    updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                  });
                }
              }
              lastBlockMap = nextBlockMap;
            });
          };
        }
      };
    }];
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
    var ngShowDirective = ['$animate', function($animate) {
      return {
        restrict: 'A',
        multiElement: true,
        link: function(scope, element, attr) {
          scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
            $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS});
          });
        }
      };
    }];
    var ngHideDirective = ['$animate', function($animate) {
      return {
        restrict: 'A',
        multiElement: true,
        link: function(scope, element, attr) {
          scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
            $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {tempClasses: NG_HIDE_IN_PROGRESS_CLASS});
          });
        }
      };
    }];
    var ngStyleDirective = ngDirective(function(scope, element, attr) {
      scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
        if (oldStyles && (newStyles !== oldStyles)) {
          forEach(oldStyles, function(val, style) {
            element.css(style, '');
          });
        }
        if (newStyles)
          element.css(newStyles);
      }, true);
    });
    var ngSwitchDirective = ['$animate', function($animate) {
      return {
        require: 'ngSwitch',
        controller: ['$scope', function ngSwitchController() {
          this.cases = {};
        }],
        link: function(scope, element, attr, ngSwitchController) {
          var watchExpr = attr.ngSwitch || attr.on,
              selectedTranscludes = [],
              selectedElements = [],
              previousLeaveAnimations = [],
              selectedScopes = [];
          var spliceFactory = function(array, index) {
            return function() {
              array.splice(index, 1);
            };
          };
          scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
            var i,
                ii;
            for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) {
              $animate.cancel(previousLeaveAnimations[i]);
            }
            previousLeaveAnimations.length = 0;
            for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
              var selected = getBlockNodes(selectedElements[i].clone);
              selectedScopes[i].$destroy();
              var promise = previousLeaveAnimations[i] = $animate.leave(selected);
              promise.then(spliceFactory(previousLeaveAnimations, i));
            }
            selectedElements.length = 0;
            selectedScopes.length = 0;
            if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
              forEach(selectedTranscludes, function(selectedTransclude) {
                selectedTransclude.transclude(function(caseElement, selectedScope) {
                  selectedScopes.push(selectedScope);
                  var anchor = selectedTransclude.element;
                  caseElement[caseElement.length++] = document.createComment(' end ngSwitchWhen: ');
                  var block = {clone: caseElement};
                  selectedElements.push(block);
                  $animate.enter(caseElement, anchor.parent(), anchor);
                });
              });
            }
          });
        }
      };
    }];
    var ngSwitchWhenDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function(scope, element, attrs, ctrl, $transclude) {
        ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);
        ctrl.cases['!' + attrs.ngSwitchWhen].push({
          transclude: $transclude,
          element: element
        });
      }
    });
    var ngSwitchDefaultDirective = ngDirective({
      transclude: 'element',
      priority: 1200,
      require: '^ngSwitch',
      multiElement: true,
      link: function(scope, element, attr, ctrl, $transclude) {
        ctrl.cases['?'] = (ctrl.cases['?'] || []);
        ctrl.cases['?'].push({
          transclude: $transclude,
          element: element
        });
      }
    });
    var ngTranscludeDirective = ngDirective({
      restrict: 'EAC',
      link: function($scope, $element, $attrs, controller, $transclude) {
        if (!$transclude) {
          throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
        }
        $transclude(function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    });
    var scriptDirective = ['$templateCache', function($templateCache) {
      return {
        restrict: 'E',
        terminal: true,
        compile: function(element, attr) {
          if (attr.type == 'text/ng-template') {
            var templateUrl = attr.id,
                text = element[0].text;
            $templateCache.put(templateUrl, text);
          }
        }
      };
    }];
    var noopNgModelController = {
      $setViewValue: noop,
      $render: noop
    };
    var SelectController = ['$element', '$scope', '$attrs', function($element, $scope, $attrs) {
      var self = this,
          optionsMap = new HashMap();
      self.ngModelCtrl = noopNgModelController;
      self.unknownOption = jqLite(document.createElement('option'));
      self.renderUnknownOption = function(val) {
        var unknownVal = '? ' + hashKey(val) + ' ?';
        self.unknownOption.val(unknownVal);
        $element.prepend(self.unknownOption);
        $element.val(unknownVal);
      };
      $scope.$on('$destroy', function() {
        self.renderUnknownOption = noop;
      });
      self.removeUnknownOption = function() {
        if (self.unknownOption.parent())
          self.unknownOption.remove();
      };
      self.readValue = function readSingleValue() {
        self.removeUnknownOption();
        return $element.val();
      };
      self.writeValue = function writeSingleValue(value) {
        if (self.hasOption(value)) {
          self.removeUnknownOption();
          $element.val(value);
          if (value === '')
            self.emptyOption.prop('selected', true);
        } else {
          if (value == null && self.emptyOption) {
            self.removeUnknownOption();
            $element.val('');
          } else {
            self.renderUnknownOption(value);
          }
        }
      };
      self.addOption = function(value, element) {
        assertNotHasOwnProperty(value, '"option value"');
        if (value === '') {
          self.emptyOption = element;
        }
        var count = optionsMap.get(value) || 0;
        optionsMap.put(value, count + 1);
      };
      self.removeOption = function(value) {
        var count = optionsMap.get(value);
        if (count) {
          if (count === 1) {
            optionsMap.remove(value);
            if (value === '') {
              self.emptyOption = undefined;
            }
          } else {
            optionsMap.put(value, count - 1);
          }
        }
      };
      self.hasOption = function(value) {
        return !!optionsMap.get(value);
      };
    }];
    var selectDirective = function() {
      return {
        restrict: 'E',
        require: ['select', '?ngModel'],
        controller: SelectController,
        link: function(scope, element, attr, ctrls) {
          var ngModelCtrl = ctrls[1];
          if (!ngModelCtrl)
            return;
          var selectCtrl = ctrls[0];
          selectCtrl.ngModelCtrl = ngModelCtrl;
          ngModelCtrl.$render = function() {
            selectCtrl.writeValue(ngModelCtrl.$viewValue);
          };
          element.on('change', function() {
            scope.$apply(function() {
              ngModelCtrl.$setViewValue(selectCtrl.readValue());
            });
          });
          if (attr.multiple) {
            selectCtrl.readValue = function readMultipleValue() {
              var array = [];
              forEach(element.find('option'), function(option) {
                if (option.selected) {
                  array.push(option.value);
                }
              });
              return array;
            };
            selectCtrl.writeValue = function writeMultipleValue(value) {
              var items = new HashMap(value);
              forEach(element.find('option'), function(option) {
                option.selected = isDefined(items.get(option.value));
              });
            };
            var lastView,
                lastViewRef = NaN;
            scope.$watch(function selectMultipleWatch() {
              if (lastViewRef === ngModelCtrl.$viewValue && !equals(lastView, ngModelCtrl.$viewValue)) {
                lastView = shallowCopy(ngModelCtrl.$viewValue);
                ngModelCtrl.$render();
              }
              lastViewRef = ngModelCtrl.$viewValue;
            });
            ngModelCtrl.$isEmpty = function(value) {
              return !value || value.length === 0;
            };
          }
        }
      };
    };
    var optionDirective = ['$interpolate', function($interpolate) {
      function chromeHack(optionElement) {
        if (optionElement[0].hasAttribute('selected')) {
          optionElement[0].selected = true;
        }
      }
      return {
        restrict: 'E',
        priority: 100,
        compile: function(element, attr) {
          if (isUndefined(attr.value)) {
            var interpolateFn = $interpolate(element.text(), true);
            if (!interpolateFn) {
              attr.$set('value', element.text());
            }
          }
          return function(scope, element, attr) {
            var selectCtrlName = '$selectController',
                parent = element.parent(),
                selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
            if (selectCtrl && selectCtrl.ngModelCtrl) {
              if (interpolateFn) {
                scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                  attr.$set('value', newVal);
                  if (oldVal !== newVal) {
                    selectCtrl.removeOption(oldVal);
                  }
                  selectCtrl.addOption(newVal, element);
                  selectCtrl.ngModelCtrl.$render();
                  chromeHack(element);
                });
              } else {
                selectCtrl.addOption(attr.value, element);
                selectCtrl.ngModelCtrl.$render();
                chromeHack(element);
              }
              element.on('$destroy', function() {
                selectCtrl.removeOption(attr.value);
                selectCtrl.ngModelCtrl.$render();
              });
            }
          };
        }
      };
    }];
    var styleDirective = valueFn({
      restrict: 'E',
      terminal: false
    });
    var requiredDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          attr.required = true;
          ctrl.$validators.required = function(modelValue, viewValue) {
            return !attr.required || !ctrl.$isEmpty(viewValue);
          };
          attr.$observe('required', function() {
            ctrl.$validate();
          });
        }
      };
    };
    var patternDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var regexp,
              patternExp = attr.ngPattern || attr.pattern;
          attr.$observe('pattern', function(regex) {
            if (isString(regex) && regex.length > 0) {
              regex = new RegExp('^' + regex + '$');
            }
            if (regex && !regex.test) {
              throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp, regex, startingTag(elm));
            }
            regexp = regex || undefined;
            ctrl.$validate();
          });
          ctrl.$validators.pattern = function(value) {
            return ctrl.$isEmpty(value) || isUndefined(regexp) || regexp.test(value);
          };
        }
      };
    };
    var maxlengthDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var maxlength = -1;
          attr.$observe('maxlength', function(value) {
            var intVal = toInt(value);
            maxlength = isNaN(intVal) ? -1 : intVal;
            ctrl.$validate();
          });
          ctrl.$validators.maxlength = function(modelValue, viewValue) {
            return (maxlength < 0) || ctrl.$isEmpty(viewValue) || (viewValue.length <= maxlength);
          };
        }
      };
    };
    var minlengthDirective = function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          var minlength = 0;
          attr.$observe('minlength', function(value) {
            minlength = toInt(value) || 0;
            ctrl.$validate();
          });
          ctrl.$validators.minlength = function(modelValue, viewValue) {
            return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
          };
        }
      };
    };
    if (window.angular.bootstrap) {
      console.log('WARNING: Tried to load angular more than once.');
      return;
    }
    bindJQuery();
    publishExternalAPI(angular);
    angular.module("ngLocale", [], ["$provide", function($provide) {
      var PLURAL_CATEGORY = {
        ZERO: "zero",
        ONE: "one",
        TWO: "two",
        FEW: "few",
        MANY: "many",
        OTHER: "other"
      };
      function getDecimals(n) {
        n = n + '';
        var i = n.indexOf('.');
        return (i == -1) ? 0 : n.length - i - 1;
      }
      function getVF(n, opt_precision) {
        var v = opt_precision;
        if (undefined === v) {
          v = Math.min(getDecimals(n), 3);
        }
        var base = Math.pow(10, v);
        var f = ((n * base) | 0) % base;
        return {
          v: v,
          f: f
        };
      }
      $provide.value("$locale", {
        "DATETIME_FORMATS": {
          "AMPMS": ["AM", "PM"],
          "DAY": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "ERANAMES": ["Before Christ", "Anno Domini"],
          "ERAS": ["BC", "AD"],
          "FIRSTDAYOFWEEK": 6,
          "MONTH": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          "SHORTDAY": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          "SHORTMONTH": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          "WEEKENDRANGE": [5, 6],
          "fullDate": "EEEE, MMMM d, y",
          "longDate": "MMMM d, y",
          "medium": "MMM d, y h:mm:ss a",
          "mediumDate": "MMM d, y",
          "mediumTime": "h:mm:ss a",
          "short": "M/d/yy h:mm a",
          "shortDate": "M/d/yy",
          "shortTime": "h:mm a"
        },
        "NUMBER_FORMATS": {
          "CURRENCY_SYM": "$",
          "DECIMAL_SEP": ".",
          "GROUP_SEP": ",",
          "PATTERNS": [{
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 3,
            "minFrac": 0,
            "minInt": 1,
            "negPre": "-",
            "negSuf": "",
            "posPre": "",
            "posSuf": ""
          }, {
            "gSize": 3,
            "lgSize": 3,
            "maxFrac": 2,
            "minFrac": 2,
            "minInt": 1,
            "negPre": "-\u00a4",
            "negSuf": "",
            "posPre": "\u00a4",
            "posSuf": ""
          }]
        },
        "id": "en-us",
        "pluralCat": function(n, opt_precision) {
          var i = n | 0;
          var vf = getVF(n, opt_precision);
          if (i == 1 && vf.v == 0) {
            return PLURAL_CATEGORY.ONE;
          }
          return PLURAL_CATEGORY.OTHER;
        }
      });
    }]);
    jqLite(document).ready(function() {
      angularInit(document, bootstrap);
    });
  })(window, document);
  !window.angular.$$csp().noInlineStyle && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}.ng-animate-shim{visibility:hidden;}.ng-anchor{position:absolute;}</style>');
})(require('process'));
