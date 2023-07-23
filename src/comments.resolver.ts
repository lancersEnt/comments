import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';
import { Comment, Post, User } from './graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  //*Queries
  @Query('comments')
  findAll() {
    return this.commentsService.findAll();
  }
  @Query('postComments')
  postComments(@Args('postId') postId: string) {
    return this.commentsService.postComments(postId);
  }

  @Query('comment')
  findOne(@Args('id') id: string) {
    return this.commentsService.findOne({ id });
  }

  //* Mutations
  @Mutation('createComment')
  @UseGuards(JwtAuthGuard)
  create(
    @Args('createCommentInput') createCommentInput: Prisma.CommentCreateInput,
    @Context() context: any,
  ) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    createCommentInput.authorId = userId;
    const created = this.commentsService.create(createCommentInput);
    pubSub.publish('commentCreated', {
      commentCreated: { newComment: created },
    });
    return created;
  }

  @Mutation('updateComment')
  update(
    @Args('id') id: string,
    @Args('updateCommentInput') updateCommentInput: Prisma.CommentUpdateInput,
  ) {
    return this.commentsService.update({ id }, updateCommentInput);
  }

  @Mutation('removeComment')
  remove(@Args('id') id: string) {
    return this.commentsService.remove({ id });
  }

  @Mutation('likeComment')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Args('commentId') commentId: string,
    @Context() context: any,
  ) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    const commentLiked = await this.commentsService.likeComment(
      userId,
      commentId,
    );
    pubSub.publish('commentLiked', { commentLiked: { comment: commentLiked } });
    return true;
  }

  @Mutation('unlikeComment')
  @UseGuards(JwtAuthGuard)
  async unlikeComment(
    @Args('commentId') commentId: string,
    @Context() context: any,
  ) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    const commentLiked = await this.commentsService.unlikeComment(
      userId,
      commentId,
    );
    pubSub.publish('commentUnliked', {
      commentUnliked: { comment: commentLiked },
    });
    return true;
  }

  //* Subscriptions
  @Subscription(() => Comment, {
    // filter(payload, variables) {
    //   return payload.commentCreated.newComment.postId === variables.postId;
    // },
  })
  commentCreated() {
    return pubSub.asyncIterator('commentCreated');
  }

  @Subscription()
  commentLiked() {
    return pubSub.asyncIterator('commentLiked');
  }

  @Subscription()
  commentUnliked() {
    return pubSub.asyncIterator('commentUnliked');
  }

  //* Fields resolvers
  @ResolveField(() => Post)
  post(@Parent() comment: Comment) {
    return { __typename: 'Post', id: comment.postId };
  }

  @ResolveField('likers', (returns) => [User])
  async likers(@Parent() comment: Comment): Promise<User[]> {
    const { likersIds } = comment;
    const likers: User[] = [];
    for (const userId of likersIds) {
      const user = { __typename: 'User', id: userId };
      likers.push(user);
    }
    return likers;
  }

  @ResolveField(() => User)
  user(@Parent() comment: Comment) {
    return { __typename: 'User', id: comment.authorId };
  }
}
