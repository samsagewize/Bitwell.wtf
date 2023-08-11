export function b64encodedUrl(plainHtml) {
  const encodedHtml = btoa(unescape(encodeURIComponent(plainHtml)));
  return `data:text/html;base64,${encodedHtml}`;
}
