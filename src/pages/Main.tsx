import { SectionHeader, DoubleColumnLayout, Container } from '@@/layout';
import { Badge } from '@@/ui';
import { TimerPanel, useTimerSession } from '@@@/timer';
import { TodoPanel } from '@@@/todo';

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
    } = useTimerSession();

    return (
        <main>
            <Container>
                <SectionHeader title='2026. 03. 18' />

                <DoubleColumnLayout className='flex-1'>
                    <section className={`${panelClassName} relative`}>
                        <div className={panelHeadingRowClassName}>
                            <h2 className={panelHeadingClassName}>TODAY</h2>
                            <Badge label='0set' />
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
                            <Badge label='1/3' />
                        </div>
                        <TodoPanel className='mt-5' tone='default' />
                    </section>
                </DoubleColumnLayout>
            </Container>
        </main>
    );
}
