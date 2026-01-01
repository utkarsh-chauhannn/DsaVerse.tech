import React, { useEffect, useMemo, useRef, useState } from 'react';
import Array3D from '../components/Array3D';
import Controls from '../components/Controls';
import Explanation from '../components/Explanation';
import { bubbleSortSteps } from '../algorithms/bubbleSort';
import { quickSortSteps } from '../algorithms/quickSort';
import { mergeSortSteps } from '../algorithms/mergeSort';
import { insertionSortSteps } from '../algorithms/insertionSort';
import { selectionSortSteps } from '../algorithms/selectionSort';
import { heapSortSteps } from '../algorithms/heapSort';
import { shellSortSteps } from '../algorithms/shellSort';
import { countingSortSteps } from '../algorithms/countingSort';
import { radixSortSteps } from '../algorithms/radixSort';
import { combSortSteps } from '../algorithms/combSort';
import { bucketSortSteps } from '../algorithms/bucketSort';
import { cocktailSortSteps } from '../algorithms/cocktailSort';
import { gnomeSortSteps } from '../algorithms/gnomeSort';
import { pancakeSortSteps } from '../algorithms/pancakeSort';

const Visualizer = () => {
  const defaultArray = useMemo(() => [5, 3, 8, 4, 2, 7, 1, 6], []);
  const [array, setArray] = useState(defaultArray);
  const [comparison, setComparison] = useState([]);
  const [swap, setSwap] = useState([]);
  const [pivot, setPivot] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubbleSort');

  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(8);
  const [seed, setSeed] = useState('1');
  const [preset, setPreset] = useState('random');
  const [customArrayInput, setCustomArrayInput] = useState('');

  const [frames, setFrames] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepDescription, setStepDescription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const [metrics, setMetrics] = useState({
    comparisons: 0,
    swaps: 0,
    writes: 0
  });

  const playTimerRef = useRef(null);

  const stepsGenerator = useMemo(() => {
    return {
      bubbleSort: bubbleSortSteps,
      quickSort: quickSortSteps,
      mergeSort: mergeSortSteps,
      insertionSort: insertionSortSteps,
      selectionSort: selectionSortSteps,
      heapSort: heapSortSteps,
      shellSort: shellSortSteps,
      countingSort: countingSortSteps,
      radixSort: radixSortSteps,
      combSort: combSortSteps,
      bucketSort: bucketSortSteps,
      cocktailSort: cocktailSortSteps,
      gnomeSort: gnomeSortSteps,
      pancakeSort: pancakeSortSteps
    };
  }, []);

  const applyFrame = (frame) => {
    if (!frame) return;
    setArray(frame.array ?? []);
    setComparison(frame.comparison ?? []);
    setSwap(frame.swap ?? []);
    setPivot(frame.pivot ?? []);
    setStepDescription(frame.description ?? '');
  };

  const computeMetrics = (nextFrames) => {
    const acc = { comparisons: 0, swaps: 0, writes: 0 };
    for (const frame of nextFrames) {
      if (frame.type === 'compare') acc.comparisons += 1;
      if (frame.type === 'swap') acc.swaps += 1;
      if (frame.type === 'write') acc.writes += 1;
    }
    return acc;
  };
  
  const stopPlayback = () => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  const handleStart = () => {
    stopPlayback();

    const generator = stepsGenerator[algorithm] || stepsGenerator.bubbleSort;
    const nextFrames = generator(array);
    setFrames(nextFrames);
    setMetrics(computeMetrics(nextFrames));

    setIsRunning(true);
    setStepIndex(0);
    applyFrame(nextFrames[0]);
    setIsPlaying(true);
  };

  const handleReset = () => {
    stopPlayback();
    setIsRunning(false);
    setFrames([]);
    setStepIndex(0);
    setStepDescription('');
    setComparison([]);
    setSwap([]);
    setPivot([]);
    setArray(defaultArray);
  };

  const handleGenerateArray = (newArray) => {
    stopPlayback();
    setIsRunning(false);
    setFrames([]);
    setStepIndex(0);
    setStepDescription('');
    setArray(newArray);
    setComparison([]);
    setSwap([]);
    setPivot([]);
  };

  const handleStepTo = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, frames.length - 1));
    setStepIndex(safeIndex);
    applyFrame(frames[safeIndex]);
  };

  const handleNext = () => {
    stopPlayback();
    if (!frames.length) return;
    handleStepTo(stepIndex + 1);
  };

  const handlePrev = () => {
    stopPlayback();
    if (!frames.length) return;
    handleStepTo(stepIndex - 1);
  };

  const handlePlayPause = () => {
    if (!frames.length) return;
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    stopPlayback();
    if (!frames.length) return;
    setIsRunning(true);
    handleStepTo(0);
  };

  const buildShareUrl = () => {
    const params = new URLSearchParams();
    params.set('algo', algorithm);
    params.set('arr', array.join(','));
    params.set('speed', String(speed));
    params.set('size', String(arraySize));
    params.set('seed', String(seed));
    params.set('preset', String(preset));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  const handleCopyShareLink = async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const parseArrayParam = (value) => {
    const parts = String(value)
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const numbers = parts
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
    if (!numbers.length) return null;
    return numbers.slice(0, 15).map((n) => Math.max(1, Math.min(99, Math.round(n))));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const algoParam = params.get('algo');
    const arrParam = params.get('arr');
    const speedParam = params.get('speed');
    const sizeParam = params.get('size');
    const seedParam = params.get('seed');
    const presetParam = params.get('preset');

    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem('dsa-visualizer-settings') || '{}');
      } catch {
        return {};
      }
    })();

    const nextAlgorithm = algoParam || saved.algorithm || 'bubbleSort';
    const nextSpeed = Number(speedParam || saved.speed || 500);
    const nextSize = Number(sizeParam || saved.arraySize || 8);
    const nextSeed = String(seedParam || saved.seed || '1');
    const nextPreset = String(presetParam || saved.preset || 'random');

    setAlgorithm(nextAlgorithm);
    setSpeed(Number.isFinite(nextSpeed) ? nextSpeed : 500);
    setArraySize(Number.isFinite(nextSize) ? nextSize : 8);
    setSeed(nextSeed);
    setPreset(nextPreset);

    const parsed = arrParam ? parseArrayParam(arrParam) : null;
    if (parsed) {
      setArray(parsed);
      setCustomArrayInput(parsed.join(', '));
    } else if (Array.isArray(saved.array) && saved.array.length) {
      setArray(saved.array);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const payload = {
      algorithm,
      speed,
      arraySize,
      seed,
      preset,
      array
    };
    try {
      localStorage.setItem('dsa-visualizer-settings', JSON.stringify(payload));
    } catch {
      // ignore storage failures
    }
  }, [algorithm, speed, arraySize, seed, preset, array]);

  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      return;
    }

    if (!frames.length) {
      setIsPlaying(false);
      setIsRunning(false);
      return;
    }

    if (stepIndex >= frames.length - 1) {
      setIsPlaying(false);
      setIsRunning(false);
      return;
    }

    playTimerRef.current = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        applyFrame(frames[next]);
        if (next >= frames.length - 1) {
          setIsPlaying(false);
          setIsRunning(false);
        }
        return next;
      });
    }, Math.max(50, Number(speed) || 500));

    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [isPlaying, stepIndex, frames, speed]);

  return (
    <div className="visualizer-container">
      <header className="visualizer-header">
        <h1>3D Sorting Visualizer</h1>
        <p>Watch sorting algorithms come to life in 3D</p>
      </header>

      <div className="visualizer-content">
        <div className="visualization-panel">
          <div className="algorithm-selector">
            <label>Algorithm: </label>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isRunning}
            >
              <option value="bubbleSort">Bubble Sort</option>
              <option value="quickSort">Quick Sort</option>
              <option value="mergeSort">Merge Sort</option>
              <option value="insertionSort">Insertion Sort</option>
              <option value="selectionSort">Selection Sort</option>
              <option value="heapSort">Heap Sort</option>
              <option value="shellSort">Shell Sort</option>
              <option value="countingSort">Counting Sort</option>
              <option value="radixSort">Radix Sort</option>
              <option value="combSort">Comb Sort</option>
              <option value="bucketSort">Bucket Sort</option>
              <option value="cocktailSort">Cocktail Sort</option>
              <option value="gnomeSort">Gnome Sort</option>
              <option value="pancakeSort">Pancake Sort</option>
            </select>
          </div>
          
          <Array3D 
            array={array} 
            comparison={comparison} 
            swap={swap} 
            pivot={pivot}
          />
          
          <Controls
            onStart={handleStart}
            onReset={handleReset}
            onGenerateArray={handleGenerateArray}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrev={handlePrev}
            onRestart={handleRestart}
            onCopyShareLink={handleCopyShareLink}
            isRunning={isRunning}
            isPlaying={isPlaying}
            speed={speed}
            setSpeed={setSpeed}
            arraySize={arraySize}
            setArraySize={setArraySize}
            seed={seed}
            setSeed={setSeed}
            preset={preset}
            setPreset={setPreset}
            customArrayInput={customArrayInput}
            setCustomArrayInput={setCustomArrayInput}
            stepIndex={stepIndex}
            totalSteps={frames.length}
            onStepTo={handleStepTo}
          />
        </div>

        <div className="explanation-panel">
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Run Stats</h3>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>
              <div>Comparisons: {metrics.comparisons}</div>
              <div>Swaps: {metrics.swaps}</div>
              <div>Writes: {metrics.writes}</div>
              <div>Step: {frames.length ? stepIndex + 1 : 0} / {frames.length || 0}</div>
              {stepDescription ? <div style={{ marginTop: '8px' }}>{stepDescription}</div> : null}
            </div>
          </div>
          <Explanation algorithm={algorithm} />
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
