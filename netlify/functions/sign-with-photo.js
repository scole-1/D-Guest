import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, photo } = JSON.parse(event.body || "{}");
  if (!name || !photo) {
    return { statusCode: 400, body: "Missing data" };
  }

  try {
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: name } }]
        },
        Signed: { checkbox: true },
        "Signed At": {
          date: { start: new Date().toISOString() }
        },
        "Photo URL": {
          rich_text: [{ text: { content: photo } }]
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Save failed" })
    };
  }
}
