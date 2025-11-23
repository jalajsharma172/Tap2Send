import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  walletAddress: text("wallet_address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  walletAddress: text("wallet_address").notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  senderPhone: text("sender_phone").notNull(),
  receiverPhone: text("receiver_phone").notNull(),
  receiverWallet: text("receiver_wallet").notNull(),
  amount: decimal("amount", { precision: 18, scale: 2 }).notNull(),
  status: text("status").notNull().default('pending'),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
}).extend({
  amount: z.string().or(z.number()).transform(val => String(val)),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export const updateUserSchema = z.object({
  phoneNumber: z.string().optional(),
  walletAddress: z.string().optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const updateTransactionSchema = z.object({
  status: z.string().optional(),
  txHash: z.string().optional(),
});

export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
