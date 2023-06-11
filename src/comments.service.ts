import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(createCommentInput: Prisma.CommentCreateInput) {
    const now = new Date().toISOString();
    createCommentInput.createdAt = now;
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
    const now = new Date().toISOString();
    updateCommentInput.updatedAt = now;
    return this.prisma.comment.update({
      where: commentWhereUniqueInput,
      data: updateCommentInput,
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
}
