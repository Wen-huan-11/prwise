import NextAuth, { type AuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import { persistLog } from '@/lib/log';

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
        try {
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
        } catch (err) {
          await persistLog({ level: 'ERROR', source: 'auth', message: `Failed to upsert user ${p.login}`, metadata: { githubId: p.id, error: err instanceof Error ? err.message : String(err) } });
          return false;
        }
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
