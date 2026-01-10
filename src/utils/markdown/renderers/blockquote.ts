import { useThemeStore } from '@/stores/Theme';

export const BlockquoteRenderer = {
    blockquote(quote: string) {
        const theme = useThemeStore();
        return `<blockquote class="bd-callout bd-callout-${theme.GetThemeColor}">${quote}</blockquote>`;
    }
};