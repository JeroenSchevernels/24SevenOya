<template>
  <div class="changelog">
    <!-- <v-container bg fill-height grid-list-md text-xs-center> -->
      <v-layout row wrap align-center>
        <v-flex xs12 sm6 offset-sm3>
          <v-list two-line>
            <v-subheader>Changelog</v-subheader>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.43</v-list-tile-title>
                <v-list-tile-sub-title>Report added to see how many times each number calls</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.42</v-list-tile-title>
                <v-list-tile-sub-title>Toolbar removed in favor of navigation drawer</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.41</v-list-tile-title>
                <v-list-tile-sub-title>Amount of calls per number gets stored in Firebase</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.40</v-list-tile-title>
                <v-list-tile-sub-title>Report added to see call log from past dates</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.39</v-list-tile-title>
                <v-list-tile-sub-title>Only bot saves to Firebase and calllog seperated per day</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.38</v-list-tile-title>
                <v-list-tile-sub-title>
                  First steps towards saving call log in Firebase.<br/>
                  At the moment everything gets saved multiple times (1 per logged in user)
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.37</v-list-tile-title>
                <v-list-tile-sub-title>Firebase Authentication</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            
            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.36</v-list-tile-title>
                <v-list-tile-sub-title>Seperated CallsToday, Waiting, CallerInfo, AgentsOnline &amp; CallLog to components</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.35</v-list-tile-title>
                <v-list-tile-sub-title>We are using VueX : Call log is coming later</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.12</v-list-tile-title>
                <v-list-tile-sub-title>Added switches</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>v0.11</v-list-tile-title>
                <v-list-tile-sub-title>Added a changelog</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>
        </v-flex>
      </v-layout>
    <!-- </v-container> -->
  </div>
</template>
 