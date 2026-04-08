import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { formatDate, getTodayDate, DATE_FORMAT } from '@/utils';

import { Container, DoubleColumnLayout, SectionHeader } from '@@/layout';
import { Badge } from '@@/ui';

import { TimerPanel, type ITimerControllerContext } from '@@@/timer';
import { TodoPanel, useTodoStore } from '@@@/todo';

const panelClassName = 'flex flex-col items-center  h-full w-full rounded-2xl bg-white px-6 py-5 shadow-shadow-1';
const panelHeadingRowClassName = 'flex items-start w-full justify-between';
const panelHeadingClassName = 'text-2xl font-bold gray-900';

export default function Main() {
    const { timerSession, handleToggleTimer, handleRequestStopTimer } = useOutletContext<ITimerControllerContext>();

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
                            <Badge label={`${timerSession.completedSets}set`} />
                        </div>
                        <TimerPanel
                            hasStarted={timerSession.hasStarted}
                            isRunning={timerSession.isRunning}
                            sessionType={timerSession.sessionType}
                            focusSessionInSet={timerSession.focusSessionInSet}
                            timerMinutes={timerSession.timerParts.minutes}
                            timerSeconds={timerSession.timerParts.seconds}
                            tomatoProgress={timerSession.progress}
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
