import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaService } from 'prisma/prisma.service';
import { PostsResolver } from './posts.resolver';
import { UsersResolver } from './users.resolver';
import { AuthModule } from './auth/auth.module';
import { KafkaService } from './kafka/kafka.service';

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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: '/graphql',
      typePaths: ['./**/*.normal.graphql'],
      resolvers: {
        DateTime: GraphQLISODateTime,
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    AuthModule,
  ],
  providers: [
    PrismaService,
    KafkaService,
    CommentsResolver,
    CommentsService,
    PostsResolver,
    UsersResolver,
  ],
})
export class CommentsModule {}
