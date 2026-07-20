import { GraduationCap, RadioTower, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { PstarView } from '../pstar/PstarView';
import { RocaView } from '../roca/RocaView';
import type { GroundSchoolData } from '../../types';

type TestingMode = 'pstar' | 'roca';

const testingModes: Array<{ id: TestingMode; label: string; summary: string; icon: LucideIcon }> = [
  { id: 'pstar', label: 'PSTAR', summary: 'Transport Canada student pilot permit practice', icon: GraduationCap },
  { id: 'roca', label: 'ROC-A', summary: 'Aeronautical radio operator practice', icon: RadioTower }
];

export const TestingView = ({ data, onDataChange, initialMode = 'pstar' }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void; initialMode?: TestingMode }) => {
  const [mode, setMode] = useState<TestingMode>(initialMode);

  return <section className="testing-page">
    <div className="testing-header">
      <div>
        <span className="eyebrow">Ground School Testing</span>
        <h2>Practice Exams</h2>
        <p>PSTAR and ROC-A practice are grouped here.</p>
      </div>
    </div>
    <div className="testing-tabs" role="tablist" aria-label="Testing sections">
      {testingModes.map((item) => {
        const Icon = item.icon;
        return <button
          aria-selected={mode === item.id}
          className={mode === item.id ? 'testing-tab active' : 'testing-tab'}
          key={item.id}
          onClick={() => setMode(item.id)}
          role="tab"
          type="button"
        >
          <Icon size={20} />
          <span>{item.label}</span>
          <small>{item.summary}</small>
        </button>;
      })}
    </div>
    {mode === 'pstar' ? <PstarView data={data} onDataChange={onDataChange} /> : <RocaView data={data} onDataChange={onDataChange} />}
  </section>;
};
