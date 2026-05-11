import { useLayoutEffect, useState } from 'react';
import LeftNav from '../components/Navigation/LeftNav';
import TrustCenterContent from '../components/TrustCenter/TrustCenterContent';
import DesignerStagingToolbar from '../components/Settings/DesignerStagingToolbar';
import RightPanel from '../components/Settings/RightPanel';

export default function DesignerPage() {
  const [leftNavCollapsed, setLeftNavCollapsed] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<'draft' | 'published'>('draft');

  /** Lock document scroll: only the center/right columns scroll inside the shell, not the window. */
  useLayoutEffect(() => {
    const html = document.documentElement;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1] flex min-h-0 flex-col overflow-hidden bg-primary-100">
      <div className="flex min-h-0 w-full flex-1">
        <LeftNav
          collapsed={leftNavCollapsed}
          onToggleCollapse={() => setLeftNavCollapsed(!leftNavCollapsed)}
        />

        {/* Staging strip sits above the center preview only so it centers over the Trust Center workspace. */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 min-w-0 flex-1 flex-row">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <DesignerStagingToolbar workspaceTab={workspaceTab} onWorkspaceTabChange={setWorkspaceTab} />
              <div className="min-h-0 flex-1 overflow-y-auto">
                <TrustCenterContent workspaceTab={workspaceTab} onWorkspaceTabChange={setWorkspaceTab} />
              </div>
            </div>
            <RightPanel workspaceTab={workspaceTab} onWorkspaceTabChange={setWorkspaceTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
