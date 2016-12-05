/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Version } from '@angular/core';
/**
 * @stable
 */
export var /** @type {?} */ VERSION = new Version('2.3.0-rc.0-5614c4f');
export { TextAst, BoundTextAst, AttrAst, BoundElementPropertyAst, BoundEventAst, ReferenceAst, VariableAst, ElementAst, EmbeddedTemplateAst, BoundDirectivePropertyAst, DirectiveAst, ProviderAst, ProviderAstType, NgContentAst, PropertyBindingType, templateVisitAll } from './src/template_parser/template_ast';
export { TEMPLATE_TRANSFORMS } from './src/template_parser/template_parser';
export { CompilerConfig, RenderTypes } from './src/config';
export { CompileAnimationEntryMetadata, CompileAnimationStateMetadata, CompileAnimationStateDeclarationMetadata, CompileAnimationStateTransitionMetadata, CompileAnimationMetadata, CompileAnimationKeyframesSequenceMetadata, CompileAnimationStyleMetadata, CompileAnimationAnimateMetadata, CompileAnimationWithStepsMetadata, CompileAnimationSequenceMetadata, CompileAnimationGroupMetadata, identifierName, identifierModuleUrl, CompileSummaryKind, tokenName, tokenReference, CompileStylesheetMetadata, CompileTemplateMetadata, CompileDirectiveMetadata, createHostComponentMeta, CompilePipeMetadata, CompileNgModuleMetadata, TransitiveCompileNgModuleMetadata, ProviderMeta } from './src/compile_metadata';
export { createAotCompiler } from './src/aot/compiler_factory';
export { AotCompiler, analyzeNgModules, analyzeAndValidateNgModules, extractProgramSymbols } from './src/aot/compiler';
export { StaticSymbolCache, StaticReflector } from './src/aot/static_reflector';
export { StaticAndDynamicReflectionCapabilities } from './src/aot/static_reflection_capabilities';
export { StaticSymbol } from './src/aot/static_symbol';
export { AotSummaryResolver } from './src/aot/summary_resolver';
export { JitCompiler } from './src/jit/compiler';
export { COMPILER_PROVIDERS, JitCompilerFactory, platformCoreDynamic } from './src/jit/compiler_factory';
export { createUrlResolverWithoutPackagePrefix, createOfflineCompileUrlResolver, DEFAULT_PACKAGE_URL_PROVIDER, UrlResolver, getUrlScheme } from './src/url_resolver';
export { ResourceLoader } from './src/resource_loader';
export { DirectiveResolver } from './src/directive_resolver';
export { PipeResolver } from './src/pipe_resolver';
export { NgModuleResolver } from './src/ng_module_resolver';
export { DEFAULT_INTERPOLATION_CONFIG, InterpolationConfig } from './src/ml_parser/interpolation_config';
export { ElementSchemaRegistry } from './src/schema/element_schema_registry';
export { Extractor, I18NHtmlParser, MessageBundle, Xliff, Xmb, Xtb } from './src/i18n/index';
export { DirectiveNormalizer } from './src/directive_normalizer';
export { TokenType, Lexer, Token, EOF, isIdentifier, isQuote } from './src/expression_parser/lexer';
export { SplitInterpolation, TemplateBindingParseResult, Parser, _ParseAST } from './src/expression_parser/parser';
export { CompileMetadataResolver, componentModuleUrl } from './src/metadata_resolver';
export { ParseTreeResult, TreeError, HtmlParser } from './src/ml_parser/html_parser';
export { NgModuleCompiler } from './src/ng_module_compiler';
export { DirectiveWrapperCompiler } from './src/directive_wrapper_compiler';
export { ImportResolver } from './src/output/path_util';
export { debugOutputAstAsTypeScript, TypeScriptEmitter } from './src/output/ts_emitter';
export { ParseLocation, ParseSourceFile, ParseSourceSpan, ParseErrorLevel, ParseError } from './src/parse_util';
export { DomElementSchemaRegistry } from './src/schema/dom_element_schema_registry';
export { CssSelector, SelectorMatcher, SelectorListContext, SelectorContext } from './src/selector';
export { StylesCompileDependency, StylesCompileResult, CompiledStylesheet, StyleCompiler } from './src/style_compiler';
export { TemplateParseError, TemplateParseResult, TemplateParser, splitClasses, removeSummaryDuplicates } from './src/template_parser/template_parser';
export { ViewCompiler } from './src/view_compiler/view_compiler';
export { AnimationParser } from './src/animation/animation_parser';
//# sourceMappingURL=index.js.map