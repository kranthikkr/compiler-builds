/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
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
var ShadowCss = /** @class */ (function () {
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
        var commentsWithHash = extractCommentsWithHash(cssText);
        cssText = stripComments(cssText);
        cssText = this._insertDirectives(cssText);
        var scopedCssText = this._scopeCssText(cssText, selector, hostSelector);
        return tslib_1.__spread([scopedCssText], commentsWithHash).join('\n');
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
            var _a = tslib_1.__read(deepParts), shallowPart = _a[0], otherParts = _a.slice(1);
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
            return tslib_1.__spread([applyScope(shallowPart)], otherParts).join(' ');
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
        // If a selector appears before :host it should not be shimmed as it
        // matches on ancestor elements and not on elements in the host's shadow
        // `:host-context(div)` is transformed to
        // `-shadowcsshost-no-combinatordiv, div -shadowcsshost-no-combinator`
        // the `div` is not part of the component in the 2nd selectors and should not be scoped.
        // Historically `component-tag:host` was matching the component so we also want to preserve
        // this behavior to avoid breaking legacy apps (it should not match).
        // The behavior should be:
        // - `tag:host` -> `tag[h]` (this is to avoid breaking legacy apps, should not match anything)
        // - `tag :host` -> `tag [h]` (`tag` is not scoped because it's considered part of a
        //   `:host-context(tag)`)
        var hasHost = selector.indexOf(_polyfillHostNoCombinator) > -1;
        // Only scope parts after the first `-shadowcsshost-no-combinator` when it is present
        var shouldScope = !hasHost;
        while ((res = sep.exec(selector)) !== null) {
            var separator = res[1];
            var part_1 = selector.slice(startIndex, res.index).trim();
            shouldScope = shouldScope || part_1.indexOf(_polyfillHostNoCombinator) > -1;
            var scopedPart = shouldScope ? _scopeSelectorPart(part_1) : part_1;
            scopedSelector += scopedPart + " " + separator + " ";
            startIndex = sep.lastIndex;
        }
        var part = selector.substring(startIndex);
        shouldScope = shouldScope || part.indexOf(_polyfillHostNoCombinator) > -1;
        scopedSelector += shouldScope ? _scopeSelectorPart(part) : part;
        // replace the placeholders with their original values
        return safeContent.restore(scopedSelector);
    };
    ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
        return selector.replace(_colonHostContextRe, _polyfillHostContext)
            .replace(_colonHostRe, _polyfillHost);
    };
    return ShadowCss;
}());
export { ShadowCss };
var SafeSelector = /** @class */ (function () {
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
// The deep combinator is deprecated in the CSS spec
// Support for `>>>`, `deep`, `::ng-deep` is then also deprecated and will be removed in the future.
// see https://github.com/angular/angular/pull/17677
var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)|(?:::ng-deep)/g;
var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
var _polyfillHostRe = /-shadowcsshost/gim;
var _colonHostRe = /:host/gim;
var _colonHostContextRe = /:host-context/gim;
var _commentRe = /\/\*\s*[\s\S]*?\*\//g;
function stripComments(input) {
    return input.replace(_commentRe, '');
}
var _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g;
function extractCommentsWithHash(input) {
    return input.match(_commentWithHashRe) || [];
}
var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
var _curlyRe = /([{}])/g;
var OPEN_CURLY = '{';
var CLOSE_CURLY = '}';
var BLOCK_PLACEHOLDER = '%BLOCK%';
var CssRule = /** @class */ (function () {
    function CssRule(selector, content) {
        this.selector = selector;
        this.content = content;
    }
    return CssRule;
}());
export { CssRule };
export function processRules(input, ruleCallback) {
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
var StringWithEscapedBlocks = /** @class */ (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZG93X2Nzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9zaGFkb3dfY3NzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7Ozs7Ozs7O0dBU0c7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFpSEU7QUFFRjtJQUdFO1FBRkEsa0JBQWEsR0FBWSxJQUFJLENBQUM7SUFFZixDQUFDO0lBRWhCOzs7Ozs7O01BT0U7SUFDRiwrQkFBVyxHQUFYLFVBQVksT0FBZSxFQUFFLFFBQWdCLEVBQUUsWUFBeUI7UUFBekIsNkJBQUEsRUFBQSxpQkFBeUI7UUFDdEUsSUFBTSxnQkFBZ0IsR0FBRyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRCxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzFFLE9BQU8sa0JBQUMsYUFBYSxHQUFLLGdCQUFnQixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRU8scUNBQWlCLEdBQXpCLFVBQTBCLE9BQWU7UUFDdkMsT0FBTyxHQUFHLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxPQUFPLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7T0Fh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QUFFLFNBQVMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFO1FBQ2xFLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7WUFDdkIsWUFBWSxFQUFFLENBQUM7U0FDaEI7UUFDRCxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUU7WUFDcEIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDTCxJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDcEMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO2FBQ3hCO1lBQ0QsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtRQUNELElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRTtZQUN0QixZQUFZLEVBQUUsQ0FBQztTQUNoQjtLQUNGO0lBQ0QsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2hDLGFBQWEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxJQUFJLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDMUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBUaGlzIGZpbGUgaXMgYSBwb3J0IG9mIHNoYWRvd0NTUyBmcm9tIHdlYmNvbXBvbmVudHMuanMgdG8gVHlwZVNjcmlwdC5cbiAqXG4gKiBQbGVhc2UgbWFrZSBzdXJlIHRvIGtlZXAgdG8gZWRpdHMgaW4gc3luYyB3aXRoIHRoZSBzb3VyY2UgZmlsZS5cbiAqXG4gKiBTb3VyY2U6XG4gKiBodHRwczovL2dpdGh1Yi5jb20vd2ViY29tcG9uZW50cy93ZWJjb21wb25lbnRzanMvYmxvYi80ZWZlY2Q3ZTBlL3NyYy9TaGFkb3dDU1MvU2hhZG93Q1NTLmpzXG4gKlxuICogVGhlIG9yaWdpbmFsIGZpbGUgbGV2ZWwgY29tbWVudCBpcyByZXByb2R1Y2VkIGJlbG93XG4gKi9cblxuLypcbiAgVGhpcyBpcyBhIGxpbWl0ZWQgc2hpbSBmb3IgU2hhZG93RE9NIGNzcyBzdHlsaW5nLlxuICBodHRwczovL2R2Y3MudzMub3JnL2hnL3dlYmNvbXBvbmVudHMvcmF3LWZpbGUvdGlwL3NwZWMvc2hhZG93L2luZGV4Lmh0bWwjc3R5bGVzXG5cbiAgVGhlIGludGVudGlvbiBoZXJlIGlzIHRvIHN1cHBvcnQgb25seSB0aGUgc3R5bGluZyBmZWF0dXJlcyB3aGljaCBjYW4gYmVcbiAgcmVsYXRpdmVseSBzaW1wbHkgaW1wbGVtZW50ZWQuIFRoZSBnb2FsIGlzIHRvIGFsbG93IHVzZXJzIHRvIGF2b2lkIHRoZVxuICBtb3N0IG9idmlvdXMgcGl0ZmFsbHMgYW5kIGRvIHNvIHdpdGhvdXQgY29tcHJvbWlzaW5nIHBlcmZvcm1hbmNlIHNpZ25pZmljYW50bHkuXG4gIEZvciBTaGFkb3dET00gc3R5bGluZyB0aGF0J3Mgbm90IGNvdmVyZWQgaGVyZSwgYSBzZXQgb2YgYmVzdCBwcmFjdGljZXNcbiAgY2FuIGJlIHByb3ZpZGVkIHRoYXQgc2hvdWxkIGFsbG93IHVzZXJzIHRvIGFjY29tcGxpc2ggbW9yZSBjb21wbGV4IHN0eWxpbmcuXG5cbiAgVGhlIGZvbGxvd2luZyBpcyBhIGxpc3Qgb2Ygc3BlY2lmaWMgU2hhZG93RE9NIHN0eWxpbmcgZmVhdHVyZXMgYW5kIGEgYnJpZWZcbiAgZGlzY3Vzc2lvbiBvZiB0aGUgYXBwcm9hY2ggdXNlZCB0byBzaGltLlxuXG4gIFNoaW1tZWQgZmVhdHVyZXM6XG5cbiAgKiA6aG9zdCwgOmhvc3QtY29udGV4dDogU2hhZG93RE9NIGFsbG93cyBzdHlsaW5nIG9mIHRoZSBzaGFkb3dSb290J3MgaG9zdFxuICBlbGVtZW50IHVzaW5nIHRoZSA6aG9zdCBydWxlLiBUbyBzaGltIHRoaXMgZmVhdHVyZSwgdGhlIDpob3N0IHN0eWxlcyBhcmVcbiAgcmVmb3JtYXR0ZWQgYW5kIHByZWZpeGVkIHdpdGggYSBnaXZlbiBzY29wZSBuYW1lIGFuZCBwcm9tb3RlZCB0byBhXG4gIGRvY3VtZW50IGxldmVsIHN0eWxlc2hlZXQuXG4gIEZvciBleGFtcGxlLCBnaXZlbiBhIHNjb3BlIG5hbWUgb2YgLmZvbywgYSBydWxlIGxpa2UgdGhpczpcblxuICAgIDpob3N0IHtcbiAgICAgICAgYmFja2dyb3VuZDogcmVkO1xuICAgICAgfVxuICAgIH1cblxuICBiZWNvbWVzOlxuXG4gICAgLmZvbyB7XG4gICAgICBiYWNrZ3JvdW5kOiByZWQ7XG4gICAgfVxuXG4gICogZW5jYXBzdWxhdGlvbjogU3R5bGVzIGRlZmluZWQgd2l0aGluIFNoYWRvd0RPTSwgYXBwbHkgb25seSB0b1xuICBkb20gaW5zaWRlIHRoZSBTaGFkb3dET00uIFBvbHltZXIgdXNlcyBvbmUgb2YgdHdvIHRlY2huaXF1ZXMgdG8gaW1wbGVtZW50XG4gIHRoaXMgZmVhdHVyZS5cblxuICBCeSBkZWZhdWx0LCBydWxlcyBhcmUgcHJlZml4ZWQgd2l0aCB0aGUgaG9zdCBlbGVtZW50IHRhZyBuYW1lXG4gIGFzIGEgZGVzY2VuZGFudCBzZWxlY3Rvci4gVGhpcyBlbnN1cmVzIHN0eWxpbmcgZG9lcyBub3QgbGVhayBvdXQgb2YgdGhlICd0b3AnXG4gIG9mIHRoZSBlbGVtZW50J3MgU2hhZG93RE9NLiBGb3IgZXhhbXBsZSxcblxuICBkaXYge1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuXG4gIGJlY29tZXM6XG5cbiAgeC1mb28gZGl2IHtcbiAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIH1cblxuICBiZWNvbWVzOlxuXG5cbiAgQWx0ZXJuYXRpdmVseSwgaWYgV2ViQ29tcG9uZW50cy5TaGFkb3dDU1Muc3RyaWN0U3R5bGluZyBpcyBzZXQgdG8gdHJ1ZSB0aGVuXG4gIHNlbGVjdG9ycyBhcmUgc2NvcGVkIGJ5IGFkZGluZyBhbiBhdHRyaWJ1dGUgc2VsZWN0b3Igc3VmZml4IHRvIGVhY2hcbiAgc2ltcGxlIHNlbGVjdG9yIHRoYXQgY29udGFpbnMgdGhlIGhvc3QgZWxlbWVudCB0YWcgbmFtZS4gRWFjaCBlbGVtZW50XG4gIGluIHRoZSBlbGVtZW50J3MgU2hhZG93RE9NIHRlbXBsYXRlIGlzIGFsc28gZ2l2ZW4gdGhlIHNjb3BlIGF0dHJpYnV0ZS5cbiAgVGh1cywgdGhlc2UgcnVsZXMgbWF0Y2ggb25seSBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHNjb3BlIGF0dHJpYnV0ZS5cbiAgRm9yIGV4YW1wbGUsIGdpdmVuIGEgc2NvcGUgbmFtZSBvZiB4LWZvbywgYSBydWxlIGxpa2UgdGhpczpcblxuICAgIGRpdiB7XG4gICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICB9XG5cbiAgYmVjb21lczpcblxuICAgIGRpdlt4LWZvb10ge1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuXG4gIE5vdGUgdGhhdCBlbGVtZW50cyB0aGF0IGFyZSBkeW5hbWljYWxseSBhZGRlZCB0byBhIHNjb3BlIG11c3QgaGF2ZSB0aGUgc2NvcGVcbiAgc2VsZWN0b3IgYWRkZWQgdG8gdGhlbSBtYW51YWxseS5cblxuICAqIHVwcGVyL2xvd2VyIGJvdW5kIGVuY2Fwc3VsYXRpb246IFN0eWxlcyB3aGljaCBhcmUgZGVmaW5lZCBvdXRzaWRlIGFcbiAgc2hhZG93Um9vdCBzaG91bGQgbm90IGNyb3NzIHRoZSBTaGFkb3dET00gYm91bmRhcnkgYW5kIHNob3VsZCBub3QgYXBwbHlcbiAgaW5zaWRlIGEgc2hhZG93Um9vdC5cblxuICBUaGlzIHN0eWxpbmcgYmVoYXZpb3IgaXMgbm90IGVtdWxhdGVkLiBTb21lIHBvc3NpYmxlIHdheXMgdG8gZG8gdGhpcyB0aGF0XG4gIHdlcmUgcmVqZWN0ZWQgZHVlIHRvIGNvbXBsZXhpdHkgYW5kL29yIHBlcmZvcm1hbmNlIGNvbmNlcm5zIGluY2x1ZGU6ICgxKSByZXNldFxuICBldmVyeSBwb3NzaWJsZSBwcm9wZXJ0eSBmb3IgZXZlcnkgcG9zc2libGUgc2VsZWN0b3IgZm9yIGEgZ2l2ZW4gc2NvcGUgbmFtZTtcbiAgKDIpIHJlLWltcGxlbWVudCBjc3MgaW4gamF2YXNjcmlwdC5cblxuICBBcyBhbiBhbHRlcm5hdGl2ZSwgdXNlcnMgc2hvdWxkIG1ha2Ugc3VyZSB0byB1c2Ugc2VsZWN0b3JzXG4gIHNwZWNpZmljIHRvIHRoZSBzY29wZSBpbiB3aGljaCB0aGV5IGFyZSB3b3JraW5nLlxuXG4gICogOjpkaXN0cmlidXRlZDogVGhpcyBiZWhhdmlvciBpcyBub3QgZW11bGF0ZWQuIEl0J3Mgb2Z0ZW4gbm90IG5lY2Vzc2FyeVxuICB0byBzdHlsZSB0aGUgY29udGVudHMgb2YgYSBzcGVjaWZpYyBpbnNlcnRpb24gcG9pbnQgYW5kIGluc3RlYWQsIGRlc2NlbmRhbnRzXG4gIG9mIHRoZSBob3N0IGVsZW1lbnQgY2FuIGJlIHN0eWxlZCBzZWxlY3RpdmVseS4gVXNlcnMgY2FuIGFsc28gY3JlYXRlIGFuXG4gIGV4dHJhIG5vZGUgYXJvdW5kIGFuIGluc2VydGlvbiBwb2ludCBhbmQgc3R5bGUgdGhhdCBub2RlJ3MgY29udGVudHNcbiAgdmlhIGRlc2NlbmRlbnQgc2VsZWN0b3JzLiBGb3IgZXhhbXBsZSwgd2l0aCBhIHNoYWRvd1Jvb3QgbGlrZSB0aGlzOlxuXG4gICAgPHN0eWxlPlxuICAgICAgOjpjb250ZW50KGRpdikge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZWQ7XG4gICAgICB9XG4gICAgPC9zdHlsZT5cbiAgICA8Y29udGVudD48L2NvbnRlbnQ+XG5cbiAgY291bGQgYmVjb21lOlxuXG4gICAgPHN0eWxlPlxuICAgICAgLyAqQHBvbHlmaWxsIC5jb250ZW50LWNvbnRhaW5lciBkaXYgKiAvXG4gICAgICA6OmNvbnRlbnQoZGl2KSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHJlZDtcbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuICAgIDxkaXYgY2xhc3M9XCJjb250ZW50LWNvbnRhaW5lclwiPlxuICAgICAgPGNvbnRlbnQ+PC9jb250ZW50PlxuICAgIDwvZGl2PlxuXG4gIE5vdGUgdGhlIHVzZSBvZiBAcG9seWZpbGwgaW4gdGhlIGNvbW1lbnQgYWJvdmUgYSBTaGFkb3dET00gc3BlY2lmaWMgc3R5bGVcbiAgZGVjbGFyYXRpb24uIFRoaXMgaXMgYSBkaXJlY3RpdmUgdG8gdGhlIHN0eWxpbmcgc2hpbSB0byB1c2UgdGhlIHNlbGVjdG9yXG4gIGluIGNvbW1lbnRzIGluIGxpZXUgb2YgdGhlIG5leHQgc2VsZWN0b3Igd2hlbiBydW5uaW5nIHVuZGVyIHBvbHlmaWxsLlxuKi9cblxuZXhwb3J0IGNsYXNzIFNoYWRvd0NzcyB7XG4gIHN0cmljdFN0eWxpbmc6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICAvKlxuICAqIFNoaW0gc29tZSBjc3NUZXh0IHdpdGggdGhlIGdpdmVuIHNlbGVjdG9yLiBSZXR1cm5zIGNzc1RleHQgdGhhdCBjYW5cbiAgKiBiZSBpbmNsdWRlZCBpbiB0aGUgZG9jdW1lbnQgdmlhIFdlYkNvbXBvbmVudHMuU2hhZG93Q1NTLmFkZENzc1RvRG9jdW1lbnQoY3NzKS5cbiAgKlxuICAqIFdoZW4gc3RyaWN0U3R5bGluZyBpcyB0cnVlOlxuICAqIC0gc2VsZWN0b3IgaXMgdGhlIGF0dHJpYnV0ZSBhZGRlZCB0byBhbGwgZWxlbWVudHMgaW5zaWRlIHRoZSBob3N0LFxuICAqIC0gaG9zdFNlbGVjdG9yIGlzIHRoZSBhdHRyaWJ1dGUgYWRkZWQgdG8gdGhlIGhvc3QgaXRzZWxmLlxuICAqL1xuICBzaGltQ3NzVGV4dChjc3NUZXh0OiBzdHJpbmcsIHNlbGVjdG9yOiBzdHJpbmcsIGhvc3RTZWxlY3Rvcjogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbW1lbnRzV2l0aEhhc2ggPSBleHRyYWN0Q29tbWVudHNXaXRoSGFzaChjc3NUZXh0KTtcbiAgICBjc3NUZXh0ID0gc3RyaXBDb21tZW50cyhjc3NUZXh0KTtcbiAgICBjc3NUZXh0ID0gdGhpcy5faW5zZXJ0RGlyZWN0aXZlcyhjc3NUZXh0KTtcblxuICAgIGNvbnN0IHNjb3BlZENzc1RleHQgPSB0aGlzLl9zY29wZUNzc1RleHQoY3NzVGV4dCwgc2VsZWN0b3IsIGhvc3RTZWxlY3Rvcik7XG4gICAgcmV0dXJuIFtzY29wZWRDc3NUZXh0LCAuLi5jb21tZW50c1dpdGhIYXNoXS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luc2VydERpcmVjdGl2ZXMoY3NzVGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjc3NUZXh0ID0gdGhpcy5faW5zZXJ0UG9seWZpbGxEaXJlY3RpdmVzSW5Dc3NUZXh0KGNzc1RleHQpO1xuICAgIHJldHVybiB0aGlzLl9pbnNlcnRQb2x5ZmlsbFJ1bGVzSW5Dc3NUZXh0KGNzc1RleHQpO1xuICB9XG5cbiAgLypcbiAgICogUHJvY2VzcyBzdHlsZXMgdG8gY29udmVydCBuYXRpdmUgU2hhZG93RE9NIHJ1bGVzIHRoYXQgd2lsbCB0cmlwXG4gICAqIHVwIHRoZSBjc3MgcGFyc2VyOyB3ZSByZWx5IG9uIGRlY29yYXRpbmcgdGhlIHN0eWxlc2hlZXQgd2l0aCBpbmVydCBydWxlcy5cbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHdlIGNvbnZlcnQgdGhpcyBydWxlOlxuICAgKlxuICAgKiBwb2x5ZmlsbC1uZXh0LXNlbGVjdG9yIHsgY29udGVudDogJzpob3N0IG1lbnUtaXRlbSc7IH1cbiAgICogOjpjb250ZW50IG1lbnUtaXRlbSB7XG4gICAqXG4gICAqIHRvIHRoaXM6XG4gICAqXG4gICAqIHNjb3BlTmFtZSBtZW51LWl0ZW0ge1xuICAgKlxuICAqKi9cbiAgcHJpdmF0ZSBfaW5zZXJ0UG9seWZpbGxEaXJlY3RpdmVzSW5Dc3NUZXh0KGNzc1RleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgLy8gRGlmZmVyZW5jZSB3aXRoIHdlYmNvbXBvbmVudHMuanM6IGRvZXMgbm90IGhhbmRsZSBjb21tZW50c1xuICAgIHJldHVybiBjc3NUZXh0LnJlcGxhY2UoXG4gICAgICAgIF9jc3NDb250ZW50TmV4dFNlbGVjdG9yUmUsIGZ1bmN0aW9uKC4uLm06IHN0cmluZ1tdKSB7IHJldHVybiBtWzJdICsgJ3snOyB9KTtcbiAgfVxuXG4gIC8qXG4gICAqIFByb2Nlc3Mgc3R5bGVzIHRvIGFkZCBydWxlcyB3aGljaCB3aWxsIG9ubHkgYXBwbHkgdW5kZXIgdGhlIHBvbHlmaWxsXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB3ZSBjb252ZXJ0IHRoaXMgcnVsZTpcbiAgICpcbiAgICogcG9seWZpbGwtcnVsZSB7XG4gICAqICAgY29udGVudDogJzpob3N0IG1lbnUtaXRlbSc7XG4gICAqIC4uLlxuICAgKiB9XG4gICAqXG4gICAqIHRvIHRoaXM6XG4gICAqXG4gICAqIHNjb3BlTmFtZSBtZW51LWl0ZW0gey4uLn1cbiAgICpcbiAgKiovXG4gIHByaXZhdGUgX2luc2VydFBvbHlmaWxsUnVsZXNJbkNzc1RleHQoY3NzVGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBEaWZmZXJlbmNlIHdpdGggd2ViY29tcG9uZW50cy5qczogZG9lcyBub3QgaGFuZGxlIGNvbW1lbnRzXG4gICAgcmV0dXJuIGNzc1RleHQucmVwbGFjZShfY3NzQ29udGVudFJ1bGVSZSwgKC4uLm06IHN0cmluZ1tdKSA9PiB7XG4gICAgICBjb25zdCBydWxlID0gbVswXS5yZXBsYWNlKG1bMV0sICcnKS5yZXBsYWNlKG1bMl0sICcnKTtcbiAgICAgIHJldHVybiBtWzRdICsgcnVsZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIEVuc3VyZSBzdHlsZXMgYXJlIHNjb3BlZC4gUHNldWRvLXNjb3BpbmcgdGFrZXMgYSBydWxlIGxpa2U6XG4gICAqXG4gICAqICAuZm9vIHsuLi4gfVxuICAgKlxuICAgKiAgYW5kIGNvbnZlcnRzIHRoaXMgdG9cbiAgICpcbiAgICogIHNjb3BlTmFtZSAuZm9vIHsgLi4uIH1cbiAgKi9cbiAgcHJpdmF0ZSBfc2NvcGVDc3NUZXh0KGNzc1RleHQ6IHN0cmluZywgc2NvcGVTZWxlY3Rvcjogc3RyaW5nLCBob3N0U2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdW5zY29wZWRSdWxlcyA9IHRoaXMuX2V4dHJhY3RVbnNjb3BlZFJ1bGVzRnJvbUNzc1RleHQoY3NzVGV4dCk7XG4gICAgLy8gcmVwbGFjZSA6aG9zdCBhbmQgOmhvc3QtY29udGV4dCAtc2hhZG93Y3NzaG9zdCBhbmQgLXNoYWRvd2Nzc2hvc3QgcmVzcGVjdGl2ZWx5XG4gICAgY3NzVGV4dCA9IHRoaXMuX2luc2VydFBvbHlmaWxsSG9zdEluQ3NzVGV4dChjc3NUZXh0KTtcbiAgICBjc3NUZXh0ID0gdGhpcy5fY29udmVydENvbG9uSG9zdChjc3NUZXh0KTtcbiAgICBjc3NUZXh0ID0gdGhpcy5fY29udmVydENvbG9uSG9zdENvbnRleHQoY3NzVGV4dCk7XG4gICAgY3NzVGV4dCA9IHRoaXMuX2NvbnZlcnRTaGFkb3dET01TZWxlY3RvcnMoY3NzVGV4dCk7XG4gICAgaWYgKHNjb3BlU2VsZWN0b3IpIHtcbiAgICAgIGNzc1RleHQgPSB0aGlzLl9zY29wZVNlbGVjdG9ycyhjc3NUZXh0LCBzY29wZVNlbGVjdG9yLCBob3N0U2VsZWN0b3IpO1xuICAgIH1cbiAgICBjc3NUZXh0ID0gY3NzVGV4dCArICdcXG4nICsgdW5zY29wZWRSdWxlcztcbiAgICByZXR1cm4gY3NzVGV4dC50cmltKCk7XG4gIH1cblxuICAvKlxuICAgKiBQcm9jZXNzIHN0eWxlcyB0byBhZGQgcnVsZXMgd2hpY2ggd2lsbCBvbmx5IGFwcGx5IHVuZGVyIHRoZSBwb2x5ZmlsbFxuICAgKiBhbmQgZG8gbm90IHByb2Nlc3MgdmlhIENTU09NLiAoQ1NTT00gaXMgZGVzdHJ1Y3RpdmUgdG8gcnVsZXMgb24gcmFyZVxuICAgKiBvY2Nhc2lvbnMsIGUuZy4gLXdlYmtpdC1jYWxjIG9uIFNhZmFyaS4pXG4gICAqIEZvciBleGFtcGxlLCB3ZSBjb252ZXJ0IHRoaXMgcnVsZTpcbiAgICpcbiAgICogQHBvbHlmaWxsLXVuc2NvcGVkLXJ1bGUge1xuICAgKiAgIGNvbnRlbnQ6ICdtZW51LWl0ZW0nO1xuICAgKiAuLi4gfVxuICAgKlxuICAgKiB0byB0aGlzOlxuICAgKlxuICAgKiBtZW51LWl0ZW0gey4uLn1cbiAgICpcbiAgKiovXG4gIHByaXZhdGUgX2V4dHJhY3RVbnNjb3BlZFJ1bGVzRnJvbUNzc1RleHQoY3NzVGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBEaWZmZXJlbmNlIHdpdGggd2ViY29tcG9uZW50cy5qczogZG9lcyBub3QgaGFuZGxlIGNvbW1lbnRzXG4gICAgbGV0IHIgPSAnJztcbiAgICBsZXQgbTogUmVnRXhwRXhlY0FycmF5fG51bGw7XG4gICAgX2Nzc0NvbnRlbnRVbnNjb3BlZFJ1bGVSZS5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICgobSA9IF9jc3NDb250ZW50VW5zY29wZWRSdWxlUmUuZXhlYyhjc3NUZXh0KSkgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHJ1bGUgPSBtWzBdLnJlcGxhY2UobVsyXSwgJycpLnJlcGxhY2UobVsxXSwgbVs0XSk7XG4gICAgICByICs9IHJ1bGUgKyAnXFxuXFxuJztcbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICAvKlxuICAgKiBjb252ZXJ0IGEgcnVsZSBsaWtlIDpob3N0KC5mb28pID4gLmJhciB7IH1cbiAgICpcbiAgICogdG9cbiAgICpcbiAgICogLmZvbzxzY29wZU5hbWU+ID4gLmJhclxuICAqL1xuICBwcml2YXRlIF9jb252ZXJ0Q29sb25Ib3N0KGNzc1RleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2xvblJ1bGUoY3NzVGV4dCwgX2Nzc0NvbG9uSG9zdFJlLCB0aGlzLl9jb2xvbkhvc3RQYXJ0UmVwbGFjZXIpO1xuICB9XG5cbiAgLypcbiAgICogY29udmVydCBhIHJ1bGUgbGlrZSA6aG9zdC1jb250ZXh0KC5mb28pID4gLmJhciB7IH1cbiAgICpcbiAgICogdG9cbiAgICpcbiAgICogLmZvbzxzY29wZU5hbWU+ID4gLmJhciwgLmZvbyBzY29wZU5hbWUgPiAuYmFyIHsgfVxuICAgKlxuICAgKiBhbmRcbiAgICpcbiAgICogOmhvc3QtY29udGV4dCguZm9vOmhvc3QpIC5iYXIgeyAuLi4gfVxuICAgKlxuICAgKiB0b1xuICAgKlxuICAgKiAuZm9vPHNjb3BlTmFtZT4gLmJhciB7IC4uLiB9XG4gICovXG4gIHByaXZhdGUgX2NvbnZlcnRDb2xvbkhvc3RDb250ZXh0KGNzc1RleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnZlcnRDb2xvblJ1bGUoXG4gICAgICAgIGNzc1RleHQsIF9jc3NDb2xvbkhvc3RDb250ZXh0UmUsIHRoaXMuX2NvbG9uSG9zdENvbnRleHRQYXJ0UmVwbGFjZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29udmVydENvbG9uUnVsZShjc3NUZXh0OiBzdHJpbmcsIHJlZ0V4cDogUmVnRXhwLCBwYXJ0UmVwbGFjZXI6IEZ1bmN0aW9uKTogc3RyaW5nIHtcbiAgICAvLyBtWzFdID0gOmhvc3QoLWNvbnRleHQpLCBtWzJdID0gY29udGVudHMgb2YgKCksIG1bM10gcmVzdCBvZiBydWxlXG4gICAgcmV0dXJuIGNzc1RleHQucmVwbGFjZShyZWdFeHAsIGZ1bmN0aW9uKC4uLm06IHN0cmluZ1tdKSB7XG4gICAgICBpZiAobVsyXSkge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IG1bMl0uc3BsaXQoJywnKTtcbiAgICAgICAgY29uc3Qgcjogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHAgPSBwYXJ0c1tpXS50cmltKCk7XG4gICAgICAgICAgaWYgKCFwKSBicmVhaztcbiAgICAgICAgICByLnB1c2gocGFydFJlcGxhY2VyKF9wb2x5ZmlsbEhvc3ROb0NvbWJpbmF0b3IsIHAsIG1bM10pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gci5qb2luKCcsJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3BvbHlmaWxsSG9zdE5vQ29tYmluYXRvciArIG1bM107XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9jb2xvbkhvc3RDb250ZXh0UGFydFJlcGxhY2VyKGhvc3Q6IHN0cmluZywgcGFydDogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHBhcnQuaW5kZXhPZihfcG9seWZpbGxIb3N0KSA+IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29sb25Ib3N0UGFydFJlcGxhY2VyKGhvc3QsIHBhcnQsIHN1ZmZpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBob3N0ICsgcGFydCArIHN1ZmZpeCArICcsICcgKyBwYXJ0ICsgJyAnICsgaG9zdCArIHN1ZmZpeDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb2xvbkhvc3RQYXJ0UmVwbGFjZXIoaG9zdDogc3RyaW5nLCBwYXJ0OiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gaG9zdCArIHBhcnQucmVwbGFjZShfcG9seWZpbGxIb3N0LCAnJykgKyBzdWZmaXg7XG4gIH1cblxuICAvKlxuICAgKiBDb252ZXJ0IGNvbWJpbmF0b3JzIGxpa2UgOjpzaGFkb3cgYW5kIHBzZXVkby1lbGVtZW50cyBsaWtlIDo6Y29udGVudFxuICAgKiBieSByZXBsYWNpbmcgd2l0aCBzcGFjZS5cbiAgKi9cbiAgcHJpdmF0ZSBfY29udmVydFNoYWRvd0RPTVNlbGVjdG9ycyhjc3NUZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBfc2hhZG93RE9NU2VsZWN0b3JzUmUucmVkdWNlKChyZXN1bHQsIHBhdHRlcm4pID0+IHJlc3VsdC5yZXBsYWNlKHBhdHRlcm4sICcgJyksIGNzc1RleHQpO1xuICB9XG5cbiAgLy8gY2hhbmdlIGEgc2VsZWN0b3IgbGlrZSAnZGl2JyB0byAnbmFtZSBkaXYnXG4gIHByaXZhdGUgX3Njb3BlU2VsZWN0b3JzKGNzc1RleHQ6IHN0cmluZywgc2NvcGVTZWxlY3Rvcjogc3RyaW5nLCBob3N0U2VsZWN0b3I6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHByb2Nlc3NSdWxlcyhjc3NUZXh0LCAocnVsZTogQ3NzUnVsZSkgPT4ge1xuICAgICAgbGV0IHNlbGVjdG9yID0gcnVsZS5zZWxlY3RvcjtcbiAgICAgIGxldCBjb250ZW50ID0gcnVsZS5jb250ZW50O1xuICAgICAgaWYgKHJ1bGUuc2VsZWN0b3JbMF0gIT0gJ0AnKSB7XG4gICAgICAgIHNlbGVjdG9yID1cbiAgICAgICAgICAgIHRoaXMuX3Njb3BlU2VsZWN0b3IocnVsZS5zZWxlY3Rvciwgc2NvcGVTZWxlY3RvciwgaG9zdFNlbGVjdG9yLCB0aGlzLnN0cmljdFN0eWxpbmcpO1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICBydWxlLnNlbGVjdG9yLnN0YXJ0c1dpdGgoJ0BtZWRpYScpIHx8IHJ1bGUuc2VsZWN0b3Iuc3RhcnRzV2l0aCgnQHN1cHBvcnRzJykgfHxcbiAgICAgICAgICBydWxlLnNlbGVjdG9yLnN0YXJ0c1dpdGgoJ0BwYWdlJykgfHwgcnVsZS5zZWxlY3Rvci5zdGFydHNXaXRoKCdAZG9jdW1lbnQnKSkge1xuICAgICAgICBjb250ZW50ID0gdGhpcy5fc2NvcGVTZWxlY3RvcnMocnVsZS5jb250ZW50LCBzY29wZVNlbGVjdG9yLCBob3N0U2VsZWN0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBDc3NSdWxlKHNlbGVjdG9yLCBjb250ZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3Njb3BlU2VsZWN0b3IoXG4gICAgICBzZWxlY3Rvcjogc3RyaW5nLCBzY29wZVNlbGVjdG9yOiBzdHJpbmcsIGhvc3RTZWxlY3Rvcjogc3RyaW5nLCBzdHJpY3Q6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIHJldHVybiBzZWxlY3Rvci5zcGxpdCgnLCcpXG4gICAgICAgIC5tYXAocGFydCA9PiBwYXJ0LnRyaW0oKS5zcGxpdChfc2hhZG93RGVlcFNlbGVjdG9ycykpXG4gICAgICAgIC5tYXAoKGRlZXBQYXJ0cykgPT4ge1xuICAgICAgICAgIGNvbnN0IFtzaGFsbG93UGFydCwgLi4ub3RoZXJQYXJ0c10gPSBkZWVwUGFydHM7XG4gICAgICAgICAgY29uc3QgYXBwbHlTY29wZSA9IChzaGFsbG93UGFydDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0b3JOZWVkc1Njb3Bpbmcoc2hhbGxvd1BhcnQsIHNjb3BlU2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpY3QgP1xuICAgICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTdHJpY3RTZWxlY3RvclNjb3BlKHNoYWxsb3dQYXJ0LCBzY29wZVNlbGVjdG9yLCBob3N0U2VsZWN0b3IpIDpcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U2VsZWN0b3JTY29wZShzaGFsbG93UGFydCwgc2NvcGVTZWxlY3RvciwgaG9zdFNlbGVjdG9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaGFsbG93UGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBbYXBwbHlTY29wZShzaGFsbG93UGFydCksIC4uLm90aGVyUGFydHNdLmpvaW4oJyAnKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJywgJyk7XG4gIH1cblxuICBwcml2YXRlIF9zZWxlY3Rvck5lZWRzU2NvcGluZyhzZWxlY3Rvcjogc3RyaW5nLCBzY29wZVNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCByZSA9IHRoaXMuX21ha2VTY29wZU1hdGNoZXIoc2NvcGVTZWxlY3Rvcik7XG4gICAgcmV0dXJuICFyZS50ZXN0KHNlbGVjdG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgX21ha2VTY29wZU1hdGNoZXIoc2NvcGVTZWxlY3Rvcjogc3RyaW5nKTogUmVnRXhwIHtcbiAgICBjb25zdCBscmUgPSAvXFxbL2c7XG4gICAgY29uc3QgcnJlID0gL1xcXS9nO1xuICAgIHNjb3BlU2VsZWN0b3IgPSBzY29wZVNlbGVjdG9yLnJlcGxhY2UobHJlLCAnXFxcXFsnKS5yZXBsYWNlKHJyZSwgJ1xcXFxdJyk7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14oJyArIHNjb3BlU2VsZWN0b3IgKyAnKScgKyBfc2VsZWN0b3JSZVN1ZmZpeCwgJ20nKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5U2VsZWN0b3JTY29wZShzZWxlY3Rvcjogc3RyaW5nLCBzY29wZVNlbGVjdG9yOiBzdHJpbmcsIGhvc3RTZWxlY3Rvcjogc3RyaW5nKTpcbiAgICAgIHN0cmluZyB7XG4gICAgLy8gRGlmZmVyZW5jZSBmcm9tIHdlYmNvbXBvbmVudHMuanM6IHNjb3BlU2VsZWN0b3IgY291bGQgbm90IGJlIGFuIGFycmF5XG4gICAgcmV0dXJuIHRoaXMuX2FwcGx5U2ltcGxlU2VsZWN0b3JTY29wZShzZWxlY3Rvciwgc2NvcGVTZWxlY3RvciwgaG9zdFNlbGVjdG9yKTtcbiAgfVxuXG4gIC8vIHNjb3BlIHZpYSBuYW1lIGFuZCBbaXM9bmFtZV1cbiAgcHJpdmF0ZSBfYXBwbHlTaW1wbGVTZWxlY3RvclNjb3BlKHNlbGVjdG9yOiBzdHJpbmcsIHNjb3BlU2VsZWN0b3I6IHN0cmluZywgaG9zdFNlbGVjdG9yOiBzdHJpbmcpOlxuICAgICAgc3RyaW5nIHtcbiAgICAvLyBJbiBBbmRyb2lkIGJyb3dzZXIsIHRoZSBsYXN0SW5kZXggaXMgbm90IHJlc2V0IHdoZW4gdGhlIHJlZ2V4IGlzIHVzZWQgaW4gU3RyaW5nLnJlcGxhY2UoKVxuICAgIF9wb2x5ZmlsbEhvc3RSZS5sYXN0SW5kZXggPSAwO1xuICAgIGlmIChfcG9seWZpbGxIb3N0UmUudGVzdChzZWxlY3RvcikpIHtcbiAgICAgIGNvbnN0IHJlcGxhY2VCeSA9IHRoaXMuc3RyaWN0U3R5bGluZyA/IGBbJHtob3N0U2VsZWN0b3J9XWAgOiBzY29wZVNlbGVjdG9yO1xuICAgICAgcmV0dXJuIHNlbGVjdG9yXG4gICAgICAgICAgLnJlcGxhY2UoXG4gICAgICAgICAgICAgIF9wb2x5ZmlsbEhvc3ROb0NvbWJpbmF0b3JSZSxcbiAgICAgICAgICAgICAgKGhuYywgc2VsZWN0b3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0b3IucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgLyhbXjpdKikoOiopKC4qKS8sXG4gICAgICAgICAgICAgICAgICAgIChfOiBzdHJpbmcsIGJlZm9yZTogc3RyaW5nLCBjb2xvbjogc3RyaW5nLCBhZnRlcjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJlZm9yZSArIHJlcGxhY2VCeSArIGNvbG9uICsgYWZ0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIC5yZXBsYWNlKF9wb2x5ZmlsbEhvc3RSZSwgcmVwbGFjZUJ5ICsgJyAnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2NvcGVTZWxlY3RvciArICcgJyArIHNlbGVjdG9yO1xuICB9XG5cbiAgLy8gcmV0dXJuIGEgc2VsZWN0b3Igd2l0aCBbbmFtZV0gc3VmZml4IG9uIGVhY2ggc2ltcGxlIHNlbGVjdG9yXG4gIC8vIGUuZy4gLmZvby5iYXIgPiAuem90IGJlY29tZXMgLmZvb1tuYW1lXS5iYXJbbmFtZV0gPiAuem90W25hbWVdICAvKiogQGludGVybmFsICovXG4gIHByaXZhdGUgX2FwcGx5U3RyaWN0U2VsZWN0b3JTY29wZShzZWxlY3Rvcjogc3RyaW5nLCBzY29wZVNlbGVjdG9yOiBzdHJpbmcsIGhvc3RTZWxlY3Rvcjogc3RyaW5nKTpcbiAgICAgIHN0cmluZyB7XG4gICAgY29uc3QgaXNSZSA9IC9cXFtpcz0oW15cXF1dKilcXF0vZztcbiAgICBzY29wZVNlbGVjdG9yID0gc2NvcGVTZWxlY3Rvci5yZXBsYWNlKGlzUmUsIChfOiBzdHJpbmcsIC4uLnBhcnRzOiBzdHJpbmdbXSkgPT4gcGFydHNbMF0pO1xuXG4gICAgY29uc3QgYXR0ck5hbWUgPSAnWycgKyBzY29wZVNlbGVjdG9yICsgJ10nO1xuXG4gICAgY29uc3QgX3Njb3BlU2VsZWN0b3JQYXJ0ID0gKHA6IHN0cmluZykgPT4ge1xuICAgICAgbGV0IHNjb3BlZFAgPSBwLnRyaW0oKTtcblxuICAgICAgaWYgKCFzY29wZWRQKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHAuaW5kZXhPZihfcG9seWZpbGxIb3N0Tm9Db21iaW5hdG9yKSA+IC0xKSB7XG4gICAgICAgIHNjb3BlZFAgPSB0aGlzLl9hcHBseVNpbXBsZVNlbGVjdG9yU2NvcGUocCwgc2NvcGVTZWxlY3RvciwgaG9zdFNlbGVjdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHJlbW92ZSA6aG9zdCBzaW5jZSBpdCBzaG91bGQgYmUgdW5uZWNlc3NhcnlcbiAgICAgICAgY29uc3QgdCA9IHAucmVwbGFjZShfcG9seWZpbGxIb3N0UmUsICcnKTtcbiAgICAgICAgaWYgKHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSB0Lm1hdGNoKC8oW146XSopKDoqKSguKikvKTtcbiAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgc2NvcGVkUCA9IG1hdGNoZXNbMV0gKyBhdHRyTmFtZSArIG1hdGNoZXNbMl0gKyBtYXRjaGVzWzNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2NvcGVkUDtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2FmZUNvbnRlbnQgPSBuZXcgU2FmZVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBzZWxlY3RvciA9IHNhZmVDb250ZW50LmNvbnRlbnQoKTtcblxuICAgIGxldCBzY29wZWRTZWxlY3RvciA9ICcnO1xuICAgIGxldCBzdGFydEluZGV4ID0gMDtcbiAgICBsZXQgcmVzOiBSZWdFeHBFeGVjQXJyYXl8bnVsbDtcbiAgICBjb25zdCBzZXAgPSAvKCB8PnxcXCt8fig/IT0pKVxccyovZztcblxuICAgIC8vIElmIGEgc2VsZWN0b3IgYXBwZWFycyBiZWZvcmUgOmhvc3QgaXQgc2hvdWxkIG5vdCBiZSBzaGltbWVkIGFzIGl0XG4gICAgLy8gbWF0Y2hlcyBvbiBhbmNlc3RvciBlbGVtZW50cyBhbmQgbm90IG9uIGVsZW1lbnRzIGluIHRoZSBob3N0J3Mgc2hhZG93XG4gICAgLy8gYDpob3N0LWNvbnRleHQoZGl2KWAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgICAvLyBgLXNoYWRvd2Nzc2hvc3Qtbm8tY29tYmluYXRvcmRpdiwgZGl2IC1zaGFkb3djc3Nob3N0LW5vLWNvbWJpbmF0b3JgXG4gICAgLy8gdGhlIGBkaXZgIGlzIG5vdCBwYXJ0IG9mIHRoZSBjb21wb25lbnQgaW4gdGhlIDJuZCBzZWxlY3RvcnMgYW5kIHNob3VsZCBub3QgYmUgc2NvcGVkLlxuICAgIC8vIEhpc3RvcmljYWxseSBgY29tcG9uZW50LXRhZzpob3N0YCB3YXMgbWF0Y2hpbmcgdGhlIGNvbXBvbmVudCBzbyB3ZSBhbHNvIHdhbnQgdG8gcHJlc2VydmVcbiAgICAvLyB0aGlzIGJlaGF2aW9yIHRvIGF2b2lkIGJyZWFraW5nIGxlZ2FjeSBhcHBzIChpdCBzaG91bGQgbm90IG1hdGNoKS5cbiAgICAvLyBUaGUgYmVoYXZpb3Igc2hvdWxkIGJlOlxuICAgIC8vIC0gYHRhZzpob3N0YCAtPiBgdGFnW2hdYCAodGhpcyBpcyB0byBhdm9pZCBicmVha2luZyBsZWdhY3kgYXBwcywgc2hvdWxkIG5vdCBtYXRjaCBhbnl0aGluZylcbiAgICAvLyAtIGB0YWcgOmhvc3RgIC0+IGB0YWcgW2hdYCAoYHRhZ2AgaXMgbm90IHNjb3BlZCBiZWNhdXNlIGl0J3MgY29uc2lkZXJlZCBwYXJ0IG9mIGFcbiAgICAvLyAgIGA6aG9zdC1jb250ZXh0KHRhZylgKVxuICAgIGNvbnN0IGhhc0hvc3QgPSBzZWxlY3Rvci5pbmRleE9mKF9wb2x5ZmlsbEhvc3ROb0NvbWJpbmF0b3IpID4gLTE7XG4gICAgLy8gT25seSBzY29wZSBwYXJ0cyBhZnRlciB0aGUgZmlyc3QgYC1zaGFkb3djc3Nob3N0LW5vLWNvbWJpbmF0b3JgIHdoZW4gaXQgaXMgcHJlc2VudFxuICAgIGxldCBzaG91bGRTY29wZSA9ICFoYXNIb3N0O1xuXG4gICAgd2hpbGUgKChyZXMgPSBzZXAuZXhlYyhzZWxlY3RvcikpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSByZXNbMV07XG4gICAgICBjb25zdCBwYXJ0ID0gc2VsZWN0b3Iuc2xpY2Uoc3RhcnRJbmRleCwgcmVzLmluZGV4KS50cmltKCk7XG4gICAgICBzaG91bGRTY29wZSA9IHNob3VsZFNjb3BlIHx8IHBhcnQuaW5kZXhPZihfcG9seWZpbGxIb3N0Tm9Db21iaW5hdG9yKSA+IC0xO1xuICAgICAgY29uc3Qgc2NvcGVkUGFydCA9IHNob3VsZFNjb3BlID8gX3Njb3BlU2VsZWN0b3JQYXJ0KHBhcnQpIDogcGFydDtcbiAgICAgIHNjb3BlZFNlbGVjdG9yICs9IGAke3Njb3BlZFBhcnR9ICR7c2VwYXJhdG9yfSBgO1xuICAgICAgc3RhcnRJbmRleCA9IHNlcC5sYXN0SW5kZXg7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydCA9IHNlbGVjdG9yLnN1YnN0cmluZyhzdGFydEluZGV4KTtcbiAgICBzaG91bGRTY29wZSA9IHNob3VsZFNjb3BlIHx8IHBhcnQuaW5kZXhPZihfcG9seWZpbGxIb3N0Tm9Db21iaW5hdG9yKSA+IC0xO1xuICAgIHNjb3BlZFNlbGVjdG9yICs9IHNob3VsZFNjb3BlID8gX3Njb3BlU2VsZWN0b3JQYXJ0KHBhcnQpIDogcGFydDtcblxuICAgIC8vIHJlcGxhY2UgdGhlIHBsYWNlaG9sZGVycyB3aXRoIHRoZWlyIG9yaWdpbmFsIHZhbHVlc1xuICAgIHJldHVybiBzYWZlQ29udGVudC5yZXN0b3JlKHNjb3BlZFNlbGVjdG9yKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luc2VydFBvbHlmaWxsSG9zdEluQ3NzVGV4dChzZWxlY3Rvcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc2VsZWN0b3IucmVwbGFjZShfY29sb25Ib3N0Q29udGV4dFJlLCBfcG9seWZpbGxIb3N0Q29udGV4dClcbiAgICAgICAgLnJlcGxhY2UoX2NvbG9uSG9zdFJlLCBfcG9seWZpbGxIb3N0KTtcbiAgfVxufVxuXG5jbGFzcyBTYWZlU2VsZWN0b3Ige1xuICBwcml2YXRlIHBsYWNlaG9sZGVyczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XG4gIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzZWxlY3Rvcjogc3RyaW5nKSB7XG4gICAgLy8gUmVwbGFjZXMgYXR0cmlidXRlIHNlbGVjdG9ycyB3aXRoIHBsYWNlaG9sZGVycy5cbiAgICAvLyBUaGUgV1MgaW4gW2F0dHI9XCJ2YSBsdWVcIl0gd291bGQgb3RoZXJ3aXNlIGJlIGludGVycHJldGVkIGFzIGEgc2VsZWN0b3Igc2VwYXJhdG9yLlxuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgvKFxcW1teXFxdXSpcXF0pL2csIChfLCBrZWVwKSA9PiB7XG4gICAgICBjb25zdCByZXBsYWNlQnkgPSBgX19waC0ke3RoaXMuaW5kZXh9X19gO1xuICAgICAgdGhpcy5wbGFjZWhvbGRlcnMucHVzaChrZWVwKTtcbiAgICAgIHRoaXMuaW5kZXgrKztcbiAgICAgIHJldHVybiByZXBsYWNlQnk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlcyB0aGUgZXhwcmVzc2lvbiBpbiBgOm50aC1jaGlsZCgybiArIDEpYCB3aXRoIGEgcGxhY2Vob2xkZXIuXG4gICAgLy8gV1MgYW5kIFwiK1wiIHdvdWxkIG90aGVyd2lzZSBiZSBpbnRlcnByZXRlZCBhcyBzZWxlY3RvciBzZXBhcmF0b3JzLlxuICAgIHRoaXMuX2NvbnRlbnQgPSBzZWxlY3Rvci5yZXBsYWNlKC8oOm50aC1bLVxcd10rKShcXChbXildK1xcKSkvZywgKF8sIHBzZXVkbywgZXhwKSA9PiB7XG4gICAgICBjb25zdCByZXBsYWNlQnkgPSBgX19waC0ke3RoaXMuaW5kZXh9X19gO1xuICAgICAgdGhpcy5wbGFjZWhvbGRlcnMucHVzaChleHApO1xuICAgICAgdGhpcy5pbmRleCsrO1xuICAgICAgcmV0dXJuIHBzZXVkbyArIHJlcGxhY2VCeTtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc3RvcmUoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKC9fX3BoLShcXGQrKV9fL2csIChwaCwgaW5kZXgpID0+IHRoaXMucGxhY2Vob2xkZXJzWytpbmRleF0pO1xuICB9XG5cbiAgY29udGVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fY29udGVudDsgfVxufVxuXG5jb25zdCBfY3NzQ29udGVudE5leHRTZWxlY3RvclJlID1cbiAgICAvcG9seWZpbGwtbmV4dC1zZWxlY3RvcltefV0qY29udGVudDpbXFxzXSo/KFsnXCJdKSguKj8pXFwxWztcXHNdKn0oW157XSo/KXsvZ2ltO1xuY29uc3QgX2Nzc0NvbnRlbnRSdWxlUmUgPSAvKHBvbHlmaWxsLXJ1bGUpW159XSooY29udGVudDpbXFxzXSooWydcIl0pKC4qPylcXDMpWztcXHNdKltefV0qfS9naW07XG5jb25zdCBfY3NzQ29udGVudFVuc2NvcGVkUnVsZVJlID1cbiAgICAvKHBvbHlmaWxsLXVuc2NvcGVkLXJ1bGUpW159XSooY29udGVudDpbXFxzXSooWydcIl0pKC4qPylcXDMpWztcXHNdKltefV0qfS9naW07XG5jb25zdCBfcG9seWZpbGxIb3N0ID0gJy1zaGFkb3djc3Nob3N0Jztcbi8vIG5vdGU6IDpob3N0LWNvbnRleHQgcHJlLXByb2Nlc3NlZCB0byAtc2hhZG93Y3NzaG9zdGNvbnRleHQuXG5jb25zdCBfcG9seWZpbGxIb3N0Q29udGV4dCA9ICctc2hhZG93Y3NzY29udGV4dCc7XG5jb25zdCBfcGFyZW5TdWZmaXggPSAnKSg/OlxcXFwoKCcgK1xuICAgICcoPzpcXFxcKFteKShdKlxcXFwpfFteKShdKikrPycgK1xuICAgICcpXFxcXCkpPyhbXix7XSopJztcbmNvbnN0IF9jc3NDb2xvbkhvc3RSZSA9IG5ldyBSZWdFeHAoJygnICsgX3BvbHlmaWxsSG9zdCArIF9wYXJlblN1ZmZpeCwgJ2dpbScpO1xuY29uc3QgX2Nzc0NvbG9uSG9zdENvbnRleHRSZSA9IG5ldyBSZWdFeHAoJygnICsgX3BvbHlmaWxsSG9zdENvbnRleHQgKyBfcGFyZW5TdWZmaXgsICdnaW0nKTtcbmNvbnN0IF9wb2x5ZmlsbEhvc3ROb0NvbWJpbmF0b3IgPSBfcG9seWZpbGxIb3N0ICsgJy1uby1jb21iaW5hdG9yJztcbmNvbnN0IF9wb2x5ZmlsbEhvc3ROb0NvbWJpbmF0b3JSZSA9IC8tc2hhZG93Y3NzaG9zdC1uby1jb21iaW5hdG9yKFteXFxzXSopLztcbmNvbnN0IF9zaGFkb3dET01TZWxlY3RvcnNSZSA9IFtcbiAgLzo6c2hhZG93L2csXG4gIC86OmNvbnRlbnQvZyxcbiAgLy8gRGVwcmVjYXRlZCBzZWxlY3RvcnNcbiAgL1xcL3NoYWRvdy1kZWVwXFwvL2csXG4gIC9cXC9zaGFkb3dcXC8vZyxcbl07XG5cbi8vIFRoZSBkZWVwIGNvbWJpbmF0b3IgaXMgZGVwcmVjYXRlZCBpbiB0aGUgQ1NTIHNwZWNcbi8vIFN1cHBvcnQgZm9yIGA+Pj5gLCBgZGVlcGAsIGA6Om5nLWRlZXBgIGlzIHRoZW4gYWxzbyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS5cbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL3B1bGwvMTc2NzdcbmNvbnN0IF9zaGFkb3dEZWVwU2VsZWN0b3JzID0gLyg/Oj4+Pil8KD86XFwvZGVlcFxcLyl8KD86OjpuZy1kZWVwKS9nO1xuY29uc3QgX3NlbGVjdG9yUmVTdWZmaXggPSAnKFs+XFxcXHN+K1xcWy4sezpdW1xcXFxzXFxcXFNdKik/JCc7XG5jb25zdCBfcG9seWZpbGxIb3N0UmUgPSAvLXNoYWRvd2Nzc2hvc3QvZ2ltO1xuY29uc3QgX2NvbG9uSG9zdFJlID0gLzpob3N0L2dpbTtcbmNvbnN0IF9jb2xvbkhvc3RDb250ZXh0UmUgPSAvOmhvc3QtY29udGV4dC9naW07XG5cbmNvbnN0IF9jb21tZW50UmUgPSAvXFwvXFwqXFxzKltcXHNcXFNdKj9cXCpcXC8vZztcblxuZnVuY3Rpb24gc3RyaXBDb21tZW50cyhpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlucHV0LnJlcGxhY2UoX2NvbW1lbnRSZSwgJycpO1xufVxuXG5jb25zdCBfY29tbWVudFdpdGhIYXNoUmUgPSAvXFwvXFwqXFxzKiNcXHMqc291cmNlKE1hcHBpbmcpP1VSTD1bXFxzXFxTXSs/XFwqXFwvL2c7XG5cbmZ1bmN0aW9uIGV4dHJhY3RDb21tZW50c1dpdGhIYXNoKGlucHV0OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBpbnB1dC5tYXRjaChfY29tbWVudFdpdGhIYXNoUmUpIHx8IFtdO1xufVxuXG5jb25zdCBfcnVsZVJlID0gLyhcXHMqKShbXjtcXHtcXH1dKz8pKFxccyopKCg/OnslQkxPQ0slfT9cXHMqOz8pfCg/Olxccyo7KSkvZztcbmNvbnN0IF9jdXJseVJlID0gLyhbe31dKS9nO1xuY29uc3QgT1BFTl9DVVJMWSA9ICd7JztcbmNvbnN0IENMT1NFX0NVUkxZID0gJ30nO1xuY29uc3QgQkxPQ0tfUExBQ0VIT0xERVIgPSAnJUJMT0NLJSc7XG5cbmV4cG9ydCBjbGFzcyBDc3NSdWxlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHNlbGVjdG9yOiBzdHJpbmcsIHB1YmxpYyBjb250ZW50OiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzUnVsZXMoaW5wdXQ6IHN0cmluZywgcnVsZUNhbGxiYWNrOiAocnVsZTogQ3NzUnVsZSkgPT4gQ3NzUnVsZSk6IHN0cmluZyB7XG4gIGNvbnN0IGlucHV0V2l0aEVzY2FwZWRCbG9ja3MgPSBlc2NhcGVCbG9ja3MoaW5wdXQpO1xuICBsZXQgbmV4dEJsb2NrSW5kZXggPSAwO1xuICByZXR1cm4gaW5wdXRXaXRoRXNjYXBlZEJsb2Nrcy5lc2NhcGVkU3RyaW5nLnJlcGxhY2UoX3J1bGVSZSwgZnVuY3Rpb24oLi4ubTogc3RyaW5nW10pIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IG1bMl07XG4gICAgbGV0IGNvbnRlbnQgPSAnJztcbiAgICBsZXQgc3VmZml4ID0gbVs0XTtcbiAgICBsZXQgY29udGVudFByZWZpeCA9ICcnO1xuICAgIGlmIChzdWZmaXggJiYgc3VmZml4LnN0YXJ0c1dpdGgoJ3snICsgQkxPQ0tfUExBQ0VIT0xERVIpKSB7XG4gICAgICBjb250ZW50ID0gaW5wdXRXaXRoRXNjYXBlZEJsb2Nrcy5ibG9ja3NbbmV4dEJsb2NrSW5kZXgrK107XG4gICAgICBzdWZmaXggPSBzdWZmaXguc3Vic3RyaW5nKEJMT0NLX1BMQUNFSE9MREVSLmxlbmd0aCArIDEpO1xuICAgICAgY29udGVudFByZWZpeCA9ICd7JztcbiAgICB9XG4gICAgY29uc3QgcnVsZSA9IHJ1bGVDYWxsYmFjayhuZXcgQ3NzUnVsZShzZWxlY3RvciwgY29udGVudCkpO1xuICAgIHJldHVybiBgJHttWzFdfSR7cnVsZS5zZWxlY3Rvcn0ke21bM119JHtjb250ZW50UHJlZml4fSR7cnVsZS5jb250ZW50fSR7c3VmZml4fWA7XG4gIH0pO1xufVxuXG5jbGFzcyBTdHJpbmdXaXRoRXNjYXBlZEJsb2NrcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlc2NhcGVkU3RyaW5nOiBzdHJpbmcsIHB1YmxpYyBibG9ja3M6IHN0cmluZ1tdKSB7fVxufVxuXG5mdW5jdGlvbiBlc2NhcGVCbG9ja3MoaW5wdXQ6IHN0cmluZyk6IFN0cmluZ1dpdGhFc2NhcGVkQmxvY2tzIHtcbiAgY29uc3QgaW5wdXRQYXJ0cyA9IGlucHV0LnNwbGl0KF9jdXJseVJlKTtcbiAgY29uc3QgcmVzdWx0UGFydHM6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IGVzY2FwZWRCbG9ja3M6IHN0cmluZ1tdID0gW107XG4gIGxldCBicmFja2V0Q291bnQgPSAwO1xuICBsZXQgY3VycmVudEJsb2NrUGFydHM6IHN0cmluZ1tdID0gW107XG4gIGZvciAobGV0IHBhcnRJbmRleCA9IDA7IHBhcnRJbmRleCA8IGlucHV0UGFydHMubGVuZ3RoOyBwYXJ0SW5kZXgrKykge1xuICAgIGNvbnN0IHBhcnQgPSBpbnB1dFBhcnRzW3BhcnRJbmRleF07XG4gICAgaWYgKHBhcnQgPT0gQ0xPU0VfQ1VSTFkpIHtcbiAgICAgIGJyYWNrZXRDb3VudC0tO1xuICAgIH1cbiAgICBpZiAoYnJhY2tldENvdW50ID4gMCkge1xuICAgICAgY3VycmVudEJsb2NrUGFydHMucHVzaChwYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGN1cnJlbnRCbG9ja1BhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXNjYXBlZEJsb2Nrcy5wdXNoKGN1cnJlbnRCbG9ja1BhcnRzLmpvaW4oJycpKTtcbiAgICAgICAgcmVzdWx0UGFydHMucHVzaChCTE9DS19QTEFDRUhPTERFUik7XG4gICAgICAgIGN1cnJlbnRCbG9ja1BhcnRzID0gW107XG4gICAgICB9XG4gICAgICByZXN1bHRQYXJ0cy5wdXNoKHBhcnQpO1xuICAgIH1cbiAgICBpZiAocGFydCA9PSBPUEVOX0NVUkxZKSB7XG4gICAgICBicmFja2V0Q291bnQrKztcbiAgICB9XG4gIH1cbiAgaWYgKGN1cnJlbnRCbG9ja1BhcnRzLmxlbmd0aCA+IDApIHtcbiAgICBlc2NhcGVkQmxvY2tzLnB1c2goY3VycmVudEJsb2NrUGFydHMuam9pbignJykpO1xuICAgIHJlc3VsdFBhcnRzLnB1c2goQkxPQ0tfUExBQ0VIT0xERVIpO1xuICB9XG4gIHJldHVybiBuZXcgU3RyaW5nV2l0aEVzY2FwZWRCbG9ja3MocmVzdWx0UGFydHMuam9pbignJyksIGVzY2FwZWRCbG9ja3MpO1xufVxuIl19