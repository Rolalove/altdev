<script setup >
import Editor from '@toast-ui/editor'
import "@toast-ui/editor/dist/toastui-editor.css"
const props =defineProps({
    modelValue:{
        type:String,
        required:false ,
        default : '',
    }
    
})
const emit =defineEmits(['update:modelValue'])

const editor = ref()
onMounted(() => {
    const editorInstance = new Editor({
    el: editor.value,
    height: "500px",
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    events:{
        change:() => emit('update:modelValue', editorInstance.getMarkdown())
    },
    toolbarItems:[
        ['heading','bold','italic'],
        ['hr', 'quote']
    ]
});
})


</script>
<template >
    <div class='bg-blue-500 w-full ' >
      
    <div ref="editor" ></div>
    bggggggggggggggggggggggggg
       
    </div>
</template>