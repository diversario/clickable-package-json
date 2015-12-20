var block_start = /^\s*,?\s*"(:?dev|peer|optional|bundled)?[dD]ependencies"\s*:\s*\{\s*$/
  , block_end = /}/
  , is_git_link = /^\s*,?\s*".*"\s*:\s*"git:\/\/.*"\s*,?\s*$/
  , get_git_url = /git:\/\/(.*)\.git.*?/

function makeLink(el, dep_name) {
  var line_text = el.innerText
    , link

  if (is_git_link.test(line_text) || line_text.split('/').length == 2 ) {
    var match = line_text.match(get_git_url)

    if (match && match[1]) {
      link = 'https://' + match[1]
    } else { // maybe it's a "user/repo" format
      try {
        var parts = line_text.split(':')[1].trim().split('"')[1].split('/')
        var username = parts[0]
        var repo = parts[1].split('#')[0]
        link = 'https://github.com/' + username + '/' + repo
      } catch(e) {}
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