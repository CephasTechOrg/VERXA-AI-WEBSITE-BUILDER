import api from './api'

export const uploadAPI = {
    uploadImage: async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        return api.post('/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

export default uploadAPI
