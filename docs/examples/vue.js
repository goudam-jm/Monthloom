import { createApp, ref, shallowRef, computed } from 'vue';
import { Calendar, getWeekdayLabels } from '../lib/index.js';

createApp({
  setup() {
    const month = shallowRef(new Calendar(new Date()));
    const selected = ref('');
    const weeks = computed(() => month.value.getWeeks({ weekStartsOn: 1 }));
    const title = computed(() => `${month.value.getMonthString()} ${month.value.getYear()}`);
    const labels = getWeekdayLabels({ weekStartsOn: 1 });
    return { month, selected, weeks, title, labels };
  },
  template: `
    <div class="recipe-nav">
      <button type="button" aria-label="Previous month" :disabled="month.getYear() === 1 && month.getMonth() === 0" @click="month = month.previous()">Previous</button>
      <span aria-live="polite">{{ title }}</span>
      <button type="button" aria-label="Next month" :disabled="month.getYear() === 9999 && month.getMonth() === 11" @click="month = month.next()">Next</button>
    </div>
    <table class="custom-grid">
      <caption>{{ title }}</caption>
      <thead><tr><th v-for="(label, index) in labels" :key="index" scope="col">{{ label }}</th></tr></thead>
      <tbody><tr v-for="(week, row) in weeks" :key="row"><td v-for="(date, col) in week" :key="col">
        <button v-if="date" type="button" :aria-label="date.toDateString()" :aria-pressed="selected === date.toDateString()" @click="selected = date.toDateString()">{{ date.getDate() }}</button>
      </td></tr></tbody>
    </table>
    <p role="status">{{ selected || 'Choose a date. Selection belongs to Vue state.' }}</p>`
}).mount('#app');
