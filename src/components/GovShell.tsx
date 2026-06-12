import { ClipboardCheck } from "lucide-react";

type GovShellProps = {
  children: React.ReactNode;
  packetCount: number;
  modeLabel: string;
};

export function GovShell({ children, packetCount, modeLabel }: GovShellProps) {
  return (
    <div className="gov-shell">
      <header className="gov-header">
        <div className="masthead-inner">
          <div className="agency-lockup">
            <div className="agency-mark">
              <ClipboardCheck aria-hidden="true" />
            </div>
            <div>
              <p>Alcohol and Tobacco Tax and Trade Bureau</p>
              <h1>Label Review Workbench</h1>
              <span>AI-assisted triage for beverage alcohol label applications</span>
            </div>
          </div>
          <aside className="system-card" aria-label="Prototype system status">
            <div>
              <strong>{packetCount} review packets</strong>
              <span>{modeLabel}</span>
            </div>
          </aside>
        </div>
      </header>
      {children}
      <footer className="gov-footer">
        <section className="footer-identity">
          <div className="agency-mark small">
            <ClipboardCheck aria-hidden="true" />
          </div>
          <div>
            <p>Label Review Workbench</p>
            <strong>Source, setup, and prototype assumptions are documented in the repository.</strong>
          </div>
        </section>
      </footer>
    </div>
  );
}
