import React from 'react';
import './index.css';

function rangeSlider({ min, max, value, onChange }) {
  return (
    <div className="slider">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <h1>{value}&#176;</h1>
    </div>
  );
}

export default rangeSlider;
