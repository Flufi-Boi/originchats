
export type TextChannel = {
    type: "text",
    name: string,
    display_name?: string,
    icon?: string,
    description?: string,

    messages?: string[]
};

export type VoiceChannel = {
    type: "voice",
    name: string,
    display_name?: string,
    icon?: string,
    description?: string,
    voice_state: {
        username: string,
        muted: boolean
    }[],

    messages?: string[]
};

export type Channel = TextChannel | VoiceChannel;
