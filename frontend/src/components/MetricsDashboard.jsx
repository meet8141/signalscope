import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot
} from 'recharts';
import { AnimatedCounter } from './AnimatedCounter';

const trainingData = [
  { epoch: 0, trainAcc: 0.873, valAcc: 0.888, trainLoss: 0.298, valLoss: 0.267, trainAUC: 0.945, valAUC: 0.960 },
  { epoch: 1, trainAcc: 0.899, valAcc: 0.891, trainLoss: 0.244, valLoss: 0.261, trainAUC: 0.963, valAUC: 0.961 },
  { epoch: 2, trainAcc: 0.907, valAcc: 0.886, trainLoss: 0.228, valLoss: 0.273, trainAUC: 0.968, valAUC: 0.958 },
  { epoch: 3, trainAcc: 0.912, valAcc: 0.903, trainLoss: 0.218, valLoss: 0.235, trainAUC: 0.971, valAUC: 0.967 },
  { epoch: 4, trainAcc: 0.914, valAcc: 0.888, trainLoss: 0.211, valLoss: 0.272, trainAUC: 0.972, valAUC: 0.957 },
  { epoch: 5, trainAcc: 0.919, valAcc: 0.894, trainLoss: 0.204, valLoss: 0.255, trainAUC: 0.974, valAUC: 0.962 },
  { epoch: 6, trainAcc: 0.926, valAcc: 0.905, trainLoss: 0.185, valLoss: 0.237, trainAUC: 0.979, valAUC: 0.968 },
  { epoch: 7, trainAcc: 0.928, valAcc: 0.906, trainLoss: 0.181, valLoss: 0.242, trainAUC: 0.980, valAUC: 0.968 },
  { epoch: 8, trainAcc: 0.931, valAcc: 0.905, trainLoss: 0.173, valLoss: 0.243, trainAUC: 0.982, valAUC: 0.966 },
  { epoch: 9, trainAcc: 0.932, valAcc: 0.906, trainLoss: 0.174, valLoss: 0.241, trainAUC: 0.981, valAUC: 0.967 }
];

const rocData = [
  { fpr: 0.0, tpr: 0.0, random: 0.0 },
  { fpr: 0.01, tpr: 0.50, random: 0.01 },
  { fpr: 0.03, tpr: 0.75, random: 0.03 },
  { fpr: 0.06, tpr: 0.85, random: 0.06 },
  { fpr: 0.11, tpr: 0.92, random: 0.11 },
  { fpr: 0.20, tpr: 0.96, random: 0.20 },
  { fpr: 0.40, tpr: 0.99, random: 0.40 },
  { fpr: 0.80, tpr: 1.0, random: 0.80 },
  { fpr: 1.0, tpr: 1.0, random: 1.0 }
];

const prData = [
  { recall: 0.0, precision: 1.0 },
  { recall: 0.2, precision: 0.995 },
  { recall: 0.4, precision: 0.985 },
  { recall: 0.6, precision: 0.970 },
  { recall: 0.8, precision: 0.940 },
  { recall: 0.9, precision: 0.900 },
  { recall: 0.95, precision: 0.850 },
  { recall: 0.98, precision: 0.750 },
  { recall: 1.0, precision: 0.450 }
];

const operatingPointData = [
  { threshold: 0.0, tpr: 1.0, fpr: 1.0 },
  { threshold: 0.1, tpr: 0.99, fpr: 0.40 },
  { threshold: 0.3, tpr: 0.97, fpr: 0.20 },
  { threshold: 0.545, tpr: 0.92, fpr: 0.11 },
  { threshold: 0.7, tpr: 0.88, fpr: 0.08 },
  { threshold: 0.9, tpr: 0.75, fpr: 0.04 },
  { threshold: 1.0, tpr: 0.05, fpr: 0.0 }
];

const f1Data = [
  { class: "fake", score: 0.91 },
  { class: "real", score: 0.90 }
];

