var Tag={
    props: ['tag'],
    template: `
    <span class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}">
    <i :class="'fa-brands fa-'+tag.name.toLowerCase()+tag.description"></i>
    {{tag.name}}
    </span>
    `,
    methods:{
    }
}
    