(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@angular/core'], factory) :
  (factory((global.ng = global.ng || {}, global.ng.compiler = global.ng.compiler || {}),global.ng.core));
}(this, function (exports,_angular_core) { 'use strict';

  /**
   * @stable
   */
  var VERSION = new _angular_core.Version('4.0.0-rc.2-174d4c8');

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * A segment of text within the template.
   */
  var TextAst = (function () {
      function TextAst(value, ngContentIndex, sourceSpan) {
          this.value = value;
          this.ngContentIndex = ngContentIndex;
          this.sourceSpan = sourceSpan;
      }
      TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
      return TextAst;
  }());
  /**
   * A bound expression within the text of a template.
   */
  var BoundTextAst = (function () {
      function BoundTextAst(value, ngContentIndex, sourceSpan) {
          this.value = value;
          this.ngContentIndex = ngContentIndex;
          this.sourceSpan = sourceSpan;
      }
      BoundTextAst.prototype.visit = function (visitor, context) {
          return visitor.visitBoundText(this, context);
      };
      return BoundTextAst;
  }());
  /**
   * A plain attribute on an element.
   */
  var AttrAst = (function () {
      function AttrAst(name, value, sourceSpan) {
          this.name = name;
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
      return AttrAst;
  }());
  /**
   * A binding for an element property (e.g. `[property]="expression"`) or an animation trigger (e.g.
   * `[@trigger]="stateExp"`)
   */
  var BoundElementPropertyAst = (function () {
      function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
          this.name = name;
          this.type = type;
          this.securityContext = securityContext;
          this.value = value;
          this.unit = unit;
          this.sourceSpan = sourceSpan;
      }
      BoundElementPropertyAst.prototype.visit = function (visitor, context) {
          return visitor.visitElementProperty(this, context);
      };
      Object.defineProperty(BoundElementPropertyAst.prototype, "isAnimation", {
          get: function () { return this.type === exports.PropertyBindingType.Animation; },
          enumerable: true,
          configurable: true
      });
      return BoundElementPropertyAst;
  }());
  /**
   * A binding for an element event (e.g. `(event)="handler()"`) or an animation trigger event (e.g.
   * `(@trigger.phase)="callback($event)"`).
   */
  var BoundEventAst = (function () {
      function BoundEventAst(name, target, phase, handler, sourceSpan) {
          this.name = name;
          this.target = target;
          this.phase = phase;
          this.handler = handler;
          this.sourceSpan = sourceSpan;
      }
      BoundEventAst.calcFullName = function (name, target, phase) {
          if (target) {
              return target + ":" + name;
          }
          else if (phase) {
              return "@" + name + "." + phase;
          }
          else {
              return name;
          }
      };
      BoundEventAst.prototype.visit = function (visitor, context) {
          return visitor.visitEvent(this, context);
      };
      Object.defineProperty(BoundEventAst.prototype, "fullName", {
          get: function () { return BoundEventAst.calcFullName(this.name, this.target, this.phase); },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BoundEventAst.prototype, "isAnimation", {
          get: function () { return !!this.phase; },
          enumerable: true,
          configurable: true
      });
      return BoundEventAst;
  }());
  /**
   * A reference declaration on an element (e.g. `let someName="expression"`).
   */
  var ReferenceAst = (function () {
      function ReferenceAst(name, value, sourceSpan) {
          this.name = name;
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      ReferenceAst.prototype.visit = function (visitor, context) {
          return visitor.visitReference(this, context);
      };
      return ReferenceAst;
  }());
  /**
   * A variable declaration on a <ng-template> (e.g. `var-someName="someLocalName"`).
   */
  var VariableAst = (function () {
      function VariableAst(name, value, sourceSpan) {
          this.name = name;
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      VariableAst.prototype.visit = function (visitor, context) {
          return visitor.visitVariable(this, context);
      };
      return VariableAst;
  }());
  /**
   * An element declaration in a template.
   */
  var ElementAst = (function () {
      function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan, endSourceSpan) {
          this.name = name;
          this.attrs = attrs;
          this.inputs = inputs;
          this.outputs = outputs;
          this.references = references;
          this.directives = directives;
          this.providers = providers;
          this.hasViewContainer = hasViewContainer;
          this.queryMatches = queryMatches;
          this.children = children;
          this.ngContentIndex = ngContentIndex;
          this.sourceSpan = sourceSpan;
          this.endSourceSpan = endSourceSpan;
      }
      ElementAst.prototype.visit = function (visitor, context) {
          return visitor.visitElement(this, context);
      };
      return ElementAst;
  }());
  /**
   * A `<ng-template>` element included in an Angular template.
   */
  var EmbeddedTemplateAst = (function () {
      function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, queryMatches, children, ngContentIndex, sourceSpan) {
          this.attrs = attrs;
          this.outputs = outputs;
          this.references = references;
          this.variables = variables;
          this.directives = directives;
          this.providers = providers;
          this.hasViewContainer = hasViewContainer;
          this.queryMatches = queryMatches;
          this.children = children;
          this.ngContentIndex = ngContentIndex;
          this.sourceSpan = sourceSpan;
      }
      EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
          return visitor.visitEmbeddedTemplate(this, context);
      };
      return EmbeddedTemplateAst;
  }());
  /**
   * A directive property with a bound value (e.g. `*ngIf="condition").
   */
  var BoundDirectivePropertyAst = (function () {
      function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
          this.directiveName = directiveName;
          this.templateName = templateName;
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
          return visitor.visitDirectiveProperty(this, context);
      };
      return BoundDirectivePropertyAst;
  }());
  /**
   * A directive declared on an element.
   */
  var DirectiveAst = (function () {
      function DirectiveAst(directive, inputs, hostProperties, hostEvents, contentQueryStartId, sourceSpan) {
          this.directive = directive;
          this.inputs = inputs;
          this.hostProperties = hostProperties;
          this.hostEvents = hostEvents;
          this.contentQueryStartId = contentQueryStartId;
          this.sourceSpan = sourceSpan;
      }
      DirectiveAst.prototype.visit = function (visitor, context) {
          return visitor.visitDirective(this, context);
      };
      return DirectiveAst;
  }());
  /**
   * A provider declared on an element
   */
  var ProviderAst = (function () {
      function ProviderAst(token, multiProvider, eager, providers, providerType, lifecycleHooks, sourceSpan) {
          this.token = token;
          this.multiProvider = multiProvider;
          this.eager = eager;
          this.providers = providers;
          this.providerType = providerType;
          this.lifecycleHooks = lifecycleHooks;
          this.sourceSpan = sourceSpan;
      }
      ProviderAst.prototype.visit = function (visitor, context) {
          // No visit method in the visitor for now...
          return null;
      };
      return ProviderAst;
  }());
  exports.ProviderAstType;
  (function (ProviderAstType) {
      ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
      ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
      ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
      ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
      ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
  })(exports.ProviderAstType || (exports.ProviderAstType = {}));
  /**
   * Position where content is to be projected (instance of `<ng-content>` in a template).
   */
  var NgContentAst = (function () {
      function NgContentAst(index, ngContentIndex, sourceSpan) {
          this.index = index;
          this.ngContentIndex = ngContentIndex;
          this.sourceSpan = sourceSpan;
      }
      NgContentAst.prototype.visit = function (visitor, context) {
          return visitor.visitNgContent(this, context);
      };
      return NgContentAst;
  }());
  /**
   * Enumeration of types of property bindings.
   */
  exports.PropertyBindingType;
  (function (PropertyBindingType) {
      /**
       * A normal binding to a property (e.g. `[property]="expression"`).
       */
      PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
      /**
       * A binding to an element attribute (e.g. `[attr.name]="expression"`).
       */
      PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
      /**
       * A binding to a CSS class (e.g. `[class.name]="condition"`).
       */
      PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
      /**
       * A binding to a style rule (e.g. `[style.rule]="expression"`).
       */
      PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
      /**
       * A binding to an animation reference (e.g. `[animate.key]="expression"`).
       */
      PropertyBindingType[PropertyBindingType["Animation"] = 4] = "Animation";
  })(exports.PropertyBindingType || (exports.PropertyBindingType = {}));
  /**
   * Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
   */
  function templateVisitAll(visitor, asts, context) {
      if (context === void 0) { context = null; }
      var result = [];
      var visit = visitor.visit ?
          function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
          function (ast) { return ast.visit(visitor, context); };
      asts.forEach(function (ast) {
          var astResult = visit(ast);
          if (astResult) {
              result.push(astResult);
          }
      });
      return result;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * A token representing the a reference to a static type.
   *
   * This token is unique for a filePath and name and can be used as a hash table key.
   */
  var StaticSymbol = (function () {
      function StaticSymbol(filePath, name, members) {
          this.filePath = filePath;
          this.name = name;
          this.members = members;
      }
      StaticSymbol.prototype.assertNoMembers = function () {
          if (this.members.length) {
              throw new Error("Illegal state: symbol without members expected, but got " + JSON.stringify(this) + ".");
          }
      };
      return StaticSymbol;
  }());
  /**
   * A cache of static symbol used by the StaticReflector to return the same symbol for the
   * same symbol values.
   */
  var StaticSymbolCache = (function () {
      function StaticSymbolCache() {
          this.cache = new Map();
      }
      StaticSymbolCache.prototype.get = function (declarationFile, name, members) {
          members = members || [];
          var memberSuffix = members.length ? "." + members.join('.') : '';
          var key = "\"" + declarationFile + "\"." + name + memberSuffix;
          var result = this.cache.get(key);
          if (!result) {
              result = new StaticSymbol(declarationFile, name, members);
              this.cache.set(key, result);
          }
          return result;
      };
      return StaticSymbolCache;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */ exports.TagContentType;
  (function (TagContentType) {
      TagContentType[TagContentType["RAW_TEXT"] = 0] = "RAW_TEXT";
      TagContentType[TagContentType["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
      TagContentType[TagContentType["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
  })(exports.TagContentType || (exports.TagContentType = {}));
  function splitNsName(elementName) {
      if (elementName[0] != ':') {
          return [null, elementName];
      }
      var colonIndex = elementName.indexOf(':', 1);
      if (colonIndex == -1) {
          throw new Error("Unsupported format \"" + elementName + "\" expecting \":namespace:name\"");
      }
      return [elementName.slice(1, colonIndex), elementName.slice(colonIndex + 1)];
  }
  function getNsPrefix(fullName) {
      return fullName === null ? null : splitNsName(fullName)[0];
  }
  function mergeNsAndName(prefix, localName) {
      return prefix ? ":" + prefix + ":" + localName : localName;
  }
  // see http://www.w3.org/TR/html51/syntax.html#named-character-references
  // see https://html.spec.whatwg.org/multipage/entities.json
  // This list is not exhaustive to keep the compiler footprint low.
  // The `&#123;` / `&#x1ab;` syntax should be used when the named character reference does not exist.
  var NAMED_ENTITIES = {
      'Aacute': '\u00C1',
      'aacute': '\u00E1',
      'Acirc': '\u00C2',
      'acirc': '\u00E2',
      'acute': '\u00B4',
      'AElig': '\u00C6',
      'aelig': '\u00E6',
      'Agrave': '\u00C0',
      'agrave': '\u00E0',
      'alefsym': '\u2135',
      'Alpha': '\u0391',
      'alpha': '\u03B1',
      'amp': '&',
      'and': '\u2227',
      'ang': '\u2220',
      'apos': '\u0027',
      'Aring': '\u00C5',
      'aring': '\u00E5',
      'asymp': '\u2248',
      'Atilde': '\u00C3',
      'atilde': '\u00E3',
      'Auml': '\u00C4',
      'auml': '\u00E4',
      'bdquo': '\u201E',
      'Beta': '\u0392',
      'beta': '\u03B2',
      'brvbar': '\u00A6',
      'bull': '\u2022',
      'cap': '\u2229',
      'Ccedil': '\u00C7',
      'ccedil': '\u00E7',
      'cedil': '\u00B8',
      'cent': '\u00A2',
      'Chi': '\u03A7',
      'chi': '\u03C7',
      'circ': '\u02C6',
      'clubs': '\u2663',
      'cong': '\u2245',
      'copy': '\u00A9',
      'crarr': '\u21B5',
      'cup': '\u222A',
      'curren': '\u00A4',
      'dagger': '\u2020',
      'Dagger': '\u2021',
      'darr': '\u2193',
      'dArr': '\u21D3',
      'deg': '\u00B0',
      'Delta': '\u0394',
      'delta': '\u03B4',
      'diams': '\u2666',
      'divide': '\u00F7',
      'Eacute': '\u00C9',
      'eacute': '\u00E9',
      'Ecirc': '\u00CA',
      'ecirc': '\u00EA',
      'Egrave': '\u00C8',
      'egrave': '\u00E8',
      'empty': '\u2205',
      'emsp': '\u2003',
      'ensp': '\u2002',
      'Epsilon': '\u0395',
      'epsilon': '\u03B5',
      'equiv': '\u2261',
      'Eta': '\u0397',
      'eta': '\u03B7',
      'ETH': '\u00D0',
      'eth': '\u00F0',
      'Euml': '\u00CB',
      'euml': '\u00EB',
      'euro': '\u20AC',
      'exist': '\u2203',
      'fnof': '\u0192',
      'forall': '\u2200',
      'frac12': '\u00BD',
      'frac14': '\u00BC',
      'frac34': '\u00BE',
      'frasl': '\u2044',
      'Gamma': '\u0393',
      'gamma': '\u03B3',
      'ge': '\u2265',
      'gt': '>',
      'harr': '\u2194',
      'hArr': '\u21D4',
      'hearts': '\u2665',
      'hellip': '\u2026',
      'Iacute': '\u00CD',
      'iacute': '\u00ED',
      'Icirc': '\u00CE',
      'icirc': '\u00EE',
      'iexcl': '\u00A1',
      'Igrave': '\u00CC',
      'igrave': '\u00EC',
      'image': '\u2111',
      'infin': '\u221E',
      'int': '\u222B',
      'Iota': '\u0399',
      'iota': '\u03B9',
      'iquest': '\u00BF',
      'isin': '\u2208',
      'Iuml': '\u00CF',
      'iuml': '\u00EF',
      'Kappa': '\u039A',
      'kappa': '\u03BA',
      'Lambda': '\u039B',
      'lambda': '\u03BB',
      'lang': '\u27E8',
      'laquo': '\u00AB',
      'larr': '\u2190',
      'lArr': '\u21D0',
      'lceil': '\u2308',
      'ldquo': '\u201C',
      'le': '\u2264',
      'lfloor': '\u230A',
      'lowast': '\u2217',
      'loz': '\u25CA',
      'lrm': '\u200E',
      'lsaquo': '\u2039',
      'lsquo': '\u2018',
      'lt': '<',
      'macr': '\u00AF',
      'mdash': '\u2014',
      'micro': '\u00B5',
      'middot': '\u00B7',
      'minus': '\u2212',
      'Mu': '\u039C',
      'mu': '\u03BC',
      'nabla': '\u2207',
      'nbsp': '\u00A0',
      'ndash': '\u2013',
      'ne': '\u2260',
      'ni': '\u220B',
      'not': '\u00AC',
      'notin': '\u2209',
      'nsub': '\u2284',
      'Ntilde': '\u00D1',
      'ntilde': '\u00F1',
      'Nu': '\u039D',
      'nu': '\u03BD',
      'Oacute': '\u00D3',
      'oacute': '\u00F3',
      'Ocirc': '\u00D4',
      'ocirc': '\u00F4',
      'OElig': '\u0152',
      'oelig': '\u0153',
      'Ograve': '\u00D2',
      'ograve': '\u00F2',
      'oline': '\u203E',
      'Omega': '\u03A9',
      'omega': '\u03C9',
      'Omicron': '\u039F',
      'omicron': '\u03BF',
      'oplus': '\u2295',
      'or': '\u2228',
      'ordf': '\u00AA',
      'ordm': '\u00BA',
      'Oslash': '\u00D8',
      'oslash': '\u00F8',
      'Otilde': '\u00D5',
      'otilde': '\u00F5',
      'otimes': '\u2297',
      'Ouml': '\u00D6',
      'ouml': '\u00F6',
      'para': '\u00B6',
      'permil': '\u2030',
      'perp': '\u22A5',
      'Phi': '\u03A6',
      'phi': '\u03C6',
      'Pi': '\u03A0',
      'pi': '\u03C0',
      'piv': '\u03D6',
      'plusmn': '\u00B1',
      'pound': '\u00A3',
      'prime': '\u2032',
      'Prime': '\u2033',
      'prod': '\u220F',
      'prop': '\u221D',
      'Psi': '\u03A8',
      'psi': '\u03C8',
      'quot': '\u0022',
      'radic': '\u221A',
      'rang': '\u27E9',
      'raquo': '\u00BB',
      'rarr': '\u2192',
      'rArr': '\u21D2',
      'rceil': '\u2309',
      'rdquo': '\u201D',
      'real': '\u211C',
      'reg': '\u00AE',
      'rfloor': '\u230B',
      'Rho': '\u03A1',
      'rho': '\u03C1',
      'rlm': '\u200F',
      'rsaquo': '\u203A',
      'rsquo': '\u2019',
      'sbquo': '\u201A',
      'Scaron': '\u0160',
      'scaron': '\u0161',
      'sdot': '\u22C5',
      'sect': '\u00A7',
      'shy': '\u00AD',
      'Sigma': '\u03A3',
      'sigma': '\u03C3',
      'sigmaf': '\u03C2',
      'sim': '\u223C',
      'spades': '\u2660',
      'sub': '\u2282',
      'sube': '\u2286',
      'sum': '\u2211',
      'sup': '\u2283',
      'sup1': '\u00B9',
      'sup2': '\u00B2',
      'sup3': '\u00B3',
      'supe': '\u2287',
      'szlig': '\u00DF',
      'Tau': '\u03A4',
      'tau': '\u03C4',
      'there4': '\u2234',
      'Theta': '\u0398',
      'theta': '\u03B8',
      'thetasym': '\u03D1',
      'thinsp': '\u2009',
      'THORN': '\u00DE',
      'thorn': '\u00FE',
      'tilde': '\u02DC',
      'times': '\u00D7',
      'trade': '\u2122',
      'Uacute': '\u00DA',
      'uacute': '\u00FA',
      'uarr': '\u2191',
      'uArr': '\u21D1',
      'Ucirc': '\u00DB',
      'ucirc': '\u00FB',
      'Ugrave': '\u00D9',
      'ugrave': '\u00F9',
      'uml': '\u00A8',
      'upsih': '\u03D2',
      'Upsilon': '\u03A5',
      'upsilon': '\u03C5',
      'Uuml': '\u00DC',
      'uuml': '\u00FC',
      'weierp': '\u2118',
      'Xi': '\u039E',
      'xi': '\u03BE',
      'Yacute': '\u00DD',
      'yacute': '\u00FD',
      'yen': '\u00A5',
      'yuml': '\u00FF',
      'Yuml': '\u0178',
      'Zeta': '\u0396',
      'zeta': '\u03B6',
      'zwj': '\u200D',
      'zwnj': '\u200C',
  };

  var HtmlTagDefinition = (function () {
      function HtmlTagDefinition(_a) {
          var _b = _a === void 0 ? {} : _a, closedByChildren = _b.closedByChildren, requiredParents = _b.requiredParents, implicitNamespacePrefix = _b.implicitNamespacePrefix, _c = _b.contentType, contentType = _c === void 0 ? exports.TagContentType.PARSABLE_DATA : _c, _d = _b.closedByParent, closedByParent = _d === void 0 ? false : _d, _e = _b.isVoid, isVoid = _e === void 0 ? false : _e, _f = _b.ignoreFirstLf, ignoreFirstLf = _f === void 0 ? false : _f;
          var _this = this;
          this.closedByChildren = {};
          this.closedByParent = false;
          this.canSelfClose = false;
          if (closedByChildren && closedByChildren.length > 0) {
              closedByChildren.forEach(function (tagName) { return _this.closedByChildren[tagName] = true; });
          }
          this.isVoid = isVoid;
          this.closedByParent = closedByParent || isVoid;
          if (requiredParents && requiredParents.length > 0) {
              this.requiredParents = {};
              // The first parent is the list is automatically when none of the listed parents are present
              this.parentToAdd = requiredParents[0];
              requiredParents.forEach(function (tagName) { return _this.requiredParents[tagName] = true; });
          }
          this.implicitNamespacePrefix = implicitNamespacePrefix;
          this.contentType = contentType;
          this.ignoreFirstLf = ignoreFirstLf;
      }
      HtmlTagDefinition.prototype.requireExtraParent = function (currentParent) {
          if (!this.requiredParents) {
              return false;
          }
          if (!currentParent) {
              return true;
          }
          var lcParent = currentParent.toLowerCase();
          var isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
          return !isParentTemplate && this.requiredParents[lcParent] != true;
      };
      HtmlTagDefinition.prototype.isClosedByChild = function (name) {
          return this.isVoid || name.toLowerCase() in this.closedByChildren;
      };
      return HtmlTagDefinition;
  }());
  // see http://www.w3.org/TR/html51/syntax.html#optional-tags
  // This implementation does not fully conform to the HTML5 spec.
  var TAG_DEFINITIONS = {
      'base': new HtmlTagDefinition({ isVoid: true }),
      'meta': new HtmlTagDefinition({ isVoid: true }),
      'area': new HtmlTagDefinition({ isVoid: true }),
      'embed': new HtmlTagDefinition({ isVoid: true }),
      'link': new HtmlTagDefinition({ isVoid: true }),
      'img': new HtmlTagDefinition({ isVoid: true }),
      'input': new HtmlTagDefinition({ isVoid: true }),
      'param': new HtmlTagDefinition({ isVoid: true }),
      'hr': new HtmlTagDefinition({ isVoid: true }),
      'br': new HtmlTagDefinition({ isVoid: true }),
      'source': new HtmlTagDefinition({ isVoid: true }),
      'track': new HtmlTagDefinition({ isVoid: true }),
      'wbr': new HtmlTagDefinition({ isVoid: true }),
      'p': new HtmlTagDefinition({
          closedByChildren: [
              'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form',
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr',
              'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'
          ],
          closedByParent: true
      }),
      'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
      'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
      'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
      'tr': new HtmlTagDefinition({
          closedByChildren: ['tr'],
          requiredParents: ['tbody', 'tfoot', 'thead'],
          closedByParent: true
      }),
      'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
      'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
      'col': new HtmlTagDefinition({ requiredParents: ['colgroup'], isVoid: true }),
      'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
      'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
      'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
      'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
      'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
      'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
      'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
      'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
      'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
      'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
      'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
      'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
      'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
      'style': new HtmlTagDefinition({ contentType: exports.TagContentType.RAW_TEXT }),
      'script': new HtmlTagDefinition({ contentType: exports.TagContentType.RAW_TEXT }),
      'title': new HtmlTagDefinition({ contentType: exports.TagContentType.ESCAPABLE_RAW_TEXT }),
      'textarea': new HtmlTagDefinition({ contentType: exports.TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
  };
  var _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
  function getHtmlTagDefinition(tagName) {
      return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
  }

  var _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
      '([-\\w]+)|' +
      '(?:\\.([-\\w]+))|' +
      // "-" should appear first in the regexp below as FF31 parses "[.-\w]" as a range
      '(?:\\[([-.\\w*]+)(?:=([\"\']?)([^\\]\"\']*)\\5)?\\])|' +
      // "[name="value"]",
      // "[name='value']"
      '(\\))|' +
      '(\\s*,\\s*)', // ","
  'g');
  /**
   * A css selector contains an element name,
   * css classes and attribute/value pairs with the purpose
   * of selecting subsets out of them.
   */
  var CssSelector = (function () {
      function CssSelector() {
          this.element = null;
          this.classNames = [];
          this.attrs = [];
          this.notSelectors = [];
      }
      CssSelector.parse = function (selector) {
          var results = [];
          var _addResult = function (res, cssSel) {
              if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                  cssSel.attrs.length == 0) {
                  cssSel.element = '*';
              }
              res.push(cssSel);
          };
          var cssSelector = new CssSelector();
          var match;
          var current = cssSelector;
          var inNot = false;
          _SELECTOR_REGEXP.lastIndex = 0;
          while (match = _SELECTOR_REGEXP.exec(selector)) {
              if (match[1]) {
                  if (inNot) {
                      throw new Error('Nesting :not is not allowed in a selector');
                  }
                  inNot = true;
                  current = new CssSelector();
                  cssSelector.notSelectors.push(current);
              }
              if (match[2]) {
                  current.setElement(match[2]);
              }
              if (match[3]) {
                  current.addClassName(match[3]);
              }
              if (match[4]) {
                  current.addAttribute(match[4], match[6]);
              }
              if (match[7]) {
                  inNot = false;
                  current = cssSelector;
              }
              if (match[8]) {
                  if (inNot) {
                      throw new Error('Multiple selectors in :not are not supported');
                  }
                  _addResult(results, cssSelector);
                  cssSelector = current = new CssSelector();
              }
          }
          _addResult(results, cssSelector);
          return results;
      };
      CssSelector.prototype.isElementSelector = function () {
          return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
              this.notSelectors.length === 0;
      };
      CssSelector.prototype.hasElementSelector = function () { return !!this.element; };
      CssSelector.prototype.setElement = function (element) {
          if (element === void 0) { element = null; }
          this.element = element;
      };
      /** Gets a template string for an element that matches the selector. */
      CssSelector.prototype.getMatchingElementTemplate = function () {
          var tagName = this.element || 'div';
          var classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
          var attrs = '';
          for (var i = 0; i < this.attrs.length; i += 2) {
              var attrName = this.attrs[i];
              var attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
              attrs += " " + attrName + attrValue;
          }
          return getHtmlTagDefinition(tagName).isVoid ? "<" + tagName + classAttr + attrs + "/>" :
              "<" + tagName + classAttr + attrs + "></" + tagName + ">";
      };
      CssSelector.prototype.addAttribute = function (name, value) {
          if (value === void 0) { value = ''; }
          this.attrs.push(name, value && value.toLowerCase() || '');
      };
      CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
      CssSelector.prototype.toString = function () {
          var res = this.element || '';
          if (this.classNames) {
              this.classNames.forEach(function (klass) { return res += "." + klass; });
          }
          if (this.attrs) {
              for (var i = 0; i < this.attrs.length; i += 2) {
                  var name_1 = this.attrs[i];
                  var value = this.attrs[i + 1];
                  res += "[" + name_1 + (value ? '=' + value : '') + "]";
              }
          }
          this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
          return res;
      };
      return CssSelector;
  }());
  /**
   * Reads a list of CssSelectors and allows to calculate which ones
   * are contained in a given CssSelector.
   */
  var SelectorMatcher = (function () {
      function SelectorMatcher() {
          this._elementMap = new Map();
          this._elementPartialMap = new Map();
          this._classMap = new Map();
          this._classPartialMap = new Map();
          this._attrValueMap = new Map();
          this._attrValuePartialMap = new Map();
          this._listContexts = [];
      }
      SelectorMatcher.createNotMatcher = function (notSelectors) {
          var notMatcher = new SelectorMatcher();
          notMatcher.addSelectables(notSelectors, null);
          return notMatcher;
      };
      SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
          var listContext = null;
          if (cssSelectors.length > 1) {
              listContext = new SelectorListContext(cssSelectors);
              this._listContexts.push(listContext);
          }
          for (var i = 0; i < cssSelectors.length; i++) {
              this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
          }
      };
      /**
       * Add an object that can be found later on by calling `match`.
       * @param cssSelector A css selector
       * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
       */
      SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
          var matcher = this;
          var element = cssSelector.element;
          var classNames = cssSelector.classNames;
          var attrs = cssSelector.attrs;
          var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
          if (element) {
              var isTerminal = attrs.length === 0 && classNames.length === 0;
              if (isTerminal) {
                  this._addTerminal(matcher._elementMap, element, selectable);
              }
              else {
                  matcher = this._addPartial(matcher._elementPartialMap, element);
              }
          }
          if (classNames) {
              for (var i = 0; i < classNames.length; i++) {
                  var isTerminal = attrs.length === 0 && i === classNames.length - 1;
                  var className = classNames[i];
                  if (isTerminal) {
                      this._addTerminal(matcher._classMap, className, selectable);
                  }
                  else {
                      matcher = this._addPartial(matcher._classPartialMap, className);
                  }
              }
          }
          if (attrs) {
              for (var i = 0; i < attrs.length; i += 2) {
                  var isTerminal = i === attrs.length - 2;
                  var name_2 = attrs[i];
                  var value = attrs[i + 1];
                  if (isTerminal) {
                      var terminalMap = matcher._attrValueMap;
                      var terminalValuesMap = terminalMap.get(name_2);
                      if (!terminalValuesMap) {
                          terminalValuesMap = new Map();
                          terminalMap.set(name_2, terminalValuesMap);
                      }
                      this._addTerminal(terminalValuesMap, value, selectable);
                  }
                  else {
                      var partialMap = matcher._attrValuePartialMap;
                      var partialValuesMap = partialMap.get(name_2);
                      if (!partialValuesMap) {
                          partialValuesMap = new Map();
                          partialMap.set(name_2, partialValuesMap);
                      }
                      matcher = this._addPartial(partialValuesMap, value);
                  }
              }
          }
      };
      SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
          var terminalList = map.get(name);
          if (!terminalList) {
              terminalList = [];
              map.set(name, terminalList);
          }
          terminalList.push(selectable);
      };
      SelectorMatcher.prototype._addPartial = function (map, name) {
          var matcher = map.get(name);
          if (!matcher) {
              matcher = new SelectorMatcher();
              map.set(name, matcher);
          }
          return matcher;
      };
      /**
       * Find the objects that have been added via `addSelectable`
       * whose css selector is contained in the given css selector.
       * @param cssSelector A css selector
       * @param matchedCallback This callback will be called with the object handed into `addSelectable`
       * @return boolean true if a match was found
      */
      SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
          var result = false;
          var element = cssSelector.element;
          var classNames = cssSelector.classNames;
          var attrs = cssSelector.attrs;
          for (var i = 0; i < this._listContexts.length; i++) {
              this._listContexts[i].alreadyMatched = false;
          }
          result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
          result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
              result;
          if (classNames) {
              for (var i = 0; i < classNames.length; i++) {
                  var className = classNames[i];
                  result =
                      this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                  result =
                      this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                          result;
              }
          }
          if (attrs) {
              for (var i = 0; i < attrs.length; i += 2) {
                  var name_3 = attrs[i];
                  var value = attrs[i + 1];
                  var terminalValuesMap = this._attrValueMap.get(name_3);
                  if (value) {
                      result =
                          this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                  }
                  result =
                      this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                  var partialValuesMap = this._attrValuePartialMap.get(name_3);
                  if (value) {
                      result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                  }
                  result =
                      this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
              }
          }
          return result;
      };
      /** @internal */
      SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
          if (!map || typeof name !== 'string') {
              return false;
          }
          var selectables = map.get(name) || [];
          var starSelectables = map.get('*');
          if (starSelectables) {
              selectables = selectables.concat(starSelectables);
          }
          if (selectables.length === 0) {
              return false;
          }
          var selectable;
          var result = false;
          for (var i = 0; i < selectables.length; i++) {
              selectable = selectables[i];
              result = selectable.finalize(cssSelector, matchedCallback) || result;
          }
          return result;
      };
      /** @internal */
      SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback) {
          if (!map || typeof name !== 'string') {
              return false;
          }
          var nestedSelector = map.get(name);
          if (!nestedSelector) {
              return false;
          }
          // TODO(perf): get rid of recursion and measure again
          // TODO(perf): don't pass the whole selector into the recursion,
          // but only the not processed parts
          return nestedSelector.match(cssSelector, matchedCallback);
      };
      return SelectorMatcher;
  }());
  var SelectorListContext = (function () {
      function SelectorListContext(selectors) {
          this.selectors = selectors;
          this.alreadyMatched = false;
      }
      return SelectorListContext;
  }());
  // Store context to pass back selector and context when a selector is matched
  var SelectorContext = (function () {
      function SelectorContext(selector, cbContext, listContext) {
          this.selector = selector;
          this.cbContext = cbContext;
          this.listContext = listContext;
          this.notSelectors = selector.notSelectors;
      }
      SelectorContext.prototype.finalize = function (cssSelector, callback) {
          var result = true;
          if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
              var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
              result = !notMatcher.match(cssSelector, null);
          }
          if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
              if (this.listContext) {
                  this.listContext.alreadyMatched = true;
              }
              callback(this.selector, this.cbContext);
          }
          return result;
      };
      return SelectorContext;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */ var MODULE_SUFFIX = '';
  var DASH_CASE_REGEXP = /-+([a-z0-9])/g;
  function dashCaseToCamelCase(input) {
      return input.replace(DASH_CASE_REGEXP, function () {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              m[_i] = arguments[_i];
          }
          return m[1].toUpperCase();
      });
  }
  function splitAtColon(input, defaultValues) {
      return _splitAt(input, ':', defaultValues);
  }
  function splitAtPeriod(input, defaultValues) {
      return _splitAt(input, '.', defaultValues);
  }
  function _splitAt(input, character, defaultValues) {
      var characterIndex = input.indexOf(character);
      if (characterIndex == -1)
          return defaultValues;
      return [input.slice(0, characterIndex).trim(), input.slice(characterIndex + 1).trim()];
  }
  function visitValue(value, visitor, context) {
      if (Array.isArray(value)) {
          return visitor.visitArray(value, context);
      }
      if (isStrictStringMap(value)) {
          return visitor.visitStringMap(value, context);
      }
      if (value == null || typeof value == 'string' || typeof value == 'number' ||
          typeof value == 'boolean') {
          return visitor.visitPrimitive(value, context);
      }
      return visitor.visitOther(value, context);
  }
  var ValueTransformer = (function () {
      function ValueTransformer() {
      }
      ValueTransformer.prototype.visitArray = function (arr, context) {
          var _this = this;
          return arr.map(function (value) { return visitValue(value, _this, context); });
      };
      ValueTransformer.prototype.visitStringMap = function (map, context) {
          var _this = this;
          var result = {};
          Object.keys(map).forEach(function (key) { result[key] = visitValue(map[key], _this, context); });
          return result;
      };
      ValueTransformer.prototype.visitPrimitive = function (value, context) { return value; };
      ValueTransformer.prototype.visitOther = function (value, context) { return value; };
      return ValueTransformer;
  }());
  var SyncAsyncResult = (function () {
      function SyncAsyncResult(syncResult, asyncResult) {
          if (asyncResult === void 0) { asyncResult = null; }
          this.syncResult = syncResult;
          this.asyncResult = asyncResult;
          if (!asyncResult) {
              this.asyncResult = Promise.resolve(syncResult);
          }
      }
      return SyncAsyncResult;
  }());
  function syntaxError(msg) {
      var error = Error(msg);
      error[ERROR_SYNTAX_ERROR] = true;
      return error;
  }
  var ERROR_SYNTAX_ERROR = 'ngSyntaxError';
  function isSyntaxError(error) {
      return error[ERROR_SYNTAX_ERROR];
  }
  function escapeRegExp(s) {
      return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }
  var STRING_MAP_PROTO = Object.getPrototypeOf({});
  function isStrictStringMap(obj) {
      return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$1 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  // group 0: "[prop] or (event) or @trigger"
  // group 1: "prop" from "[prop]"
  // group 2: "event" from "(event)"
  // group 3: "@trigger" from "@trigger"
  var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))|(\@[-\w]+)$/;
  var CompileAnimationEntryMetadata = (function () {
      function CompileAnimationEntryMetadata(name, definitions) {
          if (name === void 0) { name = null; }
          if (definitions === void 0) { definitions = null; }
          this.name = name;
          this.definitions = definitions;
      }
      return CompileAnimationEntryMetadata;
  }());
  var CompileAnimationStateMetadata = (function () {
      function CompileAnimationStateMetadata() {
      }
      return CompileAnimationStateMetadata;
  }());
  var CompileAnimationStateDeclarationMetadata = (function (_super) {
      __extends$1(CompileAnimationStateDeclarationMetadata, _super);
      function CompileAnimationStateDeclarationMetadata(stateNameExpr, styles) {
          var _this = _super.call(this) || this;
          _this.stateNameExpr = stateNameExpr;
          _this.styles = styles;
          return _this;
      }
      return CompileAnimationStateDeclarationMetadata;
  }(CompileAnimationStateMetadata));
  var CompileAnimationStateTransitionMetadata = (function (_super) {
      __extends$1(CompileAnimationStateTransitionMetadata, _super);
      function CompileAnimationStateTransitionMetadata(stateChangeExpr, steps) {
          var _this = _super.call(this) || this;
          _this.stateChangeExpr = stateChangeExpr;
          _this.steps = steps;
          return _this;
      }
      return CompileAnimationStateTransitionMetadata;
  }(CompileAnimationStateMetadata));
  var CompileAnimationMetadata = (function () {
      function CompileAnimationMetadata() {
      }
      return CompileAnimationMetadata;
  }());
  var CompileAnimationKeyframesSequenceMetadata = (function (_super) {
      __extends$1(CompileAnimationKeyframesSequenceMetadata, _super);
      function CompileAnimationKeyframesSequenceMetadata(steps) {
          if (steps === void 0) { steps = []; }
          var _this = _super.call(this) || this;
          _this.steps = steps;
          return _this;
      }
      return CompileAnimationKeyframesSequenceMetadata;
  }(CompileAnimationMetadata));
  var CompileAnimationStyleMetadata = (function (_super) {
      __extends$1(CompileAnimationStyleMetadata, _super);
      function CompileAnimationStyleMetadata(offset, styles) {
          if (styles === void 0) { styles = null; }
          var _this = _super.call(this) || this;
          _this.offset = offset;
          _this.styles = styles;
          return _this;
      }
      return CompileAnimationStyleMetadata;
  }(CompileAnimationMetadata));
  var CompileAnimationAnimateMetadata = (function (_super) {
      __extends$1(CompileAnimationAnimateMetadata, _super);
      function CompileAnimationAnimateMetadata(timings, styles) {
          if (timings === void 0) { timings = 0; }
          if (styles === void 0) { styles = null; }
          var _this = _super.call(this) || this;
          _this.timings = timings;
          _this.styles = styles;
          return _this;
      }
      return CompileAnimationAnimateMetadata;
  }(CompileAnimationMetadata));
  var CompileAnimationWithStepsMetadata = (function (_super) {
      __extends$1(CompileAnimationWithStepsMetadata, _super);
      function CompileAnimationWithStepsMetadata(steps) {
          if (steps === void 0) { steps = null; }
          var _this = _super.call(this) || this;
          _this.steps = steps;
          return _this;
      }
      return CompileAnimationWithStepsMetadata;
  }(CompileAnimationMetadata));
  var CompileAnimationSequenceMetadata = (function (_super) {
      __extends$1(CompileAnimationSequenceMetadata, _super);
      function CompileAnimationSequenceMetadata(steps) {
          if (steps === void 0) { steps = null; }
          return _super.call(this, steps) || this;
      }
      return CompileAnimationSequenceMetadata;
  }(CompileAnimationWithStepsMetadata));
  var CompileAnimationGroupMetadata = (function (_super) {
      __extends$1(CompileAnimationGroupMetadata, _super);
      function CompileAnimationGroupMetadata(steps) {
          if (steps === void 0) { steps = null; }
          return _super.call(this, steps) || this;
      }
      return CompileAnimationGroupMetadata;
  }(CompileAnimationWithStepsMetadata));
  function _sanitizeIdentifier(name) {
      return name.replace(/\W/g, '_');
  }
  var _anonymousTypeIndex = 0;
  function identifierName(compileIdentifier) {
      if (!compileIdentifier || !compileIdentifier.reference) {
          return null;
      }
      var ref = compileIdentifier.reference;
      if (ref instanceof StaticSymbol) {
          return ref.name;
      }
      if (ref['__anonymousType']) {
          return ref['__anonymousType'];
      }
      var identifier = _angular_core.ɵstringify(ref);
      if (identifier.indexOf('(') >= 0) {
          // case: anonymous functions!
          identifier = "anonymous_" + _anonymousTypeIndex++;
          ref['__anonymousType'] = identifier;
      }
      else {
          identifier = _sanitizeIdentifier(identifier);
      }
      return identifier;
  }
  function identifierModuleUrl(compileIdentifier) {
      var ref = compileIdentifier.reference;
      if (ref instanceof StaticSymbol) {
          return ref.filePath;
      }
      return _angular_core.ɵreflector.importUri(ref);
  }
  function viewClassName(compType, embeddedTemplateIndex) {
      return "View_" + identifierName({ reference: compType }) + "_" + embeddedTemplateIndex;
  }
  function rendererTypeName(compType) {
      return "RenderType_" + identifierName({ reference: compType });
  }
  function hostViewClassName(compType) {
      return "HostView_" + identifierName({ reference: compType });
  }
  function dirWrapperClassName(dirType) {
      return "Wrapper_" + identifierName({ reference: dirType });
  }
  function componentFactoryName(compType) {
      return identifierName({ reference: compType }) + "NgFactory";
  }
  exports.CompileSummaryKind;
  (function (CompileSummaryKind) {
      CompileSummaryKind[CompileSummaryKind["Pipe"] = 0] = "Pipe";
      CompileSummaryKind[CompileSummaryKind["Directive"] = 1] = "Directive";
      CompileSummaryKind[CompileSummaryKind["NgModule"] = 2] = "NgModule";
      CompileSummaryKind[CompileSummaryKind["Injectable"] = 3] = "Injectable";
  })(exports.CompileSummaryKind || (exports.CompileSummaryKind = {}));
  function tokenName(token) {
      return token.value != null ? _sanitizeIdentifier(token.value) : identifierName(token.identifier);
  }
  function tokenReference(token) {
      if (token.identifier != null) {
          return token.identifier.reference;
      }
      else {
          return token.value;
      }
  }
  /**
   * Metadata about a stylesheet
   */
  var CompileStylesheetMetadata = (function () {
      function CompileStylesheetMetadata(_a) {
          var _b = _a === void 0 ? {} : _a, moduleUrl = _b.moduleUrl, styles = _b.styles, styleUrls = _b.styleUrls;
          this.moduleUrl = moduleUrl;
          this.styles = _normalizeArray(styles);
          this.styleUrls = _normalizeArray(styleUrls);
      }
      return CompileStylesheetMetadata;
  }());
  /**
   * Metadata regarding compilation of a template.
   */
  var CompileTemplateMetadata = (function () {
      function CompileTemplateMetadata(_a) {
          var _b = _a === void 0 ? {} : _a, encapsulation = _b.encapsulation, template = _b.template, templateUrl = _b.templateUrl, styles = _b.styles, styleUrls = _b.styleUrls, externalStylesheets = _b.externalStylesheets, animations = _b.animations, ngContentSelectors = _b.ngContentSelectors, interpolation = _b.interpolation;
          this.encapsulation = encapsulation;
          this.template = template;
          this.templateUrl = templateUrl;
          this.styles = _normalizeArray(styles);
          this.styleUrls = _normalizeArray(styleUrls);
          this.externalStylesheets = _normalizeArray(externalStylesheets);
          this.animations = animations ? flatten(animations) : [];
          this.ngContentSelectors = ngContentSelectors || [];
          if (interpolation && interpolation.length != 2) {
              throw new Error("'interpolation' should have a start and an end symbol.");
          }
          this.interpolation = interpolation;
      }
      CompileTemplateMetadata.prototype.toSummary = function () {
          return {
              animations: this.animations.map(function (anim) { return anim.name; }),
              ngContentSelectors: this.ngContentSelectors,
              encapsulation: this.encapsulation,
          };
      };
      return CompileTemplateMetadata;
  }());
  /**
   * Metadata regarding compilation of a directive.
   */
  var CompileDirectiveMetadata = (function () {
      function CompileDirectiveMetadata(_a) {
          var _b = _a === void 0 ? {} : _a, isHost = _b.isHost, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, hostListeners = _b.hostListeners, hostProperties = _b.hostProperties, hostAttributes = _b.hostAttributes, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, entryComponents = _b.entryComponents, template = _b.template, componentViewType = _b.componentViewType, rendererType = _b.rendererType, componentFactory = _b.componentFactory;
          this.isHost = !!isHost;
          this.type = type;
          this.isComponent = isComponent;
          this.selector = selector;
          this.exportAs = exportAs;
          this.changeDetection = changeDetection;
          this.inputs = inputs;
          this.outputs = outputs;
          this.hostListeners = hostListeners;
          this.hostProperties = hostProperties;
          this.hostAttributes = hostAttributes;
          this.providers = _normalizeArray(providers);
          this.viewProviders = _normalizeArray(viewProviders);
          this.queries = _normalizeArray(queries);
          this.viewQueries = _normalizeArray(viewQueries);
          this.entryComponents = _normalizeArray(entryComponents);
          this.template = template;
          this.componentViewType = componentViewType;
          this.rendererType = rendererType;
          this.componentFactory = componentFactory;
      }
      CompileDirectiveMetadata.create = function (_a) {
          var _b = _a === void 0 ? {} : _a, isHost = _b.isHost, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, entryComponents = _b.entryComponents, template = _b.template, componentViewType = _b.componentViewType, rendererType = _b.rendererType, componentFactory = _b.componentFactory;
          var hostListeners = {};
          var hostProperties = {};
          var hostAttributes = {};
          if (host != null) {
              Object.keys(host).forEach(function (key) {
                  var value = host[key];
                  var matches = key.match(HOST_REG_EXP);
                  if (matches === null) {
                      hostAttributes[key] = value;
                  }
                  else if (matches[1] != null) {
                      hostProperties[matches[1]] = value;
                  }
                  else if (matches[2] != null) {
                      hostListeners[matches[2]] = value;
                  }
              });
          }
          var inputsMap = {};
          if (inputs != null) {
              inputs.forEach(function (bindConfig) {
                  // canonical syntax: `dirProp: elProp`
                  // if there is no `:`, use dirProp = elProp
                  var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                  inputsMap[parts[0]] = parts[1];
              });
          }
          var outputsMap = {};
          if (outputs != null) {
              outputs.forEach(function (bindConfig) {
                  // canonical syntax: `dirProp: elProp`
                  // if there is no `:`, use dirProp = elProp
                  var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                  outputsMap[parts[0]] = parts[1];
              });
          }
          return new CompileDirectiveMetadata({
              isHost: isHost,
              type: type,
              isComponent: !!isComponent, selector: selector, exportAs: exportAs, changeDetection: changeDetection,
              inputs: inputsMap,
              outputs: outputsMap,
              hostListeners: hostListeners,
              hostProperties: hostProperties,
              hostAttributes: hostAttributes,
              providers: providers,
              viewProviders: viewProviders,
              queries: queries,
              viewQueries: viewQueries,
              entryComponents: entryComponents,
              template: template,
              componentViewType: componentViewType,
              rendererType: rendererType,
              componentFactory: componentFactory,
          });
      };
      CompileDirectiveMetadata.prototype.toSummary = function () {
          return {
              summaryKind: exports.CompileSummaryKind.Directive,
              type: this.type,
              isComponent: this.isComponent,
              selector: this.selector,
              exportAs: this.exportAs,
              inputs: this.inputs,
              outputs: this.outputs,
              hostListeners: this.hostListeners,
              hostProperties: this.hostProperties,
              hostAttributes: this.hostAttributes,
              providers: this.providers,
              viewProviders: this.viewProviders,
              queries: this.queries,
              viewQueries: this.viewQueries,
              entryComponents: this.entryComponents,
              changeDetection: this.changeDetection,
              template: this.template && this.template.toSummary(),
              componentViewType: this.componentViewType,
              rendererType: this.rendererType,
              componentFactory: this.componentFactory
          };
      };
      return CompileDirectiveMetadata;
  }());
  /**
   * Construct {@link CompileDirectiveMetadata} from {@link ComponentTypeMetadata} and a selector.
   */
  function createHostComponentMeta(hostTypeReference, compMeta, hostViewType) {
      var template = CssSelector.parse(compMeta.selector)[0].getMatchingElementTemplate();
      return CompileDirectiveMetadata.create({
          isHost: true,
          type: { reference: hostTypeReference, diDeps: [], lifecycleHooks: [] },
          template: new CompileTemplateMetadata({
              encapsulation: _angular_core.ViewEncapsulation.None,
              template: template,
              templateUrl: '',
              styles: [],
              styleUrls: [],
              ngContentSelectors: [],
              animations: []
          }),
          changeDetection: _angular_core.ChangeDetectionStrategy.Default,
          inputs: [],
          outputs: [],
          host: {},
          isComponent: true,
          selector: '*',
          providers: [],
          viewProviders: [],
          queries: [],
          viewQueries: [],
          componentViewType: hostViewType,
          rendererType: { id: '__Host__', encapsulation: _angular_core.ViewEncapsulation.None, styles: [], data: {} }
      });
  }
  var CompilePipeMetadata = (function () {
      function CompilePipeMetadata(_a) {
          var _b = _a === void 0 ? {} : _a, type = _b.type, name = _b.name, pure = _b.pure;
          this.type = type;
          this.name = name;
          this.pure = !!pure;
      }
      CompilePipeMetadata.prototype.toSummary = function () {
          return {
              summaryKind: exports.CompileSummaryKind.Pipe,
              type: this.type,
              name: this.name,
              pure: this.pure
          };
      };
      return CompilePipeMetadata;
  }());
  /**
   * Metadata regarding compilation of a module.
   */
  var CompileNgModuleMetadata = (function () {
      function CompileNgModuleMetadata(_a) {
          var _b = _a === void 0 ? {} : _a, type = _b.type, providers = _b.providers, declaredDirectives = _b.declaredDirectives, exportedDirectives = _b.exportedDirectives, declaredPipes = _b.declaredPipes, exportedPipes = _b.exportedPipes, entryComponents = _b.entryComponents, bootstrapComponents = _b.bootstrapComponents, importedModules = _b.importedModules, exportedModules = _b.exportedModules, schemas = _b.schemas, transitiveModule = _b.transitiveModule, id = _b.id;
          this.type = type;
          this.declaredDirectives = _normalizeArray(declaredDirectives);
          this.exportedDirectives = _normalizeArray(exportedDirectives);
          this.declaredPipes = _normalizeArray(declaredPipes);
          this.exportedPipes = _normalizeArray(exportedPipes);
          this.providers = _normalizeArray(providers);
          this.entryComponents = _normalizeArray(entryComponents);
          this.bootstrapComponents = _normalizeArray(bootstrapComponents);
          this.importedModules = _normalizeArray(importedModules);
          this.exportedModules = _normalizeArray(exportedModules);
          this.schemas = _normalizeArray(schemas);
          this.id = id;
          this.transitiveModule = transitiveModule;
      }
      CompileNgModuleMetadata.prototype.toSummary = function () {
          return {
              summaryKind: exports.CompileSummaryKind.NgModule,
              type: this.type,
              entryComponents: this.transitiveModule.entryComponents,
              providers: this.transitiveModule.providers,
              modules: this.transitiveModule.modules,
              exportedDirectives: this.transitiveModule.exportedDirectives,
              exportedPipes: this.transitiveModule.exportedPipes
          };
      };
      return CompileNgModuleMetadata;
  }());
  var TransitiveCompileNgModuleMetadata = (function () {
      function TransitiveCompileNgModuleMetadata() {
          this.directivesSet = new Set();
          this.directives = [];
          this.exportedDirectivesSet = new Set();
          this.exportedDirectives = [];
          this.pipesSet = new Set();
          this.pipes = [];
          this.exportedPipesSet = new Set();
          this.exportedPipes = [];
          this.modulesSet = new Set();
          this.modules = [];
          this.entryComponentsSet = new Set();
          this.entryComponents = [];
          this.providers = [];
      }
      TransitiveCompileNgModuleMetadata.prototype.addProvider = function (provider, module) {
          this.providers.push({ provider: provider, module: module });
      };
      TransitiveCompileNgModuleMetadata.prototype.addDirective = function (id) {
          if (!this.directivesSet.has(id.reference)) {
              this.directivesSet.add(id.reference);
              this.directives.push(id);
          }
      };
      TransitiveCompileNgModuleMetadata.prototype.addExportedDirective = function (id) {
          if (!this.exportedDirectivesSet.has(id.reference)) {
              this.exportedDirectivesSet.add(id.reference);
              this.exportedDirectives.push(id);
          }
      };
      TransitiveCompileNgModuleMetadata.prototype.addPipe = function (id) {
          if (!this.pipesSet.has(id.reference)) {
              this.pipesSet.add(id.reference);
              this.pipes.push(id);
          }
      };
      TransitiveCompileNgModuleMetadata.prototype.addExportedPipe = function (id) {
          if (!this.exportedPipesSet.has(id.reference)) {
              this.exportedPipesSet.add(id.reference);
              this.exportedPipes.push(id);
          }
      };
      TransitiveCompileNgModuleMetadata.prototype.addModule = function (id) {
          if (!this.modulesSet.has(id.reference)) {
              this.modulesSet.add(id.reference);
              this.modules.push(id);
          }
      };
      TransitiveCompileNgModuleMetadata.prototype.addEntryComponent = function (ec) {
          if (!this.entryComponentsSet.has(ec.componentType)) {
              this.entryComponentsSet.add(ec.componentType);
              this.entryComponents.push(ec);
          }
      };
      return TransitiveCompileNgModuleMetadata;
  }());
  function _normalizeArray(obj) {
      return obj || [];
  }
  var ProviderMeta = (function () {
      function ProviderMeta(token, _a) {
          var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
          this.token = token;
          this.useClass = useClass;
          this.useValue = useValue;
          this.useExisting = useExisting;
          this.useFactory = useFactory;
          this.dependencies = deps;
          this.multi = !!multi;
      }
      return ProviderMeta;
  }());
  function flatten(list) {
      return list.reduce(function (flat, item) {
          var flatItem = Array.isArray(item) ? flatten(item) : item;
          return flat.concat(flatItem);
      }, []);
  }

  var CompilerConfig = (function () {
      function CompilerConfig(_a) {
          var _b = _a === void 0 ? {} : _a, _c = _b.defaultEncapsulation, defaultEncapsulation = _c === void 0 ? _angular_core.ViewEncapsulation.Emulated : _c, _d = _b.useJit, useJit = _d === void 0 ? true : _d, missingTranslation = _b.missingTranslation, enableLegacyTemplate = _b.enableLegacyTemplate;
          this.defaultEncapsulation = defaultEncapsulation;
          this.useJit = useJit;
          this.missingTranslation = missingTranslation;
          this.enableLegacyTemplate = enableLegacyTemplate !== false;
      }
      return CompilerConfig;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$2 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserError = (function () {
      function ParserError(message, input, errLocation, ctxLocation) {
          this.input = input;
          this.errLocation = errLocation;
          this.ctxLocation = ctxLocation;
          this.message = "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation;
      }
      return ParserError;
  }());
  var ParseSpan = (function () {
      function ParseSpan(start, end) {
          this.start = start;
          this.end = end;
      }
      return ParseSpan;
  }());
  var AST = (function () {
      function AST(span) {
          this.span = span;
      }
      AST.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return null;
      };
      AST.prototype.toString = function () { return 'AST'; };
      return AST;
  }());
  /**
   * Represents a quoted expression of the form:
   *
   * quote = prefix `:` uninterpretedExpression
   * prefix = identifier
   * uninterpretedExpression = arbitrary string
   *
   * A quoted expression is meant to be pre-processed by an AST transformer that
   * converts it into another AST that no longer contains quoted expressions.
   * It is meant to allow third-party developers to extend Angular template
   * expression language. The `uninterpretedExpression` part of the quote is
   * therefore not interpreted by the Angular's own expression parser.
   */
  var Quote = (function (_super) {
      __extends$2(Quote, _super);
      function Quote(span, prefix, uninterpretedExpression, location) {
          var _this = _super.call(this, span) || this;
          _this.prefix = prefix;
          _this.uninterpretedExpression = uninterpretedExpression;
          _this.location = location;
          return _this;
      }
      Quote.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitQuote(this, context);
      };
      Quote.prototype.toString = function () { return 'Quote'; };
      return Quote;
  }(AST));
  var EmptyExpr = (function (_super) {
      __extends$2(EmptyExpr, _super);
      function EmptyExpr() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      EmptyExpr.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          // do nothing
      };
      return EmptyExpr;
  }(AST));
  var ImplicitReceiver = (function (_super) {
      __extends$2(ImplicitReceiver, _super);
      function ImplicitReceiver() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      ImplicitReceiver.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitImplicitReceiver(this, context);
      };
      return ImplicitReceiver;
  }(AST));
  /**
   * Multiple expressions separated by a semicolon.
   */
  var Chain = (function (_super) {
      __extends$2(Chain, _super);
      function Chain(span, expressions) {
          var _this = _super.call(this, span) || this;
          _this.expressions = expressions;
          return _this;
      }
      Chain.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitChain(this, context);
      };
      return Chain;
  }(AST));
  var Conditional = (function (_super) {
      __extends$2(Conditional, _super);
      function Conditional(span, condition, trueExp, falseExp) {
          var _this = _super.call(this, span) || this;
          _this.condition = condition;
          _this.trueExp = trueExp;
          _this.falseExp = falseExp;
          return _this;
      }
      Conditional.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitConditional(this, context);
      };
      return Conditional;
  }(AST));
  var PropertyRead = (function (_super) {
      __extends$2(PropertyRead, _super);
      function PropertyRead(span, receiver, name) {
          var _this = _super.call(this, span) || this;
          _this.receiver = receiver;
          _this.name = name;
          return _this;
      }
      PropertyRead.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitPropertyRead(this, context);
      };
      return PropertyRead;
  }(AST));
  var PropertyWrite = (function (_super) {
      __extends$2(PropertyWrite, _super);
      function PropertyWrite(span, receiver, name, value) {
          var _this = _super.call(this, span) || this;
          _this.receiver = receiver;
          _this.name = name;
          _this.value = value;
          return _this;
      }
      PropertyWrite.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitPropertyWrite(this, context);
      };
      return PropertyWrite;
  }(AST));
  var SafePropertyRead = (function (_super) {
      __extends$2(SafePropertyRead, _super);
      function SafePropertyRead(span, receiver, name) {
          var _this = _super.call(this, span) || this;
          _this.receiver = receiver;
          _this.name = name;
          return _this;
      }
      SafePropertyRead.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitSafePropertyRead(this, context);
      };
      return SafePropertyRead;
  }(AST));
  var KeyedRead = (function (_super) {
      __extends$2(KeyedRead, _super);
      function KeyedRead(span, obj, key) {
          var _this = _super.call(this, span) || this;
          _this.obj = obj;
          _this.key = key;
          return _this;
      }
      KeyedRead.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitKeyedRead(this, context);
      };
      return KeyedRead;
  }(AST));
  var KeyedWrite = (function (_super) {
      __extends$2(KeyedWrite, _super);
      function KeyedWrite(span, obj, key, value) {
          var _this = _super.call(this, span) || this;
          _this.obj = obj;
          _this.key = key;
          _this.value = value;
          return _this;
      }
      KeyedWrite.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitKeyedWrite(this, context);
      };
      return KeyedWrite;
  }(AST));
  var BindingPipe = (function (_super) {
      __extends$2(BindingPipe, _super);
      function BindingPipe(span, exp, name, args) {
          var _this = _super.call(this, span) || this;
          _this.exp = exp;
          _this.name = name;
          _this.args = args;
          return _this;
      }
      BindingPipe.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitPipe(this, context);
      };
      return BindingPipe;
  }(AST));
  var LiteralPrimitive = (function (_super) {
      __extends$2(LiteralPrimitive, _super);
      function LiteralPrimitive(span, value) {
          var _this = _super.call(this, span) || this;
          _this.value = value;
          return _this;
      }
      LiteralPrimitive.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitLiteralPrimitive(this, context);
      };
      return LiteralPrimitive;
  }(AST));
  var LiteralArray = (function (_super) {
      __extends$2(LiteralArray, _super);
      function LiteralArray(span, expressions) {
          var _this = _super.call(this, span) || this;
          _this.expressions = expressions;
          return _this;
      }
      LiteralArray.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitLiteralArray(this, context);
      };
      return LiteralArray;
  }(AST));
  var LiteralMap = (function (_super) {
      __extends$2(LiteralMap, _super);
      function LiteralMap(span, keys, values) {
          var _this = _super.call(this, span) || this;
          _this.keys = keys;
          _this.values = values;
          return _this;
      }
      LiteralMap.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitLiteralMap(this, context);
      };
      return LiteralMap;
  }(AST));
  var Interpolation = (function (_super) {
      __extends$2(Interpolation, _super);
      function Interpolation(span, strings, expressions) {
          var _this = _super.call(this, span) || this;
          _this.strings = strings;
          _this.expressions = expressions;
          return _this;
      }
      Interpolation.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitInterpolation(this, context);
      };
      return Interpolation;
  }(AST));
  var Binary = (function (_super) {
      __extends$2(Binary, _super);
      function Binary(span, operation, left, right) {
          var _this = _super.call(this, span) || this;
          _this.operation = operation;
          _this.left = left;
          _this.right = right;
          return _this;
      }
      Binary.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitBinary(this, context);
      };
      return Binary;
  }(AST));
  var PrefixNot = (function (_super) {
      __extends$2(PrefixNot, _super);
      function PrefixNot(span, expression) {
          var _this = _super.call(this, span) || this;
          _this.expression = expression;
          return _this;
      }
      PrefixNot.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitPrefixNot(this, context);
      };
      return PrefixNot;
  }(AST));
  var MethodCall = (function (_super) {
      __extends$2(MethodCall, _super);
      function MethodCall(span, receiver, name, args) {
          var _this = _super.call(this, span) || this;
          _this.receiver = receiver;
          _this.name = name;
          _this.args = args;
          return _this;
      }
      MethodCall.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitMethodCall(this, context);
      };
      return MethodCall;
  }(AST));
  var SafeMethodCall = (function (_super) {
      __extends$2(SafeMethodCall, _super);
      function SafeMethodCall(span, receiver, name, args) {
          var _this = _super.call(this, span) || this;
          _this.receiver = receiver;
          _this.name = name;
          _this.args = args;
          return _this;
      }
      SafeMethodCall.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitSafeMethodCall(this, context);
      };
      return SafeMethodCall;
  }(AST));
  var FunctionCall = (function (_super) {
      __extends$2(FunctionCall, _super);
      function FunctionCall(span, target, args) {
          var _this = _super.call(this, span) || this;
          _this.target = target;
          _this.args = args;
          return _this;
      }
      FunctionCall.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return visitor.visitFunctionCall(this, context);
      };
      return FunctionCall;
  }(AST));
  var ASTWithSource = (function (_super) {
      __extends$2(ASTWithSource, _super);
      function ASTWithSource(ast, source, location, errors) {
          var _this = _super.call(this, new ParseSpan(0, source == null ? 0 : source.length)) || this;
          _this.ast = ast;
          _this.source = source;
          _this.location = location;
          _this.errors = errors;
          return _this;
      }
      ASTWithSource.prototype.visit = function (visitor, context) {
          if (context === void 0) { context = null; }
          return this.ast.visit(visitor, context);
      };
      ASTWithSource.prototype.toString = function () { return this.source + " in " + this.location; };
      return ASTWithSource;
  }(AST));
  var TemplateBinding = (function () {
      function TemplateBinding(span, key, keyIsVar, name, expression) {
          this.span = span;
          this.key = key;
          this.keyIsVar = keyIsVar;
          this.name = name;
          this.expression = expression;
      }
      return TemplateBinding;
  }());
  var RecursiveAstVisitor = (function () {
      function RecursiveAstVisitor() {
      }
      RecursiveAstVisitor.prototype.visitBinary = function (ast, context) {
          ast.left.visit(this);
          ast.right.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitChain = function (ast, context) { return this.visitAll(ast.expressions, context); };
      RecursiveAstVisitor.prototype.visitConditional = function (ast, context) {
          ast.condition.visit(this);
          ast.trueExp.visit(this);
          ast.falseExp.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitPipe = function (ast, context) {
          ast.exp.visit(this);
          this.visitAll(ast.args, context);
          return null;
      };
      RecursiveAstVisitor.prototype.visitFunctionCall = function (ast, context) {
          ast.target.visit(this);
          this.visitAll(ast.args, context);
          return null;
      };
      RecursiveAstVisitor.prototype.visitImplicitReceiver = function (ast, context) { return null; };
      RecursiveAstVisitor.prototype.visitInterpolation = function (ast, context) {
          return this.visitAll(ast.expressions, context);
      };
      RecursiveAstVisitor.prototype.visitKeyedRead = function (ast, context) {
          ast.obj.visit(this);
          ast.key.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitKeyedWrite = function (ast, context) {
          ast.obj.visit(this);
          ast.key.visit(this);
          ast.value.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitLiteralArray = function (ast, context) {
          return this.visitAll(ast.expressions, context);
      };
      RecursiveAstVisitor.prototype.visitLiteralMap = function (ast, context) { return this.visitAll(ast.values, context); };
      RecursiveAstVisitor.prototype.visitLiteralPrimitive = function (ast, context) { return null; };
      RecursiveAstVisitor.prototype.visitMethodCall = function (ast, context) {
          ast.receiver.visit(this);
          return this.visitAll(ast.args, context);
      };
      RecursiveAstVisitor.prototype.visitPrefixNot = function (ast, context) {
          ast.expression.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitPropertyRead = function (ast, context) {
          ast.receiver.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitPropertyWrite = function (ast, context) {
          ast.receiver.visit(this);
          ast.value.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitSafePropertyRead = function (ast, context) {
          ast.receiver.visit(this);
          return null;
      };
      RecursiveAstVisitor.prototype.visitSafeMethodCall = function (ast, context) {
          ast.receiver.visit(this);
          return this.visitAll(ast.args, context);
      };
      RecursiveAstVisitor.prototype.visitAll = function (asts, context) {
          var _this = this;
          asts.forEach(function (ast) { return ast.visit(_this, context); });
          return null;
      };
      RecursiveAstVisitor.prototype.visitQuote = function (ast, context) { return null; };
      return RecursiveAstVisitor;
  }());
  var AstTransformer = (function () {
      function AstTransformer() {
      }
      AstTransformer.prototype.visitImplicitReceiver = function (ast, context) { return ast; };
      AstTransformer.prototype.visitInterpolation = function (ast, context) {
          return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitLiteralPrimitive = function (ast, context) {
          return new LiteralPrimitive(ast.span, ast.value);
      };
      AstTransformer.prototype.visitPropertyRead = function (ast, context) {
          return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
      };
      AstTransformer.prototype.visitPropertyWrite = function (ast, context) {
          return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value.visit(this));
      };
      AstTransformer.prototype.visitSafePropertyRead = function (ast, context) {
          return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
      };
      AstTransformer.prototype.visitMethodCall = function (ast, context) {
          return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitSafeMethodCall = function (ast, context) {
          return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitFunctionCall = function (ast, context) {
          return new FunctionCall(ast.span, ast.target.visit(this), this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitLiteralArray = function (ast, context) {
          return new LiteralArray(ast.span, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitLiteralMap = function (ast, context) {
          return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
      };
      AstTransformer.prototype.visitBinary = function (ast, context) {
          return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
      };
      AstTransformer.prototype.visitPrefixNot = function (ast, context) {
          return new PrefixNot(ast.span, ast.expression.visit(this));
      };
      AstTransformer.prototype.visitConditional = function (ast, context) {
          return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
      };
      AstTransformer.prototype.visitPipe = function (ast, context) {
          return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
      };
      AstTransformer.prototype.visitKeyedRead = function (ast, context) {
          return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
      };
      AstTransformer.prototype.visitKeyedWrite = function (ast, context) {
          return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
      };
      AstTransformer.prototype.visitAll = function (asts) {
          var res = new Array(asts.length);
          for (var i = 0; i < asts.length; ++i) {
              res[i] = asts[i].visit(this);
          }
          return res;
      };
      AstTransformer.prototype.visitChain = function (ast, context) {
          return new Chain(ast.span, this.visitAll(ast.expressions));
      };
      AstTransformer.prototype.visitQuote = function (ast, context) {
          return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
      };
      return AstTransformer;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */ var $EOF = 0;
  var $TAB = 9;
  var $LF = 10;
  var $VTAB = 11;
  var $FF = 12;
  var $CR = 13;
  var $SPACE = 32;
  var $BANG = 33;
  var $DQ = 34;
  var $HASH = 35;
  var $$ = 36;
  var $PERCENT = 37;
  var $AMPERSAND = 38;
  var $SQ = 39;
  var $LPAREN = 40;
  var $RPAREN = 41;
  var $STAR = 42;
  var $PLUS = 43;
  var $COMMA = 44;
  var $MINUS = 45;
  var $PERIOD = 46;
  var $SLASH = 47;
  var $COLON = 58;
  var $SEMICOLON = 59;
  var $LT = 60;
  var $EQ = 61;
  var $GT = 62;
  var $QUESTION = 63;
  var $0 = 48;
  var $9 = 57;
  var $A = 65;
  var $E = 69;
  var $F = 70;
  var $X = 88;
  var $Z = 90;
  var $LBRACKET = 91;
  var $BACKSLASH = 92;
  var $RBRACKET = 93;
  var $CARET = 94;
  var $_ = 95;
  var $a = 97;
  var $e = 101;
  var $f = 102;
  var $n = 110;
  var $r = 114;
  var $t = 116;
  var $u = 117;
  var $v = 118;
  var $x = 120;
  var $z = 122;
  var $LBRACE = 123;
  var $BAR = 124;
  var $RBRACE = 125;
  var $NBSP = 160;
  var $BT = 96;
  function isWhitespace(code) {
      return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
  }
  function isDigit(code) {
      return $0 <= code && code <= $9;
  }
  function isAsciiLetter(code) {
      return code >= $a && code <= $z || code >= $A && code <= $Z;
  }
  function isAsciiHexDigit(code) {
      return code >= $a && code <= $f || code >= $A && code <= $F || isDigit(code);
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * A replacement for @Injectable to be used in the compiler, so that
   * we don't try to evaluate the metadata in the compiler during AoT.
   * This decorator is enough to make the compiler work with the ReflectiveInjector though.
   * @Annotation
   */
  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */ function CompilerInjectable() {
      return function (x) { return x; };
  }

  function assertArrayOfStrings(identifier, value) {
      if (!_angular_core.isDevMode() || value == null) {
          return;
      }
      if (!Array.isArray(value)) {
          throw new Error("Expected '" + identifier + "' to be an array of strings.");
      }
      for (var i = 0; i < value.length; i += 1) {
          if (typeof value[i] !== 'string') {
              throw new Error("Expected '" + identifier + "' to be an array of strings.");
          }
      }
  }
  var INTERPOLATION_BLACKLIST_REGEXPS = [
      /^\s*$/,
      /[<>]/,
      /^[{}]$/,
      /&(#|[a-z])/i,
      /^\/\//,
  ];
  function assertInterpolationSymbols(identifier, value) {
      if (value != null && !(Array.isArray(value) && value.length == 2)) {
          throw new Error("Expected '" + identifier + "' to be an array, [start, end].");
      }
      else if (_angular_core.isDevMode() && value != null) {
          var start_1 = value[0];
          var end_1 = value[1];
          // black list checking
          INTERPOLATION_BLACKLIST_REGEXPS.forEach(function (regexp) {
              if (regexp.test(start_1) || regexp.test(end_1)) {
                  throw new Error("['" + start_1 + "', '" + end_1 + "'] contains unusable interpolation symbol.");
              }
          });
      }
  }

  var InterpolationConfig = (function () {
      function InterpolationConfig(start, end) {
          this.start = start;
          this.end = end;
      }
      InterpolationConfig.fromArray = function (markers) {
          if (!markers) {
              return DEFAULT_INTERPOLATION_CONFIG;
          }
          assertInterpolationSymbols('interpolation', markers);
          return new InterpolationConfig(markers[0], markers[1]);
      };
      ;
      return InterpolationConfig;
  }());
  var DEFAULT_INTERPOLATION_CONFIG = new InterpolationConfig('{{', '}}');

  exports.TokenType;
  (function (TokenType) {
      TokenType[TokenType["Character"] = 0] = "Character";
      TokenType[TokenType["Identifier"] = 1] = "Identifier";
      TokenType[TokenType["Keyword"] = 2] = "Keyword";
      TokenType[TokenType["String"] = 3] = "String";
      TokenType[TokenType["Operator"] = 4] = "Operator";
      TokenType[TokenType["Number"] = 5] = "Number";
      TokenType[TokenType["Error"] = 6] = "Error";
  })(exports.TokenType || (exports.TokenType = {}));
  var KEYWORDS = ['var', 'let', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
  var Lexer = (function () {
      function Lexer() {
      }
      Lexer.prototype.tokenize = function (text) {
          var scanner = new _Scanner(text);
          var tokens = [];
          var token = scanner.scanToken();
          while (token != null) {
              tokens.push(token);
              token = scanner.scanToken();
          }
          return tokens;
      };
      return Lexer;
  }());
  Lexer.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  Lexer.ctorParameters = function () { return []; };
  var Token = (function () {
      function Token(index, type, numValue, strValue) {
          this.index = index;
          this.type = type;
          this.numValue = numValue;
          this.strValue = strValue;
      }
      Token.prototype.isCharacter = function (code) {
          return this.type == exports.TokenType.Character && this.numValue == code;
      };
      Token.prototype.isNumber = function () { return this.type == exports.TokenType.Number; };
      Token.prototype.isString = function () { return this.type == exports.TokenType.String; };
      Token.prototype.isOperator = function (operater) {
          return this.type == exports.TokenType.Operator && this.strValue == operater;
      };
      Token.prototype.isIdentifier = function () { return this.type == exports.TokenType.Identifier; };
      Token.prototype.isKeyword = function () { return this.type == exports.TokenType.Keyword; };
      Token.prototype.isKeywordLet = function () { return this.type == exports.TokenType.Keyword && this.strValue == 'let'; };
      Token.prototype.isKeywordNull = function () { return this.type == exports.TokenType.Keyword && this.strValue == 'null'; };
      Token.prototype.isKeywordUndefined = function () {
          return this.type == exports.TokenType.Keyword && this.strValue == 'undefined';
      };
      Token.prototype.isKeywordTrue = function () { return this.type == exports.TokenType.Keyword && this.strValue == 'true'; };
      Token.prototype.isKeywordFalse = function () { return this.type == exports.TokenType.Keyword && this.strValue == 'false'; };
      Token.prototype.isKeywordThis = function () { return this.type == exports.TokenType.Keyword && this.strValue == 'this'; };
      Token.prototype.isError = function () { return this.type == exports.TokenType.Error; };
      Token.prototype.toNumber = function () { return this.type == exports.TokenType.Number ? this.numValue : -1; };
      Token.prototype.toString = function () {
          switch (this.type) {
              case exports.TokenType.Character:
              case exports.TokenType.Identifier:
              case exports.TokenType.Keyword:
              case exports.TokenType.Operator:
              case exports.TokenType.String:
              case exports.TokenType.Error:
                  return this.strValue;
              case exports.TokenType.Number:
                  return this.numValue.toString();
              default:
                  return null;
          }
      };
      return Token;
  }());
  function newCharacterToken(index, code) {
      return new Token(index, exports.TokenType.Character, code, String.fromCharCode(code));
  }
  function newIdentifierToken(index, text) {
      return new Token(index, exports.TokenType.Identifier, 0, text);
  }
  function newKeywordToken(index, text) {
      return new Token(index, exports.TokenType.Keyword, 0, text);
  }
  function newOperatorToken(index, text) {
      return new Token(index, exports.TokenType.Operator, 0, text);
  }
  function newStringToken(index, text) {
      return new Token(index, exports.TokenType.String, 0, text);
  }
  function newNumberToken(index, n) {
      return new Token(index, exports.TokenType.Number, n, '');
  }
  function newErrorToken(index, message) {
      return new Token(index, exports.TokenType.Error, 0, message);
  }
  var EOF = new Token(-1, exports.TokenType.Character, 0, '');
  var _Scanner = (function () {
      function _Scanner(input) {
          this.input = input;
          this.peek = 0;
          this.index = -1;
          this.length = input.length;
          this.advance();
      }
      _Scanner.prototype.advance = function () {
          this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
      };
      _Scanner.prototype.scanToken = function () {
          var input = this.input, length = this.length;
          var peek = this.peek, index = this.index;
          // Skip whitespace.
          while (peek <= $SPACE) {
              if (++index >= length) {
                  peek = $EOF;
                  break;
              }
              else {
                  peek = input.charCodeAt(index);
              }
          }
          this.peek = peek;
          this.index = index;
          if (index >= length) {
              return null;
          }
          // Handle identifiers and numbers.
          if (isIdentifierStart(peek))
              return this.scanIdentifier();
          if (isDigit(peek))
              return this.scanNumber(index);
          var start = index;
          switch (peek) {
              case $PERIOD:
                  this.advance();
                  return isDigit(this.peek) ? this.scanNumber(start) :
                      newCharacterToken(start, $PERIOD);
              case $LPAREN:
              case $RPAREN:
              case $LBRACE:
              case $RBRACE:
              case $LBRACKET:
              case $RBRACKET:
              case $COMMA:
              case $COLON:
              case $SEMICOLON:
                  return this.scanCharacter(start, peek);
              case $SQ:
              case $DQ:
                  return this.scanString();
              case $HASH:
              case $PLUS:
              case $MINUS:
              case $STAR:
              case $SLASH:
              case $PERCENT:
              case $CARET:
                  return this.scanOperator(start, String.fromCharCode(peek));
              case $QUESTION:
                  return this.scanComplexOperator(start, '?', $PERIOD, '.');
              case $LT:
              case $GT:
                  return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=');
              case $BANG:
              case $EQ:
                  return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=', $EQ, '=');
              case $AMPERSAND:
                  return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
              case $BAR:
                  return this.scanComplexOperator(start, '|', $BAR, '|');
              case $NBSP:
                  while (isWhitespace(this.peek))
                      this.advance();
                  return this.scanToken();
          }
          this.advance();
          return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
      };
      _Scanner.prototype.scanCharacter = function (start, code) {
          this.advance();
          return newCharacterToken(start, code);
      };
      _Scanner.prototype.scanOperator = function (start, str) {
          this.advance();
          return newOperatorToken(start, str);
      };
      /**
       * Tokenize a 2/3 char long operator
       *
       * @param start start index in the expression
       * @param one first symbol (always part of the operator)
       * @param twoCode code point for the second symbol
       * @param two second symbol (part of the operator when the second code point matches)
       * @param threeCode code point for the third symbol
       * @param three third symbol (part of the operator when provided and matches source expression)
       * @returns {Token}
       */
      _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
          this.advance();
          var str = one;
          if (this.peek == twoCode) {
              this.advance();
              str += two;
          }
          if (threeCode != null && this.peek == threeCode) {
              this.advance();
              str += three;
          }
          return newOperatorToken(start, str);
      };
      _Scanner.prototype.scanIdentifier = function () {
          var start = this.index;
          this.advance();
          while (isIdentifierPart(this.peek))
              this.advance();
          var str = this.input.substring(start, this.index);
          return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
              newIdentifierToken(start, str);
      };
      _Scanner.prototype.scanNumber = function (start) {
          var simple = (this.index === start);
          this.advance(); // Skip initial digit.
          while (true) {
              if (isDigit(this.peek)) {
              }
              else if (this.peek == $PERIOD) {
                  simple = false;
              }
              else if (isExponentStart(this.peek)) {
                  this.advance();
                  if (isExponentSign(this.peek))
                      this.advance();
                  if (!isDigit(this.peek))
                      return this.error('Invalid exponent', -1);
                  simple = false;
              }
              else {
                  break;
              }
              this.advance();
          }
          var str = this.input.substring(start, this.index);
          var value = simple ? parseIntAutoRadix(str) : parseFloat(str);
          return newNumberToken(start, value);
      };
      _Scanner.prototype.scanString = function () {
          var start = this.index;
          var quote = this.peek;
          this.advance(); // Skip initial quote.
          var buffer = '';
          var marker = this.index;
          var input = this.input;
          while (this.peek != quote) {
              if (this.peek == $BACKSLASH) {
                  buffer += input.substring(marker, this.index);
                  this.advance();
                  var unescapedCode = void 0;
                  // Workaround for TS2.1-introduced type strictness
                  this.peek = this.peek;
                  if (this.peek == $u) {
                      // 4 character hex code for unicode character.
                      var hex = input.substring(this.index + 1, this.index + 5);
                      if (/^[0-9a-f]+$/i.test(hex)) {
                          unescapedCode = parseInt(hex, 16);
                      }
                      else {
                          return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                      }
                      for (var i = 0; i < 5; i++) {
                          this.advance();
                      }
                  }
                  else {
                      unescapedCode = unescape(this.peek);
                      this.advance();
                  }
                  buffer += String.fromCharCode(unescapedCode);
                  marker = this.index;
              }
              else if (this.peek == $EOF) {
                  return this.error('Unterminated quote', 0);
              }
              else {
                  this.advance();
              }
          }
          var last = input.substring(marker, this.index);
          this.advance(); // Skip terminating quote.
          return newStringToken(start, buffer + last);
      };
      _Scanner.prototype.error = function (message, offset) {
          var position = this.index + offset;
          return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
      };
      return _Scanner;
  }());
  function isIdentifierStart(code) {
      return ($a <= code && code <= $z) || ($A <= code && code <= $Z) ||
          (code == $_) || (code == $$);
  }
  function isIdentifier(input) {
      if (input.length == 0)
          return false;
      var scanner = new _Scanner(input);
      if (!isIdentifierStart(scanner.peek))
          return false;
      scanner.advance();
      while (scanner.peek !== $EOF) {
          if (!isIdentifierPart(scanner.peek))
              return false;
          scanner.advance();
      }
      return true;
  }
  function isIdentifierPart(code) {
      return isAsciiLetter(code) || isDigit(code) || (code == $_) ||
          (code == $$);
  }
  function isExponentStart(code) {
      return code == $e || code == $E;
  }
  function isExponentSign(code) {
      return code == $MINUS || code == $PLUS;
  }
  function isQuote(code) {
      return code === $SQ || code === $DQ || code === $BT;
  }
  function unescape(code) {
      switch (code) {
          case $n:
              return $LF;
          case $f:
              return $FF;
          case $r:
              return $CR;
          case $t:
              return $TAB;
          case $v:
              return $VTAB;
          default:
              return code;
      }
  }
  function parseIntAutoRadix(text) {
      var result = parseInt(text);
      if (isNaN(result)) {
          throw new Error('Invalid integer literal when parsing ' + text);
      }
      return result;
  }

  var SplitInterpolation = (function () {
      function SplitInterpolation(strings, expressions, offsets) {
          this.strings = strings;
          this.expressions = expressions;
          this.offsets = offsets;
      }
      return SplitInterpolation;
  }());
  var TemplateBindingParseResult = (function () {
      function TemplateBindingParseResult(templateBindings, warnings, errors) {
          this.templateBindings = templateBindings;
          this.warnings = warnings;
          this.errors = errors;
      }
      return TemplateBindingParseResult;
  }());
  function _createInterpolateRegExp(config) {
      var pattern = escapeRegExp(config.start) + '([\\s\\S]*?)' + escapeRegExp(config.end);
      return new RegExp(pattern, 'g');
  }
  var Parser = (function () {
      function Parser(_lexer) {
          this._lexer = _lexer;
          this.errors = [];
      }
      Parser.prototype.parseAction = function (input, location, interpolationConfig) {
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          this._checkNoInterpolation(input, location, interpolationConfig);
          var sourceToLex = this._stripComments(input);
          var tokens = this._lexer.tokenize(this._stripComments(input));
          var ast = new _ParseAST(input, location, tokens, sourceToLex.length, true, this.errors, input.length - sourceToLex.length)
              .parseChain();
          return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype.parseBinding = function (input, location, interpolationConfig) {
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var ast = this._parseBindingAst(input, location, interpolationConfig);
          return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype.parseSimpleBinding = function (input, location, interpolationConfig) {
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var ast = this._parseBindingAst(input, location, interpolationConfig);
          var errors = SimpleExpressionChecker.check(ast);
          if (errors.length > 0) {
              this._reportError("Host binding expression cannot contain " + errors.join(' '), input, location);
          }
          return new ASTWithSource(ast, input, location, this.errors);
      };
      Parser.prototype._reportError = function (message, input, errLocation, ctxLocation) {
          this.errors.push(new ParserError(message, input, errLocation, ctxLocation));
      };
      Parser.prototype._parseBindingAst = function (input, location, interpolationConfig) {
          // Quotes expressions use 3rd-party expression language. We don't want to use
          // our lexer or parser for that, so we check for that ahead of time.
          var quote = this._parseQuote(input, location);
          if (quote != null) {
              return quote;
          }
          this._checkNoInterpolation(input, location, interpolationConfig);
          var sourceToLex = this._stripComments(input);
          var tokens = this._lexer.tokenize(sourceToLex);
          return new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, input.length - sourceToLex.length)
              .parseChain();
      };
      Parser.prototype._parseQuote = function (input, location) {
          if (input == null)
              return null;
          var prefixSeparatorIndex = input.indexOf(':');
          if (prefixSeparatorIndex == -1)
              return null;
          var prefix = input.substring(0, prefixSeparatorIndex).trim();
          if (!isIdentifier(prefix))
              return null;
          var uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
          return new Quote(new ParseSpan(0, input.length), prefix, uninterpretedExpression, location);
      };
      Parser.prototype.parseTemplateBindings = function (prefixToken, input, location) {
          var tokens = this._lexer.tokenize(input);
          if (prefixToken) {
              // Prefix the tokens with the tokens from prefixToken but have them take no space (0 index).
              var prefixTokens = this._lexer.tokenize(prefixToken).map(function (t) {
                  t.index = 0;
                  return t;
              });
              tokens.unshift.apply(tokens, prefixTokens);
          }
          return new _ParseAST(input, location, tokens, input.length, false, this.errors, 0)
              .parseTemplateBindings();
      };
      Parser.prototype.parseInterpolation = function (input, location, interpolationConfig) {
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var split = this.splitInterpolation(input, location, interpolationConfig);
          if (split == null)
              return null;
          var expressions = [];
          for (var i = 0; i < split.expressions.length; ++i) {
              var expressionText = split.expressions[i];
              var sourceToLex = this._stripComments(expressionText);
              var tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
              var ast = new _ParseAST(input, location, tokens, sourceToLex.length, false, this.errors, split.offsets[i] + (expressionText.length - sourceToLex.length))
                  .parseChain();
              expressions.push(ast);
          }
          return new ASTWithSource(new Interpolation(new ParseSpan(0, input == null ? 0 : input.length), split.strings, expressions), input, location, this.errors);
      };
      Parser.prototype.splitInterpolation = function (input, location, interpolationConfig) {
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var regexp = _createInterpolateRegExp(interpolationConfig);
          var parts = input.split(regexp);
          if (parts.length <= 1) {
              return null;
          }
          var strings = [];
          var expressions = [];
          var offsets = [];
          var offset = 0;
          for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              if (i % 2 === 0) {
                  // fixed string
                  strings.push(part);
                  offset += part.length;
              }
              else if (part.trim().length > 0) {
                  offset += interpolationConfig.start.length;
                  expressions.push(part);
                  offsets.push(offset);
                  offset += part.length + interpolationConfig.end.length;
              }
              else {
                  this._reportError('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i, interpolationConfig) + " in", location);
                  expressions.push('$implict');
                  offsets.push(offset);
              }
          }
          return new SplitInterpolation(strings, expressions, offsets);
      };
      Parser.prototype.wrapLiteralPrimitive = function (input, location) {
          return new ASTWithSource(new LiteralPrimitive(new ParseSpan(0, input == null ? 0 : input.length), input), input, location, this.errors);
      };
      Parser.prototype._stripComments = function (input) {
          var i = this._commentStart(input);
          return i != null ? input.substring(0, i).trim() : input;
      };
      Parser.prototype._commentStart = function (input) {
          var outerQuote = null;
          for (var i = 0; i < input.length - 1; i++) {
              var char = input.charCodeAt(i);
              var nextChar = input.charCodeAt(i + 1);
              if (char === $SLASH && nextChar == $SLASH && outerQuote == null)
                  return i;
              if (outerQuote === char) {
                  outerQuote = null;
              }
              else if (outerQuote == null && isQuote(char)) {
                  outerQuote = char;
              }
          }
          return null;
      };
      Parser.prototype._checkNoInterpolation = function (input, location, interpolationConfig) {
          var regexp = _createInterpolateRegExp(interpolationConfig);
          var parts = input.split(regexp);
          if (parts.length > 1) {
              this._reportError("Got interpolation (" + interpolationConfig.start + interpolationConfig.end + ") where expression was expected", input, "at column " + this._findInterpolationErrorColumn(parts, 1, interpolationConfig) + " in", location);
          }
      };
      Parser.prototype._findInterpolationErrorColumn = function (parts, partInErrIdx, interpolationConfig) {
          var errLocation = '';
          for (var j = 0; j < partInErrIdx; j++) {
              errLocation += j % 2 === 0 ?
                  parts[j] :
                  "" + interpolationConfig.start + parts[j] + interpolationConfig.end;
          }
          return errLocation.length;
      };
      return Parser;
  }());
  Parser.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  Parser.ctorParameters = function () { return [
      { type: Lexer, },
  ]; };
  var _ParseAST = (function () {
      function _ParseAST(input, location, tokens, inputLength, parseAction, errors, offset) {
          this.input = input;
          this.location = location;
          this.tokens = tokens;
          this.inputLength = inputLength;
          this.parseAction = parseAction;
          this.errors = errors;
          this.offset = offset;
          this.rparensExpected = 0;
          this.rbracketsExpected = 0;
          this.rbracesExpected = 0;
          this.index = 0;
      }
      _ParseAST.prototype.peek = function (offset) {
          var i = this.index + offset;
          return i < this.tokens.length ? this.tokens[i] : EOF;
      };
      Object.defineProperty(_ParseAST.prototype, "next", {
          get: function () { return this.peek(0); },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(_ParseAST.prototype, "inputIndex", {
          get: function () {
              return (this.index < this.tokens.length) ? this.next.index + this.offset :
                  this.inputLength + this.offset;
          },
          enumerable: true,
          configurable: true
      });
      _ParseAST.prototype.span = function (start) { return new ParseSpan(start, this.inputIndex); };
      _ParseAST.prototype.advance = function () { this.index++; };
      _ParseAST.prototype.optionalCharacter = function (code) {
          if (this.next.isCharacter(code)) {
              this.advance();
              return true;
          }
          else {
              return false;
          }
      };
      _ParseAST.prototype.peekKeywordLet = function () { return this.next.isKeywordLet(); };
      _ParseAST.prototype.expectCharacter = function (code) {
          if (this.optionalCharacter(code))
              return;
          this.error("Missing expected " + String.fromCharCode(code));
      };
      _ParseAST.prototype.optionalOperator = function (op) {
          if (this.next.isOperator(op)) {
              this.advance();
              return true;
          }
          else {
              return false;
          }
      };
      _ParseAST.prototype.expectOperator = function (operator) {
          if (this.optionalOperator(operator))
              return;
          this.error("Missing expected operator " + operator);
      };
      _ParseAST.prototype.expectIdentifierOrKeyword = function () {
          var n = this.next;
          if (!n.isIdentifier() && !n.isKeyword()) {
              this.error("Unexpected token " + n + ", expected identifier or keyword");
              return '';
          }
          this.advance();
          return n.toString();
      };
      _ParseAST.prototype.expectIdentifierOrKeywordOrString = function () {
          var n = this.next;
          if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
              this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
              return '';
          }
          this.advance();
          return n.toString();
      };
      _ParseAST.prototype.parseChain = function () {
          var exprs = [];
          var start = this.inputIndex;
          while (this.index < this.tokens.length) {
              var expr = this.parsePipe();
              exprs.push(expr);
              if (this.optionalCharacter($SEMICOLON)) {
                  if (!this.parseAction) {
                      this.error('Binding expression cannot contain chained expression');
                  }
                  while (this.optionalCharacter($SEMICOLON)) {
                  } // read all semicolons
              }
              else if (this.index < this.tokens.length) {
                  this.error("Unexpected token '" + this.next + "'");
              }
          }
          if (exprs.length == 0)
              return new EmptyExpr(this.span(start));
          if (exprs.length == 1)
              return exprs[0];
          return new Chain(this.span(start), exprs);
      };
      _ParseAST.prototype.parsePipe = function () {
          var result = this.parseExpression();
          if (this.optionalOperator('|')) {
              if (this.parseAction) {
                  this.error('Cannot have a pipe in an action expression');
              }
              do {
                  var name_1 = this.expectIdentifierOrKeyword();
                  var args = [];
                  while (this.optionalCharacter($COLON)) {
                      args.push(this.parseExpression());
                  }
                  result = new BindingPipe(this.span(result.span.start), result, name_1, args);
              } while (this.optionalOperator('|'));
          }
          return result;
      };
      _ParseAST.prototype.parseExpression = function () { return this.parseConditional(); };
      _ParseAST.prototype.parseConditional = function () {
          var start = this.inputIndex;
          var result = this.parseLogicalOr();
          if (this.optionalOperator('?')) {
              var yes = this.parsePipe();
              var no = void 0;
              if (!this.optionalCharacter($COLON)) {
                  var end = this.inputIndex;
                  var expression = this.input.substring(start, end);
                  this.error("Conditional expression " + expression + " requires all 3 expressions");
                  no = new EmptyExpr(this.span(start));
              }
              else {
                  no = this.parsePipe();
              }
              return new Conditional(this.span(start), result, yes, no);
          }
          else {
              return result;
          }
      };
      _ParseAST.prototype.parseLogicalOr = function () {
          // '||'
          var result = this.parseLogicalAnd();
          while (this.optionalOperator('||')) {
              var right = this.parseLogicalAnd();
              result = new Binary(this.span(result.span.start), '||', result, right);
          }
          return result;
      };
      _ParseAST.prototype.parseLogicalAnd = function () {
          // '&&'
          var result = this.parseEquality();
          while (this.optionalOperator('&&')) {
              var right = this.parseEquality();
              result = new Binary(this.span(result.span.start), '&&', result, right);
          }
          return result;
      };
      _ParseAST.prototype.parseEquality = function () {
          // '==','!=','===','!=='
          var result = this.parseRelational();
          while (this.next.type == exports.TokenType.Operator) {
              var operator = this.next.strValue;
              switch (operator) {
                  case '==':
                  case '===':
                  case '!=':
                  case '!==':
                      this.advance();
                      var right = this.parseRelational();
                      result = new Binary(this.span(result.span.start), operator, result, right);
                      continue;
              }
              break;
          }
          return result;
      };
      _ParseAST.prototype.parseRelational = function () {
          // '<', '>', '<=', '>='
          var result = this.parseAdditive();
          while (this.next.type == exports.TokenType.Operator) {
              var operator = this.next.strValue;
              switch (operator) {
                  case '<':
                  case '>':
                  case '<=':
                  case '>=':
                      this.advance();
                      var right = this.parseAdditive();
                      result = new Binary(this.span(result.span.start), operator, result, right);
                      continue;
              }
              break;
          }
          return result;
      };
      _ParseAST.prototype.parseAdditive = function () {
          // '+', '-'
          var result = this.parseMultiplicative();
          while (this.next.type == exports.TokenType.Operator) {
              var operator = this.next.strValue;
              switch (operator) {
                  case '+':
                  case '-':
                      this.advance();
                      var right = this.parseMultiplicative();
                      result = new Binary(this.span(result.span.start), operator, result, right);
                      continue;
              }
              break;
          }
          return result;
      };
      _ParseAST.prototype.parseMultiplicative = function () {
          // '*', '%', '/'
          var result = this.parsePrefix();
          while (this.next.type == exports.TokenType.Operator) {
              var operator = this.next.strValue;
              switch (operator) {
                  case '*':
                  case '%':
                  case '/':
                      this.advance();
                      var right = this.parsePrefix();
                      result = new Binary(this.span(result.span.start), operator, result, right);
                      continue;
              }
              break;
          }
          return result;
      };
      _ParseAST.prototype.parsePrefix = function () {
          if (this.next.type == exports.TokenType.Operator) {
              var start = this.inputIndex;
              var operator = this.next.strValue;
              var result = void 0;
              switch (operator) {
                  case '+':
                      this.advance();
                      return this.parsePrefix();
                  case '-':
                      this.advance();
                      result = this.parsePrefix();
                      return new Binary(this.span(start), operator, new LiteralPrimitive(new ParseSpan(start, start), 0), result);
                  case '!':
                      this.advance();
                      result = this.parsePrefix();
                      return new PrefixNot(this.span(start), result);
              }
          }
          return this.parseCallChain();
      };
      _ParseAST.prototype.parseCallChain = function () {
          var result = this.parsePrimary();
          while (true) {
              if (this.optionalCharacter($PERIOD)) {
                  result = this.parseAccessMemberOrMethodCall(result, false);
              }
              else if (this.optionalOperator('?.')) {
                  result = this.parseAccessMemberOrMethodCall(result, true);
              }
              else if (this.optionalCharacter($LBRACKET)) {
                  this.rbracketsExpected++;
                  var key = this.parsePipe();
                  this.rbracketsExpected--;
                  this.expectCharacter($RBRACKET);
                  if (this.optionalOperator('=')) {
                      var value = this.parseConditional();
                      result = new KeyedWrite(this.span(result.span.start), result, key, value);
                  }
                  else {
                      result = new KeyedRead(this.span(result.span.start), result, key);
                  }
              }
              else if (this.optionalCharacter($LPAREN)) {
                  this.rparensExpected++;
                  var args = this.parseCallArguments();
                  this.rparensExpected--;
                  this.expectCharacter($RPAREN);
                  result = new FunctionCall(this.span(result.span.start), result, args);
              }
              else {
                  return result;
              }
          }
      };
      _ParseAST.prototype.parsePrimary = function () {
          var start = this.inputIndex;
          if (this.optionalCharacter($LPAREN)) {
              this.rparensExpected++;
              var result = this.parsePipe();
              this.rparensExpected--;
              this.expectCharacter($RPAREN);
              return result;
          }
          else if (this.next.isKeywordNull()) {
              this.advance();
              return new LiteralPrimitive(this.span(start), null);
          }
          else if (this.next.isKeywordUndefined()) {
              this.advance();
              return new LiteralPrimitive(this.span(start), void 0);
          }
          else if (this.next.isKeywordTrue()) {
              this.advance();
              return new LiteralPrimitive(this.span(start), true);
          }
          else if (this.next.isKeywordFalse()) {
              this.advance();
              return new LiteralPrimitive(this.span(start), false);
          }
          else if (this.next.isKeywordThis()) {
              this.advance();
              return new ImplicitReceiver(this.span(start));
          }
          else if (this.optionalCharacter($LBRACKET)) {
              this.rbracketsExpected++;
              var elements = this.parseExpressionList($RBRACKET);
              this.rbracketsExpected--;
              this.expectCharacter($RBRACKET);
              return new LiteralArray(this.span(start), elements);
          }
          else if (this.next.isCharacter($LBRACE)) {
              return this.parseLiteralMap();
          }
          else if (this.next.isIdentifier()) {
              return this.parseAccessMemberOrMethodCall(new ImplicitReceiver(this.span(start)), false);
          }
          else if (this.next.isNumber()) {
              var value = this.next.toNumber();
              this.advance();
              return new LiteralPrimitive(this.span(start), value);
          }
          else if (this.next.isString()) {
              var literalValue = this.next.toString();
              this.advance();
              return new LiteralPrimitive(this.span(start), literalValue);
          }
          else if (this.index >= this.tokens.length) {
              this.error("Unexpected end of expression: " + this.input);
              return new EmptyExpr(this.span(start));
          }
          else {
              this.error("Unexpected token " + this.next);
              return new EmptyExpr(this.span(start));
          }
      };
      _ParseAST.prototype.parseExpressionList = function (terminator) {
          var result = [];
          if (!this.next.isCharacter(terminator)) {
              do {
                  result.push(this.parsePipe());
              } while (this.optionalCharacter($COMMA));
          }
          return result;
      };
      _ParseAST.prototype.parseLiteralMap = function () {
          var keys = [];
          var values = [];
          var start = this.inputIndex;
          this.expectCharacter($LBRACE);
          if (!this.optionalCharacter($RBRACE)) {
              this.rbracesExpected++;
              do {
                  var key = this.expectIdentifierOrKeywordOrString();
                  keys.push(key);
                  this.expectCharacter($COLON);
                  values.push(this.parsePipe());
              } while (this.optionalCharacter($COMMA));
              this.rbracesExpected--;
              this.expectCharacter($RBRACE);
          }
          return new LiteralMap(this.span(start), keys, values);
      };
      _ParseAST.prototype.parseAccessMemberOrMethodCall = function (receiver, isSafe) {
          if (isSafe === void 0) { isSafe = false; }
          var start = receiver.span.start;
          var id = this.expectIdentifierOrKeyword();
          if (this.optionalCharacter($LPAREN)) {
              this.rparensExpected++;
              var args = this.parseCallArguments();
              this.expectCharacter($RPAREN);
              this.rparensExpected--;
              var span = this.span(start);
              return isSafe ? new SafeMethodCall(span, receiver, id, args) :
                  new MethodCall(span, receiver, id, args);
          }
          else {
              if (isSafe) {
                  if (this.optionalOperator('=')) {
                      this.error('The \'?.\' operator cannot be used in the assignment');
                      return new EmptyExpr(this.span(start));
                  }
                  else {
                      return new SafePropertyRead(this.span(start), receiver, id);
                  }
              }
              else {
                  if (this.optionalOperator('=')) {
                      if (!this.parseAction) {
                          this.error('Bindings cannot contain assignments');
                          return new EmptyExpr(this.span(start));
                      }
                      var value = this.parseConditional();
                      return new PropertyWrite(this.span(start), receiver, id, value);
                  }
                  else {
                      return new PropertyRead(this.span(start), receiver, id);
                  }
              }
          }
      };
      _ParseAST.prototype.parseCallArguments = function () {
          if (this.next.isCharacter($RPAREN))
              return [];
          var positionals = [];
          do {
              positionals.push(this.parsePipe());
          } while (this.optionalCharacter($COMMA));
          return positionals;
      };
      /**
       * An identifier, a keyword, a string with an optional `-` inbetween.
       */
      _ParseAST.prototype.expectTemplateBindingKey = function () {
          var result = '';
          var operatorFound = false;
          do {
              result += this.expectIdentifierOrKeywordOrString();
              operatorFound = this.optionalOperator('-');
              if (operatorFound) {
                  result += '-';
              }
          } while (operatorFound);
          return result.toString();
      };
      _ParseAST.prototype.parseTemplateBindings = function () {
          var bindings = [];
          var prefix = null;
          var warnings = [];
          while (this.index < this.tokens.length) {
              var start = this.inputIndex;
              var keyIsVar = this.peekKeywordLet();
              if (keyIsVar) {
                  this.advance();
              }
              var key = this.expectTemplateBindingKey();
              if (!keyIsVar) {
                  if (prefix == null) {
                      prefix = key;
                  }
                  else {
                      key = prefix + key[0].toUpperCase() + key.substring(1);
                  }
              }
              this.optionalCharacter($COLON);
              var name_2 = null;
              var expression = null;
              if (keyIsVar) {
                  if (this.optionalOperator('=')) {
                      name_2 = this.expectTemplateBindingKey();
                  }
                  else {
                      name_2 = '\$implicit';
                  }
              }
              else if (this.next !== EOF && !this.peekKeywordLet()) {
                  var start_1 = this.inputIndex;
                  var ast = this.parsePipe();
                  var source = this.input.substring(start_1 - this.offset, this.inputIndex - this.offset);
                  expression = new ASTWithSource(ast, source, this.location, this.errors);
              }
              bindings.push(new TemplateBinding(this.span(start), key, keyIsVar, name_2, expression));
              if (!this.optionalCharacter($SEMICOLON)) {
                  this.optionalCharacter($COMMA);
              }
          }
          return new TemplateBindingParseResult(bindings, warnings, this.errors);
      };
      _ParseAST.prototype.error = function (message, index) {
          if (index === void 0) { index = null; }
          this.errors.push(new ParserError(message, this.input, this.locationText(index), this.location));
          this.skip();
      };
      _ParseAST.prototype.locationText = function (index) {
          if (index === void 0) { index = null; }
          if (index == null)
              index = this.index;
          return (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
              "at the end of the expression";
      };
      // Error recovery should skip tokens until it encounters a recovery point. skip() treats
      // the end of input and a ';' as unconditionally a recovery point. It also treats ')',
      // '}' and ']' as conditional recovery points if one of calling productions is expecting
      // one of these symbols. This allows skip() to recover from errors such as '(a.) + 1' allowing
      // more of the AST to be retained (it doesn't skip any tokens as the ')' is retained because
      // of the '(' begins an '(' <expr> ')' production). The recovery points of grouping symbols
      // must be conditional as they must be skipped if none of the calling productions are not
      // expecting the closing token else we will never make progress in the case of an
      // extraneous group closing symbol (such as a stray ')'). This is not the case for ';' because
      // parseChain() is always the root production and it expects a ';'.
      // If a production expects one of these token it increments the corresponding nesting count,
      // and then decrements it just prior to checking if the token is in the input.
      _ParseAST.prototype.skip = function () {
          var n = this.next;
          while (this.index < this.tokens.length && !n.isCharacter($SEMICOLON) &&
              (this.rparensExpected <= 0 || !n.isCharacter($RPAREN)) &&
              (this.rbracesExpected <= 0 || !n.isCharacter($RBRACE)) &&
              (this.rbracketsExpected <= 0 || !n.isCharacter($RBRACKET))) {
              if (this.next.isError()) {
                  this.errors.push(new ParserError(this.next.toString(), this.input, this.locationText(), this.location));
              }
              this.advance();
              n = this.next;
          }
      };
      return _ParseAST;
  }());
  var SimpleExpressionChecker = (function () {
      function SimpleExpressionChecker() {
          this.errors = [];
      }
      SimpleExpressionChecker.check = function (ast) {
          var s = new SimpleExpressionChecker();
          ast.visit(s);
          return s.errors;
      };
      SimpleExpressionChecker.prototype.visitImplicitReceiver = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitInterpolation = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitLiteralPrimitive = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitPropertyRead = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitPropertyWrite = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitSafePropertyRead = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitMethodCall = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitSafeMethodCall = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitFunctionCall = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitLiteralArray = function (ast, context) { this.visitAll(ast.expressions); };
      SimpleExpressionChecker.prototype.visitLiteralMap = function (ast, context) { this.visitAll(ast.values); };
      SimpleExpressionChecker.prototype.visitBinary = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitPrefixNot = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitConditional = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitPipe = function (ast, context) { this.errors.push('pipes'); };
      SimpleExpressionChecker.prototype.visitKeyedRead = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitKeyedWrite = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitAll = function (asts) {
          var _this = this;
          return asts.map(function (node) { return node.visit(_this); });
      };
      SimpleExpressionChecker.prototype.visitChain = function (ast, context) { };
      SimpleExpressionChecker.prototype.visitQuote = function (ast, context) { };
      return SimpleExpressionChecker;
  }());

  var ParseLocation = (function () {
      function ParseLocation(file, offset, line, col) {
          this.file = file;
          this.offset = offset;
          this.line = line;
          this.col = col;
      }
      ParseLocation.prototype.toString = function () {
          return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
      };
      ParseLocation.prototype.moveBy = function (delta) {
          var source = this.file.content;
          var len = source.length;
          var offset = this.offset;
          var line = this.line;
          var col = this.col;
          while (offset > 0 && delta < 0) {
              offset--;
              delta++;
              var ch = source.charCodeAt(offset);
              if (ch == $LF) {
                  line--;
                  var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode($LF));
                  col = priorLine > 0 ? offset - priorLine : offset;
              }
              else {
                  col--;
              }
          }
          while (offset < len && delta > 0) {
              var ch = source.charCodeAt(offset);
              offset++;
              delta--;
              if (ch == $LF) {
                  line++;
                  col = 0;
              }
              else {
                  col++;
              }
          }
          return new ParseLocation(this.file, offset, line, col);
      };
      // Return the source around the location
      // Up to `maxChars` or `maxLines` on each side of the location
      ParseLocation.prototype.getContext = function (maxChars, maxLines) {
          var content = this.file.content;
          var startOffset = this.offset;
          if (startOffset != null) {
              if (startOffset > content.length - 1) {
                  startOffset = content.length - 1;
              }
              var endOffset = startOffset;
              var ctxChars = 0;
              var ctxLines = 0;
              while (ctxChars < maxChars && startOffset > 0) {
                  startOffset--;
                  ctxChars++;
                  if (content[startOffset] == '\n') {
                      if (++ctxLines == maxLines) {
                          break;
                      }
                  }
              }
              ctxChars = 0;
              ctxLines = 0;
              while (ctxChars < maxChars && endOffset < content.length - 1) {
                  endOffset++;
                  ctxChars++;
                  if (content[endOffset] == '\n') {
                      if (++ctxLines == maxLines) {
                          break;
                      }
                  }
              }
              return {
                  before: content.substring(startOffset, this.offset),
                  after: content.substring(this.offset, endOffset + 1),
              };
          }
          return null;
      };
      return ParseLocation;
  }());
  var ParseSourceFile = (function () {
      function ParseSourceFile(content, url) {
          this.content = content;
          this.url = url;
      }
      return ParseSourceFile;
  }());
  var ParseSourceSpan = (function () {
      function ParseSourceSpan(start, end, details) {
          if (details === void 0) { details = null; }
          this.start = start;
          this.end = end;
          this.details = details;
      }
      ParseSourceSpan.prototype.toString = function () {
          return this.start.file.content.substring(this.start.offset, this.end.offset);
      };
      return ParseSourceSpan;
  }());
  exports.ParseErrorLevel;
  (function (ParseErrorLevel) {
      ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
      ParseErrorLevel[ParseErrorLevel["FATAL"] = 1] = "FATAL";
  })(exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
  var ParseError = (function () {
      function ParseError(span, msg, level) {
          if (level === void 0) { level = exports.ParseErrorLevel.FATAL; }
          this.span = span;
          this.msg = msg;
          this.level = level;
      }
      ParseError.prototype.toString = function () {
          var ctx = this.span.start.getContext(100, 3);
          var contextStr = ctx ? " (\"" + ctx.before + "[ERROR ->]" + ctx.after + "\")" : '';
          var details = this.span.details ? ", " + this.span.details : '';
          return "" + this.msg + contextStr + ": " + this.span.start + details;
      };
      return ParseError;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var Text = (function () {
      function Text(value, sourceSpan) {
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      Text.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
      return Text;
  }());
  var Expansion = (function () {
      function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
          this.switchValue = switchValue;
          this.type = type;
          this.cases = cases;
          this.sourceSpan = sourceSpan;
          this.switchValueSourceSpan = switchValueSourceSpan;
      }
      Expansion.prototype.visit = function (visitor, context) { return visitor.visitExpansion(this, context); };
      return Expansion;
  }());
  var ExpansionCase = (function () {
      function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
          this.value = value;
          this.expression = expression;
          this.sourceSpan = sourceSpan;
          this.valueSourceSpan = valueSourceSpan;
          this.expSourceSpan = expSourceSpan;
      }
      ExpansionCase.prototype.visit = function (visitor, context) { return visitor.visitExpansionCase(this, context); };
      return ExpansionCase;
  }());
  var Attribute$1 = (function () {
      function Attribute(name, value, sourceSpan, valueSpan) {
          this.name = name;
          this.value = value;
          this.sourceSpan = sourceSpan;
          this.valueSpan = valueSpan;
      }
      Attribute.prototype.visit = function (visitor, context) { return visitor.visitAttribute(this, context); };
      return Attribute;
  }());
  var Element = (function () {
      function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
          this.name = name;
          this.attrs = attrs;
          this.children = children;
          this.sourceSpan = sourceSpan;
          this.startSourceSpan = startSourceSpan;
          this.endSourceSpan = endSourceSpan;
      }
      Element.prototype.visit = function (visitor, context) { return visitor.visitElement(this, context); };
      return Element;
  }());
  var Comment = (function () {
      function Comment(value, sourceSpan) {
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      Comment.prototype.visit = function (visitor, context) { return visitor.visitComment(this, context); };
      return Comment;
  }());
  function visitAll(visitor, nodes, context) {
      if (context === void 0) { context = null; }
      var result = [];
      var visit = visitor.visit ?
          function (ast) { return visitor.visit(ast, context) || ast.visit(visitor, context); } :
          function (ast) { return ast.visit(visitor, context); };
      nodes.forEach(function (ast) {
          var astResult = visit(ast);
          if (astResult) {
              result.push(astResult);
          }
      });
      return result;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$4 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var TokenType$1;
  (function (TokenType) {
      TokenType[TokenType["TAG_OPEN_START"] = 0] = "TAG_OPEN_START";
      TokenType[TokenType["TAG_OPEN_END"] = 1] = "TAG_OPEN_END";
      TokenType[TokenType["TAG_OPEN_END_VOID"] = 2] = "TAG_OPEN_END_VOID";
      TokenType[TokenType["TAG_CLOSE"] = 3] = "TAG_CLOSE";
      TokenType[TokenType["TEXT"] = 4] = "TEXT";
      TokenType[TokenType["ESCAPABLE_RAW_TEXT"] = 5] = "ESCAPABLE_RAW_TEXT";
      TokenType[TokenType["RAW_TEXT"] = 6] = "RAW_TEXT";
      TokenType[TokenType["COMMENT_START"] = 7] = "COMMENT_START";
      TokenType[TokenType["COMMENT_END"] = 8] = "COMMENT_END";
      TokenType[TokenType["CDATA_START"] = 9] = "CDATA_START";
      TokenType[TokenType["CDATA_END"] = 10] = "CDATA_END";
      TokenType[TokenType["ATTR_NAME"] = 11] = "ATTR_NAME";
      TokenType[TokenType["ATTR_VALUE"] = 12] = "ATTR_VALUE";
      TokenType[TokenType["DOC_TYPE"] = 13] = "DOC_TYPE";
      TokenType[TokenType["EXPANSION_FORM_START"] = 14] = "EXPANSION_FORM_START";
      TokenType[TokenType["EXPANSION_CASE_VALUE"] = 15] = "EXPANSION_CASE_VALUE";
      TokenType[TokenType["EXPANSION_CASE_EXP_START"] = 16] = "EXPANSION_CASE_EXP_START";
      TokenType[TokenType["EXPANSION_CASE_EXP_END"] = 17] = "EXPANSION_CASE_EXP_END";
      TokenType[TokenType["EXPANSION_FORM_END"] = 18] = "EXPANSION_FORM_END";
      TokenType[TokenType["EOF"] = 19] = "EOF";
  })(TokenType$1 || (TokenType$1 = {}));
  var Token$1 = (function () {
      function Token(type, parts, sourceSpan) {
          this.type = type;
          this.parts = parts;
          this.sourceSpan = sourceSpan;
      }
      return Token;
  }());
  var TokenError = (function (_super) {
      __extends$4(TokenError, _super);
      function TokenError(errorMsg, tokenType, span) {
          var _this = _super.call(this, span, errorMsg) || this;
          _this.tokenType = tokenType;
          return _this;
      }
      return TokenError;
  }(ParseError));
  var TokenizeResult = (function () {
      function TokenizeResult(tokens, errors) {
          this.tokens = tokens;
          this.errors = errors;
      }
      return TokenizeResult;
  }());
  function tokenize(source, url, getTagDefinition, tokenizeExpansionForms, interpolationConfig) {
      if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
      if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
      return new _Tokenizer(new ParseSourceFile(source, url), getTagDefinition, tokenizeExpansionForms, interpolationConfig)
          .tokenize();
  }
  var _CR_OR_CRLF_REGEXP = /\r\n?/g;
  function _unexpectedCharacterErrorMsg(charCode) {
      var char = charCode === $EOF ? 'EOF' : String.fromCharCode(charCode);
      return "Unexpected character \"" + char + "\"";
  }
  function _unknownEntityErrorMsg(entitySrc) {
      return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
  }
  var _ControlFlowError = (function () {
      function _ControlFlowError(error) {
          this.error = error;
      }
      return _ControlFlowError;
  }());
  // See http://www.w3.org/TR/html51/syntax.html#writing
  var _Tokenizer = (function () {
      /**
       * @param _file The html source
       * @param _getTagDefinition
       * @param _tokenizeIcu Whether to tokenize ICU messages (considered as text nodes when false)
       * @param _interpolationConfig
       */
      function _Tokenizer(_file, _getTagDefinition, _tokenizeIcu, _interpolationConfig) {
          if (_interpolationConfig === void 0) { _interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          this._file = _file;
          this._getTagDefinition = _getTagDefinition;
          this._tokenizeIcu = _tokenizeIcu;
          this._interpolationConfig = _interpolationConfig;
          // Note: this is always lowercase!
          this._peek = -1;
          this._nextPeek = -1;
          this._index = -1;
          this._line = 0;
          this._column = -1;
          this._expansionCaseStack = [];
          this._inInterpolation = false;
          this.tokens = [];
          this.errors = [];
          this._input = _file.content;
          this._length = _file.content.length;
          this._advance();
      }
      _Tokenizer.prototype._processCarriageReturns = function (content) {
          // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
          // In order to keep the original position in the source, we can not
          // pre-process it.
          // Instead CRs are processed right before instantiating the tokens.
          return content.replace(_CR_OR_CRLF_REGEXP, '\n');
      };
      _Tokenizer.prototype.tokenize = function () {
          while (this._peek !== $EOF) {
              var start = this._getLocation();
              try {
                  if (this._attemptCharCode($LT)) {
                      if (this._attemptCharCode($BANG)) {
                          if (this._attemptCharCode($LBRACKET)) {
                              this._consumeCdata(start);
                          }
                          else if (this._attemptCharCode($MINUS)) {
                              this._consumeComment(start);
                          }
                          else {
                              this._consumeDocType(start);
                          }
                      }
                      else if (this._attemptCharCode($SLASH)) {
                          this._consumeTagClose(start);
                      }
                      else {
                          this._consumeTagOpen(start);
                      }
                  }
                  else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
                      this._consumeText();
                  }
              }
              catch (e) {
                  if (e instanceof _ControlFlowError) {
                      this.errors.push(e.error);
                  }
                  else {
                      throw e;
                  }
              }
          }
          this._beginToken(TokenType$1.EOF);
          this._endToken([]);
          return new TokenizeResult(mergeTextTokens(this.tokens), this.errors);
      };
      /**
       * @returns {boolean} whether an ICU token has been created
       * @internal
       */
      _Tokenizer.prototype._tokenizeExpansionForm = function () {
          if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
              this._consumeExpansionFormStart();
              return true;
          }
          if (isExpansionCaseStart(this._peek) && this._isInExpansionForm()) {
              this._consumeExpansionCaseStart();
              return true;
          }
          if (this._peek === $RBRACE) {
              if (this._isInExpansionCase()) {
                  this._consumeExpansionCaseEnd();
                  return true;
              }
              if (this._isInExpansionForm()) {
                  this._consumeExpansionFormEnd();
                  return true;
              }
          }
          return false;
      };
      _Tokenizer.prototype._getLocation = function () {
          return new ParseLocation(this._file, this._index, this._line, this._column);
      };
      _Tokenizer.prototype._getSpan = function (start, end) {
          if (start === void 0) { start = this._getLocation(); }
          if (end === void 0) { end = this._getLocation(); }
          return new ParseSourceSpan(start, end);
      };
      _Tokenizer.prototype._beginToken = function (type, start) {
          if (start === void 0) { start = this._getLocation(); }
          this._currentTokenStart = start;
          this._currentTokenType = type;
      };
      _Tokenizer.prototype._endToken = function (parts, end) {
          if (end === void 0) { end = this._getLocation(); }
          var token = new Token$1(this._currentTokenType, parts, new ParseSourceSpan(this._currentTokenStart, end));
          this.tokens.push(token);
          this._currentTokenStart = null;
          this._currentTokenType = null;
          return token;
      };
      _Tokenizer.prototype._createError = function (msg, span) {
          if (this._isInExpansionForm()) {
              msg += " (Do you have an unescaped \"{\" in your template? Use \"{{ '{' }}\") to escape it.)";
          }
          var error = new TokenError(msg, this._currentTokenType, span);
          this._currentTokenStart = null;
          this._currentTokenType = null;
          return new _ControlFlowError(error);
      };
      _Tokenizer.prototype._advance = function () {
          if (this._index >= this._length) {
              throw this._createError(_unexpectedCharacterErrorMsg($EOF), this._getSpan());
          }
          if (this._peek === $LF) {
              this._line++;
              this._column = 0;
          }
          else if (this._peek !== $LF && this._peek !== $CR) {
              this._column++;
          }
          this._index++;
          this._peek = this._index >= this._length ? $EOF : this._input.charCodeAt(this._index);
          this._nextPeek =
              this._index + 1 >= this._length ? $EOF : this._input.charCodeAt(this._index + 1);
      };
      _Tokenizer.prototype._attemptCharCode = function (charCode) {
          if (this._peek === charCode) {
              this._advance();
              return true;
          }
          return false;
      };
      _Tokenizer.prototype._attemptCharCodeCaseInsensitive = function (charCode) {
          if (compareCharCodeCaseInsensitive(this._peek, charCode)) {
              this._advance();
              return true;
          }
          return false;
      };
      _Tokenizer.prototype._requireCharCode = function (charCode) {
          var location = this._getLocation();
          if (!this._attemptCharCode(charCode)) {
              throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location, location));
          }
      };
      _Tokenizer.prototype._attemptStr = function (chars) {
          var len = chars.length;
          if (this._index + len > this._length) {
              return false;
          }
          var initialPosition = this._savePosition();
          for (var i = 0; i < len; i++) {
              if (!this._attemptCharCode(chars.charCodeAt(i))) {
                  // If attempting to parse the string fails, we want to reset the parser
                  // to where it was before the attempt
                  this._restorePosition(initialPosition);
                  return false;
              }
          }
          return true;
      };
      _Tokenizer.prototype._attemptStrCaseInsensitive = function (chars) {
          for (var i = 0; i < chars.length; i++) {
              if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
                  return false;
              }
          }
          return true;
      };
      _Tokenizer.prototype._requireStr = function (chars) {
          var location = this._getLocation();
          if (!this._attemptStr(chars)) {
              throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location));
          }
      };
      _Tokenizer.prototype._attemptCharCodeUntilFn = function (predicate) {
          while (!predicate(this._peek)) {
              this._advance();
          }
      };
      _Tokenizer.prototype._requireCharCodeUntilFn = function (predicate, len) {
          var start = this._getLocation();
          this._attemptCharCodeUntilFn(predicate);
          if (this._index - start.offset < len) {
              throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(start, start));
          }
      };
      _Tokenizer.prototype._attemptUntilChar = function (char) {
          while (this._peek !== char) {
              this._advance();
          }
      };
      _Tokenizer.prototype._readChar = function (decodeEntities) {
          if (decodeEntities && this._peek === $AMPERSAND) {
              return this._decodeEntity();
          }
          else {
              var index = this._index;
              this._advance();
              return this._input[index];
          }
      };
      _Tokenizer.prototype._decodeEntity = function () {
          var start = this._getLocation();
          this._advance();
          if (this._attemptCharCode($HASH)) {
              var isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
              var numberStart = this._getLocation().offset;
              this._attemptCharCodeUntilFn(isDigitEntityEnd);
              if (this._peek != $SEMICOLON) {
                  throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
              }
              this._advance();
              var strNum = this._input.substring(numberStart, this._index - 1);
              try {
                  var charCode = parseInt(strNum, isHex ? 16 : 10);
                  return String.fromCharCode(charCode);
              }
              catch (e) {
                  var entity = this._input.substring(start.offset + 1, this._index - 1);
                  throw this._createError(_unknownEntityErrorMsg(entity), this._getSpan(start));
              }
          }
          else {
              var startPosition = this._savePosition();
              this._attemptCharCodeUntilFn(isNamedEntityEnd);
              if (this._peek != $SEMICOLON) {
                  this._restorePosition(startPosition);
                  return '&';
              }
              this._advance();
              var name_1 = this._input.substring(start.offset + 1, this._index - 1);
              var char = NAMED_ENTITIES[name_1];
              if (!char) {
                  throw this._createError(_unknownEntityErrorMsg(name_1), this._getSpan(start));
              }
              return char;
          }
      };
      _Tokenizer.prototype._consumeRawText = function (decodeEntities, firstCharOfEnd, attemptEndRest) {
          var tagCloseStart;
          var textStart = this._getLocation();
          this._beginToken(decodeEntities ? TokenType$1.ESCAPABLE_RAW_TEXT : TokenType$1.RAW_TEXT, textStart);
          var parts = [];
          while (true) {
              tagCloseStart = this._getLocation();
              if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
                  break;
              }
              if (this._index > tagCloseStart.offset) {
                  // add the characters consumed by the previous if statement to the output
                  parts.push(this._input.substring(tagCloseStart.offset, this._index));
              }
              while (this._peek !== firstCharOfEnd) {
                  parts.push(this._readChar(decodeEntities));
              }
          }
          return this._endToken([this._processCarriageReturns(parts.join(''))], tagCloseStart);
      };
      _Tokenizer.prototype._consumeComment = function (start) {
          var _this = this;
          this._beginToken(TokenType$1.COMMENT_START, start);
          this._requireCharCode($MINUS);
          this._endToken([]);
          var textToken = this._consumeRawText(false, $MINUS, function () { return _this._attemptStr('->'); });
          this._beginToken(TokenType$1.COMMENT_END, textToken.sourceSpan.end);
          this._endToken([]);
      };
      _Tokenizer.prototype._consumeCdata = function (start) {
          var _this = this;
          this._beginToken(TokenType$1.CDATA_START, start);
          this._requireStr('CDATA[');
          this._endToken([]);
          var textToken = this._consumeRawText(false, $RBRACKET, function () { return _this._attemptStr(']>'); });
          this._beginToken(TokenType$1.CDATA_END, textToken.sourceSpan.end);
          this._endToken([]);
      };
      _Tokenizer.prototype._consumeDocType = function (start) {
          this._beginToken(TokenType$1.DOC_TYPE, start);
          this._attemptUntilChar($GT);
          this._advance();
          this._endToken([this._input.substring(start.offset + 2, this._index - 1)]);
      };
      _Tokenizer.prototype._consumePrefixAndName = function () {
          var nameOrPrefixStart = this._index;
          var prefix = null;
          while (this._peek !== $COLON && !isPrefixEnd(this._peek)) {
              this._advance();
          }
          var nameStart;
          if (this._peek === $COLON) {
              this._advance();
              prefix = this._input.substring(nameOrPrefixStart, this._index - 1);
              nameStart = this._index;
          }
          else {
              nameStart = nameOrPrefixStart;
          }
          this._requireCharCodeUntilFn(isNameEnd, this._index === nameStart ? 1 : 0);
          var name = this._input.substring(nameStart, this._index);
          return [prefix, name];
      };
      _Tokenizer.prototype._consumeTagOpen = function (start) {
          var savedPos = this._savePosition();
          var tagName;
          var lowercaseTagName;
          try {
              if (!isAsciiLetter(this._peek)) {
                  throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
              }
              var nameStart = this._index;
              this._consumeTagOpenStart(start);
              tagName = this._input.substring(nameStart, this._index);
              lowercaseTagName = tagName.toLowerCase();
              this._attemptCharCodeUntilFn(isNotWhitespace);
              while (this._peek !== $SLASH && this._peek !== $GT) {
                  this._consumeAttributeName();
                  this._attemptCharCodeUntilFn(isNotWhitespace);
                  if (this._attemptCharCode($EQ)) {
                      this._attemptCharCodeUntilFn(isNotWhitespace);
                      this._consumeAttributeValue();
                  }
                  this._attemptCharCodeUntilFn(isNotWhitespace);
              }
              this._consumeTagOpenEnd();
          }
          catch (e) {
              if (e instanceof _ControlFlowError) {
                  // When the start tag is invalid, assume we want a "<"
                  this._restorePosition(savedPos);
                  // Back to back text tokens are merged at the end
                  this._beginToken(TokenType$1.TEXT, start);
                  this._endToken(['<']);
                  return;
              }
              throw e;
          }
          var contentTokenType = this._getTagDefinition(tagName).contentType;
          if (contentTokenType === exports.TagContentType.RAW_TEXT) {
              this._consumeRawTextWithTagClose(lowercaseTagName, false);
          }
          else if (contentTokenType === exports.TagContentType.ESCAPABLE_RAW_TEXT) {
              this._consumeRawTextWithTagClose(lowercaseTagName, true);
          }
      };
      _Tokenizer.prototype._consumeRawTextWithTagClose = function (lowercaseTagName, decodeEntities) {
          var _this = this;
          var textToken = this._consumeRawText(decodeEntities, $LT, function () {
              if (!_this._attemptCharCode($SLASH))
                  return false;
              _this._attemptCharCodeUntilFn(isNotWhitespace);
              if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
                  return false;
              _this._attemptCharCodeUntilFn(isNotWhitespace);
              return _this._attemptCharCode($GT);
          });
          this._beginToken(TokenType$1.TAG_CLOSE, textToken.sourceSpan.end);
          this._endToken([null, lowercaseTagName]);
      };
      _Tokenizer.prototype._consumeTagOpenStart = function (start) {
          this._beginToken(TokenType$1.TAG_OPEN_START, start);
          var parts = this._consumePrefixAndName();
          this._endToken(parts);
      };
      _Tokenizer.prototype._consumeAttributeName = function () {
          this._beginToken(TokenType$1.ATTR_NAME);
          var prefixAndName = this._consumePrefixAndName();
          this._endToken(prefixAndName);
      };
      _Tokenizer.prototype._consumeAttributeValue = function () {
          this._beginToken(TokenType$1.ATTR_VALUE);
          var value;
          if (this._peek === $SQ || this._peek === $DQ) {
              var quoteChar = this._peek;
              this._advance();
              var parts = [];
              while (this._peek !== quoteChar) {
                  parts.push(this._readChar(true));
              }
              value = parts.join('');
              this._advance();
          }
          else {
              var valueStart = this._index;
              this._requireCharCodeUntilFn(isNameEnd, 1);
              value = this._input.substring(valueStart, this._index);
          }
          this._endToken([this._processCarriageReturns(value)]);
      };
      _Tokenizer.prototype._consumeTagOpenEnd = function () {
          var tokenType = this._attemptCharCode($SLASH) ? TokenType$1.TAG_OPEN_END_VOID : TokenType$1.TAG_OPEN_END;
          this._beginToken(tokenType);
          this._requireCharCode($GT);
          this._endToken([]);
      };
      _Tokenizer.prototype._consumeTagClose = function (start) {
          this._beginToken(TokenType$1.TAG_CLOSE, start);
          this._attemptCharCodeUntilFn(isNotWhitespace);
          var prefixAndName = this._consumePrefixAndName();
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._requireCharCode($GT);
          this._endToken(prefixAndName);
      };
      _Tokenizer.prototype._consumeExpansionFormStart = function () {
          this._beginToken(TokenType$1.EXPANSION_FORM_START, this._getLocation());
          this._requireCharCode($LBRACE);
          this._endToken([]);
          this._expansionCaseStack.push(TokenType$1.EXPANSION_FORM_START);
          this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
          var condition = this._readUntil($COMMA);
          this._endToken([condition], this._getLocation());
          this._requireCharCode($COMMA);
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._beginToken(TokenType$1.RAW_TEXT, this._getLocation());
          var type = this._readUntil($COMMA);
          this._endToken([type], this._getLocation());
          this._requireCharCode($COMMA);
          this._attemptCharCodeUntilFn(isNotWhitespace);
      };
      _Tokenizer.prototype._consumeExpansionCaseStart = function () {
          this._beginToken(TokenType$1.EXPANSION_CASE_VALUE, this._getLocation());
          var value = this._readUntil($LBRACE).trim();
          this._endToken([value], this._getLocation());
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._beginToken(TokenType$1.EXPANSION_CASE_EXP_START, this._getLocation());
          this._requireCharCode($LBRACE);
          this._endToken([], this._getLocation());
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._expansionCaseStack.push(TokenType$1.EXPANSION_CASE_EXP_START);
      };
      _Tokenizer.prototype._consumeExpansionCaseEnd = function () {
          this._beginToken(TokenType$1.EXPANSION_CASE_EXP_END, this._getLocation());
          this._requireCharCode($RBRACE);
          this._endToken([], this._getLocation());
          this._attemptCharCodeUntilFn(isNotWhitespace);
          this._expansionCaseStack.pop();
      };
      _Tokenizer.prototype._consumeExpansionFormEnd = function () {
          this._beginToken(TokenType$1.EXPANSION_FORM_END, this._getLocation());
          this._requireCharCode($RBRACE);
          this._endToken([]);
          this._expansionCaseStack.pop();
      };
      _Tokenizer.prototype._consumeText = function () {
          var start = this._getLocation();
          this._beginToken(TokenType$1.TEXT, start);
          var parts = [];
          do {
              if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
                  parts.push(this._interpolationConfig.start);
                  this._inInterpolation = true;
              }
              else if (this._interpolationConfig && this._inInterpolation &&
                  this._attemptStr(this._interpolationConfig.end)) {
                  parts.push(this._interpolationConfig.end);
                  this._inInterpolation = false;
              }
              else {
                  parts.push(this._readChar(true));
              }
          } while (!this._isTextEnd());
          this._endToken([this._processCarriageReturns(parts.join(''))]);
      };
      _Tokenizer.prototype._isTextEnd = function () {
          if (this._peek === $LT || this._peek === $EOF) {
              return true;
          }
          if (this._tokenizeIcu && !this._inInterpolation) {
              if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
                  // start of an expansion form
                  return true;
              }
              if (this._peek === $RBRACE && this._isInExpansionCase()) {
                  // end of and expansion case
                  return true;
              }
          }
          return false;
      };
      _Tokenizer.prototype._savePosition = function () {
          return [this._peek, this._index, this._column, this._line, this.tokens.length];
      };
      _Tokenizer.prototype._readUntil = function (char) {
          var start = this._index;
          this._attemptUntilChar(char);
          return this._input.substring(start, this._index);
      };
      _Tokenizer.prototype._restorePosition = function (position) {
          this._peek = position[0];
          this._index = position[1];
          this._column = position[2];
          this._line = position[3];
          var nbTokens = position[4];
          if (nbTokens < this.tokens.length) {
              // remove any extra tokens
              this.tokens = this.tokens.slice(0, nbTokens);
          }
      };
      _Tokenizer.prototype._isInExpansionCase = function () {
          return this._expansionCaseStack.length > 0 &&
              this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                  TokenType$1.EXPANSION_CASE_EXP_START;
      };
      _Tokenizer.prototype._isInExpansionForm = function () {
          return this._expansionCaseStack.length > 0 &&
              this._expansionCaseStack[this._expansionCaseStack.length - 1] ===
                  TokenType$1.EXPANSION_FORM_START;
      };
      return _Tokenizer;
  }());
  function isNotWhitespace(code) {
      return !isWhitespace(code) || code === $EOF;
  }
  function isNameEnd(code) {
      return isWhitespace(code) || code === $GT || code === $SLASH ||
          code === $SQ || code === $DQ || code === $EQ;
  }
  function isPrefixEnd(code) {
      return (code < $a || $z < code) && (code < $A || $Z < code) &&
          (code < $0 || code > $9);
  }
  function isDigitEntityEnd(code) {
      return code == $SEMICOLON || code == $EOF || !isAsciiHexDigit(code);
  }
  function isNamedEntityEnd(code) {
      return code == $SEMICOLON || code == $EOF || !isAsciiLetter(code);
  }
  function isExpansionFormStart(input, offset, interpolationConfig) {
      var isInterpolationStart = interpolationConfig ? input.indexOf(interpolationConfig.start, offset) == offset : false;
      return input.charCodeAt(offset) == $LBRACE && !isInterpolationStart;
  }
  function isExpansionCaseStart(peek) {
      return peek === $EQ || isAsciiLetter(peek);
  }
  function compareCharCodeCaseInsensitive(code1, code2) {
      return toUpperCaseCharCode(code1) == toUpperCaseCharCode(code2);
  }
  function toUpperCaseCharCode(code) {
      return code >= $a && code <= $z ? code - $a + $A : code;
  }
  function mergeTextTokens(srcTokens) {
      var dstTokens = [];
      var lastDstToken;
      for (var i = 0; i < srcTokens.length; i++) {
          var token = srcTokens[i];
          if (lastDstToken && lastDstToken.type == TokenType$1.TEXT && token.type == TokenType$1.TEXT) {
              lastDstToken.parts[0] += token.parts[0];
              lastDstToken.sourceSpan.end = token.sourceSpan.end;
          }
          else {
              lastDstToken = token;
              dstTokens.push(lastDstToken);
          }
      }
      return dstTokens;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$3 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var TreeError = (function (_super) {
      __extends$3(TreeError, _super);
      function TreeError(elementName, span, msg) {
          var _this = _super.call(this, span, msg) || this;
          _this.elementName = elementName;
          return _this;
      }
      TreeError.create = function (elementName, span, msg) {
          return new TreeError(elementName, span, msg);
      };
      return TreeError;
  }(ParseError));
  var ParseTreeResult = (function () {
      function ParseTreeResult(rootNodes, errors) {
          this.rootNodes = rootNodes;
          this.errors = errors;
      }
      return ParseTreeResult;
  }());
  var Parser$1 = (function () {
      function Parser(getTagDefinition) {
          this.getTagDefinition = getTagDefinition;
      }
      Parser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
          if (parseExpansionForms === void 0) { parseExpansionForms = false; }
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var tokensAndErrors = tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
          var treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
          return new ParseTreeResult(treeAndErrors.rootNodes, tokensAndErrors.errors.concat(treeAndErrors.errors));
      };
      return Parser;
  }());
  var _TreeBuilder = (function () {
      function _TreeBuilder(tokens, getTagDefinition) {
          this.tokens = tokens;
          this.getTagDefinition = getTagDefinition;
          this._index = -1;
          this._rootNodes = [];
          this._errors = [];
          this._elementStack = [];
          this._advance();
      }
      _TreeBuilder.prototype.build = function () {
          while (this._peek.type !== TokenType$1.EOF) {
              if (this._peek.type === TokenType$1.TAG_OPEN_START) {
                  this._consumeStartTag(this._advance());
              }
              else if (this._peek.type === TokenType$1.TAG_CLOSE) {
                  this._consumeEndTag(this._advance());
              }
              else if (this._peek.type === TokenType$1.CDATA_START) {
                  this._closeVoidElement();
                  this._consumeCdata(this._advance());
              }
              else if (this._peek.type === TokenType$1.COMMENT_START) {
                  this._closeVoidElement();
                  this._consumeComment(this._advance());
              }
              else if (this._peek.type === TokenType$1.TEXT || this._peek.type === TokenType$1.RAW_TEXT ||
                  this._peek.type === TokenType$1.ESCAPABLE_RAW_TEXT) {
                  this._closeVoidElement();
                  this._consumeText(this._advance());
              }
              else if (this._peek.type === TokenType$1.EXPANSION_FORM_START) {
                  this._consumeExpansion(this._advance());
              }
              else {
                  // Skip all other tokens...
                  this._advance();
              }
          }
          return new ParseTreeResult(this._rootNodes, this._errors);
      };
      _TreeBuilder.prototype._advance = function () {
          var prev = this._peek;
          if (this._index < this.tokens.length - 1) {
              // Note: there is always an EOF token at the end
              this._index++;
          }
          this._peek = this.tokens[this._index];
          return prev;
      };
      _TreeBuilder.prototype._advanceIf = function (type) {
          if (this._peek.type === type) {
              return this._advance();
          }
          return null;
      };
      _TreeBuilder.prototype._consumeCdata = function (startToken) {
          this._consumeText(this._advance());
          this._advanceIf(TokenType$1.CDATA_END);
      };
      _TreeBuilder.prototype._consumeComment = function (token) {
          var text = this._advanceIf(TokenType$1.RAW_TEXT);
          this._advanceIf(TokenType$1.COMMENT_END);
          var value = text != null ? text.parts[0].trim() : null;
          this._addToParent(new Comment(value, token.sourceSpan));
      };
      _TreeBuilder.prototype._consumeExpansion = function (token) {
          var switchValue = this._advance();
          var type = this._advance();
          var cases = [];
          // read =
          while (this._peek.type === TokenType$1.EXPANSION_CASE_VALUE) {
              var expCase = this._parseExpansionCase();
              if (!expCase)
                  return; // error
              cases.push(expCase);
          }
          // read the final }
          if (this._peek.type !== TokenType$1.EXPANSION_FORM_END) {
              this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '}'."));
              return;
          }
          var sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
          this._addToParent(new Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
          this._advance();
      };
      _TreeBuilder.prototype._parseExpansionCase = function () {
          var value = this._advance();
          // read {
          if (this._peek.type !== TokenType$1.EXPANSION_CASE_EXP_START) {
              this._errors.push(TreeError.create(null, this._peek.sourceSpan, "Invalid ICU message. Missing '{'."));
              return null;
          }
          // read until }
          var start = this._advance();
          var exp = this._collectExpansionExpTokens(start);
          if (!exp)
              return null;
          var end = this._advance();
          exp.push(new Token$1(TokenType$1.EOF, [], end.sourceSpan));
          // parse everything in between { and }
          var parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
          if (parsedExp.errors.length > 0) {
              this._errors = this._errors.concat(parsedExp.errors);
              return null;
          }
          var sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
          var expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
          return new ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
      };
      _TreeBuilder.prototype._collectExpansionExpTokens = function (start) {
          var exp = [];
          var expansionFormStack = [TokenType$1.EXPANSION_CASE_EXP_START];
          while (true) {
              if (this._peek.type === TokenType$1.EXPANSION_FORM_START ||
                  this._peek.type === TokenType$1.EXPANSION_CASE_EXP_START) {
                  expansionFormStack.push(this._peek.type);
              }
              if (this._peek.type === TokenType$1.EXPANSION_CASE_EXP_END) {
                  if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_CASE_EXP_START)) {
                      expansionFormStack.pop();
                      if (expansionFormStack.length == 0)
                          return exp;
                  }
                  else {
                      this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                      return null;
                  }
              }
              if (this._peek.type === TokenType$1.EXPANSION_FORM_END) {
                  if (lastOnStack(expansionFormStack, TokenType$1.EXPANSION_FORM_START)) {
                      expansionFormStack.pop();
                  }
                  else {
                      this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                      return null;
                  }
              }
              if (this._peek.type === TokenType$1.EOF) {
                  this._errors.push(TreeError.create(null, start.sourceSpan, "Invalid ICU message. Missing '}'."));
                  return null;
              }
              exp.push(this._advance());
          }
      };
      _TreeBuilder.prototype._consumeText = function (token) {
          var text = token.parts[0];
          if (text.length > 0 && text[0] == '\n') {
              var parent_1 = this._getParentElement();
              if (parent_1 != null && parent_1.children.length == 0 &&
                  this.getTagDefinition(parent_1.name).ignoreFirstLf) {
                  text = text.substring(1);
              }
          }
          if (text.length > 0) {
              this._addToParent(new Text(text, token.sourceSpan));
          }
      };
      _TreeBuilder.prototype._closeVoidElement = function () {
          if (this._elementStack.length > 0) {
              var el = this._elementStack[this._elementStack.length - 1];
              if (this.getTagDefinition(el.name).isVoid) {
                  this._elementStack.pop();
              }
          }
      };
      _TreeBuilder.prototype._consumeStartTag = function (startTagToken) {
          var prefix = startTagToken.parts[0];
          var name = startTagToken.parts[1];
          var attrs = [];
          while (this._peek.type === TokenType$1.ATTR_NAME) {
              attrs.push(this._consumeAttr(this._advance()));
          }
          var fullName = this._getElementFullName(prefix, name, this._getParentElement());
          var selfClosing = false;
          // Note: There could have been a tokenizer error
          // so that we don't get a token for the end tag...
          if (this._peek.type === TokenType$1.TAG_OPEN_END_VOID) {
              this._advance();
              selfClosing = true;
              var tagDef = this.getTagDefinition(fullName);
              if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                  this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, "Only void and foreign elements can be self closed \"" + startTagToken.parts[1] + "\""));
              }
          }
          else if (this._peek.type === TokenType$1.TAG_OPEN_END) {
              this._advance();
              selfClosing = false;
          }
          var end = this._peek.sourceSpan.start;
          var span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
          var el = new Element(fullName, attrs, [], span, span, null);
          this._pushElement(el);
          if (selfClosing) {
              this._popElement(fullName);
              el.endSourceSpan = span;
          }
      };
      _TreeBuilder.prototype._pushElement = function (el) {
          if (this._elementStack.length > 0) {
              var parentEl = this._elementStack[this._elementStack.length - 1];
              if (this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
                  this._elementStack.pop();
              }
          }
          var tagDef = this.getTagDefinition(el.name);
          var _a = this._getParentElementSkippingContainers(), parent = _a.parent, container = _a.container;
          if (parent && tagDef.requireExtraParent(parent.name)) {
              var newParent = new Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
              this._insertBeforeContainer(parent, container, newParent);
          }
          this._addToParent(el);
          this._elementStack.push(el);
      };
      _TreeBuilder.prototype._consumeEndTag = function (endTagToken) {
          var fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
          if (this._getParentElement()) {
              this._getParentElement().endSourceSpan = endTagToken.sourceSpan;
          }
          if (this.getTagDefinition(fullName).isVoid) {
              this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, "Void elements do not have end tags \"" + endTagToken.parts[1] + "\""));
          }
          else if (!this._popElement(fullName)) {
              this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, "Unexpected closing tag \"" + endTagToken.parts[1] + "\""));
          }
      };
      _TreeBuilder.prototype._popElement = function (fullName) {
          for (var stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
              var el = this._elementStack[stackIndex];
              if (el.name == fullName) {
                  this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                  return true;
              }
              if (!this.getTagDefinition(el.name).closedByParent) {
                  return false;
              }
          }
          return false;
      };
      _TreeBuilder.prototype._consumeAttr = function (attrName) {
          var fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
          var end = attrName.sourceSpan.end;
          var value = '';
          var valueSpan;
          if (this._peek.type === TokenType$1.ATTR_VALUE) {
              var valueToken = this._advance();
              value = valueToken.parts[0];
              end = valueToken.sourceSpan.end;
              valueSpan = valueToken.sourceSpan;
          }
          return new Attribute$1(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
      };
      _TreeBuilder.prototype._getParentElement = function () {
          return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
      };
      /**
       * Returns the parent in the DOM and the container.
       *
       * `<ng-container>` elements are skipped as they are not rendered as DOM element.
       */
      _TreeBuilder.prototype._getParentElementSkippingContainers = function () {
          var container = null;
          for (var i = this._elementStack.length - 1; i >= 0; i--) {
              if (this._elementStack[i].name !== 'ng-container') {
                  return { parent: this._elementStack[i], container: container };
              }
              container = this._elementStack[i];
          }
          return { parent: this._elementStack[this._elementStack.length - 1], container: container };
      };
      _TreeBuilder.prototype._addToParent = function (node) {
          var parent = this._getParentElement();
          if (parent != null) {
              parent.children.push(node);
          }
          else {
              this._rootNodes.push(node);
          }
      };
      /**
       * Insert a node between the parent and the container.
       * When no container is given, the node is appended as a child of the parent.
       * Also updates the element stack accordingly.
       *
       * @internal
       */
      _TreeBuilder.prototype._insertBeforeContainer = function (parent, container, node) {
          if (!container) {
              this._addToParent(node);
              this._elementStack.push(node);
          }
          else {
              if (parent) {
                  // replace the container with the new node in the children
                  var index = parent.children.indexOf(container);
                  parent.children[index] = node;
              }
              else {
                  this._rootNodes.push(node);
              }
              node.children.push(container);
              this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
          }
      };
      _TreeBuilder.prototype._getElementFullName = function (prefix, localName, parentElement) {
          if (prefix == null) {
              prefix = this.getTagDefinition(localName).implicitNamespacePrefix;
              if (prefix == null && parentElement != null) {
                  prefix = getNsPrefix(parentElement.name);
              }
          }
          return mergeNsAndName(prefix, localName);
      };
      return _TreeBuilder;
  }());
  function lastOnStack(stack, element) {
      return stack.length > 0 && stack[stack.length - 1] === element;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var Message = (function () {
      /**
       * @param nodes message AST
       * @param placeholders maps placeholder names to static content
       * @param placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
       * @param meaning
       * @param description
       * @param id
       */
      function Message(nodes, placeholders, placeholderToMessage, meaning, description, id) {
          this.nodes = nodes;
          this.placeholders = placeholders;
          this.placeholderToMessage = placeholderToMessage;
          this.meaning = meaning;
          this.description = description;
          this.id = id;
      }
      return Message;
  }());
  var Text$1 = (function () {
      function Text(value, sourceSpan) {
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      Text.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
      return Text;
  }());
  // TODO(vicb): do we really need this node (vs an array) ?
  var Container = (function () {
      function Container(children, sourceSpan) {
          this.children = children;
          this.sourceSpan = sourceSpan;
      }
      Container.prototype.visit = function (visitor, context) { return visitor.visitContainer(this, context); };
      return Container;
  }());
  var Icu = (function () {
      function Icu(expression, type, cases, sourceSpan) {
          this.expression = expression;
          this.type = type;
          this.cases = cases;
          this.sourceSpan = sourceSpan;
      }
      Icu.prototype.visit = function (visitor, context) { return visitor.visitIcu(this, context); };
      return Icu;
  }());
  var TagPlaceholder = (function () {
      function TagPlaceholder(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
          this.tag = tag;
          this.attrs = attrs;
          this.startName = startName;
          this.closeName = closeName;
          this.children = children;
          this.isVoid = isVoid;
          this.sourceSpan = sourceSpan;
      }
      TagPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitTagPlaceholder(this, context); };
      return TagPlaceholder;
  }());
  var Placeholder = (function () {
      function Placeholder(value, name, sourceSpan) {
          this.value = value;
          this.name = name;
          this.sourceSpan = sourceSpan;
      }
      Placeholder.prototype.visit = function (visitor, context) { return visitor.visitPlaceholder(this, context); };
      return Placeholder;
  }());
  var IcuPlaceholder = (function () {
      function IcuPlaceholder(value, name, sourceSpan) {
          this.value = value;
          this.name = name;
          this.sourceSpan = sourceSpan;
      }
      IcuPlaceholder.prototype.visit = function (visitor, context) { return visitor.visitIcuPlaceholder(this, context); };
      return IcuPlaceholder;
  }());
  // Clone the AST
  var CloneVisitor = (function () {
      function CloneVisitor() {
      }
      CloneVisitor.prototype.visitText = function (text, context) { return new Text$1(text.value, text.sourceSpan); };
      CloneVisitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          var children = container.children.map(function (n) { return n.visit(_this, context); });
          return new Container(children, container.sourceSpan);
      };
      CloneVisitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          var cases = {};
          Object.keys(icu.cases).forEach(function (key) { return cases[key] = icu.cases[key].visit(_this, context); });
          var msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
          msg.expressionPlaceholder = icu.expressionPlaceholder;
          return msg;
      };
      CloneVisitor.prototype.visitTagPlaceholder = function (ph, context) {
          var _this = this;
          var children = ph.children.map(function (n) { return n.visit(_this, context); });
          return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
      };
      CloneVisitor.prototype.visitPlaceholder = function (ph, context) {
          return new Placeholder(ph.value, ph.name, ph.sourceSpan);
      };
      CloneVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
          return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
      };
      return CloneVisitor;
  }());
  // Visit all the nodes recursively
  var RecurseVisitor = (function () {
      function RecurseVisitor() {
      }
      RecurseVisitor.prototype.visitText = function (text, context) { };
      ;
      RecurseVisitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          container.children.forEach(function (child) { return child.visit(_this); });
      };
      RecurseVisitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          Object.keys(icu.cases).forEach(function (k) { icu.cases[k].visit(_this); });
      };
      RecurseVisitor.prototype.visitTagPlaceholder = function (ph, context) {
          var _this = this;
          ph.children.forEach(function (child) { return child.visit(_this); });
      };
      RecurseVisitor.prototype.visitPlaceholder = function (ph, context) { };
      ;
      RecurseVisitor.prototype.visitIcuPlaceholder = function (ph, context) { };
      ;
      return RecurseVisitor;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var TAG_TO_PLACEHOLDER_NAMES = {
      'A': 'LINK',
      'B': 'BOLD_TEXT',
      'BR': 'LINE_BREAK',
      'EM': 'EMPHASISED_TEXT',
      'H1': 'HEADING_LEVEL1',
      'H2': 'HEADING_LEVEL2',
      'H3': 'HEADING_LEVEL3',
      'H4': 'HEADING_LEVEL4',
      'H5': 'HEADING_LEVEL5',
      'H6': 'HEADING_LEVEL6',
      'HR': 'HORIZONTAL_RULE',
      'I': 'ITALIC_TEXT',
      'LI': 'LIST_ITEM',
      'LINK': 'MEDIA_LINK',
      'OL': 'ORDERED_LIST',
      'P': 'PARAGRAPH',
      'Q': 'QUOTATION',
      'S': 'STRIKETHROUGH_TEXT',
      'SMALL': 'SMALL_TEXT',
      'SUB': 'SUBSTRIPT',
      'SUP': 'SUPERSCRIPT',
      'TBODY': 'TABLE_BODY',
      'TD': 'TABLE_CELL',
      'TFOOT': 'TABLE_FOOTER',
      'TH': 'TABLE_HEADER_CELL',
      'THEAD': 'TABLE_HEADER',
      'TR': 'TABLE_ROW',
      'TT': 'MONOSPACED_TEXT',
      'U': 'UNDERLINED_TEXT',
      'UL': 'UNORDERED_LIST',
  };
  /**
   * Creates unique names for placeholder with different content.
   *
   * Returns the same placeholder name when the content is identical.
   *
   * @internal
   */
  var PlaceholderRegistry = (function () {
      function PlaceholderRegistry() {
          // Count the occurrence of the base name top generate a unique name
          this._placeHolderNameCounts = {};
          // Maps signature to placeholder names
          this._signatureToName = {};
      }
      PlaceholderRegistry.prototype.getStartTagPlaceholderName = function (tag, attrs, isVoid) {
          var signature = this._hashTag(tag, attrs, isVoid);
          if (this._signatureToName[signature]) {
              return this._signatureToName[signature];
          }
          var upperTag = tag.toUpperCase();
          var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
          var name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
          this._signatureToName[signature] = name;
          return name;
      };
      PlaceholderRegistry.prototype.getCloseTagPlaceholderName = function (tag) {
          var signature = this._hashClosingTag(tag);
          if (this._signatureToName[signature]) {
              return this._signatureToName[signature];
          }
          var upperTag = tag.toUpperCase();
          var baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
          var name = this._generateUniqueName("CLOSE_" + baseName);
          this._signatureToName[signature] = name;
          return name;
      };
      PlaceholderRegistry.prototype.getPlaceholderName = function (name, content) {
          var upperName = name.toUpperCase();
          var signature = "PH: " + upperName + "=" + content;
          if (this._signatureToName[signature]) {
              return this._signatureToName[signature];
          }
          var uniqueName = this._generateUniqueName(upperName);
          this._signatureToName[signature] = uniqueName;
          return uniqueName;
      };
      PlaceholderRegistry.prototype.getUniquePlaceholder = function (name) {
          return this._generateUniqueName(name.toUpperCase());
      };
      // Generate a hash for a tag - does not take attribute order into account
      PlaceholderRegistry.prototype._hashTag = function (tag, attrs, isVoid) {
          var start = "<" + tag;
          var strAttrs = Object.keys(attrs).sort().map(function (name) { return " " + name + "=" + attrs[name]; }).join('');
          var end = isVoid ? '/>' : "></" + tag + ">";
          return start + strAttrs + end;
      };
      PlaceholderRegistry.prototype._hashClosingTag = function (tag) { return this._hashTag("/" + tag, {}, false); };
      PlaceholderRegistry.prototype._generateUniqueName = function (base) {
          var seen = this._placeHolderNameCounts.hasOwnProperty(base);
          if (!seen) {
              this._placeHolderNameCounts[base] = 1;
              return base;
          }
          var id = this._placeHolderNameCounts[base];
          this._placeHolderNameCounts[base] = id + 1;
          return base + "_" + id;
      };
      return PlaceholderRegistry;
  }());

  var _expParser = new Parser(new Lexer());
  /**
   * Returns a function converting html nodes to an i18n Message given an interpolationConfig
   */
  function createI18nMessageFactory(interpolationConfig) {
      var visitor = new _I18nVisitor(_expParser, interpolationConfig);
      return function (nodes, meaning, description, id) {
          return visitor.toI18nMessage(nodes, meaning, description, id);
      };
  }
  var _I18nVisitor = (function () {
      function _I18nVisitor(_expressionParser, _interpolationConfig) {
          this._expressionParser = _expressionParser;
          this._interpolationConfig = _interpolationConfig;
      }
      _I18nVisitor.prototype.toI18nMessage = function (nodes, meaning, description, id) {
          this._isIcu = nodes.length == 1 && nodes[0] instanceof Expansion;
          this._icuDepth = 0;
          this._placeholderRegistry = new PlaceholderRegistry();
          this._placeholderToContent = {};
          this._placeholderToMessage = {};
          var i18nodes = visitAll(this, nodes, {});
          return new Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
      };
      _I18nVisitor.prototype.visitElement = function (el, context) {
          var children = visitAll(this, el.children);
          var attrs = {};
          el.attrs.forEach(function (attr) {
              // Do not visit the attributes, translatable ones are top-level ASTs
              attrs[attr.name] = attr.value;
          });
          var isVoid = getHtmlTagDefinition(el.name).isVoid;
          var startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
          this._placeholderToContent[startPhName] = el.sourceSpan.toString();
          var closePhName = '';
          if (!isVoid) {
              closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
              this._placeholderToContent[closePhName] = "</" + el.name + ">";
          }
          return new TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, el.sourceSpan);
      };
      _I18nVisitor.prototype.visitAttribute = function (attribute, context) {
          return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
      };
      _I18nVisitor.prototype.visitText = function (text, context) {
          return this._visitTextWithInterpolation(text.value, text.sourceSpan);
      };
      _I18nVisitor.prototype.visitComment = function (comment, context) { return null; };
      _I18nVisitor.prototype.visitExpansion = function (icu, context) {
          var _this = this;
          this._icuDepth++;
          var i18nIcuCases = {};
          var i18nIcu = new Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
          icu.cases.forEach(function (caze) {
              i18nIcuCases[caze.value] = new Container(caze.expression.map(function (node) { return node.visit(_this, {}); }), caze.expSourceSpan);
          });
          this._icuDepth--;
          if (this._isIcu || this._icuDepth > 0) {
              // Returns an ICU node when:
              // - the message (vs a part of the message) is an ICU message, or
              // - the ICU message is nested.
              var expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
              i18nIcu.expressionPlaceholder = expPh;
              this._placeholderToContent[expPh] = icu.switchValue;
              return i18nIcu;
          }
          // Else returns a placeholder
          // ICU placeholders should not be replaced with their original content but with the their
          // translations. We need to create a new visitor (they are not re-entrant) to compute the
          // message id.
          // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
          var phName = this._placeholderRegistry.getPlaceholderName('ICU', icu.sourceSpan.toString());
          var visitor = new _I18nVisitor(this._expressionParser, this._interpolationConfig);
          this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], '', '', '');
          return new IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
      };
      _I18nVisitor.prototype.visitExpansionCase = function (icuCase, context) {
          throw new Error('Unreachable code');
      };
      _I18nVisitor.prototype._visitTextWithInterpolation = function (text, sourceSpan) {
          var splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
          if (!splitInterpolation) {
              // No expression, return a single text
              return new Text$1(text, sourceSpan);
          }
          // Return a group of text + expressions
          var nodes = [];
          var container = new Container(nodes, sourceSpan);
          var _a = this._interpolationConfig, sDelimiter = _a.start, eDelimiter = _a.end;
          for (var i = 0; i < splitInterpolation.strings.length - 1; i++) {
              var expression = splitInterpolation.expressions[i];
              var baseName = _extractPlaceholderName(expression) || 'INTERPOLATION';
              var phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
              if (splitInterpolation.strings[i].length) {
                  // No need to add empty strings
                  nodes.push(new Text$1(splitInterpolation.strings[i], sourceSpan));
              }
              nodes.push(new Placeholder(expression, phName, sourceSpan));
              this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
          }
          // The last index contains no expression
          var lastStringIdx = splitInterpolation.strings.length - 1;
          if (splitInterpolation.strings[lastStringIdx].length) {
              nodes.push(new Text$1(splitInterpolation.strings[lastStringIdx], sourceSpan));
          }
          return container;
      };
      return _I18nVisitor;
  }());
  var _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*"([\s\S]*?)"[\s\S]*\)/g;
  function _extractPlaceholderName(input) {
      return input.split(_CUSTOM_PH_EXP)[1];
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$5 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  /**
   * An i18n error.
   */
  var I18nError = (function (_super) {
      __extends$5(I18nError, _super);
      function I18nError(span, msg) {
          return _super.call(this, span, msg) || this;
      }
      return I18nError;
  }(ParseError));

  var _I18N_ATTR = 'i18n';
  var _I18N_ATTR_PREFIX = 'i18n-';
  var _I18N_COMMENT_PREFIX_REGEXP = /^i18n:?/;
  var MEANING_SEPARATOR = '|';
  var ID_SEPARATOR = '@@';
  /**
   * Extract translatable messages from an html AST
   */
  function extractMessages(nodes, interpolationConfig, implicitTags, implicitAttrs) {
      var visitor = new _Visitor(implicitTags, implicitAttrs);
      return visitor.extract(nodes, interpolationConfig);
  }
  function mergeTranslations(nodes, translations, interpolationConfig, implicitTags, implicitAttrs) {
      var visitor = new _Visitor(implicitTags, implicitAttrs);
      return visitor.merge(nodes, translations, interpolationConfig);
  }
  var ExtractionResult = (function () {
      function ExtractionResult(messages, errors) {
          this.messages = messages;
          this.errors = errors;
      }
      return ExtractionResult;
  }());
  var _VisitorMode;
  (function (_VisitorMode) {
      _VisitorMode[_VisitorMode["Extract"] = 0] = "Extract";
      _VisitorMode[_VisitorMode["Merge"] = 1] = "Merge";
  })(_VisitorMode || (_VisitorMode = {}));
  /**
   * This Visitor is used:
   * 1. to extract all the translatable strings from an html AST (see `extract()`),
   * 2. to replace the translatable strings with the actual translations (see `merge()`)
   *
   * @internal
   */
  var _Visitor = (function () {
      function _Visitor(_implicitTags, _implicitAttrs) {
          this._implicitTags = _implicitTags;
          this._implicitAttrs = _implicitAttrs;
      }
      /**
       * Extracts the messages from the tree
       */
      _Visitor.prototype.extract = function (nodes, interpolationConfig) {
          var _this = this;
          this._init(_VisitorMode.Extract, interpolationConfig);
          nodes.forEach(function (node) { return node.visit(_this, null); });
          if (this._inI18nBlock) {
              this._reportError(nodes[nodes.length - 1], 'Unclosed block');
          }
          return new ExtractionResult(this._messages, this._errors);
      };
      /**
       * Returns a tree where all translatable nodes are translated
       */
      _Visitor.prototype.merge = function (nodes, translations, interpolationConfig) {
          this._init(_VisitorMode.Merge, interpolationConfig);
          this._translations = translations;
          // Construct a single fake root element
          var wrapper = new Element('wrapper', [], nodes, null, null, null);
          var translatedNode = wrapper.visit(this, null);
          if (this._inI18nBlock) {
              this._reportError(nodes[nodes.length - 1], 'Unclosed block');
          }
          return new ParseTreeResult(translatedNode.children, this._errors);
      };
      _Visitor.prototype.visitExpansionCase = function (icuCase, context) {
          // Parse cases for translatable html attributes
          var expression = visitAll(this, icuCase.expression, context);
          if (this._mode === _VisitorMode.Merge) {
              return new ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
          }
      };
      _Visitor.prototype.visitExpansion = function (icu, context) {
          this._mayBeAddBlockChildren(icu);
          var wasInIcu = this._inIcu;
          if (!this._inIcu) {
              // nested ICU messages should not be extracted but top-level translated as a whole
              if (this._isInTranslatableSection) {
                  this._addMessage([icu]);
              }
              this._inIcu = true;
          }
          var cases = visitAll(this, icu.cases, context);
          if (this._mode === _VisitorMode.Merge) {
              icu = new Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
          }
          this._inIcu = wasInIcu;
          return icu;
      };
      _Visitor.prototype.visitComment = function (comment, context) {
          var isOpening = _isOpeningComment(comment);
          if (isOpening && this._isInTranslatableSection) {
              this._reportError(comment, 'Could not start a block inside a translatable section');
              return;
          }
          var isClosing = _isClosingComment(comment);
          if (isClosing && !this._inI18nBlock) {
              this._reportError(comment, 'Trying to close an unopened block');
              return;
          }
          if (!this._inI18nNode && !this._inIcu) {
              if (!this._inI18nBlock) {
                  if (isOpening) {
                      this._inI18nBlock = true;
                      this._blockStartDepth = this._depth;
                      this._blockChildren = [];
                      this._blockMeaningAndDesc = comment.value.replace(_I18N_COMMENT_PREFIX_REGEXP, '').trim();
                      this._openTranslatableSection(comment);
                  }
              }
              else {
                  if (isClosing) {
                      if (this._depth == this._blockStartDepth) {
                          this._closeTranslatableSection(comment, this._blockChildren);
                          this._inI18nBlock = false;
                          var message = this._addMessage(this._blockChildren, this._blockMeaningAndDesc);
                          // merge attributes in sections
                          var nodes = this._translateMessage(comment, message);
                          return visitAll(this, nodes);
                      }
                      else {
                          this._reportError(comment, 'I18N blocks should not cross element boundaries');
                          return;
                      }
                  }
              }
          }
      };
      _Visitor.prototype.visitText = function (text, context) {
          if (this._isInTranslatableSection) {
              this._mayBeAddBlockChildren(text);
          }
          return text;
      };
      _Visitor.prototype.visitElement = function (el, context) {
          var _this = this;
          this._mayBeAddBlockChildren(el);
          this._depth++;
          var wasInI18nNode = this._inI18nNode;
          var wasInImplicitNode = this._inImplicitNode;
          var childNodes = [];
          var translatedChildNodes;
          // Extract:
          // - top level nodes with the (implicit) "i18n" attribute if not already in a section
          // - ICU messages
          var i18nAttr = _getI18nAttr(el);
          var i18nMeta = i18nAttr ? i18nAttr.value : '';
          var isImplicit = this._implicitTags.some(function (tag) { return el.name === tag; }) && !this._inIcu &&
              !this._isInTranslatableSection;
          var isTopLevelImplicit = !wasInImplicitNode && isImplicit;
          this._inImplicitNode = wasInImplicitNode || isImplicit;
          if (!this._isInTranslatableSection && !this._inIcu) {
              if (i18nAttr || isTopLevelImplicit) {
                  this._inI18nNode = true;
                  var message = this._addMessage(el.children, i18nMeta);
                  translatedChildNodes = this._translateMessage(el, message);
              }
              if (this._mode == _VisitorMode.Extract) {
                  var isTranslatable = i18nAttr || isTopLevelImplicit;
                  if (isTranslatable)
                      this._openTranslatableSection(el);
                  visitAll(this, el.children);
                  if (isTranslatable)
                      this._closeTranslatableSection(el, el.children);
              }
          }
          else {
              if (i18nAttr || isTopLevelImplicit) {
                  this._reportError(el, 'Could not mark an element as translatable inside a translatable section');
              }
              if (this._mode == _VisitorMode.Extract) {
                  // Descend into child nodes for extraction
                  visitAll(this, el.children);
              }
          }
          if (this._mode === _VisitorMode.Merge) {
              var visitNodes = translatedChildNodes || el.children;
              visitNodes.forEach(function (child) {
                  var visited = child.visit(_this, context);
                  if (visited && !_this._isInTranslatableSection) {
                      // Do not add the children from translatable sections (= i18n blocks here)
                      // They will be added later in this loop when the block closes (i.e. on `<!-- /i18n -->`)
                      childNodes = childNodes.concat(visited);
                  }
              });
          }
          this._visitAttributesOf(el);
          this._depth--;
          this._inI18nNode = wasInI18nNode;
          this._inImplicitNode = wasInImplicitNode;
          if (this._mode === _VisitorMode.Merge) {
              var translatedAttrs = this._translateAttributes(el);
              return new Element(el.name, translatedAttrs, childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
          }
      };
      _Visitor.prototype.visitAttribute = function (attribute, context) {
          throw new Error('unreachable code');
      };
      _Visitor.prototype._init = function (mode, interpolationConfig) {
          this._mode = mode;
          this._inI18nBlock = false;
          this._inI18nNode = false;
          this._depth = 0;
          this._inIcu = false;
          this._msgCountAtSectionStart = void 0;
          this._errors = [];
          this._messages = [];
          this._inImplicitNode = false;
          this._createI18nMessage = createI18nMessageFactory(interpolationConfig);
      };
      // looks for translatable attributes
      _Visitor.prototype._visitAttributesOf = function (el) {
          var _this = this;
          var explicitAttrNameToValue = {};
          var implicitAttrNames = this._implicitAttrs[el.name] || [];
          el.attrs.filter(function (attr) { return attr.name.startsWith(_I18N_ATTR_PREFIX); })
              .forEach(function (attr) { return explicitAttrNameToValue[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
              attr.value; });
          el.attrs.forEach(function (attr) {
              if (attr.name in explicitAttrNameToValue) {
                  _this._addMessage([attr], explicitAttrNameToValue[attr.name]);
              }
              else if (implicitAttrNames.some(function (name) { return attr.name === name; })) {
                  _this._addMessage([attr]);
              }
          });
      };
      // add a translatable message
      _Visitor.prototype._addMessage = function (ast, msgMeta) {
          if (ast.length == 0 ||
              ast.length == 1 && ast[0] instanceof Attribute$1 && !ast[0].value) {
              // Do not create empty messages
              return;
          }
          var _a = _parseMessageMeta(msgMeta), meaning = _a.meaning, description = _a.description, id = _a.id;
          var message = this._createI18nMessage(ast, meaning, description, id);
          this._messages.push(message);
          return message;
      };
      // Translates the given message given the `TranslationBundle`
      // This is used for translating elements / blocks - see `_translateAttributes` for attributes
      // no-op when called in extraction mode (returns [])
      _Visitor.prototype._translateMessage = function (el, message) {
          if (message && this._mode === _VisitorMode.Merge) {
              var nodes = this._translations.get(message);
              if (nodes) {
                  return nodes;
              }
              this._reportError(el, "Translation unavailable for message id=\"" + this._translations.digest(message) + "\"");
          }
          return [];
      };
      // translate the attributes of an element and remove i18n specific attributes
      _Visitor.prototype._translateAttributes = function (el) {
          var _this = this;
          var attributes = el.attrs;
          var i18nAttributeMeanings = {};
          attributes.forEach(function (attr) {
              if (attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                  i18nAttributeMeanings[attr.name.slice(_I18N_ATTR_PREFIX.length)] =
                      _parseMessageMeta(attr.value).meaning;
              }
          });
          var translatedAttributes = [];
          attributes.forEach(function (attr) {
              if (attr.name === _I18N_ATTR || attr.name.startsWith(_I18N_ATTR_PREFIX)) {
                  // strip i18n specific attributes
                  return;
              }
              if (attr.value && attr.value != '' && i18nAttributeMeanings.hasOwnProperty(attr.name)) {
                  var meaning = i18nAttributeMeanings[attr.name];
                  var message = _this._createI18nMessage([attr], meaning, '', '');
                  var nodes = _this._translations.get(message);
                  if (nodes) {
                      if (nodes.length == 0) {
                          translatedAttributes.push(new Attribute$1(attr.name, '', attr.sourceSpan));
                      }
                      else if (nodes[0] instanceof Text) {
                          var value = nodes[0].value;
                          translatedAttributes.push(new Attribute$1(attr.name, value, attr.sourceSpan));
                      }
                      else {
                          _this._reportError(el, "Unexpected translation for attribute \"" + attr.name + "\" (id=\"" + _this._translations.digest(message) + "\")");
                      }
                  }
                  else {
                      _this._reportError(el, "Translation unavailable for attribute \"" + attr.name + "\" (id=\"" + _this._translations.digest(message) + "\")");
                  }
              }
              else {
                  translatedAttributes.push(attr);
              }
          });
          return translatedAttributes;
      };
      /**
       * Add the node as a child of the block when:
       * - we are in a block,
       * - we are not inside a ICU message (those are handled separately),
       * - the node is a "direct child" of the block
       */
      _Visitor.prototype._mayBeAddBlockChildren = function (node) {
          if (this._inI18nBlock && !this._inIcu && this._depth == this._blockStartDepth) {
              this._blockChildren.push(node);
          }
      };
      /**
       * Marks the start of a section, see `_closeTranslatableSection`
       */
      _Visitor.prototype._openTranslatableSection = function (node) {
          if (this._isInTranslatableSection) {
              this._reportError(node, 'Unexpected section start');
          }
          else {
              this._msgCountAtSectionStart = this._messages.length;
          }
      };
      Object.defineProperty(_Visitor.prototype, "_isInTranslatableSection", {
          /**
           * A translatable section could be:
           * - the content of translatable element,
           * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
           */
          get: function () {
              return this._msgCountAtSectionStart !== void 0;
          },
          enumerable: true,
          configurable: true
      });
      /**
       * Terminates a section.
       *
       * If a section has only one significant children (comments not significant) then we should not
       * keep the message from this children:
       *
       * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
       * - one for the <p> content with meaning and description,
       * - another one for the ICU message.
       *
       * In this case the last message is discarded as it contains less information (the AST is
       * otherwise identical).
       *
       * Note that we should still keep messages extracted from attributes inside the section (ie in the
       * ICU message here)
       */
      _Visitor.prototype._closeTranslatableSection = function (node, directChildren) {
          if (!this._isInTranslatableSection) {
              this._reportError(node, 'Unexpected section end');
              return;
          }
          var startIndex = this._msgCountAtSectionStart;
          var significantChildren = directChildren.reduce(function (count, node) { return count + (node instanceof Comment ? 0 : 1); }, 0);
          if (significantChildren == 1) {
              for (var i = this._messages.length - 1; i >= startIndex; i--) {
                  var ast = this._messages[i].nodes;
                  if (!(ast.length == 1 && ast[0] instanceof Text$1)) {
                      this._messages.splice(i, 1);
                      break;
                  }
              }
          }
          this._msgCountAtSectionStart = void 0;
      };
      _Visitor.prototype._reportError = function (node, msg) {
          this._errors.push(new I18nError(node.sourceSpan, msg));
      };
      return _Visitor;
  }());
  function _isOpeningComment(n) {
      return n instanceof Comment && n.value && n.value.startsWith('i18n');
  }
  function _isClosingComment(n) {
      return n instanceof Comment && n.value && n.value === '/i18n';
  }
  function _getI18nAttr(p) {
      return p.attrs.find(function (attr) { return attr.name === _I18N_ATTR; }) || null;
  }
  function _parseMessageMeta(i18n) {
      if (!i18n)
          return { meaning: '', description: '', id: '' };
      var idIndex = i18n.indexOf(ID_SEPARATOR);
      var descIndex = i18n.indexOf(MEANING_SEPARATOR);
      var _a = (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''], meaningAndDesc = _a[0], id = _a[1];
      var _b = (descIndex > -1) ?
          [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
          ['', meaningAndDesc], meaning = _b[0], description = _b[1];
      return { meaning: meaning, description: description, id: id };
  }

  var XmlTagDefinition = (function () {
      function XmlTagDefinition() {
          this.closedByParent = false;
          this.contentType = exports.TagContentType.PARSABLE_DATA;
          this.isVoid = false;
          this.ignoreFirstLf = false;
          this.canSelfClose = true;
      }
      XmlTagDefinition.prototype.requireExtraParent = function (currentParent) { return false; };
      XmlTagDefinition.prototype.isClosedByChild = function (name) { return false; };
      return XmlTagDefinition;
  }());
  var _TAG_DEFINITION = new XmlTagDefinition();
  function getXmlTagDefinition(tagName) {
      return _TAG_DEFINITION;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$7 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var XmlParser = (function (_super) {
      __extends$7(XmlParser, _super);
      function XmlParser() {
          return _super.call(this, getXmlTagDefinition) || this;
      }
      XmlParser.prototype.parse = function (source, url, parseExpansionForms) {
          if (parseExpansionForms === void 0) { parseExpansionForms = false; }
          return _super.prototype.parse.call(this, source, url, parseExpansionForms, null);
      };
      return XmlParser;
  }(Parser$1));

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$8 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  function digest(message) {
      return message.id || sha1(serializeNodes(message.nodes).join('') + ("[" + message.meaning + "]"));
  }
  function decimalDigest(message) {
      if (message.id) {
          return message.id;
      }
      var visitor = new _SerializerIgnoreIcuExpVisitor();
      var parts = message.nodes.map(function (a) { return a.visit(visitor, null); });
      return computeMsgId(parts.join(''), message.meaning);
  }
  /**
   * Serialize the i18n ast to something xml-like in order to generate an UID.
   *
   * The visitor is also used in the i18n parser tests
   *
   * @internal
   */
  var _SerializerVisitor = (function () {
      function _SerializerVisitor() {
      }
      _SerializerVisitor.prototype.visitText = function (text, context) { return text.value; };
      _SerializerVisitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          return "[" + container.children.map(function (child) { return child.visit(_this); }).join(', ') + "]";
      };
      _SerializerVisitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          var strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
          return "{" + icu.expression + ", " + icu.type + ", " + strCases.join(', ') + "}";
      };
      _SerializerVisitor.prototype.visitTagPlaceholder = function (ph, context) {
          var _this = this;
          return ph.isVoid ?
              "<ph tag name=\"" + ph.startName + "\"/>" :
              "<ph tag name=\"" + ph.startName + "\">" + ph.children.map(function (child) { return child.visit(_this); }).join(', ') + "</ph name=\"" + ph.closeName + "\">";
      };
      _SerializerVisitor.prototype.visitPlaceholder = function (ph, context) {
          return ph.value ? "<ph name=\"" + ph.name + "\">" + ph.value + "</ph>" : "<ph name=\"" + ph.name + "\"/>";
      };
      _SerializerVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
          return "<ph icu name=\"" + ph.name + "\">" + ph.value.visit(this) + "</ph>";
      };
      return _SerializerVisitor;
  }());
  var serializerVisitor = new _SerializerVisitor();
  function serializeNodes(nodes) {
      return nodes.map(function (a) { return a.visit(serializerVisitor, null); });
  }
  /**
   * Serialize the i18n ast to something xml-like in order to generate an UID.
   *
   * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
   *
   * @internal
   */
  var _SerializerIgnoreIcuExpVisitor = (function (_super) {
      __extends$8(_SerializerIgnoreIcuExpVisitor, _super);
      function _SerializerIgnoreIcuExpVisitor() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      _SerializerIgnoreIcuExpVisitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          var strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
          // Do not take the expression into account
          return "{" + icu.type + ", " + strCases.join(', ') + "}";
      };
      return _SerializerIgnoreIcuExpVisitor;
  }(_SerializerVisitor));
  /**
   * Compute the SHA1 of the given string
   *
   * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
   *
   * WARNING: this function has not been designed not tested with security in mind.
   *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
   */
  function sha1(str) {
      var utf8 = utf8Encode(str);
      var words32 = stringToWords32(utf8, Endian.Big);
      var len = utf8.length * 8;
      var w = new Array(80);
      var _a = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
      words32[len >> 5] |= 0x80 << (24 - len % 32);
      words32[((len + 64 >> 9) << 4) + 15] = len;
      for (var i = 0; i < words32.length; i += 16) {
          var _b = [a, b, c, d, e], h0 = _b[0], h1 = _b[1], h2 = _b[2], h3 = _b[3], h4 = _b[4];
          for (var j = 0; j < 80; j++) {
              if (j < 16) {
                  w[j] = words32[i + j];
              }
              else {
                  w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
              }
              var _c = fk(j, b, c, d), f = _c[0], k = _c[1];
              var temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
              _d = [d, c, rol32(b, 30), a, temp], e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
          }
          _e = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
      }
      return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
      var _d, _e;
  }
  function fk(index, b, c, d) {
      if (index < 20) {
          return [(b & c) | (~b & d), 0x5a827999];
      }
      if (index < 40) {
          return [b ^ c ^ d, 0x6ed9eba1];
      }
      if (index < 60) {
          return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
      }
      return [b ^ c ^ d, 0xca62c1d6];
  }
  /**
   * Compute the fingerprint of the given string
   *
   * The output is 64 bit number encoded as a decimal string
   *
   * based on:
   * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
   */
  function fingerprint(str) {
      var utf8 = utf8Encode(str);
      var _a = [hash32(utf8, 0), hash32(utf8, 102072)], hi = _a[0], lo = _a[1];
      if (hi == 0 && (lo == 0 || lo == 1)) {
          hi = hi ^ 0x130f9bef;
          lo = lo ^ -0x6b5f56d8;
      }
      return [hi, lo];
  }
  function computeMsgId(msg, meaning) {
      var _a = fingerprint(msg), hi = _a[0], lo = _a[1];
      if (meaning) {
          var _b = fingerprint(meaning), him = _b[0], lom = _b[1];
          _c = add64(rol64([hi, lo], 1), [him, lom]), hi = _c[0], lo = _c[1];
      }
      return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
      var _c;
  }
  function hash32(str, c) {
      var _a = [0x9e3779b9, 0x9e3779b9], a = _a[0], b = _a[1];
      var i;
      var len = str.length;
      for (i = 0; i + 12 <= len; i += 12) {
          a = add32(a, wordAt(str, i, Endian.Little));
          b = add32(b, wordAt(str, i + 4, Endian.Little));
          c = add32(c, wordAt(str, i + 8, Endian.Little));
          _b = mix([a, b, c]), a = _b[0], b = _b[1], c = _b[2];
      }
      a = add32(a, wordAt(str, i, Endian.Little));
      b = add32(b, wordAt(str, i + 4, Endian.Little));
      // the first byte of c is reserved for the length
      c = add32(c, len);
      c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
      return mix([a, b, c])[2];
      var _b;
  }
  // clang-format off
  function mix(_a) {
      var a = _a[0], b = _a[1], c = _a[2];
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 13;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 8;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 13;
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 12;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 16;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 5;
      a = sub32(a, b);
      a = sub32(a, c);
      a ^= c >>> 3;
      b = sub32(b, c);
      b = sub32(b, a);
      b ^= a << 10;
      c = sub32(c, a);
      c = sub32(c, b);
      c ^= b >>> 15;
      return [a, b, c];
  }
  // clang-format on
  // Utils
  var Endian;
  (function (Endian) {
      Endian[Endian["Little"] = 0] = "Little";
      Endian[Endian["Big"] = 1] = "Big";
  })(Endian || (Endian = {}));
  function utf8Encode(str) {
      var encoded = '';
      for (var index = 0; index < str.length; index++) {
          var codePoint = decodeSurrogatePairs(str, index);
          if (codePoint <= 0x7f) {
              encoded += String.fromCharCode(codePoint);
          }
          else if (codePoint <= 0x7ff) {
              encoded += String.fromCharCode(0xc0 | codePoint >>> 6, 0x80 | codePoint & 0x3f);
          }
          else if (codePoint <= 0xffff) {
              encoded += String.fromCharCode(0xe0 | codePoint >>> 12, 0x80 | codePoint >>> 6 & 0x3f, 0x80 | codePoint & 0x3f);
          }
          else if (codePoint <= 0x1fffff) {
              encoded += String.fromCharCode(0xf0 | codePoint >>> 18, 0x80 | codePoint >>> 12 & 0x3f, 0x80 | codePoint >>> 6 & 0x3f, 0x80 | codePoint & 0x3f);
          }
      }
      return encoded;
  }
  // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
  function decodeSurrogatePairs(str, index) {
      if (index < 0 || index >= str.length) {
          throw new Error("index=" + index + " is out of range in \"" + str + "\"");
      }
      var high = str.charCodeAt(index);
      if (high >= 0xd800 && high <= 0xdfff && str.length > index + 1) {
          var low = byteAt(str, index + 1);
          if (low >= 0xdc00 && low <= 0xdfff) {
              return (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
          }
      }
      return high;
  }
  function add32(a, b) {
      return add32to64(a, b)[1];
  }
  function add32to64(a, b) {
      var low = (a & 0xffff) + (b & 0xffff);
      var high = (a >>> 16) + (b >>> 16) + (low >>> 16);
      return [high >>> 16, (high << 16) | (low & 0xffff)];
  }
  function add64(_a, _b) {
      var ah = _a[0], al = _a[1];
      var bh = _b[0], bl = _b[1];
      var _c = add32to64(al, bl), carry = _c[0], l = _c[1];
      var h = add32(add32(ah, bh), carry);
      return [h, l];
  }
  function sub32(a, b) {
      var low = (a & 0xffff) - (b & 0xffff);
      var high = (a >> 16) - (b >> 16) + (low >> 16);
      return (high << 16) | (low & 0xffff);
  }
  // Rotate a 32b number left `count` position
  function rol32(a, count) {
      return (a << count) | (a >>> (32 - count));
  }
  // Rotate a 64b number left `count` position
  function rol64(_a, count) {
      var hi = _a[0], lo = _a[1];
      var h = (hi << count) | (lo >>> (32 - count));
      var l = (lo << count) | (hi >>> (32 - count));
      return [h, l];
  }
  function stringToWords32(str, endian) {
      var words32 = Array((str.length + 3) >>> 2);
      for (var i = 0; i < words32.length; i++) {
          words32[i] = wordAt(str, i * 4, endian);
      }
      return words32;
  }
  function byteAt(str, index) {
      return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
  }
  function wordAt(str, index, endian) {
      var word = 0;
      if (endian === Endian.Big) {
          for (var i = 0; i < 4; i++) {
              word += byteAt(str, index + i) << (24 - 8 * i);
          }
      }
      else {
          for (var i = 0; i < 4; i++) {
              word += byteAt(str, index + i) << 8 * i;
          }
      }
      return word;
  }
  function words32ToByteString(words32) {
      return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
  }
  function word32ToByteString(word) {
      var str = '';
      for (var i = 0; i < 4; i++) {
          str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
      }
      return str;
  }
  function byteStringToHexString(str) {
      var hex = '';
      for (var i = 0; i < str.length; i++) {
          var b = byteAt(str, i);
          hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
      }
      return hex.toLowerCase();
  }
  // based on http://www.danvk.org/hex2dec.html (JS can not handle more than 56b)
  function byteStringToDecString(str) {
      var decimal = '';
      var toThePower = '1';
      for (var i = str.length - 1; i >= 0; i--) {
          decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
          toThePower = numberTimesBigInt(256, toThePower);
      }
      return decimal.split('').reverse().join('');
  }
  // x and y decimal, lowest significant digit first
  function addBigInt(x, y) {
      var sum = '';
      var len = Math.max(x.length, y.length);
      for (var i = 0, carry = 0; i < len || carry; i++) {
          var tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
          if (tmpSum >= 10) {
              carry = 1;
              sum += tmpSum - 10;
          }
          else {
              carry = 0;
              sum += tmpSum;
          }
      }
      return sum;
  }
  function numberTimesBigInt(num, b) {
      var product = '';
      var bToThePower = b;
      for (; num !== 0; num = num >>> 1) {
          if (num & 1)
              product = addBigInt(product, bToThePower);
          bToThePower = addBigInt(bToThePower, bToThePower);
      }
      return product;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$9 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Serializer = (function () {
      function Serializer() {
      }
      // Creates a name mapper, see `PlaceholderMapper`
      // Returning `null` means that no name mapping is used.
      Serializer.prototype.createNameMapper = function (message) { return null; };
      return Serializer;
  }());
  /**
   * A simple mapper that take a function to transform an internal name to a public name
   */
  var SimplePlaceholderMapper = (function (_super) {
      __extends$9(SimplePlaceholderMapper, _super);
      // create a mapping from the message
      function SimplePlaceholderMapper(message, mapName) {
          var _this = _super.call(this) || this;
          _this.mapName = mapName;
          _this.internalToPublic = {};
          _this.publicToNextId = {};
          _this.publicToInternal = {};
          message.nodes.forEach(function (node) { return node.visit(_this); });
          return _this;
      }
      SimplePlaceholderMapper.prototype.toPublicName = function (internalName) {
          return this.internalToPublic.hasOwnProperty(internalName) ?
              this.internalToPublic[internalName] :
              null;
      };
      SimplePlaceholderMapper.prototype.toInternalName = function (publicName) {
          return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
              null;
      };
      SimplePlaceholderMapper.prototype.visitText = function (text, context) { return null; };
      SimplePlaceholderMapper.prototype.visitTagPlaceholder = function (ph, context) {
          this.visitPlaceholderName(ph.startName);
          _super.prototype.visitTagPlaceholder.call(this, ph, context);
          this.visitPlaceholderName(ph.closeName);
      };
      SimplePlaceholderMapper.prototype.visitPlaceholder = function (ph, context) { this.visitPlaceholderName(ph.name); };
      SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function (ph, context) {
          this.visitPlaceholderName(ph.name);
      };
      // XMB placeholders could only contains A-Z, 0-9 and _
      SimplePlaceholderMapper.prototype.visitPlaceholderName = function (internalName) {
          if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
              return;
          }
          var publicName = this.mapName(internalName);
          if (this.publicToInternal.hasOwnProperty(publicName)) {
              // Create a new XMB when it has already been used
              var nextId = this.publicToNextId[publicName];
              this.publicToNextId[publicName] = nextId + 1;
              publicName = publicName + "_" + nextId;
          }
          else {
              this.publicToNextId[publicName] = 1;
          }
          this.internalToPublic[internalName] = publicName;
          this.publicToInternal[publicName] = internalName;
      };
      return SimplePlaceholderMapper;
  }(RecurseVisitor));

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$10 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var _Visitor$1 = (function () {
      function _Visitor() {
      }
      _Visitor.prototype.visitTag = function (tag) {
          var _this = this;
          var strAttrs = this._serializeAttributes(tag.attrs);
          if (tag.children.length == 0) {
              return "<" + tag.name + strAttrs + "/>";
          }
          var strChildren = tag.children.map(function (node) { return node.visit(_this); });
          return "<" + tag.name + strAttrs + ">" + strChildren.join('') + "</" + tag.name + ">";
      };
      _Visitor.prototype.visitText = function (text) { return text.value; };
      _Visitor.prototype.visitDeclaration = function (decl) {
          return "<?xml" + this._serializeAttributes(decl.attrs) + " ?>";
      };
      _Visitor.prototype._serializeAttributes = function (attrs) {
          var strAttrs = Object.keys(attrs).map(function (name) { return name + "=\"" + attrs[name] + "\""; }).join(' ');
          return strAttrs.length > 0 ? ' ' + strAttrs : '';
      };
      _Visitor.prototype.visitDoctype = function (doctype) {
          return "<!DOCTYPE " + doctype.rootTag + " [\n" + doctype.dtd + "\n]>";
      };
      return _Visitor;
  }());
  var _visitor = new _Visitor$1();
  function serialize(nodes) {
      return nodes.map(function (node) { return node.visit(_visitor); }).join('');
  }
  var Declaration = (function () {
      function Declaration(unescapedAttrs) {
          var _this = this;
          this.attrs = {};
          Object.keys(unescapedAttrs).forEach(function (k) {
              _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
          });
      }
      Declaration.prototype.visit = function (visitor) { return visitor.visitDeclaration(this); };
      return Declaration;
  }());
  var Doctype = (function () {
      function Doctype(rootTag, dtd) {
          this.rootTag = rootTag;
          this.dtd = dtd;
      }
      ;
      Doctype.prototype.visit = function (visitor) { return visitor.visitDoctype(this); };
      return Doctype;
  }());
  var Tag = (function () {
      function Tag(name, unescapedAttrs, children) {
          if (unescapedAttrs === void 0) { unescapedAttrs = {}; }
          if (children === void 0) { children = []; }
          var _this = this;
          this.name = name;
          this.children = children;
          this.attrs = {};
          Object.keys(unescapedAttrs).forEach(function (k) {
              _this.attrs[k] = _escapeXml(unescapedAttrs[k]);
          });
      }
      Tag.prototype.visit = function (visitor) { return visitor.visitTag(this); };
      return Tag;
  }());
  var Text$2 = (function () {
      function Text(unescapedValue) {
          this.value = _escapeXml(unescapedValue);
      }
      ;
      Text.prototype.visit = function (visitor) { return visitor.visitText(this); };
      return Text;
  }());
  var CR = (function (_super) {
      __extends$10(CR, _super);
      function CR(ws) {
          if (ws === void 0) { ws = 0; }
          return _super.call(this, "\n" + new Array(ws + 1).join(' ')) || this;
      }
      return CR;
  }(Text$2));
  var _ESCAPED_CHARS = [
      [/&/g, '&amp;'],
      [/"/g, '&quot;'],
      [/'/g, '&apos;'],
      [/</g, '&lt;'],
      [/>/g, '&gt;'],
  ];
  function _escapeXml(text) {
      return _ESCAPED_CHARS.reduce(function (text, entry) { return text.replace(entry[0], entry[1]); }, text);
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$6 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var _VERSION = '1.2';
  var _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
  // TODO(vicb): make this a param (s/_/-/)
  var _DEFAULT_SOURCE_LANG = 'en';
  var _PLACEHOLDER_TAG = 'x';
  var _FILE_TAG = 'file';
  var _SOURCE_TAG = 'source';
  var _TARGET_TAG = 'target';
  var _UNIT_TAG = 'trans-unit';
  // http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
  // http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
  var Xliff = (function (_super) {
      __extends$6(Xliff, _super);
      function Xliff() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Xliff.prototype.write = function (messages, locale) {
          var visitor = new _WriteVisitor();
          var transUnits = [];
          messages.forEach(function (message) {
              var transUnit = new Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
              transUnit.children.push(new CR(8), new Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new CR(8), new Tag(_TARGET_TAG));
              if (message.description) {
                  transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'description' }, [new Text$2(message.description)]));
              }
              if (message.meaning) {
                  transUnit.children.push(new CR(8), new Tag('note', { priority: '1', from: 'meaning' }, [new Text$2(message.meaning)]));
              }
              transUnit.children.push(new CR(6));
              transUnits.push(new CR(6), transUnit);
          });
          var body = new Tag('body', {}, transUnits.concat([new CR(4)]));
          var file = new Tag('file', {
              'source-language': locale || _DEFAULT_SOURCE_LANG,
              datatype: 'plaintext',
              original: 'ng2.template',
          }, [new CR(4), body, new CR(2)]);
          var xliff = new Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new CR(2), file, new CR()]);
          return serialize([
              new Declaration({ version: '1.0', encoding: 'UTF-8' }), new CR(), xliff, new CR()
          ]);
      };
      Xliff.prototype.load = function (content, url) {
          // xliff to xml nodes
          var xliffParser = new XliffParser();
          var _a = xliffParser.parse(content, url), locale = _a.locale, mlNodesByMsgId = _a.mlNodesByMsgId, errors = _a.errors;
          // xml nodes to i18n nodes
          var i18nNodesByMsgId = {};
          var converter = new XmlToI18n();
          Object.keys(mlNodesByMsgId).forEach(function (msgId) {
              var _a = converter.convert(mlNodesByMsgId[msgId]), i18nNodes = _a.i18nNodes, e = _a.errors;
              errors.push.apply(errors, e);
              i18nNodesByMsgId[msgId] = i18nNodes;
          });
          if (errors.length) {
              throw new Error("xliff parse errors:\n" + errors.join('\n'));
          }
          return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
      };
      Xliff.prototype.digest = function (message) { return digest(message); };
      return Xliff;
  }(Serializer));
  var _WriteVisitor = (function () {
      function _WriteVisitor() {
      }
      _WriteVisitor.prototype.visitText = function (text, context) { return [new Text$2(text.value)]; };
      _WriteVisitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          var nodes = [];
          container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
          return nodes;
      };
      _WriteVisitor.prototype.visitIcu = function (icu, context) {
          if (this._isInIcu) {
              // nested ICU is not supported
              throw new Error('xliff does not support nested ICU messages');
          }
          this._isInIcu = true;
          // TODO(vicb): support ICU messages
          // https://lists.oasis-open.org/archives/xliff/201201/msg00028.html
          // http://docs.oasis-open.org/xliff/v1.2/xliff-profile-po/xliff-profile-po-1.2-cd02.html
          var nodes = [];
          this._isInIcu = false;
          return nodes;
      };
      _WriteVisitor.prototype.visitTagPlaceholder = function (ph, context) {
          var ctype = getCtypeForTag(ph.tag);
          var startTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype });
          if (ph.isVoid) {
              // void tags have no children nor closing tags
              return [startTagPh];
          }
          var closeTagPh = new Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype: ctype });
          return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
      };
      _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
          return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
      };
      _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
          return [new Tag(_PLACEHOLDER_TAG, { id: ph.name })];
      };
      _WriteVisitor.prototype.serialize = function (nodes) {
          var _this = this;
          this._isInIcu = false;
          return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
      };
      return _WriteVisitor;
  }());
  // TODO(vicb): add error management (structure)
  // Extract messages as xml nodes from the xliff file
  var XliffParser = (function () {
      function XliffParser() {
          this._locale = null;
      }
      XliffParser.prototype.parse = function (xliff, url) {
          this._unitMlNodes = [];
          this._mlNodesByMsgId = {};
          var xml = new XmlParser().parse(xliff, url, false);
          this._errors = xml.errors;
          visitAll(this, xml.rootNodes, null);
          return {
              mlNodesByMsgId: this._mlNodesByMsgId,
              errors: this._errors,
              locale: this._locale,
          };
      };
      XliffParser.prototype.visitElement = function (element, context) {
          switch (element.name) {
              case _UNIT_TAG:
                  this._unitMlNodes = null;
                  var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                  if (!idAttr) {
                      this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
                  }
                  else {
                      var id = idAttr.value;
                      if (this._mlNodesByMsgId.hasOwnProperty(id)) {
                          this._addError(element, "Duplicated translations for msg " + id);
                      }
                      else {
                          visitAll(this, element.children, null);
                          if (this._unitMlNodes) {
                              this._mlNodesByMsgId[id] = this._unitMlNodes;
                          }
                          else {
                              this._addError(element, "Message " + id + " misses a translation");
                          }
                      }
                  }
                  break;
              case _SOURCE_TAG:
                  // ignore source message
                  break;
              case _TARGET_TAG:
                  this._unitMlNodes = element.children;
                  break;
              case _FILE_TAG:
                  var localeAttr = element.attrs.find(function (attr) { return attr.name === 'target-language'; });
                  if (localeAttr) {
                      this._locale = localeAttr.value;
                  }
                  visitAll(this, element.children, null);
                  break;
              default:
                  // TODO(vicb): assert file structure, xliff version
                  // For now only recurse on unhandled nodes
                  visitAll(this, element.children, null);
          }
      };
      XliffParser.prototype.visitAttribute = function (attribute, context) { };
      XliffParser.prototype.visitText = function (text, context) { };
      XliffParser.prototype.visitComment = function (comment, context) { };
      XliffParser.prototype.visitExpansion = function (expansion, context) { };
      XliffParser.prototype.visitExpansionCase = function (expansionCase, context) { };
      XliffParser.prototype._addError = function (node, message) {
          this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return XliffParser;
  }());
  // Convert ml nodes (xliff syntax) to i18n nodes
  var XmlToI18n = (function () {
      function XmlToI18n() {
      }
      XmlToI18n.prototype.convert = function (nodes) {
          this._errors = [];
          return {
              i18nNodes: visitAll(this, nodes),
              errors: this._errors,
          };
      };
      XmlToI18n.prototype.visitText = function (text, context) { return new Text$1(text.value, text.sourceSpan); };
      XmlToI18n.prototype.visitElement = function (el, context) {
          if (el.name === _PLACEHOLDER_TAG) {
              var nameAttr = el.attrs.find(function (attr) { return attr.name === 'id'; });
              if (nameAttr) {
                  return new Placeholder('', nameAttr.value, el.sourceSpan);
              }
              this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
          }
          else {
              this._addError(el, "Unexpected tag");
          }
      };
      XmlToI18n.prototype.visitExpansion = function (icu, context) { };
      XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) { };
      XmlToI18n.prototype.visitComment = function (comment, context) { };
      XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
      XmlToI18n.prototype._addError = function (node, message) {
          this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return XmlToI18n;
  }());
  function getCtypeForTag(tag) {
      switch (tag.toLowerCase()) {
          case 'br':
              return 'lb';
          case 'img':
              return 'image';
          default:
              return "x-" + tag;
      }
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$11 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var _MESSAGES_TAG = 'messagebundle';
  var _MESSAGE_TAG = 'msg';
  var _PLACEHOLDER_TAG$1 = 'ph';
  var _EXEMPLE_TAG = 'ex';
  var _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
  var Xmb = (function (_super) {
      __extends$11(Xmb, _super);
      function Xmb() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Xmb.prototype.write = function (messages, locale) {
          var exampleVisitor = new ExampleVisitor();
          var visitor = new _Visitor$2();
          var rootNode = new Tag(_MESSAGES_TAG);
          messages.forEach(function (message) {
              var attrs = { id: message.id };
              if (message.description) {
                  attrs['desc'] = message.description;
              }
              if (message.meaning) {
                  attrs['meaning'] = message.meaning;
              }
              rootNode.children.push(new CR(2), new Tag(_MESSAGE_TAG, attrs, visitor.serialize(message.nodes)));
          });
          rootNode.children.push(new CR());
          return serialize([
              new Declaration({ version: '1.0', encoding: 'UTF-8' }),
              new CR(),
              new Doctype(_MESSAGES_TAG, _DOCTYPE),
              new CR(),
              exampleVisitor.addDefaultExamples(rootNode),
              new CR(),
          ]);
      };
      Xmb.prototype.load = function (content, url) {
          throw new Error('Unsupported');
      };
      Xmb.prototype.digest = function (message) { return digest$1(message); };
      Xmb.prototype.createNameMapper = function (message) {
          return new SimplePlaceholderMapper(message, toPublicName);
      };
      return Xmb;
  }(Serializer));
  var _Visitor$2 = (function () {
      function _Visitor() {
      }
      _Visitor.prototype.visitText = function (text, context) { return [new Text$2(text.value)]; };
      _Visitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          var nodes = [];
          container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
          return nodes;
      };
      _Visitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          var nodes = [new Text$2("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
          Object.keys(icu.cases).forEach(function (c) {
              nodes.push.apply(nodes, [new Text$2(c + " {")].concat(icu.cases[c].visit(_this), [new Text$2("} ")]));
          });
          nodes.push(new Text$2("}"));
          return nodes;
      };
      _Visitor.prototype.visitTagPlaceholder = function (ph, context) {
          var startEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("<" + ph.tag + ">")]);
          var startTagPh = new Tag(_PLACEHOLDER_TAG$1, { name: ph.startName }, [startEx]);
          if (ph.isVoid) {
              // void tags have no children nor closing tags
              return [startTagPh];
          }
          var closeEx = new Tag(_EXEMPLE_TAG, {}, [new Text$2("</" + ph.tag + ">")]);
          var closeTagPh = new Tag(_PLACEHOLDER_TAG$1, { name: ph.closeName }, [closeEx]);
          return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
      };
      _Visitor.prototype.visitPlaceholder = function (ph, context) {
          return [new Tag(_PLACEHOLDER_TAG$1, { name: ph.name })];
      };
      _Visitor.prototype.visitIcuPlaceholder = function (ph, context) {
          return [new Tag(_PLACEHOLDER_TAG$1, { name: ph.name })];
      };
      _Visitor.prototype.serialize = function (nodes) {
          var _this = this;
          return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
      };
      return _Visitor;
  }());
  function digest$1(message) {
      return decimalDigest(message);
  }
  // TC requires at least one non-empty example on placeholders
  var ExampleVisitor = (function () {
      function ExampleVisitor() {
      }
      ExampleVisitor.prototype.addDefaultExamples = function (node) {
          node.visit(this);
          return node;
      };
      ExampleVisitor.prototype.visitTag = function (tag) {
          var _this = this;
          if (tag.name === _PLACEHOLDER_TAG$1) {
              if (!tag.children || tag.children.length == 0) {
                  var exText = new Text$2(tag.attrs['name'] || '...');
                  tag.children = [new Tag(_EXEMPLE_TAG, {}, [exText])];
              }
          }
          else if (tag.children) {
              tag.children.forEach(function (node) { return node.visit(_this); });
          }
      };
      ExampleVisitor.prototype.visitText = function (text) { };
      ExampleVisitor.prototype.visitDeclaration = function (decl) { };
      ExampleVisitor.prototype.visitDoctype = function (doctype) { };
      return ExampleVisitor;
  }());
  // XMB/XTB placeholders can only contain A-Z, 0-9 and _
  function toPublicName(internalName) {
      return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$12 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var _TRANSLATIONS_TAG = 'translationbundle';
  var _TRANSLATION_TAG = 'translation';
  var _PLACEHOLDER_TAG$2 = 'ph';
  var Xtb = (function (_super) {
      __extends$12(Xtb, _super);
      function Xtb() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Xtb.prototype.write = function (messages, locale) { throw new Error('Unsupported'); };
      Xtb.prototype.load = function (content, url) {
          // xtb to xml nodes
          var xtbParser = new XtbParser();
          var _a = xtbParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
          // xml nodes to i18n nodes
          var i18nNodesByMsgId = {};
          var converter = new XmlToI18n$1();
          // Because we should be able to load xtb files that rely on features not supported by angular,
          // we need to delay the conversion of html to i18n nodes so that non angular messages are not
          // converted
          Object.keys(msgIdToHtml).forEach(function (msgId) {
              var valueFn = function () {
                  var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, errors = _a.errors;
                  if (errors.length) {
                      throw new Error("xtb parse errors:\n" + errors.join('\n'));
                  }
                  return i18nNodes;
              };
              createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
          });
          if (errors.length) {
              throw new Error("xtb parse errors:\n" + errors.join('\n'));
          }
          return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
      };
      Xtb.prototype.digest = function (message) { return digest$1(message); };
      Xtb.prototype.createNameMapper = function (message) {
          return new SimplePlaceholderMapper(message, toPublicName);
      };
      return Xtb;
  }(Serializer));
  function createLazyProperty(messages, id, valueFn) {
      Object.defineProperty(messages, id, {
          configurable: true,
          enumerable: true,
          get: function () {
              var value = valueFn();
              Object.defineProperty(messages, id, { enumerable: true, value: value });
              return value;
          },
          set: function (_) { throw new Error('Could not overwrite an XTB translation'); },
      });
  }
  // Extract messages as xml nodes from the xtb file
  var XtbParser = (function () {
      function XtbParser() {
          this._locale = null;
      }
      XtbParser.prototype.parse = function (xtb, url) {
          this._bundleDepth = 0;
          this._msgIdToHtml = {};
          // We can not parse the ICU messages at this point as some messages might not originate
          // from Angular that could not be lex'd.
          var xml = new XmlParser().parse(xtb, url, false);
          this._errors = xml.errors;
          visitAll(this, xml.rootNodes);
          return {
              msgIdToHtml: this._msgIdToHtml,
              errors: this._errors,
              locale: this._locale,
          };
      };
      XtbParser.prototype.visitElement = function (element, context) {
          switch (element.name) {
              case _TRANSLATIONS_TAG:
                  this._bundleDepth++;
                  if (this._bundleDepth > 1) {
                      this._addError(element, "<" + _TRANSLATIONS_TAG + "> elements can not be nested");
                  }
                  var langAttr = element.attrs.find(function (attr) { return attr.name === 'lang'; });
                  if (langAttr) {
                      this._locale = langAttr.value;
                  }
                  visitAll(this, element.children, null);
                  this._bundleDepth--;
                  break;
              case _TRANSLATION_TAG:
                  var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                  if (!idAttr) {
                      this._addError(element, "<" + _TRANSLATION_TAG + "> misses the \"id\" attribute");
                  }
                  else {
                      var id = idAttr.value;
                      if (this._msgIdToHtml.hasOwnProperty(id)) {
                          this._addError(element, "Duplicated translations for msg " + id);
                      }
                      else {
                          var innerTextStart = element.startSourceSpan.end.offset;
                          var innerTextEnd = element.endSourceSpan.start.offset;
                          var content = element.startSourceSpan.start.file.content;
                          var innerText = content.slice(innerTextStart, innerTextEnd);
                          this._msgIdToHtml[id] = innerText;
                      }
                  }
                  break;
              default:
                  this._addError(element, 'Unexpected tag');
          }
      };
      XtbParser.prototype.visitAttribute = function (attribute, context) { };
      XtbParser.prototype.visitText = function (text, context) { };
      XtbParser.prototype.visitComment = function (comment, context) { };
      XtbParser.prototype.visitExpansion = function (expansion, context) { };
      XtbParser.prototype.visitExpansionCase = function (expansionCase, context) { };
      XtbParser.prototype._addError = function (node, message) {
          this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return XtbParser;
  }());
  // Convert ml nodes (xtb syntax) to i18n nodes
  var XmlToI18n$1 = (function () {
      function XmlToI18n() {
      }
      XmlToI18n.prototype.convert = function (message, url) {
          var xmlIcu = new XmlParser().parse(message, url, true);
          this._errors = xmlIcu.errors;
          var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
              [] :
              visitAll(this, xmlIcu.rootNodes);
          return {
              i18nNodes: i18nNodes,
              errors: this._errors,
          };
      };
      XmlToI18n.prototype.visitText = function (text, context) { return new Text$1(text.value, text.sourceSpan); };
      XmlToI18n.prototype.visitExpansion = function (icu, context) {
          var caseMap = {};
          visitAll(this, icu.cases).forEach(function (c) {
              caseMap[c.value] = new Container(c.nodes, icu.sourceSpan);
          });
          return new Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
      };
      XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
          return {
              value: icuCase.value,
              nodes: visitAll(this, icuCase.expression),
          };
      };
      XmlToI18n.prototype.visitElement = function (el, context) {
          if (el.name === _PLACEHOLDER_TAG$2) {
              var nameAttr = el.attrs.find(function (attr) { return attr.name === 'name'; });
              if (nameAttr) {
                  return new Placeholder('', nameAttr.value, el.sourceSpan);
              }
              this._addError(el, "<" + _PLACEHOLDER_TAG$2 + "> misses the \"name\" attribute");
          }
          else {
              this._addError(el, "Unexpected tag");
          }
      };
      XmlToI18n.prototype.visitComment = function (comment, context) { };
      XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
      XmlToI18n.prototype._addError = function (node, message) {
          this._errors.push(new I18nError(node.sourceSpan, message));
      };
      return XmlToI18n;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$13 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var HtmlParser = (function (_super) {
      __extends$13(HtmlParser, _super);
      function HtmlParser() {
          return _super.call(this, getHtmlTagDefinition) || this;
      }
      HtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
          if (parseExpansionForms === void 0) { parseExpansionForms = false; }
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          return _super.prototype.parse.call(this, source, url, parseExpansionForms, interpolationConfig);
      };
      return HtmlParser;
  }(Parser$1));
  HtmlParser.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  HtmlParser.ctorParameters = function () { return []; };

  /**
   * A container for translated messages
   */
  var TranslationBundle = (function () {
      function TranslationBundle(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console) {
          if (_i18nNodesByMsgId === void 0) { _i18nNodesByMsgId = {}; }
          if (missingTranslationStrategy === void 0) { missingTranslationStrategy = _angular_core.MissingTranslationStrategy.Warning; }
          this._i18nNodesByMsgId = _i18nNodesByMsgId;
          this.digest = digest;
          this.mapperFactory = mapperFactory;
          this._i18nToHtml = new I18nToHtmlVisitor(_i18nNodesByMsgId, locale, digest, mapperFactory, missingTranslationStrategy, console);
      }
      // Creates a `TranslationBundle` by parsing the given `content` with the `serializer`.
      TranslationBundle.load = function (content, url, serializer, missingTranslationStrategy, console) {
          var _a = serializer.load(content, url), locale = _a.locale, i18nNodesByMsgId = _a.i18nNodesByMsgId;
          var digestFn = function (m) { return serializer.digest(m); };
          var mapperFactory = function (m) { return serializer.createNameMapper(m); };
          return new TranslationBundle(i18nNodesByMsgId, locale, digestFn, mapperFactory, missingTranslationStrategy, console);
      };
      // Returns the translation as HTML nodes from the given source message.
      TranslationBundle.prototype.get = function (srcMsg) {
          var html = this._i18nToHtml.convert(srcMsg);
          if (html.errors.length) {
              throw new Error(html.errors.join('\n'));
          }
          return html.nodes;
      };
      TranslationBundle.prototype.has = function (srcMsg) { return this.digest(srcMsg) in this._i18nNodesByMsgId; };
      return TranslationBundle;
  }());
  var I18nToHtmlVisitor = (function () {
      function I18nToHtmlVisitor(_i18nNodesByMsgId, _locale, _digest, _mapperFactory, _missingTranslationStrategy, _console) {
          if (_i18nNodesByMsgId === void 0) { _i18nNodesByMsgId = {}; }
          this._i18nNodesByMsgId = _i18nNodesByMsgId;
          this._locale = _locale;
          this._digest = _digest;
          this._mapperFactory = _mapperFactory;
          this._missingTranslationStrategy = _missingTranslationStrategy;
          this._console = _console;
          this._contextStack = [];
          this._errors = [];
      }
      I18nToHtmlVisitor.prototype.convert = function (srcMsg) {
          this._contextStack.length = 0;
          this._errors.length = 0;
          // i18n to text
          var text = this._convertToText(srcMsg);
          // text to html
          var url = srcMsg.nodes[0].sourceSpan.start.file.url;
          var html = new HtmlParser().parse(text, url, true);
          return {
              nodes: html.rootNodes,
              errors: this._errors.concat(html.errors),
          };
      };
      I18nToHtmlVisitor.prototype.visitText = function (text, context) { return text.value; };
      I18nToHtmlVisitor.prototype.visitContainer = function (container, context) {
          var _this = this;
          return container.children.map(function (n) { return n.visit(_this); }).join('');
      };
      I18nToHtmlVisitor.prototype.visitIcu = function (icu, context) {
          var _this = this;
          var cases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
          // TODO(vicb): Once all format switch to using expression placeholders
          // we should throw when the placeholder is not in the source message
          var exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression) ?
              this._srcMsg.placeholders[icu.expression] :
              icu.expression;
          return "{" + exp + ", " + icu.type + ", " + cases.join(' ') + "}";
      };
      I18nToHtmlVisitor.prototype.visitPlaceholder = function (ph, context) {
          var phName = this._mapper(ph.name);
          if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
              return this._srcMsg.placeholders[phName];
          }
          if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
              return this._convertToText(this._srcMsg.placeholderToMessage[phName]);
          }
          this._addError(ph, "Unknown placeholder \"" + ph.name + "\"");
          return '';
      };
      // Loaded message contains only placeholders (vs tag and icu placeholders).
      // However when a translation can not be found, we need to serialize the source message
      // which can contain tag placeholders
      I18nToHtmlVisitor.prototype.visitTagPlaceholder = function (ph, context) {
          var _this = this;
          var tag = "" + ph.tag;
          var attrs = Object.keys(ph.attrs).map(function (name) { return name + "=\"" + ph.attrs[name] + "\""; }).join(' ');
          if (ph.isVoid) {
              return "<" + tag + " " + attrs + "/>";
          }
          var children = ph.children.map(function (c) { return c.visit(_this); }).join('');
          return "<" + tag + " " + attrs + ">" + children + "</" + tag + ">";
      };
      // Loaded message contains only placeholders (vs tag and icu placeholders).
      // However when a translation can not be found, we need to serialize the source message
      // which can contain tag placeholders
      I18nToHtmlVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
          // An ICU placeholder references the source message to be serialized
          return this._convertToText(this._srcMsg.placeholderToMessage[ph.name]);
      };
      /**
       * Convert a source message to a translated text string:
       * - text nodes are replaced with their translation,
       * - placeholders are replaced with their content,
       * - ICU nodes are converted to ICU expressions.
       */
      I18nToHtmlVisitor.prototype._convertToText = function (srcMsg) {
          var _this = this;
          var id = this._digest(srcMsg);
          var mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
          var nodes;
          this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
          this._srcMsg = srcMsg;
          if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
              // When there is a translation use its nodes as the source
              // And create a mapper to convert serialized placeholder names to internal names
              nodes = this._i18nNodesByMsgId[id];
              this._mapper = function (name) { return mapper ? mapper.toInternalName(name) : name; };
          }
          else {
              // When no translation has been found
              // - report an error / a warning / nothing,
              // - use the nodes from the original message
              // - placeholders are already internal and need no mapper
              if (this._missingTranslationStrategy === _angular_core.MissingTranslationStrategy.Error) {
                  var ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
                  this._addError(srcMsg.nodes[0], "Missing translation for message \"" + id + "\"" + ctx);
              }
              else if (this._console &&
                  this._missingTranslationStrategy === _angular_core.MissingTranslationStrategy.Warning) {
                  var ctx = this._locale ? " for locale \"" + this._locale + "\"" : '';
                  this._console.warn("Missing translation for message \"" + id + "\"" + ctx);
              }
              nodes = srcMsg.nodes;
              this._mapper = function (name) { return name; };
          }
          var text = nodes.map(function (node) { return node.visit(_this); }).join('');
          var context = this._contextStack.pop();
          this._srcMsg = context.msg;
          this._mapper = context.mapper;
          return text;
      };
      I18nToHtmlVisitor.prototype._addError = function (el, msg) {
          this._errors.push(new I18nError(el.sourceSpan, msg));
      };
      return I18nToHtmlVisitor;
  }());

  var I18NHtmlParser = (function () {
      function I18NHtmlParser(_htmlParser, translations, translationsFormat, missingTranslation, console) {
          if (missingTranslation === void 0) { missingTranslation = _angular_core.MissingTranslationStrategy.Warning; }
          this._htmlParser = _htmlParser;
          if (translations) {
              var serializer = createSerializer(translationsFormat);
              this._translationBundle =
                  TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
          }
      }
      I18NHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
          if (parseExpansionForms === void 0) { parseExpansionForms = false; }
          if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
          var parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
          if (!this._translationBundle) {
              // Do not enable i18n when no translation bundle is provided
              return parseResult;
          }
          if (parseResult.errors.length) {
              return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
          }
          return mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
      };
      return I18NHtmlParser;
  }());
  function createSerializer(format) {
      format = (format || 'xlf').toLowerCase();
      switch (format) {
          case 'xmb':
              return new Xmb();
          case 'xtb':
              return new Xtb();
          case 'xliff':
          case 'xlf':
          default:
              return new Xliff();
      }
  }

  var CORE = assetUrl('core');
  var VIEW_UTILS_MODULE_URL = assetUrl('core', 'linker/view_utils');
  var Identifiers = (function () {
      function Identifiers() {
      }
      return Identifiers;
  }());
  Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS = {
      name: 'ANALYZE_FOR_ENTRY_COMPONENTS',
      moduleUrl: CORE,
      runtime: _angular_core.ANALYZE_FOR_ENTRY_COMPONENTS
  };
  Identifiers.ElementRef = { name: 'ElementRef', moduleUrl: CORE, runtime: _angular_core.ElementRef };
  Identifiers.ViewContainerRef = { name: 'ViewContainerRef', moduleUrl: CORE, runtime: _angular_core.ViewContainerRef };
  Identifiers.ChangeDetectorRef = { name: 'ChangeDetectorRef', moduleUrl: CORE, runtime: _angular_core.ChangeDetectorRef };
  Identifiers.QueryList = { name: 'QueryList', moduleUrl: CORE, runtime: _angular_core.QueryList };
  Identifiers.TemplateRef = { name: 'TemplateRef', moduleUrl: CORE, runtime: _angular_core.TemplateRef };
  Identifiers.CodegenComponentFactoryResolver = {
      name: 'ɵCodegenComponentFactoryResolver',
      moduleUrl: CORE,
      runtime: _angular_core.ɵCodegenComponentFactoryResolver
  };
  Identifiers.ComponentFactoryResolver = {
      name: 'ComponentFactoryResolver',
      moduleUrl: CORE,
      runtime: _angular_core.ComponentFactoryResolver
  };
  Identifiers.ComponentFactory = { name: 'ComponentFactory', moduleUrl: CORE, runtime: _angular_core.ComponentFactory };
  Identifiers.ComponentRef = { name: 'ComponentRef', moduleUrl: CORE, runtime: _angular_core.ComponentRef };
  Identifiers.NgModuleFactory = { name: 'NgModuleFactory', moduleUrl: CORE, runtime: _angular_core.NgModuleFactory };
  Identifiers.NgModuleInjector = {
      name: 'ɵNgModuleInjector',
      moduleUrl: CORE,
      runtime: _angular_core.ɵNgModuleInjector,
  };
  Identifiers.RegisterModuleFactoryFn = {
      name: 'ɵregisterModuleFactory',
      moduleUrl: CORE,
      runtime: _angular_core.ɵregisterModuleFactory,
  };
  Identifiers.Injector = { name: 'Injector', moduleUrl: CORE, runtime: _angular_core.Injector };
  Identifiers.ViewEncapsulation = { name: 'ViewEncapsulation', moduleUrl: CORE, runtime: _angular_core.ViewEncapsulation };
  Identifiers.ChangeDetectionStrategy = {
      name: 'ChangeDetectionStrategy',
      moduleUrl: CORE,
      runtime: _angular_core.ChangeDetectionStrategy
  };
  Identifiers.SecurityContext = {
      name: 'SecurityContext',
      moduleUrl: CORE,
      runtime: _angular_core.SecurityContext,
  };
  Identifiers.LOCALE_ID = { name: 'LOCALE_ID', moduleUrl: CORE, runtime: _angular_core.LOCALE_ID };
  Identifiers.TRANSLATIONS_FORMAT = { name: 'TRANSLATIONS_FORMAT', moduleUrl: CORE, runtime: _angular_core.TRANSLATIONS_FORMAT };
  Identifiers.inlineInterpolate = { name: 'ɵinlineInterpolate', moduleUrl: CORE, runtime: _angular_core.ɵinlineInterpolate };
  Identifiers.interpolate = { name: 'ɵinterpolate', moduleUrl: CORE, runtime: _angular_core.ɵinterpolate };
  Identifiers.EMPTY_ARRAY = { name: 'ɵEMPTY_ARRAY', moduleUrl: CORE, runtime: _angular_core.ɵEMPTY_ARRAY };
  Identifiers.EMPTY_MAP = { name: 'ɵEMPTY_MAP', moduleUrl: CORE, runtime: _angular_core.ɵEMPTY_MAP };
  Identifiers.Renderer = { name: 'Renderer', moduleUrl: CORE, runtime: _angular_core.Renderer };
  Identifiers.viewDef = { name: 'ɵvid', moduleUrl: CORE, runtime: _angular_core.ɵvid };
  Identifiers.elementDef = { name: 'ɵeld', moduleUrl: CORE, runtime: _angular_core.ɵeld };
  Identifiers.anchorDef = { name: 'ɵand', moduleUrl: CORE, runtime: _angular_core.ɵand };
  Identifiers.textDef = { name: 'ɵted', moduleUrl: CORE, runtime: _angular_core.ɵted };
  Identifiers.directiveDef = { name: 'ɵdid', moduleUrl: CORE, runtime: _angular_core.ɵdid };
  Identifiers.providerDef = { name: 'ɵprd', moduleUrl: CORE, runtime: _angular_core.ɵprd };
  Identifiers.queryDef = { name: 'ɵqud', moduleUrl: CORE, runtime: _angular_core.ɵqud };
  Identifiers.pureArrayDef = { name: 'ɵpad', moduleUrl: CORE, runtime: _angular_core.ɵpad };
  Identifiers.pureObjectDef = { name: 'ɵpod', moduleUrl: CORE, runtime: _angular_core.ɵpod };
  Identifiers.purePipeDef = { name: 'ɵppd', moduleUrl: CORE, runtime: _angular_core.ɵppd };
  Identifiers.pipeDef = { name: 'ɵpid', moduleUrl: CORE, runtime: _angular_core.ɵpid };
  Identifiers.nodeValue = { name: 'ɵnov', moduleUrl: CORE, runtime: _angular_core.ɵnov };
  Identifiers.ngContentDef = { name: 'ɵncd', moduleUrl: CORE, runtime: _angular_core.ɵncd };
  Identifiers.unwrapValue = { name: 'ɵunv', moduleUrl: CORE, runtime: _angular_core.ɵunv };
  Identifiers.createRendererType2 = { name: 'ɵcrt', moduleUrl: CORE, runtime: _angular_core.ɵcrt };
  Identifiers.RendererType2 = {
      name: 'RendererType2',
      moduleUrl: CORE,
      // type only
      runtime: null
  };
  Identifiers.ViewDefinition = {
      name: 'ɵViewDefinition',
      moduleUrl: CORE,
      // type only
      runtime: null
  };
  Identifiers.createComponentFactory = { name: 'ɵccf', moduleUrl: CORE, runtime: _angular_core.ɵccf };
  function assetUrl(pkg, path, type) {
      if (path === void 0) { path = null; }
      if (type === void 0) { type = 'src'; }
      if (path == null) {
          return "@angular/" + pkg;
      }
      else {
          return "@angular/" + pkg + "/" + type + "/" + path;
      }
  }
  function resolveIdentifier(identifier) {
      var name = identifier.name;
      return _angular_core.ɵreflector.resolveIdentifier(name, identifier.moduleUrl, null, identifier.runtime);
  }
  function createIdentifier(identifier) {
      return { reference: resolveIdentifier(identifier) };
  }
  function identifierToken(identifier) {
      return { identifier: identifier };
  }
  function createIdentifierToken(identifier) {
      return identifierToken(createIdentifier(identifier));
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$14 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  // http://cldr.unicode.org/index/cldr-spec/plural-rules
  var PLURAL_CASES = ['zero', 'one', 'two', 'few', 'many', 'other'];
  /**
   * Expands special forms into elements.
   *
   * For example,
   *
   * ```
   * { messages.length, plural,
   *   =0 {zero}
   *   =1 {one}
   *   other {more than one}
   * }
   * ```
   *
   * will be expanded into
   *
   * ```
   * <ng-container [ngPlural]="messages.length">
   *   <ng-template ngPluralCase="=0">zero</ng-template>
   *   <ng-template ngPluralCase="=1">one</ng-template>
   *   <ng-template ngPluralCase="other">more than one</ng-template>
   * </ng-container>
   * ```
   */
  function expandNodes(nodes) {
      var expander = new _Expander();
      return new ExpansionResult(visitAll(expander, nodes), expander.isExpanded, expander.errors);
  }
  var ExpansionResult = (function () {
      function ExpansionResult(nodes, expanded, errors) {
          this.nodes = nodes;
          this.expanded = expanded;
          this.errors = errors;
      }
      return ExpansionResult;
  }());
  var ExpansionError = (function (_super) {
      __extends$14(ExpansionError, _super);
      function ExpansionError(span, errorMsg) {
          return _super.call(this, span, errorMsg) || this;
      }
      return ExpansionError;
  }(ParseError));
  /**
   * Expand expansion forms (plural, select) to directives
   *
   * @internal
   */
  var _Expander = (function () {
      function _Expander() {
          this.isExpanded = false;
          this.errors = [];
      }
      _Expander.prototype.visitElement = function (element, context) {
          return new Element(element.name, element.attrs, visitAll(this, element.children), element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
      };
      _Expander.prototype.visitAttribute = function (attribute, context) { return attribute; };
      _Expander.prototype.visitText = function (text, context) { return text; };
      _Expander.prototype.visitComment = function (comment, context) { return comment; };
      _Expander.prototype.visitExpansion = function (icu, context) {
          this.isExpanded = true;
          return icu.type == 'plural' ? _expandPluralForm(icu, this.errors) :
              _expandDefaultForm(icu, this.errors);
      };
      _Expander.prototype.visitExpansionCase = function (icuCase, context) {
          throw new Error('Should not be reached');
      };
      return _Expander;
  }());
  // Plural forms are expanded to `NgPlural` and `NgPluralCase`s
  function _expandPluralForm(ast, errors) {
      var children = ast.cases.map(function (c) {
          if (PLURAL_CASES.indexOf(c.value) == -1 && !c.value.match(/^=\d+$/)) {
              errors.push(new ExpansionError(c.valueSourceSpan, "Plural cases should be \"=<number>\" or one of " + PLURAL_CASES.join(", ")));
          }
          var expansionResult = expandNodes(c.expression);
          errors.push.apply(errors, expansionResult.errors);
          return new Element("ng-template", [new Attribute$1('ngPluralCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
      });
      var switchAttr = new Attribute$1('[ngPlural]', ast.switchValue, ast.switchValueSourceSpan);
      return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
  }
  // ICU messages (excluding plural form) are expanded to `NgSwitch`  and `NgSwitychCase`s
  function _expandDefaultForm(ast, errors) {
      var children = ast.cases.map(function (c) {
          var expansionResult = expandNodes(c.expression);
          errors.push.apply(errors, expansionResult.errors);
          if (c.value === 'other') {
              // other is the default case when no values match
              return new Element("ng-template", [new Attribute$1('ngSwitchDefault', '', c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
          }
          return new Element("ng-template", [new Attribute$1('ngSwitchCase', "" + c.value, c.valueSourceSpan)], expansionResult.nodes, c.sourceSpan, c.sourceSpan, c.sourceSpan);
      });
      var switchAttr = new Attribute$1('[ngSwitch]', ast.switchValue, ast.switchValueSourceSpan);
      return new Element('ng-container', [switchAttr], children, ast.sourceSpan, ast.sourceSpan, ast.sourceSpan);
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$15 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ProviderError = (function (_super) {
      __extends$15(ProviderError, _super);
      function ProviderError(message, span) {
          return _super.call(this, span, message) || this;
      }
      return ProviderError;
  }(ParseError));
  var ProviderViewContext = (function () {
      function ProviderViewContext(component, sourceSpan) {
          var _this = this;
          this.component = component;
          this.sourceSpan = sourceSpan;
          this.errors = [];
          this.viewQueries = _getViewQueries(component);
          this.viewProviders = new Map();
          component.viewProviders.forEach(function (provider) {
              if (_this.viewProviders.get(tokenReference(provider.token)) == null) {
                  _this.viewProviders.set(tokenReference(provider.token), true);
              }
          });
      }
      return ProviderViewContext;
  }());
  var ProviderElementContext = (function () {
      function ProviderElementContext(viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, isTemplate, contentQueryStartId, _sourceSpan) {
          var _this = this;
          this.viewContext = viewContext;
          this._parent = _parent;
          this._isViewRoot = _isViewRoot;
          this._directiveAsts = _directiveAsts;
          this._sourceSpan = _sourceSpan;
          this._transformedProviders = new Map();
          this._seenProviders = new Map();
          this._hasViewContainer = false;
          this._queriedTokens = new Map();
          this._attrs = {};
          attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
          var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
          this._allProviders =
              _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, viewContext.errors);
          this._contentQueries = _getContentQueries(contentQueryStartId, directivesMeta);
          Array.from(this._allProviders.values()).forEach(function (provider) {
              _this._addQueryReadsTo(provider.token, provider.token, _this._queriedTokens);
          });
          if (isTemplate) {
              var templateRefId = createIdentifierToken(Identifiers.TemplateRef);
              this._addQueryReadsTo(templateRefId, templateRefId, this._queriedTokens);
          }
          refs.forEach(function (refAst) {
              var defaultQueryValue = refAst.value || createIdentifierToken(Identifiers.ElementRef);
              _this._addQueryReadsTo({ value: refAst.name }, defaultQueryValue, _this._queriedTokens);
          });
          if (this._queriedTokens.get(resolveIdentifier(Identifiers.ViewContainerRef))) {
              this._hasViewContainer = true;
          }
          // create the providers that we know are eager first
          Array.from(this._allProviders.values()).forEach(function (provider) {
              var eager = provider.eager || _this._queriedTokens.get(tokenReference(provider.token));
              if (eager) {
                  _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
              }
          });
      }
      ProviderElementContext.prototype.afterElement = function () {
          var _this = this;
          // collect lazy providers
          Array.from(this._allProviders.values()).forEach(function (provider) {
              _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
          });
      };
      Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
          get: function () {
              return Array.from(this._transformedProviders.values());
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
          get: function () {
              var sortedProviderTypes = this.transformProviders.map(function (provider) { return provider.token.identifier; });
              var sortedDirectives = this._directiveAsts.slice();
              sortedDirectives.sort(function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                  sortedProviderTypes.indexOf(dir2.directive.type); });
              return sortedDirectives;
          },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
          get: function () { return this._hasViewContainer; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(ProviderElementContext.prototype, "queryMatches", {
          get: function () {
              var allMatches = [];
              this._queriedTokens.forEach(function (matches) { allMatches.push.apply(allMatches, matches); });
              return allMatches;
          },
          enumerable: true,
          configurable: true
      });
      ProviderElementContext.prototype._addQueryReadsTo = function (token, defaultValue, queryReadTokens) {
          this._getQueriesFor(token).forEach(function (query) {
              var queryValue = query.meta.read || defaultValue;
              var tokenRef = tokenReference(queryValue);
              var queryMatches = queryReadTokens.get(tokenRef);
              if (!queryMatches) {
                  queryMatches = [];
                  queryReadTokens.set(tokenRef, queryMatches);
              }
              queryMatches.push({ queryId: query.queryId, value: queryValue });
          });
      };
      ProviderElementContext.prototype._getQueriesFor = function (token) {
          var result = [];
          var currentEl = this;
          var distance = 0;
          var queries;
          while (currentEl !== null) {
              queries = currentEl._contentQueries.get(tokenReference(token));
              if (queries) {
                  result.push.apply(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
              }
              if (currentEl._directiveAsts.length > 0) {
                  distance++;
              }
              currentEl = currentEl._parent;
          }
          queries = this.viewContext.viewQueries.get(tokenReference(token));
          if (queries) {
              result.push.apply(result, queries);
          }
          return result;
      };
      ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
          var _this = this;
          var resolvedProvider = this._allProviders.get(tokenReference(token));
          if (!resolvedProvider || ((requestingProviderType === exports.ProviderAstType.Directive ||
              requestingProviderType === exports.ProviderAstType.PublicService) &&
              resolvedProvider.providerType === exports.ProviderAstType.PrivateService) ||
              ((requestingProviderType === exports.ProviderAstType.PrivateService ||
                  requestingProviderType === exports.ProviderAstType.PublicService) &&
                  resolvedProvider.providerType === exports.ProviderAstType.Builtin)) {
              return null;
          }
          var transformedProviderAst = this._transformedProviders.get(tokenReference(token));
          if (transformedProviderAst) {
              return transformedProviderAst;
          }
          if (this._seenProviders.get(tokenReference(token)) != null) {
              this.viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), this._sourceSpan));
              return null;
          }
          this._seenProviders.set(tokenReference(token), true);
          var transformedProviders = resolvedProvider.providers.map(function (provider) {
              var transformedUseValue = provider.useValue;
              var transformedUseExisting = provider.useExisting;
              var transformedDeps;
              if (provider.useExisting != null) {
                  var existingDiDep = _this._getDependency(resolvedProvider.providerType, { token: provider.useExisting }, eager);
                  if (existingDiDep.token != null) {
                      transformedUseExisting = existingDiDep.token;
                  }
                  else {
                      transformedUseExisting = null;
                      transformedUseValue = existingDiDep.value;
                  }
              }
              else if (provider.useFactory) {
                  var deps = provider.deps || provider.useFactory.diDeps;
                  transformedDeps =
                      deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
              }
              else if (provider.useClass) {
                  var deps = provider.deps || provider.useClass.diDeps;
                  transformedDeps =
                      deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
              }
              return _transformProvider(provider, {
                  useExisting: transformedUseExisting,
                  useValue: transformedUseValue,
                  deps: transformedDeps
              });
          });
          transformedProviderAst =
              _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
          this._transformedProviders.set(tokenReference(token), transformedProviderAst);
          return transformedProviderAst;
      };
      ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
          if (eager === void 0) { eager = null; }
          if (dep.isAttribute) {
              var attrValue = this._attrs[dep.token.value];
              return { isValue: true, value: attrValue == null ? null : attrValue };
          }
          if (dep.token != null) {
              // access builtints
              if ((requestingProviderType === exports.ProviderAstType.Directive ||
                  requestingProviderType === exports.ProviderAstType.Component)) {
                  if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Renderer) ||
                      tokenReference(dep.token) === resolveIdentifier(Identifiers.ElementRef) ||
                      tokenReference(dep.token) === resolveIdentifier(Identifiers.ChangeDetectorRef) ||
                      tokenReference(dep.token) === resolveIdentifier(Identifiers.TemplateRef)) {
                      return dep;
                  }
                  if (tokenReference(dep.token) === resolveIdentifier(Identifiers.ViewContainerRef)) {
                      this._hasViewContainer = true;
                  }
              }
              // access the injector
              if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector)) {
                  return dep;
              }
              // access providers
              if (this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager) != null) {
                  return dep;
              }
          }
          return null;
      };
      ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
          if (eager === void 0) { eager = null; }
          var currElement = this;
          var currEager = eager;
          var result = null;
          if (!dep.isSkipSelf) {
              result = this._getLocalDependency(requestingProviderType, dep, eager);
          }
          if (dep.isSelf) {
              if (!result && dep.isOptional) {
                  result = { isValue: true, value: null };
              }
          }
          else {
              // check parent elements
              while (!result && currElement._parent) {
                  var prevElement = currElement;
                  currElement = currElement._parent;
                  if (prevElement._isViewRoot) {
                      currEager = false;
                  }
                  result = currElement._getLocalDependency(exports.ProviderAstType.PublicService, dep, currEager);
              }
              // check @Host restriction
              if (!result) {
                  if (!dep.isHost || this.viewContext.component.isHost ||
                      this.viewContext.component.type.reference === tokenReference(dep.token) ||
                      this.viewContext.viewProviders.get(tokenReference(dep.token)) != null) {
                      result = dep;
                  }
                  else {
                      result = dep.isOptional ? result = { isValue: true, value: null } : null;
                  }
              }
          }
          if (!result) {
              this.viewContext.errors.push(new ProviderError("No provider for " + tokenName(dep.token), this._sourceSpan));
          }
          return result;
      };
      return ProviderElementContext;
  }());
  var NgModuleProviderAnalyzer = (function () {
      function NgModuleProviderAnalyzer(ngModule, extraProviders, sourceSpan) {
          var _this = this;
          this._transformedProviders = new Map();
          this._seenProviders = new Map();
          this._errors = [];
          this._allProviders = new Map();
          ngModule.transitiveModule.modules.forEach(function (ngModuleType) {
              var ngModuleProvider = { token: { identifier: ngModuleType }, useClass: ngModuleType };
              _resolveProviders([ngModuleProvider], exports.ProviderAstType.PublicService, true, sourceSpan, _this._errors, _this._allProviders);
          });
          _resolveProviders(ngModule.transitiveModule.providers.map(function (entry) { return entry.provider; }).concat(extraProviders), exports.ProviderAstType.PublicService, false, sourceSpan, this._errors, this._allProviders);
      }
      NgModuleProviderAnalyzer.prototype.parse = function () {
          var _this = this;
          Array.from(this._allProviders.values()).forEach(function (provider) {
              _this._getOrCreateLocalProvider(provider.token, provider.eager);
          });
          if (this._errors.length > 0) {
              var errorString = this._errors.join('\n');
              throw new Error("Provider parse errors:\n" + errorString);
          }
          return Array.from(this._transformedProviders.values());
      };
      NgModuleProviderAnalyzer.prototype._getOrCreateLocalProvider = function (token, eager) {
          var _this = this;
          var resolvedProvider = this._allProviders.get(tokenReference(token));
          if (!resolvedProvider) {
              return null;
          }
          var transformedProviderAst = this._transformedProviders.get(tokenReference(token));
          if (transformedProviderAst) {
              return transformedProviderAst;
          }
          if (this._seenProviders.get(tokenReference(token)) != null) {
              this._errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + tokenName(token), resolvedProvider.sourceSpan));
              return null;
          }
          this._seenProviders.set(tokenReference(token), true);
          var transformedProviders = resolvedProvider.providers.map(function (provider) {
              var transformedUseValue = provider.useValue;
              var transformedUseExisting = provider.useExisting;
              var transformedDeps;
              if (provider.useExisting != null) {
                  var existingDiDep = _this._getDependency({ token: provider.useExisting }, eager, resolvedProvider.sourceSpan);
                  if (existingDiDep.token != null) {
                      transformedUseExisting = existingDiDep.token;
                  }
                  else {
                      transformedUseExisting = null;
                      transformedUseValue = existingDiDep.value;
                  }
              }
              else if (provider.useFactory) {
                  var deps = provider.deps || provider.useFactory.diDeps;
                  transformedDeps =
                      deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
              }
              else if (provider.useClass) {
                  var deps = provider.deps || provider.useClass.diDeps;
                  transformedDeps =
                      deps.map(function (dep) { return _this._getDependency(dep, eager, resolvedProvider.sourceSpan); });
              }
              return _transformProvider(provider, {
                  useExisting: transformedUseExisting,
                  useValue: transformedUseValue,
                  deps: transformedDeps
              });
          });
          transformedProviderAst =
              _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
          this._transformedProviders.set(tokenReference(token), transformedProviderAst);
          return transformedProviderAst;
      };
      NgModuleProviderAnalyzer.prototype._getDependency = function (dep, eager, requestorSourceSpan) {
          if (eager === void 0) { eager = null; }
          var foundLocal = false;
          if (!dep.isSkipSelf && dep.token != null) {
              // access the injector
              if (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector) ||
                  tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver)) {
                  foundLocal = true;
              }
              else if (this._getOrCreateLocalProvider(dep.token, eager) != null) {
                  foundLocal = true;
              }
          }
          var result = dep;
          if (dep.isSelf && !foundLocal) {
              if (dep.isOptional) {
                  result = { isValue: true, value: null };
              }
              else {
                  this._errors.push(new ProviderError("No provider for " + tokenName(dep.token), requestorSourceSpan));
              }
          }
          return result;
      };
      return NgModuleProviderAnalyzer;
  }());
  function _transformProvider(provider, _a) {
      var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
      return {
          token: provider.token,
          useClass: provider.useClass,
          useExisting: useExisting,
          useFactory: provider.useFactory,
          useValue: useValue,
          deps: deps,
          multi: provider.multi
      };
  }
  function _transformProviderAst(provider, _a) {
      var eager = _a.eager, providers = _a.providers;
      return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.lifecycleHooks, provider.sourceSpan);
  }
  function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
      var providersByToken = new Map();
      directives.forEach(function (directive) {
          var dirProvider = { token: { identifier: directive.type }, useClass: directive.type };
          _resolveProviders([dirProvider], directive.isComponent ? exports.ProviderAstType.Component : exports.ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
      });
      // Note: directives need to be able to overwrite providers of a component!
      var directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
      directivesWithComponentFirst.forEach(function (directive) {
          _resolveProviders(directive.providers, exports.ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
          _resolveProviders(directive.viewProviders, exports.ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
      });
      return providersByToken;
  }
  function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
      providers.forEach(function (provider) {
          var resolvedProvider = targetProvidersByToken.get(tokenReference(provider.token));
          if (resolvedProvider != null && !!resolvedProvider.multiProvider !== !!provider.multi) {
              targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + tokenName(resolvedProvider.token), sourceSpan));
          }
          if (!resolvedProvider) {
              var lifecycleHooks = provider.token.identifier &&
                  provider.token.identifier.lifecycleHooks ?
                  provider.token.identifier.lifecycleHooks :
                  [];
              resolvedProvider = new ProviderAst(provider.token, provider.multi, eager || lifecycleHooks.length > 0, [provider], providerType, lifecycleHooks, sourceSpan);
              targetProvidersByToken.set(tokenReference(provider.token), resolvedProvider);
          }
          else {
              if (!provider.multi) {
                  resolvedProvider.providers.length = 0;
              }
              resolvedProvider.providers.push(provider);
          }
      });
  }
  function _getViewQueries(component) {
      // Note: queries start with id 1 so we can use the number in a Bloom filter!
      var viewQueryId = 1;
      var viewQueries = new Map();
      if (component.viewQueries) {
          component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, { meta: query, queryId: viewQueryId++ }); });
      }
      return viewQueries;
  }
  function _getContentQueries(contentQueryStartId, directives) {
      var contentQueryId = contentQueryStartId;
      var contentQueries = new Map();
      directives.forEach(function (directive, directiveIndex) {
          if (directive.queries) {
              directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, { meta: query, queryId: contentQueryId++ }); });
          }
      });
      return contentQueries;
  }
  function _addQueryToTokenMap(map, query) {
      query.meta.selectors.forEach(function (token) {
          var entry = map.get(tokenReference(token));
          if (!entry) {
              entry = [];
              map.set(tokenReference(token), entry);
          }
          entry.push(query);
      });
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var ElementSchemaRegistry = (function () {
      function ElementSchemaRegistry() {
      }
      return ElementSchemaRegistry;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var StyleWithImports = (function () {
      function StyleWithImports(style, styleUrls) {
          this.style = style;
          this.styleUrls = styleUrls;
      }
      return StyleWithImports;
  }());
  function isStyleUrlResolvable(url) {
      if (url == null || url.length === 0 || url[0] == '/')
          return false;
      var schemeMatch = url.match(URL_WITH_SCHEMA_REGEXP);
      return schemeMatch === null || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
  }
  /**
   * Rewrites stylesheets by resolving and removing the @import urls that
   * are either relative or don't have a `package:` scheme
   */
  function extractStyleUrls(resolver, baseUrl, cssText) {
      var foundUrls = [];
      var modifiedCssText = cssText.replace(CSS_COMMENT_REGEXP, '').replace(CSS_IMPORT_REGEXP, function () {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              m[_i] = arguments[_i];
          }
          var url = m[1] || m[2];
          if (!isStyleUrlResolvable(url)) {
              // Do not attempt to resolve non-package absolute URLs with URI scheme
              return m[0];
          }
          foundUrls.push(resolver.resolve(baseUrl, url));
          return '';
      });
      return new StyleWithImports(modifiedCssText, foundUrls);
  }
  var CSS_IMPORT_REGEXP = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
  var CSS_COMMENT_REGEXP = /\/\*.+?\*\//g;
  var URL_WITH_SCHEMA_REGEXP = /^([^:/?#]+):/;

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$16 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var PROPERTY_PARTS_SEPARATOR = '.';
  var ATTRIBUTE_PREFIX = 'attr';
  var CLASS_PREFIX = 'class';
  var STYLE_PREFIX = 'style';
  var ANIMATE_PROP_PREFIX = 'animate-';
  var BoundPropertyType;
  (function (BoundPropertyType) {
      BoundPropertyType[BoundPropertyType["DEFAULT"] = 0] = "DEFAULT";
      BoundPropertyType[BoundPropertyType["LITERAL_ATTR"] = 1] = "LITERAL_ATTR";
      BoundPropertyType[BoundPropertyType["ANIMATION"] = 2] = "ANIMATION";
  })(BoundPropertyType || (BoundPropertyType = {}));
  /**
   * Represents a parsed property.
   */
  var BoundProperty = (function () {
      function BoundProperty(name, expression, type, sourceSpan) {
          this.name = name;
          this.expression = expression;
          this.type = type;
          this.sourceSpan = sourceSpan;
      }
      Object.defineProperty(BoundProperty.prototype, "isLiteral", {
          get: function () { return this.type === BoundPropertyType.LITERAL_ATTR; },
          enumerable: true,
          configurable: true
      });
      Object.defineProperty(BoundProperty.prototype, "isAnimation", {
          get: function () { return this.type === BoundPropertyType.ANIMATION; },
          enumerable: true,
          configurable: true
      });
      return BoundProperty;
  }());
  /**
   * Parses bindings in templates and in the directive host area.
   */
  var BindingParser = (function () {
      function BindingParser(_exprParser, _interpolationConfig, _schemaRegistry, pipes, _targetErrors) {
          var _this = this;
          this._exprParser = _exprParser;
          this._interpolationConfig = _interpolationConfig;
          this._schemaRegistry = _schemaRegistry;
          this._targetErrors = _targetErrors;
          this.pipesByName = new Map();
          this._usedPipes = new Map();
          pipes.forEach(function (pipe) { return _this.pipesByName.set(pipe.name, pipe); });
      }
      BindingParser.prototype.getUsedPipes = function () { return Array.from(this._usedPipes.values()); };
      BindingParser.prototype.createDirectiveHostPropertyAsts = function (dirMeta, elementSelector, sourceSpan) {
          var _this = this;
          if (dirMeta.hostProperties) {
              var boundProps_1 = [];
              Object.keys(dirMeta.hostProperties).forEach(function (propName) {
                  var expression = dirMeta.hostProperties[propName];
                  if (typeof expression === 'string') {
                      _this.parsePropertyBinding(propName, expression, true, sourceSpan, [], boundProps_1);
                  }
                  else {
                      _this._reportError("Value of the host property binding \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                  }
              });
              return boundProps_1.map(function (prop) { return _this.createElementPropertyAst(elementSelector, prop); });
          }
      };
      BindingParser.prototype.createDirectiveHostEventAsts = function (dirMeta, sourceSpan) {
          var _this = this;
          if (dirMeta.hostListeners) {
              var targetEventAsts_1 = [];
              Object.keys(dirMeta.hostListeners).forEach(function (propName) {
                  var expression = dirMeta.hostListeners[propName];
                  if (typeof expression === 'string') {
                      _this.parseEvent(propName, expression, sourceSpan, [], targetEventAsts_1);
                  }
                  else {
                      _this._reportError("Value of the host listener \"" + propName + "\" needs to be a string representing an expression but got \"" + expression + "\" (" + typeof expression + ")", sourceSpan);
                  }
              });
              return targetEventAsts_1;
          }
      };
      BindingParser.prototype.parseInterpolation = function (value, sourceSpan) {
          var sourceInfo = sourceSpan.start.toString();
          try {
              var ast = this._exprParser.parseInterpolation(value, sourceInfo, this._interpolationConfig);
              if (ast)
                  this._reportExpressionParserErrors(ast.errors, sourceSpan);
              this._checkPipes(ast, sourceSpan);
              return ast;
          }
          catch (e) {
              this._reportError("" + e, sourceSpan);
              return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
          }
      };
      BindingParser.prototype.parseInlineTemplateBinding = function (prefixToken, value, sourceSpan, targetMatchableAttrs, targetProps, targetVars) {
          var bindings = this._parseTemplateBindings(prefixToken, value, sourceSpan);
          for (var i = 0; i < bindings.length; i++) {
              var binding = bindings[i];
              if (binding.keyIsVar) {
                  targetVars.push(new VariableAst(binding.key, binding.name, sourceSpan));
              }
              else if (binding.expression) {
                  this._parsePropertyAst(binding.key, binding.expression, sourceSpan, targetMatchableAttrs, targetProps);
              }
              else {
                  targetMatchableAttrs.push([binding.key, '']);
                  this.parseLiteralAttr(binding.key, null, sourceSpan, targetMatchableAttrs, targetProps);
              }
          }
      };
      BindingParser.prototype._parseTemplateBindings = function (prefixToken, value, sourceSpan) {
          var _this = this;
          var sourceInfo = sourceSpan.start.toString();
          try {
              var bindingsResult = this._exprParser.parseTemplateBindings(prefixToken, value, sourceInfo);
              this._reportExpressionParserErrors(bindingsResult.errors, sourceSpan);
              bindingsResult.templateBindings.forEach(function (binding) {
                  if (binding.expression) {
                      _this._checkPipes(binding.expression, sourceSpan);
                  }
              });
              bindingsResult.warnings.forEach(function (warning) { _this._reportError(warning, sourceSpan, exports.ParseErrorLevel.WARNING); });
              return bindingsResult.templateBindings;
          }
          catch (e) {
              this._reportError("" + e, sourceSpan);
              return [];
          }
      };
      BindingParser.prototype.parseLiteralAttr = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
          if (_isAnimationLabel(name)) {
              name = name.substring(1);
              if (value) {
                  this._reportError("Assigning animation triggers via @prop=\"exp\" attributes with an expression is invalid." +
                      " Use property bindings (e.g. [@prop]=\"exp\") or use an attribute without a value (e.g. @prop) instead.", sourceSpan, exports.ParseErrorLevel.FATAL);
              }
              this._parseAnimation(name, value, sourceSpan, targetMatchableAttrs, targetProps);
          }
          else {
              targetProps.push(new BoundProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), BoundPropertyType.LITERAL_ATTR, sourceSpan));
          }
      };
      BindingParser.prototype.parsePropertyBinding = function (name, expression, isHost, sourceSpan, targetMatchableAttrs, targetProps) {
          var isAnimationProp = false;
          if (name.startsWith(ANIMATE_PROP_PREFIX)) {
              isAnimationProp = true;
              name = name.substring(ANIMATE_PROP_PREFIX.length);
          }
          else if (_isAnimationLabel(name)) {
              isAnimationProp = true;
              name = name.substring(1);
          }
          if (isAnimationProp) {
              this._parseAnimation(name, expression, sourceSpan, targetMatchableAttrs, targetProps);
          }
          else {
              this._parsePropertyAst(name, this._parseBinding(expression, isHost, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
          }
      };
      BindingParser.prototype.parsePropertyInterpolation = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
          var expr = this.parseInterpolation(value, sourceSpan);
          if (expr) {
              this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
              return true;
          }
          return false;
      };
      BindingParser.prototype._parsePropertyAst = function (name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
          targetMatchableAttrs.push([name, ast.source]);
          targetProps.push(new BoundProperty(name, ast, BoundPropertyType.DEFAULT, sourceSpan));
      };
      BindingParser.prototype._parseAnimation = function (name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
          // This will occur when a @trigger is not paired with an expression.
          // For animations it is valid to not have an expression since */void
          // states will be applied by angular when the element is attached/detached
          var ast = this._parseBinding(expression || 'null', false, sourceSpan);
          targetMatchableAttrs.push([name, ast.source]);
          targetProps.push(new BoundProperty(name, ast, BoundPropertyType.ANIMATION, sourceSpan));
      };
      BindingParser.prototype._parseBinding = function (value, isHostBinding, sourceSpan) {
          var sourceInfo = sourceSpan.start.toString();
          try {
              var ast = isHostBinding ?
                  this._exprParser.parseSimpleBinding(value, sourceInfo, this._interpolationConfig) :
                  this._exprParser.parseBinding(value, sourceInfo, this._interpolationConfig);
              if (ast)
                  this._reportExpressionParserErrors(ast.errors, sourceSpan);
              this._checkPipes(ast, sourceSpan);
              return ast;
          }
          catch (e) {
              this._reportError("" + e, sourceSpan);
              return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
          }
      };
      BindingParser.prototype.createElementPropertyAst = function (elementSelector, boundProp) {
          if (boundProp.isAnimation) {
              return new BoundElementPropertyAst(boundProp.name, exports.PropertyBindingType.Animation, _angular_core.SecurityContext.NONE, boundProp.expression, null, boundProp.sourceSpan);
          }
          var unit = null;
          var bindingType;
          var boundPropertyName = null;
          var parts = boundProp.name.split(PROPERTY_PARTS_SEPARATOR);
          var securityContexts;
          // Check check for special cases (prefix style, attr, class)
          if (parts.length > 1) {
              if (parts[0] == ATTRIBUTE_PREFIX) {
                  boundPropertyName = parts[1];
                  this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, true);
                  securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, true);
                  var nsSeparatorIdx = boundPropertyName.indexOf(':');
                  if (nsSeparatorIdx > -1) {
                      var ns = boundPropertyName.substring(0, nsSeparatorIdx);
                      var name_1 = boundPropertyName.substring(nsSeparatorIdx + 1);
                      boundPropertyName = mergeNsAndName(ns, name_1);
                  }
                  bindingType = exports.PropertyBindingType.Attribute;
              }
              else if (parts[0] == CLASS_PREFIX) {
                  boundPropertyName = parts[1];
                  bindingType = exports.PropertyBindingType.Class;
                  securityContexts = [_angular_core.SecurityContext.NONE];
              }
              else if (parts[0] == STYLE_PREFIX) {
                  unit = parts.length > 2 ? parts[2] : null;
                  boundPropertyName = parts[1];
                  bindingType = exports.PropertyBindingType.Style;
                  securityContexts = [_angular_core.SecurityContext.STYLE];
              }
          }
          // If not a special case, use the full property name
          if (boundPropertyName === null) {
              boundPropertyName = this._schemaRegistry.getMappedPropName(boundProp.name);
              securityContexts = calcPossibleSecurityContexts(this._schemaRegistry, elementSelector, boundPropertyName, false);
              bindingType = exports.PropertyBindingType.Property;
              this._validatePropertyOrAttributeName(boundPropertyName, boundProp.sourceSpan, false);
          }
          return new BoundElementPropertyAst(boundPropertyName, bindingType, securityContexts[0], boundProp.expression, unit, boundProp.sourceSpan);
      };
      BindingParser.prototype.parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
          if (_isAnimationLabel(name)) {
              name = name.substr(1);
              this._parseAnimationEvent(name, expression, sourceSpan, targetEvents);
          }
          else {
              this._parseEvent(name, expression, sourceSpan, targetMatchableAttrs, targetEvents);
          }
      };
      BindingParser.prototype._parseAnimationEvent = function (name, expression, sourceSpan, targetEvents) {
          var matches = splitAtPeriod(name, [name, '']);
          var eventName = matches[0];
          var phase = matches[1].toLowerCase();
          if (phase) {
              switch (phase) {
                  case 'start':
                  case 'done':
                      var ast = this._parseAction(expression, sourceSpan);
                      targetEvents.push(new BoundEventAst(eventName, null, phase, ast, sourceSpan));
                      break;
                  default:
                      this._reportError("The provided animation output phase value \"" + phase + "\" for \"@" + eventName + "\" is not supported (use start or done)", sourceSpan);
                      break;
              }
          }
          else {
              this._reportError("The animation trigger output event (@" + eventName + ") is missing its phase value name (start or done are currently supported)", sourceSpan);
          }
      };
      BindingParser.prototype._parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
          // long format: 'target: eventName'
          var _a = splitAtColon(name, [null, name]), target = _a[0], eventName = _a[1];
          var ast = this._parseAction(expression, sourceSpan);
          targetMatchableAttrs.push([name, ast.source]);
          targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
          // Don't detect directives for event names for now,
          // so don't add the event name to the matchableAttrs
      };
      BindingParser.prototype._parseAction = function (value, sourceSpan) {
          var sourceInfo = sourceSpan.start.toString();
          try {
              var ast = this._exprParser.parseAction(value, sourceInfo, this._interpolationConfig);
              if (ast) {
                  this._reportExpressionParserErrors(ast.errors, sourceSpan);
              }
              if (!ast || ast.ast instanceof EmptyExpr) {
                  this._reportError("Empty expressions are not allowed", sourceSpan);
                  return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
              }
              this._checkPipes(ast, sourceSpan);
              return ast;
          }
          catch (e) {
              this._reportError("" + e, sourceSpan);
              return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
          }
      };
      BindingParser.prototype._reportError = function (message, sourceSpan, level) {
          if (level === void 0) { level = exports.ParseErrorLevel.FATAL; }
          this._targetErrors.push(new ParseError(sourceSpan, message, level));
      };
      BindingParser.prototype._reportExpressionParserErrors = function (errors, sourceSpan) {
          for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
              var error = errors_1[_i];
              this._reportError(error.message, sourceSpan);
          }
      };
      BindingParser.prototype._checkPipes = function (ast, sourceSpan) {
          var _this = this;
          if (ast) {
              var collector = new PipeCollector();
              ast.visit(collector);
              collector.pipes.forEach(function (ast, pipeName) {
                  var pipeMeta = _this.pipesByName.get(pipeName);
                  if (!pipeMeta) {
                      _this._reportError("The pipe '" + pipeName + "' could not be found", new ParseSourceSpan(sourceSpan.start.moveBy(ast.span.start), sourceSpan.start.moveBy(ast.span.end)));
                  }
                  else {
                      _this._usedPipes.set(pipeName, pipeMeta);
                  }
              });
          }
      };
      /**
       * @param propName the name of the property / attribute
       * @param sourceSpan
       * @param isAttr true when binding to an attribute
       * @private
       */
      BindingParser.prototype._validatePropertyOrAttributeName = function (propName, sourceSpan, isAttr) {
          var report = isAttr ? this._schemaRegistry.validateAttribute(propName) :
              this._schemaRegistry.validateProperty(propName);
          if (report.error) {
              this._reportError(report.msg, sourceSpan, exports.ParseErrorLevel.FATAL);
          }
      };
      return BindingParser;
  }());
  var PipeCollector = (function (_super) {
      __extends$16(PipeCollector, _super);
      function PipeCollector() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.pipes = new Map();
          return _this;
      }
      PipeCollector.prototype.visitPipe = function (ast, context) {
          this.pipes.set(ast.name, ast);
          ast.exp.visit(this);
          this.visitAll(ast.args, context);
          return null;
      };
      return PipeCollector;
  }(RecursiveAstVisitor));
  function _isAnimationLabel(name) {
      return name[0] == '@';
  }
  function calcPossibleSecurityContexts(registry, selector, propName, isAttribute) {
      var ctxs = [];
      CssSelector.parse(selector).forEach(function (selector) {
          var elementNames = selector.element ? [selector.element] : registry.allKnownElementNames();
          var notElementNames = new Set(selector.notSelectors.filter(function (selector) { return selector.isElementSelector(); })
              .map(function (selector) { return selector.element; }));
          var possibleElementNames = elementNames.filter(function (elementName) { return !notElementNames.has(elementName); });
          ctxs.push.apply(ctxs, possibleElementNames.map(function (elementName) { return registry.securityContext(elementName, propName, isAttribute); }));
      });
      return ctxs.length === 0 ? [_angular_core.SecurityContext.NONE] : Array.from(new Set(ctxs)).sort();
  }

  var NG_CONTENT_SELECT_ATTR = 'select';
  var NG_CONTENT_ELEMENT = 'ng-content';
  var LINK_ELEMENT = 'link';
  var LINK_STYLE_REL_ATTR = 'rel';
  var LINK_STYLE_HREF_ATTR = 'href';
  var LINK_STYLE_REL_VALUE = 'stylesheet';
  var STYLE_ELEMENT = 'style';
  var SCRIPT_ELEMENT = 'script';
  var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
  var NG_PROJECT_AS = 'ngProjectAs';
  function preparseElement(ast) {
      var selectAttr = null;
      var hrefAttr = null;
      var relAttr = null;
      var nonBindable = false;
      var projectAs = null;
      ast.attrs.forEach(function (attr) {
          var lcAttrName = attr.name.toLowerCase();
          if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
              selectAttr = attr.value;
          }
          else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
              hrefAttr = attr.value;
          }
          else if (lcAttrName == LINK_STYLE_REL_ATTR) {
              relAttr = attr.value;
          }
          else if (attr.name == NG_NON_BINDABLE_ATTR) {
              nonBindable = true;
          }
          else if (attr.name == NG_PROJECT_AS) {
              if (attr.value.length > 0) {
                  projectAs = attr.value;
              }
          }
      });
      selectAttr = normalizeNgContentSelect(selectAttr);
      var nodeName = ast.name.toLowerCase();
      var type = PreparsedElementType.OTHER;
      if (splitNsName(nodeName)[1] == NG_CONTENT_ELEMENT) {
          type = PreparsedElementType.NG_CONTENT;
      }
      else if (nodeName == STYLE_ELEMENT) {
          type = PreparsedElementType.STYLE;
      }
      else if (nodeName == SCRIPT_ELEMENT) {
          type = PreparsedElementType.SCRIPT;
      }
      else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
          type = PreparsedElementType.STYLESHEET;
      }
      return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
  }
  var PreparsedElementType;
  (function (PreparsedElementType) {
      PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
      PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
      PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
      PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
      PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
  })(PreparsedElementType || (PreparsedElementType = {}));
  var PreparsedElement = (function () {
      function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
          this.type = type;
          this.selectAttr = selectAttr;
          this.hrefAttr = hrefAttr;
          this.nonBindable = nonBindable;
          this.projectAs = projectAs;
      }
      return PreparsedElement;
  }());
  function normalizeNgContentSelect(selectAttr) {
      if (selectAttr === null || selectAttr.length === 0) {
          return '*';
      }
      return selectAttr;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
  // Group 1 = "bind-"
  var KW_BIND_IDX = 1;
  // Group 2 = "let-"
  var KW_LET_IDX = 2;
  // Group 3 = "ref-/#"
  var KW_REF_IDX = 3;
  // Group 4 = "on-"
  var KW_ON_IDX = 4;
  // Group 5 = "bindon-"
  var KW_BINDON_IDX = 5;
  // Group 6 = "@"
  var KW_AT_IDX = 6;
  // Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
  var IDENT_KW_IDX = 7;
  // Group 8 = identifier inside [()]
  var IDENT_BANANA_BOX_IDX = 8;
  // Group 9 = identifier inside []
  var IDENT_PROPERTY_IDX = 9;
  // Group 10 = identifier inside ()
  var IDENT_EVENT_IDX = 10;
  var NG_TEMPLATE_ELEMENT = 'ng-template';
  // deprecated in 4.x
  var TEMPLATE_ELEMENT = 'template';
  // deprecated in 4.x
  var TEMPLATE_ATTR = 'template';
  var TEMPLATE_ATTR_PREFIX = '*';
  var CLASS_ATTR = 'class';
  var TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
  /**
   * Provides an array of {@link TemplateAstVisitor}s which will be used to transform
   * parsed templates before compilation is invoked, allowing custom expression syntax
   * and other advanced transformations.
   *
   * This is currently an internal-only feature and not meant for general use.
   */
  var TEMPLATE_TRANSFORMS = new _angular_core.InjectionToken('TemplateTransforms');
  var TemplateParseError = (function (_super) {
      __extends(TemplateParseError, _super);
      function TemplateParseError(message, span, level) {
          return _super.call(this, span, message, level) || this;
      }
      return TemplateParseError;
  }(ParseError));
  var TemplateParseResult = (function () {
      function TemplateParseResult(templateAst, usedPipes, errors) {
          this.templateAst = templateAst;
          this.usedPipes = usedPipes;
          this.errors = errors;
      }
      return TemplateParseResult;
  }());
  var TemplateParser = (function () {
      function TemplateParser(_config, _exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
          this._config = _config;
          this._exprParser = _exprParser;
          this._schemaRegistry = _schemaRegistry;
          this._htmlParser = _htmlParser;
          this._console = _console;
          this.transforms = transforms;
      }
      TemplateParser.prototype.parse = function (component, template, directives, pipes, schemas, templateUrl) {
          var result = this.tryParse(component, template, directives, pipes, schemas, templateUrl);
          var warnings = result.errors.filter(function (error) { return error.level === exports.ParseErrorLevel.WARNING; });
          var errors = result.errors.filter(function (error) { return error.level === exports.ParseErrorLevel.FATAL; });
          if (warnings.length > 0) {
              this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
          }
          if (errors.length > 0) {
              var errorString = errors.join('\n');
              throw syntaxError("Template parse errors:\n" + errorString);
          }
          return { template: result.templateAst, pipes: result.usedPipes };
      };
      TemplateParser.prototype.tryParse = function (component, template, directives, pipes, schemas, templateUrl) {
          return this.tryParseHtml(this.expandHtml(this._htmlParser.parse(template, templateUrl, true, this.getInterpolationConfig(component))), component, template, directives, pipes, schemas, templateUrl);
      };
      TemplateParser.prototype.tryParseHtml = function (htmlAstWithErrors, component, template, directives, pipes, schemas, templateUrl) {
          var result;
          var errors = htmlAstWithErrors.errors;
          var usedPipes = [];
          if (htmlAstWithErrors.rootNodes.length > 0) {
              var uniqDirectives = removeSummaryDuplicates(directives);
              var uniqPipes = removeSummaryDuplicates(pipes);
              var providerViewContext = new ProviderViewContext(component, htmlAstWithErrors.rootNodes[0].sourceSpan);
              var interpolationConfig = void 0;
              if (component.template && component.template.interpolation) {
                  interpolationConfig = {
                      start: component.template.interpolation[0],
                      end: component.template.interpolation[1]
                  };
              }
              var bindingParser = new BindingParser(this._exprParser, interpolationConfig, this._schemaRegistry, uniqPipes, errors);
              var parseVisitor = new TemplateParseVisitor(this._config, providerViewContext, uniqDirectives, bindingParser, this._schemaRegistry, schemas, errors);
              result = visitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
              errors.push.apply(errors, providerViewContext.errors);
              usedPipes.push.apply(usedPipes, bindingParser.getUsedPipes());
          }
          else {
              result = [];
          }
          this._assertNoReferenceDuplicationOnTemplate(result, errors);
          if (errors.length > 0) {
              return new TemplateParseResult(result, usedPipes, errors);
          }
          if (this.transforms) {
              this.transforms.forEach(function (transform) { result = templateVisitAll(transform, result); });
          }
          return new TemplateParseResult(result, usedPipes, errors);
      };
      TemplateParser.prototype.expandHtml = function (htmlAstWithErrors, forced) {
          if (forced === void 0) { forced = false; }
          var errors = htmlAstWithErrors.errors;
          if (errors.length == 0 || forced) {
              // Transform ICU messages to angular directives
              var expandedHtmlAst = expandNodes(htmlAstWithErrors.rootNodes);
              errors.push.apply(errors, expandedHtmlAst.errors);
              htmlAstWithErrors = new ParseTreeResult(expandedHtmlAst.nodes, errors);
          }
          return htmlAstWithErrors;
      };
      TemplateParser.prototype.getInterpolationConfig = function (component) {
          if (component.template) {
              return InterpolationConfig.fromArray(component.template.interpolation);
          }
      };
      /** @internal */
      TemplateParser.prototype._assertNoReferenceDuplicationOnTemplate = function (result, errors) {
          var existingReferences = [];
          result.filter(function (element) { return !!element.references; })
              .forEach(function (element) { return element.references.forEach(function (reference) {
              var name = reference.name;
              if (existingReferences.indexOf(name) < 0) {
                  existingReferences.push(name);
              }
              else {
                  var error = new TemplateParseError("Reference \"#" + name + "\" is defined several times", reference.sourceSpan, exports.ParseErrorLevel.FATAL);
                  errors.push(error);
              }
          }); });
      };
      return TemplateParser;
  }());
  TemplateParser.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  TemplateParser.ctorParameters = function () { return [
      { type: CompilerConfig, },
      { type: Parser, },
      { type: ElementSchemaRegistry, },
      { type: I18NHtmlParser, },
      { type: _angular_core.ɵConsole, },
      { type: Array, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [TEMPLATE_TRANSFORMS,] },] },
  ]; };
  var TemplateParseVisitor = (function () {
      function TemplateParseVisitor(config, providerViewContext, directives, _bindingParser, _schemaRegistry, _schemas, _targetErrors) {
          var _this = this;
          this.config = config;
          this.providerViewContext = providerViewContext;
          this._bindingParser = _bindingParser;
          this._schemaRegistry = _schemaRegistry;
          this._schemas = _schemas;
          this._targetErrors = _targetErrors;
          this.selectorMatcher = new SelectorMatcher();
          this.directivesIndex = new Map();
          this.ngContentCount = 0;
          // Note: queries start with id 1 so we can use the number in a Bloom filter!
          this.contentQueryStartId = providerViewContext.component.viewQueries.length + 1;
          directives.forEach(function (directive, index) {
              var selector = CssSelector.parse(directive.selector);
              _this.selectorMatcher.addSelectables(selector, directive);
              _this.directivesIndex.set(directive, index);
          });
      }
      TemplateParseVisitor.prototype.visitExpansion = function (expansion, context) { return null; };
      TemplateParseVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return null; };
      TemplateParseVisitor.prototype.visitText = function (text, parent) {
          var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
          var expr = this._bindingParser.parseInterpolation(text.value, text.sourceSpan);
          return expr ? new BoundTextAst(expr, ngContentIndex, text.sourceSpan) :
              new TextAst(text.value, ngContentIndex, text.sourceSpan);
      };
      TemplateParseVisitor.prototype.visitAttribute = function (attribute, context) {
          return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
      };
      TemplateParseVisitor.prototype.visitComment = function (comment, context) { return null; };
      TemplateParseVisitor.prototype.visitElement = function (element, parent) {
          var _this = this;
          var queryStartIndex = this.contentQueryStartId;
          var nodeName = element.name;
          var preparsedElement = preparseElement(element);
          if (preparsedElement.type === PreparsedElementType.SCRIPT ||
              preparsedElement.type === PreparsedElementType.STYLE) {
              // Skipping <script> for security reasons
              // Skipping <style> as we already processed them
              // in the StyleCompiler
              return null;
          }
          if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
              isStyleUrlResolvable(preparsedElement.hrefAttr)) {
              // Skipping stylesheets with either relative urls or package scheme as we already processed
              // them in the StyleCompiler
              return null;
          }
          var matchableAttrs = [];
          var elementOrDirectiveProps = [];
          var elementOrDirectiveRefs = [];
          var elementVars = [];
          var events = [];
          var templateElementOrDirectiveProps = [];
          var templateMatchableAttrs = [];
          var templateElementVars = [];
          var hasInlineTemplates = false;
          var attrs = [];
          var isTemplateElement = isTemplate(element, this.config.enableLegacyTemplate, function (m, span) { return _this._reportError(m, span, exports.ParseErrorLevel.WARNING); });
          element.attrs.forEach(function (attr) {
              var hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
              var templateBindingsSource;
              var prefixToken;
              var normalizedName = _this._normalizeAttributeName(attr.name);
              if (_this.config.enableLegacyTemplate && normalizedName == TEMPLATE_ATTR) {
                  _this._reportError("The template attribute is deprecated. Use an ng-template element instead.", attr.sourceSpan, exports.ParseErrorLevel.WARNING);
                  templateBindingsSource = attr.value;
              }
              else if (normalizedName.startsWith(TEMPLATE_ATTR_PREFIX)) {
                  templateBindingsSource = attr.value;
                  prefixToken = normalizedName.substring(TEMPLATE_ATTR_PREFIX.length) + ':';
              }
              var hasTemplateBinding = templateBindingsSource != null;
              if (hasTemplateBinding) {
                  if (hasInlineTemplates) {
                      _this._reportError("Can't have multiple template bindings on one element. Use only one attribute named 'template' or prefixed with *", attr.sourceSpan);
                  }
                  hasInlineTemplates = true;
                  _this._bindingParser.parseInlineTemplateBinding(prefixToken, templateBindingsSource, attr.sourceSpan, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
              }
              if (!hasBinding && !hasTemplateBinding) {
                  // don't include the bindings as attributes as well in the AST
                  attrs.push(_this.visitAttribute(attr, null));
                  matchableAttrs.push([attr.name, attr.value]);
              }
          });
          var elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
          var _a = this._parseDirectives(this.selectorMatcher, elementCssSelector), directiveMetas = _a.directives, matchElement = _a.matchElement;
          var references = [];
          var boundDirectivePropNames = new Set();
          var directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, element.sourceSpan, references, boundDirectivePropNames);
          var elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, boundDirectivePropNames);
          var isViewRoot = parent.isTemplateElement || hasInlineTemplates;
          var providerContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, isViewRoot, directiveAsts, attrs, references, isTemplateElement, queryStartIndex, element.sourceSpan);
          var children = visitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? parent.providerContext : providerContext));
          providerContext.afterElement();
          // Override the actual selector when the `ngProjectAs` attribute is provided
          var projectionSelector = preparsedElement.projectAs != null ?
              CssSelector.parse(preparsedElement.projectAs)[0] :
              elementCssSelector;
          var ngContentIndex = parent.findNgContentIndex(projectionSelector);
          var parsedElement;
          if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
              if (element.children && !element.children.every(_isEmptyTextNode)) {
                  this._reportError("<ng-content> element cannot have content.", element.sourceSpan);
              }
              parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
          }
          else if (isTemplateElement) {
              this._assertAllEventsPublishedByDirectives(directiveAsts, events);
              this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, element.sourceSpan);
              parsedElement = new EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
          }
          else {
              this._assertElementExists(matchElement, element);
              this._assertOnlyOneComponent(directiveAsts, element.sourceSpan);
              var ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
              parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, providerContext.queryMatches, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan, element.endSourceSpan);
          }
          if (hasInlineTemplates) {
              var templateQueryStartIndex = this.contentQueryStartId;
              var templateSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
              var templateDirectiveMetas = this._parseDirectives(this.selectorMatcher, templateSelector).directives;
              var templateBoundDirectivePropNames = new Set();
              var templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], element.sourceSpan, [], templateBoundDirectivePropNames);
              var templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateBoundDirectivePropNames);
              this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, element.sourceSpan);
              var templateProviderContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, parent.isTemplateElement, templateDirectiveAsts, [], [], true, templateQueryStartIndex, element.sourceSpan);
              templateProviderContext.afterElement();
              parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, templateProviderContext.queryMatches, [parsedElement], ngContentIndex, element.sourceSpan);
          }
          return parsedElement;
      };
      TemplateParseVisitor.prototype._parseAttr = function (isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
          var name = this._normalizeAttributeName(attr.name);
          var value = attr.value;
          var srcSpan = attr.sourceSpan;
          var bindParts = name.match(BIND_NAME_REGEXP);
          var hasBinding = false;
          if (bindParts !== null) {
              hasBinding = true;
              if (bindParts[KW_BIND_IDX] != null) {
                  this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
              }
              else if (bindParts[KW_LET_IDX]) {
                  if (isTemplateElement) {
                      var identifier = bindParts[IDENT_KW_IDX];
                      this._parseVariable(identifier, value, srcSpan, targetVars);
                  }
                  else {
                      this._reportError("\"let-\" is only supported on template elements.", srcSpan);
                  }
              }
              else if (bindParts[KW_REF_IDX]) {
                  var identifier = bindParts[IDENT_KW_IDX];
                  this._parseReference(identifier, value, srcSpan, targetRefs);
              }
              else if (bindParts[KW_ON_IDX]) {
                  this._bindingParser.parseEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
              }
              else if (bindParts[KW_BINDON_IDX]) {
                  this._bindingParser.parsePropertyBinding(bindParts[IDENT_KW_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                  this._parseAssignmentEvent(bindParts[IDENT_KW_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
              }
              else if (bindParts[KW_AT_IDX]) {
                  this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
              }
              else if (bindParts[IDENT_BANANA_BOX_IDX]) {
                  this._bindingParser.parsePropertyBinding(bindParts[IDENT_BANANA_BOX_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
                  this._parseAssignmentEvent(bindParts[IDENT_BANANA_BOX_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
              }
              else if (bindParts[IDENT_PROPERTY_IDX]) {
                  this._bindingParser.parsePropertyBinding(bindParts[IDENT_PROPERTY_IDX], value, false, srcSpan, targetMatchableAttrs, targetProps);
              }
              else if (bindParts[IDENT_EVENT_IDX]) {
                  this._bindingParser.parseEvent(bindParts[IDENT_EVENT_IDX], value, srcSpan, targetMatchableAttrs, targetEvents);
              }
          }
          else {
              hasBinding = this._bindingParser.parsePropertyInterpolation(name, value, srcSpan, targetMatchableAttrs, targetProps);
          }
          if (!hasBinding) {
              this._bindingParser.parseLiteralAttr(name, value, srcSpan, targetMatchableAttrs, targetProps);
          }
          return hasBinding;
      };
      TemplateParseVisitor.prototype._normalizeAttributeName = function (attrName) {
          return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
      };
      TemplateParseVisitor.prototype._parseVariable = function (identifier, value, sourceSpan, targetVars) {
          if (identifier.indexOf('-') > -1) {
              this._reportError("\"-\" is not allowed in variable names", sourceSpan);
          }
          targetVars.push(new VariableAst(identifier, value, sourceSpan));
      };
      TemplateParseVisitor.prototype._parseReference = function (identifier, value, sourceSpan, targetRefs) {
          if (identifier.indexOf('-') > -1) {
              this._reportError("\"-\" is not allowed in reference names", sourceSpan);
          }
          targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
      };
      TemplateParseVisitor.prototype._parseAssignmentEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
          this._bindingParser.parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, targetEvents);
      };
      TemplateParseVisitor.prototype._parseDirectives = function (selectorMatcher, elementCssSelector) {
          var _this = this;
          // Need to sort the directives so that we get consistent results throughout,
          // as selectorMatcher uses Maps inside.
          // Also deduplicate directives as they might match more than one time!
          var directives = new Array(this.directivesIndex.size);
          // Whether any directive selector matches on the element name
          var matchElement = false;
          selectorMatcher.match(elementCssSelector, function (selector, directive) {
              directives[_this.directivesIndex.get(directive)] = directive;
              matchElement = matchElement || selector.hasElementSelector();
          });
          return {
              directives: directives.filter(function (dir) { return !!dir; }),
              matchElement: matchElement,
          };
      };
      TemplateParseVisitor.prototype._createDirectiveAsts = function (isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, elementSourceSpan, targetReferences, targetBoundDirectivePropNames) {
          var _this = this;
          var matchedReferences = new Set();
          var component = null;
          var directiveAsts = directives.map(function (directive) {
              var sourceSpan = new ParseSourceSpan(elementSourceSpan.start, elementSourceSpan.end, "Directive " + identifierName(directive.type));
              if (directive.isComponent) {
                  component = directive;
              }
              var directiveProperties = [];
              var hostProperties = _this._bindingParser.createDirectiveHostPropertyAsts(directive, elementName, sourceSpan);
              // Note: We need to check the host properties here as well,
              // as we don't know the element name in the DirectiveWrapperCompiler yet.
              hostProperties = _this._checkPropertiesInSchema(elementName, hostProperties);
              var hostEvents = _this._bindingParser.createDirectiveHostEventAsts(directive, sourceSpan);
              _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties, targetBoundDirectivePropNames);
              elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                  if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                      (directive.exportAs == elOrDirRef.value)) {
                      targetReferences.push(new ReferenceAst(elOrDirRef.name, identifierToken(directive.type), elOrDirRef.sourceSpan));
                      matchedReferences.add(elOrDirRef.name);
                  }
              });
              var contentQueryStartId = _this.contentQueryStartId;
              _this.contentQueryStartId += directive.queries.length;
              return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, contentQueryStartId, sourceSpan);
          });
          elementOrDirectiveRefs.forEach(function (elOrDirRef) {
              if (elOrDirRef.value.length > 0) {
                  if (!matchedReferences.has(elOrDirRef.name)) {
                      _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
                  }
              }
              else if (!component) {
                  var refToken = null;
                  if (isTemplateElement) {
                      refToken = createIdentifierToken(Identifiers.TemplateRef);
                  }
                  targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
              }
          });
          return directiveAsts;
      };
      TemplateParseVisitor.prototype._createDirectivePropertyAsts = function (directiveProperties, boundProps, targetBoundDirectiveProps, targetBoundDirectivePropNames) {
          if (directiveProperties) {
              var boundPropsByName_1 = new Map();
              boundProps.forEach(function (boundProp) {
                  var prevValue = boundPropsByName_1.get(boundProp.name);
                  if (!prevValue || prevValue.isLiteral) {
                      // give [a]="b" a higher precedence than a="b" on the same element
                      boundPropsByName_1.set(boundProp.name, boundProp);
                  }
              });
              Object.keys(directiveProperties).forEach(function (dirProp) {
                  var elProp = directiveProperties[dirProp];
                  var boundProp = boundPropsByName_1.get(elProp);
                  // Bindings are optional, so this binding only needs to be set up if an expression is given.
                  if (boundProp) {
                      targetBoundDirectivePropNames.add(boundProp.name);
                      if (!isEmptyExpression(boundProp.expression)) {
                          targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                      }
                  }
              });
          }
      };
      TemplateParseVisitor.prototype._createElementPropertyAsts = function (elementName, props, boundDirectivePropNames) {
          var _this = this;
          var boundElementProps = [];
          props.forEach(function (prop) {
              if (!prop.isLiteral && !boundDirectivePropNames.has(prop.name)) {
                  boundElementProps.push(_this._bindingParser.createElementPropertyAst(elementName, prop));
              }
          });
          return this._checkPropertiesInSchema(elementName, boundElementProps);
      };
      TemplateParseVisitor.prototype._findComponentDirectives = function (directives) {
          return directives.filter(function (directive) { return directive.directive.isComponent; });
      };
      TemplateParseVisitor.prototype._findComponentDirectiveNames = function (directives) {
          return this._findComponentDirectives(directives)
              .map(function (directive) { return identifierName(directive.directive.type); });
      };
      TemplateParseVisitor.prototype._assertOnlyOneComponent = function (directives, sourceSpan) {
          var componentTypeNames = this._findComponentDirectiveNames(directives);
          if (componentTypeNames.length > 1) {
              this._reportError("More than one component matched on this element.\n" +
                  "Make sure that only one component's selector can match a given element.\n" +
                  ("Conflicting components: " + componentTypeNames.join(',')), sourceSpan);
          }
      };
      /**
       * Make sure that non-angular tags conform to the schemas.
       *
       * Note: An element is considered an angular tag when at least one directive selector matches the
       * tag name.
       *
       * @param matchElement Whether any directive has matched on the tag name
       * @param element the html element
       */
      TemplateParseVisitor.prototype._assertElementExists = function (matchElement, element) {
          var elName = element.name.replace(/^:xhtml:/, '');
          if (!matchElement && !this._schemaRegistry.hasElement(elName, this._schemas)) {
              var errorMsg = "'" + elName + "' is not a known element:\n";
              errorMsg +=
                  "1. If '" + elName + "' is an Angular component, then verify that it is part of this module.\n";
              if (elName.indexOf('-') > -1) {
                  errorMsg +=
                      "2. If '" + elName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.";
              }
              else {
                  errorMsg +=
                      "2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
              }
              this._reportError(errorMsg, element.sourceSpan);
          }
      };
      TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function (directives, elementProps, sourceSpan) {
          var _this = this;
          var componentTypeNames = this._findComponentDirectiveNames(directives);
          if (componentTypeNames.length > 0) {
              this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
          }
          elementProps.forEach(function (prop) {
              _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", sourceSpan);
          });
      };
      TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function (directives, events) {
          var _this = this;
          var allDirectiveEvents = new Set();
          directives.forEach(function (directive) {
              Object.keys(directive.directive.outputs).forEach(function (k) {
                  var eventName = directive.directive.outputs[k];
                  allDirectiveEvents.add(eventName);
              });
          });
          events.forEach(function (event) {
              if (event.target != null || !allDirectiveEvents.has(event.name)) {
                  _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\".", event.sourceSpan);
              }
          });
      };
      TemplateParseVisitor.prototype._checkPropertiesInSchema = function (elementName, boundProps) {
          var _this = this;
          // Note: We can't filter out empty expressions before this method,
          // as we still want to validate them!
          return boundProps.filter(function (boundProp) {
              if (boundProp.type === exports.PropertyBindingType.Property &&
                  !_this._schemaRegistry.hasProperty(elementName, boundProp.name, _this._schemas)) {
                  var errorMsg = "Can't bind to '" + boundProp.name + "' since it isn't a known property of '" + elementName + "'.";
                  if (elementName.startsWith('ng-')) {
                      errorMsg +=
                          "\n1. If '" + boundProp.name + "' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component." +
                              "\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                  }
                  else if (elementName.indexOf('-') > -1) {
                      errorMsg +=
                          "\n1. If '" + elementName + "' is an Angular component and it has '" + boundProp.name + "' input, then verify that it is part of this module." +
                              ("\n2. If '" + elementName + "' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.") +
                              "\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.";
                  }
                  _this._reportError(errorMsg, boundProp.sourceSpan);
              }
              return !isEmptyExpression(boundProp.value);
          });
      };
      TemplateParseVisitor.prototype._reportError = function (message, sourceSpan, level) {
          if (level === void 0) { level = exports.ParseErrorLevel.FATAL; }
          this._targetErrors.push(new ParseError(sourceSpan, message, level));
      };
      return TemplateParseVisitor;
  }());
  var NonBindableVisitor = (function () {
      function NonBindableVisitor() {
      }
      NonBindableVisitor.prototype.visitElement = function (ast, parent) {
          var preparsedElement = preparseElement(ast);
          if (preparsedElement.type === PreparsedElementType.SCRIPT ||
              preparsedElement.type === PreparsedElementType.STYLE ||
              preparsedElement.type === PreparsedElementType.STYLESHEET) {
              // Skipping <script> for security reasons
              // Skipping <style> and stylesheets as we already processed them
              // in the StyleCompiler
              return null;
          }
          var attrNameAndValues = ast.attrs.map(function (attr) { return [attr.name, attr.value]; });
          var selector = createElementCssSelector(ast.name, attrNameAndValues);
          var ngContentIndex = parent.findNgContentIndex(selector);
          var children = visitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
          return new ElementAst(ast.name, visitAll(this, ast.attrs), [], [], [], [], [], false, [], children, ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
      };
      NonBindableVisitor.prototype.visitComment = function (comment, context) { return null; };
      NonBindableVisitor.prototype.visitAttribute = function (attribute, context) {
          return new AttrAst(attribute.name, attribute.value, attribute.sourceSpan);
      };
      NonBindableVisitor.prototype.visitText = function (text, parent) {
          var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
          return new TextAst(text.value, ngContentIndex, text.sourceSpan);
      };
      NonBindableVisitor.prototype.visitExpansion = function (expansion, context) { return expansion; };
      NonBindableVisitor.prototype.visitExpansionCase = function (expansionCase, context) { return expansionCase; };
      return NonBindableVisitor;
  }());
  var ElementOrDirectiveRef = (function () {
      function ElementOrDirectiveRef(name, value, sourceSpan) {
          this.name = name;
          this.value = value;
          this.sourceSpan = sourceSpan;
      }
      return ElementOrDirectiveRef;
  }());
  function splitClasses(classAttrValue) {
      return classAttrValue.trim().split(/\s+/g);
  }
  var ElementContext = (function () {
      function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
          this.isTemplateElement = isTemplateElement;
          this._ngContentIndexMatcher = _ngContentIndexMatcher;
          this._wildcardNgContentIndex = _wildcardNgContentIndex;
          this.providerContext = providerContext;
      }
      ElementContext.create = function (isTemplateElement, directives, providerContext) {
          var matcher = new SelectorMatcher();
          var wildcardNgContentIndex = null;
          var component = directives.find(function (directive) { return directive.directive.isComponent; });
          if (component) {
              var ngContentSelectors = component.directive.template.ngContentSelectors;
              for (var i = 0; i < ngContentSelectors.length; i++) {
                  var selector = ngContentSelectors[i];
                  if (selector === '*') {
                      wildcardNgContentIndex = i;
                  }
                  else {
                      matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
                  }
              }
          }
          return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
      };
      ElementContext.prototype.findNgContentIndex = function (selector) {
          var ngContentIndices = [];
          this._ngContentIndexMatcher.match(selector, function (selector, ngContentIndex) { ngContentIndices.push(ngContentIndex); });
          ngContentIndices.sort();
          if (this._wildcardNgContentIndex != null) {
              ngContentIndices.push(this._wildcardNgContentIndex);
          }
          return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
      };
      return ElementContext;
  }());
  function createElementCssSelector(elementName, attributes) {
      var cssSelector = new CssSelector();
      var elNameNoNs = splitNsName(elementName)[1];
      cssSelector.setElement(elNameNoNs);
      for (var i = 0; i < attributes.length; i++) {
          var attrName = attributes[i][0];
          var attrNameNoNs = splitNsName(attrName)[1];
          var attrValue = attributes[i][1];
          cssSelector.addAttribute(attrNameNoNs, attrValue);
          if (attrName.toLowerCase() == CLASS_ATTR) {
              var classes = splitClasses(attrValue);
              classes.forEach(function (className) { return cssSelector.addClassName(className); });
          }
      }
      return cssSelector;
  }
  var EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
  var NON_BINDABLE_VISITOR = new NonBindableVisitor();
  function _isEmptyTextNode(node) {
      return node instanceof Text && node.value.trim().length == 0;
  }
  function removeSummaryDuplicates(items) {
      var map = new Map();
      items.forEach(function (item) {
          if (!map.get(item.type.reference)) {
              map.set(item.type.reference, item);
          }
      });
      return Array.from(map.values());
  }
  function isEmptyExpression(ast) {
      if (ast instanceof ASTWithSource) {
          ast = ast.ast;
      }
      return ast instanceof EmptyExpr;
  }
  // `template` is deprecated in 4.x
  function isTemplate(el, enableLegacyTemplate, reportDeprecation) {
      var tagNoNs = splitNsName(el.name)[1];
      // `<ng-template>` is an angular construct and is lower case
      if (tagNoNs === NG_TEMPLATE_ELEMENT)
          return true;
      // `<template>` is HTML and case insensitive
      if (tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
          if (enableLegacyTemplate && tagNoNs.toLowerCase() === TEMPLATE_ELEMENT) {
              reportDeprecation("The <template> element is deprecated. Use <ng-template> instead", el.sourceSpan);
              return true;
          }
          return false;
      }
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * An interface for retrieving documents by URL that the compiler uses
   * to load templates.
   */
  var ResourceLoader = (function () {
      function ResourceLoader() {
      }
      ResourceLoader.prototype.get = function (url) { return null; };
      return ResourceLoader;
  }());

  /**
   * Create a {@link UrlResolver} with no package prefix.
   */
  function createUrlResolverWithoutPackagePrefix() {
      return new UrlResolver();
  }
  function createOfflineCompileUrlResolver() {
      return new UrlResolver('.');
  }
  /**
   * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
   */
  var DEFAULT_PACKAGE_URL_PROVIDER = {
      provide: _angular_core.PACKAGE_ROOT_URL,
      useValue: '/'
  };
  /**
   * Used by the {@link Compiler} when resolving HTML and CSS template URLs.
   *
   * This class can be overridden by the application developer to create custom behavior.
   *
   * See {@link Compiler}
   *
   * ## Example
   *
   * {@example compiler/ts/url_resolver/url_resolver.ts region='url_resolver'}
   *
   * @security  When compiling templates at runtime, you must
   * ensure that the entire template comes from a trusted source.
   * Attacker-controlled data introduced by a template could expose your
   * application to XSS risks. For more detail, see the [Security Guide](http://g.co/ng/security).
   */
  var UrlResolver = (function () {
      function UrlResolver(_packagePrefix) {
          if (_packagePrefix === void 0) { _packagePrefix = null; }
          this._packagePrefix = _packagePrefix;
      }
      /**
       * Resolves the `url` given the `baseUrl`:
       * - when the `url` is null, the `baseUrl` is returned,
       * - if `url` is relative ('path/to/here', './path/to/here'), the resolved url is a combination of
       * `baseUrl` and `url`,
       * - if `url` is absolute (it has a scheme: 'http://', 'https://' or start with '/'), the `url` is
       * returned as is (ignoring the `baseUrl`)
       */
      UrlResolver.prototype.resolve = function (baseUrl, url) {
          var resolvedUrl = url;
          if (baseUrl != null && baseUrl.length > 0) {
              resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
          }
          var resolvedParts = _split(resolvedUrl);
          var prefix = this._packagePrefix;
          if (prefix != null && resolvedParts != null &&
              resolvedParts[_ComponentIndex.Scheme] == 'package') {
              var path = resolvedParts[_ComponentIndex.Path];
              prefix = prefix.replace(/\/+$/, '');
              path = path.replace(/^\/+/, '');
              return prefix + "/" + path;
          }
          return resolvedUrl;
      };
      return UrlResolver;
  }());
  UrlResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  UrlResolver.ctorParameters = function () { return [
      { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.PACKAGE_ROOT_URL,] },] },
  ]; };
  /**
   * Extract the scheme of a URL.
   */
  function getUrlScheme(url) {
      var match = _split(url);
      return (match && match[_ComponentIndex.Scheme]) || '';
  }
  // The code below is adapted from Traceur:
  // https://github.com/google/traceur-compiler/blob/9511c1dafa972bf0de1202a8a863bad02f0f95a8/src/runtime/url.js
  /**
   * Builds a URI string from already-encoded parts.
   *
   * No encoding is performed.  Any component may be omitted as either null or
   * undefined.
   *
   * @param opt_scheme The scheme such as 'http'.
   * @param opt_userInfo The user name before the '@'.
   * @param opt_domain The domain such as 'www.google.com', already
   *     URI-encoded.
   * @param opt_port The port number.
   * @param opt_path The path, already URI-encoded.  If it is not
   *     empty, it must begin with a slash.
   * @param opt_queryData The URI-encoded query data.
   * @param opt_fragment The URI-encoded fragment identifier.
   * @return The fully combined URI.
   */
  function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
      var out = [];
      if (opt_scheme != null) {
          out.push(opt_scheme + ':');
      }
      if (opt_domain != null) {
          out.push('//');
          if (opt_userInfo != null) {
              out.push(opt_userInfo + '@');
          }
          out.push(opt_domain);
          if (opt_port != null) {
              out.push(':' + opt_port);
          }
      }
      if (opt_path != null) {
          out.push(opt_path);
      }
      if (opt_queryData != null) {
          out.push('?' + opt_queryData);
      }
      if (opt_fragment != null) {
          out.push('#' + opt_fragment);
      }
      return out.join('');
  }
  /**
   * A regular expression for breaking a URI into its component parts.
   *
   * {@link http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234} says
   * As the "first-match-wins" algorithm is identical to the "greedy"
   * disambiguation method used by POSIX regular expressions, it is natural and
   * commonplace to use a regular expression for parsing the potential five
   * components of a URI reference.
   *
   * The following line is the regular expression for breaking-down a
   * well-formed URI reference into its components.
   *
   * <pre>
   * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
   *  12            3  4          5       6  7        8 9
   * </pre>
   *
   * The numbers in the second line above are only to assist readability; they
   * indicate the reference points for each subexpression (i.e., each paired
   * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
   * For example, matching the above expression to
   * <pre>
   *     http://www.ics.uci.edu/pub/ietf/uri/#Related
   * </pre>
   * results in the following subexpression matches:
   * <pre>
   *    $1 = http:
   *    $2 = http
   *    $3 = //www.ics.uci.edu
   *    $4 = www.ics.uci.edu
   *    $5 = /pub/ietf/uri/
   *    $6 = <undefined>
   *    $7 = <undefined>
   *    $8 = #Related
   *    $9 = Related
   * </pre>
   * where <undefined> indicates that the component is not present, as is the
   * case for the query component in the above example. Therefore, we can
   * determine the value of the five components as
   * <pre>
   *    scheme    = $2
   *    authority = $4
   *    path      = $5
   *    query     = $7
   *    fragment  = $9
   * </pre>
   *
   * The regular expression has been modified slightly to expose the
   * userInfo, domain, and port separately from the authority.
   * The modified version yields
   * <pre>
   *    $1 = http              scheme
   *    $2 = <undefined>       userInfo -\
   *    $3 = www.ics.uci.edu   domain     | authority
   *    $4 = <undefined>       port     -/
   *    $5 = /pub/ietf/uri/    path
   *    $6 = <undefined>       query without ?
   *    $7 = Related           fragment without #
   * </pre>
   * @type {!RegExp}
   * @internal
   */
  var _splitRe = new RegExp('^' +
      '(?:' +
      '([^:/?#.]+)' +
      // used by other URL parts such as :,
      // ?, /, #, and .
      ':)?' +
      '(?://' +
      '(?:([^/?#]*)@)?' +
      '([\\w\\d\\-\\u0100-\\uffff.%]*)' +
      // digits, dashes, dots, percent
      // escapes, and unicode characters.
      '(?::([0-9]+))?' +
      ')?' +
      '([^?#]+)?' +
      '(?:\\?([^#]*))?' +
      '(?:#(.*))?' +
      '$');
  /**
   * The index of each URI component in the return value of goog.uri.utils.split.
   * @enum {number}
   */
  var _ComponentIndex;
  (function (_ComponentIndex) {
      _ComponentIndex[_ComponentIndex["Scheme"] = 1] = "Scheme";
      _ComponentIndex[_ComponentIndex["UserInfo"] = 2] = "UserInfo";
      _ComponentIndex[_ComponentIndex["Domain"] = 3] = "Domain";
      _ComponentIndex[_ComponentIndex["Port"] = 4] = "Port";
      _ComponentIndex[_ComponentIndex["Path"] = 5] = "Path";
      _ComponentIndex[_ComponentIndex["QueryData"] = 6] = "QueryData";
      _ComponentIndex[_ComponentIndex["Fragment"] = 7] = "Fragment";
  })(_ComponentIndex || (_ComponentIndex = {}));
  /**
   * Splits a URI into its component parts.
   *
   * Each component can be accessed via the component indices; for example:
   * <pre>
   * goog.uri.utils.split(someStr)[goog.uri.utils.CompontentIndex.QUERY_DATA];
   * </pre>
   *
   * @param uri The URI string to examine.
   * @return Each component still URI-encoded.
   *     Each component that is present will contain the encoded value, whereas
   *     components that are not present will be undefined or empty, depending
   *     on the browser's regular expression implementation.  Never null, since
   *     arbitrary strings may still look like path names.
   */
  function _split(uri) {
      return uri.match(_splitRe);
  }
  /**
    * Removes dot segments in given path component, as described in
    * RFC 3986, section 5.2.4.
    *
    * @param path A non-empty path component.
    * @return Path component with removed dot segments.
    */
  function _removeDotSegments(path) {
      if (path == '/')
          return '/';
      var leadingSlash = path[0] == '/' ? '/' : '';
      var trailingSlash = path[path.length - 1] === '/' ? '/' : '';
      var segments = path.split('/');
      var out = [];
      var up = 0;
      for (var pos = 0; pos < segments.length; pos++) {
          var segment = segments[pos];
          switch (segment) {
              case '':
              case '.':
                  break;
              case '..':
                  if (out.length > 0) {
                      out.pop();
                  }
                  else {
                      up++;
                  }
                  break;
              default:
                  out.push(segment);
          }
      }
      if (leadingSlash == '') {
          while (up-- > 0) {
              out.unshift('..');
          }
          if (out.length === 0)
              out.push('.');
      }
      return leadingSlash + out.join('/') + trailingSlash;
  }
  /**
   * Takes an array of the parts from split and canonicalizes the path part
   * and then joins all the parts.
   */
  function _joinAndCanonicalizePath(parts) {
      var path = parts[_ComponentIndex.Path];
      path = path == null ? '' : _removeDotSegments(path);
      parts[_ComponentIndex.Path] = path;
      return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
  }
  /**
   * Resolves a URL.
   * @param base The URL acting as the base URL.
   * @param to The URL to resolve.
   */
  function _resolveUrl(base, url) {
      var parts = _split(encodeURI(url));
      var baseParts = _split(base);
      if (parts[_ComponentIndex.Scheme] != null) {
          return _joinAndCanonicalizePath(parts);
      }
      else {
          parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
      }
      for (var i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
          if (parts[i] == null) {
              parts[i] = baseParts[i];
          }
      }
      if (parts[_ComponentIndex.Path][0] == '/') {
          return _joinAndCanonicalizePath(parts);
      }
      var path = baseParts[_ComponentIndex.Path];
      if (path == null)
          path = '/';
      var index = path.lastIndexOf('/');
      path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
      parts[_ComponentIndex.Path] = path;
      return _joinAndCanonicalizePath(parts);
  }

  var DirectiveNormalizer = (function () {
      function DirectiveNormalizer(_resourceLoader, _urlResolver, _htmlParser, _config) {
          this._resourceLoader = _resourceLoader;
          this._urlResolver = _urlResolver;
          this._htmlParser = _htmlParser;
          this._config = _config;
          this._resourceLoaderCache = new Map();
      }
      DirectiveNormalizer.prototype.clearCache = function () { this._resourceLoaderCache.clear(); };
      DirectiveNormalizer.prototype.clearCacheFor = function (normalizedDirective) {
          var _this = this;
          if (!normalizedDirective.isComponent) {
              return;
          }
          this._resourceLoaderCache.delete(normalizedDirective.template.templateUrl);
          normalizedDirective.template.externalStylesheets.forEach(function (stylesheet) { _this._resourceLoaderCache.delete(stylesheet.moduleUrl); });
      };
      DirectiveNormalizer.prototype._fetch = function (url) {
          var result = this._resourceLoaderCache.get(url);
          if (!result) {
              result = this._resourceLoader.get(url);
              this._resourceLoaderCache.set(url, result);
          }
          return result;
      };
      DirectiveNormalizer.prototype.normalizeTemplate = function (prenormData) {
          var _this = this;
          var normalizedTemplateSync = null;
          var normalizedTemplateAsync;
          if (prenormData.template != null) {
              if (typeof prenormData.template !== 'string') {
                  throw syntaxError("The template specified for component " + _angular_core.ɵstringify(prenormData.componentType) + " is not a string");
              }
              normalizedTemplateSync = this.normalizeTemplateSync(prenormData);
              normalizedTemplateAsync = Promise.resolve(normalizedTemplateSync);
          }
          else if (prenormData.templateUrl) {
              if (typeof prenormData.templateUrl !== 'string') {
                  throw syntaxError("The templateUrl specified for component " + _angular_core.ɵstringify(prenormData.componentType) + " is not a string");
              }
              normalizedTemplateAsync = this.normalizeTemplateAsync(prenormData);
          }
          else {
              throw syntaxError("No template specified for component " + _angular_core.ɵstringify(prenormData.componentType));
          }
          if (normalizedTemplateSync && normalizedTemplateSync.styleUrls.length === 0) {
              // sync case
              return new SyncAsyncResult(normalizedTemplateSync);
          }
          else {
              // async case
              return new SyncAsyncResult(null, normalizedTemplateAsync.then(function (normalizedTemplate) { return _this.normalizeExternalStylesheets(normalizedTemplate); }));
          }
      };
      DirectiveNormalizer.prototype.normalizeTemplateSync = function (prenomData) {
          return this.normalizeLoadedTemplate(prenomData, prenomData.template, prenomData.moduleUrl);
      };
      DirectiveNormalizer.prototype.normalizeTemplateAsync = function (prenomData) {
          var _this = this;
          var templateUrl = this._urlResolver.resolve(prenomData.moduleUrl, prenomData.templateUrl);
          return this._fetch(templateUrl)
              .then(function (value) { return _this.normalizeLoadedTemplate(prenomData, value, templateUrl); });
      };
      DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (prenomData, template, templateAbsUrl) {
          var interpolationConfig = InterpolationConfig.fromArray(prenomData.interpolation);
          var rootNodesAndErrors = this._htmlParser.parse(template, _angular_core.ɵstringify(prenomData.componentType), true, interpolationConfig);
          if (rootNodesAndErrors.errors.length > 0) {
              var errorString = rootNodesAndErrors.errors.join('\n');
              throw syntaxError("Template parse errors:\n" + errorString);
          }
          var templateMetadataStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({
              styles: prenomData.styles,
              styleUrls: prenomData.styleUrls,
              moduleUrl: prenomData.moduleUrl
          }));
          var visitor = new TemplatePreparseVisitor();
          visitAll(visitor, rootNodesAndErrors.rootNodes);
          var templateStyles = this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: visitor.styles, styleUrls: visitor.styleUrls, moduleUrl: templateAbsUrl }));
          var encapsulation = prenomData.encapsulation;
          if (encapsulation == null) {
              encapsulation = this._config.defaultEncapsulation;
          }
          var styles = templateMetadataStyles.styles.concat(templateStyles.styles);
          var styleUrls = templateMetadataStyles.styleUrls.concat(templateStyles.styleUrls);
          if (encapsulation === _angular_core.ViewEncapsulation.Emulated && styles.length === 0 &&
              styleUrls.length === 0) {
              encapsulation = _angular_core.ViewEncapsulation.None;
          }
          return new CompileTemplateMetadata({
              encapsulation: encapsulation,
              template: template,
              templateUrl: templateAbsUrl, styles: styles, styleUrls: styleUrls,
              ngContentSelectors: visitor.ngContentSelectors,
              animations: prenomData.animations,
              interpolation: prenomData.interpolation,
          });
      };
      DirectiveNormalizer.prototype.normalizeExternalStylesheets = function (templateMeta) {
          return this._loadMissingExternalStylesheets(templateMeta.styleUrls)
              .then(function (externalStylesheets) { return new CompileTemplateMetadata({
              encapsulation: templateMeta.encapsulation,
              template: templateMeta.template,
              templateUrl: templateMeta.templateUrl,
              styles: templateMeta.styles,
              styleUrls: templateMeta.styleUrls,
              externalStylesheets: externalStylesheets,
              ngContentSelectors: templateMeta.ngContentSelectors,
              animations: templateMeta.animations,
              interpolation: templateMeta.interpolation
          }); });
      };
      DirectiveNormalizer.prototype._loadMissingExternalStylesheets = function (styleUrls, loadedStylesheets) {
          var _this = this;
          if (loadedStylesheets === void 0) { loadedStylesheets = new Map(); }
          return Promise
              .all(styleUrls.filter(function (styleUrl) { return !loadedStylesheets.has(styleUrl); })
              .map(function (styleUrl) { return _this._fetch(styleUrl).then(function (loadedStyle) {
              var stylesheet = _this.normalizeStylesheet(new CompileStylesheetMetadata({ styles: [loadedStyle], moduleUrl: styleUrl }));
              loadedStylesheets.set(styleUrl, stylesheet);
              return _this._loadMissingExternalStylesheets(stylesheet.styleUrls, loadedStylesheets);
          }); }))
              .then(function (_) { return Array.from(loadedStylesheets.values()); });
      };
      DirectiveNormalizer.prototype.normalizeStylesheet = function (stylesheet) {
          var _this = this;
          var allStyleUrls = stylesheet.styleUrls.filter(isStyleUrlResolvable)
              .map(function (url) { return _this._urlResolver.resolve(stylesheet.moduleUrl, url); });
          var allStyles = stylesheet.styles.map(function (style) {
              var styleWithImports = extractStyleUrls(_this._urlResolver, stylesheet.moduleUrl, style);
              allStyleUrls.push.apply(allStyleUrls, styleWithImports.styleUrls);
              return styleWithImports.style;
          });
          return new CompileStylesheetMetadata({ styles: allStyles, styleUrls: allStyleUrls, moduleUrl: stylesheet.moduleUrl });
      };
      return DirectiveNormalizer;
  }());
  DirectiveNormalizer.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  DirectiveNormalizer.ctorParameters = function () { return [
      { type: ResourceLoader, },
      { type: UrlResolver, },
      { type: HtmlParser, },
      { type: CompilerConfig, },
  ]; };
  var TemplatePreparseVisitor = (function () {
      function TemplatePreparseVisitor() {
          this.ngContentSelectors = [];
          this.styles = [];
          this.styleUrls = [];
          this.ngNonBindableStackCount = 0;
      }
      TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
          var preparsedElement = preparseElement(ast);
          switch (preparsedElement.type) {
              case PreparsedElementType.NG_CONTENT:
                  if (this.ngNonBindableStackCount === 0) {
                      this.ngContentSelectors.push(preparsedElement.selectAttr);
                  }
                  break;
              case PreparsedElementType.STYLE:
                  var textContent_1 = '';
                  ast.children.forEach(function (child) {
                      if (child instanceof Text) {
                          textContent_1 += child.value;
                      }
                  });
                  this.styles.push(textContent_1);
                  break;
              case PreparsedElementType.STYLESHEET:
                  this.styleUrls.push(preparsedElement.hrefAttr);
                  break;
              default:
                  break;
          }
          if (preparsedElement.nonBindable) {
              this.ngNonBindableStackCount++;
          }
          visitAll(this, ast.children);
          if (preparsedElement.nonBindable) {
              this.ngNonBindableStackCount--;
          }
          return null;
      };
      TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { visitAll(this, ast.cases); };
      TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) {
          visitAll(this, ast.expression);
      };
      TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
      TemplatePreparseVisitor.prototype.visitAttribute = function (ast, context) { return null; };
      TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
      return TemplatePreparseVisitor;
  }());

  /*
   * Resolve a `Type` for {@link Directive}.
   *
   * This interface can be overridden by the application developer to create custom behavior.
   *
   * See {@link Compiler}
   */
  var DirectiveResolver = (function () {
      function DirectiveResolver(_reflector) {
          if (_reflector === void 0) { _reflector = _angular_core.ɵreflector; }
          this._reflector = _reflector;
      }
      DirectiveResolver.prototype.isDirective = function (type) {
          var typeMetadata = this._reflector.annotations(_angular_core.resolveForwardRef(type));
          return typeMetadata && typeMetadata.some(isDirectiveMetadata);
      };
      /**
       * Return {@link Directive} for a given `Type`.
       */
      DirectiveResolver.prototype.resolve = function (type, throwIfNotFound) {
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          var typeMetadata = this._reflector.annotations(_angular_core.resolveForwardRef(type));
          if (typeMetadata) {
              var metadata = findLast(typeMetadata, isDirectiveMetadata);
              if (metadata) {
                  var propertyMetadata = this._reflector.propMetadata(type);
                  return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
              }
          }
          if (throwIfNotFound) {
              throw new Error("No Directive annotation found on " + _angular_core.ɵstringify(type));
          }
          return null;
      };
      DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
          var inputs = [];
          var outputs = [];
          var host = {};
          var queries = {};
          Object.keys(propertyMetadata).forEach(function (propName) {
              var input = findLast(propertyMetadata[propName], function (a) { return a instanceof _angular_core.Input; });
              if (input) {
                  if (input.bindingPropertyName) {
                      inputs.push(propName + ": " + input.bindingPropertyName);
                  }
                  else {
                      inputs.push(propName);
                  }
              }
              var output = findLast(propertyMetadata[propName], function (a) { return a instanceof _angular_core.Output; });
              if (output) {
                  if (output.bindingPropertyName) {
                      outputs.push(propName + ": " + output.bindingPropertyName);
                  }
                  else {
                      outputs.push(propName);
                  }
              }
              var hostBindings = propertyMetadata[propName].filter(function (a) { return a && a instanceof _angular_core.HostBinding; });
              hostBindings.forEach(function (hostBinding) {
                  if (hostBinding.hostPropertyName) {
                      var startWith = hostBinding.hostPropertyName[0];
                      if (startWith === '(') {
                          throw new Error("@HostBinding can not bind to events. Use @HostListener instead.");
                      }
                      else if (startWith === '[') {
                          throw new Error("@HostBinding parameter should be a property name, 'class.<name>', or 'attr.<name>'.");
                      }
                      host["[" + hostBinding.hostPropertyName + "]"] = propName;
                  }
                  else {
                      host["[" + propName + "]"] = propName;
                  }
              });
              var hostListeners = propertyMetadata[propName].filter(function (a) { return a && a instanceof _angular_core.HostListener; });
              hostListeners.forEach(function (hostListener) {
                  var args = hostListener.args || [];
                  host["(" + hostListener.eventName + ")"] = propName + "(" + args.join(',') + ")";
              });
              var query = findLast(propertyMetadata[propName], function (a) { return a instanceof _angular_core.Query; });
              if (query) {
                  queries[propName] = query;
              }
          });
          return this._merge(dm, inputs, outputs, host, queries, directiveType);
      };
      DirectiveResolver.prototype._extractPublicName = function (def) { return splitAtColon(def, [null, def])[1].trim(); };
      DirectiveResolver.prototype._dedupeBindings = function (bindings) {
          var names = new Set();
          var reversedResult = [];
          // go last to first to allow later entries to overwrite previous entries
          for (var i = bindings.length - 1; i >= 0; i--) {
              var binding = bindings[i];
              var name_1 = this._extractPublicName(binding);
              if (!names.has(name_1)) {
                  names.add(name_1);
                  reversedResult.push(binding);
              }
          }
          return reversedResult.reverse();
      };
      DirectiveResolver.prototype._merge = function (directive, inputs, outputs, host, queries, directiveType) {
          var mergedInputs = this._dedupeBindings(directive.inputs ? directive.inputs.concat(inputs) : inputs);
          var mergedOutputs = this._dedupeBindings(directive.outputs ? directive.outputs.concat(outputs) : outputs);
          var mergedHost = directive.host ? _angular_core.ɵmerge(directive.host, host) : host;
          var mergedQueries = directive.queries ? _angular_core.ɵmerge(directive.queries, queries) : queries;
          if (directive instanceof _angular_core.Component) {
              return new _angular_core.Component({
                  selector: directive.selector,
                  inputs: mergedInputs,
                  outputs: mergedOutputs,
                  host: mergedHost,
                  exportAs: directive.exportAs,
                  moduleId: directive.moduleId,
                  queries: mergedQueries,
                  changeDetection: directive.changeDetection,
                  providers: directive.providers,
                  viewProviders: directive.viewProviders,
                  entryComponents: directive.entryComponents,
                  template: directive.template,
                  templateUrl: directive.templateUrl,
                  styles: directive.styles,
                  styleUrls: directive.styleUrls,
                  encapsulation: directive.encapsulation,
                  animations: directive.animations,
                  interpolation: directive.interpolation
              });
          }
          else {
              return new _angular_core.Directive({
                  selector: directive.selector,
                  inputs: mergedInputs,
                  outputs: mergedOutputs,
                  host: mergedHost,
                  exportAs: directive.exportAs,
                  queries: mergedQueries,
                  providers: directive.providers
              });
          }
      };
      return DirectiveResolver;
  }());
  DirectiveResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  DirectiveResolver.ctorParameters = function () { return [
      { type: _angular_core.ɵReflectorReader, },
  ]; };
  function isDirectiveMetadata(type) {
      return type instanceof _angular_core.Directive;
  }
  function findLast(arr, condition) {
      for (var i = arr.length - 1; i >= 0; i--) {
          if (condition(arr[i])) {
              return arr[i];
          }
      }
      return null;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
  var NG_FACTORY = /\.ngfactory\./;
  function ngfactoryFilePath(filePath) {
      var urlWithSuffix = splitTypescriptSuffix(filePath);
      return urlWithSuffix[0] + ".ngfactory" + urlWithSuffix[1];
  }
  function stripNgFactory(filePath) {
      return filePath.replace(NG_FACTORY, '.');
  }
  function isNgFactoryFile(filePath) {
      return NG_FACTORY.test(filePath);
  }
  function splitTypescriptSuffix(path) {
      if (path.endsWith('.d.ts')) {
          return [path.slice(0, -5), '.ts'];
      }
      var lastDot = path.lastIndexOf('.');
      if (lastDot !== -1) {
          return [path.substring(0, lastDot), path.substring(lastDot)];
      }
      return [path, ''];
  }
  function summaryFileName(fileName) {
      var fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
      return fileNameWithoutSuffix + ".ngsummary.json";
  }

  function hasLifecycleHook(hook, token) {
      return _angular_core.ɵreflector.hasLifecycleHook(token, getHookName(hook));
  }
  function getHookName(hook) {
      switch (hook) {
          case _angular_core.ɵLifecycleHooks.OnInit:
              return 'ngOnInit';
          case _angular_core.ɵLifecycleHooks.OnDestroy:
              return 'ngOnDestroy';
          case _angular_core.ɵLifecycleHooks.DoCheck:
              return 'ngDoCheck';
          case _angular_core.ɵLifecycleHooks.OnChanges:
              return 'ngOnChanges';
          case _angular_core.ɵLifecycleHooks.AfterContentInit:
              return 'ngAfterContentInit';
          case _angular_core.ɵLifecycleHooks.AfterContentChecked:
              return 'ngAfterContentChecked';
          case _angular_core.ɵLifecycleHooks.AfterViewInit:
              return 'ngAfterViewInit';
          case _angular_core.ɵLifecycleHooks.AfterViewChecked:
              return 'ngAfterViewChecked';
      }
  }

  function _isNgModuleMetadata(obj) {
      return obj instanceof _angular_core.NgModule;
  }
  /**
   * Resolves types to {@link NgModule}.
   */
  var NgModuleResolver = (function () {
      function NgModuleResolver(_reflector) {
          if (_reflector === void 0) { _reflector = _angular_core.ɵreflector; }
          this._reflector = _reflector;
      }
      NgModuleResolver.prototype.isNgModule = function (type) { return this._reflector.annotations(type).some(_isNgModuleMetadata); };
      NgModuleResolver.prototype.resolve = function (type, throwIfNotFound) {
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          var ngModuleMeta = findLast(this._reflector.annotations(type), _isNgModuleMetadata);
          if (ngModuleMeta) {
              return ngModuleMeta;
          }
          else {
              if (throwIfNotFound) {
                  throw new Error("No NgModule metadata found for '" + _angular_core.ɵstringify(type) + "'.");
              }
              return null;
          }
      };
      return NgModuleResolver;
  }());
  NgModuleResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  NgModuleResolver.ctorParameters = function () { return [
      { type: _angular_core.ɵReflectorReader, },
  ]; };

  function _isPipeMetadata(type) {
      return type instanceof _angular_core.Pipe;
  }
  /**
   * Resolve a `Type` for {@link Pipe}.
   *
   * This interface can be overridden by the application developer to create custom behavior.
   *
   * See {@link Compiler}
   */
  var PipeResolver = (function () {
      function PipeResolver(_reflector) {
          if (_reflector === void 0) { _reflector = _angular_core.ɵreflector; }
          this._reflector = _reflector;
      }
      PipeResolver.prototype.isPipe = function (type) {
          var typeMetadata = this._reflector.annotations(_angular_core.resolveForwardRef(type));
          return typeMetadata && typeMetadata.some(_isPipeMetadata);
      };
      /**
       * Return {@link Pipe} for a given `Type`.
       */
      PipeResolver.prototype.resolve = function (type, throwIfNotFound) {
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          var metas = this._reflector.annotations(_angular_core.resolveForwardRef(type));
          if (metas) {
              var annotation = findLast(metas, _isPipeMetadata);
              if (annotation) {
                  return annotation;
              }
          }
          if (throwIfNotFound) {
              throw new Error("No Pipe decorator found on " + _angular_core.ɵstringify(type));
          }
          return null;
      };
      return PipeResolver;
  }());
  PipeResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  PipeResolver.ctorParameters = function () { return [
      { type: _angular_core.ɵReflectorReader, },
  ]; };

  var SummaryResolver = (function () {
      function SummaryResolver() {
      }
      SummaryResolver.prototype.isLibraryFile = function (fileName) { return false; };
      ;
      SummaryResolver.prototype.getLibraryFileName = function (fileName) { return null; };
      SummaryResolver.prototype.resolveSummary = function (reference) { return null; };
      ;
      SummaryResolver.prototype.getSymbolsOf = function (filePath) { return []; };
      SummaryResolver.prototype.getImportAs = function (reference) { return reference; };
      return SummaryResolver;
  }());
  SummaryResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  SummaryResolver.ctorParameters = function () { return []; };

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$17 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ERROR_COLLECTOR_TOKEN = new _angular_core.InjectionToken('ErrorCollector');
  // Design notes:
  // - don't lazily create metadata:
  //   For some metadata, we need to do async work sometimes,
  //   so the user has to kick off this loading.
  //   But we want to report errors even when the async work is
  //   not required to check that the user would have been able
  //   to wait correctly.
  var CompileMetadataResolver = (function () {
      function CompileMetadataResolver(_config, _ngModuleResolver, _directiveResolver, _pipeResolver, _summaryResolver, _schemaRegistry, _directiveNormalizer, _staticSymbolCache, _reflector, _errorCollector) {
          if (_reflector === void 0) { _reflector = _angular_core.ɵreflector; }
          this._config = _config;
          this._ngModuleResolver = _ngModuleResolver;
          this._directiveResolver = _directiveResolver;
          this._pipeResolver = _pipeResolver;
          this._summaryResolver = _summaryResolver;
          this._schemaRegistry = _schemaRegistry;
          this._directiveNormalizer = _directiveNormalizer;
          this._staticSymbolCache = _staticSymbolCache;
          this._reflector = _reflector;
          this._errorCollector = _errorCollector;
          this._nonNormalizedDirectiveCache = new Map();
          this._directiveCache = new Map();
          this._summaryCache = new Map();
          this._pipeCache = new Map();
          this._ngModuleCache = new Map();
          this._ngModuleOfTypes = new Map();
      }
      CompileMetadataResolver.prototype.clearCacheFor = function (type) {
          var dirMeta = this._directiveCache.get(type);
          this._directiveCache.delete(type);
          this._nonNormalizedDirectiveCache.delete(type);
          this._summaryCache.delete(type);
          this._pipeCache.delete(type);
          this._ngModuleOfTypes.delete(type);
          // Clear all of the NgModule as they contain transitive information!
          this._ngModuleCache.clear();
          if (dirMeta) {
              this._directiveNormalizer.clearCacheFor(dirMeta);
          }
      };
      CompileMetadataResolver.prototype.clearCache = function () {
          this._directiveCache.clear();
          this._nonNormalizedDirectiveCache.clear();
          this._summaryCache.clear();
          this._pipeCache.clear();
          this._ngModuleCache.clear();
          this._ngModuleOfTypes.clear();
          this._directiveNormalizer.clearCache();
      };
      CompileMetadataResolver.prototype._createProxyClass = function (baseType, name) {
          var delegate = null;
          var proxyClass = function () {
              if (!delegate) {
                  throw new Error("Illegal state: Class " + name + " for type " + _angular_core.ɵstringify(baseType) + " is not compiled yet!");
              }
              return delegate.apply(this, arguments);
          };
          proxyClass.setDelegate = function (d) {
              delegate = d;
              proxyClass.prototype = d.prototype;
          };
          // Make stringify work correctly
          proxyClass.overriddenName = name;
          return proxyClass;
      };
      CompileMetadataResolver.prototype.getGeneratedClass = function (dirType, name) {
          if (dirType instanceof StaticSymbol) {
              return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), name);
          }
          else {
              return this._createProxyClass(dirType, name);
          }
      };
      CompileMetadataResolver.prototype.getComponentViewClass = function (dirType) {
          return this.getGeneratedClass(dirType, viewClassName(dirType, 0));
      };
      CompileMetadataResolver.prototype.getHostComponentViewClass = function (dirType) {
          return this.getGeneratedClass(dirType, hostViewClassName(dirType));
      };
      CompileMetadataResolver.prototype.getHostComponentType = function (dirType) {
          var name = identifierName({ reference: dirType }) + "_Host";
          if (dirType instanceof StaticSymbol) {
              return this._staticSymbolCache.get(dirType.filePath, name);
          }
          else {
              var HostClass = function HostClass() { };
              HostClass.overriddenName = name;
              return HostClass;
          }
      };
      CompileMetadataResolver.prototype.getRendererType = function (dirType) {
          if (dirType instanceof StaticSymbol) {
              return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), rendererTypeName(dirType));
          }
          else {
              // returning an object as proxy,
              // that we fill later during runtime compilation.
              return {};
          }
      };
      CompileMetadataResolver.prototype.getComponentFactory = function (selector, dirType) {
          if (dirType instanceof StaticSymbol) {
              return this._staticSymbolCache.get(ngfactoryFilePath(dirType.filePath), componentFactoryName(dirType));
          }
          else {
              var hostView = this.getHostComponentViewClass(dirType);
              return _angular_core.ɵccf(selector, dirType, hostView);
          }
      };
      CompileMetadataResolver.prototype._loadSummary = function (type, kind) {
          var typeSummary = this._summaryCache.get(type);
          if (!typeSummary) {
              var summary = this._summaryResolver.resolveSummary(type);
              typeSummary = summary ? summary.type : null;
              this._summaryCache.set(type, typeSummary);
          }
          return typeSummary && typeSummary.summaryKind === kind ? typeSummary : null;
      };
      CompileMetadataResolver.prototype._loadDirectiveMetadata = function (directiveType, isSync) {
          var _this = this;
          if (this._directiveCache.has(directiveType)) {
              return;
          }
          directiveType = _angular_core.resolveForwardRef(directiveType);
          var _a = this.getNonNormalizedDirectiveMetadata(directiveType), annotation = _a.annotation, metadata = _a.metadata;
          var createDirectiveMetadata = function (templateMetadata) {
              var normalizedDirMeta = new CompileDirectiveMetadata({
                  type: metadata.type,
                  isComponent: metadata.isComponent,
                  selector: metadata.selector,
                  exportAs: metadata.exportAs,
                  changeDetection: metadata.changeDetection,
                  inputs: metadata.inputs,
                  outputs: metadata.outputs,
                  hostListeners: metadata.hostListeners,
                  hostProperties: metadata.hostProperties,
                  hostAttributes: metadata.hostAttributes,
                  providers: metadata.providers,
                  viewProviders: metadata.viewProviders,
                  queries: metadata.queries,
                  viewQueries: metadata.viewQueries,
                  entryComponents: metadata.entryComponents,
                  componentViewType: metadata.componentViewType,
                  rendererType: metadata.rendererType,
                  componentFactory: metadata.componentFactory,
                  template: templateMetadata
              });
              _this._directiveCache.set(directiveType, normalizedDirMeta);
              _this._summaryCache.set(directiveType, normalizedDirMeta.toSummary());
              return normalizedDirMeta;
          };
          if (metadata.isComponent) {
              var templateMeta = this._directiveNormalizer.normalizeTemplate({
                  componentType: directiveType,
                  moduleUrl: componentModuleUrl(this._reflector, directiveType, annotation),
                  encapsulation: metadata.template.encapsulation,
                  template: metadata.template.template,
                  templateUrl: metadata.template.templateUrl,
                  styles: metadata.template.styles,
                  styleUrls: metadata.template.styleUrls,
                  animations: metadata.template.animations,
                  interpolation: metadata.template.interpolation
              });
              if (templateMeta.syncResult) {
                  createDirectiveMetadata(templateMeta.syncResult);
                  return null;
              }
              else {
                  if (isSync) {
                      this._reportError(componentStillLoadingError(directiveType), directiveType);
                      return null;
                  }
                  return templateMeta.asyncResult.then(createDirectiveMetadata);
              }
          }
          else {
              // directive
              createDirectiveMetadata(null);
              return null;
          }
      };
      CompileMetadataResolver.prototype.getNonNormalizedDirectiveMetadata = function (directiveType) {
          var _this = this;
          directiveType = _angular_core.resolveForwardRef(directiveType);
          if (!directiveType) {
              return null;
          }
          var cacheEntry = this._nonNormalizedDirectiveCache.get(directiveType);
          if (cacheEntry) {
              return cacheEntry;
          }
          var dirMeta = this._directiveResolver.resolve(directiveType, false);
          if (!dirMeta) {
              return null;
          }
          var nonNormalizedTemplateMetadata;
          if (dirMeta instanceof _angular_core.Component) {
              // component
              assertArrayOfStrings('styles', dirMeta.styles);
              assertArrayOfStrings('styleUrls', dirMeta.styleUrls);
              assertInterpolationSymbols('interpolation', dirMeta.interpolation);
              var animations = dirMeta.animations;
              nonNormalizedTemplateMetadata = new CompileTemplateMetadata({
                  encapsulation: dirMeta.encapsulation,
                  template: dirMeta.template,
                  templateUrl: dirMeta.templateUrl,
                  styles: dirMeta.styles,
                  styleUrls: dirMeta.styleUrls,
                  animations: animations,
                  interpolation: dirMeta.interpolation
              });
          }
          var changeDetectionStrategy = null;
          var viewProviders = [];
          var entryComponentMetadata = [];
          var selector = dirMeta.selector;
          if (dirMeta instanceof _angular_core.Component) {
              // Component
              changeDetectionStrategy = dirMeta.changeDetection;
              if (dirMeta.viewProviders) {
                  viewProviders = this._getProvidersMetadata(dirMeta.viewProviders, entryComponentMetadata, "viewProviders for \"" + stringifyType(directiveType) + "\"", [], directiveType);
              }
              if (dirMeta.entryComponents) {
                  entryComponentMetadata = flattenAndDedupeArray(dirMeta.entryComponents)
                      .map(function (type) { return _this._getEntryComponentMetadata(type); })
                      .concat(entryComponentMetadata);
              }
              if (!selector) {
                  selector = this._schemaRegistry.getDefaultComponentElementName();
              }
          }
          else {
              // Directive
              if (!selector) {
                  this._reportError(syntaxError("Directive " + stringifyType(directiveType) + " has no selector, please add it!"), directiveType);
                  selector = 'error';
              }
          }
          var providers = [];
          if (dirMeta.providers != null) {
              providers = this._getProvidersMetadata(dirMeta.providers, entryComponentMetadata, "providers for \"" + stringifyType(directiveType) + "\"", [], directiveType);
          }
          var queries = [];
          var viewQueries = [];
          if (dirMeta.queries != null) {
              queries = this._getQueriesMetadata(dirMeta.queries, false, directiveType);
              viewQueries = this._getQueriesMetadata(dirMeta.queries, true, directiveType);
          }
          var metadata = CompileDirectiveMetadata.create({
              selector: selector,
              exportAs: dirMeta.exportAs,
              isComponent: !!nonNormalizedTemplateMetadata,
              type: this._getTypeMetadata(directiveType),
              template: nonNormalizedTemplateMetadata,
              changeDetection: changeDetectionStrategy,
              inputs: dirMeta.inputs,
              outputs: dirMeta.outputs,
              host: dirMeta.host,
              providers: providers,
              viewProviders: viewProviders,
              queries: queries,
              viewQueries: viewQueries,
              entryComponents: entryComponentMetadata,
              componentViewType: nonNormalizedTemplateMetadata ? this.getComponentViewClass(directiveType) :
                  undefined,
              rendererType: nonNormalizedTemplateMetadata ? this.getRendererType(directiveType) : undefined,
              componentFactory: nonNormalizedTemplateMetadata ?
                  this.getComponentFactory(selector, directiveType) :
                  undefined
          });
          cacheEntry = { metadata: metadata, annotation: dirMeta };
          this._nonNormalizedDirectiveCache.set(directiveType, cacheEntry);
          return cacheEntry;
      };
      /**
       * Gets the metadata for the given directive.
       * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
       */
      CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
          var dirMeta = this._directiveCache.get(directiveType);
          if (!dirMeta) {
              this._reportError(syntaxError("Illegal state: getDirectiveMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Directive " + stringifyType(directiveType) + "."), directiveType);
          }
          return dirMeta;
      };
      CompileMetadataResolver.prototype.getDirectiveSummary = function (dirType) {
          var dirSummary = this._loadSummary(dirType, exports.CompileSummaryKind.Directive);
          if (!dirSummary) {
              this._reportError(syntaxError("Illegal state: Could not load the summary for directive " + stringifyType(dirType) + "."), dirType);
          }
          return dirSummary;
      };
      CompileMetadataResolver.prototype.isDirective = function (type) { return this._directiveResolver.isDirective(type); };
      CompileMetadataResolver.prototype.isPipe = function (type) { return this._pipeResolver.isPipe(type); };
      CompileMetadataResolver.prototype.getNgModuleSummary = function (moduleType) {
          var moduleSummary = this._loadSummary(moduleType, exports.CompileSummaryKind.NgModule);
          if (!moduleSummary) {
              var moduleMeta = this.getNgModuleMetadata(moduleType, false);
              moduleSummary = moduleMeta ? moduleMeta.toSummary() : null;
              if (moduleSummary) {
                  this._summaryCache.set(moduleType, moduleSummary);
              }
          }
          return moduleSummary;
      };
      /**
       * Loads the declared directives and pipes of an NgModule.
       */
      CompileMetadataResolver.prototype.loadNgModuleDirectiveAndPipeMetadata = function (moduleType, isSync, throwIfNotFound) {
          var _this = this;
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          var ngModule = this.getNgModuleMetadata(moduleType, throwIfNotFound);
          var loading = [];
          if (ngModule) {
              ngModule.declaredDirectives.forEach(function (id) {
                  var promise = _this._loadDirectiveMetadata(id.reference, isSync);
                  if (promise) {
                      loading.push(promise);
                  }
              });
              ngModule.declaredPipes.forEach(function (id) { return _this._loadPipeMetadata(id.reference); });
          }
          return Promise.all(loading);
      };
      CompileMetadataResolver.prototype.getNgModuleMetadata = function (moduleType, throwIfNotFound) {
          var _this = this;
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          moduleType = _angular_core.resolveForwardRef(moduleType);
          var compileMeta = this._ngModuleCache.get(moduleType);
          if (compileMeta) {
              return compileMeta;
          }
          var meta = this._ngModuleResolver.resolve(moduleType, throwIfNotFound);
          if (!meta) {
              return null;
          }
          var declaredDirectives = [];
          var exportedNonModuleIdentifiers = [];
          var declaredPipes = [];
          var importedModules = [];
          var exportedModules = [];
          var providers = [];
          var entryComponents = [];
          var bootstrapComponents = [];
          var schemas = [];
          if (meta.imports) {
              flattenAndDedupeArray(meta.imports).forEach(function (importedType) {
                  var importedModuleType;
                  if (isValidType(importedType)) {
                      importedModuleType = importedType;
                  }
                  else if (importedType && importedType.ngModule) {
                      var moduleWithProviders = importedType;
                      importedModuleType = moduleWithProviders.ngModule;
                      if (moduleWithProviders.providers) {
                          providers.push.apply(providers, _this._getProvidersMetadata(moduleWithProviders.providers, entryComponents, "provider for the NgModule '" + stringifyType(importedModuleType) + "'", [], importedType));
                      }
                  }
                  if (importedModuleType) {
                      if (_this._checkSelfImport(moduleType, importedModuleType))
                          return;
                      var importedModuleSummary = _this.getNgModuleSummary(importedModuleType);
                      if (!importedModuleSummary) {
                          _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(importedType) + " '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                          return;
                      }
                      importedModules.push(importedModuleSummary);
                  }
                  else {
                      _this._reportError(syntaxError("Unexpected value '" + stringifyType(importedType) + "' imported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                      return;
                  }
              });
          }
          if (meta.exports) {
              flattenAndDedupeArray(meta.exports).forEach(function (exportedType) {
                  if (!isValidType(exportedType)) {
                      _this._reportError(syntaxError("Unexpected value '" + stringifyType(exportedType) + "' exported by the module '" + stringifyType(moduleType) + "'"), moduleType);
                      return;
                  }
                  var exportedModuleSummary = _this.getNgModuleSummary(exportedType);
                  if (exportedModuleSummary) {
                      exportedModules.push(exportedModuleSummary);
                  }
                  else {
                      exportedNonModuleIdentifiers.push(_this._getIdentifierMetadata(exportedType));
                  }
              });
          }
          // Note: This will be modified later, so we rely on
          // getting a new instance every time!
          var transitiveModule = this._getTransitiveNgModuleMetadata(importedModules, exportedModules);
          if (meta.declarations) {
              flattenAndDedupeArray(meta.declarations).forEach(function (declaredType) {
                  if (!isValidType(declaredType)) {
                      _this._reportError(syntaxError("Unexpected value '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                      return;
                  }
                  var declaredIdentifier = _this._getIdentifierMetadata(declaredType);
                  if (_this._directiveResolver.isDirective(declaredType)) {
                      transitiveModule.addDirective(declaredIdentifier);
                      declaredDirectives.push(declaredIdentifier);
                      _this._addTypeToModule(declaredType, moduleType);
                  }
                  else if (_this._pipeResolver.isPipe(declaredType)) {
                      transitiveModule.addPipe(declaredIdentifier);
                      transitiveModule.pipes.push(declaredIdentifier);
                      declaredPipes.push(declaredIdentifier);
                      _this._addTypeToModule(declaredType, moduleType);
                  }
                  else {
                      _this._reportError(syntaxError("Unexpected " + _this._getTypeDescriptor(declaredType) + " '" + stringifyType(declaredType) + "' declared by the module '" + stringifyType(moduleType) + "'"), moduleType);
                      return;
                  }
              });
          }
          var exportedDirectives = [];
          var exportedPipes = [];
          exportedNonModuleIdentifiers.forEach(function (exportedId) {
              if (transitiveModule.directivesSet.has(exportedId.reference)) {
                  exportedDirectives.push(exportedId);
                  transitiveModule.addExportedDirective(exportedId);
              }
              else if (transitiveModule.pipesSet.has(exportedId.reference)) {
                  exportedPipes.push(exportedId);
                  transitiveModule.addExportedPipe(exportedId);
              }
              else {
                  _this._reportError(syntaxError("Can't export " + _this._getTypeDescriptor(exportedId.reference) + " " + stringifyType(exportedId.reference) + " from " + stringifyType(moduleType) + " as it was neither declared nor imported!"), moduleType);
              }
          });
          // The providers of the module have to go last
          // so that they overwrite any other provider we already added.
          if (meta.providers) {
              providers.push.apply(providers, this._getProvidersMetadata(meta.providers, entryComponents, "provider for the NgModule '" + stringifyType(moduleType) + "'", [], moduleType));
          }
          if (meta.entryComponents) {
              entryComponents.push.apply(entryComponents, flattenAndDedupeArray(meta.entryComponents)
                  .map(function (type) { return _this._getEntryComponentMetadata(type); }));
          }
          if (meta.bootstrap) {
              flattenAndDedupeArray(meta.bootstrap).forEach(function (type) {
                  if (!isValidType(type)) {
                      _this._reportError(syntaxError("Unexpected value '" + stringifyType(type) + "' used in the bootstrap property of module '" + stringifyType(moduleType) + "'"), moduleType);
                      return;
                  }
                  bootstrapComponents.push(_this._getIdentifierMetadata(type));
              });
          }
          entryComponents.push.apply(entryComponents, bootstrapComponents.map(function (type) { return _this._getEntryComponentMetadata(type.reference); }));
          if (meta.schemas) {
              schemas.push.apply(schemas, flattenAndDedupeArray(meta.schemas));
          }
          compileMeta = new CompileNgModuleMetadata({
              type: this._getTypeMetadata(moduleType),
              providers: providers,
              entryComponents: entryComponents,
              bootstrapComponents: bootstrapComponents,
              schemas: schemas,
              declaredDirectives: declaredDirectives,
              exportedDirectives: exportedDirectives,
              declaredPipes: declaredPipes,
              exportedPipes: exportedPipes,
              importedModules: importedModules,
              exportedModules: exportedModules,
              transitiveModule: transitiveModule,
              id: meta.id,
          });
          entryComponents.forEach(function (id) { return transitiveModule.addEntryComponent(id); });
          providers.forEach(function (provider) { return transitiveModule.addProvider(provider, compileMeta.type); });
          transitiveModule.addModule(compileMeta.type);
          this._ngModuleCache.set(moduleType, compileMeta);
          return compileMeta;
      };
      CompileMetadataResolver.prototype._checkSelfImport = function (moduleType, importedModuleType) {
          if (moduleType === importedModuleType) {
              this._reportError(syntaxError("'" + stringifyType(moduleType) + "' module can't import itself"), moduleType);
              return true;
          }
          return false;
      };
      CompileMetadataResolver.prototype._getTypeDescriptor = function (type) {
          if (this._directiveResolver.isDirective(type)) {
              return 'directive';
          }
          if (this._pipeResolver.isPipe(type)) {
              return 'pipe';
          }
          if (this._ngModuleResolver.isNgModule(type)) {
              return 'module';
          }
          if (type.provide) {
              return 'provider';
          }
          return 'value';
      };
      CompileMetadataResolver.prototype._addTypeToModule = function (type, moduleType) {
          var oldModule = this._ngModuleOfTypes.get(type);
          if (oldModule && oldModule !== moduleType) {
              this._reportError(syntaxError("Type " + stringifyType(type) + " is part of the declarations of 2 modules: " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + "! " +
                  ("Please consider moving " + stringifyType(type) + " to a higher module that imports " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ". ") +
                  ("You can also create a new NgModule that exports and includes " + stringifyType(type) + " then import that NgModule in " + stringifyType(oldModule) + " and " + stringifyType(moduleType) + ".")), moduleType);
          }
          this._ngModuleOfTypes.set(type, moduleType);
      };
      CompileMetadataResolver.prototype._getTransitiveNgModuleMetadata = function (importedModules, exportedModules) {
          // collect `providers` / `entryComponents` from all imported and all exported modules
          var result = new TransitiveCompileNgModuleMetadata();
          var modulesByToken = new Map();
          importedModules.concat(exportedModules).forEach(function (modSummary) {
              modSummary.modules.forEach(function (mod) { return result.addModule(mod); });
              modSummary.entryComponents.forEach(function (comp) { return result.addEntryComponent(comp); });
              var addedTokens = new Set();
              modSummary.providers.forEach(function (entry) {
                  var tokenRef = tokenReference(entry.provider.token);
                  var prevModules = modulesByToken.get(tokenRef);
                  if (!prevModules) {
                      prevModules = new Set();
                      modulesByToken.set(tokenRef, prevModules);
                  }
                  var moduleRef = entry.module.reference;
                  // Note: the providers of one module may still contain multiple providers
                  // per token (e.g. for multi providers), and we need to preserve these.
                  if (addedTokens.has(tokenRef) || !prevModules.has(moduleRef)) {
                      prevModules.add(moduleRef);
                      addedTokens.add(tokenRef);
                      result.addProvider(entry.provider, entry.module);
                  }
              });
          });
          exportedModules.forEach(function (modSummary) {
              modSummary.exportedDirectives.forEach(function (id) { return result.addExportedDirective(id); });
              modSummary.exportedPipes.forEach(function (id) { return result.addExportedPipe(id); });
          });
          importedModules.forEach(function (modSummary) {
              modSummary.exportedDirectives.forEach(function (id) { return result.addDirective(id); });
              modSummary.exportedPipes.forEach(function (id) { return result.addPipe(id); });
          });
          return result;
      };
      CompileMetadataResolver.prototype._getIdentifierMetadata = function (type) {
          type = _angular_core.resolveForwardRef(type);
          return { reference: type };
      };
      CompileMetadataResolver.prototype.isInjectable = function (type) {
          var annotations = this._reflector.annotations(type);
          // Note: We need an exact check here as @Component / @Directive / ... inherit
          // from @CompilerInjectable!
          return annotations.some(function (ann) { return ann.constructor === _angular_core.Injectable; });
      };
      CompileMetadataResolver.prototype.getInjectableSummary = function (type) {
          return { summaryKind: exports.CompileSummaryKind.Injectable, type: this._getTypeMetadata(type) };
      };
      CompileMetadataResolver.prototype._getInjectableMetadata = function (type, dependencies) {
          if (dependencies === void 0) { dependencies = null; }
          var typeSummary = this._loadSummary(type, exports.CompileSummaryKind.Injectable);
          if (typeSummary) {
              return typeSummary.type;
          }
          return this._getTypeMetadata(type, dependencies);
      };
      CompileMetadataResolver.prototype._getTypeMetadata = function (type, dependencies) {
          if (dependencies === void 0) { dependencies = null; }
          var identifier = this._getIdentifierMetadata(type);
          return {
              reference: identifier.reference,
              diDeps: this._getDependenciesMetadata(identifier.reference, dependencies),
              lifecycleHooks: _angular_core.ɵLIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(hook, identifier.reference); }),
          };
      };
      CompileMetadataResolver.prototype._getFactoryMetadata = function (factory, dependencies) {
          if (dependencies === void 0) { dependencies = null; }
          factory = _angular_core.resolveForwardRef(factory);
          return { reference: factory, diDeps: this._getDependenciesMetadata(factory, dependencies) };
      };
      /**
       * Gets the metadata for the given pipe.
       * This assumes `loadNgModuleDirectiveAndPipeMetadata` has been called first.
       */
      CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
          var pipeMeta = this._pipeCache.get(pipeType);
          if (!pipeMeta) {
              this._reportError(syntaxError("Illegal state: getPipeMetadata can only be called after loadNgModuleDirectiveAndPipeMetadata for a module that declares it. Pipe " + stringifyType(pipeType) + "."), pipeType);
          }
          return pipeMeta;
      };
      CompileMetadataResolver.prototype.getPipeSummary = function (pipeType) {
          var pipeSummary = this._loadSummary(pipeType, exports.CompileSummaryKind.Pipe);
          if (!pipeSummary) {
              this._reportError(syntaxError("Illegal state: Could not load the summary for pipe " + stringifyType(pipeType) + "."), pipeType);
          }
          return pipeSummary;
      };
      CompileMetadataResolver.prototype.getOrLoadPipeMetadata = function (pipeType) {
          var pipeMeta = this._pipeCache.get(pipeType);
          if (!pipeMeta) {
              pipeMeta = this._loadPipeMetadata(pipeType);
          }
          return pipeMeta;
      };
      CompileMetadataResolver.prototype._loadPipeMetadata = function (pipeType) {
          pipeType = _angular_core.resolveForwardRef(pipeType);
          var pipeAnnotation = this._pipeResolver.resolve(pipeType);
          var pipeMeta = new CompilePipeMetadata({
              type: this._getTypeMetadata(pipeType),
              name: pipeAnnotation.name,
              pure: pipeAnnotation.pure
          });
          this._pipeCache.set(pipeType, pipeMeta);
          this._summaryCache.set(pipeType, pipeMeta.toSummary());
          return pipeMeta;
      };
      CompileMetadataResolver.prototype._getDependenciesMetadata = function (typeOrFunc, dependencies) {
          var _this = this;
          var hasUnknownDeps = false;
          var params = dependencies || this._reflector.parameters(typeOrFunc) || [];
          var dependenciesMetadata = params.map(function (param) {
              var isAttribute = false;
              var isHost = false;
              var isSelf = false;
              var isSkipSelf = false;
              var isOptional = false;
              var token = null;
              if (Array.isArray(param)) {
                  param.forEach(function (paramEntry) {
                      if (paramEntry instanceof _angular_core.Host) {
                          isHost = true;
                      }
                      else if (paramEntry instanceof _angular_core.Self) {
                          isSelf = true;
                      }
                      else if (paramEntry instanceof _angular_core.SkipSelf) {
                          isSkipSelf = true;
                      }
                      else if (paramEntry instanceof _angular_core.Optional) {
                          isOptional = true;
                      }
                      else if (paramEntry instanceof _angular_core.Attribute) {
                          isAttribute = true;
                          token = paramEntry.attributeName;
                      }
                      else if (paramEntry instanceof _angular_core.Inject) {
                          token = paramEntry.token;
                      }
                      else if (paramEntry instanceof _angular_core.InjectionToken) {
                          token = paramEntry;
                      }
                      else if (isValidType(paramEntry) && token == null) {
                          token = paramEntry;
                      }
                  });
              }
              else {
                  token = param;
              }
              if (token == null) {
                  hasUnknownDeps = true;
                  return null;
              }
              return {
                  isAttribute: isAttribute,
                  isHost: isHost,
                  isSelf: isSelf,
                  isSkipSelf: isSkipSelf,
                  isOptional: isOptional,
                  token: _this._getTokenMetadata(token)
              };
          });
          if (hasUnknownDeps) {
              var depsTokens = dependenciesMetadata.map(function (dep) { return dep ? stringifyType(dep.token) : '?'; }).join(', ');
              this._reportError(syntaxError("Can't resolve all parameters for " + stringifyType(typeOrFunc) + ": (" + depsTokens + ")."), typeOrFunc);
          }
          return dependenciesMetadata;
      };
      CompileMetadataResolver.prototype._getTokenMetadata = function (token) {
          token = _angular_core.resolveForwardRef(token);
          var compileToken;
          if (typeof token === 'string') {
              compileToken = { value: token };
          }
          else {
              compileToken = { identifier: { reference: token } };
          }
          return compileToken;
      };
      CompileMetadataResolver.prototype._getProvidersMetadata = function (providers, targetEntryComponents, debugInfo, compileProviders, type) {
          var _this = this;
          if (compileProviders === void 0) { compileProviders = []; }
          providers.forEach(function (provider, providerIdx) {
              if (Array.isArray(provider)) {
                  _this._getProvidersMetadata(provider, targetEntryComponents, debugInfo, compileProviders);
              }
              else {
                  provider = _angular_core.resolveForwardRef(provider);
                  var providerMeta = void 0;
                  if (provider && typeof provider === 'object' && provider.hasOwnProperty('provide')) {
                      _this._validateProvider(provider);
                      providerMeta = new ProviderMeta(provider.provide, provider);
                  }
                  else if (isValidType(provider)) {
                      providerMeta = new ProviderMeta(provider, { useClass: provider });
                  }
                  else if (provider === void 0) {
                      _this._reportError(syntaxError("Encountered undefined provider! Usually this means you have a circular dependencies (might be caused by using 'barrel' index.ts files."));
                  }
                  else {
                      var providersInfo = providers.reduce(function (soFar, seenProvider, seenProviderIdx) {
                          if (seenProviderIdx < providerIdx) {
                              soFar.push("" + stringifyType(seenProvider));
                          }
                          else if (seenProviderIdx == providerIdx) {
                              soFar.push("?" + stringifyType(seenProvider) + "?");
                          }
                          else if (seenProviderIdx == providerIdx + 1) {
                              soFar.push('...');
                          }
                          return soFar;
                      }, [])
                          .join(', ');
                      _this._reportError(syntaxError("Invalid " + (debugInfo ? debugInfo : 'provider') + " - only instances of Provider and Type are allowed, got: [" + providersInfo + "]"), type);
                  }
                  if (providerMeta.token === resolveIdentifier(Identifiers.ANALYZE_FOR_ENTRY_COMPONENTS)) {
                      targetEntryComponents.push.apply(targetEntryComponents, _this._getEntryComponentsFromProvider(providerMeta, type));
                  }
                  else {
                      compileProviders.push(_this.getProviderMetadata(providerMeta));
                  }
              }
          });
          return compileProviders;
      };
      CompileMetadataResolver.prototype._validateProvider = function (provider) {
          if (provider.hasOwnProperty('useClass') && provider.useClass == null) {
              this._reportError(syntaxError("Invalid provider for " + stringifyType(provider.provide) + ". useClass cannot be " + provider.useClass + ".\n           Usually it happens when:\n           1. There's a circular dependency (might be caused by using index.ts (barrel) files).\n           2. Class was used before it was declared. Use forwardRef in this case."));
          }
      };
      CompileMetadataResolver.prototype._getEntryComponentsFromProvider = function (provider, type) {
          var _this = this;
          var components = [];
          var collectedIdentifiers = [];
          if (provider.useFactory || provider.useExisting || provider.useClass) {
              this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports useValue!"), type);
              return [];
          }
          if (!provider.multi) {
              this._reportError(syntaxError("The ANALYZE_FOR_ENTRY_COMPONENTS token only supports 'multi = true'!"), type);
              return [];
          }
          extractIdentifiers(provider.useValue, collectedIdentifiers);
          collectedIdentifiers.forEach(function (identifier) {
              var entry = _this._getEntryComponentMetadata(identifier.reference, false);
              if (entry) {
                  components.push(entry);
              }
          });
          return components;
      };
      CompileMetadataResolver.prototype._getEntryComponentMetadata = function (dirType, throwIfNotFound) {
          if (throwIfNotFound === void 0) { throwIfNotFound = true; }
          var dirMeta = this.getNonNormalizedDirectiveMetadata(dirType);
          if (dirMeta && dirMeta.metadata.isComponent) {
              return { componentType: dirType, componentFactory: dirMeta.metadata.componentFactory };
          }
          else {
              var dirSummary = this._loadSummary(dirType, exports.CompileSummaryKind.Directive);
              if (dirSummary && dirSummary.isComponent) {
                  return { componentType: dirType, componentFactory: dirSummary.componentFactory };
              }
          }
          if (throwIfNotFound) {
              throw syntaxError(dirType.name + " cannot be used as an entry component.");
          }
      };
      CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
          var compileDeps;
          var compileTypeMetadata = null;
          var compileFactoryMetadata = null;
          var token = this._getTokenMetadata(provider.token);
          if (provider.useClass) {
              compileTypeMetadata = this._getInjectableMetadata(provider.useClass, provider.dependencies);
              compileDeps = compileTypeMetadata.diDeps;
              if (provider.token === provider.useClass) {
                  // use the compileTypeMetadata as it contains information about lifecycleHooks...
                  token = { identifier: compileTypeMetadata };
              }
          }
          else if (provider.useFactory) {
              compileFactoryMetadata = this._getFactoryMetadata(provider.useFactory, provider.dependencies);
              compileDeps = compileFactoryMetadata.diDeps;
          }
          return {
              token: token,
              useClass: compileTypeMetadata,
              useValue: provider.useValue,
              useFactory: compileFactoryMetadata,
              useExisting: provider.useExisting ? this._getTokenMetadata(provider.useExisting) : null,
              deps: compileDeps,
              multi: provider.multi
          };
      };
      CompileMetadataResolver.prototype._getQueriesMetadata = function (queries, isViewQuery, directiveType) {
          var _this = this;
          var res = [];
          Object.keys(queries).forEach(function (propertyName) {
              var query = queries[propertyName];
              if (query.isViewQuery === isViewQuery) {
                  res.push(_this._getQueryMetadata(query, propertyName, directiveType));
              }
          });
          return res;
      };
      CompileMetadataResolver.prototype._queryVarBindings = function (selector) { return selector.split(/\s*,\s*/); };
      CompileMetadataResolver.prototype._getQueryMetadata = function (q, propertyName, typeOrFunc) {
          var _this = this;
          var selectors;
          if (typeof q.selector === 'string') {
              selectors =
                  this._queryVarBindings(q.selector).map(function (varName) { return _this._getTokenMetadata(varName); });
          }
          else {
              if (!q.selector) {
                  this._reportError(syntaxError("Can't construct a query for the property \"" + propertyName + "\" of \"" + stringifyType(typeOrFunc) + "\" since the query selector wasn't defined."), typeOrFunc);
              }
              selectors = [this._getTokenMetadata(q.selector)];
          }
          return {
              selectors: selectors,
              first: q.first,
              descendants: q.descendants, propertyName: propertyName,
              read: q.read ? this._getTokenMetadata(q.read) : null
          };
      };
      CompileMetadataResolver.prototype._reportError = function (error, type, otherType) {
          if (this._errorCollector) {
              this._errorCollector(error, type);
              if (otherType) {
                  this._errorCollector(error, otherType);
              }
          }
          else {
              throw error;
          }
      };
      return CompileMetadataResolver;
  }());
  CompileMetadataResolver.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  CompileMetadataResolver.ctorParameters = function () { return [
      { type: CompilerConfig, },
      { type: NgModuleResolver, },
      { type: DirectiveResolver, },
      { type: PipeResolver, },
      { type: SummaryResolver, },
      { type: ElementSchemaRegistry, },
      { type: DirectiveNormalizer, },
      { type: StaticSymbolCache, decorators: [{ type: _angular_core.Optional },] },
      { type: _angular_core.ɵReflectorReader, },
      { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [ERROR_COLLECTOR_TOKEN,] },] },
  ]; };
  function flattenArray(tree, out) {
      if (out === void 0) { out = []; }
      if (tree) {
          for (var i = 0; i < tree.length; i++) {
              var item = _angular_core.resolveForwardRef(tree[i]);
              if (Array.isArray(item)) {
                  flattenArray(item, out);
              }
              else {
                  out.push(item);
              }
          }
      }
      return out;
  }
  function dedupeArray(array) {
      if (array) {
          return Array.from(new Set(array));
      }
      return [];
  }
  function flattenAndDedupeArray(tree) {
      return dedupeArray(flattenArray(tree));
  }
  function isValidType(value) {
      return (value instanceof StaticSymbol) || (value instanceof _angular_core.Type);
  }
  function componentModuleUrl(reflector, type, cmpMetadata) {
      if (type instanceof StaticSymbol) {
          return type.filePath;
      }
      var moduleId = cmpMetadata.moduleId;
      if (typeof moduleId === 'string') {
          var scheme = getUrlScheme(moduleId);
          return scheme ? moduleId : "package:" + moduleId + MODULE_SUFFIX;
      }
      else if (moduleId !== null && moduleId !== void 0) {
          throw syntaxError("moduleId should be a string in \"" + stringifyType(type) + "\". See https://goo.gl/wIDDiL for more information.\n" +
              "If you're using Webpack you should inline the template and the styles, see https://goo.gl/X2J8zc.");
      }
      return reflector.importUri(type);
  }
  function extractIdentifiers(value, targetIdentifiers) {
      visitValue(value, new _CompileValueConverter(), targetIdentifiers);
  }
  var _CompileValueConverter = (function (_super) {
      __extends$17(_CompileValueConverter, _super);
      function _CompileValueConverter() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      _CompileValueConverter.prototype.visitOther = function (value, targetIdentifiers) {
          targetIdentifiers.push({ reference: value });
      };
      return _CompileValueConverter;
  }(ValueTransformer));
  function stringifyType(type) {
      if (type instanceof StaticSymbol) {
          return type.name + " in " + type.filePath;
      }
      else {
          return _angular_core.ɵstringify(type);
      }
  }
  /**
   * Indicates that a component is still being loaded in a synchronous compile.
   */
  function componentStillLoadingError(compType) {
      debugger;
      var error = Error("Can't compile synchronously as " + _angular_core.ɵstringify(compType) + " is still being loaded!");
      error[_angular_core.ɵERROR_COMPONENT_TYPE] = compType;
      return error;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$18 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  //// Types
  var TypeModifier;
  (function (TypeModifier) {
      TypeModifier[TypeModifier["Const"] = 0] = "Const";
  })(TypeModifier || (TypeModifier = {}));
  var Type$1 = (function () {
      function Type(modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          this.modifiers = modifiers;
          if (!modifiers) {
              this.modifiers = [];
          }
      }
      Type.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
      return Type;
  }());
  var BuiltinTypeName;
  (function (BuiltinTypeName) {
      BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
      BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
      BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
      BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
      BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
      BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
      BuiltinTypeName[BuiltinTypeName["Inferred"] = 6] = "Inferred";
  })(BuiltinTypeName || (BuiltinTypeName = {}));
  var BuiltinType = (function (_super) {
      __extends$18(BuiltinType, _super);
      function BuiltinType(name, modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers) || this;
          _this.name = name;
          return _this;
      }
      BuiltinType.prototype.visitType = function (visitor, context) {
          return visitor.visitBuiltintType(this, context);
      };
      return BuiltinType;
  }(Type$1));
  var ExpressionType = (function (_super) {
      __extends$18(ExpressionType, _super);
      function ExpressionType(value, modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers) || this;
          _this.value = value;
          return _this;
      }
      ExpressionType.prototype.visitType = function (visitor, context) {
          return visitor.visitExpressionType(this, context);
      };
      return ExpressionType;
  }(Type$1));
  var ArrayType = (function (_super) {
      __extends$18(ArrayType, _super);
      function ArrayType(of, modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers) || this;
          _this.of = of;
          return _this;
      }
      ArrayType.prototype.visitType = function (visitor, context) {
          return visitor.visitArrayType(this, context);
      };
      return ArrayType;
  }(Type$1));
  var MapType = (function (_super) {
      __extends$18(MapType, _super);
      function MapType(valueType, modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers) || this;
          _this.valueType = valueType;
          return _this;
      }
      MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
      return MapType;
  }(Type$1));
  var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
  var INFERRED_TYPE = new BuiltinType(BuiltinTypeName.Inferred);
  var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
  var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
  var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
  var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
  var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
  ///// Expressions
  var BinaryOperator;
  (function (BinaryOperator) {
      BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
      BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
      BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
      BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
      BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
      BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
      BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
      BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
      BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
      BinaryOperator[BinaryOperator["And"] = 9] = "And";
      BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
      BinaryOperator[BinaryOperator["Lower"] = 11] = "Lower";
      BinaryOperator[BinaryOperator["LowerEquals"] = 12] = "LowerEquals";
      BinaryOperator[BinaryOperator["Bigger"] = 13] = "Bigger";
      BinaryOperator[BinaryOperator["BiggerEquals"] = 14] = "BiggerEquals";
  })(BinaryOperator || (BinaryOperator = {}));
  var Expression = (function () {
      function Expression(type, sourceSpan) {
          this.type = type;
          this.sourceSpan = sourceSpan;
      }
      Expression.prototype.prop = function (name, sourceSpan) {
          return new ReadPropExpr(this, name, null, sourceSpan);
      };
      Expression.prototype.key = function (index, type, sourceSpan) {
          if (type === void 0) { type = null; }
          return new ReadKeyExpr(this, index, type, sourceSpan);
      };
      Expression.prototype.callMethod = function (name, params, sourceSpan) {
          return new InvokeMethodExpr(this, name, params, null, sourceSpan);
      };
      Expression.prototype.callFn = function (params, sourceSpan) {
          return new InvokeFunctionExpr(this, params, null, sourceSpan);
      };
      Expression.prototype.instantiate = function (params, type, sourceSpan) {
          if (type === void 0) { type = null; }
          return new InstantiateExpr(this, params, type, sourceSpan);
      };
      Expression.prototype.conditional = function (trueCase, falseCase, sourceSpan) {
          if (falseCase === void 0) { falseCase = null; }
          return new ConditionalExpr(this, trueCase, falseCase, null, sourceSpan);
      };
      Expression.prototype.equals = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.notEquals = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.identical = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs, null, sourceSpan);
      };
      Expression.prototype.notIdentical = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs, null, sourceSpan);
      };
      Expression.prototype.minus = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs, null, sourceSpan);
      };
      Expression.prototype.plus = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs, null, sourceSpan);
      };
      Expression.prototype.divide = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs, null, sourceSpan);
      };
      Expression.prototype.multiply = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs, null, sourceSpan);
      };
      Expression.prototype.modulo = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs, null, sourceSpan);
      };
      Expression.prototype.and = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.And, this, rhs, null, sourceSpan);
      };
      Expression.prototype.or = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs, null, sourceSpan);
      };
      Expression.prototype.lower = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs, null, sourceSpan);
      };
      Expression.prototype.lowerEquals = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.bigger = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs, null, sourceSpan);
      };
      Expression.prototype.biggerEquals = function (rhs, sourceSpan) {
          return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs, null, sourceSpan);
      };
      Expression.prototype.isBlank = function (sourceSpan) {
          // Note: We use equals by purpose here to compare to null and undefined in JS.
          // We use the typed null to allow strictNullChecks to narrow types.
          return this.equals(TYPED_NULL_EXPR, sourceSpan);
      };
      Expression.prototype.cast = function (type, sourceSpan) {
          return new CastExpr(this, type, sourceSpan);
      };
      Expression.prototype.toStmt = function () { return new ExpressionStatement(this); };
      return Expression;
  }());
  var BuiltinVar;
  (function (BuiltinVar) {
      BuiltinVar[BuiltinVar["This"] = 0] = "This";
      BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
      BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
      BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
  })(BuiltinVar || (BuiltinVar = {}));
  var ReadVarExpr = (function (_super) {
      __extends$18(ReadVarExpr, _super);
      function ReadVarExpr(name, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          if (typeof name === 'string') {
              _this.name = name;
              _this.builtin = null;
          }
          else {
              _this.name = null;
              _this.builtin = name;
          }
          return _this;
      }
      ReadVarExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitReadVarExpr(this, context);
      };
      ReadVarExpr.prototype.set = function (value) {
          return new WriteVarExpr(this.name, value, null, this.sourceSpan);
      };
      return ReadVarExpr;
  }(Expression));
  var WriteVarExpr = (function (_super) {
      __extends$18(WriteVarExpr, _super);
      function WriteVarExpr(name, value, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type || value.type, sourceSpan) || this;
          _this.name = name;
          _this.value = value;
          return _this;
      }
      WriteVarExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitWriteVarExpr(this, context);
      };
      WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          return new DeclareVarStmt(this.name, this.value, type, modifiers, this.sourceSpan);
      };
      return WriteVarExpr;
  }(Expression));
  var WriteKeyExpr = (function (_super) {
      __extends$18(WriteKeyExpr, _super);
      function WriteKeyExpr(receiver, index, value, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type || value.type, sourceSpan) || this;
          _this.receiver = receiver;
          _this.index = index;
          _this.value = value;
          return _this;
      }
      WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitWriteKeyExpr(this, context);
      };
      return WriteKeyExpr;
  }(Expression));
  var WritePropExpr = (function (_super) {
      __extends$18(WritePropExpr, _super);
      function WritePropExpr(receiver, name, value, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type || value.type, sourceSpan) || this;
          _this.receiver = receiver;
          _this.name = name;
          _this.value = value;
          return _this;
      }
      WritePropExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitWritePropExpr(this, context);
      };
      return WritePropExpr;
  }(Expression));
  var BuiltinMethod;
  (function (BuiltinMethod) {
      BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
      BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
      BuiltinMethod[BuiltinMethod["Bind"] = 2] = "Bind";
  })(BuiltinMethod || (BuiltinMethod = {}));
  var InvokeMethodExpr = (function (_super) {
      __extends$18(InvokeMethodExpr, _super);
      function InvokeMethodExpr(receiver, method, args, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.receiver = receiver;
          _this.args = args;
          if (typeof method === 'string') {
              _this.name = method;
              _this.builtin = null;
          }
          else {
              _this.name = null;
              _this.builtin = method;
          }
          return _this;
      }
      InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitInvokeMethodExpr(this, context);
      };
      return InvokeMethodExpr;
  }(Expression));
  var InvokeFunctionExpr = (function (_super) {
      __extends$18(InvokeFunctionExpr, _super);
      function InvokeFunctionExpr(fn, args, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.fn = fn;
          _this.args = args;
          return _this;
      }
      InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitInvokeFunctionExpr(this, context);
      };
      return InvokeFunctionExpr;
  }(Expression));
  var InstantiateExpr = (function (_super) {
      __extends$18(InstantiateExpr, _super);
      function InstantiateExpr(classExpr, args, type, sourceSpan) {
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.classExpr = classExpr;
          _this.args = args;
          return _this;
      }
      InstantiateExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitInstantiateExpr(this, context);
      };
      return InstantiateExpr;
  }(Expression));
  var LiteralExpr = (function (_super) {
      __extends$18(LiteralExpr, _super);
      function LiteralExpr(value, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.value = value;
          return _this;
      }
      LiteralExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitLiteralExpr(this, context);
      };
      return LiteralExpr;
  }(Expression));
  var ExternalExpr = (function (_super) {
      __extends$18(ExternalExpr, _super);
      function ExternalExpr(value, type, typeParams, sourceSpan) {
          if (type === void 0) { type = null; }
          if (typeParams === void 0) { typeParams = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.value = value;
          _this.typeParams = typeParams;
          return _this;
      }
      ExternalExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitExternalExpr(this, context);
      };
      return ExternalExpr;
  }(Expression));
  var ConditionalExpr = (function (_super) {
      __extends$18(ConditionalExpr, _super);
      function ConditionalExpr(condition, trueCase, falseCase, type, sourceSpan) {
          if (falseCase === void 0) { falseCase = null; }
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type || trueCase.type, sourceSpan) || this;
          _this.condition = condition;
          _this.falseCase = falseCase;
          _this.trueCase = trueCase;
          return _this;
      }
      ConditionalExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitConditionalExpr(this, context);
      };
      return ConditionalExpr;
  }(Expression));
  var NotExpr = (function (_super) {
      __extends$18(NotExpr, _super);
      function NotExpr(condition, sourceSpan) {
          var _this = _super.call(this, BOOL_TYPE, sourceSpan) || this;
          _this.condition = condition;
          return _this;
      }
      NotExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitNotExpr(this, context);
      };
      return NotExpr;
  }(Expression));
  var CastExpr = (function (_super) {
      __extends$18(CastExpr, _super);
      function CastExpr(value, type, sourceSpan) {
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.value = value;
          return _this;
      }
      CastExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitCastExpr(this, context);
      };
      return CastExpr;
  }(Expression));
  var FnParam = (function () {
      function FnParam(name, type) {
          if (type === void 0) { type = null; }
          this.name = name;
          this.type = type;
      }
      return FnParam;
  }());
  var FunctionExpr = (function (_super) {
      __extends$18(FunctionExpr, _super);
      function FunctionExpr(params, statements, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.params = params;
          _this.statements = statements;
          return _this;
      }
      FunctionExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitFunctionExpr(this, context);
      };
      FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
          if (modifiers === void 0) { modifiers = null; }
          return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers, this.sourceSpan);
      };
      return FunctionExpr;
  }(Expression));
  var BinaryOperatorExpr = (function (_super) {
      __extends$18(BinaryOperatorExpr, _super);
      function BinaryOperatorExpr(operator, lhs, rhs, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type || lhs.type, sourceSpan) || this;
          _this.operator = operator;
          _this.rhs = rhs;
          _this.lhs = lhs;
          return _this;
      }
      BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitBinaryOperatorExpr(this, context);
      };
      return BinaryOperatorExpr;
  }(Expression));
  var ReadPropExpr = (function (_super) {
      __extends$18(ReadPropExpr, _super);
      function ReadPropExpr(receiver, name, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.receiver = receiver;
          _this.name = name;
          return _this;
      }
      ReadPropExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitReadPropExpr(this, context);
      };
      ReadPropExpr.prototype.set = function (value) {
          return new WritePropExpr(this.receiver, this.name, value, null, this.sourceSpan);
      };
      return ReadPropExpr;
  }(Expression));
  var ReadKeyExpr = (function (_super) {
      __extends$18(ReadKeyExpr, _super);
      function ReadKeyExpr(receiver, index, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.receiver = receiver;
          _this.index = index;
          return _this;
      }
      ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitReadKeyExpr(this, context);
      };
      ReadKeyExpr.prototype.set = function (value) {
          return new WriteKeyExpr(this.receiver, this.index, value, null, this.sourceSpan);
      };
      return ReadKeyExpr;
  }(Expression));
  var LiteralArrayExpr = (function (_super) {
      __extends$18(LiteralArrayExpr, _super);
      function LiteralArrayExpr(entries, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.entries = entries;
          return _this;
      }
      LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitLiteralArrayExpr(this, context);
      };
      return LiteralArrayExpr;
  }(Expression));
  var LiteralMapEntry = (function () {
      function LiteralMapEntry(key, value, quoted) {
          if (quoted === void 0) { quoted = false; }
          this.key = key;
          this.value = value;
          this.quoted = quoted;
      }
      return LiteralMapEntry;
  }());
  var LiteralMapExpr = (function (_super) {
      __extends$18(LiteralMapExpr, _super);
      function LiteralMapExpr(entries, type, sourceSpan) {
          if (type === void 0) { type = null; }
          var _this = _super.call(this, type, sourceSpan) || this;
          _this.entries = entries;
          _this.valueType = null;
          if (type) {
              _this.valueType = type.valueType;
          }
          return _this;
      }
      LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
          return visitor.visitLiteralMapExpr(this, context);
      };
      return LiteralMapExpr;
  }(Expression));
  var THIS_EXPR = new ReadVarExpr(BuiltinVar.This);
  var SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super);
  var CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError);
  var CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack);
  var NULL_EXPR = new LiteralExpr(null, null);
  var TYPED_NULL_EXPR = new LiteralExpr(null, INFERRED_TYPE);
  //// Statements
  var StmtModifier;
  (function (StmtModifier) {
      StmtModifier[StmtModifier["Final"] = 0] = "Final";
      StmtModifier[StmtModifier["Private"] = 1] = "Private";
  })(StmtModifier || (StmtModifier = {}));
  var Statement = (function () {
      function Statement(modifiers, sourceSpan) {
          if (modifiers === void 0) { modifiers = null; }
          this.modifiers = modifiers;
          this.sourceSpan = sourceSpan;
          if (!modifiers) {
              this.modifiers = [];
          }
      }
      Statement.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
      return Statement;
  }());
  var DeclareVarStmt = (function (_super) {
      __extends$18(DeclareVarStmt, _super);
      function DeclareVarStmt(name, value, type, modifiers, sourceSpan) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers, sourceSpan) || this;
          _this.name = name;
          _this.value = value;
          _this.type = type || value.type;
          return _this;
      }
      DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitDeclareVarStmt(this, context);
      };
      return DeclareVarStmt;
  }(Statement));
  var DeclareFunctionStmt = (function (_super) {
      __extends$18(DeclareFunctionStmt, _super);
      function DeclareFunctionStmt(name, params, statements, type, modifiers, sourceSpan) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers, sourceSpan) || this;
          _this.name = name;
          _this.params = params;
          _this.statements = statements;
          _this.type = type;
          return _this;
      }
      DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitDeclareFunctionStmt(this, context);
      };
      return DeclareFunctionStmt;
  }(Statement));
  var ExpressionStatement = (function (_super) {
      __extends$18(ExpressionStatement, _super);
      function ExpressionStatement(expr, sourceSpan) {
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.expr = expr;
          return _this;
      }
      ExpressionStatement.prototype.visitStatement = function (visitor, context) {
          return visitor.visitExpressionStmt(this, context);
      };
      return ExpressionStatement;
  }(Statement));
  var ReturnStatement = (function (_super) {
      __extends$18(ReturnStatement, _super);
      function ReturnStatement(value, sourceSpan) {
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.value = value;
          return _this;
      }
      ReturnStatement.prototype.visitStatement = function (visitor, context) {
          return visitor.visitReturnStmt(this, context);
      };
      return ReturnStatement;
  }(Statement));
  var AbstractClassPart = (function () {
      function AbstractClassPart(type, modifiers) {
          if (type === void 0) { type = null; }
          this.type = type;
          this.modifiers = modifiers;
          if (!modifiers) {
              this.modifiers = [];
          }
      }
      AbstractClassPart.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
      return AbstractClassPart;
  }());
  var ClassField = (function (_super) {
      __extends$18(ClassField, _super);
      function ClassField(name, type, modifiers) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, type, modifiers) || this;
          _this.name = name;
          return _this;
      }
      return ClassField;
  }(AbstractClassPart));
  var ClassMethod = (function (_super) {
      __extends$18(ClassMethod, _super);
      function ClassMethod(name, params, body, type, modifiers) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, type, modifiers) || this;
          _this.name = name;
          _this.params = params;
          _this.body = body;
          return _this;
      }
      return ClassMethod;
  }(AbstractClassPart));
  var ClassGetter = (function (_super) {
      __extends$18(ClassGetter, _super);
      function ClassGetter(name, body, type, modifiers) {
          if (type === void 0) { type = null; }
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, type, modifiers) || this;
          _this.name = name;
          _this.body = body;
          return _this;
      }
      return ClassGetter;
  }(AbstractClassPart));
  var ClassStmt = (function (_super) {
      __extends$18(ClassStmt, _super);
      function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers, sourceSpan) {
          if (modifiers === void 0) { modifiers = null; }
          var _this = _super.call(this, modifiers, sourceSpan) || this;
          _this.name = name;
          _this.parent = parent;
          _this.fields = fields;
          _this.getters = getters;
          _this.constructorMethod = constructorMethod;
          _this.methods = methods;
          return _this;
      }
      ClassStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitDeclareClassStmt(this, context);
      };
      return ClassStmt;
  }(Statement));
  var IfStmt = (function (_super) {
      __extends$18(IfStmt, _super);
      function IfStmt(condition, trueCase, falseCase, sourceSpan) {
          if (falseCase === void 0) { falseCase = []; }
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.condition = condition;
          _this.trueCase = trueCase;
          _this.falseCase = falseCase;
          return _this;
      }
      IfStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitIfStmt(this, context);
      };
      return IfStmt;
  }(Statement));
  var CommentStmt = (function (_super) {
      __extends$18(CommentStmt, _super);
      function CommentStmt(comment, sourceSpan) {
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.comment = comment;
          return _this;
      }
      CommentStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitCommentStmt(this, context);
      };
      return CommentStmt;
  }(Statement));
  var TryCatchStmt = (function (_super) {
      __extends$18(TryCatchStmt, _super);
      function TryCatchStmt(bodyStmts, catchStmts, sourceSpan) {
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.bodyStmts = bodyStmts;
          _this.catchStmts = catchStmts;
          return _this;
      }
      TryCatchStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitTryCatchStmt(this, context);
      };
      return TryCatchStmt;
  }(Statement));
  var ThrowStmt = (function (_super) {
      __extends$18(ThrowStmt, _super);
      function ThrowStmt(error, sourceSpan) {
          var _this = _super.call(this, null, sourceSpan) || this;
          _this.error = error;
          return _this;
      }
      ThrowStmt.prototype.visitStatement = function (visitor, context) {
          return visitor.visitThrowStmt(this, context);
      };
      return ThrowStmt;
  }(Statement));
  var ExpressionTransformer = (function () {
      function ExpressionTransformer() {
      }
      ExpressionTransformer.prototype.visitReadVarExpr = function (ast, context) { return ast; };
      ExpressionTransformer.prototype.visitWriteVarExpr = function (expr, context) {
          return new WriteVarExpr(expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan);
      };
      ExpressionTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
          return new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context), expr.type, expr.sourceSpan);
      };
      ExpressionTransformer.prototype.visitWritePropExpr = function (expr, context) {
          return new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context), expr.type, expr.sourceSpan);
      };
      ExpressionTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
          var method = ast.builtin || ast.name;
          return new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
          return new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitInstantiateExpr = function (ast, context) {
          return new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitLiteralExpr = function (ast, context) { return ast; };
      ExpressionTransformer.prototype.visitExternalExpr = function (ast, context) { return ast; };
      ExpressionTransformer.prototype.visitConditionalExpr = function (ast, context) {
          return new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitNotExpr = function (ast, context) {
          return new NotExpr(ast.condition.visitExpression(this, context), ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitCastExpr = function (ast, context) {
          return new CastExpr(ast.value.visitExpression(this, context), context, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitFunctionExpr = function (ast, context) {
          // Don't descend into nested functions
          return ast;
      };
      ExpressionTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
          return new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitReadPropExpr = function (ast, context) {
          return new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitReadKeyExpr = function (ast, context) {
          return new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
          return new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context), ast.type, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
          var _this = this;
          var entries = ast.entries.map(function (entry) { return new LiteralMapEntry(entry.key, entry.value.visitExpression(_this, context), entry.quoted); });
          var mapType = new MapType(ast.valueType);
          return new LiteralMapExpr(entries, mapType, ast.sourceSpan);
      };
      ExpressionTransformer.prototype.visitAllExpressions = function (exprs, context) {
          var _this = this;
          return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
      };
      ExpressionTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
          return new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers, stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
          // Don't descend into nested functions
          return stmt;
      };
      ExpressionTransformer.prototype.visitExpressionStmt = function (stmt, context) {
          return new ExpressionStatement(stmt.expr.visitExpression(this, context), stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitReturnStmt = function (stmt, context) {
          return new ReturnStatement(stmt.value.visitExpression(this, context), stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
          // Don't descend into nested functions
          return stmt;
      };
      ExpressionTransformer.prototype.visitIfStmt = function (stmt, context) {
          return new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context), stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
          return new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context), stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitThrowStmt = function (stmt, context) {
          return new ThrowStmt(stmt.error.visitExpression(this, context), stmt.sourceSpan);
      };
      ExpressionTransformer.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
      ExpressionTransformer.prototype.visitAllStatements = function (stmts, context) {
          var _this = this;
          return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
      };
      return ExpressionTransformer;
  }());
  var RecursiveExpressionVisitor = (function () {
      function RecursiveExpressionVisitor() {
      }
      RecursiveExpressionVisitor.prototype.visitReadVarExpr = function (ast, context) { return ast; };
      RecursiveExpressionVisitor.prototype.visitWriteVarExpr = function (expr, context) {
          expr.value.visitExpression(this, context);
          return expr;
      };
      RecursiveExpressionVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
          expr.receiver.visitExpression(this, context);
          expr.index.visitExpression(this, context);
          expr.value.visitExpression(this, context);
          return expr;
      };
      RecursiveExpressionVisitor.prototype.visitWritePropExpr = function (expr, context) {
          expr.receiver.visitExpression(this, context);
          expr.value.visitExpression(this, context);
          return expr;
      };
      RecursiveExpressionVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
          ast.receiver.visitExpression(this, context);
          this.visitAllExpressions(ast.args, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
          ast.fn.visitExpression(this, context);
          this.visitAllExpressions(ast.args, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitInstantiateExpr = function (ast, context) {
          ast.classExpr.visitExpression(this, context);
          this.visitAllExpressions(ast.args, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitLiteralExpr = function (ast, context) { return ast; };
      RecursiveExpressionVisitor.prototype.visitExternalExpr = function (ast, context) { return ast; };
      RecursiveExpressionVisitor.prototype.visitConditionalExpr = function (ast, context) {
          ast.condition.visitExpression(this, context);
          ast.trueCase.visitExpression(this, context);
          ast.falseCase.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitNotExpr = function (ast, context) {
          ast.condition.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitCastExpr = function (ast, context) {
          ast.value.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitFunctionExpr = function (ast, context) { return ast; };
      RecursiveExpressionVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
          ast.lhs.visitExpression(this, context);
          ast.rhs.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitReadPropExpr = function (ast, context) {
          ast.receiver.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitReadKeyExpr = function (ast, context) {
          ast.receiver.visitExpression(this, context);
          ast.index.visitExpression(this, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
          this.visitAllExpressions(ast.entries, context);
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
          var _this = this;
          ast.entries.forEach(function (entry) { return entry.value.visitExpression(_this, context); });
          return ast;
      };
      RecursiveExpressionVisitor.prototype.visitAllExpressions = function (exprs, context) {
          var _this = this;
          exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
      };
      RecursiveExpressionVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
          stmt.value.visitExpression(this, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
          // Don't descend into nested functions
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitExpressionStmt = function (stmt, context) {
          stmt.expr.visitExpression(this, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitReturnStmt = function (stmt, context) {
          stmt.value.visitExpression(this, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
          // Don't descend into nested functions
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitIfStmt = function (stmt, context) {
          stmt.condition.visitExpression(this, context);
          this.visitAllStatements(stmt.trueCase, context);
          this.visitAllStatements(stmt.falseCase, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
          this.visitAllStatements(stmt.bodyStmts, context);
          this.visitAllStatements(stmt.catchStmts, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitThrowStmt = function (stmt, context) {
          stmt.error.visitExpression(this, context);
          return stmt;
      };
      RecursiveExpressionVisitor.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
      RecursiveExpressionVisitor.prototype.visitAllStatements = function (stmts, context) {
          var _this = this;
          stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
      };
      return RecursiveExpressionVisitor;
  }());
  var _ReplaceVariableTransformer = (function (_super) {
      __extends$18(_ReplaceVariableTransformer, _super);
      function _ReplaceVariableTransformer(_varName, _newValue) {
          var _this = _super.call(this) || this;
          _this._varName = _varName;
          _this._newValue = _newValue;
          return _this;
      }
      _ReplaceVariableTransformer.prototype.visitReadVarExpr = function (ast, context) {
          return ast.name == this._varName ? this._newValue : ast;
      };
      return _ReplaceVariableTransformer;
  }(ExpressionTransformer));
  var _VariableFinder = (function (_super) {
      __extends$18(_VariableFinder, _super);
      function _VariableFinder() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.varNames = new Set();
          return _this;
      }
      _VariableFinder.prototype.visitReadVarExpr = function (ast, context) {
          this.varNames.add(ast.name);
          return null;
      };
      return _VariableFinder;
  }(RecursiveExpressionVisitor));
  function variable(name, type, sourceSpan) {
      if (type === void 0) { type = null; }
      return new ReadVarExpr(name, type, sourceSpan);
  }
  function importExpr(id, typeParams, sourceSpan) {
      if (typeParams === void 0) { typeParams = null; }
      return new ExternalExpr(id, null, typeParams, sourceSpan);
  }
  function importType(id, typeParams, typeModifiers) {
      if (typeParams === void 0) { typeParams = null; }
      if (typeModifiers === void 0) { typeModifiers = null; }
      return id != null ? expressionType(importExpr(id, typeParams), typeModifiers) : null;
  }
  function expressionType(expr, typeModifiers) {
      if (typeModifiers === void 0) { typeModifiers = null; }
      return expr != null ? new ExpressionType(expr, typeModifiers) : null;
  }
  function literalArr(values, type, sourceSpan) {
      if (type === void 0) { type = null; }
      return new LiteralArrayExpr(values, type, sourceSpan);
  }
  function literalMap(values, type, quoted) {
      if (type === void 0) { type = null; }
      if (quoted === void 0) { quoted = false; }
      return new LiteralMapExpr(values.map(function (entry) { return new LiteralMapEntry(entry[0], entry[1], quoted); }), type);
  }
  function not(expr, sourceSpan) {
      return new NotExpr(expr, sourceSpan);
  }
  function fn(params, body, type, sourceSpan) {
      if (type === void 0) { type = null; }
      return new FunctionExpr(params, body, type, sourceSpan);
  }
  function literal(value, type, sourceSpan) {
      if (type === void 0) { type = null; }
      return new LiteralExpr(value, type, sourceSpan);
  }

  /**
   * Create a new class stmts based on the given data.
   */
  function createClassStmt(config) {
      var parentArgs = config.parentArgs || [];
      var superCtorStmts = config.parent ? [SUPER_EXPR.callFn(parentArgs).toStmt()] : [];
      var builder = concatClassBuilderParts(Array.isArray(config.builders) ? config.builders : [config.builders]);
      var ctor = new ClassMethod(null, config.ctorParams || [], superCtorStmts.concat(builder.ctorStmts));
      return new ClassStmt(config.name, config.parent, builder.fields, builder.getters, ctor, builder.methods, config.modifiers || [], config.sourceSpan);
  }
  function concatClassBuilderParts(builders) {
      return {
          fields: [].concat.apply([], builders.map(function (builder) { return builder.fields || []; })),
          methods: [].concat.apply([], builders.map(function (builder) { return builder.methods || []; })),
          getters: [].concat.apply([], builders.map(function (builder) { return builder.getters || []; })),
          ctorStmts: [].concat.apply([], builders.map(function (builder) { return builder.ctorStmts || []; })),
      };
  }

  var QUOTED_KEYS = '$quoted$';
  function convertValueToOutputAst(value, type) {
      if (type === void 0) { type = null; }
      return visitValue(value, new _ValueOutputAstTransformer(), type);
  }
  var _ValueOutputAstTransformer = (function () {
      function _ValueOutputAstTransformer() {
      }
      _ValueOutputAstTransformer.prototype.visitArray = function (arr, type) {
          var _this = this;
          return literalArr(arr.map(function (value) { return visitValue(value, _this, null); }), type);
      };
      _ValueOutputAstTransformer.prototype.visitStringMap = function (map, type) {
          var _this = this;
          var entries = [];
          var quotedSet = new Set(map && map[QUOTED_KEYS]);
          Object.keys(map).forEach(function (key) {
              entries.push(new LiteralMapEntry(key, visitValue(map[key], _this, null), quotedSet.has(key)));
          });
          return new LiteralMapExpr(entries, type);
      };
      _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, type) { return literal(value, type); };
      _ValueOutputAstTransformer.prototype.visitOther = function (value, type) {
          if (value instanceof Expression) {
              return value;
          }
          else {
              return importExpr({ reference: value });
          }
      };
      return _ValueOutputAstTransformer;
  }());

  /**
   * This is currently not read, but will probably be used in the future.
   * We keep it as we already pass it through all the rigth places...
   */
  var ComponentFactoryDependency = (function () {
      function ComponentFactoryDependency(compType) {
          this.compType = compType;
      }
      return ComponentFactoryDependency;
  }());
  var NgModuleCompileResult = (function () {
      function NgModuleCompileResult(statements, ngModuleFactoryVar, dependencies) {
          this.statements = statements;
          this.ngModuleFactoryVar = ngModuleFactoryVar;
          this.dependencies = dependencies;
      }
      return NgModuleCompileResult;
  }());
  var NgModuleCompiler = (function () {
      function NgModuleCompiler() {
      }
      NgModuleCompiler.prototype.compile = function (ngModuleMeta, extraProviders) {
          var moduleUrl = identifierModuleUrl(ngModuleMeta.type);
          var sourceFileName = moduleUrl != null ?
              "in NgModule " + identifierName(ngModuleMeta.type) + " in " + moduleUrl :
              "in NgModule " + identifierName(ngModuleMeta.type);
          var sourceFile = new ParseSourceFile('', sourceFileName);
          var sourceSpan = new ParseSourceSpan(new ParseLocation(sourceFile, null, null, null), new ParseLocation(sourceFile, null, null, null));
          var deps = [];
          var bootstrapComponentFactories = [];
          var entryComponentFactories = ngModuleMeta.transitiveModule.entryComponents.map(function (entryComponent) {
              if (ngModuleMeta.bootstrapComponents.some(function (id) { return id.reference === entryComponent.componentType; })) {
                  bootstrapComponentFactories.push({ reference: entryComponent.componentFactory });
              }
              deps.push(new ComponentFactoryDependency(entryComponent.componentType));
              return { reference: entryComponent.componentFactory };
          });
          var builder = new _InjectorBuilder(ngModuleMeta, entryComponentFactories, bootstrapComponentFactories, sourceSpan);
          var providerParser = new NgModuleProviderAnalyzer(ngModuleMeta, extraProviders, sourceSpan);
          providerParser.parse().forEach(function (provider) { return builder.addProvider(provider); });
          var injectorClass = builder.build();
          var ngModuleFactoryVar = identifierName(ngModuleMeta.type) + "NgFactory";
          var ngModuleFactoryStmt = variable(ngModuleFactoryVar)
              .set(importExpr(createIdentifier(Identifiers.NgModuleFactory))
              .instantiate([variable(injectorClass.name), importExpr(ngModuleMeta.type)], importType(createIdentifier(Identifiers.NgModuleFactory), [importType(ngModuleMeta.type)], [TypeModifier.Const])))
              .toDeclStmt(null, [StmtModifier.Final]);
          var stmts = [injectorClass, ngModuleFactoryStmt];
          if (ngModuleMeta.id) {
              var registerFactoryStmt = importExpr(createIdentifier(Identifiers.RegisterModuleFactoryFn))
                  .callFn([literal(ngModuleMeta.id), variable(ngModuleFactoryVar)])
                  .toStmt();
              stmts.push(registerFactoryStmt);
          }
          return new NgModuleCompileResult(stmts, ngModuleFactoryVar, deps);
      };
      return NgModuleCompiler;
  }());
  NgModuleCompiler.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  NgModuleCompiler.ctorParameters = function () { return []; };
  var _InjectorBuilder = (function () {
      function _InjectorBuilder(_ngModuleMeta, _entryComponentFactories, _bootstrapComponentFactories, _sourceSpan) {
          this._ngModuleMeta = _ngModuleMeta;
          this._entryComponentFactories = _entryComponentFactories;
          this._bootstrapComponentFactories = _bootstrapComponentFactories;
          this._sourceSpan = _sourceSpan;
          this.fields = [];
          this.getters = [];
          this.methods = [];
          this.ctorStmts = [];
          this._tokens = [];
          this._instances = new Map();
          this._createStmts = [];
          this._destroyStmts = [];
      }
      _InjectorBuilder.prototype.addProvider = function (resolvedProvider) {
          var _this = this;
          var providerValueExpressions = resolvedProvider.providers.map(function (provider) { return _this._getProviderValue(provider); });
          var propName = "_" + tokenName(resolvedProvider.token) + "_" + this._instances.size;
          var instance = this._createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager);
          if (resolvedProvider.lifecycleHooks.indexOf(_angular_core.ɵLifecycleHooks.OnDestroy) !== -1) {
              this._destroyStmts.push(instance.callMethod('ngOnDestroy', []).toStmt());
          }
          this._tokens.push(resolvedProvider.token);
          this._instances.set(tokenReference(resolvedProvider.token), instance);
      };
      _InjectorBuilder.prototype.build = function () {
          var _this = this;
          var getMethodStmts = this._tokens.map(function (token) {
              var providerExpr = _this._instances.get(tokenReference(token));
              return new IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(token)), [new ReturnStatement(providerExpr)]);
          });
          var methods = [
              new ClassMethod('createInternal', [], this._createStmts.concat(new ReturnStatement(this._instances.get(this._ngModuleMeta.type.reference))), importType(this._ngModuleMeta.type)),
              new ClassMethod('getInternal', [
                  new FnParam(InjectMethodVars.token.name, DYNAMIC_TYPE),
                  new FnParam(InjectMethodVars.notFoundResult.name, DYNAMIC_TYPE)
              ], getMethodStmts.concat([new ReturnStatement(InjectMethodVars.notFoundResult)]), DYNAMIC_TYPE),
              new ClassMethod('destroyInternal', [], this._destroyStmts),
          ];
          var parentArgs = [
              variable(InjectorProps.parent.name),
              literalArr(this._entryComponentFactories.map(function (componentFactory) { return importExpr(componentFactory); })),
              literalArr(this._bootstrapComponentFactories.map(function (componentFactory) { return importExpr(componentFactory); }))
          ];
          var injClassName = identifierName(this._ngModuleMeta.type) + "Injector";
          return createClassStmt({
              name: injClassName,
              ctorParams: [new FnParam(InjectorProps.parent.name, importType(createIdentifier(Identifiers.Injector)))],
              parent: importExpr(createIdentifier(Identifiers.NgModuleInjector), [importType(this._ngModuleMeta.type)]),
              parentArgs: parentArgs,
              builders: [{ methods: methods }, this]
          });
      };
      _InjectorBuilder.prototype._getProviderValue = function (provider) {
          var _this = this;
          var result;
          if (provider.useExisting != null) {
              result = this._getDependency({ token: provider.useExisting });
          }
          else if (provider.useFactory != null) {
              var deps = provider.deps || provider.useFactory.diDeps;
              var depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
              result = importExpr(provider.useFactory).callFn(depsExpr);
          }
          else if (provider.useClass != null) {
              var deps = provider.deps || provider.useClass.diDeps;
              var depsExpr = deps.map(function (dep) { return _this._getDependency(dep); });
              result =
                  importExpr(provider.useClass).instantiate(depsExpr, importType(provider.useClass));
          }
          else {
              result = convertValueToOutputAst(provider.useValue);
          }
          return result;
      };
      _InjectorBuilder.prototype._createProviderProperty = function (propName, provider, providerValueExpressions, isMulti, isEager) {
          var resolvedProviderValueExpr;
          var type;
          if (isMulti) {
              resolvedProviderValueExpr = literalArr(providerValueExpressions);
              type = new ArrayType(DYNAMIC_TYPE);
          }
          else {
              resolvedProviderValueExpr = providerValueExpressions[0];
              type = providerValueExpressions[0].type;
          }
          if (!type) {
              type = DYNAMIC_TYPE;
          }
          if (isEager) {
              this.fields.push(new ClassField(propName, type));
              this._createStmts.push(THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
          }
          else {
              var internalField = "_" + propName;
              this.fields.push(new ClassField(internalField, type));
              // Note: Equals is important for JS so that it also checks the undefined case!
              var getterStmts = [
                  new IfStmt(THIS_EXPR.prop(internalField).isBlank(), [THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]),
                  new ReturnStatement(THIS_EXPR.prop(internalField))
              ];
              this.getters.push(new ClassGetter(propName, getterStmts, type));
          }
          return THIS_EXPR.prop(propName);
      };
      _InjectorBuilder.prototype._getDependency = function (dep) {
          var result = null;
          if (dep.isValue) {
              result = literal(dep.value);
          }
          if (!dep.isSkipSelf) {
              if (dep.token &&
                  (tokenReference(dep.token) === resolveIdentifier(Identifiers.Injector) ||
                      tokenReference(dep.token) === resolveIdentifier(Identifiers.ComponentFactoryResolver))) {
                  result = THIS_EXPR;
              }
              if (!result) {
                  result = this._instances.get(tokenReference(dep.token));
              }
          }
          if (!result) {
              var args = [createDiTokenExpression(dep.token)];
              if (dep.isOptional) {
                  args.push(NULL_EXPR);
              }
              result = InjectorProps.parent.callMethod('get', args);
          }
          return result;
      };
      return _InjectorBuilder;
  }());
  function createDiTokenExpression(token) {
      if (token.value != null) {
          return literal(token.value);
      }
      else {
          return importExpr(token.identifier);
      }
  }
  var InjectorProps = (function () {
      function InjectorProps() {
      }
      return InjectorProps;
  }());
  InjectorProps.parent = THIS_EXPR.prop('parent');
  var InjectMethodVars = (function () {
      function InjectMethodVars() {
      }
      return InjectMethodVars;
  }());
  InjectMethodVars.token = variable('token');
  InjectMethodVars.notFoundResult = variable('notFoundResult');

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  // https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit
  var VERSION$1 = 3;
  var JS_B64_PREFIX = '# sourceMappingURL=data:application/json;base64,';
  var SourceMapGenerator = (function () {
      function SourceMapGenerator(file) {
          if (file === void 0) { file = null; }
          this.file = file;
          this.sourcesContent = new Map();
          this.lines = [];
          this.lastCol0 = 0;
          this.hasMappings = false;
      }
      // The content is `null` when the content is expected to be loaded using the URL
      SourceMapGenerator.prototype.addSource = function (url, content) {
          if (content === void 0) { content = null; }
          if (!this.sourcesContent.has(url)) {
              this.sourcesContent.set(url, content);
          }
          return this;
      };
      SourceMapGenerator.prototype.addLine = function () {
          this.lines.push([]);
          this.lastCol0 = 0;
          return this;
      };
      SourceMapGenerator.prototype.addMapping = function (col0, sourceUrl, sourceLine0, sourceCol0) {
          if (!this.currentLine) {
              throw new Error("A line must be added before mappings can be added");
          }
          if (sourceUrl != null && !this.sourcesContent.has(sourceUrl)) {
              throw new Error("Unknown source file \"" + sourceUrl + "\"");
          }
          if (col0 == null) {
              throw new Error("The column in the generated code must be provided");
          }
          if (col0 < this.lastCol0) {
              throw new Error("Mapping should be added in output order");
          }
          if (sourceUrl && (sourceLine0 == null || sourceCol0 == null)) {
              throw new Error("The source location must be provided when a source url is provided");
          }
          this.hasMappings = true;
          this.lastCol0 = col0;
          this.currentLine.push({ col0: col0, sourceUrl: sourceUrl, sourceLine0: sourceLine0, sourceCol0: sourceCol0 });
          return this;
      };
      Object.defineProperty(SourceMapGenerator.prototype, "currentLine", {
          get: function () { return this.lines.slice(-1)[0]; },
          enumerable: true,
          configurable: true
      });
      SourceMapGenerator.prototype.toJSON = function () {
          var _this = this;
          if (!this.hasMappings) {
              return null;
          }
          var sourcesIndex = new Map();
          var sources = [];
          var sourcesContent = [];
          Array.from(this.sourcesContent.keys()).forEach(function (url, i) {
              sourcesIndex.set(url, i);
              sources.push(url);
              sourcesContent.push(_this.sourcesContent.get(url) || null);
          });
          var mappings = '';
          var lastCol0 = 0;
          var lastSourceIndex = 0;
          var lastSourceLine0 = 0;
          var lastSourceCol0 = 0;
          this.lines.forEach(function (segments) {
              lastCol0 = 0;
              mappings += segments
                  .map(function (segment) {
                  // zero-based starting column of the line in the generated code
                  var segAsStr = toBase64VLQ(segment.col0 - lastCol0);
                  lastCol0 = segment.col0;
                  if (segment.sourceUrl != null) {
                      // zero-based index into the “sources” list
                      segAsStr +=
                          toBase64VLQ(sourcesIndex.get(segment.sourceUrl) - lastSourceIndex);
                      lastSourceIndex = sourcesIndex.get(segment.sourceUrl);
                      // the zero-based starting line in the original source
                      segAsStr += toBase64VLQ(segment.sourceLine0 - lastSourceLine0);
                      lastSourceLine0 = segment.sourceLine0;
                      // the zero-based starting column in the original source
                      segAsStr += toBase64VLQ(segment.sourceCol0 - lastSourceCol0);
                      lastSourceCol0 = segment.sourceCol0;
                  }
                  return segAsStr;
              })
                  .join(',');
              mappings += ';';
          });
          mappings = mappings.slice(0, -1);
          return {
              'file': this.file || '',
              'version': VERSION$1,
              'sourceRoot': '',
              'sources': sources,
              'sourcesContent': sourcesContent,
              'mappings': mappings,
          };
      };
      SourceMapGenerator.prototype.toJsComment = function () {
          return this.hasMappings ? '//' + JS_B64_PREFIX + toBase64String(JSON.stringify(this, null, 0)) :
              '';
      };
      return SourceMapGenerator;
  }());
  function toBase64String(value) {
      var b64 = '';
      for (var i = 0; i < value.length;) {
          var i1 = value.charCodeAt(i++);
          var i2 = value.charCodeAt(i++);
          var i3 = value.charCodeAt(i++);
          b64 += toBase64Digit(i1 >> 2);
          b64 += toBase64Digit(((i1 & 3) << 4) | (isNaN(i2) ? 0 : i2 >> 4));
          b64 += isNaN(i2) ? '=' : toBase64Digit(((i2 & 15) << 2) | (i3 >> 6));
          b64 += isNaN(i2) || isNaN(i3) ? '=' : toBase64Digit(i3 & 63);
      }
      return b64;
  }
  function toBase64VLQ(value) {
      value = value < 0 ? ((-value) << 1) + 1 : value << 1;
      var out = '';
      do {
          var digit = value & 31;
          value = value >> 5;
          if (value > 0) {
              digit = digit | 32;
          }
          out += toBase64Digit(digit);
      } while (value > 0);
      return out;
  }
  var B64_DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function toBase64Digit(value) {
      if (value < 0 || value >= 64) {
          throw new Error("Can only encode value in the range [0, 63]");
      }
      return B64_DIGITS[value];
  }

  var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
  var _LEGAL_IDENTIFIER_RE = /^[$A-Z_][0-9A-Z_$]*$/i;
  var _INDENT_WITH = '  ';
  var CATCH_ERROR_VAR$1 = variable('error');
  var CATCH_STACK_VAR$1 = variable('stack');
  var _EmittedLine = (function () {
      function _EmittedLine(indent) {
          this.indent = indent;
          this.parts = [];
          this.srcSpans = [];
      }
      return _EmittedLine;
  }());
  var EmitterVisitorContext = (function () {
      function EmitterVisitorContext(_exportedVars, _indent) {
          this._exportedVars = _exportedVars;
          this._indent = _indent;
          this._classes = [];
          this._lines = [new _EmittedLine(_indent)];
      }
      EmitterVisitorContext.createRoot = function (exportedVars) {
          return new EmitterVisitorContext(exportedVars, 0);
      };
      Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
          get: function () { return this._lines[this._lines.length - 1]; },
          enumerable: true,
          configurable: true
      });
      EmitterVisitorContext.prototype.isExportedVar = function (varName) { return this._exportedVars.indexOf(varName) !== -1; };
      EmitterVisitorContext.prototype.println = function (from, lastPart) {
          if (lastPart === void 0) { lastPart = ''; }
          this.print(from, lastPart, true);
      };
      EmitterVisitorContext.prototype.lineIsEmpty = function () { return this._currentLine.parts.length === 0; };
      EmitterVisitorContext.prototype.print = function (from, part, newLine) {
          if (newLine === void 0) { newLine = false; }
          if (part.length > 0) {
              this._currentLine.parts.push(part);
              this._currentLine.srcSpans.push(from && from.sourceSpan || null);
          }
          if (newLine) {
              this._lines.push(new _EmittedLine(this._indent));
          }
      };
      EmitterVisitorContext.prototype.removeEmptyLastLine = function () {
          if (this.lineIsEmpty()) {
              this._lines.pop();
          }
      };
      EmitterVisitorContext.prototype.incIndent = function () {
          this._indent++;
          this._currentLine.indent = this._indent;
      };
      EmitterVisitorContext.prototype.decIndent = function () {
          this._indent--;
          this._currentLine.indent = this._indent;
      };
      EmitterVisitorContext.prototype.pushClass = function (clazz) { this._classes.push(clazz); };
      EmitterVisitorContext.prototype.popClass = function () { return this._classes.pop(); };
      Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
          get: function () {
              return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
          },
          enumerable: true,
          configurable: true
      });
      EmitterVisitorContext.prototype.toSource = function () {
          return this.sourceLines
              .map(function (l) { return l.parts.length > 0 ? _createIndent(l.indent) + l.parts.join('') : ''; })
              .join('\n');
      };
      EmitterVisitorContext.prototype.toSourceMapGenerator = function (file, startsAtLine) {
          if (file === void 0) { file = null; }
          if (startsAtLine === void 0) { startsAtLine = 0; }
          var map = new SourceMapGenerator(file);
          for (var i = 0; i < startsAtLine; i++) {
              map.addLine();
          }
          this.sourceLines.forEach(function (line) {
              map.addLine();
              var spans = line.srcSpans;
              var parts = line.parts;
              var col0 = line.indent * _INDENT_WITH.length;
              var spanIdx = 0;
              // skip leading parts without source spans
              while (spanIdx < spans.length && !spans[spanIdx]) {
                  col0 += parts[spanIdx].length;
                  spanIdx++;
              }
              while (spanIdx < spans.length) {
                  var span = spans[spanIdx];
                  var source = span.start.file;
                  var sourceLine = span.start.line;
                  var sourceCol = span.start.col;
                  map.addSource(source.url, source.content)
                      .addMapping(col0, source.url, sourceLine, sourceCol);
                  col0 += parts[spanIdx].length;
                  spanIdx++;
                  // assign parts without span or the same span to the previous segment
                  while (spanIdx < spans.length && (span === spans[spanIdx] || !spans[spanIdx])) {
                      col0 += parts[spanIdx].length;
                      spanIdx++;
                  }
              }
          });
          return map;
      };
      Object.defineProperty(EmitterVisitorContext.prototype, "sourceLines", {
          get: function () {
              if (this._lines.length && this._lines[this._lines.length - 1].parts.length === 0) {
                  return this._lines.slice(0, -1);
              }
              return this._lines;
          },
          enumerable: true,
          configurable: true
      });
      return EmitterVisitorContext;
  }());
  var AbstractEmitterVisitor = (function () {
      function AbstractEmitterVisitor(_escapeDollarInStrings) {
          this._escapeDollarInStrings = _escapeDollarInStrings;
      }
      AbstractEmitterVisitor.prototype.visitExpressionStmt = function (stmt, ctx) {
          stmt.expr.visitExpression(this, ctx);
          ctx.println(stmt, ';');
          return null;
      };
      AbstractEmitterVisitor.prototype.visitReturnStmt = function (stmt, ctx) {
          ctx.print(stmt, "return ");
          stmt.value.visitExpression(this, ctx);
          ctx.println(stmt, ';');
          return null;
      };
      AbstractEmitterVisitor.prototype.visitIfStmt = function (stmt, ctx) {
          ctx.print(stmt, "if (");
          stmt.condition.visitExpression(this, ctx);
          ctx.print(stmt, ") {");
          var hasElseCase = stmt.falseCase != null && stmt.falseCase.length > 0;
          if (stmt.trueCase.length <= 1 && !hasElseCase) {
              ctx.print(stmt, " ");
              this.visitAllStatements(stmt.trueCase, ctx);
              ctx.removeEmptyLastLine();
              ctx.print(stmt, " ");
          }
          else {
              ctx.println();
              ctx.incIndent();
              this.visitAllStatements(stmt.trueCase, ctx);
              ctx.decIndent();
              if (hasElseCase) {
                  ctx.println(stmt, "} else {");
                  ctx.incIndent();
                  this.visitAllStatements(stmt.falseCase, ctx);
                  ctx.decIndent();
              }
          }
          ctx.println(stmt, "}");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitThrowStmt = function (stmt, ctx) {
          ctx.print(stmt, "throw ");
          stmt.error.visitExpression(this, ctx);
          ctx.println(stmt, ";");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitCommentStmt = function (stmt, ctx) {
          var lines = stmt.comment.split('\n');
          lines.forEach(function (line) { ctx.println(stmt, "// " + line); });
          return null;
      };
      AbstractEmitterVisitor.prototype.visitWriteVarExpr = function (expr, ctx) {
          var lineWasEmpty = ctx.lineIsEmpty();
          if (!lineWasEmpty) {
              ctx.print(expr, '(');
          }
          ctx.print(expr, expr.name + " = ");
          expr.value.visitExpression(this, ctx);
          if (!lineWasEmpty) {
              ctx.print(expr, ')');
          }
          return null;
      };
      AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function (expr, ctx) {
          var lineWasEmpty = ctx.lineIsEmpty();
          if (!lineWasEmpty) {
              ctx.print(expr, '(');
          }
          expr.receiver.visitExpression(this, ctx);
          ctx.print(expr, "[");
          expr.index.visitExpression(this, ctx);
          ctx.print(expr, "] = ");
          expr.value.visitExpression(this, ctx);
          if (!lineWasEmpty) {
              ctx.print(expr, ')');
          }
          return null;
      };
      AbstractEmitterVisitor.prototype.visitWritePropExpr = function (expr, ctx) {
          var lineWasEmpty = ctx.lineIsEmpty();
          if (!lineWasEmpty) {
              ctx.print(expr, '(');
          }
          expr.receiver.visitExpression(this, ctx);
          ctx.print(expr, "." + expr.name + " = ");
          expr.value.visitExpression(this, ctx);
          if (!lineWasEmpty) {
              ctx.print(expr, ')');
          }
          return null;
      };
      AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr, ctx) {
          expr.receiver.visitExpression(this, ctx);
          var name = expr.name;
          if (expr.builtin != null) {
              name = this.getBuiltinMethodName(expr.builtin);
              if (name == null) {
                  // some builtins just mean to skip the call.
                  return null;
              }
          }
          ctx.print(expr, "." + name + "(");
          this.visitAllExpressions(expr.args, ctx, ",");
          ctx.print(expr, ")");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
          expr.fn.visitExpression(this, ctx);
          ctx.print(expr, "(");
          this.visitAllExpressions(expr.args, ctx, ',');
          ctx.print(expr, ")");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
          var varName = ast.name;
          if (ast.builtin != null) {
              switch (ast.builtin) {
                  case BuiltinVar.Super:
                      varName = 'super';
                      break;
                  case BuiltinVar.This:
                      varName = 'this';
                      break;
                  case BuiltinVar.CatchError:
                      varName = CATCH_ERROR_VAR$1.name;
                      break;
                  case BuiltinVar.CatchStack:
                      varName = CATCH_STACK_VAR$1.name;
                      break;
                  default:
                      throw new Error("Unknown builtin variable " + ast.builtin);
              }
          }
          ctx.print(ast, varName);
          return null;
      };
      AbstractEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
          ctx.print(ast, "new ");
          ast.classExpr.visitExpression(this, ctx);
          ctx.print(ast, "(");
          this.visitAllExpressions(ast.args, ctx, ',');
          ctx.print(ast, ")");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
          var value = ast.value;
          if (typeof value === 'string') {
              ctx.print(ast, escapeIdentifier(value, this._escapeDollarInStrings));
          }
          else {
              ctx.print(ast, "" + value);
          }
          return null;
      };
      AbstractEmitterVisitor.prototype.visitConditionalExpr = function (ast, ctx) {
          ctx.print(ast, "(");
          ast.condition.visitExpression(this, ctx);
          ctx.print(ast, '? ');
          ast.trueCase.visitExpression(this, ctx);
          ctx.print(ast, ': ');
          ast.falseCase.visitExpression(this, ctx);
          ctx.print(ast, ")");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitNotExpr = function (ast, ctx) {
          ctx.print(ast, '!');
          ast.condition.visitExpression(this, ctx);
          return null;
      };
      AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
          var opStr;
          switch (ast.operator) {
              case BinaryOperator.Equals:
                  opStr = '==';
                  break;
              case BinaryOperator.Identical:
                  opStr = '===';
                  break;
              case BinaryOperator.NotEquals:
                  opStr = '!=';
                  break;
              case BinaryOperator.NotIdentical:
                  opStr = '!==';
                  break;
              case BinaryOperator.And:
                  opStr = '&&';
                  break;
              case BinaryOperator.Or:
                  opStr = '||';
                  break;
              case BinaryOperator.Plus:
                  opStr = '+';
                  break;
              case BinaryOperator.Minus:
                  opStr = '-';
                  break;
              case BinaryOperator.Divide:
                  opStr = '/';
                  break;
              case BinaryOperator.Multiply:
                  opStr = '*';
                  break;
              case BinaryOperator.Modulo:
                  opStr = '%';
                  break;
              case BinaryOperator.Lower:
                  opStr = '<';
                  break;
              case BinaryOperator.LowerEquals:
                  opStr = '<=';
                  break;
              case BinaryOperator.Bigger:
                  opStr = '>';
                  break;
              case BinaryOperator.BiggerEquals:
                  opStr = '>=';
                  break;
              default:
                  throw new Error("Unknown operator " + ast.operator);
          }
          ctx.print(ast, "(");
          ast.lhs.visitExpression(this, ctx);
          ctx.print(ast, " " + opStr + " ");
          ast.rhs.visitExpression(this, ctx);
          ctx.print(ast, ")");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitReadPropExpr = function (ast, ctx) {
          ast.receiver.visitExpression(this, ctx);
          ctx.print(ast, ".");
          ctx.print(ast, ast.name);
          return null;
      };
      AbstractEmitterVisitor.prototype.visitReadKeyExpr = function (ast, ctx) {
          ast.receiver.visitExpression(this, ctx);
          ctx.print(ast, "[");
          ast.index.visitExpression(this, ctx);
          ctx.print(ast, "]");
          return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
          var useNewLine = ast.entries.length > 1;
          ctx.print(ast, "[", useNewLine);
          ctx.incIndent();
          this.visitAllExpressions(ast.entries, ctx, ',', useNewLine);
          ctx.decIndent();
          ctx.print(ast, "]", useNewLine);
          return null;
      };
      AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
          var _this = this;
          var useNewLine = ast.entries.length > 1;
          ctx.print(ast, "{", useNewLine);
          ctx.incIndent();
          this.visitAllObjects(function (entry) {
              ctx.print(ast, escapeIdentifier(entry.key, _this._escapeDollarInStrings, entry.quoted) + ": ");
              entry.value.visitExpression(_this, ctx);
          }, ast.entries, ctx, ',', useNewLine);
          ctx.decIndent();
          ctx.print(ast, "}", useNewLine);
          return null;
      };
      AbstractEmitterVisitor.prototype.visitAllExpressions = function (expressions, ctx, separator, newLine) {
          var _this = this;
          if (newLine === void 0) { newLine = false; }
          this.visitAllObjects(function (expr) { return expr.visitExpression(_this, ctx); }, expressions, ctx, separator, newLine);
      };
      AbstractEmitterVisitor.prototype.visitAllObjects = function (handler, expressions, ctx, separator, newLine) {
          if (newLine === void 0) { newLine = false; }
          for (var i = 0; i < expressions.length; i++) {
              if (i > 0) {
                  ctx.print(null, separator, newLine);
              }
              handler(expressions[i]);
          }
          if (newLine) {
              ctx.println();
          }
      };
      AbstractEmitterVisitor.prototype.visitAllStatements = function (statements, ctx) {
          var _this = this;
          statements.forEach(function (stmt) { return stmt.visitStatement(_this, ctx); });
      };
      return AbstractEmitterVisitor;
  }());
  function escapeIdentifier(input, escapeDollar, alwaysQuote) {
      if (alwaysQuote === void 0) { alwaysQuote = true; }
      if (input == null) {
          return null;
      }
      var body = input.replace(_SINGLE_QUOTE_ESCAPE_STRING_RE, function () {
          var match = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              match[_i] = arguments[_i];
          }
          if (match[0] == '$') {
              return escapeDollar ? '\\$' : '$';
          }
          else if (match[0] == '\n') {
              return '\\n';
          }
          else if (match[0] == '\r') {
              return '\\r';
          }
          else {
              return "\\" + match[0];
          }
      });
      var requiresQuotes = alwaysQuote || !_LEGAL_IDENTIFIER_RE.test(body);
      return requiresQuotes ? "'" + body + "'" : body;
  }
  function _createIndent(count) {
      var res = '';
      for (var i = 0; i < count; i++) {
          res += _INDENT_WITH;
      }
      return res;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$19 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var _debugFilePath = '/debug/lib';
  function debugOutputAstAsTypeScript(ast) {
      var converter = new _TsEmitterVisitor(_debugFilePath, {
          fileNameToModuleName: function (filePath, containingFilePath) { return filePath; },
          getImportAs: function (symbol) { return null; },
          getTypeArity: function (symbol) { return null; }
      });
      var ctx = EmitterVisitorContext.createRoot([]);
      var asts = Array.isArray(ast) ? ast : [ast];
      asts.forEach(function (ast) {
          if (ast instanceof Statement) {
              ast.visitStatement(converter, ctx);
          }
          else if (ast instanceof Expression) {
              ast.visitExpression(converter, ctx);
          }
          else if (ast instanceof Type$1) {
              ast.visitType(converter, ctx);
          }
          else {
              throw new Error("Don't know how to print debug info for " + ast);
          }
      });
      return ctx.toSource();
  }
  var TypeScriptEmitter = (function () {
      function TypeScriptEmitter(_importResolver) {
          this._importResolver = _importResolver;
      }
      TypeScriptEmitter.prototype.emitStatements = function (genFilePath, stmts, exportedVars) {
          var _this = this;
          var converter = new _TsEmitterVisitor(genFilePath, this._importResolver);
          var ctx = EmitterVisitorContext.createRoot(exportedVars);
          converter.visitAllStatements(stmts, ctx);
          var srcParts = [];
          converter.reexports.forEach(function (reexports, exportedFilePath) {
              var reexportsCode = reexports.map(function (reexport) { return reexport.name + " as " + reexport.as; }).join(',');
              srcParts.push("export {" + reexportsCode + "} from '" + _this._importResolver.fileNameToModuleName(exportedFilePath, genFilePath) + "';");
          });
          converter.importsWithPrefixes.forEach(function (prefix, importedFilePath) {
              // Note: can't write the real word for import as it screws up system.js auto detection...
              srcParts.push("imp" +
                  ("ort * as " + prefix + " from '" + _this._importResolver.fileNameToModuleName(importedFilePath, genFilePath) + "';"));
          });
          srcParts.push(ctx.toSource());
          var prefixLines = converter.reexports.size + converter.importsWithPrefixes.size;
          var sm = ctx.toSourceMapGenerator(null, prefixLines).toJsComment();
          if (sm) {
              srcParts.push(sm);
          }
          return srcParts.join('\n');
      };
      return TypeScriptEmitter;
  }());
  var _TsEmitterVisitor = (function (_super) {
      __extends$19(_TsEmitterVisitor, _super);
      function _TsEmitterVisitor(_genFilePath, _importResolver) {
          var _this = _super.call(this, false) || this;
          _this._genFilePath = _genFilePath;
          _this._importResolver = _importResolver;
          _this.typeExpression = 0;
          _this.importsWithPrefixes = new Map();
          _this.reexports = new Map();
          return _this;
      }
      _TsEmitterVisitor.prototype.visitType = function (t, ctx, defaultType) {
          if (defaultType === void 0) { defaultType = 'any'; }
          if (t != null) {
              this.typeExpression++;
              t.visitType(this, ctx);
              this.typeExpression--;
          }
          else {
              ctx.print(null, defaultType);
          }
      };
      _TsEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
          var value = ast.value;
          if (value == null && ast.type != INFERRED_TYPE) {
              ctx.print(ast, "(" + value + " as any)");
              return null;
          }
          return _super.prototype.visitLiteralExpr.call(this, ast, ctx);
      };
      // Temporary workaround to support strictNullCheck enabled consumers of ngc emit.
      // In SNC mode, [] have the type never[], so we cast here to any[].
      // TODO: narrow the cast to a more explicit type, or use a pattern that does not
      // start with [].concat. see https://github.com/angular/angular/pull/11846
      _TsEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
          if (ast.entries.length === 0) {
              ctx.print(ast, '(');
          }
          var result = _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
          if (ast.entries.length === 0) {
              ctx.print(ast, ' as any[])');
          }
          return result;
      };
      _TsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
          this._visitIdentifier(ast.value, ast.typeParams, ctx);
          return null;
      };
      _TsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
          if (ctx.isExportedVar(stmt.name) && stmt.value instanceof ExternalExpr && !stmt.type) {
              // check for a reexport
              var _a = this._resolveStaticSymbol(stmt.value.value), name_1 = _a.name, filePath = _a.filePath, members = _a.members;
              if (members.length === 0 && filePath !== this._genFilePath) {
                  var reexports = this.reexports.get(filePath);
                  if (!reexports) {
                      reexports = [];
                      this.reexports.set(filePath, reexports);
                  }
                  reexports.push({ name: name_1, as: stmt.name });
                  return null;
              }
          }
          if (ctx.isExportedVar(stmt.name)) {
              ctx.print(stmt, "export ");
          }
          if (stmt.hasModifier(StmtModifier.Final)) {
              ctx.print(stmt, "const");
          }
          else {
              ctx.print(stmt, "var");
          }
          ctx.print(stmt, " " + stmt.name);
          this._printColonType(stmt.type, ctx);
          ctx.print(stmt, " = ");
          stmt.value.visitExpression(this, ctx);
          ctx.println(stmt, ";");
          return null;
      };
      _TsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
          ctx.print(ast, "(<");
          ast.type.visitType(this, ctx);
          ctx.print(ast, ">");
          ast.value.visitExpression(this, ctx);
          ctx.print(ast, ")");
          return null;
      };
      _TsEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
          ctx.print(ast, "new ");
          this.typeExpression++;
          ast.classExpr.visitExpression(this, ctx);
          this.typeExpression--;
          ctx.print(ast, "(");
          this.visitAllExpressions(ast.args, ctx, ',');
          ctx.print(ast, ")");
          return null;
      };
      _TsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
          var _this = this;
          ctx.pushClass(stmt);
          if (ctx.isExportedVar(stmt.name)) {
              ctx.print(stmt, "export ");
          }
          ctx.print(stmt, "class " + stmt.name);
          if (stmt.parent != null) {
              ctx.print(stmt, " extends ");
              this.typeExpression++;
              stmt.parent.visitExpression(this, ctx);
              this.typeExpression--;
          }
          ctx.println(stmt, " {");
          ctx.incIndent();
          stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
          if (stmt.constructorMethod != null) {
              this._visitClassConstructor(stmt, ctx);
          }
          stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
          stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
          ctx.decIndent();
          ctx.println(stmt, "}");
          ctx.popClass();
          return null;
      };
      _TsEmitterVisitor.prototype._visitClassField = function (field, ctx) {
          if (field.hasModifier(StmtModifier.Private)) {
              // comment out as a workaround for #10967
              ctx.print(null, "/*private*/ ");
          }
          ctx.print(null, field.name);
          this._printColonType(field.type, ctx);
          ctx.println(null, ";");
      };
      _TsEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
          if (getter.hasModifier(StmtModifier.Private)) {
              ctx.print(null, "private ");
          }
          ctx.print(null, "get " + getter.name + "()");
          this._printColonType(getter.type, ctx);
          ctx.println(null, " {");
          ctx.incIndent();
          this.visitAllStatements(getter.body, ctx);
          ctx.decIndent();
          ctx.println(null, "}");
      };
      _TsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
          ctx.print(stmt, "constructor(");
          this._visitParams(stmt.constructorMethod.params, ctx);
          ctx.println(stmt, ") {");
          ctx.incIndent();
          this.visitAllStatements(stmt.constructorMethod.body, ctx);
          ctx.decIndent();
          ctx.println(stmt, "}");
      };
      _TsEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
          if (method.hasModifier(StmtModifier.Private)) {
              ctx.print(null, "private ");
          }
          ctx.print(null, method.name + "(");
          this._visitParams(method.params, ctx);
          ctx.print(null, ")");
          this._printColonType(method.type, ctx, 'void');
          ctx.println(null, " {");
          ctx.incIndent();
          this.visitAllStatements(method.body, ctx);
          ctx.decIndent();
          ctx.println(null, "}");
      };
      _TsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
          ctx.print(ast, "(");
          this._visitParams(ast.params, ctx);
          ctx.print(ast, ")");
          this._printColonType(ast.type, ctx, 'void');
          ctx.println(ast, " => {");
          ctx.incIndent();
          this.visitAllStatements(ast.statements, ctx);
          ctx.decIndent();
          ctx.print(ast, "}");
          return null;
      };
      _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
          if (ctx.isExportedVar(stmt.name)) {
              ctx.print(stmt, "export ");
          }
          ctx.print(stmt, "function " + stmt.name + "(");
          this._visitParams(stmt.params, ctx);
          ctx.print(stmt, ")");
          this._printColonType(stmt.type, ctx, 'void');
          ctx.println(stmt, " {");
          ctx.incIndent();
          this.visitAllStatements(stmt.statements, ctx);
          ctx.decIndent();
          ctx.println(stmt, "}");
          return null;
      };
      _TsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
          ctx.println(stmt, "try {");
          ctx.incIndent();
          this.visitAllStatements(stmt.bodyStmts, ctx);
          ctx.decIndent();
          ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
          ctx.incIndent();
          var catchStmts = [CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack')).toDeclStmt(null, [
                  StmtModifier.Final
              ])].concat(stmt.catchStmts);
          this.visitAllStatements(catchStmts, ctx);
          ctx.decIndent();
          ctx.println(stmt, "}");
          return null;
      };
      _TsEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
          var typeStr;
          switch (type.name) {
              case BuiltinTypeName.Bool:
                  typeStr = 'boolean';
                  break;
              case BuiltinTypeName.Dynamic:
                  typeStr = 'any';
                  break;
              case BuiltinTypeName.Function:
                  typeStr = 'Function';
                  break;
              case BuiltinTypeName.Number:
                  typeStr = 'number';
                  break;
              case BuiltinTypeName.Int:
                  typeStr = 'number';
                  break;
              case BuiltinTypeName.String:
                  typeStr = 'string';
                  break;
              default:
                  throw new Error("Unsupported builtin type " + type.name);
          }
          ctx.print(null, typeStr);
          return null;
      };
      _TsEmitterVisitor.prototype.visitExpressionType = function (ast, ctx) {
          ast.value.visitExpression(this, ctx);
          return null;
      };
      _TsEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
          this.visitType(type.of, ctx);
          ctx.print(null, "[]");
          return null;
      };
      _TsEmitterVisitor.prototype.visitMapType = function (type, ctx) {
          ctx.print(null, "{[key: string]:");
          this.visitType(type.valueType, ctx);
          ctx.print(null, "}");
          return null;
      };
      _TsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
          var name;
          switch (method) {
              case BuiltinMethod.ConcatArray:
                  name = 'concat';
                  break;
              case BuiltinMethod.SubscribeObservable:
                  name = 'subscribe';
                  break;
              case BuiltinMethod.Bind:
                  name = 'bind';
                  break;
              default:
                  throw new Error("Unknown builtin method: " + method);
          }
          return name;
      };
      _TsEmitterVisitor.prototype._visitParams = function (params, ctx) {
          var _this = this;
          this.visitAllObjects(function (param) {
              ctx.print(null, param.name);
              _this._printColonType(param.type, ctx);
          }, params, ctx, ',');
      };
      _TsEmitterVisitor.prototype._resolveStaticSymbol = function (value) {
          var reference = value.reference;
          if (!(reference instanceof StaticSymbol)) {
              throw new Error("Internal error: unknown identifier " + JSON.stringify(value));
          }
          var arity = this._importResolver.getTypeArity(reference) || undefined;
          var importReference = this._importResolver.getImportAs(reference) || reference;
          return {
              name: importReference.name,
              filePath: importReference.filePath,
              members: importReference.members, arity: arity
          };
      };
      _TsEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
          var _this = this;
          var _a = this._resolveStaticSymbol(value), name = _a.name, filePath = _a.filePath, members = _a.members, arity = _a.arity;
          if (filePath != this._genFilePath) {
              var prefix = this.importsWithPrefixes.get(filePath);
              if (prefix == null) {
                  prefix = "import" + this.importsWithPrefixes.size;
                  this.importsWithPrefixes.set(filePath, prefix);
              }
              ctx.print(null, prefix + ".");
          }
          if (members.length) {
              ctx.print(null, name);
              ctx.print(null, '.');
              ctx.print(null, members.join('.'));
          }
          else {
              ctx.print(null, name);
          }
          if (this.typeExpression > 0) {
              // If we are in a type expression that refers to a generic type then supply
              // the required type parameters. If there were not enough type parameters
              // supplied, supply any as the type. Outside a type expression the reference
              // should not supply type parameters and be treated as a simple value reference
              // to the constructor function itself.
              var suppliedParameters = (typeParams && typeParams.length) || 0;
              var additionalParameters = (arity || 0) - suppliedParameters;
              if (suppliedParameters > 0 || additionalParameters > 0) {
                  ctx.print(null, "<");
                  if (suppliedParameters > 0) {
                      this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, typeParams, ctx, ',');
                  }
                  if (additionalParameters > 0) {
                      for (var i = 0; i < additionalParameters; i++) {
                          if (i > 0 || suppliedParameters > 0)
                              ctx.print(null, ',');
                          ctx.print(null, 'any');
                      }
                  }
                  ctx.print(null, ">");
              }
          }
      };
      _TsEmitterVisitor.prototype._printColonType = function (type, ctx, defaultType) {
          if (type !== INFERRED_TYPE) {
              ctx.print(null, ':');
              this.visitType(type, ctx, defaultType);
          }
      };
      return _TsEmitterVisitor;
  }(AbstractEmitterVisitor));

  // =================================================================================================
  // =================================================================================================
  // =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
  // =================================================================================================
  // =================================================================================================
  //
  //        DO NOT EDIT THIS LIST OF SECURITY SENSITIVE PROPERTIES WITHOUT A SECURITY REVIEW!
  //                               Reach out to mprobst for details.
  //
  // =================================================================================================
  /** Map from tagName|propertyName SecurityContext. Properties applying to all tags use '*'. */
  var SECURITY_SCHEMA = {};
  function registerContext(ctx, specs) {
      for (var _i = 0, specs_1 = specs; _i < specs_1.length; _i++) {
          var spec = specs_1[_i];
          SECURITY_SCHEMA[spec.toLowerCase()] = ctx;
      }
  }
  // Case is insignificant below, all element and attribute names are lower-cased for lookup.
  registerContext(_angular_core.SecurityContext.HTML, [
      'iframe|srcdoc',
      '*|innerHTML',
      '*|outerHTML',
  ]);
  registerContext(_angular_core.SecurityContext.STYLE, ['*|style']);
  // NB: no SCRIPT contexts here, they are never allowed due to the parser stripping them.
  registerContext(_angular_core.SecurityContext.URL, [
      '*|formAction', 'area|href', 'area|ping', 'audio|src', 'a|href',
      'a|ping', 'blockquote|cite', 'body|background', 'del|cite', 'form|action',
      'img|src', 'img|srcset', 'input|src', 'ins|cite', 'q|cite',
      'source|src', 'source|srcset', 'track|src', 'video|poster', 'video|src',
  ]);
  registerContext(_angular_core.SecurityContext.RESOURCE_URL, [
      'applet|code',
      'applet|codebase',
      'base|href',
      'embed|src',
      'frame|src',
      'head|profile',
      'html|manifest',
      'iframe|src',
      'link|href',
      'media|src',
      'object|codebase',
      'object|data',
      'script|src',
  ]);

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$20 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var BOOLEAN = 'boolean';
  var NUMBER = 'number';
  var STRING = 'string';
  var OBJECT = 'object';
  /**
   * This array represents the DOM schema. It encodes inheritance, properties, and events.
   *
   * ## Overview
   *
   * Each line represents one kind of element. The `element_inheritance` and properties are joined
   * using `element_inheritance|properties` syntax.
   *
   * ## Element Inheritance
   *
   * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
   * Here the individual elements are separated by `,` (commas). Every element in the list
   * has identical properties.
   *
   * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
   * specified then `""` (blank) element is assumed.
   *
   * NOTE: The blank element inherits from root `[Element]` element, the super element of all
   * elements.
   *
   * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
   *
   * ## Properties
   *
   * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
   * by a special character designating its type:
   *
   * - (no prefix): property is a string.
   * - `*`: property represents an event.
   * - `!`: property is a boolean.
   * - `#`: property is a number.
   * - `%`: property is an object.
   *
   * ## Query
   *
   * The class creates an internal squas representation which allows to easily answer the query of
   * if a given property exist on a given element.
   *
   * NOTE: We don't yet support querying for types or events.
   * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
   *       see dom_element_schema_registry_spec.ts
   */
  // =================================================================================================
  // =================================================================================================
  // =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
  // =================================================================================================
  // =================================================================================================
  //
  //                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
  //
  // Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
  // dom_security_schema.ts. Reach out to mprobst & rjamet for details.
  //
  // =================================================================================================
  var SCHEMA = [
      '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop',
      '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*beforecopy,*beforecut,*beforepaste,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*message,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*paste,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*search,*seeked,*seeking,*select,*selectstart,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate',
      'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*beforecopy,*beforecut,*beforepaste,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*message,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*paste,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*search,*seeked,*seeking,*select,*selectstart,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate',
      'media^[HTMLElement]|!autoplay,!controls,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,#playbackRate,preload,src,%srcObject,#volume',
      ':svg:^[HTMLElement]|*abort,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
      ':svg:graphics^:svg:|',
      ':svg:animation^:svg:|*begin,*end,*repeat',
      ':svg:geometry^:svg:|',
      ':svg:componentTransferFunction^:svg:|',
      ':svg:gradient^:svg:|',
      ':svg:textContent^:svg:graphics|',
      ':svg:textPositioning^:svg:textContent|',
      'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
      'area^[HTMLElement]|alt,coords,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,search,shape,target,username',
      'audio^media|',
      'br^[HTMLElement]|clear',
      'base^[HTMLElement]|href,target',
      'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
      'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
      'canvas^[HTMLElement]|#height,#width',
      'content^[HTMLElement]|select',
      'dl^[HTMLElement]|!compact',
      'datalist^[HTMLElement]|',
      'details^[HTMLElement]|!open',
      'dialog^[HTMLElement]|!open,returnValue',
      'dir^[HTMLElement]|!compact',
      'div^[HTMLElement]|align',
      'embed^[HTMLElement]|align,height,name,src,type,width',
      'fieldset^[HTMLElement]|!disabled,name',
      'font^[HTMLElement]|color,face,size',
      'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
      'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
      'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
      'hr^[HTMLElement]|align,color,!noShade,size,width',
      'head^[HTMLElement]|',
      'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
      'html^[HTMLElement]|version',
      'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
      'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
      'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
      'keygen^[HTMLElement]|!autofocus,challenge,!disabled,keytype,name',
      'li^[HTMLElement]|type,#value',
      'label^[HTMLElement]|htmlFor',
      'legend^[HTMLElement]|align',
      'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,rel,%relList,rev,%sizes,target,type',
      'map^[HTMLElement]|name',
      'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
      'menu^[HTMLElement]|!compact',
      'meta^[HTMLElement]|content,httpEquiv,name,scheme',
      'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
      'ins,del^[HTMLElement]|cite,dateTime',
      'ol^[HTMLElement]|!compact,!reversed,#start,type',
      'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
      'optgroup^[HTMLElement]|!disabled,label',
      'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
      'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
      'p^[HTMLElement]|align',
      'param^[HTMLElement]|name,type,value,valueType',
      'picture^[HTMLElement]|',
      'pre^[HTMLElement]|#width',
      'progress^[HTMLElement]|#max,#value',
      'q,blockquote,cite^[HTMLElement]|',
      'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
      'select^[HTMLElement]|!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
      'shadow^[HTMLElement]|',
      'source^[HTMLElement]|media,sizes,src,srcset,type',
      'span^[HTMLElement]|',
      'style^[HTMLElement]|!disabled,media,type',
      'caption^[HTMLElement]|align',
      'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
      'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
      'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
      'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
      'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
      'template^[HTMLElement]|',
      'textarea^[HTMLElement]|autocapitalize,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
      'title^[HTMLElement]|text',
      'track^[HTMLElement]|!default,kind,label,src,srclang',
      'ul^[HTMLElement]|!compact,type',
      'unknown^[HTMLElement]|',
      'video^media|#height,poster,#width',
      ':svg:a^:svg:graphics|',
      ':svg:animate^:svg:animation|',
      ':svg:animateMotion^:svg:animation|',
      ':svg:animateTransform^:svg:animation|',
      ':svg:circle^:svg:geometry|',
      ':svg:clipPath^:svg:graphics|',
      ':svg:cursor^:svg:|',
      ':svg:defs^:svg:graphics|',
      ':svg:desc^:svg:|',
      ':svg:discard^:svg:|',
      ':svg:ellipse^:svg:geometry|',
      ':svg:feBlend^:svg:|',
      ':svg:feColorMatrix^:svg:|',
      ':svg:feComponentTransfer^:svg:|',
      ':svg:feComposite^:svg:|',
      ':svg:feConvolveMatrix^:svg:|',
      ':svg:feDiffuseLighting^:svg:|',
      ':svg:feDisplacementMap^:svg:|',
      ':svg:feDistantLight^:svg:|',
      ':svg:feDropShadow^:svg:|',
      ':svg:feFlood^:svg:|',
      ':svg:feFuncA^:svg:componentTransferFunction|',
      ':svg:feFuncB^:svg:componentTransferFunction|',
      ':svg:feFuncG^:svg:componentTransferFunction|',
      ':svg:feFuncR^:svg:componentTransferFunction|',
      ':svg:feGaussianBlur^:svg:|',
      ':svg:feImage^:svg:|',
      ':svg:feMerge^:svg:|',
      ':svg:feMergeNode^:svg:|',
      ':svg:feMorphology^:svg:|',
      ':svg:feOffset^:svg:|',
      ':svg:fePointLight^:svg:|',
      ':svg:feSpecularLighting^:svg:|',
      ':svg:feSpotLight^:svg:|',
      ':svg:feTile^:svg:|',
      ':svg:feTurbulence^:svg:|',
      ':svg:filter^:svg:|',
      ':svg:foreignObject^:svg:graphics|',
      ':svg:g^:svg:graphics|',
      ':svg:image^:svg:graphics|',
      ':svg:line^:svg:geometry|',
      ':svg:linearGradient^:svg:gradient|',
      ':svg:mpath^:svg:|',
      ':svg:marker^:svg:|',
      ':svg:mask^:svg:|',
      ':svg:metadata^:svg:|',
      ':svg:path^:svg:geometry|',
      ':svg:pattern^:svg:|',
      ':svg:polygon^:svg:geometry|',
      ':svg:polyline^:svg:geometry|',
      ':svg:radialGradient^:svg:gradient|',
      ':svg:rect^:svg:geometry|',
      ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
      ':svg:script^:svg:|type',
      ':svg:set^:svg:animation|',
      ':svg:stop^:svg:|',
      ':svg:style^:svg:|!disabled,media,title,type',
      ':svg:switch^:svg:graphics|',
      ':svg:symbol^:svg:|',
      ':svg:tspan^:svg:textPositioning|',
      ':svg:text^:svg:textPositioning|',
      ':svg:textPath^:svg:textContent|',
      ':svg:title^:svg:|',
      ':svg:use^:svg:graphics|',
      ':svg:view^:svg:|#zoomAndPan',
      'data^[HTMLElement]|value',
      'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
      'summary^[HTMLElement]|',
      'time^[HTMLElement]|dateTime',
  ];
  var _ATTR_TO_PROP = {
      'class': 'className',
      'for': 'htmlFor',
      'formaction': 'formAction',
      'innerHtml': 'innerHTML',
      'readonly': 'readOnly',
      'tabindex': 'tabIndex',
  };
  var DomElementSchemaRegistry = (function (_super) {
      __extends$20(DomElementSchemaRegistry, _super);
      function DomElementSchemaRegistry() {
          var _this = _super.call(this) || this;
          _this._schema = {};
          SCHEMA.forEach(function (encodedType) {
              var type = {};
              var _a = encodedType.split('|'), strType = _a[0], strProperties = _a[1];
              var properties = strProperties.split(',');
              var _b = strType.split('^'), typeNames = _b[0], superName = _b[1];
              typeNames.split(',').forEach(function (tag) { return _this._schema[tag.toLowerCase()] = type; });
              var superType = superName && _this._schema[superName.toLowerCase()];
              if (superType) {
                  Object.keys(superType).forEach(function (prop) { type[prop] = superType[prop]; });
              }
              properties.forEach(function (property) {
                  if (property.length > 0) {
                      switch (property[0]) {
                          case '*':
                              // We don't yet support events.
                              // If ever allowing to bind to events, GO THROUGH A SECURITY REVIEW, allowing events
                              // will
                              // almost certainly introduce bad XSS vulnerabilities.
                              // type[property.substring(1)] = EVENT;
                              break;
                          case '!':
                              type[property.substring(1)] = BOOLEAN;
                              break;
                          case '#':
                              type[property.substring(1)] = NUMBER;
                              break;
                          case '%':
                              type[property.substring(1)] = OBJECT;
                              break;
                          default:
                              type[property] = STRING;
                      }
                  }
              });
          });
          return _this;
      }
      DomElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) {
          if (schemaMetas.some(function (schema) { return schema.name === _angular_core.NO_ERRORS_SCHEMA.name; })) {
              return true;
          }
          if (tagName.indexOf('-') > -1) {
              if (tagName === 'ng-container' || tagName === 'ng-content') {
                  return false;
              }
              if (schemaMetas.some(function (schema) { return schema.name === _angular_core.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                  // Can't tell now as we don't know which properties a custom element will get
                  // once it is instantiated
                  return true;
              }
          }
          var elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
          return !!elementProperties[propName];
      };
      DomElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
          if (schemaMetas.some(function (schema) { return schema.name === _angular_core.NO_ERRORS_SCHEMA.name; })) {
              return true;
          }
          if (tagName.indexOf('-') > -1) {
              if (tagName === 'ng-container' || tagName === 'ng-content') {
                  return true;
              }
              if (schemaMetas.some(function (schema) { return schema.name === _angular_core.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                  // Allow any custom elements
                  return true;
              }
          }
          return !!this._schema[tagName.toLowerCase()];
      };
      /**
       * securityContext returns the security context for the given property on the given DOM tag.
       *
       * Tag and property name are statically known and cannot change at runtime, i.e. it is not
       * possible to bind a value into a changing attribute or tag name.
       *
       * The filtering is white list based. All attributes in the schema above are assumed to have the
       * 'NONE' security context, i.e. that they are safe inert string values. Only specific well known
       * attack vectors are assigned their appropriate context.
       */
      DomElementSchemaRegistry.prototype.securityContext = function (tagName, propName, isAttribute) {
          if (isAttribute) {
              // NB: For security purposes, use the mapped property name, not the attribute name.
              propName = this.getMappedPropName(propName);
          }
          // Make sure comparisons are case insensitive, so that case differences between attribute and
          // property names do not have a security impact.
          tagName = tagName.toLowerCase();
          propName = propName.toLowerCase();
          var ctx = SECURITY_SCHEMA[tagName + '|' + propName];
          if (ctx) {
              return ctx;
          }
          ctx = SECURITY_SCHEMA['*|' + propName];
          return ctx ? ctx : _angular_core.SecurityContext.NONE;
      };
      DomElementSchemaRegistry.prototype.getMappedPropName = function (propName) { return _ATTR_TO_PROP[propName] || propName; };
      DomElementSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
      DomElementSchemaRegistry.prototype.validateProperty = function (name) {
          if (name.toLowerCase().startsWith('on')) {
              var msg = "Binding to event property '" + name + "' is disallowed for security reasons, " +
                  ("please use (" + name.slice(2) + ")=...") +
                  ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") +
                  " current module.";
              return { error: true, msg: msg };
          }
          else {
              return { error: false };
          }
      };
      DomElementSchemaRegistry.prototype.validateAttribute = function (name) {
          if (name.toLowerCase().startsWith('on')) {
              var msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " +
                  ("please use (" + name.slice(2) + ")=...");
              return { error: true, msg: msg };
          }
          else {
              return { error: false };
          }
      };
      DomElementSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this._schema); };
      DomElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) {
          return dashCaseToCamelCase(propName);
      };
      DomElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
          var unit = '';
          var strVal = val.toString().trim();
          var errorMsg = null;
          if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
              if (typeof val === 'number') {
                  unit = 'px';
              }
              else {
                  var valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                  if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                      errorMsg = "Please provide a CSS unit value for " + userProvidedProp + ":" + val;
                  }
              }
          }
          return { error: errorMsg, value: strVal + unit };
      };
      return DomElementSchemaRegistry;
  }(ElementSchemaRegistry));
  DomElementSchemaRegistry.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  DomElementSchemaRegistry.ctorParameters = function () { return []; };
  function _isPixelDimensionStyle(prop) {
      switch (prop) {
          case 'width':
          case 'height':
          case 'minWidth':
          case 'minHeight':
          case 'maxWidth':
          case 'maxHeight':
          case 'left':
          case 'top':
          case 'bottom':
          case 'right':
          case 'fontSize':
          case 'outlineWidth':
          case 'outlineOffset':
          case 'paddingTop':
          case 'paddingLeft':
          case 'paddingBottom':
          case 'paddingRight':
          case 'marginTop':
          case 'marginLeft':
          case 'marginBottom':
          case 'marginRight':
          case 'borderRadius':
          case 'borderWidth':
          case 'borderTopWidth':
          case 'borderLeftWidth':
          case 'borderRightWidth':
          case 'borderBottomWidth':
          case 'textIndent':
              return true;
          default:
              return false;
      }
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * This file is a port of shadowCSS from webcomponents.js to TypeScript.
   *
   * Please make sure to keep to edits in sync with the source file.
   *
   * Source:
   * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
   *
   * The original file level comment is reproduced below
   */
  /*
    This is a limited shim for ShadowDOM css styling.
    https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles

    The intention here is to support only the styling features which can be
    relatively simply implemented. The goal is to allow users to avoid the
    most obvious pitfalls and do so without compromising performance significantly.
    For ShadowDOM styling that's not covered here, a set of best practices
    can be provided that should allow users to accomplish more complex styling.

    The following is a list of specific ShadowDOM styling features and a brief
    discussion of the approach used to shim.

    Shimmed features:

    * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
    element using the :host rule. To shim this feature, the :host styles are
    reformatted and prefixed with a given scope name and promoted to a
    document level stylesheet.
    For example, given a scope name of .foo, a rule like this:

      :host {
          background: red;
        }
      }

    becomes:

      .foo {
        background: red;
      }

    * encapsulation: Styles defined within ShadowDOM, apply only to
    dom inside the ShadowDOM. Polymer uses one of two techniques to implement
    this feature.

    By default, rules are prefixed with the host element tag name
    as a descendant selector. This ensures styling does not leak out of the 'top'
    of the element's ShadowDOM. For example,

    div {
        font-weight: bold;
      }

    becomes:

    x-foo div {
        font-weight: bold;
      }

    becomes:


    Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
    selectors are scoped by adding an attribute selector suffix to each
    simple selector that contains the host element tag name. Each element
    in the element's ShadowDOM template is also given the scope attribute.
    Thus, these rules match only elements that have the scope attribute.
    For example, given a scope name of x-foo, a rule like this:

      div {
        font-weight: bold;
      }

    becomes:

      div[x-foo] {
        font-weight: bold;
      }

    Note that elements that are dynamically added to a scope must have the scope
    selector added to them manually.

    * upper/lower bound encapsulation: Styles which are defined outside a
    shadowRoot should not cross the ShadowDOM boundary and should not apply
    inside a shadowRoot.

    This styling behavior is not emulated. Some possible ways to do this that
    were rejected due to complexity and/or performance concerns include: (1) reset
    every possible property for every possible selector for a given scope name;
    (2) re-implement css in javascript.

    As an alternative, users should make sure to use selectors
    specific to the scope in which they are working.

    * ::distributed: This behavior is not emulated. It's often not necessary
    to style the contents of a specific insertion point and instead, descendants
    of the host element can be styled selectively. Users can also create an
    extra node around an insertion point and style that node's contents
    via descendent selectors. For example, with a shadowRoot like this:

      <style>
        ::content(div) {
          background: red;
        }
      </style>
      <content></content>

    could become:

      <style>
        / *@polyfill .content-container div * /
        ::content(div) {
          background: red;
        }
      </style>
      <div class="content-container">
        <content></content>
      </div>

    Note the use of @polyfill in the comment above a ShadowDOM specific style
    declaration. This is a directive to the styling shim to use the selector
    in comments in lieu of the next selector when running under polyfill.
  */
  var ShadowCss = (function () {
      function ShadowCss() {
          this.strictStyling = true;
      }
      /*
      * Shim some cssText with the given selector. Returns cssText that can
      * be included in the document via WebComponents.ShadowCSS.addCssToDocument(css).
      *
      * When strictStyling is true:
      * - selector is the attribute added to all elements inside the host,
      * - hostSelector is the attribute added to the host itself.
      */
      ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
          if (hostSelector === void 0) { hostSelector = ''; }
          var sourceMappingUrl = extractSourceMappingUrl(cssText);
          cssText = stripComments(cssText);
          cssText = this._insertDirectives(cssText);
          return this._scopeCssText(cssText, selector, hostSelector) + sourceMappingUrl;
      };
      ShadowCss.prototype._insertDirectives = function (cssText) {
          cssText = this._insertPolyfillDirectivesInCssText(cssText);
          return this._insertPolyfillRulesInCssText(cssText);
      };
      /*
       * Process styles to convert native ShadowDOM rules that will trip
       * up the css parser; we rely on decorating the stylesheet with inert rules.
       *
       * For example, we convert this rule:
       *
       * polyfill-next-selector { content: ':host menu-item'; }
       * ::content menu-item {
       *
       * to this:
       *
       * scopeName menu-item {
       *
      **/
      ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
          // Difference with webcomponents.js: does not handle comments
          return cssText.replace(_cssContentNextSelectorRe, function () {
              var m = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  m[_i] = arguments[_i];
              }
              return m[2] + '{';
          });
      };
      /*
       * Process styles to add rules which will only apply under the polyfill
       *
       * For example, we convert this rule:
       *
       * polyfill-rule {
       *   content: ':host menu-item';
       * ...
       * }
       *
       * to this:
       *
       * scopeName menu-item {...}
       *
      **/
      ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
          // Difference with webcomponents.js: does not handle comments
          return cssText.replace(_cssContentRuleRe, function () {
              var m = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  m[_i] = arguments[_i];
              }
              var rule = m[0].replace(m[1], '').replace(m[2], '');
              return m[4] + rule;
          });
      };
      /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
       *
       *  .foo {... }
       *
       *  and converts this to
       *
       *  scopeName .foo { ... }
      */
      ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
          var unscopedRules = this._extractUnscopedRulesFromCssText(cssText);
          // replace :host and :host-context -shadowcsshost and -shadowcsshost respectively
          cssText = this._insertPolyfillHostInCssText(cssText);
          cssText = this._convertColonHost(cssText);
          cssText = this._convertColonHostContext(cssText);
          cssText = this._convertShadowDOMSelectors(cssText);
          if (scopeSelector) {
              cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
          }
          cssText = cssText + '\n' + unscopedRules;
          return cssText.trim();
      };
      /*
       * Process styles to add rules which will only apply under the polyfill
       * and do not process via CSSOM. (CSSOM is destructive to rules on rare
       * occasions, e.g. -webkit-calc on Safari.)
       * For example, we convert this rule:
       *
       * @polyfill-unscoped-rule {
       *   content: 'menu-item';
       * ... }
       *
       * to this:
       *
       * menu-item {...}
       *
      **/
      ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
          // Difference with webcomponents.js: does not handle comments
          var r = '';
          var m;
          _cssContentUnscopedRuleRe.lastIndex = 0;
          while ((m = _cssContentUnscopedRuleRe.exec(cssText)) !== null) {
              var rule = m[0].replace(m[2], '').replace(m[1], m[4]);
              r += rule + '\n\n';
          }
          return r;
      };
      /*
       * convert a rule like :host(.foo) > .bar { }
       *
       * to
       *
       * .foo<scopeName> > .bar
      */
      ShadowCss.prototype._convertColonHost = function (cssText) {
          return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
      };
      /*
       * convert a rule like :host-context(.foo) > .bar { }
       *
       * to
       *
       * .foo<scopeName> > .bar, .foo scopeName > .bar { }
       *
       * and
       *
       * :host-context(.foo:host) .bar { ... }
       *
       * to
       *
       * .foo<scopeName> .bar { ... }
      */
      ShadowCss.prototype._convertColonHostContext = function (cssText) {
          return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
      };
      ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
          // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
          return cssText.replace(regExp, function () {
              var m = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  m[_i] = arguments[_i];
              }
              if (m[2]) {
                  var parts = m[2].split(',');
                  var r = [];
                  for (var i = 0; i < parts.length; i++) {
                      var p = parts[i].trim();
                      if (!p)
                          break;
                      r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                  }
                  return r.join(',');
              }
              else {
                  return _polyfillHostNoCombinator + m[3];
              }
          });
      };
      ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
          if (part.indexOf(_polyfillHost) > -1) {
              return this._colonHostPartReplacer(host, part, suffix);
          }
          else {
              return host + part + suffix + ', ' + part + ' ' + host + suffix;
          }
      };
      ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
          return host + part.replace(_polyfillHost, '') + suffix;
      };
      /*
       * Convert combinators like ::shadow and pseudo-elements like ::content
       * by replacing with space.
      */
      ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
          return _shadowDOMSelectorsRe.reduce(function (result, pattern) { return result.replace(pattern, ' '); }, cssText);
      };
      // change a selector like 'div' to 'name div'
      ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
          var _this = this;
          return processRules(cssText, function (rule) {
              var selector = rule.selector;
              var content = rule.content;
              if (rule.selector[0] != '@') {
                  selector =
                      _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
              }
              else if (rule.selector.startsWith('@media') || rule.selector.startsWith('@supports') ||
                  rule.selector.startsWith('@page') || rule.selector.startsWith('@document')) {
                  content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
              }
              return new CssRule(selector, content);
          });
      };
      ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
          var _this = this;
          return selector.split(',')
              .map(function (part) { return part.trim().split(_shadowDeepSelectors); })
              .map(function (deepParts) {
              var shallowPart = deepParts[0], otherParts = deepParts.slice(1);
              var applyScope = function (shallowPart) {
                  if (_this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                      return strict ?
                          _this._applyStrictSelectorScope(shallowPart, scopeSelector, hostSelector) :
                          _this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                  }
                  else {
                      return shallowPart;
                  }
              };
              return [applyScope(shallowPart)].concat(otherParts).join(' ');
          })
              .join(', ');
      };
      ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
          var re = this._makeScopeMatcher(scopeSelector);
          return !re.test(selector);
      };
      ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
          var lre = /\[/g;
          var rre = /\]/g;
          scopeSelector = scopeSelector.replace(lre, '\\[').replace(rre, '\\]');
          return new RegExp('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
      };
      ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
          // Difference from webcomponents.js: scopeSelector could not be an array
          return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
      };
      // scope via name and [is=name]
      ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
          // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
          _polyfillHostRe.lastIndex = 0;
          if (_polyfillHostRe.test(selector)) {
              var replaceBy_1 = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
              return selector
                  .replace(_polyfillHostNoCombinatorRe, function (hnc, selector) {
                  return selector.replace(/([^:]*)(:*)(.*)/, function (_, before, colon, after) {
                      return before + replaceBy_1 + colon + after;
                  });
              })
                  .replace(_polyfillHostRe, replaceBy_1 + ' ');
          }
          return scopeSelector + ' ' + selector;
      };
      // return a selector with [name] suffix on each simple selector
      // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
      ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector, hostSelector) {
          var _this = this;
          var isRe = /\[is=([^\]]*)\]/g;
          scopeSelector = scopeSelector.replace(isRe, function (_) {
              var parts = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                  parts[_i - 1] = arguments[_i];
              }
              return parts[0];
          });
          var attrName = '[' + scopeSelector + ']';
          var _scopeSelectorPart = function (p) {
              var scopedP = p.trim();
              if (!scopedP) {
                  return '';
              }
              if (p.indexOf(_polyfillHostNoCombinator) > -1) {
                  scopedP = _this._applySimpleSelectorScope(p, scopeSelector, hostSelector);
              }
              else {
                  // remove :host since it should be unnecessary
                  var t = p.replace(_polyfillHostRe, '');
                  if (t.length > 0) {
                      var matches = t.match(/([^:]*)(:*)(.*)/);
                      if (matches) {
                          scopedP = matches[1] + attrName + matches[2] + matches[3];
                      }
                  }
              }
              return scopedP;
          };
          var safeContent = new SafeSelector(selector);
          selector = safeContent.content();
          var scopedSelector = '';
          var startIndex = 0;
          var res;
          var sep = /( |>|\+|~(?!=))\s*/g;
          var scopeAfter = selector.indexOf(_polyfillHostNoCombinator);
          while ((res = sep.exec(selector)) !== null) {
              var separator = res[1];
              var part = selector.slice(startIndex, res.index).trim();
              // if a selector appears before :host-context it should not be shimmed as it
              // matches on ancestor elements and not on elements in the host's shadow
              var scopedPart = startIndex >= scopeAfter ? _scopeSelectorPart(part) : part;
              scopedSelector += scopedPart + " " + separator + " ";
              startIndex = sep.lastIndex;
          }
          scopedSelector += _scopeSelectorPart(selector.substring(startIndex));
          // replace the placeholders with their original values
          return safeContent.restore(scopedSelector);
      };
      ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
          return selector.replace(_colonHostContextRe, _polyfillHostContext)
              .replace(_colonHostRe, _polyfillHost);
      };
      return ShadowCss;
  }());
  var SafeSelector = (function () {
      function SafeSelector(selector) {
          var _this = this;
          this.placeholders = [];
          this.index = 0;
          // Replaces attribute selectors with placeholders.
          // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
          selector = selector.replace(/(\[[^\]]*\])/g, function (_, keep) {
              var replaceBy = "__ph-" + _this.index + "__";
              _this.placeholders.push(keep);
              _this.index++;
              return replaceBy;
          });
          // Replaces the expression in `:nth-child(2n + 1)` with a placeholder.
          // WS and "+" would otherwise be interpreted as selector separators.
          this._content = selector.replace(/(:nth-[-\w]+)(\([^)]+\))/g, function (_, pseudo, exp) {
              var replaceBy = "__ph-" + _this.index + "__";
              _this.placeholders.push(exp);
              _this.index++;
              return pseudo + replaceBy;
          });
      }
      ;
      SafeSelector.prototype.restore = function (content) {
          var _this = this;
          return content.replace(/__ph-(\d+)__/g, function (ph, index) { return _this.placeholders[+index]; });
      };
      SafeSelector.prototype.content = function () { return this._content; };
      return SafeSelector;
  }());
  var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?(['"])(.*?)\1[;\s]*}([^{]*?){/gim;
  var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
  var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*(['"])(.*?)\3)[;\s]*[^}]*}/gim;
  var _polyfillHost = '-shadowcsshost';
  // note: :host-context pre-processed to -shadowcsshostcontext.
  var _polyfillHostContext = '-shadowcsscontext';
  var _parenSuffix = ')(?:\\((' +
      '(?:\\([^)(]*\\)|[^)(]*)+?' +
      ')\\))?([^,{]*)';
  var _cssColonHostRe = new RegExp('(' + _polyfillHost + _parenSuffix, 'gim');
  var _cssColonHostContextRe = new RegExp('(' + _polyfillHostContext + _parenSuffix, 'gim');
  var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
  var _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/;
  var _shadowDOMSelectorsRe = [
      /::shadow/g,
      /::content/g,
      // Deprecated selectors
      /\/shadow-deep\//g,
      /\/shadow\//g,
  ];
  var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)/g;
  var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
  var _polyfillHostRe = /-shadowcsshost/gim;
  var _colonHostRe = /:host/gim;
  var _colonHostContextRe = /:host-context/gim;
  var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
  function stripComments(input) {
      return input.replace(_commentRe, '');
  }
  // all comments except inline source mapping
  var _sourceMappingUrlRe = /\/\*\s*#\s*sourceMappingURL=[\s\S]+?\*\//;
  function extractSourceMappingUrl(input) {
      var matcher = input.match(_sourceMappingUrlRe);
      return matcher ? matcher[0] : '';
  }
  var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
  var _curlyRe = /([{}])/g;
  var OPEN_CURLY = '{';
  var CLOSE_CURLY = '}';
  var BLOCK_PLACEHOLDER = '%BLOCK%';
  var CssRule = (function () {
      function CssRule(selector, content) {
          this.selector = selector;
          this.content = content;
      }
      return CssRule;
  }());
  function processRules(input, ruleCallback) {
      var inputWithEscapedBlocks = escapeBlocks(input);
      var nextBlockIndex = 0;
      return inputWithEscapedBlocks.escapedString.replace(_ruleRe, function () {
          var m = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              m[_i] = arguments[_i];
          }
          var selector = m[2];
          var content = '';
          var suffix = m[4];
          var contentPrefix = '';
          if (suffix && suffix.startsWith('{' + BLOCK_PLACEHOLDER)) {
              content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
              suffix = suffix.substring(BLOCK_PLACEHOLDER.length + 1);
              contentPrefix = '{';
          }
          var rule = ruleCallback(new CssRule(selector, content));
          return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
      });
  }
  var StringWithEscapedBlocks = (function () {
      function StringWithEscapedBlocks(escapedString, blocks) {
          this.escapedString = escapedString;
          this.blocks = blocks;
      }
      return StringWithEscapedBlocks;
  }());
  function escapeBlocks(input) {
      var inputParts = input.split(_curlyRe);
      var resultParts = [];
      var escapedBlocks = [];
      var bracketCount = 0;
      var currentBlockParts = [];
      for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
          var part = inputParts[partIndex];
          if (part == CLOSE_CURLY) {
              bracketCount--;
          }
          if (bracketCount > 0) {
              currentBlockParts.push(part);
          }
          else {
              if (currentBlockParts.length > 0) {
                  escapedBlocks.push(currentBlockParts.join(''));
                  resultParts.push(BLOCK_PLACEHOLDER);
                  currentBlockParts = [];
              }
              resultParts.push(part);
          }
          if (part == OPEN_CURLY) {
              bracketCount++;
          }
      }
      if (currentBlockParts.length > 0) {
          escapedBlocks.push(currentBlockParts.join(''));
          resultParts.push(BLOCK_PLACEHOLDER);
      }
      return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
  }

  var COMPONENT_VARIABLE = '%COMP%';
  var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
  var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
  var StylesCompileDependency = (function () {
      function StylesCompileDependency(name, moduleUrl, isShimmed, valuePlaceholder) {
          this.name = name;
          this.moduleUrl = moduleUrl;
          this.isShimmed = isShimmed;
          this.valuePlaceholder = valuePlaceholder;
      }
      return StylesCompileDependency;
  }());
  var StylesCompileResult = (function () {
      function StylesCompileResult(componentStylesheet, externalStylesheets) {
          this.componentStylesheet = componentStylesheet;
          this.externalStylesheets = externalStylesheets;
      }
      return StylesCompileResult;
  }());
  var CompiledStylesheet = (function () {
      function CompiledStylesheet(statements, stylesVar, dependencies, isShimmed, meta) {
          this.statements = statements;
          this.stylesVar = stylesVar;
          this.dependencies = dependencies;
          this.isShimmed = isShimmed;
          this.meta = meta;
      }
      return CompiledStylesheet;
  }());
  var StyleCompiler = (function () {
      function StyleCompiler(_urlResolver) {
          this._urlResolver = _urlResolver;
          this._shadowCss = new ShadowCss();
      }
      StyleCompiler.prototype.compileComponent = function (comp) {
          var _this = this;
          var externalStylesheets = [];
          var componentStylesheet = this._compileStyles(comp, new CompileStylesheetMetadata({
              styles: comp.template.styles,
              styleUrls: comp.template.styleUrls,
              moduleUrl: identifierModuleUrl(comp.type)
          }), true);
          comp.template.externalStylesheets.forEach(function (stylesheetMeta) {
              var compiledStylesheet = _this._compileStyles(comp, stylesheetMeta, false);
              externalStylesheets.push(compiledStylesheet);
          });
          return new StylesCompileResult(componentStylesheet, externalStylesheets);
      };
      StyleCompiler.prototype._compileStyles = function (comp, stylesheet, isComponentStylesheet) {
          var _this = this;
          var shim = comp.template.encapsulation === _angular_core.ViewEncapsulation.Emulated;
          var styleExpressions = stylesheet.styles.map(function (plainStyle) { return literal(_this._shimIfNeeded(plainStyle, shim)); });
          var dependencies = [];
          for (var i = 0; i < stylesheet.styleUrls.length; i++) {
              var identifier = { reference: null };
              dependencies.push(new StylesCompileDependency(getStylesVarName(null), stylesheet.styleUrls[i], shim, identifier));
              styleExpressions.push(new ExternalExpr(identifier));
          }
          // styles variable contains plain strings and arrays of other styles arrays (recursive),
          // so we set its type to dynamic.
          var stylesVar = getStylesVarName(isComponentStylesheet ? comp : null);
          var stmt = variable(stylesVar)
              .set(literalArr(styleExpressions, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const])))
              .toDeclStmt(null, [StmtModifier.Final]);
          return new CompiledStylesheet([stmt], stylesVar, dependencies, shim, stylesheet);
      };
      StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
          return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
      };
      return StyleCompiler;
  }());
  StyleCompiler.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  StyleCompiler.ctorParameters = function () { return [
      { type: UrlResolver, },
  ]; };
  function getStylesVarName(component) {
      var result = "styles";
      if (component) {
          result += "_" + identifierName(component.type);
      }
      return result;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$21 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var EventHandlerVars = (function () {
      function EventHandlerVars() {
      }
      return EventHandlerVars;
  }());
  EventHandlerVars.event = variable('$event');
  var ConvertActionBindingResult = (function () {
      function ConvertActionBindingResult(stmts, allowDefault) {
          this.stmts = stmts;
          this.allowDefault = allowDefault;
      }
      return ConvertActionBindingResult;
  }());
  /**
   * Converts the given expression AST into an executable output AST, assuming the expression is
   * used in an action binding (e.g. an event handler).
   */
  function convertActionBinding(localResolver, implicitReceiver, action, bindingId) {
      if (!localResolver) {
          localResolver = new DefaultLocalResolver();
      }
      var actionWithoutBuiltins = convertPropertyBindingBuiltins({
          createLiteralArrayConverter: function (argCount) {
              // Note: no caching for literal arrays in actions.
              return function (args) { return literalArr(args); };
          },
          createLiteralMapConverter: function (keys) {
              // Note: no caching for literal maps in actions.
              return function (args) {
                  return literalMap(keys.map(function (key, i) { return [key, args[i]]; }));
              };
          },
          createPipeConverter: function (name) {
              throw new Error("Illegal State: Actions are not allowed to contain pipes. Pipe: " + name);
          }
      }, action);
      var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
      var actionStmts = [];
      flattenStatements(actionWithoutBuiltins.visit(visitor, _Mode.Statement), actionStmts);
      prependTemporaryDecls(visitor.temporaryCount, bindingId, actionStmts);
      var lastIndex = actionStmts.length - 1;
      var preventDefaultVar = null;
      if (lastIndex >= 0) {
          var lastStatement = actionStmts[lastIndex];
          var returnExpr = convertStmtIntoExpression(lastStatement);
          if (returnExpr) {
              // Note: We need to cast the result of the method call to dynamic,
              // as it might be a void method!
              preventDefaultVar = createPreventDefaultVar(bindingId);
              actionStmts[lastIndex] =
                  preventDefaultVar.set(returnExpr.cast(DYNAMIC_TYPE).notIdentical(literal(false)))
                      .toDeclStmt(null, [StmtModifier.Final]);
          }
      }
      return new ConvertActionBindingResult(actionStmts, preventDefaultVar);
  }
  function convertPropertyBindingBuiltins(converterFactory, ast) {
      return convertBuiltins(converterFactory, ast);
  }
  var ConvertPropertyBindingResult = (function () {
      function ConvertPropertyBindingResult(stmts, currValExpr) {
          this.stmts = stmts;
          this.currValExpr = currValExpr;
      }
      return ConvertPropertyBindingResult;
  }());
  /**
   * Converts the given expression AST into an executable output AST, assuming the expression
   * is used in property binding. The expression has to be preprocessed via
   * `convertPropertyBindingBuiltins`.
   */
  function convertPropertyBinding(localResolver, implicitReceiver, expressionWithoutBuiltins, bindingId) {
      if (!localResolver) {
          localResolver = new DefaultLocalResolver();
      }
      var currValExpr = createCurrValueExpr(bindingId);
      var stmts = [];
      var visitor = new _AstToIrVisitor(localResolver, implicitReceiver, bindingId);
      var outputExpr = expressionWithoutBuiltins.visit(visitor, _Mode.Expression);
      if (visitor.temporaryCount) {
          for (var i = 0; i < visitor.temporaryCount; i++) {
              stmts.push(temporaryDeclaration(bindingId, i));
          }
      }
      stmts.push(currValExpr.set(outputExpr).toDeclStmt(null, [StmtModifier.Final]));
      return new ConvertPropertyBindingResult(stmts, currValExpr);
  }
  function convertBuiltins(converterFactory, ast) {
      var visitor = new _BuiltinAstConverter(converterFactory);
      return ast.visit(visitor);
  }
  function temporaryName(bindingId, temporaryNumber) {
      return "tmp_" + bindingId + "_" + temporaryNumber;
  }
  function temporaryDeclaration(bindingId, temporaryNumber) {
      return new DeclareVarStmt(temporaryName(bindingId, temporaryNumber), NULL_EXPR);
  }
  function prependTemporaryDecls(temporaryCount, bindingId, statements) {
      for (var i = temporaryCount - 1; i >= 0; i--) {
          statements.unshift(temporaryDeclaration(bindingId, i));
      }
  }
  var _Mode;
  (function (_Mode) {
      _Mode[_Mode["Statement"] = 0] = "Statement";
      _Mode[_Mode["Expression"] = 1] = "Expression";
  })(_Mode || (_Mode = {}));
  function ensureStatementMode(mode, ast) {
      if (mode !== _Mode.Statement) {
          throw new Error("Expected a statement, but saw " + ast);
      }
  }
  function ensureExpressionMode(mode, ast) {
      if (mode !== _Mode.Expression) {
          throw new Error("Expected an expression, but saw " + ast);
      }
  }
  function convertToStatementIfNeeded(mode, expr) {
      if (mode === _Mode.Statement) {
          return expr.toStmt();
      }
      else {
          return expr;
      }
  }
  var _BuiltinAstConverter = (function (_super) {
      __extends$21(_BuiltinAstConverter, _super);
      function _BuiltinAstConverter(_converterFactory) {
          var _this = _super.call(this) || this;
          _this._converterFactory = _converterFactory;
          return _this;
      }
      _BuiltinAstConverter.prototype.visitPipe = function (ast, context) {
          var _this = this;
          var args = [ast.exp].concat(ast.args).map(function (ast) { return ast.visit(_this, context); });
          return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createPipeConverter(ast.name, args.length));
      };
      _BuiltinAstConverter.prototype.visitLiteralArray = function (ast, context) {
          var _this = this;
          var args = ast.expressions.map(function (ast) { return ast.visit(_this, context); });
          return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralArrayConverter(ast.expressions.length));
      };
      _BuiltinAstConverter.prototype.visitLiteralMap = function (ast, context) {
          var _this = this;
          var args = ast.values.map(function (ast) { return ast.visit(_this, context); });
          return new BuiltinFunctionCall(ast.span, args, this._converterFactory.createLiteralMapConverter(ast.keys));
      };
      return _BuiltinAstConverter;
  }(AstTransformer));
  var _AstToIrVisitor = (function () {
      function _AstToIrVisitor(_localResolver, _implicitReceiver, bindingId) {
          this._localResolver = _localResolver;
          this._implicitReceiver = _implicitReceiver;
          this.bindingId = bindingId;
          this._nodeMap = new Map();
          this._resultMap = new Map();
          this._currentTemporary = 0;
          this.temporaryCount = 0;
      }
      _AstToIrVisitor.prototype.visitBinary = function (ast, mode) {
          var op;
          switch (ast.operation) {
              case '+':
                  op = BinaryOperator.Plus;
                  break;
              case '-':
                  op = BinaryOperator.Minus;
                  break;
              case '*':
                  op = BinaryOperator.Multiply;
                  break;
              case '/':
                  op = BinaryOperator.Divide;
                  break;
              case '%':
                  op = BinaryOperator.Modulo;
                  break;
              case '&&':
                  op = BinaryOperator.And;
                  break;
              case '||':
                  op = BinaryOperator.Or;
                  break;
              case '==':
                  op = BinaryOperator.Equals;
                  break;
              case '!=':
                  op = BinaryOperator.NotEquals;
                  break;
              case '===':
                  op = BinaryOperator.Identical;
                  break;
              case '!==':
                  op = BinaryOperator.NotIdentical;
                  break;
              case '<':
                  op = BinaryOperator.Lower;
                  break;
              case '>':
                  op = BinaryOperator.Bigger;
                  break;
              case '<=':
                  op = BinaryOperator.LowerEquals;
                  break;
              case '>=':
                  op = BinaryOperator.BiggerEquals;
                  break;
              default:
                  throw new Error("Unsupported operation " + ast.operation);
          }
          return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, this.visit(ast.left, _Mode.Expression), this.visit(ast.right, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitChain = function (ast, mode) {
          ensureStatementMode(mode, ast);
          return this.visitAll(ast.expressions, mode);
      };
      _AstToIrVisitor.prototype.visitConditional = function (ast, mode) {
          var value = this.visit(ast.condition, _Mode.Expression);
          return convertToStatementIfNeeded(mode, value.conditional(this.visit(ast.trueExp, _Mode.Expression), this.visit(ast.falseExp, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitPipe = function (ast, mode) {
          throw new Error("Illegal state: Pipes should have been converted into functions. Pipe: " + ast.name);
      };
      _AstToIrVisitor.prototype.visitFunctionCall = function (ast, mode) {
          var convertedArgs = this.visitAll(ast.args, _Mode.Expression);
          var fnResult;
          if (ast instanceof BuiltinFunctionCall) {
              fnResult = ast.converter(convertedArgs);
          }
          else {
              fnResult = this.visit(ast.target, _Mode.Expression).callFn(convertedArgs);
          }
          return convertToStatementIfNeeded(mode, fnResult);
      };
      _AstToIrVisitor.prototype.visitImplicitReceiver = function (ast, mode) {
          ensureExpressionMode(mode, ast);
          return this._implicitReceiver;
      };
      _AstToIrVisitor.prototype.visitInterpolation = function (ast, mode) {
          ensureExpressionMode(mode, ast);
          var args = [literal(ast.expressions.length)];
          for (var i = 0; i < ast.strings.length - 1; i++) {
              args.push(literal(ast.strings[i]));
              args.push(this.visit(ast.expressions[i], _Mode.Expression));
          }
          args.push(literal(ast.strings[ast.strings.length - 1]));
          return ast.expressions.length <= 9 ?
              importExpr(createIdentifier(Identifiers.inlineInterpolate)).callFn(args) :
              importExpr(createIdentifier(Identifiers.interpolate)).callFn([
                  args[0], literalArr(args.slice(1))
              ]);
      };
      _AstToIrVisitor.prototype.visitKeyedRead = function (ast, mode) {
          var leftMostSafe = this.leftMostSafeNode(ast);
          if (leftMostSafe) {
              return this.convertSafeAccess(ast, leftMostSafe, mode);
          }
          else {
              return convertToStatementIfNeeded(mode, this.visit(ast.obj, _Mode.Expression).key(this.visit(ast.key, _Mode.Expression)));
          }
      };
      _AstToIrVisitor.prototype.visitKeyedWrite = function (ast, mode) {
          var obj = this.visit(ast.obj, _Mode.Expression);
          var key = this.visit(ast.key, _Mode.Expression);
          var value = this.visit(ast.value, _Mode.Expression);
          return convertToStatementIfNeeded(mode, obj.key(key).set(value));
      };
      _AstToIrVisitor.prototype.visitLiteralArray = function (ast, mode) {
          throw new Error("Illegal State: literal arrays should have been converted into functions");
      };
      _AstToIrVisitor.prototype.visitLiteralMap = function (ast, mode) {
          throw new Error("Illegal State: literal maps should have been converted into functions");
      };
      _AstToIrVisitor.prototype.visitLiteralPrimitive = function (ast, mode) {
          return convertToStatementIfNeeded(mode, literal(ast.value));
      };
      _AstToIrVisitor.prototype._getLocal = function (name) { return this._localResolver.getLocal(name); };
      _AstToIrVisitor.prototype.visitMethodCall = function (ast, mode) {
          var leftMostSafe = this.leftMostSafeNode(ast);
          if (leftMostSafe) {
              return this.convertSafeAccess(ast, leftMostSafe, mode);
          }
          else {
              var args = this.visitAll(ast.args, _Mode.Expression);
              var result = null;
              var receiver = this.visit(ast.receiver, _Mode.Expression);
              if (receiver === this._implicitReceiver) {
                  var varExpr = this._getLocal(ast.name);
                  if (varExpr) {
                      result = varExpr.callFn(args);
                  }
              }
              if (result == null) {
                  result = receiver.callMethod(ast.name, args);
              }
              return convertToStatementIfNeeded(mode, result);
          }
      };
      _AstToIrVisitor.prototype.visitPrefixNot = function (ast, mode) {
          return convertToStatementIfNeeded(mode, not(this.visit(ast.expression, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitPropertyRead = function (ast, mode) {
          var leftMostSafe = this.leftMostSafeNode(ast);
          if (leftMostSafe) {
              return this.convertSafeAccess(ast, leftMostSafe, mode);
          }
          else {
              var result = null;
              var receiver = this.visit(ast.receiver, _Mode.Expression);
              if (receiver === this._implicitReceiver) {
                  result = this._getLocal(ast.name);
              }
              if (result == null) {
                  result = receiver.prop(ast.name);
              }
              return convertToStatementIfNeeded(mode, result);
          }
      };
      _AstToIrVisitor.prototype.visitPropertyWrite = function (ast, mode) {
          var receiver = this.visit(ast.receiver, _Mode.Expression);
          if (receiver === this._implicitReceiver) {
              var varExpr = this._getLocal(ast.name);
              if (varExpr) {
                  throw new Error('Cannot assign to a reference or variable!');
              }
          }
          return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(this.visit(ast.value, _Mode.Expression)));
      };
      _AstToIrVisitor.prototype.visitSafePropertyRead = function (ast, mode) {
          return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
      };
      _AstToIrVisitor.prototype.visitSafeMethodCall = function (ast, mode) {
          return this.convertSafeAccess(ast, this.leftMostSafeNode(ast), mode);
      };
      _AstToIrVisitor.prototype.visitAll = function (asts, mode) {
          var _this = this;
          return asts.map(function (ast) { return _this.visit(ast, mode); });
      };
      _AstToIrVisitor.prototype.visitQuote = function (ast, mode) {
          throw new Error('Quotes are not supported for evaluation!');
      };
      _AstToIrVisitor.prototype.visit = function (ast, mode) {
          var result = this._resultMap.get(ast);
          if (result)
              return result;
          return (this._nodeMap.get(ast) || ast).visit(this, mode);
      };
      _AstToIrVisitor.prototype.convertSafeAccess = function (ast, leftMostSafe, mode) {
          // If the expression contains a safe access node on the left it needs to be converted to
          // an expression that guards the access to the member by checking the receiver for blank. As
          // execution proceeds from left to right, the left most part of the expression must be guarded
          // first but, because member access is left associative, the right side of the expression is at
          // the top of the AST. The desired result requires lifting a copy of the the left part of the
          // expression up to test it for blank before generating the unguarded version.
          // Consider, for example the following expression: a?.b.c?.d.e
          // This results in the ast:
          //         .
          //        / \
          //       ?.   e
          //      /  \
          //     .    d
          //    / \
          //   ?.  c
          //  /  \
          // a    b
          // The following tree should be generated:
          //
          //        /---- ? ----\
          //       /      |      \
          //     a   /--- ? ---\  null
          //        /     |     \
          //       .      .     null
          //      / \    / \
          //     .  c   .   e
          //    / \    / \
          //   a   b  ,   d
          //         / \
          //        .   c
          //       / \
          //      a   b
          //
          // Notice that the first guard condition is the left hand of the left most safe access node
          // which comes in as leftMostSafe to this routine.
          var guardedExpression = this.visit(leftMostSafe.receiver, _Mode.Expression);
          var temporary;
          if (this.needsTemporary(leftMostSafe.receiver)) {
              // If the expression has method calls or pipes then we need to save the result into a
              // temporary variable to avoid calling stateful or impure code more than once.
              temporary = this.allocateTemporary();
              // Preserve the result in the temporary variable
              guardedExpression = temporary.set(guardedExpression);
              // Ensure all further references to the guarded expression refer to the temporary instead.
              this._resultMap.set(leftMostSafe.receiver, temporary);
          }
          var condition = guardedExpression.isBlank();
          // Convert the ast to an unguarded access to the receiver's member. The map will substitute
          // leftMostNode with its unguarded version in the call to `this.visit()`.
          if (leftMostSafe instanceof SafeMethodCall) {
              this._nodeMap.set(leftMostSafe, new MethodCall(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name, leftMostSafe.args));
          }
          else {
              this._nodeMap.set(leftMostSafe, new PropertyRead(leftMostSafe.span, leftMostSafe.receiver, leftMostSafe.name));
          }
          // Recursively convert the node now without the guarded member access.
          var access = this.visit(ast, _Mode.Expression);
          // Remove the mapping. This is not strictly required as the converter only traverses each node
          // once but is safer if the conversion is changed to traverse the nodes more than once.
          this._nodeMap.delete(leftMostSafe);
          // If we allcoated a temporary, release it.
          if (temporary) {
              this.releaseTemporary(temporary);
          }
          // Produce the conditional
          return convertToStatementIfNeeded(mode, condition.conditional(literal(null), access));
      };
      // Given a expression of the form a?.b.c?.d.e the the left most safe node is
      // the (a?.b). The . and ?. are left associative thus can be rewritten as:
      // ((((a?.c).b).c)?.d).e. This returns the most deeply nested safe read or
      // safe method call as this needs be transform initially to:
      //   a == null ? null : a.c.b.c?.d.e
      // then to:
      //   a == null ? null : a.b.c == null ? null : a.b.c.d.e
      _AstToIrVisitor.prototype.leftMostSafeNode = function (ast) {
          var _this = this;
          var visit = function (visitor, ast) {
              return (_this._nodeMap.get(ast) || ast).visit(visitor);
          };
          return ast.visit({
              visitBinary: function (ast) { return null; },
              visitChain: function (ast) { return null; },
              visitConditional: function (ast) { return null; },
              visitFunctionCall: function (ast) { return null; },
              visitImplicitReceiver: function (ast) { return null; },
              visitInterpolation: function (ast) { return null; },
              visitKeyedRead: function (ast) { return visit(this, ast.obj); },
              visitKeyedWrite: function (ast) { return null; },
              visitLiteralArray: function (ast) { return null; },
              visitLiteralMap: function (ast) { return null; },
              visitLiteralPrimitive: function (ast) { return null; },
              visitMethodCall: function (ast) { return visit(this, ast.receiver); },
              visitPipe: function (ast) { return null; },
              visitPrefixNot: function (ast) { return null; },
              visitPropertyRead: function (ast) { return visit(this, ast.receiver); },
              visitPropertyWrite: function (ast) { return null; },
              visitQuote: function (ast) { return null; },
              visitSafeMethodCall: function (ast) { return visit(this, ast.receiver) || ast; },
              visitSafePropertyRead: function (ast) {
                  return visit(this, ast.receiver) || ast;
              }
          });
      };
      // Returns true of the AST includes a method or a pipe indicating that, if the
      // expression is used as the target of a safe property or method access then
      // the expression should be stored into a temporary variable.
      _AstToIrVisitor.prototype.needsTemporary = function (ast) {
          var _this = this;
          var visit = function (visitor, ast) {
              return ast && (_this._nodeMap.get(ast) || ast).visit(visitor);
          };
          var visitSome = function (visitor, ast) {
              return ast.some(function (ast) { return visit(visitor, ast); });
          };
          return ast.visit({
              visitBinary: function (ast) { return visit(this, ast.left) || visit(this, ast.right); },
              visitChain: function (ast) { return false; },
              visitConditional: function (ast) {
                  return visit(this, ast.condition) || visit(this, ast.trueExp) ||
                      visit(this, ast.falseExp);
              },
              visitFunctionCall: function (ast) { return true; },
              visitImplicitReceiver: function (ast) { return false; },
              visitInterpolation: function (ast) { return visitSome(this, ast.expressions); },
              visitKeyedRead: function (ast) { return false; },
              visitKeyedWrite: function (ast) { return false; },
              visitLiteralArray: function (ast) { return true; },
              visitLiteralMap: function (ast) { return true; },
              visitLiteralPrimitive: function (ast) { return false; },
              visitMethodCall: function (ast) { return true; },
              visitPipe: function (ast) { return true; },
              visitPrefixNot: function (ast) { return visit(this, ast.expression); },
              visitPropertyRead: function (ast) { return false; },
              visitPropertyWrite: function (ast) { return false; },
              visitQuote: function (ast) { return false; },
              visitSafeMethodCall: function (ast) { return true; },
              visitSafePropertyRead: function (ast) { return false; }
          });
      };
      _AstToIrVisitor.prototype.allocateTemporary = function () {
          var tempNumber = this._currentTemporary++;
          this.temporaryCount = Math.max(this._currentTemporary, this.temporaryCount);
          return new ReadVarExpr(temporaryName(this.bindingId, tempNumber));
      };
      _AstToIrVisitor.prototype.releaseTemporary = function (temporary) {
          this._currentTemporary--;
          if (temporary.name != temporaryName(this.bindingId, this._currentTemporary)) {
              throw new Error("Temporary " + temporary.name + " released out of order");
          }
      };
      return _AstToIrVisitor;
  }());
  function flattenStatements(arg, output) {
      if (Array.isArray(arg)) {
          arg.forEach(function (entry) { return flattenStatements(entry, output); });
      }
      else {
          output.push(arg);
      }
  }
  var DefaultLocalResolver = (function () {
      function DefaultLocalResolver() {
      }
      DefaultLocalResolver.prototype.getLocal = function (name) {
          if (name === EventHandlerVars.event.name) {
              return EventHandlerVars.event;
          }
          return null;
      };
      return DefaultLocalResolver;
  }());
  function createCurrValueExpr(bindingId) {
      return variable("currVal_" + bindingId); // fix syntax highlighting: `
  }
  function createPreventDefaultVar(bindingId) {
      return variable("pd_" + bindingId);
  }
  function convertStmtIntoExpression(stmt) {
      if (stmt instanceof ExpressionStatement) {
          return stmt.expr;
      }
      else if (stmt instanceof ReturnStatement) {
          return stmt.value;
      }
      return null;
  }
  var BuiltinFunctionCall = (function (_super) {
      __extends$21(BuiltinFunctionCall, _super);
      function BuiltinFunctionCall(span, args, converter) {
          var _this = _super.call(this, span, null, args) || this;
          _this.args = args;
          _this.converter = converter;
          return _this;
      }
      return BuiltinFunctionCall;
  }(FunctionCall));

  var CLASS_ATTR$1 = 'class';
  var STYLE_ATTR = 'style';
  var IMPLICIT_TEMPLATE_VAR = '\$implicit';
  var NG_CONTAINER_TAG = 'ng-container';
  var ViewCompileResult = (function () {
      function ViewCompileResult(statements, viewClassVar, rendererTypeVar) {
          this.statements = statements;
          this.viewClassVar = viewClassVar;
          this.rendererTypeVar = rendererTypeVar;
      }
      return ViewCompileResult;
  }());
  var ViewCompiler = (function () {
      function ViewCompiler(_genConfigNext, _schemaRegistry) {
          this._genConfigNext = _genConfigNext;
          this._schemaRegistry = _schemaRegistry;
      }
      ViewCompiler.prototype.compileComponent = function (component, template, styles, usedPipes) {
          var embeddedViewCount = 0;
          var staticQueryIds = findStaticQueryIds(template);
          var statements = [];
          var customRenderData = [];
          if (component.template.animations && component.template.animations.length) {
              customRenderData.push(new LiteralMapEntry('animation', convertValueToOutputAst(component.template.animations), true));
          }
          var renderComponentVar = variable(rendererTypeName(component.type.reference));
          statements.push(renderComponentVar
              .set(importExpr(createIdentifier(Identifiers.createRendererType2)).callFn([
              new LiteralMapExpr([
                  new LiteralMapEntry('encapsulation', literal(component.template.encapsulation)),
                  new LiteralMapEntry('styles', styles),
                  new LiteralMapEntry('data', new LiteralMapExpr(customRenderData))
              ])
          ]))
              .toDeclStmt(importType(createIdentifier(Identifiers.RendererType2)), [StmtModifier.Final]));
          var viewBuilderFactory = function (parent) {
              var embeddedViewIndex = embeddedViewCount++;
              return new ViewBuilder(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
          };
          var visitor = viewBuilderFactory(null);
          visitor.visitAll([], template);
          statements.push.apply(statements, visitor.build());
          return new ViewCompileResult(statements, visitor.viewName, renderComponentVar.name);
      };
      return ViewCompiler;
  }());
  ViewCompiler.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  ViewCompiler.ctorParameters = function () { return [
      { type: CompilerConfig, },
      { type: ElementSchemaRegistry, },
  ]; };
  var VIEW_VAR = variable('view');
  var CHECK_VAR = variable('check');
  var COMP_VAR = variable('comp');
  var NODE_INDEX_VAR = variable('nodeIndex');
  var EVENT_NAME_VAR = variable('eventName');
  var ALLOW_DEFAULT_VAR = variable("allowDefault");
  var ViewBuilder = (function () {
      function ViewBuilder(parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
          this.parent = parent;
          this.component = component;
          this.embeddedViewIndex = embeddedViewIndex;
          this.usedPipes = usedPipes;
          this.staticQueryIds = staticQueryIds;
          this.viewBuilderFactory = viewBuilderFactory;
          this.nodeDefs = [];
          this.purePipeNodeIndices = Object.create(null);
          // Need Object.create so that we don't have builtin values...
          this.refNodeIndices = Object.create(null);
          this.variables = [];
          this.children = [];
          this.updateDirectivesExpressions = [];
          this.updateRendererExpressions = [];
          // TODO(tbosch): The old view compiler used to use an `any` type
          // for the context in any embedded view. We keep this behaivor for now
          // to be able to introduce the new view compiler without too many errors.
          this.compType = this.embeddedViewIndex > 0 ? DYNAMIC_TYPE : importType(this.component.type);
      }
      Object.defineProperty(ViewBuilder.prototype, "viewName", {
          get: function () {
              return viewClassName(this.component.type.reference, this.embeddedViewIndex);
          },
          enumerable: true,
          configurable: true
      });
      ViewBuilder.prototype.visitAll = function (variables, astNodes) {
          var _this = this;
          this.variables = variables;
          // create the pipes for the pure pipes immediately, so that we know their indices.
          if (!this.parent) {
              this.usedPipes.forEach(function (pipe) {
                  if (pipe.pure) {
                      _this.purePipeNodeIndices[pipe.name] = _this._createPipe(pipe);
                  }
              });
          }
          if (!this.parent) {
              var queryIds_1 = staticViewQueryIds(this.staticQueryIds);
              this.component.viewQueries.forEach(function (query, queryIndex) {
                  // Note: queries start with id 1 so we can use the number in a Bloom filter!
                  var queryId = queryIndex + 1;
                  var bindingType = query.first ? 0 /* First */ : 1 /* All */;
                  var flags = 67108864 /* TypeViewQuery */;
                  if (queryIds_1.staticQueryIds.has(queryId)) {
                      flags |= 134217728 /* StaticQuery */;
                  }
                  else {
                      flags |= 268435456 /* DynamicQuery */;
                  }
                  _this.nodeDefs.push(function () { return importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                      literal(flags), literal(queryId),
                      new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
                  ]); });
              });
          }
          templateVisitAll(this, astNodes);
          if (astNodes.length === 0 ||
              (this.parent && needsAdditionalRootNode(astNodes[astNodes.length - 1]))) {
              // if the view is empty, or an embedded view has a view container as last root nde,
              // create an additional root node.
              this.nodeDefs.push(function () { return importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
                  literal(0 /* None */), NULL_EXPR, NULL_EXPR, literal(0)
              ]); });
          }
      };
      ViewBuilder.prototype.build = function (targetStatements) {
          if (targetStatements === void 0) { targetStatements = []; }
          this.children.forEach(function (child) { return child.build(targetStatements); });
          var updateDirectivesFn = this._createUpdateFn(this.updateDirectivesExpressions);
          var updateRendererFn = this._createUpdateFn(this.updateRendererExpressions);
          var viewFlags = 0 /* None */;
          if (!this.parent && this.component.changeDetection === _angular_core.ChangeDetectionStrategy.OnPush) {
              viewFlags |= 2 /* OnPush */;
          }
          var viewFactory = new DeclareFunctionStmt(this.viewName, [], [new ReturnStatement(importExpr(createIdentifier(Identifiers.viewDef)).callFn([
                  literal(viewFlags),
                  literalArr(this.nodeDefs.map(function (nd) { return nd(); })),
                  updateDirectivesFn,
                  updateRendererFn,
              ]))], importType(createIdentifier(Identifiers.ViewDefinition)));
          targetStatements.push(viewFactory);
          return targetStatements;
      };
      ViewBuilder.prototype._createUpdateFn = function (expressions) {
          var _this = this;
          var updateStmts = [];
          var updateBindingCount = 0;
          expressions.forEach(function (_a) {
              var expressions = _a.expressions, nodeIndex = _a.nodeIndex;
              var exprs = expressions.map(function (_a) {
                  var context = _a.context, value = _a.value;
                  var bindingId = "" + updateBindingCount++;
                  var nameResolver = context === COMP_VAR ? _this : null;
                  var _b = convertPropertyBinding(nameResolver, context, value, bindingId), stmts = _b.stmts, currValExpr = _b.currValExpr;
                  updateStmts.push.apply(updateStmts, stmts);
                  return currValExpr;
              });
              updateStmts.push(callCheckStmt(nodeIndex, exprs).toStmt());
          });
          var updateFn;
          if (updateStmts.length > 0) {
              var preStmts = [];
              if (!this.component.isHost) {
                  preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
              }
              updateFn = fn([
                  new FnParam(CHECK_VAR.name, INFERRED_TYPE),
                  new FnParam(VIEW_VAR.name, INFERRED_TYPE)
              ], preStmts.concat(updateStmts), INFERRED_TYPE);
          }
          else {
              updateFn = NULL_EXPR;
          }
          return updateFn;
      };
      ViewBuilder.prototype.visitNgContent = function (ast, context) {
          // ngContentDef(ngContentIndex: number, index: number): NodeDef;
          this.nodeDefs.push(function () { return importExpr(createIdentifier(Identifiers.ngContentDef)).callFn([
              literal(ast.ngContentIndex), literal(ast.index)
          ]); });
      };
      ViewBuilder.prototype.visitText = function (ast, context) {
          // textDef(ngContentIndex: number, constants: string[]): NodeDef;
          this.nodeDefs.push(function () { return importExpr(createIdentifier(Identifiers.textDef)).callFn([
              literal(ast.ngContentIndex), literalArr([literal(ast.value)])
          ]); });
      };
      ViewBuilder.prototype.visitBoundText = function (ast, context) {
          var nodeIndex = this.nodeDefs.length;
          // reserve the space in the nodeDefs array
          this.nodeDefs.push(null);
          var astWithSource = ast.value;
          var inter = astWithSource.ast;
          this._addUpdateExpressions(nodeIndex, inter.expressions.map(function (expr) { return { context: COMP_VAR, value: expr }; }), this.updateRendererExpressions);
          // textDef(ngContentIndex: number, constants: string[]): NodeDef;
          this.nodeDefs[nodeIndex] = function () { return importExpr(createIdentifier(Identifiers.textDef)).callFn([
              literal(ast.ngContentIndex), literalArr(inter.strings.map(function (s) { return literal(s); }))
          ]); };
      };
      ViewBuilder.prototype.visitEmbeddedTemplate = function (ast, context) {
          var _this = this;
          var nodeIndex = this.nodeDefs.length;
          // reserve the space in the nodeDefs array
          this.nodeDefs.push(null);
          var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, queryMatchesExpr = _a.queryMatchesExpr, hostEvents = _a.hostEvents;
          var childVisitor = this.viewBuilderFactory(this);
          this.children.push(childVisitor);
          childVisitor.visitAll(ast.variables, ast.children);
          var childCount = this.nodeDefs.length - nodeIndex - 1;
          // anchorDef(
          //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
          //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
          //   ViewDefinitionFactory): NodeDef;
          var nodeDef = function () { return importExpr(createIdentifier(Identifiers.anchorDef)).callFn([
              literal(flags),
              queryMatchesExpr,
              literal(ast.ngContentIndex),
              literal(childCount),
              _this._createElementHandleEventFn(nodeIndex, hostEvents),
              variable(childVisitor.viewName),
          ]); };
          this.nodeDefs[nodeIndex] = nodeDef;
      };
      ViewBuilder.prototype.visitElement = function (ast, context) {
          var _this = this;
          var nodeIndex = this.nodeDefs.length;
          // reserve the space in the nodeDefs array so we can add children
          this.nodeDefs.push(null);
          var elName = ast.name;
          if (ast.name === NG_CONTAINER_TAG) {
              // Using a null element name creates an anchor.
              elName = null;
          }
          var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, usedEvents = _a.usedEvents, queryMatchesExpr = _a.queryMatchesExpr, dirHostBindings = _a.hostBindings, hostEvents = _a.hostEvents;
          var inputDefs = [];
          var outputDefs = [];
          if (elName) {
              var hostBindings = ast.inputs
                  .map(function (inputAst) { return ({
                  context: COMP_VAR,
                  value: inputAst.value,
                  bindingDef: elementBindingDef(inputAst, null),
              }); })
                  .concat(dirHostBindings);
              if (hostBindings.length) {
                  this._addUpdateExpressions(nodeIndex, hostBindings, this.updateRendererExpressions);
                  inputDefs = hostBindings.map(function (entry) { return entry.bindingDef; });
              }
              outputDefs = usedEvents.map(function (_a) {
                  var target = _a[0], eventName = _a[1];
                  return literalArr([literal(target), literal(eventName)]);
              });
          }
          templateVisitAll(this, ast.children);
          var childCount = this.nodeDefs.length - nodeIndex - 1;
          var compAst = ast.directives.find(function (dirAst) { return dirAst.directive.isComponent; });
          var compRendererType = NULL_EXPR;
          var compView = NULL_EXPR;
          if (compAst) {
              compView = importExpr({ reference: compAst.directive.componentViewType });
              compRendererType = importExpr({ reference: compAst.directive.rendererType });
          }
          // elementDef(
          //   flags: NodeFlags, matchedQueriesDsl: [string | number, QueryValueType][],
          //   ngContentIndex: number, childCount: number, namespaceAndName: string,
          //   fixedAttrs: [string, string][] = [],
          //   bindings?:
          //       ([BindingType.ElementClass, string] | [BindingType.ElementStyle, string, string] |
          //        [BindingType.ElementAttribute | BindingType.ElementProperty |
          //        BindingType.DirectiveHostProperty, string, SecurityContext])[],
          //   outputs?: ([OutputType.ElementOutput | OutputType.DirectiveHostOutput, string, string])[],
          //   handleEvent?: ElementHandleEventFn,
          //   componentView?: () => ViewDefinition, componentRendererType?: RendererType2): NodeDef;
          var nodeDef = function () { return importExpr(createIdentifier(Identifiers.elementDef)).callFn([
              literal(flags), queryMatchesExpr, literal(ast.ngContentIndex), literal(childCount),
              literal(elName), elName ? fixedAttrsDef(ast) : NULL_EXPR,
              inputDefs.length ? literalArr(inputDefs) : NULL_EXPR,
              outputDefs.length ? literalArr(outputDefs) : NULL_EXPR,
              _this._createElementHandleEventFn(nodeIndex, hostEvents), compView, compRendererType
          ]); };
          this.nodeDefs[nodeIndex] = nodeDef;
      };
      ViewBuilder.prototype._visitElementOrTemplate = function (nodeIndex, ast) {
          var _this = this;
          var flags = 0 /* None */;
          if (ast.hasViewContainer) {
              flags |= 8388608 /* EmbeddedViews */;
          }
          var usedEvents = new Map();
          ast.outputs.forEach(function (event) {
              var _a = elementEventNameAndTarget(event, null), name = _a.name, target = _a.target;
              usedEvents.set(_angular_core.ɵelementEventFullName(target, name), [target, name]);
          });
          ast.directives.forEach(function (dirAst) {
              dirAst.hostEvents.forEach(function (event) {
                  var _a = elementEventNameAndTarget(event, dirAst), name = _a.name, target = _a.target;
                  usedEvents.set(_angular_core.ɵelementEventFullName(target, name), [target, name]);
              });
          });
          var hostBindings = [];
          var hostEvents = [];
          var componentFactoryResolverProvider = createComponentFactoryResolver(ast.directives);
          if (componentFactoryResolverProvider) {
              this._visitProvider(componentFactoryResolverProvider, ast.queryMatches);
          }
          ast.providers.forEach(function (providerAst, providerIndex) {
              var dirAst;
              var dirIndex;
              ast.directives.forEach(function (localDirAst, i) {
                  if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                      dirAst = localDirAst;
                      dirIndex = i;
                  }
              });
              if (dirAst) {
                  var _a = _this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, _this.staticQueryIds.get(ast)), dirHostBindings = _a.hostBindings, dirHostEvents = _a.hostEvents;
                  hostBindings.push.apply(hostBindings, dirHostBindings);
                  hostEvents.push.apply(hostEvents, dirHostEvents);
              }
              else {
                  _this._visitProvider(providerAst, ast.queryMatches);
              }
          });
          var queryMatchExprs = [];
          ast.queryMatches.forEach(function (match) {
              var valueType;
              if (tokenReference(match.value) === resolveIdentifier(Identifiers.ElementRef)) {
                  valueType = 0 /* ElementRef */;
              }
              else if (tokenReference(match.value) === resolveIdentifier(Identifiers.ViewContainerRef)) {
                  valueType = 3 /* ViewContainerRef */;
              }
              else if (tokenReference(match.value) === resolveIdentifier(Identifiers.TemplateRef)) {
                  valueType = 2 /* TemplateRef */;
              }
              if (valueType != null) {
                  queryMatchExprs.push(literalArr([literal(match.queryId), literal(valueType)]));
              }
          });
          ast.references.forEach(function (ref) {
              var valueType;
              if (!ref.value) {
                  valueType = 1 /* RenderElement */;
              }
              else if (tokenReference(ref.value) === resolveIdentifier(Identifiers.TemplateRef)) {
                  valueType = 2 /* TemplateRef */;
              }
              if (valueType != null) {
                  _this.refNodeIndices[ref.name] = nodeIndex;
                  queryMatchExprs.push(literalArr([literal(ref.name), literal(valueType)]));
              }
          });
          ast.outputs.forEach(function (outputAst) {
              hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: null });
          });
          return {
              flags: flags,
              usedEvents: Array.from(usedEvents.values()),
              queryMatchesExpr: queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
              hostBindings: hostBindings,
              hostEvents: hostEvents
          };
      };
      ViewBuilder.prototype._visitDirective = function (providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
          var _this = this;
          var nodeIndex = this.nodeDefs.length;
          // reserve the space in the nodeDefs array so we can add children
          this.nodeDefs.push(null);
          dirAst.directive.queries.forEach(function (query, queryIndex) {
              var flags = 33554432 /* TypeContentQuery */;
              var queryId = dirAst.contentQueryStartId + queryIndex;
              // Note: We only make queries static that query for a single item.
              // This is because of backwards compatibility with the old view compiler...
              if (queryIds.staticQueryIds.has(queryId) && query.first) {
                  flags |= 134217728 /* StaticQuery */;
              }
              else {
                  flags |= 268435456 /* DynamicQuery */;
              }
              var bindingType = query.first ? 0 /* First */ : 1 /* All */;
              _this.nodeDefs.push(function () { return importExpr(createIdentifier(Identifiers.queryDef)).callFn([
                  literal(flags), literal(queryId),
                  new LiteralMapExpr([new LiteralMapEntry(query.propertyName, literal(bindingType))])
              ]); });
          });
          // Note: the operation below might also create new nodeDefs,
          // but we don't want them to be a child of a directive,
          // as they might be a provider/pipe on their own.
          // I.e. we only allow queries as children of directives nodes.
          var childCount = this.nodeDefs.length - nodeIndex - 1;
          var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
          refs.forEach(function (ref) {
              if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                  _this.refNodeIndices[ref.name] = nodeIndex;
                  queryMatchExprs.push(literalArr([literal(ref.name), literal(4 /* Provider */)]));
              }
          });
          if (dirAst.directive.isComponent) {
              flags |= 16384 /* Component */;
          }
          var inputDefs = dirAst.inputs.map(function (inputAst, inputIndex) {
              var mapValue = literalArr([literal(inputIndex), literal(inputAst.directiveName)]);
              // Note: it's important to not quote the key so that we can capture renames by minifiers!
              return new LiteralMapEntry(inputAst.directiveName, mapValue, false);
          });
          var outputDefs = [];
          var dirMeta = dirAst.directive;
          Object.keys(dirMeta.outputs).forEach(function (propName) {
              var eventName = dirMeta.outputs[propName];
              if (usedEvents.has(eventName)) {
                  // Note: it's important to not quote the key so that we can capture renames by minifiers!
                  outputDefs.push(new LiteralMapEntry(propName, literal(eventName), false));
              }
          });
          if (dirAst.inputs.length || (flags & (131072 /* DoCheck */ | 32768 /* OnInit */)) > 0) {
              this._addUpdateExpressions(nodeIndex, dirAst.inputs.map(function (input) { return { context: COMP_VAR, value: input.value }; }), this.updateDirectivesExpressions);
          }
          var dirContextExpr = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
              VIEW_VAR, literal(nodeIndex)
          ]);
          var hostBindings = dirAst.hostProperties.map(function (hostBindingAst) { return ({
              value: hostBindingAst.value.ast,
              context: dirContextExpr,
              bindingDef: elementBindingDef(hostBindingAst, dirAst),
          }); });
          var hostEvents = dirAst.hostEvents.map(function (hostEventAst) { return ({
              context: dirContextExpr,
              eventAst: hostEventAst, dirAst: dirAst,
          }); });
          // directiveDef(
          //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], childCount: number, ctor:
          //   any,
          //   deps: ([DepFlags, any] | any)[], props?: {[name: string]: [number, string]},
          //   outputs?: {[name: string]: string}, component?: () => ViewDefinition): NodeDef;
          var nodeDef = function () { return importExpr(createIdentifier(Identifiers.directiveDef)).callFn([
              literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
              literal(childCount), providerExpr, depsExpr,
              inputDefs.length ? new LiteralMapExpr(inputDefs) : NULL_EXPR,
              outputDefs.length ? new LiteralMapExpr(outputDefs) : NULL_EXPR
          ]); };
          this.nodeDefs[nodeIndex] = nodeDef;
          return { hostBindings: hostBindings, hostEvents: hostEvents };
      };
      ViewBuilder.prototype._visitProvider = function (providerAst, queryMatches) {
          var nodeIndex = this.nodeDefs.length;
          // reserve the space in the nodeDefs array so we can add children
          this.nodeDefs.push(null);
          var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
          // providerDef(
          //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
          //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
          var nodeDef = function () { return importExpr(createIdentifier(Identifiers.providerDef)).callFn([
              literal(flags), queryMatchExprs.length ? literalArr(queryMatchExprs) : NULL_EXPR,
              tokenExpr(providerAst.token), providerExpr, depsExpr
          ]); };
          this.nodeDefs[nodeIndex] = nodeDef;
      };
      ViewBuilder.prototype._visitProviderOrDirective = function (providerAst, queryMatches) {
          var flags = 0 /* None */;
          if (!providerAst.eager) {
              flags |= 2048 /* LazyProvider */;
          }
          if (providerAst.providerType === exports.ProviderAstType.PrivateService) {
              flags |= 4096 /* PrivateProvider */;
          }
          providerAst.lifecycleHooks.forEach(function (lifecycleHook) {
              // for regular providers, we only support ngOnDestroy
              if (lifecycleHook === _angular_core.ɵLifecycleHooks.OnDestroy ||
                  providerAst.providerType === exports.ProviderAstType.Directive ||
                  providerAst.providerType === exports.ProviderAstType.Component) {
                  flags |= lifecycleHookToNodeFlag(lifecycleHook);
              }
          });
          var queryMatchExprs = [];
          queryMatches.forEach(function (match) {
              if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                  queryMatchExprs.push(literalArr([literal(match.queryId), literal(4 /* Provider */)]));
              }
          });
          var _a = providerDef(providerAst), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, providerType = _a.flags;
          return { flags: flags | providerType, queryMatchExprs: queryMatchExprs, providerExpr: providerExpr, depsExpr: depsExpr };
      };
      ViewBuilder.prototype.getLocal = function (name) {
          if (name == EventHandlerVars.event.name) {
              return EventHandlerVars.event;
          }
          var currViewExpr = VIEW_VAR;
          for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent, currViewExpr = currViewExpr.prop('parent')) {
              // check references
              var refNodeIndex = currBuilder.refNodeIndices[name];
              if (refNodeIndex != null) {
                  return importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                      currViewExpr, literal(refNodeIndex)
                  ]);
              }
              // check variables
              var varAst = currBuilder.variables.find(function (varAst) { return varAst.name === name; });
              if (varAst) {
                  var varValue = varAst.value || IMPLICIT_TEMPLATE_VAR;
                  return currViewExpr.prop('context').prop(varValue);
              }
          }
          return null;
      };
      ViewBuilder.prototype.createLiteralArrayConverter = function (argCount) {
          if (argCount === 0) {
              var valueExpr_1 = importExpr(createIdentifier(Identifiers.EMPTY_ARRAY));
              return function () { return valueExpr_1; };
          }
          var nodeIndex = this.nodeDefs.length;
          // pureArrayDef(argCount: number): NodeDef;
          var nodeDef = function () {
              return importExpr(createIdentifier(Identifiers.pureArrayDef)).callFn([literal(argCount)]);
          };
          this.nodeDefs.push(nodeDef);
          return function (args) { return callCheckStmt(nodeIndex, args); };
      };
      ViewBuilder.prototype.createLiteralMapConverter = function (keys) {
          if (keys.length === 0) {
              var valueExpr_2 = importExpr(createIdentifier(Identifiers.EMPTY_MAP));
              return function () { return valueExpr_2; };
          }
          var nodeIndex = this.nodeDefs.length;
          // function pureObjectDef(propertyNames: string[]): NodeDef
          var nodeDef = function () {
              return importExpr(createIdentifier(Identifiers.pureObjectDef)).callFn([literalArr(keys.map(function (key) { return literal(key); }))]);
          };
          this.nodeDefs.push(nodeDef);
          return function (args) { return callCheckStmt(nodeIndex, args); };
      };
      ViewBuilder.prototype.createPipeConverter = function (name, argCount) {
          var pipe = this._findPipe(name);
          if (pipe.pure) {
              var nodeIndex_1 = this.nodeDefs.length;
              // function purePipeDef(argCount: number): NodeDef;
              var nodeDef = function () {
                  return importExpr(createIdentifier(Identifiers.purePipeDef)).callFn([literal(argCount)]);
              };
              this.nodeDefs.push(nodeDef);
              // find underlying pipe in the component view
              var compViewExpr = VIEW_VAR;
              var compBuilder = this;
              while (compBuilder.parent) {
                  compBuilder = compBuilder.parent;
                  compViewExpr = compViewExpr.prop('parent');
              }
              var pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
              var pipeValueExpr_1 = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                  compViewExpr, literal(pipeNodeIndex)
              ]);
              return function (args) {
                  return callUnwrapValue(callCheckStmt(nodeIndex_1, [pipeValueExpr_1].concat(args)));
              };
          }
          else {
              var nodeIndex = this._createPipe(pipe);
              var nodeValueExpr_1 = importExpr(createIdentifier(Identifiers.nodeValue)).callFn([
                  VIEW_VAR, literal(nodeIndex)
              ]);
              return function (args) { return callUnwrapValue(nodeValueExpr_1.callMethod('transform', args)); };
          }
      };
      ViewBuilder.prototype._findPipe = function (name) {
          return this.usedPipes.find(function (pipeSummary) { return pipeSummary.name === name; });
      };
      ViewBuilder.prototype._createPipe = function (pipe) {
          var nodeIndex = this.nodeDefs.length;
          var flags = 0 /* None */;
          pipe.type.lifecycleHooks.forEach(function (lifecycleHook) {
              // for pipes, we only support ngOnDestroy
              if (lifecycleHook === _angular_core.ɵLifecycleHooks.OnDestroy) {
                  flags |= lifecycleHookToNodeFlag(lifecycleHook);
              }
          });
          var depExprs = pipe.type.diDeps.map(depDef);
          // function pipeDef(
          //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
          var nodeDef = function () { return importExpr(createIdentifier(Identifiers.pipeDef)).callFn([
              literal(flags), importExpr(pipe.type), literalArr(depExprs)
          ]); };
          this.nodeDefs.push(nodeDef);
          return nodeIndex;
      };
      // Attention: This might create new nodeDefs (for pipes and literal arrays and literal maps)!
      ViewBuilder.prototype._addUpdateExpressions = function (nodeIndex, expressions, target) {
          var _this = this;
          var transformedExpressions = expressions.map(function (_a) {
              var context = _a.context, value = _a.value;
              if (value instanceof ASTWithSource) {
                  value = value.ast;
              }
              return { context: context, value: convertPropertyBindingBuiltins(_this, value) };
          });
          target.push({ nodeIndex: nodeIndex, expressions: transformedExpressions });
      };
      ViewBuilder.prototype._createElementHandleEventFn = function (nodeIndex, handlers) {
          var _this = this;
          var handleEventStmts = [];
          var handleEventBindingCount = 0;
          handlers.forEach(function (_a) {
              var context = _a.context, eventAst = _a.eventAst, dirAst = _a.dirAst;
              var bindingId = "" + handleEventBindingCount++;
              var nameResolver = context === COMP_VAR ? _this : null;
              var expression = eventAst.handler instanceof ASTWithSource ? eventAst.handler.ast : eventAst.handler;
              var _b = convertActionBinding(nameResolver, context, expression, bindingId), stmts = _b.stmts, allowDefault = _b.allowDefault;
              var trueStmts = stmts;
              if (allowDefault) {
                  trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
              }
              var _c = elementEventNameAndTarget(eventAst, dirAst), eventTarget = _c.target, eventName = _c.name;
              var fullEventName = _angular_core.ɵelementEventFullName(eventTarget, eventName);
              handleEventStmts.push(new IfStmt(literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts));
          });
          var handleEventFn;
          if (handleEventStmts.length > 0) {
              var preStmts = [ALLOW_DEFAULT_VAR.set(literal(true)).toDeclStmt(BOOL_TYPE)];
              if (!this.component.isHost) {
                  preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
              }
              handleEventFn = fn([
                  new FnParam(VIEW_VAR.name, INFERRED_TYPE),
                  new FnParam(EVENT_NAME_VAR.name, INFERRED_TYPE),
                  new FnParam(EventHandlerVars.event.name, INFERRED_TYPE)
              ], preStmts.concat(handleEventStmts, [new ReturnStatement(ALLOW_DEFAULT_VAR)]), INFERRED_TYPE);
          }
          else {
              handleEventFn = NULL_EXPR;
          }
          return handleEventFn;
      };
      ViewBuilder.prototype.visitDirective = function (ast, context) { };
      ViewBuilder.prototype.visitDirectiveProperty = function (ast, context) { };
      ViewBuilder.prototype.visitReference = function (ast, context) { };
      ViewBuilder.prototype.visitVariable = function (ast, context) { };
      ViewBuilder.prototype.visitEvent = function (ast, context) { };
      ViewBuilder.prototype.visitElementProperty = function (ast, context) { };
      ViewBuilder.prototype.visitAttr = function (ast, context) { };
      return ViewBuilder;
  }());
  function providerDef(providerAst) {
      return providerAst.multiProvider ?
          multiProviderDef(providerAst.providers) :
          singleProviderDef(providerAst.providerType, providerAst.providers[0]);
  }
  function multiProviderDef(providers) {
      var allDepDefs = [];
      var allParams = [];
      var exprs = providers.map(function (provider, providerIndex) {
          var expr;
          if (provider.useClass) {
              var depExprs = convertDeps(providerIndex, provider.deps || provider.useClass.diDeps);
              expr = importExpr(provider.useClass).instantiate(depExprs);
          }
          else if (provider.useFactory) {
              var depExprs = convertDeps(providerIndex, provider.deps || provider.useFactory.diDeps);
              expr = importExpr(provider.useFactory).callFn(depExprs);
          }
          else if (provider.useExisting) {
              var depExprs = convertDeps(providerIndex, [{ token: provider.useExisting }]);
              expr = depExprs[0];
          }
          else {
              expr = convertValueToOutputAst(provider.useValue);
          }
          return expr;
      });
      var providerExpr = fn(allParams, [new ReturnStatement(literalArr(exprs))], INFERRED_TYPE);
      return { providerExpr: providerExpr, flags: 512 /* TypeFactoryProvider */, depsExpr: literalArr(allDepDefs) };
      function convertDeps(providerIndex, deps) {
          return deps.map(function (dep, depIndex) {
              var paramName = "p" + providerIndex + "_" + depIndex;
              allParams.push(new FnParam(paramName, DYNAMIC_TYPE));
              allDepDefs.push(depDef(dep));
              return variable(paramName);
          });
      }
  }
  function singleProviderDef(providerType, providerMeta) {
      var providerExpr;
      var flags;
      var deps;
      if (providerType === exports.ProviderAstType.Directive || providerType === exports.ProviderAstType.Component) {
          providerExpr = importExpr(providerMeta.useClass);
          flags = 8192 /* TypeDirective */;
          deps = providerMeta.deps || providerMeta.useClass.diDeps;
      }
      else {
          if (providerMeta.useClass) {
              providerExpr = importExpr(providerMeta.useClass);
              flags = 256 /* TypeClassProvider */;
              deps = providerMeta.deps || providerMeta.useClass.diDeps;
          }
          else if (providerMeta.useFactory) {
              providerExpr = importExpr(providerMeta.useFactory);
              flags = 512 /* TypeFactoryProvider */;
              deps = providerMeta.deps || providerMeta.useFactory.diDeps;
          }
          else if (providerMeta.useExisting) {
              providerExpr = NULL_EXPR;
              flags = 1024 /* TypeUseExistingProvider */;
              deps = [{ token: providerMeta.useExisting }];
          }
          else {
              providerExpr = convertValueToOutputAst(providerMeta.useValue);
              flags = 128 /* TypeValueProvider */;
              deps = [];
          }
      }
      var depsExpr = literalArr(deps.map(function (dep) { return depDef(dep); }));
      return { providerExpr: providerExpr, flags: flags, depsExpr: depsExpr };
  }
  function tokenExpr(tokenMeta) {
      return tokenMeta.identifier ? importExpr(tokenMeta.identifier) : literal(tokenMeta.value);
  }
  function depDef(dep) {
      // Note: the following fields have already been normalized out by provider_analyzer:
      // - isAttribute, isSelf, isHost
      var expr = dep.isValue ? convertValueToOutputAst(dep.value) : tokenExpr(dep.token);
      var flags = 0 /* None */;
      if (dep.isSkipSelf) {
          flags |= 1 /* SkipSelf */;
      }
      if (dep.isOptional) {
          flags |= 2 /* Optional */;
      }
      if (dep.isValue) {
          flags |= 8 /* Value */;
      }
      return flags === 0 /* None */ ? expr : literalArr([literal(flags), expr]);
  }
  function needsAdditionalRootNode(ast) {
      if (ast instanceof EmbeddedTemplateAst) {
          return ast.hasViewContainer;
      }
      if (ast instanceof ElementAst) {
          if (ast.name === NG_CONTAINER_TAG && ast.children.length) {
              return needsAdditionalRootNode(ast.children[ast.children.length - 1]);
          }
          return ast.hasViewContainer;
      }
      return ast instanceof NgContentAst;
  }
  function lifecycleHookToNodeFlag(lifecycleHook) {
      var nodeFlag = 0 /* None */;
      switch (lifecycleHook) {
          case _angular_core.ɵLifecycleHooks.AfterContentChecked:
              nodeFlag = 1048576 /* AfterContentChecked */;
              break;
          case _angular_core.ɵLifecycleHooks.AfterContentInit:
              nodeFlag = 524288 /* AfterContentInit */;
              break;
          case _angular_core.ɵLifecycleHooks.AfterViewChecked:
              nodeFlag = 4194304 /* AfterViewChecked */;
              break;
          case _angular_core.ɵLifecycleHooks.AfterViewInit:
              nodeFlag = 2097152 /* AfterViewInit */;
              break;
          case _angular_core.ɵLifecycleHooks.DoCheck:
              nodeFlag = 131072 /* DoCheck */;
              break;
          case _angular_core.ɵLifecycleHooks.OnChanges:
              nodeFlag = 262144 /* OnChanges */;
              break;
          case _angular_core.ɵLifecycleHooks.OnDestroy:
              nodeFlag = 65536 /* OnDestroy */;
              break;
          case _angular_core.ɵLifecycleHooks.OnInit:
              nodeFlag = 32768 /* OnInit */;
              break;
      }
      return nodeFlag;
  }
  function elementBindingDef(inputAst, dirAst) {
      switch (inputAst.type) {
          case exports.PropertyBindingType.Attribute:
              return literalArr([
                  literal(0 /* ElementAttribute */), literal(inputAst.name),
                  literal(inputAst.securityContext)
              ]);
          case exports.PropertyBindingType.Property:
              return literalArr([
                  literal(3 /* ElementProperty */), literal(inputAst.name),
                  literal(inputAst.securityContext)
              ]);
          case exports.PropertyBindingType.Animation:
              var bindingType = dirAst && dirAst.directive.isComponent ?
                  4 /* ComponentHostProperty */ :
                  3 /* ElementProperty */;
              return literalArr([
                  literal(bindingType), literal('@' + inputAst.name), literal(inputAst.securityContext)
              ]);
          case exports.PropertyBindingType.Class:
              return literalArr([literal(1 /* ElementClass */), literal(inputAst.name)]);
          case exports.PropertyBindingType.Style:
              return literalArr([
                  literal(2 /* ElementStyle */), literal(inputAst.name), literal(inputAst.unit)
              ]);
      }
  }
  function fixedAttrsDef(elementAst) {
      var mapResult = Object.create(null);
      elementAst.attrs.forEach(function (attrAst) { mapResult[attrAst.name] = attrAst.value; });
      elementAst.directives.forEach(function (dirAst) {
          Object.keys(dirAst.directive.hostAttributes).forEach(function (name) {
              var value = dirAst.directive.hostAttributes[name];
              var prevValue = mapResult[name];
              mapResult[name] = prevValue != null ? mergeAttributeValue(name, prevValue, value) : value;
          });
      });
      var mapEntries = [];
      // Note: We need to sort to get a defined output order
      // for tests and for caching generated artifacts...
      return literalArr(Object.keys(mapResult).sort().map(function (attrName) { return literalArr([literal(attrName), literal(mapResult[attrName])]); }));
  }
  function mergeAttributeValue(attrName, attrValue1, attrValue2) {
      if (attrName == CLASS_ATTR$1 || attrName == STYLE_ATTR) {
          return attrValue1 + " " + attrValue2;
      }
      else {
          return attrValue2;
      }
  }
  function callCheckStmt(nodeIndex, exprs) {
      if (exprs.length > 10) {
          return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(1 /* Dynamic */), literalArr(exprs)]);
      }
      else {
          return CHECK_VAR.callFn([VIEW_VAR, literal(nodeIndex), literal(0 /* Inline */)].concat(exprs));
      }
  }
  function callUnwrapValue(expr) {
      return importExpr(createIdentifier(Identifiers.unwrapValue)).callFn([expr]);
  }
  function findStaticQueryIds(nodes, result) {
      if (result === void 0) { result = new Map(); }
      nodes.forEach(function (node) {
          var staticQueryIds = new Set();
          var dynamicQueryIds = new Set();
          var queryMatches;
          if (node instanceof ElementAst) {
              findStaticQueryIds(node.children, result);
              node.children.forEach(function (child) {
                  var childData = result.get(child);
                  childData.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
                  childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
              });
              queryMatches = node.queryMatches;
          }
          else if (node instanceof EmbeddedTemplateAst) {
              findStaticQueryIds(node.children, result);
              node.children.forEach(function (child) {
                  var childData = result.get(child);
                  childData.staticQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
                  childData.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
              });
              queryMatches = node.queryMatches;
          }
          if (queryMatches) {
              queryMatches.forEach(function (match) { return staticQueryIds.add(match.queryId); });
          }
          dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
          result.set(node, { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds });
      });
      return result;
  }
  function staticViewQueryIds(nodeStaticQueryIds) {
      var staticQueryIds = new Set();
      var dynamicQueryIds = new Set();
      Array.from(nodeStaticQueryIds.values()).forEach(function (entry) {
          entry.staticQueryIds.forEach(function (queryId) { return staticQueryIds.add(queryId); });
          entry.dynamicQueryIds.forEach(function (queryId) { return dynamicQueryIds.add(queryId); });
      });
      dynamicQueryIds.forEach(function (queryId) { return staticQueryIds.delete(queryId); });
      return { staticQueryIds: staticQueryIds, dynamicQueryIds: dynamicQueryIds };
  }
  function createComponentFactoryResolver(directives) {
      var componentDirMeta = directives.find(function (dirAst) { return dirAst.directive.isComponent; });
      if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
          var entryComponentFactories = componentDirMeta.directive.entryComponents.map(function (entryComponent) { return importExpr({ reference: entryComponent.componentFactory }); });
          var cfrExpr = importExpr(createIdentifier(Identifiers.CodegenComponentFactoryResolver))
              .instantiate([literalArr(entryComponentFactories)]);
          var token = createIdentifierToken(Identifiers.ComponentFactoryResolver);
          var classMeta = {
              diDeps: [
                  { isValue: true, value: literalArr(entryComponentFactories) },
                  { token: token, isSkipSelf: true, isOptional: true }
              ],
              lifecycleHooks: [],
              reference: resolveIdentifier(Identifiers.CodegenComponentFactoryResolver)
          };
          return new ProviderAst(token, false, true, [{ token: token, multi: false, useClass: classMeta }], exports.ProviderAstType.PrivateService, [], componentDirMeta.sourceSpan);
      }
      return null;
  }
  function elementEventNameAndTarget(eventAst, dirAst) {
      if (eventAst.isAnimation) {
          return {
              name: "@" + eventAst.name + "." + eventAst.phase,
              target: dirAst && dirAst.directive.isComponent ? 'component' : null
          };
      }
      else {
          return eventAst;
      }
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var GeneratedFile = (function () {
      function GeneratedFile(srcFileUrl, genFileUrl, source) {
          this.srcFileUrl = srcFileUrl;
          this.genFileUrl = genFileUrl;
          this.source = source;
      }
      return GeneratedFile;
  }());

  var __extends$22 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  function serializeSummaries(summaryResolver, symbolResolver, symbols, types) {
      var serializer = new Serializer$1(symbolResolver, summaryResolver);
      // for symbols, we use everything except for the class metadata itself
      // (we keep the statics though), as the class metadata is contained in the
      // CompileTypeSummary.
      symbols.forEach(function (resolvedSymbol) { return serializer.addOrMergeSummary({ symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata }); });
      // Add summaries that are referenced by the given symbols (transitively)
      // Note: the serializer.symbols array might be growing while
      // we execute the loop!
      for (var processedIndex = 0; processedIndex < serializer.symbols.length; processedIndex++) {
          var symbol = serializer.symbols[processedIndex];
          if (summaryResolver.isLibraryFile(symbol.filePath)) {
              var summary = summaryResolver.resolveSummary(symbol);
              if (!summary) {
                  // some symbols might originate from a plain typescript library
                  // that just exported .d.ts and .metadata.json files, i.e. where no summary
                  // files were created.
                  var resolvedSymbol = symbolResolver.resolveSymbol(symbol);
                  if (resolvedSymbol) {
                      summary = { symbol: resolvedSymbol.symbol, metadata: resolvedSymbol.metadata };
                  }
              }
              if (summary) {
                  serializer.addOrMergeSummary(summary);
              }
          }
      }
      // Add type summaries.
      // Note: We don't add the summaries of all referenced symbols as for the ResolvedSymbols,
      // as the type summaries already contain the transitive data that they require
      // (in a minimal way).
      types.forEach(function (typeSummary) {
          serializer.addOrMergeSummary({ symbol: typeSummary.type.reference, metadata: { __symbolic: 'class' }, type: typeSummary });
          if (typeSummary.summaryKind === exports.CompileSummaryKind.NgModule) {
              var ngModuleSummary = typeSummary;
              ngModuleSummary.exportedDirectives.concat(ngModuleSummary.exportedPipes).forEach(function (id) {
                  var symbol = id.reference;
                  if (summaryResolver.isLibraryFile(symbol.filePath)) {
                      var summary = summaryResolver.resolveSummary(symbol);
                      if (summary) {
                          serializer.addOrMergeSummary(summary);
                      }
                  }
              });
          }
      });
      return serializer.serialize();
  }
  function deserializeSummaries(symbolCache, json) {
      var deserializer = new Deserializer(symbolCache);
      return deserializer.deserialize(json);
  }
  var Serializer$1 = (function (_super) {
      __extends$22(Serializer, _super);
      function Serializer(symbolResolver, summaryResolver) {
          var _this = _super.call(this) || this;
          _this.symbolResolver = symbolResolver;
          _this.summaryResolver = summaryResolver;
          // Note: This only contains symbols without members.
          _this.symbols = [];
          _this.indexBySymbol = new Map();
          // This now contains a `__symbol: number` in the place of
          // StaticSymbols, but otherwise has the same shape as the original objects.
          _this.processedSummaryBySymbol = new Map();
          _this.processedSummaries = [];
          return _this;
      }
      Serializer.prototype.addOrMergeSummary = function (summary) {
          var symbolMeta = summary.metadata;
          if (symbolMeta && symbolMeta.__symbolic === 'class') {
              // For classes, we only keep their statics and arity, but not the metadata
              // of the class itself as that has been captured already via other summaries
              // (e.g. DirectiveSummary, ...).
              symbolMeta = { __symbolic: 'class', statics: symbolMeta.statics, arity: symbolMeta.arity };
          }
          var processedSummary = this.processedSummaryBySymbol.get(summary.symbol);
          if (!processedSummary) {
              processedSummary = this.processValue({ symbol: summary.symbol });
              this.processedSummaries.push(processedSummary);
              this.processedSummaryBySymbol.set(summary.symbol, processedSummary);
          }
          // Note: == on purpose to compare with undefined!
          if (processedSummary.metadata == null && symbolMeta != null) {
              processedSummary.metadata = this.processValue(symbolMeta);
          }
          // Note: == on purpose to compare with undefined!
          if (processedSummary.type == null && summary.type != null) {
              processedSummary.type = this.processValue(summary.type);
          }
      };
      Serializer.prototype.serialize = function () {
          var _this = this;
          var exportAs = [];
          var json = JSON.stringify({
              summaries: this.processedSummaries,
              symbols: this.symbols.map(function (symbol, index) {
                  symbol.assertNoMembers();
                  var importAs;
                  if (_this.summaryResolver.isLibraryFile(symbol.filePath)) {
                      importAs = symbol.name + "_" + index;
                      exportAs.push({ symbol: symbol, exportAs: importAs });
                  }
                  return {
                      __symbol: index,
                      name: symbol.name,
                      // We convert the source filenames tinto output filenames,
                      // as the generated summary file will be used when teh current
                      // compilation unit is used as a library
                      filePath: _this.summaryResolver.getLibraryFileName(symbol.filePath),
                      importAs: importAs
                  };
              })
          });
          return { json: json, exportAs: exportAs };
      };
      Serializer.prototype.processValue = function (value) { return visitValue(value, this, null); };
      Serializer.prototype.visitOther = function (value, context) {
          if (value instanceof StaticSymbol) {
              var baseSymbol = this.symbolResolver.getStaticSymbol(value.filePath, value.name);
              var index = this.indexBySymbol.get(baseSymbol);
              // Note: == on purpose to compare with undefined!
              if (index == null) {
                  index = this.indexBySymbol.size;
                  this.indexBySymbol.set(baseSymbol, index);
                  this.symbols.push(baseSymbol);
              }
              return { __symbol: index, members: value.members };
          }
      };
      return Serializer;
  }(ValueTransformer));
  var Deserializer = (function (_super) {
      __extends$22(Deserializer, _super);
      function Deserializer(symbolCache) {
          var _this = _super.call(this) || this;
          _this.symbolCache = symbolCache;
          return _this;
      }
      Deserializer.prototype.deserialize = function (json) {
          var _this = this;
          var data = JSON.parse(json);
          var importAs = [];
          this.symbols = [];
          data.symbols.forEach(function (serializedSymbol) {
              var symbol = _this.symbolCache.get(serializedSymbol.filePath, serializedSymbol.name);
              _this.symbols.push(symbol);
              if (serializedSymbol.importAs) {
                  importAs.push({ symbol: symbol, importAs: serializedSymbol.importAs });
              }
          });
          var summaries = visitValue(data.summaries, this, null);
          return { summaries: summaries, importAs: importAs };
      };
      Deserializer.prototype.visitStringMap = function (map, context) {
          if ('__symbol' in map) {
              var baseSymbol = this.symbols[map['__symbol']];
              var members = map['members'];
              return members.length ? this.symbolCache.get(baseSymbol.filePath, baseSymbol.name, members) :
                  baseSymbol;
          }
          else {
              return _super.prototype.visitStringMap.call(this, map, context);
          }
      };
      return Deserializer;
  }(ValueTransformer));

  var AotCompiler = (function () {
      function AotCompiler(_config, _host, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _outputEmitter, _summaryResolver, _localeId, _translationFormat, _symbolResolver) {
          this._config = _config;
          this._host = _host;
          this._metadataResolver = _metadataResolver;
          this._templateParser = _templateParser;
          this._styleCompiler = _styleCompiler;
          this._viewCompiler = _viewCompiler;
          this._ngModuleCompiler = _ngModuleCompiler;
          this._outputEmitter = _outputEmitter;
          this._summaryResolver = _summaryResolver;
          this._localeId = _localeId;
          this._translationFormat = _translationFormat;
          this._symbolResolver = _symbolResolver;
      }
      AotCompiler.prototype.clearCache = function () { this._metadataResolver.clearCache(); };
      AotCompiler.prototype.compileAll = function (rootFiles) {
          var _this = this;
          var programSymbols = extractProgramSymbols(this._symbolResolver, rootFiles, this._host);
          var _a = analyzeAndValidateNgModules(programSymbols, this._host, this._metadataResolver), ngModuleByPipeOrDirective = _a.ngModuleByPipeOrDirective, files = _a.files, ngModules = _a.ngModules;
          return Promise
              .all(ngModules.map(function (ngModule) { return _this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
              .then(function () {
              var sourceModules = files.map(function (file) { return _this._compileSrcFile(file.srcUrl, ngModuleByPipeOrDirective, file.directives, file.pipes, file.ngModules, file.injectables); });
              return flatten(sourceModules);
          });
      };
      AotCompiler.prototype._compileSrcFile = function (srcFileUrl, ngModuleByPipeOrDirective, directives, pipes, ngModules, injectables) {
          var _this = this;
          var fileSuffix = splitTypescriptSuffix(srcFileUrl)[1];
          var statements = [];
          var exportedVars = [];
          var generatedFiles = [];
          generatedFiles.push(this._createSummary(srcFileUrl, directives, pipes, ngModules, injectables, statements, exportedVars));
          // compile all ng modules
          exportedVars.push.apply(exportedVars, ngModules.map(function (ngModuleType) { return _this._compileModule(ngModuleType, statements); }));
          // compile components
          directives.forEach(function (dirType) {
              var compMeta = _this._metadataResolver.getDirectiveMetadata(dirType);
              if (!compMeta.isComponent) {
                  return Promise.resolve(null);
              }
              var ngModule = ngModuleByPipeOrDirective.get(dirType);
              if (!ngModule) {
                  throw new Error("Internal Error: cannot determine the module for component " + identifierName(compMeta.type) + "!");
              }
              _assertComponent(compMeta);
              // compile styles
              var stylesCompileResults = _this._styleCompiler.compileComponent(compMeta);
              stylesCompileResults.externalStylesheets.forEach(function (compiledStyleSheet) {
                  generatedFiles.push(_this._codgenStyles(srcFileUrl, compiledStyleSheet, fileSuffix));
              });
              // compile components
              var compViewVars = _this._compileComponent(compMeta, ngModule, ngModule.transitiveModule.directives, stylesCompileResults.componentStylesheet, fileSuffix, statements);
              exportedVars.push(_this._compileComponentFactory(compMeta, ngModule, fileSuffix, statements), compViewVars.viewClassVar, compViewVars.compRenderTypeVar);
          });
          if (statements.length > 0) {
              var srcModule = this._codegenSourceModule(srcFileUrl, ngfactoryFilePath(srcFileUrl), statements, exportedVars);
              generatedFiles.unshift(srcModule);
          }
          return generatedFiles;
      };
      AotCompiler.prototype._createSummary = function (srcFileUrl, directives, pipes, ngModules, injectables, targetStatements, targetExportedVars) {
          var _this = this;
          var symbolSummaries = this._symbolResolver.getSymbolsOf(srcFileUrl)
              .map(function (symbol) { return _this._symbolResolver.resolveSymbol(symbol); });
          var typeSummaries = ngModules.map(function (ref) { return _this._metadataResolver.getNgModuleSummary(ref); }).concat(directives.map(function (ref) { return _this._metadataResolver.getDirectiveSummary(ref); }), pipes.map(function (ref) { return _this._metadataResolver.getPipeSummary(ref); }), injectables.map(function (ref) { return _this._metadataResolver.getInjectableSummary(ref); }));
          var _a = serializeSummaries(this._summaryResolver, this._symbolResolver, symbolSummaries, typeSummaries), json = _a.json, exportAs = _a.exportAs;
          exportAs.forEach(function (entry) {
              targetStatements.push(variable(entry.exportAs).set(importExpr({ reference: entry.symbol })).toDeclStmt());
              targetExportedVars.push(entry.exportAs);
          });
          return new GeneratedFile(srcFileUrl, summaryFileName(srcFileUrl), json);
      };
      AotCompiler.prototype._compileModule = function (ngModuleType, targetStatements) {
          var ngModule = this._metadataResolver.getNgModuleMetadata(ngModuleType);
          var providers = [];
          if (this._localeId) {
              providers.push({
                  token: createIdentifierToken(Identifiers.LOCALE_ID),
                  useValue: this._localeId,
              });
          }
          if (this._translationFormat) {
              providers.push({
                  token: createIdentifierToken(Identifiers.TRANSLATIONS_FORMAT),
                  useValue: this._translationFormat
              });
          }
          var appCompileResult = this._ngModuleCompiler.compile(ngModule, providers);
          targetStatements.push.apply(targetStatements, appCompileResult.statements);
          return appCompileResult.ngModuleFactoryVar;
      };
      AotCompiler.prototype._compileComponentFactory = function (compMeta, ngModule, fileSuffix, targetStatements) {
          var hostType = this._metadataResolver.getHostComponentType(compMeta.type.reference);
          var hostMeta = createHostComponentMeta(hostType, compMeta, this._metadataResolver.getHostComponentViewClass(hostType));
          var hostViewFactoryVar = this._compileComponent(hostMeta, ngModule, [compMeta.type], null, fileSuffix, targetStatements)
              .viewClassVar;
          var compFactoryVar = componentFactoryName(compMeta.type.reference);
          targetStatements.push(variable(compFactoryVar)
              .set(importExpr(createIdentifier(Identifiers.createComponentFactory)).callFn([
              literal(compMeta.selector),
              importExpr(compMeta.type),
              variable(hostViewFactoryVar),
          ]))
              .toDeclStmt(importType(createIdentifier(Identifiers.ComponentFactory), [importType(compMeta.type)], [TypeModifier.Const]), [StmtModifier.Final]));
          return compFactoryVar;
      };
      AotCompiler.prototype._compileComponent = function (compMeta, ngModule, directiveIdentifiers, componentStyles, fileSuffix, targetStatements) {
          var _this = this;
          var directives = directiveIdentifiers.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
          var pipes = ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
          var _a = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, ngModule.schemas, identifierName(compMeta.type)), parsedTemplate = _a.template, usedPipes = _a.pipes;
          var stylesExpr = componentStyles ? variable(componentStyles.stylesVar) : literalArr([]);
          var viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, stylesExpr, usedPipes);
          if (componentStyles) {
              targetStatements.push.apply(targetStatements, _resolveStyleStatements(this._symbolResolver, componentStyles, fileSuffix));
          }
          targetStatements.push.apply(targetStatements, viewResult.statements);
          return { viewClassVar: viewResult.viewClassVar, compRenderTypeVar: viewResult.rendererTypeVar };
      };
      AotCompiler.prototype._codgenStyles = function (fileUrl, stylesCompileResult, fileSuffix) {
          _resolveStyleStatements(this._symbolResolver, stylesCompileResult, fileSuffix);
          return this._codegenSourceModule(fileUrl, _stylesModuleUrl(stylesCompileResult.meta.moduleUrl, stylesCompileResult.isShimmed, fileSuffix), stylesCompileResult.statements, [stylesCompileResult.stylesVar]);
      };
      AotCompiler.prototype._codegenSourceModule = function (srcFileUrl, genFileUrl, statements, exportedVars) {
          return new GeneratedFile(srcFileUrl, genFileUrl, this._outputEmitter.emitStatements(genFileUrl, statements, exportedVars));
      };
      return AotCompiler;
  }());
  function _resolveStyleStatements(reflector, compileResult, fileSuffix) {
      compileResult.dependencies.forEach(function (dep) {
          dep.valuePlaceholder.reference = reflector.getStaticSymbol(_stylesModuleUrl(dep.moduleUrl, dep.isShimmed, fileSuffix), dep.name);
      });
      return compileResult.statements;
  }
  function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
      return "" + stylesheetUrl + (shim ? '.shim' : '') + ".ngstyle" + suffix;
  }
  function _assertComponent(meta) {
      if (!meta.isComponent) {
          throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
      }
  }
  // Returns all the source files and a mapping from modules to directives
  function analyzeNgModules(programStaticSymbols, host, metadataResolver) {
      var _a = _createNgModules(programStaticSymbols, host, metadataResolver), ngModules = _a.ngModules, symbolsMissingModule = _a.symbolsMissingModule;
      return _analyzeNgModules(programStaticSymbols, ngModules, symbolsMissingModule, metadataResolver);
  }
  function analyzeAndValidateNgModules(programStaticSymbols, host, metadataResolver) {
      var result = analyzeNgModules(programStaticSymbols, host, metadataResolver);
      if (result.symbolsMissingModule && result.symbolsMissingModule.length) {
          var messages = result.symbolsMissingModule.map(function (s) {
              return "Cannot determine the module for class " + s.name + " in " + s.filePath + "! Add " + s.name + " to the NgModule to fix it.";
          });
          throw syntaxError(messages.join('\n'));
      }
      return result;
  }
  function _analyzeNgModules(programSymbols, ngModuleMetas, symbolsMissingModule, metadataResolver) {
      var moduleMetasByRef = new Map();
      ngModuleMetas.forEach(function (ngModule) { return moduleMetasByRef.set(ngModule.type.reference, ngModule); });
      var ngModuleByPipeOrDirective = new Map();
      var ngModulesByFile = new Map();
      var ngDirectivesByFile = new Map();
      var ngPipesByFile = new Map();
      var ngInjectablesByFile = new Map();
      var filePaths = new Set();
      // Make sure we produce an analyzed file for each input file
      programSymbols.forEach(function (symbol) {
          var filePath = symbol.filePath;
          filePaths.add(filePath);
          if (metadataResolver.isInjectable(symbol)) {
              ngInjectablesByFile.set(filePath, (ngInjectablesByFile.get(filePath) || []).concat(symbol));
          }
      });
      // Looping over all modules to construct:
      // - a map from file to modules `ngModulesByFile`,
      // - a map from file to directives `ngDirectivesByFile`,
      // - a map from file to pipes `ngPipesByFile`,
      // - a map from directive/pipe to module `ngModuleByPipeOrDirective`.
      ngModuleMetas.forEach(function (ngModuleMeta) {
          var srcFileUrl = ngModuleMeta.type.reference.filePath;
          filePaths.add(srcFileUrl);
          ngModulesByFile.set(srcFileUrl, (ngModulesByFile.get(srcFileUrl) || []).concat(ngModuleMeta.type.reference));
          ngModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
              var fileUrl = dirIdentifier.reference.filePath;
              filePaths.add(fileUrl);
              ngDirectivesByFile.set(fileUrl, (ngDirectivesByFile.get(fileUrl) || []).concat(dirIdentifier.reference));
              ngModuleByPipeOrDirective.set(dirIdentifier.reference, ngModuleMeta);
          });
          ngModuleMeta.declaredPipes.forEach(function (pipeIdentifier) {
              var fileUrl = pipeIdentifier.reference.filePath;
              filePaths.add(fileUrl);
              ngPipesByFile.set(fileUrl, (ngPipesByFile.get(fileUrl) || []).concat(pipeIdentifier.reference));
              ngModuleByPipeOrDirective.set(pipeIdentifier.reference, ngModuleMeta);
          });
      });
      var files = [];
      filePaths.forEach(function (srcUrl) {
          var directives = ngDirectivesByFile.get(srcUrl) || [];
          var pipes = ngPipesByFile.get(srcUrl) || [];
          var ngModules = ngModulesByFile.get(srcUrl) || [];
          var injectables = ngInjectablesByFile.get(srcUrl) || [];
          files.push({ srcUrl: srcUrl, directives: directives, pipes: pipes, ngModules: ngModules, injectables: injectables });
      });
      return {
          // map directive/pipe to module
          ngModuleByPipeOrDirective: ngModuleByPipeOrDirective,
          // list modules and directives for every source file
          files: files,
          ngModules: ngModuleMetas, symbolsMissingModule: symbolsMissingModule
      };
  }
  function extractProgramSymbols(staticSymbolResolver, files, host) {
      var staticSymbols = [];
      files.filter(function (fileName) { return host.isSourceFile(fileName); }).forEach(function (sourceFile) {
          staticSymbolResolver.getSymbolsOf(sourceFile).forEach(function (symbol) {
              var resolvedSymbol = staticSymbolResolver.resolveSymbol(symbol);
              var symbolMeta = resolvedSymbol.metadata;
              if (symbolMeta) {
                  if (symbolMeta.__symbolic != 'error') {
                      // Ignore symbols that are only included to record error information.
                      staticSymbols.push(resolvedSymbol.symbol);
                  }
              }
          });
      });
      return staticSymbols;
  }
  // Load the NgModules and check
  // that all directives / pipes that are present in the program
  // are also declared by a module.
  function _createNgModules(programStaticSymbols, host, metadataResolver) {
      var ngModules = new Map();
      var programPipesAndDirectives = [];
      var ngModulePipesAndDirective = new Set();
      var addNgModule = function (staticSymbol) {
          if (ngModules.has(staticSymbol) || !host.isSourceFile(staticSymbol.filePath)) {
              return false;
          }
          var ngModule = metadataResolver.getNgModuleMetadata(staticSymbol, false);
          if (ngModule) {
              ngModules.set(ngModule.type.reference, ngModule);
              ngModule.declaredDirectives.forEach(function (dir) { return ngModulePipesAndDirective.add(dir.reference); });
              ngModule.declaredPipes.forEach(function (pipe) { return ngModulePipesAndDirective.add(pipe.reference); });
              // For every input module add the list of transitively included modules
              ngModule.transitiveModule.modules.forEach(function (modMeta) { return addNgModule(modMeta.reference); });
          }
          return !!ngModule;
      };
      programStaticSymbols.forEach(function (staticSymbol) {
          if (!addNgModule(staticSymbol) &&
              (metadataResolver.isDirective(staticSymbol) || metadataResolver.isPipe(staticSymbol))) {
              programPipesAndDirectives.push(staticSymbol);
          }
      });
      // Throw an error if any of the program pipe or directives is not declared by a module
      var symbolsMissingModule = programPipesAndDirectives.filter(function (s) { return !ngModulePipesAndDirective.has(s); });
      return { ngModules: Array.from(ngModules.values()), symbolsMissingModule: symbolsMissingModule };
  }

  var StaticAndDynamicReflectionCapabilities = (function () {
      function StaticAndDynamicReflectionCapabilities(staticDelegate) {
          this.staticDelegate = staticDelegate;
          this.dynamicDelegate = new _angular_core.ɵReflectionCapabilities();
      }
      StaticAndDynamicReflectionCapabilities.install = function (staticDelegate) {
          _angular_core.ɵreflector.updateCapabilities(new StaticAndDynamicReflectionCapabilities(staticDelegate));
      };
      StaticAndDynamicReflectionCapabilities.prototype.isReflectionEnabled = function () { return true; };
      StaticAndDynamicReflectionCapabilities.prototype.factory = function (type) { return this.dynamicDelegate.factory(type); };
      StaticAndDynamicReflectionCapabilities.prototype.hasLifecycleHook = function (type, lcProperty) {
          return isStaticType(type) ? this.staticDelegate.hasLifecycleHook(type, lcProperty) :
              this.dynamicDelegate.hasLifecycleHook(type, lcProperty);
      };
      StaticAndDynamicReflectionCapabilities.prototype.parameters = function (type) {
          return isStaticType(type) ? this.staticDelegate.parameters(type) :
              this.dynamicDelegate.parameters(type);
      };
      StaticAndDynamicReflectionCapabilities.prototype.annotations = function (type) {
          return isStaticType(type) ? this.staticDelegate.annotations(type) :
              this.dynamicDelegate.annotations(type);
      };
      StaticAndDynamicReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
          return isStaticType(typeOrFunc) ? this.staticDelegate.propMetadata(typeOrFunc) :
              this.dynamicDelegate.propMetadata(typeOrFunc);
      };
      StaticAndDynamicReflectionCapabilities.prototype.getter = function (name) { return this.dynamicDelegate.getter(name); };
      StaticAndDynamicReflectionCapabilities.prototype.setter = function (name) { return this.dynamicDelegate.setter(name); };
      StaticAndDynamicReflectionCapabilities.prototype.method = function (name) { return this.dynamicDelegate.method(name); };
      StaticAndDynamicReflectionCapabilities.prototype.importUri = function (type) { return this.staticDelegate.importUri(type); };
      StaticAndDynamicReflectionCapabilities.prototype.resolveIdentifier = function (name, moduleUrl, members, runtime) {
          return this.staticDelegate.resolveIdentifier(name, moduleUrl, members);
      };
      StaticAndDynamicReflectionCapabilities.prototype.resolveEnum = function (enumIdentifier, name) {
          if (isStaticType(enumIdentifier)) {
              return this.staticDelegate.resolveEnum(enumIdentifier, name);
          }
          else {
              return null;
          }
      };
      return StaticAndDynamicReflectionCapabilities;
  }());
  function isStaticType(type) {
      return typeof type === 'object' && type.name && type.filePath;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$23 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ANGULAR_CORE = '@angular/core';
  var HIDDEN_KEY = /^\$.*\$$/;
  var IGNORE = {
      __symbolic: 'ignore'
  };
  function shouldIgnore(value) {
      return value && value.__symbolic == 'ignore';
  }
  /**
   * A static reflector implements enough of the Reflector API that is necessary to compile
   * templates statically.
   */
  var StaticReflector = (function () {
      function StaticReflector(symbolResolver, knownMetadataClasses, knownMetadataFunctions, errorRecorder) {
          if (knownMetadataClasses === void 0) { knownMetadataClasses = []; }
          if (knownMetadataFunctions === void 0) { knownMetadataFunctions = []; }
          var _this = this;
          this.symbolResolver = symbolResolver;
          this.errorRecorder = errorRecorder;
          this.annotationCache = new Map();
          this.propertyCache = new Map();
          this.parameterCache = new Map();
          this.methodCache = new Map();
          this.conversionMap = new Map();
          this.initializeConversionMap();
          knownMetadataClasses.forEach(function (kc) { return _this._registerDecoratorOrConstructor(_this.getStaticSymbol(kc.filePath, kc.name), kc.ctor); });
          knownMetadataFunctions.forEach(function (kf) { return _this._registerFunction(_this.getStaticSymbol(kf.filePath, kf.name), kf.fn); });
      }
      StaticReflector.prototype.importUri = function (typeOrFunc) {
          var staticSymbol = this.findSymbolDeclaration(typeOrFunc);
          return staticSymbol ? staticSymbol.filePath : null;
      };
      StaticReflector.prototype.resolveIdentifier = function (name, moduleUrl, members) {
          var importSymbol = this.getStaticSymbol(moduleUrl, name);
          var rootSymbol = this.findDeclaration(moduleUrl, name);
          if (importSymbol != rootSymbol) {
              this.symbolResolver.recordImportAs(rootSymbol, importSymbol);
          }
          if (members && members.length) {
              return this.getStaticSymbol(rootSymbol.filePath, rootSymbol.name, members);
          }
          return rootSymbol;
      };
      StaticReflector.prototype.findDeclaration = function (moduleUrl, name, containingFile) {
          return this.findSymbolDeclaration(this.symbolResolver.getSymbolByModule(moduleUrl, name, containingFile));
      };
      StaticReflector.prototype.findSymbolDeclaration = function (symbol) {
          var resolvedSymbol = this.symbolResolver.resolveSymbol(symbol);
          if (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
              return this.findSymbolDeclaration(resolvedSymbol.metadata);
          }
          else {
              return symbol;
          }
      };
      StaticReflector.prototype.resolveEnum = function (enumIdentifier, name) {
          var staticSymbol = enumIdentifier;
          var members = (staticSymbol.members || []).concat(name);
          return this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name, members);
      };
      StaticReflector.prototype.annotations = function (type) {
          var annotations = this.annotationCache.get(type);
          if (!annotations) {
              annotations = [];
              var classMetadata = this.getTypeMetadata(type);
              if (classMetadata['extends']) {
                  var parentType = this.trySimplify(type, classMetadata['extends']);
                  if (parentType && (parentType instanceof StaticSymbol)) {
                      var parentAnnotations = this.annotations(parentType);
                      annotations.push.apply(annotations, parentAnnotations);
                  }
              }
              if (classMetadata['decorators']) {
                  var ownAnnotations = this.simplify(type, classMetadata['decorators']);
                  annotations.push.apply(annotations, ownAnnotations);
              }
              this.annotationCache.set(type, annotations.filter(function (ann) { return !!ann; }));
          }
          return annotations;
      };
      StaticReflector.prototype.propMetadata = function (type) {
          var _this = this;
          var propMetadata = this.propertyCache.get(type);
          if (!propMetadata) {
              var classMetadata = this.getTypeMetadata(type);
              propMetadata = {};
              if (classMetadata['extends']) {
                  var parentType = this.simplify(type, classMetadata['extends']);
                  if (parentType instanceof StaticSymbol) {
                      var parentPropMetadata_1 = this.propMetadata(parentType);
                      Object.keys(parentPropMetadata_1).forEach(function (parentProp) {
                          propMetadata[parentProp] = parentPropMetadata_1[parentProp];
                      });
                  }
              }
              var members_1 = classMetadata['members'] || {};
              Object.keys(members_1).forEach(function (propName) {
                  var propData = members_1[propName];
                  var prop = propData
                      .find(function (a) { return a['__symbolic'] == 'property' || a['__symbolic'] == 'method'; });
                  var decorators = [];
                  if (propMetadata[propName]) {
                      decorators.push.apply(decorators, propMetadata[propName]);
                  }
                  propMetadata[propName] = decorators;
                  if (prop && prop['decorators']) {
                      decorators.push.apply(decorators, _this.simplify(type, prop['decorators']));
                  }
              });
              this.propertyCache.set(type, propMetadata);
          }
          return propMetadata;
      };
      StaticReflector.prototype.parameters = function (type) {
          if (!(type instanceof StaticSymbol)) {
              this.reportError(new Error("parameters received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
              return [];
          }
          try {
              var parameters_1 = this.parameterCache.get(type);
              if (!parameters_1) {
                  var classMetadata = this.getTypeMetadata(type);
                  var members = classMetadata ? classMetadata['members'] : null;
                  var ctorData = members ? members['__ctor__'] : null;
                  if (ctorData) {
                      var ctor = ctorData.find(function (a) { return a['__symbolic'] == 'constructor'; });
                      var parameterTypes = this.simplify(type, ctor['parameters'] || []);
                      var parameterDecorators_1 = this.simplify(type, ctor['parameterDecorators'] || []);
                      parameters_1 = [];
                      parameterTypes.forEach(function (paramType, index) {
                          var nestedResult = [];
                          if (paramType) {
                              nestedResult.push(paramType);
                          }
                          var decorators = parameterDecorators_1 ? parameterDecorators_1[index] : null;
                          if (decorators) {
                              nestedResult.push.apply(nestedResult, decorators);
                          }
                          parameters_1.push(nestedResult);
                      });
                  }
                  else if (classMetadata['extends']) {
                      var parentType = this.simplify(type, classMetadata['extends']);
                      if (parentType instanceof StaticSymbol) {
                          parameters_1 = this.parameters(parentType);
                      }
                  }
                  if (!parameters_1) {
                      parameters_1 = [];
                  }
                  this.parameterCache.set(type, parameters_1);
              }
              return parameters_1;
          }
          catch (e) {
              console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
              throw e;
          }
      };
      StaticReflector.prototype._methodNames = function (type) {
          var methodNames = this.methodCache.get(type);
          if (!methodNames) {
              var classMetadata = this.getTypeMetadata(type);
              methodNames = {};
              if (classMetadata['extends']) {
                  var parentType = this.simplify(type, classMetadata['extends']);
                  if (parentType instanceof StaticSymbol) {
                      var parentMethodNames_1 = this._methodNames(parentType);
                      Object.keys(parentMethodNames_1).forEach(function (parentProp) {
                          methodNames[parentProp] = parentMethodNames_1[parentProp];
                      });
                  }
              }
              var members_2 = classMetadata['members'] || {};
              Object.keys(members_2).forEach(function (propName) {
                  var propData = members_2[propName];
                  var isMethod = propData.some(function (a) { return a['__symbolic'] == 'method'; });
                  methodNames[propName] = methodNames[propName] || isMethod;
              });
              this.methodCache.set(type, methodNames);
          }
          return methodNames;
      };
      StaticReflector.prototype.hasLifecycleHook = function (type, lcProperty) {
          if (!(type instanceof StaticSymbol)) {
              this.reportError(new Error("hasLifecycleHook received " + JSON.stringify(type) + " which is not a StaticSymbol"), type);
          }
          try {
              return !!this._methodNames(type)[lcProperty];
          }
          catch (e) {
              console.error("Failed on type " + JSON.stringify(type) + " with error " + e);
              throw e;
          }
      };
      StaticReflector.prototype._registerDecoratorOrConstructor = function (type, ctor) {
          this.conversionMap.set(type, function (context, args) { return new (ctor.bind.apply(ctor, [void 0].concat(args)))(); });
      };
      StaticReflector.prototype._registerFunction = function (type, fn) {
          this.conversionMap.set(type, function (context, args) { return fn.apply(undefined, args); });
      };
      StaticReflector.prototype.initializeConversionMap = function () {
          this.injectionToken = this.findDeclaration(ANGULAR_CORE, 'InjectionToken');
          this.opaqueToken = this.findDeclaration(ANGULAR_CORE, 'OpaqueToken');
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), _angular_core.Host);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Injectable'), _angular_core.Injectable);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), _angular_core.Self);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), _angular_core.SkipSelf);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Inject'), _angular_core.Inject);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), _angular_core.Optional);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Attribute'), _angular_core.Attribute);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChild'), _angular_core.ContentChild);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ContentChildren'), _angular_core.ContentChildren);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChild'), _angular_core.ViewChild);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'ViewChildren'), _angular_core.ViewChildren);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Input'), _angular_core.Input);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Output'), _angular_core.Output);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Pipe'), _angular_core.Pipe);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostBinding'), _angular_core.HostBinding);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'HostListener'), _angular_core.HostListener);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Directive'), _angular_core.Directive);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Component'), _angular_core.Component);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'NgModule'), _angular_core.NgModule);
          // Note: Some metadata classes can be used directly with Provider.deps.
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Host'), _angular_core.Host);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Self'), _angular_core.Self);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'SkipSelf'), _angular_core.SkipSelf);
          this._registerDecoratorOrConstructor(this.findDeclaration(ANGULAR_CORE, 'Optional'), _angular_core.Optional);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'trigger'), _angular_core.trigger);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'state'), _angular_core.state);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'transition'), _angular_core.transition);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'style'), _angular_core.style);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'animate'), _angular_core.animate);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'keyframes'), _angular_core.keyframes);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'sequence'), _angular_core.sequence);
          this._registerFunction(this.findDeclaration(ANGULAR_CORE, 'group'), _angular_core.group);
      };
      /**
       * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
       * All types passed to the StaticResolver should be pseudo-types returned by this method.
       *
       * @param declarationFile the absolute path of the file where the symbol is declared
       * @param name the name of the type.
       */
      StaticReflector.prototype.getStaticSymbol = function (declarationFile, name, members) {
          return this.symbolResolver.getStaticSymbol(declarationFile, name, members);
      };
      StaticReflector.prototype.reportError = function (error, context, path) {
          if (this.errorRecorder) {
              this.errorRecorder(error, (context && context.filePath) || path);
          }
          else {
              throw error;
          }
      };
      /**
       * Simplify but discard any errors
       */
      StaticReflector.prototype.trySimplify = function (context, value) {
          var originalRecorder = this.errorRecorder;
          this.errorRecorder = function (error, fileName) { };
          var result = this.simplify(context, value);
          this.errorRecorder = originalRecorder;
          return result;
      };
      /** @internal */
      StaticReflector.prototype.simplify = function (context, value) {
          var _this = this;
          var self = this;
          var scope = BindingScope.empty;
          var calling = new Map();
          function simplifyInContext(context, value, depth) {
              function resolveReferenceValue(staticSymbol) {
                  var resolvedSymbol = self.symbolResolver.resolveSymbol(staticSymbol);
                  return resolvedSymbol ? resolvedSymbol.metadata : null;
              }
              function simplifyCall(functionSymbol, targetFunction, args) {
                  if (targetFunction && targetFunction['__symbolic'] == 'function') {
                      if (calling.get(functionSymbol)) {
                          throw new Error('Recursion not supported');
                      }
                      calling.set(functionSymbol, true);
                      try {
                          var value_1 = targetFunction['value'];
                          if (value_1 && (depth != 0 || value_1.__symbolic != 'error')) {
                              var parameters = targetFunction['parameters'];
                              var defaults = targetFunction.defaults;
                              args = args.map(function (arg) { return simplifyInContext(context, arg, depth + 1); })
                                  .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                              if (defaults && defaults.length > args.length) {
                                  args.push.apply(args, defaults.slice(args.length).map(function (value) { return simplify(value); }));
                              }
                              var functionScope = BindingScope.build();
                              for (var i = 0; i < parameters.length; i++) {
                                  functionScope.define(parameters[i], args[i]);
                              }
                              var oldScope = scope;
                              var result_1;
                              try {
                                  scope = functionScope.done();
                                  result_1 = simplifyInContext(functionSymbol, value_1, depth + 1);
                              }
                              finally {
                                  scope = oldScope;
                              }
                              return result_1;
                          }
                      }
                      finally {
                          calling.delete(functionSymbol);
                      }
                  }
                  if (depth === 0) {
                      // If depth is 0 we are evaluating the top level expression that is describing element
                      // decorator. In this case, it is a decorator we don't understand, such as a custom
                      // non-angular decorator, and we should just ignore it.
                      return IGNORE;
                  }
                  return simplify({ __symbolic: 'error', message: 'Function call not supported', context: functionSymbol });
              }
              function simplify(expression) {
                  if (isPrimitive(expression)) {
                      return expression;
                  }
                  if (expression instanceof Array) {
                      var result_2 = [];
                      for (var _i = 0, _a = expression; _i < _a.length; _i++) {
                          var item = _a[_i];
                          // Check for a spread expression
                          if (item && item.__symbolic === 'spread') {
                              var spreadArray = simplify(item.expression);
                              if (Array.isArray(spreadArray)) {
                                  for (var _b = 0, spreadArray_1 = spreadArray; _b < spreadArray_1.length; _b++) {
                                      var spreadItem = spreadArray_1[_b];
                                      result_2.push(spreadItem);
                                  }
                                  continue;
                              }
                          }
                          var value_2 = simplify(item);
                          if (shouldIgnore(value_2)) {
                              continue;
                          }
                          result_2.push(value_2);
                      }
                      return result_2;
                  }
                  if (expression instanceof StaticSymbol) {
                      // Stop simplification at builtin symbols
                      if (expression === self.injectionToken || expression === self.opaqueToken ||
                          self.conversionMap.has(expression)) {
                          return expression;
                      }
                      else {
                          var staticSymbol = expression;
                          var declarationValue = resolveReferenceValue(staticSymbol);
                          if (declarationValue) {
                              return simplifyInContext(staticSymbol, declarationValue, depth + 1);
                          }
                          else {
                              return staticSymbol;
                          }
                      }
                  }
                  if (expression) {
                      if (expression['__symbolic']) {
                          var staticSymbol = void 0;
                          switch (expression['__symbolic']) {
                              case 'binop':
                                  var left = simplify(expression['left']);
                                  if (shouldIgnore(left))
                                      return left;
                                  var right = simplify(expression['right']);
                                  if (shouldIgnore(right))
                                      return right;
                                  switch (expression['operator']) {
                                      case '&&':
                                          return left && right;
                                      case '||':
                                          return left || right;
                                      case '|':
                                          return left | right;
                                      case '^':
                                          return left ^ right;
                                      case '&':
                                          return left & right;
                                      case '==':
                                          return left == right;
                                      case '!=':
                                          return left != right;
                                      case '===':
                                          return left === right;
                                      case '!==':
                                          return left !== right;
                                      case '<':
                                          return left < right;
                                      case '>':
                                          return left > right;
                                      case '<=':
                                          return left <= right;
                                      case '>=':
                                          return left >= right;
                                      case '<<':
                                          return left << right;
                                      case '>>':
                                          return left >> right;
                                      case '+':
                                          return left + right;
                                      case '-':
                                          return left - right;
                                      case '*':
                                          return left * right;
                                      case '/':
                                          return left / right;
                                      case '%':
                                          return left % right;
                                  }
                                  return null;
                              case 'if':
                                  var condition = simplify(expression['condition']);
                                  return condition ? simplify(expression['thenExpression']) :
                                      simplify(expression['elseExpression']);
                              case 'pre':
                                  var operand = simplify(expression['operand']);
                                  if (shouldIgnore(operand))
                                      return operand;
                                  switch (expression['operator']) {
                                      case '+':
                                          return operand;
                                      case '-':
                                          return -operand;
                                      case '!':
                                          return !operand;
                                      case '~':
                                          return ~operand;
                                  }
                                  return null;
                              case 'index':
                                  var indexTarget = simplify(expression['expression']);
                                  var index = simplify(expression['index']);
                                  if (indexTarget && isPrimitive(index))
                                      return indexTarget[index];
                                  return null;
                              case 'select':
                                  var member = expression['member'];
                                  var selectContext = context;
                                  var selectTarget = simplify(expression['expression']);
                                  if (selectTarget instanceof StaticSymbol) {
                                      var members = selectTarget.members.concat(member);
                                      selectContext =
                                          self.getStaticSymbol(selectTarget.filePath, selectTarget.name, members);
                                      var declarationValue = resolveReferenceValue(selectContext);
                                      if (declarationValue) {
                                          return simplifyInContext(selectContext, declarationValue, depth + 1);
                                      }
                                      else {
                                          return selectContext;
                                      }
                                  }
                                  if (selectTarget && isPrimitive(member))
                                      return simplifyInContext(selectContext, selectTarget[member], depth + 1);
                                  return null;
                              case 'reference':
                                  // Note: This only has to deal with variable references,
                                  // as symbol references have been converted into StaticSymbols already
                                  // in the StaticSymbolResolver!
                                  var name_1 = expression['name'];
                                  var localValue = scope.resolve(name_1);
                                  if (localValue != BindingScope.missing) {
                                      return localValue;
                                  }
                                  break;
                              case 'class':
                                  return context;
                              case 'function':
                                  return context;
                              case 'new':
                              case 'call':
                                  // Determine if the function is a built-in conversion
                                  staticSymbol = simplifyInContext(context, expression['expression'], depth + 1);
                                  if (staticSymbol instanceof StaticSymbol) {
                                      if (staticSymbol === self.injectionToken || staticSymbol === self.opaqueToken) {
                                          // if somebody calls new InjectionToken, don't create an InjectionToken,
                                          // but rather return the symbol to which the InjectionToken is assigned to.
                                          return context;
                                      }
                                      var argExpressions = expression['arguments'] || [];
                                      var converter = self.conversionMap.get(staticSymbol);
                                      if (converter) {
                                          var args = argExpressions.map(function (arg) { return simplifyInContext(context, arg, depth + 1); })
                                              .map(function (arg) { return shouldIgnore(arg) ? undefined : arg; });
                                          return converter(context, args);
                                      }
                                      else {
                                          // Determine if the function is one we can simplify.
                                          var targetFunction = resolveReferenceValue(staticSymbol);
                                          return simplifyCall(staticSymbol, targetFunction, argExpressions);
                                      }
                                  }
                                  break;
                              case 'error':
                                  var message = produceErrorMessage(expression);
                                  if (expression['line']) {
                                      message =
                                          message + " (position " + (expression['line'] + 1) + ":" + (expression['character'] + 1) + " in the original .ts file)";
                                      self.reportError(positionalError(message, context.filePath, expression['line'], expression['character']), context);
                                  }
                                  else {
                                      self.reportError(new Error(message), context);
                                  }
                                  return IGNORE;
                              case 'ignore':
                                  return expression;
                          }
                          return null;
                      }
                      return mapStringMap(expression, function (value, name) { return simplify(value); });
                  }
                  return IGNORE;
              }
              try {
                  return simplify(value);
              }
              catch (e) {
                  var members = context.members.length ? "." + context.members.join('.') : '';
                  var message = e.message + ", resolving symbol " + context.name + members + " in " + context.filePath;
                  if (e.fileName) {
                      throw positionalError(message, e.fileName, e.line, e.column);
                  }
                  throw syntaxError(message);
              }
          }
          var recordedSimplifyInContext = function (context, value, depth) {
              try {
                  return simplifyInContext(context, value, depth);
              }
              catch (e) {
                  _this.reportError(e, context);
              }
          };
          var result = this.errorRecorder ? recordedSimplifyInContext(context, value, 0) :
              simplifyInContext(context, value, 0);
          if (shouldIgnore(result)) {
              return undefined;
          }
          return result;
      };
      StaticReflector.prototype.getTypeMetadata = function (type) {
          var resolvedSymbol = this.symbolResolver.resolveSymbol(type);
          return resolvedSymbol && resolvedSymbol.metadata ? resolvedSymbol.metadata :
              { __symbolic: 'class' };
      };
      return StaticReflector;
  }());
  function expandedMessage(error) {
      switch (error.message) {
          case 'Reference to non-exported class':
              if (error.context && error.context.className) {
                  return "Reference to a non-exported class " + error.context.className + ". Consider exporting the class";
              }
              break;
          case 'Variable not initialized':
              return 'Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler';
          case 'Destructuring not supported':
              return 'Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring';
          case 'Could not resolve type':
              if (error.context && error.context.typeName) {
                  return "Could not resolve type " + error.context.typeName;
              }
              break;
          case 'Function call not supported':
              var prefix = error.context && error.context.name ? "Calling function '" + error.context.name + "', f" : 'F';
              return prefix +
                  'unction calls are not supported. Consider replacing the function or lambda with a reference to an exported function';
          case 'Reference to a local symbol':
              if (error.context && error.context.name) {
                  return "Reference to a local (non-exported) symbol '" + error.context.name + "'. Consider exporting the symbol";
              }
              break;
      }
      return error.message;
  }
  function produceErrorMessage(error) {
      return "Error encountered resolving symbol values statically. " + expandedMessage(error);
  }
  function mapStringMap(input, transform) {
      if (!input)
          return {};
      var result = {};
      Object.keys(input).forEach(function (key) {
          var value = transform(input[key], key);
          if (!shouldIgnore(value)) {
              if (HIDDEN_KEY.test(key)) {
                  Object.defineProperty(result, key, { enumerable: false, configurable: true, value: value });
              }
              else {
                  result[key] = value;
              }
          }
      });
      return result;
  }
  function isPrimitive(o) {
      return o === null || (typeof o !== 'function' && typeof o !== 'object');
  }
  var BindingScope = (function () {
      function BindingScope() {
      }
      BindingScope.build = function () {
          var current = new Map();
          return {
              define: function (name, value) {
                  current.set(name, value);
                  return this;
              },
              done: function () {
                  return current.size > 0 ? new PopulatedScope(current) : BindingScope.empty;
              }
          };
      };
      return BindingScope;
  }());
  BindingScope.missing = {};
  BindingScope.empty = { resolve: function (name) { return BindingScope.missing; } };
  var PopulatedScope = (function (_super) {
      __extends$23(PopulatedScope, _super);
      function PopulatedScope(bindings) {
          var _this = _super.call(this) || this;
          _this.bindings = bindings;
          return _this;
      }
      PopulatedScope.prototype.resolve = function (name) {
          return this.bindings.has(name) ? this.bindings.get(name) : BindingScope.missing;
      };
      return PopulatedScope;
  }(BindingScope));
  function positionalError(message, fileName, line, column) {
      var result = new Error(message);
      result.fileName = fileName;
      result.line = line;
      result.column = column;
      return result;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$24 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ResolvedStaticSymbol = (function () {
      function ResolvedStaticSymbol(symbol, metadata) {
          this.symbol = symbol;
          this.metadata = metadata;
      }
      return ResolvedStaticSymbol;
  }());
  var SUPPORTED_SCHEMA_VERSION = 3;
  /**
   * This class is responsible for loading metadata per symbol,
   * and normalizing references between symbols.
   *
   * Internally, it only uses symbols without members,
   * and deduces the values for symbols with members based
   * on these symbols.
   */
  var StaticSymbolResolver = (function () {
      function StaticSymbolResolver(host, staticSymbolCache, summaryResolver, errorRecorder) {
          this.host = host;
          this.staticSymbolCache = staticSymbolCache;
          this.summaryResolver = summaryResolver;
          this.errorRecorder = errorRecorder;
          this.metadataCache = new Map();
          // Note: this will only contain StaticSymbols without members!
          this.resolvedSymbols = new Map();
          this.resolvedFilePaths = new Set();
          // Note: this will only contain StaticSymbols without members!
          this.importAs = new Map();
      }
      StaticSymbolResolver.prototype.resolveSymbol = function (staticSymbol) {
          if (staticSymbol.members.length > 0) {
              return this._resolveSymbolMembers(staticSymbol);
          }
          var result = this.resolvedSymbols.get(staticSymbol);
          if (result) {
              return result;
          }
          result = this._resolveSymbolFromSummary(staticSymbol);
          if (result) {
              return result;
          }
          // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
          // have summaries, only .d.ts files. So we always need to check both, the summary
          // and metadata.
          this._createSymbolsOf(staticSymbol.filePath);
          result = this.resolvedSymbols.get(staticSymbol);
          return result;
      };
      /**
       * getImportAs produces a symbol that can be used to import the given symbol.
       * The import might be different than the symbol if the symbol is exported from
       * a library with a summary; in which case we want to import the symbol from the
       * ngfactory re-export instead of directly to avoid introducing a direct dependency
       * on an otherwise indirect dependency.
       *
       * @param staticSymbol the symbol for which to generate a import symbol
       */
      StaticSymbolResolver.prototype.getImportAs = function (staticSymbol) {
          if (staticSymbol.members.length) {
              var baseSymbol = this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name);
              var baseImportAs = this.getImportAs(baseSymbol);
              return baseImportAs ?
                  this.getStaticSymbol(baseImportAs.filePath, baseImportAs.name, staticSymbol.members) :
                  null;
          }
          var result = this.summaryResolver.getImportAs(staticSymbol);
          if (!result) {
              result = this.importAs.get(staticSymbol);
          }
          return result;
      };
      /**
       * getTypeArity returns the number of generic type parameters the given symbol
       * has. If the symbol is not a type the result is null.
       */
      StaticSymbolResolver.prototype.getTypeArity = function (staticSymbol) {
          // If the file is a factory file, don't resolve the symbol as doing so would
          // cause the metadata for an factory file to be loaded which doesn't exist.
          // All references to generated classes must include the correct arity whenever
          // generating code.
          if (isNgFactoryFile(staticSymbol.filePath)) {
              return null;
          }
          var resolvedSymbol = this.resolveSymbol(staticSymbol);
          while (resolvedSymbol && resolvedSymbol.metadata instanceof StaticSymbol) {
              resolvedSymbol = this.resolveSymbol(resolvedSymbol.metadata);
          }
          return (resolvedSymbol && resolvedSymbol.metadata && resolvedSymbol.metadata.arity) || null;
      };
      StaticSymbolResolver.prototype.recordImportAs = function (sourceSymbol, targetSymbol) {
          sourceSymbol.assertNoMembers();
          targetSymbol.assertNoMembers();
          this.importAs.set(sourceSymbol, targetSymbol);
      };
      StaticSymbolResolver.prototype._resolveSymbolMembers = function (staticSymbol) {
          var members = staticSymbol.members;
          var baseResolvedSymbol = this.resolveSymbol(this.getStaticSymbol(staticSymbol.filePath, staticSymbol.name));
          if (!baseResolvedSymbol) {
              return null;
          }
          var baseMetadata = baseResolvedSymbol.metadata;
          if (baseMetadata instanceof StaticSymbol) {
              return new ResolvedStaticSymbol(staticSymbol, this.getStaticSymbol(baseMetadata.filePath, baseMetadata.name, members));
          }
          else if (baseMetadata && baseMetadata.__symbolic === 'class') {
              if (baseMetadata.statics && members.length === 1) {
                  return new ResolvedStaticSymbol(staticSymbol, baseMetadata.statics[members[0]]);
              }
          }
          else {
              var value = baseMetadata;
              for (var i = 0; i < members.length && value; i++) {
                  value = value[members[i]];
              }
              return new ResolvedStaticSymbol(staticSymbol, value);
          }
          return null;
      };
      StaticSymbolResolver.prototype._resolveSymbolFromSummary = function (staticSymbol) {
          var summary = this.summaryResolver.resolveSummary(staticSymbol);
          return summary ? new ResolvedStaticSymbol(staticSymbol, summary.metadata) : null;
      };
      /**
       * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
       * All types passed to the StaticResolver should be pseudo-types returned by this method.
       *
       * @param declarationFile the absolute path of the file where the symbol is declared
       * @param name the name of the type.
       * @param members a symbol for a static member of the named type
       */
      StaticSymbolResolver.prototype.getStaticSymbol = function (declarationFile, name, members) {
          return this.staticSymbolCache.get(declarationFile, name, members);
      };
      StaticSymbolResolver.prototype.getSymbolsOf = function (filePath) {
          // Note: Some users use libraries that were not compiled with ngc, i.e. they don't
          // have summaries, only .d.ts files. So we always need to check both, the summary
          // and metadata.
          var symbols = new Set(this.summaryResolver.getSymbolsOf(filePath));
          this._createSymbolsOf(filePath);
          this.resolvedSymbols.forEach(function (resolvedSymbol) {
              if (resolvedSymbol.symbol.filePath === filePath) {
                  symbols.add(resolvedSymbol.symbol);
              }
          });
          return Array.from(symbols);
      };
      StaticSymbolResolver.prototype._createSymbolsOf = function (filePath) {
          var _this = this;
          if (this.resolvedFilePaths.has(filePath)) {
              return;
          }
          this.resolvedFilePaths.add(filePath);
          var resolvedSymbols = [];
          var metadata = this.getModuleMetadata(filePath);
          if (metadata['metadata']) {
              // handle direct declarations of the symbol
              var topLevelSymbolNames_1 = new Set(Object.keys(metadata['metadata']).map(unescapeIdentifier));
              Object.keys(metadata['metadata']).forEach(function (metadataKey) {
                  var symbolMeta = metadata['metadata'][metadataKey];
                  var name = unescapeIdentifier(metadataKey);
                  var canonicalSymbol = _this.getStaticSymbol(filePath, name);
                  if (metadata['importAs']) {
                      // Index bundle indexes should use the importAs module name instead of a reference
                      // to the .d.ts file directly.
                      var importSymbol = _this.getStaticSymbol(metadata['importAs'], name);
                      _this.recordImportAs(canonicalSymbol, importSymbol);
                  }
                  resolvedSymbols.push(_this.createResolvedSymbol(canonicalSymbol, topLevelSymbolNames_1, symbolMeta));
              });
          }
          // handle the symbols in one of the re-export location
          if (metadata['exports']) {
              var _loop_1 = function (moduleExport) {
                  // handle the symbols in the list of explicitly re-exported symbols.
                  if (moduleExport.export) {
                      moduleExport.export.forEach(function (exportSymbol) {
                          var symbolName;
                          if (typeof exportSymbol === 'string') {
                              symbolName = exportSymbol;
                          }
                          else {
                              symbolName = exportSymbol.as;
                          }
                          symbolName = unescapeIdentifier(symbolName);
                          var symName = symbolName;
                          if (typeof exportSymbol !== 'string') {
                              symName = unescapeIdentifier(exportSymbol.name);
                          }
                          var resolvedModule = _this.resolveModule(moduleExport.from, filePath);
                          if (resolvedModule) {
                              var targetSymbol = _this.getStaticSymbol(resolvedModule, symName);
                              var sourceSymbol = _this.getStaticSymbol(filePath, symbolName);
                              resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                          }
                      });
                  }
                  else {
                      // handle the symbols via export * directives.
                      var resolvedModule = this_1.resolveModule(moduleExport.from, filePath);
                      if (resolvedModule) {
                          var nestedExports = this_1.getSymbolsOf(resolvedModule);
                          nestedExports.forEach(function (targetSymbol) {
                              var sourceSymbol = _this.getStaticSymbol(filePath, targetSymbol.name);
                              resolvedSymbols.push(_this.createExport(sourceSymbol, targetSymbol));
                          });
                      }
                  }
              };
              var this_1 = this;
              for (var _i = 0, _a = metadata['exports']; _i < _a.length; _i++) {
                  var moduleExport = _a[_i];
                  _loop_1(moduleExport);
              }
          }
          resolvedSymbols.forEach(function (resolvedSymbol) { return _this.resolvedSymbols.set(resolvedSymbol.symbol, resolvedSymbol); });
      };
      StaticSymbolResolver.prototype.createResolvedSymbol = function (sourceSymbol, topLevelSymbolNames, metadata) {
          var self = this;
          var ReferenceTransformer = (function (_super) {
              __extends$24(ReferenceTransformer, _super);
              function ReferenceTransformer() {
                  return _super !== null && _super.apply(this, arguments) || this;
              }
              ReferenceTransformer.prototype.visitStringMap = function (map, functionParams) {
                  var symbolic = map['__symbolic'];
                  if (symbolic === 'function') {
                      var oldLen = functionParams.length;
                      functionParams.push.apply(functionParams, (map['parameters'] || []));
                      var result = _super.prototype.visitStringMap.call(this, map, functionParams);
                      functionParams.length = oldLen;
                      return result;
                  }
                  else if (symbolic === 'reference') {
                      var module = map['module'];
                      var name_1 = map['name'] ? unescapeIdentifier(map['name']) : map['name'];
                      if (!name_1) {
                          return null;
                      }
                      var filePath = void 0;
                      if (module) {
                          filePath = self.resolveModule(module, sourceSymbol.filePath);
                          if (!filePath) {
                              return {
                                  __symbolic: 'error',
                                  message: "Could not resolve " + module + " relative to " + sourceSymbol.filePath + "."
                              };
                          }
                          return self.getStaticSymbol(filePath, name_1);
                      }
                      else if (functionParams.indexOf(name_1) >= 0) {
                          // reference to a function parameter
                          return { __symbolic: 'reference', name: name_1 };
                      }
                      else {
                          if (topLevelSymbolNames.has(name_1)) {
                              return self.getStaticSymbol(sourceSymbol.filePath, name_1);
                          }
                          // ambient value
                          null;
                      }
                  }
                  else {
                      return _super.prototype.visitStringMap.call(this, map, functionParams);
                  }
              };
              return ReferenceTransformer;
          }(ValueTransformer));
          var transformedMeta = visitValue(metadata, new ReferenceTransformer(), []);
          if (transformedMeta instanceof StaticSymbol) {
              return this.createExport(sourceSymbol, transformedMeta);
          }
          return new ResolvedStaticSymbol(sourceSymbol, transformedMeta);
      };
      StaticSymbolResolver.prototype.createExport = function (sourceSymbol, targetSymbol) {
          sourceSymbol.assertNoMembers();
          targetSymbol.assertNoMembers();
          if (this.summaryResolver.isLibraryFile(sourceSymbol.filePath)) {
              // This case is for an ng library importing symbols from a plain ts library
              // transitively.
              // Note: We rely on the fact that we discover symbols in the direction
              // from source files to library files
              this.importAs.set(targetSymbol, this.getImportAs(sourceSymbol) || sourceSymbol);
          }
          return new ResolvedStaticSymbol(sourceSymbol, targetSymbol);
      };
      StaticSymbolResolver.prototype.reportError = function (error, context, path) {
          if (this.errorRecorder) {
              this.errorRecorder(error, (context && context.filePath) || path);
          }
          else {
              throw error;
          }
      };
      /**
       * @param module an absolute path to a module file.
       */
      StaticSymbolResolver.prototype.getModuleMetadata = function (module) {
          var moduleMetadata = this.metadataCache.get(module);
          if (!moduleMetadata) {
              var moduleMetadatas = this.host.getMetadataFor(module);
              if (moduleMetadatas) {
                  var maxVersion_1 = -1;
                  moduleMetadatas.forEach(function (md) {
                      if (md['version'] > maxVersion_1) {
                          maxVersion_1 = md['version'];
                          moduleMetadata = md;
                      }
                  });
              }
              if (!moduleMetadata) {
                  moduleMetadata =
                      { __symbolic: 'module', version: SUPPORTED_SCHEMA_VERSION, module: module, metadata: {} };
              }
              if (moduleMetadata['version'] != SUPPORTED_SCHEMA_VERSION) {
                  var errorMessage = moduleMetadata['version'] == 2 ?
                      "Unsupported metadata version " + moduleMetadata['version'] + " for module " + module + ". This module should be compiled with a newer version of ngc" :
                      "Metadata version mismatch for module " + module + ", found version " + moduleMetadata['version'] + ", expected " + SUPPORTED_SCHEMA_VERSION;
                  this.reportError(new Error(errorMessage), null);
              }
              this.metadataCache.set(module, moduleMetadata);
          }
          return moduleMetadata;
      };
      StaticSymbolResolver.prototype.getSymbolByModule = function (module, symbolName, containingFile) {
          var filePath = this.resolveModule(module, containingFile);
          if (!filePath) {
              this.reportError(new Error("Could not resolve module " + module + (containingFile ? " relative to $ {\n            containingFile\n          } " : '')), null);
              return this.getStaticSymbol("ERROR:" + module, symbolName);
          }
          return this.getStaticSymbol(filePath, symbolName);
      };
      StaticSymbolResolver.prototype.resolveModule = function (module, containingFile) {
          try {
              return this.host.moduleNameToFileName(module, containingFile);
          }
          catch (e) {
              console.error("Could not resolve module '" + module + "' relative to file " + containingFile);
              this.reportError(e, null, containingFile);
          }
      };
      return StaticSymbolResolver;
  }());
  // Remove extra underscore from escaped identifier.
  // See https://github.com/Microsoft/TypeScript/blob/master/src/compiler/utilities.ts
  function unescapeIdentifier(identifier) {
      return identifier.startsWith('___') ? identifier.substr(1) : identifier;
  }

  var AotSummaryResolver = (function () {
      function AotSummaryResolver(host, staticSymbolCache) {
          this.host = host;
          this.staticSymbolCache = staticSymbolCache;
          // Note: this will only contain StaticSymbols without members!
          this.summaryCache = new Map();
          this.loadedFilePaths = new Set();
          // Note: this will only contain StaticSymbols without members!
          this.importAs = new Map();
      }
      AotSummaryResolver.prototype.isLibraryFile = function (filePath) {
          // Note: We need to strip the .ngfactory. file path,
          // so this method also works for generated files
          // (for which host.isSourceFile will always return false).
          return !this.host.isSourceFile(stripNgFactory(filePath));
      };
      AotSummaryResolver.prototype.getLibraryFileName = function (filePath) { return this.host.getOutputFileName(filePath); };
      AotSummaryResolver.prototype.resolveSummary = function (staticSymbol) {
          staticSymbol.assertNoMembers();
          var summary = this.summaryCache.get(staticSymbol);
          if (!summary) {
              this._loadSummaryFile(staticSymbol.filePath);
              summary = this.summaryCache.get(staticSymbol);
          }
          return summary;
      };
      AotSummaryResolver.prototype.getSymbolsOf = function (filePath) {
          this._loadSummaryFile(filePath);
          return Array.from(this.summaryCache.keys()).filter(function (symbol) { return symbol.filePath === filePath; });
      };
      AotSummaryResolver.prototype.getImportAs = function (staticSymbol) {
          staticSymbol.assertNoMembers();
          return this.importAs.get(staticSymbol);
      };
      AotSummaryResolver.prototype._loadSummaryFile = function (filePath) {
          var _this = this;
          if (this.loadedFilePaths.has(filePath)) {
              return;
          }
          this.loadedFilePaths.add(filePath);
          if (this.isLibraryFile(filePath)) {
              var summaryFilePath = summaryFileName(filePath);
              var json = void 0;
              try {
                  json = this.host.loadSummary(summaryFilePath);
              }
              catch (e) {
                  console.error("Error loading summary file " + summaryFilePath);
                  throw e;
              }
              if (json) {
                  var _a = deserializeSummaries(this.staticSymbolCache, json), summaries = _a.summaries, importAs = _a.importAs;
                  summaries.forEach(function (summary) { return _this.summaryCache.set(summary.symbol, summary); });
                  importAs.forEach(function (importAs) {
                      _this.importAs.set(importAs.symbol, _this.staticSymbolCache.get(ngfactoryFilePath(filePath), importAs.importAs));
                  });
              }
          }
      };
      return AotSummaryResolver;
  }());

  /**
   * Creates a new AotCompiler based on options and a host.
   */
  function createAotCompiler(compilerHost, options) {
      var translations = options.translations || '';
      var urlResolver = createOfflineCompileUrlResolver();
      var symbolCache = new StaticSymbolCache();
      var summaryResolver = new AotSummaryResolver(compilerHost, symbolCache);
      var symbolResolver = new StaticSymbolResolver(compilerHost, symbolCache, summaryResolver);
      var staticReflector = new StaticReflector(symbolResolver);
      StaticAndDynamicReflectionCapabilities.install(staticReflector);
      var console = new _angular_core.ɵConsole();
      var htmlParser = new I18NHtmlParser(new HtmlParser(), translations, options.i18nFormat, _angular_core.MissingTranslationStrategy.Warning, console);
      var config = new CompilerConfig({
          defaultEncapsulation: _angular_core.ViewEncapsulation.Emulated,
          useJit: false,
          enableLegacyTemplate: options.enableLegacyTemplate !== false,
      });
      var normalizer = new DirectiveNormalizer({ get: function (url) { return compilerHost.loadResource(url); } }, urlResolver, htmlParser, config);
      var expressionParser = new Parser(new Lexer());
      var elementSchemaRegistry = new DomElementSchemaRegistry();
      var tmplParser = new TemplateParser(config, expressionParser, elementSchemaRegistry, htmlParser, console, []);
      var resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, symbolCache, staticReflector);
      // TODO(vicb): do not pass options.i18nFormat here
      var importResolver = {
          getImportAs: function (symbol) { return symbolResolver.getImportAs(symbol); },
          fileNameToModuleName: function (fileName, containingFilePath) {
              return compilerHost.fileNameToModuleName(fileName, containingFilePath);
          },
          getTypeArity: function (symbol) { return symbolResolver.getTypeArity(symbol); }
      };
      var viewCompiler = new ViewCompiler(config, elementSchemaRegistry);
      var compiler = new AotCompiler(config, compilerHost, resolver, tmplParser, new StyleCompiler(urlResolver), viewCompiler, new NgModuleCompiler(), new TypeScriptEmitter(importResolver), summaryResolver, options.locale, options.i18nFormat, symbolResolver);
      return { compiler: compiler, reflector: staticReflector };
  }

  function interpretStatements(statements, resultVars) {
      var stmtsWithReturn = statements.concat([new ReturnStatement(literalArr(resultVars.map(function (resultVar) { return variable(resultVar); })))]);
      var ctx = new _ExecutionContext(null, null, null, new Map());
      var visitor = new StatementInterpreter();
      var result = visitor.visitAllStatements(stmtsWithReturn, ctx);
      return result != null ? result.value : null;
  }
  function _executeFunctionStatements(varNames, varValues, statements, ctx, visitor) {
      var childCtx = ctx.createChildWihtLocalVars();
      for (var i = 0; i < varNames.length; i++) {
          childCtx.vars.set(varNames[i], varValues[i]);
      }
      var result = visitor.visitAllStatements(statements, childCtx);
      return result ? result.value : null;
  }
  var _ExecutionContext = (function () {
      function _ExecutionContext(parent, instance, className, vars) {
          this.parent = parent;
          this.instance = instance;
          this.className = className;
          this.vars = vars;
      }
      _ExecutionContext.prototype.createChildWihtLocalVars = function () {
          return new _ExecutionContext(this, this.instance, this.className, new Map());
      };
      return _ExecutionContext;
  }());
  var ReturnValue = (function () {
      function ReturnValue(value) {
          this.value = value;
      }
      return ReturnValue;
  }());
  function createDynamicClass(_classStmt, _ctx, _visitor) {
      var propertyDescriptors = {};
      _classStmt.getters.forEach(function (getter) {
          // Note: use `function` instead of arrow function to capture `this`
          propertyDescriptors[getter.name] = {
              configurable: false,
              get: function () {
                  var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                  return _executeFunctionStatements([], [], getter.body, instanceCtx, _visitor);
              }
          };
      });
      _classStmt.methods.forEach(function (method) {
          var paramNames = method.params.map(function (param) { return param.name; });
          // Note: use `function` instead of arrow function to capture `this`
          propertyDescriptors[method.name] = {
              writable: false,
              configurable: false,
              value: function () {
                  var args = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                  }
                  var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
                  return _executeFunctionStatements(paramNames, args, method.body, instanceCtx, _visitor);
              }
          };
      });
      var ctorParamNames = _classStmt.constructorMethod.params.map(function (param) { return param.name; });
      // Note: use `function` instead of arrow function to capture `this`
      var ctor = function () {
          var _this = this;
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          var instanceCtx = new _ExecutionContext(_ctx, this, _classStmt.name, _ctx.vars);
          _classStmt.fields.forEach(function (field) { _this[field.name] = undefined; });
          _executeFunctionStatements(ctorParamNames, args, _classStmt.constructorMethod.body, instanceCtx, _visitor);
      };
      var superClass = _classStmt.parent ? _classStmt.parent.visitExpression(_visitor, _ctx) : Object;
      ctor.prototype = Object.create(superClass.prototype, propertyDescriptors);
      return ctor;
  }
  var StatementInterpreter = (function () {
      function StatementInterpreter() {
      }
      StatementInterpreter.prototype.debugAst = function (ast) { return debugOutputAstAsTypeScript(ast); };
      StatementInterpreter.prototype.visitDeclareVarStmt = function (stmt, ctx) {
          ctx.vars.set(stmt.name, stmt.value.visitExpression(this, ctx));
          return null;
      };
      StatementInterpreter.prototype.visitWriteVarExpr = function (expr, ctx) {
          var value = expr.value.visitExpression(this, ctx);
          var currCtx = ctx;
          while (currCtx != null) {
              if (currCtx.vars.has(expr.name)) {
                  currCtx.vars.set(expr.name, value);
                  return value;
              }
              currCtx = currCtx.parent;
          }
          throw new Error("Not declared variable " + expr.name);
      };
      StatementInterpreter.prototype.visitReadVarExpr = function (ast, ctx) {
          var varName = ast.name;
          if (ast.builtin != null) {
              switch (ast.builtin) {
                  case BuiltinVar.Super:
                      return ctx.instance.__proto__;
                  case BuiltinVar.This:
                      return ctx.instance;
                  case BuiltinVar.CatchError:
                      varName = CATCH_ERROR_VAR$2;
                      break;
                  case BuiltinVar.CatchStack:
                      varName = CATCH_STACK_VAR$2;
                      break;
                  default:
                      throw new Error("Unknown builtin variable " + ast.builtin);
              }
          }
          var currCtx = ctx;
          while (currCtx != null) {
              if (currCtx.vars.has(varName)) {
                  return currCtx.vars.get(varName);
              }
              currCtx = currCtx.parent;
          }
          throw new Error("Not declared variable " + varName);
      };
      StatementInterpreter.prototype.visitWriteKeyExpr = function (expr, ctx) {
          var receiver = expr.receiver.visitExpression(this, ctx);
          var index = expr.index.visitExpression(this, ctx);
          var value = expr.value.visitExpression(this, ctx);
          receiver[index] = value;
          return value;
      };
      StatementInterpreter.prototype.visitWritePropExpr = function (expr, ctx) {
          var receiver = expr.receiver.visitExpression(this, ctx);
          var value = expr.value.visitExpression(this, ctx);
          receiver[expr.name] = value;
          return value;
      };
      StatementInterpreter.prototype.visitInvokeMethodExpr = function (expr, ctx) {
          var receiver = expr.receiver.visitExpression(this, ctx);
          var args = this.visitAllExpressions(expr.args, ctx);
          var result;
          if (expr.builtin != null) {
              switch (expr.builtin) {
                  case BuiltinMethod.ConcatArray:
                      result = receiver.concat.apply(receiver, args);
                      break;
                  case BuiltinMethod.SubscribeObservable:
                      result = receiver.subscribe({ next: args[0] });
                      break;
                  case BuiltinMethod.Bind:
                      result = receiver.bind.apply(receiver, args);
                      break;
                  default:
                      throw new Error("Unknown builtin method " + expr.builtin);
              }
          }
          else {
              result = receiver[expr.name].apply(receiver, args);
          }
          return result;
      };
      StatementInterpreter.prototype.visitInvokeFunctionExpr = function (stmt, ctx) {
          var args = this.visitAllExpressions(stmt.args, ctx);
          var fnExpr = stmt.fn;
          if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
              ctx.instance.constructor.prototype.constructor.apply(ctx.instance, args);
              return null;
          }
          else {
              var fn = stmt.fn.visitExpression(this, ctx);
              return fn.apply(null, args);
          }
      };
      StatementInterpreter.prototype.visitReturnStmt = function (stmt, ctx) {
          return new ReturnValue(stmt.value.visitExpression(this, ctx));
      };
      StatementInterpreter.prototype.visitDeclareClassStmt = function (stmt, ctx) {
          var clazz = createDynamicClass(stmt, ctx, this);
          ctx.vars.set(stmt.name, clazz);
          return null;
      };
      StatementInterpreter.prototype.visitExpressionStmt = function (stmt, ctx) {
          return stmt.expr.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitIfStmt = function (stmt, ctx) {
          var condition = stmt.condition.visitExpression(this, ctx);
          if (condition) {
              return this.visitAllStatements(stmt.trueCase, ctx);
          }
          else if (stmt.falseCase != null) {
              return this.visitAllStatements(stmt.falseCase, ctx);
          }
          return null;
      };
      StatementInterpreter.prototype.visitTryCatchStmt = function (stmt, ctx) {
          try {
              return this.visitAllStatements(stmt.bodyStmts, ctx);
          }
          catch (e) {
              var childCtx = ctx.createChildWihtLocalVars();
              childCtx.vars.set(CATCH_ERROR_VAR$2, e);
              childCtx.vars.set(CATCH_STACK_VAR$2, e.stack);
              return this.visitAllStatements(stmt.catchStmts, childCtx);
          }
      };
      StatementInterpreter.prototype.visitThrowStmt = function (stmt, ctx) {
          throw stmt.error.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitCommentStmt = function (stmt, context) { return null; };
      StatementInterpreter.prototype.visitInstantiateExpr = function (ast, ctx) {
          var args = this.visitAllExpressions(ast.args, ctx);
          var clazz = ast.classExpr.visitExpression(this, ctx);
          return new (clazz.bind.apply(clazz, [void 0].concat(args)))();
      };
      StatementInterpreter.prototype.visitLiteralExpr = function (ast, ctx) { return ast.value; };
      StatementInterpreter.prototype.visitExternalExpr = function (ast, ctx) {
          return ast.value.reference;
      };
      StatementInterpreter.prototype.visitConditionalExpr = function (ast, ctx) {
          if (ast.condition.visitExpression(this, ctx)) {
              return ast.trueCase.visitExpression(this, ctx);
          }
          else if (ast.falseCase != null) {
              return ast.falseCase.visitExpression(this, ctx);
          }
          return null;
      };
      StatementInterpreter.prototype.visitNotExpr = function (ast, ctx) {
          return !ast.condition.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitCastExpr = function (ast, ctx) {
          return ast.value.visitExpression(this, ctx);
      };
      StatementInterpreter.prototype.visitFunctionExpr = function (ast, ctx) {
          var paramNames = ast.params.map(function (param) { return param.name; });
          return _declareFn(paramNames, ast.statements, ctx, this);
      };
      StatementInterpreter.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
          var paramNames = stmt.params.map(function (param) { return param.name; });
          ctx.vars.set(stmt.name, _declareFn(paramNames, stmt.statements, ctx, this));
          return null;
      };
      StatementInterpreter.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
          var _this = this;
          var lhs = function () { return ast.lhs.visitExpression(_this, ctx); };
          var rhs = function () { return ast.rhs.visitExpression(_this, ctx); };
          switch (ast.operator) {
              case BinaryOperator.Equals:
                  return lhs() == rhs();
              case BinaryOperator.Identical:
                  return lhs() === rhs();
              case BinaryOperator.NotEquals:
                  return lhs() != rhs();
              case BinaryOperator.NotIdentical:
                  return lhs() !== rhs();
              case BinaryOperator.And:
                  return lhs() && rhs();
              case BinaryOperator.Or:
                  return lhs() || rhs();
              case BinaryOperator.Plus:
                  return lhs() + rhs();
              case BinaryOperator.Minus:
                  return lhs() - rhs();
              case BinaryOperator.Divide:
                  return lhs() / rhs();
              case BinaryOperator.Multiply:
                  return lhs() * rhs();
              case BinaryOperator.Modulo:
                  return lhs() % rhs();
              case BinaryOperator.Lower:
                  return lhs() < rhs();
              case BinaryOperator.LowerEquals:
                  return lhs() <= rhs();
              case BinaryOperator.Bigger:
                  return lhs() > rhs();
              case BinaryOperator.BiggerEquals:
                  return lhs() >= rhs();
              default:
                  throw new Error("Unknown operator " + ast.operator);
          }
      };
      StatementInterpreter.prototype.visitReadPropExpr = function (ast, ctx) {
          var result;
          var receiver = ast.receiver.visitExpression(this, ctx);
          result = receiver[ast.name];
          return result;
      };
      StatementInterpreter.prototype.visitReadKeyExpr = function (ast, ctx) {
          var receiver = ast.receiver.visitExpression(this, ctx);
          var prop = ast.index.visitExpression(this, ctx);
          return receiver[prop];
      };
      StatementInterpreter.prototype.visitLiteralArrayExpr = function (ast, ctx) {
          return this.visitAllExpressions(ast.entries, ctx);
      };
      StatementInterpreter.prototype.visitLiteralMapExpr = function (ast, ctx) {
          var _this = this;
          var result = {};
          ast.entries.forEach(function (entry) { return result[entry.key] = entry.value.visitExpression(_this, ctx); });
          return result;
      };
      StatementInterpreter.prototype.visitAllExpressions = function (expressions, ctx) {
          var _this = this;
          return expressions.map(function (expr) { return expr.visitExpression(_this, ctx); });
      };
      StatementInterpreter.prototype.visitAllStatements = function (statements, ctx) {
          for (var i = 0; i < statements.length; i++) {
              var stmt = statements[i];
              var val = stmt.visitStatement(this, ctx);
              if (val instanceof ReturnValue) {
                  return val;
              }
          }
          return null;
      };
      return StatementInterpreter;
  }());
  function _declareFn(varNames, statements, ctx, visitor) {
      return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return _executeFunctionStatements(varNames, args, statements, ctx, visitor);
      };
  }
  var CATCH_ERROR_VAR$2 = 'error';
  var CATCH_STACK_VAR$2 = 'stack';

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$26 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractJsEmitterVisitor = (function (_super) {
      __extends$26(AbstractJsEmitterVisitor, _super);
      function AbstractJsEmitterVisitor() {
          return _super.call(this, false) || this;
      }
      AbstractJsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
          var _this = this;
          ctx.pushClass(stmt);
          this._visitClassConstructor(stmt, ctx);
          if (stmt.parent != null) {
              ctx.print(stmt, stmt.name + ".prototype = Object.create(");
              stmt.parent.visitExpression(this, ctx);
              ctx.println(stmt, ".prototype);");
          }
          stmt.getters.forEach(function (getter) { return _this._visitClassGetter(stmt, getter, ctx); });
          stmt.methods.forEach(function (method) { return _this._visitClassMethod(stmt, method, ctx); });
          ctx.popClass();
          return null;
      };
      AbstractJsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
          ctx.print(stmt, "function " + stmt.name + "(");
          if (stmt.constructorMethod != null) {
              this._visitParams(stmt.constructorMethod.params, ctx);
          }
          ctx.println(stmt, ") {");
          ctx.incIndent();
          if (stmt.constructorMethod != null) {
              if (stmt.constructorMethod.body.length > 0) {
                  ctx.println(stmt, "var self = this;");
                  this.visitAllStatements(stmt.constructorMethod.body, ctx);
              }
          }
          ctx.decIndent();
          ctx.println(stmt, "}");
      };
      AbstractJsEmitterVisitor.prototype._visitClassGetter = function (stmt, getter, ctx) {
          ctx.println(stmt, "Object.defineProperty(" + stmt.name + ".prototype, '" + getter.name + "', { get: function() {");
          ctx.incIndent();
          if (getter.body.length > 0) {
              ctx.println(stmt, "var self = this;");
              this.visitAllStatements(getter.body, ctx);
          }
          ctx.decIndent();
          ctx.println(stmt, "}});");
      };
      AbstractJsEmitterVisitor.prototype._visitClassMethod = function (stmt, method, ctx) {
          ctx.print(stmt, stmt.name + ".prototype." + method.name + " = function(");
          this._visitParams(method.params, ctx);
          ctx.println(stmt, ") {");
          ctx.incIndent();
          if (method.body.length > 0) {
              ctx.println(stmt, "var self = this;");
              this.visitAllStatements(method.body, ctx);
          }
          ctx.decIndent();
          ctx.println(stmt, "};");
      };
      AbstractJsEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
          if (ast.builtin === BuiltinVar.This) {
              ctx.print(ast, 'self');
          }
          else if (ast.builtin === BuiltinVar.Super) {
              throw new Error("'super' needs to be handled at a parent ast node, not at the variable level!");
          }
          else {
              _super.prototype.visitReadVarExpr.call(this, ast, ctx);
          }
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
          ctx.print(stmt, "var " + stmt.name + " = ");
          stmt.value.visitExpression(this, ctx);
          ctx.println(stmt, ";");
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
          ast.value.visitExpression(this, ctx);
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
          var fnExpr = expr.fn;
          if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
              ctx.currentClass.parent.visitExpression(this, ctx);
              ctx.print(expr, ".call(this");
              if (expr.args.length > 0) {
                  ctx.print(expr, ", ");
                  this.visitAllExpressions(expr.args, ctx, ',');
              }
              ctx.print(expr, ")");
          }
          else {
              _super.prototype.visitInvokeFunctionExpr.call(this, expr, ctx);
          }
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
          ctx.print(ast, "function(");
          this._visitParams(ast.params, ctx);
          ctx.println(ast, ") {");
          ctx.incIndent();
          this.visitAllStatements(ast.statements, ctx);
          ctx.decIndent();
          ctx.print(ast, "}");
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
          ctx.print(stmt, "function " + stmt.name + "(");
          this._visitParams(stmt.params, ctx);
          ctx.println(stmt, ") {");
          ctx.incIndent();
          this.visitAllStatements(stmt.statements, ctx);
          ctx.decIndent();
          ctx.println(stmt, "}");
          return null;
      };
      AbstractJsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
          ctx.println(stmt, "try {");
          ctx.incIndent();
          this.visitAllStatements(stmt.bodyStmts, ctx);
          ctx.decIndent();
          ctx.println(stmt, "} catch (" + CATCH_ERROR_VAR$1.name + ") {");
          ctx.incIndent();
          var catchStmts = [CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack')).toDeclStmt(null, [
                  StmtModifier.Final
              ])].concat(stmt.catchStmts);
          this.visitAllStatements(catchStmts, ctx);
          ctx.decIndent();
          ctx.println(stmt, "}");
          return null;
      };
      AbstractJsEmitterVisitor.prototype._visitParams = function (params, ctx) {
          this.visitAllObjects(function (param) { return ctx.print(null, param.name); }, params, ctx, ',');
      };
      AbstractJsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
          var name;
          switch (method) {
              case BuiltinMethod.ConcatArray:
                  name = 'concat';
                  break;
              case BuiltinMethod.SubscribeObservable:
                  name = 'subscribe';
                  break;
              case BuiltinMethod.Bind:
                  name = 'bind';
                  break;
              default:
                  throw new Error("Unknown builtin method: " + method);
          }
          return name;
      };
      return AbstractJsEmitterVisitor;
  }(AbstractEmitterVisitor));

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$25 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  function evalExpression(sourceUrl, ctx, vars) {
      var fnBody = ctx.toSource() + "\n//# sourceURL=" + sourceUrl + "\n" + ctx.toSourceMapGenerator().toJsComment();
      var fnArgNames = [];
      var fnArgValues = [];
      for (var argName in vars) {
          fnArgNames.push(argName);
          fnArgValues.push(vars[argName]);
      }
      return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
  }
  function jitStatements(sourceUrl, statements, resultVars) {
      var converter = new JitEmitterVisitor();
      var ctx = EmitterVisitorContext.createRoot(resultVars);
      var returnStmt = new ReturnStatement(literalArr(resultVars.map(function (resultVar) { return variable(resultVar); })));
      converter.visitAllStatements(statements.concat([returnStmt]), ctx);
      return evalExpression(sourceUrl, ctx, converter.getArgs());
  }
  var JitEmitterVisitor = (function (_super) {
      __extends$25(JitEmitterVisitor, _super);
      function JitEmitterVisitor() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this._evalArgNames = [];
          _this._evalArgValues = [];
          return _this;
      }
      JitEmitterVisitor.prototype.getArgs = function () {
          var result = {};
          for (var i = 0; i < this._evalArgNames.length; i++) {
              result[this._evalArgNames[i]] = this._evalArgValues[i];
          }
          return result;
      };
      JitEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
          var value = ast.value.reference;
          var id = this._evalArgValues.indexOf(value);
          if (id === -1) {
              id = this._evalArgValues.length;
              this._evalArgValues.push(value);
              var name_1 = identifierName(ast.value) || 'val';
              this._evalArgNames.push("jit_" + name_1 + id);
          }
          ctx.print(ast, this._evalArgNames[id]);
          return null;
      };
      return JitEmitterVisitor;
  }(AbstractJsEmitterVisitor));

  /**
   * An internal module of the Angular compiler that begins with component types,
   * extracts templates, and eventually produces a compiled version of the component
   * ready for linking into an application.
   *
   * @security  When compiling templates at runtime, you must ensure that the entire template comes
   * from a trusted source. Attacker-controlled data introduced by a template could expose your
   * application to XSS risks.  For more detail, see the [Security Guide](http://g.co/ng/security).
   */
  var JitCompiler = (function () {
      function JitCompiler(_injector, _metadataResolver, _templateParser, _styleCompiler, _viewCompiler, _ngModuleCompiler, _compilerConfig) {
          this._injector = _injector;
          this._metadataResolver = _metadataResolver;
          this._templateParser = _templateParser;
          this._styleCompiler = _styleCompiler;
          this._viewCompiler = _viewCompiler;
          this._ngModuleCompiler = _ngModuleCompiler;
          this._compilerConfig = _compilerConfig;
          this._compiledTemplateCache = new Map();
          this._compiledHostTemplateCache = new Map();
          this._compiledDirectiveWrapperCache = new Map();
          this._compiledNgModuleCache = new Map();
      }
      Object.defineProperty(JitCompiler.prototype, "injector", {
          get: function () { return this._injector; },
          enumerable: true,
          configurable: true
      });
      JitCompiler.prototype.compileModuleSync = function (moduleType) {
          return this._compileModuleAndComponents(moduleType, true).syncResult;
      };
      JitCompiler.prototype.compileModuleAsync = function (moduleType) {
          return this._compileModuleAndComponents(moduleType, false).asyncResult;
      };
      JitCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
          return this._compileModuleAndAllComponents(moduleType, true).syncResult;
      };
      JitCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
          return this._compileModuleAndAllComponents(moduleType, false).asyncResult;
      };
      JitCompiler.prototype.getNgContentSelectors = function (component) {
          var template = this._compiledTemplateCache.get(component);
          if (!template) {
              throw new Error("The component " + _angular_core.ɵstringify(component) + " is not yet compiled!");
          }
          return template.compMeta.template.ngContentSelectors;
      };
      JitCompiler.prototype._compileModuleAndComponents = function (moduleType, isSync) {
          var _this = this;
          var loadingPromise = this._loadModules(moduleType, isSync);
          var createResult = function () {
              _this._compileComponents(moduleType, null);
              return _this._compileModule(moduleType);
          };
          if (isSync) {
              return new SyncAsyncResult(createResult());
          }
          else {
              return new SyncAsyncResult(null, loadingPromise.then(createResult));
          }
      };
      JitCompiler.prototype._compileModuleAndAllComponents = function (moduleType, isSync) {
          var _this = this;
          var loadingPromise = this._loadModules(moduleType, isSync);
          var createResult = function () {
              var componentFactories = [];
              _this._compileComponents(moduleType, componentFactories);
              return new _angular_core.ModuleWithComponentFactories(_this._compileModule(moduleType), componentFactories);
          };
          if (isSync) {
              return new SyncAsyncResult(createResult());
          }
          else {
              return new SyncAsyncResult(null, loadingPromise.then(createResult));
          }
      };
      JitCompiler.prototype._loadModules = function (mainModule, isSync) {
          var _this = this;
          var loadingPromises = [];
          var ngModule = this._metadataResolver.getNgModuleMetadata(mainModule);
          // Note: the loadingPromise for a module only includes the loading of the exported directives
          // of imported modules.
          // However, for runtime compilation, we want to transitively compile all modules,
          // so we also need to call loadNgModuleDirectiveAndPipeMetadata for all nested modules.
          ngModule.transitiveModule.modules.forEach(function (localModuleMeta) {
              loadingPromises.push(_this._metadataResolver.loadNgModuleDirectiveAndPipeMetadata(localModuleMeta.reference, isSync));
          });
          return Promise.all(loadingPromises);
      };
      JitCompiler.prototype._compileModule = function (moduleType) {
          var _this = this;
          var ngModuleFactory = this._compiledNgModuleCache.get(moduleType);
          if (!ngModuleFactory) {
              var moduleMeta_1 = this._metadataResolver.getNgModuleMetadata(moduleType);
              // Always provide a bound Compiler
              var extraProviders = [this._metadataResolver.getProviderMetadata(new ProviderMeta(_angular_core.Compiler, { useFactory: function () { return new ModuleBoundCompiler(_this, moduleMeta_1.type.reference); } }))];
              var compileResult = this._ngModuleCompiler.compile(moduleMeta_1, extraProviders);
              if (!this._compilerConfig.useJit) {
                  ngModuleFactory =
                      interpretStatements(compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
              }
              else {
                  ngModuleFactory = jitStatements("/" + identifierName(moduleMeta_1.type) + "/module.ngfactory.js", compileResult.statements, [compileResult.ngModuleFactoryVar])[0];
              }
              this._compiledNgModuleCache.set(moduleMeta_1.type.reference, ngModuleFactory);
          }
          return ngModuleFactory;
      };
      /**
       * @internal
       */
      JitCompiler.prototype._compileComponents = function (mainModule, allComponentFactories) {
          var _this = this;
          var ngModule = this._metadataResolver.getNgModuleMetadata(mainModule);
          var moduleByDirective = new Map();
          var templates = new Set();
          ngModule.transitiveModule.modules.forEach(function (localModuleSummary) {
              var localModuleMeta = _this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference);
              localModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
                  moduleByDirective.set(dirIdentifier.reference, localModuleMeta);
                  var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                  if (dirMeta.isComponent) {
                      templates.add(_this._createCompiledTemplate(dirMeta, localModuleMeta));
                      if (allComponentFactories) {
                          var template = _this._createCompiledHostTemplate(dirMeta.type.reference, localModuleMeta);
                          templates.add(template);
                          allComponentFactories.push(dirMeta.componentFactory);
                      }
                  }
              });
          });
          ngModule.transitiveModule.modules.forEach(function (localModuleSummary) {
              var localModuleMeta = _this._metadataResolver.getNgModuleMetadata(localModuleSummary.reference);
              localModuleMeta.declaredDirectives.forEach(function (dirIdentifier) {
                  var dirMeta = _this._metadataResolver.getDirectiveMetadata(dirIdentifier.reference);
                  if (dirMeta.isComponent) {
                      dirMeta.entryComponents.forEach(function (entryComponentType) {
                          var moduleMeta = moduleByDirective.get(entryComponentType.componentType);
                          templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
                      });
                  }
              });
              localModuleMeta.entryComponents.forEach(function (entryComponentType) {
                  var moduleMeta = moduleByDirective.get(entryComponentType.componentType);
                  templates.add(_this._createCompiledHostTemplate(entryComponentType.componentType, moduleMeta));
              });
          });
          templates.forEach(function (template) { return _this._compileTemplate(template); });
      };
      JitCompiler.prototype.clearCacheFor = function (type) {
          this._compiledNgModuleCache.delete(type);
          this._metadataResolver.clearCacheFor(type);
          this._compiledHostTemplateCache.delete(type);
          var compiledTemplate = this._compiledTemplateCache.get(type);
          if (compiledTemplate) {
              this._compiledTemplateCache.delete(type);
          }
      };
      JitCompiler.prototype.clearCache = function () {
          this._metadataResolver.clearCache();
          this._compiledTemplateCache.clear();
          this._compiledHostTemplateCache.clear();
          this._compiledNgModuleCache.clear();
      };
      JitCompiler.prototype._createCompiledHostTemplate = function (compType, ngModule) {
          if (!ngModule) {
              throw new Error("Component " + _angular_core.ɵstringify(compType) + " is not part of any NgModule or the module has not been imported into your module.");
          }
          var compiledTemplate = this._compiledHostTemplateCache.get(compType);
          if (!compiledTemplate) {
              var compMeta = this._metadataResolver.getDirectiveMetadata(compType);
              assertComponent(compMeta);
              var componentFactory = compMeta.componentFactory;
              var hostClass = this._metadataResolver.getHostComponentType(compType);
              var hostMeta = createHostComponentMeta(hostClass, compMeta, _angular_core.ɵgetComponentViewDefinitionFactory(componentFactory));
              compiledTemplate =
                  new CompiledTemplate(true, compMeta.type, hostMeta, ngModule, [compMeta.type]);
              this._compiledHostTemplateCache.set(compType, compiledTemplate);
          }
          return compiledTemplate;
      };
      JitCompiler.prototype._createCompiledTemplate = function (compMeta, ngModule) {
          var compiledTemplate = this._compiledTemplateCache.get(compMeta.type.reference);
          if (!compiledTemplate) {
              assertComponent(compMeta);
              compiledTemplate = new CompiledTemplate(false, compMeta.type, compMeta, ngModule, ngModule.transitiveModule.directives);
              this._compiledTemplateCache.set(compMeta.type.reference, compiledTemplate);
          }
          return compiledTemplate;
      };
      JitCompiler.prototype._compileTemplate = function (template) {
          var _this = this;
          if (template.isCompiled) {
              return;
          }
          var compMeta = template.compMeta;
          var externalStylesheetsByModuleUrl = new Map();
          var stylesCompileResult = this._styleCompiler.compileComponent(compMeta);
          stylesCompileResult.externalStylesheets.forEach(function (r) { externalStylesheetsByModuleUrl.set(r.meta.moduleUrl, r); });
          this._resolveStylesCompileResult(stylesCompileResult.componentStylesheet, externalStylesheetsByModuleUrl);
          var directives = template.directives.map(function (dir) { return _this._metadataResolver.getDirectiveSummary(dir.reference); });
          var pipes = template.ngModule.transitiveModule.pipes.map(function (pipe) { return _this._metadataResolver.getPipeSummary(pipe.reference); });
          var _a = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, template.ngModule.schemas, identifierName(compMeta.type)), parsedTemplate = _a.template, usedPipes = _a.pipes;
          var compileResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, variable(stylesCompileResult.componentStylesheet.stylesVar), usedPipes);
          var statements = stylesCompileResult.componentStylesheet.statements.concat(compileResult.statements);
          var viewClass;
          var rendererType;
          if (!this._compilerConfig.useJit) {
              _b = interpretStatements(statements, [compileResult.viewClassVar, compileResult.rendererTypeVar]), viewClass = _b[0], rendererType = _b[1];
          }
          else {
              var sourceUrl = "/" + identifierName(template.ngModule.type) + "/" + identifierName(template.compType) + "/" + (template.isHost ? 'host' : 'component') + ".ngfactory.js";
              _c = jitStatements(sourceUrl, statements, [compileResult.viewClassVar, compileResult.rendererTypeVar]), viewClass = _c[0], rendererType = _c[1];
          }
          template.compiled(viewClass, rendererType);
          var _b, _c;
      };
      JitCompiler.prototype._resolveStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
          var _this = this;
          result.dependencies.forEach(function (dep, i) {
              var nestedCompileResult = externalStylesheetsByModuleUrl.get(dep.moduleUrl);
              var nestedStylesArr = _this._resolveAndEvalStylesCompileResult(nestedCompileResult, externalStylesheetsByModuleUrl);
              dep.valuePlaceholder.reference = nestedStylesArr;
          });
      };
      JitCompiler.prototype._resolveAndEvalStylesCompileResult = function (result, externalStylesheetsByModuleUrl) {
          this._resolveStylesCompileResult(result, externalStylesheetsByModuleUrl);
          if (!this._compilerConfig.useJit) {
              return interpretStatements(result.statements, [result.stylesVar])[0];
          }
          else {
              return jitStatements("/" + result.meta.moduleUrl + ".ngstyle.js", result.statements, [result.stylesVar])[0];
          }
      };
      return JitCompiler;
  }());
  JitCompiler.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  JitCompiler.ctorParameters = function () { return [
      { type: _angular_core.Injector, },
      { type: CompileMetadataResolver, },
      { type: TemplateParser, },
      { type: StyleCompiler, },
      { type: ViewCompiler, },
      { type: NgModuleCompiler, },
      { type: CompilerConfig, },
  ]; };
  var CompiledTemplate = (function () {
      function CompiledTemplate(isHost, compType, compMeta, ngModule, directives) {
          this.isHost = isHost;
          this.compType = compType;
          this.compMeta = compMeta;
          this.ngModule = ngModule;
          this.directives = directives;
          this._viewClass = null;
          this.isCompiled = false;
      }
      CompiledTemplate.prototype.compiled = function (viewClass, rendererType) {
          this._viewClass = viewClass;
          this.compMeta.componentViewType.setDelegate(viewClass);
          for (var prop in rendererType) {
              this.compMeta.rendererType[prop] = rendererType[prop];
          }
          this.isCompiled = true;
      };
      return CompiledTemplate;
  }());
  function assertComponent(meta) {
      if (!meta.isComponent) {
          throw new Error("Could not compile '" + identifierName(meta.type) + "' because it is not a component.");
      }
  }
  /**
   * Implements `Compiler` by delegating to the JitCompiler using a known module.
   */
  var ModuleBoundCompiler = (function () {
      function ModuleBoundCompiler(_delegate, _ngModule) {
          this._delegate = _delegate;
          this._ngModule = _ngModule;
      }
      Object.defineProperty(ModuleBoundCompiler.prototype, "_injector", {
          get: function () { return this._delegate.injector; },
          enumerable: true,
          configurable: true
      });
      ModuleBoundCompiler.prototype.compileModuleSync = function (moduleType) {
          return this._delegate.compileModuleSync(moduleType);
      };
      ModuleBoundCompiler.prototype.compileModuleAsync = function (moduleType) {
          return this._delegate.compileModuleAsync(moduleType);
      };
      ModuleBoundCompiler.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
          return this._delegate.compileModuleAndAllComponentsSync(moduleType);
      };
      ModuleBoundCompiler.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
          return this._delegate.compileModuleAndAllComponentsAsync(moduleType);
      };
      ModuleBoundCompiler.prototype.getNgContentSelectors = function (component) {
          return this._delegate.getNgContentSelectors(component);
      };
      /**
       * Clears all caches
       */
      ModuleBoundCompiler.prototype.clearCache = function () { this._delegate.clearCache(); };
      /**
       * Clears the cache for the given component/ngModule.
       */
      ModuleBoundCompiler.prototype.clearCacheFor = function (type) { this._delegate.clearCacheFor(type); };
      return ModuleBoundCompiler;
  }());

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var __extends$27 = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  /**
   * A container for message extracted from the templates.
   */
  var MessageBundle = (function () {
      function MessageBundle(_htmlParser, _implicitTags, _implicitAttrs, _locale) {
          if (_locale === void 0) { _locale = null; }
          this._htmlParser = _htmlParser;
          this._implicitTags = _implicitTags;
          this._implicitAttrs = _implicitAttrs;
          this._locale = _locale;
          this._messages = [];
      }
      MessageBundle.prototype.updateFromTemplate = function (html, url, interpolationConfig) {
          var htmlParserResult = this._htmlParser.parse(html, url, true, interpolationConfig);
          if (htmlParserResult.errors.length) {
              return htmlParserResult.errors;
          }
          var i18nParserResult = extractMessages(htmlParserResult.rootNodes, interpolationConfig, this._implicitTags, this._implicitAttrs);
          if (i18nParserResult.errors.length) {
              return i18nParserResult.errors;
          }
          (_a = this._messages).push.apply(_a, i18nParserResult.messages);
          var _a;
      };
      // Return the message in the internal format
      // The public (serialized) format might be different, see the `write` method.
      MessageBundle.prototype.getMessages = function () { return this._messages; };
      MessageBundle.prototype.write = function (serializer) {
          var messages = {};
          var mapperVisitor = new MapPlaceholderNames();
          // Deduplicate messages based on their ID
          this._messages.forEach(function (message) {
              var id = serializer.digest(message);
              if (!messages.hasOwnProperty(id)) {
                  messages[id] = message;
              }
          });
          // Transform placeholder names using the serializer mapping
          var msgList = Object.keys(messages).map(function (id) {
              var mapper = serializer.createNameMapper(messages[id]);
              var src = messages[id];
              var nodes = mapper ? mapperVisitor.convert(src.nodes, mapper) : src.nodes;
              return new Message(nodes, {}, {}, src.meaning, src.description, id);
          });
          return serializer.write(msgList, this._locale);
      };
      return MessageBundle;
  }());
  // Transform an i18n AST by renaming the placeholder nodes with the given mapper
  var MapPlaceholderNames = (function (_super) {
      __extends$27(MapPlaceholderNames, _super);
      function MapPlaceholderNames() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      MapPlaceholderNames.prototype.convert = function (nodes, mapper) {
          var _this = this;
          return mapper ? nodes.map(function (n) { return n.visit(_this, mapper); }) : nodes;
      };
      MapPlaceholderNames.prototype.visitTagPlaceholder = function (ph, mapper) {
          var _this = this;
          var startName = mapper.toPublicName(ph.startName);
          var closeName = ph.closeName ? mapper.toPublicName(ph.closeName) : ph.closeName;
          var children = ph.children.map(function (n) { return n.visit(_this, mapper); });
          return new TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
      };
      MapPlaceholderNames.prototype.visitPlaceholder = function (ph, mapper) {
          return new Placeholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
      };
      MapPlaceholderNames.prototype.visitIcuPlaceholder = function (ph, mapper) {
          return new IcuPlaceholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
      };
      return MapPlaceholderNames;
  }(CloneVisitor));

  var Extractor = (function () {
      function Extractor(host, staticSymbolResolver, messageBundle, metadataResolver) {
          this.host = host;
          this.staticSymbolResolver = staticSymbolResolver;
          this.messageBundle = messageBundle;
          this.metadataResolver = metadataResolver;
      }
      Extractor.prototype.extract = function (rootFiles) {
          var _this = this;
          var programSymbols = extractProgramSymbols(this.staticSymbolResolver, rootFiles, this.host);
          var _a = analyzeAndValidateNgModules(programSymbols, this.host, this.metadataResolver), files = _a.files, ngModules = _a.ngModules;
          return Promise
              .all(ngModules.map(function (ngModule) { return _this.metadataResolver.loadNgModuleDirectiveAndPipeMetadata(ngModule.type.reference, false); }))
              .then(function () {
              var errors = [];
              files.forEach(function (file) {
                  var compMetas = [];
                  file.directives.forEach(function (directiveType) {
                      var dirMeta = _this.metadataResolver.getDirectiveMetadata(directiveType);
                      if (dirMeta && dirMeta.isComponent) {
                          compMetas.push(dirMeta);
                      }
                  });
                  compMetas.forEach(function (compMeta) {
                      var html = compMeta.template.template;
                      var interpolationConfig = InterpolationConfig.fromArray(compMeta.template.interpolation);
                      errors.push.apply(errors, _this.messageBundle.updateFromTemplate(html, file.srcUrl, interpolationConfig));
                  });
              });
              if (errors.length) {
                  throw new Error(errors.map(function (e) { return e.toString(); }).join('\n'));
              }
              return _this.messageBundle;
          });
      };
      Extractor.create = function (host, locale) {
          var htmlParser = new I18NHtmlParser(new HtmlParser());
          var urlResolver = createOfflineCompileUrlResolver();
          var symbolCache = new StaticSymbolCache();
          var summaryResolver = new AotSummaryResolver(host, symbolCache);
          var staticSymbolResolver = new StaticSymbolResolver(host, symbolCache, summaryResolver);
          var staticReflector = new StaticReflector(staticSymbolResolver);
          StaticAndDynamicReflectionCapabilities.install(staticReflector);
          var config = new CompilerConfig({ defaultEncapsulation: _angular_core.ViewEncapsulation.Emulated, useJit: false });
          var normalizer = new DirectiveNormalizer({ get: function (url) { return host.loadResource(url); } }, urlResolver, htmlParser, config);
          var elementSchemaRegistry = new DomElementSchemaRegistry();
          var resolver = new CompileMetadataResolver(config, new NgModuleResolver(staticReflector), new DirectiveResolver(staticReflector), new PipeResolver(staticReflector), summaryResolver, elementSchemaRegistry, normalizer, symbolCache, staticReflector);
          // TODO(vicb): implicit tags & attributes
          var messageBundle = new MessageBundle(htmlParser, [], {}, locale);
          var extractor = new Extractor(host, staticSymbolResolver, messageBundle, resolver);
          return { extractor: extractor, staticReflector: staticReflector };
      };
      return Extractor;
  }());

  var _NO_RESOURCE_LOADER = {
      get: function (url) {
          throw new Error("No ResourceLoader implementation has been provided. Can't read the url \"" + url + "\"");
      }
  };
  var baseHtmlParser = new _angular_core.InjectionToken('HtmlParser');
  /**
   * A set of providers that provide `JitCompiler` and its dependencies to use for
   * template compilation.
   */
  var COMPILER_PROVIDERS = [
      { provide: _angular_core.ɵReflector, useValue: _angular_core.ɵreflector },
      { provide: _angular_core.ɵReflectorReader, useExisting: _angular_core.ɵReflector },
      { provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER },
      SummaryResolver,
      _angular_core.ɵConsole,
      Lexer,
      Parser,
      {
          provide: baseHtmlParser,
          useClass: HtmlParser,
      },
      {
          provide: I18NHtmlParser,
          useFactory: function (parser, translations, format, config, console) {
              return new I18NHtmlParser(parser, translations, format, config.missingTranslation, console);
          },
          deps: [
              baseHtmlParser,
              [new _angular_core.Optional(), new _angular_core.Inject(_angular_core.TRANSLATIONS)],
              [new _angular_core.Optional(), new _angular_core.Inject(_angular_core.TRANSLATIONS_FORMAT)],
              [CompilerConfig],
              [_angular_core.ɵConsole],
          ]
      },
      {
          provide: HtmlParser,
          useExisting: I18NHtmlParser,
      },
      TemplateParser,
      DirectiveNormalizer,
      CompileMetadataResolver,
      DEFAULT_PACKAGE_URL_PROVIDER,
      StyleCompiler,
      ViewCompiler,
      NgModuleCompiler,
      { provide: CompilerConfig, useValue: new CompilerConfig() },
      JitCompiler,
      { provide: _angular_core.Compiler, useExisting: JitCompiler },
      DomElementSchemaRegistry,
      { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
      UrlResolver,
      DirectiveResolver,
      PipeResolver,
      NgModuleResolver,
  ];
  var JitCompilerFactory = (function () {
      function JitCompilerFactory(defaultOptions) {
          var compilerOptions = {
              useDebug: _angular_core.isDevMode(),
              useJit: true,
              defaultEncapsulation: _angular_core.ViewEncapsulation.Emulated,
              missingTranslation: _angular_core.MissingTranslationStrategy.Warning,
              enableLegacyTemplate: true,
          };
          this._defaultOptions = [compilerOptions].concat(defaultOptions);
      }
      JitCompilerFactory.prototype.createCompiler = function (options) {
          if (options === void 0) { options = []; }
          var opts = _mergeOptions(this._defaultOptions.concat(options));
          var injector = _angular_core.ReflectiveInjector.resolveAndCreate([
              COMPILER_PROVIDERS, {
                  provide: CompilerConfig,
                  useFactory: function () {
                      return new CompilerConfig({
                          // let explicit values from the compiler options overwrite options
                          // from the app providers
                          useJit: opts.useJit,
                          // let explicit values from the compiler options overwrite options
                          // from the app providers
                          defaultEncapsulation: opts.defaultEncapsulation,
                          missingTranslation: opts.missingTranslation,
                          enableLegacyTemplate: opts.enableLegacyTemplate,
                      });
                  },
                  deps: []
              },
              opts.providers
          ]);
          return injector.get(_angular_core.Compiler);
      };
      return JitCompilerFactory;
  }());
  JitCompilerFactory.decorators = [
      { type: CompilerInjectable },
  ];
  /** @nocollapse */
  JitCompilerFactory.ctorParameters = function () { return [
      { type: Array, decorators: [{ type: _angular_core.Inject, args: [_angular_core.COMPILER_OPTIONS,] },] },
  ]; };
  function _initReflector() {
      _angular_core.ɵreflector.reflectionCapabilities = new _angular_core.ɵReflectionCapabilities();
  }
  /**
   * A platform that included corePlatform and the compiler.
   *
   * @experimental
   */
  var platformCoreDynamic = _angular_core.createPlatformFactory(_angular_core.platformCore, 'coreDynamic', [
      { provide: _angular_core.COMPILER_OPTIONS, useValue: {}, multi: true },
      { provide: _angular_core.CompilerFactory, useClass: JitCompilerFactory },
      { provide: _angular_core.PLATFORM_INITIALIZER, useValue: _initReflector, multi: true },
  ]);
  function _mergeOptions(optionsArr) {
      return {
          useJit: _lastDefined(optionsArr.map(function (options) { return options.useJit; })),
          defaultEncapsulation: _lastDefined(optionsArr.map(function (options) { return options.defaultEncapsulation; })),
          providers: _mergeArrays(optionsArr.map(function (options) { return options.providers; })),
          missingTranslation: _lastDefined(optionsArr.map(function (options) { return options.missingTranslation; })),
      };
  }
  function _lastDefined(args) {
      for (var i = args.length - 1; i >= 0; i--) {
          if (args[i] !== undefined) {
              return args[i];
          }
      }
      return undefined;
  }
  function _mergeArrays(parts) {
      var result = [];
      parts.forEach(function (part) { return part && result.push.apply(result, part); });
      return result;
  }

  /**
   * @license
   * Copyright Google Inc. All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  /**
   * Interface that defines how import statements should be generated.
   */
  var ImportResolver = (function () {
      function ImportResolver() {
      }
      return ImportResolver;
  }());

  exports.VERSION = VERSION;
  exports.TEMPLATE_TRANSFORMS = TEMPLATE_TRANSFORMS;
  exports.CompilerConfig = CompilerConfig;
  exports.JitCompiler = JitCompiler;
  exports.DirectiveResolver = DirectiveResolver;
  exports.PipeResolver = PipeResolver;
  exports.NgModuleResolver = NgModuleResolver;
  exports.DEFAULT_INTERPOLATION_CONFIG = DEFAULT_INTERPOLATION_CONFIG;
  exports.InterpolationConfig = InterpolationConfig;
  exports.NgModuleCompiler = NgModuleCompiler;
  exports.ViewCompiler = ViewCompiler;
  exports.isSyntaxError = isSyntaxError;
  exports.syntaxError = syntaxError;
  exports.TextAst = TextAst;
  exports.BoundTextAst = BoundTextAst;
  exports.AttrAst = AttrAst;
  exports.BoundElementPropertyAst = BoundElementPropertyAst;
  exports.BoundEventAst = BoundEventAst;
  exports.ReferenceAst = ReferenceAst;
  exports.VariableAst = VariableAst;
  exports.ElementAst = ElementAst;
  exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
  exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
  exports.DirectiveAst = DirectiveAst;
  exports.ProviderAst = ProviderAst;
  exports.NgContentAst = NgContentAst;
  exports.templateVisitAll = templateVisitAll;
  exports.CompileAnimationEntryMetadata = CompileAnimationEntryMetadata;
  exports.CompileAnimationStateMetadata = CompileAnimationStateMetadata;
  exports.CompileAnimationStateDeclarationMetadata = CompileAnimationStateDeclarationMetadata;
  exports.CompileAnimationStateTransitionMetadata = CompileAnimationStateTransitionMetadata;
  exports.CompileAnimationMetadata = CompileAnimationMetadata;
  exports.CompileAnimationKeyframesSequenceMetadata = CompileAnimationKeyframesSequenceMetadata;
  exports.CompileAnimationStyleMetadata = CompileAnimationStyleMetadata;
  exports.CompileAnimationAnimateMetadata = CompileAnimationAnimateMetadata;
  exports.CompileAnimationWithStepsMetadata = CompileAnimationWithStepsMetadata;
  exports.CompileAnimationSequenceMetadata = CompileAnimationSequenceMetadata;
  exports.CompileAnimationGroupMetadata = CompileAnimationGroupMetadata;
  exports.identifierName = identifierName;
  exports.identifierModuleUrl = identifierModuleUrl;
  exports.viewClassName = viewClassName;
  exports.rendererTypeName = rendererTypeName;
  exports.hostViewClassName = hostViewClassName;
  exports.dirWrapperClassName = dirWrapperClassName;
  exports.componentFactoryName = componentFactoryName;
  exports.tokenName = tokenName;
  exports.tokenReference = tokenReference;
  exports.CompileStylesheetMetadata = CompileStylesheetMetadata;
  exports.CompileTemplateMetadata = CompileTemplateMetadata;
  exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
  exports.createHostComponentMeta = createHostComponentMeta;
  exports.CompilePipeMetadata = CompilePipeMetadata;
  exports.CompileNgModuleMetadata = CompileNgModuleMetadata;
  exports.TransitiveCompileNgModuleMetadata = TransitiveCompileNgModuleMetadata;
  exports.ProviderMeta = ProviderMeta;
  exports.flatten = flatten;
  exports.createAotCompiler = createAotCompiler;
  exports.AotCompiler = AotCompiler;
  exports.analyzeNgModules = analyzeNgModules;
  exports.analyzeAndValidateNgModules = analyzeAndValidateNgModules;
  exports.extractProgramSymbols = extractProgramSymbols;
  exports.StaticReflector = StaticReflector;
  exports.StaticAndDynamicReflectionCapabilities = StaticAndDynamicReflectionCapabilities;
  exports.StaticSymbol = StaticSymbol;
  exports.StaticSymbolCache = StaticSymbolCache;
  exports.ResolvedStaticSymbol = ResolvedStaticSymbol;
  exports.StaticSymbolResolver = StaticSymbolResolver;
  exports.unescapeIdentifier = unescapeIdentifier;
  exports.AotSummaryResolver = AotSummaryResolver;
  exports.SummaryResolver = SummaryResolver;
  exports.COMPILER_PROVIDERS = COMPILER_PROVIDERS;
  exports.JitCompilerFactory = JitCompilerFactory;
  exports.platformCoreDynamic = platformCoreDynamic;
  exports.createUrlResolverWithoutPackagePrefix = createUrlResolverWithoutPackagePrefix;
  exports.createOfflineCompileUrlResolver = createOfflineCompileUrlResolver;
  exports.DEFAULT_PACKAGE_URL_PROVIDER = DEFAULT_PACKAGE_URL_PROVIDER;
  exports.UrlResolver = UrlResolver;
  exports.getUrlScheme = getUrlScheme;
  exports.ResourceLoader = ResourceLoader;
  exports.ElementSchemaRegistry = ElementSchemaRegistry;
  exports.Extractor = Extractor;
  exports.I18NHtmlParser = I18NHtmlParser;
  exports.MessageBundle = MessageBundle;
  exports.Serializer = Serializer;
  exports.Xliff = Xliff;
  exports.Xmb = Xmb;
  exports.Xtb = Xtb;
  exports.DirectiveNormalizer = DirectiveNormalizer;
  exports.ParserError = ParserError;
  exports.ParseSpan = ParseSpan;
  exports.AST = AST;
  exports.Quote = Quote;
  exports.EmptyExpr = EmptyExpr;
  exports.ImplicitReceiver = ImplicitReceiver;
  exports.Chain = Chain;
  exports.Conditional = Conditional;
  exports.PropertyRead = PropertyRead;
  exports.PropertyWrite = PropertyWrite;
  exports.SafePropertyRead = SafePropertyRead;
  exports.KeyedRead = KeyedRead;
  exports.KeyedWrite = KeyedWrite;
  exports.BindingPipe = BindingPipe;
  exports.LiteralPrimitive = LiteralPrimitive;
  exports.LiteralArray = LiteralArray;
  exports.LiteralMap = LiteralMap;
  exports.Interpolation = Interpolation;
  exports.Binary = Binary;
  exports.PrefixNot = PrefixNot;
  exports.MethodCall = MethodCall;
  exports.SafeMethodCall = SafeMethodCall;
  exports.FunctionCall = FunctionCall;
  exports.ASTWithSource = ASTWithSource;
  exports.TemplateBinding = TemplateBinding;
  exports.RecursiveAstVisitor = RecursiveAstVisitor;
  exports.AstTransformer = AstTransformer;
  exports.Lexer = Lexer;
  exports.Token = Token;
  exports.EOF = EOF;
  exports.isIdentifier = isIdentifier;
  exports.isQuote = isQuote;
  exports.SplitInterpolation = SplitInterpolation;
  exports.TemplateBindingParseResult = TemplateBindingParseResult;
  exports.Parser = Parser;
  exports._ParseAST = _ParseAST;
  exports.ERROR_COLLECTOR_TOKEN = ERROR_COLLECTOR_TOKEN;
  exports.CompileMetadataResolver = CompileMetadataResolver;
  exports.componentModuleUrl = componentModuleUrl;
  exports.Text = Text;
  exports.Expansion = Expansion;
  exports.ExpansionCase = ExpansionCase;
  exports.Attribute = Attribute$1;
  exports.Element = Element;
  exports.Comment = Comment;
  exports.visitAll = visitAll;
  exports.HtmlParser = HtmlParser;
  exports.ParseTreeResult = ParseTreeResult;
  exports.TreeError = TreeError;
  exports.HtmlTagDefinition = HtmlTagDefinition;
  exports.getHtmlTagDefinition = getHtmlTagDefinition;
  exports.splitNsName = splitNsName;
  exports.getNsPrefix = getNsPrefix;
  exports.mergeNsAndName = mergeNsAndName;
  exports.NAMED_ENTITIES = NAMED_ENTITIES;
  exports.ImportResolver = ImportResolver;
  exports.debugOutputAstAsTypeScript = debugOutputAstAsTypeScript;
  exports.TypeScriptEmitter = TypeScriptEmitter;
  exports.ParseLocation = ParseLocation;
  exports.ParseSourceFile = ParseSourceFile;
  exports.ParseSourceSpan = ParseSourceSpan;
  exports.ParseError = ParseError;
  exports.DomElementSchemaRegistry = DomElementSchemaRegistry;
  exports.CssSelector = CssSelector;
  exports.SelectorMatcher = SelectorMatcher;
  exports.SelectorListContext = SelectorListContext;
  exports.SelectorContext = SelectorContext;
  exports.StylesCompileDependency = StylesCompileDependency;
  exports.StylesCompileResult = StylesCompileResult;
  exports.CompiledStylesheet = CompiledStylesheet;
  exports.StyleCompiler = StyleCompiler;
  exports.TemplateParseError = TemplateParseError;
  exports.TemplateParseResult = TemplateParseResult;
  exports.TemplateParser = TemplateParser;
  exports.splitClasses = splitClasses;
  exports.createElementCssSelector = createElementCssSelector;
  exports.removeSummaryDuplicates = removeSummaryDuplicates;

}));