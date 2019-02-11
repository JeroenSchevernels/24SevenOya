<template>
	<div id="app">
		<title>{{documentTitle}}</title>
		<v-toolbar dark>
			<!-- <v-menu
				v-model="menu"
				:close-on-content-click="false"
      			:nudge-width="200"
      			offset-x>

				 <v-btn icon  slot="activator" >
					<v-icon large>menu</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile>
						<v-list-tile-action>
						<v-switch v-model="message" color="purple"></v-switch>
						</v-list-tile-action>
						<v-list-tile-title>Enable messages</v-list-tile-title>
					</v-list-tile>

				</v-list>
			</v-menu> -->
			<v-toolbar-title>
				24SOya
			</v-toolbar-title>
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
										<v-toolbar-title>Calls today: {{totalCalls}}</v-toolbar-title>
									</v-toolbar>
									<v-layout row>
										<v-card-text class="text-xs-left display-3"><v-icon x-large left color="green">call</v-icon>{{callsCompleted}}</v-card-text>
										<v-card-text class="text-xs-right display-3">{{callsAbandoned}} <v-icon x-large right color="red">call_missed</v-icon></v-card-text>
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
											<v-card-text class="text-xs-center display-3">
												{{callsWaiting}}<br/>
												<v-icon v-if="callsWaiting>0" x-large color="red">ring_volume</v-icon>
											</v-card-text> 
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
											<v-layout align-center justify-center column>											
												<v-card-text>
													<span class="headline"><v-icon v-if="caller.number!=''" small color="grey">phone</v-icon> {{caller.number}}</span>
													&nbsp;&nbsp;&nbsp;
													<span class="headline"><v-icon v-if="caller.name.trim()!=''" small color="grey">business</v-icon> {{caller.name}}</span><br />
													<span>{{caller.address}}</span><br />
													<span>{{caller.zipcode}}&nbsp;{{caller.city}}</span><br />
													<span>{{caller.country}}</span>
												</v-card-text>
											</v-layout>
										</v-card>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex d-flex>
								<v-card v-bind:style="{ backgroundColor: agentsBoxColor}">
									<v-toolbar flat>
										<v-toolbar-title>Support logged in: {{agentsOnline}}</v-toolbar-title>
									</v-toolbar>
									<v-layout row>
										<v-card-text class="text-xs-left"><span class="display-3"><v-icon x-large left color="green">person_outline</v-icon> {{agentsAvailable}}</span></v-card-text>
										<v-card-text class="text-xs-right"><span class="display-3">{{agentsBusy}} <v-icon x-large right color="red">person</v-icon></span></v-card-text>
									</v-layout>
									<v-layout row>
										<v-flex>
											<div class="text-xs-center">
												<v-chip v-for="agent in supportOnline" :key="agent.id" v-bind:class="agent.status">
													<v-avatar v-if="agent.avatar != ''">
														<img :src="agent.avatar">
													</v-avatar>
													{{ agent.name }} : {{ agent.calls }}
												</v-chip>
											</div>
										</v-flex>
									</v-layout>
								</v-card>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex d-flex xs12 sm5>
						<v-layout column>
							<v-flex>
								<v-card>
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
								</v-card>
								<v-card style="overflow-y: scroll; height:80.65vh" >
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
												<!-- <td>{{props.item.callid}}</td> -->
											</tr>
										</template>
										<v-alert slot="no-results" :value="true" color="error" icon="warning">
											Your search for "{{ search }}" found no results.
										</v-alert>
									</v-data-table>
								</v-card>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-container>
		</div>
	</div>
</template>

