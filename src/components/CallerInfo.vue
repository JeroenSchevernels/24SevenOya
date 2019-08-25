<template>
    <v-card min-height="100%">
        <v-toolbar flat dark>
            <v-toolbar-title>
                Caller info
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon v-clipboard="() => copyField()" v-clipboard:success="clipboardSuccessHandler" v-clipboard:error="clipboardErrorHandler">
                <v-icon large>assignment</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text>
            <span class="headline">
                    <v-icon v-if="caller.number!=''" small>phone</v-icon> {{caller.number}}
            </span>
            <span class="headline">
                    <v-icon v-if="caller.name.trim()!=''" small>business</v-icon> {{caller.name}}
                </span><br/>
            <span>{{caller.address}}</span><br />
            <span>{{caller.zipcode}}&nbsp;{{caller.city}}</span><br />
            <span>{{caller.country}}</span>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CallerInfo',
  computed: {
      ...mapGetters([
            'caller'
        ])
    },
    methods: {
		copyField() {
				return ('Samtale logg ' + this.caller.number + ' ' + this.caller.name).trim()
		},
		clipboardSuccessHandler() {
				
		},
		clipboardErrorHandler({
				value,
				event
		}) {
				console.log('Copy error', value, event)
		}
	},
}
</script>


