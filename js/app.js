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
    console.log('初始化session对象',session)

    //初始化OT session对象失败
    // OT.addEventListener("exception", event=>{
    //     console.log("exception event. \n  code == " + event.code + "\n  message == " + event.message);
    //     if(callInfo.operatorType == 1){//加入者
    //         hang(5);
    //     }else{
    //         hang(4);
    //     }
    // });

    session.on('streamPropertyChanged', (event)=> {
        console.log('streamPropertyChanged',event)


    });

   session.on("sessionDisconnected", (event)=> {
        console.log('sessionDisconnected',event)
    });

    
    session.on('connectionCreated',(event)=>{
        console.log('connectionCreated',event);
    })


    session.on('connectionDestroyed',(event)=>{
        console.log('链接中断');
    })
    

    session.on('sessionReconnecting',(event)=>{//正在重连
        console.log('进入重连')

    })


    session.on('sessionReconnected',(event)=>{//重连成功
        console.log('重连成功',event) 
    });
  
    // initialize the publisher
    let publisherOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
      audioBitrate: 64000,
    //   videoSource: videoInputDevices[0].deviceId
    };
    // if(audioInputDevices)
    //     publisherOptions.audioSource = audioInputDevices.deviceId;

    // console.log(audioInputDevices)
    publisher = OT.initPublisher('publisher', publisherOptions, handleError);
    console.log('初始化publisher对象',publisher)

    publisher.publishAudio(true);
    publisher.publishVideo(true);

    // Connect to the session
    session.connect(token, (error)=> {//连接 错误信息返回
        if (error) {
            console.log('连接失败',error)
            handleError(error);
        } else {
            console.log('链接成功')
            session.publish(publisher,(error)=>{
                if (error) {
                    console.log('publisher_error',error);
                }
            });
        }
    });

    publisher.on('mediaStopped', (event)=> {
        // if(event.type == 'mediaStopped' && callState == 'connected' && callInfo.callType == 1){
        //     _switchCall(0,1010);
        // }
        console.log(event)
    });

        publisher.on('streamCreated', (event)=> {
            console.log('加入者推流成功')
        });

        session.on('streamCreated', (event)=> {
            let subscriberOptions = {
                insertMode: 'append',
                width: '100%',
                height: '100%',
                audioVolume:100
            };
            // session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
            subscriber = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
            // subscriber.subscribeToVideo(true);
            subscriber.subscribeToAudio(true);
        });


    publisher.on("streamDestroyed", function (event) {
        console.log("The publisher stopped streaming. Reason: "
          + event.reason);
    });

  }