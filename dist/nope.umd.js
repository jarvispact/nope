(function(i,S){typeof exports=="object"&&typeof module<"u"?S(exports):typeof define=="function"&&define.amd?define(["exports"],S):(i=typeof globalThis<"u"?globalThis:i||self,S(i.Nope={}))})(this,function(i){"use strict";const S=e=>Object.keys(e),u=e=>typeof e=="object"&&!Array.isArray(e)&&e!==null&&!(e instanceof Date),C={maxArrayDisplayProperties:3,maxObjectDisplayProperties:3},y=(e,a)=>{const t={...C,...a};switch(typeof e){case"string":return`'${e}'`;case"number":case"boolean":return e.toString();case"object":{if(e===null)return"null";if(e instanceof Date)return"Date";if(Array.isArray(e)){const l=Math.max(0,e.length-t.maxArrayDisplayProperties),Se=e.slice(0,t.maxArrayDisplayProperties).map(he=>y(he,t)).join(", ");return e.length>0?`[ ${Se}${l>0?`, + ${l} more`:""} ]`:"[]"}const r=Object.keys(e),n=Math.max(0,r.length-t.maxObjectDisplayProperties),d=r.slice(0,t.maxObjectDisplayProperties).map(l=>`${l}: ${y(e[l],t)}`).join(", ");return r.length>0?`{ ${d}${n>0?`, + ${n} more`:""} }`:"{}"}case"undefined":return"undefined";default:return"unknown"}},f=e=>({status:"ERR",value:e}),g=e=>({status:"OK",value:e}),O=e=>e.status==="ERR",b=e=>e.status==="OK",K=e=>{if(O(e))throw new Error("Cannot not unwrap either");return e.value},k=(e,{onOk:a,onErr:t})=>b(e)?a(e.value):t(e.value),w=(e,{onOk:a,onErr:t})=>({eitherObject:e,onOk:a,onErr:t}),c=({code:e,message:a,details:t})=>(r,n)=>({code:e,message:a||`input: ${y(r)}, does not match the type of: '${n.displayString}'`,details:t?{...n,...t}:n}),s=e=>e,m=e=>a=>({is:t=>e.is(t)&&a.is(t),err:(t,r)=>e.is(t)?a.err(t,r):e.err(t,r)}),G=(e,a)=>o({uri:e.uri,create:e.create,validation:s({is:t=>e.is(t)&&a.every(r=>r.is(t)),err:(t,r)=>{if(!e.is(t))return e.err(t,r);const n=a.find(d=>!d.is(t));return n==null?void 0:n.err(t,r)}})}),o=({uri:e,displayString:a=e,create:t,validation:r})=>{const n=d=>r.is(d)?g(t(d)):f(r.err(d,{uri:e,displayString:a}));return{uri:e,displayString:a,is:r.is,create:t,err:r.err,validate:n}},_=e=>s({is:a=>Array.isArray(a)&&a.every(e.is),err:(a,t)=>Array.isArray(a)?c({code:"E_ARRAY_ITEM",details:{items:a.map(e.validate)}})(a,t):c({code:"E_ARRAY"})(a,t)}),Y=e=>o({uri:"ArraySchema",displayString:`ArraySchema( ${e.displayString} )`,create:a=>a,validation:_(e)}),A=s({is:e=>typeof e=="boolean",err:c({code:"E_BOOLEAN"})}),J=o({uri:"BooleanSchema",create:e=>e,validation:A}),N=s({is:e=>e instanceof Date&&e.toString()!=="Invalid Date",err:c({code:"E_DATE"})}),F=o({uri:"DateSchema",create:e=>e,validation:N}),h=s({is:e=>typeof e=="string",err:c({code:"E_STRING"})}),H=o({uri:"StringSchema",create:e=>String(e),validation:h}),X=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,T=m(h)({is:e=>X.test(e),err:c({code:"E_EMAIL"})}),q=o({uri:"EmailSchema",create:e=>e,validation:T}),E=s({is:e=>typeof e=="number"&&!Number.isNaN(e),err:c({code:"E_NUMBER"})}),z=o({uri:"NumberSchema",create:e=>Number(e),validation:E}),j=m(E)({is:e=>Number.isInteger(e),err:c({code:"E_INT"})}),Q=o({uri:"IntSchema",create:e=>e,validation:j}),V=e=>s({is:a=>a===e,err:c({code:"E_LITERAL",details:{literal:e}})}),W=e=>o({uri:"LiteralSchema",displayString:`LiteralSchema(${y(e)})`,create:a=>a,validation:V(e)}),I=s({is:e=>e===null,err:c({code:"E_NULL"})}),Z=o({uri:"NullSchema",create:e=>e,validation:I}),p=e=>{const t=Object.keys(e),r=Math.max(0,t.length-3),n=t.map(d=>`${d}: ${e[d].uri}`).slice(0,3).join(", ");return t.length>0?`ObjectSchema({ ${n}${r>0?`, + ${r} more`:""} })`:"ObjectSchema({})"},D=(e,a)=>{const t=Object.keys(a);return Object.keys(e).every(r=>t.includes(r))},U=(e,a)=>Object.keys(e)<Object.keys(a),x={failOnAdditionalProperties:!0},R=(e,a)=>{const t={...x,...a};return s({is:r=>!u(r)||!D(e,r)||t.failOnAdditionalProperties&&U(e,r)?!1:Object.keys(e).every(n=>e[n].is(r[n])),err:(r,n)=>u(r)?D(e,r)?t.failOnAdditionalProperties&&U(e,r)?c({code:"E_OBJECT_ADDITIONAL_KEYS"})(r,n):c({code:"E_OBJECT_PROPERTY",details:{properties:S(e).reduce((d,l)=>(d[l]=e[l].validate(r[l]),d),{})}})(r,n):c({code:"E_OBJECT_MISSING_KEYS"})(r,n):c({code:"E_OBJECT"})(r,n)})},ee=(e,a)=>o({uri:"ObjectSchema",displayString:p(e),create:t=>t,validation:R(e,a)}),$=e=>s({is:a=>u(a)&&Object.values(a).every(e.is),err:(a,t)=>u(a)?c({code:"E_RECORD_PROPERTY",details:{properties:S(a).reduce((r,n)=>(r[n]=e.validate(a[n]),r),{})}})(a,t):c({code:"E_RECORD"})(a,t)}),ae=e=>o({uri:"RecordSchema",displayString:`RecordSchema( ${e.displayString} )`,create:a=>a,validation:$(e)}),ie=e=>m(h)({is:a=>a.length>=e,err:c({code:`E_STRING_MIN_LENGTH_${e}`,details:{minLength:e}})}),te=e=>m(h)({is:a=>a.length<=e,err:c({code:`E_STRING_MAX_LENGTH_${e}`,details:{maxLength:e}})}),re=e=>m(h)({is:a=>e.test(a),err:c({code:"E_STRING_MATCHES",details:{regex:e}})}),v=e=>s({is:a=>Array.isArray(a)&&e.every((t,r)=>t.is(a[r])),err:(a,t)=>Array.isArray(a)?c({code:"E_TUPLE_ITEM",details:{items:e.map((r,n)=>r.validate(a[n]))}})(a,t):c({code:"E_TUPLE"})(a,t)}),ne=(...e)=>o({uri:"TupleSchema",displayString:`TupleSchema( [ ${e.map(a=>a.displayString).join(", ")} ] )`,create:a=>a,validation:v(e)}),P=m(E)({is:e=>Number.isInteger(e)&&e>=0,err:c({code:"E_UINT"})}),ce=o({uri:"UIntSchema",create:e=>e,validation:P}),M=s({is:e=>e===void 0,err:c({code:"E_UNDEFINED"})}),oe=o({uri:"UndefinedSchema",create:e=>e,validation:M}),se=e=>`UnionSchema( ${e.map(a=>a.displayString).join(" | ")} )`,L=e=>s({is:a=>e.some(t=>t.is(a)),err:c({code:"E_UNION"})}),de=e=>{if(e.length<=1)throw new Error("a UnionSchemas list argument must have a length of at least 2");return o({uri:"UnionSchema",displayString:se(e),create:a=>a,validation:L(e)})},le=/^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i,B=m(h)({is:e=>le.test(e),err:c({code:"E_UUID"})}),me=o({uri:"UuidSchema",create:e=>e,validation:B});i.ArraySchema=Y,i.ArrayValidation=_,i.BooleanSchema=J,i.BooleanValidation=A,i.DateSchema=F,i.DateValidation=N,i.EmailSchema=q,i.EmailValidation=T,i.IntSchema=Q,i.IntValidation=j,i.LiteralSchema=W,i.LiteralValidation=V,i.NullSchema=Z,i.NullValidation=I,i.NumberSchema=z,i.NumberValidation=E,i.ObjectSchema=ee,i.ObjectValidation=R,i.RecordSchema=ae,i.RecordValidation=$,i.StringMatches=re,i.StringMaxLength=te,i.StringMinLength=ie,i.StringSchema=H,i.StringValidation=h,i.TupleSchema=ne,i.TupleValidation=v,i.UIntSchema=ce,i.UIntValidation=P,i.UndefinedSchema=oe,i.UndefinedValidation=M,i.UnionSchema=de,i.UnionValidation=L,i.UuidSchema=me,i.UuidValidation=B,i.createError=c,i.err=f,i.extendValidation=m,i.inputToDisplayString=y,i.isErr=O,i.isObject=u,i.isOk=b,i.matchEither=k,i.matchObjectProperties=w,i.objectKeys=S,i.ok=g,i.schema=o,i.unwrapEither=K,i.validation=s,i.withValidations=G,Object.defineProperties(i,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