const aucData = [
  { "epoch": 0, "Training AUC": 0.9455, "Validation AUC": 0.9596 },
  { "epoch": 1, "Training AUC": 0.9636, "Validation AUC": 0.9604 },
  { "epoch": 2, "Training AUC": 0.9681, "Validation AUC": 0.9579 },
  { "epoch": 3, "Training AUC": 0.9708, "Validation AUC": 0.9665 },
  { "epoch": 4, "Training AUC": 0.9726, "Validation AUC": 0.9573 },
  { "epoch": 5, "Training AUC": 0.9744, "Validation AUC": 0.9621 },
  { "epoch": 6, "Training AUC": 0.9787, "Validation AUC": 0.9676 },
  { "epoch": 7, "Training AUC": 0.9797, "Validation AUC": 0.9684 },
  { "epoch": 8, "Training AUC": 0.9815, "Validation AUC": 0.9665 },
  { "epoch": 9, "Training AUC": 0.9813, "Validation AUC": 0.9666 }
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-black border border-white/20 p-3 rounded-md shadow-lg text-sm text-off-white">
        <p className="font-mono mb-2">{`Value: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function MetricsDashboard() {
  const chartProps = {
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  const gridStroke = "#ffffff20";
  const textColor = "#ffffff90";

  return (
    <div className="w-full bg-stone-black/50 border border-white/5 p-4 sm:p-8 rounded-3xl overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-serif text-off-white mb-6 sm:mb-8 text-center sm:text-left">Model Evaluation Metrics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Training Accuracy */}
        <div className="h-72">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Training vs Validation Accuracy</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainingData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="epoch" stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis domain={[0.85, 1.0]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="trainAcc" stroke="#D4F268" name="Train Acc" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="valAcc" stroke="#3b82f6" name="Val Acc" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training Loss */}
        <div className="h-72">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Training vs Validation Loss</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainingData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="epoch" stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis domain={[0.1, 0.35]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="trainLoss" stroke="#ef4444" name="Train Loss" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="valLoss" stroke="#f97316" name="Val Loss" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Training vs Validation ROC-AUC */}
        <div className="h-72">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Training vs Validation ROC-AUC</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aucData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="epoch" type="number" ticks={[0, 2, 4, 6, 8]} domain={[0, 9]} stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis domain={['dataMin - 0.005', 'dataMax + 0.005']} stroke={textColor} tick={{ fontSize: 12 }} tickFormatter={(val) => val.toFixed(3)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingBottom: '10px' }} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="Training AUC" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="Validation AUC" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ROC Curve */}
        <div className="h-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-acid-lime tracking-widest uppercase">ROC Curve</h3>
            <span className="text-xs font-mono text-off-white/60">ROC-AUC = <AnimatedCounter value="0.9690" /> | Op Point = <AnimatedCounter value="0.545" /></span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="fpr" type="number" domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis dataKey="tpr" type="number" domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="tpr" stroke="#D4F268" name="TPR (Recall)" strokeWidth={3} dot={false} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="linear" dataKey="random" stroke="#f97316" strokeDasharray="5 5" name="Random" strokeWidth={1} dot={false} />
              <ReferenceDot x={0.11} y={0.92} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PR Curve */}
        <div className="h-72">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-mono text-acid-lime tracking-widest uppercase">Precision-Recall Curve</h3>
            <span className="text-xs font-mono text-off-white/60">AP = <AnimatedCounter value="0.9633" /></span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="recall" type="number" domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis dataKey="precision" type="number" domain={[0.4, 1.05]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="precision" stroke="#8b5cf6" name="Precision" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Operating Point */}
        <div className="h-72">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Operating Point Selection</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={operatingPointData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="threshold" type="number" domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine x={0.545} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Thr=0.545', fill: '#ef4444', fontSize: 10 }} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="tpr" stroke="#3b82f6" name="TPR" strokeWidth={2} dot={false} />
              <Line isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" type="monotone" dataKey="fpr" stroke="#f97316" name="FPR" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Confusion Matrix (Custom Grid) */}
        <div className="h-72 flex flex-col">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Confusion Matrix</h3>
          <p className="text-xs text-off-white/50 mb-4 font-mono">Threshold = <AnimatedCounter value="0.545" /></p>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 font-mono text-[9px] sm:text-xs text-center text-off-white/70 flex-grow">
            <div></div>
            <div className="bg-white/5 p-1 sm:p-2 rounded flex items-center justify-center font-bold">Predicted Fake</div>
            <div className="bg-white/5 p-1 sm:p-2 rounded flex items-center justify-center font-bold">Predicted Real</div>

            <div className="bg-white/5 p-1 sm:p-2 rounded flex items-center justify-center font-bold">Actual Fake</div>
            <div className="bg-stone-black border border-acid-lime/30 text-acid-lime rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(212,242,104,0.1)] p-2">
              <span className="text-xl sm:text-3xl font-serif"><AnimatedCounter value="13541" /></span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-off-white/50 mt-1">True Positive</span>
            </div>
            <div className="bg-stone-black border border-red-500/30 text-red-400 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.1)] p-2">
              <span className="text-xl sm:text-3xl font-serif"><AnimatedCounter value="1624" /></span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-off-white/50 mt-1">False Negative</span>
            </div>

            <div className="bg-white/5 p-1 sm:p-2 rounded flex items-center justify-center font-bold">Actual Real</div>
            <div className="bg-stone-black border border-red-500/30 text-red-400 rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.1)] p-2">
              <span className="text-xl sm:text-3xl font-serif"><AnimatedCounter value="1009" /></span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-off-white/50 mt-1">False Positive</span>
            </div>
            <div className="bg-stone-black border border-acid-lime/30 text-acid-lime rounded-xl flex flex-col items-center justify-center shadow-[0_0_15px_rgba(212,242,104,0.1)] p-2">
              <span className="text-xl sm:text-3xl font-serif"><AnimatedCounter value="12156" /></span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-wider text-off-white/50 mt-1">True Negative</span>
            </div>
          </div>
        </div>

        {/* F1 Bar Chart */}
        <div className="h-72">
          <h3 className="text-sm font-mono text-acid-lime mb-4 tracking-widest uppercase">Per-Class F1 Score</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={f1Data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="class" stroke={textColor} tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 1]} stroke={textColor} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#ffffff10' }} content={<CustomTooltip />} />
              <Bar isAnimationActive={true} animationDuration={3000} animationEasing="ease-out" dataKey="score" fill="#D4F268" barSize={200} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
