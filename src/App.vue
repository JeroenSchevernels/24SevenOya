<template>
	<div id="app">
		<title>{{documentTitle}}</title>
		<v-toolbar dark>
			<v-toolbar-title>24SOya</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-toolbar-items>
				<v-btn flat v-if="!authorized" @click="login">Login with Oyatel</v-btn>
				<v-btn flat v-if="authorized" @click="logout">Logout ({{currentUser.username}})</v-btn>
			</v-toolbar-items>
		</v-toolbar>	
		<div v-if="authorized">
			<v-container fluid grid-list-md>
				<v-layout row wrap style="height: 88vh">
					<v-flex d-flex xs12 sm7>
						<v-layout column wrap>
							<v-flex d-flex>
								<v-card v-bind:style="{ 'background-image': callsBoxGradient}">
									<v-toolbar flat>
										<v-toolbar-title>
											Calls today
										</v-toolbar-title>
									</v-toolbar>
									<v-layout row>
										<v-card-text class="text-xs-left"><span class="display-3">{{callsCompleted}} </span>completed</v-card-text>
										<v-card-text class="text-xs-right"><span class="display-3">{{callsAbandoned}} </span>abandoned</v-card-text>
									</v-layout>
								</v-card>
							</v-flex>
							<v-flex d-flex>
								<v-layout row wrap>
									<v-flex d-flex xs12 sm4>
										<v-card v-bind:style="{ backgroundColor: queueBoxColor}">
											<v-toolbar flat>
												<v-toolbar-title>
													Waiting
												</v-toolbar-title>
											</v-toolbar>
											<v-card-text class="text-xs-center display-3">{{callsWaiting}}</v-card-text>
										</v-card>
									</v-flex>
									<v-flex d-flex xs12 sm8>
										<v-card>
											<v-toolbar flat>
												<v-toolbar-title>
													Caller info
												</v-toolbar-title>
												<v-spacer></v-spacer>
												<v-btn icon
													v-clipboard="() => copyField()"
													v-clipboard:success="clipboardSuccessHandler"
													v-clipboard:error="clipboardErrorHandler">
													<v-icon large>assignment</v-icon>
												</v-btn>
											</v-toolbar>
											<v-card-text>
												<h2>
													<span>{{caller.number}}</span>
													<span>{{caller.name}}</span>
												</h2>
												<span>{{caller.address}}</span><br />
												<span>{{caller.zipcode}}</span><br />
												<span>{{caller.country}}</span><br />
											</v-card-text>		
										</v-card>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex d-flex>
								<v-card v-bind:style="{ backgroundColor: agentsBoxColor}">
									<v-toolbar flat>
										<v-toolbar-title>Support on phone</v-toolbar-title>
									</v-toolbar>
									<v-layout row>
										<v-card-text class="text-xs-left"><span class="display-3">{{agentsBusy}} </span>busy</v-card-text>
										<v-card-text class="text-xs-right"><span class="display-3">{{agentsOnline}} </span>online</v-card-text>
									</v-layout>
									<v-layout align-end justify-center row>
										<v-flex>
											<v-chip v-for="agent in supportOnline" :key="agent.id" v-bind:class="agent.status">
												<v-avatar v-if="agent.avatar != ''">
													<img :src="agent.avatar">
												</v-avatar>
												{{ agent.name }} : {{ agent.calls }}
											</v-chip>
										</v-flex>
									</v-layout>
								</v-card>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex d-flex xs12 sm5>
						<v-card style="overflow-y: scroll">
							<v-toolbar flat>
								<v-toolbar-title>Call log</v-toolbar-title>
								<v-spacer></v-spacer>
								<v-text-field
									v-model="search"
									append-icon="search"
									label="Search"
									single-line
									hide-details
								></v-text-field>																
							</v-toolbar>
							<v-data-table 
								:headers="headers"
								:items="call"
								:search="search"
								hide-actions
								class="fixed-header"
								> <!-- class fixed header is commented out in css -->
								<template slot="items" slot-scope="props">
									<tr @click="props.expanded = !props.expanded">
										<td>{{props.item.time}}</td>
										<td>{{props.item.number}}</td>
										<td>{{props.item.name}}</td>
										<td>{{props.item.answered}}</td>
									</tr>
								</template>
								<v-alert slot="no-results" :value="true" color="error" icon="warning">
									Your search for "{{ search }}" found no results.
								</v-alert>
							</v-data-table>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</div>
	</div>
