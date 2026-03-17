import * as events from "../events";
import * as state from "./state";
import * as rotur from "../net/rotur";
import type { User } from "../user";
import { generateUser } from "./components/user";

export function generate() {
    const container = document.getElementById("user-list")!;
    container.innerHTML = "";
    
    if (!rotur.user) {
        container.innerHTML = "<p class=\"not-logged-in\">not logged in :P</p>";
        return;
    }

    const server = state.selectedServer;
    if (!server) {
        container.innerHTML = "<p class=\"not-selected-server\">no server selected</p>";
        return;
    }
    
    const sorted = sortUsers(Object.values(server.users));
    
    for (let i = 0; i < sorted.length; i++) {
        const chunk = sorted[i];

        if (chunk[1].length == 0)
            continue;
        
        const chunkElem = document.createElement("div");

        const roleElem = document.createElement("h4");
        roleElem.textContent = chunk[0];
        chunkElem.appendChild(roleElem);

        const contentElem = document.createElement("div");
        for (let i = 0; i < chunk[1].length; i++) {
            const user = chunk[1][i];
            
            contentElem.appendChild(generateUser(user));
        }
        chunkElem.appendChild(contentElem);

        container.appendChild(chunkElem);
    }
}

export function sortUsers(users: User[]): [string, User[]][] {
    const owner: User[] = [];
    const online: User[] = [];
    const offline: User[] = [];

    const sort = (usrs: User[]) => usrs.sort((a,b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        
        if (user.online) {
            if (user.roles.includes("owner"))
                owner.push(user);
            else
                online.push(user);
        } else {
            offline.push(user);
        }
    }

    return [
        ["owner", sort(owner)],
        ["online", sort(online)],
        ["offline", sort(offline)],
    ];
}

events.listen(events.EventName.Login, () => {
    generate();
});
events.listen(events.EventName.UserListChange, () => {
    generate();
});
