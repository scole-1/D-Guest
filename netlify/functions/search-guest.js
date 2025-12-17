import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

export const handler = async (event) => {
  const query = event.queryStringParameters?.query?.trim() || "";

  if (!query) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify([])
    };
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Name",
        title: { contains: query }
      }
    });

    const guests = response.results.map(page => ({
      id: page.id,
      name:
        page.properties.Name?.title
          ?.map(t => t.plain_text)
          .join("") || "Unnamed",
      signed: page.properties.Signed?.checkbox || false
    }));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(guests)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
