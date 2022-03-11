<template>
  <v-app>
    <v-snackbar v-model="snackbar" :timeout="timeout" right height="50">
      <span>
        <v-icon class="mr-4 hidden-sm-and-down">mdi-bell-ring</v-icon>
        <span class="">Benachrichtigungen aktivieren?</span>
      </span>

      <template v-slot:action="{ attrs }">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            v-bind="attrs"
            text
            @click="
              snackbar = false;
              subscribe();
            "
          >
            Ja
          </v-btn>
          <v-btn
            color="red darken-1"
            v-bind="attrs"
            text
            @click="snackbar = false"
          >
            Nein
          </v-btn>
        </v-card-actions>
      </template>
    </v-snackbar>
    <v-bottom-navigation v-model="value" shift app>
      <v-btn
        plain
        active-class="blue--text transparent"
        to="/"
        height="50"
        exact
      >
        <span class="pa-2">Wetter</span>

        <v-icon medium> mdi-thermometer </v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        plain
        active-class="blue--text transparent"
        to="/favorite"
        height="50"
        exact
      >
        <span class="pa-2">Favoriten</span>

        <v-icon medium> mdi-star </v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn
        plain
        active-class="blue--text transparent"
        to="/about"
        height="50"
        exact
      >
        <span class="pa-2">About</span>

        <v-icon medium> mdi-information </v-icon>
      </v-btn>
    </v-bottom-navigation>
    <!-- <v-footer app height="80" id="footer">
      <v-btn
        plain
        active-class="blue--text transparent"
        to="/"
        height="50"
        exact
      >
        <v-col cols="12" class="align-center">
          <v-row class="mb-2 justify-center">
            <v-icon medium> mdi-thermometer </v-icon>
          </v-row>
          <v-row> Wetter </v-row>
        </v-col>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn
        plain
        active-class="blue--text transparent"
        to="/favorite"
        height="50"
        exact
      >
        <v-col cols="12">
          <v-row class="mb-2 justify-center">
            <v-icon medium> mdi-star </v-icon>
          </v-row>
          <v-row> Favoriten </v-row>
        </v-col>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        plain
        active-class="blue--text transparent"
        to="/about"
        height="50"
        exact
      >
        <v-col cols="12">
          <v-row class="mb-2 justify-center">
            <v-icon medium> mdi-information </v-icon>
          </v-row>
          <v-row> About </v-row>
        </v-col>
      </v-btn>
    </v-footer> -->
    <div class="red darken-4 text-center" role="alert" v-if="offline">
      <span class="white--text">You are offline...</span>
    </div>

    <v-main
      :style="`background-color: ${
        $route.name == 'Favoriten' ? 'black' : background
      }`"
    >
      <router-view
        :json="newJson"
        :offline="offline"
        :getTime="getTime"
        @refreshTime="timeofCity = getTime(zoneName)"
        @refreshWeather="apiCall"
        :currentCity="currentCity"
      />
    </v-main>
  </v-app>
</template>

<script>
import { openDB } from 'idb';
import axios from 'axios';
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    background: '',
    snackbar: false,
    timeout: 5000,
    sunset: '',
    sunrise: '',
    zoneName: '',
    imageWeather: null,
    currentWeather: '',
    countryName: 'Vienna',
    timeofCity: '',
    description: '',
    search: '',
    long: '',
    currentCity: '',
    lat: '',
    openweatherKey: '52293b43835f810dfe6fc255311d9794',
    feelsLike: '',
    tmin: '',
    tmax: '',
    humidity: '',
    offline: false,
    dialog: false,
    timeZoneKey: '1OPC3LTOMNKY',
    newJson: {},
    serverAddress: process.env.VUE_APP_SERVER,

    value: 1,
    db: null,
    publicVapidKey:
      'BCxcBWBIlS4jWqPuqGCuhG-Ch33MI2eVrU4ZDVzC6OD0dGE3_nFpXsbzbb5QiqcRtpm9mVHzRlKnlnvFzcm3B8w',
  }),
  async created() {
    const notification = localStorage.getItem('notification', true);
    if (notification == null) {
      setTimeout(() => {
        this.snackbar = true;
      }, 3000);
    }

    this.db = await openDB('favoriteCountriesDB', 1, {
      upgrade(db) {
        db.createObjectStore('countries', { keyPath: 'countryName' });
      },
    });
  },
  mounted() {
    document.addEventListener('swUpdated', this.updateAvailable, {
      once: true,
    });

    window.addEventListener('online', () => {
      this.offline = false;
    });
    window.addEventListener('offline', () => {
      this.offline = true;
    });
    if (navigator.onLine) {
      this.offline = false;
    } else {
      this.offline = true;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;

        await this.apiCall();
      });
    }
  },
  methods: {
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    async subscribe() {
      localStorage.setItem('notification', true);
      if (!('serviceWorker' in navigator)) {
        console.log('no service worker!');

        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey),
      });
      await axios.post(`${this.serverAddress}/subscribe`, subscription);
    },
    async apiCall() {
      //  if (status == 'current') {
      // this.waiting = true;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.long}&appid=${this.openweatherKey}`;

      const response = await fetch(api);

      if (!response.ok) {
        // this.clickMethod = false;
        this.message = 'Can not read Position';
      } else {
        const json = await response.json();
        this.currentCity = json.name;
        await this.getWeather(json);
        // this.waiting = false;
      }
    },
    getTime(timeZone) {
      let options = {
        timeZone: timeZone,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      return new Intl.DateTimeFormat([], options).format(new Date());
    },
    changeBackground() {
      let splitDateTime = this.timeofCity.split(',');
      let timeofSplit = splitDateTime[1];
      let splitHourMinute = timeofSplit.split(':')[0];
      if (splitHourMinute <= 6 || splitHourMinute >= 20) {
        this.background = 'rgb(4, 12, 54)';
        // this.$emit('changeBackground', this.background);
      } else {
        this.background = 'rgb(78, 99, 206)';
        // this.$emit('changeBackground', this.background);
      }
    },
    async getTimeZone() {
      const api = `https://api.timezonedb.com/v2.1/get-time-zone?key=${this.timeZoneKey}&format=json&by=position&lat=${this.lat}&lng=${this.long}`;
      const response = await fetch(api);
      if (!response.ok) {
        console.log('etwas schiefgelaufen');
      }
      const json = await response.json();
      this.zoneName = json.zoneName;
      return json.zoneName;
    },
    updateAvailable() {
      alert('Update vorhanden, bitte App neu starten');
    },
    async getWeather(json) {
      this.currentWeather = Math.ceil(json.main.temp - 273.15) + '°';

      this.countryName = json.name;
      this.description = json.weather[0].main;
      let weatherIcon = json.weather[0].icon;
      this.imageWeather = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
      this.feelsLike = Math.ceil(json.main.feels_like - 273.15) + '°';
      this.tmax = Math.ceil(json.main.temp_max - 273.15) + '°';
      this.tmin = Math.ceil(json.main.temp_min - 273.15) + '°';

      this.timeofCity = this.getTime(await this.getTimeZone());
      this.changeBackground();
      this.humidity = json.main.humidity + '%';

      this.newJson = {
        currentWeather: this.currentWeather,
        countryName: this.countryName,
        description: this.description,
        imageWeather: this.imageWeather,
        feelsLike: this.feelsLike,
        tmax: this.tmax,
        tmin: this.tmin,
        timeofCity: this.timeofCity,
        background: this.background,
        humidity: this.humidity,
      };

      // this.sunrise = sunriseSunset.format(new Date(json.sys.sunrise * 1000));
      // this.sunset = sunriseSunset.format(new Date(json.sys.sunset * 1000));
    },
  },
};
</script>

<style>
body {
  color: #fff;
  overflow-x: hidden;
  height: 100%;
  background-repeat: no-repeat;
}
.details {
  color: #b0bec5;
}
#addfavorite {
  position: fixed;
  bottom: 20;
  right: 0;
  z-index: 2;
}
</style>
