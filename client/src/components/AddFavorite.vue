<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Favorite</span>
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
          v-model="color"
        ></v-color-picker>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="$emit('closeDialog')">
        Close
      </v-btn>
      <v-btn color="blue darken-1" text @click="$emit('saveAndColor', color)">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
    },
    city: {
      type: String,
    },
  },
  data() {
    return {
      color: '',
      swatches: [
        ['#550000', '#005500'],
        ['#AAAA00', '#555500'],
        ['#00AA00', '#005555'],
        ['#00FFFF', '#00AAAA'],
      ],
    };
  },
  methods: {
    addFavorite() {},
  },
};
</script>

<style lang="scss" scoped></style>
