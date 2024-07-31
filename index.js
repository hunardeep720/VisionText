const { ImageAnalysisClient } = require("@azure-rest/ai-vision-image-analysis");
const fs = require("fs");
const path = require("path");
const createClient = require("@azure-rest/ai-vision-image-analysis").default;
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = ["Caption", "Read"];

const imagePath = path.join(
  __dirname,
  "public",
  "image",
  "SL-081322-52440-04.jpg"
);

async function analyzeImageFromFile() {
  const image = fs.readFileSync(imagePath);

  const result = await client.path("/imageanalysis:analyze").post({
    body: image,
    queryParameters: {
      features: features,
    },
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  const iaResult = result.body;

  if (iaResult) {
    iaResult.error
      ? iaResult.error.message
      : iaResult.readResult.blocks.forEach((block) => {
          JSON.stringify(
            block.lines.forEach((line) => console.log(`${line.text}`))
          );
        });
  }
}

analyzeImageFromFile().catch((err) => {
  console.error("Error analyzing image:", err);
});
