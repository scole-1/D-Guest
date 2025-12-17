import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { id } = JSON.parse(event.body || "{}");
  if (!id) {
    return { statusCode: 400, body: "Missing ID" };
  }

  try {
    await notion.pages.update({
      page_id: id,
      properties: {
        Signed: { checkbox: true },
        "Signed At": {
          date: { start: new Date().toISOString() }
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
      body: JSON.stringify({ error: "Update failed" })
    };
  }
}
