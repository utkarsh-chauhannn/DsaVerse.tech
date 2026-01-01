import React from 'react';

const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const parseSeedToInt = (seedStr) => {
  const n = Number(seedStr);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(2147483647, Math.floor(n)));
};

const parseCustomArray = (input) => {
  const parts = String(input)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

  const nums = parts
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.max(1, Math.min(99, Math.round(n))));

  if (!nums.length) return null;
  return nums.slice(0, 15);
};

const Controls = ({
  onStart,
  onReset,
  onGenerateArray,
  onPlayPause,
  onNext,
  onPrev,
  onRestart,
  onCopyShareLink,
  isRunning,
  isPlaying,
  speed,
  setSpeed,
  arraySize,
  setArraySize,
  seed,
  setSeed,
  preset,
  setPreset,
  customArrayInput,
  setCustomArrayInput,
  stepIndex,
  totalSteps,
  onStepTo
}) => {
  const handleGenerateArray = () => {
    const rand = mulberry32(parseSeedToInt(seed));
    let newArray = Array.from({ length: arraySize }, () => Math.floor(rand() * 10) + 1);

    if (preset === 'sorted') {
      newArray = [...newArray].sort((a, b) => a - b);
    } else if (preset === 'reverse') {
      newArray = [...newArray].sort((a, b) => b - a);
    } else if (preset === 'nearly') {
      newArray = [...newArray].sort((a, b) => a - b);
      if (newArray.length >= 4) {
        const i = Math.floor(rand() * newArray.length);
        const j = Math.floor(rand() * newArray.length);
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }

    onGenerateArray(newArray);
    setCustomArrayInput(newArray.join(', '));
  };

  const handleUseCustomArray = () => {
    const parsed = parseCustomArray(customArrayInput);
    if (!parsed) return;
    onGenerateArray(parsed);
  };

  return (
    <div className="controls-container">
      <div className="control-group">
        <label htmlFor="arraySize">Array Size: {arraySize}</label>
        <input
          id="arraySize"
          type="range"
          min="3"
          max="15"
          value={arraySize}
          onChange={(e) => setArraySize(Number(e.target.value))}
          disabled={isRunning}
        />
      </div>

      <div className="control-group">
        <label htmlFor="speed">Speed: {speed}ms</label>
        <input
          id="speed"
          type="range"
          min="50"
          max="2000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>

      <div className="control-group">
        <label htmlFor="seed">Seed</label>
        <input
          id="seed"
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          disabled={isRunning}
          style={{ width: '100%' }}
        />
      </div>

      <div className="control-group">
        <label htmlFor="preset">Preset</label>
        <select
          id="preset"
          value={preset}
          onChange={(e) => setPreset(e.target.value)}
          disabled={isRunning}
          style={{ width: '100%' }}
        >
          <option value="random">Random</option>
          <option value="sorted">Sorted</option>
          <option value="reverse">Reverse</option>
          <option value="nearly">Nearly Sorted</option>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="customArray">Custom Array (comma-separated)</label>
        <input
          id="customArray"
          type="text"
          value={customArrayInput}
          onChange={(e) => setCustomArrayInput(e.target.value)}
          disabled={isRunning}
          placeholder="e.g. 5, 3, 8, 4"
          style={{ width: '100%' }}
        />
      </div>

      <div className="button-group">
        <button
          onClick={handleGenerateArray}
          disabled={isRunning}
          className="btn btn-secondary"
        >
          Generate Array
        </button>

        <button
          onClick={handleUseCustomArray}
          disabled={isRunning}
          className="btn btn-secondary"
        >
          Use Custom
        </button>
        
        <button
          onClick={onStart}
          disabled={isRunning}
          className="btn btn-primary"
        >
          Start Sort
        </button>

        <button
          onClick={onPlayPause}
          disabled={!totalSteps}
          className="btn btn-primary"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={onPrev}
          disabled={!totalSteps || stepIndex <= 0}
          className="btn btn-secondary"
        >
          Prev
        </button>

        <button
          onClick={onNext}
          disabled={!totalSteps || stepIndex >= totalSteps - 1}
          className="btn btn-secondary"
        >
          Next
        </button>

        <button
          onClick={onRestart}
          disabled={!totalSteps}
          className="btn btn-secondary"
        >
          Restart
        </button>
        
        <button
          onClick={onReset}
          disabled={isRunning}
          className="btn btn-danger"
        >
          Reset
        </button>

        <button
          onClick={onCopyShareLink}
          disabled={isRunning}
          className="btn btn-secondary"
        >
          Copy Share Link
        </button>
      </div>

      {totalSteps ? (
        <div className="control-group">
          <label htmlFor="stepSlider">Step: {stepIndex + 1} / {totalSteps}</label>
          <input
            id="stepSlider"
            type="range"
            min="1"
            max={totalSteps}
            value={stepIndex + 1}
            onChange={(e) => onStepTo(Number(e.target.value) - 1)}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Controls;
