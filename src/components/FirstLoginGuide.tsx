import { BookOpen, ChevronLeft, ChevronRight, FileCheck2, GraduationCap, Map, PlaneTakeoff, X } from 'lucide-react';
import { useState } from 'react';

const guideSteps = [
  {
    eyebrow: 'Start Here',
    title: 'Your Private Pilot roadmap',
    icon: PlaneTakeoff,
    body: 'Flight training can feel scattered at first. This app organizes the path into four phases so you can see what matters now, what is waiting, and what comes next.',
    points: ['Track real progress', 'Keep study tools close', 'Use the roadmap as your next-step guide']
  },
  {
    eyebrow: 'Phase 1',
    title: 'Foundation',
    icon: BookOpen,
    body: 'Build your starting base with ground school classes, medical planning, early flight instruction, and steady study habits.',
    points: ['Log ground school classes', 'Book and pass your medical', 'Begin flight instruction', 'Start studying with cards and tests']
  },
  {
    eyebrow: 'Phase 2',
    title: 'Pre-Solo',
    icon: GraduationCap,
    body: 'Prepare for the requirements and confidence checks that normally come before your first solo circuit.',
    points: ['Pass PSTAR', 'Pass ROC-A', 'Receive your Student Pilot Permit', 'Record your first solo milestone']
  },
  {
    eyebrow: 'Phase 3',
    title: 'Advanced Flight Training',
    icon: Map,
    body: 'Stretch beyond the local pattern into navigation, cross-country planning, instrument basics, and solo cross-country work.',
    points: ['Plan longer routes', 'Practice navigation decisions', 'Track cross-country requirements', 'Build pilot judgment']
  },
  {
    eyebrow: 'Phase 4',
    title: 'Final Testing And Licensing',
    icon: FileCheck2,
    body: 'Bring the training record together for the written exam, flight test recommendation, practical flight test, and licence application.',
    points: ['Prepare for the PPAER written', 'Get instructor sign-off', 'Complete the flight test', 'Submit the licence package']
  }
];

export const FirstLoginGuide = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const current = guideSteps[step];
  const Icon = current.icon;
  const isLast = step === guideSteps.length - 1;

  return <div className="first-login-guide" role="dialog" aria-modal="true" aria-labelledby="first-login-guide-title">
    <section className="first-login-card">
      <button className="first-login-skip" onClick={onClose} aria-label="Close introduction"><X size={17} />Skip</button>
      <div className="first-login-progress"><span>{step + 1}</span><em>of {guideSteps.length}</em></div>
      <div className="first-login-visual" aria-hidden="true">
        <span className="first-login-orbit" />
        <Icon size={44} />
      </div>
      <div className="first-login-copy">
        <span className="eyebrow">{current.eyebrow}</span>
        <h2 id="first-login-guide-title">{current.title}</h2>
        <p>{current.body}</p>
      </div>
      <div className="first-login-points">
        {current.points.map((point) => <span key={point}>{point}</span>)}
      </div>
      <div className="first-login-footer">
        <div className="first-login-dots" aria-hidden="true">
          {guideSteps.map((item, index) => <span className={index === step ? 'active' : ''} key={item.title} />)}
        </div>
        <div className="first-login-actions">
          {step > 0 && <button className="first-login-secondary" onClick={() => setStep(step - 1)}><ChevronLeft size={17} />Back</button>}
          <button className="first-login-primary" onClick={() => isLast ? onClose() : setStep(step + 1)}>
            {isLast ? 'Enter the cockpit' : 'Next'}{!isLast && <ChevronRight size={17} />}
          </button>
        </div>
      </div>
    </section>
  </div>;
};
