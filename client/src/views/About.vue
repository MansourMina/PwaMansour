<template>
  <v-container>
    <v-alert border="left" colored-border color="red darken-4" elevation="2">
      {{ text }}
    </v-alert>
    <v-btn @click="callSpeaker()"><v-icon>mdi-volume-high</v-icon></v-btn>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      text: 'Herzlich Wilkommen auf der Weather App. Diese App wurde von Mina Mansour entwickelt. Viel Spaß beim Surfen.',
    };
  },
  methods: {
    callSpeaker() {
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[10];
      msg.volume = 2; // From 0 to 1
      msg.rate = 1; // From 0.1 to 10
      msg.pitch = 3; // From 0 to 2
      msg.text = this.text;

      msg.lang = 'de';

      window.speechSynthesis.speak(msg);
    },
  },
};
</script>
