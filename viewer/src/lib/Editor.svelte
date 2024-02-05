<script lang="ts">
    import { editor } from "monaco-editor";
    import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
    import { onMount } from "svelte";

    export let originalURL: string;
    export let modifiedURL: string;

    let target: HTMLDivElement;

    $: if (target) {
    }

    onMount(async () => {
        const [original, modified] = await Promise.all([
            fetch(originalURL).then((res) => res.text()),
            fetch(modifiedURL).then((res) => res.text()),
        ]);
        // @ts-ignore
        self.MonacoEnvironment = { getWorker: () => new tsWorker() };

        const originalModel = editor.createModel(original, "typescript");
        const modifiedModel = editor.createModel(modified, "typescript");

        const diffEditor = editor.createDiffEditor(target, {
            // You can optionally disable the resizing
            enableSplitViewResizing: true,
            // Render the diff inline
            renderSideBySide: false,
        });
        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    });
</script>

<div bind:this={target}></div>

<style>
    div {
        height: 500px;
    }
</style>
