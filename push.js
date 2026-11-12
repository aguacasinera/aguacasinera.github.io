/* Agua Casinera · v1.26 · Firebase JS SDK 13.3.0 (solo app + messaging), empaquetado con esbuild.
 * Fuente: entrada.js (pedirToken, borrarToken, soportado). No se edita a mano: se vuelve a generar.
 * La app lo carga recién al activar las notificaciones o al renovar el token, no al abrir. */
var Be=()=>{};var Fe=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},Qt=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[r++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],s=e[n++],a=e[n++],c=((i&7)<<18|(o&63)<<12|(s&63)<<6|a&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{let o=e[n++],s=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(o&63)<<6|s&63)}}return t.join("")},Le={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){let o=e[i],s=i+1<e.length,a=s?e[i+1]:0,c=i+2<e.length,u=c?e[i+2]:0,f=o>>2,M=(o&3)<<4|a>>4,U=(a&15)<<2|u>>6,V=u&63;c||(V=64,s||(U=64)),r.push(n[f],n[M],n[U],n[V])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Fe(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Qt(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){let o=n[e.charAt(i++)],a=i<e.length?n[e.charAt(i)]:0;++i;let u=i<e.length?n[e.charAt(i)]:64;++i;let M=i<e.length?n[e.charAt(i)]:64;if(++i,o==null||a==null||u==null||M==null)throw new ee;let U=o<<2|a>>4;if(r.push(U),u!==64){let V=a<<4&240|u>>2;if(r.push(V),M!==64){let Xt=u<<6&192|M;r.push(Xt)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},ee=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Zt=function(e){let t=Fe(e);return Le.encodeByteArray(t,!0)},te=function(e){return Zt(e).replace(/\./g,"")},$e=function(e){try{return Le.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function en(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}var tn=()=>en().__FIREBASE_DEFAULTS__,nn=()=>{if(typeof process=="undefined"||typeof process.env=="undefined")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},rn=()=>{if(typeof document=="undefined")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&$e(e[1]);return t&&JSON.parse(t)},on=()=>{try{return Be()||tn()||nn()||rn()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};var ne=()=>{var e;return(e=on())==null?void 0:e.config};var W=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}};function K(){try{return typeof indexedDB=="object"}catch{return!1}}function z(){return new Promise((e,t)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var o;t(((o=i.error)==null?void 0:o.message)||"")}}catch(n){t(n)}})}function He(){return!(typeof navigator=="undefined"||!navigator.cookieEnabled)}var sn="FirebaseError",w=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=sn,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,y.prototype.create)}},y=class{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){let r=n[0]||{},i=`${this.service}/${t}`,o=this.errors[t],s=o?an(o,r):"Error",a=`${this.serviceName}: ${s} (${i}).`;return new w(i,a,r)}};function an(e,t){try{let n=0,r="";for(;n<e.length;){let i=e.indexOf("{$",n);if(i===-1){r+=e.substring(n);break}let o=e.indexOf("}",i+2);if(o===-1){r+=e.substring(n);break}let s=e.substring(i+2,o),a=t[s];r+=e.substring(n,i)+(a!=null?String(a):`<${s}?>`),n=o+1}return r}catch{return e}}function q(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let o=e[i],s=t[i];if(Pe(o)&&Pe(s)){if(!q(o,s))return!1}else if(o!==s)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function Pe(e){return e!==null&&typeof e=="object"}var Yi=14400*1e3;function G(e){return e&&e._delegate?e._delegate:e}var h=class{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var v="[DEFAULT]";var re=class{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){let r=new W;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var i;let n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(i=t==null?void 0:t.optional)!=null?i:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(o){if(r)return null;throw o}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(fn(t))try{this.getOrInitializeService({instanceIdentifier:v})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let o=this.getOrInitializeService({instanceIdentifier:i});r.resolve(o)}catch{}}}}clearInstance(t=v){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=v){return this.instances.has(t)}getOptions(t=v){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[o,s]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(o);r===a&&s.resolve(i)}return i}onInit(t,n){var s;let r=this.normalizeInstanceIdentifier(n),i=(s=this.onInitCallbacks.get(r))!=null?s:new Set;i.add(t),this.onInitCallbacks.set(r,i);let o=this.instances.get(r);return o&&t(o,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:cn(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=v){return this.component?this.component.multipleInstances?t:v:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function cn(e){return e===v?void 0:e}function fn(e){return e.instantiationMode==="EAGER"}var J=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let n=new re(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}};var un=[],l;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(l||(l={}));var dn={debug:l.DEBUG,verbose:l.VERBOSE,info:l.INFO,warn:l.WARN,error:l.ERROR,silent:l.SILENT},ln=l.INFO,hn={[l.DEBUG]:"log",[l.VERBOSE]:"log",[l.INFO]:"info",[l.WARN]:"warn",[l.ERROR]:"error"},pn=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=hn[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},Y=class{constructor(t){this.name=t,this._logLevel=ln,this._logHandler=pn,this._userLogHandler=null,un.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in l))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?dn[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,l.DEBUG,...t),this._logHandler(this,l.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,l.VERBOSE,...t),this._logHandler(this,l.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,l.INFO,...t),this._logHandler(this,l.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,l.WARN,...t),this._logHandler(this,l.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,l.ERROR,...t),this._logHandler(this,l.ERROR,...t)}};var gn=(e,t)=>t.some(n=>e instanceof n),je,Ue;function bn(){return je||(je=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function mn(){return Ue||(Ue=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Ve=new WeakMap,oe=new WeakMap,We=new WeakMap,ie=new WeakMap,ae=new WeakMap;function wn(e){let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{n(p(e.result)),i()},s=()=>{r(e.error),i()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&Ve.set(n,e)}).catch(()=>{}),ae.set(t,e),t}function yn(e){if(oe.has(e))return;let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{n(),i()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});oe.set(e,t)}var se={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return oe.get(e);if(t==="objectStoreNames")return e.objectStoreNames||We.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return p(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ke(e){se=e(se)}function _n(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let r=e.call(X(this),t,...n);return We.set(r,t.sort?t.sort():[t]),p(r)}:mn().includes(e)?function(...t){return e.apply(X(this),t),p(Ve.get(this))}:function(...t){return p(e.apply(X(this),t))}}function En(e){return typeof e=="function"?_n(e):(e instanceof IDBTransaction&&yn(e),gn(e,bn())?new Proxy(e,se):e)}function p(e){if(e instanceof IDBRequest)return wn(e);if(ie.has(e))return ie.get(e);let t=En(e);return t!==e&&(ie.set(e,t),ae.set(t,e)),t}var X=e=>ae.get(e);function A(e,t,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){let s=indexedDB.open(e,t),a=p(s);return r&&s.addEventListener("upgradeneeded",c=>{r(p(s.result),c.oldVersion,c.newVersion,p(s.transaction),c)}),n&&s.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),a.then(c=>{o&&c.addEventListener("close",()=>o()),i&&c.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}function B(e,{blocked:t}={}){let n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),p(n).then(()=>{})}var In=["get","getKey","getAll","getAllKeys","count"],Sn=["put","add","delete","clear"],ce=new Map;function ze(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(ce.get(t))return ce.get(t);let n=t.replace(/FromIndex$/,""),r=t!==n,i=Sn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||In.includes(n)))return;let o=async function(s,...a){let c=this.transaction(s,i?"readwrite":"readonly"),u=c.store;return r&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),i&&c.done]))[0]};return ce.set(t,o),o}Ke(e=>({...e,get:(t,n,r)=>ze(t,n)||e.get(t,n,r),has:(t,n)=>!!ze(t,n)||e.has(t,n)}));var ue=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(vn(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function vn(e){let t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}var de="@firebase/app",qe="0.16.6";var E=new Y("@firebase/app"),An="@firebase/app-compat",Tn="@firebase/analytics-compat",Dn="@firebase/analytics",Cn="@firebase/app-check-compat",kn="@firebase/app-check",On="@firebase/auth",Rn="@firebase/auth-compat",Nn="@firebase/crashlytics",xn="@firebase/database",Mn="@firebase/data-connect",Bn="@firebase/database-compat",Pn="@firebase/functions",Fn="@firebase/functions-compat",Ln="@firebase/installations",$n="@firebase/installations-compat",Hn="@firebase/messaging",jn="@firebase/messaging-compat",Un="@firebase/performance",Vn="@firebase/performance-compat",Wn="@firebase/remote-config",Kn="@firebase/remote-config-compat",zn="@firebase/storage",qn="@firebase/storage-compat",Gn="@firebase/firestore",Jn="@firebase/ai",Yn="@firebase/firestore-compat",Xn="firebase";var le="[DEFAULT]",Qn={[de]:"fire-core",[An]:"fire-core-compat",[Dn]:"fire-analytics",[Tn]:"fire-analytics-compat",[kn]:"fire-app-check",[Cn]:"fire-app-check-compat",[On]:"fire-auth",[Rn]:"fire-auth-compat",[Nn]:"fire-cls",[xn]:"fire-rtdb",[Mn]:"fire-data-connect",[Bn]:"fire-rtdb-compat",[Pn]:"fire-fn",[Fn]:"fire-fn-compat",[Ln]:"fire-iid",[$n]:"fire-iid-compat",[Hn]:"fire-fcm",[jn]:"fire-fcm-compat",[Un]:"fire-perf",[Vn]:"fire-perf-compat",[Wn]:"fire-rc",[Kn]:"fire-rc-compat",[zn]:"fire-gcs",[qn]:"fire-gcs-compat",[Gn]:"fire-fst",[Yn]:"fire-fst-compat",[Jn]:"fire-vertex","fire-js":"fire-js",[Xn]:"fire-js-all"};var P=new Map,Zn=new Map,he=new Map;function Ge(e,t){try{e.container.addComponent(t)}catch(n){E.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function I(e){let t=e.name;if(he.has(t))return E.debug(`There were multiple attempts to register component ${t}.`),!1;he.set(t,e);for(let n of P.values())Ge(n,e);for(let n of Zn.values())Ge(n,e);return!0}function L(e,t){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}var er={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},_=new y("app","Firebase",er);var pe=class{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new h("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw _.create("app-deleted",{appName:this._name})}};function me(e,t={}){let n=e;typeof t!="object"&&(t={name:t});let r={name:le,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!="string"||!i)throw _.create("bad-app-name",{appName:String(i)});if(n||(n=ne()),!n)throw _.create("no-options");let o=P.get(i);if(o)if(q(n,o.options)){if(q(r,o.config))return o;throw _.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(o.config),newValue:JSON.stringify(r)})}else throw _.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(o.options),newValue:JSON.stringify(n)});let s=new J(i);for(let c of he.values())s.addComponent(c);let a=new pe(n,r,s);return P.set(i,a),a}function we(e=le){let t=P.get(e);if(!t&&e===le&&ne())return me();if(!t)throw _.create("no-app",{appName:e});return t}function Qe(){return Array.from(P.values())}function g(e,t,n){var s;let r=(s=Qn[e])!=null?s:e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),o=t.match(/\s|\//);if(i||o){let a=[`Unable to register library "${r}" with version "${t}":`];i&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),E.warn(a.join(" "));return}I(new h(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}var tr="firebase-heartbeat-database",nr=1,F="firebase-heartbeat-store",fe=null;function Ze(){return fe||(fe=A(tr,nr,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(F)}catch(n){console.warn(n)}}}}).catch(e=>{throw _.create("idb-open",{originalErrorMessage:e.message})})),fe}async function rr(e){try{let n=(await Ze()).transaction(F),r=await n.objectStore(F).get(et(e));return await n.done,r}catch(t){if(t instanceof w)E.warn(t.message);else{let n=_.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});E.warn(n.message)}}}async function Je(e,t){try{let r=(await Ze()).transaction(F,"readwrite");await r.objectStore(F).put(t,et(e)),await r.done}catch(n){if(n instanceof w)E.warn(n.message);else{let r=_.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});E.warn(r.message)}}}function et(e){return`${e.name}!${e.options.appId}`}var ir=1024,or=30,ge=class{constructor(t){this.container=t,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new be(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,n;try{let i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Ye();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(s=>s.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:i}),this._heartbeatsCache.heartbeats.length>or){let s=ar(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){E.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";let n=Ye(),{heartbeatsToSend:r,unsentEntries:i}=sr(this._heartbeatsCache.heartbeats),o=te(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(n){return E.warn(n),""}}};function Ye(){return new Date().toISOString().substring(0,10)}function sr(e,t=ir){let n=[],r=e.slice();for(let i of e){let o=n.find(s=>s.agent===i.agent);if(o){if(o.dates.push(i.date),Xe(n)>t){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Xe(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var be=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return K()?z().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await rr(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){var r;if(await this._canUseIndexedDBPromise){let i=await this.read();return Je(this.app,{lastSentHeartbeatDate:(r=t.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var r;if(await this._canUseIndexedDBPromise){let i=await this.read();return Je(this.app,{lastSentHeartbeatDate:(r=t.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...t.heartbeats]})}else return}};function Xe(e){return te(JSON.stringify({version:2,heartbeats:e})).length}function ar(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}function cr(e){I(new h("platform-logger",t=>new ue(t),"PRIVATE")),I(new h("heartbeat",t=>new ge(t),"PRIVATE")),g(de,qe,e),g(de,qe,"esm2020"),g("fire-js","")}cr("");var fr="firebase",ur="13.3.0";g(fr,ur,"app");var rt="@firebase/installations",Ie="0.6.24";var it=1e4,ot=`w:${Ie}`,st="FIS_v2",dr="https://firebaseinstallations.googleapis.com/v1",lr=3600*1e3,hr="installations",pr="Installations";var gr={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},D=new y(hr,pr,gr);function at(e){return e instanceof w&&e.code.includes("request-failed")}function ct({projectId:e}){return`${dr}/projects/${e}/installations`}function ft(e){return{token:e.token,requestStatus:2,expiresIn:mr(e.expiresIn),creationTime:Date.now()}}async function ut(e,t){let r=(await t.json()).error;return D.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function dt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function br(e,{refreshToken:t}){let n=dt(e);return n.append("Authorization",wr(t)),n}async function lt(e){let t=await e();return t.status>=500&&t.status<600?e():t}function mr(e){return Number(e.replace("s","000"))}function wr(e){return`${st} ${e}`}async function yr({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let r=ct(e),i=dt(e),o=t.getImmediate({optional:!0});if(o){let u=await o.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}let s={fid:n,authVersion:st,appId:e.appId,sdkVersion:ot},a={method:"POST",headers:i,body:JSON.stringify(s)},c=await lt(()=>fetch(r,a));if(c.ok){let u=await c.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:ft(u.authToken)}}else throw await ut("Create Installation",c)}function ht(e){return new Promise(t=>{setTimeout(t,e)})}function _r(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}var Er=/^[cdef][\w-]{21}$/,Ee="";function Ir(){try{let e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;let n=Sr(e);return Er.test(n)?n:Ee}catch{return Ee}}function Sr(e){return _r(e).substr(0,22)}function O(e){return`${e.appName}!${e.appId}`}var k=new Map;function pt(e,t){let n=O(e);gt(n,t),Tr(n,t)}function vr(e,t){bt();let n=O(e),r=k.get(n);r||(r=new Set,k.set(n,r)),r.add(t)}function Ar(e,t){let n=O(e),r=k.get(n);r&&(r.delete(t),r.size===0&&k.delete(n),mt())}function gt(e,t){let n=k.get(e);if(n)for(let r of n)r(t)}function Tr(e,t){let n=bt();n&&n.postMessage({key:e,fid:t}),mt()}var T=null;function bt(){return!T&&"BroadcastChannel"in self&&(T=new BroadcastChannel("[Firebase] FID Change"),T.onmessage=e=>{gt(e.data.key,e.data.fid)}),T}function mt(){k.size===0&&T&&(T.close(),T=null)}var Dr="firebase-installations-database",Cr=1,C="firebase-installations-store",ye=null;function Se(){return ye||(ye=A(Dr,Cr,{upgrade:(e,t)=>{t===0&&e.createObjectStore(C)}})),ye}async function Q(e,t){let n=O(e),i=(await Se()).transaction(C,"readwrite"),o=i.objectStore(C),s=await o.get(n);return await o.put(t,n),await i.done,(!s||s.fid!==t.fid)&&pt(e,t.fid),t}async function wt(e){let t=O(e),r=(await Se()).transaction(C,"readwrite");await r.objectStore(C).delete(t),await r.done}async function Z(e,t){let n=O(e),i=(await Se()).transaction(C,"readwrite"),o=i.objectStore(C),s=await o.get(n),a=t(s);return a===void 0?await o.delete(n):await o.put(a,n),await i.done,a&&(!s||s.fid!==a.fid)&&pt(e,a.fid),a}async function ve(e){let t,n=await Z(e.appConfig,r=>{let i=kr(r),o=Or(e,i);return t=o.registrationPromise,o.installationEntry});return n.fid===Ee?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function kr(e){let t=e||{fid:Ir(),registrationStatus:0};return yt(t)}function Or(e,t){if(t.registrationStatus===0){if(!navigator.onLine){let i=Promise.reject(D.create("app-offline"));return{installationEntry:t,registrationPromise:i}}let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=Rr(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Nr(e)}:{installationEntry:t}}async function Rr(e,t){try{let n=await yr(e,t);return Q(e.appConfig,n)}catch(n){throw at(n)&&n.customData.serverCode===409?await wt(e.appConfig):await Q(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Nr(e){let t=await tt(e.appConfig);for(;t.registrationStatus===1;)await ht(100),t=await tt(e.appConfig);if(t.registrationStatus===0){let{installationEntry:n,registrationPromise:r}=await ve(e);return r||n}return t}function tt(e){return Z(e,t=>{if(!t)throw D.create("installation-not-found");return yt(t)})}function yt(e){return xr(e)?{fid:e.fid,registrationStatus:0}:e}function xr(e){return e.registrationStatus===1&&e.registrationTime+it<Date.now()}async function Mr({appConfig:e,heartbeatServiceProvider:t},n){let r=Br(e,n),i=br(e,n),o=t.getImmediate({optional:!0});if(o){let u=await o.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}let s={installation:{sdkVersion:ot,appId:e.appId}},a={method:"POST",headers:i,body:JSON.stringify(s)},c=await lt(()=>fetch(r,a));if(c.ok){let u=await c.json();return ft(u)}else throw await ut("Generate Auth Token",c)}function Br(e,{fid:t}){return`${ct(e)}/${t}/authTokens:generate`}async function Ae(e,t=!1){let n,r=await Z(e.appConfig,o=>{if(!_t(o))throw D.create("not-registered");let s=o.authToken;if(!t&&Lr(s))return o;if(s.requestStatus===1)return n=Pr(e,t),o;{if(!navigator.onLine)throw D.create("app-offline");let a=Hr(o);return n=Fr(e,a),a}});return n?await n:r.authToken}async function Pr(e,t){let n=await nt(e.appConfig);for(;n.authToken.requestStatus===1;)await ht(100),n=await nt(e.appConfig);let r=n.authToken;return r.requestStatus===0?Ae(e,t):r}function nt(e){return Z(e,t=>{if(!_t(t))throw D.create("not-registered");let n=t.authToken;return jr(n)?{...t,authToken:{requestStatus:0}}:t})}async function Fr(e,t){try{let n=await Mr(e,t),r={...t,authToken:n};return await Q(e.appConfig,r),n}catch(n){if(at(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await wt(e.appConfig);else{let r={...t,authToken:{requestStatus:0}};await Q(e.appConfig,r)}throw n}}function _t(e){return e!==void 0&&e.registrationStatus===2}function Lr(e){return e.requestStatus===2&&!$r(e)}function $r(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+lr}function Hr(e){let t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function jr(e){return e.requestStatus===1&&e.requestTime+it<Date.now()}async function Ur(e){let t=e,{installationEntry:n,registrationPromise:r}=await ve(t);return r?r.catch(console.error):Ae(t).catch(console.error),n.fid}async function Vr(e,t=!1){let n=e;return await Wr(n),(await Ae(n,t)).token}async function Wr(e){let{registrationPromise:t}=await ve(e);t&&await t}function Et(e,t){let{appConfig:n}=e;return vr(n,t),()=>{Ar(n,t)}}function Kr(e){if(!e||!e.options)throw _e("App Configuration");if(!e.name)throw _e("App Name");let t=["projectId","apiKey","appId"];for(let n of t)if(!e.options[n])throw _e(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function _e(e){return D.create("missing-app-config-values",{valueName:e})}var It="installations",zr="installations-internal",qr=e=>{let t=e.getProvider("app").getImmediate(),n=Kr(t),r=L(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Gr=e=>{let t=e.getProvider("app").getImmediate(),n=L(t,It).getImmediate();return{getId:()=>Ur(n),getToken:i=>Vr(n,i)}};function Jr(){I(new h(It,qr,"PUBLIC")),I(new h(zr,Gr,"PRIVATE"))}Jr();g(rt,Ie);g(rt,Ie,"esm2020");var Yr="/firebase-messaging-sw.js",Xr="/firebase-cloud-messaging-push-scope",Bt="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",Qr="https://fcmregistrations.googleapis.com/v1",Pt="google.c.a.c_id",Zr="google.c.a.c_l",ei="google.c.a.ts",ti="google.c.a.e",St=1e4,vt;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(vt||(vt={}));var R;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked",e.FID_REGISTERED="fid-registered"})(R||(R={}));function b(e){let t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Ft(e){let t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),i=new Uint8Array(r.length);for(let o=0;o<r.length;++o)i[o]=r.charCodeAt(o);return i}var Te="fcm_token_details_db",ni=5,At="fcm_token_object_Store";async function ri(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(o=>o.name).includes(Te))return null;let t=null;return(await A(Te,ni,{upgrade:async(r,i,o,s)=>{var u;if(i<2||!r.objectStoreNames.contains(At))return;let a=s.objectStore(At),c=await a.index("fcmSenderId").get(e);if(await a.clear(),!!c){if(i===2){let f=c;if(!f.auth||!f.p256dh||!f.endpoint)return;t={token:f.fcmToken,createTime:(u=f.createTime)!=null?u:Date.now(),subscriptionOptions:{auth:f.auth,p256dh:f.p256dh,endpoint:f.endpoint,swScope:f.swScope,vapidKey:typeof f.vapidKey=="string"?f.vapidKey:b(f.vapidKey)}}}else if(i===3){let f=c;t={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:b(f.auth),p256dh:b(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:b(f.vapidKey)}}}else if(i===4){let f=c;t={token:f.fcmToken,createTime:f.createTime,subscriptionOptions:{auth:b(f.auth),p256dh:b(f.p256dh),endpoint:f.endpoint,swScope:f.swScope,vapidKey:b(f.vapidKey)}}}}}})).close(),await B(Te),await B("fcm_vapid_details_db"),await B("undefined"),ii(t)?t:null}function ii(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}var oi={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","fid-registration-failed":"A problem occurred while creating an FCM registration via FID: {$errorInfo}","fid-unregister-failed":"A problem occurred while unregistering the FCM registration via FID: {$errorInfo}","fid-registration-idb-schema-unavailable":"Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.","invalid-on-registered-handler":"No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."},d=new y("messaging","Messaging",oi);var Tt="firebase-messaging-database",Dt=2,S="firebase-messaging-store",m="firebase-messaging-fid-registration-store",si={openDB:A,deleteDB:B},Ct=si,$=null;function ai(e,t,n){switch(t){case 0:if(e.createObjectStore(S),n===1)break;case 1:n===2&&e.createObjectStore(m)}}function kt(e){return{upgrade:(t,n)=>{ai(t,n,e)},blocked:()=>{},blocking:(t,n,r)=>{var i;$=null,(i=r.target)==null||i.close()},terminated:()=>{$=null}}}function N(){return $||($=Ct.openDB(Tt,Dt,kt(2)).catch(()=>Ct.openDB(Tt,Dt-1,kt(1)))),$}function Lt(e,t){return e.objectStoreNames.contains(t)}function Oe(e){if(!Lt(e,m))throw d.create("fid-registration-idb-schema-unavailable")}async function $t(e){let t=x(e),r=await(await N()).transaction(S).objectStore(S).get(t);if(r)return r;{let i=await ri(e.appConfig.senderId);if(i)return await Re(e,i),i}}async function Re(e,t){let n=x(e),r=await N(),i=[S],o=Lt(r,m);o&&i.push(m);let s=r.transaction(i,"readwrite");return await s.objectStore(S).put(t,n),o&&await s.objectStore(m).delete(n),await s.done,t}async function ci(e){let t=x(e),r=(await N()).transaction(S,"readwrite");await r.objectStore(S).delete(t),await r.done}async function Ne(e){let t=x(e),n=await N();return Oe(n),await n.transaction(m).objectStore(m).get(t)}async function fi(e,t){let n=x(e),r=await N();Oe(r);let i=r.transaction([S,m],"readwrite");return await i.objectStore(m).put(t,n),await i.objectStore(S).delete(n),await i.done,t}async function ui(e){let t=x(e),n=await N();Oe(n);let r=n.transaction(m,"readwrite");await r.objectStore(m).delete(t),await r.done}function x({appConfig:e}){return e.appId}var Ot="@firebase/messaging",Ce="0.13.3";var di=3,li=1e3;async function hi(e,t){let n=await j(e),r=xe(t,e.appConfig.appName,!1),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch(H(e.appConfig),i)).json()}catch(s){throw d.create("token-subscribe-failed",{errorInfo:s==null?void 0:s.toString()})}if(o.error){let s=o.error.message;throw d.create("token-subscribe-failed",{errorInfo:s})}if(!o.token)throw d.create("token-subscribe-no-token");return o.token}async function pi(e,t){var c,u;let n=await j(e),r=xe(t,e.appConfig.appName,!0),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await yi(()=>fetch(H(e.appConfig),i),di,li)}catch(f){throw d.create("fid-registration-failed",{errorInfo:f==null?void 0:f.toString()})}if(o.ok)return{responseFid:await bi(o)};let s;try{s=await o.json()}catch{throw d.create("fid-registration-failed",{errorInfo:o.statusText})}let a=(u=(c=s.error)==null?void 0:c.message)!=null?u:o.statusText;throw d.create("fid-registration-failed",{errorInfo:a})}async function gi(e,t){var o,s;let r={method:"DELETE",headers:await j(e)},i;try{i=await fetch(`${H(e.appConfig)}/${t}`,r)}catch(a){throw d.create("fid-unregister-failed",{errorInfo:a==null?void 0:a.toString()})}if(!i.ok)try{throw(s=(o=(await i.json()).error)==null?void 0:o.message)!=null?s:i.statusText}catch(a){throw d.create("fid-unregister-failed",{errorInfo:typeof a=="string"&&a||i.statusText||(a==null?void 0:a.toString())})}}async function bi(e){let t=await e.text();if(!t.trim())throw d.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is empty"});let n;try{n=JSON.parse(t)}catch{throw d.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is not valid JSON"})}let r=n.name;if(typeof r!="string"||r.length===0)throw d.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response did not include a non-empty name"});return mi(r)}var Rt="/registrations/";function mi(e){let t=e.indexOf(Rt);if(t!==-1){let n=e.slice(t+Rt.length);if(n.length>0)return n}throw d.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response name is not a valid registration resource name"})}async function wi(e,t){let n=await j(e),r=xe(t.subscriptionOptions,e.appConfig.appName,!1),i={method:"PATCH",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch(`${H(e.appConfig)}/${t.token}`,i)).json()}catch(s){throw d.create("token-update-failed",{errorInfo:s==null?void 0:s.toString()})}if(o.error){let s=o.error.message;throw d.create("token-update-failed",{errorInfo:s})}if(!o.token)throw d.create("token-update-no-token");return o.token}async function Ht(e,t){let r={method:"DELETE",headers:await j(e)};try{let o=await(await fetch(`${H(e.appConfig)}/${t}`,r)).json();if(o.error){let s=o.error.message;throw d.create("token-unsubscribe-failed",{errorInfo:s})}}catch(i){throw d.create("token-unsubscribe-failed",{errorInfo:i==null?void 0:i.toString()})}}async function yi(e,t,n){let r;for(let i=0;i<t;i++)try{return await e()}catch(o){if(r=o,i<t-1){let s=n*Math.pow(2,i);await new Promise(a=>setTimeout(a,s))}}throw r}function H({projectId:e}){return`${Qr}/projects/${e}/registrations`}async function j({appConfig:e,installations:t}){let n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function _i(e,t){var n,r;try{if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(e))return new URL(e).host}catch{}try{if(typeof self!="undefined"&&((n=self.location)!=null&&n.href))return new URL(e,self.location.origin).host}catch{}return typeof self!="undefined"&&((r=self.location)!=null&&r.host)?self.location.host:t}function xe({p256dh:e,auth:t,endpoint:n,vapidKey:r,swScope:i},o,s){let a={web:{origin:_i(i,o),endpoint:n,auth:t,p256dh:e}};return s&&(a.fcm_sdk_version=Ce),r!==Bt&&(a.web.applicationPubKey=r),a}var Ei=10080*60*1e3;async function Ii(e){let t=await Di(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:b(t.getKey("auth")),p256dh:b(t.getKey("p256dh"))},r=await $t(e.firebaseDependencies);if(r){if(Ci(r.subscriptionOptions,n))return Date.now()>=r.createTime+Ei?Ti(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await Ht(e.firebaseDependencies,r.token)}catch(i){console.warn(i)}return Nt(e.firebaseDependencies,n)}else return Nt(e.firebaseDependencies,n)}async function Si(e,t){await Ht(e.firebaseDependencies,t.token),await ci(e.firebaseDependencies),await jt(e.firebaseDependencies)}async function vi(e){let t=await Ne(e.firebaseDependencies).catch(()=>{}),n=t==null?void 0:t.fid;n&&await gi(e.firebaseDependencies,n),await jt(e.firebaseDependencies),n&&Oi(e,n)}async function Ai(e){let t=await $t(e.firebaseDependencies);t?await Si(e,t):await vi(e);let n=await e.swRegistration.pushManager.getSubscription();return n?n.unsubscribe():!0}async function Ti(e,t){try{let n=await wi(e.firebaseDependencies,t),r={...t,token:n,createTime:Date.now()};return await Re(e.firebaseDependencies,r),n}catch(n){throw n}}async function Nt(e,t){let r={token:await hi(e,t),createTime:Date.now(),subscriptionOptions:t};return await Re(e,r),r.token}async function Di(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ft(t)})}function Ci(e,t){let n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,i=t.auth===e.auth,o=t.p256dh===e.p256dh;return n&&r&&i&&o}async function jt(e){try{await ui(e)}catch{}}function ki(e,t){let n=e.onRegisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}function Oi(e,t){let n=e.onUnregisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}async function Ut(e){try{e.swRegistration=await navigator.serviceWorker.register(Yr,{scope:Xr}),e.swRegistration.update().catch(()=>{}),await Ri(e.swRegistration)}catch(t){throw d.create("failed-service-worker-registration",{browserErrorMessage:t==null?void 0:t.message})}}async function Ri(e){return new Promise((t,n)=>{let r=setTimeout(()=>n(new Error(`Service worker not registered after ${St} ms`)),St),i=e.installing||e.waiting;e.active?(clearTimeout(r),t()):i?i.onstatechange=o=>{var s;((s=o.target)==null?void 0:s.state)==="activated"&&(i.onstatechange=null,clearTimeout(r),t())}:(clearTimeout(r),n(new Error("No incoming service worker found.")))})}async function Vt(e,t){if(!t&&!e.swRegistration&&await Ut(e),!(!t&&e.swRegistration)){if(!(t instanceof ServiceWorkerRegistration))throw d.create("invalid-sw-registration");e.swRegistration=t}}async function Wt(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=Bt)}var xt=3;async function Ni(e,t){let n=await xi(e.swRegistration,e.vapidKey),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:n.endpoint,auth:b(n.getKey("auth")),p256dh:b(n.getKey("p256dh"))},i=e.firebaseDependencies.installations;for(let o=0;o<xt;o++){let{responseFid:s}=await pi(e.firebaseDependencies,r);if(s===t)return;o<xt-1&&await i.getToken(!0)}throw d.create("fid-registration-failed",{errorInfo:"CreateRegistration response FID does not match Firebase Installation ID"})}async function xi(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Ft(t)})}var Mi=10080*60*1e3;async function Kt(e,t){if(!navigator)throw d.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw d.create("permission-blocked");if(!e.onRegisteredHandler)throw d.create("invalid-on-registered-handler");await Wt(e,t==null?void 0:t.vapidKey),await Vt(e,t==null?void 0:t.serviceWorkerRegistration);let n=e._registerNotifyChain.catch(()=>{});return e._registerNotifyChain=n.then(async()=>{let r=await e.firebaseDependencies.installations.getId(),i=await Ne(e.firebaseDependencies),o=Date.now();if((!i||i.fid!==r||o>=i.lastRegisterTime+Mi)&&(await Ni(e,r),await fi(e.firebaseDependencies,{fid:r,lastRegisterTime:o,vapidKey:e.vapidKey})),!e.onRegisteredHandler)throw d.create("invalid-on-registered-handler");ki(e,r)}),e._registerNotifyChain}function Bi(e,t){return Et(t,()=>{(async()=>!e.onRegisteredHandler||!await Ne(e.firebaseDependencies)||await Kt(e).catch(()=>{}))()})}function Mt(e){let t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return Pi(t,e),Fi(t,e),Li(t,e),t}function Pi(e,t){if(!t.notification)return;e.notification={};let n=t.notification.title;n&&(e.notification.title=n);let r=t.notification.body;r&&(e.notification.body=r);let i=t.notification.image;i&&(e.notification.image=i);let o=t.notification.icon;o&&(e.notification.icon=o)}function Fi(e,t){t.data&&(e.data=t.data)}function Li(e,t){var i,o,s,a,c;if(!t.fcmOptions&&!((i=t.notification)!=null&&i.click_action))return;e.fcmOptions={};let n=(a=(o=t.fcmOptions)==null?void 0:o.link)!=null?a:(s=t.notification)==null?void 0:s.click_action;n&&(e.fcmOptions.link=n);let r=(c=t.fcmOptions)==null?void 0:c.analytics_label;r&&(e.fcmOptions.analyticsLabel=r)}function $i(e){return typeof e=="object"&&!!e&&Pt in e}function Hi(e){if(!e||!e.options)throw De("App Configuration Object");if(!e.name)throw De("App Name");let t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(let r of t)if(!n[r])throw De(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function De(e){return d.create("missing-app-config-values",{valueName:e})}var ke=class{constructor(t,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.onRegisteredHandler=null,this.onUnregisteredHandler=null,this._registerNotifyChain=Promise.resolve(),this._fidChangeUnsubscribe=null,this.logEvents=[],this.logQueue={state:"stopped"};let i=Hi(t);this.firebaseDependencies={app:t,appConfig:i,installations:n,analyticsProvider:r}}_delete(){return this._fidChangeUnsubscribe&&(this._fidChangeUnsubscribe(),this._fidChangeUnsubscribe=null),this.logQueue.state==="scheduled"&&clearTimeout(this.logQueue.timerId),this.logQueue={state:"stopped"},Promise.resolve()}};async function zt(e,t){if(!navigator)throw d.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw d.create("permission-blocked");return await Wt(e,t==null?void 0:t.vapidKey),await Vt(e,t==null?void 0:t.serviceWorkerRegistration),Ii(e)}async function ji(e,t,n){let r=Ui(t);(await e.firebaseDependencies.analyticsProvider.get()).logEvent(r,{message_id:n[Pt],message_name:n[Zr],message_time:n[ei],message_device_time:Math.floor(Date.now()/1e3)})}function Ui(e){switch(e){case R.NOTIFICATION_CLICKED:return"notification_open";case R.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}async function Vi(e,t){let n=t.data;if(!n.isFirebaseMessaging)return;if(e.onMessageHandler&&n.messageType===R.PUSH_RECEIVED&&(typeof e.onMessageHandler=="function"?e.onMessageHandler(Mt(n)):e.onMessageHandler.next(Mt(n))),e.onRegisteredHandler&&n.messageType===R.FID_REGISTERED){let i=n.fid;typeof e.onRegisteredHandler=="function"?e.onRegisteredHandler(i):e.onRegisteredHandler.next(i)}let r=n.data;$i(r)&&r[ti]==="1"&&await ji(e,n.messageType,r)}var Wi=e=>{let t=new ke(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>Vi(t,n)),t._fidChangeUnsubscribe=Bi(t,e.getProvider("installations").getImmediate()),t},Ki=e=>{let t=e.getProvider("messaging").getImmediate();return{getToken:r=>zt(t,r),register:r=>Kt(t,r)}};function zi(){I(new h("messaging",Wi,"PUBLIC")),I(new h("messaging-internal",Ki,"PRIVATE")),g(Ot,Ce),g(Ot,Ce,"esm2020")}async function Me(){try{await z()}catch{return!1}return typeof window!="undefined"&&K()&&He()&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&"fetch"in window&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}async function qi(e){if(!navigator)throw d.create("only-available-in-window");return e.swRegistration||await Ut(e),Ai(e)}function qt(e=we()){return Me().then(t=>{if(!t)throw d.create("unsupported-browser")},t=>{throw d.create("indexed-db-unsupported")}),L(G(e),"messaging").getImmediate()}async function Gt(e,t){return e=G(e),zt(e,t)}function Jt(e){return e=G(e),qi(e)}zi();function Yt(e){let t=Qe()[0]||me(e);return qt(t)}async function Mo(){try{return await Me()}catch{return!1}}async function Bo(e,t,n){return Gt(Yt(e),{vapidKey:t,serviceWorkerRegistration:n})}async function Po(e){try{return await Jt(Yt(e))}catch{return!1}}export{Po as borrarToken,Bo as pedirToken,Mo as soportado};
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
