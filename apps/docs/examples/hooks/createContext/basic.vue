<template>
  <div class="demo">
    <div class="demo-title">
      Theme Context Example
    </div>

    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  </div>
</template>

<script setup>
import { createContext } from '@vunio/hooks';
import { computed, defineComponent, h, ref } from 'vue';
const [injectTheme, provideTheme] = createContext('ThemeProvider');
// Theme Provider Component
const ThemeProvider = defineComponent({
  name: 'ThemeProvider',
  setup(_, { slots }) {
    const mode = ref('light');
    const color = ref('blue');

    const toggleMode = () => {
      mode.value = mode.value === 'light' ? 'dark' : 'light';
    };

    const setColor = (newColor) => {
      color.value = newColor;
    };

    provideTheme({
      mode,
      color,
      toggleMode,
      setColor,
    });

    const themeClass = computed(() => mode.value);

    return () =>
      h(
        'div',
        {
          class: ['theme-wrapper', themeClass.value],
        },
        slots.default?.(),
      );
  },
});

// Theme Consumer Component
const ThemeConsumer = defineComponent({
  name: 'ThemeConsumer',
  setup() {
    const theme = injectTheme();

    return () =>
      h('div', { class: 'theme-consumer' }, [
        h('div', { class: 'info' }, [
          h('p', `Current Mode: ${theme.mode.value}`),
          h('p', `Current Color: ${theme.color.value}`),
        ]),
        h('div', { class: 'controls' }, [
          h(
            'button',
            {
              onClick: theme.toggleMode,
              class: 'btn-toggle',
            },
            `Switch to ${theme.mode.value === 'light' ? 'Dark' : 'Light'} Mode`,
          ),
          h('div', { class: 'color-picker' }, [
            h('span', 'Color: '),
            h(
              'select',
              {
                value: theme.color.value,
                onChange: (e) => theme.setColor(e.target.value),
              },
              [
                h('option', { value: 'blue' }, 'Blue'),
                h('option', { value: 'red' }, 'Red'),
                h('option', { value: 'green' }, 'Green'),
                h('option', { value: 'purple' }, 'Purple'),
              ],
            ),
          ]),
        ]),
      ]);
  },
});
</script>

<style scoped lang="scss">
.demo {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;

  .demo-title {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bold;
  }
}

:deep(.theme-wrapper) {
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s;

  &.light {
    color: #333;
    background: #fff;
    border: 1px solid #d9d9d9;

    select {
      color: #000;
      background: #fff;
    }
  }

  &.dark {
    color: #fff;
    background: #1f1f1f;
    border: 1px solid #434343;

    select {
      color: #fff;
      background: #1f1f1f;
    }
  }

  .theme-consumer {
    .info {
      margin-bottom: 16px;

      p {
        margin: 8px 0;
        font-size: 14px;

        &:first-child {
          font-weight: bold;
        }
      }
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .btn-toggle {
        padding: 10px 20px;
        color: white;
        cursor: pointer;
        background: #1890ff;
        border: none;
        border-radius: 4px;
        transition: background 0.3s;

        &:hover {
          background: #40a9ff;
        }
      }

      .color-picker {
        display: flex;
        gap: 10px;
        align-items: center;

        span {
          font-weight: 500;
        }

        select {
          padding: 6px 12px;
          cursor: pointer;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>
