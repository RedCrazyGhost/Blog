var MiniMarkdown={
    props: ['Markdown'],
    template: `
    <router-link :to="{ name: 'watch', params: { targetId: Markdown.number }}" @click="setMarkdown(Markdown)">
    <div :class="'card '+getAppClassColor()">
    <h5 class="card-header">{{Markdown.title}} #{{Markdown.number}}</h5>
        <div class="card-body">
        </div>
        <div class="card-footer">
        </div>
    </div>
    </router-link>
    
    `,
    methods: {
        setMarkdown(markdown){
            app.ViewData.Watch.Markdown=markdown
            console.log(app.ViewData.Watch.Markdown);
        },
        readTime(str){
            return app.readTime(str)
        },
        toTime(datetime){
            return app.readTime(datetime)
        },
        getCallout(){
            return app.getCallout()
        },
        getAppClassColor(){
            return app.getAppClassColor()
        }
    }
}