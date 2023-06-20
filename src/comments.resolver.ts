import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Context,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';
import { Comment, Post, User } from './graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Resolver('Comment')
@UseGuards(JwtAuthGuard)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation('createComment')
  create(
    @Args('createCommentInput') createCommentInput: Prisma.CommentCreateInput,
    @Context() context: any,
  ) {
    const { req: request, res } = context;
    const userId: string = request.user.userId;
    createCommentInput.authorId = userId;
    return this.commentsService.create(createCommentInput);
  }

  @Query('comments')
  findAll() {
    return this.commentsService.findAll();
  }

  @Query('comment')
  findOne(@Args('id') id: string) {
    return this.commentsService.findOne({ id });
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

  @ResolveField(() => Post)
  post(@Parent() comment: Comment) {
    return { __typename: 'Post', id: comment.postId };
  }

  @ResolveField(() => User)
  user(@Parent() comment: Comment) {
    return { __typename: 'User', id: comment.authorId };
  }
}
