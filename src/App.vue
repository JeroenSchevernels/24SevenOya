<template>
	<div id="app">
		<title>{{documentTitle}}</title>

		<button v-if="!authorized" @click="login">login</button>
		<button v-if="authorized" @click="logout">logout</button>

		<div v-if="authorized">
			<div class="row">
				<span class="right">
					{{currentUser.username}}
				</span>
			</div>
			<br />
			<div class="grid-container">
				<div class="box callsBox">
					<p>
						<span class="box-caption">Calls today:</span><br />
						<span class="left">
							<span class="box-value" id="completed">{{callsCompleted}}</span> completed
						</span>
						<span class="right">
							<span class="box-value" id="abandoned">{{callsAbandoned}}</span> abandoned
						</span>
					</p>
				</div>
				<div class="box agentsBox">
					<p>
						<span class="box-caption">Support on phone:</span><br />
						<span class="left">
							<span class="box-value" id="agentsBusy">{{agentsBusy}}</span> busy
						</span>
						<span class="right">
							<span class="box-value" id="agentsOnline">{{agentsOnline}}</span> online
						</span>
					</p>
					<div id="support"></div>
				</div>
				<div class="box queueBox">
					<p>
						<span class="box-caption">Waiting:</span><br />
						<span class="box-value" id="waiting">{{callsWaiting}}</span>
					</p>
				</div>
				<div class="box infoBox">
					<!-- <button id="copy"><i class="far fa-clipboard"></i> Copy</button> -->
					<button id="copy">Copy</button>
					<span class="box-caption">Caller info:</span><br />
					<h2><span id="cnNumber">{{caller.number}}</span>
						<span id="cnName">{{caller.name}}</span></h2>
					<span id="cnAddress">{{caller.address}}</span><br />
					<span id="cnZipCity">{{caller.zipcode}}</span><br />
					<span id="cnCountry">{{caller.contry}}</span>
					<textarea id="copyTxt"></textarea>
				</div>
				<div class="box logBox">
					<table id="log"></table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	class Support {
		constructor(name) {
			this.name = name;
			this.status = 'unknown';
			this.calls = 0;
		}
	}

	const support = new Map(); //IE11 doesn't support Map(iterable), so setting it like this...
	support.set(21102, new Support("Adam"));
	support.set(3215, new Support("Alexander"));
	support.set(2944, new Support("Andreas"));
	support.set(20714, new Support("Eirik"));
	support.set(16517, new Support("Fredrik"));
	support.set(20321, new Support("Guro"));
	support.set(19608, new Support("Hanne"));
	support.set(3208, new Support("Henrik"));
	support.set(2947, new Support("Iselin"));
	support.set(21101, new Support("Jeroen"));
	support.set(5546, new Support("Joakim"));
	support.set(2943, new Support("Kjerstin"));
	support.set(21100, new Support("Konrad"));
	support.set(16518, new Support("Petter"));
	support.set(2945, new Support("Silje"));
	support.set(4958, new Support("Sonja"));
	support.set(3184, new Support("Terje"));
	support.set(17333, new Support("Truls"));

	export default {
		name: 'app',
		components:{

		},
		data() {
			return {
				documentTitle: '24Soya',
				message: 'avaible',
				authorized: true,
				access_token: '',
				currentUser: {},
				users: [],
				calls: 0,
				abandoned: 0,
				caller: {
					name: '-',
					number: '-',
					address: '-',
					city: '-',
					zipcode: '-',
					country: '-'
				},
				log: [],
				call: [],
				agentsBusy: '-',
				agentsOnline: '-',
				callsAbandoned: '-',
				callsCompleted: '-',
				callsWaiting: '-'

			}
		},
		methods: {
			statusUpdate(id, state) {
				if (support.has(id)) {
					if (state != support.get(id).status) {
						let previous = support.get(id).status;
						support.get(id).status = state;

						if ((previous === 'RINGING') && (support.get(id).status === 'BUSY')) {
							support.get(id).calls += 1;
							console.log(support.get(id).name + ' is on the phone: ' + support.get(id).calls);
							// check which call is in waiting, then check afterwards if same call
						}
					}

					// VISUAL PART WITH TAGS IN AGENTS BOX
					if (state == 'UNAVAILABLE') {
						if ($("#" + id).length != 0) {
							$('#s' + id).remove;
						}
					} else {
						if ($("#" + id).length == 0) {
							//it doesn't exist yet
							$('#support').append("<span id='" + id + "' class='label OTHER'>" + support.get(id).name + "</span>");
						} else { //update existing
							if (!$('#' + id).hasClass(state)) { //else ignore
								$('#' + id).removeClass("BUSY AVAILABLE OTHER RINGING");
								$('#' + id).addClass(state);
							}
						}
					}
				}
			},
			updateCall() {
				var self = this
				$('#log').html('');
				for (let i = 0; i < self.call.length; i++) {
					$('#log').append("<tr><td>" + self.ts2time(self.call[i].timestamp) + "</td><td>" + self.call[i].name + "</td><td>" + self.call[i].number +
						"</td></tr>");
				}
			},
			ts2time(number) {
				let timestamp = new Date(number);
				let hours = timestamp.getHours();
				let minutes = "0" + timestamp.getMinutes();
				// let seconds = "0" + timestamp.getSeconds();
				return hours + ':' + minutes.substr(-2); //+ ':' + seconds.substr(-2);
			},
			deauthorized() {
				this.authorized = false
			},
			authorize() {
				var self = this
				self.authorized = true

				Oyatel.Events.subscribe('/events/presence', function (msg) {
					if (msg.data.event == "fulldump") {
						for (let event in msg.data.events) {
							self.statusUpdate(msg.data.events[event].userId, msg.data.events[event].state);
						}
					} else {
						self.statusUpdate(msg.data.userId, msg.data.state);
					}
				});

				Oyatel.User.currentUser(function (user) {
					self.currentUser = user;
				});

				Oyatel.Events.subscribe('/events/queue', function (msg) {

					if (msg.data.queueId == "que0110312") { //Filter on Support NO queue only!
						self.agentsBusy = msg.data.agentsBusy;
						self.agentsOnline = msg.data.agentsOnline;
						self.callsAbandoned = msg.data.callsAbandoned;
						self.callsCompleted = msg.data.callsCompleted;
						self.callsWaiting = msg.data.callsWaiting;

						let percentage = Math.round(self.callsCompleted / (self.callsCompleted + self.callsAbandoned) * 100);
						if (percentage > 99) {
							$(".callsBox").css("background", "#a2f282");
						} else if (percentage < 1) {
							$(".callsBox").css("background", "#ef5d4c");
						} else {
							$(".callsBox").css("background-image", "linear-gradient(to right, #a2f282 " + (percentage - 5) + "% ," +
								percentage + "% ,#ef5d4c " + (percentage + 5) + "% )");
						}
						$(".agentsBox").css("background", "RGBA(255,0,0," + (self.agentsBusy / self.agentsOnline) + ")")
						$(".queueBox").css("background", "RGBA(255,0,0," + (self.callsWaiting * 0.20) + ")")
						self.documentTitle = 'Wait: ' + self.callsWaiting + ' Busy: ' + self.agentsBusy + '/' + self.agentsOnline
					}
				})

				Oyatel.Events.subscribe('/events/call', function (msg) {
					if (support.has(msg.data.userId)) {
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
							Oyatel.Call.numberInfo(msg.data.callerId.number, function (data) {
								if (data.matches.length > 0) {
									if (data.matches[0].name != null) info.Name = data.matches[0].name;
									if (data.matches[0].address != null) info.Address = data.matches[0].address;
									if (data.matches[0].zipcode != null) info.Zipcode = data.matches[0].zipcode;
									if (data.matches[0].city != null) info.City = data.matches[0].city;
								}
								if (msg.data.userId == self.currentUser.id) {
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
									if (self.call.length > 0) {
										if (self.call[self.call.length - 1].number === msg.data.callerId.number) {
											if (new Date().getTime() - self.call[self.call.length - 1].timestamp < 60000) { //less than a minute since last, so we assume same call
												self.call[self.call.length - 1].timestamp = new Date().getTime();
											} else {
												self.call.push({
													number: msg.data.callerId.number,
													name: info.Name,
													timestamp: new Date().getTime()
												});
											}
										} else {
											self.call.push({
												number: msg.data.callerId.number,
												name: info.Name,
												timestamp: new Date().getTime()
											});
										}
									} else {
										self.call.push({
											number: msg.data.callerId.number,
											name: info.Name,
											timestamp: new Date().getTime()
										});
									}
									self.updateCall();
								} else if (msg.data.event == 'hangup') {
									// hangup
								} else {
									alert('other status: ' + msg.data);
								}
							})
						}
					}
				})
			},
			// Need to fix this CORS
			login() {
				Oyatel.authorize()
			},
			logout() {
				Oyatel.deauthorize()
			},
			init() {
				var self = this
				Oyatel.init('7660F6FB-418F-44F4-B1F3-F6CB2F7B0223', 'https://24soya.netlify.com/oauth_cb.html')
				Oyatel.bind('authorized', function () {
					self.authorize()
				})
				Oyatel.bind('authorizationfailed', function (errormsg) {
					console.log('The user rejected the authorization, or some error occured: ' + errormsg);
				})
				Oyatel.bind('deauthorized', function () {
					console.log('onDeauthorized callback called')
					self.deauthorized()
				})
				Oyatel.checkAuthorization()
				self.authorize()
			}
		},
		mounted() {
			this.init()
		}
	}
</script>