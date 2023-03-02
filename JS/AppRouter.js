var AppRouters = new VueRouter({
    routes: [
        {
            name: "index",
            path: '/',
            component: {
                props:['ViewData','Github'],
                components: {
                    'view-index':ViewIndex
                },
                template: `
                <div>
                    <view-index :Github="Github" :Index="ViewData.Index"></view-index>
                </div>
                `
            },
        },
        {
            name: "watch",
            path: '/watch/:targetId(\\d+)',
            component: {
                props:['ViewData','Github','WebSiteConfig'],
                components: {
                    'view-watch':ViewWatch
                },
                template: `
                <div>
                    <view-watch :web-site-config="WebSiteConfig"  :List="ViewData.Index.List" :Github="Github" :Watch="ViewData.Watch" :targetId="$route.params.targetId"></view-watch>
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