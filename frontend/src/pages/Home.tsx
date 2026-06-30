import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { TextbookShelf } from '../components/TextbookShelf';
import {
  defaultTextbook,
  preparationResult,
  prepareSteps
} from '../mock/defaultTextbook';
import type { DefaultTextbook, PreparationResult, PrepareStatus } from '../types/textbook';

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [textbook, setTextbook] = useState<DefaultTextbook>(defaultTextbook);
  const [prepareStatus, setPrepareStatus] = useState<PrepareStatus>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [prepResult, setPrepResult] = useState<PreparationResult | null>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const runPrepareStep = useCallback((stepIndex: number) => {
    if (stepIndex >= prepareSteps.length) {
      // 备课完成
      setPrepareStatus('done');
      setCurrentStep(prepareSteps.length - 1);
      setPrepResult(preparationResult);
      setTextbook((prev) => ({ ...prev, status: 'prepared' }));
      return;
    }

    setCurrentStep(stepIndex);

    const delay = 600 + Math.random() * 300; // 600ms ~ 900ms
    timerRef.current = setTimeout(() => {
      runPrepareStep(stepIndex + 1);
    }, delay);
  }, []);

  const handlePrepare = useCallback(() => {
    if (prepareStatus === 'preparing') return;

    setPrepareStatus('preparing');
    setCurrentStep(0);
    setPrepResult(null);
    setTextbook((prev) => ({ ...prev, status: 'preparing' }));

    // 延迟一点开始，让用户看到状态切换
    timerRef.current = setTimeout(() => {
      runPrepareStep(0);
    }, 300);
  }, [prepareStatus, runPrepareStep]);

  const handleEnterClassroom = useCallback(() => {
    navigate('/classroom');
  }, [navigate]);

  return (
    <TextbookShelf
      textbook={textbook}
      prepareStatus={prepareStatus}
      currentStep={currentStep}
      preparationResult={prepResult}
      onPrepare={handlePrepare}
      onEnterClassroom={handleEnterClassroom}
    />
  );
};
