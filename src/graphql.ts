
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateCommentInput {
    content: string;
    authorId?: Nullable<string>;
    postId?: Nullable<string>;
    postOwnerId: string;
    postSubscribers?: Nullable<string>;
    createdAt?: Nullable<DateTime>;
}

export class UpdateCommentInput {
    content?: Nullable<string>;
    authorId?: Nullable<string>;
    postOwnerId?: Nullable<string>;
    postId?: Nullable<string>;
    updatedAt?: Nullable<DateTime>;
}

export class Post {
    id: string;
    comments?: Nullable<Comment[]>;
}

export class User {
    id: string;
    comments?: Nullable<Comment[]>;
}

export class Comment {
    id: string;
    content: string;
    authorId: string;
    postId: string;
    postOwnerId: string;
    post?: Nullable<Post>;
    user?: Nullable<User>;
    likersIds?: Nullable<Nullable<string>[]>;
    likers?: Nullable<Nullable<User>[]>;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
}

export abstract class IQuery {
    abstract comments(): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;

    abstract postComments(postId: string): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;

    abstract comment(id: string): Nullable<Comment> | Promise<Nullable<Comment>>;
}

export abstract class IMutation {
    abstract createComment(createCommentInput: CreateCommentInput): Comment | Promise<Comment>;

    abstract updateComment(id: string, updateCommentInput: UpdateCommentInput): Comment | Promise<Comment>;

    abstract removeComment(id: string): Comment | Promise<Comment>;

    abstract likeComment(commentId: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract unlikeComment(commentId: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export class CommentResult {
    newComment?: Nullable<Comment>;
}

export class CommentLikedResult {
    comment?: Nullable<Comment>;
}

export abstract class ISubscription {
    abstract commentCreated(postId: string): Nullable<CommentResult> | Promise<Nullable<CommentResult>>;

    abstract commentLiked(postId: string): Nullable<CommentLikedResult> | Promise<Nullable<CommentLikedResult>>;

    abstract commentUnliked(postId: string): Nullable<CommentLikedResult> | Promise<Nullable<CommentLikedResult>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
