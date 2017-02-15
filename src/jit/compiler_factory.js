/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { COMPILER_OPTIONS, Compiler, CompilerFactory, Inject, InjectionToken, MissingTranslationStrategy, Optional, PLATFORM_INITIALIZER, ReflectiveInjector, TRANSLATIONS, TRANSLATIONS_FORMAT, ViewEncapsulation, createPlatformFactory, isDevMode, platformCore } from '@angular/core/index';
import { AnimationParser } from '../animation/animation_parser';
import { CompilerConfig, USE_VIEW_ENGINE } from '../config';
import { DirectiveNormalizer } from '../directive_normalizer';
import { DirectiveResolver } from '../directive_resolver';
import { DirectiveWrapperCompiler } from '../directive_wrapper_compiler';
import { Lexer } from '../expression_parser/lexer';
import { Parser } from '../expression_parser/parser';
import * as i18n from '../i18n/index';
import { CompilerInjectable } from '../injectable';
import { CompileMetadataResolver } from '../metadata_resolver';
import { HtmlParser } from '../ml_parser/html_parser';
import { NgModuleCompiler } from '../ng_module_compiler';
import { NgModuleResolver } from '../ng_module_resolver';
import { PipeResolver } from '../pipe_resolver';
import { Console, ReflectionCapabilities, Reflector, ReflectorReader, reflector } from '../private_import_core';
import { ResourceLoader } from '../resource_loader';
import { DomElementSchemaRegistry } from '../schema/dom_element_schema_registry';
import { ElementSchemaRegistry } from '../schema/element_schema_registry';
import { StyleCompiler } from '../style_compiler';
import { SummaryResolver } from '../summary_resolver';
import { TemplateParser } from '../template_parser/template_parser';
import { DEFAULT_PACKAGE_URL_PROVIDER, UrlResolver } from '../url_resolver';
import { ViewCompiler } from '../view_compiler/view_compiler';
import { ViewCompilerNext } from '../view_compiler_next/view_compiler';
import { JitCompiler } from './compiler';
const /** @type {?} */ _NO_RESOURCE_LOADER = {
    /**
     * @param {?} url
     * @return {?}
     */
    get(url) {
        throw new Error(`No ResourceLoader implementation has been provided. Can't read the url "${url}"`);
    }
};
const /** @type {?} */ baseHtmlParser = new InjectionToken('HtmlParser');
/**
 * @param {?} useViewEngine
 * @param {?} cc
 * @param {?} sr
 * @return {?}
 */
function viewCompilerFactory(useViewEngine, cc, sr) {
    return useViewEngine ? new ViewCompilerNext(cc, sr) : new ViewCompiler(cc, sr);
}
/**
 * A set of providers that provide `JitCompiler` and its dependencies to use for
 * template compilation.
 */
