export const readDoc = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load doc: ${url}`);
  return res.text();
};
