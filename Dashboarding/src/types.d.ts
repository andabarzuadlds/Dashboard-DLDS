declare global {
    interface Array<T>
    {toSorted(compareFn?: (a: TemplateStringsArray, b: T) => number): T[]}
}
export interface Page {
    current_page:   number;
    data:           Datum[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}
export interface Status {
    id:             number;
    name_state:     string;
    prestashop_status_id: number;
}

export interface Order {
    id:                  number;
    code:                string;
    prestashop_order_id: number;
    total:               number;
    status:              number;
    user_id:             number;
    customer_id:         number;
    date_add:            string;
    carrier_id:          number;
    prestashop_id:       number;
    created_at:          null;
    updated_at:          null;
    name:                string;
    delay:               string;
    name:                string;
    company:             string;
    name_state:          string;
    key:                 string;
    direction:           string;
    vendedor:            string;
    status:              string;

}
export interface Customer {
    id:                  number;
    name:                string;
    company:             string;
    email:               string;
    prestashop_id:       number;
    vendedor:            string;

}


export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
export enum SortBy {
    prestashop_order_id = 'prestashop_order_id',
    Cliente = 'cliente',
    Estado = 'state',
    fecha = 'date_add',
    total = 'total'
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toWelcome(json: string): Welcome {
        return cast(JSON.parse(json), r("Welcome"));
    }

    public static welcomeToJson(value: Welcome): string {
        return JSON.stringify(uncast(value, r("Welcome")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Welcome": o([
        { json: "current_page", js: "current_page", typ: 0 },
        { json: "data", js: "data", typ: a(r("Datum")) },
        { json: "first_page_url", js: "first_page_url", typ: "" },
        { json: "from", js: "from", typ: 0 },
        { json: "last_page", js: "last_page", typ: 0 },
        { json: "last_page_url", js: "last_page_url", typ: "" },
        { json: "links", js: "links", typ: a(r("Link")) },
        { json: "next_page_url", js: "next_page_url", typ: "" },
        { json: "path", js: "path", typ: "" },
        { json: "per_page", js: "per_page", typ: 0 },
        { json: "prev_page_url", js: "prev_page_url", typ: null },
        { json: "to", js: "to", typ: 0 },
        { json: "total", js: "total", typ: 0 },
    ], false),
    "Datum": o([
        { json: "id", js: "id", typ: 0 },
        { json: "code", js: "code", typ: "" },
        { json: "prestashop_order_id", js: "prestashop_order_id", typ: 0 },
        { json: "total", js: "total", typ: 3.14 },
        { json: "status", js: "status", typ: 0 },
        { json: "user_id", js: "user_id", typ: 0 },
        { json: "customer_id", js: "customer_id", typ: 0 },
        { json: "date_add", js: "date_add", typ: Date },
        { json: "carrier_id", js: "carrier_id", typ: 0 },
        { json: "prestashop_id", js: "prestashop_id", typ: 0 },
        { json: "created_at", js: "created_at", typ: null },
        { json: "updated_at", js: "updated_at", typ: null },
        { json: "name", js: "name", typ: "" },
        { json: "delay", js: "delay", typ: "" },
    ], false),
    "Link": o([
        { json: "url", js: "url", typ: u(null, "") },
        { json: "label", js: "label", typ: "" },
        { json: "active", js: "active", typ: true },
    ], false),
};
