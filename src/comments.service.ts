import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { KafkaService } from './kafka/kafka.service';
import { Notification } from './utils/interfaces/notification.interface';
import capitalize from './utils/capitalize';
import getSender from './utils/getSender';
import { log } from 'console';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  async create(createCommentInput: Prisma.CommentCreateInput) {
    const comment = await this.prisma.comment.create({
      data: createCommentInput,
    });

    // Publish event to add user to post subscribers
    if (comment.postOwnerId !== comment.authorId)
      this.kafka.produce(
        'posts_subs',
        JSON.stringify({
          type: 'subscribe',
          payload: {
            id: createCommentInput.authorId,
            postId: createCommentInput.postId,
          },
        }),
      );

    const sender = await getSender(createCommentInput.authorId);

    const newCommentNotif: Notification = {
      payload: {
        title: `Comment Created - ${comment.id}`,
        body: `${capitalize(sender.firstname)} ${capitalize(
          sender.lastname,
        )} a commenté votre publication`,
        createdBy: createCommentInput.authorId,
        targetUserId: createCommentInput.postOwnerId,
        action: `/publication/${comment.postId}`,
      },
    };

    await this.kafka.produce('notifications', JSON.stringify(newCommentNotif));
    const subs = JSON.parse(createCommentInput.postSubscribers);

    // const subs = Object.values(createCommentInput.postSubscribers);
    subs.forEach(async (sub) => {
      const newCommentNotifSubscribers: Notification = {
        payload: {
          title: `Comment Created - ${comment.id}`,
          body: `${capitalize(sender.firstname)} ${capitalize(
            sender.lastname,
          )} a commenté une publication que vous suivez`,
          createdBy: createCommentInput.authorId,
          targetUserId: sub.id,
          action: `/publication/${comment.postId}`,
        },
      };
      await this.kafka.produce(
        'notifications',
        JSON.stringify(newCommentNotifSubscribers),
      );
    });
    return comment;
  }

  findAll() {
    return this.prisma.comment.findMany();
  }

  postComments(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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

  async likeComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    const likers = comment.likersIds;

    if (!comment) throw new Error('comment not found');
    if (likers.includes(userId)) throw new Error('already liked');
    likers.push(userId);
    try {
      const like = await this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likersIds: likers,
        },
      });

      const sender = await getSender(userId);

      const CommentLikedNotification: Notification = {
        payload: {
          title: `Comment Liked - ${comment.id}`,
          body: `${capitalize(sender.firstname)} ${
            sender.lastname
          } a aimé votre commentaire`,
          createdBy: userId,
          targetUserId: comment.authorId,
          action: `/publication/${comment.postId}`,
        },
      };
      this.kafka.produce(
        'notifications',
        JSON.stringify(CommentLikedNotification),
      );
      return like;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async unlikeComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    let likers = comment.likersIds;

    if (!comment) throw new Error('comment not found');
    if (!likers.includes(userId)) throw new Error('already not liked');
    likers = likers.filter((id) => {
      return id !== userId;
    });
    try {
      return await this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likersIds: likers,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
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
      orderBy: {
        createdAt: 'desc',
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
