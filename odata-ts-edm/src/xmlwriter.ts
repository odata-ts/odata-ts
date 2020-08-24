import * as fs from "fs";
import * as path from "path";

export class XmlWriter {
  private readonly stream: fs.WriteStream;
  private readonly stack: { tag: string; ns: Map<string, unknown> }[] = [];
  private readonly indent: string;

  constructor(path: string, indent: number = 2) {
    this.indent = " ".repeat(indent);
    this.stream = fs.createWriteStream(path);
    this.stream.write(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n`
    );
  }

  public start(tag: string, attributes: {} = {}) {
    this.writeStart(tag, attributes, false);
  }

  public empty(tag: string, attributes: {} = {}) {
    this.writeStart(tag, attributes, true);
  }

  public end(tag?: string) {
    const n = tag
      ? this.stack.length - this.stack.findIndex(({ tag: t }) => t === tag)
      : 1;

    for (let i = 0; i < n; i++) {
      const top = this.stack.pop();
      if (top) {
        let { tag, ns } = top;
        const indent = this.indent.repeat(this.stack.length);
        this.stream.write(`${indent}</${tag}>\n`);
      } else {
        throw new XmlWriterError("nothing to end.");
      }
    }
  }

  public close() {
    if (this.stack.length > 0) {
      const open = this.stack.map(({ tag }) => tag).join(" ");
      console.error(
        `closing writer before all tags are closed (open: ${open})`
      );
    }
    // while (this._stack.length > 0) {
    //   this.end();
    // }
    this.stream.close();
  }

  private writeStart(tag: string, attributes: {}, close: boolean) {
    const indent = this.indent.repeat(this.stack.length);

    const declarations = new Map(
      Object.entries(attributes)
        .filter(([k, v]) => k.startsWith("xmlns"))
        .map(([k, v]) => [k.split(":")[1], v])
    );
    this.stack.push({ tag, ns: declarations });

    const [prefix, suffix] = tag.split(":", 2);
    if (suffix) {
      const ns = this.stack.find((frame) => frame.ns.get(prefix));
      if (!ns) {
        throw new XmlWriterError(`no namespace declared for '${prefix}'`);
      }
    }

    const attrs = Object.entries(attributes)
      .filter(([k, v]) => v)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");
    this.stream.write(`${indent}<${tag} ${attrs}${close ? "/" : ""}>\n`);

    if (close) this.stack.pop();
  }
}

class XmlWriterError extends Error {
  constructor(message: string) {
    super(message);
  }
}
