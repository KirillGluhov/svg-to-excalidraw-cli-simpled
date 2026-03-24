import fs from 'node:fs/promises'
import path from 'node:path'
import { convert } from "headless-svg-to-excalidraw";

const [,,inputDir, outputDir = './out'] = process.argv;

if (!inputDir) {
  console.error("Не указана директория с svg")
  process.exit(1);
}

async function run() {
  await fs.mkdir(outputDir, {recursive: true});

  const files = await fs.readdir(inputDir);
  const svgFiles = files.filter(f => f.endsWith(".svg"));

  console.log(`${svgFiles.length} svg файла`)

  for (const file of svgFiles) {
    const fullPath = path.join(inputDir, file);

    try {
      const svg = await fs.readFile(fullPath, 'utf-8');

      const {content} = convert(svg);

      const outPath = path.join(outputDir, file.replace(".svg", ".excalidraw"))

      await fs.writeFile(
        outPath,
        JSON.stringify(content, null, 2),
        "utf-8"
      );

      console.log(`${file}`)
    } catch (err) {
      console.error(`${file}: ${err.message}`)
    }
  }

  console.log("Done")
}

run();