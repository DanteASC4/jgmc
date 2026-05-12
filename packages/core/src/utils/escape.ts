/**
 * Minimalist, high-speed HTML/SVG escaping.
 */
export function esc(str: unknown): string {
	if (typeof str !== "string") return String(str);
	return str.replace(/[&<>"']/g, (m) => {
		switch (m) {
			case "&":
				return "&amp;";
			case "<":
				return "&lt;";
			case ">":
				return "&gt;";
			case '"':
				return "&quot;";
			case "'":
				return "&#39;";
			default:
				return m;
		}
	});
}
