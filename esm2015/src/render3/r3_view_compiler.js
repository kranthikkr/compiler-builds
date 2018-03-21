/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { flatten, identifierName, sanitizeIdentifier, tokenReference } from '../compile_metadata';
import { BindingForm, BuiltinFunctionCall, convertActionBinding, convertPropertyBinding } from '../compiler_util/expression_converter';
import { AstMemoryEfficientTransformer, FunctionCall, ImplicitReceiver, LiteralPrimitive, PropertyRead } from '../expression_parser/ast';
import { Identifiers } from '../identifiers';
import { LifecycleHooks } from '../lifecycle_reflector';
import * as o from '../output/output_ast';
import { typeSourceSpan } from '../parse_util';
import { CssSelector } from '../selector';
import { PropertyBindingType, RecursiveTemplateAstVisitor, templateVisitAll } from '../template_parser/template_ast';
import { error } from '../util';
import { Identifiers as R3 } from './r3_identifiers';
import { BUILD_OPTIMIZER_COLOCATE } from './r3_types';
/**
 * Name of the context parameter passed into a template function
 */
const /** @type {?} */ CONTEXT_NAME = 'ctx';
/**
 * Name of the creation mode flag passed into a template function
 */
const /** @type {?} */ CREATION_MODE_FLAG = 'cm';
/**
 * Name of the temporary to use during data binding
 */
const /** @type {?} */ TEMPORARY_NAME = '_t';
/**
 * The prefix reference variables
 */
const /** @type {?} */ REFERENCE_PREFIX = '_r';
/**
 * The name of the implicit context reference
 */
const /** @type {?} */ IMPLICIT_REFERENCE = '$implicit';
/**
 * @param {?} outputCtx
 * @param {?} directive
 * @param {?} reflector
 * @param {?} bindingParser
 * @param {?} mode
 * @return {?}
 */
export function compileDirective(outputCtx, directive, reflector, bindingParser, mode) {
    const /** @type {?} */ definitionMapValues = [];
    const /** @type {?} */ field = (key, value) => {
        if (value) {
            definitionMapValues.push({ key, value, quoted: false });
        }
    };
    // e.g. 'type: MyDirective`
    field('type', outputCtx.importExpr(directive.type.reference));
    // e.g. `factory: () => new MyApp(injectElementRef())`
    field('factory', createFactory(directive.type, outputCtx, reflector, directive.queries));
    // e.g. `hostBindings: (dirIndex, elIndex) => { ... }
    field('hostBindings', createHostBindingsFunction(directive, outputCtx, bindingParser));
    // e.g. `attributes: ['role', 'listbox']`
    field('attributes', createHostAttributesArray(directive, outputCtx));
    // e.g 'inputs: {a: 'a'}`
    field('inputs', createInputsObject(directive, outputCtx));
    const /** @type {?} */ className = /** @type {?} */ ((identifierName(directive.type)));
    className || error(`Cannot resolver the name of ${directive.type}`);
    const /** @type {?} */ definitionField = outputCtx.constantPool.propertyNameOf(1 /* Directive */);
    const /** @type {?} */ definitionFunction = o.importExpr(R3.defineDirective).callFn([o.literalMap(definitionMapValues)]);
    if (mode === 0 /* PartialClass */) {
        // Create the partial class to be merged with the actual class.
        outputCtx.statements.push(new o.ClassStmt(className, null, /* fields */ [new o.ClassField(definitionField, /* type */ o.INFERRED_TYPE, /* modifiers */ [o.StmtModifier.Static], definitionFunction)], /* getters */ [], /* constructorMethod */ new o.ClassMethod(null, [], []), /* methods */ []));
    }
    else {
        // Create back-patch definition.
        const /** @type {?} */ classReference = outputCtx.importExpr(directive.type.reference);
        // Create the back-patch statement
        outputCtx.statements.push(new o.CommentStmt(BUILD_OPTIMIZER_COLOCATE));
        outputCtx.statements.push(classReference.prop(definitionField).set(definitionFunction).toStmt());
    }
}
/**
 * @param {?} outputCtx
 * @param {?} component
 * @param {?} pipes
 * @param {?} template
 * @param {?} reflector
 * @param {?} bindingParser
 * @param {?} mode
 * @return {?}
 */
