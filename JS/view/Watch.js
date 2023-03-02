var ViewWatch={
    props: ['List','Github','Watch','targetId','WebSiteConfig'],
    components: {
        'i-markdown': Markdown
    },
    created(){
        if (Object.keys(this.List).length !== 0&& Object.keys(markdown=app.ViewData.Index.List.find(element => element.number ===this.targetId)).length !== 0 ) {
            app.ViewData.Watch.Markdown=markdown
            
        }else{
            axios.get(this.Github.APIURL+"/repos/"+this.Github.owner+"/"+this.Github.repo+"/issues/"+this.targetId
            ,{
                headers: {
                    'Accept': 'application/vnd.github+json',
                    'Authorization': 'Bearer '+this.Github.token,
                }
            }
            ).then(function (response) {
                app.ViewData.Watch.Markdown=response.data
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    template: `
    <div>
        <i-markdown :app-color="WebSiteConfig.AppColor" :Markdown="Watch.Markdown"  class="row offset-1 col-10"></i-markdown>
    </div>  
    `,
}