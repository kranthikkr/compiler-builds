/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { identifierName } from '../compile_metadata';
import * as o from '../output/output_ast';
import { error } from '../util';
import { compileFactoryFunction, dependenciesFromGlobalMetadata } from './r3_factory';
import { Identifiers as R3 } from './r3_identifiers';
export function compilePipeFromMetadata(metadata) {
    var definitionMapValues = [];
    // e.g. `name: 'myPipe'`
    definitionMapValues.push({ key: 'name', value: o.literal(metadata.pipeName), quoted: false });
    // e.g. `type: MyPipe`
    definitionMapValues.push({ key: 'type', value: metadata.type, quoted: false });
    var templateFactory = compileFactoryFunction({
        name: metadata.name,
        type: metadata.type,
        deps: metadata.deps,
        injectFn: R3.directiveInject,
    });
    definitionMapValues.push({ key: 'factory', value: templateFactory.factory, quoted: false });
    // e.g. `pure: true`
    definitionMapValues.push({ key: 'pure', value: o.literal(metadata.pure), quoted: false });
    var expression = o.importExpr(R3.definePipe).callFn([o.literalMap(definitionMapValues)]);
    var type = new o.ExpressionType(o.importExpr(R3.PipeDef, [
        new o.ExpressionType(metadata.type),
        new o.ExpressionType(new o.LiteralExpr(metadata.pipeName)),
    ]));
    return { expression: expression, type: type, statements: templateFactory.statements };
}
/**
 * Write a pipe definition to the output context.
 */
