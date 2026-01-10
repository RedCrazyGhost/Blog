import { useThemeStore } from '@/stores/Theme';

export const TableRenderer = {
    table(header: string, body: string) {
        const theme = useThemeStore();
        return `<div class="table-responsive">
            <table class="table table-hover align-middle ${theme.GetTableColor}">
                <thead class="thead-${theme.GetThemeColor}">${header}</thead>
                <tbody>${body}</tbody>
            </table>
        </div>`;
    },
    
    tablecell(content: string, flags: any) {
        const tag = flags.header ? "th" : "td";
        return `<${tag} class="text-center">${content}</${tag}>`;
    }
};