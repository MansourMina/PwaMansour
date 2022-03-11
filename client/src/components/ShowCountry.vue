<template>
  <v-card>
    <v-toolbar dark class="fixed-bar">
      <v-btn icon dark @click="$emit('closeDialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" max-width="1000">
        <template v-slot:activator="{ on, attrs }">
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false" v-bind="attrs" v-on="on">
              Hinzufügen
            </v-btn>
          </v-toolbar-items>
        </template>
        <AddFavorite @closeDialog="dialog = false" @saveAndColor="newJson" />
      </v-dialog>
    </v-toolbar>
    <Search :country="country" />
    {{ country }}
  </v-card>
</template>

<script>
import Search from '@/components/Search.vue';
import AddFavorite from '@/components/AddFavorite.vue';
import { openDB } from 'idb';

export default {
  data() {
    return {
      dialog: false,
      db: null,
    };
  },
  components: {
    Search,
    AddFavorite,
  },
  props: {
    json: {
      type: Object,
    },
    country: {
      type: String,
    },
  },
  methods: {
    newJson(color) {
      this.newJson = this.json;
      this.newJson.color = color;
      this.$emit('addFavorite', this.newJson);
      this.dialog = false;
    },
  },
  async created() {
    this.db = await openDB('favoriteCountriesDB', 1, {
      upgrade(db) {
        db.createObjectStore('countries', { keyPath: 'countryName' });
      },
    });

    // try {
    //   console.log(
    //     'Hallo',
    //     await this.db.get('countries', this.json.countryName),
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
  },
};
</script>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky;
  top: 0rem;
  z-index: 1;
}
</style>
