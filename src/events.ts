
export enum EventName {
    Login,
    
    ServersChange,
    ChannelsChange,
    MessagesChange,
    MessageBarChange,
    MessageBarContentChange,
    ReplyBarChange,
    PopupChange,
    RightClickChange,
    UserListChange,
    ServerPanelChange,

    NewMessage
}

export type Listener = (...data: any[]) => void;

export const events: Partial<Record<EventName, Listener[]>> = {};

export function listen(ev: EventName, listener: Listener) {
    //console.log(`[ev] added event listener for ${EventName[ev]}`);
    events[ev] ??= [];
    events[ev].push(listener);
}

export function invoke(ev: EventName, ...data: any[]) {
    let listeners = events[ev];
    if (listeners)
        console.log(`[ev] invoked ${EventName[ev]} for ${listeners?.length} listener${listeners!.length > 1 ? "s" : ""}`);
    if (listeners)
        for (let i = 0; i < listeners.length; i++) {
            listeners[i](...data);
        }
}
