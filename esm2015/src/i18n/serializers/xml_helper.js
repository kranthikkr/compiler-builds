/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class _Visitor {
    visitTag(tag) {
        const strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length == 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        const strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join('')}</${tag.name}>`;
    }
    visitText(text) { return text.value; }
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    _serializeAttributes(attrs) {
        const strAttrs = Object.keys(attrs).map((name) => `${name}="${attrs[name]}"`).join(' ');
        return strAttrs.length > 0 ? ' ' + strAttrs : '';
    }
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
const _visitor = new _Visitor();
export function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join('');
}
export class Declaration {
    constructor(unescapedAttrs) {
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) { return visitor.visitDeclaration(this); }
}
export class Doctype {
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    visit(visitor) { return visitor.visitDoctype(this); }
}
export class Tag {
    constructor(name, unescapedAttrs = {}, children = []) {
        this.name = name;
        this.children = children;
        this.attrs = {};
        Object.keys(unescapedAttrs).forEach((k) => {
            this.attrs[k] = escapeXml(unescapedAttrs[k]);
        });
    }
    visit(visitor) { return visitor.visitTag(this); }
}
export class Text {
    constructor(unescapedValue) { this.value = escapeXml(unescapedValue); }
    visit(visitor) { return visitor.visitText(this); }
}
export class CR extends Text {
    constructor(ws = 0) { super(`\n${new Array(ws + 1).join(' ')}`); }
}
const _ESCAPED_CHARS = [
    [/&/g, '&amp;'],
    [/"/g, '&quot;'],
    [/'/g, '&apos;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
];
// Escape `_ESCAPED_CHARS` characters in the given text with encoded entities
export function escapeXml(text) {
    return _ESCAPED_CHARS.reduce((text, entry) => text.replace(entry[0], entry[1]), text);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX2hlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3htbF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBU0gsTUFBTSxRQUFRO0lBQ1osUUFBUSxDQUFDLEdBQVE7UUFDZixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRELElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsSUFBSSxDQUFDO1NBQ3BDO1FBRUQsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0QsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBVSxJQUFZLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFcEQsZ0JBQWdCLENBQUMsSUFBaUI7UUFDaEMsT0FBTyxRQUFRLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM1RCxDQUFDO0lBRU8sb0JBQW9CLENBQUMsS0FBNEI7UUFDdkQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLEdBQUcs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SUFDZixDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7SUFDaEIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO0lBQ2hCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztJQUNkLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztDQUNmLENBQUM7QUFFRiw2RUFBNkU7QUFDN0UsTUFBTSxVQUFVLFNBQVMsQ0FBQyxJQUFZO0lBQ3BDLE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FDeEIsQ0FBQyxJQUFZLEVBQUUsS0FBdUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJVmlzaXRvciB7XG4gIHZpc2l0VGFnKHRhZzogVGFnKTogYW55O1xuICB2aXNpdFRleHQodGV4dDogVGV4dCk6IGFueTtcbiAgdmlzaXREZWNsYXJhdGlvbihkZWNsOiBEZWNsYXJhdGlvbik6IGFueTtcbiAgdmlzaXREb2N0eXBlKGRvY3R5cGU6IERvY3R5cGUpOiBhbnk7XG59XG5cbmNsYXNzIF9WaXNpdG9yIGltcGxlbWVudHMgSVZpc2l0b3Ige1xuICB2aXNpdFRhZyh0YWc6IFRhZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RyQXR0cnMgPSB0aGlzLl9zZXJpYWxpemVBdHRyaWJ1dGVzKHRhZy5hdHRycyk7XG5cbiAgICBpZiAodGFnLmNoaWxkcmVuLmxlbmd0aCA9PSAwKSB7XG4gICAgICByZXR1cm4gYDwke3RhZy5uYW1lfSR7c3RyQXR0cnN9Lz5gO1xuICAgIH1cblxuICAgIGNvbnN0IHN0ckNoaWxkcmVuID0gdGFnLmNoaWxkcmVuLm1hcChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICAgIHJldHVybiBgPCR7dGFnLm5hbWV9JHtzdHJBdHRyc30+JHtzdHJDaGlsZHJlbi5qb2luKCcnKX08LyR7dGFnLm5hbWV9PmA7XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogVGV4dCk6IHN0cmluZyB7IHJldHVybiB0ZXh0LnZhbHVlOyB9XG5cbiAgdmlzaXREZWNsYXJhdGlvbihkZWNsOiBEZWNsYXJhdGlvbik6IHN0cmluZyB7XG4gICAgcmV0dXJuIGA8P3htbCR7dGhpcy5fc2VyaWFsaXplQXR0cmlidXRlcyhkZWNsLmF0dHJzKX0gPz5gO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2VyaWFsaXplQXR0cmlidXRlcyhhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9KSB7XG4gICAgY29uc3Qgc3RyQXR0cnMgPSBPYmplY3Qua2V5cyhhdHRycykubWFwKChuYW1lOiBzdHJpbmcpID0+IGAke25hbWV9PVwiJHthdHRyc1tuYW1lXX1cImApLmpvaW4oJyAnKTtcbiAgICByZXR1cm4gc3RyQXR0cnMubGVuZ3RoID4gMCA/ICcgJyArIHN0ckF0dHJzIDogJyc7XG4gIH1cblxuICB2aXNpdERvY3R5cGUoZG9jdHlwZTogRG9jdHlwZSk6IGFueSB7XG4gICAgcmV0dXJuIGA8IURPQ1RZUEUgJHtkb2N0eXBlLnJvb3RUYWd9IFtcXG4ke2RvY3R5cGUuZHRkfVxcbl0+YDtcbiAgfVxufVxuXG5jb25zdCBfdmlzaXRvciA9IG5ldyBfVmlzaXRvcigpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKG5vZGVzOiBOb2RlW10pOiBzdHJpbmcge1xuICByZXR1cm4gbm9kZXMubWFwKChub2RlOiBOb2RlKTogc3RyaW5nID0+IG5vZGUudmlzaXQoX3Zpc2l0b3IpKS5qb2luKCcnKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBOb2RlIHsgdmlzaXQodmlzaXRvcjogSVZpc2l0b3IpOiBhbnk7IH1cblxuZXhwb3J0IGNsYXNzIERlY2xhcmF0aW9uIGltcGxlbWVudHMgTm9kZSB7XG4gIHB1YmxpYyBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgY29uc3RydWN0b3IodW5lc2NhcGVkQXR0cnM6IHtbazogc3RyaW5nXTogc3RyaW5nfSkge1xuICAgIE9iamVjdC5rZXlzKHVuZXNjYXBlZEF0dHJzKS5mb3JFYWNoKChrOiBzdHJpbmcpID0+IHtcbiAgICAgIHRoaXMuYXR0cnNba10gPSBlc2NhcGVYbWwodW5lc2NhcGVkQXR0cnNba10pO1xuICAgIH0pO1xuICB9XG5cbiAgdmlzaXQodmlzaXRvcjogSVZpc2l0b3IpOiBhbnkgeyByZXR1cm4gdmlzaXRvci52aXNpdERlY2xhcmF0aW9uKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBEb2N0eXBlIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb290VGFnOiBzdHJpbmcsIHB1YmxpYyBkdGQ6IHN0cmluZykge31cblxuICB2aXNpdCh2aXNpdG9yOiBJVmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0RG9jdHlwZSh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgVGFnIGltcGxlbWVudHMgTm9kZSB7XG4gIHB1YmxpYyBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgbmFtZTogc3RyaW5nLCB1bmVzY2FwZWRBdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge30sXG4gICAgICBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXSA9IFtdKSB7XG4gICAgT2JqZWN0LmtleXModW5lc2NhcGVkQXR0cnMpLmZvckVhY2goKGs6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy5hdHRyc1trXSA9IGVzY2FwZVhtbCh1bmVzY2FwZWRBdHRyc1trXSk7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdCh2aXNpdG9yOiBJVmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0VGFnKHRoaXMpOyB9XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGltcGxlbWVudHMgTm9kZSB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHVuZXNjYXBlZFZhbHVlOiBzdHJpbmcpIHsgdGhpcy52YWx1ZSA9IGVzY2FwZVhtbCh1bmVzY2FwZWRWYWx1ZSk7IH1cblxuICB2aXNpdCh2aXNpdG9yOiBJVmlzaXRvcik6IGFueSB7IHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dCh0aGlzKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgQ1IgZXh0ZW5kcyBUZXh0IHtcbiAgY29uc3RydWN0b3Iod3M6IG51bWJlciA9IDApIHsgc3VwZXIoYFxcbiR7bmV3IEFycmF5KHdzICsgMSkuam9pbignICcpfWApOyB9XG59XG5cbmNvbnN0IF9FU0NBUEVEX0NIQVJTOiBbUmVnRXhwLCBzdHJpbmddW10gPSBbXG4gIFsvJi9nLCAnJmFtcDsnXSxcbiAgWy9cIi9nLCAnJnF1b3Q7J10sXG4gIFsvJy9nLCAnJmFwb3M7J10sXG4gIFsvPC9nLCAnJmx0OyddLFxuICBbLz4vZywgJyZndDsnXSxcbl07XG5cbi8vIEVzY2FwZSBgX0VTQ0FQRURfQ0hBUlNgIGNoYXJhY3RlcnMgaW4gdGhlIGdpdmVuIHRleHQgd2l0aCBlbmNvZGVkIGVudGl0aWVzXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlWG1sKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBfRVNDQVBFRF9DSEFSUy5yZWR1Y2UoXG4gICAgICAodGV4dDogc3RyaW5nLCBlbnRyeTogW1JlZ0V4cCwgc3RyaW5nXSkgPT4gdGV4dC5yZXBsYWNlKGVudHJ5WzBdLCBlbnRyeVsxXSksIHRleHQpO1xufVxuIl19