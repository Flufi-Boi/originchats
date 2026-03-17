import * as events from "../events";
import * as rotur from "../net/rotur";

export function generate() {
    const container = document.getElementById("user-panel")!;
    container.innerHTML = "";

    if (!rotur.user) {
        container.innerHTML = "<p class=\"not-logged-in\">not logged in :P</p>";
        return;
    }

    const pfp = document.createElement("img");
    pfp.src = rotur.user.pfp;
    container.appendChild(pfp);

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = rotur.user.username;
    container.appendChild(name);
}

events.listen(events.EventName.Login, () => {
    generate();
});
