import path from "path";

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

import crypto from "crypto";

const IMAGE_SECRET = process.env.IMAGE_SIGN_SECRET || "image-secret";

export function signImage(filename: string, exp: number) {
    const data = `${filename}:${exp}`;
    const sig = crypto
        .createHmac("sha256", IMAGE_SECRET)
        .update(data)
        .digest("hex");

    return sig;
}

export function verifyImage(filename: string, exp: number, sig: string) {
    const expected = signImage(filename, exp);
    return expected === sig;
}
