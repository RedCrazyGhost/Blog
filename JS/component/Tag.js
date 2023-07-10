var Tag={
    props: ['tag'],
    template: `
    <span class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}">
    <i :class="'fa-brands fa-'+iTagClassStr(tag.name.toLowerCase())+tag.description"></i>
    {{tag.name}}
    </span>
    `,
    methods:{
        iTagClassStr(str){
            switch (str) {
                case "javascript":
                    return "js"
                default:
                    return str
            }
        },
    }
}
    