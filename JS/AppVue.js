var app = new Vue({
    el: '#App',
    mounted() {
        marked.setOptions({
            highlight:function(code, lang, callback) {
                language=lang;
                return hljs.highlight(code,{language}).value;
            }
        })
        mermaid.initialize({startOnLoad:true});
    },
    created() { 
        var head = document.getElementsByTagName('HEAD').item(0);
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.type = 'text/css';
        if (new Date().getHours()>=18||new Date().getHours()<=6) {
            this.AppColor="dark"
            style.href = 'CSS/github-dark.css';
        }else{
            this.AppColor="ligth"
            style.href = 'CSS/github.css';
        }
        head.appendChild(style);
        
        let _this=this

        axios.get(this.targetURL+"MarkDown/Blog.json").then(function(response){
            _this.Blogs=response.data;
        }).catch(function (error){
            console.log(error);
            if (this.targetURL!="") {
                axios.get(_this.targetURL+"MarkDown/").then(function(response){
                    regexp=/(?<=\.md\">).*?(?=\.md<\/a>)/gim
                    _this.Blogs=response.data.match(regexp)
                }).catch(function (error){
                    console.log(error);
                })
            }
        })
        
    },
    data() {
        return {
            targetURL:"https://cdn.jsdelivr.net/gh/RedCrazyGhost/CDN@last/",
            Blogs: [],
            targeMD: "Choose...",
            isWarning: false,
            AppColor:""
        };
    },
    methods: {
        getMarkDown() {
            if (this.targeMD !== "Choose...") {
                axios.get(this.targetURL+"MarkDown/" + this.targeMD + ".md")
                    .then(function (response) {
                        document.getElementById('markdown').innerHTML =  marked.parse(response.data);
                        mermaid.init();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                isWarning = false;
            } else {
                isWarning = true;
            }
        },
        judgeColorChangeFontColor(color) {
            switch (color) {
                case "light":
                    return "dark";
                case "dark":
                    return "light";
            }
        },
    }
})