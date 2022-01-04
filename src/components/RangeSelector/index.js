import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Stroke from '#/assets/icons/stroke.svg'
import './style.scss';

const RangeSelector = ({ options, handleSelectedRange, selectedOption,...props }) => {

  const [value, setValue] = React.useState(0);

  const onSliderChange = rangeValue => {
    setValue(rangeValue);
    handleSelectedRange(rangeValue, options);
  };

  return (
    <div className="range-selector">
      <div className="row justify-content-between range">
        {options && options.map(option => (
          <div className="text-center item" key={option.scale}>
            <p className={`text-small ${selectedOption === option.scale && 'text-blue'}`}>{option.option}</p>
          </div>
        ))}
      </div>
      <div className="row justify-content-between range">
        {options && options.map(option => (
          <div className="text-center item pb-3" key={option.scale}>
            <img src={Stroke} alt="stroke" />
          </div>
        ))}
      </div>
      <Slider
        min={0}
        max={100}
        trackStyle={[{
          backgroundColor: '#3A4080'
        }]}
        handleStyle={{
          backgroundColor: "#044472",
          border: 0
        }}
        value={value}
        onChange={onSliderChange}
      />
    </div>
  )
}

export default RangeSelector;
