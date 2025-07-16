import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { serve } from "@hono/node-server";
import { db } from "../db";
import { sql } from 'drizzle-orm';

const app = new Hono();

app.use('*', cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type'],
}))

app.get("/get", async (c) => {
    const result = await db.execute("select 1");
    return c.json(result)
});

app.get("/api/users", async (c) => {
    const result = await db.execute("SELECT * FROM users");
    return c.json(result.rows);
});

app.post("/api/users/add", async (c) => {
    const { name, age } = await c.req.json();
    const result = await db.execute(
        sql`INSERT INTO users (name, age) VALUES (${name}, ${age}) RETURNING *`
    );
    return c.json(result.rows[0]);
});

app.put("/api/users/edit/:id", async (c) => {
    const id = c.req.param("id");
    const { name, age } = await c.req.json();
    const result = await db.execute(
        sql`UPDATE users SET name = ${name}, age = ${age} WHERE user_id = ${id} RETURNING *`
    );
    return c.json(result.rows[0]);
});

app.delete("/api/users/delete/:id", async (c) => {
    const id = c.req.param("id");
    const result = await db.execute(
        sql`DELETE FROM users WHERE user_id = ${id} RETURNING *`
    );
    return c.json(result.rows[0]);
});

serve({
    fetch: app.fetch,
    port: 2000,
});

console.log("✅ Hono server running at http://localhost:2000");