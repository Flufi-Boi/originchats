import { getDisplayName, type User } from "../../user";
import { openPopup } from "./popup";
import { UserPopup } from "./popups/user";
import * as right_click from "../right_click";
import * as right_click_menus from "../right_click_menus";

export function generateUser(user: User): HTMLElement {
    const elem = document.createElement("div");
    elem.className = "user-component";
    elem.addEventListener("click", () => {
        openPopup(UserPopup(user));
    });
    elem.addEventListener("contextmenu", (e) => {
        right_click.openRightClickContextMenu(right_click_menus.Menus.user(user), e);

        e.preventDefault();
    });
    
    const pfp = document.createElement("img");
    pfp.src = `https://avatars.rotur.dev/${user.username}`;
    elem.appendChild(pfp);
    
    const name = document.createElement("span");
    if (user.color)
        name.style.color = user.color;
    name.textContent = getDisplayName(user);
    elem.appendChild(name);

    return elem;
}
