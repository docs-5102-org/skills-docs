#!/usr/bin/env python3
"""批量把文档转换成 Markdown。单个文件失败只记录，不中断。

用法:
    python batch_convert.py <文件或目录> -o <输出目录> [--ext .pdf .docx ...]
"""
import argparse
import sys
from pathlib import Path

from markitdown import MarkItDown

DEFAULT_EXTS = {
    ".pdf", ".docx", ".pptx", ".xlsx", ".xls", ".html", ".htm",
    ".csv", ".json", ".xml", ".epub", ".txt", ".zip",
}


def collect(src: Path, exts: set[str]) -> list[Path]:
    if src.is_file():
        return [src]
    return sorted(p for p in src.rglob("*") if p.is_file() and p.suffix.lower() in exts)


def main() -> int:
    ap = argparse.ArgumentParser(description="批量转换为 Markdown")
    ap.add_argument("source", type=Path, help="文件或目录")
    ap.add_argument("-o", "--output", type=Path, required=True, help="输出目录")
    ap.add_argument("--ext", nargs="*", help="只处理这些扩展名，如 .pdf .docx")
    args = ap.parse_args()

    if not args.source.exists():
        print(f"路径不存在: {args.source}", file=sys.stderr)
        return 2

    exts = {e if e.startswith(".") else f".{e}" for e in args.ext} if args.ext else DEFAULT_EXTS
    files = collect(args.source, {e.lower() for e in exts})
    if not files:
        print("没有找到可转换的文件")
        return 1

    args.output.mkdir(parents=True, exist_ok=True)
    base = args.source if args.source.is_dir() else args.source.parent
    md = MarkItDown()
    ok, failed = 0, []

    for f in files:
        rel = f.relative_to(base).with_suffix(".md")
        target = args.output / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            result = md.convert(str(f))
            text = getattr(result, "markdown", None) or result.text_content
            target.write_text(text, encoding="utf-8")
            ok += 1
            print(f"OK   {f} -> {target} ({len(text)} 字符)")
        except Exception as e:  # noqa: BLE001
            failed.append((f, e))
            print(f"FAIL {f}: {type(e).__name__}: {e}", file=sys.stderr)

    print(f"\n完成: 成功 {ok}, 失败 {len(failed)}")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
