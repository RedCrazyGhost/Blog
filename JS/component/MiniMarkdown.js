var MiniMarkdown={
    props: ['Markdown'],
    components: {
        'i-tag': Tag
    },
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

    <div :class="'shadow offset-1 col-10 card card-'+getAppColor()+' '+getAppClassColor()" style="margin-top: 1.5rem;">
            <div :class="'card-header header-'+getAppColor()">    
                 <router-link  :class="getAppClassColor()" :to="{ name: 'watch', params: { targetId: Markdown.number }}">
                <h5>{{Markdown.title}} #{{Markdown.number}}</h5>
                 </router-link>
            </div>   
            <div class="card-body">
                <router-link  :class="getAppClassColor()" :to="{ name: 'watch', params: { targetId: Markdown.number }}">
                <div :id="'miniMD-'+Markdown.number"></div>
                <p class="card-text"><small class="text-muted">详细内容请单击查看！</small></p>
                <p class="card-text">
                <small class="text-muted"><i class="fa-regular fa-calendar-plus"></i> {{toTime(Markdown.created_at)}}</small> 
                <small class="text-muted"><i class="fa-solid fa-hourglass-half"></i> {{toTime(Markdown.updated_at)}}</small>
                </p>
                 </router-link>
            </div>

        <div :class="'card-footer footer-'+getAppColor()" v-if="Markdown.labels.length!==0">
            <i-tag  v-for="tag in Markdown.labels" :key="tag.id" :tag="tag"></i-tag>
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