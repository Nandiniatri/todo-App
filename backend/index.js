import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all todos
app.get("/todos", async (req, res) => {
    const { data, error } = await supabase.from("todos").select("*").order("id", { ascending: true });
    if (error) return res.status(400).json({ error });
    res.json(data);
});

// Add new todo
app.post("/todos", async (req, res) => {
    const { title } = req.body;
    const { data, error } = await supabase.from("todos").insert([{ title }]).select();
    if (error) return res.status(400).json({ error });
    res.json(data[0]);
});

// Update todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { title, is_completed } = req.body;
    const { data, error } = await supabase
        .from("todos")
        .update({ title, is_completed })
        .eq("id", id)
        .select();
    if (error) return res.status(400).json({ error });
    res.json(data[0]);
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) return res.status(400).json({ error });
    res.json({ success: true });
});

app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
