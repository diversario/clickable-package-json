function makeLink(el, dep_name) {
  var link = '"https://npmjs.com/package/' + dep_name + '"'
  $(el).find('span')[0].innerHTML = '<a href=' + link + '>"' + dep_name + '"</a>'
}

function getDepName(el) {
  var match = el.innerText.match(/\s*"([^"]+)".*$/)
  return match && match[1]
}

function linkify() {
  var lines = $('table.js-file-line-container td')

  if (!lines.length) return

  var start_dep
    , end_dep
    , start_dev_dep
    , end_dev_dep
    , start_opt_dep
    , end_opt_dep

  for (var line = 0; line < lines.length; line++) {
    var line_text = lines[line].innerText

    if (!start_dep && /^\s*"dependencies"\s*:\s*\{\s*$/.test(line_text)) {
      start_dep = line
    }

    if (!start_dev_dep && /^\s*"devDependencies"\s*:\s*\{\s*$/.test(line_text)) {
      start_dev_dep = line
    }

    if (!start_opt_dep && /^\s*"optionalDependencies"\s*:\s*\{\s*$/.test(line_text)) {
      start_opt_dep = line
    }

    if (/}/.test(line_text)) {
      if (start_dep && !end_dep) {
        end_dep = line
      } else if (start_dev_dep && !end_dev_dep) {
        end_dev_dep = line
      } else if (start_opt_dep && !end_opt_dep) {
        end_opt_dep = line
      }
    }

    if (start_dep && end_dep && start_dev_dep && end_dev_dep) {
      break
    }
  }

  for (line = start_dep + 1; line < end_dep; line++) {
    var dep = getDepName(lines[line])

    if (dep) {
      makeLink(lines[line], dep)
    }
  }

  for (line = start_dev_dep + 1; line < end_dev_dep; line++) {
    dep = getDepName(lines[line])

    if (dep) {
      makeLink(lines[line], dep)
    }
  }

  for (line = start_opt_dep + 1; line < end_opt_dep; line++) {
    dep = getDepName(lines[line])

    if (dep) {
      makeLink(lines[line], dep)
    }
  }
}

chrome.extension.onMessage.addListener(function () {
  linkify()
});