export const /** @type {?} */ COMPILER_PROVIDERS = [
    { provide: Reflector, useValue: reflector },
    { provide: ReflectorReader, useExisting: Reflector },
    { provide: ResourceLoader, useValue: _NO_RESOURCE_LOADER },
    SummaryResolver,
    Console,
    Lexer,
    Parser,
    {
        provide: baseHtmlParser,
        useClass: HtmlParser,
    },
    {
        provide: i18n.I18NHtmlParser,
        useFactory: (parser, translations, format, config, console) => new i18n.I18NHtmlParser(parser, translations, format, config.missingTranslation, console),
        deps: [
            baseHtmlParser,
            [new Optional(), new Inject(TRANSLATIONS)],
            [new Optional(), new Inject(TRANSLATIONS_FORMAT)],
            [CompilerConfig],
            [Console],
        ]
    },
    {
        provide: HtmlParser,
        useExisting: i18n.I18NHtmlParser,
    },
    TemplateParser,
    DirectiveNormalizer,
    CompileMetadataResolver,
    DEFAULT_PACKAGE_URL_PROVIDER,
    StyleCompiler,
    { provide: USE_VIEW_ENGINE, useValue: false },
    {
        provide: ViewCompiler,
        useFactory: viewCompilerFactory,
        deps: [USE_VIEW_ENGINE, CompilerConfig, ElementSchemaRegistry]
    },
    NgModuleCompiler,
    DirectiveWrapperCompiler,
    { provide: CompilerConfig, useValue: new CompilerConfig() },
    JitCompiler,
    { provide: Compiler, useExisting: JitCompiler },
    DomElementSchemaRegistry,
    { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
    UrlResolver,
    DirectiveResolver,
    PipeResolver,
    NgModuleResolver,
    AnimationParser,
];
let JitCompilerFactory = class JitCompilerFactory {
    /**
     * @param {?} defaultOptions
     */
    constructor(defaultOptions) {
        this._defaultOptions = [{
                useDebug: isDevMode(),
                useJit: true,
                defaultEncapsulation: ViewEncapsulation.Emulated,
                missingTranslation: MissingTranslationStrategy.Warning,
            }].concat(defaultOptions);
    }
    /**
     * @param {?=} options
     * @return {?}
     */
    createCompiler(options = []) {
        const /** @type {?} */ opts = _mergeOptions(this._defaultOptions.concat(options));
        const /** @type {?} */ injector = ReflectiveInjector.resolveAndCreate([
            COMPILER_PROVIDERS, {
                provide: CompilerConfig,
                useFactory: () => {
                    return new CompilerConfig({
                        // let explicit values from the compiler options overwrite options
                        // from the app providers. E.g. important for the testing platform.
                        genDebugInfo: opts.useDebug,
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        useJit: opts.useJit,
                        // let explicit values from the compiler options overwrite options
                        // from the app providers
                        defaultEncapsulation: opts.defaultEncapsulation,
                        logBindingUpdate: opts.useDebug,
                        missingTranslation: opts.missingTranslation,
                    });
                },
                deps: []
            },
            opts.providers
        ]);
        return injector.get(Compiler);
    }
};
/** @nocollapse */
JitCompilerFactory.ctorParameters = () => [
    { type: Array, decorators: [{ type: Inject, args: [COMPILER_OPTIONS,] },] },
];
JitCompilerFactory = __decorate([
    CompilerInjectable(),
    __metadata("design:paramtypes", [Array])
], JitCompilerFactory);
export { JitCompilerFactory };
function JitCompilerFactory_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {?}
     */
    JitCompilerFactory.ctorParameters;
    /** @type {?} */
    JitCompilerFactory.prototype._defaultOptions;
}
/**
 * @return {?}
 */
function _initReflector() {
    reflector.reflectionCapabilities = new ReflectionCapabilities();
}
/**
 * A platform that included corePlatform and the compiler.
 *
 * @experimental
 */
export const /** @type {?} */ platformCoreDynamic = createPlatformFactory(platformCore, 'coreDynamic', [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: CompilerFactory, useClass: JitCompilerFactory },
    { provide: PLATFORM_INITIALIZER, useValue: _initReflector, multi: true },
]);
/**
 * @param {?} optionsArr
 * @return {?}
 */
function _mergeOptions(optionsArr) {
    return {
        useDebug: _lastDefined(optionsArr.map(options => options.useDebug)),
        useJit: _lastDefined(optionsArr.map(options => options.useJit)),
        defaultEncapsulation: _lastDefined(optionsArr.map(options => options.defaultEncapsulation)),
        providers: _mergeArrays(optionsArr.map(options => options.providers)),
        missingTranslation: _lastDefined(optionsArr.map(options => options.missingTranslation)),
    };
}
/**
 * @param {?} args
 * @return {?}
 */
function _lastDefined(args) {
    for (let /** @type {?} */ i = args.length - 1; i >= 0; i--) {
        if (args[i] !== undefined) {
            return args[i];
        }
    }
    return undefined;
}
/**
 * @param {?} parts
 * @return {?}
 */
function _mergeArrays(parts) {
    const /** @type {?} */ result = [];
    parts.forEach((part) => part && result.push(...part));
    return result;
}
//# sourceMappingURL=compiler_factory.js.map