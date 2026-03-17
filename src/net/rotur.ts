import * as auth from "../auth";
import * as idb from "../idb";
import * as events from "../events";

import type { RoturUser } from "./user";

export let user: RoturUser | undefined = undefined;

export function fetchUser(tkn: string) {
    fetch("https://api.rotur.dev/get_user?auth=" + tkn)
        .then(r => r.json())
        .then(r => {
            user = r;
            events.invoke(events.EventName.Login, tkn);
        });
}

idb.get("token", tkn => {
    if (!tkn)
        auth.openAuth();
    
    auth.setToken(tkn);
    fetchUser(tkn);
}, () => {
    auth.openAuth();
});
