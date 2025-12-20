import path from "path";
import slugify from "slugify";
import crypto from "crypto";

const IMAGE_SECRET = process.env.IMAGE_SIGN_SECRET || "image-secret";

export function normalizeImages(images: any[]): string[] {
    if (!Array.isArray(images)) return [];

    return images
        .map(img => {
            if (typeof img?.saved_path === "string") {
                return path.basename(img.saved_path);
            }
            return null;
        })
        .filter(Boolean) as string[];
}



export function sanitizeFilename(originalName: string) {
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);

    const safeBase = slugify(base, {
        lower: false,
        strict: true,   // ❗ remove all special chars
        locale: "vi",
    });

    return `${Date.now()}-${safeBase}${ext}`;
}

export function signImage(filename: string, exp: number) {
    const data = `${filename}:${exp}`;
    const sig = crypto
        .createHmac("sha256", IMAGE_SECRET)
        .update(data)
        .digest("hex");

    return sig;
}

export function verifyImage(filename: string, exp: number, sig: string) {
    if (Date.now() > exp * 1000) return false;
    const expected = signImage(filename, exp);
    return expected === sig;
}
