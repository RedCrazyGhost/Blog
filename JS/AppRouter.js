var AppRouters = new VueRouter({
    routes: [
        {
            name: "index",
            path: '/',
            component: {
                props:['ViewData','WebSiteConfig'],
                components: {
                    'view-index':ViewIndex,
                },
                template: `
                <div>
                    <view-index :Github="WebSiteConfig.Github" :Index="ViewData.Index"></view-index>
                </div>
                `
            },
        },
        {
            name: "image",
            path: '/Image',
            component: {
                props:['ViewData','WebSiteConfig'],
                components: {
                    'view-image':ViewImage,
                },
                template: `
                <div>
                    <view-image/>
                </div>
                `
            },
        },
        {
            name: "test",
            path: '/test',
            component: {
                props:['ViewData','WebSiteConfig'],
                components: {
                    'view-test':ViewTest,
                },
                template: `
                <div>
                    <view-test :web-site-config="WebSiteConfig" :view-data="ViewData"></view-test>
                </div>
                `
            },
        },
        {
            name: "watch",
            path: '/watch/:targetId(\\d+)',
            component: {
                props:['ViewData','WebSiteConfig'],
                components: {
                    'view-watch':ViewWatch,
                },
                template: `
                <div>
                    <view-watch :web-site-config="WebSiteConfig"  :List="ViewData.Index.List" :Github="WebSiteConfig.Github" :Watch="ViewData.Watch" :targetId="$route.params.targetId"></view-watch>
                </div>
                `
            },
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})