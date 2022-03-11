<template>
  <div>
    <v-card v-if="notFound">
      <v-toolbar dark class="fixed-bar">
        <v-btn
          icon
          dark
          @click="
            $emit('closeDialog');
            notFound = false;
          "
        >
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid :style="`background-color: white`">
        <v-card justify-content-center color="transparent" elevation="0">
          <v-container>
            <v-row
              ><v-col cols="12" md="7" lg="7">
                <v-row class="d-flex flex-column px-3 my-13">
                  <h1 class="display-4 black--text">---</h1>
                  <h1 class="mt-5 mb-0 black--text">N/V</h1>
                  <h4 class="black--text font-weight-light">N/V</h4>
                  <h3 class="mt-4"></h3>
                </v-row>
                <div class="text-center">
                  <p class="display-2 black--text font-weight-light">N/V</p>
                </div>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12" md="5" lg="5">
                <v-card
                  height="250px"
                  class="elevation-10"
                  dark
                  style="align-items: center; display: flex"
                >
                  <v-row class="px-10 text-uppercase">
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Max °</p>
                      <p class="white--text">N/V</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Min °</p>
                      <p class="white--text body-1">N/V</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Feels Like</p>
                      <p class="white--text body-1">N/V</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Humidity</p>
                      <p class="white--text body-1">N/V</p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-card>
    <v-card v-else>
      <v-toolbar dark class="fixed-bar">
        <v-btn icon dark @click="$emit('closeDialog')">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn
          dark
          text
          @click="dialog = true"
          class="white--text"
          v-if="
            !indexCountries.find((el) => el.countryName == country) &&
            !showCurrent
          "
        >
          Hinzufügen
        </v-btn>
      </v-toolbar>
      <v-dialog v-model="dialog" max-width="1000">
        <AddFavorite
          @closeDialog="dialog = false"
          @saveAndColor="sendToFavorite"
        />
      </v-dialog>
      <v-container fluid :style="`background-color: ${background}`">
        <v-card justify-content-center color="transparent" elevation="0">
          <v-container>
            <v-row
              ><v-col cols="12" md="7" lg="7">
                <v-img
                  class="mt-5 mx-auto"
                  :src="newJson.imageWeather"
                  width="100px"
                />
                <v-row class="d-flex flex-column px-3 my-13">
                  <h1 class="display-4 white--text">
                    {{ newJson.currentWeather }}
                  </h1>

                  <h1 class="mt-5 mb-0 white--text">
                    {{ newJson.countryName }}
                  </h1>
                  <h4 class="white--text font-weight-light">
                    {{ newJson.timeofCity }}
                  </h4>
                  <h3 class="mt-4"></h3>
                </v-row>
                <div class="text-center">
                  <p class="display-2 white--text font-weight-light">
                    {{ newJson.description }}
                  </p>
                </div>
              </v-col>
              <v-divider></v-divider>
              <v-col cols="12" md="5" lg="5">
                <v-card
                  height="250px"
                  class="elevation-10"
                  dark
                  style="align-items: center; display: flex"
                >
                  <v-row class="px-10 text-uppercase">
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Max °</p>
                      <p class="white--text">{{ newJson.tmax }}</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Min °</p>
                      <p class="white--text body-1">{{ newJson.tmin }}</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Feels Like</p>
                      <p class="white--text body-1">{{ newJson.feelsLike }}</p>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                      <p class="details mb-0 caption">Humidity</p>
                      <p class="white--text body-1">{{ newJson.humidity }}</p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { bus } from '../main';
import AddFavorite from '@/components/AddFavorite.vue';
export default {
  name: 'App',

  props: {
    country: {
      type: String,
    },
    indexCountries: {
      type: Array,
    },
    currentCity: {
      type: String,
    },
    showCurrent: {
      type: Boolean,
    },
  },

  data: () => ({
    background: '',
    sunset: '',
    sunrise: '',
    zoneName: '',
    imageWeather: null,
    currentWeather: '',
    countryName: '',
    timeofCity: '',
    description: '',
    search: '',
    openweatherKey: '52293b43835f810dfe6fc255311d9794',
    feelsLike: '',
    tmin: '',
    tmax: '',
    humidity: '',
    dialog: false,
    timeZoneKey: 'UKLC5A0XX12Q',
    newJson: {},
    lat: '',
    long: '',
    notFound: false,
    value: 1,
    busCountry: null,
  }),
  async created() {
    bus.$on('changeIt', async (data) => {
      this.busCountry = data;
      await this.getWeatherOfCountry(this.busCountry);
    });
    if (this.busCountry == null) {
      await this.getWeatherOfCountry(this.country);
    }
  },

  // mounted() {
  //   this.$nextTick(function () {
  //     window.setInterval(async () => {
  //       await this.getWeatherOfCountry();

  //       console.log('Minute vergangen');
  //     }, 1000 * 60);
  //     window.setInterval(async () => {
  //       this.getTime(this.zoneName);
  //     }, 1000);
  //   });
  // },
  methods: {
    sendToFavorite(color) {
      this.newJson.color = color;
      this.$emit('addFavorite', this.newJson);
      this.dialog = false;
    },
    async getWeatherOfCountry(country) {
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${this.openweatherKey}`;
      // if (!response.ok) {
      //   // this.clickMethod = false;
      //   this.message = 'Can not read Position';
      // }
      // else {
      const response = await fetch(api);

      if (!response.ok) {
        this.notFound = true;
        console.log('etwas schiefgelaufen');
      } else {
        const json = await response.json();
        await this.getWeather(json);
      }
      // this.waiting = false;
      // }
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
      const api = `https://api.timezonedb.com/v2.1/get-time-zone?key=UKLC5A0XX12Q&format=json&by=position&lat=${this.lat}&lng=${this.long}`;

      const response = await fetch(api);

      if (!response.ok) {
        this.notFound = true;
        console.log('etwas schiefgelaufen');
      } else {
        const json = await response.json();
        this.zoneName = json.zoneName;
        return json.zoneName;
      }
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

      this.lat = json.coord.lat;
      this.long = json.coord.lon;
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
  components: {
    AddFavorite,
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
