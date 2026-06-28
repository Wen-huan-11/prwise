import NextAuth, { type AuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'github' && profile) {
        const p = profile as { id: number; login: string; name?: string; email?: string; avatar_url?: string };
        await prisma.user.upsert({
          where: { githubId: p.id },
          update: {
            login: p.login,
            name: p.name ?? p.login,
            email: p.email ?? '',
            avatarUrl: p.avatar_url ?? '',
          },
          create: {
            githubId: p.id,
            login: p.login,
            name: p.name ?? p.login,
            email: p.email ?? '',
            avatarUrl: p.avatar_url ?? '',
          },
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

export const handler = NextAuth(authOptions);
