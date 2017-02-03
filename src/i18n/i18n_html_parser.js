/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MissingTranslationStrategy } from '@angular/core/index';
import { DEFAULT_INTERPOLATION_CONFIG } from '../ml_parser/interpolation_config';
import { ParseTreeResult } from '../ml_parser/parser';
import { mergeTranslations } from './extractor_merger';
import { Xliff } from './serializers/xliff';
import { Xmb } from './serializers/xmb';
import { Xtb } from './serializers/xtb';
import { TranslationBundle } from './translation_bundle';
export class I18NHtmlParser {
    /**
     * @param {?} _htmlParser
     * @param {?=} _translations
     * @param {?=} _translationsFormat
     * @param {?=} _missingTranslation
     * @param {?=} _console
     */
    constructor(_htmlParser, _translations, _translationsFormat, _missingTranslation = MissingTranslationStrategy.Warning, _console) {
        this._htmlParser = _htmlParser;
        this._translations = _translations;
        this._translationsFormat = _translationsFormat;
        this._missingTranslation = _missingTranslation;
        this._console = _console;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (!this._translations || this._translations === '') {
            // Do not enable i18n when no translation bundle is provided
            return parseResult;
        }
        // TODO(vicb): add support for implicit tags / attributes
        if (parseResult.errors.length) {
            return new ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        const /** @type {?} */ serializer = this._createSerializer();
        const /** @type {?} */ translationBundle = TranslationBundle.load(this._translations, url, serializer, this._missingTranslation, this._console);
        return mergeTranslations(parseResult.rootNodes, translationBundle, interpolationConfig, [], {});
    }
    /**
     * @return {?}
     */
    _createSerializer() {
        const /** @type {?} */ format = (this._translationsFormat || 'xlf').toLowerCase();
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
}
function I18NHtmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    I18NHtmlParser.prototype.getTagDefinition;
    /** @type {?} */
    I18NHtmlParser.prototype._htmlParser;
    /** @type {?} */
    I18NHtmlParser.prototype._translations;
    /** @type {?} */
    I18NHtmlParser.prototype._translationsFormat;
    /** @type {?} */
    I18NHtmlParser.prototype._missingTranslation;
    /** @type {?} */
    I18NHtmlParser.prototype._console;
}
//# sourceMappingURL=i18n_html_parser.js.map