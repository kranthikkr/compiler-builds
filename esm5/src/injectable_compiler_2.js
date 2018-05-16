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
    var result = Object.keys(map).map(function (key) { return ({ key: key, value: map[key], quoted: false }); });
    return o.literalMap(result);
}
export function compileIvyInjectable(meta) {
    var ret = o.NULL_EXPR;
    if (meta.useType !== undefined) {
        var args = meta.useType.map(function (dep) { return injectDep(dep); });
        ret = new o.InstantiateExpr(meta.type, args);
    }
    else if (meta.useClass !== undefined) {
        var factory_1 = new o.ReadPropExpr(new o.ReadPropExpr(meta.useClass, 'ngInjectableDef'), 'factory');
        ret = new o.InvokeFunctionExpr(factory_1, []);
    }
    else if (meta.useValue !== undefined) {
        ret = meta.useValue;
    }
    else if (meta.useExisting !== undefined) {
        ret = o.importExpr(Identifiers.inject).callFn([meta.useExisting]);
    }
    else if (meta.useFactory !== undefined) {
        var args = meta.useFactory.deps.map(function (dep) { return injectDep(dep); });
        ret = new o.InvokeFunctionExpr(meta.useFactory.factory, args);
    }
    else {
        throw new Error('No instructions for injectable compiler!');
    }
    var token = meta.type;
    var providedIn = meta.providedIn;
    var factory = o.fn([], [new o.ReturnStatement(ret)], undefined, undefined, meta.name + "_Factory");
    var expression = o.importExpr({
        moduleName: '@angular/core',
        name: 'defineInjectable',
    }).callFn([mapToMapExpression({ token: token, factory: factory, providedIn: providedIn })]);
    var type = new o.ExpressionType(o.importExpr({
        moduleName: '@angular/core',
        name: 'InjectableDef',
    }, [new o.ExpressionType(meta.type)]));
    return {
        expression: expression, type: type,
    };
}
function injectDep(dep) {
    var defaultValue = dep.optional ? o.NULL_EXPR : o.literal(undefined);
    var flags = o.literal(0 /* Default */ | (dep.self && 2 /* Self */ || 0) |
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0YWJsZV9jb21waWxlcl8yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2luamVjdGFibGVfY29tcGlsZXJfMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxPQUFPLEtBQUssQ0FBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQU9yRCw0QkFBNEIsR0FBa0M7SUFDNUQsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLEVBQUMsR0FBRyxLQUFBLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDO0lBQ3BGLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBMEJELE1BQU0sK0JBQStCLElBQTJCO0lBQzlELElBQUksR0FBRyxHQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ3BDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDOUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7UUFDckQsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzlDO1NBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUN0QyxJQUFNLFNBQU8sR0FDVCxJ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VyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQzdEO1NBQU07UUFDTCxPQUFPLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUM3QyxHQUFHLENBQUMsS0FBSztZQUNULFlBQVk7WUFDWixLQUFLO1NBQ04sQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdEZsYWdzfSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0ICogYXMgbyBmcm9tICcuL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4vcmVuZGVyMy9yM19pZGVudGlmaWVycyc7XG5cblxudHlwZSBNYXBFbnRyeSA9IHtcbiAga2V5OiBzdHJpbmc7IHF1b3RlZDogYm9vbGVhbjsgdmFsdWU6IG8uRXhwcmVzc2lvbjtcbn07XG5cbmZ1bmN0aW9uIG1hcFRvTWFwRXhwcmVzc2lvbihtYXA6IHtba2V5OiBzdHJpbmddOiBvLkV4cHJlc3Npb259KTogby5MaXRlcmFsTWFwRXhwciB7XG4gIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5rZXlzKG1hcCkubWFwKGtleSA9PiAoe2tleSwgdmFsdWU6IG1hcFtrZXldLCBxdW90ZWQ6IGZhbHNlfSkpO1xuICByZXR1cm4gby5saXRlcmFsTWFwKHJlc3VsdCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0YWJsZURlZiB7XG4gIGV4cHJlc3Npb246IG8uRXhwcmVzc2lvbjtcbiAgdHlwZTogby5UeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEl2eUluamVjdGFibGVEZXAge1xuICB0b2tlbjogby5FeHByZXNzaW9uO1xuICBvcHRpb25hbDogYm9vbGVhbjtcbiAgc2VsZjogYm9vbGVhbjtcbiAgc2tpcFNlbGY6IGJvb2xlYW47XG4gIGF0dHJpYnV0ZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJdnlJbmplY3RhYmxlTWV0YWRhdGEge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IG8uRXhwcmVzc2lvbjtcbiAgcHJvdmlkZWRJbjogby5FeHByZXNzaW9uO1xuICB1c2VUeXBlPzogSXZ5SW5qZWN0YWJsZURlcFtdO1xuICB1c2VDbGFzcz86IG8uRXhwcmVzc2lvbjtcbiAgdXNlRmFjdG9yeT86IHtmYWN0b3J5OiBvLkV4cHJlc3Npb247IGRlcHM6IEl2eUluamVjdGFibGVEZXBbXTt9O1xuICB1c2VFeGlzdGluZz86IG8uRXhwcmVzc2lvbjtcbiAgdXNlVmFsdWU/OiBvLkV4cHJlc3Npb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlSXZ5SW5qZWN0YWJsZShtZXRhOiBJdnlJbmplY3RhYmxlTWV0YWRhdGEpOiBJbmplY3RhYmxlRGVmIHtcbiAgbGV0IHJldDogby5FeHByZXNzaW9uID0gby5OVUxMX0VYUFI7XG4gIGlmIChtZXRhLnVzZVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGFyZ3MgPSBtZXRhLnVzZVR5cGUubWFwKGRlcCA9PiBpbmplY3REZXAoZGVwKSk7XG4gICAgcmV0ID0gbmV3IG8uSW5zdGFudGlhdGVFeHByKG1ldGEudHlwZSwgYXJncyk7XG4gIH0gZWxzZSBpZiAobWV0YS51c2VDbGFzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgZmFjdG9yeSA9XG4gICAgICAgIG5ldyBvLlJlYWRQcm9wRXhwcihuZXcgby5SZWFkUHJvcEV4cHIobWV0YS51c2VDbGFzcywgJ25nSW5qZWN0YWJsZURlZicpLCAnZmFjdG9yeScpO1xuICAgIHJldCA9IG5ldyBvLkludm9rZUZ1bmN0aW9uRXhwcihmYWN0b3J5LCBbXSk7XG4gIH0gZWxzZSBpZiAobWV0YS51c2VWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0ID0gbWV0YS51c2VWYWx1ZTtcbiAgfSBlbHNlIGlmIChtZXRhLnVzZUV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXQgPSBvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuaW5qZWN0KS5jYWxsRm4oW21ldGEudXNlRXhpc3RpbmddKTtcbiAgfSBlbHNlIGlmIChtZXRhLnVzZUZhY3RvcnkgIT09IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGFyZ3MgPSBtZXRhLnVzZUZhY3RvcnkuZGVwcy5tYXAoZGVwID0+IGluamVjdERlcChkZXApKTtcbiAgICByZXQgPSBuZXcgby5JbnZva2VGdW5jdGlvbkV4cHIobWV0YS51c2VGYWN0b3J5LmZhY3RvcnksIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignTm8gaW5zdHJ1Y3Rpb25zIGZvciBpbmplY3RhYmxlIGNvbXBpbGVyIScpO1xuICB9XG5cbiAgY29uc3QgdG9rZW4gPSBtZXRhLnR5cGU7XG4gIGNvbnN0IHByb3ZpZGVkSW4gPSBtZXRhLnByb3ZpZGVkSW47XG4gIGNvbnN0IGZhY3RvcnkgPVxuICAgICAgby5mbihbXSwgW25ldyBvLlJldHVyblN0YXRlbWVudChyZXQpXSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGAke21ldGEubmFtZX1fRmFjdG9yeWApO1xuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBvLmltcG9ydEV4cHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ0Bhbmd1bGFyL2NvcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2RlZmluZUluamVjdGFibGUnLFxuICAgICAgICAgICAgICAgICAgICAgIH0pLmNhbGxGbihbbWFwVG9NYXBFeHByZXNzaW9uKHt0b2tlbiwgZmFjdG9yeSwgcHJvdmlkZWRJbn0pXSk7XG4gIGNvbnN0IHR5cGUgPSBuZXcgby5FeHByZXNzaW9uVHlwZShvLmltcG9ydEV4cHIoXG4gICAgICB7XG4gICAgICAgIG1vZHVsZU5hbWU6ICdAYW5ndWxhci9jb3JlJyxcbiAgICAgICAgbmFtZTogJ0luamVjdGFibGVEZWYnLFxuICAgICAgfSxcbiAgICAgIFtuZXcgby5FeHByZXNzaW9uVHlwZShtZXRhLnR5cGUpXSkpO1xuXG4gIHJldHVybiB7XG4gICAgICBleHByZXNzaW9uLCB0eXBlLFxuICB9O1xufVxuXG5mdW5jdGlvbiBpbmplY3REZXAoZGVwOiBJdnlJbmplY3RhYmxlRGVwKTogby5FeHByZXNzaW9uIHtcbiAgY29uc3QgZGVmYXVsdFZhbHVlID0gZGVwLm9wdGlvbmFsID8gby5OVUxMX0VYUFIgOiBvLmxpdGVyYWwodW5kZWZpbmVkKTtcbiAgY29uc3QgZmxhZ3MgPSBvLmxpdGVyYWwoXG4gICAgICBJbmplY3RGbGFncy5EZWZhdWx0IHwgKGRlcC5zZWxmICYmIEluamVjdEZsYWdzLlNlbGYgfHwgMCkgfFxuICAgICAgKGRlcC5za2lwU2VsZiAmJiBJbmplY3RGbGFncy5Ta2lwU2VsZiB8fCAwKSk7XG4gIGlmICghZGVwLm9wdGlvbmFsICYmICFkZXAuc2tpcFNlbGYgJiYgIWRlcC5zZWxmKSB7XG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5pbmplY3QpLmNhbGxGbihbZGVwLnRva2VuXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG8uaW1wb3J0RXhwcihJZGVudGlmaWVycy5pbmplY3QpLmNhbGxGbihbXG4gICAgICBkZXAudG9rZW4sXG4gICAgICBkZWZhdWx0VmFsdWUsXG4gICAgICBmbGFncyxcbiAgICBdKTtcbiAgfVxufVxuIl19