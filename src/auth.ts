import * as idb from "./idb";

import { fetchUser } from "./net/rotur";

export let token: string | null = null;
export const setToken = (tkn: string) => { token = tkn };

export function openAuth(): Promise<string> {
    return new Promise((resolve) => {
        const iframe = document.createElement("iframe");
        iframe.src = "https://rotur.dev/auth";

        const container = document.getElementById("auth")!;
        container.style.display = "";
        container.appendChild(iframe);

        function handleMessage(event: MessageEvent) {
            if (event.origin !== "https://rotur.dev")
                return;

            if (event.source !== iframe.contentWindow)
                return;

            if (event.data?.type === "rotur-auth-token") {
                token = event.data.token;

                window.removeEventListener("message", handleMessage);
                container.style.display = "none";
                container.removeChild(iframe);

                fetchUser(token!);
                idb.set("token", token);
                resolve(token!);
            }
        }

        window.addEventListener("message", handleMessage);
    });
}
