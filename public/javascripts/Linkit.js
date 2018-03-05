var intervalID;

Handlebars.registerHelper("formatDate", function(datetime) {
    if (moment) {
        return moment(datetime).format('DD.MM.YYYY, HH:mm');
    }
    else {
        return datetime;
    }
});

Handlebars.registerHelper("reverse", function(context) {
        var options = arguments[arguments.length - 1];
        var ret = '';

        if (context && context.length > 0) {
            for (var i = context.length - 1; i >= 0; i--) {
                ret += options.fn(context[i]);
            }
        } else {
            ret = options.inverse(this);
        }

        return ret;
});

Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

(function( $ ) {

    $.ajaxSetup({ cache: false });

    $(function(){

        var template = Handlebars.compile($("#templateContainer").html());
        var container = $("#container");
        function updateLinks() {
            var showRanking = false;
            $.ajax({
                method: "GET",
                url: "/login"
            }).done(function (msg) {
                showRanking = msg.user;
            });
            $.ajax({
                method: "GET",
                url: "/links"
            }).done(function (msg) {
                container.html(template({ links: JSON.parse(msg), showRanking: showRanking}));
            });
        }
        $('#post-form').submit(function(){ return false; });
        $("#postsubmit").click(function(){
            var linkUrl = $("#post-link").val();
            if (linkUrl === "") { return; };
            var linkTitle = ($("#post-title").val() === "") ? "Another Link" : $("#post-title").val();
            $.ajax({
                method: "post",
                url: "/links",
                data: {title : linkTitle, url : linkUrl}
            }).done(function (msg) {
                updateLinks();
            });
        });
        $('#login-form').submit(function(){ return false; });
        $("#loginsubmit").click(function(){
            var user = $("#user").val();
            if (user === "") { return; };
            $.ajax({
                method: "post",
                url: "/login",
                data: {user : user}
            }).done(function (msg) {
                location.reload();
            });
        });
        $("#logoutsubmit").click(function(){
            $.ajax({
                method: "delete",
                url: "/login"
            }).done(function (msg) {
                location.reload();
            });
        });

        function rankingUpClickListener(button) {
            var id = button.slice(1);
            $.ajax({
                method: "put",
                url: "/links/" + id + "/up"
            }).done(function (msg) {
                updateLinks();
            });
        }
        function rankingDownClickListener(button) {
            var id = button.slice(1);
            $.ajax({
                method: "put",
                url: "/links/" + id + "/down"
            }).done(function (msg) {
                updateLinks();
            });
        }
        function deleteClickListener(button) {
            var id = button.slice(6);
            $.ajax({
                method: "delete",
                url: "/links/" + id
            }).done(function (msg) {
                updateLinks();
            });
        }

        $( ".links" ).on( "click", ".up", function() {
            rankingUpClickListener( $( this ).attr("id"));
        });
        $( ".links" ).on( "click", ".down", function() {
            rankingDownClickListener( $( this ).attr("id"));
        });
        $( ".links" ).on( "click", ".delete", function() {
            deleteClickListener( $( this ).attr("id"));
        });

        updateLinks();
        intervalID = setInterval(function() {
            updateLinks();
        }, 1000);

    });
})( jQuery );
