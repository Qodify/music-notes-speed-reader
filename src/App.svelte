<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export const prerender = true;
  let input;
  let img;
  let index = 0;
  let imagesSources = [];
  let timerSet = 2.0;
  let elapsed = 0;
  let duration = 0.0000001;
  let inputvalue;
  let originalImageSource;

  let last_time = window.performance.now();
  let frame;
  let first = true;

  onDestroy(() => {
    cancelAnimationFrame(frame);
  });

  function fillImageSourceArray(input, imageSources) {
    for (const file of input.files) {
      imageSources.push(URL.createObjectURL(file));
    }
  }

  function Stop() {
    index = -1;
    img.src = "";
    document.location.reload();
  }

  function StartSetup(randomized) {
    if (!originalImageSource) {
      originalImageSource = imagesSources;
    }
    duration = timerSet * 1000;
    index = 0;
    fillImageSourceArray(input, imagesSources);
    if (randomized) imagesSources.sort((a, b) => 0.5 - Math.random());
    showNextImage(randomized);
  }

  function showNextImage(randomized) {
    if (index === -1) {
      return;
    }

    if (!imagesSources[index]) {
      index = 0;
    }

    img.src = imagesSources[index];

    if (!imagesSources[index + 1]) {
      index = 0;
      if (randomized) imagesSources.sort((a, b) => 0.5 - Math.random());
    } else {
      index++;
    }
    if (first) {
      setTimeout(() => updateTime(true)), timerSet * 1000;
    } else {
      updateTime(true);
    }
    setTimeout(() => showNextImage(randomized), timerSet * 1000);
  }

  function updateTime(reset) {
    const time = window.performance.now();
    elapsed += Math.min(time - last_time, duration - elapsed);
    last_time = time;
    if (reset) elapsed = 0;
  }

  (function update() {
    frame = requestAnimationFrame(update);
    updateTime(false);
  })();

  $: {
    duration = timerSet * 1000;
  }
  let hide = false;
  function Hide() {
    if (hide) hide = false;
    else hide = true;
  }
</script>

<div style="padding-left: 12px;">
  <h1>music notes speed reader</h1>
  <div>
    upload files that are accompanied. only upload files from the same folder.
  </div>
  <div>
    train your sight reading skills by reading the notes, saying them out loud
    or in silence.
  </div>

  <div>Adjust the time between images to your reading speed.</div>
  <br />
  <div>
    <label for="image_uploads">Choose images to upload (PNG, JPG)</label>
    <input
      bind:this={input}
      type="file"
      id="image_uploads"
      name="image_uploads"
      accept=".jpg, .jpeg, .png"
      multiple
      bind:value={inputvalue}
    />
    <p style="display: inline;">Time between images</p>
    <input
      type="number"
      step="0.1"
      id="totalAmt"
      min="1"
      max="10"
      bind:value={timerSet}
    />
  </div>
  <div>
    <button on:click={() => StartSetup(false)}>Start in sequence</button>
    <button on:click={() => StartSetup(true)}>Start random</button>
    <button on:click={Stop}>Reset</button>
    <button on:click={Hide}>(un)hide progressbar</button>
  </div>
  <progress hidden={hide} value={elapsed / duration} />
  <div>
    <img bind:this={img} alt="" />
  </div>
</div>
