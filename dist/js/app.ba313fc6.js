(function(e){function n(n){for(var r,l,a=n[0],u=n[1],s=n[2],p=0,f=[];p<a.length;p++)l=a[p],Object.prototype.hasOwnProperty.call(o,l)&&o[l]&&f.push(o[l][0]),o[l]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);c&&c(n);while(f.length)f.shift()();return i.push.apply(i,s||[]),t()}function t(){for(var e,n=0;n<i.length;n++){for(var t=i[n],r=!0,a=1;a<t.length;a++){var u=t[a];0!==o[u]&&(r=!1)}r&&(i.splice(n--,1),e=l(l.s=t[0]))}return e}var r={},o={app:0},i=[];function l(n){if(r[n])return r[n].exports;var t=r[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,l),t.l=!0,t.exports}l.m=e,l.c=r,l.d=function(e,n,t){l.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,n){if(1&n&&(e=l(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(l.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)l.d(t,r,function(n){return e[n]}.bind(null,r));return t},l.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(n,"a",n),n},l.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},l.p="/verse/";var a=window["webpackJsonp"]=window["webpackJsonp"]||[],u=a.push.bind(a);a.push=n,a=a.slice();for(var s=0;s<a.length;s++)n(a[s]);var c=u;i.push([0,"chunk-vendors"]),t()})({0:function(e,n,t){e.exports=t("56d7")},"034f":function(e,n,t){"use strict";t("85ec")},"56d7":function(e,n,t){"use strict";t.r(n);t("e260"),t("e6cf"),t("cca6"),t("a79d");var r=t("2b0e"),o=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",{attrs:{id:"app"}},[t("HelloWorld")],1)},i=[],l=function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[t("div",{attrs:{id:"inputBar"}},[t("input"),t("button",{on:{click:e.onClickGo}},[e._v("Go")])]),t("br"),t("div",{attrs:{id:"verseTitle"}},[e._v(" "+e._s(e.verseTitle)+" ")]),t("div",{attrs:{id:"verseTranslation"}},[e._v(" "+e._s(e.verseTranslation)+" ")]),t("br"),t("div",{attrs:{id:"verseContent"}},[e._v(" "+e._s(e.verseContent)+" ")])])},a=[],u={name:"HelloWorld",props:{msg:String},data:function(){return{verseTitle:"Genesis 1:1",verseTranslation:"Ang Dating Biblia",verseContent:"Nang pasimula ay..."}},methods:{onClickGo:function(){var e="(?:([iI]{1,3}|\\d+) )?([a-zA-Z]+(?: [a-zA-Z]+)*)[. ]?(\\d+)[ \\.:](\\d+)";console.log(e)}}},s=u,c=t("2877"),p=Object(c["a"])(s,l,a,!1,null,null,null),f=p.exports,d={name:"App",components:{HelloWorld:f}},v=d,b=(t("034f"),Object(c["a"])(v,o,i,!1,null,null,null)),h=b.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(h)}}).$mount("#app")},"85ec":function(e,n,t){}});
//# sourceMappingURL=app.ba313fc6.js.map