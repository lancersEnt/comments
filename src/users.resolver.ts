import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from '@prisma/client';
import { User } from './graphql';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @ResolveField(() => [Comment])
  comments(@Parent() user: User): Promise<Comment[]> {
    return this.commentsService.forUser(user.id);
  }
}
