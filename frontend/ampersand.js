let colors = [
    {pattern: /^(let|def|mod|use)$/, css: 'amp-keyword'}, // keywords, like let
    {pattern: /^".*"$/, css: 'amp-string'}, // operators, like =
    {pattern: /^(=|:|and|or|any\*|opt|\$|\+|-|==)$/, css: 'amp-operator'}, // operators, like =
    {pattern: /.*/, css: 'amp-generic'}, // everything else
];

function dbg(x) {
    console.log(x);
    return x;
}

function color(word) {
    return colors.filter((color) => color.pattern.test(word))
        .map((color) => `<span class="${color.css}">${word}</span>`)[0];
}

function pad(str, width) {
    return '&nbsp;'.repeat(width - str.length) + str;
}

// this function doesn't work
// the examples in this documentation are written to work with this though
function ampify(class_name, lineno) {
    Array.prototype.forEach.call(document.getElementsByClassName(class_name), (code) => {
        code.innerHTML = code.innerHTML
            .trim()
            .split('\n')
            .map((line, index) => {
                let prefix = '&nbsp;';
                if (lineno) {
                    prefix = `<span class="amp-lineno">${pad((index + 1).toString(), 3)}</span>&nbsp;`;
                }
                return prefix + line.split('"')
                    .map((str, index) => {
                        if (index & 1) {
                            return color(`"${str}"`);
                        } else {
                            return str.split(/;/)
                                .map((stmt) => {
                                    let notrim = true;
                                    let words = stmt.split(/\s/)
                                        .filter((word) => {
                                            if (word.length > 0) {
                                                notrim = false;
                                            }
                                            if (notrim) {
                                                return true;
                                            } else {
                                                return word.length > 0;
                                            }
                                        });
                                    notrim = true;
                                    return words
                                        .map((word) => {
                                            if (word.length > 0) {
                                                notrim = false;
                                            }
                                            if (notrim) {
                                                return '&nbsp;';
                                            } else {
                                                return color(word);
                                            }
                                        })
                                        .map(color)
                                        .join(' ');
                                })
                                .join(color(';'));
                        }
                    })
                    .join('')
                    // the following is a hack
                    .replace('><span class="amp-string">', '> <span class="amp-string">');
            })
            .join('<br/>');
    });
}

function astify(class_name, lineno) {
    Array.prototype.forEach.call(document.getElementsByClassName(class_name), (code) => {
        code.innerHTML = code.innerHTML
            .trim()
            .split('\n')
            .map((line, index) => {
                let prefix = '&nbsp;';
                if (lineno) {
                    prefix = `<span class="amp-lineno">${pad((index + 1).toString(), 3)}</span>&nbsp;`;
                }
                let notrim = true;
                return prefix + line
                    .split(/\s/)
                    .map((word) => {
                        if (word.length > 0) {
                            notrim = false;
                        }
                        if (notrim) {
                            return '&nbsp;';
                        } else {
                            return color(word);
                        }
                    })
                    .join(' ');
            })
            .join('<br/>');
    });
}

ampify('block', true);
ampify('inline', false);
astify('ast', true);
