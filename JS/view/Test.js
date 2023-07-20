var ViewTest = {
    props: ['Index','Github'],
    components: {
       'i-loading':Loading
    },
    template: `
    <div class="row offset-1 col-10">
        <i-loading :isShow="true"/>
    </div>
    `,
};