export function compilePipeFromRender2(outputCtx, pipe, reflector) {
    var definitionMapValues = [];
    var name = identifierName(pipe.type);
    if (!name) {
        return error("Cannot resolve the name of " + pipe.type);
    }
    var metadata = {
        name: name,
        pipeName: pipe.name,
        type: outputCtx.importExpr(pipe.type.reference),
        deps: dependenciesFromGlobalMetadata(pipe.type, outputCtx, reflector),
        pure: pipe.pure,
    };
    var res = compilePipeFromMetadata(metadata);
    var definitionField = outputCtx.constantPool.propertyNameOf(3 /* Pipe */);
    outputCtx.statements.push(new o.ClassStmt(
    /* name */ name, 
    /* parent */ null, 
    /* fields */ [new o.ClassField(
        /* name */ definitionField, 
        /* type */ o.INFERRED_TYPE, 
        /* modifiers */ [o.StmtModifier.Static], 
        /* initializer */ res.expression)], 
    /* getters */ [], 
    /* constructorMethod */ new o.ClassMethod(null, [], []), 
    /* methods */ []));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfcGlwZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX3BpcGVfY29tcGlsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzQixjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUd4RSxPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFDLE9BQU8sRUFBZ0IsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRTdDLE9BQU8sRUFBdUIsc0JBQXNCLEVBQUUsOEJBQThCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDMUcsT0FBTyxFQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQWdCbkQsTUFBTSxrQ0FBa0MsUUFBd0I7SUFDOUQsSUFBTSxtQkFBbUIsR0FBMEQsRUFBRSxDQUFDO0lBRXRGLHdCQUF3QjtJQUN4QixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUU1RixzQkFBc0I7SUFDdEIsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUU3RSxJQUFNLGVBQWUsR0FBRyxzQkFBc0IsQ0FBQztRQUM3QyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7UUFDbkIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ25CLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtRQUNuQixRQUFRLEVBQUUs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aHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcGlsZVBpcGVNZXRhZGF0YSwgaWRlbnRpZmllck5hbWV9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0RlZmluaXRpb25LaW5kfSBmcm9tICcuLi9jb25zdGFudF9wb29sJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtPdXRwdXRDb250ZXh0LCBlcnJvcn0gZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7UjNEZXBlbmRlbmN5TWV0YWRhdGEsIGNvbXBpbGVGYWN0b3J5RnVuY3Rpb24sIGRlcGVuZGVuY2llc0Zyb21HbG9iYWxNZXRhZGF0YX0gZnJvbSAnLi9yM19mYWN0b3J5JztcbmltcG9ydCB7SWRlbnRpZmllcnMgYXMgUjN9IGZyb20gJy4vcjNfaWRlbnRpZmllcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFIzUGlwZU1ldGFkYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBvLkV4cHJlc3Npb247XG4gIHBpcGVOYW1lOiBzdHJpbmc7XG4gIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW118bnVsbDtcbiAgcHVyZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM1BpcGVEZWYge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG4gIHR5cGU6IG8uVHlwZTtcbiAgc3RhdGVtZW50czogby5TdGF0ZW1lbnRbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVQaXBlRnJvbU1ldGFkYXRhKG1ldGFkYXRhOiBSM1BpcGVNZXRhZGF0YSkge1xuICBjb25zdCBkZWZpbml0aW9uTWFwVmFsdWVzOiB7a2V5OiBzdHJpbmcsIHF1b3RlZDogYm9vbGVhbiwgdmFsdWU6IG8uRXhwcmVzc2lvbn1bXSA9IFtdO1xuXG4gIC8vIGUuZy4gYG5hbWU6ICdteVBpcGUnYFxuICBkZWZpbml0aW9uTWFwVmFsdWVzLnB1c2goe2tleTogJ25hbWUnLCB2YWx1ZTogby5saXRlcmFsKG1ldGFkYXRhLnBpcGVOYW1lKSwgcXVvdGVkOiBmYWxzZX0pO1xuXG4gIC8vIGUuZy4gYHR5cGU6IE15UGlwZWBcbiAgZGVmaW5pdGlvbk1hcFZhbHVlcy5wdXNoKHtrZXk6ICd0eXBlJywgdmFsdWU6IG1ldGFkYXRhLnR5cGUsIHF1b3RlZDogZmFsc2V9KTtcblxuICBjb25zdCB0ZW1wbGF0ZUZhY3RvcnkgPSBjb21waWxlRmFjdG9yeUZ1bmN0aW9uKHtcbiAgICBuYW1lOiBtZXRhZGF0YS5uYW1lLFxuICAgIHR5cGU6IG1ldGFkYXRhLnR5cGUsXG4gICAgZGVwczogbWV0YWRhdGEuZGVwcyxcbiAgICBpbmplY3RGbjogUjMuZGlyZWN0aXZlSW5qZWN0LFxuICB9KTtcbiAgZGVmaW5pdGlvbk1hcFZhbHVlcy5wdXNoKHtrZXk6ICdmYWN0b3J5JywgdmFsdWU6IHRlbXBsYXRlRmFjdG9yeS5mYWN0b3J5LCBxdW90ZWQ6IGZhbHNlfSk7XG5cbiAgLy8gZS5nLiBgcHVyZTogdHJ1ZWBcbiAgZGVmaW5pdGlvbk1hcFZhbHVlcy5wdXNoKHtrZXk6ICdwdXJlJywgdmFsdWU6IG8ubGl0ZXJhbChtZXRhZGF0YS5wdXJlKSwgcXVvdGVkOiBmYWxzZX0pO1xuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lUGlwZSkuY2FsbEZuKFtvLmxpdGVyYWxNYXAoZGVmaW5pdGlvbk1hcFZhbHVlcyldKTtcbiAgY29uc3QgdHlwZSA9IG5ldyBvLkV4cHJlc3Npb25UeXBlKG8uaW1wb3J0RXhwcihSMy5QaXBlRGVmLCBbXG4gICAgbmV3IG8uRXhwcmVzc2lvblR5cGUobWV0YWRhdGEudHlwZSksXG4gICAgbmV3IG8uRXhwcmVzc2lvblR5cGUobmV3IG8uTGl0ZXJhbEV4cHIobWV0YWRhdGEucGlwZU5hbWUpKSxcbiAgXSkpO1xuICByZXR1cm4ge2V4cHJlc3Npb24sIHR5cGUsIHN0YXRlbWVudHM6IHRlbXBsYXRlRmFjdG9yeS5zdGF0ZW1lbnRzfTtcbn1cblxuLyoqXG4gKiBXcml0ZSBhIHBpcGUgZGVmaW5pdGlvbiB0byB0aGUgb3V0cHV0IGNvbnRleHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlUGlwZUZyb21SZW5kZXIyKFxuICAgIG91dHB1dEN0eDogT3V0cHV0Q29udGV4dCwgcGlwZTogQ29tcGlsZVBpcGVNZXRhZGF0YSwgcmVmbGVjdG9yOiBDb21waWxlUmVmbGVjdG9yKSB7XG4gIGNvbnN0IGRlZmluaXRpb25NYXBWYWx1ZXM6IHtrZXk6IHN0cmluZywgcXVvdGVkOiBib29sZWFuLCB2YWx1ZTogby5FeHByZXNzaW9ufVtdID0gW107XG5cbiAgY29uc3QgbmFtZSA9IGlkZW50aWZpZXJOYW1lKHBpcGUudHlwZSk7XG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiBlcnJvcihgQ2Fubm90IHJlc29sdmUgdGhlIG5hbWUgb2YgJHtwaXBlLnR5cGV9YCk7XG4gIH1cblxuICBjb25zdCBtZXRhZGF0YTogUjNQaXBlTWV0YWRhdGEgPSB7XG4gICAgbmFtZSxcbiAgICBwaXBlTmFtZTogcGlwZS5uYW1lLFxuICAgIHR5cGU6IG91dHB1dEN0eC5pbXBvcnRFeHByKHBpcGUudHlwZS5yZWZlcmVuY2UpLFxuICAgIGRlcHM6IGRlcGVuZGVuY2llc0Zyb21HbG9iYWxNZXRhZGF0YShwaXBlLnR5cGUsIG91dHB1dEN0eCwgcmVmbGVjdG9yKSxcbiAgICBwdXJlOiBwaXBlLnB1cmUsXG4gIH07XG5cbiAgY29uc3QgcmVzID0gY29tcGlsZVBpcGVGcm9tTWV0YWRhdGEobWV0YWRhdGEpO1xuXG4gIGNvbnN0IGRlZmluaXRpb25GaWVsZCA9IG91dHB1dEN0eC5jb25zdGFudFBvb2wucHJvcGVydHlOYW1lT2YoRGVmaW5pdGlvbktpbmQuUGlwZSk7XG5cbiAgb3V0cHV0Q3R4LnN0YXRlbWVudHMucHVzaChuZXcgby5DbGFzc1N0bXQoXG4gICAgICAvKiBuYW1lICovIG5hbWUsXG4gICAgICAvKiBwYXJlbnQgKi8gbnVsbCxcbiAgICAgIC8qIGZpZWxkcyAqL1tuZXcgby5DbGFzc0ZpZWxkKFxuICAgICAgICAgIC8qIG5hbWUgKi8gZGVmaW5pdGlvbkZpZWxkLFxuICAgICAgICAgIC8qIHR5cGUgKi8gby5JTkZFUlJFRF9UWVBFLFxuICAgICAgICAgIC8qIG1vZGlmaWVycyAqL1tvLlN0bXRNb2RpZmllci5TdGF0aWNdLFxuICAgICAgICAgIC8qIGluaXRpYWxpemVyICovIHJlcy5leHByZXNzaW9uKV0sXG4gICAgICAvKiBnZXR0ZXJzICovW10sXG4gICAgICAvKiBjb25zdHJ1Y3Rvck1ldGhvZCAqLyBuZXcgby5DbGFzc01ldGhvZChudWxsLCBbXSwgW10pLFxuICAgICAgLyogbWV0aG9kcyAqL1tdKSk7XG59XG4iXX0=