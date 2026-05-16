/**
 * Preloads a list of image URLs by creating hidden `Image` instances.
 *
 * Compatible with React 18 and React 19. Call inside `useEffect` so images
 * are preloaded after mount without creating objects on every render.
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   preloadImages(allPortraitSrcs);
 * }, [allPortraitSrcs]);
 * ```
 */
export function preloadImages(srcs: readonly string[]): void {
  srcs.forEach((src) => {
    if (src) {
      const img = new Image();
      img.src = src;
    }
  });
}
