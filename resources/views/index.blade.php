<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Chat demo</title>
    <script src="http://js.pusher.com/7.2/pusher.min.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <link rel="stylesheet" href={{ asset('/style.css') }}>
</head>

<body>

    <div class="chat">
        <div class="top">
            <img src="" alt="">
            <div>
                <p>Nguyen Van A</p>
                <small>Online</small>
            </div>
        </div>
        <div class="messages">
            @include('receive', ['message' => 'Hey! Hello world!'])
        </div>
        <div class="bottom">
            <form action="">
                <input type="text" name="message" id="message" placeholder="Enter message..." autocomplete="off">
                <button type="submit"></button>
            </form>
        </div>
    </div>
</body>
<script>
    const pusher = new Pusher('{{ config('broadcasting.connections.pusher.key') }}', {
        cluster: 'ap1'
    })
    const channel = pusher.subcribe('public');

    channel.bind('chat', function(data) {
        $.post("/receive", {
                _token: '{{ csrf_token() }}',
                messsage: data.messsage
            })
            .done(function(res) {
                $(".messages > .message").last().after(res);
                $(document).scrollTop($(document).height());
            });
    });

    $("form").submit(function(event) {
        event.preventDefault();
        $.ajax({
                url: "/broadcast",
                method: 'POST',
                headers: {
                    'X-Socket-Id': pusher.connection.socket_id
                },
                data: {
                    _token: '{{ csrf_token() }}',
                    messsage: $("form #message").val()
                }
            })
            .done(function(res) {
                $(".messages > .message").last().after(res);
                $("form #message").val('')
                $(document).scrollTop($(document).height());
            });
    })
</script>

</html>
