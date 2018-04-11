import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TimeConstants from './TimeConstants';
import {getTimeTitleString, getTodayTime} from '../util/';
import moment from 'moment';


function nearestPastMinutes(interval, date) {
    const roundedMinutes = Math.floor(date.minute() / interval) * interval;
    return date.clone().minute(roundedMinutes).second(0);
}

function isNow(one, two) {
    return one && two && one.isSame(two, 'minutes')
}

function beforeCurrentDayWeek(current, today) {
    if (current.week() < today.week()) {
        return 1;
    }
    return current.week() === today.week() &&
        current.day() < today.day();
}

function afterCurrentDayWeek(current, today) {
    if (current.week() > today.week()) {
        return 1;
    }
    return current.week() === today.week() &&
        current.day() > today.day();
}

function getIdFromDate(date) {
    return `rc-calendar-${date.year()}-${date.month()}-${date.date()}`;
}


function getScrollToTime(tbody, time, timeInterval) {
    let start = moment().startOf('day').startOf('hour');

    let diff = time.diff(start, 'minutes') / timeInterval;

    let viewPortHeight = tbody.clientHeight;
    let height = tbody.rows[0].clientHeight;

    let distanceToMiddle = Math.round(viewPortHeight / height / 2) * height;

    return height * diff - distanceToMiddle;

}

