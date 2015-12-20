var block_start = /^\s*"(:?dev|peer|optional|bundled)?[dD]ependencies"\s*:\s*\{\s*$/
  , block_end = /}/
  , is_git_link = /^\s*".*"\s*:\s*"git:\/\/.*"\s*,?\s*$/g
  , get_git_url = /git:\/\/(.*)\.git.*?/

function makeLink(el, dep_name) {
  var line_text = el.innerText
    , link

  if (is_git_link.test(line_text)) {
    var match = line_text.match(get_git_url)

    if (match && match[1]) {
      link = 'https://' + [1]
    }
  } else {
    link = '"https://npmjs.com/package/' + dep_name + '"'
  }

  if (link) {
    $(el).find('span')[0].innerHTML = '<a href=' + link + '>"' + dep_name + '"</a>'
  }
}

function getDepName(el) {
  var match = el.innerText.match(/\s*"([^"]+)".*$/)
  return match && match[1]
}


function linkify() {
  var lines = $('table.js-file-line-container td')

  if (!lines.length) return

  for (var line = 0; line < lines.length; line++) {
    if (block_start.test(lines[line].innerText)) {
      while (line < lines.length && !block_end.test(lines[++line].innerText)) {
        var dep = getDepName(lines[line])

        if (dep) {
          makeLink(lines[line], dep)
        }
      }
    }
  }
}

chrome.extension.onMessage.addListener(function () {
  linkify()
});