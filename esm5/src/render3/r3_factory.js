/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { StaticSymbol } from '../aot/static_symbol';
import { tokenReference } from '../compile_metadata';
import { Identifiers } from '../identifiers';
import * as o from '../output/output_ast';
import { Identifiers as R3 } from '../render3/r3_identifiers';
import { unsupported } from './view/util';
export var R3FactoryDelegateType;
(function (R3FactoryDelegateType) {
    R3FactoryDelegateType[R3FactoryDelegateType["Class"] = 0] = "Class";
    R3FactoryDelegateType[R3FactoryDelegateType["Function"] = 1] = "Function";
    R3FactoryDelegateType[R3FactoryDelegateType["Factory"] = 2] = "Factory";
})(R3FactoryDelegateType || (R3FactoryDelegateType = {}));
/**
 * Resolved type of a dependency.
 *
 * Occasionally, dependencies will have special significance which is known statically. In that
 * case the `R3ResolvedDependencyType` informs the factory generator that a particular dependency
 * should be generated specially (usually by calling a special injection function instead of the
 * standard one).
 */
export var R3ResolvedDependencyType;
(function (R3ResolvedDependencyType) {
    /**
     * A normal token dependency.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Token"] = 0] = "Token";
    /**
     * The dependency is for an attribute.
     *
     * The token expression is a string representing the attribute name.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Attribute"] = 1] = "Attribute";
    /**
     * The dependency is for the `Injector` type itself.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Injector"] = 2] = "Injector";
    /**
     * The dependency is for `ElementRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ElementRef"] = 3] = "ElementRef";
    /**
     * The dependency is for `TemplateRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["TemplateRef"] = 4] = "TemplateRef";
    /**
     * The dependency is for `ViewContainerRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ViewContainerRef"] = 5] = "ViewContainerRef";
    /**
     * The dependency is for `ChangeDetectorRef`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ChangeDetectorRef"] = 6] = "ChangeDetectorRef";
    /**
     * The dependency is for `Renderer2`.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Renderer2"] = 7] = "Renderer2";
})(R3ResolvedDependencyType || (R3ResolvedDependencyType = {}));
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 */
export function compileFactoryFunction(meta) {
    var t = o.variable('t');
    var statements = [];
    // The type to instantiate via constructor invocation. If there is no delegated factory, meaning
    // this type is always created by constructor invocation, then this is the type-to-create
    // parameter provided by the user (t) if specified, or the current type if not. If there is a
    // delegated factory (which is used to create the current type) then this is only the type-to-
    // create parameter (t).
    var typeForCtor = !isDelegatedMetadata(meta) ? new o.BinaryOperatorExpr(o.BinaryOperator.Or, t, meta.type) : t;
    var ctorExpr = null;
    if (meta.deps !== null) {
        // There is a constructor (either explicitly or implicitly defined).
        ctorExpr = new o.InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.injectFn));
    }
    else {
        var baseFactory = o.variable("\u0275" + meta.name + "_BaseFactory");
        var getInheritedFactory = o.importExpr(R3.getInheritedFactory);
        var baseFactoryStmt = baseFactory.set(getInheritedFactory.callFn([meta.type])).toDeclStmt(o.INFERRED_TYPE, [
            o.StmtModifier.Exported, o.StmtModifier.Final
        ]);
        statements.push(baseFactoryStmt);
        // There is no constructor, use the base class' factory to construct typeForCtor.
        ctorExpr = baseFactory.callFn([typeForCtor]);
    }
    var ctorExprFinal = ctorExpr;
    var body = [];
    var retExpr = null;
    function makeConditionalFactory(nonCtorExpr) {
        var r = o.variable('r');
        body.push(r.set(o.NULL_EXPR).toDeclStmt());
        body.push(o.ifStmt(t, [r.set(ctorExprFinal).toStmt()], [r.set(nonCtorExpr).toStmt()]));
        return r;
    }
    if (isDelegatedMetadata(meta) && meta.delegateType === R3FactoryDelegateType.Factory) {
        var delegateFactory = o.variable("\u0275" + meta.name + "_BaseFactory");
        var getFactoryOf = o.importExpr(R3.getFactoryOf);
        if (meta.delegate.isEquivalent(meta.type)) {
            throw new Error("Illegal state: compiling factory that delegates to itself");
        }
        var delegateFactoryStmt = delegateFactory.set(getFactoryOf.callFn([meta.delegate])).toDeclStmt(o.INFERRED_TYPE, [
            o.StmtModifier.Exported, o.StmtModifier.Final
        ]);
        statements.push(delegateFactoryStmt);
        var r = makeConditionalFactory(delegateFactory.callFn([]));
        retExpr = r;
    }
    else if (isDelegatedMetadata(meta)) {
        // This type is created with a delegated factory. If a type parameter is not specified, call
        // the factory instead.
        var delegateArgs = injectDependencies(meta.delegateDeps, meta.injectFn);
        // Either call `new delegate(...)` or `delegate(...)` depending on meta.useNewForDelegate.
        var factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ?
            o.InstantiateExpr :
            o.InvokeFunctionExpr)(meta.delegate, delegateArgs);
        retExpr = makeConditionalFactory(factoryExpr);
    }
    else if (isExpressionFactoryMetadata(meta)) {
        // TODO(alxhub): decide whether to lower the value here or in the caller
        retExpr = makeConditionalFactory(meta.expression);
    }
    else {
        retExpr = ctorExpr;
    }
    return {
        factory: o.fn([new o.FnParam('t', o.DYNAMIC_TYPE)], tslib_1.__spread(body, [new o.ReturnStatement(retExpr)]), o.INFERRED_TYPE, undefined, meta.name + "_Factory"),
        statements: statements,
    };
}
function injectDependencies(deps, injectFn) {
    return deps.map(function (dep) { return compileInjectDependency(dep, injectFn); });
}
function compileInjectDependency(dep, injectFn) {
    // Interpret the dependency according to its resolved type.
    switch (dep.resolved) {
        case R3ResolvedDependencyType.Token:
        case R3ResolvedDependencyType.Injector: {
            // Build up the injection flags according to the metadata.
            var flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
                (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
                (dep.optional ? 8 /* Optional */ : 0);
            // Determine the token used for injection. In almost all cases this is the given token, but
            // if the dependency is resolved to the `Injector` then the special `INJECTOR` token is used
            // instead.
            var token = dep.token;
            if (dep.resolved === R3ResolvedDependencyType.Injector) {
                token = o.importExpr(Identifiers.INJECTOR);
            }
            // Build up the arguments to the injectFn call.
            var injectArgs = [token];
            // If this dependency is optional or otherwise has non-default flags, then additional
            // parameters describing how to inject the dependency must be passed to the inject function
            // that's being used.
            if (flags !== 0 /* Default */ || dep.optional) {
                injectArgs.push(o.literal(flags));
            }
            return o.importExpr(injectFn).callFn(injectArgs);
        }
        case R3ResolvedDependencyType.Attribute:
            // In the case of attributes, the attribute name in question is given as the token.
            return o.importExpr(R3.injectAttribute).callFn([dep.token]);
        case R3ResolvedDependencyType.ElementRef:
            return o.importExpr(R3.injectElementRef).callFn([]);
        case R3ResolvedDependencyType.TemplateRef:
            return o.importExpr(R3.injectTemplateRef).callFn([]);
        case R3ResolvedDependencyType.ViewContainerRef:
            return o.importExpr(R3.injectViewContainerRef).callFn([]);
        case R3ResolvedDependencyType.ChangeDetectorRef:
            return o.importExpr(R3.injectChangeDetectorRef).callFn([]);
        case R3ResolvedDependencyType.Renderer2:
            return o.importExpr(R3.injectRenderer2).callFn([]);
        default:
            return unsupported("Unknown R3ResolvedDependencyType: " + R3ResolvedDependencyType[dep.resolved]);
    }
}
/**
 * A helper function useful for extracting `R3DependencyMetadata` from a Render2
 * `CompileTypeMetadata` instance.
 */
export function dependenciesFromGlobalMetadata(type, outputCtx, reflector) {
    var e_1, _a;
    // Use the `CompileReflector` to look up references to some well-known Angular types. These will
    // be compared with the token to statically determine whether the token has significance to
    // Angular, and set the correct `R3ResolvedDependencyType` as a result.
    var elementRef = reflector.resolveExternalReference(Identifiers.ElementRef);
    var templateRef = reflector.resolveExternalReference(Identifiers.TemplateRef);
    var viewContainerRef = reflector.resolveExternalReference(Identifiers.ViewContainerRef);
    var injectorRef = reflector.resolveExternalReference(Identifiers.Injector);
    var renderer2 = reflector.resolveExternalReference(Identifiers.Renderer2);
    // Iterate through the type's DI dependencies and produce `R3DependencyMetadata` for each of them.
    var deps = [];
    try {
        for (var _b = tslib_1.__values(type.diDeps), _c = _b.next(); !_c.done; _c = _b.next()) {
            var dependency = _c.value;
            if (dependency.token) {
                var tokenRef = tokenReference(dependency.token);
                var resolved = R3ResolvedDependencyType.Token;
                if (tokenRef === elementRef) {
                    resolved = R3ResolvedDependencyType.ElementRef;
                }
                else if (tokenRef === templateRef) {
                    resolved = R3ResolvedDependencyType.TemplateRef;
                }
                else if (tokenRef === viewContainerRef) {
                    resolved = R3ResolvedDependencyType.ViewContainerRef;
                }
                else if (tokenRef === injectorRef) {
                    resolved = R3ResolvedDependencyType.Injector;
                }
                else if (tokenRef === renderer2) {
                    resolved = R3ResolvedDependencyType.Renderer2;
                }
                else if (dependency.isAttribute) {
                    resolved = R3ResolvedDependencyType.Attribute;
                }
                // In the case of most dependencies, the token will be a reference to a type. Sometimes,
                // however, it can be a string, in the case of older Angular code or @Attribute injection.
                var token = tokenRef instanceof StaticSymbol ? outputCtx.importExpr(tokenRef) : o.literal(tokenRef);
                // Construct the dependency.
                deps.push({
                    token: token,
                    resolved: resolved,
                    host: !!dependency.isHost,
                    optional: !!dependency.isOptional,
                    self: !!dependency.isSelf,
                    skipSelf: !!dependency.isSkipSelf,
                });
            }
            else {
                unsupported('dependency without a token');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return deps;
}
function isDelegatedMetadata(meta) {
    return meta.delegateType !== undefined;
}
function isExpressionFactoryMetadata(meta) {
    return meta.expression !== undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQXNCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBR3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLElBQUksRUFBRSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFHNUQsT0FBTyxFQUFvQixXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFvQzNELE1BQU0sQ0FBTixJQUFZLHFCQUlYO0FBSkQsV0FBWSxxQkFBcUI7SUFDL0IsbUVBQUssQ0FBQTtJQUNMLHlFQUFRLENBQUE7SUFDUix1RUFBTyxDQUFBO0FBQ1QsQ0FBQyxFQUpXLHFCQUFxQixLQUFyQixxQkFBcUIsUUFJaEM7QUFvQkQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sQ0FBTixJQUFZLHdCQTBDWDtBQTFDRCxXQUFZLHdCQUF3QjtJQUNsQzs7T0FFRztJQUNILHlFQUFTLENBQUE7SUFFVDs7OztPQUlHO0lBQ0gsaUZBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsK0VBQVksQ0FBQTtJQUVaOztPQUVHO0lBQ0gsbUZBQWMsQ0FBQTtJQUVkOztPQUVHO0lBQ0gscUZBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsK0ZBQW9CLENBQUE7SUFFcEI7O09BRUc7SUFDSCxpR0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILGlGQUFhLENBQUE7QUFDZixDQUFDLEVBMUNXLHdCQUF3QixLQUF4Qix3QkFBd0IsUUEw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QUE7b0JBQ0wsUUFBUSxVQUFBO29CQUNSLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU07b0JBQ3pCLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVU7b0JBQ2pDLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU07b0JBQ3pCLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVU7aUJBQ2xDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7Ozs7Ozs7OztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUMsSUFBdUI7SUFFbEQsT0FBUSxJQUFZLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsU0FBUywyQkFBMkIsQ0FBQyxJQUF1QjtJQUMxRCxPQUFRLElBQVksQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO0FBQ2hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7U3RhdGljU3ltYm9sfSBmcm9tICcuLi9hb3Qvc3RhdGljX3N5bWJvbCc7XG5pbXBvcnQge0NvbXBpbGVUeXBlTWV0YWRhdGEsIHRva2VuUmVmZXJlbmNlfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCB7Q29tcGlsZVJlZmxlY3Rvcn0gZnJvbSAnLi4vY29tcGlsZV9yZWZsZWN0b3InO1xuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuLi9pZGVudGlmaWVycyc7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnMgYXMgUjN9IGZyb20gJy4uL3JlbmRlcjMvcjNfaWRlbnRpZmllcnMnO1xuaW1wb3J0IHtPdXRwdXRDb250ZXh0fSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtNRUFOSU5HX1NFUEFSQVRPUiwgdW5zdXBwb3J0ZWR9IGZyb20gJy4vdmlldy91dGlsJztcblxuXG4vKipcbiAqIE1ldGFkYXRhIHJlcXVpcmVkIGJ5IHRoZSBmYWN0b3J5IGdlbmVyYXRvciB0byBnZW5lcmF0ZSBhIGBmYWN0b3J5YCBmdW5jdGlvbiBmb3IgYSB0eXBlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICAvKipcbiAgICogU3RyaW5nIG5hbWUgb2YgdGhlIHR5cGUgYmVpbmcgZ2VuZXJhdGVkICh1c2VkIHRvIG5hbWUgdGhlIGZhY3RvcnkgZnVuY3Rpb24pLlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgZnVuY3Rpb24gKG9yIGNvbnN0cnVjdG9yKSB3aGljaCB3aWxsIGluc3RhbnRpYXRlIHRoZSByZXF1ZXN0ZWRcbiAgICogdHlwZS5cbiAgICpcbiAgICogVGhpcyBjb3VsZCBiZSBhIHJlZmVyZW5jZSB0byBhIGNvbnN0cnVjdG9yIHR5cGUsIG9yIHRvIGEgdXNlci1kZWZpbmVkIGZhY3RvcnkgZnVuY3Rpb24uIFRoZVxuICAgKiBgdXNlTmV3YCBwcm9wZXJ0eSBkZXRlcm1pbmVzIHdoZXRoZXIgaXQgd2lsbCBiZSBjYWxsZWQgYXMgYSBjb25zdHJ1Y3RvciBvciBub3QuXG4gICAqL1xuICB0eXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBgZm5PckNsYXNzYCBpcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIG9yIGEgdXNlci1kZWZpbmVkIGZhY3RvcnksIGl0XG4gICAqIG1heSBoYXZlIDAgb3IgbW9yZSBwYXJhbWV0ZXJzLCB3aGljaCB3aWxsIGJlIGluamVjdGVkIGFjY29yZGluZyB0byB0aGUgYFIzRGVwZW5kZW5jeU1ldGFkYXRhYFxuICAgKiBmb3IgdGhvc2UgcGFyYW1ldGVycy4gSWYgdGhpcyBpcyBgbnVsbGAsIHRoZW4gdGhlIHR5cGUncyBjb25zdHJ1Y3RvciBpcyBub25leGlzdGVudCBhbmQgd2lsbFxuICAgKiBiZSBpbmhlcml0ZWQgZnJvbSBgZm5PckNsYXNzYCB3aGljaCBpcyBpbnRlcnByZXRlZCBhcyB0aGUgY3VycmVudCB0eXBlLlxuICAgKi9cbiAgZGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIGZvciB0aGUgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGluamVjdCBkZXBlbmRlbmNpZXMuIFRoZSBBUEkgb2YgdGhpc1xuICAgKiBmdW5jdGlvbiBjb3VsZCBiZSBkaWZmZXJlbnQsIGFuZCBvdGhlciBvcHRpb25zIGNvbnRyb2wgaG93IGl0IHdpbGwgYmUgaW52b2tlZC5cbiAgICovXG4gIGluamVjdEZuOiBvLkV4dGVybmFsUmVmZXJlbmNlO1xufVxuXG5leHBvcnQgZW51bSBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUge1xuICBDbGFzcyxcbiAgRnVuY3Rpb24sXG4gIEZhY3RvcnksXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNEZWxlZ2F0ZWRGYWN0b3J5TWV0YWRhdGEgZXh0ZW5kcyBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhIHtcbiAgZGVsZWdhdGU6IG8uRXhwcmVzc2lvbjtcbiAgZGVsZWdhdGVUeXBlOiBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuRmFjdG9yeTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0RlbGVnYXRlZEZuT3JDbGFzc01ldGFkYXRhIGV4dGVuZHMgUjNDb25zdHJ1Y3RvckZhY3RvcnlNZXRhZGF0YSB7XG4gIGRlbGVnYXRlOiBvLkV4cHJlc3Npb247XG4gIGRlbGVnYXRlVHlwZTogUjNGYWN0b3J5RGVsZWdhdGVUeXBlLkNsYXNzfFIzRmFjdG9yeURlbGVnYXRlVHlwZS5GdW5jdGlvbjtcbiAgZGVsZWdhdGVEZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YSBleHRlbmRzIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG59XG5cbmV4cG9ydCB0eXBlIFIzRmFjdG9yeU1ldGFkYXRhID0gUjNDb25zdHJ1Y3RvckZhY3RvcnlNZXRhZGF0YSB8IFIzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhIHxcbiAgICBSM0RlbGVnYXRlZEZuT3JDbGFzc01ldGFkYXRhIHwgUjNFeHByZXNzaW9uRmFjdG9yeU1ldGFkYXRhO1xuXG4vKipcbiAqIFJlc29sdmVkIHR5cGUgb2YgYSBkZXBlbmRlbmN5LlxuICpcbiAqIE9jY2FzaW9uYWxseSwgZGVwZW5kZW5jaWVzIHdpbGwgaGF2ZSBzcGVjaWFsIHNpZ25pZmljYW5jZSB3aGljaCBpcyBrbm93biBzdGF0aWNhbGx5LiBJbiB0aGF0XG4gKiBjYXNlIHRoZSBgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlYCBpbmZvcm1zIHRoZSBmYWN0b3J5IGdlbmVyYXRvciB0aGF0IGEgcGFydGljdWxhciBkZXBlbmRlbmN5XG4gKiBzaG91bGQgYmUgZ2VuZXJhdGVkIHNwZWNpYWxseSAodXN1YWxseSBieSBjYWxsaW5nIGEgc3BlY2lhbCBpbmplY3Rpb24gZnVuY3Rpb24gaW5zdGVhZCBvZiB0aGVcbiAqIHN0YW5kYXJkIG9uZSkuXG4gKi9cbmV4cG9ydCBlbnVtIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZSB7XG4gIC8qKlxuICAgKiBBIG5vcm1hbCB0b2tlbiBkZXBlbmRlbmN5LlxuICAgKi9cbiAgVG9rZW4gPSAwLFxuXG4gIC8qKlxuICAgKiBUaGUgZGVwZW5kZW5jeSBpcyBmb3IgYW4gYXR0cmlidXRlLlxuICAgKlxuICAgKiBUaGUgdG9rZW4gZXhwcmVzc2lvbiBpcyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGF0dHJpYnV0ZSBuYW1lLlxuICAgKi9cbiAgQXR0cmlidXRlID0gMSxcblxuICAvKipcbiAgICogVGhlIGRlcGVuZGVuY3kgaXMgZm9yIHRoZSBgSW5qZWN0b3JgIHR5cGUgaXRzZWxmLlxuICAgKi9cbiAgSW5qZWN0b3IgPSAyLFxuXG4gIC8qKlxuICAgKiBUaGUgZGVwZW5kZW5jeSBpcyBmb3IgYEVsZW1lbnRSZWZgLlxuICAgKi9cbiAgRWxlbWVudFJlZiA9IDMsXG5cbiAgLyoqXG4gICAqIFRoZSBkZXBlbmRlbmN5IGlzIGZvciBgVGVtcGxhdGVSZWZgLlxuICAgKi9cbiAgVGVtcGxhdGVSZWYgPSA0LFxuXG4gIC8qKlxuICAgKiBUaGUgZGVwZW5kZW5jeSBpcyBmb3IgYFZpZXdDb250YWluZXJSZWZgLlxuICAgKi9cbiAgVmlld0NvbnRhaW5lclJlZiA9IDUsXG5cbiAgLyoqXG4gICAqIFRoZSBkZXBlbmRlbmN5IGlzIGZvciBgQ2hhbmdlRGV0ZWN0b3JSZWZgLlxuICAgKi9cbiAgQ2hhbmdlRGV0ZWN0b3JSZWYgPSA2LFxuXG4gIC8qKlxuICAgKiBUaGUgZGVwZW5kZW5jeSBpcyBmb3IgYFJlbmRlcmVyMmAuXG4gICAqL1xuICBSZW5kZXJlcjIgPSA3LFxufVxuXG4vKipcbiAqIE1ldGFkYXRhIHJlcHJlc2VudGluZyBhIHNpbmdsZSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gYSBjb25zdHJ1Y3RvciBvciBmdW5jdGlvbiBjYWxsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFIzRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSB0b2tlbiBvciB2YWx1ZSB0byBiZSBpbmplY3RlZC5cbiAgICovXG4gIHRva2VuOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGVudW0gaW5kaWNhdGluZyB3aGV0aGVyIHRoaXMgZGVwZW5kZW5jeSBoYXMgc3BlY2lhbCBtZWFuaW5nIHRvIEFuZ3VsYXIgYW5kIG5lZWRzIHRvIGJlXG4gICAqIGluamVjdGVkIHNwZWNpYWxseS5cbiAgICovXG4gIHJlc29sdmVkOiBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBIb3N0IHF1YWxpZmllci5cbiAgICovXG4gIGhvc3Q6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBPcHRpb25hbCBxdWFsaWZpZXIuXG4gICAqL1xuICBvcHRpb25hbDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQFNlbGYgcXVhbGlmaWVyLlxuICAgKi9cbiAgc2VsZjogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQFNraXBTZWxmIHF1YWxpZmllci5cbiAgICovXG4gIHNraXBTZWxmOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIGZhY3RvcnkgZnVuY3Rpb24gZXhwcmVzc2lvbiBmb3IgdGhlIGdpdmVuIGBSM0ZhY3RvcnlNZXRhZGF0YWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRmFjdG9yeUZ1bmN0aW9uKG1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhKTpcbiAgICB7ZmFjdG9yeTogby5FeHByZXNzaW9uLCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdfSB7XG4gIGNvbnN0IHQgPSBvLnZhcmlhYmxlKCd0Jyk7XG4gIGNvbnN0IHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10gPSBbXTtcblxuICAvLyBUaGUgdHlwZSB0byBpbnN0YW50aWF0ZSB2aWEgY29uc3RydWN0b3IgaW52b2NhdGlvbi4gSWYgdGhlcmUgaXMgbm8gZGVsZWdhdGVkIGZhY3RvcnksIG1lYW5pbmdcbiAgLy8gdGhpcyB0eXBlIGlzIGFsd2F5cyBjcmVhdGVkIGJ5IGNvbnN0cnVjdG9yIGludm9jYXRpb24sIHRoZW4gdGhpcyBpcyB0aGUgdHlwZS10by1jcmVhdGVcbiAgLy8gcGFyYW1ldGVyIHByb3ZpZGVkIGJ5IHRoZSB1c2VyICh0KSBpZiBzcGVjaWZpZWQsIG9yIHRoZSBjdXJyZW50IHR5cGUgaWYgbm90LiBJZiB0aGVyZSBpcyBhXG4gIC8vIGRlbGVnYXRlZCBmYWN0b3J5ICh3aGljaCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgY3VycmVudCB0eXBlKSB0aGVuIHRoaXMgaXMgb25seSB0aGUgdHlwZS10by1cbiAgLy8gY3JlYXRlIHBhcmFtZXRlciAodCkuXG4gIGNvbnN0IHR5cGVGb3JDdG9yID1cbiAgICAgICFpc0RlbGVnYXRlZE1ldGFkYXRhKG1ldGEpID8gbmV3IG8uQmluYXJ5T3BlcmF0b3JFeHByKG8uQmluYXJ5T3BlcmF0b3IuT3IsIHQsIG1ldGEudHlwZSkgOiB0O1xuXG4gIGxldCBjdG9yRXhwcjogby5FeHByZXNzaW9ufG51bGwgPSBudWxsO1xuICBpZiAobWV0YS5kZXBzICE9PSBudWxsKSB7XG4gICAgLy8gVGhlcmUgaXMgYSBjb25zdHJ1Y3RvciAoZWl0aGVyIGV4cGxpY2l0bHkgb3IgaW1wbGljaXRseSBkZWZpbmVkKS5cbiAgICBjdG9yRXhwciA9IG5ldyBvLkluc3RhbnRpYXRlRXhwcih0eXBlRm9yQ3RvciwgaW5qZWN0RGVwZW5kZW5jaWVzKG1ldGEuZGVwcywgbWV0YS5pbmplY3RGbikpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJhc2VGYWN0b3J5ID0gby52YXJpYWJsZShgybUke21ldGEubmFtZX1fQmFzZUZhY3RvcnlgKTtcbiAgICBjb25zdCBnZXRJbmhlcml0ZWRGYWN0b3J5ID0gby5pbXBvcnRFeHByKFIzLmdldEluaGVyaXRlZEZhY3RvcnkpO1xuICAgIGNvbnN0IGJhc2VGYWN0b3J5U3RtdCA9XG4gICAgICAgIGJhc2VGYWN0b3J5LnNldChnZXRJbmhlcml0ZWRGYWN0b3J5LmNhbGxGbihbbWV0YS50eXBlXSkpLnRvRGVjbFN0bXQoby5JTkZFUlJFRF9UWVBFLCBbXG4gICAgICAgICAgby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQsIG8uU3RtdE1vZGlmaWVyLkZpbmFsXG4gICAgICAgIF0pO1xuICAgIHN0YXRlbWVudHMucHVzaChiYXNlRmFjdG9yeVN0bXQpO1xuXG4gICAgLy8gVGhlcmUgaXMgbm8gY29uc3RydWN0b3IsIHVzZSB0aGUgYmFzZSBjbGFzcycgZmFjdG9yeSB0byBjb25zdHJ1Y3QgdHlwZUZvckN0b3IuXG4gICAgY3RvckV4cHIgPSBiYXNlRmFjdG9yeS5jYWxsRm4oW3R5cGVGb3JDdG9yXSk7XG4gIH1cbiAgY29uc3QgY3RvckV4cHJGaW5hbCA9IGN0b3JFeHByO1xuXG4gIGNvbnN0IGJvZHk6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgbGV0IHJldEV4cHI6IG8uRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcblxuICBmdW5jdGlvbiBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG5vbkN0b3JFeHByOiBvLkV4cHJlc3Npb24pOiBvLlJlYWRWYXJFeHByIHtcbiAgICBjb25zdCByID0gby52YXJpYWJsZSgncicpO1xuICAgIGJvZHkucHVzaChyLnNldChvLk5VTExfRVhQUikudG9EZWNsU3RtdCgpKTtcbiAgICBib2R5LnB1c2goby5pZlN0bXQodCwgW3Iuc2V0KGN0b3JFeHByRmluYWwpLnRvU3RtdCgpXSwgW3Iuc2V0KG5vbkN0b3JFeHByKS50b1N0bXQoKV0pKTtcbiAgICByZXR1cm4gcjtcbiAgfVxuXG4gIGlmIChpc0RlbGVnYXRlZE1ldGFkYXRhKG1ldGEpICYmIG1ldGEuZGVsZWdhdGVUeXBlID09PSBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuRmFjdG9yeSkge1xuICAgIGNvbnN0IGRlbGVnYXRlRmFjdG9yeSA9IG8udmFyaWFibGUoYMm1JHttZXRhLm5hbWV9X0Jhc2VGYWN0b3J5YCk7XG4gICAgY29uc3QgZ2V0RmFjdG9yeU9mID0gby5pbXBvcnRFeHByKFIzLmdldEZhY3RvcnlPZik7XG4gICAgaWYgKG1ldGEuZGVsZWdhdGUuaXNFcXVpdmFsZW50KG1ldGEudHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSWxsZWdhbCBzdGF0ZTogY29tcGlsaW5nIGZhY3RvcnkgdGhhdCBkZWxlZ2F0ZXMgdG8gaXRzZWxmYCk7XG4gICAgfVxuICAgIGNvbnN0IGRlbGVnYXRlRmFjdG9yeVN0bXQgPVxuICAgICAgICBkZWxlZ2F0ZUZhY3Rvcnkuc2V0KGdldEZhY3RvcnlPZi5jYWxsRm4oW21ldGEuZGVsZWdhdGVdKSkudG9EZWNsU3RtdChvLklORkVSUkVEX1RZUEUsIFtcbiAgICAgICAgICBvLlN0bXRNb2RpZmllci5FeHBvcnRlZCwgby5TdG10TW9kaWZpZXIuRmluYWxcbiAgICAgICAgXSk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2goZGVsZWdhdGVGYWN0b3J5U3RtdCk7XG4gICAgY29uc3QgciA9IG1ha2VDb25kaXRpb25hbEZhY3RvcnkoZGVsZWdhdGVGYWN0b3J5LmNhbGxGbihbXSkpO1xuICAgIHJldEV4cHIgPSByO1xuICB9IGVsc2UgaWYgKGlzRGVsZWdhdGVkTWV0YWRhdGEobWV0YSkpIHtcbiAgICAvLyBUaGlzIHR5cGUgaXMgY3JlYXRlZCB3aXRoIGEgZGVsZWdhdGVkIGZhY3RvcnkuIElmIGEgdHlwZSBwYXJhbWV0ZXIgaXMgbm90IHNwZWNpZmllZCwgY2FsbFxuICAgIC8vIHRoZSBmYWN0b3J5IGluc3RlYWQuXG4gICAgY29uc3QgZGVsZWdhdGVBcmdzID0gaW5qZWN0RGVwZW5kZW5jaWVzKG1ldGEuZGVsZWdhdGVEZXBzLCBtZXRhLmluamVjdEZuKTtcbiAgICAvLyBFaXRoZXIgY2FsbCBgbmV3IGRlbGVnYXRlKC4uLilgIG9yIGBkZWxlZ2F0ZSguLi4pYCBkZXBlbmRpbmcgb24gbWV0YS51c2VOZXdGb3JEZWxlZ2F0ZS5cbiAgICBjb25zdCBmYWN0b3J5RXhwciA9IG5ldyAoXG4gICAgICAgIG1ldGEuZGVsZWdhdGVUeXBlID09PSBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuQ2xhc3MgP1xuICAgICAgICAgICAgby5JbnN0YW50aWF0ZUV4cHIgOlxuICAgICAgICAgICAgby5JbnZva2VGdW5jdGlvbkV4cHIpKG1ldGEuZGVsZWdhdGUsIGRlbGVnYXRlQXJncyk7XG4gICAgcmV0RXhwciA9IG1ha2VDb25kaXRpb25hbEZhY3RvcnkoZmFjdG9yeUV4cHIpO1xuICB9IGVsc2UgaWYgKGlzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YShtZXRhKSkge1xuICAgIC8vIFRPRE8oYWx4aHViKTogZGVjaWRlIHdoZXRoZXIgdG8gbG93ZXIgdGhlIHZhbHVlIGhlcmUgb3IgaW4gdGhlIGNhbGxlclxuICAgIHJldEV4cHIgPSBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG1ldGEuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0RXhwciA9IGN0b3JFeHByO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmYWN0b3J5OiBvLmZuKFxuICAgICAgICBbbmV3IG8uRm5QYXJhbSgndCcsIG8uRFlOQU1JQ19UWVBFKV0sIFsuLi5ib2R5LCBuZXcgby5SZXR1cm5TdGF0ZW1lbnQocmV0RXhwcildLFxuICAgICAgICBvLklORkVSUkVEX1RZUEUsIHVuZGVmaW5lZCwgYCR7bWV0YS5uYW1lfV9GYWN0b3J5YCksXG4gICAgc3RhdGVtZW50cyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0RGVwZW5kZW5jaWVzKFxuICAgIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW10sIGluamVjdEZuOiBvLkV4dGVybmFsUmVmZXJlbmNlKTogby5FeHByZXNzaW9uW10ge1xuICByZXR1cm4gZGVwcy5tYXAoZGVwID0+IGNvbXBpbGVJbmplY3REZXBlbmRlbmN5KGRlcCwgaW5qZWN0Rm4pKTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUluamVjdERlcGVuZGVuY3koXG4gICAgZGVwOiBSM0RlcGVuZGVuY3lNZXRhZGF0YSwgaW5qZWN0Rm46IG8uRXh0ZXJuYWxSZWZlcmVuY2UpOiBvLkV4cHJlc3Npb24ge1xuICAvLyBJbnRlcnByZXQgdGhlIGRlcGVuZGVuY3kgYWNjb3JkaW5nIHRvIGl0cyByZXNvbHZlZCB0eXBlLlxuICBzd2l0Y2ggKGRlcC5yZXNvbHZlZCkge1xuICAgIGNhc2UgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLlRva2VuOlxuICAgIGNhc2UgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLkluamVjdG9yOiB7XG4gICAgICAvLyBCdWlsZCB1cCB0aGUgaW5qZWN0aW9uIGZsYWdzIGFjY29yZGluZyB0byB0aGUgbWV0YWRhdGEuXG4gICAgICBjb25zdCBmbGFncyA9IEluamVjdEZsYWdzLkRlZmF1bHQgfCAoZGVwLnNlbGYgPyBJbmplY3RGbGFncy5TZWxmIDogMCkgfFxuICAgICAgICAgIChkZXAuc2tpcFNlbGYgPyBJbmplY3RGbGFncy5Ta2lwU2VsZiA6IDApIHwgKGRlcC5ob3N0ID8gSW5qZWN0RmxhZ3MuSG9zdCA6IDApIHxcbiAgICAgICAgICAoZGVwLm9wdGlvbmFsID8gSW5qZWN0RmxhZ3MuT3B0aW9uYWwgOiAwKTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgdG9rZW4gdXNlZCBmb3IgaW5qZWN0aW9uLiBJbiBhbG1vc3QgYWxsIGNhc2VzIHRoaXMgaXMgdGhlIGdpdmVuIHRva2VuLCBidXRcbiAgICAgIC8vIGlmIHRoZSBkZXBlbmRlbmN5IGlzIHJlc29sdmVkIHRvIHRoZSBgSW5qZWN0b3JgIHRoZW4gdGhlIHNwZWNpYWwgYElOSkVDVE9SYCB0b2tlbiBpcyB1c2VkXG4gICAgICAvLyBpbnN0ZWFkLlxuICAgICAgbGV0IHRva2VuOiBvLkV4cHJlc3Npb24gPSBkZXAudG9rZW47XG4gICAgICBpZiAoZGVwLnJlc29sdmVkID09PSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuSW5qZWN0b3IpIHtcbiAgICAgICAgdG9rZW4gPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuSU5KRUNUT1IpO1xuICAgICAgfVxuXG4gICAgICAvLyBCdWlsZCB1cCB0aGUgYXJndW1lbnRzIHRvIHRoZSBpbmplY3RGbiBjYWxsLlxuICAgICAgY29uc3QgaW5qZWN0QXJncyA9IFt0b2tlbl07XG4gICAgICAvLyBJZiB0aGlzIGRlcGVuZGVuY3kgaXMgb3B0aW9uYWwgb3Igb3RoZXJ3aXNlIGhhcyBub24tZGVmYXVsdCBmbGFncywgdGhlbiBhZGRpdGlvbmFsXG4gICAgICAvLyBwYXJhbWV0ZXJzIGRlc2NyaWJpbmcgaG93IHRvIGluamVjdCB0aGUgZGVwZW5kZW5jeSBtdXN0IGJlIHBhc3NlZCB0byB0aGUgaW5qZWN0IGZ1bmN0aW9uXG4gICAgICAvLyB0aGF0J3MgYmVpbmcgdXNlZC5cbiAgICAgIGlmIChmbGFncyAhPT0gSW5qZWN0RmxhZ3MuRGVmYXVsdCB8fCBkZXAub3B0aW9uYWwpIHtcbiAgICAgICAgaW5qZWN0QXJncy5wdXNoKG8ubGl0ZXJhbChmbGFncykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihpbmplY3RGbikuY2FsbEZuKGluamVjdEFyZ3MpO1xuICAgIH1cbiAgICBjYXNlIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5BdHRyaWJ1dGU6XG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhdHRyaWJ1dGVzLCB0aGUgYXR0cmlidXRlIG5hbWUgaW4gcXVlc3Rpb24gaXMgZ2l2ZW4gYXMgdGhlIHRva2VuLlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbmplY3RBdHRyaWJ1dGUpLmNhbGxGbihbZGVwLnRva2VuXSk7XG4gICAgY2FzZSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuRWxlbWVudFJlZjpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0RWxlbWVudFJlZikuY2FsbEZuKFtdKTtcbiAgICBjYXNlIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5UZW1wbGF0ZVJlZjpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0VGVtcGxhdGVSZWYpLmNhbGxGbihbXSk7XG4gICAgY2FzZSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuVmlld0NvbnRhaW5lclJlZjpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0Vmlld0NvbnRhaW5lclJlZikuY2FsbEZuKFtdKTtcbiAgICBjYXNlIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5DaGFuZ2VEZXRlY3RvclJlZjpcbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0Q2hhbmdlRGV0ZWN0b3JSZWYpLmNhbGxGbihbXSk7XG4gICAgY2FzZSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuUmVuZGVyZXIyOlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbmplY3RSZW5kZXJlcjIpLmNhbGxGbihbXSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bnN1cHBvcnRlZChcbiAgICAgICAgICBgVW5rbm93biBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU6ICR7UjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlW2RlcC5yZXNvbHZlZF19YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB1c2VmdWwgZm9yIGV4dHJhY3RpbmcgYFIzRGVwZW5kZW5jeU1ldGFkYXRhYCBmcm9tIGEgUmVuZGVyMlxuICogYENvbXBpbGVUeXBlTWV0YWRhdGFgIGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzRnJvbUdsb2JhbE1ldGFkYXRhKFxuICAgIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsIG91dHB1dEN0eDogT3V0cHV0Q29udGV4dCxcbiAgICByZWZsZWN0b3I6IENvbXBpbGVSZWZsZWN0b3IpOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdIHtcbiAgLy8gVXNlIHRoZSBgQ29tcGlsZVJlZmxlY3RvcmAgdG8gbG9vayB1cCByZWZlcmVuY2VzIHRvIHNvbWUgd2VsbC1rbm93biBBbmd1bGFyIHR5cGVzLiBUaGVzZSB3aWxsXG4gIC8vIGJlIGNvbXBhcmVkIHdpdGggdGhlIHRva2VuIHRvIHN0YXRpY2FsbHkgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHRva2VuIGhhcyBzaWduaWZpY2FuY2UgdG9cbiAgLy8gQW5ndWxhciwgYW5kIHNldCB0aGUgY29ycmVjdCBgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlYCBhcyBhIHJlc3VsdC5cbiAgY29uc3QgZWxlbWVudFJlZiA9IHJlZmxlY3Rvci5yZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2UoSWRlbnRpZmllcnMuRWxlbWVudFJlZik7XG4gIGNvbnN0IHRlbXBsYXRlUmVmID0gcmVmbGVjdG9yLnJlc29sdmVFeHRlcm5hbFJlZmVyZW5jZShJZGVudGlmaWVycy5UZW1wbGF0ZVJlZik7XG4gIGNvbnN0IHZpZXdDb250YWluZXJSZWYgPSByZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLlZpZXdDb250YWluZXJSZWYpO1xuICBjb25zdCBpbmplY3RvclJlZiA9IHJlZmxlY3Rvci5yZXNvbHZlRXh0ZXJuYWxSZWZlcmVuY2UoSWRlbnRpZmllcnMuSW5qZWN0b3IpO1xuICBjb25zdCByZW5kZXJlcjIgPSByZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLlJlbmRlcmVyMik7XG5cbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSB0eXBlJ3MgREkgZGVwZW5kZW5jaWVzIGFuZCBwcm9kdWNlIGBSM0RlcGVuZGVuY3lNZXRhZGF0YWAgZm9yIGVhY2ggb2YgdGhlbS5cbiAgY29uc3QgZGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXSA9IFtdO1xuICBmb3IgKGxldCBkZXBlbmRlbmN5IG9mIHR5cGUuZGlEZXBzKSB7XG4gICAgaWYgKGRlcGVuZGVuY3kudG9rZW4pIHtcbiAgICAgIGNvbnN0IHRva2VuUmVmID0gdG9rZW5SZWZlcmVuY2UoZGVwZW5kZW5jeS50b2tlbik7XG4gICAgICBsZXQgcmVzb2x2ZWQ6IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZSA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5Ub2tlbjtcbiAgICAgIGlmICh0b2tlblJlZiA9PT0gZWxlbWVudFJlZikge1xuICAgICAgICByZXNvbHZlZCA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5FbGVtZW50UmVmO1xuICAgICAgfSBlbHNlIGlmICh0b2tlblJlZiA9PT0gdGVtcGxhdGVSZWYpIHtcbiAgICAgICAgcmVzb2x2ZWQgPSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuVGVtcGxhdGVSZWY7XG4gICAgICB9IGVsc2UgaWYgKHRva2VuUmVmID09PSB2aWV3Q29udGFpbmVyUmVmKSB7XG4gICAgICAgIHJlc29sdmVkID0gUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLlZpZXdDb250YWluZXJSZWY7XG4gICAgICB9IGVsc2UgaWYgKHRva2VuUmVmID09PSBpbmplY3RvclJlZikge1xuICAgICAgICByZXNvbHZlZCA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5JbmplY3RvcjtcbiAgICAgIH0gZWxzZSBpZiAodG9rZW5SZWYgPT09IHJlbmRlcmVyMikge1xuICAgICAgICByZXNvbHZlZCA9IFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5SZW5kZXJlcjI7XG4gICAgICB9IGVsc2UgaWYgKGRlcGVuZGVuY3kuaXNBdHRyaWJ1dGUpIHtcbiAgICAgICAgcmVzb2x2ZWQgPSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUuQXR0cmlidXRlO1xuICAgICAgfVxuXG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBtb3N0IGRlcGVuZGVuY2llcywgdGhlIHRva2VuIHdpbGwgYmUgYSByZWZlcmVuY2UgdG8gYSB0eXBlLiBTb21ldGltZXMsXG4gICAgICAvLyBob3dldmVyLCBpdCBjYW4gYmUgYSBzdHJpbmcsIGluIHRoZSBjYXNlIG9mIG9sZGVyIEFuZ3VsYXIgY29kZSBvciBAQXR0cmlidXRlIGluamVjdGlvbi5cbiAgICAgIGNvbnN0IHRva2VuID1cbiAgICAgICAgICB0b2tlblJlZiBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCA/IG91dHB1dEN0eC5pbXBvcnRFeHByKHRva2VuUmVmKSA6IG8ubGl0ZXJhbCh0b2tlblJlZik7XG5cbiAgICAgIC8vIENvbnN0cnVjdCB0aGUgZGVwZW5kZW5jeS5cbiAgICAgIGRlcHMucHVzaCh7XG4gICAgICAgIHRva2VuLFxuICAgICAgICByZXNvbHZlZCxcbiAgICAgICAgaG9zdDogISFkZXBlbmRlbmN5LmlzSG9zdCxcbiAgICAgICAgb3B0aW9uYWw6ICEhZGVwZW5kZW5jeS5pc09wdGlvbmFsLFxuICAgICAgICBzZWxmOiAhIWRlcGVuZGVuY3kuaXNTZWxmLFxuICAgICAgICBza2lwU2VsZjogISFkZXBlbmRlbmN5LmlzU2tpcFNlbGYsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zdXBwb3J0ZWQoJ2RlcGVuZGVuY3kgd2l0aG91dCBhIHRva2VuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlcHM7XG59XG5cbmZ1bmN0aW9uIGlzRGVsZWdhdGVkTWV0YWRhdGEobWV0YTogUjNGYWN0b3J5TWV0YWRhdGEpOiBtZXRhIGlzIFIzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhfFxuICAgIFIzRGVsZWdhdGVkRm5PckNsYXNzTWV0YWRhdGEge1xuICByZXR1cm4gKG1ldGEgYXMgYW55KS5kZWxlZ2F0ZVR5cGUgIT09IHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gaXNFeHByZXNzaW9uRmFjdG9yeU1ldGFkYXRhKG1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhKTogbWV0YSBpcyBSM0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEge1xuICByZXR1cm4gKG1ldGEgYXMgYW55KS5leHByZXNzaW9uICE9PSB1bmRlZmluZWQ7XG59Il19