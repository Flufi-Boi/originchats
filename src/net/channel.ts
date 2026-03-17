import type { Permissions } from "../permissions";

export type NetChannel = {
    type: "text",
    name: string,
    display_name?: string,
    icon?: string,
    description?: string,
    permissions: Permissions
} | {
    type: "voice",
    name: string,
    display_name?: string,
    icon?: string,
    description?: string,
    voice_state: {
        username: string,
        muted: boolean
    }[]
} | {
    type: "separator"
};
// TOOD: voice
