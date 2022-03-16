var nr=Object.defineProperty,sr=Object.defineProperties;var ar=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var ir=Object.prototype.hasOwnProperty,lr=Object.prototype.propertyIsEnumerable;var U=(n,o,s)=>o in n?nr(n,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[o]=s,D=(n,o)=>{for(var s in o||(o={}))ir.call(o,s)&&U(n,s,o[s]);if(P)for(var s of P(o))lr.call(o,s)&&U(n,s,o[s]);return n},j=(n,o)=>sr(n,ar(o));(function(n,o){typeof exports=="object"&&typeof module!="undefined"?o(exports):typeof define=="function"&&define.amd?define(["exports"],o):(n=typeof globalThis!="undefined"?globalThis:n||self,o(n.Nope={}))})(this,function(n){"use strict";const o=r=>({status:"SUCCESS",value:r}),s=r=>({status:"FAILURE",value:r}),l=(r,e,t,a={})=>({uri:r,code:e,message:t,details:a}),u=({uri:r,is:e,create:t,validate:a,serialize:d})=>({I:null,O:null,E:null,uri:r,is:e,create:t,validate:E=>a(E,{uri:r,is:e,create:t}),serialize:d||(()=>r)}),b=(r,{uri:e,is:t,create:a,err:d,validate:i})=>{if(d)return L(r,{uri:e,is:t,create:a,err:d});if(i)return C(r,{uri:e,is:t,create:a,validate:i});throw new Error('you need to provide a "err" or "validate" function')},C=(r,{uri:e,is:t,create:a,validate:d})=>u({uri:e,is:i=>r.is(i)&&t(i),create:a,validate:(i,$)=>{const N=r.validate(i),_=d(i,$),E=[N,_].filter(S=>S.status==="FAILURE").flatMap(S=>S.value);return E.length?s(E):o(i)}}),L=(r,{uri:e,is:t,create:a,err:d})=>u({uri:e,is:i=>r.is(i)&&t(i),create:a,validate:i=>{const $=r.validate(i),N=t(i)?o(a(i)):s(d(i)),_=[$,N].filter(E=>E.status==="FAILURE").flatMap(E=>E.value);return _.length?s(_):o(i)}}),f=r=>r,y=r=>Object.keys(r),A=r=>typeof r=="object"&&!Array.isArray(r)&&r!==null,p=r=>r===null?"null":r instanceof Date?"date":A(r)?"record":Array.isArray(r)?"array":typeof r,c=(r,e)=>({expectedType:r,providedType:p(e),providedNativeType:typeof e,providedValue:e}),z=r=>l("array","E_NO_ARRAY",'input is not of type: "array"',c("array",r)),F=r=>u({uri:"array",is:e=>Array.isArray(e)&&e.every(r.is),create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):Array.isArray(e)?s({error:null,items:e.map(r.validate)}):s({error:z(e),items:[]})}),v="boolean",G=r=>l(v,"E_NO_BOOLEAN",'input is not of type: "boolean"',c(v,r)),Z=u({uri:v,is:r=>typeof r===v,create:f,validate:(r,{is:e,create:t})=>e(r)?o(t(r)):s(G(r))}),R="date",B=r=>l(R,"E_NO_DATE",'input is not of type: "date"',c(R,r)),V=u({uri:R,is:r=>r instanceof Date&&r.toString()!=="Invalid Date",create:f,validate:(r,{is:e,create:t})=>e(r)?o(t(r)):s(B(r))}),O="string",W=r=>l(O,"E_NO_STRING",'input is not of type: "string"',c(O,r)),M=u({uri:O,is:r=>typeof r===O,create:f,validate:(r,{is:e,create:t})=>e(r)?o(t(r)):s(W(r))}),K=b(M,{uri:"email",is:r=>/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(r),create:r=>r,err:r=>l("email","E_NO_EMAIL",'input is not of type: "email"',c("email",r))}),g="number",X=r=>l(g,"E_NO_NUMBER",'input is not of type: "number"',c(g,r)),m=u({uri:g,is:r=>typeof r===g,create:f,validate:(r,{is:e,create:t})=>e(r)?o(t(r)):s(X(r))}),I="float",Y=b(m,{uri:I,is:r=>r%1!=0,create:r=>r,err:r=>l(I,"E_NO_FLOAT",'input is not of type: "float"',c(I,r))}),h="integer",k=b(m,{uri:h,is:r=>Number.isInteger(r),create:r=>r,err:r=>l(h,"E_NO_INTEGER",'input is not of type: "integer"',c(h,r))}),q=(r,e)=>l("literal","E_NO_LITERAL",`input is not of type: "literal(${typeof e=="string"?`"${e}"`:e})"`,c("literal",r)),H=r=>u({uri:"literal",is:e=>e===r,create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):s(q(e,r)),serialize:()=>typeof r=="string"?`literal("${r}")`:`literal(${r})`}),J=r=>u({uri:"array",is:e=>e===null||r.is(e),create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):r.validate(e)}),Q=r=>u({uri:"array",is:e=>e===void 0||r.is(e),create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):r.validate(e)}),w=r=>l("record","E_NO_RECORD",'input is not of type: "record"',c("record",r)),x=(r,e)=>l("record","E_MISSING_RECORD_PROPERTIES","input is missing record properties",j(D({},c("record",r)),{requiredProperties:e})),rr=(r,e)=>l("record","E_UNEXPECTED_RECORD_PROPERTIES","input has unexpected record properties",j(D({},c("record",r)),{requiredProperties:e})),er=r=>u({uri:"record",is:e=>A(e)&&y(e).length===y(r).length&&y(r).every(t=>r[t].is(e[t])),create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):A(e)?y(e).length<y(r).length?s({error:x(e,Object.keys(r)),properties:null}):y(e).length>y(r).length?s({error:rr(e,Object.keys(r)),properties:null}):s({error:null,properties:y(r).reduce((d,i)=>(d[i]=r[i].validate(e[i]),d),{})}):s({error:w(e),properties:null})}),T="union",tr=(r,e)=>{const t=`union([${e.map(a=>a.serialize()).join(", ")}])`;return l(T,"E_NO_UNION",`input is not of type: "${t}"`,c(T,r))},or=r=>u({uri:T,is:e=>r.some(t=>t.is(e)),create:f,validate:(e,{is:t,create:a})=>t(e)?o(a(e)):s(tr(e,r))});n.array=F,n.boolean=Z,n.date=V,n.email=K,n.float=Y,n.integer=k,n.literal=H,n.nullable=J,n.number=m,n.optional=Q,n.record=er,n.string=M,n.union=or,Object.defineProperty(n,"__esModule",{value:!0}),n[Symbol.toStringTag]="Module"});
