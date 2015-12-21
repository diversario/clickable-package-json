var block_start = /^\s*,?\s*"(:?dev|peer|optional|bundled)?[dD]ependencies"\s*:\s*\{\s*$/
  , block_end = /}/
  , is_git_link = /^\s*,?\s*".*"\s*:\s*"(git|https?):\/\/.*"\s*,?\s*$/
  , get_git_url = /(?:git|https?):\/\/(.*)\.git.*?/
  , dependency_name = /\s*"([^"]+)".*$/

function get_gh_username_repo(line_text) {
  var parts = line_text.split(':')[1].trim().split('"')[1].split('/')
  var username = parts[0]
  var repo = parts[1].split('#')[0]

  return {username, repo}
}

function makeLink(el, dep_name) {
  var line_text = el.innerText
    , link

  if (is_git_link.test(line_text) || line_text.split('/').length == 2 ) {
    var repo_path_match = line_text.match(get_git_url)

    if (repo_path_match && repo_path_match[1]) {
      link = `https://${repo_path_match[1]}`
    } else { // maybe it's a "user/repo" format
      try {
        var info = get_gh_username_repo(line_text)
        link = `https://github.com/${info.username}/${info.repo}`
      } catch(e) {}
    }
  } else {
    link = `"https://npmjs.com/package/${dep_name}"`
  }

  if (link) {
    $(el).find('span')[0].innerHTML = `"<a href=${link}>${dep_name}</a>"`
  }
}

function getDepName(el) {
  var match = el.innerText.match(dependency_name)
  return match && encodeURIComponent(match[1])
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