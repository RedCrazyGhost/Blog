var Tag={
    props: ['tag'],
    template: `
    <span  v-if="tag.name === '生活'" class="badge" style="    margin-right: 6px;
    background: linear-gradient( 217deg, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0) 70.71% ), linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%);">
    <i :class="'fa-solid fa-'+tag.description"></i>
    {{tag.name}}
    </span>
    <span v-else class="badge" v-bind:style="{backgroundColor:'#'+tag.color+' !important',marginRight: '6px'}">
    <i :class="'fa-brands fa-'+tag.name.toLowerCase()+tag.description"></i>
    {{tag.name}}
    </span>
    `,
    methods:{
    }
}
    