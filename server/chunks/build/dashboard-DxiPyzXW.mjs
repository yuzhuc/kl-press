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

// app/pages/[language]/dashboard.vue?vue&type=script&setup=true&lang.ts
var dashboard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "dashboard",
	__ssrInlineRender: true,
	setup(__props) {
		const t = N(i18n);
		useLocalePageMeta("/dashboard", () => t("site.title.dashboard"), () => t("site.description.dashboard"));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><h1>${ssrInterpolate(unref(t)("dashboard.greeting", { name: "访客" }))}</h1><p>${ssrInterpolate(unref(t)("dashboard.intro"))}</p></div>`);
		};
	}
});
// app/pages/[language]/dashboard.vue
var _sfc_setup = dashboard_vue_vue_type_script_setup_true_lang_default.setup;
dashboard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[language]/dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = dashboard_vue_vue_type_script_setup_true_lang_default;

export { dashboard_default as default };
//# sourceMappingURL=dashboard-DxiPyzXW.mjs.map
