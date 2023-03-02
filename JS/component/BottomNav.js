var BottomNav = {
    props: ['WebSiteConfig'],
    template: `
    <nav id="Botton Nav" v-bind:class="'by-4 navbar navbar-'+getAppColor()+' '+getAppBackgroundColor()">
            <div class="container">
                <span class="navbar-text">2022-2023 © {{getAuthorName()}}</span>
                <a class="nav-link navbar-text" href="http://beian.miit.gov.cn/">鄂ICP备19031343号-1</a>
                <span class="navbar-text">Web Site Version:{{getVersion()}}</span>
            </div>
       </nav>
    `,
    methods: {
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