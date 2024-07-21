function linkify(text = "") {
  // Regular expression to find URLs not already in <a> tags
  var urlRegex = /(^|[^'"])(https?:\/\/[^\s<>"']+)/gi;

  // Replace plain text URLs by hyperlinks, skipping those already in <a> tags
  return text.replace(urlRegex, function (match, prefix, url) {
    // Check if the URL is already within an <a> tag
    if (
      /<a\s+(?:[^>]*?\s+)?href=(?:(['"])(?:\\[\s\S]|(?!\1)[^\\])*?\1|([^\s>]+))[^>]*>/i.test(
        match
      )
    ) {
      return match; // Return the matched URL unchanged if it's already in an <a> tag
    } else {
      // Otherwise, replace with a clickable <a> tag
      return prefix + '<a href="' + url + '" target="_blank">' + url + "</a>";
    }
  });
}

module.exports = {
  linkify,
};
