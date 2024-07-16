module.exports = function tilFilter(collection) {
  console.log("🔴", collection);

  const tils = collection
    .map((item) => {
      // extract date
      let { body, tags, title } = convertHtmlToData(item.content);
      const date = item.fileSlug.slice(0, 10);
      const data = { date, tags, title };
      return { ...item, data: { ...item.data, ...data }, content: body };
    })
    .toSorted((a, b) => b.data.date.localeCompare(a.data.date));

  return tils;
};

function convertHtmlToData(html = "") {
  // Extract tags
  // Extract title
  let tags = [];
  let title = "";

  let htmlByLine = html.split("\n");
  const removeIndex = [];

  for (let i = 0; i < htmlByLine.length; i++) {
    const line = htmlByLine[i];

    // If there are tags, split them into an array without the #
    // <p>#writing #blogging</p> -> ["writing", "blogging"]
    if (/^<p>#[a-z]/.test(line)) {
      const regex = /<p>(.*?)<\/p>/;
      const match = regex.exec(line);
      if (match) {
        tags = match[1]
          .trim()
          .split(" ")
          .map((tag) => tag.slice(1));
      }

      removeIndex.push(i);
    }
    // If it is the heading1, extract it
    else if (line.startsWith("<h1>")) {
      const regex = /<h1>(.*?)<\/h1>/;
      const match = regex.exec(line);
      if (match) {
        title = match[1];
      }

      removeIndex.push(i);
      break;
    }
  }

  htmlByLine = htmlByLine.filter((_, i) => !removeIndex.includes(i));

  return {
    body: htmlByLine.join("\n"),
    tags,
    title,
  };
}
