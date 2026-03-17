import * as events from "../../events";

// TODO: keep popups in memory, just change display
//       would also help with image popups maybe

export type Popup = {
    generate?: (parent: HTMLElement, data?: any) => HTMLElement,
    data?: Record<string, any>,
    elem?: HTMLElement,
    cover?: true
} | {
    generate?: (parent: HTMLElement, data?: any) => HTMLElement,
    data?: Record<string, any>,
    elem?: HTMLElement,
    cover: false,
};

export let currentPopup: Popup | null = null;
export function openPopup(popup: Popup) {
    currentPopup = popup;
    events.invoke(events.EventName.PopupChange);
}
export function closePopup() {
    currentPopup = null;
    events.invoke(events.EventName.PopupChange);
}

function keepInsideViewport(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();

    let x = rect.left;
    let y = rect.top;

    if (rect.right > window.innerWidth)
        x -= rect.right - window.innerWidth;

    if (rect.bottom > window.innerHeight)
        y -= rect.bottom - window.innerHeight;
    
    elem.style.left = x + "px";
    elem.style.top = y + "px";
}

export function generate(popup: Popup) {
    const container = document.getElementById("popup-container")!;
    container.innerHTML = "";

    if (popup.cover ?? true) {
        container.classList.add("cover");
    } else  {
        setTimeout(() => {
            keepInsideViewport(container);
        }, 100);
    }

    if (popup.generate) {
        popup.elem = popup.generate(container, popup.data);
    }
}

events.listen(events.EventName.PopupChange, () => {
    const container = document.getElementById("popup-container")!;
    container.innerHTML = "";

    if (currentPopup)
        generate(currentPopup);
})
