<script lang="ts">
    import { editor } from "monaco-editor";
    import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
    import { onDestroy, onMount } from "svelte";

    export let originalURL: string;
    export let modifiedURL: string;

    let target: HTMLDivElement;

    let originalModel: ReturnType<typeof editor.createModel>;
    let modifiedModel: ReturnType<typeof editor.createModel>;
    let diffEditor: ReturnType<typeof editor.createDiffEditor>;

    const load = async () => {
        const [original, modified] = await Promise.all([
            fetch(originalURL).then((res) => res.text()),
            fetch(modifiedURL).then((res) => res.text()),
        ]);
        // @ts-ignore
        self.MonacoEnvironment = { getWorker: () => new tsWorker() };

        originalModel ??= editor.createModel(original, "javascript");
        originalModel.setValue(original);

        modifiedModel ??= editor.createModel(modified, "javascript");
        modifiedModel.setValue(modified);

        diffEditor ??= editor.createDiffEditor(target, {
            // You can optionally disable the resizing
            enableSplitViewResizing: true,
            // Render the diff inline
            renderSideBySide: false,
        });
        diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
    };

    $: if (target && originalURL && modifiedURL) load();

    onDestroy(() => {
        diffEditor?.dispose();
    });
</script>

<div bind:this={target}></div>

<style>
    div {
        height: 100%;
    }
</style>
