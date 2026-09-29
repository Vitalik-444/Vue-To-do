const { createApp, ref, computed, watch } = Vue;
const KEY = 'vue-todo-forest';
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(d)) return d; } catch (e) {}
  return [
    { id: 1, text: 'Drink a glass of water', color: 'spruce', done: true },
    { id: 2, text: 'Do the one important thing', color: 'fern', done: false },
    { id: 3, text: 'Take a walk outside', color: 'moss', done: false }
  ];
}
createApp({
  setup() {
    const todos = ref(load());
    const text = ref('');
    const color = ref('fern');
    const filter = ref('all');
    const colors = [
      { id: 'fern', name: 'Fern' }, { id: 'moss', name: 'Moss' },
      { id: 'bark', name: 'Bark' }, { id: 'spruce', name: 'Spruce' }
    ];
    const filters = [{ id: 'all', name: 'All' }, { id: 'active', name: 'Active' }, { id: 'done', name: 'Done' }];
    const doneCount = computed(() => todos.value.filter(t => t.done).length);
    const percent = computed(() => todos.value.length ? Math.round(doneCount.value / todos.value.length * 100) : 0);
    const shown = computed(() => todos.value.filter(t =>
      filter.value === 'all' || (filter.value === 'done' ? t.done : !t.done)));
    function add() {
      const v = text.value.trim();
      if (!v) return;
      todos.value.unshift({ id: Date.now(), text: v, color: color.value, done: false });
      text.value = '';
    }
    const remove = id => { todos.value = todos.value.filter(t => t.id !== id); };
    const clearDone = () => { todos.value = todos.value.filter(t => !t.done); };
    watch(todos, v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }, { deep: true });
    return { todos, text, color, filter, colors, filters, doneCount, percent, shown, add, remove, clearDone };
  }
}).mount('#app');
