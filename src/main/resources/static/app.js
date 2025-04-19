const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/app-endpoint'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/response', (response) => {
        handleResponse(JSON.parse(response.body).value);
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#status-table").show();
    }
    else {
        $("#status-table").hide();
    }
    $("#responses").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendRequest() {
    stompClient.publish({
        destination: "/app/request",
        body: JSON.stringify({'value': $("#request-value").val()})
    });
}

function handleResponse(message) {
    $("#responses").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#send" ).click(() => sendRequest());
});