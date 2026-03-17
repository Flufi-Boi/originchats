
const icons: Record<string, string> = {};

export function generateIcon(name: string): HTMLElement {
    const icon = document.createElement("icon");
    if (icons[name]) {
        icon.innerHTML = icons[name];
    } else {
        fetch(`https://unpkg.com/lucide-static@latest/icons/${name}.svg`)
            .then(r => r.text())
            .then(svg => {
                icons[name] = svg;
                icon.innerHTML = svg;
            });
    }
    return icon;
}

export function loadIcon(name: string) {
    fetch(`https://unpkg.com/lucide-static@latest/icons/${name}.svg`)
        .then(r => r.text())
        .then(svg => {
            icons[name] = svg;
        });
}

loadIcon("hash");
loadIcon("volume-2");
loadIcon("corner-up-right");

export const icon_names: Record<string, string> = {
    "alert-note":      "info",
    "alert-tip":       "lightbulb",
    "alert-important": "message-square-warning",
    "alert-warning":   "triangle-alert",
    "alert-caution":   "octagon-alert",
    "alert-fallback":  "circle-alert"
};
