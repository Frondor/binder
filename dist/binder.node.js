!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.binder=n():e.binder=n()}(global,function(){return function(e){var n={};function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(r,i,function(n){return e[n]}.bind(null,i));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";function r(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}t.r(n);var i=function(){function e(n,t,r,i){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.container=n,this.type=t,this.name=r,this.resolver=i,this.instance=t===e.types.INSTANCE?i:null,this.isSingleton=t===e.types.SINGLETON}return function(e,n,t){n&&r(e.prototype,n),t&&r(e,t)}(e,[{key:"_checkAndReturnArgs",value:function(e){if(e&&(!e.constructor||"Array"!==e.constructor.name))throw new TypeError("[Container binding] Arguments must be passed as Array");return e||[]}},{key:"resolve",value:function(e){return this.instance?this.instance:this.isSingleton?this.instance=this.resolver(this.container.injector,this._checkAndReturnArgs(e)):this.resolver(this.container.injector,this._checkAndReturnArgs(e))}}]),e}();Object.defineProperty(i,"types",{value:{CLASS:1,INSTANCE:2,SINGLETON:3}});var o=i;function u(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}t.d(n,"default",function(){return s});var s=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.bindings={},this.injector={}}return function(e,n,t){n&&u(e.prototype,n),t&&u(e,t)}(e,[{key:"_resolveBinding",value:function(e,n){return this.bindings[e].resolve(n)}},{key:"get",value:function(e,n){if(!this.bindings[e])throw new ReferenceError(e+" is not bound");return this._resolveBinding(e,n)}},{key:"_define",value:function(e,n,t){var r=this;this.bindings[e]=new o(this,t,e,n),Object.defineProperty(this.injector,e,{configurable:!0,enumerable:!0,get:function(){return r.get(e)}})}},{key:"bind",value:function(e,n){if("function"!=typeof n)return this.instance(e,n);this._define(e,n,o.types.CLASS)}},{key:"instance",value:function(e,n){this._define(e,n,o.types.INSTANCE)}},{key:"singleton",value:function(e,n){this._define(e,n,o.types.SINGLETON)}}]),e}()}]).default});
//# sourceMappingURL=binder.node.js.map