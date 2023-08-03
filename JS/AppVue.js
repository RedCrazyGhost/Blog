var app = new Vue({
    el: '#App',
    mounted() {
        marked.setOptions({
            highlight: function (code, lang, callback) {
                language = lang;
                return hljs.highlight(code, {language}).value;
            }
        })
        mermaid.initialize({startOnLoad: true});
    },
    created() {        
        var fontFile = new FontFace('HYCuYuanJ', 'url('+this.getCDNUrl('/TTF/HYCuYuanJ-Blog-RedCrazyGhost.ttf')+')');
        fontFile.load().then(function (fontface) {
            document.fonts.add(fontFile);
        });

        let nowTime = new Date().getHours()
        if (nowTime >= 7 && nowTime < 18) {
            this.loadStyle("CSS/github.css")
            this.WebSiteConfig.AppColor = "light"
        } else {
            this.loadStyle("CSS/github-dark.css")
            this.WebSiteConfig.AppColor = "dark"
        }
    },
    data() {
        return {
            WebSiteConfig: {
                CDN:{
                    owner:"RedCrazyGhost",
                    repo:"CDN",
                    version:"2023-08-03",
                    url:"https://cdn.jsdelivr.net/gh/",
                },
                Github:{
                    APIURL:"https://api.github.com",
                    owner:"RedCrazyGhost",
                    repo:"blog",
                    token:"",                                },
                AppAuthor: {
                    name: "RedCrazyGhost",
                    imgURL: "IMAG/Author.jpeg",
                },
                AppVersion: "1.0.2",
                AppColor: "light",
                AppFontFamily: "HYCuYuanJ"
            },
            ViewData:{
                Index:{
                    List:{}
                },
                Watch:{
                    Markdown:{}
                }
            }
        };
    },
    methods: {
        getCDNUrl(s){
            let CDN=this.WebSiteConfig.CDN
            return CDN.url+'/'+CDN.owner+'/'+CDN.repo+'@'+CDN.version+s;
        },
        loadStyle(url) {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(link);
        },
        getAppFontColor() {
            let appFontColor = "text-"
            switch (this.WebSiteConfig.AppColor) {
                case "light":
                    appFontColor += "dark";
                    break
                case "dark":
                    appFontColor += "light";
                    break
                default:
                    appFontColor += "dark";
            }
            return appFontColor
        },
        getAppBackgroundColor() {
            return "bg-" + this.WebSiteConfig.AppColor
        },
        getAppClassColor() {
            return this.getAppBackgroundColor() + " " + this.getAppFontColor()
        },
        getAppColor() {
            return this.WebSiteConfig.AppColor
        },
        getAuthor() {
            return this.WebSiteConfig.AppAuthor
        },
        getVersion() {
            return this.WebSiteConfig.AppVersion
        },
        changeAppColor() {
            if (this.WebSiteConfig.AppColor === "light") {
                this.WebSiteConfig.AppColor = "dark"
            } else {
                this.WebSiteConfig.AppColor = "light"
            }
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
            switch(app.WebSiteConfig.AppColor){
                case "dark":
                    return "callout callout-wanring"
                case "light":
                default:
                    return "callout callout-info"
            }
        }
    },
    components: {
        "top-nav": TopNav,
        "bottom-nav": BottomNav,
    },
    router: AppRouters
});