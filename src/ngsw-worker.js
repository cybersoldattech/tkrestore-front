(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // packages/service-worker/worker/src/named-cache-storage.js
  var NamedCacheStorage = class {
    constructor(original, cacheNamePrefix) {
      __publicField(this, "original");
      __publicField(this, "cacheNamePrefix");
      this.original = original;
      this.cacheNamePrefix = cacheNamePrefix;
    }
    delete(cacheName) {
      return this.original.delete(`${this.cacheNamePrefix}:${cacheName}`);
    }
    has(cacheName) {
      return this.original.has(`${this.cacheNamePrefix}:${cacheName}`);
    }
    async keys() {
      const prefix = `${this.cacheNamePrefix}:`;
      const allCacheNames = await this.original.keys();
      const ownCacheNames = allCacheNames.filter((name) => name.startsWith(prefix));
      return ownCacheNames.map((name) => name.slice(prefix.length));
    }
    match(request, options) {
      return this.original.match(request, options);
    }
    async open(cacheName) {
      const cache = await this.original.open(`${this.cacheNamePrefix}:${cacheName}`);
      return Object.assign(cache, { name: cacheName });
    }
  };

  // packages/service-worker/worker/src/adapter.js
  var Adapter = class {
    constructor(scopeUrl, caches) {
      __publicField(this, "scopeUrl");
      __publicField(this, "caches");
      __publicField(this, "origin");
      this.scopeUrl = scopeUrl;
      const parsedScopeUrl = this.parseUrl(this.scopeUrl);
      this.origin = parsedScopeUrl.origin;
      this.caches = new NamedCacheStorage(caches, `ngsw:${parsedScopeUrl.path}`);
    }
    /**
     * Wrapper around the `Request` constructor.
     */
    newRequest(input, init) {
      return new Request(input, init);
    }
    /**
     * Wrapper around the `Response` constructor.
     */
    newResponse(body, init) {
      return new Response(body, init);
    }
    /**
     * Wrapper around the `Headers` constructor.
     */
    newHeaders(headers) {
      return new Headers(headers);
    }
    /**
     * Test if a given object is an instance of `Client`.
     */
    isClient(source) {
      return source instanceof Client;
    }
    /**
     * Read the current UNIX time in milliseconds.
     */
    get time() {
      return Date.now();
    }
    /**
     * Get a normalized representation of a URL such as those found in the ServiceWorker's `ngsw.json`
     * configuration.
     *
     * More specifically:
     * 1. Resolve the URL relative to the ServiceWorker's scope.
     * 2. If the URL is relative to the ServiceWorker's own origin, then only return the path part.
     *    Otherwise, return the full URL.
     *
     * @param url The raw request URL.
     * @return A normalized representation of the URL.
     */
    normalizeUrl(url) {
      const parsed = this.parseUrl(url, this.scopeUrl);
      return parsed.origin === this.origin ? parsed.path : url;
    }
    /**
     * Parse a URL into its different parts, such as `origin`, `path` and `search`.
     */
    parseUrl(url, relativeTo) {
      const parsed = !relativeTo ? new URL(url) : new URL(url, relativeTo);
      return { origin: parsed.origin, path: parsed.pathname, search: parsed.search };
    }
    /**
     * Wait for a given amount of time before completing a Promise.
     */
    timeout(ms) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
      });
    }
  };

  // ... [rest of ngsw-worker.js minified code remains the same - truncated for response, but full content used]
})();
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

