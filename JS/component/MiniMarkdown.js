var MiniMarkdown={
    props: ['Markdown'],
    mounted(){
        this.parserMiniMD()
    },
    beforeUpdate(){
        this.parserMiniMD()
    },
    updated(){
        this.parserMiniMD()
    },
    template: `
    <div :class="'card card-'+getAppColor()+' '+getAppClassColor()" style="margin-top: 1.5rem;    padding-right: 0px;
    padding-left: 0px;">
        <router-link  :class="getAppClassColor()" :to="{ name: 'watch', params: { targetId: Markdown.number }}">
        <div :class="'card-header header-'+getAppColor()">    
        <h5 >{{Markdown.title}} #{{Markdown.number}}</h5>
        </div>   
        <div class="card-body">
            <div :id="'miniMD-'+Markdown.number"></div>
            <p class="card-text"><small class="text-muted">详细内容请单击查看！</small></p>
            <p class="card-text">
            <small class="text-muted"><i class="fa-regular fa-calendar-plus"></i> {{toTime(Markdown.created_at)}}</small> 
            <small class="text-muted"><i class="fa-solid fa-hourglass-half"></i> {{toTime(Markdown.updated_at)}}</small>
            </p>
            </div>
            </router-link>
            <div :class="'card-footer footer-'+getAppColor()" v-if="Markdown.labels.length!==0">
        <span class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}" v-for="tag in Markdown.labels" :key="tag.id">{{tag.name}}</span>
        </div>
    </div>
 
    
    `,
    methods: {
        parserMiniMD(){
            str=this.Markdown.body
            document.getElementById('miniMD-'+this.Markdown.number).innerHTML=marked.parse(str.substring(0,str.indexOf('#',50)));
            mermaid.init();
        },
        readTime(str){
            return app.readTime(str)
        },
        toTime(datetime){
            return app.toTime(datetime)
        },
        getCallout(){
            return app.getCallout()
        },
        getAppClassColor(){
            return app.getAppClassColor()
        },
        getAppColor(){
            return app.getAppColor()
        }
    }
}