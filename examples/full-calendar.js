/* eslint react/no-multi-comp:0, no-console:0 */

import 'rc-calendar/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from 'rc-calendar/src/FullCalendar';

import 'rc-select/assets/index.css';
import Select from 'rc-select';

import zhCN from 'rc-calendar/src/locale/zh_CN';
import enUS from 'rc-calendar/src/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function onSelect(value) {
  console.log('select', value.format(format));
}

function getData(value) {

}

class Demo extends React.Component {
  state = {
    type: 'time',
  };

  onTypeChange = (type) => {
    this.setState({
      type,
    });
  }
  headerRender = () => {
    return <div>yay</div>
  }

  dateCellRender = (date, value, index) => {
    if (index === 1 && date.isSameOrAfter('2018-02-26 13:00', 'minutes') && date.isSameOrBefore('2018-02-26 14:00', 'minutes')) {

      return <div style={{
        background: 'beige',
        position: 'absolute',
        bottom: -15,
        left: 0,
        right: 0,
        top: -14,
        zIndex: 1000


      }}>
<span style={{position: 'absolute', top: 5, left: 5}}>

        {date.isSame('2018-02-26 13:00', 'minutes') ? 'Hair dresser' : ''}
</span>

      </div>
    }

    else  if (index === 2 && date.isSameOrAfter('2018-02-26 11:00', 'minutes') && date.isSameOrBefore('2018-02-26 11:30', 'minutes')) {

      return <div style={{
        background: 'pink',
        position: 'absolute',
        bottom: -15,
        left: 0,
        right: 0,
        top: -14,
        zIndex: 1000


      }}>
<span style={{position: 'absolute', top: 5, left: 5}}>

        {date.isSame('2018-02-26 11:00', 'minutes') ? 'Wax machine' : ''}
</span>

      </div>
    }
    return false

  }

  render() {
    return (
      <div style={{zIndex: 1000, position: 'relative', height: 1000}}>
        {/*<FullCalendar*/}
        {/*style={{ margin: 10 }}*/}
        {/*Select={Select}*/}
        {/*fullscreen={false}*/}
        {/*onSelect={onSelect}*/}
        {/*defaultValue={now}*/}
        {/*locale={cn ? zhCN : enUS}*/}
        {/*/>*/}
        <FullCalendar
          style={{margin: 10}}
          Select={Select}
          fullscreen
          days={[moment(), moment(), moment()]}
          dayHeadRender={this.headerRender}
          timeCellRender={this.dateCellRender}
          defaultValue={now}
          onSelect={onSelect}
          type={this.state.type}
          onTypeChange={this.onTypeChange}
          locale={cn ? zhCN : enUS}
          selectedValue={[now.clone().subtract(10, 'day'), now.clone()]}
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo/>, document.getElementById('__react-content'));
