
export type User = {
    username: string,
    nickname?: string,
    color?: string,
    roles: string[],
    online?: boolean,
    instances?: number
};

export function getDisplayName(user: User): string {
    return user.nickname ?? user.username;
}
