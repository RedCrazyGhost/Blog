import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { marked } from "marked";
import hljs from 'highlight.js';
import { useThemeStore } from '@/stores/Theme';
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: true,
})


const theme = useThemeStore()


// const CheckboxRenderer = {
//     checkbox(checked: boolean){        
//         return `<input type="checkbox" disabled ${checked ? "checked" : ""} />`
//     }
// }

const CodeRenderer = {
    code(code: string, infostring: string | undefined, escaped: boolean){
        switch(infostring){
            case "":
                return ""
            case "mysql":
            case "MySQL":
            case "MYSQL":
                return `<pre class="language-mysql pre-${theme.GetThemeColor}"><code class="language-mysql">${hljs.highlight(code, {language: "sql", ignoreIllegals: escaped }).value}</code></pre>`
            case "Mermaid":
            case "mermaid":
                return `<pre class="mermaid">${code}</pre>`
            default:
                return `<pre class="language-${infostring} pre-${theme.GetThemeColor}"><code class="language-${infostring}">${hljs.highlight(code, {language: String(infostring), ignoreIllegals: escaped }).value}</code></pre>`
        }
    }
}
const TableRenderer ={
    table(header:string,body:string){
        return `<div class="table-responsive">
        <table class="table table-hover align-middle ${theme.GetTableColor}">
        <thead class="thead-${theme.GetThemeColor}">${header}</thead>
        <tbody>${body}</tbody>
        </table>
        </div>`
    }
}
const TableCellRenderer ={
    tablecell(content:string,flags:any){
        const tag = flags.header ? "th" : "td"
        return `<${tag} class="text-center">${content}</${tag}>`
    }
}

const BlockquoteRenderer = {
    blockquote(quote:string){        
        return `<blockquote class="bd-callout bd-callout-${theme.GetThemeColor}">${quote}</blockquote>`
    }
}


marked.use({renderer: BlockquoteRenderer});
marked.use({renderer: TableRenderer});
marked.use({renderer: TableCellRenderer});
marked.use({renderer: CodeRenderer});
// marked.use({renderer: CheckboxRenderer});




export const useMarkdownStore = defineStore('Markdown',() =>{
    const currentMarkdown = ref()
    const Markdowns = ref([] as any[])

    function SetCurrentMarkdown(data: any){
        currentMarkdown.value=data
    }

    // 二分查找插入，如果存在则直接获取
    function AddMarkdown(data: any){
        const len = Markdowns.value.length;
        if (len == 0){
            Markdowns.value.push(data)
        }else{

            let left = 0,right = len-1 ,ans = len;
            while(left <= right ) {
                let mid = ((right-left)>>1)+left;
                if (data.number > Markdowns.value[mid].number){
                    ans = mid;
                    right = mid -1;
                }else if(data.number == Markdowns.value[mid].number){
                    return
                }else{
                    left = mid +1;
                }
            }
            Markdowns.value.splice(ans,0,data)
        }
    }

    const parseCurrentMarkdownHTML = computed(() => {
        if(typeof(currentMarkdown.value) === 'object'){
            return marked.parse(currentMarkdown.value.body)
        }else{
            return ''
        }
      })
    
      const parseMarkdownHTML = computed(() => {
        return (markdownBody:string)=>{
            return marked.parse(markdownBody)
        }
      })



    const GetMarkdowns = computed(() => {
        return Markdowns.value
      })

  const GetCurrentMarkdown = computed(() => {
        return currentMarkdown.value
      })

    return {
        SetCurrentMarkdown,AddMarkdown,
        GetMarkdowns,GetCurrentMarkdown,
        parseMarkdownHTML,parseCurrentMarkdownHTML
    }
})