<script>
	class Call{
		constructor(){
			this.callid
		}
	}
	class Support {
		constructor(id,name,avatar="") {
			this.id = id
			this.name = name
			this.status = 'UNAVAILABLE'
			this.calls = 0
			this.avatar = avatar
			this.callid = ''
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
				abandoned: 0,
				precallid: '',
				caller: {			
					name: '',
					number: '',
					address: '',
					city: '',
					zipcode: '',
					country: '',
					id: '',
					lock: false
				},
				callid: [],
				nextCallId: 1,
				call: [
					// { // testing purpose and explanation of existing fields
					// 	time: '09:15',
					// 	number: '9191991',
					//  queue: 'Support NO',
					// 	name: ' name',
					// 	callid: [''],
					// 	status: 'new, taken, done',
					// 	answered: Support[i]
					// }
				],
				agentsBusy: 0,
				agentsOnline: 0,
				callsAbandoned: 0,
				callsCompleted: 0,
				callsWaiting: 0,
				search: '',
				headers: [
					{text: 'Time', value: 'time'},
					{text: 'Number', value: 'number'},
					{text: 'Name', value: 'name'},
					{text:'Answered by', value: 'answered'}
					// ,{text: 'Callid', value: 'callid'}
				],
				log: [],
				support:[]
			}
		},
		methods: {
			supportCheckId(id) {
				var self = this
				var found = self.support.some(el => el.id == id);
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
							self.support[index].calls += 1
							//self.caller.lock = true
							for(let c of self.call){
								if(c.callid == self.support[index].callid){
									c.status = 'taken'
									c.answered += self.support[index].name + ' '
								}
							}
						}
					}
				}
			},
			copyField(){
				return ('Samtale logg ' + this.caller.number + ' ' + this.caller.name).trim()
			},
			clipboardSuccessHandler ({ value, event }) {
				// console.log('success', value)
			},
			clipboardErrorHandler ({ value, event }) {
				console.log('error', value)
			},
			ts2time(number) {
				let timestamp = new Date(number);
				let hours = "0" + timestamp.getHours();
				let minutes = "0" + timestamp.getMinutes();
				// let seconds = "0" + timestamp.getSeconds();
				return hours.substr(-2) + ':' + minutes.substr(-2) //+ ':' + seconds.substr(-2);
			},
			deauthorized() {
				this.authorized = false
			},
			pushCall(call){
				var self = this
				self.call.push(call)				
			},
			callExist(caller){ 
				// checking if caller exist 
				var self = this				
				//clearer with .some() ???
				for (let c in self.call){
					if(caller.callerId.number == self.call[c].number){
						if(self.call[c].timestamp - new Date().getTime() < 120000){
							return true					
						}
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

					// Support NO in 
					// Partner norge out or others out 
					//add queue filter
					let bool = true
					if(self.callExist(msg.data)){
						bool = false
					}else{
						self.nextCallId++
						self.callid.push(msg.data.id)
						self.log.push(msg.data)
					}	
					// checks if user is in support array
					if (self.supportCheckId(msg.data.userId)) {
									
						// direction -> not working
						if (msg.data.direction === "out" || msg.data.callerId.name === "Partner Norge") {
							// take time on outgoing calls ? 
						}

						if (msg.data.direction === 'in' && msg.data.callerId.name === "Support NO") {
							var info = {
								'Name': '',
								'Address': '',
								'Zipcode': '',
								'City': '',
								'Country': '',
								'Number': '',
								'Queue': ''
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
									for(let id in self.support){
										if (self.support[id].status != 'BUSY' && self.support[id].id == msg.data.userId) {
											self.support[id].callid = self.nextCallId
										}
									}
									self.precallid = msg.data.id	

									if (self.call.length > 0) {
										if (self.call[self.call.length - 1].number === msg.data.callerId.number) { // check if phone number is the same as the previous one
											
											if (new Date().getTime() - self.call[self.call.length - 1].timestamp < 120000) { //less than 2 minutes since last, so we assume same call
												self.call[self.call.length - 1].timestamp = new Date().getTime()
												self.call[self.call.length - 1].time = self.ts2time(new Date().getTime())
											} else { //same number, but longer than 2 minutes ago
												console.log('same number, but longer than 2 minutes ago');
												console.log('previous' + self.call[self.call.length - 1].timestamp);
												console.log('now' + new Date().getTime());
												self.call.push({
													number: msg.data.callerId.number,
													name: info.Name,
													timestamp: new Date().getTime(),
													time: self.ts2time(new Date().getTime()),
													callid: self.nextCallId,										
													status: 'new',
													queue: msg.data.callerId.name,
													answered: ''
												});
											}
										} else { //previous number not the same as the current // true
											self.call.push({
												number: msg.data.callerId.number,
												name: info.Name,
												timestamp: new Date().getTime(),
												time: self.ts2time(new Date().getTime()),
												callid: self.nextCallId,										
												status: 'new',
												queue: msg.data.callerId.name,
												answered: ''
											});
										}
									} else { //no call in list yet
										self.call.push({
											number: msg.data.callerId.number,
											name: info.Name,
											timestamp: new Date().getTime(),
											time: self.ts2time(new Date().getTime()),
											callid: self.nextCallId,
											status: 'new',
											queue: msg.data.callerId.name,
											answered: ''
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

					// only current users events
					if (self.currentUser.id == msg.data.userId) {	
						if (msg.data.direction === 'in' && msg.data.callerId.name === "Support NO") {
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
								// what is this phone? 
								//if (msg.data.userId == self.currentUser.id) info.Number = msg.data.callerId.number
								if (data.location != null) info.Country = data.location
								
								if (msg.data.event == 'ring') {
									//if this change
									// self.precallid = self.caller.id
													

									self.caller.number = msg.data.callerId.number
									self.caller.name = info.Name
									self.caller.address = info.Address
									self.caller.zipcode = info.Zipcode
									self.caller.city = info.City
									self.caller.country = info.Country

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
				return "RGB(255," + (255 - (255 * this.agentsBusy / this.agentsOnline)) + "," + (255 - (255 * this.agentsBusy / this.agentsOnline)) + ")"
			},
			queueBoxColor: function(){
				return "RGB(255," + (255 - this.callsWaiting * 50) + "," + (255 - this.callsWaiting * 50) + ")"
			},
			callsBoxGradient: function(){
				let percentage = Math.round(this.callsCompleted / (this.callsCompleted + this.callsAbandoned) * 100);
				if (percentage > 99) { //stupid, but gradient expected
					return "linear-gradient(to right, #a2f282 " + (percentage - 3) + "% ," + percentage + "% ,#a2f282 " + (percentage + 3) + "% )";
				} else if (percentage < 1) { //stupid, but gradient expected
					return "linear-gradient(to right, #f7796a " + (percentage - 3) + "% ," + percentage + "% ,#f7796a " + (percentage + 3) + "% )";
				} else {
					return "linear-gradient(to right, #a2f282 " + (percentage - 3) + "% ," + percentage + "% ,#f7796a " + (percentage + 3) + "% )";
				}		
			},
			totalCalls: function(){
				if (this.callsCompleted + this.callsAbandoned > 0){
					return this.callsCompleted + this.callsAbandoned + " (" + Math.round(100*this.callsCompleted/(this.callsCompleted+this.callsAbandoned)) + "%)"
				} else {
					return this.callsCompleted + this.callsAbandoned
				}
			},
			agentsAvailable: function(){
				return this.agentsOnline - this.agentsBusy
			}
		}
	}
</script>
<style>
	#app{
		background-color: #828282;
		font-family: Roboto, sans-serif;
	}

	.AVAILABLE,
	.RINGING {
		background-color: #a2f282 !important;
	}

	.BUSY {
		background-color: #f7796a !important;
	}

	.OTHER {
		background-color: #e7e7e7 !important;
	}
</style>