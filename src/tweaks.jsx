import { useState } from 'react';
import { Icon } from './icons.jsx';
import { Seg } from './ui.jsx';

export const TWEAK_DEFAULTS = {
  lang: 'it',
  theme: 'light',
  density: 'cozy',
  empty: false,
};

export function TweaksPanel({ state, setState }) {
  const [visible, setVisible] = useState(false);

  const update = (patch) => setState(s => ({ ...s, ...patch }));

  return (
    <>
      <button className="tweaks-fab" onClick={() => setVisible(v => !v)} title="Tweaks">
        <Icon name="sliders" size={18} />
      </button>
      {visible && (
        <div className="tweaks-panel">
          <div className="hstack" style={{ justifyContent: 'space-between' }}>
            <div className="tweaks-title">Tweaks</div>
            <button className="icon-btn" onClick={() => setVisible(false)}><Icon name="close" size={14} /></button>
          </div>

          <div className="vstack" style={{ gap: 6 }}>
            <div className="stat-label">Lingua</div>
            <Seg value={state.lang} onChange={v => update({ lang: v })} options={[{value:'it',label:'IT'},{value:'en',label:'EN'}]} />
          </div>

          <div className="vstack" style={{ gap: 6 }}>
            <div className="stat-label">Tema</div>
            <Seg value={state.theme} onChange={v => update({ theme: v })} options={[{value:'light',label:'Light'},{value:'dark',label:'Dark'}]} />
          </div>

          <div className="vstack" style={{ gap: 6 }}>
            <div className="stat-label">Densità</div>
            <Seg value={state.density} onChange={v => update({ density: v })} options={[
              {value:'compact',label:'Compact'},
              {value:'cozy',label:'Cozy'},
              {value:'comfortable',label:'Comfortable'},
            ]} />
          </div>

          <div className="vstack" style={{ gap: 6 }}>
            <div className="stat-label">Stato nucleo</div>
            <Seg value={state.empty ? 'empty' : 'populated'} onChange={v => update({ empty: v === 'empty' })} options={[
              {value:'populated',label:'Popolato'},
              {value:'empty',label:'Vuoto'},
            ]} />
          </div>
        </div>
      )}
    </>
  );
}
