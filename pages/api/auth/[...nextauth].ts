// import NextAuth from 'next-auth';
// import GithubProvider from 'next-auth/providers/github';

// export default NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//   ],
//   callbacks: {
//     // U token spremi korisnički ID
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.id = profile.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.id = token.id;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });