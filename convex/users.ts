import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"
import bcrypt from "bcryptjs"

export default defineSchema({
    todos: defineTable({
        text: v.string(),
        isCompleted: v.boolean(),
        userId: v.id("users")
    }),
    users: defineTable({
        fullname: v.string(),
        username: v.string(),
        password: v.string()
    })
})  

export const login = mutation({
    args: {
        username: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
            .filter((q) => q.eq(q.field("username"), args.username))
            .unique();

        if (!user) {
            return { success: false, message: "User not found!" }
        }

        const passwordCorrect = bcrypt.compareSync(args.password, user.password)

        if (!passwordCorrect) {
            return { success: false, message: "Invalid credentials!" }
        }

        return {
            success: true,
            userId: user._id
        }
    }
})

export const register = mutation({
  args: {
    fullname: v.string(),
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users")
      .filter((q) => q.eq(q.field("username"), args.username))
      .unique();

    if (user) {
      return { success: false, message: "User already exists!" };
    }

    const hashedPassword = bcrypt.hashSync(args.password, 10);

    const userId = await ctx.db.insert("users", {
      fullname: args.fullname,
      username: args.username,
      password: hashedPassword,
    });

    return {
      success: true,
      userId,
    };
  },
});
//