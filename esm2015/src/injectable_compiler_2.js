/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from './output/output_ast';
import { Identifiers } from './render3/r3_identifiers';
function mapToMapExpression(map) {
    const result = Object.keys(map).map(key => ({ key, value: map[key], quoted: false }));
    return o.literalMap(result);
}
export function compileIvyInjectable(meta) {
    let ret = o.NULL_EXPR;
    if (meta.useType !== undefined) {
        const args = meta.useType.map(dep => injectDep(dep));
        ret = new o.InstantiateExpr(meta.type, args);
    }
    else if (meta.useClass !== undefined) {
        const factory = new o.ReadPropExpr(new o.ReadPropExpr(meta.useClass, 'ngInjectableDef'), 'factory');
        ret = new o.InvokeFunctionExpr(factory, []);
    }
    else if (meta.useValue !== undefined) {
        ret = meta.useValue;
    }
    else if (meta.useExisting !== undefined) {
        ret = o.importExpr(Identifiers.inject).callFn([meta.useExisting]);
    }
    else if (meta.useFactory !== undefined) {
        const args = meta.useFactory.deps.map(dep => injectDep(dep));
        ret = new o.InvokeFunctionExpr(meta.useFactory.factory, args);
    }
    else {
        throw new Error('No instructions for injectable compiler!');
    }
    const token = meta.type;
    const providedIn = meta.providedIn;
    const factory = o.fn([], [new o.ReturnStatement(ret)], undefined, undefined, `${meta.name}_Factory`);
    const expression = o.importExpr({
        moduleName: '@angular/core',
        name: 'defineInjectable',
    }).callFn([mapToMapExpression({ token, factory, providedIn })]);
    const type = new o.ExpressionType(o.importExpr({
        moduleName: '@angular/core',
        name: 'InjectableDef',
    }, [new o.ExpressionType(meta.type)]));
    return {
        expression, type,
    };
}
function injectDep(dep) {
    const defaultValue = dep.optional ? o.NULL_EXPR : o.literal(undefined);
    const flags = o.literal(0 /* Default */ | (dep.self && 2 /* Self */ || 0) |
        (dep.skipSelf && 4 /* SkipSelf */ || 0));
    if (!dep.optional && !dep.skipSelf && !dep.self) {
        return o.importExpr(Identifiers.inject).callFn([dep.token]);
    }
    else {
        return o.importExpr(Identifiers.inject).callFn([
            dep.token,
            defaultValue,
            flags,
        ]);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9jb21waWxlcl8yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2luamVjdGFibGVfY29tcGlsZXJfMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEtBQUssQ0FBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQU9yRCw0QkFBNEIsR0FBa0M7SUFDNUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztJQUNwRixNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBMEJELE1BQU0sK0JBQStCLElBQTJCO0lBQzlELElBQUksR0FBRyxHQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JELEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FB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QUFDLENBQUM7SUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQzdDLEdBQUcsQ0FBQyxLQUFLO1lBQ1QsWUFBWTtZQUNaLEtBQUs7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RGbGFnc30gZnJvbSAnLi9jb3JlJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0lkZW50aWZpZXJzfSBmcm9tICcuL3JlbmRlcjMvcjNfaWRlbnRpZmllcnMnO1xuXG5cbnR5cGUgTWFwRW50cnkgPSB7XG4gIGtleTogc3RyaW5nOyBxdW90ZWQ6IGJvb2xlYW47IHZhbHVlOiBvLkV4cHJlc3Npb247XG59O1xuXG5mdW5jdGlvbiBtYXBUb01hcEV4cHJlc3Npb24obWFwOiB7W2tleTogc3RyaW5nXTogby5FeHByZXNzaW9ufSk6IG8uTGl0ZXJhbE1hcEV4cHIge1xuICBjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhtYXApLm1hcChrZXkgPT4gKHtrZXksIHZhbHVlOiBtYXBba2V5XSwgcXVvdGVkOiBmYWxzZX0pKTtcbiAgcmV0dXJuIG8ubGl0ZXJhbE1hcChyZXN1bHQpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdGFibGVEZWYge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG4gIHR5cGU6IG8uVHlwZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdnlJbmplY3RhYmxlRGVwIHtcbiAgdG9rZW46IG8uRXhwcmVzc2lvbjtcbiAgb3B0aW9uYWw6IGJvb2xlYW47XG4gIHNlbGY6IGJvb2xlYW47XG4gIHNraXBTZWxmOiBib29sZWFuO1xuICBhdHRyaWJ1dGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXZ5SW5qZWN0YWJsZU1ldGFkYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBvLkV4cHJlc3Npb247XG4gIHByb3ZpZGVkSW46IG8uRXhwcmVzc2lvbjtcbiAgdXNlVHlwZT86IEl2eUluamVjdGFibGVEZXBbXTtcbiAgdXNlQ2xhc3M/OiBvLkV4cHJlc3Npb247XG4gIHVzZUZhY3Rvcnk/OiB7ZmFjdG9yeTogby5FeHByZXNzaW9uOyBkZXBzOiBJdnlJbmplY3RhYmxlRGVwW107fTtcbiAgdXNlRXhpc3Rpbmc/OiBvLkV4cHJlc3Npb247XG4gIHVzZVZhbHVlPzogby5FeHByZXNzaW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUl2eUluamVjdGFibGUobWV0YTogSXZ5SW5qZWN0YWJsZU1ldGFkYXRhKTogSW5qZWN0YWJsZURlZiB7XG4gIGxldCByZXQ6IG8uRXhwcmVzc2lvbiA9IG8uTlVMTF9FWFBSO1xuICBpZiAobWV0YS51c2VUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBhcmdzID0gbWV0YS51c2VUeXBlLm1hcChkZXAgPT4gaW5qZWN0RGVwKGRlcCkpO1xuICAgIHJldCA9IG5ldyBvLkluc3RhbnRpYXRlRXhwcihtZXRhLnR5cGUsIGFyZ3MpO1xuICB9IGVsc2UgaWYgKG1ldGEudXNlQ2xhc3MgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGZhY3RvcnkgPVxuICAgICAgICBuZXcgby5SZWFkUHJvcEV4cHIobmV3IG8uUmVhZFByb3BFeHByKG1ldGEudXNlQ2xhc3MsICduZ0luamVjdGFibGVEZWYnKSwgJ2ZhY3RvcnknKTtcbiAgICByZXQgPSBuZXcgby5JbnZva2VGdW5jdGlvbkV4cHIoZmFjdG9yeSwgW10pO1xuICB9IGVsc2UgaWYgKG1ldGEudXNlVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldCA9IG1ldGEudXNlVmFsdWU7XG4gIH0gZWxzZSBpZiAobWV0YS51c2VFeGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0ID0gby5pbXBvcnRFeHByKElkZW50aWZpZXJzLmluamVjdCkuY2FsbEZuKFttZXRhLnVzZUV4aXN0aW5nXSk7XG4gIH0gZWxzZSBpZiAobWV0YS51c2VGYWN0b3J5ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBhcmdzID0gbWV0YS51c2VGYWN0b3J5LmRlcHMubWFwKGRlcCA9PiBpbmplY3REZXAoZGVwKSk7XG4gICAgcmV0ID0gbmV3IG8uSW52b2tlRnVuY3Rpb25FeHByKG1ldGEudXNlRmFjdG9yeS5mYWN0b3J5LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGluc3RydWN0aW9ucyBmb3IgaW5qZWN0YWJsZSBjb21waWxlciEnKTtcbiAgfVxuXG4gIGNvbnN0IHRva2VuID0gbWV0YS50eXBlO1xuICBjb25zdCBwcm92aWRlZEluID0gbWV0YS5wcm92aWRlZEluO1xuICBjb25zdCBmYWN0b3J5ID1cbiAgICAgIG8uZm4oW10sIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQocmV0KV0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBgJHttZXRhLm5hbWV9X0ZhY3RvcnlgKTtcblxuICBjb25zdCBleHByZXNzaW9uID0gby5pbXBvcnRFeHByKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdAYW5ndWxhci9jb3JlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdkZWZpbmVJbmplY3RhYmxlJyxcbiAgICAgICAgICAgICAgICAgICAgICB9KS5jYWxsRm4oW21hcFRvTWFwRXhwcmVzc2lvbih7dG9rZW4sIGZhY3RvcnksIHByb3ZpZGVkSW59KV0pO1xuICBjb25zdCB0eXBlID0gbmV3IG8uRXhwcmVzc2lvblR5cGUoby5pbXBvcnRFeHByKFxuICAgICAge1xuICAgICAgICBtb2R1bGVOYW1lOiAnQGFuZ3VsYXIvY29yZScsXG4gICAgICAgIG5hbWU6ICdJbmplY3RhYmxlRGVmJyxcbiAgICAgIH0sXG4gICAgICBbbmV3IG8uRXhwcmVzc2lvblR5cGUobWV0YS50eXBlKV0pKTtcblxuICByZXR1cm4ge1xuICAgICAgZXhwcmVzc2lvbiwgdHlwZSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0RGVwKGRlcDogSXZ5SW5qZWN0YWJsZURlcCk6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGRlcC5vcHRpb25hbCA/IG8uTlVMTF9FWFBSIDogby5saXRlcmFsKHVuZGVmaW5lZCk7XG4gIGNvbnN0IGZsYWdzID0gby5saXRlcmFsKFxuICAgICAgSW5qZWN0RmxhZ3MuRGVmYXVsdCB8IChkZXAuc2VsZiAmJiBJbmplY3RGbGFncy5TZWxmIHx8IDApIHxcbiAgICAgIChkZXAuc2tpcFNlbGYgJiYgSW5qZWN0RmxhZ3MuU2tpcFNlbGYgfHwgMCkpO1xuICBpZiAoIWRlcC5vcHRpb25hbCAmJiAhZGVwLnNraXBTZWxmICYmICFkZXAuc2VsZikge1xuICAgIHJldHVybiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuaW5qZWN0KS5jYWxsRm4oW2RlcC50b2tlbl0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuaW5qZWN0KS5jYWxsRm4oW1xuICAgICAgZGVwLnRva2VuLFxuICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgZmxhZ3MsXG4gICAgXSk7XG4gIH1cbn1cbiJdfQ==