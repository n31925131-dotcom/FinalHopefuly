const DROPBOX_API = "https://api.dropboxapi.com/2";

async function dropboxRequest(endpoint, body) {
  const res = await fetch(`${DROPBOX_API}${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.DROPBOX_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function handler() {
  try {
    // App Folder root = ""
    const list = await dropboxRequest("/files/list_folder", {
      path: "",
      recursive: false
    });

    const categories = {};

    for (const entry of list.entries) {
      if (entry[".tag"] !== "folder") continue;

      const files = await dropboxRequest("/files/list_folder", {
        path: entry.path_lower,
        recursive: false
      });

      categories[entry.name] = [];

      for (const file of files.entries) {
        if (file[".tag"] !== "file") continue;

        const link = await dropboxRequest(
          "/files/get_temporary_link",
          { path: file.path_lower }
        );

        categories[entry.name].push({
          name: file.name,
          url: link.link
        });
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ categories })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
