<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { CommonForm, type CommonFormCommand, type CommonFormConfig } from '@vunio/ui';

const COMMAND_MERGE_DELAY = 300;

const formData = ref({
  name: '',
  users: [] as Array<{ name: string }>,
});

const config: CommonFormConfig[] = [
  {
    field: 'name',
    label: '名称',
  },
  {
    field: 'users[0].name',
    label: '首位用户',
  },
];

const undoStack = shallowRef<CommonFormCommand[]>([]);
const redoStack = shallowRef<CommonFormCommand[]>([]);
const canUndo = computed(() => undoStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

function dispatchCommand(command: CommonFormCommand) {
  command.execute();

  const previousCommand = undoStack.value.at(-1);
  const isWithinMergeWindow =
    previousCommand && command.createdAt - previousCommand.updatedAt <= COMMAND_MERGE_DELAY;

  if (!isWithinMergeWindow || !previousCommand.merge(command)) {
    undoStack.value = [...undoStack.value, command];
  }

  redoStack.value = [];
}

function undo() {
  const command = undoStack.value.at(-1);
  if (!command) return;

  command.undo();
  undoStack.value = undoStack.value.slice(0, -1);
  redoStack.value = [...redoStack.value, command];
}

function redo() {
  const command = redoStack.value.at(-1);
  if (!command) return;

  command.redo();
  redoStack.value = redoStack.value.slice(0, -1);
  undoStack.value = [...undoStack.value, command];
}
</script>

<template>
  <el-space style="margin-bottom: 16px">
    <!-- prettier-ignore -->
    <el-button :disabled="!canUndo" @click="undo">
      撤销
    </el-button>
    <!-- prettier-ignore -->
    <el-button :disabled="!canRedo" @click="redo">
      重做
    </el-button>
  </el-space>

  <CommonForm v-model="formData" :config="config" :command-dispatcher="dispatchCommand" />

  <pre>{{ formData }}</pre>
</template>
