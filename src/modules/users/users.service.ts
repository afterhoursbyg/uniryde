import { prisma } from "../../lib/prisma";

export const getCurrentUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      profilePhotoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
