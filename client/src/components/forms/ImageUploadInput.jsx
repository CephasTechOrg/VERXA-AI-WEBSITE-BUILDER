import React, { useRef, useState } from 'react'
import { uploadAPI } from '../../services/uploadService'
import { useApp } from '../../contexts/AppContext'
import './ImageUploadInput.css'

const ImageUploadInput = ({
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    hint
}) => {
    const fileRef = useRef(null)
    const { actions } = useApp()
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setError('')
        setUploading(true)
        try {
            const response = await uploadAPI.uploadImage(file)
            const data = response.data || response?.data?.data || response
            const payload = data?.data || data
            if (payload?.url) {
                onChange(payload.url)
                if (actions?.registerAsset) {
                    actions.registerAsset(payload)
                }
            } else {
                throw new Error('Upload failed, no URL returned')
            }
        } catch (err) {
            setError(err.message || 'Upload failed')
        } finally {
            setUploading(false)
            if (event?.target) {
                event.target.value = ''
            }
        }
    }

    return (
        <div className="form-group full-width image-upload-input">
            <div className="image-upload-header">
                <label>{label}</label>
                <button
                    type="button"
                    className="btn btn-secondary btn-upload"
                    onClick={() => fileRef.current?.click()}
                    disabled={disabled || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled || uploading}
            />
            {hint && <div className="field-hint">{hint}</div>}
            {value && (
                <div className="image-preview">
                    <img src={value} alt="Preview" loading="lazy" />
                </div>
            )}
            {error && <div className="message error">{error}</div>}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    )
}

export default ImageUploadInput
