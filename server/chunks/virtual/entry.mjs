import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { createRequire } from 'node:module';
import { createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, hasInjectionContext, getCurrentInstance, inject, defineComponent, ref, computed, mergeProps, watch, getCurrentScope, toRef, createElementBlock, h, watchEffect, onScopeDispose, isVNode, createCommentVNode, isRef, toValue, Fragment, shallowRef, isReadonly, Suspense, useSSRContext, createTextVNode, isShallow, isReactive, toRaw } from 'vue';
import { Buffer as Buffer$1 } from 'node:buffer';
import Bt from 'node:http';
import zs from 'node:https';
import st from 'node:zlib';
import me, { PassThrough, pipeline } from 'node:stream';
import { promisify, deprecate, types } from 'node:util';
import { format } from 'node:url';
import { isIP } from 'node:net';
import { promises, statSync, createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { b as baseURL } from '../routes/renderer.mjs';
import { RouterView, createMemoryHistory, createRouter, START_LOCATION, isNavigationFailure, NavigationFailureType } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

// \0rolldown/runtime.js
var __require = /* #__PURE__ */ (() => createRequire(globalThis._importMeta_.url))();
var captureStackTrace = Error.captureStackTrace;
var Diagnostic = class Diagnostic extends Error {
	name;
	/**
	* The diagnostic code, e.g. `MATH_E001`.
	* Also appears as the `name` property.
	*/
	code;
	/**
	* URL to extended documentation for this diagnostic code.
	* Auto-generated from {@link DefineDiagnosticsOptions.docsBase}.
	*/
	docs;
	/**
	* Optional actionable instructions on how to resolve the problem.
	*/
	fix;
	/**
	* Locations in user code that contributed to this diagnostic, in
	* `file:line:column` format. Relevant when the stack trace doesn't reflect
	* the user's source (e.g. compilers, bundlers), otherwise redundant with the
	* stack and should be omitted.
	*/
	sources;
	/**
	* Structured information associated with this diagnostic code.
	*/
	data;
	/**
	* Alias for {@link Error.message}: the reason this diagnostic was raised.
	*/
	get why() {
		return this.message;
	}
	/**
	* @param init        structured initializer; `why` is required
	* @param captureFrom V8 stack-cutoff frame. Defaults to {@link Diagnostic}
	* so the top of the trace is the `new Diagnostic(...)` call site.
	* `defineDiagnostics` passes its action method to strip its own frames too.
	* Ignored on engines without `Error.captureStackTrace`.
	*/
	constructor(init, captureFrom = Diagnostic) {
		super(init.why, { cause: init.cause });
		this.code = this.name = init.code;
		this.fix = init.fix;
		this.docs = init.docs;
		this.sources = init.sources;
		this.data = init.data;
		captureStackTrace?.(this, captureFrom);
	}
	/**
	* Converts the diagnostic into a serializable structured object.
	*/
	toJSON() {
		return {
			name: this.name,
			why: this.why,
			fix: this.fix,
			docs: this.docs,
			sources: this.sources,
			cause: this.cause,
			data: this.data,
			stack: this.stack
		};
	}
};
/**
* Resolves the docs URL for a code from a `docsBase` (string template or
* resolver function). Shared by {@link defineDiagnostics} and
* {@link defineProdDiagnostics}. Per-code `docs` overrides are handled by the
* caller; this only covers the `docsBase`-derived case.
*
* @internal
*/
function deriveDocs(docsBase, code) {
	return typeof docsBase === "string" ? `${docsBase}/${code.toLowerCase()}` : docsBase?.(code);
}
/**
* Production counterpart to {@link defineDiagnostics}. Returns a `Proxy` that
* builds a minimal {@link Diagnostic} for any accessed code: the code becomes
* the instance `name`, `docs` is derived from `docsBase`, and `why` points to
* the docs URL when one exists (empty otherwise, so the thrown header is just
* the code). It carries no catalog text or data, so it stays tiny in a bundle.
*
* The strip plugin (`@nostics/unplugin`) can rewrite a `defineDiagnostics()`
* call into a `"production" === 'production'` ternary that selects this
* factory in production, dropping every `why`/`fix` string from the bundle.
*
* @example
* ```ts
* const diagnostics = defineProdDiagnostics({ docsBase: 'https://docs.example.com' })
* throw diagnostics.NUXT_B2011() // NUXT_B2011: https://docs.example.com/nuxt_b2011
* ```
*/
/* @__NO_SIDE_EFFECTS__ */
function defineProdDiagnostics(options = {}) {
	const { docsBase, reporters = [] } = options;
	return new Proxy({}, { get(_target, code) {
		if (typeof code !== "string") return void 0;
		const handle = (params = {}, reporterOptions = {}) => {
			const docs = deriveDocs(docsBase, code);
			const diagnostic = new Diagnostic({
				code,
				why: docs ?? "",
				docs,
				cause: params.cause,
				sources: params.sources
			}, handle);
			for (const reporter of reporters) reporter(diagnostic, reporterOptions);
			return diagnostic;
		};
		return handle;
	} });
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/.bun/unctx@3.0.1+8f0137b53f84f0e6/node_modules/unctx/dist/index.mjs
function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
var _WeakRef = globalThis.WeakRef || class StrongRef {
	#value;
	constructor(value) {
		this.#value = value;
	}
	deref() {
		return this.#value;
	}
};
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new _WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance() ?? null;
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
var _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
var globalKey = "__unctx__";
var defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
var getContext$1 = (key, opts = {}) => defaultNamespace.get(key, opts);
var asyncHandlersKey = "__unctx_async_handlers__";
var asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
	const restores = [];
	for (const leaveHandler of asyncHandlers) {
		const restore = leaveHandler();
		if (restore) restores.push(restore);
	}
	const restore = () => {
		for (const restore of restores) restore();
	};
	let awaitable = function_();
	if (awaitable && typeof awaitable === "object" && "catch" in awaitable) awaitable = awaitable.catch((error) => {
		restore();
		throw error;
	});
	return [awaitable, restore];
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/internal/context.js
globalThis.__nuxt_app_ctx__ ||= {};
function getContext(key, opts) {
	return getContext$1(key, opts);
}
// node_modules/.bun/hookable@6.1.2/node_modules/hookable/dist/index.mjs
function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
var createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks$1(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks$1(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks$1(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.6.4";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const runHooks = async (hooks, args) => {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		const contextCaller = runHooks;
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
var HASH_RE$1 = /#/g;
var AMPERSAND_RE = /&/g;
var SLASH_RE = /\//g;
var EQUAL_RE = /=/g;
var PLUS_RE = /\+/g;
var ENC_CARET_RE = /%5e/gi;
var ENC_BACKTICK_RE = /%60/gi;
var ENC_PIPE_RE$1 = /%7c/gi;
var ENC_SPACE_RE = /%20/gi;
var ENC_SLASH_RE = /%2f/gi;
function encode(text) {
	return encodeURI("" + text).replace(ENC_PIPE_RE$1, "|");
}
function encodeQueryValue(input) {
	return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE$1, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
	return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
	try {
		return decodeURIComponent("" + text);
	} catch {
		return "" + text;
	}
}
function decodePath(text) {
	return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
	return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
	return decode(text.replace(PLUS_RE, " "));
}
function parseQuery(parametersString = "") {
	const object = /* @__PURE__ */ Object.create(null);
	if (parametersString[0] === "?") parametersString = parametersString.slice(1);
	for (const parameter of parametersString.split("&")) {
		const s = parameter.match(/([^=]+)=?(.*)/) || [];
		if (s.length < 2) continue;
		const key = decodeQueryKey(s[1]);
		if (key === "__proto__" || key === "constructor") continue;
		const value = decodeQueryValue(s[2] || "");
		if (object[key] === void 0) object[key] = value;
		else if (Array.isArray(object[key])) object[key].push(value);
		else object[key] = [object[key], value];
	}
	return object;
}
function encodeQueryItem(key, value) {
	if (typeof value === "number" || typeof value === "boolean") value = String(value);
	if (!value) return encodeQueryKey(key);
	if (Array.isArray(value)) return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
	return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
	return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
var PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
	if (typeof opts === "boolean") opts = { acceptRelative: opts };
	if (opts.strict) return PROTOCOL_STRICT_REGEX.test(inputString);
	return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
	return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
	return input.endsWith("/");
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
	return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
	return input.endsWith("/") ? input : input + "/";
}
function withBase(input, base) {
	if (isEmptyURL(base) || hasProtocol(input)) return input;
	const _base = withoutTrailingSlash(base);
	if (input.startsWith(_base)) {
		const nextChar = input[_base.length];
		if (!nextChar || nextChar === "/" || nextChar === "?") return input;
	}
	return joinURL(_base, input);
}
function withQuery(input, query) {
	const parsed = parseURL(input);
	parsed.search = stringifyQuery({
		...parseQuery(parsed.search),
		...query
	});
	return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
	return !url || url === "/";
}
function isNonEmptyURL(url) {
	return url && url !== "/";
}
function joinURL(base, ...input) {
	let url = base || "";
	for (const segment of input.filter((url2) => isNonEmptyURL(url2))) if (url) {
		const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
		url = withTrailingSlash(url) + _segment;
	} else url = segment;
	return url;
}
var protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
	const _specialProtoMatch = input.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
	if (_specialProtoMatch) {
		const [, _proto, _pathname = ""] = _specialProtoMatch;
		return {
			protocol: _proto.toLowerCase(),
			pathname: _pathname,
			href: _proto + _pathname,
			auth: "",
			host: "",
			search: "",
			hash: ""
		};
	}
	if (!hasProtocol(input, { acceptRelative: true })) return parsePath(input);
	const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
	let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
	if (protocol === "file:") path = path.replace(/\/(?=[A-Za-z]:)/, "");
	const { pathname, search, hash } = parsePath(path);
	return {
		protocol: protocol.toLowerCase(),
		auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
		host,
		pathname,
		search,
		hash,
		[protocolRelative]: !protocol
	};
}
function parsePath(input = "") {
	const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
	return {
		pathname,
		search,
		hash
	};
}
function stringifyParsedURL(parsed) {
	const pathname = parsed.pathname || "";
	const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
	const hash = parsed.hash || "";
	const auth = parsed.auth ? parsed.auth + "@" : "";
	const host = parsed.host || "";
	return (parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "") + auth + host + pathname + search + hash;
}
// node_modules/.bun/destr@2.0.5/node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
// node_modules/.bun/h3@1.15.11/node_modules/h3/dist/index.mjs
function hasProp(obj, prop) {
	try {
		return prop in obj;
	} catch {
		return false;
	}
}
var H3Error = class extends Error {
	static __h3_error__ = true;
	statusCode = 500;
	fatal = false;
	unhandled = false;
	statusMessage;
	data;
	cause;
	constructor(message, opts = {}) {
		super(message, opts);
		if (opts.cause && !this.cause) this.cause = opts.cause;
	}
	toJSON() {
		const obj = {
			message: this.message,
			statusCode: sanitizeStatusCode(this.statusCode, 500)
		};
		if (this.statusMessage) obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
		if (this.data !== void 0) obj.data = this.data;
		return obj;
	}
};
function createError$1(input) {
	if (typeof input === "string") return new H3Error(input);
	if (isError(input)) return input;
	const err = new H3Error(input.message ?? input.statusMessage ?? "", { cause: input.cause || input });
	if (hasProp(input, "stack")) try {
		Object.defineProperty(err, "stack", { get() {
			return input.stack;
		} });
	} catch {
		try {
			err.stack = input.stack;
		} catch {}
	}
	if (input.data) err.data = input.data;
	if (input.statusCode) err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
	else if (input.status) err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
	if (input.statusMessage) err.statusMessage = input.statusMessage;
	else if (input.statusText) err.statusMessage = input.statusText;
	if (err.statusMessage) {
		const originalMessage = err.statusMessage;
		if (sanitizeStatusMessage(err.statusMessage) !== originalMessage) console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
	}
	if (input.fatal !== void 0) err.fatal = input.fatal;
	if (input.unhandled !== void 0) err.unhandled = input.unhandled;
	return err;
}
function isError(input) {
	return input?.constructor?.__h3_error__ === true;
}
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = Number.parseInt(statusCode, 10);
	if (statusCode < 100 || statusCode > 999) return defaultStatusCode;
	return statusCode;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError = (error) => {
	if (isNuxtError(error)) return error;
	if (typeof error !== "string" && error?.statusText) error.message ??= error.statusText;
	const nuxtError = createError$1(error ?? {});
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
/** An error raised deliberately with an HTTP status, as h3 recognises one. */
function isHTTPError(value) {
	return value instanceof Error && value.constructor?.__h3_error__ === true;
}
/**
* Wrap whatever the app threw. Anything other than an HTTP error is marked `unhandled`,
* which keeps its message and `data` out of the response and the payload. In development
* the thrown value and where the app was are remembered for the error report.
*
* @internal
*/
function createErrorFromThrown(thrown, context) {
	const error = createError(thrown);
	if (error !== thrown && !isHTTPError(thrown)) error.unhandled = true;
	return error;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/utils.js
var PROBE_BASE_A = "https://a.invalid/probe/";
var PROBE_BASE_B = "https://b.invalid/probe/";
function parseAnchorURL(value, base = PROBE_BASE_A) {
	try {
		return new URL(value, base);
	} catch {
		return null;
	}
}
function resolvesWithoutBase(value) {
	const resolved = parseAnchorURL(value);
	return !!resolved && resolved.href === parseAnchorURL(value, PROBE_BASE_B)?.href;
}
/** Whether a URL string is a path rooted at the current origin, so carries no protocol. */
function isRootedPath(value) {
	if (value[0] !== "/" || value[1] === "/" || value[1] === "\\") return false;
	return value[1] !== "	" && value[1] !== "\n" && value[1] !== "\r" || !resolvesWithoutBase(value);
}
/** Whether a URL string carries its own protocol or authority. */
function isAbsoluteHref(value) {
	return !!value && !isRootedPath(value) && resolvesWithoutBase(value);
}
/** The script-capable protocol a URL string would navigate to, or `null` when it is safe. */
function getScriptProtocol(value) {
	if (!value || isRootedPath(value)) return null;
	let resolved = parseAnchorURL(value.replace(/[\u0000-\u001F\u007F\s]+/g, ""));
	while (resolved?.protocol === "view-source:") resolved = parseAnchorURL(resolved.pathname);
	if (!resolved) return "";
	return isScriptProtocol(resolved.protocol) ? resolved.protocol : null;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var PageRouteSymbol = Symbol("route");
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = (() => {
	return useNuxtApp()?.$router;
});
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function getParentScope(scope) {
	const internal = scope;
	return internal.parent ?? internal.subs?.sub;
}
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = getParentScope(scope);
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
function navigateTo(to, options) {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = isAbsoluteHref(toPath);
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const protocol = getScriptProtocol(toPath);
		if (protocol !== null) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			let expectedPath = fullPath;
			if (typeof to === "string" && toPath.includes("?")) {
				const target = router.resolve(to);
				expectedPath = router.resolve({
					path: target.path,
					query: target.query,
					hash: target.hash
				}).fullPath || "/";
			}
			router.afterEach((final) => final.fullPath === expectedPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._cookieWriters?.forEach((write) => write());
		(void 0).addEventListener("pagehide", (event) => {
			if (!event.persisted) nuxtApp._scope.stop();
		}, { once: true });
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
}
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodeVueRouterPath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
var ENC_PIPE_RE = /%7C/g;
var ENC_BRACKET_OPEN_RE = /%5B/g;
var ENC_BRACKET_CLOSE_RE = /%5D/g;
var ENC_ENC_SLASH_RE = /%252F/gi;
var HASH_RE = /#/g;
var QUESTION_MARK_RE = /\?/g;
/**
* Apply vue-router's own path encoding, which leaves sub-delimiters like `&`
* and `+` literal. This must stay in sync with `encodeVueRouterPath` in
* `unrouting`, which encodes the route records we need to match against.
*/
function encodeVueRouterPath(value) {
	return encodeURI(value).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]").replace(HASH_RE, "%23").replace(QUESTION_MARK_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F");
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/composables/error.js
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	await nuxtApp.runWithContext(() => showError(createErrorFromThrown(error)));
};
// node_modules/.bun/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/shared/node-fetch-native.DfbY2q-x.mjs
var t = Object.defineProperty;
var o$1 = (e, l) => t(e, "name", {
	value: l,
	configurable: true
});
var n$2 = typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f$5(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
o$1(f$5, "getDefaultExportFromCjs");
// node_modules/.bun/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/node.mjs
var Os = Object.defineProperty;
var fi = (i) => {
	throw TypeError(i);
};
var n$1 = (i, o) => Os(i, "name", {
	value: o,
	configurable: true
});
var ci = (i, o, a) => o.has(i) || fi("Cannot " + a);
var O$1 = (i, o, a) => (ci(i, o, "read from private field"), a ? a.call(i) : o.get(i));
var be = (i, o, a) => o.has(i) ? fi("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(i) : o.set(i, a);
var X = (i, o, a, f) => (ci(i, o, "write to private field"), o.set(i, a), a);
var ve;
var zt;
var bt;
var Cr;
var ze;
var It;
var Ft;
var mt;
var ee;
var yt;
var He;
var Ve;
var gt;
function Us(i) {
	if (!/^data:/i.test(i)) throw new TypeError("`uri` does not appear to be a Data URI (must begin with \"data:\")");
	i = i.replace(/\r?\n/g, "");
	const o = i.indexOf(",");
	if (o === -1 || o <= 4) throw new TypeError("malformed data: URI");
	const a = i.substring(5, o).split(";");
	let f = "", l = false;
	const p = a[0] || "text/plain";
	let h = p;
	for (let A = 1; A < a.length; A++) a[A] === "base64" ? l = true : a[A] && (h += `;${a[A]}`, a[A].indexOf("charset=") === 0 && (f = a[A].substring(8)));
	!a[0] && !f.length && (h += ";charset=US-ASCII", f = "US-ASCII");
	const S = l ? "base64" : "ascii", v = unescape(i.substring(o + 1)), w = Buffer.from(v, S);
	return w.type = p, w.typeFull = h, w.charset = f, w;
}
n$1(Us, "dataUriToBuffer");
var pi = {};
var kt = { exports: {} };
/**
* @license
* web-streams-polyfill v3.3.3
* Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
* This code is released under the MIT license.
* SPDX-License-Identifier: MIT
*/ var xs = kt.exports;
var bi;
function Ns() {
	return bi || (bi = 1, function(i, o) {
		(function(a, f) {
			f(o);
		})(xs, function(a) {
			function f() {}
			n$1(f, "noop");
			function l(e) {
				return typeof e == "object" && e !== null || typeof e == "function";
			}
			n$1(l, "typeIsObject");
			const p = f;
			function h(e, t) {
				try {
					Object.defineProperty(e, "name", {
						value: t,
						configurable: !0
					});
				} catch {}
			}
			n$1(h, "setFunctionName");
			const S = Promise, v = Promise.prototype.then, w = Promise.reject.bind(S);
			function A(e) {
				return new S(e);
			}
			n$1(A, "newPromise");
			function T(e) {
				return A((t) => t(e));
			}
			n$1(T, "promiseResolvedWith");
			function b(e) {
				return w(e);
			}
			n$1(b, "promiseRejectedWith");
			function q(e, t, r) {
				return v.call(e, t, r);
			}
			n$1(q, "PerformPromiseThen");
			function g(e, t, r) {
				q(q(e, t, r), void 0, p);
			}
			n$1(g, "uponPromise");
			function V(e, t) {
				g(e, t);
			}
			n$1(V, "uponFulfillment");
			function I(e, t) {
				g(e, void 0, t);
			}
			n$1(I, "uponRejection");
			function F(e, t, r) {
				return q(e, t, r);
			}
			n$1(F, "transformPromiseWith");
			function Q(e) {
				q(e, void 0, p);
			}
			n$1(Q, "setPromiseIsHandledToTrue");
			let ge = n$1((e) => {
				if (typeof queueMicrotask == "function") ge = queueMicrotask;
				else {
					const t = T(void 0);
					ge = n$1((r) => q(t, r), "_queueMicrotask");
				}
				return ge(e);
			}, "_queueMicrotask");
			function z(e, t, r) {
				if (typeof e != "function") throw new TypeError("Argument is not a function");
				return Function.prototype.apply.call(e, t, r);
			}
			n$1(z, "reflectCall");
			function j(e, t, r) {
				try {
					return T(z(e, t, r));
				} catch (s) {
					return b(s);
				}
			}
			n$1(j, "promiseCall");
			const U = 16384, bn = class bn {
				constructor() {
					this._cursor = 0, this._size = 0, this._front = {
						_elements: [],
						_next: void 0
					}, this._back = this._front, this._cursor = 0, this._size = 0;
				}
				get length() {
					return this._size;
				}
				push(t) {
					const r = this._back;
					let s = r;
					r._elements.length === 16383 && (s = {
						_elements: [],
						_next: void 0
					}), r._elements.push(t), s !== r && (this._back = s, r._next = s), ++this._size;
				}
				shift() {
					const t = this._front;
					let r = t;
					const s = this._cursor;
					let u = s + 1;
					const c = t._elements, d = c[s];
					return u === U && (r = t._next, u = 0), --this._size, this._cursor = u, t !== r && (this._front = r), c[s] = void 0, d;
				}
				forEach(t) {
					let r = this._cursor, s = this._front, u = s._elements;
					for (; (r !== u.length || s._next !== void 0) && !(r === u.length && (s = s._next, u = s._elements, r = 0, u.length === 0));) t(u[r]), ++r;
				}
				peek() {
					const t = this._front, r = this._cursor;
					return t._elements[r];
				}
			};
			n$1(bn, "SimpleQueue");
			let D = bn;
			const jt = Symbol("[[AbortSteps]]"), Qn = Symbol("[[ErrorSteps]]"), Ar = Symbol("[[CancelSteps]]"), Br = Symbol("[[PullSteps]]"), kr = Symbol("[[ReleaseSteps]]");
			function Yn(e, t) {
				e._ownerReadableStream = t, t._reader = e, t._state === "readable" ? qr(e) : t._state === "closed" ? xi(e) : Gn(e, t._storedError);
			}
			n$1(Yn, "ReadableStreamReaderGenericInitialize");
			function Wr(e, t) {
				const r = e._ownerReadableStream;
				return ie(r, t);
			}
			n$1(Wr, "ReadableStreamReaderGenericCancel");
			function _e(e) {
				const t = e._ownerReadableStream;
				t._state === "readable" ? Or(e, /* @__PURE__ */ new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Ni(e, /* @__PURE__ */ new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t._readableStreamController[kr](), t._reader = void 0, e._ownerReadableStream = void 0;
			}
			n$1(_e, "ReadableStreamReaderGenericRelease");
			function Lt(e) {
				return /* @__PURE__ */ new TypeError("Cannot " + e + " a stream using a released reader");
			}
			n$1(Lt, "readerLockException");
			function qr(e) {
				e._closedPromise = A((t, r) => {
					e._closedPromise_resolve = t, e._closedPromise_reject = r;
				});
			}
			n$1(qr, "defaultReaderClosedPromiseInitialize");
			function Gn(e, t) {
				qr(e), Or(e, t);
			}
			n$1(Gn, "defaultReaderClosedPromiseInitializeAsRejected");
			function xi(e) {
				qr(e), Zn(e);
			}
			n$1(xi, "defaultReaderClosedPromiseInitializeAsResolved");
			function Or(e, t) {
				e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
			}
			n$1(Or, "defaultReaderClosedPromiseReject");
			function Ni(e, t) {
				Gn(e, t);
			}
			n$1(Ni, "defaultReaderClosedPromiseResetToRejected");
			function Zn(e) {
				e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
			}
			n$1(Zn, "defaultReaderClosedPromiseResolve");
			const Kn = Number.isFinite || function(e) {
				return typeof e == "number" && isFinite(e);
			}, Hi = Math.trunc || function(e) {
				return e < 0 ? Math.ceil(e) : Math.floor(e);
			};
			function Vi(e) {
				return typeof e == "object" || typeof e == "function";
			}
			n$1(Vi, "isDictionary");
			function ue(e, t) {
				if (e !== void 0 && !Vi(e)) throw new TypeError(`${t} is not an object.`);
			}
			n$1(ue, "assertDictionary");
			function Z(e, t) {
				if (typeof e != "function") throw new TypeError(`${t} is not a function.`);
			}
			n$1(Z, "assertFunction");
			function Qi(e) {
				return typeof e == "object" && e !== null || typeof e == "function";
			}
			n$1(Qi, "isObject");
			function Jn(e, t) {
				if (!Qi(e)) throw new TypeError(`${t} is not an object.`);
			}
			n$1(Jn, "assertObject");
			function Se(e, t, r) {
				if (e === void 0) throw new TypeError(`Parameter ${t} is required in '${r}'.`);
			}
			n$1(Se, "assertRequiredArgument");
			function zr(e, t, r) {
				if (e === void 0) throw new TypeError(`${t} is required in '${r}'.`);
			}
			n$1(zr, "assertRequiredField");
			function Ir(e) {
				return Number(e);
			}
			n$1(Ir, "convertUnrestrictedDouble");
			function Xn(e) {
				return e === 0 ? 0 : e;
			}
			n$1(Xn, "censorNegativeZero");
			function Yi(e) {
				return Xn(Hi(e));
			}
			n$1(Yi, "integerPart");
			function Fr(e, t) {
				const s = Number.MAX_SAFE_INTEGER;
				let u = Number(e);
				if (u = Xn(u), !Kn(u)) throw new TypeError(`${t} is not a finite number`);
				if (u = Yi(u), u < 0 || u > s) throw new TypeError(`${t} is outside the accepted range of 0 to ${s}, inclusive`);
				return !Kn(u) || u === 0 ? 0 : u;
			}
			n$1(Fr, "convertUnsignedLongLongWithEnforceRange");
			function jr(e, t) {
				if (!We(e)) throw new TypeError(`${t} is not a ReadableStream.`);
			}
			n$1(jr, "assertReadableStream");
			function Qe(e) {
				return new fe(e);
			}
			n$1(Qe, "AcquireReadableStreamDefaultReader");
			function eo(e, t) {
				e._reader._readRequests.push(t);
			}
			n$1(eo, "ReadableStreamAddReadRequest");
			function Lr(e, t, r) {
				const u = e._reader._readRequests.shift();
				r ? u._closeSteps() : u._chunkSteps(t);
			}
			n$1(Lr, "ReadableStreamFulfillReadRequest");
			function $t(e) {
				return e._reader._readRequests.length;
			}
			n$1($t, "ReadableStreamGetNumReadRequests");
			function to(e) {
				const t = e._reader;
				return !(t === void 0 || !Ee(t));
			}
			n$1(to, "ReadableStreamHasDefaultReader");
			const mn = class mn {
				constructor(t) {
					if (Se(t, 1, "ReadableStreamDefaultReader"), jr(t, "First parameter"), qe(t)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
					Yn(this, t), this._readRequests = new D();
				}
				get closed() {
					return Ee(this) ? this._closedPromise : b(Dt("closed"));
				}
				cancel(t = void 0) {
					return Ee(this) ? this._ownerReadableStream === void 0 ? b(Lt("cancel")) : Wr(this, t) : b(Dt("cancel"));
				}
				read() {
					if (!Ee(this)) return b(Dt("read"));
					if (this._ownerReadableStream === void 0) return b(Lt("read from"));
					let t, r;
					const s = A((c, d) => {
						t = c, r = d;
					});
					return _t(this, {
						_chunkSteps: n$1((c) => t({
							value: c,
							done: false
						}), "_chunkSteps"),
						_closeSteps: n$1(() => t({
							value: void 0,
							done: true
						}), "_closeSteps"),
						_errorSteps: n$1((c) => r(c), "_errorSteps")
					}), s;
				}
				releaseLock() {
					if (!Ee(this)) throw Dt("releaseLock");
					this._ownerReadableStream !== void 0 && Gi(this);
				}
			};
			n$1(mn, "ReadableStreamDefaultReader");
			let fe = mn;
			Object.defineProperties(fe.prototype, {
				cancel: { enumerable: true },
				read: { enumerable: true },
				releaseLock: { enumerable: true },
				closed: { enumerable: true }
			}), h(fe.prototype.cancel, "cancel"), h(fe.prototype.read, "read"), h(fe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(fe.prototype, Symbol.toStringTag, {
				value: "ReadableStreamDefaultReader",
				configurable: true
			});
			function Ee(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? false : e instanceof fe;
			}
			n$1(Ee, "IsReadableStreamDefaultReader");
			function _t(e, t) {
				const r = e._ownerReadableStream;
				r._disturbed = true, r._state === "closed" ? t._closeSteps() : r._state === "errored" ? t._errorSteps(r._storedError) : r._readableStreamController[Br](t);
			}
			n$1(_t, "ReadableStreamDefaultReaderRead");
			function Gi(e) {
				_e(e);
				ro(e, /* @__PURE__ */ new TypeError("Reader was released"));
			}
			n$1(Gi, "ReadableStreamDefaultReaderRelease");
			function ro(e, t) {
				const r = e._readRequests;
				e._readRequests = new D(), r.forEach((s) => {
					s._errorSteps(t);
				});
			}
			n$1(ro, "ReadableStreamDefaultReaderErrorReadRequests");
			function Dt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
			}
			n$1(Dt, "defaultReaderBrandCheckException");
			const Zi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype), yn = class yn {
				constructor(t, r) {
					this._ongoingPromise = void 0, this._isFinished = false, this._reader = t, this._preventCancel = r;
				}
				next() {
					const t = n$1(() => this._nextSteps(), "nextSteps");
					return this._ongoingPromise = this._ongoingPromise ? F(this._ongoingPromise, t, t) : t(), this._ongoingPromise;
				}
				return(t) {
					const r = n$1(() => this._returnSteps(t), "returnSteps");
					return this._ongoingPromise ? F(this._ongoingPromise, r, r) : r();
				}
				_nextSteps() {
					if (this._isFinished) return Promise.resolve({
						value: void 0,
						done: true
					});
					const t = this._reader;
					let r, s;
					const u = A((d, m) => {
						r = d, s = m;
					});
					return _t(t, {
						_chunkSteps: n$1((d) => {
							this._ongoingPromise = void 0, ge(() => r({
								value: d,
								done: false
							}));
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							this._ongoingPromise = void 0, this._isFinished = true, _e(t), r({
								value: void 0,
								done: true
							});
						}, "_closeSteps"),
						_errorSteps: n$1((d) => {
							this._ongoingPromise = void 0, this._isFinished = true, _e(t), s(d);
						}, "_errorSteps")
					}), u;
				}
				_returnSteps(t) {
					if (this._isFinished) return Promise.resolve({
						value: t,
						done: true
					});
					this._isFinished = true;
					const r = this._reader;
					if (!this._preventCancel) {
						const s = Wr(r, t);
						return _e(r), F(s, () => ({
							value: t,
							done: true
						}));
					}
					return _e(r), T({
						value: t,
						done: true
					});
				}
			};
			n$1(yn, "ReadableStreamAsyncIteratorImpl");
			let Mt = yn;
			const no = {
				next() {
					return oo(this) ? this._asyncIteratorImpl.next() : b(io("next"));
				},
				return(e) {
					return oo(this) ? this._asyncIteratorImpl.return(e) : b(io("return"));
				}
			};
			Object.setPrototypeOf(no, Zi);
			function Ki(e, t) {
				const r = Qe(e), s = new Mt(r, t), u = Object.create(no);
				return u._asyncIteratorImpl = s, u;
			}
			n$1(Ki, "AcquireReadableStreamAsyncIterator");
			function oo(e) {
				if (!l(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl")) return false;
				try {
					return e._asyncIteratorImpl instanceof Mt;
				} catch {
					return false;
				}
			}
			n$1(oo, "IsReadableStreamAsyncIterator");
			function io(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
			}
			n$1(io, "streamAsyncIteratorBrandCheckException");
			const ao = Number.isNaN || function(e) {
				return e !== e;
			};
			var $r, Dr, Mr;
			function St(e) {
				return e.slice();
			}
			n$1(St, "CreateArrayFromList");
			function so(e, t, r, s, u) {
				new Uint8Array(e).set(new Uint8Array(r, s, u), t);
			}
			n$1(so, "CopyDataBlockBytes");
			let we = n$1((e) => (typeof e.transfer == "function" ? we = n$1((t) => t.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? we = n$1((t) => structuredClone(t, { transfer: [t] }), "TransferArrayBuffer") : we = n$1((t) => t, "TransferArrayBuffer"), we(e)), "TransferArrayBuffer"), Ae = n$1((e) => (typeof e.detached == "boolean" ? Ae = n$1((t) => t.detached, "IsDetachedBuffer") : Ae = n$1((t) => t.byteLength === 0, "IsDetachedBuffer"), Ae(e)), "IsDetachedBuffer");
			function lo(e, t, r) {
				if (e.slice) return e.slice(t, r);
				const s = r - t, u = new ArrayBuffer(s);
				return so(u, 0, e, t, s), u;
			}
			n$1(lo, "ArrayBufferSlice");
			function Ut(e, t) {
				const r = e[t];
				if (r != null) {
					if (typeof r != "function") throw new TypeError(`${String(t)} is not a function`);
					return r;
				}
			}
			n$1(Ut, "GetMethod");
			function Ji(e) {
				const t = { [Symbol.iterator]: () => e.iterator }, r = async function* () {
					return yield* t;
				}();
				return {
					iterator: r,
					nextMethod: r.next,
					done: false
				};
			}
			n$1(Ji, "CreateAsyncFromSyncIterator");
			const Ur = (Mr = ($r = Symbol.asyncIterator) !== null && $r !== void 0 ? $r : (Dr = Symbol.for) === null || Dr === void 0 ? void 0 : Dr.call(Symbol, "Symbol.asyncIterator")) !== null && Mr !== void 0 ? Mr : "@@asyncIterator";
			function uo(e, t = "sync", r) {
				if (r === void 0) if (t === "async") {
					if (r = Ut(e, Ur), r === void 0) return Ji(uo(e, "sync", Ut(e, Symbol.iterator)));
				} else r = Ut(e, Symbol.iterator);
				if (r === void 0) throw new TypeError("The object is not iterable");
				const s = z(r, e, []);
				if (!l(s)) throw new TypeError("The iterator method must return an object");
				return {
					iterator: s,
					nextMethod: s.next,
					done: false
				};
			}
			n$1(uo, "GetIterator");
			function Xi(e) {
				const t = z(e.nextMethod, e.iterator, []);
				if (!l(t)) throw new TypeError("The iterator.next() method must return an object");
				return t;
			}
			n$1(Xi, "IteratorNext");
			function ea(e) {
				return !!e.done;
			}
			n$1(ea, "IteratorComplete");
			function ta(e) {
				return e.value;
			}
			n$1(ta, "IteratorValue");
			function ra(e) {
				return !(typeof e != "number" || ao(e) || e < 0);
			}
			n$1(ra, "IsNonNegativeNumber");
			function fo(e) {
				const t = lo(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
				return new Uint8Array(t);
			}
			n$1(fo, "CloneAsUint8Array");
			function xr(e) {
				const t = e._queue.shift();
				return e._queueTotalSize -= t.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t.value;
			}
			n$1(xr, "DequeueValue");
			function Nr(e, t, r) {
				if (!ra(r) || r === 1 / 0) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
				e._queue.push({
					value: t,
					size: r
				}), e._queueTotalSize += r;
			}
			n$1(Nr, "EnqueueValueWithSize");
			function na(e) {
				return e._queue.peek().value;
			}
			n$1(na, "PeekQueueValue");
			function Be(e) {
				e._queue = new D(), e._queueTotalSize = 0;
			}
			n$1(Be, "ResetQueue");
			function co(e) {
				return e === DataView;
			}
			n$1(co, "isDataViewConstructor");
			function oa(e) {
				return co(e.constructor);
			}
			n$1(oa, "isDataView");
			function ia(e) {
				return co(e) ? 1 : e.BYTES_PER_ELEMENT;
			}
			n$1(ia, "arrayBufferViewElementSize");
			const gn = class gn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get view() {
					if (!Hr(this)) throw Zr("view");
					return this._view;
				}
				respond(t) {
					if (!Hr(this)) throw Zr("respond");
					if (Se(t, 1, "respond"), t = Fr(t, "First parameter"), this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
					if (Ae(this._view.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
					Vt(this._associatedReadableByteStreamController, t);
				}
				respondWithNewView(t) {
					if (!Hr(this)) throw Zr("respondWithNewView");
					if (Se(t, 1, "respondWithNewView"), !ArrayBuffer.isView(t)) throw new TypeError("You can only respond with array buffer views");
					if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
					if (Ae(t.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
					Qt(this._associatedReadableByteStreamController, t);
				}
			};
			n$1(gn, "ReadableStreamBYOBRequest");
			let Re = gn;
			Object.defineProperties(Re.prototype, {
				respond: { enumerable: true },
				respondWithNewView: { enumerable: true },
				view: { enumerable: true }
			}), h(Re.prototype.respond, "respond"), h(Re.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Re.prototype, Symbol.toStringTag, {
				value: "ReadableStreamBYOBRequest",
				configurable: true
			});
			const _n = class _n {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get byobRequest() {
					if (!Ie(this)) throw Rt("byobRequest");
					return Gr(this);
				}
				get desiredSize() {
					if (!Ie(this)) throw Rt("desiredSize");
					return Ro(this);
				}
				close() {
					if (!Ie(this)) throw Rt("close");
					if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
					const t = this._controlledReadableByteStream._state;
					if (t !== "readable") throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);
					wt(this);
				}
				enqueue(t) {
					if (!Ie(this)) throw Rt("enqueue");
					if (Se(t, 1, "enqueue"), !ArrayBuffer.isView(t)) throw new TypeError("chunk must be an array buffer view");
					if (t.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
					if (t.buffer.byteLength === 0) throw new TypeError("chunk's buffer must have non-zero byteLength");
					if (this._closeRequested) throw new TypeError("stream is closed or draining");
					const r = this._controlledReadableByteStream._state;
					if (r !== "readable") throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);
					Ht(this, t);
				}
				error(t = void 0) {
					if (!Ie(this)) throw Rt("error");
					K(this, t);
				}
				[Ar](t) {
					ho(this), Be(this);
					const r = this._cancelAlgorithm(t);
					return Nt(this), r;
				}
				[Br](t) {
					const r = this._controlledReadableByteStream;
					if (this._queueTotalSize > 0) {
						wo(this, t);
						return;
					}
					const s = this._autoAllocateChunkSize;
					if (s !== void 0) {
						let u;
						try {
							u = new ArrayBuffer(s);
						} catch (d) {
							t._errorSteps(d);
							return;
						}
						const c = {
							buffer: u,
							bufferByteLength: s,
							byteOffset: 0,
							byteLength: s,
							bytesFilled: 0,
							minimumFill: 1,
							elementSize: 1,
							viewConstructor: Uint8Array,
							readerType: "default"
						};
						this._pendingPullIntos.push(c);
					}
					eo(r, t), Fe(this);
				}
				[kr]() {
					if (this._pendingPullIntos.length > 0) {
						const t = this._pendingPullIntos.peek();
						t.readerType = "none", this._pendingPullIntos = new D(), this._pendingPullIntos.push(t);
					}
				}
			};
			n$1(_n, "ReadableByteStreamController");
			let te = _n;
			Object.defineProperties(te.prototype, {
				close: { enumerable: true },
				enqueue: { enumerable: true },
				error: { enumerable: true },
				byobRequest: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(te.prototype.close, "close"), h(te.prototype.enqueue, "enqueue"), h(te.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(te.prototype, Symbol.toStringTag, {
				value: "ReadableByteStreamController",
				configurable: true
			});
			function Ie(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? false : e instanceof te;
			}
			n$1(Ie, "IsReadableByteStreamController");
			function Hr(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? false : e instanceof Re;
			}
			n$1(Hr, "IsReadableStreamBYOBRequest");
			function Fe(e) {
				if (!fa(e)) return;
				if (e._pulling) {
					e._pullAgain = true;
					return;
				}
				e._pulling = true;
				g(e._pullAlgorithm(), () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, Fe(e)), null), (s) => (K(e, s), null));
			}
			n$1(Fe, "ReadableByteStreamControllerCallPullIfNeeded");
			function ho(e) {
				Qr(e), e._pendingPullIntos = new D();
			}
			n$1(ho, "ReadableByteStreamControllerClearPendingPullIntos");
			function Vr(e, t) {
				let r = false;
				e._state === "closed" && (r = true);
				const s = po(t);
				t.readerType === "default" ? Lr(e, s, r) : ma(e, s, r);
			}
			n$1(Vr, "ReadableByteStreamControllerCommitPullIntoDescriptor");
			function po(e) {
				const t = e.bytesFilled, r = e.elementSize;
				return new e.viewConstructor(e.buffer, e.byteOffset, t / r);
			}
			n$1(po, "ReadableByteStreamControllerConvertPullIntoDescriptor");
			function xt(e, t, r, s) {
				e._queue.push({
					buffer: t,
					byteOffset: r,
					byteLength: s
				}), e._queueTotalSize += s;
			}
			n$1(xt, "ReadableByteStreamControllerEnqueueChunkToQueue");
			function bo(e, t, r, s) {
				let u;
				try {
					u = lo(t, r, r + s);
				} catch (c) {
					throw K(e, c), c;
				}
				xt(e, u, 0, s);
			}
			n$1(bo, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
			function mo(e, t) {
				t.bytesFilled > 0 && bo(e, t.buffer, t.byteOffset, t.bytesFilled), Ye(e);
			}
			n$1(mo, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
			function yo(e, t) {
				const r = Math.min(e._queueTotalSize, t.byteLength - t.bytesFilled), s = t.bytesFilled + r;
				let u = r, c = false;
				const m = s - s % t.elementSize;
				m >= t.minimumFill && (u = m - t.bytesFilled, c = true);
				const R = e._queue;
				for (; u > 0;) {
					const y = R.peek(), C = Math.min(u, y.byteLength), P = t.byteOffset + t.bytesFilled;
					so(t.buffer, P, y.buffer, y.byteOffset, C), y.byteLength === C ? R.shift() : (y.byteOffset += C, y.byteLength -= C), e._queueTotalSize -= C, go(e, C, t), u -= C;
				}
				return c;
			}
			n$1(yo, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
			function go(e, t, r) {
				r.bytesFilled += t;
			}
			n$1(go, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
			function _o(e) {
				e._queueTotalSize === 0 && e._closeRequested ? (Nt(e), At(e._controlledReadableByteStream)) : Fe(e);
			}
			n$1(_o, "ReadableByteStreamControllerHandleQueueDrain");
			function Qr(e) {
				e._byobRequest !== null && (e._byobRequest._associatedReadableByteStreamController = void 0, e._byobRequest._view = null, e._byobRequest = null);
			}
			n$1(Qr, "ReadableByteStreamControllerInvalidateBYOBRequest");
			function Yr(e) {
				for (; e._pendingPullIntos.length > 0;) {
					if (e._queueTotalSize === 0) return;
					const t = e._pendingPullIntos.peek();
					yo(e, t) && (Ye(e), Vr(e._controlledReadableByteStream, t));
				}
			}
			n$1(Yr, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
			function aa(e) {
				const t = e._controlledReadableByteStream._reader;
				for (; t._readRequests.length > 0;) {
					if (e._queueTotalSize === 0) return;
					wo(e, t._readRequests.shift());
				}
			}
			n$1(aa, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
			function sa(e, t, r, s) {
				const u = e._controlledReadableByteStream, c = t.constructor, d = ia(c), { byteOffset: m, byteLength: R } = t, y = r * d;
				let C;
				try {
					C = we(t.buffer);
				} catch (B) {
					s._errorSteps(B);
					return;
				}
				const P = {
					buffer: C,
					bufferByteLength: C.byteLength,
					byteOffset: m,
					byteLength: R,
					bytesFilled: 0,
					minimumFill: y,
					elementSize: d,
					viewConstructor: c,
					readerType: "byob"
				};
				if (e._pendingPullIntos.length > 0) {
					e._pendingPullIntos.push(P), Po(u, s);
					return;
				}
				if (u._state === "closed") {
					const B = new c(P.buffer, P.byteOffset, 0);
					s._closeSteps(B);
					return;
				}
				if (e._queueTotalSize > 0) {
					if (yo(e, P)) {
						const B = po(P);
						_o(e), s._chunkSteps(B);
						return;
					}
					if (e._closeRequested) {
						const B = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
						K(e, B), s._errorSteps(B);
						return;
					}
				}
				e._pendingPullIntos.push(P), Po(u, s), Fe(e);
			}
			n$1(sa, "ReadableByteStreamControllerPullInto");
			function la(e, t) {
				t.readerType === "none" && Ye(e);
				const r = e._controlledReadableByteStream;
				if (Kr(r)) for (; vo(r) > 0;) Vr(r, Ye(e));
			}
			n$1(la, "ReadableByteStreamControllerRespondInClosedState");
			function ua(e, t, r) {
				if (go(e, t, r), r.readerType === "none") {
					mo(e, r), Yr(e);
					return;
				}
				if (r.bytesFilled < r.minimumFill) return;
				Ye(e);
				const s = r.bytesFilled % r.elementSize;
				if (s > 0) {
					const u = r.byteOffset + r.bytesFilled;
					bo(e, r.buffer, u - s, s);
				}
				r.bytesFilled -= s, Vr(e._controlledReadableByteStream, r), Yr(e);
			}
			n$1(ua, "ReadableByteStreamControllerRespondInReadableState");
			function So(e, t) {
				const r = e._pendingPullIntos.peek();
				Qr(e), e._controlledReadableByteStream._state === "closed" ? la(e, r) : ua(e, t, r), Fe(e);
			}
			n$1(So, "ReadableByteStreamControllerRespondInternal");
			function Ye(e) {
				return e._pendingPullIntos.shift();
			}
			n$1(Ye, "ReadableByteStreamControllerShiftPendingPullInto");
			function fa(e) {
				const t = e._controlledReadableByteStream;
				return t._state !== "readable" || e._closeRequested || !e._started ? false : !!(to(t) && $t(t) > 0 || Kr(t) && vo(t) > 0 || Ro(e) > 0);
			}
			n$1(fa, "ReadableByteStreamControllerShouldCallPull");
			function Nt(e) {
				e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0;
			}
			n$1(Nt, "ReadableByteStreamControllerClearAlgorithms");
			function wt(e) {
				const t = e._controlledReadableByteStream;
				if (!(e._closeRequested || t._state !== "readable")) {
					if (e._queueTotalSize > 0) {
						e._closeRequested = true;
						return;
					}
					if (e._pendingPullIntos.length > 0) {
						const r = e._pendingPullIntos.peek();
						if (r.bytesFilled % r.elementSize !== 0) {
							const s = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
							throw K(e, s), s;
						}
					}
					Nt(e), At(t);
				}
			}
			n$1(wt, "ReadableByteStreamControllerClose");
			function Ht(e, t) {
				const r = e._controlledReadableByteStream;
				if (e._closeRequested || r._state !== "readable") return;
				const { buffer: s, byteOffset: u, byteLength: c } = t;
				if (Ae(s)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
				const d = we(s);
				if (e._pendingPullIntos.length > 0) {
					const m = e._pendingPullIntos.peek();
					if (Ae(m.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
					Qr(e), m.buffer = we(m.buffer), m.readerType === "none" && mo(e, m);
				}
				if (to(r)) if (aa(e), $t(r) === 0) xt(e, d, u, c);
				else {
					e._pendingPullIntos.length > 0 && Ye(e);
					Lr(r, new Uint8Array(d, u, c), false);
				}
				else Kr(r) ? (xt(e, d, u, c), Yr(e)) : xt(e, d, u, c);
				Fe(e);
			}
			n$1(Ht, "ReadableByteStreamControllerEnqueue");
			function K(e, t) {
				const r = e._controlledReadableByteStream;
				r._state === "readable" && (ho(e), Be(e), Nt(e), Zo(r, t));
			}
			n$1(K, "ReadableByteStreamControllerError");
			function wo(e, t) {
				const r = e._queue.shift();
				e._queueTotalSize -= r.byteLength, _o(e);
				const s = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
				t._chunkSteps(s);
			}
			n$1(wo, "ReadableByteStreamControllerFillReadRequestFromQueue");
			function Gr(e) {
				if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
					const t = e._pendingPullIntos.peek(), r = new Uint8Array(t.buffer, t.byteOffset + t.bytesFilled, t.byteLength - t.bytesFilled), s = Object.create(Re.prototype);
					da(s, e, r), e._byobRequest = s;
				}
				return e._byobRequest;
			}
			n$1(Gr, "ReadableByteStreamControllerGetBYOBRequest");
			function Ro(e) {
				const t = e._controlledReadableByteStream._state;
				return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
			}
			n$1(Ro, "ReadableByteStreamControllerGetDesiredSize");
			function Vt(e, t) {
				const r = e._pendingPullIntos.peek();
				if (e._controlledReadableByteStream._state === "closed") {
					if (t !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
				} else {
					if (t === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
					if (r.bytesFilled + t > r.byteLength) throw new RangeError("bytesWritten out of range");
				}
				r.buffer = we(r.buffer), So(e, t);
			}
			n$1(Vt, "ReadableByteStreamControllerRespond");
			function Qt(e, t) {
				const r = e._pendingPullIntos.peek();
				if (e._controlledReadableByteStream._state === "closed") {
					if (t.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
				} else if (t.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
				if (r.byteOffset + r.bytesFilled !== t.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
				if (r.bufferByteLength !== t.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
				if (r.bytesFilled + t.byteLength > r.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
				const u = t.byteLength;
				r.buffer = we(t.buffer), So(e, u);
			}
			n$1(Qt, "ReadableByteStreamControllerRespondWithNewView");
			function To(e, t, r, s, u, c, d) {
				t._controlledReadableByteStream = e, t._pullAgain = false, t._pulling = false, t._byobRequest = null, t._queue = t._queueTotalSize = void 0, Be(t), t._closeRequested = false, t._started = false, t._strategyHWM = c, t._pullAlgorithm = s, t._cancelAlgorithm = u, t._autoAllocateChunkSize = d, t._pendingPullIntos = new D(), e._readableStreamController = t;
				g(T(r()), () => (t._started = true, Fe(t), null), (R) => (K(t, R), null));
			}
			n$1(To, "SetUpReadableByteStreamController");
			function ca(e, t, r) {
				const s = Object.create(te.prototype);
				let u, c, d;
				t.start !== void 0 ? u = n$1(() => t.start(s), "startAlgorithm") : u = n$1(() => {}, "startAlgorithm"), t.pull !== void 0 ? c = n$1(() => t.pull(s), "pullAlgorithm") : c = n$1(() => T(void 0), "pullAlgorithm"), t.cancel !== void 0 ? d = n$1((R) => t.cancel(R), "cancelAlgorithm") : d = n$1(() => T(void 0), "cancelAlgorithm");
				const m = t.autoAllocateChunkSize;
				if (m === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
				To(e, s, u, c, d, r, m);
			}
			n$1(ca, "SetUpReadableByteStreamControllerFromUnderlyingSource");
			function da(e, t, r) {
				e._associatedReadableByteStreamController = t, e._view = r;
			}
			n$1(da, "SetUpReadableStreamBYOBRequest");
			function Zr(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
			}
			n$1(Zr, "byobRequestBrandCheckException");
			function Rt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
			}
			n$1(Rt, "byteStreamControllerBrandCheckException");
			function ha(e, t) {
				ue(e, t);
				const r = e?.mode;
				return { mode: r === void 0 ? void 0 : pa(r, `${t} has member 'mode' that`) };
			}
			n$1(ha, "convertReaderOptions");
			function pa(e, t) {
				if (e = `${e}`, e !== "byob") throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
				return e;
			}
			n$1(pa, "convertReadableStreamReaderMode");
			function ba(e, t) {
				var r;
				ue(e, t);
				return { min: Fr((r = e?.min) !== null && r !== void 0 ? r : 1, `${t} has member 'min' that`) };
			}
			n$1(ba, "convertByobReadOptions");
			function Co(e) {
				return new ce(e);
			}
			n$1(Co, "AcquireReadableStreamBYOBReader");
			function Po(e, t) {
				e._reader._readIntoRequests.push(t);
			}
			n$1(Po, "ReadableStreamAddReadIntoRequest");
			function ma(e, t, r) {
				const u = e._reader._readIntoRequests.shift();
				r ? u._closeSteps(t) : u._chunkSteps(t);
			}
			n$1(ma, "ReadableStreamFulfillReadIntoRequest");
			function vo(e) {
				return e._reader._readIntoRequests.length;
			}
			n$1(vo, "ReadableStreamGetNumReadIntoRequests");
			function Kr(e) {
				const t = e._reader;
				return !(t === void 0 || !je(t));
			}
			n$1(Kr, "ReadableStreamHasBYOBReader");
			const Sn = class Sn {
				constructor(t) {
					if (Se(t, 1, "ReadableStreamBYOBReader"), jr(t, "First parameter"), qe(t)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
					if (!Ie(t._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
					Yn(this, t), this._readIntoRequests = new D();
				}
				get closed() {
					return je(this) ? this._closedPromise : b(Yt("closed"));
				}
				cancel(t = void 0) {
					return je(this) ? this._ownerReadableStream === void 0 ? b(Lt("cancel")) : Wr(this, t) : b(Yt("cancel"));
				}
				read(t, r = {}) {
					if (!je(this)) return b(Yt("read"));
					if (!ArrayBuffer.isView(t)) return b(/* @__PURE__ */ new TypeError("view must be an array buffer view"));
					if (t.byteLength === 0) return b(/* @__PURE__ */ new TypeError("view must have non-zero byteLength"));
					if (t.buffer.byteLength === 0) return b(/* @__PURE__ */ new TypeError("view's buffer must have non-zero byteLength"));
					if (Ae(t.buffer)) return b(/* @__PURE__ */ new TypeError("view's buffer has been detached"));
					let s;
					try {
						s = ba(r, "options");
					} catch (y) {
						return b(y);
					}
					const u = s.min;
					if (u === 0) return b(/* @__PURE__ */ new TypeError("options.min must be greater than 0"));
					if (oa(t)) {
						if (u > t.byteLength) return b(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's byteLength"));
					} else if (u > t.length) return b(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's length"));
					if (this._ownerReadableStream === void 0) return b(Lt("read from"));
					let c, d;
					const m = A((y, C) => {
						c = y, d = C;
					});
					return Eo(this, t, u, {
						_chunkSteps: n$1((y) => c({
							value: y,
							done: false
						}), "_chunkSteps"),
						_closeSteps: n$1((y) => c({
							value: y,
							done: true
						}), "_closeSteps"),
						_errorSteps: n$1((y) => d(y), "_errorSteps")
					}), m;
				}
				releaseLock() {
					if (!je(this)) throw Yt("releaseLock");
					this._ownerReadableStream !== void 0 && ya(this);
				}
			};
			n$1(Sn, "ReadableStreamBYOBReader");
			let ce = Sn;
			Object.defineProperties(ce.prototype, {
				cancel: { enumerable: true },
				read: { enumerable: true },
				releaseLock: { enumerable: true },
				closed: { enumerable: true }
			}), h(ce.prototype.cancel, "cancel"), h(ce.prototype.read, "read"), h(ce.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ce.prototype, Symbol.toStringTag, {
				value: "ReadableStreamBYOBReader",
				configurable: true
			});
			function je(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? false : e instanceof ce;
			}
			n$1(je, "IsReadableStreamBYOBReader");
			function Eo(e, t, r, s) {
				const u = e._ownerReadableStream;
				u._disturbed = true, u._state === "errored" ? s._errorSteps(u._storedError) : sa(u._readableStreamController, t, r, s);
			}
			n$1(Eo, "ReadableStreamBYOBReaderRead");
			function ya(e) {
				_e(e);
				Ao(e, /* @__PURE__ */ new TypeError("Reader was released"));
			}
			n$1(ya, "ReadableStreamBYOBReaderRelease");
			function Ao(e, t) {
				const r = e._readIntoRequests;
				e._readIntoRequests = new D(), r.forEach((s) => {
					s._errorSteps(t);
				});
			}
			n$1(Ao, "ReadableStreamBYOBReaderErrorReadIntoRequests");
			function Yt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`);
			}
			n$1(Yt, "byobReaderBrandCheckException");
			function Tt(e, t) {
				const { highWaterMark: r } = e;
				if (r === void 0) return t;
				if (ao(r) || r < 0) throw new RangeError("Invalid highWaterMark");
				return r;
			}
			n$1(Tt, "ExtractHighWaterMark");
			function Gt(e) {
				const { size: t } = e;
				return t || (() => 1);
			}
			n$1(Gt, "ExtractSizeAlgorithm");
			function Zt(e, t) {
				ue(e, t);
				const r = e?.highWaterMark, s = e?.size;
				return {
					highWaterMark: r === void 0 ? void 0 : Ir(r),
					size: s === void 0 ? void 0 : ga(s, `${t} has member 'size' that`)
				};
			}
			n$1(Zt, "convertQueuingStrategy");
			function ga(e, t) {
				return Z(e, t), (r) => Ir(e(r));
			}
			n$1(ga, "convertQueuingStrategySize");
			function _a(e, t) {
				ue(e, t);
				const r = e?.abort, s = e?.close, u = e?.start, c = e?.type, d = e?.write;
				return {
					abort: r === void 0 ? void 0 : Sa(r, e, `${t} has member 'abort' that`),
					close: s === void 0 ? void 0 : wa(s, e, `${t} has member 'close' that`),
					start: u === void 0 ? void 0 : Ra(u, e, `${t} has member 'start' that`),
					write: d === void 0 ? void 0 : Ta(d, e, `${t} has member 'write' that`),
					type: c
				};
			}
			n$1(_a, "convertUnderlyingSink");
			function Sa(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(Sa, "convertUnderlyingSinkAbortCallback");
			function wa(e, t, r) {
				return Z(e, r), () => j(e, t, []);
			}
			n$1(wa, "convertUnderlyingSinkCloseCallback");
			function Ra(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(Ra, "convertUnderlyingSinkStartCallback");
			function Ta(e, t, r) {
				return Z(e, r), (s, u) => j(e, t, [s, u]);
			}
			n$1(Ta, "convertUnderlyingSinkWriteCallback");
			function Bo(e, t) {
				if (!Ge(e)) throw new TypeError(`${t} is not a WritableStream.`);
			}
			n$1(Bo, "assertWritableStream");
			function Ca(e) {
				if (typeof e != "object" || e === null) return false;
				try {
					return typeof e.aborted == "boolean";
				} catch {
					return false;
				}
			}
			n$1(Ca, "isAbortSignal");
			const Pa = typeof AbortController == "function";
			function va() {
				if (Pa) return new AbortController();
			}
			n$1(va, "createAbortController");
			const wn = class wn {
				constructor(t = {}, r = {}) {
					t === void 0 ? t = null : Jn(t, "First parameter");
					const s = Zt(r, "Second parameter"), u = _a(t, "First parameter");
					if (Wo(this), u.type !== void 0) throw new RangeError("Invalid type is specified");
					const d = Gt(s), m = Tt(s, 1);
					Da(this, u, m, d);
				}
				get locked() {
					if (!Ge(this)) throw tr("locked");
					return Ze(this);
				}
				abort(t = void 0) {
					return Ge(this) ? Ze(this) ? b(/* @__PURE__ */ new TypeError("Cannot abort a stream that already has a writer")) : Kt(this, t) : b(tr("abort"));
				}
				close() {
					return Ge(this) ? Ze(this) ? b(/* @__PURE__ */ new TypeError("Cannot close a stream that already has a writer")) : he(this) ? b(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream")) : qo(this) : b(tr("close"));
				}
				getWriter() {
					if (!Ge(this)) throw tr("getWriter");
					return ko(this);
				}
			};
			n$1(wn, "WritableStream");
			let de = wn;
			Object.defineProperties(de.prototype, {
				abort: { enumerable: true },
				close: { enumerable: true },
				getWriter: { enumerable: true },
				locked: { enumerable: true }
			}), h(de.prototype.abort, "abort"), h(de.prototype.close, "close"), h(de.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(de.prototype, Symbol.toStringTag, {
				value: "WritableStream",
				configurable: true
			});
			function ko(e) {
				return new re(e);
			}
			n$1(ko, "AcquireWritableStreamDefaultWriter");
			function Ea(e, t, r, s, u = 1, c = () => 1) {
				const d = Object.create(de.prototype);
				Wo(d);
				return Lo(d, Object.create(ke.prototype), e, t, r, s, u, c), d;
			}
			n$1(Ea, "CreateWritableStream");
			function Wo(e) {
				e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new D(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = false;
			}
			n$1(Wo, "InitializeWritableStream");
			function Ge(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? false : e instanceof de;
			}
			n$1(Ge, "IsWritableStream");
			function Ze(e) {
				return e._writer !== void 0;
			}
			n$1(Ze, "IsWritableStreamLocked");
			function Kt(e, t) {
				var r;
				if (e._state === "closed" || e._state === "errored") return T(void 0);
				e._writableStreamController._abortReason = t, (r = e._writableStreamController._abortController) === null || r === void 0 || r.abort(t);
				const s = e._state;
				if (s === "closed" || s === "errored") return T(void 0);
				if (e._pendingAbortRequest !== void 0) return e._pendingAbortRequest._promise;
				let u = false;
				s === "erroring" && (u = true, t = void 0);
				const c = A((d, m) => {
					e._pendingAbortRequest = {
						_promise: void 0,
						_resolve: d,
						_reject: m,
						_reason: t,
						_wasAlreadyErroring: u
					};
				});
				return e._pendingAbortRequest._promise = c, u || Xr(e, t), c;
			}
			n$1(Kt, "WritableStreamAbort");
			function qo(e) {
				const t = e._state;
				if (t === "closed" || t === "errored") return b(/* @__PURE__ */ new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));
				const r = A((u, c) => {
					e._closeRequest = {
						_resolve: u,
						_reject: c
					};
				}), s = e._writer;
				return s !== void 0 && e._backpressure && t === "writable" && ln(s), Ma(e._writableStreamController), r;
			}
			n$1(qo, "WritableStreamClose");
			function Aa(e) {
				return A((r, s) => {
					const u = {
						_resolve: r,
						_reject: s
					};
					e._writeRequests.push(u);
				});
			}
			n$1(Aa, "WritableStreamAddWriteRequest");
			function Jr(e, t) {
				if (e._state === "writable") {
					Xr(e, t);
					return;
				}
				en(e);
			}
			n$1(Jr, "WritableStreamDealWithRejection");
			function Xr(e, t) {
				const r = e._writableStreamController;
				e._state = "erroring", e._storedError = t;
				const s = e._writer;
				s !== void 0 && zo(s, t), !Oa(e) && r._started && en(e);
			}
			n$1(Xr, "WritableStreamStartErroring");
			function en(e) {
				e._state = "errored", e._writableStreamController[Qn]();
				const t = e._storedError;
				if (e._writeRequests.forEach((u) => {
					u._reject(t);
				}), e._writeRequests = new D(), e._pendingAbortRequest === void 0) {
					Jt(e);
					return;
				}
				const r = e._pendingAbortRequest;
				if (e._pendingAbortRequest = void 0, r._wasAlreadyErroring) {
					r._reject(t), Jt(e);
					return;
				}
				g(e._writableStreamController[jt](r._reason), () => (r._resolve(), Jt(e), null), (u) => (r._reject(u), Jt(e), null));
			}
			n$1(en, "WritableStreamFinishErroring");
			function Ba(e) {
				e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
			}
			n$1(Ba, "WritableStreamFinishInFlightWrite");
			function ka(e, t) {
				e._inFlightWriteRequest._reject(t), e._inFlightWriteRequest = void 0, Jr(e, t);
			}
			n$1(ka, "WritableStreamFinishInFlightWriteWithError");
			function Wa(e) {
				e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
				const r = e._writer;
				r !== void 0 && Uo(r);
			}
			n$1(Wa, "WritableStreamFinishInFlightClose");
			function qa(e, t) {
				e._inFlightCloseRequest._reject(t), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t), e._pendingAbortRequest = void 0), Jr(e, t);
			}
			n$1(qa, "WritableStreamFinishInFlightCloseWithError");
			function he(e) {
				return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
			}
			n$1(he, "WritableStreamCloseQueuedOrInFlight");
			function Oa(e) {
				return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
			}
			n$1(Oa, "WritableStreamHasOperationMarkedInFlight");
			function za(e) {
				e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
			}
			n$1(za, "WritableStreamMarkCloseRequestInFlight");
			function Ia(e) {
				e._inFlightWriteRequest = e._writeRequests.shift();
			}
			n$1(Ia, "WritableStreamMarkFirstWriteRequestInFlight");
			function Jt(e) {
				e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
				const t = e._writer;
				t !== void 0 && an(t, e._storedError);
			}
			n$1(Jt, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
			function tn(e, t) {
				const r = e._writer;
				r !== void 0 && t !== e._backpressure && (t ? Ya(r) : ln(r)), e._backpressure = t;
			}
			n$1(tn, "WritableStreamUpdateBackpressure");
			const Rn = class Rn {
				constructor(t) {
					if (Se(t, 1, "WritableStreamDefaultWriter"), Bo(t, "First parameter"), Ze(t)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
					this._ownerWritableStream = t, t._writer = this;
					const r = t._state;
					if (r === "writable") !he(t) && t._backpressure ? nr(this) : xo(this), rr(this);
					else if (r === "erroring") sn(this, t._storedError), rr(this);
					else if (r === "closed") xo(this), Va(this);
					else {
						const s = t._storedError;
						sn(this, s), Mo(this, s);
					}
				}
				get closed() {
					return Le(this) ? this._closedPromise : b($e("closed"));
				}
				get desiredSize() {
					if (!Le(this)) throw $e("desiredSize");
					if (this._ownerWritableStream === void 0) throw Pt("desiredSize");
					return $a(this);
				}
				get ready() {
					return Le(this) ? this._readyPromise : b($e("ready"));
				}
				abort(t = void 0) {
					return Le(this) ? this._ownerWritableStream === void 0 ? b(Pt("abort")) : Fa(this, t) : b($e("abort"));
				}
				close() {
					if (!Le(this)) return b($e("close"));
					const t = this._ownerWritableStream;
					return t === void 0 ? b(Pt("close")) : he(t) ? b(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream")) : Oo(this);
				}
				releaseLock() {
					if (!Le(this)) throw $e("releaseLock");
					this._ownerWritableStream !== void 0 && Io(this);
				}
				write(t = void 0) {
					return Le(this) ? this._ownerWritableStream === void 0 ? b(Pt("write to")) : Fo(this, t) : b($e("write"));
				}
			};
			n$1(Rn, "WritableStreamDefaultWriter");
			let re = Rn;
			Object.defineProperties(re.prototype, {
				abort: { enumerable: true },
				close: { enumerable: true },
				releaseLock: { enumerable: true },
				write: { enumerable: true },
				closed: { enumerable: true },
				desiredSize: { enumerable: true },
				ready: { enumerable: true }
			}), h(re.prototype.abort, "abort"), h(re.prototype.close, "close"), h(re.prototype.releaseLock, "releaseLock"), h(re.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(re.prototype, Symbol.toStringTag, {
				value: "WritableStreamDefaultWriter",
				configurable: true
			});
			function Le(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? false : e instanceof re;
			}
			n$1(Le, "IsWritableStreamDefaultWriter");
			function Fa(e, t) {
				const r = e._ownerWritableStream;
				return Kt(r, t);
			}
			n$1(Fa, "WritableStreamDefaultWriterAbort");
			function Oo(e) {
				const t = e._ownerWritableStream;
				return qo(t);
			}
			n$1(Oo, "WritableStreamDefaultWriterClose");
			function ja(e) {
				const t = e._ownerWritableStream, r = t._state;
				return he(t) || r === "closed" ? T(void 0) : r === "errored" ? b(t._storedError) : Oo(e);
			}
			n$1(ja, "WritableStreamDefaultWriterCloseWithErrorPropagation");
			function La(e, t) {
				e._closedPromiseState === "pending" ? an(e, t) : Qa(e, t);
			}
			n$1(La, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
			function zo(e, t) {
				e._readyPromiseState === "pending" ? No(e, t) : Ga(e, t);
			}
			n$1(zo, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
			function $a(e) {
				const t = e._ownerWritableStream, r = t._state;
				return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : $o(t._writableStreamController);
			}
			n$1($a, "WritableStreamDefaultWriterGetDesiredSize");
			function Io(e) {
				const t = e._ownerWritableStream, r = /* @__PURE__ */ new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
				zo(e, r), La(e, r), t._writer = void 0, e._ownerWritableStream = void 0;
			}
			n$1(Io, "WritableStreamDefaultWriterRelease");
			function Fo(e, t) {
				const r = e._ownerWritableStream, s = r._writableStreamController, u = Ua(s, t);
				if (r !== e._ownerWritableStream) return b(Pt("write to"));
				const c = r._state;
				if (c === "errored") return b(r._storedError);
				if (he(r) || c === "closed") return b(/* @__PURE__ */ new TypeError("The stream is closing or closed and cannot be written to"));
				if (c === "erroring") return b(r._storedError);
				const d = Aa(r);
				return xa(s, t, u), d;
			}
			n$1(Fo, "WritableStreamDefaultWriterWrite");
			const jo = {}, Tn = class Tn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get abortReason() {
					if (!rn(this)) throw on("abortReason");
					return this._abortReason;
				}
				get signal() {
					if (!rn(this)) throw on("signal");
					if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
					return this._abortController.signal;
				}
				error(t = void 0) {
					if (!rn(this)) throw on("error");
					this._controlledWritableStream._state === "writable" && Do(this, t);
				}
				[jt](t) {
					const r = this._abortAlgorithm(t);
					return Xt(this), r;
				}
				[Qn]() {
					Be(this);
				}
			};
			n$1(Tn, "WritableStreamDefaultController");
			let ke = Tn;
			Object.defineProperties(ke.prototype, {
				abortReason: { enumerable: true },
				signal: { enumerable: true },
				error: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ke.prototype, Symbol.toStringTag, {
				value: "WritableStreamDefaultController",
				configurable: true
			});
			function rn(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledWritableStream") ? false : e instanceof ke;
			}
			n$1(rn, "IsWritableStreamDefaultController");
			function Lo(e, t, r, s, u, c, d, m) {
				t._controlledWritableStream = e, e._writableStreamController = t, t._queue = void 0, t._queueTotalSize = void 0, Be(t), t._abortReason = void 0, t._abortController = va(), t._started = false, t._strategySizeAlgorithm = m, t._strategyHWM = d, t._writeAlgorithm = s, t._closeAlgorithm = u, t._abortAlgorithm = c;
				tn(e, nn(t));
				g(T(r()), () => (t._started = true, er(t), null), (P) => (t._started = true, Jr(e, P), null));
			}
			n$1(Lo, "SetUpWritableStreamDefaultController");
			function Da(e, t, r, s) {
				const u = Object.create(ke.prototype);
				let c, d, m, R;
				t.start !== void 0 ? c = n$1(() => t.start(u), "startAlgorithm") : c = n$1(() => {}, "startAlgorithm"), t.write !== void 0 ? d = n$1((y) => t.write(y, u), "writeAlgorithm") : d = n$1(() => T(void 0), "writeAlgorithm"), t.close !== void 0 ? m = n$1(() => t.close(), "closeAlgorithm") : m = n$1(() => T(void 0), "closeAlgorithm"), t.abort !== void 0 ? R = n$1((y) => t.abort(y), "abortAlgorithm") : R = n$1(() => T(void 0), "abortAlgorithm"), Lo(e, u, c, d, m, R, r, s);
			}
			n$1(Da, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
			function Xt(e) {
				e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
			}
			n$1(Xt, "WritableStreamDefaultControllerClearAlgorithms");
			function Ma(e) {
				Nr(e, jo, 0), er(e);
			}
			n$1(Ma, "WritableStreamDefaultControllerClose");
			function Ua(e, t) {
				try {
					return e._strategySizeAlgorithm(t);
				} catch (r) {
					return Ct(e, r), 1;
				}
			}
			n$1(Ua, "WritableStreamDefaultControllerGetChunkSize");
			function $o(e) {
				return e._strategyHWM - e._queueTotalSize;
			}
			n$1($o, "WritableStreamDefaultControllerGetDesiredSize");
			function xa(e, t, r) {
				try {
					Nr(e, t, r);
				} catch (u) {
					Ct(e, u);
					return;
				}
				const s = e._controlledWritableStream;
				if (!he(s) && s._state === "writable") tn(s, nn(e));
				er(e);
			}
			n$1(xa, "WritableStreamDefaultControllerWrite");
			function er(e) {
				const t = e._controlledWritableStream;
				if (!e._started || t._inFlightWriteRequest !== void 0) return;
				if (t._state === "erroring") {
					en(t);
					return;
				}
				if (e._queue.length === 0) return;
				const s = na(e);
				s === jo ? Na(e) : Ha(e, s);
			}
			n$1(er, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
			function Ct(e, t) {
				e._controlledWritableStream._state === "writable" && Do(e, t);
			}
			n$1(Ct, "WritableStreamDefaultControllerErrorIfNeeded");
			function Na(e) {
				const t = e._controlledWritableStream;
				za(t), xr(e);
				const r = e._closeAlgorithm();
				Xt(e), g(r, () => (Wa(t), null), (s) => (qa(t, s), null));
			}
			n$1(Na, "WritableStreamDefaultControllerProcessClose");
			function Ha(e, t) {
				const r = e._controlledWritableStream;
				Ia(r);
				g(e._writeAlgorithm(t), () => {
					Ba(r);
					const u = r._state;
					if (xr(e), !he(r) && u === "writable") {
						const c = nn(e);
						tn(r, c);
					}
					return er(e), null;
				}, (u) => (r._state === "writable" && Xt(e), ka(r, u), null));
			}
			n$1(Ha, "WritableStreamDefaultControllerProcessWrite");
			function nn(e) {
				return $o(e) <= 0;
			}
			n$1(nn, "WritableStreamDefaultControllerGetBackpressure");
			function Do(e, t) {
				const r = e._controlledWritableStream;
				Xt(e), Xr(r, t);
			}
			n$1(Do, "WritableStreamDefaultControllerError");
			function tr(e) {
				return /* @__PURE__ */ new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`);
			}
			n$1(tr, "streamBrandCheckException$2");
			function on(e) {
				return /* @__PURE__ */ new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`);
			}
			n$1(on, "defaultControllerBrandCheckException$2");
			function $e(e) {
				return /* @__PURE__ */ new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`);
			}
			n$1($e, "defaultWriterBrandCheckException");
			function Pt(e) {
				return /* @__PURE__ */ new TypeError("Cannot " + e + " a stream using a released writer");
			}
			n$1(Pt, "defaultWriterLockException");
			function rr(e) {
				e._closedPromise = A((t, r) => {
					e._closedPromise_resolve = t, e._closedPromise_reject = r, e._closedPromiseState = "pending";
				});
			}
			n$1(rr, "defaultWriterClosedPromiseInitialize");
			function Mo(e, t) {
				rr(e), an(e, t);
			}
			n$1(Mo, "defaultWriterClosedPromiseInitializeAsRejected");
			function Va(e) {
				rr(e), Uo(e);
			}
			n$1(Va, "defaultWriterClosedPromiseInitializeAsResolved");
			function an(e, t) {
				e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
			}
			n$1(an, "defaultWriterClosedPromiseReject");
			function Qa(e, t) {
				Mo(e, t);
			}
			n$1(Qa, "defaultWriterClosedPromiseResetToRejected");
			function Uo(e) {
				e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
			}
			n$1(Uo, "defaultWriterClosedPromiseResolve");
			function nr(e) {
				e._readyPromise = A((t, r) => {
					e._readyPromise_resolve = t, e._readyPromise_reject = r;
				}), e._readyPromiseState = "pending";
			}
			n$1(nr, "defaultWriterReadyPromiseInitialize");
			function sn(e, t) {
				nr(e), No(e, t);
			}
			n$1(sn, "defaultWriterReadyPromiseInitializeAsRejected");
			function xo(e) {
				nr(e), ln(e);
			}
			n$1(xo, "defaultWriterReadyPromiseInitializeAsResolved");
			function No(e, t) {
				e._readyPromise_reject !== void 0 && (Q(e._readyPromise), e._readyPromise_reject(t), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
			}
			n$1(No, "defaultWriterReadyPromiseReject");
			function Ya(e) {
				nr(e);
			}
			n$1(Ya, "defaultWriterReadyPromiseReset");
			function Ga(e, t) {
				sn(e, t);
			}
			n$1(Ga, "defaultWriterReadyPromiseResetToRejected");
			function ln(e) {
				e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
			}
			n$1(ln, "defaultWriterReadyPromiseResolve");
			function Za() {
				if (typeof globalThis < "u") return globalThis;
				if (typeof self < "u") return self;
				if (typeof n$2 < "u") return n$2;
			}
			n$1(Za, "getGlobals");
			const un = Za();
			function Ka(e) {
				if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException") return false;
				try {
					return new e(), !0;
				} catch {
					return false;
				}
			}
			n$1(Ka, "isDOMExceptionConstructor");
			function Ja() {
				const e = un?.DOMException;
				return Ka(e) ? e : void 0;
			}
			n$1(Ja, "getFromGlobal");
			function Xa() {
				const e = n$1(function(r, s) {
					this.message = r || "", this.name = s || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
				}, "DOMException");
				return h(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", {
					value: e,
					writable: true,
					configurable: true
				}), e;
			}
			n$1(Xa, "createPolyfill");
			const es = Ja() || Xa();
			function Ho(e, t, r, s, u, c) {
				const d = Qe(e), m = ko(t);
				e._disturbed = true;
				let R = false, y = T(void 0);
				return A((C, P) => {
					let B;
					if (c !== void 0) {
						if (B = n$1(() => {
							const _ = c.reason !== void 0 ? c.reason : new es("Aborted", "AbortError"), E = [];
							s || E.push(() => t._state === "writable" ? Kt(t, _) : T(void 0)), u || E.push(() => e._state === "readable" ? ie(e, _) : T(void 0)), N(() => Promise.all(E.map((k) => k())), true, _);
						}, "abortAlgorithm"), c.aborted) {
							B();
							return;
						}
						c.addEventListener("abort", B);
					}
					function ae() {
						return A((_, E) => {
							function k(Y) {
								Y ? _() : q(nt(), k, E);
							}
							n$1(k, "next"), k(false);
						});
					}
					n$1(ae, "pipeLoop");
					function nt() {
						return R ? T(true) : q(m._readyPromise, () => A((_, E) => {
							_t(d, {
								_chunkSteps: n$1((k) => {
									y = q(Fo(m, k), void 0, f), _(false);
								}, "_chunkSteps"),
								_closeSteps: n$1(() => _(true), "_closeSteps"),
								_errorSteps: E
							});
						}));
					}
					if (n$1(nt, "pipeStep"), Te(e, d._closedPromise, (_) => (s ? J(true, _) : N(() => Kt(t, _), true, _), null)), Te(t, m._closedPromise, (_) => (u ? J(true, _) : N(() => ie(e, _), true, _), null)), x(e, d._closedPromise, () => (r ? J() : N(() => ja(m)), null)), he(t) || t._state === "closed") {
						const _ = /* @__PURE__ */ new TypeError("the destination writable stream closed before all data could be piped to it");
						u ? J(true, _) : N(() => ie(e, _), true, _);
					}
					Q(ae());
					function Oe() {
						const _ = y;
						return q(y, () => _ !== y ? Oe() : void 0);
					}
					n$1(Oe, "waitForWritesToFinish");
					function Te(_, E, k) {
						_._state === "errored" ? k(_._storedError) : I(E, k);
					}
					n$1(Te, "isOrBecomesErrored");
					function x(_, E, k) {
						_._state === "closed" ? k() : V(E, k);
					}
					n$1(x, "isOrBecomesClosed");
					function N(_, E, k) {
						if (R) return;
						R = true, t._state === "writable" && !he(t) ? V(Oe(), Y) : Y();
						function Y() {
							return g(_(), () => Ce(E, k), (ot) => Ce(true, ot)), null;
						}
						n$1(Y, "doTheRest");
					}
					n$1(N, "shutdownWithAction");
					function J(_, E) {
						R || (R = true, t._state === "writable" && !he(t) ? V(Oe(), () => Ce(_, E)) : Ce(_, E));
					}
					n$1(J, "shutdown");
					function Ce(_, E) {
						return Io(m), _e(d), c !== void 0 && c.removeEventListener("abort", B), _ ? P(E) : C(void 0), null;
					}
					n$1(Ce, "finalize");
				});
			}
			n$1(Ho, "ReadableStreamPipeTo");
			const Cn = class Cn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get desiredSize() {
					if (!or(this)) throw ar("desiredSize");
					return fn(this);
				}
				close() {
					if (!or(this)) throw ar("close");
					if (!Je(this)) throw new TypeError("The stream is not in a state that permits close");
					De(this);
				}
				enqueue(t = void 0) {
					if (!or(this)) throw ar("enqueue");
					if (!Je(this)) throw new TypeError("The stream is not in a state that permits enqueue");
					return Ke(this, t);
				}
				error(t = void 0) {
					if (!or(this)) throw ar("error");
					oe(this, t);
				}
				[Ar](t) {
					Be(this);
					const r = this._cancelAlgorithm(t);
					return ir(this), r;
				}
				[Br](t) {
					const r = this._controlledReadableStream;
					if (this._queue.length > 0) {
						const s = xr(this);
						this._closeRequested && this._queue.length === 0 ? (ir(this), At(r)) : vt(this), t._chunkSteps(s);
					} else eo(r, t), vt(this);
				}
				[kr]() {}
			};
			n$1(Cn, "ReadableStreamDefaultController");
			let ne = Cn;
			Object.defineProperties(ne.prototype, {
				close: { enumerable: true },
				enqueue: { enumerable: true },
				error: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(ne.prototype.close, "close"), h(ne.prototype.enqueue, "enqueue"), h(ne.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ne.prototype, Symbol.toStringTag, {
				value: "ReadableStreamDefaultController",
				configurable: true
			});
			function or(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? false : e instanceof ne;
			}
			n$1(or, "IsReadableStreamDefaultController");
			function vt(e) {
				if (!Vo(e)) return;
				if (e._pulling) {
					e._pullAgain = true;
					return;
				}
				e._pulling = true;
				g(e._pullAlgorithm(), () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, vt(e)), null), (s) => (oe(e, s), null));
			}
			n$1(vt, "ReadableStreamDefaultControllerCallPullIfNeeded");
			function Vo(e) {
				const t = e._controlledReadableStream;
				return !Je(e) || !e._started ? false : !!(qe(t) && $t(t) > 0 || fn(e) > 0);
			}
			n$1(Vo, "ReadableStreamDefaultControllerShouldCallPull");
			function ir(e) {
				e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
			}
			n$1(ir, "ReadableStreamDefaultControllerClearAlgorithms");
			function De(e) {
				if (!Je(e)) return;
				const t = e._controlledReadableStream;
				e._closeRequested = true, e._queue.length === 0 && (ir(e), At(t));
			}
			n$1(De, "ReadableStreamDefaultControllerClose");
			function Ke(e, t) {
				if (!Je(e)) return;
				const r = e._controlledReadableStream;
				if (qe(r) && $t(r) > 0) Lr(r, t, false);
				else {
					let s;
					try {
						s = e._strategySizeAlgorithm(t);
					} catch (u) {
						throw oe(e, u), u;
					}
					try {
						Nr(e, t, s);
					} catch (u) {
						throw oe(e, u), u;
					}
				}
				vt(e);
			}
			n$1(Ke, "ReadableStreamDefaultControllerEnqueue");
			function oe(e, t) {
				const r = e._controlledReadableStream;
				r._state === "readable" && (Be(e), ir(e), Zo(r, t));
			}
			n$1(oe, "ReadableStreamDefaultControllerError");
			function fn(e) {
				const t = e._controlledReadableStream._state;
				return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
			}
			n$1(fn, "ReadableStreamDefaultControllerGetDesiredSize");
			function ts(e) {
				return !Vo(e);
			}
			n$1(ts, "ReadableStreamDefaultControllerHasBackpressure");
			function Je(e) {
				const t = e._controlledReadableStream._state;
				return !e._closeRequested && t === "readable";
			}
			n$1(Je, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
			function Qo(e, t, r, s, u, c, d) {
				t._controlledReadableStream = e, t._queue = void 0, t._queueTotalSize = void 0, Be(t), t._started = false, t._closeRequested = false, t._pullAgain = false, t._pulling = false, t._strategySizeAlgorithm = d, t._strategyHWM = c, t._pullAlgorithm = s, t._cancelAlgorithm = u, e._readableStreamController = t;
				g(T(r()), () => (t._started = true, vt(t), null), (R) => (oe(t, R), null));
			}
			n$1(Qo, "SetUpReadableStreamDefaultController");
			function rs(e, t, r, s) {
				const u = Object.create(ne.prototype);
				let c, d, m;
				t.start !== void 0 ? c = n$1(() => t.start(u), "startAlgorithm") : c = n$1(() => {}, "startAlgorithm"), t.pull !== void 0 ? d = n$1(() => t.pull(u), "pullAlgorithm") : d = n$1(() => T(void 0), "pullAlgorithm"), t.cancel !== void 0 ? m = n$1((R) => t.cancel(R), "cancelAlgorithm") : m = n$1(() => T(void 0), "cancelAlgorithm"), Qo(e, u, c, d, m, r, s);
			}
			n$1(rs, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
			function ar(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
			}
			n$1(ar, "defaultControllerBrandCheckException$1");
			function ns(e, t) {
				return Ie(e._readableStreamController) ? is(e) : os(e);
			}
			n$1(ns, "ReadableStreamTee");
			function os(e, t) {
				const r = Qe(e);
				let s = false, u = false, c = false, d = false, m, R, y, C, P;
				const B = A((x) => {
					P = x;
				});
				function ae() {
					return s ? (u = true, T(void 0)) : (s = true, _t(r, {
						_chunkSteps: n$1((N) => {
							ge(() => {
								u = false;
								const J = N, Ce = N;
								c || Ke(y._readableStreamController, J), d || Ke(C._readableStreamController, Ce), s = false, u && ae();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							s = false, c || De(y._readableStreamController), d || De(C._readableStreamController), (!c || !d) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							s = false;
						}, "_errorSteps")
					}), T(void 0));
				}
				n$1(ae, "pullAlgorithm");
				function nt(x) {
					if (c = true, m = x, d) {
						const J = ie(e, St([m, R]));
						P(J);
					}
					return B;
				}
				n$1(nt, "cancel1Algorithm");
				function Oe(x) {
					if (d = true, R = x, c) {
						const J = ie(e, St([m, R]));
						P(J);
					}
					return B;
				}
				n$1(Oe, "cancel2Algorithm");
				function Te() {}
				return n$1(Te, "startAlgorithm"), y = Et(Te, ae, nt), C = Et(Te, ae, Oe), I(r._closedPromise, (x) => (oe(y._readableStreamController, x), oe(C._readableStreamController, x), (!c || !d) && P(void 0), null)), [y, C];
			}
			n$1(os, "ReadableStreamDefaultTee");
			function is(e) {
				let t = Qe(e), r = false, s = false, u = false, c = false, d = false, m, R, y, C, P;
				const B = A((_) => {
					P = _;
				});
				function ae(_) {
					I(_._closedPromise, (E) => (_ !== t || (K(y._readableStreamController, E), K(C._readableStreamController, E), (!c || !d) && P(void 0)), null));
				}
				n$1(ae, "forwardReaderError");
				function nt() {
					je(t) && (_e(t), t = Qe(e), ae(t)), _t(t, {
						_chunkSteps: n$1((E) => {
							ge(() => {
								s = false, u = false;
								const k = E;
								let Y = E;
								if (!c && !d) try {
									Y = fo(E);
								} catch (ot) {
									K(y._readableStreamController, ot), K(C._readableStreamController, ot), P(ie(e, ot));
									return;
								}
								c || Ht(y._readableStreamController, k), d || Ht(C._readableStreamController, Y), r = false, s ? Te() : u && x();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							r = false, c || wt(y._readableStreamController), d || wt(C._readableStreamController), y._readableStreamController._pendingPullIntos.length > 0 && Vt(y._readableStreamController, 0), C._readableStreamController._pendingPullIntos.length > 0 && Vt(C._readableStreamController, 0), (!c || !d) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							r = false;
						}, "_errorSteps")
					});
				}
				n$1(nt, "pullWithDefaultReader");
				function Oe(_, E) {
					Ee(t) && (_e(t), t = Co(e), ae(t));
					const k = E ? C : y, Y = E ? y : C;
					Eo(t, _, 1, {
						_chunkSteps: n$1((it) => {
							ge(() => {
								s = false, u = false;
								const at = E ? d : c;
								if (E ? c : d) at || Qt(k._readableStreamController, it);
								else {
									let ui;
									try {
										ui = fo(it);
									} catch (kn) {
										K(k._readableStreamController, kn), K(Y._readableStreamController, kn), P(ie(e, kn));
										return;
									}
									at || Qt(k._readableStreamController, it), Ht(Y._readableStreamController, ui);
								}
								r = false, s ? Te() : u && x();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1((it) => {
							r = false;
							const at = E ? d : c, cr = E ? c : d;
							at || wt(k._readableStreamController), cr || wt(Y._readableStreamController), it !== void 0 && (at || Qt(k._readableStreamController, it), !cr && Y._readableStreamController._pendingPullIntos.length > 0 && Vt(Y._readableStreamController, 0)), (!at || !cr) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							r = false;
						}, "_errorSteps")
					});
				}
				n$1(Oe, "pullWithBYOBReader");
				function Te() {
					if (r) return s = true, T(void 0);
					r = true;
					const _ = Gr(y._readableStreamController);
					return _ === null ? nt() : Oe(_._view, false), T(void 0);
				}
				n$1(Te, "pull1Algorithm");
				function x() {
					if (r) return u = true, T(void 0);
					r = true;
					const _ = Gr(C._readableStreamController);
					return _ === null ? nt() : Oe(_._view, true), T(void 0);
				}
				n$1(x, "pull2Algorithm");
				function N(_) {
					if (c = true, m = _, d) {
						const k = ie(e, St([m, R]));
						P(k);
					}
					return B;
				}
				n$1(N, "cancel1Algorithm");
				function J(_) {
					if (d = true, R = _, c) {
						const k = ie(e, St([m, R]));
						P(k);
					}
					return B;
				}
				n$1(J, "cancel2Algorithm");
				function Ce() {}
				return n$1(Ce, "startAlgorithm"), y = Go(Ce, Te, N), C = Go(Ce, x, J), ae(t), [y, C];
			}
			n$1(is, "ReadableByteStreamTee");
			function as(e) {
				return l(e) && typeof e.getReader < "u";
			}
			n$1(as, "isReadableStreamLike");
			function ss(e) {
				return as(e) ? us(e.getReader()) : ls(e);
			}
			n$1(ss, "ReadableStreamFrom");
			function ls(e) {
				let t;
				const r = uo(e, "async"), s = f;
				function u() {
					let d;
					try {
						d = Xi(r);
					} catch (R) {
						return b(R);
					}
					return F(T(d), (R) => {
						if (!l(R)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
						if (ea(R)) De(t._readableStreamController);
						else {
							const C = ta(R);
							Ke(t._readableStreamController, C);
						}
					});
				}
				n$1(u, "pullAlgorithm");
				function c(d) {
					const m = r.iterator;
					let R;
					try {
						R = Ut(m, "return");
					} catch (P) {
						return b(P);
					}
					if (R === void 0) return T(void 0);
					let y;
					try {
						y = z(R, m, [d]);
					} catch (P) {
						return b(P);
					}
					return F(T(y), (P) => {
						if (!l(P)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
					});
				}
				return n$1(c, "cancelAlgorithm"), t = Et(s, u, c, 0), t;
			}
			n$1(ls, "ReadableStreamFromIterable");
			function us(e) {
				let t;
				const r = f;
				function s() {
					let c;
					try {
						c = e.read();
					} catch (d) {
						return b(d);
					}
					return F(c, (d) => {
						if (!l(d)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
						if (d.done) De(t._readableStreamController);
						else {
							const m = d.value;
							Ke(t._readableStreamController, m);
						}
					});
				}
				n$1(s, "pullAlgorithm");
				function u(c) {
					try {
						return T(e.cancel(c));
					} catch (d) {
						return b(d);
					}
				}
				return n$1(u, "cancelAlgorithm"), t = Et(r, s, u, 0), t;
			}
			n$1(us, "ReadableStreamFromDefaultReader");
			function fs(e, t) {
				ue(e, t);
				const r = e, s = r?.autoAllocateChunkSize, u = r?.cancel, c = r?.pull, d = r?.start, m = r?.type;
				return {
					autoAllocateChunkSize: s === void 0 ? void 0 : Fr(s, `${t} has member 'autoAllocateChunkSize' that`),
					cancel: u === void 0 ? void 0 : cs(u, r, `${t} has member 'cancel' that`),
					pull: c === void 0 ? void 0 : ds(c, r, `${t} has member 'pull' that`),
					start: d === void 0 ? void 0 : hs(d, r, `${t} has member 'start' that`),
					type: m === void 0 ? void 0 : ps(m, `${t} has member 'type' that`)
				};
			}
			n$1(fs, "convertUnderlyingDefaultOrByteSource");
			function cs(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(cs, "convertUnderlyingSourceCancelCallback");
			function ds(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(ds, "convertUnderlyingSourcePullCallback");
			function hs(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(hs, "convertUnderlyingSourceStartCallback");
			function ps(e, t) {
				if (e = `${e}`, e !== "bytes") throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);
				return e;
			}
			n$1(ps, "convertReadableStreamType");
			function bs(e, t) {
				return ue(e, t), { preventCancel: !!e?.preventCancel };
			}
			n$1(bs, "convertIteratorOptions");
			function Yo(e, t) {
				ue(e, t);
				const r = e?.preventAbort, s = e?.preventCancel, u = e?.preventClose, c = e?.signal;
				return c !== void 0 && ms(c, `${t} has member 'signal' that`), {
					preventAbort: !!r,
					preventCancel: !!s,
					preventClose: !!u,
					signal: c
				};
			}
			n$1(Yo, "convertPipeOptions");
			function ms(e, t) {
				if (!Ca(e)) throw new TypeError(`${t} is not an AbortSignal.`);
			}
			n$1(ms, "assertAbortSignal");
			function ys(e, t) {
				ue(e, t);
				const r = e?.readable;
				zr(r, "readable", "ReadableWritablePair"), jr(r, `${t} has member 'readable' that`);
				const s = e?.writable;
				return zr(s, "writable", "ReadableWritablePair"), Bo(s, `${t} has member 'writable' that`), {
					readable: r,
					writable: s
				};
			}
			n$1(ys, "convertReadableWritablePair");
			const Pn = class Pn {
				constructor(t = {}, r = {}) {
					t === void 0 ? t = null : Jn(t, "First parameter");
					const s = Zt(r, "Second parameter"), u = fs(t, "First parameter");
					if (cn(this), u.type === "bytes") {
						if (s.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
						const c = Tt(s, 0);
						ca(this, u, c);
					} else {
						const c = Gt(s), d = Tt(s, 1);
						rs(this, u, d, c);
					}
				}
				get locked() {
					if (!We(this)) throw Me("locked");
					return qe(this);
				}
				cancel(t = void 0) {
					return We(this) ? qe(this) ? b(/* @__PURE__ */ new TypeError("Cannot cancel a stream that already has a reader")) : ie(this, t) : b(Me("cancel"));
				}
				getReader(t = void 0) {
					if (!We(this)) throw Me("getReader");
					return ha(t, "First parameter").mode === void 0 ? Qe(this) : Co(this);
				}
				pipeThrough(t, r = {}) {
					if (!We(this)) throw Me("pipeThrough");
					Se(t, 1, "pipeThrough");
					const s = ys(t, "First parameter"), u = Yo(r, "Second parameter");
					if (qe(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
					if (Ze(s.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
					return Q(Ho(this, s.writable, u.preventClose, u.preventAbort, u.preventCancel, u.signal)), s.readable;
				}
				pipeTo(t, r = {}) {
					if (!We(this)) return b(Me("pipeTo"));
					if (t === void 0) return b("Parameter 1 is required in 'pipeTo'.");
					if (!Ge(t)) return b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
					let s;
					try {
						s = Yo(r, "Second parameter");
					} catch (u) {
						return b(u);
					}
					return qe(this) ? b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Ze(t) ? b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Ho(this, t, s.preventClose, s.preventAbort, s.preventCancel, s.signal);
				}
				tee() {
					if (!We(this)) throw Me("tee");
					return St(ns(this));
				}
				values(t = void 0) {
					if (!We(this)) throw Me("values");
					const r = bs(t, "First parameter");
					return Ki(this, r.preventCancel);
				}
				[Ur](t) {
					return this.values(t);
				}
				static from(t) {
					return ss(t);
				}
			};
			n$1(Pn, "ReadableStream");
			let L = Pn;
			Object.defineProperties(L, { from: { enumerable: true } }), Object.defineProperties(L.prototype, {
				cancel: { enumerable: true },
				getReader: { enumerable: true },
				pipeThrough: { enumerable: true },
				pipeTo: { enumerable: true },
				tee: { enumerable: true },
				values: { enumerable: true },
				locked: { enumerable: true }
			}), h(L.from, "from"), h(L.prototype.cancel, "cancel"), h(L.prototype.getReader, "getReader"), h(L.prototype.pipeThrough, "pipeThrough"), h(L.prototype.pipeTo, "pipeTo"), h(L.prototype.tee, "tee"), h(L.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(L.prototype, Symbol.toStringTag, {
				value: "ReadableStream",
				configurable: true
			}), Object.defineProperty(L.prototype, Ur, {
				value: L.prototype.values,
				writable: true,
				configurable: true
			});
			function Et(e, t, r, s = 1, u = () => 1) {
				const c = Object.create(L.prototype);
				cn(c);
				return Qo(c, Object.create(ne.prototype), e, t, r, s, u), c;
			}
			n$1(Et, "CreateReadableStream");
			function Go(e, t, r) {
				const s = Object.create(L.prototype);
				cn(s);
				return To(s, Object.create(te.prototype), e, t, r, 0, void 0), s;
			}
			n$1(Go, "CreateReadableByteStream");
			function cn(e) {
				e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = false;
			}
			n$1(cn, "InitializeReadableStream");
			function We(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? false : e instanceof L;
			}
			n$1(We, "IsReadableStream");
			function qe(e) {
				return e._reader !== void 0;
			}
			n$1(qe, "IsReadableStreamLocked");
			function ie(e, t) {
				if (e._disturbed = true, e._state === "closed") return T(void 0);
				if (e._state === "errored") return b(e._storedError);
				At(e);
				const r = e._reader;
				if (r !== void 0 && je(r)) {
					const u = r._readIntoRequests;
					r._readIntoRequests = new D(), u.forEach((c) => {
						c._closeSteps(void 0);
					});
				}
				return F(e._readableStreamController[Ar](t), f);
			}
			n$1(ie, "ReadableStreamCancel");
			function At(e) {
				e._state = "closed";
				const t = e._reader;
				if (t !== void 0 && (Zn(t), Ee(t))) {
					const r = t._readRequests;
					t._readRequests = new D(), r.forEach((s) => {
						s._closeSteps();
					});
				}
			}
			n$1(At, "ReadableStreamClose");
			function Zo(e, t) {
				e._state = "errored", e._storedError = t;
				const r = e._reader;
				r !== void 0 && (Or(r, t), Ee(r) ? ro(r, t) : Ao(r, t));
			}
			n$1(Zo, "ReadableStreamError");
			function Me(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
			}
			n$1(Me, "streamBrandCheckException$1");
			function Ko(e, t) {
				ue(e, t);
				const r = e?.highWaterMark;
				return zr(r, "highWaterMark", "QueuingStrategyInit"), { highWaterMark: Ir(r) };
			}
			n$1(Ko, "convertQueuingStrategyInit");
			const Jo = n$1((e) => e.byteLength, "byteLengthSizeFunction");
			h(Jo, "size");
			const vn = class vn {
				constructor(t) {
					Se(t, 1, "ByteLengthQueuingStrategy"), t = Ko(t, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t.highWaterMark;
				}
				get highWaterMark() {
					if (!ei(this)) throw Xo("highWaterMark");
					return this._byteLengthQueuingStrategyHighWaterMark;
				}
				get size() {
					if (!ei(this)) throw Xo("size");
					return Jo;
				}
			};
			n$1(vn, "ByteLengthQueuingStrategy");
			let Xe = vn;
			Object.defineProperties(Xe.prototype, {
				highWaterMark: { enumerable: true },
				size: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Xe.prototype, Symbol.toStringTag, {
				value: "ByteLengthQueuingStrategy",
				configurable: true
			});
			function Xo(e) {
				return /* @__PURE__ */ new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
			}
			n$1(Xo, "byteLengthBrandCheckException");
			function ei(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? false : e instanceof Xe;
			}
			n$1(ei, "IsByteLengthQueuingStrategy");
			const ti = n$1(() => 1, "countSizeFunction");
			h(ti, "size");
			const En = class En {
				constructor(t) {
					Se(t, 1, "CountQueuingStrategy"), t = Ko(t, "First parameter"), this._countQueuingStrategyHighWaterMark = t.highWaterMark;
				}
				get highWaterMark() {
					if (!ni(this)) throw ri("highWaterMark");
					return this._countQueuingStrategyHighWaterMark;
				}
				get size() {
					if (!ni(this)) throw ri("size");
					return ti;
				}
			};
			n$1(En, "CountQueuingStrategy");
			let et = En;
			Object.defineProperties(et.prototype, {
				highWaterMark: { enumerable: true },
				size: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(et.prototype, Symbol.toStringTag, {
				value: "CountQueuingStrategy",
				configurable: true
			});
			function ri(e) {
				return /* @__PURE__ */ new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
			}
			n$1(ri, "countBrandCheckException");
			function ni(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? false : e instanceof et;
			}
			n$1(ni, "IsCountQueuingStrategy");
			function gs(e, t) {
				ue(e, t);
				const r = e?.cancel, s = e?.flush, u = e?.readableType, c = e?.start, d = e?.transform, m = e?.writableType;
				return {
					cancel: r === void 0 ? void 0 : Rs(r, e, `${t} has member 'cancel' that`),
					flush: s === void 0 ? void 0 : _s(s, e, `${t} has member 'flush' that`),
					readableType: u,
					start: c === void 0 ? void 0 : Ss(c, e, `${t} has member 'start' that`),
					transform: d === void 0 ? void 0 : ws(d, e, `${t} has member 'transform' that`),
					writableType: m
				};
			}
			n$1(gs, "convertTransformer");
			function _s(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(_s, "convertTransformerFlushCallback");
			function Ss(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(Ss, "convertTransformerStartCallback");
			function ws(e, t, r) {
				return Z(e, r), (s, u) => j(e, t, [s, u]);
			}
			n$1(ws, "convertTransformerTransformCallback");
			function Rs(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(Rs, "convertTransformerCancelCallback");
			const An = class An {
				constructor(t = {}, r = {}, s = {}) {
					t === void 0 && (t = null);
					const u = Zt(r, "Second parameter"), c = Zt(s, "Third parameter"), d = gs(t, "First parameter");
					if (d.readableType !== void 0) throw new RangeError("Invalid readableType specified");
					if (d.writableType !== void 0) throw new RangeError("Invalid writableType specified");
					const m = Tt(c, 0), R = Gt(c), y = Tt(u, 1), C = Gt(u);
					let P;
					const B = A((ae) => {
						P = ae;
					});
					Ts(this, B, y, C, m, R), Ps(this, d), d.start !== void 0 ? P(d.start(this._transformStreamController)) : P(void 0);
				}
				get readable() {
					if (!oi(this)) throw li("readable");
					return this._readable;
				}
				get writable() {
					if (!oi(this)) throw li("writable");
					return this._writable;
				}
			};
			n$1(An, "TransformStream");
			let tt = An;
			Object.defineProperties(tt.prototype, {
				readable: { enumerable: true },
				writable: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(tt.prototype, Symbol.toStringTag, {
				value: "TransformStream",
				configurable: true
			});
			function Ts(e, t, r, s, u, c) {
				function d() {
					return t;
				}
				n$1(d, "startAlgorithm");
				function m(B) {
					return As(e, B);
				}
				n$1(m, "writeAlgorithm");
				function R(B) {
					return Bs(e, B);
				}
				n$1(R, "abortAlgorithm");
				function y() {
					return ks(e);
				}
				n$1(y, "closeAlgorithm"), e._writable = Ea(d, m, y, R, r, s);
				function C() {
					return Ws(e);
				}
				n$1(C, "pullAlgorithm");
				function P(B) {
					return qs(e, B);
				}
				n$1(P, "cancelAlgorithm"), e._readable = Et(d, C, P, u, c), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, sr(e, true), e._transformStreamController = void 0;
			}
			n$1(Ts, "InitializeTransformStream");
			function oi(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? false : e instanceof tt;
			}
			n$1(oi, "IsTransformStream");
			function ii(e, t) {
				oe(e._readable._readableStreamController, t), dn(e, t);
			}
			n$1(ii, "TransformStreamError");
			function dn(e, t) {
				ur(e._transformStreamController), Ct(e._writable._writableStreamController, t), hn(e);
			}
			n$1(dn, "TransformStreamErrorWritableAndUnblockWrite");
			function hn(e) {
				e._backpressure && sr(e, false);
			}
			n$1(hn, "TransformStreamUnblockWrite");
			function sr(e, t) {
				e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = A((r) => {
					e._backpressureChangePromise_resolve = r;
				}), e._backpressure = t;
			}
			n$1(sr, "TransformStreamSetBackpressure");
			const Bn = class Bn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get desiredSize() {
					if (!lr(this)) throw fr("desiredSize");
					const t = this._controlledTransformStream._readable._readableStreamController;
					return fn(t);
				}
				enqueue(t = void 0) {
					if (!lr(this)) throw fr("enqueue");
					ai(this, t);
				}
				error(t = void 0) {
					if (!lr(this)) throw fr("error");
					vs(this, t);
				}
				terminate() {
					if (!lr(this)) throw fr("terminate");
					Es(this);
				}
			};
			n$1(Bn, "TransformStreamDefaultController");
			let pe = Bn;
			Object.defineProperties(pe.prototype, {
				enqueue: { enumerable: true },
				error: { enumerable: true },
				terminate: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(pe.prototype.enqueue, "enqueue"), h(pe.prototype.error, "error"), h(pe.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, {
				value: "TransformStreamDefaultController",
				configurable: true
			});
			function lr(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? false : e instanceof pe;
			}
			n$1(lr, "IsTransformStreamDefaultController");
			function Cs(e, t, r, s, u) {
				t._controlledTransformStream = e, e._transformStreamController = t, t._transformAlgorithm = r, t._flushAlgorithm = s, t._cancelAlgorithm = u, t._finishPromise = void 0, t._finishPromise_resolve = void 0, t._finishPromise_reject = void 0;
			}
			n$1(Cs, "SetUpTransformStreamDefaultController");
			function Ps(e, t) {
				const r = Object.create(pe.prototype);
				let s, u, c;
				t.transform !== void 0 ? s = n$1((d) => t.transform(d, r), "transformAlgorithm") : s = n$1((d) => {
					try {
						return ai(r, d), T(void 0);
					} catch (m) {
						return b(m);
					}
				}, "transformAlgorithm"), t.flush !== void 0 ? u = n$1(() => t.flush(r), "flushAlgorithm") : u = n$1(() => T(void 0), "flushAlgorithm"), t.cancel !== void 0 ? c = n$1((d) => t.cancel(d), "cancelAlgorithm") : c = n$1(() => T(void 0), "cancelAlgorithm"), Cs(e, r, s, u, c);
			}
			n$1(Ps, "SetUpTransformStreamDefaultControllerFromTransformer");
			function ur(e) {
				e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
			}
			n$1(ur, "TransformStreamDefaultControllerClearAlgorithms");
			function ai(e, t) {
				const r = e._controlledTransformStream, s = r._readable._readableStreamController;
				if (!Je(s)) throw new TypeError("Readable side is not in a state that permits enqueue");
				try {
					Ke(s, t);
				} catch (c) {
					throw dn(r, c), r._readable._storedError;
				}
				ts(s) !== r._backpressure && sr(r, true);
			}
			n$1(ai, "TransformStreamDefaultControllerEnqueue");
			function vs(e, t) {
				ii(e._controlledTransformStream, t);
			}
			n$1(vs, "TransformStreamDefaultControllerError");
			function si(e, t) {
				return F(e._transformAlgorithm(t), void 0, (s) => {
					throw ii(e._controlledTransformStream, s), s;
				});
			}
			n$1(si, "TransformStreamDefaultControllerPerformTransform");
			function Es(e) {
				const t = e._controlledTransformStream, r = t._readable._readableStreamController;
				De(r);
				dn(t, /* @__PURE__ */ new TypeError("TransformStream terminated"));
			}
			n$1(Es, "TransformStreamDefaultControllerTerminate");
			function As(e, t) {
				const r = e._transformStreamController;
				if (e._backpressure) {
					const s = e._backpressureChangePromise;
					return F(s, () => {
						const u = e._writable;
						if (u._state === "erroring") throw u._storedError;
						return si(r, t);
					});
				}
				return si(r, t);
			}
			n$1(As, "TransformStreamDefaultSinkWriteAlgorithm");
			function Bs(e, t) {
				const r = e._transformStreamController;
				if (r._finishPromise !== void 0) return r._finishPromise;
				const s = e._readable;
				r._finishPromise = A((c, d) => {
					r._finishPromise_resolve = c, r._finishPromise_reject = d;
				});
				const u = r._cancelAlgorithm(t);
				return ur(r), g(u, () => (s._state === "errored" ? rt(r, s._storedError) : (oe(s._readableStreamController, t), pn(r)), null), (c) => (oe(s._readableStreamController, c), rt(r, c), null)), r._finishPromise;
			}
			n$1(Bs, "TransformStreamDefaultSinkAbortAlgorithm");
			function ks(e) {
				const t = e._transformStreamController;
				if (t._finishPromise !== void 0) return t._finishPromise;
				const r = e._readable;
				t._finishPromise = A((u, c) => {
					t._finishPromise_resolve = u, t._finishPromise_reject = c;
				});
				const s = t._flushAlgorithm();
				return ur(t), g(s, () => (r._state === "errored" ? rt(t, r._storedError) : (De(r._readableStreamController), pn(t)), null), (u) => (oe(r._readableStreamController, u), rt(t, u), null)), t._finishPromise;
			}
			n$1(ks, "TransformStreamDefaultSinkCloseAlgorithm");
			function Ws(e) {
				return sr(e, false), e._backpressureChangePromise;
			}
			n$1(Ws, "TransformStreamDefaultSourcePullAlgorithm");
			function qs(e, t) {
				const r = e._transformStreamController;
				if (r._finishPromise !== void 0) return r._finishPromise;
				const s = e._writable;
				r._finishPromise = A((c, d) => {
					r._finishPromise_resolve = c, r._finishPromise_reject = d;
				});
				const u = r._cancelAlgorithm(t);
				return ur(r), g(u, () => (s._state === "errored" ? rt(r, s._storedError) : (Ct(s._writableStreamController, t), hn(e), pn(r)), null), (c) => (Ct(s._writableStreamController, c), hn(e), rt(r, c), null)), r._finishPromise;
			}
			n$1(qs, "TransformStreamDefaultSourceCancelAlgorithm");
			function fr(e) {
				return /* @__PURE__ */ new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
			}
			n$1(fr, "defaultControllerBrandCheckException");
			function pn(e) {
				e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
			}
			n$1(pn, "defaultControllerFinishPromiseResolve");
			function rt(e, t) {
				e._finishPromise_reject !== void 0 && (Q(e._finishPromise), e._finishPromise_reject(t), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
			}
			n$1(rt, "defaultControllerFinishPromiseReject");
			function li(e) {
				return /* @__PURE__ */ new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
			}
			n$1(li, "streamBrandCheckException"), a.ByteLengthQueuingStrategy = Xe, a.CountQueuingStrategy = et, a.ReadableByteStreamController = te, a.ReadableStream = L, a.ReadableStreamBYOBReader = ce, a.ReadableStreamBYOBRequest = Re, a.ReadableStreamDefaultController = ne, a.ReadableStreamDefaultReader = fe, a.TransformStream = tt, a.TransformStreamDefaultController = pe, a.WritableStream = de, a.WritableStreamDefaultController = ke, a.WritableStreamDefaultWriter = re;
		});
	}(kt, kt.exports)), kt.exports;
}
n$1(Ns, "requirePonyfill_es2018");
var mi;
function Hs() {
	if (mi) return pi;
	mi = 1;
	const i = 65536;
	if (!globalThis.ReadableStream) try {
		const o = __require("node:process"), { emitWarning: a } = o;
		try {
			o.emitWarning = () => {}, Object.assign(globalThis, __require("node:stream/web")), o.emitWarning = a;
		} catch (f) {
			throw o.emitWarning = a, f;
		}
	} catch {
		Object.assign(globalThis, Ns());
	}
	try {
		const { Blob: o } = __require("buffer");
		o && !o.prototype.stream && (o.prototype.stream = n$1(function(f) {
			let l = 0;
			const p = this;
			return new ReadableStream({
				type: "bytes",
				async pull(h) {
					const v = await p.slice(l, Math.min(p.size, l + i)).arrayBuffer();
					l += v.byteLength, h.enqueue(new Uint8Array(v)), l === p.size && h.close();
				}
			});
		}, "name"));
	} catch {}
	return pi;
}
n$1(Hs, "requireStreams"), Hs();
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var yi = 65536;
async function* Wn(i, o = true) {
	for (const a of i) if ("stream" in a) yield* a.stream();
	else if (ArrayBuffer.isView(a)) if (o) {
		let f = a.byteOffset;
		const l = a.byteOffset + a.byteLength;
		for (; f !== l;) {
			const p = Math.min(l - f, yi), h = a.buffer.slice(f, f + p);
			f += h.byteLength, yield new Uint8Array(h);
		}
	} else yield a;
	else {
		let f = 0, l = a;
		for (; f !== l.size;) {
			const h = await l.slice(f, Math.min(l.size, f + yi)).arrayBuffer();
			f += h.byteLength, yield new Uint8Array(h);
		}
	}
}
n$1(Wn, "toIterator");
var gi = (ze = class {
	constructor(o = [], a = {}) {
		be(this, ve, []);
		be(this, zt, "");
		be(this, bt, 0);
		be(this, Cr, "transparent");
		if (typeof o != "object" || o === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
		if (typeof o[Symbol.iterator] != "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
		if (typeof a != "object" && typeof a != "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
		a === null && (a = {});
		const f = new TextEncoder();
		for (const p of o) {
			let h;
			ArrayBuffer.isView(p) ? h = new Uint8Array(p.buffer.slice(p.byteOffset, p.byteOffset + p.byteLength)) : p instanceof ArrayBuffer ? h = new Uint8Array(p.slice(0)) : p instanceof ze ? h = p : h = f.encode(`${p}`), X(this, bt, O$1(this, bt) + (ArrayBuffer.isView(h) ? h.byteLength : h.size)), O$1(this, ve).push(h);
		}
		X(this, Cr, `${a.endings === void 0 ? "transparent" : a.endings}`);
		const l = a.type === void 0 ? "" : String(a.type);
		X(this, zt, /^[\x20-\x7E]*$/.test(l) ? l : "");
	}
	get size() {
		return O$1(this, bt);
	}
	get type() {
		return O$1(this, zt);
	}
	async text() {
		const o = new TextDecoder();
		let a = "";
		for await (const f of Wn(O$1(this, ve), false)) a += o.decode(f, { stream: true });
		return a += o.decode(), a;
	}
	async arrayBuffer() {
		const o = new Uint8Array(this.size);
		let a = 0;
		for await (const f of Wn(O$1(this, ve), false)) o.set(f, a), a += f.length;
		return o.buffer;
	}
	stream() {
		const o = Wn(O$1(this, ve), true);
		return new globalThis.ReadableStream({
			type: "bytes",
			async pull(a) {
				const f = await o.next();
				f.done ? a.close() : a.enqueue(f.value);
			},
			async cancel() {
				await o.return();
			}
		});
	}
	slice(o = 0, a = this.size, f = "") {
		const { size: l } = this;
		let p = o < 0 ? Math.max(l + o, 0) : Math.min(o, l), h = a < 0 ? Math.max(l + a, 0) : Math.min(a, l);
		const S = Math.max(h - p, 0), v = O$1(this, ve), w = [];
		let A = 0;
		for (const b of v) {
			if (A >= S) break;
			const q = ArrayBuffer.isView(b) ? b.byteLength : b.size;
			if (p && q <= p) p -= q, h -= q;
			else {
				let g;
				ArrayBuffer.isView(b) ? (g = b.subarray(p, Math.min(q, h)), A += g.byteLength) : (g = b.slice(p, Math.min(q, h)), A += g.size), h -= q, w.push(g), p = 0;
			}
		}
		const T = new ze([], { type: String(f).toLowerCase() });
		return X(T, bt, S), X(T, ve, w), T;
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
	static [Symbol.hasInstance](o) {
		return o && typeof o == "object" && typeof o.constructor == "function" && (typeof o.stream == "function" || typeof o.arrayBuffer == "function") && /^(Blob|File)$/.test(o[Symbol.toStringTag]);
	}
}, ve = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), n$1(ze, "Blob"), ze);
Object.defineProperties(gi.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});
var ut = gi;
var qn = (mt = class extends ut {
	constructor(a, f, l = {}) {
		if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
		super(a, l);
		be(this, It, 0);
		be(this, Ft, "");
		l === null && (l = {});
		const p = l.lastModified === void 0 ? Date.now() : Number(l.lastModified);
		Number.isNaN(p) || X(this, It, p), X(this, Ft, String(f));
	}
	get name() {
		return O$1(this, Ft);
	}
	get lastModified() {
		return O$1(this, It);
	}
	get [Symbol.toStringTag]() {
		return "File";
	}
	static [Symbol.hasInstance](a) {
		return !!a && a instanceof ut && /^(File)$/.test(a[Symbol.toStringTag]);
	}
}, It = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), n$1(mt, "File"), mt);
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var { toStringTag: Wt, iterator: Qs, hasInstance: Ys } = Symbol, _i = Math.random, Gs = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), Si = n$1((i, o, a) => (i += "", /^(Blob|File)$/.test(o && o[Wt]) ? [(a = a !== void 0 ? a + "" : o[Wt] == "File" ? o.name : "blob", i), o.name !== a || o[Wt] == "blob" ? new qn([o], a, o) : o] : [i, o + ""]), "f"), On = n$1((i, o) => (o ? i : i.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e$1"), Ue = n$1((i, o, a) => {
	if (o.length < a) throw new TypeError(`Failed to execute '${i}' on 'FormData': ${a} arguments required, but only ${o.length} present.`);
}, "x");
var br = (yt = class {
	constructor(...o) {
		be(this, ee, []);
		if (o.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
	}
	get [Wt]() {
		return "FormData";
	}
	[Qs]() {
		return this.entries();
	}
	static [Ys](o) {
		return o && typeof o == "object" && o[Wt] === "FormData" && !Gs.some((a) => typeof o[a] != "function");
	}
	append(...o) {
		Ue("append", arguments, 2), O$1(this, ee).push(Si(...o));
	}
	delete(o) {
		Ue("delete", arguments, 1), o += "", X(this, ee, O$1(this, ee).filter(([a]) => a !== o));
	}
	get(o) {
		Ue("get", arguments, 1), o += "";
		for (var a = O$1(this, ee), f = a.length, l = 0; l < f; l++) if (a[l][0] === o) return a[l][1];
		return null;
	}
	getAll(o, a) {
		return Ue("getAll", arguments, 1), a = [], o += "", O$1(this, ee).forEach((f) => f[0] === o && a.push(f[1])), a;
	}
	has(o) {
		return Ue("has", arguments, 1), o += "", O$1(this, ee).some((a) => a[0] === o);
	}
	forEach(o, a) {
		Ue("forEach", arguments, 1);
		for (var [f, l] of this) o.call(a, l, f, this);
	}
	set(...o) {
		Ue("set", arguments, 2);
		var a = [], f = true;
		o = Si(...o), O$1(this, ee).forEach((l) => {
			l[0] === o[0] ? f && (f = !a.push(o)) : a.push(l);
		}), f && a.push(o), X(this, ee, a);
	}
	*entries() {
		yield* O$1(this, ee);
	}
	*keys() {
		for (var [o] of this) yield o;
	}
	*values() {
		for (var [, o] of this) yield o;
	}
}, ee = /* @__PURE__ */ new WeakMap(), n$1(yt, "FormData"), yt);
function Zs(i, o = ut) {
	var a = `${_i()}${_i()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), f = [], l = `--${a}\r
Content-Disposition: form-data; name="`;
	return i.forEach((p, h) => typeof p == "string" ? f.push(l + On(h) + `"\r
\r
${p.replace(/\r(?!\n)|(?<!\r)\n/g, `\r
`)}\r
`) : f.push(l + On(h) + `"; filename="${On(p.name, 1)}"\r
Content-Type: ${p.type || "application/octet-stream"}\r
\r
`, p, `\r
`)), f.push(`--${a}--`), new o(f, { type: "multipart/form-data; boundary=" + a });
}
n$1(Zs, "formDataToBlob");
var Un = class Un extends Error {
	constructor(o, a) {
		super(o), Error.captureStackTrace(this, this.constructor), this.type = a;
	}
	get name() {
		return this.constructor.name;
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
};
n$1(Un, "FetchBaseError");
var ft = Un;
var xn = class xn extends ft {
	constructor(o, a, f) {
		super(o, a), f && (this.code = this.errno = f.code, this.erroredSysCall = f.syscall);
	}
};
n$1(xn, "FetchError");
var G = xn;
var mr = Symbol.toStringTag;
var wi = n$1((i) => typeof i == "object" && typeof i.append == "function" && typeof i.delete == "function" && typeof i.get == "function" && typeof i.getAll == "function" && typeof i.has == "function" && typeof i.set == "function" && typeof i.sort == "function" && i[mr] === "URLSearchParams", "isURLSearchParameters");
var yr = n$1((i) => i && typeof i == "object" && typeof i.arrayBuffer == "function" && typeof i.type == "string" && typeof i.stream == "function" && typeof i.constructor == "function" && /^(Blob|File)$/.test(i[mr]), "isBlob");
var Ks = n$1((i) => typeof i == "object" && (i[mr] === "AbortSignal" || i[mr] === "EventTarget"), "isAbortSignal");
var Js = n$1((i, o) => {
	const a = new URL(o).hostname, f = new URL(i).hostname;
	return a === f || a.endsWith(`.${f}`);
}, "isDomainOrSubdomain");
var Xs = n$1((i, o) => {
	return new URL(o).protocol === new URL(i).protocol;
}, "isSameProtocol");
var el = promisify(me.pipeline);
var H$1 = Symbol("Body internals");
var Nn = class Nn {
	constructor(o, { size: a = 0 } = {}) {
		let f = null;
		o === null ? o = null : wi(o) ? o = Buffer$1.from(o.toString()) : yr(o) || Buffer$1.isBuffer(o) || (types.isAnyArrayBuffer(o) ? o = Buffer$1.from(o) : ArrayBuffer.isView(o) ? o = Buffer$1.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof me || (o instanceof br ? (o = Zs(o), f = o.type.split("=")[1]) : o = Buffer$1.from(String(o))));
		let l = o;
		Buffer$1.isBuffer(o) ? l = me.Readable.from(o) : yr(o) && (l = me.Readable.from(o.stream())), this[H$1] = {
			body: o,
			stream: l,
			boundary: f,
			disturbed: false,
			error: null
		}, this.size = a, o instanceof me && o.on("error", (p) => {
			const h = p instanceof ft ? p : new G(`Invalid response body while trying to fetch ${this.url}: ${p.message}`, "system", p);
			this[H$1].error = h;
		});
	}
	get body() {
		return this[H$1].stream;
	}
	get bodyUsed() {
		return this[H$1].disturbed;
	}
	async arrayBuffer() {
		const { buffer: o, byteOffset: a, byteLength: f } = await zn(this);
		return o.slice(a, a + f);
	}
	async formData() {
		const o = this.headers.get("content-type");
		if (o.startsWith("application/x-www-form-urlencoded")) {
			const f = new br(), l = new URLSearchParams(await this.text());
			for (const [p, h] of l) f.append(p, h);
			return f;
		}
		const { toFormData: a } = await import('../build/multipart-parser-CSJJajwz.mjs');
		return a(this.body, o);
	}
	async blob() {
		const o = this.headers && this.headers.get("content-type") || this[H$1].body && this[H$1].body.type || "";
		return new ut([await this.arrayBuffer()], { type: o });
	}
	async json() {
		const o = await this.text();
		return JSON.parse(o);
	}
	async text() {
		const o = await zn(this);
		return new TextDecoder().decode(o);
	}
	buffer() {
		return zn(this);
	}
};
n$1(Nn, "Body");
var xe = Nn;
xe.prototype.buffer = deprecate(xe.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer"), Object.defineProperties(xe.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true },
	data: { get: deprecate(() => {}, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
});
async function zn(i) {
	if (i[H$1].disturbed) throw new TypeError(`body used already for: ${i.url}`);
	if (i[H$1].disturbed = true, i[H$1].error) throw i[H$1].error;
	const { body: o } = i;
	if (o === null) return Buffer$1.alloc(0);
	if (!(o instanceof me)) return Buffer$1.alloc(0);
	const a = [];
	let f = 0;
	try {
		for await (const l of o) {
			if (i.size > 0 && f + l.length > i.size) {
				const p = new G(`content size at ${i.url} over limit: ${i.size}`, "max-size");
				throw o.destroy(p), p;
			}
			f += l.length, a.push(l);
		}
	} catch (l) {
		throw l instanceof ft ? l : new G(`Invalid response body while trying to fetch ${i.url}: ${l.message}`, "system", l);
	}
	if (o.readableEnded === true || o._readableState.ended === true) try {
		return a.every((l) => typeof l == "string") ? Buffer$1.from(a.join("")) : Buffer$1.concat(a, f);
	} catch (l) {
		throw new G(`Could not create Buffer from response body for ${i.url}: ${l.message}`, "system", l);
	}
	else throw new G(`Premature close of server response while trying to fetch ${i.url}`);
}
n$1(zn, "consumeBody");
var In = n$1((i, o) => {
	let a, f, { body: l } = i[H$1];
	if (i.bodyUsed) throw new Error("cannot clone body after it is used");
	return l instanceof me && typeof l.getBoundary != "function" && (a = new PassThrough({ highWaterMark: o }), f = new PassThrough({ highWaterMark: o }), l.pipe(a), l.pipe(f), i[H$1].stream = a, l = f), l;
}, "clone");
var tl = deprecate((i) => i.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
var Ri = n$1((i, o) => i === null ? null : typeof i == "string" ? "text/plain;charset=UTF-8" : wi(i) ? "application/x-www-form-urlencoded;charset=UTF-8" : yr(i) ? i.type || null : Buffer$1.isBuffer(i) || types.isAnyArrayBuffer(i) || ArrayBuffer.isView(i) ? null : i instanceof br ? `multipart/form-data; boundary=${o[H$1].boundary}` : i && typeof i.getBoundary == "function" ? `multipart/form-data;boundary=${tl(i)}` : i instanceof me ? null : "text/plain;charset=UTF-8", "extractContentType");
var rl = n$1((i) => {
	const { body: o } = i[H$1];
	return o === null ? 0 : yr(o) ? o.size : Buffer$1.isBuffer(o) ? o.length : o && typeof o.getLengthSync == "function" && o.hasKnownLength && o.hasKnownLength() ? o.getLengthSync() : null;
}, "getTotalBytes");
var nl = n$1(async (i, { body: o }) => {
	o === null ? i.end() : await el(o, i);
}, "writeToStream");
var gr = typeof Bt.validateHeaderName == "function" ? Bt.validateHeaderName : (i) => {
	if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i)) {
		const o = /* @__PURE__ */ new TypeError(`Header name must be a valid HTTP token [${i}]`);
		throw Object.defineProperty(o, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o;
	}
};
var Fn = typeof Bt.validateHeaderValue == "function" ? Bt.validateHeaderValue : (i, o) => {
	if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)) {
		const a = /* @__PURE__ */ new TypeError(`Invalid character in header content ["${i}"]`);
		throw Object.defineProperty(a, "code", { value: "ERR_INVALID_CHAR" }), a;
	}
};
var Pr = class Pr extends URLSearchParams {
	constructor(o) {
		let a = [];
		if (o instanceof Pr) {
			const f = o.raw();
			for (const [l, p] of Object.entries(f)) a.push(...p.map((h) => [l, h]));
		} else if (o != null) if (typeof o == "object" && !types.isBoxedPrimitive(o)) {
			const f = o[Symbol.iterator];
			if (f == null) a.push(...Object.entries(o));
			else {
				if (typeof f != "function") throw new TypeError("Header pairs must be iterable");
				a = [...o].map((l) => {
					if (typeof l != "object" || types.isBoxedPrimitive(l)) throw new TypeError("Each header pair must be an iterable object");
					return [...l];
				}).map((l) => {
					if (l.length !== 2) throw new TypeError("Each header pair must be a name/value tuple");
					return [...l];
				});
			}
		} else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
		return a = a.length > 0 ? a.map(([f, l]) => (gr(f), Fn(f, String(l)), [String(f).toLowerCase(), String(l)])) : void 0, super(a), new Proxy(this, { get(f, l, p) {
			switch (l) {
				case "append":
				case "set": return (h, S) => (gr(h), Fn(h, String(S)), URLSearchParams.prototype[l].call(f, String(h).toLowerCase(), String(S)));
				case "delete":
				case "has":
				case "getAll": return (h) => (gr(h), URLSearchParams.prototype[l].call(f, String(h).toLowerCase()));
				case "keys": return () => (f.sort(), new Set(URLSearchParams.prototype.keys.call(f)).keys());
				default: return Reflect.get(f, l, p);
			}
		} });
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
	toString() {
		return Object.prototype.toString.call(this);
	}
	get(o) {
		const a = this.getAll(o);
		if (a.length === 0) return null;
		let f = a.join(", ");
		return /^content-encoding$/i.test(o) && (f = f.toLowerCase()), f;
	}
	forEach(o, a = void 0) {
		for (const f of this.keys()) Reflect.apply(o, a, [
			this.get(f),
			f,
			this
		]);
	}
	*values() {
		for (const o of this.keys()) yield this.get(o);
	}
	*entries() {
		for (const o of this.keys()) yield [o, this.get(o)];
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	raw() {
		return [...this.keys()].reduce((o, a) => (o[a] = this.getAll(a), o), {});
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return [...this.keys()].reduce((o, a) => {
			const f = this.getAll(a);
			return a === "host" ? o[a] = f[0] : o[a] = f.length > 1 ? f : f[0], o;
		}, {});
	}
};
n$1(Pr, "Headers");
var ye = Pr;
Object.defineProperties(ye.prototype, [
	"get",
	"entries",
	"forEach",
	"values"
].reduce((i, o) => (i[o] = { enumerable: true }, i), {}));
function ol(i = []) {
	return new ye(i.reduce((o, a, f, l) => (f % 2 === 0 && o.push(l.slice(f, f + 2)), o), []).filter(([o, a]) => {
		try {
			return gr(o), Fn(o, String(a)), !0;
		} catch {
			return false;
		}
	}));
}
n$1(ol, "fromRawHeaders");
var il = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308
]);
var jn = n$1((i) => il.has(i), "isRedirect");
var se = Symbol("Response internals");
var Ne = class Ne extends xe {
	constructor(o = null, a = {}) {
		super(o, a);
		const f = a.status != null ? a.status : 200, l = new ye(a.headers);
		if (o !== null && !l.has("Content-Type")) {
			const p = Ri(o, this);
			p && l.append("Content-Type", p);
		}
		this[se] = {
			type: "default",
			url: a.url,
			status: f,
			statusText: a.statusText || "",
			headers: l,
			counter: a.counter,
			highWaterMark: a.highWaterMark
		};
	}
	get type() {
		return this[se].type;
	}
	get url() {
		return this[se].url || "";
	}
	get status() {
		return this[se].status;
	}
	get ok() {
		return this[se].status >= 200 && this[se].status < 300;
	}
	get redirected() {
		return this[se].counter > 0;
	}
	get statusText() {
		return this[se].statusText;
	}
	get headers() {
		return this[se].headers;
	}
	get highWaterMark() {
		return this[se].highWaterMark;
	}
	clone() {
		return new Ne(In(this, this.highWaterMark), {
			type: this.type,
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected,
			size: this.size,
			highWaterMark: this.highWaterMark
		});
	}
	static redirect(o, a = 302) {
		if (!jn(a)) throw new RangeError("Failed to execute \"redirect\" on \"response\": Invalid status code");
		return new Ne(null, {
			headers: { location: new URL(o).toString() },
			status: a
		});
	}
	static error() {
		const o = new Ne(null, {
			status: 0,
			statusText: ""
		});
		return o[se].type = "error", o;
	}
	static json(o = void 0, a = {}) {
		const f = JSON.stringify(o);
		if (f === void 0) throw new TypeError("data is not JSON serializable");
		const l = new ye(a && a.headers);
		return l.has("content-type") || l.set("content-type", "application/json"), new Ne(f, {
			...a,
			headers: l
		});
	}
	get [Symbol.toStringTag]() {
		return "Response";
	}
};
n$1(Ne, "Response");
var le = Ne;
Object.defineProperties(le.prototype, {
	type: { enumerable: true },
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});
var al = n$1((i) => {
	if (i.search) return i.search;
	const o = i.href.length - 1, a = i.hash || (i.href[o] === "#" ? "#" : "");
	return i.href[o - a.length] === "?" ? "?" : "";
}, "getSearch");
function Ti(i, o = false) {
	return i == null || (i = new URL(i), /^(about|blob|data):$/.test(i.protocol)) ? "no-referrer" : (i.username = "", i.password = "", i.hash = "", o && (i.pathname = "", i.search = ""), i);
}
n$1(Ti, "stripURLForUseAsAReferrer");
var Ci = /* @__PURE__ */ new Set([
	"",
	"no-referrer",
	"no-referrer-when-downgrade",
	"same-origin",
	"origin",
	"strict-origin",
	"origin-when-cross-origin",
	"strict-origin-when-cross-origin",
	"unsafe-url"
]);
var sl = "strict-origin-when-cross-origin";
function ll(i) {
	if (!Ci.has(i)) throw new TypeError(`Invalid referrerPolicy: ${i}`);
	return i;
}
n$1(ll, "validateReferrerPolicy");
function ul(i) {
	if (/^(http|ws)s:$/.test(i.protocol)) return true;
	const o = i.host.replace(/(^\[)|(]$)/g, ""), a = isIP(o);
	return a === 4 && /^127\./.test(o) || a === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o) ? true : i.host === "localhost" || i.host.endsWith(".localhost") ? false : i.protocol === "file:";
}
n$1(ul, "isOriginPotentiallyTrustworthy");
function ct(i) {
	return /^about:(blank|srcdoc)$/.test(i) || i.protocol === "data:" || /^(blob|filesystem):$/.test(i.protocol) ? true : ul(i);
}
n$1(ct, "isUrlPotentiallyTrustworthy");
function fl(i, { referrerURLCallback: o, referrerOriginCallback: a } = {}) {
	if (i.referrer === "no-referrer" || i.referrerPolicy === "") return null;
	const f = i.referrerPolicy;
	if (i.referrer === "about:client") return "no-referrer";
	const l = i.referrer;
	let p = Ti(l), h = Ti(l, true);
	p.toString().length > 4096 && (p = h), o && (p = o(p)), a && (h = a(h));
	const S = new URL(i.url);
	switch (f) {
		case "no-referrer": return "no-referrer";
		case "origin": return h;
		case "unsafe-url": return p;
		case "strict-origin": return ct(p) && !ct(S) ? "no-referrer" : h.toString();
		case "strict-origin-when-cross-origin": return p.origin === S.origin ? p : ct(p) && !ct(S) ? "no-referrer" : h;
		case "same-origin": return p.origin === S.origin ? p : "no-referrer";
		case "origin-when-cross-origin": return p.origin === S.origin ? p : h;
		case "no-referrer-when-downgrade": return ct(p) && !ct(S) ? "no-referrer" : p;
		default: throw new TypeError(`Invalid referrerPolicy: ${f}`);
	}
}
n$1(fl, "determineRequestsReferrer");
function cl(i) {
	const o = (i.get("referrer-policy") || "").split(/[,\s]+/);
	let a = "";
	for (const f of o) f && Ci.has(f) && (a = f);
	return a;
}
n$1(cl, "parseReferrerPolicyFromHeader");
var $$3 = Symbol("Request internals");
var qt = n$1((i) => typeof i == "object" && typeof i[$$3] == "object", "isRequest");
var dl = deprecate(() => {}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
var vr = class vr extends xe {
	constructor(o, a = {}) {
		let f;
		if (qt(o) ? f = new URL(o.url) : (f = new URL(o), o = {}), f.username !== "" || f.password !== "") throw new TypeError(`${f} is an url with embedded credentials.`);
		let l = a.method || o.method || "GET";
		if (/^(delete|get|head|options|post|put)$/i.test(l) && (l = l.toUpperCase()), !qt(a) && "data" in a && dl(), (a.body != null || qt(o) && o.body !== null) && (l === "GET" || l === "HEAD")) throw new TypeError("Request with GET/HEAD method cannot have body");
		const p = a.body ? a.body : qt(o) && o.body !== null ? In(o) : null;
		super(p, { size: a.size || o.size || 0 });
		const h = new ye(a.headers || o.headers || {});
		if (p !== null && !h.has("Content-Type")) {
			const w = Ri(p, this);
			w && h.set("Content-Type", w);
		}
		let S = qt(o) ? o.signal : null;
		if ("signal" in a && (S = a.signal), S != null && !Ks(S)) throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
		let v = a.referrer == null ? o.referrer : a.referrer;
		if (v === "") v = "no-referrer";
		else if (v) {
			const w = new URL(v);
			v = /^about:(\/\/)?client$/.test(w) ? "client" : w;
		} else v = void 0;
		this[$$3] = {
			method: l,
			redirect: a.redirect || o.redirect || "follow",
			headers: h,
			parsedURL: f,
			signal: S,
			referrer: v
		}, this.follow = a.follow === void 0 ? o.follow === void 0 ? 20 : o.follow : a.follow, this.compress = a.compress === void 0 ? o.compress === void 0 ? true : o.compress : a.compress, this.counter = a.counter || o.counter || 0, this.agent = a.agent || o.agent, this.highWaterMark = a.highWaterMark || o.highWaterMark || 16384, this.insecureHTTPParser = a.insecureHTTPParser || o.insecureHTTPParser || false, this.referrerPolicy = a.referrerPolicy || o.referrerPolicy || "";
	}
	get method() {
		return this[$$3].method;
	}
	get url() {
		return format(this[$$3].parsedURL);
	}
	get headers() {
		return this[$$3].headers;
	}
	get redirect() {
		return this[$$3].redirect;
	}
	get signal() {
		return this[$$3].signal;
	}
	get referrer() {
		if (this[$$3].referrer === "no-referrer") return "";
		if (this[$$3].referrer === "client") return "about:client";
		if (this[$$3].referrer) return this[$$3].referrer.toString();
	}
	get referrerPolicy() {
		return this[$$3].referrerPolicy;
	}
	set referrerPolicy(o) {
		this[$$3].referrerPolicy = ll(o);
	}
	clone() {
		return new vr(this);
	}
	get [Symbol.toStringTag]() {
		return "Request";
	}
};
n$1(vr, "Request");
var dt = vr;
Object.defineProperties(dt.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true },
	referrer: { enumerable: true },
	referrerPolicy: { enumerable: true }
});
var hl = n$1((i) => {
	const { parsedURL: o } = i[$$3], a = new ye(i[$$3].headers);
	a.has("Accept") || a.set("Accept", "*/*");
	let f = null;
	if (i.body === null && /^(post|put)$/i.test(i.method) && (f = "0"), i.body !== null) {
		const S = rl(i);
		typeof S == "number" && !Number.isNaN(S) && (f = String(S));
	}
	f && a.set("Content-Length", f), i.referrerPolicy === "" && (i.referrerPolicy = sl), i.referrer && i.referrer !== "no-referrer" ? i[$$3].referrer = fl(i) : i[$$3].referrer = "no-referrer", i[$$3].referrer instanceof URL && a.set("Referer", i.referrer), a.has("User-Agent") || a.set("User-Agent", "node-fetch"), i.compress && !a.has("Accept-Encoding") && a.set("Accept-Encoding", "gzip, deflate, br");
	let { agent: l } = i;
	typeof l == "function" && (l = l(o));
	const p = al(o);
	return {
		parsedURL: o,
		options: {
			path: o.pathname + p,
			method: i.method,
			headers: a[Symbol.for("nodejs.util.inspect.custom")](),
			insecureHTTPParser: i.insecureHTTPParser,
			agent: l
		}
	};
}, "getNodeRequestOptions");
var Hn = class Hn extends ft {
	constructor(o, a = "aborted") {
		super(o, a);
	}
};
n$1(Hn, "AbortError");
var _r = Hn;
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var Ln;
var Pi;
function pl() {
	if (Pi) return Ln;
	if (Pi = 1, !globalThis.DOMException) try {
		const { MessageChannel: i } = __require("worker_threads"), o = new i().port1, a = /* @__PURE__ */ new ArrayBuffer();
		o.postMessage(a, [a, a]);
	} catch (i) {
		i.constructor.name === "DOMException" && (globalThis.DOMException = i.constructor);
	}
	return Ln = globalThis.DOMException, Ln;
}
n$1(pl, "requireNodeDomexception");
var ml = f$5(pl()), { stat: $n } = promises;
n$1((i, o) => vi(statSync(i), i, o), "blobFromSync");
n$1((i, o) => $n(i).then((a) => vi(a, i, o)), "blobFrom");
n$1((i, o) => $n(i).then((a) => Ei(a, i, o)), "fileFrom");
n$1((i, o) => Ei(statSync(i), i, o), "fileFromSync");
var vi = n$1((i, o, a = "") => new ut([new Sr({
	path: o,
	size: i.size,
	lastModified: i.mtimeMs,
	start: 0
})], { type: a }), "fromBlob"), Ei = n$1((i, o, a = "") => new qn([new Sr({
	path: o,
	size: i.size,
	lastModified: i.mtimeMs,
	start: 0
})], basename(o), {
	type: a,
	lastModified: i.mtimeMs
}), "fromFile"), Er = class Er {
	constructor(o) {
		be(this, He);
		be(this, Ve);
		X(this, He, o.path), X(this, Ve, o.start), this.size = o.size, this.lastModified = o.lastModified;
	}
	slice(o, a) {
		return new Er({
			path: O$1(this, He),
			lastModified: this.lastModified,
			size: a - o,
			start: O$1(this, Ve) + o
		});
	}
	async *stream() {
		const { mtimeMs: o } = await $n(O$1(this, He));
		if (o > this.lastModified) throw new ml("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
		yield* createReadStream(O$1(this, He), {
			start: O$1(this, Ve),
			end: O$1(this, Ve) + this.size - 1
		});
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
};
He = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), n$1(Er, "BlobDataItem");
var Sr = Er;
var wl = /* @__PURE__ */ new Set([
	"data:",
	"http:",
	"https:"
]);
async function Ai(i, o) {
	return new Promise((a, f) => {
		const l = new dt(i, o), { parsedURL: p, options: h } = hl(l);
		if (!wl.has(p.protocol)) throw new TypeError(`node-fetch cannot load ${i}. URL scheme "${p.protocol.replace(/:$/, "")}" is not supported.`);
		if (p.protocol === "data:") {
			const g = Us(l.url);
			a(new le(g, { headers: { "Content-Type": g.typeFull } }));
			return;
		}
		const S = (p.protocol === "https:" ? zs : Bt).request, { signal: v } = l;
		let w = null;
		const A = n$1(() => {
			const g = new _r("The operation was aborted.");
			f(g), l.body && l.body instanceof me.Readable && l.body.destroy(g), w && w.body && w.body.emit("error", g);
		}, "abort");
		if (v && v.aborted) {
			A();
			return;
		}
		const T = n$1(() => {
			A(), q();
		}, "abortAndFinalize"), b = S(p.toString(), h);
		v && v.addEventListener("abort", T);
		const q = n$1(() => {
			b.abort(), v && v.removeEventListener("abort", T);
		}, "finalize");
		b.on("error", (g) => {
			f(new G(`request to ${l.url} failed, reason: ${g.message}`, "system", g)), q();
		}), Rl(b, (g) => {
			w && w.body && w.body.destroy(g);
		}), process.version < "v14" && b.on("socket", (g) => {
			let V;
			g.prependListener("end", () => {
				V = g._eventsCount;
			}), g.prependListener("close", (I) => {
				if (w && V < g._eventsCount && !I) {
					const F = /* @__PURE__ */ new Error("Premature close");
					F.code = "ERR_STREAM_PREMATURE_CLOSE", w.body.emit("error", F);
				}
			});
		}), b.on("response", (g) => {
			b.setTimeout(0);
			const V = ol(g.rawHeaders);
			if (jn(g.statusCode)) {
				const z = V.get("Location");
				let j = null;
				try {
					j = z === null ? null : new URL(z, l.url);
				} catch {
					if (l.redirect !== "manual") {
						f(new G(`uri requested responds with an invalid redirect URL: ${z}`, "invalid-redirect")), q();
						return;
					}
				}
				switch (l.redirect) {
					case "error":
						f(new G(`uri requested responds with a redirect, redirect mode is set to error: ${l.url}`, "no-redirect")), q();
						return;
					case "manual": break;
					case "follow": {
						if (j === null) break;
						if (l.counter >= l.follow) {
							f(new G(`maximum redirect reached at: ${l.url}`, "max-redirect")), q();
							return;
						}
						const U = {
							headers: new ye(l.headers),
							follow: l.follow,
							counter: l.counter + 1,
							agent: l.agent,
							compress: l.compress,
							method: l.method,
							body: In(l),
							signal: l.signal,
							size: l.size,
							referrer: l.referrer,
							referrerPolicy: l.referrerPolicy
						};
						if (!Js(l.url, j) || !Xs(l.url, j)) for (const jt of [
							"authorization",
							"www-authenticate",
							"cookie",
							"cookie2"
						]) U.headers.delete(jt);
						if (g.statusCode !== 303 && l.body && o.body instanceof me.Readable) {
							f(new G("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), q();
							return;
						}
						(g.statusCode === 303 || (g.statusCode === 301 || g.statusCode === 302) && l.method === "POST") && (U.method = "GET", U.body = void 0, U.headers.delete("content-length"));
						const D = cl(V);
						D && (U.referrerPolicy = D), a(Ai(new dt(j, U))), q();
						return;
					}
					default: return f(/* @__PURE__ */ new TypeError(`Redirect option '${l.redirect}' is not a valid value of RequestRedirect`));
				}
			}
			v && g.once("end", () => {
				v.removeEventListener("abort", T);
			});
			let I = pipeline(g, new PassThrough(), (z) => {
				z && f(z);
			});
			process.version < "v12.10" && g.on("aborted", T);
			const F = {
				url: l.url,
				status: g.statusCode,
				statusText: g.statusMessage,
				headers: V,
				size: l.size,
				counter: l.counter,
				highWaterMark: l.highWaterMark
			}, Q = V.get("Content-Encoding");
			if (!l.compress || l.method === "HEAD" || Q === null || g.statusCode === 204 || g.statusCode === 304) {
				w = new le(I, F), a(w);
				return;
			}
			const ge = {
				flush: st.Z_SYNC_FLUSH,
				finishFlush: st.Z_SYNC_FLUSH
			};
			if (Q === "gzip" || Q === "x-gzip") {
				I = pipeline(I, st.createGunzip(ge), (z) => {
					z && f(z);
				}), w = new le(I, F), a(w);
				return;
			}
			if (Q === "deflate" || Q === "x-deflate") {
				const z = pipeline(g, new PassThrough(), (j) => {
					j && f(j);
				});
				z.once("data", (j) => {
					(j[0] & 15) === 8 ? I = pipeline(I, st.createInflate(), (U) => {
						U && f(U);
					}) : I = pipeline(I, st.createInflateRaw(), (U) => {
						U && f(U);
					}), w = new le(I, F), a(w);
				}), z.once("end", () => {
					w || (w = new le(I, F), a(w));
				});
				return;
			}
			if (Q === "br") {
				I = pipeline(I, st.createBrotliDecompress(), (z) => {
					z && f(z);
				}), w = new le(I, F), a(w);
				return;
			}
			w = new le(I, F), a(w);
		}), nl(b, l).catch(f);
	});
}
n$1(Ai, "fetch$1");
function Rl(i, o) {
	const a = Buffer$1.from(`0\r
\r
`);
	let f = false, l = false, p;
	i.on("response", (h) => {
		const { headers: S } = h;
		f = S["transfer-encoding"] === "chunked" && !S["content-length"];
	}), i.on("socket", (h) => {
		const S = n$1(() => {
			if (f && !l) {
				const w = /* @__PURE__ */ new Error("Premature close");
				w.code = "ERR_STREAM_PREMATURE_CLOSE", o(w);
			}
		}, "onSocketClose"), v = n$1((w) => {
			l = Buffer$1.compare(w.slice(-5), a) === 0, !l && p && (l = Buffer$1.compare(p.slice(-3), a.slice(0, 3)) === 0 && Buffer$1.compare(w.slice(-2), a.slice(3)) === 0), p = w;
		}, "onData");
		h.prependListener("close", S), h.on("data", v), i.on("close", () => {
			h.removeListener("close", S), h.removeListener("data", v);
		});
	});
}
n$1(Rl, "fixResponseChunkedTransferBadEnding");
var Bi = /* @__PURE__ */ new WeakMap();
var Dn = /* @__PURE__ */ new WeakMap();
function W$1(i) {
	const o = Bi.get(i);
	return console.assert(o != null, "'this' is expected an Event object, but got", i), o;
}
n$1(W$1, "pd");
function ki(i) {
	if (i.passiveListener != null) {
		typeof console < "u" && typeof console.error == "function" && console.error("Unable to preventDefault inside passive event listener invocation.", i.passiveListener);
		return;
	}
	i.event.cancelable && (i.canceled = true, typeof i.event.preventDefault == "function" && i.event.preventDefault());
}
n$1(ki, "setCancelFlag");
function ht(i, o) {
	Bi.set(this, {
		eventTarget: i,
		event: o,
		eventPhase: 2,
		currentTarget: i,
		canceled: false,
		stopped: false,
		immediateStopped: false,
		passiveListener: null,
		timeStamp: o.timeStamp || Date.now()
	}), Object.defineProperty(this, "isTrusted", {
		value: false,
		enumerable: true
	});
	const a = Object.keys(o);
	for (let f = 0; f < a.length; ++f) {
		const l = a[f];
		l in this || Object.defineProperty(this, l, Wi(l));
	}
}
n$1(ht, "Event"), ht.prototype = {
	get type() {
		return W$1(this).event.type;
	},
	get target() {
		return W$1(this).eventTarget;
	},
	get currentTarget() {
		return W$1(this).currentTarget;
	},
	composedPath() {
		const i = W$1(this).currentTarget;
		return i == null ? [] : [i];
	},
	get NONE() {
		return 0;
	},
	get CAPTURING_PHASE() {
		return 1;
	},
	get AT_TARGET() {
		return 2;
	},
	get BUBBLING_PHASE() {
		return 3;
	},
	get eventPhase() {
		return W$1(this).eventPhase;
	},
	stopPropagation() {
		const i = W$1(this);
		i.stopped = true, typeof i.event.stopPropagation == "function" && i.event.stopPropagation();
	},
	stopImmediatePropagation() {
		const i = W$1(this);
		i.stopped = true, i.immediateStopped = true, typeof i.event.stopImmediatePropagation == "function" && i.event.stopImmediatePropagation();
	},
	get bubbles() {
		return !!W$1(this).event.bubbles;
	},
	get cancelable() {
		return !!W$1(this).event.cancelable;
	},
	preventDefault() {
		ki(W$1(this));
	},
	get defaultPrevented() {
		return W$1(this).canceled;
	},
	get composed() {
		return !!W$1(this).event.composed;
	},
	get timeStamp() {
		return W$1(this).timeStamp;
	},
	get srcElement() {
		return W$1(this).eventTarget;
	},
	get cancelBubble() {
		return W$1(this).stopped;
	},
	set cancelBubble(i) {
		if (!i) return;
		const o = W$1(this);
		o.stopped = true, typeof o.event.cancelBubble == "boolean" && (o.event.cancelBubble = true);
	},
	get returnValue() {
		return !W$1(this).canceled;
	},
	set returnValue(i) {
		i || ki(W$1(this));
	},
	initEvent() {}
}, Object.defineProperty(ht.prototype, "constructor", {
	value: ht,
	configurable: true,
	writable: true
});
function Wi(i) {
	return {
		get() {
			return W$1(this).event[i];
		},
		set(o) {
			W$1(this).event[i] = o;
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Wi, "defineRedirectDescriptor");
function Tl(i) {
	return {
		value() {
			const o = W$1(this).event;
			return o[i].apply(o, arguments);
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Tl, "defineCallDescriptor");
function Cl(i, o) {
	const a = Object.keys(o);
	if (a.length === 0) return i;
	function f(l, p) {
		i.call(this, l, p);
	}
	n$1(f, "CustomEvent"), f.prototype = Object.create(i.prototype, { constructor: {
		value: f,
		configurable: true,
		writable: true
	} });
	for (let l = 0; l < a.length; ++l) {
		const p = a[l];
		if (!(p in i.prototype)) {
			const S = typeof Object.getOwnPropertyDescriptor(o, p).value == "function";
			Object.defineProperty(f.prototype, p, S ? Tl(p) : Wi(p));
		}
	}
	return f;
}
n$1(Cl, "defineWrapper");
function qi(i) {
	if (i == null || i === Object.prototype) return ht;
	let o = Dn.get(i);
	return o ?? (o = Cl(qi(Object.getPrototypeOf(i)), i), Dn.set(i, o)), o;
}
n$1(qi, "getWrapper");
function Pl(i, o) {
	return new (qi(Object.getPrototypeOf(o)))(i, o);
}
n$1(Pl, "wrapEvent");
function vl(i) {
	return W$1(i).immediateStopped;
}
n$1(vl, "isStopped");
function El(i, o) {
	W$1(i).eventPhase = o;
}
n$1(El, "setEventPhase");
function Al(i, o) {
	W$1(i).currentTarget = o;
}
n$1(Al, "setCurrentTarget");
function Oi(i, o) {
	W$1(i).passiveListener = o;
}
n$1(Oi, "setPassiveListener");
var zi = /* @__PURE__ */ new WeakMap();
var Ii = 1;
var Fi = 2;
var wr = 3;
function Rr(i) {
	return i !== null && typeof i == "object";
}
n$1(Rr, "isObject");
function Ot(i) {
	const o = zi.get(i);
	if (o == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
	return o;
}
n$1(Ot, "getListeners");
function Bl(i) {
	return {
		get() {
			let a = Ot(this).get(i);
			for (; a != null;) {
				if (a.listenerType === wr) return a.listener;
				a = a.next;
			}
			return null;
		},
		set(o) {
			typeof o != "function" && !Rr(o) && (o = null);
			const a = Ot(this);
			let f = null, l = a.get(i);
			for (; l != null;) l.listenerType === wr ? f !== null ? f.next = l.next : l.next !== null ? a.set(i, l.next) : a.delete(i) : f = l, l = l.next;
			if (o !== null) {
				const p = {
					listener: o,
					listenerType: wr,
					passive: false,
					once: false,
					next: null
				};
				f === null ? a.set(i, p) : f.next = p;
			}
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Bl, "defineEventAttributeDescriptor");
function ji(i, o) {
	Object.defineProperty(i, `on${o}`, Bl(o));
}
n$1(ji, "defineEventAttribute");
function Li(i) {
	function o() {
		Pe.call(this);
	}
	n$1(o, "CustomEventTarget"), o.prototype = Object.create(Pe.prototype, { constructor: {
		value: o,
		configurable: true,
		writable: true
	} });
	for (let a = 0; a < i.length; ++a) ji(o.prototype, i[a]);
	return o;
}
n$1(Li, "defineCustomEventTarget");
function Pe() {
	if (this instanceof Pe) {
		zi.set(this, /* @__PURE__ */ new Map());
		return;
	}
	if (arguments.length === 1 && Array.isArray(arguments[0])) return Li(arguments[0]);
	if (arguments.length > 0) {
		const i = new Array(arguments.length);
		for (let o = 0; o < arguments.length; ++o) i[o] = arguments[o];
		return Li(i);
	}
	throw new TypeError("Cannot call a class as a function");
}
n$1(Pe, "EventTarget"), Pe.prototype = {
	addEventListener(i, o, a) {
		if (o == null) return;
		if (typeof o != "function" && !Rr(o)) throw new TypeError("'listener' should be a function or an object.");
		const f = Ot(this), l = Rr(a), h = (l ? !!a.capture : !!a) ? Ii : Fi, S = {
			listener: o,
			listenerType: h,
			passive: l && !!a.passive,
			once: l && !!a.once,
			next: null
		};
		let v = f.get(i);
		if (v === void 0) {
			f.set(i, S);
			return;
		}
		let w = null;
		for (; v != null;) {
			if (v.listener === o && v.listenerType === h) return;
			w = v, v = v.next;
		}
		w.next = S;
	},
	removeEventListener(i, o, a) {
		if (o == null) return;
		const f = Ot(this), p = (Rr(a) ? !!a.capture : !!a) ? Ii : Fi;
		let h = null, S = f.get(i);
		for (; S != null;) {
			if (S.listener === o && S.listenerType === p) {
				h !== null ? h.next = S.next : S.next !== null ? f.set(i, S.next) : f.delete(i);
				return;
			}
			h = S, S = S.next;
		}
	},
	dispatchEvent(i) {
		if (i == null || typeof i.type != "string") throw new TypeError("\"event.type\" should be a string.");
		const o = Ot(this), a = i.type;
		let f = o.get(a);
		if (f == null) return true;
		const l = Pl(this, i);
		let p = null;
		for (; f != null;) {
			if (f.once ? p !== null ? p.next = f.next : f.next !== null ? o.set(a, f.next) : o.delete(a) : p = f, Oi(l, f.passive ? f.listener : null), typeof f.listener == "function") try {
				f.listener.call(this, l);
			} catch (h) {
				typeof console < "u" && typeof console.error == "function" && console.error(h);
			}
			else f.listenerType !== wr && typeof f.listener.handleEvent == "function" && f.listener.handleEvent(l);
			if (vl(l)) break;
			f = f.next;
		}
		return Oi(l, null), El(l, 0), Al(l, null), !l.defaultPrevented;
	}
}, Object.defineProperty(Pe.prototype, "constructor", {
	value: Pe,
	configurable: true,
	writable: true
});
var Vn = class Vn extends Pe {
	constructor() {
		throw super(), /* @__PURE__ */ new TypeError("AbortSignal cannot be constructed directly");
	}
	get aborted() {
		const o = Tr.get(this);
		if (typeof o != "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
		return o;
	}
};
n$1(Vn, "AbortSignal");
var pt = Vn;
ji(pt.prototype, "abort");
function kl() {
	const i = Object.create(pt.prototype);
	return Pe.call(i), Tr.set(i, false), i;
}
n$1(kl, "createAbortSignal");
function Wl(i) {
	Tr.get(i) === false && (Tr.set(i, true), i.dispatchEvent({ type: "abort" }));
}
n$1(Wl, "abortSignal");
var Tr = /* @__PURE__ */ new WeakMap();
Object.defineProperties(pt.prototype, { aborted: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pt.prototype, Symbol.toStringTag, {
	configurable: true,
	value: "AbortSignal"
});
var Mn = (gt = class {
	constructor() {
		$i.set(this, kl());
	}
	get signal() {
		return Di(this);
	}
	abort() {
		Wl(Di(this));
	}
}, n$1(gt, "AbortController"), gt);
var $i = /* @__PURE__ */ new WeakMap();
function Di(i) {
	const o = $i.get(i);
	if (o == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i === null ? "null" : typeof i}`);
	return o;
}
n$1(Di, "getSignal"), Object.defineProperties(Mn.prototype, {
	signal: { enumerable: true },
	abort: { enumerable: true }
}), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Mn.prototype, Symbol.toStringTag, {
	configurable: true,
	value: "AbortController"
});
var ql = Object.defineProperty;
var Ol = n$1((i, o) => ql(i, "name", {
	value: o,
	configurable: true
}), "e");
var Mi = Ai;
Ui();
function Ui() {
	!globalThis.process?.versions?.node && !globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN && console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");
}
n$1(Ui, "s"), Ol(Ui, "checkNodeEnvironment");
// node_modules/.bun/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/index.mjs
var o = !!globalThis.process?.env?.FORCE_NODE_FETCH;
var r = !o && globalThis.fetch || Mi;
var n = !o && globalThis.Headers || ye;
var T$1 = !o && globalThis.AbortController || Mn;
// node_modules/.bun/ofetch@1.5.1/node_modules/ofetch/dist/shared/ofetch.CWycOUEr.mjs
var FetchError = class extends Error {
	constructor(message, opts) {
		super(message, opts);
		this.name = "FetchError";
		if (opts?.cause && !this.cause) this.cause = opts.cause;
	}
};
function createFetchError(ctx) {
	const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
	const method = ctx.request?.method || ctx.options?.method || "GET";
	const url = ctx.request?.url || String(ctx.request) || "/";
	const fetchError = new FetchError(`${`[${method}] ${JSON.stringify(url)}`}: ${ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>"}${errorMessage ? ` ${errorMessage}` : ""}`, ctx.error ? { cause: ctx.error } : void 0);
	for (const key of [
		"request",
		"options",
		"response"
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx[key];
	} });
	for (const [key, refKey] of [
		["data", "_data"],
		["status", "status"],
		["statusCode", "status"],
		["statusText", "statusText"],
		["statusMessage", "statusText"]
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx.response && ctx.response[refKey];
	} });
	return fetchError;
}
var payloadMethods = new Set(Object.freeze([
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
]));
function isPayloadMethod(method = "GET") {
	return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	if (value instanceof FormData || value instanceof URLSearchParams) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
var textTypes = /* @__PURE__ */ new Set([
	"image/svg",
	"application/xml",
	"application/xhtml",
	"application/html"
]);
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
	if (!_contentType) return "json";
	const contentType = _contentType.split(";").shift() || "";
	if (JSON_RE.test(contentType)) return "json";
	if (contentType === "text/event-stream") return "stream";
	if (textTypes.has(contentType) || contentType.startsWith("text/")) return "text";
	return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
	const headers = mergeHeaders(input?.headers ?? request?.headers, defaults?.headers, Headers);
	let query;
	if (defaults?.query || defaults?.params || input?.params || input?.query) query = {
		...defaults?.params,
		...defaults?.query,
		...input?.params,
		...input?.query
	};
	return {
		...defaults,
		...input,
		query,
		params: query,
		headers
	};
}
function mergeHeaders(input, defaults, Headers) {
	if (!defaults) return new Headers(input);
	const headers = new Headers(defaults);
	if (input) for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) headers.set(key, value);
	return headers;
}
async function callHooks(context, hooks) {
	if (hooks) {
		if (Array.isArray(hooks)) for (const hook of hooks) await hook(context);
		else await hooks(context);
	}
}
var retryStatusCodes = /* @__PURE__ */ new Set([
	408,
	409,
	425,
	429,
	500,
	502,
	503,
	504
]);
var nullBodyResponses = /* @__PURE__ */ new Set([
	101,
	204,
	205,
	304
]);
function createFetch(globalOptions = {}) {
	const { fetch = globalThis.fetch, Headers = globalThis.Headers, AbortController = globalThis.AbortController } = globalOptions;
	async function onError(context) {
		const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
		if (context.options.retry !== false && !isAbort) {
			let retries;
			if (typeof context.options.retry === "number") retries = context.options.retry;
			else retries = isPayloadMethod(context.options.method) ? 0 : 1;
			const responseCode = context.response && context.response.status || 500;
			if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
				const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
				if (retryDelay > 0) await new Promise((resolve) => setTimeout(resolve, retryDelay));
				return $fetchRaw(context.request, {
					...context.options,
					retry: retries - 1
				});
			}
		}
		const error = createFetchError(context);
		if (Error.captureStackTrace) Error.captureStackTrace(error, $fetchRaw);
		throw error;
	}
	const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
		const context = {
			request: _request,
			options: resolveFetchOptions(_request, _options, globalOptions.defaults, Headers),
			response: void 0,
			error: void 0
		};
		if (context.options.method) context.options.method = context.options.method.toUpperCase();
		if (context.options.onRequest) {
			await callHooks(context, context.options.onRequest);
			if (!(context.options.headers instanceof Headers)) context.options.headers = new Headers(context.options.headers || {});
		}
		if (typeof context.request === "string") {
			if (context.options.baseURL) context.request = withBase(context.request, context.options.baseURL);
			if (context.options.query) {
				context.request = withQuery(context.request, context.options.query);
				delete context.options.query;
			}
			if ("query" in context.options) delete context.options.query;
			if ("params" in context.options) delete context.options.params;
		}
		if (context.options.body && isPayloadMethod(context.options.method)) {
			if (isJSONSerializable(context.options.body)) {
				const contentType = context.options.headers.get("content-type");
				if (typeof context.options.body !== "string") context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(context.options.body).toString() : JSON.stringify(context.options.body);
				if (!contentType) context.options.headers.set("content-type", "application/json");
				if (!context.options.headers.has("accept")) context.options.headers.set("accept", "application/json");
			} else if ("pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || typeof context.options.body.pipe === "function") {
				if (!("duplex" in context.options)) context.options.duplex = "half";
			}
		}
		let abortTimeout;
		if (!context.options.signal && context.options.timeout) {
			const controller = new AbortController();
			abortTimeout = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("[TimeoutError]: The operation was aborted due to timeout");
				error.name = "TimeoutError";
				error.code = 23;
				controller.abort(error);
			}, context.options.timeout);
			context.options.signal = controller.signal;
		}
		try {
			context.response = await fetch(context.request, context.options);
		} catch (error) {
			context.error = error;
			if (context.options.onRequestError) await callHooks(context, context.options.onRequestError);
			return await onError(context);
		} finally {
			if (abortTimeout) clearTimeout(abortTimeout);
		}
		if ((context.response.body || context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD") {
			const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
			switch (responseType) {
				case "json": {
					const data = await context.response.text();
					const parseFunction = context.options.parseResponse || destr;
					context.response._data = parseFunction(data);
					break;
				}
				case "stream":
					context.response._data = context.response.body || context.response._bodyInit;
					break;
				default: context.response._data = await context.response[responseType]();
			}
		}
		if (context.options.onResponse) await callHooks(context, context.options.onResponse);
		if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
			if (context.options.onResponseError) await callHooks(context, context.options.onResponseError);
			return await onError(context);
		}
		return context.response;
	};
	const $fetch = async function $fetch2(request, options) {
		return (await $fetchRaw(request, options))._data;
	};
	$fetch.raw = $fetchRaw;
	$fetch.native = (...args) => fetch(...args);
	$fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
		...globalOptions,
		...customGlobalOptions,
		defaults: {
			...globalOptions.defaults,
			...customGlobalOptions.defaults,
			...defaultOptions
		}
	});
	return $fetch;
}
// node_modules/.bun/ofetch@1.5.1/node_modules/ofetch/dist/node.mjs
function createNodeFetch() {
	if (!JSON.parse(process.env.FETCH_KEEP_ALIVE || "false")) return r;
	const agentOptions = { keepAlive: true };
	const httpAgent = new Bt.Agent(agentOptions);
	const httpsAgent = new zs.Agent(agentOptions);
	const nodeFetchOptions = { agent(parsedURL) {
		return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
	} };
	return function nodeFetchWithKeepAlive(input, init) {
		return r(input, {
			...nodeFetchOptions,
			...init
		});
	};
}
var $fetch$1 = createFetch({
	fetch: globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch(),
	Headers: globalThis.Headers || n,
	AbortController: globalThis.AbortController || T$1
});
// virtual:nuxt:.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch$1.create({ baseURL: baseURL() });
// virtual:nuxt:.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey$1 = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
// virtual:nuxt:.nuxt%2Froute-rules.mjs
var virtual_nuxt__nuxt_2Froute_rules_default = () => ({});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/utils.js
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION) return false;
	if (generateRouteKey(to) !== generateRouteKey(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(hash) {
	const elem = (void 0).getElementById(hash.slice(1));
	if (!elem) return 0;
	return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt__nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	sensitive: false,
	...router_options_default
};
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/pages/runtime/validate.js
var middleware$1 = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/composables/manifest.js
function routeRulesMatcher(path) {
	return virtual_nuxt__nuxt_2Froute_rules_default();
}
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
// virtual:nuxt:.nuxt%2Fmiddleware.mjs
var globalMiddleware = [middleware$1, /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
	if (!useNuxtApp().ssrContext?.islandContext) return;
	const rules = getRouteRules({ path: to.path });
	if (rules.redirect) {
		const path = rules.redirect.includes("#") ? rules.redirect : rules.redirect + to.hash;
		return navigateTo(path, { external: isAbsoluteHref(path) });
	}
})];
var namedMiddleware = {};
// package/i18n/dist/esm/internal/locale.js
function e(t) {
	return t.trim().replace(/_/g, "-").toLowerCase();
}
var a$1 = [
	"ar",
	"arc",
	"ckb",
	"dv",
	"fa",
	"he",
	"ku",
	"ps",
	"sd",
	"ug",
	"ur",
	"yi"
];
function s$2(t) {
	const n = e(t).split("-")[0];
	if (a$1.includes(n)) return true;
	try {
		return new Intl.Locale(t).textInfo?.direction === "rtl";
	} catch {
		return false;
	}
}
function f$4(t) {
	return s$2(t) ? "rtl" : "ltr";
}
function g$3(t, n) {
	return (r) => {
		if (r == null) return n;
		const i = e(r), c = t.find((o) => e(o) === i);
		if (c !== void 0) return c;
		const u = i.split("-")[0];
		return t.find((o) => e(o).split("-")[0] === u) ?? n;
	};
}
// package/i18n/dist/esm/internal/plural.js
var a = /* @__PURE__ */ new Map();
var f$3 = /* @__PURE__ */ new Map();
function c(n, s = false) {
	const r = s ? f$3 : a, t = n;
	let e = r.get(t);
	return e === void 0 && (e = new Intl.PluralRules(n, s ? { type: "ordinal" } : void 0), r.set(t, e)), e;
}
var u = 200;
var i$1 = /* @__PURE__ */ new Map();
var d = /* @__PURE__ */ new Map();
function p$4(n, s, r = false) {
	const t = r ? d : i$1;
	let e = t.get(n);
	e === void 0 && (e = /* @__PURE__ */ new Map(), t.set(n, e));
	let o = e.get(s);
	return o === void 0 && (o = c(n, r).select(s), e.size >= u && e.clear(), e.set(s, o)), o;
}
var w$3 = /^(zero|one|two|few|many|other):(.*)$/;
var l$1 = /* @__PURE__ */ new Map();
function g$2(n) {
	let s = l$1.get(n);
	if (s !== void 0) return s;
	let r = null;
	for (const t of n.split("|")) {
		const e = w$3.exec(t);
		e !== null && (r ??= {}, r[e[1]] = e[2]);
	}
	return l$1.set(n, r), r;
}
function M$3(n, s, r) {
	const t = g$2(n);
	if (t === null) return n;
	return t[p$4(r, s)] ?? t.other ?? t[Object.keys(t)[0]] ?? n;
}
// package/i18n/dist/esm/internal/message.js
var S$2 = /\{\s*([A-Za-z0-9_.-]+)\s*(?:,\s*([A-Za-z]+)\s*)?(?:,\s*)?/;
var m$3 = "\0";
function F(n, e) {
	const t = n[e + 1];
	return t === "{" || t === "}" || t === "#";
}
function M$2(n) {
	const e = [];
	let t = "";
	for (let r = 0; r < n.length; r++) {
		const s = n[r];
		if (s !== "'") {
			t += s;
			continue;
		}
		if (n[r + 1] === "'") {
			t += "'", r++;
			continue;
		}
		if (F(n, r)) {
			const c = n.indexOf("'", r + 1);
			if (c !== -1) {
				e.push(n.slice(r + 1, c).replace(/''/g, "'")), t += `${m$3}${e.length - 1}${m$3}`, r = c;
				continue;
			}
		}
		t += s;
	}
	return {
		text: t,
		literals: e
	};
}
var D$1 = new RegExp(`${m$3}(\\d+)${m$3}`, "g");
function L$1(n, e) {
	return e.length === 0 ? n : n.replace(D$1, (t, r) => e[Number(r)] ?? "");
}
function w$2(n, e) {
	let t = 0;
	for (let r = e; r < n.length; r++) {
		const s = n[r];
		if (s === "{") t++;
		else if (s === "}" && (t--, t === 0)) return r;
	}
	return -1;
}
function x$3(n) {
	const e = [];
	let t = 0;
	for (; t < n.length;) {
		for (; t < n.length && /\s/.test(n[t]);) t++;
		if (t >= n.length) break;
		const r = /^([A-Za-z0-9_*=]+)\s*/.exec(n.slice(t));
		if (r === null || (t += r[0].length, n[t] !== "{")) return null;
		const s = w$2(n, t);
		if (s === -1) return null;
		e.push({
			name: r[1],
			text: n.slice(t + 1, s)
		}), t = s + 1;
	}
	return e.length > 0 ? e : null;
}
function T(n, e) {
	if (e === void 0) return n;
	const t = n.indexOf("#");
	if (t === -1) return n;
	const r = String(e);
	let s = n.slice(0, t) + r, c = t + 1;
	for (let i = n.indexOf("#", c); i !== -1; i = n.indexOf("#", c)) s += n.slice(c, i) + r, c = i + 1;
	return s + n.slice(c);
}
function _$1(n) {
	if (n === "integer") return { maximumFractionDigits: 0 };
	if (n === "percent") return { style: "percent" };
	const e = /(?:^|::)currency\/([A-Za-z]{3})\b/.exec(n)?.[1];
	return n === "currency" || e !== void 0 ? {
		style: "currency",
		currency: (e ?? "USD").toUpperCase()
	} : n.includes("compact") ? {
		notation: "compact",
		compactDisplay: n.includes("long") ? "long" : "short"
	} : {};
}
var y$3 = /* @__PURE__ */ new Map();
var $$2 = /* @__PURE__ */ new Map();
function I$2(n, e) {
	const t = `${n}|${e}`;
	let r = y$3.get(t);
	return r === void 0 && (r = new Intl.NumberFormat(n, _$1(e)), y$3.set(t, r)), r;
}
function z$1(n, e, t, r) {
	const s = `${n}|${e}|${t}|${r ?? ""}`;
	let c = $$2.get(s);
	return c === void 0 && (c = new Intl.DateTimeFormat(n, R$1(e, t, r)), $$2.set(s, c)), c;
}
var P$1 = /* @__PURE__ */ new Set([
	"short",
	"medium",
	"long",
	"full"
]);
function R$1(n, e, t) {
	const r = P$1.has(e) ? e : "medium";
	return n === "date" ? {
		dateStyle: r,
		...t === void 0 ? {} : { timeZone: t }
	} : {
		timeStyle: r,
		...t === void 0 ? {} : { timeZone: t }
	};
}
function g$1(n) {
	const e = [];
	let t = 0;
	for (; t < n.length;) {
		const r = n.indexOf("{", t);
		if (r === -1) {
			e.push({
				kind: "text",
				value: n.slice(t)
			});
			break;
		}
		r > t && e.push({
			kind: "text",
			value: n.slice(t, r)
		});
		const s = S$2.exec(n.slice(r)), c = w$2(n, r);
		if (s === null || c === -1) {
			e.push({
				kind: "raw",
				value: n.slice(r)
			});
			break;
		}
		const [, i, o] = s, u = n.slice(r, c + 1), f = n.slice(r + s[0].length, c);
		if (o === void 0) {
			e.push({
				kind: "arg",
				name: i,
				raw: u
			}), t = c + 1;
			continue;
		}
		const a = o.toLowerCase();
		if (a === "plural" || a === "selectordinal") {
			const l = B(f);
			if (l === null) e.push({
				kind: "raw",
				value: u
			});
			else {
				const h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
				let k;
				for (const d of l.branches) d.name.startsWith("=") ? p.set(d.name, d) : h.set(d.name, d), d.name === "other" && (k = d);
				e.push({
					kind: "plural",
					name: i,
					ordinal: a === "selectordinal",
					offset: l.offset,
					byCategory: h,
					exact: p,
					other: k,
					hasExact: p.size > 0
				});
			}
			t = c + 1;
			continue;
		}
		if (a === "select") {
			const l = x$3(f);
			e.push(l === null ? {
				kind: "raw",
				value: u
			} : {
				kind: "select",
				name: i,
				raw: u,
				branches: l.map((h) => ({
					name: h.name,
					nodes: g$1(h.text)
				}))
			}), t = c + 1;
			continue;
		}
		if (a === "number" || a === "date" || a === "time") {
			e.push({
				kind: "format",
				name: i,
				type: a,
				style: f.trim(),
				raw: u
			}), t = c + 1;
			continue;
		}
		e.push({
			kind: "raw",
			value: u
		}), t = c + 1;
	}
	return e;
}
function B(n) {
	const e = /^\s*offset:\s*(\d+)\s*/.exec(n), r = x$3(e === null ? n : n.slice(e[0].length));
	return r === null ? null : {
		offset: e === null ? 0 : Number(e[1]),
		branches: r.map((s) => ({
			name: s.name,
			nodes: g$1(s.text)
		}))
	};
}
function b$2(n, e, t, r, s) {
	let c = "";
	for (const i of n) switch (i.kind) {
		case "text":
			c += T(i.value, r);
			break;
		case "raw":
			c += i.value;
			break;
		case "arg": {
			const o = e(i.name);
			c += o === void 0 ? i.raw : String(o);
			break;
		}
		case "format": {
			const o = e(i.name);
			if (o === void 0) c += i.raw;
			else if (i.type === "number") c += I$2(t, i.style).format(Number(o));
			else {
				const u = o instanceof Date ? o : new Date(o);
				c += z$1(t, i.type, i.style, s).format(u);
			}
			break;
		}
		case "plural": {
			const o = Number(e(i.name) ?? 0);
			let u = i.hasExact ? i.exact.get(`=${o}`) : void 0, f = o;
			if (u === void 0) {
				const a = p$4(t, o - i.offset, i.ordinal);
				u = i.byCategory.get(a) ?? i.other, f = o - i.offset;
			}
			u !== void 0 && (c += b$2(u.nodes, e, t, f, s));
			break;
		}
		case "select": {
			const o = String(e(i.name) ?? ""), u = i.branches.find((f) => f.name === o) ?? i.branches.find((f) => f.name === "other");
			c += u === void 0 ? i.raw : b$2(u.nodes, e, t, r, s);
			break;
		}
	}
	return c;
}
var A = /* @__PURE__ */ new Map();
function E(n) {
	let e = A.get(n);
	if (e === void 0) {
		const { text: t, literals: r } = M$2(n);
		e = {
			text: t,
			literals: r,
			nodes: g$1(t)
		}, A.set(n, e);
	}
	return e;
}
function W(n) {
	return E(n).text;
}
function Q(n, e, t, r) {
	const s = E(n);
	return L$1(b$2(s.nodes, e, t, r?.pound, r?.timeZone), s.literals);
}
var U = /\{[A-Za-z0-9_.-]+\s*,\s*(plural|select|selectordinal|number|date|time)\s*[,}]/i;
var N$2 = /* @__PURE__ */ new Map();
function Z(n) {
	let e = N$2.get(n);
	return e === void 0 && (e = U.test(n), N$2.set(n, e)), e;
}
function H(n) {
	if (n === void 0 || n instanceof Date) return;
	const e = typeof n == "number" ? n : Number(n);
	return Number.isFinite(e) ? e : void 0;
}
function Y$1(n, e, t, r) {
	if (e?.count === void 0 && t?.count === void 0 && n.indexOf("{") === -1 && n.indexOf("'") === -1) return n;
	const s = t?.count, c = s === void 0 ? (u) => e !== void 0 && u in e ? e[u] : void 0 : (u) => e !== void 0 && u in e ? e[u] : u === "count" ? s : void 0, i = s ?? H(e?.count);
	return Q(i === void 0 || Z(n) ? n : M$3(n, i, r), c, t?.locale ?? r, t?.timeZone === void 0 ? void 0 : { timeZone: t.timeZone });
}
// package/i18n/dist/esm/internal/dictionary.js
var l = (t, o) => Object.prototype.hasOwnProperty.call(t, o);
var m$2 = (t) => typeof t == "string" ? t.split(".") : t;
function x$2(t, o) {
	let e = t;
	for (const n of m$2(o)) {
		if (typeof e != "object" || !l(e, n)) return;
		e = e[n];
	}
	return e;
}
function k$1(t, o) {
	return x$2(t, o);
}
function M$1(t, o) {
	const e = x$2(t, o);
	return typeof e == "string" ? e : void 0;
}
function w$1(t, o) {
	return o ? t.replace(/\{(\w+)\}/g, (e, n) => l(o, n) ? String(o[n]) : e) : t;
}
function O(t, o) {
	const e = [], n = (c, r, u) => {
		for (const s of Object.keys(c)) {
			const p = u ? `${u}.${s}` : s;
			if (!l(r, s)) {
				e.push(p);
				continue;
			}
			const i = c[s], f = r[s];
			typeof i == "object" && typeof f == "object" ? n(i, f, p) : typeof i != typeof f && e.push(p);
		}
	};
	return n(t, o, ""), e;
}
function b$1(t) {
	const o = /* @__PURE__ */ new Set();
	for (const e of W(t).matchAll(/\{\s*([A-Za-z0-9_][\w.-]*)\s*(?=[,}])/g)) o.add(e[1]);
	return [...o];
}
function I$1(t, o) {
	const e = [], n = (c, r, u) => {
		for (const s of Object.keys(c)) {
			const p = u ? `${u}.${s}` : s;
			if (!l(r, s)) continue;
			const i = c[s], f = r[s];
			if (typeof i == "object" && typeof f == "object") {
				n(i, f, p);
				continue;
			}
			if (typeof i != "string" || typeof f != "string") continue;
			const a = b$1(i), d = b$1(f), g = a.filter((y) => !d.includes(y)), h = d.filter((y) => !a.includes(y));
			(g.length > 0 || h.length > 0) && e.push({
				key: p,
				missing: g,
				surplus: h
			});
		}
	};
	return n(t, o, ""), e;
}
// package/i18n/dist/esm/internal/translator.js
function v$1(o, n, d, g) {
	const i = n === void 0 ? o : k$1(o, n);
	if (n !== void 0 && (i === void 0 || typeof i == "string")) throw new Error(`[i18n] namespace "${n}" is not an object in this dictionary.`);
	const r = n === void 0 ? d : d && k$1(d, n), p = g ?? "en", u = d === o || r === void 0 || typeof r == "string" ? void 0 : r, f = /* @__PURE__ */ new Map();
	return (e, c, w) => {
		let t = f.get(e);
		return t === void 0 && (t = (i === void 0 ? void 0 : M$1(i, e)) ?? (u === void 0 ? void 0 : M$1(u, e)) ?? null, f.set(e, t)), t === null ? e : Y$1(t, c, w, p);
	};
}
// package/i18n/dist/esm/internal/createI18n.js
function D(n) {
	const { locales: o, defaultLocale: t, messages: c } = n;
	if (!o.includes(t)) throw new Error(`[i18n] defaultLocale "${t}" is not listed in locales.`);
	for (const e of o) if (c[e] === void 0) throw new Error(`[i18n] no messages provided for locale "${e}".`);
	for (const e of o) M(c[e]);
	Object.freeze(c);
	const a = c[t], l = g$3(o, t), b = (e) => o.includes(e), g = (e) => c[l(e)], p = (e) => g(e), L = (e, s) => M$1(g(l(e)), s) !== void 0, m = (e) => O(a, p(e)), h = (e) => O(p(e), a), $ = (e) => ({
		missing: m(e),
		surplus: h(e)
	}), y = (e) => I$1(a, p(e));
	function k() {}
	const K = (e) => {
		const s = l(e);
		return n.displayNames?.[s] ?? {
			native: s,
			english: s
		};
	}, N = (e) => {
		const s = l(e);
		return n.displayNames?.[s]?.english ?? s;
	}, j = /* @__PURE__ */ new Map();
	function O$2(e, s) {
		const f = s ?? "";
		let r = j.get(e);
		r === void 0 && (r = /* @__PURE__ */ new Map(), j.set(e, r));
		let i = r.get(f);
		if (i === void 0) {
			const d = g(e);
			i = v$1(d, s, d === a ? void 0 : a, l(e)), r.set(f, i);
		}
		return i;
	}
	return {
		locales: o,
		defaultLocale: t,
		defaultMessages: a,
		messages: c,
		hasLocale: b,
		resolveLocale: l,
		getMessages: p,
		hasKey: L,
		missingKeys: m,
		surplusKeys: h,
		messageReport: $,
		placeholderReport: y,
		checkMessages: k,
		getLocaleLabel: K,
		getLocaleName: N,
		createTranslator: O$2
	};
}
function M(n) {
	if (n === null || typeof n != "object" || Object.isFrozen(n)) return n;
	Object.freeze(n);
	for (const o of Object.keys(n)) M(n[o]);
	return n;
}
var i18n = D({
	locales: [
		"en",
		"zh",
		"ja"
	],
	defaultLocale: "en",
	messages: {
		en: {
			site: {
				"title": {
					"home": "Home",
					"dashboard": "Dashboard"
				},
				"description": {
					"home": "Welcome to my personal homepage",
					"dashboard": "Welcome to my dashboard"
				},
				"notFound": {
					"title": "This page could not be found",
					"description": "The link may be broken or the page may have been moved.",
					"back": "Go to dashboard"
				}
			},
			home: {
				"greeting": "Hello, {name}!",
				"intro": "Welcome to my website"
			},
			dashboard: {
				"greeting": "Dashboard",
				"intro": "Welcome to my dashboard"
			}
		},
		zh: {
			site: {
				"title": {
					"home": "首页",
					"dashboard": "仪表板"
				},
				"description": {
					"home": "欢迎来到我的个人主页",
					"dashboard": "欢迎来到我的仪表板"
				},
				"notFound": {
					"title": "页面未找到",
					"description": "链接可能已失效，或页面已被移动。",
					"back": "返回仪表盘"
				}
			},
			home: {
				"greeting": "你好，{name}！",
				"intro": "欢迎来到我的网站"
			},
			dashboard: {
				"greeting": "仪表板",
				"intro": "欢迎来到我的仪表板"
			}
		},
		ja: {
			site: {
				"title": {
					"home": "Home",
					"dashboard": "Dashboard"
				},
				"description": {
					"home": "Welcome to my personal homepage",
					"dashboard": "Welcome to my dashboard"
				},
				"notFound": {
					"title": "ページが見つかりません",
					"description": "リンクが切れているか、ページが移動した可能性があります。",
					"back": "ダッシュボードへ"
				}
			},
			home: {
				"greeting": "Hello, {name}!",
				"intro": "Welcome to my website"
			},
			dashboard: {
				"greeting": "Dashboard",
				"intro": "Welcome to my dashboard"
			}
		}
	},
	displayNames: {
		en: {
			native: "English",
			english: "English"
		},
		zh: {
			native: "中文",
			english: "Chinese"
		},
		ja: {
			native: "日本語",
			english: "Japanese"
		}
	}
});
/** Every page lives under a sub-path, so the locale root redirects here. */
var landingPath = "/dashboard";
/** Open Graph wants `en_US`; keep the mapping next to the locales. */
var ogLocaleMap = {
	en: "en_US",
	zh: "zh_CN",
	ja: "ja_JP"
};
var siteName = "Bun-Nuxt";
/**
* A configured value as an origin: adds `https://` to a bare domain (the form
* the Next template's `NEXT_PUBLIC_SITE_DOMAIN` takes) and drops the trailing
* slash, so `example.com` and `https://example.com/` both become
* `https://example.com`.
*/
function siteOrigin(value) {
	if (!value) return "";
	const trimmed = value.trim().replace(/\/+$/, "");
	if (trimmed === "") return "";
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
/**
* The site origin for canonical / hreflang / OG / sitemap.
*
* Next reads `process.env.NEXT_PUBLIC_SITE_DOMAIN` in app source because it
* inlines those references at build. Nuxt has no such inlining: `process.env`
* is not available in the browser, so the same value arrives through
* `runtimeConfig.public.siteUrl`, which Nuxt fills from `NUXT_PUBLIC_SITE_URL`.
* Calling it at render time keeps one source for both the server (runtime env)
* and a static export (build-time env).
*/
function useBaseUrl() {
	return siteOrigin((/* @__PURE__ */ useRuntimeConfig()).public.siteUrl);
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
// node_modules/.bun/unhead@3.4.3+09464f4138940899/node_modules/unhead/dist/shared/unhead.CGPOfp5O.mjs
// @__NO_SIDE_EFFECTS__
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
// node_modules/.bun/unhead@3.4.3+09464f4138940899/node_modules/unhead/dist/shared/unhead.DJuZwX9c.mjs
function walkResolver(val, resolve, key) {
	if (key === "_resolver") return val;
	if (typeof val === "function" && (!key || key !== "titleTemplate" && !key.startsWith("on"))) val = val();
	const v = resolve ? resolve(key, val) : val;
	if (Array.isArray(v)) {
		let out;
		for (let i = 0; i < v.length; i++) {
			const r = walkResolver(v[i], resolve);
			if (out) out[i] = r;
			else if (r !== v[i]) {
				out = v.slice(0, i);
				out[i] = r;
			}
		}
		return out || v;
	}
	if (v?.constructor === Object) {
		let next;
		for (const k in v) {
			const unsafe = /* @__PURE__ */ isUnsafeKey(k);
			const r = unsafe ? void 0 : walkResolver(v[k], resolve, k);
			if (!next && (unsafe || r !== v[k])) {
				next = {};
				for (const pk in v) {
					if (pk === k) break;
					next[pk] = v[pk];
				}
			}
			if (next && !unsafe) next[k] = r;
		}
		return next || v;
	}
	return v;
}
// node_modules/.bun/@unhead+vue@3.4.3+4e2e7e9c4f9c33b5/node_modules/@unhead/vue/dist/shared/vue.DKb5ZKVl.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead$1() {
	if (hasInjectionContext()) {
		const instance = inject(headSymbol);
		if (instance) return instance;
	}
	throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
// node_modules/.bun/@unhead+vue@3.4.3+4e2e7e9c4f9c33b5/node_modules/@unhead/vue/dist/shared/vue.D2XR8FqS.mjs
var VueResolver = /* @__PURE__ */ Object.assign((_, value) => isRef(value) ? toValue(value) : value, { _static: true });
// node_modules/.bun/@unhead+vue@3.4.3+4e2e7e9c4f9c33b5/node_modules/@unhead/vue/dist/shared/vue.CXwiCT15.mjs
function useHead$1(input, options = {}) {
	const head = options.head || /* @__PURE__ */ injectHead$1();
	return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
	const scope = getCurrentScope();
	if (scope && !scope.active) return {
		patch() {},
		dispose() {},
		_i: -1
	};
	const deactivated = ref(false);
	if (options.onRendered && scope) {
		const _onRendered = options.onRendered;
		options = {
			...options,
			onRendered: (ctx) => scope.run(() => _onRendered(ctx))
		};
	}
	let entry;
	watchEffect(() => {
		const i = deactivated.value ? {} : walkResolver(input, VueResolver);
		if (entry) entry.patch(i);
		else entry = head.push(i, options);
	});
	if (getCurrentInstance()) ; else if (scope) onScopeDispose(() => entry.dispose());
	return entry;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject("usehead");
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead(input, options = {}) {
	return useHead$1(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}
// package/i18n/dist/esm/seo.js
function p$3(a, e = "never") {
	const r = a.startsWith("/") ? a : `/${a}`;
	return r === "/" ? r : e === "always" ? r.endsWith("/") ? r : `${r}/` : r.replace(/\/+$/, "") || "/";
}
function g(a, e, r, t) {
	const n = p$3(r, t);
	return n === "/" ? t === "always" ? `${a}/${e}/` : `${a}/${e}` : `${a}/${e}${n}`;
}
function m$1(a, e, r = {}) {
	const t = (r.baseUrl ?? "").replace(/\/$/, ""), n = {};
	for (const o of a.locales) n[r.hreflangMap?.[o] ?? o] = g(t, o, e, r.trailingSlash);
	const s = g(t, r.locale === void 0 ? a.defaultLocale : a.resolveLocale(r.locale), e, r.trailingSlash), l = g(t, a.defaultLocale, e, r.trailingSlash);
	return {
		canonical: s,
		languages: {
			...n,
			"x-default": l
		}
	};
}
var x$1 = (a) => {
	const [e, r] = a.split("-");
	return r ? `${e}_${r.toUpperCase()}` : e;
};
function i(a, e, r) {
	const t = a.resolveLocale(e);
	return r?.[t] ?? x$1(t);
}
function h$4(a, e, r) {
	return a.locales.filter((t) => t !== a.resolveLocale(e)).map((t) => i(a, t, r));
}
function S$1(a, e) {
	const r = (e.baseUrl ?? "").replace(/\/$/, ""), t = a.resolveLocale(e.locale), n = m$1(a, e.path, {
		baseUrl: e.baseUrl,
		locale: t,
		trailingSlash: e.trailingSlash,
		hreflangMap: e.hreflangMap
	}), c = g(r, t, e.path, e.trailingSlash), s = e.image === void 0 ? void 0 : e.image.url.startsWith("http") ? e.image.url : `${r}${e.image.url}`, l = {
		...e.title === void 0 ? {} : { title: e.title },
		...e.description === void 0 ? {} : { description: e.description }
	};
	return {
		...l,
		alternates: n,
		openGraph: {
			...l,
			url: c,
			type: e.type ?? "website",
			...e.siteName === void 0 ? {} : { siteName: e.siteName },
			locale: i(a, t, e.ogLocaleMap),
			alternateLocale: h$4(a, t, e.ogLocaleMap),
			...s === void 0 ? {} : { images: [{
				...e.image,
				url: s
			}] }
		},
		twitter: {
			card: "summary_large_image",
			...l,
			...s === void 0 ? {} : { images: [s] }
		}
	};
}
function v(a, e) {
	const r = (e.baseUrl ?? "").replace(/\/$/, "");
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: e.name,
		...r ? { url: `${r}/` } : {},
		inLanguage: [...a.locales],
		...e.alternateName === void 0 ? {} : { alternateName: e.alternateName }
	};
}
var f$2 = "\\";
function N$1(a) {
	return JSON.stringify(a).replace(/</g, `${f$2}u003c`).replace(/>/g, `${f$2}u003e`).replace(/&/g, `${f$2}u0026`);
}
// package/i18n/dist/esm/head.js
function y$2(n, e) {
	const a = S$1(n, {
		locale: e.locale,
		path: e.path,
		baseUrl: e.baseUrl,
		siteName: e.siteName,
		title: e.title,
		description: e.description,
		image: e.image,
		type: e.type,
		ogLocaleMap: e.ogLocaleMap,
		hreflangMap: e.hreflangMap,
		trailingSlash: e.trailingSlash
	}), o = a.openGraph, l = o.images ?? [], i = n.resolveLocale(e.locale), s = [
		...e.description === void 0 ? [] : [{
			name: "description",
			content: e.description
		}],
		...e.noIndex ? [{
			name: "robots",
			content: "noindex, nofollow"
		}] : [],
		...e.title === void 0 ? [] : [{
			property: "og:title",
			content: e.title
		}],
		...e.description === void 0 ? [] : [{
			property: "og:description",
			content: e.description
		}],
		{
			property: "og:url",
			content: o.url
		},
		{
			property: "og:type",
			content: o.type
		},
		...o.siteName === void 0 ? [] : [{
			property: "og:site_name",
			content: o.siteName
		}],
		{
			property: "og:locale",
			content: o.locale
		},
		...o.alternateLocale.map((t) => ({
			property: "og:locale:alternate",
			content: t
		})),
		...l.flatMap((t) => [
			{
				property: "og:image",
				content: t.url
			},
			...t.width === void 0 ? [] : [{
				property: "og:image:width",
				content: String(t.width)
			}],
			...t.height === void 0 ? [] : [{
				property: "og:image:height",
				content: String(t.height)
			}],
			...t.alt === void 0 ? [] : [{
				property: "og:image:alt",
				content: t.alt
			}]
		]),
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		...e.title === void 0 ? [] : [{
			name: "twitter:title",
			content: e.title
		}],
		...e.description === void 0 ? [] : [{
			name: "twitter:description",
			content: e.description
		}],
		...l.map((t) => ({
			name: "twitter:image",
			content: t.url
		}))
	], r = [];
	e.website !== void 0 && r.push({
		type: "application/ld+json",
		innerHTML: N$1(v(n, {
			name: e.siteName ?? "",
			baseUrl: e.baseUrl,
			alternateName: e.website.alternateName
		}))
	});
	for (const t of e.jsonLd ?? []) r.push({
		type: "application/ld+json",
		innerHTML: N$1(t)
	});
	return {
		htmlAttrs: {
			lang: i,
			dir: f$4(i)
		},
		...a.title === void 0 ? {} : { title: a.title },
		meta: s,
		link: [{
			rel: "canonical",
			href: a.alternates.canonical
		}, ...Object.entries(a.alternates.languages).map(([t, d]) => ({
			rel: "alternate",
			hreflang: t,
			href: d
		}))],
		script: r
	};
}
// package/i18n/dist/esm/routing.js
function p$2(e$1) {
	if (!e$1) return [];
	const t = [];
	for (const r of e$1.split(",")) {
		const [n, ...l] = r.split(";"), c = e(n);
		if (c.length === 0) continue;
		let i = 1;
		for (const a of l) {
			const [u, d] = a.split("=");
			if (u.trim().toLowerCase() === "q") {
				const s = Number.parseFloat(d);
				Number.isFinite(s) && (i = s);
			}
		}
		i > 0 && t.push({
			tag: c,
			quality: i
		});
	}
	return t.sort((r, n) => n.quality - r.quality);
}
function x(e$2, t) {
	let r = e$2;
	for (;;) {
		const n = t.find((c) => e(c) === r);
		if (n !== void 0) return n;
		const l = r.lastIndexOf("-");
		if (l === -1) return;
		r = r.slice(0, l);
	}
}
function y$1(e$3, t) {
	return t.find((r) => e(r).startsWith(`${e$3}-`));
}
function w(e$4, t) {
	const [r, ...n] = e$4.split("-"), l = t.filter((c) => e(c).split("-")[0] === r);
	if (l.length !== 0) return l.find((c) => e(c).split("-").slice(1).some((i) => n.includes(i))) ?? l[0];
}
function h$3(e, t) {
	return x(e, t) ?? y$1(e, t) ?? w(e, t);
}
function S(e$5, t, r = {}) {
	const n = r.preference;
	if (n != null && n !== "") {
		const i = h$3(e(n), e$5.locales);
		if (i !== void 0) return i;
	}
	const c = p$2(t).map((i) => i.tag);
	if (r.match !== void 0) {
		if (c.length === 0 || c.includes("*")) return e$5.defaultLocale;
		try {
			return e$5.resolveLocale(r.match(c, e$5.locales, e$5.defaultLocale));
		} catch {
			return e$5.defaultLocale;
		}
	}
	for (const i of c) {
		if (i === "*") return e$5.defaultLocale;
		const a = h$3(i, e$5.locales);
		if (a !== void 0) return a;
	}
	return e$5.defaultLocale;
}
function f$1(e, t = "never") {
	return t !== "always" || e.endsWith("/") ? e : `${e}/`;
}
function m(e$6, t) {
	const r = t.split("/").filter((i) => i !== "");
	if (r.length < 2) return null;
	const n = (i) => e$6.locales.find((a) => e(a) === e(i));
	let l = 0, c;
	for (; l < r.length;) {
		const i = n(r[l]);
		if (i === void 0) break;
		c = i, l++;
	}
	return l < 2 || c === void 0 ? null : `/${[c, ...r.slice(l)].join("/")}`;
}
function P(e, t, r, n = {}) {
	const l = n.trailingSlash === "always" ? t : t.replace(/[/]+$/, "") || "/", c = C(e, l, r, n);
	return c !== null ? c : l === t ? null : f$1(l, n.trailingSlash);
}
function C(e$7, t, r, n) {
	const l = n.landingPath === void 0 ? "" : $$1(n.landingPath), c = m(e$7, t);
	if (c !== null) return f$1(z(e$7, c, l), n.trailingSlash);
	const i = t.split("/")[1] ?? "", a = e$7.locales.find((s) => e(s) === e(i));
	if (a !== void 0) {
		const s = t.slice(i.length + 1), g = `/${a}${s}`;
		return s === "" && l !== "" ? f$1(`${g}${l}`, n.trailingSlash) : g === t ? null : f$1(g, n.trailingSlash);
	}
	const u = S(e$7, r, n);
	if (n.strategy === "as-needed" && u === e$7.defaultLocale) return null;
	return f$1(t === "/" ? `/${u}${l}` : `/${u}${t}`, n.trailingSlash);
}
function $$1(e) {
	const t = e.startsWith("/") ? e : `/${e}`;
	return t === "/" ? "" : t.replace(/\/+$/, "");
}
function z(e, t, r) {
	return r === "" ? t : e.locales.some((n) => t === `/${n}`) ? `${t}${r}` : t;
}
var L = "NEXT_LOCALE";
function b(e, t = L) {
	if (!e) return null;
	for (const r of e.split(";")) {
		const n = r.indexOf("=");
		if (n === -1 || r.slice(0, n).trim() !== t) continue;
		const l = r.slice(n + 1).trim();
		try {
			return decodeURIComponent(l);
		} catch {
			return l;
		}
	}
	return null;
}
// package/i18n/dist/esm/internal/rich.js
var f = /^<([a-z][a-z0-9]*)\s*(\/?)>/;
function h$2(n) {
	const i = [];
	let e = 0;
	for (; e < n.length;) {
		const t = n.indexOf("<", e);
		if (t === -1) {
			i.push(n.slice(e));
			break;
		}
		t > e && i.push(n.slice(e, t));
		const o = n.indexOf(">", t);
		if (o === -1) {
			i.push(n.slice(t));
			break;
		}
		i.push(n.slice(t, o + 1)), e = o + 1;
	}
	return i;
}
function p$1(n) {
	const i = h$2(n);
	let e = 0;
	const t = (o) => {
		const s = [];
		for (; e < i.length;) {
			const c = i[e++];
			if (o !== void 0 && c === `</${o}>`) return s;
			const u = f.exec(c);
			if (u === null) {
				s.push({
					kind: "text",
					value: c
				});
				continue;
			}
			const [, l, r] = u;
			if (r === "/") {
				s.push({
					kind: "tag",
					name: l,
					selfClosing: true,
					children: []
				});
				continue;
			}
			s.push({
				kind: "tag",
				name: l,
				selfClosing: false,
				children: t(l)
			});
		}
		return s;
	};
	return t();
}
// package/i18n/dist/esm/vue.js
function I() {
	return null;
}
function $() {
	return null;
}
var p = Symbol("@yuzhuc/i18n");
function R(e, t = {}) {
	return { install(a) {
		const n = ref(e.resolveLocale(t.locale)), u = /* @__PURE__ */ new Map(), i = (l, r, d) => {
			let o = u.get(n.value);
			return o === void 0 && (o = e.createTranslator(n.value), u.set(n.value, o)), o(l, r, d);
		}, c = {
			locale: n,
			dir: computed(() => f$4(n.value)),
			dictionary: computed(() => e.getMessages(n.value)),
			t: i,
			setLocale: (l) => {
				n.value = e.resolveLocale(l);
			}
		};
		if (a.provide(p, c), a.config.globalProperties.$t = i, a.config.globalProperties.$i18n = c, t.router !== void 0) {
			const l = t.param ?? "locale";
			t.router.beforeEach((r) => {
				const d = P(e, r.path, I(), {
					preference: $(),
					landingPath: t.landingPath,
					trailingSlash: t.trailingSlash
				});
				if (d !== null) return { path: d };
				const o = r.params?.[l], f = Array.isArray(o) ? o[0] : o;
				f !== void 0 && e.hasLocale(f) && (n.value = f);
			});
		}
	} };
}
function s$1() {
	const e = inject(p, null);
	if (e == null) throw new Error("[i18n] useI18n() called outside an app with createI18nPlugin installed.");
	return e;
}
function N(e, t) {
	const { locale: a } = s$1(), n = /* @__PURE__ */ new Map();
	return (i, c, l) => {
		let r = n.get(a.value);
		return r === void 0 && (r = e.createTranslator(a.value, t), n.set(a.value, r)), r(i, c, l);
	};
}
function h$1(e, t) {
	const a = [];
	for (const n of e) {
		if (n.kind === "text") {
			a.push(createTextVNode(n.value));
			continue;
		}
		const u = t[n.name];
		if (u === void 0) {
			a.push(createTextVNode(n.selfClosing ? `<${n.name}/>` : `<${n.name}>`)), n.selfClosing || a.push(...h$1(n.children, t), createTextVNode(`</${n.name}>`));
			continue;
		}
		a.push(n.selfClosing ? h(u) : h(u, null, h$1(n.children, t)));
	}
	return a;
}
defineComponent({
	name: "YuzhucTrans",
	props: {
		t: {
			type: Function,
			default: void 0
		},
		id: {
			type: String,
			default: void 0
		},
		text: {
			type: String,
			default: void 0
		},
		values: {
			type: Object,
			default: void 0
		},
		options: {
			type: Object,
			default: void 0
		},
		components: {
			type: Object,
			default: void 0
		}
	},
	setup(e) {
		return () => {
			const t = e.text !== void 0 ? w$1(e.text, e.values) : e.t !== void 0 && e.id !== void 0 ? e.t(e.id, e.values, e.options) : e.id !== void 0 ? w$1(String(e.id), e.values) : "";
			return e.components === void 0 ? t : h(Fragment, null, h$1(p$1(t), e.components));
		};
	}
});
// app/i18n/head.ts
var defaultImage = {
	url: "/og.png",
	width: 1200,
	height: 630,
	alt: siteName
};
/** Canonical, hreflang, Open Graph, Twitter and JSON-LD for one localised page. */
function useLocalePageMeta(path, title, description, options = {}) {
	const { locale } = s$1();
	const baseUrl = useBaseUrl();
	useHead(() => y$2(i18n, {
		locale: locale.value,
		path,
		baseUrl,
		siteName,
		ogLocaleMap,
		title: title(),
		description: description(),
		image: options.image ?? defaultImage,
		noIndex: options.noIndex,
		hreflangMap: options.hreflangMap,
		website: { alternateName: `${siteName} 多语言站点` },
		jsonLd: [{
			"@context": "https://schema.org",
			"@type": "Organization",
			name: siteName,
			...baseUrl ? {
				url: `${baseUrl}/`,
				logo: `${baseUrl}/favicon.ico`
			} : {}
		}]
	}));
}
// virtual:nuxt:.nuxt%2Froutes.mjs
var virtual_nuxt__nuxt_2Froutes_default = [{
	name: "language-dashboard",
	path: "/:language()/dashboard",
	meta: { validate: (route) => i18n.hasLocale(String(route.params.language)) },
	component: () => import('../build/dashboard-DxiPyzXW.mjs')
}, {
	name: "language-home",
	path: "/:language()/home",
	meta: { validate: (route) => i18n.hasLocale(String(route.params.language)) },
	component: () => import('../build/home-CyScVVXO.mjs')
}];
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
		const history = virtual_nuxt__nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt__nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt__nuxt_2Frouter_options_default.routes(virtual_nuxt__nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt__nuxt_2Froutes_default : virtual_nuxt__nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt__nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey$1({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey$1({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = /* @__PURE__ */ useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		function endNavigation(to) {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
		}
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			endNavigation();
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		router.onError(async (_error, to) => {
			endNavigation();
			await nuxtApp.callHook("page:loading:end");
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			return runMiddleware(to, from);
		});
		async function runMiddleware(to, from) {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const run = () => nuxtApp.runWithContext(() => middleware(to, from));
						const result = await run();
						if (result === false || result instanceof Error) {
							const error = result || createError({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createErrorFromThrown(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		}
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.afterEach((to, _from, failure) => {
			if (to.matched.length === 0 && !error.value && !isNavigationFailure(failure, NavigationFailureType.aborted | NavigationFailureType.cancelled)) return nuxtApp.runWithContext(() => showError(createError({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt__nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
// virtual:nuxt:.nuxt%2Fcomponents.plugin.mjs
var virtual_nuxt__nuxt_2Fcomponents_plugin_default = /* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" });
// package/i18n/dist/esm/nuxt.js
function s(e, n) {
	if (typeof e.get == "function") return e.get(n);
	const r = e[n.toLowerCase()];
	return Array.isArray(r) ? r[0] ?? null : r ?? null;
}
function y(e, n, r = {}) {
	const o = r.cookie ?? "NEXT_LOCALE";
	return S(e, s(n.headers, "accept-language"), { preference: b(s(n.headers, "cookie"), o) });
}
function k(e) {
	return e.headers ?? e.node?.req?.headers ?? e.web?.request?.headers;
}
function _(e, n = {}) {
	return (r) => {
		const o = n.cookie ?? "NEXT_LOCALE", i = r.ssrContext?.event;
		let c = n.locale;
		const t = i === void 0 ? void 0 : k(i);
		t !== void 0 && (c = y(e, { headers: t }, { cookie: o })), r.vueApp.use(R(e, { locale: c }));
	};
}
// virtual:nuxt:.nuxt%2Fplugins.server.mjs
var virtual_nuxt__nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	plugin,
	virtual_nuxt__nuxt_2Fcomponents_plugin_default,
	/* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
		_(i18n)(nuxtApp);
	})
];
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/server-placeholder.js
var ServerPlaceholder = defineComponent({
	name: "ServerPlaceholder",
	render() {
		return createElementBlock("div");
	}
});
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
// app/app.vue?vue&type=script&setup=true&lang.ts
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		const { locale, dir, setLocale } = s$1();
		const route = useRoute$1();
		watch(() => route.params.language, (value) => {
			if (typeof value === "string" && i18n.hasLocale(value)) setLocale(value);
		}, { immediate: true });
		useHead({
			titleTemplate: (title) => title ? `${siteName} | ${title}` : siteName,
			meta: [{
				name: "theme-color",
				content: "#0070f3"
			}],
			link: [
				{
					rel: "manifest",
					href: "/site.webmanifest"
				},
				{
					rel: "icon",
					href: "/icon.svg",
					type: "image/svg+xml"
				},
				{
					rel: "apple-touch-icon",
					href: "/apple-icon.png",
					sizes: "180x180"
				}
			]
		});
		useHead(() => ({ htmlAttrs: {
			lang: locale.value,
			dir: dir.value
		} }));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtRouteAnnouncer = ServerPlaceholder;
			const _component_NuxtPage = page_default;
			_push(`<!--[-->`);
			_push(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent));
			_push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
			_push(`<!--]-->`);
		};
	}
});
// app/app.vue
var _sfc_setup$2 = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var app_default = app_vue_vue_type_script_setup_true_lang_default;
// app/error.vue?vue&type=script&setup=true&lang.ts
var error_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "error",
	__ssrInlineRender: true,
	props: { error: {} },
	setup(__props) {
		const locale = ref("en");
		const tr = computed(() => i18n.createTranslator(locale.value));
		useHead(() => ({
			title: tr.value("site.notFound.title"),
			meta: [{
				name: "robots",
				content: "noindex"
			}],
			htmlAttrs: { lang: locale.value }
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<main${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))}><p class="code">404</p><h1>${ssrInterpolate(unref(tr)("site.notFound.title"))}</h1><p>${ssrInterpolate(unref(tr)("site.notFound.description"))}</p><a class="back"${ssrRenderAttr("href", `/${unref(locale)}${unref(landingPath)}`)}>${ssrInterpolate(unref(tr)("site.notFound.back"))}</a></main>`);
		};
	}
});
// app/error.vue
var _sfc_setup$1 = error_vue_vue_type_script_setup_true_lang_default.setup;
error_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var error_default = error_vue_vue_type_script_setup_true_lang_default;
// virtual:nuxt:.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(createErrorFromThrown(err, {
					route: nuxtApp._route
				})));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(error_default), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
// node_modules/.bun/nuxt@4.6.4+b87f3485fad8f469/node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt__nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createErrorFromThrown(error, { route: nuxt._route });
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { N, br as b, entry as e, i18n as i, qn as q, useLocalePageMeta as u };
//# sourceMappingURL=entry.mjs.map
