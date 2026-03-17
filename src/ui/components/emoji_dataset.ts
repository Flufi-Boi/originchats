import data from "emoji-datasource";

export const aliasMap = new Map<string, string>();
export const index: { emoji: string, alias: string, primary: string }[] = [];

for (let i = 0; i < data.length; i++) {
    let e = data[i];
    const emoji = String.fromCodePoint(...e.unified.split("-").map(x => parseInt(x,16)));

    for (const name of e.short_names) {
        aliasMap.set(name, emoji);
    }
}

for (let i = 0; i < data.length; i++) {
    let e = data[i];
    const emoji = String.fromCodePoint(...e.unified.split("-").map(u => parseInt(u, 16)));

    const aliases = [
        ...(e.short_names || [])
    ];

    for (const alias of aliases) {
        index.push({
            emoji,
            alias: alias.toLowerCase(),
            primary: e.short_name
        });
    }
}