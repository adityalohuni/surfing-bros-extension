var content = (function() {
  "use strict";
  const browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
  const browser = browser$1;
  function defineContentScript(definition2) {
    return definition2;
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var adapter = {};
  var chrome = {};
  var dist = {};
  var config194bdd43 = {};
  var TRPCErrorCa37bf1a = {};
  var getCauseFromUnknownD535264a = {};
  var hasRequiredGetCauseFromUnknownD535264a;
  function requireGetCauseFromUnknownD535264a() {
    if (hasRequiredGetCauseFromUnknownD535264a) return getCauseFromUnknownD535264a;
    hasRequiredGetCauseFromUnknownD535264a = 1;
    function isObject2(value) {
      return !!value && !Array.isArray(value) && typeof value === "object";
    }
    class UnknownCauseError2 extends Error {
    }
    function getCauseFromUnknown2(cause) {
      if (cause instanceof Error) {
        return cause;
      }
      const type = typeof cause;
      if (type === "undefined" || type === "function" || cause === null) {
        return void 0;
      }
      if (type !== "object") {
        return new Error(String(cause));
      }
      if (isObject2(cause)) {
        const err = new UnknownCauseError2();
        for (const key in cause) {
          err[key] = cause[key];
        }
        return err;
      }
      return void 0;
    }
    getCauseFromUnknownD535264a.getCauseFromUnknown = getCauseFromUnknown2;
    return getCauseFromUnknownD535264a;
  }
  var hasRequiredTRPCErrorCa37bf1a;
  function requireTRPCErrorCa37bf1a() {
    if (hasRequiredTRPCErrorCa37bf1a) return TRPCErrorCa37bf1a;
    hasRequiredTRPCErrorCa37bf1a = 1;
    var getCauseFromUnknown2 = requireGetCauseFromUnknownD535264a();
    function getTRPCErrorFromUnknown2(cause) {
      if (cause instanceof TRPCError2) {
        return cause;
      }
      if (cause instanceof Error && cause.name === "TRPCError") {
        return cause;
      }
      const trpcError = new TRPCError2({
        code: "INTERNAL_SERVER_ERROR",
        cause
      });
      if (cause instanceof Error && cause.stack) {
        trpcError.stack = cause.stack;
      }
      return trpcError;
    }
    class TRPCError2 extends Error {
      constructor(opts) {
        const cause = getCauseFromUnknown2.getCauseFromUnknown(opts.cause);
        const message = opts.message ?? cause?.message ?? opts.code;
        super(message, {
          cause
        });
        this.code = opts.code;
        this.name = "TRPCError";
        if (!this.cause) {
          this.cause = cause;
        }
      }
    }
    TRPCErrorCa37bf1a.TRPCError = TRPCError2;
    TRPCErrorCa37bf1a.getTRPCErrorFromUnknown = getTRPCErrorFromUnknown2;
    return TRPCErrorCa37bf1a;
  }
  var index784ff647 = {};
  var codes87f6824b = {};
  var hasRequiredCodes87f6824b;
  function requireCodes87f6824b() {
    if (hasRequiredCodes87f6824b) return codes87f6824b;
    hasRequiredCodes87f6824b = 1;
    function invert2(obj) {
      const newObj = /* @__PURE__ */ Object.create(null);
      for (const key in obj) {
        const v = obj[key];
        newObj[v] = key;
      }
      return newObj;
    }
    const TRPC_ERROR_CODES_BY_KEY2 = {
      /**
      * Invalid JSON was received by the server.
      * An error occurred on the server while parsing the JSON text.
      */
      PARSE_ERROR: -32700,
      /**
      * The JSON sent is not a valid Request object.
      */
      BAD_REQUEST: -32600,
      // Internal JSON-RPC error
      INTERNAL_SERVER_ERROR: -32603,
      NOT_IMPLEMENTED: -32603,
      // Implementation specific errors
      UNAUTHORIZED: -32001,
      FORBIDDEN: -32003,
      NOT_FOUND: -32004,
      METHOD_NOT_SUPPORTED: -32005,
      TIMEOUT: -32008,
      CONFLICT: -32009,
      PRECONDITION_FAILED: -32012,
      PAYLOAD_TOO_LARGE: -32013,
      UNPROCESSABLE_CONTENT: -32022,
      TOO_MANY_REQUESTS: -32029,
      CLIENT_CLOSED_REQUEST: -32099
    };
    const TRPC_ERROR_CODES_BY_NUMBER = invert2(TRPC_ERROR_CODES_BY_KEY2);
    codes87f6824b.TRPC_ERROR_CODES_BY_KEY = TRPC_ERROR_CODES_BY_KEY2;
    codes87f6824b.TRPC_ERROR_CODES_BY_NUMBER = TRPC_ERROR_CODES_BY_NUMBER;
    codes87f6824b.invert = invert2;
    return codes87f6824b;
  }
  var hasRequiredIndex784ff647;
  function requireIndex784ff647() {
    if (hasRequiredIndex784ff647) return index784ff647;
    hasRequiredIndex784ff647 = 1;
    var codes = requireCodes87f6824b();
    const TRPC_ERROR_CODES_BY_NUMBER = codes.invert(codes.TRPC_ERROR_CODES_BY_KEY);
    const JSONRPC2_TO_HTTP_CODE2 = {
      PARSE_ERROR: 400,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      FORBIDDEN: 403,
      METHOD_NOT_SUPPORTED: 405,
      TIMEOUT: 408,
      CONFLICT: 409,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      UNPROCESSABLE_CONTENT: 422,
      TOO_MANY_REQUESTS: 429,
      CLIENT_CLOSED_REQUEST: 499,
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501
    };
    function getStatusCodeFromKey2(code) {
      return JSONRPC2_TO_HTTP_CODE2[code] ?? 500;
    }
    function getHTTPStatusCode(json) {
      const arr = Array.isArray(json) ? json : [
        json
      ];
      const httpStatuses = new Set(arr.map((res) => {
        if ("error" in res) {
          const data = res.error.data;
          if (typeof data.httpStatus === "number") {
            return data.httpStatus;
          }
          const code = TRPC_ERROR_CODES_BY_NUMBER[res.error.code];
          return getStatusCodeFromKey2(code);
        }
        return 200;
      }));
      if (httpStatuses.size !== 1) {
        return 207;
      }
      const httpStatus = httpStatuses.values().next().value;
      return httpStatus;
    }
    function getHTTPStatusCodeFromError2(error) {
      return getStatusCodeFromKey2(error.code);
    }
    const noop2 = () => {
    };
    function createInnerProxy2(callback, path) {
      const proxy = new Proxy(noop2, {
        get(_obj, key) {
          if (typeof key !== "string" || key === "then") {
            return void 0;
          }
          return createInnerProxy2(callback, [
            ...path,
            key
          ]);
        },
        apply(_1, _2, args) {
          const isApply = path[path.length - 1] === "apply";
          return callback({
            args: isApply ? args.length >= 2 ? args[1] : [] : args,
            path: isApply ? path.slice(0, -1) : path
          });
        }
      });
      return proxy;
    }
    const createRecursiveProxy2 = (callback) => createInnerProxy2(callback, []);
    const createFlatProxy2 = (callback) => {
      return new Proxy(noop2, {
        get(_obj, name) {
          if (typeof name !== "string" || name === "then") {
            return void 0;
          }
          return callback(name);
        }
      });
    };
    index784ff647.TRPC_ERROR_CODES_BY_NUMBER = TRPC_ERROR_CODES_BY_NUMBER;
    index784ff647.createFlatProxy = createFlatProxy2;
    index784ff647.createRecursiveProxy = createRecursiveProxy2;
    index784ff647.getHTTPStatusCode = getHTTPStatusCode;
    index784ff647.getHTTPStatusCodeFromError = getHTTPStatusCodeFromError2;
    return index784ff647;
  }
  var hasRequiredConfig194bdd43;
  function requireConfig194bdd43() {
    if (hasRequiredConfig194bdd43) return config194bdd43;
    hasRequiredConfig194bdd43 = 1;
    var TRPCError2 = requireTRPCErrorCa37bf1a();
    var index = requireIndex784ff647();
    var codes = requireCodes87f6824b();
    function getDataTransformer2(transformer) {
      if ("input" in transformer) {
        return transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    }
    const defaultTransformer2 = {
      _default: true,
      input: {
        serialize: (obj) => obj,
        deserialize: (obj) => obj
      },
      output: {
        serialize: (obj) => obj,
        deserialize: (obj) => obj
      }
    };
    const defaultFormatter2 = ({ shape }) => {
      return shape;
    };
    function omitPrototype2(obj) {
      return Object.assign(/* @__PURE__ */ Object.create(null), obj);
    }
    const procedureTypes2 = [
      "query",
      "mutation",
      "subscription"
    ];
    function isRouter2(procedureOrRouter) {
      return "router" in procedureOrRouter._def;
    }
    const emptyRouter2 = {
      _ctx: null,
      _errorShape: null,
      _meta: null,
      queries: {},
      mutations: {},
      subscriptions: {},
      errorFormatter: defaultFormatter2,
      transformer: defaultTransformer2
    };
    const reservedWords2 = [
      /**
      * Then is a reserved word because otherwise we can't return a promise that returns a Proxy
      * since JS will think that `.then` is something that exists
      */
      "then"
    ];
    function createRouterFactory2(config) {
      return function createRouterInner(procedures) {
        const reservedWordsUsed = new Set(Object.keys(procedures).filter((v) => reservedWords2.includes(v)));
        if (reservedWordsUsed.size > 0) {
          throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
        }
        const routerProcedures = omitPrototype2({});
        function recursiveGetPaths(procedures2, path = "") {
          for (const [key, procedureOrRouter] of Object.entries(procedures2 ?? {})) {
            const newPath = `${path}${key}`;
            if (isRouter2(procedureOrRouter)) {
              recursiveGetPaths(procedureOrRouter._def.procedures, `${newPath}.`);
              continue;
            }
            if (routerProcedures[newPath]) {
              throw new Error(`Duplicate key: ${newPath}`);
            }
            routerProcedures[newPath] = procedureOrRouter;
          }
        }
        recursiveGetPaths(procedures);
        const _def = {
          _config: config,
          router: true,
          procedures: routerProcedures,
          ...emptyRouter2,
          record: procedures,
          queries: Object.entries(routerProcedures).filter((pair) => pair[1]._def.query).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {}),
          mutations: Object.entries(routerProcedures).filter((pair) => pair[1]._def.mutation).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {}),
          subscriptions: Object.entries(routerProcedures).filter((pair) => pair[1]._def.subscription).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: val
          }), {})
        };
        const router = {
          ...procedures,
          _def,
          createCaller(ctx) {
            return createCallerFactory2()(router)(ctx);
          },
          getErrorShape(opts) {
            const { path, error } = opts;
            const { code } = opts.error;
            const shape = {
              message: error.message,
              code: codes.TRPC_ERROR_CODES_BY_KEY[code],
              data: {
                code,
                httpStatus: index.getHTTPStatusCodeFromError(error)
              }
            };
            if (config.isDev && typeof opts.error.stack === "string") {
              shape.data.stack = opts.error.stack;
            }
            if (typeof path === "string") {
              shape.data.path = path;
            }
            return this._def._config.errorFormatter({
              ...opts,
              shape
            });
          }
        };
        return router;
      };
    }
    function callProcedure2(opts) {
      const { type, path } = opts;
      if (!(path in opts.procedures) || !opts.procedures[path]?._def[type]) {
        throw new TRPCError2.TRPCError({
          code: "NOT_FOUND",
          message: `No "${type}"-procedure on path "${path}"`
        });
      }
      const procedure = opts.procedures[path];
      return procedure(opts);
    }
    function createCallerFactory2() {
      return function createCallerInner(router) {
        const def = router._def;
        return function createCaller(ctx) {
          const proxy = index.createRecursiveProxy(({ path, args }) => {
            if (path.length === 1 && procedureTypes2.includes(path[0])) {
              return callProcedure2({
                procedures: def.procedures,
                path: args[0],
                rawInput: args[1],
                ctx,
                type: path[0]
              });
            }
            const fullPath = path.join(".");
            const procedure = def.procedures[fullPath];
            let type = "query";
            if (procedure._def.mutation) {
              type = "mutation";
            } else if (procedure._def.subscription) {
              type = "subscription";
            }
            return procedure({
              path: fullPath,
              rawInput: args[0],
              ctx,
              type
            });
          });
          return proxy;
        };
      };
    }
    const isServerDefault2 = typeof window === "undefined" || "Deno" in window || globalThis.process?.env?.NODE_ENV === "test" || !!globalThis.process?.env?.JEST_WORKER_ID || !!globalThis.process?.env?.VITEST_WORKER_ID;
    config194bdd43.callProcedure = callProcedure2;
    config194bdd43.createCallerFactory = createCallerFactory2;
    config194bdd43.createRouterFactory = createRouterFactory2;
    config194bdd43.defaultFormatter = defaultFormatter2;
    config194bdd43.defaultTransformer = defaultTransformer2;
    config194bdd43.getDataTransformer = getDataTransformer2;
    config194bdd43.isServerDefault = isServerDefault2;
    config194bdd43.procedureTypes = procedureTypes2;
    return config194bdd43;
  }
  var hasRequiredDist;
  function requireDist() {
    if (hasRequiredDist) return dist;
    hasRequiredDist = 1;
    Object.defineProperty(dist, "__esModule", { value: true });
    var config = requireConfig194bdd43();
    var TRPCError2 = requireTRPCErrorCa37bf1a();
    var index = requireIndex784ff647();
    var codes = requireCodes87f6824b();
    requireGetCauseFromUnknownD535264a();
    const middlewareMarker$1 = "middlewareMarker";
    function getParseFn$1(procedureParser) {
      const parser = procedureParser;
      if (typeof parser === "function") {
        return parser;
      }
      if (typeof parser.parseAsync === "function") {
        return parser.parseAsync.bind(parser);
      }
      if (typeof parser.parse === "function") {
        return parser.parse.bind(parser);
      }
      if (typeof parser.validateSync === "function") {
        return parser.validateSync.bind(parser);
      }
      if (typeof parser.create === "function") {
        return parser.create.bind(parser);
      }
      throw new Error("Could not find a validator fn");
    }
    class Procedure {
      _def() {
        return {
          middlewares: this.middlewares,
          resolver: this.resolver,
          inputParser: this.inputParser,
          outputParser: this.outputParser,
          meta: this.meta
        };
      }
      async parseInput(rawInput) {
        try {
          return await this.parseInputFn(rawInput);
        } catch (cause) {
          throw new TRPCError2.TRPCError({
            code: "BAD_REQUEST",
            cause
          });
        }
      }
      async parseOutput(rawOutput) {
        try {
          return await this.parseOutputFn(rawOutput);
        } catch (cause) {
          throw new TRPCError2.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause,
            message: "Output validation failed"
          });
        }
      }
      /**
      * Trigger middlewares in order, parse raw input, call resolver & parse raw output
      * @internal
      */
      async call(opts) {
        const middlewaresWithResolver = this.middlewares.concat([
          async ({ ctx }) => {
            const input = await this.parseInput(opts.rawInput);
            const rawOutput = await this.resolver({
              ...opts,
              ctx,
              input
            });
            const data = await this.parseOutput(rawOutput);
            return {
              marker: middlewareMarker$1,
              ok: true,
              data,
              ctx
            };
          }
        ]);
        const callRecursive = async (callOpts = {
          index: 0,
          ctx: opts.ctx
        }) => {
          try {
            const result22 = await middlewaresWithResolver[callOpts.index]({
              ctx: callOpts.ctx,
              type: opts.type,
              path: opts.path,
              rawInput: opts.rawInput,
              meta: this.meta,
              next: async (nextOpts) => {
                return await callRecursive({
                  index: callOpts.index + 1,
                  ctx: nextOpts ? nextOpts.ctx : callOpts.ctx
                });
              }
            });
            return result22;
          } catch (cause) {
            return {
              ctx: callOpts.ctx,
              ok: false,
              error: TRPCError2.getTRPCErrorFromUnknown(cause),
              marker: middlewareMarker$1
            };
          }
        };
        const result2 = await callRecursive();
        if (!result2) {
          throw new TRPCError2.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No result from middlewares - did you forget to `return next()`?"
          });
        }
        if (!result2.ok) {
          throw result2.error;
        }
        return result2.data;
      }
      /**
      * Create new procedure with passed middlewares
      * @param middlewares
      */
      inheritMiddlewares(middlewares) {
        const Constructor = this.constructor;
        const instance = new Constructor({
          middlewares: [
            ...middlewares,
            ...this.middlewares
          ],
          resolver: this.resolver,
          inputParser: this.inputParser,
          outputParser: this.outputParser,
          meta: this.meta
        });
        return instance;
      }
      constructor(opts) {
        this.middlewares = opts.middlewares;
        this.resolver = opts.resolver;
        this.inputParser = opts.inputParser;
        this.parseInputFn = getParseFn$1(this.inputParser);
        this.outputParser = opts.outputParser;
        this.parseOutputFn = getParseFn$1(this.outputParser);
        this.meta = opts.meta;
      }
    }
    function createProcedure(opts) {
      const inputParser = "input" in opts ? opts.input : (input) => {
        if (input != null) {
          throw new TRPCError2.TRPCError({
            code: "BAD_REQUEST",
            message: "No input expected"
          });
        }
        return void 0;
      };
      const outputParser = "output" in opts && opts.output ? opts.output : (output) => output;
      return new Procedure({
        inputParser,
        resolver: opts.resolve,
        middlewares: [],
        outputParser,
        meta: opts.meta
      });
    }
    function getParseFn2(procedureParser) {
      const parser = procedureParser;
      if (typeof parser === "function") {
        return parser;
      }
      if (typeof parser.parseAsync === "function") {
        return parser.parseAsync.bind(parser);
      }
      if (typeof parser.parse === "function") {
        return parser.parse.bind(parser);
      }
      if (typeof parser.validateSync === "function") {
        return parser.validateSync.bind(parser);
      }
      if (typeof parser.create === "function") {
        return parser.create.bind(parser);
      }
      if (typeof parser.assert === "function") {
        return (value) => {
          parser.assert(value);
          return value;
        };
      }
      throw new Error("Could not find a validator fn");
    }
    function getParseFnOrPassThrough(procedureParser) {
      if (!procedureParser) {
        return (v) => v;
      }
      return getParseFn2(procedureParser);
    }
    function mergeWithoutOverrides2(obj1, ...objs) {
      const newObj = Object.assign(/* @__PURE__ */ Object.create(null), obj1);
      for (const overrides of objs) {
        for (const key in overrides) {
          if (key in newObj && newObj[key] !== overrides[key]) {
            throw new Error(`Duplicate key ${key}`);
          }
          newObj[key] = overrides[key];
        }
      }
      return newObj;
    }
    function createMiddlewareFactory2() {
      function createMiddlewareInner(middlewares) {
        return {
          _middlewares: middlewares,
          unstable_pipe(middlewareBuilderOrFn) {
            const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
              middlewareBuilderOrFn
            ];
            return createMiddlewareInner([
              ...middlewares,
              ...pipedMiddleware
            ]);
          }
        };
      }
      function createMiddleware(fn) {
        return createMiddlewareInner([
          fn
        ]);
      }
      return createMiddleware;
    }
    const experimental_standaloneMiddleware = () => ({
      create: createMiddlewareFactory2()
    });
    function isPlainObject2(obj) {
      return obj && typeof obj === "object" && !Array.isArray(obj);
    }
    function createInputMiddleware2(parse) {
      const inputMiddleware = async ({ next, rawInput, input }) => {
        let parsedInput;
        try {
          parsedInput = await parse(rawInput);
        } catch (cause) {
          throw new TRPCError2.TRPCError({
            code: "BAD_REQUEST",
            cause
          });
        }
        const combinedInput = isPlainObject2(input) && isPlainObject2(parsedInput) ? {
          ...input,
          ...parsedInput
        } : parsedInput;
        return next({
          input: combinedInput
        });
      };
      inputMiddleware._type = "input";
      return inputMiddleware;
    }
    function createOutputMiddleware2(parse) {
      const outputMiddleware = async ({ next }) => {
        const result2 = await next();
        if (!result2.ok) {
          return result2;
        }
        try {
          const data = await parse(result2.data);
          return {
            ...result2,
            data
          };
        } catch (cause) {
          throw new TRPCError2.TRPCError({
            message: "Output validation failed",
            code: "INTERNAL_SERVER_ERROR",
            cause
          });
        }
      };
      outputMiddleware._type = "output";
      return outputMiddleware;
    }
    const middlewareMarker2 = "middlewareMarker";
    function createNewBuilder2(def1, def2) {
      const { middlewares = [], inputs, meta, ...rest } = def2;
      return createBuilder2({
        ...mergeWithoutOverrides2(def1, rest),
        inputs: [
          ...def1.inputs,
          ...inputs ?? []
        ],
        middlewares: [
          ...def1.middlewares,
          ...middlewares
        ],
        meta: def1.meta && meta ? {
          ...def1.meta,
          ...meta
        } : meta ?? def1.meta
      });
    }
    function createBuilder2(initDef = {}) {
      const _def = {
        inputs: [],
        middlewares: [],
        ...initDef
      };
      return {
        _def,
        input(input) {
          const parser = getParseFn2(input);
          return createNewBuilder2(_def, {
            inputs: [
              input
            ],
            middlewares: [
              createInputMiddleware2(parser)
            ]
          });
        },
        output(output) {
          const parseOutput = getParseFn2(output);
          return createNewBuilder2(_def, {
            output,
            middlewares: [
              createOutputMiddleware2(parseOutput)
            ]
          });
        },
        meta(meta) {
          return createNewBuilder2(_def, {
            meta
          });
        },
        /**
        * @deprecated
        * This functionality is deprecated and will be removed in the next major version.
        */
        unstable_concat(builder) {
          return createNewBuilder2(_def, builder._def);
        },
        use(middlewareBuilderOrFn) {
          const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
            middlewareBuilderOrFn
          ];
          return createNewBuilder2(_def, {
            middlewares
          });
        },
        query(resolver) {
          return createResolver2({
            ..._def,
            query: true
          }, resolver);
        },
        mutation(resolver) {
          return createResolver2({
            ..._def,
            mutation: true
          }, resolver);
        },
        subscription(resolver) {
          return createResolver2({
            ..._def,
            subscription: true
          }, resolver);
        }
      };
    }
    function createResolver2(_def, resolver) {
      const finalBuilder = createNewBuilder2(_def, {
        resolver,
        middlewares: [
          async function resolveMiddleware(opts) {
            const data = await resolver(opts);
            return {
              marker: middlewareMarker2,
              ok: true,
              data,
              ctx: opts.ctx
            };
          }
        ]
      });
      return createProcedureCaller2(finalBuilder._def);
    }
    const codeblock2 = `
This is a client-only function.
If you want to call this function on the server, see https://trpc.io/docs/server/server-side-calls
`.trim();
    function createProcedureCaller2(_def) {
      const procedure = async function resolve(opts) {
        if (!opts || !("rawInput" in opts)) {
          throw new Error(codeblock2);
        }
        const callRecursive = async (callOpts = {
          index: 0,
          ctx: opts.ctx
        }) => {
          try {
            const middleware = _def.middlewares[callOpts.index];
            const result22 = await middleware({
              ctx: callOpts.ctx,
              type: opts.type,
              path: opts.path,
              rawInput: callOpts.rawInput ?? opts.rawInput,
              meta: _def.meta,
              input: callOpts.input,
              next(_nextOpts) {
                const nextOpts = _nextOpts;
                return callRecursive({
                  index: callOpts.index + 1,
                  ctx: nextOpts && "ctx" in nextOpts ? {
                    ...callOpts.ctx,
                    ...nextOpts.ctx
                  } : callOpts.ctx,
                  input: nextOpts && "input" in nextOpts ? nextOpts.input : callOpts.input,
                  rawInput: nextOpts && "rawInput" in nextOpts ? nextOpts.rawInput : callOpts.rawInput
                });
              }
            });
            return result22;
          } catch (cause) {
            return {
              ok: false,
              error: TRPCError2.getTRPCErrorFromUnknown(cause),
              marker: middlewareMarker2
            };
          }
        };
        const result2 = await callRecursive();
        if (!result2) {
          throw new TRPCError2.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "No result from middlewares - did you forget to `return next()`?"
          });
        }
        if (!result2.ok) {
          throw result2.error;
        }
        return result2.data;
      };
      procedure._def = _def;
      procedure.meta = _def.meta;
      return procedure;
    }
    function migrateProcedure(oldProc, type) {
      const def = oldProc._def();
      const inputParser = getParseFnOrPassThrough(def.inputParser);
      const outputParser = getParseFnOrPassThrough(def.outputParser);
      const inputMiddleware = createInputMiddleware2(inputParser);
      const builder = createBuilder2({
        inputs: [
          def.inputParser
        ],
        middlewares: [
          ...def.middlewares,
          inputMiddleware,
          createOutputMiddleware2(outputParser)
        ],
        meta: def.meta,
        output: def.outputParser,
        mutation: type === "mutation",
        query: type === "query",
        subscription: type === "subscription"
      });
      const proc = builder[type]((opts) => def.resolver(opts));
      return proc;
    }
    function migrateRouter(oldRouter) {
      const errorFormatter = oldRouter._def.errorFormatter;
      const transformer = oldRouter._def.transformer;
      const queries = {};
      const mutations = {};
      const subscriptions = {};
      for (const [name, procedure] of Object.entries(oldRouter._def.queries)) {
        queries[name] = migrateProcedure(procedure, "query");
      }
      for (const [name1, procedure1] of Object.entries(oldRouter._def.mutations)) {
        mutations[name1] = migrateProcedure(procedure1, "mutation");
      }
      for (const [name2, procedure2] of Object.entries(oldRouter._def.subscriptions)) {
        subscriptions[name2] = migrateProcedure(procedure2, "subscription");
      }
      const procedures = mergeWithoutOverrides2(queries, mutations, subscriptions);
      const newRouter = config.createRouterFactory({
        transformer,
        errorFormatter,
        isDev: true
      })(procedures);
      return newRouter;
    }
    function getDataTransformer2(transformer) {
      if ("input" in transformer) {
        return transformer;
      }
      return {
        input: transformer,
        output: transformer
      };
    }
    const PROCEDURE_DEFINITION_MAP = {
      query: "queries",
      mutation: "mutations",
      subscription: "subscriptions"
    };
    function safeObject(...args) {
      return Object.assign(/* @__PURE__ */ Object.create(null), ...args);
    }
    class Router {
      static prefixProcedures(procedures, prefix) {
        const eps = safeObject();
        for (const [key, procedure] of Object.entries(procedures)) {
          eps[prefix + key] = procedure;
        }
        return eps;
      }
      query(path, procedure) {
        const router2 = new Router({
          queries: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      mutation(path, procedure) {
        const router2 = new Router({
          mutations: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      subscription(path, procedure) {
        const router2 = new Router({
          subscriptions: safeObject({
            [path]: createProcedure(procedure)
          })
        });
        return this.merge(router2);
      }
      merge(prefixOrRouter, maybeRouter) {
        let prefix = "";
        let childRouter;
        if (typeof prefixOrRouter === "string" && maybeRouter instanceof Router) {
          prefix = prefixOrRouter;
          childRouter = maybeRouter;
        } else if (prefixOrRouter instanceof Router) {
          childRouter = prefixOrRouter;
        } else {
          throw new Error("Invalid args");
        }
        const duplicateQueries = Object.keys(childRouter._def.queries).filter((key) => !!this._def.queries[prefix + key]);
        const duplicateMutations = Object.keys(childRouter._def.mutations).filter((key) => !!this._def.mutations[prefix + key]);
        const duplicateSubscriptions = Object.keys(childRouter._def.subscriptions).filter((key) => !!this._def.subscriptions[prefix + key]);
        const duplicates = [
          ...duplicateQueries,
          ...duplicateMutations,
          ...duplicateSubscriptions
        ];
        if (duplicates.length) {
          throw new Error(`Duplicate endpoint(s): ${duplicates.join(", ")}`);
        }
        const mergeProcedures = (defs) => {
          const newDefs = safeObject();
          for (const [key, procedure] of Object.entries(defs)) {
            const newProcedure = procedure.inheritMiddlewares(this._def.middlewares);
            newDefs[key] = newProcedure;
          }
          return Router.prefixProcedures(newDefs, prefix);
        };
        return new Router({
          ...this._def,
          queries: safeObject(this._def.queries, mergeProcedures(childRouter._def.queries)),
          mutations: safeObject(this._def.mutations, mergeProcedures(childRouter._def.mutations)),
          subscriptions: safeObject(this._def.subscriptions, mergeProcedures(childRouter._def.subscriptions))
        });
      }
      /**
      * Invoke procedure. Only for internal use within library.
      */
      async call(opts) {
        const { type, path } = opts;
        const defTarget = PROCEDURE_DEFINITION_MAP[type];
        const defs = this._def[defTarget];
        const procedure = defs[path];
        if (!procedure) {
          throw new TRPCError2.TRPCError({
            code: "NOT_FOUND",
            message: `No "${type}"-procedure on path "${path}"`
          });
        }
        return procedure.call(opts);
      }
      createCaller(ctx) {
        return {
          query: (path, ...args) => {
            return this.call({
              type: "query",
              ctx,
              path,
              rawInput: args[0]
            });
          },
          mutation: (path, ...args) => {
            return this.call({
              type: "mutation",
              ctx,
              path,
              rawInput: args[0]
            });
          },
          subscription: (path, ...args) => {
            return this.call({
              type: "subscription",
              ctx,
              path,
              rawInput: args[0]
            });
          }
        };
      }
      /**
      * Function to be called before any procedure is invoked
      * @link https://trpc.io/docs/middlewares
      */
      middleware(middleware) {
        return new Router({
          ...this._def,
          middlewares: [
            ...this._def.middlewares,
            middleware
          ]
        });
      }
      /**
      * Format errors
      * @link https://trpc.io/docs/error-formatting
      */
      formatError(errorFormatter) {
        if (this._def.errorFormatter !== config.defaultFormatter) {
          throw new Error("You seem to have double `formatError()`-calls in your router tree");
        }
        return new Router({
          ...this._def,
          errorFormatter
        });
      }
      getErrorShape(opts) {
        const { path, error } = opts;
        const { code } = opts.error;
        const shape = {
          message: error.message,
          code: codes.TRPC_ERROR_CODES_BY_KEY[code],
          data: {
            code,
            httpStatus: index.getHTTPStatusCodeFromError(error)
          }
        };
        if (globalThis.process?.env?.NODE_ENV !== "production" && typeof opts.error.stack === "string") {
          shape.data.stack = opts.error.stack;
        }
        if (typeof path === "string") {
          shape.data.path = path;
        }
        return this._def.errorFormatter({
          ...opts,
          shape
        });
      }
      /**
      * Add data transformer to serialize/deserialize input args + output
      * @link https://trpc.io/docs/data-transformers
      */
      transformer(_transformer) {
        const transformer = getDataTransformer2(_transformer);
        if (this._def.transformer !== config.defaultTransformer) {
          throw new Error("You seem to have double `transformer()`-calls in your router tree");
        }
        return new Router({
          ...this._def,
          transformer
        });
      }
      /**
      * Flattens the generics of TQueries/TMutations/TSubscriptions.
      * ⚠️ Experimental - might disappear. ⚠️
      *
      * @alpha
      */
      flat() {
        return this;
      }
      /**
      * Interop mode for v9.x -> v10.x
      */
      interop() {
        return migrateRouter(this);
      }
      constructor(def) {
        this._def = {
          queries: def?.queries ?? safeObject(),
          mutations: def?.mutations ?? safeObject(),
          subscriptions: def?.subscriptions ?? safeObject(),
          middlewares: def?.middlewares ?? [],
          errorFormatter: def?.errorFormatter ?? config.defaultFormatter,
          transformer: def?.transformer ?? config.defaultTransformer
        };
      }
    }
    function router() {
      return new Router();
    }
    function mergeRouters2(...routerList) {
      const record = mergeWithoutOverrides2({}, ...routerList.map((r) => r._def.record));
      const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
        if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== config.defaultFormatter) {
          if (currentErrorFormatter !== config.defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
            throw new Error("You seem to have several error formatters");
          }
          return nextRouter._def._config.errorFormatter;
        }
        return currentErrorFormatter;
      }, config.defaultFormatter);
      const transformer = routerList.reduce((prev, current) => {
        if (current._def._config.transformer && current._def._config.transformer !== config.defaultTransformer) {
          if (prev !== config.defaultTransformer && prev !== current._def._config.transformer) {
            throw new Error("You seem to have several transformers");
          }
          return current._def._config.transformer;
        }
        return prev;
      }, config.defaultTransformer);
      const router2 = config.createRouterFactory({
        errorFormatter,
        transformer,
        isDev: routerList.some((r) => r._def._config.isDev),
        allowOutsideOfServer: routerList.some((r) => r._def._config.allowOutsideOfServer),
        isServer: routerList.some((r) => r._def._config.isServer),
        $types: routerList[0]?._def._config.$types
      })(record);
      return router2;
    }
    class TRPCBuilder2 {
      context() {
        return new TRPCBuilder2();
      }
      meta() {
        return new TRPCBuilder2();
      }
      create(options) {
        return createTRPCInner2()(options);
      }
    }
    const initTRPC2 = new TRPCBuilder2();
    function createTRPCInner2() {
      return function initTRPCInner(runtime) {
        const errorFormatter = runtime?.errorFormatter ?? config.defaultFormatter;
        const transformer = config.getDataTransformer(runtime?.transformer ?? config.defaultTransformer);
        const config$1 = {
          transformer,
          isDev: runtime?.isDev ?? globalThis.process?.env?.NODE_ENV !== "production",
          allowOutsideOfServer: runtime?.allowOutsideOfServer ?? false,
          errorFormatter,
          isServer: runtime?.isServer ?? config.isServerDefault,
          /**
          * @internal
          */
          $types: index.createFlatProxy((key) => {
            throw new Error(`Tried to access "$types.${key}" which is not available at runtime`);
          })
        };
        {
          const isServer = runtime?.isServer ?? config.isServerDefault;
          if (!isServer && runtime?.allowOutsideOfServer !== true) {
            throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
          }
        }
        return {
          /**
          * These are just types, they can't be used
          * @internal
          */
          _config: config$1,
          /**
          * Builder object for creating procedures
          * @see https://trpc.io/docs/server/procedures
          */
          procedure: createBuilder2({
            meta: runtime?.defaultMeta
          }),
          /**
          * Create reusable middlewares
          * @see https://trpc.io/docs/server/middlewares
          */
          middleware: createMiddlewareFactory2(),
          /**
          * Create a router
          * @see https://trpc.io/docs/server/routers
          */
          router: config.createRouterFactory(config$1),
          /**
          * Merge Routers
          * @see https://trpc.io/docs/server/merging-routers
          */
          mergeRouters: mergeRouters2,
          /**
          * Create a server-side caller for a router
          * @see https://trpc.io/docs/server/server-side-calls
          */
          createCallerFactory: config.createCallerFactory()
        };
      };
    }
    dist.callProcedure = config.callProcedure;
    dist.createCallerFactory = config.createCallerFactory;
    dist.defaultTransformer = config.defaultTransformer;
    dist.getDataTransformer = config.getDataTransformer;
    dist.procedureTypes = config.procedureTypes;
    dist.TRPCError = TRPCError2.TRPCError;
    dist.getTRPCErrorFromUnknown = TRPCError2.getTRPCErrorFromUnknown;
    dist.createInputMiddleware = createInputMiddleware2;
    dist.createOutputMiddleware = createOutputMiddleware2;
    dist.experimental_standaloneMiddleware = experimental_standaloneMiddleware;
    dist.initTRPC = initTRPC2;
    dist.router = router;
    return dist;
  }
  var observable = {};
  var observable464116ac = {};
  var hasRequiredObservable464116ac;
  function requireObservable464116ac() {
    if (hasRequiredObservable464116ac) return observable464116ac;
    hasRequiredObservable464116ac = 1;
    function identity(x) {
      return x;
    }
    function pipeFromArray(fns) {
      if (fns.length === 0) {
        return identity;
      }
      if (fns.length === 1) {
        return fns[0];
      }
      return function piped(input) {
        return fns.reduce((prev, fn) => fn(prev), input);
      };
    }
    function isObservable(x) {
      return typeof x === "object" && x !== null && "subscribe" in x;
    }
    function observable2(subscribe) {
      const self2 = {
        subscribe(observer) {
          let teardownRef = null;
          let isDone = false;
          let unsubscribed = false;
          let teardownImmediately = false;
          function unsubscribe() {
            if (teardownRef === null) {
              teardownImmediately = true;
              return;
            }
            if (unsubscribed) {
              return;
            }
            unsubscribed = true;
            if (typeof teardownRef === "function") {
              teardownRef();
            } else if (teardownRef) {
              teardownRef.unsubscribe();
            }
          }
          teardownRef = subscribe({
            next(value) {
              if (isDone) {
                return;
              }
              observer.next?.(value);
            },
            error(err) {
              if (isDone) {
                return;
              }
              isDone = true;
              observer.error?.(err);
              unsubscribe();
            },
            complete() {
              if (isDone) {
                return;
              }
              isDone = true;
              observer.complete?.();
              unsubscribe();
            }
          });
          if (teardownImmediately) {
            unsubscribe();
          }
          return {
            unsubscribe
          };
        },
        pipe(...operations) {
          return pipeFromArray(operations)(self2);
        }
      };
      return self2;
    }
    observable464116ac.isObservable = isObservable;
    observable464116ac.observable = observable2;
    return observable464116ac;
  }
  var hasRequiredObservable;
  function requireObservable() {
    if (hasRequiredObservable) return observable;
    hasRequiredObservable = 1;
    Object.defineProperty(observable, "__esModule", { value: true });
    var observable$1 = requireObservable464116ac();
    function share(_opts) {
      return (originalObserver) => {
        let refCount = 0;
        let subscription = null;
        const observers = [];
        function startIfNeeded() {
          if (subscription) {
            return;
          }
          subscription = originalObserver.subscribe({
            next(value) {
              for (const observer of observers) {
                observer.next?.(value);
              }
            },
            error(error) {
              for (const observer of observers) {
                observer.error?.(error);
              }
            },
            complete() {
              for (const observer of observers) {
                observer.complete?.();
              }
            }
          });
        }
        function resetIfNeeded() {
          if (refCount === 0 && subscription) {
            const _sub = subscription;
            subscription = null;
            _sub.unsubscribe();
          }
        }
        return {
          subscribe(observer) {
            refCount++;
            observers.push(observer);
            startIfNeeded();
            return {
              unsubscribe() {
                refCount--;
                resetIfNeeded();
                const index = observers.findIndex((v) => v === observer);
                if (index > -1) {
                  observers.splice(index, 1);
                }
              }
            };
          }
        };
      };
    }
    function map(project) {
      return (originalObserver) => {
        return {
          subscribe(observer) {
            let index = 0;
            const subscription = originalObserver.subscribe({
              next(value) {
                observer.next?.(project(value, index++));
              },
              error(error) {
                observer.error?.(error);
              },
              complete() {
                observer.complete?.();
              }
            });
            return subscription;
          }
        };
      };
    }
    function tap(observer) {
      return (originalObserver) => {
        return {
          subscribe(observer2) {
            return originalObserver.subscribe({
              next(v) {
                observer.next?.(v);
                observer2.next?.(v);
              },
              error(v) {
                observer.error?.(v);
                observer2.error?.(v);
              },
              complete() {
                observer.complete?.();
                observer2.complete?.();
              }
            });
          }
        };
      };
    }
    class ObservableAbortError extends Error {
      constructor(message) {
        super(message);
        this.name = "ObservableAbortError";
        Object.setPrototypeOf(this, ObservableAbortError.prototype);
      }
    }
    function observableToPromise(observable2) {
      let abort;
      const promise = new Promise((resolve, reject) => {
        let isDone = false;
        function onDone() {
          if (isDone) {
            return;
          }
          isDone = true;
          reject(new ObservableAbortError("This operation was aborted."));
          obs$.unsubscribe();
        }
        const obs$ = observable2.subscribe({
          next(data) {
            isDone = true;
            resolve(data);
            onDone();
          },
          error(data) {
            isDone = true;
            reject(data);
            onDone();
          },
          complete() {
            isDone = true;
            onDone();
          }
        });
        abort = onDone;
      });
      return {
        promise,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        abort
      };
    }
    observable.isObservable = observable$1.isObservable;
    observable.observable = observable$1.observable;
    observable.map = map;
    observable.observableToPromise = observableToPromise;
    observable.share = share;
    observable.tap = tap;
    return observable;
  }
  var shared = {};
  var transformTRPCResponseE65f34e9 = {};
  var hasRequiredTransformTRPCResponseE65f34e9;
  function requireTransformTRPCResponseE65f34e9() {
    if (hasRequiredTransformTRPCResponseE65f34e9) return transformTRPCResponseE65f34e9;
    hasRequiredTransformTRPCResponseE65f34e9 = 1;
    var index = requireIndex784ff647();
    var codes = requireCodes87f6824b();
    function getErrorShape(opts) {
      const { path, error, config } = opts;
      const { code } = opts.error;
      const shape = {
        message: error.message,
        code: codes.TRPC_ERROR_CODES_BY_KEY[code],
        data: {
          code,
          httpStatus: index.getHTTPStatusCodeFromError(error)
        }
      };
      if (config.isDev && typeof opts.error.stack === "string") {
        shape.data.stack = opts.error.stack;
      }
      if (typeof path === "string") {
        shape.data.path = path;
      }
      return config.errorFormatter({
        ...opts,
        shape
      });
    }
    function transformTRPCResponseItem(config, item) {
      if ("error" in item) {
        return {
          ...item,
          error: config.transformer.output.serialize(item.error)
        };
      }
      if ("data" in item.result) {
        return {
          ...item,
          result: {
            ...item.result,
            data: config.transformer.output.serialize(item.result.data)
          }
        };
      }
      return item;
    }
    function transformTRPCResponse(config, itemOrItems) {
      return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(config, item)) : transformTRPCResponseItem(config, itemOrItems);
    }
    transformTRPCResponseE65f34e9.getErrorShape = getErrorShape;
    transformTRPCResponseE65f34e9.transformTRPCResponse = transformTRPCResponse;
    return transformTRPCResponseE65f34e9;
  }
  var hasRequiredShared;
  function requireShared() {
    if (hasRequiredShared) return shared;
    hasRequiredShared = 1;
    Object.defineProperty(shared, "__esModule", { value: true });
    var index = requireIndex784ff647();
    var transformTRPCResponse = requireTransformTRPCResponseE65f34e9();
    var getCauseFromUnknown2 = requireGetCauseFromUnknownD535264a();
    requireCodes87f6824b();
    shared.createFlatProxy = index.createFlatProxy;
    shared.createRecursiveProxy = index.createRecursiveProxy;
    shared.getErrorShape = transformTRPCResponse.getErrorShape;
    shared.transformTRPCResponse = transformTRPCResponse.transformTRPCResponse;
    shared.getCauseFromUnknown = getCauseFromUnknown2.getCauseFromUnknown;
    return shared;
  }
  var trpcMessage = {};
  var hasRequiredTrpcMessage;
  function requireTrpcMessage() {
    if (hasRequiredTrpcMessage) return trpcMessage;
    hasRequiredTrpcMessage = 1;
    Object.defineProperty(trpcMessage, "__esModule", { value: true });
    trpcMessage.isTRPCRequestWithId = trpcMessage.isTRPCRequest = trpcMessage.isTRPCResponse = trpcMessage.isTRPCMessage = void 0;
    function isPlainObject2(obj) {
      return typeof obj === "object" && obj !== null && !Array.isArray(obj);
    }
    function isNullOrUndefined(x) {
      return x === null || x === void 0;
    }
    function isTRPCMessage(message) {
      return Boolean(isPlainObject2(message) && "trpc" in message && isPlainObject2(message.trpc));
    }
    trpcMessage.isTRPCMessage = isTRPCMessage;
    function isTRPCMessageWithId(message) {
      return isTRPCMessage(message) && "id" in message.trpc && !isNullOrUndefined(message.trpc.id);
    }
    function isTRPCResponse(message) {
      return isTRPCMessageWithId(message) && ("error" in message.trpc || "result" in message.trpc);
    }
    trpcMessage.isTRPCResponse = isTRPCResponse;
    function isTRPCRequest(message) {
      return isTRPCMessageWithId(message) && "method" in message.trpc;
    }
    trpcMessage.isTRPCRequest = isTRPCRequest;
    function isTRPCRequestWithId(message) {
      return isTRPCRequest(message) && isTRPCMessageWithId(message);
    }
    trpcMessage.isTRPCRequestWithId = isTRPCRequestWithId;
    return trpcMessage;
  }
  var errors = {};
  var hasRequiredErrors;
  function requireErrors() {
    if (hasRequiredErrors) return errors;
    hasRequiredErrors = 1;
    Object.defineProperty(errors, "__esModule", { value: true });
    errors.getErrorFromUnknown = void 0;
    const server_1 = requireDist();
    function getErrorFromUnknown(cause) {
      if (cause instanceof Error) {
        if (cause.name === "TRPCError") {
          return cause;
        }
        const error = new server_1.TRPCError({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
          cause
        });
        error.stack = cause.stack;
        return error;
      }
      return new server_1.TRPCError({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR"
      });
    }
    errors.getErrorFromUnknown = getErrorFromUnknown;
    return errors;
  }
  var hasRequiredChrome;
  function requireChrome() {
    if (hasRequiredChrome) return chrome;
    hasRequiredChrome = 1;
    Object.defineProperty(chrome, "__esModule", { value: true });
    chrome.createChromeHandler = void 0;
    const server_1 = requireDist();
    const observable_1 = requireObservable();
    const shared_1 = requireShared();
    const trpcMessage_1 = requireTrpcMessage();
    const errors_1 = requireErrors();
    const createChromeHandler = (opts) => {
      const { router, createContext, onError, chrome: chrome2 = commonjsGlobal.chrome } = opts;
      if (!chrome2) {
        console.warn("Skipping chrome handler creation: 'opts.chrome' not defined");
        return;
      }
      chrome2.runtime.onConnect.addListener((port) => {
        const { transformer } = router._def._config;
        const subscriptions = /* @__PURE__ */ new Map();
        const listeners = [];
        const cleanup = () => listeners.forEach((unsub) => unsub());
        port.onDisconnect.addListener(cleanup);
        listeners.push(() => port.onDisconnect.removeListener(cleanup));
        const onMessage = async (message) => {
          var _a;
          if (!port || !(0, trpcMessage_1.isTRPCRequestWithId)(message))
            return;
          const { trpc } = message;
          const sendResponse = (response) => {
            port.postMessage({
              trpc: Object.assign({ id: trpc.id, jsonrpc: trpc.jsonrpc }, response)
            });
          };
          if (trpc.method === "subscription.stop") {
            (_a = subscriptions.get(trpc.id)) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            subscriptions.delete(trpc.id);
            return sendResponse({ result: { type: "stopped" } });
          }
          const { method, params, id } = trpc;
          const ctx = await (createContext === null || createContext === void 0 ? void 0 : createContext({ req: port, res: void 0 }));
          const handleError = (cause) => {
            const error = (0, errors_1.getErrorFromUnknown)(cause);
            onError === null || onError === void 0 ? void 0 : onError({
              error,
              type: method,
              path: params.path,
              input: params.input,
              ctx,
              req: port
            });
            sendResponse({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              error: (0, shared_1.getErrorShape)({
                config: router._def._config,
                error,
                type: method,
                path: params.path,
                input: params.input,
                ctx
              })
            });
          };
          try {
            const input = transformer.input.deserialize(trpc.params.input);
            const caller = router.createCaller(ctx);
            const procedureFn = trpc.params.path.split(".").reduce((acc, segment) => acc[segment], caller);
            const result2 = await procedureFn(input);
            if (trpc.method !== "subscription") {
              return sendResponse({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                result: { type: "data", data: transformer.output.serialize(result2) }
              });
            }
            if (!(0, observable_1.isObservable)(result2)) {
              throw new server_1.TRPCError({
                message: `Subscription ${params.path} did not return an observable`,
                code: "INTERNAL_SERVER_ERROR"
              });
            }
            const subscription = result2.subscribe({
              next: (data) => {
                const serializedData = transformer.output.serialize(data);
                sendResponse({ result: { type: "data", data: serializedData } });
              },
              error: handleError,
              complete: () => sendResponse({ result: { type: "stopped" } })
            });
            if (subscriptions.has(id)) {
              subscription.unsubscribe();
              sendResponse({ result: { type: "stopped" } });
              throw new server_1.TRPCError({ message: `Duplicate id ${id}`, code: "BAD_REQUEST" });
            }
            listeners.push(() => subscription.unsubscribe());
            subscriptions.set(id, subscription);
            sendResponse({ result: { type: "started" } });
          } catch (cause) {
            handleError(cause);
          }
        };
        port.onMessage.addListener(onMessage);
        listeners.push(() => port.onMessage.removeListener(onMessage));
      });
    };
    chrome.createChromeHandler = createChromeHandler;
    return chrome;
  }
  var window$1 = {};
  var constants = {};
  var hasRequiredConstants;
  function requireConstants() {
    if (hasRequiredConstants) return constants;
    hasRequiredConstants = 1;
    Object.defineProperty(constants, "__esModule", { value: true });
    constants.TRPC_BROWSER_LOADED_EVENT = void 0;
    constants.TRPC_BROWSER_LOADED_EVENT = "TRPC_BROWSER::POPUP_LOADED";
    return constants;
  }
  var hasRequiredWindow;
  function requireWindow() {
    if (hasRequiredWindow) return window$1;
    hasRequiredWindow = 1;
    Object.defineProperty(window$1, "__esModule", { value: true });
    window$1.createWindowHandler = void 0;
    const server_1 = requireDist();
    const observable_1 = requireObservable();
    const shared_1 = requireShared();
    const constants_1 = requireConstants();
    const trpcMessage_1 = requireTrpcMessage();
    const errors_1 = requireErrors();
    const createWindowHandler = (opts) => {
      var _a, _b;
      const { router, createContext, onError, window: window2, postOrigin } = opts;
      if (!window2) {
        console.warn("Skipping window handler creation: 'opts.window' not defined");
        return;
      }
      const loadListener = (_b = (_a = opts.postWindow) !== null && _a !== void 0 ? _a : window2.opener) !== null && _b !== void 0 ? _b : window2;
      loadListener.postMessage(constants_1.TRPC_BROWSER_LOADED_EVENT, { targetOrigin: postOrigin });
      const { transformer } = router._def._config;
      const subscriptions = /* @__PURE__ */ new Map();
      const listeners = [];
      const cleanup = () => listeners.forEach((unsub) => unsub());
      window2.addEventListener("beforeunload", cleanup);
      listeners.push(() => window2.removeEventListener("beforeunload", cleanup));
      const onMessage = async (event) => {
        var _a2, _b2, _c;
        const { data: message, source } = event;
        const postWindow = (_b2 = (_a2 = opts.postWindow) !== null && _a2 !== void 0 ? _a2 : source) !== null && _b2 !== void 0 ? _b2 : window2;
        if (!postWindow || !(0, trpcMessage_1.isTRPCRequestWithId)(message))
          return;
        const { trpc } = message;
        const sendResponse = (response) => {
          postWindow.postMessage({
            trpc: Object.assign({ id: trpc.id, jsonrpc: trpc.jsonrpc }, response)
          }, { targetOrigin: postOrigin });
        };
        if (trpc.method === "subscription.stop") {
          (_c = subscriptions.get(trpc.id)) === null || _c === void 0 ? void 0 : _c.unsubscribe();
          subscriptions.delete(trpc.id);
          return sendResponse({ result: { type: "stopped" } });
        }
        const { method, params, id } = trpc;
        const ctx = await (createContext === null || createContext === void 0 ? void 0 : createContext({ req: { origin: event.origin }, res: void 0 }));
        const handleError = (cause) => {
          const error = (0, errors_1.getErrorFromUnknown)(cause);
          onError === null || onError === void 0 ? void 0 : onError({
            error,
            type: method,
            path: params.path,
            input: params.input,
            ctx,
            req: { origin: event.origin }
          });
          sendResponse({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error: (0, shared_1.getErrorShape)({
              config: router._def._config,
              error,
              type: method,
              path: params.path,
              input: params.input,
              ctx
            })
          });
        };
        try {
          const input = transformer.input.deserialize(trpc.params.input);
          const caller = router.createCaller(ctx);
          const procedureFn = trpc.params.path.split(".").reduce((acc, segment) => acc[segment], caller);
          const result2 = await procedureFn(input);
          if (trpc.method !== "subscription") {
            return sendResponse({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
              result: { type: "data", data: transformer.output.serialize(result2) }
            });
          }
          if (!(0, observable_1.isObservable)(result2)) {
            throw new server_1.TRPCError({
              message: `Subscription ${params.path} did not return an observable`,
              code: "INTERNAL_SERVER_ERROR"
            });
          }
          const subscription = result2.subscribe({
            next: (data) => {
              const serializedData = transformer.output.serialize(data);
              sendResponse({ result: { type: "data", data: serializedData } });
            },
            error: handleError,
            complete: () => sendResponse({ result: { type: "stopped" } })
          });
          if (subscriptions.has(id)) {
            subscription.unsubscribe();
            sendResponse({ result: { type: "stopped" } });
            throw new server_1.TRPCError({ message: `Duplicate id ${id}`, code: "BAD_REQUEST" });
          }
          listeners.push(() => subscription.unsubscribe());
          subscriptions.set(id, subscription);
          sendResponse({ result: { type: "started" } });
        } catch (cause) {
          handleError(cause);
        }
      };
      window2.addEventListener("message", onMessage);
      listeners.push(() => window2.removeEventListener("message", onMessage));
    };
    window$1.createWindowHandler = createWindowHandler;
    return window$1;
  }
  var hasRequiredAdapter;
  function requireAdapter() {
    if (hasRequiredAdapter) return adapter;
    hasRequiredAdapter = 1;
    (function(exports$1) {
      var __createBinding = adapter && adapter.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar = adapter && adapter.__exportStar || function(m, exports$12) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$12, p)) __createBinding(exports$12, m, p);
      };
      Object.defineProperty(exports$1, "__esModule", { value: true });
      __exportStar(requireChrome(), exports$1);
      __exportStar(requireWindow(), exports$1);
    })(adapter);
    return adapter;
  }
  var adapterExports = requireAdapter();
  function isObject(value) {
    return !!value && !Array.isArray(value) && typeof value === "object";
  }
  class UnknownCauseError extends Error {
  }
  function getCauseFromUnknown(cause) {
    if (cause instanceof Error) {
      return cause;
    }
    const type = typeof cause;
    if (type === "undefined" || type === "function" || cause === null) {
      return void 0;
    }
    if (type !== "object") {
      return new Error(String(cause));
    }
    if (isObject(cause)) {
      const err = new UnknownCauseError();
      for (const key in cause) {
        err[key] = cause[key];
      }
      return err;
    }
    return void 0;
  }
  function getTRPCErrorFromUnknown(cause) {
    if (cause instanceof TRPCError) {
      return cause;
    }
    if (cause instanceof Error && cause.name === "TRPCError") {
      return cause;
    }
    const trpcError = new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause
    });
    if (cause instanceof Error && cause.stack) {
      trpcError.stack = cause.stack;
    }
    return trpcError;
  }
  class TRPCError extends Error {
    constructor(opts) {
      const cause = getCauseFromUnknown(opts.cause);
      const message = opts.message ?? cause?.message ?? opts.code;
      super(message, {
        cause
      });
      this.code = opts.code;
      this.name = "TRPCError";
      if (!this.cause) {
        this.cause = cause;
      }
    }
  }
  function invert(obj) {
    const newObj = /* @__PURE__ */ Object.create(null);
    for (const key in obj) {
      const v = obj[key];
      newObj[v] = key;
    }
    return newObj;
  }
  const TRPC_ERROR_CODES_BY_KEY = {
    /**
    * Invalid JSON was received by the server.
    * An error occurred on the server while parsing the JSON text.
    */
    PARSE_ERROR: -32700,
    /**
    * The JSON sent is not a valid Request object.
    */
    BAD_REQUEST: -32600,
    // Internal JSON-RPC error
    INTERNAL_SERVER_ERROR: -32603,
    NOT_IMPLEMENTED: -32603,
    // Implementation specific errors
    UNAUTHORIZED: -32001,
    FORBIDDEN: -32003,
    NOT_FOUND: -32004,
    METHOD_NOT_SUPPORTED: -32005,
    TIMEOUT: -32008,
    CONFLICT: -32009,
    PRECONDITION_FAILED: -32012,
    PAYLOAD_TOO_LARGE: -32013,
    UNPROCESSABLE_CONTENT: -32022,
    TOO_MANY_REQUESTS: -32029,
    CLIENT_CLOSED_REQUEST: -32099
  };
  invert(TRPC_ERROR_CODES_BY_KEY);
  invert(TRPC_ERROR_CODES_BY_KEY);
  const JSONRPC2_TO_HTTP_CODE = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
  };
  function getStatusCodeFromKey(code) {
    return JSONRPC2_TO_HTTP_CODE[code] ?? 500;
  }
  function getHTTPStatusCodeFromError(error) {
    return getStatusCodeFromKey(error.code);
  }
  const noop = () => {
  };
  function createInnerProxy(callback, path) {
    const proxy = new Proxy(noop, {
      get(_obj, key) {
        if (typeof key !== "string" || key === "then") {
          return void 0;
        }
        return createInnerProxy(callback, [
          ...path,
          key
        ]);
      },
      apply(_1, _2, args) {
        const isApply = path[path.length - 1] === "apply";
        return callback({
          args: isApply ? args.length >= 2 ? args[1] : [] : args,
          path: isApply ? path.slice(0, -1) : path
        });
      }
    });
    return proxy;
  }
  const createRecursiveProxy = (callback) => createInnerProxy(callback, []);
  const createFlatProxy = (callback) => {
    return new Proxy(noop, {
      get(_obj, name) {
        if (typeof name !== "string" || name === "then") {
          return void 0;
        }
        return callback(name);
      }
    });
  };
  function getDataTransformer(transformer) {
    if ("input" in transformer) {
      return transformer;
    }
    return {
      input: transformer,
      output: transformer
    };
  }
  const defaultTransformer = {
    _default: true,
    input: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    },
    output: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    }
  };
  const defaultFormatter = ({ shape }) => {
    return shape;
  };
  function omitPrototype(obj) {
    return Object.assign(/* @__PURE__ */ Object.create(null), obj);
  }
  const procedureTypes = [
    "query",
    "mutation",
    "subscription"
  ];
  function isRouter(procedureOrRouter) {
    return "router" in procedureOrRouter._def;
  }
  const emptyRouter = {
    _ctx: null,
    _errorShape: null,
    _meta: null,
    queries: {},
    mutations: {},
    subscriptions: {},
    errorFormatter: defaultFormatter,
    transformer: defaultTransformer
  };
  const reservedWords = [
    /**
    * Then is a reserved word because otherwise we can't return a promise that returns a Proxy
    * since JS will think that `.then` is something that exists
    */
    "then"
  ];
  function createRouterFactory(config) {
    return function createRouterInner(procedures) {
      const reservedWordsUsed = new Set(Object.keys(procedures).filter((v) => reservedWords.includes(v)));
      if (reservedWordsUsed.size > 0) {
        throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
      }
      const routerProcedures = omitPrototype({});
      function recursiveGetPaths(procedures2, path = "") {
        for (const [key, procedureOrRouter] of Object.entries(procedures2 ?? {})) {
          const newPath = `${path}${key}`;
          if (isRouter(procedureOrRouter)) {
            recursiveGetPaths(procedureOrRouter._def.procedures, `${newPath}.`);
            continue;
          }
          if (routerProcedures[newPath]) {
            throw new Error(`Duplicate key: ${newPath}`);
          }
          routerProcedures[newPath] = procedureOrRouter;
        }
      }
      recursiveGetPaths(procedures);
      const _def = {
        _config: config,
        router: true,
        procedures: routerProcedures,
        ...emptyRouter,
        record: procedures,
        queries: Object.entries(routerProcedures).filter((pair) => pair[1]._def.query).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: val
        }), {}),
        mutations: Object.entries(routerProcedures).filter((pair) => pair[1]._def.mutation).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: val
        }), {}),
        subscriptions: Object.entries(routerProcedures).filter((pair) => pair[1]._def.subscription).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: val
        }), {})
      };
      const router = {
        ...procedures,
        _def,
        createCaller(ctx) {
          return createCallerFactory()(router)(ctx);
        },
        getErrorShape(opts) {
          const { path, error } = opts;
          const { code } = opts.error;
          const shape = {
            message: error.message,
            code: TRPC_ERROR_CODES_BY_KEY[code],
            data: {
              code,
              httpStatus: getHTTPStatusCodeFromError(error)
            }
          };
          if (config.isDev && typeof opts.error.stack === "string") {
            shape.data.stack = opts.error.stack;
          }
          if (typeof path === "string") {
            shape.data.path = path;
          }
          return this._def._config.errorFormatter({
            ...opts,
            shape
          });
        }
      };
      return router;
    };
  }
  function callProcedure(opts) {
    const { type, path } = opts;
    if (!(path in opts.procedures) || !opts.procedures[path]?._def[type]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `No "${type}"-procedure on path "${path}"`
      });
    }
    const procedure = opts.procedures[path];
    return procedure(opts);
  }
  function createCallerFactory() {
    return function createCallerInner(router) {
      const def = router._def;
      return function createCaller(ctx) {
        const proxy = createRecursiveProxy(({ path, args }) => {
          if (path.length === 1 && procedureTypes.includes(path[0])) {
            return callProcedure({
              procedures: def.procedures,
              path: args[0],
              rawInput: args[1],
              ctx,
              type: path[0]
            });
          }
          const fullPath = path.join(".");
          const procedure = def.procedures[fullPath];
          let type = "query";
          if (procedure._def.mutation) {
            type = "mutation";
          } else if (procedure._def.subscription) {
            type = "subscription";
          }
          return procedure({
            path: fullPath,
            rawInput: args[0],
            ctx,
            type
          });
        });
        return proxy;
      };
    };
  }
  const isServerDefault = typeof window === "undefined" || "Deno" in window || globalThis.process?.env?.NODE_ENV === "test" || !!globalThis.process?.env?.JEST_WORKER_ID || !!globalThis.process?.env?.VITEST_WORKER_ID;
  function getParseFn(procedureParser) {
    const parser = procedureParser;
    if (typeof parser === "function") {
      return parser;
    }
    if (typeof parser.parseAsync === "function") {
      return parser.parseAsync.bind(parser);
    }
    if (typeof parser.parse === "function") {
      return parser.parse.bind(parser);
    }
    if (typeof parser.validateSync === "function") {
      return parser.validateSync.bind(parser);
    }
    if (typeof parser.create === "function") {
      return parser.create.bind(parser);
    }
    if (typeof parser.assert === "function") {
      return (value) => {
        parser.assert(value);
        return value;
      };
    }
    throw new Error("Could not find a validator fn");
  }
  function mergeWithoutOverrides(obj1, ...objs) {
    const newObj = Object.assign(/* @__PURE__ */ Object.create(null), obj1);
    for (const overrides of objs) {
      for (const key in overrides) {
        if (key in newObj && newObj[key] !== overrides[key]) {
          throw new Error(`Duplicate key ${key}`);
        }
        newObj[key] = overrides[key];
      }
    }
    return newObj;
  }
  function createMiddlewareFactory() {
    function createMiddlewareInner(middlewares) {
      return {
        _middlewares: middlewares,
        unstable_pipe(middlewareBuilderOrFn) {
          const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
            middlewareBuilderOrFn
          ];
          return createMiddlewareInner([
            ...middlewares,
            ...pipedMiddleware
          ]);
        }
      };
    }
    function createMiddleware(fn) {
      return createMiddlewareInner([
        fn
      ]);
    }
    return createMiddleware;
  }
  function isPlainObject(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
  }
  function createInputMiddleware(parse) {
    const inputMiddleware = async ({ next, rawInput, input }) => {
      let parsedInput;
      try {
        parsedInput = await parse(rawInput);
      } catch (cause) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause
        });
      }
      const combinedInput = isPlainObject(input) && isPlainObject(parsedInput) ? {
        ...input,
        ...parsedInput
      } : parsedInput;
      return next({
        input: combinedInput
      });
    };
    inputMiddleware._type = "input";
    return inputMiddleware;
  }
  function createOutputMiddleware(parse) {
    const outputMiddleware = async ({ next }) => {
      const result2 = await next();
      if (!result2.ok) {
        return result2;
      }
      try {
        const data = await parse(result2.data);
        return {
          ...result2,
          data
        };
      } catch (cause) {
        throw new TRPCError({
          message: "Output validation failed",
          code: "INTERNAL_SERVER_ERROR",
          cause
        });
      }
    };
    outputMiddleware._type = "output";
    return outputMiddleware;
  }
  const middlewareMarker = "middlewareMarker";
  function createNewBuilder(def1, def2) {
    const { middlewares = [], inputs, meta, ...rest } = def2;
    return createBuilder({
      ...mergeWithoutOverrides(def1, rest),
      inputs: [
        ...def1.inputs,
        ...inputs ?? []
      ],
      middlewares: [
        ...def1.middlewares,
        ...middlewares
      ],
      meta: def1.meta && meta ? {
        ...def1.meta,
        ...meta
      } : meta ?? def1.meta
    });
  }
  function createBuilder(initDef = {}) {
    const _def = {
      inputs: [],
      middlewares: [],
      ...initDef
    };
    return {
      _def,
      input(input) {
        const parser = getParseFn(input);
        return createNewBuilder(_def, {
          inputs: [
            input
          ],
          middlewares: [
            createInputMiddleware(parser)
          ]
        });
      },
      output(output) {
        const parseOutput = getParseFn(output);
        return createNewBuilder(_def, {
          output,
          middlewares: [
            createOutputMiddleware(parseOutput)
          ]
        });
      },
      meta(meta) {
        return createNewBuilder(_def, {
          meta
        });
      },
      /**
      * @deprecated
      * This functionality is deprecated and will be removed in the next major version.
      */
      unstable_concat(builder) {
        return createNewBuilder(_def, builder._def);
      },
      use(middlewareBuilderOrFn) {
        const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
          middlewareBuilderOrFn
        ];
        return createNewBuilder(_def, {
          middlewares
        });
      },
      query(resolver) {
        return createResolver({
          ..._def,
          query: true
        }, resolver);
      },
      mutation(resolver) {
        return createResolver({
          ..._def,
          mutation: true
        }, resolver);
      },
      subscription(resolver) {
        return createResolver({
          ..._def,
          subscription: true
        }, resolver);
      }
    };
  }
  function createResolver(_def, resolver) {
    const finalBuilder = createNewBuilder(_def, {
      resolver,
      middlewares: [
        async function resolveMiddleware(opts) {
          const data = await resolver(opts);
          return {
            marker: middlewareMarker,
            ok: true,
            data,
            ctx: opts.ctx
          };
        }
      ]
    });
    return createProcedureCaller(finalBuilder._def);
  }
  const codeblock = `
This is a client-only function.
If you want to call this function on the server, see https://trpc.io/docs/server/server-side-calls
`.trim();
  function createProcedureCaller(_def) {
    const procedure = async function resolve(opts) {
      if (!opts || !("rawInput" in opts)) {
        throw new Error(codeblock);
      }
      const callRecursive = async (callOpts = {
        index: 0,
        ctx: opts.ctx
      }) => {
        try {
          const middleware = _def.middlewares[callOpts.index];
          const result22 = await middleware({
            ctx: callOpts.ctx,
            type: opts.type,
            path: opts.path,
            rawInput: callOpts.rawInput ?? opts.rawInput,
            meta: _def.meta,
            input: callOpts.input,
            next(_nextOpts) {
              const nextOpts = _nextOpts;
              return callRecursive({
                index: callOpts.index + 1,
                ctx: nextOpts && "ctx" in nextOpts ? {
                  ...callOpts.ctx,
                  ...nextOpts.ctx
                } : callOpts.ctx,
                input: nextOpts && "input" in nextOpts ? nextOpts.input : callOpts.input,
                rawInput: nextOpts && "rawInput" in nextOpts ? nextOpts.rawInput : callOpts.rawInput
              });
            }
          });
          return result22;
        } catch (cause) {
          return {
            ok: false,
            error: getTRPCErrorFromUnknown(cause),
            marker: middlewareMarker
          };
        }
      };
      const result2 = await callRecursive();
      if (!result2) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No result from middlewares - did you forget to `return next()`?"
        });
      }
      if (!result2.ok) {
        throw result2.error;
      }
      return result2.data;
    };
    procedure._def = _def;
    procedure.meta = _def.meta;
    return procedure;
  }
  function mergeRouters(...routerList) {
    const record = mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
    const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
      if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== defaultFormatter) {
        if (currentErrorFormatter !== defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
          throw new Error("You seem to have several error formatters");
        }
        return nextRouter._def._config.errorFormatter;
      }
      return currentErrorFormatter;
    }, defaultFormatter);
    const transformer = routerList.reduce((prev, current) => {
      if (current._def._config.transformer && current._def._config.transformer !== defaultTransformer) {
        if (prev !== defaultTransformer && prev !== current._def._config.transformer) {
          throw new Error("You seem to have several transformers");
        }
        return current._def._config.transformer;
      }
      return prev;
    }, defaultTransformer);
    const router2 = createRouterFactory({
      errorFormatter,
      transformer,
      isDev: routerList.some((r) => r._def._config.isDev),
      allowOutsideOfServer: routerList.some((r) => r._def._config.allowOutsideOfServer),
      isServer: routerList.some((r) => r._def._config.isServer),
      $types: routerList[0]?._def._config.$types
    })(record);
    return router2;
  }
  class TRPCBuilder {
    context() {
      return new TRPCBuilder();
    }
    meta() {
      return new TRPCBuilder();
    }
    create(options) {
      return createTRPCInner()(options);
    }
  }
  const initTRPC = new TRPCBuilder();
  function createTRPCInner() {
    return function initTRPCInner(runtime) {
      const errorFormatter = runtime?.errorFormatter ?? defaultFormatter;
      const transformer = getDataTransformer(runtime?.transformer ?? defaultTransformer);
      const config = {
        transformer,
        isDev: runtime?.isDev ?? globalThis.process?.env?.NODE_ENV !== "production",
        allowOutsideOfServer: runtime?.allowOutsideOfServer ?? false,
        errorFormatter,
        isServer: runtime?.isServer ?? isServerDefault,
        /**
        * @internal
        */
        $types: createFlatProxy((key) => {
          throw new Error(`Tried to access "$types.${key}" which is not available at runtime`);
        })
      };
      {
        const isServer = runtime?.isServer ?? isServerDefault;
        if (!isServer && runtime?.allowOutsideOfServer !== true) {
          throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
        }
      }
      return {
        /**
        * These are just types, they can't be used
        * @internal
        */
        _config: config,
        /**
        * Builder object for creating procedures
        * @see https://trpc.io/docs/server/procedures
        */
        procedure: createBuilder({
          meta: runtime?.defaultMeta
        }),
        /**
        * Create reusable middlewares
        * @see https://trpc.io/docs/server/middlewares
        */
        middleware: createMiddlewareFactory(),
        /**
        * Create a router
        * @see https://trpc.io/docs/server/routers
        */
        router: createRouterFactory(config),
        /**
        * Merge Routers
        * @see https://trpc.io/docs/server/merging-routers
        */
        mergeRouters,
        /**
        * Create a server-side caller for a router
        * @see https://trpc.io/docs/server/server-side-calls
        */
        createCallerFactory: createCallerFactory()
      };
    };
  }
  var util;
  (function(util2) {
    util2.assertEqual = (_) => {
    };
    function assertIs(_arg) {
    }
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error();
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = (items) => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = (obj) => {
      const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = (obj) => {
      return util2.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    };
    util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item))
          return item;
      }
      return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));
  var objectUtil;
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
        // second overwrites first
      };
    };
  })(objectUtil || (objectUtil = {}));
  const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  const getParsedType = (data) => {
    const t2 = typeof data;
    switch (t2) {
      case "undefined":
        return ZodParsedType.undefined;
      case "string":
        return ZodParsedType.string;
      case "number":
        return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
      case "boolean":
        return ZodParsedType.boolean;
      case "function":
        return ZodParsedType.function;
      case "bigint":
        return ZodParsedType.bigint;
      case "symbol":
        return ZodParsedType.symbol;
      case "object":
        if (Array.isArray(data)) {
          return ZodParsedType.array;
        }
        if (data === null) {
          return ZodParsedType.null;
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return ZodParsedType.promise;
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return ZodParsedType.map;
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return ZodParsedType.set;
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return ZodParsedType.date;
        }
        return ZodParsedType.object;
      default:
        return ZodParsedType.unknown;
    }
  };
  const ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  class ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      };
      this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || { _errors: [] };
              } else {
                curr[el] = curr[el] || { _errors: [] };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          const firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [];
          fieldErrors[firstEl].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  }
  ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
  };
  const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = "Required";
        } else {
          message = `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
        break;
      case ZodIssueCode.invalid_union:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = `Invalid function arguments`;
        break;
      case ZodIssueCode.invalid_return_type:
        message = `Invalid function return type`;
        break;
      case ZodIssueCode.invalid_date:
        message = `Invalid date`;
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("includes" in issue.validation) {
            message = `Invalid input: must include "${issue.validation.includes}"`;
            if (typeof issue.validation.position === "number") {
              message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
            }
          } else if ("startsWith" in issue.validation) {
            message = `Invalid input: must start with "${issue.validation.startsWith}"`;
          } else if ("endsWith" in issue.validation) {
            message = `Invalid input: must end with "${issue.validation.endsWith}"`;
          } else {
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== "regex") {
          message = `Invalid ${issue.validation}`;
        } else {
          message = "Invalid";
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "bigint")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.too_big:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "bigint")
          message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = `Intersection results could not be merged`;
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        message = _ctx.defaultError;
        util.assertNever(issue);
    }
    return { message };
  };
  let overrideErrorMap = errorMap;
  function getErrorMap() {
    return overrideErrorMap;
  }
  const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...issueData.path || []];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== void 0) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter((m) => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        // contextual error map is first priority
        ctx.schemaErrorMap,
        // then schema-bound map if available
        overrideMap,
        // then global override map
        overrideMap === errorMap ? void 0 : errorMap
        // then global default map
      ].filter((x) => !!x)
    });
    ctx.common.issues.push(issue);
  }
  class ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid")
        this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted")
        this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted")
          return INVALID;
        if (s.status === "dirty")
          status.dirty();
        arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if (key.status === "aborted")
          return INVALID;
        if (value.status === "aborted")
          return INVALID;
        if (key.status === "dirty")
          status.dirty();
        if (value.status === "dirty")
          status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return { status: status.value, value: finalObject };
    }
  }
  const INVALID = Object.freeze({
    status: "aborted"
  });
  const DIRTY = (value) => ({ status: "dirty", value });
  const OK = (value) => ({ status: "valid", value });
  const isAborted = (x) => x.status === "aborted";
  const isDirty = (x) => x.status === "dirty";
  const isValid = (x) => x.status === "valid";
  const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  var errorUtil;
  (function(errorUtil2) {
    errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
  })(errorUtil || (errorUtil = {}));
  class ParseInputLazyPath {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  }
  const handleResult = (ctx, result2) => {
    if (isValid(result2)) {
      return { success: true, data: result2.value };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error)
            return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      const { message } = params;
      if (iss.code === "invalid_enum_value") {
        return { message: message ?? ctx.defaultError };
      }
      if (typeof ctx.data === "undefined") {
        return { message: message ?? required_error ?? ctx.defaultError };
      }
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      return { message: message ?? invalid_type_error ?? ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }
  class ZodType {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result2 = this._parse(input);
      if (isAsync(result2)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result2;
    }
    _parseAsync(input) {
      const result2 = this._parse(input);
      return Promise.resolve(result2);
    }
    parse(data, params) {
      const result2 = this.safeParse(data, params);
      if (result2.success)
        return result2.data;
      throw result2.error;
    }
    safeParse(data, params) {
      const ctx = {
        common: {
          issues: [],
          async: params?.async ?? false,
          contextualErrorMap: params?.errorMap
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const result2 = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result2);
    }
    "~validate"(data) {
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result2 = this._parseSync({ data, path: [], parent: ctx });
          return isValid(result2) ? {
            value: result2.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if (err?.message?.toLowerCase()?.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({ data, path: [], parent: ctx }).then((result2) => isValid(result2) ? {
        value: result2.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result2 = await this.safeParseAsync(data, params);
      if (result2.success)
        return result2.data;
      throw result2.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params?.errorMap,
          async: true
        },
        path: params?.path || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result2 = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result2);
    }
    refine(check, message) {
      const getIssueProperties = (val) => {
        if (typeof message === "string" || typeof message === "undefined") {
          return { message };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result2 = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result2 instanceof Promise) {
          return result2.then((data) => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result2) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: (data) => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  }
  const cuidRegex = /^c[^\s-]{8,}$/i;
  const cuid2Regex = /^[0-9a-z]+$/;
  const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  const nanoidRegex = /^[a-z0-9_-]{21}$/i;
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  let emojiRegex;
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  const dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
      opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
      return false;
    try {
      const [header] = jwt.split(".");
      if (!header)
        return false;
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null)
        return false;
      if ("typ" in decoded && decoded?.typ !== "JWT")
        return false;
      if (!decoded.alg)
        return false;
      if (alg && decoded.alg !== alg)
        return false;
      return true;
    } catch {
      return false;
    }
  }
  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }
  class ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        offset: options?.offset ?? false,
        local: options?.local ?? false,
        ...errorUtil.errToObj(options?.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof options?.precision === "undefined" ? null : options?.precision,
        ...errorUtil.errToObj(options?.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options?.position,
        ...errorUtil.errToObj(options?.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodString.create = (params) => {
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  class ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  }
  ZodNumber.create = (params) => {
    return new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };
  class ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  }
  ZodBigInt.create = (params) => {
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: params?.coerce ?? false,
      ...processCreateParams(params)
    });
  };
  class ZodBoolean extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodBoolean.create = (params) => {
    return new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: params?.coerce || false,
      ...processCreateParams(params)
    });
  };
  class ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new ZodDate({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  }
  ZodDate.create = (params) => {
    return new ZodDate({
      checks: [],
      coerce: params?.coerce || false,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };
  class ZodSymbol extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodSymbol.create = (params) => {
    return new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };
  class ZodUndefined extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodUndefined.create = (params) => {
    return new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };
  class ZodNull extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodNull.create = (params) => {
    return new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };
  class ZodAny extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodAny.create = (params) => {
    return new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };
  class ZodUnknown extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  }
  ZodUnknown.create = (params) => {
    return new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };
  class ZodNever extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  }
  ZodNever.create = (params) => {
    return new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };
  class ZodVoid extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  }
  ZodVoid.create = (params) => {
    return new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };
  class ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result3) => {
          return ParseStatus.mergeArray(status, result3);
        });
      }
      const result2 = [...ctx.data].map((item, i) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result2);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodArray.create = (schema, params) => {
    return new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }
  class ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = { shape, keys };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const { status, ctx } = this._processInputParams(input);
      const { shape, keys: shapeKeys } = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") ;
        else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(
              new ParseInputLazyPath(ctx, value, ctx.path, key)
              //, ctx.child(key), value, getParsedType(value)
            ),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue, ctx) => {
            const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
            if (issue.code === "unrecognized_keys")
              return {
                message: errorUtil.errToObj(message).message ?? defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
      return new ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
      const merged = new ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
      return new ZodObject({
        ...this._def,
        catchall: index
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    /**
     * @deprecated
     */
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  }
  ZodObject.create = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  class ZodUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result2 of results) {
          if (result2.result.status === "valid") {
            return result2.result;
          }
        }
        for (const result2 of results) {
          if (result2.result.status === "dirty") {
            ctx.common.issues.push(...result2.ctx.common.issues);
            return result2.result;
          }
        }
        const unionErrors = results.map((result2) => new ZodError(result2.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = void 0;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result2 = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result2.status === "valid") {
            return result2;
          } else if (result2.status === "dirty" && !dirty) {
            dirty = { result: result2, ctx: childCtx };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map((issues2) => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  }
  ZodUnion.create = (types, params) => {
    return new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return { valid: true, data: a };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index = 0; index < a.length; index++) {
        const itemA = a[index];
        const itemB = b[index];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return { valid: true, data: a };
    } else {
      return { valid: false };
    }
  }
  class ZodIntersection extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async) {
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  }
  ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };
  class ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [...ctx.data].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema)
          return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x) => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new ZodTuple({
        ...this._def,
        rest
      });
    }
  }
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };
  class ZodMap extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [...ctx.data.entries()].map(([key, value], index) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
        };
      });
      if (ctx.common.async) {
        const finalMap = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        const finalMap = /* @__PURE__ */ new Map();
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  }
  ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };
  class ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = /* @__PURE__ */ new Set();
        for (const element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  }
  ZodSet.create = (valueType, params) => {
    return new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };
  class ZodLazy extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  }
  ZodLazy.create = (getter, params) => {
    return new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };
  class ZodLiteral extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  }
  ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }
  class ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  }
  ZodEnum.create = createZodEnum;
  class ZodNativeEnum extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  }
  ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };
  class ZodPromise extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  }
  ZodPromise.create = (schema, params) => {
    return new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };
  class ZodEffects extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: (arg) => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            const result2 = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result2.status === "aborted")
              return INVALID;
            if (result2.status === "dirty")
              return DIRTY(result2.value);
            if (status.value === "dirty")
              return DIRTY(result2.value);
            return result2;
          });
        } else {
          if (status.value === "aborted")
            return INVALID;
          const result2 = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result2.status === "aborted")
            return INVALID;
          if (result2.status === "dirty")
            return DIRTY(result2.value);
          if (status.value === "dirty")
            return DIRTY(result2.value);
          return result2;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = (acc) => {
          const result2 = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result2);
          }
          if (result2 instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          executeRefinement(inner.value);
          return { status: status.value, value: inner.value };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base))
            return INVALID;
          const result2 = effect.transform(base.value, checkCtx);
          if (result2 instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return { status: status.value, value: result2 };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
            if (!isValid(base))
              return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result2) => ({
              status: status.value,
              value: result2
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  }
  ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
      schema,
      effect: { type: "preprocess", transform: preprocess },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  class ZodOptional extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(void 0);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodOptional.create = (type, params) => {
    return new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };
  class ZodNullable extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodNullable.create = (type, params) => {
    return new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };
  class ZodDefault extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  }
  ZodDefault.create = (type, params) => {
    return new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };
  class ZodCatch extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result2 = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result2)) {
        return result2.then((result3) => {
          return {
            status: "valid",
            value: result3.status === "valid" ? result3.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  }
  ZodCatch.create = (type, params) => {
    return new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };
  class ZodNaN extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
  }
  ZodNaN.create = (params) => {
    return new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  class ZodBranded extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  }
  class ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  }
  class ZodReadonly extends ZodType {
    _parse(input) {
      const result2 = this._def.innerType._parse(input);
      const freeze = (data) => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result2) ? result2.then((data) => freeze(data)) : freeze(result2);
    }
    unwrap() {
      return this._def.innerType;
    }
  }
  ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  var ZodFirstPartyTypeKind;
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  const stringType = ZodString.create;
  const numberType = ZodNumber.create;
  const booleanType = ZodBoolean.create;
  ZodNever.create;
  const arrayType = ZodArray.create;
  const objectType = ZodObject.create;
  ZodUnion.create;
  ZodIntersection.create;
  ZodTuple.create;
  const enumType = ZodEnum.create;
  ZodPromise.create;
  ZodOptional.create;
  ZodNullable.create;
  function clickAction(payload) {
    const el = document.querySelector(payload.selector);
    if (!el) {
      return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
    }
    el.scrollIntoView({ block: "center", inline: "center", behavior: "auto" });
    el.click();
    return { ok: true, data: { selector: payload.selector } };
  }
  function snapshotAction(input) {
    const maxText = input.maxText ?? 1e4;
    const maxElements = input.maxElements ?? 150;
    const includeHidden = input.includeHidden ?? false;
    const includeHTML = input.includeHTML ?? false;
    const maxHTML = input.maxHTML ?? 2e4;
    const maxHTMLTokens = input.maxHTMLTokens ?? 0;
    const elements = collectElements(maxElements, includeHidden);
    const text = collectText(maxText);
    const fullText = document.body?.innerText ?? "";
    const normalizedFullText = fullText.replace(/\s+/g, " ").trim();
    const truncatedText = normalizedFullText.length > text.length;
    const totalActionables = document.querySelectorAll(
      'a,button,input,select,textarea,[role="button"],[role="link"]'
    ).length;
    const truncatedElements = totalActionables > elements.length;
    let html;
    let htmlLength;
    let truncatedHTML;
    let htmlEstimatedTokens;
    if (includeHTML) {
      const rawHTML = document.documentElement?.outerHTML || "";
      htmlLength = rawHTML.length;
      htmlEstimatedTokens = estimateTokens(rawHTML);
      let limitByTokens = maxHTML;
      if (maxHTMLTokens > 0) {
        limitByTokens = Math.min(limitByTokens, maxHTMLTokens * 4);
      }
      if (rawHTML.length > limitByTokens) {
        html = rawHTML.slice(0, limitByTokens) + "…";
        truncatedHTML = true;
      } else {
        html = rawHTML;
        truncatedHTML = false;
      }
    }
    return {
      url: window.location.href,
      title: document.title,
      text,
      html,
      elements,
      elementCount: totalActionables,
      textLength: normalizedFullText.length,
      truncatedText,
      truncatedElements,
      htmlLength,
      truncatedHTML,
      htmlEstimatedTokens
    };
  }
  function estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
  function scrollAction(payload) {
    const deltaX = payload.deltaX ?? 0;
    const deltaY = payload.deltaY ?? 0;
    const behavior = payload.behavior ?? "auto";
    const block = payload.block ?? "center";
    if (payload.selector) {
      const el = document.querySelector(payload.selector);
      if (!el) {
        return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
      }
      el.scrollIntoView({ block, inline: "center", behavior });
      if (typeof el.scrollBy === "function") {
        el.scrollBy(deltaX, deltaY);
      } else {
        window.scrollBy(deltaX, deltaY);
      }
      return { ok: true, data: { deltaX, deltaY, selector: payload.selector, behavior, block } };
    }
    window.scrollBy(deltaX, deltaY);
    return { ok: true, data: { deltaX, deltaY, behavior, block } };
  }
  function waitForSelectorAction(payload) {
    const selector = payload.selector;
    if (!selector) {
      return Promise.resolve({ ok: false, error: "selector is required", errorCode: "INVALID_INPUT" });
    }
    const timeoutMs = payload.timeoutMs ?? 5e3;
    if (document.querySelector(selector)) {
      return Promise.resolve({ ok: true, data: { selector, timeoutMs, found: true } });
    }
    return new Promise((resolve) => {
      let done = false;
      let timer;
      const finish = (value) => {
        if (done) return;
        done = true;
        if (timer) window.clearTimeout(timer);
        observer.disconnect();
        {
          resolve({ ok: true, data: { selector, timeoutMs, found: true } });
        }
      };
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          finish();
        }
      });
      observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
      timer = window.setTimeout(() => {
        resolve({
          ok: false,
          error: `Timed out waiting for selector: ${selector}`,
          errorCode: "TIMEOUT",
          data: { selector, timeoutMs, found: false }
        });
      }, timeoutMs);
    });
  }
  function navigateAction(payload) {
    if (!payload.url) {
      return { ok: false, error: "url is required", errorCode: "INVALID_INPUT" };
    }
    try {
      window.location.assign(payload.url);
      return { ok: true, data: { url: payload.url } };
    } catch (err) {
      return { ok: false, error: err?.message || "Navigation failed" };
    }
  }
  function backAction() {
    try {
      window.history.back();
      return { ok: true, data: { direction: "back" } };
    } catch (err) {
      return { ok: false, error: err?.message || "Back navigation failed" };
    }
  }
  function forwardAction() {
    try {
      window.history.forward();
      return { ok: true, data: { direction: "forward" } };
    } catch (err) {
      return { ok: false, error: err?.message || "Forward navigation failed" };
    }
  }
  function hoverAction(payload) {
    if (!payload.selector) {
      return { ok: false, error: "selector is required", errorCode: "INVALID_INPUT" };
    }
    const el = document.querySelector(payload.selector);
    if (!el) {
      return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
    }
    const rect = el.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;
    const eventInit = {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      view: window
    };
    el.dispatchEvent(new MouseEvent("mouseover", eventInit));
    el.dispatchEvent(new MouseEvent("mouseenter", eventInit));
    el.dispatchEvent(new MouseEvent("mousemove", eventInit));
    return { ok: true, data: { selector: payload.selector } };
  }
  function findAction(payload) {
    const query = payload.text?.trim();
    if (!query) {
      return { ok: false, error: "text is required" };
    }
    const raw = document.body?.innerText || document.body?.textContent || "";
    const hay = raw.replace(/\s+/g, " ").trim();
    const limit = Math.max(1, payload.limit ?? 50);
    const radius = Math.max(10, payload.radius ?? 40);
    const caseSensitive = payload.caseSensitive ?? false;
    if (!hay) {
      return { ok: true, data: { query, limit, radius, caseSensitive, total: 0, returned: 0, results: [] } };
    }
    const results = [];
    const sourceHay = caseSensitive ? hay : hay.toLowerCase();
    const sourceQuery = caseSensitive ? query : query.toLowerCase();
    let idx = 0;
    let count = 0;
    while ((idx = sourceHay.indexOf(sourceQuery, idx)) !== -1) {
      count += 1;
      const start = Math.max(0, idx - radius);
      const end = Math.min(hay.length, idx + query.length + radius);
      let snippet = hay.slice(start, end);
      if (start > 0) snippet = "…" + snippet;
      if (end < hay.length) snippet = snippet + "…";
      if (results.length < limit) {
        results.push({ index: idx, snippet });
      }
      idx = idx + sourceQuery.length;
    }
    return {
      ok: true,
      data: {
        query,
        limit,
        radius,
        caseSensitive,
        total: count,
        returned: results.length,
        results
      }
    };
  }
  function typeAction(payload) {
    const { selector, text, pressEnter } = payload;
    if (!selector) {
      return { ok: false, error: "selector is required", errorCode: "INVALID_INPUT" };
    }
    const el = document.querySelector(selector);
    if (!el) {
      return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
    }
    const input = el;
    if (typeof input.focus === "function") {
      input.focus();
    }
    if ("value" in input) {
      const proto = Object.getPrototypeOf(input);
      const valueSetter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
      if (valueSetter) {
        valueSetter.call(input, text);
      } else {
        input.value = text;
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      if (pressEnter) {
        const down = new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true });
        const up = new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true });
        input.dispatchEvent(down);
        input.dispatchEvent(up);
      }
      return { ok: true, data: { selector, textLength: text.length, pressEnter: !!pressEnter } };
    }
    return { ok: false, error: "Element is not a text input", errorCode: "INVALID_TARGET" };
  }
  function enterAction(payload) {
    const key = payload.key && payload.key.trim() ? payload.key : "Enter";
    let el = null;
    let usedActiveElement = false;
    if (payload.selector) {
      el = document.querySelector(payload.selector);
      if (!el) {
        return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
      }
    } else {
      el = document.activeElement;
      usedActiveElement = true;
      if (!el || el === document.body || el === document.documentElement) {
        return { ok: false, error: "No active element to send key", errorCode: "NO_ACTIVE_ELEMENT" };
      }
    }
    if (typeof el.focus === "function") {
      el.focus();
    }
    const down = new KeyboardEvent("keydown", { key, code: key, bubbles: true });
    const up = new KeyboardEvent("keyup", { key, code: key, bubbles: true });
    el.dispatchEvent(down);
    el.dispatchEvent(up);
    return { ok: true, data: { selector: payload.selector, key, usedActiveElement } };
  }
  function selectAction(payload) {
    if (!payload.selector) {
      return { ok: false, error: "selector is required", errorCode: "INVALID_INPUT" };
    }
    const el = document.querySelector(payload.selector);
    if (!el) {
      return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
    }
    if (el.tagName.toLowerCase() !== "select") {
      return { ok: false, error: "Element is not a select", errorCode: "INVALID_TARGET" };
    }
    const targets = resolveTargets(el, payload);
    if (!targets.ok) {
      return { ok: false, error: targets.error || "option not found", errorCode: "OPTION_NOT_FOUND" };
    }
    const { indices } = targets;
    if (el.multiple) {
      if (payload.toggle) {
        Array.from(el.options).forEach((opt, idx) => {
          if (indices.includes(idx)) {
            opt.selected = !opt.selected;
          }
        });
      } else {
        Array.from(el.options).forEach((opt, idx) => {
          opt.selected = indices.includes(idx);
        });
      }
    } else {
      const idx = indices[0];
      el.selectedIndex = idx;
      el.value = el.options[idx].value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    const selected = getSelected(el);
    const response = {
      selector: payload.selector,
      value: selected.values[0] ?? "",
      label: selected.labels[0],
      index: selected.indices[0],
      matchMode: payload.matchMode ?? "exact",
      toggle: payload.toggle ?? false,
      multiple: el.multiple,
      selectedCount: selected.indices.length
    };
    if (el.multiple) {
      response.values = selected.values;
      response.labels = selected.labels;
      response.indices = selected.indices;
    }
    return { ok: true, data: response };
  }
  async function screenshotPrepAction(payload) {
    const padding = payload.padding ?? 0;
    if (!payload.selector) {
      const width2 = Math.max(0, window.innerWidth);
      const height2 = Math.max(0, window.innerHeight);
      if (width2 === 0 || height2 === 0) {
        return { ok: false, error: "Viewport has zero size", errorCode: "INVALID_TARGET" };
      }
      return {
        ok: true,
        data: {
          selector: "viewport",
          rect: { x: 0, y: 0, width: width2, height: height2 },
          dpr: window.devicePixelRatio || 1
        }
      };
    }
    const el = document.querySelector(payload.selector);
    if (!el) {
      return { ok: false, error: "Element not found", errorCode: "ELEMENT_NOT_FOUND" };
    }
    el.scrollIntoView({ block: "center", inline: "center", behavior: "auto" });
    await new Promise((r) => setTimeout(r, 50));
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, rect.left - padding);
    const y = Math.max(0, rect.top - padding);
    const width = Math.max(0, rect.width + padding * 2);
    const height = Math.max(0, rect.height + padding * 2);
    if (width === 0 || height === 0) {
      return { ok: false, error: "Element has zero size", errorCode: "INVALID_TARGET" };
    }
    return {
      ok: true,
      data: {
        selector: payload.selector,
        rect: { x, y, width, height },
        dpr: window.devicePixelRatio || 1
      }
    };
  }
  function resolveTargets(el, payload) {
    const options = Array.from(el.options);
    let indices = [];
    const matchMode = payload.matchMode ?? "exact";
    if (payload.indices && payload.indices.length > 0) {
      indices = payload.indices.slice();
    } else if (payload.values && payload.values.length > 0) {
      indices = payload.values.map((val) => options.findIndex((opt) => opt.value === val)).filter((idx) => idx >= 0);
    } else if (payload.labels && payload.labels.length > 0) {
      const wanted = payload.labels.map((l) => l.toLowerCase());
      indices = wanted.map((lab) => findLabelIndex(options, lab, matchMode)).filter((idx) => idx >= 0);
    } else if (typeof payload.index === "number") {
      indices = [payload.index];
    } else if (payload.value) {
      const idx = options.findIndex((opt) => opt.value === payload.value);
      if (idx >= 0) indices = [idx];
    } else if (payload.label) {
      const lab = payload.label.toLowerCase();
      const idx = findLabelIndex(options, lab, matchMode);
      if (idx >= 0) indices = [idx];
    } else {
      return { ok: false, error: "value, label, or index is required", indices: [], values: [], labels: [] };
    }
    indices = indices.filter((idx, pos, arr) => idx >= 0 && idx < options.length && arr.indexOf(idx) === pos);
    if (indices.length == 0) {
      return { ok: false, error: "option not found", indices: [], values: [], labels: [] };
    }
    const values = indices.map((idx) => options[idx].value);
    const labels = indices.map((idx) => options[idx].text);
    return { ok: true, indices, values, labels };
  }
  function findLabelIndex(options, labelLower, matchMode) {
    if (matchMode === "partial") {
      return options.findIndex((opt) => opt.text.toLowerCase().includes(labelLower));
    }
    return options.findIndex((opt) => opt.text.toLowerCase() === labelLower);
  }
  function getSelected(el) {
    const values = [];
    const labels = [];
    const indices = [];
    Array.from(el.options).forEach((opt, idx) => {
      if (opt.selected) {
        values.push(opt.value);
        labels.push(opt.text);
        indices.push(idx);
      }
    });
    return { values, labels, indices };
  }
  function collectText(maxText) {
    const bodyText = document.body?.innerText ?? "";
    const compact = bodyText.replace(/\s+/g, " ").trim();
    if (compact.length > maxText) {
      return compact.slice(0, maxText);
    }
    return compact;
  }
  function collectElements(limit, includeHidden) {
    const nodes = Array.from(document.querySelectorAll(
      'a,button,input,select,textarea,[role="button"],[role="link"]'
    ));
    const results = [];
    for (const node of nodes) {
      if (results.length >= limit) break;
      if (!includeHidden && !isVisible(node)) continue;
      const el = node;
      results.push({
        tag: el.tagName.toLowerCase(),
        text: elementText(el),
        selector: selectorFor$1(el),
        href: el.href || void 0,
        inputType: el.type || void 0,
        name: el.name || el.getAttribute("name") || void 0,
        id: el.id || void 0,
        ariaLabel: el.getAttribute("aria-label") || void 0,
        title: el.getAttribute("title") || void 0,
        alt: el.alt || el.getAttribute("alt") || void 0,
        value: el.value || el.getAttribute("value") || void 0,
        placeholder: el.placeholder || el.getAttribute("placeholder") || void 0,
        context: siblingText(el, 80)
      });
    }
    return results;
  }
  function isVisible(el) {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }
  function elementText(el) {
    const text = el.innerText || el.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  }
  function siblingText(el, limit) {
    const parent = el.parentElement;
    if (!parent) return "";
    let text = "";
    for (const node of Array.from(parent.childNodes)) {
      if (node === el) continue;
      if (node.nodeType === Node.TEXT_NODE) {
        const t2 = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (t2) text += t2 + " ";
      }
    }
    text = text.trim();
    if (text.length > limit) return text.slice(0, limit);
    return text;
  }
  function selectorFor$1(el) {
    if (el.id) return `#${el.id}`;
    const dataTestId = el.getAttribute("data-testid");
    if (dataTestId) return `${el.tagName.toLowerCase()}[data-testid="${dataTestId}"]`;
    const dataAttr = firstDataAttr(el, ["data-test", "data-qa", "data-automation", "data-cy", "data-automation-id"]);
    if (dataAttr) return `${el.tagName.toLowerCase()}[${dataAttr.key}="${dataAttr.val}"]`;
    const name = el.getAttribute("name");
    if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;
    const aria = el.getAttribute("aria-label");
    if (aria) return `${el.tagName.toLowerCase()}[aria-label="${aria}"]`;
    const className = (el.className || "").toString().split(" ").filter(Boolean)[0];
    if (className) return `${el.tagName.toLowerCase()}.${className}`;
    const nth = nthChildIndex(el);
    if (nth > 0) return `${el.tagName.toLowerCase()}:nth-child(${nth})`;
    return el.tagName.toLowerCase();
  }
  function nthChildIndex(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    let idx = 0;
    for (const child of Array.from(parent.children)) {
      idx += 1;
      if (child === el) return idx;
    }
    return 0;
  }
  function firstDataAttr(el, keys) {
    for (const key of keys) {
      const val = el.getAttribute(key);
      if (val) return { key, val };
    }
    return null;
  }
  const t = initTRPC.create({
    isServer: false,
    allowOutsideOfServer: true
  });
  const contentRouter = t.router({
    ping: t.procedure.query(() => ({ ok: true })),
    click: t.procedure.input(objectType({ selector: stringType().min(1) })).mutation(({ input }) => clickAction(input)),
    scroll: t.procedure.input(objectType({
      deltaX: numberType().optional(),
      deltaY: numberType().optional(),
      selector: stringType().optional(),
      behavior: enumType(["auto", "smooth"]).optional(),
      block: enumType(["start", "center", "end", "nearest"]).optional()
    })).mutation(({ input }) => scrollAction(input)),
    waitForSelector: t.procedure.input(objectType({
      selector: stringType().min(1),
      timeoutMs: numberType().int().positive().optional()
    })).mutation(({ input }) => waitForSelectorAction(input)),
    navigate: t.procedure.input(objectType({
      url: stringType().min(1)
    })).mutation(({ input }) => navigateAction(input)),
    back: t.procedure.mutation(() => backAction()),
    forward: t.procedure.mutation(() => forwardAction()),
    hover: t.procedure.input(objectType({
      selector: stringType().min(1)
    })).mutation(({ input }) => hoverAction(input)),
    enter: t.procedure.input(objectType({
      selector: stringType().optional(),
      key: stringType().optional()
    })).mutation(({ input }) => enterAction(input)),
    select: t.procedure.input(objectType({
      selector: stringType().min(1),
      value: stringType().optional(),
      label: stringType().optional(),
      index: numberType().int().optional(),
      values: arrayType(stringType()).optional(),
      labels: arrayType(stringType()).optional(),
      indices: arrayType(numberType().int()).optional(),
      matchMode: enumType(["exact", "partial"]).optional(),
      toggle: booleanType().optional()
    })).mutation(({ input }) => selectAction(input)),
    screenshotPrep: t.procedure.input(objectType({
      selector: stringType().optional(),
      padding: numberType().int().optional(),
      format: enumType(["png", "jpeg"]).optional(),
      quality: numberType().optional(),
      maxWidth: numberType().int().positive().optional(),
      maxHeight: numberType().int().positive().optional()
    })).mutation(({ input }) => screenshotPrepAction(input)),
    find: t.procedure.input(objectType({
      text: stringType().min(1),
      limit: numberType().int().positive().optional(),
      radius: numberType().int().positive().optional(),
      caseSensitive: booleanType().optional()
    })).mutation(({ input }) => findAction(input)),
    type: t.procedure.input(objectType({
      selector: stringType().min(1),
      text: stringType(),
      pressEnter: booleanType().optional()
    })).mutation(({ input }) => typeAction(input)),
    snapshot: t.procedure.input(objectType({
      includeHidden: booleanType().optional(),
      maxElements: numberType().int().positive().optional(),
      maxText: numberType().int().positive().optional(),
      includeHTML: booleanType().optional(),
      maxHTML: numberType().int().positive().optional(),
      maxHTMLTokens: numberType().int().positive().optional()
    })).query(({ input }) => snapshotAction(input))
  });
  let recordingEnabled = false;
  let scrollTimer = null;
  let lastScrollY = 0;
  const inputTimers = /* @__PURE__ */ new WeakMap();
  const chromeApi = globalThis.chrome ?? browser;
  const definition = defineContentScript({
    matches: ["*://*/*"],
    main() {
      try {
        adapterExports.createChromeHandler({
          router: contentRouter,
          chrome: chromeApi
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!message.includes("not implemented")) {
          throw err;
        }
        console.warn("Skipping chrome handler creation: runtime onConnect not implemented");
      }
      chromeApi.runtime.onMessage.addListener((message) => {
        if (message?.type === "recording:set") {
          recordingEnabled = !!message.enabled;
        }
      });
      document.addEventListener("click", (event) => {
        if (!recordingEnabled) return;
        const target = event.target;
        if (!target) return;
        const selector = selectorFor(target);
        if (!selector) return;
        recordAction("click", { selector });
      }, true);
      document.addEventListener("input", (event) => {
        if (!recordingEnabled) return;
        const target = event.target;
        if (!target) return;
        if (!isTextInput(target)) return;
        const selector = selectorFor(target);
        if (!selector) return;
        const value = target.value ?? "";
        const existing = inputTimers.get(target);
        if (existing) window.clearTimeout(existing);
        const timer = window.setTimeout(() => {
          recordAction("type", { selector, text: value });
        }, 500);
        inputTimers.set(target, timer);
      }, true);
      document.addEventListener("change", (event) => {
        if (!recordingEnabled) return;
        const target = event.target;
        if (!target) return;
        if (isSelect(target)) {
          const selector = selectorFor(target);
          if (!selector) return;
          const select = target;
          const values = Array.from(select.selectedOptions).map((opt) => opt.value);
          recordAction("select", { selector, values });
        }
      }, true);
      document.addEventListener("keydown", (event) => {
        if (!recordingEnabled) return;
        if (event.key !== "Enter") return;
        const target = event.target;
        const selector = target ? selectorFor(target) : void 0;
        recordAction("enter", { selector, key: "Enter" });
      }, true);
      window.addEventListener("scroll", () => {
        if (!recordingEnabled) return;
        if (scrollTimer) window.clearTimeout(scrollTimer);
        const prevY = lastScrollY;
        scrollTimer = window.setTimeout(() => {
          const deltaY = window.scrollY - prevY;
          if (deltaY !== 0) {
            recordAction("scroll", { deltaY });
          }
          lastScrollY = window.scrollY;
        }, 300);
      }, { passive: true });
    }
  });
  function recordAction(type, payload) {
    chromeApi.runtime.sendMessage({
      type: "record_event",
      payload: {
        type,
        payload,
        timestamp: Date.now(),
        url: window.location.href,
        title: document.title
      }
    });
  }
  function isTextInput(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === "textarea") return true;
    if (tag !== "input") return false;
    const type = el.type?.toLowerCase() || "text";
    return ["text", "search", "email", "url", "password", "tel", "number"].includes(type);
  }
  function isSelect(el) {
    return el.tagName.toLowerCase() === "select";
  }
  function selectorFor(el) {
    if (el.id) return `#${el.id}`;
    const dataTestId = el.getAttribute("data-testid");
    if (dataTestId) return `${el.tagName.toLowerCase()}[data-testid="${dataTestId}"]`;
    const name = el.getAttribute("name");
    if (name) return `${el.tagName.toLowerCase()}[name="${name}"]`;
    const aria = el.getAttribute("aria-label");
    if (aria) return `${el.tagName.toLowerCase()}[aria-label="${aria}"]`;
    const className = (el.className || "").toString().split(" ").filter(Boolean)[0];
    if (className) return `${el.tagName.toLowerCase()}.${className}`;
    return el.tagName.toLowerCase();
  }
  function print$1(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger$1 = {
    debug: (...args) => print$1(console.debug, ...args),
    log: (...args) => print$1(console.log, ...args),
    warn: (...args) => print$1(console.warn, ...args),
    error: (...args) => print$1(console.error, ...args)
  };
  class WxtLocationChangeEvent extends Event {
    constructor(newUrl, oldUrl) {
      super(WxtLocationChangeEvent.EVENT_NAME, {});
      this.newUrl = newUrl;
      this.oldUrl = oldUrl;
    }
    static EVENT_NAME = getUniqueEventName("wxt:locationchange");
  }
  function getUniqueEventName(eventName) {
    return `${browser?.runtime?.id}:${"content"}:${eventName}`;
  }
  function createLocationWatcher(ctx) {
    let interval;
    let oldUrl;
    return {
      /**
       * Ensure the location watcher is actively looking for URL changes. If it's already watching,
       * this is a noop.
       */
      run() {
        if (interval != null) return;
        oldUrl = new URL(location.href);
        interval = ctx.setInterval(() => {
          let newUrl = new URL(location.href);
          if (newUrl.href !== oldUrl.href) {
            window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
            oldUrl = newUrl;
          }
        }, 1e3);
      }
    };
  }
  class ContentScriptContext {
    constructor(contentScriptName, options) {
      this.contentScriptName = contentScriptName;
      this.options = options;
      this.abortController = new AbortController();
      if (this.isTopFrame) {
        this.listenForNewerScripts({ ignoreFirstEvent: true });
        this.stopOldScripts();
      } else {
        this.listenForNewerScripts();
      }
    }
    static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName(
      "wxt:content-script-started"
    );
    isTopFrame = window.self === window.top;
    abortController;
    locationWatcher = createLocationWatcher(this);
    receivedMessageIds = /* @__PURE__ */ new Set();
    get signal() {
      return this.abortController.signal;
    }
    abort(reason) {
      return this.abortController.abort(reason);
    }
    get isInvalid() {
      if (browser.runtime.id == null) {
        this.notifyInvalidated();
      }
      return this.signal.aborted;
    }
    get isValid() {
      return !this.isInvalid;
    }
    /**
     * Add a listener that is called when the content script's context is invalidated.
     *
     * @returns A function to remove the listener.
     *
     * @example
     * browser.runtime.onMessage.addListener(cb);
     * const removeInvalidatedListener = ctx.onInvalidated(() => {
     *   browser.runtime.onMessage.removeListener(cb);
     * })
     * // ...
     * removeInvalidatedListener();
     */
    onInvalidated(cb) {
      this.signal.addEventListener("abort", cb);
      return () => this.signal.removeEventListener("abort", cb);
    }
    /**
     * Return a promise that never resolves. Useful if you have an async function that shouldn't run
     * after the context is expired.
     *
     * @example
     * const getValueFromStorage = async () => {
     *   if (ctx.isInvalid) return ctx.block();
     *
     *   // ...
     * }
     */
    block() {
      return new Promise(() => {
      });
    }
    /**
     * Wrapper around `window.setInterval` that automatically clears the interval when invalidated.
     *
     * Intervals can be cleared by calling the normal `clearInterval` function.
     */
    setInterval(handler, timeout) {
      const id = setInterval(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearInterval(id));
      return id;
    }
    /**
     * Wrapper around `window.setTimeout` that automatically clears the interval when invalidated.
     *
     * Timeouts can be cleared by calling the normal `setTimeout` function.
     */
    setTimeout(handler, timeout) {
      const id = setTimeout(() => {
        if (this.isValid) handler();
      }, timeout);
      this.onInvalidated(() => clearTimeout(id));
      return id;
    }
    /**
     * Wrapper around `window.requestAnimationFrame` that automatically cancels the request when
     * invalidated.
     *
     * Callbacks can be canceled by calling the normal `cancelAnimationFrame` function.
     */
    requestAnimationFrame(callback) {
      const id = requestAnimationFrame((...args) => {
        if (this.isValid) callback(...args);
      });
      this.onInvalidated(() => cancelAnimationFrame(id));
      return id;
    }
    /**
     * Wrapper around `window.requestIdleCallback` that automatically cancels the request when
     * invalidated.
     *
     * Callbacks can be canceled by calling the normal `cancelIdleCallback` function.
     */
    requestIdleCallback(callback, options) {
      const id = requestIdleCallback((...args) => {
        if (!this.signal.aborted) callback(...args);
      }, options);
      this.onInvalidated(() => cancelIdleCallback(id));
      return id;
    }
    addEventListener(target, type, handler, options) {
      if (type === "wxt:locationchange") {
        if (this.isValid) this.locationWatcher.run();
      }
      target.addEventListener?.(
        type.startsWith("wxt:") ? getUniqueEventName(type) : type,
        handler,
        {
          ...options,
          signal: this.signal
        }
      );
    }
    /**
     * @internal
     * Abort the abort controller and execute all `onInvalidated` listeners.
     */
    notifyInvalidated() {
      this.abort("Content script context invalidated");
      logger$1.debug(
        `Content script "${this.contentScriptName}" context invalidated`
      );
    }
    stopOldScripts() {
      window.postMessage(
        {
          type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
          contentScriptName: this.contentScriptName,
          messageId: Math.random().toString(36).slice(2)
        },
        "*"
      );
    }
    verifyScriptStartedEvent(event) {
      const isScriptStartedEvent = event.data?.type === ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE;
      const isSameContentScript = event.data?.contentScriptName === this.contentScriptName;
      const isNotDuplicate = !this.receivedMessageIds.has(event.data?.messageId);
      return isScriptStartedEvent && isSameContentScript && isNotDuplicate;
    }
    listenForNewerScripts(options) {
      let isFirst = true;
      const cb = (event) => {
        if (this.verifyScriptStartedEvent(event)) {
          this.receivedMessageIds.add(event.data.messageId);
          const wasFirst = isFirst;
          isFirst = false;
          if (wasFirst && options?.ignoreFirstEvent) return;
          this.notifyInvalidated();
        }
      };
      addEventListener("message", cb);
      this.onInvalidated(() => removeEventListener("message", cb));
    }
  }
  function initPlugins() {
  }
  function print(method, ...args) {
    if (typeof args[0] === "string") {
      const message = args.shift();
      method(`[wxt] ${message}`, ...args);
    } else {
      method("[wxt]", ...args);
    }
  }
  const logger = {
    debug: (...args) => print(console.debug, ...args),
    log: (...args) => print(console.log, ...args),
    warn: (...args) => print(console.warn, ...args),
    error: (...args) => print(console.error, ...args)
  };
  const result = (async () => {
    try {
      initPlugins();
      const { main, ...options } = definition;
      const ctx = new ContentScriptContext("content", options);
      return await main(ctx);
    } catch (err) {
      logger.error(
        `The content script "${"content"}" crashed on startup!`,
        err
      );
      throw err;
    }
  })();
  return result;
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B3eHQtZGV2K2Jyb3dzZXJAMC4xLjMyL25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMTNfQHR5cGVzK25vZGVAMjUuMC4xMF9qaXRpQDEuMjEuN19yb2xsdXBANC41Ni4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4xM19AdHlwZXMrbm9kZUAyNS4wLjEwX2ppdGlAMS4yMS43X3JvbGx1cEA0LjU2LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L2dldENhdXNlRnJvbVVua25vd24tZDUzNTI2NGEuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L1RSUENFcnJvci1jYTM3YmYxYS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AdHJwYytzZXJ2ZXJAMTAuNDUuNC9ub2RlX21vZHVsZXMvQHRycGMvc2VydmVyL2Rpc3QvY29kZXMtODdmNjgyNGIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L2luZGV4LTc4NGZmNjQ3LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC9jb25maWctMTk0YmRkNDMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC9vYnNlcnZhYmxlLTQ2NDExNmFjLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC9vYnNlcnZhYmxlL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC90cmFuc2Zvcm1UUlBDUmVzcG9uc2UtZTY1ZjM0ZTkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L3NoYXJlZC9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS90cnBjLWJyb3dzZXJAMS40LjRfQHRycGMrY2xpZW50QDEwLjQ1LjRfQHRycGMrc2VydmVyQDEwLjQ1LjRfX0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy90cnBjLWJyb3dzZXIvc2hhcmVkL3RycGNNZXNzYWdlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3RycGMtYnJvd3NlckAxLjQuNF9AdHJwYytjbGllbnRAMTAuNDUuNF9AdHJwYytzZXJ2ZXJAMTAuNDUuNF9fQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL3RycGMtYnJvd3Nlci9hZGFwdGVyL2Vycm9ycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS90cnBjLWJyb3dzZXJAMS40LjRfQHRycGMrY2xpZW50QDEwLjQ1LjRfQHRycGMrc2VydmVyQDEwLjQ1LjRfX0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy90cnBjLWJyb3dzZXIvYWRhcHRlci9jaHJvbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vdHJwYy1icm93c2VyQDEuNC40X0B0cnBjK2NsaWVudEAxMC40NS40X0B0cnBjK3NlcnZlckAxMC40NS40X19AdHJwYytzZXJ2ZXJAMTAuNDUuNC9ub2RlX21vZHVsZXMvdHJwYy1icm93c2VyL3NoYXJlZC9jb25zdGFudHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vdHJwYy1icm93c2VyQDEuNC40X0B0cnBjK2NsaWVudEAxMC40NS40X0B0cnBjK3NlcnZlckAxMC40NS40X19AdHJwYytzZXJ2ZXJAMTAuNDUuNC9ub2RlX21vZHVsZXMvdHJwYy1icm93c2VyL2FkYXB0ZXIvd2luZG93LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3RycGMtYnJvd3NlckAxLjQuNF9AdHJwYytjbGllbnRAMTAuNDUuNF9AdHJwYytzZXJ2ZXJAMTAuNDUuNF9fQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL3RycGMtYnJvd3Nlci9hZGFwdGVyL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC9nZXRDYXVzZUZyb21Vbmtub3duLTJkNjY0MTRhLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AdHJwYytzZXJ2ZXJAMTAuNDUuNC9ub2RlX21vZHVsZXMvQHRycGMvc2VydmVyL2Rpc3QvVFJQQ0Vycm9yLTk4ZDQ0NzU4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AdHJwYytzZXJ2ZXJAMTAuNDUuNC9ub2RlX21vZHVsZXMvQHRycGMvc2VydmVyL2Rpc3QvY29kZXMtYzkyNGMzZGIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0B0cnBjK3NlcnZlckAxMC40NS40L25vZGVfbW9kdWxlcy9AdHJwYy9zZXJ2ZXIvZGlzdC9pbmRleC1mOTFkNzIwYy5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L2NvbmZpZy1kNWZkYmQzOS5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vQHRycGMrc2VydmVyQDEwLjQ1LjQvbm9kZV9tb2R1bGVzL0B0cnBjL3NlcnZlci9kaXN0L2luZGV4Lm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL2hlbHBlcnMvdXRpbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL1pvZEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvbG9jYWxlcy9lbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL2Vycm9ycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS96b2RAMy4yNS43Ni9ub2RlX21vZHVsZXMvem9kL3YzL2hlbHBlcnMvcGFyc2VVdGlsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3pvZEAzLjI1Ljc2L25vZGVfbW9kdWxlcy96b2QvdjMvaGVscGVycy9lcnJvclV0aWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vem9kQDMuMjUuNzYvbm9kZV9tb2R1bGVzL3pvZC92My90eXBlcy5qcyIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL3NoYXJlZC9jb250ZW50QWN0aW9ucy50cyIsIi4uLy4uLy4uL2VudHJ5cG9pbnRzL3NoYXJlZC9jb250ZW50Um91dGVyLnRzIiwiLi4vLi4vLi4vZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4xM19AdHlwZXMrbm9kZUAyNS4wLjEwX2ppdGlAMS4yMS43X3JvbGx1cEA0LjU2LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvZ2dlci5tanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vd3h0QDAuMjAuMTNfQHR5cGVzK25vZGVAMjUuMC4xMF9qaXRpQDEuMjEuN19yb2xsdXBANC41Ni4wL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS93eHRAMC4yMC4xM19AdHlwZXMrbm9kZUAyNS4wLjEwX2ppdGlAMS4yMS43X3JvbGx1cEA0LjU2LjAvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3d4dEAwLjIwLjEzX0B0eXBlcytub2RlQDI1LjAuMTBfaml0aUAxLjIxLjdfcm9sbHVwQDQuNTYuMC9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBfYnJvd3NlciB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IF9icm93c2VyO1xuZXhwb3J0IHt9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuICByZXR1cm4gZGVmaW5pdGlvbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgIC8vIGNoZWNrIHRoYXQgdmFsdWUgaXMgb2JqZWN0XG4gICAgcmV0dXJuICEhdmFsdWUgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5cbmNsYXNzIFVua25vd25DYXVzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuZnVuY3Rpb24gZ2V0Q2F1c2VGcm9tVW5rbm93bihjYXVzZSkge1xuICAgIGlmIChjYXVzZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHJldHVybiBjYXVzZTtcbiAgICB9XG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBjYXVzZTtcbiAgICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCBjYXVzZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBQcmltaXRpdmUgdHlwZXMganVzdCBnZXQgd3JhcHBlZCBpbiBhbiBlcnJvclxuICAgIGlmICh0eXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKFN0cmluZyhjYXVzZSkpO1xuICAgIH1cbiAgICAvLyBJZiBpdCdzIGFuIG9iamVjdCwgd2UnbGwgY3JlYXRlIGEgc3ludGhldGljIGVycm9yXG4gICAgaWYgKGlzT2JqZWN0KGNhdXNlKSkge1xuICAgICAgICBjb25zdCBlcnIgPSBuZXcgVW5rbm93bkNhdXNlRXJyb3IoKTtcbiAgICAgICAgZm9yKGNvbnN0IGtleSBpbiBjYXVzZSl7XG4gICAgICAgICAgICBlcnJba2V5XSA9IGNhdXNlW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVycjtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0cy5nZXRDYXVzZUZyb21Vbmtub3duID0gZ2V0Q2F1c2VGcm9tVW5rbm93bjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldENhdXNlRnJvbVVua25vd24gPSByZXF1aXJlKCcuL2dldENhdXNlRnJvbVVua25vd24tZDUzNTI2NGEuanMnKTtcblxuZnVuY3Rpb24gZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24oY2F1c2UpIHtcbiAgICBpZiAoY2F1c2UgaW5zdGFuY2VvZiBUUlBDRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNhdXNlO1xuICAgIH1cbiAgICBpZiAoY2F1c2UgaW5zdGFuY2VvZiBFcnJvciAmJiBjYXVzZS5uYW1lID09PSAnVFJQQ0Vycm9yJykge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdHJwYy90cnBjL3B1bGwvNDg0OFxuICAgICAgICByZXR1cm4gY2F1c2U7XG4gICAgfVxuICAgIGNvbnN0IHRycGNFcnJvciA9IG5ldyBUUlBDRXJyb3Ioe1xuICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICAgICAgY2F1c2VcbiAgICB9KTtcbiAgICAvLyBJbmhlcml0IHN0YWNrIGZyb20gZXJyb3JcbiAgICBpZiAoY2F1c2UgaW5zdGFuY2VvZiBFcnJvciAmJiBjYXVzZS5zdGFjaykge1xuICAgICAgICB0cnBjRXJyb3Iuc3RhY2sgPSBjYXVzZS5zdGFjaztcbiAgICB9XG4gICAgcmV0dXJuIHRycGNFcnJvcjtcbn1cbmNsYXNzIFRSUENFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKXtcbiAgICAgICAgY29uc3QgY2F1c2UgPSBnZXRDYXVzZUZyb21Vbmtub3duLmdldENhdXNlRnJvbVVua25vd24ob3B0cy5jYXVzZSk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvcHRzLm1lc3NhZ2UgPz8gY2F1c2U/Lm1lc3NhZ2UgPz8gb3B0cy5jb2RlO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10cy1jb21tZW50XG4gICAgICAgIC8vIEB0cy1pZ25vcmUgaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZXJyb3ItY2F1c2VcbiAgICAgICAgc3VwZXIobWVzc2FnZSwge1xuICAgICAgICAgICAgY2F1c2VcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29kZSA9IG9wdHMuY29kZTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ1RSUENFcnJvcic7XG4gICAgICAgIGlmICghdGhpcy5jYXVzZSkge1xuICAgICAgICAgICAgLy8gPCBFUzIwMjIgLyA8IE5vZGUgMTYuOS4wIGNvbXBhdGFiaWxpdHlcbiAgICAgICAgICAgIHRoaXMuY2F1c2UgPSBjYXVzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0cy5UUlBDRXJyb3IgPSBUUlBDRXJyb3I7XG5leHBvcnRzLmdldFRSUENFcnJvckZyb21Vbmtub3duID0gZ2V0VFJQQ0Vycm9yRnJvbVVua25vd247XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGludGVybmFsXG4gKi8gZnVuY3Rpb24gaW52ZXJ0KG9iaikge1xuICAgIGNvbnN0IG5ld09iaiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZm9yKGNvbnN0IGtleSBpbiBvYmope1xuICAgICAgICBjb25zdCB2ID0gb2JqW2tleV07XG4gICAgICAgIG5ld09ialt2XSA9IGtleTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld09iajtcbn1cblxuLy8gcmVmZXJlbmNlOiBodHRwczovL3d3dy5qc29ucnBjLm9yZy9zcGVjaWZpY2F0aW9uXG4vKipcbiAqIEpTT04tUlBDIDIuMCBFcnJvciBjb2Rlc1xuICpcbiAqIGAtMzIwMDBgIHRvIGAtMzIwOTlgIGFyZSByZXNlcnZlZCBmb3IgaW1wbGVtZW50YXRpb24tZGVmaW5lZCBzZXJ2ZXItZXJyb3JzLlxuICogRm9yIHRSUEMgd2UncmUgY29weWluZyB0aGUgbGFzdCBkaWdpdHMgb2YgSFRUUCA0WFggZXJyb3JzLlxuICovIGNvbnN0IFRSUENfRVJST1JfQ09ERVNfQllfS0VZID0ge1xuICAgIC8qKlxuICAgKiBJbnZhbGlkIEpTT04gd2FzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEFuIGVycm9yIG9jY3VycmVkIG9uIHRoZSBzZXJ2ZXIgd2hpbGUgcGFyc2luZyB0aGUgSlNPTiB0ZXh0LlxuICAgKi8gUEFSU0VfRVJST1I6IC0zMjcwMCxcbiAgICAvKipcbiAgICogVGhlIEpTT04gc2VudCBpcyBub3QgYSB2YWxpZCBSZXF1ZXN0IG9iamVjdC5cbiAgICovIEJBRF9SRVFVRVNUOiAtMzI2MDAsXG4gICAgLy8gSW50ZXJuYWwgSlNPTi1SUEMgZXJyb3JcbiAgICBJTlRFUk5BTF9TRVJWRVJfRVJST1I6IC0zMjYwMyxcbiAgICBOT1RfSU1QTEVNRU5URUQ6IC0zMjYwMyxcbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBzcGVjaWZpYyBlcnJvcnNcbiAgICBVTkFVVEhPUklaRUQ6IC0zMjAwMSxcbiAgICBGT1JCSURERU46IC0zMjAwMyxcbiAgICBOT1RfRk9VTkQ6IC0zMjAwNCxcbiAgICBNRVRIT0RfTk9UX1NVUFBPUlRFRDogLTMyMDA1LFxuICAgIFRJTUVPVVQ6IC0zMjAwOCxcbiAgICBDT05GTElDVDogLTMyMDA5LFxuICAgIFBSRUNPTkRJVElPTl9GQUlMRUQ6IC0zMjAxMixcbiAgICBQQVlMT0FEX1RPT19MQVJHRTogLTMyMDEzLFxuICAgIFVOUFJPQ0VTU0FCTEVfQ09OVEVOVDogLTMyMDIyLFxuICAgIFRPT19NQU5ZX1JFUVVFU1RTOiAtMzIwMjksXG4gICAgQ0xJRU5UX0NMT1NFRF9SRVFVRVNUOiAtMzIwOTlcbn07XG5jb25zdCBUUlBDX0VSUk9SX0NPREVTX0JZX05VTUJFUiA9IGludmVydChUUlBDX0VSUk9SX0NPREVTX0JZX0tFWSk7XG5cbmV4cG9ydHMuVFJQQ19FUlJPUl9DT0RFU19CWV9LRVkgPSBUUlBDX0VSUk9SX0NPREVTX0JZX0tFWTtcbmV4cG9ydHMuVFJQQ19FUlJPUl9DT0RFU19CWV9OVU1CRVIgPSBUUlBDX0VSUk9SX0NPREVTX0JZX05VTUJFUjtcbmV4cG9ydHMuaW52ZXJ0ID0gaW52ZXJ0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY29kZXMgPSByZXF1aXJlKCcuL2NvZGVzLTg3ZjY4MjRiLmpzJyk7XG5cbmNvbnN0IFRSUENfRVJST1JfQ09ERVNfQllfTlVNQkVSID0gY29kZXMuaW52ZXJ0KGNvZGVzLlRSUENfRVJST1JfQ09ERVNfQllfS0VZKTtcbmNvbnN0IEpTT05SUEMyX1RPX0hUVFBfQ09ERSA9IHtcbiAgICBQQVJTRV9FUlJPUjogNDAwLFxuICAgIEJBRF9SRVFVRVNUOiA0MDAsXG4gICAgVU5BVVRIT1JJWkVEOiA0MDEsXG4gICAgTk9UX0ZPVU5EOiA0MDQsXG4gICAgRk9SQklEREVOOiA0MDMsXG4gICAgTUVUSE9EX05PVF9TVVBQT1JURUQ6IDQwNSxcbiAgICBUSU1FT1VUOiA0MDgsXG4gICAgQ09ORkxJQ1Q6IDQwOSxcbiAgICBQUkVDT05ESVRJT05fRkFJTEVEOiA0MTIsXG4gICAgUEFZTE9BRF9UT09fTEFSR0U6IDQxMyxcbiAgICBVTlBST0NFU1NBQkxFX0NPTlRFTlQ6IDQyMixcbiAgICBUT09fTUFOWV9SRVFVRVNUUzogNDI5LFxuICAgIENMSUVOVF9DTE9TRURfUkVRVUVTVDogNDk5LFxuICAgIElOVEVSTkFMX1NFUlZFUl9FUlJPUjogNTAwLFxuICAgIE5PVF9JTVBMRU1FTlRFRDogNTAxXG59O1xuZnVuY3Rpb24gZ2V0U3RhdHVzQ29kZUZyb21LZXkoY29kZSkge1xuICAgIHJldHVybiBKU09OUlBDMl9UT19IVFRQX0NPREVbY29kZV0gPz8gNTAwO1xufVxuZnVuY3Rpb24gZ2V0SFRUUFN0YXR1c0NvZGUoanNvbikge1xuICAgIGNvbnN0IGFyciA9IEFycmF5LmlzQXJyYXkoanNvbikgPyBqc29uIDogW1xuICAgICAgICBqc29uXG4gICAgXTtcbiAgICBjb25zdCBodHRwU3RhdHVzZXMgPSBuZXcgU2V0KGFyci5tYXAoKHJlcyk9PntcbiAgICAgICAgaWYgKCdlcnJvcicgaW4gcmVzKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzLmVycm9yLmRhdGE7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEuaHR0cFN0YXR1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YS5odHRwU3RhdHVzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY29kZSA9IFRSUENfRVJST1JfQ09ERVNfQllfTlVNQkVSW3Jlcy5lcnJvci5jb2RlXTtcbiAgICAgICAgICAgIHJldHVybiBnZXRTdGF0dXNDb2RlRnJvbUtleShjb2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMjAwO1xuICAgIH0pKTtcbiAgICBpZiAoaHR0cFN0YXR1c2VzLnNpemUgIT09IDEpIHtcbiAgICAgICAgcmV0dXJuIDIwNztcbiAgICB9XG4gICAgY29uc3QgaHR0cFN0YXR1cyA9IGh0dHBTdGF0dXNlcy52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XG4gICAgcmV0dXJuIGh0dHBTdGF0dXM7XG59XG5mdW5jdGlvbiBnZXRIVFRQU3RhdHVzQ29kZUZyb21FcnJvcihlcnJvcikge1xuICAgIHJldHVybiBnZXRTdGF0dXNDb2RlRnJvbUtleShlcnJvci5jb2RlKTtcbn1cblxuY29uc3Qgbm9vcCA9ICgpPT57XG4vLyBub29wXG59O1xuZnVuY3Rpb24gY3JlYXRlSW5uZXJQcm94eShjYWxsYmFjaywgcGF0aCkge1xuICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KG5vb3AsIHtcbiAgICAgICAgZ2V0IChfb2JqLCBrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyB8fCBrZXkgPT09ICd0aGVuJykge1xuICAgICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZSBmb3IgaWYgdGhlIHByb3h5IGlzIGFjY2lkZW50YWxseSB0cmVhdGVkXG4gICAgICAgICAgICAgICAgLy8gbGlrZSBhIFByb21pc2VMaWtlIChsaWtlIGluIGBQcm9taXNlLnJlc29sdmUocHJveHkpYClcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUlubmVyUHJveHkoY2FsbGJhY2ssIFtcbiAgICAgICAgICAgICAgICAuLi5wYXRoLFxuICAgICAgICAgICAgICAgIGtleVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFwcGx5IChfMSwgXzIsIGFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzQXBwbHkgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV0gPT09ICdhcHBseSc7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIGFyZ3M6IGlzQXBwbHkgPyBhcmdzLmxlbmd0aCA+PSAyID8gYXJnc1sxXSA6IFtdIDogYXJncyxcbiAgICAgICAgICAgICAgICBwYXRoOiBpc0FwcGx5ID8gcGF0aC5zbGljZSgwLCAtMSkgOiBwYXRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwcm94eTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIHByb3h5IHRoYXQgY2FsbHMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIHBhdGggYW5kIGFyZ3VtZW50c1xuICpcbiAqIEBpbnRlcm5hbFxuICovIGNvbnN0IGNyZWF0ZVJlY3Vyc2l2ZVByb3h5ID0gKGNhbGxiYWNrKT0+Y3JlYXRlSW5uZXJQcm94eShjYWxsYmFjaywgW10pO1xuLyoqXG4gKiBVc2VkIGluIHBsYWNlIG9mIGBuZXcgUHJveHlgIHdoZXJlIGVhY2ggaGFuZGxlciB3aWxsIG1hcCAxIGxldmVsIGRlZXAgdG8gYW5vdGhlciB2YWx1ZS5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqLyBjb25zdCBjcmVhdGVGbGF0UHJveHkgPSAoY2FsbGJhY2spPT57XG4gICAgcmV0dXJuIG5ldyBQcm94eShub29wLCB7XG4gICAgICAgIGdldCAoX29iaiwgbmFtZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJyB8fCBuYW1lID09PSAndGhlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGlmIHRoZSBwcm94eSBpcyBhY2NpZGVudGFsbHkgdHJlYXRlZFxuICAgICAgICAgICAgICAgIC8vIGxpa2UgYSBQcm9taXNlTGlrZSAobGlrZSBpbiBgUHJvbWlzZS5yZXNvbHZlKHByb3h5KWApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuYW1lKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZXhwb3J0cy5UUlBDX0VSUk9SX0NPREVTX0JZX05VTUJFUiA9IFRSUENfRVJST1JfQ09ERVNfQllfTlVNQkVSO1xuZXhwb3J0cy5jcmVhdGVGbGF0UHJveHkgPSBjcmVhdGVGbGF0UHJveHk7XG5leHBvcnRzLmNyZWF0ZVJlY3Vyc2l2ZVByb3h5ID0gY3JlYXRlUmVjdXJzaXZlUHJveHk7XG5leHBvcnRzLmdldEhUVFBTdGF0dXNDb2RlID0gZ2V0SFRUUFN0YXR1c0NvZGU7XG5leHBvcnRzLmdldEhUVFBTdGF0dXNDb2RlRnJvbUVycm9yID0gZ2V0SFRUUFN0YXR1c0NvZGVGcm9tRXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBUUlBDRXJyb3IgPSByZXF1aXJlKCcuL1RSUENFcnJvci1jYTM3YmYxYS5qcycpO1xudmFyIGluZGV4ID0gcmVxdWlyZSgnLi9pbmRleC03ODRmZjY0Ny5qcycpO1xudmFyIGNvZGVzID0gcmVxdWlyZSgnLi9jb2Rlcy04N2Y2ODI0Yi5qcycpO1xuXG4vKipcbiAqIEBwdWJsaWNcbiAqLyAvKipcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGdldERhdGFUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcikge1xuICAgIGlmICgnaW5wdXQnIGluIHRyYW5zZm9ybWVyKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1lcjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaW5wdXQ6IHRyYW5zZm9ybWVyLFxuICAgICAgICBvdXRwdXQ6IHRyYW5zZm9ybWVyXG4gICAgfTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKi8gY29uc3QgZGVmYXVsdFRyYW5zZm9ybWVyID0ge1xuICAgIF9kZWZhdWx0OiB0cnVlLFxuICAgIGlucHV0OiB7XG4gICAgICAgIHNlcmlhbGl6ZTogKG9iaik9Pm9iaixcbiAgICAgICAgZGVzZXJpYWxpemU6IChvYmopPT5vYmpcbiAgICB9LFxuICAgIG91dHB1dDoge1xuICAgICAgICBzZXJpYWxpemU6IChvYmopPT5vYmosXG4gICAgICAgIGRlc2VyaWFsaXplOiAob2JqKT0+b2JqXG4gICAgfVxufTtcblxuY29uc3QgZGVmYXVsdEZvcm1hdHRlciA9ICh7IHNoYXBlICB9KT0+e1xuICAgIHJldHVybiBzaGFwZTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIGFuIG9iamVjdCB3aXRob3V0IGluaGVyaXRpbmcgYW55dGhpbmcgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWBcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIG9taXRQcm90b3R5cGUob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgb2JqKTtcbn1cblxuY29uc3QgcHJvY2VkdXJlVHlwZXMgPSBbXG4gICAgJ3F1ZXJ5JyxcbiAgICAnbXV0YXRpb24nLFxuICAgICdzdWJzY3JpcHRpb24nXG5dO1xuXG5mdW5jdGlvbiBpc1JvdXRlcihwcm9jZWR1cmVPclJvdXRlcikge1xuICAgIHJldHVybiAncm91dGVyJyBpbiBwcm9jZWR1cmVPclJvdXRlci5fZGVmO1xufVxuY29uc3QgZW1wdHlSb3V0ZXIgPSB7XG4gICAgX2N0eDogbnVsbCxcbiAgICBfZXJyb3JTaGFwZTogbnVsbCxcbiAgICBfbWV0YTogbnVsbCxcbiAgICBxdWVyaWVzOiB7fSxcbiAgICBtdXRhdGlvbnM6IHt9LFxuICAgIHN1YnNjcmlwdGlvbnM6IHt9LFxuICAgIGVycm9yRm9ybWF0dGVyOiBkZWZhdWx0Rm9ybWF0dGVyLFxuICAgIHRyYW5zZm9ybWVyOiBkZWZhdWx0VHJhbnNmb3JtZXJcbn07XG4vKipcbiAqIFJlc2VydmVkIHdvcmRzIHRoYXQgY2FuJ3QgYmUgdXNlZCBhcyByb3V0ZXIgb3IgcHJvY2VkdXJlIG5hbWVzXG4gKi8gY29uc3QgcmVzZXJ2ZWRXb3JkcyA9IFtcbiAgICAvKipcbiAgICogVGhlbiBpcyBhIHJlc2VydmVkIHdvcmQgYmVjYXVzZSBvdGhlcndpc2Ugd2UgY2FuJ3QgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJldHVybnMgYSBQcm94eVxuICAgKiBzaW5jZSBKUyB3aWxsIHRoaW5rIHRoYXQgYC50aGVuYCBpcyBzb21ldGhpbmcgdGhhdCBleGlzdHNcbiAgICovICd0aGVuJ1xuXTtcbi8qKlxuICogQGludGVybmFsXG4gKi8gZnVuY3Rpb24gY3JlYXRlUm91dGVyRmFjdG9yeShjb25maWcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gY3JlYXRlUm91dGVySW5uZXIocHJvY2VkdXJlcykge1xuICAgICAgICBjb25zdCByZXNlcnZlZFdvcmRzVXNlZCA9IG5ldyBTZXQoT2JqZWN0LmtleXMocHJvY2VkdXJlcykuZmlsdGVyKCh2KT0+cmVzZXJ2ZWRXb3Jkcy5pbmNsdWRlcyh2KSkpO1xuICAgICAgICBpZiAocmVzZXJ2ZWRXb3Jkc1VzZWQuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVzZXJ2ZWQgd29yZHMgdXNlZCBpbiBgcm91dGVyKHt9KWAgY2FsbDogJyArIEFycmF5LmZyb20ocmVzZXJ2ZWRXb3Jkc1VzZWQpLmpvaW4oJywgJykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJvdXRlclByb2NlZHVyZXMgPSBvbWl0UHJvdG90eXBlKHt9KTtcbiAgICAgICAgZnVuY3Rpb24gcmVjdXJzaXZlR2V0UGF0aHMocHJvY2VkdXJlcywgcGF0aCA9ICcnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHByb2NlZHVyZU9yUm91dGVyXSBvZiBPYmplY3QuZW50cmllcyhwcm9jZWR1cmVzID8/IHt9KSl7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IGAke3BhdGh9JHtrZXl9YDtcbiAgICAgICAgICAgICAgICBpZiAoaXNSb3V0ZXIocHJvY2VkdXJlT3JSb3V0ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZUdldFBhdGhzKHByb2NlZHVyZU9yUm91dGVyLl9kZWYucHJvY2VkdXJlcywgYCR7bmV3UGF0aH0uYCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm91dGVyUHJvY2VkdXJlc1tuZXdQYXRoXSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBrZXk6ICR7bmV3UGF0aH1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVyUHJvY2VkdXJlc1tuZXdQYXRoXSA9IHByb2NlZHVyZU9yUm91dGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2l2ZUdldFBhdGhzKHByb2NlZHVyZXMpO1xuICAgICAgICBjb25zdCBfZGVmID0ge1xuICAgICAgICAgICAgX2NvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgcm91dGVyOiB0cnVlLFxuICAgICAgICAgICAgcHJvY2VkdXJlczogcm91dGVyUHJvY2VkdXJlcyxcbiAgICAgICAgICAgIC4uLmVtcHR5Um91dGVyLFxuICAgICAgICAgICAgcmVjb3JkOiBwcm9jZWR1cmVzLFxuICAgICAgICAgICAgcXVlcmllczogT2JqZWN0LmVudHJpZXMocm91dGVyUHJvY2VkdXJlcykuZmlsdGVyKChwYWlyKT0+cGFpclsxXS5fZGVmLnF1ZXJ5KS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsXSk9Pih7XG4gICAgICAgICAgICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICAgICAgICAgICAgW2tleV06IHZhbFxuICAgICAgICAgICAgICAgIH0pLCB7fSksXG4gICAgICAgICAgICBtdXRhdGlvbnM6IE9iamVjdC5lbnRyaWVzKHJvdXRlclByb2NlZHVyZXMpLmZpbHRlcigocGFpcik9PnBhaXJbMV0uX2RlZi5tdXRhdGlvbikucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pPT4oe1xuICAgICAgICAgICAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgICAgICAgICAgIFtrZXldOiB2YWxcbiAgICAgICAgICAgICAgICB9KSwge30pLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uczogT2JqZWN0LmVudHJpZXMocm91dGVyUHJvY2VkdXJlcykuZmlsdGVyKChwYWlyKT0+cGFpclsxXS5fZGVmLnN1YnNjcmlwdGlvbikucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pPT4oe1xuICAgICAgICAgICAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgICAgICAgICAgIFtrZXldOiB2YWxcbiAgICAgICAgICAgICAgICB9KSwge30pXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJvdXRlciA9IHtcbiAgICAgICAgICAgIC4uLnByb2NlZHVyZXMsXG4gICAgICAgICAgICBfZGVmLFxuICAgICAgICAgICAgY3JlYXRlQ2FsbGVyIChjdHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlYXRlQ2FsbGVyRmFjdG9yeSgpKHJvdXRlcikoY3R4KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRFcnJvclNoYXBlIChvcHRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBwYXRoICwgZXJyb3IgIH0gPSBvcHRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY29kZSAgfSA9IG9wdHMuZXJyb3I7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IGNvZGVzLlRSUENfRVJST1JfQ09ERVNfQllfS0VZW2NvZGVdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cFN0YXR1czogaW5kZXguZ2V0SFRUUFN0YXR1c0NvZGVGcm9tRXJyb3IoZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcuaXNEZXYgJiYgdHlwZW9mIG9wdHMuZXJyb3Iuc3RhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLmRhdGEuc3RhY2sgPSBvcHRzLmVycm9yLnN0YWNrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLmRhdGEucGF0aCA9IHBhdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYuX2NvbmZpZy5lcnJvckZvcm1hdHRlcih7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9wdHMsXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByb3V0ZXI7XG4gICAgfTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKi8gZnVuY3Rpb24gY2FsbFByb2NlZHVyZShvcHRzKSB7XG4gICAgY29uc3QgeyB0eXBlICwgcGF0aCAgfSA9IG9wdHM7XG4gICAgaWYgKCEocGF0aCBpbiBvcHRzLnByb2NlZHVyZXMpIHx8ICFvcHRzLnByb2NlZHVyZXNbcGF0aF0/Ll9kZWZbdHlwZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IFRSUENFcnJvci5UUlBDRXJyb3Ioe1xuICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICBtZXNzYWdlOiBgTm8gXCIke3R5cGV9XCItcHJvY2VkdXJlIG9uIHBhdGggXCIke3BhdGh9XCJgXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBwcm9jZWR1cmUgPSBvcHRzLnByb2NlZHVyZXNbcGF0aF07XG4gICAgcmV0dXJuIHByb2NlZHVyZShvcHRzKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNhbGxlckZhY3RvcnkoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUNhbGxlcklubmVyKHJvdXRlcikge1xuICAgICAgICBjb25zdCBkZWYgPSByb3V0ZXIuX2RlZjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUNhbGxlcihjdHgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3h5ID0gaW5kZXguY3JlYXRlUmVjdXJzaXZlUHJveHkoKHsgcGF0aCAsIGFyZ3MgIH0pPT57XG4gICAgICAgICAgICAgICAgLy8gaW50ZXJvcCBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxICYmIHByb2NlZHVyZVR5cGVzLmluY2x1ZGVzKHBhdGhbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsUHJvY2VkdXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZXM6IGRlZi5wcm9jZWR1cmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBhcmdzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogcGF0aFswXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oJy4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9jZWR1cmUgPSBkZWYucHJvY2VkdXJlc1tmdWxsUGF0aF07XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAncXVlcnknO1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZWR1cmUuX2RlZi5tdXRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ211dGF0aW9uJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2NlZHVyZS5fZGVmLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3N1YnNjcmlwdGlvbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZWR1cmUoe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBmdWxsUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjaGVjayB0byBzZWUgaWYgd2UncmUgaW4gYSBzZXJ2ZXJcbiAqLyBjb25zdCBpc1NlcnZlckRlZmF1bHQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAnRGVubycgaW4gd2luZG93IHx8IGdsb2JhbFRoaXMucHJvY2Vzcz8uZW52Py5OT0RFX0VOViA9PT0gJ3Rlc3QnIHx8ICEhZ2xvYmFsVGhpcy5wcm9jZXNzPy5lbnY/LkpFU1RfV09SS0VSX0lEIHx8ICEhZ2xvYmFsVGhpcy5wcm9jZXNzPy5lbnY/LlZJVEVTVF9XT1JLRVJfSUQ7XG5cbmV4cG9ydHMuY2FsbFByb2NlZHVyZSA9IGNhbGxQcm9jZWR1cmU7XG5leHBvcnRzLmNyZWF0ZUNhbGxlckZhY3RvcnkgPSBjcmVhdGVDYWxsZXJGYWN0b3J5O1xuZXhwb3J0cy5jcmVhdGVSb3V0ZXJGYWN0b3J5ID0gY3JlYXRlUm91dGVyRmFjdG9yeTtcbmV4cG9ydHMuZGVmYXVsdEZvcm1hdHRlciA9IGRlZmF1bHRGb3JtYXR0ZXI7XG5leHBvcnRzLmRlZmF1bHRUcmFuc2Zvcm1lciA9IGRlZmF1bHRUcmFuc2Zvcm1lcjtcbmV4cG9ydHMuZ2V0RGF0YVRyYW5zZm9ybWVyID0gZ2V0RGF0YVRyYW5zZm9ybWVyO1xuZXhwb3J0cy5pc1NlcnZlckRlZmF1bHQgPSBpc1NlcnZlckRlZmF1bHQ7XG5leHBvcnRzLnByb2NlZHVyZVR5cGVzID0gcHJvY2VkdXJlVHlwZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZy0xOTRiZGQ0My5qcycpO1xudmFyIFRSUENFcnJvciA9IHJlcXVpcmUoJy4vVFJQQ0Vycm9yLWNhMzdiZjFhLmpzJyk7XG52YXIgaW5kZXggPSByZXF1aXJlKCcuL2luZGV4LTc4NGZmNjQ3LmpzJyk7XG52YXIgY29kZXMgPSByZXF1aXJlKCcuL2NvZGVzLTg3ZjY4MjRiLmpzJyk7XG5yZXF1aXJlKCcuL2dldENhdXNlRnJvbVVua25vd24tZDUzNTI2NGEuanMnKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovIGNvbnN0IG1pZGRsZXdhcmVNYXJrZXIkMSA9ICdtaWRkbGV3YXJlTWFya2VyJztcblxuZnVuY3Rpb24gZ2V0UGFyc2VGbiQxKHByb2NlZHVyZVBhcnNlcikge1xuICAgIGNvbnN0IHBhcnNlciA9IHByb2NlZHVyZVBhcnNlcjtcbiAgICBpZiAodHlwZW9mIHBhcnNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBQcm9jZWR1cmVQYXJzZXJDdXN0b21WYWxpZGF0b3JFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5wYXJzZUFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFByb2NlZHVyZVBhcnNlclpvZEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBc3luYy5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLnBhcnNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFByb2NlZHVyZVBhcnNlclpvZEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UuYmluZChwYXJzZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci52YWxpZGF0ZVN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUHJvY2VkdXJlUGFyc2VyWXVwRXNxdWVcbiAgICAgICAgcmV0dXJuIHBhcnNlci52YWxpZGF0ZVN5bmMuYmluZChwYXJzZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUHJvY2VkdXJlUGFyc2VyU3VwZXJzdHJ1Y3RFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyLmNyZWF0ZS5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgYSB2YWxpZGF0b3IgZm4nKTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKiBAZGVwcmVjYXRlZFxuICovIGNsYXNzIFByb2NlZHVyZSB7XG4gICAgX2RlZigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1pZGRsZXdhcmVzOiB0aGlzLm1pZGRsZXdhcmVzLFxuICAgICAgICAgICAgcmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXIsXG4gICAgICAgICAgICBpbnB1dFBhcnNlcjogdGhpcy5pbnB1dFBhcnNlcixcbiAgICAgICAgICAgIG91dHB1dFBhcnNlcjogdGhpcy5vdXRwdXRQYXJzZXIsXG4gICAgICAgICAgICBtZXRhOiB0aGlzLm1ldGFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgcGFyc2VJbnB1dChyYXdJbnB1dCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGFyc2VJbnB1dEZuKHJhd0lucHV0KTtcbiAgICAgICAgfSBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3IuVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnQkFEX1JFUVVFU1QnLFxuICAgICAgICAgICAgICAgIGNhdXNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBwYXJzZU91dHB1dChyYXdPdXRwdXQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLnBhcnNlT3V0cHV0Rm4ocmF3T3V0cHV0KTtcbiAgICAgICAgfSBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3IuVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICAgICAgICAgICAgICBjYXVzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnT3V0cHV0IHZhbGlkYXRpb24gZmFpbGVkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAqIFRyaWdnZXIgbWlkZGxld2FyZXMgaW4gb3JkZXIsIHBhcnNlIHJhdyBpbnB1dCwgY2FsbCByZXNvbHZlciAmIHBhcnNlIHJhdyBvdXRwdXRcbiAgICogQGludGVybmFsXG4gICAqLyBhc3luYyBjYWxsKG9wdHMpIHtcbiAgICAgICAgLy8gd3JhcCB0aGUgYWN0dWFsIHJlc29sdmVyIGFuZCB0cmVhdCBhcyB0aGUgbGFzdCBcIm1pZGRsZXdhcmVcIlxuICAgICAgICBjb25zdCBtaWRkbGV3YXJlc1dpdGhSZXNvbHZlciA9IHRoaXMubWlkZGxld2FyZXMuY29uY2F0KFtcbiAgICAgICAgICAgIGFzeW5jICh7IGN0eCAgfSk9PntcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dCA9IGF3YWl0IHRoaXMucGFyc2VJbnB1dChvcHRzLnJhd0lucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCByYXdPdXRwdXQgPSBhd2FpdCB0aGlzLnJlc29sdmVyKHtcbiAgICAgICAgICAgICAgICAgICAgLi4ub3B0cyxcbiAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICBpbnB1dFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB0aGlzLnBhcnNlT3V0cHV0KHJhd091dHB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyOiBtaWRkbGV3YXJlTWFya2VyJDEsXG4gICAgICAgICAgICAgICAgICAgIG9rOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBjdHhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICAgICAgLy8gcnVuIHRoZSBtaWRkbGV3YXJlcyByZWN1cnNpdmVseSB3aXRoIHRoZSByZXNvbHZlciBhcyB0aGUgbGFzdCBvbmVcbiAgICAgICAgY29uc3QgY2FsbFJlY3Vyc2l2ZSA9IGFzeW5jIChjYWxsT3B0cyA9IHtcbiAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgY3R4OiBvcHRzLmN0eFxuICAgICAgICB9KT0+e1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLW5vbi1udWxsLWFzc2VydGlvblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG1pZGRsZXdhcmVzV2l0aFJlc29sdmVyW2NhbGxPcHRzLmluZGV4XSh7XG4gICAgICAgICAgICAgICAgICAgIGN0eDogY2FsbE9wdHMuY3R4LFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBvcHRzLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wdHMucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IG9wdHMucmF3SW5wdXQsXG4gICAgICAgICAgICAgICAgICAgIG1ldGE6IHRoaXMubWV0YSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dDogYXN5bmMgKG5leHRPcHRzKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxSZWN1cnNpdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBjYWxsT3B0cy5pbmRleCArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4OiBuZXh0T3B0cyA/IG5leHRPcHRzLmN0eCA6IGNhbGxPcHRzLmN0eFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBjdHg6IGNhbGxPcHRzLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogVFJQQ0Vycm9yLmdldFRSUENFcnJvckZyb21Vbmtub3duKGNhdXNlKSxcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyOiBtaWRkbGV3YXJlTWFya2VyJDFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyB0aGVyZSdzIGFsd2F5cyBhdCBsZWFzdCBvbmUgXCJuZXh0XCIgc2luY2Ugd2Ugd3JhcCB0aGlzLnJlc29sdmVyIGluIGEgbWlkZGxld2FyZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYWxsUmVjdXJzaXZlKCk7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yLlRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIHJlc3VsdCBmcm9tIG1pZGRsZXdhcmVzIC0gZGlkIHlvdSBmb3JnZXQgdG8gYHJldHVybiBuZXh0KClgPydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVzdWx0Lm9rKSB7XG4gICAgICAgICAgICAvLyByZS10aHJvdyBvcmlnaW5hbCBlcnJvclxuICAgICAgICAgICAgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQuZGF0YTtcbiAgICB9XG4gICAgLyoqXG4gICAqIENyZWF0ZSBuZXcgcHJvY2VkdXJlIHdpdGggcGFzc2VkIG1pZGRsZXdhcmVzXG4gICAqIEBwYXJhbSBtaWRkbGV3YXJlc1xuICAgKi8gaW5oZXJpdE1pZGRsZXdhcmVzKG1pZGRsZXdhcmVzKSB7XG4gICAgICAgIGNvbnN0IENvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3Ioe1xuICAgICAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgICAgICAuLi5taWRkbGV3YXJlcyxcbiAgICAgICAgICAgICAgICAuLi50aGlzLm1pZGRsZXdhcmVzXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXIsXG4gICAgICAgICAgICBpbnB1dFBhcnNlcjogdGhpcy5pbnB1dFBhcnNlcixcbiAgICAgICAgICAgIG91dHB1dFBhcnNlcjogdGhpcy5vdXRwdXRQYXJzZXIsXG4gICAgICAgICAgICBtZXRhOiB0aGlzLm1ldGFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gICAgY29uc3RydWN0b3Iob3B0cyl7XG4gICAgICAgIHRoaXMubWlkZGxld2FyZXMgPSBvcHRzLm1pZGRsZXdhcmVzO1xuICAgICAgICB0aGlzLnJlc29sdmVyID0gb3B0cy5yZXNvbHZlcjtcbiAgICAgICAgdGhpcy5pbnB1dFBhcnNlciA9IG9wdHMuaW5wdXRQYXJzZXI7XG4gICAgICAgIHRoaXMucGFyc2VJbnB1dEZuID0gZ2V0UGFyc2VGbiQxKHRoaXMuaW5wdXRQYXJzZXIpO1xuICAgICAgICB0aGlzLm91dHB1dFBhcnNlciA9IG9wdHMub3V0cHV0UGFyc2VyO1xuICAgICAgICB0aGlzLnBhcnNlT3V0cHV0Rm4gPSBnZXRQYXJzZUZuJDEodGhpcy5vdXRwdXRQYXJzZXIpO1xuICAgICAgICB0aGlzLm1ldGEgPSBvcHRzLm1ldGE7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlUHJvY2VkdXJlKG9wdHMpIHtcbiAgICBjb25zdCBpbnB1dFBhcnNlciA9ICdpbnB1dCcgaW4gb3B0cyA/IG9wdHMuaW5wdXQgOiAoaW5wdXQpPT57XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yLlRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ0JBRF9SRVFVRVNUJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gaW5wdXQgZXhwZWN0ZWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH07XG4gICAgY29uc3Qgb3V0cHV0UGFyc2VyID0gJ291dHB1dCcgaW4gb3B0cyAmJiBvcHRzLm91dHB1dCA/IG9wdHMub3V0cHV0IDogKG91dHB1dCk9Pm91dHB1dDtcbiAgICByZXR1cm4gbmV3IFByb2NlZHVyZSh7XG4gICAgICAgIGlucHV0UGFyc2VyOiBpbnB1dFBhcnNlcixcbiAgICAgICAgcmVzb2x2ZXI6IG9wdHMucmVzb2x2ZSxcbiAgICAgICAgbWlkZGxld2FyZXM6IFtdLFxuICAgICAgICBvdXRwdXRQYXJzZXI6IG91dHB1dFBhcnNlcixcbiAgICAgICAgbWV0YTogb3B0cy5tZXRhXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFBhcnNlRm4ocHJvY2VkdXJlUGFyc2VyKSB7XG4gICAgY29uc3QgcGFyc2VyID0gcHJvY2VkdXJlUGFyc2VyO1xuICAgIGlmICh0eXBlb2YgcGFyc2VyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlckN1c3RvbVZhbGlkYXRvckVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXI7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLnBhcnNlQXN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUGFyc2VyWm9kRXNxdWVcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUFzeW5jLmJpbmQocGFyc2VyKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZXIucGFyc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUGFyc2VyWm9kRXNxdWVcbiAgICAgICAgLy8gUGFyc2VyVmFsaWJvdEVzcXVlICg8PSB2MC4xMi5YKVxuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlLmJpbmQocGFyc2VyKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZXIudmFsaWRhdGVTeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlcll1cEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIudmFsaWRhdGVTeW5jLmJpbmQocGFyc2VyKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZXIuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlclN1cGVyc3RydWN0RXNxdWVcbiAgICAgICAgcmV0dXJuIHBhcnNlci5jcmVhdGUuYmluZChwYXJzZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5hc3NlcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUGFyc2VyU2NhbGVFc3F1ZVxuICAgICAgICByZXR1cm4gKHZhbHVlKT0+e1xuICAgICAgICAgICAgcGFyc2VyLmFzc2VydCh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgYSB2YWxpZGF0b3IgZm4nKTtcbn1cbi8qKlxuICogQGRlcHJlY2F0ZWQgb25seSBmb3IgYmFja3dhcmRzIGNvbXBhdFxuICogQGludGVybmFsXG4gKi8gZnVuY3Rpb24gZ2V0UGFyc2VGbk9yUGFzc1Rocm91Z2gocHJvY2VkdXJlUGFyc2VyKSB7XG4gICAgaWYgKCFwcm9jZWR1cmVQYXJzZXIpIHtcbiAgICAgICAgcmV0dXJuICh2KT0+djtcbiAgICB9XG4gICAgcmV0dXJuIGdldFBhcnNlRm4ocHJvY2VkdXJlUGFyc2VyKTtcbn1cblxuLyoqXG4gKiBFbnN1cmVzIHRoZXJlIGFyZSBubyBkdXBsaWNhdGUga2V5cyB3aGVuIGJ1aWxkaW5nIGEgcHJvY2VkdXJlLlxuICovIGZ1bmN0aW9uIG1lcmdlV2l0aG91dE92ZXJyaWRlcyhvYmoxLCAuLi5vYmpzKSB7XG4gICAgY29uc3QgbmV3T2JqID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCBvYmoxKTtcbiAgICBmb3IgKGNvbnN0IG92ZXJyaWRlcyBvZiBvYmpzKXtcbiAgICAgICAgZm9yKGNvbnN0IGtleSBpbiBvdmVycmlkZXMpe1xuICAgICAgICAgICAgaWYgKGtleSBpbiBuZXdPYmogJiYgbmV3T2JqW2tleV0gIT09IG92ZXJyaWRlc1trZXldKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUga2V5ICR7a2V5fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBvdmVycmlkZXNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqO1xufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGNyZWF0ZU1pZGRsZXdhcmVGYWN0b3J5KCkge1xuICAgIGZ1bmN0aW9uIGNyZWF0ZU1pZGRsZXdhcmVJbm5lcihtaWRkbGV3YXJlcykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgX21pZGRsZXdhcmVzOiBtaWRkbGV3YXJlcyxcbiAgICAgICAgICAgIHVuc3RhYmxlX3BpcGUgKG1pZGRsZXdhcmVCdWlsZGVyT3JGbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBpcGVkTWlkZGxld2FyZSA9ICdfbWlkZGxld2FyZXMnIGluIG1pZGRsZXdhcmVCdWlsZGVyT3JGbiA/IG1pZGRsZXdhcmVCdWlsZGVyT3JGbi5fbWlkZGxld2FyZXMgOiBbXG4gICAgICAgICAgICAgICAgICAgIG1pZGRsZXdhcmVCdWlsZGVyT3JGblxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU1pZGRsZXdhcmVJbm5lcihbXG4gICAgICAgICAgICAgICAgICAgIC4uLm1pZGRsZXdhcmVzLFxuICAgICAgICAgICAgICAgICAgICAuLi5waXBlZE1pZGRsZXdhcmVcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTWlkZGxld2FyZShmbikge1xuICAgICAgICByZXR1cm4gY3JlYXRlTWlkZGxld2FyZUlubmVyKFtcbiAgICAgICAgICAgIGZuXG4gICAgICAgIF0pO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlTWlkZGxld2FyZTtcbn1cbmNvbnN0IGV4cGVyaW1lbnRhbF9zdGFuZGFsb25lTWlkZGxld2FyZSA9ICgpPT4oe1xuICAgICAgICBjcmVhdGU6IGNyZWF0ZU1pZGRsZXdhcmVGYWN0b3J5KClcbiAgICB9KTtcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmopO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqIFBsZWFzZSBub3RlLCBgdHJwYy1vcGVuYXBpYCB1c2VzIHRoaXMgZnVuY3Rpb24uXG4gKi8gZnVuY3Rpb24gY3JlYXRlSW5wdXRNaWRkbGV3YXJlKHBhcnNlKSB7XG4gICAgY29uc3QgaW5wdXRNaWRkbGV3YXJlID0gYXN5bmMgKHsgbmV4dCAsIHJhd0lucHV0ICwgaW5wdXQgLCAgfSk9PntcbiAgICAgICAgbGV0IHBhcnNlZElucHV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSBhd2FpdCBwYXJzZShyYXdJbnB1dCk7XG4gICAgICAgIH0gY2F0Y2ggKGNhdXNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yLlRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ0JBRF9SRVFVRVNUJyxcbiAgICAgICAgICAgICAgICBjYXVzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTXVsdGlwbGUgaW5wdXQgcGFyc2Vyc1xuICAgICAgICBjb25zdCBjb21iaW5lZElucHV0ID0gaXNQbGFpbk9iamVjdChpbnB1dCkgJiYgaXNQbGFpbk9iamVjdChwYXJzZWRJbnB1dCkgPyB7XG4gICAgICAgICAgICAuLi5pbnB1dCxcbiAgICAgICAgICAgIC4uLnBhcnNlZElucHV0XG4gICAgICAgIH0gOiBwYXJzZWRJbnB1dDtcbiAgICAgICAgLy8gVE9ETyBmaXggdGhpcyB0eXBpbmc/XG4gICAgICAgIHJldHVybiBuZXh0KHtcbiAgICAgICAgICAgIGlucHV0OiBjb21iaW5lZElucHV0XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgaW5wdXRNaWRkbGV3YXJlLl90eXBlID0gJ2lucHV0JztcbiAgICByZXR1cm4gaW5wdXRNaWRkbGV3YXJlO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBjcmVhdGVPdXRwdXRNaWRkbGV3YXJlKHBhcnNlKSB7XG4gICAgY29uc3Qgb3V0cHV0TWlkZGxld2FyZSA9IGFzeW5jICh7IG5leHQgIH0pPT57XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgICAgICAgIC8vIHBhc3MgdGhyb3VnaCBmYWlsdXJlcyB3aXRob3V0IHZhbGlkYXRpbmdcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBwYXJzZShyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRSUENFcnJvci5UUlBDRXJyb3Ioe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdPdXRwdXQgdmFsaWRhdGlvbiBmYWlsZWQnLFxuICAgICAgICAgICAgICAgIGNvZGU6ICdJTlRFUk5BTF9TRVJWRVJfRVJST1InLFxuICAgICAgICAgICAgICAgIGNhdXNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgb3V0cHV0TWlkZGxld2FyZS5fdHlwZSA9ICdvdXRwdXQnO1xuICAgIHJldHVybiBvdXRwdXRNaWRkbGV3YXJlO1xufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGNvbnN0IG1pZGRsZXdhcmVNYXJrZXIgPSAnbWlkZGxld2FyZU1hcmtlcic7XG5cbmZ1bmN0aW9uIGNyZWF0ZU5ld0J1aWxkZXIoZGVmMSwgZGVmMikge1xuICAgIGNvbnN0IHsgbWlkZGxld2FyZXMgPVtdICwgaW5wdXRzICwgbWV0YSAsIC4uLnJlc3QgfSA9IGRlZjI7XG4gICAgLy8gVE9ETzogbWF5YmUgaGF2ZSBhIGZuIGhlcmUgdG8gd2FybiBhYm91dCBjYWxsc1xuICAgIHJldHVybiBjcmVhdGVCdWlsZGVyKHtcbiAgICAgICAgLi4ubWVyZ2VXaXRob3V0T3ZlcnJpZGVzKGRlZjEsIHJlc3QpLFxuICAgICAgICBpbnB1dHM6IFtcbiAgICAgICAgICAgIC4uLmRlZjEuaW5wdXRzLFxuICAgICAgICAgICAgLi4uaW5wdXRzID8/IFtdXG4gICAgICAgIF0sXG4gICAgICAgIG1pZGRsZXdhcmVzOiBbXG4gICAgICAgICAgICAuLi5kZWYxLm1pZGRsZXdhcmVzLFxuICAgICAgICAgICAgLi4ubWlkZGxld2FyZXNcbiAgICAgICAgXSxcbiAgICAgICAgbWV0YTogZGVmMS5tZXRhICYmIG1ldGEgPyB7XG4gICAgICAgICAgICAuLi5kZWYxLm1ldGEsXG4gICAgICAgICAgICAuLi5tZXRhXG4gICAgICAgIH0gOiBtZXRhID8/IGRlZjEubWV0YVxuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlQnVpbGRlcihpbml0RGVmID0ge30pIHtcbiAgICBjb25zdCBfZGVmID0ge1xuICAgICAgICBpbnB1dHM6IFtdLFxuICAgICAgICBtaWRkbGV3YXJlczogW10sXG4gICAgICAgIC4uLmluaXREZWZcbiAgICB9O1xuICAgIHJldHVybiB7XG4gICAgICAgIF9kZWYsXG4gICAgICAgIGlucHV0IChpbnB1dCkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gZ2V0UGFyc2VGbihpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTmV3QnVpbGRlcihfZGVmLCB7XG4gICAgICAgICAgICAgICAgaW5wdXRzOiBbXG4gICAgICAgICAgICAgICAgICAgIGlucHV0XG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBtaWRkbGV3YXJlczogW1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVJbnB1dE1pZGRsZXdhcmUocGFyc2VyKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBvdXRwdXQgKG91dHB1dCkge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VPdXRwdXQgPSBnZXRQYXJzZUZuKG91dHB1dCk7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTmV3QnVpbGRlcihfZGVmLCB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LFxuICAgICAgICAgICAgICAgIG1pZGRsZXdhcmVzOiBbXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZU91dHB1dE1pZGRsZXdhcmUocGFyc2VPdXRwdXQpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGEgKG1ldGEpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXdCdWlsZGVyKF9kZWYsIHtcbiAgICAgICAgICAgICAgICBtZXRhOiBtZXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKiBUaGlzIGZ1bmN0aW9uYWxpdHkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24uXG4gICAgICovIHVuc3RhYmxlX2NvbmNhdCAoYnVpbGRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5ld0J1aWxkZXIoX2RlZiwgYnVpbGRlci5fZGVmKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXNlIChtaWRkbGV3YXJlQnVpbGRlck9yRm4pIHtcbiAgICAgICAgICAgIC8vIERpc3Rpbmd1aXNoIGJldHdlZW4gYSBtaWRkbGV3YXJlIGJ1aWxkZXIgYW5kIGEgbWlkZGxld2FyZSBmdW5jdGlvblxuICAgICAgICAgICAgY29uc3QgbWlkZGxld2FyZXMgPSAnX21pZGRsZXdhcmVzJyBpbiBtaWRkbGV3YXJlQnVpbGRlck9yRm4gPyBtaWRkbGV3YXJlQnVpbGRlck9yRm4uX21pZGRsZXdhcmVzIDogW1xuICAgICAgICAgICAgICAgIG1pZGRsZXdhcmVCdWlsZGVyT3JGblxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXdCdWlsZGVyKF9kZWYsIHtcbiAgICAgICAgICAgICAgICBtaWRkbGV3YXJlczogbWlkZGxld2FyZXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBxdWVyeSAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVSZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgLi4uX2RlZixcbiAgICAgICAgICAgICAgICBxdWVyeTogdHJ1ZVxuICAgICAgICAgICAgfSwgcmVzb2x2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBtdXRhdGlvbiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVSZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgLi4uX2RlZixcbiAgICAgICAgICAgICAgICBtdXRhdGlvbjogdHJ1ZVxuICAgICAgICAgICAgfSwgcmVzb2x2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBzdWJzY3JpcHRpb24gKHJlc29sdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgICAgICAgICAgIC4uLl9kZWYsXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uOiB0cnVlXG4gICAgICAgICAgICB9LCByZXNvbHZlcik7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlUmVzb2x2ZXIoX2RlZiwgcmVzb2x2ZXIpIHtcbiAgICBjb25zdCBmaW5hbEJ1aWxkZXIgPSBjcmVhdGVOZXdCdWlsZGVyKF9kZWYsIHtcbiAgICAgICAgcmVzb2x2ZXIsXG4gICAgICAgIG1pZGRsZXdhcmVzOiBbXG4gICAgICAgICAgICBhc3luYyBmdW5jdGlvbiByZXNvbHZlTWlkZGxld2FyZShvcHRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc29sdmVyKG9wdHMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcjogbWlkZGxld2FyZU1hcmtlcixcbiAgICAgICAgICAgICAgICAgICAgb2s6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgIGN0eDogb3B0cy5jdHhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZVByb2NlZHVyZUNhbGxlcihmaW5hbEJ1aWxkZXIuX2RlZik7XG59XG5jb25zdCBjb2RlYmxvY2sgPSBgXG5UaGlzIGlzIGEgY2xpZW50LW9ubHkgZnVuY3Rpb24uXG5JZiB5b3Ugd2FudCB0byBjYWxsIHRoaXMgZnVuY3Rpb24gb24gdGhlIHNlcnZlciwgc2VlIGh0dHBzOi8vdHJwYy5pby9kb2NzL3NlcnZlci9zZXJ2ZXItc2lkZS1jYWxsc1xuYC50cmltKCk7XG5mdW5jdGlvbiBjcmVhdGVQcm9jZWR1cmVDYWxsZXIoX2RlZikge1xuICAgIGNvbnN0IHByb2NlZHVyZSA9IGFzeW5jIGZ1bmN0aW9uIHJlc29sdmUob3B0cykge1xuICAgICAgICAvLyBpcyBkaXJlY3Qgc2VydmVyLXNpZGUgY2FsbFxuICAgICAgICBpZiAoIW9wdHMgfHwgISgncmF3SW5wdXQnIGluIG9wdHMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoY29kZWJsb2NrKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBydW4gdGhlIG1pZGRsZXdhcmVzIHJlY3Vyc2l2ZWx5IHdpdGggdGhlIHJlc29sdmVyIGFzIHRoZSBsYXN0IG9uZVxuICAgICAgICBjb25zdCBjYWxsUmVjdXJzaXZlID0gYXN5bmMgKGNhbGxPcHRzID0ge1xuICAgICAgICAgICAgaW5kZXg6IDAsXG4gICAgICAgICAgICBjdHg6IG9wdHMuY3R4XG4gICAgICAgIH0pPT57XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgICAgICAgICAgY29uc3QgbWlkZGxld2FyZSA9IF9kZWYubWlkZGxld2FyZXNbY2FsbE9wdHMuaW5kZXhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG1pZGRsZXdhcmUoe1xuICAgICAgICAgICAgICAgICAgICBjdHg6IGNhbGxPcHRzLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogb3B0cy50eXBlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcHRzLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBjYWxsT3B0cy5yYXdJbnB1dCA/PyBvcHRzLnJhd0lucHV0LFxuICAgICAgICAgICAgICAgICAgICBtZXRhOiBfZGVmLm1ldGEsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBjYWxsT3B0cy5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgbmV4dCAoX25leHRPcHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0T3B0cyA9IF9uZXh0T3B0cztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsUmVjdXJzaXZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogY2FsbE9wdHMuaW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eDogbmV4dE9wdHMgJiYgJ2N0eCcgaW4gbmV4dE9wdHMgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmNhbGxPcHRzLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubmV4dE9wdHMuY3R4XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSA6IGNhbGxPcHRzLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogbmV4dE9wdHMgJiYgJ2lucHV0JyBpbiBuZXh0T3B0cyA/IG5leHRPcHRzLmlucHV0IDogY2FsbE9wdHMuaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IG5leHRPcHRzICYmICdyYXdJbnB1dCcgaW4gbmV4dE9wdHMgPyBuZXh0T3B0cy5yYXdJbnB1dCA6IGNhbGxPcHRzLnJhd0lucHV0XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IFRSUENFcnJvci5nZXRUUlBDRXJyb3JGcm9tVW5rbm93bihjYXVzZSksXG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcjogbWlkZGxld2FyZU1hcmtlclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIHRoZXJlJ3MgYWx3YXlzIGF0IGxlYXN0IG9uZSBcIm5leHRcIiBzaW5jZSB3ZSB3cmFwIHRoaXMucmVzb2x2ZXIgaW4gYSBtaWRkbGV3YXJlXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGxSZWN1cnNpdmUoKTtcbiAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3IuVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gcmVzdWx0IGZyb20gbWlkZGxld2FyZXMgLSBkaWQgeW91IGZvcmdldCB0byBgcmV0dXJuIG5leHQoKWA/J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgICAgICAgIC8vIHJlLXRocm93IG9yaWdpbmFsIGVycm9yXG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgIH07XG4gICAgcHJvY2VkdXJlLl9kZWYgPSBfZGVmO1xuICAgIHByb2NlZHVyZS5tZXRhID0gX2RlZi5tZXRhO1xuICAgIHJldHVybiBwcm9jZWR1cmU7XG59XG5cbmZ1bmN0aW9uIG1pZ3JhdGVQcm9jZWR1cmUob2xkUHJvYywgdHlwZSkge1xuICAgIGNvbnN0IGRlZiA9IG9sZFByb2MuX2RlZigpO1xuICAgIGNvbnN0IGlucHV0UGFyc2VyID0gZ2V0UGFyc2VGbk9yUGFzc1Rocm91Z2goZGVmLmlucHV0UGFyc2VyKTtcbiAgICBjb25zdCBvdXRwdXRQYXJzZXIgPSBnZXRQYXJzZUZuT3JQYXNzVGhyb3VnaChkZWYub3V0cHV0UGFyc2VyKTtcbiAgICBjb25zdCBpbnB1dE1pZGRsZXdhcmUgPSBjcmVhdGVJbnB1dE1pZGRsZXdhcmUoaW5wdXRQYXJzZXIpO1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVCdWlsZGVyKHtcbiAgICAgICAgaW5wdXRzOiBbXG4gICAgICAgICAgICBkZWYuaW5wdXRQYXJzZXJcbiAgICAgICAgXSxcbiAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgIC4uLmRlZi5taWRkbGV3YXJlcyxcbiAgICAgICAgICAgIGlucHV0TWlkZGxld2FyZSxcbiAgICAgICAgICAgIGNyZWF0ZU91dHB1dE1pZGRsZXdhcmUob3V0cHV0UGFyc2VyKVxuICAgICAgICBdLFxuICAgICAgICBtZXRhOiBkZWYubWV0YSxcbiAgICAgICAgb3V0cHV0OiBkZWYub3V0cHV0UGFyc2VyLFxuICAgICAgICBtdXRhdGlvbjogdHlwZSA9PT0gJ211dGF0aW9uJyxcbiAgICAgICAgcXVlcnk6IHR5cGUgPT09ICdxdWVyeScsXG4gICAgICAgIHN1YnNjcmlwdGlvbjogdHlwZSA9PT0gJ3N1YnNjcmlwdGlvbidcbiAgICB9KTtcbiAgICBjb25zdCBwcm9jID0gYnVpbGRlclt0eXBlXSgob3B0cyk9PmRlZi5yZXNvbHZlcihvcHRzKSk7XG4gICAgcmV0dXJuIHByb2M7XG59XG5mdW5jdGlvbiBtaWdyYXRlUm91dGVyKG9sZFJvdXRlcikge1xuICAgIGNvbnN0IGVycm9yRm9ybWF0dGVyID0gb2xkUm91dGVyLl9kZWYuZXJyb3JGb3JtYXR0ZXI7XG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSBvbGRSb3V0ZXIuX2RlZi50cmFuc2Zvcm1lcjtcbiAgICBjb25zdCBxdWVyaWVzID0ge307XG4gICAgY29uc3QgbXV0YXRpb25zID0ge307XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGZvciAoY29uc3QgW25hbWUsIHByb2NlZHVyZV0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYucXVlcmllcykpe1xuICAgICAgICBxdWVyaWVzW25hbWVdID0gbWlncmF0ZVByb2NlZHVyZShwcm9jZWR1cmUsICdxdWVyeScpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtuYW1lMSwgcHJvY2VkdXJlMV0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYubXV0YXRpb25zKSl7XG4gICAgICAgIG11dGF0aW9uc1tuYW1lMV0gPSBtaWdyYXRlUHJvY2VkdXJlKHByb2NlZHVyZTEsICdtdXRhdGlvbicpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtuYW1lMiwgcHJvY2VkdXJlMl0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYuc3Vic2NyaXB0aW9ucykpe1xuICAgICAgICBzdWJzY3JpcHRpb25zW25hbWUyXSA9IG1pZ3JhdGVQcm9jZWR1cmUocHJvY2VkdXJlMiwgJ3N1YnNjcmlwdGlvbicpO1xuICAgIH1cbiAgICBjb25zdCBwcm9jZWR1cmVzID0gbWVyZ2VXaXRob3V0T3ZlcnJpZGVzKHF1ZXJpZXMsIG11dGF0aW9ucywgc3Vic2NyaXB0aW9ucyk7XG4gICAgY29uc3QgbmV3Um91dGVyID0gY29uZmlnLmNyZWF0ZVJvdXRlckZhY3Rvcnkoe1xuICAgICAgICB0cmFuc2Zvcm1lcixcbiAgICAgICAgZXJyb3JGb3JtYXR0ZXIsXG4gICAgICAgIGlzRGV2OiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nXG4gICAgfSkocHJvY2VkdXJlcyk7XG4gICAgcmV0dXJuIG5ld1JvdXRlcjtcbn1cblxuZnVuY3Rpb24gZ2V0RGF0YVRyYW5zZm9ybWVyKHRyYW5zZm9ybWVyKSB7XG4gICAgaWYgKCdpbnB1dCcgaW4gdHJhbnNmb3JtZXIpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBpbnB1dDogdHJhbnNmb3JtZXIsXG4gICAgICAgIG91dHB1dDogdHJhbnNmb3JtZXJcbiAgICB9O1xufVxuY29uc3QgUFJPQ0VEVVJFX0RFRklOSVRJT05fTUFQID0ge1xuICAgIHF1ZXJ5OiAncXVlcmllcycsXG4gICAgbXV0YXRpb246ICdtdXRhdGlvbnMnLFxuICAgIHN1YnNjcmlwdGlvbjogJ3N1YnNjcmlwdGlvbnMnXG59O1xuZnVuY3Rpb24gc2FmZU9iamVjdCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgLi4uYXJncyk7XG59XG4vKipcbiAqIEBpbnRlcm5hbCBUaGUgdHlwZSBzaWduYXR1cmUgb2YgdGhpcyBjbGFzcyBtYXkgY2hhbmdlIHdpdGhvdXQgd2FybmluZy5cbiAqIEBkZXByZWNhdGVkXG4gKi8gY2xhc3MgUm91dGVyIHtcbiAgICBzdGF0aWMgcHJlZml4UHJvY2VkdXJlcyhwcm9jZWR1cmVzLCBwcmVmaXgpIHtcbiAgICAgICAgY29uc3QgZXBzID0gc2FmZU9iamVjdCgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHByb2NlZHVyZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvY2VkdXJlcykpe1xuICAgICAgICAgICAgZXBzW3ByZWZpeCArIGtleV0gPSBwcm9jZWR1cmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVwcztcbiAgICB9XG4gICAgcXVlcnkocGF0aCwgcHJvY2VkdXJlKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgcXVlcmllczogc2FmZU9iamVjdCh7XG4gICAgICAgICAgICAgICAgW3BhdGhdOiBjcmVhdGVQcm9jZWR1cmUocHJvY2VkdXJlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKHJvdXRlcik7XG4gICAgfVxuICAgIG11dGF0aW9uKHBhdGgsIHByb2NlZHVyZSkge1xuICAgICAgICBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIG11dGF0aW9uczogc2FmZU9iamVjdCh7XG4gICAgICAgICAgICAgICAgW3BhdGhdOiBjcmVhdGVQcm9jZWR1cmUocHJvY2VkdXJlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKHJvdXRlcik7XG4gICAgfVxuICAgIHN1YnNjcmlwdGlvbihwYXRoLCBwcm9jZWR1cmUpIHtcbiAgICAgICAgY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcih7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zOiBzYWZlT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBbcGF0aF06IGNyZWF0ZVByb2NlZHVyZShwcm9jZWR1cmUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2Uocm91dGVyKTtcbiAgICB9XG4gICAgbWVyZ2UocHJlZml4T3JSb3V0ZXIsIG1heWJlUm91dGVyKSB7XG4gICAgICAgIGxldCBwcmVmaXggPSAnJztcbiAgICAgICAgbGV0IGNoaWxkUm91dGVyO1xuICAgICAgICBpZiAodHlwZW9mIHByZWZpeE9yUm91dGVyID09PSAnc3RyaW5nJyAmJiBtYXliZVJvdXRlciBpbnN0YW5jZW9mIFJvdXRlcikge1xuICAgICAgICAgICAgcHJlZml4ID0gcHJlZml4T3JSb3V0ZXI7XG4gICAgICAgICAgICBjaGlsZFJvdXRlciA9IG1heWJlUm91dGVyO1xuICAgICAgICB9IGVsc2UgaWYgKHByZWZpeE9yUm91dGVyIGluc3RhbmNlb2YgUm91dGVyKSB7XG4gICAgICAgICAgICBjaGlsZFJvdXRlciA9IHByZWZpeE9yUm91dGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3MnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkdXBsaWNhdGVRdWVyaWVzID0gT2JqZWN0LmtleXMoY2hpbGRSb3V0ZXIuX2RlZi5xdWVyaWVzKS5maWx0ZXIoKGtleSk9PiEhdGhpcy5fZGVmLnF1ZXJpZXNbcHJlZml4ICsga2V5XSk7XG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZU11dGF0aW9ucyA9IE9iamVjdC5rZXlzKGNoaWxkUm91dGVyLl9kZWYubXV0YXRpb25zKS5maWx0ZXIoKGtleSk9PiEhdGhpcy5fZGVmLm11dGF0aW9uc1twcmVmaXggKyBrZXldKTtcbiAgICAgICAgY29uc3QgZHVwbGljYXRlU3Vic2NyaXB0aW9ucyA9IE9iamVjdC5rZXlzKGNoaWxkUm91dGVyLl9kZWYuc3Vic2NyaXB0aW9ucykuZmlsdGVyKChrZXkpPT4hIXRoaXMuX2RlZi5zdWJzY3JpcHRpb25zW3ByZWZpeCArIGtleV0pO1xuICAgICAgICBjb25zdCBkdXBsaWNhdGVzID0gW1xuICAgICAgICAgICAgLi4uZHVwbGljYXRlUXVlcmllcyxcbiAgICAgICAgICAgIC4uLmR1cGxpY2F0ZU11dGF0aW9ucyxcbiAgICAgICAgICAgIC4uLmR1cGxpY2F0ZVN1YnNjcmlwdGlvbnNcbiAgICAgICAgXTtcbiAgICAgICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZSBlbmRwb2ludChzKTogJHtkdXBsaWNhdGVzLmpvaW4oJywgJyl9YCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVyZ2VQcm9jZWR1cmVzID0gKGRlZnMpPT57XG4gICAgICAgICAgICBjb25zdCBuZXdEZWZzID0gc2FmZU9iamVjdCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCBwcm9jZWR1cmVdIG9mIE9iamVjdC5lbnRyaWVzKGRlZnMpKXtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdQcm9jZWR1cmUgPSBwcm9jZWR1cmUuaW5oZXJpdE1pZGRsZXdhcmVzKHRoaXMuX2RlZi5taWRkbGV3YXJlcyk7XG4gICAgICAgICAgICAgICAgbmV3RGVmc1trZXldID0gbmV3UHJvY2VkdXJlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFJvdXRlci5wcmVmaXhQcm9jZWR1cmVzKG5ld0RlZnMsIHByZWZpeCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHF1ZXJpZXM6IHNhZmVPYmplY3QodGhpcy5fZGVmLnF1ZXJpZXMsIG1lcmdlUHJvY2VkdXJlcyhjaGlsZFJvdXRlci5fZGVmLnF1ZXJpZXMpKSxcbiAgICAgICAgICAgIG11dGF0aW9uczogc2FmZU9iamVjdCh0aGlzLl9kZWYubXV0YXRpb25zLCBtZXJnZVByb2NlZHVyZXMoY2hpbGRSb3V0ZXIuX2RlZi5tdXRhdGlvbnMpKSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHNhZmVPYmplY3QodGhpcy5fZGVmLnN1YnNjcmlwdGlvbnMsIG1lcmdlUHJvY2VkdXJlcyhjaGlsZFJvdXRlci5fZGVmLnN1YnNjcmlwdGlvbnMpKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEludm9rZSBwcm9jZWR1cmUuIE9ubHkgZm9yIGludGVybmFsIHVzZSB3aXRoaW4gbGlicmFyeS5cbiAgICovIGFzeW5jIGNhbGwob3B0cykge1xuICAgICAgICBjb25zdCB7IHR5cGUgLCBwYXRoICB9ID0gb3B0cztcbiAgICAgICAgY29uc3QgZGVmVGFyZ2V0ID0gUFJPQ0VEVVJFX0RFRklOSVRJT05fTUFQW3R5cGVdO1xuICAgICAgICBjb25zdCBkZWZzID0gdGhpcy5fZGVmW2RlZlRhcmdldF07XG4gICAgICAgIGNvbnN0IHByb2NlZHVyZSA9IGRlZnNbcGF0aF07XG4gICAgICAgIGlmICghcHJvY2VkdXJlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yLlRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYE5vIFwiJHt0eXBlfVwiLXByb2NlZHVyZSBvbiBwYXRoIFwiJHtwYXRofVwiYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2NlZHVyZS5jYWxsKG9wdHMpO1xuICAgIH1cbiAgICBjcmVhdGVDYWxsZXIoY3R4KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBxdWVyeTogKHBhdGgsIC4uLmFyZ3MpPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdxdWVyeScsXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGFyZ3NbMF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtdXRhdGlvbjogKHBhdGgsIC4uLmFyZ3MpPT57XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsbCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtdXRhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGFyZ3NbMF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWJzY3JpcHRpb246IChwYXRoLCAuLi5hcmdzKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3Vic2NyaXB0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgICAgICByYXdJbnB1dDogYXJnc1swXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICogRnVuY3Rpb24gdG8gYmUgY2FsbGVkIGJlZm9yZSBhbnkgcHJvY2VkdXJlIGlzIGludm9rZWRcbiAgICogQGxpbmsgaHR0cHM6Ly90cnBjLmlvL2RvY3MvbWlkZGxld2FyZXNcbiAgICovIG1pZGRsZXdhcmUobWlkZGxld2FyZSkge1xuICAgICAgICByZXR1cm4gbmV3IFJvdXRlcih7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBtaWRkbGV3YXJlczogW1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX2RlZi5taWRkbGV3YXJlcyxcbiAgICAgICAgICAgICAgICBtaWRkbGV3YXJlXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICogRm9ybWF0IGVycm9yc1xuICAgKiBAbGluayBodHRwczovL3RycGMuaW8vZG9jcy9lcnJvci1mb3JtYXR0aW5nXG4gICAqLyBmb3JtYXRFcnJvcihlcnJvckZvcm1hdHRlcikge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmVycm9yRm9ybWF0dGVyICE9PSBjb25maWcuZGVmYXVsdEZvcm1hdHRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2VlbSB0byBoYXZlIGRvdWJsZSBgZm9ybWF0RXJyb3IoKWAtY2FsbHMgaW4geW91ciByb3V0ZXIgdHJlZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGVycm9yRm9ybWF0dGVyOiBlcnJvckZvcm1hdHRlclxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0RXJyb3JTaGFwZShvcHRzKSB7XG4gICAgICAgIGNvbnN0IHsgcGF0aCAsIGVycm9yICB9ID0gb3B0cztcbiAgICAgICAgY29uc3QgeyBjb2RlICB9ID0gb3B0cy5lcnJvcjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB7XG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgY29kZTogY29kZXMuVFJQQ19FUlJPUl9DT0RFU19CWV9LRVlbY29kZV0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICBodHRwU3RhdHVzOiBpbmRleC5nZXRIVFRQU3RhdHVzQ29kZUZyb21FcnJvcihlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGdsb2JhbFRoaXMucHJvY2Vzcz8uZW52Py5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBvcHRzLmVycm9yLnN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2hhcGUuZGF0YS5zdGFjayA9IG9wdHMuZXJyb3Iuc3RhY2s7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2hhcGUuZGF0YS5wYXRoID0gcGF0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmVycm9yRm9ybWF0dGVyKHtcbiAgICAgICAgICAgIC4uLm9wdHMsXG4gICAgICAgICAgICBzaGFwZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEFkZCBkYXRhIHRyYW5zZm9ybWVyIHRvIHNlcmlhbGl6ZS9kZXNlcmlhbGl6ZSBpbnB1dCBhcmdzICsgb3V0cHV0XG4gICAqIEBsaW5rIGh0dHBzOi8vdHJwYy5pby9kb2NzL2RhdGEtdHJhbnNmb3JtZXJzXG4gICAqLyB0cmFuc2Zvcm1lcihfdHJhbnNmb3JtZXIpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBnZXREYXRhVHJhbnNmb3JtZXIoX3RyYW5zZm9ybWVyKTtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi50cmFuc2Zvcm1lciAhPT0gY29uZmlnLmRlZmF1bHRUcmFuc2Zvcm1lcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2VlbSB0byBoYXZlIGRvdWJsZSBgdHJhbnNmb3JtZXIoKWAtY2FsbHMgaW4geW91ciByb3V0ZXIgdHJlZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHRyYW5zZm9ybWVyXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICogRmxhdHRlbnMgdGhlIGdlbmVyaWNzIG9mIFRRdWVyaWVzL1RNdXRhdGlvbnMvVFN1YnNjcmlwdGlvbnMuXG4gICAqIOKaoO+4jyBFeHBlcmltZW50YWwgLSBtaWdodCBkaXNhcHBlYXIuIOKaoO+4j1xuICAgKlxuICAgKiBAYWxwaGFcbiAgICovIGZsYXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICogSW50ZXJvcCBtb2RlIGZvciB2OS54IC0+IHYxMC54XG4gICAqLyBpbnRlcm9wKCkge1xuICAgICAgICByZXR1cm4gbWlncmF0ZVJvdXRlcih0aGlzKTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoZGVmKXtcbiAgICAgICAgdGhpcy5fZGVmID0ge1xuICAgICAgICAgICAgcXVlcmllczogZGVmPy5xdWVyaWVzID8/IHNhZmVPYmplY3QoKSxcbiAgICAgICAgICAgIG11dGF0aW9uczogZGVmPy5tdXRhdGlvbnMgPz8gc2FmZU9iamVjdCgpLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uczogZGVmPy5zdWJzY3JpcHRpb25zID8/IHNhZmVPYmplY3QoKSxcbiAgICAgICAgICAgIG1pZGRsZXdhcmVzOiBkZWY/Lm1pZGRsZXdhcmVzID8/IFtdLFxuICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZXI6IGRlZj8uZXJyb3JGb3JtYXR0ZXIgPz8gY29uZmlnLmRlZmF1bHRGb3JtYXR0ZXIsXG4gICAgICAgICAgICB0cmFuc2Zvcm1lcjogZGVmPy50cmFuc2Zvcm1lciA/PyBjb25maWcuZGVmYXVsdFRyYW5zZm9ybWVyXG4gICAgICAgIH07XG4gICAgfVxufVxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovIGZ1bmN0aW9uIHJvdXRlcigpIHtcbiAgICByZXR1cm4gbmV3IFJvdXRlcigpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVJvdXRlcnMoLi4ucm91dGVyTGlzdCkge1xuICAgIGNvbnN0IHJlY29yZCA9IG1lcmdlV2l0aG91dE92ZXJyaWRlcyh7fSwgLi4ucm91dGVyTGlzdC5tYXAoKHIpPT5yLl9kZWYucmVjb3JkKSk7XG4gICAgY29uc3QgZXJyb3JGb3JtYXR0ZXIgPSByb3V0ZXJMaXN0LnJlZHVjZSgoY3VycmVudEVycm9yRm9ybWF0dGVyLCBuZXh0Um91dGVyKT0+e1xuICAgICAgICBpZiAobmV4dFJvdXRlci5fZGVmLl9jb25maWcuZXJyb3JGb3JtYXR0ZXIgJiYgbmV4dFJvdXRlci5fZGVmLl9jb25maWcuZXJyb3JGb3JtYXR0ZXIgIT09IGNvbmZpZy5kZWZhdWx0Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudEVycm9yRm9ybWF0dGVyICE9PSBjb25maWcuZGVmYXVsdEZvcm1hdHRlciAmJiBjdXJyZW50RXJyb3JGb3JtYXR0ZXIgIT09IG5leHRSb3V0ZXIuX2RlZi5fY29uZmlnLmVycm9yRm9ybWF0dGVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2VlbSB0byBoYXZlIHNldmVyYWwgZXJyb3IgZm9ybWF0dGVycycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRSb3V0ZXIuX2RlZi5fY29uZmlnLmVycm9yRm9ybWF0dGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50RXJyb3JGb3JtYXR0ZXI7XG4gICAgfSwgY29uZmlnLmRlZmF1bHRGb3JtYXR0ZXIpO1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcm91dGVyTGlzdC5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpPT57XG4gICAgICAgIGlmIChjdXJyZW50Ll9kZWYuX2NvbmZpZy50cmFuc2Zvcm1lciAmJiBjdXJyZW50Ll9kZWYuX2NvbmZpZy50cmFuc2Zvcm1lciAhPT0gY29uZmlnLmRlZmF1bHRUcmFuc2Zvcm1lcikge1xuICAgICAgICAgICAgaWYgKHByZXYgIT09IGNvbmZpZy5kZWZhdWx0VHJhbnNmb3JtZXIgJiYgcHJldiAhPT0gY3VycmVudC5fZGVmLl9jb25maWcudHJhbnNmb3JtZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzZWVtIHRvIGhhdmUgc2V2ZXJhbCB0cmFuc2Zvcm1lcnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50Ll9kZWYuX2NvbmZpZy50cmFuc2Zvcm1lcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJldjtcbiAgICB9LCBjb25maWcuZGVmYXVsdFRyYW5zZm9ybWVyKTtcbiAgICBjb25zdCByb3V0ZXIgPSBjb25maWcuY3JlYXRlUm91dGVyRmFjdG9yeSh7XG4gICAgICAgIGVycm9yRm9ybWF0dGVyLFxuICAgICAgICB0cmFuc2Zvcm1lcixcbiAgICAgICAgaXNEZXY6IHJvdXRlckxpc3Quc29tZSgocik9PnIuX2RlZi5fY29uZmlnLmlzRGV2KSxcbiAgICAgICAgYWxsb3dPdXRzaWRlT2ZTZXJ2ZXI6IHJvdXRlckxpc3Quc29tZSgocik9PnIuX2RlZi5fY29uZmlnLmFsbG93T3V0c2lkZU9mU2VydmVyKSxcbiAgICAgICAgaXNTZXJ2ZXI6IHJvdXRlckxpc3Quc29tZSgocik9PnIuX2RlZi5fY29uZmlnLmlzU2VydmVyKSxcbiAgICAgICAgJHR5cGVzOiByb3V0ZXJMaXN0WzBdPy5fZGVmLl9jb25maWcuJHR5cGVzXG4gICAgfSkocmVjb3JkKTtcbiAgICByZXR1cm4gcm91dGVyO1xufVxuXG4vKipcbiAqIFRPRE86IFRoaXMgY2FuIGJlIGltcHJvdmVkOlxuICogLSBXZSBzaG91bGQgYmUgYWJsZSB0byBjaGFpbiBgLm1ldGEoKWAvYC5jb250ZXh0KClgIG9ubHkgb25jZVxuICogLSBTaW1wbGlmeSB0eXBpbmdzXG4gKiAtIERvZXNuJ3QgbmVlZCB0byBiZSBhIGNsYXNzIGJ1dCBpdCBkb2Vzbid0IHJlYWxseSBodXJ0IGVpdGhlclxuICovIGNsYXNzIFRSUENCdWlsZGVyIHtcbiAgICBjb250ZXh0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFRSUENCdWlsZGVyKCk7XG4gICAgfVxuICAgIG1ldGEoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVFJQQ0J1aWxkZXIoKTtcbiAgICB9XG4gICAgY3JlYXRlKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVRSUENJbm5lcigpKG9wdGlvbnMpO1xuICAgIH1cbn1cbi8qKlxuICogSW5pdGlhbGl6ZSB0UlBDIC0gZG9uZSBleGFjdGx5IG9uY2UgcGVyIGJhY2tlbmRcbiAqLyBjb25zdCBpbml0VFJQQyA9IG5ldyBUUlBDQnVpbGRlcigpO1xuZnVuY3Rpb24gY3JlYXRlVFJQQ0lubmVyKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBpbml0VFJQQ0lubmVyKHJ1bnRpbWUpIHtcbiAgICAgICAgY29uc3QgZXJyb3JGb3JtYXR0ZXIgPSBydW50aW1lPy5lcnJvckZvcm1hdHRlciA/PyBjb25maWcuZGVmYXVsdEZvcm1hdHRlcjtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBjb25maWcuZ2V0RGF0YVRyYW5zZm9ybWVyKHJ1bnRpbWU/LnRyYW5zZm9ybWVyID8/IGNvbmZpZy5kZWZhdWx0VHJhbnNmb3JtZXIpO1xuICAgICAgICBjb25zdCBjb25maWckMSA9IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVyLFxuICAgICAgICAgICAgaXNEZXY6IHJ1bnRpbWU/LmlzRGV2ID8/IGdsb2JhbFRoaXMucHJvY2Vzcz8uZW52Py5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgICAgICAgYWxsb3dPdXRzaWRlT2ZTZXJ2ZXI6IHJ1bnRpbWU/LmFsbG93T3V0c2lkZU9mU2VydmVyID8/IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3JGb3JtYXR0ZXIsXG4gICAgICAgICAgICBpc1NlcnZlcjogcnVudGltZT8uaXNTZXJ2ZXIgPz8gY29uZmlnLmlzU2VydmVyRGVmYXVsdCxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogQGludGVybmFsXG4gICAgICAgKi8gJHR5cGVzOiBpbmRleC5jcmVhdGVGbGF0UHJveHkoKGtleSk9PntcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyaWVkIHRvIGFjY2VzcyBcIiR0eXBlcy4ke2tleX1cIiB3aGljaCBpcyBub3QgYXZhaWxhYmxlIGF0IHJ1bnRpbWVgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIFNlcnZlciBjaGVja1xuICAgICAgICAgICAgY29uc3QgaXNTZXJ2ZXIgPSBydW50aW1lPy5pc1NlcnZlciA/PyBjb25maWcuaXNTZXJ2ZXJEZWZhdWx0O1xuICAgICAgICAgICAgaWYgKCFpc1NlcnZlciAmJiBydW50aW1lPy5hbGxvd091dHNpZGVPZlNlcnZlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgWW91J3JlIHRyeWluZyB0byB1c2UgQHRycGMvc2VydmVyIGluIGEgbm9uLXNlcnZlciBlbnZpcm9ubWVudC4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGJ5IGRlZmF1bHQuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogVGhlc2UgYXJlIGp1c3QgdHlwZXMsIHRoZXkgY2FuJ3QgYmUgdXNlZFxuICAgICAgICogQGludGVybmFsXG4gICAgICAgKi8gX2NvbmZpZzogY29uZmlnJDEsXG4gICAgICAgICAgICAvKipcbiAgICAgICAqIEJ1aWxkZXIgb2JqZWN0IGZvciBjcmVhdGluZyBwcm9jZWR1cmVzXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vdHJwYy5pby9kb2NzL3NlcnZlci9wcm9jZWR1cmVzXG4gICAgICAgKi8gcHJvY2VkdXJlOiBjcmVhdGVCdWlsZGVyKHtcbiAgICAgICAgICAgICAgICBtZXRhOiBydW50aW1lPy5kZWZhdWx0TWV0YVxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAvKipcbiAgICAgICAqIENyZWF0ZSByZXVzYWJsZSBtaWRkbGV3YXJlc1xuICAgICAgICogQHNlZSBodHRwczovL3RycGMuaW8vZG9jcy9zZXJ2ZXIvbWlkZGxld2FyZXNcbiAgICAgICAqLyBtaWRkbGV3YXJlOiBjcmVhdGVNaWRkbGV3YXJlRmFjdG9yeSgpLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGUgYSByb3V0ZXJcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly90cnBjLmlvL2RvY3Mvc2VydmVyL3JvdXRlcnNcbiAgICAgICAqLyByb3V0ZXI6IGNvbmZpZy5jcmVhdGVSb3V0ZXJGYWN0b3J5KGNvbmZpZyQxKSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogTWVyZ2UgUm91dGVyc1xuICAgICAgICogQHNlZSBodHRwczovL3RycGMuaW8vZG9jcy9zZXJ2ZXIvbWVyZ2luZy1yb3V0ZXJzXG4gICAgICAgKi8gbWVyZ2VSb3V0ZXJzLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGUgYSBzZXJ2ZXItc2lkZSBjYWxsZXIgZm9yIGEgcm91dGVyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vdHJwYy5pby9kb2NzL3NlcnZlci9zZXJ2ZXItc2lkZS1jYWxsc1xuICAgICAgICovIGNyZWF0ZUNhbGxlckZhY3Rvcnk6IGNvbmZpZy5jcmVhdGVDYWxsZXJGYWN0b3J5KClcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5leHBvcnRzLmNhbGxQcm9jZWR1cmUgPSBjb25maWcuY2FsbFByb2NlZHVyZTtcbmV4cG9ydHMuY3JlYXRlQ2FsbGVyRmFjdG9yeSA9IGNvbmZpZy5jcmVhdGVDYWxsZXJGYWN0b3J5O1xuZXhwb3J0cy5kZWZhdWx0VHJhbnNmb3JtZXIgPSBjb25maWcuZGVmYXVsdFRyYW5zZm9ybWVyO1xuZXhwb3J0cy5nZXREYXRhVHJhbnNmb3JtZXIgPSBjb25maWcuZ2V0RGF0YVRyYW5zZm9ybWVyO1xuZXhwb3J0cy5wcm9jZWR1cmVUeXBlcyA9IGNvbmZpZy5wcm9jZWR1cmVUeXBlcztcbmV4cG9ydHMuVFJQQ0Vycm9yID0gVFJQQ0Vycm9yLlRSUENFcnJvcjtcbmV4cG9ydHMuZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24gPSBUUlBDRXJyb3IuZ2V0VFJQQ0Vycm9yRnJvbVVua25vd247XG5leHBvcnRzLmNyZWF0ZUlucHV0TWlkZGxld2FyZSA9IGNyZWF0ZUlucHV0TWlkZGxld2FyZTtcbmV4cG9ydHMuY3JlYXRlT3V0cHV0TWlkZGxld2FyZSA9IGNyZWF0ZU91dHB1dE1pZGRsZXdhcmU7XG5leHBvcnRzLmV4cGVyaW1lbnRhbF9zdGFuZGFsb25lTWlkZGxld2FyZSA9IGV4cGVyaW1lbnRhbF9zdGFuZGFsb25lTWlkZGxld2FyZTtcbmV4cG9ydHMuaW5pdFRSUEMgPSBpbml0VFJQQztcbmV4cG9ydHMucm91dGVyID0gcm91dGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBpZGVudGl0eSh4KSB7XG4gICAgcmV0dXJuIHg7XG59XG5cbi8qKiBAaW50ZXJuYWwgKi8gZnVuY3Rpb24gcGlwZUZyb21BcnJheShmbnMpIHtcbiAgICBpZiAoZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgIHJldHVybiBmbnNbMF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldiwgZm4pPT5mbihwcmV2KSwgaW5wdXQpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIGlzT2JzZXJ2YWJsZSh4KSB7XG4gICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4ICE9PSBudWxsICYmICdzdWJzY3JpYmUnIGluIHg7XG59XG5mdW5jdGlvbiBvYnNlcnZhYmxlKHN1YnNjcmliZSkge1xuICAgIGNvbnN0IHNlbGYgPSB7XG4gICAgICAgIHN1YnNjcmliZSAob2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIGxldCB0ZWFyZG93blJlZiA9IG51bGw7XG4gICAgICAgICAgICBsZXQgaXNEb25lID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgdW5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgdGVhcmRvd25JbW1lZGlhdGVseSA9IGZhbHNlO1xuICAgICAgICAgICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duUmVmID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duSW1tZWRpYXRlbHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVhcmRvd25SZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVhcmRvd25SZWYoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRlYXJkb3duUmVmKSB7XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duUmVmLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVhcmRvd25SZWYgPSBzdWJzY3JpYmUoe1xuICAgICAgICAgICAgICAgIG5leHQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0RvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0Py4odmFsdWUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3IgKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3I/LihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29tcGxldGUgKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGU/LigpO1xuICAgICAgICAgICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHRlYXJkb3duSW1tZWRpYXRlbHkpIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB1bnN1YnNjcmliZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgcGlwZSAoLi4ub3BlcmF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHBpcGVGcm9tQXJyYXkob3BlcmF0aW9ucykoc2VsZik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBzZWxmO1xufVxuXG5leHBvcnRzLmlzT2JzZXJ2YWJsZSA9IGlzT2JzZXJ2YWJsZTtcbmV4cG9ydHMub2JzZXJ2YWJsZSA9IG9ic2VydmFibGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBvYnNlcnZhYmxlID0gcmVxdWlyZSgnLi4vb2JzZXJ2YWJsZS00NjQxMTZhYy5qcycpO1xuXG5mdW5jdGlvbiBzaGFyZShfb3B0cykge1xuICAgIHJldHVybiAob3JpZ2luYWxPYnNlcnZlcik9PntcbiAgICAgICAgbGV0IHJlZkNvdW50ID0gMDtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIGNvbnN0IG9ic2VydmVycyA9IFtdO1xuICAgICAgICBmdW5jdGlvbiBzdGFydElmTmVlZGVkKCkge1xuICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbiA9IG9yaWdpbmFsT2JzZXJ2ZXIuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICBuZXh0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG9ic2VydmVyIG9mIG9ic2VydmVycyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0Py4odmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBvYnNlcnZlciBvZiBvYnNlcnZlcnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3I/LihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBvYnNlcnZlciBvZiBvYnNlcnZlcnMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGU/LigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gcmVzZXRJZk5lZWRlZCgpIHtcbiAgICAgICAgICAgIC8vIFwicmVzZXRPblJlZkNvdW50WmVyb1wiXG4gICAgICAgICAgICBpZiAocmVmQ291bnQgPT09IDAgJiYgc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3N1YiA9IHN1YnNjcmlwdGlvbjtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIF9zdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlIChvYnNlcnZlcikge1xuICAgICAgICAgICAgICAgIHJlZkNvdW50Kys7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJzLnB1c2gob2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIHN0YXJ0SWZOZWVkZWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB1bnN1YnNjcmliZSAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWZDb3VudC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRJZk5lZWRlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBvYnNlcnZlcnMuZmluZEluZGV4KCh2KT0+diA9PT0gb2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gbWFwKHByb2plY3QpIHtcbiAgICByZXR1cm4gKG9yaWdpbmFsT2JzZXJ2ZXIpPT57XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdWJzY3JpYmUgKG9ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBvcmlnaW5hbE9ic2VydmVyLnN1YnNjcmliZSh7XG4gICAgICAgICAgICAgICAgICAgIG5leHQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0Py4ocHJvamVjdCh2YWx1ZSwgaW5kZXgrKykpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvciAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yPy4oZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZSAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZT8uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHRhcChvYnNlcnZlcikge1xuICAgIHJldHVybiAob3JpZ2luYWxPYnNlcnZlcik9PntcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1YnNjcmliZSAob2JzZXJ2ZXIyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsT2JzZXJ2ZXIuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dD8uKHYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIyLm5leHQ/Lih2KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yPy4odik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcjIuZXJyb3I/Lih2KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUgKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGU/LigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIyLmNvbXBsZXRlPy4oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59XG5cbmNsYXNzIE9ic2VydmFibGVBYm9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2Upe1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ09ic2VydmFibGVBYm9ydEVycm9yJztcbiAgICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIE9ic2VydmFibGVBYm9ydEVycm9yLnByb3RvdHlwZSk7XG4gICAgfVxufVxuLyoqIEBpbnRlcm5hbCAqLyBmdW5jdGlvbiBvYnNlcnZhYmxlVG9Qcm9taXNlKG9ic2VydmFibGUpIHtcbiAgICBsZXQgYWJvcnQ7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgIGxldCBpc0RvbmUgPSBmYWxzZTtcbiAgICAgICAgZnVuY3Rpb24gb25Eb25lKCkge1xuICAgICAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlzRG9uZSA9IHRydWU7XG4gICAgICAgICAgICByZWplY3QobmV3IE9ic2VydmFibGVBYm9ydEVycm9yKCdUaGlzIG9wZXJhdGlvbiB3YXMgYWJvcnRlZC4nKSk7XG4gICAgICAgICAgICBvYnMkLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JzJCA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgIG5leHQgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgICAgICAgICAgICAgb25Eb25lKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3IgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlamVjdChkYXRhKTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21wbGV0ZSAoKSB7XG4gICAgICAgICAgICAgICAgaXNEb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBvbkRvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFib3J0ID0gb25Eb25lO1xuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICAgIHByb21pc2UsXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4gICAgICAgIGFib3J0OiBhYm9ydFxuICAgIH07XG59XG5cbmV4cG9ydHMuaXNPYnNlcnZhYmxlID0gb2JzZXJ2YWJsZS5pc09ic2VydmFibGU7XG5leHBvcnRzLm9ic2VydmFibGUgPSBvYnNlcnZhYmxlLm9ic2VydmFibGU7XG5leHBvcnRzLm1hcCA9IG1hcDtcbmV4cG9ydHMub2JzZXJ2YWJsZVRvUHJvbWlzZSA9IG9ic2VydmFibGVUb1Byb21pc2U7XG5leHBvcnRzLnNoYXJlID0gc2hhcmU7XG5leHBvcnRzLnRhcCA9IHRhcDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluZGV4ID0gcmVxdWlyZSgnLi9pbmRleC03ODRmZjY0Ny5qcycpO1xudmFyIGNvZGVzID0gcmVxdWlyZSgnLi9jb2Rlcy04N2Y2ODI0Yi5qcycpO1xuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGdldEVycm9yU2hhcGUob3B0cykge1xuICAgIGNvbnN0IHsgcGF0aCAsIGVycm9yICwgY29uZmlnICB9ID0gb3B0cztcbiAgICBjb25zdCB7IGNvZGUgIH0gPSBvcHRzLmVycm9yO1xuICAgIGNvbnN0IHNoYXBlID0ge1xuICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICBjb2RlOiBjb2Rlcy5UUlBDX0VSUk9SX0NPREVTX0JZX0tFWVtjb2RlXSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgIGh0dHBTdGF0dXM6IGluZGV4LmdldEhUVFBTdGF0dXNDb2RlRnJvbUVycm9yKGVycm9yKVxuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAoY29uZmlnLmlzRGV2ICYmIHR5cGVvZiBvcHRzLmVycm9yLnN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICBzaGFwZS5kYXRhLnN0YWNrID0gb3B0cy5lcnJvci5zdGFjaztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICBzaGFwZS5kYXRhLnBhdGggPSBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gY29uZmlnLmVycm9yRm9ybWF0dGVyKHtcbiAgICAgICAgLi4ub3B0cyxcbiAgICAgICAgc2hhcGVcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtVFJQQ1Jlc3BvbnNlSXRlbShjb25maWcsIGl0ZW0pIHtcbiAgICBpZiAoJ2Vycm9yJyBpbiBpdGVtKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgICAgZXJyb3I6IGNvbmZpZy50cmFuc2Zvcm1lci5vdXRwdXQuc2VyaWFsaXplKGl0ZW0uZXJyb3IpXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgnZGF0YScgaW4gaXRlbS5yZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICByZXN1bHQ6IHtcbiAgICAgICAgICAgICAgICAuLi5pdGVtLnJlc3VsdCxcbiAgICAgICAgICAgICAgICBkYXRhOiBjb25maWcudHJhbnNmb3JtZXIub3V0cHV0LnNlcmlhbGl6ZShpdGVtLnJlc3VsdC5kYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbn1cbi8qKlxuICogVGFrZXMgYSB1bnNlcmlhbGl6ZWQgYFRSUENSZXNwb25zZWAgYW5kIHNlcmlhbGl6ZXMgaXQgd2l0aCB0aGUgcm91dGVyJ3MgdHJhbnNmb3JtZXJzXG4gKiovIGZ1bmN0aW9uIHRyYW5zZm9ybVRSUENSZXNwb25zZShjb25maWcsIGl0ZW1Pckl0ZW1zKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoaXRlbU9ySXRlbXMpID8gaXRlbU9ySXRlbXMubWFwKChpdGVtKT0+dHJhbnNmb3JtVFJQQ1Jlc3BvbnNlSXRlbShjb25maWcsIGl0ZW0pKSA6IHRyYW5zZm9ybVRSUENSZXNwb25zZUl0ZW0oY29uZmlnLCBpdGVtT3JJdGVtcyk7XG59XG5cbmV4cG9ydHMuZ2V0RXJyb3JTaGFwZSA9IGdldEVycm9yU2hhcGU7XG5leHBvcnRzLnRyYW5zZm9ybVRSUENSZXNwb25zZSA9IHRyYW5zZm9ybVRSUENSZXNwb25zZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGluZGV4ID0gcmVxdWlyZSgnLi4vaW5kZXgtNzg0ZmY2NDcuanMnKTtcbnZhciB0cmFuc2Zvcm1UUlBDUmVzcG9uc2UgPSByZXF1aXJlKCcuLi90cmFuc2Zvcm1UUlBDUmVzcG9uc2UtZTY1ZjM0ZTkuanMnKTtcbnZhciBnZXRDYXVzZUZyb21Vbmtub3duID0gcmVxdWlyZSgnLi4vZ2V0Q2F1c2VGcm9tVW5rbm93bi1kNTM1MjY0YS5qcycpO1xucmVxdWlyZSgnLi4vY29kZXMtODdmNjgyNGIuanMnKTtcblxuXG5cbmV4cG9ydHMuY3JlYXRlRmxhdFByb3h5ID0gaW5kZXguY3JlYXRlRmxhdFByb3h5O1xuZXhwb3J0cy5jcmVhdGVSZWN1cnNpdmVQcm94eSA9IGluZGV4LmNyZWF0ZVJlY3Vyc2l2ZVByb3h5O1xuZXhwb3J0cy5nZXRFcnJvclNoYXBlID0gdHJhbnNmb3JtVFJQQ1Jlc3BvbnNlLmdldEVycm9yU2hhcGU7XG5leHBvcnRzLnRyYW5zZm9ybVRSUENSZXNwb25zZSA9IHRyYW5zZm9ybVRSUENSZXNwb25zZS50cmFuc2Zvcm1UUlBDUmVzcG9uc2U7XG5leHBvcnRzLmdldENhdXNlRnJvbVVua25vd24gPSBnZXRDYXVzZUZyb21Vbmtub3duLmdldENhdXNlRnJvbVVua25vd247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNUUlBDUmVxdWVzdFdpdGhJZCA9IGV4cG9ydHMuaXNUUlBDUmVxdWVzdCA9IGV4cG9ydHMuaXNUUlBDUmVzcG9uc2UgPSBleHBvcnRzLmlzVFJQQ01lc3NhZ2UgPSB2b2lkIDA7XG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn1cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKHgpIHtcbiAgICByZXR1cm4geCA9PT0gbnVsbCB8fCB4ID09PSB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiBpc1RSUENNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gQm9vbGVhbihpc1BsYWluT2JqZWN0KG1lc3NhZ2UpICYmICd0cnBjJyBpbiBtZXNzYWdlICYmIGlzUGxhaW5PYmplY3QobWVzc2FnZS50cnBjKSk7XG59XG5leHBvcnRzLmlzVFJQQ01lc3NhZ2UgPSBpc1RSUENNZXNzYWdlO1xuZnVuY3Rpb24gaXNUUlBDTWVzc2FnZVdpdGhJZChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIGlzVFJQQ01lc3NhZ2UobWVzc2FnZSkgJiYgJ2lkJyBpbiBtZXNzYWdlLnRycGMgJiYgIWlzTnVsbE9yVW5kZWZpbmVkKG1lc3NhZ2UudHJwYy5pZCk7XG59XG4vLyByZXBvbnNlIG5lZWRzIGVycm9yIG9yIHJlc3VsdFxuZnVuY3Rpb24gaXNUUlBDUmVzcG9uc2UobWVzc2FnZSkge1xuICAgIHJldHVybiBpc1RSUENNZXNzYWdlV2l0aElkKG1lc3NhZ2UpICYmICgnZXJyb3InIGluIG1lc3NhZ2UudHJwYyB8fCAncmVzdWx0JyBpbiBtZXNzYWdlLnRycGMpO1xufVxuZXhwb3J0cy5pc1RSUENSZXNwb25zZSA9IGlzVFJQQ1Jlc3BvbnNlO1xuLy8gcmVxdWVzdCBuZWVkcyBtZXRob2RcbmZ1bmN0aW9uIGlzVFJQQ1JlcXVlc3QobWVzc2FnZSkge1xuICAgIHJldHVybiBpc1RSUENNZXNzYWdlV2l0aElkKG1lc3NhZ2UpICYmICdtZXRob2QnIGluIG1lc3NhZ2UudHJwYztcbn1cbmV4cG9ydHMuaXNUUlBDUmVxdWVzdCA9IGlzVFJQQ1JlcXVlc3Q7XG5mdW5jdGlvbiBpc1RSUENSZXF1ZXN0V2l0aElkKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gaXNUUlBDUmVxdWVzdChtZXNzYWdlKSAmJiBpc1RSUENNZXNzYWdlV2l0aElkKG1lc3NhZ2UpO1xufVxuZXhwb3J0cy5pc1RSUENSZXF1ZXN0V2l0aElkID0gaXNUUlBDUmVxdWVzdFdpdGhJZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRycGNNZXNzYWdlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRFcnJvckZyb21Vbmtub3duID0gdm9pZCAwO1xuY29uc3Qgc2VydmVyXzEgPSByZXF1aXJlKFwiQHRycGMvc2VydmVyXCIpO1xuZnVuY3Rpb24gZ2V0RXJyb3JGcm9tVW5rbm93bihjYXVzZSkge1xuICAgIGlmIChjYXVzZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIGlmIChjYXVzZS5uYW1lID09PSAnVFJQQ0Vycm9yJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhdXNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVycm9yID0gbmV3IHNlcnZlcl8xLlRSUENFcnJvcih7XG4gICAgICAgICAgICBtZXNzYWdlOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyxcbiAgICAgICAgICAgIGNvZGU6ICdJTlRFUk5BTF9TRVJWRVJfRVJST1InLFxuICAgICAgICAgICAgY2F1c2U6IGNhdXNlLFxuICAgICAgICB9KTtcbiAgICAgICAgZXJyb3Iuc3RhY2sgPSBjYXVzZS5zdGFjaztcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHNlcnZlcl8xLlRSUENFcnJvcih7XG4gICAgICAgIG1lc3NhZ2U6ICdJbnRlcm5hbCBzZXJ2ZXIgZXJyb3InLFxuICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICB9KTtcbn1cbmV4cG9ydHMuZ2V0RXJyb3JGcm9tVW5rbm93biA9IGdldEVycm9yRnJvbVVua25vd247XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvcnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUNocm9tZUhhbmRsZXIgPSB2b2lkIDA7XG5jb25zdCBzZXJ2ZXJfMSA9IHJlcXVpcmUoXCJAdHJwYy9zZXJ2ZXJcIik7XG5jb25zdCBvYnNlcnZhYmxlXzEgPSByZXF1aXJlKFwiQHRycGMvc2VydmVyL29ic2VydmFibGVcIik7XG5jb25zdCBzaGFyZWRfMSA9IHJlcXVpcmUoXCJAdHJwYy9zZXJ2ZXIvc2hhcmVkXCIpO1xuY29uc3QgdHJwY01lc3NhZ2VfMSA9IHJlcXVpcmUoXCIuLi9zaGFyZWQvdHJwY01lc3NhZ2VcIik7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IGNyZWF0ZUNocm9tZUhhbmRsZXIgPSAob3B0cykgPT4ge1xuICAgIGNvbnN0IHsgcm91dGVyLCBjcmVhdGVDb250ZXh0LCBvbkVycm9yLCBjaHJvbWUgPSBnbG9iYWwuY2hyb21lIH0gPSBvcHRzO1xuICAgIGlmICghY2hyb21lKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlNraXBwaW5nIGNocm9tZSBoYW5kbGVyIGNyZWF0aW9uOiAnb3B0cy5jaHJvbWUnIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcigocG9ydCkgPT4ge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50XG4gICAgICAgIGNvbnN0IHsgdHJhbnNmb3JtZXIgfSA9IHJvdXRlci5fZGVmLl9jb25maWc7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuICAgICAgICBjb25zdCBjbGVhbnVwID0gKCkgPT4gbGlzdGVuZXJzLmZvckVhY2goKHVuc3ViKSA9PiB1bnN1YigpKTtcbiAgICAgICAgcG9ydC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoY2xlYW51cCk7XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKCgpID0+IHBvcnQub25EaXNjb25uZWN0LnJlbW92ZUxpc3RlbmVyKGNsZWFudXApKTtcbiAgICAgICAgY29uc3Qgb25NZXNzYWdlID0gYXN5bmMgKG1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIGlmICghcG9ydCB8fCAhKDAsIHRycGNNZXNzYWdlXzEuaXNUUlBDUmVxdWVzdFdpdGhJZCkobWVzc2FnZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgeyB0cnBjIH0gPSBtZXNzYWdlO1xuICAgICAgICAgICAgY29uc3Qgc2VuZFJlc3BvbnNlID0gKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIHRycGM6IE9iamVjdC5hc3NpZ24oeyBpZDogdHJwYy5pZCwganNvbnJwYzogdHJwYy5qc29ucnBjIH0sIHJlc3BvbnNlKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodHJwYy5tZXRob2QgPT09ICdzdWJzY3JpcHRpb24uc3RvcCcpIHtcbiAgICAgICAgICAgICAgICAoX2EgPSBzdWJzY3JpcHRpb25zLmdldCh0cnBjLmlkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5kZWxldGUodHJwYy5pZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RvcHBlZCcgfSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgbWV0aG9kLCBwYXJhbXMsIGlkIH0gPSB0cnBjO1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gYXdhaXQgKGNyZWF0ZUNvbnRleHQgPT09IG51bGwgfHwgY3JlYXRlQ29udGV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3JlYXRlQ29udGV4dCh7IHJlcTogcG9ydCwgcmVzOiB1bmRlZmluZWQgfSkpO1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlRXJyb3IgPSAoY2F1c2UpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9ICgwLCBlcnJvcnNfMS5nZXRFcnJvckZyb21Vbmtub3duKShjYXVzZSk7XG4gICAgICAgICAgICAgICAgb25FcnJvciA9PT0gbnVsbCB8fCBvbkVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvbkVycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcGFyYW1zLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwYXJhbXMuaW5wdXQsXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgcmVxOiBwb3J0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnRcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICgwLCBzaGFyZWRfMS5nZXRFcnJvclNoYXBlKSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IHJvdXRlci5fZGVmLl9jb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHBhcmFtcy5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBhcmFtcy5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50LCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3MsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0ID0gdHJhbnNmb3JtZXIuaW5wdXQuZGVzZXJpYWxpemUodHJwYy5wYXJhbXMuaW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhbGxlciA9IHJvdXRlci5jcmVhdGVDYWxsZXIoY3R4KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9jZWR1cmVGbiA9IHRycGMucGFyYW1zLnBhdGhcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KCcuJylcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtbWVtYmVyLWFjY2VzcywgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1yZXR1cm4sIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBzZWdtZW50KSA9PiBhY2Nbc2VnbWVudF0sIGNhbGxlcik7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXJndW1lbnRcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwcm9jZWR1cmVGbihpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKHRycGMubWV0aG9kICE9PSAnc3Vic2NyaXB0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnQsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtbWVtYmVyLWFjY2VzcywgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1jYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHsgdHlwZTogJ2RhdGEnLCBkYXRhOiB0cmFuc2Zvcm1lci5vdXRwdXQuc2VyaWFsaXplKHJlc3VsdCkgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghKDAsIG9ic2VydmFibGVfMS5pc09ic2VydmFibGUpKHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IHNlcnZlcl8xLlRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBgU3Vic2NyaXB0aW9uICR7cGFyYW1zLnBhdGh9IGRpZCBub3QgcmV0dXJuIGFuIG9ic2VydmFibGVgLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSByZXN1bHQuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dDogKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWREYXRhID0gdHJhbnNmb3JtZXIub3V0cHV0LnNlcmlhbGl6ZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnZGF0YScsIGRhdGE6IHNlcmlhbGl6ZWREYXRhIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBoYW5kbGVFcnJvcixcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RvcHBlZCcgfSB9KSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9ucy5oYXMoaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyByZXN1bHQ6IHsgdHlwZTogJ3N0b3BwZWQnIH0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBzZXJ2ZXJfMS5UUlBDRXJyb3IoeyBtZXNzYWdlOiBgRHVwbGljYXRlIGlkICR7aWR9YCwgY29kZTogJ0JBRF9SRVFVRVNUJyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLnB1c2goKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbnMuc2V0KGlkLCBzdWJzY3JpcHRpb24pO1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RhcnRlZCcgfSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKGNhdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIob25NZXNzYWdlKTtcbiAgICAgICAgbGlzdGVuZXJzLnB1c2goKCkgPT4gcG9ydC5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIob25NZXNzYWdlKSk7XG4gICAgfSk7XG59O1xuZXhwb3J0cy5jcmVhdGVDaHJvbWVIYW5kbGVyID0gY3JlYXRlQ2hyb21lSGFuZGxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNocm9tZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVFJQQ19CUk9XU0VSX0xPQURFRF9FVkVOVCA9IHZvaWQgMDtcbmV4cG9ydHMuVFJQQ19CUk9XU0VSX0xPQURFRF9FVkVOVCA9ICdUUlBDX0JST1dTRVI6OlBPUFVQX0xPQURFRCc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZVdpbmRvd0hhbmRsZXIgPSB2b2lkIDA7XG5jb25zdCBzZXJ2ZXJfMSA9IHJlcXVpcmUoXCJAdHJwYy9zZXJ2ZXJcIik7XG5jb25zdCBvYnNlcnZhYmxlXzEgPSByZXF1aXJlKFwiQHRycGMvc2VydmVyL29ic2VydmFibGVcIik7XG5jb25zdCBzaGFyZWRfMSA9IHJlcXVpcmUoXCJAdHJwYy9zZXJ2ZXIvc2hhcmVkXCIpO1xuY29uc3QgY29uc3RhbnRzXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL2NvbnN0YW50c1wiKTtcbmNvbnN0IHRycGNNZXNzYWdlXzEgPSByZXF1aXJlKFwiLi4vc2hhcmVkL3RycGNNZXNzYWdlXCIpO1xuY29uc3QgZXJyb3JzXzEgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG5jb25zdCBjcmVhdGVXaW5kb3dIYW5kbGVyID0gKG9wdHMpID0+IHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGNvbnN0IHsgcm91dGVyLCBjcmVhdGVDb250ZXh0LCBvbkVycm9yLCB3aW5kb3csIHBvc3RPcmlnaW4gfSA9IG9wdHM7XG4gICAgaWYgKCF3aW5kb3cpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiU2tpcHBpbmcgd2luZG93IGhhbmRsZXIgY3JlYXRpb246ICdvcHRzLndpbmRvdycgbm90IGRlZmluZWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbG9hZExpc3RlbmVyID0gKF9iID0gKF9hID0gb3B0cy5wb3N0V2luZG93KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB3aW5kb3cub3BlbmVyKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiB3aW5kb3c7XG4gICAgbG9hZExpc3RlbmVyLnBvc3RNZXNzYWdlKGNvbnN0YW50c18xLlRSUENfQlJPV1NFUl9MT0FERURfRVZFTlQsIHsgdGFyZ2V0T3JpZ2luOiBwb3N0T3JpZ2luIH0pO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnRcbiAgICBjb25zdCB7IHRyYW5zZm9ybWVyIH0gPSByb3V0ZXIuX2RlZi5fY29uZmlnO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gW107XG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IGxpc3RlbmVycy5mb3JFYWNoKCh1bnN1YikgPT4gdW5zdWIoKSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2JlZm9yZXVubG9hZCcsIGNsZWFudXApO1xuICAgIGxpc3RlbmVycy5wdXNoKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnLCBjbGVhbnVwKSk7XG4gICAgY29uc3Qgb25NZXNzYWdlID0gYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICBjb25zdCB7IGRhdGE6IG1lc3NhZ2UsIHNvdXJjZSB9ID0gZXZlbnQ7XG4gICAgICAgIGNvbnN0IHBvc3RXaW5kb3cgPSAoX2IgPSAoX2EgPSBvcHRzLnBvc3RXaW5kb3cpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHNvdXJjZSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogd2luZG93O1xuICAgICAgICBpZiAoIXBvc3RXaW5kb3cgfHwgISgwLCB0cnBjTWVzc2FnZV8xLmlzVFJQQ1JlcXVlc3RXaXRoSWQpKG1lc3NhZ2UpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCB7IHRycGMgfSA9IG1lc3NhZ2U7XG4gICAgICAgIGNvbnN0IHNlbmRSZXNwb25zZSA9IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgcG9zdFdpbmRvdy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHJwYzogT2JqZWN0LmFzc2lnbih7IGlkOiB0cnBjLmlkLCBqc29ucnBjOiB0cnBjLmpzb25ycGMgfSwgcmVzcG9uc2UpLFxuICAgICAgICAgICAgfSwgeyB0YXJnZXRPcmlnaW46IHBvc3RPcmlnaW4gfSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0cnBjLm1ldGhvZCA9PT0gJ3N1YnNjcmlwdGlvbi5zdG9wJykge1xuICAgICAgICAgICAgKF9jID0gc3Vic2NyaXB0aW9ucy5nZXQodHJwYy5pZCkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9ucy5kZWxldGUodHJwYy5pZCk7XG4gICAgICAgICAgICByZXR1cm4gc2VuZFJlc3BvbnNlKHsgcmVzdWx0OiB7IHR5cGU6ICdzdG9wcGVkJyB9IH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgbWV0aG9kLCBwYXJhbXMsIGlkIH0gPSB0cnBjO1xuICAgICAgICBjb25zdCBjdHggPSBhd2FpdCAoY3JlYXRlQ29udGV4dCA9PT0gbnVsbCB8fCBjcmVhdGVDb250ZXh0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjcmVhdGVDb250ZXh0KHsgcmVxOiB7IG9yaWdpbjogZXZlbnQub3JpZ2luIH0sIHJlczogdW5kZWZpbmVkIH0pKTtcbiAgICAgICAgY29uc3QgaGFuZGxlRXJyb3IgPSAoY2F1c2UpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gKDAsIGVycm9yc18xLmdldEVycm9yRnJvbVVua25vd24pKGNhdXNlKTtcbiAgICAgICAgICAgIG9uRXJyb3IgPT09IG51bGwgfHwgb25FcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25FcnJvcih7XG4gICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgdHlwZTogbWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhcmFtcy5wYXRoLFxuICAgICAgICAgICAgICAgIGlucHV0OiBwYXJhbXMuaW5wdXQsXG4gICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgIHJlcTogeyBvcmlnaW46IGV2ZW50Lm9yaWdpbiB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnRcbiAgICAgICAgICAgICAgICBlcnJvcjogKDAsIHNoYXJlZF8xLmdldEVycm9yU2hhcGUpKHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnOiByb3V0ZXIuX2RlZi5fY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBwYXJhbXMucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBhcmFtcy5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50LCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3MsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0cmFuc2Zvcm1lci5pbnB1dC5kZXNlcmlhbGl6ZSh0cnBjLnBhcmFtcy5pbnB1dCk7XG4gICAgICAgICAgICBjb25zdCBjYWxsZXIgPSByb3V0ZXIuY3JlYXRlQ2FsbGVyKGN0eCk7XG4gICAgICAgICAgICBjb25zdCBwcm9jZWR1cmVGbiA9IHRycGMucGFyYW1zLnBhdGhcbiAgICAgICAgICAgICAgICAuc3BsaXQoJy4nKVxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3MsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtcmV0dXJuLCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBzZWdtZW50KSA9PiBhY2Nbc2VnbWVudF0sIGNhbGxlcik7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hcmd1bWVudFxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcHJvY2VkdXJlRm4oaW5wdXQpO1xuICAgICAgICAgICAgaWYgKHRycGMubWV0aG9kICE9PSAnc3Vic2NyaXB0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVuc2FmZS1hc3NpZ25tZW50LCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3MsIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IHsgdHlwZTogJ2RhdGEnLCBkYXRhOiB0cmFuc2Zvcm1lci5vdXRwdXQuc2VyaWFsaXplKHJlc3VsdCkgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKDAsIG9ic2VydmFibGVfMS5pc09ic2VydmFibGUpKHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgc2VydmVyXzEuVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFN1YnNjcmlwdGlvbiAke3BhcmFtcy5wYXRofSBkaWQgbm90IHJldHVybiBhbiBvYnNlcnZhYmxlYCxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSByZXN1bHQuc3Vic2NyaWJlKHtcbiAgICAgICAgICAgICAgICBuZXh0OiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXJpYWxpemVkRGF0YSA9IHRyYW5zZm9ybWVyLm91dHB1dC5zZXJpYWxpemUoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnZGF0YScsIGRhdGE6IHNlcmlhbGl6ZWREYXRhIH0gfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogaGFuZGxlRXJyb3IsXG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RvcHBlZCcgfSB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN1YnNjcmlwdGlvbnMuaGFzKGlkKSkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RvcHBlZCcgfSB9KTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgc2VydmVyXzEuVFJQQ0Vycm9yKHsgbWVzc2FnZTogYER1cGxpY2F0ZSBpZCAke2lkfWAsIGNvZGU6ICdCQURfUkVRVUVTVCcgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0ZW5lcnMucHVzaCgoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLnNldChpZCwgc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHJlc3VsdDogeyB0eXBlOiAnc3RhcnRlZCcgfSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgICAgIGhhbmRsZUVycm9yKGNhdXNlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1lc3NhZ2UpO1xuICAgIGxpc3RlbmVycy5wdXNoKCgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25NZXNzYWdlKSk7XG59O1xuZXhwb3J0cy5jcmVhdGVXaW5kb3dIYW5kbGVyID0gY3JlYXRlV2luZG93SGFuZGxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdpbmRvdy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2Nocm9tZVwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vd2luZG93XCIpLCBleHBvcnRzKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qKlxuICogQGludGVybmFsXG4gKi8gZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICAvLyBjaGVjayB0aGF0IHZhbHVlIGlzIG9iamVjdFxuICAgIHJldHVybiAhIXZhbHVlICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xufVxuXG5jbGFzcyBVbmtub3duQ2F1c2VFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbmZ1bmN0aW9uIGdldENhdXNlRnJvbVVua25vd24oY2F1c2UpIHtcbiAgICBpZiAoY2F1c2UgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICByZXR1cm4gY2F1c2U7XG4gICAgfVxuICAgIGNvbnN0IHR5cGUgPSB0eXBlb2YgY2F1c2U7XG4gICAgaWYgKHR5cGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGUgPT09ICdmdW5jdGlvbicgfHwgY2F1c2UgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUHJpbWl0aXZlIHR5cGVzIGp1c3QgZ2V0IHdyYXBwZWQgaW4gYW4gZXJyb3JcbiAgICBpZiAodHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihTdHJpbmcoY2F1c2UpKTtcbiAgICB9XG4gICAgLy8gSWYgaXQncyBhbiBvYmplY3QsIHdlJ2xsIGNyZWF0ZSBhIHN5bnRoZXRpYyBlcnJvclxuICAgIGlmIChpc09iamVjdChjYXVzZSkpIHtcbiAgICAgICAgY29uc3QgZXJyID0gbmV3IFVua25vd25DYXVzZUVycm9yKCk7XG4gICAgICAgIGZvcihjb25zdCBrZXkgaW4gY2F1c2Upe1xuICAgICAgICAgICAgZXJyW2tleV0gPSBjYXVzZVtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnI7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCB7IGdldENhdXNlRnJvbVVua25vd24gYXMgZyB9O1xuIiwiaW1wb3J0IHsgZyBhcyBnZXRDYXVzZUZyb21Vbmtub3duIH0gZnJvbSAnLi9nZXRDYXVzZUZyb21Vbmtub3duLTJkNjY0MTRhLm1qcyc7XG5cbmZ1bmN0aW9uIGdldFRSUENFcnJvckZyb21Vbmtub3duKGNhdXNlKSB7XG4gICAgaWYgKGNhdXNlIGluc3RhbmNlb2YgVFJQQ0Vycm9yKSB7XG4gICAgICAgIHJldHVybiBjYXVzZTtcbiAgICB9XG4gICAgaWYgKGNhdXNlIGluc3RhbmNlb2YgRXJyb3IgJiYgY2F1c2UubmFtZSA9PT0gJ1RSUENFcnJvcicpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RycGMvdHJwYy9wdWxsLzQ4NDhcbiAgICAgICAgcmV0dXJuIGNhdXNlO1xuICAgIH1cbiAgICBjb25zdCB0cnBjRXJyb3IgPSBuZXcgVFJQQ0Vycm9yKHtcbiAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgIGNhdXNlXG4gICAgfSk7XG4gICAgLy8gSW5oZXJpdCBzdGFjayBmcm9tIGVycm9yXG4gICAgaWYgKGNhdXNlIGluc3RhbmNlb2YgRXJyb3IgJiYgY2F1c2Uuc3RhY2spIHtcbiAgICAgICAgdHJwY0Vycm9yLnN0YWNrID0gY2F1c2Uuc3RhY2s7XG4gICAgfVxuICAgIHJldHVybiB0cnBjRXJyb3I7XG59XG5jbGFzcyBUUlBDRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3Iob3B0cyl7XG4gICAgICAgIGNvbnN0IGNhdXNlID0gZ2V0Q2F1c2VGcm9tVW5rbm93bihvcHRzLmNhdXNlKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG9wdHMubWVzc2FnZSA/PyBjYXVzZT8ubWVzc2FnZSA/PyBvcHRzLmNvZGU7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnRcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1lcnJvci1jYXVzZVxuICAgICAgICBzdXBlcihtZXNzYWdlLCB7XG4gICAgICAgICAgICBjYXVzZVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb2RlID0gb3B0cy5jb2RlO1xuICAgICAgICB0aGlzLm5hbWUgPSAnVFJQQ0Vycm9yJztcbiAgICAgICAgaWYgKCF0aGlzLmNhdXNlKSB7XG4gICAgICAgICAgICAvLyA8IEVTMjAyMiAvIDwgTm9kZSAxNi45LjAgY29tcGF0YWJpbGl0eVxuICAgICAgICAgICAgdGhpcy5jYXVzZSA9IGNhdXNlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBUUlBDRXJyb3IgYXMgVCwgZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24gYXMgZyB9O1xuIiwiLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBpbnZlcnQob2JqKSB7XG4gICAgY29uc3QgbmV3T2JqID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBmb3IoY29uc3Qga2V5IGluIG9iail7XG4gICAgICAgIGNvbnN0IHYgPSBvYmpba2V5XTtcbiAgICAgICAgbmV3T2JqW3ZdID0ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqO1xufVxuXG4vLyByZWZlcmVuY2U6IGh0dHBzOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb25cbi8qKlxuICogSlNPTi1SUEMgMi4wIEVycm9yIGNvZGVzXG4gKlxuICogYC0zMjAwMGAgdG8gYC0zMjA5OWAgYXJlIHJlc2VydmVkIGZvciBpbXBsZW1lbnRhdGlvbi1kZWZpbmVkIHNlcnZlci1lcnJvcnMuXG4gKiBGb3IgdFJQQyB3ZSdyZSBjb3B5aW5nIHRoZSBsYXN0IGRpZ2l0cyBvZiBIVFRQIDRYWCBlcnJvcnMuXG4gKi8gY29uc3QgVFJQQ19FUlJPUl9DT0RFU19CWV9LRVkgPSB7XG4gICAgLyoqXG4gICAqIEludmFsaWQgSlNPTiB3YXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZlci5cbiAgICogQW4gZXJyb3Igb2NjdXJyZWQgb24gdGhlIHNlcnZlciB3aGlsZSBwYXJzaW5nIHRoZSBKU09OIHRleHQuXG4gICAqLyBQQVJTRV9FUlJPUjogLTMyNzAwLFxuICAgIC8qKlxuICAgKiBUaGUgSlNPTiBzZW50IGlzIG5vdCBhIHZhbGlkIFJlcXVlc3Qgb2JqZWN0LlxuICAgKi8gQkFEX1JFUVVFU1Q6IC0zMjYwMCxcbiAgICAvLyBJbnRlcm5hbCBKU09OLVJQQyBlcnJvclxuICAgIElOVEVSTkFMX1NFUlZFUl9FUlJPUjogLTMyNjAzLFxuICAgIE5PVF9JTVBMRU1FTlRFRDogLTMyNjAzLFxuICAgIC8vIEltcGxlbWVudGF0aW9uIHNwZWNpZmljIGVycm9yc1xuICAgIFVOQVVUSE9SSVpFRDogLTMyMDAxLFxuICAgIEZPUkJJRERFTjogLTMyMDAzLFxuICAgIE5PVF9GT1VORDogLTMyMDA0LFxuICAgIE1FVEhPRF9OT1RfU1VQUE9SVEVEOiAtMzIwMDUsXG4gICAgVElNRU9VVDogLTMyMDA4LFxuICAgIENPTkZMSUNUOiAtMzIwMDksXG4gICAgUFJFQ09ORElUSU9OX0ZBSUxFRDogLTMyMDEyLFxuICAgIFBBWUxPQURfVE9PX0xBUkdFOiAtMzIwMTMsXG4gICAgVU5QUk9DRVNTQUJMRV9DT05URU5UOiAtMzIwMjIsXG4gICAgVE9PX01BTllfUkVRVUVTVFM6IC0zMjAyOSxcbiAgICBDTElFTlRfQ0xPU0VEX1JFUVVFU1Q6IC0zMjA5OVxufTtcbmNvbnN0IFRSUENfRVJST1JfQ09ERVNfQllfTlVNQkVSID0gaW52ZXJ0KFRSUENfRVJST1JfQ09ERVNfQllfS0VZKTtcblxuZXhwb3J0IHsgVFJQQ19FUlJPUl9DT0RFU19CWV9LRVkgYXMgVCwgVFJQQ19FUlJPUl9DT0RFU19CWV9OVU1CRVIgYXMgYSwgaW52ZXJ0IGFzIGkgfTtcbiIsImltcG9ydCB7IGkgYXMgaW52ZXJ0LCBUIGFzIFRSUENfRVJST1JfQ09ERVNfQllfS0VZIH0gZnJvbSAnLi9jb2Rlcy1jOTI0YzNkYi5tanMnO1xuXG5jb25zdCBUUlBDX0VSUk9SX0NPREVTX0JZX05VTUJFUiA9IGludmVydChUUlBDX0VSUk9SX0NPREVTX0JZX0tFWSk7XG5jb25zdCBKU09OUlBDMl9UT19IVFRQX0NPREUgPSB7XG4gICAgUEFSU0VfRVJST1I6IDQwMCxcbiAgICBCQURfUkVRVUVTVDogNDAwLFxuICAgIFVOQVVUSE9SSVpFRDogNDAxLFxuICAgIE5PVF9GT1VORDogNDA0LFxuICAgIEZPUkJJRERFTjogNDAzLFxuICAgIE1FVEhPRF9OT1RfU1VQUE9SVEVEOiA0MDUsXG4gICAgVElNRU9VVDogNDA4LFxuICAgIENPTkZMSUNUOiA0MDksXG4gICAgUFJFQ09ORElUSU9OX0ZBSUxFRDogNDEyLFxuICAgIFBBWUxPQURfVE9PX0xBUkdFOiA0MTMsXG4gICAgVU5QUk9DRVNTQUJMRV9DT05URU5UOiA0MjIsXG4gICAgVE9PX01BTllfUkVRVUVTVFM6IDQyOSxcbiAgICBDTElFTlRfQ0xPU0VEX1JFUVVFU1Q6IDQ5OSxcbiAgICBJTlRFUk5BTF9TRVJWRVJfRVJST1I6IDUwMCxcbiAgICBOT1RfSU1QTEVNRU5URUQ6IDUwMVxufTtcbmZ1bmN0aW9uIGdldFN0YXR1c0NvZGVGcm9tS2V5KGNvZGUpIHtcbiAgICByZXR1cm4gSlNPTlJQQzJfVE9fSFRUUF9DT0RFW2NvZGVdID8/IDUwMDtcbn1cbmZ1bmN0aW9uIGdldEhUVFBTdGF0dXNDb2RlKGpzb24pIHtcbiAgICBjb25zdCBhcnIgPSBBcnJheS5pc0FycmF5KGpzb24pID8ganNvbiA6IFtcbiAgICAgICAganNvblxuICAgIF07XG4gICAgY29uc3QgaHR0cFN0YXR1c2VzID0gbmV3IFNldChhcnIubWFwKChyZXMpPT57XG4gICAgICAgIGlmICgnZXJyb3InIGluIHJlcykge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlcy5lcnJvci5kYXRhO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmh0dHBTdGF0dXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGEuaHR0cFN0YXR1cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBUUlBDX0VSUk9SX0NPREVTX0JZX05VTUJFUltyZXMuZXJyb3IuY29kZV07XG4gICAgICAgICAgICByZXR1cm4gZ2V0U3RhdHVzQ29kZUZyb21LZXkoY29kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDIwMDtcbiAgICB9KSk7XG4gICAgaWYgKGh0dHBTdGF0dXNlcy5zaXplICE9PSAxKSB7XG4gICAgICAgIHJldHVybiAyMDc7XG4gICAgfVxuICAgIGNvbnN0IGh0dHBTdGF0dXMgPSBodHRwU3RhdHVzZXMudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xuICAgIHJldHVybiBodHRwU3RhdHVzO1xufVxuZnVuY3Rpb24gZ2V0SFRUUFN0YXR1c0NvZGVGcm9tRXJyb3IoZXJyb3IpIHtcbiAgICByZXR1cm4gZ2V0U3RhdHVzQ29kZUZyb21LZXkoZXJyb3IuY29kZSk7XG59XG5cbmNvbnN0IG5vb3AgPSAoKT0+e1xuLy8gbm9vcFxufTtcbmZ1bmN0aW9uIGNyZWF0ZUlubmVyUHJveHkoY2FsbGJhY2ssIHBhdGgpIHtcbiAgICBjb25zdCBwcm94eSA9IG5ldyBQcm94eShub29wLCB7XG4gICAgICAgIGdldCAoX29iaiwga2V5KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgfHwga2V5ID09PSAndGhlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIGlmIHRoZSBwcm94eSBpcyBhY2NpZGVudGFsbHkgdHJlYXRlZFxuICAgICAgICAgICAgICAgIC8vIGxpa2UgYSBQcm9taXNlTGlrZSAobGlrZSBpbiBgUHJvbWlzZS5yZXNvbHZlKHByb3h5KWApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVJbm5lclByb3h5KGNhbGxiYWNrLCBbXG4gICAgICAgICAgICAgICAgLi4ucGF0aCxcbiAgICAgICAgICAgICAgICBrZXlcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9LFxuICAgICAgICBhcHBseSAoXzEsIF8yLCBhcmdzKSB7XG4gICAgICAgICAgICBjb25zdCBpc0FwcGx5ID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdID09PSAnYXBwbHknO1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICBhcmdzOiBpc0FwcGx5ID8gYXJncy5sZW5ndGggPj0gMiA/IGFyZ3NbMV0gOiBbXSA6IGFyZ3MsXG4gICAgICAgICAgICAgICAgcGF0aDogaXNBcHBseSA/IHBhdGguc2xpY2UoMCwgLTEpIDogcGF0aFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJveHk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBwcm94eSB0aGF0IGNhbGxzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBwYXRoIGFuZCBhcmd1bWVudHNcbiAqXG4gKiBAaW50ZXJuYWxcbiAqLyBjb25zdCBjcmVhdGVSZWN1cnNpdmVQcm94eSA9IChjYWxsYmFjayk9PmNyZWF0ZUlubmVyUHJveHkoY2FsbGJhY2ssIFtdKTtcbi8qKlxuICogVXNlZCBpbiBwbGFjZSBvZiBgbmV3IFByb3h5YCB3aGVyZSBlYWNoIGhhbmRsZXIgd2lsbCBtYXAgMSBsZXZlbCBkZWVwIHRvIGFub3RoZXIgdmFsdWUuXG4gKlxuICogQGludGVybmFsXG4gKi8gY29uc3QgY3JlYXRlRmxhdFByb3h5ID0gKGNhbGxiYWNrKT0+e1xuICAgIHJldHVybiBuZXcgUHJveHkobm9vcCwge1xuICAgICAgICBnZXQgKF9vYmosIG5hbWUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgbmFtZSA9PT0gJ3RoZW4nKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBpZiB0aGUgcHJveHkgaXMgYWNjaWRlbnRhbGx5IHRyZWF0ZWRcbiAgICAgICAgICAgICAgICAvLyBsaWtlIGEgUHJvbWlzZUxpa2UgKGxpa2UgaW4gYFByb21pc2UucmVzb2x2ZShwcm94eSlgKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobmFtZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmV4cG9ydCB7IFRSUENfRVJST1JfQ09ERVNfQllfTlVNQkVSIGFzIFQsIGNyZWF0ZVJlY3Vyc2l2ZVByb3h5IGFzIGEsIGdldEhUVFBTdGF0dXNDb2RlIGFzIGIsIGNyZWF0ZUZsYXRQcm94eSBhcyBjLCBnZXRIVFRQU3RhdHVzQ29kZUZyb21FcnJvciBhcyBnIH07XG4iLCJpbXBvcnQgeyBUIGFzIFRSUENFcnJvciB9IGZyb20gJy4vVFJQQ0Vycm9yLTk4ZDQ0NzU4Lm1qcyc7XG5pbXBvcnQgeyBhIGFzIGNyZWF0ZVJlY3Vyc2l2ZVByb3h5LCBnIGFzIGdldEhUVFBTdGF0dXNDb2RlRnJvbUVycm9yIH0gZnJvbSAnLi9pbmRleC1mOTFkNzIwYy5tanMnO1xuaW1wb3J0IHsgVCBhcyBUUlBDX0VSUk9SX0NPREVTX0JZX0tFWSB9IGZyb20gJy4vY29kZXMtYzkyNGMzZGIubWpzJztcblxuLyoqXG4gKiBAcHVibGljXG4gKi8gLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBnZXREYXRhVHJhbnNmb3JtZXIodHJhbnNmb3JtZXIpIHtcbiAgICBpZiAoJ2lucHV0JyBpbiB0cmFuc2Zvcm1lcikge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGlucHV0OiB0cmFuc2Zvcm1lcixcbiAgICAgICAgb3V0cHV0OiB0cmFuc2Zvcm1lclxuICAgIH07XG59XG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGNvbnN0IGRlZmF1bHRUcmFuc2Zvcm1lciA9IHtcbiAgICBfZGVmYXVsdDogdHJ1ZSxcbiAgICBpbnB1dDoge1xuICAgICAgICBzZXJpYWxpemU6IChvYmopPT5vYmosXG4gICAgICAgIGRlc2VyaWFsaXplOiAob2JqKT0+b2JqXG4gICAgfSxcbiAgICBvdXRwdXQ6IHtcbiAgICAgICAgc2VyaWFsaXplOiAob2JqKT0+b2JqLFxuICAgICAgICBkZXNlcmlhbGl6ZTogKG9iaik9Pm9ialxuICAgIH1cbn07XG5cbmNvbnN0IGRlZmF1bHRGb3JtYXR0ZXIgPSAoeyBzaGFwZSAgfSk9PntcbiAgICByZXR1cm4gc2hhcGU7XG59O1xuXG4vKipcbiAqIENyZWF0ZSBhbiBvYmplY3Qgd2l0aG91dCBpbmhlcml0aW5nIGFueXRoaW5nIGZyb20gYE9iamVjdC5wcm90b3R5cGVgXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBvbWl0UHJvdG90eXBlKG9iaikge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIG9iaik7XG59XG5cbmNvbnN0IHByb2NlZHVyZVR5cGVzID0gW1xuICAgICdxdWVyeScsXG4gICAgJ211dGF0aW9uJyxcbiAgICAnc3Vic2NyaXB0aW9uJ1xuXTtcblxuZnVuY3Rpb24gaXNSb3V0ZXIocHJvY2VkdXJlT3JSb3V0ZXIpIHtcbiAgICByZXR1cm4gJ3JvdXRlcicgaW4gcHJvY2VkdXJlT3JSb3V0ZXIuX2RlZjtcbn1cbmNvbnN0IGVtcHR5Um91dGVyID0ge1xuICAgIF9jdHg6IG51bGwsXG4gICAgX2Vycm9yU2hhcGU6IG51bGwsXG4gICAgX21ldGE6IG51bGwsXG4gICAgcXVlcmllczoge30sXG4gICAgbXV0YXRpb25zOiB7fSxcbiAgICBzdWJzY3JpcHRpb25zOiB7fSxcbiAgICBlcnJvckZvcm1hdHRlcjogZGVmYXVsdEZvcm1hdHRlcixcbiAgICB0cmFuc2Zvcm1lcjogZGVmYXVsdFRyYW5zZm9ybWVyXG59O1xuLyoqXG4gKiBSZXNlcnZlZCB3b3JkcyB0aGF0IGNhbid0IGJlIHVzZWQgYXMgcm91dGVyIG9yIHByb2NlZHVyZSBuYW1lc1xuICovIGNvbnN0IHJlc2VydmVkV29yZHMgPSBbXG4gICAgLyoqXG4gICAqIFRoZW4gaXMgYSByZXNlcnZlZCB3b3JkIGJlY2F1c2Ugb3RoZXJ3aXNlIHdlIGNhbid0IHJldHVybiBhIHByb21pc2UgdGhhdCByZXR1cm5zIGEgUHJveHlcbiAgICogc2luY2UgSlMgd2lsbCB0aGluayB0aGF0IGAudGhlbmAgaXMgc29tZXRoaW5nIHRoYXQgZXhpc3RzXG4gICAqLyAndGhlbidcbl07XG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGNyZWF0ZVJvdXRlckZhY3RvcnkoY29uZmlnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZVJvdXRlcklubmVyKHByb2NlZHVyZXMpIHtcbiAgICAgICAgY29uc3QgcmVzZXJ2ZWRXb3Jkc1VzZWQgPSBuZXcgU2V0KE9iamVjdC5rZXlzKHByb2NlZHVyZXMpLmZpbHRlcigodik9PnJlc2VydmVkV29yZHMuaW5jbHVkZXModikpKTtcbiAgICAgICAgaWYgKHJlc2VydmVkV29yZHNVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Jlc2VydmVkIHdvcmRzIHVzZWQgaW4gYHJvdXRlcih7fSlgIGNhbGw6ICcgKyBBcnJheS5mcm9tKHJlc2VydmVkV29yZHNVc2VkKS5qb2luKCcsICcpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByb3V0ZXJQcm9jZWR1cmVzID0gb21pdFByb3RvdHlwZSh7fSk7XG4gICAgICAgIGZ1bmN0aW9uIHJlY3Vyc2l2ZUdldFBhdGhzKHByb2NlZHVyZXMsIHBhdGggPSAnJykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBba2V5LCBwcm9jZWR1cmVPclJvdXRlcl0gb2YgT2JqZWN0LmVudHJpZXMocHJvY2VkdXJlcyA/PyB7fSkpe1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBgJHtwYXRofSR7a2V5fWA7XG4gICAgICAgICAgICAgICAgaWYgKGlzUm91dGVyKHByb2NlZHVyZU9yUm91dGVyKSkge1xuICAgICAgICAgICAgICAgICAgICByZWN1cnNpdmVHZXRQYXRocyhwcm9jZWR1cmVPclJvdXRlci5fZGVmLnByb2NlZHVyZXMsIGAke25ld1BhdGh9LmApO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlclByb2NlZHVyZXNbbmV3UGF0aF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUga2V5OiAke25ld1BhdGh9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlclByb2NlZHVyZXNbbmV3UGF0aF0gPSBwcm9jZWR1cmVPclJvdXRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWN1cnNpdmVHZXRQYXRocyhwcm9jZWR1cmVzKTtcbiAgICAgICAgY29uc3QgX2RlZiA9IHtcbiAgICAgICAgICAgIF9jb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgIHJvdXRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHByb2NlZHVyZXM6IHJvdXRlclByb2NlZHVyZXMsXG4gICAgICAgICAgICAuLi5lbXB0eVJvdXRlcixcbiAgICAgICAgICAgIHJlY29yZDogcHJvY2VkdXJlcyxcbiAgICAgICAgICAgIHF1ZXJpZXM6IE9iamVjdC5lbnRyaWVzKHJvdXRlclByb2NlZHVyZXMpLmZpbHRlcigocGFpcik9PnBhaXJbMV0uX2RlZi5xdWVyeSkucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pPT4oe1xuICAgICAgICAgICAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgICAgICAgICAgIFtrZXldOiB2YWxcbiAgICAgICAgICAgICAgICB9KSwge30pLFxuICAgICAgICAgICAgbXV0YXRpb25zOiBPYmplY3QuZW50cmllcyhyb3V0ZXJQcm9jZWR1cmVzKS5maWx0ZXIoKHBhaXIpPT5wYWlyWzFdLl9kZWYubXV0YXRpb24pLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKT0+KHtcbiAgICAgICAgICAgICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgICAgICAgICAgICBba2V5XTogdmFsXG4gICAgICAgICAgICAgICAgfSksIHt9KSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IE9iamVjdC5lbnRyaWVzKHJvdXRlclByb2NlZHVyZXMpLmZpbHRlcigocGFpcik9PnBhaXJbMV0uX2RlZi5zdWJzY3JpcHRpb24pLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKT0+KHtcbiAgICAgICAgICAgICAgICAgICAgLi4uYWNjLFxuICAgICAgICAgICAgICAgICAgICBba2V5XTogdmFsXG4gICAgICAgICAgICAgICAgfSksIHt9KVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByb3V0ZXIgPSB7XG4gICAgICAgICAgICAuLi5wcm9jZWR1cmVzLFxuICAgICAgICAgICAgX2RlZixcbiAgICAgICAgICAgIGNyZWF0ZUNhbGxlciAoY3R4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNhbGxlckZhY3RvcnkoKShyb3V0ZXIpKGN0eCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0RXJyb3JTaGFwZSAob3B0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGF0aCAsIGVycm9yICB9ID0gb3B0cztcbiAgICAgICAgICAgICAgICBjb25zdCB7IGNvZGUgIH0gPSBvcHRzLmVycm9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0ge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiBUUlBDX0VSUk9SX0NPREVTX0JZX0tFWVtjb2RlXSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBTdGF0dXM6IGdldEhUVFBTdGF0dXNDb2RlRnJvbUVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLmlzRGV2ICYmIHR5cGVvZiBvcHRzLmVycm9yLnN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5kYXRhLnN0YWNrID0gb3B0cy5lcnJvci5zdGFjaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5kYXRhLnBhdGggPSBwYXRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLl9jb25maWcuZXJyb3JGb3JtYXR0ZXIoe1xuICAgICAgICAgICAgICAgICAgICAuLi5vcHRzLFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcm91dGVyO1xuICAgIH07XG59XG4vKipcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGNhbGxQcm9jZWR1cmUob3B0cykge1xuICAgIGNvbnN0IHsgdHlwZSAsIHBhdGggIH0gPSBvcHRzO1xuICAgIGlmICghKHBhdGggaW4gb3B0cy5wcm9jZWR1cmVzKSB8fCAhb3B0cy5wcm9jZWR1cmVzW3BhdGhdPy5fZGVmW3R5cGVdKSB7XG4gICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3Ioe1xuICAgICAgICAgICAgY29kZTogJ05PVF9GT1VORCcsXG4gICAgICAgICAgICBtZXNzYWdlOiBgTm8gXCIke3R5cGV9XCItcHJvY2VkdXJlIG9uIHBhdGggXCIke3BhdGh9XCJgXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBwcm9jZWR1cmUgPSBvcHRzLnByb2NlZHVyZXNbcGF0aF07XG4gICAgcmV0dXJuIHByb2NlZHVyZShvcHRzKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUNhbGxlckZhY3RvcnkoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUNhbGxlcklubmVyKHJvdXRlcikge1xuICAgICAgICBjb25zdCBkZWYgPSByb3V0ZXIuX2RlZjtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZUNhbGxlcihjdHgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb3h5ID0gY3JlYXRlUmVjdXJzaXZlUHJveHkoKHsgcGF0aCAsIGFyZ3MgIH0pPT57XG4gICAgICAgICAgICAgICAgLy8gaW50ZXJvcCBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxICYmIHByb2NlZHVyZVR5cGVzLmluY2x1ZGVzKHBhdGhbMF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsUHJvY2VkdXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZHVyZXM6IGRlZi5wcm9jZWR1cmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogYXJnc1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBhcmdzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogcGF0aFswXVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oJy4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9jZWR1cmUgPSBkZWYucHJvY2VkdXJlc1tmdWxsUGF0aF07XG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAncXVlcnknO1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZWR1cmUuX2RlZi5tdXRhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ211dGF0aW9uJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb2NlZHVyZS5fZGVmLnN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0eXBlID0gJ3N1YnNjcmlwdGlvbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9jZWR1cmUoe1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiBmdWxsUGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGFyZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBjaGVjayB0byBzZWUgaWYgd2UncmUgaW4gYSBzZXJ2ZXJcbiAqLyBjb25zdCBpc1NlcnZlckRlZmF1bHQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyB8fCAnRGVubycgaW4gd2luZG93IHx8IGdsb2JhbFRoaXMucHJvY2Vzcz8uZW52Py5OT0RFX0VOViA9PT0gJ3Rlc3QnIHx8ICEhZ2xvYmFsVGhpcy5wcm9jZXNzPy5lbnY/LkpFU1RfV09SS0VSX0lEIHx8ICEhZ2xvYmFsVGhpcy5wcm9jZXNzPy5lbnY/LlZJVEVTVF9XT1JLRVJfSUQ7XG5cbmV4cG9ydCB7IGRlZmF1bHRUcmFuc2Zvcm1lciBhcyBhLCBjcmVhdGVDYWxsZXJGYWN0b3J5IGFzIGIsIGNyZWF0ZVJvdXRlckZhY3RvcnkgYXMgYywgZGVmYXVsdEZvcm1hdHRlciBhcyBkLCBjYWxsUHJvY2VkdXJlIGFzIGUsIGdldERhdGFUcmFuc2Zvcm1lciBhcyBnLCBpc1NlcnZlckRlZmF1bHQgYXMgaSwgcHJvY2VkdXJlVHlwZXMgYXMgcCB9O1xuIiwiaW1wb3J0IHsgYyBhcyBjcmVhdGVSb3V0ZXJGYWN0b3J5LCBkIGFzIGRlZmF1bHRGb3JtYXR0ZXIsIGEgYXMgZGVmYXVsdFRyYW5zZm9ybWVyLCBnIGFzIGdldERhdGFUcmFuc2Zvcm1lciQxLCBpIGFzIGlzU2VydmVyRGVmYXVsdCwgYiBhcyBjcmVhdGVDYWxsZXJGYWN0b3J5IH0gZnJvbSAnLi9jb25maWctZDVmZGJkMzkubWpzJztcbmV4cG9ydCB7IGUgYXMgY2FsbFByb2NlZHVyZSwgYiBhcyBjcmVhdGVDYWxsZXJGYWN0b3J5LCBhIGFzIGRlZmF1bHRUcmFuc2Zvcm1lciwgZyBhcyBnZXREYXRhVHJhbnNmb3JtZXIsIHAgYXMgcHJvY2VkdXJlVHlwZXMgfSBmcm9tICcuL2NvbmZpZy1kNWZkYmQzOS5tanMnO1xuaW1wb3J0IHsgVCBhcyBUUlBDRXJyb3IsIGcgYXMgZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24gfSBmcm9tICcuL1RSUENFcnJvci05OGQ0NDc1OC5tanMnO1xuZXhwb3J0IHsgVCBhcyBUUlBDRXJyb3IsIGcgYXMgZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24gfSBmcm9tICcuL1RSUENFcnJvci05OGQ0NDc1OC5tanMnO1xuaW1wb3J0IHsgZyBhcyBnZXRIVFRQU3RhdHVzQ29kZUZyb21FcnJvciwgYyBhcyBjcmVhdGVGbGF0UHJveHkgfSBmcm9tICcuL2luZGV4LWY5MWQ3MjBjLm1qcyc7XG5pbXBvcnQgeyBUIGFzIFRSUENfRVJST1JfQ09ERVNfQllfS0VZIH0gZnJvbSAnLi9jb2Rlcy1jOTI0YzNkYi5tanMnO1xuaW1wb3J0ICcuL2dldENhdXNlRnJvbVVua25vd24tMmQ2NjQxNGEubWpzJztcblxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovIGNvbnN0IG1pZGRsZXdhcmVNYXJrZXIkMSA9ICdtaWRkbGV3YXJlTWFya2VyJztcblxuZnVuY3Rpb24gZ2V0UGFyc2VGbiQxKHByb2NlZHVyZVBhcnNlcikge1xuICAgIGNvbnN0IHBhcnNlciA9IHByb2NlZHVyZVBhcnNlcjtcbiAgICBpZiAodHlwZW9mIHBhcnNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBQcm9jZWR1cmVQYXJzZXJDdXN0b21WYWxpZGF0b3JFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5wYXJzZUFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFByb2NlZHVyZVBhcnNlclpvZEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBc3luYy5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLnBhcnNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFByb2NlZHVyZVBhcnNlclpvZEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UuYmluZChwYXJzZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci52YWxpZGF0ZVN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUHJvY2VkdXJlUGFyc2VyWXVwRXNxdWVcbiAgICAgICAgcmV0dXJuIHBhcnNlci52YWxpZGF0ZVN5bmMuYmluZChwYXJzZXIpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gUHJvY2VkdXJlUGFyc2VyU3VwZXJzdHJ1Y3RFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyLmNyZWF0ZS5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgYSB2YWxpZGF0b3IgZm4nKTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKiBAZGVwcmVjYXRlZFxuICovIGNsYXNzIFByb2NlZHVyZSB7XG4gICAgX2RlZigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG1pZGRsZXdhcmVzOiB0aGlzLm1pZGRsZXdhcmVzLFxuICAgICAgICAgICAgcmVzb2x2ZXI6IHRoaXMucmVzb2x2ZXIsXG4gICAgICAgICAgICBpbnB1dFBhcnNlcjogdGhpcy5pbnB1dFBhcnNlcixcbiAgICAgICAgICAgIG91dHB1dFBhcnNlcjogdGhpcy5vdXRwdXRQYXJzZXIsXG4gICAgICAgICAgICBtZXRhOiB0aGlzLm1ldGFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXN5bmMgcGFyc2VJbnB1dChyYXdJbnB1dCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGFyc2VJbnB1dEZuKHJhd0lucHV0KTtcbiAgICAgICAgfSBjYXRjaCAoY2F1c2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3Ioe1xuICAgICAgICAgICAgICAgIGNvZGU6ICdCQURfUkVRVUVTVCcsXG4gICAgICAgICAgICAgICAgY2F1c2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIHBhcnNlT3V0cHV0KHJhd091dHB1dCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMucGFyc2VPdXRwdXRGbihyYXdPdXRwdXQpO1xuICAgICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgICAgICAgICAgY2F1c2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ091dHB1dCB2YWxpZGF0aW9uIGZhaWxlZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgKiBUcmlnZ2VyIG1pZGRsZXdhcmVzIGluIG9yZGVyLCBwYXJzZSByYXcgaW5wdXQsIGNhbGwgcmVzb2x2ZXIgJiBwYXJzZSByYXcgb3V0cHV0XG4gICAqIEBpbnRlcm5hbFxuICAgKi8gYXN5bmMgY2FsbChvcHRzKSB7XG4gICAgICAgIC8vIHdyYXAgdGhlIGFjdHVhbCByZXNvbHZlciBhbmQgdHJlYXQgYXMgdGhlIGxhc3QgXCJtaWRkbGV3YXJlXCJcbiAgICAgICAgY29uc3QgbWlkZGxld2FyZXNXaXRoUmVzb2x2ZXIgPSB0aGlzLm1pZGRsZXdhcmVzLmNvbmNhdChbXG4gICAgICAgICAgICBhc3luYyAoeyBjdHggIH0pPT57XG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXQgPSBhd2FpdCB0aGlzLnBhcnNlSW5wdXQob3B0cy5yYXdJbnB1dCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3T3V0cHV0ID0gYXdhaXQgdGhpcy5yZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9wdHMsXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgdGhpcy5wYXJzZU91dHB1dChyYXdPdXRwdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIG1hcmtlcjogbWlkZGxld2FyZU1hcmtlciQxLFxuICAgICAgICAgICAgICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY3R4XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIHJ1biB0aGUgbWlkZGxld2FyZXMgcmVjdXJzaXZlbHkgd2l0aCB0aGUgcmVzb2x2ZXIgYXMgdGhlIGxhc3Qgb25lXG4gICAgICAgIGNvbnN0IGNhbGxSZWN1cnNpdmUgPSBhc3luYyAoY2FsbE9wdHMgPSB7XG4gICAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICAgIGN0eDogb3B0cy5jdHhcbiAgICAgICAgfSk9PntcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBtaWRkbGV3YXJlc1dpdGhSZXNvbHZlcltjYWxsT3B0cy5pbmRleF0oe1xuICAgICAgICAgICAgICAgICAgICBjdHg6IGNhbGxPcHRzLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogb3B0cy50eXBlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBvcHRzLnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBvcHRzLnJhd0lucHV0LFxuICAgICAgICAgICAgICAgICAgICBtZXRhOiB0aGlzLm1ldGEsXG4gICAgICAgICAgICAgICAgICAgIG5leHQ6IGFzeW5jIChuZXh0T3B0cyk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBjYWxsUmVjdXJzaXZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogY2FsbE9wdHMuaW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eDogbmV4dE9wdHMgPyBuZXh0T3B0cy5jdHggOiBjYWxsT3B0cy5jdHhcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGNhdXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4OiBjYWxsT3B0cy5jdHgsXG4gICAgICAgICAgICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGdldFRSUENFcnJvckZyb21Vbmtub3duKGNhdXNlKSxcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyOiBtaWRkbGV3YXJlTWFya2VyJDFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyB0aGVyZSdzIGFsd2F5cyBhdCBsZWFzdCBvbmUgXCJuZXh0XCIgc2luY2Ugd2Ugd3JhcCB0aGlzLnJlc29sdmVyIGluIGEgbWlkZGxld2FyZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYWxsUmVjdXJzaXZlKCk7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gcmVzdWx0IGZyb20gbWlkZGxld2FyZXMgLSBkaWQgeW91IGZvcmdldCB0byBgcmV0dXJuIG5leHQoKWA/J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgICAgICAgIC8vIHJlLXRocm93IG9yaWdpbmFsIGVycm9yXG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgIH1cbiAgICAvKipcbiAgICogQ3JlYXRlIG5ldyBwcm9jZWR1cmUgd2l0aCBwYXNzZWQgbWlkZGxld2FyZXNcbiAgICogQHBhcmFtIG1pZGRsZXdhcmVzXG4gICAqLyBpbmhlcml0TWlkZGxld2FyZXMobWlkZGxld2FyZXMpIHtcbiAgICAgICAgY29uc3QgQ29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBDb25zdHJ1Y3Rvcih7XG4gICAgICAgICAgICBtaWRkbGV3YXJlczogW1xuICAgICAgICAgICAgICAgIC4uLm1pZGRsZXdhcmVzLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMubWlkZGxld2FyZXNcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZXNvbHZlcjogdGhpcy5yZXNvbHZlcixcbiAgICAgICAgICAgIGlucHV0UGFyc2VyOiB0aGlzLmlucHV0UGFyc2VyLFxuICAgICAgICAgICAgb3V0cHV0UGFyc2VyOiB0aGlzLm91dHB1dFBhcnNlcixcbiAgICAgICAgICAgIG1ldGE6IHRoaXMubWV0YVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihvcHRzKXtcbiAgICAgICAgdGhpcy5taWRkbGV3YXJlcyA9IG9wdHMubWlkZGxld2FyZXM7XG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBvcHRzLnJlc29sdmVyO1xuICAgICAgICB0aGlzLmlucHV0UGFyc2VyID0gb3B0cy5pbnB1dFBhcnNlcjtcbiAgICAgICAgdGhpcy5wYXJzZUlucHV0Rm4gPSBnZXRQYXJzZUZuJDEodGhpcy5pbnB1dFBhcnNlcik7XG4gICAgICAgIHRoaXMub3V0cHV0UGFyc2VyID0gb3B0cy5vdXRwdXRQYXJzZXI7XG4gICAgICAgIHRoaXMucGFyc2VPdXRwdXRGbiA9IGdldFBhcnNlRm4kMSh0aGlzLm91dHB1dFBhcnNlcik7XG4gICAgICAgIHRoaXMubWV0YSA9IG9wdHMubWV0YTtcbiAgICB9XG59XG5mdW5jdGlvbiBjcmVhdGVQcm9jZWR1cmUob3B0cykge1xuICAgIGNvbnN0IGlucHV0UGFyc2VyID0gJ2lucHV0JyBpbiBvcHRzID8gb3B0cy5pbnB1dCA6IChpbnB1dCk9PntcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3Ioe1xuICAgICAgICAgICAgICAgIGNvZGU6ICdCQURfUkVRVUVTVCcsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ05vIGlucHV0IGV4cGVjdGVkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGNvbnN0IG91dHB1dFBhcnNlciA9ICdvdXRwdXQnIGluIG9wdHMgJiYgb3B0cy5vdXRwdXQgPyBvcHRzLm91dHB1dCA6IChvdXRwdXQpPT5vdXRwdXQ7XG4gICAgcmV0dXJuIG5ldyBQcm9jZWR1cmUoe1xuICAgICAgICBpbnB1dFBhcnNlcjogaW5wdXRQYXJzZXIsXG4gICAgICAgIHJlc29sdmVyOiBvcHRzLnJlc29sdmUsXG4gICAgICAgIG1pZGRsZXdhcmVzOiBbXSxcbiAgICAgICAgb3V0cHV0UGFyc2VyOiBvdXRwdXRQYXJzZXIsXG4gICAgICAgIG1ldGE6IG9wdHMubWV0YVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRQYXJzZUZuKHByb2NlZHVyZVBhcnNlcikge1xuICAgIGNvbnN0IHBhcnNlciA9IHByb2NlZHVyZVBhcnNlcjtcbiAgICBpZiAodHlwZW9mIHBhcnNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBQYXJzZXJDdXN0b21WYWxpZGF0b3JFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHBhcnNlci5wYXJzZUFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlclpvZEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2VBc3luYy5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLnBhcnNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlclpvZEVzcXVlXG4gICAgICAgIC8vIFBhcnNlclZhbGlib3RFc3F1ZSAoPD0gdjAuMTIuWClcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZS5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLnZhbGlkYXRlU3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBQYXJzZXJZdXBFc3F1ZVxuICAgICAgICByZXR1cm4gcGFyc2VyLnZhbGlkYXRlU3luYy5iaW5kKHBhcnNlcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcGFyc2VyLmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBQYXJzZXJTdXBlcnN0cnVjdEVzcXVlXG4gICAgICAgIHJldHVybiBwYXJzZXIuY3JlYXRlLmJpbmQocGFyc2VyKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwYXJzZXIuYXNzZXJ0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFBhcnNlclNjYWxlRXNxdWVcbiAgICAgICAgcmV0dXJuICh2YWx1ZSk9PntcbiAgICAgICAgICAgIHBhcnNlci5hc3NlcnQodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIGEgdmFsaWRhdG9yIGZuJyk7XG59XG4vKipcbiAqIEBkZXByZWNhdGVkIG9ubHkgZm9yIGJhY2t3YXJkcyBjb21wYXRcbiAqIEBpbnRlcm5hbFxuICovIGZ1bmN0aW9uIGdldFBhcnNlRm5PclBhc3NUaHJvdWdoKHByb2NlZHVyZVBhcnNlcikge1xuICAgIGlmICghcHJvY2VkdXJlUGFyc2VyKSB7XG4gICAgICAgIHJldHVybiAodik9PnY7XG4gICAgfVxuICAgIHJldHVybiBnZXRQYXJzZUZuKHByb2NlZHVyZVBhcnNlcik7XG59XG5cbi8qKlxuICogRW5zdXJlcyB0aGVyZSBhcmUgbm8gZHVwbGljYXRlIGtleXMgd2hlbiBidWlsZGluZyBhIHByb2NlZHVyZS5cbiAqLyBmdW5jdGlvbiBtZXJnZVdpdGhvdXRPdmVycmlkZXMob2JqMSwgLi4ub2Jqcykge1xuICAgIGNvbnN0IG5ld09iaiA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwgb2JqMSk7XG4gICAgZm9yIChjb25zdCBvdmVycmlkZXMgb2Ygb2Jqcyl7XG4gICAgICAgIGZvcihjb25zdCBrZXkgaW4gb3ZlcnJpZGVzKXtcbiAgICAgICAgICAgIGlmIChrZXkgaW4gbmV3T2JqICYmIG5ld09ialtrZXldICE9PSBvdmVycmlkZXNba2V5XSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIGtleSAke2tleX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld09ialtrZXldID0gb3ZlcnJpZGVzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09iajtcbn1cblxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBjcmVhdGVNaWRkbGV3YXJlRmFjdG9yeSgpIHtcbiAgICBmdW5jdGlvbiBjcmVhdGVNaWRkbGV3YXJlSW5uZXIobWlkZGxld2FyZXMpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIF9taWRkbGV3YXJlczogbWlkZGxld2FyZXMsXG4gICAgICAgICAgICB1bnN0YWJsZV9waXBlIChtaWRkbGV3YXJlQnVpbGRlck9yRm4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwaXBlZE1pZGRsZXdhcmUgPSAnX21pZGRsZXdhcmVzJyBpbiBtaWRkbGV3YXJlQnVpbGRlck9yRm4gPyBtaWRkbGV3YXJlQnVpbGRlck9yRm4uX21pZGRsZXdhcmVzIDogW1xuICAgICAgICAgICAgICAgICAgICBtaWRkbGV3YXJlQnVpbGRlck9yRm5cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVNaWRkbGV3YXJlSW5uZXIoW1xuICAgICAgICAgICAgICAgICAgICAuLi5taWRkbGV3YXJlcyxcbiAgICAgICAgICAgICAgICAgICAgLi4ucGlwZWRNaWRkbGV3YXJlXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZU1pZGRsZXdhcmUoZm4pIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZU1pZGRsZXdhcmVJbm5lcihbXG4gICAgICAgICAgICBmblxuICAgICAgICBdKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZU1pZGRsZXdhcmU7XG59XG5jb25zdCBleHBlcmltZW50YWxfc3RhbmRhbG9uZU1pZGRsZXdhcmUgPSAoKT0+KHtcbiAgICAgICAgY3JlYXRlOiBjcmVhdGVNaWRkbGV3YXJlRmFjdG9yeSgpXG4gICAgfSk7XG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKiBQbGVhc2Ugbm90ZSwgYHRycGMtb3BlbmFwaWAgdXNlcyB0aGlzIGZ1bmN0aW9uLlxuICovIGZ1bmN0aW9uIGNyZWF0ZUlucHV0TWlkZGxld2FyZShwYXJzZSkge1xuICAgIGNvbnN0IGlucHV0TWlkZGxld2FyZSA9IGFzeW5jICh7IG5leHQgLCByYXdJbnB1dCAsIGlucHV0ICwgIH0pPT57XG4gICAgICAgIGxldCBwYXJzZWRJbnB1dDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gYXdhaXQgcGFyc2UocmF3SW5wdXQpO1xuICAgICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgY29kZTogJ0JBRF9SRVFVRVNUJyxcbiAgICAgICAgICAgICAgICBjYXVzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTXVsdGlwbGUgaW5wdXQgcGFyc2Vyc1xuICAgICAgICBjb25zdCBjb21iaW5lZElucHV0ID0gaXNQbGFpbk9iamVjdChpbnB1dCkgJiYgaXNQbGFpbk9iamVjdChwYXJzZWRJbnB1dCkgPyB7XG4gICAgICAgICAgICAuLi5pbnB1dCxcbiAgICAgICAgICAgIC4uLnBhcnNlZElucHV0XG4gICAgICAgIH0gOiBwYXJzZWRJbnB1dDtcbiAgICAgICAgLy8gVE9ETyBmaXggdGhpcyB0eXBpbmc/XG4gICAgICAgIHJldHVybiBuZXh0KHtcbiAgICAgICAgICAgIGlucHV0OiBjb21iaW5lZElucHV0XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgaW5wdXRNaWRkbGV3YXJlLl90eXBlID0gJ2lucHV0JztcbiAgICByZXR1cm4gaW5wdXRNaWRkbGV3YXJlO1xufVxuLyoqXG4gKiBAaW50ZXJuYWxcbiAqLyBmdW5jdGlvbiBjcmVhdGVPdXRwdXRNaWRkbGV3YXJlKHBhcnNlKSB7XG4gICAgY29uc3Qgb3V0cHV0TWlkZGxld2FyZSA9IGFzeW5jICh7IG5leHQgIH0pPT57XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgICAgICAgIC8vIHBhc3MgdGhyb3VnaCBmYWlsdXJlcyB3aXRob3V0IHZhbGlkYXRpbmdcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBwYXJzZShyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgICAgICBkYXRhXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGNhdGNoIChjYXVzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFRSUENFcnJvcih7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ091dHB1dCB2YWxpZGF0aW9uIGZhaWxlZCcsXG4gICAgICAgICAgICAgICAgY29kZTogJ0lOVEVSTkFMX1NFUlZFUl9FUlJPUicsXG4gICAgICAgICAgICAgICAgY2F1c2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBvdXRwdXRNaWRkbGV3YXJlLl90eXBlID0gJ291dHB1dCc7XG4gICAgcmV0dXJuIG91dHB1dE1pZGRsZXdhcmU7XG59XG5cbi8qKlxuICogQGludGVybmFsXG4gKi8gY29uc3QgbWlkZGxld2FyZU1hcmtlciA9ICdtaWRkbGV3YXJlTWFya2VyJztcblxuZnVuY3Rpb24gY3JlYXRlTmV3QnVpbGRlcihkZWYxLCBkZWYyKSB7XG4gICAgY29uc3QgeyBtaWRkbGV3YXJlcyA9W10gLCBpbnB1dHMgLCBtZXRhICwgLi4ucmVzdCB9ID0gZGVmMjtcbiAgICAvLyBUT0RPOiBtYXliZSBoYXZlIGEgZm4gaGVyZSB0byB3YXJuIGFib3V0IGNhbGxzXG4gICAgcmV0dXJuIGNyZWF0ZUJ1aWxkZXIoe1xuICAgICAgICAuLi5tZXJnZVdpdGhvdXRPdmVycmlkZXMoZGVmMSwgcmVzdCksXG4gICAgICAgIGlucHV0czogW1xuICAgICAgICAgICAgLi4uZGVmMS5pbnB1dHMsXG4gICAgICAgICAgICAuLi5pbnB1dHMgPz8gW11cbiAgICAgICAgXSxcbiAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgIC4uLmRlZjEubWlkZGxld2FyZXMsXG4gICAgICAgICAgICAuLi5taWRkbGV3YXJlc1xuICAgICAgICBdLFxuICAgICAgICBtZXRhOiBkZWYxLm1ldGEgJiYgbWV0YSA/IHtcbiAgICAgICAgICAgIC4uLmRlZjEubWV0YSxcbiAgICAgICAgICAgIC4uLm1ldGFcbiAgICAgICAgfSA6IG1ldGEgPz8gZGVmMS5tZXRhXG4gICAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVCdWlsZGVyKGluaXREZWYgPSB7fSkge1xuICAgIGNvbnN0IF9kZWYgPSB7XG4gICAgICAgIGlucHV0czogW10sXG4gICAgICAgIG1pZGRsZXdhcmVzOiBbXSxcbiAgICAgICAgLi4uaW5pdERlZlxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2RlZixcbiAgICAgICAgaW5wdXQgKGlucHV0KSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBnZXRQYXJzZUZuKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXdCdWlsZGVyKF9kZWYsIHtcbiAgICAgICAgICAgICAgICBpbnB1dHM6IFtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIG1pZGRsZXdhcmVzOiBbXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUlucHV0TWlkZGxld2FyZShwYXJzZXIpXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG91dHB1dCAob3V0cHV0KSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZU91dHB1dCA9IGdldFBhcnNlRm4ob3V0cHV0KTtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXdCdWlsZGVyKF9kZWYsIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQsXG4gICAgICAgICAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlT3V0cHV0TWlkZGxld2FyZShwYXJzZU91dHB1dClcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0YSAobWV0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5ld0J1aWxkZXIoX2RlZiwge1xuICAgICAgICAgICAgICAgIG1ldGE6IG1ldGFcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqIFRoaXMgZnVuY3Rpb25hbGl0eSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvbi5cbiAgICAgKi8gdW5zdGFibGVfY29uY2F0IChidWlsZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTmV3QnVpbGRlcihfZGVmLCBidWlsZGVyLl9kZWYpO1xuICAgICAgICB9LFxuICAgICAgICB1c2UgKG1pZGRsZXdhcmVCdWlsZGVyT3JGbikge1xuICAgICAgICAgICAgLy8gRGlzdGluZ3Vpc2ggYmV0d2VlbiBhIG1pZGRsZXdhcmUgYnVpbGRlciBhbmQgYSBtaWRkbGV3YXJlIGZ1bmN0aW9uXG4gICAgICAgICAgICBjb25zdCBtaWRkbGV3YXJlcyA9ICdfbWlkZGxld2FyZXMnIGluIG1pZGRsZXdhcmVCdWlsZGVyT3JGbiA/IG1pZGRsZXdhcmVCdWlsZGVyT3JGbi5fbWlkZGxld2FyZXMgOiBbXG4gICAgICAgICAgICAgICAgbWlkZGxld2FyZUJ1aWxkZXJPckZuXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5ld0J1aWxkZXIoX2RlZiwge1xuICAgICAgICAgICAgICAgIG1pZGRsZXdhcmVzOiBtaWRkbGV3YXJlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJ5IChyZXNvbHZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVJlc29sdmVyKHtcbiAgICAgICAgICAgICAgICAuLi5fZGVmLFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiB0cnVlXG4gICAgICAgICAgICB9LCByZXNvbHZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIG11dGF0aW9uIChyZXNvbHZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVJlc29sdmVyKHtcbiAgICAgICAgICAgICAgICAuLi5fZGVmLFxuICAgICAgICAgICAgICAgIG11dGF0aW9uOiB0cnVlXG4gICAgICAgICAgICB9LCByZXNvbHZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHN1YnNjcmlwdGlvbiAocmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVSZXNvbHZlcih7XG4gICAgICAgICAgICAgICAgLi4uX2RlZixcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb246IHRydWVcbiAgICAgICAgICAgIH0sIHJlc29sdmVyKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjcmVhdGVSZXNvbHZlcihfZGVmLCByZXNvbHZlcikge1xuICAgIGNvbnN0IGZpbmFsQnVpbGRlciA9IGNyZWF0ZU5ld0J1aWxkZXIoX2RlZiwge1xuICAgICAgICByZXNvbHZlcixcbiAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uIHJlc29sdmVNaWRkbGV3YXJlKG9wdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzb2x2ZXIob3B0cyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyOiBtaWRkbGV3YXJlTWFya2VyLFxuICAgICAgICAgICAgICAgICAgICBvazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgY3R4OiBvcHRzLmN0eFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9KTtcbiAgICByZXR1cm4gY3JlYXRlUHJvY2VkdXJlQ2FsbGVyKGZpbmFsQnVpbGRlci5fZGVmKTtcbn1cbmNvbnN0IGNvZGVibG9jayA9IGBcblRoaXMgaXMgYSBjbGllbnQtb25seSBmdW5jdGlvbi5cbklmIHlvdSB3YW50IHRvIGNhbGwgdGhpcyBmdW5jdGlvbiBvbiB0aGUgc2VydmVyLCBzZWUgaHR0cHM6Ly90cnBjLmlvL2RvY3Mvc2VydmVyL3NlcnZlci1zaWRlLWNhbGxzXG5gLnRyaW0oKTtcbmZ1bmN0aW9uIGNyZWF0ZVByb2NlZHVyZUNhbGxlcihfZGVmKSB7XG4gICAgY29uc3QgcHJvY2VkdXJlID0gYXN5bmMgZnVuY3Rpb24gcmVzb2x2ZShvcHRzKSB7XG4gICAgICAgIC8vIGlzIGRpcmVjdCBzZXJ2ZXItc2lkZSBjYWxsXG4gICAgICAgIGlmICghb3B0cyB8fCAhKCdyYXdJbnB1dCcgaW4gb3B0cykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihjb2RlYmxvY2spO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJ1biB0aGUgbWlkZGxld2FyZXMgcmVjdXJzaXZlbHkgd2l0aCB0aGUgcmVzb2x2ZXIgYXMgdGhlIGxhc3Qgb25lXG4gICAgICAgIGNvbnN0IGNhbGxSZWN1cnNpdmUgPSBhc3luYyAoY2FsbE9wdHMgPSB7XG4gICAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICAgIGN0eDogb3B0cy5jdHhcbiAgICAgICAgfSk9PntcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgICAgICAgICBjb25zdCBtaWRkbGV3YXJlID0gX2RlZi5taWRkbGV3YXJlc1tjYWxsT3B0cy5pbmRleF07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbWlkZGxld2FyZSh7XG4gICAgICAgICAgICAgICAgICAgIGN0eDogY2FsbE9wdHMuY3R4LFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBvcHRzLnR5cGUsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IG9wdHMucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGNhbGxPcHRzLnJhd0lucHV0ID8/IG9wdHMucmF3SW5wdXQsXG4gICAgICAgICAgICAgICAgICAgIG1ldGE6IF9kZWYubWV0YSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IGNhbGxPcHRzLmlucHV0LFxuICAgICAgICAgICAgICAgICAgICBuZXh0IChfbmV4dE9wdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRPcHRzID0gX25leHRPcHRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxSZWN1cnNpdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4OiBjYWxsT3B0cy5pbmRleCArIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4OiBuZXh0T3B0cyAmJiAnY3R4JyBpbiBuZXh0T3B0cyA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uY2FsbE9wdHMuY3R4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5uZXh0T3B0cy5jdHhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IDogY2FsbE9wdHMuY3R4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBuZXh0T3B0cyAmJiAnaW5wdXQnIGluIG5leHRPcHRzID8gbmV4dE9wdHMuaW5wdXQgOiBjYWxsT3B0cy5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByYXdJbnB1dDogbmV4dE9wdHMgJiYgJ3Jhd0lucHV0JyBpbiBuZXh0T3B0cyA/IG5leHRPcHRzLnJhd0lucHV0IDogY2FsbE9wdHMucmF3SW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGNhdXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgb2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24oY2F1c2UpLFxuICAgICAgICAgICAgICAgICAgICBtYXJrZXI6IG1pZGRsZXdhcmVNYXJrZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyB0aGVyZSdzIGFsd2F5cyBhdCBsZWFzdCBvbmUgXCJuZXh0XCIgc2luY2Ugd2Ugd3JhcCB0aGlzLnJlc29sdmVyIGluIGEgbWlkZGxld2FyZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjYWxsUmVjdXJzaXZlKCk7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVFJQQ0Vycm9yKHtcbiAgICAgICAgICAgICAgICBjb2RlOiAnSU5URVJOQUxfU0VSVkVSX0VSUk9SJyxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnTm8gcmVzdWx0IGZyb20gbWlkZGxld2FyZXMgLSBkaWQgeW91IGZvcmdldCB0byBgcmV0dXJuIG5leHQoKWA/J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXN1bHQub2spIHtcbiAgICAgICAgICAgIC8vIHJlLXRocm93IG9yaWdpbmFsIGVycm9yXG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgIH07XG4gICAgcHJvY2VkdXJlLl9kZWYgPSBfZGVmO1xuICAgIHByb2NlZHVyZS5tZXRhID0gX2RlZi5tZXRhO1xuICAgIHJldHVybiBwcm9jZWR1cmU7XG59XG5cbmZ1bmN0aW9uIG1pZ3JhdGVQcm9jZWR1cmUob2xkUHJvYywgdHlwZSkge1xuICAgIGNvbnN0IGRlZiA9IG9sZFByb2MuX2RlZigpO1xuICAgIGNvbnN0IGlucHV0UGFyc2VyID0gZ2V0UGFyc2VGbk9yUGFzc1Rocm91Z2goZGVmLmlucHV0UGFyc2VyKTtcbiAgICBjb25zdCBvdXRwdXRQYXJzZXIgPSBnZXRQYXJzZUZuT3JQYXNzVGhyb3VnaChkZWYub3V0cHV0UGFyc2VyKTtcbiAgICBjb25zdCBpbnB1dE1pZGRsZXdhcmUgPSBjcmVhdGVJbnB1dE1pZGRsZXdhcmUoaW5wdXRQYXJzZXIpO1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVCdWlsZGVyKHtcbiAgICAgICAgaW5wdXRzOiBbXG4gICAgICAgICAgICBkZWYuaW5wdXRQYXJzZXJcbiAgICAgICAgXSxcbiAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgIC4uLmRlZi5taWRkbGV3YXJlcyxcbiAgICAgICAgICAgIGlucHV0TWlkZGxld2FyZSxcbiAgICAgICAgICAgIGNyZWF0ZU91dHB1dE1pZGRsZXdhcmUob3V0cHV0UGFyc2VyKVxuICAgICAgICBdLFxuICAgICAgICBtZXRhOiBkZWYubWV0YSxcbiAgICAgICAgb3V0cHV0OiBkZWYub3V0cHV0UGFyc2VyLFxuICAgICAgICBtdXRhdGlvbjogdHlwZSA9PT0gJ211dGF0aW9uJyxcbiAgICAgICAgcXVlcnk6IHR5cGUgPT09ICdxdWVyeScsXG4gICAgICAgIHN1YnNjcmlwdGlvbjogdHlwZSA9PT0gJ3N1YnNjcmlwdGlvbidcbiAgICB9KTtcbiAgICBjb25zdCBwcm9jID0gYnVpbGRlclt0eXBlXSgob3B0cyk9PmRlZi5yZXNvbHZlcihvcHRzKSk7XG4gICAgcmV0dXJuIHByb2M7XG59XG5mdW5jdGlvbiBtaWdyYXRlUm91dGVyKG9sZFJvdXRlcikge1xuICAgIGNvbnN0IGVycm9yRm9ybWF0dGVyID0gb2xkUm91dGVyLl9kZWYuZXJyb3JGb3JtYXR0ZXI7XG4gICAgY29uc3QgdHJhbnNmb3JtZXIgPSBvbGRSb3V0ZXIuX2RlZi50cmFuc2Zvcm1lcjtcbiAgICBjb25zdCBxdWVyaWVzID0ge307XG4gICAgY29uc3QgbXV0YXRpb25zID0ge307XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIGZvciAoY29uc3QgW25hbWUsIHByb2NlZHVyZV0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYucXVlcmllcykpe1xuICAgICAgICBxdWVyaWVzW25hbWVdID0gbWlncmF0ZVByb2NlZHVyZShwcm9jZWR1cmUsICdxdWVyeScpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtuYW1lMSwgcHJvY2VkdXJlMV0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYubXV0YXRpb25zKSl7XG4gICAgICAgIG11dGF0aW9uc1tuYW1lMV0gPSBtaWdyYXRlUHJvY2VkdXJlKHByb2NlZHVyZTEsICdtdXRhdGlvbicpO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IFtuYW1lMiwgcHJvY2VkdXJlMl0gb2YgT2JqZWN0LmVudHJpZXMob2xkUm91dGVyLl9kZWYuc3Vic2NyaXB0aW9ucykpe1xuICAgICAgICBzdWJzY3JpcHRpb25zW25hbWUyXSA9IG1pZ3JhdGVQcm9jZWR1cmUocHJvY2VkdXJlMiwgJ3N1YnNjcmlwdGlvbicpO1xuICAgIH1cbiAgICBjb25zdCBwcm9jZWR1cmVzID0gbWVyZ2VXaXRob3V0T3ZlcnJpZGVzKHF1ZXJpZXMsIG11dGF0aW9ucywgc3Vic2NyaXB0aW9ucyk7XG4gICAgY29uc3QgbmV3Um91dGVyID0gY3JlYXRlUm91dGVyRmFjdG9yeSh7XG4gICAgICAgIHRyYW5zZm9ybWVyLFxuICAgICAgICBlcnJvckZvcm1hdHRlcixcbiAgICAgICAgaXNEZXY6IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbidcbiAgICB9KShwcm9jZWR1cmVzKTtcbiAgICByZXR1cm4gbmV3Um91dGVyO1xufVxuXG5mdW5jdGlvbiBnZXREYXRhVHJhbnNmb3JtZXIodHJhbnNmb3JtZXIpIHtcbiAgICBpZiAoJ2lucHV0JyBpbiB0cmFuc2Zvcm1lcikge1xuICAgICAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGlucHV0OiB0cmFuc2Zvcm1lcixcbiAgICAgICAgb3V0cHV0OiB0cmFuc2Zvcm1lclxuICAgIH07XG59XG5jb25zdCBQUk9DRURVUkVfREVGSU5JVElPTl9NQVAgPSB7XG4gICAgcXVlcnk6ICdxdWVyaWVzJyxcbiAgICBtdXRhdGlvbjogJ211dGF0aW9ucycsXG4gICAgc3Vic2NyaXB0aW9uOiAnc3Vic2NyaXB0aW9ucydcbn07XG5mdW5jdGlvbiBzYWZlT2JqZWN0KC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCAuLi5hcmdzKTtcbn1cbi8qKlxuICogQGludGVybmFsIFRoZSB0eXBlIHNpZ25hdHVyZSBvZiB0aGlzIGNsYXNzIG1heSBjaGFuZ2Ugd2l0aG91dCB3YXJuaW5nLlxuICogQGRlcHJlY2F0ZWRcbiAqLyBjbGFzcyBSb3V0ZXIge1xuICAgIHN0YXRpYyBwcmVmaXhQcm9jZWR1cmVzKHByb2NlZHVyZXMsIHByZWZpeCkge1xuICAgICAgICBjb25zdCBlcHMgPSBzYWZlT2JqZWN0KCk7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgcHJvY2VkdXJlXSBvZiBPYmplY3QuZW50cmllcyhwcm9jZWR1cmVzKSl7XG4gICAgICAgICAgICBlcHNbcHJlZml4ICsga2V5XSA9IHByb2NlZHVyZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXBzO1xuICAgIH1cbiAgICBxdWVyeShwYXRoLCBwcm9jZWR1cmUpIHtcbiAgICAgICAgY29uc3Qgcm91dGVyID0gbmV3IFJvdXRlcih7XG4gICAgICAgICAgICBxdWVyaWVzOiBzYWZlT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBbcGF0aF06IGNyZWF0ZVByb2NlZHVyZShwcm9jZWR1cmUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2Uocm91dGVyKTtcbiAgICB9XG4gICAgbXV0YXRpb24ocGF0aCwgcHJvY2VkdXJlKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgbXV0YXRpb25zOiBzYWZlT2JqZWN0KHtcbiAgICAgICAgICAgICAgICBbcGF0aF06IGNyZWF0ZVByb2NlZHVyZShwcm9jZWR1cmUpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2Uocm91dGVyKTtcbiAgICB9XG4gICAgc3Vic2NyaXB0aW9uKHBhdGgsIHByb2NlZHVyZSkge1xuICAgICAgICBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbnM6IHNhZmVPYmplY3Qoe1xuICAgICAgICAgICAgICAgIFtwYXRoXTogY3JlYXRlUHJvY2VkdXJlKHByb2NlZHVyZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShyb3V0ZXIpO1xuICAgIH1cbiAgICBtZXJnZShwcmVmaXhPclJvdXRlciwgbWF5YmVSb3V0ZXIpIHtcbiAgICAgICAgbGV0IHByZWZpeCA9ICcnO1xuICAgICAgICBsZXQgY2hpbGRSb3V0ZXI7XG4gICAgICAgIGlmICh0eXBlb2YgcHJlZml4T3JSb3V0ZXIgPT09ICdzdHJpbmcnICYmIG1heWJlUm91dGVyIGluc3RhbmNlb2YgUm91dGVyKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBwcmVmaXhPclJvdXRlcjtcbiAgICAgICAgICAgIGNoaWxkUm91dGVyID0gbWF5YmVSb3V0ZXI7XG4gICAgICAgIH0gZWxzZSBpZiAocHJlZml4T3JSb3V0ZXIgaW5zdGFuY2VvZiBSb3V0ZXIpIHtcbiAgICAgICAgICAgIGNoaWxkUm91dGVyID0gcHJlZml4T3JSb3V0ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJncycpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZVF1ZXJpZXMgPSBPYmplY3Qua2V5cyhjaGlsZFJvdXRlci5fZGVmLnF1ZXJpZXMpLmZpbHRlcigoa2V5KT0+ISF0aGlzLl9kZWYucXVlcmllc1twcmVmaXggKyBrZXldKTtcbiAgICAgICAgY29uc3QgZHVwbGljYXRlTXV0YXRpb25zID0gT2JqZWN0LmtleXMoY2hpbGRSb3V0ZXIuX2RlZi5tdXRhdGlvbnMpLmZpbHRlcigoa2V5KT0+ISF0aGlzLl9kZWYubXV0YXRpb25zW3ByZWZpeCArIGtleV0pO1xuICAgICAgICBjb25zdCBkdXBsaWNhdGVTdWJzY3JpcHRpb25zID0gT2JqZWN0LmtleXMoY2hpbGRSb3V0ZXIuX2RlZi5zdWJzY3JpcHRpb25zKS5maWx0ZXIoKGtleSk9PiEhdGhpcy5fZGVmLnN1YnNjcmlwdGlvbnNbcHJlZml4ICsga2V5XSk7XG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZXMgPSBbXG4gICAgICAgICAgICAuLi5kdXBsaWNhdGVRdWVyaWVzLFxuICAgICAgICAgICAgLi4uZHVwbGljYXRlTXV0YXRpb25zLFxuICAgICAgICAgICAgLi4uZHVwbGljYXRlU3Vic2NyaXB0aW9uc1xuICAgICAgICBdO1xuICAgICAgICBpZiAoZHVwbGljYXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlIGVuZHBvaW50KHMpOiAke2R1cGxpY2F0ZXMuam9pbignLCAnKX1gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXJnZVByb2NlZHVyZXMgPSAoZGVmcyk9PntcbiAgICAgICAgICAgIGNvbnN0IG5ld0RlZnMgPSBzYWZlT2JqZWN0KCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHByb2NlZHVyZV0gb2YgT2JqZWN0LmVudHJpZXMoZGVmcykpe1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Byb2NlZHVyZSA9IHByb2NlZHVyZS5pbmhlcml0TWlkZGxld2FyZXModGhpcy5fZGVmLm1pZGRsZXdhcmVzKTtcbiAgICAgICAgICAgICAgICBuZXdEZWZzW2tleV0gPSBuZXdQcm9jZWR1cmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gUm91dGVyLnByZWZpeFByb2NlZHVyZXMobmV3RGVmcywgcHJlZml4KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgcXVlcmllczogc2FmZU9iamVjdCh0aGlzLl9kZWYucXVlcmllcywgbWVyZ2VQcm9jZWR1cmVzKGNoaWxkUm91dGVyLl9kZWYucXVlcmllcykpLFxuICAgICAgICAgICAgbXV0YXRpb25zOiBzYWZlT2JqZWN0KHRoaXMuX2RlZi5tdXRhdGlvbnMsIG1lcmdlUHJvY2VkdXJlcyhjaGlsZFJvdXRlci5fZGVmLm11dGF0aW9ucykpLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uczogc2FmZU9iamVjdCh0aGlzLl9kZWYuc3Vic2NyaXB0aW9ucywgbWVyZ2VQcm9jZWR1cmVzKGNoaWxkUm91dGVyLl9kZWYuc3Vic2NyaXB0aW9ucykpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICogSW52b2tlIHByb2NlZHVyZS4gT25seSBmb3IgaW50ZXJuYWwgdXNlIHdpdGhpbiBsaWJyYXJ5LlxuICAgKi8gYXN5bmMgY2FsbChvcHRzKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSAsIHBhdGggIH0gPSBvcHRzO1xuICAgICAgICBjb25zdCBkZWZUYXJnZXQgPSBQUk9DRURVUkVfREVGSU5JVElPTl9NQVBbdHlwZV07XG4gICAgICAgIGNvbnN0IGRlZnMgPSB0aGlzLl9kZWZbZGVmVGFyZ2V0XTtcbiAgICAgICAgY29uc3QgcHJvY2VkdXJlID0gZGVmc1twYXRoXTtcbiAgICAgICAgaWYgKCFwcm9jZWR1cmUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUUlBDRXJyb3Ioe1xuICAgICAgICAgICAgICAgIGNvZGU6ICdOT1RfRk9VTkQnLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGBObyBcIiR7dHlwZX1cIi1wcm9jZWR1cmUgb24gcGF0aCBcIiR7cGF0aH1cImBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9jZWR1cmUuY2FsbChvcHRzKTtcbiAgICB9XG4gICAgY3JlYXRlQ2FsbGVyKGN0eCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcXVlcnk6IChwYXRoLCAuLi5hcmdzKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncXVlcnknLFxuICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBhcmdzWzBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbXV0YXRpb246IChwYXRoLCAuLi5hcmdzKT0+e1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGwoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbXV0YXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHJhd0lucHV0OiBhcmdzWzBdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uOiAocGF0aCwgLi4uYXJncyk9PntcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jYWxsKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1YnNjcmlwdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcmF3SW5wdXQ6IGFyZ3NbMF1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBiZWZvcmUgYW55IHByb2NlZHVyZSBpcyBpbnZva2VkXG4gICAqIEBsaW5rIGh0dHBzOi8vdHJwYy5pby9kb2NzL21pZGRsZXdhcmVzXG4gICAqLyBtaWRkbGV3YXJlKG1pZGRsZXdhcmUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgbWlkZGxld2FyZXM6IFtcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9kZWYubWlkZGxld2FyZXMsXG4gICAgICAgICAgICAgICAgbWlkZGxld2FyZVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEZvcm1hdCBlcnJvcnNcbiAgICogQGxpbmsgaHR0cHM6Ly90cnBjLmlvL2RvY3MvZXJyb3ItZm9ybWF0dGluZ1xuICAgKi8gZm9ybWF0RXJyb3IoZXJyb3JGb3JtYXR0ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5lcnJvckZvcm1hdHRlciAhPT0gZGVmYXVsdEZvcm1hdHRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2VlbSB0byBoYXZlIGRvdWJsZSBgZm9ybWF0RXJyb3IoKWAtY2FsbHMgaW4geW91ciByb3V0ZXIgdHJlZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUm91dGVyKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGVycm9yRm9ybWF0dGVyOiBlcnJvckZvcm1hdHRlclxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0RXJyb3JTaGFwZShvcHRzKSB7XG4gICAgICAgIGNvbnN0IHsgcGF0aCAsIGVycm9yICB9ID0gb3B0cztcbiAgICAgICAgY29uc3QgeyBjb2RlICB9ID0gb3B0cy5lcnJvcjtcbiAgICAgICAgY29uc3Qgc2hhcGUgPSB7XG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLFxuICAgICAgICAgICAgY29kZTogVFJQQ19FUlJPUl9DT0RFU19CWV9LRVlbY29kZV0sXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICAgICBodHRwU3RhdHVzOiBnZXRIVFRQU3RhdHVzQ29kZUZyb21FcnJvcihlcnJvcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGdsb2JhbFRoaXMucHJvY2Vzcz8uZW52Py5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHR5cGVvZiBvcHRzLmVycm9yLnN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2hhcGUuZGF0YS5zdGFjayA9IG9wdHMuZXJyb3Iuc3RhY2s7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgc2hhcGUuZGF0YS5wYXRoID0gcGF0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmVycm9yRm9ybWF0dGVyKHtcbiAgICAgICAgICAgIC4uLm9wdHMsXG4gICAgICAgICAgICBzaGFwZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAqIEFkZCBkYXRhIHRyYW5zZm9ybWVyIHRvIHNlcmlhbGl6ZS9kZXNlcmlhbGl6ZSBpbnB1dCBhcmdzICsgb3V0cHV0XG4gICAqIEBsaW5rIGh0dHBzOi8vdHJwYy5pby9kb2NzL2RhdGEtdHJhbnNmb3JtZXJzXG4gICAqLyB0cmFuc2Zvcm1lcihfdHJhbnNmb3JtZXIpIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZXIgPSBnZXREYXRhVHJhbnNmb3JtZXIoX3RyYW5zZm9ybWVyKTtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi50cmFuc2Zvcm1lciAhPT0gZGVmYXVsdFRyYW5zZm9ybWVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBzZWVtIHRvIGhhdmUgZG91YmxlIGB0cmFuc2Zvcm1lcigpYC1jYWxscyBpbiB5b3VyIHJvdXRlciB0cmVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBSb3V0ZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgdHJhbnNmb3JtZXJcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgKiBGbGF0dGVucyB0aGUgZ2VuZXJpY3Mgb2YgVFF1ZXJpZXMvVE11dGF0aW9ucy9UU3Vic2NyaXB0aW9ucy5cbiAgICog4pqg77iPIEV4cGVyaW1lbnRhbCAtIG1pZ2h0IGRpc2FwcGVhci4g4pqg77iPXG4gICAqXG4gICAqIEBhbHBoYVxuICAgKi8gZmxhdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgKiBJbnRlcm9wIG1vZGUgZm9yIHY5LnggLT4gdjEwLnhcbiAgICovIGludGVyb3AoKSB7XG4gICAgICAgIHJldHVybiBtaWdyYXRlUm91dGVyKHRoaXMpO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihkZWYpe1xuICAgICAgICB0aGlzLl9kZWYgPSB7XG4gICAgICAgICAgICBxdWVyaWVzOiBkZWY/LnF1ZXJpZXMgPz8gc2FmZU9iamVjdCgpLFxuICAgICAgICAgICAgbXV0YXRpb25zOiBkZWY/Lm11dGF0aW9ucyA/PyBzYWZlT2JqZWN0KCksXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zOiBkZWY/LnN1YnNjcmlwdGlvbnMgPz8gc2FmZU9iamVjdCgpLFxuICAgICAgICAgICAgbWlkZGxld2FyZXM6IGRlZj8ubWlkZGxld2FyZXMgPz8gW10sXG4gICAgICAgICAgICBlcnJvckZvcm1hdHRlcjogZGVmPy5lcnJvckZvcm1hdHRlciA/PyBkZWZhdWx0Rm9ybWF0dGVyLFxuICAgICAgICAgICAgdHJhbnNmb3JtZXI6IGRlZj8udHJhbnNmb3JtZXIgPz8gZGVmYXVsdFRyYW5zZm9ybWVyXG4gICAgICAgIH07XG4gICAgfVxufVxuLyoqXG4gKiBAZGVwcmVjYXRlZFxuICovIGZ1bmN0aW9uIHJvdXRlcigpIHtcbiAgICByZXR1cm4gbmV3IFJvdXRlcigpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVJvdXRlcnMoLi4ucm91dGVyTGlzdCkge1xuICAgIGNvbnN0IHJlY29yZCA9IG1lcmdlV2l0aG91dE92ZXJyaWRlcyh7fSwgLi4ucm91dGVyTGlzdC5tYXAoKHIpPT5yLl9kZWYucmVjb3JkKSk7XG4gICAgY29uc3QgZXJyb3JGb3JtYXR0ZXIgPSByb3V0ZXJMaXN0LnJlZHVjZSgoY3VycmVudEVycm9yRm9ybWF0dGVyLCBuZXh0Um91dGVyKT0+e1xuICAgICAgICBpZiAobmV4dFJvdXRlci5fZGVmLl9jb25maWcuZXJyb3JGb3JtYXR0ZXIgJiYgbmV4dFJvdXRlci5fZGVmLl9jb25maWcuZXJyb3JGb3JtYXR0ZXIgIT09IGRlZmF1bHRGb3JtYXR0ZXIpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RXJyb3JGb3JtYXR0ZXIgIT09IGRlZmF1bHRGb3JtYXR0ZXIgJiYgY3VycmVudEVycm9yRm9ybWF0dGVyICE9PSBuZXh0Um91dGVyLl9kZWYuX2NvbmZpZy5lcnJvckZvcm1hdHRlcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignWW91IHNlZW0gdG8gaGF2ZSBzZXZlcmFsIGVycm9yIGZvcm1hdHRlcnMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Um91dGVyLl9kZWYuX2NvbmZpZy5lcnJvckZvcm1hdHRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudEVycm9yRm9ybWF0dGVyO1xuICAgIH0sIGRlZmF1bHRGb3JtYXR0ZXIpO1xuICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gcm91dGVyTGlzdC5yZWR1Y2UoKHByZXYsIGN1cnJlbnQpPT57XG4gICAgICAgIGlmIChjdXJyZW50Ll9kZWYuX2NvbmZpZy50cmFuc2Zvcm1lciAmJiBjdXJyZW50Ll9kZWYuX2NvbmZpZy50cmFuc2Zvcm1lciAhPT0gZGVmYXVsdFRyYW5zZm9ybWVyKSB7XG4gICAgICAgICAgICBpZiAocHJldiAhPT0gZGVmYXVsdFRyYW5zZm9ybWVyICYmIHByZXYgIT09IGN1cnJlbnQuX2RlZi5fY29uZmlnLnRyYW5zZm9ybWVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3Ugc2VlbSB0byBoYXZlIHNldmVyYWwgdHJhbnNmb3JtZXJzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudC5fZGVmLl9jb25maWcudHJhbnNmb3JtZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgfSwgZGVmYXVsdFRyYW5zZm9ybWVyKTtcbiAgICBjb25zdCByb3V0ZXIgPSBjcmVhdGVSb3V0ZXJGYWN0b3J5KHtcbiAgICAgICAgZXJyb3JGb3JtYXR0ZXIsXG4gICAgICAgIHRyYW5zZm9ybWVyLFxuICAgICAgICBpc0Rldjogcm91dGVyTGlzdC5zb21lKChyKT0+ci5fZGVmLl9jb25maWcuaXNEZXYpLFxuICAgICAgICBhbGxvd091dHNpZGVPZlNlcnZlcjogcm91dGVyTGlzdC5zb21lKChyKT0+ci5fZGVmLl9jb25maWcuYWxsb3dPdXRzaWRlT2ZTZXJ2ZXIpLFxuICAgICAgICBpc1NlcnZlcjogcm91dGVyTGlzdC5zb21lKChyKT0+ci5fZGVmLl9jb25maWcuaXNTZXJ2ZXIpLFxuICAgICAgICAkdHlwZXM6IHJvdXRlckxpc3RbMF0/Ll9kZWYuX2NvbmZpZy4kdHlwZXNcbiAgICB9KShyZWNvcmQpO1xuICAgIHJldHVybiByb3V0ZXI7XG59XG5cbi8qKlxuICogVE9ETzogVGhpcyBjYW4gYmUgaW1wcm92ZWQ6XG4gKiAtIFdlIHNob3VsZCBiZSBhYmxlIHRvIGNoYWluIGAubWV0YSgpYC9gLmNvbnRleHQoKWAgb25seSBvbmNlXG4gKiAtIFNpbXBsaWZ5IHR5cGluZ3NcbiAqIC0gRG9lc24ndCBuZWVkIHRvIGJlIGEgY2xhc3MgYnV0IGl0IGRvZXNuJ3QgcmVhbGx5IGh1cnQgZWl0aGVyXG4gKi8gY2xhc3MgVFJQQ0J1aWxkZXIge1xuICAgIGNvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVFJQQ0J1aWxkZXIoKTtcbiAgICB9XG4gICAgbWV0YSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUUlBDQnVpbGRlcigpO1xuICAgIH1cbiAgICBjcmVhdGUob3B0aW9ucykge1xuICAgICAgICByZXR1cm4gY3JlYXRlVFJQQ0lubmVyKCkob3B0aW9ucyk7XG4gICAgfVxufVxuLyoqXG4gKiBJbml0aWFsaXplIHRSUEMgLSBkb25lIGV4YWN0bHkgb25jZSBwZXIgYmFja2VuZFxuICovIGNvbnN0IGluaXRUUlBDID0gbmV3IFRSUENCdWlsZGVyKCk7XG5mdW5jdGlvbiBjcmVhdGVUUlBDSW5uZXIoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGluaXRUUlBDSW5uZXIocnVudGltZSkge1xuICAgICAgICBjb25zdCBlcnJvckZvcm1hdHRlciA9IHJ1bnRpbWU/LmVycm9yRm9ybWF0dGVyID8/IGRlZmF1bHRGb3JtYXR0ZXI7XG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gZ2V0RGF0YVRyYW5zZm9ybWVyJDEocnVudGltZT8udHJhbnNmb3JtZXIgPz8gZGVmYXVsdFRyYW5zZm9ybWVyKTtcbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgdHJhbnNmb3JtZXIsXG4gICAgICAgICAgICBpc0RldjogcnVudGltZT8uaXNEZXYgPz8gZ2xvYmFsVGhpcy5wcm9jZXNzPy5lbnY/Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicsXG4gICAgICAgICAgICBhbGxvd091dHNpZGVPZlNlcnZlcjogcnVudGltZT8uYWxsb3dPdXRzaWRlT2ZTZXJ2ZXIgPz8gZmFsc2UsXG4gICAgICAgICAgICBlcnJvckZvcm1hdHRlcixcbiAgICAgICAgICAgIGlzU2VydmVyOiBydW50aW1lPy5pc1NlcnZlciA/PyBpc1NlcnZlckRlZmF1bHQsXG4gICAgICAgICAgICAvKipcbiAgICAgICAqIEBpbnRlcm5hbFxuICAgICAgICovICR0eXBlczogY3JlYXRlRmxhdFByb3h5KChrZXkpPT57XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmllZCB0byBhY2Nlc3MgXCIkdHlwZXMuJHtrZXl9XCIgd2hpY2ggaXMgbm90IGF2YWlsYWJsZSBhdCBydW50aW1lYCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9O1xuICAgICAgICB7XG4gICAgICAgICAgICAvLyBTZXJ2ZXIgY2hlY2tcbiAgICAgICAgICAgIGNvbnN0IGlzU2VydmVyID0gcnVudGltZT8uaXNTZXJ2ZXIgPz8gaXNTZXJ2ZXJEZWZhdWx0O1xuICAgICAgICAgICAgaWYgKCFpc1NlcnZlciAmJiBydW50aW1lPy5hbGxvd091dHNpZGVPZlNlcnZlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgWW91J3JlIHRyeWluZyB0byB1c2UgQHRycGMvc2VydmVyIGluIGEgbm9uLXNlcnZlciBlbnZpcm9ubWVudC4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGJ5IGRlZmF1bHQuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogVGhlc2UgYXJlIGp1c3QgdHlwZXMsIHRoZXkgY2FuJ3QgYmUgdXNlZFxuICAgICAgICogQGludGVybmFsXG4gICAgICAgKi8gX2NvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgKiBCdWlsZGVyIG9iamVjdCBmb3IgY3JlYXRpbmcgcHJvY2VkdXJlc1xuICAgICAgICogQHNlZSBodHRwczovL3RycGMuaW8vZG9jcy9zZXJ2ZXIvcHJvY2VkdXJlc1xuICAgICAgICovIHByb2NlZHVyZTogY3JlYXRlQnVpbGRlcih7XG4gICAgICAgICAgICAgICAgbWV0YTogcnVudGltZT8uZGVmYXVsdE1ldGFcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGUgcmV1c2FibGUgbWlkZGxld2FyZXNcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly90cnBjLmlvL2RvY3Mvc2VydmVyL21pZGRsZXdhcmVzXG4gICAgICAgKi8gbWlkZGxld2FyZTogY3JlYXRlTWlkZGxld2FyZUZhY3RvcnkoKSxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlIGEgcm91dGVyXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vdHJwYy5pby9kb2NzL3NlcnZlci9yb3V0ZXJzXG4gICAgICAgKi8gcm91dGVyOiBjcmVhdGVSb3V0ZXJGYWN0b3J5KGNvbmZpZyksXG4gICAgICAgICAgICAvKipcbiAgICAgICAqIE1lcmdlIFJvdXRlcnNcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly90cnBjLmlvL2RvY3Mvc2VydmVyL21lcmdpbmctcm91dGVyc1xuICAgICAgICovIG1lcmdlUm91dGVycyxcbiAgICAgICAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlIGEgc2VydmVyLXNpZGUgY2FsbGVyIGZvciBhIHJvdXRlclxuICAgICAgICogQHNlZSBodHRwczovL3RycGMuaW8vZG9jcy9zZXJ2ZXIvc2VydmVyLXNpZGUtY2FsbHNcbiAgICAgICAqLyBjcmVhdGVDYWxsZXJGYWN0b3J5OiBjcmVhdGVDYWxsZXJGYWN0b3J5KClcbiAgICAgICAgfTtcbiAgICB9O1xufVxuXG5leHBvcnQgeyBjcmVhdGVJbnB1dE1pZGRsZXdhcmUsIGNyZWF0ZU91dHB1dE1pZGRsZXdhcmUsIGV4cGVyaW1lbnRhbF9zdGFuZGFsb25lTWlkZGxld2FyZSwgaW5pdFRSUEMsIHJvdXRlciB9O1xuIiwiZXhwb3J0IHZhciB1dGlsO1xuKGZ1bmN0aW9uICh1dGlsKSB7XG4gICAgdXRpbC5hc3NlcnRFcXVhbCA9IChfKSA9PiB7IH07XG4gICAgZnVuY3Rpb24gYXNzZXJ0SXMoX2FyZykgeyB9XG4gICAgdXRpbC5hc3NlcnRJcyA9IGFzc2VydElzO1xuICAgIGZ1bmN0aW9uIGFzc2VydE5ldmVyKF94KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgIH1cbiAgICB1dGlsLmFzc2VydE5ldmVyID0gYXNzZXJ0TmV2ZXI7XG4gICAgdXRpbC5hcnJheVRvRW51bSA9IChpdGVtcykgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICBvYmpbaXRlbV0gPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgICB1dGlsLmdldFZhbGlkRW51bVZhbHVlcyA9IChvYmopID0+IHtcbiAgICAgICAgY29uc3QgdmFsaWRLZXlzID0gdXRpbC5vYmplY3RLZXlzKG9iaikuZmlsdGVyKChrKSA9PiB0eXBlb2Ygb2JqW29ialtrXV0gIT09IFwibnVtYmVyXCIpO1xuICAgICAgICBjb25zdCBmaWx0ZXJlZCA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGsgb2YgdmFsaWRLZXlzKSB7XG4gICAgICAgICAgICBmaWx0ZXJlZFtrXSA9IG9ialtrXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXRpbC5vYmplY3RWYWx1ZXMoZmlsdGVyZWQpO1xuICAgIH07XG4gICAgdXRpbC5vYmplY3RWYWx1ZXMgPSAob2JqKSA9PiB7XG4gICAgICAgIHJldHVybiB1dGlsLm9iamVjdEtleXMob2JqKS5tYXAoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBvYmpbZV07XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgdXRpbC5vYmplY3RLZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSBcImZ1bmN0aW9uXCIgLy8gZXNsaW50LWRpc2FibGUtbGluZSBiYW4vYmFuXG4gICAgICAgID8gKG9iaikgPT4gT2JqZWN0LmtleXMob2JqKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGJhbi9iYW5cbiAgICAgICAgOiAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga2V5cztcbiAgICAgICAgfTtcbiAgICB1dGlsLmZpbmQgPSAoYXJyLCBjaGVja2VyKSA9PiB7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhcnIpIHtcbiAgICAgICAgICAgIGlmIChjaGVja2VyKGl0ZW0pKVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfTtcbiAgICB1dGlsLmlzSW50ZWdlciA9IHR5cGVvZiBOdW1iZXIuaXNJbnRlZ2VyID09PSBcImZ1bmN0aW9uXCJcbiAgICAgICAgPyAodmFsKSA9PiBOdW1iZXIuaXNJbnRlZ2VyKHZhbCkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBiYW4vYmFuXG4gICAgICAgIDogKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIiAmJiBOdW1iZXIuaXNGaW5pdGUodmFsKSAmJiBNYXRoLmZsb29yKHZhbCkgPT09IHZhbDtcbiAgICBmdW5jdGlvbiBqb2luVmFsdWVzKGFycmF5LCBzZXBhcmF0b3IgPSBcIiB8IFwiKSB7XG4gICAgICAgIHJldHVybiBhcnJheS5tYXAoKHZhbCkgPT4gKHR5cGVvZiB2YWwgPT09IFwic3RyaW5nXCIgPyBgJyR7dmFsfSdgIDogdmFsKSkuam9pbihzZXBhcmF0b3IpO1xuICAgIH1cbiAgICB1dGlsLmpvaW5WYWx1ZXMgPSBqb2luVmFsdWVzO1xuICAgIHV0aWwuanNvblN0cmluZ2lmeVJlcGxhY2VyID0gKF8sIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiYmlnaW50XCIpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xufSkodXRpbCB8fCAodXRpbCA9IHt9KSk7XG5leHBvcnQgdmFyIG9iamVjdFV0aWw7XG4oZnVuY3Rpb24gKG9iamVjdFV0aWwpIHtcbiAgICBvYmplY3RVdGlsLm1lcmdlU2hhcGVzID0gKGZpcnN0LCBzZWNvbmQpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmZpcnN0LFxuICAgICAgICAgICAgLi4uc2Vjb25kLCAvLyBzZWNvbmQgb3ZlcndyaXRlcyBmaXJzdFxuICAgICAgICB9O1xuICAgIH07XG59KShvYmplY3RVdGlsIHx8IChvYmplY3RVdGlsID0ge30pKTtcbmV4cG9ydCBjb25zdCBab2RQYXJzZWRUeXBlID0gdXRpbC5hcnJheVRvRW51bShbXG4gICAgXCJzdHJpbmdcIixcbiAgICBcIm5hblwiLFxuICAgIFwibnVtYmVyXCIsXG4gICAgXCJpbnRlZ2VyXCIsXG4gICAgXCJmbG9hdFwiLFxuICAgIFwiYm9vbGVhblwiLFxuICAgIFwiZGF0ZVwiLFxuICAgIFwiYmlnaW50XCIsXG4gICAgXCJzeW1ib2xcIixcbiAgICBcImZ1bmN0aW9uXCIsXG4gICAgXCJ1bmRlZmluZWRcIixcbiAgICBcIm51bGxcIixcbiAgICBcImFycmF5XCIsXG4gICAgXCJvYmplY3RcIixcbiAgICBcInVua25vd25cIixcbiAgICBcInByb21pc2VcIixcbiAgICBcInZvaWRcIixcbiAgICBcIm5ldmVyXCIsXG4gICAgXCJtYXBcIixcbiAgICBcInNldFwiLFxuXSk7XG5leHBvcnQgY29uc3QgZ2V0UGFyc2VkVHlwZSA9IChkYXRhKSA9PiB7XG4gICAgY29uc3QgdCA9IHR5cGVvZiBkYXRhO1xuICAgIHN3aXRjaCAodCkge1xuICAgICAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQ7XG4gICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnN0cmluZztcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgcmV0dXJuIE51bWJlci5pc05hTihkYXRhKSA/IFpvZFBhcnNlZFR5cGUubmFuIDogWm9kUGFyc2VkVHlwZS5udW1iZXI7XG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5ib29sZWFuO1xuICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLmZ1bmN0aW9uO1xuICAgICAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5iaWdpbnQ7XG4gICAgICAgIGNhc2UgXCJzeW1ib2xcIjpcbiAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnN5bWJvbDtcbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5hcnJheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUubnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnRoZW4gJiYgdHlwZW9mIGRhdGEudGhlbiA9PT0gXCJmdW5jdGlvblwiICYmIGRhdGEuY2F0Y2ggJiYgdHlwZW9mIGRhdGEuY2F0Y2ggPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnByb21pc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIE1hcCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFpvZFBhcnNlZFR5cGUubWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBTZXQgIT09IFwidW5kZWZpbmVkXCIgJiYgZGF0YSBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLnNldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgRGF0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkYXRhIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBab2RQYXJzZWRUeXBlLmRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS5vYmplY3Q7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gWm9kUGFyc2VkVHlwZS51bmtub3duO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyB1dGlsIH0gZnJvbSBcIi4vaGVscGVycy91dGlsLmpzXCI7XG5leHBvcnQgY29uc3QgWm9kSXNzdWVDb2RlID0gdXRpbC5hcnJheVRvRW51bShbXG4gICAgXCJpbnZhbGlkX3R5cGVcIixcbiAgICBcImludmFsaWRfbGl0ZXJhbFwiLFxuICAgIFwiY3VzdG9tXCIsXG4gICAgXCJpbnZhbGlkX3VuaW9uXCIsXG4gICAgXCJpbnZhbGlkX3VuaW9uX2Rpc2NyaW1pbmF0b3JcIixcbiAgICBcImludmFsaWRfZW51bV92YWx1ZVwiLFxuICAgIFwidW5yZWNvZ25pemVkX2tleXNcIixcbiAgICBcImludmFsaWRfYXJndW1lbnRzXCIsXG4gICAgXCJpbnZhbGlkX3JldHVybl90eXBlXCIsXG4gICAgXCJpbnZhbGlkX2RhdGVcIixcbiAgICBcImludmFsaWRfc3RyaW5nXCIsXG4gICAgXCJ0b29fc21hbGxcIixcbiAgICBcInRvb19iaWdcIixcbiAgICBcImludmFsaWRfaW50ZXJzZWN0aW9uX3R5cGVzXCIsXG4gICAgXCJub3RfbXVsdGlwbGVfb2ZcIixcbiAgICBcIm5vdF9maW5pdGVcIixcbl0pO1xuZXhwb3J0IGNvbnN0IHF1b3RlbGVzc0pzb24gPSAob2JqKSA9PiB7XG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgMik7XG4gICAgcmV0dXJuIGpzb24ucmVwbGFjZSgvXCIoW15cIl0rKVwiOi9nLCBcIiQxOlwiKTtcbn07XG5leHBvcnQgY2xhc3MgWm9kRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgZ2V0IGVycm9ycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNzdWVzO1xuICAgIH1cbiAgICBjb25zdHJ1Y3Rvcihpc3N1ZXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pc3N1ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hZGRJc3N1ZSA9IChzdWIpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNzdWVzID0gWy4uLnRoaXMuaXNzdWVzLCBzdWJdO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFkZElzc3VlcyA9IChzdWJzID0gW10pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNzdWVzID0gWy4uLnRoaXMuaXNzdWVzLCAuLi5zdWJzXTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgYWN0dWFsUHJvdG8gPSBuZXcudGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGJhbi9iYW5cbiAgICAgICAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZih0aGlzLCBhY3R1YWxQcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IGFjdHVhbFByb3RvO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmFtZSA9IFwiWm9kRXJyb3JcIjtcbiAgICAgICAgdGhpcy5pc3N1ZXMgPSBpc3N1ZXM7XG4gICAgfVxuICAgIGZvcm1hdChfbWFwcGVyKSB7XG4gICAgICAgIGNvbnN0IG1hcHBlciA9IF9tYXBwZXIgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChpc3N1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc3N1ZS5tZXNzYWdlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZmllbGRFcnJvcnMgPSB7IF9lcnJvcnM6IFtdIH07XG4gICAgICAgIGNvbnN0IHByb2Nlc3NFcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgICAgICAgZm9yIChjb25zdCBpc3N1ZSBvZiBlcnJvci5pc3N1ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNzdWUuY29kZSA9PT0gXCJpbnZhbGlkX3VuaW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWUudW5pb25FcnJvcnMubWFwKHByb2Nlc3NFcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLmNvZGUgPT09IFwiaW52YWxpZF9yZXR1cm5fdHlwZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3NFcnJvcihpc3N1ZS5yZXR1cm5UeXBlRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS5jb2RlID09PSBcImludmFsaWRfYXJndW1lbnRzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0Vycm9yKGlzc3VlLmFyZ3VtZW50c0Vycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUucGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRFcnJvcnMuX2Vycm9ycy5wdXNoKG1hcHBlcihpc3N1ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnIgPSBmaWVsZEVycm9ycztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IGlzc3VlLnBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGlzc3VlLnBhdGhbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXJtaW5hbCA9IGkgPT09IGlzc3VlLnBhdGgubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGVybWluYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyW2VsXSA9IGN1cnJbZWxdIHx8IHsgX2Vycm9yczogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAodHlwZW9mIGVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBjdXJyW2VsXSA9IGN1cnJbZWxdIHx8IHsgX2Vycm9yczogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9IGVsc2UgaWYgKHR5cGVvZiBlbCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgY29uc3QgZXJyb3JBcnJheTogYW55ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBlcnJvckFycmF5Ll9lcnJvcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgIGN1cnJbZWxdID0gY3VycltlbF0gfHwgZXJyb3JBcnJheTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyW2VsXSA9IGN1cnJbZWxdIHx8IHsgX2Vycm9yczogW10gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyW2VsXS5fZXJyb3JzLnB1c2gobWFwcGVyKGlzc3VlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyID0gY3VycltlbF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3NFcnJvcih0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZpZWxkRXJyb3JzO1xuICAgIH1cbiAgICBzdGF0aWMgYXNzZXJ0KHZhbHVlKSB7XG4gICAgICAgIGlmICghKHZhbHVlIGluc3RhbmNlb2YgWm9kRXJyb3IpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIFpvZEVycm9yOiAke3ZhbHVlfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlO1xuICAgIH1cbiAgICBnZXQgbWVzc2FnZSgpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuaXNzdWVzLCB1dGlsLmpzb25TdHJpbmdpZnlSZXBsYWNlciwgMik7XG4gICAgfVxuICAgIGdldCBpc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc3N1ZXMubGVuZ3RoID09PSAwO1xuICAgIH1cbiAgICBmbGF0dGVuKG1hcHBlciA9IChpc3N1ZSkgPT4gaXNzdWUubWVzc2FnZSkge1xuICAgICAgICBjb25zdCBmaWVsZEVycm9ycyA9IHt9O1xuICAgICAgICBjb25zdCBmb3JtRXJyb3JzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgc3ViIG9mIHRoaXMuaXNzdWVzKSB7XG4gICAgICAgICAgICBpZiAoc3ViLnBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0RWwgPSBzdWIucGF0aFswXTtcbiAgICAgICAgICAgICAgICBmaWVsZEVycm9yc1tmaXJzdEVsXSA9IGZpZWxkRXJyb3JzW2ZpcnN0RWxdIHx8IFtdO1xuICAgICAgICAgICAgICAgIGZpZWxkRXJyb3JzW2ZpcnN0RWxdLnB1c2gobWFwcGVyKHN1YikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybUVycm9ycy5wdXNoKG1hcHBlcihzdWIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBmb3JtRXJyb3JzLCBmaWVsZEVycm9ycyB9O1xuICAgIH1cbiAgICBnZXQgZm9ybUVycm9ycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdHRlbigpO1xuICAgIH1cbn1cblpvZEVycm9yLmNyZWF0ZSA9IChpc3N1ZXMpID0+IHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBab2RFcnJvcihpc3N1ZXMpO1xuICAgIHJldHVybiBlcnJvcjtcbn07XG4iLCJpbXBvcnQgeyBab2RJc3N1ZUNvZGUgfSBmcm9tIFwiLi4vWm9kRXJyb3IuanNcIjtcbmltcG9ydCB7IHV0aWwsIFpvZFBhcnNlZFR5cGUgfSBmcm9tIFwiLi4vaGVscGVycy91dGlsLmpzXCI7XG5jb25zdCBlcnJvck1hcCA9IChpc3N1ZSwgX2N0eCkgPT4ge1xuICAgIGxldCBtZXNzYWdlO1xuICAgIHN3aXRjaCAoaXNzdWUuY29kZSkge1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGU6XG4gICAgICAgICAgICBpZiAoaXNzdWUucmVjZWl2ZWQgPT09IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiUmVxdWlyZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgRXhwZWN0ZWQgJHtpc3N1ZS5leHBlY3RlZH0sIHJlY2VpdmVkICR7aXNzdWUucmVjZWl2ZWR9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX2xpdGVyYWw6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgbGl0ZXJhbCB2YWx1ZSwgZXhwZWN0ZWQgJHtKU09OLnN0cmluZ2lmeShpc3N1ZS5leHBlY3RlZCwgdXRpbC5qc29uU3RyaW5naWZ5UmVwbGFjZXIpfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUudW5yZWNvZ25pemVkX2tleXM6XG4gICAgICAgICAgICBtZXNzYWdlID0gYFVucmVjb2duaXplZCBrZXkocykgaW4gb2JqZWN0OiAke3V0aWwuam9pblZhbHVlcyhpc3N1ZS5rZXlzLCBcIiwgXCIpfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF91bmlvbjpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBpbnB1dGA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF91bmlvbl9kaXNjcmltaW5hdG9yOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGRpc2NyaW1pbmF0b3IgdmFsdWUuIEV4cGVjdGVkICR7dXRpbC5qb2luVmFsdWVzKGlzc3VlLm9wdGlvbnMpfWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9lbnVtX3ZhbHVlOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGVudW0gdmFsdWUuIEV4cGVjdGVkICR7dXRpbC5qb2luVmFsdWVzKGlzc3VlLm9wdGlvbnMpfSwgcmVjZWl2ZWQgJyR7aXNzdWUucmVjZWl2ZWR9J2A7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9hcmd1bWVudHM6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgZnVuY3Rpb24gYXJndW1lbnRzYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX3JldHVybl90eXBlOlxuICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGZ1bmN0aW9uIHJldHVybiB0eXBlYDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5pbnZhbGlkX2RhdGU6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludmFsaWQgZGF0ZWA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmc6XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlzc3VlLnZhbGlkYXRpb24gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpbmNsdWRlc1wiIGluIGlzc3VlLnZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGlucHV0OiBtdXN0IGluY2x1ZGUgXCIke2lzc3VlLnZhbGlkYXRpb24uaW5jbHVkZXN9XCJgO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlzc3VlLnZhbGlkYXRpb24ucG9zaXRpb24gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgJHttZXNzYWdlfSBhdCBvbmUgb3IgbW9yZSBwb3NpdGlvbnMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvICR7aXNzdWUudmFsaWRhdGlvbi5wb3NpdGlvbn1gO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwic3RhcnRzV2l0aFwiIGluIGlzc3VlLnZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBJbnZhbGlkIGlucHV0OiBtdXN0IHN0YXJ0IHdpdGggXCIke2lzc3VlLnZhbGlkYXRpb24uc3RhcnRzV2l0aH1cImA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFwiZW5kc1dpdGhcIiBpbiBpc3N1ZS52YWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBpbnB1dDogbXVzdCBlbmQgd2l0aCBcIiR7aXNzdWUudmFsaWRhdGlvbi5lbmRzV2l0aH1cImA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGlzc3VlLnZhbGlkYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnZhbGlkYXRpb24gIT09IFwicmVnZXhcIikge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCAke2lzc3VlLnZhbGlkYXRpb259YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkludmFsaWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS50b29fc21hbGw6XG4gICAgICAgICAgICBpZiAoaXNzdWUudHlwZSA9PT0gXCJhcnJheVwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgQXJyYXkgbXVzdCBjb250YWluICR7aXNzdWUuZXhhY3QgPyBcImV4YWN0bHlcIiA6IGlzc3VlLmluY2x1c2l2ZSA/IGBhdCBsZWFzdGAgOiBgbW9yZSB0aGFuYH0gJHtpc3N1ZS5taW5pbXVtfSBlbGVtZW50KHMpYDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBTdHJpbmcgbXVzdCBjb250YWluICR7aXNzdWUuZXhhY3QgPyBcImV4YWN0bHlcIiA6IGlzc3VlLmluY2x1c2l2ZSA/IGBhdCBsZWFzdGAgOiBgb3ZlcmB9ICR7aXNzdWUubWluaW11bX0gY2hhcmFjdGVyKHMpYDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBOdW1iZXIgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHkgZXF1YWwgdG8gYCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYCA6IGBncmVhdGVyIHRoYW4gYH0ke2lzc3VlLm1pbmltdW19YDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwiYmlnaW50XCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBOdW1iZXIgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHkgZXF1YWwgdG8gYCA6IGlzc3VlLmluY2x1c2l2ZSA/IGBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gYCA6IGBncmVhdGVyIHRoYW4gYH0ke2lzc3VlLm1pbmltdW19YDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwiZGF0ZVwiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgRGF0ZSBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseSBlcXVhbCB0byBgIDogaXNzdWUuaW5jbHVzaXZlID8gYGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byBgIDogYGdyZWF0ZXIgdGhhbiBgfSR7bmV3IERhdGUoTnVtYmVyKGlzc3VlLm1pbmltdW0pKX1gO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkludmFsaWQgaW5wdXRcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS50b29fYmlnOlxuICAgICAgICAgICAgaWYgKGlzc3VlLnR5cGUgPT09IFwiYXJyYXlcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYEFycmF5IG11c3QgY29udGFpbiAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHlgIDogaXNzdWUuaW5jbHVzaXZlID8gYGF0IG1vc3RgIDogYGxlc3MgdGhhbmB9ICR7aXNzdWUubWF4aW11bX0gZWxlbWVudChzKWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBgU3RyaW5nIG11c3QgY29udGFpbiAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHlgIDogaXNzdWUuaW5jbHVzaXZlID8gYGF0IG1vc3RgIDogYHVuZGVyYH0gJHtpc3N1ZS5tYXhpbXVtfSBjaGFyYWN0ZXIocylgO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNzdWUudHlwZSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYE51bWJlciBtdXN0IGJlICR7aXNzdWUuZXhhY3QgPyBgZXhhY3RseWAgOiBpc3N1ZS5pbmNsdXNpdmUgPyBgbGVzcyB0aGFuIG9yIGVxdWFsIHRvYCA6IGBsZXNzIHRoYW5gfSAke2lzc3VlLm1heGltdW19YDtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzc3VlLnR5cGUgPT09IFwiYmlnaW50XCIpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGBCaWdJbnQgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHlgIDogaXNzdWUuaW5jbHVzaXZlID8gYGxlc3MgdGhhbiBvciBlcXVhbCB0b2AgOiBgbGVzcyB0aGFuYH0gJHtpc3N1ZS5tYXhpbXVtfWA7XG4gICAgICAgICAgICBlbHNlIGlmIChpc3N1ZS50eXBlID09PSBcImRhdGVcIilcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gYERhdGUgbXVzdCBiZSAke2lzc3VlLmV4YWN0ID8gYGV4YWN0bHlgIDogaXNzdWUuaW5jbHVzaXZlID8gYHNtYWxsZXIgdGhhbiBvciBlcXVhbCB0b2AgOiBgc21hbGxlciB0aGFuYH0gJHtuZXcgRGF0ZShOdW1iZXIoaXNzdWUubWF4aW11bSkpfWA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiSW52YWxpZCBpbnB1dFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLmN1c3RvbTpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgSW52YWxpZCBpbnB1dGA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBab2RJc3N1ZUNvZGUuaW52YWxpZF9pbnRlcnNlY3Rpb25fdHlwZXM6XG4gICAgICAgICAgICBtZXNzYWdlID0gYEludGVyc2VjdGlvbiByZXN1bHRzIGNvdWxkIG5vdCBiZSBtZXJnZWRgO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgWm9kSXNzdWVDb2RlLm5vdF9tdWx0aXBsZV9vZjpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBgTnVtYmVyIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAke2lzc3VlLm11bHRpcGxlT2Z9YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFpvZElzc3VlQ29kZS5ub3RfZmluaXRlOlxuICAgICAgICAgICAgbWVzc2FnZSA9IFwiTnVtYmVyIG11c3QgYmUgZmluaXRlXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBfY3R4LmRlZmF1bHRFcnJvcjtcbiAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoaXNzdWUpO1xuICAgIH1cbiAgICByZXR1cm4geyBtZXNzYWdlIH07XG59O1xuZXhwb3J0IGRlZmF1bHQgZXJyb3JNYXA7XG4iLCJpbXBvcnQgZGVmYXVsdEVycm9yTWFwIGZyb20gXCIuL2xvY2FsZXMvZW4uanNcIjtcbmxldCBvdmVycmlkZUVycm9yTWFwID0gZGVmYXVsdEVycm9yTWFwO1xuZXhwb3J0IHsgZGVmYXVsdEVycm9yTWFwIH07XG5leHBvcnQgZnVuY3Rpb24gc2V0RXJyb3JNYXAobWFwKSB7XG4gICAgb3ZlcnJpZGVFcnJvck1hcCA9IG1hcDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRFcnJvck1hcCgpIHtcbiAgICByZXR1cm4gb3ZlcnJpZGVFcnJvck1hcDtcbn1cbiIsImltcG9ydCB7IGdldEVycm9yTWFwIH0gZnJvbSBcIi4uL2Vycm9ycy5qc1wiO1xuaW1wb3J0IGRlZmF1bHRFcnJvck1hcCBmcm9tIFwiLi4vbG9jYWxlcy9lbi5qc1wiO1xuZXhwb3J0IGNvbnN0IG1ha2VJc3N1ZSA9IChwYXJhbXMpID0+IHtcbiAgICBjb25zdCB7IGRhdGEsIHBhdGgsIGVycm9yTWFwcywgaXNzdWVEYXRhIH0gPSBwYXJhbXM7XG4gICAgY29uc3QgZnVsbFBhdGggPSBbLi4ucGF0aCwgLi4uKGlzc3VlRGF0YS5wYXRoIHx8IFtdKV07XG4gICAgY29uc3QgZnVsbElzc3VlID0ge1xuICAgICAgICAuLi5pc3N1ZURhdGEsXG4gICAgICAgIHBhdGg6IGZ1bGxQYXRoLFxuICAgIH07XG4gICAgaWYgKGlzc3VlRGF0YS5tZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmlzc3VlRGF0YSxcbiAgICAgICAgICAgIHBhdGg6IGZ1bGxQYXRoLFxuICAgICAgICAgICAgbWVzc2FnZTogaXNzdWVEYXRhLm1lc3NhZ2UsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBcIlwiO1xuICAgIGNvbnN0IG1hcHMgPSBlcnJvck1hcHNcbiAgICAgICAgLmZpbHRlcigobSkgPT4gISFtKVxuICAgICAgICAuc2xpY2UoKVxuICAgICAgICAucmV2ZXJzZSgpO1xuICAgIGZvciAoY29uc3QgbWFwIG9mIG1hcHMpIHtcbiAgICAgICAgZXJyb3JNZXNzYWdlID0gbWFwKGZ1bGxJc3N1ZSwgeyBkYXRhLCBkZWZhdWx0RXJyb3I6IGVycm9yTWVzc2FnZSB9KS5tZXNzYWdlO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICAuLi5pc3N1ZURhdGEsXG4gICAgICAgIHBhdGg6IGZ1bGxQYXRoLFxuICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgfTtcbn07XG5leHBvcnQgY29uc3QgRU1QVFlfUEFUSCA9IFtdO1xuZXhwb3J0IGZ1bmN0aW9uIGFkZElzc3VlVG9Db250ZXh0KGN0eCwgaXNzdWVEYXRhKSB7XG4gICAgY29uc3Qgb3ZlcnJpZGVNYXAgPSBnZXRFcnJvck1hcCgpO1xuICAgIGNvbnN0IGlzc3VlID0gbWFrZUlzc3VlKHtcbiAgICAgICAgaXNzdWVEYXRhOiBpc3N1ZURhdGEsXG4gICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgZXJyb3JNYXBzOiBbXG4gICAgICAgICAgICBjdHguY29tbW9uLmNvbnRleHR1YWxFcnJvck1hcCwgLy8gY29udGV4dHVhbCBlcnJvciBtYXAgaXMgZmlyc3QgcHJpb3JpdHlcbiAgICAgICAgICAgIGN0eC5zY2hlbWFFcnJvck1hcCwgLy8gdGhlbiBzY2hlbWEtYm91bmQgbWFwIGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgb3ZlcnJpZGVNYXAsIC8vIHRoZW4gZ2xvYmFsIG92ZXJyaWRlIG1hcFxuICAgICAgICAgICAgb3ZlcnJpZGVNYXAgPT09IGRlZmF1bHRFcnJvck1hcCA/IHVuZGVmaW5lZCA6IGRlZmF1bHRFcnJvck1hcCwgLy8gdGhlbiBnbG9iYWwgZGVmYXVsdCBtYXBcbiAgICAgICAgXS5maWx0ZXIoKHgpID0+ICEheCksXG4gICAgfSk7XG4gICAgY3R4LmNvbW1vbi5pc3N1ZXMucHVzaChpc3N1ZSk7XG59XG5leHBvcnQgY2xhc3MgUGFyc2VTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gXCJ2YWxpZFwiO1xuICAgIH1cbiAgICBkaXJ0eSgpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IFwidmFsaWRcIilcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcImRpcnR5XCI7XG4gICAgfVxuICAgIGFib3J0KCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gXCJhYm9ydGVkXCI7XG4gICAgfVxuICAgIHN0YXRpYyBtZXJnZUFycmF5KHN0YXR1cywgcmVzdWx0cykge1xuICAgICAgICBjb25zdCBhcnJheVZhbHVlID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcyBvZiByZXN1bHRzKSB7XG4gICAgICAgICAgICBpZiAocy5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgaWYgKHMuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICBhcnJheVZhbHVlLnB1c2gocy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBhcnJheVZhbHVlIH07XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBtZXJnZU9iamVjdEFzeW5jKHN0YXR1cywgcGFpcnMpIHtcbiAgICAgICAgY29uc3Qgc3luY1BhaXJzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgcGFpci5rZXk7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IHBhaXIudmFsdWU7XG4gICAgICAgICAgICBzeW5jUGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlT2JqZWN0U3luYyhzdGF0dXMsIHN5bmNQYWlycyk7XG4gICAgfVxuICAgIHN0YXRpYyBtZXJnZU9iamVjdFN5bmMoc3RhdHVzLCBwYWlycykge1xuICAgICAgICBjb25zdCBmaW5hbE9iamVjdCA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgcGFpcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsga2V5LCB2YWx1ZSB9ID0gcGFpcjtcbiAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZS5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIGlmIChrZXkudmFsdWUgIT09IFwiX19wcm90b19fXCIgJiYgKHR5cGVvZiB2YWx1ZS52YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiB8fCBwYWlyLmFsd2F5c1NldCkpIHtcbiAgICAgICAgICAgICAgICBmaW5hbE9iamVjdFtrZXkudmFsdWVdID0gdmFsdWUudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBmaW5hbE9iamVjdCB9O1xuICAgIH1cbn1cbmV4cG9ydCBjb25zdCBJTlZBTElEID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgc3RhdHVzOiBcImFib3J0ZWRcIixcbn0pO1xuZXhwb3J0IGNvbnN0IERJUlRZID0gKHZhbHVlKSA9PiAoeyBzdGF0dXM6IFwiZGlydHlcIiwgdmFsdWUgfSk7XG5leHBvcnQgY29uc3QgT0sgPSAodmFsdWUpID0+ICh7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZSB9KTtcbmV4cG9ydCBjb25zdCBpc0Fib3J0ZWQgPSAoeCkgPT4geC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiO1xuZXhwb3J0IGNvbnN0IGlzRGlydHkgPSAoeCkgPT4geC5zdGF0dXMgPT09IFwiZGlydHlcIjtcbmV4cG9ydCBjb25zdCBpc1ZhbGlkID0gKHgpID0+IHguc3RhdHVzID09PSBcInZhbGlkXCI7XG5leHBvcnQgY29uc3QgaXNBc3luYyA9ICh4KSA9PiB0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB4IGluc3RhbmNlb2YgUHJvbWlzZTtcbiIsImV4cG9ydCB2YXIgZXJyb3JVdGlsO1xuKGZ1bmN0aW9uIChlcnJvclV0aWwpIHtcbiAgICBlcnJvclV0aWwuZXJyVG9PYmogPSAobWVzc2FnZSkgPT4gdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyB7IG1lc3NhZ2UgfSA6IG1lc3NhZ2UgfHwge307XG4gICAgLy8gYmlvbWUtaWdub3JlIGxpbnQ6XG4gICAgZXJyb3JVdGlsLnRvU3RyaW5nID0gKG1lc3NhZ2UpID0+IHR5cGVvZiBtZXNzYWdlID09PSBcInN0cmluZ1wiID8gbWVzc2FnZSA6IG1lc3NhZ2U/Lm1lc3NhZ2U7XG59KShlcnJvclV0aWwgfHwgKGVycm9yVXRpbCA9IHt9KSk7XG4iLCJpbXBvcnQgeyBab2RFcnJvciwgWm9kSXNzdWVDb2RlLCB9IGZyb20gXCIuL1pvZEVycm9yLmpzXCI7XG5pbXBvcnQgeyBkZWZhdWx0RXJyb3JNYXAsIGdldEVycm9yTWFwIH0gZnJvbSBcIi4vZXJyb3JzLmpzXCI7XG5pbXBvcnQgeyBlcnJvclV0aWwgfSBmcm9tIFwiLi9oZWxwZXJzL2Vycm9yVXRpbC5qc1wiO1xuaW1wb3J0IHsgRElSVFksIElOVkFMSUQsIE9LLCBQYXJzZVN0YXR1cywgYWRkSXNzdWVUb0NvbnRleHQsIGlzQWJvcnRlZCwgaXNBc3luYywgaXNEaXJ0eSwgaXNWYWxpZCwgbWFrZUlzc3VlLCB9IGZyb20gXCIuL2hlbHBlcnMvcGFyc2VVdGlsLmpzXCI7XG5pbXBvcnQgeyB1dGlsLCBab2RQYXJzZWRUeXBlLCBnZXRQYXJzZWRUeXBlIH0gZnJvbSBcIi4vaGVscGVycy91dGlsLmpzXCI7XG5jbGFzcyBQYXJzZUlucHV0TGF6eVBhdGgge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgdmFsdWUsIHBhdGgsIGtleSkge1xuICAgICAgICB0aGlzLl9jYWNoZWRQYXRoID0gW107XG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLmRhdGEgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX2tleSA9IGtleTtcbiAgICB9XG4gICAgZ2V0IHBhdGgoKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGVkUGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuX2tleSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWNoZWRQYXRoLnB1c2goLi4udGhpcy5fcGF0aCwgLi4udGhpcy5fa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlZFBhdGgucHVzaCguLi50aGlzLl9wYXRoLCB0aGlzLl9rZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZWRQYXRoO1xuICAgIH1cbn1cbmNvbnN0IGhhbmRsZVJlc3VsdCA9IChjdHgsIHJlc3VsdCkgPT4ge1xuICAgIGlmIChpc1ZhbGlkKHJlc3VsdCkpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcmVzdWx0LnZhbHVlIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoIWN0eC5jb21tb24uaXNzdWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmFsaWRhdGlvbiBmYWlsZWQgYnV0IG5vIGlzc3VlcyBkZXRlY3RlZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgZ2V0IGVycm9yKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lcnJvcilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IFpvZEVycm9yKGN0eC5jb21tb24uaXNzdWVzKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxufTtcbmZ1bmN0aW9uIHByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSB7XG4gICAgaWYgKCFwYXJhbXMpXG4gICAgICAgIHJldHVybiB7fTtcbiAgICBjb25zdCB7IGVycm9yTWFwLCBpbnZhbGlkX3R5cGVfZXJyb3IsIHJlcXVpcmVkX2Vycm9yLCBkZXNjcmlwdGlvbiB9ID0gcGFyYW1zO1xuICAgIGlmIChlcnJvck1hcCAmJiAoaW52YWxpZF90eXBlX2Vycm9yIHx8IHJlcXVpcmVkX2Vycm9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IHVzZSBcImludmFsaWRfdHlwZV9lcnJvclwiIG9yIFwicmVxdWlyZWRfZXJyb3JcIiBpbiBjb25qdW5jdGlvbiB3aXRoIGN1c3RvbSBlcnJvciBtYXAuYCk7XG4gICAgfVxuICAgIGlmIChlcnJvck1hcClcbiAgICAgICAgcmV0dXJuIHsgZXJyb3JNYXA6IGVycm9yTWFwLCBkZXNjcmlwdGlvbiB9O1xuICAgIGNvbnN0IGN1c3RvbU1hcCA9IChpc3MsIGN0eCkgPT4ge1xuICAgICAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IHBhcmFtcztcbiAgICAgICAgaWYgKGlzcy5jb2RlID09PSBcImludmFsaWRfZW51bV92YWx1ZVwiKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlOiBtZXNzYWdlID8/IGN0eC5kZWZhdWx0RXJyb3IgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGN0eC5kYXRhID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlOiBtZXNzYWdlID8/IHJlcXVpcmVkX2Vycm9yID8/IGN0eC5kZWZhdWx0RXJyb3IgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNzLmNvZGUgIT09IFwiaW52YWxpZF90eXBlXCIpXG4gICAgICAgICAgICByZXR1cm4geyBtZXNzYWdlOiBjdHguZGVmYXVsdEVycm9yIH07XG4gICAgICAgIHJldHVybiB7IG1lc3NhZ2U6IG1lc3NhZ2UgPz8gaW52YWxpZF90eXBlX2Vycm9yID8/IGN0eC5kZWZhdWx0RXJyb3IgfTtcbiAgICB9O1xuICAgIHJldHVybiB7IGVycm9yTWFwOiBjdXN0b21NYXAsIGRlc2NyaXB0aW9uIH07XG59XG5leHBvcnQgY2xhc3MgWm9kVHlwZSB7XG4gICAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmRlc2NyaXB0aW9uO1xuICAgIH1cbiAgICBfZ2V0VHlwZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gZ2V0UGFyc2VkVHlwZShpbnB1dC5kYXRhKTtcbiAgICB9XG4gICAgX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpIHtcbiAgICAgICAgcmV0dXJuIChjdHggfHwge1xuICAgICAgICAgICAgY29tbW9uOiBpbnB1dC5wYXJlbnQuY29tbW9uLFxuICAgICAgICAgICAgZGF0YTogaW5wdXQuZGF0YSxcbiAgICAgICAgICAgIHBhcnNlZFR5cGU6IGdldFBhcnNlZFR5cGUoaW5wdXQuZGF0YSksXG4gICAgICAgICAgICBzY2hlbWFFcnJvck1hcDogdGhpcy5fZGVmLmVycm9yTWFwLFxuICAgICAgICAgICAgcGF0aDogaW5wdXQucGF0aCxcbiAgICAgICAgICAgIHBhcmVudDogaW5wdXQucGFyZW50LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiBuZXcgUGFyc2VTdGF0dXMoKSxcbiAgICAgICAgICAgIGN0eDoge1xuICAgICAgICAgICAgICAgIGNvbW1vbjogaW5wdXQucGFyZW50LmNvbW1vbixcbiAgICAgICAgICAgICAgICBkYXRhOiBpbnB1dC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhcnNlZFR5cGU6IGdldFBhcnNlZFR5cGUoaW5wdXQuZGF0YSksXG4gICAgICAgICAgICAgICAgc2NoZW1hRXJyb3JNYXA6IHRoaXMuX2RlZi5lcnJvck1hcCxcbiAgICAgICAgICAgICAgICBwYXRoOiBpbnB1dC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogaW5wdXQucGFyZW50LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgX3BhcnNlU3luYyhpbnB1dCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wYXJzZShpbnB1dCk7XG4gICAgICAgIGlmIChpc0FzeW5jKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlN5bmNocm9ub3VzIHBhcnNlIGVuY291bnRlcmVkIHByb21pc2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIF9wYXJzZUFzeW5jKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3BhcnNlKGlucHV0KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXN1bHQpO1xuICAgIH1cbiAgICBwYXJzZShkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zYWZlUGFyc2UoZGF0YSwgcGFyYW1zKTtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5kYXRhO1xuICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgfVxuICAgIHNhZmVQYXJzZShkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICBhc3luYzogcGFyYW1zPy5hc3luYyA/PyBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb250ZXh0dWFsRXJyb3JNYXA6IHBhcmFtcz8uZXJyb3JNYXAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGFyYW1zPy5wYXRoIHx8IFtdLFxuICAgICAgICAgICAgc2NoZW1hRXJyb3JNYXA6IHRoaXMuX2RlZi5lcnJvck1hcCxcbiAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXJzZWRUeXBlOiBnZXRQYXJzZWRUeXBlKGRhdGEpLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9wYXJzZVN5bmMoeyBkYXRhLCBwYXRoOiBjdHgucGF0aCwgcGFyZW50OiBjdHggfSk7XG4gICAgICAgIHJldHVybiBoYW5kbGVSZXN1bHQoY3R4LCByZXN1bHQpO1xuICAgIH1cbiAgICBcIn52YWxpZGF0ZVwiKGRhdGEpIHtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICBhc3luYzogISF0aGlzW1wifnN0YW5kYXJkXCJdLmFzeW5jLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhdGg6IFtdLFxuICAgICAgICAgICAgc2NoZW1hRXJyb3JNYXA6IHRoaXMuX2RlZi5lcnJvck1hcCxcbiAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXJzZWRUeXBlOiBnZXRQYXJzZWRUeXBlKGRhdGEpLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIXRoaXNbXCJ+c3RhbmRhcmRcIl0uYXN5bmMpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcGFyc2VTeW5jKHsgZGF0YSwgcGF0aDogW10sIHBhcmVudDogY3R4IH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBjdHguY29tbW9uLmlzc3VlcyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyPy5tZXNzYWdlPy50b0xvd2VyQ2FzZSgpPy5pbmNsdWRlcyhcImVuY291bnRlcmVkXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbXCJ+c3RhbmRhcmRcIl0uYXN5bmMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdHguY29tbW9uID0ge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBhc3luYzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUFzeW5jKHsgZGF0YSwgcGF0aDogW10sIHBhcmVudDogY3R4IH0pLnRoZW4oKHJlc3VsdCkgPT4gaXNWYWxpZChyZXN1bHQpXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgaXNzdWVzOiBjdHguY29tbW9uLmlzc3VlcyxcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBwYXJzZUFzeW5jKGRhdGEsIHBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnNhZmVQYXJzZUFzeW5jKGRhdGEsIHBhcmFtcyk7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcylcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuZGF0YTtcbiAgICAgICAgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgIH1cbiAgICBhc3luYyBzYWZlUGFyc2VBc3luYyhkYXRhLCBwYXJhbXMpIHtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICBjb250ZXh0dWFsRXJyb3JNYXA6IHBhcmFtcz8uZXJyb3JNYXAsXG4gICAgICAgICAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGF0aDogcGFyYW1zPy5wYXRoIHx8IFtdLFxuICAgICAgICAgICAgc2NoZW1hRXJyb3JNYXA6IHRoaXMuX2RlZi5lcnJvck1hcCxcbiAgICAgICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXJzZWRUeXBlOiBnZXRQYXJzZWRUeXBlKGRhdGEpLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBtYXliZUFzeW5jUmVzdWx0ID0gdGhpcy5fcGFyc2UoeyBkYXRhLCBwYXRoOiBjdHgucGF0aCwgcGFyZW50OiBjdHggfSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IChpc0FzeW5jKG1heWJlQXN5bmNSZXN1bHQpID8gbWF5YmVBc3luY1Jlc3VsdCA6IFByb21pc2UucmVzb2x2ZShtYXliZUFzeW5jUmVzdWx0KSk7XG4gICAgICAgIHJldHVybiBoYW5kbGVSZXN1bHQoY3R4LCByZXN1bHQpO1xuICAgIH1cbiAgICByZWZpbmUoY2hlY2ssIG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc3QgZ2V0SXNzdWVQcm9wZXJ0aWVzID0gKHZhbCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBtZXNzYWdlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbWVzc2FnZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1lc3NhZ2UgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZmluZW1lbnQoKHZhbCwgY3R4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBjaGVjayh2YWwpO1xuICAgICAgICAgICAgY29uc3Qgc2V0RXJyb3IgPSAoKSA9PiBjdHguYWRkSXNzdWUoe1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5jdXN0b20sXG4gICAgICAgICAgICAgICAgLi4uZ2V0SXNzdWVQcm9wZXJ0aWVzKHZhbCksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiByZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZWZpbmVtZW50KGNoZWNrLCByZWZpbmVtZW50RGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVmaW5lbWVudCgodmFsLCBjdHgpID0+IHtcbiAgICAgICAgICAgIGlmICghY2hlY2sodmFsKSkge1xuICAgICAgICAgICAgICAgIGN0eC5hZGRJc3N1ZSh0eXBlb2YgcmVmaW5lbWVudERhdGEgPT09IFwiZnVuY3Rpb25cIiA/IHJlZmluZW1lbnREYXRhKHZhbCwgY3R4KSA6IHJlZmluZW1lbnREYXRhKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9yZWZpbmVtZW50KHJlZmluZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RFZmZlY3RzKHtcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcyxcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRWZmZWN0cyxcbiAgICAgICAgICAgIGVmZmVjdDogeyB0eXBlOiBcInJlZmluZW1lbnRcIiwgcmVmaW5lbWVudCB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3VwZXJSZWZpbmUocmVmaW5lbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVmaW5lbWVudChyZWZpbmVtZW50KTtcbiAgICB9XG4gICAgY29uc3RydWN0b3IoZGVmKSB7XG4gICAgICAgIC8qKiBBbGlhcyBvZiBzYWZlUGFyc2VBc3luYyAqL1xuICAgICAgICB0aGlzLnNwYSA9IHRoaXMuc2FmZVBhcnNlQXN5bmM7XG4gICAgICAgIHRoaXMuX2RlZiA9IGRlZjtcbiAgICAgICAgdGhpcy5wYXJzZSA9IHRoaXMucGFyc2UuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zYWZlUGFyc2UgPSB0aGlzLnNhZmVQYXJzZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnBhcnNlQXN5bmMgPSB0aGlzLnBhcnNlQXN5bmMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zYWZlUGFyc2VBc3luYyA9IHRoaXMuc2FmZVBhcnNlQXN5bmMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zcGEgPSB0aGlzLnNwYS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlZmluZSA9IHRoaXMucmVmaW5lLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVmaW5lbWVudCA9IHRoaXMucmVmaW5lbWVudC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnN1cGVyUmVmaW5lID0gdGhpcy5zdXBlclJlZmluZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gdGhpcy5vcHRpb25hbC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm51bGxhYmxlID0gdGhpcy5udWxsYWJsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm51bGxpc2ggPSB0aGlzLm51bGxpc2guYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5hcnJheSA9IHRoaXMuYXJyYXkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gdGhpcy5wcm9taXNlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMub3IgPSB0aGlzLm9yLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYW5kID0gdGhpcy5hbmQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJyYW5kID0gdGhpcy5icmFuZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlZmF1bHQgPSB0aGlzLmRlZmF1bHQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jYXRjaCA9IHRoaXMuY2F0Y2guYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZXNjcmliZSA9IHRoaXMuZGVzY3JpYmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5waXBlID0gdGhpcy5waXBlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMucmVhZG9ubHkgPSB0aGlzLnJlYWRvbmx5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaXNOdWxsYWJsZSA9IHRoaXMuaXNOdWxsYWJsZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmlzT3B0aW9uYWwgPSB0aGlzLmlzT3B0aW9uYWwuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpc1tcIn5zdGFuZGFyZFwiXSA9IHtcbiAgICAgICAgICAgIHZlcnNpb246IDEsXG4gICAgICAgICAgICB2ZW5kb3I6IFwiem9kXCIsXG4gICAgICAgICAgICB2YWxpZGF0ZTogKGRhdGEpID0+IHRoaXNbXCJ+dmFsaWRhdGVcIl0oZGF0YSksXG4gICAgICAgIH07XG4gICAgfVxuICAgIG9wdGlvbmFsKCkge1xuICAgICAgICByZXR1cm4gWm9kT3B0aW9uYWwuY3JlYXRlKHRoaXMsIHRoaXMuX2RlZik7XG4gICAgfVxuICAgIG51bGxhYmxlKCkge1xuICAgICAgICByZXR1cm4gWm9kTnVsbGFibGUuY3JlYXRlKHRoaXMsIHRoaXMuX2RlZik7XG4gICAgfVxuICAgIG51bGxpc2goKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm51bGxhYmxlKCkub3B0aW9uYWwoKTtcbiAgICB9XG4gICAgYXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBab2RBcnJheS5jcmVhdGUodGhpcyk7XG4gICAgfVxuICAgIHByb21pc2UoKSB7XG4gICAgICAgIHJldHVybiBab2RQcm9taXNlLmNyZWF0ZSh0aGlzLCB0aGlzLl9kZWYpO1xuICAgIH1cbiAgICBvcihvcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIFpvZFVuaW9uLmNyZWF0ZShbdGhpcywgb3B0aW9uXSwgdGhpcy5fZGVmKTtcbiAgICB9XG4gICAgYW5kKGluY29taW5nKSB7XG4gICAgICAgIHJldHVybiBab2RJbnRlcnNlY3Rpb24uY3JlYXRlKHRoaXMsIGluY29taW5nLCB0aGlzLl9kZWYpO1xuICAgIH1cbiAgICB0cmFuc2Zvcm0odHJhbnNmb3JtKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRWZmZWN0cyh7XG4gICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHRoaXMuX2RlZiksXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVmZmVjdHMsXG4gICAgICAgICAgICBlZmZlY3Q6IHsgdHlwZTogXCJ0cmFuc2Zvcm1cIiwgdHJhbnNmb3JtIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZWZhdWx0KGRlZikge1xuICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWVGdW5jID0gdHlwZW9mIGRlZiA9PT0gXCJmdW5jdGlvblwiID8gZGVmIDogKCkgPT4gZGVmO1xuICAgICAgICByZXR1cm4gbmV3IFpvZERlZmF1bHQoe1xuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyh0aGlzLl9kZWYpLFxuICAgICAgICAgICAgaW5uZXJUeXBlOiB0aGlzLFxuICAgICAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWVGdW5jLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2REZWZhdWx0LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYnJhbmQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQnJhbmRlZCh7XG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEJyYW5kZWQsXG4gICAgICAgICAgICB0eXBlOiB0aGlzLFxuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyh0aGlzLl9kZWYpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2F0Y2goZGVmKSB7XG4gICAgICAgIGNvbnN0IGNhdGNoVmFsdWVGdW5jID0gdHlwZW9mIGRlZiA9PT0gXCJmdW5jdGlvblwiID8gZGVmIDogKCkgPT4gZGVmO1xuICAgICAgICByZXR1cm4gbmV3IFpvZENhdGNoKHtcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXModGhpcy5fZGVmKSxcbiAgICAgICAgICAgIGlubmVyVHlwZTogdGhpcyxcbiAgICAgICAgICAgIGNhdGNoVmFsdWU6IGNhdGNoVmFsdWVGdW5jLFxuICAgICAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RDYXRjaCxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlc2NyaWJlKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIGNvbnN0IFRoaXMgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gbmV3IFRoaXMoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwaXBlKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gWm9kUGlwZWxpbmUuY3JlYXRlKHRoaXMsIHRhcmdldCk7XG4gICAgfVxuICAgIHJlYWRvbmx5KCkge1xuICAgICAgICByZXR1cm4gWm9kUmVhZG9ubHkuY3JlYXRlKHRoaXMpO1xuICAgIH1cbiAgICBpc09wdGlvbmFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zYWZlUGFyc2UodW5kZWZpbmVkKS5zdWNjZXNzO1xuICAgIH1cbiAgICBpc051bGxhYmxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zYWZlUGFyc2UobnVsbCkuc3VjY2VzcztcbiAgICB9XG59XG5jb25zdCBjdWlkUmVnZXggPSAvXmNbXlxccy1dezgsfSQvaTtcbmNvbnN0IGN1aWQyUmVnZXggPSAvXlswLTlhLXpdKyQvO1xuY29uc3QgdWxpZFJlZ2V4ID0gL15bMC05QS1ISktNTlAtVFYtWl17MjZ9JC9pO1xuLy8gY29uc3QgdXVpZFJlZ2V4ID1cbi8vICAgL14oW2EtZjAtOV17OH0tW2EtZjAtOV17NH0tWzEtNV1bYS1mMC05XXszfS1bYS1mMC05XXs0fS1bYS1mMC05XXsxMn18MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwKSQvaTtcbmNvbnN0IHV1aWRSZWdleCA9IC9eWzAtOWEtZkEtRl17OH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17NH1cXGItWzAtOWEtZkEtRl17MTJ9JC9pO1xuY29uc3QgbmFub2lkUmVnZXggPSAvXlthLXowLTlfLV17MjF9JC9pO1xuY29uc3Qgand0UmVnZXggPSAvXltBLVphLXowLTktX10rXFwuW0EtWmEtejAtOS1fXStcXC5bQS1aYS16MC05LV9dKiQvO1xuY29uc3QgZHVyYXRpb25SZWdleCA9IC9eWy0rXT9QKD8hJCkoPzooPzpbLStdP1xcZCtZKXwoPzpbLStdP1xcZCtbLixdXFxkK1kkKSk/KD86KD86Wy0rXT9cXGQrTSl8KD86Wy0rXT9cXGQrWy4sXVxcZCtNJCkpPyg/Oig/OlstK10/XFxkK1cpfCg/OlstK10/XFxkK1suLF1cXGQrVyQpKT8oPzooPzpbLStdP1xcZCtEKXwoPzpbLStdP1xcZCtbLixdXFxkK0QkKSk/KD86VCg/PVtcXGQrLV0pKD86KD86Wy0rXT9cXGQrSCl8KD86Wy0rXT9cXGQrWy4sXVxcZCtIJCkpPyg/Oig/OlstK10/XFxkK00pfCg/OlstK10/XFxkK1suLF1cXGQrTSQpKT8oPzpbLStdP1xcZCsoPzpbLixdXFxkKyk/Uyk/KT8/JC87XG4vLyBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80NjE4MS8xNTUwMTU1XG4vLyBvbGQgdmVyc2lvbjogdG9vIHNsb3csIGRpZG4ndCBzdXBwb3J0IHVuaWNvZGVcbi8vIGNvbnN0IGVtYWlsUmVnZXggPSAvXigoKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSsoXFwuKFthLXpdfFxcZHxbISNcXCQlJidcXCpcXCtcXC1cXC89XFw/XFxeX2B7XFx8fX5dfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSspKil8KChcXHgyMikoKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPygoW1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4N2ZdfFxceDIxfFtcXHgyMy1cXHg1Yl18W1xceDVkLVxceDdlXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSl8KFxcXFwoW1xceDAxLVxceDA5XFx4MGJcXHgwY1xceDBkLVxceDdmXXxbXFx1MDBBMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSkpKSkqKCgoXFx4MjB8XFx4MDkpKihcXHgwZFxceDBhKSk/KFxceDIwfFxceDA5KSspPyhcXHgyMikpKUAoKChbYS16XXxcXGR8W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pfCgoW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18XFxkfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSkpXFwuKSsoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKXwoKFthLXpdfFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKShbYS16XXxcXGR8LXxcXC58X3x+fFtcXHUwMEEwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdKSooW2Etel18W1xcdTAwQTAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0pKSkkL2k7XG4vL29sZCBlbWFpbCByZWdleFxuLy8gY29uc3QgZW1haWxSZWdleCA9IC9eKChbXjw+KClbXFxdLiw7Olxcc0BcIl0rKFxcLltePD4oKVtcXF0uLDs6XFxzQFwiXSspKil8KFwiLitcIikpQCgoPyEtKShbXjw+KClbXFxdLiw7Olxcc0BcIl0rXFwuKStbXjw+KClbXFxdLiw7Olxcc0BcIl17MSx9KVteLTw+KClbXFxdLiw7Olxcc0BcIl0kL2k7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbi8vIGNvbnN0IGVtYWlsUmVnZXggPVxuLy8gICAvXigoW148PigpW1xcXVxcXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClbXFxdXFxcXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChcXFsoKCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSlcXC4pezN9KCgyNVswLTVdKXwoMlswLTRdWzAtOV0pfCgxWzAtOV17Mn0pfChbMC05XXsxLDJ9KSlcXF0pfChcXFtJUHY2OigoW2EtZjAtOV17MSw0fTopezd9fDo6KFthLWYwLTldezEsNH06KXswLDZ9fChbYS1mMC05XXsxLDR9Oil7MX06KFthLWYwLTldezEsNH06KXswLDV9fChbYS1mMC05XXsxLDR9Oil7Mn06KFthLWYwLTldezEsNH06KXswLDR9fChbYS1mMC05XXsxLDR9Oil7M306KFthLWYwLTldezEsNH06KXswLDN9fChbYS1mMC05XXsxLDR9Oil7NH06KFthLWYwLTldezEsNH06KXswLDJ9fChbYS1mMC05XXsxLDR9Oil7NX06KFthLWYwLTldezEsNH06KXswLDF9KShbYS1mMC05XXsxLDR9fCgoKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKVxcLil7M30oKDI1WzAtNV0pfCgyWzAtNF1bMC05XSl8KDFbMC05XXsyfSl8KFswLTldezEsMn0pKSlcXF0pfChbQS1aYS16MC05XShbQS1aYS16MC05LV0qW0EtWmEtejAtOV0pKihcXC5bQS1aYS16XXsyLH0pKykpJC87XG4vLyBjb25zdCBlbWFpbFJlZ2V4ID1cbi8vICAgL15bYS16QS1aMC05XFwuXFwhXFwjXFwkXFwlXFwmXFwnXFwqXFwrXFwvXFw9XFw/XFxeXFxfXFxgXFx7XFx8XFx9XFx+XFwtXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcbi8vIGNvbnN0IGVtYWlsUmVnZXggPVxuLy8gICAvXig/OlthLXowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSp8XCIoPzpbXFx4MDEtXFx4MDhcXHgwYlxceDBjXFx4MGUtXFx4MWZcXHgyMVxceDIzLVxceDViXFx4NWQtXFx4N2ZdfFxcXFxbXFx4MDEtXFx4MDlcXHgwYlxceDBjXFx4MGUtXFx4N2ZdKSpcIilAKD86KD86W2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP1xcLikrW2EtejAtOV0oPzpbYS16MC05LV0qW2EtejAtOV0pP3xcXFsoPzooPzoyNVswLTVdfDJbMC00XVswLTldfFswMV0/WzAtOV1bMC05XT8pXFwuKXszfSg/OjI1WzAtNV18MlswLTRdWzAtOV18WzAxXT9bMC05XVswLTldP3xbYS16MC05LV0qW2EtejAtOV06KD86W1xceDAxLVxceDA4XFx4MGJcXHgwY1xceDBlLVxceDFmXFx4MjEtXFx4NWFcXHg1My1cXHg3Zl18XFxcXFtcXHgwMS1cXHgwOVxceDBiXFx4MGNcXHgwZS1cXHg3Zl0pKylcXF0pJC9pO1xuY29uc3QgZW1haWxSZWdleCA9IC9eKD8hXFwuKSg/IS4qXFwuXFwuKShbQS1aMC05XycrXFwtXFwuXSopW0EtWjAtOV8rLV1AKFtBLVowLTldW0EtWjAtOVxcLV0qXFwuKStbQS1aXXsyLH0kL2k7XG4vLyBjb25zdCBlbWFpbFJlZ2V4ID1cbi8vICAgL15bYS16MC05LiEjJCUm4oCZKisvPT9eX2B7fH1+LV0rQFthLXowLTktXSsoPzpcXC5bYS16MC05XFwtXSspKiQvaTtcbi8vIGZyb20gaHR0cHM6Ly90aGVrZXZpbnNjb3R0LmNvbS9lbW9qaXMtaW4tamF2YXNjcmlwdC8jd3JpdGluZy1hLXJlZ3VsYXItZXhwcmVzc2lvblxuY29uc3QgX2Vtb2ppUmVnZXggPSBgXihcXFxccHtFeHRlbmRlZF9QaWN0b2dyYXBoaWN9fFxcXFxwe0Vtb2ppX0NvbXBvbmVudH0pKyRgO1xubGV0IGVtb2ppUmVnZXg7XG4vLyBmYXN0ZXIsIHNpbXBsZXIsIHNhZmVyXG5jb25zdCBpcHY0UmVnZXggPSAvXig/Oig/OjI1WzAtNV18MlswLTRdWzAtOV18MVswLTldWzAtOV18WzEtOV1bMC05XXxbMC05XSlcXC4pezN9KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKSQvO1xuY29uc3QgaXB2NENpZHJSZWdleCA9IC9eKD86KD86MjVbMC01XXwyWzAtNF1bMC05XXwxWzAtOV1bMC05XXxbMS05XVswLTldfFswLTldKVxcLil7M30oPzoyNVswLTVdfDJbMC00XVswLTldfDFbMC05XVswLTldfFsxLTldWzAtOV18WzAtOV0pXFwvKDNbMC0yXXxbMTJdP1swLTldKSQvO1xuLy8gY29uc3QgaXB2NlJlZ2V4ID1cbi8vIC9eKChbYS1mMC05XXsxLDR9Oil7N318OjooW2EtZjAtOV17MSw0fTopezAsNn18KFthLWYwLTldezEsNH06KXsxfTooW2EtZjAtOV17MSw0fTopezAsNX18KFthLWYwLTldezEsNH06KXsyfTooW2EtZjAtOV17MSw0fTopezAsNH18KFthLWYwLTldezEsNH06KXszfTooW2EtZjAtOV17MSw0fTopezAsM318KFthLWYwLTldezEsNH06KXs0fTooW2EtZjAtOV17MSw0fTopezAsMn18KFthLWYwLTldezEsNH06KXs1fTooW2EtZjAtOV17MSw0fTopezAsMX0pKFthLWYwLTldezEsNH18KCgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpXFwuKXszfSgoMjVbMC01XSl8KDJbMC00XVswLTldKXwoMVswLTldezJ9KXwoWzAtOV17MSwyfSkpKSQvO1xuY29uc3QgaXB2NlJlZ2V4ID0gL14oKFswLTlhLWZBLUZdezEsNH06KXs3LDd9WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsN306fChbMC05YS1mQS1GXXsxLDR9Oil7MSw2fTpbMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw1fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwyfXwoWzAtOWEtZkEtRl17MSw0fTopezEsNH0oOlswLTlhLWZBLUZdezEsNH0pezEsM318KFswLTlhLWZBLUZdezEsNH06KXsxLDN9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwyfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw1fXxbMC05YS1mQS1GXXsxLDR9OigoOlswLTlhLWZBLUZdezEsNH0pezEsNn0pfDooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDd9fDopfGZlODA6KDpbMC05YS1mQS1GXXswLDR9KXswLDR9JVswLTlhLXpBLVpdezEsfXw6OihmZmZmKDowezEsNH0pezAsMX06KXswLDF9KCgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSlcXC4pezMsM30oMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pfChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fTooKDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKVxcLil7MywzfSgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSkpJC87XG5jb25zdCBpcHY2Q2lkclJlZ2V4ID0gL14oKFswLTlhLWZBLUZdezEsNH06KXs3LDd9WzAtOWEtZkEtRl17MSw0fXwoWzAtOWEtZkEtRl17MSw0fTopezEsN306fChbMC05YS1mQS1GXXsxLDR9Oil7MSw2fTpbMC05YS1mQS1GXXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSw1fSg6WzAtOWEtZkEtRl17MSw0fSl7MSwyfXwoWzAtOWEtZkEtRl17MSw0fTopezEsNH0oOlswLTlhLWZBLUZdezEsNH0pezEsM318KFswLTlhLWZBLUZdezEsNH06KXsxLDN9KDpbMC05YS1mQS1GXXsxLDR9KXsxLDR9fChbMC05YS1mQS1GXXsxLDR9Oil7MSwyfSg6WzAtOWEtZkEtRl17MSw0fSl7MSw1fXxbMC05YS1mQS1GXXsxLDR9OigoOlswLTlhLWZBLUZdezEsNH0pezEsNn0pfDooKDpbMC05YS1mQS1GXXsxLDR9KXsxLDd9fDopfGZlODA6KDpbMC05YS1mQS1GXXswLDR9KXswLDR9JVswLTlhLXpBLVpdezEsfXw6OihmZmZmKDowezEsNH0pezAsMX06KXswLDF9KCgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSlcXC4pezMsM30oMjVbMC01XXwoMlswLTRdfDF7MCwxfVswLTldKXswLDF9WzAtOV0pfChbMC05YS1mQS1GXXsxLDR9Oil7MSw0fTooKDI1WzAtNV18KDJbMC00XXwxezAsMX1bMC05XSl7MCwxfVswLTldKVxcLil7MywzfSgyNVswLTVdfCgyWzAtNF18MXswLDF9WzAtOV0pezAsMX1bMC05XSkpXFwvKDEyWzAtOF18MVswMV1bMC05XXxbMS05XT9bMC05XSkkLztcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc4NjAzOTIvZGV0ZXJtaW5lLWlmLXN0cmluZy1pcy1pbi1iYXNlNjQtdXNpbmctamF2YXNjcmlwdFxuY29uc3QgYmFzZTY0UmVnZXggPSAvXihbMC05YS16QS1aKy9dezR9KSooKFswLTlhLXpBLVorL117Mn09PSl8KFswLTlhLXpBLVorL117M309KSk/JC87XG4vLyBodHRwczovL2Jhc2U2NC5ndXJ1L3N0YW5kYXJkcy9iYXNlNjR1cmxcbmNvbnN0IGJhc2U2NHVybFJlZ2V4ID0gL14oWzAtOWEtekEtWi1fXXs0fSkqKChbMC05YS16QS1aLV9dezJ9KD09KT8pfChbMC05YS16QS1aLV9dezN9KD0pPykpPyQvO1xuLy8gc2ltcGxlXG4vLyBjb25zdCBkYXRlUmVnZXhTb3VyY2UgPSBgXFxcXGR7NH0tXFxcXGR7Mn0tXFxcXGR7Mn1gO1xuLy8gbm8gbGVhcCB5ZWFyIHZhbGlkYXRpb25cbi8vIGNvbnN0IGRhdGVSZWdleFNvdXJjZSA9IGBcXFxcZHs0fS0oKDBbMTM1NzhdfDEwfDEyKS0zMXwoMFsxMy05XXwxWzAtMl0pLTMwfCgwWzEtOV18MVswLTJdKS0oMFsxLTldfDFcXFxcZHwyXFxcXGQpKWA7XG4vLyB3aXRoIGxlYXAgeWVhciB2YWxpZGF0aW9uXG5jb25zdCBkYXRlUmVnZXhTb3VyY2UgPSBgKChcXFxcZFxcXFxkWzI0NjhdWzA0OF18XFxcXGRcXFxcZFsxMzU3OV1bMjZdfFxcXFxkXFxcXGQwWzQ4XXxbMDI0NjhdWzA0OF0wMHxbMTM1NzldWzI2XTAwKS0wMi0yOXxcXFxcZHs0fS0oKDBbMTM1NzhdfDFbMDJdKS0oMFsxLTldfFsxMl1cXFxcZHwzWzAxXSl8KDBbNDY5XXwxMSktKDBbMS05XXxbMTJdXFxcXGR8MzApfCgwMiktKDBbMS05XXwxXFxcXGR8MlswLThdKSkpYDtcbmNvbnN0IGRhdGVSZWdleCA9IG5ldyBSZWdFeHAoYF4ke2RhdGVSZWdleFNvdXJjZX0kYCk7XG5mdW5jdGlvbiB0aW1lUmVnZXhTb3VyY2UoYXJncykge1xuICAgIGxldCBzZWNvbmRzUmVnZXhTb3VyY2UgPSBgWzAtNV1cXFxcZGA7XG4gICAgaWYgKGFyZ3MucHJlY2lzaW9uKSB7XG4gICAgICAgIHNlY29uZHNSZWdleFNvdXJjZSA9IGAke3NlY29uZHNSZWdleFNvdXJjZX1cXFxcLlxcXFxkeyR7YXJncy5wcmVjaXNpb259fWA7XG4gICAgfVxuICAgIGVsc2UgaWYgKGFyZ3MucHJlY2lzaW9uID09IG51bGwpIHtcbiAgICAgICAgc2Vjb25kc1JlZ2V4U291cmNlID0gYCR7c2Vjb25kc1JlZ2V4U291cmNlfShcXFxcLlxcXFxkKyk/YDtcbiAgICB9XG4gICAgY29uc3Qgc2Vjb25kc1F1YW50aWZpZXIgPSBhcmdzLnByZWNpc2lvbiA/IFwiK1wiIDogXCI/XCI7IC8vIHJlcXVpcmUgc2Vjb25kcyBpZiBwcmVjaXNpb24gaXMgbm9uemVyb1xuICAgIHJldHVybiBgKFswMV1cXFxcZHwyWzAtM10pOlswLTVdXFxcXGQoOiR7c2Vjb25kc1JlZ2V4U291cmNlfSkke3NlY29uZHNRdWFudGlmaWVyfWA7XG59XG5mdW5jdGlvbiB0aW1lUmVnZXgoYXJncykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKGBeJHt0aW1lUmVnZXhTb3VyY2UoYXJncyl9JGApO1xufVxuLy8gQWRhcHRlZCBmcm9tIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zMTQzMjMxXG5leHBvcnQgZnVuY3Rpb24gZGF0ZXRpbWVSZWdleChhcmdzKSB7XG4gICAgbGV0IHJlZ2V4ID0gYCR7ZGF0ZVJlZ2V4U291cmNlfVQke3RpbWVSZWdleFNvdXJjZShhcmdzKX1gO1xuICAgIGNvbnN0IG9wdHMgPSBbXTtcbiAgICBvcHRzLnB1c2goYXJncy5sb2NhbCA/IGBaP2AgOiBgWmApO1xuICAgIGlmIChhcmdzLm9mZnNldClcbiAgICAgICAgb3B0cy5wdXNoKGAoWystXVxcXFxkezJ9Oj9cXFxcZHsyfSlgKTtcbiAgICByZWdleCA9IGAke3JlZ2V4fSgke29wdHMuam9pbihcInxcIil9KWA7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoYF4ke3JlZ2V4fSRgKTtcbn1cbmZ1bmN0aW9uIGlzVmFsaWRJUChpcCwgdmVyc2lvbikge1xuICAgIGlmICgodmVyc2lvbiA9PT0gXCJ2NFwiIHx8ICF2ZXJzaW9uKSAmJiBpcHY0UmVnZXgudGVzdChpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICgodmVyc2lvbiA9PT0gXCJ2NlwiIHx8ICF2ZXJzaW9uKSAmJiBpcHY2UmVnZXgudGVzdChpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzVmFsaWRKV1Qoand0LCBhbGcpIHtcbiAgICBpZiAoIWp3dFJlZ2V4LnRlc3Qoand0KSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IFtoZWFkZXJdID0gand0LnNwbGl0KFwiLlwiKTtcbiAgICAgICAgaWYgKCFoZWFkZXIpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIC8vIENvbnZlcnQgYmFzZTY0dXJsIHRvIGJhc2U2NFxuICAgICAgICBjb25zdCBiYXNlNjQgPSBoZWFkZXJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8tL2csIFwiK1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoL18vZywgXCIvXCIpXG4gICAgICAgICAgICAucGFkRW5kKGhlYWRlci5sZW5ndGggKyAoKDQgLSAoaGVhZGVyLmxlbmd0aCAlIDQpKSAlIDQpLCBcIj1cIik7XG4gICAgICAgIGNvbnN0IGRlY29kZWQgPSBKU09OLnBhcnNlKGF0b2IoYmFzZTY0KSk7XG4gICAgICAgIGlmICh0eXBlb2YgZGVjb2RlZCAhPT0gXCJvYmplY3RcIiB8fCBkZWNvZGVkID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoXCJ0eXBcIiBpbiBkZWNvZGVkICYmIGRlY29kZWQ/LnR5cCAhPT0gXCJKV1RcIilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKCFkZWNvZGVkLmFsZylcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKGFsZyAmJiBkZWNvZGVkLmFsZyAhPT0gYWxnKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuZnVuY3Rpb24gaXNWYWxpZENpZHIoaXAsIHZlcnNpb24pIHtcbiAgICBpZiAoKHZlcnNpb24gPT09IFwidjRcIiB8fCAhdmVyc2lvbikgJiYgaXB2NENpZHJSZWdleC50ZXN0KGlwKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKCh2ZXJzaW9uID09PSBcInY2XCIgfHwgIXZlcnNpb24pICYmIGlwdjZDaWRyUmVnZXgudGVzdChpcCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBjbGFzcyBab2RTdHJpbmcgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIGlucHV0LmRhdGEgPSBTdHJpbmcoaW5wdXQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5zdHJpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuc3RyaW5nLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gbmV3IFBhcnNlU3RhdHVzKCk7XG4gICAgICAgIGxldCBjdHggPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAoY29uc3QgY2hlY2sgb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoZWNrLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuZGF0YS5sZW5ndGggPCBjaGVjay52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuZGF0YS5sZW5ndGggPiBjaGVjay52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImxlbmd0aFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vQmlnID0gaW5wdXQuZGF0YS5sZW5ndGggPiBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29TbWFsbCA9IGlucHV0LmRhdGEubGVuZ3RoIDwgY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvb0JpZyB8fCB0b29TbWFsbCkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvb0JpZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRvb1NtYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImVtYWlsXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWVtYWlsUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImVtYWlsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJlbW9qaVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbW9qaVJlZ2V4KSB7XG4gICAgICAgICAgICAgICAgICAgIGVtb2ppUmVnZXggPSBuZXcgUmVnRXhwKF9lbW9qaVJlZ2V4LCBcInVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZW1vamlSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiZW1vamlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInV1aWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghdXVpZFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJ1dWlkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJuYW5vaWRcIikge1xuICAgICAgICAgICAgICAgIGlmICghbmFub2lkUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcIm5hbm9pZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiY3VpZFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdWlkUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImN1aWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImN1aWQyXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWN1aWQyUmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImN1aWQyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ1bGlkXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXVsaWRSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwidWxpZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidXJsXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBuZXcgVVJMKGlucHV0LmRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwidXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJyZWdleFwiKSB7XG4gICAgICAgICAgICAgICAgY2hlY2sucmVnZXgubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXN0UmVzdWx0ID0gY2hlY2sucmVnZXgudGVzdChpbnB1dC5kYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRlc3RSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJyZWdleFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidHJpbVwiKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZGF0YSA9IGlucHV0LmRhdGEudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJpbmNsdWRlc1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpbnB1dC5kYXRhLmluY2x1ZGVzKGNoZWNrLnZhbHVlLCBjaGVjay5wb3NpdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogeyBpbmNsdWRlczogY2hlY2sudmFsdWUsIHBvc2l0aW9uOiBjaGVjay5wb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwidG9Mb3dlckNhc2VcIikge1xuICAgICAgICAgICAgICAgIGlucHV0LmRhdGEgPSBpbnB1dC5kYXRhLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcInRvVXBwZXJDYXNlXCIpIHtcbiAgICAgICAgICAgICAgICBpbnB1dC5kYXRhID0gaW5wdXQuZGF0YS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJzdGFydHNXaXRoXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlucHV0LmRhdGEuc3RhcnRzV2l0aChjaGVjay52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogeyBzdGFydHNXaXRoOiBjaGVjay52YWx1ZSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZW5kc1dpdGhcIikge1xuICAgICAgICAgICAgICAgIGlmICghaW5wdXQuZGF0YS5lbmRzV2l0aChjaGVjay52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogeyBlbmRzV2l0aDogY2hlY2sudmFsdWUgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImRhdGV0aW1lXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IGRhdGV0aW1lUmVnZXgoY2hlY2spO1xuICAgICAgICAgICAgICAgIGlmICghcmVnZXgudGVzdChpbnB1dC5kYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImRhdGV0aW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJkYXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IGRhdGVSZWdleDtcbiAgICAgICAgICAgICAgICBpZiAoIXJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJ0aW1lXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IHRpbWVSZWdleChjaGVjayk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwidGltZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiZHVyYXRpb25cIikge1xuICAgICAgICAgICAgICAgIGlmICghZHVyYXRpb25SZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiZHVyYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImlwXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRJUChpbnB1dC5kYXRhLCBjaGVjay52ZXJzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxpZGF0aW9uOiBcImlwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJqd3RcIikge1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZEpXVChpbnB1dC5kYXRhLCBjaGVjay5hbGcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiand0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJjaWRyXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRDaWRyKGlucHV0LmRhdGEsIGNoZWNrLnZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiY2lkclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwiYmFzZTY0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWJhc2U2NFJlZ2V4LnRlc3QoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGlvbjogXCJiYXNlNjRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3N0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcImJhc2U2NHVybFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFiYXNlNjR1cmxSZWdleC50ZXN0KGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IFwiYmFzZTY0dXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9zdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5hc3NlcnROZXZlcihjaGVjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgc3RhdHVzOiBzdGF0dXMudmFsdWUsIHZhbHVlOiBpbnB1dC5kYXRhIH07XG4gICAgfVxuICAgIF9yZWdleChyZWdleCwgdmFsaWRhdGlvbiwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWZpbmVtZW50KChkYXRhKSA9PiByZWdleC50ZXN0KGRhdGEpLCB7XG4gICAgICAgICAgICB2YWxpZGF0aW9uLFxuICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfc3RyaW5nLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2FkZENoZWNrKGNoZWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kU3RyaW5nKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIGNoZWNrXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVtYWlsKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJlbWFpbFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIHVybChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwidXJsXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgZW1vamkobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImVtb2ppXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgdXVpZChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwidXVpZFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIG5hbm9pZChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwibmFub2lkXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSB9KTtcbiAgICB9XG4gICAgY3VpZChtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiY3VpZFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIGN1aWQyKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJjdWlkMlwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIHVsaWQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcInVsaWRcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICBiYXNlNjQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImJhc2U2NFwiLCAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSkgfSk7XG4gICAgfVxuICAgIGJhc2U2NHVybChtZXNzYWdlKSB7XG4gICAgICAgIC8vIGJhc2U2NHVybCBlbmNvZGluZyBpcyBhIG1vZGlmaWNhdGlvbiBvZiBiYXNlNjQgdGhhdCBjYW4gc2FmZWx5IGJlIHVzZWQgaW4gVVJMcyBhbmQgZmlsZW5hbWVzXG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImJhc2U2NHVybFwiLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgand0KG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJqd3RcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnMpIH0pO1xuICAgIH1cbiAgICBpcChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiaXBcIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG9wdGlvbnMpIH0pO1xuICAgIH1cbiAgICBjaWRyKG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHsga2luZDogXCJjaWRyXCIsIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zKSB9KTtcbiAgICB9XG4gICAgZGF0ZXRpbWUob3B0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICAgICAga2luZDogXCJkYXRldGltZVwiLFxuICAgICAgICAgICAgICAgIHByZWNpc2lvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGxvY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBvcHRpb25zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiZGF0ZXRpbWVcIixcbiAgICAgICAgICAgIHByZWNpc2lvbjogdHlwZW9mIG9wdGlvbnM/LnByZWNpc2lvbiA9PT0gXCJ1bmRlZmluZWRcIiA/IG51bGwgOiBvcHRpb25zPy5wcmVjaXNpb24sXG4gICAgICAgICAgICBvZmZzZXQ6IG9wdGlvbnM/Lm9mZnNldCA/PyBmYWxzZSxcbiAgICAgICAgICAgIGxvY2FsOiBvcHRpb25zPy5sb2NhbCA/PyBmYWxzZSxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zPy5tZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRhdGUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soeyBraW5kOiBcImRhdGVcIiwgbWVzc2FnZSB9KTtcbiAgICB9XG4gICAgdGltZShvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgICAgICBraW5kOiBcInRpbWVcIixcbiAgICAgICAgICAgICAgICBwcmVjaXNpb246IG51bGwsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogb3B0aW9ucyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcInRpbWVcIixcbiAgICAgICAgICAgIHByZWNpc2lvbjogdHlwZW9mIG9wdGlvbnM/LnByZWNpc2lvbiA9PT0gXCJ1bmRlZmluZWRcIiA/IG51bGwgOiBvcHRpb25zPy5wcmVjaXNpb24sXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoob3B0aW9ucz8ubWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkdXJhdGlvbihtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7IGtpbmQ6IFwiZHVyYXRpb25cIiwgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpIH0pO1xuICAgIH1cbiAgICByZWdleChyZWdleCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJyZWdleFwiLFxuICAgICAgICAgICAgcmVnZXg6IHJlZ2V4LFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaW5jbHVkZXModmFsdWUsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiaW5jbHVkZXNcIixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBvcHRpb25zPy5wb3NpdGlvbixcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihvcHRpb25zPy5tZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0YXJ0c1dpdGgodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwic3RhcnRzV2l0aFwiLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZW5kc1dpdGgodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwiZW5kc1dpdGhcIixcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1pbihtaW5MZW5ndGgsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogbWluTGVuZ3RoLFxuICAgICAgICAgICAgLi4uZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWF4KG1heExlbmd0aCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiBtYXhMZW5ndGgsXG4gICAgICAgICAgICAuLi5lcnJvclV0aWwuZXJyVG9PYmoobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsZW5ndGgobGVuLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcImxlbmd0aFwiLFxuICAgICAgICAgICAgdmFsdWU6IGxlbixcbiAgICAgICAgICAgIC4uLmVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEVxdWl2YWxlbnQgdG8gYC5taW4oMSlgXG4gICAgICovXG4gICAgbm9uZW1wdHkobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5taW4oMSwgZXJyb3JVdGlsLmVyclRvT2JqKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgdHJpbSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTdHJpbmcoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbLi4udGhpcy5fZGVmLmNoZWNrcywgeyBraW5kOiBcInRyaW1cIiB9XSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRvTG93ZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFN0cmluZyh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCB7IGtpbmQ6IFwidG9Mb3dlckNhc2VcIiB9XSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRvVXBwZXJDYXNlKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFN0cmluZyh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCB7IGtpbmQ6IFwidG9VcHBlckNhc2VcIiB9XSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBpc0RhdGV0aW1lKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImRhdGV0aW1lXCIpO1xuICAgIH1cbiAgICBnZXQgaXNEYXRlKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImRhdGVcIik7XG4gICAgfVxuICAgIGdldCBpc1RpbWUoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwidGltZVwiKTtcbiAgICB9XG4gICAgZ2V0IGlzRHVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwiZHVyYXRpb25cIik7XG4gICAgfVxuICAgIGdldCBpc0VtYWlsKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImVtYWlsXCIpO1xuICAgIH1cbiAgICBnZXQgaXNVUkwoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwidXJsXCIpO1xuICAgIH1cbiAgICBnZXQgaXNFbW9qaSgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJlbW9qaVwiKTtcbiAgICB9XG4gICAgZ2V0IGlzVVVJRCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJ1dWlkXCIpO1xuICAgIH1cbiAgICBnZXQgaXNOQU5PSUQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuX2RlZi5jaGVja3MuZmluZCgoY2gpID0+IGNoLmtpbmQgPT09IFwibmFub2lkXCIpO1xuICAgIH1cbiAgICBnZXQgaXNDVUlEKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImN1aWRcIik7XG4gICAgfVxuICAgIGdldCBpc0NVSUQyKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImN1aWQyXCIpO1xuICAgIH1cbiAgICBnZXQgaXNVTElEKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcInVsaWRcIik7XG4gICAgfVxuICAgIGdldCBpc0lQKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImlwXCIpO1xuICAgIH1cbiAgICBnZXQgaXNDSURSKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLl9kZWYuY2hlY2tzLmZpbmQoKGNoKSA9PiBjaC5raW5kID09PSBcImNpZHJcIik7XG4gICAgfVxuICAgIGdldCBpc0Jhc2U2NCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJiYXNlNjRcIik7XG4gICAgfVxuICAgIGdldCBpc0Jhc2U2NHVybCgpIHtcbiAgICAgICAgLy8gYmFzZTY0dXJsIGVuY29kaW5nIGlzIGEgbW9kaWZpY2F0aW9uIG9mIGJhc2U2NCB0aGF0IGNhbiBzYWZlbHkgYmUgdXNlZCBpbiBVUkxzIGFuZCBmaWxlbmFtZXNcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJiYXNlNjR1cmxcIik7XG4gICAgfVxuICAgIGdldCBtaW5MZW5ndGgoKSB7XG4gICAgICAgIGxldCBtaW4gPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gbnVsbCB8fCBjaC52YWx1ZSA+IG1pbilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgZ2V0IG1heExlbmd0aCgpIHtcbiAgICAgICAgbGV0IG1heCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID09PSBudWxsIHx8IGNoLnZhbHVlIDwgbWF4KVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cbn1cblpvZFN0cmluZy5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RTdHJpbmcoe1xuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFN0cmluZyxcbiAgICAgICAgY29lcmNlOiBwYXJhbXM/LmNvZXJjZSA/PyBmYWxzZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM5NjY0ODQvd2h5LWRvZXMtbW9kdWx1cy1vcGVyYXRvci1yZXR1cm4tZnJhY3Rpb25hbC1udW1iZXItaW4tamF2YXNjcmlwdC8zMTcxMTAzNCMzMTcxMTAzNFxuZnVuY3Rpb24gZmxvYXRTYWZlUmVtYWluZGVyKHZhbCwgc3RlcCkge1xuICAgIGNvbnN0IHZhbERlY0NvdW50ID0gKHZhbC50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXSB8fCBcIlwiKS5sZW5ndGg7XG4gICAgY29uc3Qgc3RlcERlY0NvdW50ID0gKHN0ZXAudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0gfHwgXCJcIikubGVuZ3RoO1xuICAgIGNvbnN0IGRlY0NvdW50ID0gdmFsRGVjQ291bnQgPiBzdGVwRGVjQ291bnQgPyB2YWxEZWNDb3VudCA6IHN0ZXBEZWNDb3VudDtcbiAgICBjb25zdCB2YWxJbnQgPSBOdW1iZXIucGFyc2VJbnQodmFsLnRvRml4ZWQoZGVjQ291bnQpLnJlcGxhY2UoXCIuXCIsIFwiXCIpKTtcbiAgICBjb25zdCBzdGVwSW50ID0gTnVtYmVyLnBhcnNlSW50KHN0ZXAudG9GaXhlZChkZWNDb3VudCkucmVwbGFjZShcIi5cIiwgXCJcIikpO1xuICAgIHJldHVybiAodmFsSW50ICUgc3RlcEludCkgLyAxMCAqKiBkZWNDb3VudDtcbn1cbmV4cG9ydCBjbGFzcyBab2ROdW1iZXIgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5taW4gPSB0aGlzLmd0ZTtcbiAgICAgICAgdGhpcy5tYXggPSB0aGlzLmx0ZTtcbiAgICAgICAgdGhpcy5zdGVwID0gdGhpcy5tdWx0aXBsZU9mO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIGlucHV0LmRhdGEgPSBOdW1iZXIoaW5wdXQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5udW1iZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUubnVtYmVyLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN0eCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gbmV3IFBhcnNlU3RhdHVzKCk7XG4gICAgICAgIGZvciAoY29uc3QgY2hlY2sgb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoZWNrLmtpbmQgPT09IFwiaW50XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXV0aWwuaXNJbnRlZ2VyKGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogXCJpbnRlZ2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWNlaXZlZDogXCJmbG9hdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoZWNrLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29TbWFsbCA9IGNoZWNrLmluY2x1c2l2ZSA/IGlucHV0LmRhdGEgPCBjaGVjay52YWx1ZSA6IGlucHV0LmRhdGEgPD0gY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvb1NtYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IGNoZWNrLmluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vQmlnID0gY2hlY2suaW5jbHVzaXZlID8gaW5wdXQuZGF0YSA+IGNoZWNrLnZhbHVlIDogaW5wdXQuZGF0YSA+PSBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9vQmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiBjaGVjay5pbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtdWx0aXBsZU9mXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZmxvYXRTYWZlUmVtYWluZGVyKGlucHV0LmRhdGEsIGNoZWNrLnZhbHVlKSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCwgY3R4KTtcbiAgICAgICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUubm90X211bHRpcGxlX29mLFxuICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlwbGVPZjogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJmaW5pdGVcIikge1xuICAgICAgICAgICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5ub3RfZmluaXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoY2hlY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogaW5wdXQuZGF0YSB9O1xuICAgIH1cbiAgICBndGUodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtaW5cIiwgdmFsdWUsIHRydWUsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGd0KHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWluXCIsIHZhbHVlLCBmYWxzZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgbHRlKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWF4XCIsIHZhbHVlLCB0cnVlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBsdCh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1heFwiLCB2YWx1ZSwgZmFsc2UsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIHNldExpbWl0KGtpbmQsIHZhbHVlLCBpbmNsdXNpdmUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2ROdW1iZXIoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2hlY2tzOiBbXG4gICAgICAgICAgICAgICAgLi4udGhpcy5fZGVmLmNoZWNrcyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtpbmQsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9hZGRDaGVjayhjaGVjaykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE51bWJlcih7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFsuLi50aGlzLl9kZWYuY2hlY2tzLCBjaGVja10sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpbnQobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJpbnRcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBvc2l0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIGluY2x1c2l2ZTogZmFsc2UsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBuZWdhdGl2ZShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1heFwiLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IGZhbHNlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm9ucG9zaXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtYXhcIixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm9ubmVnYXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbXVsdGlwbGVPZih2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtdWx0aXBsZU9mXCIsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaW5pdGUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJmaW5pdGVcIixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNhZmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgIHZhbHVlOiBOdW1iZXIuTUlOX1NBRkVfSU5URUdFUixcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSkuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbWluVmFsdWUoKSB7XG4gICAgICAgIGxldCBtaW4gPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1pbiA9PT0gbnVsbCB8fCBjaC52YWx1ZSA+IG1pbilcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICB9XG4gICAgZ2V0IG1heFZhbHVlKCkge1xuICAgICAgICBsZXQgbWF4ID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChtYXggPT09IG51bGwgfHwgY2gudmFsdWUgPCBtYXgpXG4gICAgICAgICAgICAgICAgICAgIG1heCA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXg7XG4gICAgfVxuICAgIGdldCBpc0ludCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZGVmLmNoZWNrcy5maW5kKChjaCkgPT4gY2gua2luZCA9PT0gXCJpbnRcIiB8fCAoY2gua2luZCA9PT0gXCJtdWx0aXBsZU9mXCIgJiYgdXRpbC5pc0ludGVnZXIoY2gudmFsdWUpKSk7XG4gICAgfVxuICAgIGdldCBpc0Zpbml0ZSgpIHtcbiAgICAgICAgbGV0IG1heCA9IG51bGw7XG4gICAgICAgIGxldCBtaW4gPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcImZpbml0ZVwiIHx8IGNoLmtpbmQgPT09IFwiaW50XCIgfHwgY2gua2luZCA9PT0gXCJtdWx0aXBsZU9mXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluID09PSBudWxsIHx8IGNoLnZhbHVlID4gbWluKVxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNoLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID09PSBudWxsIHx8IGNoLnZhbHVlIDwgbWF4KVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKG1pbikgJiYgTnVtYmVyLmlzRmluaXRlKG1heCk7XG4gICAgfVxufVxuWm9kTnVtYmVyLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE51bWJlcih7XG4gICAgICAgIGNoZWNrczogW10sXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTnVtYmVyLFxuICAgICAgICBjb2VyY2U6IHBhcmFtcz8uY29lcmNlIHx8IGZhbHNlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEJpZ0ludCBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLm1pbiA9IHRoaXMuZ3RlO1xuICAgICAgICB0aGlzLm1heCA9IHRoaXMubHRlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZi5jb2VyY2UpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaW5wdXQuZGF0YSA9IEJpZ0ludChpbnB1dC5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SW52YWxpZElucHV0KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmJpZ2ludCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEludmFsaWRJbnB1dChpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGN0eCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gbmV3IFBhcnNlU3RhdHVzKCk7XG4gICAgICAgIGZvciAoY29uc3QgY2hlY2sgb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoZWNrLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b29TbWFsbCA9IGNoZWNrLmluY2x1c2l2ZSA/IGlucHV0LmRhdGEgPCBjaGVjay52YWx1ZSA6IGlucHV0LmRhdGEgPD0gY2hlY2sudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRvb1NtYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImJpZ2ludFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluaW11bTogY2hlY2sudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IGNoZWNrLmluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGVjay5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9vQmlnID0gY2hlY2suaW5jbHVzaXZlID8gaW5wdXQuZGF0YSA+IGNoZWNrLnZhbHVlIDogaW5wdXQuZGF0YSA+PSBjaGVjay52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodG9vQmlnKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJiaWdpbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVzaXZlOiBjaGVjay5pbmNsdXNpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjaGVjay5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtdWx0aXBsZU9mXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQuZGF0YSAlIGNoZWNrLnZhbHVlICE9PSBCaWdJbnQoMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLm5vdF9tdWx0aXBsZV9vZixcbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlT2Y6IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHV0aWwuYXNzZXJ0TmV2ZXIoY2hlY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogaW5wdXQuZGF0YSB9O1xuICAgIH1cbiAgICBfZ2V0SW52YWxpZElucHV0KGlucHV0KSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuYmlnaW50LFxuICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgfVxuICAgIGd0ZSh2YWx1ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXRMaW1pdChcIm1pblwiLCB2YWx1ZSwgdHJ1ZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgZ3QodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtaW5cIiwgdmFsdWUsIGZhbHNlLCBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkpO1xuICAgIH1cbiAgICBsdGUodmFsdWUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0TGltaXQoXCJtYXhcIiwgdmFsdWUsIHRydWUsIGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSk7XG4gICAgfVxuICAgIGx0KHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldExpbWl0KFwibWF4XCIsIHZhbHVlLCBmYWxzZSwgZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpKTtcbiAgICB9XG4gICAgc2V0TGltaXQoa2luZCwgdmFsdWUsIGluY2x1c2l2ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEJpZ0ludCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBjaGVja3M6IFtcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9kZWYuY2hlY2tzLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2luZCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgX2FkZENoZWNrKGNoZWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQmlnSW50KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIGNoZWNrXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHBvc2l0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogQmlnSW50KDApLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5lZ2F0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogQmlnSW50KDApLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiBmYWxzZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vbnBvc2l0aXZlKG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogQmlnSW50KDApLFxuICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbm9ubmVnYXRpdmUobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWRkQ2hlY2soe1xuICAgICAgICAgICAga2luZDogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBCaWdJbnQoMCksXG4gICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtdWx0aXBsZU9mKHZhbHVlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm11bHRpcGxlT2ZcIixcbiAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0IG1pblZhbHVlKCkge1xuICAgICAgICBsZXQgbWluID0gbnVsbDtcbiAgICAgICAgZm9yIChjb25zdCBjaCBvZiB0aGlzLl9kZWYuY2hlY2tzKSB7XG4gICAgICAgICAgICBpZiAoY2gua2luZCA9PT0gXCJtaW5cIikge1xuICAgICAgICAgICAgICAgIGlmIChtaW4gPT09IG51bGwgfHwgY2gudmFsdWUgPiBtaW4pXG4gICAgICAgICAgICAgICAgICAgIG1pbiA9IGNoLnZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW47XG4gICAgfVxuICAgIGdldCBtYXhWYWx1ZSgpIHtcbiAgICAgICAgbGV0IG1heCA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWF4XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4ID09PSBudWxsIHx8IGNoLnZhbHVlIDwgbWF4KVxuICAgICAgICAgICAgICAgICAgICBtYXggPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIH1cbn1cblpvZEJpZ0ludC5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RCaWdJbnQoe1xuICAgICAgICBjaGVja3M6IFtdLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEJpZ0ludCxcbiAgICAgICAgY29lcmNlOiBwYXJhbXM/LmNvZXJjZSA/PyBmYWxzZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RCb29sZWFuIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWYuY29lcmNlKSB7XG4gICAgICAgICAgICBpbnB1dC5kYXRhID0gQm9vbGVhbihpbnB1dC5kYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLmJvb2xlYW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuYm9vbGVhbixcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RCb29sZWFuLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEJvb2xlYW4oe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEJvb2xlYW4sXG4gICAgICAgIGNvZXJjZTogcGFyYW1zPy5jb2VyY2UgfHwgZmFsc2UsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kRGF0ZSBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5fZGVmLmNvZXJjZSkge1xuICAgICAgICAgICAgaW5wdXQuZGF0YSA9IG5ldyBEYXRlKGlucHV0LmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuZGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5kYXRlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE51bWJlci5pc05hTihpbnB1dC5kYXRhLmdldFRpbWUoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2RhdGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN0YXR1cyA9IG5ldyBQYXJzZVN0YXR1cygpO1xuICAgICAgICBsZXQgY3R4ID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKGNvbnN0IGNoZWNrIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaGVjay5raW5kID09PSBcIm1pblwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlucHV0LmRhdGEuZ2V0VGltZSgpIDwgY2hlY2sudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQsIGN0eCk7XG4gICAgICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNoZWNrLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBleGFjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiBjaGVjay52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hlY2sua2luZCA9PT0gXCJtYXhcIikge1xuICAgICAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhLmdldFRpbWUoKSA+IGNoZWNrLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0LCBjdHgpO1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2hlY2subWVzc2FnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1c2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heGltdW06IGNoZWNrLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB1dGlsLmFzc2VydE5ldmVyKGNoZWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMudmFsdWUsXG4gICAgICAgICAgICB2YWx1ZTogbmV3IERhdGUoaW5wdXQuZGF0YS5nZXRUaW1lKCkpLFxuICAgICAgICB9O1xuICAgIH1cbiAgICBfYWRkQ2hlY2soY2hlY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2REYXRlKHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIGNoZWNrczogWy4uLnRoaXMuX2RlZi5jaGVja3MsIGNoZWNrXSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG1pbihtaW5EYXRlLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hZGRDaGVjayh7XG4gICAgICAgICAgICBraW5kOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IG1pbkRhdGUuZ2V0VGltZSgpLFxuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWF4KG1heERhdGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FkZENoZWNrKHtcbiAgICAgICAgICAgIGtpbmQ6IFwibWF4XCIsXG4gICAgICAgICAgICB2YWx1ZTogbWF4RGF0ZS5nZXRUaW1lKCksXG4gICAgICAgICAgICBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSksXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgbWluRGF0ZSgpIHtcbiAgICAgICAgbGV0IG1pbiA9IG51bGw7XG4gICAgICAgIGZvciAoY29uc3QgY2ggb2YgdGhpcy5fZGVmLmNoZWNrcykge1xuICAgICAgICAgICAgaWYgKGNoLmtpbmQgPT09IFwibWluXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobWluID09PSBudWxsIHx8IGNoLnZhbHVlID4gbWluKVxuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjaC52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluICE9IG51bGwgPyBuZXcgRGF0ZShtaW4pIDogbnVsbDtcbiAgICB9XG4gICAgZ2V0IG1heERhdGUoKSB7XG4gICAgICAgIGxldCBtYXggPSBudWxsO1xuICAgICAgICBmb3IgKGNvbnN0IGNoIG9mIHRoaXMuX2RlZi5jaGVja3MpIHtcbiAgICAgICAgICAgIGlmIChjaC5raW5kID09PSBcIm1heFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heCA9PT0gbnVsbCB8fCBjaC52YWx1ZSA8IG1heClcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gY2gudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heCAhPSBudWxsID8gbmV3IERhdGUobWF4KSA6IG51bGw7XG4gICAgfVxufVxuWm9kRGF0ZS5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2REYXRlKHtcbiAgICAgICAgY2hlY2tzOiBbXSxcbiAgICAgICAgY29lcmNlOiBwYXJhbXM/LmNvZXJjZSB8fCBmYWxzZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2REYXRlLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFN5bWJvbCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnN5bWJvbCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5zeW1ib2wsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kU3ltYm9sLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFN5bWJvbCh7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kU3ltYm9sLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFVuZGVmaW5lZCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS51bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kVW5kZWZpbmVkLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFVuZGVmaW5lZCh7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kVW5kZWZpbmVkLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZE51bGwgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5udWxsKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm51bGwsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT0soaW5wdXQuZGF0YSk7XG4gICAgfVxufVxuWm9kTnVsbC5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2ROdWxsKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROdWxsLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEFueSBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAvLyB0byBwcmV2ZW50IGluc3RhbmNlcyBvZiBvdGhlciBjbGFzc2VzIGZyb20gZXh0ZW5kaW5nIFpvZEFueS4gdGhpcyBjYXVzZXMgaXNzdWVzIHdpdGggY2F0Y2hhbGwgaW4gWm9kT2JqZWN0LlxuICAgICAgICB0aGlzLl9hbnkgPSB0cnVlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZEFueS5jcmVhdGUgPSAocGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RBbnkoe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEFueSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RVbmtub3duIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8vIHJlcXVpcmVkXG4gICAgICAgIHRoaXMuX3Vua25vd24gPSB0cnVlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbn1cblpvZFVua25vd24uY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kVW5rbm93bih7XG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kVW5rbm93bixcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2ROZXZlciBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLm5ldmVyLFxuICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgfVxufVxuWm9kTmV2ZXIuY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTmV2ZXIoe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE5ldmVyLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFZvaWQgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGFyc2VkVHlwZSA9IHRoaXMuX2dldFR5cGUoaW5wdXQpO1xuICAgICAgICBpZiAocGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS51bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2dldE9yUmV0dXJuQ3R4KGlucHV0KTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUudm9pZCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPSyhpbnB1dC5kYXRhKTtcbiAgICB9XG59XG5ab2RWb2lkLmNyZWF0ZSA9IChwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFZvaWQoe1xuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFZvaWQsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kQXJyYXkgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHgsIHN0YXR1cyB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgZGVmID0gdGhpcy5fZGVmO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuYXJyYXkpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuYXJyYXksXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmLmV4YWN0TGVuZ3RoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCB0b29CaWcgPSBjdHguZGF0YS5sZW5ndGggPiBkZWYuZXhhY3RMZW5ndGgudmFsdWU7XG4gICAgICAgICAgICBjb25zdCB0b29TbWFsbCA9IGN0eC5kYXRhLmxlbmd0aCA8IGRlZi5leGFjdExlbmd0aC52YWx1ZTtcbiAgICAgICAgICAgIGlmICh0b29CaWcgfHwgdG9vU21hbGwpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogdG9vQmlnID8gWm9kSXNzdWVDb2RlLnRvb19iaWcgOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgICAgICBtaW5pbXVtOiAodG9vU21hbGwgPyBkZWYuZXhhY3RMZW5ndGgudmFsdWUgOiB1bmRlZmluZWQpLFxuICAgICAgICAgICAgICAgICAgICBtYXhpbXVtOiAodG9vQmlnID8gZGVmLmV4YWN0TGVuZ3RoLnZhbHVlIDogdW5kZWZpbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4YWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWYuZXhhY3RMZW5ndGgubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmLm1pbkxlbmd0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGN0eC5kYXRhLmxlbmd0aCA8IGRlZi5taW5MZW5ndGgudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19zbWFsbCxcbiAgICAgICAgICAgICAgICAgICAgbWluaW11bTogZGVmLm1pbkxlbmd0aC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmLm1pbkxlbmd0aC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZWYubWF4TGVuZ3RoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmRhdGEubGVuZ3RoID4gZGVmLm1heExlbmd0aC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX2JpZyxcbiAgICAgICAgICAgICAgICAgICAgbWF4aW11bTogZGVmLm1heExlbmd0aC52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJhcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmLm1heExlbmd0aC5tZXNzYWdlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoWy4uLmN0eC5kYXRhXS5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmLnR5cGUuX3BhcnNlQXN5bmMobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGl0ZW0sIGN0eC5wYXRoLCBpKSk7XG4gICAgICAgICAgICB9KSkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlQXJyYXkoc3RhdHVzLCByZXN1bHQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gWy4uLmN0eC5kYXRhXS5tYXAoKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBkZWYudHlwZS5fcGFyc2VTeW5jKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBpdGVtLCBjdHgucGF0aCwgaSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlQXJyYXkoc3RhdHVzLCByZXN1bHQpO1xuICAgIH1cbiAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi50eXBlO1xuICAgIH1cbiAgICBtaW4obWluTGVuZ3RoLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kQXJyYXkoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiB7IHZhbHVlOiBtaW5MZW5ndGgsIG1lc3NhZ2U6IGVycm9yVXRpbC50b1N0cmluZyhtZXNzYWdlKSB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbWF4KG1heExlbmd0aCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEFycmF5KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIG1heExlbmd0aDogeyB2YWx1ZTogbWF4TGVuZ3RoLCBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxlbmd0aChsZW4sIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RBcnJheSh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBleGFjdExlbmd0aDogeyB2YWx1ZTogbGVuLCBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG5vbmVtcHR5KG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWluKDEsIG1lc3NhZ2UpO1xuICAgIH1cbn1cblpvZEFycmF5LmNyZWF0ZSA9IChzY2hlbWEsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kQXJyYXkoe1xuICAgICAgICB0eXBlOiBzY2hlbWEsXG4gICAgICAgIG1pbkxlbmd0aDogbnVsbCxcbiAgICAgICAgbWF4TGVuZ3RoOiBudWxsLFxuICAgICAgICBleGFjdExlbmd0aDogbnVsbCxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RBcnJheSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmZ1bmN0aW9uIGRlZXBQYXJ0aWFsaWZ5KHNjaGVtYSkge1xuICAgIGlmIChzY2hlbWEgaW5zdGFuY2VvZiBab2RPYmplY3QpIHtcbiAgICAgICAgY29uc3QgbmV3U2hhcGUgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hLnNoYXBlKSB7XG4gICAgICAgICAgICBjb25zdCBmaWVsZFNjaGVtYSA9IHNjaGVtYS5zaGFwZVtrZXldO1xuICAgICAgICAgICAgbmV3U2hhcGVba2V5XSA9IFpvZE9wdGlvbmFsLmNyZWF0ZShkZWVwUGFydGlhbGlmeShmaWVsZFNjaGVtYSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnNjaGVtYS5fZGVmLFxuICAgICAgICAgICAgc2hhcGU6ICgpID0+IG5ld1NoYXBlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc2NoZW1hIGluc3RhbmNlb2YgWm9kQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RBcnJheSh7XG4gICAgICAgICAgICAuLi5zY2hlbWEuX2RlZixcbiAgICAgICAgICAgIHR5cGU6IGRlZXBQYXJ0aWFsaWZ5KHNjaGVtYS5lbGVtZW50KSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFpvZE9wdGlvbmFsKSB7XG4gICAgICAgIHJldHVybiBab2RPcHRpb25hbC5jcmVhdGUoZGVlcFBhcnRpYWxpZnkoc2NoZW1hLnVud3JhcCgpKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFpvZE51bGxhYmxlKSB7XG4gICAgICAgIHJldHVybiBab2ROdWxsYWJsZS5jcmVhdGUoZGVlcFBhcnRpYWxpZnkoc2NoZW1hLnVud3JhcCgpKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIFpvZFR1cGxlKSB7XG4gICAgICAgIHJldHVybiBab2RUdXBsZS5jcmVhdGUoc2NoZW1hLml0ZW1zLm1hcCgoaXRlbSkgPT4gZGVlcFBhcnRpYWxpZnkoaXRlbSkpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzY2hlbWE7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZE9iamVjdCBleHRlbmRzIFpvZFR5cGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLl9jYWNoZWQgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgSW4gbW9zdCBjYXNlcywgdGhpcyBpcyBubyBsb25nZXIgbmVlZGVkIC0gdW5rbm93biBwcm9wZXJ0aWVzIGFyZSBub3cgc2lsZW50bHkgc3RyaXBwZWQuXG4gICAgICAgICAqIElmIHlvdSB3YW50IHRvIHBhc3MgdGhyb3VnaCB1bmtub3duIHByb3BlcnRpZXMsIHVzZSBgLnBhc3N0aHJvdWdoKClgIGluc3RlYWQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm5vbnN0cmljdCA9IHRoaXMucGFzc3Rocm91Z2g7XG4gICAgICAgIC8vIGV4dGVuZDxcbiAgICAgICAgLy8gICBBdWdtZW50YXRpb24gZXh0ZW5kcyBab2RSYXdTaGFwZSxcbiAgICAgICAgLy8gICBOZXdPdXRwdXQgZXh0ZW5kcyB1dGlsLmZsYXR0ZW48e1xuICAgICAgICAvLyAgICAgW2sgaW4ga2V5b2YgQXVnbWVudGF0aW9uIHwga2V5b2YgT3V0cHV0XTogayBleHRlbmRzIGtleW9mIEF1Z21lbnRhdGlvblxuICAgICAgICAvLyAgICAgICA/IEF1Z21lbnRhdGlvbltrXVtcIl9vdXRwdXRcIl1cbiAgICAgICAgLy8gICAgICAgOiBrIGV4dGVuZHMga2V5b2YgT3V0cHV0XG4gICAgICAgIC8vICAgICAgID8gT3V0cHV0W2tdXG4gICAgICAgIC8vICAgICAgIDogbmV2ZXI7XG4gICAgICAgIC8vICAgfT4sXG4gICAgICAgIC8vICAgTmV3SW5wdXQgZXh0ZW5kcyB1dGlsLmZsYXR0ZW48e1xuICAgICAgICAvLyAgICAgW2sgaW4ga2V5b2YgQXVnbWVudGF0aW9uIHwga2V5b2YgSW5wdXRdOiBrIGV4dGVuZHMga2V5b2YgQXVnbWVudGF0aW9uXG4gICAgICAgIC8vICAgICAgID8gQXVnbWVudGF0aW9uW2tdW1wiX2lucHV0XCJdXG4gICAgICAgIC8vICAgICAgIDogayBleHRlbmRzIGtleW9mIElucHV0XG4gICAgICAgIC8vICAgICAgID8gSW5wdXRba11cbiAgICAgICAgLy8gICAgICAgOiBuZXZlcjtcbiAgICAgICAgLy8gICB9PlxuICAgICAgICAvLyA+KFxuICAgICAgICAvLyAgIGF1Z21lbnRhdGlvbjogQXVnbWVudGF0aW9uXG4gICAgICAgIC8vICk6IFpvZE9iamVjdDxcbiAgICAgICAgLy8gICBleHRlbmRTaGFwZTxULCBBdWdtZW50YXRpb24+LFxuICAgICAgICAvLyAgIFVua25vd25LZXlzLFxuICAgICAgICAvLyAgIENhdGNoYWxsLFxuICAgICAgICAvLyAgIE5ld091dHB1dCxcbiAgICAgICAgLy8gICBOZXdJbnB1dFxuICAgICAgICAvLyA+IHtcbiAgICAgICAgLy8gICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgIC8vICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgIC8vICAgICBzaGFwZTogKCkgPT4gKHtcbiAgICAgICAgLy8gICAgICAgLi4udGhpcy5fZGVmLnNoYXBlKCksXG4gICAgICAgIC8vICAgICAgIC4uLmF1Z21lbnRhdGlvbixcbiAgICAgICAgLy8gICAgIH0pLFxuICAgICAgICAvLyAgIH0pIGFzIGFueTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlcHJlY2F0ZWQgVXNlIGAuZXh0ZW5kYCBpbnN0ZWFkXG4gICAgICAgICAqICAqL1xuICAgICAgICB0aGlzLmF1Z21lbnQgPSB0aGlzLmV4dGVuZDtcbiAgICB9XG4gICAgX2dldENhY2hlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlZCAhPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZWQ7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fZGVmLnNoYXBlKCk7XG4gICAgICAgIGNvbnN0IGtleXMgPSB1dGlsLm9iamVjdEtleXMoc2hhcGUpO1xuICAgICAgICB0aGlzLl9jYWNoZWQgPSB7IHNoYXBlLCBrZXlzIH07XG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZWQ7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm9iamVjdCkge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5vYmplY3QsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCB7IHNoYXBlLCBrZXlzOiBzaGFwZUtleXMgfSA9IHRoaXMuX2dldENhY2hlZCgpO1xuICAgICAgICBjb25zdCBleHRyYUtleXMgPSBbXTtcbiAgICAgICAgaWYgKCEodGhpcy5fZGVmLmNhdGNoYWxsIGluc3RhbmNlb2YgWm9kTmV2ZXIgJiYgdGhpcy5fZGVmLnVua25vd25LZXlzID09PSBcInN0cmlwXCIpKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdHguZGF0YSkge1xuICAgICAgICAgICAgICAgIGlmICghc2hhcGVLZXlzLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXh0cmFLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFpcnMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Ygc2hhcGVLZXlzKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlWYWxpZGF0b3IgPSBzaGFwZVtrZXldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZGF0YVtrZXldO1xuICAgICAgICAgICAgcGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAga2V5OiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZToga2V5IH0sXG4gICAgICAgICAgICAgICAgdmFsdWU6IGtleVZhbGlkYXRvci5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIHZhbHVlLCBjdHgucGF0aCwga2V5KSksXG4gICAgICAgICAgICAgICAgYWx3YXlzU2V0OiBrZXkgaW4gY3R4LmRhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fZGVmLmNhdGNoYWxsIGluc3RhbmNlb2YgWm9kTmV2ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHVua25vd25LZXlzID0gdGhpcy5fZGVmLnVua25vd25LZXlzO1xuICAgICAgICAgICAgaWYgKHVua25vd25LZXlzID09PSBcInBhc3N0aHJvdWdoXCIpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBleHRyYUtleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFpcnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBrZXkgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7IHN0YXR1czogXCJ2YWxpZFwiLCB2YWx1ZTogY3R4LmRhdGFba2V5XSB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh1bmtub3duS2V5cyA9PT0gXCJzdHJpY3RcIikge1xuICAgICAgICAgICAgICAgIGlmIChleHRyYUtleXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS51bnJlY29nbml6ZWRfa2V5cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleXM6IGV4dHJhS2V5cyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHVua25vd25LZXlzID09PSBcInN0cmlwXCIpIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW50ZXJuYWwgWm9kT2JqZWN0IGVycm9yOiBpbnZhbGlkIHVua25vd25LZXlzIHZhbHVlLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcnVuIGNhdGNoYWxsIHZhbGlkYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGNhdGNoYWxsID0gdGhpcy5fZGVmLmNhdGNoYWxsO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgZXh0cmFLZXlzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjdHguZGF0YVtrZXldO1xuICAgICAgICAgICAgICAgIHBhaXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBrZXk6IHsgc3RhdHVzOiBcInZhbGlkXCIsIHZhbHVlOiBrZXkgfSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNhdGNoYWxsLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgdmFsdWUsIGN0eC5wYXRoLCBrZXkpIC8vLCBjdHguY2hpbGQoa2V5KSwgdmFsdWUsIGdldFBhcnNlZFR5cGUodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIGFsd2F5c1NldDoga2V5IGluIGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgICAgICAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3luY1BhaXJzID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHBhaXIua2V5O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGF3YWl0IHBhaXIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHN5bmNQYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWx3YXlzU2V0OiBwYWlyLmFsd2F5c1NldCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzeW5jUGFpcnM7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChzeW5jUGFpcnMpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUGFyc2VTdGF0dXMubWVyZ2VPYmplY3RTeW5jKHN0YXR1cywgc3luY1BhaXJzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlT2JqZWN0U3luYyhzdGF0dXMsIHBhaXJzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgc2hhcGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuc2hhcGUoKTtcbiAgICB9XG4gICAgc3RyaWN0KG1lc3NhZ2UpIHtcbiAgICAgICAgZXJyb3JVdGlsLmVyclRvT2JqO1xuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICB1bmtub3duS2V5czogXCJzdHJpY3RcIixcbiAgICAgICAgICAgIC4uLihtZXNzYWdlICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JNYXA6IChpc3N1ZSwgY3R4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0RXJyb3IgPSB0aGlzLl9kZWYuZXJyb3JNYXA/Lihpc3N1ZSwgY3R4KS5tZXNzYWdlID8/IGN0eC5kZWZhdWx0RXJyb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNzdWUuY29kZSA9PT0gXCJ1bnJlY29nbml6ZWRfa2V5c1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yVXRpbC5lcnJUb09iaihtZXNzYWdlKS5tZXNzYWdlID8/IGRlZmF1bHRFcnJvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkZWZhdWx0RXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHt9KSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN0cmlwKCkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICB1bmtub3duS2V5czogXCJzdHJpcFwiLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcGFzc3Rocm91Z2goKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHVua25vd25LZXlzOiBcInBhc3N0aHJvdWdoXCIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBjb25zdCBBdWdtZW50RmFjdG9yeSA9XG4gICAgLy8gICA8RGVmIGV4dGVuZHMgWm9kT2JqZWN0RGVmPihkZWY6IERlZikgPT5cbiAgICAvLyAgIDxBdWdtZW50YXRpb24gZXh0ZW5kcyBab2RSYXdTaGFwZT4oXG4gICAgLy8gICAgIGF1Z21lbnRhdGlvbjogQXVnbWVudGF0aW9uXG4gICAgLy8gICApOiBab2RPYmplY3Q8XG4gICAgLy8gICAgIGV4dGVuZFNoYXBlPFJldHVyblR5cGU8RGVmW1wic2hhcGVcIl0+LCBBdWdtZW50YXRpb24+LFxuICAgIC8vICAgICBEZWZbXCJ1bmtub3duS2V5c1wiXSxcbiAgICAvLyAgICAgRGVmW1wiY2F0Y2hhbGxcIl1cbiAgICAvLyAgID4gPT4ge1xuICAgIC8vICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgLy8gICAgICAgLi4uZGVmLFxuICAgIC8vICAgICAgIHNoYXBlOiAoKSA9PiAoe1xuICAgIC8vICAgICAgICAgLi4uZGVmLnNoYXBlKCksXG4gICAgLy8gICAgICAgICAuLi5hdWdtZW50YXRpb24sXG4gICAgLy8gICAgICAgfSksXG4gICAgLy8gICAgIH0pIGFzIGFueTtcbiAgICAvLyAgIH07XG4gICAgZXh0ZW5kKGF1Z21lbnRhdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gKHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLl9kZWYuc2hhcGUoKSxcbiAgICAgICAgICAgICAgICAuLi5hdWdtZW50YXRpb24sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByaW9yIHRvIHpvZEAxLjAuMTIgdGhlcmUgd2FzIGEgYnVnIGluIHRoZVxuICAgICAqIGluZmVycmVkIHR5cGUgb2YgbWVyZ2VkIG9iamVjdHMuIFBsZWFzZVxuICAgICAqIHVwZ3JhZGUgaWYgeW91IGFyZSBleHBlcmllbmNpbmcgaXNzdWVzLlxuICAgICAqL1xuICAgIG1lcmdlKG1lcmdpbmcpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkID0gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICB1bmtub3duS2V5czogbWVyZ2luZy5fZGVmLnVua25vd25LZXlzLFxuICAgICAgICAgICAgY2F0Y2hhbGw6IG1lcmdpbmcuX2RlZi5jYXRjaGFsbCxcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiAoe1xuICAgICAgICAgICAgICAgIC4uLnRoaXMuX2RlZi5zaGFwZSgpLFxuICAgICAgICAgICAgICAgIC4uLm1lcmdpbmcuX2RlZi5zaGFwZSgpLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZXJnZWQ7XG4gICAgfVxuICAgIC8vIG1lcmdlPFxuICAgIC8vICAgSW5jb21pbmcgZXh0ZW5kcyBBbnlab2RPYmplY3QsXG4gICAgLy8gICBBdWdtZW50YXRpb24gZXh0ZW5kcyBJbmNvbWluZ1tcInNoYXBlXCJdLFxuICAgIC8vICAgTmV3T3V0cHV0IGV4dGVuZHMge1xuICAgIC8vICAgICBbayBpbiBrZXlvZiBBdWdtZW50YXRpb24gfCBrZXlvZiBPdXRwdXRdOiBrIGV4dGVuZHMga2V5b2YgQXVnbWVudGF0aW9uXG4gICAgLy8gICAgICAgPyBBdWdtZW50YXRpb25ba11bXCJfb3V0cHV0XCJdXG4gICAgLy8gICAgICAgOiBrIGV4dGVuZHMga2V5b2YgT3V0cHV0XG4gICAgLy8gICAgICAgPyBPdXRwdXRba11cbiAgICAvLyAgICAgICA6IG5ldmVyO1xuICAgIC8vICAgfSxcbiAgICAvLyAgIE5ld0lucHV0IGV4dGVuZHMge1xuICAgIC8vICAgICBbayBpbiBrZXlvZiBBdWdtZW50YXRpb24gfCBrZXlvZiBJbnB1dF06IGsgZXh0ZW5kcyBrZXlvZiBBdWdtZW50YXRpb25cbiAgICAvLyAgICAgICA/IEF1Z21lbnRhdGlvbltrXVtcIl9pbnB1dFwiXVxuICAgIC8vICAgICAgIDogayBleHRlbmRzIGtleW9mIElucHV0XG4gICAgLy8gICAgICAgPyBJbnB1dFtrXVxuICAgIC8vICAgICAgIDogbmV2ZXI7XG4gICAgLy8gICB9XG4gICAgLy8gPihcbiAgICAvLyAgIG1lcmdpbmc6IEluY29taW5nXG4gICAgLy8gKTogWm9kT2JqZWN0PFxuICAgIC8vICAgZXh0ZW5kU2hhcGU8VCwgUmV0dXJuVHlwZTxJbmNvbWluZ1tcIl9kZWZcIl1bXCJzaGFwZVwiXT4+LFxuICAgIC8vICAgSW5jb21pbmdbXCJfZGVmXCJdW1widW5rbm93bktleXNcIl0sXG4gICAgLy8gICBJbmNvbWluZ1tcIl9kZWZcIl1bXCJjYXRjaGFsbFwiXSxcbiAgICAvLyAgIE5ld091dHB1dCxcbiAgICAvLyAgIE5ld0lucHV0XG4gICAgLy8gPiB7XG4gICAgLy8gICBjb25zdCBtZXJnZWQ6IGFueSA9IG5ldyBab2RPYmplY3Qoe1xuICAgIC8vICAgICB1bmtub3duS2V5czogbWVyZ2luZy5fZGVmLnVua25vd25LZXlzLFxuICAgIC8vICAgICBjYXRjaGFsbDogbWVyZ2luZy5fZGVmLmNhdGNoYWxsLFxuICAgIC8vICAgICBzaGFwZTogKCkgPT5cbiAgICAvLyAgICAgICBvYmplY3RVdGlsLm1lcmdlU2hhcGVzKHRoaXMuX2RlZi5zaGFwZSgpLCBtZXJnaW5nLl9kZWYuc2hhcGUoKSksXG4gICAgLy8gICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgIC8vICAgfSkgYXMgYW55O1xuICAgIC8vICAgcmV0dXJuIG1lcmdlZDtcbiAgICAvLyB9XG4gICAgc2V0S2V5KGtleSwgc2NoZW1hKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1Z21lbnQoeyBba2V5XTogc2NoZW1hIH0pO1xuICAgIH1cbiAgICAvLyBtZXJnZTxJbmNvbWluZyBleHRlbmRzIEFueVpvZE9iamVjdD4oXG4gICAgLy8gICBtZXJnaW5nOiBJbmNvbWluZ1xuICAgIC8vICk6IC8vWm9kT2JqZWN0PFQgJiBJbmNvbWluZ1tcIl9zaGFwZVwiXSwgVW5rbm93bktleXMsIENhdGNoYWxsPiA9IChtZXJnaW5nKSA9PiB7XG4gICAgLy8gWm9kT2JqZWN0PFxuICAgIC8vICAgZXh0ZW5kU2hhcGU8VCwgUmV0dXJuVHlwZTxJbmNvbWluZ1tcIl9kZWZcIl1bXCJzaGFwZVwiXT4+LFxuICAgIC8vICAgSW5jb21pbmdbXCJfZGVmXCJdW1widW5rbm93bktleXNcIl0sXG4gICAgLy8gICBJbmNvbWluZ1tcIl9kZWZcIl1bXCJjYXRjaGFsbFwiXVxuICAgIC8vID4ge1xuICAgIC8vICAgLy8gY29uc3QgbWVyZ2VkU2hhcGUgPSBvYmplY3RVdGlsLm1lcmdlU2hhcGVzKFxuICAgIC8vICAgLy8gICB0aGlzLl9kZWYuc2hhcGUoKSxcbiAgICAvLyAgIC8vICAgbWVyZ2luZy5fZGVmLnNoYXBlKClcbiAgICAvLyAgIC8vICk7XG4gICAgLy8gICBjb25zdCBtZXJnZWQ6IGFueSA9IG5ldyBab2RPYmplY3Qoe1xuICAgIC8vICAgICB1bmtub3duS2V5czogbWVyZ2luZy5fZGVmLnVua25vd25LZXlzLFxuICAgIC8vICAgICBjYXRjaGFsbDogbWVyZ2luZy5fZGVmLmNhdGNoYWxsLFxuICAgIC8vICAgICBzaGFwZTogKCkgPT5cbiAgICAvLyAgICAgICBvYmplY3RVdGlsLm1lcmdlU2hhcGVzKHRoaXMuX2RlZi5zaGFwZSgpLCBtZXJnaW5nLl9kZWYuc2hhcGUoKSksXG4gICAgLy8gICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgIC8vICAgfSkgYXMgYW55O1xuICAgIC8vICAgcmV0dXJuIG1lcmdlZDtcbiAgICAvLyB9XG4gICAgY2F0Y2hhbGwoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RPYmplY3Qoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgY2F0Y2hhbGw6IGluZGV4LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcGljayhtYXNrKSB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0ge307XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHV0aWwub2JqZWN0S2V5cyhtYXNrKSkge1xuICAgICAgICAgICAgaWYgKG1hc2tba2V5XSAmJiB0aGlzLnNoYXBlW2tleV0pIHtcbiAgICAgICAgICAgICAgICBzaGFwZVtrZXldID0gdGhpcy5zaGFwZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiBzaGFwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9taXQobWFzaykge1xuICAgICAgICBjb25zdCBzaGFwZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB1dGlsLm9iamVjdEtleXModGhpcy5zaGFwZSkpIHtcbiAgICAgICAgICAgIGlmICghbWFza1trZXldKSB7XG4gICAgICAgICAgICAgICAgc2hhcGVba2V5XSA9IHRoaXMuc2hhcGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gc2hhcGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIGRlZXBQYXJ0aWFsKCkge1xuICAgICAgICByZXR1cm4gZGVlcFBhcnRpYWxpZnkodGhpcyk7XG4gICAgfVxuICAgIHBhcnRpYWwobWFzaykge1xuICAgICAgICBjb25zdCBuZXdTaGFwZSA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiB1dGlsLm9iamVjdEtleXModGhpcy5zaGFwZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkU2NoZW1hID0gdGhpcy5zaGFwZVtrZXldO1xuICAgICAgICAgICAgaWYgKG1hc2sgJiYgIW1hc2tba2V5XSkge1xuICAgICAgICAgICAgICAgIG5ld1NoYXBlW2tleV0gPSBmaWVsZFNjaGVtYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld1NoYXBlW2tleV0gPSBmaWVsZFNjaGVtYS5vcHRpb25hbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIHNoYXBlOiAoKSA9PiBuZXdTaGFwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlcXVpcmVkKG1hc2spIHtcbiAgICAgICAgY29uc3QgbmV3U2hhcGUgPSB7fTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgdXRpbC5vYmplY3RLZXlzKHRoaXMuc2hhcGUpKSB7XG4gICAgICAgICAgICBpZiAobWFzayAmJiAhbWFza1trZXldKSB7XG4gICAgICAgICAgICAgICAgbmV3U2hhcGVba2V5XSA9IHRoaXMuc2hhcGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkU2NoZW1hID0gdGhpcy5zaGFwZVtrZXldO1xuICAgICAgICAgICAgICAgIGxldCBuZXdGaWVsZCA9IGZpZWxkU2NoZW1hO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuZXdGaWVsZCBpbnN0YW5jZW9mIFpvZE9wdGlvbmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpZWxkID0gbmV3RmllbGQuX2RlZi5pbm5lclR5cGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG5ld1NoYXBlW2tleV0gPSBuZXdGaWVsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBzaGFwZTogKCkgPT4gbmV3U2hhcGUsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBrZXlvZigpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZVpvZEVudW0odXRpbC5vYmplY3RLZXlzKHRoaXMuc2hhcGUpKTtcbiAgICB9XG59XG5ab2RPYmplY3QuY3JlYXRlID0gKHNoYXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgIHNoYXBlOiAoKSA9PiBzaGFwZSxcbiAgICAgICAgdW5rbm93bktleXM6IFwic3RyaXBcIixcbiAgICAgICAgY2F0Y2hhbGw6IFpvZE5ldmVyLmNyZWF0ZSgpLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcblpvZE9iamVjdC5zdHJpY3RDcmVhdGUgPSAoc2hhcGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kT2JqZWN0KHtcbiAgICAgICAgc2hhcGU6ICgpID0+IHNoYXBlLFxuICAgICAgICB1bmtub3duS2V5czogXCJzdHJpY3RcIixcbiAgICAgICAgY2F0Y2hhbGw6IFpvZE5ldmVyLmNyZWF0ZSgpLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9iamVjdCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcblpvZE9iamVjdC5sYXp5Y3JlYXRlID0gKHNoYXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE9iamVjdCh7XG4gICAgICAgIHNoYXBlLFxuICAgICAgICB1bmtub3duS2V5czogXCJzdHJpcFwiLFxuICAgICAgICBjYXRjaGFsbDogWm9kTmV2ZXIuY3JlYXRlKCksXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kT2JqZWN0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFVuaW9uIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fZGVmLm9wdGlvbnM7XG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3VsdHMocmVzdWx0cykge1xuICAgICAgICAgICAgLy8gcmV0dXJuIGZpcnN0IGlzc3VlLWZyZWUgdmFsaWRhdGlvbiBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmVzdWx0IG9mIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnJlc3VsdC5zdGF0dXMgPT09IFwidmFsaWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0LnJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlc3VsdCBvZiByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5yZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIGlzc3VlcyBmcm9tIGRpcnR5IG9wdGlvblxuICAgICAgICAgICAgICAgICAgICBjdHguY29tbW9uLmlzc3Vlcy5wdXNoKC4uLnJlc3VsdC5jdHguY29tbW9uLmlzc3Vlcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQucmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnZhbGlkXG4gICAgICAgICAgICBjb25zdCB1bmlvbkVycm9ycyA9IHJlc3VsdHMubWFwKChyZXN1bHQpID0+IG5ldyBab2RFcnJvcihyZXN1bHQuY3R4LmNvbW1vbi5pc3N1ZXMpKTtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3VuaW9uLFxuICAgICAgICAgICAgICAgIHVuaW9uRXJyb3JzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKG9wdGlvbnMubWFwKGFzeW5jIChvcHRpb24pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZEN0eCA9IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uY3R4LFxuICAgICAgICAgICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLmN0eC5jb21tb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBpc3N1ZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQ6IGF3YWl0IG9wdGlvbi5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjaGlsZEN0eCxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIGN0eDogY2hpbGRDdHgsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKS50aGVuKGhhbmRsZVJlc3VsdHMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGRpcnR5ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY29uc3QgaXNzdWVzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRDdHggPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLmN0eCxcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5jdHguY29tbW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNzdWVzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gb3B0aW9uLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY2hpbGRDdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwidmFsaWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIgJiYgIWRpcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRpcnR5ID0geyByZXN1bHQsIGN0eDogY2hpbGRDdHggfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkQ3R4LmNvbW1vbi5pc3N1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzc3Vlcy5wdXNoKGNoaWxkQ3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkaXJ0eSkge1xuICAgICAgICAgICAgICAgIGN0eC5jb21tb24uaXNzdWVzLnB1c2goLi4uZGlydHkuY3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXJ0eS5yZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB1bmlvbkVycm9ycyA9IGlzc3Vlcy5tYXAoKGlzc3VlcykgPT4gbmV3IFpvZEVycm9yKGlzc3VlcykpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdW5pb24sXG4gICAgICAgICAgICAgICAgdW5pb25FcnJvcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBvcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLm9wdGlvbnM7XG4gICAgfVxufVxuWm9kVW5pb24uY3JlYXRlID0gKHR5cGVzLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFVuaW9uKHtcbiAgICAgICAgb3B0aW9uczogdHlwZXMsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kVW5pb24sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8vLy8vLy8vXG4vLy8vLy8vLy8vICAgICAgWm9kRGlzY3JpbWluYXRlZFVuaW9uICAgICAgLy8vLy8vLy8vL1xuLy8vLy8vLy8vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuY29uc3QgZ2V0RGlzY3JpbWluYXRvciA9ICh0eXBlKSA9PiB7XG4gICAgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RMYXp5KSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUuc2NoZW1hKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZEVmZmVjdHMpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS5pbm5lclR5cGUoKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RMaXRlcmFsKSB7XG4gICAgICAgIHJldHVybiBbdHlwZS52YWx1ZV07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RFbnVtKSB7XG4gICAgICAgIHJldHVybiB0eXBlLm9wdGlvbnM7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2ROYXRpdmVFbnVtKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBiYW4vYmFuXG4gICAgICAgIHJldHVybiB1dGlsLm9iamVjdFZhbHVlcyh0eXBlLmVudW0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kRGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLl9kZWYuaW5uZXJUeXBlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZFVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZF07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2ROdWxsKSB7XG4gICAgICAgIHJldHVybiBbbnVsbF07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2RPcHRpb25hbCkge1xuICAgICAgICByZXR1cm4gW3VuZGVmaW5lZCwgLi4uZ2V0RGlzY3JpbWluYXRvcih0eXBlLnVud3JhcCgpKV07XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgaW5zdGFuY2VvZiBab2ROdWxsYWJsZSkge1xuICAgICAgICByZXR1cm4gW251bGwsIC4uLmdldERpc2NyaW1pbmF0b3IodHlwZS51bndyYXAoKSldO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kQnJhbmRlZCkge1xuICAgICAgICByZXR1cm4gZ2V0RGlzY3JpbWluYXRvcih0eXBlLnVud3JhcCgpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSBpbnN0YW5jZW9mIFpvZFJlYWRvbmx5KSB7XG4gICAgICAgIHJldHVybiBnZXREaXNjcmltaW5hdG9yKHR5cGUudW53cmFwKCkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlIGluc3RhbmNlb2YgWm9kQ2F0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGdldERpc2NyaW1pbmF0b3IodHlwZS5fZGVmLmlubmVyVHlwZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufTtcbmV4cG9ydCBjbGFzcyBab2REaXNjcmltaW5hdGVkVW5pb24gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5vYmplY3QpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUub2JqZWN0LFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGlzY3JpbWluYXRvciA9IHRoaXMuZGlzY3JpbWluYXRvcjtcbiAgICAgICAgY29uc3QgZGlzY3JpbWluYXRvclZhbHVlID0gY3R4LmRhdGFbZGlzY3JpbWluYXRvcl07XG4gICAgICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMub3B0aW9uc01hcC5nZXQoZGlzY3JpbWluYXRvclZhbHVlKTtcbiAgICAgICAgaWYgKCFvcHRpb24pIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3VuaW9uX2Rpc2NyaW1pbmF0b3IsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogQXJyYXkuZnJvbSh0aGlzLm9wdGlvbnNNYXAua2V5cygpKSxcbiAgICAgICAgICAgICAgICBwYXRoOiBbZGlzY3JpbWluYXRvcl0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gb3B0aW9uLl9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbi5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBkaXNjcmltaW5hdG9yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmRpc2NyaW1pbmF0b3I7XG4gICAgfVxuICAgIGdldCBvcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLm9wdGlvbnM7XG4gICAgfVxuICAgIGdldCBvcHRpb25zTWFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLm9wdGlvbnNNYXA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgZGlzY3JpbWluYXRlZCB1bmlvbiBzY2hlbWEuIEl0cyBiZWhhdmlvdXIgaXMgdmVyeSBzaW1pbGFyIHRvIHRoYXQgb2YgdGhlIG5vcm1hbCB6LnVuaW9uKCkgY29uc3RydWN0b3IuXG4gICAgICogSG93ZXZlciwgaXQgb25seSBhbGxvd3MgYSB1bmlvbiBvZiBvYmplY3RzLCBhbGwgb2Ygd2hpY2ggbmVlZCB0byBzaGFyZSBhIGRpc2NyaW1pbmF0b3IgcHJvcGVydHkuIFRoaXMgcHJvcGVydHkgbXVzdFxuICAgICAqIGhhdmUgYSBkaWZmZXJlbnQgdmFsdWUgZm9yIGVhY2ggb2JqZWN0IGluIHRoZSB1bmlvbi5cbiAgICAgKiBAcGFyYW0gZGlzY3JpbWluYXRvciB0aGUgbmFtZSBvZiB0aGUgZGlzY3JpbWluYXRvciBwcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB0eXBlcyBhbiBhcnJheSBvZiBvYmplY3Qgc2NoZW1hc1xuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlKGRpc2NyaW1pbmF0b3IsIG9wdGlvbnMsIHBhcmFtcykge1xuICAgICAgICAvLyBHZXQgYWxsIHRoZSB2YWxpZCBkaXNjcmltaW5hdG9yIHZhbHVlc1xuICAgICAgICBjb25zdCBvcHRpb25zTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICAvLyB0cnkge1xuICAgICAgICBmb3IgKGNvbnN0IHR5cGUgb2Ygb3B0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgZGlzY3JpbWluYXRvclZhbHVlcyA9IGdldERpc2NyaW1pbmF0b3IodHlwZS5zaGFwZVtkaXNjcmltaW5hdG9yXSk7XG4gICAgICAgICAgICBpZiAoIWRpc2NyaW1pbmF0b3JWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIGRpc2NyaW1pbmF0b3IgdmFsdWUgZm9yIGtleSBcXGAke2Rpc2NyaW1pbmF0b3J9XFxgIGNvdWxkIG5vdCBiZSBleHRyYWN0ZWQgZnJvbSBhbGwgc2NoZW1hIG9wdGlvbnNgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgZGlzY3JpbWluYXRvclZhbHVlcykge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zTWFwLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEaXNjcmltaW5hdG9yIHByb3BlcnR5ICR7U3RyaW5nKGRpc2NyaW1pbmF0b3IpfSBoYXMgZHVwbGljYXRlIHZhbHVlICR7U3RyaW5nKHZhbHVlKX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0aW9uc01hcC5zZXQodmFsdWUsIHR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kRGlzY3JpbWluYXRlZFVuaW9uKHtcbiAgICAgICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRGlzY3JpbWluYXRlZFVuaW9uLFxuICAgICAgICAgICAgZGlzY3JpbWluYXRvcixcbiAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICBvcHRpb25zTWFwLFxuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBtZXJnZVZhbHVlcyhhLCBiKSB7XG4gICAgY29uc3QgYVR5cGUgPSBnZXRQYXJzZWRUeXBlKGEpO1xuICAgIGNvbnN0IGJUeXBlID0gZ2V0UGFyc2VkVHlwZShiKTtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4geyB2YWxpZDogdHJ1ZSwgZGF0YTogYSB9O1xuICAgIH1cbiAgICBlbHNlIGlmIChhVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5vYmplY3QgJiYgYlR5cGUgPT09IFpvZFBhcnNlZFR5cGUub2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IGJLZXlzID0gdXRpbC5vYmplY3RLZXlzKGIpO1xuICAgICAgICBjb25zdCBzaGFyZWRLZXlzID0gdXRpbC5vYmplY3RLZXlzKGEpLmZpbHRlcigoa2V5KSA9PiBiS2V5cy5pbmRleE9mKGtleSkgIT09IC0xKTtcbiAgICAgICAgY29uc3QgbmV3T2JqID0geyAuLi5hLCAuLi5iIH07XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIHNoYXJlZEtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJlZFZhbHVlID0gbWVyZ2VWYWx1ZXMoYVtrZXldLCBiW2tleV0pO1xuICAgICAgICAgICAgaWYgKCFzaGFyZWRWYWx1ZS52YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3T2JqW2tleV0gPSBzaGFyZWRWYWx1ZS5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiB0cnVlLCBkYXRhOiBuZXdPYmogfTtcbiAgICB9XG4gICAgZWxzZSBpZiAoYVR5cGUgPT09IFpvZFBhcnNlZFR5cGUuYXJyYXkgJiYgYlR5cGUgPT09IFpvZFBhcnNlZFR5cGUuYXJyYXkpIHtcbiAgICAgICAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IGZhbHNlIH07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmV3QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtQSA9IGFbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgaXRlbUIgPSBiW2luZGV4XTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXJlZFZhbHVlID0gbWVyZ2VWYWx1ZXMoaXRlbUEsIGl0ZW1CKTtcbiAgICAgICAgICAgIGlmICghc2hhcmVkVmFsdWUudmFsaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyB2YWxpZDogZmFsc2UgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld0FycmF5LnB1c2goc2hhcmVkVmFsdWUuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IG5ld0FycmF5IH07XG4gICAgfVxuICAgIGVsc2UgaWYgKGFUeXBlID09PSBab2RQYXJzZWRUeXBlLmRhdGUgJiYgYlR5cGUgPT09IFpvZFBhcnNlZFR5cGUuZGF0ZSAmJiArYSA9PT0gK2IpIHtcbiAgICAgICAgcmV0dXJuIHsgdmFsaWQ6IHRydWUsIGRhdGE6IGEgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB7IHZhbGlkOiBmYWxzZSB9O1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBab2RJbnRlcnNlY3Rpb24gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgaGFuZGxlUGFyc2VkID0gKHBhcnNlZExlZnQsIHBhcnNlZFJpZ2h0KSA9PiB7XG4gICAgICAgICAgICBpZiAoaXNBYm9ydGVkKHBhcnNlZExlZnQpIHx8IGlzQWJvcnRlZChwYXJzZWRSaWdodCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlVmFsdWVzKHBhcnNlZExlZnQudmFsdWUsIHBhcnNlZFJpZ2h0LnZhbHVlKTtcbiAgICAgICAgICAgIGlmICghbWVyZ2VkLnZhbGlkKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX2ludGVyc2VjdGlvbl90eXBlcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0RpcnR5KHBhcnNlZExlZnQpIHx8IGlzRGlydHkocGFyc2VkUmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IG1lcmdlZC5kYXRhIH07XG4gICAgICAgIH07XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZi5sZWZ0Ll9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWYucmlnaHQuX3BhcnNlQXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSkudGhlbigoW2xlZnQsIHJpZ2h0XSkgPT4gaGFuZGxlUGFyc2VkKGxlZnQsIHJpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlUGFyc2VkKHRoaXMuX2RlZi5sZWZ0Ll9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICAgICAgfSksIHRoaXMuX2RlZi5yaWdodC5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBjdHguZGF0YSxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblpvZEludGVyc2VjdGlvbi5jcmVhdGUgPSAobGVmdCwgcmlnaHQsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kSW50ZXJzZWN0aW9uKHtcbiAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgcmlnaHQ6IHJpZ2h0LFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEludGVyc2VjdGlvbixcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbi8vIHR5cGUgWm9kVHVwbGVJdGVtcyA9IFtab2RUeXBlQW55LCAuLi5ab2RUeXBlQW55W11dO1xuZXhwb3J0IGNsYXNzIFpvZFR1cGxlIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5hcnJheSkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5hcnJheSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdHguZGF0YS5sZW5ndGggPCB0aGlzLl9kZWYuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUudG9vX3NtYWxsLFxuICAgICAgICAgICAgICAgIG1pbmltdW06IHRoaXMuX2RlZi5pdGVtcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3QgPSB0aGlzLl9kZWYucmVzdDtcbiAgICAgICAgaWYgKCFyZXN0ICYmIGN0eC5kYXRhLmxlbmd0aCA+IHRoaXMuX2RlZi5pdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fYmlnLFxuICAgICAgICAgICAgICAgIG1heGltdW06IHRoaXMuX2RlZi5pdGVtcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgaW5jbHVzaXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcImFycmF5XCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gWy4uLmN0eC5kYXRhXVxuICAgICAgICAgICAgLm1hcCgoaXRlbSwgaXRlbUluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzY2hlbWEgPSB0aGlzLl9kZWYuaXRlbXNbaXRlbUluZGV4XSB8fCB0aGlzLl9kZWYucmVzdDtcbiAgICAgICAgICAgIGlmICghc2NoZW1hKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVtYS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGl0ZW0sIGN0eC5wYXRoLCBpdGVtSW5kZXgpKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIoKHgpID0+ICEheCk7IC8vIGZpbHRlciBudWxsc1xuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGl0ZW1zKS50aGVuKChyZXN1bHRzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlQXJyYXkoc3RhdHVzLCByZXN1bHRzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlQXJyYXkoc3RhdHVzLCBpdGVtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGl0ZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLml0ZW1zO1xuICAgIH1cbiAgICByZXN0KHJlc3QpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RUdXBsZSh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICByZXN0LFxuICAgICAgICB9KTtcbiAgICB9XG59XG5ab2RUdXBsZS5jcmVhdGUgPSAoc2NoZW1hcywgcGFyYW1zKSA9PiB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHNjaGVtYXMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IHBhc3MgYW4gYXJyYXkgb2Ygc2NoZW1hcyB0byB6LnR1cGxlKFsgLi4uIF0pXCIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFpvZFR1cGxlKHtcbiAgICAgICAgaXRlbXM6IHNjaGVtYXMsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kVHVwbGUsXG4gICAgICAgIHJlc3Q6IG51bGwsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kUmVjb3JkIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgZ2V0IGtleVNjaGVtYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5rZXlUeXBlO1xuICAgIH1cbiAgICBnZXQgdmFsdWVTY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgIH1cbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm9iamVjdCkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5vYmplY3QsXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwYWlycyA9IFtdO1xuICAgICAgICBjb25zdCBrZXlUeXBlID0gdGhpcy5fZGVmLmtleVR5cGU7XG4gICAgICAgIGNvbnN0IHZhbHVlVHlwZSA9IHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGN0eC5kYXRhKSB7XG4gICAgICAgICAgICBwYWlycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleVR5cGUuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBrZXksIGN0eC5wYXRoLCBrZXkpKSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVUeXBlLl9wYXJzZShuZXcgUGFyc2VJbnB1dExhenlQYXRoKGN0eCwgY3R4LmRhdGFba2V5XSwgY3R4LnBhdGgsIGtleSkpLFxuICAgICAgICAgICAgICAgIGFsd2F5c1NldDoga2V5IGluIGN0eC5kYXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIHJldHVybiBQYXJzZVN0YXR1cy5tZXJnZU9iamVjdEFzeW5jKHN0YXR1cywgcGFpcnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFBhcnNlU3RhdHVzLm1lcmdlT2JqZWN0U3luYyhzdGF0dXMsIHBhaXJzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgZWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZVR5cGU7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoZmlyc3QsIHNlY29uZCwgdGhpcmQpIHtcbiAgICAgICAgaWYgKHNlY29uZCBpbnN0YW5jZW9mIFpvZFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWm9kUmVjb3JkKHtcbiAgICAgICAgICAgICAgICBrZXlUeXBlOiBmaXJzdCxcbiAgICAgICAgICAgICAgICB2YWx1ZVR5cGU6IHNlY29uZCxcbiAgICAgICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFJlY29yZCxcbiAgICAgICAgICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHRoaXJkKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgWm9kUmVjb3JkKHtcbiAgICAgICAgICAgIGtleVR5cGU6IFpvZFN0cmluZy5jcmVhdGUoKSxcbiAgICAgICAgICAgIHZhbHVlVHlwZTogZmlyc3QsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFJlY29yZCxcbiAgICAgICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMoc2Vjb25kKSxcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZE1hcCBleHRlbmRzIFpvZFR5cGUge1xuICAgIGdldCBrZXlTY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYua2V5VHlwZTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlU2NoZW1hKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlVHlwZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5tYXApIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUubWFwLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qga2V5VHlwZSA9IHRoaXMuX2RlZi5rZXlUeXBlO1xuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgICAgICBjb25zdCBwYWlycyA9IFsuLi5jdHguZGF0YS5lbnRyaWVzKCldLm1hcCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBrZXk6IGtleVR5cGUuX3BhcnNlKG5ldyBQYXJzZUlucHV0TGF6eVBhdGgoY3R4LCBrZXksIGN0eC5wYXRoLCBbaW5kZXgsIFwia2V5XCJdKSksXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlVHlwZS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIHZhbHVlLCBjdHgucGF0aCwgW2luZGV4LCBcInZhbHVlXCJdKSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcGFpciBvZiBwYWlycykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCBwYWlyLmtleTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhd2FpdCBwYWlyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIgfHwgdmFsdWUuc3RhdHVzID09PSBcImFib3J0ZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5zdGF0dXMgPT09IFwiZGlydHlcIiB8fCB2YWx1ZS5zdGF0dXMgPT09IFwiZGlydHlcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxNYXAuc2V0KGtleS52YWx1ZSwgdmFsdWUudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGZpbmFsTWFwIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwYWlyIG9mIHBhaXJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gcGFpci5rZXk7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBwYWlyLnZhbHVlO1xuICAgICAgICAgICAgICAgIGlmIChrZXkuc3RhdHVzID09PSBcImFib3J0ZWRcIiB8fCB2YWx1ZS5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa2V5LnN0YXR1cyA9PT0gXCJkaXJ0eVwiIHx8IHZhbHVlLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbE1hcC5zZXQoa2V5LnZhbHVlLCB2YWx1ZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGZpbmFsTWFwIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5ab2RNYXAuY3JlYXRlID0gKGtleVR5cGUsIHZhbHVlVHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RNYXAoe1xuICAgICAgICB2YWx1ZVR5cGUsXG4gICAgICAgIGtleVR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTWFwLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFNldCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IHN0YXR1cywgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuc2V0KSB7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF90eXBlLFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBab2RQYXJzZWRUeXBlLnNldCxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRlZiA9IHRoaXMuX2RlZjtcbiAgICAgICAgaWYgKGRlZi5taW5TaXplICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY3R4LmRhdGEuc2l6ZSA8IGRlZi5taW5TaXplLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS50b29fc21hbGwsXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW06IGRlZi5taW5TaXplLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNldFwiLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmLm1pblNpemUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmLm1heFNpemUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChjdHguZGF0YS5zaXplID4gZGVmLm1heFNpemUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLnRvb19iaWcsXG4gICAgICAgICAgICAgICAgICAgIG1heGltdW06IGRlZi5tYXhTaXplLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNldFwiLFxuICAgICAgICAgICAgICAgICAgICBpbmNsdXNpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGV4YWN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZGVmLm1heFNpemUubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZVR5cGUgPSB0aGlzLl9kZWYudmFsdWVUeXBlO1xuICAgICAgICBmdW5jdGlvbiBmaW5hbGl6ZVNldChlbGVtZW50cykge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkU2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGVsZW1lbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5kaXJ0eSgpO1xuICAgICAgICAgICAgICAgIHBhcnNlZFNldC5hZGQoZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IHBhcnNlZFNldCB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gWy4uLmN0eC5kYXRhLnZhbHVlcygpXS5tYXAoKGl0ZW0sIGkpID0+IHZhbHVlVHlwZS5fcGFyc2UobmV3IFBhcnNlSW5wdXRMYXp5UGF0aChjdHgsIGl0ZW0sIGN0eC5wYXRoLCBpKSkpO1xuICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGVsZW1lbnRzKS50aGVuKChlbGVtZW50cykgPT4gZmluYWxpemVTZXQoZWxlbWVudHMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmaW5hbGl6ZVNldChlbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbWluKG1pblNpemUsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBab2RTZXQoe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgbWluU2l6ZTogeyB2YWx1ZTogbWluU2l6ZSwgbWVzc2FnZTogZXJyb3JVdGlsLnRvU3RyaW5nKG1lc3NhZ2UpIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBtYXgobWF4U2l6ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFpvZFNldCh7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICBtYXhTaXplOiB7IHZhbHVlOiBtYXhTaXplLCBtZXNzYWdlOiBlcnJvclV0aWwudG9TdHJpbmcobWVzc2FnZSkgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNpemUoc2l6ZSwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5taW4oc2l6ZSwgbWVzc2FnZSkubWF4KHNpemUsIG1lc3NhZ2UpO1xuICAgIH1cbiAgICBub25lbXB0eShtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbigxLCBtZXNzYWdlKTtcbiAgICB9XG59XG5ab2RTZXQuY3JlYXRlID0gKHZhbHVlVHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RTZXQoe1xuICAgICAgICB2YWx1ZVR5cGUsXG4gICAgICAgIG1pblNpemU6IG51bGwsXG4gICAgICAgIG1heFNpemU6IG51bGwsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kU2V0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZEZ1bmN0aW9uIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudmFsaWRhdGUgPSB0aGlzLmltcGxlbWVudDtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUuZnVuY3Rpb24pIHtcbiAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwge1xuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IFpvZFBhcnNlZFR5cGUuZnVuY3Rpb24sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBtYWtlQXJnc0lzc3VlKGFyZ3MsIGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFrZUlzc3VlKHtcbiAgICAgICAgICAgICAgICBkYXRhOiBhcmdzLFxuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIGVycm9yTWFwczogW2N0eC5jb21tb24uY29udGV4dHVhbEVycm9yTWFwLCBjdHguc2NoZW1hRXJyb3JNYXAsIGdldEVycm9yTWFwKCksIGRlZmF1bHRFcnJvck1hcF0uZmlsdGVyKCh4KSA9PiAhIXgpLFxuICAgICAgICAgICAgICAgIGlzc3VlRGF0YToge1xuICAgICAgICAgICAgICAgICAgICBjb2RlOiBab2RJc3N1ZUNvZGUuaW52YWxpZF9hcmd1bWVudHMsXG4gICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50c0Vycm9yOiBlcnJvcixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gbWFrZVJldHVybnNJc3N1ZShyZXR1cm5zLCBlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VJc3N1ZSh7XG4gICAgICAgICAgICAgICAgZGF0YTogcmV0dXJucyxcbiAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICBlcnJvck1hcHM6IFtjdHguY29tbW9uLmNvbnRleHR1YWxFcnJvck1hcCwgY3R4LnNjaGVtYUVycm9yTWFwLCBnZXRFcnJvck1hcCgpLCBkZWZhdWx0RXJyb3JNYXBdLmZpbHRlcigoeCkgPT4gISF4KSxcbiAgICAgICAgICAgICAgICBpc3N1ZURhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfcmV0dXJuX3R5cGUsXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblR5cGVFcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHsgZXJyb3JNYXA6IGN0eC5jb21tb24uY29udGV4dHVhbEVycm9yTWFwIH07XG4gICAgICAgIGNvbnN0IGZuID0gY3R4LmRhdGE7XG4gICAgICAgIGlmICh0aGlzLl9kZWYucmV0dXJucyBpbnN0YW5jZW9mIFpvZFByb21pc2UpIHtcbiAgICAgICAgICAgIC8vIFdvdWxkIGxvdmUgYSB3YXkgdG8gYXZvaWQgZGlzYWJsaW5nIHRoaXMgcnVsZSwgYnV0IHdlIG5lZWRcbiAgICAgICAgICAgIC8vIGFuIGFsaWFzICh1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB3YXMgd2hhdCBjYXVzZWQgMjY1MSkuXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcbiAgICAgICAgICAgIGNvbnN0IG1lID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBPSyhhc3luYyBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IFpvZEVycm9yKFtdKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRBcmdzID0gYXdhaXQgbWUuX2RlZi5hcmdzLnBhcnNlQXN5bmMoYXJncywgcGFyYW1zKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5hZGRJc3N1ZShtYWtlQXJnc0lzc3VlKGFyZ3MsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgUmVmbGVjdC5hcHBseShmbiwgdGhpcywgcGFyc2VkQXJncyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkUmV0dXJucyA9IGF3YWl0IG1lLl9kZWYucmV0dXJucy5fZGVmLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgLnBhcnNlQXN5bmMocmVzdWx0LCBwYXJhbXMpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5hZGRJc3N1ZShtYWtlUmV0dXJuc0lzc3VlKHJlc3VsdCwgZSkpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkUmV0dXJucztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gV291bGQgbG92ZSBhIHdheSB0byBhdm9pZCBkaXNhYmxpbmcgdGhpcyBydWxlLCBidXQgd2UgbmVlZFxuICAgICAgICAgICAgLy8gYW4gYWxpYXMgKHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHdhcyB3aGF0IGNhdXNlZCAyNjUxKS5cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgICAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIE9LKGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkQXJncyA9IG1lLl9kZWYuYXJncy5zYWZlUGFyc2UoYXJncywgcGFyYW1zKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnNlZEFyZ3Muc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgWm9kRXJyb3IoW21ha2VBcmdzSXNzdWUoYXJncywgcGFyc2VkQXJncy5lcnJvcildKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5hcHBseShmbiwgdGhpcywgcGFyc2VkQXJncy5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWRSZXR1cm5zID0gbWUuX2RlZi5yZXR1cm5zLnNhZmVQYXJzZShyZXN1bHQsIHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJzZWRSZXR1cm5zLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFpvZEVycm9yKFttYWtlUmV0dXJuc0lzc3VlKHJlc3VsdCwgcGFyc2VkUmV0dXJucy5lcnJvcildKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZFJldHVybnMuZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhcmFtZXRlcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuYXJncztcbiAgICB9XG4gICAgcmV0dXJuVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5yZXR1cm5zO1xuICAgIH1cbiAgICBhcmdzKC4uLml0ZW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRnVuY3Rpb24oe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgYXJnczogWm9kVHVwbGUuY3JlYXRlKGl0ZW1zKS5yZXN0KFpvZFVua25vd24uY3JlYXRlKCkpLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJucyhyZXR1cm5UeXBlKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kRnVuY3Rpb24oe1xuICAgICAgICAgICAgLi4udGhpcy5fZGVmLFxuICAgICAgICAgICAgcmV0dXJuczogcmV0dXJuVHlwZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGltcGxlbWVudChmdW5jKSB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlZEZ1bmMgPSB0aGlzLnBhcnNlKGZ1bmMpO1xuICAgICAgICByZXR1cm4gdmFsaWRhdGVkRnVuYztcbiAgICB9XG4gICAgc3RyaWN0SW1wbGVtZW50KGZ1bmMpIHtcbiAgICAgICAgY29uc3QgdmFsaWRhdGVkRnVuYyA9IHRoaXMucGFyc2UoZnVuYyk7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZWRGdW5jO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKGFyZ3MsIHJldHVybnMsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3IFpvZEZ1bmN0aW9uKHtcbiAgICAgICAgICAgIGFyZ3M6IChhcmdzID8gYXJncyA6IFpvZFR1cGxlLmNyZWF0ZShbXSkucmVzdChab2RVbmtub3duLmNyZWF0ZSgpKSksXG4gICAgICAgICAgICByZXR1cm5zOiByZXR1cm5zIHx8IFpvZFVua25vd24uY3JlYXRlKCksXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEZ1bmN0aW9uLFxuICAgICAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kTGF6eSBleHRlbmRzIFpvZFR5cGUge1xuICAgIGdldCBzY2hlbWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuZ2V0dGVyKCk7XG4gICAgfVxuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgbGF6eVNjaGVtYSA9IHRoaXMuX2RlZi5nZXR0ZXIoKTtcbiAgICAgICAgcmV0dXJuIGxhenlTY2hlbWEuX3BhcnNlKHsgZGF0YTogY3R4LmRhdGEsIHBhdGg6IGN0eC5wYXRoLCBwYXJlbnQ6IGN0eCB9KTtcbiAgICB9XG59XG5ab2RMYXp5LmNyZWF0ZSA9IChnZXR0ZXIsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTGF6eSh7XG4gICAgICAgIGdldHRlcjogZ2V0dGVyLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZExhenksXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kTGl0ZXJhbCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQuZGF0YSAhPT0gdGhpcy5fZGVmLnZhbHVlKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfbGl0ZXJhbCxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogdGhpcy5fZGVmLnZhbHVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGlucHV0LmRhdGEgfTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnZhbHVlO1xuICAgIH1cbn1cblpvZExpdGVyYWwuY3JlYXRlID0gKHZhbHVlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZExpdGVyYWwoe1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTGl0ZXJhbCxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmZ1bmN0aW9uIGNyZWF0ZVpvZEVudW0odmFsdWVzLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IFpvZEVudW0oe1xuICAgICAgICB2YWx1ZXMsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRW51bSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufVxuZXhwb3J0IGNsYXNzIFpvZEVudW0gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5kYXRhICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZFZhbHVlcyA9IHRoaXMuX2RlZi52YWx1ZXM7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogdXRpbC5qb2luVmFsdWVzKGV4cGVjdGVkVmFsdWVzKSxcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LnBhcnNlZFR5cGUsXG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGUgPSBuZXcgU2V0KHRoaXMuX2RlZi52YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGUuaGFzKGlucHV0LmRhdGEpKSB7XG4gICAgICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZFZhbHVlcyA9IHRoaXMuX2RlZi52YWx1ZXM7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfZW51bV92YWx1ZSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBleHBlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbiAgICBnZXQgb3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZXM7XG4gICAgfVxuICAgIGdldCBlbnVtKCkge1xuICAgICAgICBjb25zdCBlbnVtVmFsdWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX2RlZi52YWx1ZXMpIHtcbiAgICAgICAgICAgIGVudW1WYWx1ZXNbdmFsXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW51bVZhbHVlcztcbiAgICB9XG4gICAgZ2V0IFZhbHVlcygpIHtcbiAgICAgICAgY29uc3QgZW51bVZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IHZhbCBvZiB0aGlzLl9kZWYudmFsdWVzKSB7XG4gICAgICAgICAgICBlbnVtVmFsdWVzW3ZhbF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVudW1WYWx1ZXM7XG4gICAgfVxuICAgIGdldCBFbnVtKCkge1xuICAgICAgICBjb25zdCBlbnVtVmFsdWVzID0ge307XG4gICAgICAgIGZvciAoY29uc3QgdmFsIG9mIHRoaXMuX2RlZi52YWx1ZXMpIHtcbiAgICAgICAgICAgIGVudW1WYWx1ZXNbdmFsXSA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW51bVZhbHVlcztcbiAgICB9XG4gICAgZXh0cmFjdCh2YWx1ZXMsIG5ld0RlZiA9IHRoaXMuX2RlZikge1xuICAgICAgICByZXR1cm4gWm9kRW51bS5jcmVhdGUodmFsdWVzLCB7XG4gICAgICAgICAgICAuLi50aGlzLl9kZWYsXG4gICAgICAgICAgICAuLi5uZXdEZWYsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBleGNsdWRlKHZhbHVlcywgbmV3RGVmID0gdGhpcy5fZGVmKSB7XG4gICAgICAgIHJldHVybiBab2RFbnVtLmNyZWF0ZSh0aGlzLm9wdGlvbnMuZmlsdGVyKChvcHQpID0+ICF2YWx1ZXMuaW5jbHVkZXMob3B0KSksIHtcbiAgICAgICAgICAgIC4uLnRoaXMuX2RlZixcbiAgICAgICAgICAgIC4uLm5ld0RlZixcbiAgICAgICAgfSk7XG4gICAgfVxufVxuWm9kRW51bS5jcmVhdGUgPSBjcmVhdGVab2RFbnVtO1xuZXhwb3J0IGNsYXNzIFpvZE5hdGl2ZUVudW0gZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgbmF0aXZlRW51bVZhbHVlcyA9IHV0aWwuZ2V0VmFsaWRFbnVtVmFsdWVzKHRoaXMuX2RlZi52YWx1ZXMpO1xuICAgICAgICBjb25zdCBjdHggPSB0aGlzLl9nZXRPclJldHVybkN0eChpbnB1dCk7XG4gICAgICAgIGlmIChjdHgucGFyc2VkVHlwZSAhPT0gWm9kUGFyc2VkVHlwZS5zdHJpbmcgJiYgY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUubnVtYmVyKSB7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZFZhbHVlcyA9IHV0aWwub2JqZWN0VmFsdWVzKG5hdGl2ZUVudW1WYWx1ZXMpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IHV0aWwuam9pblZhbHVlcyhleHBlY3RlZFZhbHVlcyksXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgICAgIGNvZGU6IFpvZElzc3VlQ29kZS5pbnZhbGlkX3R5cGUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlID0gbmV3IFNldCh1dGlsLmdldFZhbGlkRW51bVZhbHVlcyh0aGlzLl9kZWYudmFsdWVzKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9jYWNoZS5oYXMoaW5wdXQuZGF0YSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gdXRpbC5vYmplY3RWYWx1ZXMobmF0aXZlRW51bVZhbHVlcyk7XG4gICAgICAgICAgICBhZGRJc3N1ZVRvQ29udGV4dChjdHgsIHtcbiAgICAgICAgICAgICAgICByZWNlaXZlZDogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfZW51bV92YWx1ZSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBleHBlY3RlZFZhbHVlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE9LKGlucHV0LmRhdGEpO1xuICAgIH1cbiAgICBnZXQgZW51bSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi52YWx1ZXM7XG4gICAgfVxufVxuWm9kTmF0aXZlRW51bS5jcmVhdGUgPSAodmFsdWVzLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE5hdGl2ZUVudW0oe1xuICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROYXRpdmVFbnVtLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZFByb21pc2UgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYudHlwZTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgY3R4IH0gPSB0aGlzLl9wcm9jZXNzSW5wdXRQYXJhbXMoaW5wdXQpO1xuICAgICAgICBpZiAoY3R4LnBhcnNlZFR5cGUgIT09IFpvZFBhcnNlZFR5cGUucHJvbWlzZSAmJiBjdHguY29tbW9uLmFzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5wcm9taXNlLFxuICAgICAgICAgICAgICAgIHJlY2VpdmVkOiBjdHgucGFyc2VkVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvbWlzaWZpZWQgPSBjdHgucGFyc2VkVHlwZSA9PT0gWm9kUGFyc2VkVHlwZS5wcm9taXNlID8gY3R4LmRhdGEgOiBQcm9taXNlLnJlc29sdmUoY3R4LmRhdGEpO1xuICAgICAgICByZXR1cm4gT0socHJvbWlzaWZpZWQudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi50eXBlLnBhcnNlQXN5bmMoZGF0YSwge1xuICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgIGVycm9yTWFwOiBjdHguY29tbW9uLmNvbnRleHR1YWxFcnJvck1hcCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgfVxufVxuWm9kUHJvbWlzZS5jcmVhdGUgPSAoc2NoZW1hLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZFByb21pc2Uoe1xuICAgICAgICB0eXBlOiBzY2hlbWEsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kUHJvbWlzZSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbmV4cG9ydCBjbGFzcyBab2RFZmZlY3RzIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgaW5uZXJUeXBlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnNjaGVtYTtcbiAgICB9XG4gICAgc291cmNlVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5zY2hlbWEuX2RlZi50eXBlTmFtZSA9PT0gWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZEVmZmVjdHNcbiAgICAgICAgICAgID8gdGhpcy5fZGVmLnNjaGVtYS5zb3VyY2VUeXBlKClcbiAgICAgICAgICAgIDogdGhpcy5fZGVmLnNjaGVtYTtcbiAgICB9XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGNvbnN0IGVmZmVjdCA9IHRoaXMuX2RlZi5lZmZlY3QgfHwgbnVsbDtcbiAgICAgICAgY29uc3QgY2hlY2tDdHggPSB7XG4gICAgICAgICAgICBhZGRJc3N1ZTogKGFyZykgPT4ge1xuICAgICAgICAgICAgICAgIGFkZElzc3VlVG9Db250ZXh0KGN0eCwgYXJnKTtcbiAgICAgICAgICAgICAgICBpZiAoYXJnLmZhdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCBwYXRoKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdHgucGF0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNoZWNrQ3R4LmFkZElzc3VlID0gY2hlY2tDdHguYWRkSXNzdWUuYmluZChjaGVja0N0eCk7XG4gICAgICAgIGlmIChlZmZlY3QudHlwZSA9PT0gXCJwcmVwcm9jZXNzXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2Nlc3NlZCA9IGVmZmVjdC50cmFuc2Zvcm0oY3R4LmRhdGEsIGNoZWNrQ3R4KTtcbiAgICAgICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcm9jZXNzZWQpLnRoZW4oYXN5bmMgKHByb2Nlc3NlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLnZhbHVlID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHByb2Nlc3NlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBESVJUWShyZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzLnZhbHVlID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRElSVFkocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMudmFsdWUgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9kZWYuc2NoZW1hLl9wYXJzZVN5bmMoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiBwcm9jZXNzZWQsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSBcImRpcnR5XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBESVJUWShyZXN1bHQudmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMudmFsdWUgPT09IFwiZGlydHlcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERJUlRZKHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZWZmZWN0LnR5cGUgPT09IFwicmVmaW5lbWVudFwiKSB7XG4gICAgICAgICAgICBjb25zdCBleGVjdXRlUmVmaW5lbWVudCA9IChhY2MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBlZmZlY3QucmVmaW5lbWVudChhY2MsIGNoZWNrQ3R4KTtcbiAgICAgICAgICAgICAgICBpZiAoY3R4LmNvbW1vbi5hc3luYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFzeW5jIHJlZmluZW1lbnQgZW5jb3VudGVyZWQgZHVyaW5nIHN5bmNocm9ub3VzIHBhcnNlIG9wZXJhdGlvbi4gVXNlIC5wYXJzZUFzeW5jIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyID0gdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VTeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaW5uZXIuc3RhdHVzID09PSBcImFib3J0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIElOVkFMSUQ7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gdmFsdWUgaXMgaWdub3JlZFxuICAgICAgICAgICAgICAgIGV4ZWN1dGVSZWZpbmVtZW50KGlubmVyLnZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGlubmVyLnZhbHVlIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VBc3luYyh7IGRhdGE6IGN0eC5kYXRhLCBwYXRoOiBjdHgucGF0aCwgcGFyZW50OiBjdHggfSkudGhlbigoaW5uZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlubmVyLnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlubmVyLnN0YXR1cyA9PT0gXCJkaXJ0eVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBleGVjdXRlUmVmaW5lbWVudChpbm5lci52YWx1ZSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdGF0dXM6IHN0YXR1cy52YWx1ZSwgdmFsdWU6IGlubmVyLnZhbHVlIH07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlZmZlY3QudHlwZSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgaWYgKGN0eC5jb21tb24uYXN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYmFzZSA9IHRoaXMuX2RlZi5zY2hlbWEuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKGJhc2UpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBlZmZlY3QudHJhbnNmb3JtKGJhc2UudmFsdWUsIGNoZWNrQ3R4KTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzeW5jaHJvbm91cyB0cmFuc2Zvcm0gZW5jb3VudGVyZWQgZHVyaW5nIHN5bmNocm9ub3VzIHBhcnNlIG9wZXJhdGlvbi4gVXNlIC5wYXJzZUFzeW5jIGluc3RlYWQuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7IHN0YXR1czogc3RhdHVzLnZhbHVlLCB2YWx1ZTogcmVzdWx0IH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnNjaGVtYS5fcGFyc2VBc3luYyh7IGRhdGE6IGN0eC5kYXRhLCBwYXRoOiBjdHgucGF0aCwgcGFyZW50OiBjdHggfSkudGhlbigoYmFzZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQoYmFzZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShlZmZlY3QudHJhbnNmb3JtKGJhc2UudmFsdWUsIGNoZWNrQ3R4KSkudGhlbigocmVzdWx0KSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBzdGF0dXMudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdXRpbC5hc3NlcnROZXZlcihlZmZlY3QpO1xuICAgIH1cbn1cblpvZEVmZmVjdHMuY3JlYXRlID0gKHNjaGVtYSwgZWZmZWN0LCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZEVmZmVjdHMoe1xuICAgICAgICBzY2hlbWEsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRWZmZWN0cyxcbiAgICAgICAgZWZmZWN0LFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuWm9kRWZmZWN0cy5jcmVhdGVXaXRoUHJlcHJvY2VzcyA9IChwcmVwcm9jZXNzLCBzY2hlbWEsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kRWZmZWN0cyh7XG4gICAgICAgIHNjaGVtYSxcbiAgICAgICAgZWZmZWN0OiB7IHR5cGU6IFwicHJlcHJvY2Vzc1wiLCB0cmFuc2Zvcm06IHByZXByb2Nlc3MgfSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RFZmZlY3RzLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IHsgWm9kRWZmZWN0cyBhcyBab2RUcmFuc2Zvcm1lciB9O1xuZXhwb3J0IGNsYXNzIFpvZE9wdGlvbmFsIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgPT09IFpvZFBhcnNlZFR5cGUudW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gT0sodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZS5fcGFyc2UoaW5wdXQpO1xuICAgIH1cbiAgICB1bndyYXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlO1xuICAgIH1cbn1cblpvZE9wdGlvbmFsLmNyZWF0ZSA9ICh0eXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZE9wdGlvbmFsKHtcbiAgICAgICAgaW5uZXJUeXBlOiB0eXBlLFxuICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZE9wdGlvbmFsLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZE51bGxhYmxlIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHBhcnNlZFR5cGUgPSB0aGlzLl9nZXRUeXBlKGlucHV0KTtcbiAgICAgICAgaWYgKHBhcnNlZFR5cGUgPT09IFpvZFBhcnNlZFR5cGUubnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIE9LKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9kZWYuaW5uZXJUeXBlLl9wYXJzZShpbnB1dCk7XG4gICAgfVxuICAgIHVud3JhcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5pbm5lclR5cGU7XG4gICAgfVxufVxuWm9kTnVsbGFibGUuY3JlYXRlID0gKHR5cGUsIHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTnVsbGFibGUoe1xuICAgICAgICBpbm5lclR5cGU6IHR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kTnVsbGFibGUsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kRGVmYXVsdCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgbGV0IGRhdGEgPSBjdHguZGF0YTtcbiAgICAgICAgaWYgKGN0eC5wYXJzZWRUeXBlID09PSBab2RQYXJzZWRUeXBlLnVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF0YSA9IHRoaXMuX2RlZi5kZWZhdWx0VmFsdWUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZS5fcGFyc2Uoe1xuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHBhdGg6IGN0eC5wYXRoLFxuICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVEZWZhdWx0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZTtcbiAgICB9XG59XG5ab2REZWZhdWx0LmNyZWF0ZSA9ICh0eXBlLCBwYXJhbXMpID0+IHtcbiAgICByZXR1cm4gbmV3IFpvZERlZmF1bHQoe1xuICAgICAgICBpbm5lclR5cGU6IHR5cGUsXG4gICAgICAgIHR5cGVOYW1lOiBab2RGaXJzdFBhcnR5VHlwZUtpbmQuWm9kRGVmYXVsdCxcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB0eXBlb2YgcGFyYW1zLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiA/IHBhcmFtcy5kZWZhdWx0IDogKCkgPT4gcGFyYW1zLmRlZmF1bHQsXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY2xhc3MgWm9kQ2F0Y2ggZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIC8vIG5ld0N0eCBpcyB1c2VkIHRvIG5vdCBjb2xsZWN0IGlzc3VlcyBmcm9tIGlubmVyIHR5cGVzIGluIGN0eFxuICAgICAgICBjb25zdCBuZXdDdHggPSB7XG4gICAgICAgICAgICAuLi5jdHgsXG4gICAgICAgICAgICBjb21tb246IHtcbiAgICAgICAgICAgICAgICAuLi5jdHguY29tbW9uLFxuICAgICAgICAgICAgICAgIGlzc3VlczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9kZWYuaW5uZXJUeXBlLl9wYXJzZSh7XG4gICAgICAgICAgICBkYXRhOiBuZXdDdHguZGF0YSxcbiAgICAgICAgICAgIHBhdGg6IG5ld0N0eC5wYXRoLFxuICAgICAgICAgICAgcGFyZW50OiB7XG4gICAgICAgICAgICAgICAgLi4ubmV3Q3R4LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc0FzeW5jKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcInZhbGlkXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXN1bHQuc3RhdHVzID09PSBcInZhbGlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX2RlZi5jYXRjaFZhbHVlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQgZXJyb3IoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgWm9kRXJyb3IobmV3Q3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IG5ld0N0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IFwidmFsaWRcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVzdWx0LnN0YXR1cyA9PT0gXCJ2YWxpZFwiXG4gICAgICAgICAgICAgICAgICAgID8gcmVzdWx0LnZhbHVlXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5fZGVmLmNhdGNoVmFsdWUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0IGVycm9yKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgWm9kRXJyb3IobmV3Q3R4LmNvbW1vbi5pc3N1ZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBuZXdDdHguZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZUNhdGNoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZTtcbiAgICB9XG59XG5ab2RDYXRjaC5jcmVhdGUgPSAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RDYXRjaCh7XG4gICAgICAgIGlubmVyVHlwZTogdHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RDYXRjaCxcbiAgICAgICAgY2F0Y2hWYWx1ZTogdHlwZW9mIHBhcmFtcy5jYXRjaCA9PT0gXCJmdW5jdGlvblwiID8gcGFyYW1zLmNhdGNoIDogKCkgPT4gcGFyYW1zLmNhdGNoLFxuICAgICAgICAuLi5wcm9jZXNzQ3JlYXRlUGFyYW1zKHBhcmFtcyksXG4gICAgfSk7XG59O1xuZXhwb3J0IGNsYXNzIFpvZE5hTiBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCBwYXJzZWRUeXBlID0gdGhpcy5fZ2V0VHlwZShpbnB1dCk7XG4gICAgICAgIGlmIChwYXJzZWRUeXBlICE9PSBab2RQYXJzZWRUeXBlLm5hbikge1xuICAgICAgICAgICAgY29uc3QgY3R4ID0gdGhpcy5fZ2V0T3JSZXR1cm5DdHgoaW5wdXQpO1xuICAgICAgICAgICAgYWRkSXNzdWVUb0NvbnRleHQoY3R4LCB7XG4gICAgICAgICAgICAgICAgY29kZTogWm9kSXNzdWVDb2RlLmludmFsaWRfdHlwZSxcbiAgICAgICAgICAgICAgICBleHBlY3RlZDogWm9kUGFyc2VkVHlwZS5uYW4sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZWQ6IGN0eC5wYXJzZWRUeXBlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBzdGF0dXM6IFwidmFsaWRcIiwgdmFsdWU6IGlucHV0LmRhdGEgfTtcbiAgICB9XG59XG5ab2ROYU4uY3JlYXRlID0gKHBhcmFtcykgPT4ge1xuICAgIHJldHVybiBuZXcgWm9kTmFOKHtcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2ROYU4sXG4gICAgICAgIC4uLnByb2Nlc3NDcmVhdGVQYXJhbXMocGFyYW1zKSxcbiAgICB9KTtcbn07XG5leHBvcnQgY29uc3QgQlJBTkQgPSBTeW1ib2woXCJ6b2RfYnJhbmRcIik7XG5leHBvcnQgY2xhc3MgWm9kQnJhbmRlZCBleHRlbmRzIFpvZFR5cGUge1xuICAgIF9wYXJzZShpbnB1dCkge1xuICAgICAgICBjb25zdCB7IGN0eCB9ID0gdGhpcy5fcHJvY2Vzc0lucHV0UGFyYW1zKGlucHV0KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGN0eC5kYXRhO1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnR5cGUuX3BhcnNlKHtcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgIHBhcmVudDogY3R4LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLnR5cGU7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFpvZFBpcGVsaW5lIGV4dGVuZHMgWm9kVHlwZSB7XG4gICAgX3BhcnNlKGlucHV0KSB7XG4gICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjdHggfSA9IHRoaXMuX3Byb2Nlc3NJbnB1dFBhcmFtcyhpbnB1dCk7XG4gICAgICAgIGlmIChjdHguY29tbW9uLmFzeW5jKSB7XG4gICAgICAgICAgICBjb25zdCBoYW5kbGVBc3luYyA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpblJlc3VsdCA9IGF3YWl0IHRoaXMuX2RlZi5pbi5fcGFyc2VBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGN0eC5kYXRhLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGluUmVzdWx0LnN0YXR1cyA9PT0gXCJhYm9ydGVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgICAgIGlmIChpblJlc3VsdC5zdGF0dXMgPT09IFwiZGlydHlcIikge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuZGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIERJUlRZKGluUmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWYub3V0Ll9wYXJzZUFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGluUmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN0eCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVBc3luYygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgaW5SZXN1bHQgPSB0aGlzLl9kZWYuaW4uX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgZGF0YTogY3R4LmRhdGEsXG4gICAgICAgICAgICAgICAgcGF0aDogY3R4LnBhdGgsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpblJlc3VsdC5zdGF0dXMgPT09IFwiYWJvcnRlZFwiKVxuICAgICAgICAgICAgICAgIHJldHVybiBJTlZBTElEO1xuICAgICAgICAgICAgaWYgKGluUmVzdWx0LnN0YXR1cyA9PT0gXCJkaXJ0eVwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzLmRpcnR5KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBcImRpcnR5XCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpblJlc3VsdC52YWx1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZi5vdXQuX3BhcnNlU3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGluUmVzdWx0LnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoOiBjdHgucGF0aCxcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBjdHgsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBuZXcgWm9kUGlwZWxpbmUoe1xuICAgICAgICAgICAgaW46IGEsXG4gICAgICAgICAgICBvdXQ6IGIsXG4gICAgICAgICAgICB0eXBlTmFtZTogWm9kRmlyc3RQYXJ0eVR5cGVLaW5kLlpvZFBpcGVsaW5lLFxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgWm9kUmVhZG9ubHkgZXh0ZW5kcyBab2RUeXBlIHtcbiAgICBfcGFyc2UoaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZGVmLmlubmVyVHlwZS5fcGFyc2UoaW5wdXQpO1xuICAgICAgICBjb25zdCBmcmVlemUgPSAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGlzVmFsaWQoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICBkYXRhLnZhbHVlID0gT2JqZWN0LmZyZWV6ZShkYXRhLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaXNBc3luYyhyZXN1bHQpID8gcmVzdWx0LnRoZW4oKGRhdGEpID0+IGZyZWV6ZShkYXRhKSkgOiBmcmVlemUocmVzdWx0KTtcbiAgICB9XG4gICAgdW53cmFwKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmLmlubmVyVHlwZTtcbiAgICB9XG59XG5ab2RSZWFkb25seS5jcmVhdGUgPSAodHlwZSwgcGFyYW1zKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBab2RSZWFkb25seSh7XG4gICAgICAgIGlubmVyVHlwZTogdHlwZSxcbiAgICAgICAgdHlwZU5hbWU6IFpvZEZpcnN0UGFydHlUeXBlS2luZC5ab2RSZWFkb25seSxcbiAgICAgICAgLi4ucHJvY2Vzc0NyZWF0ZVBhcmFtcyhwYXJhbXMpLFxuICAgIH0pO1xufTtcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICAgICAgICAgICAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICB6LmN1c3RvbSAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8gICAgICAgICAgICAgICAgICAgIC8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmZ1bmN0aW9uIGNsZWFuUGFyYW1zKHBhcmFtcywgZGF0YSkge1xuICAgIGNvbnN0IHAgPSB0eXBlb2YgcGFyYW1zID09PSBcImZ1bmN0aW9uXCIgPyBwYXJhbXMoZGF0YSkgOiB0eXBlb2YgcGFyYW1zID09PSBcInN0cmluZ1wiID8geyBtZXNzYWdlOiBwYXJhbXMgfSA6IHBhcmFtcztcbiAgICBjb25zdCBwMiA9IHR5cGVvZiBwID09PSBcInN0cmluZ1wiID8geyBtZXNzYWdlOiBwIH0gOiBwO1xuICAgIHJldHVybiBwMjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b20oY2hlY2ssIF9wYXJhbXMgPSB7fSwgXG4vKipcbiAqIEBkZXByZWNhdGVkXG4gKlxuICogUGFzcyBgZmF0YWxgIGludG8gdGhlIHBhcmFtcyBvYmplY3QgaW5zdGVhZDpcbiAqXG4gKiBgYGB0c1xuICogei5zdHJpbmcoKS5jdXN0b20oKHZhbCkgPT4gdmFsLmxlbmd0aCA+IDUsIHsgZmF0YWw6IGZhbHNlIH0pXG4gKiBgYGBcbiAqXG4gKi9cbmZhdGFsKSB7XG4gICAgaWYgKGNoZWNrKVxuICAgICAgICByZXR1cm4gWm9kQW55LmNyZWF0ZSgpLnN1cGVyUmVmaW5lKChkYXRhLCBjdHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBjaGVjayhkYXRhKTtcbiAgICAgICAgICAgIGlmIChyIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByLnRoZW4oKHIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBjbGVhblBhcmFtcyhfcGFyYW1zLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9mYXRhbCA9IHBhcmFtcy5mYXRhbCA/PyBmYXRhbCA/PyB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmFkZElzc3VlKHsgY29kZTogXCJjdXN0b21cIiwgLi4ucGFyYW1zLCBmYXRhbDogX2ZhdGFsIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBjbGVhblBhcmFtcyhfcGFyYW1zLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCBfZmF0YWwgPSBwYXJhbXMuZmF0YWwgPz8gZmF0YWwgPz8gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjdHguYWRkSXNzdWUoeyBjb2RlOiBcImN1c3RvbVwiLCAuLi5wYXJhbXMsIGZhdGFsOiBfZmF0YWwgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0pO1xuICAgIHJldHVybiBab2RBbnkuY3JlYXRlKCk7XG59XG5leHBvcnQgeyBab2RUeXBlIGFzIFNjaGVtYSwgWm9kVHlwZSBhcyBab2RTY2hlbWEgfTtcbmV4cG9ydCBjb25zdCBsYXRlID0ge1xuICAgIG9iamVjdDogWm9kT2JqZWN0LmxhenljcmVhdGUsXG59O1xuZXhwb3J0IHZhciBab2RGaXJzdFBhcnR5VHlwZUtpbmQ7XG4oZnVuY3Rpb24gKFpvZEZpcnN0UGFydHlUeXBlS2luZCkge1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFN0cmluZ1wiXSA9IFwiWm9kU3RyaW5nXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTnVtYmVyXCJdID0gXCJab2ROdW1iZXJcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2ROYU5cIl0gPSBcIlpvZE5hTlwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEJpZ0ludFwiXSA9IFwiWm9kQmlnSW50XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQm9vbGVhblwiXSA9IFwiWm9kQm9vbGVhblwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZERhdGVcIl0gPSBcIlpvZERhdGVcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RTeW1ib2xcIl0gPSBcIlpvZFN5bWJvbFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFVuZGVmaW5lZFwiXSA9IFwiWm9kVW5kZWZpbmVkXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTnVsbFwiXSA9IFwiWm9kTnVsbFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEFueVwiXSA9IFwiWm9kQW55XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kVW5rbm93blwiXSA9IFwiWm9kVW5rbm93blwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE5ldmVyXCJdID0gXCJab2ROZXZlclwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFZvaWRcIl0gPSBcIlpvZFZvaWRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RBcnJheVwiXSA9IFwiWm9kQXJyYXlcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RPYmplY3RcIl0gPSBcIlpvZE9iamVjdFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFVuaW9uXCJdID0gXCJab2RVbmlvblwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZERpc2NyaW1pbmF0ZWRVbmlvblwiXSA9IFwiWm9kRGlzY3JpbWluYXRlZFVuaW9uXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kSW50ZXJzZWN0aW9uXCJdID0gXCJab2RJbnRlcnNlY3Rpb25cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RUdXBsZVwiXSA9IFwiWm9kVHVwbGVcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RSZWNvcmRcIl0gPSBcIlpvZFJlY29yZFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE1hcFwiXSA9IFwiWm9kTWFwXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kU2V0XCJdID0gXCJab2RTZXRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RGdW5jdGlvblwiXSA9IFwiWm9kRnVuY3Rpb25cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RMYXp5XCJdID0gXCJab2RMYXp5XCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTGl0ZXJhbFwiXSA9IFwiWm9kTGl0ZXJhbFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZEVudW1cIl0gPSBcIlpvZEVudW1cIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RFZmZlY3RzXCJdID0gXCJab2RFZmZlY3RzXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kTmF0aXZlRW51bVwiXSA9IFwiWm9kTmF0aXZlRW51bVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE9wdGlvbmFsXCJdID0gXCJab2RPcHRpb25hbFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZE51bGxhYmxlXCJdID0gXCJab2ROdWxsYWJsZVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZERlZmF1bHRcIl0gPSBcIlpvZERlZmF1bHRcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RDYXRjaFwiXSA9IFwiWm9kQ2F0Y2hcIjtcbiAgICBab2RGaXJzdFBhcnR5VHlwZUtpbmRbXCJab2RQcm9taXNlXCJdID0gXCJab2RQcm9taXNlXCI7XG4gICAgWm9kRmlyc3RQYXJ0eVR5cGVLaW5kW1wiWm9kQnJhbmRlZFwiXSA9IFwiWm9kQnJhbmRlZFwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFBpcGVsaW5lXCJdID0gXCJab2RQaXBlbGluZVwiO1xuICAgIFpvZEZpcnN0UGFydHlUeXBlS2luZFtcIlpvZFJlYWRvbmx5XCJdID0gXCJab2RSZWFkb25seVwiO1xufSkoWm9kRmlyc3RQYXJ0eVR5cGVLaW5kIHx8IChab2RGaXJzdFBhcnR5VHlwZUtpbmQgPSB7fSkpO1xuLy8gcmVxdWlyZXMgVFMgNC40K1xuY2xhc3MgQ2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKC4uLl8pIHsgfVxufVxuY29uc3QgaW5zdGFuY2VPZlR5cGUgPSAoXG4vLyBjb25zdCBpbnN0YW5jZU9mVHlwZSA9IDxUIGV4dGVuZHMgbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PihcbmNscywgcGFyYW1zID0ge1xuICAgIG1lc3NhZ2U6IGBJbnB1dCBub3QgaW5zdGFuY2Ugb2YgJHtjbHMubmFtZX1gLFxufSkgPT4gY3VzdG9tKChkYXRhKSA9PiBkYXRhIGluc3RhbmNlb2YgY2xzLCBwYXJhbXMpO1xuY29uc3Qgc3RyaW5nVHlwZSA9IFpvZFN0cmluZy5jcmVhdGU7XG5jb25zdCBudW1iZXJUeXBlID0gWm9kTnVtYmVyLmNyZWF0ZTtcbmNvbnN0IG5hblR5cGUgPSBab2ROYU4uY3JlYXRlO1xuY29uc3QgYmlnSW50VHlwZSA9IFpvZEJpZ0ludC5jcmVhdGU7XG5jb25zdCBib29sZWFuVHlwZSA9IFpvZEJvb2xlYW4uY3JlYXRlO1xuY29uc3QgZGF0ZVR5cGUgPSBab2REYXRlLmNyZWF0ZTtcbmNvbnN0IHN5bWJvbFR5cGUgPSBab2RTeW1ib2wuY3JlYXRlO1xuY29uc3QgdW5kZWZpbmVkVHlwZSA9IFpvZFVuZGVmaW5lZC5jcmVhdGU7XG5jb25zdCBudWxsVHlwZSA9IFpvZE51bGwuY3JlYXRlO1xuY29uc3QgYW55VHlwZSA9IFpvZEFueS5jcmVhdGU7XG5jb25zdCB1bmtub3duVHlwZSA9IFpvZFVua25vd24uY3JlYXRlO1xuY29uc3QgbmV2ZXJUeXBlID0gWm9kTmV2ZXIuY3JlYXRlO1xuY29uc3Qgdm9pZFR5cGUgPSBab2RWb2lkLmNyZWF0ZTtcbmNvbnN0IGFycmF5VHlwZSA9IFpvZEFycmF5LmNyZWF0ZTtcbmNvbnN0IG9iamVjdFR5cGUgPSBab2RPYmplY3QuY3JlYXRlO1xuY29uc3Qgc3RyaWN0T2JqZWN0VHlwZSA9IFpvZE9iamVjdC5zdHJpY3RDcmVhdGU7XG5jb25zdCB1bmlvblR5cGUgPSBab2RVbmlvbi5jcmVhdGU7XG5jb25zdCBkaXNjcmltaW5hdGVkVW5pb25UeXBlID0gWm9kRGlzY3JpbWluYXRlZFVuaW9uLmNyZWF0ZTtcbmNvbnN0IGludGVyc2VjdGlvblR5cGUgPSBab2RJbnRlcnNlY3Rpb24uY3JlYXRlO1xuY29uc3QgdHVwbGVUeXBlID0gWm9kVHVwbGUuY3JlYXRlO1xuY29uc3QgcmVjb3JkVHlwZSA9IFpvZFJlY29yZC5jcmVhdGU7XG5jb25zdCBtYXBUeXBlID0gWm9kTWFwLmNyZWF0ZTtcbmNvbnN0IHNldFR5cGUgPSBab2RTZXQuY3JlYXRlO1xuY29uc3QgZnVuY3Rpb25UeXBlID0gWm9kRnVuY3Rpb24uY3JlYXRlO1xuY29uc3QgbGF6eVR5cGUgPSBab2RMYXp5LmNyZWF0ZTtcbmNvbnN0IGxpdGVyYWxUeXBlID0gWm9kTGl0ZXJhbC5jcmVhdGU7XG5jb25zdCBlbnVtVHlwZSA9IFpvZEVudW0uY3JlYXRlO1xuY29uc3QgbmF0aXZlRW51bVR5cGUgPSBab2ROYXRpdmVFbnVtLmNyZWF0ZTtcbmNvbnN0IHByb21pc2VUeXBlID0gWm9kUHJvbWlzZS5jcmVhdGU7XG5jb25zdCBlZmZlY3RzVHlwZSA9IFpvZEVmZmVjdHMuY3JlYXRlO1xuY29uc3Qgb3B0aW9uYWxUeXBlID0gWm9kT3B0aW9uYWwuY3JlYXRlO1xuY29uc3QgbnVsbGFibGVUeXBlID0gWm9kTnVsbGFibGUuY3JlYXRlO1xuY29uc3QgcHJlcHJvY2Vzc1R5cGUgPSBab2RFZmZlY3RzLmNyZWF0ZVdpdGhQcmVwcm9jZXNzO1xuY29uc3QgcGlwZWxpbmVUeXBlID0gWm9kUGlwZWxpbmUuY3JlYXRlO1xuY29uc3Qgb3N0cmluZyA9ICgpID0+IHN0cmluZ1R5cGUoKS5vcHRpb25hbCgpO1xuY29uc3Qgb251bWJlciA9ICgpID0+IG51bWJlclR5cGUoKS5vcHRpb25hbCgpO1xuY29uc3Qgb2Jvb2xlYW4gPSAoKSA9PiBib29sZWFuVHlwZSgpLm9wdGlvbmFsKCk7XG5leHBvcnQgY29uc3QgY29lcmNlID0ge1xuICAgIHN0cmluZzogKChhcmcpID0+IFpvZFN0cmluZy5jcmVhdGUoeyAuLi5hcmcsIGNvZXJjZTogdHJ1ZSB9KSksXG4gICAgbnVtYmVyOiAoKGFyZykgPT4gWm9kTnVtYmVyLmNyZWF0ZSh7IC4uLmFyZywgY29lcmNlOiB0cnVlIH0pKSxcbiAgICBib29sZWFuOiAoKGFyZykgPT4gWm9kQm9vbGVhbi5jcmVhdGUoe1xuICAgICAgICAuLi5hcmcsXG4gICAgICAgIGNvZXJjZTogdHJ1ZSxcbiAgICB9KSksXG4gICAgYmlnaW50OiAoKGFyZykgPT4gWm9kQmlnSW50LmNyZWF0ZSh7IC4uLmFyZywgY29lcmNlOiB0cnVlIH0pKSxcbiAgICBkYXRlOiAoKGFyZykgPT4gWm9kRGF0ZS5jcmVhdGUoeyAuLi5hcmcsIGNvZXJjZTogdHJ1ZSB9KSksXG59O1xuZXhwb3J0IHsgYW55VHlwZSBhcyBhbnksIGFycmF5VHlwZSBhcyBhcnJheSwgYmlnSW50VHlwZSBhcyBiaWdpbnQsIGJvb2xlYW5UeXBlIGFzIGJvb2xlYW4sIGRhdGVUeXBlIGFzIGRhdGUsIGRpc2NyaW1pbmF0ZWRVbmlvblR5cGUgYXMgZGlzY3JpbWluYXRlZFVuaW9uLCBlZmZlY3RzVHlwZSBhcyBlZmZlY3QsIGVudW1UeXBlIGFzIGVudW0sIGZ1bmN0aW9uVHlwZSBhcyBmdW5jdGlvbiwgaW5zdGFuY2VPZlR5cGUgYXMgaW5zdGFuY2VvZiwgaW50ZXJzZWN0aW9uVHlwZSBhcyBpbnRlcnNlY3Rpb24sIGxhenlUeXBlIGFzIGxhenksIGxpdGVyYWxUeXBlIGFzIGxpdGVyYWwsIG1hcFR5cGUgYXMgbWFwLCBuYW5UeXBlIGFzIG5hbiwgbmF0aXZlRW51bVR5cGUgYXMgbmF0aXZlRW51bSwgbmV2ZXJUeXBlIGFzIG5ldmVyLCBudWxsVHlwZSBhcyBudWxsLCBudWxsYWJsZVR5cGUgYXMgbnVsbGFibGUsIG51bWJlclR5cGUgYXMgbnVtYmVyLCBvYmplY3RUeXBlIGFzIG9iamVjdCwgb2Jvb2xlYW4sIG9udW1iZXIsIG9wdGlvbmFsVHlwZSBhcyBvcHRpb25hbCwgb3N0cmluZywgcGlwZWxpbmVUeXBlIGFzIHBpcGVsaW5lLCBwcmVwcm9jZXNzVHlwZSBhcyBwcmVwcm9jZXNzLCBwcm9taXNlVHlwZSBhcyBwcm9taXNlLCByZWNvcmRUeXBlIGFzIHJlY29yZCwgc2V0VHlwZSBhcyBzZXQsIHN0cmljdE9iamVjdFR5cGUgYXMgc3RyaWN0T2JqZWN0LCBzdHJpbmdUeXBlIGFzIHN0cmluZywgc3ltYm9sVHlwZSBhcyBzeW1ib2wsIGVmZmVjdHNUeXBlIGFzIHRyYW5zZm9ybWVyLCB0dXBsZVR5cGUgYXMgdHVwbGUsIHVuZGVmaW5lZFR5cGUgYXMgdW5kZWZpbmVkLCB1bmlvblR5cGUgYXMgdW5pb24sIHVua25vd25UeXBlIGFzIHVua25vd24sIHZvaWRUeXBlIGFzIHZvaWQsIH07XG5leHBvcnQgY29uc3QgTkVWRVIgPSBJTlZBTElEO1xuIiwiaW1wb3J0IHR5cGUge1xuICBTbmFwc2hvdFBheWxvYWQsXG4gIFNuYXBzaG90RGF0YSxcbiAgQ2xpY2tQYXlsb2FkLFxuICBTY3JvbGxQYXlsb2FkLFxuICBXYWl0Rm9yU2VsZWN0b3JQYXlsb2FkLFxuICBOYXZpZ2F0ZVBheWxvYWQsXG4gIFR5cGVQYXlsb2FkLFxuICBIb3ZlclBheWxvYWQsXG4gIEZpbmRQYXlsb2FkLFxuICBGaW5kUmVzcG9uc2UsXG4gIFNjcm9sbFJlc3BvbnNlLFxuICBDbGlja1Jlc3BvbnNlLFxuICBIb3ZlclJlc3BvbnNlLFxuICBUeXBlUmVzcG9uc2UsXG4gIE5hdmlnYXRlUmVzcG9uc2UsXG4gIFdhaXRGb3JTZWxlY3RvclJlc3BvbnNlLFxuICBIaXN0b3J5UmVzcG9uc2UsXG4gIEVudGVyUGF5bG9hZCxcbiAgRW50ZXJSZXNwb25zZSxcbiAgU2VsZWN0UGF5bG9hZCxcbiAgU2VsZWN0UmVzcG9uc2UsXG4gIFNjcmVlbnNob3RQYXlsb2FkLFxuICBTY3JlZW5zaG90UHJlcFJlc3BvbnNlLFxufSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNsaWNrQWN0aW9uKHBheWxvYWQ6IENsaWNrUGF5bG9hZCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBDbGlja1Jlc3BvbnNlOyBlcnJvcj86IHN0cmluZzsgZXJyb3JDb2RlPzogc3RyaW5nIH0ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGF5bG9hZC5zZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0VsZW1lbnQgbm90IGZvdW5kJywgZXJyb3JDb2RlOiAnRUxFTUVOVF9OT1RfRk9VTkQnIH07XG4gIH1cbiAgZWwuc2Nyb2xsSW50b1ZpZXcoeyBibG9jazogJ2NlbnRlcicsIGlubGluZTogJ2NlbnRlcicsIGJlaGF2aW9yOiAnYXV0bycgfSk7XG4gIGVsLmNsaWNrKCk7XG4gIHJldHVybiB7IG9rOiB0cnVlLCBkYXRhOiB7IHNlbGVjdG9yOiBwYXlsb2FkLnNlbGVjdG9yIH0gfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNuYXBzaG90QWN0aW9uKGlucHV0OiBTbmFwc2hvdFBheWxvYWQpOiBTbmFwc2hvdERhdGEge1xuICBjb25zdCBtYXhUZXh0ID0gaW5wdXQubWF4VGV4dCA/PyAxMDAwMDtcbiAgY29uc3QgbWF4RWxlbWVudHMgPSBpbnB1dC5tYXhFbGVtZW50cyA/PyAxNTA7XG4gIGNvbnN0IGluY2x1ZGVIaWRkZW4gPSBpbnB1dC5pbmNsdWRlSGlkZGVuID8/IGZhbHNlO1xuICBjb25zdCBpbmNsdWRlSFRNTCA9IGlucHV0LmluY2x1ZGVIVE1MID8/IGZhbHNlO1xuICBjb25zdCBtYXhIVE1MID0gaW5wdXQubWF4SFRNTCA/PyAyMDAwMDtcbiAgY29uc3QgbWF4SFRNTFRva2VucyA9IGlucHV0Lm1heEhUTUxUb2tlbnMgPz8gMDtcblxuICBjb25zdCBlbGVtZW50cyA9IGNvbGxlY3RFbGVtZW50cyhtYXhFbGVtZW50cywgaW5jbHVkZUhpZGRlbik7XG4gIGNvbnN0IHRleHQgPSBjb2xsZWN0VGV4dChtYXhUZXh0KTtcbiAgY29uc3QgZnVsbFRleHQgPSBkb2N1bWVudC5ib2R5Py5pbm5lclRleHQgPz8gJyc7XG4gIGNvbnN0IG5vcm1hbGl6ZWRGdWxsVGV4dCA9IGZ1bGxUZXh0LnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gIGNvbnN0IHRydW5jYXRlZFRleHQgPSBub3JtYWxpemVkRnVsbFRleHQubGVuZ3RoID4gdGV4dC5sZW5ndGg7XG4gIGNvbnN0IHRvdGFsQWN0aW9uYWJsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICdhLGJ1dHRvbixpbnB1dCxzZWxlY3QsdGV4dGFyZWEsW3JvbGU9XFxcImJ1dHRvblxcXCJdLFtyb2xlPVxcXCJsaW5rXFxcIl0nXG4gICkubGVuZ3RoO1xuICBjb25zdCB0cnVuY2F0ZWRFbGVtZW50cyA9IHRvdGFsQWN0aW9uYWJsZXMgPiBlbGVtZW50cy5sZW5ndGg7XG4gIGxldCBodG1sOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGxldCBodG1sTGVuZ3RoOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIGxldCB0cnVuY2F0ZWRIVE1MOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBsZXQgaHRtbEVzdGltYXRlZFRva2VuczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBpZiAoaW5jbHVkZUhUTUwpIHtcbiAgICBjb25zdCByYXdIVE1MID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50Py5vdXRlckhUTUwgfHwgJyc7XG4gICAgaHRtbExlbmd0aCA9IHJhd0hUTUwubGVuZ3RoO1xuICAgIGh0bWxFc3RpbWF0ZWRUb2tlbnMgPSBlc3RpbWF0ZVRva2VucyhyYXdIVE1MKTtcbiAgICBsZXQgbGltaXRCeVRva2VucyA9IG1heEhUTUw7XG4gICAgaWYgKG1heEhUTUxUb2tlbnMgPiAwKSB7XG4gICAgICBsaW1pdEJ5VG9rZW5zID0gTWF0aC5taW4obGltaXRCeVRva2VucywgbWF4SFRNTFRva2VucyAqIDQpO1xuICAgIH1cbiAgICBpZiAocmF3SFRNTC5sZW5ndGggPiBsaW1pdEJ5VG9rZW5zKSB7XG4gICAgICBodG1sID0gcmF3SFRNTC5zbGljZSgwLCBsaW1pdEJ5VG9rZW5zKSArICfigKYnO1xuICAgICAgdHJ1bmNhdGVkSFRNTCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0bWwgPSByYXdIVE1MO1xuICAgICAgdHJ1bmNhdGVkSFRNTCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICB0aXRsZTogZG9jdW1lbnQudGl0bGUsXG4gICAgdGV4dCxcbiAgICBodG1sLFxuICAgIGVsZW1lbnRzLFxuICAgIGVsZW1lbnRDb3VudDogdG90YWxBY3Rpb25hYmxlcyxcbiAgICB0ZXh0TGVuZ3RoOiBub3JtYWxpemVkRnVsbFRleHQubGVuZ3RoLFxuICAgIHRydW5jYXRlZFRleHQsXG4gICAgdHJ1bmNhdGVkRWxlbWVudHMsXG4gICAgaHRtbExlbmd0aCxcbiAgICB0cnVuY2F0ZWRIVE1MLFxuICAgIGh0bWxFc3RpbWF0ZWRUb2tlbnMsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGVzdGltYXRlVG9rZW5zKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XG4gIC8vIFJvdWdoIGhldXJpc3RpYzogfjQgY2hhcnMgcGVyIHRva2VuIGZvciBFbmdsaXNoL0hUTUwuXG4gIHJldHVybiBNYXRoLmNlaWwodGV4dC5sZW5ndGggLyA0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbEFjdGlvbihwYXlsb2FkOiBTY3JvbGxQYXlsb2FkKTogeyBvazogYm9vbGVhbjsgZGF0YT86IFNjcm9sbFJlc3BvbnNlOyBlcnJvcj86IHN0cmluZzsgZXJyb3JDb2RlPzogc3RyaW5nIH0ge1xuICBjb25zdCBkZWx0YVggPSBwYXlsb2FkLmRlbHRhWCA/PyAwO1xuICBjb25zdCBkZWx0YVkgPSBwYXlsb2FkLmRlbHRhWSA/PyAwO1xuICBjb25zdCBiZWhhdmlvciA9IHBheWxvYWQuYmVoYXZpb3IgPz8gJ2F1dG8nO1xuICBjb25zdCBibG9jayA9IHBheWxvYWQuYmxvY2sgPz8gJ2NlbnRlcic7XG4gIGlmIChwYXlsb2FkLnNlbGVjdG9yKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBheWxvYWQuc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAoIWVsKSB7XG4gICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnRWxlbWVudCBub3QgZm91bmQnLCBlcnJvckNvZGU6ICdFTEVNRU5UX05PVF9GT1VORCcgfTtcbiAgICB9XG4gICAgZWwuc2Nyb2xsSW50b1ZpZXcoeyBibG9jaywgaW5saW5lOiAnY2VudGVyJywgYmVoYXZpb3IgfSk7XG4gICAgaWYgKHR5cGVvZiAoZWwgYXMgYW55KS5zY3JvbGxCeSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgKGVsIGFzIGFueSkuc2Nyb2xsQnkoZGVsdGFYLCBkZWx0YVkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cuc2Nyb2xsQnkoZGVsdGFYLCBkZWx0YVkpO1xuICAgIH1cbiAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YTogeyBkZWx0YVgsIGRlbHRhWSwgc2VsZWN0b3I6IHBheWxvYWQuc2VsZWN0b3IsIGJlaGF2aW9yLCBibG9jayB9IH07XG4gIH1cbiAgd2luZG93LnNjcm9sbEJ5KGRlbHRhWCwgZGVsdGFZKTtcbiAgcmV0dXJuIHsgb2s6IHRydWUsIGRhdGE6IHsgZGVsdGFYLCBkZWx0YVksIGJlaGF2aW9yLCBibG9jayB9IH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YWl0Rm9yU2VsZWN0b3JBY3Rpb24ocGF5bG9hZDogV2FpdEZvclNlbGVjdG9yUGF5bG9hZCk6IFByb21pc2U8eyBvazogYm9vbGVhbjsgZGF0YT86IFdhaXRGb3JTZWxlY3RvclJlc3BvbnNlOyBlcnJvcj86IHN0cmluZzsgZXJyb3JDb2RlPzogc3RyaW5nIH0+IHtcbiAgY29uc3Qgc2VsZWN0b3IgPSBwYXlsb2FkLnNlbGVjdG9yO1xuICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IG9rOiBmYWxzZSwgZXJyb3I6ICdzZWxlY3RvciBpcyByZXF1aXJlZCcsIGVycm9yQ29kZTogJ0lOVkFMSURfSU5QVVQnIH0pO1xuICB9XG4gIGNvbnN0IHRpbWVvdXRNcyA9IHBheWxvYWQudGltZW91dE1zID8/IDUwMDA7XG5cbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IG9rOiB0cnVlLCBkYXRhOiB7IHNlbGVjdG9yLCB0aW1lb3V0TXMsIGZvdW5kOiB0cnVlIH0gfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2U8eyBvazogYm9vbGVhbjsgZXJyb3I/OiBzdHJpbmcgfT4oKHJlc29sdmUpID0+IHtcbiAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgIGxldCB0aW1lcjogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZmluaXNoID0gKHZhbHVlOiB7IG9rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZyB9KSA9PiB7XG4gICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBpZiAodGltZXIpIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgaWYgKHZhbHVlLm9rKSB7XG4gICAgICAgIHJlc29sdmUoeyBvazogdHJ1ZSwgZGF0YTogeyBzZWxlY3RvciwgdGltZW91dE1zLCBmb3VuZDogdHJ1ZSB9IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZSh7IG9rOiBmYWxzZSwgZXJyb3I6IHZhbHVlLmVycm9yIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSkge1xuICAgICAgICBmaW5pc2goeyBvazogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHksIHtcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVzb2x2ZSh7XG4gICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IGBUaW1lZCBvdXQgd2FpdGluZyBmb3Igc2VsZWN0b3I6ICR7c2VsZWN0b3J9YCxcbiAgICAgICAgZXJyb3JDb2RlOiAnVElNRU9VVCcsXG4gICAgICAgIGRhdGE6IHsgc2VsZWN0b3IsIHRpbWVvdXRNcywgZm91bmQ6IGZhbHNlIH0sXG4gICAgICB9KTtcbiAgICB9LCB0aW1lb3V0TXMpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlQWN0aW9uKHBheWxvYWQ6IE5hdmlnYXRlUGF5bG9hZCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBOYXZpZ2F0ZVJlc3BvbnNlOyBlcnJvcj86IHN0cmluZzsgZXJyb3JDb2RlPzogc3RyaW5nIH0ge1xuICBpZiAoIXBheWxvYWQudXJsKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ3VybCBpcyByZXF1aXJlZCcsIGVycm9yQ29kZTogJ0lOVkFMSURfSU5QVVQnIH07XG4gIH1cbiAgdHJ5IHtcbiAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHBheWxvYWQudXJsKTtcbiAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YTogeyB1cmw6IHBheWxvYWQudXJsIH0gfTtcbiAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBlcnI/Lm1lc3NhZ2UgfHwgJ05hdmlnYXRpb24gZmFpbGVkJyB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiYWNrQWN0aW9uKCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBIaXN0b3J5UmVzcG9uc2U7IGVycm9yPzogc3RyaW5nIH0ge1xuICB0cnkge1xuICAgIHdpbmRvdy5oaXN0b3J5LmJhY2soKTtcbiAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YTogeyBkaXJlY3Rpb246ICdiYWNrJyB9IH07XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogZXJyPy5tZXNzYWdlIHx8ICdCYWNrIG5hdmlnYXRpb24gZmFpbGVkJyB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3J3YXJkQWN0aW9uKCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBIaXN0b3J5UmVzcG9uc2U7IGVycm9yPzogc3RyaW5nIH0ge1xuICB0cnkge1xuICAgIHdpbmRvdy5oaXN0b3J5LmZvcndhcmQoKTtcbiAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YTogeyBkaXJlY3Rpb246ICdmb3J3YXJkJyB9IH07XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogZXJyPy5tZXNzYWdlIHx8ICdGb3J3YXJkIG5hdmlnYXRpb24gZmFpbGVkJyB9O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBob3ZlckFjdGlvbihwYXlsb2FkOiBIb3ZlclBheWxvYWQpOiB7IG9rOiBib29sZWFuOyBkYXRhPzogSG92ZXJSZXNwb25zZTsgZXJyb3I/OiBzdHJpbmc7IGVycm9yQ29kZT86IHN0cmluZyB9IHtcbiAgaWYgKCFwYXlsb2FkLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ3NlbGVjdG9yIGlzIHJlcXVpcmVkJywgZXJyb3JDb2RlOiAnSU5WQUxJRF9JTlBVVCcgfTtcbiAgfVxuICBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGF5bG9hZC5zZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0VsZW1lbnQgbm90IGZvdW5kJywgZXJyb3JDb2RlOiAnRUxFTUVOVF9OT1RfRk9VTkQnIH07XG4gIH1cbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBjbGllbnRYID0gcmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDI7XG4gIGNvbnN0IGNsaWVudFkgPSByZWN0LnRvcCArIHJlY3QuaGVpZ2h0IC8gMjtcbiAgY29uc3QgZXZlbnRJbml0OiBNb3VzZUV2ZW50SW5pdCA9IHtcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWUsXG4gICAgY2xpZW50WCxcbiAgICBjbGllbnRZLFxuICAgIHZpZXc6IHdpbmRvdyxcbiAgfTtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnbW91c2VvdmVyJywgZXZlbnRJbml0KSk7XG4gIGVsLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoJ21vdXNlZW50ZXInLCBldmVudEluaXQpKTtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnbW91c2Vtb3ZlJywgZXZlbnRJbml0KSk7XG4gIHJldHVybiB7IG9rOiB0cnVlLCBkYXRhOiB7IHNlbGVjdG9yOiBwYXlsb2FkLnNlbGVjdG9yIH0gfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRBY3Rpb24ocGF5bG9hZDogRmluZFBheWxvYWQpOiB7IG9rOiBib29sZWFuOyBkYXRhPzogRmluZFJlc3BvbnNlOyBlcnJvcj86IHN0cmluZyB9IHtcbiAgY29uc3QgcXVlcnkgPSBwYXlsb2FkLnRleHQ/LnRyaW0oKTtcbiAgaWYgKCFxdWVyeSkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICd0ZXh0IGlzIHJlcXVpcmVkJyB9O1xuICB9XG4gIGNvbnN0IHJhdyA9IGRvY3VtZW50LmJvZHk/LmlubmVyVGV4dCB8fCBkb2N1bWVudC5ib2R5Py50ZXh0Q29udGVudCB8fCAnJztcbiAgY29uc3QgaGF5ID0gcmF3LnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG4gIGNvbnN0IGxpbWl0ID0gTWF0aC5tYXgoMSwgcGF5bG9hZC5saW1pdCA/PyA1MCk7XG4gIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KDEwLCBwYXlsb2FkLnJhZGl1cyA/PyA0MCk7XG4gIGNvbnN0IGNhc2VTZW5zaXRpdmUgPSBwYXlsb2FkLmNhc2VTZW5zaXRpdmUgPz8gZmFsc2U7XG4gIGlmICghaGF5KSB7XG4gICAgcmV0dXJuIHsgb2s6IHRydWUsIGRhdGE6IHsgcXVlcnksIGxpbWl0LCByYWRpdXMsIGNhc2VTZW5zaXRpdmUsIHRvdGFsOiAwLCByZXR1cm5lZDogMCwgcmVzdWx0czogW10gfSB9O1xuICB9XG5cbiAgY29uc3QgcmVzdWx0czogRmluZFJlc3BvbnNlWydyZXN1bHRzJ10gPSBbXTtcbiAgY29uc3Qgc291cmNlSGF5ID0gY2FzZVNlbnNpdGl2ZSA/IGhheSA6IGhheS50b0xvd2VyQ2FzZSgpO1xuICBjb25zdCBzb3VyY2VRdWVyeSA9IGNhc2VTZW5zaXRpdmUgPyBxdWVyeSA6IHF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gIGxldCBpZHggPSAwO1xuICBsZXQgY291bnQgPSAwO1xuXG4gIHdoaWxlICgoaWR4ID0gc291cmNlSGF5LmluZGV4T2Yoc291cmNlUXVlcnksIGlkeCkpICE9PSAtMSkge1xuICAgIGNvdW50ICs9IDE7XG4gICAgY29uc3Qgc3RhcnQgPSBNYXRoLm1heCgwLCBpZHggLSByYWRpdXMpO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKGhheS5sZW5ndGgsIGlkeCArIHF1ZXJ5Lmxlbmd0aCArIHJhZGl1cyk7XG4gICAgbGV0IHNuaXBwZXQgPSBoYXkuc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgaWYgKHN0YXJ0ID4gMCkgc25pcHBldCA9ICfigKYnICsgc25pcHBldDtcbiAgICBpZiAoZW5kIDwgaGF5Lmxlbmd0aCkgc25pcHBldCA9IHNuaXBwZXQgKyAn4oCmJztcblxuICAgIGlmIChyZXN1bHRzLmxlbmd0aCA8IGxpbWl0KSB7XG4gICAgICByZXN1bHRzLnB1c2goeyBpbmRleDogaWR4LCBzbmlwcGV0IH0pO1xuICAgIH1cbiAgICBpZHggPSBpZHggKyBzb3VyY2VRdWVyeS5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9rOiB0cnVlLFxuICAgIGRhdGE6IHtcbiAgICAgIHF1ZXJ5LFxuICAgICAgbGltaXQsXG4gICAgICByYWRpdXMsXG4gICAgICBjYXNlU2Vuc2l0aXZlLFxuICAgICAgdG90YWw6IGNvdW50LFxuICAgICAgcmV0dXJuZWQ6IHJlc3VsdHMubGVuZ3RoLFxuICAgICAgcmVzdWx0cyxcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUFjdGlvbihwYXlsb2FkOiBUeXBlUGF5bG9hZCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBUeXBlUmVzcG9uc2U7IGVycm9yPzogc3RyaW5nOyBlcnJvckNvZGU/OiBzdHJpbmcgfSB7XG4gIGNvbnN0IHsgc2VsZWN0b3IsIHRleHQsIHByZXNzRW50ZXIgfSA9IHBheWxvYWQ7XG4gIGlmICghc2VsZWN0b3IpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnc2VsZWN0b3IgaXMgcmVxdWlyZWQnLCBlcnJvckNvZGU6ICdJTlZBTElEX0lOUFVUJyB9O1xuICB9XG4gIGNvbnN0IGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0VsZW1lbnQgbm90IGZvdW5kJywgZXJyb3JDb2RlOiAnRUxFTUVOVF9OT1RfRk9VTkQnIH07XG4gIH1cbiAgY29uc3QgaW5wdXQgPSBlbCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgaWYgKHR5cGVvZiBpbnB1dC5mb2N1cyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGlucHV0LmZvY3VzKCk7XG4gIH1cbiAgaWYgKCd2YWx1ZScgaW4gaW5wdXQpIHtcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihpbnB1dCk7XG4gICAgY29uc3QgdmFsdWVTZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCAndmFsdWUnKT8uc2V0O1xuICAgIGlmICh2YWx1ZVNldHRlcikge1xuICAgICAgdmFsdWVTZXR0ZXIuY2FsbChpbnB1dCwgdGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIChpbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IHRleHQ7XG4gICAgfVxuICAgIGlucHV0LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdpbnB1dCcsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgaW5wdXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZScsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgaWYgKHByZXNzRW50ZXIpIHtcbiAgICAgIGNvbnN0IGRvd24gPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHsga2V5OiAnRW50ZXInLCBjb2RlOiAnRW50ZXInLCBidWJibGVzOiB0cnVlIH0pO1xuICAgICAgY29uc3QgdXAgPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5dXAnLCB7IGtleTogJ0VudGVyJywgY29kZTogJ0VudGVyJywgYnViYmxlczogdHJ1ZSB9KTtcbiAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQoZG93bik7XG4gICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KHVwKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgb2s6IHRydWUsIGRhdGE6IHsgc2VsZWN0b3IsIHRleHRMZW5ndGg6IHRleHQubGVuZ3RoLCBwcmVzc0VudGVyOiAhIXByZXNzRW50ZXIgfSB9O1xuICB9XG4gIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdFbGVtZW50IGlzIG5vdCBhIHRleHQgaW5wdXQnLCBlcnJvckNvZGU6ICdJTlZBTElEX1RBUkdFVCcgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVudGVyQWN0aW9uKHBheWxvYWQ6IEVudGVyUGF5bG9hZCk6IHsgb2s6IGJvb2xlYW47IGRhdGE/OiBFbnRlclJlc3BvbnNlOyBlcnJvcj86IHN0cmluZzsgZXJyb3JDb2RlPzogc3RyaW5nIH0ge1xuICBjb25zdCBrZXkgPSBwYXlsb2FkLmtleSAmJiBwYXlsb2FkLmtleS50cmltKCkgPyBwYXlsb2FkLmtleSA6ICdFbnRlcic7XG4gIGxldCBlbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgbGV0IHVzZWRBY3RpdmVFbGVtZW50ID0gZmFsc2U7XG5cbiAgaWYgKHBheWxvYWQuc2VsZWN0b3IpIHtcbiAgICBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocGF5bG9hZC5zZWxlY3RvcikgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIGlmICghZWwpIHtcbiAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdFbGVtZW50IG5vdCBmb3VuZCcsIGVycm9yQ29kZTogJ0VMRU1FTlRfTk9UX0ZPVU5EJyB9O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgIHVzZWRBY3RpdmVFbGVtZW50ID0gdHJ1ZTtcbiAgICBpZiAoIWVsIHx8IGVsID09PSBkb2N1bWVudC5ib2R5IHx8IGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdObyBhY3RpdmUgZWxlbWVudCB0byBzZW5kIGtleScsIGVycm9yQ29kZTogJ05PX0FDVElWRV9FTEVNRU5UJyB9O1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlb2YgZWwuZm9jdXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBlbC5mb2N1cygpO1xuICB9XG4gIGNvbnN0IGRvd24gPSBuZXcgS2V5Ym9hcmRFdmVudCgna2V5ZG93bicsIHsga2V5LCBjb2RlOiBrZXksIGJ1YmJsZXM6IHRydWUgfSk7XG4gIGNvbnN0IHVwID0gbmV3IEtleWJvYXJkRXZlbnQoJ2tleXVwJywgeyBrZXksIGNvZGU6IGtleSwgYnViYmxlczogdHJ1ZSB9KTtcbiAgZWwuZGlzcGF0Y2hFdmVudChkb3duKTtcbiAgZWwuZGlzcGF0Y2hFdmVudCh1cCk7XG5cbiAgcmV0dXJuIHsgb2s6IHRydWUsIGRhdGE6IHsgc2VsZWN0b3I6IHBheWxvYWQuc2VsZWN0b3IsIGtleSwgdXNlZEFjdGl2ZUVsZW1lbnQgfSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0QWN0aW9uKHBheWxvYWQ6IFNlbGVjdFBheWxvYWQpOiB7IG9rOiBib29sZWFuOyBkYXRhPzogU2VsZWN0UmVzcG9uc2U7IGVycm9yPzogc3RyaW5nOyBlcnJvckNvZGU/OiBzdHJpbmcgfSB7XG4gIGlmICghcGF5bG9hZC5zZWxlY3Rvcikge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdzZWxlY3RvciBpcyByZXF1aXJlZCcsIGVycm9yQ29kZTogJ0lOVkFMSURfSU5QVVQnIH07XG4gIH1cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBheWxvYWQuc2VsZWN0b3IpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdFbGVtZW50IG5vdCBmb3VuZCcsIGVycm9yQ29kZTogJ0VMRU1FTlRfTk9UX0ZPVU5EJyB9O1xuICB9XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzZWxlY3QnKSB7XG4gICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ0VsZW1lbnQgaXMgbm90IGEgc2VsZWN0JywgZXJyb3JDb2RlOiAnSU5WQUxJRF9UQVJHRVQnIH07XG4gIH1cblxuICBjb25zdCB0YXJnZXRzID0gcmVzb2x2ZVRhcmdldHMoZWwsIHBheWxvYWQpO1xuICBpZiAoIXRhcmdldHMub2spIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiB0YXJnZXRzLmVycm9yIHx8ICdvcHRpb24gbm90IGZvdW5kJywgZXJyb3JDb2RlOiAnT1BUSU9OX05PVF9GT1VORCcgfTtcbiAgfVxuXG4gIGNvbnN0IHsgaW5kaWNlcyB9ID0gdGFyZ2V0cztcblxuICBpZiAoZWwubXVsdGlwbGUpIHtcbiAgICBpZiAocGF5bG9hZC50b2dnbGUpIHtcbiAgICAgIEFycmF5LmZyb20oZWwub3B0aW9ucykuZm9yRWFjaCgob3B0LCBpZHgpID0+IHtcbiAgICAgICAgaWYgKGluZGljZXMuaW5jbHVkZXMoaWR4KSkge1xuICAgICAgICAgIG9wdC5zZWxlY3RlZCA9ICFvcHQuc2VsZWN0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBBcnJheS5mcm9tKGVsLm9wdGlvbnMpLmZvckVhY2goKG9wdCwgaWR4KSA9PiB7XG4gICAgICAgIG9wdC5zZWxlY3RlZCA9IGluZGljZXMuaW5jbHVkZXMoaWR4KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBpZHggPSBpbmRpY2VzWzBdO1xuICAgIGVsLnNlbGVjdGVkSW5kZXggPSBpZHg7XG4gICAgZWwudmFsdWUgPSBlbC5vcHRpb25zW2lkeF0udmFsdWU7XG4gIH1cblxuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaW5wdXQnLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJywgeyBidWJibGVzOiB0cnVlIH0pKTtcblxuICBjb25zdCBzZWxlY3RlZCA9IGdldFNlbGVjdGVkKGVsKTtcbiAgY29uc3QgcmVzcG9uc2U6IFNlbGVjdFJlc3BvbnNlID0ge1xuICAgIHNlbGVjdG9yOiBwYXlsb2FkLnNlbGVjdG9yLFxuICAgIHZhbHVlOiBzZWxlY3RlZC52YWx1ZXNbMF0gPz8gJycsXG4gICAgbGFiZWw6IHNlbGVjdGVkLmxhYmVsc1swXSxcbiAgICBpbmRleDogc2VsZWN0ZWQuaW5kaWNlc1swXSxcbiAgICBtYXRjaE1vZGU6IHBheWxvYWQubWF0Y2hNb2RlID8/ICdleGFjdCcsXG4gICAgdG9nZ2xlOiBwYXlsb2FkLnRvZ2dsZSA/PyBmYWxzZSxcbiAgICBtdWx0aXBsZTogZWwubXVsdGlwbGUsXG4gICAgc2VsZWN0ZWRDb3VudDogc2VsZWN0ZWQuaW5kaWNlcy5sZW5ndGgsXG4gIH07XG4gIGlmIChlbC5tdWx0aXBsZSkge1xuICAgIHJlc3BvbnNlLnZhbHVlcyA9IHNlbGVjdGVkLnZhbHVlcztcbiAgICByZXNwb25zZS5sYWJlbHMgPSBzZWxlY3RlZC5sYWJlbHM7XG4gICAgcmVzcG9uc2UuaW5kaWNlcyA9IHNlbGVjdGVkLmluZGljZXM7XG4gIH1cblxuICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YTogcmVzcG9uc2UgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNjcmVlbnNob3RQcmVwQWN0aW9uKFxuICBwYXlsb2FkOiBTY3JlZW5zaG90UGF5bG9hZFxuKTogUHJvbWlzZTx7IG9rOiBib29sZWFuOyBkYXRhPzogU2NyZWVuc2hvdFByZXBSZXNwb25zZTsgZXJyb3I/OiBzdHJpbmc7IGVycm9yQ29kZT86IHN0cmluZyB9PiB7XG4gIGNvbnN0IHBhZGRpbmcgPSBwYXlsb2FkLnBhZGRpbmcgPz8gMDtcbiAgaWYgKCFwYXlsb2FkLnNlbGVjdG9yKSB7XG4gICAgY29uc3Qgd2lkdGggPSBNYXRoLm1heCgwLCB3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoMCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBpZiAod2lkdGggPT09IDAgfHwgaGVpZ2h0ID09PSAwKSB7XG4gICAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnVmlld3BvcnQgaGFzIHplcm8gc2l6ZScsIGVycm9yQ29kZTogJ0lOVkFMSURfVEFSR0VUJyB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgb2s6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHNlbGVjdG9yOiAndmlld3BvcnQnLFxuICAgICAgICByZWN0OiB7IHg6IDAsIHk6IDAsIHdpZHRoLCBoZWlnaHQgfSxcbiAgICAgICAgZHByOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBheWxvYWQuc2VsZWN0b3IpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcbiAgaWYgKCFlbCkge1xuICAgIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdFbGVtZW50IG5vdCBmb3VuZCcsIGVycm9yQ29kZTogJ0VMRU1FTlRfTk9UX0ZPVU5EJyB9O1xuICB9XG4gIGVsLnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdjZW50ZXInLCBpbmxpbmU6ICdjZW50ZXInLCBiZWhhdmlvcjogJ2F1dG8nIH0pO1xuICBhd2FpdCBuZXcgUHJvbWlzZSgocikgPT4gc2V0VGltZW91dChyLCA1MCkpO1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IHggPSBNYXRoLm1heCgwLCByZWN0LmxlZnQgLSBwYWRkaW5nKTtcbiAgY29uc3QgeSA9IE1hdGgubWF4KDAsIHJlY3QudG9wIC0gcGFkZGluZyk7XG4gIGNvbnN0IHdpZHRoID0gTWF0aC5tYXgoMCwgcmVjdC53aWR0aCArIHBhZGRpbmcgKiAyKTtcbiAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoMCwgcmVjdC5oZWlnaHQgKyBwYWRkaW5nICogMik7XG4gIGlmICh3aWR0aCA9PT0gMCB8fCBoZWlnaHQgPT09IDApIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnRWxlbWVudCBoYXMgemVybyBzaXplJywgZXJyb3JDb2RlOiAnSU5WQUxJRF9UQVJHRVQnIH07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvazogdHJ1ZSxcbiAgICBkYXRhOiB7XG4gICAgICBzZWxlY3RvcjogcGF5bG9hZC5zZWxlY3RvcixcbiAgICAgIHJlY3Q6IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9LFxuICAgICAgZHByOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLFxuICAgIH0sXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVUYXJnZXRzKGVsOiBIVE1MU2VsZWN0RWxlbWVudCwgcGF5bG9hZDogU2VsZWN0UGF5bG9hZCk6IHsgb2s6IGJvb2xlYW47IGVycm9yPzogc3RyaW5nOyBpbmRpY2VzOiBudW1iZXJbXTsgdmFsdWVzOiBzdHJpbmdbXTsgbGFiZWxzOiBzdHJpbmdbXSB9IHtcbiAgY29uc3Qgb3B0aW9ucyA9IEFycmF5LmZyb20oZWwub3B0aW9ucyk7XG4gIGxldCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICBjb25zdCBtYXRjaE1vZGUgPSBwYXlsb2FkLm1hdGNoTW9kZSA/PyAnZXhhY3QnO1xuXG4gIGlmIChwYXlsb2FkLmluZGljZXMgJiYgcGF5bG9hZC5pbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICBpbmRpY2VzID0gcGF5bG9hZC5pbmRpY2VzLnNsaWNlKCk7XG4gIH0gZWxzZSBpZiAocGF5bG9hZC52YWx1ZXMgJiYgcGF5bG9hZC52YWx1ZXMubGVuZ3RoID4gMCkge1xuICAgIGluZGljZXMgPSBwYXlsb2FkLnZhbHVlc1xuICAgICAgLm1hcCgodmFsKSA9PiBvcHRpb25zLmZpbmRJbmRleCgob3B0KSA9PiBvcHQudmFsdWUgPT09IHZhbCkpXG4gICAgICAuZmlsdGVyKChpZHgpID0+IGlkeCA+PSAwKTtcbiAgfSBlbHNlIGlmIChwYXlsb2FkLmxhYmVscyAmJiBwYXlsb2FkLmxhYmVscy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgd2FudGVkID0gcGF5bG9hZC5sYWJlbHMubWFwKChsKSA9PiBsLnRvTG93ZXJDYXNlKCkpO1xuICAgIGluZGljZXMgPSB3YW50ZWRcbiAgICAgIC5tYXAoKGxhYikgPT4gZmluZExhYmVsSW5kZXgob3B0aW9ucywgbGFiLCBtYXRjaE1vZGUpKVxuICAgICAgLmZpbHRlcigoaWR4KSA9PiBpZHggPj0gMCk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHBheWxvYWQuaW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgaW5kaWNlcyA9IFtwYXlsb2FkLmluZGV4XTtcbiAgfSBlbHNlIGlmIChwYXlsb2FkLnZhbHVlKSB7XG4gICAgY29uc3QgaWR4ID0gb3B0aW9ucy5maW5kSW5kZXgoKG9wdCkgPT4gb3B0LnZhbHVlID09PSBwYXlsb2FkLnZhbHVlKTtcbiAgICBpZiAoaWR4ID49IDApIGluZGljZXMgPSBbaWR4XTtcbiAgfSBlbHNlIGlmIChwYXlsb2FkLmxhYmVsKSB7XG4gICAgY29uc3QgbGFiID0gcGF5bG9hZC5sYWJlbC50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGlkeCA9IGZpbmRMYWJlbEluZGV4KG9wdGlvbnMsIGxhYiwgbWF0Y2hNb2RlKTtcbiAgICBpZiAoaWR4ID49IDApIGluZGljZXMgPSBbaWR4XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAndmFsdWUsIGxhYmVsLCBvciBpbmRleCBpcyByZXF1aXJlZCcsIGluZGljZXM6IFtdLCB2YWx1ZXM6IFtdLCBsYWJlbHM6IFtdIH07XG4gIH1cblxuICBpbmRpY2VzID0gaW5kaWNlcy5maWx0ZXIoKGlkeCwgcG9zLCBhcnIpID0+IGlkeCA+PSAwICYmIGlkeCA8IG9wdGlvbnMubGVuZ3RoICYmIGFyci5pbmRleE9mKGlkeCkgPT09IHBvcyk7XG5cbiAgaWYgKGluZGljZXMubGVuZ3RoID09IDApIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnb3B0aW9uIG5vdCBmb3VuZCcsIGluZGljZXM6IFtdLCB2YWx1ZXM6IFtdLCBsYWJlbHM6IFtdIH07XG4gIH1cblxuICBjb25zdCB2YWx1ZXMgPSBpbmRpY2VzLm1hcCgoaWR4KSA9PiBvcHRpb25zW2lkeF0udmFsdWUpO1xuICBjb25zdCBsYWJlbHMgPSBpbmRpY2VzLm1hcCgoaWR4KSA9PiBvcHRpb25zW2lkeF0udGV4dCk7XG4gIHJldHVybiB7IG9rOiB0cnVlLCBpbmRpY2VzLCB2YWx1ZXMsIGxhYmVscyB9O1xufVxuXG5mdW5jdGlvbiBmaW5kTGFiZWxJbmRleChvcHRpb25zOiBIVE1MT3B0aW9uRWxlbWVudFtdLCBsYWJlbExvd2VyOiBzdHJpbmcsIG1hdGNoTW9kZTogJ2V4YWN0JyB8ICdwYXJ0aWFsJyk6IG51bWJlciB7XG4gIGlmIChtYXRjaE1vZGUgPT09ICdwYXJ0aWFsJykge1xuICAgIHJldHVybiBvcHRpb25zLmZpbmRJbmRleCgob3B0KSA9PiBvcHQudGV4dC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGxhYmVsTG93ZXIpKTtcbiAgfVxuICByZXR1cm4gb3B0aW9ucy5maW5kSW5kZXgoKG9wdCkgPT4gb3B0LnRleHQudG9Mb3dlckNhc2UoKSA9PT0gbGFiZWxMb3dlcik7XG59XG5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkKGVsOiBIVE1MU2VsZWN0RWxlbWVudCk6IHsgdmFsdWVzOiBzdHJpbmdbXTsgbGFiZWxzOiBzdHJpbmdbXTsgaW5kaWNlczogbnVtYmVyW10gfSB7XG4gIGNvbnN0IHZhbHVlczogc3RyaW5nW10gPSBbXTtcbiAgY29uc3QgbGFiZWxzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICBBcnJheS5mcm9tKGVsLm9wdGlvbnMpLmZvckVhY2goKG9wdCwgaWR4KSA9PiB7XG4gICAgaWYgKG9wdC5zZWxlY3RlZCkge1xuICAgICAgdmFsdWVzLnB1c2gob3B0LnZhbHVlKTtcbiAgICAgIGxhYmVscy5wdXNoKG9wdC50ZXh0KTtcbiAgICAgIGluZGljZXMucHVzaChpZHgpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB7IHZhbHVlcywgbGFiZWxzLCBpbmRpY2VzIH07XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RUZXh0KG1heFRleHQ6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGJvZHlUZXh0ID0gZG9jdW1lbnQuYm9keT8uaW5uZXJUZXh0ID8/ICcnO1xuICBjb25zdCBjb21wYWN0ID0gYm9keVRleHQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKTtcbiAgaWYgKGNvbXBhY3QubGVuZ3RoID4gbWF4VGV4dCkge1xuICAgIHJldHVybiBjb21wYWN0LnNsaWNlKDAsIG1heFRleHQpO1xuICB9XG4gIHJldHVybiBjb21wYWN0O1xufVxuXG5mdW5jdGlvbiBjb2xsZWN0RWxlbWVudHMobGltaXQ6IG51bWJlciwgaW5jbHVkZUhpZGRlbjogYm9vbGVhbikge1xuICBjb25zdCBub2RlcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAnYSxidXR0b24saW5wdXQsc2VsZWN0LHRleHRhcmVhLFtyb2xlPVwiYnV0dG9uXCJdLFtyb2xlPVwibGlua1wiXSdcbiAgKSk7XG4gIGNvbnN0IHJlc3VsdHMgPSBbXSBhcyBhbnlbXTtcbiAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgaWYgKHJlc3VsdHMubGVuZ3RoID49IGxpbWl0KSBicmVhaztcbiAgICBpZiAoIWluY2x1ZGVIaWRkZW4gJiYgIWlzVmlzaWJsZShub2RlIGFzIEhUTUxFbGVtZW50KSkgY29udGludWU7XG4gICAgY29uc3QgZWwgPSBub2RlIGFzIEhUTUxFbGVtZW50O1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICB0YWc6IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIHRleHQ6IGVsZW1lbnRUZXh0KGVsKSxcbiAgICAgIHNlbGVjdG9yOiBzZWxlY3RvckZvcihlbCksXG4gICAgICBocmVmOiAoZWwgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYgfHwgdW5kZWZpbmVkLFxuICAgICAgaW5wdXRUeXBlOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkudHlwZSB8fCB1bmRlZmluZWQsXG4gICAgICBuYW1lOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkubmFtZSB8fCBlbC5nZXRBdHRyaWJ1dGUoJ25hbWUnKSB8fCB1bmRlZmluZWQsXG4gICAgICBpZDogZWwuaWQgfHwgdW5kZWZpbmVkLFxuICAgICAgYXJpYUxhYmVsOiBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSB8fCB1bmRlZmluZWQsXG4gICAgICB0aXRsZTogZWwuZ2V0QXR0cmlidXRlKCd0aXRsZScpIHx8IHVuZGVmaW5lZCxcbiAgICAgIGFsdDogKGVsIGFzIEhUTUxJbWFnZUVsZW1lbnQpLmFsdCB8fCBlbC5nZXRBdHRyaWJ1dGUoJ2FsdCcpIHx8IHVuZGVmaW5lZCxcbiAgICAgIHZhbHVlOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgZWwuZ2V0QXR0cmlidXRlKCd2YWx1ZScpIHx8IHVuZGVmaW5lZCxcbiAgICAgIHBsYWNlaG9sZGVyOiAoZWwgYXMgSFRNTElucHV0RWxlbWVudCkucGxhY2Vob2xkZXIgfHwgZWwuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpIHx8IHVuZGVmaW5lZCxcbiAgICAgIGNvbnRleHQ6IHNpYmxpbmdUZXh0KGVsLCA4MCksXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGlzVmlzaWJsZShlbDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGlmIChzdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gJ2hpZGRlbicgfHwgc3R5bGUub3BhY2l0eSA9PT0gJzAnKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIHJlY3Qud2lkdGggPiAwICYmIHJlY3QuaGVpZ2h0ID4gMDtcbn1cblxuZnVuY3Rpb24gZWxlbWVudFRleHQoZWw6IEhUTUxFbGVtZW50KSB7XG4gIGNvbnN0IHRleHQgPSBlbC5pbm5lclRleHQgfHwgZWwudGV4dENvbnRlbnQgfHwgJyc7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xccysvZywgJyAnKS50cmltKCk7XG59XG5cbmZ1bmN0aW9uIHNpYmxpbmdUZXh0KGVsOiBIVE1MRWxlbWVudCwgbGltaXQ6IG51bWJlcikge1xuICBjb25zdCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICBpZiAoIXBhcmVudCkgcmV0dXJuICcnO1xuICBsZXQgdGV4dCA9ICcnO1xuICBmb3IgKGNvbnN0IG5vZGUgb2YgQXJyYXkuZnJvbShwYXJlbnQuY2hpbGROb2RlcykpIHtcbiAgICBpZiAobm9kZSA9PT0gZWwpIGNvbnRpbnVlO1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgY29uc3QgdCA9IChub2RlLnRleHRDb250ZW50IHx8ICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpO1xuICAgICAgaWYgKHQpIHRleHQgKz0gdCArICcgJztcbiAgICB9XG4gIH1cbiAgdGV4dCA9IHRleHQudHJpbSgpO1xuICBpZiAobGltaXQgPiAwICYmIHRleHQubGVuZ3RoID4gbGltaXQpIHJldHVybiB0ZXh0LnNsaWNlKDAsIGxpbWl0KTtcbiAgcmV0dXJuIHRleHQ7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdG9yRm9yKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gIGlmIChlbC5pZCkgcmV0dXJuIGAjJHtlbC5pZH1gO1xuICBjb25zdCBkYXRhVGVzdElkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3RpZCcpO1xuICBpZiAoZGF0YVRlc3RJZCkgcmV0dXJuIGAke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX1bZGF0YS10ZXN0aWQ9XCIke2RhdGFUZXN0SWR9XCJdYDtcbiAgY29uc3QgZGF0YUF0dHIgPSBmaXJzdERhdGFBdHRyKGVsLCBbJ2RhdGEtdGVzdCcsICdkYXRhLXFhJywgJ2RhdGEtYXV0b21hdGlvbicsICdkYXRhLWN5JywgJ2RhdGEtYXV0b21hdGlvbi1pZCddKTtcbiAgaWYgKGRhdGFBdHRyKSByZXR1cm4gYCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfVske2RhdGFBdHRyLmtleX09XCIke2RhdGFBdHRyLnZhbH1cIl1gO1xuICBjb25zdCBuYW1lID0gZWwuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gIGlmIChuYW1lKSByZXR1cm4gYCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfVtuYW1lPVwiJHtuYW1lfVwiXWA7XG4gIGNvbnN0IGFyaWEgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKTtcbiAgaWYgKGFyaWEpIHJldHVybiBgJHtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9W2FyaWEtbGFiZWw9XCIke2FyaWF9XCJdYDtcbiAgY29uc3QgY2xhc3NOYW1lID0gKGVsLmNsYXNzTmFtZSB8fCAnJykudG9TdHJpbmcoKS5zcGxpdCgnICcpLmZpbHRlcihCb29sZWFuKVswXTtcbiAgaWYgKGNsYXNzTmFtZSkgcmV0dXJuIGAke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX0uJHtjbGFzc05hbWV9YDtcbiAgY29uc3QgbnRoID0gbnRoQ2hpbGRJbmRleChlbCk7XG4gIGlmIChudGggPiAwKSByZXR1cm4gYCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfTpudGgtY2hpbGQoJHtudGh9KWA7XG4gIHJldHVybiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIG50aENoaWxkSW5kZXgoZWw6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgY29uc3QgcGFyZW50ID0gZWwucGFyZW50RWxlbWVudDtcbiAgaWYgKCFwYXJlbnQpIHJldHVybiAwO1xuICBsZXQgaWR4ID0gMDtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBBcnJheS5mcm9tKHBhcmVudC5jaGlsZHJlbikpIHtcbiAgICBpZHggKz0gMTtcbiAgICBpZiAoY2hpbGQgPT09IGVsKSByZXR1cm4gaWR4O1xuICB9XG4gIHJldHVybiAwO1xufVxuXG5mdW5jdGlvbiBmaXJzdERhdGFBdHRyKGVsOiBIVE1MRWxlbWVudCwga2V5czogc3RyaW5nW10pIHtcbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGNvbnN0IHZhbCA9IGVsLmdldEF0dHJpYnV0ZShrZXkpO1xuICAgIGlmICh2YWwpIHJldHVybiB7IGtleSwgdmFsIH07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iLCJpbXBvcnQgeyBpbml0VFJQQyB9IGZyb20gJ0B0cnBjL3NlcnZlcic7XG5pbXBvcnQgeyB6IH0gZnJvbSAnem9kJztcbmltcG9ydCB0eXBlIHsgU25hcHNob3REYXRhIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge1xuICBjbGlja0FjdGlvbixcbiAgc25hcHNob3RBY3Rpb24sXG4gIHNjcm9sbEFjdGlvbixcbiAgd2FpdEZvclNlbGVjdG9yQWN0aW9uLFxuICBuYXZpZ2F0ZUFjdGlvbixcbiAgdHlwZUFjdGlvbixcbiAgYmFja0FjdGlvbixcbiAgZm9yd2FyZEFjdGlvbixcbiAgaG92ZXJBY3Rpb24sXG4gIGZpbmRBY3Rpb24sXG4gIGVudGVyQWN0aW9uLFxuICBzZWxlY3RBY3Rpb24sXG4gIHNjcmVlbnNob3RQcmVwQWN0aW9uLFxufSBmcm9tICcuL2NvbnRlbnRBY3Rpb25zJztcblxuY29uc3QgdCA9IGluaXRUUlBDLmNyZWF0ZSh7XG4gIGlzU2VydmVyOiBmYWxzZSxcbiAgYWxsb3dPdXRzaWRlT2ZTZXJ2ZXI6IHRydWUsXG59KTtcblxuZXhwb3J0IGNvbnN0IGNvbnRlbnRSb3V0ZXIgPSB0LnJvdXRlcih7XG4gIHBpbmc6IHQucHJvY2VkdXJlLnF1ZXJ5KCgpID0+ICh7IG9rOiB0cnVlIH0pKSxcbiAgY2xpY2s6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHsgc2VsZWN0b3I6IHouc3RyaW5nKCkubWluKDEpIH0pKVxuICAgIC5tdXRhdGlvbigoeyBpbnB1dCB9KSA9PiBjbGlja0FjdGlvbihpbnB1dCkpLFxuICBzY3JvbGw6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIGRlbHRhWDogei5udW1iZXIoKS5vcHRpb25hbCgpLFxuICAgICAgZGVsdGFZOiB6Lm51bWJlcigpLm9wdGlvbmFsKCksXG4gICAgICBzZWxlY3Rvcjogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgYmVoYXZpb3I6IHouZW51bShbJ2F1dG8nLCAnc21vb3RoJ10pLm9wdGlvbmFsKCksXG4gICAgICBibG9jazogei5lbnVtKFsnc3RhcnQnLCAnY2VudGVyJywgJ2VuZCcsICduZWFyZXN0J10pLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IHNjcm9sbEFjdGlvbihpbnB1dCkpLFxuICB3YWl0Rm9yU2VsZWN0b3I6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIHNlbGVjdG9yOiB6LnN0cmluZygpLm1pbigxKSxcbiAgICAgIHRpbWVvdXRNczogei5udW1iZXIoKS5pbnQoKS5wb3NpdGl2ZSgpLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IHdhaXRGb3JTZWxlY3RvckFjdGlvbihpbnB1dCkpLFxuICBuYXZpZ2F0ZTogdC5wcm9jZWR1cmVcbiAgICAuaW5wdXQoei5vYmplY3Qoe1xuICAgICAgdXJsOiB6LnN0cmluZygpLm1pbigxKSxcbiAgICB9KSlcbiAgICAubXV0YXRpb24oKHsgaW5wdXQgfSkgPT4gbmF2aWdhdGVBY3Rpb24oaW5wdXQpKSxcbiAgYmFjazogdC5wcm9jZWR1cmUubXV0YXRpb24oKCkgPT4gYmFja0FjdGlvbigpKSxcbiAgZm9yd2FyZDogdC5wcm9jZWR1cmUubXV0YXRpb24oKCkgPT4gZm9yd2FyZEFjdGlvbigpKSxcbiAgaG92ZXI6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIHNlbGVjdG9yOiB6LnN0cmluZygpLm1pbigxKSxcbiAgICB9KSlcbiAgICAubXV0YXRpb24oKHsgaW5wdXQgfSkgPT4gaG92ZXJBY3Rpb24oaW5wdXQpKSxcbiAgZW50ZXI6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIHNlbGVjdG9yOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgICBrZXk6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICB9KSlcbiAgICAubXV0YXRpb24oKHsgaW5wdXQgfSkgPT4gZW50ZXJBY3Rpb24oaW5wdXQpKSxcbiAgc2VsZWN0OiB0LnByb2NlZHVyZVxuICAgIC5pbnB1dCh6Lm9iamVjdCh7XG4gICAgICBzZWxlY3Rvcjogei5zdHJpbmcoKS5taW4oMSksXG4gICAgICB2YWx1ZTogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgbGFiZWw6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgIGluZGV4OiB6Lm51bWJlcigpLmludCgpLm9wdGlvbmFsKCksXG4gICAgICB2YWx1ZXM6IHouYXJyYXkoei5zdHJpbmcoKSkub3B0aW9uYWwoKSxcbiAgICAgIGxhYmVsczogei5hcnJheSh6LnN0cmluZygpKS5vcHRpb25hbCgpLFxuICAgICAgaW5kaWNlczogei5hcnJheSh6Lm51bWJlcigpLmludCgpKS5vcHRpb25hbCgpLFxuICAgICAgbWF0Y2hNb2RlOiB6LmVudW0oWydleGFjdCcsICdwYXJ0aWFsJ10pLm9wdGlvbmFsKCksXG4gICAgICB0b2dnbGU6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IHNlbGVjdEFjdGlvbihpbnB1dCkpLFxuICBzY3JlZW5zaG90UHJlcDogdC5wcm9jZWR1cmVcbiAgICAuaW5wdXQoei5vYmplY3Qoe1xuICAgICAgc2VsZWN0b3I6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICAgIHBhZGRpbmc6IHoubnVtYmVyKCkuaW50KCkub3B0aW9uYWwoKSxcbiAgICAgIGZvcm1hdDogei5lbnVtKFsncG5nJywgJ2pwZWcnXSkub3B0aW9uYWwoKSxcbiAgICAgIHF1YWxpdHk6IHoubnVtYmVyKCkub3B0aW9uYWwoKSxcbiAgICAgIG1heFdpZHRoOiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCkub3B0aW9uYWwoKSxcbiAgICAgIG1heEhlaWdodDogei5udW1iZXIoKS5pbnQoKS5wb3NpdGl2ZSgpLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IHNjcmVlbnNob3RQcmVwQWN0aW9uKGlucHV0KSksXG4gIGZpbmQ6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIHRleHQ6IHouc3RyaW5nKCkubWluKDEpLFxuICAgICAgbGltaXQ6IHoubnVtYmVyKCkuaW50KCkucG9zaXRpdmUoKS5vcHRpb25hbCgpLFxuICAgICAgcmFkaXVzOiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCkub3B0aW9uYWwoKSxcbiAgICAgIGNhc2VTZW5zaXRpdmU6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IGZpbmRBY3Rpb24oaW5wdXQpKSxcbiAgdHlwZTogdC5wcm9jZWR1cmVcbiAgICAuaW5wdXQoei5vYmplY3Qoe1xuICAgICAgc2VsZWN0b3I6IHouc3RyaW5nKCkubWluKDEpLFxuICAgICAgdGV4dDogei5zdHJpbmcoKSxcbiAgICAgIHByZXNzRW50ZXI6IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgfSkpXG4gICAgLm11dGF0aW9uKCh7IGlucHV0IH0pID0+IHR5cGVBY3Rpb24oaW5wdXQpKSxcbiAgc25hcHNob3Q6IHQucHJvY2VkdXJlXG4gICAgLmlucHV0KHoub2JqZWN0KHtcbiAgICAgIGluY2x1ZGVIaWRkZW46IHouYm9vbGVhbigpLm9wdGlvbmFsKCksXG4gICAgICBtYXhFbGVtZW50czogei5udW1iZXIoKS5pbnQoKS5wb3NpdGl2ZSgpLm9wdGlvbmFsKCksXG4gICAgICBtYXhUZXh0OiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCkub3B0aW9uYWwoKSxcbiAgICAgIGluY2x1ZGVIVE1MOiB6LmJvb2xlYW4oKS5vcHRpb25hbCgpLFxuICAgICAgbWF4SFRNTDogei5udW1iZXIoKS5pbnQoKS5wb3NpdGl2ZSgpLm9wdGlvbmFsKCksXG4gICAgICBtYXhIVE1MVG9rZW5zOiB6Lm51bWJlcigpLmludCgpLnBvc2l0aXZlKCkub3B0aW9uYWwoKSxcbiAgICB9KSlcbiAgICAucXVlcnkoKHsgaW5wdXQgfSk6IFNuYXBzaG90RGF0YSA9PiBzbmFwc2hvdEFjdGlvbihpbnB1dCkpLFxufSk7XG5cbmV4cG9ydCB0eXBlIENvbnRlbnRSb3V0ZXIgPSB0eXBlb2YgY29udGVudFJvdXRlcjtcbiIsImltcG9ydCB7IGNyZWF0ZUNocm9tZUhhbmRsZXIgfSBmcm9tICd0cnBjLWJyb3dzZXIvYWRhcHRlcic7XG5pbXBvcnQgeyBicm93c2VyLCBkZWZpbmVDb250ZW50U2NyaXB0IH0gZnJvbSAnI2ltcG9ydHMnO1xuXG5pbXBvcnQgeyBjb250ZW50Um91dGVyIH0gZnJvbSAnLi9zaGFyZWQvY29udGVudFJvdXRlcic7XG5cbmxldCByZWNvcmRpbmdFbmFibGVkID0gZmFsc2U7XG5sZXQgc2Nyb2xsVGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xubGV0IGxhc3RTY3JvbGxZID0gMDtcbmNvbnN0IGlucHV0VGltZXJzID0gbmV3IFdlYWtNYXA8SFRNTEVsZW1lbnQsIG51bWJlcj4oKTtcbmNvbnN0IGNocm9tZUFwaSA9IChnbG9iYWxUaGlzLmNocm9tZSA/PyAoYnJvd3NlciBhcyB1bmtub3duIGFzIHR5cGVvZiBjaHJvbWUpKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29udGVudFNjcmlwdCh7XG4gIG1hdGNoZXM6IFsnKjovLyovKiddLFxuICBtYWluKCkge1xuICAgIHRyeSB7XG4gICAgICBjcmVhdGVDaHJvbWVIYW5kbGVyKHtcbiAgICAgICAgcm91dGVyOiBjb250ZW50Um91dGVyLFxuICAgICAgICBjaHJvbWU6IGNocm9tZUFwaSxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKTtcbiAgICAgIGlmICghbWVzc2FnZS5pbmNsdWRlcygnbm90IGltcGxlbWVudGVkJykpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgICAgY29uc29sZS53YXJuKCdTa2lwcGluZyBjaHJvbWUgaGFuZGxlciBjcmVhdGlvbjogcnVudGltZSBvbkNvbm5lY3Qgbm90IGltcGxlbWVudGVkJyk7XG4gICAgfVxuXG4gICAgY2hyb21lQXBpLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZT8udHlwZSA9PT0gJ3JlY29yZGluZzpzZXQnKSB7XG4gICAgICAgIHJlY29yZGluZ0VuYWJsZWQgPSAhIW1lc3NhZ2UuZW5hYmxlZDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXJlY29yZGluZ0VuYWJsZWQpIHJldHVybjtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvckZvcih0YXJnZXQpO1xuICAgICAgaWYgKCFzZWxlY3RvcikgcmV0dXJuO1xuICAgICAgcmVjb3JkQWN0aW9uKCdjbGljaycsIHsgc2VsZWN0b3IgfSk7XG4gICAgfSwgdHJ1ZSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgaWYgKCFyZWNvcmRpbmdFbmFibGVkKSByZXR1cm47XG4gICAgICBjb25zdCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xuICAgICAgaWYgKCF0YXJnZXQpIHJldHVybjtcbiAgICAgIGlmICghaXNUZXh0SW5wdXQodGFyZ2V0KSkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvckZvcih0YXJnZXQpO1xuICAgICAgaWYgKCFzZWxlY3RvcikgcmV0dXJuO1xuICAgICAgY29uc3QgdmFsdWUgPSAodGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlID8/ICcnO1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBpbnB1dFRpbWVycy5nZXQodGFyZ2V0KTtcbiAgICAgIGlmIChleGlzdGluZykgd2luZG93LmNsZWFyVGltZW91dChleGlzdGluZyk7XG4gICAgICBjb25zdCB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcmVjb3JkQWN0aW9uKCd0eXBlJywgeyBzZWxlY3RvciwgdGV4dDogdmFsdWUgfSk7XG4gICAgICB9LCA1MDApO1xuICAgICAgaW5wdXRUaW1lcnMuc2V0KHRhcmdldCwgdGltZXIpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXJlY29yZGluZ0VuYWJsZWQpIHJldHVybjtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICBpZiAoIXRhcmdldCkgcmV0dXJuO1xuICAgICAgaWYgKGlzU2VsZWN0KHRhcmdldCkpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBzZWxlY3RvckZvcih0YXJnZXQpO1xuICAgICAgICBpZiAoIXNlbGVjdG9yKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IHRhcmdldCBhcyBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gQXJyYXkuZnJvbShzZWxlY3Quc2VsZWN0ZWRPcHRpb25zKS5tYXAoKG9wdCkgPT4gb3B0LnZhbHVlKTtcbiAgICAgICAgcmVjb3JkQWN0aW9uKCdzZWxlY3QnLCB7IHNlbGVjdG9yLCB2YWx1ZXMgfSk7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoIXJlY29yZGluZ0VuYWJsZWQpIHJldHVybjtcbiAgICAgIGlmIChldmVudC5rZXkgIT09ICdFbnRlcicpIHJldHVybjtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XG4gICAgICBjb25zdCBzZWxlY3RvciA9IHRhcmdldCA/IHNlbGVjdG9yRm9yKHRhcmdldCkgOiB1bmRlZmluZWQ7XG4gICAgICByZWNvcmRBY3Rpb24oJ2VudGVyJywgeyBzZWxlY3Rvciwga2V5OiAnRW50ZXInIH0pO1xuICAgIH0sIHRydWUpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIGlmICghcmVjb3JkaW5nRW5hYmxlZCkgcmV0dXJuO1xuICAgICAgaWYgKHNjcm9sbFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KHNjcm9sbFRpbWVyKTtcbiAgICAgIGNvbnN0IHByZXZZID0gbGFzdFNjcm9sbFk7XG4gICAgICBzY3JvbGxUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY29uc3QgZGVsdGFZID0gd2luZG93LnNjcm9sbFkgLSBwcmV2WTtcbiAgICAgICAgaWYgKGRlbHRhWSAhPT0gMCkge1xuICAgICAgICAgIHJlY29yZEFjdGlvbignc2Nyb2xsJywgeyBkZWx0YVkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdFNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWTtcbiAgICAgIH0sIDMwMCk7XG4gICAgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICB9LFxufSk7XG5cbmZ1bmN0aW9uIHJlY29yZEFjdGlvbih0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IGFueSkge1xuICBjaHJvbWVBcGkucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgdHlwZTogJ3JlY29yZF9ldmVudCcsXG4gICAgcGF5bG9hZDoge1xuICAgICAgdHlwZSxcbiAgICAgIHBheWxvYWQsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB1cmw6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgIH0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc1RleHRJbnB1dChlbDogSFRNTEVsZW1lbnQpIHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAodGFnID09PSAndGV4dGFyZWEnKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKHRhZyAhPT0gJ2lucHV0JykgcmV0dXJuIGZhbHNlO1xuICBjb25zdCB0eXBlID0gKGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnR5cGU/LnRvTG93ZXJDYXNlKCkgfHwgJ3RleHQnO1xuICByZXR1cm4gWyd0ZXh0JywgJ3NlYXJjaCcsICdlbWFpbCcsICd1cmwnLCAncGFzc3dvcmQnLCAndGVsJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGUpO1xufVxuXG5mdW5jdGlvbiBpc1NlbGVjdChlbDogSFRNTEVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3NlbGVjdCc7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdG9yRm9yKGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gIGlmIChlbC5pZCkgcmV0dXJuIGAjJHtlbC5pZH1gO1xuICBjb25zdCBkYXRhVGVzdElkID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlc3RpZCcpO1xuICBpZiAoZGF0YVRlc3RJZCkgcmV0dXJuIGAke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX1bZGF0YS10ZXN0aWQ9XCIke2RhdGFUZXN0SWR9XCJdYDtcbiAgY29uc3QgbmFtZSA9IGVsLmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuICBpZiAobmFtZSkgcmV0dXJuIGAke2VsLnRhZ05hbWUudG9Mb3dlckNhc2UoKX1bbmFtZT1cIiR7bmFtZX1cIl1gO1xuICBjb25zdCBhcmlhID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gIGlmIChhcmlhKSByZXR1cm4gYCR7ZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpfVthcmlhLWxhYmVsPVwiJHthcmlhfVwiXWA7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IChlbC5jbGFzc05hbWUgfHwgJycpLnRvU3RyaW5nKCkuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbilbMF07XG4gIGlmIChjbGFzc05hbWUpIHJldHVybiBgJHtlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9LiR7Y2xhc3NOYW1lfWA7XG4gIHJldHVybiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG59XG4iLCJmdW5jdGlvbiBwcmludChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgaWYgKGltcG9ydC5tZXRhLmVudi5NT0RFID09PSBcInByb2R1Y3Rpb25cIikgcmV0dXJuO1xuICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09IFwic3RyaW5nXCIpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXJncy5zaGlmdCgpO1xuICAgIG1ldGhvZChgW3d4dF0gJHttZXNzYWdlfWAsIC4uLmFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xuICB9XG59XG5leHBvcnQgY29uc3QgbG9nZ2VyID0ge1xuICBkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuICBsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG4gIHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuICBlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuZXhwb3J0IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gIGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG4gICAgc3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG4gICAgdGhpcy5uZXdVcmwgPSBuZXdVcmw7XG4gICAgdGhpcy5vbGRVcmwgPSBvbGRVcmw7XG4gIH1cbiAgc3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuICByZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IG9sZFVybDtcbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIGxvY2F0aW9uIHdhdGNoZXIgaXMgYWN0aXZlbHkgbG9va2luZyBmb3IgVVJMIGNoYW5nZXMuIElmIGl0J3MgYWxyZWFkeSB3YXRjaGluZyxcbiAgICAgKiB0aGlzIGlzIGEgbm9vcC5cbiAgICAgKi9cbiAgICBydW4oKSB7XG4gICAgICBpZiAoaW50ZXJ2YWwgIT0gbnVsbCkgcmV0dXJuO1xuICAgICAgb2xkVXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcbiAgICAgIGludGVydmFsID0gY3R4LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG4gICAgICAgIGlmIChuZXdVcmwuaHJlZiAhPT0gb2xkVXJsLmhyZWYpIHtcbiAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIG9sZFVybCkpO1xuICAgICAgICAgIG9sZFVybCA9IG5ld1VybDtcbiAgICAgICAgfVxuICAgICAgfSwgMWUzKTtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHtcbiAgZ2V0VW5pcXVlRXZlbnROYW1lXG59IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuZXhwb3J0IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICBpZiAodGhpcy5pc1RvcEZyYW1lKSB7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cyh7IGlnbm9yZUZpcnN0RXZlbnQ6IHRydWUgfSk7XG4gICAgICB0aGlzLnN0b3BPbGRTY3JpcHRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBTQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXG4gICAgXCJ3eHQ6Y29udGVudC1zY3JpcHQtc3RhcnRlZFwiXG4gICk7XG4gIGlzVG9wRnJhbWUgPSB3aW5kb3cuc2VsZiA9PT0gd2luZG93LnRvcDtcbiAgYWJvcnRDb250cm9sbGVyO1xuICBsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG4gIHJlY2VpdmVkTWVzc2FnZUlkcyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG4gIGdldCBzaWduYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcbiAgfVxuICBhYm9ydChyZWFzb24pIHtcbiAgICByZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcbiAgfVxuICBnZXQgaXNJbnZhbGlkKCkge1xuICAgIGlmIChicm93c2VyLnJ1bnRpbWUuaWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcbiAgfVxuICBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuICB9XG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250ZW50IHNjcmlwdCdzIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lci5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG4gICAqIGNvbnN0IHJlbW92ZUludmFsaWRhdGVkTGlzdGVuZXIgPSBjdHgub25JbnZhbGlkYXRlZCgoKSA9PiB7XG4gICAqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG4gICAqIH0pXG4gICAqIC8vIC4uLlxuICAgKiByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG4gICAqL1xuICBvbkludmFsaWRhdGVkKGNiKSB7XG4gICAgdGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIGEgcHJvbWlzZSB0aGF0IG5ldmVyIHJlc29sdmVzLiBVc2VmdWwgaWYgeW91IGhhdmUgYW4gYXN5bmMgZnVuY3Rpb24gdGhhdCBzaG91bGRuJ3QgcnVuXG4gICAqIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAqICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcbiAgICpcbiAgICogICAvLyAuLi5cbiAgICogfVxuICAgKi9cbiAgYmxvY2soKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCgpID0+IHtcbiAgICB9KTtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICpcbiAgICogSW50ZXJ2YWxzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2xlYXJJbnRlcnZhbGAgZnVuY3Rpb24uXG4gICAqL1xuICBzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG4gICAgY29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cbiAgLyoqXG4gICAqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0VGltZW91dGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWwgd2hlbiBpbnZhbGlkYXRlZC5cbiAgICpcbiAgICogVGltZW91dHMgY2FuIGJlIGNsZWFyZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBzZXRUaW1lb3V0YCBmdW5jdGlvbi5cbiAgICovXG4gIHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuICAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG4gICAgfSwgdGltZW91dCk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKipcbiAgICogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWAgZnVuY3Rpb24uXG4gICAqL1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgICBjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgfSk7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIC8qKlxuICAgKiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZSByZXF1ZXN0IHdoZW5cbiAgICogaW52YWxpZGF0ZWQuXG4gICAqXG4gICAqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuICAgICAgaWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcbiAgICB9LCBvcHRpb25zKTtcbiAgICB0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG4gIGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcbiAgICAgIGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuICAgIH1cbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKFxuICAgICAgdHlwZS5zdGFydHNXaXRoKFwid3h0OlwiKSA/IGdldFVuaXF1ZUV2ZW50TmFtZSh0eXBlKSA6IHR5cGUsXG4gICAgICBoYW5kbGVyLFxuICAgICAge1xuICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICBzaWduYWw6IHRoaXMuc2lnbmFsXG4gICAgICB9XG4gICAgKTtcbiAgfVxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuICAgKi9cbiAgbm90aWZ5SW52YWxpZGF0ZWQoKSB7XG4gICAgdGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgXG4gICAgKTtcbiAgfVxuICBzdG9wT2xkU2NyaXB0cygpIHtcbiAgICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAgICB7XG4gICAgICAgIHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcbiAgICAgICAgY29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG4gICAgICAgIG1lc3NhZ2VJZDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMilcbiAgICAgIH0sXG4gICAgICBcIipcIlxuICAgICk7XG4gIH1cbiAgdmVyaWZ5U2NyaXB0U3RhcnRlZEV2ZW50KGV2ZW50KSB7XG4gICAgY29uc3QgaXNTY3JpcHRTdGFydGVkRXZlbnQgPSBldmVudC5kYXRhPy50eXBlID09PSBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEU7XG4gICAgY29uc3QgaXNTYW1lQ29udGVudFNjcmlwdCA9IGV2ZW50LmRhdGE/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuICAgIGNvbnN0IGlzTm90RHVwbGljYXRlID0gIXRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmhhcyhldmVudC5kYXRhPy5tZXNzYWdlSWQpO1xuICAgIHJldHVybiBpc1NjcmlwdFN0YXJ0ZWRFdmVudCAmJiBpc1NhbWVDb250ZW50U2NyaXB0ICYmIGlzTm90RHVwbGljYXRlO1xuICB9XG4gIGxpc3RlbkZvck5ld2VyU2NyaXB0cyhvcHRpb25zKSB7XG4gICAgbGV0IGlzRmlyc3QgPSB0cnVlO1xuICAgIGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSB7XG4gICAgICAgIHRoaXMucmVjZWl2ZWRNZXNzYWdlSWRzLmFkZChldmVudC5kYXRhLm1lc3NhZ2VJZCk7XG4gICAgICAgIGNvbnN0IHdhc0ZpcnN0ID0gaXNGaXJzdDtcbiAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xuICAgICAgICBpZiAod2FzRmlyc3QgJiYgb3B0aW9ucz8uaWdub3JlRmlyc3RFdmVudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBhZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBjYik7XG4gICAgdGhpcy5vbkludmFsaWRhdGVkKCgpID0+IHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGNiKSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJicm93c2VyIiwiX2Jyb3dzZXIiLCJkZWZpbml0aW9uIiwiaXNPYmplY3QiLCJVbmtub3duQ2F1c2VFcnJvciIsImdldENhdXNlRnJvbVVua25vd24iLCJyZXF1aXJlJCQwIiwiZ2V0VFJQQ0Vycm9yRnJvbVVua25vd24iLCJUUlBDRXJyb3IiLCJpbnZlcnQiLCJUUlBDX0VSUk9SX0NPREVTX0JZX0tFWSIsIkpTT05SUEMyX1RPX0hUVFBfQ09ERSIsImdldFN0YXR1c0NvZGVGcm9tS2V5IiwiZ2V0SFRUUFN0YXR1c0NvZGVGcm9tRXJyb3IiLCJub29wIiwiY3JlYXRlSW5uZXJQcm94eSIsImNyZWF0ZVJlY3Vyc2l2ZVByb3h5IiwiY3JlYXRlRmxhdFByb3h5IiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiLCJnZXREYXRhVHJhbnNmb3JtZXIiLCJkZWZhdWx0VHJhbnNmb3JtZXIiLCJkZWZhdWx0Rm9ybWF0dGVyIiwib21pdFByb3RvdHlwZSIsInByb2NlZHVyZVR5cGVzIiwiaXNSb3V0ZXIiLCJlbXB0eVJvdXRlciIsInJlc2VydmVkV29yZHMiLCJjcmVhdGVSb3V0ZXJGYWN0b3J5IiwicHJvY2VkdXJlcyIsImNyZWF0ZUNhbGxlckZhY3RvcnkiLCJjYWxsUHJvY2VkdXJlIiwiaXNTZXJ2ZXJEZWZhdWx0IiwicmVxdWlyZSQkMyIsInJlcXVpcmUkJDQiLCJyZXN1bHQiLCJnZXRQYXJzZUZuIiwibWVyZ2VXaXRob3V0T3ZlcnJpZGVzIiwiY3JlYXRlTWlkZGxld2FyZUZhY3RvcnkiLCJpc1BsYWluT2JqZWN0IiwiY3JlYXRlSW5wdXRNaWRkbGV3YXJlIiwiY3JlYXRlT3V0cHV0TWlkZGxld2FyZSIsIm1pZGRsZXdhcmVNYXJrZXIiLCJjcmVhdGVOZXdCdWlsZGVyIiwiY3JlYXRlQnVpbGRlciIsImNyZWF0ZVJlc29sdmVyIiwiY3JlYXRlUHJvY2VkdXJlQ2FsbGVyIiwiY29kZWJsb2NrIiwicm91dGVyIiwibWVyZ2VSb3V0ZXJzIiwiVFJQQ0J1aWxkZXIiLCJjcmVhdGVUUlBDSW5uZXIiLCJpbml0VFJQQyIsIm9ic2VydmFibGUiLCJzZWxmIiwib2JzZXJ2YWJsZV8xIiwiY2hyb21lIiwiZ2xvYmFsIiwid2luZG93IiwicmVxdWlyZSQkNSIsIl9hIiwiX2IiLCJ0aGlzIiwiZXhwb3J0cyIsImdldERhdGFUcmFuc2Zvcm1lciQxIiwidXRpbCIsIm9iamVjdFV0aWwiLCJ0IiwiZGVmYXVsdEVycm9yTWFwIiwiZXJyb3JVdGlsIiwiZXJyb3JNYXAiLCJjdHgiLCJpc3N1ZXMiLCJlbGVtZW50cyIsInByb2Nlc3NlZCIsIlpvZEZpcnN0UGFydHlUeXBlS2luZCIsIndpZHRoIiwiaGVpZ2h0Iiwic2VsZWN0b3JGb3IiLCJ6Lm9iamVjdCIsInouc3RyaW5nIiwiei5udW1iZXIiLCJ6LmVudW0iLCJ6LmFycmF5Iiwiei5ib29sZWFuIiwiY3JlYXRlQ2hyb21lSGFuZGxlciIsInByaW50IiwibG9nZ2VyIl0sIm1hcHBpbmdzIjoiOztBQUNPLFFBQU1BLFlBQVUsV0FBVyxTQUFTLFNBQVMsS0FDaEQsV0FBVyxVQUNYLFdBQVc7QUNGUixRQUFNLFVBQVVDO0FDRGhCLFdBQVMsb0JBQW9CQyxhQUFZO0FBQzlDLFdBQU9BO0FBQUEsRUFDVDs7Ozs7Ozs7Ozs7O0FDRUksYUFBU0MsVUFBUyxPQUFPO0FBRXpCLGFBQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLFFBQVEsS0FBSyxLQUFLLE9BQU8sVUFBVTtBQUFBLElBQ2hFO0FBQUEsSUFFQSxNQUFNQywyQkFBMEIsTUFBTTtBQUFBLElBQ3RDO0FBQ0EsYUFBU0MscUJBQW9CLE9BQU87QUFDaEMsVUFBSSxpQkFBaUIsT0FBTztBQUN4QixlQUFPO0FBQUEsTUFDZjtBQUNJLFlBQU0sT0FBTyxPQUFPO0FBQ3BCLFVBQUksU0FBUyxlQUFlLFNBQVMsY0FBYyxVQUFVLE1BQU07QUFDL0QsZUFBTztBQUFBLE1BQ2Y7QUFFSSxVQUFJLFNBQVMsVUFBVTtBQUNuQixlQUFPLElBQUksTUFBTSxPQUFPLEtBQUssQ0FBQztBQUFBLE1BQ3RDO0FBRUksVUFBSUYsVUFBUyxLQUFLLEdBQUc7QUFDakIsY0FBTSxNQUFNLElBQUlDLG1CQUFpQjtBQUNqQyxtQkFBVSxPQUFPLE9BQU07QUFDbkIsY0FBSSxHQUFHLElBQUksTUFBTSxHQUFHO0FBQUEsUUFDaEM7QUFDUSxlQUFPO0FBQUEsTUFDZjtB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LEdBQUcsS0FBSyxLQUFLLFFBQVEsRUFBRSxNQUFNLGVBQWU7QUFBQSxNQUNqRSxDQUFTO0FBQUEsSUFDTDtBQUFBLElBQ0EsSUFBSSxhQUFhO0FBQ2IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVU7QUFBQSxJQUNqRTtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxhQUFhO0FBQ2IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLFVBQVU7QUFBQSxJQUNqRTtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU87QUFBQSxJQUM5RDtBQUFBLElBQ0EsSUFBSSxRQUFRO0FBQ1IsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEtBQUs7QUFBQSxJQUM1RDtBQUFBLElBQ0EsSUFBSSxVQUFVO0FBQ1YsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE9BQU87QUFBQSxJQUM5RDtBQUFBLElBQ0EsSUFBSSxTQUFTO0FBQ1QsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLE1BQU07QUFBQSxJQUM3RDtBQUFBLElBQ0EsSUFBSSxXQUFXO0FBQ1gsYUFBTyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sS0FBSyxDQUFDLE9BQU8s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Q047QUFBQSxJQUNFO0FBQUEsSUFDQSx5QkFBeUIsT0FBTztBQUM5QixZQUFNLHVCQUF1QixNQUFNLE1BQU0sU0FBUyxxQkFBcUI7QUFDdkUsWUFBTSxzQkFBc0IsTUFBTSxNQUFNLHNCQUFzQixLQUFLO0FBQ25FLFlBQU0saUJBQWlCLENBQUMsS0FBSyxtQkFBbUIsSUFBSSxNQUFNLE1BQU0sU0FBUztBQUN6RSxhQUFPLHdCQUF3Qix1QkFBdUI7QUFBQSxJQUN4RDtBQUFBLElBQ0Esc0JBQXNCLFNBQVM7QUFDN0IsVUFBSSxVQUFVO0FBQ2QsWUFBTSxLQUFLLENBQUMsVUFBVTtBQUNwQixZQUFJLEtBQUsseUJBQXlCLEtBQUssR0FBRztBQUN4QyxlQUFLLG1CQUFtQixJQUFJLE1BQU0sS0FBSyxTQUFTO0FBQ2hELGdCQUFNLFdBQVc7QUFDakIsb0JBQVU7QUFDVixjQUFJLFlBQVksU0FBUyxpQkFBa0I7QUFDM0MsZUFBSyxrQkFBaUI7QUFBQSxRQUN4QjtBQUFBLE1BQ0Y7QUFDQSx1QkFBaUIsV0FBVyxFQUFFO0FBQzlCLFdBQUssY0FBYyxNQUFNLG9CQUFvQixXQUFXLEVBQUUsQ0FBQztBQUFBLElBQzdEO0FBQUEsRUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwLDIxLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMwLDMxLDM1LDM2LDM3LDM4XX0=
content;