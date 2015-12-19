var lines = $('table.js-file-line-container td')

if (lines.length) {
  var start = 0, end = 0

  for (var line = 0; line < lines.length; line++) {
    var line_text = lines[line].innerText

    if (/^\s*"dependencies":\s*\{\s*$/.test(line_text)) {
      start = line
    }

    if (start) {
      if (/}/.test(line_text)) {
        end = line
        break
      }
    }
  }

  for (line = start + 1; line < end; line++) {
    var dep = lines[line].innerText.match(/\s*"([^"]+)".*$/)

    dep = dep && dep[1]

    if (dep) {
      $(lines[line]).find('span')[0].innerHTML = '<a href="https://npmjs.com/package/' + dep + '">"' + dep + '"</a>'
    }
  }
}
