const COPY_BTN_SELECTOR = "[data-code-copy]";
const COPIED_LABEL = "已复制";
const DEFAULT_LABEL = "复制";
const RESET_MS = 2000;

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export function bindCodeBlockCopy(root: HTMLElement): () => void {
  const onClick = async (event: MouseEvent) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
      COPY_BTN_SELECTOR,
    );
    if (!target || !root.contains(target)) return;

    const block = target.closest(".code-block");
    const codeEl = block?.querySelector("pre code");
    if (!codeEl) return;

    const text = codeEl.textContent ?? "";
    const ok = await copyText(text);
    if (!ok) return;

    const prev = target.textContent;
    target.textContent = COPIED_LABEL;
    window.setTimeout(() => {
      if (target.isConnected) {
        target.textContent = prev === COPIED_LABEL ? DEFAULT_LABEL : prev;
      }
    }, RESET_MS);
  };

  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
