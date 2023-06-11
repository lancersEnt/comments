import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from '@prisma/client';
import { Post } from './graphql';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @ResolveField(() => [Comment])
  comments(@Parent() post: Post): Promise<Comment[]> {
    return this.commentsService.forPost(post.id);
  }
}
