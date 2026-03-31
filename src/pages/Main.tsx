import { useMemo } from 'react';

import { formatDate, getTodayDate, DATE_FORMAT } from '@/utils';
import { Container } from '@@/layout/Container';
import { DoubleColumnLayout } from '@@/layout/DoubleColumnLayout';
import { SectionHeader } from '@@/layout/SectionHeader';
import { Badge } from '@@/ui/Badge';
import { TimerPanel } from '@@@/timer/components/TimerPanel';
import { useTimerSession } from '@@@/timer/useTimerSession';
import { TodoPanel } from '@@@/todo/components/TodoPanel';
import { useTodoStore } from '@@@/todo/useTodoStore';

const panelClassName = 'flex flex-col items-center  h-full w-full rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
const panelHeadingRowClassName = 'flex items-start w-full justify-between';
const panelHeadingClassName = 'text-2xl font-bold gray-900';

export default function Main() {
    const {
        isRunning,
        hasStarted,
        sessionType,
        sessionIndicatorFilledCount,
        timerParts,
        timerProgress,
        handleToggleTimer,
        handleRequestStopTimer,
        completedSets,
    } = useTimerSession();

    const todayDate = getTodayDate();
    const today = formatDate(todayDate, DATE_FORMAT.display);
    const todos = useTodoStore((state) => state.todos);
    const todayTodos = useMemo(() => todos.filter((todo) => todo.assignedDate === todayDate), [todayDate, todos]);
    const completedTodoCount = todayTodos.filter((todo) => todo.checked).length;
    const totalTodoCount = todayTodos.length;

    return (
        <main>
            <Container>
                <SectionHeader title={today} />

                <DoubleColumnLayout className='flex-1'>
                    <section className={`${panelClassName} relative`}>
                        <div className={panelHeadingRowClassName}>
                            <h2 className={panelHeadingClassName}>TODAY</h2>
                            <Badge label={`${completedSets}set`} />
                        </div>
                        <TimerPanel
                            hasStarted={hasStarted}
                            isRunning={isRunning}
                            sessionType={sessionType}
                            sessionIndicatorFilledCount={sessionIndicatorFilledCount}
                            timerMinutes={timerParts.minutes}
                            timerSeconds={timerParts.seconds}
                            tomatoProgress={timerProgress}
                            onRequestStop={handleRequestStopTimer}
                            onToggleTimer={handleToggleTimer}
                        />
                    </section>
                    <section className={`${panelClassName} relative`}>
                        <div className={panelHeadingRowClassName}>
                            <h2 className={panelHeadingClassName}>TODO</h2>
                            <Badge label={`${completedTodoCount}/${totalTodoCount}`} />
                        </div>
                        <TodoPanel className='mt-5' tone='default' />
                    </section>
                </DoubleColumnLayout>
            </Container>
        </main>
    );
}
