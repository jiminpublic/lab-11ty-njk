function tilContentFilter(content = "") {
  let htmlByLine = content.split("\n");
  const removeIndex = [];

  for (let i = 0; i < htmlByLine.length; i++) {
    const line = htmlByLine[i];

    // If there are tags in the line, remove the line
    // <p>#writing #blogging</p>
    if (/^<p>#\S/.test(line)) {
      removeIndex.push(i);
    }
    // If it is the heading1, remove the line
    else if (line.startsWith("<h1>")) {
      removeIndex.push(i);
      break;
    }
  }

  htmlByLine = htmlByLine.filter((_, i) => !removeIndex.includes(i));
  // const newContent = linkify(htmlByLine.join("\n"));
  const newContent = htmlByLine.join("\n");
  return newContent;
}

module.exports = { tilContentFilter };
