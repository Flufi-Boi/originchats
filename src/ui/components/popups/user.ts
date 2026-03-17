import { getDisplayName, type User } from "../../../user";
import { closePopup, type Popup } from "../popup";

export const UserPopup = (user: User): Popup => {
    return {
        generate(parent) {
            const container = document.createElement("div");
            container.id = "user-popup";

            parent.addEventListener("click", () => {
                closePopup();
            });

            const top_section = document.createElement("div");
            top_section.className = "top";
            
            const banner = document.createElement("header");
            top_section.appendChild(banner);
            
            const pfp = document.createElement("img");
            pfp.src = `https://avatars.rotur.dev/${user.username}`;
            top_section.appendChild(pfp);

            container.appendChild(top_section);
            
            const body = document.createElement("div");
            body.className = "body";

            const name_str = getDisplayName(user);

            const name = document.createElement("h2");
            name.textContent = name_str[0].toUpperCase() + name_str.slice(1).toLowerCase();
            body.appendChild(name);

            container.appendChild(body);

            parent.appendChild(container);
            return container;
        }
    }
}
