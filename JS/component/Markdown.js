var Markdown = {
    props: ['Markdown','AppColor'],
    mounted(){
        this.parserMD()
    },
    beforeUpdate(){
        this.parserMD()
    },
    updated(){
        this.parserMD()
    },
    template: `
    <div>
    <h1>{{Markdown.title}}</h1>
    <div>
    <blockquote v-bind:class="getCallout()">
    <p>作者 : {{Markdown.user.login}}</p>
    <p>创建时间 : {{toTime(Markdown.created_at)}}</p>
    <p>修改时间 : {{toTime(Markdown.updated_at)}}</p>
    <p>阅读时长 : {{readTime(Markdown.body)}}</p>
    <p v-if="Markdown.labels.length!==0">标签 : <span class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}" v-for="tag in Markdown.labels" :key="tag.id">{{tag.name}}</span>
    </p>
    </blockquote>
    <div id="markdown">
    </div>
    </div>
    </div>
    `,
    methods:{
        parserMD(){
            document.getElementById('markdown').innerHTML=marked.parse(this.Markdown.body);
            mermaid.init();
        },
        readTime(str){
            readSecond=str.length/7
            result=""
            hour=parseInt(readSecond/3600%60)
            minute=parseInt(readSecond/60%60)
            second=parseInt(readSecond%60)
            if (hour!=0){
                result+=hour+"小时"
            }
            if (minute!=0){
                result+=minute+"分钟"
            }
            if (second!=0){
                result+=second+"秒"
            }
            if (result.length==0) {
                return "1秒"
            }
            return result
        },
        toTime(datetime){
            object=new Date(datetime)
            return object.getFullYear()+"-"+(object.getMonth()+1)+"-"+(object.getDate()+1)
        },
        getCallout(){
            switch(this.AppColor){
                case "dark":
                    return "callout callout-wanring"
                case "light":
                default:
                    return "callout callout-info"
            }
        }
    }
};