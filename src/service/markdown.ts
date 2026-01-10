import { marked } from "marked";
import { CodeRenderer } from "@/utils/markdown/renderers/code";
import { TableRenderer } from "@/utils/markdown/renderers/table";
import { BlockquoteRenderer } from "@/utils/markdown/renderers/blockquote";
import { ImageRenderer } from "@/utils/markdown/renderers/image";
import { TextRenderer } from "@/utils/markdown/renderers/text";
import type { MarkdownContent } from "@/types/markdown";
import { logger } from "@/utils/logger";

marked.use(
  { renderer: BlockquoteRenderer },
  { renderer: TableRenderer },
  { renderer: CodeRenderer },
  { renderer: TextRenderer },
  { renderer: ImageRenderer }
);

export class MarkdownService {
  async parseHTML(markdown: string): Promise<string> {
    try {
      return marked(markdown);
    } catch (error) {
      logger.error("Error parsing markdown:", error);
      return "Error parsing markdown content";
    }
  }

  sortMarkdowns(markdowns: MarkdownContent[]): MarkdownContent[] {
    return [...markdowns].sort((a, b) => b.number - a.number);
  }

  insertMarkdown(
    markdowns: MarkdownContent[],
    newMarkdown: MarkdownContent
  ): MarkdownContent[] {
    const index = markdowns.findIndex((md) => md.number === newMarkdown.number);
    if (index !== -1) {
      // Update existing markdown
      const updatedMarkdowns = [...markdowns];
      updatedMarkdowns[index] = newMarkdown;
      return updatedMarkdowns;
    }

    // Insert new markdown in sorted order
    const newMarkdowns = [...markdowns, newMarkdown];
    return this.sortMarkdowns(newMarkdowns);
  }
}
