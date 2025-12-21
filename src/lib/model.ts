export function formatVNDateTime(dateInput: string | number | Date): string {
    const date = new Date(dateInput);

    // cộng thêm 7 giờ (UTC+7)
    const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const day = pad(vnTime.getDate());
    const month = pad(vnTime.getMonth() + 1);
    const year = vnTime.getFullYear();

    const hours = pad(vnTime.getHours());
    const minutes = pad(vnTime.getMinutes());
    const seconds = pad(vnTime.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export const answerLabel = (index: number) => String.fromCharCode(65 + index);