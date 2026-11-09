import { N, u as useLocalePageMeta, i as i18n } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import 'node:module';
import 'node:buffer';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import '../routes/renderer.mjs';
import '../nitro/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:events';
import 'node:crypto';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue-router';

// app/pages/[language]/home.vue?vue&type=script&setup=true&lang.ts
var home_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "home",
	__ssrInlineRender: true,
	setup(__props) {
		const t = N(i18n);
		useLocalePageMeta("/home", () => t("site.title.home"), () => t("site.description.home"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><h1>${ssrInterpolate(unref(t)("home.greeting", { name: "访客" }))}</h1><p>${ssrInterpolate(unref(t)("home.intro"))}</p></div>`);
		};
	}
});
// app/pages/[language]/home.vue
var _sfc_setup = home_vue_vue_type_script_setup_true_lang_default.setup;
home_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[language]/home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var home_default = home_vue_vue_type_script_setup_true_lang_default;

export { home_default as default };
//# sourceMappingURL=home-CyScVVXO.mjs.map
