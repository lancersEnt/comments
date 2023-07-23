import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  const post = await prisma.comment.create({
    data: {
      content: 'salemou 3alaykom',
      postId: 'tesr',
      authorId: 'fakroun',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect;
  });
