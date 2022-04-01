var Te=Object.defineProperty,ve=Object.defineProperties;var Ae=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var be=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var Z=(s,o,a)=>o in s?Te(s,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[o]=a,L=(s,o)=>{for(var a in o||(o={}))be.call(o,a)&&Z(s,a,o[a]);if(H)for(var a of H(o))he.call(o,a)&&Z(s,a,o[a]);return s},F=(s,o)=>ve(s,Ae(o));(function(s,o){typeof exports=="object"&&typeof module!="undefined"?o(exports):typeof define=="function"&&define.amd?define(["exports"],o):(s=typeof globalThis!="undefined"?globalThis:s||self,o(s.Nope={}))})(this,function(s){"use strict";const o=e=>({status:"SUCCESS",value:e}),a=e=>({status:"FAILURE",value:e}),B=e=>e.status==="SUCCESS",V=e=>e.status==="FAILURE",l=(e,r,t,n={})=>({uri:e,code:r,message:t,details:n}),y=({uri:e,is:r,create:t,validate:n,serialize:i})=>{const c=null,d=null,f=null,$=()=>e;return{I:c,O:d,E:f,uri:e,is:r,create:t,validate:_=>n(_,{uri:e,is:r,create:t,serialize:i||$}),serialize:i||$}},O=(e,{uri:r,is:t,create:n,err:i,validate:c})=>{if(i)return X(e,{uri:r,is:t,create:n,err:i});if(c)return W(e,{uri:r,is:t,create:n,validate:c});throw new Error('you need to provide a "err" or "validate" function')},W=(e,{uri:r,is:t,create:n,validate:i})=>y({uri:r,is:c=>e.is(c)&&t(c),create:n,validate:(c,d)=>{const f=e.validate(c),$=i(c,d),_=[f,$].filter(N=>N.status==="FAILURE").flatMap(N=>N.value);return _.length?a(_):o(c)}}),X=(e,{uri:r,is:t,create:n,err:i})=>y({uri:r,is:c=>e.is(c)&&t(c),create:n,validate:(c,{is:d})=>{const f=e.validate(c),$=d(c)?o(n(c)):a(i(c)),_=[f,$].filter(N=>N.status==="FAILURE").flatMap(N=>N.value);return _.length?a(_):o(c)}}),E=e=>e,R=e=>Object.keys(e),h=e=>typeof e=="object"&&!Array.isArray(e)&&e!==null,p=e=>e===null?"null":e instanceof Date?"date":h(e)?"record":Array.isArray(e)?"array":typeof e,u=(e,r)=>({expectedType:e,providedType:p(r),providedNativeType:typeof r,providedValue:r}),g=e=>e!=null,D="array",Y=e=>l(D,"E_NO_ARRAY",`input is not of type: "${D}"`,u(D,e)),J=e=>y({uri:D,is:r=>Array.isArray(r)&&r.every(e.is),create:E,validate:(r,{is:t,create:n})=>t(r)?o(n(r)):Array.isArray(r)?a({error:null,items:r.map(e.validate)}):a({error:Y(r),items:[]})}),v="boolean",Q=e=>l(v,"E_NO_BOOLEAN",`input is not of type: "${v}"`,u(v,e)),k=y({uri:v,is:e=>typeof e===v,create:E,validate:(e,{is:r,create:t})=>r(e)?o(t(e)):a(Q(e))}),A="string",w=e=>l(A,"E_NO_STRING",`input is not of type: "${A}"`,u(A,e)),T=y({uri:A,is:e=>typeof e===A,create:E,validate:(e,{is:r,create:t})=>r(e)?o(t(e)):a(w(e))}),S="constrained-string",x=(e,r)=>l(S,"E_CONSTRAINED_STRING_MIN_LENGTH",`input does not satisfy constraint. minLength: "${r}"`,u(S,e)),ee=(e,r)=>l(S,"E_CONSTRAINED_STRING_MAX_LENGTH",`input does not satisfy constraint. maxLength: "${r}"`,u(S,e)),re=(e,r)=>l(S,"E_CONSTRAINED_STRING_INCLUDES",`input does not satisfy constraint. includes: "${r}"`,u(S,e)),te=(e,r)=>l(S,"E_CONSTRAINED_STRING_MATCHES",`input does not satisfy constraint. regex match: "${r.source}"`,u(S,e)),se=({minLength:e,maxLength:r,includes:t,matches:n}={})=>O(T,{uri:S,is:i=>!(g(e)&&i.length<e||g(r)&&i.length>r||g(t)&&!i.includes(t)||g(n)&&i.match(n)===null),create:i=>i,validate:(i,{is:c,create:d})=>{if(c(i))return o(d(i));const f=[];return g(e)&&typeof i=="string"&&i.length<e&&f.push(x(i,e)),g(r)&&typeof i=="string"&&i.length>r&&f.push(ee(i,r)),g(t)&&typeof i=="string"&&!i.includes(t)&&f.push(re(i,t)),g(n)&&typeof i=="string"&&i.match(n)===null&&f.push(te(i,n)),a(f)}}),P="date-string",ie=O(T,{uri:P,is:e=>/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i.test(e)&&new Date(e).toString()!=="Invalid Date",create:e=>e,err:e=>l(P,"E_NO_DATE_STRING",`input is not of type: "${P}"`,u(P,e))}),j="date",ne=e=>l(j,"E_NO_DATE",`input is not of type: "${j}"`,u(j,e)),oe=y({uri:j,is:e=>e instanceof Date&&e.toString()!=="Invalid Date",create:E,validate:(e,{is:r,create:t})=>r(e)?o(t(e)):a(ne(e))}),C="email",ae=O(T,{uri:C,is:e=>/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(e),create:e=>e,err:e=>l(C,"E_NO_EMAIL",`input is not of type: "${C}"`,u(C,e))}),b="number",ce=e=>l(b,"E_NO_NUMBER",`input is not of type: "${b}"`,u(b,e)),G=y({uri:b,is:e=>typeof e===b,create:E,validate:(e,{is:r,create:t})=>r(e)?o(t(e)):a(ce(e))}),m="float",le=O(G,{uri:m,is:e=>e%1!=0,create:e=>e,err:e=>l(m,"E_NO_FLOAT",`input is not of type: "${m}"`,u(m,e))}),q="integer",ue=O(G,{uri:q,is:e=>Number.isInteger(e),create:e=>e,err:e=>l(q,"E_NO_INTEGER",`input is not of type: "${q}"`,u(q,e))}),K="literal",fe=(e,r)=>l(K,"E_NO_LITERAL",`input is not of type: "${r}"`,u(K,e)),de=e=>y({uri:K,is:r=>r===e,create:E,validate:(r,{is:t,create:n,serialize:i})=>t(r)?o(n(r)):a(fe(r,i())),serialize:()=>typeof e=="string"?`literal("${e}")`:`literal(${e})`}),U="non-empty-string",ye=O(T,{uri:U,is:e=>e!=="",create:e=>e,err:e=>l(U,"E_NON_EMPTY_STRING",`input is not of type: "${U}"`,u(U,e))}),Ee=e=>y({uri:"nullable",is:r=>r===null||e.is(r),create:E,validate:(r,{is:t,create:n})=>t(r)?o(n(r)):e.validate(r)}),$e=e=>y({uri:"optional",is:r=>r===void 0||e.is(r),create:E,validate:(r,{is:t,create:n})=>t(r)?o(n(r)):e.validate(r)}),I="record",_e=(e,r)=>l(I,"E_NO_RECORD",`input is not of type: "${r}"`,u(I,e)),Ne=(e,r)=>l(I,"E_RECORD_MISSING_PROPERTIES","input is missing record properties",F(L({},u(I,e)),{requiredProperties:r})),ge=(e,r)=>l(I,"E_RECORD_UNEXPECTED_PROPERTIES","input has unexpected record properties",F(L({},u(I,e)),{requiredProperties:r})),Se=(e,r={})=>y({uri:I,is:t=>{if(!h(t))return!1;const i=R(e).length,d=R(t).length,f=r.requiredProperties||R(e);return r.requiredProperties&&r.requiredProperties.length!==i?d>=r.requiredProperties.length&&d<=i&&f.every(N=>e[N].is(t[N])):d===i&&f.every(_=>e[_].is(t[_]))},create:E,validate:(t,{is:n,create:i,serialize:c})=>{if(n(t))return o(i(t));if(!h(t))return a({error:_e(t,c()),properties:null});const d=r.requiredProperties||R(e);return R(t).length<d.length?a({error:Ne(t,r.requiredProperties||Object.keys(e)),properties:null}):R(t).length>R(e).length?a({error:ge(t,r.requiredProperties||Object.keys(e)),properties:null}):a({error:null,properties:d.reduce((f,$)=>(f[$]=e[$].validate(t[$]),f),{})})},serialize:()=>`record({ ${Object.keys(e).map(n=>[`${n}: `,`${e[n].serialize()}`].join("")).join(", ")} })`}),z="union",Oe=(e,r)=>l(z,"E_NOT_IN_UNION",`input is not of type: "${r}"`,u(z,e)),Re=e=>y({uri:z,is:r=>e.some(t=>t.is(r)),create:E,validate:(r,{is:t,create:n,serialize:i})=>t(r)?o(n(r)):a(Oe(r,i())),serialize:()=>`union([${e.map(r=>r.serialize()).join(", ")}])`}),M="uuid",Ie=O(T,{uri:M,is:e=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e),create:e=>e,err:e=>l(M,"E_NO_UUID",`input is not of type: "${M}"`,u(M,e))});s.array=J,s.boolean=k,s.constrainedString=se,s.createError=l,s.createSchema=y,s.date=oe,s.dateString=ie,s.email=ae,s.extendSchema=O,s.failure=a,s.float=le,s.getDisplayType=p,s.getErrorDetails=u,s.identity=E,s.integer=ue,s.isFailure=V,s.isNotNil=g,s.isObject=h,s.isSuccess=B,s.literal=de,s.nonEmptyString=ye,s.nullable=Ee,s.number=G,s.objectKeys=R,s.optional=$e,s.record=Se,s.string=T,s.success=o,s.union=Re,s.uuid=Ie,Object.defineProperty(s,"__esModule",{value:!0}),s[Symbol.toStringTag]="Module"});
