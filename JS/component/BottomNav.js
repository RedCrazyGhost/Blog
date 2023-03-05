var BottomNav = {
    props: ['WebSiteConfig'],
    template: `
    <nav style="margin-top: 1.5rem;" v-bind:class="'by-4 navbar navbar-'+getAppColor()+' '+getAppBackgroundColor()">
            <div class="container">
                <span class="navbar-text">2022-2023 © {{getAuthorName()}}</span>
                <span class="navbar-text" v-if="getServer().length!==0">{{getServer()}}</span>
                <a class="nav-link navbar-text" href="http://beian.miit.gov.cn/">鄂ICP备19031343号-1</a>
                <span class="navbar-text">Web Site Version:{{getVersion()}}</span>
            </div>
       </nav>
    `,
    methods: {
        getServer(){
            var req = new XMLHttpRequest();
            req.open('GET', window.location.href, false);
            req.send(null);
            req.getAllResponseHeaders().toLowerCase().split('\r\n').forEach(val=>{
                if (val.indexOf('github')!==-1) {
                    return 'Github Package'
                }
                if (val.indexOf('Gitee')!==-1) {
                    return 'Gitee'
                }
            })
            return ''
        },
        getAppBackgroundColor() {
            return this.$parent.getAppBackgroundColor()
        },
        getAppColor() {
            return this.$parent.getAppColor()
        },
        getAuthorName() {
            return this.$parent.getAuthor().name
        },
        getVersion() {
            return this.$parent.getVersion()
        }
    }
};