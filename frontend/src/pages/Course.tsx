import { NavLink, Outlet } from 'react-router-dom';

export const Course = (): JSX.Element => {
  const itemClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
      isActive
        ? 'border-shelf-ink bg-shelf-ink text-shelf-panel shadow-shelf-sm'
        : 'border-shelf-line/80 bg-shelf-panel/70 text-shelf-muted hover:bg-shelf-bg'
    }`;

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[24px] border border-shelf-line/90 bg-shelf-panel/80 p-5 shadow-shelf-sm backdrop-blur">
          <div>
            <h1 className="text-[30px] font-bold text-shelf-ink tracking-wide">课程</h1>
            <p className="mt-1 text-sm text-shelf-muted">
              这是所选教材下的课程页，包含课堂与全教材知识图谱两个子界面。
            </p>
          </div>

          <nav className="mt-6 space-y-3">
            <NavLink to="classroom" className={itemClassName}>
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[12px] font-bold ${
                      isActive
                        ? 'border-shelf-panel bg-shelf-panel text-shelf-ink'
                        : 'border-shelf-muted/40 bg-transparent text-shelf-muted'
                    }`}
                  >
                    {isActive ? '✓' : '○'}
                  </span>
                  <span>Classroom</span>
                </>
              )}
            </NavLink>

            <NavLink to="graph" className={itemClassName}>
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[12px] font-bold ${
                      isActive
                        ? 'border-shelf-panel bg-shelf-panel text-shelf-ink'
                        : 'border-shelf-muted/40 bg-transparent text-shelf-muted'
                    }`}
                  >
                    {isActive ? '✓' : '○'}
                  </span>
                  <span>全教材知识图谱</span>
                </>
              )}
            </NavLink>
          </nav>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </main>
  );
};