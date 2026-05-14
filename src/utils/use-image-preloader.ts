import { preload } from 'react-dom';

/**
 * Registers images for browser preloading using React's built-in `preload` hint.
 *
 * Call this with every image URL a component may ever render. React emits
 * `<link rel="preload" as="image">` tags in the SSR HTML (before the
 * component markup) and deduplicates identical URLs automatically, so there
 * is no flicker on first paint — including on initial server-rendered load.
 *
 * Must be called during render (not inside `useEffect` or event handlers) so
 * the preload hints are included in the SSR response.
 *
 * Pass `highPrioritySrc` for the image that is immediately visible on first
 * render. It receives `fetchPriority: 'high'` so the browser fetches it
 * before all other preloaded images, preventing sporadic first-paint flicker.
 *
 * @example
 * ```tsx
 * useImagePreloader(allPortraitSrcs, firstPortraitSrc);
 * ```
 */
export function useImagePreloader(srcs: readonly string[], highPrioritySrc?: string): void {
  srcs.forEach((src) => {
    if (src) {
      preload(src, {
        as: 'image',
        fetchPriority: src === highPrioritySrc ? 'high' : 'auto',
      });
    }
  });
}
