<template>
  <div class="changelog">
    <v-timeline dense dark>
      <!-- minor change
        <v-timeline-item small>
        <v-card>
          <v-card-title>Version number</v-card-title>
          <v-card-text>
            Description
          </v-card-text>
        </v-card>
      </v-timeline-item>

      bigger gange
      <v-timeline-item large>
        <v-card>
          <v-card-title>Version number</v-card-title>
          <v-card-text>
            Description
          </v-card-text>
        </v-card>
      </v-timeline-item> 
      
      -->
      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.47</v-card-title>
          <v-card-text>
            Max name length in the call log.
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.46</v-card-title>
          <v-card-text>
            Gray color on the text for waiting and caller info is corrected. Document title is working as before. Space aroud the agent chips
          </v-card-text>
        </v-card>
      </v-timeline-item>
      
      <v-timeline-item large>
        <v-card>
          <v-card-title>v0.45</v-card-title>
          <v-card-text>New design and trying out new layout</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.44</v-card-title>
          <v-card-text>Jeroen.netlify build, dist publish from git</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.43</v-card-title>
          <v-card-text>Report added to see how many times each number calls</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.42</v-card-title>
          <v-card-text>Toolbar removed in favor of navigation drawer</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.41</v-card-title>
          <v-card-text>Amount of calls per number gets stored in Firebase</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.40</v-card-title>
          <v-card-text>Report added to see call log from past dates</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.39</v-card-title>
          <v-card-text>Only bot saves to Firebase and calllog seperated per day</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.38</v-card-title>
          <v-card-text>
            First steps towards saving call log in Firebase.<br />
            At the moment everything gets saved multiple times (1 per logged in user)
          </v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.37</v-card-title>
          <v-card-text>Firebase Authentication</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.36</v-card-title>
          <v-card-text>Seperated CallsToday, Waiting, CallerInfo, AgentsOnline &amp; CallLog to components</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.35</v-card-title>
          <v-card-text>We are using VueX : Call log is coming later</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.12</v-card-title>
          <v-card-text>Added switches</v-card-text>
        </v-card>
      </v-timeline-item>

      <v-timeline-item small>
        <v-card>
          <v-card-title>v0.11</v-card-title>
          <v-card-text>Added a changelog</v-card-text>
        </v-card>
      </v-timeline-item>

    </v-timeline>
  </div>
</template>