import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Prisma } from '@prisma/client';
import { Comment, Post, User } from './graphql';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation('createComment')
  create(
    @Args('createCommentInput') createCommentInput: Prisma.CommentCreateInput,
  ) {
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