export function compileComponent(outputCtx, component, pipes, template, reflector, bindingParser, mode) {
    const /** @type {?} */ definitionMapValues = [];
    const /** @type {?} */ field = (key, value) => {
        if (value) {
            definitionMapValues.push({ key, value, quoted: false });
        }
    };
    // e.g. `type: MyApp`
    field('type', outputCtx.importExpr(component.type.reference));
    // e.g. `tag: 'my-app'`
    // This is optional and only included if the first selector of a component has element.
    const /** @type {?} */ selector = component.selector && CssSelector.parse(component.selector);
    const /** @type {?} */ firstSelector = selector && selector[0];
    if (firstSelector && firstSelector.hasElementSelector()) {
        field('tag', o.literal(firstSelector.element));
    }
    // e.g. `attr: ["class", ".my.app"]
    // This is optional an only included if the first selector of a component specifies attributes.
    if (firstSelector) {
        const /** @type {?} */ selectorAttributes = firstSelector.getAttrs();
        if (selectorAttributes.length) {
            field('attrs', outputCtx.constantPool.getConstLiteral(o.literalArr(selectorAttributes.map(value => value != null ? o.literal(value) : o.literal(undefined))), /* forceShared */ true));
        }
    }
    // e.g. `factory: function MyApp_Factory() { return new MyApp(injectElementRef()); }`
    field('factory', createFactory(component.type, outputCtx, reflector, component.queries));
    // e.g `hostBindings: function MyApp_HostBindings { ... }
    field('hostBindings', createHostBindingsFunction(component, outputCtx, bindingParser));
    // e.g. `template: function MyComponent_Template(_ctx, _cm) {...}`
    const /** @type {?} */ templateTypeName = component.type.reference.name;
    const /** @type {?} */ templateName = templateTypeName ? `${templateTypeName}_Template` : null;
    const /** @type {?} */ pipeMap = new Map(pipes.map(pipe => [pipe.name, pipe]));
    const /** @type {?} */ templateFunctionExpression = new TemplateDefinitionBuilder(outputCtx, outputCtx.constantPool, reflector, CONTEXT_NAME, ROOT_SCOPE.nestedScope(), 0, /** @type {?} */ ((component.template)).ngContentSelectors, templateTypeName, templateName, pipeMap, component.viewQueries)
        .buildTemplateFunction(template, []);
    field('template', templateFunctionExpression);
    // e.g `inputs: {a: 'a'}`
    field('inputs', createInputsObject(component, outputCtx));
    // e.g. `features: [NgOnChangesFeature(MyComponent)]`
    const /** @type {?} */ features = [];
    if (component.type.lifecycleHooks.some(lifecycle => lifecycle == LifecycleHooks.OnChanges)) {
        features.push(o.importExpr(R3.NgOnChangesFeature, null, null).callFn([outputCtx.importExpr(component.type.reference)]));
    }
    if (features.length) {
        field('features', o.literalArr(features));
    }
    const /** @type {?} */ definitionField = outputCtx.constantPool.propertyNameOf(2 /* Component */);
    const /** @type {?} */ definitionFunction = o.importExpr(R3.defineComponent).callFn([o.literalMap(definitionMapValues)]);
    if (mode === 0 /* PartialClass */) {
        const /** @type {?} */ className = /** @type {?} */ ((identifierName(component.type)));
        className || error(`Cannot resolver the name of ${component.type}`);
        // Create the partial class to be merged with the actual class.
        outputCtx.statements.push(new o.ClassStmt(className, null, /* fields */ [new o.ClassField(definitionField, /* type */ o.INFERRED_TYPE, /* modifiers */ [o.StmtModifier.Static], definitionFunction)], /* getters */ [], /* constructorMethod */ new o.ClassMethod(null, [], []), /* methods */ []));
    }
    else {
        const /** @type {?} */ classReference = outputCtx.importExpr(component.type.reference);
        // Create the back-patch statement
        outputCtx.statements.push(new o.CommentStmt(BUILD_OPTIMIZER_COLOCATE), classReference.prop(definitionField).set(definitionFunction).toStmt());
    }
}
/**
 * @template T
 * @param {?} arg
 * @return {?}
 */
function unknown(arg) {
    throw new Error(`Builder ${this.constructor.name} is unable to handle ${arg.constructor.name} yet`);
}
/**
 * @param {?} feature
 * @return {?}
 */
function unsupported(feature) {
    if (this) {
        throw new Error(`Builder ${this.constructor.name} doesn't support ${feature} yet`);
    }
    throw new Error(`Feature ${feature} is not supported yet`);
}
const /** @type {?} */ BINDING_INSTRUCTION_MAP = {
    [PropertyBindingType.Property]: R3.elementProperty,
    [PropertyBindingType.Attribute]: R3.elementAttribute,
    [PropertyBindingType.Class]: R3.elementClassNamed,
    [PropertyBindingType.Style]: R3.elementStyleNamed
};
/**
 * @param {?} args
 * @return {?}
 */
function interpolate(args) {
    args = args.slice(1); // Ignore the length prefix added for render2
    switch (args.length) {
        case 3:
            return o.importExpr(R3.interpolation1).callFn(args);
        case 5:
            return o.importExpr(R3.interpolation2).callFn(args);
        case 7:
            return o.importExpr(R3.interpolation3).callFn(args);
        case 9:
            return o.importExpr(R3.interpolation4).callFn(args);
        case 11:
            return o.importExpr(R3.interpolation5).callFn(args);
        case 13:
            return o.importExpr(R3.interpolation6).callFn(args);
        case 15:
            return o.importExpr(R3.interpolation7).callFn(args);
        case 17:
            return o.importExpr(R3.interpolation8).callFn(args);
    }
    (args.length >= 19 && args.length % 2 == 1) ||
        error(`Invalid interpolation argument length ${args.length}`);
    return o.importExpr(R3.interpolationV).callFn([o.literalArr(args)]);
}
/**
 * @param {?} args
 * @return {?}
 */
function pipeBinding(args) {
    switch (args.length) {
        case 0:
            // The first parameter to pipeBind is always the value to be transformed followed
            // by arg.length arguments so the total number of arguments to pipeBind are
            // arg.length + 1.
            return R3.pipeBind1;
        case 1:
            return R3.pipeBind2;
        case 2:
            return R3.pipeBind3;
        default:
            return R3.pipeBindV;
    }
}
const /** @type {?} */ pureFunctionIdentifiers = [
    R3.pureFunction0, R3.pureFunction1, R3.pureFunction2, R3.pureFunction3, R3.pureFunction4,
    R3.pureFunction5, R3.pureFunction6, R3.pureFunction7, R3.pureFunction8
];
/**
 * @param {?} outputContext
 * @param {?} literal
 * @return {?}
 */