const TimeTBody = createReactClass({
    propTypes: {
        contentRender: PropTypes.func,
        timeRender: PropTypes.func,
        disabledTime: PropTypes.func,
        prefixCls: PropTypes.string,
        selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
        value: PropTypes.object,
        hoverValue: PropTypes.any,
        // showWeekNumber: PropTypes.bool,
        numColumns: PropTypes.number,
        days: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.object)]),
        timeInterval: PropTypes.number

    },

    componentDidMount() {
        const {timeInterval} = this.props;
        let now = nearestPastMinutes(timeInterval, moment());
        this.tbody.scrollTop = getScrollToTime(this.tbody, now, timeInterval);
    },

    getDefaultProps() {
        return {
            hoverValue: [],
            timeInterval: 15
        };
    },

    render() {
        const props = this.props;
        const {
            contentRender, prefixCls, selectedValue, value,
            timeRender, disabledTime,
            hoverValue, days, numColumns, timeInterval
        } = props;

        let rowCount = 24 * 60 / timeInterval;
        let iIndex;
        let jIndex;
        let current;
        const dateTable = [];
        const now = nearestPastMinutes(timeInterval, getTodayTime(value))
        const cellClass = `${prefixCls}-cell`;
        // const weekNumberCellClass = `${prefixCls}-week-number-cell`;
        const timeClass = `${prefixCls}-time`;
        const nowClass = `${prefixCls}-now`;
        const selectedClass = `${prefixCls}-selected-now`;
        const selectedTimeClass = `${prefixCls}-selected-time`;  // do not move with mouse operation
        const selectedStartTimeClass = `${prefixCls}-selected-start-time`;
        const selectedEndTimeClass = `${prefixCls}-selected-end-time`;
        const inRangeClass = `${prefixCls}-in-range-cell`;
        const disabledClass = `${prefixCls}-disabled-cell`;
        const firstDisableClass = `${prefixCls}-disabled-cell-first-of-row`;
        const lastDisableClass = `${prefixCls}-disabled-cell-last-of-row`;

        const firstDay = value.clone().local();
        // firstDay.startOf('week');

        let getNextDay = (i) => {

            const fn = Array.isArray(days) ?
                i => days[i].clone().startOf('day').startOf('hour') :
                i => {
                    let day = firstDay.clone().startOf('day').startOf('hour');
                    day.add(i, 'days');
                    return day;
                };

            getNextDay = fn;

            return fn(i);
        };

        let passed = 0;
        for (iIndex = 0; iIndex < rowCount; iIndex++) {
            for (jIndex = 0; jIndex < numColumns; jIndex++) {
                current = getNextDay(jIndex);
                dateTable.push(current);
            }
        }
        const tableHtml = [];
        passed = 0;

        for (iIndex = 0; iIndex < rowCount; iIndex++) {
            let isCurrentTime;
            // let weekNumberCell;
            let isActiveTime = false;
            const dateCells = [];
            // if (showWeekNumber) { //can be used for time side bar later on
            //     weekNumberCell = (
            //         <td
            //             key={dateTable[passed].week()}
            //             role="gridcell"
            //             className={weekNumberCellClass}
            //         >
            //             {dateTable[passed].hour()}
            //         </td>
            //     );
            // }
            for (jIndex = 0; jIndex < numColumns; jIndex++) {
                let next = null;
                let last = null;
                current = dateTable[jIndex].clone()
                current.add(iIndex * timeInterval, 'minutes');
                if (jIndex < numColumns - 1) {
                    next = dateTable[jIndex + 1];
                }
                if (jIndex > 0) {
                    last = dateTable[jIndex - 1];
                }
                let cls = cellClass;
                let disabled = false;
                let selected = false;

                if (isNow(current, now)) {
                    cls += ` ${nowClass}`;
                    isCurrentTime = true;
                }

                const isBeforeCurrentDayWeek = beforeCurrentDayWeek(current, value);
                const isAfterCurrentDayWeek = afterCurrentDayWeek(current, value);

                if (selectedValue && Array.isArray(selectedValue)) {
                    const rangeValue = hoverValue.length ? hoverValue : selectedValue;
                    if (!isBeforeCurrentDayWeek && !isAfterCurrentDayWeek) {
                        const startValue = rangeValue[0];
                        const endValue = rangeValue[1];
                        if (startValue) {
                            if (isNow(current, startValue)) {
                                selected = true;
                                isActiveTime = true;
                                cls += ` ${selectedStartTimeClass}`;
                            }
                        }
                        if (startValue && endValue) {
                            if (isNow(current, endValue)) {
                                selected = true;
                                isActiveTime = true;
                                cls += ` ${selectedEndTimeClass}`;
                            } else if (current.isAfter(startValue, 'minutes') &&
                                current.isBefore(endValue, 'minutes')) {
                                cls += ` ${inRangeClass}`;
                            }
                        }
                    }
                } else if (isNow(current, value)) {
                    // keyboard change value, highlight works
                    selected = true;
                    isActiveTime = true;
                }

                if (isNow(current, selectedValue)) {
                    cls += ` ${selectedTimeClass}`;
                }


                if (disabledTime) {
                    if (disabledTime(current, value)) {
                        disabled = true;

                        if (!last || !disabledTime(last, value)) {
                            cls += ` ${firstDisableClass}`;
                        }

                        if (!next || !disabledTime(next, value)) {
                            cls += ` ${lastDisableClass}`;
                        }
                    }
                }

                if (selected) {
                    cls += ` ${selectedClass}`;
                }

                if (disabled) {
                    cls += ` ${disabledClass}`;
                }

                let dateHtml;
                if (timeRender && timeRender(current, value, jIndex)) {
                    dateHtml = timeRender(current, value, jIndex);
                } else {
                    const content = contentRender ? contentRender(current, value) : current.format('HH:mm');
                    dateHtml = (
                        <div
                            key={getIdFromDate(current)}
                            className={timeClass}
                            aria-selected={selected}
                            aria-disabled={disabled}
                        >
                            {content}
                        </div>);
                }

                dateCells.push(
                    <td
                        key={passed}
                        onClick={disabled ? undefined : props.onSelect.bind(null, current)}
                        onMouseEnter={disabled ?
                            undefined : props.onDayHover && props.onDayHover.bind(null, current) || undefined}
                        role="gridcell"
                        title={getTimeTitleString(current)}
                        className={cls}
                        style={{width: `${100 / numColumns}%`}}
                    >
                        {dateHtml}
                    </td>);

                passed++;
            }


            tableHtml.push(
                <tr
                    key={iIndex}
                    role="row"
                    className={cx(`${prefixCls}-row`, {
                        [`${prefixCls}-current-time`]: isCurrentTime,
                        [`${prefixCls}-active-time`]: isActiveTime,
                    })}
                >
                    {/*{weekNumberCell}*/}
                    {dateCells}
                </tr>);
        }


        let tBody = (<tbody ref={tbody => this.tbody = tbody}
                            className={`${prefixCls}-time-tbody`}>
        {tableHtml}
        </tbody>);


        return tBody;
    },
});

export default TimeTBody;
