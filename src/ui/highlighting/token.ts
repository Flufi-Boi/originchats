export enum TokenType {
    Word,
    Keyword,
    Constant,
    Operator,
    Variable,
    Type,
    Function,
    Macro,
    Punctuation,
    Bracket,
    String,
    Comment,
    Decorator,
    PropertyHolder,
    Escape,
    Subst,
    Regexp,
    Symbol,
    Property,
    Meta,
    Title,
    Tag,
    Attribute,
}

export const typeMap: Record<string, TokenType> = {
    "keyword":                  TokenType.Keyword,
    "important":                TokenType.Keyword,
    "atrule":                   TokenType.Keyword,
    "selector-pseudo":          TokenType.Keyword,
    "meta keyword":             TokenType.Keyword,

    "built_in":                 TokenType.Function,
    "function":                 TokenType.Function,

    "macro":                    TokenType.Macro,

    "type":                     TokenType.Type,
    "class-name":               TokenType.Type,
    "namespace":                TokenType.Type,
    "builtin":                  TokenType.Type,
    "selector-class":           TokenType.Type,
    "title.class":              TokenType.Type,
    "title.class.inherited":    TokenType.Type,

    "literal":                  TokenType.Constant,
    "number":                   TokenType.Constant,
    "boolean":                  TokenType.Constant,
    "variable.constant":        TokenType.Constant,

    "operator":                 TokenType.Operator,

    "punctuation":              TokenType.Punctuation,
    "bullet":                   TokenType.Punctuation,

    "variable":                 TokenType.Variable,
    "variable.language":        TokenType.Variable,
    "template-variable":        TokenType.Variable,
    "params":                   TokenType.Variable,

    "string":                   TokenType.String,
    "char":                     TokenType.String,
    "template-string":          TokenType.String,
    "attr-value":               TokenType.String,
    "url":                      TokenType.String,
    "code":                     TokenType.String,
    "quote":                    TokenType.String,
    "meta string":              TokenType.String,

    "char.escape":              TokenType.Escape,
    "char-class":               TokenType.Escape,
    "escape":                   TokenType.Escape,

    "subst":                    TokenType.Subst,

    "regexp":                   TokenType.Regexp,
    "regex":                    TokenType.Regexp,
    "formula":                  TokenType.Regexp,

    "symbol":                   TokenType.Symbol,

    "property":                 TokenType.Property,

    "comment":                  TokenType.Comment,
    "block-comment":            TokenType.Comment,
    "prolog":                   TokenType.Comment,
    "doctype":                  TokenType.Comment,
    "doctag":                   TokenType.Comment,

    "meta":                     TokenType.Meta,
    "meta.prompt":              TokenType.Meta,

    "title":                    TokenType.Title,
    "title.function":           TokenType.Function,
    "title.function.invoke":    TokenType.Function,
    "section":                  TokenType.Title,
    "selector-id":              TokenType.Title,
    "inserted":                 TokenType.Title,
    "deleted":                  TokenType.Title,

    "tag":                      TokenType.Tag,
    "name":                     TokenType.Tag,
    "selector-tag":             TokenType.Tag,
    "template-tag":             TokenType.Tag,

    "attr":                     TokenType.Attribute,
    "attribute":                TokenType.Attribute,
    "attr-name":                TokenType.Attribute,
    "selector-attr":            TokenType.Attribute,

    "decorator":                TokenType.Decorator,
};