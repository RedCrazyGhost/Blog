var ViewIndex = {
    props: ['Index','Github'],
    created(){
        if (Object.keys(this.Index.List).length === 0 ) {
            axios.get(this.Github.APIURL+"/repos/"+this.Github.owner+"/"+this.Github.repo+"/issues",{
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': 'Bearer '+this.Github.token,
                }
            }).then(function (response) {
                 app.ViewData.Index.List=response.data
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    components: {
       'i-m-markdown':MiniMarkdown
    },
    template: `
    <div>
        <i-m-markdown v-for="markdown in Index.List" :key="markdown.number" :Markdown="markdown">{{markdown.number}}</i-m-markdown>
    </div>
    `,
};