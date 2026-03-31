const padOrTrim = (s: string, width: number) => {
	if (s.length === width) return s;
	if (s.length < width) return s + " ".repeat(width - s.length);
	return `${s.slice(0, Math.max(0, width - 1))}…`;
};

// Draws `colValues.length` items side by side in a columnar layout in the terminal
export function drawSideBySide(
	colValues: string[][],
	{ rows = 40, cols = 80 }: { rows?: number; cols?: number } = {},
) {
	const gutter = 3;
	const paneWidth = Math.max(10, Math.floor((cols - gutter) / 2));
	const maxRows = Math.max(1, rows - 1);

	let out = "";

	for (let i = 0; i < maxRows; i++) {
		for(const col of colValues) {
			if (col.length <= i) continue;
			const cell = col[i];
			const padded = padOrTrim(cell, paneWidth);
			if (col === colValues[0]) {
				out += padded;
			} else {
				out += " ".repeat(gutter) + padded;
			}
		}

		// out += `${leftP} | ${rightP}`;
		if (i < maxRows - 1) out += "\n";
	}

	Deno.stdout.write(new TextEncoder().encode(out));
}
