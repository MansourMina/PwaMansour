<template>
  <v-container class="black">
    <v-row dense>
      <v-col cols="12">
        <v-card color="white">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">Mein Standort</v-card-title>
              <!-- <v-card-subtitle v-text="item.artist"></v-card-subtitle> -->
              <v-card-actions>
                <v-btn
                  class="ml-2"
                  fab
                  icon
                  right
                  @click="
                    setCurrent();
                    dialog = true;
                  "
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col v-for="(item, i) in countries" :key="i" cols="12">
        <v-card :color="item.color" dark>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                class="text-h5"
                v-text="item.countryName"
              ></v-card-title>
              <!-- <v-card-subtitle v-text="item.artist"></v-card-subtitle> -->
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-row>
                  <v-btn
                    class="ml-2"
                    fab
                    icon
                    right
                    @click="
                      passData(item.countryName);
                      dialog = true;
                    "
                  >
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                  <v-btn
                    class="ml-2 d-block text-center"
                    fab
                    icon
                    right
                    color="red darken-4"
                    @click="removeCountry(item.countryName)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    dark
                    text
                    fab
                    icon
                    right
                    color="black"
                    @click="colordialog = true"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-dialog v-model="colordialog" max-width="1000">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">Change color</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-color-picker
                            hide-canvas
                            hide-inputs
                            hide-sliders
                            class="ma-2"
                            :swatches="swatches"
                            show-swatches
                            v-model="newcolor"
                          ></v-color-picker>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="colordialog = false"
                        >
                          Close
                        </v-btn>
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="
                            updateColor(item);
                            colordialog = false;
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
              </v-card-actions>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col>
        <v-card color="transparent" dark elevation="0">
          <div class="d-flex justify-space-between">
            <v-card-title class="text-h5">C°</v-card-title>

            <v-spacer></v-spacer>
            <v-text-field
              label="search"
              v-model="country"
              @keyup.enter="
                dialog = true;
                passData(country);
              "
              required
            ></v-text-field>
            <v-btn
              class="ml-2"
              fab
              icon
              height="40px"
              right
              width="40px"
              :disabled="country.length == 0"
              @click="
                passData(country);
                dialog = true;
              "
            >
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-card-actions> </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      v-if="!offline"
    >
      <Search
        :currentCity="currentCity"
        :country="country"
        :indexCountries="countries"
        @closeDialog="
          dialog = false;
          showCurrent = false;
        "
        @addFavorite="addFavorite"
        :showCurrent="showCurrent"
      />
    </v-dialog>
    <!-- <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <Search :country="country" @closeDialog="dialog = false" />
    </v-dialog> -->
  </v-container>
</template>

<script>
import { bus } from '../main';
import Search from '@/components/Search.vue';
import { openDB } from 'idb';
export default {
  methods: {
    setCurrent() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          this.long = position.coords.longitude;
          this.lat = position.coords.latitude;

          const api = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.long}&appid=${this.openweatherKey}`;

          const response = await fetch(api);

          if (!response.ok) {
            // this.clickMethod = false;
            this.message = 'Can not read Position';
          } else {
            const json = await response.json();
            console.log(json.name);
            this.currentCity = json.name;
            this.passData(this.currentCity);
            this.showCurrent = true;

            // this.waiting = false;
          }
        });
        this.passData(this.currentCity);

        this.showCurrent = true;
      }
    },
    passData(country) {
      this.country = country;
      bus.$emit('changeIt', country);
    },
    async removeCountry(country) {
      await this.db.delete('countries', country);
      this.getCountries();
      navigator.vibrate(400);
    },
    async addFavorite(json) {
      await this.db.put('countries', json);
      this.getCountries();
      navigator.vibrate(400);
    },
    async getCountries() {
      this.countries = await this.db.getAll('countries');
    },
    async updateColor(country) {
      const tx = this.db.transaction('countries', 'readwrite');

      const obj = await this.db.get('countries', country.countryName);
      obj.color = this.newcolor;

      await this.db.put('countries', obj);
      await tx.done;

      this.getCountries();
    },
  },
  async created() {
    this.db = await openDB('favoriteCountriesDB');
    await this.getCountries();
  },
  data: () => ({
    newcolor: '',
    colordialog: false,
    swatches: [
      ['#550000', '#005500'],
      ['#AAAA00', '#555500'],
      ['#00AA00', '#005555'],
      ['#00FFFF', '#00AAAA'],
    ],
    showMessage: false,
    items: [
      {
        color: '#1F7087',
        src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        title: 'Paris',
        artist: '23.02.2022',
      },
      {
        color: '#952175',
        src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
        title: 'Vienna',
        artist: '23.02.2022',
      },
    ],
    dialog: false,
    showCurrent: false,
    country: '',
    openweatherKey: '52293b43835f810dfe6fc255311d9794',

    countries: [],
    db: null,
  }),
  components: {
    Search,
  },
  props: {
    json: {
      type: Object,
    },
    getTime: {
      type: Function,
    },
    offline: {
      type: Boolean,
    },
    currentCity: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped></style>
