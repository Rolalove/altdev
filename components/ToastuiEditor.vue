<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Editor } from '@toast-ui/editor'

const editorElement = ref<HTMLElement | null>(null)
const editorInstance = ref<Editor | null>(null)

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

onMounted(async () => {
  await nextTick() // Add this line
  const { default: ToastEditor } = await import('@toast-ui/editor')
  await import('@toast-ui/editor/dist/toastui-editor.css')

  if (editorElement.value) {
    editorInstance.value = new ToastEditor({
      el: editorElement.value,
      height: "65vh",
      initialEditType: 'markdown',
      placeholder: "What's on your mind Altdever",
      previewStyle: 'tab',
      initialValue: props.modelValue,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
      ]
    })

    editorInstance.value.on('change', () => {
      emit('update:modelValue', editorInstance.value!.getMarkdown())
    })
  }
})

// Expose methods to parent component
defineExpose({
  getMarkdown: () => editorInstance.value?.getMarkdown() || '',
  setMarkdown: (markdown: string) => editorInstance.value?.setMarkdown(markdown)
})
</script>

<template>
  <ClientOnly>
    <div ref="editorElement"></div>
  </ClientOnly>
</template>


})
</script>

<template>
  <div ref="editorElement"></div>
</template>
