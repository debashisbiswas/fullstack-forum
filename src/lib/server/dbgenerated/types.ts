import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type post = {
    id: Generated<number>;
    user_id: string;
    title: string;
    content: string;
};
export type reply = {
    id: Generated<number>;
    user_id: string;
    parent_post: number;
    content: string;
};
export type session = {
    id: string;
    user_id: string;
    expires_at: number;
};
export type user = {
    id: string;
    username: string;
    password: string;
};
export type DB = {
    post: post;
    reply: reply;
    session: session;
    user: user;
};
