import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateConstants from './DateConstants';
import {getTitleString, getTodayTime} from '../util/';
import moment from 'moment';

function isSameDay(one, two) {
    return one && two && one.isSame(two, 'minutes');
}

function nearestPastMinutes(interval, someMoment) {
    const roundedMinutes = Math.floor(someMoment.minute() / interval) * interval;
    return someMoment.clone().minute(roundedMinutes).second(0);
}


function isNow(one, two) {
    return one && two && one.isSame(two, 'minutes')
}

function beforeCurrentMonthYear(current, today) {
    if (current.year() < today.year()) {
        return 1;
    }
    return current.year() === today.year() &&
        current.month() < today.month();
}

function afterCurrentMonthYear(current, today) {
    if (current.year() > today.year()) {
        return 1;
    }
    return current.year() === today.year() &&
        current.month() > today.month();
}

function getIdFromDate(date) {
    return `rc-calendar-${date.year()}-${date.month()}-${date.date()}`;
}


function getScrollToTime(tbody, time) {
    let start = moment().startOf('day').startOf('hour');

    let diff = time.diff(start, 'minutes') / 15;

    let viewPortHeight = tbody.clientHeight;
    let height = tbody.rows[0].clientHeight;

    let distanceToMiddle = Math.round(viewPortHeight / height / 2) * height;

    return height * diff - distanceToMiddle;

}

const TimeTBody = createReactClass({
    propTypes: {
        contentRender: PropTypes.func,
        dateRender: PropTypes.func,
        disabledDate: PropTypes.func,
        prefixCls: PropTypes.string,
        selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
        value: PropTypes.object,
        hoverValue: PropTypes.any,
        showWeekNumber: PropTypes.bool,
        numColumns: PropTypes.number,
        days: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.object)])

    },

    componentDidMount() {
        let now = nearestPastMinutes(15, moment());
        this.tbody.scrollTop = getScrollToTime(this.tbody, now);
    },

    getDefaultProps() {
        return {
            hoverValue: [],
        };
    },

    render() {
        const props = this.props;
        const {
            contentRender, prefixCls, selectedValue, value,
            showWeekNumber, dateRender, disabledDate,
            hoverValue, days, numColumns
        } = props;


        // value.add(1, 'day')


        let iIndex;
        let jIndex;
        let current;
        const dateTable = [];
        const today = nearestPastMinutes(15, getTodayTime(value))
        const cellClass = `${prefixCls}-cell`;
        const weekNumberCellClass = `${prefixCls}-week-number-cell`;
        const dateClass = `${prefixCls}-time`;
        const todayClass = `${prefixCls}-today`;
        const selectedClass = `${prefixCls}-selected-day`;
        const selectedDateClass = `${prefixCls}-selected-date`;  // do not move with mouse operation
        const selectedStartDateClass = `${prefixCls}-selected-start-date`;
        const selectedEndDateClass = `${prefixCls}-selected-end-date`;
        const inRangeClass = `${prefixCls}-in-range-cell`;
        const lastMonthDayClass = `${prefixCls}-last-month-cell`;
        const nextMonthDayClass = `${prefixCls}-next-month-btn-day`;
        const disabledClass = `${prefixCls}-disabled-cell`;
        const firstDisableClass = `${prefixCls}-disabled-cell-first-of-row`;
        const lastDisableClass = `${prefixCls}-disabled-cell-last-of-row`;
        // value.add(1);
        const month1 = value.clone().local()
        month1.startOf('day').startOf('hour')
        month1.day(0)//value.localeData().firstDayOfWeek());
        // const day = month1.day();
        // const lastMonthDiffDay = (day + 7 - value.localeData().firstDayOfWeek()) % 7;
        // calculate last month
        const lastMonth1 = month1.clone();
        // lastMonth1.add(0 - lastMonthDiffDay, 'days');

        let getNextDay = (i) => {

            const fn = Array.isArray(days) ?
                i => days[i].clone().startOf('day').startOf('hour') :
                i => {
                    let day = lastMonth1.clone().startOf('day').startOf('hour');
                    day.add(i, 'days');
                    return day;
                };

            getNextDay = fn;

            return fn(i);
        };

        let passed = 0;
        for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex++) {
            for (jIndex = 0; jIndex < numColumns; jIndex++) {
                current = getNextDay(jIndex);
                dateTable.push(current);
            }
        }
        const tableHtml = [];
        passed = 0;
        let mins = 15;

        for (iIndex = 0; iIndex < DateConstants.DATE_ROW_COUNT; iIndex++) {
            let isCurrentWeek;
            let weekNumberCell;
            let isActiveWeek = false;
            const dateCells = [];
            // if (showWeekNumber) {
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
                current = dateTable[passed].clone()
                // current.local()
                // current.startOf('day').startOf('hour')
                current.add(iIndex * mins, 'minutes');
                // current = dateTable[passed];
                if (jIndex < numColumns - 1) {
                    next = dateTable[passed + 1];
                }
                if (jIndex > 0) {
                    last = dateTable[passed - 1];
                }
                let cls = cellClass;
                let disabled = false;
                let selected = false;

                if (isNow(current, today)) {
                    cls += ` ${todayClass}`;
                    isCurrentWeek = true;
                }

                const isBeforeCurrentMonthYear = false// beforeCurrentMonthYear(current, value);
                const isAfterCurrentMonthYear = false//afterCurrentMonthYear(current, value);

                if (selectedValue && Array.isArray(selectedValue)) {
                    const rangeValue = hoverValue.length ? hoverValue : selectedValue;
                    if (!isBeforeCurrentMonthYear && !isAfterCurrentMonthYear) {
                        const startValue = rangeValue[0];
                        const endValue = rangeValue[1];
                        if (startValue) {
                            if (isSameDay(current, startValue)) {
                                selected = true;
                                isActiveWeek = true;
                                cls += ` ${selectedStartDateClass}`;
                            }
                        }
                        if (startValue && endValue) {
                            if (isSameDay(current, endValue)) {
                                selected = true;
                                isActiveWeek = true;
                                cls += ` ${selectedEndDateClass}`;
                            } else if (current.isAfter(startValue, 'day') &&
                                current.isBefore(endValue, 'day')) {
                                cls += ` ${inRangeClass}`;
                            }
                        }
                    }
                } else if (isNow(current, value)) {
                    // keyboard change value, highlight works
                    selected = true;
                    isActiveWeek = true;
                }

                if (isNow(current, selectedValue)) {
                    cls += ` ${selectedDateClass}`;
                }

                if (isBeforeCurrentMonthYear) {
                    cls += ` ${lastMonthDayClass}`;
                }
                if (isAfterCurrentMonthYear) {
                    cls += ` ${nextMonthDayClass}`;
                }

                if (disabledDate) {
                    if (disabledDate(current, value)) {
                        disabled = true;

                        if (!last || !disabledDate(last, value)) {
                            cls += ` ${firstDisableClass}`;
                        }

                        if (!next || !disabledDate(next, value)) {
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
                if (dateRender && dateRender(current, value, jIndex)) {
                    console.log(jIndex)
                    dateHtml = dateRender(current, value, jIndex);
                } else {
                    const content = contentRender ? contentRender(current, value) : current.format('HH:mm');
                    dateHtml = (
                        <div
                            key={getIdFromDate(current)}
                            className={dateClass}
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
                        title={getTitleString(current)}
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
                        [`${prefixCls}-current-week`]: isCurrentWeek,
                        [`${prefixCls}-active-week`]: isActiveWeek,
                    })}
                >
                    {weekNumberCell}
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