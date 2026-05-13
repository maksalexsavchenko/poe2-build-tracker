import { NextAuthOptions } from "next-auth";
import { prisma } from "./db";

const GGG_AUTHORIZE_URL = "https://www.pathofexile.com/oauth/authorize";
const GGG_TOKEN_URL = "https://www.pathofexile.com/oauth/token";
const GGG_PROFILE_URL = "https://api.pathofexile.com/profile";

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "ggg",
      name: "Path of Exile",
      type: "oauth",
      authorization: {
        url: GGG_AUTHORIZE_URL,
        params: {
          scope: "account:profile account:characters",
          response_type: "code",
        },
      },
      token: GGG_TOKEN_URL,
      userinfo: {
        url: GGG_PROFILE_URL,
        async request({ tokens }) {
          const res = await fetch(GGG_PROFILE_URL, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": `OAuth ${process.env.GGG_CLIENT_ID}/1.0 (contact: ${process.env.CONTACT_EMAIL ?? "admin@poe2-build-tracker.online"})`,
            },
          });
          return res.json();
        },
      },
      clientId: process.env.GGG_CLIENT_ID,
      clientSecret: process.env.GGG_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.uuid ?? profile.name,
          name: profile.name,
          email: null,
          image: null,
        };
      },
      checks: ["pkce", "state"],
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "ggg") return false;

      await prisma.user.upsert({
        where: { gggAccountName: user.name ?? "" },
        update: {
          accessToken: account.access_token,
          refreshToken: account.refresh_token ?? null,
        },
        create: {
          gggAccountName: user.name ?? "",
          accessToken: account.access_token,
          refreshToken: account.refresh_token ?? null,
        },
      });

      return true;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.gggAccountName = token.name ?? "";
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
