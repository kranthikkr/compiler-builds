/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { rendererTypeName, tokenReference, viewClassName } from '../compile_metadata';
import { BindingForm, EventHandlerVars, convertActionBinding, convertPropertyBinding, convertPropertyBindingBuiltins } from '../compiler_util/expression_converter';
import { ChangeDetectionStrategy } from '../core';
import { Identifiers } from '../identifiers';
import { LifecycleHooks } from '../lifecycle_reflector';
import { isNgContainer } from '../ml_parser/tags';
import * as o from '../output/output_ast';
import { convertValueToOutputAst } from '../output/value_util';
import { ElementAst, EmbeddedTemplateAst, NgContentAst, templateVisitAll } from '../template_parser/template_ast';
import { componentFactoryResolverProviderDef, depDef, lifecycleHookToNodeFlag, providerDef } from './provider_compiler';
var CLASS_ATTR = 'class';
var STYLE_ATTR = 'style';
var IMPLICIT_TEMPLATE_VAR = '\$implicit';
var ViewCompileResult = /** @class */ (function () {
    function ViewCompileResult(viewClassVar, rendererTypeVar) {
        this.viewClassVar = viewClassVar;
        this.rendererTypeVar = rendererTypeVar;
    }
    return ViewCompileResult;
}());
export { ViewCompileResult };
var ViewCompiler = /** @class */ (function () {
    function ViewCompiler(_reflector) {
        this._reflector = _reflector;
    }
    ViewCompiler.prototype.compileComponent = function (outputCtx, component, template, styles, usedPipes) {
        var _this = this;
        var _a;
        var embeddedViewCount = 0;
        var staticQueryIds = findStaticQueryIds(template);
        var renderComponentVarName = undefined;
        if (!component.isHost) {
            var template_1 = component.template;
            var customRenderData = [];
            if (template_1.animations && template_1.animations.length) {
                customRenderData.push(new o.LiteralMapEntry('animation', convertValueToOutputAst(outputCtx, template_1.animations), true));
            }
            var renderComponentVar = o.variable(rendererTypeName(component.type.reference));
            renderComponentVarName = renderComponentVar.name;
            outputCtx.statements.push(renderComponentVar
                .set(o.importExpr(Identifiers.createRendererType2).callFn([new o.LiteralMapExpr([
                    new o.LiteralMapEntry('encapsulation', o.literal(template_1.encapsulation), false),
                    new o.LiteralMapEntry('styles', styles, false),
                    new o.LiteralMapEntry('data', new o.LiteralMapExpr(customRenderData), false)
                ])]))
                .toDeclStmt(o.importType(Identifiers.RendererType2), [o.StmtModifier.Final, o.StmtModifier.Exported]));
        }
        var viewBuilderFactory = function (parent) {
            var embeddedViewIndex = embeddedViewCount++;
            return new ViewBuilder(_this._reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory);
        };
        var visitor = viewBuilderFactory(null);
        visitor.visitAll([], template);
        (_a = outputCtx.statements).push.apply(_a, tslib_1.__spread(visitor.build()));
        return new ViewCompileResult(visitor.viewName, renderComponentVarName);
    };
    return ViewCompiler;
}());
export { ViewCompiler };
var LOG_VAR = o.variable('_l');
var VIEW_VAR = o.variable('_v');
var CHECK_VAR = o.variable('_ck');
var COMP_VAR = o.variable('_co');
var EVENT_NAME_VAR = o.variable('en');
var ALLOW_DEFAULT_VAR = o.variable("ad");
var ViewBuilder = /** @class */ (function () {
    function ViewBuilder(reflector, outputCtx, parent, component, embeddedViewIndex, usedPipes, staticQueryIds, viewBuilderFactory) {
        this.reflector = reflector;
        this.outputCtx = outputCtx;
        this.parent = parent;
        this.component = component;
        this.embeddedViewIndex = embeddedViewIndex;
        this.usedPipes = usedPipes;
        this.staticQueryIds = staticQueryIds;
        this.viewBuilderFactory = viewBuilderFactory;
        this.nodes = [];
        this.purePipeNodeIndices = Object.create(null);
        // Need Object.create so that we don't have builtin values...
        this.refNodeIndices = Object.create(null);
        this.variables = [];
        this.children = [];
        // TODO(tbosch): The old view compiler used to use an `any` type
        // for the context in any embedded view. We keep this behaivor for now
        // to be able to introduce the new view compiler without too many errors.
        this.compType = this.embeddedViewIndex > 0 ?
            o.DYNAMIC_TYPE :
            o.expressionType(outputCtx.importExpr(this.component.type.reference));
        this.viewName = viewClassName(this.component.type.reference, this.embeddedViewIndex);
    }
    ViewBuilder.prototype.visitAll = function (variables, astNodes) {
        var _this = this;
        this.variables = variables;
        // create the pipes for the pure pipes immediately, so that we know their indices.
        if (!this.parent) {
            this.usedPipes.forEach(function (pipe) {
                if (pipe.pure) {
                    _this.purePipeNodeIndices[pipe.name] = _this._createPipe(null, pipe);
                }
            });
        }
        if (!this.parent) {
            var queryIds_1 = staticViewQueryIds(this.staticQueryIds);
            this.component.viewQueries.forEach(function (query, queryIndex) {
                // Note: queries start with id 1 so we can use the number in a Bloom filter!
                var queryId = queryIndex + 1;
                var bindingType = query.first ? 0 /* First */ : 1 /* All */;
                var flags = 134217728 /* TypeViewQuery */ | calcStaticDynamicQueryFlags(queryIds_1, queryId, query.first);
                _this.nodes.push(function () { return ({
                    sourceSpan: null,
                    nodeFlags: flags,
                    nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                        o.literal(flags), o.literal(queryId),
                        new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                    ])
                }); });
            });
        }
        templateVisitAll(this, astNodes);
        if (this.parent && (astNodes.length === 0 || needsAdditionalRootNode(astNodes))) {
            // if the view is an embedded view, then we need to add an additional root node in some cases
            this.nodes.push(function () { return ({
                sourceSpan: null,
                nodeFlags: 1 /* TypeElement */,
                nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                    o.literal(0 /* None */), o.NULL_EXPR, o.NULL_EXPR, o.literal(0)
                ])
            }); });
        }
    };
    ViewBuilder.prototype.build = function (targetStatements) {
        if (targetStatements === void 0) { targetStatements = []; }
        this.children.forEach(function (child) { return child.build(targetStatements); });
        var _a = this._createNodeExpressions(), updateRendererStmts = _a.updateRendererStmts, updateDirectivesStmts = _a.updateDirectivesStmts, nodeDefExprs = _a.nodeDefExprs;
        var updateRendererFn = this._createUpdateFn(updateRendererStmts);
        var updateDirectivesFn = this._createUpdateFn(updateDirectivesStmts);
        var viewFlags = 0 /* None */;
        if (!this.parent && this.component.changeDetection === ChangeDetectionStrategy.OnPush) {
            viewFlags |= 2 /* OnPush */;
        }
        var viewFactory = new o.DeclareFunctionStmt(this.viewName, [new o.FnParam(LOG_VAR.name)], [new o.ReturnStatement(o.importExpr(Identifiers.viewDef).callFn([
                o.literal(viewFlags),
                o.literalArr(nodeDefExprs),
                updateDirectivesFn,
                updateRendererFn,
            ]))], o.importType(Identifiers.ViewDefinition), this.embeddedViewIndex === 0 ? [o.StmtModifier.Exported] : []);
        targetStatements.push(viewFactory);
        return targetStatements;
    };
    ViewBuilder.prototype._createUpdateFn = function (updateStmts) {
        var updateFn;
        if (updateStmts.length > 0) {
            var preStmts = [];
            if (!this.component.isHost && o.findReadVarNames(updateStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            updateFn = o.fn([
                new o.FnParam(CHECK_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE)
            ], tslib_1.__spread(preStmts, updateStmts), o.INFERRED_TYPE);
        }
        else {
            updateFn = o.NULL_EXPR;
        }
        return updateFn;
    };
    ViewBuilder.prototype.visitNgContent = function (ast, context) {
        // ngContentDef(ngContentIndex: number, index: number): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 8 /* TypeNgContent */,
            nodeDef: o.importExpr(Identifiers.ngContentDef).callFn([
                o.literal(ast.ngContentIndex), o.literal(ast.index)
            ])
        }); });
    };
    ViewBuilder.prototype.visitText = function (ast, context) {
        // Static text nodes have no check function
        var checkIndex = -1;
        this.nodes.push(function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(checkIndex),
                o.literal(ast.ngContentIndex),
                o.literalArr([o.literal(ast.value)]),
            ])
        }); });
    };
    ViewBuilder.prototype.visitBoundText = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        var astWithSource = ast.value;
        var inter = astWithSource.ast;
        var updateRendererExpressions = inter.expressions.map(function (expr, bindingIndex) { return _this._preprocessUpdateExpression({ nodeIndex: nodeIndex, bindingIndex: bindingIndex, sourceSpan: ast.sourceSpan, context: COMP_VAR, value: expr }); });
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 2 /* TypeText */,
            nodeDef: o.importExpr(Identifiers.textDef).callFn([
                o.literal(checkIndex),
                o.literal(ast.ngContentIndex),
                o.literalArr(inter.strings.map(function (s) { return o.literal(s); })),
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    ViewBuilder.prototype.visitEmbeddedTemplate = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array
        this.nodes.push(null);
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, queryMatchesExpr = _a.queryMatchesExpr, hostEvents = _a.hostEvents;
        var childVisitor = this.viewBuilderFactory(this);
        this.children.push(childVisitor);
        childVisitor.visitAll(ast.variables, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        // anchorDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], ngContentIndex: number,
        //   childCount: number, handleEventFn?: ElementHandleEventFn, templateFactory?:
        //   ViewDefinitionFactory): NodeDef;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.anchorDef).callFn([
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                o.variable(childVisitor.viewName),
            ])
        }); };
    };
    ViewBuilder.prototype.visitElement = function (ast, context) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        // Using a null element name creates an anchor.
        var elName = isNgContainer(ast.name) ? null : ast.name;
        var _a = this._visitElementOrTemplate(nodeIndex, ast), flags = _a.flags, usedEvents = _a.usedEvents, queryMatchesExpr = _a.queryMatchesExpr, dirHostBindings = _a.hostBindings, hostEvents = _a.hostEvents;
        var inputDefs = [];
        var updateRendererExpressions = [];
        var outputDefs = [];
        if (elName) {
            var hostBindings = ast.inputs
                .map(function (inputAst) { return ({
                context: COMP_VAR,
                inputAst: inputAst,
                dirAst: null,
            }); })
                .concat(dirHostBindings);
            if (hostBindings.length) {
                updateRendererExpressions =
                    hostBindings.map(function (hostBinding, bindingIndex) { return _this._preprocessUpdateExpression({
                        context: hostBinding.context,
                        nodeIndex: nodeIndex,
                        bindingIndex: bindingIndex,
                        sourceSpan: hostBinding.inputAst.sourceSpan,
                        value: hostBinding.inputAst.value
                    }); });
                inputDefs = hostBindings.map(function (hostBinding) { return elementBindingDef(hostBinding.inputAst, hostBinding.dirAst); });
            }
            outputDefs = usedEvents.map(function (_a) {
                var _b = tslib_1.__read(_a, 2), target = _b[0], eventName = _b[1];
                return o.literalArr([o.literal(target), o.literal(eventName)]);
            });
        }
        templateVisitAll(this, ast.children);
        var childCount = this.nodes.length - nodeIndex - 1;
        var compAst = ast.directives.find(function (dirAst) { return dirAst.directive.isComponent; });
        var compRendererType = o.NULL_EXPR;
        var compView = o.NULL_EXPR;
        if (compAst) {
            compView = this.outputCtx.importExpr(compAst.directive.componentViewType);
            compRendererType = this.outputCtx.importExpr(compAst.directive.rendererType);
        }
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: ast.sourceSpan,
            nodeFlags: 1 /* TypeElement */ | flags,
            nodeDef: o.importExpr(Identifiers.elementDef).callFn([
                o.literal(checkIndex),
                o.literal(flags),
                queryMatchesExpr,
                o.literal(ast.ngContentIndex),
                o.literal(childCount),
                o.literal(elName),
                elName ? fixedAttrsDef(ast) : o.NULL_EXPR,
                inputDefs.length ? o.literalArr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? o.literalArr(outputDefs) : o.NULL_EXPR,
                _this._createElementHandleEventFn(nodeIndex, hostEvents),
                compView,
                compRendererType,
            ]),
            updateRenderer: updateRendererExpressions
        }); };
    };
    ViewBuilder.prototype._visitElementOrTemplate = function (nodeIndex, ast) {
        var _this = this;
        var flags = 0 /* None */;
        if (ast.hasViewContainer) {
            flags |= 16777216 /* EmbeddedViews */;
        }
        var usedEvents = new Map();
        ast.outputs.forEach(function (event) {
            var _a = elementEventNameAndTarget(event, null), name = _a.name, target = _a.target;
            usedEvents.set(elementEventFullName(target, name), [target, name]);
        });
        ast.directives.forEach(function (dirAst) {
            dirAst.hostEvents.forEach(function (event) {
                var _a = elementEventNameAndTarget(event, dirAst), name = _a.name, target = _a.target;
                usedEvents.set(elementEventFullName(target, name), [target, name]);
            });
        });
        var hostBindings = [];
        var hostEvents = [];
        this._visitComponentFactoryResolverProvider(ast.directives);
        ast.providers.forEach(function (providerAst, providerIndex) {
            var dirAst = undefined;
            var dirIndex = undefined;
            ast.directives.forEach(function (localDirAst, i) {
                if (localDirAst.directive.type.reference === tokenReference(providerAst.token)) {
                    dirAst = localDirAst;
                    dirIndex = i;
                }
            });
            if (dirAst) {
                var _a = _this._visitDirective(providerAst, dirAst, dirIndex, nodeIndex, ast.references, ast.queryMatches, usedEvents, _this.staticQueryIds.get(ast)), dirHostBindings = _a.hostBindings, dirHostEvents = _a.hostEvents;
                hostBindings.push.apply(hostBindings, tslib_1.__spread(dirHostBindings));
                hostEvents.push.apply(hostEvents, tslib_1.__spread(dirHostEvents));
            }
            else {
                _this._visitProvider(providerAst, ast.queryMatches);
            }
        });
        var queryMatchExprs = [];
        ast.queryMatches.forEach(function (match) {
            var valueType = undefined;
            if (tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(Identifiers.ElementRef)) {
                valueType = 0 /* ElementRef */;
            }
            else if (tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(Identifiers.ViewContainerRef)) {
                valueType = 3 /* ViewContainerRef */;
            }
            else if (tokenReference(match.value) ===
                _this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(valueType)]));
            }
        });
        ast.references.forEach(function (ref) {
            var valueType = undefined;
            if (!ref.value) {
                valueType = 1 /* RenderElement */;
            }
            else if (tokenReference(ref.value) ===
                _this.reflector.resolveExternalReference(Identifiers.TemplateRef)) {
                valueType = 2 /* TemplateRef */;
            }
            if (valueType != null) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(valueType)]));
            }
        });
        ast.outputs.forEach(function (outputAst) {
            hostEvents.push({ context: COMP_VAR, eventAst: outputAst, dirAst: null });
        });
        return {
            flags: flags,
            usedEvents: Array.from(usedEvents.values()),
            queryMatchesExpr: queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
            hostBindings: hostBindings,
            hostEvents: hostEvents
        };
    };
    ViewBuilder.prototype._visitDirective = function (providerAst, dirAst, directiveIndex, elementNodeIndex, refs, queryMatches, usedEvents, queryIds) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        // reserve the space in the nodeDefs array so we can add children
        this.nodes.push(null);
        dirAst.directive.queries.forEach(function (query, queryIndex) {
            var queryId = dirAst.contentQueryStartId + queryIndex;
            var flags = 67108864 /* TypeContentQuery */ | calcStaticDynamicQueryFlags(queryIds, queryId, query.first);
            var bindingType = query.first ? 0 /* First */ : 1 /* All */;
            _this.nodes.push(function () { return ({
                sourceSpan: dirAst.sourceSpan,
                nodeFlags: flags,
                nodeDef: o.importExpr(Identifiers.queryDef).callFn([
                    o.literal(flags), o.literal(queryId),
                    new o.LiteralMapExpr([new o.LiteralMapEntry(query.propertyName, o.literal(bindingType), false)])
                ]),
            }); });
        });
        // Note: the operation below might also create new nodeDefs,
        // but we don't want them to be a child of a directive,
        // as they might be a provider/pipe on their own.
        // I.e. we only allow queries as children of directives nodes.
        var childCount = this.nodes.length - nodeIndex - 1;
        var _a = this._visitProviderOrDirective(providerAst, queryMatches), flags = _a.flags, queryMatchExprs = _a.queryMatchExprs, providerExpr = _a.providerExpr, depsExpr = _a.depsExpr;
        refs.forEach(function (ref) {
            if (ref.value && tokenReference(ref.value) === tokenReference(providerAst.token)) {
                _this.refNodeIndices[ref.name] = nodeIndex;
                queryMatchExprs.push(o.literalArr([o.literal(ref.name), o.literal(4 /* Provider */)]));
            }
        });
        if (dirAst.directive.isComponent) {
            flags |= 32768 /* Component */;
        }
        var inputDefs = dirAst.inputs.map(function (inputAst, inputIndex) {
            var mapValue = o.literalArr([o.literal(inputIndex), o.literal(inputAst.directiveName)]);
            // Note: it's important to not quote the key so that we can capture renames by minifiers!
            return new o.LiteralMapEntry(inputAst.directiveName, mapValue, false);
        });
        var outputDefs = [];
        var dirMeta = dirAst.directive;
        Object.keys(dirMeta.outputs).forEach(function (propName) {
            var eventName = dirMeta.outputs[propName];
            if (usedEvents.has(eventName)) {
                // Note: it's important to not quote the key so that we can capture renames by minifiers!
                outputDefs.push(new o.LiteralMapEntry(propName, o.literal(eventName), false));
            }
        });
        var updateDirectiveExpressions = [];
        if (dirAst.inputs.length || (flags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0) {
            updateDirectiveExpressions =
                dirAst.inputs.map(function (input, bindingIndex) { return _this._preprocessUpdateExpression({
                    nodeIndex: nodeIndex,
                    bindingIndex: bindingIndex,
                    sourceSpan: input.sourceSpan,
                    context: COMP_VAR,
                    value: input.value
                }); });
        }
        var dirContextExpr = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
        var hostBindings = dirAst.hostProperties.map(function (inputAst) { return ({
            context: dirContextExpr,
            dirAst: dirAst,
            inputAst: inputAst,
        }); });
        var hostEvents = dirAst.hostEvents.map(function (hostEventAst) { return ({
            context: dirContextExpr,
            eventAst: hostEventAst, dirAst: dirAst,
        }); });
        // Check index is the same as the node index during compilation
        // They might only differ at runtime
        var checkIndex = nodeIndex;
        this.nodes[nodeIndex] = function () { return ({
            sourceSpan: dirAst.sourceSpan,
            nodeFlags: 16384 /* TypeDirective */ | flags,
            nodeDef: o.importExpr(Identifiers.directiveDef).callFn([
                o.literal(checkIndex),
                o.literal(flags),
                queryMatchExprs.length ? o.literalArr(queryMatchExprs) : o.NULL_EXPR,
                o.literal(childCount),
                providerExpr,
                depsExpr,
                inputDefs.length ? new o.LiteralMapExpr(inputDefs) : o.NULL_EXPR,
                outputDefs.length ? new o.LiteralMapExpr(outputDefs) : o.NULL_EXPR,
            ]),
            updateDirectives: updateDirectiveExpressions,
            directive: dirAst.directive.type,
        }); };
        return { hostBindings: hostBindings, hostEvents: hostEvents };
    };
    ViewBuilder.prototype._visitProvider = function (providerAst, queryMatches) {
        this._addProviderNode(this._visitProviderOrDirective(providerAst, queryMatches));
    };
    ViewBuilder.prototype._visitComponentFactoryResolverProvider = function (directives) {
        var componentDirMeta = directives.find(function (dirAst) { return dirAst.directive.isComponent; });
        if (componentDirMeta && componentDirMeta.directive.entryComponents.length) {
            var _a = componentFactoryResolverProviderDef(this.reflector, this.outputCtx, 8192 /* PrivateProvider */, componentDirMeta.directive.entryComponents), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, flags = _a.flags, tokenExpr = _a.tokenExpr;
            this._addProviderNode({
                providerExpr: providerExpr,
                depsExpr: depsExpr,
                flags: flags,
                tokenExpr: tokenExpr,
                queryMatchExprs: [],
                sourceSpan: componentDirMeta.sourceSpan
            });
        }
    };
    ViewBuilder.prototype._addProviderNode = function (data) {
        var nodeIndex = this.nodes.length;
        // providerDef(
        //   flags: NodeFlags, matchedQueries: [string, QueryValueType][], token:any,
        //   value: any, deps: ([DepFlags, any] | any)[]): NodeDef;
        this.nodes.push(function () { return ({
            sourceSpan: data.sourceSpan,
            nodeFlags: data.flags,
            nodeDef: o.importExpr(Identifiers.providerDef).callFn([
                o.literal(data.flags),
                data.queryMatchExprs.length ? o.literalArr(data.queryMatchExprs) : o.NULL_EXPR,
                data.tokenExpr, data.providerExpr, data.depsExpr
            ])
        }); });
    };
    ViewBuilder.prototype._visitProviderOrDirective = function (providerAst, queryMatches) {
        var flags = 0 /* None */;
        var queryMatchExprs = [];
        queryMatches.forEach(function (match) {
            if (tokenReference(match.value) === tokenReference(providerAst.token)) {
                queryMatchExprs.push(o.literalArr([o.literal(match.queryId), o.literal(4 /* Provider */)]));
            }
        });
        var _a = providerDef(this.outputCtx, providerAst), providerExpr = _a.providerExpr, depsExpr = _a.depsExpr, providerFlags = _a.flags, tokenExpr = _a.tokenExpr;
        return {
            flags: flags | providerFlags,
            queryMatchExprs: queryMatchExprs,
            providerExpr: providerExpr,
            depsExpr: depsExpr,
            tokenExpr: tokenExpr,
            sourceSpan: providerAst.sourceSpan
        };
    };
    ViewBuilder.prototype.getLocal = function (name) {
        if (name == EventHandlerVars.event.name) {
            return EventHandlerVars.event;
        }
        var currViewExpr = VIEW_VAR;
        for (var currBuilder = this; currBuilder; currBuilder = currBuilder.parent,
            currViewExpr = currViewExpr.prop('parent').cast(o.DYNAMIC_TYPE)) {
            // check references
            var refNodeIndex = currBuilder.refNodeIndices[name];
            if (refNodeIndex != null) {
                return o.importExpr(Identifiers.nodeValue).callFn([currViewExpr, o.literal(refNodeIndex)]);
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
    ViewBuilder.prototype._createLiteralArrayConverter = function (sourceSpan, argCount) {
        if (argCount === 0) {
            var valueExpr_1 = o.importExpr(Identifiers.EMPTY_ARRAY);
            return function () { return valueExpr_1; };
        }
        var checkIndex = this.nodes.length;
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 32 /* TypePureArray */,
            nodeDef: o.importExpr(Identifiers.pureArrayDef).callFn([
                o.literal(checkIndex),
                o.literal(argCount),
            ])
        }); });
        return function (args) { return callCheckStmt(checkIndex, args); };
    };
    ViewBuilder.prototype._createLiteralMapConverter = function (sourceSpan, keys) {
        if (keys.length === 0) {
            var valueExpr_2 = o.importExpr(Identifiers.EMPTY_MAP);
            return function () { return valueExpr_2; };
        }
        var map = o.literalMap(keys.map(function (e, i) { return (tslib_1.__assign({}, e, { value: o.literal(i) })); }));
        var checkIndex = this.nodes.length;
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 64 /* TypePureObject */,
            nodeDef: o.importExpr(Identifiers.pureObjectDef).callFn([
                o.literal(checkIndex),
                map,
            ])
        }); });
        return function (args) { return callCheckStmt(checkIndex, args); };
    };
    ViewBuilder.prototype._createPipeConverter = function (expression, name, argCount) {
        var pipe = this.usedPipes.find(function (pipeSummary) { return pipeSummary.name === name; });
        if (pipe.pure) {
            var checkIndex_1 = this.nodes.length;
            this.nodes.push(function () { return ({
                sourceSpan: expression.sourceSpan,
                nodeFlags: 128 /* TypePurePipe */,
                nodeDef: o.importExpr(Identifiers.purePipeDef).callFn([
                    o.literal(checkIndex_1),
                    o.literal(argCount),
                ])
            }); });
            // find underlying pipe in the component view
            var compViewExpr = VIEW_VAR;
            var compBuilder = this;
            while (compBuilder.parent) {
                compBuilder = compBuilder.parent;
                compViewExpr = compViewExpr.prop('parent').cast(o.DYNAMIC_TYPE);
            }
            var pipeNodeIndex = compBuilder.purePipeNodeIndices[name];
            var pipeValueExpr_1 = o.importExpr(Identifiers.nodeValue).callFn([compViewExpr, o.literal(pipeNodeIndex)]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, callCheckStmt(checkIndex_1, [pipeValueExpr_1].concat(args))); };
        }
        else {
            var nodeIndex = this._createPipe(expression.sourceSpan, pipe);
            var nodeValueExpr_1 = o.importExpr(Identifiers.nodeValue).callFn([VIEW_VAR, o.literal(nodeIndex)]);
            return function (args) { return callUnwrapValue(expression.nodeIndex, expression.bindingIndex, nodeValueExpr_1.callMethod('transform', args)); };
        }
    };
    ViewBuilder.prototype._createPipe = function (sourceSpan, pipe) {
        var _this = this;
        var nodeIndex = this.nodes.length;
        var flags = 0 /* None */;
        pipe.type.lifecycleHooks.forEach(function (lifecycleHook) {
            // for pipes, we only support ngOnDestroy
            if (lifecycleHook === LifecycleHooks.OnDestroy) {
                flags |= lifecycleHookToNodeFlag(lifecycleHook);
            }
        });
        var depExprs = pipe.type.diDeps.map(function (diDep) { return depDef(_this.outputCtx, diDep); });
        // function pipeDef(
        //   flags: NodeFlags, ctor: any, deps: ([DepFlags, any] | any)[]): NodeDef
        this.nodes.push(function () { return ({
            sourceSpan: sourceSpan,
            nodeFlags: 16 /* TypePipe */,
            nodeDef: o.importExpr(Identifiers.pipeDef).callFn([
                o.literal(flags), _this.outputCtx.importExpr(pipe.type.reference), o.literalArr(depExprs)
            ])
        }); });
        return nodeIndex;
    };
    /**
     * For the AST in `UpdateExpression.value`:
     * - create nodes for pipes, literal arrays and, literal maps,
     * - update the AST to replace pipes, literal arrays and, literal maps with calls to check fn.
     *
     * WARNING: This might create new nodeDefs (for pipes and literal arrays and literal maps)!
     */
    ViewBuilder.prototype._preprocessUpdateExpression = function (expression) {
        var _this = this;
        return {
            nodeIndex: expression.nodeIndex,
            bindingIndex: expression.bindingIndex,
            sourceSpan: expression.sourceSpan,
            context: expression.context,
            value: convertPropertyBindingBuiltins({
                createLiteralArrayConverter: function (argCount) { return _this._createLiteralArrayConverter(expression.sourceSpan, argCount); },
                createLiteralMapConverter: function (keys) {
                    return _this._createLiteralMapConverter(expression.sourceSpan, keys);
                },
                createPipeConverter: function (name, argCount) {
                    return _this._createPipeConverter(expression, name, argCount);
                }
            }, expression.value)
        };
    };
    ViewBuilder.prototype._createNodeExpressions = function () {
        var self = this;
        var updateBindingCount = 0;
        var updateRendererStmts = [];
        var updateDirectivesStmts = [];
        var nodeDefExprs = this.nodes.map(function (factory, nodeIndex) {
            var _a = factory(), nodeDef = _a.nodeDef, nodeFlags = _a.nodeFlags, updateDirectives = _a.updateDirectives, updateRenderer = _a.updateRenderer, sourceSpan = _a.sourceSpan;
            if (updateRenderer) {
                updateRendererStmts.push.apply(updateRendererStmts, tslib_1.__spread(createUpdateStatements(nodeIndex, sourceSpan, updateRenderer, false)));
            }
            if (updateDirectives) {
                updateDirectivesStmts.push.apply(updateDirectivesStmts, tslib_1.__spread(createUpdateStatements(nodeIndex, sourceSpan, updateDirectives, (nodeFlags & (262144 /* DoCheck */ | 65536 /* OnInit */)) > 0)));
            }
            // We use a comma expression to call the log function before
            // the nodeDef function, but still use the result of the nodeDef function
            // as the value.
            // Note: We only add the logger to elements / text nodes,
            // so we don't generate too much code.
            var logWithNodeDef = nodeFlags & 3 /* CatRenderNode */ ?
                new o.CommaExpr([LOG_VAR.callFn([]).callFn([]), nodeDef]) :
                nodeDef;
            return o.applySourceSpanToExpressionIfNeeded(logWithNodeDef, sourceSpan);
        });
        return { updateRendererStmts: updateRendererStmts, updateDirectivesStmts: updateDirectivesStmts, nodeDefExprs: nodeDefExprs };
        function createUpdateStatements(nodeIndex, sourceSpan, expressions, allowEmptyExprs) {
            var updateStmts = [];
            var exprs = expressions.map(function (_a) {
                var sourceSpan = _a.sourceSpan, context = _a.context, value = _a.value;
                var bindingId = "" + updateBindingCount++;
                var nameResolver = context === COMP_VAR ? self : null;
                var _b = convertPropertyBinding(nameResolver, context, value, bindingId, BindingForm.General), stmts = _b.stmts, currValExpr = _b.currValExpr;
                updateStmts.push.apply(updateStmts, tslib_1.__spread(stmts.map(function (stmt) { return o.applySourceSpanToStatementIfNeeded(stmt, sourceSpan); })));
                return o.applySourceSpanToExpressionIfNeeded(currValExpr, sourceSpan);
            });
            if (expressions.length || allowEmptyExprs) {
                updateStmts.push(o.applySourceSpanToStatementIfNeeded(callCheckStmt(nodeIndex, exprs).toStmt(), sourceSpan));
            }
            return updateStmts;
        }
    };
    ViewBuilder.prototype._createElementHandleEventFn = function (nodeIndex, handlers) {
        var _this = this;
        var handleEventStmts = [];
        var handleEventBindingCount = 0;
        handlers.forEach(function (_a) {
            var context = _a.context, eventAst = _a.eventAst, dirAst = _a.dirAst;
            var bindingId = "" + handleEventBindingCount++;
            var nameResolver = context === COMP_VAR ? _this : null;
            var _b = convertActionBinding(nameResolver, context, eventAst.handler, bindingId), stmts = _b.stmts, allowDefault = _b.allowDefault;
            var trueStmts = stmts;
            if (allowDefault) {
                trueStmts.push(ALLOW_DEFAULT_VAR.set(allowDefault.and(ALLOW_DEFAULT_VAR)).toStmt());
            }
            var _c = elementEventNameAndTarget(eventAst, dirAst), eventTarget = _c.target, eventName = _c.name;
            var fullEventName = elementEventFullName(eventTarget, eventName);
            handleEventStmts.push(o.applySourceSpanToStatementIfNeeded(new o.IfStmt(o.literal(fullEventName).identical(EVENT_NAME_VAR), trueStmts), eventAst.sourceSpan));
        });
        var handleEventFn;
        if (handleEventStmts.length > 0) {
            var preStmts = [ALLOW_DEFAULT_VAR.set(o.literal(true)).toDeclStmt(o.BOOL_TYPE)];
            if (!this.component.isHost && o.findReadVarNames(handleEventStmts).has(COMP_VAR.name)) {
                preStmts.push(COMP_VAR.set(VIEW_VAR.prop('component')).toDeclStmt(this.compType));
            }
            handleEventFn = o.fn([
                new o.FnParam(VIEW_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(EVENT_NAME_VAR.name, o.INFERRED_TYPE),
                new o.FnParam(EventHandlerVars.event.name, o.INFERRED_TYPE)
            ], tslib_1.__spread(preStmts, handleEventStmts, [new o.ReturnStatement(ALLOW_DEFAULT_VAR)]), o.INFERRED_TYPE);
        }
        else {
            handleEventFn = o.NULL_EXPR;
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
function needsAdditionalRootNode(astNodes) {
    var lastAstNode = astNodes[astNodes.length - 1];
    if (lastAstNode instanceof EmbeddedTemplateAst) {
        return lastAstNode.hasViewContainer;
    }
    if (lastAstNode instanceof ElementAst) {
        if (isNgContainer(lastAstNode.name) && lastAstNode.children.length) {
            return needsAdditionalRootNode(lastAstNode.children);
        }
        return lastAstNode.hasViewContainer;
    }
    return lastAstNode instanceof NgContentAst;
}
function elementBindingDef(inputAst, dirAst) {
    var inputType = inputAst.type;
    switch (inputType) {
        case 1 /* Attribute */:
            return o.literalArr([
                o.literal(1 /* TypeElementAttribute */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case 0 /* Property */:
            return o.literalArr([
                o.literal(8 /* TypeProperty */), o.literal(inputAst.name),
                o.literal(inputAst.securityContext)
            ]);
        case 4 /* Animation */:
            var bindingType = 8 /* TypeProperty */ |
                (dirAst && dirAst.directive.isComponent ? 32 /* SyntheticHostProperty */ :
                    16 /* SyntheticProperty */);
            return o.literalArr([
                o.literal(bindingType), o.literal('@' + inputAst.name), o.literal(inputAst.securityContext)
            ]);
        case 2 /* Class */:
            return o.literalArr([o.literal(2 /* TypeElementClass */), o.literal(inputAst.name), o.NULL_EXPR]);
        case 3 /* Style */:
            return o.literalArr([
                o.literal(4 /* TypeElementStyle */), o.literal(inputAst.name), o.literal(inputAst.unit)
            ]);
        default:
            // This default case is not needed by TypeScript compiler, as the switch is exhaustive.
            // However Closure Compiler does not understand that and reports an error in typed mode.
            // The `throw new Error` below works around the problem, and the unexpected: never variable
            // makes sure tsc still checks this code is unreachable.
            var unexpected = inputType;
            throw new Error("unexpected " + unexpected);
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
    // Note: We need to sort to get a defined output order
    // for tests and for caching generated artifacts...
    return o.literalArr(Object.keys(mapResult).sort().map(function (attrName) { return o.literalArr([o.literal(attrName), o.literal(mapResult[attrName])]); }));
}
function mergeAttributeValue(attrName, attrValue1, attrValue2) {
    if (attrName == CLASS_ATTR || attrName == STYLE_ATTR) {
        return attrValue1 + " " + attrValue2;
    }
    else {
        return attrValue2;
    }
}
function callCheckStmt(nodeIndex, exprs) {
    if (exprs.length > 10) {
        return CHECK_VAR.callFn([VIEW_VAR, o.literal(nodeIndex), o.literal(1 /* Dynamic */), o.literalArr(exprs)]);
    }
    else {
        return CHECK_VAR.callFn(tslib_1.__spread([VIEW_VAR, o.literal(nodeIndex), o.literal(0 /* Inline */)], exprs));
    }
}
function callUnwrapValue(nodeIndex, bindingIdx, expr) {
    return o.importExpr(Identifiers.unwrapValue).callFn([
        VIEW_VAR, o.literal(nodeIndex), o.literal(bindingIdx), expr
    ]);
}
function findStaticQueryIds(nodes, result) {
    if (result === void 0) { result = new Map(); }
    nodes.forEach(function (node) {
        var staticQueryIds = new Set();
        var dynamicQueryIds = new Set();
        var queryMatches = undefined;
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
function calcStaticDynamicQueryFlags(queryIds, queryId, isFirst) {
    var flags = 0 /* None */;
    // Note: We only make queries static that query for a single item.
    // This is because of backwards compatibility with the old view compiler...
    if (isFirst && (queryIds.staticQueryIds.has(queryId) || !queryIds.dynamicQueryIds.has(queryId))) {
        flags |= 268435456 /* StaticQuery */;
    }
    else {
        flags |= 536870912 /* DynamicQuery */;
    }
    return flags;
}
export function elementEventFullName(target, name) {
    return target ? target + ":" + name : name;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld19jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBK0MsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRWxJLE9BQU8sRUFBQyxXQUFXLEVBQW9CLGdCQUFnQixFQUFpQixvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSw4QkFBOEIsRUFBQyxNQUFNLHVDQUF1QyxDQUFDO0FBQ25NLE9BQU8sRUFBNkIsdUJBQXVCLEVBQXlELE1BQU0sU0FBUyxDQUFDO0FBRXBJLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sS0FBSyxDQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUMsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFN0QsT0FBTyxFQUF5RyxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFxSCxnQkFBZ0IsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBRzNVLE9BQU8sRUFBQyxtQ0FBbUMsRUFBRSxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFdEgsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQzNCLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQixJQUFNLHFCQUFxQixHQUFHLFlBQVksQ0FBQztBQUUzQztJQUNFLDJCQUFtQixZQUFvQixFQUFTLGVBQXVCO1FBQXBELGlC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TUFBTSxDQUFDLENBQUMsQ0FBSSxNQUFNLFNBQUksSUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDN0MsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIENvbXBpbGVQaXBlU3VtbWFyeSwgcmVuZGVyZXJUeXBlTmFtZSwgdG9rZW5SZWZlcmVuY2UsIHZpZXdDbGFzc05hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0JpbmRpbmdGb3JtLCBCdWlsdGluQ29udmVydGVyLCBFdmVudEhhbmRsZXJWYXJzLCBMb2NhbFJlc29sdmVyLCBjb252ZXJ0QWN0aW9uQmluZGluZywgY29udmVydFByb3BlcnR5QmluZGluZywgY29udmVydFByb3BlcnR5QmluZGluZ0J1aWx0aW5zfSBmcm9tICcuLi9jb21waWxlcl91dGlsL2V4cHJlc3Npb25fY29udmVydGVyJztcbmltcG9ydCB7QXJndW1lbnRUeXBlLCBCaW5kaW5nRmxhZ3MsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBOb2RlRmxhZ3MsIFF1ZXJ5QmluZGluZ1R5cGUsIFF1ZXJ5VmFsdWVUeXBlLCBWaWV3RmxhZ3N9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHtBU1QsIEFTVFdpdGhTb3VyY2UsIEludGVycG9sYXRpb259IGZyb20gJy4uL2V4cHJlc3Npb25fcGFyc2VyL2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQge0xpZmVjeWNsZUhvb2tzfSBmcm9tICcuLi9saWZlY3ljbGVfcmVmbGVjdG9yJztcbmltcG9ydCB7aXNOZ0NvbnRhaW5lcn0gZnJvbSAnLi4vbWxfcGFyc2VyL3RhZ3MnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge2NvbnZlcnRWYWx1ZVRvT3V0cHV0QXN0fSBmcm9tICcuLi9vdXRwdXQvdmFsdWVfdXRpbCc7XG5pbXBvcnQge1BhcnNlU291cmNlU3Bhbn0gZnJvbSAnLi4vcGFyc2VfdXRpbCc7XG5pbXBvcnQge0F0dHJBc3QsIEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBCb3VuZEV2ZW50QXN0LCBCb3VuZFRleHRBc3QsIERpcmVjdGl2ZUFzdCwgRWxlbWVudEFzdCwgRW1iZWRkZWRUZW1wbGF0ZUFzdCwgTmdDb250ZW50QXN0LCBQcm9wZXJ0eUJpbmRpbmdUeXBlLCBQcm92aWRlckFzdCwgUXVlcnlNYXRjaCwgUmVmZXJlbmNlQXN0LCBUZW1wbGF0ZUFzdCwgVGVtcGxhdGVBc3RWaXNpdG9yLCBUZXh0QXN0LCBWYXJpYWJsZUFzdCwgdGVtcGxhdGVWaXNpdEFsbH0gZnJvbSAnLi4vdGVtcGxhdGVfcGFyc2VyL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge091dHB1dENvbnRleHR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyRGVmLCBkZXBEZWYsIGxpZmVjeWNsZUhvb2tUb05vZGVGbGFnLCBwcm92aWRlckRlZn0gZnJvbSAnLi9wcm92aWRlcl9jb21waWxlcic7XG5cbmNvbnN0IENMQVNTX0FUVFIgPSAnY2xhc3MnO1xuY29uc3QgU1RZTEVfQVRUUiA9ICdzdHlsZSc7XG5jb25zdCBJTVBMSUNJVF9URU1QTEFURV9WQVIgPSAnXFwkaW1wbGljaXQnO1xuXG5leHBvcnQgY2xhc3MgVmlld0NvbXBpbGVSZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NsYXNzVmFyOiBzdHJpbmcsIHB1YmxpYyByZW5kZXJlclR5cGVWYXI6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIFZpZXdDb21waWxlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlZmxlY3RvcjogQ29tcGlsZVJlZmxlY3Rvcikge31cblxuICBjb21waWxlQ29tcG9uZW50KFxuICAgICAgb3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LCBjb21wb25lbnQ6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgdGVtcGxhdGU6IFRlbXBsYXRlQXN0W10sXG4gICAgICBzdHlsZXM6IG8uRXhwcmVzc2lvbiwgdXNlZFBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXSk6IFZpZXdDb21waWxlUmVzdWx0IHtcbiAgICBsZXQgZW1iZWRkZWRWaWV3Q291bnQgPSAwO1xuICAgIGNvbnN0IHN0YXRpY1F1ZXJ5SWRzID0gZmluZFN0YXRpY1F1ZXJ5SWRzKHRlbXBsYXRlKTtcblxuICAgIGxldCByZW5kZXJDb21wb25lbnRWYXJOYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQgITtcbiAgICBpZiAoIWNvbXBvbmVudC5pc0hvc3QpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gY29tcG9uZW50LnRlbXBsYXRlICE7XG4gICAgICBjb25zdCBjdXN0b21SZW5kZXJEYXRhOiBvLkxpdGVyYWxNYXBFbnRyeVtdID0gW107XG4gICAgICBpZiAodGVtcGxhdGUuYW5pbWF0aW9ucyAmJiB0ZW1wbGF0ZS5hbmltYXRpb25zLmxlbmd0aCkge1xuICAgICAgICBjdXN0b21SZW5kZXJEYXRhLnB1c2gobmV3IG8uTGl0ZXJhbE1hcEVudHJ5KFxuICAgICAgICAgICAgJ2FuaW1hdGlvbicsIGNvbnZlcnRWYWx1ZVRvT3V0cHV0QXN0KG91dHB1dEN0eCwgdGVtcGxhdGUuYW5pbWF0aW9ucyksIHRydWUpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVuZGVyQ29tcG9uZW50VmFyID0gby52YXJpYWJsZShyZW5kZXJlclR5cGVOYW1lKGNvbXBvbmVudC50eXBlLnJlZmVyZW5jZSkpO1xuICAgICAgcmVuZGVyQ29tcG9uZW50VmFyTmFtZSA9IHJlbmRlckNvbXBvbmVudFZhci5uYW1lICE7XG4gICAgICBvdXRwdXRDdHguc3RhdGVtZW50cy5wdXNoKFxuICAgICAgICAgIHJlbmRlckNvbXBvbmVudFZhclxuICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5jcmVhdGVSZW5kZXJlclR5cGUyKS5jYWxsRm4oW25ldyBvLkxpdGVyYWxNYXBFeHByKFtcbiAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRW50cnkoJ2VuY2Fwc3VsYXRpb24nLCBvLmxpdGVyYWwodGVtcGxhdGUuZW5jYXBzdWxhdGlvbiksIGZhbHNlKSxcbiAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRW50cnkoJ3N0eWxlcycsIHN0eWxlcywgZmFsc2UpLFxuICAgICAgICAgICAgICAgIG5ldyBvLkxpdGVyYWxNYXBFbnRyeSgnZGF0YScsIG5ldyBvLkxpdGVyYWxNYXBFeHByKGN1c3RvbVJlbmRlckRhdGEpLCBmYWxzZSlcbiAgICAgICAgICAgICAgXSldKSlcbiAgICAgICAgICAgICAgLnRvRGVjbFN0bXQoXG4gICAgICAgICAgICAgICAgICBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuUmVuZGVyZXJUeXBlMiksXG4gICAgICAgICAgICAgICAgICBbby5TdG10TW9kaWZpZXIuRmluYWwsIG8uU3RtdE1vZGlmaWVyLkV4cG9ydGVkXSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHZpZXdCdWlsZGVyRmFjdG9yeSA9IChwYXJlbnQ6IFZpZXdCdWlsZGVyIHwgbnVsbCk6IFZpZXdCdWlsZGVyID0+IHtcbiAgICAgIGNvbnN0IGVtYmVkZGVkVmlld0luZGV4ID0gZW1iZWRkZWRWaWV3Q291bnQrKztcbiAgICAgIHJldHVybiBuZXcgVmlld0J1aWxkZXIoXG4gICAgICAgICAgdGhpcy5fcmVmbGVjdG9yLCBvdXRwdXRDdHgsIHBhcmVudCwgY29tcG9uZW50LCBlbWJlZGRlZFZpZXdJbmRleCwgdXNlZFBpcGVzLFxuICAgICAgICAgIHN0YXRpY1F1ZXJ5SWRzLCB2aWV3QnVpbGRlckZhY3RvcnkpO1xuICAgIH07XG5cbiAgICBjb25zdCB2aXNpdG9yID0gdmlld0J1aWxkZXJGYWN0b3J5KG51bGwpO1xuICAgIHZpc2l0b3IudmlzaXRBbGwoW10sIHRlbXBsYXRlKTtcblxuICAgIG91dHB1dEN0eC5zdGF0ZW1lbnRzLnB1c2goLi4udmlzaXRvci5idWlsZCgpKTtcblxuICAgIHJldHVybiBuZXcgVmlld0NvbXBpbGVSZXN1bHQodmlzaXRvci52aWV3TmFtZSwgcmVuZGVyQ29tcG9uZW50VmFyTmFtZSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFZpZXdCdWlsZGVyRmFjdG9yeSB7XG4gIChwYXJlbnQ6IFZpZXdCdWlsZGVyKTogVmlld0J1aWxkZXI7XG59XG5cbmludGVyZmFjZSBVcGRhdGVFeHByZXNzaW9uIHtcbiAgY29udGV4dDogby5FeHByZXNzaW9uO1xuICBub2RlSW5kZXg6IG51bWJlcjtcbiAgYmluZGluZ0luZGV4OiBudW1iZXI7XG4gIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbjtcbiAgdmFsdWU6IEFTVDtcbn1cblxuY29uc3QgTE9HX1ZBUiA9IG8udmFyaWFibGUoJ19sJyk7XG5jb25zdCBWSUVXX1ZBUiA9IG8udmFyaWFibGUoJ192Jyk7XG5jb25zdCBDSEVDS19WQVIgPSBvLnZhcmlhYmxlKCdfY2snKTtcbmNvbnN0IENPTVBfVkFSID0gby52YXJpYWJsZSgnX2NvJyk7XG5jb25zdCBFVkVOVF9OQU1FX1ZBUiA9IG8udmFyaWFibGUoJ2VuJyk7XG5jb25zdCBBTExPV19ERUZBVUxUX1ZBUiA9IG8udmFyaWFibGUoYGFkYCk7XG5cbmNsYXNzIFZpZXdCdWlsZGVyIGltcGxlbWVudHMgVGVtcGxhdGVBc3RWaXNpdG9yLCBMb2NhbFJlc29sdmVyIHtcbiAgcHJpdmF0ZSBjb21wVHlwZTogby5UeXBlO1xuICBwcml2YXRlIG5vZGVzOiAoKCkgPT4ge1xuICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiB8IG51bGwsXG4gICAgbm9kZURlZjogby5FeHByZXNzaW9uLFxuICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLCB1cGRhdGVEaXJlY3RpdmVzPzogVXBkYXRlRXhwcmVzc2lvbltdLCB1cGRhdGVSZW5kZXJlcj86IFVwZGF0ZUV4cHJlc3Npb25bXVxuICB9KVtdID0gW107XG4gIHByaXZhdGUgcHVyZVBpcGVOb2RlSW5kaWNlczoge1twaXBlTmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIC8vIE5lZWQgT2JqZWN0LmNyZWF0ZSBzbyB0aGF0IHdlIGRvbid0IGhhdmUgYnVpbHRpbiB2YWx1ZXMuLi5cbiAgcHJpdmF0ZSByZWZOb2RlSW5kaWNlczoge1tyZWZOYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgcHJpdmF0ZSB2YXJpYWJsZXM6IFZhcmlhYmxlQXN0W10gPSBbXTtcbiAgcHJpdmF0ZSBjaGlsZHJlbjogVmlld0J1aWxkZXJbXSA9IFtdO1xuXG4gIHB1YmxpYyByZWFkb25seSB2aWV3TmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSByZWZsZWN0b3I6IENvbXBpbGVSZWZsZWN0b3IsIHByaXZhdGUgb3V0cHV0Q3R4OiBPdXRwdXRDb250ZXh0LFxuICAgICAgcHJpdmF0ZSBwYXJlbnQ6IFZpZXdCdWlsZGVyfG51bGwsIHByaXZhdGUgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICBwcml2YXRlIGVtYmVkZGVkVmlld0luZGV4OiBudW1iZXIsIHByaXZhdGUgdXNlZFBpcGVzOiBDb21waWxlUGlwZVN1bW1hcnlbXSxcbiAgICAgIHByaXZhdGUgc3RhdGljUXVlcnlJZHM6IE1hcDxUZW1wbGF0ZUFzdCwgU3RhdGljQW5kRHluYW1pY1F1ZXJ5SWRzPixcbiAgICAgIHByaXZhdGUgdmlld0J1aWxkZXJGYWN0b3J5OiBWaWV3QnVpbGRlckZhY3RvcnkpIHtcbiAgICAvLyBUT0RPKHRib3NjaCk6IFRoZSBvbGQgdmlldyBjb21waWxlciB1c2VkIHRvIHVzZSBhbiBgYW55YCB0eXBlXG4gICAgLy8gZm9yIHRoZSBjb250ZXh0IGluIGFueSBlbWJlZGRlZCB2aWV3LiBXZSBrZWVwIHRoaXMgYmVoYWl2b3IgZm9yIG5vd1xuICAgIC8vIHRvIGJlIGFibGUgdG8gaW50cm9kdWNlIHRoZSBuZXcgdmlldyBjb21waWxlciB3aXRob3V0IHRvbyBtYW55IGVycm9ycy5cbiAgICB0aGlzLmNvbXBUeXBlID0gdGhpcy5lbWJlZGRlZFZpZXdJbmRleCA+IDAgP1xuICAgICAgICBvLkRZTkFNSUNfVFlQRSA6XG4gICAgICAgIG8uZXhwcmVzc2lvblR5cGUob3V0cHV0Q3R4LmltcG9ydEV4cHIodGhpcy5jb21wb25lbnQudHlwZS5yZWZlcmVuY2UpKSAhO1xuICAgIHRoaXMudmlld05hbWUgPSB2aWV3Q2xhc3NOYW1lKHRoaXMuY29tcG9uZW50LnR5cGUucmVmZXJlbmNlLCB0aGlzLmVtYmVkZGVkVmlld0luZGV4KTtcbiAgfVxuXG4gIHZpc2l0QWxsKHZhcmlhYmxlczogVmFyaWFibGVBc3RbXSwgYXN0Tm9kZXM6IFRlbXBsYXRlQXN0W10pIHtcbiAgICB0aGlzLnZhcmlhYmxlcyA9IHZhcmlhYmxlcztcbiAgICAvLyBjcmVhdGUgdGhlIHBpcGVzIGZvciB0aGUgcHVyZSBwaXBlcyBpbW1lZGlhdGVseSwgc28gdGhhdCB3ZSBrbm93IHRoZWlyIGluZGljZXMuXG4gICAgaWYgKCF0aGlzLnBhcmVudCkge1xuICAgICAgdGhpcy51c2VkUGlwZXMuZm9yRWFjaCgocGlwZSkgPT4ge1xuICAgICAgICBpZiAocGlwZS5wdXJlKSB7XG4gICAgICAgICAgdGhpcy5wdXJlUGlwZU5vZGVJbmRpY2VzW3BpcGUubmFtZV0gPSB0aGlzLl9jcmVhdGVQaXBlKG51bGwsIHBpcGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgICBjb25zdCBxdWVyeUlkcyA9IHN0YXRpY1ZpZXdRdWVyeUlkcyh0aGlzLnN0YXRpY1F1ZXJ5SWRzKTtcbiAgICAgIHRoaXMuY29tcG9uZW50LnZpZXdRdWVyaWVzLmZvckVhY2goKHF1ZXJ5LCBxdWVyeUluZGV4KSA9PiB7XG4gICAgICAgIC8vIE5vdGU6IHF1ZXJpZXMgc3RhcnQgd2l0aCBpZCAxIHNvIHdlIGNhbiB1c2UgdGhlIG51bWJlciBpbiBhIEJsb29tIGZpbHRlciFcbiAgICAgICAgY29uc3QgcXVlcnlJZCA9IHF1ZXJ5SW5kZXggKyAxO1xuICAgICAgICBjb25zdCBiaW5kaW5nVHlwZSA9IHF1ZXJ5LmZpcnN0ID8gUXVlcnlCaW5kaW5nVHlwZS5GaXJzdCA6IFF1ZXJ5QmluZGluZ1R5cGUuQWxsO1xuICAgICAgICBjb25zdCBmbGFncyA9XG4gICAgICAgICAgICBOb2RlRmxhZ3MuVHlwZVZpZXdRdWVyeSB8IGNhbGNTdGF0aWNEeW5hbWljUXVlcnlGbGFncyhxdWVyeUlkcywgcXVlcnlJZCwgcXVlcnkuZmlyc3QpO1xuICAgICAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3BhbjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUZsYWdzOiBmbGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnF1ZXJ5RGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChmbGFncyksIG8ubGl0ZXJhbChxdWVyeUlkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRXhwcihbbmV3IG8uTGl0ZXJhbE1hcEVudHJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVyeS5wcm9wZXJ0eU5hbWUsIG8ubGl0ZXJhbChiaW5kaW5nVHlwZSksIGZhbHNlKV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3ROb2Rlcyk7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmIChhc3ROb2Rlcy5sZW5ndGggPT09IDAgfHwgbmVlZHNBZGRpdGlvbmFsUm9vdE5vZGUoYXN0Tm9kZXMpKSkge1xuICAgICAgLy8gaWYgdGhlIHZpZXcgaXMgYW4gZW1iZWRkZWQgdmlldywgdGhlbiB3ZSBuZWVkIHRvIGFkZCBhbiBhZGRpdGlvbmFsIHJvb3Qgbm9kZSBpbiBzb21lIGNhc2VzXG4gICAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlRWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5hbmNob3JEZWYpLmNhbGxGbihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChOb2RlRmxhZ3MuTm9uZSksIG8uTlVMTF9FWFBSLCBvLk5VTExfRVhQUiwgby5saXRlcmFsKDApXG4gICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBidWlsZCh0YXJnZXRTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW10pOiBvLlN0YXRlbWVudFtdIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiBjaGlsZC5idWlsZCh0YXJnZXRTdGF0ZW1lbnRzKSk7XG5cbiAgICBjb25zdCB7dXBkYXRlUmVuZGVyZXJTdG10cywgdXBkYXRlRGlyZWN0aXZlc1N0bXRzLCBub2RlRGVmRXhwcnN9ID1cbiAgICAgICAgdGhpcy5fY3JlYXRlTm9kZUV4cHJlc3Npb25zKCk7XG5cbiAgICBjb25zdCB1cGRhdGVSZW5kZXJlckZuID0gdGhpcy5fY3JlYXRlVXBkYXRlRm4odXBkYXRlUmVuZGVyZXJTdG10cyk7XG4gICAgY29uc3QgdXBkYXRlRGlyZWN0aXZlc0ZuID0gdGhpcy5fY3JlYXRlVXBkYXRlRm4odXBkYXRlRGlyZWN0aXZlc1N0bXRzKTtcblxuXG4gICAgbGV0IHZpZXdGbGFncyA9IFZpZXdGbGFncy5Ob25lO1xuICAgIGlmICghdGhpcy5wYXJlbnQgJiYgdGhpcy5jb21wb25lbnQuY2hhbmdlRGV0ZWN0aW9uID09PSBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gpIHtcbiAgICAgIHZpZXdGbGFncyB8PSBWaWV3RmxhZ3MuT25QdXNoO1xuICAgIH1cbiAgICBjb25zdCB2aWV3RmFjdG9yeSA9IG5ldyBvLkRlY2xhcmVGdW5jdGlvblN0bXQoXG4gICAgICAgIHRoaXMudmlld05hbWUsIFtuZXcgby5GblBhcmFtKExPR19WQVIubmFtZSAhKV0sXG4gICAgICAgIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnZpZXdEZWYpLmNhbGxGbihbXG4gICAgICAgICAgby5saXRlcmFsKHZpZXdGbGFncyksXG4gICAgICAgICAgby5saXRlcmFsQXJyKG5vZGVEZWZFeHBycyksXG4gICAgICAgICAgdXBkYXRlRGlyZWN0aXZlc0ZuLFxuICAgICAgICAgIHVwZGF0ZVJlbmRlcmVyRm4sXG4gICAgICAgIF0pKV0sXG4gICAgICAgIG8uaW1wb3J0VHlwZShJZGVudGlmaWVycy5WaWV3RGVmaW5pdGlvbiksXG4gICAgICAgIHRoaXMuZW1iZWRkZWRWaWV3SW5kZXggPT09IDAgPyBbby5TdG10TW9kaWZpZXIuRXhwb3J0ZWRdIDogW10pO1xuXG4gICAgdGFyZ2V0U3RhdGVtZW50cy5wdXNoKHZpZXdGYWN0b3J5KTtcbiAgICByZXR1cm4gdGFyZ2V0U3RhdGVtZW50cztcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVVwZGF0ZUZuKHVwZGF0ZVN0bXRzOiBvLlN0YXRlbWVudFtdKTogby5FeHByZXNzaW9uIHtcbiAgICBsZXQgdXBkYXRlRm46IG8uRXhwcmVzc2lvbjtcbiAgICBpZiAodXBkYXRlU3RtdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcHJlU3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICAgIGlmICghdGhpcy5jb21wb25lbnQuaXNIb3N0ICYmIG8uZmluZFJlYWRWYXJOYW1lcyh1cGRhdGVTdG10cykuaGFzKENPTVBfVkFSLm5hbWUgISkpIHtcbiAgICAgICAgcHJlU3RtdHMucHVzaChDT01QX1ZBUi5zZXQoVklFV19WQVIucHJvcCgnY29tcG9uZW50JykpLnRvRGVjbFN0bXQodGhpcy5jb21wVHlwZSkpO1xuICAgICAgfVxuICAgICAgdXBkYXRlRm4gPSBvLmZuKFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIG5ldyBvLkZuUGFyYW0oQ0hFQ0tfVkFSLm5hbWUgISwgby5JTkZFUlJFRF9UWVBFKSxcbiAgICAgICAgICAgIG5ldyBvLkZuUGFyYW0oVklFV19WQVIubmFtZSAhLCBvLklORkVSUkVEX1RZUEUpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbLi4ucHJlU3RtdHMsIC4uLnVwZGF0ZVN0bXRzXSwgby5JTkZFUlJFRF9UWVBFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBkYXRlRm4gPSBvLk5VTExfRVhQUjtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZUZuO1xuICB9XG5cbiAgdmlzaXROZ0NvbnRlbnQoYXN0OiBOZ0NvbnRlbnRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgLy8gbmdDb250ZW50RGVmKG5nQ29udGVudEluZGV4OiBudW1iZXIsIGluZGV4OiBudW1iZXIpOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXMucHVzaCgoKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVOZ0NvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5nQ29udGVudERlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChhc3QubmdDb250ZW50SW5kZXgpLCBvLmxpdGVyYWwoYXN0LmluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgfVxuXG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgLy8gU3RhdGljIHRleHQgbm9kZXMgaGF2ZSBubyBjaGVjayBmdW5jdGlvblxuICAgIGNvbnN0IGNoZWNrSW5kZXggPSAtMTtcbiAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3BhbixcbiAgICAgICAgICAgICAgICAgICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMudGV4dERlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChhc3QubmdDb250ZW50SW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsQXJyKFtvLmxpdGVyYWwoYXN0LnZhbHVlKV0pLFxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgfVxuXG4gIHZpc2l0Qm91bmRUZXh0KGFzdDogQm91bmRUZXh0QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgIC8vIHJlc2VydmUgdGhlIHNwYWNlIGluIHRoZSBub2RlRGVmcyBhcnJheVxuICAgIHRoaXMubm9kZXMucHVzaChudWxsICEpO1xuXG4gICAgY29uc3QgYXN0V2l0aFNvdXJjZSA9IDxBU1RXaXRoU291cmNlPmFzdC52YWx1ZTtcbiAgICBjb25zdCBpbnRlciA9IDxJbnRlcnBvbGF0aW9uPmFzdFdpdGhTb3VyY2UuYXN0O1xuXG4gICAgY29uc3QgdXBkYXRlUmVuZGVyZXJFeHByZXNzaW9ucyA9IGludGVyLmV4cHJlc3Npb25zLm1hcChcbiAgICAgICAgKGV4cHIsIGJpbmRpbmdJbmRleCkgPT4gdGhpcy5fcHJlcHJvY2Vzc1VwZGF0ZUV4cHJlc3Npb24oXG4gICAgICAgICAgICB7bm9kZUluZGV4LCBiaW5kaW5nSW5kZXgsIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLCBjb250ZXh0OiBDT01QX1ZBUiwgdmFsdWU6IGV4cHJ9KSk7XG5cbiAgICAvLyBDaGVjayBpbmRleCBpcyB0aGUgc2FtZSBhcyB0aGUgbm9kZSBpbmRleCBkdXJpbmcgY29tcGlsYXRpb25cbiAgICAvLyBUaGV5IG1pZ2h0IG9ubHkgZGlmZmVyIGF0IHJ1bnRpbWVcbiAgICBjb25zdCBjaGVja0luZGV4ID0gbm9kZUluZGV4O1xuXG4gICAgdGhpcy5ub2Rlc1tub2RlSW5kZXhdID0gKCkgPT4gKHtcbiAgICAgIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLFxuICAgICAgbm9kZUZsYWdzOiBOb2RlRmxhZ3MuVHlwZVRleHQsXG4gICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMudGV4dERlZikuY2FsbEZuKFtcbiAgICAgICAgby5saXRlcmFsKGNoZWNrSW5kZXgpLFxuICAgICAgICBvLmxpdGVyYWwoYXN0Lm5nQ29udGVudEluZGV4KSxcbiAgICAgICAgby5saXRlcmFsQXJyKGludGVyLnN0cmluZ3MubWFwKHMgPT4gby5saXRlcmFsKHMpKSksXG4gICAgICBdKSxcbiAgICAgIHVwZGF0ZVJlbmRlcmVyOiB1cGRhdGVSZW5kZXJlckV4cHJlc3Npb25zXG4gICAgfSk7XG4gIH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgIC8vIHJlc2VydmUgdGhlIHNwYWNlIGluIHRoZSBub2RlRGVmcyBhcnJheVxuICAgIHRoaXMubm9kZXMucHVzaChudWxsICEpO1xuXG4gICAgY29uc3Qge2ZsYWdzLCBxdWVyeU1hdGNoZXNFeHByLCBob3N0RXZlbnRzfSA9IHRoaXMuX3Zpc2l0RWxlbWVudE9yVGVtcGxhdGUobm9kZUluZGV4LCBhc3QpO1xuXG4gICAgY29uc3QgY2hpbGRWaXNpdG9yID0gdGhpcy52aWV3QnVpbGRlckZhY3RvcnkodGhpcyk7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkVmlzaXRvcik7XG4gICAgY2hpbGRWaXNpdG9yLnZpc2l0QWxsKGFzdC52YXJpYWJsZXMsIGFzdC5jaGlsZHJlbik7XG5cbiAgICBjb25zdCBjaGlsZENvdW50ID0gdGhpcy5ub2Rlcy5sZW5ndGggLSBub2RlSW5kZXggLSAxO1xuXG4gICAgLy8gYW5jaG9yRGVmKFxuICAgIC8vICAgZmxhZ3M6IE5vZGVGbGFncywgbWF0Y2hlZFF1ZXJpZXM6IFtzdHJpbmcsIFF1ZXJ5VmFsdWVUeXBlXVtdLCBuZ0NvbnRlbnRJbmRleDogbnVtYmVyLFxuICAgIC8vICAgY2hpbGRDb3VudDogbnVtYmVyLCBoYW5kbGVFdmVudEZuPzogRWxlbWVudEhhbmRsZUV2ZW50Rm4sIHRlbXBsYXRlRmFjdG9yeT86XG4gICAgLy8gICBWaWV3RGVmaW5pdGlvbkZhY3RvcnkpOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXNbbm9kZUluZGV4XSA9ICgpID0+ICh7XG4gICAgICBzb3VyY2VTcGFuOiBhc3Quc291cmNlU3BhbixcbiAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVFbGVtZW50IHwgZmxhZ3MsXG4gICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuYW5jaG9yRGVmKS5jYWxsRm4oW1xuICAgICAgICBvLmxpdGVyYWwoZmxhZ3MpLFxuICAgICAgICBxdWVyeU1hdGNoZXNFeHByLFxuICAgICAgICBvLmxpdGVyYWwoYXN0Lm5nQ29udGVudEluZGV4KSxcbiAgICAgICAgby5saXRlcmFsKGNoaWxkQ291bnQpLFxuICAgICAgICB0aGlzLl9jcmVhdGVFbGVtZW50SGFuZGxlRXZlbnRGbihub2RlSW5kZXgsIGhvc3RFdmVudHMpLFxuICAgICAgICBvLnZhcmlhYmxlKGNoaWxkVmlzaXRvci52aWV3TmFtZSksXG4gICAgICBdKVxuICAgIH0pO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGFzdDogRWxlbWVudEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBub2RlSW5kZXggPSB0aGlzLm5vZGVzLmxlbmd0aDtcbiAgICAvLyByZXNlcnZlIHRoZSBzcGFjZSBpbiB0aGUgbm9kZURlZnMgYXJyYXkgc28gd2UgY2FuIGFkZCBjaGlsZHJlblxuICAgIHRoaXMubm9kZXMucHVzaChudWxsICEpO1xuXG4gICAgLy8gVXNpbmcgYSBudWxsIGVsZW1lbnQgbmFtZSBjcmVhdGVzIGFuIGFuY2hvci5cbiAgICBjb25zdCBlbE5hbWU6IHN0cmluZ3xudWxsID0gaXNOZ0NvbnRhaW5lcihhc3QubmFtZSkgPyBudWxsIDogYXN0Lm5hbWU7XG5cbiAgICBjb25zdCB7ZmxhZ3MsIHVzZWRFdmVudHMsIHF1ZXJ5TWF0Y2hlc0V4cHIsIGhvc3RCaW5kaW5nczogZGlySG9zdEJpbmRpbmdzLCBob3N0RXZlbnRzfSA9XG4gICAgICAgIHRoaXMuX3Zpc2l0RWxlbWVudE9yVGVtcGxhdGUobm9kZUluZGV4LCBhc3QpO1xuXG4gICAgbGV0IGlucHV0RGVmczogby5FeHByZXNzaW9uW10gPSBbXTtcbiAgICBsZXQgdXBkYXRlUmVuZGVyZXJFeHByZXNzaW9uczogVXBkYXRlRXhwcmVzc2lvbltdID0gW107XG4gICAgbGV0IG91dHB1dERlZnM6IG8uRXhwcmVzc2lvbltdID0gW107XG4gICAgaWYgKGVsTmFtZSkge1xuICAgICAgY29uc3QgaG9zdEJpbmRpbmdzOiBhbnlbXSA9IGFzdC5pbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoaW5wdXRBc3QpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiBDT01QX1ZBUiBhcyBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dEFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpckFzdDogbnVsbCBhcyBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoZGlySG9zdEJpbmRpbmdzKTtcbiAgICAgIGlmIChob3N0QmluZGluZ3MubGVuZ3RoKSB7XG4gICAgICAgIHVwZGF0ZVJlbmRlcmVyRXhwcmVzc2lvbnMgPVxuICAgICAgICAgICAgaG9zdEJpbmRpbmdzLm1hcCgoaG9zdEJpbmRpbmcsIGJpbmRpbmdJbmRleCkgPT4gdGhpcy5fcHJlcHJvY2Vzc1VwZGF0ZUV4cHJlc3Npb24oe1xuICAgICAgICAgICAgICBjb250ZXh0OiBob3N0QmluZGluZy5jb250ZXh0LFxuICAgICAgICAgICAgICBub2RlSW5kZXgsXG4gICAgICAgICAgICAgIGJpbmRpbmdJbmRleCxcbiAgICAgICAgICAgICAgc291cmNlU3BhbjogaG9zdEJpbmRpbmcuaW5wdXRBc3Quc291cmNlU3BhbixcbiAgICAgICAgICAgICAgdmFsdWU6IGhvc3RCaW5kaW5nLmlucHV0QXN0LnZhbHVlXG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIGlucHV0RGVmcyA9IGhvc3RCaW5kaW5ncy5tYXAoXG4gICAgICAgICAgICBob3N0QmluZGluZyA9PiBlbGVtZW50QmluZGluZ0RlZihob3N0QmluZGluZy5pbnB1dEFzdCwgaG9zdEJpbmRpbmcuZGlyQXN0KSk7XG4gICAgICB9XG4gICAgICBvdXRwdXREZWZzID0gdXNlZEV2ZW50cy5tYXAoXG4gICAgICAgICAgKFt0YXJnZXQsIGV2ZW50TmFtZV0pID0+IG8ubGl0ZXJhbEFycihbby5saXRlcmFsKHRhcmdldCksIG8ubGl0ZXJhbChldmVudE5hbWUpXSkpO1xuICAgIH1cblxuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmNoaWxkcmVuKTtcblxuICAgIGNvbnN0IGNoaWxkQ291bnQgPSB0aGlzLm5vZGVzLmxlbmd0aCAtIG5vZGVJbmRleCAtIDE7XG5cbiAgICBjb25zdCBjb21wQXN0ID0gYXN0LmRpcmVjdGl2ZXMuZmluZChkaXJBc3QgPT4gZGlyQXN0LmRpcmVjdGl2ZS5pc0NvbXBvbmVudCk7XG4gICAgbGV0IGNvbXBSZW5kZXJlclR5cGUgPSBvLk5VTExfRVhQUiBhcyBvLkV4cHJlc3Npb247XG4gICAgbGV0IGNvbXBWaWV3ID0gby5OVUxMX0VYUFIgYXMgby5FeHByZXNzaW9uO1xuICAgIGlmIChjb21wQXN0KSB7XG4gICAgICBjb21wVmlldyA9IHRoaXMub3V0cHV0Q3R4LmltcG9ydEV4cHIoY29tcEFzdC5kaXJlY3RpdmUuY29tcG9uZW50Vmlld1R5cGUpO1xuICAgICAgY29tcFJlbmRlcmVyVHlwZSA9IHRoaXMub3V0cHV0Q3R4LmltcG9ydEV4cHIoY29tcEFzdC5kaXJlY3RpdmUucmVuZGVyZXJUeXBlKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpbmRleCBpcyB0aGUgc2FtZSBhcyB0aGUgbm9kZSBpbmRleCBkdXJpbmcgY29tcGlsYXRpb25cbiAgICAvLyBUaGV5IG1pZ2h0IG9ubHkgZGlmZmVyIGF0IHJ1bnRpbWVcbiAgICBjb25zdCBjaGVja0luZGV4ID0gbm9kZUluZGV4O1xuXG4gICAgdGhpcy5ub2Rlc1tub2RlSW5kZXhdID0gKCkgPT4gKHtcbiAgICAgIHNvdXJjZVNwYW46IGFzdC5zb3VyY2VTcGFuLFxuICAgICAgbm9kZUZsYWdzOiBOb2RlRmxhZ3MuVHlwZUVsZW1lbnQgfCBmbGFncyxcbiAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5lbGVtZW50RGVmKS5jYWxsRm4oW1xuICAgICAgICBvLmxpdGVyYWwoY2hlY2tJbmRleCksXG4gICAgICAgIG8ubGl0ZXJhbChmbGFncyksXG4gICAgICAgIHF1ZXJ5TWF0Y2hlc0V4cHIsXG4gICAgICAgIG8ubGl0ZXJhbChhc3QubmdDb250ZW50SW5kZXgpLFxuICAgICAgICBvLmxpdGVyYWwoY2hpbGRDb3VudCksXG4gICAgICAgIG8ubGl0ZXJhbChlbE5hbWUpLFxuICAgICAgICBlbE5hbWUgPyBmaXhlZEF0dHJzRGVmKGFzdCkgOiBvLk5VTExfRVhQUixcbiAgICAgICAgaW5wdXREZWZzLmxlbmd0aCA/IG8ubGl0ZXJhbEFycihpbnB1dERlZnMpIDogby5OVUxMX0VYUFIsXG4gICAgICAgIG91dHB1dERlZnMubGVuZ3RoID8gby5saXRlcmFsQXJyKG91dHB1dERlZnMpIDogby5OVUxMX0VYUFIsXG4gICAgICAgIHRoaXMuX2NyZWF0ZUVsZW1lbnRIYW5kbGVFdmVudEZuKG5vZGVJbmRleCwgaG9zdEV2ZW50cyksXG4gICAgICAgIGNvbXBWaWV3LFxuICAgICAgICBjb21wUmVuZGVyZXJUeXBlLFxuICAgICAgXSksXG4gICAgICB1cGRhdGVSZW5kZXJlcjogdXBkYXRlUmVuZGVyZXJFeHByZXNzaW9uc1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRFbGVtZW50T3JUZW1wbGF0ZShub2RlSW5kZXg6IG51bWJlciwgYXN0OiB7XG4gICAgaGFzVmlld0NvbnRhaW5lcjogYm9vbGVhbixcbiAgICBvdXRwdXRzOiBCb3VuZEV2ZW50QXN0W10sXG4gICAgZGlyZWN0aXZlczogRGlyZWN0aXZlQXN0W10sXG4gICAgcHJvdmlkZXJzOiBQcm92aWRlckFzdFtdLFxuICAgIHJlZmVyZW5jZXM6IFJlZmVyZW5jZUFzdFtdLFxuICAgIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdXG4gIH0pOiB7XG4gICAgZmxhZ3M6IE5vZGVGbGFncyxcbiAgICB1c2VkRXZlbnRzOiBbc3RyaW5nIHwgbnVsbCwgc3RyaW5nXVtdLFxuICAgIHF1ZXJ5TWF0Y2hlc0V4cHI6IG8uRXhwcmVzc2lvbixcbiAgICBob3N0QmluZGluZ3M6XG4gICAgICAgIHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGlucHV0QXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10sXG4gICAgaG9zdEV2ZW50czoge2NvbnRleHQ6IG8uRXhwcmVzc2lvbiwgZXZlbnRBc3Q6IEJvdW5kRXZlbnRBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0fVtdLFxuICB9IHtcbiAgICBsZXQgZmxhZ3MgPSBOb2RlRmxhZ3MuTm9uZTtcbiAgICBpZiAoYXN0Lmhhc1ZpZXdDb250YWluZXIpIHtcbiAgICAgIGZsYWdzIHw9IE5vZGVGbGFncy5FbWJlZGRlZFZpZXdzO1xuICAgIH1cbiAgICBjb25zdCB1c2VkRXZlbnRzID0gbmV3IE1hcDxzdHJpbmcsIFtzdHJpbmcgfCBudWxsLCBzdHJpbmddPigpO1xuICAgIGFzdC5vdXRwdXRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCB7bmFtZSwgdGFyZ2V0fSA9IGVsZW1lbnRFdmVudE5hbWVBbmRUYXJnZXQoZXZlbnQsIG51bGwpO1xuICAgICAgdXNlZEV2ZW50cy5zZXQoZWxlbWVudEV2ZW50RnVsbE5hbWUodGFyZ2V0LCBuYW1lKSwgW3RhcmdldCwgbmFtZV0pO1xuICAgIH0pO1xuICAgIGFzdC5kaXJlY3RpdmVzLmZvckVhY2goKGRpckFzdCkgPT4ge1xuICAgICAgZGlyQXN0Lmhvc3RFdmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3Qge25hbWUsIHRhcmdldH0gPSBlbGVtZW50RXZlbnROYW1lQW5kVGFyZ2V0KGV2ZW50LCBkaXJBc3QpO1xuICAgICAgICB1c2VkRXZlbnRzLnNldChlbGVtZW50RXZlbnRGdWxsTmFtZSh0YXJnZXQsIG5hbWUpLCBbdGFyZ2V0LCBuYW1lXSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBob3N0QmluZGluZ3M6XG4gICAgICAgIHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGlucHV0QXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10gPSBbXTtcbiAgICBjb25zdCBob3N0RXZlbnRzOiB7Y29udGV4dDogby5FeHByZXNzaW9uLCBldmVudEFzdDogQm91bmRFdmVudEFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10gPSBbXTtcbiAgICB0aGlzLl92aXNpdENvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyKGFzdC5kaXJlY3RpdmVzKTtcblxuICAgIGFzdC5wcm92aWRlcnMuZm9yRWFjaCgocHJvdmlkZXJBc3QsIHByb3ZpZGVySW5kZXgpID0+IHtcbiAgICAgIGxldCBkaXJBc3Q6IERpcmVjdGl2ZUFzdCA9IHVuZGVmaW5lZCAhO1xuICAgICAgbGV0IGRpckluZGV4OiBudW1iZXIgPSB1bmRlZmluZWQgITtcbiAgICAgIGFzdC5kaXJlY3RpdmVzLmZvckVhY2goKGxvY2FsRGlyQXN0LCBpKSA9PiB7XG4gICAgICAgIGlmIChsb2NhbERpckFzdC5kaXJlY3RpdmUudHlwZS5yZWZlcmVuY2UgPT09IHRva2VuUmVmZXJlbmNlKHByb3ZpZGVyQXN0LnRva2VuKSkge1xuICAgICAgICAgIGRpckFzdCA9IGxvY2FsRGlyQXN0O1xuICAgICAgICAgIGRpckluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZGlyQXN0KSB7XG4gICAgICAgIGNvbnN0IHtob3N0QmluZGluZ3M6IGRpckhvc3RCaW5kaW5ncywgaG9zdEV2ZW50czogZGlySG9zdEV2ZW50c30gPSB0aGlzLl92aXNpdERpcmVjdGl2ZShcbiAgICAgICAgICAgIHByb3ZpZGVyQXN0LCBkaXJBc3QsIGRpckluZGV4LCBub2RlSW5kZXgsIGFzdC5yZWZlcmVuY2VzLCBhc3QucXVlcnlNYXRjaGVzLCB1c2VkRXZlbnRzLFxuICAgICAgICAgICAgdGhpcy5zdGF0aWNRdWVyeUlkcy5nZXQoPGFueT5hc3QpICEpO1xuICAgICAgICBob3N0QmluZGluZ3MucHVzaCguLi5kaXJIb3N0QmluZGluZ3MpO1xuICAgICAgICBob3N0RXZlbnRzLnB1c2goLi4uZGlySG9zdEV2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl92aXNpdFByb3ZpZGVyKHByb3ZpZGVyQXN0LCBhc3QucXVlcnlNYXRjaGVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCBxdWVyeU1hdGNoRXhwcnM6IG8uRXhwcmVzc2lvbltdID0gW107XG4gICAgYXN0LnF1ZXJ5TWF0Y2hlcy5mb3JFYWNoKChtYXRjaCkgPT4ge1xuICAgICAgbGV0IHZhbHVlVHlwZTogUXVlcnlWYWx1ZVR5cGUgPSB1bmRlZmluZWQgITtcbiAgICAgIGlmICh0b2tlblJlZmVyZW5jZShtYXRjaC52YWx1ZSkgPT09XG4gICAgICAgICAgdGhpcy5yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLkVsZW1lbnRSZWYpKSB7XG4gICAgICAgIHZhbHVlVHlwZSA9IFF1ZXJ5VmFsdWVUeXBlLkVsZW1lbnRSZWY7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRva2VuUmVmZXJlbmNlKG1hdGNoLnZhbHVlKSA9PT1cbiAgICAgICAgICB0aGlzLnJlZmxlY3Rvci5yZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2UoSWRlbnRpZmllcnMuVmlld0NvbnRhaW5lclJlZikpIHtcbiAgICAgICAgdmFsdWVUeXBlID0gUXVlcnlWYWx1ZVR5cGUuVmlld0NvbnRhaW5lclJlZjtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgdG9rZW5SZWZlcmVuY2UobWF0Y2gudmFsdWUpID09PVxuICAgICAgICAgIHRoaXMucmVmbGVjdG9yLnJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShJZGVudGlmaWVycy5UZW1wbGF0ZVJlZikpIHtcbiAgICAgICAgdmFsdWVUeXBlID0gUXVlcnlWYWx1ZVR5cGUuVGVtcGxhdGVSZWY7XG4gICAgICB9XG4gICAgICBpZiAodmFsdWVUeXBlICE9IG51bGwpIHtcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzLnB1c2goby5saXRlcmFsQXJyKFtvLmxpdGVyYWwobWF0Y2gucXVlcnlJZCksIG8ubGl0ZXJhbCh2YWx1ZVR5cGUpXSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGFzdC5yZWZlcmVuY2VzLmZvckVhY2goKHJlZikgPT4ge1xuICAgICAgbGV0IHZhbHVlVHlwZTogUXVlcnlWYWx1ZVR5cGUgPSB1bmRlZmluZWQgITtcbiAgICAgIGlmICghcmVmLnZhbHVlKSB7XG4gICAgICAgIHZhbHVlVHlwZSA9IFF1ZXJ5VmFsdWVUeXBlLlJlbmRlckVsZW1lbnQ7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgIHRva2VuUmVmZXJlbmNlKHJlZi52YWx1ZSkgPT09XG4gICAgICAgICAgdGhpcy5yZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLlRlbXBsYXRlUmVmKSkge1xuICAgICAgICB2YWx1ZVR5cGUgPSBRdWVyeVZhbHVlVHlwZS5UZW1wbGF0ZVJlZjtcbiAgICAgIH1cbiAgICAgIGlmICh2YWx1ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlZk5vZGVJbmRpY2VzW3JlZi5uYW1lXSA9IG5vZGVJbmRleDtcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzLnB1c2goby5saXRlcmFsQXJyKFtvLmxpdGVyYWwocmVmLm5hbWUpLCBvLmxpdGVyYWwodmFsdWVUeXBlKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBhc3Qub3V0cHV0cy5mb3JFYWNoKChvdXRwdXRBc3QpID0+IHtcbiAgICAgIGhvc3RFdmVudHMucHVzaCh7Y29udGV4dDogQ09NUF9WQVIsIGV2ZW50QXN0OiBvdXRwdXRBc3QsIGRpckFzdDogbnVsbCAhfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgZmxhZ3MsXG4gICAgICB1c2VkRXZlbnRzOiBBcnJheS5mcm9tKHVzZWRFdmVudHMudmFsdWVzKCkpLFxuICAgICAgcXVlcnlNYXRjaGVzRXhwcjogcXVlcnlNYXRjaEV4cHJzLmxlbmd0aCA/IG8ubGl0ZXJhbEFycihxdWVyeU1hdGNoRXhwcnMpIDogby5OVUxMX0VYUFIsXG4gICAgICBob3N0QmluZGluZ3MsXG4gICAgICBob3N0RXZlbnRzOiBob3N0RXZlbnRzXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0RGlyZWN0aXZlKFxuICAgICAgcHJvdmlkZXJBc3Q6IFByb3ZpZGVyQXN0LCBkaXJBc3Q6IERpcmVjdGl2ZUFzdCwgZGlyZWN0aXZlSW5kZXg6IG51bWJlcixcbiAgICAgIGVsZW1lbnROb2RlSW5kZXg6IG51bWJlciwgcmVmczogUmVmZXJlbmNlQXN0W10sIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdLFxuICAgICAgdXNlZEV2ZW50czogTWFwPHN0cmluZywgYW55PiwgcXVlcnlJZHM6IFN0YXRpY0FuZER5bmFtaWNRdWVyeUlkcyk6IHtcbiAgICBob3N0QmluZGluZ3M6XG4gICAgICAgIHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGlucHV0QXN0OiBCb3VuZEVsZW1lbnRQcm9wZXJ0eUFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3R9W10sXG4gICAgaG9zdEV2ZW50czoge2NvbnRleHQ6IG8uRXhwcmVzc2lvbiwgZXZlbnRBc3Q6IEJvdW5kRXZlbnRBc3QsIGRpckFzdDogRGlyZWN0aXZlQXN0fVtdXG4gIH0ge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgIC8vIHJlc2VydmUgdGhlIHNwYWNlIGluIHRoZSBub2RlRGVmcyBhcnJheSBzbyB3ZSBjYW4gYWRkIGNoaWxkcmVuXG4gICAgdGhpcy5ub2Rlcy5wdXNoKG51bGwgISk7XG5cbiAgICBkaXJBc3QuZGlyZWN0aXZlLnF1ZXJpZXMuZm9yRWFjaCgocXVlcnksIHF1ZXJ5SW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHF1ZXJ5SWQgPSBkaXJBc3QuY29udGVudFF1ZXJ5U3RhcnRJZCArIHF1ZXJ5SW5kZXg7XG4gICAgICBjb25zdCBmbGFncyA9XG4gICAgICAgICAgTm9kZUZsYWdzLlR5cGVDb250ZW50UXVlcnkgfCBjYWxjU3RhdGljRHluYW1pY1F1ZXJ5RmxhZ3MocXVlcnlJZHMsIHF1ZXJ5SWQsIHF1ZXJ5LmZpcnN0KTtcbiAgICAgIGNvbnN0IGJpbmRpbmdUeXBlID0gcXVlcnkuZmlyc3QgPyBRdWVyeUJpbmRpbmdUeXBlLkZpcnN0IDogUXVlcnlCaW5kaW5nVHlwZS5BbGw7XG4gICAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVNwYW46IGRpckFzdC5zb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUZsYWdzOiBmbGFncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5xdWVyeURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGZsYWdzKSwgby5saXRlcmFsKHF1ZXJ5SWQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgby5MaXRlcmFsTWFwRXhwcihbbmV3IG8uTGl0ZXJhbE1hcEVudHJ5KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnkucHJvcGVydHlOYW1lLCBvLmxpdGVyYWwoYmluZGluZ1R5cGUpLCBmYWxzZSldKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIH0pO1xuXG4gICAgLy8gTm90ZTogdGhlIG9wZXJhdGlvbiBiZWxvdyBtaWdodCBhbHNvIGNyZWF0ZSBuZXcgbm9kZURlZnMsXG4gICAgLy8gYnV0IHdlIGRvbid0IHdhbnQgdGhlbSB0byBiZSBhIGNoaWxkIG9mIGEgZGlyZWN0aXZlLFxuICAgIC8vIGFzIHRoZXkgbWlnaHQgYmUgYSBwcm92aWRlci9waXBlIG9uIHRoZWlyIG93bi5cbiAgICAvLyBJLmUuIHdlIG9ubHkgYWxsb3cgcXVlcmllcyBhcyBjaGlsZHJlbiBvZiBkaXJlY3RpdmVzIG5vZGVzLlxuICAgIGNvbnN0IGNoaWxkQ291bnQgPSB0aGlzLm5vZGVzLmxlbmd0aCAtIG5vZGVJbmRleCAtIDE7XG5cbiAgICBsZXQge2ZsYWdzLCBxdWVyeU1hdGNoRXhwcnMsIHByb3ZpZGVyRXhwciwgZGVwc0V4cHJ9ID1cbiAgICAgICAgdGhpcy5fdmlzaXRQcm92aWRlck9yRGlyZWN0aXZlKHByb3ZpZGVyQXN0LCBxdWVyeU1hdGNoZXMpO1xuXG4gICAgcmVmcy5mb3JFYWNoKChyZWYpID0+IHtcbiAgICAgIGlmIChyZWYudmFsdWUgJiYgdG9rZW5SZWZlcmVuY2UocmVmLnZhbHVlKSA9PT0gdG9rZW5SZWZlcmVuY2UocHJvdmlkZXJBc3QudG9rZW4pKSB7XG4gICAgICAgIHRoaXMucmVmTm9kZUluZGljZXNbcmVmLm5hbWVdID0gbm9kZUluZGV4O1xuICAgICAgICBxdWVyeU1hdGNoRXhwcnMucHVzaChcbiAgICAgICAgICAgIG8ubGl0ZXJhbEFycihbby5saXRlcmFsKHJlZi5uYW1lKSwgby5saXRlcmFsKFF1ZXJ5VmFsdWVUeXBlLlByb3ZpZGVyKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkaXJBc3QuZGlyZWN0aXZlLmlzQ29tcG9uZW50KSB7XG4gICAgICBmbGFncyB8PSBOb2RlRmxhZ3MuQ29tcG9uZW50O1xuICAgIH1cblxuICAgIGNvbnN0IGlucHV0RGVmcyA9IGRpckFzdC5pbnB1dHMubWFwKChpbnB1dEFzdCwgaW5wdXRJbmRleCkgPT4ge1xuICAgICAgY29uc3QgbWFwVmFsdWUgPSBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChpbnB1dEluZGV4KSwgby5saXRlcmFsKGlucHV0QXN0LmRpcmVjdGl2ZU5hbWUpXSk7XG4gICAgICAvLyBOb3RlOiBpdCdzIGltcG9ydGFudCB0byBub3QgcXVvdGUgdGhlIGtleSBzbyB0aGF0IHdlIGNhbiBjYXB0dXJlIHJlbmFtZXMgYnkgbWluaWZpZXJzIVxuICAgICAgcmV0dXJuIG5ldyBvLkxpdGVyYWxNYXBFbnRyeShpbnB1dEFzdC5kaXJlY3RpdmVOYW1lLCBtYXBWYWx1ZSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgb3V0cHV0RGVmczogby5MaXRlcmFsTWFwRW50cnlbXSA9IFtdO1xuICAgIGNvbnN0IGRpck1ldGEgPSBkaXJBc3QuZGlyZWN0aXZlO1xuICAgIE9iamVjdC5rZXlzKGRpck1ldGEub3V0cHV0cykuZm9yRWFjaCgocHJvcE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGRpck1ldGEub3V0cHV0c1twcm9wTmFtZV07XG4gICAgICBpZiAodXNlZEV2ZW50cy5oYXMoZXZlbnROYW1lKSkge1xuICAgICAgICAvLyBOb3RlOiBpdCdzIGltcG9ydGFudCB0byBub3QgcXVvdGUgdGhlIGtleSBzbyB0aGF0IHdlIGNhbiBjYXB0dXJlIHJlbmFtZXMgYnkgbWluaWZpZXJzIVxuICAgICAgICBvdXRwdXREZWZzLnB1c2gobmV3IG8uTGl0ZXJhbE1hcEVudHJ5KHByb3BOYW1lLCBvLmxpdGVyYWwoZXZlbnROYW1lKSwgZmFsc2UpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgdXBkYXRlRGlyZWN0aXZlRXhwcmVzc2lvbnM6IFVwZGF0ZUV4cHJlc3Npb25bXSA9IFtdO1xuICAgIGlmIChkaXJBc3QuaW5wdXRzLmxlbmd0aCB8fCAoZmxhZ3MgJiAoTm9kZUZsYWdzLkRvQ2hlY2sgfCBOb2RlRmxhZ3MuT25Jbml0KSkgPiAwKSB7XG4gICAgICB1cGRhdGVEaXJlY3RpdmVFeHByZXNzaW9ucyA9XG4gICAgICAgICAgZGlyQXN0LmlucHV0cy5tYXAoKGlucHV0LCBiaW5kaW5nSW5kZXgpID0+IHRoaXMuX3ByZXByb2Nlc3NVcGRhdGVFeHByZXNzaW9uKHtcbiAgICAgICAgICAgIG5vZGVJbmRleCxcbiAgICAgICAgICAgIGJpbmRpbmdJbmRleCxcbiAgICAgICAgICAgIHNvdXJjZVNwYW46IGlucHV0LnNvdXJjZVNwYW4sXG4gICAgICAgICAgICBjb250ZXh0OiBDT01QX1ZBUixcbiAgICAgICAgICAgIHZhbHVlOiBpbnB1dC52YWx1ZVxuICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaXJDb250ZXh0RXhwciA9XG4gICAgICAgIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5ub2RlVmFsdWUpLmNhbGxGbihbVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpXSk7XG4gICAgY29uc3QgaG9zdEJpbmRpbmdzID0gZGlyQXN0Lmhvc3RQcm9wZXJ0aWVzLm1hcCgoaW5wdXRBc3QpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IGRpckNvbnRleHRFeHByLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJBc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0QXN0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgIGNvbnN0IGhvc3RFdmVudHMgPSBkaXJBc3QuaG9zdEV2ZW50cy5tYXAoKGhvc3RFdmVudEFzdCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dDogZGlyQ29udGV4dEV4cHIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50QXN0OiBob3N0RXZlbnRBc3QsIGRpckFzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgIC8vIENoZWNrIGluZGV4IGlzIHRoZSBzYW1lIGFzIHRoZSBub2RlIGluZGV4IGR1cmluZyBjb21waWxhdGlvblxuICAgIC8vIFRoZXkgbWlnaHQgb25seSBkaWZmZXIgYXQgcnVudGltZVxuICAgIGNvbnN0IGNoZWNrSW5kZXggPSBub2RlSW5kZXg7XG5cbiAgICB0aGlzLm5vZGVzW25vZGVJbmRleF0gPSAoKSA9PiAoe1xuICAgICAgc291cmNlU3BhbjogZGlyQXN0LnNvdXJjZVNwYW4sXG4gICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlRGlyZWN0aXZlIHwgZmxhZ3MsXG4gICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuZGlyZWN0aXZlRGVmKS5jYWxsRm4oW1xuICAgICAgICBvLmxpdGVyYWwoY2hlY2tJbmRleCksXG4gICAgICAgIG8ubGl0ZXJhbChmbGFncyksXG4gICAgICAgIHF1ZXJ5TWF0Y2hFeHBycy5sZW5ndGggPyBvLmxpdGVyYWxBcnIocXVlcnlNYXRjaEV4cHJzKSA6IG8uTlVMTF9FWFBSLFxuICAgICAgICBvLmxpdGVyYWwoY2hpbGRDb3VudCksXG4gICAgICAgIHByb3ZpZGVyRXhwcixcbiAgICAgICAgZGVwc0V4cHIsXG4gICAgICAgIGlucHV0RGVmcy5sZW5ndGggPyBuZXcgby5MaXRlcmFsTWFwRXhwcihpbnB1dERlZnMpIDogby5OVUxMX0VYUFIsXG4gICAgICAgIG91dHB1dERlZnMubGVuZ3RoID8gbmV3IG8uTGl0ZXJhbE1hcEV4cHIob3V0cHV0RGVmcykgOiBvLk5VTExfRVhQUixcbiAgICAgIF0pLFxuICAgICAgdXBkYXRlRGlyZWN0aXZlczogdXBkYXRlRGlyZWN0aXZlRXhwcmVzc2lvbnMsXG4gICAgICBkaXJlY3RpdmU6IGRpckFzdC5kaXJlY3RpdmUudHlwZSxcbiAgICB9KTtcblxuICAgIHJldHVybiB7aG9zdEJpbmRpbmdzLCBob3N0RXZlbnRzfTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0UHJvdmlkZXIocHJvdmlkZXJBc3Q6IFByb3ZpZGVyQXN0LCBxdWVyeU1hdGNoZXM6IFF1ZXJ5TWF0Y2hbXSk6IHZvaWQge1xuICAgIHRoaXMuX2FkZFByb3ZpZGVyTm9kZSh0aGlzLl92aXNpdFByb3ZpZGVyT3JEaXJlY3RpdmUocHJvdmlkZXJBc3QsIHF1ZXJ5TWF0Y2hlcykpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJQcm92aWRlcihkaXJlY3RpdmVzOiBEaXJlY3RpdmVBc3RbXSkge1xuICAgIGNvbnN0IGNvbXBvbmVudERpck1ldGEgPSBkaXJlY3RpdmVzLmZpbmQoZGlyQXN0ID0+IGRpckFzdC5kaXJlY3RpdmUuaXNDb21wb25lbnQpO1xuICAgIGlmIChjb21wb25lbnREaXJNZXRhICYmIGNvbXBvbmVudERpck1ldGEuZGlyZWN0aXZlLmVudHJ5Q29tcG9uZW50cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHtwcm92aWRlckV4cHIsIGRlcHNFeHByLCBmbGFncywgdG9rZW5FeHByfSA9IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlclByb3ZpZGVyRGVmKFxuICAgICAgICAgIHRoaXMucmVmbGVjdG9yLCB0aGlzLm91dHB1dEN0eCwgTm9kZUZsYWdzLlByaXZhdGVQcm92aWRlcixcbiAgICAgICAgICBjb21wb25lbnREaXJNZXRhLmRpcmVjdGl2ZS5lbnRyeUNvbXBvbmVudHMpO1xuICAgICAgdGhpcy5fYWRkUHJvdmlkZXJOb2RlKHtcbiAgICAgICAgcHJvdmlkZXJFeHByLFxuICAgICAgICBkZXBzRXhwcixcbiAgICAgICAgZmxhZ3MsXG4gICAgICAgIHRva2VuRXhwcixcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzOiBbXSxcbiAgICAgICAgc291cmNlU3BhbjogY29tcG9uZW50RGlyTWV0YS5zb3VyY2VTcGFuXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hZGRQcm92aWRlck5vZGUoZGF0YToge1xuICAgIGZsYWdzOiBOb2RlRmxhZ3MsXG4gICAgcXVlcnlNYXRjaEV4cHJzOiBvLkV4cHJlc3Npb25bXSxcbiAgICBwcm92aWRlckV4cHI6IG8uRXhwcmVzc2lvbixcbiAgICBkZXBzRXhwcjogby5FeHByZXNzaW9uLFxuICAgIHRva2VuRXhwcjogby5FeHByZXNzaW9uLFxuICAgIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhblxuICB9KSB7XG4gICAgY29uc3Qgbm9kZUluZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG4gICAgLy8gcHJvdmlkZXJEZWYoXG4gICAgLy8gICBmbGFnczogTm9kZUZsYWdzLCBtYXRjaGVkUXVlcmllczogW3N0cmluZywgUXVlcnlWYWx1ZVR5cGVdW10sIHRva2VuOmFueSxcbiAgICAvLyAgIHZhbHVlOiBhbnksIGRlcHM6IChbRGVwRmxhZ3MsIGFueV0gfCBhbnkpW10pOiBOb2RlRGVmO1xuICAgIHRoaXMubm9kZXMucHVzaChcbiAgICAgICAgKCkgPT4gKHtcbiAgICAgICAgICBzb3VyY2VTcGFuOiBkYXRhLnNvdXJjZVNwYW4sXG4gICAgICAgICAgbm9kZUZsYWdzOiBkYXRhLmZsYWdzLFxuICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5wcm92aWRlckRlZikuY2FsbEZuKFtcbiAgICAgICAgICAgIG8ubGl0ZXJhbChkYXRhLmZsYWdzKSxcbiAgICAgICAgICAgIGRhdGEucXVlcnlNYXRjaEV4cHJzLmxlbmd0aCA/IG8ubGl0ZXJhbEFycihkYXRhLnF1ZXJ5TWF0Y2hFeHBycykgOiBvLk5VTExfRVhQUixcbiAgICAgICAgICAgIGRhdGEudG9rZW5FeHByLCBkYXRhLnByb3ZpZGVyRXhwciwgZGF0YS5kZXBzRXhwclxuICAgICAgICAgIF0pXG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0UHJvdmlkZXJPckRpcmVjdGl2ZShwcm92aWRlckFzdDogUHJvdmlkZXJBc3QsIHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdKToge1xuICAgIGZsYWdzOiBOb2RlRmxhZ3MsXG4gICAgdG9rZW5FeHByOiBvLkV4cHJlc3Npb24sXG4gICAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHF1ZXJ5TWF0Y2hFeHByczogby5FeHByZXNzaW9uW10sXG4gICAgcHJvdmlkZXJFeHByOiBvLkV4cHJlc3Npb24sXG4gICAgZGVwc0V4cHI6IG8uRXhwcmVzc2lvblxuICB9IHtcbiAgICBsZXQgZmxhZ3MgPSBOb2RlRmxhZ3MuTm9uZTtcbiAgICBsZXQgcXVlcnlNYXRjaEV4cHJzOiBvLkV4cHJlc3Npb25bXSA9IFtdO1xuXG4gICAgcXVlcnlNYXRjaGVzLmZvckVhY2goKG1hdGNoKSA9PiB7XG4gICAgICBpZiAodG9rZW5SZWZlcmVuY2UobWF0Y2gudmFsdWUpID09PSB0b2tlblJlZmVyZW5jZShwcm92aWRlckFzdC50b2tlbikpIHtcbiAgICAgICAgcXVlcnlNYXRjaEV4cHJzLnB1c2goXG4gICAgICAgICAgICBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChtYXRjaC5xdWVyeUlkKSwgby5saXRlcmFsKFF1ZXJ5VmFsdWVUeXBlLlByb3ZpZGVyKV0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCB7cHJvdmlkZXJFeHByLCBkZXBzRXhwciwgZmxhZ3M6IHByb3ZpZGVyRmxhZ3MsIHRva2VuRXhwcn0gPVxuICAgICAgICBwcm92aWRlckRlZih0aGlzLm91dHB1dEN0eCwgcHJvdmlkZXJBc3QpO1xuICAgIHJldHVybiB7XG4gICAgICBmbGFnczogZmxhZ3MgfCBwcm92aWRlckZsYWdzLFxuICAgICAgcXVlcnlNYXRjaEV4cHJzLFxuICAgICAgcHJvdmlkZXJFeHByLFxuICAgICAgZGVwc0V4cHIsXG4gICAgICB0b2tlbkV4cHIsXG4gICAgICBzb3VyY2VTcGFuOiBwcm92aWRlckFzdC5zb3VyY2VTcGFuXG4gICAgfTtcbiAgfVxuXG4gIGdldExvY2FsKG5hbWU6IHN0cmluZyk6IG8uRXhwcmVzc2lvbnxudWxsIHtcbiAgICBpZiAobmFtZSA9PSBFdmVudEhhbmRsZXJWYXJzLmV2ZW50Lm5hbWUpIHtcbiAgICAgIHJldHVybiBFdmVudEhhbmRsZXJWYXJzLmV2ZW50O1xuICAgIH1cbiAgICBsZXQgY3VyclZpZXdFeHByOiBvLkV4cHJlc3Npb24gPSBWSUVXX1ZBUjtcbiAgICBmb3IgKGxldCBjdXJyQnVpbGRlcjogVmlld0J1aWxkZXJ8bnVsbCA9IHRoaXM7IGN1cnJCdWlsZGVyOyBjdXJyQnVpbGRlciA9IGN1cnJCdWlsZGVyLnBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyclZpZXdFeHByID0gY3VyclZpZXdFeHByLnByb3AoJ3BhcmVudCcpLmNhc3Qoby5EWU5BTUlDX1RZUEUpKSB7XG4gICAgICAvLyBjaGVjayByZWZlcmVuY2VzXG4gICAgICBjb25zdCByZWZOb2RlSW5kZXggPSBjdXJyQnVpbGRlci5yZWZOb2RlSW5kaWNlc1tuYW1lXTtcbiAgICAgIGlmIChyZWZOb2RlSW5kZXggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5vZGVWYWx1ZSkuY2FsbEZuKFtjdXJyVmlld0V4cHIsIG8ubGl0ZXJhbChyZWZOb2RlSW5kZXgpXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHZhcmlhYmxlc1xuICAgICAgY29uc3QgdmFyQXN0ID0gY3VyckJ1aWxkZXIudmFyaWFibGVzLmZpbmQoKHZhckFzdCkgPT4gdmFyQXN0Lm5hbWUgPT09IG5hbWUpO1xuICAgICAgaWYgKHZhckFzdCkge1xuICAgICAgICBjb25zdCB2YXJWYWx1ZSA9IHZhckFzdC52YWx1ZSB8fCBJTVBMSUNJVF9URU1QTEFURV9WQVI7XG4gICAgICAgIHJldHVybiBjdXJyVmlld0V4cHIucHJvcCgnY29udGV4dCcpLnByb3AodmFyVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUxpdGVyYWxBcnJheUNvbnZlcnRlcihzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIGFyZ0NvdW50OiBudW1iZXIpOlxuICAgICAgQnVpbHRpbkNvbnZlcnRlciB7XG4gICAgaWYgKGFyZ0NvdW50ID09PSAwKSB7XG4gICAgICBjb25zdCB2YWx1ZUV4cHIgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuRU1QVFlfQVJSQVkpO1xuICAgICAgcmV0dXJuICgpID0+IHZhbHVlRXhwcjtcbiAgICB9XG5cbiAgICBjb25zdCBjaGVja0luZGV4ID0gdGhpcy5ub2Rlcy5sZW5ndGg7XG5cbiAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQdXJlQXJyYXksXG4gICAgICAgICAgICAgICAgICAgICAgbm9kZURlZjogby5pbXBvcnRFeHByKElkZW50aWZpZXJzLnB1cmVBcnJheURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChhcmdDb3VudCksXG4gICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgcmV0dXJuIChhcmdzOiBvLkV4cHJlc3Npb25bXSkgPT4gY2FsbENoZWNrU3RtdChjaGVja0luZGV4LCBhcmdzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUxpdGVyYWxNYXBDb252ZXJ0ZXIoXG4gICAgICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sIGtleXM6IHtrZXk6IHN0cmluZywgcXVvdGVkOiBib29sZWFufVtdKTogQnVpbHRpbkNvbnZlcnRlciB7XG4gICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCB2YWx1ZUV4cHIgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuRU1QVFlfTUFQKTtcbiAgICAgIHJldHVybiAoKSA9PiB2YWx1ZUV4cHI7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwID0gby5saXRlcmFsTWFwKGtleXMubWFwKChlLCBpKSA9PiAoey4uLmUsIHZhbHVlOiBvLmxpdGVyYWwoaSl9KSkpO1xuICAgIGNvbnN0IGNoZWNrSW5kZXggPSB0aGlzLm5vZGVzLmxlbmd0aDtcbiAgICB0aGlzLm5vZGVzLnB1c2goKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuLFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVGbGFnczogTm9kZUZsYWdzLlR5cGVQdXJlT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICAgIG5vZGVEZWY6IG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5wdXJlT2JqZWN0RGVmKS5jYWxsRm4oW1xuICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGNoZWNrSW5kZXgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLFxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgIHJldHVybiAoYXJnczogby5FeHByZXNzaW9uW10pID0+IGNhbGxDaGVja1N0bXQoY2hlY2tJbmRleCwgYXJncyk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQaXBlQ29udmVydGVyKGV4cHJlc3Npb246IFVwZGF0ZUV4cHJlc3Npb24sIG5hbWU6IHN0cmluZywgYXJnQ291bnQ6IG51bWJlcik6XG4gICAgICBCdWlsdGluQ29udmVydGVyIHtcbiAgICBjb25zdCBwaXBlID0gdGhpcy51c2VkUGlwZXMuZmluZCgocGlwZVN1bW1hcnkpID0+IHBpcGVTdW1tYXJ5Lm5hbWUgPT09IG5hbWUpICE7XG4gICAgaWYgKHBpcGUucHVyZSkge1xuICAgICAgY29uc3QgY2hlY2tJbmRleCA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgICAgdGhpcy5ub2Rlcy5wdXNoKCgpID0+ICh7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VTcGFuOiBleHByZXNzaW9uLnNvdXJjZVNwYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlUHVyZVBpcGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMucHVyZVBpcGVEZWYpLmNhbGxGbihbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG8ubGl0ZXJhbChjaGVja0luZGV4KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgby5saXRlcmFsKGFyZ0NvdW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgICAgfSkpO1xuXG4gICAgICAvLyBmaW5kIHVuZGVybHlpbmcgcGlwZSBpbiB0aGUgY29tcG9uZW50IHZpZXdcbiAgICAgIGxldCBjb21wVmlld0V4cHI6IG8uRXhwcmVzc2lvbiA9IFZJRVdfVkFSO1xuICAgICAgbGV0IGNvbXBCdWlsZGVyOiBWaWV3QnVpbGRlciA9IHRoaXM7XG4gICAgICB3aGlsZSAoY29tcEJ1aWxkZXIucGFyZW50KSB7XG4gICAgICAgIGNvbXBCdWlsZGVyID0gY29tcEJ1aWxkZXIucGFyZW50O1xuICAgICAgICBjb21wVmlld0V4cHIgPSBjb21wVmlld0V4cHIucHJvcCgncGFyZW50JykuY2FzdChvLkRZTkFNSUNfVFlQRSk7XG4gICAgICB9XG4gICAgICBjb25zdCBwaXBlTm9kZUluZGV4ID0gY29tcEJ1aWxkZXIucHVyZVBpcGVOb2RlSW5kaWNlc1tuYW1lXTtcbiAgICAgIGNvbnN0IHBpcGVWYWx1ZUV4cHI6IG8uRXhwcmVzc2lvbiA9XG4gICAgICAgICAgby5pbXBvcnRFeHByKElkZW50aWZpZXJzLm5vZGVWYWx1ZSkuY2FsbEZuKFtjb21wVmlld0V4cHIsIG8ubGl0ZXJhbChwaXBlTm9kZUluZGV4KV0pO1xuXG4gICAgICByZXR1cm4gKGFyZ3M6IG8uRXhwcmVzc2lvbltdKSA9PiBjYWxsVW53cmFwVmFsdWUoXG4gICAgICAgICAgICAgICAgIGV4cHJlc3Npb24ubm9kZUluZGV4LCBleHByZXNzaW9uLmJpbmRpbmdJbmRleCxcbiAgICAgICAgICAgICAgICAgY2FsbENoZWNrU3RtdChjaGVja0luZGV4LCBbcGlwZVZhbHVlRXhwcl0uY29uY2F0KGFyZ3MpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMuX2NyZWF0ZVBpcGUoZXhwcmVzc2lvbi5zb3VyY2VTcGFuLCBwaXBlKTtcbiAgICAgIGNvbnN0IG5vZGVWYWx1ZUV4cHIgPVxuICAgICAgICAgIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5ub2RlVmFsdWUpLmNhbGxGbihbVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpXSk7XG5cbiAgICAgIHJldHVybiAoYXJnczogby5FeHByZXNzaW9uW10pID0+IGNhbGxVbndyYXBWYWx1ZShcbiAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbi5ub2RlSW5kZXgsIGV4cHJlc3Npb24uYmluZGluZ0luZGV4LFxuICAgICAgICAgICAgICAgICBub2RlVmFsdWVFeHByLmNhbGxNZXRob2QoJ3RyYW5zZm9ybScsIGFyZ3MpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVQaXBlKHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbnxudWxsLCBwaXBlOiBDb21waWxlUGlwZVN1bW1hcnkpOiBudW1iZXIge1xuICAgIGNvbnN0IG5vZGVJbmRleCA9IHRoaXMubm9kZXMubGVuZ3RoO1xuICAgIGxldCBmbGFncyA9IE5vZGVGbGFncy5Ob25lO1xuICAgIHBpcGUudHlwZS5saWZlY3ljbGVIb29rcy5mb3JFYWNoKChsaWZlY3ljbGVIb29rKSA9PiB7XG4gICAgICAvLyBmb3IgcGlwZXMsIHdlIG9ubHkgc3VwcG9ydCBuZ09uRGVzdHJveVxuICAgICAgaWYgKGxpZmVjeWNsZUhvb2sgPT09IExpZmVjeWNsZUhvb2tzLk9uRGVzdHJveSkge1xuICAgICAgICBmbGFncyB8PSBsaWZlY3ljbGVIb29rVG9Ob2RlRmxhZyhsaWZlY3ljbGVIb29rKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGRlcEV4cHJzID0gcGlwZS50eXBlLmRpRGVwcy5tYXAoKGRpRGVwKSA9PiBkZXBEZWYodGhpcy5vdXRwdXRDdHgsIGRpRGVwKSk7XG4gICAgLy8gZnVuY3Rpb24gcGlwZURlZihcbiAgICAvLyAgIGZsYWdzOiBOb2RlRmxhZ3MsIGN0b3I6IGFueSwgZGVwczogKFtEZXBGbGFncywgYW55XSB8IGFueSlbXSk6IE5vZGVEZWZcbiAgICB0aGlzLm5vZGVzLnB1c2goXG4gICAgICAgICgpID0+ICh7XG4gICAgICAgICAgc291cmNlU3BhbixcbiAgICAgICAgICBub2RlRmxhZ3M6IE5vZGVGbGFncy5UeXBlUGlwZSxcbiAgICAgICAgICBub2RlRGVmOiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMucGlwZURlZikuY2FsbEZuKFtcbiAgICAgICAgICAgIG8ubGl0ZXJhbChmbGFncyksIHRoaXMub3V0cHV0Q3R4LmltcG9ydEV4cHIocGlwZS50eXBlLnJlZmVyZW5jZSksIG8ubGl0ZXJhbEFycihkZXBFeHBycylcbiAgICAgICAgICBdKVxuICAgICAgICB9KSk7XG4gICAgcmV0dXJuIG5vZGVJbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3IgdGhlIEFTVCBpbiBgVXBkYXRlRXhwcmVzc2lvbi52YWx1ZWA6XG4gICAqIC0gY3JlYXRlIG5vZGVzIGZvciBwaXBlcywgbGl0ZXJhbCBhcnJheXMgYW5kLCBsaXRlcmFsIG1hcHMsXG4gICAqIC0gdXBkYXRlIHRoZSBBU1QgdG8gcmVwbGFjZSBwaXBlcywgbGl0ZXJhbCBhcnJheXMgYW5kLCBsaXRlcmFsIG1hcHMgd2l0aCBjYWxscyB0byBjaGVjayBmbi5cbiAgICpcbiAgICogV0FSTklORzogVGhpcyBtaWdodCBjcmVhdGUgbmV3IG5vZGVEZWZzIChmb3IgcGlwZXMgYW5kIGxpdGVyYWwgYXJyYXlzIGFuZCBsaXRlcmFsIG1hcHMpIVxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlcHJvY2Vzc1VwZGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogVXBkYXRlRXhwcmVzc2lvbik6IFVwZGF0ZUV4cHJlc3Npb24ge1xuICAgIHJldHVybiB7XG4gICAgICBub2RlSW5kZXg6IGV4cHJlc3Npb24ubm9kZUluZGV4LFxuICAgICAgYmluZGluZ0luZGV4OiBleHByZXNzaW9uLmJpbmRpbmdJbmRleCxcbiAgICAgIHNvdXJjZVNwYW46IGV4cHJlc3Npb24uc291cmNlU3BhbixcbiAgICAgIGNvbnRleHQ6IGV4cHJlc3Npb24uY29udGV4dCxcbiAgICAgIHZhbHVlOiBjb252ZXJ0UHJvcGVydHlCaW5kaW5nQnVpbHRpbnMoXG4gICAgICAgICAge1xuICAgICAgICAgICAgY3JlYXRlTGl0ZXJhbEFycmF5Q29udmVydGVyOiAoYXJnQ291bnQ6IG51bWJlcikgPT4gdGhpcy5fY3JlYXRlTGl0ZXJhbEFycmF5Q29udmVydGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbi5zb3VyY2VTcGFuLCBhcmdDb3VudCksXG4gICAgICAgICAgICBjcmVhdGVMaXRlcmFsTWFwQ29udmVydGVyOlxuICAgICAgICAgICAgICAgIChrZXlzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbn1bXSkgPT5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3JlYXRlTGl0ZXJhbE1hcENvbnZlcnRlcihleHByZXNzaW9uLnNvdXJjZVNwYW4sIGtleXMpLFxuICAgICAgICAgICAgY3JlYXRlUGlwZUNvbnZlcnRlcjogKG5hbWU6IHN0cmluZywgYXJnQ291bnQ6IG51bWJlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVQaXBlQ29udmVydGVyKGV4cHJlc3Npb24sIG5hbWUsIGFyZ0NvdW50KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwcmVzc2lvbi52YWx1ZSlcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlTm9kZUV4cHJlc3Npb25zKCk6IHtcbiAgICB1cGRhdGVSZW5kZXJlclN0bXRzOiBvLlN0YXRlbWVudFtdLFxuICAgIHVwZGF0ZURpcmVjdGl2ZXNTdG10czogby5TdGF0ZW1lbnRbXSxcbiAgICBub2RlRGVmRXhwcnM6IG8uRXhwcmVzc2lvbltdXG4gIH0ge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxldCB1cGRhdGVCaW5kaW5nQ291bnQgPSAwO1xuICAgIGNvbnN0IHVwZGF0ZVJlbmRlcmVyU3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICBjb25zdCB1cGRhdGVEaXJlY3RpdmVzU3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICBjb25zdCBub2RlRGVmRXhwcnMgPSB0aGlzLm5vZGVzLm1hcCgoZmFjdG9yeSwgbm9kZUluZGV4KSA9PiB7XG4gICAgICBjb25zdCB7bm9kZURlZiwgbm9kZUZsYWdzLCB1cGRhdGVEaXJlY3RpdmVzLCB1cGRhdGVSZW5kZXJlciwgc291cmNlU3Bhbn0gPSBmYWN0b3J5KCk7XG4gICAgICBpZiAodXBkYXRlUmVuZGVyZXIpIHtcbiAgICAgICAgdXBkYXRlUmVuZGVyZXJTdG10cy5wdXNoKFxuICAgICAgICAgICAgLi4uY3JlYXRlVXBkYXRlU3RhdGVtZW50cyhub2RlSW5kZXgsIHNvdXJjZVNwYW4sIHVwZGF0ZVJlbmRlcmVyLCBmYWxzZSkpO1xuICAgICAgfVxuICAgICAgaWYgKHVwZGF0ZURpcmVjdGl2ZXMpIHtcbiAgICAgICAgdXBkYXRlRGlyZWN0aXZlc1N0bXRzLnB1c2goLi4uY3JlYXRlVXBkYXRlU3RhdGVtZW50cyhcbiAgICAgICAgICAgIG5vZGVJbmRleCwgc291cmNlU3BhbiwgdXBkYXRlRGlyZWN0aXZlcyxcbiAgICAgICAgICAgIChub2RlRmxhZ3MgJiAoTm9kZUZsYWdzLkRvQ2hlY2sgfCBOb2RlRmxhZ3MuT25Jbml0KSkgPiAwKSk7XG4gICAgICB9XG4gICAgICAvLyBXZSB1c2UgYSBjb21tYSBleHByZXNzaW9uIHRvIGNhbGwgdGhlIGxvZyBmdW5jdGlvbiBiZWZvcmVcbiAgICAgIC8vIHRoZSBub2RlRGVmIGZ1bmN0aW9uLCBidXQgc3RpbGwgdXNlIHRoZSByZXN1bHQgb2YgdGhlIG5vZGVEZWYgZnVuY3Rpb25cbiAgICAgIC8vIGFzIHRoZSB2YWx1ZS5cbiAgICAgIC8vIE5vdGU6IFdlIG9ubHkgYWRkIHRoZSBsb2dnZXIgdG8gZWxlbWVudHMgLyB0ZXh0IG5vZGVzLFxuICAgICAgLy8gc28gd2UgZG9uJ3QgZ2VuZXJhdGUgdG9vIG11Y2ggY29kZS5cbiAgICAgIGNvbnN0IGxvZ1dpdGhOb2RlRGVmID0gbm9kZUZsYWdzICYgTm9kZUZsYWdzLkNhdFJlbmRlck5vZGUgP1xuICAgICAgICAgIG5ldyBvLkNvbW1hRXhwcihbTE9HX1ZBUi5jYWxsRm4oW10pLmNhbGxGbihbXSksIG5vZGVEZWZdKSA6XG4gICAgICAgICAgbm9kZURlZjtcbiAgICAgIHJldHVybiBvLmFwcGx5U291cmNlU3BhblRvRXhwcmVzc2lvbklmTmVlZGVkKGxvZ1dpdGhOb2RlRGVmLCBzb3VyY2VTcGFuKTtcbiAgICB9KTtcbiAgICByZXR1cm4ge3VwZGF0ZVJlbmRlcmVyU3RtdHMsIHVwZGF0ZURpcmVjdGl2ZXNTdG10cywgbm9kZURlZkV4cHJzfTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZVVwZGF0ZVN0YXRlbWVudHMoXG4gICAgICAgIG5vZGVJbmRleDogbnVtYmVyLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4gfCBudWxsLCBleHByZXNzaW9uczogVXBkYXRlRXhwcmVzc2lvbltdLFxuICAgICAgICBhbGxvd0VtcHR5RXhwcnM6IGJvb2xlYW4pOiBvLlN0YXRlbWVudFtdIHtcbiAgICAgIGNvbnN0IHVwZGF0ZVN0bXRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gICAgICBjb25zdCBleHBycyA9IGV4cHJlc3Npb25zLm1hcCgoe3NvdXJjZVNwYW4sIGNvbnRleHQsIHZhbHVlfSkgPT4ge1xuICAgICAgICBjb25zdCBiaW5kaW5nSWQgPSBgJHt1cGRhdGVCaW5kaW5nQ291bnQrK31gO1xuICAgICAgICBjb25zdCBuYW1lUmVzb2x2ZXIgPSBjb250ZXh0ID09PSBDT01QX1ZBUiA/IHNlbGYgOiBudWxsO1xuICAgICAgICBjb25zdCB7c3RtdHMsIGN1cnJWYWxFeHByfSA9XG4gICAgICAgICAgICBjb252ZXJ0UHJvcGVydHlCaW5kaW5nKG5hbWVSZXNvbHZlciwgY29udGV4dCwgdmFsdWUsIGJpbmRpbmdJZCwgQmluZGluZ0Zvcm0uR2VuZXJhbCk7XG4gICAgICAgIHVwZGF0ZVN0bXRzLnB1c2goLi4uc3RtdHMubWFwKFxuICAgICAgICAgICAgKHN0bXQ6IG8uU3RhdGVtZW50KSA9PiBvLmFwcGx5U291cmNlU3BhblRvU3RhdGVtZW50SWZOZWVkZWQoc3RtdCwgc291cmNlU3BhbikpKTtcbiAgICAgICAgcmV0dXJuIG8uYXBwbHlTb3VyY2VTcGFuVG9FeHByZXNzaW9uSWZOZWVkZWQoY3VyclZhbEV4cHIsIHNvdXJjZVNwYW4pO1xuICAgICAgfSk7XG4gICAgICBpZiAoZXhwcmVzc2lvbnMubGVuZ3RoIHx8IGFsbG93RW1wdHlFeHBycykge1xuICAgICAgICB1cGRhdGVTdG10cy5wdXNoKG8uYXBwbHlTb3VyY2VTcGFuVG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgICAgIGNhbGxDaGVja1N0bXQobm9kZUluZGV4LCBleHBycykudG9TdG10KCksIHNvdXJjZVNwYW4pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cGRhdGVTdG10cztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVFbGVtZW50SGFuZGxlRXZlbnRGbihcbiAgICAgIG5vZGVJbmRleDogbnVtYmVyLFxuICAgICAgaGFuZGxlcnM6IHtjb250ZXh0OiBvLkV4cHJlc3Npb24sIGV2ZW50QXN0OiBCb3VuZEV2ZW50QXN0LCBkaXJBc3Q6IERpcmVjdGl2ZUFzdH1bXSkge1xuICAgIGNvbnN0IGhhbmRsZUV2ZW50U3RtdHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgICBsZXQgaGFuZGxlRXZlbnRCaW5kaW5nQ291bnQgPSAwO1xuICAgIGhhbmRsZXJzLmZvckVhY2goKHtjb250ZXh0LCBldmVudEFzdCwgZGlyQXN0fSkgPT4ge1xuICAgICAgY29uc3QgYmluZGluZ0lkID0gYCR7aGFuZGxlRXZlbnRCaW5kaW5nQ291bnQrK31gO1xuICAgICAgY29uc3QgbmFtZVJlc29sdmVyID0gY29udGV4dCA9PT0gQ09NUF9WQVIgPyB0aGlzIDogbnVsbDtcbiAgICAgIGNvbnN0IHtzdG10cywgYWxsb3dEZWZhdWx0fSA9XG4gICAgICAgICAgY29udmVydEFjdGlvbkJpbmRpbmcobmFtZVJlc29sdmVyLCBjb250ZXh0LCBldmVudEFzdC5oYW5kbGVyLCBiaW5kaW5nSWQpO1xuICAgICAgY29uc3QgdHJ1ZVN0bXRzID0gc3RtdHM7XG4gICAgICBpZiAoYWxsb3dEZWZhdWx0KSB7XG4gICAgICAgIHRydWVTdG10cy5wdXNoKEFMTE9XX0RFRkFVTFRfVkFSLnNldChhbGxvd0RlZmF1bHQuYW5kKEFMTE9XX0RFRkFVTFRfVkFSKSkudG9TdG10KCkpO1xuICAgICAgfVxuICAgICAgY29uc3Qge3RhcmdldDogZXZlbnRUYXJnZXQsIG5hbWU6IGV2ZW50TmFtZX0gPSBlbGVtZW50RXZlbnROYW1lQW5kVGFyZ2V0KGV2ZW50QXN0LCBkaXJBc3QpO1xuICAgICAgY29uc3QgZnVsbEV2ZW50TmFtZSA9IGVsZW1lbnRFdmVudEZ1bGxOYW1lKGV2ZW50VGFyZ2V0LCBldmVudE5hbWUpO1xuICAgICAgaGFuZGxlRXZlbnRTdG10cy5wdXNoKG8uYXBwbHlTb3VyY2VTcGFuVG9TdGF0ZW1lbnRJZk5lZWRlZChcbiAgICAgICAgICBuZXcgby5JZlN0bXQoby5saXRlcmFsKGZ1bGxFdmVudE5hbWUpLmlkZW50aWNhbChFVkVOVF9OQU1FX1ZBUiksIHRydWVTdG10cyksXG4gICAgICAgICAgZXZlbnRBc3Quc291cmNlU3BhbikpO1xuICAgIH0pO1xuICAgIGxldCBoYW5kbGVFdmVudEZuOiBvLkV4cHJlc3Npb247XG4gICAgaWYgKGhhbmRsZUV2ZW50U3RtdHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgcHJlU3RtdHM6IG8uU3RhdGVtZW50W10gPVxuICAgICAgICAgIFtBTExPV19ERUZBVUxUX1ZBUi5zZXQoby5saXRlcmFsKHRydWUpKS50b0RlY2xTdG10KG8uQk9PTF9UWVBFKV07XG4gICAgICBpZiAoIXRoaXMuY29tcG9uZW50LmlzSG9zdCAmJiBvLmZpbmRSZWFkVmFyTmFtZXMoaGFuZGxlRXZlbnRTdG10cykuaGFzKENPTVBfVkFSLm5hbWUgISkpIHtcbiAgICAgICAgcHJlU3RtdHMucHVzaChDT01QX1ZBUi5zZXQoVklFV19WQVIucHJvcCgnY29tcG9uZW50JykpLnRvRGVjbFN0bXQodGhpcy5jb21wVHlwZSkpO1xuICAgICAgfVxuICAgICAgaGFuZGxlRXZlbnRGbiA9IG8uZm4oXG4gICAgICAgICAgW1xuICAgICAgICAgICAgbmV3IG8uRm5QYXJhbShWSUVXX1ZBUi5uYW1lICEsIG8uSU5GRVJSRURfVFlQRSksXG4gICAgICAgICAgICBuZXcgby5GblBhcmFtKEVWRU5UX05BTUVfVkFSLm5hbWUgISwgby5JTkZFUlJFRF9UWVBFKSxcbiAgICAgICAgICAgIG5ldyBvLkZuUGFyYW0oRXZlbnRIYW5kbGVyVmFycy5ldmVudC5uYW1lICEsIG8uSU5GRVJSRURfVFlQRSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIFsuLi5wcmVTdG10cywgLi4uaGFuZGxlRXZlbnRTdG10cywgbmV3IG8uUmV0dXJuU3RhdGVtZW50KEFMTE9XX0RFRkFVTFRfVkFSKV0sXG4gICAgICAgICAgby5JTkZFUlJFRF9UWVBFKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlRXZlbnRGbiA9IG8uTlVMTF9FWFBSO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlRXZlbnRGbjtcbiAgfVxuXG4gIHZpc2l0RGlyZWN0aXZlKGFzdDogRGlyZWN0aXZlQXN0LCBjb250ZXh0OiB7dXNlZEV2ZW50czogU2V0PHN0cmluZz59KTogYW55IHt9XG4gIHZpc2l0RGlyZWN0aXZlUHJvcGVydHkoYXN0OiBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbiAgdmlzaXRSZWZlcmVuY2UoYXN0OiBSZWZlcmVuY2VBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdEV2ZW50KGFzdDogQm91bmRFdmVudEFzdCwgY29udGV4dDogYW55KTogYW55IHt9XG4gIHZpc2l0RWxlbWVudFByb3BlcnR5KGFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuICB2aXNpdEF0dHIoYXN0OiBBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cbn1cblxuZnVuY3Rpb24gbmVlZHNBZGRpdGlvbmFsUm9vdE5vZGUoYXN0Tm9kZXM6IFRlbXBsYXRlQXN0W10pOiBib29sZWFuIHtcbiAgY29uc3QgbGFzdEFzdE5vZGUgPSBhc3ROb2Rlc1thc3ROb2Rlcy5sZW5ndGggLSAxXTtcbiAgaWYgKGxhc3RBc3ROb2RlIGluc3RhbmNlb2YgRW1iZWRkZWRUZW1wbGF0ZUFzdCkge1xuICAgIHJldHVybiBsYXN0QXN0Tm9kZS5oYXNWaWV3Q29udGFpbmVyO1xuICB9XG5cbiAgaWYgKGxhc3RBc3ROb2RlIGluc3RhbmNlb2YgRWxlbWVudEFzdCkge1xuICAgIGlmIChpc05nQ29udGFpbmVyKGxhc3RBc3ROb2RlLm5hbWUpICYmIGxhc3RBc3ROb2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5lZWRzQWRkaXRpb25hbFJvb3ROb2RlKGxhc3RBc3ROb2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgcmV0dXJuIGxhc3RBc3ROb2RlLmhhc1ZpZXdDb250YWluZXI7XG4gIH1cblxuICByZXR1cm4gbGFzdEFzdE5vZGUgaW5zdGFuY2VvZiBOZ0NvbnRlbnRBc3Q7XG59XG5cblxuZnVuY3Rpb24gZWxlbWVudEJpbmRpbmdEZWYoaW5wdXRBc3Q6IEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LCBkaXJBc3Q6IERpcmVjdGl2ZUFzdCk6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbnN0IGlucHV0VHlwZSA9IGlucHV0QXN0LnR5cGU7XG4gIHN3aXRjaCAoaW5wdXRUeXBlKSB7XG4gICAgY2FzZSBQcm9wZXJ0eUJpbmRpbmdUeXBlLkF0dHJpYnV0ZTpcbiAgICAgIHJldHVybiBvLmxpdGVyYWxBcnIoW1xuICAgICAgICBvLmxpdGVyYWwoQmluZGluZ0ZsYWdzLlR5cGVFbGVtZW50QXR0cmlidXRlKSwgby5saXRlcmFsKGlucHV0QXN0Lm5hbWUpLFxuICAgICAgICBvLmxpdGVyYWwoaW5wdXRBc3Quc2VjdXJpdHlDb250ZXh0KVxuICAgICAgXSk7XG4gICAgY2FzZSBQcm9wZXJ0eUJpbmRpbmdUeXBlLlByb3BlcnR5OlxuICAgICAgcmV0dXJuIG8ubGl0ZXJhbEFycihbXG4gICAgICAgIG8ubGl0ZXJhbChCaW5kaW5nRmxhZ3MuVHlwZVByb3BlcnR5KSwgby5saXRlcmFsKGlucHV0QXN0Lm5hbWUpLFxuICAgICAgICBvLmxpdGVyYWwoaW5wdXRBc3Quc2VjdXJpdHlDb250ZXh0KVxuICAgICAgXSk7XG4gICAgY2FzZSBQcm9wZXJ0eUJpbmRpbmdUeXBlLkFuaW1hdGlvbjpcbiAgICAgIGNvbnN0IGJpbmRpbmdUeXBlID0gQmluZGluZ0ZsYWdzLlR5cGVQcm9wZXJ0eSB8XG4gICAgICAgICAgKGRpckFzdCAmJiBkaXJBc3QuZGlyZWN0aXZlLmlzQ29tcG9uZW50ID8gQmluZGluZ0ZsYWdzLlN5bnRoZXRpY0hvc3RQcm9wZXJ0eSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmluZGluZ0ZsYWdzLlN5bnRoZXRpY1Byb3BlcnR5KTtcbiAgICAgIHJldHVybiBvLmxpdGVyYWxBcnIoW1xuICAgICAgICBvLmxpdGVyYWwoYmluZGluZ1R5cGUpLCBvLmxpdGVyYWwoJ0AnICsgaW5wdXRBc3QubmFtZSksIG8ubGl0ZXJhbChpbnB1dEFzdC5zZWN1cml0eUNvbnRleHQpXG4gICAgICBdKTtcbiAgICBjYXNlIFByb3BlcnR5QmluZGluZ1R5cGUuQ2xhc3M6XG4gICAgICByZXR1cm4gby5saXRlcmFsQXJyKFxuICAgICAgICAgIFtvLmxpdGVyYWwoQmluZGluZ0ZsYWdzLlR5cGVFbGVtZW50Q2xhc3MpLCBvLmxpdGVyYWwoaW5wdXRBc3QubmFtZSksIG8uTlVMTF9FWFBSXSk7XG4gICAgY2FzZSBQcm9wZXJ0eUJpbmRpbmdUeXBlLlN0eWxlOlxuICAgICAgcmV0dXJuIG8ubGl0ZXJhbEFycihbXG4gICAgICAgIG8ubGl0ZXJhbChCaW5kaW5nRmxhZ3MuVHlwZUVsZW1lbnRTdHlsZSksIG8ubGl0ZXJhbChpbnB1dEFzdC5uYW1lKSwgby5saXRlcmFsKGlucHV0QXN0LnVuaXQpXG4gICAgICBdKTtcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gVGhpcyBkZWZhdWx0IGNhc2UgaXMgbm90IG5lZWRlZCBieSBUeXBlU2NyaXB0IGNvbXBpbGVyLCBhcyB0aGUgc3dpdGNoIGlzIGV4aGF1c3RpdmUuXG4gICAgICAvLyBIb3dldmVyIENsb3N1cmUgQ29tcGlsZXIgZG9lcyBub3QgdW5kZXJzdGFuZCB0aGF0IGFuZCByZXBvcnRzIGFuIGVycm9yIGluIHR5cGVkIG1vZGUuXG4gICAgICAvLyBUaGUgYHRocm93IG5ldyBFcnJvcmAgYmVsb3cgd29ya3MgYXJvdW5kIHRoZSBwcm9ibGVtLCBhbmQgdGhlIHVuZXhwZWN0ZWQ6IG5ldmVyIHZhcmlhYmxlXG4gICAgICAvLyBtYWtlcyBzdXJlIHRzYyBzdGlsbCBjaGVja3MgdGhpcyBjb2RlIGlzIHVucmVhY2hhYmxlLlxuICAgICAgY29uc3QgdW5leHBlY3RlZDogbmV2ZXIgPSBpbnB1dFR5cGU7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgJHt1bmV4cGVjdGVkfWApO1xuICB9XG59XG5cblxuZnVuY3Rpb24gZml4ZWRBdHRyc0RlZihlbGVtZW50QXN0OiBFbGVtZW50QXN0KTogby5FeHByZXNzaW9uIHtcbiAgY29uc3QgbWFwUmVzdWx0OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGVsZW1lbnRBc3QuYXR0cnMuZm9yRWFjaChhdHRyQXN0ID0+IHsgbWFwUmVzdWx0W2F0dHJBc3QubmFtZV0gPSBhdHRyQXN0LnZhbHVlOyB9KTtcbiAgZWxlbWVudEFzdC5kaXJlY3RpdmVzLmZvckVhY2goZGlyQXN0ID0+IHtcbiAgICBPYmplY3Qua2V5cyhkaXJBc3QuZGlyZWN0aXZlLmhvc3RBdHRyaWJ1dGVzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBkaXJBc3QuZGlyZWN0aXZlLmhvc3RBdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgY29uc3QgcHJldlZhbHVlID0gbWFwUmVzdWx0W25hbWVdO1xuICAgICAgbWFwUmVzdWx0W25hbWVdID0gcHJldlZhbHVlICE9IG51bGwgPyBtZXJnZUF0dHJpYnV0ZVZhbHVlKG5hbWUsIHByZXZWYWx1ZSwgdmFsdWUpIDogdmFsdWU7XG4gICAgfSk7XG4gIH0pO1xuICAvLyBOb3RlOiBXZSBuZWVkIHRvIHNvcnQgdG8gZ2V0IGEgZGVmaW5lZCBvdXRwdXQgb3JkZXJcbiAgLy8gZm9yIHRlc3RzIGFuZCBmb3IgY2FjaGluZyBnZW5lcmF0ZWQgYXJ0aWZhY3RzLi4uXG4gIHJldHVybiBvLmxpdGVyYWxBcnIoT2JqZWN0LmtleXMobWFwUmVzdWx0KS5zb3J0KCkubWFwKFxuICAgICAgKGF0dHJOYW1lKSA9PiBvLmxpdGVyYWxBcnIoW28ubGl0ZXJhbChhdHRyTmFtZSksIG8ubGl0ZXJhbChtYXBSZXN1bHRbYXR0ck5hbWVdKV0pKSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlQXR0cmlidXRlVmFsdWUoYXR0ck5hbWU6IHN0cmluZywgYXR0clZhbHVlMTogc3RyaW5nLCBhdHRyVmFsdWUyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYXR0ck5hbWUgPT0gQ0xBU1NfQVRUUiB8fCBhdHRyTmFtZSA9PSBTVFlMRV9BVFRSKSB7XG4gICAgcmV0dXJuIGAke2F0dHJWYWx1ZTF9ICR7YXR0clZhbHVlMn1gO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhdHRyVmFsdWUyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGxDaGVja1N0bXQobm9kZUluZGV4OiBudW1iZXIsIGV4cHJzOiBvLkV4cHJlc3Npb25bXSk6IG8uRXhwcmVzc2lvbiB7XG4gIGlmIChleHBycy5sZW5ndGggPiAxMCkge1xuICAgIHJldHVybiBDSEVDS19WQVIuY2FsbEZuKFxuICAgICAgICBbVklFV19WQVIsIG8ubGl0ZXJhbChub2RlSW5kZXgpLCBvLmxpdGVyYWwoQXJndW1lbnRUeXBlLkR5bmFtaWMpLCBvLmxpdGVyYWxBcnIoZXhwcnMpXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIENIRUNLX1ZBUi5jYWxsRm4oXG4gICAgICAgIFtWSUVXX1ZBUiwgby5saXRlcmFsKG5vZGVJbmRleCksIG8ubGl0ZXJhbChBcmd1bWVudFR5cGUuSW5saW5lKSwgLi4uZXhwcnNdKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjYWxsVW53cmFwVmFsdWUobm9kZUluZGV4OiBudW1iZXIsIGJpbmRpbmdJZHg6IG51bWJlciwgZXhwcjogby5FeHByZXNzaW9uKTogby5FeHByZXNzaW9uIHtcbiAgcmV0dXJuIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy51bndyYXBWYWx1ZSkuY2FsbEZuKFtcbiAgICBWSUVXX1ZBUiwgby5saXRlcmFsKG5vZGVJbmRleCksIG8ubGl0ZXJhbChiaW5kaW5nSWR4KSwgZXhwclxuICBdKTtcbn1cblxuaW50ZXJmYWNlIFN0YXRpY0FuZER5bmFtaWNRdWVyeUlkcyB7XG4gIHN0YXRpY1F1ZXJ5SWRzOiBTZXQ8bnVtYmVyPjtcbiAgZHluYW1pY1F1ZXJ5SWRzOiBTZXQ8bnVtYmVyPjtcbn1cblxuXG5mdW5jdGlvbiBmaW5kU3RhdGljUXVlcnlJZHMoXG4gICAgbm9kZXM6IFRlbXBsYXRlQXN0W10sIHJlc3VsdCA9IG5ldyBNYXA8VGVtcGxhdGVBc3QsIFN0YXRpY0FuZER5bmFtaWNRdWVyeUlkcz4oKSk6XG4gICAgTWFwPFRlbXBsYXRlQXN0LCBTdGF0aWNBbmREeW5hbWljUXVlcnlJZHM+IHtcbiAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIGNvbnN0IHN0YXRpY1F1ZXJ5SWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgY29uc3QgZHluYW1pY1F1ZXJ5SWRzID0gbmV3IFNldDxudW1iZXI+KCk7XG4gICAgbGV0IHF1ZXJ5TWF0Y2hlczogUXVlcnlNYXRjaFtdID0gdW5kZWZpbmVkICE7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50QXN0KSB7XG4gICAgICBmaW5kU3RhdGljUXVlcnlJZHMobm9kZS5jaGlsZHJlbiwgcmVzdWx0KTtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGREYXRhID0gcmVzdWx0LmdldChjaGlsZCkgITtcbiAgICAgICAgY2hpbGREYXRhLnN0YXRpY1F1ZXJ5SWRzLmZvckVhY2gocXVlcnlJZCA9PiBzdGF0aWNRdWVyeUlkcy5hZGQocXVlcnlJZCkpO1xuICAgICAgICBjaGlsZERhdGEuZHluYW1pY1F1ZXJ5SWRzLmZvckVhY2gocXVlcnlJZCA9PiBkeW5hbWljUXVlcnlJZHMuYWRkKHF1ZXJ5SWQpKTtcbiAgICAgIH0pO1xuICAgICAgcXVlcnlNYXRjaGVzID0gbm9kZS5xdWVyeU1hdGNoZXM7XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRW1iZWRkZWRUZW1wbGF0ZUFzdCkge1xuICAgICAgZmluZFN0YXRpY1F1ZXJ5SWRzKG5vZGUuY2hpbGRyZW4sIHJlc3VsdCk7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkRGF0YSA9IHJlc3VsdC5nZXQoY2hpbGQpICE7XG4gICAgICAgIGNoaWxkRGF0YS5zdGF0aWNRdWVyeUlkcy5mb3JFYWNoKHF1ZXJ5SWQgPT4gZHluYW1pY1F1ZXJ5SWRzLmFkZChxdWVyeUlkKSk7XG4gICAgICAgIGNoaWxkRGF0YS5keW5hbWljUXVlcnlJZHMuZm9yRWFjaChxdWVyeUlkID0+IGR5bmFtaWNRdWVyeUlkcy5hZGQocXVlcnlJZCkpO1xuICAgICAgfSk7XG4gICAgICBxdWVyeU1hdGNoZXMgPSBub2RlLnF1ZXJ5TWF0Y2hlcztcbiAgICB9XG4gICAgaWYgKHF1ZXJ5TWF0Y2hlcykge1xuICAgICAgcXVlcnlNYXRjaGVzLmZvckVhY2goKG1hdGNoKSA9PiBzdGF0aWNRdWVyeUlkcy5hZGQobWF0Y2gucXVlcnlJZCkpO1xuICAgIH1cbiAgICBkeW5hbWljUXVlcnlJZHMuZm9yRWFjaChxdWVyeUlkID0+IHN0YXRpY1F1ZXJ5SWRzLmRlbGV0ZShxdWVyeUlkKSk7XG4gICAgcmVzdWx0LnNldChub2RlLCB7c3RhdGljUXVlcnlJZHMsIGR5bmFtaWNRdWVyeUlkc30pO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gc3RhdGljVmlld1F1ZXJ5SWRzKG5vZGVTdGF0aWNRdWVyeUlkczogTWFwPFRlbXBsYXRlQXN0LCBTdGF0aWNBbmREeW5hbWljUXVlcnlJZHM+KTpcbiAgICBTdGF0aWNBbmREeW5hbWljUXVlcnlJZHMge1xuICBjb25zdCBzdGF0aWNRdWVyeUlkcyA9IG5ldyBTZXQ8bnVtYmVyPigpO1xuICBjb25zdCBkeW5hbWljUXVlcnlJZHMgPSBuZXcgU2V0PG51bWJlcj4oKTtcbiAgQXJyYXkuZnJvbShub2RlU3RhdGljUXVlcnlJZHMudmFsdWVzKCkpLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgZW50cnkuc3RhdGljUXVlcnlJZHMuZm9yRWFjaChxdWVyeUlkID0+IHN0YXRpY1F1ZXJ5SWRzLmFkZChxdWVyeUlkKSk7XG4gICAgZW50cnkuZHluYW1pY1F1ZXJ5SWRzLmZvckVhY2gocXVlcnlJZCA9PiBkeW5hbWljUXVlcnlJZHMuYWRkKHF1ZXJ5SWQpKTtcbiAgfSk7XG4gIGR5bmFtaWNRdWVyeUlkcy5mb3JFYWNoKHF1ZXJ5SWQgPT4gc3RhdGljUXVlcnlJZHMuZGVsZXRlKHF1ZXJ5SWQpKTtcbiAgcmV0dXJuIHtzdGF0aWNRdWVyeUlkcywgZHluYW1pY1F1ZXJ5SWRzfTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudEV2ZW50TmFtZUFuZFRhcmdldChcbiAgICBldmVudEFzdDogQm91bmRFdmVudEFzdCwgZGlyQXN0OiBEaXJlY3RpdmVBc3QgfCBudWxsKToge25hbWU6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcgfCBudWxsfSB7XG4gIGlmIChldmVudEFzdC5pc0FuaW1hdGlvbikge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBgQCR7ZXZlbnRBc3QubmFtZX0uJHtldmVudEFzdC5waGFzZX1gLFxuICAgICAgdGFyZ2V0OiBkaXJBc3QgJiYgZGlyQXN0LmRpcmVjdGl2ZS5pc0NvbXBvbmVudCA/ICdjb21wb25lbnQnIDogbnVsbFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGV2ZW50QXN0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNhbGNTdGF0aWNEeW5hbWljUXVlcnlGbGFncyhcbiAgICBxdWVyeUlkczogU3RhdGljQW5kRHluYW1pY1F1ZXJ5SWRzLCBxdWVyeUlkOiBudW1iZXIsIGlzRmlyc3Q6IGJvb2xlYW4pIHtcbiAgbGV0IGZsYWdzID0gTm9kZUZsYWdzLk5vbmU7XG4gIC8vIE5vdGU6IFdlIG9ubHkgbWFrZSBxdWVyaWVzIHN0YXRpYyB0aGF0IHF1ZXJ5IGZvciBhIHNpbmdsZSBpdGVtLlxuICAvLyBUaGlzIGlzIGJlY2F1c2Ugb2YgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCB0aGUgb2xkIHZpZXcgY29tcGlsZXIuLi5cbiAgaWYgKGlzRmlyc3QgJiYgKHF1ZXJ5SWRzLnN0YXRpY1F1ZXJ5SWRzLmhhcyhxdWVyeUlkKSB8fCAhcXVlcnlJZHMuZHluYW1pY1F1ZXJ5SWRzLmhhcyhxdWVyeUlkKSkpIHtcbiAgICBmbGFncyB8PSBOb2RlRmxhZ3MuU3RhdGljUXVlcnk7XG4gIH0gZWxzZSB7XG4gICAgZmxhZ3MgfD0gTm9kZUZsYWdzLkR5bmFtaWNRdWVyeTtcbiAgfVxuICByZXR1cm4gZmxhZ3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50RXZlbnRGdWxsTmFtZSh0YXJnZXQ6IHN0cmluZyB8IG51bGwsIG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB0YXJnZXQgPyBgJHt0YXJnZXR9OiR7bmFtZX1gIDogbmFtZTtcbn1cbiJdfQ==