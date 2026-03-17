import Prism from "prismjs";
import { TokenType, typeMap } from "./token";
import type { Token } from "./highlighter";

// langs (ik but :sob:)
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-wasm";

const lang_aliases: Record<string, string> = {
    ts: "typescript",
    rs: "rust",
    sh: "bash",
    zsh: "bash",
    fish: "bash",
    yml: "yaml",
    md: "markdown",
    mdx: "markdown",
    wat: "wasm",
};

Prism.languages.insertBefore("rust", "keyword", {
    "macro": {
        pattern: /\b[a-z_][a-z_0-9]*!/,
        alias: "function",
    },
});

const bracket_regex = /^[()[\]{}]$/;

function mapType(type: string): TokenType {
    return typeMap[type] ?? TokenType.Variable;
}

function splitBrackets(content: string, baseType: TokenType): Token[] {
    return content.split(/([()[\]{}])/).filter(Boolean).map(part => ({
        type: bracket_regex.test(part) ? TokenType.Bracket : baseType,
        content: part,
    }));
}

function walkTokens(tokens: (string | Prism.Token)[], inherited: TokenType, lines: Token[][]) {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = tokens[i + 1];
        // pain
        const nextIsCall = typeof next === "string" && /^\s*\(/.test(next) || next instanceof Prism.Token && next.type === "punctuation" && String(next.content).trimStart().startsWith("(");

        if (typeof token === "string") {
            const parts = token.split("\n");
            for (let j = 0; j < parts.length; j++) {
                if (j > 0)
                    lines.push([]);
                if (parts[j])
                    lines[lines.length - 1].push(...splitBrackets(
                        parts[j],
                        nextIsCall ? TokenType.Function : inherited === TokenType.Word ? TokenType.Variable : inherited
                    ));
            }
            continue;
        }

        const type = nextIsCall && !(token.type in typeMap)
            ? TokenType.Function
            : mapType(token.type);

        const content = token.content;
        if (typeof content === "string") {
            const parts = content.split("\n");
            for (let j = 0; j < parts.length; j++) {
                if (j > 0)
                    lines.push([]);
                if (parts[j])
                    lines[lines.length - 1].push(...splitBrackets(parts[j], type));
            }
        } else {
            walkTokens(Array.isArray(content) ? content : [content], type, lines);
        }
    }
}

export function highlight_prism(code: string, lang: string): Token[][] | undefined {
    const grammar = Prism.languages[lang_aliases[lang] ?? lang];
    if (!grammar)
        return;

    const tokens = Prism.tokenize(code, grammar);
    const lines: Token[][] = [[]];
    walkTokens(tokens, TokenType.Word, lines);
    return lines;
}