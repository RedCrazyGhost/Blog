console.log(
    "Welcome to RedCrazyGhost'Blog\n"+
    "我的文档明确禁止搬运！\n"+
    "如果网站有着内容错误、排版错误等各种错误\n"+
    "请通过邮件的方式与我取得联系！\n"+
    "邮箱地址:RedCrazyGhost@163.com"
);
((function() {
    var callbacks = [],
        timeLimit = 50,
        open = false;
    setInterval(loop, 1);
    return {
        addListener: function(fn) {
            callbacks.push(fn);
        },
        cancleListenr: function(fn) {
            callbacks = callbacks.filter(function(v) {
                return v !== fn;
            });
        }
    }

    function loop() {
        var startTime = new Date();
        debugger;
        if (new Date() - startTime > timeLimit) {
            if (!open) {
                callbacks.forEach(function(fn) {
                    fn.call(null);
                });
            }
            open = true;
            window.stop();
            document.body.innerHTML = "";
        } else {
            open = false;
        }
    }
})()).addListener(function() {
    window.location.reload();
});