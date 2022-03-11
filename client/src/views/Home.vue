<template>
  <v-container fluid>
    <v-card justify-content-center color="transparent" elevation="0">
      <v-container>
        <v-row
          ><v-col cols="12" md="7" lg="7">
            <v-img
              class="mt-5 mx-auto"
              :src="json.imageWeather"
              width="100px"
            />
            <v-row class="d-flex flex-column px-3 my-13">
              <h1 class="display-4 white--text">
                {{ json.currentWeather }}
              </h1>
              <h1 class="mt-5 mb-0 white--text" v-if="json.found">
                {{ json.countryName }}
              </h1>
              <h1 class="mt-5 mb-0 white--text" v-else>
                {{ json.countryName }}
              </h1>
              <h4 class="white--text font-weight-light">
                {{ json.timeofCity }}
              </h4>
              <h3 class="mt-4"></h3>
            </v-row>
            <div class="text-center">
              <p class="display-2 white--text font-weight-light">
                {{ json.description }}
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
                  <p class="white--text">{{ json.tmax }}</p>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <p class="details mb-0 caption">Min °</p>
                  <p class="white--text body-1">{{ json.tmin }}</p>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <p class="details mb-0 caption">Feels Like</p>
                  <p class="white--text body-1">{{ json.feelsLike }}</p>
                </v-col>
                <v-col cols="6" class="pa-0">
                  <p class="details mb-0 caption">Humidity</p>
                  <p class="white--text body-1">{{ json.humidity }}</p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
// import AddFavorite from '@/components/AddFavorite.vue';
export default {
  components: {
    // AddFavorite,
  },
  name: 'Home',
  mounted: function () {
    if (this.json != null) {
      this.$nextTick(function () {
        window.setInterval(async () => {
          this.$emit('refreshWeather');
          console.log('Minute vergangen');
        }, 1000 * 60);
        window.setInterval(async () => {
          this.$emit('refreshTime');
          this.json.timeofCity = this.getTime(this.json.zoneName);
        }, 1000);
      });
    }
  },
  props: {
    json: {
      type: Object,
    },
    getTime: {
      type: Function,
    },
  },
};
</script>