function getLiteralFactory(outputContext, literal) {
    const { literalFactory, literalFactoryArguments } = outputContext.constantPool.getLiteralFactory(literal);
    literalFactoryArguments.length > 0 || error(`Expected arguments to a literal factory function`);
    let /** @type {?} */ pureFunctionIdent = pureFunctionIdentifiers[literalFactoryArguments.length] || R3.pureFunctionV;
    // Literal factories are pure functions that only need to be re-invoked when the parameters
    // change.
    return o.importExpr(pureFunctionIdent).callFn([literalFactory, ...literalFactoryArguments]);
}
class BindingScope {
    /**
     * @param {?} parent
     */
    constructor(parent) {
        this.parent = parent;
        this.map = new Map();
        this.referenceNameIndex = 0;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    get(name) {
        let /** @type {?} */ current = this;
        while (current) {
            const /** @type {?} */ value = current.map.get(name);
            if (value != null) {
                // Cache the value locally.
                this.map.set(name, value);
                return value;
            }
            current = current.parent;
        }
        return null;
    }
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    set(name, value) {
        !this.map.has(name) ||
            error(`The name ${name} is already defined in scope to be ${this.map.get(name)}`);
        this.map.set(name, value);
        return this;
    }
    /**
     * @return {?}
     */
    nestedScope() { return new BindingScope(this); }
    /**
     * @return {?}
     */
    freshReferenceName() {
        let /** @type {?} */ current = this;
        // Find the top scope as it maintains the global reference count
        while (current.parent)
            current = current.parent;
        return `${REFERENCE_PREFIX}${current.referenceNameIndex++}`;
    }
}
function BindingScope_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingScope.prototype.map;
    /** @type {?} */
    BindingScope.prototype.referenceNameIndex;
    /** @type {?} */
    BindingScope.prototype.parent;
}
const /** @type {?} */ ROOT_SCOPE = new BindingScope(null).set('$event', o.variable('$event'));
class TemplateDefinitionBuilder {
    /**
     * @param {?} outputCtx
     * @param {?} constantPool
     * @param {?} reflector
     * @param {?} contextParameter
     * @param {?} bindingScope
     * @param {?=} level
     * @param {?=} ngContentSelectors
     * @param {?=} contextName
     * @param {?=} templateName
     * @param {?=} pipes
     * @param {?=} viewQueries
     */
    constructor(outputCtx, constantPool, reflector, contextParameter, bindingScope, level = 0, ngContentSelectors, contextName, templateName, pipes, viewQueries) {
        this.outputCtx = outputCtx;
        this.constantPool = constantPool;
        this.reflector = reflector;
        this.contextParameter = contextParameter;
        this.bindingScope = bindingScope;
        this.level = level;
        this.ngContentSelectors = ngContentSelectors;
        this.contextName = contextName;
        this.templateName = templateName;
        this.pipes = pipes;
        this.viewQueries = viewQueries;
        this._dataIndex = 0;
        this._bindingContext = 0;
        this._referenceIndex = 0;
        this._temporaryAllocated = false;
        this._prefix = [];
        this._creationMode = [];
        this._bindingMode = [];
        this._hostMode = [];
        this._refreshMode = [];
        this._postfix = [];
        this._projectionDefinitionIndex = 0;
        this.unsupported = unsupported;
        this.invalid = invalid;
        // These should be handled in the template or element directly.
        this.visitReference = invalid;
        this.visitVariable = invalid;
        this.visitEvent = invalid;
        this.visitElementProperty = invalid;
        this.visitAttr = invalid;
        // These should be handled in the template or element directly
        this.visitDirective = invalid;
        this.visitDirectiveProperty = invalid;
        this._valueConverter = new ValueConverter(outputCtx, () => this.allocateDataSlot(), (name, localName, slot, value) => {
            bindingScope.set(localName, value);
            const /** @type {?} */ pipe = /** @type {?} */ ((pipes.get(name)));
            pipe || error(`Could not find pipe ${name}`);
            const /** @type {?} */ pipeDefinition = constantPool.getDefinition(pipe.type.reference, 3 /* Pipe */, outputCtx, /* forceShared */ /* forceShared */ true);
            this._creationMode.push(o.importExpr(R3.pipe)
                .callFn([
                o.literal(slot), pipeDefinition, pipeDefinition.callMethod(R3.NEW_METHOD, [])
            ])
                .toStmt());
        });
    }
    /**
     * @param {?} asts
     * @param {?} variables
     * @return {?}
     */
    buildTemplateFunction(asts, variables) {
        // Create variable bindings
        for (const /** @type {?} */ variable of variables) {
            const /** @type {?} */ variableName = variable.name;
            const /** @type {?} */ expression = o.variable(this.contextParameter).prop(variable.value || IMPLICIT_REFERENCE);
            const /** @type {?} */ scopedName = this.bindingScope.freshReferenceName();
            const /** @type {?} */ declaration = o.variable(scopedName).set(expression).toDeclStmt(o.INFERRED_TYPE, [
                o.StmtModifier.Final
            ]);
            // Add the reference to the local scope.
            this.bindingScope.set(variableName, o.variable(scopedName));
            // Declare the local variable in binding mode
            this._bindingMode.push(declaration);
        }
        // Collect content projections
        if (this.ngContentSelectors && this.ngContentSelectors.length > 0) {
            const /** @type {?} */ contentProjections = getContentProjection(asts, this.ngContentSelectors);
            this._contentProjections = contentProjections;
            if (contentProjections.size > 0) {
                const /** @type {?} */ infos = [];
                Array.from(contentProjections.values()).forEach(info => {
                    if (info.selector) {
                        infos[info.index - 1] = info.selector;
                    }
                });
                const /** @type {?} */ projectionIndex = this._projectionDefinitionIndex = this.allocateDataSlot();
                const /** @type {?} */ parameters = [o.literal(projectionIndex)];
                !infos.some(value => !value) || error(`content project information skipped an index`);
                if (infos.length > 1) {
                    parameters.push(this.outputCtx.constantPool.getConstLiteral(asLiteral(infos), /* forceShared */ /* forceShared */ true));
                }
                this.instruction(this._creationMode, null, R3.projectionDef, ...parameters);
            }
        }
        // Define and update any view queries
        for (let /** @type {?} */ query of this.viewQueries) {
            // e.g. r3.Q(0, SomeDirective, true);
            const /** @type {?} */ querySlot = this.allocateDataSlot();
            const /** @type {?} */ predicate = getQueryPredicate(query, this.outputCtx);
            const /** @type {?} */ args = [
                /* memoryIndex */ o.literal(querySlot, o.INFERRED_TYPE),
                predicate,
                /* descend */ o.literal(query.descendants, o.INFERRED_TYPE)
            ];
            if (query.read) {
                args.push(this.outputCtx.importExpr(/** @type {?} */ ((query.read.identifier)).reference));
            }
            this.instruction(this._creationMode, null, R3.query, ...args);
            // (r3.qR(tmp = r3.ɵld(0)) && (ctx.someDir = tmp));
            const /** @type {?} */ temporary = this.temp();
            const /** @type {?} */ getQueryList = o.importExpr(R3.load).callFn([o.literal(querySlot)]);
            const /** @type {?} */ refresh = o.importExpr(R3.queryRefresh).callFn([temporary.set(getQueryList)]);
            const /** @type {?} */ updateDirective = o.variable(CONTEXT_NAME)
                .prop(query.propertyName)
                .set(query.first ? temporary.prop('first') : temporary);
            this._bindingMode.push(refresh.and(updateDirective).toStmt());
        }
        templateVisitAll(this, asts);
        const /** @type {?} */ creationMode = this._creationMode.length > 0 ?
            [o.ifStmt(o.variable(CREATION_MODE_FLAG), this._creationMode)] :
            [];
        return o.fn([
            new o.FnParam(this.contextParameter, null), new o.FnParam(CREATION_MODE_FLAG, o.BOOL_TYPE)
        ], [
            // Temporary variable declarations (i.e. let _t: any;)
            ...this._prefix,
            // Creating mode (i.e. if (cm) { ... })
            ...creationMode,
            // Binding mode (i.e. ɵp(...))
            ...this._bindingMode,
            // Host mode (i.e. Comp.h(...))
            ...this._hostMode,
            // Refresh mode (i.e. Comp.r(...))
            ...this._refreshMode,
            // Nested templates (i.e. function CompTemplate() {})
            ...this._postfix
        ], o.INFERRED_TYPE, null, this.templateName);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) { return this.bindingScope.get(name); }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitNgContent(ast) {
        const /** @type {?} */ info = /** @type {?} */ ((this._contentProjections.get(ast)));
        info || error(`Expected ${ast.sourceSpan} to be included in content projection collection`);
        const /** @type {?} */ slot = this.allocateDataSlot();
        const /** @type {?} */ parameters = [o.literal(slot), o.literal(this._projectionDefinitionIndex)];
        if (info.index !== 0) {
            parameters.push(o.literal(info.index));
        }
        this.instruction(this._creationMode, ast.sourceSpan, R3.projection, ...parameters);
    }
    /**
     * @param {?} directives
     * @return {?}
     */
    _computeDirectivesArray(directives) {
        const /** @type {?} */ directiveIndexMap = new Map();
        const /** @type {?} */ directiveExpressions = directives.filter(directive => !directive.directive.isComponent).map(directive => {
            directiveIndexMap.set(directive.directive.type.reference, this.allocateDataSlot());
            return this.typeReference(directive.directive.type.reference);
        });
        return {
            directivesArray: directiveExpressions.length ?
                this.constantPool.getConstLiteral(o.literalArr(directiveExpressions), /* forceShared */ /* forceShared */ true) :
                o.literal(null),
            directiveIndexMap
        };
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitElement(ast) {
        let /** @type {?} */ bindingCount = 0;
        const /** @type {?} */ elementIndex = this.allocateDataSlot();
        let /** @type {?} */ componentIndex = undefined;
        const /** @type {?} */ referenceDataSlots = new Map();
        // Element creation mode
        const /** @type {?} */ component = findComponent(ast.directives);
        const /** @type {?} */ nullNode = o.literal(null, o.INFERRED_TYPE);
        const /** @type {?} */ parameters = [o.literal(elementIndex)];
        // Add component type or element tag
        if (component) {
            parameters.push(this.typeReference(component.directive.type.reference));
            componentIndex = this.allocateDataSlot();
        }
        else {
            parameters.push(o.literal(ast.name));
        }
        // Add attributes array
        const /** @type {?} */ attributes = [];
        for (let /** @type {?} */ attr of ast.attrs) {
            attributes.push(o.literal(attr.name), o.literal(attr.value));
        }
        parameters.push(attributes.length > 0 ?
            this.constantPool.getConstLiteral(o.literalArr(attributes), /* forceShared */ /* forceShared */ true) :
            nullNode);
        // Add directives array
        const { directivesArray, directiveIndexMap } = this._computeDirectivesArray(ast.directives);
        parameters.push(directiveIndexMap.size > 0 ? directivesArray : nullNode);
        if (component && componentIndex != null) {
            // Record the data slot for the component
            directiveIndexMap.set(component.directive.type.reference, componentIndex);
        }
        // Add references array
        if (ast.references && ast.references.length > 0) {
            const /** @type {?} */ references = flatten(ast.references.map(reference => {
                const /** @type {?} */ slot = this.allocateDataSlot();
                referenceDataSlots.set(reference.name, slot);
                // Generate the update temporary.
                const /** @type {?} */ variableName = this.bindingScope.freshReferenceName();
                this._bindingMode.push(o.variable(variableName, o.INFERRED_TYPE)
                    .set(o.importExpr(R3.load).callFn([o.literal(slot)]))
                    .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
                this.bindingScope.set(reference.name, o.variable(variableName));
                return [reference.name, reference.originalValue];
            })).map(value => o.literal(value));
            parameters.push(this.constantPool.getConstLiteral(o.literalArr(references), /* forceShared */ /* forceShared */ true));
        }
        else {
            parameters.push(nullNode);
        }
        // Remove trailing null nodes as they are implied.
        while (parameters[parameters.length - 1] === nullNode) {
            parameters.pop();
        }
        // Generate the instruction create element instruction
        this.instruction(this._creationMode, ast.sourceSpan, R3.createElement, ...parameters);
        const /** @type {?} */ implicit = o.variable(this.contextParameter);
        // Generate element input bindings
        for (let /** @type {?} */ input of ast.inputs) {
            if (input.isAnimation) {
                this.unsupported('animations');
            }
            const /** @type {?} */ convertedBinding = this.convertPropertyBinding(implicit, input.value);
            const /** @type {?} */ parameters = [o.literal(elementIndex), o.literal(input.name), convertedBinding];
            const /** @type {?} */ instruction = BINDING_INSTRUCTION_MAP[input.type];
            if (instruction) {
                // TODO(chuckj): runtime: security context?
                this.instruction(this._bindingMode, input.sourceSpan, instruction, o.literal(elementIndex), o.literal(input.name), convertedBinding);
            }
            else {
                this.unsupported(`binding ${PropertyBindingType[input.type]}`);
            }
        }
        // Generate directives input bindings
        this._visitDirectives(ast.directives, implicit, elementIndex, directiveIndexMap);
        // Traverse element child nodes
        templateVisitAll(this, ast.children);
        // Finish element construction mode.
        this.instruction(this._creationMode, ast.endSourceSpan || ast.sourceSpan, R3.elementEnd);
    }
    /**
     * @param {?} directives
     * @param {?} implicit
     * @param {?} nodeIndex
     * @param {?} directiveIndexMap
     * @return {?}
     */
    _visitDirectives(directives, implicit, nodeIndex, directiveIndexMap) {
        for (let /** @type {?} */ directive of directives) {
            const /** @type {?} */ directiveIndex = directiveIndexMap.get(directive.directive.type.reference);
            // Creation mode
            // e.g. D(0, TodoComponentDef.n(), TodoComponentDef);
            const /** @type {?} */ directiveType = directive.directive.type.reference;
            const /** @type {?} */ kind = directive.directive.isComponent ? 2 /* Component */ : 1 /* Directive */;
            // Note: *do not cache* calls to this.directiveOf() as the constant pool needs to know if the
            // node is referenced multiple times to know that it must generate the reference into a
            // temporary.
            // Bindings
            for (const /** @type {?} */ input of directive.inputs) {
                const /** @type {?} */ convertedBinding = this.convertPropertyBinding(implicit, input.value);
                this.instruction(this._bindingMode, directive.sourceSpan, R3.elementProperty, o.literal(nodeIndex), o.literal(input.templateName), o.importExpr(R3.bind).callFn([convertedBinding]));
            }
            // e.g. MyDirective.ngDirectiveDef.h(0, 0);
            this._hostMode.push(this.definitionOf(directiveType, kind)
                .callMethod(R3.HOST_BINDING_METHOD, [o.literal(directiveIndex), o.literal(nodeIndex)])
                .toStmt());
            // e.g. r(0, 0);
            this.instruction(this._refreshMode, directive.sourceSpan, R3.refreshComponent, o.literal(directiveIndex), o.literal(nodeIndex));
        }
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitEmbeddedTemplate(ast) {
        const /** @type {?} */ templateIndex = this.allocateDataSlot();
        const /** @type {?} */ templateRef = this.reflector.resolveExternalReference(Identifiers.TemplateRef);
        const /** @type {?} */ templateDirective = ast.directives.find(directive => directive.directive.type.diDeps.some(dependency => dependency.token != null && (tokenReference(dependency.token) == templateRef)));
        const /** @type {?} */ contextName = this.contextName && templateDirective && templateDirective.directive.type.reference.name ?
            `${this.contextName}_${templateDirective.directive.type.reference.name}` :
            null;
        const /** @type {?} */ templateName = contextName ? `${contextName}_Template_${templateIndex}` : `Template_${templateIndex}`;
        const /** @type {?} */ templateContext = `ctx${this.level}`;
        const { directivesArray, directiveIndexMap } = this._computeDirectivesArray(ast.directives);
        // e.g. C(1, C1Template)
        this.instruction(this._creationMode, ast.sourceSpan, R3.containerCreate, o.literal(templateIndex), directivesArray, o.variable(templateName));
        // e.g. Cr(1)
        this.instruction(this._refreshMode, ast.sourceSpan, R3.containerRefreshStart, o.literal(templateIndex));
        // Generate directives
        this._visitDirectives(ast.directives, o.variable(this.contextParameter), templateIndex, directiveIndexMap);
        // e.g. cr();
        this.instruction(this._refreshMode, ast.sourceSpan, R3.containerRefreshEnd);
        // Create the template function
        const /** @type {?} */ templateVisitor = new TemplateDefinitionBuilder(this.outputCtx, this.constantPool, this.reflector, templateContext, this.bindingScope.nestedScope(), this.level + 1, this.ngContentSelectors, contextName, templateName, this.pipes, []);
        const /** @type {?} */ templateFunctionExpr = templateVisitor.buildTemplateFunction(ast.children, ast.variables);
        this._postfix.push(templateFunctionExpr.toDeclStmt(templateName, null));
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitBoundText(ast) {
        const /** @type {?} */ nodeIndex = this.allocateDataSlot();
        // Creation mode
        this.instruction(this._creationMode, ast.sourceSpan, R3.text, o.literal(nodeIndex));
        // Refresh mode
        this.instruction(this._refreshMode, ast.sourceSpan, R3.textCreateBound, o.literal(nodeIndex), this.bind(o.variable(CONTEXT_NAME), ast.value, ast.sourceSpan));
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitText(ast) {
        // Text is defined in creation mode only.
        this.instruction(this._creationMode, ast.sourceSpan, R3.text, o.literal(this.allocateDataSlot()), o.literal(ast.value));
    }
    /**
     * @return {?}
     */
    allocateDataSlot() { return this._dataIndex++; }
    /**
     * @return {?}
     */
    bindingContext() { return `${this._bindingContext++}`; }
    /**
     * @param {?} statements
     * @param {?} span
     * @param {?} reference
     * @param {...?} params
     * @return {?}
     */
    instruction(statements, span, reference, ...params) {
        statements.push(o.importExpr(reference, null, span).callFn(params, span).toStmt());
    }
    /**
     * @param {?} type
     * @return {?}
     */
    typeReference(type) { return this.outputCtx.importExpr(type); }
    /**
     * @param {?} type
     * @param {?} kind
     * @return {?}
     */
    definitionOf(type, kind) {
        return this.constantPool.getDefinition(type, kind, this.outputCtx);
    }
    /**
     * @return {?}
     */
    temp() {
        if (!this._temporaryAllocated) {
            this._prefix.push(new o.DeclareVarStmt(TEMPORARY_NAME, undefined, o.DYNAMIC_TYPE));
            this._temporaryAllocated = true;
        }
        return o.variable(TEMPORARY_NAME);
    }
    /**
     * @param {?} implicit
     * @param {?} value
     * @return {?}
     */
    convertPropertyBinding(implicit, value) {
        const /** @type {?} */ pipesConvertedValue = value.visit(this._valueConverter);
        const /** @type {?} */ convertedPropertyBinding = convertPropertyBinding(this, implicit, pipesConvertedValue, this.bindingContext(), BindingForm.TrySimple, interpolate);
        this._refreshMode.push(...convertedPropertyBinding.stmts);
        return convertedPropertyBinding.currValExpr;
    }
    /**
     * @param {?} implicit
     * @param {?} value
     * @param {?} sourceSpan
     * @return {?}
     */
    bind(implicit, value, sourceSpan) {
        return this.convertPropertyBinding(implicit, value);
    }
}
function TemplateDefinitionBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._dataIndex;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._bindingContext;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._referenceIndex;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._temporaryAllocated;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._prefix;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._creationMode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._bindingMode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._hostMode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._refreshMode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._postfix;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._contentProjections;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._projectionDefinitionIndex;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._valueConverter;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.unsupported;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.invalid;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitReference;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitVariable;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitEvent;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitElementProperty;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitAttr;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitDirective;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitDirectiveProperty;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.outputCtx;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.constantPool;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.reflector;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.contextParameter;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.bindingScope;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.level;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.ngContentSelectors;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.contextName;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.templateName;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.pipes;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.viewQueries;
}
/**
 * @param {?} query
 * @param {?} outputCtx
 * @return {?}
 */
function getQueryPredicate(query, outputCtx) {
    let /** @type {?} */ predicate;
    if (query.selectors.length > 1 || (query.selectors.length == 1 && query.selectors[0].value)) {
        const /** @type {?} */ selectors = query.selectors.map(value => /** @type {?} */ (value.value));
        selectors.some(value => !value) && error('Found a type among the string selectors expected');
        predicate = outputCtx.constantPool.getConstLiteral(o.literalArr(selectors.map(value => o.literal(value))));
    }
    else if (query.selectors.length == 1) {
        const /** @type {?} */ first = query.selectors[0];
        if (first.identifier) {
            predicate = outputCtx.importExpr(first.identifier.reference);
        }
        else {
            error('Unexpected query form');
            predicate = o.literal(null);
        }
    }
    else {
        error('Unexpected query form');
        predicate = o.literal(null);
    }
    return predicate;
}
/**
 * @param {?} type
 * @param {?} outputCtx
 * @param {?} reflector
 * @param {?} queries
 * @return {?}
 */
export function createFactory(type, outputCtx, reflector, queries) {
    let /** @type {?} */ args = [];
    const /** @type {?} */ elementRef = reflector.resolveExternalReference(Identifiers.ElementRef);
    const /** @type {?} */ templateRef = reflector.resolveExternalReference(Identifiers.TemplateRef);
    const /** @type {?} */ viewContainerRef = reflector.resolveExternalReference(Identifiers.ViewContainerRef);
    for (let /** @type {?} */ dependency of type.diDeps) {
        if (dependency.isValue) {
            unsupported('value dependencies');
        }
        if (dependency.isHost) {
            unsupported('host dependencies');
        }
        const /** @type {?} */ token = dependency.token;
        if (token) {
            const /** @type {?} */ tokenRef = tokenReference(token);
            if (tokenRef === elementRef) {
                args.push(o.importExpr(R3.injectElementRef).callFn([]));
            }
            else if (tokenRef === templateRef) {
                args.push(o.importExpr(R3.injectTemplateRef).callFn([]));
            }
            else if (tokenRef === viewContainerRef) {
                args.push(o.importExpr(R3.injectViewContainerRef).callFn([]));
            }
            else {
                const /** @type {?} */ value = token.identifier != null ? outputCtx.importExpr(tokenRef) : o.literal(tokenRef);
                args.push(o.importExpr(R3.inject).callFn([value]));
            }
        }
        else {
            unsupported('dependency without a token');
        }
    }
    const /** @type {?} */ queryDefinitions = [];
    for (let /** @type {?} */ query of queries) {
        const /** @type {?} */ predicate = getQueryPredicate(query, outputCtx);
        // e.g. r3.Q(null, SomeDirective, false) or r3.Q(null, ['div'], false)
        const /** @type {?} */ parameters = [
            /* memoryIndex */ o.literal(null, o.INFERRED_TYPE),
            predicate,
            /* descend */ o.literal(query.descendants)
        ];
        if (query.read) {
            parameters.push(outputCtx.importExpr(/** @type {?} */ ((query.read.identifier)).reference));
        }
        queryDefinitions.push(o.importExpr(R3.query).callFn(parameters));
    }
    const /** @type {?} */ createInstance = new o.InstantiateExpr(outputCtx.importExpr(type.reference), args);
    const /** @type {?} */ result = queryDefinitions.length > 0 ? o.literalArr([createInstance, ...queryDefinitions]) :
        createInstance;
    return o.fn([], [new o.ReturnStatement(result)], o.INFERRED_TYPE, null, type.reference.name ? `${type.reference.name}_Factory` : null);
}
/**
 * @param {?} directiveMetadata
 * @param {?} outputCtx
 * @return {?}
 */
function createHostAttributesArray(directiveMetadata, outputCtx) {
    const /** @type {?} */ values = [];
    const /** @type {?} */ attributes = directiveMetadata.hostAttributes;
    for (let /** @type {?} */ key of Object.getOwnPropertyNames(attributes)) {
        const /** @type {?} */ value = attributes[key];
        values.push(o.literal(key), o.literal(value));
    }
    if (values.length > 0) {
        return outputCtx.constantPool.getConstLiteral(o.literalArr(values));
    }
    return null;
}
/**
 * @param {?} directiveMetadata
 * @param {?} outputCtx
 * @param {?} bindingParser
 * @return {?}
 */
function createHostBindingsFunction(directiveMetadata, outputCtx, bindingParser) {
    const /** @type {?} */ statements = [];
    const /** @type {?} */ temporary = function () {
        let /** @type {?} */ declared = false;
        return () => {
            if (!declared) {
                statements.push(new o.DeclareVarStmt(TEMPORARY_NAME, undefined, o.DYNAMIC_TYPE));
                declared = true;
            }
            return o.variable(TEMPORARY_NAME);
        };
    }();
    const /** @type {?} */ hostBindingSourceSpan = typeSourceSpan(directiveMetadata.isComponent ? 'Component' : 'Directive', directiveMetadata.type);
    // Calculate the queries
    for (let /** @type {?} */ index = 0; index < directiveMetadata.queries.length; index++) {
        const /** @type {?} */ query = directiveMetadata.queries[index];
        // e.g. r3.qR(tmp = r3.ld(dirIndex)[1]) && (r3.ld(dirIndex)[0].someDir = tmp);
        const /** @type {?} */ getDirectiveMemory = o.importExpr(R3.load).callFn([o.variable('dirIndex')]);
        // The query list is at the query index + 1 because the directive itself is in slot 0.
        const /** @type {?} */ getQueryList = getDirectiveMemory.key(o.literal(index + 1));
        const /** @type {?} */ assignToTemporary = temporary().set(getQueryList);
        const /** @type {?} */ callQueryRefresh = o.importExpr(R3.queryRefresh).callFn([assignToTemporary]);
        const /** @type {?} */ updateDirective = getDirectiveMemory.key(o.literal(0, o.INFERRED_TYPE))
            .prop(query.propertyName)
            .set(query.first ? temporary().prop('first') : temporary());
        const /** @type {?} */ andExpression = callQueryRefresh.and(updateDirective);
        statements.push(andExpression.toStmt());
    }
    const /** @type {?} */ directiveSummary = directiveMetadata.toSummary();
    // Calculate the host property bindings
    const /** @type {?} */ bindings = bindingParser.createBoundHostProperties(directiveSummary, hostBindingSourceSpan);
    const /** @type {?} */ bindingContext = o.importExpr(R3.load).callFn([o.variable('dirIndex')]);
    if (bindings) {
        for (const /** @type {?} */ binding of bindings) {
            const /** @type {?} */ bindingExpr = convertPropertyBinding(null, bindingContext, binding.expression, 'b', BindingForm.TrySimple, () => error('Unexpected interpolation'));
            statements.push(...bindingExpr.stmts);
            statements.push(o.importExpr(R3.elementProperty)
                .callFn([
                o.variable('elIndex'), o.literal(binding.name),
                o.importExpr(R3.bind).callFn([bindingExpr.currValExpr])
            ])
                .toStmt());
        }
    }
    // Calculate host event bindings
    const /** @type {?} */ eventBindings = bindingParser.createDirectiveHostEventAsts(directiveSummary, hostBindingSourceSpan);
    if (eventBindings) {
        for (const /** @type {?} */ binding of eventBindings) {
            const /** @type {?} */ bindingExpr = convertActionBinding(null, bindingContext, binding.handler, 'b', () => error('Unexpected interpolation'));
            const /** @type {?} */ bindingName = binding.name && sanitizeIdentifier(binding.name);
            const /** @type {?} */ typeName = identifierName(directiveMetadata.type);
            const /** @type {?} */ functionName = typeName && bindingName ? `${typeName}_${bindingName}_HostBindingHandler` : null;
            const /** @type {?} */ handler = o.fn([new o.FnParam('event', o.DYNAMIC_TYPE)], [...bindingExpr.stmts, new o.ReturnStatement(bindingExpr.allowDefault)], o.INFERRED_TYPE, null, functionName);
            statements.push(o.importExpr(R3.listener).callFn([o.literal(binding.name), handler]).toStmt());
        }
    }
    if (statements.length > 0) {
        const /** @type {?} */ typeName = directiveMetadata.type.reference.name;
        return o.fn([new o.FnParam('dirIndex', o.NUMBER_TYPE), new o.FnParam('elIndex', o.NUMBER_TYPE)], statements, o.INFERRED_TYPE, null, typeName ? `${typeName}_HostBindings` : null);
    }
    return null;
}
/**
 * @param {?} directive
 * @param {?} outputCtx
 * @return {?}
 */
function createInputsObject(directive, outputCtx) {
    if (Object.getOwnPropertyNames(directive.inputs).length > 0) {
        return outputCtx.constantPool.getConstLiteral(mapToExpression(directive.inputs));
    }
    return null;
}
class ValueConverter extends AstMemoryEfficientTransformer {
    /**
     * @param {?} outputCtx
     * @param {?} allocateSlot
     * @param {?} definePipe
     */
    constructor(outputCtx, allocateSlot, definePipe) {
        super();
        this.outputCtx = outputCtx;
        this.allocateSlot = allocateSlot;
        this.definePipe = definePipe;
        this.pipeSlots = new Map();
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        // Allocate a slot to create the pipe
        let /** @type {?} */ slot = this.pipeSlots.get(ast.name);
        if (slot == null) {
            slot = this.allocateSlot();
            this.pipeSlots.set(ast.name, slot);
        }
        const /** @type {?} */ slotPseudoLocal = `PIPE:${slot}`;
        const /** @type {?} */ target = new PropertyRead(ast.span, new ImplicitReceiver(ast.span), slotPseudoLocal);
        const /** @type {?} */ bindingId = pipeBinding(ast.args);
        this.definePipe(ast.name, slotPseudoLocal, slot, o.importExpr(bindingId));
        const /** @type {?} */ value = ast.exp.visit(this);
        const /** @type {?} */ args = this.visitAll(ast.args);
        return new FunctionCall(ast.span, target, [new LiteralPrimitive(ast.span, slot), value, ...args]);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        return new BuiltinFunctionCall(ast.span, this.visitAll(ast.expressions), values => {
            // If the literal has calculated (non-literal) elements  transform it into
            // calls to literal factories that compose the literal and will cache intermediate
            // values. Otherwise, just return an literal array that contains the values.
            const /** @type {?} */ literal = o.literalArr(values);
            return values.every(a => a.isConstant()) ?
                this.outputCtx.constantPool.getConstLiteral(literal, true) :
                getLiteralFactory(this.outputCtx, literal);
        });
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        return new BuiltinFunctionCall(ast.span, this.visitAll(ast.values), values => {
            // If the literal has calculated (non-literal) elements  transform it into
            // calls to literal factories that compose the literal and will cache intermediate
            // values. Otherwise, just return an literal array that contains the values.
            const /** @type {?} */ literal = o.literalMap(values.map((value, index) => ({ key: ast.keys[index].key, value, quoted: ast.keys[index].quoted })));
            return values.every(a => a.isConstant()) ?
                this.outputCtx.constantPool.getConstLiteral(literal, true) :
                getLiteralFactory(this.outputCtx, literal);
        });
    }
}
function ValueConverter_tsickle_Closure_declarations() {
    /** @type {?} */
    ValueConverter.prototype.pipeSlots;
    /** @type {?} */
    ValueConverter.prototype.outputCtx;
    /** @type {?} */
    ValueConverter.prototype.allocateSlot;
    /** @type {?} */
    ValueConverter.prototype.definePipe;
}
/**
 * @template T
 * @param {?} arg
 * @return {?}
 */
function invalid(arg) {
    throw new Error(`Invalid state: Visitor ${this.constructor.name} doesn't handle ${o.constructor.name}`);
}
/**
 * @param {?} directives
 * @return {?}
 */
function findComponent(directives) {
    return directives.filter(directive => directive.directive.isComponent)[0];
}
/**
 * @record
 */
function NgContentInfo() { }
function NgContentInfo_tsickle_Closure_declarations() {
    /** @type {?} */
    NgContentInfo.prototype.index;
    /** @type {?|undefined} */
    NgContentInfo.prototype.selector;
}
class ContentProjectionVisitor extends RecursiveTemplateAstVisitor {
    /**
     * @param {?} projectionMap
     * @param {?} ngContentSelectors
     */
    constructor(projectionMap, ngContentSelectors) {
        super();
        this.projectionMap = projectionMap;
        this.ngContentSelectors = ngContentSelectors;
        this.index = 1;
    }
    /**
     * @param {?} ast
     * @return {?}
     */
    visitNgContent(ast) {
        const /** @type {?} */ selectorText = this.ngContentSelectors[ast.index];
        selectorText != null || error(`could not find selector for index ${ast.index} in ${ast}`);
        if (!selectorText || selectorText === '*') {
            this.projectionMap.set(ast, { index: 0 });
        }
        else {
            const /** @type {?} */ cssSelectors = CssSelector.parse(selectorText);
            this.projectionMap.set(ast, { index: this.index++, selector: parseSelectorsToR3Selector(cssSelectors) });
        }
    }
}
function ContentProjectionVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    ContentProjectionVisitor.prototype.index;
    /** @type {?} */
    ContentProjectionVisitor.prototype.projectionMap;
    /** @type {?} */
    ContentProjectionVisitor.prototype.ngContentSelectors;
}
/**
 * @param {?} asts
 * @param {?} ngContentSelectors
 * @return {?}
 */
function getContentProjection(asts, ngContentSelectors) {
    const /** @type {?} */ projectIndexMap = new Map();
    const /** @type {?} */ visitor = new ContentProjectionVisitor(projectIndexMap, ngContentSelectors);
    templateVisitAll(visitor, asts);
    return projectIndexMap;
}
/**
 * @param {?} selector
 * @return {?}
 */
function parserSelectorToSimpleSelector(selector) {
    const /** @type {?} */ classes = selector.classNames && selector.classNames.length ? ['class', ...selector.classNames] : [];
    return [selector.element, ...selector.attrs, ...classes];
}
/**
 * @param {?} selector
 * @return {?}
 */
function parserSelectorToR3Selector(selector) {
    const /** @type {?} */ positive = parserSelectorToSimpleSelector(selector);
    const /** @type {?} */ negative = selector.notSelectors && selector.notSelectors.length &&
        parserSelectorToSimpleSelector(selector.notSelectors[0]);
    return negative ? [positive, negative] : [positive, null];
}
/**
 * @param {?} selectors
 * @return {?}
 */
function parseSelectorsToR3Selector(selectors) {
    return selectors.map(parserSelectorToR3Selector);
}
/**
 * @param {?} value
 * @return {?}
 */
function asLiteral(value) {
    if (Array.isArray(value)) {
        return o.literalArr(value.map(asLiteral));
    }
    return o.literal(value, o.INFERRED_TYPE);
}
/**
 * @param {?} map
 * @return {?}
 */
function mapToExpression(map) {
    return o.literalMap(Object.getOwnPropertyNames(map).map(key => ({ key, quoted: false, value: o.literal(map[key]) })));
}
//# sourceMappingURL=r3_view_compiler.js.map