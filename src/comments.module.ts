import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaService } from 'prisma/prisma.service';
import { PostsResolver } from './posts.resolver';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      typePaths: ['./**/*.graphql'],
      resolvers: {
        DateTime: GraphQLISODateTime,
      },
    }),
  ],
  providers: [
    PrismaService,
    CommentsResolver,
    CommentsService,
    PostsResolver,
    UsersResolver,
  ],
})
export class CommentsModule {}
