// src/utils/lazyLoad.js
import { lazy } from 'react';

/**
 * @param {() => Promise<any>} importFunc
 *    A function that does a dynamic import, e.g. `() => import('./MyComp')`
 * @param {string} [exportName]
 *    If you need a named‐export (instead of the module's default export), pass its key here.
 */
export function lazyLoad(importFunc, exportName) {
  return lazy(() =>
    importFunc().then(mod => {
      if (!exportName) {
        // module uses a default export
        return mod;
      }
      // pull out a named export
      return { default: mod[exportName] };
    }),
  );
}
