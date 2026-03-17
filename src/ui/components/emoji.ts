import twemoji from "@twemoji/api";
import { aliasMap, index } from "./emoji_dataset";

export function replaceEmojiNames(text: string): string {
    /*
    return text.replace(/:([a-z0-9_+-]+):/gi, (m, name) => {
        const e = aliasMap.get(name.toLowerCase());
        return e ?? m;
    });
    */
    return text.replace(/:([a-z0-9_+-]+):/gi, (m, name) => {
        name = name.toLowerCase();

        const entry = index.find(e =>
            e.alias === name || e.primary === name
        );

        return entry ? entry.emoji : m;
    });
}

function fuzzyScore(input: string, word: string): number {
    let i = 0;
    let j = 0;

    while (i < input.length && j < word.length) {
        if (input[i] === word[j]) i++;
        j++;
    }

    return i === input.length ? j : Infinity;
}

function getScore(query: string, alias: string): number {
    if (alias === query)
        return 0;
    
    // hard coded rules
    if (query.startsWith("pe") && alias == "pensive")
        return 0.01;
    if (query.startsWith("so") && alias == "sob")
        return 0.01;
    if (query.startsWith("su") && alias == "sunglasses")
        return 0.01;
    if (query.startsWith("sk") && alias == "skull")
        return 0.01;
    if (query.startsWith("mone") && alias == "money_mouth_face")
        return 0.01;
    if (query.startsWith("rai") && alias == "face_with_raised_eyebrow")
        return 0.01;

    if (alias.startsWith(query))
        return 1 + (alias.length - query.length) * 0.01;

    if (alias.includes(query))
        return 2;

    const fuzzy = fuzzyScore(query, alias);
    if (fuzzy !== Infinity) 
        return 3 + fuzzy * 0.01;

    return Infinity;
}

export function searchEmoji(query: string, limit: number = 8) {
    query = query.toLowerCase();

    let results: { emoji: string, alias: string, primary: string, score: number }[] = [];

    for (let i = 0; i < index.length; i++) {
        const item = index[i];
        const score = getScore(query, item.alias);

        if (score !== Infinity) {
            results.push({ ...item, score });
        }

        if (score == 0) {
            results = [{ ...item, score }];
            break;
        }
    }

    results.sort((a, b) => a.score - b.score);

    const seen = new Set();
    const final = [];

    for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (!seen.has(r.emoji)) {
            seen.add(r.emoji);
            final.push(r);
        }

        if (final.length >= limit)
            break;
    }

    return final;
}

export function generateEmoji(text: string): HTMLElement {
    let elem = document.createElement("span");
    elem.className = "emoji-container";
    elem.innerHTML = twemoji.parse(replaceEmojiNames(text), {
        folder: 'svg',
        ext: '.svg'
    });
    return elem;
}

// @ts-ignore
window.aliasMap = aliasMap;
// @ts-ignore
window.searchEmoji = searchEmoji;
