export function cleanLatex(latex: string): string {
    return latex
            .trim()

            // bỏ xuống dòng đầu / cuối
            .replace(/^\n+|\n+$/g, "")

            // nhiều space -> 1 space (không động vào \commands)
            .replace(/[ \t]+/g, " ")

            // space quanh dấu toán học
            .replace(/\s*([=+\-*/<>])\s*/g, " $1 ")

            // chuẩn hóa ngoặc
            .replace(/\s*([(){}\[\]])\s*/g, "$1")

            // fix $$...$$ bị sót $
            .replace(/^\$+|\$+$/g, "");
}

export function splitLatex(text: string) {
    const regex = /\$(.+?)\$/g;
    const parts: Array<{ type: "text" | "latex"; value: string }> = [];

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                    parts.push({
                            type: "text",
                            value: text.slice(lastIndex, match.index),
                    });
            }

            parts.push({
                    type: "latex",
                    value: cleanLatex(match[1]),
            });


            lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
            parts.push({
                    type: "text",
                    value: text.slice(lastIndex),
            });
    }

    return parts;
}