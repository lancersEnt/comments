import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(createCommentInput: Prisma.CommentCreateInput) {
    return this.prisma.comment.create({
      data: createCommentInput,
    });
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  findOne(commentWhereUniqueInput: Prisma.CommentWhereUniqueInput) {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    });
  }

  update(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
    updateCommentInput: Prisma.CommentUpdateInput,
  ) {
    return this.prisma.comment.update({
      where: commentWhereUniqueInput,
      data: { ...updateCommentInput, updatedAt: new Date().toISOString() },
    });
  }

  remove(commentWhereUniqueInput: Prisma.CommentWhereUniqueInput) {
    return this.prisma.comment.delete({
      where: commentWhereUniqueInput,
    });
  }

  forPost(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });
  }
  forUser(authorId: string) {
    return this.prisma.comment.findMany({
      where: {
        authorId: authorId,
      },
    });
  }
}
