import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

// Only these emails can sign in
const ALLOWED_EMAILS = ['strieblev@gmail.com']

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as AuthOptions['adapter'],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile https://www.googleapis.com/auth/gmail.readonly',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific emails to sign in
      if (!user.email || !ALLOWED_EMAILS.includes(user.email.toLowerCase())) {
        return false
      }
      return true
    },
    async session({ session, user }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = user.id
      }

      // Get the account with access token
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: 'google' },
      })

      if (account?.access_token) {
        session.accessToken = account.access_token
      }

      return session
    },
  },
  session: {
    strategy: 'database',
  },
}
