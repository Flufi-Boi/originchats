
export function htmlToElement(html: string): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild as HTMLElement;
}

export type MediaType = "image" | "video" | "audio"

export function identifyType(type: string, ext?: string): MediaType | undefined {
    const isImage = type.startsWith("image/");
    if (isImage)
        return "image";

    const isVideo = type.startsWith("video/") ||
        type =="application/octet-stream";
    if (isVideo)
        return "video";

    const isAudio =
        type.startsWith("audio/") ||
        type === "application/ogg" ||
        ["mp3", "wav", "ogg", "oga", "flac", "m4a", "aac"].includes(ext ?? "");
    if (isAudio)
        return "audio";
}

// stolen from sophies client :3 (and reformatted and edited)
export function formatFileSize(bytes: number): string {
    if (bytes < 1024)
        return `${bytes}b`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)}kb`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}
