const support = new Map();
//IE11 doesn't support Map(iterable), so setting it like this...
support.set(21102,"Adam");
support.set(3215 ,"Alexander");
support.set(2944 ,"Andreas");
support.set(20714,"Eirik");
support.set(16517,"Fredrik");
support.set(20321,"Guro");
support.set(19608,"Hanne");
support.set(3208 ,"Henrik");
support.set(2947 ,"Iselin");
support.set(21101,"Jeroen");
support.set(5546 ,"Joakim ");
support.set(2943 ,"Kjerstin");
support.set(21100,"Konrad");
support.set(16518,"Petter");
support.set(2945 ,"Silje");
support.set(4958 ,"Sonja");
support.set(3184 ,"Terje");
support.set(17333,"Truls");

call = [

];

function statusUpdate(id, state){
	if (support.has(id)) {
		if (state =='UNAVAILABLE'){
			if($("#" + id).length != 0) {
				$('#s' + id).remove;
			}
		}
		else {
			if($("#" + id).length == 0) {
				//it doesn't exist yet
				$('#support').append("<span id='" + id + "' class='label OTHER'>" + support.get(id) + "</span>");
			}
			else
			{ 	//update existing
				if (!$('#' + id).hasClass(state)){ //else ignore
					$('#' + id).removeClass("BUSY AVAILABLE OTHER RINGING");
					$('#' + id).addClass(state);
				} 
			}
		}	
	}
};

$(document).ready(function() {

	Oyatel.init('5C974191-C1BA-4A46-AA3C-047A86202E7E', 'https://jeroenschevernels.netlify.com/oauth_cb.html');
	
	Oyatel.bind('authorized', function() {
		authorized();
	});
	Oyatel.bind('authorizationfailed', function(errormsg) {
		console.log('The user rejected the authorization, or some error occured: ' + errormsg);
	});
	Oyatel.bind('deauthorized', function() {
		console.log('onDeauthorized callback called');
		deauthorized();
	});
	Oyatel.checkAuthorization();


	function authorized() {
		
		$('.authorized').css('display', 'block');
		$('.not-authorized').css('display', 'none');
			
		Oyatel.Events.subscribe('/events/presence', function(msg) {

			if (msg.data.event == "fulldump") {
				for (let event in msg.data.events) {
					statusUpdate(msg.data.events[event].userId, msg.data.events[event].state);
				}
			}
			else
			{
				statusUpdate(msg.data.userId, msg.data.state);
			}
		});
		
		Oyatel.User.currentUser(function(user) {
			$('#user').html(user.username + ' (' + user.firstname + ' ' + user.lastname + ')');
		});
			
		Oyatel.Events.subscribe('/events/queue', function(msg) {

			if (msg.data.queueId == "que0110312"){ 		//Filter on Support NO queue only!
				let agentsBusy = msg.data.agentsBusy;
				let agentsOnline = msg.data.agentsOnline;
				let callsAbandoned = msg.data.callsAbandoned;
				let callsCompleted = msg.data.callsCompleted;
				let callsWaiting = msg.data.callsWaiting;
				$('#waiting').html(callsWaiting);
				$('#completed').html(callsCompleted);
				$('#abandoned').html(callsAbandoned);
				$('#agentsOnline').html(agentsOnline);
				$('#agentsBusy').html(agentsBusy);
				let percentage = Math.round(callsCompleted / (callsCompleted + callsAbandoned) * 100);
				if (percentage > 99){
					$(".callsBox").css("background", "#a2f282");
				} else if (percentage < 1) {
					$(".callsBox").css("background", "#ef5d4c");
				}
				else {
					$(".callsBox").css("background-image", "linear-gradient(to right, #a2f282 " + (percentage - 5) + "% ," + percentage + "% ,#ef5d4c " + (percentage + 5) + "% )");
				}
				$(".agentsBox").css("background","RGBA(255,0,0," + (agentsBusy / agentsOnline) + ")");
				$(".queueBox").css("background","RGBA(255,0,0," + (callsWaiting * 0.20) + ")");
			}
		});
				
		Oyatel.Events.subscribe('/events/call', function(msg) {
			if (support.has(msg.data.userId)) {
				console.log(msg.data);
	            if (msg.data.direction === "out") {
	                $('#calls').append("<p>SOMEONE CALLED OUT! IS THIS SHIT FINALLY WORKING?</p>");
	            } 
	            if (msg.data.direction === 'in') {
	            	var info = {
	                            'Name': '',
	                            'Address': '',
	                            'Zipcode': '',
	                            'City': '',
	                            'Country': ''
	                        };
	                Oyatel.Call.numberInfo(msg.data.callerId.number, function(data) {
						console.log("Data numberinfo: " + data);
                        if (data.matches.length > 0) {
                            if (data.matches[0].name != null) info.Name = data.matches[0].name;
                            if (data.matches[0].address != null) info.Address = data.matches[0].address;
                            if (data.matches[0].zipcode != null) info.Zipcode = data.matches[0].zipcode;
							if (data.matches[0].city != null) info.City = data.matches[0].city;
							call.push(info);
						}
						
                        if (data.location != null) info.Country = data.location;
                        if (msg.data.event == 'ring') {
	                        $('#cnNumber').html(msg.data.callerId.number);
	                        $('#cnName').html(info.Name);
	                        $('#cnAddress').html(info.Address);
	                        $('#cnZipCity').html(info.Zipcode + " " + info.City);
	                        $('#cnCountry').html(info.Country);    
		                }
		                else if (msg.data.event == 'hangup') {
		                    let string = ""
							
							if (info.Name != "" || msg.data.callerId.number != ""){
								string += support.get(msg.data.userId) + ": " + info.Name + " (" + msg.data.callerId.number + ")"
							}
							
							if (string!="")	 {                    
								$('#calls').append("<span class='log'>" + string + "</span>&nbsp;");
							}
		                }
		                else {
		                	console.log('other status!!!');
		                	console.log(msg.data);
		                }
                    });
	                

	            }
	        }
        });
	}

	function deauthorized() {
		$('.authorized').css('display', 'none');
		$('.not-authorized').css('display', 'block');
	}
	
	$('.btn-oyatel-login').click(function() {
		Oyatel.authorize();
	});
	$('.oyatel-logout').click(function() {
		Oyatel.deauthorize();
	});	
});