<script lang="ts">
    import type { DiffResult } from "../../../types";
    import Editor from "./Editor.svelte";

    const diffs = Promise.all(
        ["scratch-vm.json", "scratch-gui.json"]
            .map((diff) => `./diffs/${diff}`)
            .map((url) =>
                fetch(url).then((res) => res.json() as Promise<DiffResult[]>),
            ),
    );

    const dirname = (file: string) =>
        file
            .substring(0, file.lastIndexOf("/"))
            .replace("./", "")
            .replace("prg-extension-boilerplate/packages/", "");

    const filename = (file: string) =>
        file.substring(file.lastIndexOf("/") + 1);

    let allowed: string[] = [];

    let currentDiff: DiffResult | null = null;
</script>

<div style:display="grid" style:grid-template-columns="1fr 2fr">
    <div>
        {#await diffs}
            <p>Loading...</p>
        {:then each}
            {@const results = each.flat()}
            {@const dirs = results.reduce(
                (set, { path1 }) => set.add(dirname(path1)),
                new Set(),
            )}
            {@const filtered = results
                .sort((x) => (x.type === "differ" ? -1 : 1))
                .filter(({ path1 }) => allowed.includes(dirname(path1)))}

            <select multiple bind:value={allowed}>
                {#each dirs as dir}
                    <option value={dir}>{dir}</option>
                {/each}
            </select>

            {#each filtered as result}
                {#if result.type === "differ"}
                    <div class:highlight={currentDiff?.path1 === result.path1}>
                        <h3>
                            {dirname(result.path1) +
                                "/" +
                                filename(result.path1)}
                            <br />
                            <button on:click={() => (currentDiff = result)}>
                                Show diff
                            </button>
                        </h3>
                    </div>
                {/if}
            {/each}
        {/await}
    </div>
    <div style:height="100vh">
        {#if currentDiff}
            <h3>
                {dirname(currentDiff.path1) + "/" + filename(currentDiff.path1)}
            </h3>
            <Editor
                originalURL={currentDiff.path1}
                modifiedURL={currentDiff.path2}
            />
        {/if}
    </div>
</div>

<style>
    select {
        height: 30vh;
    }

    .highlight {
        background-color: #f0f0f0;
    }
</style>
