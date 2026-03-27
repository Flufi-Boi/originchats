import { type Server } from "../server";
import * as events from "../events";
import { storage } from "../local_storage";

export let selectedServer: Server | null = null;
export const selectServer = (server: Server) => {
    selectedServer = server;
    storage.set("selected_server", server.url);
    events.invoke(events.EventName.ChannelsChange);
    events.invoke(events.EventName.MessagesChange);
    events.invoke(events.EventName.MessageBarChange);
    events.invoke(events.EventName.UserListChange);
    events.invoke(events.EventName.ServerPanelChange);
}
export const deselectServer = () => {
    selectedServer = null;
    storage.set("selected_server", null);
    events.invoke(events.EventName.ChannelsChange);
    events.invoke(events.EventName.MessagesChange);
    events.invoke(events.EventName.MessageBarChange);
    events.invoke(events.EventName.UserListChange);
    events.invoke(events.EventName.ServerPanelChange);
}
