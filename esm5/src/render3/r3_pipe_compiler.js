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
import { identifierName } from '../compile_metadata';
import * as o from '../output/output_ast';
import { error } from '../util';
import { Identifiers as R3 } from './r3_identifiers';
import { BUILD_OPTIMIZER_COLOCATE } from './r3_types';
import { createFactory } from './r3_view_compiler';
/**
 * Write a pipe definition to the output context.
 * @param {?} outputCtx
 * @param {?} pipe
 * @param {?} reflector
 * @param {?} mode
 * @return {?}
 */
export function compilePipe(outputCtx, pipe, reflector, mode) {
    var /** @type {?} */ definitionMapValues = [];
    // e.g. 'type: MyPipe`
    definitionMapValues.push({ key: 'type', value: outputCtx.importExpr(pipe.type.reference), quoted: false });
    // e.g. factory: function MyPipe_Factory() { return new MyPipe(); },
    var /** @type {?} */ templateFactory = createFactory(pipe.type, outputCtx, reflector, []);
    definitionMapValues.push({ key: 'factory', value: templateFactory, quoted: false });
    // e.g. pure: true
    if (pipe.pure) {
        definitionMapValues.push({ key: 'pure', value: o.literal(true), quoted: false });
    }
    var /** @type {?} */ className = /** @type {?} */ ((identifierName(pipe.type)));
    className || error("Cannot resolve the name of " + pipe.type);
    var /** @type {?} */ definitionField = outputCtx.constantPool.propertyNameOf(3 /* Pipe */);
    var /** @type {?} */ definitionFunction = o.importExpr(R3.definePipe).callFn([o.literalMap(definitionMapValues)]);
    if (mode === 0 /* PartialClass */) {
        outputCtx.statements.push(new o.ClassStmt(className, null, /* fields */ [new o.ClassField(definitionField, /* type */ o.INFERRED_TYPE, /* modifiers */ [o.StmtModifier.Static], definitionFunction)], /* getters */ [], /* constructorMethod */ new o.ClassMethod(null, [], []), /* methods */ []));
    }
    else {
        // Create back-patch definition.
        var /** @type {?} */ classReference = outputCtx.importExpr(pipe.type.reference);
        // Create the back-patch statement
        outputCtx.statements.push(new o.CommentStmt(BUILD_OPTIMIZER_COLOCATE), classReference.prop(definitionField).set(definitionFunction).toStmt());
    }
}
//# sourceMappingURL=r3_pipe_compiler.js.map