</template>

<script>

	class Call {
		constructor(call) {   
			this.number = call.number
			this.name = call.name
		}

		answered(event){
			// set user and 
		}

		hangup(event){
			// set duration and update status
		}
	}

	class Support {
		constructor(id,name,avatar="") {
			this.id = id;
			this.name = name;
			this.status = 'UNAVAILABLE';
			this.calls = 0;
			this.avatar = avatar;
		}
	}

	export default {
		name: 'app',
		components:{

		},
		data() {
			return {
				documentTitle: '24Soya',
				authorized: true,
				currentUser: {},
				calls: 0,
				abandoned: 0,
				caller: {			
					name: '',
					number: '',
					address: '',
					city: '',
					zipcode: '',
					country: ''
				},
				callid: [],
				log: [],
				agentsBusy: '',
				agentsOnline: '',
				callsAbandoned: '',
				callsCompleted: '',
				callsWaiting: '',
				call: [],
				calls:[], // for class
				expand: true,
				search: '',
				headers: [
					{text: 'Time', value: 'time'},
					{text: 'Number', value: 'number'},
					{text: 'Name', value: 'name'},
					{text:'Answered by', value: 'answered'}
				],
				support:[]
			}
		},
		methods: {
			supportCheckId(id) {
			var self = this
			var found = self.support.some(function (el) {
				return el.id == id;
			});
			return found;
			},

			statusUpdate(id, state) {
				var self = this
				if (self.supportCheckId(id)){
					let index = self.support.findIndex(x => x.id==id);
					if (state != self.support[index].status) {
						let previous = self.support[index].status;
						self.support[index].status = state;

						if ((previous === 'RINGING') && (self.support[index].status === 'BUSY')) {
							self.support[index].calls += 1;
							console.log(self.support[index].name + ' is on the phone: ' + self.support[index].calls);
							// check which call is in waiting, then check afterwards if same call
						}
					}
				}
			},
			copyField(){
				return 'Samtale logg ' + this.caller.number + ' ' + this.caller.name 
			},
			clipboardSuccessHandler ({ value, event }) {
				console.log('success', value)
			},
			clipboardErrorHandler ({ value, event }) {
				console.log('error', value)
			},
			ts2time(number) {
				let timestamp = new Date(number);
				let hours = timestamp.getHours();
				let minutes = "0" + timestamp.getMinutes();
				// let seconds = "0" + timestamp.getSeconds();
				return hours + ':' + minutes.substr(-2) //+ ':' + seconds.substr(-2);
			},
			deauthorized() {
				this.authorized = false
			},
			pushCall(call){
				var self = this
				self.call.push(call)				
			},
			callExist(caller){ 
				var self = this 
				
				for (let c in self.callid){
					if(caller.id == self.callid[c]){
						//console.log(caller.id + ' ' + self.callid[c])
						return true					
					}
				}		
				return false						
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
						self.documentTitle = 'Wait: ' + self.callsWaiting + ' Busy: ' + self.agentsBusy + '/' + self.agentsOnline
					}
				})

				Oyatel.Events.subscribe('/events/call', function (msg) {
					self.log.push(msg.data)
					let bool = true
					if(self.callExist(msg.data)){
						//console.log(msg.data.id)
						bool = false
					}else{
						self.callid.push(msg.data.id)
					}

					if (self.supportCheckId(msg.data.userId) && bool) {
						if (msg.data.direction === "out") {
							alert("<p>SOMEONE CALLED OUT! IS THIS SHIT FINALLY WORKING?</p>");
						}
						if (msg.data.direction === 'in') {
							self.calls.push(new Call(msg.data.callerId))
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
									self.caller.number = msg.data.callerId.number
									self.caller.name = info.Name
									self.caller.address = info.Address
									self.caller.zipcode = info.Zipcode
									self.caller.country = info.country
									// we never user the caller object .-.
									// $('#cnNumber').html(msg.data.callerId.number);
									// $('#cnName').html(info.Name);
									// $('#cnAddress').html(info.Address);
									// $('#cnZipCity').html(info.Zipcode + " " + info.City);
									// $('#cnCountry').html(info.Country);
									// $('#copyTxt').text('Samtale logg ' + msg.data.callerId.number + ' ' + info.Name);
									
									
									if (self.call.length > 0) {
										if (self.call[self.call.length - 1].number === msg.data.callerId.number) {
											
											if (new Date().getTime() - self.call[self.call.length - 1].timestamp < 60000) { //less than a minute since last, so we assume same call
												self.call[self.call.length - 1].timestamp = new Date().getTime()
												self.call[self.call.length - 1].time = self.ts2time(new Date().getTime())
											} else {
												self.call.push({
													number: msg.data.callerId.number,
													name: info.Name,
													timestamp: new Date().getTime(),
													time: self.ts2time(new Date().getTime())
												});
											}
										} else {
											self.call.push({
												number: msg.data.callerId.number,
												name: info.Name,
												timestamp: new Date().getTime(),
												time: self.ts2time(new Date().getTime())
											});
										}
									} else {
										self.call.push({
											number: msg.data.callerId.number,
											name: info.Name,
											timestamp: new Date().getTime(),
											time: self.ts2time(new Date().getTime())
										});
									}
									//self.updateCall();
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
			this.support.push( new Support(21102, "Adam"));
			this.support.push( new Support(3215, "Alexander", "./src/img/am.png"));
			this.support.push( new Support(2944, "Andreas", "./src/img/ad.png"));
			this.support.push( new Support(20714, "Eirik", "./src/img/el.png"));
			// support.push( new Support(16517, "Fredrik"));
			this.support.push( new Support(20321, "Guro"));
			this.support.push( new Support(19608, "Hanne"));
			this.support.push( new Support(3208, "Henrik"));
			this.support.push( new Support(2947, "Iselin"));
			this.support.push( new Support(21101, "Jeroen", "./src/img/jss.png"));
			this.support.push( new Support(5546, "Joakim", "./src/img/jll.png"));
			this.support.push( new Support(2943, "Kjerstin"));
			this.support.push( new Support(21100, "Konrad"));
			this.support.push( new Support(16518, "Petter", "./src/img/pb.png"));
			// support.push( new Support(2945, "Silje"));
			this.support.push( new Support(4958, "Sonja"));
			this.support.push( new Support(3184, "Terje", "./src/img/tl.png"));
			this.support.push( new Support(17333,"Truls"));
		},
		computed: {
			supportOnline: function(){
				var supportOnline = this.support.filter(agent => agent.status != "UNAVAILABLE");
				return supportOnline;
			},
			agentsBoxColor: function(){				
				return "RGBA(255,0,0," + (this.agentsBusy / this.agentsOnline) + ")"
			},
			queueBoxColor: function(){				
				return "RGBA(255,0,0," + (this.callsWaiting * 0.20) + ")"
			},
			callsBoxGradient: function(){
				let percentage = Math.round(this.callsCompleted / (this.callsCompleted + this.callsAbandoned) * 100);
				if (percentage > 99) { //stupid, but gradient expected
					return "linear-gradient(to right, #a2f282 " + (percentage - 5) + "% ," + percentage + "% ,#a2f282 " + (percentage + 5) + "% )";
				} else if (percentage < 1) { //stupid, but gradient expected
					return "linear-gradient(to right, #ef5d4c " + (percentage - 5) + "% ," + percentage + "% ,#ef5d4c " + (percentage + 5) + "% )";
				} else {
					return "linear-gradient(to right, #a2f282 " + (percentage - 5) + "% ," + percentage + "% ,#ef5d4c " + (percentage + 5) + "% )";
				}		
			}
		}
	}
</script>