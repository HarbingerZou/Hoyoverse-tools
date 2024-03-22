// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import sanitize from 'mongo-sanitize'
import bcrypt from 'bcryptjs';
import UserModel from '../../../models/userModel';

export default NextAuth({
  providers: [
    Credentials({
        name: 'Credentials',
        credentials: {
          email: { label: "email", type: "text" },
          password: {  label: "Password", type: "password" },
        },
        async authorize(credentials: Record<"email" | "password", string> | undefined, req) {
          if (!credentials) {
            // Reject the promise with a custom error message
            return Promise.reject(new Error("Credentials not provided"));
          }
        
          const user = await UserModel.findOne({ email: credentials.email });
        
          if (!user) {
            // User not found
            return Promise.reject(new Error("No user found with the given email"));
          } else if (!bcrypt.compareSync(credentials.password, user.password)) {
            // Password does not match
            return Promise.reject(new Error("Incorrect password"));
          } else {
            // Successful authentication
            const userObject = {
              id: user.id,
              name: user.username,
              email: user.email,
            };
            return userObject;
          }
        }
        
    }),
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  callbacks: {

    //always allow sign in
    async signIn({user, account, profile}) {
      return true
    },

    //redirect to home page
    async redirect({url, baseUrl}) {
      //return baseUrl
      return baseUrl
    },

    //triggered when login/logout


    //user is the output of the authorize function
    //token is the jwt
    //acount is the credential
    async jwt({ token, user, account, profile }) {
      if (user) {
        // It's important not to include sensitive information or large objects in the token
        //console.log(user)
        token.user = { id: user.id, name: user.name, email: user.email };
      }
      if(account){
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      // Add the user info and provider to the session
      if(token.user) {
        session.user = token.user; 
      }
      return session;
    }

  },
  
  pages: {
    signIn: '/signIn', 
  },
})
