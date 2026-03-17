
export type RoturUser = {
    username: string,
    password: string,
    key: string,

    wallpaper: string,
    wallpaper_mode: "Fill" | "Center" | "Fit" | "Stretch"

    private: boolean,
    pfp: string,
    theme: {
        accent: string,
        background: string,
        primary: string,
        secondary: string,
        tertiary: string,
        text: string,
        selected_col: string,
        show_outline: boolean
    },
    pronouns?: string,
    bio?: string,
    banner?: string,

    system: string,
    max_size: number,
    created: number,

    "sys.currency": number,
    "sys.friends": string[],
    "sys.requests": string[],
    "sys.badges": string[],
    "sys.purchases": string[],
    "sys.total_logins": number,
    "sys.transactions": (({
        amount: number,
        note: number,
        user: string,
        time: number
    } & ({ type: "escrow_out" | "escrow_in", petition_id: string } | { type: "out" | "in" | "gamble" })) | string)[],
    "sys.used_systems": string[]
};

export type NetUser = {
    color?: string,
    username: string,
    nickname?: string,
    roles: string[],
}
