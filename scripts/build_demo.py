"""Bundle the browser demo into one offline HTML file. Python standard library only."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
html = (root / "demo/index.html").read_text()
css = (root / "demo/style.css").read_text()
core = (root / "src/engine.js").read_text()
ui = (root / "demo/app.js").read_text()
html = html.replace('<link rel="stylesheet" href="/demo/style.css">', '<style>' + css + '</style>')
html = html.replace('<script src="/src/engine.js"></script>', '<script>' + core + '</script>')
html = html.replace('<script src="/demo/app.js"></script>', '<script>' + ui + '</script>')
(root / "index.html").write_text(html)
print("Built index.html")
