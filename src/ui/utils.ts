
export function htmlToElement(html: string): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = html.trim();
    return div.firstChild as HTMLElement;
}
