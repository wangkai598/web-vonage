// replace these values with those generated in your TokBox Account
var apiKey = "46538402";
var sessionId = "1_MX40NjUzODQwMn5-MTYzODI2MzU4NzY1NH51VndGQWQxYVZCZW9nazhQUDdUSWhJNHl-fg";
var token = "T1==cGFydG5lcl9pZD00NjUzODQwMiZzaWc9ZDU3OTYzZmRlY2ZiZGM5NDMyODUwNWZkZmY0MzU1ZmZlMGQ0NjU3YjpzZXNzaW9uX2lkPTFfTVg0ME5qVXpPRFF3TW41LU1UWXpPREkyTXpVNE56WTFOSDUxVm5kR1FXUXhZVlpDWlc5bmF6aFFVRGRVU1doSk5IbC1mZyZjcmVhdGVfdGltZT0xNjM4MjYzNTg4Jm5vbmNlPTAuNTY3MjU4NzA4ODA4NTg5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjM4MzQ5OTg4JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {

      session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
      });

    // Create a publisher
    let publisherOptions = {
        insertMode: 'append',
        width: '100%',
        height: '100%'
      };

    var publisher = OT.initPublisher('publisher', publisherOptions, handleError);
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  }