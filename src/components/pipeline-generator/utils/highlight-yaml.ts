type HighlightTheme = "light" | "dark";

const THEME_CLASSES: Record<
  HighlightTheme,
  { key: string; string: string; number: string; bool: string; expr: string; anchor: string; comment: string }
> = {
  light: {
    key: "text-blue-500 font-semibold",
    string: "text-green-600",
    number: "text-orange-500",
    bool: "text-purple-600",
    expr: "text-yellow-600",
    anchor: "text-pink-500",
    comment: "text-muted-foreground italic",
  },
  dark: {
    key: "text-sky-300 font-semibold",
    string: "text-emerald-300",
    number: "text-amber-300",
    bool: "text-violet-300",
    expr: "text-yellow-300",
    anchor: "text-pink-300",
    comment: "text-white/40 italic",
  },
};

export function highlightYAML(yaml: string, theme: HighlightTheme = "light"): string {
  const c = THEME_CLASSES[theme];

  let highlighted = yaml
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  highlighted = highlighted.replace(
    /^(\s*)#.*$/gm,
    `$1<span class="${c.comment}">$&</span>`
  );

  highlighted = highlighted.replace(
    /^(\s*)([\w\-]+):/gm,
    `$1<span class="${c.key}">$2</span>:`
  );

  highlighted = highlighted.replace(
    /: ("[^"]*")/g,
    `: <span class="${c.string}">$1</span>`
  );
  highlighted = highlighted.replace(
    /: ('[^']*')/g,
    `: <span class="${c.string}">$1</span>`
  );

  highlighted = highlighted.replace(
    /: (\d+)/g,
    `: <span class="${c.number}">$1</span>`
  );

  highlighted = highlighted.replace(
    /: (true|false)/g,
    `: <span class="${c.bool}">$1</span>`
  );

  highlighted = highlighted.replace(
    /(\${{[^}]+}})/g,
    `<span class="${c.expr}">$1</span>`
  );

  highlighted = highlighted.replace(
    /(&[\w\-]+)/g,
    `<span class="${c.anchor}">$1</span>`
  );
  highlighted = highlighted.replace(
    /(\*[\w\-]+)/g,
    `<span class="${c.anchor}">$1</span>`
  );

  return highlighted;
}
