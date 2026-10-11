import { Clock3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';

export function TimelineControl() {
  const dispatch = useAppDispatch();

  const { timePoints, selectedTimeIndex } = useAppSelector((state) => ({
    timePoints: state.dataset?.timePoints ?? [],
    selectedTimeIndex: state.selectedTimeIndex,
  }));

  if (timePoints.length === 0) {
    return null;
  }

  const selectedTime = timePoints[selectedTimeIndex] ?? timePoints[0];

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock3 size={18} className="text-sky-400" />
          <h2 className="font-semibold">Временная шкала</h2>
        </div>

        <span className="rounded-md bg-slate-800 px-3 py-1 text-sm font-medium text-sky-300">
          {selectedTime.label}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={timePoints.length - 1}
        step={1}
        value={selectedTimeIndex}
        onChange={(event) => {
          dispatch({
            selectedTimeIndex: Number(event.target.value),
          });
        }}
        className="w-full cursor-pointer accent-sky-500"
        aria-label="Выбрать время отображения погоды"
      />

      <div className="mt-2 flex justify-between">
        {timePoints.map((point, index) => (
          <button
            key={point.id}
            type="button"
            onClick={() => dispatch({ selectedTimeIndex: index })}
            className={`text - sm transition - colors ${
    index === selectedTimeIndex
        ? 'font-semibold text-sky-300'
        : 'text-slate-500 hover:text-slate-200'
} `}
          >
            {point.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Выбери время, чтобы просмотреть погодные показатели за соответствующий час.
      </p>
    </section>
  );
}
