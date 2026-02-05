/**
 * Dropbox Gallery Serverless Function
 * Lists categories and images from a Dropbox App folder
 * 
 * @param {Object} event - Netlify function event
 * @param {Object} context - Netlify function context
 * @returns {Object} - JSON response with categories and images
 */

const DROPBOX_TOKEN = process.env.DROPBOX_TOKEN;
const DROPBOX_ROOT_PATH = process.env.DROPBOX_ROOT_PATH || ""; // "" for App Folder mode
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const CACHE_TTL_SECONDS = 300; // 5 minute cache

// In-memory cache for the function instance
let memoryCache = {
  data: null,
  timestamp: 0
};

/**
 * Filter image files by extension
 */
function isImageFile(filename) {
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

/**
 * List folder contents from Dropbox API
 */
async function listFolder(path) {
  let entries = [];
  let hasMore = true;
  let cursor = null;

  while (hasMore) {
    const url = cursor 
      ? "https://api.dropboxapi.com/2/files/list_folder/continue"
      : "https://api.dropboxapi.com/2/files/list_folder";
    
    const body = cursor ? { cursor } : { path };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DROPBOX_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dropbox list_folder error (${path}):`, errorText);
      throw new Error(`Dropbox API error: ${response.status}`);
    }

    const data = await response.json();
    entries = entries.concat(data.entries);
    hasMore = data.has_more;
    cursor = data.cursor;
  }

  return entries;
}

/**
 * Get temporary link for a file
 */
async function getTemporaryLink(path) {
  const response = await fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DROPBOX_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ path })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Dropbox get_temporary_link error (${path}):`, errorText);
    throw new Error(`Dropbox API error: ${response.status}`);
  }

  const data = await response.json();
  return data.link;
}

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // Configure this for production
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (!DROPBOX_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "DROPBOX_TOKEN environment variable is not set" })
    };
  }

  // Check cache
  const now = Math.floor(Date.now() / 1000);
  if (memoryCache.data && (now - memoryCache.timestamp) < CACHE_TTL_SECONDS) {
    return { statusCode: 200, headers, body: JSON.stringify(memoryCache.data) };
  }

  try {
    const categories = {};
    const topLevelEntries = await listFolder(DROPBOX_ROOT_PATH);
    const folders = topLevelEntries.filter(entry => entry[".tag"] === "folder");

    // Process each category folder
    for (const folder of folders) {
      const categoryName = folder.name;
      const folderEntries = await listFolder(folder.path_lower);
      const imageFiles = folderEntries.filter(entry => entry[".tag"] === "file" && isImageFile(entry.name));

      const images = [];
      for (const file of imageFiles) {
        try {
          const url = await getTemporaryLink(file.path_lower);
          images.push({
            name: file.name,
            url: url,
            size: file.size,
            id: file.id,
            path_lower: file.path_lower
          });
        } catch (linkError) {
          console.warn(`Skipping file ${file.name} due to link error`);
        }
      }

      if (images.length > 0) {
        categories[categoryName] = images;
      }
    }

    const result = { categories };
    
    // Update cache
    memoryCache = {
      data: result,
      timestamp: now
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error("Gallery function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", message: error.message })
    };
  }
};
