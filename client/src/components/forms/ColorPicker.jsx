import React, { useState } from 'react'
import './ColorPicker.css'

const ColorPicker = ({ value, onChange, label }) => {
    const [showPicker, setShowPicker] = useState(false)

    const presetColors = [
        '#3B82F6', // Blue
        '#EF4444', // Red
        '#10B981', // Green
        '#F59E0B', // Amber
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#84CC16', // Lime
        '#F97316', // Orange
        '#6366F1', // Indigo
        '#14B8A6', // Teal
        '#84CC16'  // Emerald
    ]

    const handleColorSelect = (color) => {
        onChange(color)
        setShowPicker(false)
    }

    const handleCustomColor = (e) => {
        onChange(e.target.value)
    }

    return (
        <div className="color-picker">
            <label className="color-picker-label">{label}</label>
            <div className="color-picker-container">
                <div
                    className="color-preview"
                    style={{ backgroundColor: value || '#3B82F6' }}
                    onClick={() => setShowPicker(!showPicker)}
                >
                    {!value && <span>Pick Color</span>}
                </div>

                {showPicker && (
                    <div className="color-picker-popup">
                        <div className="preset-colors">
                            {presetColors.map((color, index) => (
                                <button
                                    key={index}
                                    className="color-option"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorSelect(color)}
                                    title={color}
                                />
                            ))}
                        </div>

                        <div className="custom-color-section">
                            <label>Custom Color:</label>
                            <input
                                type="color"
                                value={value || '#3B82F6'}
                                onChange={handleCustomColor}
                                className="custom-color-input"
                            />
                            <input
                                type="text"
                                value={value || ''}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder="#3B82F6"
                                className="color-hex-input"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowPicker(false)}
                            className="close-picker-btn"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ColorPicker