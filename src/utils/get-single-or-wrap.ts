export const getSingleOrWrap = <T>(v: T | T[], i: number): T => {
  if (Array.isArray(v)) return v[i % v.length];
  return v;
}
