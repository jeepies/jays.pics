import { PrismaClient } from '@prisma/client';

const extendedClient = new PrismaClient().$extends({
  model: {
    user: {
      async delete({ where }: { where: { id: string | undefined } }) {
        return extendedClient.user.update({
          where: {
            ...where,
          },
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
    comment: {
      async delete({ where }: { where: { id: string | undefined } }) {
        return extendedClient.comment.update({
          where: {
            ...where,
          },
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
    image: {
      async delete({ where }: { where: { id: string | undefined } }) {
        return extendedClient.image.update({
          where: {
            ...where,
          },
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
    imageComment: {
      async delete({ where }: { where: { id: string | undefined } }) {
        return extendedClient.imageComment.update({
          where: {
            ...where,
          },
          data: {
            deleted_at: new Date(),
          },
        });
      },
    },
  },
  query: {
    user: {
      async $allOperations({ operation, args, query }: any) {
        if (operation === 'findUnique' || operation === 'findMany') {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      },
    },
    comment: {
      async $allOperations({ operation, args, query }: any) {
        if (operation === 'findUnique' || operation === 'findMany') {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      },
    },
    image: {
      async $allOperations({ operation, args, query }: any) {
        if (operation === 'findUnique' || operation === 'findMany') {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      },
    },
    imageComment: {
      async $allOperations({ operation, args, query }: any) {
        if (operation === 'findUnique' || operation === 'findMany') {
          args.where = { ...args.where, deleted_at: null };
        }
        return query(args);
      },
    },
  },
});
type extendedClientType = typeof extendedClient;

if (!global.__prisma) {
  global.__prisma = extendedClient;
}

declare global {
  var __prisma: extendedClientType;
}

global.__prisma.$connect();
export const prisma = global.__prisma;
