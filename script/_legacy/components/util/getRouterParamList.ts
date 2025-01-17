/**
 * @description url params to object
 * @example const url = "/search?order=like&created=all&d=title";
 * const queryParams = getRouterParamList(url);
 * console.info(queryParams); // { order: 'like', created: 'all', d: 'all' }
 */
export const urlParamsToObj = (url: string): Record<string, string> =>
  Object.fromEntries(new URLSearchParams(url.slice(url.indexOf("?"))));

/**
 * @description object to url params
 * @example const newQueryString = toQueryString(queryParams);
 * console.info(newQueryString); // "order=like&created=all&d=title"
 */
export const objToURLParams = (params: Record<string, string>): string => new URLSearchParams(params).toString();

/**
 * @description get string after "?" character
 * @example const url = "/search?order=like&created=all&d=title";
 * const queryString = extractQueryString(url);
 * console.info(queryString); // "order=like&created=all&d=title"
 */
export const getURLParamString = (url: string): string => (url.includes("?") ? url.split("?")[1] : "");
