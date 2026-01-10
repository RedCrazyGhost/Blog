export const TextRenderer = {
    text(text: string) {
        return text.replace(/\n/g, '<br>');
    }
};