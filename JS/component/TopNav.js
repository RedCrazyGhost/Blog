var TopNav = {
    props: ['WebSiteConfig'],
    template: `
    <nav id="TopNav" v-bind:class="'by-4 navbar navbar-expand-lg navbar-'+getAppColor()+' '+getAppBackgroundColor()">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <h1>RedCrazyGhost's Blog</h1>
            </router-link>
            <i v-bind:class="changeIClass()" v-bind:style="changeIStyle()"  @click="changeAppColor()"></i>
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
        changeAppColor() {
            return this.$parent.changeAppColor()
        },
        // 根据AppColor改变class
        changeIClass() {
            switch (this.getAppColor()) {
                case "light":
                    return "far fa-sun fa-spin fa-2x";
                case "dark":
                    return "fas fa-moon fa-2x";
            }
        },
        // 根据AppColor改变style
        changeIStyle() {
            switch (this.getAppColor()) {
                case "light":
                    return "color:var(--bs-warning)";
                case "dark":
                    return "color:var(--bs-primary)";
            }
        }
    }
};

