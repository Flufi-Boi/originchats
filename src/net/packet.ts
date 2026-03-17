import type { NetUser } from "./user"
import type { Limits } from "./limits"
import type { Server } from "../server"
import type { NetChannel } from "./channel"
import type { NetMessage } from "./message"
import type { NetRole } from "./role"

export type RecievedPacket = (
    // setup
    {
        cmd: "handshake",
        val: {
            limits: Limits,
            server: Server,
            validator_key: string,
            version: string
        }
    } | {
        cmd: "auth_error",
        val: string
    } | {
        cmd: "auth_success",
        val: string
    } | {
        cmd: "ready",
        user: NetUser & { id: string }
    }
) | (
    // users
    {
        cmd: "user_connect",
        user: NetUser & { color: string }
    } | {
        cmd: "user_disconnect",
        username: string
    } | {
        cmd: "users_list",
        users: NetUser[]
    } | {
        cmd: "users_online",
        users: NetUser[]
    }
) | (
    // channels
    {
        cmd: "channels_get",
        val: NetChannel[]
    }
) | (
    // roles
    {
        cmd: "roles_list",
        roles: Record<string, NetRole>
    }
) | (
    // messages
    {
        cmd: "messages_get",
        channel: string,
        messages: NetMessage[],
        range: { start: number, end: number }
    } | {
        cmd: "message_new",
        channel: string,
        message: NetMessage,
        global: boolean
    } | {
        cmd: "message_get",
        channel: string,
        message: NetMessage
    } | {
        cmd: "message_edit",
        id: string,
        content: string,
        global: boolean,
        message: NetMessage
    }
) | {
    cmd: "ping"
} | {
    cmd: "rate_limit",
    length: number
}

export type SendPacket = (
    // setup
    {
        cmd: "auth",
        validator: string
    }
) | (
    // users
    {
        cmd: "users_list"
    } | {
        cmd: "users_online"
    }
) | (
    // channels
    {
        cmd: "channels_get"
    }
) | (
    // roles
    {
        cmd: "roles_list"
    }
) | (
    // messages
    {
        cmd: "message_new",
        channel: string,
        content: string,
        reply_to?: string
    } | {
        cmd: "messages_get",
        channel: string,
        start?: number,
        limit?: number
    } | {
        cmd: "message_get",
        channel: string,
        id: string
    }
)
