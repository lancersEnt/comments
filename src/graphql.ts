/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCommentInput {
    content: string;
    authorId: string;
    postId?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
}

export class UpdateCommentInput {
    content?: Nullable<string>;
    authorId?: Nullable<string>;
    postId?: Nullable<string>;
    updatedAt?: Nullable<DateTime>;
}

export class Post {
    id: string;
    comments?: Nullable<Comment[]>;
}

export class Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    post?: Nullable<Post>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract comments(): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;

    abstract comment(id: string): Nullable<Comment> | Promise<Nullable<Comment>>;
}

export abstract class IMutation {
    abstract createComment(createCommentInput: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(id: string, updateCommentInput: UpdateCommentInput): Comment | Promise<Comment>;

    abstract removeComment(id: string): Comment | Promise<Comment>;
}

export type DateTime = any;
type Nullable<T> = T | null;
