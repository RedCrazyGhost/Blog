export const ImageRenderer = {
    image(href: string, title: string | null, text: string) {
        title = title || text;
        return `<img src="${href}" alt="${text}" title="${title}" style="width: 100%;height: auto;" loading="lazy">`;
    }
};