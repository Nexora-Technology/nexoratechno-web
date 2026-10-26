// Original CSS artwork from the mockup; shown until (or instead of) the published cover loads.
export const PROJECT_ART = [
  {
    className: 'ledger-art',
    label: 'CORE SYSTEMS / FINTECH',
    art: (
      <div className="ledger-diagram">
        <div className="node node-top">USD / VND</div>
        <div className="ledger-core">
          <span className="mono">THE SOURCE OF TRUTH</span>
          <strong>
            Ledger<span>Core</span>
          </strong>
          <span className="core-dot" />
        </div>
        <div className="node node-left">
          IMMUTABLE
          <br />
          JOURNALS
        </div>
        <div className="node node-right">
          RECONCILIATION
          <br />
          ENGINE
        </div>
        <div className="node node-bottom">DOUBLE-ENTRY / BY DESIGN</div>
      </div>
    ),
  },
  {
    className: 'vision-art',
    label: 'APPLIED AI / COMPUTER VISION',
    art: (
      <div className="road-scene">
        <div className="road">
          <span />
          <span />
          <span />
        </div>
        <div className="scan-box">
          <span className="mono">ROAD MARKING</span>
          <i />
        </div>
        <div className="vision-crosshair">+</div>
        <span className="vision-tag mono">FRAME ANALYSIS / ONNX</span>
      </div>
    ),
  },
  {
    className: 'travel-art',
    label: 'TRAVEL / MULTI-AGENT AI',
    art: (
      <div className="travel-map">
        <svg viewBox="0 0 500 300" aria-hidden="true">
          <path d="M50 240Q120 50 220 150T450 60" fill="none" stroke="#82631e" strokeWidth="2" strokeDasharray="6 7" />
          <circle cx="50" cy="240" r="8" fill="#82631e" />
          <circle cx="220" cy="150" r="8" fill="#82631e" />
          <circle cx="450" cy="60" r="8" fill="#82631e" />
        </svg>
        <div className="travel-card">
          <span className="mono">YOUR NEXT CHAPTER</span>
          <strong>
            Somewhere
            <br />
            extraordinary.
          </strong>
          <span>Explore → Plan → Go</span>
        </div>
      </div>
    ),
  },
  {
    className: 'platform-art',
    label: 'ENTERPRISE / BUILT FOR OURSELVES',
    art: (
      <div className="platform-ui">
        <aside>
          <b>n.</b>
          <span>Overview</span>
          <span>People</span>
          <span>Pipeline</span>
          <span>Finance</span>
        </aside>
        <div className="platform-main">
          <span className="mono">ONE CONNECTED WORKSPACE</span>
          <h4>A clearer picture.</h4>
          <div className="mini-metrics">
            <span>
              People<strong>Connected</strong>
            </span>
            <span>
              Business<strong>In sync</strong>
            </span>
          </div>
          <div className="chart-bars">
            {Array.from({ length: 11 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <span className="mono">HRMS ↔ CRM ↔ CONTRACTS ↔ FINANCE</span>
        </div>
      </div>
    ),
  },
];

export const PROJECT_META = [
  { tag: '01 / FINTECH · BACKEND · DATA', layout: 'project-wide' },
  { tag: '02 / AI · INFRASTRUCTURE · JAPAN', layout: 'project-offset' },
  { tag: '03 / TRAVEL · WEB · MOBILE · AI', layout: '' },
  { tag: '04 / ENTERPRISE · .NET · NEXT.JS', layout: 'project-wide project-offset' },
];
