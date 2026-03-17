import * as events from "../events";
import { generateIcon } from "./icon";

export type RightClickItem = {
    text: string,
    icon?: string,
    click?: (data: any) => void
} | "---";

export type RightClickMenu = {
    data?: any,
    content: RightClickItem[],
    x: number,
    y: number
};

let open_menu: RightClickMenu | null = null;
let open_menu_elem: HTMLElement | null = null;

export function openRightClickContextMenu(menu: { data?: any, content: RightClickItem[] }, e: MouseEvent) {
    openRightClick({
        ...menu,
        x: e.clientX + 1,
        y: e.clientY + 1
    });
}

export function openRightClick(menu: RightClickMenu) {
    open_menu = menu;
    events.invoke(events.EventName.RightClickChange);
}
export function closeRightClick() {
    open_menu = null;
    events.invoke(events.EventName.RightClickChange);
}

function keepInsideViewport(elem: HTMLElement) {
    const rect = elem.getBoundingClientRect();

    let x = rect.left;
    let y = rect.top;

    if (rect.right > window.innerWidth)
        x -= rect.right - window.innerWidth + 10;

    if (rect.bottom > window.innerHeight)
        y -= rect.bottom - window.innerHeight + 10;

    elem.style.left = x + "px";
    elem.style.top = y + "px";
}

export function generate() {
    const root_container = document.getElementById("right-click")!;
    root_container.innerHTML = "";

    open_menu_elem = null;

    if (!open_menu)
        return;
    
    open_menu_elem = root_container;

    root_container.style.left = open_menu.x + "px";
    root_container.style.top = open_menu.y + "px";

    console.log(open_menu);
    for (let i = 0; i < open_menu.content.length; i++) {
        const item = open_menu.content[i];
        
        if (item == "---") {
            const elem = document.createElement("hr");

            root_container.appendChild(elem);
        } else {
            const elem = document.createElement("button");
            if (item.icon)
                elem.appendChild(generateIcon(item.icon));
            if (item.click)
                elem.addEventListener("click", () => {
                    item.click!(open_menu?.data);
                    closeRightClick();
                });
            elem.appendChild(document.createTextNode(item.text));
            root_container.appendChild(elem);
        }
    }

    keepInsideViewport(root_container);
    setTimeout(() => {
        keepInsideViewport(root_container);
    }, 500);
}

document.addEventListener("click", (event) => {
    if (open_menu_elem && !open_menu_elem.contains(event.target as HTMLElement)) {
        closeRightClick();
    }
});

events.listen(events.EventName.RightClickChange, () => {
    generate();
});

/*
openRightClick({
    content: [
        {
            icon: "aperture",
            text: "Gay"
        },
        {
            icon: "gift",
            text: "Bleh"
        }
    ],
    x: 1500,
    y: 1500
})
*/
