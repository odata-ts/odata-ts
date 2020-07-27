import * as fs from "fs";
import * as path from "path";

export class XmlWriter {
  private readonly _stream: fs.WriteStream;
  private readonly _stack: { tag: string; ns: Map<string, unknown> }[] = [];
  private readonly _indent: string;

  constructor(path: string) {
    this._indent = "    ";
    this._stream = fs.createWriteStream(path);
    this._stream.write(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    );
  }

  start(tag: string, attributes: {} = {}) {
    this.writeStart(tag, attributes, false);
  }

  startend(tag: string, attributes: {} = {}) {
    this.writeStart(tag, attributes, true);
  }

  private writeStart(tag: string, attributes: {}, close: boolean) {
    const indent = this._indent.repeat(this._stack.length);

    const declarations = new Map(
      Object.entries(attributes)
        .filter(([k, v]) => k.startsWith("xmlns"))
        .map(([k, v]) => [k.split(":")[1], v])
    );
    this._stack.push({ tag, ns: declarations });

    const [prefix, suffix] = tag.split(":", 2);
    if (suffix) {
      const ns = this._stack.find((frame) => frame.ns.get(prefix));
      if (!ns) {
        throw new XmlWriterError(`no namespace declared for '${prefix}'`);
      }
    }

    const attrs = Object.entries(attributes)
      .filter(([k, v]) => v)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");
    this._stream.write(`${indent}<${tag} ${attrs}${close ? "/" : ""}>\n`);

    if (close) this._stack.pop();
  }

  end(tag?: string) {
    const n = tag
      ? this._stack.length - this._stack.findIndex(({ tag: t }) => t === tag)
      : 1;

    for (let i = 0; i < n; i++) {
      const top = this._stack.pop();
      if (top) {
        let { tag, ns } = top;
        const indent = "    ".repeat(this._stack.length);
        this._stream.write(`${indent}</${tag}>\n`);
      } else {
        throw new XmlWriterError("nothing to end.");
      }
    }
  }

  close() {
    if (this._stack.length > 0) {
      const open = this._stack.map(({ tag }) => tag).join(" ");
      console.error(
        `closing writer before all tags are closed (open: ${open})`
      );
    }
    // while (this._stack.length > 0) {
    //   this.end();
    // }
    this._stream.close();
  }
}

class XmlWriterError extends Error {
  constructor(message: string) {
    super(message);
  }
}
