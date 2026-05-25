export function highlightYAML(yaml: string): string {
  let highlighted = yaml
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  highlighted = highlighted.replace(
    /^(\s*)#.*$/gm,
    '$1<span class="text-muted-foreground italic">$&</span>'
  );

  highlighted = highlighted.replace(
    /^(\s*)([\w\-]+):/gm,
    '$1<span class="text-blue-500 font-semibold">$2</span>:'
  );

  highlighted = highlighted.replace(
    /: ("[^"]*")/g,
    ': <span class="text-green-600">$1</span>'
  );
  highlighted = highlighted.replace(
    /: ('[^']*')/g,
    ': <span class="text-green-600">$1</span>'
  );

  highlighted = highlighted.replace(
    /: (\d+)/g,
    ': <span class="text-orange-500">$1</span>'
  );

  highlighted = highlighted.replace(
    /: (true|false)/g,
    ': <span class="text-purple-600">$1</span>'
  );

  highlighted = highlighted.replace(
    /(\${{[^}]+}})/g,
    '<span class="text-yellow-600">$1</span>'
  );

  highlighted = highlighted.replace(
    /(&[\w\-]+)/g,
    '<span class="text-pink-500">$1</span>'
  );
  highlighted = highlighted.replace(
    /(\*[\w\-]+)/g,
    '<span class="text-pink-500">$1</span>'
  );

  return highlighted;
}
