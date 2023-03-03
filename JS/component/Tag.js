var Tag={
    props: ['tag'],
    template: `
    <span class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}">
    <i v-if="iTagFlag(tag.name)" :class="'fa-brands fa-'+iTagClassStr(tag.name.toLowerCase())+tag.description"></i>
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
        iTagFlag(str){
            let tags=["Node","CentOS","CSS","HTML","windows","Docker","Git","Github","Golang","Java","Python","Vue"]
            return tags.indexOf(str)===-1?false:true;
        }
    }
}
    