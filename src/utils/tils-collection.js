function markdownToTilsData(markdown) {
  // Extract tags
  // Extract title
  let tags = [];
  let title = "";

  let markdownByLine = markdown.split("\n");

  for (let i = 0; i < markdownByLine.length; i++) {
    const line = markdownByLine[i];

    // If there are tags, split them into an array without the #
    // #writing #blogging -> ["writing", "blogging"]
    if (/^#[a-z]/.test(line)) {
      tags = line
        .trim()
        .split(" ")
        .map((tag) => tag.slice(1));

      // Remove the line
      markdownByLine.splice(i, 1);
    }
    // If it is the heading1, extract it
    else if (line.startsWith("# ")) {
      title = line.slice(2);

      // Remove the line
      markdownByLine.splice(i, 1);
    }
  }

  return {
    newRawMarkdown: markdownByLine.join("\n"),
    tags,
    title,
  };
}

module.exports = { markdownToTilsData };
