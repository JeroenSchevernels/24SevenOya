class Support {
	constructor(name) {
	  this.name = name;
	} 
}

const support = new Map(); //IE11 doesn't support Map(iterable), so setting it like this...
support.set(21102, new Support("Adam"));
support.set(3215 , new Support("Alexander"));
support.set(2944 , new Support("Andreas"));
support.set(20714, new Support("Eirik"));
support.set(16517, new Support("Fredrik"));
support.set(20321, new Support("Guro"));
support.set(19608, new Support("Hanne"));
support.set(3208 , new Support("Henrik"));
support.set(2947 , new Support("Iselin"));
support.set(21101, new Support("Jeroen"));
support.set(5546 , new Support("Joakim"));
support.set(2943 , new Support("Kjerstin"));
support.set(21100, new Support("Konrad"));
support.set(16518, new Support("Petter"));
support.set(2945 , new Support("Silje"));
support.set(4958 , new Support("Sonja"));
support.set(3184 , new Support("Terje"));
support.set(17333, new Support("Truls"));

call = [];

let CurrentUser;

function statusUpdate(id, state){
	if (support.has(id)) {
		// console.log(msg);
		if (state =='UNAVAILABLE'){
			if($("#" + id).length != 0) {
				$('#s' + id).remove;
			}
		}
		else {
			if($("#" + id).length == 0) {
				//it doesn't exist yet
				$('#support').append("<span id='" + id + "' class='label OTHER'>" + support.get(id).name + "</span>");
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

function updateCall(){
	$('#log').html('');
	for (let i = 0; i < call.length; i++){
		$('#log').append("<tr><td>" + ts2time(call[i].timestamp) + "</td><td>" + call[i].name + "</td><td>" + call[i].number + "</td></tr>");
	}
}

function ts2time(number){
	let timestamp = new Date(number);
	let hours = timestamp.getHours();
	let minutes = "0" + timestamp.getMinutes();
	// let seconds = "0" + timestamp.getSeconds();
	return hours + ':' + minutes.substr(-2); //+ ':' + seconds.substr(-2);
}

$(document).ready(function() {
	$("#copy").click(function() {
		const el = document.querySelector('#copyTxt'); 
		el.select();
		document.execCommand('copy');
	});
	
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
				console.log("___" +  msg.data.state + " " + support.get(msg.data.userId).name);
			}
		});
		
		Oyatel.User.currentUser(function(user) {
			CurrentUser = user;
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
				document.title = 'Wait: ' + callsWaiting + ' Busy: ' + agentsBusy + '/' + agentsOnline;
			}
		});
				
		Oyatel.Events.subscribe('/events/call', function(msg) {
			if (support.has(msg.data.userId)) {
				// console.log('call event: ');
				// console.log(msg.data);
	            if (msg.data.direction === "out") {
	                alert("<p>SOMEONE CALLED OUT! IS THIS SHIT FINALLY WORKING?</p>");
	            } 
	            if (msg.data.direction === 'in') {
	            	var info = {
	                            'Name': '',
	                            'Address': '',
	                            'Zipcode': '',
	                            'City': '',
								'Country': '',
								'Number': ''
	                        };
	                Oyatel.Call.numberInfo(msg.data.callerId.number, function(data) {
						// console.log('numberinfo: ');
						// console.log(data);
                        if (data.matches.length > 0) {
                            if (data.matches[0].name != null) info.Name = data.matches[0].name;
                            if (data.matches[0].address != null) info.Address = data.matches[0].address;
                            if (data.matches[0].zipcode != null) info.Zipcode = data.matches[0].zipcode;
							if (data.matches[0].city != null) info.City = data.matches[0].city;
							
						}
						if (msg.data.userId == CurrentUser.id) {
							info.Number = msg.data.callerId.number;
						}
                        if (data.location != null) info.Country = data.location;
						if (msg.data.event == 'ring') {
	                        $('#cnNumber').html(msg.data.callerId.number);
	                        $('#cnName').html(info.Name);
	                        $('#cnAddress').html(info.Address);
	                        $('#cnZipCity').html(info.Zipcode + " " + info.City);
							$('#cnCountry').html(info.Country);
							$('#copyTxt').text('Samtale logg ' + msg.data.callerId.number + ' ' + info.Name);
							if (call.length > 0){
								if (call[call.length - 1].number === msg.data.callerId.number){
									if (new Date().getTime() - call[call.length - 1].timestamp < 60000){ //less than a minute since last, so we assume same call
										call[call.length - 1].timestamp = new Date().getTime();
									} else {
										call.push({number: msg.data.callerId.number, name: info.Name, timestamp: new Date().getTime()});
									}
								} else {
									call.push({number: msg.data.callerId.number, name: info.Name, timestamp: new Date().getTime()});
								}
							} else {
								call.push({number: msg.data.callerId.number, name: info.Name, timestamp: new Date().getTime()});
							}
							updateCall();	
		                }
		                else if (msg.data.event == 'hangup') {
							console.log("hangup " + support.get(msg.data.userId).name);
		                    let string = ""
							
							if (msg.data.callerId.name != "<unknown>" || msg.data.callerId.number != "<unknown>") {
								string += "<strong>" + ts2time(new Date().getTime()) + "</strong> ";
								string += support.get(msg.data.userId).name + ":<small> " + info.Name + ' ' +  msg.data.callerId.number + "</small>";
								
							}
							
							if (string!="")	 {                    
								$('#calls').append("<div class='log'>" + string + "</div>");
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