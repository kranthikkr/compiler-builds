/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getHtmlTagDefinition } from './ml_parser/html_tags';
const _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' + //":not("
    '([-\\w]+)|' + // "tag"
    '(?:\\.([-\\w]+))|' + // ".class"
    // "-" should appear first in the regexp below as FF31 parses "[.-\w]" as a range
    '(?:\\[([-.\\w*]+)(?:=([\"\']?)([^\\]\"\']*)\\5)?\\])|' + // "[name]", "[name=value]",
    // "[name="value"]",
    // "[name='value']"
    '(\\))|' + // ")"
    '(\\s*,\\s*)', // ","
'g');
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
export class CssSelector {
    constructor() {
        this.element = null;
        this.classNames = [];
        /**
         * The selectors are encoded in pairs where:
         * - even locations are attribute names
         * - odd locations are attribute values.
         *
         * Example:
         * Selector: `[key1=value1][key2]` would parse to:
         * ```
         * ['key1', 'value1', 'key2', '']
         * ```
         */
        this.attrs = [];
        this.notSelectors = [];
    }
    static parse(selector) {
        const results = [];
        const _addResult = (res, cssSel) => {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        let cssSelector = new CssSelector();
        let match;
        let current = cssSelector;
        let inNot = false;
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
    }
    isElementSelector() {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    }
    hasElementSelector() { return !!this.element; }
    setElement(element = null) { this.element = element; }
    /** Gets a template string for an element that matches the selector. */
    getMatchingElementTemplate() {
        const tagName = this.element || 'div';
        const classAttr = this.classNames.length > 0 ? ` class="${this.classNames.join(' ')}"` : '';
        let attrs = '';
        for (let i = 0; i < this.attrs.length; i += 2) {
            const attrName = this.attrs[i];
            const attrValue = this.attrs[i + 1] !== '' ? `="${this.attrs[i + 1]}"` : '';
            attrs += ` ${attrName}${attrValue}`;
        }
        return getHtmlTagDefinition(tagName).isVoid ? `<${tagName}${classAttr}${attrs}/>` :
            `<${tagName}${classAttr}${attrs}></${tagName}>`;
    }
    getAttrs() {
        const result = [];
        if (this.classNames.length > 0) {
            result.push('class', this.classNames.join(' '));
        }
        return result.concat(this.attrs);
    }
    addAttribute(name, value = '') {
        this.attrs.push(name, value && value.toLowerCase() || '');
    }
    addClassName(name) { this.classNames.push(name.toLowerCase()); }
    toString() {
        let res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(klass => res += `.${klass}`);
        }
        if (this.attrs) {
            for (let i = 0; i < this.attrs.length; i += 2) {
                const name = this.attrs[i];
                const value = this.attrs[i + 1];
                res += `[${name}${value ? '=' + value : ''}]`;
            }
        }
        this.notSelectors.forEach(notSelector => res += `:not(${notSelector})`);
        return res;
    }
}
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
export class SelectorMatcher {
    constructor() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    static createNotMatcher(notSelectors) {
        const notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    }
    addSelectables(cssSelectors, callbackCtxt) {
        let listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (let i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    }
    /**
     * Add an object that can be found later on by calling `match`.
     * @param cssSelector A css selector
     * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
     */
    _addSelectable(cssSelector, callbackCtxt, listContext) {
        let matcher = this;
        const element = cssSelector.element;
        const classNames = cssSelector.classNames;
        const attrs = cssSelector.attrs;
        const selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            const isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (let i = 0; i < classNames.length; i++) {
                const isTerminal = attrs.length === 0 && i === classNames.length - 1;
                const className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (let i = 0; i < attrs.length; i += 2) {
                const isTerminal = i === attrs.length - 2;
                const name = attrs[i];
                const value = attrs[i + 1];
                if (isTerminal) {
                    const terminalMap = matcher._attrValueMap;
                    let terminalValuesMap = terminalMap.get(name);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    const partialMap = matcher._attrValuePartialMap;
                    let partialValuesMap = partialMap.get(name);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    }
    _addTerminal(map, name, selectable) {
        let terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    }
    _addPartial(map, name) {
        let matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    }
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param cssSelector A css selector
     * @param matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return boolean true if a match was found
    */
    match(cssSelector, matchedCallback) {
        let result = false;
        const element = cssSelector.element;
        const classNames = cssSelector.classNames;
        const attrs = cssSelector.attrs;
        for (let i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (let i = 0; i < classNames.length; i++) {
                const className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (let i = 0; i < attrs.length; i += 2) {
                const name = attrs[i];
                const value = attrs[i + 1];
                const terminalValuesMap = this._attrValueMap.get(name);
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                const partialValuesMap = this._attrValuePartialMap.get(name);
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    }
    /** @internal */
    _matchTerminal(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        let selectables = map.get(name) || [];
        const starSelectables = map.get('*');
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        let selectable;
        let result = false;
        for (let i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    }
    /** @internal */
    _matchPartial(map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        const nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    }
}
export class SelectorListContext {
    constructor(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
}
// Store context to pass back selector and context when a selector is matched
export class SelectorContext {
    constructor(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    finalize(cssSelector, callback) {
        let result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            const notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLE1BQU0sQ0FDL0IsY0FBYyxHQUFhLFNBQVM7SUFDaEMsWUFBWSxHQUFXLFFBQVE7SUFDL0IsbUJBQW1CLEdBQUksV0FBVztJQUNsQyxpRkFBaUY7SUFDakYsdURBQXVELEdBQUksNEJBQTRCO0lBQzVCLG9CQUFvQjtJQUNwQixtQkFBbUI7SUFDOUUsUUFBUSxHQUFtRCxNQUFNO0lBQ2pFLGFBQWEsRUFBOEMsTUFBTTtBQUNyRSxHQUFHLENBQUMsQ0FBQztBQUVUOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sV0FBVztJQUF4QjtRQUNFLFlBQU8sR0FBZ0IsSUFBSSxDQUFDO1FBQzVCLGVBQVUsR0FBYSxFQUFFLENBQUM7UUFDMUI7Ozs7Ozs7Ozs7V0FVRztRQUNILFVBQUssR0FBYSxFQUFFLENBQUM7UUFDckIsaUJBQVksR0FBa0IsRUFBRSxDQUFDO0lBd0duQyxDQUFDO0lBdEdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBZ0I7UUFDM0IsTUFBTSxPQUFPLEdBQWtCLEVBQUUsQ0FBQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsTUFBbUIsRUFBRSxFQUFFO1lBQzdELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDO2dCQUNsRixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxPQUFPLEdB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RixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzNGLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkUsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFDRCxJQUFJLE1BQU0sSUFBSSxRQUFRLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ2pGLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2FBQ3hDO1lBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3pDO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2dldEh0bWxUYWdEZWZpbml0aW9ufSBmcm9tICcuL21sX3BhcnNlci9odG1sX3RhZ3MnO1xuXG5jb25zdCBfU0VMRUNUT1JfUkVHRVhQID0gbmV3IFJlZ0V4cChcbiAgICAnKFxcXFw6bm90XFxcXCgpfCcgKyAgICAgICAgICAgLy9cIjpub3QoXCJcbiAgICAgICAgJyhbLVxcXFx3XSspfCcgKyAgICAgICAgIC8vIFwidGFnXCJcbiAgICAgICAgJyg/OlxcXFwuKFstXFxcXHddKykpfCcgKyAgLy8gXCIuY2xhc3NcIlxuICAgICAgICAvLyBcIi1cIiBzaG91bGQgYXBwZWFyIGZpcnN0IGluIHRoZSByZWdleHAgYmVsb3cgYXMgRkYzMSBwYXJzZXMgXCJbLi1cXHddXCIgYXMgYSByYW5nZVxuICAgICAgICAnKD86XFxcXFsoWy0uXFxcXHcqXSspKD86PShbXFxcIlxcJ10/KShbXlxcXFxdXFxcIlxcJ10qKVxcXFw1KT9cXFxcXSl8JyArICAvLyBcIltuYW1lXVwiLCBcIltuYW1lPXZhbHVlXVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiW25hbWU9XCJ2YWx1ZVwiXVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiW25hbWU9J3ZhbHVlJ11cIlxuICAgICAgICAnKFxcXFwpKXwnICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCIpXCJcbiAgICAgICAgJyhcXFxccyosXFxcXHMqKScsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCIsXCJcbiAgICAnZycpO1xuXG4vKipcbiAqIEEgY3NzIHNlbGVjdG9yIGNvbnRhaW5zIGFuIGVsZW1lbnQgbmFtZSxcbiAqIGNzcyBjbGFzc2VzIGFuZCBhdHRyaWJ1dGUvdmFsdWUgcGFpcnMgd2l0aCB0aGUgcHVycG9zZVxuICogb2Ygc2VsZWN0aW5nIHN1YnNldHMgb3V0IG9mIHRoZW0uXG4gKi9cbmV4cG9ydCBjbGFzcyBDc3NTZWxlY3RvciB7XG4gIGVsZW1lbnQ6IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgY2xhc3NOYW1lczogc3RyaW5nW10gPSBbXTtcbiAgLyoqXG4gICAqIFRoZSBzZWxlY3RvcnMgYXJlIGVuY29kZWQgaW4gcGFpcnMgd2hlcmU6XG4gICAqIC0gZXZlbiBsb2NhdGlvbnMgYXJlIGF0dHJpYnV0ZSBuYW1lc1xuICAgKiAtIG9kZCBsb2NhdGlvbnMgYXJlIGF0dHJpYnV0ZSB2YWx1ZXMuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqIFNlbGVjdG9yOiBgW2tleTE9dmFsdWUxXVtrZXkyXWAgd291bGQgcGFyc2UgdG86XG4gICAqIGBgYFxuICAgKiBbJ2tleTEnLCAndmFsdWUxJywgJ2tleTInLCAnJ11cbiAgICogYGBgXG4gICAqL1xuICBhdHRyczogc3RyaW5nW10gPSBbXTtcbiAgbm90U2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdID0gW107XG5cbiAgc3RhdGljIHBhcnNlKHNlbGVjdG9yOiBzdHJpbmcpOiBDc3NTZWxlY3RvcltdIHtcbiAgICBjb25zdCByZXN1bHRzOiBDc3NTZWxlY3RvcltdID0gW107XG4gICAgY29uc3QgX2FkZFJlc3VsdCA9IChyZXM6IENzc1NlbGVjdG9yW10sIGNzc1NlbDogQ3NzU2VsZWN0b3IpID0+IHtcbiAgICAgIGlmIChjc3NTZWwubm90U2VsZWN0b3JzLmxlbmd0aCA+IDAgJiYgIWNzc1NlbC5lbGVtZW50ICYmIGNzc1NlbC5jbGFzc05hbWVzLmxlbmd0aCA9PSAwICYmXG4gICAgICAgICAgY3NzU2VsLmF0dHJzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIGNzc1NlbC5lbGVtZW50ID0gJyonO1xuICAgICAgfVxuICAgICAgcmVzLnB1c2goY3NzU2VsKTtcbiAgICB9O1xuICAgIGxldCBjc3NTZWxlY3RvciA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgIGxldCBtYXRjaDogc3RyaW5nW118bnVsbDtcbiAgICBsZXQgY3VycmVudCA9IGNzc1NlbGVjdG9yO1xuICAgIGxldCBpbk5vdCA9IGZhbHNlO1xuICAgIF9TRUxFQ1RPUl9SRUdFWFAubGFzdEluZGV4ID0gMDtcbiAgICB3aGlsZSAobWF0Y2ggPSBfU0VMRUNUT1JfUkVHRVhQLmV4ZWMoc2VsZWN0b3IpKSB7XG4gICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgaWYgKGluTm90KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOZXN0aW5nIDpub3QgaXMgbm90IGFsbG93ZWQgaW4gYSBzZWxlY3RvcicpO1xuICAgICAgICB9XG4gICAgICAgIGluTm90ID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudCA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgICAgICBjc3NTZWxlY3Rvci5ub3RTZWxlY3RvcnMucHVzaChjdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICBjdXJyZW50LnNldEVsZW1lbnQobWF0Y2hbMl0pO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoWzNdKSB7XG4gICAgICAgIGN1cnJlbnQuYWRkQ2xhc3NOYW1lKG1hdGNoWzNdKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaFs0XSkge1xuICAgICAgICBjdXJyZW50LmFkZEF0dHJpYnV0ZShtYXRjaFs0XSwgbWF0Y2hbNl0pO1xuICAgICAgfVxuICAgICAgaWYgKG1hdGNoWzddKSB7XG4gICAgICAgIGluTm90ID0gZmFsc2U7XG4gICAgICAgIGN1cnJlbnQgPSBjc3NTZWxlY3RvcjtcbiAgICAgIH1cbiAgICAgIGlmIChtYXRjaFs4XSkge1xuICAgICAgICBpZiAoaW5Ob3QpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpcGxlIHNlbGVjdG9ycyBpbiA6bm90IGFyZSBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgX2FkZFJlc3VsdChyZXN1bHRzLCBjc3NTZWxlY3Rvcik7XG4gICAgICAgIGNzc1NlbGVjdG9yID0gY3VycmVudCA9IG5ldyBDc3NTZWxlY3RvcigpO1xuICAgICAgfVxuICAgIH1cbiAgICBfYWRkUmVzdWx0KHJlc3VsdHMsIGNzc1NlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGlzRWxlbWVudFNlbGVjdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhhc0VsZW1lbnRTZWxlY3RvcigpICYmIHRoaXMuY2xhc3NOYW1lcy5sZW5ndGggPT0gMCAmJiB0aGlzLmF0dHJzLmxlbmd0aCA9PSAwICYmXG4gICAgICAgIHRoaXMubm90U2VsZWN0b3JzLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIGhhc0VsZW1lbnRTZWxlY3RvcigpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5lbGVtZW50OyB9XG5cbiAgc2V0RWxlbWVudChlbGVtZW50OiBzdHJpbmd8bnVsbCA9IG51bGwpIHsgdGhpcy5lbGVtZW50ID0gZWxlbWVudDsgfVxuXG4gIC8qKiBHZXRzIGEgdGVtcGxhdGUgc3RyaW5nIGZvciBhbiBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IuICovXG4gIGdldE1hdGNoaW5nRWxlbWVudFRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgdGFnTmFtZSA9IHRoaXMuZWxlbWVudCB8fCAnZGl2JztcbiAgICBjb25zdCBjbGFzc0F0dHIgPSB0aGlzLmNsYXNzTmFtZXMubGVuZ3RoID4gMCA/IGAgY2xhc3M9XCIke3RoaXMuY2xhc3NOYW1lcy5qb2luKCcgJyl9XCJgIDogJyc7XG5cbiAgICBsZXQgYXR0cnMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gdGhpcy5hdHRyc1tpXTtcbiAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IHRoaXMuYXR0cnNbaSArIDFdICE9PSAnJyA/IGA9XCIke3RoaXMuYXR0cnNbaSArIDFdfVwiYCA6ICcnO1xuICAgICAgYXR0cnMgKz0gYCAke2F0dHJOYW1lfSR7YXR0clZhbHVlfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldEh0bWxUYWdEZWZpbml0aW9uKHRhZ05hbWUpLmlzVm9pZCA/IGA8JHt0YWdOYW1lfSR7Y2xhc3NBdHRyfSR7YXR0cnN9Lz5gIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYDwke3RhZ05hbWV9JHtjbGFzc0F0dHJ9JHthdHRyc30+PC8ke3RhZ05hbWV9PmA7XG4gIH1cblxuICBnZXRBdHRycygpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNsYXNzTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LnB1c2goJ2NsYXNzJywgdGhpcy5jbGFzc05hbWVzLmpvaW4oJyAnKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQuY29uY2F0KHRoaXMuYXR0cnMpO1xuICB9XG5cbiAgYWRkQXR0cmlidXRlKG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZyA9ICcnKSB7XG4gICAgdGhpcy5hdHRycy5wdXNoKG5hbWUsIHZhbHVlICYmIHZhbHVlLnRvTG93ZXJDYXNlKCkgfHwgJycpO1xuICB9XG5cbiAgYWRkQ2xhc3NOYW1lKG5hbWU6IHN0cmluZykgeyB0aGlzLmNsYXNzTmFtZXMucHVzaChuYW1lLnRvTG93ZXJDYXNlKCkpOyB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzOiBzdHJpbmcgPSB0aGlzLmVsZW1lbnQgfHwgJyc7XG4gICAgaWYgKHRoaXMuY2xhc3NOYW1lcykge1xuICAgICAgdGhpcy5jbGFzc05hbWVzLmZvckVhY2goa2xhc3MgPT4gcmVzICs9IGAuJHtrbGFzc31gKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXR0cnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5hdHRycy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5hdHRyc1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmF0dHJzW2kgKyAxXTtcbiAgICAgICAgcmVzICs9IGBbJHtuYW1lfSR7dmFsdWUgPyAnPScgKyB2YWx1ZSA6ICcnfV1gO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLm5vdFNlbGVjdG9ycy5mb3JFYWNoKG5vdFNlbGVjdG9yID0+IHJlcyArPSBgOm5vdCgke25vdFNlbGVjdG9yfSlgKTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG59XG5cbi8qKlxuICogUmVhZHMgYSBsaXN0IG9mIENzc1NlbGVjdG9ycyBhbmQgYWxsb3dzIHRvIGNhbGN1bGF0ZSB3aGljaCBvbmVzXG4gKiBhcmUgY29udGFpbmVkIGluIGEgZ2l2ZW4gQ3NzU2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvck1hdGNoZXIge1xuICBzdGF0aWMgY3JlYXRlTm90TWF0Y2hlcihub3RTZWxlY3RvcnM6IENzc1NlbGVjdG9yW10pOiBTZWxlY3Rvck1hdGNoZXIge1xuICAgIGNvbnN0IG5vdE1hdGNoZXIgPSBuZXcgU2VsZWN0b3JNYXRjaGVyKCk7XG4gICAgbm90TWF0Y2hlci5hZGRTZWxlY3RhYmxlcyhub3RTZWxlY3RvcnMsIG51bGwpO1xuICAgIHJldHVybiBub3RNYXRjaGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfZWxlbWVudE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4oKTtcbiAgcHJpdmF0ZSBfZWxlbWVudFBhcnRpYWxNYXAgPSBuZXcgTWFwPHN0cmluZywgU2VsZWN0b3JNYXRjaGVyPigpO1xuICBwcml2YXRlIF9jbGFzc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3RvckNvbnRleHRbXT4oKTtcbiAgcHJpdmF0ZSBfY2xhc3NQYXJ0aWFsTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlTWFwID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPj4oKTtcbiAgcHJpdmF0ZSBfYXR0clZhbHVlUGFydGlhbE1hcCA9IG5ldyBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+PigpO1xuICBwcml2YXRlIF9saXN0Q29udGV4dHM6IFNlbGVjdG9yTGlzdENvbnRleHRbXSA9IFtdO1xuXG4gIGFkZFNlbGVjdGFibGVzKGNzc1NlbGVjdG9yczogQ3NzU2VsZWN0b3JbXSwgY2FsbGJhY2tDdHh0PzogYW55KSB7XG4gICAgbGV0IGxpc3RDb250ZXh0OiBTZWxlY3Rvckxpc3RDb250ZXh0ID0gbnVsbCAhO1xuICAgIGlmIChjc3NTZWxlY3RvcnMubGVuZ3RoID4gMSkge1xuICAgICAgbGlzdENvbnRleHQgPSBuZXcgU2VsZWN0b3JMaXN0Q29udGV4dChjc3NTZWxlY3RvcnMpO1xuICAgICAgdGhpcy5fbGlzdENvbnRleHRzLnB1c2gobGlzdENvbnRleHQpO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNzc1NlbGVjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fYWRkU2VsZWN0YWJsZShjc3NTZWxlY3RvcnNbaV0sIGNhbGxiYWNrQ3R4dCwgbGlzdENvbnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIGZvdW5kIGxhdGVyIG9uIGJ5IGNhbGxpbmcgYG1hdGNoYC5cbiAgICogQHBhcmFtIGNzc1NlbGVjdG9yIEEgY3NzIHNlbGVjdG9yXG4gICAqIEBwYXJhbSBjYWxsYmFja0N0eHQgQW4gb3BhcXVlIG9iamVjdCB0aGF0IHdpbGwgYmUgZ2l2ZW4gdG8gdGhlIGNhbGxiYWNrIG9mIHRoZSBgbWF0Y2hgIGZ1bmN0aW9uXG4gICAqL1xuICBwcml2YXRlIF9hZGRTZWxlY3RhYmxlKFxuICAgICAgY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBjYWxsYmFja0N0eHQ6IGFueSwgbGlzdENvbnRleHQ6IFNlbGVjdG9yTGlzdENvbnRleHQpIHtcbiAgICBsZXQgbWF0Y2hlcjogU2VsZWN0b3JNYXRjaGVyID0gdGhpcztcbiAgICBjb25zdCBlbGVtZW50ID0gY3NzU2VsZWN0b3IuZWxlbWVudDtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gY3NzU2VsZWN0b3IuY2xhc3NOYW1lcztcbiAgICBjb25zdCBhdHRycyA9IGNzc1NlbGVjdG9yLmF0dHJzO1xuICAgIGNvbnN0IHNlbGVjdGFibGUgPSBuZXcgU2VsZWN0b3JDb250ZXh0KGNzc1NlbGVjdG9yLCBjYWxsYmFja0N0eHQsIGxpc3RDb250ZXh0KTtcblxuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICBjb25zdCBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGNsYXNzTmFtZXMubGVuZ3RoID09PSAwO1xuICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgdGhpcy5fYWRkVGVybWluYWwobWF0Y2hlci5fZWxlbWVudE1hcCwgZWxlbWVudCwgc2VsZWN0YWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9lbGVtZW50UGFydGlhbE1hcCwgZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsYXNzTmFtZXMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3NOYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpc1Rlcm1pbmFsID0gYXR0cnMubGVuZ3RoID09PSAwICYmIGkgPT09IGNsYXNzTmFtZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tpXTtcbiAgICAgICAgaWYgKGlzVGVybWluYWwpIHtcbiAgICAgICAgICB0aGlzLl9hZGRUZXJtaW5hbChtYXRjaGVyLl9jbGFzc01hcCwgY2xhc3NOYW1lLCBzZWxlY3RhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVyID0gdGhpcy5fYWRkUGFydGlhbChtYXRjaGVyLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY29uc3QgaXNUZXJtaW5hbCA9IGkgPT09IGF0dHJzLmxlbmd0aCAtIDI7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBhdHRyc1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBhdHRyc1tpICsgMV07XG4gICAgICAgIGlmIChpc1Rlcm1pbmFsKSB7XG4gICAgICAgICAgY29uc3QgdGVybWluYWxNYXAgPSBtYXRjaGVyLl9hdHRyVmFsdWVNYXA7XG4gICAgICAgICAgbGV0IHRlcm1pbmFsVmFsdWVzTWFwID0gdGVybWluYWxNYXAuZ2V0KG5hbWUpO1xuICAgICAgICAgIGlmICghdGVybWluYWxWYWx1ZXNNYXApIHtcbiAgICAgICAgICAgIHRlcm1pbmFsVmFsdWVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPigpO1xuICAgICAgICAgICAgdGVybWluYWxNYXAuc2V0KG5hbWUsIHRlcm1pbmFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fYWRkVGVybWluYWwodGVybWluYWxWYWx1ZXNNYXAsIHZhbHVlLCBzZWxlY3RhYmxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBwYXJ0aWFsTWFwID0gbWF0Y2hlci5fYXR0clZhbHVlUGFydGlhbE1hcDtcbiAgICAgICAgICBsZXQgcGFydGlhbFZhbHVlc01hcCA9IHBhcnRpYWxNYXAuZ2V0KG5hbWUpO1xuICAgICAgICAgIGlmICghcGFydGlhbFZhbHVlc01hcCkge1xuICAgICAgICAgICAgcGFydGlhbFZhbHVlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBTZWxlY3Rvck1hdGNoZXI+KCk7XG4gICAgICAgICAgICBwYXJ0aWFsTWFwLnNldChuYW1lLCBwYXJ0aWFsVmFsdWVzTWFwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlciA9IHRoaXMuX2FkZFBhcnRpYWwocGFydGlhbFZhbHVlc01hcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYWRkVGVybWluYWwoXG4gICAgICBtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yQ29udGV4dFtdPiwgbmFtZTogc3RyaW5nLCBzZWxlY3RhYmxlOiBTZWxlY3RvckNvbnRleHQpIHtcbiAgICBsZXQgdGVybWluYWxMaXN0ID0gbWFwLmdldChuYW1lKTtcbiAgICBpZiAoIXRlcm1pbmFsTGlzdCkge1xuICAgICAgdGVybWluYWxMaXN0ID0gW107XG4gICAgICBtYXAuc2V0KG5hbWUsIHRlcm1pbmFsTGlzdCk7XG4gICAgfVxuICAgIHRlcm1pbmFsTGlzdC5wdXNoKHNlbGVjdGFibGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkUGFydGlhbChtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4sIG5hbWU6IHN0cmluZyk6IFNlbGVjdG9yTWF0Y2hlciB7XG4gICAgbGV0IG1hdGNoZXIgPSBtYXAuZ2V0KG5hbWUpO1xuICAgIGlmICghbWF0Y2hlcikge1xuICAgICAgbWF0Y2hlciA9IG5ldyBTZWxlY3Rvck1hdGNoZXIoKTtcbiAgICAgIG1hcC5zZXQobmFtZSwgbWF0Y2hlcik7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG9iamVjdHMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdmlhIGBhZGRTZWxlY3RhYmxlYFxuICAgKiB3aG9zZSBjc3Mgc2VsZWN0b3IgaXMgY29udGFpbmVkIGluIHRoZSBnaXZlbiBjc3Mgc2VsZWN0b3IuXG4gICAqIEBwYXJhbSBjc3NTZWxlY3RvciBBIGNzcyBzZWxlY3RvclxuICAgKiBAcGFyYW0gbWF0Y2hlZENhbGxiYWNrIFRoaXMgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgb2JqZWN0IGhhbmRlZCBpbnRvIGBhZGRTZWxlY3RhYmxlYFxuICAgKiBAcmV0dXJuIGJvb2xlYW4gdHJ1ZSBpZiBhIG1hdGNoIHdhcyBmb3VuZFxuICAqL1xuICBtYXRjaChjc3NTZWxlY3RvcjogQ3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjazogKChjOiBDc3NTZWxlY3RvciwgYTogYW55KSA9PiB2b2lkKXxudWxsKTpcbiAgICAgIGJvb2xlYW4ge1xuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICBjb25zdCBlbGVtZW50ID0gY3NzU2VsZWN0b3IuZWxlbWVudCAhO1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBjc3NTZWxlY3Rvci5jbGFzc05hbWVzO1xuICAgIGNvbnN0IGF0dHJzID0gY3NzU2VsZWN0b3IuYXR0cnM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xpc3RDb250ZXh0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5fbGlzdENvbnRleHRzW2ldLmFscmVhZHlNYXRjaGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hUZXJtaW5hbCh0aGlzLl9lbGVtZW50TWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hQYXJ0aWFsKHRoaXMuX2VsZW1lbnRQYXJ0aWFsTWFwLCBlbGVtZW50LCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fFxuICAgICAgICByZXN1bHQ7XG5cbiAgICBpZiAoY2xhc3NOYW1lcykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjbGFzc05hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGNsYXNzTmFtZXNbaV07XG4gICAgICAgIHJlc3VsdCA9XG4gICAgICAgICAgICB0aGlzLl9tYXRjaFRlcm1pbmFsKHRoaXMuX2NsYXNzTWFwLCBjbGFzc05hbWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoUGFydGlhbCh0aGlzLl9jbGFzc1BhcnRpYWxNYXAsIGNsYXNzTmFtZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHxcbiAgICAgICAgICAgIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYXR0cnMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGF0dHJzW2ldO1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGF0dHJzW2kgKyAxXTtcblxuICAgICAgICBjb25zdCB0ZXJtaW5hbFZhbHVlc01hcCA9IHRoaXMuX2F0dHJWYWx1ZU1hcC5nZXQobmFtZSkgITtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgICAgdGhpcy5fbWF0Y2hUZXJtaW5hbCh0ZXJtaW5hbFZhbHVlc01hcCwgJycsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPVxuICAgICAgICAgICAgdGhpcy5fbWF0Y2hUZXJtaW5hbCh0ZXJtaW5hbFZhbHVlc01hcCwgdmFsdWUsIGNzc1NlbGVjdG9yLCBtYXRjaGVkQ2FsbGJhY2spIHx8IHJlc3VsdDtcblxuICAgICAgICBjb25zdCBwYXJ0aWFsVmFsdWVzTWFwID0gdGhpcy5fYXR0clZhbHVlUGFydGlhbE1hcC5nZXQobmFtZSkgITtcbiAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdGhpcy5fbWF0Y2hQYXJ0aWFsKHBhcnRpYWxWYWx1ZXNNYXAsICcnLCBjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID1cbiAgICAgICAgICAgIHRoaXMuX21hdGNoUGFydGlhbChwYXJ0aWFsVmFsdWVzTWFwLCB2YWx1ZSwgY3NzU2VsZWN0b3IsIG1hdGNoZWRDYWxsYmFjaykgfHwgcmVzdWx0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfbWF0Y2hUZXJtaW5hbChcbiAgICAgIG1hcDogTWFwPHN0cmluZywgU2VsZWN0b3JDb250ZXh0W10+LCBuYW1lOiBzdHJpbmcsIGNzc1NlbGVjdG9yOiBDc3NTZWxlY3RvcixcbiAgICAgIG1hdGNoZWRDYWxsYmFjazogKChjOiBDc3NTZWxlY3RvciwgYTogYW55KSA9PiB2b2lkKXxudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKCFtYXAgfHwgdHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGFibGVzOiBTZWxlY3RvckNvbnRleHRbXSA9IG1hcC5nZXQobmFtZSkgfHwgW107XG4gICAgY29uc3Qgc3RhclNlbGVjdGFibGVzOiBTZWxlY3RvckNvbnRleHRbXSA9IG1hcC5nZXQoJyonKSAhO1xuICAgIGlmIChzdGFyU2VsZWN0YWJsZXMpIHtcbiAgICAgIHNlbGVjdGFibGVzID0gc2VsZWN0YWJsZXMuY29uY2F0KHN0YXJTZWxlY3RhYmxlcyk7XG4gICAgfVxuICAgIGlmIChzZWxlY3RhYmxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IHNlbGVjdGFibGU6IFNlbGVjdG9yQ29udGV4dDtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgc2VsZWN0YWJsZSA9IHNlbGVjdGFibGVzW2ldO1xuICAgICAgcmVzdWx0ID0gc2VsZWN0YWJsZS5maW5hbGl6ZShjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKSB8fCByZXN1bHQ7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9tYXRjaFBhcnRpYWwoXG4gICAgICBtYXA6IE1hcDxzdHJpbmcsIFNlbGVjdG9yTWF0Y2hlcj4sIG5hbWU6IHN0cmluZywgY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLFxuICAgICAgbWF0Y2hlZENhbGxiYWNrOiAoKGM6IENzc1NlbGVjdG9yLCBhOiBhbnkpID0+IHZvaWQpfG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIW1hcCB8fCB0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBuZXN0ZWRTZWxlY3RvciA9IG1hcC5nZXQobmFtZSk7XG4gICAgaWYgKCFuZXN0ZWRTZWxlY3Rvcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBUT0RPKHBlcmYpOiBnZXQgcmlkIG9mIHJlY3Vyc2lvbiBhbmQgbWVhc3VyZSBhZ2FpblxuICAgIC8vIFRPRE8ocGVyZik6IGRvbid0IHBhc3MgdGhlIHdob2xlIHNlbGVjdG9yIGludG8gdGhlIHJlY3Vyc2lvbixcbiAgICAvLyBidXQgb25seSB0aGUgbm90IHByb2Nlc3NlZCBwYXJ0c1xuICAgIHJldHVybiBuZXN0ZWRTZWxlY3Rvci5tYXRjaChjc3NTZWxlY3RvciwgbWF0Y2hlZENhbGxiYWNrKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rvckxpc3RDb250ZXh0IHtcbiAgYWxyZWFkeU1hdGNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZWN0b3JzOiBDc3NTZWxlY3RvcltdKSB7fVxufVxuXG4vLyBTdG9yZSBjb250ZXh0IHRvIHBhc3MgYmFjayBzZWxlY3RvciBhbmQgY29udGV4dCB3aGVuIGEgc2VsZWN0b3IgaXMgbWF0Y2hlZFxuZXhwb3J0IGNsYXNzIFNlbGVjdG9yQ29udGV4dCB7XG4gIG5vdFNlbGVjdG9yczogQ3NzU2VsZWN0b3JbXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBzZWxlY3RvcjogQ3NzU2VsZWN0b3IsIHB1YmxpYyBjYkNvbnRleHQ6IGFueSxcbiAgICAgIHB1YmxpYyBsaXN0Q29udGV4dDogU2VsZWN0b3JMaXN0Q29udGV4dCkge1xuICAgIHRoaXMubm90U2VsZWN0b3JzID0gc2VsZWN0b3Iubm90U2VsZWN0b3JzO1xuICB9XG5cbiAgZmluYWxpemUoY3NzU2VsZWN0b3I6IENzc1NlbGVjdG9yLCBjYWxsYmFjazogKChjOiBDc3NTZWxlY3RvciwgYTogYW55KSA9PiB2b2lkKXxudWxsKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlc3VsdCA9IHRydWU7XG4gICAgaWYgKHRoaXMubm90U2VsZWN0b3JzLmxlbmd0aCA+IDAgJiYgKCF0aGlzLmxpc3RDb250ZXh0IHx8ICF0aGlzLmxpc3RDb250ZXh0LmFscmVhZHlNYXRjaGVkKSkge1xuICAgICAgY29uc3Qgbm90TWF0Y2hlciA9IFNlbGVjdG9yTWF0Y2hlci5jcmVhdGVOb3RNYXRjaGVyKHRoaXMubm90U2VsZWN0b3JzKTtcbiAgICAgIHJlc3VsdCA9ICFub3RNYXRjaGVyLm1hdGNoKGNzc1NlbGVjdG9yLCBudWxsKTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCAmJiBjYWxsYmFjayAmJiAoIXRoaXMubGlzdENvbnRleHQgfHwgIXRoaXMubGlzdENvbnRleHQuYWxyZWFkeU1hdGNoZWQpKSB7XG4gICAgICBpZiAodGhpcy5saXN0Q29udGV4dCkge1xuICAgICAgICB0aGlzLmxpc3RDb250ZXh0LmFscmVhZHlNYXRjaGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKHRoaXMuc2VsZWN0b3IsIHRoaXMuY2JDb250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19