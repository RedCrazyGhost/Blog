var TopNav = {
    props: ['WebSiteConfig'],
    template: `
    <nav id="TopNav" v-bind:class="'by-4 navbar navbar-expand-md navbar-'+getAppColor()+' '+getAppBackgroundColor()">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <h1>RedCrazyGhost's Blog</h1>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
            <div class="hidden-sm">
            建议使用平板或电脑浏览！
            </div>
            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav ms-auto"">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">首页</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/image">摄影</router-link>
                    </li>
                    <li class="nav-item">
                        <i v-bind:class="changeIClass()" v-bind:style="changeIStyle()"  @click="changeAppColor()"></i>        
                    </li>
                </ul>
            </div>
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

