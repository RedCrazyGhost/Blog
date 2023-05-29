var ViewIndex = {
    props: ['Index','Github'],
    created(){
        let _this=this
        if (Object.keys(this.Index.List).length === 0 ) {
            url=this.Github.APIURL+"/repos/"+this.Github.owner+"/"+this.Github.repo+"/issues"
            axios.get(url,{
                headers: {
                    'Accept': 'application/vnd.github+json',
                    // 'Authorization': 'Bearer '+this.Github.token,
                }
            }).then(function (response) {
                 app.ViewData.Index.List=response.data
            })
            .catch(function (error) {
                console.log(error);
                axios.get(url,{
                    params: {
                    creator: _this.Github.owner,
                    per_page: '30',
                    page:1
                }
            }).then(function (response) {
                     app.ViewData.Index.List=response.data
                })
                .catch(function (error) {
                    console.log(error);
                });
            });
        }
    },
    components: {
       'i-m-markdown':MiniMarkdown,
       'i-loading':Loading
    },
    template: `
    <div class="row offset-1 col-10">
        <i-loading :data="Index.List"/>
        <i-m-markdown v-for="markdown in Index.List" :key="markdown.number" :Markdown="markdown">{{markdown.number}}</i-m-markdown>
    </div>
    `,
};