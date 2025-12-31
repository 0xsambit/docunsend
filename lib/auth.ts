import { prisma } from "./prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "docunsend-secret-key-2025";

export interface UserPayload {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export async function createSession(user: UserPayload): Promise<string> {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      sessionToken: token,
      userId: user.id,
      expires,
    },
  });

  return token;
}

export async function getSession(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded.userId) return null;

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    await prisma.session.deleteMany({
      where: { sessionToken: token },
    });
  }
}

export async function findOrCreateUser(profile: {
  email: string;
  name: string;
  image: string;
  googleId: string;
}): Promise<UserPayload> {
  let user = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        image: profile.image,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider: "google",
        providerAccountId: profile.googleId,
      },
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
  };
}
