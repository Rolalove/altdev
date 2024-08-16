<script setup>
import { ref, onMounted } from 'vue'

const editorElement = ref(null)
const editorInstance = ref(null)

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'htmlContent'])

onMounted(async () => {
  const { default: Editor } = await import('@toast-ui/editor')
  await import('@toast-ui/editor/dist/toastui-editor.css')

  editorInstance.value = new Editor({
    el: editorElement.value,
    height: "65vh",
    initialEditType: 'markdown',
    placeholder: "What's on your mind?",
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
    const markdown = editorInstance.value.getMarkdown()
    const html = editorInstance.value.getHTML()
    emit('update:modelValue', markdown)
    emit('htmlContent', html)
  })
})
</script>

<template>
  <div ref="editorElement"></div>
</template>