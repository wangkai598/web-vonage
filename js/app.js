// replace these values with those generated in your TokBox Account
var apiKey = "46538402";
var sessionId = "2_MX40NjUzODQwMn5-MTYzODQwOTI3Mjc5MX5DbmV2NFdES0EwOWcyYUFlOWNhaEpxbml-fg";
var token = "T1==cGFydG5lcl9pZD00NjUzODQwMiZzaWc9MDkxZDFiNTkwMzIyNTUxODg4YTgzOGEyNWQ4ZjFkMjg5MTM5YjBjNTpzZXNzaW9uX2lkPTJfTVg0ME5qVXpPRFF3TW41LU1UWXpPRFF3T1RJM01qYzVNWDVEYm1WMk5GZEVTMEV3T1djeVlVRmxPV05oYUVweGJtbC1mZyZjcmVhdGVfdGltZT0xNjM4NDA5MjczJm5vbmNlPTAuNjIwMTI0Njk3NTA1NzE1MSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNjM4NDk1NjczJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

// (optional) add server code here
initializeSession();

// Handling all of our errors here by alerting them
function handleError(error) {1
    if (error) {
      alert(error.message);
    }
  }
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {

      var subscribe =session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
        console.log('streamCreated == 有人进来',event)

        subscribe.on('disconnected',(event)=>{// 
          console.log('subscribe -- disconnected ')
        });
        subscribe.on('connected',(event)=>{ 
          console.log('subscribe -- connected')
      });
        subscribe.on('destroyed',(event)=>{
          console.log('subscribe -- destroyed')
      });

     
  });
 
      session.on("streamDestroyed", function (event) {
          console.log("session -- streamDestroyed --  Stream stopped. Reason: " + event.reason);
          event.preventDefault();
          var subscribers = session.getSubscribersForStream(event.stream);
          console.log("session -- streamDestroyed -- subscribers: " + subscribers);
  });
      session.on('sessionReconnecting',(event)=>{//进入重连
        console.log('sessionReconnecting')
        
    });

     session.on('sessionReconnected',(event)=>{//重连成功
        console.log('sessionReconnected',event)
    });

    session.on('streamPropertyChanged', (event)=> {
      console.log('streamPropertyChanged',event)
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

    publisher.on("streamDestroyed", (event)=> {
        console.log("The publisher stopped streaming.");
        console.log(event)

       
        let publisherOptions = {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        };
  
    
        session.unpublish(publisher);
        publisher = null;
        publisher = OT.initPublisher('publisher', publisherOptions, handleError);
                    publisher.publishVideo(false);
                    session.publish(publisher,(error)=>{
                        if (error) {
                            console.log('streamDestroyed publisher_error',error);
                        }
                    });

        event.preventDefault();
    });

    
  }