
  export function cleanMarkdown(context_text: string) {
    context_text = replaceAll(context_text, "=", '');
    context_text = replaceAll(context_text, "+", '');
    context_text = replaceAll(context_text, "-", '');
    context_text = replaceAll(context_text, '_', '');
    context_text = replaceAll(context_text, '*', '');
    context_text = replaceAll(context_text, "\\", '');
    context_text = replaceAll(context_text, '(', '');
    context_text = replaceAll(context_text, ')', '');
    context_text = replaceAll(context_text, "/", '');
    context_text = replaceAll(context_text, "%", '');
    context_text = replaceAll(context_text, "^", '');
    context_text = replaceAll(context_text, "#", '');
    context_text = replaceAll(context_text, "@", '');
    context_text = replaceAll(context_text, "!", '');
    context_text = replaceAll(context_text, "?", '');
    context_text = replaceAll(context_text, ".", '');
    context_text = replaceAll(context_text, "'", '');
    context_text = replaceAll(context_text, `"`, '');
    context_text = replaceAll(context_text, "`", '');
    context_text = replaceAll(context_text, "naked", '');
    context_text = replaceAll(context_text, "nude", '');
    context_text = replaceAll(context_text, "asshole", '');
    context_text = replaceAll(context_text, "anus", '');
    context_text = replaceAll(context_text, "cock", '');
    context_text = replaceAll(context_text, "cunt", '');
    context_text = replaceAll(context_text, "dick", '');
    context_text = replaceAll(context_text, "penis", '');
    context_text = replaceAll(context_text, "drugs", '');
    context_text = replaceAll(context_text, "nigger", '');
    context_text = replaceAll(context_text, "chink", '');
    context_text = replaceAll(context_text, "dyke", '');
    context_text = replaceAll(context_text, "faggot", '');
    context_text = replaceAll(context_text, "fag", '');
    context_text = replaceAll(context_text, "shit", 'brown goo');
    context_text = replaceAll(context_text, "retarded", 'goofy');
    context_text = replaceAll(context_text, "bloody", 'red liquid');
    context_text = replaceAll(context_text, "blood", 'red liquid');
    context_text = replaceAll(context_text, "dildo", 'candle');
    return context_text;
  }

  function replaceAll(str, find, replace): string {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  function escapeRegExp(str): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
