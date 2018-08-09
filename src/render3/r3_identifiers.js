/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/render3/r3_identifiers", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CORE = '@angular/core';
    var Identifiers = /** @class */ (function () {
        function Identifiers() {
        }
        /* Methods */
        Identifiers.NEW_METHOD = 'factory';
        Identifiers.TRANSFORM_METHOD = 'transform';
        Identifiers.PATCH_DEPS = 'patchedDeps';
        /* Instructions */
        Identifiers.namespaceHTML = { name: 'ɵNH', moduleName: CORE };
        Identifiers.namespaceMathML = { name: 'ɵNM', moduleName: CORE };
        Identifiers.namespaceSVG = { name: 'ɵNS', moduleName: CORE };
        Identifiers.element = { name: 'ɵEe', moduleName: CORE };
        Identifiers.elementStart = { name: 'ɵE', moduleName: CORE };
        Identifiers.elementEnd = { name: 'ɵe', moduleName: CORE };
        Identifiers.elementProperty = { name: 'ɵp', moduleName: CORE };
        Identifiers.elementAttribute = { name: 'ɵa', moduleName: CORE };
        Identifiers.elementClassProp = { name: 'ɵcp', moduleName: CORE };
        Identifiers.elementStyling = { name: 'ɵs', moduleName: CORE };
        Identifiers.elementStylingMap = { name: 'ɵsm', moduleName: CORE };
        Identifiers.elementStyleProp = { name: 'ɵsp', moduleName: CORE };
        Identifiers.elementStylingApply = { name: 'ɵsa', moduleName: CORE };
        Identifiers.containerCreate = { name: 'ɵC', moduleName: CORE };
        Identifiers.nextContext = { name: 'ɵx', moduleName: CORE };
        Identifiers.text = { name: 'ɵT', moduleName: CORE };
        Identifiers.textBinding = { name: 'ɵt', moduleName: CORE };
        Identifiers.bind = { name: 'ɵb', moduleName: CORE };
        Identifiers.getCurrentView = { name: 'ɵgV', moduleName: CORE };
        Identifiers.restoreView = { name: 'ɵrV', moduleName: CORE };
        Identifiers.interpolation1 = { name: 'ɵi1', moduleName: CORE };
        Identifiers.interpolation2 = { name: 'ɵi2', moduleName: CORE };
        Identifiers.interpolation3 = { name: 'ɵi3', moduleName: CORE };
        Identifiers.interpolation4 = { name: 'ɵi4', moduleName: CORE };
        Identifiers.interpolation5 = { name: 'ɵi5', moduleName: CORE };
        Identifiers.interpolation6 = { name: 'ɵi6', moduleName: CORE };
        Identifiers.interpolation7 = { name: 'ɵi7', moduleName: CORE };
        Identifiers.interpolation8 = { name: 'ɵi8', moduleName: CORE };
        Identifiers.interpolationV = { name: 'ɵiV', moduleName: CORE };
        Identifiers.pureFunction0 = { name: 'ɵf0', moduleName: CORE };
        Identifiers.pureFunction1 = { name: 'ɵf1', moduleName: CORE };
        Identifiers.pureFunction2 = { name: 'ɵf2', moduleName: CORE };
        Identifiers.pureFunction3 = { name: 'ɵf3', moduleName: CORE };
        Identifiers.pureFunction4 = { name: 'ɵf4', moduleName: CORE };
        Identifiers.pureFunction5 = { name: 'ɵf5', moduleName: CORE };
        Identifiers.pureFunction6 = { name: 'ɵf6', moduleName: CORE };
        Identifiers.pureFunction7 = { name: 'ɵf7', moduleName: CORE };
        Identifiers.pureFunction8 = { name: 'ɵf8', moduleName: CORE };
        Identifiers.pureFunctionV = { name: 'ɵfV', moduleName: CORE };
        Identifiers.pipeBind1 = { name: 'ɵpb1', moduleName: CORE };
        Identifiers.pipeBind2 = { name: 'ɵpb2', moduleName: CORE };
        Identifiers.pipeBind3 = { name: 'ɵpb3', moduleName: CORE };
        Identifiers.pipeBind4 = { name: 'ɵpb4', moduleName: CORE };
        Identifiers.pipeBindV = { name: 'ɵpbV', moduleName: CORE };
        Identifiers.load = { name: 'ɵld', moduleName: CORE };
        Identifiers.loadDirective = { name: 'ɵd', moduleName: CORE };
        Identifiers.loadQueryList = { name: 'ɵql', moduleName: CORE };
        Identifiers.pipe = { name: 'ɵPp', moduleName: CORE };
        Identifiers.projection = { name: 'ɵP', moduleName: CORE };
        Identifiers.projectionDef = { name: 'ɵpD', moduleName: CORE };
        Identifiers.reference = { name: 'ɵr', moduleName: CORE };
        Identifiers.inject = { name: 'inject', moduleName: CORE };
        Identifiers.injectAttribute = { name: 'ɵinjectAttribute', moduleName: CORE };
        Identifiers.injectElementRef = { name: 'ɵinjectElementRef', moduleName: CORE };
        Identifiers.injectTemplateRef = { name: 'ɵinjectTemplateRef', moduleName: CORE };
        Identifiers.injectViewContainerRef = { name: 'ɵinjectViewContainerRef', moduleName: CORE };
        Identifiers.injectChangeDetectorRef = { name: 'ɵinjectChangeDetectorRef', moduleName: CORE };
        Identifiers.directiveInject = { name: 'ɵdirectiveInject', moduleName: CORE };
        Identifiers.defineComponent = { name: 'ɵdefineComponent', moduleName: CORE };
        Identifiers.ComponentDef = {
            name: 'ɵComponentDef',
            moduleName: CORE,
        };
        Identifiers.defineDirective = {
            name: 'ɵdefineDirective',
            moduleName: CORE,
        };
        Identifiers.DirectiveDef = {
            name: 'ɵDirectiveDef',
            moduleName: CORE,
        };
        Identifiers.InjectorDef = {
            name: 'ɵInjectorDef',
            moduleName: CORE,
        };
        Identifiers.defineInjector = {
            name: 'defineInjector',
            moduleName: CORE,
        };
        Identifiers.NgModuleDef = {
            name: 'ɵNgModuleDef',
            moduleName: CORE,
        };
        Identifiers.defineNgModule = { name: 'ɵdefineNgModule', moduleName: CORE };
        Identifiers.PipeDef = { name: 'ɵPipeDef', moduleName: CORE };
        Identifiers.definePipe = { name: 'ɵdefinePipe', moduleName: CORE };
        Identifiers.query = { name: 'ɵQ', moduleName: CORE };
        Identifiers.queryRefresh = { name: 'ɵqR', moduleName: CORE };
        Identifiers.registerContentQuery = { name: 'ɵQr', moduleName: CORE };
        Identifiers.NgOnChangesFeature = { name: 'ɵNgOnChangesFeature', moduleName: CORE };
        Identifiers.InheritDefinitionFeature = { name: 'ɵInheritDefinitionFeature', moduleName: CORE };
        Identifiers.PublicFeature = { name: 'ɵPublicFeature', moduleName: CORE };
        Identifiers.listener = { name: 'ɵL', moduleName: CORE };
        Identifiers.getFactoryOf = {
            name: 'ɵgetFactoryOf',
            moduleName: CORE,
        };
        Identifiers.getInheritedFactory = {
            name: 'ɵgetInheritedFactory',
            moduleName: CORE,
        };
        // Reserve slots for pure functions
        Identifiers.reserveSlots = { name: 'ɵrS', moduleName: CORE };
        // sanitization-related functions
        Identifiers.sanitizeHtml = { name: 'ɵzh', moduleName: CORE };
        Identifiers.sanitizeStyle = { name: 'ɵzs', moduleName: CORE };
        Identifiers.defaultStyleSanitizer = { name: 'ɵzss', moduleName: CORE };
        Identifiers.sanitizeResourceUrl = { name: 'ɵzr', moduleName: CORE };
        Identifiers.sanitizeScript = { name: 'ɵzc', moduleName: CORE };
        Identifiers.sanitizeUrl = { name: 'ɵzu', moduleName: CORE };
        return Identifiers;
    }());
    exports.Identifiers = Identifiers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfaWRlbnRpZmllcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy9yM19pZGVudGlmaWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUlILElBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQztJQUU3QjtRQUFBO1FBNEtBLENBQUM7UUEzS0MsYUFBYTtRQUNOLHNCQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ3ZCLDRCQUFnQixHQUFHLFdBQVcsQ0FBQztRQUMvQixzQkFBVSxHQUFHLGFBQWEsQ0FBQztRQUVsQyxrQkFBa0I7UUFDWCx5QkFBYSxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRXJFLDJCQUFlLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFdkUsd0JBQVksR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUVwRSxtQkFBTyxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRS9ELHdCQUFZLEdBQXdCLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFbkUsc0JBQVUsR0FBd0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUVqRSwyQkFBZSxHQUF3QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRXRFLDRCQUFnQixHQUF3QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRXZFLDRCQUFnQixHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRXhFLDBCQUFjLEdBQXdCLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFckUsNkJBQWlCLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFekUsNEJBQWdCLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFeEUsK0JBQW1CLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFM0UsMkJBQWUsR0FBd0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUV0RSx1QkFBVyxHQUF3QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRWxFLGdCQUFJLEdBQXdCLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFM0QsdUJBQVcsR0FBd0IsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUVsRSxnQkFBSSxHQUF3QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRTNELDBCQUFjLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFdEUsdUJBQVcsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUVuRSwwQkFBYyxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RFLDBCQUFjLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdEUsMEJBQWMsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN0RSwwQkFBYyxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RFLDBCQUFjLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdEUsMEJBQWMsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN0RSwwQkFBYyxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RFLDBCQUFjLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDdEUsMEJBQWMsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUV0RSx5QkFBYSxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3JFLHlCQUFhLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDckUseUJBQWEsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUNyRSx5QkFBYSxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3JFLHlCQUFhLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDckUseUJBQWEsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxF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QVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUVoRixvQkFBUSxHQUF3QixFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBRS9ELHdCQUFZLEdBQXdCO1lBQ3pDLElBQUksRUFBRSxlQUFlO1lBQ3JCLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUM7UUFFSywrQkFBbUIsR0FBd0I7WUFDaEQsSUFBSSxFQUFFLHNCQUFzQjtZQUM1QixVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDO1FBRUYsbUNBQW1DO1FBQzVCLHdCQUFZLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFFM0UsaUNBQWlDO1FBQzFCLHdCQUFZLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDcEUseUJBQWEsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUNyRSxpQ0FBcUIsR0FBd0IsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUM5RSwrQkFBbUIsR0FBd0IsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUMzRSwwQkFBYyxHQUF3QixFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3RFLHVCQUFXLEdBQXdCLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDNUUsa0JBQUM7S0FBQSxBQTVLRCxJQTRLQztJQTVLWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5cbmNvbnN0IENPUkUgPSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBjbGFzcyBJZGVudGlmaWVycyB7XG4gIC8qIE1ldGhvZHMgKi9cbiAgc3RhdGljIE5FV19NRVRIT0QgPSAnZmFjdG9yeSc7XG4gIHN0YXRpYyBUUkFOU0ZPUk1fTUVUSE9EID0gJ3RyYW5zZm9ybSc7XG4gIHN0YXRpYyBQQVRDSF9ERVBTID0gJ3BhdGNoZWREZXBzJztcblxuICAvKiBJbnN0cnVjdGlvbnMgKi9cbiAgc3RhdGljIG5hbWVzcGFjZUhUTUw6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1TkgnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgbmFtZXNwYWNlTWF0aE1MOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtU5NJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIG5hbWVzcGFjZVNWRzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVOUycsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBlbGVtZW50OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtUVlJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIGVsZW1lbnRTdGFydDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVFJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIGVsZW1lbnRFbmQ6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBlbGVtZW50UHJvcGVydHk6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1cCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBlbGVtZW50QXR0cmlidXRlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWEnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgZWxlbWVudENsYXNzUHJvcDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVjcCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBlbGVtZW50U3R5bGluZzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVzJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIGVsZW1lbnRTdHlsaW5nTWFwOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXNtJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIGVsZW1lbnRTdHlsZVByb3A6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1c3AnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgZWxlbWVudFN0eWxpbmdBcHBseTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVzYScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBjb250YWluZXJDcmVhdGU6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1QycsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBuZXh0Q29udGV4dDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybV4JywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIHRleHQ6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1VCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyB0ZXh0QmluZGluZzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybV0JywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIGJpbmQ6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1YicsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBnZXRDdXJyZW50Vmlldzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVnVicsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyByZXN0b3JlVmlldzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVyVicsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBpbnRlcnBvbGF0aW9uMTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVpMScsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgaW50ZXJwb2xhdGlvbjI6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aTInLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIGludGVycG9sYXRpb24zOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWkzJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBpbnRlcnBvbGF0aW9uNDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVpNCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgaW50ZXJwb2xhdGlvbjU6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aTUnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIGludGVycG9sYXRpb242OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWk2JywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBpbnRlcnBvbGF0aW9uNzogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVpNycsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgaW50ZXJwb2xhdGlvbjg6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aTgnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIGludGVycG9sYXRpb25WOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWlWJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIHB1cmVGdW5jdGlvbjA6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjAnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjE6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjEnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjI6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjInLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjM6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjMnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjQ6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjQnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjU6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjUnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjc6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjcnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvbjg6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZjgnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHB1cmVGdW5jdGlvblY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZlYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgcGlwZUJpbmQxOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXBiMScsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgcGlwZUJpbmQyOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXBiMicsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgcGlwZUJpbmQzOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXBiMycsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgcGlwZUJpbmQ0OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXBiNCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgcGlwZUJpbmRWOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXBiVicsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBsb2FkOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWxkJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBsb2FkRGlyZWN0aXZlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWQnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIGxvYWRRdWVyeUxpc3Q6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1cWwnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgcGlwZTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVQcCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBwcm9qZWN0aW9uOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtVAnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHByb2plY3Rpb25EZWY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1cEQnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgcmVmZXJlbmNlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXInLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgaW5qZWN0OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICdpbmplY3QnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgaW5qZWN0QXR0cmlidXRlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWluamVjdEF0dHJpYnV0ZScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBpbmplY3RFbGVtZW50UmVmOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWluamVjdEVsZW1lbnRSZWYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgaW5qZWN0VGVtcGxhdGVSZWY6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aW5qZWN0VGVtcGxhdGVSZWYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgaW5qZWN0Vmlld0NvbnRhaW5lclJlZjpcbiAgICAgIG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aW5qZWN0Vmlld0NvbnRhaW5lclJlZicsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBpbmplY3RDaGFuZ2VEZXRlY3RvclJlZjpcbiAgICAgIG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1aW5qZWN0Q2hhbmdlRGV0ZWN0b3JSZWYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgZGlyZWN0aXZlSW5qZWN0OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtWRpcmVjdGl2ZUluamVjdCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBkZWZpbmVDb21wb25lbnQ6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1ZGVmaW5lQ29tcG9uZW50JywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIENvbXBvbmVudERlZjogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtcbiAgICBuYW1lOiAnybVDb21wb25lbnREZWYnLFxuICAgIG1vZHVsZU5hbWU6IENPUkUsXG4gIH07XG5cbiAgc3RhdGljIGRlZmluZURpcmVjdGl2ZTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtcbiAgICBuYW1lOiAnybVkZWZpbmVEaXJlY3RpdmUnLFxuICAgIG1vZHVsZU5hbWU6IENPUkUsXG4gIH07XG5cbiAgc3RhdGljIERpcmVjdGl2ZURlZjogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtcbiAgICBuYW1lOiAnybVEaXJlY3RpdmVEZWYnLFxuICAgIG1vZHVsZU5hbWU6IENPUkUsXG4gIH07XG5cbiAgc3RhdGljIEluamVjdG9yRGVmOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge1xuICAgIG5hbWU6ICfJtUluamVjdG9yRGVmJyxcbiAgICBtb2R1bGVOYW1lOiBDT1JFLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZpbmVJbmplY3Rvcjogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtcbiAgICBuYW1lOiAnZGVmaW5lSW5qZWN0b3InLFxuICAgIG1vZHVsZU5hbWU6IENPUkUsXG4gIH07XG5cbiAgc3RhdGljIE5nTW9kdWxlRGVmOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge1xuICAgIG5hbWU6ICfJtU5nTW9kdWxlRGVmJyxcbiAgICBtb2R1bGVOYW1lOiBDT1JFLFxuICB9O1xuXG4gIHN0YXRpYyBkZWZpbmVOZ01vZHVsZTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVkZWZpbmVOZ01vZHVsZScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBQaXBlRGVmOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtVBpcGVEZWYnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgZGVmaW5lUGlwZTogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVkZWZpbmVQaXBlJywgbW9kdWxlTmFtZTogQ09SRX07XG5cbiAgc3RhdGljIHF1ZXJ5OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtVEnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbiAgc3RhdGljIHF1ZXJ5UmVmcmVzaDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVxUicsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgcmVnaXN0ZXJDb250ZW50UXVlcnk6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1UXInLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgTmdPbkNoYW5nZXNGZWF0dXJlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtU5nT25DaGFuZ2VzRmVhdHVyZScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBJbmhlcml0RGVmaW5pdGlvbkZlYXR1cmU6XG4gICAgICBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtUluaGVyaXREZWZpbml0aW9uRmVhdHVyZScsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBQdWJsaWNGZWF0dXJlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtVB1YmxpY0ZlYXR1cmUnLCBtb2R1bGVOYW1lOiBDT1JFfTtcblxuICBzdGF0aWMgbGlzdGVuZXI6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1TCcsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIHN0YXRpYyBnZXRGYWN0b3J5T2Y6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7XG4gICAgbmFtZTogJ8m1Z2V0RmFjdG9yeU9mJyxcbiAgICBtb2R1bGVOYW1lOiBDT1JFLFxuICB9O1xuXG4gIHN0YXRpYyBnZXRJbmhlcml0ZWRGYWN0b3J5OiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge1xuICAgIG5hbWU6ICfJtWdldEluaGVyaXRlZEZhY3RvcnknLFxuICAgIG1vZHVsZU5hbWU6IENPUkUsXG4gIH07XG5cbiAgLy8gUmVzZXJ2ZSBzbG90cyBmb3IgcHVyZSBmdW5jdGlvbnNcbiAgc3RhdGljIHJlc2VydmVTbG90czogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybVyUycsIG1vZHVsZU5hbWU6IENPUkV9O1xuXG4gIC8vIHNhbml0aXphdGlvbi1yZWxhdGVkIGZ1bmN0aW9uc1xuICBzdGF0aWMgc2FuaXRpemVIdG1sOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXpoJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBzYW5pdGl6ZVN0eWxlOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXpzJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBkZWZhdWx0U3R5bGVTYW5pdGl6ZXI6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1enNzJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBzYW5pdGl6ZVJlc291cmNlVXJsOiBvLkV4dGVybmFsUmVmZXJlbmNlID0ge25hbWU6ICfJtXpyJywgbW9kdWxlTmFtZTogQ09SRX07XG4gIHN0YXRpYyBzYW5pdGl6ZVNjcmlwdDogby5FeHRlcm5hbFJlZmVyZW5jZSA9IHtuYW1lOiAnybV6YycsIG1vZHVsZU5hbWU6IENPUkV9O1xuICBzdGF0aWMgc2FuaXRpemVVcmw6IG8uRXh0ZXJuYWxSZWZlcmVuY2UgPSB7bmFtZTogJ8m1enUnLCBtb2R1bGVOYW1lOiBDT1JFfTtcbn1cbiJdfQ==